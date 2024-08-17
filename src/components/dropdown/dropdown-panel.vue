<template>
  <div
    v-if="ready"
    v-show="!hidden"
    class="mu-dropdown-panel"
    :style="style"
    @click="onClick"
    @mouseover.stop="onMouseOver"
    @mouseleave.stop="onMouseLeave">
    <slot>
      <component
        :is="el === '-' || el.divider ? 'mu-list-divider' : 'mu-dropdown-item'"
        v-for="el in items"
        :key="el[itemKey] || generateUUID()"
        v-bind="el === '-' ? undefined : el" />
    </slot>
  </div>
</template>

<script setup>
  import './dropdown-panel.scss'

  import { generateUUID } from '@/utils/id'

  defineOptions({ name: 'MusselDropdownPanel' })

  const props = defineProps({
    align: String,
    style: Object,
    width: String,
    height: String,
    items: Array,
    itemKey: { type: String, default: 'id' }
  })
</script>
