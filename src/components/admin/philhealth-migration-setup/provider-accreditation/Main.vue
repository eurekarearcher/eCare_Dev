<template>
  <v-container class="home fill-height">
    <div class="mx-auto">
      <v-card width="800" class="py-5">
       
        <v-tabs v-model="tab_type" class="px-3">
          <v-tab>Yakap</v-tab>
          <v-tab v-if="$eclaims_available">E-Claims</v-tab>
        </v-tabs>
        <v-divider class="mt-3"/>
        <v-tabs-items v-model="tab_type" @change="getAccreditation">
            <v-tab-item>
                <h1 class="primary--text font-weight-medium text-center mt-10">YAKAP</h1>
                <h3 class="text-center font-weight-regular mb-5">Provider Accreditation</h3>
            </v-tab-item>
                
             <v-tab-item>
                <h1 class="primary--text font-weight-medium text-center mt-10">e-Claims</h1>
                <h3 class="text-center font-weight-regular mb-5">Provider Accreditation</h3>
            </v-tab-item>
        </v-tabs-items>
        
        <div v-if="loading_data" class="d-flex flex-column align-center justify-center mt-8 py-10">
          <v-progress-circular color="primary" :size="70" :width="6" indeterminate ></v-progress-circular>
          <h4 class="text--secondary body-2 mt-6">Loading Data... Please wait...</h4>
        </div>

        <v-form @submit.prevent="checkAccreditation" v-if="!loading_data" ref="providerAccreditation" class="px-15">
          <v-card-text class="pa-0 mb-4">Accreditation Status: <br/>
            <b :class="accreditation_status ? 'success--text' : 'error--text'">{{ accreditation_status ? 'Records Found' : 'No Records Found' }} </b>
          </v-card-text>

          <!-- <div class="mb-1">
            <label>HCI Username</label>
            <v-text-field v-model="hci_username" filled></v-text-field>
          </div>

          <div class="mb-1">
            <label>HCI Password</label>
            <v-text-field v-model="hci_password" type="password" filled></v-text-field>
          </div> -->

          <div class="mb-1">
            <label>Software Accreditation</label>
            <v-text-field v-model="hci_software_accr" :rules="empty_validation" filled></v-text-field>
          </div>

          <div class="mb-1">
            <label>Accreditation Number</label>
            <v-text-field v-model="hci_hospital_code" :rules="empty_validation" filled></v-text-field>
          </div>

          <div class="mb-1">
            <label>Cipher Key</label>
            <v-text-field v-model="hci_cipher_key" :rules="tab_type === 0 ? empty_validation : []" filled></v-text-field>
          </div>

          <div class="mb-1">
            <label>PMMC Number</label>
            <v-text-field v-model="hci_pmmc_number" :rules="tab_type === 0 ? empty_validation : []" filled></v-text-field>
          </div>

          <div v-if="tab_type === 0" class="mb-1">
            <label>Maximum Patient Load</label>
            <v-select v-model="maximum_patient_load" :rules="tab_type === 0 ? empty_validation : []" :items="patient_load_list" filled></v-select>
          </div>

          <v-btn class="primary mt-5 mb-15" type="submit" :loading="btn_loader" x-large block >{{ hci_hospital_code ? 'UPDATE ACCREDITATION' : 'CHECK ACCREDITATION' }}</v-btn>
        </v-form>


      </v-card>
    </div>

    <Alert :alert="alert" />
  </v-container>
</template>

<script>
import Alert from '@/components/Alert'
import * as CryptoJS from 'crypto-js';

export default {
  components: {
    Alert
  },

  data() {
    return {
      tab_type: 0,
      // hci_username: '',
      // hci_password: '',
      hci_software_accr: '',
      hci_hospital_code: '',
      hci_cipher_key: '',
      hci_pmmc_number: '',
      maximum_patient_load: '',
      patient_load_list: ['5000', '10000', '20000', '30000', '40000', '50000', '60000', '70000', '80000', '90000', '100000'],

      loading_data: false,
      btn_loader: false,

      accreditation_status: false,

      // FORM VALIDATION
      empty_validation: [
          v => !!v && !/^ *$/.test(v) || 'Required Field',
      ],
      provider_data: localStorage.getItem('TW4LM') ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('TW4LM'), 'mExf9Y1b').toString(CryptoJS.enc.Utf8)) : null,

      alert : {}
    }
  },

  mounted() {
    this.getAccreditation()
  },

  watch: {
    tab_type() {
      this.getAccreditation()
    }
  },

  methods: {
    async getAccreditation() {
      this.loading_data = true

      let response = await this.$services.getAccreditationCredentials({
          provider_code: this.$store.state.prv_data.provider_code
      })

      if (response.status === 200) {
        response.data = this.responseDataDecryption(response.data)

      if (this.tab_type === 0) {
        this.hci_software_accr = response.data.ekonsulta.credentials?.hci_software_accreditation || null
        this.hci_hospital_code = response.data.ekonsulta.credentials?.hci_hospital_code || null
        this.hci_cipher_key = response.data.ekonsulta.credentials?.hci_cipher_key || null
        this.hci_pmmc_number = response.data.ekonsulta.credentials?.pmmc_no || null
        this.maximum_patient_load = response.data.ekonsulta.credentials?.maximum_patient_load || null
      } else {
        this.hci_software_accr =response.data.eclaims?.credentials?.hci_software_accreditation || null
        this.hci_hospital_code = response.data.eclaims?.credentials?.hci_hospital_code || null
      }

        // this.accreditation_status = this.tab_type === 0 ? response.data.ekonsulta?.accreditation_status : false || this.tab_type === 1 ? response.data.eclaims?.accreditation_status : false
        this.accreditation_status = this.tab_type === 0 ? response.data.ekonsulta?.accreditation_status ?? false : response.data.eclaims?.accreditation_status ?? false
        this.$store.commit('setProviderCipherKey', this.hci_cipher_key)
        this.getProviderInfo()
        this.loading_data = false
      } else {
        this.alert = response.error
      }
    },

    async getProviderInfo() {
      let response = await this.$services.getProviderInfo({
          provider_code: this.$store.state.prv_data.provider_code,
          provider_tin: '',
      })

      if (response.status === 200) {
        response.data = this.responseDataDecryption( response.data)
        this.$store.state.prv_data.phic_token = response.data.phic_token || ''
        this.$store.state.prv_data.ekonsulta_phic_acc_no = response.data.phic_acc_no || ''
        this.provider_data = response.data.phic_token || ''
      } else {
        this.alert = response.error
      }
    },

    async checkAccreditation() {
      if (this.$refs.providerAccreditation.validate()) {  
        this.btn_loader = true
        let response = await this.$services.prvUpdProviderForToken({
            // hci_user_name: this.hci_username,
            // hci_password: this.hci_password,
            hci_software_accreditation: this.hci_software_accr,
            hci_hospital_code: this.hci_hospital_code,
            hci_cipher_key: this.hci_cipher_key,
            hci_pmmc_number: this.hci_pmmc_number,
            provider_code: this.$store.state.prv_data.provider_code,
            maximum_patient_load: this.maximum_patient_load,
            accreditation_type: this.tab_type === 0 ? 'ekonsulta' : 'eclaims'
        })

        if (response.status === 200) {
          this.btn_loader = false
          response.data = this.responseDataDecryption(response.data)
      
          if (response.data.ekonsulta_accredited) {
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'success', title: 'Provider Accreditation', body: 'Accreditation record has been updated', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          } else {
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'info', title: 'Provider Accreditation', body: 'No Accreditation record found', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          }
        } else {
          // this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'info', title: 'PhilHealth server failed.', body: 'The system cannot find the accreditation record due to philhealth webservice. ', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'info', title: 'PhilHealth server failed.', body: 'Connection to the PhilHealth server failed. The system cannot verify the Yakap Accreditation status at this time.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        }
      }
    }
  }
}
</script>
