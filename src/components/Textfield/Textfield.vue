<template lang="pug">
.vu-textfield(
    @click="onClick"
    :class="textfieldClassed"
)
  .vu-textfield__wrapper
    div(v-if="multiple" v-for="(item, $index) in itemList" :key="$index")
      transition(name="vuFadeBottom" appear)
        .vu-textfield__item
          span {{ item[optionLabel] }}
          Icon(@click="onItemRemove($index)") close
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
    )
  .vu-textfield__tabaway(
    @focus="isFocused = true"
    @blur="isFocused = false"
    ref="tabaway"
    tabindex="-1"
  )
</template>

<script>
import TextfieldIcon from './TextfieldIcon'
import TextfieldSelect from './TextfieldSelect'
import Icon from '../Icon'

export default {
  name: 'textfield-2',

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
    }
  },

  mounted() {
    this.$refs.input.type = this.type
  },

  computed: {
    itemList() {
      if (Array.isArray(this.value) && this.value.length) {
        return this.value.map(v => {
          return this.parseOptionArray(this.options).find(
            o => o[this.optionValue] === v,
          )
        })
      } else return []
    },
    isIcon() {
      if (this.options && !this.icon === 'clear') return 'dropdown'
      if (this.options && this.icon === 'clear') {
        if (this.multiple && (this.value && this.value.length)) return 'clear'
        else if (this.inputLabel.length && !this.multiple) return 'clear'
        else return 'dropdown'
      }
      if (this.options) return 'dropdown'
      return this.icon
    },
    setPlaceholder() {
      if (this.placeholder && !this.options) return this.placeholder
      if (this.options && !this.multiple) return this.inputLabel
      else return ''
    },
    isReadonly() {
      return this.readonly || (this.options && !this.autosuggestion)
    },
    textfieldClassed() {
      return {
        'vu-textfield--focused': this.isFocused,
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
      if (this.maxlength && target.value > this.maxlength) return
      this.searchInput = target.value
      if (!this.options) {
        this.inputValue = target.value
        this.emitValue()
      }
    },
    onClick() {
      this.$refs.input.focus()
      this.isFocused = true
    },
    onClear(focus = true) {
      if (this.multiple) {
        this.inputValue.splice(0, this.inputValue.length)
      } else {
        this.inputValue = null
      }
      this.inputLabel = ''
      this.searchInput = ''
      this.$refs.input.value = ''
      this.emitValue()
      this.showDropdown = false
      this.isFocused = false
      if (focus) this.$refs.input.focus()
    },
    toggleDropdown() {
      if (this.isIcon === 'clear') {
        this.onClear()
        return
      }
      this.showDropdown = !this.showDropdown
      this.isFocused = !this.isFocused
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
        this.inputValue = value
      } else {
        this.inputLabel = value[this.optionLabel]
        this.inputValue = value[this.optionValue]
        this.$refs.input.value = value[this.optionLabel]
      }
      this.searchInput = ''
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
  },

  props: {
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
.vu-textfield
  position relative
  display flex
  flex 1 0 auto
  width 100%
  justify-content space-between
  border-bottom 1px solid rgba(#000, 0.2)
  cursor text

  &__tabaway
    position absolute
    z-index -99
    opacity 0
    top -9999px
    pointer-events none

  &--focused
    border-width 2px
    border-color $primary-color

  &__wrapper
    display flex
    flex-wrap wrap

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

    span
      padding 0 4px
      cursor default

  &__input
    font-size 16px
    height 40px
    margin-left 8px
    border 0
    border-radius 0
    display inline-flex
    flex 1 0 auto
</style>

