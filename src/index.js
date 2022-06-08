import '@/styles'

// import variables from '@/variables'

// import { installDirectives } from '@/directives'
import { installComponents } from '@/components'

// export * from './events'
// export * from './components'

// export { variables }
// export { setTheme } from '@/utils/theme'

export function install (app) {
  // installDirectives(app)
  installComponents(app)
}

export { icons, registerIcons } from '@/components/icon/icons'
export { setVariables } from '@/variables'
