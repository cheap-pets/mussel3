import common from './common.js'
import components from './components.js'

import { updateVariableValues } from './update-variable-values.js'
import { colors, GENERABLE_COLORS, complementColors } from './colors.js'

const variables = {
  ...colors,
  ...common,
  ...components
}

updateVariableValues(variables)

Object.keys(GENERABLE_COLORS).forEach(key => {
  complementColors(variables, key)
})

export default variables
