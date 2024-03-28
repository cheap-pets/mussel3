import { updatePositionLF } from './update-position'

function onMutate (el, mutations) {
  updatePositionLF(el)
}

export function createMutationObserver (el) {
  const ob = new window.MutationObserver(mutations => onMutate(el, mutations))

  ob.observe(el, {
    attributes: true,
    childList: true,
    subtree: false
  })

  return ob
}
