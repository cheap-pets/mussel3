import { throttle } from 'throttle-debounce'

import {
  SCROLLBAR_SYMBOL as ctxKey,
  CSS_VAR_SIZE,
  CSS_VAR_EDGE
} from './constants'

function updateTrackY (el, elStatus, elTrackY, trackXVisible, trackYVisible) {
  if (trackYVisible) {
    const { paddingTop, paddingLeft, clientWidth, clientHeight } = elStatus

    const offset = trackXVisible
      ? ` - ${CSS_VAR_SIZE}`
      : ''

    Object.assign(elTrackY.style, {
      display: null,
      top: `calc(-${paddingTop} + ${CSS_VAR_EDGE})`,
      left: `calc(${clientWidth}px - ${paddingLeft} - ${CSS_VAR_EDGE} - ${CSS_VAR_SIZE})`,
      height: `calc(${clientHeight}px - ${CSS_VAR_EDGE} * 2${offset}`
    })

    return true
  } else {
    elTrackY.style.display = 'none'
  }
}

function updateTrackX (el, elStatus, elTrackX, trackXVisible, trackYVisible) {
  if (trackXVisible) {
    const { paddingTop, paddingLeft, clientWidth, clientHeight } = elStatus

    const offset = trackYVisible
      ? ` - ${CSS_VAR_SIZE}`
      : ''

    Object.assign(elTrackX.style, {
      display: null,
      top: `calc(${clientHeight}px - ${paddingTop} - ${CSS_VAR_EDGE} - ${CSS_VAR_SIZE})`,
      left: `calc(-${paddingLeft} + ${CSS_VAR_EDGE})`,
      width: `calc(${clientWidth}px - ${CSS_VAR_EDGE} * 2${offset})`
    })

    return true
  } else {
    elTrackX.style.display = 'none'
  }
}

function updateTracks (el, ctx) {
  const { trackX, trackY } = ctx.elements
  const { scrollWidth, clientWidth, scrollHeight, clientHeight } = el
  const { overflowX, overflowY, paddingTop, paddingLeft } = window.getComputedStyle(el)

  const elStatus = {
    scrollWidth,
    clientWidth,
    scrollHeight,
    clientHeight,
    overflowX,
    overflowY,
    paddingTop,
    paddingLeft
  }

  const yVisible = (overflowY === 'auto') && (scrollHeight - clientHeight >= 1)
  const xVisible = (overflowX === 'auto') && (scrollWidth - clientWidth >= 1)

  const xState = updateTrackX(el, elStatus, trackX, xVisible, yVisible)
  const yState = updateTrackY(el, elStatus, trackY, xVisible, yVisible)

  ctx.tracks = {
    trackY: yState,
    trackX: xState
  }
}

const updateTracksLF = throttle(1000, updateTracks)
const updateTracksHF = throttle(50, updateTracks)

function updateThumbX (el, ctx) {

}

function updateThumbY (el, ctx) {

}

function updatePosition (el, updateTracksQuickly = false) {
  const ctx = el[ctxKey]

  if (ctx.ready) {
    if (updateTracksQuickly) updateTracksHF(el, ctx)
    else updateTracksLF(el, ctx)

    updateThumbX(el, ctx)
    updateThumbY(el, ctx)
  }
}

export const updatePositionLF = throttle(250, el => updatePosition(el))
export const updatePositionHF = throttle(30, el => updatePosition(el, true))
