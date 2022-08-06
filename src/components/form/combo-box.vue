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
      dropdown-trigger
      :disabled="disabled"
      :readonly="readonly || !searchable"
      :placeholder="placeholder"
      @click="toggleDropdown"
      @blur="searching = false">
    <mu-icon
      v-if="clearButtonVisible"
      visibility="hover"
      class="mu-link"
      icon="x"
      danger
      @click="clear" />
    <mu-icon
      v-if="!disabled && !readonly"
      class="mu-link"
      dropdown-trigger
      icon="dropdown"
      :expanded="dropdownVisible || null"
      @click="toggleDropdown" />
    <slot name="right" />
    <mu-dropdown-panel
      v-model:visible="dropdownVisible"
      :style="dropdownStyle"
      :align="dropdownAlign"
      :width="dropdownWidth"
      :height="dropdownHeight"
      :reserve-icon-place="reserveIconPlace || null">
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
  import { delay } from '@/utils/timer'

  export default {
    name: 'MusselComboBox',
    provide () {
      return {
        editor: this
      }
    },
    props: {
      text: null,
      label: String,
      options: Array,
      modelValue: null,
      readonly: Boolean,
      disabled: Boolean,
      searchable: Boolean,
      placeholder: String,
      dropdownAlign: String,
      dropdownStyle: Object,
      dropdownWidth: String,
      dropdownHeight: String,
      reserveIconPlace: Boolean
    },
    emits: ['update:modelValue', 'dropdown:show', 'dropdown:hide'],
    data () {
      return {
        searching: false,
        searchText: '',
        optionLabels: {},
        dropdownVisible: false,
        dropdownReady: !this.options
      }
    },
    computed: {
      inputValue: {
        get () {
          return this.searching
            ? this.searchText
            : this.text ?? this.optionLabels[this.modelValue]
        },
        set (value) {
          this.searchText = value
        }
      },
      clearButtonVisible () {
        return (
          !this.disabled && !this.readonly && this.modelValue &&
          (this.$attrs.onClear || !this.searchable) && !this.searching &&
          (!['0', 'none', 'false', false].includes(this.$attrs['clear-button']))
        )
      }
    },
    watch: {
      options: {
        deep: true,
        immediate: true,
        handler (options) {
          if (!Array.isArray(options)) return
          this.optionLabels = options.reduce(
            (p, el) => {
              p[el.value] = el.label ?? el.value
              return p
            },
            {}
          )
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

              return delay()
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
      },
      includes (value) {
        return false
      }
    }
  }
</script>
