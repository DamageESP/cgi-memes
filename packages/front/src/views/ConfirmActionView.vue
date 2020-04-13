<template>
  <h3>Confirmando acción... 🕙</h3>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import api from '../lib/api'

export default {
  name: 'ConfirmActionView',
  methods: {
    ...mapMutations(['setError', 'setMsg']),
    ...mapActions(['loadAllMemes'])
  },
  mounted () {
    api(`/confirm/${this.$route.params.actionId}`).then(r => {
      if (r.status === 200) {
        r.json().then(r => {
          if (r.actionType === 'like') {
            this.setMsg('Voto confirmado! Ahora contará para el total público. 👍')
          } else if (r.actionType === 'upload') {
            this.setMsg('Meme confirmado! Ahora todo el mundo podrá verlo. 👀')
          } else if (r.actionType === 'delete') {
            this.setMsg('Meme eliminado. No queda ni rastro de él por ningún sitio. 🔪')
          }
          this.loadAllMemes()
        })
      } else {
        r.text().then(r => this.setError(r))
      }
      this.$router.push('/')
    })
  }
}
</script>
