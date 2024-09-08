import { ref, shallowRef, toRef, inject, watch, onBeforeMount } from 'vue'
import { useModalManager } from '@/hooks/popup'
import { delay } from '@/utils/timer'

export const modalProps = {
  lazy: { type: Boolean, default: true },
  visible: Boolean,
  easyHide: Boolean,
  disposeOnHide: Boolean
}

export const modalEvents = [
  'update:visible'
]

function targetIsMask (event) {
  return event.target.classList?.contains('mu-modal-mask')
}

export function useModal (props, emit) {
  const rootEl = inject('$mussel').rootElement
  const container = shallowRef(rootEl)

  const ready = ref()
  const modalVisible = ref()
  const visibleRef = toRef(() => props.visible)

  useModalManager(visibleRef, {
    hide,
    onCaptureEscKeyDown,
    onCaptureMouseDown,
    onCaptureMouseUp
  })

  let isMouseDownInMask
  let isMouseUpInMask

  function hide (...args) {
    emit('update:visible', false, ...args)
  }

  function onMaskClick (event) {
    if (props.easyHide && isMouseDownInMask && isMouseUpInMask) {
      isMouseDownInMask = undefined
      hide('mask-click')
    }
  }

  function onCloseButtonClick () {
    hide('close-button-click')
  }

  function onCaptureEscKeyDown (event) {
    if (props.visible && props.easyHide) hide('esc-key')
  }

  function onCaptureMouseDown (event) {
    isMouseUpInMask = undefined
    isMouseDownInMask = targetIsMask(event)
  }

  function onCaptureMouseUp (event) {
    isMouseUpInMask = targetIsMask(event)
  }

  watch(visibleRef, async v => {
    if (v) {
      container.value = document.fullscreenElement || rootEl

      if (!ready.value) {
        ready.value = true
        await delay()
      }
    }

    modalVisible.value = visibleRef.value
  })

  onBeforeMount(() => { ready.value = !props.lazy })

  return {
    ready,
    container,
    modalVisible,
    hide,
    onMaskClick,
    onCloseButtonClick
  }
}
