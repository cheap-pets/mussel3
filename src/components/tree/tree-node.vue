<template>
  <a
    class="mu-tree-node"
    :expanded="expanded || null"
    :disabled="disabled || null"
    :active="active || null"
    @click="onNodeClick(node)">
    <mu-icon
      class="mu-tree-node_expand-icon"
      :icon="expandIcon"
      :style="{ marginLeft }"
      @click.stop="toggleExpand" />
    <slot :node="node">
      <mu-icon v-if="icon" class="mu-tree-node_icon" :icon="icon" />
      <label class="mu-tree-node_label" :title="label">
        {{ label }}
      </label>
    </slot>
  </a>
  <template v-if="expanded">
    <mu-tree-node
      v-for="child in childNodes"
      :key="child[key]"
      :node="child"
      :level="level + 1">
      <template #default>
        <slot :node="child" />
      </template>
    </mu-tree-node>
  </template>
</template>

<script setup>
  import { ref, computed, inject, onMounted } from 'vue'

  // defineOptions({ name: 'MuTreeNode' })

  const props = defineProps({
    node: Object,
    level: Number
  })

  const {
    props: nodeProps,
    indent,
    activeNode,
    autoExpandLevel,
    onNodeClick,
    getNodeExpanded,
    setNodeExpanded
  } = inject('tree')

  const key = computed(() => props.node[nodeProps.value.key])
  const icon = computed(() => props.node[nodeProps.value.icon])
  const label = computed(() => props.node[nodeProps.value.label])
  const isLeaf = computed(() => props.node[nodeProps.value.isLeaf])
  const disabled = computed(() => props.node[nodeProps.value.disabled])
  const childNodes = computed(() => props.node[nodeProps.value.childNodes])

  const hasChild = computed(() => !(isLeaf.value ?? !childNodes.value?.length))
  const expandIcon = computed(() => hasChild.value ? 'dropdown' : null)
  const marginLeft = computed(() => props.level && `${props.level * indent.value}px`)

  const active = computed(() =>
    (props.node === activeNode.value) ||
    (key.value != null && key.value === activeNode.value)
  )

  // const expanded = computed(() => (hasChild.value && expandedNodes.value.get(props.node)) || null)
  const expanded = ref(null)

  function toggleExpand () {
    setNodeExpanded(props.node, expanded.value = !expanded.value)
  }

  onMounted(() => {
    const oldExpanded = getNodeExpanded(props.node)
    const newExpanded = (oldExpanded ?? props.level <= autoExpandLevel.value) && !!hasChild.value

    if (newExpanded !== oldExpanded) setNodeExpanded(props.node, newExpanded)

    expanded.value = newExpanded || null
  })
</script>

<style lang="scss">
  .mu-tree-node {
    cursor: pointer;

    position: relative;

    overflow: visible;
    display: flex;
    gap: 4px;
    align-items: center;

    width: 100%;
    min-height: $listItemHeight;
    padding: $listItemPaddingY $listItemPaddingX;

    font-size: var(--mu-common-font-size);
    line-height: $listItemLineHeight;

    & > .mu-icon {
      flex: none;
      font-size: $listItemIconSize;
    }

    & > .mu-tree-node_label {
      cursor: inherit;

      overflow: hidden;
      flex: 1 1 0;

      text-overflow: ellipsis;
      white-space: nowrap;

      user-select: none;
    }

    &:hover {
      background: var(--mu-list-item-hover-background);
    }

    &[active] {
      color: var(--mu-text-color-reversed);
      background-color: var(--mu-primary-color);
    }

    &[disabled] {
      pointer-events: none;
      cursor: default;
      background: inherit;

      & > label {
        color: var(--mu-text-color-weak);
      }
    }
  }
</style>
