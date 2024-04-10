import { SYMBOL } from './constants'

export { attach } from './attach'

export function detach (el) {
  el[SYMBOL]?.remove()

  delete el[SYMBOL]
}
