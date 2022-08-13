<template>
  <div class="mu-box" :style="boxStyle">
    <slot />
  </div>
</template>

<script>
  import { getSizeValue } from '@/utils/size'

  export default {
    name: 'MusselGridCell',
    props: [
      'width', 'height',
      'colStart', 'colSpan', 'colEnd',
      'rowStart', 'rowSpan', 'rowEnd'
    ],
    computed: {
      boxStyle () {
        const gridColumnEnd = isNaN(this.colEnd)
          ? null
          : (parseInt(this.colEnd) + 1)

        const gridRowEnd = isNaN(this.rowEnd)
          ? null
          : (parseInt(this.rowEnd) + 1)

        return {
          width: getSizeValue(this.width),
          height: getSizeValue(this.height),
          gridColumnStart: this.colStart,
          gridColumnSpan: this.colSpan,
          gridColumnEnd,
          gridRowStart: this.rowStart,
          gridRowSpan: this.rowSpan,
          gridRowEnd
        }
      }
    }
  }
</script>
