<template>
  <div class="mu-box mu-h-box" :style="style">
    <slot />
  </div>
</template>

<script>
  import Box from './box.vue'

  export default {
    name: 'MusselHBox',
    extends: Box
  }
</script>
