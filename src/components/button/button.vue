<template>
  <button class="mu-button" :type="type" :active="active || undefined">
    <slot>
      <mu-icon v-if="icon" :icon="icon" />
      <span v-if="caption">{{ caption }}</span>
    </slot>
  </button>
</template>

<script>
  import './style.scss'

  export default {
    name: 'MusselButton',
    props: {
      type: {
        type: String,
        default: 'button'
      },
      icon: String,
      caption: String,
      active: Boolean
    }
  }
</script>
