import { throttle } from 'throttle-debounce'
import { SCROLLBAR_SYMBOL as ctxKey } from './constants'

export function cacheComputedStyle (el) {
  const {
    overflowX,
    overflowY
    // borderTopWidth,
    // borderBottomWidth,
    // borderLeftWidth,
    // borderRightWidth
  } = window.getComputedStyle(el)

  el[ctxKey].computedStyle = {
    overflowX,
    overflowY
    // borderTopWidth: parseInt(borderTopWidth),
    // borderBottomWidth: parseInt(borderBottomWidth),
    // borderLeftWidth: parseInt(borderLeftWidth),
    // borderRightWidth: parseInt(borderRightWidth)
  }
}

function updateX (el, trackX, thumbX, computedStyle) {
  const hidden =
    (computedStyle.overflowX !== 'auto') ||
    (el.scrollWidth - el.clientWidth < 1)

  trackX.style.display = hidden ? 'none' : 'block'

  if (hidden) return

  console.log(`translate3D(${el.scrollLeft}, -${el.scrollTop}, 0)`)

  trackX.style.transform = `translate3D(${el.scrollLeft}px, ${el.scrollTop}px, 0)`
}

function updateY (el, trackY, thumbY, computedStyle) {
  const hidden =
    (computedStyle.overflowY !== 'auto') ||
    (el.scrollHeight - el.clientHeight < 1)

  trackY.style.display = hidden ? 'none' : 'block'

  if (hidden) return

  trackY.style.transform = `translate3D(${el.scrollLeft}px, ${el.scrollTop}px, 0)`
}

function updatePosition (el, immediate = false) {
  const { ready, elements, computedStyle } = el[ctxKey]

  if (immediate === true || ready) {
    updateX(el, elements.trackX, elements.thumbX, computedStyle)
    updateY(el, elements.trackY, elements.thumbY, computedStyle)
  }
}

const LF_MS = 250
const HF_MS = 10

export const updatePositionLF = throttle(LF_MS, updatePosition)
export const updatePositionHF = throttle(HF_MS, updatePosition)
