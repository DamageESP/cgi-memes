<template>
  <div class="galleryPage">
    <h3 v-if="!memes.length && !loadingMemes">No hay memes todavía. <button class="linkButton" type="button" @click="toggleAddMemeModal(true)">¡Sé el primero!</button></h3>
    <h3 v-if="!memes.length && loadingMemes">Cargando memes...</h3>
    <div class="gallery">
      <Meme v-for="(meme, i) in memes" :key="i" :meme="meme" />
    </div>
  </div>
</template>

<script>
import Meme from '../components/Meme'

import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Gallery',
  computed: {
    ...mapState(['memes', 'loadingMemes'])
  },
  methods: {
    ...mapMutations(['toggleAddMemeModal']),
  },
  components: { Meme },
}
</script>

<style scoped lang="scss">
.gallery {
  display: grid;
  grid-template-columns: .5fr .5fr;
  grid-auto-rows: 350px;
  transition: all .5s ease-in-out;
  column-gap: 10px;
  row-gap: 10px;
}
</style>
