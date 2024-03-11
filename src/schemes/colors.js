import { generatePalettes, toRGBA } from '../utils/color.js'

const SPECIAL_COLORS = {
  primaryColor: '$blue',
  secondaryColor: '$yellow',
  successColor: '$green',
  warningColor: '$orange',
  dangerColor: '$red'
}

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
  ...SPECIAL_COLORS
}

const colors = {
  white: '#ffffff',
  black: '#000000',
  gray: '#868e96',
  grayDark: '#495057',
  grayLight: '#adb5bd',
  grayShadow: 'rgba(134, 142, 150, .1)',
  gray_0: '#f8f9fa',
  gray_1: '#f1f3f5',
  gray_2: '#e9ecef',
  gray_3: '#dee2e6',
  gray_4: '#ced4da',
  gray_5: '#adb5bd',
  gray_6: '#868e96',
  gray_7: '#495057',
  gray_8: '#343a40',
  gray_9: '#212529',
  ...GENERABLE_COLORS
}

function complementColors (values, key) {
  const color = values[key]
  const palettes = generatePalettes(color)

  if (!palettes) return

  for (let i = 0; i < palettes.length; i++) {
    const k = key + '_' + i

    if (!values[k]) values[k] = palettes[i]
  }

  const darkKey = `${key}Dark`
  const lightKey = `${key}Light`
  const shadowKey = `${key}Shadow`

  if (!values[darkKey]) values[darkKey] = palettes[6]
  if (!values[lightKey]) values[lightKey] = palettes[4]
  if (!values[shadowKey]) values[shadowKey] = toRGBA(color, 0.15)
}

export {
  colors,
  GENERABLE_COLORS,
  complementColors
}
