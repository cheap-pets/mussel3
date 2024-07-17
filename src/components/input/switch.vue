<template>
  <div
    class="mu-switch"
    :active="modelValue === activeValue || null"
    :content="innerLabel"
    @click="toggle" />
</template>

<script>
  import './switch.scss'

  import { ref, watchEffect } from 'vue'

  export default {
    name: 'MusselSwitch',
    props: {
      modelValue: null,
      activeValue: {
        type: null,
        default: true
      },
      inactiveValue: {
        type: null,
        default: false
      },
      label: String,
      activeLabel: String,
      inactiveLabel: String
    },
    emits: ['update:modelValue'],
    setup (props, context) {
      const innerLabel = ref(null)

      function toggle () {
        const v = props.activeValue === props.modelValue
          ? props.inactiveValue
          : props.activeValue

        context.emit('update:modelValue', v)
      }

      watchEffect(() => {
        innerLabel.value = (
          props.activeValue === props.modelValue
            ? props.activeLabel
            : props.inactiveLabel
        ) || props.label
      })

      return { toggle, innerLabel }
    }
  }
</script>
