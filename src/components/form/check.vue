<template>
  <label v-if="label" class="mu-check" :disabled="disabled || null">
    <input
      v-model="checkValue"
      type="checkbox"
      :value="value"
      :disabled="disabled || null">
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
      value: null,
      disabled: Boolean
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
