<template>
    <div class="mx-4 mx-md-8 mt-7 mb-10">
        <div id="not-for-print" class="d-print-none">
            <v-overlay v-show="loading_data" class="text-center" color="#ffffff" opacity="1" z-index="9">
                <v-progress-circular color="primary" size="35" indeterminate></v-progress-circular>
                <h4 class="light-blue--text text--darken-4 pl-5 pt-3">Loading... Please wait...</h4>
            </v-overlay>

            <div v-show="!loading_data">
                <v-form :readonly="!emr_params.editable">
                    <NavigationDrawer 
                        :navigation_drawer_item="navigation_drawer_item" 
                        :patient_info="patient_info" 
                        :doctor_data="doctor_data"
                        :vac_has_empty="vac_has_empty" 
                        :treatment_recommendation_error="treatment_recommendation_error"
                        :save_print_dialog="save_print_dialog"
                        :emr_params="emr_params"
                        :selected_medicine="selected_medicine"
                        :leave_approval="leave_approval"
                        :without_procedures="without_procedures"
                        :referral_empty_fields="referral_empty_fields"
                        :disabled_discharged_btn="disabled_discharged_btn"
                        :medical_history_required="medical_history_required"
                        :med_required_error="med_required_error"
                        :chief_history_error="chief_history_error"
                        @viewPrintableForm="viewPrintableForm"
                        @viewTBDots="viewTBDots"
                        @logout="logout"
                        @viewClinicalAbstract="viewClinicalAbstract"
                        @viewTreatmentPlan="viewTreatmentPlan"
                        @checkEmptyFields="checkEmptyFields"
                        @confirmGoToPatientList="confirmGoToPatientList"
                        @openReferralForm="openReferralForm"
                    />

                    <v-divider> </v-divider>

                    <!-- PATIENT INFORMATION -->
                    <PatientInformation
                        v-show="($route.params.page === 'patient-information' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                        ref="other_religion"
                        :patient_info="patient_info"
                        :ethnic_items="ethnic_items"
                        :plan_data="plan_data"
                        :pti_empty_fields="pti_empty_fields"
                        :emr_params="emr_params" 
                        :blood_type_list="blood_type_list"
                        class="d-print-none"
                        @mutationStatus="mutationStatus"   
                    />
           
                    <v-lazy v-model="med_hist_active" :options="page_option" :min-height="page_min_height" transition="fade-transition"> 
                        <v-sheet class="mt-6"> 
                            <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium"> MEDICAL HISTORY </h4>
                            <MedicalHistory 
                                v-show="($route.params.page === 'medical-history' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                                ref="medical_history"
                                :emr_params="emr_params" 
                                :loading_medicine="loading_medicine" 
                                :medicine_list="medicine_list" 
                                :social_history_empty_field="social_history_empty_field"
                                :patient_birthdate="patient_info.mem_birthdate" 
                                :eligible_data="eligible_data"
                                class="d-print-none"
                                @mutationStatus="mutationStatus"
                                @loadingComplete="loadingComplete"
                            />
                        </v-sheet>
                    </v-lazy>

                    <v-lazy v-model="phy_active" :options="page_option" :min-height="page_min_height" transition="fade-transition"> 
                        <v-sheet class="mt-6"> 
                            <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium">PHYSICAL EXAMINATION</h4> 
                            <PhysicalExamination 
                                v-show="($route.params.page === 'physical-examination' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                                ref="physical_examination"
                                :emr_params="emr_params" 
                                :patient_age="parseInt(patient_info.mem_age)" 
                                :patient_birthdate="patient_info.mem_birthdate" 
                                :patient_gender="patient_info.mem_gender"
                                :eligible_data="eligible_data"
                                :for_saving="for_saving" 
                                class="d-print-none"
                                @mutationStatus="mutationStatus" 
                                @getPhysicalExamination="getPhysicalExamination"
                            />
                        </v-sheet>
                    </v-lazy>

                    <v-lazy v-if="imm_active" v-model="imm_active" :options="page_option" :min-height="page_min_height" transition="fade-transition"> 
                        <v-sheet class="mt-6"> 
                            <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium"> IMMUNIZATION </h4> 
                            <div v-show="($route.params.page === 'immunization-records' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'" > 
                                <v-tabs v-model="tab" class="mt-7" active-class="active-tab" mobile-breakpoint="0" show-arrows hide-slider outlined>
                                    <v-tab class="non-active-tab">
                                        <v-badge v-if="vac_has_empty" content="!" color="red" inline>VACCINATION RECORD</v-badge>
                                        <span v-else>VACCINATION RECORD</span>
                                    </v-tab>

                                    <v-tab class="non-active-tab">
                                        <v-badge v-if="cov_empty_fields" content="!" color="red" inline>COVID VACCINATION RECORD</v-badge>
                                        <span v-else>COVID VACCINATION RECORD</span>
                                    </v-tab>
                                </v-tabs>
                                <v-tabs-items v-model="tab" touchless>
                                    <v-expansion-panels v-model="panel" multiple>
                                        <v-expansion-panel class="tabs-border">
                                            <v-tab-item>
                                                <v-expansion-panel-header class="expand-icon" :expand-icon="panel.length > 0 ? 'mdi-chevron-up-circle' : 'mdi-chevron-down-circle'">
                                                    <h4 class="body-1 font-weight-medium">Vaccination Record<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Rekord ng pagbabakuna)</span></h4>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <VaccinationRecord 
                                                        ref="vaccination_record"
                                                        :emr_params="emr_params"
                                                        :vac_has_empty="vac_has_empty"
                                                        :loading_vaccinator="loading_vaccinator"
                                                        :loading_vaccination="loading_vaccination"
                                                        :vaccinator_items="vaccinator_items" 
                                                        :patient_birthdate="patient_info.mem_birthdate"
                                                        :patient_age="parseInt(patient_info.mem_age)"  
                                                        @mutationStatus="mutationStatus" 
                                                    />
                                                </v-expansion-panel-content>
                                            </v-tab-item>
                                            <v-tab-item>
                                                <v-expansion-panel-header class="expand-icon" :expand-icon="panel.length > 0 ? 'mdi-chevron-up-circle' : 'mdi-chevron-down-circle'">
                                                    <h4 class="body-1 font-weight-medium">Covid Vaccination Record<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pagbabakuna sa covid)</span></h4>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <CovidVaccination 
                                                        :emr_params="emr_params" 
                                                        :loading_vaccinator="loading_vaccinator" 
                                                        :vaccinator_items="vaccinator_items" 
                                                        :cov_empty_fields="cov_empty_fields" 
                                                        :patient_birthdate="patient_info.mem_birthdate" 
                                                        @noEmptyFields="cov_empty_fields = false" 
                                                        ref="covid"
                                                        @mutationStatus="mutationStatus" 
                                                    />
                                                </v-expansion-panel-content>
                                            </v-tab-item>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </v-tabs-items>
                            </div>
                        </v-sheet>
                    </v-lazy>

                    <div v-if="patient_info.mem_gender === 'Female' || patient_info.mem_gender === 'FEMALE'" > 
                        <v-lazy v-if="ob_active" v-model="ob_active" :options="page_option" :min-height="page_min_height" transition="fade-transition"> 
                            <v-sheet class="mt-6"> 
                                <h4 v-show="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium"> OB-GYNE </h4> 
                                <ObGyneHistory 
                                    v-show="($route.params.page === 'obgyne-history' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                                    :emr_params="emr_params" 
                                    :patient_birthdate="patient_info.mem_birthdate" 
                                    ref="ob_gyne"
                                    class="d-print-none"
                                    @mutationStatus="mutationStatus"
                                />
                            </v-sheet>
                        </v-lazy>
                    </div>

                    <v-lazy v-model="med_rec_active" :options="page_option" :min-height="page_min_height" transition="fade-transition"> 
                        <v-sheet class="mt-6"> 
                            <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium"> MEDICAL RECORDS </h4> 
                            <MedicalRecords 
                                v-if="($route.params.page === 'medical-records' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                                :emr_params="emr_params" 
                                :patient_info="patient_info"
                                :eligible_data="eligible_data"
                                ref="medical_records"
                            />
                        </v-sheet>
                    </v-lazy>

                    <v-lazy v-model="diagnostic_active" :options="page_option" :min-height="page_min_height" transition="fade-transition"> 
                        <v-sheet class="mt-6"> 
                            <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium"> DIAGNOSTIC EXAM RESULT </h4>
                            <DiagnosticExamResult 
                                v-if="($route.params.page === 'diagnostic-exam-result' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                                :emr_params="emr_params"
                                :selected_icd="selected_icd"
                                :patient_info="patient_info"
                                :doctor_info="{ doctor_name: doctor_data.first_name + ' ' + doctor_data.middle_name + ' ' + doctor_data.last_name + ' ' + doctor_data.suffix, doc_tin: doctor_data.doc_prc_license }"
                                @getDiagnosticExam="getDiagnosticExam"
                            />
                        </v-sheet>
                    </v-lazy>

                    <v-lazy v-model="physician_active" :options="page_option" :min-height="page_min_height" transition="fade-transition"> 
                        <v-sheet class="mt-6"> 
                            <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium">PHYSICIAN DIAGNOSIS AND TREATMENT PLAN </h4>   
                            <!-- PHYSICIAN DIAGNOSIS AND TREATMENT PLAN -->

                            <PhysicianDiagnosis 
                                v-if="($route.params.page === 'physician-diagnosis-and-treatment-plan' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                                class="d-print-none"
                                ref="phy_signs_and_symptoms"
                                :patient_age="parseInt(patient_info.mem_age)" 
                                :patient_birthdate="patient_info.mem_birthdate" 
                                :patient_gender="patient_info.mem_gender"
                                :eligible_data="eligible_data"
                                :for_saving="for_saving" 
                                :date_admitted="date_admitted"
                                :visit_data="visit_data"
                                :purpose_of_visit_items="purpose_of_visit_items"
                                :emr_params="emr_params"
                                :chief_complaint="chief_complaint"
                                :physician_diagnosis="physician_diagnosis"
                                :admitting_diagnosis="admitting_diagnosis"
                                :select_management="select_management"
                                :signs_and_symptoms="signs_and_symptoms"
                                :switch_favorite="switch_favorite"
                                :selected_icd="selected_icd"
                                :icd_items="icd_items"
                                :favorite_items="favorite_items"
                                :selected_cpt_holder="selected_cpt_holder"
                                :select_cpt_modifier="select_cpt_modifier"
                                :selected_cpt = "selected_cpt"
                                :selected_icd_favorites.sync="selected_icd_favorites"
                                :filter_physician_recommend="filter_physician_recommend"
                                :management_items="management_items"
                                :select_physician_recommendation="select_physician_recommendation"
                                :filter_patient_remarks="filter_patient_remarks"
                                :select_patient_remarks="select_patient_remarks"
                                :selected_cpt_favorites.sync="selected_cpt_favorites"
                                :selected_medicine_holder="selected_medicine_holder"
                                :loading_medicine="loading_medicine"
                                :medicine_items="medicine_items"
                                :cpt_items="cpt_items"
                                :other_med="other_med"
                                :selected_medicine="selected_medicine"
                                :med_required_error="med_empty_fields"
                                :treatment_recommendation="treatment_recommendation"
                                :treatment_recommendation_error="treatment_recommendation_error"
                                :chief_complaint_error="chief_empty_fields"
                                :chief_history_error="chief_history_empty"
                                :doctor_notes="doctor_notes"
                                :doctor_data="doctor_data"
                                :acknowledgement_referral_code="acknowledgement_referral_code"
                                :plan_data="plan_data"
                                :date_today="date_today"
                                :search_icd_items="search_icd_items"
                                :search_cpt_items="search_cpt_items"
                                :patient_info="patient_info"
                                :current_doctor.sync="current_doctor"
                                :is_item_disabled="is_item_disabled"
                                :switch_add_package_procedure="switch_add_package_procedure"
                                :selected_package_procedure.sync="selected_package_procedure" 
                                :selected_cpt_for_new_package.sync="selected_cpt_for_new_package" 
                                :reset_switch.sync="switch_add_package_procedure"
                                :package_name="package_name"
                                :visit_loading_data="visit_loading_data"
                                @update:selected_package_procedure="addPackageProcedures"
                                @update:selected_cpt_for_new_package="addNewPackageProcedures"
                                @setPackageProcedure="setPackageProcedure"
                                @removeDiagnosis="removeDiagnosis"
                                @getSignsAndSymptoms="getSignsAndSymptoms"
                                @mutationStatus="mutationStatus"
                                @selectedManagement="selectedManagement"
                                @setFavorites="setFavorites"
                                @addDiagnosisData="addDiagnosisData"
                                @unFavoritesDiagnosis="unFavoritesDiagnosis"
                                @addToFavorites="addToFavorites"
                                @addProcedure="addProcedure"
                                @removeProcedure="removeProcedure"
                                @removeAddedDrugsMedicine="removeAddedDrugsMedicine"
                                @showLongDesc="showLongDesc"
                                @addDiagnosisField="addDiagnosisField"
                                @addDrugsMedicine="addDrugsMedicine"
                                @selectedMedicineHolder="selectedMedicineHolder"
                                @saveOthersMed="saveOthersMed"
                                @viewMedicalCertificate="viewMedicalCertificate"
                                @viewCertificateOfDisability="viewCertificateOfDisability"
                                @viewGenderVerification="viewGenderVerification"
                                @viewFollowUpForm="viewFollowUpForm"
                                @loadMore="loadMore"
                                @searchItems="searchItems"
                            />
                        </v-sheet>
                    </v-lazy>

                    <v-lazy v-model="ncdqans_active" :options="page_option" :min-height="page_min_height" transition="fade-transition"> 
                        <v-sheet v-if="calculateAge(patient_info.mem_birthdate) >= 20" class="mt-6"> 
                            <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium pb-2"> NCD QUESTIONNAIRE </h4> 
                            <Ncdqans 
                                v-show="($route.params.page === 'ncdqans' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                                :loading_ncdqans="loading_ncdqans"
                                :editable="emr_params.editable"
                                :dietary_information="dietary_information.data"
                                :ncdqans="ncdqans"
                                :patient_info="patient_info"
                                :patient_name="`${patient_info.mem_first_name} ${patient_info.mem_middle_name || ''} ${patient_info.mem_last_name} ${patient_info.mem_suffix || ''}`"
                                :family_medical_history="medical_history.family_medical_history"
                                :patient_social_history="medical_history.patient_social_history"
                                :pex_data="pex_data"
                                @mutationStatus="mutationStatus"
                            />
                        </v-sheet>
                    </v-lazy>
                </v-form>
            </div>

            <!-- FOR PRINT -->
            <PhilPen 
                :date_today="formatDate(date_today)"
                :patient_info="patient_info"
                :patient_name="`${patient_info.mem_first_name} ${patient_info.mem_middle_name || ''} ${patient_info.mem_last_name} ${patient_info.mem_suffix || ''}`"
                :selected_medicine="selected_medicine"
                :family_medical_history="medical_history.family_medical_history"
                :patient_social_history="medical_history.patient_social_history"
                :pex_data="pex_data"
                :dietary_information="dietary_information.data"
                :jspdf="jspdf"
                :notes="doctor_notes"
                :emr_params="emr_params"
                ref="philpen"
                @display_philpen="save_print_dialog = false"
            />
            
            <!-- <v-dialog v-if="display_doctor_referral" v-model="display_doctor_referral" width="1500" hide-overlay persistent> -->
                <DoctorReferralForm :date_admitted="date_admitted" :family_medical_history="medical_history.family_medical_history" :past_medical_history="medical_history.past_medical_history" :eligible_data="eligible_data" :patient_info="patient_info" :emr_params="emr_params" :chief_complaint="chief_complaint" :pex_data="pex_data" :selected_icd="selected_icd" :selected_medicine="selected_medicine" :doctor_data="doctor_data" @referral_status="mutationStatus('referral')" ref="doctor_referral" @getReferralData="getReferralData" />
            <!-- </v-dialog> -->

            <!-- Printable Forms -->
            <TBDots :tb_dots_loading_data="tb_dots_loading_data" :jspdf="jspdf" :emr_params="emr_params" @mutationStatus="mutationStatus" ref="tb_dots" />
            <MedicalCertificate :jspdf="jspdf" ref="medical_certificate" :doctor_notes="doctor_notes" :select_management="select_management" :emr_params="emr_params"/>
            <DisabilityCertificate :jspdf="jspdf" ref="disability_certificate" :doctor_notes="doctor_notes" :select_management="select_management" :emr_params="emr_params"/>
            <GenderVerification :jspdf="jspdf" ref="gender_verification" :doctor_notes="doctor_notes" :select_management="select_management" :emr_params="emr_params"/>
            <ClinicalAbstract ref="clinical_abstract" :emr_params="emr_params" :admitting_diagnosis="admitting_diagnosis" :chief_complaint="chief_complaint" :pex_data="pex_data" :selected_icd="selected_icd" :selected_medicine="selected_medicine" :doctor_data="doctor_data"/>
            <TreatmentPlan ref="treatment_plan" :patient_info="patient_info" :date_admitted="date_admitted" :doctor_notes="doctor_notes" :select_management="select_management" :follow_up_consultation_date="plan_data.follow_up_consultation_date" :emr_params="emr_params"/>
            <FollowUpForm :jspdf="jspdf" ref="follow_up_form" :doctor_notes="doctor_notes" :select_management="select_management" :emr_params="emr_params"/>

            <v-dialog v-if="other_management.dialog" v-model="other_management.dialog" width="400" persistent>
                <v-card class="pa-5">
                    <h6 class="font-weight-regular body-2">Others</h6>
                    <v-text-field v-model="other_management.new" @input="other_management.new = textCapitalize($event)" placeholder="Enter other management here" hide-details outlined></v-text-field>

                    <v-layout justify-end wrap mt-4>
                        <v-btn @click="other_management.dialog = false" small>CLOSE</v-btn>
                        <v-btn @click="saveOthersManagement" :disabled="!other_management.new" class="ml-2" color="primary" small>CONFIRM</v-btn>
                    </v-layout>
                </v-card>
            </v-dialog>

            <v-dialog v-if="doctors_dialog_list" v-model="doctors_dialog_list" width="750" persistent>
                <v-card >
                    <v-card-title class="text-body-1 primary white--text text-center">Select Doctor </v-card-title>
                    <v-sheet class="pa-5">       
                        <v-autocomplete v-model="current_doctor" :items="doctor_items" item-text="autoCompleteText" :loading="doctor_loader" outlined clearable hide-details return-object dense> 
                            <!--WHEN USER SELECT A DATA-->
                            <template v-slot:selection="{item}">
                                <v-sheet class="d-flex"> 
                                    <v-icon class="hidden-sm-and-down" small left>fas fa-user-md</v-icon>
                                    <span class="grey--text text--darken-3 text-subtitle-2 text-md-subtitle-1">{{item.doctor_name}} / {{item.specialization}}</span>
                                </v-sheet>
                            </template>

                            <!--AUTO COMPLETE DISPLAYS-->
                            <template v-slot:item="{ item }">
                                    <v-list-item-avatar color="indigo white--text">{{ item.doctor_name.charAt(0)}}</v-list-item-avatar>
                                    <v-list-item-content style="width: 320px;">
                                        <v-list-item-title>{{ item.doctor_name }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ item.specialization }}</v-list-item-subtitle>
                                        <v-list-item-subtitle>{{ item.provider_reg_type + ' - ' + item.provider_name }}</v-list-item-subtitle>
                                    </v-list-item-content> 
                            </template>
                        </v-autocomplete>
                        <h4 class="text-body-2 font-italic my-4"> Please select a doctor for this transaction. </h4>
                        <v-card-actions class="d-flex justify-end"> 
                            <v-btn @click="cancelSelectedDoctor"> Cancel </v-btn>
                            <v-btn @click="saveChosenDoctor" :disabled="!current_doctor || (!current_doctor.doctor_tin && !current_doctor.doctor_code)" color="primary"> Confirm </v-btn>
                        </v-card-actions>
                    </v-sheet>
                </v-card>
            </v-dialog>

            <!-- <v-overlay v-if="disabled_discharged_btn" :value="disabled_discharged_btn" z-index="9999"> 
                <v-progress-circular indeterminate size="35"></v-progress-circular>
                <span class="ml-3 text-h6 font-weight-regular" >Loading... Please Wait...</span>
            </v-overlay> -->

            <Alert :alert="alert" @updatePatientInfo="updatePatientInfo" @leavePage="leavePage" @redirect="redirect" @logoutUser="logoutUser" ref="alert_logout"/>
        </div>
    </div>
</template>

<script>
import { blood_type_list } from '@/reference/additional-info-libraries.json'
import purpose_of_visit_items from '@/reference/purpose-of-visit.json'
import management_items from '@/reference/management-items.json'
import Alert from '@/components/Alert.vue'
import jsPDF from 'jspdf'
import MedicalHistory from '@/components/emr/MedicalHistory'

import ObGyneHistory from '@/components/emr/ob-gyne/Main.vue'
import VaccinationRecord from '@/components/emr/VaccinationRecord'
import CovidVaccination from '@/components/emr/CovidVaccination'
import MedicalRecords from '@/components/emr/MedicalRecords'
import PhysicalExamination from '@/components/emr/PhysicalExamination.vue'
import DiagnosticExamResult from '@/components/emr/diagnostic-exam-result/Main.vue'
import Ncdqans from '@/components/emr/Ncdqans'
import PhysicianDiagnosis from '@/components/emr/PhysicianDiagnosis'

import DoctorReferralForm from "@/components/emr/printable-form/referral-form/Main.vue"
import PhilPen from '@/components/emr/PhilPen'
import TBDots from '@/components/emr/printable-form/TBDots'
import MedicalCertificate from '@/components/emr/printable-form/medical-certificate/Main.vue'
import ClinicalAbstract from '@/components/emr/ClinicalAbstract.vue'
import TreatmentPlan from '@/components/emr/printable-form/treatment-plan/Main.vue'
import FollowUpForm from '@/components/emr/printable-form/FollowUp.vue'
import PatientInformation from '@/components/emr/PatientInformation.vue'
import NavigationDrawer from '@/components/NavigationDrawer'
import DisabilityCertificate from '@/components/emr/printable-form/DisabilityCertificate.vue'
import GenderVerification from '@/components/emr/printable-form/GenderVerification.vue'

export default {
    components: {
        Alert,
        MedicalHistory,
        ObGyneHistory,
        VaccinationRecord,
        CovidVaccination,
        MedicalRecords,
        DoctorReferralForm,
        PhilPen,
        TBDots,
        MedicalCertificate,
        ClinicalAbstract,
        TreatmentPlan,
        FollowUpForm,
        PhysicalExamination,
        PatientInformation,
        DiagnosticExamResult,
        Ncdqans,
        NavigationDrawer,
        PhysicianDiagnosis,
        DisabilityCertificate,
        GenderVerification
    },

    data(){
        return{
            med_hist_active: false,
            phy_active: true,
            imm_active: false,
            ob_active: false,
            med_rec_active: false,
            diagnostic_active: false,
            physician_active: false,
            ncdqans_active: false,

            page_option: {
                threshold: .5
            },

            doctors_dialog_list: false,
            doctor_loader: false,
            doctor_items: [],
            process_type: sessionStorage.getItem("GF45S") ? this.$crypto.AES.decrypt(sessionStorage.getItem("GF45S"), "fgGds32s").toString(this.$crypto.enc.Utf8): null,

            other_management: {
                dialog: false,
                new: ''
            },

            //SET FAVORTIES FOR PRIMARY DIAGNOSIS AND PROCEDURE
            search_favorites: '',
            switch_favorite: false,
            switch_add_package_procedure: false,
            favorite_items: [],
            favorites_loading: false,
            selected_icd_favorites: [],
            selected_cpt_favorites: '',
            selected_package_procedure: [],
            selected_cpt_for_new_package: '',
            selected_new_package_procedure: [],
            new_package_name: '',


            // DATA
            emr_params: sessionStorage.getItem('PIX235') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PIX235'), 'EMX246').toString(this.$crypto.enc.Utf8)) : null,
            loading_data: true,
            tb_dots_loading_data: false,
            visit_loading_data:false,
            patient_info: sessionStorage.getItem('00klfs7Dt8Ygj') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('00klfs7Dt8Ygj'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true
            },

            ekas_result: [],
            epress_medicine: {},
            latest_transaction_number: '',
     
            pex_data: {
                bp_systolic: '',
                bp_diastolic: '',
                bp_2nd_systolic: '',
                bp_2nd_diastolic: '',
                heart_rate: '',
                respiration_rate: '',
                o2sat: '',
                temp: '',
                height: '',
                weight: '',
                central_adiposity: '',
                waist_circumference: '',
                bmi_computation: {
                    bmi: '',
                    remarks: ''
                },
                // heent: [],
                general_survey: [],
                general_survey_notes: '',
                assessment: {
                    chest: { assessment: [], others_notes: '' },
                    cvs: { assessment: [], others_notes: '' },
                    abdomen: { assessment: [], others_notes: '' },
                    gui: { assessment: [], others_notes: '' },
                    pelvic: { assessment: [], others_notes: '' },
                    rectal: { assessment: [], others_notes: '' },
                    musculoskeletal: { assessment: [], others_notes: '' },
                    skin: { assessment: [], others_notes: '' },
                    neuro: { assessment: [], others_notes: '' },
                    heent: { assessment: [], others_notes: '' },
                },
                left_vision: '',
                right_vision: ''
            },
            
            plan_data: sessionStorage.getItem('uhosg2') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('uhosg2'), 'EMX247').toString(this.$crypto.enc.Utf8)) :  {
                fresh_load: true
            },

            blood_type_list,

            // PHYSICIAN DIAGNOSIS
            selected_icd_filter: [],
            date_admitted: '',
            date_discharged: '',
            visit_data: {
                fresh_load: true,
                purpose_of_visit: ''
            },
            chief_complaint: '',
            history_current_illness: '',
            doctor_data: {
                first_name: '',
                middle_name: '',
                last_name: '',
                suffix: '',
                specialization: '',
                doc_prc_license: '',
                doctor_position: ''
            },
            current_doctor: '',

            treatment_recommendation: '',
            treatment_submit_attempted: false,

            selected_icd: [
                {
                    icd_code: '',
                    icd_description: '',
                    icd_code_description: '',
                    icd_group_code: '',
                    ph_category: '',
                    // p_case_rate_code: '',
                    icd_category: {
                        loading: false,
                        list: [],
                        selected: {
                            category_description_id: '',
                            category_description: ''
                        }
                    },
                    procedures: []
                }
            ],
            current_icd: '',
            selected_cpt: [],
            selected_cpt_filter: [],
            selected_cpt_holder: {},
            doctor_notes: '',
            acknowledgement_referral_code: '',

            // DIETARY
            diet_status: false,
            dietary_information: {
                fresh_load: true,
                data: {
                    high_fat_salt_intake: '',
                    fiber_intake_fruit: '',
                    fiber_intake_vegetable: '',
                    physical_activity: ''
                }
            },

            // CLOSE CONTACT
            close_contact_status: false,
            close_contact_tb: {
                fresh_load: true,
                value: ''
            },

            // MEDICINE
            loading_medicine: true,
            medicine_list: sessionStorage.getItem('kgIGs35') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('kgIGs35'), 'EMX246').toString(this.$crypto.enc.Utf8)) : [],
            selected_medicine: [],
            selected_medicine_filter: [],
            selected_medicine_holder: {},
            
            // STATUS
            pat_status: false,
            medh_status: false,
            obgy_status: false,
            vac_status: false,
            cov_status: false,
            pex_status: false,
            plan_status: false,
            phy_status: false,

            // REFERENCE DATA
            ethnic_items: ['Agutaynen', 'Ayangan', 'Badjao', 'Batak', 'Bicolano', 'Chavacanos', 'Cuyonin', 'Eskaya', 'Ibanag', 'Igorot', 'Ilocano', 'Ilongots', 'Iranon', 'Ivatan', 'Kagayanen', 'Kapampangan', 'Lumad', 'Maguindanaon', 'Mandaya', 'Mangyan', 'Manobo', 'Maranao', 'Molbog', 'Negrito', 'Palawan', 'Pangasinense', "Sama'ah", 'Sambal', 'Subanon', "Taaw't Bato", 'Tagalog', 'Tagbanwa', 'Tausug', 'Tumandok', 'Tuwali', 'Visayan'],
            purpose_of_visit_items: purpose_of_visit_items.purpose_of_visit_items,

            // VACCINATION RECORD
            loading_vaccinator: true,
            loading_vaccination: true,
            vaccinator_items: sessionStorage.getItem('lVIds01') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('lVIds01'), 'EMX246').toString(this.$crypto.enc.Utf8))  : [],
            // EMPTY FIELDS
            pti_empty_fields: false,
            obgy_has_empty: false,
            vac_has_empty: false,
            cov_empty_fields: false,
            bp_empty_fields: false,
            bp_2nd_empty_fields: false,
            phy_empty_fields: false,
            med_empty_fields: false,
            chief_empty_fields: false,
            chief_history_empty: false,

            // OTHERS
            loading_provider: true,
            provider_items: [],
            loading_specialization: true,
            specialization_items: [],

            // REFERRAL DATA
            referral_empty_fields: false,
            referral_status: false,
            referral_data: {},
            display_doctor_referral: false,

            // SIGNS AND SYMPTOMS
            signs_and_symptoms: {
                data: []
            },
            covid_status: true,
            save_print_dialog: false,
            for_print: '',
            tab: null,
            panel: [],
            medical_history: {
                past_medical_history: [],
                family_medical_history: [],
                patient_social_history: []
            },

            //NCDQANS
            ncdqans: sessionStorage.getItem('EMX300') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('EMX300'), 'mjh823hss').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true,
                Qid5_Ynx: "",
                Qid6_Yn: "",
                Qid7_Yn: "",
                Qid8_Yn: "",
                Qid9_Yn: "",
                Qid10_Yn: "",
                Qid11_Yn: "",
                Qid12_Yn: "",
                Qid13_Yn: "",
                Qid14_Yn: "",
                Qid15_Yn: "",
                Qid16_Yn: "",
                Qid17_Abcde: "",
                Qid18_Yn: "",
                Qid19_Yn: "",
                Qid19_Fbsmg: "",
                Qid19_Fbsmmol: "",
                Qid19_Fbsdate: "",
                Qid20_Yn: "",
                Qid20_Choleval: "",
                Qid20_Choledate: "",
                Qid21_Yn: "",
                Qid21_Ketonval: "",
                Qid21_Ketondate: "",
                Qid22_Yn: "",
                Qid22_Proteinval: "",
                Qid22_Proteindate: "",
                Qid23_Yn: "",
                Qid24_Yn: "",
                date_created: this.$moment().format('MM-DD-YYYY'),
                date_updated: this.$moment().format('MM-DD-YYYY')
            },
            
            management_items: management_items.management_items,
            select_management: [],

            date_today: this.$moment().format('YYYY-MM-DD'),
            print_option: 'both',
            print_option_med: null,
            leave_approval: false,
            navbar: [],
            help_menu: [{ content: 'Patient List', pop_up: false }],
            jspdf: jsPDF,
            alert: {},
            other_med: {
                dialog: false,
                generic_name: '',
                others_drug_code: ''
            },
            select_other_med: '',

            eligible_data: sessionStorage.getItem("YETBS") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("YETBS"), "ygrGk2dX").toString(this.$crypto.enc.Utf8)) : {},

            physician_recommendation: [],
            select_physician_recommendation: ['Yes', 'No', 'Not Applicable'],
            patient_remarks: '',
            select_patient_remarks: ['Request', 'Refuse', 'Not Applicable'],

            admitting_diagnosis: '',

            navigation_drawer_item: [
                { name: 'PATIENT INFORMATION', path: '/emr-consultation/patient-information', icon: 'mdi-account' },
                { name: 'MEDICAL HISTORY', path: '/emr-consultation/medical-history', icon: 'mdi-clipboard-text-clock' },
                { name: 'PHYSICIAN DIAGNOSIS', path: '/emr-consultation/physician-diagnosis-and-treatment-plan', icon: 'mdi-doctor' },
                { name: 'PHYSICAL EXAMINATION', path: '/emr-consultation/physical-examination', icon: 'mdi-human-male-height' },
                { name: 'IMMUNIZATION RECORDS', path: '/emr-consultation/immunization-records', icon: 'mdi-needle' },
                { name: 'OB-GYN HISTORY', path: '/emr-consultation/obgyne-history', icon: 'mdi-mother-nurse' },
                { name: 'MEDICAL RECORDS', path: '/emr-consultation/medical-records', icon: 'mdi-book-cross' },
                { name: 'DIAGNOSTIC EXAM RESULT', path: '/emr-consultation/diagnostic-exam-result', icon: 'mdi-clipboard-list-outline' },
                { name: 'NCD QUESTIONNAIRE', path: '/emr-consultation/ncdqans', icon: 'mdi-clipboard-pulse' },
            ],
            
            //CPT MODIFIER
            select_cpt_modifier: [],
            loading_modifier : true,
            disabled_discharged_btn: true,

            physician_diagnosis: sessionStorage.getItem('7nVooi3FUfd') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('7nVooi3FUfd'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true
            },

            diagnostic_exam_result: [],

            //DIAGNOSIS/PROCEDURE PAGINATION
            icd_current_page: 1,
            icd_next_page: 0,
            cpt_next_page: 0,
            cpt_current_page: 1,
            search_icd_items: '',
            search_cpt_items: '',
            time_out: null,

            patient_info_load: false,
            for_saving: false,
            social_history_empty_field: false,
            loading_ncdqans: true,
            package_name: null,
            add_covid_vac: [],
            eclaims_eligible: false,

            request_data_payload: sessionStorage.getItem('rqnn52ds') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('rqnn52ds'), 'OKM2HN').toString(this.$crypto.enc.Utf8)) : null
        }
    },

    created() {
        this.navbar = [
            ...(this.emr_params.from_component === 'p_queue_list' ? [{ title: 'Back to Patient Queue List', icon: 'fas fa-arrow-left', link: 'patient-queue-list'}] : this.emr_params.from_component === 't_queue_list' ? [{ title: 'Back to Tele Consult Queue List', icon: 'fas fa-arrow-left', link: 'teleconsult-patients-list'}] : [{ title: 'Back to Transaction Records List', icon: 'fas fa-arrow-left', link: 'patient-transaction-record'}])            
        ]
    },

    watch: {
        'med_hist_active'(value){
            if(value && this.$route.path === '/emr-consultation'){
                if(this.emr_params.editable){
                    this.getDrugsMedicine();
                } else {
                    this.loading_medicine = false
                }

                
            }
        },

        'physician_active'(value){
            if(value && this.$route.path === '/emr-consultation'){
                this.getPhysicianWebServices()
            }
        },

        'imm_active'(value){
            if(value && this.$route.path === '/emr-consultation'){
                this.getVaccinatorList()
            }
        },

        'ncdqans_active'(value){
            if(value && this.$route.path === '/emr-consultation'){
                this.getNcdqans();
            }
        },

        '$route':{
            handler(to){
                if (to.params.page !== 'patient-information' && to.params.page !== 'medical-history' && to.params.page !== 'obgyne-history' && to.params.page !== 'physical-examination' && to.params.page !== 'physician-diagnosis-and-treatment-plan' && to.params.page !== 'medical-records' && to.params.page !== 'immunization-records' && to.params.page !== 'diagnostic-exam-result' && to.params.page !== 'ncdqans' && to.path !== '/emr-consultation') {
                    this.$router.push('/*')
                } else {
                    if(to.params.page === 'obgyne-history'){
                        this.ob_active = true
                    }
                    
                    if(to.params.page === 'immunization-records'){
                        this.imm_active = true
                        this.getVaccinatorList()
                    }

                    if(to.params.page === 'physician-diagnosis-and-treatment-plan' || to.params.page === 'medical-history'){
                        if(this.emr_params.editable){
                            this.getDrugsMedicine();
                        } else {
                            this.loading_medicine = false
                        }
                    }

                    if(to.params.page === 'physician-diagnosis-and-treatment-plan'){
                        this.getPhysicianWebServices()
                    }

                    if(to.params.page === 'ncdqans'){
                        if(this.ncdqans.fresh_load){
                            this.getNcdqans();
                        }
                    }

                    window.scrollTo(0, 0);
                }
            },
            immediate: true
        }
    },

    mounted() {
        this.getPatientInfo();  
        // this.getDiagnosticExamResultList();
        //this.getVaccinatorList();
        this.getPhysicianDiagnosis()
        //this.getCloseContactTB();

        //CALL THE CONTROLLER AGAIN IF THE REQUEST IF INTERUPTED
        // if(this.request_data_payload){
        //     let function_name = this.request_data_payload.function_name
            
        //     this[function_name]()
            
        //     this.disabled_discharged_btn = true

        //     if(function_name === 'updateDietaryInformation') this.sas_status = true
        //     if(function_name === 'updateCloseContactTB') this.close_contact_status = true
        //     if(function_name === 'updatePlanData') this.plan_status = true
        //     if(function_name === 'updateNcdqans') this.ncdq_status = true
        //     if(function_name === 'updateReferralData') this.referral_status = true
        //     if(function_name === 'updatePhysicalExamination') this.pex_status = true
        //     if(function_name === 'updatePatientInfo') this.pat_status = true
        // } else {
        //     this.disabled_discharged_btn = false
        // }
    },
    
    computed: {
        page_min_height(){
            if(this.$route.path === '/emr-consultation'){
                return '200'
            } else {
                return '0'
            }
        },

        // FILTER ICD LIST
        icd_items(){
            const icd_list = this.$store.state.icd_list.filter(item => {
                return !this.selected_icd_filter.includes(item.icd_code)
            })

            // REMOVE THE ITEMS RELACTED TO THE SELECTED ICD CODES BASED ON THE FIRST PART OF THE CODE (BEFORE THE DOT)
            const selected_base_codes = new Set(
                this.selected_icd.map(({ icd_code }) => icd_code.split(".")[0])
            );

            const new_filtered_icd_list = icd_list.filter(({ icd_code }) => {
                const base_code = icd_code.split(".")[0];
                return !selected_base_codes.has(base_code);
            });

            return new_filtered_icd_list
        },

        // FILTER MEDICINE LIST
        medicine_items(){
            const medicine_list = this.medicine_list.filter(item => {
                return !this.selected_medicine_filter.includes(item.generic_name_text)
            })

            return medicine_list
        },

        cpt_items() {
            const selected_cpt_codes = this.selected_icd.flatMap(icd => icd.procedures.map(proc => proc.cpt_code));
            return this.$store.state.cpt_list.filter(item => !selected_cpt_codes.includes(item.cpt_code));
        },
        
        // CHECK IF THERES A PROCEDURE
        without_procedures(){
            let without_procedures = true
            
            if(this.selected_icd.length > 0){
                this.selected_icd.forEach(icd => {
                    if(icd.procedures.length > 0){
                        without_procedures = false
                    }
                })

                return without_procedures
            }else{
                return without_procedures
            }
        },

        // TREATMENT RECOMMENDATION ERROR
        treatment_recommendation_error(){
        if(this.treatment_submit_attempted && !this.treatment_recommendation){
            return true
        }
            return false
        },
        // treatment_recommendation_error(){
        //     if(this.phy_empty_fields && !this.treatment_recommendation){
        //         let count = this.selected_icd.filter(item => item.procedures.length < 0)
            
        //         if(count.length < 0){
        //             return true
        //         }else{
        //             return false
        //         }
        //     }else{
        //         return false
        //     }
        // },

        //CHIEF COMPLAINT ERROR
        chief_complaint_error() {
            if (this.chief_empty_fields && !this.chief_complaint) {
                return true
            }

            return false
        },

        chief_history_error() {
            if(this.eligible_data?.eclaims_eligible){
                if(this.chief_history_empty && (!this.history_current_illness || !this.chief_complaint)){
                    return true
                }
            }

            return false
        },

        remarks_patient() {
            if(this.patient_remarks === 'Request'){
                return 'RQ'
            } else if(this.patient_remarks === 'Refuse') {
                return 'RF'
            } else {
                return 'XX'
            }
        },

        medical_history_required() {
            if (this.eligible_data?.konsulta_eligible) {
                if (this.required_fields && !this.social_history_empty_field) {
                    return true;
                }
            }

            return false;
        },

        med_required_error() {
            if (this.med_empty_fields && !this.selected_medicine.some(item => item.total_num_of_med > 0 || 
                (item.medicine_code === 'OTC-0000' && !item.other_drug_code))) {
                return true; 
            }
            return false; 
        },
        
        is_item_disabled() {
            // CHECK IF NOT APPLICABLE IS SELECTED
            let is_not_applicable_selected = this.select_management.some(el => el.lib_id === "0");
            
            // IF NOT APPLICABLE IS SELECTED, DISABLE ALL OTHER OPTIONS
            return (item) => {
                //DISABLE ALL EXCEPT NOT APPLICABLE
                return is_not_applicable_selected && item.lib_id !== "0";  
            };
        }
    },

    methods: {
        getPhysicianWebServices(){
            if (this.emr_params.editable && this.$store.state.icd_list.length === 0) {
                this.getICDList();
                this.getCPTList()
            } else {
                this.$store.commit('set_loading_icd', false)
                this.$store.commit('set_loading_cpt', false)
            }

            this.getPurposeOfVisit();
        },

        selectedMedicineHolder() {
            this.selected_medicine_holder = {}
        },

        //SWITCH FOR SET FAVORITES
        setFavorites(event) {
            this.switch_favorite = event
            if(!this.switch_favorite) {
                this.favorite_items = []
                this.selected_cpt_holder = {}
            }
        },

        //TIRRGER THE BUTTON TO REMOVED A FAVORITES DIAGNOSIS/PROCEDURE
        unFavoritesDiagnosis(request_key) {
            let fav_diagnosis = request_key === 'icd'? this.selected_icd_favorites.map(el => { return  el.icd_code  }) : this.selected_cpt_favorites.map(el => { return  el.cpt_code  })
            let is_favorite = '0'
    
            this.saveFavorites(request_key, fav_diagnosis, is_favorite)
            
        },

        //TIRRGER THE BUTTON TO ADD A FAVORITES DIAGNOSIS/PROCEDURE
        addToFavorites(request_key) {
            let fav_diagnosis = request_key === 'icd'? this.selected_icd_favorites.map(el => { return  el.icd_code  }) : this.selected_cpt_favorites.map(el => { return  el.cpt_code  })
            let is_favorite = '1'
    
            this.saveFavorites(request_key, fav_diagnosis, is_favorite)
        },


        //SAVE ICD AND CPT FAVORITES OF THE DOCTOR
        async saveFavorites(request_key, diagnosis, is_favorite) {
            if(request_key === 'icd') {
                this.selected_icd_favorites = []
            } else {
                this.selected_cpt_favorites = []
            }

            this.switch_favorite = false
            this.favorites_loading = true

            let response = await this.$services.trnAddDelIcdCptFavorites({
                request_key: request_key,
                is_favorite : is_favorite,
                code: diagnosis,
                doctor_tin_no: this.$store.state.usr_credentials.doctor_tin,
                hmo_doctor_code: this.$store.state.usr_credentials.doctor_code
            });

            if(response.status === 200) {
               if(response.data.success) {
                    this.favorites_loading = false
                    if(is_favorite === '1') {
                        this.$store.dispatch('getFavoriteDiagnosis', {title: request_key, diagnosis: diagnosis})
                    } else {
                        this.$store.dispatch('getUnFavoriteDiagnosis', {title: request_key, diagnosis: diagnosis})
                    }
                }
            } else {
                this.alert = response.error;
            }
        },
        
        //SWITCH FOR SET PACKAGE PROCEDURE
        setPackageProcedure(event) {
            this.switch_add_package_procedure = event
            if(!this.switch_add_package_procedure) {
                this.selected_cpt_holder = {}
                this.new_package_name = '';
                this.selected_new_package_procedure = [];
            }
        },

        //TRIGGER THE BUTTON TO ADD PACKAGE PROCEDURE
        addPackageProcedures(package_procedure_details, index, package_name) {
            this.package_name = package_name
            this.selected_package_procedure = package_procedure_details;
            this.selected_icd[index].procedures = [];

            // Check if the CPT code is already in the procedures list of the same index or any other index
            this.selected_package_procedure.forEach(package_procedure => {
            const is_duplicate_cpt = this.selected_icd.some((icd, icd_index) => {
                // Filtering in the same index Primary Diagnosis
                if (icd_index === index) {
                    return icd.procedures.some(proc => proc.cpt_code === package_procedure.cpt_code);
                }
                // (For future use if adding of package will be allowed in secondary and other diagnosis)
                if (icd_index !== index) {
                    return icd.procedures.some(proc => proc.cpt_code === package_procedure.cpt_code);
                }
                return false;
            });

            if (is_duplicate_cpt) {
                return;
            }

            let data = {
                physician_recommendation: 'Yes',
                patient_remarks: 'Not Applicable',
                show_long_desc: false,
                modifier: {
                    mod_code: '',
                    mod_description: ''
                },
                ...package_procedure  
            };

                this.selected_icd[index].procedures.push(data);
               // this.selected_cpt_filter.push(package_procedure.cpt_code);
            });

            this.mutationStatus('phy');
            this.getCPTModifier();
        },
        
        //TRIGGER THE BUTTON TO ADD AND UPDATE PACKAGE PROCEDURE
        addNewPackageProcedures(package_procedure_details, new_package_name) {
            this.new_package_name = new_package_name;
            this.selected_new_package_procedure = package_procedure_details;
            this.mutationStatus('phy');
            this.saveNewPackageOfProcedure(this.selected_new_package_procedure, this.new_package_name );
            
        }, 
        
        //SAVE NEW PACKAGE OF PROCEDURE
        async saveNewPackageOfProcedure(new_package, new_package_name) {
            this.selected_new_package_procedure = []
            const cpt_codes = new_package.map(item => item.cpt_code);
            const status = 1;
           
            let response = await this.$services.trnAddUpdateCptPackages({
                provider_code: this.$store.state.prv_data.provider_code,
                package_name: new_package_name, 
                status: status,
                process_by: this.$store.state.usr_credentials.user_name,
                cpt_code: cpt_codes,
            });

            if(response.status === 200) {
                this.switch_add_package_procedure = false
            } else {
                this.alert = response.error;
            }
        },

        //FILTER PHYSICIAN RECOMMENDATION
        filter_physician_recommend(data) {
            if(data === 'Y') {
                return 'Yes'
            } else if (data === 'N') {
                return 'No'
            } else {
                return 'Not Applicable'
            }
        },

        filter_patient_remarks(data) {
            if(data === 'RQ') {
                return 'Request'
            } else if (data === 'RF') {
                return 'Refuse'
            } else {
                return 'Not Applicable'
            }
        },

        viewPrintableForm(data) {
            if(data === 'philpen') {
                this.$refs.philpen.displayPhilpen(true)
            } else {
                this.for_print = data
                this.save_print_dialog = true
            } 
        },

        //LOGOUT USERS
        logout() {
            this.alert = { 
                display: true, 
                type:  'standard', 
                width: '450', 
                icon:  'mdi-help-circle', 
                color: 'blue darken-1', 
                title: 'This will logout your account', 
                body:  'Do you want to continue ?', 
                btn_pry_txt: 'Yes', 
                btn_pry_color:'primary',
                btn_pry_otl: false,
                btn_pry_act: 'loadingBtn',  
                btn_pry_emt: 'logoutUser',
                btn_sec_txt: 'No', 
                btn_sec_color: 'secondary', 
                btn_sec_otl: true, 
                btn_sec_act: 'closeAlert',
            }
        },

        logoutUser() {
            this.$refs.alert_logout.logoutUser()
        },

        // IF "NOT APPLICABLE" IS SELECTED, CLEAR ALL OTHER OPTIONS EXCEPT "NOT APPLICABLE"
        selectedManagement(data, value) {
            let is_not_applicable_selected = data.some(el => el.lib_id === "0");
            if (is_not_applicable_selected) {
                this.select_management = data.filter(el => el.lib_id === "0");
            } else {
                data.map(el => {
                    if (el.lib_id === "X") {
                        this.other_management.dialog = true;
                    }
                });
                this.select_management = data;
            }

            this.$emit('selectedManagement', this.select_management, value);
            this.mutationStatus('phy', this.select_management, value);
        },

        saveOthersManagement() {
            this.select_management.forEach(data => {
                if(data.lib_id === 'X') {
                    this.select_management.push({
                        lib_id: data.lib_id,
                        management_description: `OTHERS: ${this.other_management.new}`
                    })
                } 
            })

            this.select_management.splice(this.select_management.findIndex(element => element.management_description === 'OTHERS'), 1)
            this.mutationStatus('phy', this.select_management, 'mng')
            this.other_management.dialog = false
            this.other_management.new = ''
        },

        // GET PATIENT INFORMATION
        async getPatientInfo() {
            if (this.patient_info.fresh_load) {
                this.loading_data = true
                let response = await this.$services.getMemberEligibilityLGU({
                    ek_lgu_id: this.emr_params.ek_lgu_id,
                    lgu_host_code: this.emr_params.lgu_host_code
                });

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
                    this.loading_data = false

                    if(response.data.LGU_DATA === 'No Data Found'){
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Member Data not found', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }else{
                        this.patient_info = response.data.LGU_DATA
 
                        this.patient_info.mem_civil_status_disabled = this.patient_info.mem_civil_status ? true : false
                        this.patient_info.mem_religion_disabled = this.patient_info.mem_religion ? true : false
                        this.patient_info.mem_home_bldgno_disabled = this.patient_info.mem_home_bldgno ? true : false
                        this.patient_info.mem_home_bgy_disabled = this.patient_info.mem_home_bgy ? true : false
                        this.patient_info.mem_home_city_municipality_disabled = this.patient_info.mem_home_city_municipality ? true : false
                        this.patient_info.mem_home_province_disabled = this.patient_info.mem_home_province ? true : false
                        this.patient_info.mem_home_zip_disabled = this.patient_info.mem_home_zip ? true : false
                        this.patient_info.mem_birthplace_disabled = this.patient_info.mem_birthplace ? true : false
                        this.patient_info.mem_occupation_disabled = this.patient_info.mem_occupation ? true : false
                        this.patient_info.ethnic_group_disabled = this.patient_info.ethnic_group ? true : false
                        this.patient_info.guardian_disabled = this.patient_info.guardian ? true : false
                        this.patient_info.mem_mobile_number_disabled = this.patient_info.mem_mobile_number ? true : false
                        this.patient_info.mem_landline_number_disabled = this.patient_info.mem_landline_number ? true : false
                        this.patient_info.mem_blood_type_disabled = this.patient_info.blood_type ? true : false
                        this.patient_info.mem_gender = this.patient_info.mem_gender ? (this.patient_info.mem_gender.charAt(0) === 'M' ? 'Male' : 'Female') : 'N/A'
                        this.patient_info.mem_age = this.calculateAge(this.patient_info.mem_birthdate)
                        this.patient_info.fresh_load = false
                        sessionStorage.setItem('00klfs7Dt8Ygj', this.$crypto.AES.encrypt(JSON.stringify(this.patient_info), 'EMX246'))
                        this.patient_info_load = false
                        this.getPhysicalExamination();
                        
                        if (this.$store.state.prv_config.ekonsulta_accre) {
                            await this.checkEkonsultaEligibility();
                        }
                        if (this.$store.state.prv_config.eclaims_accre) {
                            await this.getEclaimsWebService();
                        }
                    }
                } else {
                    this.alert = response.error;
                }
            } else {
                this.loading_data = false
                this.getPhysicalExamination();
            }
        },

        // getDiagnosticExamResultList(){
        async getDiagnosticExamResultList(){
            let response = await this.$services.getDiagnosticExamResultList({
                ek_lgu_id: this.emr_params.ek_lgu_id, 
                type: (this.$route.path === '/emr-consultation/diagnostic-exam-result' || this.$route.path === '/emr-consultation/patient-information') ? 'emr' : 'pre-consultation'
            });

            if (response.status === 200) {
                if(response.data.has_data === true){
                    let diagnostic_transaction = response.data.transactions.reduce((transaction_date_one, transaction_date_two) => (transaction_date_one.prescription_date > transaction_date_two.prescription_date ? transaction_date_one : transaction_date_two));
                    this.latest_transaction_number = diagnostic_transaction.transaction_number
                }
            } else {
                this.alert = response.error;
            }
        },

        getDiagnosticExam (e) {
            e.data.forEach(el => {
                if(el.libDesc === 'ELECTROCARDIOGRAM (ECG)' || el.libDesc === 'FECAL OCCULT BLOOD' || el.libDesc === 'PPD TEST (TUBERCULOSIS)') {
                    el.pFindings = el.pFinds.LibID
                } else if (el.libDesc === 'CHEST X-RAY') {
                    el.pFindings = el.pFinds.LibID
                    el.pObservation = el.pObs.LibID
                } else if (el.libDesc === 'SPUTUM MICROSCOPY') {
                    el.pFindings = el.pFinds.LibID
                    el.pDataCollection = el.pDC.LibID
                } else if (el.libDesc === 'FECALYSIS') {
                    el.pColor = el.pC.LibID
                    el.pConsistency = el.pCy.LibID
                    el.pBlood = el.pB.LibID
                }
            })
            
            this.diagnostic_exam_result = e
            this.mutationStatus('diag')
        },

        async saveEkonsulta() {
            let emr_value = 0
            if(this.selected_icd.filter(item => item.icd_code).length > 0) {
                emr_value = 1
            }
            
            // if (!this.pex_status) {
            //     await this.$refs.physical_examination.postData(this.pex_data);
            // }
            
            let payload_data = {
                ek_lgu_id: this.emr_params.ek_lgu_id,
                ekonsulta: this.eligible_data,
                diagnostic_exam_trans_no: this.emr_params.transaction_number,
                icd_cpt_data: this.selected_icd[0].procedures.length === 0 ? 0 : 1,
                is_emr: emr_value,
                created_by: this.$store.state.usr_credentials.user_name
            }

            payload_data = this.request_data_payload ? this.request_data_payload.request_payload : payload_data

            return this.$services.trnAddEkonsulta(payload_data, 'saveEkonsulta')
            .then(() => {
                // if(this.eligible_data.konsulta_eligible && !this.for_saving) {
                //     this.$refs.physical_examination.postData()
                // }
                this.$store.commit('set_transaction_flag', 1)
            })
            .catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },

        //CHECK FOR EKONSULTA ELIGIBILITY
        async checkEkonsultaEligibility() {
            this.mem_btn_loader = true
            return this.$services.getEkonsultaEligibilityChecker({
                pPatientFname: this.patient_info.mem_first_name,
                pPatientMname: this.patient_info.mem_middle_name,
                pPatientLname: this.patient_info.mem_last_name,
                pPatientExtname: this.patient_info.mem_suffix,
                pPatientDob: this.patient_info.mem_birthdate,
                pPhicPin: this.patient_info.mem_phic_pin,
                pPatientType: this.patient_info.member_registration_type === 'PRINCIPAL' ? 'MM' : 'DD',
                pHciAccreNo: this.$store.state.prv_data.ekonsulta_phic_acc_no,
                phic_token : this.$store.state.prv_data.phic_token
            })
            .then((response) => {
                response.data = this.responseDataDecryption(response.data)

                if(response.status === 200){
                    this.eligible_data = response.data
                    sessionStorage.setItem("YETBS",this.$crypto.AES.encrypt(JSON.stringify(this.eligible_data),"ygrGk2dX")); // EKONSULTA INFORMATION
                } else {
                    this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'red', title: 'Philhealth Yakap Eligibility', body: 'Connection to the PhilHealth server failed. The system cannot verify member eligibility at this time.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                }
            }).catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            });
        },

        async getEclaimsWebService() {
            return this.$services.getEclaimsWebService({
                // provider_code: "EKDF21B239E8232403",
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: "ICEM",
                data: {
                    ek_lgu_id: this.emr_params.ek_lgu_id,
                    member_pin: this.patient_info.mem_phic_pin,
                    transaction_number: this.emr_params.transaction_number
                }
            })
            .then((response) => {
                response.data = this.responseDataDecryption(response.data)
                this.eligible_data = {
                    ...this.eligible_data,
                    eclaims_eligible: response.data.eclaims_eligible
                }
                sessionStorage.setItem("YETBS",this.$crypto.AES.encrypt(JSON.stringify(this.eligible_data),"ygrGk2dX")); // EKONSULTA INFORMATION
            }).catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            });
        },

        async getPhysicalExamination() {
            const data = this.$refs.physical_examination;

            this.pex_data = {
                bp_systolic: data.bp_systolic,
                bp_diastolic: data.bp_diastolic,
                bp_2nd_systolic: data.bp_2nd_systolic,
                bp_2nd_diastolic: data.bp_2nd_diastolic,
                blood_pressure:  data.blood_pressure,
                blood_pressure_2nd: data.blood_pressure_2nd,
                heart_rate: data.heart_rate,
                respiration_rate: data.respiration_rate,
                temp: data.temp,
                o2sat: data.o2sat,
                height: data.height,
                weight: data.weight,
                central_adiposity: data.central_adiposity,
                waist_circumference: data.waist_circumference,
                bmi_computation: data.bmi_computation,
                general_survey: data.general_survey,
                general_survey_notes: data.other_general_survey,
                // heent: data.heent,
                // other_heent: data.other_heent,
                assessment: data.assessment,
                left_one: data.left_one,
                left_two: data.left_two,
                left_vision: data.left_vision,
                right_one: data.right_one,
                right_two: data.right_two,
                right_vision: data.right_vision
            };

            if (this.plan_data.fresh_load) {
                this.plan_data = {
                    diet: data.plan_data ? data.plan_data.diet : null,
                    fluid_intake: data.plan_data ? data.plan_data.fluid_intake : null,
                    follow_up_consultation_date: data.plan_data ? data.plan_data.follow_up_consultation_date : null,
                    guardian: data.plan_data ? data.plan_data.guardian : null,
                    medical_certificate: "0",
                    referral: data.plan_data ? data.plan_data.referral : null,
                }
                sessionStorage.setItem('uhosg2', this.$crypto.AES.encrypt(JSON.stringify(this.plan_data), 'EMX247'));
            } else {
                this.plan_data.fresh_load = false;
            }
        },

        // GET DIETARY INTAKE
        async getDietaryIntake() {
            let dietary_information = sessionStorage.getItem('kgfl8dhgv') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('kgfl8dhgv'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true,
                data: {
                    high_fat_salt_intake: '',
                    fiber_intake_fruit: '',
                    fiber_intake_vegetable: '',
                    physical_activity: ''
                }
            }

            if (dietary_information.fresh_load) {
                let response = await this.$services.getPatientRecordAndTransaction({
                    request_key: 'dietary_intake',
                    transaction_number: this.emr_params.transaction_number
                });

                if (response.status === 200) {
                    //this.loading_data = false
                    response.data = this.responseDataDecryption(response.data)
                    this.dietary_information.data.high_fat_salt_intake = response.data.high_fat_salt_intake;
                    this.dietary_information.data.fiber_intake_fruit = response.data.fiber_intake_fruit;
                    this.dietary_information.data.fiber_intake_vegetable = response.data.fiber_intake_vegetable;
                    this.dietary_information.data.physical_activity = response.data.physical_activity;
                    this.dietary_information.fresh_load = false;

                    sessionStorage.setItem('kgfl8dhgv', this.$crypto.AES.encrypt(JSON.stringify(this.dietary_information), 'EMX246'));
                } 
            } else {
                this.dietary_information = dietary_information;
            }
        },

        async getNcdqans() {
            // let ncd_qans = sessionStorage.getItem('yqj3bssw') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('yqj3bssw'), 'EMX247').toString(this.$crypto.enc.Utf8)) : {
            //     fresh_load: true
            // };

            if (this.ncdqans.fresh_load) {
                let response = await this.$services.getPatientRecordAndTransaction({
                    request_key: 'ncdq',
                    ek_lgu_id: this.patient_info.ek_lgu_id
                });


                if (response.status === 200) {
                    this.loading_ncdqans = false
                    response.data = this.responseDataDecryption(response.data)

                    Object.keys(response.data).forEach(data => {
                        this.ncdqans[data] = response.data[data]
                    
                    })
                    this.ncdqans.fresh_load = false
                    sessionStorage.setItem('mjh823hss', this.$crypto.AES.encrypt(JSON.stringify(this.ncdqans), 'EMX300'))
                    this.getDietaryIntake();
                    this.getSignsAndSymptoms();
                } else {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                }
            } else {
                this.loading_ncdqans = false
                this.ncdqans = {...this.ncdqans};
                this.getDietaryIntake();
            }
        },

        //GET SIGNS AND SYMPTOMS
        async getSignsAndSymptoms() {
            this.sign_and_symptoms = sessionStorage.getItem('l0cx832kd') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('l0cx832kd'), 'EMX246').toString(this.$crypto.enc.Utf8))  : []
            //this.getCloseContactTB()
        },

        // GET CLOSE CONTACT TB
        async getCloseContactTB() {
            this.$refs.tb_dots.show_dialog = true;
            this.tb_dots_loading_data = true

            let close_contact_tb = sessionStorage.getItem('0vc9423lg') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('0vc9423lg'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true
            }

            if (close_contact_tb.fresh_load) {
                let response = await this.$services.getPatientRecordAndTransaction({
                    request_key: 'close_contact_tb',
                    transaction_number: this.emr_params.transaction_number
                })

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)

                    if (response.data.has_data) {
                        this.close_contact_tb.value = response.data.classification
                    } else {
                        this.close_contact_tb.value = null
                    }

                    this.close_contact_tb.fresh_load = false

                    sessionStorage.setItem('0vc9423lg', this.$crypto.AES.encrypt(JSON.stringify(this.close_contact_tb), 'EMX246'))
                    this.tb_dots_loading_data = false
                    //this.getPurposeOfVisit();
                } else {
                    this.tb_dots_loading_data = false
                    this.alert = response.error
                }
            } else {
                this.tb_dots_loading_data = false
                this.close_contact_tb = close_contact_tb
                //this.getPurposeOfVisit();
            }
        },

        // GET PURPOSE OF VISIT
        async getPurposeOfVisit() {
            this.visit_loading_data = true
            let visit_data = sessionStorage.getItem('0g8sJ23sf') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('0g8sJ23sf'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true
            }

            if (visit_data.fresh_load) {
                let response = await this.$services.getPatientRecordAndTransaction({
                    request_key: 'visit',
                    transaction_number: this.emr_params.transaction_number
                })

                if (response.status === 200) {
                    this.visit_loading_data = false
                    response.data = this.responseDataDecryption(response.data)
                    this.visit_data.purpose_of_visit = response.data.purpose_of_visit_service_availed
                    this.visit_data.fresh_load = false
                    sessionStorage.setItem('0g8sJ23sf', this.$crypto.AES.encrypt(JSON.stringify(this.visit_data), 'EMX246'))
                    //this.getPhysicianDiagnosis();
                } else {
                    this.visit_loading_data = false
                    this.alert = response.error
                }
            } else {
                this.visit_loading_data = false
                this.visit_data = visit_data
                //this.getPhysicianDiagnosis();
            }
        },

        //Other Medicine
        otherMed() {
            this.other_med.dialog = true
        },

        saveOthersMed() {
            let other_medicine = {
                dosage: '',
                generic_name: this.other_med.generic_name,
                otc_medicine_code : 'OTC-0000',
                preparation: '',
                route: '',
                other_drug_code: ''
            }
            this.other_med.dialog = false
            this.other_med.generic_name = ''
            this.selected_medicine.push(other_medicine)
        },

        // GET PHYSICIAN DIAGNOSIS
        async getPhysicianDiagnosis() {
            if(this.physician_diagnosis.fresh_load){
                let response = await this.$services.getTransactionEmrDoctorDiagnosis({
                    transaction_number: this.emr_params.transaction_number
                });
                
                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)

                    this.date_admitted = this.$moment(response.data.date_admitted).format('MMMM D, YYYY')
                    this.date_discharged = this.$moment(response.data.date_discharged).format('MMMM D, YYYY')
                    this.chief_complaint = response.data.chief_complaint
                    this.history_current_illness = response.data.current_history_illness
                    this.admitting_diagnosis = response.data.admitting_diagnosis
                    this.select_management = response.data.management_type
                    
                    this.doctor_data = response.data.doctor_data ? response.data.doctor_data[0] : {
                        first_name: '',
                        middle_name: '',
                        last_name: '',
                        suffix: '',
                        specialization: '',
                        doc_prc_license: '',
                        doctor_position: ''
                    }
                    this.treatment_recommendation = response.data.treatment_recommendation
                    this.doctor_notes = response.data.doctor_note
                    this.acknowledgement_referral_code = response.data.acknowledgement_referral_code
                    this.selected_icd = response.data.transaction_data.length > 0 ? [] : this.selected_icd
                    response.data.transaction_data.forEach(element => {
                        this.package_name = element.package_name
                        this.selected_icd.push({
                            icd_code: element.icd_code,
                            icd_description: element.icd_description,
                            icd_code_description: element.icd_code+' / '+element.icd_description,
                            icd_group_code: '',
                            ph_category: element.ph_category,
                            icd_category: {
                                loading: false,
                                list: [],
                                selected: {
                                    category_description_id: '',
                                    category_description: element.category_description ? element.category_description : ''
                                }
                            },
                            procedures: element.procedure_list.map(data => {
                                return {
                                    ...data,
                                    show_long_desc: false
                                }
                            })
                        })
                        
                    })
                    
                    this.selected_medicine = response.data.medicine_data
                    this.selected_medicine.forEach(element => {
                        element.generic_name_text = element.generic_name + element.brand_name + element.dosage
                        this.selected_medicine_filter.push(element.generic_name_text)
                    })

                    this.doctor_data.specialization === 'Medical Practitioner' || this.doctor_data.specialization === 'Midwifery' ? this.getDoctorListed() : this.doctors_dialog_list = false

                    this.physician_diagnosis.fresh_load = false
                    this.physician_diagnosis.date_admitted = this.offline_date_admitted ? this.offline_date_admitted : this.date_admitted
                    this.physician_diagnosis.admitting_diagnosis = this.admitting_diagnosis
                    this.physician_diagnosis.date_discharged = this.offline_date_discharge ? this.offline_date_discharge : this.date_discharged
                    this.physician_diagnosis.chief_complaint = this.chief_complaint
                    this.physician_diagnosis.history_current_illness = this.history_current_illness
                    this.physician_diagnosis.doctor_data = this.doctor_data
                    this.physician_diagnosis.treatment_recommendation = this.treatment_recommendation
                    this.physician_diagnosis.doctor_notes = this.doctor_notes
                    this.physician_diagnosis.acknowledgement_referral_code = this.acknowledgement_referral_code
                    this.physician_diagnosis.selected_icd = this.selected_icd
                    this.physician_diagnosis.selected_medicine = this.selected_medicine
                    this.physician_diagnosis.select_management = this.select_management
                    sessionStorage.setItem('7nVooi3FUfd', this.$crypto.AES.encrypt(JSON.stringify(this.physician_diagnosis), 'EMX246'))
                    this.panel = [0] // Opens the Medical History Tab
                    this.disabled_discharged_btn = false
                    
                } else {
                    this.alert = response.error
                }           
            }else{
                this.physician_diagnosis.doctor_data.specialization === 'Medical Practitioner' || this.physician_diagnosis.doctor_data.specialization === 'Midwifery' ? this.getDoctorListed() : this.doctors_dialog_list = false

                this.date_admitted = this.physician_diagnosis.date_admitted
                this.date_discharged = this.physician_diagnosis.date_discharged
                this.chief_complaint = this.physician_diagnosis.chief_complaint
                this.history_current_illness = this.physician_diagnosis.history_current_illness,
                this.admitting_diagnosis = this.physician_diagnosis.admitting_diagnosis,
                this.doctor_data = this.physician_diagnosis.doctor_data
                this.treatment_recommendation = this.physician_diagnosis.treatment_recommendation
                this.doctor_notes = this.physician_diagnosis.doctor_notes
                this.acknowledgement_referral_code = this.physician_diagnosis.acknowledgement_referral_code
                this.selected_icd = this.physician_diagnosis.selected_icd
                this.selected_medicine = this.physician_diagnosis.selected_medicine
                this.select_management = this.physician_diagnosis.select_management
                this.selected_medicine_filter = this.physician_diagnosis.selected_medicine.filter(item => item.generic_name_text)
                this.panel = [0] // Opens the Medical History Tab
                this.disabled_discharged_btn = false
            }
        },

        loadingComplete(data) {
            this.medical_history.past_medical_history = data.past_medical_history
            this.medical_history.family_medical_history = data.family_medical_history
            this.medical_history.patient_social_history = data.patient_social_history

            //this.loading_data = false
        },

        // GET ICD LIST
        async getICDList() {
            await this.$store.dispatch('getICDList', {
                request_key: 'icd',
                hmo_doctor_code: this.$store.state.usr_credentials.doctor_code,
                doctor_tin_no: this.$store.state.usr_credentials.doctor_tin,
                page: this.icd_current_page,
                search_str: this.search_icd_items,
                selected_icd: this.selected_icd
            })
        },

        // GET CPT LST
        async getCPTList() {
            await this.$store.dispatch('getCPTList', {
                selection_type: "lgu",
                doctor_tin_no: this.$store.state.usr_credentials.doctor_tin,
                hmo_doctor_code: this.$store.state.usr_credentials.doctor_code,
                page: this.cpt_current_page,
                search_str: this.search_cpt_items
            })
            
            this.selected_cpt_filter = [... this.$store.state.cpt_list]
        },

        //GET CPT MODIFIER
        async getCPTModifier() {
            let response = await this.$services.getTransactionIpRefData({
                request_key: 'cpt_modifier'
            });
            if (response.status === 200) {
                //response.data = this.responseDataDecryption(response.data)
                this.select_cpt_modifier = response.data
                this.loading_modifier = false
            } else {
                this.alert = response.error;
            }
        },

        async getDoctorListed() {
            if (this.$store.state.usr_credentials.department === 'Medical Practitioner' || this.$store.state.usr_credentials.department === 'Midwife') {
                this.doctor_loader = true;
                this.doctors_dialog_list = true

                let response = await this.$services.getTransactionIpRefData({
                    request_key    : 'patient_doctor',
                    host_doctor    :'LGU',
                    provider_code  : this.$store.state.prv_data.provider_code, 
                    provider_tin   : this.$store.state.prv_data.provider_tin,
                    hmo_host_code  : undefined,
                    phic_host_code : undefined,
                    lgu_host_code  : this.$store.state.usr_credentials.lgu_host_code,
                    ...(this.$store.state.usr_credentials.department === 'Medical Practitioner' || this.$store.state.usr_credentials.department === 'Midwife'? { is_midwife: true } : undefined)
                });

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data);
                    this.doctor_loader = false;

                    if (response.data == 'Data not found.') return;

                    let new_doctor_items = response.data.filter(el => el.department.includes('Doctor'))

                    this.doctor_items = new_doctor_items.map(data => {
                        return {
                            doctor_name: data.doctor_name.replace(/[,.]/g, ''),
                            doctor_code: data.hmo_doctor_code,
                            doctor_tin: data.doctor_tin_no,
                            autoCompleteText: `${data.doctor_name} / ${data.specialization} ${data.doctor_tin_no}`,
                            first_name: data.first_name,
                            middle_name: data.middle_name,
                            last_name: data.last_name,
                            specialization: data.specialization,
                            doc_prc_license: data.doc_prc_license,
                            doctor_position: data.doctor_position,
                            provider_name: data.prv_name,
                            provider_reg_type: data.prv_reg_type,
                        };
                    });

                } else {
                    this.alert = response.error;
                }
            }
        },

        cancelSelectedDoctor() {
            this.doctors_dialog_list = false;
            this.$router.push('/patient-queue-list');
        },

        async saveChosenDoctor() {
            this.doctors_dialog_list = false;

            if (this.current_doctor) {
                // Update doctor_data directly in this method
                this.doctor_data = this.current_doctor;

                this.physician_diagnosis.doctor_data = {
                    first_name: this.current_doctor.first_name,
                    middle_name: this.current_doctor.middle_name,
                    last_name: this.current_doctor.last_name,
                    specialization: this.current_doctor.specialization,
                    doc_prc_license: this.current_doctor.doc_prc_license,
                    doctor_position: this.current_doctor.doctor_position,
                };

                //UPDATE LOCALSTORAGE FOR SELECTING AUTHORIZED DOCTOR FOR MEDICAL PRACTITIONER
                sessionStorage.setItem('7nVooi3FUfd', this.$crypto.AES.encrypt(JSON.stringify(this.physician_diagnosis), 'EMX246'))
            }

            // this.checkEmptyFields('confirm', 'submit_to_doctor')
        },

        // GET DRUGS MEDICINE LIST
        async getDrugsMedicine() {
            if (this.medicine_list.length === 0) {
                let response = await this.$services.getTransactionIpRefData({
                    request_key: 'otc_medicine',
                    provider_code: this.$store.state.prv_data.provider_code
                });

                if (response.status === 200) {
                    //response.data = this.responseDataDecryption(response.data)
                    this.medicine_list = response.data.map(item => {
                        let medicine = {
                            medicine_no: item.medicine_no,
                            otc_medicine_code: item.otc_medicine_code,
                            brand_name: item.brand_name,
                            dosage: item.dosage,
                            preparation: item.preparation,
                            route: item.route,
                            generic_name: item.generic_name,
                            max_stock_quantity: item.max_stock_quantity,
                            generic_name_text: item.generic_name + item.brand_name + item.dosage,
                            other_med_group: item.pOthMedDrugGroup ? item.pOthMedDrugGroup : '',
                            current_quantity: item.current_quantity ? item.current_quantity : 0
                        }
                        
                        return medicine
                    })
        
                    sessionStorage.setItem('kgIGs35', this.$crypto.AES.encrypt(JSON.stringify(this.medicine_list), 'EMX246'))
                    this.loading_medicine = false
                } else {
                    this.alert = response.error;
                }
            } else {
                this.loading_medicine = false;
            }
        },

        async getVaccinatorList() {
            if (this.vaccinator_items.length === 0 && this.emr_params.editable) {
                let response = await this.$services.getTransactionIpRefData({
                    request_key: 'nurse_list',
                    provider_tin: this.$store.state.prv_data.provider_tin,
                    provider_code: this.$store.state.prv_data.provider_code
                })

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
                    if (Array.isArray(response.data)) {
                        this.vaccinator_items = response.data.map(element => {
                            return {
                                key: element.user_code,
                                vaccinator: this.combineString([element.first_name, element.middle_name, element.last_name, element.suffix]).trim()
                            }
                        })
                    }
                    
                    this.vaccinator_items.push({
                        key: 'Others', 
                        vaccinator: 'Others'
                    })

                    sessionStorage.setItem('lVIds01', this.$crypto.AES.encrypt(JSON.stringify(this.vaccinator_items), 'EMX246'))
                    this.loading_vaccinator = false

                } else {
                    this.alert = response.error
                }
            } else {
                this.loading_vaccinator = false
            }
        },

        // submitToDoctor(key){
        //     if(key === 'submit_to_doctor'){
        //         this.doctors_dialog_list = true
        //     } else {
        //         this.doctors_dialog_list = false
        //     }
        // },

        // CHECK FOR EMPTY FIELDS
        async checkEmptyFields(status, key) {
            this.doctors_submit_key = key
            let empty = false
            
            this.patient_info.mem_home_bgy = this.patient_info.mem_home_bgy ? this.patient_info.mem_home_bgy.trim() : this.patient_info.mem_home_bgy
            this.patient_info.mem_home_city_municipality = this.patient_info.mem_home_city_municipality ? this.patient_info.mem_home_city_municipality.trim() : this.patient_info.mem_home_city_municipality
            this.patient_info.mem_home_province = this.patient_info.mem_home_province ? this.patient_info.mem_home_province.trim() : this.patient_info.mem_home_province
            this.patient_info.mem_home_zip = this.patient_info.mem_home_zip ? this.patient_info.mem_home_zip.trim() : this.patient_info.mem_home_zip

            // if(!this.patient_info.mem_home_bgy || !this.patient_info.mem_home_city_municipality || !this.patient_info.mem_home_province || !this.patient_info.mem_home_zip){
            //     empty = true
            //     this.pti_empty_fields = true
            // }

            if (this.referral_data.referral_doctor_provider_name || this.referral_data.referral_doctor_first_name || this.referral_data.referral_doctor_middle_name || this.referral_data.referral_doctor_last_name || this.referral_data.referral_doctor_specialization || this.referral_data.referral_doctor_contact_number || this.referral_data.reason_for_referral) {
                // if (!this.referral_data.referral_doctor_specialization || !this.referral_data.reason_for_referral) {
                //     empty = true
                //     this.referral_empty_fields = true
                // }
                const is_sta_rosa = this.$store.state.usr_credentials.lgu_host_code === 'SR';

                if ((is_sta_rosa && !this.eligible_data.konsulta_eligible && !this.referral_data.reason_for_referral) ||
                (!is_sta_rosa && (!this.referral_data.referral_doctor_specialization || !this.referral_data.reason_for_referral))
                ) {
                    empty = true
                    this.referral_empty_fields = true
                }
            } else {
                this.referral_status = false
            }

            if(status !== 'save_print' || status !== 'med_cert'){
                if(this.covid_vaccination_record || this.booster_record){
                    const get_data = this.covid_vaccination_record.filter(item => item.is_edited)
                    const get_booster = this.booster_record.filter(item => item.is_edited)
                    
                    if (get_data.length > 0) { 
                        get_data.map((item,index) => {
                            if (item.dose_brand) {
                                item.is_error = false
                            } else if (!item.dose_brand) {
                                if (index == 0 &&  index < get_data.length -1 && (get_data[index+1].date_time || get_data[index+1].dose_brand )) {
                                    item.is_error = true
                                } else {
                                    item.is_error = false
                                    if (get_booster.length > 0 && (get_booster[0].date_time_display || get_booster[0].dose_brand)) {
                                        item.is_error = true
                                    }
                                }
                            } else {
                                item.is_error = true
                            }
                            return item
                        })
                    }

                    if (get_booster.length > 0 ) {
                        get_booster.map((item,index) => {
                            if (item.dose_brand) {
                                item.is_error = false
                            } else if (!item.dose_brand) {
                                item.is_error = false
                                if (index < get_booster.length -1 && (get_booster[index+1].date_time || get_booster[index+1].dose_brand )) {
                                    item.is_error = true
                                }
                            } else {
                                item.is_error = true
                            }
                            return item
                        })
                    }
                    
                    empty = get_data.some(item => item.is_error === true)  || get_booster.some(item => item.is_error === true)
                    this.cov_empty_fields = empty
                }

                // if(!this.treatment_recommendation && this.selected_icd.length > 0){
                //     const count = this.selected_icd.filter(item => item.procedures.length > 0)
                    
                //     if(count.length > 0){
                //         empty = true
                //         this.phy_empty_fields = true
                //     } else {
                //         this.phy_empty_fields = false
                //     }
                // }

                if(!this.treatment_recommendation){
                    empty = true
                    this.treatment_submit_attempted = true
                } else {
                    empty = false 
                    this.treatment_submit_attempted = false 
                }

                // const invalid_input = (value) => {
                //     if (!value) return true; 
                //     const normalized = value.trim().toLowerCase();
                //     const invalid = ["n/a", "none", "not applicable", "na"];
                //     return invalid.includes(normalized);
                // };

                this.chief_complaint = this.chief_complaint?.trim() || "";
                this.history_current_illness = this.history_current_illness?.trim() || "";

                let chief_complaint_required = false;
                let history_required = false;

                if (this.eligible_data?.eclaims_eligible) {
                    chief_complaint_required = this.invalidInput(this.chief_complaint);
                    history_required = this.invalidInput(this.history_current_illness);
                    empty = chief_complaint_required || history_required; 
                    this.chief_history_empty = empty;
                }

                if(this.eligible_data.konsulta_eligible && !this.chief_complaint){
                    empty = true
                    this.chief_empty_fields = true
                } else {
                    this.chief_empty_fields = false
                }

                if (this.selected_medicine.length > 0) {
                    const select = this.selected_medicine.filter(element => 
                        element.total_num_of_med > 0 || 
                        (element.medicine_code === 'OTC-0000' && element.other_drug_code)
                    );

                    if (select.length <= 0) {
                        empty = true;
                        this.med_empty_fields = true;
                    } else {
                        this.med_empty_fields = false; 
                    }
                }

                //VALIDATE IF ELIGIBLE TO EKONSULTA TO REQUIRED THE SOCIAL HISTORY IN MEDICAL HISTORY
                if (this.eligible_data?.konsulta_eligible && this.medical_history?.patient_social_history?.length < 4) {
                    empty = true
                    this.social_history_empty_field = true;
                } else {
                    this.social_history_empty_field = false;
                }

            }

            if(this.$refs.ob_gyne){
                if (this.obgy_status) {
                    this.obgy_has_empty = await this.$refs.ob_gyne.checkIfEmpty();
                    if (this.obgy_has_empty) empty = true
                }
            }

            if (this.vac_status) {
                this.vac_has_empty = await this.$refs.vaccination_record.checkIfEmpty();
                if (this.vac_has_empty) empty = true
            }

            if (this.pex_status) {
                const pex_has_empty = await this.$refs.physical_examination.checkIfEmpty();
                if (pex_has_empty) empty = true
            }

            if (this.sas_status) {
                const sas_has_empty = await this.$refs.phy_signs_and_symptoms.checkFields()
                if (sas_has_empty) empty = true
            }
  
            if(empty){
                
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Empty Fields', body: 'Please complete all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }else{
                if(status === 'save'){
                    this.for_saving = true
                    this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-help-circle', color: 'primary', title: 'This will save all the changes you made without submitting yet', body: 'Click OKAY to proceed', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'updatePatientInfo', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
                }else if(status === 'confirm'){
                    this.for_saving = false
                    this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-help-circle', color: 'primary', title: 'All changes are going to be submitted and you can no longer edit', body: 'Click OKAY to proceed', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'updatePatientInfo', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
                }else if(status === 'save_print' || status === 'save_print_med_cert'){
                    this.save_print_dialog = true
                    this.for_print = status === 'save_print' ? 'treatment' : 'med_cert'
                }
            }
        },

        // UPDATE PATIENT INFORMATION
        async updatePatientInfo() {
            if(this.pat_status){
                let payload_data = {
                    request_key: 'patient_information',
                    transaction_number: this.emr_params.transaction_number,
                    ek_id: '',
                    ek_lgu_id: this.emr_params.ek_lgu_id,
                    ek_hmo_id: this.emr_params.ek_hmo_id,
                    lgu_number: '',
                    policy_number: this.emr_params.hmo_policy_number,
                    phic_number: this.emr_params.ek_phic_id,

                    marital_status: this.patient_info.mem_civil_status,
                    religion: this.patient_info.mem_religion !== 'OTHERS'? this.patient_info.mem_religion : this.$refs.other_religion.religion.new,
                    bldgno: this.patient_info.mem_home_bldgno,
                    bgy: this.patient_info.mem_home_bgy,
                    city_municipality: this.patient_info.mem_home_city_municipality,
                    province: this.patient_info.mem_home_province,
                    zip: this.patient_info.mem_home_zip,

                    is_phic: this.patient_info.mem_phic_pin ? '1' : '0',
                    birthplace: this.patient_info.mem_birthplace,
                    occupation: this.patient_info.mem_occupation,
                    ethnic_group: this.patient_info.ethnic_group,
                    guardian: this.plan_data.guardian,
                    blood_type: this.patient_info.blood_type,
                    contact_number: this.patient_info.mem_mobile_number ? this.patient_info.mem_mobile_number.replace(/^0+/,'') : null,
                    landline_number: this.patient_info.mem_landline_number ? this.patient_info.mem_landline_number.replace(/^0+/,'') : null,
                    process_by: this.$store.state.usr_credentials.user_name
                }

                let response = await this.$services.trnUpdatePatientTranRecord(payload_data, 'updatePatientInfo');

                if (response.status === 200) {
                    if (response.data.success) {
                        this.updatePhysicalExamination();
                        sessionStorage.removeItem('00klfs7Dt8Ygj');
                    } else {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                    }
                } else {
                    this.alert = response.error;
                }
            } else {
                this.updatePhysicalExamination();
            }
        },

        async updatePhysicalExamination() {
            if (this.pex_status) {

                let success = await this.$refs.physical_examination.postData(this.emr_params.transaction_number, this.pex_data);

                if (success) this.updateDietaryInformation();
            } else {
                this.updateDietaryInformation();
            }
        },

        // UPDATE DIETARY INFORMATION
        async updateDietaryInformation() {
            if(this.diet_status){
                let payload_data = {
                    request_key: 'dietary_intake',
                    transaction_number: this.emr_params.transaction_number,
                    high_fat_salt_intake: this.dietary_information.data.high_fat_salt_intake,
                    fiber_intake_fruit: this.dietary_information.data.fiber_intake_fruit,
                    fiber_intake_vegetable: this.dietary_information.data.fiber_intake_vegetable,
                    physical_activity: this.dietary_information.data.physical_activity,
                    process_by: this.$store.state.usr_credentials.user_name
                }

                payload_data = this.request_data_payload ? this.request_data_payload.request_payload : payload_data

                let response = await this.$services.trnUpdatePatientTranRecord(payload_data, 'updateDietaryInformation');

                if (response.status === 200) {
                    if (response.data.success) {
                        this.updateSignsAndSymptoms();
                        sessionStorage.removeItem('kgfl8dhgv')
                    } else {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                    }
                } else {
                    this.alert = response.error;
                }
            } else {
                this.updateSignsAndSymptoms();
            }
        },
        
        async updateSignsAndSymptoms() {
            if (this.sas_status) {
                const success = await this.$refs.phy_signs_and_symptoms.SaSpostData();
                if (success) this.updateCloseContactTB();
            } else {
                this.updateCloseContactTB();
            }
        },

        async updateCloseContactTB(){
            if(this.close_contact_status){
                let payload_data = {
                    request_key: 'close_contact_tb',
                    transaction_number: this.emr_params.transaction_number,
                    classification: this.close_contact_tb.value,
                    process_by: this.$store.state.usr_credentials.user_name
                }

                payload_data = this.request_data_payload ? this.request_data_payload.request_payload : payload_data

                let response = await this.$services.trnUpdatePatientTranRecord(payload_data, 'updateCloseContactTB');

                if (response.status === 200) {
                    if (response.data.success) {
                        this.updatePlanData();
                        sessionStorage.removeItem('0vc9423lg')
                    } else {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                    }
                } else {
                    this.alert = response.error;
                }
            } else {
                this.updatePlanData();
            }
        },

        // UPDATE PLAN DATA
        async updatePlanData(){
            if(this.plan_status){
                let payload_data = {
                    request_key: 'plan',
                    transaction_number: this.emr_params.transaction_number,
                    diet: this.plan_data.diet,
                    fluid_intake: this.plan_data.fluid_intake,
                    medical_certificate: this.plan_data.medical_certificate,
                    disability_certificate: this.plan_data.disability_certificate,
                    gender_verification: this.plan_data.gender_verification,
                    follow_up_consultation_date: this.formatDate(this.plan_data.follow_up_consultation_date),
                    process_by: this.$store.state.usr_credentials.user_name
                }
                payload_data = this.request_data_payload ? this.request_data_payload.request_payload : payload_data

                let response = await this.$services.trnUpdatePatientTranRecord(payload_data, 'updatePlanData');

                if (response.status === 200) {
                    if (response.data.success) {
                        this.updateNcdqans();
                        sessionStorage.removeItem('mmxcHF4s3')
                    } else {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                    }
                } else {
                    this.alert = response.error;
                }
            } else {
                this.updateNcdqans();
            }
        },

        //UPDATE NCD QUESTIONS #05-23
        async updateNcdqans(){
            if(this.ncdq_status){
                let payload_data = {
                    request_key: 'ncdqans',
                    ek_lgu_id: this.emr_params.ek_lgu_id,
                    transaction_number: this.emr_params.transaction_number,
                    ncdqans: this.ncdqans,
                    date_updated: this.$moment().format('MM-DD-YYYY')
                }
                payload_data = this.request_data_payload ? this.request_data_payload.request_payload : payload_data
               
                let response = await this.$services.trnUpdatePatientTranRecord(payload_data, 'updateNcdqans');

                if (response.status === 200) {
                    if (response.data.success) {
                        this.updateReferralData();
                        sessionStorage.removeItem('mmxcHF4s3')
                    } else {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                    }
                } else {
                    this.alert = response.error;
                }
            } else {
                this.updateReferralData();
            }
        },

        async updateReferralData(){
            if(this.referral_status){
                let payload_data = {
                    request_key: 'referral',   
                    ek_id: '',
                    ek_lgu_id: this.emr_params.ek_lgu_id,
                    ek_hmo_id: this.emr_params.ek_hmo_id,
                    lgu_number: '',
                    policy_number: this.emr_params.hmo_policy_number,
                    phic_number: this.emr_params.ek_phic_id,
                    transaction_number: this.emr_params.transaction_number,
                    referral_code: this.referral_data.referral_code,  
                    referral_doctor_provider_name: this.referral_data.referral_doctor_provider_name,
                    referral_doctor_provider_tin: this.referral_data.referral_doctor_provider_tin,
                    referral_doctor_provider_code: this.referral_data.referral_doctor_provider_code,
                    referral_doctor_tin: this.referral_data.referral_doctor_tin,
                    referral_doctor_code: this.referral_data.referral_doctor_code,
                    referral_doctor_first_name: this.referral_data.referral_doctor_first_name,
                    referral_doctor_middle_name: this.referral_data.referral_doctor_middle_name,
                    referral_doctor_last_name: this.referral_data.referral_doctor_last_name,
                    referral_doctor_specialization: this.referral_data.referral_doctor_specialization,
                    referral_doctor_contact_number: this.referral_data.referral_doctor_contact_number,
                    reason_for_referral: this.referral_data.reason_for_referral,
                    referring_doctor_tin: this.$store.state.usr_credentials.doctor_tin,
                    referring_doctor_code: this.$store.state.usr_credentials.doctor_code,
                    referring_doctor_provider_tin: this.$store.state.prv_data.provider_tin,
                    referring_doctor_provider_code: this.$store.state.prv_data.provider_code,
                    referring_doctor_contact_no: this.referral_data.referring_doctor_contact_no,
                    status: '0',
                    process_by: this.$store.state.usr_credentials.user_name
                }

                let response = await this.$services.trnUpdatePatientTranRecord(payload_data, 'updateReferralData');

                if (response.status === 200) {
                    if (response.data.success) {
                         this.updateMedicalHistory();
                        sessionStorage.removeItem('65sHXXfg23')
                    } else {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                    }
                } else {
                    this.alert = response.error;
                }
            } else {
                this.updateMedicalHistory();
            }
        },

        async updateMedicalHistory() {
            if (this.medh_status) {
                const success = await this.$refs.medical_history.postData();
                if (success) this.updateObGyneHistory();
            } else {
                this.updateObGyneHistory();
            }
        },

        async updateObGyneHistory() {
            if (this.obgy_status) {
                const success = await this.$refs.ob_gyne.postData();
                if (success) this.updateVaccinationRecord();
            } else {
                this.updateVaccinationRecord();
            }
        },

        async updateVaccinationRecord() {
            if (this.vac_status) {
                const { success } = await this.$refs.vaccination_record.postData();
                if (success) this.updateCovidVaccination();
            } else {
                this.updateCovidVaccination();
            }
        },

        // UPDATE COVID VACCINATION RECORD
        async updateCovidVaccination(){  
            if(this.cov_status){
                const get_combine_data = [...this.covid_vaccination_record, ...this.booster_record]

                const vaccine_data = get_combine_data.filter (data => data.date_time && data.dose_brand && data.batch_no && data.lot_no && data.vaccinator).map(item => {
                    delete item.is_edited
                    delete item.is_error
                    delete item.date_time_display

                    return {
                        ...item,
                        is_pending: '0',
                        disease: 'COVID',
                        doctor_code: this.$store.state.usr_credentials.doctor_code,
                        doctor_tin: this.$store.state.usr_credentials.doctor_tin,
                        provider_tin: this.$store.state.prv_data.provider_tin,
                        provider_code:  this.$store.state.prv_data.provider_code,
                        hmo_policy_number: this.emr_params.hmo_policy_number,
                        hmo_host_code: this.emr_params.hmo_host_code,
                        ek_hmo_id: this.emr_params.ek_hmo_id,
                        ek_lgu_id: this.emr_params.ek_lgu_id,
                        lgu_host_code: this.emr_params.lgu_host_code,
                        phic_number: this.emr_params.ek_phic_id,
                    }
                })

                if (vaccine_data.length > 0) {
                    let response = await this.$services.trnUpdateOutpatientCpt({
                        transaction_number: this.emr_params.transaction_number,
                        vaccination: vaccine_data
                    });

                    if (response.status === 200) {
                        if (response.data.success) {
                            this.updatePurposeOfVisit();
                            sessionStorage.removeItem('GHFXxd9ghcCCy')
                        } else {
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                        }
                    } else {
                        this.alert = response.error;
                    }
                } else {
                    this.updatePurposeOfVisit();
                }
            }else{
                this.updatePurposeOfVisit();
            }
        },

        // UPDATE PURPOSE OF VISIT
        async updatePurposeOfVisit(){
            if(this.vis_status){
                let response = await this.$services.trnUpdatePatientTranRecord({
                        request_key: 'visit',
                        transaction_number: this.emr_params.transaction_number,
                        purpose_of_visit_service_availed: this.visit_data.purpose_of_visit,
                        process_by: this.$store.state.usr_credentials.user_name
                    });

                    if (response.status === 200) {
                        if (response.data.success) {
                            this.updPreConsultation();
                            sessionStorage.removeItem('0g8sJ23sf')
                        } else {
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                        }
                    } else {
                        this.alert = response.error;
                    }
            }else{
                this.updPreConsultation();
            }
        },

        // UPDATE PHYSICIAN DIAGNOSIS
        async updPreConsultation(){
            this.disabled_discharged_btn = true
            if((this.eligible_data.eclaims_eligible || this.eligible_data.ekonsulta_eligible)){
                await this.$refs.physical_examination.postData(this.emr_params.transaction_number, this.pex_data);
            }

            if(this.phy_status || !this.for_saving){
                const icd_cpt = this.selected_icd.map((icd, index) => {
                    if(icd.icd_code){
                        return {
                            icd_code: icd.icd_code,
                            icd_description: icd.icd_description,
                            category_description_id: icd.icd_category.selected.category_description_id,
                            ph_category: icd.ph_category,
                            hmo_icd_limit_bal: 0,
                            hmo_icd_status: null,
                            phic_icd_status: null,
                            lgu_icd_status: null,
                            icd_type: index === 0 ? 'PRIMARY' : index === 1 ? 'SECONDARY' : 'OTHERS',
                            procedure_list: icd.procedures.map((cpt) => {
                                if (cpt.cpt_code) {
                                    return {
                                        cpt_code: cpt.cpt_code,
                                        cpt_description: cpt.cpt_description,
                                        cpt_amount: 0,
                                        cpt_mod_code: cpt.modifier ? cpt.modifier.mod_code : null, 
                                        hmo_cpt_approved_amount: 0,
                                        phic_cpt_status: null,
                                        lgu_cpt_status: null,
                                        hmo_cpt_status: null,
                                        hmo_loa_amount: 0,
                                        for_hmo_approval: 0,
                                        diag_exam_status: cpt.diag_exam_status,
                                        physician_recommendation: cpt.physician_recommendation === 'Yes' ? 'Y' : '' || cpt.physician_recommendation === 'No' ? 'N' : '' || cpt.physician_recommendation === 'Not Applicable' ? 'N' : 'X',
                                        patient_remarks: cpt.patient_remarks === 'Not Applicable' ? 'XX' : '' || cpt.patient_remarks === 'Request' ? 'RQ' : '' || cpt.patient_remarks === 'Refuse' ? 'RF' : ''
                                    }
                                }
                            }),
                        }
                    }
                })

                this.selected_medicine.forEach(element => {
                    element.total_prescribed_medicine = element.total_num_of_med
                })

                //DEFAULT VALUE FOR MANAGMENT IF THE PATIENT IS ELIGIBLE FOR EKONSULTA
                if (this.eligible_data.konsulta_eligible && !this.for_saving){
                    if (this.physician_diagnosis.select_management.length <= 0) {
                        this.physician_diagnosis.select_management = [{
                            lib_id: '0', 
                            management_description: 'Not Applicable'
                        }];
                    }

                    if (!this.doctor_notes) {
                        this.doctor_notes = 'N/A'
                    }
                    
                    if (!this.history_current_illness) {
                        this.history_current_illness = 'N/A'
                    }
                }

                let patient_transaction_status = ''
                let patient_transaction_type = ''

                if(this.doctors_submit_key === 'discharge_patient'){
                    patient_transaction_status = 'ISSUED'
                    patient_transaction_type = 'CONSULTATION'
                }

                let payload_data = {
                    transaction_number: this.emr_params.transaction_number,
                    referral_code: this.referral_data.referral_code,
                    package_name: this.package_name,
                    icd_cpt_data: icd_cpt,
                    patient_medicine: this.selected_medicine,
                    date_admitted: this.$moment(this.date_admitted).format('YYYY-MM-DD'),
                    date_discharged: this.$moment(this.date_discharged).format('YYYY-MM-DD'),
                    transaction_type: this.for_saving ? 'PRE CONSULTATION' : patient_transaction_type,
                    transaction_status: this.for_saving ? 'ON PROCESS DOCTOR' : patient_transaction_status,
                    treatment_recommendation: this.treatment_recommendation,
                    ...(this.$store.state.usr_credentials.department === 'Medical Practitioner' ? {
                        authorized_doctor: {
                            authorized_doc_code: this.current_doctor.doctor_code,
                            authorized_doc_tin: this.current_doctor.doctor_tin     
                        }
                    } : undefined),
                    notes_management: {                
                        management: this.physician_diagnosis.select_management,
                        doctor_notes: this.doctor_notes
                    },
                    admitting_diagnosis: this.admitting_diagnosis,
                    current_history_illness: this.history_current_illness,
                    chief_complaint: this.chief_complaint,
                    process_by: this.$store.state.usr_credentials.user_name,
                    is_off_transaction: this.$store.state.usr_credentials.user_type === '9-1' ? true : false,
                    diagnostic_exam_result: this.diagnostic_exam_result,
                    ekonsulta_eligible: this.eligible_data.konsulta_eligible,
                    eclaims_eligible: this.eligible_data.eclaims_eligible,
                    provider_code: this.$store.state.prv_data.provider_code
                }

                payload_data = this.request_data_payload ? this.request_data_payload.request_payload : payload_data

                let response = await this.$services.trnUpdatePreConsultation(payload_data, 'updPreConsultation');
                if (response.status === 200) {
                    sessionStorage.removeItem('7nVooi3FUfd')
                    this.updateReferralStatus();

                    if(this.eligible_data.konsulta_eligible){
                        this.saveEkonsulta()
                    } else {
                        this.$store.commit('set_transaction_flag', 1)
                    }

                    this.leave_approval = false
                } else {
                    this.$store.commit('set_transaction_flag', 1)
                    this.alert = response.error;
                }
            } else {
                this.updateReferralStatus();
            }
        },

        async updateReferralStatus() {
            if (this.acknowledgement_referral_code) {
                
                let response = await this.$services.trnUpdateTransactionReferral({
                    ek_lgu_id: this.emr_params.ek_lgu_id,
                    referral_code: this.acknowledgement_referral_code,
                    status: '1',
                    acknowledged_by_doctor_tin: this.$store.state.usr_credentials.doctor_tin,
                    acknowledged_by_doctor_code: this.$store.state.usr_credentials.doctor_code,
                    acknowledged_by_doctor_first_name: this.doctor_data.first_name,
                    acknowledged_by_doctor_middle_name: this.doctor_data.middle_name,
                    acknowledged_by_doctor_last_name: this.doctor_data.last_name,
                    acknowledged_by_provider_tin: this.$store.state.prv_data.provider_tin,
                    acknowledged_by_provider_code: this.$store.state.prv_data.provider_code,
                    acknowledged_by_provider_name: this.$store.state.prv_data.provider_name,
                    acknowledged_by_user_code: '',
                    acknowledged_by_operator_name: ''
                });

                if (response.status === 200) {
                    this.updateComplete();
                } else {
                    this.alert = response.error;
                }
            } else {
                this.updateComplete();
            }
        },

        updateComplete() {
            if (!this.for_saving) sessionStorage.clear();
            const title = 'Transaction has been successfully ' + (this.for_saving ? 'saved' : 'submitted')
            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-check-circle', color: 'success', title: title, btn_pry_txt: 'OK', btn_pry_emt: 'redirect', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            this.disabled_discharged_btn = false
        },

        redirect() {
            if(!this.for_saving) {
                this.$router.replace('/patient-queue-list')
            }
        },
        
        // ADD DIAGNOSIS FIELD
        addDiagnosisField(){
            this.selected_icd.push({
                icd_code: '',
                icd_description: '',
                icd_code_description: '',
                icd_group_code: '',
                icd_category: {
                    loading: false,
                    list: [],
                    selected: {
                        category_description_id: '',
                        category_description: ''
                    }
                },
                procedures: []
            })
        },

        //LOAD MORE ICD/CPT IN V-COMBOBOX
        loadMore(value) {
            if (value === 'icd') {
                this.icd_current_page += 1
                this.icd_next_page = this.icd_current_page
                this.getICDList()
                this.$store.commit('set_loading_icd', true)
            }

            if (value === 'cpt') {
                this.cpt_current_page += 1
                this.cpt_next_page = this.cpt_current_page
                this.getCPTList()
                this.$store.commit('set_loading_cpt', true)
            }
        },
        
        //SEARCH ITEM FOR ICD
        searchItems(value, key) {
            clearTimeout(this.time_out) 
            if(value) {
                if (key === 'icd') {
                    this.search_icd_items = ''
                    this.time_out = setTimeout(() => {
                        this.search_icd_items = value
                        this.icd_current_page = 1
                        this.getICDList()
                        //this.$store.commit('set_loading_icd', true)
                    }, 500)
                } 

                if (key === 'cpt') {
                    this.search_cpt_items = ''
                    this.time_out = setTimeout(() => {
                        this.search_cpt_items = value
                        this.cpt_current_page = 1
                        this.getCPTList()
                        //this.$store.commit('set_loading_cpt', true)
                    }, 500)
                }
            } else {
                if (key === 'icd') { 
                    this.icd_current_page = this.icd_next_page + 1
                    this.search_icd_items = ''
                }

                if (key === 'cpt') { 
                    this.cpt_current_page = this.cpt_next_page + 1
                    this.search_cpt_items = ''
                }
            }
        },

        // ADD DIAGNOSIS DATA
        addDiagnosisData(index, item){
            if(this.switch_favorite) {
                this.favorite_items.push(item)
            } else {
                this.selected_icd[index].icd_code = item.icd_code
                this.selected_icd[index].icd_description = item.icd_description
                this.selected_icd[index].icd_code_description = item.icd_code+' / '+item.icd_description
                this.selected_icd[index].icd_group_code = item.icd_group_code
                this.selected_icd[index].ph_category = item.ph_category
                this.current_icd = item.icd_code+' / '+item.icd_description
    
                this.selected_icd_filter = []
                this.selected_icd.forEach(element => {
                    this.selected_icd_filter.push(element.icd_code)
                }) 
    
                this.mutationStatus('phy');
    
                if (item.icd_group_code) {
                    this.getICDCategoryList(index, item.icd_group_code);
                } else {
                    this.selected_icd[index].icd_category = {
                        loading: false,
                        list: [],
                        selected: {
                            category_description_id: '',
                            category_description: ''
                        }
                    }
                }
            }
        },

        async getICDCategoryList(index, icd_group_code) {
            this.selected_icd[index].icd_category.loading = true

            let response = await this.$services.getIcdCategoryList({
                icd_group_code: icd_group_code
            });

            if (response.status === 200) {
                if (response.data.has_data) {
                    this.selected_icd[index].icd_category.list = this.responseDataDecryption(response.data.category_list)
                }

                this.selected_icd[index].icd_category.loading = false
            } else {
                this.alert = response.error;
            }
        },
        
        // REMOVE DIAGNOSIS
        removeDiagnosis(index){
            this.selected_icd_filter = []
            this.selected_icd.splice(index, 1)
            this.selected_icd.forEach(element => {
                this.selected_icd_filter.push(element.icd_code)
            })

            this.mutationStatus('phy');
        },

        // ADD PROCEDURE
        addProcedure(event, index){
            let data = {
                physician_recommendation: 'Yes',
                patient_remarks: 'Not Applicable',
                show_long_desc: false,
                diag_exam_status: 'N',
                modifier: {
                    mod_code: '',
                    mod_description: ''
                },
                ...event
            }
            this.selected_icd[index].procedures.push(data)
            this.selected_icd[index].procedures.forEach(element => {
                this.selected_cpt_filter.push(element.cpt_code)
            }) 
    
            this.selected_cpt_holder = {}
            this.mutationStatus('phy');
            this.getCPTModifier();
        },

        showLongDesc(icd_index, cpt_index) {
            this.selected_icd[icd_index].procedures[cpt_index].show_long_desc = !this.selected_icd[icd_index].procedures[cpt_index].show_long_desc
        },

        // REMOVE PROCEDURE
        removeProcedure(icd_index, cpt_index, cpt_code){
            this.selected_cpt_filter = this.selected_cpt_filter.filter(item => item !== cpt_code)
            this.selected_cpt = this.selected_cpt.filter(item => item.cpt_code !== cpt_code);
            this.selected_icd[icd_index].procedures.splice(cpt_index, 1)
            this.mutationStatus('phy');
        },

        // ADD DRUGS MEDICINE
        addDrugsMedicine(data){
            if(data.otc_medicine_code === 'OTC-0000'){
                this.other_med.dialog = true
            } else {
                let medicine = {
                    brand_name: null,
                    ...data
                }
                this.selected_medicine_filter.push(data.generic_name_text)
                this.selected_medicine.push(medicine)
                this.mutationStatus('phy');
            }
        },

        // REMOVE ADDED DRUGS MEDICINE
        removeAddedDrugsMedicine(index){
            this.selected_medicine_filter = this.selected_medicine_filter.filter(item => item !== this.selected_medicine[index].generic_name_text)
            this.selected_medicine.splice(index, 1)
            this.mutationStatus('phy');
        },

        getReferralData(data){
            this.referral_data = data
        },

        // PRINT REFERRAL FORM
        printReferralForm(){
            if(this.$refs.referral_form.validate()){
                this.print();
            }
        },

        // OPEN REFERRAL FORM
        openReferralForm(){
            this.$refs.doctor_referral.openDoctorReferral()
            this.referral_empty_fields = false
        },

        // SELECT PROVIDER
        selectProvider(data){
            this.referral_doctor_provider_tin = data.provider_tin
            this.referral_doctor_provider_code = data.provider_code
            setTimeout(() => {
                this.referral_doctor_provider_name = data.name
            }, 50)
            
            this.mutationStatus('referral');
        },

        // // GET PROVIDER LIST
        // async getProviderList(){
        //     if(localStorage.getItem('KFH45P')){
        //         this.provider_items = localStorage.getItem('KFH45P') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('KFH45P'), 'Gl53k9sE').toString(this.$crypto.enc.Utf8)) : null
        //         this.loading_provider = false
        //     }else{
        //         let response = await this.$services.getProviderList({
        //         });

        //         if (response.status === 200) {
        //             const response_data = this.responseDataDecryption(response.data)
        //             response_data.unshift({
        //                 name: 'No Specific Hospital',
        //                 provider_tin: '',
        //                 provider_code: ''
        //             })
        //             localStorage.setItem('KFH45P', this.$crypto.AES.encrypt(JSON.stringify(response_data), 'Gl53k9sE'))
        //             this.provider_items = response_data
        //             this.loading_provider = false
        //         } else {
        //             this.alert = response.error;
        //         }
        //     }
        // },
        
        // // GET SPECIALIZATION LIST.
        // async getSpecializationList(){
        //     if(localStorage.getItem('VGR084')){
        //         this.specialization_items = JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('VGR084'), 'pggpjxKK').toString(this.$crypto.enc.Utf8))
        //         this.loading_specialization = false
        //     }else{
        //         let response = await this.$services.getProviderList({
        //         });

        //         if (response.status === 200) {
        //             localStorage.setItem('VGR084', this.$crypto.AES.encrypt(JSON.stringify(response.data.specialization), 'pggpjxKK'))
        //             this.specialization_items = response.data.specialization
        //             this.loading_specialization = false
        //         } else {
        //             this.alert = response.error;
        //         }
        //     }
        // },

        // CHANGE MUTATION STATUS
        mutationStatus(item, data, value){
            if(this.emr_params.editable){
                if(item === 'pti'){
                    this.pat_status = true
                } else if(item === 'med') {
                    this.medh_status = true
                    this.medical_history = {
                        past_medical_history: data.past_medical_history,
                        family_medical_history: data.family_medical_history,
                        patient_social_history: data.patient_social_history
                    }
                }else if(item === 'obg'){
                    this.obgy_status = true
                } else if(item === 'vac') {
                    this.vac_status = true
                }else if(item === 'cov'){
                    this.cov_status = true
                    this.covid_vaccination_record = data.vaccination_data
                    this.booster_record = data.booster_data
                } else if (item === 'close_contact') {
                    this.close_contact_status = true
                    this.close_contact_tb.value = data
                } else if(item === 'pex') {
                    this.pex_status = true
                    this.pex_data = data
                } else if(item === 'diet') {
                    this.diet_status = true
                } else if(item === 'ncdq') {
                    this.ncdq_status = true
                } else if(item === 'plan'){
                    this.plan_status = true
                } else if (item === 'sas') {
                    this.sas_status = true,
                    this.signs_and_symptoms.data = data.signs_and_symptoms
                } else if(item === 'vis'){
                    this.vis_status = true
                } else if(item === 'diag'){
                    this.phy_status = true
                } else if(item === 'phy'){
                    this.phy_status = true
                    if(value === 'treatment') {
                        // this.phy_empty_fields = false
                        this.pex_status = true
                        this.treatment_recommendation = data
                    }

                    if(value === 'dr_notes') {
                        this.doctor_notes = data
                    }

                    if(value === 'mng') {
                        this.select_management = data
                    }

                    if(value === 'admitting') {
                        this.admitting_diagnosis = data
                    }

                    if(value === 'ill') {
                        this.history_current_illness = data
                        this.chief_empty_fields = false
                    }

                    if(value === 'chief') {
                        this.chief_empty_fields = false
                        this.chief_complaint = data
                    }

                    this.physician_diagnosis = {
                        ...this.physician_diagnosis,
                        history_current_illness: value === 'ill'? data : this.physician_diagnosis.history_current_illness,
                        admitting_diagnosis: value === 'admitting' ? data : this.physician_diagnosis.admitting_diagnosis,
                        select_management: value === 'mng' ? data : this.physician_diagnosis.select_management,
                        selected_icd: this.selected_icd,
                        selected_medicine: this.selected_medicine,
                        treatment_recommendation: value === 'treatment' ? data : this.physician_diagnosis.treatment_recommendation,
                        doctor_notes: value === 'dr_notes' ? data : this.physician_diagnosis.doctor_notes,
                        chief_complaint: value === 'chief' ? data : this.physician_diagnosis.chief_complaint
                    }

                    sessionStorage.setItem('7nVooi3FUfd', this.$crypto.AES.encrypt(JSON.stringify(this.physician_diagnosis), 'EMX246'))                    
                } else if(item === 'referral'){
                    this.referral_status = true
                }
               
                sessionStorage.setItem('uhosg2', this.$crypto.AES.encrypt(JSON.stringify(this.plan_data), 'EMX247'))
                this.leave_approval = true
            }
        },

        // LEAVE PAGE
        leavePage(){
            this.leave_approval = false
            sessionStorage.clear();
            let route = this.emr_params.from_component === 'p_queue_list' ? '/patient-queue-list' : this.emr_params.from_component === 't_queue_list' ? '/teleconsult-patients-list' : '/patient-transaction-record'
            this.$router.push(route)
        },

        // CONFIRM GO TO PATIENT LIST
        confirmGoToPatientList(){
            if( this.pat_status || this.medh_status  || this.obgy_status || this.vac_status || this.cov_status || this.pex_status || this.diet_status || this.plan_status || this.phy_status || this.referral_status){
                if (this.referral_status){
                    this.alert = { display: true, type: 'standard', width: '420', icon: 'mdi-help-circle', color: 'primary', title: 'Data you have entered will not be saved and referral will be void.', body: 'Are you sure you want to leave?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'leavePage', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
                } else if(this.leave_approval){
                    this.alert = { display: true, type: 'standard', width: '420', icon: 'mdi-help-circle', color: 'primary', title: 'Data you have entered will not be saved', body: 'Are you sure you want to leave?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'leavePage', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
                } else {
                    sessionStorage.clear();
                
                    this.$router.push(this.emr_params.from_component === 'p_queue_list' ? '/patient-queue-list' : this.emr_params.from_component === 't_queue_list' ? '/teleconsult-patients-list' : '/patient-transaction-record')
                }
            } else {
                sessionStorage.clear();
                
                this.$router.push(this.emr_params.from_component === 'p_queue_list' ? '/patient-queue-list' : this.emr_params.from_component === 't_queue_list' ? '/teleconsult-patients-list' : '/patient-transaction-record')
            } 
        },

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if ((event.which < 48 || event.which > 57) && event.which !== 45){
                event.preventDefault();
            }
        },

        async viewTBDots() {
            await this.getCloseContactTB()

            const signs_and_symptoms = this.signs_and_symptoms.data.map(element => {
                let durationText = element.duration;

                if (element.duration.includes('Custom')) {
                    if (element.custom_duration_input) {
                        durationText = `${element.custom_duration_input} days`;
                    } else {
                        durationText = 'Custom';
                    }
                }

                return `${element.symptom}, ${durationText}`;
            });
            
            let risk_factors = []
            const past_history = this.medical_history.past_medical_history.map(element => element.description)
            const social_history = this.medical_history.patient_social_history.map(element => element.social_history)
            
            if (past_history.includes('TUBERCULOSIS')) risk_factors.push('Previous TB Treatment')
            if (this.patient_info.mem_age >= 60) risk_factors.push('Elderly')
            if (this.patient_info.indigenous === 1) risk_factors.push('Indigent')
            
            risk_factors.push(...past_history)
            risk_factors.push(...social_history)

            risk_factors = risk_factors.map(element => {
                if (element.substring(0, 7) === 'Others:') {
                    element = element.substring(8)
                } else if (element.substring(0, 9) === 'Personal-') {
                    element = element.substring(9)
                }

                return element
            })

            // For Assessment
            const filtered_icd = this.selected_icd.filter(element => {
                const category = element.icd_category.selected.category_description 
                return category === 'Presumptive DSTB' || category === 'Presumptive DRTB' || category === 'Not TB'
            })
            
            const assessment = filtered_icd.map(element => `${element.icd_code} / ${element.icd_description}`)
            
            // For Recommended Actions
            const recommended_actions = []
    
            for (let icd_index = 0; icd_index < filtered_icd.length; icd_index++) {
                const icd = filtered_icd[icd_index];
                
                for (let cpt_index = 0; cpt_index < icd.procedures.length; cpt_index++) {
                    const cpt = icd.procedures[cpt_index].cpt_code + ' / ' + icd.procedures[cpt_index].cpt_description
                    
                    if (!recommended_actions.includes(cpt)) {
                        recommended_actions.push(cpt)
                    }
                }
            }
    
            const data = {
                editable: this.emr_params.editable,
                patient_name : this.combineString([this.patient_info.mem_first_name, this.patient_info.mem_middle_name, this.patient_info.mem_last_name, this.patient_info.mem_suffix]),
                date_today: this.dateToday('MM-DD-YYYY'),
                address: this.combineString([this.patient_info.mem_home_bldgno, this.patient_info.mem_home_bgy, this.patient_info.mem_home_city_municipality, this.patient_info.mem_home_province, this.patient_info.mem_home_zip]),
                age: this.getAge(this.patient_info.mem_birthdate),

                signs_and_symptoms: signs_and_symptoms,
                risk_factors: risk_factors,
                close_contact_tb: this.close_contact_tb.value,
                assessment: assessment,
                recommended_actions: recommended_actions
            }

            this.$refs.tb_dots.openTBDots(data);
        },


        async getClinicalAbstract(transaction_number) {
            this.$refs.clinical_abstract.openClinicalAbstract(
                transaction_number, 
                {
                    admitting_diagnosis: this.admitting_diagnosis || '',
                    0: {
                        icd_code: this.selected_icd?.[0]?.icd_code || '',
                        icd_description: this.selected_icd?.[0]?.icd_description || '',
                        procedure_list: this.selected_icd?.[0]?.procedures || [],
                        selected_medicine: this.selected_medicine || [],
                        doctor_notes: this.doctor_notes || null
                    }
                },
                true,
                this.pex_data
            );
        },

        viewClinicalAbstract() {
            this.getClinicalAbstract(this.emr_params.transaction_number);
        },


        viewTreatmentPlan() {
            const data = {
                patient_name: this.combineString([this.patient_info.mem_first_name, this.patient_info.mem_middle_name, this.patient_info.mem_last_name, this.patient_info.mem_suffix]),
                date_admitted: this.date_admitted,
                patient_address: this.combineString([this.patient_info.mem_home_bldgno, this.patient_info.mem_home_bgy, this.patient_info.mem_home_city_municipality, this.patient_info.mem_home_province, this.patient_info.mem_home_zip]),
                patient_age: this.patient_info.mem_age,
                patient_sex: this.patient_info.mem_gender,
                selected_icd: this.selected_icd,
                selected_medicine: this.selected_medicine,
                doctor_name: this.combineString([this.doctor_data.first_name, this.doctor_data.middle_name, this.doctor_data.last_name, this.doctor_data.suffix]),
                doctor_prc_license: this.doctor_data.doc_prc_license,
                doctor_position: this.doctor_data.doctor_position,
                doctor_specialization: this.doctor_data.specialization
            }

            this.$refs.treatment_plan.openDialog(data);
        },

        viewMedicalCertificate() {
            const impression_diagnosis = []
            const laboratory_request = []

            this.selected_icd?.forEach(icd => {
                if (icd.icd_code) {
                    impression_diagnosis.push({icd_code: icd.icd_code, icd_description: icd.icd_description})

                    icd.procedures.forEach(cpt => {
                        laboratory_request.push(`${cpt.cpt_code} / ${cpt.cpt_description_long}  ${cpt.modifier.mod_description ? ' - ' + cpt.modifier.mod_description : '' }`)
                    })
                }
            })

            let edit_fields_signed = sessionStorage.getItem('imcb2hxgx5') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('imcb2hxgx5'), 'NSH153').toString(this.$crypto.enc.Utf8)) : []

            const data = {
                date_admitted: this.date_admitted,
                patient_name: this.combineString([this.patient_info.mem_first_name, this.patient_info.mem_middle_name, this.patient_info.mem_last_name, this.patient_info.mem_suffix]),
                patient_age: this.patient_info.mem_age,
                patient_gender: this.patient_info.mem_gender,
                patient_civil_status: this.patient_info.mem_civil_status,
                address: this.combineString([this.patient_info.mem_home_bldgno, this.patient_info.mem_home_bgy, this.patient_info.mem_home_city_municipality, this.patient_info.mem_home_province, this.patient_info.mem_home_zip]),
                impression_diagnosis: impression_diagnosis,
                laboratory_request: laboratory_request,
                selected_medicine: this.selected_medicine,
                doctor_name: this.combineString([this.doctor_data.first_name, this.doctor_data.middle_name, this.doctor_data.last_name, this.doctor_data.suffix]),
                doctor_name2: this.combineString([this.doctor_data.first_name, this.doctor_data.middle_name.slice(0, 1), this.doctor_data.last_name, this.doctor_data.suffix]),
                doctor_specialization: this.doctor_data.specialization,
                doctor_position: this.doctor_data.doctor_position ? this.doctor_data.doctor_position : '',
                doctor_prc_license: this.doctor_data.doc_prc_license,
                chief_complaint: this.chief_complaint,
                ek_lgu_id: this.patient_info.ek_lgu_id,
                input_undersigned_field: edit_fields_signed.input_undersigned_field,
                input_remarks_field: edit_fields_signed.input_remarks_field,
                input_due_field: edit_fields_signed.input_due_field,
                input_diagnose_field: edit_fields_signed.input_diagnose_field
            }
            
            this.$refs.medical_certificate.openMedicalCertificate(data);
        },

        viewGenderVerification(){
            const impression_diagnosis = []
            const laboratory_request = []

            const data = {
                date_admitted: this.date_admitted,
                patient_name: this.combineString([this.patient_info.mem_first_name, this.patient_info.mem_middle_name, this.patient_info.mem_last_name, this.patient_info.mem_suffix]),
                patient_age: this.patient_info.mem_age,
                patient_gender: this.patient_info.mem_gender,
                patient_civil_status: this.patient_info.mem_civil_status,
                address: this.combineString([this.patient_info.mem_home_bldgno, this.patient_info.mem_home_bgy, this.patient_info.mem_home_city_municipality, this.patient_info.mem_home_province, this.patient_info.mem_home_zip]),
                impression_diagnosis: impression_diagnosis,
                laboratory_request: laboratory_request,
                selected_medicine: this.selected_medicine,
                doctor_name: this.combineString([this.doctor_data.first_name, this.doctor_data.middle_name, this.doctor_data.last_name, this.doctor_data.suffix]),
                doctor_name2: this.combineString([this.doctor_data.first_name, this.doctor_data.middle_name.slice(0, 1), this.doctor_data.last_name, this.doctor_data.suffix]),
                doctor_specialization: this.doctor_data.specialization,
                doctor_position: this.doctor_data.doctor_position ? this.doctor_data.doctor_position : '',
                doctor_prc_license: this.doctor_data.doc_prc_license,
                chief_complaint: this.chief_complaint,
                ek_lgu_id: this.patient_info.ek_lgu_id,
            }
            
            this.$refs.gender_verification.openGenderVerification(data);
        },

        viewCertificateOfDisability() {
            const impression_diagnosis = []
            const laboratory_request = []

            this.selected_icd?.forEach(icd => {
                if (icd.icd_code) {
                    impression_diagnosis.push({icd_code: icd.icd_code, icd_description: icd.icd_description})

                    icd.procedures.forEach(cpt => {
                        laboratory_request.push(`${cpt.cpt_code} / ${cpt.cpt_description_long}  ${cpt.modifier.mod_description ? ' - ' + cpt.modifier.mod_description : '' }`)
                    })
                }
            })


            const data = {
                date_admitted: this.date_admitted,
                patient_name: this.combineString([this.patient_info.mem_first_name, this.patient_info.mem_middle_name, this.patient_info.mem_last_name, this.patient_info.mem_suffix]),
                patient_age: this.patient_info.mem_age,
                patient_gender: this.patient_info.mem_gender,
                patient_civil_status: this.patient_info.mem_civil_status,
                address: this.combineString([this.patient_info.mem_home_bldgno, this.patient_info.mem_home_bgy, this.patient_info.mem_home_city_municipality, this.patient_info.mem_home_province, this.patient_info.mem_home_zip]),
                impression_diagnosis: impression_diagnosis,
                laboratory_request: laboratory_request,
                selected_medicine: this.selected_medicine,
                doctor_name: this.combineString([this.doctor_data.first_name, this.doctor_data.middle_name, this.doctor_data.last_name, this.doctor_data.suffix]),
                doctor_name2: this.combineString([this.doctor_data.first_name, this.doctor_data.middle_name.slice(0, 1), this.doctor_data.last_name, this.doctor_data.suffix]),
                doctor_specialization: this.doctor_data.specialization,
                doctor_position: this.doctor_data.doctor_position ? this.doctor_data.doctor_position : '',
                doctor_prc_license: this.doctor_data.doc_prc_license,
                chief_complaint: this.chief_complaint,
                ek_lgu_id: this.patient_info.ek_lgu_id,
            }
            
            this.$refs.disability_certificate.openMedicalCertificate(data);
        },

        viewFollowUpForm() {
            const data = {
                patient_name: this.combineString([this.patient_info.mem_first_name, this.patient_info.mem_middle_name, this.patient_info.mem_last_name, this.patient_info.mem_suffix]),
                date_admitted: this.date_admitted,
                patient_address: this.combineString([this.patient_info.mem_home_bldgno, this.patient_info.mem_home_bgy, this.patient_info.mem_home_city_municipality, this.patient_info.mem_home_province, this.patient_info.mem_home_zip]),
                patient_age: this.patient_info.mem_age,
                selected_icd: this.selected_icd,
                selected_medicine: this.selected_medicine,
                doctor_name: this.combineString([this.doctor_data.first_name, this.doctor_data.middle_name, this.doctor_data.last_name, this.doctor_data.suffix]),
                doctor_name2: this.combineString([this.doctor_data.first_name, this.doctor_data.middle_name.slice(0, 1), this.doctor_data.last_name, this.doctor_data.suffix]),
                doctor_prc_license: this.doctor_data.doc_prc_license,
                chief_complaint: this.chief_complaint,
                doctor_position: this.doctor_data.doctor_position ? this.doctor_data.doctor_position : '',
                follow_up_consultation_date: this.plan_data.follow_up_consultation_date,
                patient_mem_birthdate: this.patient_info.mem_birthdate
            }

            this.$refs.follow_up_form.openFollowUpForm(data);
        }
    },

    beforeRouteLeave(to, from, next){
        if(sessionStorage.getItem('PIX235')){
            if(this.leave_approval && this.pat_status || this.medh_status  || this.obgy_status || this.vac_status || this.cov_status || this.pex_status || this.diet_status || this.plan_status || this.phy_status || this.referral_status){
                if(this.referral_status){
                    this.alert = { display: true, type: 'standard', width: '420', icon: 'mdi-help-circle', color: 'primary', title: 'Data you have entered will not be saved and referral will be void.', body: 'Are you sure you want to leave?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'leavePage', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
                }
                else{
                    this.alert = { display: true, type: 'standard', width: '420', icon: 'mdi-help-circle', color: 'primary', title: 'Data you have entered will not be saved', body: 'Are you sure you want to leave?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'leavePage', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
                }
                
                next(false)
            }else{
                next()
            }
        }else{
            next()
        }
    }
}
</script>

<style scoped>
::v-deep .v-tabs-bar{
    border-radius: inherit !important;
    height: 40px !important;
}
::v-deep .expand-icon .v-expansion-panel-header__icon .v-icon {
    color: #1976D2 !important;
    font-size: 20pt;
}
.card-border{ box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important; }
.tabs-border{ border: 1px solid rgb(214 214 214); }
.non-active-tab{
    background-color: #eeeeee !important;
    border-color: #eeeeee !important;
    border-top-left-radius: 5px; 
    border-top-right-radius: 15px;
    margin-right: 0.25em;
}
.active-tab{
    background-color: #1976D2 !important;
    border-color: #1976D2 !important;
    border-top-left-radius: 5px; 
    border-top-right-radius: 100px;
    color: white !important;
    margin-right: 0.25em;
}
#table{ width: 100%; }
th{ border: 0; }
td{
    border: 0px;  
    cursor: default;
    padding: 15px 3px 0;
    text-align: left;  
    vertical-align: bottom !important;
}
.divider{ margin: 25px 0 21px 0; }
.input--margin{ margin-top: 10px; }
.input--border{
    border-bottom: 1px solid grey;
    margin: 18px 0 0 8px;
    width: 100%;
}
.contact-prefix{ padding-top: 7px; }
.medicine--table{ 
    margin-top: 15px;
    overflow-x: auto; 
}
.medicine--header{
    min-width: 1410px;
    text-align: center;
}
.medicine--header h4{
    font-size: 14px;
    margin: 0 4px;
    width: 200px;
}
.medicine--body{
    border-bottom: 1px solid grey;
    font-size: 14px;
    margin: 0 4px;
    padding: 8px 0 4px 0;
    width: 200px;
}
.return-slip{
    border-top: 1px solid rgb(218, 218, 218);
    margin-top: 25px;
    opacity: 0.6;
}
.return-slip h4{
    border-bottom: 2px dashed black;
}

.print-pat-info{
    border-bottom: 1px solid grey; 
    margin: 14px 0 0 4px; 
    padding: 2px 0 0 0; 
    width: 100%;
}
.print-med-tbl-main{ overflow-x: auto; }
.print-med-tbl-main .d-flex{
    width: 100%;
    padding: 0;
    margin: 0; 
}
.print-med-tbl-h{
    font-size: 14px;
    width: 250px;
}
.print-med-tbl-b{
    font-size: 14px;
    padding: 2px 0 0 2px;
    width: 100%;
    text-align: center;
}
.print-border-bottom{ background: grey !important; }

@media print{    
    body *{
        background: white;
        position: relative;
    }
    #not-for-print{ display: none; }
    #for-print-absolute{
        left: 0;
        position: absolute !important; 
        top: 0;
    }
    #for-print-relative-treatment{ padding: 0 !important; margin-top: 4% !important};
    #for-print-relative{ padding: 30px !important; };
    .print-med-tbl-main{ overflow-x: hidden; }   
    .print-med-tbl-h, .print-med-tbl-b{
        max-width: 132px;
        min-width: 132px;
        width: 100%;
        padding: 2px 2px 0 0;
    }
  
}
::v-deep .select-place-holder input::placeholder {
  color: rgb(76, 76, 76) !important;
  opacity: 1;
}

::v-deep .custom-color .v-input--selection-controls__input div {
  color: #4686a5ff;
}

#list-546 {
    width: 710px !important;
}
</style>