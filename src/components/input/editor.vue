<template>
  <div class="mu-edit" v-bind="editAttrs">
    <label v-if="label">{{ label }}</label>
    <slot name="prepend" />
    <input v-model="inputValue" v-bind="inputAttrs">
    <mu-icon v-if="clearButtonVisible" v-bind="clearButtonAttrs" @click="clear" />
    <slot name="append" />
  </div>
</template>

<script setup>
  import './editor.scss'

  import {
    inputProps,
    inputEvents,
    useInput
  } from './hooks/input'

  defineOptions({ name: 'MusselEditor' })

  const props = defineProps({ ...inputProps })
  const emit = defineEmits([...inputEvents])

  const {
    editAttrs,
    inputValue,
    inputAttrs,
    clearButtonVisible,
    clearButtonAttrs,
    clear
  } = useInput(props, emit)
</script>
