<template>
    <v-container fluid id="web-registration" class="pa-0 ma-0">
    <Navbar :navbar="navbar" class="d-print-none"/>
  
    <v-col cols="12" md="11" class="mx-auto body-container">
        <h1 class="text-h5 text-center grey--text text--darken-3 font-weight-medium mt-7 d-print-none">
            HCP ACCREDITATION VERIFICATION
        </h1>
        <v-divider class="mt-5"></v-divider>
    </v-col>

    <v-col cols="12" md="11" class="mx-auto body-container">
        <v-card class="mb-4 mx-auto rounded-lg" width="700">
            <div class="primary white--text text-center py-4">
                <h4 class="mt-1">
                    <v-icon size="22" dark>mdi-account-search</v-icon> 
                    HCP ACCREDITATION VERIFICATION 
                </h4>
                <h5 class="font-weight-regular ">
                    Please fill out all required fields. The doctor's full name and birthdate are required for PAN retrieval. <br>
                    The admission and discharge dates are used to verify the doctor's accreditation status.</h5>
            </div>

            <div class="px-10 py-5 py-xl-5">
                <v-form ref="form">
                    <h5 class="my-xl-4 font-weight-regular">First Name <span class="red--text">*</span></h5>
                    <v-text-field v-model="first_name" @paste="handlePaste($event, 'first_name')" @input="first_name = sanitizeAndCapitalize($event)" :rules="[...verification_rules, ...verification_spacing ]" maxlength="60"  dense></v-text-field>

                    <h5 class="my-xl-4 font-weight-regular">Middle Name <span class="red--text">*</span> </h5>
                    <v-text-field v-model="middle_name"  @paste="handlePaste($event, 'middle_name')" @input="middle_name = sanitizeAndCapitalize($event)" :rules="[...verification_rules, ...verification_spacing ]" maxlength="60" dense></v-text-field>

                    <h5 class="my-xl-4 font-weight-regular">Last Name <span class="red--text">*</span></h5>
                    <v-text-field v-model="last_name"  @paste="handlePaste($event, 'last_name')" @input="last_name = sanitizeAndCapitalize($event)" :rules="[ ...verification_rules, ...verification_spacing ]" maxlength="60"  dense></v-text-field>

                    <h5 class="my-xl-4 font-weight-regular">Suffix <i>(optional)</i></h5>
                    <v-select v-model="suffix" :items="['JR', 'SR', 'I', 'II', 'III', 'IV', 'V', 'VI']" clearable dense> </v-select>

                    <h5 class="my-xl-4 font-weight-regular">Birthdate <span class="red--text">*</span></h5>
                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="birthdate" v-mask="birthdate_mask" :rules="verification_rules_date" placeholder="MM-DD-YYYY" dense></v-text-field>
                        </template>
                        <v-date-picker v-model="birthdate_picker" :max="max_date"  @change="birthdate = formatDate(birthdate_picker)" no-title></v-date-picker>
                    </v-menu>

                    <h5 class="my-xl-4 font-weight-regular"> Admission Date<span class="red--text">*</span></h5>
                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="admissiondate" v-mask="birthdate_mask" :rules="verification_rules_date" placeholder="MM-DD-YYYY" dense></v-text-field>
                        </template>
                        <v-date-picker v-model="admissiondate_picker" :max="max_date"  @change="admissiondate = formatDate(admissiondate_picker)" no-title></v-date-picker>
                    </v-menu>

                    <h5 class="my-xl-4 font-weight-regular">Discharge Date <span class="red--text">*</span></h5>
                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="dischargedate" v-mask="dischargedate_mask" :rules="verification_rules_date" placeholder="MM-DD-YYYY" dense></v-text-field>
                        </template>
                        <v-date-picker v-model="dischargedate_picker" :max="max_date"  @change="dischargedate = formatDate(dischargedate_picker)" no-title></v-date-picker>
                    </v-menu>


                    <v-layout wrap justify-space-between mt-5 mb-3>
                        <v-btn class="elevation-0" tile @click="resetForm">CLEAR FORM</v-btn>
                        <v-btn class="ml-auto" color="primary" @click="verifyDoctorAccreditation">VERIFY</v-btn>
                    </v-layout>
                </v-form>
            </div>
        </v-card>
    </v-col>

    <v-dialog v-model="hcp_dialog" max-width="600" persistent>
        <v-card elevation="4">
            <v-card-title class="primary white--text justify-center py-4">
                <div class="text-center">
                    <div class="text-h5 font-weight-medium">
                        HCP Accreditation Verification
                    </div>
                    <div class="subtitle-2">
                        Accreditation Number and Status
                    </div>
                </div>
            </v-card-title>

            <v-card-text class="pa-6">
                <v-row dense>
                    <v-col cols="12" sm="6">
                        <div class="caption grey--text text--darken-1">
                            Doctor Name 
                        </div>
                        <div class="subtitle-2 font-weight-medium">
                            {{ hcp_details.name }}
                        </div>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <div class="caption grey--text text--darken-1">
                            Birthdate
                        </div>
                        <div class="subtitle-2">
                            {{ hcp_details.birthdate }}
                        </div>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <div class="caption grey--text text--darken-1">
                            Admission Date
                        </div>
                        <div class="subtitle-2">
                            {{ hcp_details.admissiondate }}
                        </div>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <div class="caption grey--text text--darken-1">
                            Discharge Date
                        </div>
                        <div class="subtitle-2">
                            {{ hcp_details.dischargedate }}
                        </div>
                    </v-col>
                </v-row>

                <v-divider class="my-4"></v-divider>    
                
                <v-row dense>
                    <v-col cols="12" sm="6">
                        <div class="caption grey--text text--darken-1">
                            PhilHealth Accreditation Number (PAN)
                        </div>
                        <div class="subtitle-1 font-weight-bold primary--text">
                            {{ hcp_details.pan }}
                        </div>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <div class="caption grey--text text--darken-1">
                            Accredited
                        </div>
                        <div class="subtitle-1 font-weight-bold primary--text">
                            {{ hcp_details.isaccredited }}
                        </div>
                    </v-col>

                    <v-col cols="12">
                        <v-sheet color="grey lighten-4" rounded class="pa-3 mb-4">
                            <div class="subtitle-2 font-weight-bold mb-2"> Accreditation Details </div>

                            <div> <strong>Accreditation Code:</strong> {{ hcp_details.accrecode || 'N/A' }} </div>
                            <div> 
                                <strong>Validity:</strong> 
                                {{ hcp_details.accreditationstart || 'N/A' }} – {{ hcp_details.accreditationend || 'N/A' }}
                            </div>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="px-6 py-4">
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="hcp_dialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-overlay v-if="loading" z-index="9999"> 
        <v-progress-circular indeterminate size="35"></v-progress-circular>
        <span  class="ml-3 text-h6 font-weight-regular" >Validating... Please Wait...</span>
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
                { title: 'Member Eligibility', link: '/eclaims-member-eligibility-checker', icon: 'fas fa-user' },
                { title: "Search Member PIN", link: "/eclaims-retrieve-pin", icon: "fas fa-id-card" },
                { title: "Search Employer", link: "/eclaims-search-employer", icon: "fas fa-user-friends" },
                { title: "Migrated Records", link: "/eclaims-migrated-records", icon: "fa-file-import" },
                { title: 'Claims Patient List', link: '../eclaims-patient-list', icon: 'fas fa-folder' } 
            ],
            
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            birthdate: '',
            birthdate_picker: '',
            birthdate_mask: '##-##-####',
            max_date: this.$moment().format('YYYY-MM-DD'),
            admissiondate: this.$moment().format('MM-DD-YYYY'),
            admissiondate_picker: '',
            admissiondate_mask: '##-##-####',
            dischargedate: this.$moment().format('MM-DD-YYYY'),
            dischargedate_picker: '',
            dischargedate_mask: '##-##-####',

            hcp_details: {},

            hcp_dialog: false,
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

            verification_rules_date: [
                v => !!v && !/^ *$/.test(v),
                v => !/^\s/.test(v) || 'Birthdate cannot start with a space',
                v => this.validateBirthDate(v).format_result || this.validateBirthDate(v).error_msg
            ],
        }
    },

    methods: {
        async verifyDoctorAccreditation() {
            if (this.$refs.form.validate()) {  
                let response = await this.$services.getEclaimsWebService({
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: "GDPM",
                data:{
                    "lastname": this.last_name,
                    "firstname": this.first_name,
                    "middlename": this.middle_name,
                    "suffix": this.suffix ?? "",
                    "birthdate": this.birthdate
                }
                });

                if (response.status === 200) {
                    this.hcp_details = {
                        name: `${this.first_name} ${this.middle_name} ${this.last_name} ${this.suffix || ''}`,
                        birthdate: this.$moment(this.birthdate).format('MMMM D, YYYY'),
                        admissiondate: this.$moment(this.admissiondate).format('MMMM D, YYYY'),
                        dischargedate: this.$moment(this.dischargedate).format('MMMM D, YYYY')
                    }

                    this.loading =  true
                    response.data = this.responseDataDecryption(response.data)
                    
                    if(response.data.success) {
                        this.hcp_details.pan = response.data.pan
                        await this.verifyDoctorAccreditationStatus()
                    } else{
                        this.loading =  false
                        this.$refs.form.reset()
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.data.message, body: this.hcp_details.name+'<br>'+this.hcp_details.birthdate, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                } else{
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
            }
        },

        async verifyDoctorAccreditationStatus() {
            let response = await this.$services.getEclaimsWebService({
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: "IDAM",
                data:{
                    accrecode: this.hcp_details.pan,
                    admissiondate: this.admissiondate,
                    dischargedate: this.dischargedate
                    
                }
            });
             
            this.loading =  false   
            
            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                
                Object.assign(this.hcp_details, {
                    isaccredited: response.data.isaccredited,
                    accrecode: response.data.accrecode,
                    accreditationstart: this.$moment(response.data.accreditationstart).format('MMMM D, YYYY'),
                    accreditationend: this.$moment(response.data.accreditationend).format('MMMM D, YYYY')
                })

                this.$refs.form.reset()
                this.hcp_dialog = true
            } else{
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
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