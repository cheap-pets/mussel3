<template>
  <Teleport v-if="visible || ready" :to="container">
    <Transition name="mu-drawer">
      <div
        v-show="modalVisible"
        v-bind="maskAttrs"
        class="mu-modal-mask mu-drawer-mask"
        :style="{ zIndex }"
        @click="onMaskClick">
        <div
          class="mu-drawer"
          :position="position"
          :style="sizeStyle"
          v-bind="$attrs">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
  import './drawer.scss'

  import { modalProps, modalEvents, useModal } from './modal'
  import { sizeProps, useSize } from '@/hooks/size'

  defineOptions({ name: 'MusselDialog', inheritAttrs: false })

  const props = defineProps({
    ...sizeProps,
    ...modalProps,
    zIndex: String,
    mask: { type: Boolean, default: true },
    position: {
      type: String,
      default: 'bottom',
      validate: v => ['top', 'right', 'bottom', 'left'].includes(v.toLowerCase())
    }
  })
  const emit = defineEmits([...modalEvents])

  const { ready, container, modalVisible, onMaskClick } = useModal(props, emit)
  const { sizeStyle } = useSize(props)
</script>
