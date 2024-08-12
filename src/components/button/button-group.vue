<template>
  <div class="mu-button-group">
    <slot />
  </div>
</template>

<script setup>
  import './button-group.scss'

  import { buttonGroupProps, useButtonGroup } from './hooks/button-group'

  const props = defineProps({ ...buttonGroupProps })

  useButtonGroup(props)
</script>
