import { ref, shallowRef, computed, provide, inject } from 'vue'
import { findUp, isElementInViewport } from '@/utils/dom'
import { getTransitionDuration } from '@/utils/style'
import { usePopupManager } from '@/hooks/popup'
import { delay } from '@/utils/timer'

export const dropdownProps = {
  dropdownClass: null,
  dropdownStyle: null,
  dropdownAttrs: Object,
  dropdownScrollbar: [Boolean, String],
  dropdownTrigger: {
    type: String,
    default: 'hover',
    validator: v => ['hover', 'click'].includes(v)
  },
  positioned: {
    type: String,
    validator: v => ['top', 'bottom'].includes(v)
  }
}

export const dropdownEvents = [
  'dropdown:show',
  'dropdown:hide',
  'dropdown:itemclick'
]

export function useDropdown (hostRef, dropdownRef, props, emit) {
  const rootEl = inject('$mussel').rootElement

  const expanded = ref()
  const activityStyle = ref()
  const dropdownReady = ref()
  const dropdownContainer = shallowRef(rootEl)

  const dropdownBindings = computed(() => ({
    class: props.dropdownClass,
    style: [
      props.dropdownStyle,
      activityStyle.value || { display: 'none' }
    ],
    ...props.dropdownAttrs
  }))

  const hostEl = computed(() => hostRef.value?.$el || hostRef.value)
  const ddEl = computed(() => dropdownRef.value?.$el || dropdownRef.value)
  const dropdownVisible = computed(() => expanded.value)

  usePopupManager(dropdownVisible, {
    hide,
    onCaptureEscKeyDown,
    onCaptureMouseDown,
    onCaptureScroll
  })

  let delayHideTimer

  function isHoverTrigger () {
    return props.dropdownTrigger === 'hover'
  }

  function resetHideTimer () {
    if (delayHideTimer) {
      clearTimeout(delayHideTimer)
      delayHideTimer = null
    }
  }

  function updatePosition () {
    if (!activityStyle.value) return

    if (props.positioned) {
      ddEl.value.setAttribute('position', props.positioned)
    } else {
      const { width: hw, top: ht, right: hr, bottom: hb, left: hl } = hostEl.value.getBoundingClientRect()
      const { width: dw, height: dh } = ddEl.value.getBoundingClientRect()
      const { innerWidth: tw, innerHeight: th } = window

      const style = {}

      if (dw < hw) {
        style.width = `${hw}px`
      }

      if ((dw > hw) && ((tw - hl >= dw) || (hr < dw))) {
        style.left = `${hl}px`
      } else {
        style.right = `${tw - hr}px`
      }

      if (th - hb > dh || ht < dh) {
        ddEl.value.setAttribute('position', 'bottom')
        style.top = `${hb}px`
      } else {
        ddEl.value.setAttribute('position', 'top')
        style.bottom = `${th - ht}px`
      }

      activityStyle.value = style
    }

    ddEl.value.removeAttribute('measuring')
  }

  function show () {
    resetHideTimer()

    if (!expanded.value) {
      dropdownContainer.value = document.fullscreenElement || rootEl
      activityStyle.value = {}
      expanded.value = true

      emit('dropdown:show')

      Promise
        .resolve(
          (!dropdownReady.value) &&
          (dropdownReady.value = true) &&
          delay()
        )
        .then(() => {
          const el = ddEl.value

          el.style.transition = 'none'
          el.setAttribute('measuring', '')
          el.removeAttribute('expanded')

          delay()
            .then(updatePosition)
            .then(delay)
            .then(() => { el.style.transition = null })
            .then(() => expanded.value && el.setAttribute('expanded', ''))
        })
    }
  }

  function hide () {
    resetHideTimer()

    if (expanded.value) {
      expanded.value = false

      emit('dropdown:hide')

      const el = ddEl.value

      el.removeAttribute('measuring')
      el.removeAttribute('expanded')

      delay(getTransitionDuration(el)).then(() => {
        if (!expanded.value) activityStyle.value = null
      })
    }
  }

  function delayHide () {
    if (isHoverTrigger()) {
      clearTimeout(delayHideTimer)
      delayHideTimer = setTimeout(hide, 300)
    }
  }

  function onTriggerClick () {
    if (isHoverTrigger()) return

    if (expanded.value) hide()
    else show()
  }

  function onTriggerMouseOver () {
    if (isHoverTrigger()) show()
  }

  function onTriggerMouseLeave () {
    if (isHoverTrigger()) delayHide()
  }

  function onDropdownClick (event) {
    const trigger = findUp(event.target, parent => {
      if (parent.hasAttribute('dropdown-hide-trigger')) return true
      if (parent === ddEl.value) return false
    })

    if (trigger) hide()
  }

  function onDropdownMouseOver () {
    resetHideTimer()
  }

  function onDropdownMouseLeave () {
    onTriggerMouseLeave()
  }

  function onDropdownItemClick (item) {
    emit('dropdown:itemclick', item)
    hide()
  }

  function onCaptureEscKeyDown (event) {
    if (expanded.value && !isHoverTrigger()) {
      hide()
    }
  }

  function onCaptureMouseDown (event) {
    if (
      expanded.value &&
      !hostEl.value?.contains(event.target) &&
      !ddEl.value?.contains(event.target)
    ) hide()
  }

  function onCaptureScroll (event) {
    if (!isElementInViewport(hostEl.value)) {
      hide()
    } else if (
      expanded.value &&
      event.target.contains(hostEl.value)
      // && !ddEl.value.contains(event.target)
    ) updatePosition()
  }

  provide('dropdown', {
    hide,
    dropdownVisible,
    onDropdownItemClick
  })

  return {
    dropdownReady,
    dropdownVisible,
    dropdownBindings,
    dropdownContainer,
    show,
    hide,
    onTriggerClick,
    onTriggerMouseOver,
    onTriggerMouseLeave,
    onDropdownClick,
    onDropdownMouseOver,
    onDropdownMouseLeave,
    onDropdownItemClick
  }
}
