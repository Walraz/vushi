<template lang="pug">
  button.vu-button(:class="classes" @click="onClick" :disabled="disabled" :data-loading="loading" :tabindex="setTabindex")
    transition(name="vuScale")
      .vu-button__loading(v-if="loading")
        slot(name="loading")
          Spinner
    .vu-button__content
      .vu-button__icon(v-if="$slots.icon")
        slot(name="icon")
      .vu-button__label
        slot Button
    .vu-button__hover(v-if="!loading && !disabled")
</template>

<script>
import Spinner from '@/components/Spinner'
export default {
  name: 'button',

  components: {
    Spinner,
  },

  computed: {
    classes() {
      return {
        'vu-button--full': this.fullWidth,
      }
    },
    setTabindex() {
      return this.loading || this.disabled ? this.tabindex : 0
    },
  },

  methods: {
    onClick(e) {
      this.$emit('click', e)
      this.$el.blur()
    },
  },

  props: {
    disabled: Boolean,
    loading: Boolean,
    fullWidth: Boolean,
    tabindex: {
      type: [Number, String],
      default: () => 0,
    },
  },
}
</script>

<style lang="stylus">
.vu-button
  border 0
  cursor pointer
  position relative
  vertical-align top
  display inline-flex
  align-items center
  overflow hidden
  flex-direction column
  user-select none
  height 1em
  background $default-color
  color #000
  font-size 40px
  min-width 1em
  border-radius 0
  padding-left 0.4em
  padding-right 0.4em
  overflow hidden

  &--circle
    border-radius 50%

  &--full
    flex-grow 1
    width 100%
    display flex

  &__loading
    font-size 0.7em
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    display flex
    align-items center
    justify-content center

  &__icon
    display inline-flex
    align-items center
    margin-left -0.2em

  &__label
    font-weight 600
    text-transform capitalize
    white-space nowrap
    display inline-flex
    align-items center

  &__content
    font-size 14px
    display inline-flex
    justify-content center
    position relative
    top 0
    left 0
    flex 1
    width 100%
    height 100%
    z-index 2
    pointer-events none
    transition --transition(opacity), --transition()

    > .vu-button__icon
      padding-right 8px

  &[data-loading='true']
    pointer-events none

    > .vu-button__content
      opacity 0
      transform translateY(8px)

  &__hover
    position absolute
    z-index 1
    top 0
    left 0
    width 100%
    height 100%
    background #000
    opacity 0
    transition --transition(opacity), --transition(background)

  &:focus .vu-button__hover
    opacity 0.1

  &:hover .vu-button__hover
    opacity 0.2

  &:active .vu-button__hover
    opacity 0.3

  &:disabled
    cursor default
    background $disabled-bg
    border-color $disabled-bg

    > .vu-button__content
      color $disabled-color
</style>
