<template>
  <div v-if="!transaction_active">
    <!-- NAVBAR -->
    <v-app-bar v-resize="onResize" class="d-print-none" style="z-index:4" app>

      <v-toolbar-title class="ml-3">
        <span class="nav-color" v-if="$store.state.prv_data">{{ $store.state.prv_data.system_name }}</span>
        <span class="font-weight-light" v-if="$store.state.prv_data"> System</span>
        <h6 v-if="usr_credentials" class="body-2 font-weight-light mb-n1" >
          <span v-for="nav in nav_departments"  v-show="usr_credentials.department == nav.department" :key="nav.department">
            {{nav.name}}
          </span>
        </h6>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="mobile && nav_restriction" @click="open_drawer = !open_drawer" icon dark class="nav-color"><v-icon large>mdi-menu</v-icon></v-btn>

      <!-- NAVIGATIONS -->
      <v-btn v-show="!mobile" v-for="nav in get_navbar" :key="nav.title"  :to="nav.link" class="nav-color" router text ref="nav_button">
          <v-icon left small>{{ nav.icon }}</v-icon>
          <template v-if="teleconsult_patient !== 0"> 
            <template v-if="nav.title === 'TELEMEDICINE ASSISTED PATIENTS'"> 
              <v-badge color="error" dot> {{ nav.title }} </v-badge>
            </template>
            <template v-else> 
              {{ nav.title }}
            </template>
          </template>
          <template v-else> 
            {{ nav.title }}
          </template>
      </v-btn>

      <div v-if="usr_credentials && !mobile">
        <v-menu v-if="usr_credentials.user_roles.length > 1" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" class="nav-color" text>Department<v-icon medium>mdi-menu-down</v-icon></v-btn>
          </template>
          <v-list>
            <v-list-item v-for="nav in usr_credentials.user_roles" v-show="usr_credentials.department !== nav.department"  @click="confirmChangeDepartment(nav.department, nav.department)" :key="nav.user_type">
              <v-list-item-title><v-icon left small>mdi-folder</v-icon>{{nav.department}}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      
      <template v-if="usr_credentials && !mobile">
         <template v-if="$store.state.usr_credentials && $store.state.usr_credentials.department === 'Credit and Collection'">
          <v-btn v-if="$route.path === '/medical-transaction-report'" to="/eclaims-patient-list" class="nav-color" text> 
            <v-icon small left>fas fa-folder</v-icon>Claims Patient List
          </v-btn>
          <v-btn v-if="$route.path === '/eclaims-patient-list'" to="/medical-transaction-report" class="nav-color" text> 
            <v-icon small left>mdi-folder-open</v-icon>REPORTS
          </v-btn>
        </template>

        <!-- SUPERUSER NAVIGATION-->
        <v-menu v-if="show_super_usr_nav" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" class="nav-color" text>Department<v-icon medium>mdi-menu-down</v-icon></v-btn>
          </template>
          <v-list>
            <v-list-item v-for="nav in nav_departments"  v-show="usr_credentials.department !== nav.department" @click="confirmChangeDepartment(nav.department,nav.name)" :key="nav.department"  >
              <v-list-item-title><v-icon left small>{{nav.icon}}</v-icon>{{nav.name}}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- NAVIGATION DRAWER -->
    <v-navigation-drawer v-if="mobile && nav_restriction" v-model="open_drawer" height="100%" disable-resize-watcher app>
      <v-list-item-content class="py-1">
        <v-list-item-title class="text-h6 text-center">
          <span class="nav-color" v-if="$store.state.prv_data">{{ $store.state.prv_data.system_name }}</span>
          <span class="font-weight-light" v-if="$store.state.prv_data"> System</span> </v-list-item-title>
        <v-list-item-subtitle class="text-center">{{prv_data.provider_name}}</v-list-item-subtitle>
      </v-list-item-content>

      <v-divider></v-divider>

      <v-list-item v-if="usr_credentials" class="mt-1">
        <v-list-item-avatar class="mx-0 ml-1">
            <v-icon x-large>mdi-account-circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-content class="ml-6">
            <v-list-item-title class="font-weight-medium transform-text body-2 text-uppercase">{{ usr_credentials.user_name }}</v-list-item-title>
            <v-list-item-subtitle class="caption">{{usr_credentials.department}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      
      <v-list-group v-if="usr_credentials.user_roles.length > 1" value="false" color="none" no-action>
          <template v-slot:activator>
              <v-list-item-content>
                  <v-list-item-title class="body-2">Department</v-list-item-title>
              </v-list-item-content>
          </template>
          <v-list>
            <v-list-item v-for="nav in usr_credentials.user_roles" v-show="usr_credentials.department !== nav.department"  @click="confirmChangeDepartment(nav.department, nav.department)" :key="nav.user_type"  >
              <v-list-item-title><v-icon left small>mdi-folder</v-icon>{{nav.department}}</v-list-item-title>
            </v-list-item>
          </v-list>
      </v-list-group>
      <v-divider></v-divider>

      <v-list-item  v-for="nav in navbar" :key="nav.title" :to="nav.link">
        <v-list-item-title class="nav-item-mobile"><v-icon color="#01579b" left small>{{ nav.icon }}</v-icon>{{nav.title}}</v-list-item-title>
      </v-list-item>

      <!-- PROVIDER REPORTS AND PATIENT LIST OF CREDIT AND COLLECTION -->
      <template v-if="$store.state.usr_credentials && $store.state.usr_credentials.department === 'Credit and Collection'">
        <v-list-item v-if="$route.path === '/medical-transaction-report'" to="/eclaims-patient-list" >
          <v-list-item-title class="nav-item-mobile"><v-icon color="#01579b" left small>fas fa-folder</v-icon>Claims Patient List</v-list-item-title>
        </v-list-item>
        <v-list-item >
          <v-list-item-title class="nav-item-mobile" ><v-icon color="#01579b" left small>mdi-folder-open</v-icon>Reports</v-list-item-title>
        </v-list-item>
      </template>

      <div  v-if="usr_credentials && usr_credentials.user_type === '2-4'">
        <h6 class="px-3 text-caption  font-weight-medium my-2">DEPARTMENT</h6>
        <v-divider></v-divider>

        <v-list-item v-for="nav in nav_departments"  v-show="usr_credentials.department !== nav.department" @click="confirmChangeDepartment(nav.department,nav.name)" :key="nav.department">
          <v-list-item-title class="nav-item-mobile"><v-icon color="#01579b" left small>{{nav.icon}}</v-icon>{{nav.name}}</v-list-item-title>
        </v-list-item>
        
        <v-divider></v-divider>
      </div>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="logout" color="#01579b" block  dark> Log out </v-btn>
          <h6 class="caption text-center mt-2" style="font-size:8pt !important" v-if="$store.state.prv_data.software_accre_type === 'eKARE System'">
            Version {{ $app_version }}
          </h6>

          <h6 class="caption text-center mt-2" style="font-size:8pt !important" v-else-if="$store.state.prv_data.software_accre_type === 'HEAROES HEALTH'">
            Version {{ $app_version }}
          </h6>
          <v-layout wrap justify-center>
            <label class="caption font-weight-regular align-self-end">POWERED BY:</label>
            <img :src="ek_gif" width="120">
          </v-layout>
        </div>
      </template>
      
    </v-navigation-drawer>
    
    <!-- FOOTER -->
    <v-footer v-if="!mobile && nav_restriction" app inset class="px-7 pt-3 pb-3 d-print-none">
      <v-row dense>
        <v-col sm="4" align-self="center">
          <label class="caption" >HEALTHCARE FACILITY: <span><b>{{prv_data.provider_name}}</b></span></label>
        </v-col>

        <v-col sm="4" align-self="center" class="text-center">
          <div class="d-flex align-center justify-center">
              <label class="pr-4 caption">OPERATOR: <span><b>{{ usr_credentials.user_name}}</b></span></label>
              <v-btn color="light-blue darken-4" outlined rounded @click="logout" x-small>Logout</v-btn>
              <div><Settings v-if="!['PVT-P', 'PVT-D'].includes(this.$store.state.usr_credentials.provider_reg_type)" /></div>
          </div>
        </v-col>

        <v-col sm="4">
          <v-row dense align="center" :justify="prv_data.phic_acc_no? $vuetify.breakpoint.lgAndDown? 'end' : 'space-between' :'end'">
            <template v-if="prv_data.phic_acc_no">
              <label :class="[$vuetify.breakpoint.lgAndDown? 'caption':'caption mx-4']" >PHIC ACCREDITATION NUMBER: <span><b>{{prv_data.phic_acc_no}}</b></span></label>

            </template>
            <div class="d-flex">    
              <label class="caption mt-3 ml-4" >POWERED BY:</label>
              <div>
                <img :src="ek_gif" width="155">
                <h6 class="font-weight-regular text-right" style="line-height:0">
                  Version {{ $app_version }}
                </h6>
              </div>
            </div>
          </v-row>
        </v-col>
      </v-row>    
      <HelpVideoIcon v-if="show_help_icon" :steps="this.steps"/>
    </v-footer>
    <Alert :alert="alert" @changeDepartment="changeDepartment"  @resultOnQueue="resultOnQueue" @webRegRedirect="webRegRedirect"/>
    <IdleTimer />
  </div>
</template>

<script>
import { mapState } from "vuex";
import IdleTimer from '@/components/IdleTimer.vue'
import Alert from '@/components/Alert.vue'
import Settings from '@/components/Setting.vue'
import HelpVideoIcon from '@/components/help-video/Main.vue'

export default {
  name: 'Navbar',
  props: ['navbar', 'help_menu', 'transaction_active', 'steps'],
  components: {Alert,IdleTimer,Settings,HelpVideoIcon},
  
  data () {
    return {
      // ALERTS
      alert:{},

      window_size: { x: 0, y: 0 },
      mobile: false,
      open_drawer:false,

      // NAVIGATION
      cac_nav:[
        {path: '/eclaims-patient-list', icon: 'fas fa-folder', name: 'Claims Patient List'},
        {path: '/medical-transaction-report', icon: 'mdi-folder-open', name: 'Reports'},
      ],

      nav_departments:   [
        {department: 'Admission', name: 'Frontdesk / Admission', icon: 'fas fa-person-booth'},
        {department: 'Nurse Station', name: 'eClaims - Nurse Station', icon: 'fas fa-user-nurse'},
        {department: 'Credit and Collection', name: 'eClaims - Credit and Collection', icon: 'fas fa-coins'},
        {department: 'Laboratory', name: 'Covid-19 Laboratory', icon: 'fas fa-vials'},
      ],

      // EK GIF
      ek_gif: require('../assets/ek.gif'),

      phic_ml_loading: false,
      process: sessionStorage.getItem("1abG571xlqp") ? this.$crypto.AES.decrypt(sessionStorage.getItem("1abG571xlqp"), "njGHDdd").toString(this.$crypto.enc.Utf8)  : null
    }
  },

  computed: {
    ...mapState(["usr_credentials", "prv_data", 'teleconsult_patient']),

    nav_restriction() {
      return this.$route.name !== 'Login' && this.$route.name !== 'ProviderRegistration' && this.$route.name !== 'WelcomePage'
    },

    show_super_usr_nav() {
      return this.usr_credentials.user_type === '2-4' && !this.$route.path.includes('/cf-forms') && !this.$route.path.includes('/input-forms') && !this.$route.path.includes('-result') 
    },

    get_navbar() {
      if(this.$route.path === '/patient-queue-list') {
        if(this.usr_credentials.department === 'Data Encoder') {
          return [
            { icon: 'mdi-folder', title: 'Patient Queue List', link: '/patient-queue-list' },
            { icon: 'mdi-home', title: 'Home', link: '/offline-transaction' }
          ]
        } else {
          return this.navbar
        }
      }

      return this.navbar
    },

    show_help_icon() { 
      return (this.steps === 1 && this.$store.state.usr_credentials.department != 'Data Encoder') || 
             (this.steps === 2 && this.$store.state.usr_credentials.department != 'Data Encoder') ||
             (this.steps === 3 && this.$store.state.usr_credentials.department != 'Data Encoder') ||
             (this.steps === 5 && this.$store.state.usr_credentials.department != 'Data Encoder') ||
             this.$route.path === '/code-scanning' ||
             this.$route.path === '/eligibility' ||
             this.$route.path === '/patient-queue-list'||
             this.$route.path === '/pharmacist/inventory'||
             this.$route.path === '/pharmacist/dispensing'||
             this.$route.path === '/pharmacist/transfer'||
             this.$route.path === '/pharmacist/received';
    }
  },

  methods: {
    // SHOW DIALOG FOR CHANGING USER DEPARTMENT
    confirmChangeDepartment(department,display){
      this.alert = { 
        display: true, 
        type: 'standard', 
        width: '550', 
        icon: 'mdi-help-circle', 
        color: 'blue darken-1', 
        title: 'This will redirect you to <br class="hidden-sm-and-up">'+display, 
        body: 'Do you want to proceed?', 
        btn_pry_txt: 'Okay', 
        btn_pry_color: 'primary', 
        btn_pry_otl: false, 
        btn_pry_act: 'loadingBtn',  
        btn_pry_emt: 'changeDepartment',
        btn_pry_params: department,
        btn_sec_txt: 'Cancel', 
        btn_sec_color: 'secondary', 
        btn_sec_otl: true, 
        btn_sec_act: 'closeAlert',
      }
    },

    //NAVIGATION ITEMS
    proceedToNav(nav) {
      if(this.steps === 5){
        this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow', title: 'Registration Incomplete', body: 'Please proceed if the card is printed or issued?', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      } else {
        this.$router.push(nav)
      }
    },

    // REDIRECTS TO OTHER DEPARTMENT
    changeDepartment(department) {
      let user_credentials = { ...this.usr_credentials, department: department, user_type: this.getUserType(department)}
    
      this.$store.commit('setUserCredentials', user_credentials)
     
      if(department === 'Admission'){
        if (this.$store.state.prv_data.hmo === 1 || this.$store.state.prv_data.lgu === 1) {
          this.$router.push('/code-scanning')
        }
      } else if(department === 'Doctor' || department === 'Midwife' || department === 'Medical Practitioner') {
        this.$router.push('/patient-queue-list')
      } else if(department === 'Nurse Station') {
        this.$router.push('/patient-list').then(() => location.reload());
      } else if(department === 'Credit and Collection'){
        this.$router.push('/eclaims-patient-list').then(() => location.reload());
      } else if(department === 'Pharmacist') {
        this.$router.push('/pharmacist/inventory')
      } else if (department === 'Laboratory') {
        this.$router.push('/covid-list')
      } else if(department === 'Data Encoder') {
        this.$router.push('/offline-transaction')
      } else if(department === 'Admin') {
        this.$router.push('/admin/registered-users')
      } else if(department === 'Diagnostic Laboratory') {
        this.$router.push('/diagnostic-laboratory')
      } else if(department === 'PVTPharmacist') {
        this.$router.push('/pvt-pharmacist')
      } else if(department === 'Medical Laboratory Technologists') {
        this.$router.push('/diagnostic-laboratory')
      } else {
        this.$router.push('/patient-list')
      }
    },

    getUserType(data) {
      if(data === 'Admission') {
        return '2-1'
      } else if(data === 'Doctor') {
        return '6-1'
      }  else if(data === 'Midwife') {
        return '7-1'
      } else if(data === 'Pharmacist') {
        return '8-1'
      } else if(data === 'Medical Practitioner') {
        return '2-5'
      } else if(data === 'Laboratory') {
        return '4-1'
      } else if(data === 'Nurse Station') {
        return '2-2'
      }  else if(data === 'Credit and Collection') {
        return '2-3'
      } else if(data === 'Admin') {
        return '5-1'
      } else if(data === 'Data Encoder') {
        return '9-1'
      } else if(data === 'Medical Laboratory Technologists') {
        return '10-1'
      } else {
        return ''
      }
    },

    // SHOW ALERT FOR LOGOUT
    logout (data) {
      if(data === 'users') {
        this.alert = { 
          display: true, 
          type:  'standard', 
          width: '450', 
          icon:  'mdi-help-circle', 
          color: 'blue darken-1', 
          title: 'This will logout your account', 
          body:  'Do you want to continue ?', 
          btn_pry_txt: 'Yes', 
          btn_pry_color:'primary',
          btn_pry_otl: false,
          btn_pry_act: 'loadingBtn',  
          btn_pry_emt: 'webRegRedirect',
          btn_sec_txt: 'No', 
          btn_sec_color: 'secondary', 
          btn_sec_otl: true, 
          btn_sec_act: 'closeAlert',
        }
      } else {

        if (this.$route.fullPath.includes('-result')) {
          this.alert = { 
            display: true, 
            type:  'standard', 
            width: '650', 
            icon:  'mdi-help-circle', 
            color: 'blue darken-1', 
            title: 'Transaction will be put on queue if you leave this page.', 
            body:  'Are you sure you want to log out?', 
            btn_pry_txt: 'Yes', 
            btn_pry_color:'secondary',
            btn_pry_otl: true,
            btn_pry_act: 'loadingBtn',  
            btn_pry_emt: 'resultOnQueue',
            btn_sec_txt: 'Stay on this Page', 
            btn_sec_color: 'primary', 
            btn_sec_otl: false, 
            btn_sec_act: 'closeAlert',
          }
        } else if (this.$route.fullPath === '/registration') { 
          this.alert = { 
            display: true, 
            type:  'standard', 
            width: '450', 
            icon:  'mdi-help-circle', 
            color: 'blue darken-1', 
            title: 'This will logout your account', 
            body:  'Do you want to continue ?', 
            btn_pry_txt: 'Yes', 
            btn_pry_color:'primary',
            btn_pry_otl: false,
            btn_pry_act: 'loadingBtn',  
            btn_pry_emt: 'webRegRedirect',
            btn_sec_txt: 'No', 
            btn_sec_color: 'secondary', 
            btn_sec_otl: true, 
            btn_sec_act: 'closeAlert',
          }
        }else {
          this.alert = {  display: true,  type: 'logout',  width: '450' }
        }
      }
      
    },

    // CALL ONQUEUE FUNCTION IF NAVBAR IS IN RESULTS PAGE
    resultOnQueue() {
      this.$emit('onQueue','for-logout')
    },

    webRegRedirect() {
      this.$emit('redirect', 'for-logout')
    },

    onResize() {
      this.window_size = { x: window.innerWidth, y: window.innerHeight }

      if (this.window_size.x < 1440) {
        this.mobile = true;
      } else {
        this.mobile = false;
        this.open_drawer = false;
      }
    }
  },
}
</script>

<style scoped>
 .nav-color {
   color:#01579b !important;
   caret-color: #01579b !important
 }
 .nav-item-mobile {
    color: #212121 !important;
    caret-color: #212121 !important;
    font-weight: 400 !important;
    font-size:10.5pt;
 }
</style>