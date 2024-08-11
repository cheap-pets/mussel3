<template>
  <label class="mu-check mu-list-item mu-dropdown-item" @click="onClick">
    <input v-model="checkValue" type="checkbox" :value="value" @click.stop>
    <span>{{ label ?? value }}</span>
  </label>
</template>

<script setup>
  import { checkProps, checkEvents, useCheck } from '../input/hooks/check'
  import { dropdownItemProps, dropdownItemEvents, useDropdownItem } from './hooks/dropdown-item'

  defineOptions({ name: 'MusselDropdownCheckItem' })

  const props = defineProps({ ...dropdownItemProps, ...checkProps })
  const emit = defineEmits([...dropdownItemEvents, ...checkEvents])

  const { checkValue } = useCheck(props, emit)
  const { onClick } = useDropdownItem(props, emit)
</script>
