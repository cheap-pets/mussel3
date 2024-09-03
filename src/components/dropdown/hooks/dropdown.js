import { ref, shallowRef, computed, provide } from 'vue'
import { getTransitionDuration } from '@/utils/style'
import { findUp } from '@/utils/dom'
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
  }
}

export const dropdownEvents = [
  'dropdown:show',
  'dropdown:hide',
  'dropdown:itemclick'
]

let lastPopup

export function useDropdown (hostElementRef, dropdownElementRef, props, emit) {
  console.log(hostElementRef.value)
  const context = {}
  const expanded = ref()
  const activityStyle = ref()
  const dropdownContainer = shallowRef(document.body)

  const dropdownVisible = computed(() => expanded.value)

  const dropdownBindings = computed(() => ({
    class: props.dropdownClass,
    style: [props.dropdownStyle, activityStyle.value || { display: 'none' }],
    ...props.dropdownAttrs
  }))

  let delayHideTimer

  function resetHideTimer () {
    if (delayHideTimer) {
      clearTimeout(delayHideTimer)
      delayHideTimer = null
    }
  }

  function updatePosition () {
    if (!activityStyle.value) return

    const hEl = hostElementRef.value
    const dEl = dropdownElementRef.value

    const { width: hw, top: ht, right: hr, bottom: hb, left: hl } = hEl.getBoundingClientRect()
    const { width: dw, height: dh } = dEl.getBoundingClientRect()
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
      dEl.setAttribute('position', 'bottom')
      style.top = `${hb}px`
    } else {
      dEl.setAttribute('position', 'top')
      style.bottom = `${th - ht}px`
    }

    activityStyle.value = style
    dEl.removeAttribute('measuring')
  }

  function showDropdown () {
    resetHideTimer()

    if (lastPopup !== context) {
      lastPopup?.hideDropdown()
      lastPopup = context
    }

    if (!expanded.value) {
      dropdownContainer.value = document.fullscreenElement || document.body
      activityStyle.value = {}
      expanded.value = true

      emit('dropdown:show')

      const el = dropdownElementRef.value

      el.style.transition = 'none'
      el.setAttribute('measuring', '')
      el.removeAttribute('expanded')

      delay()
        .then(updatePosition)
        .then(delay)
        .then(() => { el.style.transition = null })
        .then(() => expanded.value && el.setAttribute('expanded', ''))
    }
  }

  function hideDropdown () {
    resetHideTimer()

    if (expanded.value) {
      expanded.value = false

      if (lastPopup === context) {
        lastPopup = null
      }

      emit('dropdown:hide')

      const el = dropdownElementRef.value

      el.removeAttribute('measuring')
      el.removeAttribute('expanded')

      delay(getTransitionDuration(el)).then(() => {
        if (!expanded.value) activityStyle.value = null
      })
    }
  }

  context.hideDropdown = hideDropdown

  function delayHideDropdown () {
    if (props.dropdownTrigger === 'hover') {
      clearTimeout(delayHideTimer)
      delayHideTimer = setTimeout(hideDropdown, 300)
    }
  }

  function onTriggerClick () {
    if (props.dropdownTrigger === 'hover') return

    if (expanded.value) hideDropdown()
    else showDropdown()
  }

  function onTriggerMouseOver () {
    if (props.dropdownTrigger === 'hover') showDropdown()
  }

  function onTriggerMouseLeave () {
    if (props.dropdownTrigger === 'hover') delayHideDropdown()
  }

  function onDropdownClick (event) {
    const trigger = findUp(event.target, parent => {
      if (parent.hasAttribute('dropdown-hide-trigger')) return true
      if (parent === dropdownElementRef.value) return false
    })

    if (trigger) hideDropdown()
  }

  function onDropdownMouseOver () {
    resetHideTimer()
  }

  function onDropdownMouseLeave () {
    onTriggerMouseLeave()
  }

  function onDropdownItemClick (item) {
    emit('dropdown:itemclick', item)
    hideDropdown()
  }

  window.addEventListener('mousedown', event => {
    if (
      expanded.value &&
      !hostElementRef.value?.contains(event.target) &&
      !dropdownElementRef.value?.contains(event.target)
    ) hideDropdown()
  }, true)

  /*
  window.addEventListener('keydown', event => {
    if (
      expanded.value &&
      event.keyCode === 27 &&
      !['input', 'textarea'].includes(event.target.tagName.toLowerCase())
    ) hideDropdown()
  }, true)
  */

  window.addEventListener('scroll', event => {
    if (
      expanded.value &&
      event.target.contains(hostElementRef.value) &&
      !dropdownElementRef.value.contains(event.target)
    ) updatePosition()
  }, true)

  window.addEventListener('blur', event => {
    if (expanded.value) {
      hideDropdown()
    }
  })

  provide('dropdown', {
    hideDropdown,
    dropdownVisible,
    onDropdownItemClick
  })

  return {
    dropdownVisible,
    dropdownBindings,
    dropdownContainer,
    showDropdown,
    hideDropdown,
    onTriggerClick,
    onTriggerMouseOver,
    onTriggerMouseLeave,
    onDropdownClick,
    onDropdownMouseOver,
    onDropdownMouseLeave,
    onDropdownItemClick
  }
}
