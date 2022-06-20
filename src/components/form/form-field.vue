<template>
  <div
    class="mu-form-field mu-box"
    :style="{ width: boxWidth, height: boxHeight }">
    <label
      v-if="label"
      class="mu-text-ellipsis"
      :text-align="form.labelAlign || labelAlign"
      :style="{ width: labelElementWidth }">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script>
  import MusselBox from '../box/box.vue'

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
      labelAlign: {
        type: String,
        validator (value) {
          return ['right', 'left', 'center'].indexOf(value) !== -1
        }
      }
    },
    computed: {
      sizeValue () {
        const layout = this.parentLayout || 'flow'
        return this.size ||
          this.$el?.getAttribute('size') ||
          (
            layout === 'flow'
              ? '100%'
              : undefined
          )
      },
      labelStyle () {
        const w = this.labelWidth || this.form?.labelWidth
        return {
          width: w,
          minWidth: w,
          textAlign: this.labelAlign || this.form?.labelAlign || 'right'
        }
      }
    }
  }
</script>
