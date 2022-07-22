<template>
  <div
    class="mu-editor mu-box"
    :readonly="readonly || null"
    :disabled="disabled || null">
    <slot name="left">
      <label v-if="label">{{ label }}</label>
    </slot>
    <input
      v-model="inputValue"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder">
    <mu-icon
      v-if="clearButtonVisible"
      visibility="hover"
      class="mu-link"
      icon="x"
      danger
      @click="clear" />
    <slot name="right" />
  </div>
</template>

<script>
  export default {
    name: 'MusselEditor',
    props: {
      label: String,
      modelValue: null,
      readonly: Boolean,
      disabled: Boolean,
      placeholder: String,
      clearButton: Boolean
    },
    emits: ['update:modelValue'],
    computed: {
      inputValue: {
        get () {
          return this.modelValue
        },
        set (value) {
          this.$emit('update:modelValue', value)
        }
      },
      clearButtonVisible () {
        return (
          !this.disabled &&
          !this.readonly &&
          (this.clearButton || this.$attrs.onClear) &&
          this.modelValue
        )
      }
    },
    methods: {
      clear () {
        if (this.$attrs.onClear) this.$attrs.onClear()
        else this.$emit('update:modelValue', '')
      },
      toggleDropdown () {
        this.expanded = !this.expanded || null
      }
    }
  }
</script>
