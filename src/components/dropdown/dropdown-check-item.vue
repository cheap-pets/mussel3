<template>
  <label class="mu-check mu-list-item mu-dropdown-item" @click="onClick">
    <input
      v-model="checkValue"
      type="checkbox"
      :value="value">
    <span>{{ itemLabel ?? value }}</span>
  </label>
</template>

<script>
  import MusselDropdownItem from './dropdown-item.vue'
  import MusselCheck from '../form/check.vue'

  export default {
    name: 'MusselDropdownCheckItem',
    mixins: [MusselCheck, MusselDropdownItem]
  }
</script>
