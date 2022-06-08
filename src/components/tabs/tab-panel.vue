<template>
  <div
    v-show="visible"
    class="mu-tab-panel mu-box"
    flex="1">
    <slot />
  </div>
</template>

<script>
  import { ref, inject, watchEffect, onUnmounted } from 'vue'

  export default {
    name: 'MusselTabPanel',
    props: {
      icon: String,
      name: String,
      caption: String,
      title: String,
      disabled: Boolean
    },
    setup (props) {
      const tabs = inject('tabs')
      const visible = ref(false)

      watchEffect(() => {
        visible.value = tabs.activeTabName === props.name
      })

      watchEffect(() => {
        tabs.mountTab({
          icon: props.icon,
          name: props.name,
          caption: props.caption,
          title: props.title,
          disabled: props.disabled
        })
      })

      onUnmounted(() => {
        tabs.unmountTab({
          name: props.name
        })
      })

      return { visible }
    }
  }
</script>
