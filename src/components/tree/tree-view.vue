<template>
  <div class="mu-tree">
    <mu-tree-node
      v-for="node in nodes"
      :key="node[nodeProps.key]"
      :node="node"
      :level="0">
      <template #default>
        <slot :node="node" />
      </template>
    </mu-tree-node>
  </div>
</template>

<script setup>
  import { toRaw, toRef, computed, provide } from 'vue'

  // defineOptions({
  //   name: 'MuTree'
  // })

  const props = defineProps({
    nodes: Array,
    props: Object,
    ui: Object,
    activeNode: [Object, String, Number],
    filteredKeys: Array,
    indent: {
      type: Number,
      default: 16
    },
    autoExpandLevel: {
      type: Number,
      default: 0
    }
  })

  const emit = defineEmits(['nodeClick'])

  const nodeProps = computed(() => Object.assign(
    {
      key: 'id',
      icon: 'icon',
      label: 'label',
      isLeaf: 'isLeaf',
      disabled: 'disabled',
      childNodes: 'childNodes'
    },
    props.props
  ))

  const indent = toRef(props, 'indent')
  const activeNode = toRef(props, 'activeNode')
  const autoExpandLevel = toRef(props, 'autoExpandLevel')

  const expandedNodes = new WeakMap()

  function onNodeClick (node) {
    emit('nodeClick', node)
  }

  function getNodeExpanded (node, value) {
    return expandedNodes.get(toRaw(node))
  }

  function setNodeExpanded (node, value) {
    expandedNodes.set(toRaw(node), value)
  }

  const tree = {
    props: nodeProps,
    indent,
    activeNode,
    autoExpandLevel,
    onNodeClick,
    getNodeExpanded,
    setNodeExpanded
  }

  provide('tree', tree)
</script>
