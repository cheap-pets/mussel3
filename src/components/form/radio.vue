<template>
  <label v-if="label" class="mu-radio" :disabled="disabled || null">
    <input
      v-model="radioValue"
      type="radio"
      :value="value"
      :disabled="disabled || null">
    <span>{{ label }}</span>
  </label>
  <input
    v-else
    v-model="radioValue"
    class="mu-radio"
    type="radio"
    :value="value">
</template>

<script>
  export default {
    name: 'MusselRadio',
    props: {
      modelValue: null,
      label: String,
      value: {
        required: true
      },
      disabled: Boolean
    },
    emits: ['update:modelValue'],
    computed: {
      radioValue: {
        get () {
          return this.modelValue
        },
        set (v) {
          this.$emit('update:modelValue', this.value)
        }
      }
    }
  }
</script>
