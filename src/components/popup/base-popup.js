import { delay } from '@/utils/timer'

export default {
  props: {
    lazy: {
      type: Boolean,
      default: true
    },
    renderToBody: {
      type: Boolean,
      default: true
    },
    visible: Boolean
  },
  emits: ['update:visible'],
  data () {
    return {
      hidden: true,
      ready: !this.lazy
    }
  },
  watch: {
    visible: {
      handler (v) {
        if (v) this.show()
        else this.hide()
      }
    }
  },
  mounted () {
    if (this.renderToBody) document.body.appendChild(this.$el)
  },
  beforeUnmount () {
    this.deactivate?.()
    if (this.renderToBody) document.body.removeChild(this.$el)
  },
  methods: {
    show () {
      if (!this.visible) {
        this.updateVisible(true)
        return
      }

      Promise
        .resolve()
        .then(() => {
          if (!this.ready) {
            this.ready = true

            return delay()
          }
        })
        .then(() => {
          const el = this.$popupElement = (
            this.$el.nodeType === 1
              ? (this.$refs.popupElement || this.$el)
              : null
          )

          if (el) {
            el.style.visibility = null
            el.removeAttribute('pop-up')

            this.hidden = false
            this.onShow?.()

            return delay()
          }
        })
        .then(() => {
          if (this.updatePosition && this.$popupElement) {
            this.updatePosition()

            return delay()
          }
        })
        .then(() => {
          if (this.visible && this.$popupElement) {
            this.popup = true
            this.$popupElement.style.visibility = 'visible'
            this.$popupElement.setAttribute('pop-up', '')
          }
        })
    },
    hide () {
      if (this.visible) {
        this.updateVisible(false)
        return
      }

      if (!this.$popupElement) return

      this.onHide?.()
      this.popup = false
      this.$popupElement.removeAttribute('pop-up')

      delay(100).then(() => {
        if (!this.$popupElement) return

        this.$popupElement.style.visibility = null
        this.hidden = true

        delete this.$popupElement
      })
    },
    updateVisible (v) {
      this.$emit('update:visible', v)
    }
  }
}
