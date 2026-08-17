<template>
    <v-container fluid id="web-registration" class="pa-0 ma-0">
    <Navbar :navbar="navbar" class="d-print-none"/>
  
    <v-col cols="12" md="11" class="mx-auto body-container">
        <h1 class="text-h5 text-center grey--text text--darken-3 font-weight-medium mt-7 d-print-none">SEARCH MEMBER PIN</h1>
        <v-divider class="mt-5"></v-divider>
    </v-col>

    <v-col cols="12" md="11" class="mx-auto body-container">
        <v-card class="mb-4 mx-auto rounded-lg" width="700">
            <div class="primary white--text text-center py-4">
                <h4 class="mt-1"><v-icon size="22" dark>mdi-account-search</v-icon> Search Member PIN </h4>
                <h5 class="font-weight-regular ">Please fill out all required fields</h5>
            </div>

            <div class="px-10 py-5 py-xl-5">
                <v-form ref="form">
                    <h5 class="my-xl-4 font-weight-regular">First Name <span class="red--text">*</span></h5>
                    <v-text-field v-model="first_name" @paste="handlePaste($event, 'first_name')" @input="first_name = sanitizeAndCapitalize($event)" :rules="[...verification_rules, ...verification_spacing ]" maxlength="60"  dense></v-text-field>

                    <h5 class="my-xl-4 font-weight-regular">Middle Name <span class="red--text">*</span></h5>
                    <v-text-field v-model="middle_name"  @paste="handlePaste($event, 'middle_name')" @input="middle_name = sanitizeAndCapitalize($event)" :rules="[ ...verification_rules, ...verification_spacing ]" maxlength="60" dense></v-text-field>

                    <h5 class="my-xl-4 font-weight-regular">Last Name <span class="red--text">*</span></h5>
                    <v-text-field v-model="last_name"  @paste="handlePaste($event, 'last_name')" @input="last_name = sanitizeAndCapitalize($event)" :rules="[ ...verification_rules, ...verification_spacing ]" maxlength="60"  dense></v-text-field>

                    <h5 class="my-xl-4 font-weight-regular">Suffix <i>(optional)</i></h5>
                    <v-select v-model="suffix" :items="['JR', 'SR', 'I', 'II', 'III', 'IV', 'V', 'VI']" clearable dense> </v-select>

                    <h5 class="my-xl-4 font-weight-regular">Birthdate <span class="red--text">*</span></h5>
                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="birthdate" v-mask="birthdate_mask" :rules="verification_rules_birthdate" placeholder="MM-DD-YYYY" dense></v-text-field>
                        </template>
                        <v-date-picker v-model="birthdate_picker" :max="max_date"  @change="birthdate = formatDate(birthdate_picker)" no-title></v-date-picker>
                    </v-menu>

                    <v-layout wrap justify-space-between mt-5 mb-3>
                        <v-btn class="elevation-0" tile @click="resetForm">CLEAR FORM</v-btn>
                        <v-btn class="ml-auto" color="primary" @click="getMemberPin">GET MEMBER PIN</v-btn>
                    </v-layout>
                </v-form>
            </div>
        </v-card>
    </v-col>

    <v-dialog v-model="retrieve_pin_dialog" max-width="600" persistent>
      <v-card elevation="4">
        <v-card-title class="primary white--text justify-center py-4">
          <div class="text-center">
            <div class="text-h5 font-weight-medium">
                Member PIN Retrieval
            </div>
          </div>
        </v-card-title>

        <v-card-text class="pa-6">
            <v-row dense>
                <v-col cols="12">
                    <div class="caption grey--text text--darken-1">
                        Member Name
                    </div>
                    <div class="subtitle-2 font-weight-medium">
                        {{ member_details.name }}
                    </div>
                </v-col>

                <v-col cols="12" sm="6">
                    <div class="caption grey--text text--darken-1">
                        Birthdate
                    </div>
                    <div class="subtitle-2">
                        {{ member_details.birthdate }}
                    </div>
                </v-col>

                <v-col cols="12" sm="6">
                    <div class="caption grey--text text--darken-1">
                        Member PIN
                    </div>
                    <div class="subtitle-1 font-weight-bold primary--text">
                        {{ member_details.pin }}
                    </div>
                </v-col>
            </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-6 py-4">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="retrieve_pin_dialog = false">
                Close
            </v-btn>
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
                { title: "HCP Accreditation", link: "/eclaims-hcp-accreditation", icon: "fas fa-user-doctor" }, 
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

            member_details: {
                name: "",
                birthdate: "",
                pin: ""
            },

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
            ],

            verification_rules_birthdate: [
                v => !!v && !/^ *$/.test(v),
                v => !/^\s/.test(v) || 'Birthdate cannot start with a space',
                v => this.validateBirthDate(v).format_result || this.validateBirthDate(v).error_msg
            ],
        }
    },

    methods: {
        async getMemberPin() {
            if (this.$refs.form.validate()) {  
                let response = await this.$services.getEclaimsWebService({
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: "GMPM",
                data:{
                    "lastname": this.last_name,
                    "firstname": this.first_name,
                    "middlename": this.middle_name,
                    "suffix": this.suffix ?? "",
                    "birthdate": this.birthdate
                }
                });

                if (response.status === 200) {
                    this.member_details = {
                        name: `${this.first_name} ${this.middle_name} ${this.last_name} ${this.suffix || ''}`,
                        birthdate: this.$moment(this.birthdate).format('MMMM D, YYYY')
                    }

                    this.loading =  true
                    response.data = this.responseDataDecryption(response.data)
                    
                    if(response.data.success) {
                        this.member_details.pin = response.data.pin

                        this.$refs.form.reset()
                        this.loading =  false
                        this.retrieve_pin_dialog = true
                    } else{
                        this.loading =  false
                        this.$refs.form.reset()
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.data.message, body: this.member_details.name+'<br>'+this.member_details.birthdate, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                } else{
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