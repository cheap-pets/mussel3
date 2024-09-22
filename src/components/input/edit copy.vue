<template>
  <div class="mu-edit" v-bind="editAttrs">
    <div v-if="$slots.prepend" class="mu-edit_addon-prepend">
      <slot name="prepend" />
    </div>
    <div class="mu-edit_input-wrapper">
      <component
        :is="pre.is"
        v-if="pre"
        v-bind="pre.attrs"
        class="mu-edit_prefix"
        @click="emit('prefixClick')">
        {{ pre.content }}
      </component>
      <input v-model="inputValue" v-bind="inputAttrs">
      <mu-icon v-if="clearButtonVisible" v-bind="clearButtonAttrs" @click="clear" />
      <component
        :is="suf.is"
        v-if="suf"
        v-bind="suf.attrs"
        class="mu-edit_suffix"
        @click="emit('suffixClick')">
        {{ suf.content }}
      </component>
    </div>
    <div v-if="$slots.append" class="mu-edit_addon-append">
      <slot name="append" />
    </div>
  </div>
</template>

<script setup>
  import './edit.scss'

  import { inputProps, inputEvents, useInput } from './hooks/input'

  defineOptions({ name: 'MusselEdit' })

  const props = defineProps({ ...inputProps })
  const emit = defineEmits([...inputEvents])

  const {
    editAttrs,
    inputValue,
    inputAttrs,
    prefix: pre,
    suffix: suf,
    clearButtonVisible,
    clearButtonAttrs,
    clear
  } = useInput(props, emit)
</script>
