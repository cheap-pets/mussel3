<template>
  <Teleport v-if="visible || ready" :to="container">
    <Transition name="mu-dialog">
      <div
        v-show="modalVisible" ref="maskEl" v-bind="mask"
        class="mu-modal-mask mu-dialog-mask" :style="{ zIndex }"
        @click="onMaskClick">
        <div
          class="mu-dialog" :style="{ transform }"
          v-bind="$attrs" :dragging="dragging"
          @mousedown="onDragStart" @click.stop>
          <slot name="header">
          </slot>
          <slot />
          <slot name="footer">
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
  import './modal-dialog.scss'

  import { ref, shallowReactive, computed } from 'vue'
  import { modalProps, useModal } from './modal'

  defineOptions({ name: 'MusselModalDialog', inheritAttrs: false })

  const visible = defineModel('visible', { type: Boolean })
  const props = defineProps({ ...modalProps, mask: Object, zIndex: String })

  const {
    ready,
    container,
    modalVisible,
    onMaskClick
  } = useModal(visible, props)

  const dragging = ref()
  const translate = shallowReactive({ x: 0, y: 0 })
  const transform = computed(() => `translate3d(${translate.x}px, ${translate.y}px, 0)`)

  function onDragStart (event) {
    const { pageX, pageY } = event
    const { x: startX, y: startY } = translate

    dragging.value = true

    function onMouseMove (e) {
      translate.x = startX + e.pageX - pageX
      translate.y = startY + e.pageY - pageY
    }

    function onMouseUp () {
      dragging.value = null

      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
</script>
