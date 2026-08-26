<template>
  <v-container fluid id="web-registration" class="pa-0 ma-0">
    <Navbar :navbar="navbar" class="d-print-none"/>

    <v-row dense class="mx-0">
    
        <v-col cols="12" md="11" class="mx-auto body-container">
            <h1 class="text-h5 text-center grey--text text--darken-3 font-weight-medium mt-7 d-print-none">PHILHEALTH MEMBER ELIGIBILITY CHECKER</h1>
            <v-divider class="mt-5"></v-divider>
        </v-col>
    
        <v-col cols="12" md="11" class="mx-auto body-container">
            <v-card class="mb-4 mx-auto rounded-lg" width="700">
                    <div class="primary white--text text-center py-4">
                        <h4 class="mt-1"><v-icon size="22" dark>mdi-account-search</v-icon> Philhealth Member Eligiblity Checker </h4>
                        <h5 class="font-weight-regular ">Please fill out all required fields to search member eligibility</h5>
                    </div>
        
                    <div class="px-10 py-5 py-xl-5">
                        <v-form ref="form">
                            <h4 class="text-start mb-4"> Member Information </h4>
                            <div>
                                <h5 class="my-xl-4 font-weight-regular">
                                    Member First Name <span class="red--text">*</span>
                                </h5>
                                <v-text-field
                                    v-model="member_patient_data.mem_first_name"
                                    
                                    @input="member_patient_data.mem_first_name = sanitizeAndCapitalize($event)"
                                    :rules="[...verification_rules, ...verification_spacing]"
                                    maxlength="60"
                                    clearable
                                    dense
                                ></v-text-field>

                                <h5 class="my-xl-4 font-weight-regular">
                                    Member Middle Name
                                </h5>
                                <v-text-field
                                    v-model="member_patient_data.mem_middle_name"
                                    @input="member_patient_data.mem_middle_name = sanitizeAndCapitalize($event)"
                                    :rules="verification_spacing"
                                    maxlength="60"
                                    clearable
                                    dense
                                ></v-text-field>

                                <h5 class="my-xl-4 font-weight-regular">
                                    Member Last Name <span class="red--text">*</span>
                                </h5>
                                <v-text-field
                                    v-model="member_patient_data.mem_last_name"
                                    @input="member_patient_data.mem_last_name = sanitizeAndCapitalize($event)"
                                    :rules="[...verification_rules, ...verification_spacing]"
                                    maxlength="60"
                                    clearable
                                    dense
                                ></v-text-field>

                                 <v-row dense>
                                    <v-col cols="12" sm="12" md="8" lg="8">
                                        <h5 class="my-xl-4 font-weight-regular">
                                            Member Maiden Name
                                        </h5>
                                        <v-text-field
                                            v-model="member_patient_data.mem_maiden"
                                            @input="member_patient_data.mem_maiden = sanitizeAndCapitalize($event)"
                                            :rules="verification_spacing"
                                            maxlength="60"
                                            clearable
                                            dense
                                        ></v-text-field>
                                    </v-col>
                                     <v-col cols="12" sm="12" md="4" lg="4">
                                         <h5 class="my-xl-4 font-weight-regular">
                                            Member Suffix
                                        </h5>
                                        <v-select
                                            v-model="member_patient_data.mem_suffix"
                                            :items="['JR', 'SR', 'I', 'II', 'III', 'IV', 'V', 'VI']"
                                            clearable
                                            dense
                                        ></v-select>
                                    </v-col>
                                </v-row>

                                <v-row dense>
                                    <v-col cols="12" sm="12" md="4" lg="4">
                                        <h5 class="my-xl-4 font-weight-regular">
                                            Member PHIC PIN <span class="red--text">*</span>
                                        </h5>
                                        <v-text-field
                                            v-model="member_patient_data.mem_phic_pin"
                                            @input="member_patient_data.mem_phic_pin = sanitizeAndCapitalize($event)"
                                            @keypress="numberOnly"
                                            :rules="[...verification_rules, ...verification_spacing]"
                                            maxlength="12"
                                            clearable
                                            dense
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="4" lg="4">
                                        <h5 class="my-xl-4 font-weight-regular">
                                            Member Birthdate <span class="red--text">*</span>
                                        </h5>
                                        <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-on="on" v-model="member_patient_data.member_birthdate" v-mask="birthdate_mask" :rules="verification_rules_birthdate" placeholder="MM-DD-YYYY" dense clearable></v-text-field>
                                            </template>
                                            <v-date-picker v-model="member_patient_data.member_birthdate" :max="max_date"  @change="member_patient_data.birthdate = formatDate(member_patient_data.member_birthdate)" no-title></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="4" lg="4">
                                        <h5 class="my-xl-4 font-weight-regular">
                                            Member Sex <span class="red--text">*</span>
                                        </h5>
                                        <v-select
                                            v-model="member_patient_data.mem_gender"
                                            :items="['MALE', 'FEMALE']"
                                            :rules="[...verification_rules]"
                                            clearable
                                            dense
                                        ></v-select>                                        
                                    </v-col>
                                </v-row>
                            </div>

                            <v-divider class="my-4"></v-divider>

                            <h4 class="text-start mb-4"> Patient Information </h4>
                            <div>
                                <h5 class="my-xl-4 font-weight-regular">
                                    Patient First Name <span class="red--text">*</span>
                                </h5>
                                <v-text-field
                                    v-model="member_patient_data.patient_firstname"
                                    @input="member_patient_data.patient_firstname = sanitizeAndCapitalize($event)"
                                    :rules="[...verification_rules, ...verification_spacing]"
                                    maxlength="60"
                                    clearable
                                    dense
                                ></v-text-field>

                                <h5 class="my-xl-4 font-weight-regular">
                                    Patient Middle Name
                                </h5>
                                <v-text-field
                                    v-model="member_patient_data.patient_middlename"
                                    @input="member_patient_data.patient_middlename = sanitizeAndCapitalize($event)"
                                    :rules="verification_spacing"
                                    maxlength="60"
                                    clearable
                                    dense
                                ></v-text-field>
    
                                <h5 class="my-xl-4 font-weight-regular">
                                    Patient Last Name <span class="red--text">*</span>
                                </h5>
                                <v-text-field
                                    v-model="member_patient_data.patient_lastname"
                                    @input="member_patient_data.patient_lastname = sanitizeAndCapitalize($event)"
                                    :rules="[...verification_rules, ...verification_spacing]"
                                    maxlength="60"
                                    clearable
                                    dense
                                ></v-text-field>

                                <v-row dense>
                                    <v-col cols="12" sm="12" md="8" lg="8">
                                        <h5 class="my-xl-4 font-weight-regular">
                                            Patient Maiden Name
                                        </h5>
                                        <v-text-field
                                            v-model="member_patient_data.patient_maiden"
                                            @input="member_patient_data.patient_maiden = sanitizeAndCapitalize($event)"
                                            maxlength="60"
                                            clearable
                                            dense
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="4" lg="4">
                                        <h5 class="my-xl-4 font-weight-regular">
                                            Patient Suffix
                                        </h5>
                                        <v-select
                                            v-model="member_patient_data.patient_suffix"
                                            :items="['JR', 'SR', 'I', 'II', 'III', 'IV', 'V', 'VI']"
                                            clearable
                                            dense
                                        ></v-select>
                                    </v-col>
                                </v-row>
                            </div>

                            <v-divider class="my-4"> </v-divider>
                            <v-row dense>
                                 <v-col cols="12" sm="12" md="4" lg="4">
                                    <h5 class="my-xl-4 font-weight-regular">
                                        Patient PHIC PIN <span class="red--text">*</span>
                                    </h5>
                                    <v-text-field
                                        v-model="member_patient_data.patient_pin"
                                        @input="member_patient_data.patient_pin = sanitizeAndCapitalize($event)"
                                        @keypress="numberOnly"
                                        :rules="[...verification_rules, ...verification_spacing]"
                                        maxlength="12"
                                        clearable
                                        dense
                                    ></v-text-field>
                                 </v-col>
                                <v-col cols="12" sm="12" md="4" lg="4">
                                    <h5 class="my-xl-4 font-weight-regular">
                                        Patient Is <span class="red--text">*</span>
                                    </h5>
                                     <v-select
                                        v-model="member_patient_data.patient_is"
                                        :items="patient_is_items"
                                        :rules="[...verification_rules]"
                                        item-text="name"
                                        item-value="value"
                                        clearable
                                        dense
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="12" md="4" lg="4">
                                    <h5 class="my-xl-4 font-weight-regular">
                                        Patient Sex <span class="red--text">*</span>
                                    </h5>
                                    <v-select
                                        v-model="member_patient_data.patient_sex"
                                        :items="['MALE', 'FEMALE']"
                                        :rules="[...verification_rules]"
                                        clearable
                                        dense
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="12" md="8" lg   ="8">
                                    <h5 class="my-xl-4 font-weight-regular">
                                        PHIC Membership Type <span class="red--text">*</span>
                                    </h5>
                                    <v-select
                                        v-model="member_patient_data.mem_phic_membership_type"
                                        :items="['EMPLOYED PRIVATE', 'EMPLOYED GOVERNMENT']"
                                        :rules="[...verification_rules]"
                                        clearable
                                        dense
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="12" md="4" lg="4">
                                    <h5 class="my-xl-4 font-weight-regular">
                                        Admission Date <span class="red--text">*</span>
                                    </h5>
                                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-on="on" v-model="member_patient_data.admission_date" v-mask="birthdate_mask" :rules="verification_rules_birthdate" placeholder="MM-DD-YYYY" dense clearable></v-text-field>
                                        </template>
                                        <v-date-picker v-model="member_patient_data.admission_date" :max="max_date"  @change="member_patient_data.admission_date = formatDate(member_patient_data.admission_date)" no-title></v-date-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>

                            <v-row dense>
                                <v-col cols="12" sm="12" md="6" lg="6">
                                    <h5 class="my-xl-4 font-weight-regular">
                                        Employer/Company Name
                                    </h5>
                                    <v-text-field
                                        v-model="member_patient_data.employer_company_name"
                                        @input="member_patient_data.employer_company_name = sanitizeAndCapitalize($event)"
                                        :rules="verification_spacing"
                                        maxlength="100"
                                        clearable
                                        dense
                                    ></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6">
                                    <h5 class="my-xl-4 font-weight-regular">
                                        Employer PHIC PIN
                                    </h5>
                                    <v-text-field
                                        v-model="member_patient_data.employer_phic_pin"
                                        @input="member_patient_data.employer_phic_pin = sanitizeAndCapitalize($event)"
                                        @keypress="numberOnly"
                                        :rules="verification_spacing"
                                        maxlength="12"
                                        clearable
                                        dense
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            
                            <v-row dense>
                                <v-col cols="12" sm="12" md="6" lg="6">
                                    <h5 class="my-xl-4 font-weight-regular">
                                        Is For Hemo Claims <span class="red--text">*</span>
                                    </h5>
                                    <v-radio-group v-model="member_patient_data.is_for_hemo_claims" row dense>
                                        <v-radio label="Yes" value="Y"></v-radio>
                                        <v-radio label="No" value="N"></v-radio>
                                    </v-radio-group>
                                </v-col>
                            </v-row>

                            <v-layout wrap justify-space-between mt-5 mb-3>
                                <v-btn @click="resetForm" class="elevation-0" tile >Clear Form</v-btn>
                                <v-btn @click="searchMemberEligibilityChecker" class="ml-auto" color="primary" :loading="loading">Search Record</v-btn>
                            </v-layout>
                        </v-form>
                    </div>
            </v-card>
        </v-col>
    </v-row>

    <v-dialog v-model="member_eligibility_dialog" max-width="600" persistent>
      <v-card elevation="4">
        <v-card-title class="primary white--text justify-center py-4">
          <div class="text-center">
            <div class="text-h5 font-weight-medium">
                Member Eligibility Verification
            </div>
          </div>
        </v-card-title>

        <v-card-text class="pa-6">
            <v-row dense>
                <v-col cols="6">
                    <div class="caption grey--text text--darken-1">
                        Eligible Status
                    </div>
                    <div class="subtitle-2 font-weight-medium">
                        {{ member_details.eclaims_eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE' }}
                    </div>
                </v-col>

                <v-col cols="6">
                    <div class="caption grey--text text--darken-1">
                        As of: 
                    </div>
                    <div class="subtitle-2 font-weight-medium">
                        {{ member_details.as_of }}
                    </div>
                </v-col>

                <v-col cols="12" sm="6">
                    <div class="caption grey--text text--darken-1">
                        Reference Number
                    </div>
                    <div class="subtitle-2">
                        {{ member_details.reference_no }}
                    </div>
                </v-col>

                <v-col cols="12" sm="6">
                    <div class="caption grey--text text--darken-1">
                        Tracking Number
                    </div>
                    <div class="subtitle-1 font-weight-bold primary--text">
                        {{ member_details.tracking_no }}
                    </div>
                </v-col>
            </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-6 py-4">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="member_eligibility_dialog = false">
                Close
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay v-if="loading" z-index="9999"> 
      <v-progress-circular indeterminate size="35"></v-progress-circular>
      <span  class="ml-3 text-h6 font-weight-regular" >Searching... Please Wait...</span>
    </v-overlay>

    <Alert :alert="alert" class="d-print-none" ref="alert"/>
  </v-container>
</template>

<script>
import { mask } from "vue-the-mask"
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'

export default {
  directives: { mask },
  components: {
    Navbar,
    Alert,
  },

  data() {
    return {
        alert: {},
        navbar: [
            { title: "HCP Accreditation", link: "/eclaims-hcp-accreditation", icon: "fas fa-user-doctor" }, 
            { title: "Search Member PIN", link: "/eclaims-retrieve-pin", icon: "fas fa-id-card" },
            { title: "Search Employer", link: "/eclaims-search-employer", icon: "fas fa-user-friends" },
            { title: "Migrated Records", link: "/eclaims-migrated-records", icon: "fa-file-import" },
            { title: 'Claims Patient List', link: '../eclaims-patient-list', icon: 'fas fa-folder' }
        ],
        
        patient_is_items: [
            { name: 'Patient is member', value: 'M' },
            { name: 'Patient is spouse', value: 'S' },
            { name: 'Patient is child', value: 'C' },
            { name: 'Patient is parent', value: 'P' },
        ],

        member_patient_data: {},

        birthdate: '',
        birthdate_picker: '',
        birthdate_mask: '##-##-####',
        max_date: this.$moment().format('YYYY-MM-DD'),

        member_details: [],

        member_eligibility_dialog: false,
        loading: false,

        verification_rules: [
            v => !!v && !/^ *$/.test(v),
            v => !/^\s/.test(v) || 'This field is required',
        ],

        verification_spacing: [
            v => !/^\s/.test(v) || 'Spaces are not allowed at the beginning',
            v => !/\s$/.test(v) || 'Spaces are not allowed at the end',
            v => !/\s{2,}/.test(v) || 'Double spacing is not allowed'
        ],

        verification_rules_birthdate: [
            v => !!v && !/^ *$/.test(v),
            v => !/^\s/.test(v) || 'Birthdate cannot start with a space',
            v => this.validateBirthDate(v).format_result || this.validateBirthDate(v).error_msg
        ],
    }
  },

  methods: {
    async searchMemberEligibilityChecker() {
      if (this.$refs.form.validate()) { 
        this.loading = true
        let response = await this.$services.getEclaimsWebService({
          provider_code: this.$store.state.prv_data.provider_code,
          request_key: "ICEM",
          data: this.member_patient_data
        });

        if (response.status === 200) {
            this.loading = false
            response.data = this.responseDataDecryption(response.data)
            if(response.data.success){
                this.member_eligibility_dialog = true
                this.member_details = response.data
            } else {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'No Record Found', body: 'No record found for the given employer name.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }
        } else{
            this.loading = false
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      }
    },

    sanitizeAndCapitalize(value) {
      if (!value) return ''

      value = value
          .replace(/^\s+/, '')     // remove leading spaces
          .replace(/\s+$/, '')     // remove trailing spaces
          .replace(/\s{2,}/g, ' ') // remove double spaces

      return this.textCapitalize(value)
    },

    // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
    numberOnly(event){
      if((event.which < 48 || event.which > 57) && event.which !== 45){
        event.preventDefault();
      }
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