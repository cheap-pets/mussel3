<template>
  <Teleport to="body">
    <Transition name="mu-dropdown">
      <div
        v-show="expanded"
        ref="thisEl"
        class="mu-dropdown-panel"
        :style="sizeStyle"
        @click="onClick"
        @mouseover.stop="onOver"
        @mouseleave.stop="onLeave">
        <slot>
          <component :is="el.component" v-for="el in items" :key="el.key" v-bind="el.bindings" />
        </slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
  import './dropdown-panel.scss'

  import { ref, computed, inject, watch } from 'vue'
  import { generateUUID } from '@/utils/id'
  import { assignIf } from '@/utils/object'
  import { findUp } from '@/utils/dom'
  import { sizeProps, useSize } from '@/hooks/size'
  import { useObjectVForKey } from '@/hooks/object-v-for-key'

  defineOptions({ name: 'MusselDropdownPanel' })

  const visible = defineModel('visible', { type: Boolean })

  const props = defineProps({
    hostEl: null,
    dropdownItems: Array,
    dropdownItemKey: { type: String, default: 'id' },
    ...sizeProps
  })

  const { sizeStyle } = useSize(props)
  const { getKey } = useObjectVForKey()

  const items = computed(() =>
    props.dropdownItems?.map(el => {
      const { [props.dropdownItemKey]: key, component = 'mu-dropdown-item', ...bindings } = (
        el === '-' ? { component: 'mu-list-divider', key: generateUUID() } : el
      )

      return {
        key: key || getKey(el),
        component,
        bindings
      }
    })
  )

  const {
    hostElement: pEl,
    onDropdownPanelMouseOver: onOver,
    onDropdownPanelMouseLeave: onLeave
  } = inject('dropdown', {})

  const thisEl = ref()
  const expanded = ref(false)

  function hide () {
    visible.value = false
  }

  function onClick (event) {
    const trigger = findUp(event.target, parent => {
      if (parent.hasAttribute('dropdown-hide-trigger')) return true
      if (parent === thisEl.value) return false
    })

    if (trigger) hide()
  }

  function popOnTop (pRect, height, alignValues) {
    const align =
      (alignValues.includes('top') && 'top') ||
      (alignValues.includes('bottom') && 'bottom')

    return (
      (align === 'top') ||
      (
        align === 'bottom'
          ? false
          : (
            (pRect.bottom + height > window.innerHeight) &&
            (pRect.top >= height)
          )
      )
    )
  }

  function popOnRight (pRect, width, alignValues) {
    const align =
      (alignValues.includes('right') && 'right') ||
      (alignValues.includes('left') && 'left')

    return (
      (align === 'right') ||
      (
        align === 'left'
          ? false
          : (
            (width < pRect.width || pRect.left + width > window.innerWidth) &&
            (pRect.right >= width)
          )
      )
    )
  }

  function getPosition (pRect, isOnTop, isOnRight) {
    const { top, bottom, left, right } = pRect
    const { innerHeight, innerWidth } = window

    return {
      ...isOnTop
        ? { bottom: `${innerHeight - top}px`, top: null }
        : { top: `${bottom}px`, bottom: null },
      ...isOnRight
        ? { right: `${innerWidth - right}px`, left: null }
        : { left: `${left}px`, right: null }
    }
  }

  function setPosition () {
    if (!this.visible) return

    const style = Object(this.style)
    const alignValues = String(this.align).toLowerCase().split(' ')

    const el = this.$el
    const pEl = this.getStickyTargetElement()

    const pRect = pEl.getBoundingClientRect()
    const isOnTop = popOnTop(pRect, el.offsetHeight, alignValues)
    const isOnRight = popOnRight(pRect, el.offsetWidth, alignValues)

    const width = style.width
      ? null
      : (this.width || (pRect.width + 'px'))

    const height = style.height
      ? null
      : this.height

    const minWidth = width !== 'auto' || style.minWidth || !this.dropdown
      ? null
      : pRect.width + 'px'

    const size = assignIf({}, {
      width,
      height,
      minWidth
    })

    el.setAttribute('position', isOnTop ? 'top' : 'bottom')

    Object.assign(
      el.style,
      size,
      getPosition(pRect, isOnTop, isOnRight)
    )
  }

  watch(visible, value => {
    if (value) setPosition()

    expanded.value = value
  })
</script>
