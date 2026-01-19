import { paramCase } from '../utils/case'
// import { isHtmlElement, isString } from '../utils/type'
import { GENERABLE_COLORS, complementColors } from './colors'

import updateVariableValues from './update-variable-values'

/*
import commonVariables from './common'
import lightTheme from './theme-light'
import darkTheme from './theme-dark'
*/

function setTheme (options = {}) {
  const root = options.root || document.documentElement
  const values = { ...options.theme }

  updateVariableValues(values)

  if (options.autoComplementColors !== false) {
    Object.keys(values).forEach(key => {
      if (GENERABLE_COLORS[key]) {
        complementColors(values, key)
      }
    })
  }

  Object.keys(values).forEach(key => {
    root.style.setProperty('--mu-' + paramCase(key), values[key])
  })
}

function installTheme (options) {
  const { darkMode, autoComplementColors, theme, root = document.documentElement } = options

  root.classList.add('mu-root')

  if (
    (darkMode === true) ||
    (darkMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) root.setAttribute('dark-mode', '')

  if (theme) {
    setTheme({ root, autoComplementColors, theme })
  }
}

export {
  installTheme,
  setTheme
}
