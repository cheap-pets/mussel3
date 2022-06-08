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
      :dropdown-width="dropdownWidth"
      :dropdown-height="dropdownHeight"
      :style="dropdownStyle">
      <slot name="dropdown">
        <template v-if="options">
          <mu-option
            v-for="(el, index) in options"
            :key="Object(el).value ?? index"
            :item="el" />
        </template>
      </slot>
    </mu-dropdown-panel>
  </div>
</template>

<script>
  import { delay } from '@/utils/timer'
  import { isString } from '@/utils/type'

  export default {
    name: 'MusselComboBox',
    provide () {
      return {
        editor: this
      }
    },
    props: {
      text: null,
      value: null,
      label: String,
      options: Array,
      readonly: Boolean,
      disabled: Boolean,
      searchable: Boolean,
      placeholder: String,
      dropdownStyle: Object,
      dropdownWidth: String,
      dropdownHeight: String
    },
    emits: ['update:value', 'dropdown:show', 'dropdown:hide'],
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
            : this.text ?? this.optionLabels[this.value]
        },
        set (value) {
          this.searchText = value
        }
      },
      clearButtonVisible () {
        return (
          !this.disabled && !this.readonly && this.value &&
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
        else this.$emit('update:value', null)
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
          this.optionLabels[option.itemValue] = option.itemLabel
        }
      },
      unmountOption (option) {
        if (!this.options) {
          delete this.optionLabels[option.itemValue]
        }
      },
      onOptionClick (option) {
        if (this.$attrs.onOptionClick?.(option) !== false) {
          this.dropdownVisible = false
          this.$emit('update:value', option.itemValue)
        }
      },
      includes (value) {

      },
      isString
    }
  }
</script>
