<template>
  <div class="mu-button-group mu-box">
    <slot />
  </div>
</template>

<script setup>
  import './button-group.scss'

  import { provide } from 'vue'

  const props = defineProps({
    primary: Boolean,
    danger: Boolean,
    accent: Boolean,
    xColor: [Boolean, String],
    small: Boolean,
    round: Boolean,
    disabled: Boolean,
    buttonStyle: {
      type: String,
      validator: v => ['normal', 'outline'].includes(v)
    }
  })

  provide('groupedButtonOptions', props)
</script>
