import { h } from '../../utils/h'
import {
  cacheComputedStyle,
  updatePositionLF,
  updatePositionHF
} from './update-position'

function onTrackXMouseDown (event) {

}

function onTrackYMouseDown (event) {

}

function onResize (event) {
  updatePositionLF(event.target)
}

function onScroll (event) {
  updatePositionHF(event.target)
}

function onMouseEnter (event) {
  cacheComputedStyle(event.target)
  updatePositionHF(event.target)
}

function absMin (value, maxValue) {
  return maxValue && Math.abs(value) > maxValue
    ? Math.sign(value) * maxValue
    : value
}

function onMouseWheel (el, event) {
  event.preventDefault()
  event.stopPropagation()

  const wheelSpeed = 1
  const max = 10
  const magnification = event.deltaMode === 1 ? 10 : 1

  let x = absMin(event.deltaX * magnification * wheelSpeed, max)
  let y = absMin(event.deltaY * magnification * wheelSpeed, max)

  if (event.shiftKey) [x, y] = [y, x]

  const deltaX = x // ((x || !this.hiddenY) ? x : y)
  const deltaY = y // ((y || !this.hiddenX) ? y : x)

  console.log(x, y, event)

  if (deltaX) {
    el.scrollLeft += deltaX
  }

  if (deltaY) {
    el.scrollTop += deltaY
  }
}

export function setupElements (el) {
  const thumbX = h('.mu-scrollbar_thumb')
  const thumbY = h('.mu-scrollbar_thumb')
  const trackX = h('.mu-scrollbar_track-x', [thumbX])
  const trackY = h('.mu-scrollbar_track-y', [thumbY])

  h(el, { class: 'mu-scrollbar' }, [trackX, trackY])

  trackX.addEventListener('mousedown', onTrackXMouseDown)
  trackY.addEventListener('mousedown', onTrackYMouseDown)

  el.addEventListener('scroll', onScroll)
  el.addEventListener('sizechange', onResize)
  el.addEventListener('mouseenter', onMouseEnter)
  el.addEventListener('mousewheel', event => onMouseWheel(el, event))

  return {
    trackX,
    trackY,
    thumbX,
    thumbY
  }
}
