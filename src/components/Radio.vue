<template lang="pug">
  label.vu-radio
    input.vu-radio__input(type="radio" :disabled="disabled" ref="radio" :value="radioValue" v-model="inputValue" tabindex="-1")
    div(:class="containerClasses" :tabindex="tabindex"  @keydown.enter="select")
      div(:class="markClasses")
    div.vu-radio__label(v-if="label" v-html="label")
</template>

<script>
export default {
  name: 'radio',

  methods: {
    onClick() {
      this.$emit('click')
    },
    select() {
      this.$refs.radio.click()
    },
  },

  computed: {
    isMarked() {
      return this.inputValue === this.radioValue
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
      return [
        'vu-radio__container',
        this.isMarked && 'vu-radio__container--active',
        this.disabled && 'vu-radio__container--disabled',
      ]
    },

    markClasses() {
      return [
        'vu-radio__mark',
        this.isMarked && 'vu-radio__mark--active',
        this.disabled && 'vu-radio__mark--disabled',
      ]
    },
  },

  props: {
    disabled: Boolean,
    label: String,
    tabindex: {
      type: [Number, String],
      default: () => 0,
    },
    radioValue: {
      type: null,
      default: () => null,
    },
    value: {
      type: null,
      default: () => null,
    },
  },
}
</script>

<style lang="stylus">
.vu-radio
  cursor pointer
  display inline-flex
  align-items center
  user-select none

  &--disabled
    cursor default
    pointer-events none

    .vu-radio__label
      color $disabled-color
      user-select none

  &__input
    display none

  &__label
    font-size 14px
    padding-left 8px
    padding-right 16px

  &__container
    width 1em
    height 1em
    font-size 20px
    border-radius 50%
    display flex
    justify-content center
    align-items center
    border 2px solid rgba(#000, 0.2)

    &:focus
      border-color $primary-color
      border-width 2px

      .vu-radio__mark--active
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
    height calc(100% - 4px)
    width calc(100% - 4px)
    border-radius 50%
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
