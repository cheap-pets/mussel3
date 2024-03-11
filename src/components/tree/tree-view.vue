<template>
  <div class="mu-tree">
    <mu-tree-node v-for="el in data" :key="el[properties.key]" :node="el">
      <slot :node="el" />
    </mu-tree-node>
  </div>
</template>

<script setup>
  import { toRaw, toRef, computed, provide } from 'vue'
  import { DEFAULT_DATA_PROPS, DEFAULT_EXPAND_ICONS, DEFAULT_NODE_ICONS } from './default-options'

  const props = defineProps({
    ui: Object,
    data: Array,
    props: Object,
    checkbox: Boolean,
    cascadedCheck: Boolean,
    hoverButtons: Array,
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

  const emit = defineEmits(['nodeClick', 'nodeButtonClick', 'update:nodeChecked'])

  const properties = computed(() =>
    Object.fromEntries(
      Object
        .entries({ ...DEFAULT_DATA_PROPS, ...props.props })
        .filter(([key, prop]) => !!prop)
    )
  )

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
  const activeNode = toRef(props, 'activeNode')
  const hoverButtons = toRef(props, 'hoverButtons')
  const autoExpandLevel = toRef(props, 'autoExpandLevel')

  function onNodeClick (node) {
    emit('nodeClick', node)
  }

  function onNodeButtonClick (node, button) {
    emit('nodeButtonClick', node, button)
  }

  // function onUpdateNodeChecked (node, checked) {
  //   emit('update:nodeChecked', node, checked)
  // }

  let expandedNodes = new WeakMap()

  function resetExpandedNodes () {
    expandedNodes = new WeakMap()
  }

  function getNodeExpanded (node) {
    return expandedNodes.get(toRaw(node))
  }

  function setNodeExpanded (node, value) {
    expandedNodes.set(toRaw(node), value)
  }

  let selectedNodes = new WeakMap()

  function resetSelectedNodes () {
    selectedNodes = new WeakMap()
  }

  function getNodeSelected (node) {
    return selectedNodes.get(toRaw(node))
  }

  function setNodeSelected (node, value) {
    if (properties.value.checked) {
      emit('update:nodeChecked', node, value)
    } else {
      selectedNodes.set(toRaw(node), value)
    }
  }

  function getSelectedNodes () {

  }

  function setSelectedNodes (nodes) {

  }

  function setSelectedNodesByKeys (keys) {

  }

  provide('tree', {
    props: properties,
    nodeIcons,
    expandIcons,
    hoverButtons,
    checkbox,
    cascadedCheck,
    activeNode,
    autoExpandLevel,
    onNodeClick,
    onNodeButtonClick,
    // onUpdateNodeChecked,
    getNodeExpanded,
    setNodeExpanded,
    getNodeSelected,
    setNodeSelected
  })

  defineExpose({
    resetExpandedNodes,
    resetSelectedNodes,
    getSelectedNodes,
    setSelectedNodes,
    setSelectedNodesByKeys
  })
</script>

<style lang="scss">
  .mu-tree {
    --mu-tree-node-height: 32px;
    --mu-tree-node-indent: 16px;
    --mu-tree-node-padding-y: 4px;
    --mu-tree-node-padding-x: 8px;

    overflow: auto;
  }
</style>
