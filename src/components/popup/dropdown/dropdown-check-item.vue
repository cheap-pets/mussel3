<template>
  <label class="mu-check mu-list-item mu-dropdown-item" @click="onClick">
    <input
      v-model="checkValue"
      type="checkbox"
      :value="value"
      @click.stop>
    <span>{{ itemLabel ?? value }}</span>
  </label>
</template>

<script>
  import MusselDropdownItem from './dropdown-item.vue'
  import MusselCheck from '../../input/check.vue'

  export default {
    name: 'MusselDropdownCheckItem',
    mixins: [MusselCheck, MusselDropdownItem]
  }
</script>
