<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <a
    class="mu-icon mu-expand-icon"
    :expanded="expanded || null"
    :expandType="expandType"
    v-html="icons.chevronDown" />
</template>

<script setup>
  import './expand-icon.scss'
  import { icons } from '../../icons'

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
