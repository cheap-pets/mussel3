import { computed } from 'vue'

export const checkProps = {
  modelValue: [Boolean, Array],
  value: null,
  label: String,
  disabled: Boolean
}

export const checkEvents = [
  'update:modelValue'
]

export function useCheck (props, emit) {
  const checkValue = computed({
    get () {
      return props.modelValue
    },
    set (v) {
      emit('update:modelValue', v)
    }
  })

  return {
    checkValue
  }
}
