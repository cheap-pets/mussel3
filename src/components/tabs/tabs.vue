<template>
  <div class="mu-tabs mu-box">
    <slot name="tab-bar">
      <mu-tab-bar
        v-if="tabItems"
        flex="none"
        :tab-style="tabStyle">
        <mu-tab-button
          v-for="el in tabItems"
          :key="el.name"
          v-bind="el"
          :active="activeTabName === el.name"
          @click="onTabClick(el)" />
      </mu-tab-bar>
    </slot>
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'MusselTabs',
    provide () {
      return {
        tabs: this
      }
    },
    props: {
      activeTab: String,
      tabStyle: String
    },
    emits: ['update:activeTab', 'tabClick'],
    data () {
      return {
        tabItems: [],
        activeTabName: null
      }
    },
    watch: {
      activeTab: {
        handler (value) {
          this.activeTabName = value
        },
        immediate: true
      }
    },
    methods: {
      mountTab (tab) {
        if (!this.tabItems.find(el => tab.name === el.name)) {
          this.tabItems.push(tab)
        }
      },
      unmountTab (tab) {
        const idx = this.tabItems.findIndex(el => tab.name === el.name)

        if (idx !== -1) this.tabItems.splice(idx, 1)
      },
      onTabClick (tab) {
        this.$emit('tabClick', tab)

        if (
          this.activeTabName !== tab.name &&
          this.$attrs.onTabChange?.(tab) !== false
        ) {
          this.activeTabName = tab.name
          this.$emit('update:activeTab', tab.name)
        }
      }
    }
  }
</script>
