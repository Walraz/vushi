<template lang="pug">
  .vu-spinner
    svg.vu-spinner__svg(viewBox="25 25 50 50")
      circle.vu-spinner__circle(cx="50" cy="50" r="20" :stroke="color" stroke-width="4" fill="none" stroke-miterlimit="10")
</template>

<script>
export default {
  name: 'spinner',

  props: {
    color: {
      type: String,
      default: () => 'currentColor',
    },
  },
}
</script>

<style lang="stylus">
$size = 1em

.vu-spinner
  display flex
  flex-grow 0
  flex-shrink 0
  align-items center
  justify-content center
  user-select none

  &__svg
    animation vu-animation--rotate 2s linear infinite
    transform-origin center center
    will-change transform
    height $size
    width $size

  &__circle
    stroke-dasharray 1, 200
    stroke-dashoffset 0
    stroke-linecap round
    animation vu-animation--dash 1.5s ease-in-out infinite

@keyframes vu-animation--rotate
  100%
    transform rotate(360deg)

@keyframes vu-animation--dash
  0%
    stroke-dasharray 1, 200
    stroke-dashoffset 0

  50%
    stroke-dasharray 89, 200
    stroke-dashoffset -35px

  100%
    stroke-dasharray 89, 200
    stroke-dashoffset -124px
</style>
