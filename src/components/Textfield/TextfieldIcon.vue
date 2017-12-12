<template lang="pug">
  .vu-textfield-icon(v-if="!$parent.disabled")
    transition(:name="transition" mode="out-in")
      Icon(@click.stop.default="$_iconFn" class="vu-textfield-icon--pointer" v-if="icon !== 'clear' && $_iconShow" :key="$_iconShow") {{ $_iconName }}
      Icon(@click.stop.default="$_iconFn" class="vu-textfield-icon--pointer" v-if="icon === 'clear' && icon !== 'dropdown' && $_iconShow") clear
      Icon(@click.stop.default="$_iconFn" class="vu-textfield-icon--pointer" v-else-if="icon === 'dropdown' && !$_iconShow") keyboard_arrow_up
      Icon(@click.stop.default="$_iconFn" class="vu-textfield-icon--pointer" v-else-if="icon === 'visibility' && !$_iconShow") visibility_off
</template>

<script>
import Icon from '@/components/Icon'

export default {
  name: 'textfield-icon',

  components: {
    Icon,
  },

  data() {
    return {
      $_iconName: '',
      isPasswordType: true,
    }
  },

  created() {
    this.$_iconName = this.iconName || this.icon
    switch (this.icon) {
      case 'dropdown':
        this.$_iconFn = this.iconFn || this.dropdownFn
        this.$_iconName = this.iconName || 'keyboard_arrow_down'
        break
      case 'clear':
        this.$_iconFn = this.iconFn || this.clearFn
        break
      case 'visibility':
        this.$_iconFn = this.iconFn || this.visibilityFn
        break
      default:
        this.$_iconFn = this.iconFn || this._iconFn
    }
  },

  computed: {
    transition() {
      if (this.icon === 'dropdown') return 'vuDropdown'
      return this.iconTransition
    },
    clearShow() {
      if (this.$parent.multiple) {
        return (
          Array.isArray(this.$parent.inputValue) &&
          this.$parent.inputValue.length
        )
      }
      if (this.$parent.options) return this.$parent.inputLabel.length
      return this.$parent.searchInput.length
    },
    visibilityShow() {
      return this.isPasswordType
    },
    dropdownShow() {
      return !this.$parent.$data.showDropdown
    },
    $_iconShow() {
      if (this.icon === 'clear') return this.clearShow
      if (this.icon === 'visibility') return this.visibilityShow
      if (this.icon === 'dropdown') return this.dropdownShow
      else return this.iconShow
    },
  },

  methods: {
    _iconFn() {},
    dropdownFn() {
      this.$emit('dropdown')
    },
    clearFn() {
      this.$emit('clear')
    },
    visibilityFn() {
      const inputType = this.$parent.$refs.input.type
      this.isPasswordType = inputType === 'text'
      this.$parent.$refs.input.type = !this.isPasswordType ? 'text' : 'password'
    },
  },

  props: {
    icon: String,
    iconName: String,
    iconShow: Boolean,
    iconTransition: {
      type: String,
      default: () => 'vuScale',
    },
    iconFn: Function,
  },
}
</script>

<style lang="stylus">
.vu-textfield-icon
  font-size 1em
  padding 8px
  display flex
  align-items center
  justify-content center
  color rgba(#000, 0.6)

  &--pointer
    cursor pointer
</style>

