import Vue from 'vue'
import Home from './views/Home.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Home)
}).$mount('#app')

