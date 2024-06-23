<template>
  <div ref="el" class="mu-flex-splitter" :direction="direction" @mousedown="onMouseDown" />
</template>

<script setup>
  import { ref, computed } from 'vue'

  const el = ref()

  const direction = computed(() => {
    const parent = el.value?.parentNode
    const flexDirection = parent && window.getComputedStyle(parent).flexDirection

    return flexDirection && (
      flexDirection.startsWith('column') ? 'column' : 'row'
    )
  })

  function isResizableElement (node) {
    const { position, display } = window.getComputedStyle(node)

    return (
      display !== 'none' &&
      !['fixed', 'absolute', 'sticky'].includes(position) &&
      !node.classList.contains('mu-flex-splitter')
    )
  }

  function resetSiblingsFlexSize () {
    Array
      .from(el.value.parentNode.children)
      .reduce((result, child) => {
        if (isResizableElement(child)) {
          const style = direction.value === 'row'
            ? { flexBasis: `${child.offsetWidth}px`, width: null }
            : { flexBasis: `${child.offsetHeight}px`, height: null }

          const { flexGrow, flexShrink } = window.getComputedStyle(child)

          if (parseInt(flexGrow) > 1) style.flexGrow = '1'
          if (parseInt(flexShrink) > 1) style.flexShrink = '1'

          result.push({ child, style })
        }

        return result
      }, [])
      .forEach(item => {
        Object.assign(item.child.style, item.style)
      })
  }

  function getResizeSiblings () {
    let prevSibling = el.value.previousElementSibling

    while (prevSibling) {
      if (isResizableElement(prevSibling)) break

      prevSibling = prevSibling.previousElementSibling
    }

    if (!prevSibling) return

    let nextSibling = el.value.nextElementSibling

    while (nextSibling) {
      if (isResizableElement(nextSibling)) break

      nextSibling = nextSibling.nextElementSibling
    }

    return nextSibling && { prevSibling, nextSibling }
  }

  function getResizeRange (prevSibling, nextSibling) {
    const isRowDirection = direction.value === 'row'

    const parentNode = el.value.parentNode
    const parentSize = isRowDirection ? parentNode.clientWidth : parentNode.clientHeight

    function calcPixelValue (value) {
      return /^\d+(\.\d+)?%$/.test(value)
        ? Math.round(parseFloat(value) * parentSize / 100)
        : parseInt(value)
    }

    function getComputedStyle (element) {
      const style = window.getComputedStyle(element)

      return isRowDirection
        ? {
          min: calcPixelValue(style.minWidth) || 0,
          max: calcPixelValue(style.maxWidth) || 0,
          size: element.offsetWidth
        }
        : {
          min: calcPixelValue(style.minHeight) || 0,
          max: calcPixelValue(style.maxHeight) || 0,
          size: element.offsetHeight
        }
    }

    const { min: prevMin, max: prevMax, size: prevInitSize } = getComputedStyle(prevSibling)
    const { min: nextMin, max: nextMax, size: nextInitSize } = getComputedStyle(nextSibling)

    const total = prevInitSize + nextInitSize
    const minOffset = Math.max(prevMin, nextMax ? total - nextMax : 0) - prevInitSize
    const maxOffset = Math.min(prevMax || total, total - nextMin) - prevInitSize

    return {
      prevInitSize,
      nextInitSize,
      minOffset,
      maxOffset
    }
  }

  function onMouseDown (event) {
    const siblings = getResizeSiblings()

    if (!siblings) return

    resetSiblingsFlexSize()

    const { prevSibling, nextSibling } = siblings
    const { pageX: startX, pageY: startY } = event

    const {
      prevInitSize,
      nextInitSize,
      minOffset,
      maxOffset
    } = getResizeRange(prevSibling, nextSibling)

    function onMouseMove (e) {
      const offset = direction.value === 'row'
        ? e.pageX - startX
        : e.pageY - startY

      if (offset < minOffset || offset > maxOffset) return

      prevSibling.style.flexBasis = `${prevInitSize + offset}px`
      nextSibling.style.flexBasis = `${nextInitSize - offset}px`
    }

    function onMouseUp () {
      el.value.removeAttribute('active')

      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    el.value.setAttribute('active', true)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
</script>

<style>
  .mu-flex-splitter {
    --mu-flex-splitter-size: 2px;
    --mu-flex-splitter-scale: 2;

    --mu-flex-splitter-bg: var(--mu-border-color);
    --mu-flex-splitter-hover-bg: var(--mu-border-color);
    --mu-flex-splitter-active-bg: var(--mu-primary-color);

    cursor: col-resize;
    user-select: none;

    position: relative;
    z-index: 10;

    overflow: visible;
    display: none;
    flex: 0 0 var(--mu-flex-splitter-size);
    align-self: stretch;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--mu-flex-splitter-bg);
    }

    &[direction] {
      display: block;
    }

    &[active],
    &:hover {
      &::before {
        transform: scaleX(var(--mu-flex-splitter-scale));
        background: var(--mu-flex-splitter-hover-bg);
      }
    }

    &[active]::before {
      background: var(--mu-flex-splitter-active-bg);
    }

    &[draggable="false"] {
      pointer-events: none;
    }
  }

  .mu-flex-splitter[direction="column"] {
    cursor: row-resize;

    &:hover::before {
      transform: scaleY(var(--mu-flex-splitter-scale));
    }
  }
</style>
