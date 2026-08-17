<template>
  <v-container fluid id="web-registration" class="pa-0 ma-0">
    <Navbar :navbar="navbar" @redirect="redirect" :steps="steps" class="d-print-none"/>
  
    <v-dialog v-if="alert_display" v-model="alert_display" :width="550" persistent>
        <!-- STANDARD ALERT -->
        <v-card class="text-center pt-5 pb-5 px-8">
          <v-card-title class="justify-center font-weight-regular text-h5 grey--text text--darken-3 mt-5 mb-8">SELECT PROCESS</v-card-title>
       
          <div class="d-block px-sm-14">
              <template v-if="$store.state.usr_credentials.department === 'Admission'"> 
                <v-btn @click="action('REGISTRATION')" color="primary"  class="pa-5 elevation-0 mb-4" tile block>
                  <v-icon small left class="mr-auto ml-2">fas fa-user-pen</v-icon>
                  <span class="mr-auto"> MEMBER REGISTRATION</span>
                </v-btn>

                <v-btn @click="action('ADD HOUSEHOLD')" color="primary" class="pa-5 elevation-0 mb-4" outlined tile block>
                  <v-icon small left class="mr-auto ml-2">fas fa-user-plus</v-icon>
                  <span class="mr-auto">ADDING OF HOUSEHOLD</span>
                </v-btn>

                <v-btn @click="action('ISSUE CARD')" color="primary" class="pa-5 elevation-0 mb-4" outlined tile block>
                  <v-img src="@/assets/card-release.svg" max-height="35" max-width="35" class="mr-auto"></v-img>
                  <span class="mr-auto">ISSUE CARD</span>
                </v-btn>

                <v-btn @click="action('REPORT LOST CARD')" color="primary" class="pa-5 elevation-0 mb-6" outlined tile  block>
                  <v-img src="@/assets/lost-card.svg" max-height="35" max-width="35" class="mr-auto"></v-img>
                  <span class="mr-auto">REPORT LOST CARD</span>
                </v-btn>
              </template>
              <template v-else> 
                  <v-btn @click="action('OFFLINE TRANSACTION')" color="primary"  class="pa-5 elevation-0 mb-4" tile block>
                    <v-icon small left class="mr-auto ml-2">fas fa-user-pen</v-icon>
                    <span class="mr-auto"> MEMBER REGISTRATION</span>
                  </v-btn>
                  <v-btn @click="action('ADD HOUSEHOLD')" color="primary" class="pa-5 elevation-0 mb-4" outlined tile block>
                    <v-icon small left class="mr-auto ml-2">fas fa-user-plus</v-icon>
                    <span class="mr-auto">ADDING OF HOUSEHOLD</span>
                  </v-btn>
              </template>
              <v-btn @click="redirect(process)" color="#eee" class="pa-5 elevation-0 mb-0 px-12 mx-auto"  tile small >Cancel</v-btn>
          </div>
        </v-card>
    </v-dialog>

    
    <v-col cols="12" md="11" class="mx-auto body-container">
      <h1 class="text-h5 text-center grey--text text--darken-3 font-weight-medium mt-5 d-print-none">{{process === 'OFFLINE TRANSACTION' ? 'POST TRANSACTION' : process}}</h1>
      <h2 v-if="member_data && member_data.add_member_household && process === 'REGISTRATION'" class="body-1 text-center grey--text text--darken-3 font-weight-regular mb-5 d-print-none">(ADDING OF DEPENDENT)</h2>

      <v-stepper  v-model="steps" class="steppers elevation-0 overflow-visible">
        <v-stepper-header class="elevation-0 d-print-none">
  
          <v-stepper-step :complete="steps > 1" step="1" class="body-1 font-weight-regular"> Verify User</v-stepper-step>
          <v-divider></v-divider>

          <v-stepper-step :complete="steps > 2" step="2" class="body-1 font-weight-regular"> {{process !== 'REGISTRATION' && process !== 'ADD HOUSEHOLD' && process !== 'OFFLINE TRANSACTION' ? 'Review' : ''}} Additional Information</v-stepper-step>
          <v-divider></v-divider>
          <template v-if="!member_data && process === 'REGISTRATION'">
            <v-stepper-step :complete="steps > 3" step="3" class="body-1 font-weight-regular"> {{process !== 'REGISTRATION' ? 'Review' : ''}} Questionnaire</v-stepper-step>
            <v-divider></v-divider>
          </template>
          <template v-if="$store.state.usr_credentials.department !== 'Data Encoder'"> 

            <v-stepper-step v-if="process === 'REGISTRATION' || process === 'ADD HOUSEHOLD' || issuance_for_mobile && (process !== 'REPORT LOST CARD' || process !== 'ISSUE CARD')" :complete="!member_data && process === 'REGISTRATION'? steps > 4 : steps > 3" :step="!member_data && process === 'REGISTRATION'? 4 : 3" class="body-1 font-weight-regular">Issuance of Card </v-stepper-step>
            
            <v-stepper-step v-else :complete="!member_data && process === 'REGISTRATION'? steps > 4 : steps > 3" :step="!member_data && process === 'REGISTRATION'? 4 : 3" class="body-1 font-weight-regular">Issuance of Card</v-stepper-step>

            <v-divider  v-if="process === 'REGISTRATION' || process === 'ADD HOUSEHOLD' || issuance_for_mobile"></v-divider>
          </template>

          <v-stepper-step v-if="process === 'REGISTRATION' || process === 'ADD HOUSEHOLD' || process === 'OFFLINE TRANSACTION'" :complete="!member_data && process === 'REGISTRATION'? steps > 5 : steps > 6" :step="$store.state.usr_credentials.department === 'Data Encoder' ? 3 : (process === 'ADD HOUSEHOLD' ? 4 : (!member_data && process === 'REGISTRATION'  ? 5  :  4))" class="body-1 font-weight-regular"> Finish Registration or Add household</v-stepper-step>
        
        </v-stepper-header>

        <v-stepper-items class="steppers overflow-visible">
          <v-stepper-content step="1" class="py-xl-2 mb-4" >
            <UserVerification v-if="steps == '1'" :process="process" :mem_data="member_data" @change-step="changeStep" @issuanceForMobile="issuance_for_mobile = true" />
          </v-stepper-content>

          <v-stepper-content step="2">
            <template>
              <AdditionalInformation v-if="steps == '2'" @change-step="changeStep" @getHousehold="getHousehold" @redirect="redirect" :process="process" @issuanceForMobile="issuance_for_mobile = false"/>
            </template>

          </v-stepper-content> 
          <template v-if="!member_data && process === 'REGISTRATION'"> 
            <v-stepper-content step="3">
              <EnvironmentalHealth v-if="steps == '3'" @change-step="changeStep" @getHousehold="getHousehold" @redirect="redirect" :process="process"/>
            </v-stepper-content> 
          </template>
          <div v-if="!member_data && process === 'REGISTRATION'? steps == 4 : steps == 3" :step="!member_data && process === 'REGISTRATION'? 4 : 3">
            <!--<PrimaryCare v-if="process == 'REGISTRATION' || process === 'ADD HOUSEHOLD' || issuance_for_mobile" @change-step="changeStep" @getHousehold="getHousehold" :process="process"/>-->
            <GenerateQR v-if="process !== 'REGISTRATION' || process !== 'ADD HOUSEHOLD' || !issuance_for_mobile"   @change-step="changeStep" @getHousehold="getHousehold" @redirect="redirect" :process="process"/>
          </div>
          <div v-if="process === 'REGISTRATION'? steps == 5 : steps == 4" :step="!member_data && process === 'REGISTRATION'? 5 : 4">
            <GenerateQR  @change-step="changeStep" @getHousehold="getHousehold" @redirect="redirect" :process="process"/>
          </div>
          <v-stepper-content :step="process === 'REGISTRATION'? 6 : 5">
            <v-card v-if="process === 'REGISTRATION'? steps == '6' : steps == '5'" width="550" class="mx-auto mt-8 mb-5">
              <v-card-title class="border-top">
                <v-icon size="90" color="white" class="absolute ">mdi-circle</v-icon>
                <v-icon size="90" color="success" class="absolute fade-transition">mdi-check-circle</v-icon>
              </v-card-title>
              <div class="pa-5">
                <v-card-title class="justify-center color-text text-h5 mt-5 ">REGISTRATION COMPLETE</v-card-title>
                <v-card-title class="justify-center color-text body-1 font-weight-regular ">Do you want to add a household member?</v-card-title>
                <v-card-actions class="justify-center my-2">
                  <v-btn @click="redirect" class="ml-3 px-5 py-5" color="primary" small outlined>No, Back to Homepage</v-btn>
                  <v-btn @click="addHouseHold" class="primary mr-3 px-5 py-5" small>Yes, Add Household</v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <HouseholdScanner v-if="process === 'ADD HOUSEHOLD' && !member_data" @setMemberData="setMemberData" @changeStep="changeStep" @redirect="redirect" class="d-print-none"/>

    </v-col>
    <Alert :alert="alert" @redirect="redirect" class="d-print-none" ref="alert"/>
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'
import UserVerification from '@/components/e-benefit/web-registration/UserVerification.vue'
import AdditionalInformation from '@/components/e-benefit/web-registration/AdditionalInformation.vue'
//import AIPostEnconding from '@/components/e-benefit/web-registration/AIPostEnconding.vue'
//import PrimaryCare from '@/components/e-benefit/web-registration/PrimaryCare.vue'
import GenerateQR from '@/components/e-benefit/web-registration/GenerateQR.vue'
import HouseholdScanner from '@/components/e-benefit/web-registration/HouseholdScanner.vue'
// import DmQuestionaire from '@/components/e-benefit/web-registration/DmQuestionaire.vue'
import EnvironmentalHealth from '@/components/e-benefit/web-registration/EnvironmentalHealth.vue'


export default {
  components: {
    Navbar,
    Alert,
    UserVerification,
    AdditionalInformation,
    //PrimaryCare,
    GenerateQR,
    HouseholdScanner,
    EnvironmentalHealth,
    //AIPostEnconding
    // DmQuestionaire,
  },

  data() {
    return {
      alert_display: false,
      process: sessionStorage.getItem("1abG571xlqp") ? this.$crypto.AES.decrypt(sessionStorage.getItem("1abG571xlqp"), "njGHDdd").toString(this.$crypto.enc.Utf8)  : null,
      member_data: sessionStorage.getItem("9xgF732sfgh") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("9xgF732sfgh"), "njGHDdd").toString(this.$crypto.enc.Utf8) ) : null,
      issuance_for_mobile: false,
      steps: null,
      leave_approval: true,
      // NAVBAR
      alert: {},
      navbar: [ { title: 'Home', link: '/code-scanning', icon: 'fas fa-home'} ],
    }
  },

  mounted () {
    this.checkProcess()
  },

  methods: {
    checkProcess() {
      if (!this.process) return  this.steps = 1, this.alert_display = true
      if (!this.member_data) return this.steps = 1
      this.issuance_for_mobile = this.member_data?.issuance_for_mobile ? this.member_data.issuance_for_mobile : false
      this.leave_approval = this.member_data.step >= 2 ? false : true
      return this.steps = this.member_data.step
    },
  
    action(process) {
      this.alert_display = false
      this.process = process
      sessionStorage.setItem('1abG571xlqp', this.$crypto.AES.encrypt(process, 'njGHDdd'))
    },

    changeStep(value) {
      this.steps = value
      if(value >= 2) return this.leave_approval = false
      return this.leave_approval = true
    },

    getHousehold(value) {
      this.member_data = value
    },

    leavePageAlert() {
      this.alert = { 
        display: true, 
        type: 'standard', 
        width: '620', 
        icon: 'mdi-help-circle', 
        color: 'blue darken-1', 
        title: 'Cancel Adding of Household', 
        body: 'Leaving this page will cancel adding of household.', 
        btn_pry_txt: 'leave', 
        btn_pry_color: 'secondary', 
        btn_pry_otl: true, 
        btn_pry_act: 'closeAlert',  
        btn_pry_emt: 'redirect',
        btn_sec_txt: 'Stay on this page', 
        btn_sec_color: 'primary', 
        btn_sec_otl: false, 
        btn_sec_act: 'closeAlert',
      }
    },

    addHouseHold() {
      // FORTESTING
      let session_data = sessionStorage.getItem("9xgF732sfgh") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("9xgF732sfgh"), "njGHDdd").toString(this.$crypto.enc.Utf8) ) : null
      let data = {
        step: 1,
        ek_lgu_id: session_data.principal_ek_lgu_id,
        primary_data: session_data.primary_data,
        add_member_household: true
      }
      sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(data), 'njGHDdd'))
      this.member_data = data
      this.steps =  1
    },

    setMemberData(data) {
      this.member_data = data
    },

    leaveRegistrationAlert(alert_title) {
      let alert_body  = 'Are you sure you want to leave?'
      this.alert = { 
        display: true, 
        type: 'standard', 
        width:  this.steps === 2 || (this.process == 'REGISTRATION' && this.steps == 3) ? '450' : '650', 
        icon: 'mdi-help-circle', 
        color: 'primary', 
        title: alert_title === 'from_btn' ? 'Changes you have made will not be saved and the card will not be issued' : alert_title, 
        body: alert_body, 
        btn_pry_txt: this.steps == 5 ? 'NO, Stay on this page' : 'NO', 
        btn_pry_color: 'grey darken-2', 
        btn_pry_otl: true, 
        btn_pry_act: 'closeAlert',
        btn_sec_txt: this.steps == 5 ? 'YES, Back to homepage' : 'YES', 
        btn_sec_color: 'primary', 
        btn_sec_otl: false, 
        btn_sec_act: 'closeAlert', 
        btn_sec_emt: 'redirect' 
      }

    },

    redirect(type) {
      this.leave_approval = true
      if (type === 'for-logout') return this.$refs.alert.logoutUser();

      sessionStorage.clear()
      if(this.$store.state.usr_credentials.department === 'Data Encoder') {
        this.$router.replace('/offline-transaction')
      } else {
        this.$router.replace('/code-scanning')
      }
    }
  },

  beforeRouteLeave(to, from, next) {
    let session_data = sessionStorage.getItem("9xgF732sfgh") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("9xgF732sfgh"), "njGHDdd").toString(this.$crypto.enc.Utf8) ) : null
    if (session_data?.add_member_household) {
      this.leavePageAlert()
      return next(false)
    } else {
      if(this.leave_approval){
        next()
      }else{
        next(false)
        if(this.process === 'OFFLINE TRANSACTION') return this.redirect() 
        if (this.steps === 2 || (this.process == 'REGISTRATION' && this.steps == 3)) return this.leaveRegistrationAlert('Changes made will not be saved')
        else if (this.steps === 3 || this.steps === 4) return this.leaveRegistrationAlert('Changes made will not be saved and the card will not be issued')
        else if (this.steps === 5) { 
          this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow', title: 'PRINT / ISSUED CARD', body: "Please click 'PROCEED' if the card is printed or issued.", btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        } else { 
          return this.redirect()
        }
      }
    }
  },
}
</script>

<style scoped>
.absolute {
  position:absolute !important; 
  left:0; 
  right:0; 
  top:-40px;
}
.border-top {
  border-top:5px solid #1976d2 !important;
}
.color-text {
  color: #35363a !important
}

.fade-transition {
  animation: fadein 2s;
}

.body-container {
  padding:1em
}

@keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}

@media print {
  .body-container {padding: 0;}
}
</style>