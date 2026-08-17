<template>
    <div>
        <template v-if="this.$store.state.usr_credentials.lgu_host_code === 'SR'">
            <div v-if="this.eligible_data.konsulta_eligible">
                <StaRosaKonsultaForm
                    @closeDoctorReferral="closeDoctorReferral"
                    @selectProvider="selectProvider"
                    :patient_info="patient_info" 
                    :emr_params="emr_params" 
                    :chief_complaint="chief_complaint" 
                    :pex_data="pex_data"
                    :loading_referral_data="loading_referral_data"
                    :referral_date="referral_date"
                    :loading_provider="loading_provider" 
                    :provider_items="provider_items"
                    :referral_status.sync="referral_status"
                    :referral_doctor_provider_name.sync="referral_doctor_provider_name"
                    :doctor_data="doctor_data"
                    :selected_icd="selected_icd"
                    :selected_medicine="selected_medicine"
                    :display_doctor_referral="display_doctor_referral"
                    :eligible_data="eligible_data"
                />
            </div>

            <div v-else>
                <StaRosaNonKonsultaForm 
                    @closeDoctorReferral="closeDoctorReferral"
                    @selectProvider="selectProvider"
                    @mutationStatus="mutationStatus"
                    :patient_info="patient_info" 
                    :emr_params="emr_params" 
                    :chief_complaint="chief_complaint" 
                    :pex_data="pex_data" 
                    :selected_icd="selected_icd"
                    :selected_medicine="selected_medicine" 
                    :doctor_data="doctor_data"
                    :referral_empty_fields="referral_empty_fields" 
                    :referral_date="referral_date"
                    :loading_provider="loading_provider" 
                    :provider_items="provider_items"
                    :loading_specialization="loading_specialization"
                    :specialization_items="specialization_items"
                    :loading_referral_data="loading_referral_data"
                    :referral_status.sync="referral_status"
                    :referral_code="referral_code"
                    :referral_doctor_provider_name.sync="referral_doctor_provider_name"
                    :referral_doctor_provider_tin="referral_doctor_provider_tin"
                    :referral_doctor_provider_code="referral_doctor_provider_code"
                    :referral_doctor_tin="referral_doctor_tin"
                    :referral_doctor_code="referral_doctor_code"
                    :referral_doctor_first_name="referral_doctor_first_name"
                    :referral_doctor_middle_name="referral_doctor_middle_name"
                    :referral_doctor_last_name="referral_doctor_last_name"
                    :referral_doctor_contact_number="referral_doctor_contact_number"
                    :referral_doctor_specialization="referral_doctor_specialization"
                    :reason_for_referral.sync="reason_for_referral"
                    :referring_doctor_contact_no="referring_doctor_contact_no"
                    :return_slip_margin="return_slip_margin"
                    :display_doctor_referral="display_doctor_referral"
                    :family_medical_history="family_medical_history"
                    :past_medical_history="past_medical_history"
                />

            </div>
            
        </template>
        
        <template v-else>
            <DefaultReferral 
                @mutationStatus="mutationStatus"
                @closeDoctorReferral="closeDoctorReferral"
                @selectProvider="selectProvider"
                :eligible_data="eligible_data"
                :patient_info="patient_info" 
                :emr_params="emr_params" 
                :chief_complaint="chief_complaint" 
                :pex_data="pex_data" 
                :selected_icd="selected_icd"
                :selected_medicine="selected_medicine" 
                :doctor_data="doctor_data"
                :referral_empty_fields="referral_empty_fields" 
                :referral_date="referral_date"
                :loading_provider="loading_provider" 
                :provider_items="provider_items"
                :loading_specialization="loading_specialization"
                :specialization_items="specialization_items"
                :loading_referral_data="loading_referral_data"
                :referral_code="referral_code"
                :referral_doctor_provider_name.sync="referral_doctor_provider_name"
                :referral_doctor_provider_tin="referral_doctor_provider_tin"
                :referral_doctor_provider_code="referral_doctor_provider_code"
                :referral_doctor_tin="referral_doctor_tin"
                :referral_doctor_code="referral_doctor_code"
                :referral_doctor_first_name.sync="referral_doctor_first_name"
                :referral_doctor_middle_name.sync="referral_doctor_middle_name"
                :referral_doctor_last_name.sync="referral_doctor_last_name"
                :referral_doctor_contact_number.sync="referral_doctor_contact_number"
                :referral_doctor_specialization.sync="referral_doctor_specialization"
                :reason_for_referral.sync="reason_for_referral"
                :referring_doctor_contact_no="referring_doctor_contact_no"
                :return_slip_margin="return_slip_margin"
                :display_doctor_referral="display_doctor_referral"
            />
        </template>
    </div>
        
</template>

<script>
import DefaultReferral from '@/components/emr/printable-form/referral-form/DefaultReferral.vue'
import StaRosaKonsultaForm from '@/components/emr/printable-form/referral-form/sta-rosa/KonsultaForm.vue'
import StaRosaNonKonsultaForm from '@/components/emr/printable-form/referral-form/sta-rosa/Non-KonsultaForm.vue'
import { mapState } from 'vuex'

export default {
    props: ['date_admitted', 'patient_info', 'emr_params', 'chief_complaint', 'pex_data', 'selected_icd', 'selected_medicine', 'doctor_data', 'referral_empty_fields', 'eligible_data', 'family_medical_history', 'past_medical_history'],

    components: {
        DefaultReferral,
        StaRosaKonsultaForm,
        StaRosaNonKonsultaForm
    },

    data() {
       return {
            referral_date: '',
            loading_provider: true,
            provider_items: [],
            loading_specialization: true,
            specialization_items: [],
            
            loading_referral_data: false,
            referral_status: false,
            referral_code: '',
            referral_doctor_provider_name: '',
            referral_doctor_provider_tin: '',
            referral_doctor_provider_code: '',
            referral_doctor_tin: '',
            referral_doctor_code: '',
            referral_doctor_first_name: '',
            referral_doctor_middle_name: '',
            referral_doctor_last_name: '',
            referral_doctor_contact_number: '',
            referral_doctor_specialization: '',
            reason_for_referral: '',
            referring_doctor_contact_no: '',

            return_slip_margin: '0px',
            display_doctor_referral: false,
       } 
    },

    watch: {
        date_admitted(newVal) {
            if (this.$store.state.usr_credentials.department === 'Doctor' ||this.$store.state.usr_credentials.department === 'Midwife') {
                this.referral_date = newVal;
                this.getReferralData();
            }
        }
    },
    
    created() {
        if (this.$store.state.usr_credentials.department !== 'Doctor' &&this.$store.state.usr_credentials.department !== 'Midwife') {
            this.referral_date = this.$moment().format('MM-DD-YYYY');
            this.getSpecializationList();
        }
    },

    computed: {
        ...mapState(['usr_credentials'])  
    },

    methods: {
        openDoctorReferral(){
            this.display_doctor_referral = true
            // this.getReferralData()
        },

        async getReferralData() {

            let referral_data = localStorage.getItem('65sHXXfg23') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('65sHXXfg23'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true
            }
            if (!this.display_doctor_referral) return; 
            
            if (referral_data.fresh_load) {
                this.loading_referral_data = true
                let response = await this.$services.getPatientRecordAndTransaction({
                    request_key: 'referral',
                    transaction_number: this.emr_params.transaction_number
                })

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
                    referral_data = response.data

                    this.is_for_referral = response.data.is_for_referral,
                    this.referral_code = response.data.referral_code
                    this.referral_doctor_provider_name = response.data.referral_doctor_provider_name
                    this.referral_doctor_provider_tin = response.data.referral_doctor_provider_tin
                    this.referral_doctor_provider_code = response.data.referral_doctor_provider_code
                    this.referral_doctor_tin = response.data.referral_doctor_tin
                    this.referral_doctor_code = response.data.referral_doctor_code
                    this.referral_doctor_first_name = response.data.referral_doctor_first_name
                    this.referral_doctor_last_name = response.data.referral_doctor_last_name
                    this.referral_doctor_middle_name = response.data.referral_doctor_middle_name
                    this.referral_doctor_contact_number = response.data.referral_doctor_contact_number
                    this.referral_doctor_specialization = response.data.referral_doctor_specialization
                    this.reason_for_referral = response.data.reason_for_referral
                    this.referring_doctor_contact_no = response.data.referring_doctor_contact_no

                    localStorage.setItem('65sHXXfg23', this.$crypto.AES.encrypt(JSON.stringify(referral_data), 'EMX246'))
                    this.loading_referral_data = false
                    this.getSpecializationList();
                } else {
                    this.alert = response.error
                }
            } else {
                this.is_for_referral= referral_data.is_for_referral,
                this.referral_code = referral_data.referral_code
                this.referral_doctor_provider_name = referral_data.referral_doctor_provider_name
                this.referral_doctor_provider_tin = referral_data.referral_doctor_provider_tin
                this.referral_doctor_provider_code = referral_data.referral_doctor_provider_code
                this.referral_doctor_tin = referral_data.referral_doctor_tin
                this.referral_doctor_code = referral_data.referral_doctor_code
                this.referral_doctor_first_name = referral_data.referral_doctor_first_name
                this.referral_doctor_last_name = referral_data.referral_doctor_last_name
                this.referral_doctor_middle_name = referral_data.referral_doctor_middle_name
                this.referral_doctor_contact_number = referral_data.referral_doctor_contact_number
                this.referral_doctor_specialization = referral_data.referral_doctor_specialization
                this.reason_for_referral = referral_data.reason_for_referral
                this.referring_doctor_contact_no = referral_data.referring_doctor_contact_no
                this.getSpecializationList();
            }
        },

        async getSpecializationList() {
            if (!this.referral_code) {
                this.generateReferralCode();
            }
            
            if (localStorage.getItem('VGR084')) {
                this.specialization_items = JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('VGR084'), 'pggpjxKK').toString(this.$crypto.enc.Utf8))
                this.loading_specialization = false
                this.getProviderList();
            } else {
                let response = await this.$services.getDoctorSpecialization()

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
                    localStorage.setItem('VGR084', this.$crypto.AES.encrypt(JSON.stringify(response.data.specialization), 'pggpjxKK'))
                    this.specialization_items = response.data.specialization
                    this.loading_specialization = false
                    this.getProviderList();
                } else {
                    this.alert = response.error
                }
            }
        },
        
        async getProviderList() {
            if (localStorage.getItem('KFH45P')) {
                this.provider_items = localStorage.getItem('KFH45P') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('KFH45P'), 'Gl53k9sE').toString(this.$crypto.enc.Utf8)) : null
                this.loading_provider = false
            } else {
                let response = await this.$services.getProviderList({
                    lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
                })

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
                    response.data.unshift({
                        name: 'No Specific Hospital',
                        provider_tin: '',
                        provider_code: ''
                    })
                    localStorage.setItem('KFH45P', this.$crypto.AES.encrypt(JSON.stringify(response.data), 'Gl53k9sE'))
                    this.provider_items = response.data
                    this.loading_provider = false
                } else {
                    this.alert = response.error
                }
            }
        },
        
        generateReferralCode() {
            if (this.$store.state.usr_credentials.department === 'Doctor' || this.$store.state.usr_credentials.department === 'Midwife') {
                let user_code = this.$store.state.usr_credentials.user_code.slice(-3)
                let doctor_tin_code = this.$store.state.usr_credentials.doctor_tin ? this.$store.state.usr_credentials.doctor_tin.slice(0, 3) : this.$store.state.usr_credentials.doctor_code.slice(0, 3)
                let date = (new Date().getFullYear().toString().substr(-2)) + ((new Date().getMonth() < 9 ? '0' : '') + (new Date().getMonth() + 1)) + ((new Date().getDate() < 9 ? '0' : '') + (new Date().getDate()))
                let time = ('0' + new Date().getHours()).slice(-2) + ('0' + new Date().getMinutes()).slice(-2)
                let random_character = Math.random().toString(25).substring(2, 5)
    
                this.referral_code = ('RF-' + user_code + doctor_tin_code + '-' + date + time + '-' + random_character).toUpperCase()
            } else {
                let user_code = this.$store.state.usr_credentials.user_code.slice(-3)
                let date = (new Date().getFullYear().toString().substr(-2)) + ((new Date().getMonth() < 9 ? '0' : '') + (new Date().getMonth() + 1)) + ((new Date().getDate() < 9 ? '0' : '') + (new Date().getDate()))
                let time = ('0' + new Date().getHours()).slice(-2) + ('0' + new Date().getMinutes()).slice(-2)
                let random_character = Math.random().toString(25).substring(2, 5)
    
                this.referral_code = ('RF-' + user_code + '-' + date + time + '-' + random_character).toUpperCase()
            }
        },
        
        selectProvider(value) {
            this.referral_doctor_provider_tin = value?.provider_tin ? value.provider_tin : ''
            this.referral_doctor_provider_code = value?.provider_code ? value.provider_code : ''
            
            setTimeout(() => {
                this.referral_doctor_provider_name = value?.name ? value.name : value
            }, 50)    

            this.mutationStatus();
        },

        mutationStatus() {
            this.referral_status = true
            this.$emit('referral_status', true)
        },

        closeDoctorReferral() {
            if (this.referral_status) {
                let referral_data = {
                    referral_code: this.referral_code,  
                    referral_doctor_provider_name: this.referral_doctor_provider_name,
                    referral_doctor_provider_tin: this.referral_doctor_provider_tin,
                    referral_doctor_provider_code: this.referral_doctor_provider_code,
                    referral_doctor_tin: this.referral_doctor_tin,
                    referral_doctor_code: this.referral_doctor_code,
                    referral_doctor_first_name: this.referral_doctor_first_name,
                    referral_doctor_middle_name: this.referral_doctor_middle_name,
                    referral_doctor_last_name: this.referral_doctor_last_name,
                    referral_doctor_specialization: this.referral_doctor_specialization,
                    referral_doctor_contact_number: this.referral_doctor_contact_number,
                    reason_for_referral: this.reason_for_referral,
                    referring_doctor_tin: this.$store.state.usr_credentials.doctor_tin,
                    referring_doctor_code: this.$store.state.usr_credentials.doctor_code,
                    referring_doctor_provider_tin: this.$store.state.prv_data.provider_tin,
                    referring_doctor_provider_code: this.$store.state.prv_data.provider_code,
                    referring_doctor_contact_no: this.referring_doctor_contact_no
                }
                this.$emit('getReferralData', referral_data)
                localStorage.setItem('65sHXXfg23', this.$crypto.AES.encrypt(JSON.stringify(referral_data), 'EMX246'))
            }

            this.display_doctor_referral = false
        },
    }
}
</script>