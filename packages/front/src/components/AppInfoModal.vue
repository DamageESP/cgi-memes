<template>
  <Modal :open="showAppInfoModal">
    <h3>Información general</h3>
    <ol>
      <li>Sólo miembros de CGI pueden votar y añadir nuevos memes</li>
      <li>Todas las acciones (subir meme, votar meme) se confirmarán a través de mail</li>
    </ol>
    <hr />
    <span>Código fuente -> <a href="https://github.com/DamageESP/cgi-memes" target="_blank" rel="noopener noreferrer">Github</a></span>
    <span>Creador -> <strong>Víctor Campos</strong></span>
    <button type="button" class="closeButton" @click="toggleAppInfoModal(false)">cerrar</button>
  </Modal>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Modal from './Modal'

export default {
  name: 'AppInfoModal',
  components: { Modal },
  computed: {
    ...mapState(['showAppInfoModal'])
  },
  methods: {
    ...mapMutations(['toggleAppInfoModal'])
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: 10px;
}
hr {
  margin: 15px 0;
}
ol {
  list-style-position: inside;
}
.closeButton {
  background: magenta;
  margin-top: 15px;
}
</style>
