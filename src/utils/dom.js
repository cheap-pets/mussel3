export function findUp (target, callback) {
  while (Object(target).nodeType === 1) {
    const ret = callback(target)

    if (ret) return target
    else if (ret === false) break

    target = target.parentNode
  }
}

export function within (target, element) {
  return element.contains(target)
}

export function withinClass (target, className) {
  return !!findUp(
    target,
    el => (el.classList?.contains(className) || null)
  )
}

export function withinAttr (target, attrName, attrValue) {
  return !!findUp(
    target,
    el => {
      const v = el.getAttribute?.(attrName)

      return (v != null && (!attrValue || v === attrValue)) || null
    }
  )
}
