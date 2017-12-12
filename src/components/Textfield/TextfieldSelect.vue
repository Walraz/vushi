<template lang="pug">
  ul.vu-textfield-select(@mousedown.prevent :style="setSize" tabindex="-1" :class="{ 'vu-scrollbar' : optionList.length > size }")
    li.vu-textfield-select__item(v-show="!optionList.length" tabindex="-1")
      span.vu-textfield-select__item-text--no-result Inga resultat...
    li.vu-textfield-select__item(
      v-for="(option, $index) in optionList"
      :key="$index"
      tabindex="-1"
      :class="{ 'vu-textfield-select__item--focused': isFocused($index) }"
    )
      Checkbox(v-if="multiple" :ref="'item' + $index" v-model="multipleValues" :checkValue="option[optionValue]" :label="highlightText(option[optionLabel])" tabindex="-1")
      span.vu-textfield-select__item-text(v-else @click.stop="onClick(option)" v-html="highlightText(option[optionLabel])" :class="{ 'vu-textfield-select__item--selected': isSelected(option[optionLabel]) }")
</template>

<script>
import Checkbox from '../Checkbox'
export default {
  name: 'textfield-select',

  components: {
    Checkbox,
  },

  data() {
    return {
      selectedIndex: 0,
      itemHeight: 0,
      multipleValues: [],
      parsedOptions: [],
      isResult: false,
    }
  },

  watch: {
    multipleValues(value) {
      this.$emit('select', value)
    },
    options(value) {
      this.parseOptionArray(value)
    },
    value() {
      if (this.multiple)
        this.multipleValues = Array.isArray(this.$parent.value)
          ? this.$parent.value
          : []
    },
  },

  computed: {
    setSize() {
      return {
        maxHeight: `${this.itemHeight * this.size}px`,
      }
    },
    optionList() {
      const searchInput = this.$parent.searchInput
      if (!this.autosuggestion || !searchInput.length) return this.parsedOptions
      this.selectedIndex = 0
      return this.parsedOptions.filter(item => {
        return item[this.optionLabel]
          .toLowerCase()
          .includes(this.$parent.searchInput.toLowerCase())
      })
    },
  },

  mounted() {
    this.parseOptionArray(this.options)
    if (this.multiple)
      this.multipleValues = Array.isArray(this.$parent.value)
        ? this.$parent.value
        : []
    document.addEventListener('click', this.closeDropdown, true)
    document.addEventListener('keydown', this.onKeydown, false)
    const itemEl = this.$el.querySelector('.vu-textfield-select__item')
    const heightStyle = window
      .getComputedStyle(itemEl, null)
      .getPropertyValue('height')
    this.itemHeight = parseFloat(heightStyle) || 0
  },

  methods: {
    isFocused(index) {
      return this.selectedIndex === index
    },
    isSelected(label) {
      return this.$parent.inputLabel === label
    },
    closeDropdown(e = false) {
      if (e && this.$parent.$el.contains(e.target)) return
      if (this.multiple) this.$emit('close', this.multipleValues)
      else this.$emit('close')
    },
    onClick(value) {
      if (this.multiple) return
      this.isResult = value
      this.$emit('select', value)
      this.$parent.$refs.tabaway.focus()
      this.closeDropdown()
    },
    onKeydown(e) {
      const keyCode = e.keyCode
      if (keyCode === 40 && this.selectedIndex < this.optionList.length - 1) {
        this.selectedIndex++
        this.$el.scrollBy({
          top: this.itemHeight,
          left: 0,
          behavior: 'smooth',
        })
      }

      if (keyCode === 38 && this.selectedIndex > 0) {
        this.selectedIndex--
        this.$el.scrollBy({
          top: -this.itemHeight,
          left: 0,
          behavior: 'smooth',
        })
      }
      if (keyCode === 13) {
        if (this.multiple) {
          if (this.optionList.length) {
            this.$refs[`item${this.selectedIndex}`][0].select()
          } else this.closeDropdown()
        }

        if (!this.multiple) {
          const result = this.optionList.find(
            (o, i) => i === this.selectedIndex,
          )
          if (result) {
            this.onClick(result)
          } else this.closeDropdown()
        }
      }
      if (keyCode === 27) {
        this.closeDropdown()
        this.$parent.$refs.tabaway.focus()
      }
      if (keyCode === 9) {
        if (this.optionList.length === 1 && this.selectTab) {
          if (this.multiple) {
            this.$refs[`item${this.selectedIndex}`][0].select()
            this.closeDropdown()
          } else this.onClick(this.optionList[0])
        } else {
          this.closeDropdown()
        }
      }
    },
    parseOptionArray(value) {
      if (!value.length) return

      if (typeof value[0] === 'object') {
        this.parsedOptions = value.map(option => {
          return {
            [this.optionLabel]: option[this.optionLabel],
            [this.optionValue]: option[this.optionValue],
          }
        })
      } else {
        this.parsedOptions = value.map(option => {
          return {
            [this.optionLabel]: option,
            [this.optionValue]: option,
          }
        })
      }
    },
    highlightText(item) {
      if (!this.options.length || !this.autosuggestion) return item
      const re = new RegExp('(' + this.$parent.searchInput + ')', 'gi')
      return item.replace(re, `<strong>$1</strong>`)
    },
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown, false)
    document.removeEventListener('click', this.closeDropdown, true)
  },

  props: {
    value: null,
    selectTab: Boolean,
    autosuggestion: Boolean,
    multiple: Boolean,
    options: Array,
    size: {
      type: Number,
      default: () => 4,
    },
    optionLabel: {
      type: String,
      default: () => 'label',
    },
    optionValue: {
      type: String,
      default: () => 'value',
    },
  },
}
</script>

<style lang="stylus">
.vu-textfield-select
  position absolute
  top calc(100% + 2px)
  left 0
  list-style-type none
  box-shadow 0 8px 16px rgba(#000, 0.1)
  min-width 100%
  z-index 99
  background #fff
  overflow-y scroll

  .vu-checkbox
    width 100%
    display flex
    padding 16px

  &__item-text
    display block
    padding 16px

    &--no-result
      display flex
      align-items center
      justify-content center
      height 100%
      padding 0 16px
      font-weight 700
      color rgba(#000, 0.6)
      font-size 14px
      pointer-events none

  &__item
    height 52px
    cursor pointer
    white-space nowrap
    transition --transition(background)

    &--focused
      background rgba($primary-color, 0.08)

    &--selected
      font-weight 700
      color $primary-color

    &:hover
      background rgba($primary-color, 0.12)
</style>

