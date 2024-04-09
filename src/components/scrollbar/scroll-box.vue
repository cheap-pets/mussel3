<template>
  <div class="mu-scroll-box mu-scrollbar">
    <div class="mu-scrollbar_tracks" />
    <slot />
  </div>
</template>

<script>
  import { attach, detach } from './index'

  export default {
    mounted () {
      console.log(this.$el.className)
      attach(this.$el)
    },
    beforeUnmount () {
      detach(this.$el)
    }
  }
</script>
