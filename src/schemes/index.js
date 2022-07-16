import { paramCase } from '../utils/case'
import { isHtmlElement, isString } from '../utils/type'
import { GENERABLE_COLORS, complementColors } from './colors'

import updateVariableValues from './update-variable-values'

/*
import commonVariables from './common'
import lightTheme from './theme-light'
import darkTheme from './theme-dark'
*/

function setTheme (options = {}) {
  const el = options.el || document.documentElement
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
    el.style.setProperty('--mu-' + paramCase(key), values[key])
  })
}

function installTheme (app, options) {
  const mount = app.mount

  app.mount = rootContainer => {
    const el = isHtmlElement(rootContainer)
      ? rootContainer
      : (
          isString(rootContainer)
            ? document.querySelector(rootContainer)
            : null
        )

    const { darkMode, autoComplementColors, theme } = options

    if (el) {
      if (el.classList && !el.classList.contains('mu-root')) {
        const isSysDarkMode =
          window.matchMedia('(prefers-color-scheme: dark)').matches

        const useDarkTheme =
          (darkMode === true) ||
          (darkMode === 'auto' && isSysDarkMode)

        el.classList.add('mu-root')

        if (useDarkTheme) el.setAttribute('dark-mode', '')
      }

      if (theme) {
        setTheme({ el, autoComplementColors, theme })
      }
    }

    mount.call(app, rootContainer)
  }
}

export {
  installTheme
}
