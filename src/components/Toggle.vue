<script>
import Checkbox from './Checkbox'
export default {
  name: 'toggle',

  extends: Checkbox,

  data() {
    return {
      toggle: true,
    }
  },
}
</script>

<style lang="stylus">
.vu-toggle
  &__container
    width 2em
    border-radius 1em
    display flex
    align-items center
    border-width 2px
    transition --transition(background)

    &:focus
      border-color $primary-color
      border-width 2px

      .vu-checkbox__mark--active
        background #fff

    &--active
      background $primary-color

      &:hover
        background darken($primary-color, 10)

      &:focus
        border-color darken($primary-color, 10)
        background darken($primary-color, 10)

  &__mark
    font-size 20px
    background #444
    height 0.6em
    width 0.6em
    border-radius 50%
    transform-origin center center
    transform translateX(2px)
    transition --transition(), --transition(background)
    display flex
    justify-content center
    align-items center
    opacity 1
    color transparent
    i
    display none

    &--active
      transform translateX(calc(2px + 1em))
      background #fff

      &:hover
        background #fff
</style>
