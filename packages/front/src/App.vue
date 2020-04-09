<template>
  <div id="app">
    <div class="headerContainer">
      <h1>
        <router-link to="/">CGI Memes</router-link>
      </h1>
      <span class="help">
        <i class="icon">ℹ️</i>
        <span>¿Cómo funciona?</span>
        <div class="infoModal">
          <div class="infoModalContent">
            <ol>
              <li>Sólo miembros de CGI pueden votar y añadir nuevos memes</li>
              <li>Todas las acciones (subir meme, votar meme) se confirmarán a través de mail</li>
            </ol>
          </div>
        </div>
      </span>
      <button type="button" class="subirMemeCTA" @click="toggleAddMemeModal(true)">Subir meme</button>
    </div>
    <div class="msgsContainer">
      <span class="error" v-if="error"><strong>Error:</strong> {{ error }}</span>
      <span class="msg" v-if="msg">{{ msg }}</span>
    </div>
    <router-view />
    <AddMemeModal />
    <VoteMemeModal />
  </div>
</template>

<script>
import AddMemeModal from './components/AddMemeModal'
import VoteMemeModal from './components/VoteMemeModal'

import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'App',
  components: { AddMemeModal, VoteMemeModal },
  computed: {
    ...mapState(['msg', 'error'])
  },
  mounted () {
    this.loading = true
    this.loadAllMemes().then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapMutations(['toggleAddMemeModal']),
    ...mapActions(['loadAllMemes']),
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html, body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Fira Code', monospace, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 800px;
  margin: 0 auto;
  color: #333;
  padding: 5px;
  font-size: 14px;

  @media screen and (min-width: 1024px) {
    font-size: 16px;
    padding: 15px;
  }

  .headerContainer {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    h1 {
      flex-grow: 1;
    }

    .help {
      display: flex;
      color: lightsteelblue;
      &:hover .infoModal {
        visibility: visible;
      }
    }
    .infoModal {
      position: relative;
      visibility: hidden;
      color: #333;

      .infoModalContent {
        position: absolute;
        border: 2px solid #e0e0e0;
        border-radius: 5px;
        background: white;
        padding: 5px;
        margin-left: -364px;
        margin-top: 35px;
        width: 350px;

        ol {
          list-style-position: inside;
        }
      }
    }
  }
  .msgsContainer {
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;

    .error, .msg {
      border-radius: 5px;
      padding: 20px;
      margin: 10px;
      border: 2px solid #e6e6e6;
      color: #333;
    }
    .error {
      color: red;
      background: rgba(255, 0, 0, .2);
    }
    .msg {
      color: blue;
      background: rgba(0, 0, 255, .2);
      
    }
  }
  .subirMemeCTA {
    margin-left: 20px;
  }
}
button {
  font-family: 'Fira Code', sans-serif;
  cursor: pointer;
  outline: none;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 5px;
  background: transparent;
  font-size: inherit;
  
  &:hover {
    background: rgba(0, 0, 0, .1);
  }
  &.linkButton {
    border: none;
    text-decoration: underline;
    font-weight: bold;
    color: purple;
    
    &:hover {
      background: transparent;
    }
  }
}
</style>
