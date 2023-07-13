import './styles/index.scss'

import { installTheme } from './schemes'
import { installComponents, components } from './components'
import { icons, registerIcons } from './components/icon/icons'

// import { installDirectives } from '@/directives'

function install (app, options = {}) {
  app.provide('$mussel', app.config.globalProperties.$mussel = {})

  if (options.theme !== false) installTheme(app, options)
  if (options.icons) registerIcons(options.icons)

  installComponents(app, options)

  // installDirectives(app)
}

export { EventInterceptor } from './events'
export { install, components, icons, registerIcons }
