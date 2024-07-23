import { str2rgba } from './utils/color.js'
import { kebabCase, camelCase } from './utils/case.js'
import { isHtmlElement, isString } from './utils/type.js'

import {
  generatePalette,
  generateAccentPalette,
  generateNeutralPalette
} from './utils/palette.js'

const DEFAULT_COLORS = {
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
}

export function extendColorVariables (colors) {
  const {
    gray,
    primaryColor: primary,
    accentColor: accent,
    ...result
  } = colors

  function appendColors (type, palette) {
    const colorName = type === 'gray'
      ? 'gray'
      : `${type}Color`

    const { r, g, b } = str2rgba(palette[5])

    result[colorName] ||= palette[5]
    // result[`${type}Rgb`] ||= `${r},${g},${b}`

    if (type !== 'gray') {
      result[camelCase(`shadow-${type}`)] ||= `rgba(${r}, ${g}, ${b}, .15)`
    }

    palette.forEach((color, i) => (result[`${colorName}${i}`] ||= color))
  }

  ;['primary', 'success', 'warning', 'danger'].forEach(type => {
    const color = colors[`${type}Color`]

    if (color) appendColors(type, generatePalette(color))
  })

  if (gray || primary) {
    appendColors('gray', gray ? generatePalette(gray) : generateNeutralPalette(primary))
  }

  if (accent || primary) {
    appendColors('accent', accent ? generatePalette(accent) : generateAccentPalette(primary))
  }

  return result
}

export function getColorVariables (customColors) {
  return extendColorVariables({
    ...DEFAULT_COLORS,
    ...customColors
  })
}

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
        .entries(extendColorVariables(theme))
        .forEach(([key, value]) => (
          value ??
          el.style.setProperty('--mu-' + kebabCase(key), value)
        ))
    }

    mount.call(app, container)
  }
}
