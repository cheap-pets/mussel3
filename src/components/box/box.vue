<template>
  <div :class="boxClass" :style="boxStyle" />
</template>

<script>
  import { assignIf } from '../../utils/object'

  function getSizeStyles (props) {
    const sizePattern = /^([0-9]*|auto|([0-9]\d*(px|%)))$/
    const style = {}

    ;['width', 'height'].forEach(key => {
      const value = props[key]

      if (sizePattern.test(value)) {
        style[key] = isNaN(value)
          ? value
          : value + 'px'
      }
    })

    return style
  }

  function getGridCellStyles (attrs) {
    // const {
    //   column,
    //   'column-start':columnStart,
    //   'column-span':columnSpan,
    //   'column-end':columnEnd,
    //   row,
    //   'row-start':rowStart,
    //   'row-span':rowSpan,
    //   'row-end':rowEnd
    // } = attrs

    return {
    }
  }

  export default {
    name: 'MusselBox',
    props: {
      width: String,
      height: String
    },
    data () {
      return {
        boxClass: ['mu-box'],
        boxStyle: {}
      }
    },
    mounted () {
      const pEl = this.$el.parentElement
      const pDisplay = pEl ? window.getComputedStyle(pEl).display : null

      assignIf(
        this.boxStyle,
        getSizeStyles(this.props),
        pDisplay === 'grid' ? getGridCellStyles(this.$attrs) : null
      )
    }
  }
</script>
