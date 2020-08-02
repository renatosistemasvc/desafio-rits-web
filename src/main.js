import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import moment from 'moment'
import * as CONSTANTS from '@/constants'

window.eventBus = new Vue();

Vue.config.productionTip = false

//VARIÁVEIS GLOBAIS
Vue.prototype.$CONSTANTS = CONSTANTS;
Vue.prototype.$axios = axios;
Vue.prototype.$moment = moment;
Vue.prototype.$requiredBlur = { required: true, message: 'Campo obrigatório.', trigger: 'blur'};
Vue.prototype.$requiredChange = { required: true, message: 'Campo obrigatório.', trigger: 'change'};
Vue.prototype.$emailBlur = { type: 'email', message: 'E-mail inválido.', trigger: 'blur' };

import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/pt'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI, { locale });

import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

import money from './shared/moneys'
Vue.use(money, {precision: 4})

import cPanel from './shared/c-panel/c-panel'
Vue.component('c-panel', cPanel);

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
