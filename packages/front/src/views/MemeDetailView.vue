<template>
  <div class="memeDetail">
      <span v-if="!meme && loading">Cargando...</span>
      <span v-if="!meme && !loading">No se ha encontrado el meme</span>
      <Meme :meme="meme" fullSize="true" v-if="meme" @likeModal="$emit('likeModal', $event)" />
  </div>
</template>

<script>
import Meme from '../components/Meme'

import { mapActions, mapState } from 'vuex'

export default {
  name: 'MemeDetailView',
  components: { Meme },
  computed: {
    ...mapState(['loading', 'memes']),
    meme () {
      return this.memes.find(m => m.id === parseInt(this.$route.params.memeId))
    }
  },
  methods: {
    ...mapActions(['loadOneMeme'])
  },
  mounted () {
    this.loadOneMeme(this.$route.params.memeId)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.memeDetail {
  display: flex;
  justify-content: center;
}
</style>
