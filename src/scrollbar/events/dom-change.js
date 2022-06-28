import { throttle } from 'throttle-debounce'

function onDomChange () {
  this.updatePosition()
}

export default throttle(
  50,
  onDomChange,
  { noLeading: true, noTrailing: false }
)
