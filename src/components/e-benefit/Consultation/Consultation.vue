<template>
  <v-container  fluid  id="main-container" class="ma-0 pa-0">
    <div v-resize="onScreenResize" id="not-for-print">
        <!-- HEADERS -->
        <!-- <Navbar :navbar="navbar" :help_menu="help"/> -->
        <v-overlay v-if="!member_data" class="text-center" color="#ffffff" opacity="1" z-index="9">
            <v-progress-circular color="primary" size="35" indeterminate></v-progress-circular>
            <h4 class="light-blue--text text--darken-4 pl-5 pt-3">Loading... Please wait... </h4>
        </v-overlay>
        <div v-else class="pa-2 px-sm-4 px-md-8 mt-2">
            <NavigationDrawer 
              :navigation_drawer_item="filter_nav_drawer_item"
              :emr_params="emr_params"
              :member_data="member_data"
              :selected_medicine="selected_medicine"
              :referral_data="referral_data"
              :referral_status="referral_status"
              :selected_referral="selected_referral"
              :for_tele_consult="for_tele_consult"
              :consultation_required="consultation_required" 
              :medical_history_allergy_required="medical_history_allergy_required"
              :medical_history_family_allergy_required="medical_history_family_allergy_required"
              :treatment_recommendation_error="treatment_recommendation_error"
              :physical_tab_has_pending="physical_tab_has_pending" 
              :ob_required="ob_required"
              :immunization_required="immunization_required"
              :med_quantity_has_data="med_quantity_has_data"
              :referral_empty_fields="referral_empty_fields"
              :off_required="off_required"
              :pex_required_fields="pex_required_fields"
              :medical_history_required="medical_history_required"
              :submit_to_doctor_midwife="submit_to_doctor_midwife"
              :specialization="specialization"
              @logout="logout"
              @viewPrintableForm="viewPrintableForm"
              @viewTBDots="viewTBDots"
              @goToEligibility="redirect('/eligibility')"
              @viewClinicalAbstract="viewClinicalAbstract"
              @openTeleConsult="openTeleConsult"
              @validateEndTransaction="validateEndTransaction"
              @openReferralForm="openReferralForm"
              @submit="submit"
            />

            <v-divider> </v-divider>

            <!-- WITH UPDATES FOR EDIT TRANSACTION -->
            <v-card v-show="($route.params.page === 'consultation' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="elevation-1 pa-7 mt-4" outlined>
              <ConsultationGen
                :required_fields="required_fields"
                :doctor_loader="doctor_loader"
                :process_type="process_type"
                :doctor_data="doctor_data"
                :member_data="member_data"
                :trans_data="trans_data"
                :action="action"
                :purpose_of_visit_items="purpose_of_visit_items"
                :doctor_list="doctorList"
                :emr_params="emr_params"
                :signs_and_symptoms="signs_and_symptoms"
                :for_tele_consult="for_tele_consult"
                :consultation_data_required="consultation_data_required"
                :consultation_data_required_ill="consultation_data_required_ill"
                :consultation_data_required_doc="consultation_data_required_doc"
                :eligible_data="eligible_data"
                :selected_transaction="selected_transaction"
                :from_migration="from_migration"
                @get-service-availed="getServiceAvailedData"
                @get-doctor-data="getDoctorData"
                @getSASData="getSASData"
                @getTransdata="getTransdata"
              />
            </v-card>

            <v-lazy v-model="med_hist_active" :options="{ threshold: .5 }" :min-height="page_min_height" transition="fade-transition">
              <v-sheet class="mt-6">
                <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium"> MEDICAL HISTORY</h4>
                <!-- WITH UPDATES FOR EDIT TRANSACTION -->
                <MedicalHistory 
                  v-show="($route.params.page === 'medical-history' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                  :emr_params="emr_params"
                  :loading_medicine="loading_medicine"
                  :medicine_list="medicine_items"
                  :social_history_empty_field="social_history_empty_field"
                  :past_medical_history_empty_field="past_medical_history_empty_field"
                  :patient_birthdate="member_data.member.mem_birthdate"
                  :eligible_data="eligible_data"
                  :selected_transaction="selected_transaction"
                  :from_migration="from_migration"
                  @mutationStatus="getMedicalHistory"
                  @loadingComplete="getMedicalHistory"
                  @allergyStatus="updateAllergyStatus"
                  @familyAllergyStatus="updateFamilyAllergyStatus"
                />
              </v-sheet>
            </v-lazy>

            <v-lazy v-model="phy_active" :options="{ threshold: .5 }" :min-height="page_min_height" transition="fade-transition">
              <v-sheet class="mt-6">
                <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium"> PHYSICAL EXAMINATION </h4> 
                <!-- WITH UPDATES FOR EDIT TRANSACTION -->
                <PhysicalExamination 
                  v-show="($route.params.page === 'physical-examination' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                  :emr_params="emr_params"
                  :patient_age="parseInt(member_data.member.mem_age)" 
                  :patient_birthdate="member_data.member.mem_birthdate" 
                  :patient_gender="member_data.member.mem_gender"
                  :member_data="member_data"
                  :eligible_data="eligible_data"
                  :selected_referral="selected_referral"
                  :selected_transaction="selected_transaction"
                  :from_migration="from_migration"
                  ref="physical_examination"
                  class="d-print-none"
                  @mutationStatus="mutationStatus"
                />
              </v-sheet>
            </v-lazy>

            <v-lazy v-if="ob_active" v-model="ob_active" :options="{ threshold: .5 }" :min-height="page_min_height" transition="fade-transition">
              <v-sheet class="mt-6">
                <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium"> OB-GYNE </h4> 
                <div v-show="($route.params.page === 'obgyne-history' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'">
                  <!-- WITH UPDATES FOR EDIT TRANSACTION -->
                  <ObGyneHistory 
                    :emr_params="emr_params"
                    :patient_birthdate="member_data.member.mem_birthdate" 
                    :required_fields="required_fields"
                    :from_migration="from_migration"
                    ref="ob"
                    @mutationStatus="mutationStatus"
                  />
                </div>
              </v-sheet>
            </v-lazy>

            <v-lazy v-if="imm_active" v-model="imm_active" :options="{ threshold: .5 }" :min-height="page_min_height" transition="fade-transition">
              <v-sheet class="mt-6">
                <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium"> IMMUNIZATION </h4> 
                <div v-show="($route.params.page === 'immunization-records' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'">
                  <v-tabs v-model="tab" class="mt-7" active-class="active-tab" mobile-breakpoint="0" show-arrows hide-slider outlined>
                    <v-tab class="non-active-tab">
                        <v-badge v-if="vac_has_empty" content="!" color="red" inline>VACCINATION RECORD</v-badge>
                        <span v-else>VACCINATION RECORD</span>
                    </v-tab>

                    <v-tab class="non-active-tab">
                      <v-badge v-if="this.cov_empty_fields" content="!" color="red" inline>COVID VACCINATION</v-badge>
                      <span v-else>COVID VACCINATION</span>
                    </v-tab>
                  </v-tabs>
                    
                  <v-tabs-items v-model="tab" touchless>
                      <v-expansion-panels v-model="panel" multiple>
                          <v-expansion-panel class="tabs-border">
                            <v-tab-item >
                                  <v-expansion-panel-header>
                                      <h4 class="body-1 font-weight-medium">Vaccination Record <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Rekord ng pagbabakuna)</span></h4>
                                  </v-expansion-panel-header>

                                  <v-expansion-panel-content>
                                      <VaccinationRecord 
                                        :emr_params="emr_params"
                                        :vac_has_empty="vac_has_empty"
                                        :loading_vaccinator="loading_vaccinator" 
                                        :loading_vaccination="loading_vaccination"
                                        :vaccinator_items="vaccinator_items" 
                                        :patient_birthdate="member_data.member.mem_birthdate" 
                                        :patient_age="parseInt(member_data.member.mem_age)" 
                                        :from_migration="from_migration"
                                        ref="vaccination_record"
                                        @mutationStatus="mutationStatus" 
                                      />
                                  </v-expansion-panel-content>
                              </v-tab-item>
                              
                              <v-tab-item>
                                  <v-expansion-panel-header>
                                      <h4 class="body-1 font-weight-medium">Covid Vaccination <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pagbabakuna sa covid)</span></h4>
                                  </v-expansion-panel-header>

                                  <v-expansion-panel-content>
                                      <CovidVaccination ref="covid" :emr_params="emr_params" :loading_vaccinator="loading_vaccinator" :vaccinator_items="vaccinator_items" :cov_empty_fields="cov_empty_fields" :patient_birthdate="member_data.member.mem_birthdate" :from_migration="from_migration" @noEmptyFields="cov_empty_fields = false" @mutationStatus="mutationStatus"/>
                                  </v-expansion-panel-content>
                              </v-tab-item>
                          </v-expansion-panel>
                      </v-expansion-panels>
                  </v-tabs-items>
                </div>
              </v-sheet>
            </v-lazy>

            <v-lazy v-model="med_rec_active" :options="{ threshold: .5 }" :min-height="page_min_height" transition="fade-transition">
              <v-sheet class="mt-6">
                <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium"> MEDICAL RECORDS </h4> 
                <MedicalRecords 
                  v-if="($route.params.page === 'medical-record' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                  :emr_params="emr_params" 
                  :patient_info="member_data.member"
                  :eligible_data="eligible_data"
                />
              </v-sheet>
            </v-lazy>

            <v-lazy v-model="physician_active" :options="{ threshold: .5 }" :min-height="page_min_height" transition="fade-transition">
              <!-- WITH UPDATES FOR EDIT TRANSACTION -->
              <v-sheet class="mt-6">
                <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b' && $store.state.usr_credentials.user_type === '9-1'" class="text-h6 font-weight-medium">PHYSICIAN DIAGNOSIS AND TREATMENT PLAN </h4>
                <div v-if="$store.state.usr_credentials.user_type === '9-1'">       
                  <PhysicianDiagnosis 
                    v-show="($route.params.page === 'physician-diagnosis-and-treatment-plan' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                    :admitting_diagnosis="admitting_diagnosis"
                    :selected_icd="selected_icd"
                    :emr_params="emr_params"
                    :icd_items="icd_items"
                    :selected_cpt_holder="selected_cpt_holder"
                    :filter_physician_recommend="filter_physician_recommend"
                    :filter_patient_remarks="filter_patient_remarks"
                    :select_patient_remarks="select_patient_remarks"
                    :physician_recommendation="physician_recommendation"
                    :patient_remarks="patient_remarks"
                    :select_physician_recommendation="select_physician_recommendation"
                    :selected_cpt = "selected_cpt"
                    :select_cpt_modifier="select_cpt_modifier"
                    :loading_modifier="loading_modifier"
                    :medicine_items="medicine_items"
                    :selected_medicine="selected_medicine"
                    :loading_medicine="loading_medicine"
                    :loading_otc_medicine="loading_otc_medicine"
                    :_filter="selected_medicine_filter"
                    :selected_medicine_holder="selected_medicine_holder"
                    :other_med="other_med"
                    :cpt_items="cpt_items"
                    :select_management="select_management"
                    :management_items="management_items"
                    :doctor_notes="trans_data.operator_notes"
                    :plan_data="plan_data"
                    :treatment_recommendation_error="treatment_recommendation_error"
                    :treatment_recommendation="treatment_recommendation"
                    :doctor_data="doctor_data"
                    :acknowledgement_referral_code="this.selected_referral"
                    :offline_date_admitted="offline_date_admitted"
                    :offline_date_discharge="offline_date_discharge"
                    :required_fields="required_fields"
                    :med_required_error="med_empty_fields"
                    :offline_required_fields="offline_required_fields"
                    :visit_data="trans_data"
                    :search_icd_items="search_icd_items"
                    :search_cpt_items="search_cpt_items"
                    :is_item_disabled="is_item_disabled"
                    :switch_add_package_procedure="switch_add_package_procedure"
                    :selected_package_procedure.sync="selected_package_procedure" 
                    :is_edit="is_edit"
                    :selected_transaction="selected_transaction"
                    :from_migration="from_migration"
                    :from_migration_procedure_result="from_migration_procedure_result"
                    :procedure_result_required="procedure_result_required"
                    @update:selected_package_procedure="addPackageProcedures"
                    @update:selected_cpt_for_new_package="addNewPackageProcedures"
                    @addProcedure="addProcedure"
                    @addDiagnosisField="addDiagnosisField"
                    @addDrugsMedicine="addDrugsMedicine"
                    @saveOthersMed="saveOthersMed"
                    @mutationStatus="mutationStatus"
                    @addDiagnosisData="addDiagnosisData"
                    @removeAddedDrugsMedicine="removeAddedDrugsMedicine"
                    @removeDiagnosis="removeDiagnosis"
                    @removeProcedure="removeProcedure"
                    @showLongDesc="showLongDesc"
                    @selectedManagement="selectedManagement"
                    @viewFollowUpForm="viewFollowUpForm"
                    @loadMore="loadMore"
                    @searchItems="searchItems"
                    @viewProcedure="viewProcedure"
                  />
                </div>
              </v-sheet>
            </v-lazy>

            <v-lazy v-model="diagnostic_active" :options="{ threshold: .5 }" :min-height="page_min_height" transition="fade-transition">
              <v-sheet class="mt-6">
                <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium">DIAGNOSTIC EXAM RESULT </h4>

                <DiagnosticExamResult 
                  v-if="($route.params.page === 'diagnostic-exam-result' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'"
                  ref="diagnostic_exam_results"
                  :emr_params="emr_params"
                  :diabetes_mellitus="diabetes_mellitus"
                  :patient_info="member_data.member"
                  :doctor_info ="{ doctor_name: doctor_data.first_name + ' ' + doctor_data.middle_name + ' ' + doctor_data.last_name + ' ' + doctor_data.suffix, doc_tin: doctor_data.doc_prc_license }"
                  @getDiagnosticExam="getDiagnosticExam"
                />
              </v-sheet>
            </v-lazy>

            <v-dialog v-model="laboratory_dialog">
              <!-- <LaboratoryProcedure
                ref="laboratory_procedure_form"
                :is_edit="is_edit"
                :cpt="selected_cpt_for_lab"
                :procedure_items="procedure_items"
                @getDiagnosticExam="getDiagnosticExam"
                @closeViewCPT="laboratory_dialog = false"
              /> -->


            </v-dialog>
            <div v-show="laboratory_dialog"> 
              <DiagnosticExamResult 
                ref="diagnostic_exam_results"
                :emr_params="emr_params"
                :diabetes_mellitus="diabetes_mellitus"
                :patient_info="member_data.member"
                :is_edit="is_edit"
                @getDiagnosticExam="getDiagnosticExam"
              />
            </div>

            <v-lazy v-model="ncdqans_active" :options="{ threshold: .5 }" :min-height="page_min_height" transition="fade-transition">
              <v-sheet v-if="calculateAge(member_data.member.mem_birthdate) >= 20" class="mt-6">
                <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium pb-2"> NCD QUESTIONNAIRE</h4>
                <div v-show="($route.params.page === 'ncdqans' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="mt-4">
                  <!-- WITH UPDATES FOR EDIT TRANSACTION -->
                  <Ncdqans 
                    :ncdqans="ncdqans" 
                    :dietary_information="dietary_information" 
                    :editable="emr_params.editable" 
                    :loading_ncdqans="loading_ncdqans"
                    :patient_name="member_data.member.p_name"
                    :patient_info="member_data.member"
                    :family_medical_history="medical_history.family_medical_history.value"
                    :patient_social_history="medical_history.patient_social_history.value"
                    :pex_data="{
                      ...pex_data,
                      ...{
                        bp_systolic: pex_data.bp_systolic,
                        bp_diastolic: pex_data.bp_diastolic,
                        bp_2nd_systolic: pex_data.bp_2nd_systolic,
                        bp_2nd_diastolic: pex_data.bp_2nd_diastolic,
                      }, 
                      ...{
                        bmi_computation: { bmi: patient_record.bmi }
                      }
                    }"
                    :selected_transaction="selected_transaction"
                    :from_migration="from_migration"
                  />
                </div>
              </v-sheet>
            </v-lazy>
            
            <v-lazy v-model="drugs_and_med_active" :options="{ threshold: .5 }" :min-height="page_min_height" transition="fade-transition">
              <v-sheet class="mt-6">
                <h4 v-if="$store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="text-h6 font-weight-medium pb-2"> DRUGS AND MEDICINE/PLAN/NOTES</h4>
                <div v-show="($route.params.page === 'drugs-medicine-and-plan' && $store.state.usr_credentials.user_settings.user_layout === 'type_a') || $store.state.usr_credentials.user_settings.user_layout === 'type_b'" >
                  <!-- DRUGS AND MEDICINE -->
                  <v-card class=" my-5 py-7 px-6">
                    <div class="d-flex justify-space-between align-center"> 
                      <v-card-title class="pa-0 mb-5 body-1 font-weight-medium grey--text text--darken-4">Drugs / Medicine <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pumili ng gamot)</span>
                        <v-tooltip bottom color="primary">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon color="primary" dark v-bind="attrs" v-on="on" class="mb-1 ml-1"> mdi-information-outline</v-icon>
                          </template>
                          <span>For other medicine. Use Drug and Medicines not needed during this particular episode of care.</span>
                        </v-tooltip>
                      </v-card-title>

                      <div class="d-flex justify-start align-center"> 
                          <div class="d-flex align-center"> 
                              <div class="box green"> </div>
                              <h6 class="body-2 ml-2 mr-4"> Good </h6>
                          </div>
                          <div class="d-flex align-center"> 
                              <div class="box yellow"> </div>
                              <h6 class="body-2 ml-2 mr-4"> Fair </h6>
                          </div>
                          <div class="d-flex align-center"> 
                              <div class="box red"> </div>
                              <h6 class="body-2 ml-2"> Critical </h6>
                          </div>
                      </div>
                    </div>
                    
                    <!-- <v-autocomplete :value="selected_medicine_holder" :items="medicine_items" :disabled="from_migration" :loading="loading_medicine" :item-text="(item) => `${item.generic_name_text} (${item.other_med_group})`"  class="body-2" prepend-inner-icon="mdi-magnify" placeholder="Search for Generic / Brand Name" return-object hide-no-data hide-selected hide-details outlined dense> -->
                     <v-autocomplete :value="selected_medicine_holder" :loading="loading_medicine" :items="medicine_items" :disabled="from_migration" item-text="medicine_text" class="body-2" prepend-inner-icon="mdi-magnify" placeholder="Search for Generic / Brand Name" return-object hide-no-data hide-selected hide-details outlined dense>
                      <template v-slot:item="{ item }">
                          <v-layout @click="addDrugsMedicine(item)">
                              <v-list-item-avatar v-if="$vuetify.breakpoint.smAndUp" color="indigo" class="font-weight-light white--text">{{ item.otc_medicine_code.replace('OTC-', '') }}</v-list-item-avatar>
                              <v-row class="pt-3" dense>
                                  <v-col cols="12" sm="12" md="5" lg="7" xl="7">
                                      <v-row dense>
                                          <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                              <h6 class="body-2 font-weight-regular">Generic Name:</h6>
                                          </v-col>
                                          <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                              <h6 class="body-2 font-weight-regular">{{ item.generic_name }}</h6>
                                          </v-col>
                                      </v-row>
                                  </v-col>
                                  <v-col cols="12" sm="12" md="7" lg="5" xl="5">
                                      <v-row dense>
                                          <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                              <h6 class="body-2 font-weight-regular">Preparation:</h6>
                                          </v-col>
                                          <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                              <h6 class="body-2 font-weight-regular">{{ item.preparation }}</h6>
                                          </v-col>
                                      </v-row>
                                  </v-col>

                                  <v-col cols="12" sm="12" md="5" lg="7">
                                      <v-row dense>
                                          <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                              <h6 class="body-2 font-weight-regular">Route:</h6>
                                          </v-col>
                                          <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                              <h6 class="body-2 font-weight-regular">{{ item.route }}</h6>
                                          </v-col>
                                      </v-row>
                                  </v-col>

                                  <v-col cols="12" sm="12" md="7" lg="5" xl="5">
                                      <v-row dense>
                                          <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                              <h6 class="body-2 font-weight-regular">Dosage:</h6>
                                          </v-col>
                                          <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                              <h6 class="body-2 font-weight-regular">{{ item.dosage }}</h6>
                                          </v-col>
                                      </v-row>
                                  </v-col>

                                  <v-col cols="12" sm="12" md="7" lg="7">
                                      <v-row dense>
                                          <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                              <h6 class="body-2 font-weight-regular">Available Stock:</h6>
                                          </v-col>
                                          <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                              <v-chip class="text-white" :color="getStockColor(item.max_stock_quantity,item.current_quantity)" small> {{ item.current_quantity }} </v-chip>
                                          </v-col>
                                      </v-row>
                                  </v-col>

                                  <v-col cols="12" sm="12" md="7" lg="5" xl="5">
                                      <v-row dense>
                                          <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                              <h6 class="body-2 font-weight-regular">Classification:</h6>
                                          </v-col>
                                          <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                              <h6 class="body-2 font-weight-regular">{{ item.other_med_group }}</h6>
                                          </v-col>
                                      </v-row>
                                  </v-col>

                                  <v-col cols="12" sm="12" md="12" lg="12">
                                      <v-divider class="mt-4"></v-divider>
                                  </v-col>
                              </v-row>
                          </v-layout>
                      </template>
                      <template v-slot:selection></template>       
                     </v-autocomplete>

                        <div v-if="selected_medicine.length > 0" :class="{'table-overflow-x' : $vuetify.breakpoint.lgAndDown}">
                            <table id="table" class="my-4" cellspacing="0" cellpadding="0">
                                <tr>
                                    <th class="font-weight-medium" style="font-size:9.5pt">Generic Name</th>
                                    <th class="font-weight-medium" style="font-size:9.5pt">Dosage</th>
                                    <th class="font-weight-medium" style="font-size:9.5pt">Preparation</th>
                                    <th class="font-weight-medium" style="font-size:9.5pt">Frequency<br>(per day)</th>
                                    <th class="font-weight-medium" style="font-size:9.5pt">Duration # of days</th>
                                    <th class="font-weight-medium" style="font-size:9.5pt">Total # of medicine</th>
                                    <th class="font-weight-medium" style="font-size:9.5pt">Total # of Dispensed Medicine</th>
                                    <th class="font-weight-medium" style="font-size:9.5pt">Unit</th>
                                    <th class="font-weight-medium" style="font-size:9.5pt">Brand Name</th>
                                    <th class="font-weight-medium" style="font-size:9.5pt">Classification</th>
                                    <th class="font-weight-medium" style="font-size:9.5pt">Remarks <span class="white--text">........</span> </th>
                                </tr>

                                <tr v-for="(med, i) in selected_medicine" :key="i">
                                    <td style="width: 15%">
                                        <v-text-field :value="med.generic_name" class="body-2" hide-details readonly></v-text-field>
                                    </td>

                                    <td style="width: 6%">
                                        <v-text-field v-model="med.dosage" :value="med.dosage" :disabled="from_migration" class="body-2" hide-details :readonly="med.otc_medicine_code !== 'OTC-0000'"></v-text-field>
                                    </td>

                                    <td style="width: 6%">
                                        <v-text-field v-model="med.preparation" :value="med.preparation" :disabled="from_migration" class="body-2" hide-details :readonly="med.otc_medicine_code !== 'OTC-0000'"></v-text-field>
                                    </td>

                                    <td style="width: 6%">
                                        <v-text-field v-model="med.frequency_of_med" @keypress="numberOnly" :disabled="from_migration" class="body-2" onpaste="return false" maxlength="2" value="0" hide-details></v-text-field>
                                    </td>

                                    <td style="width: 8%">
                                        <v-text-field v-model="med.duration" :disabled="from_migration" class="body-2" hide-details></v-text-field>
                                    </td>
                                    
                                    <td style="width: 8%">
                                        <v-text-field v-model="med.total_prescribed_medicine" :disabled="from_migration" @keypress="numberOnly" :error="required_fields && !med_quantity_has_data && !med.total_prescribed_medicine" class="body-2" onpaste="return false" maxlength="5" hide-details></v-text-field>
                                    </td>

                                    <td style="width: 8%">
                                        <v-text-field v-model="med.total_num_of_med" :disabled="from_migration" @keypress="numberOnly" :error="required_fields && !med_quantity_has_data && !med.total_num_of_med" class="body-2" onpaste="return false" maxlength="5" hide-details></v-text-field>
                                    </td>
                                    <td style="width: 8%">
                                        <v-text-field :value="med.unit_type === 'BOX' ? med.preparation : med.unit_type" :disabled="from_migration" class="body-2" hide-details readonly></v-text-field>
                                    </td> 

                                    <td v-if="!print_save_dialog" style="width: 8%">
                                        <v-text-field v-model="med.brand_name" :value="med.brand_name" :disabled="from_migration"  class="body-2" :readonly="med.otc_medicine_code !== 'OTC-0000'" hide-details></v-text-field>
                                    </td>

                                    <td style="width: 8%">
                                        <v-text-field
                                            v-model="med.pOthMedDrugGroup"
                                            :disabled="from_migration" 
                                            dense
                                            hide-details
                                            readonly
                                        ></v-text-field>
                                    </td>

                                    <td style="width: 19%">
                                        <v-text-field v-model="med.notes" class="body-2 pa-0" hide-details>
                                            <template v-if="emr_params.editable" v-slot:append-outer>
                                                <v-icon :disabled="loading_medicine || from_migration" @click="removeAddedDrugsMedicine(i)">mdi-delete</v-icon>
                                            </template>
                                        </v-text-field>
                                    </td>  
                                </tr>
                            </table>
                        </div>
                        <div class="d-flex justify-end mt-4"> 
                          <v-btn @click="viewTreatmentPlan()" :hidden="selected_medicine.length === 0" class="white--text" color="#367c9d" small> Print/Save OTC Medicine(s)<v-icon size="20" right>mdi-printer</v-icon> </v-btn>
                        </div>
                  </v-card>

                  <v-dialog v-if="other_med.dialog" v-model="other_med.dialog" width="400" persistent>
                      <v-card class="pa-5">
                          <h6 class="font-weight-regular body-2">Others</h6>
                          <v-text-field v-model="other_med.generic_name" placeholder="Enter other medicine here" hide-details outlined></v-text-field>

                          <v-row justify="end" class="mt-4" wrap dense>
                              <v-btn @click="other_med.dialog = false" small>CLOSE</v-btn>
                              <v-btn @click="saveOthersMed" :disabled="!other_med.generic_name" class="ml-2" color="primary" small>CONFIRM</v-btn>
                          </v-row>
                      </v-card>
                  </v-dialog>
                  
                    <!-- PLAN -->
                    <v-card class="  my-5 py-7 px-6" >
                      <v-card-title class="pa-0 body-1 font-weight-medium grey--text text--darken-4">Plan <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pagplano)</span></v-card-title>

                      <v-row dense>
                          <v-col class="d-flex align-baseline" cols="12" sm="6"  md="6" lg="6" xl="6">
                              <label class="body-2 grey--text text--darken-4 font-weight-medium">Diet <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Diyeta)</span></label>
                              <v-text-field v-model="plan_data.diet" :disabled="from_migration" @input="plan_data.diet = textCapitalize($event)"  class="body-2 pl-2" hide-details></v-text-field>
                          </v-col>

                          <v-col class="d-flex align-baseline" cols="12" sm="6" md="6" lg="6" xl="6">
                              <label class="body-2 grey--text text--darken-4 font-weight-medium">Fluid Intake <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pag-inom)</span></label>
                              <v-text-field v-model="plan_data.fluid_intake" :disabled="from_migration" @input="plan_data.fluid_intake = textCapitalize($event)"  class="body-2 pl-2" hide-details></v-text-field>
                          </v-col>

                          <!-- <v-col class="d-flex align-center pt-5" cols="12" sm="12" md="12" lg="12" xl="4">
                            <label class="body-2 font-weight-medium">Medical Certificate</label>
                            <v-radio-group v-model="plan_data.medical_certificate" @change="mutationStatus('plan')" class="body-2 pl-2 ma-0" hide-details row>
                                <v-radio label="Yes" value="1"></v-radio>
                                <v-radio label="No" value="0"></v-radio>
                                <template v-slot:append>
                                    <v-btn @click="viewMedicalCertificate" :disabled="plan_data.medical_certificate === '0'" class="white--text" color="#367c9d" small>
                                        Print / Save
                                        <v-icon small right>mdi-printer</v-icon>
                                    </v-btn>
                                </template>
                            </v-radio-group>
                          </v-col> -->
                      </v-row>

                      <v-row dense>
                          <v-col class="d-flex align-baseline" cols="12" sm="6">
                              <span class="body-2 font-weight-medium">Follow up Consultation</span>
                              <v-menu :close-on-content-click="false" :disabled="!emr_params.editable || from_migration" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                  <template v-slot:activator="{ on }">
                                      <v-text-field v-on="on" :value="formatDate(plan_data.follow_up_consultation_date)" :disabled="from_migration"  :clearable="emr_params.editable" @click:clear="plan_data.follow_up_consultation_date = ''" class="body-2 pl-2" prepend-icon="mdi-calendar" label="Date" hide-details></v-text-field>
                                  </template>
                                  <v-date-picker v-model="plan_data.follow_up_consultation_date" :min="date_today" no-title></v-date-picker>
                              </v-menu>
                          </v-col>
                      </v-row>
                  </v-card>

                  <!-- NOTES -->
                  <v-card class=" my-5 py-7 px-6">
                    <v-card-title class="pa-0 body-1 font-weight-medium grey--text text--darken-4">Notes <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Palatandaan)</span></v-card-title>
                    <v-textarea v-model="trans_data.operator_notes" :disabled="from_migration" @input="trans_data.operator_notes = textCapitalize($event)" placeholder="Notes" rows="4" hide-details no-resize outlined></v-textarea>
                  </v-card>
                </div>
              </v-sheet>
            </v-lazy>
        </div>
        <!-- CONFIRMATION DIALOG -->
        <v-dialog v-if="confirmation_dialog" v-model="confirmation_dialog"  width="1000px" persistent>
            <v-card>
              <v-card-title class="text-subtitle-2 text-sm-h6 justify-center light-blue darken-4 white--text">CONSULTATION CONFIRMATION</v-card-title>
            
              <v-row class="mx-3 py-2">
                  <v-col sm="6" cols="12">
                    <h4 class="body-2 font-weight-medium">Member Name</h4>
                    <v-text-field :value="member_data.member.mem_first_name + ' ' +  (member_data.member.mem_middle_name ? member_data.member.mem_middle_name : '') + ' ' + member_data.member.mem_last_name + ' ' + ( member_data.member.mem_suffix ? member_data.member.mem_suffix : '')" readonly outlined dense hide-details></v-text-field>
                  </v-col>  

                  <v-col sm="6" cols="12">
                    <h4 class="body-2 font-weight-medium">Member ID</h4>
                    <v-text-field v-if="process_type === 'LGU'" :value="member_data.member.ek_lgu_id" readonly outlined dense hide-details></v-text-field>
                    <v-text-field v-else :value="member_data.member.mem_hmo_policy_number" readonly outlined dense hide-details></v-text-field>
                  </v-col>  
              </v-row>
              
              <div class="mx-6">
                <h4 class="body-2 font-weight-medium">Chief Complaint</h4>
                <v-textarea  :value="trans_data.chief_complaint" rows="4" outlined readonly hide-details></v-textarea>

                <h4 class="body-2 font-weight-medium mt-5">Purpose of visit (Service Availed)</h4>
                <v-autocomplete v-model="trans_data.service_availed" :items="purpose_of_visit_items" readonly outlined dense hide-details multiple small-chips> </v-autocomplete>
                <v-row v-if="action === 'submit_to_doctor' || doctor_data.doctor_code" class="my-4">
                    <v-col sm="6" cols="12">
                      <h4 class="body-2 font-weight-medium">{{ for_tele_consult ? 'Tele Consult Doctor' : 'Doctor' }}</h4>
                      <v-text-field :value="doctor_data.doctor_name" readonly outlined dense hide-details></v-text-field>
                    </v-col>

                    <v-col sm="6" cols="12">
                      <h4 class="body-2 font-weight-medium">Specialization</h4>
                      <v-text-field :value="doctor_data.specialization" readonly outlined dense hide-details></v-text-field>
                    </v-col>
                </v-row>

                <template v-else>
                    <h4 class="body-2 font-weight-medium mt-4">Doctor</h4>
                    <label class="body-2 grey--text text--darken-4 font-weight-regular"><i>No Available Doctor</i></label>
                </template> 
              </div>
                
              <div v-if="action === 'end_transaction'" class="mx-6 py-2">
                <h4 class="body-2 font-weight-medium mt-2">Drugs and Medicine</h4>
                <label v-if="!selected_medicine.length" class="body-2 font-weight-regular"><i>No Available Medicine</i></label>

                <div v-else class="print-med-tbl-main py-6">
                  <div class="d-flex d-row font-weight-medium text-center">
                      <h4 class="print-med-tbl-h">Generic Name</h4>
                      <h4 class="print-med-tbl-h">Dosage</h4>
                      <h4 class="print-med-tbl-h">Preparation</h4>
                      <h4 class="print-med-tbl-h">Route</h4>
                      <h4 class="print-med-tbl-h">Frequency (per day)</h4>
                      <h4 class="print-med-tbl-h">Total No. of Prescribed Medicine</h4>
                      <h4 class="print-med-tbl-h">Total No. of Dispensed Medicine</h4>
                      <h4 class="print-med-tbl-h">Brand Name</h4>
                      <h4 class="print-med-tbl-h">Unit Type</h4>
                      <h4 class="print-med-tbl-h">Notes</h4>
                  </div>
                
                  <div v-for="(med, i) in selected_medicine" :key="i" class="d-flex d-row align-end">
                      <div class="print-med-tbl-b">
                          <span>{{ med.generic_name }}</span>
                          <v-divider class="print-border-bottom"></v-divider>
                      </div>

                      <div class="print-med-tbl-b">
                          <span>{{ med.dosage }}</span>
                          <v-divider class="print-border-bottom"></v-divider>
                      </div>

                      <div class="print-med-tbl-b">
                          <span>{{ med.preparation }}</span>
                          <v-divider class="print-border-bottom"></v-divider>
                      </div>

                      <div class="print-med-tbl-b">
                          <span>{{ med.route }}</span>
                          <v-divider class="print-border-bottom"></v-divider>
                      </div>

                      <div class="print-med-tbl-b">
                          <span>{{ med.frequency_of_med }}</span>
                          <v-divider class="print-border-bottom"></v-divider>
                      </div>

                      <div class="print-med-tbl-b">
                          <span>{{ med.total_prescribed_medicine }}</span>
                          <v-divider class="print-border-bottom"></v-divider>
                      </div>

                      <div class="print-med-tbl-b">
                          <span>{{ med.total_num_of_med }}</span>
                          <v-divider class="print-border-bottom"></v-divider>
                      </div>

                      <div class="print-med-tbl-b">
                          <span>{{ med.brand_name }}</span>
                          <v-divider class="print-border-bottom"></v-divider>
                      </div>

                      <div class="print-med-tbl-b">
                          <span>{{ med.unit_type === 'BOX' ? med.preparation : med.unit_type }}</span>
                          <v-divider class="print-border-bottom"></v-divider>
                      </div>

                      <div class="print-med-tbl-b">
                          <span>{{ med.notes }}</span>
                          <v-divider class="print-border-bottom"></v-divider>
                      </div>
                  </div>
                </div>
              </div>

              <v-divider></v-divider>

              <v-card-actions class="justify-center ">
                  <v-btn @click="confirmation_dialog = false, action = ''" :disabled="confirmation_dialog_loader" class="mx-3" outlined rounded><v-icon small left>fas fa-times-circle</v-icon>CANCEL</v-btn>
                  <v-btn @click="confirm()" :loading="confirmation_dialog_loader" class="mx-3" color="light-blue darken-4" rounded dark >CONFIRM<v-icon small right> fas fa-check-circle</v-icon></v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>

        <v-overlay v-if="confirmation_dialog_loader" :value="confirmation_dialog_loader" z-index="9999"> 
          <v-progress-circular indeterminate size="35"></v-progress-circular>
          <span class="ml-3 text-h6 font-weight-regular" >Loading... Please Wait...</span>
        </v-overlay>

        <!-- DIALOG FOR OTHER ASSESSMENT -->
        <v-dialog v-if="other_assessment.dialog" v-model="other_assessment.dialog" width="400" persistent>
          <v-card class="pa-5">
            <h6 class="font-weight-medium body-2">Current: {{ patient_assessment[other_assessment.category].others_notes ? patient_assessment[other_assessment.category].others_notes.substring(8) : '' }}</h6>
            <v-divider class="my-2"></v-divider>
            <h6 class="font-weight-regular body-2">Others</h6>
            <v-text-field v-model="other_assessment.new_val" placeholder="Enter the assessment here" hide-details outlined></v-text-field>

            <v-row justify="end" class="mt-4" wrap dense>
              <v-btn @click="inserOtherAssessment('close', other_assessment.category)" small>CLOSE</v-btn>
              <v-btn @click="inserOtherAssessment('confirm', other_assessment.category)" :disabled="!other_assessment.new_val" class="ml-2" color="primary" small>CONFIRM</v-btn>
            </v-row>
          </v-card>
        </v-dialog>  
        
        <!-- SAVE PRESCRIPTION  -->
        <Medicine ref="treatment_plan" :selected_medicine="selected_medicine" :patient_name="member_data.member.p_name" :data="member_data.member"/>

        <PhilPen  
          :date_today="formatDate(date_today)"
          :patient_name="member_data.member.p_name"
          :patient_info="member_data.member"
          :family_medical_history="medical_history.family_medical_history.value"
          :patient_social_history="medical_history.patient_social_history.value"
          :pex_data="{
            ...pex_data,
            ...{
              bp_systolic: pex_data.bp_systolic,
              bp_diastolic: pex_data.bp_diastolic,
              bp_2nd_systolic: pex_data.bp_2nd_systolic,
              bp_2nd_diastolic: pex_data.bp_2nd_diastolic,
            }, 
            ...{
              bmi_computation: { bmi: patient_record.bmi }
            }
          }"
          :dietary_information="dietary_information"
          :plan_data="plan_data"
          :notes="trans_data.operator_notes"
          :jspdf="jspdf"
          ref="philpen"
          @display_philpen="display_philpen = false"
        />

      <!-- <v-dialog v-model="display_doctor_referral" width="1500" hide-overlay persistent> -->
        <DoctorReferralForm :patient_info="member_data.member" :eligible_data="eligible_data" :emr_params="emr_params" :chief_complaint="trans_data.chief_complaint" 
          :pex_data="{
            ...pex_data,
            ...{
              bp_systolic: pex_data.bp_systolic,
              bp_diastolic: pex_data.bp_diastolic,
              bp_2nd_systolic: pex_data.bp_2nd_systolic,
              bp_2nd_diastolic: pex_data.bp_2nd_diastolic,
              o2sat: pex_data.oxygen_saturation,
              height: patient_record.height,
              weight: patient_record.weight,
              left_vision: patient_record.left_one + ' / ' + patient_record.left_two,
              right_vision: patient_record.right_one + ' / ' + patient_record.right_two
            }, 
            ...{
              bmi_computation: { 
                bmi: patient_record.bmi, 
                remarks: patient_record.bmi_remarks 
              }
            }
          }" 
          :selected_medicine="selected_medicine"
          :family_medical_history="medical_history.family_medical_history.value"
          :past_medical_history="medical_history.past_medical_history"
          @referral_status="referral_status = true"  
          @getReferralData="getReferralData" 
          ref="doctor_referral" 
        />
      <!-- </v-dialog> -->

      <!-- <v-dialog v-model="display_doctor_referral" width="1500" hide-overlay persistent>
        <DoctorReferralForm :patient_info="member_data.member" :emr_params="emr_params" :chief_complaint="trans_data.chief_complaint" :pex_data="{
          ...pex_data,
          ...{
            bp_systolic: pex_data.bp_systolic,
            bp_diastolic: pex_data.bp_diastolic,
            bp_2nd_systolic: pex_data.bp_2nd_systolic,
            bp_2nd_diastolic: pex_data.bp_2nd_diastolic,
            o2sat: pex_data.oxygen_saturation,
            height: patient_record.height,
            weight: patient_record.weight,
            left_vision: patient_record.left_one + ' / ' + patient_record.left_two,
            right_vision: patient_record.right_one + ' / ' + patient_record.right_two
          }, 
          ...{
            bmi_computation: { 
              bmi: patient_record.bmi, 
              remarks: patient_record.bmi_remarks 
            }
          }
        }" :selected_medicine="selected_medicine" @referral_status="referral_status = true" @display_doctor_referral="display_doctor_referral = false" @getReferralData="getReferralData" />
      </v-dialog> -->

      <v-dialog v-model="display_teleconsult_referral" width="1500" persistent>
        <TeleConsult :member_data="member_data" @display_teleconsult_referral="display_teleconsult_referral = false" @forTeleConsult="forTeleConsult" @getTeleConsultData="getTeleConsultData" :doctor_list="doctorList"/>
      </v-dialog>

      <v-dialog v-if="other_management.dialog" v-model="other_management.dialog" width="400" persistent>
          <v-card class="pa-5">
              <h6 class="font-weight-regular body-2">Others</h6>
              <v-text-field v-model="other_management.new" placeholder="Enter other management here" hide-details outlined></v-text-field>

              <v-row justify="end" class="mt-4" wrap dense>
                  <v-btn @click="other_management.dialog = false" small>CLOSE</v-btn>
                  <v-btn @click="saveOthersManagement" :disabled="!other_management.new" class="ml-2" color="primary" small>CONFIRM</v-btn>
              </v-row>
          </v-card>
      </v-dialog>

      <v-dialog v-model="display_consent" width="650" persistent> 
        <v-card>
          <v-card-title class="blue darken-3 white--text text-body-1"> WAIVER FOR PATIENT</v-card-title>
          <v-sheet class="pt-6 px-6 pb-1"> 
            <h4 class="text-body-2 text-start"> I, the undersigned parent or legal guardian of the minor child named below, authorize 
              <span class="font-weight-medium"> {{ prv_data.provider_name }} </span>
              to perform the necessary medical procedures and treatments as discussed. I understand the potential risks involved and agree to release 
              <span class="font-weight-medium"> {{ prv_data.provider_name }} </span>, 
              its staff, and affiliates from any liability related to the medical care provided. By signing, I confirm that I have been informed about the procedures and consent to their execution.</h4>
            <div class="d-flex justify-space-between align-center py-4">  
              <span class="text-body-2">Date: {{ formatDate(date_today) }} </span>
              <v-checkbox v-model="with_consent" label='Yes, I agree' hide-details dense> </v-checkbox>
            </div>
            <v-divider> </v-divider>
          </v-sheet>
          <v-card-actions class="justify-center px-4 pb-4"> 
            <v-btn  @click="handleDialogTrans('consent')" color="blue darken-3" class="white--text" :disabled="!with_consent" rounded> CONFIRM</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="display_eligible_trans" width="750" persistent> 
        <v-card>
          <v-card-title class="blue darken-3 white--text text-body-1"> ELIGIBLE PATIENT</v-card-title>
          <v-sheet class="pt-6 px-6 pb-1"> 
            <h4 class="body-2 text-start">Before proceeding, please select the appropriate transaction type: </h4>

            <v-radio-group v-model="selected_eligible_tran" dense>
              <v-radio v-if="eligible_data.konsulta_eligible" value="ekonsulta" > 
                <template v-slot:label>
                  <span class="body-2"> Yakap – For primary care consultations and services under the PhilHealth Yakap Package. </span>
                </template>
              </v-radio>
              <v-radio v-if="eligible_data.eclaims_eligible" value="eclaims"> 
                <template v-slot:label>
                  <span class="body-2"> eClaims – For filing claims related to inpatient or other benefit package services. </span>
                </template>
              </v-radio>
            </v-radio-group>
    
            <span class="body-2"> Please choose your transaction to continue. </span>
            <v-divider> </v-divider>
          </v-sheet>
          <v-card-actions class="justify-center px-4 pb-4"> 
            <v-btn  @click="handleDialogTrans('eligible_trans')" color="blue darken-3" class="white--text" :disabled="!selected_eligible_tran" rounded> CONFIRM</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Printable Forms -->
      <TBDots :jspdf="jspdf" @mutationStatus="mutationStatus" ref="tb_dots" />
      <ClinicalAbstract ref="clinical_abstract"  :emr_params="emr_params" :admitting_diagnosis="admitting_diagnosis" :chief_complaint="trans_data.chief_complaint" :pex_data="pex_data" :selected_icd="selected_icd" :selected_medicine="selected_medicine" :doctor_data="doctor_data"/>
      <FollowUpForm :jspdf="jspdf" ref="follow_up_form" :doctor_notes="trans_data.operator_notes" :select_management="select_management" :emr_params="emr_params"/>
      <MedicalCertificate :jspdf="jspdf" ref="medical_certificate" :doctor_notes="trans_data.operator_notes" :select_management="select_management" :emr_params="emr_params"/>

      <BMICalculationController ref="BMICalculationController" />
      <TransactionDialog :alert="alert_data" @closeReport="closeDialog"/>
      <Alert :alert="alert" @submit="submit" @redirect="redirect" @teleConsultDialog="teleConsultDialog" @clearTeleConsult="clearTeleConsult" @removeSelecteddoctor="removeSelecteddoctor" @logoutUser="logoutUser" ref="alert_logout"/>

    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

import jsPDF from 'jspdf'
//import Navbar from "../../Navbar.vue";
import purpose_of_visit_items from '@/reference/purpose-of-visit.json'
import management_items from '@/reference/management-items.json'
import Alert from "@/components/Alert.vue";
import ObGyneHistory from '@/components/emr/ob-gyne/Main.vue'
import MedicalHistory from "@/components/emr/MedicalHistory.vue"
import VaccinationRecord from '@/components/emr/VaccinationRecord.vue'
import CovidVaccination from '@/components/emr/CovidVaccination.vue'
import MedicalRecords from '@/components/emr/MedicalRecords.vue'
import ConsultationGen from "@/components/e-benefit/Consultation/ConsultationGen.vue";
import Medicine from '@/components/emr/printable-form/treatment-plan/Main.vue'
// import DoctorReferralForm from "@/components/emr/DoctorReferralForm.vue"
import DoctorReferralForm from "@/components/emr/printable-form/referral-form/Main.vue"
import ClinicalAbstract from '@/components/emr/ClinicalAbstract.vue'
import PhilPen from "@/components/emr/PhilPen.vue"
import TBDots from "@/components/emr/printable-form/TBDots.vue"
import BMICalculationController from '@/controller/BMICalculationController.vue'
import DiagnosticExamResult from '@/components/emr/diagnostic-exam-result/Main.vue'
import Ncdqans from '@/components/emr/Ncdqans.vue'
import TeleConsult from '@/components/emr/TeleConsult.vue';
import NavigationDrawer from '../../NavigationDrawer.vue';
import PhysicianDiagnosis from '@/components/emr/PhysicianDiagnosis.vue';
import FollowUpForm from '@/components/emr/printable-form/FollowUp.vue';
// import PhysicalExamination from '@/components/emr/physical-examination/index.vue'
import PhysicalExamination from '@/components/emr/PhysicalExamination.vue'
import MedicalCertificate from '@/components/emr/printable-form/medical-certificate/Main.vue';
import TransactionDialog from '@/components/admin/ekonsulta/TransactionDialog.vue';
// import LaboratoryProcedure from '@/components/emr/diagnostic-exam-result/DoctorsOrder.vue'

export default {
  
  components: {
    //Navbar,
    Alert,
    ConsultationGen,
    MedicalHistory,
    ObGyneHistory,
    VaccinationRecord,
    CovidVaccination,
    MedicalRecords,
    DoctorReferralForm,
    ClinicalAbstract,
    PhilPen,
    TBDots,
    BMICalculationController,
    DiagnosticExamResult,
    Ncdqans,
    TeleConsult,
    Medicine,
    NavigationDrawer,
    PhysicianDiagnosis,
    FollowUpForm,
    PhysicalExamination,
    MedicalCertificate,
    TransactionDialog,
    // LaboratoryProcedure
  },

  data() {
    return {
      med_hist_active: false,
      phy_active: true,
      imm_active: false,
      ob_active: false,
      med_rec_active: false,
      diagnostic_active: false,
      physician_active: false,
      ncdqans_active: false,
      drugs_and_med_active: false,

      fab: false,

      //  3.5.4
      display_philpen: false,
      required_fields_past: false,

      diabetes_mellitus: false,

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

      ekas_result: [],
      eligible_data: sessionStorage.getItem('YETBS') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('YETBS'), 'ygrGk2dX').toString(this.$crypto.enc.Utf8)) : null,
      epress_medicine: {},
      latest_transaction_number: '',

      dietary_information: {
        high_fat_salt_intake: '',
        fiber_intake_fruit: '',
        fiber_intake_vegetable: '',
        physical_activity: '',
      },

      close_contact_tb: {
          value: ''  
      },

      jspdf: jsPDF,
      signs_and_symptoms: sessionStorage.getItem('l0cx832kd') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('l0cx832kd'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
        fresh_load: true,
        data: [{symptom:'NONE', duration:'', symptoms_id:''}]
      },

      is_bp_incomplete: false,
      is_bp_2nd_incomplete: false,

      // 3.4.3
      tab:'',
        
      //MEDICINE
      medicine_list:[],
      selected_medicine: [],
      loading_medicine: true,
      loading_otc_medicine: true,
      selected_medicine_filter: [],
      selected_medicine_holder:{},

      nature_of_visit: '',
      service_availed: '',
      purpose_of_visit_items: purpose_of_visit_items.purpose_of_visit_items,
      vaccinator_list:[],
      loading_vaccination: true,

      patient_record:{
        height: '',
        weight: '',
        bmi: '',
        bmi_remarks: '',
        height_for_age: '',
        weight_for_age: '',
        weight_for_height: '',
        has_previous_record:false,
        hip: '',
        limbs: '',
        skin_for_thickness: '',
        mid_upper_arm_circle: '',
        head_circle: '',
        left_one:'',
        left_two: '',
        left_vision: '',
        right_one: '',
        right_two: '',
        right_vision: ''
      },

      bmi_data: {},

      // MEDICAL HISTORY
      allergy_enabled: false,
      family_allergy_enabled: false,
      medical_history: {
        past_medical_history: [],
        previous_hospitalization: '',
        previous_hospitalization_date: '',
        previous_surgeries: '',
        previous_surgeries_date: '',
        allergies: '',
        has_previous_record: false,

        current_medicine: {
          value: [],
          has_previous_record: ''
        },

        family_medical_history: {
          value: [],
          has_previous_record: '',
          family_allergies: ''
        },

        patient_social_history: {
          value: [],
          has_previous_record: ''
        }
      },
      
      pex_data: sessionStorage.getItem('hjyGCS34x') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('hjyGCS34x'), 'EMX268').toString(this.$crypto.enc.Utf8)) : {
        fresh_load: true,
        blood_pressure: '',
        blood_pressure_2nd: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        blood_pressure_2nd_systolic: '',
        blood_pressure_2nd_diastolic: '',
        temp: '',
        pulse_rate: '',
        heart_rate: '',
        oxygen_saturation:'',
        respiration_rate: '',
        waist_circumference: '',
        central_adiposity: '',
        left_vision: '',
        right_vision: ''
      },
      pex_status: false,

      general_survey: [],
      general_survey_notes: '',

      // patient_heent: sessionStorage.getItem('jhuVghs51') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('jhuVghs51'), 'EMX270').toString(this.$crypto.enc.Utf8)) : {
      //   fresh_load: true,
      //   heent:[],
      //   others_notes: '',
      // },

      patient_assessment: sessionStorage.getItem('Kyjncyyhs') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('Kyjncyyhs'), 'EMX271').toString(this.$crypto.enc.Utf8)) : {
        fresh_load: true,

        chest:{
          others_notes: '',
          assessment: [],
        },
        cvs:{
          others_notes: '',
          assessment: [],
        },
        musculoskeletal:{
          others_notes: '',
          assessment: [],
        },
        abdomen:{
          others_notes: '',
          assessment: [],
        },
        gui:{
          others_notes: '',
          assessment: [],
        },
        skin:{
          others_notes: '',
          assessment: [],
        },
        neuro:{
          others_notes: '',
          assessment: [],
        },
        pelvic:{
          others_notes: '',
          assessment: [],
        },
        rectal:{
          others_notes: '',
          assessment: [],
        },
        heent: {
          others_notes: '',
          assessment: []
        }
      },

      other_assessment: {
        dialog: false,
        category: '',
        new_val: ''
      },

      //DIAGNOSTIC EXAM
      diagnostic_exam_result: [],
     
      confirmation_dialog: false,
      confirmation_dialog_loader: false,
      
      doctor_data: sessionStorage.getItem('yhi7998ssg') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('yhi7998ssg'), 'EMX265').toString(this.$crypto.enc.Utf8)) : {
        fresh_load: true
      },

      trans_data: sessionStorage.getItem('88hs2Bsf') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('88hs2Bsf'), 'EMX265').toString(this.$crypto.enc.Utf8)) : {
        fresh_load: true,
        chief_complaint: '',
        service_availed: ['GENERAL']
      },

      vaccinator_items:[],
      loading_vaccinator:true,

      panel:[0],

      icd_cpt: [],
      doctor_loader: true,
      doctorList: [],
      helpDialog: false,
      alert: {},

      // DRUGS AND MEDICINE
      otc_med_list: [],
      
      // PLAN
      date_today: this.$moment().format('YYYY-MM-DD'),
      plan_data: {
          diet: '',
          fluid_intake: '',
          medical_certificate: '0',
          follow_up_consultation_date:'',
          referral:'',
          disability_certificate: '0', 
          gender_verification: '0'  
      },

      // REFERRAL DATA
      referral_empty_fields: false,
      referral_status: false,
      referral_data: {},
      display_doctor_referral: false,
      display_teleconsult_referral: false,
      teleconsult_empty_fields: false,

      // DRUGS / MED DIALOG
      print_save_dialog: false,

      // CLINICAL ABSTRACT
      print_save_dialog_clinical: false,

      // EMPTY FIELDS
      required_fields:false,
      vac_has_empty: false,
      cov_empty_fields: false,
      obg_empty_fields: false,
      pex_required_fields: false,

      // COVID VACCINATION
      covid_status: true,

      // CONSULTATION ACTION
      action: 'submit_to_doctor',
    
      //NAVBAR CONTENT
      navbar: [{ title: "Home", link: "/code-scanning", icon: "fas fa-home" }],
      help: [{ content: "Consultation" }],

      // REFERAL NEW
      selected_referral: sessionStorage.getItem('S2GSXfkF') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('S2GSXfkF'), 'lfFo34sf').toString(this.$crypto.enc.Utf8)) : null,

      process_type: sessionStorage.getItem("GF45S") ? this.$crypto.AES.decrypt(sessionStorage.getItem("GF45S"), "fgGds32s").toString(this.$crypto.enc.Utf8): null,
      member_phic_data: sessionStorage.getItem("MPS24")? JSON.parse(this.$crypto.AES.decrypt( sessionStorage.getItem("MPS24"), "lfFo34sf" ).toString(this.$crypto.enc.Utf8)) : null,
      yetbs_data: sessionStorage.getItem("YETBS") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("YETBS"), "ygrGk2dX").toString(this.$crypto.enc.Utf8)) : null,
    
      //FOR OTHER MEDICINE
      other_med: {
          dialog: false,
          generic_name: '',
          others_drug_code: ''
      },
      select_other_med: '',

      has_diabetes: false,

      //FOR TELECONSULT
      for_tele_consult: false,
      clinic_schedule: '',
      viber_number: '',
      mobile_number: '',

      navigation_drawer_item: [
        { name: 'COMPLAINTS, SYMPTOMS & HISTORY', path: '/admission/consultation', icon: 'mdi-account' },
        { name: 'MEDICAL HISTORY', path: '/admission/medical-history', icon: 'mdi-clipboard-text-clock' },
        { name: 'PHYSICIAN DIAGNOSIS', path: '/admission/physician-diagnosis-and-treatment-plan', icon: 'mdi-doctor' },
        { name: 'PHYSICAL EXAMINATION', path: '/admission/physical-examination', icon: 'mdi-human-male-height' },
        { name: 'IMMUNIZATION RECORDS', path: '/admission/immunization-records', icon: 'mdi-needle'},
        { name: 'OB-GYN HISTORY', path: '/admission/obgyne-history', icon: 'mdi-mother-nurse'},
        { name: 'MEDICAL RECORDS', path: '/admission/medical-record', icon: 'mdi-book-cross'},
        { name: 'DIAGNOSTIC EXAM RESULT', path: '/admission/diagnostic-exam-result', icon: 'mdi-clipboard-list-outline'},
        { name: 'DRUGS/MEDICINE AND PLAN', path:'/admission/drugs-medicine-and-plan', icon: 'mdi-medical-bag'},
        { name: 'NCD QUESTIONNAIRE', path: '/admission/ncdqans', icon: 'mdi-clipboard-pulse'}
      ],

      open_drawer: false,
      close_drawer: false,
      window_size: { x: 0, y: 0 },
      mobile_screen: false,

      //PHYSICIAN DIAGNOSIS
      admitting_diagnosis: '',
      med_empty_fields: false,
      phy_empty_fields: false,
      selected_icd: [
          {
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
          }
      ],
      selected_icd_filter: [],
      selected_cpt: [],
      selected_cpt_filter: [],
      selected_cpt_holder: {},
      physician_recommendation: [],
      select_physician_recommendation: ['Yes', 'No', 'Not Applicable'],
      patient_remarks: '',
      select_patient_remarks: ['Request', 'Refuse', 'Not Applicable'],

      //CPT MODIFIER
      select_cpt_modifier: [],
      loading_modifier : true,

      management_items: management_items.management_items,
      select_management: [],
      other_management: {
          dialog: false,
          new: ''
      },

      treatment_recommendation: '',
      treatment_submit_attempted: false,

      offline_date_admitted: '',
      offline_date_discharge: '',
      offline_required_fields: false,

      icd_current_page: 1,
      cpt_current_page: 1,
      icd_next_page: 0,
      cpt_next_page: 0,
      search_icd_items: '',
      search_cpt_items: '',
      time_out: null,

      signs_and_symptoms_empty_field: false,
      social_history_empty_field: false,
      past_medical_history_empty_field: false,
      submit_to_doctor_midwife: false,
      loading_ncdqans: true,
      alert_data: {},

      display_consent: false,
      with_consent: sessionStorage.getItem("HYSGTT") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("HYSGTT"), "jfyh2s45").toString(this.$crypto.enc.Utf8)) : false,
      display_eligible_trans: false,
      selected_eligible_tran: sessionStorage.getItem("YH90MG") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("YH90MG"), "u2787cvA").toString(this.$crypto.enc.Utf8)) : '',
      specialization: '',

      consultation_data_required: false,
      consultation_data_required_ill: false,
      consultation_data_required_doc: false,
      switch_add_package_procedure: false,
      selected_package_procedure: [],
      is_data_encoder: '',

      //FOR EDIT TRANSACTION
      selected_transaction: sessionStorage.getItem('T3HGYTWW') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('T3HGYTWW'), 'ghyjTLf').toString(this.$crypto.enc.Utf8)) : null,
      
      laboratory_dialog: false,
      is_edit: false,
      selected_cpt_for_lab: null,
      procedure_items: null,
      procedure_result_required: false,

      get_diagnostic_encoded: sessionStorage.getItem('pmsh24Dxs') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('pmsh24Dxs'), 'OIG220').toString(this.$crypto.enc.Utf8)) : null,
    
      request_data_payload: sessionStorage.getItem('rqnn52ds') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('rqnn52ds'), 'OKM2HN').toString(this.$crypto.enc.Utf8)) : null,

      transaction_timeout_id: null,
    };
  },

  watch: {
    'med_hist_active'(value){
      if(value && this.$route.path === '/admission'){
        this.getMedicine('otc_medicine');
      }
    },

    'imm_active'(value){
      if(value && this.$route.path === '/admission'){
          this.getVaccinatorList()
      }
    },

    'ncdqans_active'(value){
      if(value && this.$route.path === '/admission'){
        this.getNcdqans();
      }
    },

    '$route': {
      handler(to){
        if (to.path !== '/admission' && to.params.page === '/admission/consultation' && to.params.page !== 'medical-history' && to.params.page !== 'physical-examination' && to.params.page !== 'obgyne-history' && to.params.page !== 'immunization-record' && to.params.page !== 'medical-record' 
          && to.params.page !== 'diagnostic-exam-result' && to.params.page !== 'ncdqans' && to.params.page !== 'drugs-medicine-and-plan' && to.params.page !== 'physician-diagnosis-and-treatment-plan') {
              this.$router.push('/*')
          } else {
            if(to.params.page === 'obgyne-history'){
                this.ob_active = true
            }
            
            if(to.params.page === 'immunization-records'){
                this.imm_active = true
                this.getVaccinatorList()
            }

            if( to.params.page === 'drugs-medicine-and-plan' || to.params.page === 'medical-history') {
              this.getMedicine('otc_medicine');
            }

            if(to.params.page === 'physician-diagnosis-and-treatment-plan'){
              this.getMedicine('otc_medicine');
              
              //CHANGE THE USER_TYPE TO 9-1 FOR DATA ENCODER
              if (this.emr_params.editable && this.$store.state.icd_list.length === 0 && this.$store.state.usr_credentials.user_type === '9-1') {
                  this.getICDList();
                  this.getCPTList()
              } else {
                  this.$store.commit('set_loading_icd', false)
                  this.$store.commit('set_loading_cpt', false)
              }
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
    this.getDoctorList()
    this.$nextTick(() => {// fully rendered before calling
      if (this.$refs.physical_examination) {
        this.getPatientRT();  
        this.getPatientST(); //FOR EDIT TRANSACTION
      } 
    });
    
    if (this.member_data.member.mem_gender === 'FEMALE') {
      this.getObgyneData()
    }

    if (this.selected_referral) {
      this.populateReferralData();
    }

    //FOR EDIT TRANSACTION
    if (this.selected_transaction) {
      this.populateTransactionData();
    }

    this.display_consent = !this.with_consent && this.calculateAge(this.member_data.member.mem_birthdate) < 18 ? true : false

    //CHECK FOR PATIENT ELIGIBLE. SHOW THE SELECTION FOR TRANSACTION EKONSULTA/ECLAIMS
    if(this.eligible_data.eclaims_eligible || this.eligible_data.konsulta_eligible){
      if(this.eligible_data.eclaims_eligible){
        this.selected_eligible_tran = 'eclaims'
      }

      if(this.eligible_data.konsulta_eligible){
        this.selected_eligible_tran = 'ekonsulta'
      } 
    }

    if(this.eligible_data.eclaims_eligible && this.eligible_data.konsulta_eligible){
      if(this.prv_config.ekonsulta_accre || this.prv_config.eclaims_accre){
        this.display_eligible_trans = !this.selected_eligible_tran ? true : false
      } else {
        this.display_eligible_trans = false
      }
    } 

    this.selected_icd = sessionStorage.getItem("7nVooi3FUfds") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("7nVooi3FUfds"), "EMX2464").toString(this.$crypto.enc.Utf8)) : []
    let encoded_procedure_items = sessionStorage.getItem("ioHbn23s") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("ioHbn23s"), "EDX242").toString(this.$crypto.enc.Utf8)) : []

    this.procedure_items = {
      procedure: encoded_procedure_items
    }
    
    this.diagnostic_exam_result = this.get_diagnostic_encoded

    //CALL THE CONTROLLER AGAIN IF THE REQUEST IF INTERUPTED
    if(this.request_data_payload){
      let function_name = this.request_data_payload.function_name
      
      this[function_name]()

      this.confirmation_dialog_loader = true
    } else {
      this.confirmation_dialog_loader = false
    }

    this.trnUpdMemberTransactionStatus()
  },

  computed: {
    ...mapState(["member_data", "teleconsult_data", "usr_credentials", "prv_data", "prv_config"]),

    page_min_height(){
        if(this.$route.path === '/emr-consultation'){
            return '200'
        } else {
            return '0'
        }
    },

    filter_nav_drawer_item() {
      let filter_items = this.navigation_drawer_item.filter(item => {{
            if(this.usr_credentials.user_type === '9-1') {
                return item.name !== 'DRUGS/MEDICINE AND PLAN'
            }  
            
            if(this.usr_credentials.user_type === '2-1') {
                return item.name !== 'PHYSICIAN DIAGNOSIS'
            }

            return item.name 
        }
      })

      return filter_items 
    },

    emr_params() {
      return {
        ek_lgu_id: this.member_data.member.ek_lgu_id,
        lgu_host_code: this.member_data.member.lgu_host_code,
        hmo_policy_number: this.member_data.member.mem_hmo_policy_number,
        hmo_host_code: this.member_data.member.mem_hmo_host_code ? this.member_data.member.mem_hmo_host_code : null,
        ek_phic_id: this.member_data.member.ek_phic_id ? this.member_data.member.ek_phic_id : null,
        phic_host_code: this.process_type !== 'HMO' && this.member_data.member.mem_phic_pin ? 'PHIC' : null,
        mem_phic_pin: this.member_data.member.mem_phic_pin,
        editable:true,
        routes: 'Consultation'
        
      }
    },
    
    // FILTER MEDICINE LIST
    // medicine_items(){
    //   const medicine_list = this.otc_med_list.filter(item => {
    //     return !this.selected_medicine_filter.includes(item.generic_name_text)
    //   })

    //   return medicine_list
    // },

    medicine_items() {
      const selected = this.selected_medicine_filter || []

      return (this.otc_med_list || []).filter(item => {
          return !selected.includes(item.generic_name_text)
        }).map(item => ({
          ...item,
          medicine_text: `${item.generic_name_text} (${item.other_med_group})`
        }))
    },
    
    
    cpt_items(){
        const cpt_list_filter = this.$store.state.cpt_list.filter(item => {
            return !this.selected_cpt_filter.includes(item.cpt_code)
        })
        return cpt_list_filter
    },

    physical_tab_has_pending() {
      if ((this.required_fields && (!this.patient_record.height || !this.patient_record.weight)) || 
          (this.is_bp_incomplete && (!this.pex_data.blood_pressure_systolic || !this.pex_data.blood_pressure_diastolic)) || 
          (this.is_bp_2nd_incomplete && (!this.pex_data.blood_pressure_2nd_systolic || !this.pex_data.blood_pressure_2nd_diastolic)))
        {
          return true
        }
      return false
    },

    med_quantity_has_data() {
      if (this.action == 'end_transaction' && this.selected_medicine.length > 0 && this.$store.state.usr_credentials.user_type !== '9-1') {
        return this.selected_medicine.every(item => item.total_num_of_med && item.total_prescribed_medicine)
      }
      return true
    },  

    // consultation_required() {
    //   if (this.required_fields && (this.consultation_data_required || this.signs_and_symptoms_empty_field)) 
    //     {
    //       return true;
    //     }
    //   return false;
    // },

    consultation_required() {

      if(this.consultation_data_required || this.consultation_data_required_doc || this.consultation_data_required_ill || this.signs_and_symptoms_empty_field) {
        return true
      }
      
      return false
      // if (this.required_fields && (this.consultation_data_required || !this.check_doctor || this.signs_and_symptoms_empty_field)) 
      //   {
      //     return true;
      //   }
      // return false;
    },

    medical_history_required() {
      if (this.eligible_data?.konsulta_eligible) {
        if (this.required_fields && (this.social_history_empty_field)) {
          return true;
        }
      }

      if(this.eligible_data?.eclaims_eligible) {
        if (this.required_fields && (this.past_medical_history_empty_field)) {
          return true;
        }
      }

      return false;
    },

    medical_history_allergy_required() {
      if (this.allergy_enabled && !this.medical_history.allergies) {
        return true
      }

      return false
    },

    medical_history_family_allergy_required() {
      if (this.family_allergy_enabled && !this.medical_history.family_medical_history.family_allergies) {
        return true
      }

      return false
    },

    off_required() {
      if(this.required_fields && (this.offline_required_fields)) {
        return true
      }

      return false
    },

    ob_required() {
      if(this.required_fields && (this.obg_empty_fields)) {
        return true
      }

      return false
    },

    immunization_required() {
      if(this.required_fields && (this.vac_has_empty || this.cov_empty_fields)) {
        return true
      }

      return false
    },

    // CALL FOR THE LIST OF ICD FOR DATA ENCODER AND FILTER ICD LIST
    icd_items(){
        const icd_list = this.$store.state.icd_list.filter(item => {
            return !this.selected_icd_filter.includes(item.icd_code)
        })

        return icd_list
    },

    // TREATMENT RECOMMENDATION ERROR
    treatment_recommendation_error() {
      if (this.$store.state.usr_credentials.department !== 'Data Encoder') {
        return false;
      }

      if (!this.treatment_submit_attempted) return false;

      return !this.treatment_recommendation;
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

    med_required_error() {
        if (this.med_empty_fields && !this.selected_medicine.some(item => item.total_num_of_med > 0 || 
            (item.medicine_code === 'OTC-0000' && !item.other_drug_code))) {
            return true; 
        }
        return false; 
    },

    filtered_atc_values() {
      const ekonsulta = this.eligible_data.ekonsulta;
      if (ekonsulta && ekonsulta.atc) {
        return ekonsulta.atc.filter(value => value); 
      }

      return [];
    },
        
    is_item_disabled() {
        // CHECK IF NOT APPLICABLE IS SELECTED 
        let is_not_applicable_selected = Array.isArray(this.select_management) && 
        this.select_management.some(el => el.lib_id === "0");
        
        // IF NOT APPLICABLE IS SELECTED, DISABLE ALL OTHER OPTIONS
        return (item) => {
            //DISABLE ALL EXCEPT NOT APPLICABLE
            return is_not_applicable_selected && item.lib_id !== "0";  
        };
    },
     //FOR EDIT TRANSACTION - IF MIGRATED OR NOT
    from_migration() {
      return this.selected_transaction?.from_migration === '1' ? true : false
    },

    from_migration_procedure_result() {
      return !!this.diagnostic_exam_result?.data?.length
    }
  },

  methods: {
    async trnUpdMemberTransactionStatus() {
      try {
        await this.$store.dispatch('trnUpdMemberTransactionStatus', {
          ek_lgu_id: this.emr_params.ek_lgu_id,
          process_by: this.$store.state.usr_credentials.user_name,
        });
      } finally {
        this.transaction_timeout_id = setTimeout(() => {
          this.trnUpdMemberTransactionStatus();
        }, 25000);
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

    // GET ICD LIST
    async getICDList() {
      await this.$store.dispatch('getICDList', {
          request_key: 'icd',
          hmo_doctor_code: this.$store.state.usr_credentials.doctor_code,
          doctor_tin_no: this.$store.state.usr_credentials.doctor_tin,
          page: this.icd_current_page,
          search_str: this.search_icd_items
      })
      
      //this.getCPTList();
    },

    // GET CPT LST
    getCPTList() {
      this.$store.dispatch('getCPTList', {
          selection_type: "lgu",
          doctor_tin_no: this.$store.state.usr_credentials.doctor_tin,
          hmo_doctor_code: this.$store.state.usr_credentials.doctor_code,
          page: this.cpt_current_page,
          search_str: this.search_cpt_items
      })
      
      this.selected_cpt_filter = [... this.$store.state.cpt_list]
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
        this.mutationStatus('phy', '', 'selected_icd_proc');
        this.getCPTModifier();
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

    // ADD DIAGNOSIS DATA
    addDiagnosisData(index, item){
        if(this.switch_favorite) {
            this.favorite_items.push(item)
        } else {
            this.selected_icd[index].icd_code = item.icd_code
            this.selected_icd[index].icd_description = item.icd_description
            this.selected_icd[index].icd_code_description = item.icd_code+' / '+item.icd_description
            this.selected_icd[index].icd_group_code = item.icd_group_code
            this.current_icd = item.icd_code+' / '+item.icd_description

            this.selected_icd_filter = []
            this.selected_icd.forEach(element => {
                this.selected_icd_filter.push(element.icd_code)
            }) 

            this.mutationStatus('phy', '', 'selected_icd_proc');

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

        this.mutationStatus('phy', '', 'selected_icd_proc');
    },

    showLongDesc(icd_index, cpt_index) {
        this.selected_icd[icd_index].procedures[cpt_index].show_long_desc = !this.selected_icd[icd_index].procedures[cpt_index].show_long_desc
    },

    // REMOVE PROCEDURE
    removeProcedure(icd_index, cpt_index, cpt_code){
        this.selected_cpt_filter = this.selected_cpt_filter.filter(item => item !== cpt_code)
        this.selected_cpt = this.selected_cpt.filter(item => item.cpt_code !== cpt_code);
        this.selected_icd[icd_index].procedures.splice(cpt_index, 1)
        this.mutationStatus('phy', '', 'selected_icd_proc');
    },

    async viewProcedure(cpts) {
      // this.laboratory_dialog = true
      this.is_edit = true
      
      // // CHECK IF DIAGNOSTIC EXAM RESULT HAS A DATA THEN MATCH THE DIAGNOSTIC IN PROCEDURE
      // if(this.diagnostic_exam_result?.data?.length >= 1){
      //   this.procedure_items.procedure.forEach(proc => {
      //     const match_procedure = this.diagnostic_exam_result.data.find(
      //       match_cpt_code => match_cpt_code.cpt_code === proc.cpt_code
      //     );

      //     if (match_procedure) {
      //       proc.diagnostic = {
      //         ...proc.diagnostic,
      //         ...match_procedure       
      //       };
      //     }
      //   });  
      // } else {
      //   let get_selected_procedure = []

      //   cpts.map((cpt, index) => {
      //     get_selected_procedure.push({
      //         key: index,
      //         pStatus: cpt.pStatus || 'Not yet done',
      //         libDesc: cpt.libDesc,
      //         cpt_code: cpt.cpt_code,
      //         cpt_desc: cpt.cpt_description,
      //         diagnostic: {
      //           cpt_code: cpt.cpt_code,
      //           libDesc: cpt.libDesc,
      //           pDiagStatus: '',
      //           pDiagnosticLabFee: '',
      //           pLabDate: '',
      //           pReferralFacility: '',
      //         }
      //     })
      //   })

      //   // remove duplicates from item2 based on cpt_code
      //   const filter_selected_procedure = get_selected_procedure.filter(
      //     i2 => !this.procedure_items.procedure.some(i1 => i1.cpt_code === i2.cpt_code)
      //   );

      //   // merge and re-map keys
      //   const result = [...this.procedure_items.procedure, ...filter_selected_procedure].map((item, index) => ({
      //     ...item,
      //     key: index
      //   }));

      //   this.procedure_items = {
      //     transaction_number: this.selected_transaction.transaction_number,
      //     prescription_date: this.selected_transaction.date_damitted,
      //     procedure: result
      //   }
      // }

      // console.log(this.procedure_items)

      let items = []
      cpts.forEach(el => {
        items.push({
          libDesc: el.libDesc === 'OTHERS' ? 'Others' : el.libDesc,
          cpt_code: el.cpt_code,
          cpt_desc: el.cpt_description,
          pStatus: "Not yet done"
        })
      })

      let data = {
        transactions: [
          {
            transaction_number: this.selected_transaction.transaction_number,
            prescription_date: this.selected_transaction.date_damitted,
            procedure: items
          }
        ]
      }

      await this.$refs.diagnostic_exam_results.displayProcedure(data)
    },

    getPatientAssessment() {
      if(!this.patient_assessment.fresh_load) {
        sessionStorage.setItem('Kyjncyyhs', this.$crypto.AES.encrypt(JSON.stringify(this.patient_assessment), 'EMX271'))
      } else {
        this.patient_assessment.fresh_load = false
      }  
    },

    // getHEENT() {
    //   if(!this.patient_heent.fresh_load) {
    //     sessionStorage.setItem('jhuVghs51', this.$crypto.AES.encrypt(JSON.stringify(this.patient_heent), 'EMX270'))
    //   } else {
    //     this.patient_heent.fresh_load = false
    //   }  
    // },

    getPhysicalExamData() {
      if(!this.pex_data.fresh_load) {
        sessionStorage.setItem('hjyGCS34x', this.$crypto.AES.encrypt(JSON.stringify(this.pex_data), 'EMX268'))
      } else {
        this.pex_data.fresh_load = false
      }
    },

    getTransdata() {
      this.consultation_data_required = false
      this.consultation_data_required_ill = false
      if(!this.trans_data.fresh_load) {
        sessionStorage.setItem('88hs2Bsf', this.$crypto.AES.encrypt(JSON.stringify(this.trans_data), 'EMX265'))
      } else {
        this.trans_data.fresh_load = false
      }
    },

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
    
    //FOR TELECONSULT. RETURN BOOLEAN IF TRUE CHANGE THE SUBMIT BUTTON TO 'SUBMIT TO TELECONSULT'
    forTeleConsult(event) {
      this.for_tele_consult = event
    },

    // FOR OBGYNE DATA FROM OBGYNE COMPONENT
    getObgyneData() {
      this.tab = 1
      setTimeout(() => this.tab = 0 ,0.1)
    },

    viewPrintableForm(data) {
      if(data === 'philpen') {
          this.$refs.philpen.displayPhilpen(true)
      } else {
          this.for_print = data
          this.save_print_dialog = true
      } 
    },

    viewFollowUpForm() {
      const data = {
          patient_name: this.combineString([this.member_data.member.mem_first_name, this.member_data.member.mem_middle_name, this.member_data.member.mem_last_name, this.member_data.member.mem_suffix]),
          date_admitted: this.$moment(this.offline_date_admitted).format('MMMM D, YYYY'),
          patient_address: this.combineString([this.member_data.member.mem_home_bldgno, this.member_data.member.mem_home_bgy, this.member_data.member.mem_home_city_municipality, this.member_data.member.mem_home_province, this.member_data.member.mem_home_zip]),
          patient_age: this.member_data.member.mem_age,
          selected_icd: this.selected_icd,
          selected_medicine: this.selected_medicine,
          doctor_name: this.combineString([this.doctor_data.doctor_name]),
          doctor_name2: this.combineString([this.doctor_data.doctor_name]),
          doctor_prc_license: this.doctor_data.doctor_prc_license,
          chief_complaint: this.trans_data.chief_complaint,
          doctor_position: this.doctor_data.doctor_position ? this.doctor_data.doctor_position : '',
          follow_up_consultation_date: this.plan_data.follow_up_consultation_date,
          patient_mem_birthdate: this.member_data.member.mem_birthdate
      }

      this.$refs.follow_up_form.openFollowUpForm(data);
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
    },

    //FOR SAVING DATA FOR EKONSULTA MEMBERR
    async saveEkonsulta(is_emr, route_page, transaction_number, key){
      const { atc, ...ekonsulta_data } = this.eligible_data;
      // MERGE PREVIOUS RECORDS FROM TBL_ITEMS WITH THE NEW VACCINATION RECORD
      let merged_vaccination_records = [
        ...(this.$refs.vaccination_record?.tbl_items || []),
        ...(Array.isArray(this.child_vaccination_record) ? this.child_vaccination_record : [])
      ];

      let payload_data = {
         // transaction_number: this.diagnostic_exam_result.length > 0 ? this.diagnostic_exam_result.transaction_number : transaction_number,
        pHciCaseNo: this.hci_case_number,
        pHciTransNo: this.hci_trans_no,
        pTransmittalID: this.transmittal_id,
        transaction_number: transaction_number,
        ek_lgu_id: this.emr_params.ek_lgu_id,
        blood_type: this.$store.state.member_data.member.blood_type,
        atc: atc,
        ekonsulta: ekonsulta_data,
        diagnostic_exam_trans_no: this.diagnostic_exam_result?.transaction_number ? this.diagnostic_exam_result.transaction_number : transaction_number,
        icd_cpt_data: key === 'emr_con' ? (this.selected_icd[0]?.procedures?.length ?? 0) > 0 ? 1 : 0 : 0,
        created_by: this.$store.state.usr_credentials.user_name,
        is_emr: is_emr,
        has_diabetes: this.has_diabetes,
        child_vaccination_record: { 
          vaccine: merged_vaccination_records
        }
      }

      payload_data = this.request_data_payload ? this.request_data_payload.request_payload : payload_data
      let response = await this.$services.trnAddEkonsulta(payload_data)

      if(response.status === 200) {
        if(key === 'emr_con'){
          this.$store.commit('set_transaction_flag', 1)
        } else {
          if(this.$store.state.usr_credentials.user_type === '9-1') {
            let patient_assessment = { assessment: this.patient_assessment }
  
            //TRIGGER THE DEFAULT VALUE OF PATIENT ASSESSMENT FOR KONSULTA PATIENT IN POST ENCODING.
            await this.$refs.physical_examination.postData(transaction_number, patient_assessment);
  
            this.updPreConsultation(transaction_number)
          }
        }

        let route_page = this.$store.state.usr_credentials.user_type === '9-1' ? '/offline-transaction' : '/code-scanning'
        this.successTransaction(route_page)
      } else {
        this.$store.commit('set_transaction_flag', 1)
        this.confirmation_dialog = false
        this.confirmation_dialog_loader = false
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something went wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      }
    },

    async getDiagnosticExamResultList(){
      let response = await this.$services.getDiagnosticExamResultList({
        ek_lgu_id: this.emr_params.ek_lgu_id, 
        type: this.$route.path === '/admission/diagnostic-exam-result' ? 'pre-consultation' : 'emr'
      });

      if (response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          if(response.data.has_data === true){
              let diagnostic_transaction = response.data.transactions.reduce((transaction_date_one, transaction_date_two) => (transaction_date_one.prescription_date > transaction_date_two.prescription_date ? transaction_date_one : transaction_date_two));
              this.latest_transaction_number = diagnostic_transaction.transaction_number    
          } 
      } else {
          this.alert = response.error;
      }
    },

    populateReferralData() {
      this.dietary_information.physical_activity = this.selected_referral.dietry_information ? this.selected_referral.dietry_information[0].physical_activity : ''
      this.dietary_information.fiber_intake_fruit = this.selected_referral.dietry_information ? this.selected_referral.dietry_information[0].fiber_intake_fruit : ''
      this.dietary_information.high_fat_salt_intake = this.selected_referral.dietry_information ? this.selected_referral.dietry_information[0].high_fat_salt_intake : ''
      this.dietary_information.fiber_intake_vegetable = this.selected_referral.dietry_information ? this.selected_referral.dietry_information[0].fiber_intake_vegetable : ''

      this.trans_data.service_availed = this.selected_referral.purpose_of_visit_service_availed ? this.selected_referral.purpose_of_visit_service_availed : this.trans_data.service_availed
      this.trans_data.chief_complaint = this.selected_referral.chief_complaint ? this.selected_referral.chief_complaint : ''
      this.trans_data.history_current_illness = this.selected_referral.current_history_illness ? this.selected_referral.current_history_illness : ''

      //Signs and Symptoms
      this.signs_and_symptoms.data = this.selected_referral.signs_and_symptoms.map(item =>  {
          if(item.duration.includes('Custom')) {
            let item_slice = item.duration.replace('days', '')

            return {
              duration: item_slice.slice(0, 6),
              symptom: item.symptom,
              symptoms_id: item.symptoms_id,
              custom_duration_input: item_slice.slice(7, 10)
            }
          } else {
            return {
              duration: item.duration,
              symptom:item.symptom,
              symptoms_id: item.symptoms_id
            }
          }
        }
      )

      this.plan_data.diet = this.selected_referral.diet

      this.plan_data.fluid_intake = this.selected_referral.fluid_intake

      this.plan_data.follow_up_consultation_date = this.selected_referral.follow_up_consultation_date

      this.trans_data.operator_notes = this.selected_referral.operator_notes
    },

    // GET SIGNS AND SYMPTOMS DATA
    getSASData(data){
      this.signs_and_symptoms.data = data.signs_and_symptoms
    },

    // FOR PHYSICAL EXAMINATION DATA
    async getPatientRT() {
      let data = await this.$refs.physical_examination.getPatientRT();
      
      if(data) {
        this.patient_record = data
        //this.getMedicine('otc_medicine');
      }
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
    
    // FOR MEDICINE IN MEDICAL HISTORY / DRUGS AND MEDICINE
    async getMedicine(medicine_type){
      if (this.otc_med_list.length === 0) {
        let response = await this.$services.getTransactionIpRefData({
          request_key: medicine_type,
          provider_code: this.$store.state.prv_data.provider_code
        })
  
        if(response.status === 200) {
          //response.data = this.responseDataDecryption(response.data)
          if (medicine_type === 'medicine') {
            this.medicine_list = response.data.map(item => {
              item.generic_name_text = `${item.generic_name} ${item.brand_name} ${item.dosage}`
              return item
            })
            
            this.getMedicine('otc_medicine')
  
            sessionStorage.setItem('kgIGs35', this.$crypto.AES.encrypt(JSON.stringify(this.medicine_list), 'EMX246'))
          } else {
            this.loading_medicine = false
            this.otc_med_list =  response.data.map(item => {
              item.generic_name = item.generic_name ? item.generic_name.trim() : ''
              item.brand_name   = item.brand_name ? item.brand_name.trim() : ''
              item.dosage       = item.dosage ? item.dosage.trim() : ''
              item.preparation  = item.preparation ? item.preparation.trim() : ''
              item.route        = item.route ? item.route.trim() : ''
              item.max_stock_quantity  = item.max_stock_quantity ? item.max_stock_quantity : 0
              item.unit_type    = item.unit_type ? item.unit_type.trim() : ''
              item.generic_name_text = `${item.otc_medicine_code} ${item.generic_name} ${item.dosage || ''}`
              item.other_med_group = item.pOthMedDrugGroup ? item.pOthMedDrugGroup : ''
              return item
            })
  
            this.loading_otc_medicine = false
            //this.getVaccinatorList()
          }
        } else {
            this.alert = response.error
        }
      } else {
        this.loading_otc_medicine = false
      }
    },

    // FOR DOCTOR DATA 
    async getDoctorList() {
      // let prev_update = null
      // let prev_count = null

      let host_doctor;
      if (this.process_type == "HMO_PHIC" || this.process_type == "HMO_PHIC_LGU"  || this.process_type == "HMO_LGU") {
        host_doctor = "HMO_PHIC";
      } else if (this.process_type == "PHIC" || this.process_type == 'PHIC_LGU') {
        host_doctor = "PHIC";
      } else if(this.process_type == "LGU" ) {
        host_doctor = "LGU";
      } else {
        host_doctor = this.member_data.member.mem_hmo_host_code === "VC" ? "HMO_VC" : "HMO";
      }

      let response = await this.$services.getTransactionIpRefData({
        request_key: "patient_doctor",
        host_doctor: host_doctor,
        provider_code: this.$store.state.prv_data.provider_code,
        provider_tin: this.$store.state.prv_data.provider_tin,
        hmo_host_code: host_doctor.includes('HMO') ? this.member_data.member.mem_hmo_host_code : undefined,
        phic_host_code: host_doctor.includes('PHIC') ? 'PHIC' : undefined,
        lgu_host_code: host_doctor === 'LGU' ? this.$store.state.usr_credentials.lgu_host_code : undefined,
        is_post_encoding: this.$store.state.usr_credentials.user_type === '9-1' ? 1 : 0,
        prev_update: "2025-03-06 11:12:17",
        prev_count: 1,
      })
      
      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        this.doctor_loader = false
        if(response.data == 'Data not found.') return
        
        
        this.doctorList = response.data.map(data => {
          return {
              doctor_name            : data.doctor_name.replace(/[,.]/g, ''),
              specialization         : data.specialization,
              doctor_code            : data.hmo_doctor_code,
              doctor_tin             : data.doctor_tin_no,
              doctor_phic_account_no : data.doc_phic_acc_no,
              doctor_prc_license     : data.doc_prc_license,
              autoCompleteText       : `${data.doctor_name} / ${data.specialization} ${data.doctor_tin_no}`,
          }
        })

        // prev_update = response.data.prev_update
        // prev_count = response.data.prev_count
        
        // if (this.$route.name === 'ConsultationTypeA') {
        //   this.queue_timeout = setTimeout(() => this.getDoctorList(), 3000)
        // }

      } else {
          this.alert = response.error
      }
    },
    
    // FOR VACCINATOR DATA IN VACCINATION RECORD AND COVID VACCINATION
    async getVaccinatorList() {
      let response = await this.$services.getTransactionIpRefData({
        request_key: 'nurse_list',
        provider_tin: this.$store.state.prv_data.provider_tin,
        provider_code: this.$store.state.prv_data.provider_code
      })
      
      if(response.status === 200) {
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

        this.loading_vaccinator = false
        this.loading_vaccination = false
      } else {
          this.alert = response.error
      }
    },

    async getNcdqans() {

      if (this.ncdqans.fresh_load) {
        let response = await this.$services.getPatientRecordAndTransaction({
          request_key: 'ncdq',
          ek_lgu_id: this.member_data.member.ek_lgu_id
        });
  
        if (response.status === 200) {
          this.loading_ncdqans = false;
          response.data = this.responseDataDecryption(response.data)
          
          Object.keys(response.data).forEach(data => {
            this.ncdqans[data] = response.data[data]
          })
          this.ncdqans.fresh_load = false

          sessionStorage.setItem('mjh823hss', this.$crypto.AES.encrypt(JSON.stringify(this.ncdqans), 'EMX300'))
        } else {
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
        }
      } else {
        Object.keys(this.ncdqans).forEach(data => {
          
          this.ncdqans = { ...this.ncdqans[data] }
        })
      }
    },

    validateEndTransaction() { 
      if(this.$store.state.usr_credentials.user_type !== '9-1') {
        if (!this.doctor_data.doctor_name) return this.submit('end_transaction')
          this.alert = { 
            display: true, 
            type: 'standard', 
            width: '750', 
            icon: 'mdi-help-circle', 
            color: 'blue darken-1', 
            title: 'Selected doctor will be cleared if you wish to end this transaction without submitting to the doctor', 
            body: 'Do you want to continue?', 
            btn_pry_txt: 'Continue', 
            btn_pry_color: 'primary', 
            btn_pry_otl: false, 
            btn_pry_act: 'closeAlert' ,  
            btn_pry_emt:  'submit',
            btn_pry_params: 'end_transaction',
            btn_sec_txt: 'Cancel', 
            btn_sec_color: 'secondary', 
            btn_sec_otl: true, 
            btn_sec_act: 'closeAlert',
          }
        return 
      } else {
        return this.submit('end_transaction')
      }
    },

    updateAllergyStatus(status) {
      this.$nextTick(() => {
        this.$set(this, 'allergy_enabled', status);
      });
    },

    updateFamilyAllergyStatus(status){
      this.$nextTick(() => {
        this.$set(this, 'family_allergy_enabled', status);
      });
    },

    /*THIS WILL PROMPT THE USER IF HE DOES NOT FILLED THE FOLLOWING FIELDS.*/
    async submit(type) {
      if (type === 'end_transaction' && this.selected_medicine.length > 0 && this.$store.state.usr_credentials.user_type !== '9-1') {
        const has_greater_dispensed = this.selected_medicine.filter(items => (items.total_prescribed_medicine && items.total_num_of_med)).some(data => Number(data.total_num_of_med) > Number(data.total_prescribed_medicine))
        if (has_greater_dispensed) {
          return this.alert = {display: true, type: 'standard',  width: 700,  icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'You cannot dispense medicine greater than the prescribed medicine',  body: 'Please Try Again.', btn_pry_txt: 'OK',  btn_pry_color: 'primary',  btn_pry_otl: false,  btn_pry_act: 'closeAlert' }
        } 
      }

     
      this.action = type
      let validate_doc_name = true //Initially TRUE for (end transaction)
      validate_doc_name = (type === 'submit_to_doctor' && !this.doctor_data.doctor_name && this.$store.state.usr_credentials.user_type !== '9-1') ? false : true
  
      // DESTRUCTURE OBJECT DATA
      let {chief_complaint, service_availed, history_current_illness } = this.trans_data
      // let {height, weight} = this.patient_record
      let signs_and_symptoms_empty = false
      let social_history_empty = false
      let past_medical_empty = false
      let {blood_pressure_systolic, blood_pressure_diastolic, blood_pressure_2nd_systolic, blood_pressure_2nd_diastolic} = this.pex_data

      // Validate allergy field only if it's enabled in MedicalHistory.vue
      let is_allergy_field_required = this.allergy_enabled && !this.medical_history.allergies
      let is_family_allergy_field_required = this.family_allergy_enabled && !this.medical_history.family_medical_history.family_allergies

      // VALIDATE IF REFERRAL DATA IS EMPTY
      if(this.referral_data.referral_doctor_provider_name || this.referral_data.referral_doctor_first_name || this.referral_data.referral_doctor_middle_name || this.referral_data.referral_doctor_last_name || this.referral_data.referral_doctor_specialization || this.referral_data.referral_doctor_contact_number || this.referral_data.reason_for_referral){
        // if (!this.referral_data.referral_doctor_specialization || !this.referral_data.reason_for_referral) {
        //   this.referral_empty_fields = true
        // }
        const is_sta_rosa = this.$store.state.usr_credentials.lgu_host_code === 'SR';

        if ((is_sta_rosa && !this.eligible_data.konsulta_eligible && !this.referral_data.reason_for_referral) ||
          (!is_sta_rosa && (!this.referral_data.referral_doctor_specialization || !this.referral_data.reason_for_referral))
        ) {
          this.referral_empty_fields = true;
        }
      } else {
        this.referral_status = false
      }

      // VALIDATE IF COVID RECORD IS EMPTY
      /*if (this.covid_vaccination_record || this.booster_record) {
        const get_data = this.covid_vaccination_record.filter(item => item.is_edited);
        const get_booster = this.booster_record.filter(item => item.is_edited);

        if (get_data.length > 0) {
          get_data.map(item => {
            item.is_error = false; 
            return item;
          });
        }

        if (get_booster.length > 0) {
          get_booster.map(item => {
            item.is_error = false; 
            return item;
          });
        }

        this.cov_empty_fields = get_data.some(item => item.is_error) || get_booster.some(item => item.is_error);
      } */
      if(this.covid_vaccination_record || this.booster_record){
        const get_data = this.covid_vaccination_record.filter(item => item.is_edited)
        const get_booster = this.booster_record.filter(item => item.is_edited)
        
        if (get_data.length > 0) { 
          get_data.map((item,index) => {
            if (item.dose_brand) {
              item.is_error = false
            } else if (!item.dose_brand ) {
              if (index == 0 &&  index < get_data.length -1 && (get_data[index+1].date_time || get_data[index+1].dose_brand)) {
                item.is_error = true
              } else {
                item.is_error = false
                if (get_booster.length > 0 && (get_booster[0].dose_brand)) {
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
        
        this.cov_empty_fields = get_data.some(item => item.is_error === true)  || get_booster.some(item => item.is_error === true)
      }
  
      if (this.child_vaccination_record?.length > 0) {
        this.vac_has_empty = await this.$refs.vaccination_record.checkIfEmpty();
      } 

      //VALIDATE IF ELIGIBLE TO EKONSULTA TO REQUIRED THE SOCIAL HISTORY IN MEDICAL HISTORY
      if (this.eligible_data.konsulta_eligible && this.medical_history?.patient_social_history?.value?.length < 4) {
        social_history_empty = true;
        this.social_history_empty_field = true;
      } else {
        this.social_history_empty_field = false;
      }
      
      //VALIDATE IF ELIGIBLE TO ECLAIMS TO REQUIRED THE PAST MEDICAL HISTORY IN MEDICAL HISTORY
      if(this.eligible_data.eclaims_eligible && this.medical_history.past_medical_history.length == 0) {
        past_medical_empty = true
        this.past_medical_history_empty_field = true
      } else {
        this.past_medical_history_empty_field = false
      }

      // VALIDATE IF SIGNS AND SYMPTOMS IS EMPTY
      if (this.signs_and_symptoms.data.length == 0 ||  this.signs_and_symptoms.data.some(item => (item.duration === '' && item.symptom !== 'NONE') ||(item.symptoms_id === 'X' && (!item.symptom || item.symptom.trim() === '')))) {
          signs_and_symptoms_empty = true;
      }

      // VALIDATE THE TEXT FIELD FOR CUSTOM DURATION
      this.signs_and_symptoms_empty_field = signs_and_symptoms_empty;
      this.signs_and_symptoms.data.forEach(el => {
        if (el.duration && el.duration.includes('Custom')) {
          if (!el.custom_duration_input || el.custom_duration_input.trim() === '') {
            signs_and_symptoms_empty = true;
          }
        }
      });

      // VALIDATE IF FIRST BP IS INCOMPLETE
      if ((!blood_pressure_systolic && !blood_pressure_diastolic) || (blood_pressure_systolic && blood_pressure_diastolic)){
        this.is_bp_incomplete = false
      } else {
        this.is_bp_incomplete = true
      }

      // VALIDATE IF SECOND BP IS INCOMPLETE
      if ((!blood_pressure_2nd_systolic && !blood_pressure_2nd_diastolic) || (blood_pressure_2nd_systolic && blood_pressure_2nd_diastolic)){
        this.is_bp_2nd_incomplete = false
      } else {
        this.is_bp_2nd_incomplete = true
      }

      // VALIDATE OBGYNE
      if (this.member_data.member.mem_gender === 'FEMALE' && this.ob_gyne) {
        this.obg_empty_fields = this.$refs.ob.checkIfEmpty();
      }

      // function invalid_input(value) {
      //   if (!value) return true; 
      //   const normalized = value.trim().toLowerCase();
      //   const invalid = ["n/a", "none", "not applicable", "na"];
      //   return invalid.includes(normalized);
      // }

      // this.trans_data.chief_complaint = chief_complaint?.trim() || "";
      // this.trans_data.history_current_illness = history_current_illness?.trim() || "";

      if(this.$store.state.usr_credentials.user_type === '9-1') {
        if(this.offline_date_admitted.length <= 0 || this.offline_date_discharge.length <= 0) {
          this.offline_required_fields = true
        } else {
          this.offline_required_fields = false
        }
      } else {
        this.offline_required_fields = false
      }

      if (this.selected_medicine.length > 0) {
          const result = this.selected_medicine.some(element => !element.total_num_of_med || (element.medicine_code === 'OTC-0000' && element.other_drug_code === ''))
          
          if (result) {
              this.med_empty_fields = true
          } else {
            this.med_empty_fields = false
          }
      }

      // if(!this.treatment_recommendation && this.selected_icd.length > 0){
      //     const count = this.selected_icd.filter(item => item.procedures.length > 0)
          
      //     if(count.length > 0){
      //       this.phy_empty_fields = true
      //     }
      // }
      
      if (!this.treatment_recommendation) {
        this.treatment_submit_attempted = true;
      }

      this.pex_required_fields = this.$refs.physical_examination.checkIfEmpty()

      // let check_doctor = chief_complaint && this.doctor_data.doctor_code ? true : false // CHECK IF THE CHIEF COMPLAINT IS EMPTY AND HAVE A SELECTED DOCTOR.

      // let chief_complaint_required = !this.trans_data.chief_complaint;
      // let history_required = !this.trans_data.history_current_illness
      // const doctor_code_required = !this.doctor_data?.doctor_code;

      // if (this.eligible_data?.eclaims_eligible) {
      //   chief_complaint_required = invalid_input(this.trans_data.chief_complaint);
      //   history_required = invalid_input(this.trans_data.history_current_illness);
      // }

      // let check_doctor = !(chief_complaint_required || doctor_code_required || history_required);

      // this.consultation_data_required = !check_doctor;
      if (this.from_migration && !this.from_migration_procedure_result) {
        this.procedure_result_required = true

        this.alert = {
          display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Result Required', body: 'Please encode procedure results before proceeding.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'
        }

        return
      }
      
      if (this.doctor_data.doctor_code) {
        this.consultation_data_required = this.invalidInput(chief_complaint)
        // this.consultation_data_required_ill = this.invalidInput(history_current_illness)
        this.consultation_data_required_ill = this.eligible_data.eclaims_eligible ? this.invalidInput(history_current_illness) : false
        this.consultation_data_required_doc = false
      } else {
        if(type === 'submit_to_doctor'){
          this.consultation_data_required = this.invalidInput(chief_complaint)
          this.consultation_data_required_ill = this.eligible_data.eclaims_eligible ? this.invalidInput(history_current_illness) : false
          this.consultation_data_required_doc = true
        } else {
          this.consultation_data_required = false;
          this.consultation_data_required_ill = false;
          this.consultation_data_required_doc = false
        }
      }

      if (validate_doc_name && !this.consultation_data_required_doc && !this.consultation_data_required_ill && !this.consultation_data_required && service_availed && !social_history_empty && !past_medical_empty && !is_allergy_field_required && !is_family_allergy_field_required && !this.pex_required_fields && !this.treatment_recommendation_error && !this.med_required && !this.med_empty_fields && !this.offline_required_fields && (this.$store.state.usr_credentials.user_type === '9-1' ? true : this.med_quantity_has_data) && !this.obg_empty_fields && !this.vac_has_empty && !this.cov_empty_fields && !this.referral_empty_fields && !signs_and_symptoms_empty && !this.is_bp_incomplete && !this.is_bp_2nd_incomplete) {
        if (type === 'end_transaction' && this.doctor_data.doctor_name) {
          if (this.$store.state.usr_credentials.user_type === '9-1') {
            this.getDoctorData(this.doctor_data);
          } else {
            this.getDoctorData(null); // TO MAKE DOCTOR_OBJECT NULL AGAIN
          }
        }

        // if(this.eligible_data.konsulta_eligible){
        //   this.ekonsultaValidation()
        //   this.required_fields = false;
        //   this.confirmation_dialog = false;
        // } else {
        //   this.required_fields = false;
        //   this.confirmation_dialog = true;
        // }

        this.required_fields = false;
        this.confirmation_dialog = true;
      } else {
        this.required_fields = true
        this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Field is empty/Invalid Value', body: 'Please fill out all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      } 
    },

    //ALERT FOR COMPLETED TRANSACTION
    async ekonsultaValidation(){
      this.submit_to_doctor_midwife = true

      let payload = this.generateConsultationPayload();

      //Additional payload for konsulta validation
      payload.request_key = 'cs';
      payload.report_tagging = '1';

      let response = await this.$services.konsultaValidationReport(payload);

      if(response.status === 200) {
        this.submit_to_doctor_midwife = false
        if(response.data.success){
          this.hci_case_number = response.data.pHciCaseNo
          this.hci_trans_no = response.data.pHciTransNo
          this.transmittal_id = response.data.pTransmittalID
          
          this.alert_data = {
            display:true, 
            width: 620,
            icon: 'mdi-check-circle',
            color: 'success',
            title: 'Validated Successfully',
            sub_title: `You can now submit to doctor/midwife`,  
            downloadTextFile: true,                    
            xmlData: response.data.pReport, //The value should be the pReport from the response of validation.
            file_name: payload.report_tagging + "" + this.$store.state.prv_data.ekonsulta_phic_acc_no + "" + this.transmittal_id + ".xml"//The value should be report_tagging + "_" + phic_acc_no + "_" + transmittal_id + ".xml"
          }
        } else {
          this.alert_data = {
            display: true,
            width: 620,
            icon: 'mdi-alert-circle',
            color: 'yellow',
            title: 'PHIC Validation',
            sub_title: response.data.err_msg, //The value should be the error message of the response,
          }
        }
      } else {
        this.alert_data = {
          display: true,
          width: 620,
          icon: 'mdi-alert-circle',
          color: 'red',
          title: 'PHIC Validation',
          sub_title: 'There was a problem in PHIC web service.',
        }
      }
    },

    closeDialog() {
      this.alert_data = {}
      this.confirmation_dialog = true;
    },

    async confirm() {
      this.confirmation_dialog_loader = true

      if (this.action === 'end_transaction' && this.selected_medicine.length > 0 && this.$store.state.usr_credentials.user_type !== '9-1') {
        if (this.$store.state.usr_credentials.user_type === '2-1') {
          const result = await this.saveMedAdjustedQuantity();
          if (!result) {
            this.confirmation_dialog_loader = false;
            this.confirmation_dialog = false;
            this.action = '';
            return;
          }
        }
      }

      let payload = this.generateConsultationPayload();

      if(this.from_migration){
        this.updPreConsultation(this.selected_transaction.transaction_number)

        return
      }

      payload = this.request_data_payload ? this.request_data_payload.request_payload : payload

      let response = await this.$services.trnAddConsultation(payload);

      response.data = this.responseDataDecryption(response.data)

      if(response.status === 200) {
        let route_page = this.$store.state.usr_credentials.user_type === '9-1' ? '/offline-transaction' : '/code-scanning'
  
          if (response.data.transaction_number) {
            if (this.selected_referral) {
              await this.saveTransactionReferral();
            }

            if(this.referral_status){
              await this.saveReferralData(response.data.transaction_number);
            }

            if(this.eligible_data.konsulta_eligible){
              let is_emr =  0
              await this.saveEkonsulta(is_emr, route_page, response.data.transaction_number, 'pre_con');
            }

            if (this.process_type === "PHIC" || this.process_type === 'LGU' || this.process_type === 'PHIC_LGU' || this.action === 'end_transaction') {
              sessionStorage.removeItem('oIohiK_pvcE')
              sessionStorage.removeItem('pvceifcaqpcig')
              this.$store.state.teleconsult_data = []

              if(this.$store.state.usr_credentials.user_type === '9-1' && this.doctor_data.doctor_code) {
                this.emr_params.transaction_number = response.data.transaction_number
                
                //TRIGGER THE UPDATE PRE CONSULTATION IF THE PATIENT IS NOT ELIGIBLE FOR EKONSULTA IN POST ENCODING
                if(!this.eligible_data.konsulta_eligible) {
                  let patient_assessment = { assessment: this.patient_assessment }

                  //TRIGGER THE DEFAULT VALUE OF PATIENT ASSESSMENT FOR KONSULTA PATIENT IN POST ENCODING.
                  await this.$refs.physical_examination.postData(response.data.transaction_number, patient_assessment);

                  await this.updPreConsultation(response.data.transaction_number)
                }
              } else {
                this.$store.commit('set_transaction_flag', 1)
                this.successTransaction(route_page)
                //this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: 'Transaction has been completed', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'redirect', btn_pry_params: `${route_page}` }    
              }
              return
            } 
            
            const session_data = {
              max_coverage_bal: parseFloat(this.member_data.member.hmo_max_coverage_bal),
              loa_generation_date: response.data.loa_generation_date,
              loa_expiration_date: response.data.loa_expiration_date,
              transaction_number: response.data.transaction_number,
              icd_limit_bal: this.icd_cpt[0].hmo_icd_limit_bal,
              chief_complaint: this.doctor_data.chief_complaint,
              hmo_icd_status: payload.hmo_icd_status,
              hmo_cpt_status: payload.hmo_cpt_status,
              icd_cpt_data: this.icd_cpt,
              doctor_data: this.doctor_data,
              is_scanned: "0",
            };
            sessionStorage.setItem("LZ19XD15S0Y1YU",this.$crypto.AES.encrypt(JSON.stringify(session_data),"hEsi2Q2qY9t1"));
            this.$router.replace("/admission/consultation-result");
          }else{
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            return
          }
      } else {
        this.$store.commit('set_transaction_flag', 1)
        this.alert = response.error
      }
    },

    generateConsultationPayload() {
      //GET CONSUL RATE
      let consul_rate = this.member_data.config ? parseFloat(this.member_data.config.consul_rate) : 0; 
      
      // INITIALIZATION OF DATE, EXPIRATION, HMO ICD/CPT STATUS
      let date_today   = null,
      expiration_date  = null,
      transaction_type = 'CONSULTATION',
      transaction_status = 'ISSUED';
      
      // GENRATION OF VALIDITY AND EXPIRATION 
      // date_today = this.$moment().format("Y-M-D");
      // expiration_date = this.$moment(date_today).add(this.member_data.config.host_loa_validity,"days");
      // expiration_date = this.$moment(expiration_date, "days").format("Y-M-D");

      date_today = this.$moment().format("YYYY-MM-DD");
      expiration_date = this.$moment(date_today).add(this.member_data.config.host_loa_validity,"days");
      expiration_date = this.$moment(expiration_date, "days").format("YYYY-MM-DD");

      let hmo_icd_status = this.member_data.member.mem_hmo_host_code === 'FC' ? 'NEEDS APPROVAL' : 'COVERED'
      let hmo_cpt_status = this.member_data.member.mem_hmo_host_code === 'FC' ? 'NEEDS APPROVAL' : 'COVERED'

      // FC VALIDATION
      if (this.process_type.includes('HMO') && (this.member_data.member.mem_hmo_host_code !== "FC" || this.member_data.member.mem_hmo_host_code !== "FL")) {
          if (this.member_data.config.consultation_auto_approval != 'true') {
              hmo_cpt_status = "NEEDS APPROVAL";
              hmo_icd_status = hmo_cpt_status;
          }
          hmo_cpt_status = parseFloat(this.member_data.member.hmo_max_coverage_bal) >= parseFloat(this.icd_cpt[0].procedure_list[0].cpt_rate) ? 'COVERED' : 'DISAPPROVED';
          hmo_icd_status = hmo_cpt_status;
      }
  
      let get_covid_post_data = null
      if(this.covid_vaccination_record || this.booster_record) {
         get_covid_post_data = this.getPostCovidData() 
         get_covid_post_data = get_covid_post_data.length > 0 ? get_covid_post_data : null
      }

      if (this.pex_data.blood_pressure_systolic && this.pex_data.blood_pressure_diastolic) {
          this.pex_data.blood_pressure = this.pex_data.blood_pressure_systolic + '/' +  this.pex_data.blood_pressure_diastolic
          delete this.pex_data['blood_pressure_systolic']
          delete this.pex_data['blood_pressure_diastolic']
      }

      if (this.pex_data.blood_pressure_2nd_systolic && this.pex_data.blood_pressure_2nd_diastolic) {
          this.pex_data.blood_pressure_2nd = this.pex_data.blood_pressure_2nd_systolic + '/' +  this.pex_data.blood_pressure_2nd_diastolic
          delete this.pex_data['blood_pressure_2nd_systolic']
          delete this.pex_data['blood_pressure_2nd_diastolic']
      }

      if (this.action === 'end_transaction' && this.selected_medicine.length > 0 && !this.$store.state.usr_credentials.user_type === '9-1') {
        this.selected_medicine.map(items => {
          items.total_dispensed_medicine = items.total_num_of_med
          return items
        })
      }

      delete this.patient_record['left_one']
      delete this.patient_record['left_two']
      delete this.patient_record['right_one']
      delete this.patient_record['right_two']

      if(this.$refs.ob){
        if (this.member_data.member.mem_gender === 'FEMALE' && this.$refs.ob.obg_data.data.has_data) {
          const { data } = this.$refs.ob.obg_data
          // ADD EDB
          let edb = null
          let aog = null
          if (data.ob_gyne === 'OB') {
            edb = data.edb ? this.$moment(data.edb).format('YYYY-MM-DD') : null
            aog = data.aog ? data.aog : null
          }
          
          this.ob_gyne = {
              ob_gyne: data.ob_gyne ? data.ob_gyne : null,
              lmp: data.lmp ? data.lmp : null,
              pmp: data.pmp ? data.pmp : null,
              aog: aog,
              m: data.m,
              mens_cycle: data.mens_cycle,
              i: data.i ? data.i + ' Days' : null,
              d: data.d ? data.d + ' Days' : null,
              a: data.a,
              s: data.s,
              si: data.si,
              mp: data.mp,
              edb: edb,
              date_of_delivery: data.date_of_delivery ? data.date_of_delivery : null,
              time_of_delivery: data.time_of_delivery ? data.time_of_delivery : null,
              place_of_delivery: data.place_of_delivery ? data.place_of_delivery : null,
              nsd_cs: data.nsd_cs ? data.nsd_cs : null,
              attended_by: data.attended_by ? data.attended_by : null,
              bo_sex: data.bo_sex ? data.bo_sex : null,
              bo_length: data.bo_length ? data.bo_length : null,
              bo_birth_weight: data.bo_birth_weight ? data.bo_birth_weight : null,
              bo_head_circumference: data.bo_head_circumference ? data.bo_head_circumference : null,
              weight_for_age: data.weight_for_age ? data.weight_for_age : null,
              height_for_age: data.height_for_age ? data.height_for_age : null,
              weight_for_height: data.weight_for_height ? data.weight_for_height : null,
              pregnancy_term: data.pregnancy_term ? data.pregnancy_term : null,
              is_live_birth: data.is_live_birth ? data.is_live_birth : null,
              is_abortion_or_miscarriage: data.is_abortion_or_miscarriage ? data.is_abortion_or_miscarriage : null,
              menopause: data.menopause ? data.menopause : null,
          }
        }
      }

      if (this.action === 'submit_to_doctor') {
        transaction_type = 'PRE CONSULTATION'
        transaction_status = this.process_type.includes('HMO') ? "ON PROCESS" : "TO PROCESS"
      }

      // Medical History
      let past_history = this.medical_history.past_medical_history.map(element => {
        if (element.description.substring(0, 7) === 'OTHERS:') element.description = 'OTHERS-' + element.description.substring(8)

        return {
          mdisease_code: element.code,
          disease: element.description || null
        }
      })

      let family_history = this.medical_history.family_medical_history.value.map(element => {
        if (element.description.substring(0, 7) === 'OTHERS:') element.description = 'OTHERS-' + element.description.substring(8)

        return {
          mdisease_code: element.code,
          family_past_medical_history: element.description || null,
          family_history_classification: element.classification
        }
      })

      //CHECKING IF ELIGIBLE TO EKONSULTA TO ADD DEFAULT VALUE ON PAST MEDICAL HISTORY AND FAMILY HISTORY

      if(this.eligible_data.konsulta_eligible){
        if(past_history.length === 0) {
          past_history = [
            { 
              mdisease_code: '999',
              disease: 'None'
            }
          ]
        } 

        if(family_history.length === 0) {
          family_history = [
            {
              mdisease_code: '999',
              family_past_medical_history: 'None',
              family_history_classification: ""
            }
          ]
        }
      } 

      if(family_history.some(el => el.family_past_medical_history === 'DIABETES MELLITUS')) {
        this.has_diabetes = true
      } else {
        this.has_diabetes = false
      }

      // Physical Examination
      delete this.patient_assessment['fresh_load']
      const get_keys = Object.keys(this.patient_assessment)
      get_keys.forEach(category => {
        if (this.patient_assessment[category].others_notes !== null) {
          this.patient_assessment[category].assessment.forEach((element, index) => {
            if (element.assessment === this.patient_assessment[category].others_notes) {
              this.patient_assessment[category].assessment.splice(index, 1)
            }
          })

          // REMOVE THE PREFIX OF OTHERS BEFORE POSTING
          this.patient_assessment[category].others_notes = this.patient_assessment[category].others_notes.substring(8)
        } else {
          this.patient_assessment[category].others_notes = null 
        }
      })

      this.signs_and_symptoms.data.forEach(el => {
          if (el.custom_duration_input !== undefined && el.custom_duration_input !== '') {
              el.duration = `Custom-${el.custom_duration_input} days`;
              delete el.custom_duration_input;
          } 
      });

      
      // MERGE PREVIOUS RECORDS FROM TBL_ITEMS WITH THE NEW VACCINATION RECORD
      let vac_data_table = this.$refs.vaccination_record ? this.$refs.vaccination_record.tbl_items : []
      let merged_vaccination_records = [
        ...vac_data_table,
        ...(Array.isArray(this.child_vaccination_record) ? this.child_vaccination_record : [])
      ];

      let payload = {
        atc: this.eligible_data.atc,
        hmo_policy_number: this.member_data.member.mem_hmo_policy_number,
        hmo_host_code: this.member_data.member.mem_hmo_host_code,
        hmo_healthcare_status: this.member_data.member.mem_hmo_status,
        provider_code: this.$store.state.prv_data.provider_code,
        provider_tin: this.$store.state.prv_data.provider_tin,
        provider_name: this.$store.state.prv_data.provider_name,
        transaction_type: transaction_type,
        chief_complaint: this.trans_data.chief_complaint,
        current_history_illness: this.trans_data.history_current_illness,
        // current_history_illness: this.eligible_data.eclaims_eligible && !this.trans_data.history_current_illness ? 'NA' : (this.trans_data.history_current_illness || 'NA'),
        created_by: this.$store.state.usr_credentials.user_name,
        doctor_code: this.doctor_data.doctor_code ? this.doctor_data.doctor_code : undefined,
        doc_phic_acc_no: this.doctor_data.doctor_phic_account_no ? this.doctor_data.doctor_phic_account_no : undefined,
        doc_prc_license: this.doctor_data.doctor_prc_license ? this.doctor_data.doctor_prc_license : undefined,
        approval_code: 'N/A',
        hmo_max_coverage_bal: parseFloat(this.member_data.member.hmo_max_coverage_bal),
        consultation_rate: consul_rate,
        room_type: this.member_data.member.mem_room_plan,
        room_rate: this.member_data.member.mem_room_rate,
        is_service_rendered: "0",
        service_feedback: "N/A",
        reason_for_not_rendered: "N/A",
        doctor_tin: this.doctor_data.doctor_tin ? this.doctor_data.doctor_tin : undefined,
        loa_generated_date: date_today,
        loa_expiration_date: expiration_date,
        agent_transaction_status_cc_ref: hmo_cpt_status == "COVERED" || hmo_cpt_status == "DISAPPROVED" ? "0" : "1",
        transaction_status: transaction_status,
        request_type: "WEB",
        on_queue: 1,
        processing_by: this.$store.state.usr_credentials.user_name,
        ek_lgu_id:  this.member_data.member.ek_lgu_id ?  this.member_data.member.ek_lgu_id : null,
        lgu_host_code : this.member_data.member.lgu_host_code,
        process_type: this.process_type,

        ...(this.process_type !== 'HMO' ? {
          host_claim_type: "NOT FOR CLAIMS",
          ek_phic_id: this.member_data.member.ek_phic_id ? this.member_data.member.ek_phic_id  : null,
          first_name: this.member_data.member.mem_first_name ? this.member_data.member.mem_first_name.toUpperCase() : '',
          middle_name: this.member_data.member.mem_middle_name ? this.member_data.member.mem_middle_name.toUpperCase() : '',
          last_name: this.member_data.member.mem_last_name ? this.member_data.member.mem_last_name.toUpperCase() : '',
          suffix: this.member_data.member.mem_suffix ? this.member_data.member.mem_suffix.toUpperCase() : '',
          birthday: this.member_data.member.mem_birthdate,
          mem_phic_pin: this.member_data.member.mem_phic_pin,
          phic_host_code: this.member_data.member.mem_phic_pin ? 'PHIC' : '',
          blood_type: this.member_data.member.blood_type
        }: undefined),
        
        has_emr_record:true,

        // MEDICAL HISTORY
        patient_medical_history: {
          past_medical_history: past_history,
          previous_hospitalization: this.medical_history.previous_hospitalization,
          previous_hospitalization_date: this.medical_history.previous_hospitalization_date ? this.medical_history.previous_hospitalization_date : null,
          previous_surgeries: this.medical_history.previous_surgeries,
          previous_surgeries_date: this.medical_history.previous_surgeries_date ? this.medical_history.previous_surgeries_date : null,
          allergies: this.medical_history.allergies,
          has_previous_record: this.medical_history.has_previous_record
        },
        patient_current_medicine: {
          has_previous_record: this.medical_history.current_medicine.has_previous_record,
          medicine: this.medical_history.current_medicine.value
        },
        family_past_medical_history: {
          has_previous_record: this.medical_history.family_medical_history.has_previous_record,
          history: family_history,
          family_allergies: this.medical_history.family_medical_history.family_allergies
        },
        patient_social_history: {
          has_previous_record: this.medical_history.patient_social_history.has_previous_record,
          social_history: this.medical_history.patient_social_history.value,
        },

        ob_gyne_history: this.ob_gyne,
        patient_ob_gyne: this.patient_ob_gyne,
        previous_complication: this.previous_complication,
        prenatal_consultation: this.prenatal_consultation,
        prenatal_screening: this.prenatal_screening,
        postpartum_consulation: this.postpartum_consulation,
        family_planning_consultation: this.family_planning_consultation,
        child_vaccination_record: { 
          vaccine: merged_vaccination_records
        },

        patient_record: this.patient_record,
        physical_exam_data: this.pex_data,
        general_survey: {
          general_survey: this.general_survey,
          general_survey_notes: this.general_survey_notes ? this.general_survey_notes : null
        },
        // patient_heent: {
        //   heent: this.patient_heent.heent,
        //   other_notes: this.patient_heent.other_heent ? this.patient_heent.other_heent : null,
        // } ,
        patient_assessment: this.patient_assessment,

        vaccination_record: get_covid_post_data,
        patient_medicine: this.selected_medicine,
        diet: this.plan_data.diet,
        fluid_intake: this.plan_data.fluid_intake,
        follow_up_consultation_date: this.plan_data.follow_up_consultation_date,

        purpose_of_visit_service_availed: this.trans_data.service_availed,
        operator_notes: this.trans_data.operator_notes,

        dietary_intake: this.dietary_information,
        patient_symptoms: this.signs_and_symptoms.data,
        close_contact_tb: this.close_contact_tb.value ? this.close_contact_tb.value : undefined,

        acknowledgement_referral_code: this.selected_referral ? this.selected_referral.referral_code : undefined,

        diagnostic_exam_result: this.diagnostic_exam_result,

        ncdQans: {
          ...this.ncdqans,
          ek_lgu_id: this.member_data.member.ek_lgu_id
        },

        tele_consult: this.for_tele_consult? '1' : '0',
        ...(this.for_tele_consult? {
          viber_number: this.viber_number ? this.viber_number : undefined,
          mobile_number: this.mobile_number ? this.mobile_number : undefined,
          preffered_contact_no: this.member_data.member.mem_mobile_number? this.member_data.member.mem_mobile_number : undefined,
          gender: this.member_data.member.mem_gender,
          age: this.member_data.member.mem_age,
          clinic_schedule: this.clinic_schedule ? this.clinic_schedule : undefined
        } : undefined),

        hmo_cpt_status: hmo_cpt_status,
        hmo_icd_status: hmo_icd_status,
        with_consent: this.with_consent ? this.with_consent : null,
        is_data_encoder: this.$store.state.usr_credentials.user_type === '9-1' ? 1 : 0,
        ekonsulta_eligible: this.eligible_data.konsulta_eligible,
        eligible_trans: this.selected_eligible_tran,
        date_admitted: this.offline_date_admitted ? this.$moment(this.offline_date_admitted).format('YYYY-MM-DD') : undefined,
        date_discharged: this.offline_date_discharge ? this.$moment(this.offline_date_discharge).format('YYYY-MM-DD') : undefined
      };
      
      return payload;
    },

    successTransaction(route_page) {
      this.confirmation_dialog_loader = false
      this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: 'Transaction has been completed', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'redirect', btn_pry_params: `${route_page}` }       
    },

    //UPDATE PRE CONSULTATION IN FOR OFFLINE TRANSACTION
    async updPreConsultation(transaction_number) {
      const icd_cpt = this.selected_icd.map((icd, index) => {
          if(icd.icd_code){
              return {
                  icd_code: icd.icd_code,
                  icd_description: icd.icd_description,
                  category_description_id: icd.icd_category.selected.category_description_id,
                  ph_category: icd.icd_code_description.ph_category,
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
                              diag_exam_status: 'N',
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
      if (this.eligible_data.konsulta_eligible) {

        if (!Array.isArray(this.select_management) || this.select_management.length === 0) {
          this.select_management = [{
            lib_id: '0',
            management_description: 'Not Applicable'
          }]
        }

        if (!this.doctor_notes) {
          this.doctor_notes = 'N/A'
        }

        if (!this.history_current_illness) {
          this.history_current_illness = 'N/A'
        }
      }

      let trn_update_pre_cons_payload = {
        transaction_number: transaction_number,
        provider_code: this.$store.state.prv_data.provider_code,
        referral_code: this.referral_data.referral_code,
        icd_cpt_data: icd_cpt,
        patient_medicine: this.selected_medicine,
        date_admitted: this.$moment(this.offline_date_admitted).format('YYYY-MM-DD'),
        date_discharged: this.$moment(this.offline_date_discharge).format('YYYY-MM-DD'),
        transaction_type: 'CONSULTATION',
        transaction_status: 'ISSUED',
        treatment_recommendation: this.treatment_recommendation,
        notes_management: {                
          management: Array.isArray(this.select_management) 
              ? this.select_management.map(item => ({
                  lib_id: item.lib_id,
                  management_description: item.management_description
                }))
              : [],
          doctor_notes: this.trans_data.operator_notes
        },
        admitting_diagnosis: this.admitting_diagnosis,
        current_history_illness: this.trans_data.history_current_illness,
        // current_history_illness: this.eligible_data.eclaims_eligible && !this.trans_data.history_current_illness ? 'NA' : (this.trans_data.history_current_illness || 'NA'),
        chief_complaint: this.trans_data.chief_complaint,
        process_by: this.$store.state.usr_credentials.user_name,
        is_off_transaction: this.$store.state.usr_credentials.user_type === '9-1' ? true : false,
        ekonsulta_eligible: this.eligible_data.konsulta_eligible,
        eclaims_eligible: this.eligible_data.eclaims_eligible,
        doctor_code: this.$store.state.usr_credentials.user_type === '9-1' && this.from_migration && this.doctor_data.doctor_code ? this.doctor_data.doctor_code : undefined,
        doc_phic_acc_no: this.$store.state.usr_credentials.user_type === '9-1' && this.from_migration && this.doctor_data.doctor_phic_account_no ? this.doctor_data.doctor_phic_account_no : undefined,
        doc_prc_license: this.$store.state.usr_credentials.user_type === '9-1' && this.from_migration && this.doctor_data.doctor_prc_license ? this.doctor_data.doctor_prc_license : undefined,
        doctor_tin: this.$store.state.usr_credentials.user_type === '9-1' && this.from_migration && this.doctor_data.doctor_tin ? this.doctor_data.doctor_tin : undefined, 
      }

      trn_update_pre_cons_payload = this.request_data_payload ? this.request_data_payload.request_payload : trn_update_pre_cons_payload
      
      
      let response = await this.$services.trnUpdatePreConsultation(trn_update_pre_cons_payload)

      if(response.status === 200) {
        let route_page = '/offline-transaction'

        let is_emr = trn_update_pre_cons_payload.icd_cpt_data[0] ? 1 : 0 // IF THE TRANSACTION HAS ICD, THE VALUE OF IS EMR IS 1. 0 IF NOT
        let transaction_number = trn_update_pre_cons_payload.transaction_number || transaction_number

        if(this.eligible_data.konsulta_eligible){
          this.saveEkonsulta(is_emr, route_page, transaction_number, 'emr_con')
        } if(this.eligible_data.eclaims_eligible){
          this.getEclaimsWebService(route_page, transaction_number)
        } else {
          this.$store.commit('set_transaction_flag', 1)
          this.successTransaction(route_page)
        }
        
        if(this.from_migration){
          this.submitEncodedResult()
        }
      } else {
        this.$store.commit('set_transaction_flag', 1)
        this.alert = response.error
      }
    },

    // TRIGGER FOR UPDATING PBEF
    async getEclaimsWebService(route_page, transaction_number) {
      return await this.$services.getEclaimsWebService({
          // provider_code: "EKDF21B239E8232403",
          provider_code: this.$store.state.prv_data.provider_code,
          request_key: "ICEM",
          data: {
              ek_lgu_id: this.member_data.member.ek_lgu_id,
              member_pin: this.member_data.member.mem_phic_pin,
              transaction_number: transaction_number
          }
      })
      .then(() => {
          this.successTransaction(route_page)
      }).catch(error => {
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      });
    },

    async submitEncodedResult(){
      let response = await this.$services.trnAddPvtResults({
          // diagnostic_exam_result: this.diagnostic_exam_result,
          ...this.diagnostic_exam_result,
          request_key: 'submit_result',
          ek_lgu_id: this.emr_params.ek_lgu_id,
          updated_by: this.usr_credentials.user_name,
          provider_code: this.$store.state.prv_data.provider_code
      })

      if(response.status === 200) {
        let route_page = '/offline-transaction'
        
          if(response.data.success) {
              // this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-check-circle', color: 'success', title: 'Result has been submitted', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
              this.successTransaction(route_page)
          }
      } else {
        this.$store.commit('set_transaction_flag', 1)
        this.alert = response.error
      }
    },

    async saveTransactionReferral() {
      let transaction_referral_payload = {
        ek_lgu_id: this.emr_params.ek_lgu_id,
        referral_code: this.selected_referral.referral_code,
        status: '2',
        acknowledged_by_user_code: this.$store.state.usr_credentials.user_code,
        acknowledged_by_operator_name: this.$store.state.usr_credentials.user_complete_name,
      }

      transaction_referral_payload = this.request_data_payload ? this.request_data_payload.request_payload : transaction_referral_payload
      
      return this.$services.trnUpdateTransactionReferral(transaction_referral_payload)
      .then(response => {
        if(!response.data.success){
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }

        this.$store.commit('set_transaction_flag', 1)
      })
      .catch(error => {
        this.$store.commit('set_transaction_flag', 1)
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      })
    },

    async saveReferralData(transaction_number){
      let update_patient_tran_record_payload = {
        request_key: 'referral',
        ek_id: '',
        ek_lgu_id: this.emr_params.ek_lgu_id,
        ek_hmo_id: this.emr_params.ek_hmo_id,
        lgu_number: '',
        policy_number: this.emr_params.hmo_policy_number,
        phic_number: this.emr_params.ek_phic_id,
        transaction_number: transaction_number,
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
        referring_doctor_tin: '',
        referring_doctor_code: '',
        referring_doctor_provider_tin: this.$store.state.prv_data.provider_tin,
        referring_doctor_provider_code: this.$store.state.prv_data.provider_code,
        referring_doctor_contact_no: '',
        status: '0',
        process_by: this.$store.state.usr_credentials.user_name
      }

      update_patient_tran_record_payload = this.request_data_payload ? this.request_data_payload.request_payload : update_patient_tran_record_payload

     return this.$services.trnUpdatePatientTranRecord(update_patient_tran_record_payload, 'saveReferralData')
      .then(response => {
        if(!response.data.success){
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }

        this.$store.commit('set_transaction_flag', 1)
      })
      .catch(error => {
        this.$store.commit('set_transaction_flag', 1)
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      })
    },

    async saveMedAdjustedQuantity() {
      const adjusted_qty = this.selected_medicine.map(item => {
          return {
            requested_quantity: item.total_num_of_med,
            medicine_code: item.otc_medicine_code,
            lot_no: item.lot_no
          }
      })
      // trn_adjust_medicine_quantity
      let response = await this.$services.trnAdjustMedicineQuantity({
        provider_code: this.$store.state.prv_data.provider_code,
        data: adjusted_qty,
      })
      response.data = this.responseDataDecryption(response.data)

      // IF ALL MEDICINE RETURN STATUS IS SUCCESS
      if (Object.entries(response.data).every(items => items[1].status === 'success')) 
          return true

      // IF SOME OF MEDICINE RETURN STATUS IS SUCCESS
      if (Object.entries(response.data).some(items => items[1].status === 'failed')) {
          this.alert = {
              display: true, 
              type: 'standard', 
              width: '350', 
              icon: 'mdi-alert-circle', 
              color: 'red', 
              title: 'Network Error', 
              body: 'Please try again', 
              btn_pry_txt: 'OK', 
              btn_pry_color: 'primary', 
              btn_pry_otl: false, 
              btn_pry_act: 'closeAlert' 
          }
          return false
      }
      // IF SOME RETURN STATUS HAS INSUFFICIENT
      
      let get_medicine_code = [], insufficient_qty = []

      Object.entries(response.data).map(items =>{
        if (items[1].status === 'insufficient') {
            get_medicine_code.push(items[0])
            insufficient_qty.push({medicine_code: items[0],  current_quantity: items[1].current_quantity ? items[1].current_quantity : 0})
        } 
      })

      this.selected_medicine.filter(medicine => get_medicine_code.includes(medicine.otc_medicine_code)).map((item,key) => {
          insufficient_qty[key].generic_name = item.generic_name
          return item
      })

      const msg_body_insufficient = "<div class='my-3'><h6 class='body-2 font-weight-medium  mb-3'>"+insufficient_qty.map((item,index) => index + 1 +') '+item.generic_name +': (<span class="body-2">Remaining Qty: <b class="ml-auto">'+item.current_quantity+'</b>)</span>').join('<br/>')+"</h6></div>"
      const note = "<div class='mt-3 caption'><i>Note: Quantity may be changed after other users dispensed the same medicine</i></div>"
      this.alert = {
          display: true, 
          type: 'standard', 
          width: 650, 
          icon: 'mdi-alert-circle', 
          color: 'yellow darken-1', 
          title: 'The following medicine has insufficient quantity: ', 
          body: `${msg_body_insufficient} ${note}`,
          btn_pry_txt: 'OK', 
          btn_pry_color: 'primary', 
          btn_pry_otl: false, 
          btn_pry_act: 'closeAlert' 
      }
      return false
    },

    getReferralData(data){
      this.referral_data = data
    },

    getTeleConsultData(data){
      this.doctor_data = {
        doctor_code: data.doctor_code,
        doctor_name: data.doctor_name,
        specialization: data.specialization,
        doctor_tin: data.doctor_tin,
        doctor_prc_license: data.doc_prc_license,
        doctor_phic_account_no: data.doctor_prc_license,
        displayed_text: '',
      }
      this.clinic_schedule = data.clinic_schedule
      this.viber_number = data.viber_number
      this.mobile_number = data.mobile_number
    },

    openReferralForm(){
      this.referral_empty_fields = false
      this.bmi_data = {bmi: this.patient_record.bmi || '', remarks: this.patient_record.bmi_remarks || ''}
      this.$refs.doctor_referral.openDoctorReferral()
      // this.display_doctor_referral = true
    },

    openTeleConsult() {
      if(this.doctor_data.displayed_text) {
        this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'TELEMEDICINE ASSISTED REFERRAL', body: "The selection for 'Search for Midwife / Doctor' will be cleared! Do you want to continue?", btn_pry_txt: 'Cancel', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert',  btn_sec_txt: 'Confirm', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert',  btn_sec_emt:'teleConsultDialog'}
      } else {
        this.display_teleconsult_referral = true
      }
    },

    teleConsultDialog() {
      this.doctor_data = {}
      this.display_teleconsult_referral = true
    },

    async getClinicalAbstract(transaction_number) {
      
      let pertinent_pe_findings = {}

      for (const key in this.patient_assessment) {
        if (this.patient_assessment[key].assessment && this.patient_assessment[key].assessment.length > 0) {
          pertinent_pe_findings[key[0].toUpperCase() + key.substring(1)] = this.patient_assessment[key].assessment.map(element => element.assessment)
        }
      }

      // if (this.patient_assessment.heent.length > 0 || this.patient_assessment.others_notes) {
      //   pertinent_pe_findings['Heent'] = [...this.patient_assessment.heent.map(element => element.heent)]

      //   if (this.patient_assessment.others_notes) {
      //     pertinent_pe_findings['Heent'].push(`Others: ${this.patient_assessment.others_notes}`)
      //   }
      // }

      const data = {
        referral_code: this.selected_referral ? this.selected_referral.referral_code : '',
        referring_agency: this.selected_referral ? this.selected_referral.referring_doctor_provider_name : '',
        date_time_referred: this.selected_referral ? this.formatDate(this.selected_referral.date_of_referral) : '',

        patient_name: this.member_data.member.p_name,
        birthdate: this.formatDate(this.member_data.member.mem_birthdate),
        age: this.getAge(this.member_data.member.mem_birthdate),
        sex: this.formatGender(this.member_data.member.mem_gender),
        civil_status: this.member_data.member.mem_civil_status,
        religion: this.member_data.member.mem_religion,
        complete_address: this.member_data.member.mem_complete_address,
        
        phic_member: this.member_data.member.mem_phic_pin ? 'Yes' : 'No',
        referring_doctor: this.selected_referral ? this.selected_referral.doctor_full_name : '',
        chief_complaint: this.trans_data.chief_complaint,

        blood_pressure: (this.pex_data.bp_systolic ? this.pex_data.bp_systolic : '') + ' / ' + (this.pex_data.bp_diastolic ? this.pex_data.bp_diastolic : ''),
        heart_rate: this.pex_data.heart_rate,
        respiration_rate: this.pex_data.respiration_rate,
        temp: this.pex_data.temp,
        weight: this.patient_record.weight,
        o2sat: this.pex_data.oxygen_saturation,

        pertinent_pe_findings: pertinent_pe_findings,
        reason_for_referral: this.referral_data.reason_for_referral ? this.referral_data.reason_for_referral : '',
        admitting_diagnosis: this.admitting_diagnosis,
        current_history_illness: this.trans_data.history_current_illness, 
        // current_history_illness: this.eligible_data.eclaims_eligible && !this.trans_data.history_current_illness ? 'NA' : (this.trans_data.history_current_illness || 'NA'),
        impression_diagnosis: this.selected_icd.length > 0 ? (this.selected_icd[0].icd_code ? this.selected_icd[0].icd_code + ' / ' + this.selected_icd[0].icd_description : '') : '',
        procedure_list: this.selected_icd.length > 0 ? (this.selected_icd[0].icd_code ? this.selected_icd[0].procedures: '') : '',
        selected_medicine: this.selected_medicine,
        doctor_notes: this.doctor_notes
      }

      this.$refs.clinical_abstract.openClinicalAbstract(
        data, 
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
          false,
          transaction_number
      );
    },

    viewClinicalAbstract() {
      this.getClinicalAbstract(this.transaction_number);
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

        const data = {
            date_admitted: this.dateToday('MM-DD-YYYY'),
            patient_name: this.combineString([this.member_data.member.mem_first_name, this.member_data.member.mem_middle_name, this.member_data.member.mem_last_name, this.member_data.member.mem_suffix]),
            patient_age: this.member_data.member.mem_age,
            patient_gender: this.member_data.member.mem_gender,
            patient_civil_status: this.member_data.member.mem_civil_status,
            address: this.combineString([this.member_data.member.mem_home_bldgno, this.member_data.member.mem_home_bgy, this.member_data.member.mem_home_city_municipality, this.member_data.member.mem_home_province, this.member_data.member.mem_home_zip]),
            impression_diagnosis: impression_diagnosis,
            laboratory_request: laboratory_request,
            selected_medicine: this.selected_medicine,
            doctor_name: this.doctor_data.doctor_name,
            doctor_name2: this.doctor_data.doctor_name,
            doctor_specialization: this.doctor_data.specialization,
            doctor_position: this.doctor_data.doctor_position ? this.doctor_data.doctor_position : '',
            doctor_prc_license: this.doctor_data.doctor_prc_license,
            chief_complaint: this.trans_data.chief_complaint,
            ek_lgu_id: this.member_data.member.ek_lgu_id,
        }
        
        this.$refs.medical_certificate.openMedicalCertificate(data);
    },

    /* UTILITIES */
    // FOR GETTING THE MODIFIED DATA OF COVID FOR POSTING IN TRN ADD CONSULTATION
    getPostCovidData() {
        const get_combine_data = [...this.covid_vaccination_record, ...this.booster_record]

        return get_combine_data.filter (data => data.dose_brand ).map(item => {
            delete item.is_edited
            delete item.is_error
            delete item.date_time_display

            return {
              ...item,
              is_pending: '0',
              disease: 'COVID',
              doctor_code: this.doctor_data.doctor_code,
              doctor_tin: this.doctor_data.doctor_tin,
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
    },

    //SELECT DOCTOR FROM AUTOCOMPLETE
    getDoctorData(item){
      this.consultation_data_required = false

      if(!this.for_tele_consult) {
        if(!item){  // IF USER USE BACKSPACE TO DELETE THE DATA
          this.doctor_data.doctor_code             =  ''
          this.doctor_data.doctor_name             =  ''
          this.doctor_data.specialization          =  ''
          this.doctor_data.doctor_tin              =  ''
          this.doctor_data.doctor_prc_license      =  ''
          this.doctor_data.doctor_phic_account_no  =  ''
          this.doctor_data.displayed_text        =  ''
        }else{
          this.doctor_data.doctor_code             = item.doctor_code ? item.doctor_code : ''
          this.doctor_data.doctor_name             = item.doctor_name ? item.doctor_name : '' 
          this.doctor_data.specialization          = item.specialization ? item.specialization : '' 
          this.doctor_data.doctor_tin              = item.doctor_tin ? item.doctor_tin : ''
          this.doctor_data.doctor_prc_license      = item.doctor_prc_license ? item.doctor_prc_license : ''
          this.doctor_data.doctor_phic_account_no  = item.doctor_phic_account_no ? item.doctor_phic_account_no : '' 
          this.doctor_data.displayed_text        = `${item.doctor_name} / ${item.specialization} ${item.doctor_tin}`
          let get_specialization = { specialization: item.specialization}
          this.update_specialization(get_specialization)

          sessionStorage.setItem('yhi7998ssg', this.$crypto.AES.encrypt(JSON.stringify(this.doctor_data), 'EMX265'))
        }
      } else {
        this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow', title: 'TELEMEDICINE ASSISTED REFERRAL', body: 'All the data in Tele Consult Referral will be cleared! \n \n Do you want to continue?' , btn_pry_txt: 'Cancel', btn_sec_color: 'primary', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_pry_emt:'removeSelecteddoctor', btn_sec_txt: 'Select this doctor', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'clearTeleConsult'}
      }
    },

    update_specialization(item) {
      this.specialization = item.specialization;
    },

    //REMOVED THE DISPLAY TEXT OF DOCTOR
    removeSelecteddoctor() {
      this.doctor_data.displayed_text = ''
    },

    //CLEAR ALL THE DATA IN TELE CONSULT REFERRAL
    clearTeleConsult() {
      this.for_tele_consult = false
      this.doctor_data = {
        doctor_code: this.doctor_data.displayed_text.doctor_code,
        doctor_name: this.doctor_data.displayed_text.doctor_name,
        specialization: this.doctor_data.displayed_text.specialization,
        doctor_tin: this.doctor_data.displayed_text.doctor_tin,
        doctor_prc_license: this.doctor_data.displayed_text.doctor_prc_license,
        doctor_phic_account_no: this.doctor_data.displayed_text.doctor_phic_account_no,
        displayed_text: this.doctor_data.displayed_text,
      }
      this.clinic_schedule = null
      this.viber_number = null
      this.mobile_number = null
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

        this.$nextTick(() => {
          this.selected_medicine_holder = {};
        });
    },

    // REMOVE ADDED DRUGS MEDICINE
    removeAddedDrugsMedicine(index){
        this.selected_medicine_filter = this.selected_medicine_filter.filter(item => item !== this.selected_medicine[index].generic_name_text)
        this.selected_medicine.splice(index, 1)
    },
        
    // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
    numberOnly(event){
        if ((event.which < 48 || event.which > 57) && event.which !== 45){
            event.preventDefault();
        }
    },

    // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
    numberOnlyWithDeci(event, value){
        if (((event.which != 46 || (event.which == 46 && value == '')) || value.indexOf('.') != -1) && (event.which < 48 || event.which > 57)){
            event.preventDefault();
        }
    },

    getMedicalHistory(text, data) {
      this.medical_history = {
        past_medical_history: data.past_medical_history,
        previous_hospitalization: data.previous_hospitalization,
        previous_hospitalization_date: data.previous_hospitalization_date,
        previous_surgeries: data.previous_surgeries,
        previous_surgeries_date: data.previous_surgeries_date,
        allergies: data.allergies,
        has_previous_record: data.medical_prev_record,

        current_medicine: {
          has_previous_record: data.medicine_prev_record,
          value: data.current_medicine
        },

        family_medical_history: {
          has_previous_record: data.family_prev_record,
          value: data.family_medical_history,
          family_allergies: data.family_allergies
        },

        patient_social_history: {
          has_previous_record: data.social_prev_record,
          value: data.patient_social_history
        }
      }
    },

    // GET DATA FROM SPECIFIC CHILD COMPONENT
    mutationStatus(item, item_data, value){
      if(item === 'obg'){
        const {data} = this.$refs.ob.obg_data
        // ADD EDB
        let edb = null
        let aog = null
        if (data.ob_gyne === 'OB') {
          edb = data.edb ? this.$moment(data.edb).format('YYYY-MM-DD') : null
          aog = data.aog ? data.aog : null
        }

        this.ob_gyne = {
            ob_gyne: data.ob_gyne ? data.ob_gyne : null,
            lmp: data.lmp ? data.lmp : null,
            pmp: data.pmp ? data.pmp : null,
            aog: aog,
            m: data.m,
            i: `${data.i} Days`,
            d: `${data?.d} Days`,
            a: data.a,
            s: data.s,
            si: data.si ? data.si : null, 
            mp: data.mp ? data.mp : null,
            edb: edb,
            date_of_delivery: data.date_of_delivery ? data.date_of_delivery : null,
            place_of_delivery: data.place_of_delivery ? data.place_of_delivery : null,
            nsd_cs: data.nsd_cs ? data.nsd_cs : null,
            // type_of_delivery: data.type_of_delivery ? data.type_of_delivery : null,
            attended_by: data.attended_by ?  data.attended_by : null,
            bo_sex: data.bo_sex ? data.bo_sex : null,
            bo_length: data.bo_length ? data.bo_length : null,
            bo_birth_weight: data.bo_birth_weight ? data.bo_birth_weight : null,
            bo_head_circumference: data.bo_head_circumference ? data.bo_head_circumference : null,
            weight_for_age: data.weight_for_age ? data.weight_for_age : null,
            height_for_age: data.height_for_age ? data.height_for_age : null,
            weight_for_height: data.weight_for_height ? data.weight_for_height : null,
            pregnancy_term: data.pregnancy_term ? data.pregnancy_term : null,
            is_live_birth: data.is_live_birth ? data.is_live_birth : null,
            is_abortion_or_miscarriage: data.is_abortion_or_miscarriage ? data.is_abortion_or_miscarriage : null,
        }

        if (data.type_of_delivery || data.obg_gravidity || data.obg_parity || data.obg_term ||  data.obg_preterm || data.obg_abortions || data.obg_living || data.has_history_of_ectopic_pregnancy || data.has_experienced_pre_eclampsia) {
          this.patient_ob_gyne = {
              obg_gravidity: data.obg_gravidity,
              obg_parity: data.obg_parity,
              obg_term: data.obg_term,
              obg_preterm: data.obg_preterm,
              obg_abortions: data.obg_abortions,
              obg_living: data.obg_living,
              has_history_of_ectopic_pregnancy: data.has_history_of_ectopic_pregnancy,
              has_experienced_pre_eclampsia: data.has_experienced_pre_eclampsia,
              type_of_delivery: data.type_of_delivery

          }
        }
        
        this.prenatal_consultation = data.prenatal.filter(items => !items.transaction_patient_prenatal_consultation_id && items.date_of_consul && items.prenatal_consul_no && items.semester)
         
        this.previous_complication = data.previous_complication ? data.previous_complication : undefined

        this.prenatal_screening = data.screening.filter(items =>!items.transaction_patient_prenatal_screening_id && items.prenatal_screening_id).map(
          element => {
            const result = {
              prenatal_screening_id: element.prenatal_screening_id,
              prenatal_screening_data: element.prenatal_screening_data,
              selected: element.selected
            };

            if (element.selected === 'Yes') {
              result.screening_date = element.screening_date;
            }
            return result;
          }
        ) 
        
        this.postpartum_consulation = data.postpartum.filter(items => !items.transaction_patient_postpartum_consultation_id && items.lmp && items.no_of_visit && items.pmp) 
        
        this.family_planning_consultation = data.family_planning
        
      }else if(item === 'vac'){
        this.child_vaccination_record = item_data
      }else if(item === 'pex'){
        this.pex_status = true
        
        this.pex_data = {
            bp_systolic: item_data.bp_systolic,
            bp_diastolic: item_data.bp_diastolic,
            bp_2nd_systolic: item_data.bp_2nd_systolic,
            bp_2nd_diastolic: item_data.bp_2nd_diastolic,
            blood_pressure: item_data.bp_systolic + '/' + item_data.bp_diastolic,
            blood_pressure_2nd: item_data.bp_2nd_systolic + '/' + item_data.bp_2nd_diastolic,
            bmi_computation: item_data.bmi_computation,
            central_adiposity: item_data.central_adiposity,
            heart_rate: item_data.heart_rate,
            oxygen_saturation: item_data.oxygen_saturation,
            respiration_rate: item_data.respiration_rate,
            temp: item_data.temp,
            waist_circumference: item_data.waist_circumference,
        };
          
        this.patient_assessment = item_data.assessment

        // this.patient_heent.heent = item_data.heent,
        // this.patient_heent.other_heent = item_data.other_heent

        this.patient_record.left_vision = item_data.left_one + '/' +  item_data.left_two;
        this.patient_record.right_vision = item_data.right_one + '/' + item_data.right_two;
        this.patient_record.left_one  = item_data.left_one ? item_data.left_one : ''
        this.patient_record.left_two  = item_data.left_two ? item_data.left_two : ''
        this.patient_record.right_one = item_data.right_one ? item_data.right_one : ''
        this.patient_record.right_two = item_data.right_two ? item_data.right_two: ''
        this.patient_record.height    = item_data.height  
        this.patient_record.weight    = item_data.weight
        this.patient_record.bmi = item_data.bmi_computation.bmi
        this.patient_record.bmi_remarks = item_data.bmi_computation.remarks
        this.patient_record.weight_for_age = item_data.weight_for_age,
        this.patient_record.height_for_age = item_data.height_for_age,
        this.patient_record.weight_for_height = item_data.weight_for_height,
        this.patient_record.hip = item_data.hip,
        this.patient_record.skin_for_thickness = item_data.skin_for_thickness,
        this.patient_record.head_circle = item_data.head_circle,
        this.patient_record.mid_upper_arm_circle = item_data.mid_upper_arm_circle,
        this.patient_record.limbs = item_data.limbs,
        this.general_survey = item_data.general_survey;
        this.general_survey_notes = item_data.general_survey_notes;
      }else if(item === 'cov') {
        this.cov_status = item_data.cov_status 
        this.covid_status = item_data.covid_status
        this.covid_vaccination_record = item_data.vaccination_data
        this.booster_record = item_data.booster_data
      } else if(item === 'phy') {
        this.admitting_diagnosis = value === 'admitting' ? item_data : this.admitting_diagnosis,
        this.treatment_recommendation = value === 'treatment' ? item_data : this.treatment_recommendation
        this.trans_data.operator_notes = value === 'dr_notes' ? item_data : this.trans_data.operator_notes
        this.offline_date_admitted = value === 'date_admitted' ? item_data : this.offline_date_admitted
        this.offline_date_discharge = value === 'date_discharged' ? item_data : this.offline_date_discharge
        this.select_management = value === 'mng' ? item_data : this.select_management
        this.chief_complaint = value === 'chief' ? item_data : this.chief_complaint
      
        if(value === 'selected_icd_proc'){
          sessionStorage.setItem('7nVooi3FUfds', this.$crypto.AES.encrypt(JSON.stringify(this.selected_icd), 'EMX2464'))     
        }
      } else if (item === 'close_contact') {
        this.close_contact_tb.value = item_data
      }
    },

    // BMI CALCULATION
    bmiCalculate(){
      let bmi, remarks;
      if (parseFloat(this.patient_record.weight) > 0 && parseFloat(this.patient_record.height) > 0) {
          bmi = (this.patient_record.weight /(this.patient_record.height/100*this.patient_record.height/100)).toFixed(2)
          if(bmi < 18.5){
            remarks = 'Underweight'
          } else if (bmi > 18.5 && bmi < 25) {
            remarks = 'Normal Weight'
          } else if (bmi > 25 && bmi < 30) {
            remarks = 'Overweight'
          } else {
            remarks = 'Obesity'
          }
          
          this.patient_record.bmi = bmi
          this.patient_record.bmi_remarks = remarks
      } else {
        this.patient_record.bmi = ''
        this.patient_record.bmi_remarks = ''
      }
    },

    bmiCalculateKids(){
      if (parseFloat(this.patient_record.weight) > 0 && parseFloat(this.patient_record.height) > 0) {
        this.patient_record.weight_for_age = this.$refs.BMICalculationController.getWeightForAge(this.member_data.member.mem_birthdate, this.patient_record.weight, this.member_data.member.mem_gender);
        this.patient_record.height_for_age = this.$refs.BMICalculationController.getHeightForAge(this.member_data.member.mem_birthdate, this.patient_record.height, this.member_data.member.mem_gender);
        this.patient_record.weight_for_height = this.$refs.BMICalculationController.getWeightForHeight(this.member_data.member.mem_birthdate, this.patient_record.height, this.patient_record.weight, this.member_data.member.mem_gender);
      } else {
        this.patient_record.weight_for_age    = ''
        this.patient_record.height_for_age    = ''
        this.patient_record.weight_for_height = ''
      }
    },

    validateAssessment(data, category) {
      const map = data.map(element => element.assessment)

      if (map.includes('Others')) {
        this.other_assessment.dialog = true
        this.other_assessment.category = category
      }
    },
    
    inserOtherAssessment(status, category) {
      if (status === 'confirm') {
        // DELETE FIRST OTHERS
        let first_other = null

        this.patient_assessment[category].assessment.forEach((element, index) => {
          if (element.assessment === 'Others') first_other = index
        })

        this.patient_assessment[category].assessment.splice(first_other, 1)

        // DELETE PREVIOUS OTHERS
        let previous_other = null

        this.patient_assessment[category].assessment.forEach((element, index) => {
          if (element.assessment.substring(0, 6) === 'Others') previous_other = index
        })

        if (previous_other !== null) this.patient_assessment[category].assessment.splice(previous_other, 1)
        
        // INSERT NEW OTHERS
        this.patient_assessment[category].assessment.push({
          assessment_id: '99',
          assessment: 'Others: ' + this.other_assessment.new_val
        })
        
        this.patient_assessment[category].others_notes = 'Others: ' + this.other_assessment.new_val
      } else {
        this.patient_assessment[category]['assessment'].pop()
      }
      
      this.other_assessment.dialog = false
      this.other_assessment.new_val = ''
    },

    // FOR GETTING THE VALUE OF NATURE_OF_VISIT OR SERVICE_AVAILED
    getServiceAvailedData(value) {
      this.service_availed = value ? value : ''
    },

    //SAVE OTHER MEDICINE
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

    // PRINT
    print(){
      window.scrollTo(0, 0);
      window.print();
    },

    saveAsPDF() {
      var doc = new jsPDF('p', 'mm','letter');
      doc.setFont("helvetica","bold")
      doc.setFontSize(10);

      if(this.$store.state.prv_config.provider_logo) doc.addImage(this.$store.state.prv_config.provider_logo, "JPEG", 10, 10, 0, 15);
      if(this.$store.state.usr_credentials.lgu_host_code === 'AT') doc.addImage(require('@/assets/card-logo/ANTIPOLO/logo_3.png'), 170, 10, 0, 15)

      doc.text("REPUBLIC OF THE PHILIPPINES", doc.internal.pageSize.getWidth() / 2, 15, null, null, 'center');
      doc.setFont("helvetica","normal")
      doc.text("PROVINCE OF " + this.$store.state.prv_data.province, doc.internal.pageSize.getWidth() / 2, 20, 'center');
      doc.text("MUNICIPALITY OF " + this.$store.state.prv_data.municipality, doc.internal.pageSize.getWidth() / 2, 25, 'center');

      if(this.$store.state.usr_credentials.lgu_host_code === 'AT') {
          doc.setFontSize(12)    
          doc.setTextColor('green')
          doc.setFont('helvetica', 'italic')
          doc.text('CITY HEALTH OFFICE', doc.internal.pageSize.getWidth() / 2, 30, 'center')
      }

      doc.setTextColor('black')
      doc.setFont("helvetica","bold")
      let provider_name = this.$store.state.usr_credentials.provider_reg_type === 'BARANGAY' ? `BARANGAY ${this.$store.state.prv_data.provider_name}` : this.$store.state.prv_data.provider_name
      doc.text(provider_name.toUpperCase(), doc.internal.pageSize.getWidth() / 2, 35, null, null, 'center');
      doc.setFontSize(8)
      let tel_and_email = `TEL NO. ${this.$store.state.usr_credentials.tel_no || ''} EMAIL: ${this.$store.state.usr_credentials.email || ''}`;
      doc.setFontSize(8);
      doc.text(tel_and_email, doc.internal.pageSize.getWidth() / 2, 40, 'center');

      doc.setFont("helvetica","normal")
      doc.setFontSize(8.5);
      doc.text("NAME:", 10, 45);
      doc.text(this.member_data.member.p_name, 21, 45);
      doc.line(21, 46, 129, 46)

      doc.text("DATE:", 130, 45);
      doc.text(this.formatDate(this.date_today), 141, 45);
      doc.line(141, 46, 205, 46)

      let address_height = 56
      var data = doc.splitTextToSize(this.member_data.member.mem_complete_address, 100);
      if (doc.getTextDimensions(data).h <= 2.998611111111111){
          address_height = 56
      }else if(doc.getTextDimensions(data).h > 2.998611111111111&& doc.getTextDimensions(data).h  < 6.547013888888888) {
          address_height = 53
      } else {
          address_height = 49
      }

      doc.text("ADDRESS:", 10, 56);
      doc.text(27 ,address_height,data);
      doc.line(27, 57, 129, 57)

      doc.text("AGE:", 130, 56);
      doc.text(this.member_data.member.mem_age, 139, 56)
      doc.line(139, 57, 205, 57)

      doc.addImage(require('../../../assets/rx.png'), "PNG", 10, 65, 0, 15);

      doc.setFont("helvetica","bold")
      let base_height = 77
      base_height = base_height + 12
      doc.setFontSize(8);

      doc.text("Generic Name", 17, base_height);
      doc.text("Brand", 57, base_height, 'center');
      doc.text("Dosage/Preparation", 86, base_height, 'center');
      let frequency = doc.splitTextToSize('Frequency (per day)', 18)
      doc.text(frequency, 114, base_height ,'center');

      doc.text(137, base_height, doc.splitTextToSize("Duration # of days", 25),'center');
      doc.text(164, base_height, doc.splitTextToSize("Total # of Medicine", 30), 'center');
      doc.text("Remarks", 194, base_height,'center'); 

      doc.setFont("helvetica","normal")
      base_height = base_height + 12
      doc.setFontSize(8);

      for(let med_ctr = 0; med_ctr < this.selected_medicine.length; med_ctr ++) { 
        let generic_name = doc.splitTextToSize(this.selected_medicine[med_ctr].generic_name.trim(), 40)
        let generic_height = base_height
        if(doc.getTextDimensions(generic_name).h <= 2.469444444444444) {
            generic_height
        } else if(doc.getTextDimensions(generic_name).h > 2.469444444444444 &&  doc.getTextDimensions(generic_name).h <= 5.309305555555555) {
            generic_height = generic_height - 3
        } else {
            generic_height = generic_height - 4
        }
        doc.text(26, generic_height, generic_name, 'center')

        base_height = base_height - 3
        doc.text('N/A', 54, base_height)
        let dosage_name = this.selected_medicine[med_ctr].dosage ? doc.splitTextToSize(this.selected_medicine[med_ctr].dosage ,30) : ''
        let dosage_height = base_height
        if(doc.getTextDimensions(dosage_name).h > 2.469444444444444) dosage_height = dosage_height - 3
    
        doc.text(dosage_name + '/' + this.selected_medicine[med_ctr].preparation, 85, base_height, {maxWidth: 35, align: 'center'})
        doc.text(this.selected_medicine[med_ctr].frequency_of_med ? this.selected_medicine[med_ctr].frequency_of_med : '0', 113, base_height, 'center')
        doc.text(this.selected_medicine[med_ctr].duration ? this.selected_medicine[med_ctr].duration : '', 137, base_height, 'center')
        doc.text(this.selected_medicine[med_ctr].total_prescribed_medicine ? '# '+ this.selected_medicine[med_ctr].total_prescribed_medicine : '', 164, base_height, 'center')


        let notes = this.selected_medicine[med_ctr].notes ? doc.splitTextToSize(this.selected_medicine[med_ctr].notes, 20) :''
        let notes_height = base_height
        if(doc.getTextDimensions(notes).h <= 2.469444444444444) {
            notes_height
        } else if(doc.getTextDimensions(notes).h > 2.469444444444444 &&  doc.getTextDimensions(notes).h <= 5.309305555555555) {
            notes_height = notes_height - 3
        } else {
            notes_height = notes_height - 6
        }
        doc.text(193, notes_height + 3, notes, 'center')

        if (base_height > 250) {
            doc.addPage()
            base_height = 20
        } else {
            base_height = base_height + 12
        }
      }

      let filename = `PATIENT ${this.member_data.member.p_name} OTC_MEDS ${this.$moment().format('MM-DD-YYYY hhmmA')}`
      doc.save(filename + '.pdf')
    },

    redirect(to){
      if (to === '/code-scanning') sessionStorage.clear()
      this.$router.replace(to)
    }, 

    viewTBDots() {
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

      let risk_factors = [];
      const past_history = this.medical_history.past_medical_history.map(element => element.description);
      const social_history = this.medical_history.patient_social_history.value.map(element => element.social_history);

      if (past_history.includes('TUBERCULOSIS')) risk_factors.push('Previous TB Treatment');
      if (this.member_data.member.mem_age >= 60) risk_factors.push('Elderly');
      if (this.member_data.member.indigenous === 1) risk_factors.push('Indigent');

      risk_factors.push(...past_history);
      risk_factors.push(...social_history);

      risk_factors = risk_factors.map(element => {
          if (element.substring(0, 7) === 'Others:') {
              element = element.substring(8);
          } else if (element.substring(0, 9) === 'Personal-') {
              element = element.substring(9);
          }

          return element;
      });

      const data = {
          editable: true,
          patient_name: this.combineString([this.member_data.member.mem_first_name, this.member_data.member.mem_middle_name, this.member_data.member.mem_last_name, this.member_data.member.mem_suffix]),
          date_today: this.dateToday('MM-DD-YYYY'),
          address: this.combineString([this.member_data.member.mem_home_bldgno, this.member_data.member.mem_home_bgy, this.member_data.member.mem_home_city_municipality, this.member_data.member.mem_home_province, this.member_data.member.mem_home_zip]),
          age: this.getAge(this.member_data.member.mem_birthdate),

          signs_and_symptoms: signs_and_symptoms,
          risk_factors: risk_factors,
          close_contact_tb: this.close_contact_tb.value,
          assessment: [],
          recommended_actions: []
      }

      this.$refs.tb_dots.openTBDots(data);
    },
    
    viewTreatmentPlan() {
      const data = {
          patient_name: this.member_data.member.p_name,
          selected_medicine: this.selected_medicine,
          doctor_name: this.doctor_data.doctor_name,
          transaction_number: this.transaction_number,
          is_treatment_plan: true,
          patient_address : this.member_data.member.mem_complete_address,
          patient_age : this.member_data.member.mem_age,
          date_admitted : this.date_today,
          doctor_prc_license : this.doctor_data.doctor_prc_license,
      };
      this.$refs.treatment_plan.openDialog(data);
    },

    handleDialogTrans(value) {
      if(value === 'consent') {
        if(this.with_consent) {
          sessionStorage.setItem("HYSGTT",this.$crypto.AES.encrypt(JSON.stringify(this.with_consent),"jfyh2s45")); // PATIENT WITH CONSENT
          this.display_consent = false
        }
      }

      if(value === 'eligible_trans') {
        if(this.selected_eligible_tran){
          sessionStorage.setItem("YH90MG",this.$crypto.AES.encrypt(JSON.stringify(this.with_consent),"u2787cvA")); // PATIENT ELIGIBLE TRANSCATION EKONSULTA/ECLAIMS
          this.display_eligible_trans = false
        }
      }
    },

     //FOR EDIT TRANSACTION
    async getPatientST() {
      let data = await this.$refs.physical_examination.getPatientST();
      if(data) {
        this.patient_record = data
      }
    },
    
    populateTransactionData() {

      this.dietary_information.physical_activity = this.selected_transaction.dietary_information ? this.selected_transaction.dietary_information.physical_activity : ''
      this.dietary_information.fiber_intake_fruit = this.selected_transaction.dietary_information ? this.selected_transaction.dietary_information.fiber_intake_fruit : ''
      this.dietary_information.high_fat_salt_intake = this.selected_transaction.dietary_information ? this.selected_transaction.dietary_information.high_fat_salt_intake : ''
      this.dietary_information.fiber_intake_vegetable = this.selected_transaction.dietary_information ? this.selected_transaction.dietary_information.fiber_intake_vegetable : ''

      this.trans_data.service_availed = this.selected_transaction.service_availed && this.selected_transaction.service_availed !== 'N/A' ? this.selected_transaction.service_availed : ['GENERAL']
      this.trans_data.chief_complaint = this.selected_transaction.chief_com ? this.selected_transaction.chief_com : ''
      this.trans_data.history_current_illness = this.selected_transaction.current_history_illness ? this.selected_transaction.current_history_illness : ''
     
      // SIGNS AND SYMPTOMS
      this.signs_and_symptoms.data = this.selected_transaction.patient_symptoms.map(item =>  {
          if(item.duration.includes('Custom')) {
            let item_slice = item.duration.replace('days', '')

            return {
              duration: item_slice.slice(0, 6),
              symptom: item.symptom,
              symptoms_id: item.symptoms_id,
              custom_duration_input: item_slice.slice(7, 10)
            }
          } else {
            return {
              duration: item.duration,
              symptom:item.symptom,
              symptoms_id: item.symptoms_id
            }
          }
        }
      )

      this.plan_data.diet = this.selected_transaction.diet
      this.plan_data.fluid_intake = this.selected_transaction.fluid_intake
      this.plan_data.follow_up_consultation_date = this.selected_transaction.follow_up_consultation_date
      this.trans_data.operator_notes = this.selected_transaction.operator_notes

      //PHYSICIAN DIAGNOSIS
      this.admitting_diagnosis = this.selected_transaction.admitting_diagnosis
      this.select_management = this.selected_transaction.management_description
      this.selected_icd = []
      this.selected_cpt_holder = null

      const procedures = this.selected_transaction.procedure || []

      this.selected_icd = (this.selected_transaction.diagnosis || []).map(diag => ({
        icd_code_description: {
          icd_code: diag.icd_code,
          icd_description_long: diag.icd_description,
          icd_code_description: `${diag.icd_code} - ${diag.icd_description}`
        },

        icd_group_code: diag.icd_group_code || null,

        icd_category: {
          selected: diag.icd_condition || null,
          list: diag.icd_condition_list || [],
          loading: false
        },

        procedures: procedures.filter(proc => proc.diag_exam_status !== 'Done').map(proc => ({
          cpt_code: proc.cpt_code,
          cpt_description: proc.cpt_desc,
          cpt_description_long: proc.cpt_description_long,
          modifier: proc.modifier || null,
          physician_recommendation: proc.physician_recommendation || null,
          patient_remarks: proc.patient_remarks || null,
          show_long_desc: false,
          prescription_date: proc.prescription_date || null,
          libDesc: proc.libDesc,
          libID: proc.libID,
          diag_exam_status: proc.diag_exam_status || null,
        }))
      }))

      this.treatment_recommendation = this.selected_transaction.treatment_recommendation
      this.trans_data.operator_notes = this.selected_transaction.doctor_note

      this.treatment_recommendation = this.selected_transaction.treatment_recommendation

      //DOCTOR NAME
      //this.doctor_data.displayed_text  = `${this.selected_transaction.doctor_name} / ${this.selected_transaction.specialization}`

      //MEDICINE DATA
      if(this.selected_transaction.medicine_data) {
        this.selected_medicine =  this.selected_transaction.medicine_data
        this.selected_medicine.forEach(element => {
            element.generic_name_text = element.generic_name + element.brand_name + element.dosage
            this.selected_medicine_filter.push(element.generic_name_text)
        })
      }

      //DATE ADMITTED AND DISCHARGE
      this.offline_date_admitted  = this.selected_transaction?.date_admitted  && this.selected_transaction?.date_admitted !== 'N/A' ? this.selected_transaction.date_admitted : ''
      this.offline_date_discharge = this.selected_transaction?.date_discharged && this.selected_transaction?.date_discharged!=='N/A' ? this.selected_transaction.date_discharged : ''
    
    },
    
  },


  //REMOVE SETTING UP OF SESSION FOR ENTERING CONSULTATION
  beforeDestroy(){
    sessionStorage.removeItem('49GkdoSQN')
    sessionStorage.removeItem('lsfk4iofd')
    sessionStorage.removeItem('pvceifcaqpcig')
    sessionStorage.removeItem('GHFXxd9ghcCCy')
    sessionStorage.removeItem('A9FSjfkF')
    sessionStorage.removeItem('S2GSXfkF')
    sessionStorage.removeItem('mjh823hss')
    sessionStorage.removeItem('rqnn52ds')
    clearTimeout(this.transaction_timeout_id);
  }
};
</script>

<style scoped>
::v-deep .v-tabs-bar {
    border-radius: inherit !important;
    height: 40px !important;
}
::v-deep .v-tabs:not(.v-tabs--vertical):not(.v-tabs--right) > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes) .v-slide-group__prev {
    display:none;
    visibility: hidden;
}
::v-deep .expand-icon .v-expansion-panel-header__icon .v-icon {
  font-size:20pt;
  color: #1976D2 !important
}
.card-border{ box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important; }
.tabs-border{ border: 1px solid rgb(214 214 214); }
.non-active-tab{
    background-color: #eeeeee !important;
    border-color: #eeeeee !important;
    border-top-left-radius:5px; 
    border-top-right-radius:15px;
    margin-right:0.25em;
}
.active-tab{
    background-color: #1976D2 !important;
    border-color: #1976D2 !important;
    color:white !important;
    border-top-left-radius:5px; 
    border-top-right-radius:100px;
    margin-right:0.25em;
}
.progress-load {
  height: 85vh;
}
.text-field-radius {
  border-radius:15px !important
}
#table{
    width: 100%;
}
th{
    border: 0;
}
td{
    border: 0px;  
    cursor: default;
    padding: 15px 3px 0;
    text-align: left;  
    vertical-align: bottom !important;
}
.print-pat-info{
    border-bottom: 1px solid grey; 
    margin: 18px 0 0 8px; 
    padding: 5px 0px 0px 0px; 
    width: 100%;
}
.print-med-tbl-main{
    overflow-x: auto;
}
.print-med-tbl-main .d-flex{
    min-width: 1410px;
    width: 100%; 
}
.print-med-tbl-h{
    font-size: 14px;
    margin: 0 4px;
    width: 200px;
}
.print-med-tbl-b{
    font-size: 14px;
    padding-top: 8px;
    width: 210px;
    text-align: center;
}
.print-border-bottom{
    background: grey !important;
}
@media print{
    body *{
        background: white !important;
        position: relative;
    }
    #main-container {
      padding:0;
      
    }
    #not-for-print{
        display: none;
    }

    #tbdots-print{
      box-shadow: none !important;
    }

    ::v-deep .v-dialog
    {
      box-shadow: none !important;
    }

    #for-print-absolute{
        left: 0;
        position: absolute !important; 
        top: 0;
        right:0;
    }
    #for-print-relative{
        border: none !important;
        padding: 10px 0 !important;
        position: relative !important; 
    }
    .print-med-tbl-main{
        overflow-x: hidden;
    }
    .print-med-tbl-h, .print-med-tbl-b{
        max-width: 131px;
        min-width: 100px;
        padding: 5px 0 0 0;
        width: 100px;
    } 
    .print-med-tbl-b{
      width: 131px;
      text-align: center;
      margin-right: 5px;
    }
    .print-med-tbl-h{
      width: 128px;
    }
}
.red {
  background: #EF9A9A !important;
  border-color: #EF9A9A !important;
}
.yellow {
  background: #fff59d !important;
  border-color:#fff59d !important
}
.green {
  background: #A5D6A7 !important;
  border-color: #A5D6A7 !important
}
.box {
  height: 15px;
  width: 15px;
  border-radius: 2px;
}
</style>