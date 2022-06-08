<template>
  <span
    class="mu-icon"
    :class="clsContent"
    :icon="icon"
    v-html="svgContent" />
</template>

<script>
  import { ref, watch } from 'vue'

  import { icons } from './icons'

  export default {
    name: 'MusselIcon',
    props: {
      icon: String
    },
    setup (props) {
      const svgContent = ref(null)
      const clsContent = ref(null)

      const setContent = () => {
        const icon = props.icon ? Object(icons[props.icon]) : {}

        svgContent.value = icon.type === 'svg' ? icon.content : undefined
        clsContent.value = icon.type === 'class' ? icon.content : undefined
      }

      watch(() => props.icon, setContent, { immediate: true })

      return {
        svgContent,
        clsContent
      }
    },
    computed: {
      svg () {
        return icons[this.icon]
      }
    }
  }
</script>
