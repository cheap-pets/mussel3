import { ref, shallowRef, computed, provide, inject } from 'vue'
import { findUp, isElementInViewport } from '@/utils/dom'
import { getTransitionDuration } from '@/utils/style'
import { usePopupManager } from '@/hooks/popup'
import { isString } from '@/utils/type'
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
    type: [Boolean, String],
    validator: v => [true, false, 'top', 'bottom'].includes(v)
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
  const dropdownEl = computed(() => dropdownRef.value?.$el || dropdownRef.value)
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

    const ddEl = dropdownEl.value
    const style = {}

    if (isString(props.positioned)) {
      ddEl.setAttribute('position', props.positioned)
    } else if (!props.positioned) {
      const { width: hw, top: ht, right: hr, bottom: hb, left: hl } = hostEl.value.getBoundingClientRect()
      const { width: dw, height: dh } = ddEl.getBoundingClientRect()
      const { innerWidth: tw, innerHeight: th } = window

      if (dw < hw) {
        style.width = `${hw}px`
      }

      if ((dw > hw) && ((tw - hl >= dw) || (hr < dw))) {
        style.left = `${hl}px`
      } else {
        style.right = `${tw - hr}px`
      }

      if (th - hb > dh || ht < dh) {
        ddEl.setAttribute('position', 'bottom')
        style.top = `${hb}px`
      } else {
        ddEl.setAttribute('position', 'top')
        style.bottom = `${th - ht}px`
      }
    }

    activityStyle.value = style
  }

  function show () {
    resetHideTimer()

    if (!expanded.value) {
      dropdownContainer.value = document.fullscreenElement || rootEl
      expanded.value = true

      emit('dropdown:show')

      Promise
        .resolve(
          (!dropdownReady.value) &&
          (dropdownReady.value = true) &&
          delay()
        )
        .then(() => {
          const ddEl = dropdownEl.value

          ddEl.removeAttribute('expanded')
          ddEl.style.transition = 'none'

          activityStyle.value = {
            transform: 'none',
            visibility: 'hidden'
          }

          delay()
            .then(updatePosition)
            .then(delay)
            .then(() => { ddEl.style.transition = null })
            .then(() => expanded.value && ddEl.setAttribute('expanded', ''))
        })
    }
  }

  function hide () {
    resetHideTimer()

    if (expanded.value) {
      expanded.value = false

      emit('dropdown:hide')

      const ddEl = dropdownEl.value
      const duration = getTransitionDuration(ddEl)

      ddEl.removeAttribute('expanded')

      delay(duration).then(() => {
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
      if (parent === dropdownEl.value) return false
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
      !dropdownEl.value?.contains(event.target)
    ) hide()
  }

  function onCaptureScroll (event) {
    if (!isElementInViewport(hostEl.value)) {
      hide()
    } else if (
      expanded.value &&
      event.target.contains(hostEl.value)
      // && !dropdownEl.value.contains(event.target)
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
