import { computed } from 'vue'
import { isString } from '@/utils/type'

export const inputProps = {
  label: String,
  placeholder: String,
  readonly: Boolean,
  disabled: Boolean,
  clearButton: Boolean,
  prefix: [String, Object],
  suffix: [String, Object],
  tabindex: { default: '-1' }
}

export const inputEvents = [
  'prefixClick',
  'suffixClick',
  'clear'
]

export function useInput (model, props, emit) {
  const wrapperAttrs = computed(() => ({
    disabled: props.disabled || null,
    readonly: props.readonly || null
  }))

  const inputAttrs = computed(() => ({
    type: props.type || 'text',
    disabled: props.disabled,
    readonly: props.readonly || props.editable === false,
    placeholder: props.placeholder
  }))

  const AffixResolver = {
    icon: ({ value, ...attrs }) => ({ is: 'mu-icon', attrs: { icon: value, ...attrs } }),
    tool: ({ value, ...attrs }) => ({ is: 'mu-icon', attrs: { tag: 'a', icon: value, ...attrs } }),
    text: ({ value, ...attrs }) => ({ is: 'span', content: value, attrs }),
    link: ({ value, ...attrs }) => ({ is: 'a', content: value, attrs })
  }

  const AFFIX_PATTERN = /^:(?<type>icon|text|tool|link)?=(?<value>.+)?$/

  function resolveAffixComponent (option) {
    if (!option) return

    const { type = 'text', ...opts } = isString(option)
      ? AFFIX_PATTERN.exec(option)?.groups || { value: option }
      : Object(option)

    return AffixResolver[type]?.(opts)
  }

  const prefix = computed(() => resolveAffixComponent(props.prefix))
  const suffix = computed(() => resolveAffixComponent(props.suffix))

  function onPrefixClick () {
    emit('prefixClick')
  }

  function onSuffixClick () {
    emit('suffixClick')
  }

  const clearButtonAttrs = {
    class: 'mu-input_clear-button',
    tag: 'a',
    icon: 'x',
    concealed: ''
  }

  const clearButtonVisible = computed(() =>
    !props.disabled &&
    !props.readonly &&
    props.clearButton &&
    model.value != null &&
    model.value !== ''
  )

  function clear () {
    model.value = null
    emit('clear')
  }

  return {
    wrapperAttrs,
    inputAttrs,
    prefix,
    suffix,
    onPrefixClick,
    onSuffixClick,
    clearButtonVisible,
    clearButtonAttrs,
    clear
  }
}
