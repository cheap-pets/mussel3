<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <a
    class="mu-icon mu-expand-icon"
    :expanded="expanded || null"
    :expand-type="expandType"
    v-html="icons.chevronDown.content" />
</template>

<script setup>
  import './expand-icon.scss'
  import { icons } from '@/icons'

  defineOptions({
    name: 'MusselExpandIcon'
  })

  defineProps({
    expandType: {
      type: String,
      default: 'dropdown',
      validate: v => ['folder', 'dropdown'].includes(v)
    },
    expanded: Boolean
  })
</script>
