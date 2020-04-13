<template>
  <Modal :open="showDeleteMemeModal">
    <h3>Eliminar este meme</h3>
    <span v-if="!deleted" class="successMessage">¿Estás segur@? Acabarás con la vida del meme y la de toda su familia. Están en tus manos.</span>
    <span v-if="deleted" class="successMessage">Te he enviado un correo para firmar la sentencia de este meme. Por favor, piénsatelo bien antes de hacer clic en el enlace...</span>
    <template v-if="!deleted">
      <div class="formGroup">
        <label for="authorEmail">Email de confirmación</label>
        <input type="text" name="authorEmail" id="authorEmail" v-model="authorEmail" placeholder="Debe ser el email del que lo subió.">
      </div>
      <button type="button" class="voteMemeButton" @click="localDeleteMeme()">ejecutar al meme 💀🔫</button>
    </template>
    <button type="button" class="cancelVoteButton" @click="closeModal()">{{ deleted ? 'taluego maricarmen' : 'cancelar' }}</button>
  </Modal>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import api from '../lib/api'
import Modal from './Modal'

export default {
  name: 'DeleteMemeModal',
  data () {
    return {
      deleted: false,
      authorEmail: ''
    }
  },
  components: { Modal },
  computed: {
    ...mapState(['selectedMeme', 'showDeleteMemeModal'])
  },
  methods: {
    ...mapMutations(['toggleDeleteMemeModal']),
    closeModal () {
      this.deleted = false
      this.toggleDeleteMemeModal(false)
    },
    localDeleteMeme () {
      const deleteForm = new FormData()
      deleteForm.append('authorEmail', this.authorEmail)
      api(`/meme/${this.selectedMeme.id}`, {
        method: 'DELETE',
        body: deleteForm
      }).then(r => {
        if (r.status !== 200) r.text().then(alert)
        else this.deleted = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.successMessage {
  margin: 15px 0;
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
