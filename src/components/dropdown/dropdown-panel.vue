<template>
  <div
    v-if="ready"
    v-show="!hidden"
    class="mu-dropdown-panel"
    :style="style"
    @click="onClick"
    @mouseover.stop="onMouseOver"
    @mouseleave.stop="onMouseLeave">
    <slot>
      <component
        :is="el === '-' || el.divider ? 'mu-list-divider' : 'mu-dropdown-item'"
        v-for="(el, index) in items"
        :key="el === '-' ? index : el"
        v-bind="el === '-' ? {} : el" />
    </slot>
  </div>
</template>

<script>
  import { within, findUp } from '@/utils/dom'
  import { assignIf } from '@/utils/object'
  import { getClientRect } from '@/utils/client-rect'
  import { hideIf } from '@/events/global-layer-events'

  import BasePopup from '../popup/base-popup'

  function popOnTop (pRect, height) {
    return (
      (pRect.bottom + height > window.innerHeight) &&
      (pRect.top >= height)
    )
  }

  function popOnRight (pRect, width, align) {
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

  export default {
    name: 'MusselDropdownPanel',
    extends: BasePopup,
    inject: {
      dropdown: { default: null }
    },
    props: {
      align: {
        type: String,
        validator (v) {
          return ['left', 'right'].includes(v)
        }
      },
      style: Object,
      width: String,
      height: String,
      items: Array,
      stickyTarget: null
    },
    methods: {
      getStickyTargetElement () {
        const el = this.stickyTarget || this.$parent

        return el.$el || el
      },
      updatePosition () {
        if (!this.visible) return

        const el = this.$el
        const style = Object(this.style)
        const pEl = this.getStickyTargetElement()

        const pRect = getClientRect(pEl)
        const isOnTop = popOnTop(pRect, el.offsetHeight)
        const isOnRight = popOnRight(pRect, el.offsetWidth, this.align)

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
      },
      onShow () {
        const dd = window.__mussel_dropdown

        if (dd && dd !== this) hideIf('dropdown')

        window.__mussel_dropdown = this
      },
      onHide () {
        if (window.__mussel_dropdown === this) {
          window.__mussel_dropdown = null
        }
      },
      hideIf (target) {
        const elements = [
          // ...this.$parent.$el.querySelectorAll('[dropdown-trigger]'),
          this.getStickyTargetElement(),
          this.$el
        ]

        if (!elements.find(el => within(target, el))) {
          this.hide()
        }
      },
      onClick (event) {
        const trigger = findUp(event.target, el => {
          if (el.hasAttribute('dropdown-hide-trigger')) return true
          if (el === this.$el) return false
        })

        if (trigger) this.hide()
      },
      onMouseOver (event) {
        this.dropdown?.onDropdownPanelMouseOver?.(event)
      },
      onMouseLeave (event) {
        this.dropdown?.onDropdownPanelMouseLeave?.(event)
      }
    }
  }
</script>
