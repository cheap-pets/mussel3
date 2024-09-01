import { generateUUID } from '@/utils/id'

export function useVForKey () {
  const keys = new WeakMap()

  function getObjectKey (obj) {
    let key = keys.get(obj)

    if (!key) {
      key = generateUUID()
      keys.set(obj, key)
    }

    return key
  }

  return {
    getObjectKey
  }
}
