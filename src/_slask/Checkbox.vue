<template lang="pug">
  label.vu-checkbox(:class="{ 'vu-checkbox--disabled' : disabled }")
    input.vu-checkbox__input(type="checkbox" :disabled="disabled" :value="checkValue" v-model="inputValue" ref="checkbox" tabindex="-1")
    .vu-checkbox__container(:class="containerClasses" ref="checkbox" :tabindex="tabindex"  @keydown.enter="select")
      .vu-checkbox__mark(:class="markClasses")
        Icon check
    .vu-checkbox__label(v-if="label" v-html="label")
</template>

<script>
import Icon from './Icon'
import objectEqual from '@/core/utils/objectEqual'
export default {
  name: 'checkbox',

  components: {
    Icon,
  },

  methods: {
    onClick() {
      this.$emit('click')
    },
    select() {
      this.$refs.checkbox.click()
    },
  },

  computed: {
    isMarked() {
      return Array.isArray(this.inputValue)
        ? this.inputValue.some(o => objectEqual(o, this.checkValue))
        : this.inputValue === true
    },
    inputValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    containerClasses() {
      return {
        'vu-checkbox__container--active': this.isMarked,
        'vu-checkbox__container--disabled': this.disabled,
      }
    },
    markClasses() {
      return {
        'vu-checkbox__mark--active': this.isMarked,
        'vu-checkbox__mark--disabled': this.disabled,
      }
    },
  },

  props: {
    disabled: Boolean,
    label: String,
    tabindex: {
      type: [Number, String],
      default: () => 0,
    },
    checkValue: {
      type: null,
      default: () => null,
    },
    value: {
      type: null,
      default: () => false,
    },
  },
}
</script>

<style lang="stylus">
.vu-checkbox
  cursor pointer
  display inline-flex
  align-items center
  user-select none

  &--disabled
    cursor default
    pointer-events none

    .vu-checkbox__label
      color $disabled-color
      user-select none

  &__input
    display none

  &__label
    font-size 14px
    padding-left 16px

  &__container
    width 1em
    height 1em
    font-size 20px
    border 1px solid rgba(#000, 0.2)

    &:focus
      border-color $primary-color
      border-width 2px

      .vu-checkbox__mark--active
        background darken($primary-color, 10)

    &:hover
      border-color rgba(#000, 0.4)

    &--active
      border-color $primary-color
      border-width 2px

      &:hover, &:focus
        border-color darken($primary-color, 10)

    &--disabled
      border-color $disabled-color

  &__mark
    background $primary-color
    height 100%
    width 100%
    transform-origin center center
    transform scale(0)
    transition --transition(), --transition(opacity)
    color #fff
    display flex
    justify-content center
    align-items center
    opacity 0
    font-size 0.6em

    &--active
      transform scale(1)
      opacity 1

      &:hover
        background darken($primary-color, 10)

    &--disabled
      background $disabled-bg
      color $disabled-color
</style>
