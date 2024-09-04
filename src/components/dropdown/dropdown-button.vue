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
      <mu-expand-icon v-if="!splitButton" :expanded="dropdownVisible" />
    </mu-button>
    <mu-button
      v-if="splitButton"
      class="mu-button mu-icon-button"
      @click.stop="onTriggerClick"
      @mouseover.stop="onTriggerMouseOver"
      @mouseleave.stop="onTriggerMouseLeave">
      <mu-expand-icon :expanded="dropdownVisible" />
    </mu-button>
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
  import { shallowRef } from 'vue'
  import { buttonGroupProps, useButtonGroup } from '../button/hooks/button-group'
  import { dropdownProps, dropdownEvents, useDropdown } from './hooks/dropdown'
  import { useVForComponents } from '@/hooks/v-for-components'

  defineOptions({ name: 'MusselDropdownButton' })

  const props = defineProps({
    icon: String,
    caption: String,
    splitButton: Boolean,
    dropdownItems: Array,
    ...dropdownProps,
    ...buttonGroupProps
  })

  const emit = defineEmits([...dropdownEvents])

  const thisEl = shallowRef()
  const dropdownEl = shallowRef()

  useButtonGroup(props)

  const {
    dropdownReady,
    dropdownVisible,
    dropdownBindings,
    dropdownContainer,
    hideDropdown,
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
      itemsKeyProp: 'id',
      defaultComponent: 'mu-dropdown-item'
    }
  )

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
