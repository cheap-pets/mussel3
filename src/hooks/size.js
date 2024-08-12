import { computed } from 'vue'
import { resolveSize } from '@/utils/size'

export const sizeProps = {
  width: [String, Number],
  height: [String, Number]
}

export function useSize (props) {
  const sizeStyle = computed(() => ({
    width: resolveSize(props.width),
    height: resolveSize(props.height)
  }))

  return {
    sizeStyle
  }
}
