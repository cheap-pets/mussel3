import '@/styles'

import { installTheme, setTheme } from './theme'
import { installComponents } from './components'
import { icons, registerIcons } from './components/icon/icons'

// import { installDirectives } from '@/directives'

// export * from './events'

function install (app, options = {}) {
  if (options.theme !== false) installTheme(app, options.theme)

  installComponents(app, options)

  // installDirectives(app)
}

export {
  install,
  setTheme,
  icons,
  registerIcons
}
