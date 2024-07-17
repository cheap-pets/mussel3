<template>
  <div class="mu-box" :style="style">
    <slot />
  </div>
</template>

<script>
  import { resolveSize } from '@/utils/size'

  export default {
    name: 'MusselBox',
    props: {
      width: null,
      height: null
    },
    computed: {
      style () {
        return {
          width: resolveSize(this.width),
          height: resolveSize(this.height)
        }
      }
    }
  }
</script>
