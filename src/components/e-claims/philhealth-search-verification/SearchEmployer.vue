<template>
  <v-container fluid id="web-registration" class="pa-0 ma-0">
    <Navbar :navbar="navbar" class="d-print-none"/>

    <v-row dense class="mx-0">
    
        <v-col cols="12" md="11" class="mx-auto body-container">
            <h1 class="text-h5 text-center grey--text text--darken-3 font-weight-medium mt-7 d-print-none">PHILHEALTH SEARCH EMPLOYER</h1>
            <v-divider class="mt-5"></v-divider>
        </v-col>
    
        <v-col cols="12" md="11" class="mx-auto body-container">
            <v-card class="mb-4 mx-auto rounded-lg" width="700">
                    <div class="primary white--text text-center py-4">
                        <h4 class="mt-1"><v-icon size="22" dark>mdi-account-search</v-icon> Philhealth Search Employer </h4>
                        <h5 class="font-weight-regular ">Please fill out all required fields</h5>
                    </div>
        
                    <div class="px-10 py-5 py-xl-5">
                        <v-form ref="form">
                            <h5 class="my-xl-4 font-weight-regular">Type Employer Name <span class="red--text">*</span></h5>
                            <v-text-field v-model="employer_name" @keyup.enter="searchEmployerRecord" @paste="handlePaste($event, 'employer_name')" @input="employer_name = sanitizeAndCapitalize($event)" :rules="[...verification_rules, ...verification_spacing ]" maxlength="60" clearable  dense></v-text-field>
                            
                            <v-sheet v-if="employer_list.success">
                                <div class="d-flex  justify-space-between align-center py-2">
                                    <h4 class="text-start"> Employer Record </h4>
                                    <h4 class="caption grey--text text--darken-1"> As Of: {{ employer_list.asof }} </h4>
                                </div>
                                <div>
                                    <div class="caption grey--text text--darken-1"></div>
                                </div>
                                <div v-for="(employer, key) in employer_list.employers" :key="key" class="d-flex flex-column">
                                    <div class="pt-1 pb-4 py-xl-5">
                                        <v-row dense>
                                            <v-col cols="12" sm="4" md="4" lg="4">
                                                <div class="caption grey--text text--darken-1">Employer Name</div>
                                                <div class="subtitle-2 font-weight-medium">{{ employer.name }}</div>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="4" lg="4">
                                                <div class="caption grey--text text--darken-1">Employer TIN</div>
                                                <div class="subtitle-2 font-weight-medium">{{ employer.philhealthno }}</div>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="4" lg="4">
                                                <div class="caption grey--text text--darken-1">Employer Address</div>
                                                <div class="subtitle-2 font-weight-medium">{{ employer.address }}</div>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </div>
                                <v-divider></v-divider>
                            </v-sheet>

                            <v-layout wrap justify-space-between mt-5 mb-3>
                                <v-btn @click="resetForm" class="elevation-0" tile >Clear Form</v-btn>
                                <v-btn @click="searchEmployerRecord" class="ml-auto" color="primary" :loading="loading">Search Record</v-btn>
                            </v-layout>
                        </v-form>
                    </div>
            </v-card>
        </v-col>
    </v-row>

    <v-overlay v-if="loading" z-index="9999"> 
      <v-progress-circular indeterminate size="35"></v-progress-circular>
      <span  class="ml-3 text-h6 font-weight-regular" >Searching... Please Wait...</span>
    </v-overlay>

    <Alert :alert="alert" class="d-print-none" ref="alert"/>
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'

export default {
  components: {
    Navbar,
    Alert,
  },

  data() {
    return {
      alert: {},
      navbar: [
        { title: 'Member Eligibility', link: '/eclaims-member-eligibility-checker', icon: 'fas fa-user' },
        { title: "HCP Accreditation", link: "/eclaims-hcp-accreditation", icon: "fas fa-user-doctor" }, 
        { title: "Search Member PIN", link: "/eclaims-retrieve-pin", icon: "fas fa-id-card" },
        { title: "Migrated Records", link: "/eclaims-migrated-records", icon: "fa-file-import" },
        { title: 'Claims Patient List', link: '../eclaims-patient-list', icon: 'fas fa-folder' },
        
      ],
      
      employer_name: '',

      employer_list: [],

      retrieve_pin_dialog: false,
      loading: false,

      verification_rules: [
          v => !!v && !/^ *$/.test(v),
          v => !/^\s/.test(v) || 'This field is required',
      ],

      verification_spacing: [
          v => !/^\s/.test(v) || 'Spaces are not allowed at the beginning',
          v => !/\s$/.test(v) || 'Spaces are not allowed at the end',
          v => !/\s{2,}/.test(v) || 'Double spacing is not allowed'
      ]
    }
  },

  methods: {
    async searchEmployerRecord() {
      if (this.$refs.form.validate()) { 
        this.employer_list = [] 
        this.loading = true
        let response = await this.$services.getEclaimsWebService({
          provider_code: this.$store.state.prv_data.provider_code,
          request_key: "SEM",
          data: {
            "employername": this.employer_name
          }
        });

        if (response.status === 200) {
            this.loading = false
            response.data = this.responseDataDecryption(response.data)
            if(response.data.success){
                this.employer_list = response.data
            } else {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'No Record Found', body: 'No record found for the given employer name.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }
        } else{
            this.loading = false
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      }
    },

    handlePaste(event, field) {
      event.preventDefault()

      const paste_data = (event.clipboardData || window.clipboardData).getData('text')

      this[field] = this.sanitizeAndCapitalize(paste_data)
    },

    sanitizeAndCapitalize(value) {
      if (!value) return ''

      value = value
          .replace(/^\s+/, '')     // remove leading spaces
          .replace(/\s+$/, '')     // remove trailing spaces
          .replace(/\s{2,}/g, ' ') // remove double spaces

      return this.textCapitalize(value)
    },

    resetForm() {
      this.$refs.form.reset()
      this.employer_list = []
    }
  }
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

.body-container {
  padding:1em
}
</style>