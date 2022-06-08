<script>
  import MusselListItem from '../list/list-item.vue'

  export default {
    name: 'MusselDropdownItem',
    extends: MusselListItem,
    inject: {
      dropdown: { default: null }
    },
    methods: {
      onClick () {
        if (
          !this.isDivider &&
          this.$attrs.onClick?.() !== false
        ) {
          this.dropdown?.onDropdownItemClick(this.item || this)
        }
      }
    }
  }
</script>
