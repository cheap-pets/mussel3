<template>
  <div class="mu-form-row mu-box" :style="boxStyle">
    <slot />
  </div>
</template>

<script>
  import Box from '../layout/box/box.vue'

  export default {
    name: 'MusselFormRow',
    extends: Box
  }
</script>
