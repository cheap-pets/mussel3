import './styles/index.scss'

import { installTheme } from './schemes'
import { installComponents, components } from './components'
import { icons, registerIcons } from './components/icon/icons'
import { installDirectives } from './directives'

import * as scrollbar from './components/scrollbar'

function install (app, options = {}) {
  const $mussel = app.config.globalProperties.$mussel = {}

  app.provide('$mussel', $mussel)

  if (options.theme !== false) installTheme(app, options)
  if (options.icons) registerIcons(options.icons)

  installComponents(app, options)
  installDirectives(app)
}

export { EventInterceptor } from './events'
export { install, components, icons, registerIcons, scrollbar }
