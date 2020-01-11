import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.prototype.$language = {
  JP: 'ja-Hrkt',
  DE: 'de'
};
new Vue({
  render: h => h(App),
}).$mount('#app')
