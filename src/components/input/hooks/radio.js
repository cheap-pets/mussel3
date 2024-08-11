import { computed } from 'vue'

export const radioProps = {
  modelValue: null,
  value: { required: true },
  label: String,
  disabled: Boolean
}

export const radioEvents = [
  'update:modelValue'
]

export function useRadio (props, emit) {
  const radioValue = computed({
    get () {
      return props.modelValue
    },
    set (v) {
      emit('update:modelValue', props.value)
    }
  })

  return {
    radioValue
  }
}
