<template>
  <mu-tab-button
    v-for="el in tabs.tabItems"
    :key="el.name"
    v-bind="el"
    :active="tabs.activeTabName === el.name"
    @click="onTabClick(el)" />
</template>

<script>
  import { inject } from 'vue'

  export default {
    name: 'MusselTabButtons',
    setup () {
      const tabs = inject('tabs')

      function onTabClick (tabItem) {
        tabs.onTabClick(tabItem)
      }

      return {
        tabs,
        onTabClick
      }
    }
  }
</script>
