<template>
  <span
    class="mu-icon"
    :class="data.iconClass"
    :icon="icon"
    v-html="data.iconSVG" />
</template>

<script setup>
  import './icon.scss'

  import { computed } from 'vue'
  import { icons } from './icons'

  defineOptions({ name: 'MusselIcon' })

  const props = defineProps({
    icon: String
  })

  const data = computed(() => {
    const { type, content } = (props.icon && icons[props.icon]) || {}

    return {
      iconSVG: (type === 'svg' && content) || undefined,
      iconClass: (type === 'class' && content) || undefined
    }
  })
</script>
