import { throttle } from 'throttle-debounce'
import { getClientRect } from '@/utils/client-rect'

function outOfRect (point, rail, isYAxis) {
  const { top, bottom, left, right } = getClientRect(rail)

  return (isYAxis && (point.y < top || point.y > bottom)) ||
    (!isYAxis && (point.x < left || point.x > right))
}

export default function onThumbMouseDown (event) {
  this.mouseInAction = true
  this.setScrolling()

  const rail = event.target.parentNode
  const isYAxis = rail.getAttribute('axis') === 'y'

  let { clientX, clientY } = event

  const onMouseMove = e => {
    const { clientX: x, clientY: y } = e

    if (outOfRect({ x, y }, rail, isYAxis)) return

    const deltaX = isYAxis ? null : parseInt((x - clientX) / this.ratioX)
    const deltaY = isYAxis ? parseInt((y - clientY) / this.ratioY) : null

    if (deltaX || deltaY) this.scrollBy(deltaX, deltaY)

    clientX = x
    clientY = y
  }

  const throttleMove = throttle(
    20,
    onMouseMove,
    { noLeading: true, noTrailing: false }
  )

  const onMouseUp = e => {
    this.mouseInAction = false
    window.removeEventListener('mousemove', throttleMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', throttleMove)
  window.addEventListener('mouseup', onMouseUp)

  event.stopPropagation()
}
