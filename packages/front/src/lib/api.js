console.log(process.env)

export default (url, ...opts) => {
  return fetch(`${process.env.BACK_URL}${url}`, ...opts)
}
