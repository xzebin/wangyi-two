import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from "./router/index.js";
import Meta from "vue-meta";
Vue.use(Meta);
Vue.use(ElementUI);
Vue.prototype.$eventBus = new Vue();
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
