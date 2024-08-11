import { ref, computed, watch, provide } from 'vue'
import { resolveSize } from '@/utils/size'

export const dropdownProps = {
  dropdownIcon: String,
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

export function useDropdown (props, emit) {
  const dropdownVisible = ref(false)

  const isHoverTrigger = computed(() => props.dropdownTrigger === 'hover')

  const dropdownIconBindings = computed(() => ({
    class: 'mu-dropdown-icon',
    tag: 'a',
    icon: props.dropdownIcon || 'keyDown',
    expanded: dropdownVisible.value || null
  }))

  const dropdownPanelBindings = computed(() => {
    const { style, width, height, ...bindings } = props.dropdownPanel || {}

    bindings.style = { ...style }

    if (width) bindings.style.width = resolveSize(width)
    if (height) bindings.style.height = resolveSize(height)

    return bindings
  })

  let delayHideTimer

  function resetHideTimer () {
    if (delayHideTimer) {
      clearTimeout(delayHideTimer)
      delayHideTimer = null
    }
  }

  function showDropdown () {
    dropdownVisible.value = true
  }

  function hideDropdown () {
    dropdownVisible.value = false
  }

  function delayHideDropdown () {
    if (isHoverTrigger.value) {
      clearTimeout(delayHideTimer)
      delayHideTimer = setTimeout(hideDropdown, 200)
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
    hideDropdown,
    onDropdownPanelMouseOver,
    onDropdownPanelMouseLeave,
    onDropdownItemClick
  })

  return {
    dropdownVisible,
    dropdownIconBindings,
    dropdownPanelBindings,
    showDropdown,
    hideDropdown,
    onTriggerClick,
    onTriggerMouseOver,
    onTriggerMouseLeave,
    onDropdownItemClick
  }
}
