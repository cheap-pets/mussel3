<script>
  import { isString } from '@/utils/type'

  import MusselListItem from '../list/list-item.vue'

  export default {
    name: 'MusselOption',
    extends: MusselListItem,
    inject: {
      editor: { default: null }
    },
    props: {
      value: null
    },
    computed: {
      checked () {
        return !this.isDivider && this.editor?.includes(this.value)
      },
      itemValue () {
        return this.isDivider
          ? undefined
          : (
            isString(this.item)
              ? this.item
              : (Object(this.item).value || this.value)
          )
      },
      itemLabel () {
        const obj = Object(this.item)

        return isString(this.item)
          ? (this.item === '-' ? null : this.item)
          : (obj.label || this.label || obj.value || this.value)
      }
    },
    created () {
      if (!this.isDivider) this.editor?.mountOption?.(this)
    },
    beforeUnmount () {
      if (!this.isDivider) this.editor?.unmountOption?.(this)
    },
    methods: {
      onClick () {
        if (
          !this.isDivider &&
          this.$attrs.onClick?.() !== false
        ) {
          this.editor?.onOptionClick(this)
        }
      }
    }
  }
</script>
