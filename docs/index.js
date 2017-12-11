import Vue from 'vue'
import App from './App'
import Sushi from '@/main'

Vue.use(Sushi)

const app = new Vue({
  render: h => h(App),
})

app.$mount('#app')
