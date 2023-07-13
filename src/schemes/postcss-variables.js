import common from './common'
import components from './components'
import updateVariableValues from './update-variable-values'
// import lightTheme from './theme-light'
// import darkTheme from './theme-dark'

import { colors, GENERABLE_COLORS, complementColors } from './colors'

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
