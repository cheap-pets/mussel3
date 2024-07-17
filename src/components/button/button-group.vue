<template>
  <div class="mu-button-group" :style="style">
    <slot />
  </div>
</template>

<script>
  import Box from '../layout/box/box.vue'

  export default {
    name: 'MusselButtonGroup',
    extends: Box
  }
</script>
