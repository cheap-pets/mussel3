<template>
  <div
    class="mu-dropdown"
    @click="onTriggerClick"
    @press="onPress"
    @mouseover="onTriggerMouseOver"
    @mouseleave="onTriggerMouseLeave">
    <slot />
    <mu-dropdown-panel
      v-model:visible="dropdownVisible"
      :items="dropdownItems"
      :align="dropdownAlign"
      :style="dropdownStyle"
      :width="dropdownWidth"
      :height="dropdownHeight"
      :reserve-icon-place="reserveIconPlace || null">
      <slot name="dropdown" />
    </mu-dropdown-panel>
  </div>
</template>

<script>
  export default {
    name: 'MusselDropdown',
    provide () {
      return {
        dropdown: this
      }
    },
    props: {
      dropdownItems: Array,
      dropdownAlign: String,
      dropdownStyle: Object,
      dropdownHeight: String,
      dropdownWidth: {
        type: String,
        default: 'auto'
      },
      dropdownTrigger: {
        type: String,
        default: 'hover',
        validator (v) {
          return ['hover', 'click', 'press'].includes(v)
        }
      },
      reserveIconPlace: Boolean
    },
    emits: ['dropdown:itemclick', 'dropdown:show', 'dropdown:hide'],
    data () {
      return {
        dropdownVisible: false
      }
    },
    watch: {
      dropdownVisible (v) {
        this.$emit(v ? 'dropdown:show' : 'dropdown:hide')
      }
    },
    methods: {
      cancelDelayHide () {
        if (this.delayHideTimer) {
          clearTimeout(this.delayHideTimer)

          this.delayHideTimer = null
        }
      },

      showDropdown () {
        this.cancelDelayHide()
        this.dropdownVisible = true
      },

      hideDropdown () {
        this.cancelDelayHide()
        this.dropdownVisible = false
      },

      delayHideDropdown () {
        clearTimeout(this.delayHideTimer)
        this.delayHideTimer = setTimeout(this.hideDropdown, 200)
      },

      toggleDropdownVisible () {
        if (this.dropdownVisible) this.hideDropdown()
        else this.showDropdown()
      },

      onTriggerClick () {
        if (this.dropdownTrigger === 'click') {
          this.toggleDropdownVisible()
        } else if (this.dropdownTrigger === 'press') {
          this.hideDropdown()
        }
      },

      onPress () {
        if (['click', 'press'].includes(this.dropdownTrigger)) {
          this.showDropdown()
        }
      },

      onTriggerMouseOver () {
        if (this.dropdownTrigger === 'hover') {
          this.showDropdown()
        }
      },

      onTriggerMouseLeave () {
        if (this.dropdownTrigger === 'hover') {
          this.delayHideDropdown()
        }
      },

      onDropdownItemClick (item) {
        this.hideDropdown()
        this.$emit('dropdown:itemclick', item)
      },

      onDropdownPanelMouseLeave () {
        this.onTriggerMouseLeave()
      },

      onDropdownPanelMouseOver () {
        this.cancelDelayHide()
      }
    }
  }
</script>
