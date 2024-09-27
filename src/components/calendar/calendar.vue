<template>
  <div class="mu-calendar">
    <div class="mu-calendar_header">
      {{ monthTitle }}
    </div>
    <table class="mu-calendar_table">
      <thead>
        <th v-for="v in daysOfWeek" :key="v">
          {{ v }}
        </th>
      </thead>
      <tbody>
        <tr v-for="(n, i) in rowCount" :key="n">
          <td v-for="(m, j) in 7" :key="m" v-bind="cells[i * 7 + j].attrs">
            {{ cells[i * 7 + j].date }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import './calendar.scss'

  import { ref, computed, watchEffect } from 'vue'
  import { formatString } from '@/utils/string'

  import {
    parseDateObject,
    getMonthFirstDay,
    getMonthDaysCount,
    calculateMonth,
    isSameDay
  } from './calendar'

  import lang from '@/langs'

  const { YEAR_AND_MONTH, MONTHS } = lang.Calendar

  const date = defineModel('date', { type: [Date, String] })
  const to = defineModel('end', { type: [Date, String] })

  defineProps({
    range: Boolean,
    min: [Date, String],
    max: [Date, String],
    daysOfWeek: { type: Array, default: () => [...lang.Calendar.DAYS_OF_WEEK_SHORT] }
  })

  const current = ref()
  const selected = computed(() => parseDateObject(date.value))

  const monthTitle = computed(() =>
    current.value &&
    formatString(YEAR_AND_MONTH, current.value.year, MONTHS[current.value.month]
    )
  )

  const cells = computed(() => {
    if (!current.value) return []

    const ret = []

    const { year: y, month: m } = current.value

    const count = getMonthDaysCount(y, m)
    const first = getMonthFirstDay(y, m)

    const prev = calculateMonth(y, m, -1)
    const next = calculateMonth(y, m, +1)
    const prevCount = getMonthDaysCount(prev.year, prev.month)

    for (let i = 1; i < 43; i++) {
      const v = i - first

      const isPrev = v < 1
      const isNext = v > count
      const date = isPrev ? (prevCount + v) : (isNext ? v - count : v)

      ret.push({
        date,
        attr: {
          // today:
        }
      })

      if (v >= count && i % 7 === 0) break
    }

    return ret
  })

  const rowCount = computed(() => parseInt(cells.value.length / 7))

  watchEffect(() => {
    current.value = selected.value || parseDateObject(new Date())
  })
</script>
