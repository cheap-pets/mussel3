<template>
  <div class="mu-bar mu-tab-bar mu-box">
    <slot>
      <mu-tab-button
        v-for="el in items"
        :key="el.name"
        v-bind="el"
        :active="activeTabName === el.name"
        @click="onTabClick(el)" />
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'MusselTabBar',
    inject: {
      tabs: {
        default: null
      }
    },
    props: {
      tabItems: Array,
      activeTab: null
    },
    emits: ['update:activeTab'],
    computed: {
      items () {
        return this.tabItems || this.tabs?.tabItems
      },
      activeTabName () {
        return this.tabItems
          ? this.activeTab
          : this.tabs?.activeTabName
      }
    },
    methods: {
      onTabClick (tabItem) {
        this.$emit('update:activeTab', tabItem.name)

        this.tabs?.onTabClick(tabItem)
      }
    }
  }
</script>
