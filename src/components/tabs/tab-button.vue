<template>
  <a
    class="mu-tabs_button"
    :active="active || undefined"
    :disabled="disabled || undefined"
    :title="title || buttonCaption">
    <slot>
      <mu-icon v-if="icon" :icon="icon" />
      <span v-if="buttonCaption">{{ buttonCaption }}</span>
    </slot>
  </a>
</template>

<script>
  export default {
    name: 'MusselTabsButton',
    props: {
      icon: String,
      name: String,
      caption: String,
      title: String,
      active: Boolean,
      disabled: Boolean
    },
    computed: {
      buttonCaption () {
        return this.caption || this.name
      }
    }
  }
</script>
