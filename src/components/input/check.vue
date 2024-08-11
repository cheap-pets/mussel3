<template>
  <label v-if="label" class="mu-check" :disabled="disabled || null">
    <input v-model="checkValue" type="checkbox" :value="value" :disabled="disabled">
    <span>{{ label }}</span>
  </label>
  <input v-else v-model="checkValue" class="mu-check" type="checkbox" :value="value">
</template>

<script setup>
  import './check.scss'

  import { checkProps, checkEvents, useCheck } from './hooks/check'

  defineOptions({ name: 'MusselCheck' })

  const props = defineProps({ ...checkProps })
  const emit = defineEmits([...checkEvents])

  const { checkValue } = useCheck(props, emit)
</script>
