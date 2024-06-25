<template>
  <div
    ref="el"
    class="mu-flex-splitter"
    :direction="direction"
    @dblclick="onDblClick"
    @mousedown="onMouseDown">
    <slot name="handle">
      <svg class="mu-flex-splitter_handle" xmlns="http://www.w3.org/2000/svg" :viewBox="svg.viewBox">
        <path stroke="currentColor" stroke-width="1" :d="svg.d" />
      </svg>
    </slot>
  </div>
</template>

<script setup>
  import { ref, computed, provide } from 'vue'

  const el = ref()

  const props = defineProps({
    collapseButton: Boolean,
    collapseThreshold: { type: Number, default: 150 }
  })

  const direction = computed(() => {
    const parent = el.value?.parentNode
    const flexDirection = parent && window.getComputedStyle(parent).flexDirection

    return flexDirection && (
      flexDirection.startsWith('column') ? 'column' : 'row'
    )
  })

  const svg = computed(() =>
    direction.value === 'row'
      ? {
        viewBox: '0 0 4 23',
        d: 'M0 1h4M0 4h4M0 7h4M0 10h4M0 13h4M0 16h4M0 19h4M0 22h4'
      }
      : {
        viewBox: '0 0 23 4',
        d: 'M1 0v4M4 0v4M7 0v4M10 0v4M13 0v4M16 0v4M19 0v4M22 0v4'
      }
  )

  function isResizableElement (node) {
    const { position, display } = window.getComputedStyle(node)

    return (
      (display !== 'none' || node.classList.contains('mu-flex-collapsed')) &&
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

    const { min: prevMinSize, max: prevMaxSize, size: prevInitSize } = getComputedStyle(prevSibling)
    const { min: nextMinSize, max: nextMaxSize, size: nextInitSize } = getComputedStyle(nextSibling)

    const totalSize = prevInitSize + nextInitSize
    const minOffset = Math.max(prevMinSize, nextMaxSize ? totalSize - nextMaxSize : 0) - prevInitSize
    const maxOffset = Math.min(prevMaxSize || totalSize, totalSize - nextMinSize) - prevInitSize

    return {
      totalSize,
      prevMinSize,
      nextMinSize,
      prevInitSize,
      nextInitSize,
      minOffset,
      maxOffset
    }
  }

  function isCollapsible (node) {
    return ![null, 'false'].includes(node.getAttribute('collapsible'))
  }

  let paramsCache
  let paramsCacheTimer

  function resetParamsCacheTimer () {
    if (paramsCacheTimer) clearTimeout(paramsCacheTimer)

    paramsCacheTimer = setTimeout(() => {
      paramsCache = null
      paramsCacheTimer = null
    }, 500)
  }

  function getResizeParams () {
    if (paramsCache) return paramsCache

    const siblings = getResizeSiblings()

    if (!siblings) return

    resetSiblingsFlexSize()

    const { prevSibling, nextSibling } = siblings

    const rangeParams = getResizeRange(prevSibling, nextSibling)

    const { prevMinSize, nextMinSize } = rangeParams

    paramsCache = {
      prevSibling,
      nextSibling,
      prevCollapsible: isCollapsible(prevSibling),
      nextCollapsible: isCollapsible(nextSibling),
      ...rangeParams,
      prevCollapseThreshold:
        prevMinSize
          ? prevMinSize - props.collapseThreshold
          : props.collapseThreshold,
      nextCollapseThreshold:
        nextMinSize
          ? nextMinSize - props.collapseThreshold
          : props.collapseThreshold
    }

    resetParamsCacheTimer()

    return paramsCache
  }

  function onDblClick (event) {
    const params = getResizeParams()

    if (!params) return

    const {
      totalSize, minOffset, maxOffset,
      prevInitSize, nextInitSize,
      prevSibling, nextSibling
    } = params

    const offset = Math.trunc(totalSize / 2) - prevInitSize

    if (offset >= minOffset && offset <= maxOffset) {
      prevSibling.style.flexBasis = `${prevInitSize + offset}px`
      nextSibling.style.flexBasis = `${nextInitSize - offset}px`
    }
  }

  function onMouseDown (event) {
    const params = getResizeParams()

    if (!params) return

    const { pageX: startX, pageY: startY } = event

    const {
      totalSize, minOffset, maxOffset,
      prevSibling, nextSibling,
      prevInitSize, nextInitSize,
      prevCollapsible, nextCollapsible,
      prevCollapseThreshold, nextCollapseThreshold
    } = params

    function calcAndCollapse (offset) {
      const collapseTarget =
        prevCollapsible && (prevInitSize + offset < prevCollapseThreshold)
          ? prevSibling
          : nextCollapsible && (nextInitSize - offset < nextCollapseThreshold)
            ? nextSibling
            : null

      if (!collapseTarget) {
        prevSibling.classList.remove('mu-flex-collapsed')
        nextSibling.classList.remove('mu-flex-collapsed')
        return
      }

      const expandTarget = collapseTarget === prevSibling ? nextSibling : prevSibling

      collapseTarget.classList.add('mu-flex-collapsed')
      collapseTarget.style.flexBasis = 0

      expandTarget.classList.remove('mu-flex-collapsed')
      expandTarget.style.flexBasis = `${totalSize}px`

      return true
    }

    function onMouseMove (e) {
      let offset = direction.value === 'row'
        ? e.pageX - startX
        : e.pageY - startY

      if (!calcAndCollapse(offset)) {
        offset = Math.max(minOffset, Math.min(offset, maxOffset))
        prevSibling.style.flexBasis = `${prevInitSize + offset}px`
        nextSibling.style.flexBasis = `${nextInitSize - offset}px`
      }
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

  provide('direction', direction)
</script>

<style>
  .mu-flex-splitter {
    --mu-flex-splitter-size: 2px;
    --mu-flex-splitter-hover-size: 6px;

    --mu-flex-splitter-bg: #555;
    --mu-flex-splitter-hover-bg: #666;
    --mu-flex-splitter-active-bg: var(--mu-primary-color);

    --mu-flex-splitter-handle-size: calc(var(--mu-flex-splitter-hover-size) - 2px);
    --mu-flex-splitter-handle-color: #fff;

    cursor: col-resize;
    user-select: none;

    position: relative;
    z-index: 10;

    overflow: visible;
    display: none;
    flex: 0 0 var(--mu-flex-splitter-size);
    align-items: center;
    align-self: stretch;
    justify-content: center;

    &::before {
      content: '';
      position: absolute;
      background: var(--mu-flex-splitter-bg);
    }

    &[direction] {
      display: flex;
    }

    &:hover::before {
      background: var(--mu-flex-splitter-hover-bg);
    }

    &[active]::before {
      background: var(--mu-flex-splitter-active-bg);
    }

    &:hover,
    &[active] {
      z-index: 20;

      & > .mu-flex-splitter_handle {
        display: block;
      }
    }

    &[resizable="false"] {
      pointer-events: none;

      & > .mu-flex-splitter_handle {
        display: none !important;
      }
    }
  }

  .mu-flex-splitter_handle {
    position: absolute;
    display: none;
    color: var(--mu-flex-splitter-handle-color);
  }

  .mu-flex-splitter[direction="row"] {
    cursor: col-resize;

    &::before {
      top: 0;
      bottom: 0;
      width: var(--mu-flex-splitter-size);
    }

    & > .mu-flex-splitter_handle {
      width: var(--mu-flex-splitter-handle-size);
    }

    &:hover,
    &[active] {
      &::before {
        width: var(--mu-flex-splitter-hover-size);
      }
    }
  }

  .mu-flex-splitter[direction="column"] {
    cursor: row-resize;

    &::before {
      right: 0;
      left: 0;
      height: var(--mu-flex-splitter-size);
    }

    & > .mu-flex-splitter_handle {
      height: var(--mu-flex-splitter-handle-size);
    }

    &:hover,
    &[active] {
      &::before {
        height: var(--mu-flex-splitter-hover-size);
      }
    }
  }

  .mu-flex-collapsed {
    display: none !important;
  }
</style>
