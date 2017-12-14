<template lang="pug">
  .vu-cell(:style="styleObject" :class="classObject")
    slot
</template>

<script>
export default {
  name: 'cell',

  computed: {
    isPadding() {
      if (this.px) return `0 ${this.px}px`
      if (this.py) return `${this.py}px 0`
      if (this.pa) return `${this.pa}px`
      if (this.pr) return `0 ${this.pr}px 0 0`
      if (this.pl) return `0 0 0 ${this.pl}px`
      return 0
    },
    classObject() {
      return {
        'vu-cell--center': this.center,
        'vu-cell--start': this.start,
        'vu-cell--end': this.end,
      }
    },
    styleObject() {
      return {
        padding: this.isPadding,
        width: `calc(${100 / this.$parent.size}% - ${this.$parent.gutter}px)`,
      }
    },
  },

  props: {
    pr: [String, Number],
    pl: [String, Number],
    pa: [String, Number],
    px: [String, Number],
    py: [String, Number],
    end: Boolean,
    start: Boolean,
    center: Boolean,
  },
}
</script>

<style lang="stylus">
.vu-cell
  flex 0 0 auto

  &--center
    align-self center

  &--end
    align-self flex-end

  &--start
    align-self flex-start
</style>
