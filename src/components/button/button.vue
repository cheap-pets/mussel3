<template>
  <button
    class="mu-button"
    :type="type || 'button'"
    :active="active || null"
    :style="{ '--mu-x-color': color }"
    v-bind="attrs">
    <slot>
      <mu-icon v-if="icon" :icon="icon" />
      <span v-if="caption">{{ caption }}</span>
    </slot>
  </button>
</template>

<script setup>
  import './button.scss'

  import { computed, inject } from 'vue'
  import { kebabCase } from '@/utils/case'

  defineOptions({ name: 'MusselButton' })

  const props = defineProps({
    type: String,
    icon: String,
    caption: String,
    active: Boolean,
    xColor: String,
    buttonStyle: String
  })

  const inheritedAttrs = inject('buttonAttributes', {})

  const color = computed(() => props.xColor || inheritedAttrs.xColor)

  const attrs = computed(() => Object.assign(
    Object.fromEntries(
      Object
        .entries(inheritedAttrs)
        .map(([key, value]) => [kebabCase(key), value])
    ),
    {
      'button-style': props.active ? undefined : (inheritedAttrs.buttonStyle || props.buttonStyle),
      'x-color': color.value && ''
    }
  ))
</script>
