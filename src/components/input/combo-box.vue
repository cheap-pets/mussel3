<template>
  <div ref="thisEl" class="mu-editor mu-combo-box" v-bind="controlState">
    <label v-if="label">{{ label }}</label>
    <slot name="prepend" />
    <input v-model="inputValue" v-bind="inputBindings" @click="onTriggerClick">
    <mu-icon v-if="clearable" v-bind="clearIconBindings" @click="onClear" />
    <mu-icon v-if="expandable" v-bind="dropdownIconBindings" @click="onTriggerClick" />
    <slot name="append" />
    <mu-dropdown-panel v-model:visible="dropdownVisible" v-bind="dropdownPanelBindings">
      <slot name="dropdown">
        <component
          :is="el.component"
          v-for="el in items"
          :key="el.key"
          v-bind="el.bindings" />
      </slot>
    </mu-dropdown-panel>
  </div>
</template>

<script setup>
  import { ref, computed, provide, watch } from 'vue'
  import { commonInputProps, commonInputEvents, useCommonInput } from './hooks/common-input'
  import { dropdownEvents, useDropdown } from '../dropdown/hooks/dropdown'
  import { useVForComponents } from '@/hooks/v-for-components'

  defineOptions({ name: 'MusselComboBox' })

  const props = defineProps({
    editable: Boolean,
    dropdownPanel: Object,
    options: Array,
    optionKey: { type: String, default: 'value' },
    ...commonInputProps
  })

  const emit = defineEmits([
    ...commonInputEvents,
    ...dropdownEvents
  ])

  const thisEl = ref()

  const {
    controlState,
    inputBindings,
    clearIconBindings,
    clearable,
    clear
  } = useCommonInput(props, emit)

  const {
    dropdownVisible,
    dropdownIconBindings,
    dropdownPanelBindings,
    showDropdown,
    hideDropdown,
    onTriggerClick
  } = useDropdown(thisEl, props, emit)

  const { items } = useVForComponents(
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
