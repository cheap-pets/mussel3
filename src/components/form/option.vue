<script>
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
      checkIcon () {
        return null
        // return !this.divider && this.editor?.includes(this.value)
        //   ? 'check'
        //   : null
      },
      itemLabel () {
        return this.label ?? this.value
      }
    },
    created () {
      if (!this.divider) this.editor?.mountOption?.(this)
    },
    beforeUnmount () {
      if (!this.divider) this.editor?.unmountOption?.(this)
    },
    methods: {
      onClick () {
        if (!this.divider && this.$attrs.onItemclick?.() !== false) {
          this.editor?.onOptionClick(this)
        }
      }
    }
  }
</script>
