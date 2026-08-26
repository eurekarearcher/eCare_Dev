<template>
  <v-container fluid fill-height>
    <Navbar/>
    <v-col v-if="$store.state.prv_data" cols="12" class="d-flex justify-space-between logo-div">
        <v-img v-if="$store.state.prv_data.software_accre_logo" :src="$store.state.prv_data.software_accre_logo"  :max-width="$vuetify.breakpoint.name === 'xl' ? '250' : '200'" contain></v-img>
    </v-col>
    <v-layout row wrap justify-center align-center mt-3 mt-sm-0>
      <div>
          <v-img src="../assets/ek.gif" width="75%" class="mb-3 mx-auto"></v-img>
          <v-card class="text-center pa-5" width="350">
            <v-card-title class="headline light-blue--text text--darken-4 justify-center mb-3">LOGIN</v-card-title>
            <v-text-field v-model="username" @paste="handlePaste($event, 'username')" @keyup.enter="login" name="username" label="Username" maxlength="50" dense outlined></v-text-field>
            <v-text-field v-model="password" @paste="handlePaste($event, 'password')" @keyup.enter="login" name="password" type="password" label="Password"  maxlength="30" dense outlined></v-text-field>
            <v-btn @click="login" :loading="loading" class="white--text mt-3 mb-10" color="light-blue darken-4" large block>Submit</v-btn>
          </v-card>
      </div>
    </v-layout>

    <v-dialog v-model="dialog"  width="450px" persistent>
      <v-card>
        <v-layout wrap class="pa-5 flex-column">
        <v-card-title class="headline light-blue--text text--darken-4 justify-center mb-3">ADMIN LOGIN</v-card-title>  
        <v-text-field v-model="admin_username" @paste="handlePaste($event, 'admin_username')" label="Username" maxlength="50" dense outlined></v-text-field>
        <v-text-field v-model="admin_password" @paste="handlePaste($event, 'admin_password')" @keyup.enter="adminLogin" name="password" type="password" label="Password" maxlength="30" dense outlined></v-text-field>
        <v-btn @click="adminLogin" :loading="admin_loading" class="white--text mt-5 mb-8" color="light-blue darken-4" large block>Submit</v-btn>
        </v-layout>
      </v-card>
    </v-dialog>

    <v-dialog v-if="show_validate_location" v-model="show_validate_location" width="550" persistent>
      <v-card class="d-flex flex-column align-center justify-center py-8">
        <v-progress-circular indeterminate color="primary" :size="50"></v-progress-circular>
        <v-card-title class="justify-center text-uppercase mb-2 font-weight-medium text-sm-subtitle-1">Please wait while we validate your location</v-card-title>
      </v-card>
    </v-dialog>

    <!-- START DB PROVIDER LIST -->
    <!-- <v-dialog v-model="dialog_db_provider"  width="400px" persistent>
      <v-card>
        <v-layout wrap class="pa-5 flex-column">
        <v-card-title class="headline light-blue--text text--darken-4 justify-center mb-3">Select Database Provider</v-card-title>
        {{$store.state.select_db_provider}}
        <v-autocomplete v-model="select_db_provider" :items="db_provider_list" :error="!select_db_provider" :error-messages="db_provider_error" item-text="provider_name" return-object placeholder="Select Database Provider" outlined dense/>
        <v-btn @click="setSelectedDbProvider" :loading="admin_loading" class="white--text mt-2" color="light-blue darken-4" large block>Proceed</v-btn>
        </v-layout>
      </v-card>
    </v-dialog>

    <v-dialog v-if="dialog_save_db_provider" v-model="dialog_save_db_provider" width="550" persistent>
      <v-card class="d-flex flex-column align-center justify-center py-8">
        <v-progress-circular indeterminate color="primary" :size="50"></v-progress-circular>
        <v-card-title class="justify-center text-uppercase mb-2 font-weight-medium text-sm-subtitle-1">Saving your selected database provider. Please wait... </v-card-title>
      </v-card>
    </v-dialog> -->
    <!-- END DB PROVIDER LIST -->
  
    <Alert :alert="alert" @adminDialog="adminDialog" @terminalRegister="terminalRegister" ref="alerts"/>
  </v-container>
</template>

<script>
import Navbar from "@/components/Navbar";
import Alert from '@/components/Alert.vue'

export default {
  name: 'Login',
  components: {
    Navbar,
    Alert,
  },

  data() {
    return {
      username: "",
      password: "",
      admin_username: "",
      admin_password: "",
      loading: false,
      admin_loading: false,
      alert_dialog: false,
      alert: {},
      min: "",
      sec: "",

      dialog:false,
      credential_data:{},

      latitude:'',
      longitude:'',
      registration_id:'',
      provider_name:'',
      provider_province: '',
      healthcard_id: '',

      prv_result_timeout:'',
      key: '',
      
      show_validate_location: false,
      show_logo: false,

      software_accre_logo: '',
      software_accre_type: '',
      system_name: '',
      mem_search_option: '',
      separate_ekas_epress: '',
      
      //DB PROVIDER
      // db_provider_list: [],
      // select_db_provider: null,
      // dialog_db_provider:true,
      // dialog_save_db_provider:false,
      // db_provider_error: ""
    };
  },

  created() {
    // ON PAGE LOAD, VALIDATE
    sessionStorage.clear(); 

    //GET DB PROVIDER LIST
    //this.getDbProviderlist()
  },

  methods: {

  // Calling a function that will validate the user credentials.
  async login() {
      if (! this.username || !this.password) return this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Field is empty/Invalid Value', body: 'Please enter your username and password', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      this.loading = true;
      let password = this.$crypto.SHA1(this.password).toString();

      let credential_response = await this.$services.getUserCredential(this.username, password)

      if (credential_response.status === 200) {
        if (!credential_response.data.has_data) {
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Invalid Username or Password', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            this.loading = false;
            return 
        } 

        credential_response.data = this.responseDataDecryption(credential_response.data)
        // VALIDATE IF TERMINAL IS ALREADY REGISTERED
        if (this.$store.state.prv_data?.provider_code === credential_response.data.O34CD) {
          this.callUsrValidateUser(credential_response.data, this.username, password)

          this.$store.dispatch('setPrvKey', credential_response.data.ADBK2)
          // this.$store.dispatch('setPrvKey', null)
          this.$store.dispatch('setSuperKey', credential_response.data.LKS5D)
          // this.$store.dispatch('setSuperKey', null)
        } else {
            this.$store.dispatch('setPrvKey', credential_response.data.ADBK2)
            // this.$store.dispatch('setPrvKey', null)
            this.$store.dispatch('setSuperKey', credential_response.data.LKS5D)
            // this.$store.dispatch('setSuperKey', null)
            // VALIDATE IF USER ACCOUNT OR ADMIN ACCOUNT
            if (credential_response.data.Z315C === '5-1' || credential_response.data.Z315C === '0-0') { // ADMIN ACCOUNTS
              let prv_tin_code = {
                provider_code  : credential_response.data.O34CD ? credential_response.data.O34CD : null,
                provider_tin   : credential_response.data.O627T ? credential_response.data.O627T : null,
                department     : credential_response.data.C516S ? credential_response.data.C516S : null,
                username       : credential_response.data.T141L
              }
              localStorage.setItem('PCR245',this.$crypto.AES.encrypt(JSON.stringify(prv_tin_code),"Sely14ae2fg"))
              this.$router.push('/provider-registration')
            } else { // USER ACCOUNTS
              this.loading = false;
              this.credential_data = credential_response.data
              this.alert = { display: true, type: 'standard', width: '450', icon: 'fas fa-exclamation-circle', color: 'yellow darken-1', title: 'Terminal is not registered', body: 'Please ask your admin or MIS to register this terminal', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'adminDialog'}
            }
        }   
      } else {
        this.loading = false;
        this.alert = credential_response.error
      }
    },

    // Checking if the user is currently logged in. If the user is logged in, it will display an alert with a countdown timer.
    async callUsrValidateUser(credentials, username, password) {
      if (this.$store.state.prv_data.phic == 0 && credentials.C516S === "Nurse Station" && credentials.C516S === "Credit and Collection") {
          this.loading = false;
          this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'User account priviledge is invalid', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          return
      }

      // Detect the device type
      let user_agent = navigator.userAgent;
      let device_type;
      if (/Mobi/i.test(user_agent)) {
        device_type = "Mobile";
      } else if (/Tablet|iPad/i.test(user_agent) || (/Android/i.test(user_agent) && !/Mobile/i.test(user_agent))) {
        device_type = "Tablet";
      } else {
        device_type = "Desktop";
      }

      if(credentials.ADBK2) {
        let response = await this.$services.usrValidateUser({
          case: "login",
          username: username,
          password: password,
          request_code: "RGJ6JF4ATK7R",
          device_used: device_type
        })
  
        if (response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
            if (response.data.status === '1' ) {
                this.callPrvConfig(credentials);
            } else {
              let remaining_time = response.data.remaining_time
              let split_time     = remaining_time.split(':')
              let get_seconds    = (+split_time[0]) * 60 + (+split_time[1])
              let timer          = get_seconds,minutes,seconds
  
              this.timerInterval = setInterval(() => {
                  minutes = parseInt(timer / 60, 10);
                  seconds = parseInt(timer % 60, 10);
                  minutes = minutes < 10 ? "0" + minutes : minutes;
                  seconds = seconds < 10 ? "0" + seconds : seconds;
                      
                  if (--timer < 0) {
                      location.reload();
                  }
  
                  this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'red', title: 'User is currently logged-in', body: "Please wait for "+minutes+":"+seconds+" then try again.", btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
              }, 1000);
              this.loading = false;
            } 
        } else {
          this.alert = response.error
        }
      } else {
        this.callPrvConfig(credentials);
      }
    },

   // Calling the store function getProviderConfig() and then it is committing the user credentials.
   // Checking the user's role and redirecting them to the appropriate page.
    async callPrvConfig(credentials) {
      // let IP_add = await this.getDeviceIPAdd()

      if(credentials.ADBK2) {
        await this.$store.dispatch('getProviderConfig') 
      }

     let user_roles = credentials.XC29R.map(data => {
      return {
          department: data.C516S,
          user_type: data.Z315C
        }
      })

      let user_credential = {
        password:  credentials.O119R,
        user_name: credentials.T141L,
        user_code: credentials.JX15Y,
        user_type: user_roles[0].user_type, //Always get the first user_type in the object
        user_roles: user_roles,
        acess_code: credentials.V6CHQ,
        department: user_roles[0].department, //Always get the first department in the object
        doctor_tin: credentials.D867T,
        doctor_code: credentials.D283C,
        provider_reg_type: credentials.FAW4H,
        user_complete_name : credentials.Y25RN,
        tel_no: credentials.TL8015,
        email: credentials.EM963,
        lgu_host_code: credentials.LU26U,
        user_settings: {
          display_filipino_word: credentials.N5DN5.X277C ? credentials.N5DN5.X277C : false,
          user_layout: credentials.N5DN5.Q68D3 ? credentials.N5DN5.Q68D3 : 'type_a',
          display_help: credentials.N5DN5.DSPH2 ? credentials.N5DN5.DSPH2 : false,
          save_as_pdf_disabled: credentials.N5DN5.SVPD1 ? credentials.N5DN5.SVPD1 : false,
          unit_conversion: credentials.N5DN5.UC9Z7 ? credentials.N5DN5.UC9Z7 : 'CU',
        },
        // user_ip_add: IP_add[0]
      }
      
      this.$store.commit('setUserCredentials', user_credential)
    
      if (user_credential.user_type === '5-1' || user_credential.user_type === '0-0') { // ADMIN ACCOUNTS 
         this.$router.replace("/admin/registered-users");
      } else if(user_credential.user_type === '6-1' || user_credential.user_type === '7-1' || user_credential.user_type === '2-5'){
        this.$router.push('/patient-queue-list')
      } else {
        if (user_credential.department === "Nurse Station") {
          this.$router.replace("/patient-list");
        } else if( user_credential.department === "Credit and Collection"){
          this.$router.replace('/eclaims-patient-list');
        } else if(user_credential.user_type === '4-1'){
          this.$router.replace('/covid-list');
        } else if (user_credential.user_type === '8-1') {
          this.$router.replace('/pharmacist/inventory')
        } else if (user_credential.user_type === '9-1') {
          this.$router.push('/offline-transaction')
        } else if (user_credential.user_type === '10-1') {
          this.$router.push('/diagnostic-laboratory')
        } else if (user_credential.user_type === '10-2') {
          this.$router.push('/pvt-pharmacist')
        } else {
          if (this.$store.state.prv_data.hmo === 1 || this.$store.state.prv_data.lgu === 1) {
             this.$router.replace({ name: "CodeScanning" })
          } else {
             this.$router.replace("/patient-list");
          }
        }
      }
    },

   // Opening a dialog box.
    adminDialog() {
      this.dialog = true
    },

    // A function that is called when the user clicks the submit button.
    // Validating the username and password of the admin user. 
    // Checking if the user is valid or not. If the user is valid, it will display a modal with a button that will trigger the function terminalRegister.
    async adminLogin() {
      if (this.admin_username || this.admin_password) {
        this.admin_loading = true
        let adm_password = this.$crypto.SHA1(this.admin_password).toString();

        let response = await this.$services.prvValidateAdminAcctReg({
            rovider_tin: this.credential_data.O627T,
            provider_code: this.credential_data.O34CD,
            username: this.admin_username,
            password: adm_password,
        })

        if(response.status === 200) {
          response.data =  this.responseDataDecryption(response.data)
          
          if (response.data.account_validate == 0) {
            this.admin_loading = false
             this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'Invalid Username or Password', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          } else {
            // if(window.location.protocol !== 'http:'){
              this.allowLocation();
            // }
            this.provider_name = response.data.prv_name ? response.data.prv_name  : ''
            this.provider_province = response.data.province ? response.data.province : ''
            this.healthcard_id = response.data.healthcard_id ? response.data.healthcard_id : ''
            this.software_accre_logo = response.data.software_accre_logo ? response.data.software_accre_logo : ''
            this.software_accre_type = response.data.software_accre_type ? response.data.software_accre_type : ''
            this.system_name = response.data.system_name ? response.data.system_name : ''
            this.mem_search_option= response.data.mem_search_option ? response.data.mem_search_option : '',
            this.separate_ekas_epress = response.data.separate_ekas_epress ? response.data.separate_ekas_epress : ''
            let show_brgy   = this.credential_data.FAW4H == 'BARANGAY' ? 'BARANGAY' : ''
            let width_size  = this.provider_name.length > 35 ? '700' : '650'
            let alert_title = 'Hi <span class="title grey--text text--darken-3 text-uppercase">'+show_brgy+' '+this.provider_name+'</span> <h5 class="my-1 font-weight-medium grey--text text--darken-3" style="font-size:10.5pt">Your terminal is being registered</h5>' 
            let alert_body  = "<h5 class='font-weight-regular'>For Security purposes, please <strong>ALLOW</strong> the system to get your current location<h5 class='font-weight-regular'>"
            this.alert = { display: true, type: 'terminal_registration', width: width_size, title: alert_title, body: alert_body, btn_pry_act: 'closeAlert', btn_pry_emt: 'terminalRegister' }
          }
        } else {
          this.alert = response.error
        }
      } else {
        this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Field is empty', body: 'Please enter your username and password', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }

      }
    },
 
   // Checking if the browser supports geolocation. If it does, it will call the getCurrentPosition() method.
    allowLocation () {
      if (!navigator.geolocation) return this.error = "Geolocation is not supported"
      navigator.geolocation.getCurrentPosition(this.show_position, this.show_error)
    },

   // Setting the latitude and longitude to the current location of the user.
   // Enables the done button from the modal
    show_position(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.$refs.alerts.disabled_trm_reg_btn = false
    },

   // A function that is called when the user denies the request for geolocation. It is a switch statement that displays an alert based on the error code.
    show_error(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-close-circle', color: 'red', title: 'User denied the request for Geolocation', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          break;
        case error.POSITION_UNAVAILABLE:
          this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'Location information is unavailable', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          break;
        case error.TIMEOUT:
          this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'The request to get user location timed out', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          break;
        case error.UNKNOWN_ERROR:
          this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'An unknown error occurred', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          break;
      }
    },

   // A function that POST the location and generated registration_id to validation if 
    async terminalRegister () {
        let random = Math.random().toString(25).substring(3, 9);
        let date_time = this.$moment().format("YYYYMMDDhmmss");
      // Generating a random string of characters and numbers.
        if (!this.credential_data.O627T && !this.credential_data.O34CD) {
            this.registration_id = (random + "" + date_time).toUpperCase();
        } else {
            this.registration_id = ((this.credential_data.O627T ? this.credential_data.O627T  : this.credential_data.O34CD) + "" +random +"" +date_time) .toUpperCase();
        }

        let response = await this.$services.prvValidateCoordinates({
            prv_code: this.credential_data.O34CD,
            provider_tin : this.credential_data.O627T,
            longitude: this.longitude,
            latitude: this.latitude,
            registration_id: this.registration_id
        })

        if(response.status === 200) {
          if (response.data.PRV_COORDINATES === 1) return this.callPrvAddProvider()
          this.show_validate_location = true
          this.getPrvResult();
        } else {
          this.alert = response.error
        }
    },

   // Checking if the provider is allowed to add a provider.
    async getPrvResult() {
      let response = await this.$services.getPrvValidateCoordinatesResult({
          provider_tin: this.credential_data.O627T,
          provider_code: this.credential_data.O34CD,
          registration_id : this.registration_id,
      }) 

      if(response.status === 200) {
        response.data =  this.responseDataDecryption(response.data)
        if (!response.data.is_prv_allowed) return setTimeout(() => {this.getPrvResult()}, 3000);
        if (response.data.is_prv_allowed == '0') {
          this.alert = { display: true, type: 'standard', width: '620', icon: 'mdi-alert-circle', color: 'blue darken-1', title: 'Sorry but we cannot validate the current location of your provider', body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          return
        }
        this.show_validate_location = false
        this.callPrvAddProvider() 
      } else {
        this.alert = response.error
      }
    },

   // Calling a PHP file and passing a JSON object to it.
    async callPrvAddProvider() {
      let provider_data = {
        provider_code   : this.credential_data.O34CD ? this.credential_data.O34CD : '',
        provider_tin    : this.credential_data.O627T ? this.credential_data.O627T : '',
        provider_name   : this.provider_name,
        province        : this.provider_province ? this.provider_province : '',
        healthcard_id   : this.healthcard_id ? this.healthcard_id : '',
        phic_acc_no     : this.credential_data.WAO8S ? this.credential_data.WAO8S : '',
        ekonsulta_phic_acc_no     : this.credential_data.R3D14 ? this.credential_data.R3D14 : '',
        ekonsulta_pmmc_no     : this.credential_data.H09B1 ? this.credential_data.H09B1 : '',
        eclaim_phic_acc_no     : this.credential_data.KSH15 ? this.credential_data.KSH15 : '',
        eclaim_pmmc_no     : this.credential_data.SL12H ? this.credential_data.SL12H : '',
        phic_token      : this.credential_data.JJIA1 ? this.credential_data.JJIA1 : '',
        tel_no          : this.credential_data.TL8015? this.credential_data.TL8015: '',
        email           : this.credential_data.EM963 ? this.credential_data.EM963 : '',
        municipality    : this.credential_data.Q6M80 ? this.credential_data.Q6M80 : '',
        registration_id : this.registration_id,
        phic            : 1,
        hmo             : 1,
        lgu             : 1,
        software_accre_logo: this.software_accre_logo ? this.software_accre_logo : '',
        software_accre_type: this.software_accre_type ? this.software_accre_type : '',
        system_name     : this.system_name ? this.system_name : '',
        mem_search_option : this.mem_search_option,
        separate_ekas_epress: this.separate_ekas_epress,
        provider_address : this.credential_data.PVY9C ? this.credential_data.PVY9C : '',
      }

      // Pushing the data to the next page.
      let show_brgy   = this.credential_data.FAW4H == 'BARANGAY' ? 'BARANGAY' : ''
      let provider_name = `${show_brgy} ${this.provider_name}`
      let department = this.credential_data.C516S

      if(this.$store.state.prv_key){
        let response =  await this.$services.prvAddProvider({
            provider_code   : this.credential_data.O34CD,
            provider_tin    : this.credential_data.O627T,
            longitude       : this.longitude,
            latitude        : this.latitude,
            registration_id : this.registration_id
        })

        if(response.status === 200) {
          this.$store.commit('setProviderData', provider_data)
          this.$router.push({name: 'WelcomePage', params:{provider: provider_name, department: department}}) 
        } else {
          this.alert = response.error
        }
      } else {
        this.$store.commit('setProviderData', provider_data)
        this.$router.push({name: 'WelcomePage', params:{provider: provider_name, department: department}}) 
      }
    },

    handlePaste(value, field) {
      value.preventDefault()

      let paste_data = (value.clipboardData || window.clipboardData).getData('text')

      paste_data = paste_data.replace(/\s+/g, '')

      this[field] = paste_data
    }

    //GET DB PROVIDER LIST
    // async getDbProviderlist() {
    //   if(this.$store.state.selected_db_provider) {
    //     this.select_db_provider = this.$store.state.selected_db_provider
    //     this.dialog_db_provider=false
    //   } else{
    //     this.dialog_db_provider=true
    //     let response = await this.$services.getDbProviderList()
    //       if(response.status === 200) {
    //         this.db_provider_list = response.data
    //       } else {
    //         this.alert = response.error
    //       }
    //   }
    // },
    
    //SET SELECTED DB PROVIDER
    // setSelectedDbProvider() {
    //   if(this.select_db_provider) {
    //     this.dialog_save_db_provider =true
    //     this.$store.commit('setSelectedDbProvider', this.select_db_provider)
    //     setInterval(() => {
    //           this.dialog_save_db_provider = false
    //           this.dialog_db_provider = false
    //     }, 1000);
    //   } else{
    //     this.db_provider_error="Please select a provider."
    //   }
    // }
  },
};
</script>

<style scoped>
.logo-div{
  position:absolute;
  top:0;
  left:0;
  right:0;
}
</style>