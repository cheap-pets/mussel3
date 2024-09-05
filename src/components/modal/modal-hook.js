import { ref, shallowRef, inject, watch } from 'vue'
import { isInputElement } from '@/utils/dom'
import { delay } from '@/utils/timer'

export const modalProps = {
  visible: Boolean,
  easyHide: Boolean,
  disposeOnHide: Boolean
}

export const modalEvents = [
  'update:visible'
]

let isMousedownInMask
let isMouseUpInMask

function targetIsMask (event) {
  return event.target.classList?.contains('mu-modal-mask')
}

window.addEventListener('mousedown', event => {
  isMousedownInMask = targetIsMask(event)
}, true)

window.addEventListener('mouseup', event => {
  isMouseUpInMask = targetIsMask(event)
}, true)

export function useModal (props, emit) {
  const rootEl = inject('$mussel').rootElement
  const container = shallowRef(rootEl)

  const ready = ref()
  const modalVisible = ref()

  function hide (...args) {
    emit('update:visible', false, ...args)
  }

  function onMaskClick (event) {
    if (props.easyHide && isMousedownInMask && isMouseUpInMask) {
      hide('mask-click')
    }
  }

  function onCloseButtonClick () {
    hide('close-button-click')
  }

  window.addEventListener('keydown', event => {
    if (
      props.visible &&
      props.easyHide &&
      event.keyCode === 27 &&
      !isInputElement(event.target)
    ) hide('esc-key')
  }, true)

  watch(() => props.visible, async v => {
    if (v) {
      container.value = document.fullscreenElement || rootEl

      if (!ready.value) {
        ready.value = true
        await delay()
      }
    }

    modalVisible.value = props.visible
  })

  return {
    ready,
    container,
    modalVisible,
    hide,
    onMaskClick,
    onCloseButtonClick
  }
}
