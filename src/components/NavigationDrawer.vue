<template>
    <div  v-resize="onScreenResize"> 
        <v-app-bar class="elevation-1 d-print-none" height="56" app>
            <h2 class="font-weight-regular"></h2>
            <template v-if="emr_params.routes === 'Consultation'"> 
                <v-btn @click="$emit('goToEligibility')" class="grey--text text--darken-2 my-2" text><v-icon  x-small left>fas fa-arrow-left</v-icon>Back to Eligibility</v-btn>
            </template>
            <template v-else> 
                <v-btn @click="$emit('confirmGoToPatientList')" text>
                    <v-icon size="20" left>mdi-arrow-left</v-icon>{{ emr_params.from_component === 'p_queue_list' ? 'PATIENT QUEUE LIST' : emr_params.from_component === 't_queue_list' ? 'TELEMEDICINE ASSISTED PATIENTS' : 'TRANSACTION LIST' }}
                </v-btn>
            </template>

            <v-spacer></v-spacer>

            <template v-if="prv_data.phic_acc_no"> 
                <label v-if="!mobile_screen" class="pr-4 caption">PHIC ACCREDITATION NUMBER: <span><b>{{ prv_data.phic_acc_no }}</b></span></label> 
            </template>
            <v-divider vertical> </v-divider>   
            <label v-if="!mobile_screen" class="px-4 caption">OPERATOR: <span><b>{{ usr_credentials.user_name }}</b></span></label>
            <v-btn v-if="!mobile_screen" color="light-blue darken-4" outlined rounded @click="$emit('logout')" x-small>Logout</v-btn>
            <div>
                <Settings />
            </div>
            <v-btn v-if="mobile_screen" @click="open_drawer = !open_drawer" class="grey--text" icon dark>
                <v-icon size="35">mdi-menu</v-icon>
            </v-btn>
        </v-app-bar>

        <v-app-bar class="elevation-1 d-print-none" width="auto" app bottom>
            <template v-if="show_speed_dial"> 
                <v-spacer> </v-spacer>
                <template v-if="emr_params.routes === 'Consultation'"> 
                    <v-speed-dial v-model="fab" bottom right transition="slide-y-reverse-transition" class="mt-8">
                        <template v-slot:activator>
                            <v-btn v-model="fab" color="blue darken-2" dark fab :small="$vuetify.breakpoint.smAndDown">
                            <v-icon v-if="fab" :small="$vuetify.breakpoint.smAndDown">
                                mdi-close
                            </v-icon>
                            <v-icon v-else :small="$vuetify.breakpoint.smAndDown">
                                mdi-account-circle
                            </v-icon>
                            </v-btn>
                        </template>
                        <v-btn v-if="selected_medicine.length === 0 && !this.referral_status" @click="$emit('submit', 'submit_to_doctor')"  fab :loading="submit_to_doctor_midwife" :small="$vuetify.breakpoint.smAndDown" color="primary">
                            <v-tooltip color="primary" left>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="20" v-bind="attrs" v-on="on">mdi-check-circle </v-icon>
                                </template> 
                                <span>{{ button_label }}</span>
                            </v-tooltip>
                        </v-btn>
                        <v-btn @click="$emit('validateEndTransaction')" :disabled="selected_referral ? true : false" fab :small="$vuetify.breakpoint.smAndDown" light  color="primary">
                            <v-tooltip color="primary" left>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="20" v-bind="attrs" v-on="on">fas fa-save</v-icon>
                                </template>
                                <span>End Transaction</span>
                            </v-tooltip>
                        </v-btn>
                        <v-btn @click="$emit('viewClinicalAbstract')" fab :small="$vuetify.breakpoint.smAndDown" dark  color="#367c9d">
                            <v-tooltip color="primary" left>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="20" v-bind="attrs" v-on="on">mdi-text-box</v-icon>
                                </template>
                                <span>VIEW CLINICAL ABSTRACT</span>
                            </v-tooltip>
                        </v-btn>
                        <v-badge :value="referral_empty_fields" content="!" color="red">
                            <template v-if="for_tele_consult">
                                <v-btn disabled fab :small="$vuetify.breakpoint.smAndDown" dark  color="#367c9d">
                                    <v-tooltip color="primary" left>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon size="20" v-bind="attrs" v-on="on">mdi-file-document</v-icon>
                                        </template>
                                        <span>DOCTOR REFERRAL</span>
                                    </v-tooltip>
                                </v-btn>
                            </template>
                            <template v-else> 
                                <v-btn @click="$emit('openReferralForm')" :disabled="selected_referral ? true : false" fab :small="$vuetify.breakpoint.smAndDown" dark  color="#367c9d">
                                    <v-tooltip color="primary" left>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon size="20" v-bind="attrs" v-on="on">mdi-file-document</v-icon>
                                        </template>
                                        <span>DOCTOR REFERRAL</span>
                                    </v-tooltip>
                                </v-btn>
                            </template>
                        </v-badge>
                        <v-btn @click="$emit('openTeleConsult')"  fab :small="$vuetify.breakpoint.smAndDown" dark  color="#367c9d" >
                            <v-tooltip color="primary" left>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="20" v-bind="attrs" v-on="on">mdi-file-document</v-icon>
                                </template>
                                <span>TELEMEDICINE ASSISTED REFERRAL</span>
                            </v-tooltip>
                        </v-btn>
                    </v-speed-dial>
                </template>
                <template v-else> 
                    <v-speed-dial v-model="fab" bottom right transition="slide-y-reverse-transition" class="mt-8">
                        <template v-slot:activator>
                            <v-btn v-model="fab" color="blue darken-2" dark fab  :small="$vuetify.breakpoint.smAndDown">
                            <v-icon v-if="fab" :small="$vuetify.breakpoint.smAndDown">
                                mdi-close
                            </v-icon>
                            <v-icon v-else :small="$vuetify.breakpoint.smAndDown">
                                mdi-account-circle
                            </v-icon>
                            </v-btn>
                        </template>
                        <v-btn  v-if="emr_params.routes !== 'TRANSACTION RECORD'" @click="submitToDoctor('submit_to_doctor')" fab :small="$vuetify.breakpoint.smAndDown" color="#367c9d" class="white--text">
                            <v-tooltip color="primary" left>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="20" v-bind="attrs" v-on="on">mdi-doctor </v-icon>
                                </template>
                                <span> Submit to Doctor </span>
                            </v-tooltip>
                        </v-btn>
                        <v-btn @click="checkEmptyFields('confirm')" fab :small="$vuetify.breakpoint.smAndDown" color="primary">
                            <v-tooltip color="primary" left>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="20" v-bind="attrs" v-on="on">mdi-check-circle </v-icon>
                                </template>
                                <span> {{ emr_params.routes === 'TRANSACTION RECORD' ? 'SAVE CHANGES' : 'DISCHARGE PATIENT' }} </span>
                            </v-tooltip>
                        </v-btn>
                        <v-btn :disabled="!leave_approval" @click="checkEmptyFields('save')" fab :small="$vuetify.breakpoint.smAndDown" light  color="success">
                            <v-tooltip color="primary" left>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="20" v-bind="attrs" v-on="on">mdi-content-save</v-icon>
                                </template>
                                <span>SAVE CHANGES</span>
                            </v-tooltip>
                        </v-btn>
                        <v-badge :value="referral_empty_fields" class="mt-4" content="!" color="red">
                            <template v-if="for_tele_consult">
                                <v-btn disabled color="#367c9d" class="white--text" >DOCTOR REFERRAL <v-icon small right>mdi-file-document</v-icon></v-btn>
                            </template>
                            <template v-else> 
                                <v-btn @click="$emit('openReferralForm')" fab :small="$vuetify.breakpoint.smAndDown" :disabled="selected_referral ? true : false" color="#367c9d" class="white--text">
                                    <v-tooltip color="primary" left>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon size="20" v-bind="attrs" v-on="on">mdi-file-document </v-icon>
                                        </template>
                                        <span> DOCTOR REFERRAL </span>
                                    </v-tooltip>
                                </v-btn>
                            </template>
                        </v-badge>
                        <v-btn :disabled="selected_medicine.length === 0 && without_procedures" @click="$emit('viewTreatmentPlan')" fab :small="$vuetify.breakpoint.smAndDown"   color="#367c9d">
                            <v-tooltip color="primary" left>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="20" v-bind="attrs" v-on="on">mdi-printer</v-icon>
                                </template>
                                <span>PRINT TREATMENT PLAN</span>
                            </v-tooltip>
                        </v-btn>
                    </v-speed-dial>
                </template>
            </template>
            <template v-else>
                <template v-if="emr_params.routes === 'Consultation'"> 
                    <div v-if="usr_credentials.user_type !== '9-1'" class="ml-4"> 
                        <v-badge :value="referral_empty_fields" class="mt-4 mr-4" content="!" color="red">
                            <template v-if="for_tele_consult">
                                <v-btn disabled color="#367c9d" class="white--text">DOCTOR REFERRAL <v-icon small right>mdi-file-document</v-icon></v-btn>
                            </template>
                            <template v-else> 
                                <v-btn @click="$emit('openReferralForm')" :disabled="selected_referral ? true : false" color="#367c9d" class="white--text">DOCTOR REFERRAL <v-icon small right>mdi-file-document</v-icon></v-btn>
                            </template>
                        </v-badge>
                        <v-btn @click="$emit('openTeleConsult')" color="#367c9d" class="white--text">TELEMEDICINE ASSISTED REFERRAL <v-icon small right>mdi-file-document</v-icon></v-btn>
                    </div>
                    <v-spacer> </v-spacer>
                    <div class="d-flex">  
                        <v-btn @click="$emit('validateEndTransaction')" :disabled="selected_referral ? true : false" class="white--text" color="blue darken-3" outlined >
                            End Transaction <v-icon right >fas fa-save</v-icon>
                        </v-btn>
                        <div v-if="usr_credentials.user_type !== '9-1' "> 
                            <v-btn
                                v-if="(selected_medicine.length === 0 && !this.referral_status)"
                                @click="$emit('submit', 'submit_to_doctor')"
                                class="mx-4 white--text"
                                color="blue darken-3"
                                :loading="submit_to_doctor_midwife"                                
                            >
                                {{ button_label }}
                                <v-icon right >fas fa-user-md</v-icon>
                            </v-btn>
                            <v-tooltip v-else bottom>
                                <template v-slot:activator="{ on }">
                                    <div v-on="on">
                                    <v-btn disabled class="mx-4 white--text" color="blue darken-3" >
                                        {{ button_label }}<v-icon right >fas fa-user-md</v-icon>
                                    </v-btn>
                                    </div>
                                </template>
                                <span v-if="selected_medicine.length === 0 && this.referral_status" class="body-1">
                                    {{ button_label }} option is not available when Doctor Referral are provided under this page.
                                </span>
                                <span v-else-if="selected_medicine.length > 0 && !this.referral_status" class="body-1">
                                    {{ button_label }} option is not available when OTC medicines are provided under this page.
                                </span>
                                <span v-else class="body-1">
                                    {{ button_label }} option is not available when OTC medicines and Doctor Referral are provided under this page.
                                </span>
                            </v-tooltip>   
                            <HelpVideoIcon v-if="show_help_icon"/>
                        </div>
                    </div>
                </template>
                <template v-else>      
                    <div class="ml-4 d-lg-block d-lg-flex justify-lg-start"> 
                        <v-badge :value="referral_empty_fields" class="mr-4" content="!" color="red">
                            <v-btn @click="$emit('openReferralForm')" color="#367c9d" class="white--text">DOCTOR REFERRAL <v-icon small right>mdi-file-document</v-icon></v-btn>
                        </v-badge>

                         <v-btn :disabled="selected_medicine.length === 0 && without_procedures" @click="$emit('viewTreatmentPlan')" class="white--text" color="#367c9d" >
                            PRINT TREATMENT PLAN
                            <v-icon size="20" right>mdi-printer</v-icon>
                        </v-btn>
                    </div>
                    <v-spacer> </v-spacer>
                    <div v-if="emr_params.editable" class="mr-4 d-lg-flex justify-lg-end"> 
                        <v-btn v-if="(usr_credentials.department === 'Doctor' || usr_credentials.department === 'Midwife' || usr_credentials.department === 'Medical Practitioner') && emr_params.routes !== 'TRANSACTION RECORD'" :disabled="!leave_approval" @click="checkEmptyFields('save')" class="mr-4" color="success">
                            SAVE CHANGES
                            <v-icon size="20" right>mdi-content-save</v-icon>
                        </v-btn>

                        <v-btn @click="checkEmptyFields('confirm', 'discharge_patient')" :loading="disabled_discharged_btn" color="primary" >
                            {{ emr_params.routes === 'TRANSACTION RECORD' ? 'SAVE CHANGES' : 'DISCHARGE PATIENT' }}
                            <v-icon size="20" right>mdi-check-circle</v-icon>
                        </v-btn>

                        <!-- <div v-if="usr_credentials.department === 'Medical Practitioner' || usr_credentials.department === 'Midwife'" class="ml-3">
                            <v-btn v-if="emr_params.routes !== 'TRANSACTION RECORD'" @click="submitToDoctor('submit_to_doctor')" :loading="disabled_discharged_btn" color="#367c9d" class="white--text">
                                Submit to Doctor
                                <v-icon size="20" right>mdi-doctor</v-icon>
                            </v-btn>
                        </div> -->
                    </div>
                    <HelpVideoIcon v-if="show_help_icon" />
                </template> 
            </template>
        </v-app-bar>
       
        <v-row dense> 
            <v-col  cols="10" sm="10" md="10" lg="10" xl="10"> 
                <v-sheet v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_a'"> 
                    <h2 class="font-weight-medium text-h6"> {{ $route.params.page === 'consultation' ?  'COMPLAINTS, SYMPTOMS & HISTORY' : $route.params.page === 'ncdqans' ? 'NCD QUESTIONNAIRE' : $route.params.page ? $route.params.page.toUpperCase().replaceAll('-', ' ') : '' }} </h2>
                </v-sheet>
                <v-sheet v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'"> 
                    <h2 class="text-h6 font-weight-medium"> {{emr_params.routes  === 'Consultation' ? 'COMPLAINTS, SYMPTOMS & HISTORY' : 'PATIENT INFORMATION' }}  </h2> 
                </v-sheet>
            </v-col>
            <v-col cols="2" sm="2" md="2" lg="2" xl="2" class="d-flex justify-end align-center mb-2"> 
                <template v-if="show_speed_dial"> 
                    <v-speed-dial v-model="print_fab" direction="left" transition="slide-y-reverse-transition" class="mt-8 mr-4">
                        <template v-slot:activator>
                            <v-btn v-model="print_fab" color="blue darken-2" dark fab :small="$vuetify.breakpoint.smAndDown">
                                <v-icon v-if="print_fab" :small="$vuetify.breakpoint.smAndDown">
                                    mdi-close
                                </v-icon>
                                <v-icon v-else :small="$vuetify.breakpoint.smAndDown">
                                    mdi-file
                                </v-icon>
                            </v-btn>
                        </template>
                        <v-btn @click="viewPrintableForm('philpen')" class="mr-2" color="#367c9d" dark fab :small="$vuetify.breakpoint.smAndDown">
                            <v-tooltip color="primary" bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="20" v-bind="attrs" v-on="on">mdi-file-edit</v-icon>
                                </template>
                                <span>PHILPEN</span>
                            </v-tooltip>
                        </v-btn>

                        <v-btn @click="$emit('viewTBDots')" class="mr-2" color="#367c9d" dark fab :small="$vuetify.breakpoint.smAndDown">
                            <v-tooltip color="primary" bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="20" v-bind="attrs" v-on="on">mdi-file-edit</v-icon>
                                </template>
                                <span>TB-DOTS</span>
                            </v-tooltip>
                        </v-btn>

                        <v-btn @click="$emit('viewClinicalAbstract')" class="mr-2" color="#367c9d" dark fab :small="$vuetify.breakpoint.smAndDown">
                            <v-tooltip color="primary" bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="20" v-bind="attrs" v-on="on">mdi-file-edit</v-icon>
                                </template>
                                <span>Clinical Abstract</span>
                            </v-tooltip>
                        </v-btn>
                    </v-speed-dial>
                </template>
                <template v-else> 
                    <v-btn @click="viewPrintableForm('philpen')" class="mr-2" color="#367c9d" dark><v-icon left>mdi-file-edit</v-icon> PHILPEN</v-btn>
                    <v-btn @click="$emit('viewTBDots')" class="mr-2" color="#367c9d" dark ><v-icon left>mdi-file-edit</v-icon> TB-DOTS</v-btn>
                    <v-btn @click="$emit('viewClinicalAbstract')" class="white--text" color="#367c9d" ><v-icon left>mdi-text-box</v-icon> Clinical Abstract</v-btn>
                </template>
            </v-col>
        </v-row> 
        
        <v-navigation-drawer v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_a'" v-model="open_drawer" :temporary="mobile_screen" :permanent="!mobile_screen" :width="mobile_screen ? '100%' : '370'" :app="!mobile_screen" :mini-variant.sync="close_drawer" class="d-print-none mt-14 mt-md-0" mini-variant-width="60" overlay-opacity="0" fixed style="max-height: calc(100%);"> 
            <v-list height="900" class="pb-12">
                <v-list-item>
                    <v-btn v-if="!mobile_screen" @click="close_drawer = !close_drawer" class="mb-1" icon>
                        <v-icon size="30">mdi-menu</v-icon>
                    </v-btn>
                    <v-list-item-content v-if="!close_drawer" class="py-1">
                        <h4 class="caption font-weight-medium  text-left ml-2">Health Care Facility:  <span class="caption font-weight-regular"> {{ prv_data.provider_name }} </span> </h4>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <div class="my-4" :hidden="close_drawer">
                    <template> 
                        <v-img v-if="!patient_consultation.patient_photo"  src="@/assets/no-image.jpg" height="228" contain></v-img>
                        <v-img v-else :src="patient_consultation.patient_photo" width="165"  height="205"  contain class="mx-auto elevation-5" alt="patient image" style="border:5px solid white"></v-img>
                        <h4 class="text-center mt-2 text-subtitle-2 text-md-subtitle-1 font-weight-medium grey--text text--darken-4 mx-2">{{patient_consultation.patient_full_name}}</h4>
                        <h4 class="text-center font-weight-regular text-subtitle-2 text-md-subtitle-1">{{ patient_consultation.patient_ek_lgu_id ? patient_consultation.patient_ek_lgu_id : 'N/A' }}</h4>
                    </template>
                </div>

                <div v-for="(nav, key) in filter_nav_drawer_item" :key="key">
                    <v-list-item :to="nav.path">
                        <v-list-item-icon>
                            <v-icon color="grey darken-2">{{ nav.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title class="body-2 grey--text text--darken-4">{{ nav.name }}</v-list-item-title>
                        </v-list-item-content>        
       
                        <v-list-item-icon v-if="
                                nav.name === 'IMMUNIZATION RECORDS' ? vac_has_empty || immunization_required : 
                                nav.name === 'PHYSICIAN DIAGNOSIS' ? (treatment_recommendation_error || off_required || med_required_error || chief_history_error) :
                                nav.name === 'COMPLAINTS, SYMPTOMS & HISTORY'? consultation_required :
                                nav.name === 'MEDICAL HISTORY'? medical_history_required || medical_history_allergy_required || medical_history_family_allergy_required :
                                nav.name === 'PHYSICAL EXAMINATION' ? pex_required_fields :
                                nav.name === 'OB-GYN HISTORY' ? ob_required :
                                nav.name === 'DRUGS/MEDICINE AND PLAN' ? !med_quantity_has_data : false
                            ">
                            <v-icon  color="red">
                                    mdi-alert-circle
                            </v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                </div>
            </v-list>
        </v-navigation-drawer> 
        <IdleTimer />
    </div>
</template>

<script>
import IdleTimer from '@/components/IdleTimer.vue'
import { mapState } from 'vuex'
import Settings from '@/components/Setting.vue'
import HelpVideoIcon from '@/components/help-video/Main.vue'

export default {
    props: [
        'navigation_drawer_item', 
        'disabled_discharged_btn', 
        'member_data', 'off_required', 
        'admitted_date_error', 
        'patient_info', 
        'vac_has_empty', 
        'referral_empty_fields', 
        'treatment_recommendation_error',
        'chief_history_error', 
        'consultation_required', 
        'medical_history_allergy_required',
        'medical_history_family_allergy_required',
        'physical_tab_has_pending', 
        'ob_required', 
        'immunization_required',
        'med_quantity_has_data', 
        'for_tele_consult', 
        'selected_referral', 
        'referral_data', 
        'for_print', 
        'save_print_dialog', 
        'emr_params', 
        'selected_medicine', 
        'without_procedures', 
        'leave_approval', 
        'pex_required_fields',
        'medical_history_required',
        'submit_to_doctor_midwife',
        'specialization',
        'med_required_error',
        'referral_status'
    ],
    
    components: {
        IdleTimer,
        Settings,
        HelpVideoIcon
    },

    data () {
        return {
            open_drawer: false,
            close_drawer: false,
            window_size: { x: 0, y: 0 },
            mobile_screen: false,
            tablet_screen: false,

            fab: false,
            print_fab: false,
            show_speed_dial: false,
            patient_discharge: true,
            current_nav: null
        }
    },

    computed: {
        ...mapState(['usr_credentials', 'prv_data']),

        //FILTER GENDER OF THE PATIENT FOR NAVIGATION ITEM
        filter_nav_drawer_item() {
            let member_info = this.emr_params.routes === 'Consultation' ? this.member_data.member : this.patient_info

            //REMOVE THE OB GYNE IF THE GENDER IS MALE
            let filter_items = this.navigation_drawer_item.filter(item => {
                if (member_info.mem_gender === 'MALE' || member_info.mem_gender === 'Male') {
                    return item.name !== 'OB-GYN HISTORY' 
                } else {
                    return item.name 
                }
            })
            
            //REMOVE THE NCD QUESTIONNAIRE IF THE AGE IS LESS THAN 25
            let new_items = filter_items.filter(item => {
                if (this.calculateAge(member_info.mem_birthdate) < 20) {
                    return item.name !== 'NCD QUESTIONNAIRE'
                } else {
                    return item.name
                }
            })
                
            return new_items 
        },

        //NEW OBJECT OF PATIENT INFO IN NAVIGATION
        patient_consultation() {
            if(this.emr_params.routes === 'Consultation') {
                return {
                    patient_full_name: this.member_data.member.mem_first_name + ' ' + (this.member_data.member.mem_middle_name ? this.member_data.member.mem_middle_name : '') + ' ' + this.member_data.member.mem_last_name + ' ' + (this.member_data.member.mem_suffix ? this.member_data.member.mem_suffix : ''),
                    patient_photo: this.member_data.member.mem_photo_upd || this.member_data.member.mem_photo,
                    patient_ek_lgu_id: this.member_data.member.ek_lgu_id
                }
            } 

            if(this.emr_params.routes === 'EMRConsultation' || this.emr_params.routes === 'TRANSACTION RECORD' || this.emr_params.routes === 'TELECONSULT') {
                return {
                    patient_full_name: this.patient_info.mem_first_name + ' ' + (this.patient_info.mem_middle_name ? this.patient_info.mem_middle_name : '') + ' ' + this.patient_info.mem_last_name + ' ' + (this.patient_info.mem_suffix ? this.patient_info.mem_suffix : ''),
                    patient_photo: this.patient_info.mem_photo,
                    patient_ek_lgu_id: this.patient_info.ek_lgu_id
                }
            }

            return ''
        },

        show_help_icon() {
            return this.$route.path === '/admission/consultation' || 
                   this.$route.path === '/admission/medical-history' ||
                   this.$route.path === '/admission/physical-examination' ||
                   this.$route.path === '/admission/immunization-record' ||
                   this.$route.path === '/admission/obgyne-history'||
                   this.$route.path === '/admission/ncdqans' ||
                   (this.$route.path != '/emr-consultation/ncdqans' && this.$route.name === 'EMRConsultationTypeA');
        },

        button_label() {
            if (this.for_tele_consult) {
                return 'Submit for Telemedicine Assisted';
            } else if (this.specialization === 'Midwifery') {
                return 'Submit to Midwife';
            } else if (this.specialization === 'Medical Practitioner') {
                return 'Submit to Medical Practitioner';
            } else {
                return 'Submit to Doctor';
            }
        }
    },

    methods: {
        // ON SCREEN RESIZE
        onScreenResize() {
            this.window_size = { 
                x: window.innerWidth, 
                y: window.innerHeight 
            }   
            
            if (this.window_size.x < 960) {
                this.mobile_screen = true
                this.close_drawer = false
            } else {
                this.mobile_screen = false
            }

            if (this.window_size.x >= 960 && this.window_size.x <= 1264) { 
                this.tablet_screen = true
                this.close_drawer = false 
            } else {
                this.tablet_screen = false
            }

            //CHECK THE SIZE SCREEN IF THE WINDOW SIZE IS LESS THAN 1350PX DISPLAY SPEED DIAL
            if(this.window_size.x < 1350) {
                this.show_speed_dial = true
            } else {
                this.show_speed_dial = false
            }
        },

        viewPrintableForm(data) {
            this.$emit('viewPrintableForm', data)
        },

        checkEmptyFields(data, key) {
            this.$emit('checkEmptyFields', data, key)
        },

        submitToDoctor(key){
            this.$emit('submitToDoctor', key)
        }
    }
}
</script>
