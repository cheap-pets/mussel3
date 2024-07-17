export function updateVariableValues (values) {
  const cache = {}

  function updateValue (key) {
    const value = values[key]

    if (key in cache) {
      return cache[key]
    } else if (value.indexOf?.('$') === 0) {
      cache[key] = null
      cache[key] = values[key] = updateValue(value.substr(1))
    } else {
      return value
    }
  }

  Object.keys(values).forEach(updateValue)
}
