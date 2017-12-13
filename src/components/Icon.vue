<template lang="pug">
  i.material-icons.vu-icon(:style="styles" @click="onClick")
    slot
</template>

<script>
export default {
  name: 'icon',

  computed: {
    styles() {
      return {
        color: this.color,
      }
    },
  },

  methods: {
    onClick(e) {
      this.$emit('click', e)
    },
  },

  props: {
    color: {
      type: String,
      default: () => 'currentColor',
    },
  },
}
</script>

<style lang="stylus">
.vu-icon
  font-size 1.25em
  user-select none
</style>
