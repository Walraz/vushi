<template lang="pug">
  .vu-grid(:style="styleObject" :class="classObject")
    slot
</template>

<script>
export default {
  name: 'grid',

  computed: {
    classObject() {
      return {
        'vu-grid--around': this.around,
        'vu-grid--between': this.between,
        'vu-grid--center': this.center,
        'vu-grid--grid-center': this.gridCenter,
        'vu-grid--end': this.end,
      }
    },

    styleObject() {
      return {
        maxWidth: this.maxWidth ? `${this.maxWidth}px` : '100%',
      }
    },
  },

  props: {
    gridCenter: Boolean,
    center: Boolean,
    end: Boolean,
    around: Boolean,
    between: Boolean,
    maxWidth: [String, Number],
    size: {
      type: Number,
      default: () => 1,
    },
    gutter: {
      type: [Number, String],
      default: () => 0,
    },
  },
}
</script>

<style lang="stylus">
.vu-grid
  display flex
  flex-wrap wrap
  width 100%

  &--grid-center
    margin 0 auto

  &--between
    justify-content space-between

  &--around
    justify-content space-around

  &--center
    justify-content center

  &--end
    justify-content flex-end

  @media (max-width: 420px)
    display block

    .vu-cell
      width 100% !important
</style>

