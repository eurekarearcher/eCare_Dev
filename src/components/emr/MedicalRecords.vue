<template>
    <div class="mt-4">
        <v-card class="elevation-1" outlined>
            <h3 class="font-weight-regular light-blue darken-4 text-center white--text py-2">PREVIOUS MEDICAL RECORD <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic">(NAKARAANG MEDIKAL NA NAITALA)</span></h3>
            <div class="pa-7">
                <v-row justify="end" class="flex-wrap mb-5" dense>
                    <v-col cols="12" sm="12" md="4" lg="4" xl="4">
                        <v-text-field v-model="tbl_search" prepend-inner-icon="mdi-magnify" label="Search" hide-details outlined dense></v-text-field>
                    </v-col>
                </v-row>
                
                <v-data-table :headers="tbl_headers" :items="tbl_items" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :search="tbl_search" :loading="tbl_loading" :items-per-page="5" class="elevation-1" mobile-breakpoint="0">
                    <template v-slot:item="{ item }">
                        <tr :class="{'grey lighten-4' : selected_record === item.date_created}" @click="viewPreviousRecord(item)">
                            <td :style="item.referral_code ? 'background: #FFF9C4;' : ''">{{ item.referral_code || '' }}</td>
                            <td>{{ formatDateAndTime(item.date_created) }}</td>
                            <td>{{ item.authorized_doctor || 'N/A' }}</td>
                            <td>{{ item.doctor_name || 'N/A' }}</td>
                            <td>{{ item.specialization || 'N/A' }}</td>
                            <td>{{ item.chief_com || 'N/A' }}</td>
                            <td>{{ item.icd_description || 'N/A' }}</td>
                            <td>{{ item.provider_name || 'N/A' }}</td>
                            <td>{{ item.transaction_type }}</td>
                            <td>{{ item.nurse_name || 'N/A' }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
        </v-card>

        <v-dialog v-if="previous_record_display" v-model="previous_record_display" width="816px" persistent>
            <v-card-title class="light-blue darken-4 white--text py-2 d-print-none">
                <v-spacer></v-spacer>PREVIOUS CONSULTATION<v-spacer></v-spacer>
                <v-icon @click="previous_record_display = false" dark>mdi-close</v-icon>
            </v-card-title>

            <v-card class="d-print-none pt-4 pb-6 px-6" tile>
                <v-row dense>
                    <v-col cols="12" md="6" lg="6">
                        <label class="font-weight-medium body-2">Date Admitted: <span class="font-weight-regular">{{ $moment(previous_record_data.date_admitted).format('MMMM D, YYYY') }}</span></label>
                    </v-col>
                    <v-col class="text-md-right" cols="12" md="6" lg="6">
                        <label class="font-weight-medium body-2">Date {{ previous_record_data.transaction_status.includes('CANCELLED') ? 'Cancelled' : 'Discharged' }}: <span class="font-weight-regular"> {{ $moment(previous_record_data.date_discharged).format('MMMM D, YYYY') }}</span></label>
                    </v-col>
                    <v-col cols="12" md="6" lg="6">
                        <label class="font-weight-medium body-2">Date of Transaction: <span class="font-weight-regular">{{ $moment(previous_record_data.date_admitted).format('MMMM D, YYYY') }}</span></label>
                    </v-col>

                    <v-col class="text-md-right" cols="12" md="6" lg="6" v-if="previous_record_data.follow_up_consultation_date">
                        <label class="font-weight-medium body-2">FollowUp Consultation Date: <span class="font-weight-regular">{{ $moment(previous_record_data.follow_up_consultation_date).format('MMMM D, YYYY') }}</span></label>
                    </v-col>
                </v-row>
                <v-divider></v-divider>

                <template v-if="previous_record_data.referral_code">
                    <div class="font-weight-medium body-2 yellow lighten-2 mt-4 pl-3 py-2">
                        Notes: <span class="font-weight-regular">This transaction has been referred to </span>{{ previous_record_data.referral_doctor_specialization }}
                        <h4 class="font-weight-medium body-1 mt-4">Referral Code: {{ previous_record_data.referral_code }}</h4>
                    </div>
                </template>

                <h4 class="font-weight-medium body-2 mt-4">Chief Complaint</h4>
                <v-textarea v-model="previous_record_data.chief_com" class="body-2" rows="3" hide-details readonly outlined></v-textarea>

                <h4 class="font-weight-medium body-2 mt-4">Doctor</h4>
                <v-text-field v-if="previous_record_data.doctor_name" :value="previous_record_data.doctor_name + ' / ' + previous_record_data.specialization" class="body-2" prepend-inner-icon="fas fa-user-md" hide-details readonly outlined dense></v-text-field>
                <label v-else class="font-italic body-2">No Available Doctor</label>

                <h4 class="font-weight-medium body-2 mt-4">History of Current Illness</h4>
                <v-textarea v-if="previous_record_data.current_history_illness" :value="previous_record_data.current_history_illness" class="body-2" rows="3" hide-details readonly outlined dense></v-textarea>
                <label v-else class="font-italic body-2">No Available History of Current Illness</label>

                <h4 class="font-weight-medium body-2 mt-4">Sign and Symptoms</h4>
                <div v-if="previous_record_data.patient_symptoms[0].symptom !== 'None'">
                    <v-row v-for="(item, index) in previous_record_data.patient_symptoms" :key="index" dense>
                        <v-col cols="12" md="8" lg="8">
                            <v-text-field :value="item.pain_site ? `${item.symptom} / ${item.pain_site}` : item.symptom" class="body-2" hide-details outlined dense readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" lg="4">
                            <v-text-field :value="item.duration.replace('Custom-', '')" class="body-2" hide-details outlined dense readonly></v-text-field>
                        </v-col>
                    </v-row>
                </div>
                <label v-else class="font-italic body-2">No Available Sign and Symptoms</label>

                <v-divider class="mt-4 mb-4"></v-divider>

                <v-tabs v-model="tab" active-class="active-tab" hide-slider outlined >
                    <v-tab class="non-active-tab">Vital Signs</v-tab>
                    <v-tab class="non-active-tab">PE Findings</v-tab>
                    <v-tab class="non-active-tab">Laboratory Request</v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab" class="px-1" ref="tabs" >
                    <v-expansion-panels v-model="panel" multiple class="pb-1">
                        <v-expansion-panel>
                            <v-tab-item class="mt-1">
                                <v-expansion-panel-content class="pa-0">
                                        <v-row class="mt-2" dense>
                                            <v-col cols="12" sm="6" md="6" lg="6" xl="4">
                                                <v-text-field v-model="previous_record_data.physical_exam_data.blood_pressure" class="body-2" maxlength="3" label="BP" hide-details outlined  dense readonly></v-text-field>  
                                            </v-col>

                                             <v-col cols="12" sm="6" md="6" lg="6" xl="4">
                                                <v-text-field v-model="previous_record_data.physical_exam_data.blood_pressure_2nd" class="body-2" maxlength="3" label="2nd BP" hide-details outlined  dense readonly></v-text-field>  
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6" lg="3" xl="4">
                                                <v-text-field v-model="previous_record_data.physical_exam_data.heart_rate"  class="body-2" label="HR" hide-details outlined dense readonly></v-text-field> 
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6" lg="3" xl="4">
                                                <v-text-field v-model="previous_record_data.physical_exam_data.respiration_rate" class="body-2" label="RR" hide-details outlined  dense readonly></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6" lg="3" xl="4">
                                                <v-text-field v-model="previous_record_data.physical_exam_data.temp" class="body-2" label="TEMP" hide-details outlined  dense readonly></v-text-field>
                                            </v-col> 

                                            <v-col cols="12" sm="6" md="6" lg="3" xl="4">
                                                <v-text-field v-model="previous_record_data.physical_exam_data.oxygen_saturation" class="body-2" label="O2SAT" hide-details outlined  dense readonly></v-text-field>
                                            </v-col>  
                                        </v-row>
                        
                                        <v-row dense >
                                            <v-col cols="12" sm="6" md="6" lg="3">
                                                <v-text-field v-model="previous_record_data.patient_record.height" class="body-2" onpaste="return false" :label="patient_info.mem_age > 5 ? 'Height' : 'Length'" hide-details outlined dense readonly>
                                                    {{ patient_info.mem_age > 5 ? 'HT' : 'Length' }}
                                                </v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6" lg="3">
                                                <v-text-field v-model="previous_record_data.patient_record.weight" class="body-2" onpaste="return false" label="Weight" hide-details outlined dense readonly>
                                                    {{ previous_record_data.patient_record.weight }}
                                                </v-text-field>
                                            </v-col>

                                          <template v-if="patient_info.mem_age <= 2"> 
                                                <v-col cols="12" sm="4" md="4" lg="2">
                                                    <v-text-field class="font-weight-medium body-2" v-model="previous_record_data.patient_record.weight_for_age" onpaste="return false" label="Weight for Age" hide-details outlined dense readonly></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="4" md="4" lg="2">
                                                    <v-text-field class="font-weight-medium body-2" v-model="previous_record_data.patient_record.height_for_age" onpaste="return false" label="Height for Age" hide-details outlined dense readonly></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="4" md="4" lg="2">
                                                    <v-text-field class="font-weight-medium body-2" v-model="previous_record_data.patient_record.weight_for_height" onpaste="return false" :label="'Weight for ' + (patient_info.mem_age > 2 ? 'Height' : 'Length')" hide-details outlined dense readonly></v-text-field>
                                                </v-col>
                                            </template>


                                            <template v-if="patient_info.mem_age > 2">
                                                <v-col cols="12" sm="6" md="6" lg="3">
                                                    <v-text-field v-model="previous_record_data.patient_record.bmi" class="body-2" label="BMI" hide-details outlined dense readonly></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="6" md="6" lg="3">
                                                    <v-text-field v-model="previous_record_data.patient_record.bmi_remarks" class="body-2" label="REMARKS" hide-details outlined dense readonly></v-text-field>
                                                </v-col>
                                            </template>
                                        </v-row>

                                        <v-row v-if="patient_info.mem_age <= 2" dense>
                                            <v-col cols="12" sm="6" md="6" lg="4" xl="4">
                                                <v-text-field v-model="previous_record_data.patient_record.head_circle" class="body-2" onpaste="return false" label="Head Circle" hide-details outlined dense readonly></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6" lg="4" xl="4">
                                                <v-text-field v-model="previous_record_data.patient_record.skin_for_thickness" class="body-2" onpaste="return false" label="Skin for thickness" hide-details outlined dense readonly></v-text-field>
                                            </v-col> 

                                            <v-col cols="12" sm="6" md="6" lg="4" xl="4">
                                                <v-text-field v-model="previous_record_data.patient_record.hip" class="body-2" onpaste="return false" label="Hip" hide-details outlined dense readonly></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6" lg="6" xl="4">
                                                <v-text-field v-model="previous_record_data.patient_record.limbs" class="body-2" onpaste="return false" label="Limbs" hide-details outlined dense readonly></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="12" md="12" lg="6" xl="4">
                                                <v-text-field v-model="previous_record_data.patient_record.mid_upper_arm_circle" class="body-2" onpaste="return false" label="Mid upper arm circle" hide-details outlined dense readonly></v-text-field>
                                            </v-col>
                                        </v-row>
                                        
                                        <v-row  dense>
                                            <v-col cols="12" sm="6" md="6" lg="6">
                                                <v-text-field v-model="previous_record_data.patient_record.left_vision" class="body-2" label="Left Vision" hide-details outlined dense readonly></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6" lg="6">
                                                <v-text-field v-model="previous_record_data.patient_record.right_vision" class="body-2" label="Right Vision" hide-details outlined dense readonly></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <v-row dense>
                                            <v-col class="align-baseline d-flex" cols="12" sm="12" md="6" lg="6" xl="6">
                                                <v-text-field v-model="previous_record_data.physical_exam_data.waist_circumference" class="body-2" onpaste="return false" label="Waist Circumference" outlined hide-details dense readonly></v-text-field>
                                            </v-col>
                                            <v-col class="align-baseline d-flex" cols="12" sm="12" md="6" lg="6" xl="6">
                                                <v-text-field :value="previous_record_data.physical_exam_data.central_adiposity === '1' ? 'Yes' : 'No'" class="body-2" label="Central Adiposity" outlined hide-details dense readonly></v-text-field>
                                            </v-col>
                                        </v-row> 
                                </v-expansion-panel-content>
                            </v-tab-item>

                            <v-tab-item class="mt-1">
                                <v-expansion-panel-content class="mt-2">
                                    <v-row v-if="previous_record_data.patient_assessment" align="baseline" dense>
                                        <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1" v-for="(assessment_data, key) in previous_record_data.patient_assessment" :key="key">
                                            <v-combobox v-if="assessment_data.assessment" v-model="previous_record_data.patient_assessment[key].assessment" :items="assessment_data.assessment" item-value="assessment_id" item-text="assessment" :label="getAssessmentLabel(key)" deletable-chips hide-no-data hide-selected hide-details multiple outlined readonly chips>
                                                <template v-slot:selection="{ item, index }">
                                                    <v-chip v-if="getItemText(key, assessment_data.assessment.indexOf(item), 'assessment')">{{ getItemText(key, assessment_data.assessment.indexOf(item), 'assessment') }}</v-chip>
                                                    <v-chip v-if="index === 0 && getItemText(key, 0, 'others_notes')">OTHERS: {{ getItemText(key, 0, 'others_notes') }}</v-chip>
                                                </template>
                                            </v-combobox>
                                        </v-col>
                                    </v-row>
                                    <label v-else class="font-italic body-2">No Available PE Findings</label>

                                    <v-row dense>
                                        <h4 class="font-weight-medium body-2 mt-4">General Survey</h4>
                                        <template v-if="previous_record_data.general_survey && previous_record_data.general_survey.length > 0">
                                            <v-col v-for="(item, index) in previous_record_data.general_survey" :key="index" cols="12">
                                                <v-text-field v-model="item.general_survey" class="ma-0 checkbox_label" hide-details outlined dense readonly></v-text-field>
                                            </v-col>
                                        </template>

                                        <v-col v-else cols="12">
                                            <p class="font-italic body-2">No Available General Survey</p>
                                        </v-col>
                     
                                        <v-col class="align-baseline d-flex" cols="12" v-if="previous_record_data.general_survey_notes">
                                            <v-label class="grey--text text--darken-4">Others:</v-label>
                                            <v-text-field v-model="previous_record_data.general_survey_notes" class="body-2 pl-4" outlined hide-details dense readonly></v-text-field>
                                        </v-col>
                                    </v-row>

                                    <!-- <v-row align="baseline" dense>
                                        <h4 class="font-weight-medium body-2 mt-4">Heent</h4>
                                        <template v-if="previous_record_data.heent && previous_record_data.heent.length > 0">
                                            <v-col v-for="(item, index) in previous_record_data.heent" :key="index" cols="12" >
                                                <v-text-field v-model="item.heent" class="ma-0 checkbox_label" hide-details outlined dense readonly></v-text-field>
                                            </v-col>
                                        </template>

                                        <v-col v-else cols="12">
                                            <label class="font-italic body-2">No Available Heent</label>
                                        </v-col>

                                        <v-col class="align-baseline d-flex" cols="12" v-if="previous_record_data.others_notes">
                                            <v-label>Others:</v-label>
                                            <v-text-field v-model="previous_record_data.others_notes" class="body-2 pl-4" outlined hide-details dense readonly></v-text-field>
                                        </v-col>
                                    </v-row> -->
                                </v-expansion-panel-content>
                            </v-tab-item>

                            <v-tab-item class="mt-1">
                                <v-expansion-panel-content class="mt-2 mb-2">
                                   <template v-if="previous_record_data.procedure && previous_record_data.procedure.length > 0">
                                        <v-row class="text-center">
                                            <v-col sm="3" md="3" lg="3">
                                                <div class="font-weight-medium body-2">CPT CODE</div>
                                            </v-col>
                                            <v-col sm="3" md="3" lg="3">
                                                <div class="font-weight-medium body-2">DESCRIPTION</div>
                                            </v-col>
                                            <v-col sm="3" md="3" lg="3">
                                                <div class="font-weight-medium body-2">STATUS</div>
                                            </v-col>
                                            <v-col sm="3" md="3" lg="3">
                                                <div class="font-weight-medium body-2">ACTION</div>
                                            </v-col>
                                        </v-row>

                                        <div v-for="(value, index) in previous_record_data.procedure" :key="index">
                                            <v-row class="text-center">
                                                <v-col sm="3" md="3" lg="3">
                                                    <div class="body-2 mt-2">{{ value.cpt_code }}</div>
                                                </v-col>
                                                <v-col sm="4" md="3" lg="3">
                                                    <div class="body-2 mt-2">{{ value.cpt_desc }}</div>
                                                </v-col>
                                                <v-col sm="2" md="3" lg="3">
                                                    <div class="body-2 mt-2">{{ value.diag_exam_status }}</div>
                                                </v-col>
                                                <v-col sm="2" md="3" lg="3">
                                                    <div class="body-2 mt-2">
                                                        <v-btn @click="ViewCptCodeForm(value.cpt_code, previous_record_data.transaction_number, value.cpt_desc, value.libDesc, value.diag_exam_status, previous_record_data.procedure.prescription_date)" :disabled="value.diag_exam_status !== 'Done'" small elevation="6" :key="value.cpt_code">
                                                            <v-icon left small>mdi-file-search-outline</v-icon> View
                                                        </v-btn>
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </template>

                                    <template v-else>
                                        <p class="font-italic body-2">No Available Laboratory Request</p>
                                    </template>
                                </v-expansion-panel-content>
                            </v-tab-item>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-tabs-items>

                <h4 class="font-weight-medium body-2 mt-4">Assessment</h4>
                <v-textarea v-if="previous_record_data.admitting_diagnosis" :value="previous_record_data.admitting_diagnosis" class="body-2" rows="3" hide-details readonly outlined dense></v-textarea>
                <label v-else class="font-italic body-2">No Available Assessment</label>

                <v-row dense>
                    <v-col :cols="previous_record_data.icd_condition ? 8 : 12">
                        <h4 class="font-weight-medium body-2 mt-4">Primary Diagnosis</h4>
                        <v-text-field v-if="previous_record_data.icd_code && previous_record_data.icd_description" :value="previous_record_data.icd_code + '/' + previous_record_data.icd_description" class="body-2" hide-details readonly outlined dense></v-text-field>
                        <label v-else class="font-italic body-2">No Available Diagnosis</label>
                    </v-col>

                    <v-col v-if="previous_record_data.icd_condition" cols="12" md="4" lg="4">
                        <h4 class="font-weight-medium body-2 mt-4">Condition</h4>
                        <v-text-field :value="previous_record_data.icd_condition" class="body-2" hide-details readonly outlined dense></v-text-field>
                    </v-col>
                </v-row>

                <h4 class="font-weight-medium body-2 mt-4">Procedure</h4>
                <template v-if="previous_record_data.procedure">
                    <div v-for="value in previous_record_data.procedure" :key="value.cpt_code"> <!--Changed from index key to value.cpt_code-->
                        <v-text-field :value="`${value.cpt_code}/${value.cpt_description_long}${value.modifier ? ' - ' + value.modifier.mod_description : ''}`" class="body-2 mb-2" hide-details readonly outlined dense></v-text-field>
                    </div>  
                </template>
                <label v-else class="font-italic body-2">No Available Procedure</label>
                
                <h4 class="font-weight-medium body-2 mt-4">Medicine</h4>
                <label v-if="previous_medicine.loader" class="font-italic body-2">Loading Medicine Data...</label>
                <label v-else-if="previous_medicine.medicine.length === 0" class="font-italic body-2">No Prescribed Medicine.</label>
                <div v-else :class="{'table-overflow-x' : $vuetify.breakpoint.mdAndDown}">
                    <table class="mt-4 mb-7" cellspacing="0" cellpadding="0">
                        <tr>
                            <th class="font-weight-medium body-2">Generic Name</th>
                            <th class="font-weight-medium body-2">Dosage</th>
                            <th class="font-weight-medium body-2">Preparation</th>
                            <th class="font-weight-medium body-2">Route</th>
                            <th class="font-weight-medium body-2">Duration</th>
                            <th class="font-weight-medium body-2">Frequency</th>
                            <th class="font-weight-medium body-2">Remarks</th>
                        </tr>
                        <tr v-for="(med, i) in previous_medicine.medicine" :key="i">
                            <td style="width: 25%">
                                <v-text-field v-model="med.generic_name" class="body-2 px-1" hide-details readonly></v-text-field>
                            </td> 
                            <td style="width: 15%">
                                <v-text-field v-model="med.dosage" class="body-2 px-1" hide-details readonly></v-text-field>
                            </td>
                            <td style="width: 15%">
                                <v-text-field v-model="med.preparation" class="body-2 px-1" hide-details readonly></v-text-field>
                            </td>
                            <td style="width: 15%">
                                <v-text-field v-model="med.route" class="body-2 px-1" hide-details readonly></v-text-field>
                            </td>
                            <td style="width: 10%">
                                <v-text-field v-model="med.duration" class="body-2 px-1" hide-details readonly></v-text-field>
                            </td>
                            <td style="width: 10%">
                                <v-text-field v-model="med.frequency_of_med" class="body-2 px-1" hide-details readonly></v-text-field>
                            </td>
                            <td style="width: 15%">
                                <v-text-field v-model="med.notes" class="body-2 px-1" hide-details readonly></v-text-field>
                            </td>
                        </tr>
                    </table>
                </div>

                <h4 class="font-weight-medium body-2 mt-4">Management Type</h4> 
                <div v-for="(mgt, index) in previous_record_data.management_description" :key="mgt.lib_id + index">
                    <v-text-field v-if="mgt.management_description" :value="mgt.management_description" class="body-2 mb-2" hide-details readonly outlined dense></v-text-field>
                    <label v-else class="font-italic body-2">No Available Management Type</label>
                </div>

                <h4 class="font-weight-medium body-2 mt-4">Doctor Notes</h4>
                <v-textarea v-if="previous_record_data.doctor_note" v-model="previous_record_data.doctor_note" class="body-2 scrollable-note" rows="4" hide-details readonly outlined></v-textarea>
                <label v-else class="font-italic body-2">No Available Doctor Notes</label>

                <v-row dense> 
                    <v-col cols="12" sm="12" md="12" lg="12"> 
                        <h4 class="font-weight-medium body-2 mt-4"> Plan </h4>
                    </v-col>
                    <template v-if="previous_record_data.diet && previous_record_data.fluid_intake"> 
                        <v-col cols="12" sm="12" md="12" lg="12" class="d-flex"> 
                            <v-text-field v-if="previous_record_data.diet" :value="previous_record_data.diet" label="Diet" class="body-2 mr-1" hide-details readonly outlined dense></v-text-field>
                            <v-text-field v-if="previous_record_data.fluid_intake" :value="previous_record_data.fluid_intake" label="Fluid Intake" class="body-2 ml-1" hide-details readonly outlined dense></v-text-field>
                        </v-col>
                    </template>
                    <template v-else> 
                        <label class="font-italic body-2">No Available Plan</label>
                    </template>
                </v-row>
                <div class="d-flex">
                    <v-btn @click="viewClinicalAbstract(previous_record_data.transaction_number)" class="d-block mt-4 mb-6 mr-4" color="#367c9d" small dark>View Clinical Abstract</v-btn>
                    <template v-if="eligible_data.konsulta_eligible"> 
                        <EkassEpress :transaction_number="previous_record_data.transaction_number" :patient_info="patient_info"/>
                    </template>
                </div>
                <div class="text-center">
                    <v-divider class="mb-6"></v-divider>
                    <v-btn @click="previous_record_display = false">CLOSE</v-btn>
                </div>
            </v-card>
        </v-dialog>

        <ClinicalAbstract ref="clinical_abstract" :emr_params="emr_params" />
        <DiagnosticForm 
            :patient_info="patient_info" 
            :procedure_loader.sync="procedure_loader" 
            :doctor_info ="{ doctor_name: previous_record_data.doctor_first_name + ' ' + previous_record_data.doctor_middle_name + ' ' + previous_record_data.doctor_last_name + ' ' + previous_record_data.doctor_suffix, doc_tin: previous_record_data.doctor_prc_license }"
            ref="view_cpt_code_form"
        />
        <Alert :alert="alert" />
    </div>
</template>

<script>
import Alert from '@/components/Alert'
import ClinicalAbstract from '@/components/emr/ClinicalAbstract'
import EkassEpress from '@/components/emr/printable-form/ekass-epress/Main'
import DiagnosticForm from '@/components/emr/diagnostic-exam-result/diagnostic-exam-forms/Main'

export default{
    props: ['emr_params', 'patient_info', 'eligible_data','patient_age', 'patient_birthdate', 'patient_gender','for_migration'],

    components: {
        Alert,
        ClinicalAbstract,
        EkassEpress,
        DiagnosticForm,
    },

    data(){
        return{
            previous_record_display: false,
            previous_record_data: {},
            previous_medicine: {
                loader: true,
                medicine: []
            },
            selected_record: '',

            tbl_loading: true,
            tbl_search: '',
            tbl_headers: [
                { text: 'REFERRAL CODE', value: 'referral_code', width: '250px', sortable: false },
                { text: 'DATE AND TIME', value: 'date_created', width: '200px' },
                { text: 'ATTENDING PHYISICIAN', value: 'authorized_doctor', width: '160px', sortable: false },
                { text: 'DOCTOR NAME', value: 'doctor_name', width: '200px', sortable: false },
                { text: 'DOCTOR SPECIALIZATION', value: 'specialization', width: '200px', sortable: false },
                { text: 'CHIEF COMPLAINT', value: 'chief_com', width: '200px', sortable: false },
                { text: 'ICD DESCRIPTION', value: 'icd_description', width: '250px', sortable: false },
                { text: 'HEALTHCARE FACILITY', value:'provider_name', width: '200px', sortable: false },
                { text: 'TRANSACTION TYPE', value: 'transaction_type', width: '160px', sortable: false },
                { text: 'NURSE', value: 'nurse_name', width: '160px', sortable: false }
            ],
            tbl_items: [],

            alert: {},
            panel:[0],
            tab:'',

            procedure_loader: false
        }
    },

    created(){
        this.getMedicalRecords();
    },

    methods: {
        // GET MEDICAL RECORDS
        async getMedicalRecords(){
            let medical_records = sessionStorage.getItem('lxcvKDsk904S') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('lxcvKDsk904S'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true
            }
            if(medical_records.fresh_load){
                let response = await this.$services.getTransactionPreviousByType({
                    transaction_type: 'ALL',
                    first_name: this.patient_info.mem_first_name,
                    middle_name: this.patient_info.mem_middle_name,
                    last_name: this.patient_info.mem_last_name,
                    suffix: this.patient_info.mem_suffix,
                    birthday: this.patient_info.mem_birthdate,
                    hmo_policy_number: this.emr_params.hmo_policy_number,
                    hmo_host_code: this.emr_params.hmo_host_code,
                    ek_phic_id: this.emr_params.ek_phic_id,
                    ek_lgu_id: this.emr_params.ek_lgu_id,
                    lgu_host_code: this.emr_params.lgu_host_code
                })

                if (response.status === 200) {
                    if(response.data === 'Data not found.'){
                        this.tbl_items = []
                    }else{
                        this.tbl_items = this.responseDataDecryption(response.data)  
                    }
                    this.tbl_items.map(data => {
                        
                        if(data.patient_record === null) {
                            data.patient_record = {
                                height: ''
                            }
                        }

                        if(data.physical_exam_data === null) {
                            data.physical_exam_data = {
                                blood_pressure: '',
                                blood_pressure_2nd: '',
                                central_adiposity: '',
                                heart_rate: '',
                                oxygen_saturation: '',
                                pulse_rate: '',
                                respiration_rate: '',
                                temp: '',
                                waist_circumference: ''
                            }
                        }

                        if(data.patient_symptoms === null) {
                            data.patient_symptoms = [{
                                duration: '',
                                othercomplaint: '',
                                pain_site: '',
                                symptom: 'NONE',
                                symptoms_id: ''
                            }]
                        }
                    })

                    

                    medical_records.fresh_load = false
                    medical_records.tbl_items = this.tbl_items

                    sessionStorage.setItem('lxcvKDsk904S', this.$crypto.AES.encrypt(JSON.stringify(medical_records), 'EMX246'))
                    this.tbl_loading = false
                } else {
                    this.alert = response.error
                }
            }else{
                this.tbl_items = medical_records.tbl_items
                this.tbl_loading = false
            }
        },
        
        // VIEW PREVIOUS RECORD
        viewPreviousRecord(item){
            if(this.selected_record === item.date_created){
                this.getTransactionMedicine(item.transaction_number)
                this.previous_record_data = item
                this.previous_record_display = true
            }else{
                this.selected_record = item.date_created
            }
        },

        // GET MEDICINE RECORD
        async getTransactionMedicine(transaction_number){
            this.previous_medicine.loader = true
            let response = await this.$services.getPatientMedicine({ transaction_number: transaction_number })

            if (response.status === 200) {
                if(response.data.has_data){
                    this.previous_medicine.medicine = this.responseDataDecryption(response.data.medicine_data)
                }else{
                    this.previous_medicine.medicine = []
                }

                this.previous_medicine.loader = false
            } else {
                this.alert = response.alert
            }
        },

        viewClinicalAbstract(transaction_number) {
            this.$refs.clinical_abstract.openClinicalAbstract(transaction_number, [
                {
                    icd_code: this.previous_record_data.icd_code,
                    icd_description: this.previous_record_data.icd_description,
                    procedure_list: this.previous_record_data.procedure,
                    selected_medicine: this.previous_medicine.medicine,
                    doctor_notes: this.previous_record_data.doctor_note
                }
            ]);
        },

        async ViewCptCodeForm(cpt_code, transaction_number, cpt_desc, libDesc, pStatus, prescription_date){
            this.procedure_loader = true
            
            let response = await this.$services.getDiagnosticExamResults({
                transaction_number: transaction_number, 
                cpt_code: cpt_code
            })

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                    
                let diagnostic = {
                    cpt_code: cpt_code,
                    cpt_desc: cpt_desc,
                    libDesc: libDesc,
                    pStatus: pStatus,
                    diagnostic: response.data[0]
                }
                
                if(pStatus === 'Done'){
                    this.emr_page = false
                }else{
                    this.emr_page = true
                }

                this.$refs.view_cpt_code_form.openDiagnosticExam(diagnostic, transaction_number, prescription_date, this.emr_page)
            } else {
                this.alert = response.error
            }
        },

        getAssessmentLabel(key) {
            const custom_labels = {
                chest: "CHEST & LUNGS",
                cvs: "CVS",
                abdomen: "ABDOMEN",
                gui: "GENITOURINARY TRACT",
                pelvic: "PELVIC EXAMINATION",
                rectal: "DIGITAL RECTAL EXAM",
                musculoskeletal: "MUSCULOSKELETAL EXAM",
                skin: "SKIN",
                neuro: "NEUROLOGIC EXAMINATION",
                heent: "HEENT"
            };
            return custom_labels[key] || key; 
        },  

        getItemText(key, index, property) {
            const assessment = this.previous_record_data.patient_assessment[key];
            if (property === 'assessment' && assessment && assessment.assessment && assessment.assessment[index]) {
                return assessment.assessment[index].assessment; 
            }
            if (property === 'others_notes' && assessment && assessment.others_notes) {
                return assessment.others_notes;
            }
            return '';
        }
    }
}
</script>

<style scoped>

.scrollable-note {
    overflow-y: auto;
    max-height: 200px;
}

.v-expansion-panels{
    z-index: unset !important;
}

::v-deep .v-expansion-panel-content__wrap {
    padding: 0;
}

::v-deep .v-tabs-bar {
    border-radius: inherit !important;
    height: 40px !important;
}
::v-deep .v-tabs:not(.v-tabs--vertical):not(.v-tabs--right) > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes) .v-slide-group__prev {
    display:none;
    visibility: hidden;
}

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

</style>