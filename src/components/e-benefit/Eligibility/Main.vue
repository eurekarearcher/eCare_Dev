<template>
  <v-container fluid fill-height class="pb-0 px-0">
    <Navbar :navbar="navbar"/>
      <v-layout v-if="page_loader" justify-center align-center wrap>
        <v-progress-circular size="35" color="primary" indeterminate></v-progress-circular>
        <h4 class="loader-title"> Loading Eligibility Page... Please wait...</h4>
      </v-layout>
      
      <v-layout v-else flex-column justify-space-between>
        <EligibilityGen 
          :process_type="process_type"
          :member_data="member_data.member"
          :isAccredited="member_data.isAccredited"
          :provider_name="$store.state.prv_data.provider_name"
          :has_referral="has_referral_data"
          :has_transaction="has_transaction_data"
          :selected_referral="selected_referral"
          :selected_transaction="selected_transaction"
          :transaction_data="transaction_data"
          :referral_data="referral_data" 
          :migration_enabled="migration_enabled"
          @viewReferrals="$refs.referral_list.display_referal = true"
          @cancel-referral="cancelReferral"
          @cancel-transaction="cancelTransaction"
          @view-referral-transaction-dialog="viewReferralTransactionDialog"
          class="px-12"
        />
        <v-divider> </v-divider>
        <div v-if="member_data.config" class="d-flex justify-space-around justify-sm-center pt-4 pb-4">
          <div v-for="nav in display_nav_buttons" :key="nav.name" class="px-2 px-sm-6 text-center">
            <v-btn @click="navigationButton(nav.auth, nav.name)" :disabled="disabled_nav_btn ||  nav.disabled" class="blu" color="#01579b" elevation="3" outlined fab>
            <v-icon>{{nav.icon}}</v-icon></v-btn>
            <h5 :class="disabled_nav_btn ? 'grey--text': 'grey--text text--darken-2'" class="mt-2 font-weight-medium text-uppercase">{{nav.display_name}}</h5>
          </div>
        </div>
        
        <div v-else class="d-flex justify-center pt-4 pb-4">
          <v-col sm="4">
          <h5 class="text-center font-weight-regular" >Loading please wait...</h5>
          <v-progress-linear style="opacity:0.8" color="light-blue darken-4" height="10" indeterminate rounded></v-progress-linear>
          </v-col>
        </div>

      </v-layout>

      <v-dialog v-model="display_referral_transaction"  persistent>
        <v-card>
        <v-card-title class="text-caption text-sm-h6 justify-center light-blue darken-4 white--text">{{ $store.state.usr_credentials.department === 'Data Encoder' && migration_enabled ? 'REFERRAL & MIGRATED TRANSACTION LIST' : 'REFERRAL LIST'}}</v-card-title>
          <v-tabs v-model="referral_transaction_tab" class="pl-5">
            <v-tab>REFERRALS</v-tab>
            <v-tab v-if="$store.state.usr_credentials.department === 'Data Encoder' && migration_enabled">MIGRATED TRANSACTIONS</v-tab>
          </v-tabs>
          <v-tabs-items v-model="referral_transaction_tab">
              <v-tab-item>
              <PatientReferralList
                  @has-referral-data ="changeHasReferralData" 
                  @disabled-outpatient-btn ="nav_buttons[1].disabled = true"
                  @enabled-outpatient-btn ="nav_buttons[1].disabled = false"
                  @change-selected-referral ="changeSelectedReferral"
                  @proceed-selection="proceedSelection" 
                  @other-transaction-referral="otherTransactionReferral"
                  :selected_referral="selected_referral"
                  :ek_lgu_data ="ek_lgu_data"
                  :referral_data="referral_data"
                  ref="referral_list"/>
              </v-tab-item>
              <v-tab-item>
                <PatientTransactionList 
                ref="patient_transaction_list" 
                :member_data="member_data"
                :selected_transaction="selected_transaction"
                :transaction_data="transaction_data"
                @change-selected-transaction="changeSelectedTransaction"
                @cancel-selected-transaction="cancelSelectedTransaction"
                @proceed-selection="proceedSelection"
                @other-transaction-referral="otherTransactionReferral" />
              </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-dialog>

    <Alert :alert="alert" @backQr="backQr"/>

  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'
import EligibilityGen from '@/components/e-benefit/Eligibility/EligibilityGen.vue'
import PatientReferralList from '@/components/e-benefit/Eligibility/PatientReferralList.vue'
import PatientTransactionList from '@/components/e-benefit/Eligibility/PatientTransactionList.vue'

import { mapState } from 'vuex'
export default {
  name: 'Eligibility',
  components:{Navbar, Alert ,EligibilityGen, PatientReferralList,PatientTransactionList},
  data() {
    return {
      // SESSION DATA
      //FOR REFERRAL AND EDIT TRANSACTION
      selected_referral: sessionStorage.getItem('S2GSXfkF') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('S2GSXfkF'), 'lfFo34sf').toString(this.$crypto.enc.Utf8)) : null,
      selected_transaction: sessionStorage.getItem('T3HGYTWW') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('T3HGYTWW'), 'ghyjTLf').toString(this.$crypto.enc.Utf8)) : null,
      referral_data: sessionStorage.getItem('R2GSXfkF') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('R2GSXfkF'), 'lfFo34sf').toString(this.$crypto.enc.Utf8)) : {
        fresh_load: true,
        has_data: false,
        data: [],
      },
      transaction_data: sessionStorage.getItem('MGTYHF') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('MGTYHF'), 't2Jhfn').toString(this.$crypto.enc.Utf8)) : {
        fresh_load: this.migration_enabled ? true : false,
        has_data: false,
        data: [],
      },

      ek_lgu_data: sessionStorage.getItem("LMS35")? JSON.parse( this.$crypto.AES.decrypt( sessionStorage.getItem("LMS35"), "lfFo34sf").toString(this.$crypto.enc.Utf8) ): null,
      process_type: sessionStorage.getItem("GF45S")? this.$crypto.AES.decrypt( sessionStorage.getItem("GF45S"), "fgGds32s" ).toString(this.$crypto.enc.Utf8) : null,
      payload: {
        host_code: sessionStorage.getItem("IJ19Y0X15I")? this.$crypto.AES.decrypt( sessionStorage.getItem("IJ19Y0X15I"), "heIu1h1Dn1w" ).toString(this.$crypto.enc.Utf8): null,
        policy_no: sessionStorage.getItem("IJ9NX250I15")? this.$crypto.AES.decrypt( sessionStorage.getItem("IJ9NX250I15"),"heIu1h1Dn1w" ).toString(this.$crypto.enc.Utf8): null,
      },

      // NAVIGATION BUTTON
      nav_buttons: [
        {name:'admission',display_name:'consultation', icon: 'fas fa-stethoscope', auth: 'pvceifcaqpcig', disabled: false},
        // {name:'outpatient', display_name:'outpatient', icon: 'fas fa-user-injured', auth: 'gcicaqeifpcv', disabled: false},
        // {name:'inpatient', display_name:'inpatient', icon: 'fas fa-procedures', auth: 'acpfeivcpgci', disabled: false},
      ],
            
      // NAVBAR
      navbar: [{ title: "Home", link: "/code-scanning", icon: "fas fa-home" }],
      // ALERTS
      alert: {},

      //FOR REFERRAL AND TRANSACTION DIALOG
      has_referral_data: null,
      has_transaction_data: null,
      referral_transaction_tab: 0,
      display_referral_transaction: false,

      transaction_timeout_id: null,

      migration_enabled: false
    }
  },

  computed: {
    // GET MEMBER DATA FROM STORE JS
    ...mapState(["member_data"]),

    // FOR VALIDATING WETHER TO SHOW PAGE LOADER
    page_loader() {
      if (this.member_data?.member && this.has_referral == null) {
        const status = this.member_data.member.eligibility_status
        if (this.process_type === 'LGU' && (status === 'Patient is Currently Admitted' || status === 'Transaction On Going')) {
          this.memberStatus(this.member_data.member.eligibility_status)
          return true
        }
        return false
      } else {
        return true
      }
    },

    // FOR VALIDATING IF THE BUTTON MUST BE DISABLED
    disabled_nav_btn () {
      return this.process_type === 'HMO' && (this.member_data.member.mem_hmo_status !== 'ACTIVE' || !this.member_data.isAccredited)
    },

    // FOR VALIDATING ON WHAT BUTTON TO SHOW
    display_nav_buttons() {
      if (this.$store.state.usr_credentials?.provider_reg_type === 'BRGY' || this.$store.state.usr_credentials?.provider_reg_type === 'RHU') {
        return this.nav_buttons.filter(item => item.name !== 'outpatient').map(item => {
          if(item.name === 'admission') item.display_name = 'consultation'
          // if(item.name === 'admission') item.display_name = 'consultation / outpatient'
          return item
        })
      } 
      return this.nav_buttons
    },
  },

  mounted() {
    this.callData();

    if (this.$store.state.usr_credentials?.provider_reg_type !== 'BRGY') {
      //this.$refs.referral_list.validateUserHasReferral();
    } else {
      this.changeHasReferralData(false);
    }
    // if(this.member_data){
    //   this.trnUpdMemberTransactionStatus()
    // }
  },
  
  methods: {
    async trnUpdMemberTransactionStatus() {
      if(this.member_data){
        try {
          await this.$store.dispatch('trnUpdMemberTransactionStatus', {
            ek_lgu_id:  this.member_data.member.ek_lgu_id,
            process_by: this.$store.state.usr_credentials.user_name,
          });
        } finally {
          this.transaction_timeout_id = setTimeout(() => {
            this.trnUpdMemberTransactionStatus();
          }, 25000);
        }
      }
    },

    //FOR VALIDATING WHETHER TO LOAD THE API FOR MEMBER/CONFIG OR NOT
    async callData() {
      if (this.member_data) {
        if (!this.member_data?.config) await this.dispatchConfig();
        if(this.referral_data.has_data) this.display_referral_transaction=true
        this.trnUpdMemberTransactionStatus()
      } else {
        await this.dispatchEligibility();
        await this.dispatchConfig();
        
        //GET REFERRAL AND TRANSACTION LIST
        if(this.$store.state.usr_credentials.department === 'Data Encoder' && this.migration_enabled) {
          await this.getTransactionRecords()
        } else{ 
          this.transaction_data.fresh_load = false
        }

        const eligibility_status = this.member_data?.member?.eligibility_status
        if (this.process_type === 'LGU' && !['Patient is Currently Admitted', 'Transaction On Going'].includes(eligibility_status)) {
          await this.validateUserHasReferral()
        }

        // FOR REMOVING THE ICD/CPT LIST *TO PREVENT ICD/CPT FROM EMR*
        this.$store.commit('set_cpt_list', [])
        this.$store.commit('set_icd_list', [])

        // REMOVE SESSION AFTER CALLING ELIGIBILITY AND CONFIG DATA
        sessionStorage.removeItem('LMS35')
        sessionStorage.removeItem('IJ19Y0X15I')
        sessionStorage.removeItem('IJ9NX250I15')
      }
    },

    //FOR CALLING ELIGIBILITY API'S FROM STORE JS
    async dispatchEligibility() {
      if (this.process_type.includes('LGU')) {
        await this.$store.dispatch("getLGUMemberData", this.ek_lgu_data);
      }  

      if (this.process_type !== 'LGU' && this.process_type !== 'PHIC_LGU') {
        await this.$store.dispatch("getMemberData", this.payload);
      }
    },

    // FOR CALLING CONFIG API'S FROM STORE JS
    async dispatchConfig() {
      let config_params = {}
      if (this.process_type.includes('HMO')){
         config_params = {post: 'HMO', host_code: this.payload.host_code}
      } else if (this.process_type === 'LGU' || this.process_type === 'PHIC_LGU') {
        config_params =  {post:'LGU',host_code:this.ek_lgu_data.lgu_host_code}
      } else {
        config_params = {post:'PHIC',host_code: 'PHIC'}
      }
      await this.$store.dispatch("getHostConfig", config_params) //PHIC
    },

    // FOR REDIRECTING TO SPECIFIC PAGE, BASED ON THE BUTTON THAT WAS CLICKED 
    navigationButton(session,to){
      let generated_number = Math.random().toString(25).substring(3, 25);
      sessionStorage.setItem(session, generated_number)
      let route = ''
      if(to === 'outpatient' || to === 'inpatient') {
        route = to
      } else {
        route = this.$store.state.usr_credentials.user_settings.user_layout === 'type_a' ? 'admission/consultation' : 'admission'
      }
      
      this.$router.push('/' + route)
    },

    //FOR SHOWING ALERT BASED ON THE STATUS PARAMETER
    memberStatus(status){
      this.alert = { 
        display: true, 
        type: 'standard', 
        width: status === 'Transaction On Going' ? "550" : "400", 
        icon: 'mdi-alert-circle', 
        color: status === 'Transaction On Going' ? "yellow darken-1" : "red lighten-1", 
        title: status === 'Transaction On Going' ? status : 'Patient: <h4 class="font-weight-medium">' +this.member_data.member.p_name +'</h4>', 
        body: status  === 'Transaction On Going' ? "This patient has on going transaction and needs to be completed before proceeding to another transaction." :"is currently admitted", 
        btn_pry_txt: 'OK', 
        btn_pry_color: 'primary', 
        btn_pry_otl: false, 
        btn_pry_act: 'closeAlert', 
        btn_pry_emt: 'backQr',
      }
    },

    //FOR CHANGING THE VALUE OF HAS_REFERRAL_DATA VARIABLE AFTER CALLING THE REFERRAL LIST API
    changeHasReferralData(status) {
      this.has_referral_data = status
    },

    //FOR GETTING THE VALUE OF SELECTED REFERRAL WHEN OPERATOR CLICKED THE CONTINUE WITH THIS TRANSACTION
    changeSelectedReferral(data) {
      this.selected_referral = data
    },

    //FOR REMOVING THE SELECTED REFERRAL AND OPENING THE REFERRAL LIST.
    cancelReferral() {
      sessionStorage.removeItem('S2GSXfkF')
      this.selected_referral = null
    },

    //FOR REDIRECTING TO ADMISSION DASHBOARD PAGE
    backQr(){
      sessionStorage.clear()
      if(this.$store.state.usr_credentials.department === 'Admission') {
        this.$router.replace('/code-scanning')
      } else {
        this.$router.replace('/offline-transaction')
      }
    },

    //UPDATES FOR THE EDIT TRANSACTION AND referral_data
    otherTransactionReferral(data){
      this.selected_referral = data
      this.selected_transaction = data
      this.display_referral_transaction = false
    },

    proceedSelection() {
      this.display_referral_transaction=false
    },

    viewReferralTransactionDialog() {
      this.display_referral_transaction=true
    },

    async getTransactionRecords(){
      let response = await this.$services.getTransactionPreviousByType({
        transaction_type: 'ALL',
        from_xml_migration: 1,
        first_name: this.member_data.member.mem_first_name,
        middle_name: this.member_data.member.mem_middle_name,
        last_name: this.member_data.member.mem_last_name,
        suffix: this.member_data.member.mem_suffix,
        birthday: this.member_data.member.mem_birthdate,
        hmo_policy_number: this.member_data.member.hmo_policy_number,
        hmo_host_code: this.member_data?.config?.hmo_host_code ?? null,
        ek_phic_id: this.member_data.member.ek_phic_id,
        ek_lgu_id: this.member_data.member.ek_lgu_id,
        lgu_host_code: this.member_data.member.lgu_host_code
      })

      if (response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        
        this.transaction_data.has_data   = false
        this.transaction_data.fresh_load = false
        if(response.data === 'Data not found.'){
          sessionStorage.setItem('MGTYHF', this.$crypto.AES.encrypt(JSON.stringify(this.transaction_data), 't2Jhfn'))
          return 
        }
          
        // this.transaction_data.data = response.data.filter(item => !item.lab_result_exist)
        this.transaction_data.data = response.data
        if(this.transaction_data.data.length>0) {
          this.transaction_data.has_data   = true
          this.transaction_data.fresh_load = false
        }

        sessionStorage.setItem('MGTYHF', this.$crypto.AES.encrypt(JSON.stringify(this.transaction_data), 't2Jhfn'))
      } else {
        this.alert = response.error
      }
    },

    // FOR CALLING THE PATIENT'S LIST OF REFERRAL TRANSACTIONS
    async validateUserHasReferral() {
      if (this.referral_data.fresh_load) {
        let response = await this.$services.getPatientReferralTransaction({
          ek_lgu_id: this.ek_lgu_data.ek_lgu_id
        })

        if(response.status === 200) {
          if (response.data === 'No Data') {
            this.referral_data.fresh_load = false
            this.referral_data.has_data   = false
            this.changeHasReferralData(this.referral_data.has_data)
            sessionStorage.setItem('R2GSXfkF', this.$crypto.AES.encrypt(JSON.stringify(this.referral_data), 'lfFo34sf'))
            return 
          }

          response.data = this.responseDataDecryption(response.data)
          this.referral_data.data = response.data.map(items => {
            if (items.referral_doctor_first_name || items.referral_doctor_middle_name  || items.referral_doctor_last_name) {
              items.doctor_full_name = `DR. ${items.referral_doctor_first_name || ''} ${items.referral_doctor_middle_name || ''} ${items.referral_doctor_last_name || ''}`
            } else {
              items.doctor_full_name = ''
            }
            return items
          })
  
          this.loading_data = false
          this.referral_data.has_data   = true
          this.referral_data.fresh_load = false
          this.display_referral_transaction=true
          this.changeHasReferralData(this.referral_data.has_data)
          sessionStorage.setItem('R2GSXfkF', this.$crypto.AES.encrypt(JSON.stringify(this.referral_data), 'lfFo34sf'))
          return 
        }
      } else {
        this.changeHasReferralData(this.referral_data.has_data)
      }
    },

    changeSelectedTransaction(data) {
      this.selected_transaction = data
    },
    
    cancelSelectedTransaction() {
      sessionStorage.removeItem('T3HGYTWW')
      this.selected_transaction = null
    },

     //FOR REMOVING THE SELECTED TRANSACTION
    cancelTransaction() {
      sessionStorage.removeItem('T3HGYTWW')
      this.selected_transaction = null
    },

    beforeDestroy() {
      clearTimeout(this.transaction_timeout_id);
    }
  },
}
</script>

<style scoped>

.blu i:not(.blue) {
  color: #01579b !important;
  border-color: #01579b;
}

.blu:hover {
  background: #01579b !important;
  transform: scale(1.15);
  transition: 0.5s;
  box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2),
    0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12) !important;
}
.blu:hover i:not(:hover) {
  color: white !important;
  transform: scale(1.17);
  transition: 0.5s;
}
.blu i:hover {
  color: white !important;
  transform: scale(1.17);
}
</style>