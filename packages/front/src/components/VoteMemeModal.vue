<template>
  <div class="voteMemeModal" :class="{ open: showVoteMemeModal }">
    <div class="voteMemeForm">
      <span v-if="liked" class="successMessage">Tu voto ha sido contabilizado correctamente. Ahora te enviaremos un email para confirmarlo. Mientras no sea confirmado, no contará de cara al total de likes público.</span>
      <template v-if="!liked">
        <div class="formGroup">
          <label for="voterEmail">Email de confirmación</label>
          <input type="text" name="voterEmail" id="voterEmail" v-model="voterEmail" placeholder="Solo @cgi.com">
        </div>
        <button type="button" class="voteMemeButton" @click="localLikeMeme()">dar like</button>
      </template>
      <button type="button" class="cancelVoteButton" @click="toggleVoteMemeModal(false)">{{ liked ? 'amo que nos vamo' : 'cancelar' }}</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import api from '../lib/api'

export default {
  name: 'VoteMemeModal',
  data () {
    return {
      liked: false,
      voterEmail: ''
    }
  },
  computed: {
    ...mapState(['selectedMeme', 'showVoteMemeModal'])
  },
  methods: {
    ...mapMutations(['toggleVoteMemeModal']),
    localLikeMeme () {
      console.log(this.selectedMeme)
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
  },
}
</script>

<style lang="scss" scoped>
.voteMemeModal {
  display: none;
  position: fixed;
  flex-direction: column;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(rgba(255, 255, 255, .3), rgba(0, 0, 0, .8));

  &.open {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .voteMemeForm {
    background: white;
    border:  2px solid gray;
    border-radius: 5px;
    box-shadow: 0 0 100px 15px rgba(0, 0, 0, 0.3);
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: 600px;
    .successMessage {
      margin-bottom: 15px;
    }
    .formGroup {
      padding: 10px;
      display: flex;
      align-items: center;
      & > * {
        flex-basis: 50%;
      }
    }
    .voteMemeButton {
      justify-self: flex-end;
      margin-bottom: 5px;
    }
  }
  .cancelVoteButton {
    background: rgba(255, 0, 0, .2);
  }
}
</style>
