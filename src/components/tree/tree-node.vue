<template>
  <a
    class="mu-tree-node"
    :expanded="expanded || null"
    :disabled="data.disabled || null"
    :active="active || null"
    :style="{ paddingLeft }"
    @click="tree.emit('nodeClick', node)"
    @dblclick="toggleExpand">
    <mu-icon
      v-if="expandIcon !== false"
      class="mu-tree-node_expand-icon"
      :icon="expandIcon"
      @click.stop="toggleExpand"
      @dblclick.stop />
    <mu-check
      v-if="checkbox"
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
      v-for="btn in buttons"
      :key="btn"
      v-bind="btn"
      class="mu-icon-button mu-tree-node_button"
      @click="tree.emit('nodeButtonClick', node, button)" />
  </a>
  <template v-if="expanded">
    <mu-tree-nodes :nodes="data.childNodes" :level="level + 1">
      <template #default="scoped">
        <slot :node="scoped.node" />
      </template>
    </mu-tree-nodes>
  </template>
</template>

<script setup>
  import { computed, toRaw, inject } from 'vue'

  const props = defineProps({
    node: Object,
    level: Number,
    key1: null
  })

  const tree = inject('tree')

  const {
    buttons,
    nodeIcons,
    expandIcons,
    nodeProps,
    autoExpandLevel,
    checkbox,
    checkedNodesKeys,
    activeNode
  } = tree

  const data = computed(() => Object.fromEntries(
    Object
      .entries(nodeProps.value)
      .map(([key, prop]) => [key, props.node[prop]])
  ))

  const isLeaf = computed(() =>
    !data.value.childNodes?.length &&
    (
      !nodeProps.value.isLeaf ||
      data.value.isLeaf
    )
  )

  const checked = computed({
    get () {
      return checkedNodesKeys.value
        ? checkedNodesKeys.value.has(data.value.key)
        : !!data.value.checked
    },
    set (v) {
      tree.emit('nodeCheckChange', props.node, v)
    }
  })

  const expandIcon = computed(() =>
    (expandIcons.value !== false) &&
    (
      (
        isLeaf.value
          ? expandIcons.value.leaf
          : (
            (
              expanded.value &&
              expandIcons.value.collapse
            ) || expandIcons.value.expand
          )
      ) ||
      null
    )
  )

  const nodeIcon = computed(() =>
    (nodeIcons.value !== false) &&
    (
      data.value.icon ||
      (
        isLeaf.value
          ? nodeIcons.value.leaf
          : ((expanded.value && nodeIcons.value.folderOpen) || nodeIcons.value.folder)
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

  const expanded = computed(() =>
    (
      !isLeaf.value &&
      tree.getNodeExpanded(props.node)
    ) || null
  )

  function initExpanded () {
    const level = autoExpandLevel.value ?? -1
    const oldExpanded = tree.getNodeExpanded(props.node)
    const newExpanded = (oldExpanded ?? props.level <= level) && !isLeaf.value

    if (newExpanded !== oldExpanded) tree.setNodeExpanded(props.node, newExpanded)
  }

  function toggleExpand () {
    if (!isLeaf.value) {
      tree.setNodeExpanded(props.node, !expanded.value, true)
    }
  }

  initExpanded()
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

    & > .mu-tree-node_button {
      line-height: 0;
      width: 20px;
      text-align: center;

      &[hover] {
        display: none;
      }
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

      & > .mu-tree-node_button[hover] {
        display: inline-flex;
      }
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
  }
</style>
