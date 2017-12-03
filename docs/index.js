import Vue from 'vue'
import App from './App'
import Sushi from '../dist/core'

Vue.use(Sushi)

const app = new Vue({
  render: h => h(App),
})

app.$mount('#app')
