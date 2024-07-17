import { rgb2hsv, hsv2hex, str2rgba } from './color.js'

/*
 * This generate function are adapted from [@ant-design/colors],
 * available at [https://github.com/ant-design/ant-design-colors].
 */
export function generatePalette (color) {
  const rgb = str2rgba(color)

  if (!rgb) return

  const HUE_STEP = 2
  const SATURATION_STEP_1 = 16
  const SATURATION_STEP_2 = 5
  const BRIGHTNESS_STEP_1 = 5
  const BRIGHTNESS_STEP_2 = 15

  const LIGHT_COLOR_COUNT = 5
  const DARK_COLOR_COUNT = 4

  const { h, s, v } = rgb2hsv(rgb)

  function calcHue (idx, light) {
    const hue = h >= 60 && h <= 240
      ? (light ? h - HUE_STEP * idx : h + HUE_STEP * idx)
      : (light ? h + HUE_STEP * idx : h - HUE_STEP * idx)

    return (hue + 360) % 360
  }

  function calcSaturation (idx, light) {
    return h === 0 && s === 0
      ? s
      : Math.min(
        Math.max(
          light
            ? (s - SATURATION_STEP_1 * idx)
            : (
                idx === DARK_COLOR_COUNT
                  ? s + SATURATION_STEP_1
                  : s + SATURATION_STEP_2 * idx
              ),
          6
        ),
        idx === light && idx === LIGHT_COLOR_COUNT
          ? 10
          : 100
      )
  }

  function calcValue (idx, light) {
    return Math.min(
      light
        ? v + BRIGHTNESS_STEP_1 * idx
        : v - BRIGHTNESS_STEP_2 * idx,
      100
    )
  }

  const palette = []

  for (let i = 1; i <= 10; i++) {
    const light = i < 6
    const idx = light ? 6 - i : i - 6

    palette.push(
      idx
        ? hsv2hex({
          h: calcHue(idx, light),
          s: calcSaturation(idx, light),
          v: calcValue(idx, light)
        })
        : hsv2hex({ h, s, v })
    )
  }

  return palette
}

export function generateAccentColor (primaryColor) {
  const rgb = str2rgba(primaryColor)

  if (!rgb) return

  const hsv = rgb2hsv(rgb)

  return hsv2hex({
    h: (hsv.h + 123) % 360,
    s: Math.max(0, hsv.s - 10),
    v: Math.max(0, hsv.v - 11)
  })
}

export function generateAccentPalette (primaryColor) {
  return generatePalette(
    generateAccentColor(primaryColor)
  )
}

export function generateNeutralPalette (primaryColor, length = 10) {
  const rgb = str2rgba(primaryColor)

  if (!rgb) return

  const hsv = rgb2hsv(rgb)
  const palette = []

  for (let i = length - 1; i >= 0; i--) {
    palette.push(
      hsv2hex({
        h: hsv.h,
        s: Math.max(0, hsv.s * 0.3 * (1 - i / (length - 1))),
        v: 10 + (80 * i / (length - 1))
      })
    )
  }

  return palette
}
