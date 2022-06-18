<template>
  <label v-if="label" class="mu-radio">
    <input
      v-model="isChecked"
      type="radio"
      :name="name"
      :value="value">
    <span>{{ label }}</span>
  </label>
  <input
    v-else
    v-model="isChecked"
    class="mu-radio"
    type="radio"
    :name="name"
    :value="value">
</template>

<script>
  export default {
    name: 'MusselCheck',
    props: {
      name: String,
      label: String,
      checked: Boolean,
      value: null
    },
    emits: ['update:checked'],
    computed: {
      isChecked: {
        get () {
          return this.checked
        },
        set (v) {
          this.$emit('update:checked', v)
        }
      }
    }
  }
</script>
