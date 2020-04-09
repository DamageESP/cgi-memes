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
        this.setMsg('Acción confirmada correctamente! Ahora todo el mundo podrá verlo 😄👍')
        this.loadAllMemes()
      } else {
        r.text().then(r => this.setError(r))
      }
      this.$router.push('/')
    })
  }
}
</script>
