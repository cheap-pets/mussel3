<script>
  import DropdownItem from '../popup/dropdown/dropdown-item.vue'

  export default {
    name: 'MusselOption',
    extends: DropdownItem,
    inject: {
      editor: {
        default: {}
      }
    },
    computed: {
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
