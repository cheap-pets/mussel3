export function removeEventAttr (htmlString) {
  const TAG_PATTERN = /(<\s*[\w-:.]+)(\s+(?:'[^']*'|"[^"]*"|[^'">/'])*)(\/?>?)/g
  const EVENT_ATTR_PATTERN = /(on\w+)\s*=\s*('[^']*'|"[^"]*"|[^'"\s]+)/g

  return htmlString.replace(
    TAG_PATTERN,
    (tagMatch, prefix, attrs, suffix) => {
      attrs = attrs.replace(EVENT_ATTR_PATTERN, '')

      return `${prefix}${attrs}${suffix}`
    }
  )
}
