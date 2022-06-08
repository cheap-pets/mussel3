import { generatePalettes } from '../utils/color'

const BASE_COLORS = {
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
  orange: '#f76707'
}

const SPECIAL_COLORS = [
  'primaryColor',
  'secondaryColor',
  'dangerColor'
]

const palettes = {
  white: '#ffffff',
  black: '#000000',
  gray: [
    '#f8f9fa',
    '#f1f3f5',
    '#e9ecef',
    '#dee2e6',
    '#ced4da',
    '#adb5bd',
    '#868e96',
    '#495057',
    '#343a40',
    '#212529'
  ]
}

Object.keys(BASE_COLORS).forEach(key => {
  palettes[key] = generatePalettes(BASE_COLORS[key])
})

const colors = {}

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

export {
  BASE_COLORS,
  colors,
  setColorVariables
}
