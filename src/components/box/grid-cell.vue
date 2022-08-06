<template>
  <div class="mu-box" :style="boxStyle">
    <slot />
  </div>
</template>

<script>
  import { getSizeValue } from '@/utils/size'

  export default {
    name: 'MusselGridCell',
    props: {
      width: String,
      height: String,
      colStart: String,
      colSpan: String,
      colEnd: String,
      rowStart: String,
      rowSpan: String,
      rowEnd: String
    },
    computed: {
      boxStyle () {
        return {
          width: getSizeValue(this.width),
          height: getSizeValue(this.height),
          gridColumnStart: this.colStart,
          gridColumnSpan: this.colSpan,
          gridColumnEnd: this.colEnd,
          gridRowStart: this.rowStart,
          gridRowSpan: this.rowSpan,
          gridRowEnd: this.rowEnd
        }
      }
    }
  }
</script>
