import common from './common.js'
import components from './components.js'
import updateVariableValues from './update-variable-values.js'
// import lightTheme from './theme-light'
// import darkTheme from './theme-dark'

import { colors, GENERABLE_COLORS, complementColors } from './colors.js'

const variables = {
  ...colors,
  ...common,
  ...components
  // ...lightTheme
}

updateVariableValues(variables)

Object.keys(GENERABLE_COLORS).forEach(key => {
  complementColors(variables, key)
})

export default variables
