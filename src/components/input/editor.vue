<template>
  <div class="mu-editor" v-bind="controlState">
    <label v-if="label">{{ label }}</label>
    <slot name="left" />
    <input v-model="inputValue" v-bind="inputBindings">
    <mu-icon v-if="clearable" v-bind="clearIconBindings" @click="clear" />
    <slot name="right" />
  </div>
</template>

<script setup>
  import './editor.scss'

  import {
    commonInputProps,
    commonInputEvents,
    useCommonInput
  } from './hooks/common-input'

  defineOptions({ name: 'MusselEditor' })

  const props = defineProps({ ...commonInputProps })
  const emit = defineEmits([...commonInputEvents])

  const {
    controlState,
    inputValue,
    inputBindings,
    clearIconBindings,
    clearable,
    clear
  } = useCommonInput(props, emit)
</script>
