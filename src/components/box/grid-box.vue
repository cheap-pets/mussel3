<template>
  <div class="mu-box mu-grid-box" :style="style">
    <slot />
  </div>
</template>

<script>
  import { resolveSize } from '@/utils/size'

  function getGridTemplateValues (v) {
    return isNaN(v) ? undefined : `repeat(${v}, 1fr)`
  }

  export default {
    name: 'MusselGridBox',
    props: ['width', 'height', 'rows', 'columns'],
    computed: {
      style () {
        return {
          width: resolveSize(this.width),
          height: resolveSize(this.height),
          gridTemplateRows: getGridTemplateValues(this.rows),
          gridTemplateColumns: getGridTemplateValues(this.columns)
        }
      }
    }
  }
</script>
