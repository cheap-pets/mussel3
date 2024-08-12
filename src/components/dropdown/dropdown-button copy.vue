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
      class="mu-button mu-icon-button"
      @click.stop="onTriggerClick"
      @mouseover="onTriggerMouseOver"
      @mouseleave="onTriggerMouseLeave">
      <mu-icon v-bind="dropdownIconBindings" />
    </mu-button>
    <mu-dropdown-panel
      v-model:visible="dropdownVisible"
      v-bind="dropdownPanelBindings"
      width="auto">
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
    <mu-icon v-bind="dropdownIconBindings" />
    <mu-dropdown-panel
      v-model:visible="dropdownVisible"
      v-bind="dropdownPanelBindings"
      width="auto">
      <slot name="dropdown" />
    </mu-dropdown-panel>
  </mu-button>
</template>

<script setup>
  import './dropdown-button.scss'

  import { buttonGroupProps, useButtonGroup } from '../button/button-group-hook'
  import { dropdownProps, dropdownEvents, useDropdown } from './hooks/dropdown'

  defineOptions({ name: 'MusselDropdownButton' })

  const props = defineProps({
    ...dropdownProps,
    ...buttonGroupProps,
    icon: String,
    caption: String,
    splitButton: Boolean
  })

  useButtonGroup(props)

  const emit = defineEmits([...dropdownEvents])

  const {
    dropdownVisible,
    dropdownIconBindings,
    dropdownPanelBindings,
    onTriggerClick,
    onTriggerMouseOver,
    onTriggerMouseLeave
  } = useDropdown(props, emit)
</script>
