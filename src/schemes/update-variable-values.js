export default function updateValues (values) {
  const check = {}

  function updateValue (key) {
    const value = values[key]

    if (key in check) {
      return check[key]
    } else if (value.indexOf?.('$') === 0) {
      check[key] = null
      check[key] = values[key] = updateValue(value.substr(1))
    } else {
      return value
    }
  }

  Object.keys(values).forEach(updateValue)
}
