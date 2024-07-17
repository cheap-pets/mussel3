<template>
  <div class="mu-box mu-grid-cell" :style="style">
    <slot />
  </div>
</template>

<script>
  import { resolveSize } from '@/utils/size'

  export default {
    name: 'MusselGridCell',
    props: [
      'width', 'height',
      'colStart', 'colSpan', 'colEnd',
      'rowStart', 'rowSpan', 'rowEnd'
    ],
    computed: {
      style () {
        return {
          width: resolveSize(this.width),
          height: resolveSize(this.height),
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
