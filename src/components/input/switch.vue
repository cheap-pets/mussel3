<template>
  <div class="mu-switch" :active="isActive" :label="innerLabel" @click="toggle" />
</template>

<script setup>
  import './switch.scss'

  import { computed } from 'vue'

  defineOptions({ name: 'MusselSwitch' })

  const props = defineProps({
    modelValue: null,
    label: String,
    activeLabel: String,
    inactiveLabel: String,
    activeValue: { default: true },
    inactiveValue: { default: false }
  })

  const emit = defineEmits(['update:modelValue'])

  const isActive = computed(() =>
    props.activeValue === props.modelValue || null
  )

  const innerLabel = computed(() =>
    (isActive.value ? props.activeLabel : props.inactiveLabel) || props.label
  )

  function toggle () {
    emit(
      'update:modelValue',
      isActive.value ? props.inactiveValue : props.activeValue
    )
  }
</script>
