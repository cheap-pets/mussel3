import { camelCase, kebabCase } from './utils/case.js'
import { isHtmlElement, isString } from './utils/type.js'

import {
  str2rgba,
  generatePalette,
  generateAccentPalette,
  generateNeutralPalette
} from './utils/color.js'

const COLORS = {
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
  gray: null
}

const SPECIAL_COLORS = {
  primary: '#1c7ed6',
  success: '#37b24d',
  warning: '#f76707',
  danger: '#f03e3e',
  accent: null
}

function extendColors (colors) {
  const {
    primary,
    accent,
    gray,
    ...result
  } = colors

  function appendColors (name, palette) {
    const { r, g, b } = str2rgba(palette[5])

    result[name] ||= palette[5]
    // result[`${name}Rgb`] ||= `${r},${g},${b}`

    if (name !== 'gray') {
      result[camelCase(`shadow-${name}`)] ||= `rgba(${r}, ${g}, ${b}, .15)`
    }

    palette.forEach((color, i) => (result[`${name}${i}`] ||= color))
  }

  ;['primary', 'success', 'warning', 'danger'].forEach(key =>
    colors[key] &&
    appendColors(key, generatePalette(colors[key]))
  )

  if (gray || primary) {
    appendColors('gray', gray ? generatePalette(gray) : generateNeutralPalette(primary))
  }

  if (accent || primary) {
    appendColors('accent', accent ? generatePalette(accent) : generateAccentPalette(primary))
  }

  return result
}

export function getComputedXColor (xColor, el) {
  if (!el) return

  xColor =
    (xColor in COLORS && `var(--mu-${xColor})`) ||
    (xColor in SPECIAL_COLORS && `var(--mu-${xColor}-color)`) ||
    xColor

  const match = xColor.match(/var\((.+?)\)/)
  const prop = match && match[1]

  return prop
    ? window.getComputedStyle(el).getPropertyValue(prop)
    : xColor
}

export function install (app, { theme, darkMode }) {
  const mount = app.mount

  app.mount = container => {
    const el =
      (isHtmlElement(container) && container) ||
      (isString(container) && document.querySelector(container)) ||
      document.documentElement

    el.classList.add('mu-root')

    if (darkMode) el.classList.add('mu-dark')

    if (theme) {
      Object
        .entries(extendColors(theme))
        .forEach(([key, value]) =>
          value &&
          el.style.setProperty(
            '--mu-' + kebabCase(
              key.replace(
                /^(gray|primary|success|warning|danger|accent)(\d*)$/,
                (match, name, num) => (name === 'gray' ? `${name}` : `${name}-color`) + (num ? `-${num}` : '')
              )
            ),
            value
          )
        )
    }

    mount.call(app, container)
  }
}

export function generatePreCssVariables (incomingColors) {
  return extendColors({
    ...COLORS,
    ...SPECIAL_COLORS,
    ...incomingColors
  })
}
