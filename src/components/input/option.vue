<template>
  <div class="mu-list-item mu-dropdown-item mu-option" @click="onClick">
    <slot>
      <mu-icon v-if="icon" class="mu-list-item_icon" :icon="icon" />
      <label class="mu-list-item_label">{{ optionLabel }}</label>
    </slot>
  </div>
</template>

<script setup>
  import { inject, computed, onMounted, onUnmounted } from 'vue'
  import { dropdownItemProps, dropdownItemEvents } from '../dropdown/hooks/dropdown-item'

  defineOptions({ name: 'MusselOption' })

  const props = defineProps({ ...dropdownItemProps, value: { required: true } })
  const emit = defineEmits([...dropdownItemEvents])

  const comboBox = inject('comboBox', {})
  const optionLabel = computed(() => props.label ?? props.value)

  function onClick (event) {
    emit('click', event)
    comboBox.onOptionClick?.(props)
  }

  onMounted(() => {
    comboBox.mountOption?.(props)
  })

  onUnmounted(() => {
    comboBox.unmountOption?.(props)
  })
</script>
