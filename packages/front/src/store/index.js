import Vue from 'vue'
import Vuex from 'vuex'
import api from '../lib/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    memes: [],
    selectedMeme: null,
    loadingMemes: false,
    showAddMemeModal: false,
    showVoteMemeModal: false,
    msg: '',
    error: ''
  },
  mutations: {
    setMemes (state, memesArray) {
      state.memes = memesArray
    },
    setError (state, error) {
      state.error = error
      setTimeout(() => {
        state.error = ''
      }, 3000)
    },
    setMsg (state, msg) {
      state.msg = msg
      setTimeout(() => {
        state.msg = ''
      }, 3000)
    },
    addMeme (state, memeData) {
      const existingMemeIndex = state.memes.findIndex(m => m.id === memeData.id)
      if (existingMemeIndex > -1) {
        state.memes.splice(existingMemeIndex, 1, memeData)
      } else state.memes.push(memeData)
    },
    toggleAddMemeModal (state, modalShown) {
      state.showAddMemeModal = modalShown
    },
    setSelectedMeme (state, memeId) {
      console.log('setting selected meme')
      state.selectedMeme = state.memes.find(m => m.id === memeId)
    },
    toggleVoteMemeModal (state, modalShown) {
      state.showVoteMemeModal = modalShown
    },
    memeUpvoted (state, memeId) {
      state.memes.find(m => m.id === memeId).likes += 1
    },
    setLoading (state, isLoading) {
      state.loadingMemes = isLoading
    }
  },
  actions: {
    loadAllMemes ({ commit }) {
      commit('setLoading', true)
      return api('/gallery').then(r => r.json()).then(memes => {
        commit('setMemes', memes)
        commit('setLoading', false)
      })
    },
    loadOneMeme ({ commit }, memeId) {
      commit('setLoading', true)
      return api(`/meme/${memeId}`).then(r => r.json()).then(meme => {
        commit('addMeme', meme)
        commit('setLoading', false)
      })
    }
  },
  modules: {
  }
})
