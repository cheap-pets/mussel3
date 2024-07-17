import { str2rgba, rgba2str } from '@/utils/color.js'
import { generatePalette, generateNeutralPalette } from '@/utils/palette.js'

const primaryColor = '#1c7ed6'
const secondaryColor = '#f59f00'
const successColor = '#37b24d'
const warningColor = '#f76707'
const dangerColor = '#f03e3e'

const GENERABLE_COLORS = {
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
  primaryColor,
  secondaryColor,
  successColor,
  warningColor,
  dangerColor
}

const colors = {
  white: '#ffffff',
  black: '#000000',
  gray: '#868e96',
  grayDark: '#495057',
  grayLight: '#adb5bd',
  grayShadow: 'rgba(134, 142, 150, .1)',
  ...GENERABLE_COLORS
}

generateNeutralPalette(primaryColor)
  .forEach((color, i) => {
    colors[`gray_${i}`] = color
  })

function complementColors (values, key) {
  const color = values[key]
  const palette = generatePalette(color)

  if (!palette) return

  for (let i = 0; i < palette.length; i++) {
    const k = key + '_' + i

    if (!values[k]) values[k] = palette[i]
  }

  const darkKey = `${key}Dark`
  const lightKey = `${key}Light`
  const shadowKey = `${key}Shadow`

  const { r, g, b } = str2rgba(color)

  if (!values[darkKey]) values[darkKey] = palette[6]
  if (!values[lightKey]) values[lightKey] = palette[4]
  if (!values[shadowKey]) values[shadowKey] = rgba2str({ r, g, b, a: 0.15 })
}

export {
  colors,
  GENERABLE_COLORS,
  complementColors
}
