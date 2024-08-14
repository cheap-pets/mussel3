<template>
  <div class="mu-tab-bar" :style="sizeStyle">
    <slot name="prepend" />
    <mu-tab-button
      v-for="el in tabButtons"
      :key="el.name"
      :active="activeTab === el.name || null"
      v-bind="el"
      @click="activeTab = el.name" />
    <slot name="append" />
  </div>
</template>

<script setup>
  import './tab-bar.scss'
  import { useSize } from '@/hooks/size'

  import MuTabButton from './tab-button.vue'

  defineOptions({ name: 'MusselTabBar' })

  const activeTab = defineModel('activeTab', { type: String })

  const props = defineProps({
    width: String,
    tabButtons: Array
  })

  const { sizeStyle } = useSize(props)
</script>
