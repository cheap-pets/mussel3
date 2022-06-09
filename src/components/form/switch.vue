<template>
  <div
    class="mu-switch"
    :active="value === activeValue || null"
    :content="innerLabel"
    @click="toggle" />
</template>

<script>
  import { ref, watchEffect } from 'vue'

  export default {
    name: 'MusselSwitch',
    props: {
      value: null,
      activeValue: {
        type: null,
        default: true
      },
      inactiveValue: {
        type: null,
        default: false
      },
      activeLabel: String,
      inactiveLabel: String
    },
    emits: ['update:value'],
    setup (props, context) {
      const innerLabel = ref(null)

      function toggle () {
        const v = props.activeValue === props.value
          ? props.inactiveValue
          : props.activeValue

        context.emit('update:value', v)
      }

      watchEffect(() => {
        innerLabel.value = props.activeValue === props.value
          ? props.activeLabel
          : props.inactiveLabel
      })

      return { toggle, innerLabel }
    }
  }
</script>
