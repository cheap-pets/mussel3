<template>
  <div
    class="mu-status-box mu-box"
    layout="flex" direction="column" content-center
    :style="boxStyle">
    <slot name="icon">
      <mu-icon v-if="icon" class="mu-status-box_icon" :icon="icon" />
    </slot>
    <div v-if="title" class="mu-status-box_title">
      {{ title }}
    </div>
    <div v-if="message" class="mu-status-box_message">
      {{ message }}
    </div>
    <slot />
  </div>
</template>

<script>
  import './status-box.scss'

  import Box from '../layout/box/box.vue'

  export default {
    name: 'MusselStatusBox',
    extends: Box,
    props: ['icon', 'title', 'message']
  }
</script>
