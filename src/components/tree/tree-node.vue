<template>
  <a
    class="mu-tree-node"
    :expanded="expanded || null"
    :disabled="data.disabled || null"
    :active="active || null"
    :style="{ paddingLeft }"
    @click="onNodeClick(node)"
    @dblclick="toggleExpand">
    <mu-icon
      v-if="expandIcon !== false"
      class="mu-tree-node_expand-icon"
      :icon="expandIcon"
      @click.stop="toggleExpand"
      @dblclick.stop />
    <mu-check
      v-if="hasCheck"
      v-model="checked"
      @dblclick.stop />
    <slot :node="node">
      <mu-icon
        v-if="nodeIcon !==false"
        class="mu-tree-node_icon"
        :icon="nodeIcon" />
      <label class="mu-tree-node_label" :title="data.title">
        {{ data.label }}
      </label>
    </slot>
    <mu-icon
      v-for="button in hoverButtons"
      :key="button"
      v-bind="button"
      class="mu-icon-button mu-tree-node_hover-button"
      @click="onNodeButtonClick(node, button)" />
  </a>
  <template v-if="expanded">
    <mu-tree-node
      v-for="child in data.childNodes"
      :key="child[tree.props.key]"
      :node="child"
      :level="level + 1">
      <template #default>
        <slot :node="child" />
      </template>
    </mu-tree-node>
  </template>
</template>

<script setup>
  import { ref, computed, toRaw, inject, onMounted } from 'vue'

  const props = defineProps({
    node: Object,
    level: {
      type: Number,
      default: 0
    }
  })

  const tree = inject('tree')

  const {
    nodeIcons,
    expandIcons,
    activeNode,
    hoverButtons,
    autoExpandLevel,
    onNodeClick,
    onNodeButtonClick,
    // onUpdateNodeChecked,
    getNodeExpanded,
    setNodeExpanded,
    getNodeSelected,
    setNodeSelected
  } = tree

  const data = computed(() =>
    Object.fromEntries(
      Object
        .entries(tree.props.value)
        .map(([key, prop]) => [key, props.node[prop]])
    )
  )

  const hasChild = computed(() => !(data.value.isLeaf ?? !data.value.childNodes?.length))
  const hasCheck = computed(() => tree.checkbox.value)

  const checked = computed({
    get () {
      return tree.props.value.checked
        ? !!data.value.checked
        : !!getNodeSelected(props.node)
    },
    set (v) {
      setNodeSelected(props.node, v)
      // onUpdateNodeChecked(props.node, v)
    }
  })

  const expandIcon = computed(() =>
    (expandIcons.value !== false) &&
    (
      (
        hasChild.value
          ? ((expanded.value && expandIcons.value.collapse) || expandIcons.value.expand)
          : expandIcons.value.leaf
      ) ||
      null
    )
  )

  const nodeIcon = computed(() =>
    (nodeIcons.value !== false) &&
    (
      data.value.icon ||
      (
        hasChild.value
          ? ((expanded.value && nodeIcons.value.folderOpen) || nodeIcons.value.folder)
          : nodeIcons.value.leaf
      ) ||
      null
    )
  )

  const paddingLeft = computed(() =>
    `calc(var(--mu-tree-node-indent) * ${props.level} + var(--mu-tree-node-padding-x))`
  )

  const active = computed(() =>
    (toRaw(props.node) === toRaw(activeNode.value)) ||
    (data.value.key != null && data.value.key === activeNode.value)
  )

  // const expanded = computed(() => (hasChild.value && expandedNodes.value.get(props.node)) || null)
  const expanded = ref(null)

  function toggleExpand () {
    if (hasChild.value) {
      setNodeExpanded(props.node, expanded.value = !expanded.value)
    }
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
    min-height: var(--mu-tree-node-height);
    padding: var(--mu-tree-node-padding-y) var(--mu-tree-node-padding-x);

    font-size: var(--mu-common-font-size);
    line-height: $listItemLineHeight;

    color: var(--mu-text-color-normal);

    & > .mu-icon {
      flex: none;
      font-size: $listItemIconSize;
    }

    & > .mu-tree-node_expand-icon {
      pointer-events: auto;

      &[icon="dropdown"] {
        transform: rotate(-90deg);
        transition: transform .1s ease-in-out;
      }
    }

    & > .mu-tree-node_hover-button {
      display: none;
      height: 20px;
      width: 20px;
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
      color: var(--mu-primary-color);
      background-color: var(--mu-primary-color-shadow);
    }

    &[disabled] {
      pointer-events: none;
      cursor: default;
      background: inherit;
      color: var(--mu-text-color-weak);
    }

    &[expanded] {
      & > .mu-tree-node_expand-icon {
        transform: rotate(0);
      }
    }

    &:hover {
      & > .mu-tree-node_hover-button {
        display: inline-flex;
      }
    }
  }
</style>
