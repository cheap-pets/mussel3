import { throttle } from 'lodash-es'

function onDomChange () {
  this.updatePosition()
}

export default throttle(
  onDomChange,
  50,
  { leading: false, trailing: true }
)
