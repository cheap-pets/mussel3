export function dispatchCustomEvent (el, type, options) {
  const event = new CustomEvent(type, {
    canBubble: false,
    cancelable: true,
    ...options
  })

  return el.dispatchEvent(event)
}
