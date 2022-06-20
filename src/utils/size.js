export function getSizeValue (s) {
  const pattern = /^(auto|((?<value>[0-9]*(\.[0-9]+)?)(?<unit>px|%)?))$/i
  const result = pattern.exec(s)

  if (result) {
    const { value = 'auto', unit } = result.groups

    return Number(value)
      ? (
          unit
            ? `${value}${unit}`
            : (value <= 1 ? `${value * 100}%` : `${value}px`)
        )
      : (value === 'auto' ? 'auto' : '0')
  }
}
