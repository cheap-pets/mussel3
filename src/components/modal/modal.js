import { ref, shallowRef, inject, watch } from 'vue'
import { delay } from '@/utils/timer'

export const modalProps = {
  easyHide: Boolean,
  disposeOnHide: Boolean
}

export function useModal (visibleRef, props) {
  const rootEl = inject('$mussel').rootElement
  const container = shallowRef(rootEl)

  const ready = ref()
  const modalVisible = ref()

  function onMaskClick () {
    if (props.easyHide) visibleRef.value = false
  }

  window.addEventListener('keydown', event => {
    if (
      visibleRef.value &&
      props.easyHide &&
      event.keyCode === 27 &&
      !['input', 'textarea'].includes(event.target.tagName.toLowerCase())
    ) visibleRef.value = false
  }, true)

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

  return {
    ready,
    container,
    modalVisible,
    onMaskClick
  }
}
