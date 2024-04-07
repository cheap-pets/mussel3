import './scrollbar.scss'

import { createElements } from './elements'
import { createMutationObserver } from './observers'
import { updatePositionLF } from './update-position'
import { SCROLLBAR_SYMBOL as ctxKey } from './constants'

export default {
  mounted (el) {
    const ctx = el[ctxKey] = {
      elements: createElements(el),
      mutationObserver: createMutationObserver(el)
    }

    ctx.ready = true

    updatePositionLF(el)
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
