function typeOf (value) {
  return Object
    .prototype
    .toString
    .call(value)
    .match(/\[object (.*)\]/)[1]
    .toLowerCase()
}

function isType (value, type) {
  return typeOf(value) === type
}

function isArray (value) {
  return Array.isArray(value)
}

function isBoolean (value) {
  return typeOf(value) === 'boolean'
}

function isClass (value) {
  return (
    (typeOf(value) === 'function') &&
    !Reflect.ownKeys(value).some(el => el === 'arguments' || el === 'caller')
  )
}

function isDate (value) {
  return typeOf(value) === 'date'
}

function isFunction (value) {
  return [
    // 'proxy'
    'function',
    'asyncfunction',
    'generatorfunction'
  ].includes(typeOf(value))
}

function isObject (value) {
  return typeOf(value) === 'object'
}

function isString (value) {
  return typeOf(value) === 'string'
}

function isIterable (value) {
  return Symbol.iterator in Object(value)
}

function isEmpty (value, options = {}) {
  const { skipString, skipBoolean } = options

  const t = typeOf(value)

  return (
    (!skipString || t !== 'string') &&
    (
      (value == null) ||
      (!skipBoolean && t === 'boolean') ||
      (t === 'object' && Object.keys(value).length === 0) ||
      (isIterable(value) && Array.from(value).length === 0)
    )
  )
}

function isHtmlElement (value) {
  return value instanceof HTMLElement
}

export {
  typeOf,
  isType,
  isArray,
  isBoolean,
  isClass,
  isFunction,
  isDate,
  isObject,
  isString,
  isIterable,
  isEmpty,
  isHtmlElement
}
