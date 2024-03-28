import './scrollbar.scss'

import { setupElements } from './elements'
import { createMutationObserver } from './observers'
import { cacheComputedStyle } from './update-position'
import { SCROLLBAR_SYMBOL as ctxKey } from './constants'

export default {
  mounted (el) {
    const ctx = el[ctxKey] = {
      elements: setupElements(el),
      mutationObserver: createMutationObserver(el)
    }

    cacheComputedStyle(el)

    ctx.ready = true
  },

  beforeUnmount (el) {
    const ctx = el[ctxKey]
    // const { mutationObserver: ob, elements } = ctx

    ctx.ready = false
    ctx.mutationObserver.disconnect()

    /*
    el.removeEventListener('scroll', onScroll)
    el.removeEventListener('sizechange', onResize)
    el.removeEventListener('mouseenter', onMouseEnter)

    el.removeChild(elements.trackX)
    el.removeChild(elements.trackY)
    */

    delete el[ctxKey]
  }
}
