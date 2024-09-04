<template>
  <div
    ref="thisEl"
    class="mu-dropdown"
    @click="onTriggerClick"
    @mouseover="onTriggerMouseOver"
    @mouseleave="onTriggerMouseLeave">
    <slot />
    <Teleport v-if="dropdownReady" :to="dropdownContainer">
      <div
        ref="dropdownEl"
        v-mu-scrollbar="dropdownScrollbar"
        v-bind="dropdownBindings"
        class="mu-dropdown-panel"
        @click="onDropdownClick"
        @mouseover.stop="onDropdownMouseOver"
        @mouseleave.stop="onDropdownMouseLeave">
        <slot name="dropdown">
          <component
            :is="el.is"
            v-for="el in computedItems" :key="el.key"
            v-bind="el.bindings" />
        </slot>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
  import './dropdown.scss'

  import { shallowRef } from 'vue'
  import { dropdownProps, dropdownEvents, useDropdown } from './hooks/dropdown'
  import { useVForComponents } from '@/hooks/v-for-components'

  defineOptions({ name: 'MusselDropdown' })

  const props = defineProps({ dropdownItems: Array, ...dropdownProps })
  const emit = defineEmits([...dropdownEvents])

  const thisEl = shallowRef()
  const dropdownEl = shallowRef()

  const {
    dropdownReady,
    dropdownBindings,
    dropdownContainer,
    onTriggerClick,
    onTriggerMouseOver,
    onTriggerMouseLeave,
    onDropdownClick,
    onDropdownMouseOver,
    onDropdownMouseLeave
  } = useDropdown(thisEl, dropdownEl, props, emit)

  const { computedItems } = useVForComponents(
    props,
    {
      itemsProp: 'dropdownItems',
      defaultComponent: 'mu-dropdown-item'
    }
  )
</script>
