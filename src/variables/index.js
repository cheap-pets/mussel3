import { colors, setColorVariables } from './colors'

import components from './components'

import lightTheme from './theme-light'
import darkTheme from './theme-dark'

const variables = {}

function paramCase (str) {
  return str
    .replace(/(\W|_)/g, '-')
    .replace(/([A-Z])/g, s => '-' + s.toLowerCase())
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function setVariables (values = {}, options = {}) {
  if (options.autoGenerateColors !== false) {
    Object.keys(values).forEach(key => setColorVariables(values, key))
  }

  const root = options.root || document.documentElement

  Object.keys(values).forEach(key => {
    root.style.setProperty(
      '--mu-' + paramCase(key),
      variables[key] = values[key]
    )
  })
}

export {
  variables,
  setVariables
}
