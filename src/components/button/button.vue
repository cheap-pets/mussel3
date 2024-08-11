<template>
  <button ref="el" class="mu-button" v-bind="attrs">
    <slot>
      <mu-icon v-if="icon" :icon="icon" />
      {{ caption }}
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

  const el = ref()

  const GROUP_FIRST_ATTRS = ['disabled']
  const LOCAL_FIRST_ATTRS = ['primary', 'danger', 'accent', 'xColor']

  const GROUP_ONLY_ATTRS = ['small', 'round', 'buttonStyle']
  const LOCAL_ONLY_ATTRS = ['type', 'active']

  const inheritedProps = inject('groupedButtonOptions', { grouped: false })
  const isGrouped = inheritedProps.grouped !== false

  const attrs = computed(() => {
    if (!el.value) return

    const result = {}

    function assignValue (key, value) {
      if (value) {
        result[kebabCase(key)] = (value === true ? '' : value)
        return true
      }
    }

    GROUP_FIRST_ATTRS.forEach(key =>
      assignValue(key, inheritedProps[key]) ||
      assignValue(key, props[key])
    )

    GROUP_ONLY_ATTRS.forEach(key => isGrouped
      ? assignValue(key, inheritedProps[key])
      : assignValue(key, props[key])
    )

    if (!LOCAL_FIRST_ATTRS.find(key => assignValue(key, props[key]))) {
      LOCAL_FIRST_ATTRS.find(key => assignValue(key, inheritedProps[key]))
    }

    LOCAL_ONLY_ATTRS.forEach(key => assignValue(key, props[key]))

    if (result['x-color']) {
      const xColors = generateAdjacentColors(
        getComputedXColor(result['x-color'], el.value)
      )

      if (xColors) {
        result.style = {
          '--mu-x-color': xColors.color,
          '--mu-x-color-dark': xColors.dark,
          '--mu-x-color-light': xColors.light
        }

        result['x-color'] = ''
      }
    }

    if (isGrouped && result.active === '' && result['button-style']) {
      delete result['button-style']
    }

    return result
  })
</script>
