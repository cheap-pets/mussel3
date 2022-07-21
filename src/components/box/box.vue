<template>
  <div class="mu-box" :style="boxStyle">
    <slot />
  </div>
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
      boxStyle () {
        return {
          width: getSizeValue(this.width),
          height: getSizeValue(this.height)
        }
      }
    }
  }
</script>
