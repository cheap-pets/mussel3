import { isString, isDate } from '@/utils/type'

export function formatDate (date, format = 'yyyy-MM-dd') {
  let result = /(y+)/i.test(format)
    ? format.replace(RegExp.$1, ('' + date.getFullYear()).substr(4 - RegExp.$1.length))
    : format

  const patterns = {
    '(M+)': date.getMonth() + 1,
    '(d+)': date.getDate(),
    '(h+)': date.getHours(),
    '(m+)': date.getMinutes(),
    '(s+)': date.getSeconds(),
    '(S+)': date.getMilliseconds()
  }

  Object
    .keys(patterns)
    .forEach(p => {
      const re = new RegExp(p, ['(d+)', '(h+)'].includes(p) ? 'i' : undefined)

      if (re.test(result)) {
        const len = RegExp.$1.length
        const value = '' + patterns[p]
        const start = value.length

        result = result.replace(
          RegExp.$1,
          len === 3
            ? ('000' + value).substr(start)
            : (
                len === 2
                  ? ('00' + value).substr(start)
                  : value
              )
        )
      }
    })

  return result
}

export function resolveDate (value) {
  value = isString(value)
    ? new Date(value)
    : value

  return isDate(value)
    ? value
    : null
}

export function parseDateObject (value) {
  const date = resolveDate(value)

  return date && {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate()
  }
}

function isLeapYear (year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

export function getMonthDaysCount (year, month) {
  return isLeapYear(year) && month === 1
    ? 29
    : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
}

export function getMonthFirstDay (year, month) {
  return (new Date(year, month, 1)).getDay()
}

export function calculateMonth (year, month, offset) {
  month += offset

  if (month < 0) {
    month = 11
    year--
  } else if (month > 11) {
    month = 0
    year++
  }

  return { year, month }
}

export function filterDatesByMonth (dates, year, month) {
  return dates.reduce((t, el) => {
    el = parseDateObject(el)

    if (el && el.year === year && el.month === month) {
      t.push(el)
    }

    return t
  }, [])
}

export function isSameDay (a, b) {
  a = isDate(a) ? parseDateObject(a) : Object(a)
  b = isDate(b) ? parseDateObject(b) : Object(b)

  return a.year === b.year && a.month === b.month && a.date === b.date
}
