import { watch, onUnmounted } from 'vue'
import { isInputElement } from '@/utils/dom'

let activeModal
let activePopup

const previousModals = new WeakMap()

window.addEventListener('mousedown', event => {
  if (activePopup) {
    activePopup.onCaptureMouseDown?.(event)
  } else if (activeModal) {
    activeModal.onCaptureMouseDown?.(event)
  }
}, true)

window.addEventListener('mouseup', event => {
  if (activePopup) {
    activePopup.onCaptureMouseUp?.(event)
  } else if (activeModal) {
    activeModal.onCaptureMouseUp?.(event)
  }
}, true)

window.addEventListener('keydown', event => {
  if (event.keyCode === 27 && !isInputElement(event.target)) {
    if (activePopup) {
      activePopup.onCaptureEscKeyDown?.(event)
    } else if (activeModal) {
      activeModal.onCaptureEscKeyDown?.(event)
    }
  }
})

window.addEventListener('scroll', event => {
  activePopup?.onCaptureScroll?.(event)
}, true)

window.addEventListener('blur', event => {
  activePopup?.hide?.(event)
})

window.addEventListener('fullscreenchange', event => {
  activePopup?.hide?.(event)
})

export function usePopupManager (visibleRef, options = {}) {
  const instance = { ...options }

  function setActivePopup () {
    if (activePopup !== instance) {
      activePopup?.hide?.()
      activePopup = instance
    }
  }

  function unsetActivePopup () {
    if (activePopup === instance) {
      activePopup = undefined
    }
  }

  watch(visibleRef, v => {
    if (v) {
      setActivePopup()
    } else {
      unsetActivePopup()
    }
  })

  onUnmounted(unsetActivePopup)
}

export function useModalManager (visibleRef, options = {}) {
  const instance = { ...options }

  function pushModal () {
    if (!previousModals.has(instance)) {
      previousModals.set(instance, activeModal)
    }

    activeModal = instance
  }

  function popModal () {
    if (activeModal === instance) {
      const prev = previousModals.get(instance)

      previousModals.delete(instance)
      activeModal = prev
    }
  }

  watch(visibleRef, v => {
    if (v) {
      pushModal()
    } else {
      popModal()
    }
  })

  onUnmounted(popModal)
}
