import { paramCase } from '../utils/case'
import { isHtmlElement, isString } from '../utils/type'
import { colors, GENERABLE_COLORS, generateColorValues } from './colors'

import components from './components'
import lightTheme from './theme-light'
import darkTheme from './theme-dark'

function setTheme (options = {}) {
  const el = options.el || document.documentElement
  const values = { ...options.values }

  if (options.autoGenerateColors !== false) {
    Object.keys(options.values).forEach(key => {
      if (GENERABLE_COLORS[key] && !options.values[`${key}_0`]) {
        generateColorValues(key, options.values[key], values)
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

    const { darkMode, autoGenerateColors, values } = Object(options)

    const isSysDarkMode =
      window.matchMedia('(prefers-color-scheme: dark)').matches

    const useDarkTheme =
      (darkMode === true) ||
      (darkMode === 'auto' && isSysDarkMode)

    // app.config.globalProperties.$theme =
    setTheme({
      el,
      autoGenerateColors,
      values: {
        ...colors,
        ...components,
        ...(useDarkTheme ? darkTheme : lightTheme),
        ...values
      }
    })

    mount.call(app, rootContainer)
  }
}

export {
  installTheme,
  setTheme
}
