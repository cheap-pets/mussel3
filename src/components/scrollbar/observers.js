import { throttle } from 'throttle-debounce'
import { updatePosition, refreshTracks } from './positions'

const onMutate = throttle(100, (el, ctx) => {
  if (!ctx.ready) return

  if (el.scrollWidth !== ctx.scrollWidth || el.scrollHeight !== ctx.scrollHeight) {
    refreshTracks(el)
  } else if (el.clientWidth !== ctx.clientWidth || el.clientHeight !== ctx.clientHeight) {
    updatePosition(el, true)
  }
})

export function createObservers (el, ctx) {
  ctx.mutationObserver = new window.MutationObserver(() => onMutate(el, ctx))

  ctx.mutationObserver.observe(el, {
    attributes: true,
    childList: true,
    subtree: true
  })
}

export function removeObservers (el, ctx) {
  ctx.mutationObserver.disconnect()

  ctx.mutationObserver = undefined
}
