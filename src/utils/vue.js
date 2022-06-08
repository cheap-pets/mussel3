import { createApp } from 'vue'

export function renderComponent (options) {
  const { component, props, appContext } = options

  const container = options.container || document.body

  let app = createApp(component, props)

  if (appContext) {
    Object.assign(app._context, appContext)
  }

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
