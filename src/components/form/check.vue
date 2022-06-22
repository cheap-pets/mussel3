<template>
  <label v-if="label" class="mu-check">
    <input
      v-model="checkValue"
      type="checkbox"
      :value="value">
    <span>{{ label }}</span>
  </label>
  <input
    v-else
    v-model="checkValue"
    class="mu-check"
    type="checkbox"
    :value="value">
</template>

<script>
  export default {
    name: 'MusselCheck',
    props: {
      modelValue: [Boolean, Array],
      label: String,
      value: null
    },
    emits: ['update:modelValue'],
    computed: {
      checkValue: {
        get () {
          return this.modelValue
        },
        set (v) {
          this.$emit('update:modelValue', v)
        }
      }
    }
  }
</script>
