<script>
import Button from '@/components/Button'
export default {
  name: 'my-button',

  extends: Button,

  computed: {
    classes() {
      return {
        'su-button--primary': this.primary,
        'su-button--fab': this.fab,
      }
    },
  },

  props: {
    primary: Boolean,
    fab: Boolean,
  },
}
</script>

<style lang="stylus">
.su-button
  &--fab
    padding 0
    border-radius 50%
    font-size 56px
    background red
    color #fff

    .su-button__hover
      background #fff

  &--primary
    background dodgerblue
    color #fff
</style>
