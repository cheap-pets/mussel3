import { hex2rgb, rgb2hsv, hsv2hex } from './color'
import { isString } from './type'

const HUE_STEP = 2
const SATURATION_STEP_1 = 16
const SATURATION_STEP_2 = 5
const BRIGHTNESS_STEP_1 = 5
const BRIGHTNESS_STEP_2 = 15

const LIGHT_COLOR_COUNT = 5
const DARK_COLOR_COUNT = 4

function calcHue (hsv, i, isLight) {
  let h = hsv.h

  h = h >= 60 && h <= 240
    ? (isLight ? h - HUE_STEP * i : h + HUE_STEP * i)
    : (isLight ? h + HUE_STEP * i : h - HUE_STEP * i)

  return (h + 360) % 360
}

function calcSaturation (hsv, i, isLight) {
  const { h, s } = hsv

  return h === 0 && s === 0
    ? s
    : Math.min(
      Math.max(
        isLight
          ? (s - SATURATION_STEP_1 * i)
          : (
              i === DARK_COLOR_COUNT
                ? s + SATURATION_STEP_1
                : s + SATURATION_STEP_2 * i
            ),
        6
      ),
      i === isLight && LIGHT_COLOR_COUNT ? 10 : 100
    )
}

function calcValue (hsv, i, isLight) {
  return Math.min(
    isLight
      ? hsv.v + BRIGHTNESS_STEP_1 * i
      : hsv.v - BRIGHTNESS_STEP_2 * i,
    100
  )
}

export function generatePalette (baseColor) {
  const rgb = isString(baseColor) && hex2rgb(baseColor)

  if (!rgb) return

  const hsv = rgb2hsv(rgb.r, rgb.g, rgb.b)
  const palette = []

  for (let i = LIGHT_COLOR_COUNT; i > 0; i--) {
    const h = calcHue(hsv, i, true)
    const s = calcSaturation(hsv, i, true)
    const v = calcValue(hsv, i, true)

    palette.push(hsv2hex(h, s, v))
  }

  palette.push(baseColor)

  for (let i = 1; i <= DARK_COLOR_COUNT; i++) {
    const h = calcHue(hsv, i)
    const s = calcSaturation(hsv, i)
    const v = calcValue(hsv, i)

    palette.push(hsv2hex(h, s, v))
  }

  return palette
}

export function generateNeutralPalette (baseColor) {
  const rgb = isString(baseColor) && hex2rgb(baseColor)

  if (!rgb) return

  const hsv = rgb2hsv(rgb.r, rgb.g, rgb.b)

  return Array.from({ length: 9 }, (_, i) => {
    const s = Math.max(0, hsv.s * 0.3 * (1 - i / (9 - 1)))
    const v = 10 + (80 * i / (9 - 1))

    return hsv2hex(hsv.h, s, v)
  })
}
