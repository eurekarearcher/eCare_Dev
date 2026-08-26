import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
// import mixin from '@/mixin'
import auth_routes from '@/router/auth/index'
import PageNotFound from '@/views/PageNotFound'
import WelcomePage from '@/views/WelcomePage'
import test_routes from '@/router/test_routes/index'
//ECLAIMS
import eclaims_routes from '@/router/eclaims/index'
// ADMIN
import admin_routes from '@/router/admin/index'
// EMR
import emr_routes from '@/router/emr/index'
//PHARMACIST
import pharmacy_routes from '@/router/pharmacy/index'
//USER-DELETION
import user_routes from '@/router/user/index'

import pre_consultation_routes from '@/router/nurse-station/index'
import prv_facility_routes from '@/router/prv_facility/index'
import prv_facility_diagnostic_routes from '@/router/prv_facility/diagnostic/index'
import prv_facility_pharmacy_routes from '@/router/prv_facility/pharmacy/index'

Vue.use(VueRouter)

const routes = [
  //EMR
  ...emr_routes,
  
  // ADMIN
  ...admin_routes,

  //ECLAIMS
  ...eclaims_routes,
    
  //USER
  ...user_routes,
    
  ...auth_routes,
  
  //Admission / CONSULTATION PAGE
  ...pre_consultation_routes,

  //PHARMACIST
  ...pharmacy_routes,

  {
    path: '/page-not-found',
    name: 'PageNotFound',
    component: PageNotFound, 
  },

  ...prv_facility_routes,

  ...prv_facility_diagnostic_routes,

  ...prv_facility_pharmacy_routes,

  ...test_routes,

  {
    path: '/welcome-page/:provider/:department',
    name: 'WelcomePage',
    component: WelcomePage, 
    beforeEnter: (to,from,next) => {
      if(store.state.prv_data){
        next()
      } else {
        next(false)
      }
    }
  },

  {path:'*', redirect: '/page-not-found'},

]

const router = new VueRouter({
  mode: 'hash',
  // base: process.env.BASE_URL,
  routes
})

// const user = store.state.usr_credentials;

// if(user) {
//   router.beforeEach(async(to, from, next) => {
//     let device_ip = await mixin.methods.getDeviceIPAdd()
//     if(user){
//       if(device_ip[0] !== user?.user_ip_add) {
//         mixin.methods.webCookies('delete', 'QR5YP')
//         localStorage.clear()
//         sessionStorage.clear()
//         window.location.reload();
//       }
//     }
  
//     next();
//   });
// }

export default router
