<template>
  <div ref="thisEl" class="mu-edit mu-combo-box" v-bind="editAttrs" :tabindex="tabindex">
    <component :is="pre.is" v-if="pre" v-bind="pre.attrs" class="mu-edit_prefix" @click="onPrefixClick">
      {{ pre.content }}
    </component>
    <input ref="inputEl" v-model="inputValue" v-bind="inputAttrs" @click="onTriggerClick">
    <mu-icon v-if="clearButtonVisible" v-bind="clearButtonAttrs" @click="onClear" />
    <mu-icon v-if="expandable" tag="a" v-bind="dropdownArrowBindings" @click="onTriggerClick" />
    <component :is="suf.is" v-if="suf" v-bind="suf.attrs" class="mu-edit_suffix" @click="onSuffixClick">
      {{ suf.content }}
    </component>
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
  import { inputProps, inputEvents, useInput } from './hooks/input'

  defineOptions({ name: 'MusselComboBox' })

  const props = defineProps({
    editable: Boolean,
    dropdownHost: null,
    dropdownClass: null,
    dropdownStyle: null,
    dropdownAttrs: Object,
    dropdownScrollbar: [Boolean, String],
    options: Array,
    optionKey: { type: String, default: 'value' },
    ...inputProps
  })

  const emit = defineEmits([
    'dropdown:show',
    'dropdown:hide',
    ...inputEvents
  ])

  const thisEl = shallowRef()
  const dropdownEl = shallowRef()

  const {
    editAttrs,
    inputEl,
    inputAttrs,
    prefix: pre,
    suffix: suf,
    onPrefixClick,
    onSuffixClick,
    clearButtonVisible,
    clearButtonAttrs,
    clear
  } = useInput(props, emit)

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
