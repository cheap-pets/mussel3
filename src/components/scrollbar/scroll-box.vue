<template>
  <div class="mu-scroll-box mu-scrollbar">
    <div class="mu-scrollbar_tracks" />
    <slot />
  </div>
</template>

<script>
  import './scroll-box.scss'

  import { attach, detach } from './index'

  export default {
    name: 'MusselScrollBox',

    mounted () {
      attach(this.$el)
    },
    beforeUnmount () {
      detach(this.$el)
    }
  }
</script>
