<template>
  <div class="mu-tabs mu-box">
    <slot name="tab-bar">
      <mu-tab-bar
        v-if="tabItems"
        v-bind="tabBarParams"
        :tab-style="tabStyle"
        flex="none">
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
      tabStyle: String,
      activeTab: String,
      tabBarParams: Object
    },
    emits: ['update:activeTab', 'tabClick', 'buttonClick'],
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
        this.$emit('buttonClick', tab.name)

        if (
          this.activeTabName !== tab.name &&
          this.$attrs.onTabchange?.(tab) !== false
        ) {
          this.activeTabName = tab.name
          this.$emit('update:activeTab', tab.name)
        }
      }
    }
  }
</script>
