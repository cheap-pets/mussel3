<template>
  <div class="mu-box" :style="{ width: boxWidth, height: boxHeight }" />
</template>

<script>
  import { getSizeValue } from '@/utils/size'

  export default {
    name: 'MusselBox',
    props: {
      width: String,
      height: String
    },
    computed: {
      boxWidth () {
        return getSizeValue(this.width)
      },
      boxHeight () {
        return getSizeValue(this.height)
      }
    },
    methods: {
      getSizeValue
    }
  }
</script>
