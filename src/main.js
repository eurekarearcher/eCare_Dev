import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mixin from './mixin'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import * as CryptoJS from 'crypto-js'
import * as qs from 'qs';
import VueCookie from 'vue-cookie'
import moment from 'moment'
import excel_file from 'write-excel-file'
import { services } from './services'
import { getPDFs } from './reference/eclaims-forms/main'
import package_json from '../package.json' 

let node_env = ['DEV', 'QA']

// Vue.use(Print)
Vue.use(VueCookie)
Vue.config.productionTip = false
Vue.prototype.$crypto = CryptoJS;
Vue.prototype.$qs = qs;
Vue.prototype.$moment = moment;
Vue.prototype.$axios = axios;
Vue.prototype.$excel_file = excel_file;
Vue.prototype.$services = services
Vue.prototype.$get_pdf_forms = getPDFs
Vue.prototype.$tms_url = services.base_url.tms
Vue.prototype.$cms_url = services.base_url.cms
Vue.prototype.$process_env = process.env.VUE_APP_ENV
Vue.prototype.$eclaims_available = node_env.includes(Vue.prototype.$process_env) ? true : false // REMOVE THIS IF ECLAIMS IS AVAILABLE IN PRODUCTION SAME WITH UserRegistration.vue (mounted)

// Display version
Vue.prototype.$app_version = package_json.version

// GLOBAL FUNCTION
Vue.mixin({
  ...mixin
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
