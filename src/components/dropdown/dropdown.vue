<template>
  <div
    ref="thisEl"
    class="mu-dropdown"
    @click="onTriggerClick"
    @mouseover="onTriggerMouseOver"
    @mouseleave="onTriggerMouseLeave">
    <slot />
    <mu-dropdown-panel
      v-model:visible="dropdownVisible"
      v-bind="dropdownPanelBindings"
      width="auto">
      <slot name="dropdown" />
    </mu-dropdown-panel>
  </div>
</template>

<script setup>
  import './dropdown.scss'

  import { ref } from 'vue'
  import { dropdownProps, dropdownEvents, useDropdown } from './hooks/dropdown'

  defineOptions({ name: 'MusselDropdown' })

  const props = defineProps({ ...dropdownProps })
  const emit = defineEmits([...dropdownEvents])
  const thisEl = ref()

  const {
    dropdownVisible,
    dropdownPanelBindings,
    onTriggerClick,
    onTriggerMouseOver,
    onTriggerMouseLeave
  } = useDropdown(thisEl, props, emit)
</script>
