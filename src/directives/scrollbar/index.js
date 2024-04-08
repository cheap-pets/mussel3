import './styles.scss'

import { SYMBOL } from './constants'
import { updatePosition } from './positions'
import { createElements, removeElements } from './elements'
import { createObservers, removeObservers } from './observers'

export function attach (el) {
  const ctx = el[SYMBOL] = {}

  createElements(el, ctx)
  createObservers(el, ctx)

  window.requestAnimationFrame(() => {
    ctx.ready = true
    updatePosition(el, true)
  })
}

export function detach (el) {
  const ctx = el[SYMBOL]

  ctx.ready = false

  removeObservers(el, ctx)
  removeElements(el, ctx)

  delete el[SYMBOL]
}

export default {
  mounted: attach,
  beforeUnmount: detach
}
