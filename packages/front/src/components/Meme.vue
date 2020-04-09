<template>
  <div class="meme" :class="{ fullSize }">
    <h3 class="memeTitle"><router-link :to="`/view/${meme.id}`">"{{ meme.title }}"</router-link></h3>
    <div class="imgContainer">
      <router-link :to="`/view/${meme.id}`">
          <img :src="meme.src" :alt="meme.title">
      </router-link>
    </div>
    <div class="details">
      <span class="author"><span>Subido por: </span>{{ meme.authorName }}</span>
      <span class="timestamp">{{ meme.createdAt|asDate }}</span>
    </div>
    <div class="controlButtons">
      <button type="button" title="Me gusta" @click="likeMeme()">
        <span class="icon">❤️</span>
        <span class="totalLikes">({{ meme.likes || 0 }})</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Meme',
  methods: {
    ...mapMutations(['toggleVoteMemeModal', 'setSelectedMeme']),
    likeMeme () {
      this.setSelectedMeme(this.meme.id)
      this.toggleVoteMemeModal(true)
    }
  },
  filters: {
    asDate (timestamp) {
      const date = new Date(parseInt(timestamp))
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
    }
  },
  props: ['meme', 'fullSize']
}
</script>

<style lang="scss" scoped>
.meme {
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, .3);
  background: white;
  transition: background ease .2s;

  &:hover {
    background-color: #f0f0f0;
  }

  &.fullSize {
    .imgContainer {
      a {
        max-height: unset;
        height: auto;
      }
    }
  }
  .memeTitle {
    font-style: italic;
    margin-bottom: 15px;
  }
  .imgContainer {
    height: 100%;
    padding: 15px;
    flex-grow: 1;
    display: flex;
    justify-content: center;

    a {
      width: 100%;
      max-height: 250px;
      height: 250px;
      overflow: hidden;
      display: flex;
    }

    img {
      object-fit: contain;
      max-width: 100%;
      width: 100%;
    }
  }
  .details {
    display: flex;
    font-size: .9rem;
    .author {
      font-weight: bold;
      flex-grow: 1;
    }
    .timestamp {
      color: gray;
    }
  }
  .controlButtons {
    display: flex;
    justify-content: flex-end;
    margin: 5px 0;
    button {
      font-family: 'Fira Code', sans-serif;
      cursor: pointer;
      outline: none;
      border: 1px solid gray;
      border-radius: 5px;
      padding: 5px;
      background: transparent;
      &:hover {
        background: rgba(255, 0, 0, .3);
      }
    }
  }
}
</style>
