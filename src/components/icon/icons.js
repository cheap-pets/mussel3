import x from '~icons/x.svg'
import check from '~icons/check.svg'
import point from '~icons/point.svg'
import circle from '~icons/circle.svg'
import circleX from '~icons/circle-x.svg'
import circleCheck from '~icons/circle-check.svg'
import circleAlert from '~icons/alert-circle.svg'
import triangleAlert from '~icons/alert-triangle.svg'
import chevronDown from '~icons/chevron-down.svg' // './svg/dropdown.svg'

const icons = {}

function isSvg (data) {
  return /<svg(?=[\s>])('[^']*'|"[^"]*"|[^'">])*>[\s\S]*?<\/svg>/i.test(data)
}

function registerIcons (data, options = {}) {
  Object.keys(data).forEach(key => {
    const content = data[key]

    icons[key] = {
      type: options.type || isSvg(content) ? 'svg' : 'class',
      content,
      ...options
    }
  })
}

registerIcons(
  {
    x,
    check,
    point,
    circle,
    circleX,
    circleCheck,
    circleAlert,
    triangleAlert,
    dropdown: chevronDown
  },
  { type: 'svg' }
)

export {
  icons,
  isSvg,
  registerIcons
}
