<template>
  <div
    :class="divider ? 'mu-list-divider' : 'mu-list-item'"
    :checked="checked || null"
    @click="onClick">
    <slot>
      <mu-icon
        v-if="checkIcon"
        class="mu-list-item_check"
        :icon="checkIcon" />
      <mu-icon
        v-if="itemIcon"
        class="mu-list-item_icon"
        :icon="itemIcon" />
      <label
        v-if="itemLabel"
        class="mu-list-item_label">
        {{ itemLabel }}
      </label>
    </slot>
  </div>
</template>

<script>
  import { unref } from 'vue'

  export default {
    name: 'MusselListItem',
    inject: {
      reserveItemCheckPlace: {
        default: false
      },
      reserveItemIconPlace: {
        default: false
      }
    },
    props: {
      icon: String,
      label: String,
      divider: Boolean,
      checked: Boolean,
      checkMode: {
        type: String,
        default: 'none',
        validator (v) {
          return ['none', 'normal', 'radio'].includes(v)
        }
      }
    },
    computed: {
      checkIcon () {
        const reserveCheckPlace = unref(this.reserveItemCheckPlace)

        return !this.divider && this.checked
          ? 'check'
          : (
            reserveCheckPlace && (!this.divider || this.itemLabel)
              ? '__empty'
              : null
          )
      },
      itemIcon () {
        const reserveIconPlace = unref(this.reserveItemIconPlace)

        return this.icon || (
          reserveIconPlace && !this.divider // || this.itemLabel
            ? '__empty'
            : null
        )
      },
      itemLabel () {
        return this.label
      }
    },
    methods: {
      onClick (event) {
        this.$attrs.onClick?.(event)
      }
    }
  }
</script>
