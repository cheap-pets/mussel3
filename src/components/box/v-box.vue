<template>
  <div class="mu-box" layout="flex" direction="column" :style="boxStyle">
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
