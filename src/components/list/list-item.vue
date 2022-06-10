<template>
  <div :class="isDivider ? 'mu-list-divider' : 'mu-list-item'" @click="onClick">
    <slot>
      <mu-icon v-if="checkIcon" :icon="checkIcon" />
      <mu-icon v-if="itemIcon" :icon="itemIcon" />
      <label v-if="itemLabel">{{ itemLabel }}</label>
    </slot>
  </div>
</template>

<script>
  import { isString } from '@/utils/type'

  export default {
    name: 'MusselListItem',
    props: {
      item: null,
      icon: String,
      label: String,
      itemStyle: {
        type: String,
        validator (v) {
          return ['normal', 'check'].includes(v)
        }
      }
    },
    computed: {
      isDivider () {
        return (
          ('divider' in this.$attrs) ||
          this.item === '-' ||
          Object(this.item).divider
        )
      },
      itemLabel () {
        return isString(this.item)
          ? (this.item === '-' ? null : this.item)
          : (Object(this.item).label || this.label)
      },
      itemIcon () {
        return Object(this.item).icon || this.icon
      }
    },
    methods: {
      onClick (event) {
        this.$attrs.onClick?.(event)
      }
    }
  }
</script>
