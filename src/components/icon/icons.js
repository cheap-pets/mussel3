import { isString, isSvgString } from '@/utils/type'

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

import keyUp from '~icons/chevron-up.svg'
import keyDown from '~icons/chevron-down.svg'
import keyLeft from '~icons/chevron-left.svg'
import keyRight from '~icons/chevron-right.svg'

const icons = {}

function install (data = {}, options) {
  options = isString(options) ? { type: options } : { ...options }

  if (!['svg', 'class'].includes(options.type)) {
    delete options.type
  }

  Object.entries(data).forEach(([key, content]) => {
    icons[key] = {
      ...options,
      type: options.type || (isSvgString(content) ? 'svg' : 'class'),
      content
    }
  })
}

install(
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
    keyUp,
    keyDown,
    keyLeft,
    keyRight,
    dropdown: keyDown
  },
  'svg'
)

export { icons, install }
