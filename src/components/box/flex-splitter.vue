<template>
  <div
    ref="el"
    class="mu-flex-splitter"
    :direction="direction"
    :appearance="appearance || defaultAppearance"
    @dblclick="onDblClick"
    @mousedown="onMouseDown">
    <slot>
      <svg
        v-if="stripe"
        class="mu-flex-splitter_stripe"
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="stripeSVG.viewBox">
        <path stroke="currentColor" stroke-width="1" :d="stripeSVG.pathD" />
      </svg>
    </slot>
  </div>
</template>

<script setup>
  import { ref, computed, inject, provide, onMounted } from 'vue'

  const el = ref()
  const direction = ref()

  const props = defineProps({
    collapseButton: Boolean,
    collapseThreshold: { type: Number, default: 150 },
    appearance: { type: String, validator: v => ['SLIM', 'THICK'].includes(v.toUpperCase()) }
  })

  const { splitter: defaultOptions = {} } = inject('$mussel').globalOptions
  const { appearance: defaultAppearance = 'slim', stripe = true } = defaultOptions

  const stripeSVG = computed(() =>
    direction.value === 'row'
      ? {
        viewBox: '0 0 4 23',
        pathD: 'M0 1h4M0 4h4M0 7h4M0 10h4M0 13h4M0 16h4M0 19h4M0 22h4'
      }
      : {
        viewBox: '0 0 23 4',
        pathD: 'M1 0v4M4 0v4M7 0v4M10 0v4M13 0v4M16 0v4M19 0v4M22 0v4'
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

  function updateSiblingsFlexSize () {
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
        : /^(\d*\.?\d+)(px)?$/.test(value)
          ? parseInt(value)
          : 0
    }

    function getComputedStyle (element) {
      const style = window.getComputedStyle(element)

      return isRowDirection
        ? {
          min: calcPixelValue(style.minWidth),
          max: calcPixelValue(style.maxWidth),
          size: element.offsetWidth
        }
        : {
          min: calcPixelValue(style.minHeight),
          max: calcPixelValue(style.maxHeight),
          size: element.offsetHeight
        }
    }

    const { min: prevMinSize, max: prevMaxSize, size: prevStartSize } = getComputedStyle(prevSibling)
    const { min: nextMinSize, max: nextMaxSize, size: nextStartSize } = getComputedStyle(nextSibling)

    const totalSize = prevStartSize + nextStartSize

    return {
      totalSize,
      minOffset: Math.max(prevMinSize, nextMaxSize ? totalSize - nextMaxSize : 0) - prevStartSize,
      maxOffset: Math.min(prevMaxSize || totalSize, totalSize - nextMinSize) - prevStartSize,
      prevMinSize,
      nextMinSize,
      prevInitSize: calcPixelValue(prevSibling.getAttribute('init-size')),
      nextInitSize: calcPixelValue(nextSibling.getAttribute('init-size')),
      prevStartSize,
      nextStartSize
    }
  }

  function isCollapsible (node) {
    return ![null, 'false'].includes(node.getAttribute('collapsible'))
  }

  function isCollapsed (node) {
    return node.classList.contains('mu-flex-collapsed')
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

    updateSiblingsFlexSize()

    const { prevSibling, nextSibling } = siblings

    const ct = props.collapseThreshold
    const params = getResizeRange(prevSibling, nextSibling)

    paramsCache = {
      prevSibling,
      nextSibling,
      prevCollapsible: isCollapsible(prevSibling),
      nextCollapsible: isCollapsible(nextSibling),
      prevCollapseThreshold: params.prevMinSize ? params.prevMinSize - ct : ct,
      nextCollapseThreshold: params.nextMinSize ? params.nextMinSize - ct : ct,
      ...params
    }

    resetParamsCacheTimer()

    return paramsCache
  }

  function onDblClick (event) {
    const params = getResizeParams()

    if (!params) return

    const {
      totalSize, minOffset, maxOffset,
      prevSibling, prevInitSize, prevStartSize,
      nextSibling, nextInitSize, nextStartSize
    } = params

    if (isCollapsed(prevSibling) || isCollapsed(nextSibling)) return

    const offset = prevInitSize
      ? prevInitSize - prevStartSize
      : nextInitSize
        ? nextInitSize - nextInitSize
        : Math.trunc(totalSize / 2) - prevStartSize

    if (offset >= minOffset && offset <= maxOffset) {
      prevSibling.style.flexBasis = `${prevStartSize + offset}px`
      nextSibling.style.flexBasis = `${nextStartSize - offset}px`
    }
  }

  function onMouseDown (event) {
    const params = getResizeParams()

    if (!params) return

    const {
      totalSize, minOffset, maxOffset,
      prevSibling, prevStartSize, prevCollapsible, prevCollapseThreshold,
      nextSibling, nextStartSize, nextCollapsible, nextCollapseThreshold
    } = params

    const { pageX: startX, pageY: startY } = event

    function calcAndCollapse (offset) {
      const collapseTarget =
        prevCollapsible && (prevStartSize + offset < prevCollapseThreshold)
          ? prevSibling
          : nextCollapsible && (nextStartSize - offset < nextCollapseThreshold)
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
        prevSibling.style.flexBasis = `${prevStartSize + offset}px`
        nextSibling.style.flexBasis = `${nextStartSize - offset}px`
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

  onMounted(() => {
    const parent = el.value.parentNode
    const flexDirection = window.getComputedStyle(parent).flexDirection

    direction.value = flexDirection && (
      flexDirection.startsWith('column') ? 'column' : 'row'
    )
  })

  provide('direction', direction)
</script>

<style>
  .mu-flex-splitter {
    --mu-flex-splitter-slim-size: 2px;
    --mu-flex-splitter-thick-size: 6px;

    --mu-flex-splitter-bg: var(--mu-border-color);
    --mu-flex-splitter-hover-bg: var(--mu-divider-color);
    --mu-flex-splitter-active-bg: var(--mu-primary-color);

    --mu-flex-splitter-stripe-size: calc(var(--mu-flex-splitter-thick-size) - 2px);
    --mu-flex-splitter-stripe-color: #fff;

    cursor: col-resize;
    user-select: none;

    position: relative;
    z-index: 10;

    overflow: visible;
    display: none;
    flex: 0 0 var(--mu-flex-splitter-slim-size);
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

    &[appearance="thick"] {
      flex-basis: var(--mu-flex-splitter-thick-size);
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
    }

    &:hover,
    &[active],
    &[appearance="thick"] {
      & > .mu-flex-splitter_stripe {
        display: block;
      }
    }

    &[resizable="false"] {
      pointer-events: none;

      & > .mu-flex-splitter_stripe {
        display: none !important;
      }
    }
  }

  .mu-flex-splitter_stripe {
    position: absolute;
    display: none;
    color: var(--mu-flex-splitter-stripe-color);
  }

  .mu-flex-splitter[direction="row"] {
    cursor: col-resize;

    &::before {
      top: 0;
      bottom: 0;
      width: var(--mu-flex-splitter-slim-size);
    }

    & > .mu-flex-splitter_stripe {
      width: var(--mu-flex-splitter-stripe-size);
    }

    &:hover,
    &[active],
    &[appearance="thick"] {
      &::before {
        width: var(--mu-flex-splitter-thick-size);
      }
    }
  }

  .mu-flex-splitter[direction="column"] {
    cursor: row-resize;

    &::before {
      right: 0;
      left: 0;
      height: var(--mu-flex-splitter-slim-size);
    }

    & > .mu-flex-splitter_stripe {
      height: var(--mu-flex-splitter-stripe-size);
    }

    &:hover,
    &[active],
    &[appearance="thick"] {
      &::before {
        height: var(--mu-flex-splitter-thick-size);
      }
    }
  }

  .mu-flex-collapsed {
    display: none !important;
  }
</style>
