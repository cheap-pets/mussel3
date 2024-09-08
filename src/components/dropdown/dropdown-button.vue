<template>
  <mu-tool-button
    v-if="toolButton"
    ref="thisEl" class="mu-dropdown mu-expand-icon" v-bind="$attrs"
    expand-type="dropdown" :expanded="dropdownVisible || null" :icon="icon || 'chevronDown'"
    @click="onTriggerClick" @mouseover="onTriggerMouseOver" @mouseleave="onTriggerMouseLeave" />
  <mu-button-group
    v-else-if="splitButton"
    ref="thisEl" class="mu-dropdown" v-bind="$attrs">
    <mu-button :icon="icon" :caption="caption" @click="hideDropdown">
      <slot />
    </mu-button>
    <mu-button
      class="mu-button mu-icon-button"
      @click.stop="onTriggerClick" @mouseover="onTriggerMouseOver" @mouseleave="onTriggerMouseLeave">
      <mu-expand-icon :expanded="dropdownVisible" />
    </mu-button>
  </mu-button-group>
  <mu-button
    v-else
    ref="thisEl" class="mu-dropdown" v-bind="$attrs"
    @click="onTriggerClick" @mouseover="onTriggerMouseOver" @mouseleave="onTriggerMouseLeave">
    <slot>
      <mu-icon v-if="icon" :icon="icon" />
      {{ caption }}
    </slot>
    <mu-expand-icon v-if="arrow" :expanded="dropdownVisible" />
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
</template>

<script setup>
  import { shallowRef } from 'vue'
  import { dropdownProps, dropdownEvents, useDropdown } from './hooks/dropdown'
  import { useVForComponents } from '@/hooks/v-for-components'

  defineOptions({ name: 'MusselDropdownButton', inheritAttrs: false })

  const props = defineProps({
    icon: String,
    caption: String,
    toolButton: Boolean,
    splitButton: Boolean,
    dropdownItems: Array,
    arrow: { type: Boolean, default: true },
    ...dropdownProps
  })

  const emit = defineEmits([...dropdownEvents])

  const thisEl = shallowRef()
  const dropdownEl = shallowRef()

  const {
    dropdownReady,
    dropdownVisible,
    dropdownBindings,
    dropdownContainer,
    hide: hideDropdown,
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
</script>
