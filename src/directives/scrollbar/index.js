import './scrollbar.scss'

import { h } from '../../utils/h'
import { throttle } from 'throttle-debounce'

const CTX_SYMBOL = Symbol('mussel.scrollbar')

function updateScrollbarPosition (el) {
  const { ready, elements: { trackX, trackY, thumbX, thumbY } } = el[CTX_SYMBOL]

  if (!ready) return


}

const updateScrollbarPositionLF = throttle(250, updateScrollbarPosition)
const updateScrollbarPositionHF = throttle(50, updateScrollbarPosition)

function onMutate (el, mutations) {
  updateScrollbarPositionLF(el)
}

function onResize (event) {
  updateScrollbarPositionLF(event.target)
}

function onScroll (event) {
  updateScrollbarPositionHF(event.target)
}

function onMouseEnter (event) {
  updateScrollbarPositionHF(event.target)
}

function createMutationObserver (el) {
  const ob = new window.MutationObserver(mutations => onMutate(el, mutations))

  ob.observe(el, {
    attributes: true,
    childList: true,
    subtree: false
  })

  return ob
}

function createElements (el) {
  const thumbX = h('.mu-scrollbar_thumb')
  const thumbY = h('.mu-scrollbar_thumb')
  const trackX = h('.mu-scrollbar_track-x', [thumbX])
  const trackY = h('.mu-scrollbar_track-y', [thumbY])

  h(el, { class: '.mu-scrollbar' }, [trackX, trackY])

  return {
    trackX,
    trackY,
    thumbX,
    thumbY
  }
}

export default {
  mounted (el) {
    const ctx = el[CTX_SYMBOL] = {
      elements: createElements(el),
      mutationObserver: createMutationObserver(el)
    }

    el.addEventListener('scroll', onScroll)
    el.addEventListener('sizechange', onResize)
    el.addEventListener('mouseenter', onMouseEnter)

    ctx.ready = true
  },

  beforeUnmount (el) {
    const ctx = el[CTX_SYMBOL]
    const { mutationObserver: ob, elements } = ctx

    ctx.ready = false

    ob.disconnect()

    el.removeEventListener('scroll', onScroll)
    el.removeEventListener('sizechange', onResize)
    el.removeEventListener('mouseenter', onMouseEnter)

    el.removeChild(elements.trackX)
    el.removeChild(elements.trackY)

    delete el[CTX_SYMBOL]
  }
}
