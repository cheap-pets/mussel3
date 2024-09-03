import { computed } from 'vue'
import { isString } from '@/utils/type'
import { generateUUID } from '@/utils/id'
import { useVForKey } from './v-for-key'

const SHORTCUTS = {
  '-': { is: 'mu-list-divider' }
}

export function useVForComponents (props, options = {}) {
  const { getObjectKey } = useVForKey()

  const {
    itemsProp = 'items',
    itemsKeyProp = 'id',
    defaultComponent = 'div'
  } = options

  const shortcuts = {
    ...SHORTCUTS,
    ...options.shortcuts
  }

  const computedItems = computed(() => {
    const { [itemsProp]: arr, [itemsKeyProp]: keyProp } = props

    return arr?.map(el => {
      if (isString(el)) {
        const shortcut = shortcuts[el]

        return shortcut
          ? { key: generateUUID(), ...shortcut }
          : { is: el }
      } else {
        const { is = defaultComponent, ...bindings } = el
        const shortcut = shortcuts[is]

        return {
          key: el[keyProp] ?? getObjectKey(el),
          is,
          ...shortcut,
          bindings
        }
      }
    })
  })

  return {
    computedItems
  }
}
