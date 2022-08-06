<template>
  <div class="mu-button-group" :style="boxStyle">
    <slot />
  </div>
</template>

<script>
  import Box from '../box/box.vue'

  export default {
    name: 'MusselButtonGroup',
    extends: Box
  }
</script>
