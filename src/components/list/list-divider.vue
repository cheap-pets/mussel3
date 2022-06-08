<template>
  <div class="mu-list-divider">
    <mu-icon v-if="icon" :icon="icon" />
    <label v-if="label">{{ label }}</label>
  </div>
</template>

<script>
  export default {
    name: 'MusselListDivider',
    props: {
      label: String,
      icon: String
    }
  }
</script>
