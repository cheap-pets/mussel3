<template>
  <div class="mu-form-row mu-box" :style="{ width: boxWidth, height: boxHeight }">
    <slot />
  </div>
</template>

<script>
  import Box from '../box/box.vue'

  export default {
    name: 'MusselFormRow',
    extends: Box
  }
</script>
