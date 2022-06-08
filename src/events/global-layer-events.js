import { isString } from '../utils/type'

function callbackIf (name, callback) {
  const popup = window['__mussel_' + name]

  if (popup) callback(popup)

  return popup
}

function hideIf (name) {
  return name === 'dropdown'
    ? callbackIf('dropdown', dropdown => dropdown.hide())
    : (
        name === 'modal'
          ? callbackIf(
            'modal',
            modal => {
              const action = modal.$options.maskAction || modal.maskAction
              if (action === 'close') modal.hide()
            }
          )
          : undefined
      )
}

function setPositionIf () {
  callbackIf('dropdown', dropdown => dropdown.updatePosition())
}

window.addEventListener('blur', () => hideIf('dropdown'))

window.addEventListener(
  'keyup',
  event => event.keyCode === 27 && (
    hideIf('dropdown') ||
    hideIf('modal')
  )
)

window.addEventListener(
  'mousedown',
  event => {
    return (
      callbackIf('dropdown', dropdown => dropdown.hideIf(event.target)) ||
      callbackIf('drawer', drawer => drawer.hideIf(event.target))
    )
  },
  true
)

window.addEventListener('popstate', () => {
  hideIf('dropdown')
  hideIf('modal', true)
})

window.addEventListener('resize', setPositionIf)
window.addEventListener('scroll', () => { hideIf('dropdown') })

window.addEventListener('mousewheel', ({ target }) => {
  while (target) {
    const { className, parentNode } = target

    if (
      isString(className) &&
      className.indexOf('mu-dropdown-panel') !== -1
    ) return

    target = parentNode.nodeType === 1 ? parentNode : undefined
  }
  hideIf('dropdown')
})

export {
  hideIf
}
