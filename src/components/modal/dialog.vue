<template>
  <div
    v-if="ready"
    v-show="visible || !hidden"
    class="mu-box mu-modal-mask"
    layout="flex"
    content-center
    :position="positionStyle"
    @click="onMaskClick">
    <div
      v-show="!hidden"
      ref="popupElement"
      class="mu-box mu-dialog"
      layout="flex"
      :style="popupStyle">
      <slot name="side-panel" />
      <div
        flex="1"
        class="mu-box mu-dialog_center"
        layout="flex"
        direction="column">
        <div
          v-if="title ?? (closeButton || $slots.header)"
          class="mu-box mu-dialog_header"
          layout="flex"
          @mousedown="onDragStart">
          <slot name="header">
            <label
              v-if="title"
              class="mu-dialog_title mu-text-ellipsis"
              flex="1">
              {{ title }}
            </label>
            <mu-icon
              v-if="closeButton"
              class="mu-dialog_ctrl-btn mu-dialog_ctrl-btn-close"
              icon="x"
              @mousedown.stop
              @click="onCloseButtonClick" />
          </slot>
        </div>
        <slot />
        <div
          v-if="buttons || $slots.footer"
          class="mu-box mu-dialog_footer"
          layout="flex">
          <slot name="footer">
            <div class="mu-space" />
            <mu-button
              v-for="el in buttons"
              :key="el"
              v-bind="el"
              @click="onButtonClick(el)" />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import './dialog.scss'

  import { delay } from '@/utils/timer'
  import { assignIf } from '@/utils/object'
  import { getClientRect } from '@/utils/client-rect'

  import BasePopup from './base-popup'

  export default {
    name: 'MusselDialog',
    extends: BasePopup,
    props: {
      width: null,
      height: null,
      title: String,
      buttons: Array,
      dialogStyle: Object,
      maskAction: {
        type: String,
        default: 'none',
        validator (v) {
          return ['none', 'hide'].includes(v)
        }
      },
      closeButton: {
        type: Boolean,
        default: true
      },
      moveable: {
        type: Boolean,
        default: true
      }
    },
    emits: ['maskClick', 'buttonClick', 'closeButtonClick', 'show', 'hide'],
    data () {
      return {
        popup: false,
        popupOffsetX: 0,
        popupOffsetY: 0,
        popupStyle: {
          width: null,
          height: null,
          transform: 'translate3d(0, 200px, 0)',
          ...this.dialogStyle
        }
      }
    },
    computed: {
      positionStyle () {
        return this.container
          ? 'absolute fit'
          : 'fixed fit'
      }
    },
    watch: {
      popup: 'updateTranslate'
    },
    methods: {
      onShow () {
        document.activeElement?.blur?.()
      },
      onHide () {
        this.$emit('hide')
      },
      updatePosition () {
        const { width, height } = this.dialogStyle || {}

        assignIf(this.popupStyle, {
          width: width ? null : this.width,
          height: height ? null : this.height
        })

        this.$emit('show')
      },
      updateTranslate () {
        const tx = this.popupOffsetX
        const ty = this.popupOffsetY + (this.popup ? 0 : 200)

        this.popupStyle.transform = `translate3d(${tx}px, ${ty}px, 0)`
      },
      onMaskClick (event) {
        if (this.popupDragState || event.target !== this.$el) return

        if (this.maskAction === 'hide') this.updateVisible(false)
        else this.$emit('maskClick', event)
      },
      onCloseButtonClick () {
        this.$emit('closeButtonClick')
        this.updateVisible(false)
      },
      onButtonClick (btn) {
        if (btn.action === 'hide') this.updateVisible(false, btn)
        else this.$emit('buttonClick', btn)
      },
      onDragStart (event) {
        const el = this.$popupElement
        const tagName = event.target.tagName.toLowerCase()
        const isInput = tagName === 'input'

        if (!el || this.moveable === false || isInput) return

        el.style.transition = 'none'

        this.popupDragState = {
          offsetX: this.popupOffsetX ?? 0,
          offsetY: this.popupOffsetY ?? 0,
          startX: event.pageX,
          startY: event.pageY
        }

        el.setAttribute('dragging', '')

        window.addEventListener('mousemove', this.onDragMove)
        window.addEventListener('mouseup', this.onDragEnd)
        window.addEventListener('blur', this.onDragEnd)
      },
      onDragMove (event) {
        window.requestAnimationFrame(() => {
          const el = this.$popupElement

          if (!el && !this.popupDragState) return

          const { pageX: x, pageY: y } = event
          const { offsetX, offsetY, startX, startY } = this.popupDragState
          const { top, left } = getClientRect(el)

          const newX = offsetX + x - startX
          const newY = offsetY + y - startY

          if (
            (left > 0 || newX > this.popupOffsetX) &&
            (x < window.innerWidth)
          ) {
            this.popupOffsetX = newX
          }

          if (
            (top > 0 || offsetY + y - startY > this.popupOffsetY) &&
            (y < window.innerHeight)
          ) {
            this.popupOffsetY = newY
          }

          this.updateTranslate()
        })
      },
      onDragEnd (event) {
        window.removeEventListener('mousemove', this.onDragMove)
        window.removeEventListener('mouseup', this.onDragEnd)
        window.removeEventListener('blur', this.onDragEnd)

        const el = this.$popupElement

        if (el) {
          el.style.transition = null
          el.removeAttribute('dragging')
        }

        if (this.popupDragState) {
          delay().then(() => {
            delete this.popupDragState
          })
        }
      }
    }
  }
</script>
