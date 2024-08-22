<template>
  <div class="mu-message">
    <div class="mu-message_title">
      <mu-icon :icon="icon" />
      <span>{{ title }}</span>
    </div>
    <div class="mu-message_content" v-html="html" />
  </div>
</template>
<script setup>
  import './message.scss'

  import { computed } from 'vue'
  import { removeEventAttr } from '@/utils/html'

  defineOptions({
    name: 'MusselMessage'
  })

  const props = defineProps({
    icon: String,
    title: String,
    message: String
  })

  const html = computed(() => removeEventAttr(props.message))
</script>
