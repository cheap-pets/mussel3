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
        return this.getBoxSizeStyle(this.width)
      },
      boxHeight () {
        return this.getBoxSizeStyle(this.height)
      }
    },
    methods: {
      getBoxSizeStyle (width, height) {
        return {
          width: getSizeValue(width),
          height: getSizeValue(height)
        }
      }
    }
  }
</script>
