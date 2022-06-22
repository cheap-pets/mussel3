<script>
  import DropdownItem from '../dropdown/dropdown-item.vue'

  export default {
    name: 'MusselOption',
    extends: DropdownItem,
    inject: {
      editor: {
        default: {}
      }
    },
    props: {
      value: null
    },
    computed: {
      itemChecked () {
        return null // this.editor?.includes(this.value)
      },
      itemLabel () {
        return this.label || this.value
      }
    },
    created () {
      this.editor.mountOption?.(this)
    },
    beforeUnmount () {
      this.editor.unmountOption?.(this)
    },
    methods: {
      onClick () {
        this.editor.onOptionClick?.(this)
      }
    }
  }
</script>
