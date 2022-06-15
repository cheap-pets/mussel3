import { generatePalettes } from '../utils/color'

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
  primaryColor: '$blue',
  secondaryColor: '$yellow',
  successColor: '$green',
  dangerColor: '$red'
}

const colors = {
  white: '#ffffff',
  black: '#000000',
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

Object.keys(palettes).forEach(key => {
  const p = palettes[key]

  for (let i = 0; i < p.length; i++) {
    colors[key + '_' + i] = p[i]
  }
})

function setColorVariables (values, colorKey) {
  if (SPECIAL_COLORS.includes(colorKey)) {
    const p = generatePalettes(values[colorKey])

    if (!p) return

    const lightKey = colorKey.replace('Color', 'ColorLight')
    const darkKey = colorKey.replace('Color', 'ColorDark')
    const tinyKey = colorKey.replace('Color', 'ColorTiny')

    if (!values[lightKey]) values[lightKey] = p[4]
    if (!values[darkKey]) values[darkKey] = p[6]
    if (!values[tinyKey]) values[tinyKey] = p[2]
  } else if (BASE_COLORS.includes(colorKey)) {
    const p = generatePalettes(BASE_COLORS[colorKey])

    if (!p) return

    for (let i = 0; i < p.length; i++) {
      const key = colorKey + '_' + i

      if (!values[key]) values[key] = p[i]
    }
  }
}

function generateColorValues (key, value, values) {
  const p = generatePalettes(value)

  if (!p) return

  for (let i = 0; i < p.length; i++) {
    const k = key + '_' + i

    if (!values[k]) values[k] = p[i]
  }
}

export {
  GENERABLE_COLORS,
  colors,
  generateColorValues
}
