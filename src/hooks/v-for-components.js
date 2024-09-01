import { computed } from 'vue'
import { isString } from '@/utils/type'
import { generateUUID } from '@/utils/id'
import { useVForKey } from './v-for-key'

export function useVForComponents (props, options = {}) {
  const { getObjectKey } = useVForKey()

  const {
    itemsProp = 'items',
    itemsKeyProp = 'id',
    defaultComponent = 'div',
    shortcuts = { '-': { component: 'div', class: 'mu-list-divider' } }
  } = options

  const items = computed(() => {
    const { [itemsProp]: arr, [itemsKeyProp]: keyProp } = props

    return arr?.map(el => {
      if (isString(el)) {
        const shortcut = shortcuts[el]

        return shortcut
          ? { key: generateUUID(), ...shortcut }
          : { component: el }
      }

      const { component = defaultComponent, ...bindings } = el

      return {
        key: el[keyProp] ?? getObjectKey(el),
        component,
        bindings
      }
    })
  })

  return {
    items
  }
}
