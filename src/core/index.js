import '@/core/base/index.styl'
import isValid from './mixins/isValid'

export default {
  name: 'core',

  install(Vue) {
    Vue.mixin(isValid)
  },
}
