<template>
  <mu-tree-node
    v-for="el in nodes"
    :key="el[tree.props.key]"
    :node="el"
    :level="level">
    <template #default="scoped">
      <slot :node="scoped.node" />
    </template>
  </mu-tree-node>
</template>

<script setup>
  import { inject } from 'vue'

  defineProps({
    nodes: Array,
    level: Number
  })

  const tree = inject('tree')
</script>
