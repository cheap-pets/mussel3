import { computed, provide } from 'vue'

export const commonInputProps = {
  modelValue: null,
  displayValue: String,
  type: String,
  label: String,
  placeholder: String,
  readonly: Boolean,
  disabled: Boolean,
  clearButton: Boolean
}

export const commonInputEvents = [
  'update:modelValue',
  'clear'
]

export function useCommonInput (props, emit) {
  const controlState = computed(() => ({
    disabled: props.disabled || null,
    readonly: props.readonly || null
  }))

  const inputValue = computed({
    get: () => props.displayValue !== undefined ? props.displayValue : props.modelValue,
    set: v => emit('update:modelValue', v)
  })

  const inputBindings = computed(() => ({
    type: props.type || 'text',
    placeholder: props.placeholder,
    disabled: props.disabled,
    readonly: props.readonly || props.editable === false
  }))

  const clearIconBindings = {
    class: 'mu-editor_clear-button',
    tag: 'a',
    icon: 'x',
    concealed: ''
  }

  const clearable = computed(() =>
    !props.disabled &&
    !props.readonly &&
    props.clearButton &&
    props.modelValue
  )

  function clear () {
    emit('update:modelValue', null)
    emit('clear')
  }

  provide('editorControlState', controlState)

  return {
    controlState,
    inputValue,
    inputBindings,
    clearIconBindings,
    clearable,
    clear
  }
}
