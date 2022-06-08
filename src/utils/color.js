import { isString } from '../utils/type'

const RGB_MAX = 255
const HUE_MAX = 360
const SV_MAX = 100

const HUE_STEP = 2
const SATURATION_STEP_1 = 16
const SATURATION_STEP_2 = 5
const BRIGHTNESS_STEP_1 = 5
const BRIGHTNESS_STEP_2 = 15
const LIGHT_COLOR_COUNT = 5
const DARK_COLOR_COUNT = 4

function hex2rgb (hex) {
  const result =
    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) ||
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex)

  return result
    ? {
        r: parseInt((result[1] + result[1]).substr(0, 2), 16),
        g: parseInt((result[2] + result[2]).substr(0, 2), 16),
        b: parseInt((result[3] + result[3]).substr(0, 2), 16)
      }
    : null
}

function rgb2hex (r, g, b) {
  r = Math.round(r).toString(16)
  g = Math.round(g).toString(16)
  b = Math.round(b).toString(16)

  r = r.length === 1 ? '0' + r : r
  g = g.length === 1 ? '0' + g : g
  b = b.length === 1 ? '0' + b : b

  return '#' + r + g + b
}

function rgb2hsv (r, g, b) {
  // convert [0,255] => [0,1]
  r = (r === RGB_MAX) ? 1 : (r % RGB_MAX / parseFloat(RGB_MAX))
  g = (g === RGB_MAX) ? 1 : (g % RGB_MAX / parseFloat(RGB_MAX))
  b = (b === RGB_MAX) ? 1 : (b % RGB_MAX / parseFloat(RGB_MAX))

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min

  const v = max
  const s = max === 0 ? 0 : d / max

  const h = max === min
    ? 0
    : (
        max === r
          ? (g - b) / d + (g < b ? 6 : 0)
          : (
              max === g
                ? (b - r) / d + 2
                : (r - g) / d + 4
            )
      ) / 6

  return {
    h: Math.round(h * HUE_MAX),
    s: Math.round(s * SV_MAX),
    v: Math.round(v * SV_MAX)
  }
}

function hsv2rgb (h, s, v) {
  h = (h % 360 + 360) % 360 // normalize angle
  h = (h === HUE_MAX) ? 1 : (h % HUE_MAX / parseFloat(HUE_MAX) * 6)
  s = (s === SV_MAX) ? 1 : (s % SV_MAX / parseFloat(SV_MAX))
  v = (v === SV_MAX) ? 1 : (v % SV_MAX / parseFloat(SV_MAX))

  const i = Math.floor(h)
  const f = h - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  const mod = i % 6
  const r = [v, q, p, p, t, v][mod]
  const g = [t, v, v, q, p, p][mod]
  const b = [p, p, t, v, v, q][mod]

  return {
    r: Math.floor(r * RGB_MAX),
    g: Math.floor(g * RGB_MAX),
    b: Math.floor(b * RGB_MAX)
  }
}

function hsv2hex (h, s, v) {
  const { r, g, b } = hsv2rgb(h, s, v)

  return rgb2hex(r, g, b)
}

function calcHue (hsv, i, isLightColor) {
  const h = Math.round(hsv.h)
  const hue = (h >= 60 && h <= 240)
    ? (isLightColor ? h - HUE_STEP * i : h + HUE_STEP * i)
    : (isLightColor ? h + HUE_STEP * i : h - HUE_STEP * i)

  return hue < 0
    ? 360 + hue
    : (hue >= 360 ? hue - 360 : hue)
}

function calcSaturation (hsv, i, isLightColor) {
  const saturation = (hsv.h === 0 && hsv.s === 0)
    ? hsv.s
    : Math.min(
      Math.max(
        isLightColor
          ? hsv.s - SATURATION_STEP_1 * i
          : (
              i === DARK_COLOR_COUNT
                ? hsv.s + SATURATION_STEP_1
                : hsv.s + SATURATION_STEP_2 * i
            ),
        6
      ),
      i === isLightColor && LIGHT_COLOR_COUNT ? 10 : 100
    )
  return Number(saturation.toFixed(0))
}

function calcValue (hsv, i, isLightColor) {
  const value = Math.min(
    isLightColor
      ? hsv.v + BRIGHTNESS_STEP_1 * i
      : hsv.v - BRIGHTNESS_STEP_2 * i,
    100
  )
  return Number(value.toFixed(0))
}

function isDark (color) {
  const { r, g, b } = isString(color) ? toRGB(color) : color

  return r * 0.299 + g * 0.578 + b * 0.114 < 192
}

function toRGB (color) {
  const pattern = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/
  const rgb = hex2rgb(color) || pattern.exec(color)

  return Array.isArray(rgb)
    ? {
        r: rgb[1],
        g: rgb[2],
        b: rgb[3]
      }
    : rgb
}

function generatePalettes (baseColor) {
  const rgb = isString(baseColor) ? toRGB(baseColor) : baseColor

  if (!rgb) return

  const { r, g, b } = rgb
  const hsv = rgb2hsv(r, g, b)
  const palettes = []

  for (let i = LIGHT_COLOR_COUNT; i > 0; i--) {
    const h = calcHue(hsv, i, true)
    const s = calcSaturation(hsv, i, true)
    const v = calcValue(hsv, i, true)
    const hex = hsv2hex(h, s, v)

    palettes.push(hex)
  }

  palettes.push(rgb2hex(r, g, b))

  for (let i = 1; i <= DARK_COLOR_COUNT; i++) {
    const h = calcHue(hsv, i)
    const s = calcSaturation(hsv, i)
    const v = calcValue(hsv, i)
    const hex = hsv2hex(h, s, v)

    palettes.push(hex)
  }

  return palettes
}

export {
  isDark,
  generatePalettes
}
