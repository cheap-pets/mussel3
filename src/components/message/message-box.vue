<template>
  <mu-dialog
    v-model:visible="visible"
    :buttons="buttons"
    class="mu-message-box"
    close-button
    @button-click="onButtonClick"
    @close-button-click="onButtonClick">
    <mu-message v-bind="{ icon, title, message, type }" />
  </mu-dialog>
</template>

<script setup>
  import './message-box.scss'

  import MuMessage from './message.vue'

  import { ref, onMounted } from 'vue'

  const props = defineProps({
    icon: null,
    type: String,
    title: String,
    message: String,
    buttons: Array,
    callback: null
  })

  const visible = ref()

  function onButtonClick (btn) {
    visible.value = false
    props.callback?.(btn?.raw || btn)
  }

  onMounted(() => {
    visible.value = true
  })
</script>
