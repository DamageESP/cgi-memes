<template>
  <Modal :open="showVoteMemeModal">
    <h3>Votar este meme</h3>
    <span v-if="liked" class="successMessage">Tu voto ha sido contabilizado correctamente. Ahora te enviaremos un email para confirmarlo. Mientras no sea confirmado, no contará de cara al total de likes público.</span>
    <template v-if="!liked">
      <div class="formGroup">
        <label for="voterEmail">Email de confirmación</label>
        <input type="text" name="voterEmail" id="voterEmail" v-model="voterEmail" placeholder="Solo @cgi.com">
      </div>
      <button type="button" class="voteMemeButton" @click="localLikeMeme()">dar like</button>
    </template>
    <button type="button" class="cancelVoteButton" @click="closeModal()">{{ liked ? 'amo que nos vamo' : 'cancelar' }}</button>
  </Modal>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import api from '../lib/api'
import Modal from './Modal'

export default {
  name: 'VoteMemeModal',
  data () {
    return {
      liked: false,
      voterEmail: ''
    }
  },
  components: { Modal },
  computed: {
    ...mapState(['selectedMeme', 'showVoteMemeModal'])
  },
  methods: {
    ...mapMutations(['toggleVoteMemeModal']),
    closeModal () {
      this.liked = false
      this.toggleVoteMemeModal(false)
    },
    localLikeMeme () {
      const likeForm = new FormData()
      likeForm.append('voterEmail', this.voterEmail)
      api(`/like/${this.selectedMeme.id}`, {
        method: 'POST',
        body: likeForm
      }).then(r => {
        if (r.status !== 200) r.text().then(alert)
        else this.liked = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.successMessage {
  margin-bottom: 15px;
}
.formGroup {
  padding: 10px;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 1024px) {
    align-items: center;
    flex-direction: row;
  }
  & > * {
    flex-basis: 50%;
  }
}
.voteMemeButton {
  justify-self: flex-end;
  margin-bottom: 5px;
}
.cancelVoteButton {
  background: magenta;
}
</style>
