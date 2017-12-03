<template lang="pug">
  .vu-textfield(:class="classes")
    .vu-textfield__input-wrapper
      transition(name="fadeTop")
        .vu-dropdown(v-if="showDropdown")
          .vu-dropdown__item(:class="{ 'vu-dropdown__item--selected': isSelected(item), 'vu-dropdown__item--focused': isItemFocused($index), 'vu-dropdown__item--no-result': item.$_noResult }" v-for="(item, $index) in optionsList" :key="$index" @mousedown.prevent.stop="onSelect(item)" v-html="highlightText(validateOptionLabel(item))")
      label.vu-textfield__label(:class="labelClasses" v-if="label")
        | {{ label }}
        span.vu-textfield__label--required(v-if="required") *
      .vu-textfield__icon
        .vu-textfield__icon--loading
          transition(name="scale" mode="out-in")
            Spinner(v-if="!isOptions" :key="!isOptions")
        .vu-textfield__icon--arrow(:class="arrowClasses" @click.stop.prevent="toggleDropdown")
            Icon(v-if="options && isOptions") keyboard_arrow_down
        .vu-textfield__icon--clear(@click="clearInput")
          transition(name="scale" mode="out-in")
            Icon(v-if="showIcon && isOptions || showOptionClear && isOptions" :key="showOptionClear") close
        .vu-textfield__icon--visibility(@click="toggleVisibility")
          transition(name="scale" mode="out-in")
            Icon(v-if="icon === 'visibility' && type === 'password' && !isVisibility" :key="isVisibility") visibility
            Icon(v-else-if="icon === 'visibility' && type === 'password' && isVisibility") visibility_off
      input.vu-textfield__input(:class="inputClasses" @keydown.tab="onEnter" @keydown.down="onKeyDown" @keydown.up="onKeyUp" @keydown.prevent.enter="onEnter" :tabindex="tabindex" :readonly="isReadonly" :maxLength="maxLength" :placeholder="placeholder" @input="onInput" :disabled="disabled" @focus="onFocus" @blur="onBlur")
    transition(name="fadeBottom")
      .vu-textfield__error(v-if="$_validate.error && $_validateOn")
        Icon.vu-textfield__error--icon info_outline
        | {{ $_validate.message }}
</template>

<script>
import Spinner from './Spinner'
import Icon from './Icon'
import validate from '../core/mixins/validate'
import { maxLength } from '../core/mixins/props'
import select from '../core/mixins/select'
import autosuggestion from '../core/mixins/autosuggestion'
import throttle from '../core/utils/throttle'
import debounce from '../core/utils/debounce'
export default {
  name: 'textfield',

  components: {
    Icon,
    Spinner,
  },

  mixins: [validate, maxLength, select, autosuggestion],

  data() {
    return {
      isVisibility: false,
      isDirty: false,
      isFocused: false,
      inputEl: null,
      autosuggestionValue: '',
      selectedItemIndex: -1,
    }
  },

  mounted() {
    this.inputEl = this.$el.querySelector('.vu-textfield__input')
    this.inputEl.type = this.type
    if (!this.options) {
      this.inputEl.value = this.value
      return
    }

    if (this.value === null || !this.options.length) {
      this.inputEl.value = ''
      this.autosuggestionValue = ''
      this.selectedItemIndex = -1
      return
    }
    const item = this.getItem(this.value)
    if (!item) {
      this.autosuggestionValue = ''
      this.inputEl.value = ''
      return
    }
    this.autosuggestionValue = this.validateOptionLabel(item)
    this.inputEl.value = this.validateOptionLabel(item)
    this.setSelectedItemIndex(item)
  },

  methods: {
    getItem(value, key = 'Value') {
      return this.options.find(
        o =>
          this.parseItem(this[`validateOption${key}`](value)) ===
          this.parseItem(this[`validateOption${key}`](o)),
      )
    },
    isItemFocused(index) {
      return index === this.selectedItemIndex
    },
    onInput(value) {
      this.isDirty = true
      if (this.options && !this.autosuggestion) return
      this.autosuggestionValue = this.inputEl.value
      if (this.autosuggestion) return
      this.$emit('input', this.inputEl.value)
    },
    setInputValue(label, value) {
      if (value === null) {
        this.inputEl.value = ''
      } else this.inputEl.value = label
      this.$emit('input', value)
      if (this.autosuggestion) this.autosuggestionValue = label
      this.inputEl.blur()
    },
    onEnter() {
      if (!this.options) return
      this.selectedItemIndex =
        this.selectedItemIndex < 0 ? 0 : this.selectedItemIndex
      this.setInputValue(
        this.validateOptionLabel(this.optionsList[this.selectedItemIndex]),
        this.validateOptionValue(this.optionsList[this.selectedItemIndex]),
      )
    },
    onKeyUp() {
      if (!this.options) return
      if (this.selectedItemIndex !== 0) {
        this.selectedItemIndex--
      }
    },
    onKeyDown() {
      if (!this.options) return
      if (this.selectedItemIndex < this.options.length - 1) {
        this.selectedItemIndex++
      }
    },
    onFocus: throttle(function() {
      this.isFocused = true
      if (!this.options) return
      this.showDropdown = true
    }, 149),
    onBlur: debounce(function() {
      this.isFocused = false
      if (!this.options) return
      this.showDropdown = false
      if (this.autosuggestion) {
        const key = !this.isObjectArray ? 'Value' : 'Label'
        const result = this.getItem(this.autosuggestionValue, key)
        if (result) {
          this.setSelectedItemIndex(this.validateOptionLabel(result))
          this.inputEl.value = this.validateOptionLabel(result)
          this.$emit('input', this.validateOptionValue(result))
        } else {
          this.emptyState()
        }
        this.isDirty = false
      }
    }, 150),
    emptyState() {
      this.inputEl.value = ''
      this.autosuggestionValue = ''
      this.selectedItemIndex = -1
      this.$emit('input', null)
    },
    clearInput: debounce(function() {
      this.emptyState()
      this.$emit('clear')
      this.inputEl.focus()
    }, 151),
    toggleVisibility() {
      this.isVisibility = !this.isVisibility
      this.inputEl.type = !this.isVisibility ? 'password' : 'text'
      this.inputEl.focus()
    },
  },

  watch: {
    options() {
      if (this.value === null) return
      const item = this.getItem(this.value)
      if (!item) {
        this.autosuggestionValue = ''
        this.inputEl.value = ''
        this.$emit('input', null)
        return
      }
      this.autosuggestionValue = this.validateOptionLabel(item)
      this.inputEl.value = this.validateOptionLabel(item)
      this.setSelectedItemIndex(item)
      this.$emit('input', this.validateOptionValue(item))
    },
    value(value) {
      if (value === null) {
        this.autosuggestionValue = ''
        this.inputEl.value = ''
        this.selectedItemIndex = -1
        return
      }

      if (this.options) {
        const key = this.isObjectArray ? 'Value' : 'Label'
        const item = this.getItem(value, key)
        if (!item) return this.emptyState()
        this.inputEl.value = this[`validateOptionLabel`](item)
        this.setSelectedItemIndex(item)
        if (this.autosuggestion) {
          this.autosuggestionValue = this[`validateOptionLabel`](item)
        }
        return
      }
      this.inputEl.value = value
    },
  },

  computed: {
    isOptions() {
      if (!this.options) return true
      return this.options.length
    },
    isInputValue() {
      if (this.options && !this.options.length) return false
      if (typeof this.value === 'string') return this.value.length > 0
      if (typeof this.value === 'number') return true
      if (typeof this.value === 'boolean') return true
      return false
    },
    arrowClasses() {
      return {
        'vu-textfield__icon--arrow--active': this.showDropdown,
        'vu-textfield__icon--arrow--hide':
          this.showOptionClear || (this.icon === 'clear' && this.isFocused)
            ? this.autosuggestionValue.length
            : !this.options,
      }
    },
    labelClasses() {
      return {
        'vu-textfield__label--float':
          this.isFocused || this.isInputValue || this.placeholder,
        'vu-textfield__label--active': this.isFocused,
        'vu-textfield__label--error':
          this.$_validate.error && this.$_validateOn,
      }
    },
    inputClasses() {
      return {
        'vu-textfield__input--error':
          this.$_validate.error && this.$_validateOn,
      }
    },
    classes() {
      return {
        'vu-textfield--full-width': this.fullWidth,
        'vu-textfield--dropdown': this.isReadonly,
        'vu-textfield--disabled': this.disabled,
      }
    },
    isReadonly() {
      return this.readonly || (this.options && !this.autosuggestion)
    },
    showOptionClear() {
      return (
        this.icon === 'clear' &&
        this.options &&
        !this.disabled &&
        this.autosuggestionValue.length &&
        this.type === 'text'
      )
    },
    showIcon() {
      return (
        this.icon === 'clear' &&
        (this.type === 'text' ? this.isFocused : false) &&
        this.autosuggestionValue.length &&
        !this.disabled
      )
    },
  },

  props: {
    icon: {
      type: [String],
      default: () => 'none',
      validator(type) {
        return ['none', 'clear', 'visibility'].includes(type)
      },
    },
    value: {
      type: null,
      default: () => null,
    },
    type: {
      type: String,
      default: () => 'text',
    },
    tabindex: {
      type: [String, Number],
      default: () => 0,
    },
    label: String,
    placeholder: String,
    disabled: Boolean,
    required: Boolean,
    readonly: Boolean,
    fullWidth: Boolean,
  },
}
</script>

<style lang="stylus">
.vu-textfield
  display inline-flex
  flex-shrink 0
  flex-direction column
  position relative

  &--dropdown input
    cursor pointer

  &--full-width
    display flex
    width 100%
    flex-grow 1

  &__input-wrapper
    font-size 56px
    height 1em
    display flex
    position relative
    background transparent

  &__error
    font-size 12px
    padding 4px 8px
    font-weight 400
    display inline-flex
    align-items center
    color $warning-color

    &--icon
      padding-right 4px

  &__icon
    font-size 16px
    height calc(100% - 2px)
    position absolute
    padding-top 1em
    padding-right 1em
    right 8px
    bottom 1px
    user-select none
    color rgba(#000, 0.6)
    display inline-flex
    justify-content center
    align-items center

    &--visibility, &--clear, &--arrow, &--loading
      position absolute
      cursor pointer
      border-radius 50%
      display flex
      justify-content center
      align-items center

    &--arrow
      font-size 20px
      transition --transition()

      &--hide
        visibility hidden
        pointer-events none

      &--active
        transform rotate(180deg)

    &--active
      opacity 1
      transform scale(1)

  &__label
    font-size 16px
    position absolute
    bottom 14px
    left 8px
    color #555
    transform-origin left top
    transition --transition()
    pointer-events none

    &--active
      color $primary-color

    &--float
      font-weight 600
      transform translateY(-16px) scale(0.74)

    &--error
      color $warning-color

    &--required
      color $warning-color

  &__input
    caret-color $primary-color
    background transparent
    font-size 16px
    padding-top 1em
    height 100%
    width 100%
    padding-left 8px
    padding-right 32px
    border-radius 0
    border 0
    transition --transition(border-color), --transition(box-shadow)
    border-bottom-width 1px
    border-style solid
    border-color rgba(#000, 0.2)

    &:focus
      box-shadow inset 0 -1px 0 0 $primary-color
      border-color $primary-color

    &:disabled
      background $disabled-bg
      color $disabled-color
      border-color $disabled-bg

    &--error, &--error:focus
      box-shadow inset 0 -1px 0 0 $warning-color
      border-color $warning-color

  .vu-dropdown
    display flex
    flex-direction column
    position absolute
    z-index $depth-low
    width 100%
    box-shadow 0 3px 6px rgba(#000, 0.1)
    top 1em
    background #fff

    &__item
      display flex
      align-items center
      width 100%
      cursor pointer
      height 3em
      display flex
      padding 8px
      font-size 16px
      white-space pre

      &--selected
        color $primary-color
        font-weight 700

      &--no-result
        color rgba(#000, 0.5)
        font-size 14px

      &:hover
        background rgba(#000, 0.04)

      &--focused
        border 1px solid rgba($primary-color, 0.5)

  &--disabled
    .vu-textfield__label
      color $disabled-color

      &--required
        color $disabled-color

    .vu-textfield__icon
      visibility hidden
      pointer-events none
</style>


