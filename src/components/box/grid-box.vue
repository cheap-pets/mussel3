<template>
  <div class="mu-box" layout="grid" :style="boxStyle">
    <slot />
  </div>
</template>

<script>
  import { getSizeValue } from '@/utils/size'

  function getGridTemplateValues (v) {
    return isNaN(v) ? undefined : `repeat(${v}, 1fr)`
  }

  export default {
    name: 'MusselGridBox',
    props: {
      width: String,
      height: String,
      rows: String,
      columns: String
    },
    computed: {
      boxStyle () {
        return {
          width: getSizeValue(this.width),
          height: getSizeValue(this.height),
          gridTemplateRows: getGridTemplateValues(this.rows),
          gridTemplateColumns: getGridTemplateValues(this.columns)
        }
      }
    }
  }
</script>
