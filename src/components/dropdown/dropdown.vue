<template>
  <div
    class="mu-dropdown"
    @click="onTriggerClick"
    @mouseover="onTriggerMouseOver"
    @mouseleave="onTriggerMouseLeave">
    <slot />
    <mu-dropdown-panel v-model:visible="dropdownVisible" v-bind="dropdownPanelBindings">
      <slot name="dropdown" />
    </mu-dropdown-panel>
  </div>
</template>

<script setup>
  import { dropdownProps, dropdownEvents, useDropdown } from './hooks/dropdown'

  defineOptions({ name: 'MusselDropdown' })

  const props = defineProps({ ...dropdownProps })
  const emit = defineEmits([...dropdownEvents])

  const {
    dropdownVisible,
    dropdownPanelBindings,
    onTriggerClick,
    onTriggerMouseOver,
    onTriggerMouseLeave
  } = useDropdown(props, emit)
</script>
