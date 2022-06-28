<template>
  <label class="mu-radio mu-list-item mu-dropdown-item" @click="onClick">
    <input
      v-model="radioValue"
      type="radio"
      :value="value"
      @click.stop>
    <span>{{ label ?? value }}</span>
  </label>
</template>

<script>
  import MusselDropdownItem from './dropdown-item.vue'
  import MusselRadio from '../form/radio.vue'

  export default {
    name: 'MusselDropdownRadioItem',
    mixins: [MusselRadio, MusselDropdownItem]
  }
</script>
