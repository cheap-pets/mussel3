import { paramCase } from './utils/case.js'
import { isHtmlElement, isString } from './utils/type.js'

import {
  generatePalette,
  generateAccentPalette,
  generateNeutralPalette
} from './utils/palette.js'

export function extendColors (colors) {
  colors = { ...colors }

  function appendColors (palette, prefix) {
    colors[prefix] = palette[5]
    palette.forEach((color, i) => (colors[`${prefix}${i}`] ||= color))
  }

  const primaryColor = colors.primaryColor

  if (primaryColor) {
    appendColors(generatePalette(primaryColor), 'primaryColor')

    if (!colors.gray) {
      appendColors(generateNeutralPalette(primaryColor), 'gray')
    }

    if (!colors.accentColor) {
      appendColors(generateAccentPalette(primaryColor), 'accentColor')
    }
  }

  ;['gray', 'accentColor', 'successColor', 'warningColor', 'dangerColor'].forEach(key => (
    colors[key] &&
    appendColors(generatePalette(colors[key]), key)
  ))

  return colors
}

export const colors = extendColors({
  red: '#f03e3e',
  pink: '#d6336c',
  grape: '#ae3ec9',
  violet: '#7048e8',
  indigo: '#4263eb',
  blue: '#1c7ed6',
  cyan: '#1098ad',
  teal: '#0ca678',
  green: '#37b24d',
  lime: '#74b816',
  yellow: '#f59f00',
  orange: '#f76707',
  primaryColor: '#1c7ed6',
  successColor: '#37b24d',
  warningColor: '#f76707',
  dangerColor: '#f03e3e'
})

export function install (app, { theme, darkMode }) {
  const isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const mount = app.mount

  app.mount = container => {
    const el =
      (isHtmlElement(container) && container) ||
      (isString(container) && document.querySelector(container)) ||
      document.documentElement

    el.classList.add('mu-root')

    if ((darkMode === true) || (darkMode === 'auto' && isSysDark)) {
      el.classList.add('mu-dark')
    }

    if (theme) {
      Object
        .entries(extendColors(theme))
        .forEach(([key, value]) => {
          el.style.setProperty('--mu-' + paramCase(key), value)
        })
    }

    mount.call(app, container)
  }
}
