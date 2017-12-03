export default {
  computed: {
    optionsList() {
      if (
        !this.options.length ||
        !this.autosuggestion ||
        !this.autosuggestionValue.length ||
        !this.isDirty
      )
        return !this.options.length
          ? [
              {
                $_noResult: true,
                [this.optionValue]: null,
                [this.optionLabel]: 'Ingen data...',
              },
            ]
          : this.options

      this.selectedItemIndex = -1
      if (this.isObjectArray) {
        return this.options.filter(item => {
          return this.parseItem(item[this.optionLabel]).includes(
            this.parseItem(this.autosuggestionValue),
          )
        })
      } else {
        return this.options.filter(item => {
          return this.parseItem(item).includes(
            this.parseItem(this.autosuggestionValue),
          )
        })
      }
    },
  },

  methods: {
    parseItem(item, key = 'Value') {
      if (key === 'Label') return item
      return item.toString().toLowerCase()
    },
    highlightText(item) {
      const re = new RegExp('(' + this.autosuggestionValue + ')', 'gi')
      if (
        !this.options.length ||
        !this.autosuggestion ||
        !this.autosuggestionValue.length
      )
        return item
      else return item.replace(re, `<strong>$1</strong>`)
    },
  },

  props: {
    autosuggestion: Boolean,
  },
}
