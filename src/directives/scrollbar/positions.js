import { throttle, debounce } from 'throttle-debounce'
import { SYMBOL } from './constants'

/*
function updateTracksVisible (el, ctx, elTracks) {
  let xScrollable = false
  let yScrollable = false

  const isValidChild = child => child.nodeType === 1 && child !== elTracks
  const isDone = () => xScrollable && yScrollable

  for (const child of el.childNodes) {
    if (!isValidChild(child)) continue

    if (!xScrollable && ctx.trackX && child.offsetLeft + child.offsetWidth > ctx.clientWidth) {
      xScrollable = true
    }

    if (!yScrollable && ctx.trackY && child.offsetTop + child.offsetHeight > ctx.clientHeight) {
      yScrollable = true
    }

    if (isDone()) break
  }

  ctx.trackX = xScrollable
  ctx.trackY = yScrollable

  console.log(xScrollable, yScrollable)
}
*/

function updateTracks (el, ctx) {
  const computedStyle = window.getComputedStyle(el)

  const { /* tracks, */ trackX, thumbX, trackY, thumbY } = ctx.elements
  const { scrollWidth, clientWidth, scrollHeight, clientHeight } = el
  const { overflowX, overflowY, paddingTop, paddingLeft } = computedStyle

  Object.assign(ctx, {
    trackX: (overflowX === 'auto') && (scrollWidth - clientWidth >= 1),
    trackY: (overflowY === 'auto') && (scrollHeight - clientHeight >= 1),
    scrollWidth,
    clientWidth,
    scrollHeight,
    clientHeight
  })

  // if (ctx.trackX || ctx.trackY) updateTracksVisible(el, ctx, tracks)

  const trackWidth = computedStyle.getPropertyValue('--mu-scrollbar_width')
  const trackMargin = computedStyle.getPropertyValue('--mu-scrollbar_margin')

  const cornerOffset = ` - ${trackWidth}`

  if (ctx.trackX) {
    Object.assign(trackX.style, {
      display: null,
      top: `calc(${clientHeight}px - ${paddingTop} - ${trackMargin} - ${trackWidth})`,
      left: `calc(-${paddingLeft} + ${trackMargin})`,
      width: `calc(${clientWidth}px - ${trackMargin} * 2${ctx.trackY ? cornerOffset : ''})`
    })

    thumbX.style.width = `${parseInt(trackX.clientWidth ** 2 / scrollWidth)}px`
  } else {
    trackX.style.display = 'none'
  }

  if (ctx.trackY) {
    Object.assign(trackY.style, {
      display: null,
      top: `calc(-${paddingTop} + ${trackMargin})`,
      left: `calc(${clientWidth}px - ${paddingLeft} - ${trackMargin} - ${trackWidth})`,
      height: `calc(${clientHeight}px - ${trackMargin} * 2${ctx.trackX ? cornerOffset : ''}`
    })

    thumbY.style.height = `${parseInt(trackY.clientHeight ** 2 / scrollHeight)}px`
  } else {
    trackY.style.display = 'none'
  }
}

const updateTracksLF = throttle(2000, updateTracks)
const updateTracksHF = throttle(30, updateTracks)

function updateThumbX (el, ctx) {
  if (!ctx.trackX) return

  const { scrollLeft } = el
  const { scrollWidth, clientWidth } = ctx
  const { trackX, thumbX } = ctx.elements

  ctx.ratioX =
    (trackX.clientWidth - thumbX.clientWidth) / (scrollWidth - clientWidth)

  thumbX.style.left = `${scrollLeft * ctx.ratioX}px`
}

function updateThumbY (el, ctx) {
  if (!ctx.trackY) return

  const { scrollTop } = el
  const { scrollHeight, clientHeight } = ctx
  const { trackY, thumbY } = ctx.elements

  ctx.ratioY =
    (trackY.clientHeight - thumbY.clientHeight) / (scrollHeight - clientHeight)

  thumbY.style.top = `${scrollTop * ctx.ratioY}px`
}

export const updatePosition = throttle(30, (el, updateTracksQuickly) => {
  const ctx = el[SYMBOL]

  if (ctx.ready && ctx.tracksReady) {
    if (updateTracksQuickly) updateTracksHF(el, ctx)
    else updateTracksLF(el, ctx)

    updateThumbX(el, ctx)
    updateThumbY(el, ctx)
  }
})

const showTracks = debounce(300, (el, ctx) => {
  ctx.tracksReady = true
  ctx.elements.tracks.style.display = null

  updatePosition(el, true)
}, { atBegin: false })

const hideTracks = debounce(100, (ctx) => {
  ctx.tracksReady = false
  ctx.elements.tracks.style.display = 'none'
}, { atBegin: true })

export function refreshTracks (el) {
  const ctx = el[SYMBOL]

  if (ctx.ready) {
    hideTracks(ctx)
    window.requestAnimationFrame(() => showTracks(el, ctx))
  }
}