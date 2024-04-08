import { h } from '../../utils/h'
import { updatePosition, refreshTracks } from './positions'

function onTrackXMouseDown (event, el, ctx) {
  const { trackX, thumbX } = ctx.elements

  const targetIsThumb = event.target === thumbX

  const thbWidth = thumbX.offsetWidth
  const halfWidth = thbWidth / 2

  const startX = targetIsThumb ? thumbX.offsetLeft + halfWidth : event.offsetX
  const startPageX = event.pageX

  const max = trackX.clientWidth - thbWidth

  function updateScrollLeft (x) {
    el.scrollLeft = Math.max(Math.min(x - halfWidth, max), 0) / ctx.ratioX
  }

  if (!targetIsThumb) updateScrollLeft(startX)

  function onMouseMove (e) {
    updateScrollLeft(startX + e.pageX - startPageX)
  }

  function onMouseUp () {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

function onTrackYMouseDown (event, el, ctx) {
  const { trackY, thumbY } = ctx.elements

  const targetIsThumb = event.target === thumbY

  const thbHeight = thumbY.offsetHeight
  const halfHeight = thbHeight / 2

  const startY = targetIsThumb ? thumbY.offsetTop + halfHeight : event.offsetY
  const startPageY = event.pageY

  const max = trackY.clientHeight - thbHeight

  function updateScrollTop (y) {
    el.scrollTop = Math.max(Math.min(y - halfHeight, max), 0) / ctx.ratioY
  }

  if (!targetIsThumb) updateScrollTop(startY)

  function onMouseMove (e) {
    updateScrollTop(startY + e.pageY - startPageY)
  }

  function onMouseUp () {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

function onResize (event) {
  refreshTracks(event.target)
}

function onScroll (event) {
  updatePosition(event.target)
}

function onMouseEnter (event) {
  updatePosition(event.target)
}

export function createElements (el, ctx) {
  const thumbX = h('.mu-scrollbar_thumb')
  const thumbY = h('.mu-scrollbar_thumb')
  const trackX = h('.mu-scrollbar_track-x', [thumbX])
  const trackY = h('.mu-scrollbar_track-y', [thumbY])
  const tracks = h('.mu-scrollbar_tracks', [trackX, trackY])

  el.classList.add('mu-scrollbar')
  el.insertBefore(tracks, el.firstChild)

  trackX.addEventListener('mousedown', event => onTrackXMouseDown(event, el, ctx))
  trackY.addEventListener('mousedown', event => onTrackYMouseDown(event, el, ctx))

  el.addEventListener('scroll', onScroll)
  el.addEventListener('sizechange', onResize)
  el.addEventListener('mouseenter', onMouseEnter)

  ctx.elements = {
    tracks,
    trackX,
    trackY,
    thumbX,
    thumbY
  }
}

export function removeElements (el, ctx) {
  el.removeEventListener('sizechange', onResize)
  ctx.elements.tracks.remove()
}
