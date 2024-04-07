import { h } from '../../utils/h'
import { updatePositionHF, updatePositionLF } from './update-position'

function onTrackXMouseDown (event) {

}

function onTrackYMouseDown (event) {

}

function onResize (event) {
  updatePositionHF(event.target)
}

function onScroll (event) {
  updatePositionLF(event.target)
}

function onMouseEnter (event) {
  updatePositionHF(event.target)
}

export function createElements (el) {
  const thumbX = h('.mu-scrollbar_thumb')
  const thumbY = h('.mu-scrollbar_thumb')
  const trackX = h('.mu-scrollbar_track-x', [thumbX])
  const trackY = h('.mu-scrollbar_track-y', [thumbY])
  const tracks = h('.mu-scrollbar_tracks', [trackX, trackY])

  el.classList.add('mu-scrollbar')
  el.insertBefore(tracks, el.firstChild)

  trackX.addEventListener('mousedown', onTrackXMouseDown)
  trackY.addEventListener('mousedown', onTrackYMouseDown)

  el.addEventListener('scroll', onScroll)
  el.addEventListener('sizechange', onResize)
  el.addEventListener('mouseenter', onMouseEnter)
  // el.addEventListener('mousewheel', event => onMouseWheel(el, event))

  return {
    trackX,
    trackY,
    thumbX,
    thumbY
  }
}
