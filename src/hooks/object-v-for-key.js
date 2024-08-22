import { generateUUID } from '@/utils/id'

export function useObjectVForKey () {
  const keys = new WeakMap()

  function getKey (obj) {
    let key = keys.get(obj)

    if (!key) {
      key = generateUUID()
      keys.set(obj, key)
    }

    return key
  }

  return {
    getKey
  }
}
