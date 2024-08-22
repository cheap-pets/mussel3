import { ref, computed, watch, provide } from 'vue'

export const dropdownProps = {
  dropdownIcon: String,
  dropdownItems: Array,
  dropdownPanel: Object,
  dropdownTrigger: {
    type: String,
    default: 'hover',
    validator: v => ['hover', 'click'].includes(v)
  }
}

export const dropdownEvents = [
  'dropdown:itemclick',
  'dropdown:show',
  'dropdown:hide'
]

export function useDropdown (hostElement, props, emit) {
  const dropdownVisible = ref(false)

  const isHoverTrigger = computed(() =>
    props.dropdownTrigger === 'hover'
  )

  const dropdownIconBindings = computed(() => ({
    tag: 'a',
    class: 'mu-dropdown-icon',
    icon: props.dropdownIcon || 'keyDown',
    expanded: dropdownVisible.value || null
  }))

  const dropdownPanelBindings = computed(() => ({
    hostElement: hostElement.value,
    dropdownItems: props.dropdownItems,
    ...props.dropdownPanel
  }))

  let delayHideTimer

  function resetHideTimer () {
    if (delayHideTimer) {
      clearTimeout(delayHideTimer)
      delayHideTimer = null
    }
  }

  function showDropdown () {
    resetHideTimer()
    dropdownVisible.value = true
  }

  function hideDropdown () {
    resetHideTimer()
    dropdownVisible.value = false
  }

  function delayHideDropdown () {
    if (isHoverTrigger.value) {
      clearTimeout(delayHideTimer)
      delayHideTimer = setTimeout(hideDropdown, 500)
    }
  }

  function onTriggerClick () {
    if (isHoverTrigger.value) return

    if (dropdownVisible.value) hideDropdown()
    else showDropdown()
  }

  function onTriggerMouseOver () {
    if (isHoverTrigger.value) showDropdown()
  }

  function onTriggerMouseLeave () {
    if (isHoverTrigger.value) delayHideDropdown()
  }

  function onDropdownItemClick (item) {
    emit('dropdown:itemclick', item)
    hideDropdown()
  }

  function onDropdownPanelMouseOver () {
    resetHideTimer()
  }

  function onDropdownPanelMouseLeave () {
    onTriggerMouseLeave()
  }

  watch(dropdownVisible, value => {
    resetHideTimer()
    emit(value ? 'dropdown:show' : 'dropdown:hide')
  })

  provide('dropdown', {
    hostElement,
    hideDropdown,
    onDropdownPanelMouseOver,
    onDropdownPanelMouseLeave,
    onDropdownItemClick
  })

  return {
    dropdownVisible,
    dropdownIconBindings,
    dropdownPanelBindings,
    isHoverTrigger,
    showDropdown,
    hideDropdown,
    onTriggerClick,
    onTriggerMouseOver,
    onTriggerMouseLeave,
    onDropdownItemClick
  }
}
