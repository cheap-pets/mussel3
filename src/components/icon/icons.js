import x from '~icons/x.svg'
import check from '~icons/check.svg'
import point from '~icons/point.svg'
import circle from '~icons/circle.svg'
import circleX from '~icons/circle-x.svg'
import circleCheck from '~icons/circle-check.svg'
import circleAlert from '~icons/alert-circle.svg'
import triangleAlert from '~icons/alert-triangle.svg'
import dotsVert from '~icons/dots-vertical.svg'

import file from '~icons/file.svg'
import folder from '~icons/folder.svg'
import folderOpen from '~icons/folder-open.svg'

import chevronDown from '~icons/chevron-down.svg'

// dropdown svg background
// url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>")

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
    dotsVert,
    file,
    folder,
    folderOpen,
    dropdown: chevronDown
  },
  { type: 'svg' }
)

export {
  icons,
  isSvg,
  registerIcons
}
