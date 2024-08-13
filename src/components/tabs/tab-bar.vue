<template>
  <div class="mu-bar mu-tab-bar" :tab-button-size="tabButtonSize">
    <slot name="prepend" />
    <mu-tab-button
      v-for="el in tabButtons"
      :key="el.name"
      :style="sizeStyle"
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
    tabButtons: Array,
    tabButtonSize: {
      type: String,
      validator: v => ['normal', 'small'].includes(v)
    }
  })

  const { sizeStyle } = useSize(props)
</script>
