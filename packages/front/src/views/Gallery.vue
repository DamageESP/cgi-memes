<template>
  <div class="galleryPage">
    <h3 v-if="!memes.length && !loadingMemes">No hay memes todavía. <button class="linkButton" type="button" @click="toggleAddMemeModal(true)">¡Sé el primero!</button></h3>
    <h3 class="loadingMemes" v-if="loadingMemes">Cargando memes...</h3>
    <div class="facet">
      <label for="order">Orden: </label>
      <select v-model="order">
        <option value="likes" selected>Likes</option>
        <option value="createdAt">Fecha de subida</option>
      </select>
    </div>
    <div class="gallery">
      <Meme v-for="(meme, i) in orderedMemes" :key="i" :meme="meme" />
    </div>
  </div>
</template>

<script>
import Meme from '../components/Meme'

import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Gallery',
  data () {
    return {
      order: 'likes'
    }
  },
  computed: {
    ...mapState(['memes', 'loadingMemes']),
    orderedMemes: function () {
      return this.memes.slice(0).sort((a, b) => {
        return parseInt(a[this.order]) > parseInt(b[this.order]) ? -1 : 1
      })
    }
  },
  methods: {
    ...mapMutations(['toggleAddMemeModal'])
  },
  components: { Meme }
}
</script>

<style scoped lang="scss">
.loadingMemes {
  margin: 15px 0;
  text-align: center;
}

.facet {
  margin: 15px 0;
}

.gallery {
  display: grid;
  grid-template-columns: .5fr .5fr;
  grid-auto-rows: 350px;
  transition: all .5s ease-in-out;
  column-gap: 10px;
  row-gap: 10px;

  @media screen and (min-width: 1024px) {
    column-gap: 20px;
    row-gap: 20px;
  }
}
</style>
