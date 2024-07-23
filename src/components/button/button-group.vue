<template>
  <div class="mu-button-group">
    <slot />
  </div>
</template>

<script setup>
  import './button-group.scss'

  import { provide } from 'vue'

  const props = defineProps([
    'primary',
    'accent',
    'danger',
    'xColor',
    'small',
    'round',
    'disabled',
    'buttonStyle'
  ])

  provide('buttonAttributes', props)
</script>
