<template>
  <div class="mu-form mu-box" :style="boxStyle">
    <slot />
  </div>
</template>

<script>
  import Box from '../box/box.vue'

  export default {
    name: 'MusselForm',
    extends: Box,
    provide () {
      return {
        form: this
      }
    },
    props: {
      labelWidth: String,
      labelAlign: String
    }
  }
</script>
