<template>
  <a class="mu-tab-button">
    <slot>
      <mu-icon v-if="icon" :icon="icon" />
      <span v-if="buttonCaption">{{ buttonCaption }}</span>
    </slot>
  </a>
</template>

<script setup>
  import './tab-button.scss'

  import { computed } from 'vue'

  defineOptions({ name: 'MusselTabButton' })

  const props = defineProps({
    name: String,
    icon: String,
    caption: String
  })

  const buttonCaption = computed(() => props.caption || props.name)
</script>
