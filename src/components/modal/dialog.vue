<template>
  <Teleport v-if="visible || ready" :to="container">
    <Transition name="mu-dialog">
      <div
        v-show="modalVisible" v-bind="maskAttrs"
        class="mu-modal-mask mu-dialog-mask" :style="{ zIndex }"
        @sizechange="onMaskResize"
        @click="onMaskClick">
        <div
          ref="dialogEl"
          class="mu-dialog" :style="[{ transform }, sizeStyle]"
          v-bind="$attrs" :dragging="dragging"
          @mousedown="onDragStart">
          <slot name="dialog">
            <div v-if="headerVisible" class="mu-dialog_header">
              <slot name="header">
                <slot name="header-prepend" />
                <mu-icon v-if="icon" class="mu-dialog_icon" v-bind="iconBindings" />
                <label class="mu-dialog_title" draggable="false">{{ title }}</label>
                <slot name="header-append" />
                <mu-tool-button
                  v-if="closeButton"
                  class="mu-dialog_close-button" icon="x"
                  @click="onCloseButtonClick" />
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

  const { genKey, getObjectKey } = useKeyGen()

  defineOptions({ name: 'MusselDialog', inheritAttrs: false })

  const slots = defineSlots()
  const emit = defineEmits([...modalEvents, 'buttonClick'])

  const props = defineProps({
    icon: [String, Object],
    title: [String, Object],
    buttons: Array,
    zIndex: String,
    maskAttrs: Object,
    keepPosition: Boolean,
    closeButton: { type: Boolean, default: true },
    ...sizeProps,
    ...modalProps
  })

  const headerVisible = computed(() => props.title ?? (props.closeButton || slots.header))
  const footerVisible = computed(() => props.buttons?.length || slots.footer)

  const iconBindings = computed(() => isString(props.icon) ? { icon: props.icon } : props.icon)

  const footerButtons = computed(() =>
    props.buttons?.map(el =>
      isString(el)
        ? { key: genKey(), is: 'mu-button', bindings: { caption: el }, ...ButtonShortcuts[el] }
        : { key: getObjectKey(el), is: 'mu-button', bindings: el }
    )
  )

  const sizeStyle = useSize(props).sizeStyle

  const {
    ready,
    container,
    modalVisible,
    hide,
    onMaskClick,
    onCloseButtonClick
  } = useModal(props, emit)

  const dialogEl = shallowRef()
  const dragging = ref()
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

  const onMaskResize = debounce(500, correctPosition)

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
    emit('buttonClick', btn.name || btn.bindings)

    if (btn.action === 'close') {
      hide('button-click', btn.name)
    }
  }

  watchEffect(() => {
    if (props.visible && !props.keepPosition) {
      Object.assign(translate, { x: 0, y: 0 })
    }
  })
</script>
