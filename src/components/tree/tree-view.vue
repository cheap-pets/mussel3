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

  const emit = defineEmits(['nodeClick', 'nodeButtonClick'])

  const properties = computed(() => ({
    ...DEFAULT_DATA_PROPS,
    ...props.props
  }))

  const nodeIcons = computed(() => (
    (props.nodeIcons !== false) &&
    { ...DEFAULT_NODE_ICONS, ...props.nodeIcons }
  ))

  const expandIcons = computed(() => (
    (props.expandIcons !== false) &&
    { ...DEFAULT_EXPAND_ICONS, ...props.expandIcons }
  ))

  const activeNode = toRef(props, 'activeNode')
  const hoverButtons = toRef(props, 'hoverButtons')
  const autoExpandLevel = toRef(props, 'autoExpandLevel')

  const expandedNodes = new WeakMap()

  function onNodeClick (node) {
    emit('nodeClick', node)
  }

  function onNodeButtonClick (node, button) {
    emit('nodeButtonClick', node, button)
  }

  function getNodeExpanded (node, value) {
    return expandedNodes.get(toRaw(node))
  }

  function setNodeExpanded (node, value) {
    expandedNodes.set(toRaw(node), value)
  }

  const tree = {
    props: properties,
    nodeIcons,
    expandIcons,
    hoverButtons,
    activeNode,
    autoExpandLevel,
    onNodeClick,
    onNodeButtonClick,
    getNodeExpanded,
    setNodeExpanded
  }

  provide('tree', tree)
</script>

<style lang="scss">
  .mu-tree {
    --mu-tree-node-height: 32px;
    --mu-tree-node-indent: 16px;
    --mu-tree-node-padding-y: 0;
    --mu-tree-node-padding-x: 8px;

    overflow: auto;
  }
</style>
