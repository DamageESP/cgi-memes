<template>
  <div class="modal" :class="{ open }">
    <div class="modalContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: ['open']
}
</script>

<style lang="scss" scoped>
.modal {
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

  .modalContent {
    background: white;
    border:  2px solid gray;
    box-shadow: 0 0 100px 15px rgba(0, 0, 0, 0.3);
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: 100vw;
    width: 100vw;
    box-sizing: border-box;

    @media screen and (min-width: 1024px) {
      max-width: 600px;
    }
  }
}
</style>
