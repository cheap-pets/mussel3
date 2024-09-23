<template>
  <div class="mu-edit" v-bind="editAttrs" :tabindex="tabindex">
    <component :is="pre.is" v-if="pre" v-bind="pre.attrs" class="mu-edit_prefix" @click="onPrefixClick">
      {{ pre.content }}
    </component>
    <input ref="inputEl" v-model="inputValue" v-bind="inputAttrs">
    <mu-icon v-if="clearButtonVisible" v-bind="clearButtonAttrs" @click="clear" />
    <component :is="suf.is" v-if="suf" v-bind="suf.attrs" class="mu-edit_suffix" @click="onSuffixClick">
      {{ suf.content }}
    </component>
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
    inputEl,
    inputValue,
    inputAttrs,
    prefix: pre,
    suffix: suf,
    onPrefixClick,
    onSuffixClick,
    clearButtonVisible,
    clearButtonAttrs,
    clear
  } = useInput(props, emit)
</script>
