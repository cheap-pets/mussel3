<template>
  <div
    ref="thisEl"
    class="mu-dropdown mu-dropdown-button"
    :class="{ 'mu-button-group': splitButton }"
    @click="onClick"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave">
    <mu-button>
      <slot>
        <mu-icon v-if="icon" :icon="icon" />
        <span v-if="caption">{{ caption }}</span>
      </slot>
      <mu-icon v-if="!splitButton" v-bind="dropdownIconBindings" />
    </mu-button>
    <mu-button
      v-if="splitButton"
      class="mu-button mu-icon-button"
      @click.stop="onTriggerClick"
      @mouseover.stop="onTriggerMouseOver"
      @mouseleave.stop="onTriggerMouseLeave">
      <mu-icon v-bind="dropdownIconBindings" />
    </mu-button>
    <mu-dropdown-panel
      v-model:visible="dropdownVisible"
      v-bind="dropdownPanelBindings"
      width="auto">
      <slot name="dropdown" />
    </mu-dropdown-panel>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { buttonGroupProps, useButtonGroup } from '../button/hooks/button-group'
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
  const thisEl = ref()

  const {
    dropdownVisible,
    dropdownIconBindings,
    dropdownPanelBindings,
    hideDropdown,
    onTriggerClick,
    onTriggerMouseOver,
    onTriggerMouseLeave
  } = useDropdown(thisEl, props, emit)

  function onClick () {
    if (!props.splitButton) onTriggerClick()
    else hideDropdown()
  }

  function onMouseOver () {
    if (!props.splitButton) onTriggerMouseOver()
  }

  function onMouseLeave () {
    if (!props.splitButton) onTriggerMouseLeave()
  }
</script>
