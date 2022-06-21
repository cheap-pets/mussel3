import '@/styles'

import { installTheme } from './schemes'
import { installComponents } from './components'
import { icons, registerIcons } from './components/icon/icons'

// import { installDirectives } from '@/directives'

// export * from './events'

function install (app, options = {}) {
  if (options.theme !== false) installTheme(app, options)
  if (options.icons) registerIcons(options.icons)

  installComponents(app, options)

  // installDirectives(app)
}

export {
  install,
  icons,
  registerIcons
}
