import './styles/index.scss'

import { installTheme } from './schemes'
import { installComponents, components } from './components'
import { registerIcons } from './components/icon/icons'
import { installDirectives } from './directives'

import * as scrollbar from './components/scrollbar'

function install (app, options = {}) {
  const {
    theme,
    darkMode,
    autoComplementColors,
    icons = {},
    ...globalOptions
  } = options

  const $mussel = app.config.globalProperties.$mussel = { globalOptions }

  app.provide('$mussel', $mussel)

  registerIcons(icons)
  installTheme(app, { theme, darkMode, autoComplementColors })
  installDirectives(app)
  installComponents(app, globalOptions)
}

export { icons, registerIcons } from './components/icon/icons'
export { EventInterceptor } from './events'
export { install, components, scrollbar }
