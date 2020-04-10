<template>
  <Modal :open="showAddMemeModal">
    <h3>Subir meme</h3>
    <span v-if="uploaded" class="successMessage">Tu meme ha sido subido correctamente. Ahora te enviaremos un email para confirmarlo. Mientras no sea confirmado, no se verá en la lista de memes</span>
    <template v-else>
      <div>
        <div class="formGroup">
          <label for="memeFile">Archivo (solo .png y .jpg)</label>
          <input type="file" name="memeFile" id="memeFile" @change="processFile($event)">
        </div>
        <div class="formGroup">
          <label for="memeAuthorEmail">Email del autor*</label>
          <input type="text" name="memeAuthorEmail" id="memeAuthorEmail" v-model="memeAuthorEmail" placeholder="Privado. Solo emails @cgi.com">
        </div>
        <div class="formGroup">
          <label for="memeAuthorName">Nombre del autor (opcional)</label>
          <input type="text" name="memeAuthorName" id="memeAuthorName" v-model="memeAuthorName" placeholder="Público">
        </div>
        <div class="formGroup">
          <label for="memeTitle">Título del meme (opcional)</label>
          <input type="text" name="memeTitle" id="memeTitle" v-model="memeTitle" placeholder="Público">
        </div>
      </div>
      <button type="button" class="submitMemeButton" @click="subirMeme()">subir momaso</button>
    </template>
    <button type="button" class="cancelButton" @click="toggleAddMemeModal(false)">{{ uploaded ? 'cerrar' : 'cancelar' }}</button>
    <button type="button" @click="uploaded = false" v-if="uploaded">subir otro</button>
  </Modal>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import api from '../lib/api'
import Modal from './Modal'

export default {
  name: 'AddMemeModal',
  components: { Modal },
  data () {
    return {
      memeFile: '',
      memeAuthorEmail: '',
      memeAuthorName: '',
      memeTitle: '',
      uploaded: false
    }
  },
  computed: {
    ...mapState(['showAddMemeModal'])
  },
  methods: {
    ...mapMutations(['toggleAddMemeModal', 'setError', 'setMsg']),
    ...mapActions(['loadAllMemes']),
    processFile (event) {
      this.memeFile = event.target.files[0]
    },
    subirMeme () {
      const memeData = {
        memeFile: this.memeFile,
        memeAuthorEmail: this.memeAuthorEmail,
        memeAuthorName: this.memeAuthorName,
        memeTitle: this.memeTitle,
        createdAt: Date.now()
      }
      const formData = new FormData()
      for (const name in memeData) {
        formData.append(name, memeData[name])
      }
      api('/subir', {
        method: 'POST',
        body: formData
      }).then(r => {
        if (r.status === 200) {
          this.uploaded = true
          r.text().then(this.setMsg)
          this.loadAllMemes()
        } else r.text().then(this.setError)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.successMessage {
  margin-bottom: 15px;
}
.formGroup {
  padding: 10px;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 1024px) {
    align-items: center;
    flex-direction: row;
  }
  & > * {
    flex-basis: 50%;
  }
}
.cancelButton {
  background: magenta;
  margin: 5px 0;
}
</style>
