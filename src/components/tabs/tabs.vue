<template>
  <div class="mu-tabs" :style="sizeStyle" :tab-position="tabPosition">
    <mu-tab-bar
      v-model:active-tab="activeTab"
      v-bind="tabBar"
      :tab-style="tabStyle"
      :tab-buttons="buttons"
      :tab-position="tabPosition"
      :tab-button-size="tabButtonSize">
      <template #prepend>
        <slot name="tab-bar-prepend" />
      </template>
      <template #append>
        <slot name="tab-bar-append" />
      </template>
    </mu-tab-bar>
    <slot />
  </div>
</template>

<script setup>
  import './tabs.scss'

  import { ref, computed, provide, onMounted, nextTick } from 'vue'
  import { sizeProps, useSize } from '@/hooks/size'

  defineOptions({ name: 'MusselTabs' })

  const activeTab = defineModel('activeTab', { type: String })

  const props = defineProps({
    tabBar: Object,
    tabStyle: String,
    tabButtons: Array,
    tabPosition: String,
    tabButtonSize: String,
    ...sizeProps
  })

  const mountedButtons = ref([])
  const buttons = computed(() => props.tabButtons || mountedButtons.value)

  const { sizeStyle } = useSize(props)

  function mountTab (tab) {
    if (props.tabButtons) return

    if (!mountedButtons.value.find(el => tab.name === el.name)) {
      mountedButtons.value.push(tab)
    }
  }

  function unmountTab (tab) {
    if (props.tabButtons) return

    const idx = mountedButtons.value.findIndex(el => tab.name === el.name)

    if (idx !== -1) mountedButtons.value.splice(idx, 1)
  }

  function setActiveTab (tabName) {
    activeTab.value = tabName
  }

  onMounted(() => nextTick(() => {
    if (!props.activeTab && buttons.value.length) {
      setActiveTab(buttons.value[0].name)
    }
  }))

  provide('tabs', {
    activeTab,
    mountTab,
    unmountTab,
    setActiveTab
  })
</script>
