<template>
    <div>
        <v-card :class="[$route.path === '/child-care-and-services' ? 'mb-0' : 'mb-4', 'mx-auto', 'rounded-lg']" width="700">
            <div class="primary white--text text-center py-4">
                <h4 class="mt-1"><v-icon size="22" dark>mdi-account-search</v-icon> User Verification </h4>
                <h5 class="font-weight-regular ">Please fill out all required fields {{member_data.add_member_household ? 'for the additional household member' : ''}}</h5>
            </div>
            
            <div class="px-10 py-5 py-xl-5">
                <v-form :disabled="form_loading" ref="form">
                    <div v-if="process !== 'REGISTRATION' && process !== 'ADD HOUSEHOLD' && process !== 'OFFLINE TRANSACTION'">
                        <h5 class="font-weight-regular mt-9 my-xl-1">Card Number <span class="red--text">*</span></h5>
                        <v-text-field v-model="ek_lgu_id" 
                            :rules="birthdate ? [] : verification_rules"
                            :disabled="!first_name == false || !middle_name == false || !last_name == false || !suffix == false || !birthdate == false"
                            :error="empty_field && !ek_lgu_id"
                            dense>
                        </v-text-field>
                        <div class="d-flex align-center my-8 my-xl-5">
                            <v-divider></v-divider><h5 class="font-weight-bold grey--text text--darken-3 body-1 text-center mx-2">OR</h5> <v-divider></v-divider>
                        </div>
                    </div>

                    <h5 :class="[process === 'REGISTRATION' || process === 'ADD HOUSEHOLD'  || process === 'OFFLINE TRANSACTION'? 'my-xl-4' : 'my-xl-1', 'font-weight-regular']">First Name <span class="red--text">*</span></h5>
                    <v-text-field v-model="first_name" @paste="handlePaste($event, 'first_name')" @input="first_name = sanitizeAndCapitalize($event)" :disabled="!ek_lgu_id == false" :rules="ek_lgu_id ? [] : [...verification_rules, ...verification_spacing]" :error="empty_field && !first_name"  maxlength="60"  dense></v-text-field>

                    <h5 :class="[process === 'REGISTRATION' || process === 'ADD HOUSEHOLD'  || process === 'OFFLINE TRANSACTION'? 'my-xl-4' : 'my-xl-1', 'font-weight-regular mt-9 ']">Middle Name <i>(optional)</i></h5>
                    <v-text-field v-model="middle_name" @paste="handlePaste($event, 'middle_name')" @input="middle_name = sanitizeAndCapitalize($event)" :disabled="!ek_lgu_id == false" :rules="ek_lgu_id ? [] : verification_spacing" maxlength="60" dense></v-text-field>

                    <h5 :class="[process === 'REGISTRATION' || process === 'ADD HOUSEHOLD'  || process === 'OFFLINE TRANSACTION'? 'my-xl-4' : 'my-xl-1', 'font-weight-regular mt-9 ']">Last Name <span class="red--text">*</span></h5>
                    <v-text-field v-model="last_name" @paste="handlePaste($event, 'last_name')" @input="last_name = sanitizeAndCapitalize($event)" :disabled="!ek_lgu_id == false" :rules="ek_lgu_id ? [] : [...verification_rules, ...verification_spacing]"  :error="empty_field && !last_name"  maxlength="60"  dense></v-text-field>

                    <h5 :class="[process === 'REGISTRATION' || process === 'ADD HOUSEHOLD'  || process === 'OFFLINE TRANSACTION'? 'my-xl-4' : 'my-xl-1', 'font-weight-regular mt-9 ']">Suffix <i>(optional)</i></h5>
                    <v-select v-model="suffix" :items="['JR', 'SR', 'I', 'II', 'III', 'IV', 'V', 'VI']" :disabled="!ek_lgu_id == false" clearable dense> </v-select>

                    <h5 :class="[process === 'REGISTRATION' || process === 'ADD HOUSEHOLD'  || process === 'OFFLINE TRANSACTION'? 'my-xl-4' : 'my-xl-1', 'font-weight-regular mt-9 ']">Birthdate <span class="red--text">*</span></h5>
                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="birthdate" v-mask="birthdate_mask" :disabled="!ek_lgu_id == false" :rules="ek_lgu_id ? [] : verification_rules_birthdate"  :error="empty_field && !birthdate"  placeholder="MM-DD-YYYY" dense></v-text-field>
                        </template>
                        <!-- :error="empty_field && !birthdate && validateBirthDateFormat(birthdate) === false" :error-messages="validateBirthDateFormat(birthdate) === false ? birthDateFormatError : ''" -->
                        <v-date-picker v-model="birthdate_picker" :max="max_date" @change="birthdate = formatDate(birthdate_picker)" no-title></v-date-picker>
                    </v-menu>

                    <template v-if="is_for_ekonsulta">
                        <h5 :class="[process === 'REGISTRATION' || process === 'ADD HOUSEHOLD'  || process === 'OFFLINE TRANSACTION'? 'my-xl-4' : 'my-xl-1', 'font-weight-regular mt-9 ']">PHIC PIN <span class="red--text">*</span></h5>
                        <v-text-field v-model="phic_pin" @keypress="numberOnly" @keydown.enter.prevent :rules="ek_lgu_id ? [] : verification_rules" :error="empty_field && !is_for_ekonsulta" maxlength="12" dense></v-text-field>
                    </template>

                    <v-sheet class="d-flex justify-start align-center text-body-2 ">
                        <v-checkbox v-model="member_consent" :rules="consent_rules" class="mb-2" hide-details dense></v-checkbox>
                        <label>I have read and agree to the <span @click="consent_dialog = true" class="primary--text consent_style"><u>Terms & Conditions</u></span>.</label>
                    </v-sheet>

                    <v-divider class="my-3"> </v-divider>

                    <div> 
                        <h4 class="body-2 font-weight-medium"> Select the checkbox that applies.</h4>
                        <div class="ml-4"> 
                            <v-sheet v-if="$store.state.prv_config.ekonsulta_accre" class="d-flex justify-start align-center text-body-2 ">
                                <v-checkbox v-model="is_for_ekonsulta" @change="clearPHICPin"  class="mb-2" hide-details dense></v-checkbox>
                                <label>Mark if member is enrolled in Yakap</label>
                            </v-sheet>

                            <v-sheet class="d-flex justify-start align-center text-body-2 ">
                                <v-checkbox v-model="princial_pwd" class="mb-2" hide-details dense></v-checkbox>
                                <label>
                                <v-tooltip top max-width="450">
                                        <template v-slot:activator="{ on, attrs }">
                                            <span
                                            v-bind="attrs"
                                            v-on="on"
                                            >PWD/Minor</span>
                                        </template>
                                        <span class="body-2">Select this option if the registering member is a Person with Disability (PWD) or a minor and qualifies as a PhilHealth principal member. In this case, age will not be used as a determining factor.</span>
                                    </v-tooltip>     
                                </label>
                            </v-sheet>
                        </div>
                    </div>
                    
                    <v-layout wrap justify-space-between mt-5 mb-3>
                        <v-btn v-if="member_data.add_member_household" :loading="form_loading" @click="cancelHousehold" class="elevation-0" tile>CANCEL</v-btn>

                        <v-btn v-if="process === 'REPORT LOST CARD'" :loading="form_loading" @click="validateLostCard" class="ml-auto" color="primary">NEXT</v-btn>
                        <v-btn v-else-if="process === 'ISSUE CARD'" :loading="form_loading" @click="validateReleaseCard" class="ml-auto" color="primary">NEXT</v-btn>
                        <v-btn v-else :loading="form_loading" @click="validateRegistration" class="ml-auto" color="primary">NEXT</v-btn>
                    </v-layout>
                </v-form>
            </div>
        </v-card>

        <v-dialog v-model="consent_dialog"  width="850" persistent>
            <v-card>
                <v-layout wrap class="pa-5 flex-column">
                    <h1 class="title text-center mb-5">PATIENT CONSENT</h1>
                    <p class="text-body">
                        I hereby confirm that I understand the foregoing and that I am voluntarily giving my consent to the processing of my Personal Data under the terms and conditions provided above. 
                        Furthermore, I understand that: 
                    </p>
                    <ul>
                        <li>The consent I am giving through this form is in addition to any other consent that I may give/have given regarding the use of my personal data (e.g., in relation to medical treatment or procedure). </li>
                        <li>The consent will remain in full force until I revoke it in writing.</li>
                        <li>I give my consent to use my photo and personal data to produce my membership card</li>
                    </ul>

                </v-layout>

                <v-card-actions class="justify-center py-5">
                    <v-btn @click="consent_dialog = false, member_consent = false" class="pa-5">I Disagree</v-btn>
                    <v-btn @click="consent_dialog = false, member_consent = true" color="primary" class="py-5 px-6">I Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <Alert :alert="alert" @displayNotYetRegistered="displayNotYetRegistered" @goToAdditionalInfoPage="goToAdditionalInfoPage" @alertLostCard="alertLostCard" @endRegistration="endRegistration" @proceedToChildCareForm="proceedToChildCareForm" @verifyMemberRegistration="verifyMemberRegistration"/>
    </div>
</template>


<script>
import { mask } from "vue-the-mask"
import Alert from "@/components/Alert.vue"

export default {
    directives: { mask },
    components: { Alert },
    props: ['process', 'mem_data', 'child_care_services'],

    data(){
        return{
            member_data: sessionStorage.getItem("9xgF732sfgh") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("9xgF732sfgh"), "njGHDdd").toString(this.$crypto.enc.Utf8) ) : {},
            max_date: this.$moment().format('YYYY-MM-DD'),
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
            form_loading: false,
            ek_lgu_id: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            birthdate: '',
            birthdate_picker: '',
            birthdate_mask: '##-##-####',
            disabled_name_bday: false,
            disabled_card_number: false,
            empty_field: false,

            member_consent: false,
            consent_dialog: false,
            consent_rules: [v => v],
            alert: {},

            ekonsulta_data: {},
            principal_ek_lgu_id: '',
            member_in_child_care: false,
            
            is_for_ekonsulta: false, 
            phic_pin: '',
            membership_type: '',
            membership_types: ['EMPLOYED - PRIVATE', 'EMPLOYED - GOVERNMENT'],

            princial_pwd: false,

            ekonsulta_err: false,
        }
    },

    watch: {
        mem_data () {
            this.member_data = this.mem_data 
        },
        
    },

    methods: {
        async validateRegistration() {
            if (this.$refs.form.validate() && this.member_consent) {
                let verify_member = true

                if(!this.princial_pwd){
                    verify_member = this.child_care_services || (this.calculateAge(this.birthdate) >= 16 || this.member_data.add_member_household)
                } 

                if(verify_member) {
                    this.verifyMemberRegistration()
                } else {
                    this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'blue darken-1', title: 'Registration', body: 'The member is a minor. Do you want to continue registering as a principal?', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'PROCEED', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'verifyMemberRegistration'}
                }
            } 
        },

        async verifyMemberRegistration() {
            this.form_loading = true
            let response = await this.$services.wsMemberWeb({
                key: 'eurekare_key_web',
                data: {
                    command: 322101001,
                    data: {
                        first_name: this.first_name,
                        last_name: this.last_name,
                        birthdate: this.$moment(this.birthdate, 'MM-DD-YYYY', true).format('YYYY-MM-DD')
                    }
                }
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                const session_data = sessionStorage.getItem('9xgF732sfgh') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('9xgF732sfgh'), 'njGHDdd').toString(this.$crypto.enc.Utf8)) : { add_member_household: false}
                const {is_registered, lgu_validate, lgu_data, phic_data} = response.data
                const {add_member_household, primary_data, ek_lgu_id} = session_data
                this.member_in_child_care = lgu_data.principal_ek_lgu_id === null ? true : false // CHECK IF THE HOUSEHOLD IS REGISTERED FROM CHILD CARE AND SERVICES
                let btn_pry_params = {...response.data, ...{add_member_household, primary_data}, member_in_child_care: this.member_in_child_care}
                let ekonsulta_data = ''
                let title = ''
                let eclaims_success, mem_phic_pin;

                //CHECK IF THE PROVIDER IS ACCREDITED FOR ECLAIMS THEN CALL THE WEB SERVICE FOR ECLAIMS
                if(this.$store.state.prv_config.eclaims_accre) {
                    let eclaims_data = await this.getEclaimsWebService()
                    eclaims_success = eclaims_data.eclaims_success;
                    mem_phic_pin = eclaims_data.mem_phic_pin;
                }

                //CHECK IF THE PROVIDER IS ACCREDITED FOR EKONSULTA THEN CALL THE WEB SERVICE FOR EKONSULTA
                if(this.is_for_ekonsulta && this.$store.state.prv_config.ekonsulta_accre){
                    let ekonsulta = await this.getEkonsultaEligibilityChecker() 
                    ekonsulta_data = ekonsulta.ekonsulta_data
                }
                
                //ALERT FOR ELIGIBLE FOR EKONSULTA AND ECLAIMS IF THE PROVIDER IS ACCREDITED.
                if(this.$store.state.prv_config.ekonsulta_accre || this.$store.state.prv_config.eclaims_accre) {
                    title = `<span class="font-weight-medium text-uppercase">${this.first_name} ${this.middle_name || ''} ${this.last_name} ${this.suffix || ''}</span><span class="d-block mb-2">${this.birthdate}</span> 
                    <span class="d-block mb-2">${ekonsulta_data.konsulta_eligible ? 'This member is Eligible for Yakap' : eclaims_success ? 'This member is Eligible for Eclaims' : this.ekonsulta_err ? 'Connection to the PhilHealth server failed. The system cannot verify member eligibility at this time. Kindly proceed with the registration process.' : 'This member is currently not eligible. Kindly proceed with the registration process.'}</span>`
                } else {
                    title = `<span class="font-weight-medium text-uppercase">${this.first_name} ${this.middle_name || ''} ${this.last_name} ${this.suffix || ''}</span><span class="d-block mb-2">${this.birthdate}</span><span class="d-block mb-2"> Proceed with registration process.</span>`
                }

                btn_pry_params.lgu_data = {
                    ...lgu_data,
                    ...phic_data,
                    foreign_national: null,
                    mem_first_name: this.first_name, 
                    mem_middle_name: this.middle_name, 
                    mem_last_name: this.last_name, 
                    mem_suffix: this.suffix,
                    mem_birthdate: this.$moment(this.birthdate, 'MM-DD-YYYY', true).format('YYYY-MM-DD'),
                    blood_type: response.data.lgu_data.blood_type,
                    mem_phic_membership_type: response.data.lgu_data.mem_phic_membership_type,
                    mem_phic_membership_migrant_worker_type: response.data.lgu_data.mem_phic_membership_migrant_worker_type,
                    mem_phic_membership_self_earning_type: response.data.lgu_data.mem_phic_membership_self_earning_type,
                    mem_phic_membership_foreign_national_pra_srrv: response.data.lgu_data.mem_phic_membership_foreign_national_pra_srrv,
                    mem_phic_membership_foreign_national_acr_1: response.data.lgu_data.mem_phic_membership_foreign_national_acr_1,
                    mem_has_phic_pin: eclaims_success ? true : false,
                    mem_photo: response.data.lgu_data.mem_photo, 
                    mem_phic_pin: eclaims_success ? mem_phic_pin : response.data.lgu_data.mem_phic_pin,
                    eclaims_eligible: eclaims_success ? eclaims_success : false,
                    principal_ek_lgu_id: ek_lgu_id,
                    konsulta_eligible: ekonsulta_data.konsulta_eligible,
                    from_masterlist: ekonsulta_data.from_masterlist
                }

                let ekonsutal_value_holder = {
                    mem_has_phic_pin: true,
                    mem_phic_pin: ekonsulta_data.pPatientPin? ekonsulta_data.pPatientPin:null,
                    mem_mobile_number: ekonsulta_data.pPatientMobileNo? ekonsulta_data.pPatientMobileNo : null, 
                    mem_landline_number: ekonsulta_data.pPatientLandlineNo? ekonsulta_data.pPatientLandlineNo : null,
                    mem_gender: ekonsulta_data.pPatientSex === 'F'? 'FEMALE':'' || ekonsulta_data.pPatientSex === 'M'? 'MALE':'',
                    konsulta_eligible: ekonsulta_data.konsulta_eligible
                }
                
                if(this.child_care_services) {
                    if(lgu_data.length !== 0) {
                        sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(response.data), 'njGHDdd'))
                        this.$emit('proceedToChildCare', response.data)
                    } else {
                        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'blue darken-1', title: 'Member Verification', body: 'This person is not part of eCare System', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'PROCEED', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'proceedToChildCareForm', btn_sec_params: btn_pry_params }
                    }
                } else if (add_member_household) {
                    if (is_registered === '0') {
                        if (lgu_validate) {
                            if (ek_lgu_id === lgu_data.principal_ek_lgu_id) {
                                if (lgu_data.is_card_ready === '0' && lgu_data.is_card_released === '0') {
                                    this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of your household', body: 'Would you like to generate a QR Code and print card for this member?', btn_pry_txt: 'NO', btn_pry_color: 'primary', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'YES', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'goToAdditionalInfoPage', btn_sec_params: btn_pry_params }
                                
                                } else if (lgu_data.is_card_ready === '1' && lgu_data.is_card_released === '1') {
                                    this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of your household', body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                                
                                } else if ((lgu_data.is_card_ready === '1' || lgu_data.is_card_ready === '2') && lgu_data.is_card_released === '0') {              
                                    this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of your household', body: 'But the card is not yet issued. Please proceed on Issuance of Card Process', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }

                                } else if (lgu_data.is_card_ready === '0'  && !lgu_data.is_card_released && lgu_data.registered_from === 'mobile') {
                                    this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of your household', body: 'Please proceed on ISSUE CARD Process to issue the physical card.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                                }
                            } else {
                                this.alert = {  display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of different household', body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                            }

                        } else {
                            if(this.$store.state.prv_config.ekonsulta_accre || this.$store.state.prv_config.eclaims_accre) {        
                                if(ekonsulta_data.konsulta_eligible) {
                                    btn_pry_params.lgu_data = {
                                        ...btn_pry_params.lgu_data,
                                        ...ekonsutal_value_holder
                                    }    
                                } else if(eclaims_success) {
                                    btn_pry_params.lgu_data = {
                                        ...btn_pry_params.lgu_data,
                                        konsulta_eligible: ekonsulta_data.konsulta_eligible,
                                        eclaims_eligible: eclaims_success,
                                    }
                                }  else {
                                    btn_pry_params.lgu_data = {
                                        ...btn_pry_params.lgu_data,
                                        konsulta_eligible: ekonsulta_data.konsulta_eligible,
                                        eclaims_eligible: eclaims_success,
                                    }
                                }
                            } else {
                                if(phic_data.phic_status) {
                                    btn_pry_params.lgu_data = {
                                        ...btn_pry_params.lgu_data,
                                        ...ekonsutal_value_holder,
                                        mem_gender: response.data.phic_data.pPatientSex === 'F'? 'FEMALE':'' || response.data.phic_data.pPatientSex === 'M'? 'MALE':'',
                                        mem_mobile_number: response.data.phic_data.pPatientMobileNo? response.data.phic_data.pPatientMobileNo.replace(/^0+/, '') : null, 
                                        mem_landline_number: response.data.phic_data.pPatientLandlineNo? response.data.phic_data.pPatientLandlineNo.replace(/^0+/, '') : null,
                                    }
                                } else {
                                    btn_pry_params.lgu_data = {
                                        ...btn_pry_params.lgu_data
                                    }
                                }     
                            } 

                            // this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'blue darken-1', title: title, body: '', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'CONFIRM', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'goToAdditionalInfoPage', btn_sec_params: btn_pry_params }  
                            this.alert = { display: true, type: 'standard', width: '550', icon: (ekonsulta_data.konsulta_eligible || eclaims_success) ? 'mdi-check-circle' : 'mdi-alert-circle',  color: (ekonsulta_data.konsulta_eligible || eclaims_success) ? 'green darken-1' : 'blue darken-1', title: title, body: '', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'CONFIRM', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'goToAdditionalInfoPage', btn_sec_params: btn_pry_params } 
                        }
                    } else if (is_registered === '1') {
                        if (ek_lgu_id === lgu_data.principal_ek_lgu_id) {
                            if (lgu_data.is_card_ready === '0' && lgu_data.is_card_released === '0') {
                                this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of your household', body: 'Would you like to generate a QR code and print card for this member?', btn_pry_txt: 'NO', btn_pry_color: 'primary', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'YES', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'goToAdditionalInfoPage', btn_sec_params: btn_pry_params }
                                
                            } else if (lgu_data.is_card_ready === '1' && lgu_data.is_card_released === '1') {
                                this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of your household', body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                            
                            } else if ((lgu_data.is_card_ready === '1' || lgu_data.is_card_ready === '2') && lgu_data.is_card_released === '0') {
                                this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of your household', body: 'But the card is not yet issued. Please proceed on Issuance of Card Process', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }

                            } else if (lgu_data.is_card_ready === '0'  && !lgu_data.is_card_released && lgu_data.registered_from === 'mobile') {
                                this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of your household', body: 'Please proceed on ISSUE CARD Process to issue the physical card.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                            }
                        }else {
                            this.alert = {  display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of different household', body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                        }  
                    } else if (is_registered === '2') {
                        if (ek_lgu_id === (lgu_data.principal_ek_lgu_id ? lgu_data.principal_ek_lgu_id : ek_lgu_id)) {
                            if (lgu_data.is_card_ready === '0' && lgu_data.is_card_released === '0') {
                                //REPLACE THE PRINCIPAL EK LGU ID TO THE CURRENT PRINCIPAL EK LGU ID
                                lgu_data.principal_ek_lgu_id = ek_lgu_id
                                this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of your household', body: 'Would you like to generate a QR Code and print card for this member?', btn_pry_txt: 'NO', btn_pry_color: 'primary', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'YES', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'goToAdditionalInfoPage', btn_sec_params: btn_pry_params }

                            } else if (lgu_data.is_card_ready === '1' && lgu_data.is_card_released === '1') {
                                this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of your household', body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                    
                            } else if ((lgu_data.is_card_ready === '1' || lgu_data.is_card_ready === '2') && lgu_data.is_card_released === '0') {
                                this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of your household', body: 'But the card is not yet issued. Please proceed on Issuance of Card Process', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }

                            } else if (lgu_data.is_card_ready === '0'  && !lgu_data.is_card_released && lgu_data.registered_from === 'mobile') {
                                this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of your household', body: 'Please proceed on ISSUE CARD Process to issue the physical card.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                            }
                        }else {
                            this.alert = {  display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This person is already part of different household', body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                        }
                    }
                } else {
                    if (lgu_data.is_card_ready === '1' || lgu_data.is_card_ready === '2') {
                        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This member is already registered in eCare system', body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                    } else if (lgu_data.is_card_ready === '0' && !lgu_data.is_card_released && lgu_data.registered_from === 'mobile') {
                        this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: ' This member is already registered in eCare System', body: 'Please proceed on ISSUE CARD Process to issue the physical card.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                    } else if (is_registered === '0' && !lgu_validate) {
                        if(this.$store.state.prv_config.ekonsulta_accre || this.$store.state.prv_config.eclaims_accre) { 
                            if(ekonsulta_data.konsulta_eligible) {
                                btn_pry_params.lgu_data = {
                                    ...btn_pry_params.lgu_data,
                                    ...ekonsutal_value_holder
                                }
                            } else if(eclaims_success) {
                                btn_pry_params.lgu_data = {
                                    ...btn_pry_params.lgu_data,
                                    konsulta_eligible: ekonsulta_data.konsulta_eligible,
                                    eclaims_eligible: eclaims_success,
                                }
                            }  else {
                                btn_pry_params.lgu_data = {
                                    ...btn_pry_params.lgu_data,
                                    konsulta_eligible: ekonsulta_data.konsulta_eligible,
                                    eclaims_eligible: eclaims_success,
                                }
                            }
                        } else {
                            if(phic_data.phic_status) {
                                btn_pry_params.lgu_data = {
                                    ...btn_pry_params.lgu_data,
                                    ...ekonsutal_value_holder,
                                    mem_gender: response.data.phic_data.pPatientSex === 'F'? 'FEMALE':'' || response.data.phic_data.pPatientSex === 'M'? 'MALE':'',
                                    mem_mobile_number: response.data.phic_data.pPatientMobileNo? response.data.phic_data.pPatientMobileNo.replace(/^0+/, '') : null, 
                                    mem_landline_number: response.data.phic_data.pPatientLandlineNo? response.data.phic_data.pPatientLandlineNo.replace(/^0+/, '') : null,
                                }
                            } else {
                                btn_pry_params.lgu_data = {
                                    ...btn_pry_params.lgu_data
                                } 
                            }    
                        } 
                        
                            
                        this.alert = { display: true, type: 'standard', width: '550', icon: (ekonsulta_data.konsulta_eligible || eclaims_success) ? 'mdi-check-circle' : 'mdi-alert-circle',  color: (ekonsulta_data.konsulta_eligible || eclaims_success) ? 'green darken-1' : 'blue darken-1', title: title, body: '', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'CONFIRM', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'goToAdditionalInfoPage', btn_sec_params: btn_pry_params } 
                    } else {
                        if(this.$store.state.prv_config.ekonsulta_accre || this.$store.state.prv_config.eclaims_accre) { 
                            if(ekonsulta_data.konsulta_eligible) {
                                btn_pry_params.lgu_data = {
                                    ...btn_pry_params.lgu_data,
                                    konsulta_eligible: ekonsulta_data.konsulta_eligible,
                                    eclaims_eligible: eclaims_success,
                                }
                            } else if(eclaims_success) {
                                btn_pry_params.lgu_data = {
                                    ...btn_pry_params.lgu_data,
                                    konsulta_eligible: ekonsulta_data.konsulta_eligible,
                                    eclaims_eligible: eclaims_success,
                                }
                            } else {
                                btn_pry_params.lgu_data = {
                                    ...btn_pry_params.lgu_data,
                                    konsulta_eligible: ekonsulta_data.konsulta_eligible,
                                    eclaims_eligible: eclaims_success,
                                }
                            }
                        } else {
                            if(phic_data.phic_status) {
                                btn_pry_params.lgu_data = {
                                    ...btn_pry_params.lgu_data,
                                    konsulta_eligible: ekonsulta_data.konsulta_eligible,
                                    eclaims_eligible: eclaims_success,
                                }  
                            } else {
                                btn_pry_params.lgu_data = {
                                    ...btn_pry_params.lgu_data,
                                    konsulta_eligible: ekonsulta_data.konsulta_eligible,
                                    eclaims_eligible: eclaims_success,
                                }
                            } 
                        }      
                        this.alert = { display: true, type: 'standard', width: '550', icon: (ekonsulta_data.konsulta_eligible || eclaims_success) ? 'mdi-check-circle' : 'mdi-alert-circle',  color: (ekonsulta_data.konsulta_eligible || eclaims_success) ? 'green darken-1' : 'blue darken-1', title: title, body: '', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'CONFIRM', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'goToAdditionalInfoPage', btn_sec_params: btn_pry_params } 
                        
                        this.goToAdditionalInfoPage(btn_pry_params);
                    }
                }
                this.form_loading = false
            } else {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        },

        async getEclaimsWebService() {
            let response = await this.$services.getEclaimsWebService({
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: "GMPM",
                data: {
                    firstname: this.first_name,
                    middlename: this.middle_name,
                    lastname: this.last_name,
                    suffix: this.suffix ? this.suffix : '',
                    birthdate: this.formatDate(this.birthdate)
                }
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                return {
                    eclaims_success: response.data.pin ? true : response.data.success,
                    mem_phic_pin: response.data.pin ? response.data.pin : ''
                }
            } else { 
                return {
                    eclaims_success: false,
                    mem_phic_pin: ''
                }
            }
        },

        async getEkonsultaEligibilityChecker() {
            let response = await this.$services.getEkonsultaEligibilityChecker({
                pPatientFname: this.first_name,
                pPatientMname: this.middle_name,
                pPatientLname: this.last_name,
                pPatientExtname: this.suffix ? this.suffix : '',
                pPatientDob: this.$moment(this.birthdate, 'MM-DD-YYYY', true).format('YYYY-MM-DD'),
                pPhicPin: this.phic_pin,
                pPatientType: this.process === 'ADD HOUSEHOLD' ? 'DD' : 'MM',
                pHciAccreNo: this.$store.state.prv_data.ekonsulta_phic_acc_no,
                phic_token : this.$store.state.prv_data.phic_token
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                if(response.data.konsulta_eligible) {
                    return {
                        ekonsulta_data: response.data
                    }
                } else {
                    return{
                        ekonsulta_data: {
                            konsulta_eligible: false
                        }
                    } 
                }
            } else { 
                this.ekonsulta_err = true
                return {
                    ekonsulta_data: {
                        konsulta_eligible: false
                    }
                }
            }
        },

        async validateLostCard() {
            if ((this.ek_lgu_id && !this.first_name && !this.last_name && !this.birthdate) || (!this.ek_lgu_id && this.first_name && this.last_name && this.birthdate)) {
               this.form_loading = true
               let response = await this.$services.wsMemberWeb({
                    key: 'eurekare_key_web',
                    data: {
                        command: 322101004,
                        data: {
                            ...(this.ek_lgu_id ? { ek_lgu_id: this.ek_lgu_id } :
                                {
                                    first_name: this.first_name,
                                    last_name: this.last_name,
                                    birthdate: this.$moment(this.birthdate, 'MM-DD-YYYY', true).format('YYYY-MM-DD')
                                }
                            )
                        }
                    }
                })

                if(response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
                    this.form_loading = false
                    const {count, lgu_data} = response.data
                    if (count == '0')  {
                        return this.alert = { display: true,  type: 'standard',  width: '550',   icon: 'mdi-alert-circle',  color: 'primary',  title: 'Confirmation', body: 'Please confirm if the data is correct before proceeding.', btn_pry_txt: 'Recheck Information', btn_pry_color: 'primary',  btn_pry_otl: true,  btn_pry_act: 'closeAlert', btn_sec_txt: 'Proceed',  btn_sec_color: 'primary',  btn_sec_otl: false,  btn_sec_act: 'closeAlert',btn_sec_emt: 'alertLostCard', btn_sec_params: 'no_data'}
                    } else {
                        let alert_type = 'not_registered', btn_pry_params = {...response.data, ...{add_member_household: false}}
                        if (lgu_data.is_card_ready == '1' && lgu_data.is_card_released == '1') return this.goToAdditionalInfoPage(btn_pry_params)
                        
                        if (lgu_data.is_card_ready == '1') alert_type = 'card_not_released'
                        if (lgu_data.is_card_ready == '2') alert_type = 'card_not_printed'
                        return this.alertLostCard(alert_type) 
                    }
                } else {
                    this.alert = response.error
                }
            } else {
                this.empty_field = true
            }
        },

        async validateReleaseCard(){
            if(this.$refs.form.validate()){
                this.form_loading = true
                let response = await this.$services.wsMemberWeb({
                    key: 'eurekare_key_web',
                    data: {
                        command: 322101004,
                        data: {
                            ...(this.ek_lgu_id ? { ek_lgu_id: this.ek_lgu_id } :
                                {
                                    first_name: this.first_name,
                                    last_name: this.last_name,
                                    birthdate: this.$moment(this.birthdate, 'MM-DD-YYYY', true).format('YYYY-MM-DD')
                                }
                            )
                            
                        }
                    }
                })

                if(response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)

                    let title = this.ek_lgu_id ? 'Card Number: ' + this.ek_lgu_id.toUpperCase() : `<span class="font-weight-medium text-uppercase">${this.first_name} ${this.middle_name || ''} ${this.last_name} ${this.suffix || ''}</span><span class="d-block mb-2">${this.birthdate}</span>`

                    if(response.data.lgu_data.length === 0){
                        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: title, body: 'Please confirm if the data is correct before proceeding', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'CONFIRM', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'displayNotYetRegistered' }
                    }else{
                        if(response.data.lgu_data.is_card_ready === '2' && response.data.lgu_data.is_card_released === '0'){
                            this.$refs.form.reset()
                            this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'red', title: title, body: 'Card not yet printed. <br>Please print the card before issuing.', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'CONTINUE', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'goToAdditionalInfoPage', btn_sec_params: response.data }
                        
                        }else if(response.data.lgu_data.is_card_ready === '1' && response.data.lgu_data.is_card_released === '1'){
                            this.$refs.form.reset()
                            this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-alert-circle', color: 'primary', title: 'This card has been issued', body: 'Go to the Lost Card process if the card has been lost and you wish to replace it', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                        
                        }else if(response.data.lgu_data.is_card_ready === '1' && response.data.lgu_data.is_card_released === '0'){
                            this.goToAdditionalInfoPage(response.data);

                        }else if(response.data.lgu_data.is_card_ready === '0' && response.data.lgu_data.is_card_released === '0' && response.data.lgu_data.registered_from === 'mobile'){
                            this.goToAdditionalInfoPage(response.data, true);

                        }else{
                            this.$refs.form.reset()
                            this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'primary', title: title, body: 'Incomplete registration or the card was not printed. Please complete registration or print the card first.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                        }
                    }

                    this.form_loading = false
                } else {
                    this.alert = response.error
                }
            }
        },

        alertLostCard(type) {
            let alert_title = this.ek_lgu_id ? 'Card Number: ' + this.ek_lgu_id.toUpperCase() : `<span class="font-weight-medium text-uppercase">${this.first_name} ${this.middle_name || ''} ${this.last_name} ${this.suffix || ''}</span><span class="d-block mb-2">${this.birthdate}</span>`, 
            alert_body = 'Does not exist in eCARE System.' //add the default message for is_card_ready 1/ is_card_release 0
            // if (type == 'not_registered') alert_body = 'Incomplete registration or the card was not printed. Please complete registration or print the card first.'
            if (type == 'not_registered') alert_body = 'Registration is incomplete, or the card has not been printed. Please finish the registration through the MEMBER REGISTRATION process.'
            if (type == 'card_not_printed') alert_body = 'The card of this member has not been printed yet. <br> Go to the Card Release process '
            if (type == 'card_not_released') alert_body = 'The card of this member haven\'t issued yet, thus, it cannot be tagged as Lost Card'
       
            return this.alert = { 
                display: true, 
                type: 'standard',  
                width: 600,  
                icon: 'mdi-alert-circle',  
                color: 'primary',  
                title: alert_title, 
                body: alert_body, 
                btn_pry_txt: 'Close', 
                btn_pry_color: 'primary',  
                btn_pry_otl: false,  
                btn_pry_act: 'closeAlert',   
            }
        },

        async proceedToChildCareForm() {
            let response = await this.$services.wsMemberWeb({
                key:"eurekare_key_web",
                data: {
                    command: "322101002",
                    data: {
                        request_key: 'SECONDARY',
                        registered_from: 'web',
                        is_app_ready: '0',
                        mem_policy_no: this.member_data.mem_hmo_policy_number,
                        mem_birthdate: this.birthdate,
                        mem_email: this.member_data.mem_email_address,
                        mem_birthplace: this.member_data.mem_birthplace,
                        mem_mobile_no: this.member_data.mem_mobile_number ? this.member_data.mem_mobile_number : '',
                        mem_landline_number: this.member_data.mem_landline_number ? this.member_data.mem_landline_number : '',
                        mem_first_name: this.first_name,
                        mem_middle_name: this.middle_name ? this.middle_name : '',
                        mem_last_name: this.last_name,
                        mem_suffix: this.suffix ? this.suffix : '',
                        mem_gender: '',
                        house_number: '',
                        street: '',
                        barangay: '',
                        municipality: '',
                        province: '',
                        region: '',
                        subdivision: '',
                        lot: '',
                        blk: '',
                        phase: '',
                        unit_room_floor: '',
                        building_name: '',
                        zip_code: '',
                        educational_attainment: '',
                        mem_company_name: '',
                        employment_status: '',
                        mem_occupation: '',
                        indigenous: '',
                        ethnic_group: '',
                        mem_religion: '',
                        mem_civil_status: '',
                        blood_type: '',
                        mothers_first_name: '',
                        mothers_middle_name: '',
                        mothers_surname: '',
                        mem_phic_pin: null,
                        mem_ek_phic_id: null,
                        phic_host_code: null,
                        ek_lgu_id: null,
                        principal_ek_lgu_id: null,
                        lgu_host_code: this.$store.state.usr_credentials.lgu_host_code || null,
                        registration_type: 'LGU',
                        has_data: '0',
                        mem_registration_type: 'DEPENDENT',
                        frbs_registration_id: '',
                        mem_photo: this.image_from_camera ? this.image_for_posting.slice(22) : '',
                        hmo_host_code: null,
                        mem_password: null,

                        primary_first_name: '',
                        primary_last_name:  '',
                        primary_birthdate: '',

                        mem_phic_membership_type: null,
                        mem_phic_membership_self_earning_type: null,
                        mem_phic_membership_migrant_worker_type: null,
                        mem_phic_membership_foreign_national_pra_srrv: null,
                        mem_phic_membership_foreign_national_acr_1: null,
                        mem_phic_membership_type_tag:  null, 
                        philsys_number: null,

                        current_card_key: '1',
                        is_card_ready: '0',
                        is_card_released: '0',
                        is_edit: false,
                        created_by: this.$store.state.usr_credentials.user_name,
                        provider_code: this.$store.state.prv_data.provider_code 
                    }
                }
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                const { ek_lgu_id } = response.data
                let member_data = {
                    lgu_data: {
                        ek_lgu_id: ek_lgu_id,
                        mem_first_name: this.first_name,
                        mem_middle_name: this.middle_name,
                        mem_last_name: this.last_name,
                        mem_suffix: this.suffix,
                        mem_birthdate: this.$moment(this.birthdate, 'MM-DD-YYYY', true).format('YYYY-MM-DD'),
                        principal_ek_lgu_id: null,
                        lgu_host_code: this.$store.state.usr_credentials.lgu_host_code || null,
                        bldg_no: '',
                        street: '',
                        brgy: '',
                        municipality: '',
                        province: '',
                        zip_code: '',
                        gender: ''
                    }
                }

                sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(member_data), 'njGHDdd'))
                this.$emit('proceedToChildCare', member_data)
            } else {
                this.alert = response.error
            }
        },

        cancelHousehold() {
            return this.alert = { 
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
                btn_pry_emt: 'endRegistration',
                btn_sec_txt: 'Stay on this page', 
                btn_sec_color: 'primary', 
                btn_sec_otl: false, 
                btn_sec_act: 'closeAlert',
            }
        },

        displayNotYetRegistered() {
            let title = this.ek_lgu_id ? 'Card Number: ' + this.ek_lgu_id.toUpperCase() : `<span class="font-weight-medium text-uppercase">${this.first_name} ${this.middle_name || ''} ${this.last_name} ${this.suffix || ''}</span><span class="d-block mb-2">${this.birthdate}</span>`
            this.$refs.form.reset()
            this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: title, body: 'Not yet registered in eCARE System', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        },

        goToAdditionalInfoPage(data, issuance_for_mobile) {
            if (issuance_for_mobile) {
                if (!data.primary_care_data || (data.primary_care_data && !data.primary_care_data.doctor_name)) {
                    data = {...data, ...{issuance_for_mobile: true}}
                    this.$emit('issuanceForMobile')
                } 
            }

            data = {...data, ...{step: 2,}}
            sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(data), 'njGHDdd'))
            this.$refs.form.reset()
            this.$emit('change-step', 2)
        },

        endRegistration() {
          sessionStorage.clear();
          this.$router.push('/code-scanning')
        },

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if((event.which < 48 || event.which > 57) && event.which !== 45){
                event.preventDefault();
            }
        },

        clearPHICPin() {
            this.phic_pin = '';
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
        }
    }
}
</script>

<style scoped>
.consent_style {
    cursor: pointer;
}
</style>