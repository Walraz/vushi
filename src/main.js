import Core from '@/core'

export default {
  name: 'vushi',

  install(Vue) {
    Vue.prototype.$vuBus = new Vue({})
    Vue.use(Core)
  },
}
