<template lang="pug">
  .vu-textfield-icon(v-if="!$parent.disabled")
    transition(name="vuDropdown" mode="out-in")
      Icon(@click="visibilityFn" class="vu-textfield-icon--pointer" v-if="icon === 'visibility' && visibilityShow" :key="visibilityShow") visibility
      Icon(@click="visibilityFn" class="vu-textfield-icon--pointer" v-else-if="icon === 'visibility' && !visibilityShow") visibility_off
      Icon(@click="clearFn" v-else-if="clearShow" :key="clearShow" class="vu-textfield-icon--pointer") cancel
      Icon(@click="dropdownFn" v-else-if="!clearShow && $parent.options && !$parent.inputIsFocused" :key="$parent.inputIsFocused" class="vu-textfield-icon--pointer") keyboard_arrow_down
      Icon(@click="dropdownFn" v-else-if="!clearShow && $parent.options && $parent.inputIsFocused" class="vu-textfield-icon--pointer") keyboard_arrow_up
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
      isPasswordType: true,
    }
  },

  computed: {
    transition() {
      if (this.icon === 'dropdown') return 'vuDropdown'
      return this.iconTransition
    },
    clearShow() {
      if (
        this.icon === 'clear' &&
        this.$parent.multiple &&
        this.$parent.inputValue.length
      )
        return true
      return this.icon === 'clear' && this.$parent.searchInput.length > 0
    },
    visibilityShow() {
      return this.isPasswordType
    },
    dropdownShow() {
      return this.$parent.inputIsFocused
    },
  },

  methods: {
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
      this.$parent.$refs.input.focus()
    },
  },

  props: {
    icon: String,
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

.vu-textfield-icon-dropdown
  transition --transition()

  &--up
    transform rotate(180deg)
</style>

