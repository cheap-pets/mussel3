import EventInterceptor from './interceptor'
import dispatchCustomEvent from './custom-event'

const countSymbol = Symbol.for('mussel.event.resize.count')
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => dispatchCustomEvent(entry.target, 'sizechange'))
})

const interceptor = {
  add () {
    const count = this[countSymbol] || 0

    if (!count) observer.observe(this)

    this[countSymbol] = count + 1
  },
  remove () {
    const count = this[countSymbol] || 0

    if (count <= 1) {
      this[countSymbol] = 0
      observer.unobserve(this)
    } else {
      this[countSymbol] -= 1
    }
  }
}

EventInterceptor.register('sizechange', interceptor)
