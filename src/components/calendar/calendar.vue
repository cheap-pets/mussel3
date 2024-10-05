<template>
  <div class="mu-calendar">
    <div class="mu-calendar_header">
      <mu-dropdown-button
        dropdown-trigger="click"
        class="mu-calendar_caption" button-style="text"
        icon="calendar" :caption="caption">
        <template #dropdown>
          <table class="mu-calendar_years mu-calendar_table" cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td><mu-icon icon="chevronLeft" /></td>
                <td v-for="i in 5" :key="i">
                  {{ i + startYear - 1 }}
                </td>
              </tr>
              <tr>
                <td v-for="i in 5" :key="i">
                  {{ i + startYear + 4 }}
                </td>
                <td><mu-icon icon="chevronRight" /></td>
              </tr>
            </tbody>
          </table>
        </template>
      </mu-dropdown-button>
      <mu-tool-button icon="chevronUp" @click="goSiblingMonth(-1)" />
      <mu-tool-button icon="chevronDown" @click="goSiblingMonth(1)" />
    </div>
    <div class="mu-divider" thin />
    <table class="mu-calendar_body mu-calendar_table" cellpadding="0" cellspacing="0">
      <thead>
        <th v-for="v in daysOfWeek" :key="v">
          {{ v }}
        </th>
      </thead>
      <tbody>
        <tr v-for="(row, i) in data" :key="i">
          <td
            v-for="(cell, j) in row" :key="j"
            :prev="cell.prev"
            :next="cell.next"
            :today="isSameDate(cell, today) || null"
            :active="isSameDate(cell, selected) || null"
            @click="setDate(cell)">
            {{ cell.date }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import './calendar.scss'

  import { reactive, computed, watchEffect } from 'vue'
  import { formatString } from '@/utils/string'

  import {
    parseDateObject,
    getMonthFirstDay,
    getMonthDaysCount,
    calculateMonth,
    isSameDate
  } from './calendar'

  import lang from '@/langs'

  const { YEAR_AND_MONTH, MONTHS } = lang.Calendar

  const date = defineModel('date', { type: [Date, String] })
  const to = defineModel('end', { type: [Date, String] })

  defineProps({
    range: Boolean,
    min: [Date, String],
    max: [Date, String],
    daysOfWeek: { type: Array, default: () => [...lang.Calendar.DAYS_OF_WEEK] }
  })

  const current = reactive({})

  const today = computed(() => parseDateObject(new Date()))
  const selected = computed(() => parseDateObject(date.value))

  const caption = computed(() =>
    formatString(YEAR_AND_MONTH, current.year, MONTHS[current.month])
  )

  const startYear = computed(() => current.year)

  const data = computed(() => {
    const { year: y, month: m } = current

    const count = getMonthDaysCount(y, m)
    const first = getMonthFirstDay(y, m)

    const prev = calculateMonth(y, m, -1)
    const next = calculateMonth(y, m, +1)
    const prevCount = getMonthDaysCount(prev.year, prev.month)

    const rows = []

    let i = 1
    let row = []

    while (true) {
      const v = i - first
      const isPrev = v < 1
      const isNext = v > count

      row.push(
        isPrev
          ? { ...prev, date: prevCount + v, prev: true }
          : isNext
            ? { ...next, date: v - count, next: true }
            : { year: y, month: m, date: v }
      )

      if (i % 7 === 0) {
        rows.push(row)

        if (v < count) row = []
        else break
      }

      i++
    }

    return rows
  })

  function goSiblingMonth (offset) {
    Object.assign(
      current,
      calculateMonth(current.year, current.month, offset)
    )
  }

  function setDate (cell) {
    date.value = new Date(cell.year, cell.month, cell.date)
  }

  watchEffect(() => {
    const { year, month } = selected.value || today.value

    current.year = year
    current.month = month
  })
</script>
