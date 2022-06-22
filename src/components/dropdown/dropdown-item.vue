<template>
  <a class="mu-list-item mu-dropdown-item" @click="onClick">
    <slot>
      <mu-icon
        v-if="checkIcon"
        class="mu-list-item_check"
        :icon="checkIcon" />
      <mu-icon
        v-if="icon"
        class="mu-list-item_icon"
        :icon="icon" />
      <label
        v-if="itemLabel"
        class="mu-list-item_label">
        {{ itemLabel }}
      </label>
    </slot>
  </a>
</template>

<script>
  import MusselListItem from '../list/list-item.vue'

  export default {
    name: 'MusselDropdownItem',
    extends: MusselListItem,
    inject: {
      dropdown: {
        default: {}
      }
    },
    props: {
      radio: Boolean,
      checked: {
        validator (v) {
          return v === true || v === false
        }
      }
    },
    computed: {
      checkIcon () {
        return null
      },
      itemChecked () {
        return this.checked || null
      }
    },
    methods: {
      onClick () {
        this.dropdown.onDropdownItemClick?.(this)
      }
    }
  }
</script>
