<template lang="pug">
  .vu-calendar
    .vu-calendar__header
      transition(name="vuFadeTop")
        .vu-calendar__year-month(v-if="showYearMonthControls")
          .vu-calendar__year-month__years
            .vu-calendar__year-month__years__year(
              v-for="(year, $year) in years"
              @click="setYear(year)"
              :data-year="year"
              :class="{ 'vu-calendar__year-month__years__year--selected' : year === currentYear }"
              :key="$year") {{ year }}
          .vu-calendar__year-month__months
            .vu-calendar__year-month__months__month(
              v-for="(month, $month) in months"
              :key="$month"
              @click="setMonth($month)"
              :class="{ 'vu-calendar__year-month__months__month--selected' : $month === currentMonth }"
              )
              span {{ month }}
      .vu-calendar__display(@click="openYearMonthControls")
        transition(name="vuFadeLeft" mode="out-in")
          .vu-calendar__display__year-text(:key="currentYear") {{ displayYear }}
        transition(name="vuFadeLeft" mode="out-in")
          .vu-calendar__display__month-text(:key="currentMonth") {{ displayMonth }}
      .vu-calendar__controls
        transition(name="vuScale" mode="out-in")
          .vu-calendar__controls__container(v-if="!showYearMonthControls" :key="!showYearMonthControls")
            .vu-calendar__controls__container__icon
              Icon(@click="prevMonth") keyboard_arrow_left
            .vu-calendar__controls__container__icon
              Icon(@click="nextMonth") keyboard_arrow_right
          .vu-calendar__controls__container__icon(v-else)
            Icon(@click="openYearMonthControls" v-if="!yearMonthPicker") close

    .vu-calendar__days-header
      span(v-for="day in days") {{ parseDayText(day) }}
    .vu-calendar__touch-area
      transition(name="vuFadeLeft" mode="out-in")
        .vu-calendar__days-container(:key="currentMonth")
          .vu-calendar__days(v-for="(row, $index) in createCalendarArray" :key="$index")
            .vu-calendar__day(:class="{ 'vu-calendar__day--disabled' : !day.currentMonth }" @click="selectDate(day)" v-for="(day, $day) in row" :key="$day")
              .vu-calendar__day__day-text(:class="{ 'vu-calendar__day__day-text--today' : isToday(day.date) && day.currentMonth, 'vu-calendar__day__day-text--selected' : isSelected(day) && day.currentMonth }") {{ day.date }}
              transition(name="vuScale" appear)
                .vu-calendar__day__today(v-if="isToday(day.date) && day.currentMonth")
              transition(name="vuScale" appear)
                .vu-calendar__day__selected(v-if="isSelected(day)")
</template>

<script>
import isValidDate from '@/core/utils/validDate'
import TouchEvent from '@/core/utils/touchEvent'
import Icon from './Icon'

const days = [
  'Måndag',
  'Tisdag',
  'Onsdag',
  'Torsdag',
  'Fredag',
  'Lördag',
  'Söndag',
]

const months = [
  'Januari',
  'Februari',
  'Mars',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'Agusti',
  'September',
  'Oktober',
  'November',
  'December',
]

export default {
  name: 'calendar',

  components: {
    Icon,
  },

  data() {
    return {
      touchEvent: null,
      showYearMonthControls: this.yearMonthPicker,
      currentMonth: null,
      currentYear: null,
      today: new Date(),
      days,
      months,
      day: null,
      month: null,
      year: null,
    }
  },

  watch: {
    value(date) {
      this.isValidDate(date)
    },
  },

  created() {
    this.createDateObject(new Date())
  },

  beforeDestroy() {
    this.touchEvent.destroy()
  },

  mounted() {
    this.isValidDate(this.value)
    this.touchEvent = new TouchEvent(
      this.$el.querySelector('.vu-calendar__touch-area'),
      this.swipe.bind(this),
    )
    this.touchEvent.init()
    this.$nextTick(() => {
      const yearEl = this.$el.querySelector(`[data-year="${this.currentYear}"]`)
      yearEl.scrollIntoView()
    })
  },

  methods: {
    setMonth(month) {
      this.currentMonth = month
      if (!this.yearMonthPicker) return
      const currentMonth = this.currentMonth + 1
      const parsedMonth =
        currentMonth.toString().length === 1 ? `0${currentMonth}` : currentMonth
      this.$emit(
        'input',
        `${this.currentYear || new Date().getFullYear()}-${parsedMonth}-01`,
      )
    },
    setYear(year) {
      this.currentYear = year
      if (!this.yearMonthPicker) return
      const currentMonth =
        this.currentMonth !== null
          ? this.currentMonth + 1
          : new Date().getMonth() + 1

      const parsedMonth =
        currentMonth.toString().length === 1 ? `0${currentMonth}` : currentMonth

      this.$emit('input', `${this.currentYear}-${parsedMonth}-01`)
    },
    swipe({ touchendX, touchstartX }) {
      const threshold = 50
      if (touchendX + threshold <= touchstartX) {
        this.prevMonth()
      }

      if (touchendX - threshold >= touchstartX) {
        this.nextMonth()
      }
    },
    openYearMonthControls() {
      this.showYearMonthControls = !this.showYearMonthControls
      this.$nextTick(() => {
        const yearEl = this.$el.querySelector(
          `[data-year="${this.currentYear}"]`,
        )
        yearEl.scrollIntoView()
      })
    },
    selectDate({ date, fullDate, currentMonth }) {
      if (!currentMonth) return
      const parsedDate = new Date(
        +fullDate - fullDate.getTimezoneOffset() * 60 * 1000,
      )
        .toISOString()
        .split(/[TZ]/)
        .slice(0, 2)
        .join(' ')
        .split(' ')[0]
      this.$emit('input', parsedDate)
    },
    isSelected({ date, currentMonth }) {
      if (!currentMonth) return
      const d = new Date(this.currentYear, this.currentMonth, date)
      return (
        d.setHours(0, 0, 0, 0) ===
        new Date(this.year, this.month, this.day).getTime()
      )
    },
    isToday(day) {
      return (
        this.today.setHours(0, 0, 0, 0) ===
        new Date(this.currentYear, this.currentMonth, day).getTime()
      )
    },
    prevMonth() {
      if (this.currentMonth - 1 < 0) {
        this.currentMonth = 11
        this.currentYear--
      } else this.currentMonth--
    },
    nextMonth() {
      if (this.currentMonth + 1 > 11) {
        this.currentMonth = 0
        this.currentYear++
      } else this.currentMonth++
    },
    parseDayText(day) {
      return day.substring(0, 3)
    },
    getFirstDayInMonth(year, month) {
      return new Date(year, month, 1)
    },
    createDateObject(date) {
      const d = new Date(date)
      this.currentMonth = d.getMonth()
      this.currentYear = d.getFullYear()
      this.day = d.getDate()
      this.month = d.getMonth()
      this.year = d.getFullYear()
    },
    isValidDate(date) {
      if (typeof date !== 'string' || !isValidDate(date))
        this.createDateObject(new Date())
      else this.createDateObject(date)
    },
  },

  computed: {
    years() {
      const years = new Array(this.maxDate + 1 - this.minDate).fill('')
      return years.map((value, index) => this.minDate + index)
    },

    maxDate() {
      const currentYear = new Date()
      if (!this.max) return parseInt(currentYear.getFullYear(), 10) + 50
      return parseInt(new Date(this.max).getFullYear(), 10)
    },

    minDate() {
      const currentYear = new Date()
      if (!this.min) return parseInt(currentYear.getFullYear(), 10) - 50
      return parseInt(new Date(this.min).getFullYear(), 10)
    },

    displayYear() {
      return this.currentYear
    },

    displayMonth() {
      return this.months[this.currentMonth]
    },

    createCalendarArray() {
      const calendarArray = []
      const firstDate = this.getFirstDayInMonth(
        this.currentYear,
        this.currentMonth,
      ).getDay()
      for (let i = 0; i < 6; i++) {
        calendarArray.push([])
        for (let j = 0; j < 7; j++) {
          const date = new Date(
            this.currentYear,
            this.currentMonth,
            2 + i * 7 + j - firstDate,
          )
          calendarArray[i].push({
            currentMonth: this.currentMonth === date.getMonth(),
            fullDate: date,
            date: date.getDate(),
          })
        }
      }
      return calendarArray
    },
  },

  props: {
    yearMonthPicker: Boolean,
    value: null,
    min: String,
    max: String,
  },
}
</script>

<style lang="stylus">
.vu-calendar
  display flex
  flex 1 0 auto
  flex-direction column
  min-width 320px
  user-select none

  &__year-month
    position absolute
    top 100%
    left 0
    background #fff
    width 100%
    padding 16px
    z-index 2
    box-shadow 0 6px 6px rgba(#000, 0.05)
    display flex
    height 202px

    &__years
      display flex
      overflow-y scroll
      flex-direction column
      min-width 80px

      &__year
        padding 8px 0
        font-size 16px
        font-weight 500
        text-align center
        border-radius 2px
        cursor pointer

        &:hover
          background rgba($primary-color, 0.1)

        &--selected, &--selected:hover
          background $primary-color
          color #fff

    &__months
      display flex
      flex-wrap wrap
      padding 0 8px
      justify-content space-between

      &__month
        display flex
        align-items center
        justify-content center
        width 96px
        cursor pointer

        span
          border-radius 2px
          font-size 12px
          font-weight 600
          padding 8px
          transition --transition(background)

          &:hover
            background rgba($primary-color, 0.1)

        &--selected span, &--selected span:hover
          background $primary-color
          color #fff

  &__controls
    cursor pointer

    &__container
      display flex

      &__icon
        padding 8px 0

      &__icon:first-child
        margin-right 4px

  &__header
    display flex
    justify-content space-between
    padding 16px
    position relative

  &__display
    font-size 18px
    font-weight 700
    cursor pointer

    &__year-text
      font-size 14px
      font-weight 700
      opacity 0.5

    &__day-text
      font-size 16px
      font-weight 400

  &__days-container
    padding-bottom 16px

  &__days
    display flex
    flex 1 0 auto

  &__day
    display flex
    flex 1 0 auto
    align-items center
    font-weight 500
    font-size 14px
    justify-content center
    height 2em
    min-width 24px
    position relative
    cursor pointer

    &__day-text
      position relative
      z-index 1

      &:hover
        color $primary-color

      &--today
        color $primary-color

      &--selected
        color #fff

        &:hover
          color #fff

    &__today, &__selected
      border-radius 2px
      height 2em
      width 2em
      margin auto
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      z-index 0

    &__today
      border 1px solid $primary-color

      &:hover
        color $primary-color

    &__selected
      background $primary-color

      &:hover
        color #fff

    &--disabled
      pointer-events none
      color rgba(#000, 0.2)

  &__days-header
    display flex
    flex 1 0 auto
    justify-content space-between
    font-size 10px
    text-transform uppercase
    font-weight 700
    padding-bottom 8px
    color rgba(#000, 0.5)

  span
    min-width 24px
    display flex
    flex 1 0 auto
    align-items center
    justify-content center
</style>
