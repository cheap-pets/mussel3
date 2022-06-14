import { createApp } from 'vue'

export function renderComponent (options) {
  let app = createApp(options.component, options.props)

  Object.assign(app._context, options.appContext)

  const container = options.container || document.body
  let el = options.el || document.createElement('div')

  if (!options.el) container.appendChild(el)

  app.mount(el)

  return () => {
    app?.unmount()
    app = undefined

    if (!options.el) container.removeChild(el)

    el = undefined
  }
}
