import { paramCase } from '@/utils/case'
import { isHtmlElement, isString } from '@/utils/type'
import { complementColors, GENERABLE_COLORS } from './colors'
import { updateVariableValues } from './update-variable-values'

const isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches

function setCustomTheme (el, values) {
  updateVariableValues(values)

  Object.keys(values).forEach(key =>
    GENERABLE_COLORS[key] && complementColors(values, key)
  )

  Object.keys(values).forEach(key => {
    el.style.setProperty('--mu-' + paramCase(key), values[key])
  })
}

export function install (app, { darkMode, theme }) {
  const mount = app.mount

  app.mount = container => {
    const el = container =
      (isHtmlElement(container) && container) ||
      (isString(container) && document.querySelector(container)) ||
      document.documentElement

    el.classList.add('mu-root')

    if ((darkMode === true) || (darkMode === 'auto' && isSysDark)) {
      el.setAttribute('dark-mode', '')
    }

    if (theme) {
      setCustomTheme(el, { ...theme })
    }

    mount.call(app, container)
  }
}
