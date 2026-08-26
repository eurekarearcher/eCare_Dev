<template>
  <v-container px-10>
    <Navbar :help_menu="help" />
    
    <v-stepper alt-labels class="mt-4 elevation-0" style="background: #fafafa">
      <v-stepper-header>
        <v-divider></v-divider>
        <v-stepper-step step complete :complete-icon="hospital_icon" class="font-weight-medium">
          <span class="grey--text text--darken-2">Provider Registration</span>
        </v-stepper-step>
        <v-divider></v-divider>
      </v-stepper-header>
    </v-stepper>

    <v-row dense>
      <!-- outer -->
        <v-col cols="12" sm="12">
          <!-- card -->
          <v-form v-model="valid" ref="form">
            <v-card outlined class="pb-5 px-5" :loading="load">
              <center>
                <v-row dense>
                    <v-col cols="12" sm="12" md="11" lg="11" xl="11" class="mt-10">
                      <v-row justify="space-around" dense>
                        <v-col cols="12" sm="4" md="4" lg="3" xl="3">
                          <h4 :class="load ? 'grey--text' : 'grey--text text--darken-3'" class="text-left text-sm-right pr-sm-2 font-weight-regular">Healthcare Facility:</h4>
                        </v-col>

                        <v-col cols="12" sm="8" md="8" lg="9" xl="9">
                          <h4 class="mb-1 font-weight-medium text-left text-uppercase text-body-2 text-sm-body-1">{{provider.type === 'BRGY' ? 'BARANGAY' : ''}} {{ provider.name }}</h4>
                          <v-divider class="mb-5"></v-divider>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="3" xl="3" align-self="center">
                          <h4 :class="load ? 'grey--text' : 'grey--text text--darken-3'" class="text-left text-sm-right pr-sm-2 font-weight-regular mb-sm-5"> Provider Type:</h4>
                        </v-col>

                        <v-col cols="12" sm="8" md="8" lg="9" xl="9">
                          <v-text-field v-model="get_provider_type"  disabled class="mb-3 mb-sm-5" dense outlined required hide-details></v-text-field>
                        </v-col>

                        <v-col v-show="provider.type == 'BRGY'" cols="12" sm="4" md="4" lg="3" xl="3" align-self="center">
                          <h4 :class="load ? 'grey--text' : 'grey--text text--darken-3'" class="text-left text-sm-right pr-sm-2 font-weight-regular mb-sm-5"> RHU:</h4>
                        </v-col>

                        <v-col v-show="provider.type == 'BRGY'" cols="12" sm="8" md="8" lg="9" xl="9">
                          <v-text-field v-model="provider.rhu_provider_name" disabled class="mb-3 mb-sm-5" dense outlined required hide-details></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="3" xl="3" align-self="center">
                          <h4 :class="load ? 'grey--text' : 'grey--text text--darken-3'" class="text-left text-sm-right pr-sm-2 font-weight-regular mb-sm-5"> Provider Address: <span class="required">*</span></h4>
                        </v-col>

                        <v-col cols="12" sm="8" md="8" lg="9" xl="9">
                          <v-text-field v-model="provider.location" label="Provider Address" readonly :rules="addressRules" :item="location" :disabled="load" class="mb-3 mb-sm-5" dense outlined required hide-details></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="3" xl="3" align-self="center">
                          <h4 :class="load ? 'grey--text' : 'grey--text text--darken-3'" class="text-left text-sm-right pr-sm-2 font-weight-regular mb-sm-5">  TIN: </h4>
                        </v-col>

                        <v-col cols="12" sm="8" md="8" lg="9" xl="9">
                          <v-text-field @keypress="onKeyupText($event)" v-model="provider.tin_provider" disabled class="mb-3  mb-sm-5" dense label="TIN" maxlength="15" outlined required hide-details></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="3" xl="3" align-self="center">
                          <h4 :class="load ? 'grey--text' : 'grey--text text--darken-3'" class="text-left text-sm-right pr-sm-2 font-weight-regular mb-sm-5">  Philhealth Accreditation Number:</h4>
                        </v-col>

                        <v-col cols="12" sm="8" md="8" lg="9" xl="9">
                          <v-text-field v-model="provider.phic_acc_no" readonly label="Philhealth Accreditation Number" :disabled="load" class="mb-3 mb-sm-5" outlined  dense hide-details></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="3" xl="3" align-self="start">
                          <h4 :class="load ? 'grey--text' : 'grey--text text--darken-3'" class="text-left text-sm-right pr-sm-2 font-weight-regular mt-sm-2 mb-sm-5"> Provider Email Address:<span class="required">*</span></h4>
                        </v-col>

                        <v-col cols="12" sm="8" md="8" lg="9" xl="9">
                          <v-text-field v-model="provider.email" :rules="emailRules" readonly label="Email Address" :disabled="load" dense outlined required></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="3" xl="3" align-self="center">
                          <h4 :class="load ? 'grey--text' : 'grey--text text--darken-3'" class="text-left text-sm-right pr-sm-2 font-weight-regular mb-sm-5"> Provider Contact Person:</h4>
                        </v-col>

                        <v-col cols="12" sm="8" md="8" lg="9" xl="9">
                          <v-text-field v-model="provider.contact_name" label="Contact Person"  readonly :disabled="load" class="mb-3 mb-sm-5" hide-details outlined dense></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="3" xl="3" align-self="center">
                          <h4 :class="load ? 'grey--text' : 'grey--text text--darken-3'" class="text-left text-sm-right pr-sm-2 font-weight-regular mb-sm-5">  Provider Telephone Number:</h4>
                        </v-col>

                        <v-col cols="12" sm="8" md="8" lg="9" xl="9">
                          <v-text-field @keypress="onKeyupText($event)" v-model="provider.tel_no" :disabled="load" readonly class="mb-3 mb-sm-5" hide-details label="Telephone No" maxlength="15" outlined dense></v-text-field>
                        </v-col>
                      </v-row>

                      <v-row justify="center" justify-sm="end">
                            <v-btn  @click="back" color="dark" class="mr-3">Back </v-btn>
                            <v-btn @click="submit" :disabled="!valid || load"  color="light-blue darken-4 white--text" >Proceed<v-icon small right>fas fa-arrow-right</v-icon></v-btn>
                      </v-row>
                    </v-col>
                </v-row>
              </center>
            </v-card>
          </v-form>
        </v-col>
    </v-row>

    <v-dialog v-if="show_validate_location" v-model="show_validate_location" width="550" persistent>
      <v-card class="d-flex flex-column align-center justify-center py-8">
        <v-progress-circular indeterminate color="primary" :size="50"></v-progress-circular>
        <v-card-title class="justify-center text-uppercase mb-2 font-weight-medium text-body-2 text-sm-subtitle-1">Please wait while we validate your location</v-card-title>
      </v-card>
    </v-dialog>

    <Alert :alert="alert" ref="alerts" />
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'

export default {
  name: "ProviderRegistration",
  components: { Navbar, Alert },

  data() {
    return {
      hospital_icon: 'fas fa-hospital-user',

      load: true,
      provider: {},
      validate_prv_field: {},
      prv_tin_code: localStorage.getItem('PCR245') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem("PCR245"),"Sely14ae2fg").toString(this.$crypto.enc.Utf8)) : '',
      latitude:'',
      longitude:'',
      registration_id:'',
      dialog: false,
      location: "",
      terminal_id: "",  
  
      mask: "###-###-###-###",
      //FORM VALIDATION
      valid: false,
      addressRules: [
        (v) => !!v || "Address is required",
        (v) => (v && v.replace(/\s+/g,' ').trim().length >= 10) || "Address must be greater than 10 characters",
      ],
      
      emailRules: [
        (v) => v && !!v || "Email is required",
        (v) => v && !/\s/g.test(v) || "Spaces are not allowed",
        (v) => /.+@.+\..+/.test(v) || "Invalid Email",
      ],
      //NAVBAR
      help: [{ content: "Please fill out the following fields." }],
      alert:{},
      show_validate_location:false
    }
  },

  created() {
    //ON PAGE LOAD GET PROVIDER INFORMATION
    this.getProviderInfo();
  },

  computed: {
    get_provider_type () {
      if (this.provider?.type === 'C') return 'CLINIC'
      if (this.provider?.type === 'H') return 'HOSPITAL'
      if (this.provider?.type === 'BRGY') return 'BARANGAY'
      if (this.provider?.type === 'MHO') return 'MUNICIPAL HEALTH OFFICE'
      if (this.provider?.type === 'PHO') return 'PROVINCIAL HEALTH OFFICE'
      return this.provider.type
    }
  },

  methods: {
    // GEOLOCATION POP UP
    allowLocation () {
      let show_brgy = this.get_provider_type == 'BARANGAY' ? this.get_provider_type : ''
      let width_size = this.provider.name && this.provider.name.length > 35 ? '700' : '650'
      let alert_title = 'Hi <span class="title grey--text text--darken-3 text-uppercase">'+show_brgy+' '+this.provider.name+'</span> <h5 class="my-1 font-weight-medium grey--text text--darken-3" style="font-size:10.5pt">Your terminal is being registered</h5>' 
      let alert_body = "<h5 class='font-weight-regular'>For Security purposes, please <strong>ALLOW</strong> the system to get your current location<h5 class='font-weight-regular'>"
      this.alert = { display: true, type: 'terminal_registration', width: width_size, title: alert_title, body: alert_body, btn_pry_act: 'closeAlert', btn_pry_emt: 'terminalRegister' }
     
     if (!navigator.geolocation) return this.error = "Geolocation is not supported"

     navigator.geolocation.getCurrentPosition(this.show_position, this.show_error);
    },

     // GET LATITUDE AND LONGITUDE
    show_position(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.$refs.alerts.disabled_trm_reg_btn = false
    },

    // VALIDATION WHEN USER DENIED THE SHOW LOCATION ALERT
    show_error(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'User denied the request for Geolocation', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
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

    //GET PROVIDER INFORMATION
    async getProviderInfo() {
      let response = await this.$services.getProviderInfo({
          provider_code: this.prv_tin_code.provider_code,
          provider_tin: this.prv_tin_code.provider_ti
      })

      if (response.status === 200) {
          response.data = this.responseDataDecryption( response.data)
          this.load = false
          this.provider = response.data.has_data ? response.data : {}
          this.validate_prv_field = Object.assign({}, this.provider)

          // if(window.location.protocol !== 'http:'){
            this.allowLocation();
          // }
      } else { 
        this.alert = response.error
      }
    },

    // SUBMIT THE FORM AND STORE TO THE DATABASE.
    async submit() {
      this.provider.location      = this.provider.location ? this.provider.location.replace(/\s+/g,' ').trim() : ''
      this.provider.phic_acc_no   = this.provider.phic_acc_no ? this.provider.phic_acc_no.replace(/\s+/g,' ').trim() : ''
      this.provider.contact_name  = this.provider.contact_name ? this.provider.contact_name.replace(/\s+/g,' ').trim() : ''
      if (this.$refs.form.validate()) {
        this.load = true;
        // DECLARATION FOR TERMINAL ID
        let random = Math.random().toString(25).substring(3, 9);
        let date_time = this.$moment().format("YYYYMMDDhmmss");
        if ( this.prv_tin_code.provider_tin) {
          this.registration_id = (this.prv_tin_code.provider_tin + "" +random +"" +date_time).toUpperCase();
        } else if (this.prv_tin_code.provider_code) {
          this.registration_id = ( this.prv_tin_code.provider_code +"" +random +"" + date_time).toUpperCase();
        } else {
          this.registration_id = (random + "" + date_time).toUpperCase();
        }

        let response = await this.$services.prvValidateCoordinates({
            prv_code: this.prv_tin_code.provider_code,
            provider_tin : this.prv_tin_code.provider_tin,
            longitude: this.longitude,
            latitude: this.latitude,
            registration_id: this.registration_id
        })

        if (response.status === 200) {
          if (response.data.PRV_COORDINATES === 1 ) return this.validateFields()
          this.show_validate_location = true
          this.getPrvResult();
        } else {
          this.alert = response.error
        }
      }
    },

    async callPrvAddProvider() {
      if(this.$store.state.prv_key){
        let response = await this.$services.prvAddProvider({
            provider_code  : this.prv_tin_code.provider_code,
            provider_tin   : this.prv_tin_code.provider_tin,
            longitude      : this.longitude,
            latitude       : this.latitude,
            registration_id: this.registration_id
        })
  
        if (response.status === 200) {
          if(this.prv_tin_code.department === 'Admin'){
            // this.updatePrvRegType();
            this.setProviderData()
          }else{
            this.setProviderData();
          }
        } else {
          this.alert = response.error
        }
      } else {
        this.setProviderData();
      }
    },

    async updatePrvRegType(){
      let response = await this.$services.usrUpdUserData({
          key: 'change_pr_reg_type',
          username: this.prv_tin_code.username,
          provider_tin: this.prv_tin_code.provider_tin,
          provider_code: this.prv_tin_code.provider_code,
          provider_reg_type: this.provider.type
      })

      if (response.status === 200) {
        if(response.data.update === 1){
          this.setProviderData();
        }else{
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      } else {
        this.alert = response.error
      }
    },

    setProviderData(){
      let provider_data = {
        provider_code   : this.prv_tin_code.provider_code ? this.prv_tin_code.provider_code : '',
        provider_tin    : this.prv_tin_code.provider_tin ? this.prv_tin_code.provider_tin : '',
        provider_name   : this.provider.name,
        provider_address: this.provider.location ? this.provider.location : '',
        registration_id : this.registration_id,
        phic_acc_no     : this.provider.phic_acc_no,
        ekonsulta_phic_acc_no: this.provider.ekonsulta_phic_acc_no,
        ekonsulta_pmmc_no: this.provider.ekonsulta_pmmc_no,
        eclaim_phic_acc_no: this.provider.eclaim_phic_acc_no,
        eclaim_pmmc_no: this.provider.eclaim_pmmc_no,
        phic_token      : this.provider.phic_token || '',
        phic            : 1,
        hmo             : 1,
        lgu             : 1,
        province        : this.provider.province ? this.provider.province : '',
        municipality    : this.provider.municipality ? this.provider.municipality : '',
        healthcard_id  : this.provider.healthcard_id ? this.provider.healthcard_id : '',
        software_accre_logo: this.provider.software_accre_logo,
        software_accre_type: this.provider.software_accre_type,
        system_name     : this.provider.system_name,
        mem_search_option : this.provider.mem_search_option,
        separate_ekas_epress: this.provider.separate_ekas_epress
      }
      this.$store.commit('setProviderData', provider_data)
      let show_brgy = this.get_provider_type == 'BARANGAY' ? this.get_provider_type : ''
      let provider_name = `${show_brgy} ${this.provider.name}`
      let department = this.prv_tin_code.department
      this.$router.replace({name: 'WelcomePage', params:{provider: provider_name, department : department}}) 
    },

    async updateProvider() {
      let response = await this.$services.prvUpdProviderInfo({
          provider_code  : this.prv_tin_code.provider_code,
          provider_tin   : this.prv_tin_code.provider_tin,
          location       : this.provider.location,
          phic_acc_no    : this.provider.phic_acc_no,
          email          : this.provider.email,
          contact_name   : this.provider.contact_name,
          tel_no         : this.provider.tel_no
      })
 
      if (response.status === 200) {
        this.callPrvAddProvider();
      } else {
        this.alert = response.error
      }
    },

    async getPrvResult() {
      let response = await this.$services.getPrvValidateCoordinatesResult({
          registration_id: this.registration_id, 
          provider_tin: this.prv_tin_code.provider_tin,
          provider_code: this.prv_tin_code.provider_code
      })

      if (response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        if (!response.data.is_prv_allowed) return setTimeout(() => {this.getPrvResult()}, 3000);
        if (response.data.is_prv_allowed == '0') {
          this.alert = { display: true, type: 'standard', width: '620', icon: 'mdi-alert-circle', color: 'blue darken-1', title: 'Sorry but we cannot validate the current location of your provider', body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          return
        }
        this.validateFields();
      } else {
        this.alert = response.error
      }
    },

    validateFields() {
      if(JSON.stringify(this.provider) === JSON.stringify(this.validate_prv_field)) {
        this.callPrvAddProvider();
      } else {

        if(this.$store.state.prv_key){
          this.updateProvider();
        } else {
          this.callPrvAddProvider();
        }
      }
    },

    back() {
      this.$router.replace({ name: "Login" });
    },

    // PREVENT THE USER FROM TYPING TEXT IN A NUMBER FIELD
    onKeyupText(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 &&(charCode < 48 || charCode > 57) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  },

  beforeRouteLeave(to, from, next) {
    localStorage.removeItem('PCR245')
    next();
  }
};
</script>