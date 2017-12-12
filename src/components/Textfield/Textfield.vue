<template lang="pug">
.vu-textfield-container(:class="{ 'vu-textfield-container--disabled' : disabled }")
  .vu-textfield-container__label-container
    label.vu-textfield__label(:class="labelClasses" v-if="label")
          | {{ label }}
          span.vu-textfield__label--required(v-if="required") *
  .vu-textfield(
      @click="onClick"
      :class="textfieldClassed"
  )
    .vu-textfield__wrapper
      div(v-if="multiple && itemList.length" v-for="(item, $index) in itemList" :key="$index")
        transition(name="vuFadeBottom" appear)
          .vu-textfield__item(:class="{ 'vu-textfield__item--disabled' : disabled }")
            span {{ item[optionLabel] }}
            Icon(@click="onItemRemove($index)" v-if="!disabled") close
      input.vu-textfield__input(
        ref="input"
        tabindex="0"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.delete="removeLastItem"
        @keydown.esc="$refs.input.blur"
        :style="inputStyle"
        :placeholder="setPlaceholder"
        :disabled="disabled"
        :max="max"
        :min="min"
        :maxlength="maxlength"
        :pattern="pattern"
        :readonly="isReadonly"
        :required="required"
        :value="searchInput"
      )
    TextfieldIcon(
      v-if="isIcon"
      :icon="isIcon"
      :iconFn="iconFn"
      :iconShow="iconShow"
      :iconName="iconName"
      :iconTransition="iconTransition"
      @clear="onClear"
      @dropdown="toggleDropdown"
    )
    transition(name="vuFadeBottom")
      TextfieldSelect(
        v-if="options && showDropdown"
        ref="select"
        :options="options"
        :multiple="multiple"
        :autosuggestion="autosuggestion"
        :optionLabel="optionLabel"
        :optionValue="optionValue"
        :selectTab="selectTab"
        :size="size"
        @select="onItemSelect"
        @close="onCloseDropdown"
        v-model="value"
      )
    .vu-textfield__tabaway(
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keydown.enter="$refs.input.focus()"
      ref="tabaway"
      tabindex="-1"
    )
  transition(name="vuFadeBottom")
    .vu-textfield-container__error(v-if="isError")
      Icon.vu-textfield-container__error--icon info_outline
      | {{ $_validate.message }}
</template>

<script>
import TextfieldIcon from './TextfieldIcon'
import TextfieldSelect from './TextfieldSelect'
import Icon from '../Icon'
import objectEqual from '@/core/utils/objectEqual'
import validate from '../../core/mixins/validate'

export default {
  name: 'textfield',

  mixins: [validate],

  components: {
    TextfieldIcon,
    TextfieldSelect,
    Icon,
  },

  data() {
    return {
      isFocused: false,
      inputValue: '',
      inputLabel: '',
      searchInput: '',
      showDropdown: false,
      isDirty: false,
    }
  },

  mounted() {
    this.$refs.input.type = this.type
    this.isValue()
  },

  watch: {
    value() {
      this.isValue()
    },
    options() {
      this.isValue()
    },
  },

  computed: {
    itemList() {
      if (
        Array.isArray(this.value) &&
        this.value.length &&
        this.options &&
        this.options.length
      ) {
        return this.value
          .map(v => {
            return this.parseOptionArray(this.options).find(o =>
              objectEqual(o[this.optionValue], v),
            )
          })
          .filter(o => o !== undefined)
      } else return []
    },
    isIcon() {
      if (this.options && !this.icon === 'clear') return 'dropdown'
      if (this.options && this.icon === 'clear') {
        if (
          this.multiple &&
          (Array.isArray(this.inputValue) && this.inputValue.length)
        )
          return 'clear'
        else if (this.inputLabel.length && !this.multiple) return 'clear'
        else return 'dropdown'
      }
      if (this.options) return 'dropdown'
      return this.icon
    },
    setPlaceholder() {
      if (this.placeholder && !this.options) return this.placeholder
      if (this.options && !this.multiple)
        return this.inputLabel || this.placeholder || ''
      if (this.options && this.multiple && !this.inputValue.length)
        return this.placeholder || ''
      else return ''
    },
    isReadonly() {
      return this.readonly || (this.options && !this.autosuggestion)
    },
    labelClasses() {
      return {
        'vu-textfield__label--active': this.isFocused,
        'vu-textfield__label--error': this.isError,
        'vu-textfield__label--float': this.floatLabel,
        'vu-textfield__label--disabled': this.disabled,
      }
    },
    floatLabel() {
      if (this.isFocused) return true
      if (this.setPlaceholder.length) return true
      if (this.options)
        return this.multiple
          ? Boolean(this.inputValue.length)
          : Boolean(this.inputLabel.length)
      if (!this.options) return Boolean(this.value.length)
    },
    textfieldClassed() {
      return {
        'vu-textfield--focused': this.isFocused,
        'vu-textfield--error': this.isError,
        'vu-textfield--disabled': this.disabled,
      }
    },
    inputStyle() {
      let fontSize = this.$refs.input
        ? window
            .getComputedStyle(this.$refs.input, null)
            .getPropertyValue('font-size')
        : 0
      fontSize = parseFloat(fontSize || 2)
      let inputTextLength = 0
      if (!this.multiple && this.options) {
        inputTextLength = this.searchInput.length
          ? this.searchInput.length
          : this.setPlaceholder.length
      } else {
        inputTextLength = this.searchInput.length
      }

      const containerWidth = this.$el ? this.$el.clientWidth - 44 : 2
      const inputWidth = inputTextLength * fontSize + fontSize
      return {
        width: `${inputWidth < containerWidth ? inputWidth : containerWidth}px`,
      }
    },
  },

  methods: {
    onFocus(e) {
      if (this.disabled) return
      this.isFocused = true
      if (this.options) this.showDropdown = true
      if (this.options && !this.multiple) {
        this._searchInput = JSON.parse(JSON.stringify(this.searchInput))
        this._inputValue = JSON.parse(JSON.stringify(this.inputValue))
        this._inputLabel = JSON.parse(JSON.stringify(this.inputLabel))
        this.searchInput = ''
      }
    },
    onBlur(e) {
      this.isFocused = false
    },
    onInput({ target }) {
      if (this.type === 'number') {
        if (this.min && parseInt(target.value, 10) < this.min)
          return (this.$refs.input.value = this.searchInput)
        if (this.max && parseInt(target.value, 10) > this.max)
          return (this.$refs.input.value = this.searchInput)
      }
      if (this.maxlength && target.value > this.maxlength) return
      this.searchInput = target.value
      if (!this.options) {
        this.inputValue = target.value
        this.emitValue()
      }
    },
    onClick() {
      if (this.disabled) return
      this.$refs.input.focus()
    },
    onClear() {
      if (this.disabled) return
      if (this.multiple) {
        this.inputValue.splice(0, this.inputValue.length)
      } else {
        this.inputValue = ''
      }
      this.inputLabel = ''
      this.searchInput = ''
      this.$refs.input.value = ''
      this.emitValue()
      this.showDropdown = false
      this.$refs.tabaway.focus()
    },
    toggleDropdown() {
      if (this.disabled) return
      if (this.isIcon === 'clear') {
        this.onClear()
        return
      }
      this.showDropdown = !this.showDropdown
      if (!this.isFocused) this.$refs.tabaway.focus()
      if (this.showDropdown) this.$refs.input.focus()
    },
    onCloseDropdown(value = false) {
      const result = this.$refs.select.isResult

      if (!this.multiple && typeof result === 'object') {
        this.searchInput = result[this.optionLabel]
        this.inputValue = result[this.optionValue]
        this.inputLabel = result[this.optionLabel]
        this.$refs.input.value = result[this.optionLabel]
      }

      if (!this.multiple && typeof result !== 'object') {
        this.searchInput = this._searchInput
        this.inputValue = this._inputValue
        this.inputLabel = this._inputLabel
        this.$refs.input.value = this._inputLabel
      }

      if (this.multiple) {
        this.inputValue = value
        this.searchInput = ''
        this.inputLabel = ''
      }

      this.emitValue()
      this.showDropdown = false
    },
    emitValue() {
      this.isDirty = true
      this.$emit('input', this.inputValue)
    },
    removeLastItem() {
      if (!this.multiple || this.searchInput.length) return
      if (!this.value) return
      const index = this.value.length - 1
      this.onItemRemove(index)
    },
    onItemRemove(index) {
      this.value.splice(index, 1)
      this.$refs.input.focus()
    },
    onItemSelect(value) {
      if (this.multiple) {
        this.inputLabel = ''
        this.searchInput = ''
        this.inputValue = value
      } else {
        this.inputLabel = value[this.optionLabel]
        this.inputValue = value[this.optionValue]
        this.$refs.input.value = value[this.optionLabel]
      }

      this.emitValue()
    },
    parseOptionArray(value) {
      if (!value.length) return []
      if (typeof value[0] === 'object') {
        return value.map(option => {
          return {
            [this.optionLabel]: option[this.optionLabel],
            [this.optionValue]: option[this.optionValue],
          }
        })
      } else {
        return value.map(option => {
          return {
            [this.optionLabel]: option,
            [this.optionValue]: option,
          }
        })
      }
    },
    isValue() {
      if (this.options && this.options.length) {
        if (this.multiple && this.value.length)
          return this.onItemSelect(this.value)
        const result = this.parseOptionArray(this.options).find(o =>
          objectEqual(o[this.optionValue], this.value),
        )
        if (result) this.onItemSelect(result)
      }
    },
  },

  props: {
    label: String,
    selectTab: Boolean,
    autosuggestion: Boolean,
    multiple: Boolean,
    options: Array,
    autofocus: Boolean,
    disabled: Boolean,
    placeholder: String,
    max: Number,
    min: Number,
    maxlength: Number,
    pattern: String,
    readonly: Boolean,
    required: Boolean,
    size: Number,
    optionLabel: {
      type: String,
      default: () => 'label',
    },
    optionValue: {
      type: String,
      default: () => 'value',
    },
    value: null,
    type: {
      type: String,
      default: () => 'text',
    },
    iconTransition: String,
    iconShow: {
      type: Boolean,
      default: () => true,
    },
    iconName: String,
    iconFn: Function,
    icon: String,
  },
}
</script>

<style lang="stylus">
.vu-textfield-container
  display flex
  flex 1 0 auto
  width 100%
  flex-direction column

  &--disabled
    pointer-events none

  &__label-container
    height 24px
    position relative
    z-index 1

  &__error
    font-size 12px
    padding 4px 8px
    font-weight 400
    display inline-flex
    align-items center
    color $warning-color

    &--icon
      padding-right 4px

.vu-textfield
  position relative
  display flex
  flex 1 0 auto
  width 100%
  justify-content space-between
  border 0
  border-radius 0
  border-style solid
  border-bottom-width 1px
  border-color rgba(#000, 0.2)
  padding-bottom 1px
  cursor text
  transition --transition(border-bottom), --transition(box-shadow)

  &__label
    font-size 16px
    position absolute
    top 36px
    left 8px
    color #555
    transform-origin left top
    transition --transition()
    pointer-events none

    &--active
      color $primary-color

    &--float
      font-weight 700
      transform translateY(-24px) scale(0.74)

    &--error
      color $warning-color

    &--required
      color $warning-color

    &--disabled
      color $disabled-color

      .vu-textfield__label--required
        color $disabled-color

  &__tabaway
    position absolute
    z-index -99
    opacity 0
    top -9999px
    pointer-events none

  &--focused
    box-shadow inset 0 -1px 0 0 $primary-color
    border-color $primary-color

  &--error
    box-shadow inset 0 -1px 0 0 $warning-color
    border-color $warning-color

  &--disabled
    border-color $disabled-bg
    border-style dashed

  &__wrapper
    display flex
    flex-wrap wrap
    width 100%

  &__item
    border-radius 2px
    background $primary-color
    color #fff
    display inline-flex
    align-items center
    justify-content center
    padding 0 8px
    margin-top 4px
    margin-bottom 4px
    margin-left 4px
    font-size 12px
    height 32px
    white-space nowrap
    cursor pointer

    &--disabled
      background $disabled-bg
      color $disabled-color

    span
      padding 0 4px
      cursor default

  &__input
    caret-color $primary-color
    font-size 16px
    height 40px
    margin-left 8px
    border 0
    border-radius 0
    display inline-flex
    flex 1 0 auto
    font-family inherit

    &:disabled
      color $disabled-color
</style>

