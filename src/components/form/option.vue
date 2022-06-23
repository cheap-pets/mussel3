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
