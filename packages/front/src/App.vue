<template>
  <div id="app">
    <div class="headerContainer">
      <div class="siteName">
        <h1 @click="loadAllMemes">
        <router-link to="/">CGI Memes</router-link>
      </h1>
      </div>
      <button type="button" @click="toggleAppInfoModal(true)">
        <span class="buttonIcon">❔</span>
        <span class="buttonText">¿Cómo funciona?</span>
      </button>
      <button type="button" class="subirMemeCTA" @click="toggleAddMemeModal(true)">
        <span class="buttonIcon">📢</span>
        <span class="buttonText">Subir meme</span>
      </button>
    </div>
    <div class="msgsContainer" v-if="error || msg">
      <span class="error" v-if="error"><strong>Error:</strong> {{ error }}</span>
      <span class="msg" v-if="msg">{{ msg }}</span>
    </div>
    <router-view />
    <AddMemeModal />
    <VoteMemeModal />
    <AppInfoModal />
  </div>
</template>

<script>
import AddMemeModal from './components/AddMemeModal'
import VoteMemeModal from './components/VoteMemeModal'
import AppInfoModal from './components/AppInfoModal'

import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'App',
  components: { AddMemeModal, VoteMemeModal, AppInfoModal },
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
    ...mapMutations(['toggleAddMemeModal', 'toggleAppInfoModal']),
    ...mapActions(['loadAllMemes'])
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
  overflow-x: hidden;
}
#app {
  font-family: 'Asap', monospace, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 95%;
  margin: 0 auto;
  color: #333;
  padding: 10px;
  font-size: 14px;

  @media screen and (min-width: 1024px) {
    font-size: 16px;
  }

  .headerContainer {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;

    @media screen and (min-width: 1024px) {
      flex-wrap: nowrap;
    }

    .siteName {
      flex-grow: 1;
      display: flex;

      h1 {
        white-space: nowrap;
        word-break: break-all;
      }
    }

    .help {
      color: lightsteelblue;
    }
  }
  .msgsContainer {
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;

    .error, .msg {
      padding: 20px;
      margin: 10px;
      border: 2px solid #e6e6e6;
      color: #333;
    }
    .error {
      color: #333;
      background: magenta
    }
    .msg {
      color: blue;
      background: cyan

    }
  }
  .subirMemeCTA {
    margin-left: 5px;

    .buttonText {
      display: flex;
    }

    @media screen and (min-width: 1024px) {
      margin-left: 20px;
    }
  }
}
h1, h2, h3, h4 {
  font-family: 'Prompt', sans-serif;
  background: #333;
  color: whitesmoke;
  padding: 0 2px;

  &:hover {
    a {
      background: linear-gradient(45deg, red, magenta);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  a {
    color: whitesmoke;
    text-decoration: none;
  }
}
button {
  transition: transform .025s ease-in-out;

  &:hover {
    background: linear-gradient(45deg, red, magenta);
    color: white;
    border: none;
    transform: scale(1.4) rotate3d(0, 0, 1, 2deg);
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
input[type="text"],
input[type="button"],
input[type="password"],
input[type="email"],
input[type="number"],
button,
select {
  font-family: 'Asap', sans-serif;
  outline: none;
  border: 1px solid gray;
  padding: 5px;
  background: transparent;
  font-size: inherit;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .buttonText {
    display: none;
    margin-left: 5px;

    @media screen and (min-width: 1024px) {
      display: flex;
      align-items: center;
    }
  }
}
button,
input[type="submit"],
input[type="button"] {
  cursor: pointer;
}
</style>
