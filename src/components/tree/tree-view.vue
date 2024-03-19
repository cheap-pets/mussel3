<template>
  <div class="mu-tree">
    <mu-tree-nodes :key="refreshKey" :nodes="data" :level="0">
      <template #default="{ node }">
        <slot :node="node" />
      </template>
      <template #buttons="{ node }">
        <slot name="buttons" :node="node" />
      </template>
    </mu-tree-nodes>
  </div>
</template>

<script setup>
  import { ref, toRaw, toRef, computed, provide } from 'vue'
  import { DEFAULT_DATA_PROPS, DEFAULT_EXPAND_ICONS, DEFAULT_NODE_ICONS } from './default-options'

  const props = defineProps({
    ui: Object,
    data: Array,
    props: Object,
    buttons: Array,
    checkbox: Boolean,
    cascadedCheck: Boolean,
    checkedNodesKeys: Set,
    autoExpandLevel: Number,
    activeNode: [Object, String, Number],
    nodeIcons: {
      type: [Boolean, Object],
      default: true
    },
    expandIcons: {
      type: [Boolean, Object],
      default: true
    }
  })

  const emit = defineEmits([
    'nodeClick',
    'nodeExpand',
    'nodeCollapse',
    'nodeButtonClick',
    'nodeCheckChange'
  ])

  const nodeProps = computed(() =>
    Object.fromEntries(
      Object
        .entries({ ...DEFAULT_DATA_PROPS, ...props.props })
        .filter(([key, prop]) => !!prop)
    )
  )

  const keyProp = computed(() => nodeProps.value.key)

  const nodeIcons = computed(() => (
    (props.nodeIcons !== false) &&
    { ...DEFAULT_NODE_ICONS, ...props.nodeIcons }
  ))

  const expandIcons = computed(() => (
    (props.expandIcons !== false) &&
    { ...DEFAULT_EXPAND_ICONS, ...props.expandIcons }
  ))

  const checkbox = toRef(props, 'checkbox')
  const cascadedCheck = toRef(props, 'cascadedCheck')
  const checkedNodesKeys = toRef(props, 'checkedNodesKeys')

  const activeNode = toRef(props, 'activeNode')
  const buttons = toRef(props, 'buttons')

  const autoExpandLevel = ref(props.autoExpandLevel)
  const expandedNodes = ref()
  const refreshKey = ref('root' + (+new Date()))

  expandedNodes.value = new WeakMap()

  function getNodeExpanded (node) {
    return expandedNodes.value.get(toRaw(node))
  }

  function setNodeExpanded (node, value, stopAutoExpand) {
    if (stopAutoExpand) autoExpandLevel.value = null

    expandedNodes.value.set(toRaw(node), value)
    emit(value ? 'nodeExpand' : 'nodeCollapse', node)

    return value
  }

  function resetExpandLevel (level) {
    autoExpandLevel.value = level
    expandedNodes.value = new WeakMap()
    // refreshKey.value = 'root' + (+new Date())
  }

  function walkTo (node) {
    const target = toRaw(node)

    function walkDeep (nodes) {
      const result = []

      for (const el of nodes) {
        if (el === target || (keyProp.value && el[keyProp.value] === target)) {
          result.push(el)
          break
        } else if (el.childNodes) {
          const deepResult = walkDeep(el.childNodes)

          if (deepResult.length) result.push(el, ...deepResult)
        }

        if (result.length) break
      }

      return result
    }

    return walkDeep(toRaw(props.data))
  }

  function expand (...nodes) {
    nodes.forEach(el => setNodeExpanded(el, true, true))
  }

  function expandTo (node) {
    expand(...walkTo(node))
  }

  function collapse (...nodes) {
    nodes.forEach(el => setNodeExpanded(el, false, true))
  }

  function expandAll (options = {}) {
    resetExpandLevel(options.level || props.autoExpandLevel || 0)
  }

  function collapseAll () {
    resetExpandLevel(null)
  }

  provide('tree', {
    emit,

    nodeProps,
    keyProp,

    buttons,
    nodeIcons,
    expandIcons,

    activeNode,

    checkbox,
    cascadedCheck,
    checkedNodesKeys,

    autoExpandLevel,
    getNodeExpanded,
    setNodeExpanded
  })

  defineExpose({
    expand,
    expandTo,
    collapse,
    expandAll,
    collapseAll
  })
</script>

<style>
  .mu-tree {
    --mu-tree-node-height: 32px;
    --mu-tree-node-indent: 16px;
    --mu-tree-node-padding-y: 4px;
    --mu-tree-node-padding-x: 8px;

    overflow: auto;
  }
</style>
