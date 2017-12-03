export default {
  data() {
    return { showDropdown: false }
  },

  methods: {
    setSelectedItemIndex(item) {
      this.selectedItemIndex = this.options.findIndex(
        o => this.validateOptionLabel(item) === this.validateOptionLabel(o),
      )
    },
    toggleDropdown() {
      if (this.showDropdown) this.inputEl.blur()
      else this.inputEl.focus()
    },
    validateOptionValue(item) {
      if (typeof item !== 'object') return item
      else return item[this.optionValue]
    },
    validateOptionLabel(item) {
      if (typeof item !== 'object') return item
      else return item[this.optionLabel]
    },
    onSelect(item) {
      this.setSelectedItemIndex(item)
      this.setInputValue(
        this.validateOptionLabel(item),
        this.validateOptionValue(item),
      )
    },
    isSelected(item) {
      return this.validateOptionValue(item) === this.value
    },
  },

  computed: {
    isObjectArray() {
      return typeof this.options[0] === 'object'
    },
    isResult() {
      if (this.isObjectArray) {
        return this.options.find(
          item =>
            this.parseItem(this.autosuggestionValue) ===
            this.parseItem(this.validateOptionLabel(item)),
        )
      } else {
        return this.options.find(
          item =>
            this.parseItem(this.autosuggestionValue) === this.parseItem(item),
        )
      }
    },
    optionsList() {
      return this.options
    },
  },

  props: {
    optionValue: {
      type: [String, Number],
      default: () => 'value',
    },
    optionLabel: {
      type: [String, Number],
      default: () => 'label',
    },
    options: Array,
  },
}
