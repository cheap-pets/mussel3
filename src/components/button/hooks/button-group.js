import { provide } from 'vue'

export const buttonGroupProps = {
  primary: Boolean,
  danger: Boolean,
  accent: Boolean,
  xColor: [Boolean, String],
  small: Boolean,
  round: Boolean,
  disabled: Boolean,
  buttonStyle: {
    type: String,
    validator: v => ['normal', 'outline'].includes(v)
  }
}

export function useButtonGroup (props) {
  provide('groupedButtonOptions', props)
}
