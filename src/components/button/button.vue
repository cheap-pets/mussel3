<template>
  <button
    ref="thisEl"
    class="mu-button"
    :type="type"
    :active="active || null"
    v-bind="bindings">
    <slot>
      <mu-icon v-if="icon" :icon="icon" />{{ caption }}
    </slot>
  </button>
</template>

<script setup>
  import './button.scss'

  import { ref, inject, computed } from 'vue'
  import { kebabCase } from '@/utils/case'
  import { getComputedXColor } from '@/theme'
  import { generateAdjacentColors } from '@/utils/color'

  defineOptions({ name: 'MusselButton' })

  const props = defineProps({
    icon: String,
    caption: String,
    active: Boolean,
    primary: Boolean,
    danger: Boolean,
    accent: Boolean,
    xColor: [Boolean, String],
    small: Boolean,
    round: Boolean,
    disabled: Boolean,
    type: {
      type: String,
      default: 'button'
    },
    buttonStyle: {
      type: String,
      validator: v => ['normal', 'outline', 'text', 'link'].includes(v)
    }
  })

  const thisEl = ref()

  const GROUP_FIRST_ATTRS = ['disabled']
  const LOCAL_FIRST_ATTRS = ['primary', 'danger', 'accent', 'xColor']

  const GROUP_ONLY_ATTRS = ['small', 'round', 'buttonStyle']

  const inheritedProps = inject('groupedButtonOptions', { grouped: false })
  const isGrouped = inheritedProps.grouped !== false

  function getInheritedProp (key) {
    const value = inheritedProps[key]

    return key === 'buttonStyle' && value && value !== 'outline'
      ? 'normal'
      : value
  }

  const bindings = computed(() => {
    if (!thisEl.value) return

    const values = {}

    function assignValue (key, value) {
      if (value) {
        values[kebabCase(key)] = (value === true ? '' : value)
        return true
      }
    }

    GROUP_FIRST_ATTRS.forEach(key =>
      assignValue(key, inheritedProps[key]) ||
      assignValue(key, props[key])
    )

    GROUP_ONLY_ATTRS.forEach(key => isGrouped
      ? assignValue(key, getInheritedProp(key))
      : assignValue(key, props[key])
    )

    if (!LOCAL_FIRST_ATTRS.find(key => assignValue(key, props[key]))) {
      LOCAL_FIRST_ATTRS.find(key => assignValue(key, inheritedProps[key]))
    }

    if (values['x-color']) {
      const xColors = generateAdjacentColors(
        getComputedXColor(values['x-color'], thisEl.value)
      )

      if (xColors) {
        values.style = {
          '--mu-x-color': xColors.color,
          '--mu-x-color-dark': xColors.dark,
          '--mu-x-color-light': xColors.light
        }

        values['x-color'] = ''
      }
    }

    return values
  })
</script>
