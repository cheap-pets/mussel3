<template>
  <Teleport v-if="visible || ready" :to="container">
    <Transition name="mu-dialog">
      <div
        v-show="modalVisible"
        class="mu-modal-mask mu-dialog-mask"
        :class="maskClass" :style="{ zIndex }" v-bind="maskAttrs"
        @sizechange="onMaskResize" @click="onMaskClick">
        <div
          ref="dialogEl"
          class="mu-dialog" :style="[{ transform }, sizeStyle]"
          v-bind="$attrs" :dragging="dragging"
          @mousedown="onDragStart">
          <slot name="client">
            <div v-if="headerVisible" class="mu-dialog_header">
              <slot name="header">
                <slot name="header-prepend" />
                <mu-icon v-if="icon" class="mu-dialog_icon" v-bind="iconBindings" />
                <label class="mu-dialog_title" draggable="false">{{ title }}</label>
                <slot name="header-append" />
                <mu-tool-button
                  v-if="closeButton"
                  class="mu-close-button" icon="x"
                  @click="hide('close-button-click', '$CLOSE')" />
              </slot>
            </div>
            <slot />
            <div v-if="footerVisible" class="mu-dialog_footer">
              <slot name="footer">
                <slot name="footer-prepend" />
                <component
                  :is="el.is"
                  v-for="el in footerButtons" :key="el.key" v-bind="el.bindings"
                  @click="el.is === 'mu-button' && onButtonClick(el)" />
                <slot name="footer-append" />
              </slot>
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
  import './dialog.scss'

  import { ref, shallowRef, shallowReactive, computed, watchEffect } from 'vue'
  import { modalProps, modalEvents, useModal } from './modal'
  import { ButtonShortcuts } from './button-shortcuts'
  import { sizeProps, useSize } from '@/hooks/size'
  import { useKeyGen } from '@/hooks/key-gen'
  import { isString } from '@/utils/type'
  import { debounce } from 'throttle-debounce'

  defineOptions({ name: 'MusselDialog', inheritAttrs: false })

  const slots = defineSlots()
  const emit = defineEmits([...modalEvents, 'buttonClick'])

  const props = defineProps({
    ...sizeProps,
    ...modalProps,
    zIndex: String,
    buttons: Array,
    keepPosition: Boolean,
    icon: [String, Object],
    title: [String, Object],
    closeButton: { type: Boolean, default: true }
  })

  const { ready, container, modalVisible, hide, onMaskClick } = useModal(props, emit)
  const { genKey, getObjectKey } = useKeyGen()
  const { sizeStyle } = useSize(props)

  const headerVisible = computed(() => props.title ?? (props.closeButton || slots.header))
  const footerVisible = computed(() => props.buttons?.length || slots.footer)

  const iconBindings = computed(() =>
    isString(props.icon) ? { icon: props.icon } : props.icon
  )

  const footerButtons = computed(() =>
    props.buttons?.map(el =>
      isString(el)
        ? { key: genKey(), is: 'mu-button', bindings: { caption: el }, ...ButtonShortcuts[el] }
        : { key: getObjectKey(el), is: 'mu-button', bindings: el }
    )
  )

  const dragging = ref()
  const dialogEl = shallowRef()
  const translate = shallowReactive({ x: 0, y: 0 })
  const transform = computed(() => `translate3d(${translate.x}px, ${translate.y}px, 0)`)

  function correctPosition () {
    if (!modalVisible.value) {
      return
    }

    const { top, left, height, width } = dialogEl.value.getBoundingClientRect()
    const { innerHeight, innerWidth } = window

    const minH = height <= innerHeight ? height : innerHeight
    const minW = height <= innerWidth ? width : innerWidth

    if (top < 0) {
      translate.y -= top
    } else if (top > innerHeight - minH) {
      translate.y -= top - innerHeight + minH
    }

    if (left < 0) {
      translate.x -= left
    } else if (left > innerWidth - minW) {
      translate.x -= left - innerWidth + minW
    }
  }

  const onMaskResize = debounce(300, correctPosition)

  function onDragStart (event) {
    const { classList } = event.target

    if (
      !['mu-dialog_header', 'mu-dialog_title'].find(cls => classList.contains(cls))
    ) return

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

      correctPosition()
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  function onButtonClick (btn) {
    const { action, bindings = {} } = btn
    const { name = bindings.name || bindings.id || bindings.caption } = btn

    if (action === 'close') {
      hide('button-click', name)
    } else {
      emit('buttonClick', name)
    }
  }

  watchEffect(() => {
    if (props.visible && !props.keepPosition) {
      Object.assign(translate, { x: 0, y: 0 })
    }
  })

  defineExpose({
    hide
  })
</script>
