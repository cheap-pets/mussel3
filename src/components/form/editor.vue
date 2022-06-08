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
      value: null,
      label: String,
      readonly: Boolean,
      disabled: Boolean,
      placeholder: String,
      clearButton: Boolean
    },
    emits: ['update:value'],
    computed: {
      inputValue: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('update:value', value)
        }
      },
      clearButtonVisible () {
        return (
          !this.disabled &&
          !this.readonly &&
          (this.clearButton || this.$attrs.onClear) &&
          this.value
        )
      }
    },
    methods: {
      clear () {
        if (this.$attrs.onClear) this.$attrs.onClear()
        else this.$emit('update:value', '')
      },
      toggleDropdown () {
        this.expanded = !this.expanded || null
      }
    }
  }
</script>
