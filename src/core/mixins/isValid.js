export default {
  data() {
    return {
      $_textfields: [],
    }
  },
  methods: {
    $_isValid() {
      const children = []
      function getChildren(child) {
        if (child.$_validate) children.push(child)
        if (child.$children && child.$children.length)
          child.$children.forEach(getChildren)
      }

      this.$children.map(getChildren)

      const isError = children.some(c => c.$_validate.error)

      if (isError) {
        children.forEach(child => {
          child.isDirty = true
        })
      }
      return !isError
    },
  },
}
