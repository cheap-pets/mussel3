<template>
  <div class="mu-box" layout="flex" :style="boxStyle">
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
