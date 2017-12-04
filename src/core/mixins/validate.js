export default {
  computed: {
    $_validate() {
      const validated = Object.keys(this.validate).map(rule => {
        const r = this[`$_${rule}`](
          this.validate[rule],
          this.$_validateConvert(this.value),
        )
        return { error: r.error, message: r.message }
      })

      return validated.find(r => r.error) || { error: false, message: '' }
    },
    $_validateOn() {
      if (this.disabled) return false
      if (this.validateOn !== null) return this.validateOn
      if (this.options) return true
      return this.isDirty
    },
  },

  methods: {
    $_validateConvert(value) {
      if (Array.isArray(value)) return value.length ? ' ' : ''
      if (value === (value | 0)) return value.toString()
      if (typeof value === 'number') return value.toString()
      if (value === true || value === false) return ' '
      if (value === null) return ''
      if (value === undefined) return ''
      else return value
    },
    $_minLength(min, value) {
      return {
        error: value.length < min,
        message: `Måste minst innehålla ${min} tecken`,
      }
    },
    $_maxLength(max, value) {
      return {
        error: value.length > max,
        message: `Får max innehålla ${max} tecken`,
      }
    },
    $_required(type, value) {
      return {
        error: !value.length,
        message: 'Detta fältet måste fyllas i',
      }
    },
    $_includesChar(char, value) {
      return {
        error: !value.includes(char),
        message: 'Måste innehålla "."',
      }
    },
  },

  props: {
    validate: {
      type: Object,
      default: () => ({}),
    },
    validateOn: {
      type: [Boolean, null],
      default: () => null,
    },
  },
}
