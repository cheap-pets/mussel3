<template>
  <div class="mu-list-item">
    <slot>
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
  </div>
</template>

<script>
  export default {
    name: 'MusselListItem',
    props: {
      icon: String,
      label: String,
      value: null
    },
    computed: {
      itemLabel () {
        return this.label
      }
    }
  }
</script>
