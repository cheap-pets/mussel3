import './styles/index.scss'

import { install as installTheme } from './theme'
import { install as installDirectives } from './directives'
import { install as installIcons } from './components/icon/icons'
import { install as installComponents } from './components'

import { deprecated } from './utils/function'

function install (app, options = {}) {
  const {
    icons, theme, darkMode,
    ...componentOptions
  } = options

  const $mussel = { options: componentOptions }

  app.provide('$mussel', $mussel)
  app.config.globalProperties.$mussel = $mussel

  installIcons(icons)
  installDirectives(app)
  installComponents(app)
  installTheme(app, { theme, darkMode })
}

const registerIcons = deprecated(
  installIcons,
  'Function "registerIcons" is deprecated and will be removed in future versions, use "installIcons" instead.'
)

export * as scrollbar from 'mussel-scrollbar'
export { EventInterceptor } from './events/interceptor'
export { install, installIcons, registerIcons }
