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
    <slot name="buttons" :node="node">
      <mu-icon
        v-for="btn in buttons"
        :key="btn"
        v-bind="btn"
        class="mu-icon-button mu-tree-node_button"
        @click="tree.emit('nodeButtonClick', node, button)" />
    </slot>
  </a>
  <template v-if="expanded">
    <mu-tree-nodes :nodes="data.childNodes" :level="level + 1">
      <template #default="scoped">
        <slot :node="scoped.node" />
      </template>
      <template #buttons="scoped">
        <slot name="buttons" :node="scoped.node" />
      </template>
    </mu-tree-nodes>
  </template>
</template>

<script setup>
  import { computed, toRaw, inject } from 'vue'

  const props = defineProps(['node', 'level'])
  const tree = inject('tree')

  const {
    buttons,
    nodeIcons,
    expandIcons,
    nodeProps,
    expandLevel,
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

  const expanded = computed(() => {
    const level = expandLevel.value ?? -1
    const value = tree.getNodeExpanded(props.node)

    return value == null && level != null && props.level <= level
      ? tree.setNodeExpanded(props.node, !isLeaf.value)
      : value
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
              expandIcons.value.expanded
            ) || expandIcons.value.collapsed
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

  function toggleExpand () {
    if (!isLeaf.value) {
      tree.setNodeExpanded(props.node, !expanded.value, true)
    }
  }
</script>

<style>
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
      width: 20px;
      line-height: 0;
      text-align: center;

      &[hover] {
        display: none;
      }
    }

    & > .mu-tree-node_label {
      cursor: inherit;
      user-select: none;

      overflow: hidden;
      flex: 1 1 0;

      text-overflow: ellipsis;
      white-space: nowrap;
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
      color: var(--mu-text-color-weak);
      background: inherit;
    }

    &[expanded] {
      & > .mu-tree-node_expand-icon {
        transform: rotate(0);
      }
    }
  }
</style>
