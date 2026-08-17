<template>
  <div>
    <v-dialog v-if="alert" v-model="alert.display" :width="alert.width" persistent>
      <!-- STANDARD ALERT -->
      <v-card v-if="alert.type === 'standard'" class="text-center py-5 px-8">
        <v-card-title class="justify-center">
          <v-icon :color="alert.color" size="80">{{ alert.icon }}</v-icon>
        </v-card-title>

        <h3 v-html="alert.title" class="grey--text text--darken-2 font-weight-regular">{{ alert.title }}</h3>
        <h4 v-html="alert.body" class="grey--text text--darken-3 font-weight-light mb-7">{{ alert.body }}</h4>

        <v-row justify="center" dense>
          <v-col v-if="!alert.ekonsulta" cols="12" sm="auto" md="auto">
            <v-btn :class="[alert.btn_pry_class, alert.btn_pry_otl ? 'otl' : 'grn']" :color="alert.btn_pry_color" :outlined="alert.btn_pry_otl" :loading="loading_btn" :dark="alert.btn_pry_color === 'orange'" @click="actionButton('first')" class="pa-5" block>{{ alert.btn_pry_txt }}</v-btn>
          </v-col>

          <v-col v-if="alert.btn_sec_txt" cols="12" sm="auto" md="auto">
            <v-btn :class="[alert.btn_sec_class, alert.btn_sec_otl ? 'otl' : 'grn']" :color="alert.btn_sec_color" :outlined="alert.btn_sec_otl" :disabled="disabled_btn" :dark="alert.btn_sec_color === 'orange'" @click="actionButton('second')" class="pa-5" block>{{ alert.btn_sec_txt }}</v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- FOR THE COUNTDOWN OF AUTO-LOGOUT -->
      <v-card v-else-if="alert.type === 'auto-logout'" class="text-center py-5 px-8">
        <v-card-title class="justify-center">
          <v-icon color="yellow darken-1" size="80">mdi-alert-circle</v-icon>
        </v-card-title>

        <h3 class="grey--text text--darken-2 font-weight-regular mb-2">Are you still there?</h3>
        <h4 class="grey--text text--darken-3 font-weight-light">You have been idle for 10 minutes. For your security, you will be logged out automatically in</h4>
        <h3 class="grey--text text--darken-3 font-weight-light mb-5"><b>{{ countdown }}</b> seconds</h3>
        
        <v-row justify="center" dense>
          <v-col cols="12" sm="6" md="5" lg="5" xl="5" class="px-1">
            <v-btn :disabled="disabled_btn" @click="stayLoggedIn" class="grn" color="primary" block>STAY LOGGEDIN</v-btn>
          </v-col>

          <v-col cols="12" sm="6" md="5" lg="5" xl="5" class="px-1 mt-2 mt-sm-0">
            <v-btn :disabled="disabled_btn" @click="logoutUser" class="otl" color="grey darken-2" outlined block>LOG OUT NOW</v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- FOR LOGOUT -->
      <v-card v-else-if="alert.type === 'logout'" class="text-center py-5 px-8">
        <v-card-title class="justify-center">
          <v-icon color="primary" size="80">mdi-help-circle</v-icon>
        </v-card-title>

        <h3 class="grey--text text--darken-2 font-weight-regular">This will logout your account</h3>
        <h4 class="grey--text text--darken-3 font-weight-light mb-7">Do you want to continue?</h4>

        <v-row justify="center" dense>
          <v-col cols="6" sm="4" md="3" lg="3" xl="3" class="px-1">
            <v-btn :loading="loading_btn" @click="logoutUser" class="grn" color="primary" block>YES</v-btn>
          </v-col>

          <v-col cols="6" sm="4" md="3" lg="3" xl="3" class="px-1">
            <v-btn :disabled="disabled_btn" @click="closeAlert()" class="otl" color="grey darken-2" outlined block>NO</v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- FOR PATIENT CONFINEMENT DATES -->
      <v-card v-else-if="alert.type === 'pci_dates'" class="text-center py-5 px-8">
        <v-card-title class="justify-center">
          <v-icon color="orange" size="80">mdi-alert-circle</v-icon>
        </v-card-title>

        <h3 class="grey--text text--darken-2 font-weight-regular">{{ alert.title }}</h3>

        <div v-for="(date, i) in alert.array_dates" :key="i">
          <div v-if="date.category === 'others'" class="my-2">
            <h3 v-if="date.index === 0" class="font-weight-medium">Patient Disposition</h3>
          </div>

          <div v-else-if="date.category === 'pci'" class="my-2">
            <h3 v-if="date.index === 0" class="font-weight-medium">Discharged Diagnosis Procedure:</h3>
            <h4 class="grey--text text--darken-2 font-weight-regular my-1">{{ date.title }}</h4>
          </div>

          <div v-else-if="date.category === 'pex'" class="my-2">
            <h3 v-if="date.index === 0" class="font-weight-medium">Pertinent Laboratory:</h3>
            <h4 class="grey--text text--darken-2 font-weight-regular my-1">{{ date.title }}</h4>
          </div>

          <div v-else class="mt-2">
            <h3 v-if="date.index === 0" class="font-weight-medium">Course in the ward:</h3>
            <h4 class="grey--text text--darken-2 font-weight-regular my-1">{{ date.title }}</h4>
          </div>
        </div>

        <h4 class="grey--text text--darken-3 font-weight-light mb-7">Click OKAY to continue</h4>

        <v-row justify="center" dense>
          <v-col cols="12" sm="6" md="3" lg="3" xl="3">
            <v-btn class="ogn" color="orange" @click="actionButton('first')" block dark>OKAY</v-btn>
          </v-col>

          <v-col cols="12" sm="6" md="3" lg="3" xl="3">
            <v-btn class="otl" color="grey darken-2" @click="actionButton('second')" outlined block>CANCEL</v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- FOR TERMINAL REGISTER -->
      <v-card v-else-if="alert.type === 'terminal_registration'" class="text-center py-5 px-8">
        <v-card-title class="justify-center">
          <v-icon color="blue darken-1" size="80">mdi-alert-circle</v-icon>
        </v-card-title>
        
        <h3 v-html="alert.title" class="grey--text text--darken-2 font-weight-regular">{{ alert.title }}</h3>
        <h4 v-html="alert.body" class="grey--text text--darken-3 font-weight-light mb-7">{{ alert.body }}</h4>

        <v-btn class="grn" color="blue darken-1 white--text mx-2 px-7" :disabled="disabled_trm_reg_btn" @click="actionButton('first')" >Done</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  props: ['alert'],
  
  data(){
    return{
      countdown: 10,
      loading_btn: false,
      disabled_btn: false,
      disabled_trm_reg_btn: true,
      isblock: this.$vuetify.breakpoint.name == 'xs'  || this.$vuetify.breakpoint.name == 'sm' ? true : false,
    }
  },

  watch: {
    alert(){
      this.loading_btn = false
      this.disabled_btn = false
    },
  },

  methods: {
    // CALL THE METHOD
    actionButton(button){
      if(button === 'first'){
        this[this.alert.btn_pry_act](this.alert.btn_pry_emt, this.alert.btn_pry_params)
      }else if(button === 'second'){
        this[this.alert.btn_sec_act](this.alert.btn_sec_emt, this.alert.btn_sec_params)
      }else{
        this[this.alert.btn_tert_act](this.alert.btn_tert_emt, this.alert.btn_tert_params)
      }
    },

    // LOADING ALERT BUTTONS
    loadingBtn(btn_emit, btn_params){
      this.loading_btn = true
      this.disabled_btn = true

      if(btn_emit){
        this.$emit(btn_emit, btn_params)
      }
    },
    
    // RELOAD THE PAGE
    reloadPage(btn_emit, btn_params){
      location.reload()

      if(btn_emit){
        this.$emit(btn_emit, btn_params)
      }
    },
    
    // CLOSE ALERT
    closeAlert(btn_emit, btn_params){
      this.alert.display = false

      if(btn_emit){
        this.$emit(btn_emit, btn_params)
      }
    },

    // COUNTDOWN OF AUTO-LOGOUT
    startCountdown(){
      this.countdownTimeout = setInterval(() => {
        if(this.countdown === 0){
          this.logoutUser();
        }else{
          this.countdown -= 1
        }
      }, 1000)
    },

    // STAY LOGGEDIN
    stayLoggedIn(){
      clearTimeout(this.countdownTimeout)
      this.alert.display = false
      this.countdown = 10
    },

    // LOGOUT USER
    async logoutUser(){
      this.loadingBtn();
      clearInterval(this.countdownTimeout)

      let response = await this.$services.logOutUser({
          source: 'provider',
          username: this.$store.state.usr_credentials.user_name
      })

      if (response.status === 200) {
        sessionStorage.clear()
        this.$store.commit('setUserCredentials', 
          {
            "password": "",
            "user_name": "",
            "user_code": "",
            "user_type": "",
            "user_roles": [],
            "acess_code": "N/A",
            "department": "",
            "doctor_tin": "",
            "doctor_code": "",
            "provider_reg_type": "",
            "user_complete_name": "",
            "tel_no": null,
            "email": "",
            "lgu_host_code": "",
            "user_settings": {
              "display_filipino_word": false,
              "user_layout": "type_a",
              "display_help": false,
              "save_as_pdf_disabled": false,
              "unit_conversion": "CU"
            }
          }
        )
        this.$store.commit('removeMemberData')
        this.webCookies('delete', 'DF342')
        this.webCookies('delete', 'QR5YP')
        localStorage.removeItem('dskDo3Y')
        localStorage.removeItem('PRT950')
        localStorage.removeItem('4DVVF6')
        localStorage.removeItem('PRIR6R')
        localStorage.removeItem('5PP663')
        localStorage.removeItem('DSG64O')
        localStorage.removeItem('X425FG')
        localStorage.removeItem('FOD44D')
        localStorage.removeItem('YMN5DF')
        localStorage.removeItem('JHGKM4')
        localStorage.removeItem('UIOE4D')
        localStorage.removeItem('CLXD4F')
        localStorage.removeItem('CSBMM5')
        localStorage.removeItem('GXHM4E')
        localStorage.removeItem('JKFFGD')
        localStorage.removeItem('GPDTT4')
        localStorage.removeItem('O4RRR2')
        localStorage.removeItem('PP534T')
        localStorage.removeItem('ZC593X')
        localStorage.removeItem('PRT35S')
        localStorage.removeItem('D9GG44')
        localStorage.removeItem('FDGHH7')
        localStorage.removeItem('XPOFIF')
        localStorage.removeItem('05XFLD')
        localStorage.removeItem('FGG536')
        localStorage.removeItem('VGR084')
        return this.$router.replace('/')
      } else {
        this.alert = response.error
      }
    }
  }
}
</script>

<style scoped>
.grn:hover{
  background-color:#43A047  !important;
  box-shadow: 0px 8px 9px -5px rgba(0, 0, 0, 0.2), 0px 15px 22px 2px rgba(0, 0, 0, 0.14), 0px 6px 28px 5px rgba(0, 0, 0, 0.12) !important;
  color:white !important;
  transition: 0.3s !important;
}
.ogn:hover{
  background-color:#f57c00  !important;
  box-shadow: 0px 8px 9px -5px rgba(0, 0, 0, 0.2), 0px 15px 22px 2px rgba(0, 0, 0, 0.14), 0px 6px 28px 5px rgba(0, 0, 0, 0.12) !important;
  color:white !important;
  transition: 0.3s !important;
}
.otl:hover{
  background-color:#FAFAFA  !important;
  border-color:#BDBDBD !important;
  box-shadow: 0px 8px 9px -5px rgba(0, 0, 0, 0.2), 0px 15px 22px 2px rgba(0, 0, 0, 0.14), 0px 6px 28px 5px rgba(0, 0, 0, 0.12) !important;
  color:#424242 !important;
  transition: 0.3s !important;
}
</style>