<template>
  <div
    class="mu-editor mu-combo-box"
    :readonly="readonly || null"
    :disabled="disabled || null">
    <slot name="left">
      <label v-if="label">{{ label }}</label>
    </slot>
    <input
      v-model="inputValue"
      :disabled="disabled"
      :readonly="readonly || !editable"
      :placeholder="placeholder"
      @click="toggleDropdown">
    <mu-icon
      v-if="clearButtonEnabled"
      visibility="hover"
      class="mu-link"
      icon="x"
      danger
      @click="clear" />
    <mu-icon
      v-if="!disabled && !readonly"
      class="mu-link"
      icon="dropdown"
      :expanded="dropdownVisible || null"
      @click="toggleDropdown" />
    <slot name="right" />
    <mu-dropdown-panel
      v-model:visible="dropdownVisible"
      :style="dropdownStyle"
      :align="dropdownAlign"
      :width="dropdownWidth"
      :height="dropdownHeight">
      <slot name="dropdown">
        <component
          :is="el === '-' || el.divider ? 'mu-list-divider' : 'mu-option'"
          v-for="(el, index) in options"
          :key="el === '-' ? index : el"
          v-bind="el === '-' ? {} : el" />
      </slot>
    </mu-dropdown-panel>
  </div>
</template>

<script>
  export default {
    name: 'MusselComboBox',
    provide () {
      return {
        editor: this
      }
    },
    props: {
      label: String,
      options: Array,
      modelValue: null,
      clearButton: null,
      editable: Boolean,
      readonly: Boolean,
      disabled: Boolean,
      placeholder: String,
      dropdownAlign: String,
      dropdownStyle: Object,
      dropdownWidth: String,
      dropdownHeight: String
    },
    emits: ['update:modelValue', 'dropdown:show', 'dropdown:hide'],
    data () {
      return {
        optionLabels: {},
        dropdownVisible: false,
        dropdownReady: !this.options
      }
    },
    computed: {
      inputValue: {
        get () {
          const v = this.modelValue
          return (v in this.optionLabels) ? this.optionLabels[v] : v
        },
        set (value) {
          this.$emit('update:modelValue', value)
        }
      },
      clearButtonEnabled () {
        return (
          !this.disabled && !this.readonly && this.modelValue &&
          (!['false', 'none'].includes(String(this.clearButton)))
        )
      }
    },
    watch: {
      options: {
        deep: true,
        immediate: true,
        handler (options) {
          if (Array.isArray(options)) {
            this.optionLabels = options.reduce((labels, el) => {
              labels[el.value] = el.label ?? el.value
              return labels
            }, {})
          }
        }
      }
    },
    methods: {
      clear () {
        if (this.$attrs.onClear) this.$attrs.onClear()
        else this.$emit('update:modelValue', null)
      },
      toggleDropdown () {
        if (this.disabled || this.readonly) return

        Promise
          .resolve()
          .then(() => {
            if (!this.dropdownReady) {
              this.dropdownReady = true

              return this.$nextTick()
            }
          })
          .then(() => {
            const v = !this.dropdownVisible

            this.dropdownVisible = v
            this.$emit(v ? 'dropdown:show' : 'dropdown:hide')
          })
      },
      mountOption (option) {
        if (!this.options) {
          this.optionLabels[option.value] = option.itemLabel
        }
      },
      unmountOption (option) {
        if (!this.options) {
          delete this.optionLabels[option.value]
        }
      },
      onOptionClick (option) {
        if (this.$attrs.onOptionClick?.(option) !== false) {
          this.dropdownVisible = false
          this.$emit('update:modelValue', option.value)
        }
      }
    }
  }
</script>
