import { isString } from './type'

export function findUp (node, callback) {
  while (Object(node).nodeType === 1) {
    const ret = callback(node)

    if (ret) return node
    else if (ret === false) break

    node = node.parentNode
  }
}

export function resolveElement (el) {
  return isString(el) ? document.querySelector(el) : el
}

export function isInputElement (node) {
  return (
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(node.tagName.toUpperCase()) ||
    node.hasAttribute('contenteditable')
  )
}
