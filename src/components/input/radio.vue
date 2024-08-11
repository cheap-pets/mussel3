<template>
  <label v-if="label" class="mu-radio" :disabled="disabled || null">
    <input v-model="radioValue" type="radio" :value="value" :disabled="disabled">
    <span>{{ label }}</span>
  </label>
  <input v-else v-model="radioValue" class="mu-radio" type="radio" :value="value">
</template>

<script setup>
  import './check.scss'

  import { radioProps, radioEvents, useRadio } from './hooks/radio'

  defineOptions({ name: 'MusselRadio' })

  const props = defineProps({ ...radioProps })
  const emit = defineEmits([...radioEvents])

  const { radioValue } = useRadio(props, emit)
</script>
