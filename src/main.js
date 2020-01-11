import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.prototype.$language = {
  JP: 'ja-Hrkt',
  EN: 'en',
  KO: 'ko',
  FR: 'fr',
  DE: 'de',
  ES: 'es',
  IT: 'it',
};
new Vue({
  render: h => h(App),
}).$mount('#app')
