<template>
  <div
    class="mu-dropdown"
    @click="onTriggerClick"
    @mouseover="onTriggerMouseOver"
    @mouseleave="onTriggerMouseLeave">
    <slot />
    <mu-dropdown-panel
      v-model:visible="dropdownVisible"
      width="auto"
      :style="dropdownStyle"
      :items="dropdownItems"
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
          return ['hover', 'click'].includes(v)
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
    computed: {
      isClickMode () {
        return this.dropdownTrigger === 'click'
      },
      isHoverMode () {
        return this.dropdownTrigger === 'hover'
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
        if (this.isClickMode) this.toggleDropdownVisible()
      },

      onTriggerMouseOver () {
        if (this.isHoverMode) this.showDropdown()
      },

      onTriggerMouseLeave () {
        if (this.isHoverMode) this.delayHideDropdown()
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
