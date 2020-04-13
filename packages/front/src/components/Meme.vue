<template>
  <div class="meme" :class="{ fullSize }">
    <h2 class="memeTitle"><router-link :to="`/view/${meme.id}`">{{ meme.title }}</router-link></h2>
    <div class="imgContainer">
      <router-link :to="`/view/${meme.id}`">
          <img :src="meme.src" :alt="meme.title">
      </router-link>
    </div>
    <div class="bottomInfo">
      <div class="details">
        <span class="timestamp">{{ meme.createdAt|asDate }}</span>
      </div>
      <div class="controlButtons">
        <button type="button" title="Me gusta" @click="likeMeme()">
          <span class="icon">❤️</span>
          <span class="text">({{ meme.likes || 0 }})</span>
        </button>
        <button type="button" title="Eliminar meme" @click="deleteMeme()" v-if="fullSize">
          <span class="icon">🗑</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Meme',
  methods: {
    ...mapMutations(['toggleVoteMemeModal', 'toggleDeleteMemeModal', 'setSelectedMeme']),
    likeMeme () {
      this.setSelectedMeme(this.meme.id)
      this.toggleVoteMemeModal(true)
    },
    deleteMeme () {
      this.setSelectedMeme(this.meme.id)
      this.toggleDeleteMemeModal(true)
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
  background: white;
  border: 1px solid #333;
  border-left: 15px solid #333;
  transition: background ease .2s;
  transform: rotate3d(0, 0, 1, 0deg);

  &:not(.fullSize):hover {
    background: linear-gradient(45deg, red, magenta);
    color: white;
    transform: rotate3d(0, 0, 1, 2deg);
    transition: transform .1s ease;

    .memeTitle {
      background: whitesmoke;

      a {
        color: #333;
      }
    }
    .bottomInfo {
      .details {
        .timestamp {
          color: whitesmoke;
        }
      }
    }
    .controlButtons {
      button {
        color: whitesmoke;
        border-color: whitesmoke;
      }
    }
  }

  &.fullSize {
    max-width: 800px;
    width: 800px;

    &:hover {
      .controlButtons {
          button {
            color: #333;
            border-color: #333;
          }
        }
    }
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

    a {
      text-decoration: none;
    }
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
  .bottomInfo {
    display: flex;

    .details {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      font-size: .9rem;
      .author {
        flex-grow: 1;
      }
      .timestamp {
        color: gray;
      }
    }
  }
  .controlButtons {
    display: flex;
    justify-content: flex-end;
    margin: 5px 0;
    button {
      font-family: 'Asap', sans-serif;
      cursor: pointer;
      outline: none;
      border: 1px solid #333;
      padding: 5px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;

      &:not(:last-child) {
        margin-right: 5px;
      }
      .icon {
        width: 20px;
        height: 20px;
      }
      .text {
        margin-left: 7px;
      }
    }
  }
}

</style>
