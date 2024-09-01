<template>
  <div
    ref="thisEl"
    class="mu-dropdown"
    @click="onTriggerClick"
    @mouseover="onTriggerMouseOver"
    @mouseleave="onTriggerMouseLeave">
    <slot />
    <Teleport :to="dropdownContainer">
      <div
        ref="dropdownEl"
        class="mu-dropdown-panel"
        v-bind="dropdownBindings"
        @click="onDropdownClick"
        @mouseover.stop="onDropdownMouseOver"
        @mouseleave.stop="onDropdownMouseLeave">
        <slot name="dropdown">
          <component
            :is="el.component"
            v-for="el in items" :key="el.key"
            v-bind="el.bindings" />
        </slot>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
  import './dropdown.scss'

  import { shallowRef } from 'vue'
  import { dropdownProps, dropdownEvents, useDropdown } from './hooks/dropdown-new'
  import { useVForComponents } from '@/hooks/v-for-components'

  defineOptions({ name: 'MusselDropdown' })

  const props = defineProps({ ...dropdownProps })
  const emit = defineEmits([...dropdownEvents])

  const thisEl = shallowRef()
  const dropdownEl = shallowRef()

  const {
    dropdownBindings,
    dropdownContainer,
    onTriggerClick,
    onTriggerMouseOver,
    onTriggerMouseLeave,
    onDropdownClick,
    onDropdownMouseOver,
    onDropdownMouseLeave
  } = useDropdown(thisEl, dropdownEl, props, emit)

  const { items } = useVForComponents(
    props,
    {
      itemsProp: 'dropdownItems',
      itemsKeyProp: 'id',
      defaultComponent: 'mu-dropdown-item'
    }
  )
</script>
