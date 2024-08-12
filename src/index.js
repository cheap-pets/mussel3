import './styles/index.scss'

import { install as installTheme } from './theme'
import { install as installIcons } from './icons'
import { install as installDirectives } from './directives'
import { install as installComponents } from './components'

import { deprecated } from './utils/function'

const isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches

function install (app, options = {}) {
  const { root = 'body', theme, darkMode, icons, ...componentOptions } = options

  const context = { options: componentOptions }

  app.provide('$mussel', context)
  app.config.globalProperties.$mussel = context

  installTheme(app, {
    root,
    theme,
    darkMode: (darkMode === true) || (darkMode === 'auto' && isSysDark)
  })

  installIcons(icons)
  installDirectives(app)
  installComponents(app)
}

const registerIcons = deprecated(
  installIcons,
  'Function "registerIcons" is deprecated and will be removed in future versions, use "installIcons" instead.'
)

export * as scrollbar from 'mussel-scrollbar'
export { EventInterceptor } from './events/interceptor'
export { install, installIcons, registerIcons }
