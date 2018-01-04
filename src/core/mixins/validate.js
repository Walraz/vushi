export default {
  computed: {
    isError() {
      return this.$_validate.error && this.$_validateOn
    },
    $_validate() {
      if (this.type === 'time' && !this.validate.time) this.validate.time = true
      if (this.type === 'date' && !this.validate.date) this.validate.date = true
      if (this.type === 'email' && !this.validate.email)
        this.validate.email = true
      if (this.pattern && !this.validate.pattern)
        this.validate.pattern = this.pattern
      if (this.required && !this.validate.required)
        this.validate.required = true
      const validated = Object.keys(this.validate).map(rule => {
        const errorRule = this.validate[rule]
        let message = false
        let param = false
        if (typeof errorRule === 'object') {
          if (errorRule.message) message = errorRule.message
          param = errorRule.param || true
        } else {
          param = errorRule
        }
        const r = this[`$_${rule}`](
          param,
          this.$_validateConvert(
            !this.options
              ? this.value
              : this.multiple ? this.inputValue.length : this.inputLabel,
          ),
        )
        return {
          error: r.error,
          message: message || this.errorMessage || r.message,
        }
      })

      return validated.find(r => r.error) || { error: false, message: '' }
    },
    $_validateOn() {
      if (this.disabled) return false
      if (this.validateOn === null) return this.isDirty
      return this.validateOn
    },
  },

  methods: {
    $_validateConvert(value) {
      if (this.multiple) return value ? ' ' : ''
      if (typeof value !== 'string') return ''
      return value
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
        error: !value.toLowerCase().includes(char.toLowerCase()),
        message: 'Måste innehålla "."',
      }
    },
    $_pattern(regex, value) {
      const pattern = new RegExp(regex)
      return {
        error: !pattern.test(value),
        message: `Måste följa regulärt uttryck: ${regex}`,
      }
    },
    $_email(type, value) {
      const pattern = new RegExp(
        /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
      )
      return {
        error: !pattern.test(value),
        message: `Felaktig email address`,
      }
    },
    $_time(type, value) {
      const pattern = new RegExp(
        /(^([0-9]|[0-1][0-9]|[2][0-3]):([0-5][0-9])$)|(^([0-9]|[1][0-9]|[2][0-3])$)/,
      )
      return { error: !pattern.test(value), message: `Felaktig tid format` }
    },
    $_date(type, value) {
      console.log(value)
      const pattern = new RegExp(/(\d{4})-(\d{2})-(\d{2})/)
      return {
        error: !pattern.test(value),
        message: `Felaktig datum format`,
      }
    },
  },

  props: {
    errorMessage: String,
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
