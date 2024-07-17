<template>
  <div class="mu-form-field mu-box" :style="boxStyle">
    <label
      v-if="label"
      class="mu-text-ellipsis"
      :text-align="labelAlign || form.labelAlign || null"
      :style="{ width: labelElementWidth }">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script>
  import MusselBox from '../layout/box/box.vue'

  import { resolveSize } from '@/utils/size'

  export default {
    name: 'MusselFormField',
    extends: MusselBox,
    inject: {
      form: {
        default: {}
      }
    },
    props: {
      label: String,
      labelWidth: String,
      labelAlign: String
    },
    computed: {
      labelElementWidth () {
        return resolveSize(this.labelWidth || this.form.labelWidth)
      }
    }
  }
</script>
