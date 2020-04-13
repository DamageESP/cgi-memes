const express = require('express')
const https = require('https')
const cors = require('cors')
const path = require('path')
const mysql = require('mysql2/promise')
const fileUpload = require('express-fileupload')
const nodemailer = require('nodemailer')

const port = process.env.NODE_ENV === 'production' ? 80 : 8081

const validateEmail = email => email.split('@') && email.split('@')[1] === 'cgi.com'

const likeConfirmationMail = (memeTitle, actionId) => {
  return {
    subject: `${process.env.NODE_ENV !== 'production' ? '[DESARROLLO] ' : ''}Confirma tu like al meme "${memeTitle}"👍`,
    html: `<p>Completa el ciclo del amor ❤️, simplemente haz clic en este enlace! ➡️ <a href="${process.env.FRONT_URL}/#/confirm/${actionId}">Confirmar voto 🔗</a></p>`,
  }
}

const memeConfirmationMail = (memeTitle, actionId) => {
  return {
    subject: `${process.env.NODE_ENV !== 'production' ? '[DESARROLLO] ' : ''}Confirma tu meme "${memeTitle}" y empieza a hacer que lluevan los likes! 🍆`,
    html: `<p>¿Estás listo para ser el/la más popular de la ofi? Estás a un solo clic... entra en este enlace! ➡️ <a href="${process.env.FRONT_URL}/#/confirm/${actionId}">Confirmar meme</a></p>`,
  }
}

const deleteConfirmationMail = (memeTitle, actionId) => {
  return {
    subject: `${process.env.NODE_ENV !== 'production' ? '[DESARROLLO] ' : ''}💀❌ ELIMINA el meme "${memeTitle}" ❌💀`,
    html: `<p>Sin comentarios. Dale al link para terminar rápido. Y no me hables. ➡️ <a href="${process.env.FRONT_URL}/#/confirm/${actionId}">Eliminar meme 🔗</a></p>`,
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
})

// In-memory array to prevent race conditions with slow DB i/o
const peopleLiking = []
const peopleUploading = []

// Dirty DB init
pool.query('CREATE TABLE IF NOT EXISTS memes (`id` MEDIUMINT NOT NULL AUTO_INCREMENT, `src` VARCHAR(255) NOT NULL, `title` VARCHAR(255) NOT NULL, `authorName` VARCHAR(255) NOT NULL, `authorEmail` VARCHAR(255) NOT NULL, `createdAt` VARCHAR(255) NOT NULL, `confirmed` VARCHAR(255) NOT NULL, PRIMARY KEY (id))')

pool.query('CREATE TABLE IF NOT EXISTS meme_likes (`id` MEDIUMINT NOT NULL AUTO_INCREMENT, `memeId` MEDIUMINT NOT NULL, `voterEmail` VARCHAR(255) NOT NULL, `confirmed` VARCHAR(255) NOT NULL, `createdAt` VARCHAR(255) NOT NULL, PRIMARY KEY (id))')

pool.query('CREATE TABLE IF NOT EXISTS actions (`id` MEDIUMINT NOT NULL AUTO_INCREMENT, `itemId` MEDIUMINT NOT NULL, `type` VARCHAR(255) NOT NULL, `actionId` VARCHAR(255) NOT NULL, `createdAt` VARCHAR(255) NOT NULL, `consumedAt` VARCHAR(255), PRIMARY KEY (id))')

const app = express()

app.use(cors())


app.use(fileUpload({
  useTempFiles: true,
  tempFileDir : '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 },
}))

app.use(express.static(path.join(__dirname, '../public')))

const getMeme = async memeId => {
  
  const [[meme]] = await pool.query('SELECT SUM(IF(meme_likes.confirmed=1, 1, 0)) as likes, memes.id, memes.title, memes.src, memes.authorName, memes.authorEmail, memes.createdAt FROM memes  LEFT JOIN meme_likes ON memes.id = meme_likes.memeId WHERE memes.confirmed=1 AND memes.id=? GROUP BY memes.id', [memeId])
  if(!meme) return false
  meme.src = `https://${process.env.VIRTUAL_HOST}${meme.src}`
  return meme
}

const sendMail = async (email, type, memeTitle, actionId) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_ACCOUNT_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_ACCOUNT_PW // generated ethereal password
      }
    })

    if (type === 'upload') {
      await transporter.sendMail({
        from: `"CGI Memes 🍑" <${process.env.EMAIL_ACCOUNT_USERNAME}>`, // sender address
        to: process.env.NODE_ENV === 'production' ? email : process.env.EMAIL_ACCOUNT_USERNAME, // list of receivers
        ...memeConfirmationMail(memeTitle, actionId)
      })
    } else if (type === 'like') {
      await transporter.sendMail({
        from: `"CGI Memes 🍑" <${process.env.EMAIL_ACCOUNT_USERNAME}>`, // sender address
        to: process.env.NODE_ENV === 'production' ? email : process.env.EMAIL_ACCOUNT_USERNAME, // list of receivers
        ...likeConfirmationMail(memeTitle, actionId)
      })
    } else if (type === 'delete') {
      await transporter.sendMail({
        from: `"CGI Memes 🍑" <${process.env.EMAIL_ACCOUNT_USERNAME}>`, // sender address
        to: process.env.NODE_ENV === 'production' ? email : process.env.EMAIL_ACCOUNT_USERNAME, // list of receivers
        ...deleteConfirmationMail(memeTitle, actionId)
      })
    }
    return false
  } catch (err) {
    return false
  }
}

/**
 * 
 * @param {('upload'|'like')} actionType 
 * @param {Integer} itemId 
 */
const createAction = async (actionType, itemId) => {
  const uuidv4 = require('uuid').v4
  const [insertData] = await pool.query('INSERT INTO actions (type, itemId, actionId, createdAt) VALUES (?, ?, ?, ?)', [actionType, itemId, uuidv4(), Date.now()])
  if (insertData && insertData.insertId) {
    const [[action]] = await pool.query('SELECT actionId FROM actions WHERE id=?', [insertData.insertId])
    return action.actionId
  } else return new Error('could not create action')
}

const consumeAction = async actionId => {
  const [[action]] = await pool.query('SELECT type, itemId FROM actions WHERE actionId=? AND consumedAt IS NULL', [actionId])
  if (!action) return false
  if (action.type === 'like') {
    await pool.query('UPDATE meme_likes SET confirmed=1 WHERE id=?', [action.itemId])
  } else if (action.type === 'upload') {
    await pool.query('UPDATE memes SET confirmed=1 WHERE id=?', [action.itemId])
  } else if (action.type === 'delete') {
    // Testear en PROD: que pasa si quito el WHERE? 🤔
    await pool.query('DELETE FROM memes WHERE id=?', [action.itemId])
  }
  await pool.query('UPDATE actions SET consumedAt=? WHERE actionId=?', [Date.now(), actionId])
  return action.type
}

app.get('/gallery', async (req, res) => {
  const [memes] = await pool.query('SELECT SUM(IF(meme_likes.confirmed=1, 1, 0)) as likes, memes.id, memes.title, memes.src, memes.authorName, memes.createdAt FROM memes  LEFT JOIN meme_likes ON memes.id = meme_likes.memeId WHERE memes.confirmed=1 GROUP BY memes.id')
  if (memes.filter(m => m.id !== null).length) {
    res.json(memes.map(meme => {
      meme.src = `https://${process.env.VIRTUAL_HOST}${meme.src}`
      delete meme.authorName
      return meme
    }))
  } else res.json([])
})

app.post('/like/:memeId', async (req, res) => {
  const voterEmail = req.body.voterEmail
  if (peopleLiking.includes(voterEmail)) return res.status(401).send('dont shoot so fast cowboi')
  if (!validateEmail(voterEmail)) return res.status(401).send('only cgi email addresses are allowed')
  const meme = await getMeme(req.params.memeId)
  if (!meme) return res.status(404).send('meme not found')
  if (meme.authorEmail === voterEmail) return res.status(400).send('a nadie le gusta la gente que le da like a sus propios memes')
  peopleLiking.push(voterEmail)
  const [[likedBefore]] = await pool.query('SELECT voterEmail FROM meme_likes WHERE voterEmail=? AND memeId=?', [voterEmail, req.params.memeId])
  if (likedBefore) {
    peopleLiking.splice(peopleLiking.indexOf(voterEmail), 1)
    return res.status(401).send('ya has votado este meme before, locuel@')
  }
  const [insertData] = await pool.query('INSERT INTO meme_likes (memeId, voterEmail, confirmed, createdAt) VALUES (?, ?, ?, ?)', [req.params.memeId, voterEmail, 0, Date.now()])
  if (insertData && insertData.insertId) {
    const actionId = await createAction('like', insertData.insertId)
    sendMail(voterEmail, 'like', meme.title, actionId)
    res.status(200).send('ok')
  }
  else res.status(500).send('error al intentar dar like al meme')
  peopleLiking.splice(peopleLiking.indexOf(voterEmail), 1)
})

app.post('/subir', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.')
  }
  
  const memeTitle = req.body.memeTitle || 'Untitled meme'
  const memeAuthorName= req.body.memeAuthorName || 'Unknown meme lord'
  const memeAuthorEmail= req.body.memeAuthorEmail
  const memeFile = req.files.memeFile

  if (peopleUploading.includes(memeAuthorEmail)) return res.status(401).send('dont shoot so fast cowboi')
  if (!memeFile.size) return res.status(400).send('no file was sent')
  if (memeFile.mimetype !== 'image/png' && memeFile.mimetype !== 'image/jpeg') return res.status(400).send('formato de archivo invalido')
  if (!memeAuthorEmail|| !validateEmail(memeAuthorEmail)) return res.status(401).send('email invalido (only @cgi.com)')

  peopleUploading.push(memeAuthorEmail)
  const ext = memeFile.name.split('.')[memeFile.name.split('.').length - 1]
  const memePublicPath = `/meme/cgimeme${Math.random() * 1000}.${ext}`
  memeFile.mv(path.join(__dirname, `../public${memePublicPath}`), async err => {
    if (err) {
      peopleUploading.splice(peopleUploading.indexOf(memeAuthorEmail), 1)
      return res.status(500).send(err)
    }
    
    const [insertedMeme] = await pool.query('INSERT INTO memes (src, title, authorName, authorEmail, createdAt, confirmed) VALUES (?, ?, ?, ?, ?, ?)', [memePublicPath, memeTitle, memeAuthorName, memeAuthorEmail, Date.now(), 0])
  
    if (insertedMeme && insertedMeme.insertId) {
      const actionId = await createAction('upload', insertedMeme.insertId)
      sendMail(memeAuthorEmail, 'upload', memeTitle, actionId)
      res.send('ok')
    } else res.status(500).send('error al crear el meme')
    peopleUploading.splice(peopleUploading.indexOf(memeAuthorEmail), 1)
  })
})

app.get('/meme/:memeId', async (req, res) => {
  const meme = await getMeme(req.params.memeId)
  if (!meme) return res.status(404).send('meme not found')
  delete meme.authorEmail // lil bit o privacy
  delete meme.authorName
  res.json(meme)
})

app.delete('/meme/:memeId', async (req, res) => {
  const authorEmail = req.body.authorEmail
  if (!validateEmail(authorEmail)) return res.status(401).send('only cgi email addresses are allowed')
  const meme = await getMeme(req.params.memeId)
  if (!meme) return res.status(404).send('meme not found')
  if (meme.authorEmail !== authorEmail) return res.status(400).send('me parece fatal que intentes borrar el meme de un colega... -1 respect y reportado')
  const [[deletionInProgress]] = await pool.query('SELECT id FROM actions WHERE type=? AND itemId=?', ['delete', req.params.memeId])
  if (deletionInProgress) {
    return res.status(401).send('ya hay una solicitud en curso para eliminar este meme. revisa tu correo o contacta con el dev (victor)')
  }
  const actionId = await createAction('delete', req.params.memeId)
  sendMail(authorEmail, 'delete', meme.title, actionId)
  res.status(200).send('ok')
})

app.get('/confirm/:actionId', async (req, res) => {
  const actionConsumed = await consumeAction(req.params.actionId)
  if (actionConsumed) res.json({
    status: 'ok',
    actionType: actionConsumed,
  })
  else res.status(500).send('no se ha podido confirmar la acción')
})

if (process.env.NODE_ENV === 'production') {
  app.listen(port, () => {
    console.log(`listenin on ${port}`)
  })
} else {
  const fs = require('fs')
  const key = fs.readFileSync('/usr/src/certs/key.pem')
  const cert = fs.readFileSync('/usr/src/certs/cert.pem')
  https.createServer({key: key, cert: cert }, app).listen(port, () => {
    console.log(`listenin on ${port}`)
  })
}
