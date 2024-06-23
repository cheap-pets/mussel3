<template>
  <div class="mu-box mu-v-box" :style="style">
    <slot />
  </div>
</template>

<script>
  import Box from './box.vue'

  export default {
    name: 'MusselVBox',
    extends: Box
  }
</script>
