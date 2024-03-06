<template>
  <div
    v-if="splitButton"
    class="mu-dropdown mu-dropdown-button mu-button-group"
    @click="hideDropdown">
    <mu-button>
      <slot>
        <mu-icon v-if="icon" :icon="icon" />
        <span v-if="caption">{{ caption }}</span>
      </slot>
    </mu-button>
    <mu-button
      class="mu-button mu-split-button"
      @click.stop="onTriggerClick"
      @mouseover="onTriggerMouseOver"
      @mouseleave="onTriggerMouseLeave">
      <mu-icon :icon="dropdownIcon" />
    </mu-button>
    <mu-dropdown-panel
      v-model:visible="dropdownVisible"
      width="auto"
      :align="dropdownAlign"
      :style="dropdownStyle"
      :items="dropdownItems"
      :reserve-icon-place="reserveIconPlace || null">
      <slot name="dropdown" />
    </mu-dropdown-panel>
  </div>
  <mu-button
    v-else
    class="mu-dropdown mu-dropdown-button mu-button"
    type="button"
    @click="onTriggerClick"
    @mouseover="onTriggerMouseOver"
    @mouseleave="onTriggerMouseLeave">
    <slot>
      <mu-icon v-if="icon" :icon="icon" />
      <span v-if="caption">{{ caption }}</span>
    </slot>
    <mu-icon :icon="dropdownIcon" />
    <mu-dropdown-panel
      v-model:visible="dropdownVisible"
      width="auto"
      :align="dropdownAlign"
      :style="dropdownStyle"
      :items="dropdownItems"
      :reserve-icon-place="reserveIconPlace || null">
      <slot name="dropdown" />
    </mu-dropdown-panel>
  </mu-button>
</template>

<script>
  import Dropdown from './dropdown.vue'

  export default {
    name: 'MusselDropdownButton',
    extends: Dropdown,
    props: {
      dropdownTrigger: {
        type: String,
        default: 'click',
        validator (v) {
          return ['hover', 'click'].includes(v)
        }
      },
      icon: String,
      caption: String,
      splitButton: Boolean,
      dropdownIcon: {
        type: String,
        default: 'dropdown'
      }
    }
  }
</script>
