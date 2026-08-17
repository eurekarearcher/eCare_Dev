<template>
  <div>
     <v-card class="mx-auto mb-5" width="880" >
          <div class="primary white--text text-center py-4">
            <h4><v-icon size="18" left dark>fas fa-hand-holding-medical</v-icon>Primary Care</h4>
          </div>
          <v-form @submit.prevent="validatePrimaryCare" v-model="form_is_valid" ref="form">
            <v-col cols="12" class="px-5 mt-5">
              <h6 class="font-weight-regular body-2">Healthcare Facility</h6>
              <h6 class="font-weight-medium body-1">{{  $store.state.prv_data.provider_name }}</h6>
            </v-col>

            <v-col cols="12" class="px-5" >
              <h6 class="font-weight-regular body-2">Doctor <em>(optional)</em></h6>
              <h6 v-if="has_primary_care && doctor_display" class="font-weight-medium body-1 mb-5">{{doctor_display}}</h6>
              <v-autocomplete
                v-else
                v-model="selected_doctor"
                :items="doctor_list" 
                :loading="doctor_list_loader"
                :disabled="doctor_list_loader"
                item-text="autoCompleteText" 
                placeholder="--Select Doctor---"
                return-object
                clearable
                outlined
                dense>
                <!--WHEN USER SELECT A DATA-->
                <template v-slot:selection="{item}">
                  <v-icon class="hidden-sm-and-down" small left>fas fa-user-md</v-icon>
                  <span class="grey--text text--darken-3 text-subtitle-2 text-md-subtitle-1">{{item.doctor_name}} / {{item.specialization}}</span>
                </template>

                <!--AUTO COMPLETE DISPLAYS-->
                <template v-slot:item="{ item }">
                  <v-list-item-avatar color="indigo white--text">{{ item.doctor_name.charAt(0)}}</v-list-item-avatar>
                  <v-list-item-content>
                      <v-list-item-title v-text="item.doctor_name"></v-list-item-title>
                      <v-list-item-subtitle v-text="item.specialization"></v-list-item-subtitle>
                  </v-list-item-content> 
                </template>
              </v-autocomplete>
           

            </v-col>


            <v-card-text class="py-0 mb-5 mx-2 font-weight-medium caption">**Note: <em>{{has_primary_care_note}}</em></v-card-text>

            <v-card-actions class="justify-end px-5 pt-3 pb-5">
              <v-btn v-if="!has_primary_care" @click="cancelPrimaryCare" type="button" color="primary" class="px-7 elevation-0" outlined>Skip</v-btn>
              <v-btn type="submit" class="primary elevation-0 px-5">Continue</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
       
        <!-- CONFIRMATION -->
        <v-dialog v-if="confirmation_alert" v-model="confirmation_alert"  width="650" persistent>
          <v-card class="text-center py-5 px-8">
            <v-card-title class="justify-center">
              <v-icon color="primary" size="80">mdi-alert-circle</v-icon>
            </v-card-title>
            <h3 class="grey--text text--darken-2 font-weight-regular mb-5">Please Confirm if the data is correct</h3>

            <v-col cols="12" class="">
                <div class="mb-3">
                  <h6 :class="[{ 'text-center' :has_primary_care}, 'text-left font-weight-medium body-2 caption']">Healthcare Facility</h6>
                  <h6 v-if="has_primary_care" class="font-weight-medium body-1 text-center mb-5">{{healthcare_display}}</h6>
                  <v-text-field v-else :value="selected_rhu.name" class="body-2" dense></v-text-field>
                </div>

                <div v-if="selected_doctor">
                  <h6 class="font-weight-medium body-2 text-left caption">Doctor</h6>
                  <v-text-field :value="`${selected_doctor.doctor_name} / ${selected_doctor.specialization || ''}`" class="body-2" dense></v-text-field>
                </div>
            </v-col>

            <v-card-actions class="justify-center mt-5">
                <v-btn @click="confirmation_alert = false" :disabled="confirmation_loader" color="primary" outlined class="pa-5 px-12" >EDIT</v-btn>
                <v-btn @click="submitPrimaryCare" :loading="confirmation_loader" color="primary" class=" pa-5 px-7">Proceed</v-btn>
            </v-card-actions>
          </v-card>
          
        </v-dialog>
    <Alert :alert="alert" @proceedNextStep="proceedNextStep"/>
  </div>
</template>

<script>
import Alert from '@/components/Alert.vue'

export default {
  props:['show_primary_care_dialog', 'process'],
  
  components: {Alert},

  mounted() {
    this.getSessionData();
  },

  data() {
    return {
      has_primary_care: null,
      show_dialog: this.show_primary_care_dialog,
      rhu_list_loader: true,
      rhu_list: [],
      selected_rhu: null,

      doctor_list_loader: false,
      doctor_list:[],
      selected_doctor: null,

      doctor_display:'',
      healthcare_display:'',
      
      form_is_valid: false,
      field_rules: [v => !!v && !/^ *$/.test(v) || 'Field is required.'],
      get_session: {},

      has_primary_care_note: 'Please note that there will be a 1 year lock in period in your selected Primary Care Facility',
      confirmation_alert: false,
      confirmation_loader: false,
      alert: {},
    }
  },

  
  methods: {
    getSessionData() {  // ADDD PARAMETER IF PRIMARY CARE WILL BE APPLIED IN ELIGIBLITY
      this.get_session = sessionStorage.getItem("9xgF732sfgh") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("9xgF732sfgh"), "njGHDdd").toString(this.$crypto.enc.Utf8) ) : {}

      if (this.get_session.has_primary_care) {
         this.has_primary_care = this.get_session.has_primary_care 
      } else {
         this.has_primary_care = (this.get_session.issuance_for_mobile && this.get_session?.primary_care_data) ? true : false
      }
  
      if (!this.has_primary_care) return this.setCurrentFacility()
      //IF DATA HAS PRIMARY CARE
      const {provider_name, doctor_name, specialization, provider_code, provider_tin} = this.get_session.primary_care_data
      this.healthcare_display = provider_name ? provider_name : ''
      this.has_primary_care_note= 'This member has an assigned healthcare facility already, this can be changed after a year of assignment.'

      if(!doctor_name) return this.getDoctorList(provider_code, provider_tin);
      return this.doctor_display = `${doctor_name || ''} / ${specialization || ''}`
    },
    
    setCurrentFacility() {
      const current_facility = {
        name: this.$store.state.prv_data.provider_name,
        provider_code: this.$store.state.prv_data.provider_code,
        provider_tin: this.$store.state.prv_data.provider_tin
      };

      this.selected_rhu = current_facility;
      this.validateSelectedRHU();
    },

    validateSelectedRHU() {
      this.doctor_list = [], this.selected_doctor = null

      if (!this.selected_rhu) return
    
      const {provider_code, provider_tin} = this.selected_rhu
      this.getDoctorList(provider_code, provider_tin);
    },

    async getDoctorList(provider_code, provider_tin) {
      this.doctor_list_loader = true
     
      let response = await this.$services.getTransactionIpRefData({
        request_key: "patient_doctor",
        host_doctor: 'LGU',
        provider_code: provider_code,
        provider_tin: provider_tin,
        lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
        is_post_encoding: 1
      })

      if(response.status === 200) {
        this.doctor_list_loader = false
      
        response.data = this.responseDataDecryption(response.data)
        if(response.data == 'Data not found.') return this.doctor_list = [], this.selected_doctor = null

        this.doctor_list = response.data.map(data => {
          return {
            doctor_name            : data.doctor_name.replace(/[,.]/g, ''),
            doctor_code            : data.hmo_doctor_code,
            specialization         : data.specialization,
            doctor_tin             : data.doctor_tin_no,
            autoCompleteText       : `${data.doctor_name} / ${data.specialization} ${data.doctor_tin_no}`,
          }
        })

      } else {
        this.alert = response.error
      }
    },

    validatePrimaryCare() {
      if (!this.form_is_valid) {
        this.$refs.form.validate()
        this.alert = {display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Field is empty/Invalid Value', body: 'Please fill out all required fields.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        return 
      } 
      this.continuePrimaryCare();
    },

    async submitPrimaryCare() {
      this.confirmation_loader = true

      let response = await this.$services.wsMemberWeb({
        key:"eurekare_key_web",
        data: {
            command: "322101003",
            data: {
              member_primary_care_id: this.get_session?.primary_care_data?.member_primary_care_id || undefined,
              ek_id: this.get_session?.user_data?.ek_id || undefined,
              ek_lgu_id: this.get_session.ek_lgu_id || undefined,
              ek_hmo_id: this.get_session?.user_data?.ek_hmo_id || undefined,
              lgu_number: this.get_session?.user_data?.lgu_number || undefined,
              policy_number:  this.get_session?.user_data?.mem_hmo_policy_number || undefined,
              phic_number:  this.get_session?.user_data?.phic_number || undefined,
              provider_code: this.selected_rhu && this.selected_rhu.provider_code ? this.selected_rhu.provider_code : this.get_session?.primary_care_data?.provider_code,
              provider_tin: this.selected_rhu && this.selected_rhu.provider_tin ? this.selected_rhu.provider_tin : this.get_session?.primary_care_data?.provider_tin,
              doctor_code: this.selected_doctor?.doctor_code ?  this.selected_doctor.doctor_code : undefined,
              doctor_tin: this.selected_doctor?.doctor_tin ?  this.selected_doctor.doctor_tin : undefined,
          }
        }
      })

      if(response.status === 200) {
        this.confirmation_loader = false
        if (!response.data.is_success) {
            return this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' } 
        }
        this.proceedNextStep();
      } else {
        this.alert = response.error
      }
    },

    proceedNextStep() {

      this.get_session.step = this.process === 'REGISTRATION'? 5 : 4
      sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(this.get_session), 'njGHDdd'))
      this.$emit('change-step', this.get_session.step)
    },

    cancelPrimaryCare() {
      this.alert = { 
        display: true, 
        type: 'standard',
        width: '600', 
        icon: 'mdi-alert-circle', 
        color: 'primary', 
        title: 'Are you sure you want to skip assigning a Primary Care Facility?', 
        body: '', 
        btn_pry_txt: 'Cancel', 
        btn_pry_color: 'primary', 
        btn_pry_otl: true,
        btn_pry_act: 'closeAlert',
        btn_sec_txt: 'Skip', 
        btn_sec_color: 'primary', 
        btn_sec_otl: false,
        btn_sec_class: 'px-10', 
        btn_sec_act: 'closeAlert',
        btn_sec_emt: 'proceedNextStep'
      }
    },

    continuePrimaryCare() {
      if((this.has_primary_care && this.doctor_name) || this.has_primary_care && !this.selected_doctor) return this.proceedNextStep()
      this.confirmation_alert = true
    },

    emitSessionData(has_primarycare_cancel) {
      this.$emit('change-session-data', has_primarycare_cancel)
    },

    
  }
}
</script>
