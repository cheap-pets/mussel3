import { isString } from './type'

export function findUp (target, callback) {
  while (Object(target).nodeType === 1) {
    const ret = callback(target)

    if (ret) return target
    else if (ret === false) break

    target = target.parentNode
  }
}

export function resolveElement (el) {
  return isString(el) ? document.querySelector(el) : el
}
