export default {
  computed: {
    isError() {
      return this.$_validate.error && this.$_validateOn
    },
    $_validate() {
      if (this.type === 'email') this.validate.email = true
      if (this.pattern) this.validate.pattern = this.pattern
      if (this.required) this.validate.required = true
      const validated = Object.keys(this.validate).map(rule => {
        const r = this[`$_${rule}`](
          this.validate[rule],
          this.$_validateConvert(
            !this.options
              ? this.value
              : this.multiple ? this.inputValue.length : this.inputLabel,
          ),
        )
        return { error: r.error, message: r.message }
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
        message: this.errorMessage || `Måste minst innehålla ${min} tecken`,
      }
    },
    $_maxLength(max, value) {
      return {
        error: value.length > max,
        message: this.errorMessage || `Får max innehålla ${max} tecken`,
      }
    },
    $_required(type, value) {
      return {
        error: !value.length,
        message: this.errorMessage || 'Detta fältet måste fyllas i',
      }
    },
    $_includesChar(char, value) {
      return {
        error: !value.includes(char),
        message: this.errorMessage || 'Måste innehålla "."',
      }
    },
    $_pattern(regex, value) {
      const pattern = new RegExp(regex)
      return {
        error: !pattern.test(value),
        message: this.errorMessage || `Måste följa regulärt uttryck: ${regex}`,
      }
    },
    $_email(type, value) {
      const pattern = new RegExp(
        /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
      )
      return {
        error: !pattern.test(value),
        message: this.errorMessage || `Felaktig email address`,
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
