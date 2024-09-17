<template>
  <div ref="thisEl" class="mu-editor mu-combo-box" v-bind="controlState">
    <label v-if="label">{{ label }}</label>
    <slot name="prepend" />
    <input v-model="inputValue" v-bind="inputBindings" @click="onTriggerClick">
    <mu-icon v-if="clearable" v-bind="clearIconBindings" @click="onClear" />
    <mu-icon v-if="expandable" v-bind="dropdownArrowBindings" @click="onTriggerClick" />
    <slot name="append" />
    <Teleport v-if="expandable && dropdownReady" :to="dropdownContainer">
      <div
        ref="dropdownEl"
        v-mu-scrollbar="dropdownScrollbar"
        v-bind="dropdownBindings"
        class="mu-dropdown-panel"
        @click="onDropdownClick">
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
  import { ref, shallowRef, computed, provide, watch } from 'vue'
  import { useDropdown } from '../dropdown/hooks/dropdown'
  import { useVForComponents } from '@/hooks/v-for-components'
  import { commonInputProps, commonInputEvents, useCommonInput } from './hooks/common-input'

  defineOptions({ name: 'MusselComboBox' })

  const props = defineProps({
    editable: Boolean,
    dropdownClass: null,
    dropdownStyle: null,
    dropdownAttrs: Object,
    dropdownScrollbar: [Boolean, String],
    options: Array,
    optionKey: { type: String, default: 'value' },
    ...commonInputProps
  })

  const emit = defineEmits([
    'dropdown:show',
    'dropdown:hide',
    ...commonInputEvents
  ])

  const thisEl = shallowRef()
  const dropdownEl = shallowRef()

  const {
    controlState,
    inputBindings,
    clearIconBindings,
    clearable,
    clear
  } = useCommonInput(props, emit)

  const {
    dropdownReady,
    dropdownBindings,
    dropdownContainer,
    dropdownArrowBindings,
    show: showDropdown,
    hide: hideDropdown,
    onTriggerClick,
    onDropdownClick
  } = useDropdown(thisEl, dropdownEl, props, emit)

  const { computedItems } = useVForComponents(
    props,
    {
      itemsProp: 'options',
      itemsKeyProp: 'optionKey',
      defaultComponent: 'mu-option'
    }
  )

  const optionLabels = ref({})

  const expandable = computed(() => !props.disabled && !props.readonly)

  const inputValue = computed({
    get () {
      const { displayValue, modelValue: v } = props

      return displayValue === undefined
        ? v in optionLabels.value
          ? optionLabels.value[v]
          : v
        : displayValue
    },
    set (value) {
      emit('update:modelValue', value)
    }
  })

  watch(
    () => props.options,
    () => {
      optionLabels.value =
        props.options?.reduce(
          (result, option) => Object.assign(result, {
            [option.value]: option.label ?? option.value
          }),
          {}
        ) || {}
    },
    {
      deep: true,
      immediate: true
    }
  )

  function mountOption (option) {
    if (!props.options) {
      optionLabels.value[option.value] = option.itemLabel
    }
  }

  function unmountOption (option) {
    if (!props.options) {
      delete optionLabels.value[option.value]
    }
  }

  function onClear () {
    clear()
    hideDropdown()
  }

  function onOptionClick (option) {
    emit('update:modelValue', option.value)
    hideDropdown()
  }

  provide('comboBox', {
    mountOption,
    unmountOption,
    onOptionClick
  })

  defineExpose({
    showDropdown,
    hideDropdown
  })
</script>
