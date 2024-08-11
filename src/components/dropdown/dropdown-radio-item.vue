<template>
  <label class="mu-radio mu-list-item mu-dropdown-item" @click="onClick">
    <input v-model="radioValue" type="radio" :value="value" @click.stop>
    <span>{{ label ?? value }}</span>
  </label>
</template>

<script setup>
  import { radioProps, radioEvents, useRadio } from '../input/hooks/radio'
  import { dropdownItemProps, dropdownItemEvents, useDropdownItem } from './hooks/dropdown-item'

  defineOptions({ name: 'MusselDropdownRadioItem' })

  const props = defineProps({ ...dropdownItemProps, ...radioProps })
  const emit = defineEmits([...dropdownItemEvents, ...radioEvents])

  const { radioValue } = useRadio(props, emit)
  const { onClick } = useDropdownItem(props, emit)
</script>
