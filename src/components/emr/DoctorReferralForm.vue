<template>
    <div id="for-print-absolute">
        <v-card id="for-print-relative" class="px-8 pt-8 pb-3" flat>
            <div v-if="loading_referral_data" class="text-center">
                <div class="my-16">
                    <v-progress-circular color="primary" size="100" indeterminate></v-progress-circular>
                    <h4 class="light-blue--text text--darken-4 mt-10 pl-5">Loading... Please wait...</h4>
                </div>

                <v-divider class="mt-16"></v-divider>
                <v-btn @click="closeDoctorReferral" class="mt-4 mb-1">CLOSE</v-btn>
            </div>
            
            <template v-else>
                <Header />
                
                <h3 class="text-center mt-2">REFERRAL FORM</h3>

                <v-row dense>
                    <v-col class="align-baseline d-flex" cols="12" xs="4" sm="4" md="4" lg="4">
                        <label class="font-weight-medium body-2">Name:</label>
                        <span class="input--border body-2">{{ patient_info.mem_first_name + ' ' + (patient_info.mem_middle_name ? patient_info.mem_middle_name : '') + ' ' + patient_info.mem_last_name + ' ' + (patient_info.mem_suffix ? patient_info.mem_suffix : '') }}</span>
                    </v-col>

                    <v-col class="align-baseline d-flex" cols="12" xs="" sm="" md="" lg=""> 
                        <label class="font-weight-medium body-2">Birthdate:</label>
                        <span class="input--border body-2">{{ formatDate(patient_info.mem_birthdate) }}</span>
                    </v-col>

                    <v-col class="align-baseline d-flex" cols="12" xs="" sm="" md="" lg=""> 
                        <label class="font-weight-medium body-2">Age:</label>
                        <span class="input--border body-2">{{ getAge(patient_info.mem_birthdate) }}</span>
                    </v-col>

                    <v-col class="align-baseline d-flex" cols="12" xs="" sm="" md="" lg="">
                        <label class="font-weight-medium body-2">Date:</label>
                        <span class="input--border body-2">{{ referral_date }}</span>
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col class="align-baseline d-flex" cols="12" xs="auto" sm="" md="" lg="">
                        <label class="font-weight-medium body-2">Gender:</label>
                        <span class="input--border body-2">{{ patient_info.mem_gender }}</span>
                    </v-col>

                    <v-col class="align-baseline d-flex" cols="12" xs="3" sm="" md="3" lg="3">
                        <label class="font-weight-medium text-no-wrap body-2">Contact Number:</label>
                        <span v-if="patient_info.mem_mobile_number" class="input--border body-2">{{ patient_info.mem_mobile_number }}</span>
                        <span v-else class="input--border body-2 white--text">.</span>
                    </v-col>

                    <v-col class="align-baseline d-flex" cols="12" xs="7" sm="7" md="7" lg="7">
                        <label class="font-weight-medium text-no-wrap body-2">Address:</label>
                        <span class="input--border body-2">{{ (patient_info.mem_home_bldgno ? patient_info.mem_home_bldgno + ' ' : '') + (patient_info.mem_home_bgy ? patient_info.mem_home_bgy + ' ' : '') + (patient_info.mem_home_city_municipality ? patient_info.mem_home_city_municipality + ' ' : '') + (patient_info.mem_home_province ? patient_info.mem_home_province + ' ' : '') + (patient_info.mem_home_zip ? patient_info.mem_home_zip + ' ' : '') }}</span>
                    </v-col>
                    
                    <v-col class="align-baseline d-flex" cols="12" xs="7" sm="7" md="7" lg="7">
                        <label class="font-weight-medium text-no-wrap body-2">Philhealth Number/Details:</label>
                        <span class="input--border body-2">{{ (patient_info.mem_phic_pin? patient_info.mem_phic_pin : '&nbsp;') }}</span>
                    </v-col>
                </v-row>

                <v-divider class="divider"></v-divider>
                
                <v-form :readonly="!emr_params.editable" ref="referral_form">
                    <v-row align="baseline" dense>
                        <v-col cols="12" sm="3" md="2" xl="2">
                            <label class="font-weight-medium body-2">Referral Code</label>
                        </v-col>
                        <v-col cols="12" sm="" md="" xl="">
                            <h4 class="font-weight-medium body-2 referral-code">{{ referral_code }}</h4>
                        </v-col>
                    </v-row>

                    <v-row class="input--margin pr-1" align="baseline" dense>
                        <v-col cols="12" sm="3" md="2" xl="2">
                            <label class="font-weight-medium body-2">Doctor's Specialization<span class="d-print-none red--text"> *</span></label>
                        </v-col>
                        <v-col cols="12" sm="" md="" xl="">
                            <v-combobox v-model="referral_doctor_specialization" :items="specialization_items" :loading="loading_specialization" :rules="emr_params.editable ? referral_rules : []" @change="mutationStatus('referral')" class="d-print-none body-2" hide-details hide-no-data dense></v-combobox>
                            <span class="d-print-block d-none input--border body-2">{{ referral_doctor_specialization }}</span>
                        </v-col>
                    </v-row>

                    <v-row class="input--margin pr-1" align="baseline" dense>
                        <v-col cols="12" sm="3" md="2" xl="2">
                            <label class="font-weight-medium body-2">Healthcare Facility</label>
                        </v-col>
                        <v-col cols="12" sm="" md="" xl="">
                            <v-combobox v-model="referral_doctor_provider_name" :items="provider_items" :loading="loading_provider" @change="selectProvider" class="d-print-none body-2" item-text="name" hide-details hide-no-data dense></v-combobox>
                            <span class="d-print-block d-none input--border body-2">{{ referral_doctor_provider_name }}<span class="white--text">.</span></span>
                        </v-col>
                    </v-row>

                    <v-row class="input--margin pr-1" align="baseline" dense>
                        <v-col cols="12" sm="3" md="2" xl="2">
                            <label class="font-weight-medium body-2">Doctor's Name</label>
                        </v-col>
                        <v-col cols="12" sm="" md="" xl="">
                            <v-text-field v-model="referral_doctor_first_name" @blur="mutationStatus('referral')" class="d-print-none body-2" label="First" hide-details dense></v-text-field>
                            <span class="d-print-block d-none input--border body-2">{{ referral_doctor_first_name }}<span class="white--text">.</span></span>
                        </v-col>
                        <v-col cols="12" sm="" md="" xl="">
                            <v-text-field v-model="referral_doctor_middle_name" @blur="mutationStatus('referral')" class="d-print-none body-2" label="Middle" hide-details dense></v-text-field>
                            <span class="d-print-block d-none input--border body-2">{{ referral_doctor_middle_name }}<span class="white--text">.</span></span>
                        </v-col>
                        <v-col cols="12" sm="" md="" xl="">
                            <v-text-field v-model="referral_doctor_last_name" @blur="mutationStatus('referral')" class="d-print-none body-2" label="Last" hide-details dense></v-text-field>
                            <span class="d-print-block d-none input--border body-2">{{ referral_doctor_last_name }}<span class="white--text">.</span></span>
                        </v-col>
                    </v-row>

                    <v-row class="input--margin pr-1" align="baseline" dense>
                        <v-col cols="12" sm="3" md="2" xl="2">
                            <label class="body-2 font-weight-medium">Doctor's Contact Number</label>
                        </v-col>
                        <v-col cols="12" sm="" md="" xl="">
                            <v-text-field v-model="referral_doctor_contact_number" v-on:keypress="numberOnly" @blur="mutationStatus('referral')" class="d-print-none body-2" maxlength="10" onpaste="return false" hide-details dense>
                                <template v-slot:prepend-inner>
                                    <span class="contact-prefix">(+63)</span>
                                </template>
                            </v-text-field>
                            <span class="d-print-block d-none input--border body-2">(+63){{ referral_doctor_contact_number }}<span class="white--text">.</span></span>
                        </v-col>
                    </v-row>

                    <v-row class="input--margin pr-1" align="baseline" dense>
                        <v-col cols="12" sm="3" md="2" xl="2">
                            <label class="body-2 font-weight-medium">Reasons for Referral <span class="red--text d-print-none">*</span></label>
                        </v-col>
                        <v-col cols="12" sm="" md="" xl="">
                            <v-text-field v-model="reason_for_referral" :rules="emr_params.editable ? referral_rules : []" @blur="mutationStatus('referral')" class="d-print-none body-2" hide-details dense></v-text-field>
                            <span class="d-print-block d-none input--border body-2">{{ reason_for_referral }}<span class="white--text">.</span></span>
                        </v-col>
                    </v-row>

                    <v-divider class="divider"></v-divider>

                    <h6 class="font-weight-bold body-1 mb-md-4 mb-2">Medical Information</h6>

                    <template v-if="chief_complaint">
                        <h4 class="font-weight-medium body-1">Chief Complaint</h4>
                        <h5 class="font-weight-regular padding--top body-2 pl-4">{{ chief_complaint }}</h5>
                    </template>

                    <template v-if="$store.state.usr_credentials.department === 'Doctor' || $store.state.usr_credentials.department === 'Midwife'">
                        <template v-if="selected_icd.length > 0 && selected_icd[0].icd_code">
                            <h4 class="font-weight-medium body-1 mt-md-4 mt-2">Diagnosis and Procedures</h4>
                            
                            <div v-for="(icd, icd_index) in selected_icd" :key="icd_index" class="pl-4">
                                <h5 v-if="icd_index === 0" class="font-weight-bold padding--top body-2">Primary Diagnosis</h5>
                                <h5 v-else-if="icd_index === 1" class="font-weight-bold padding--top body-2 mt-md-4 mt-2">Secondary Diagnosis</h5>
                                <h5 v-else class="font-weight-bold padding--top body-2 mt-md-4 mt-2">Other Diagnosis</h5>
                                <h5 class="font-weight-regular padding--top body-2">{{ icd.icd_code }} / {{ icd.icd_description }}</h5>

                                <template v-if="icd.procedures.length > 0">
                                    <h5 class="font-weight-bold padding--top body-2 pl-6">Requested Procedure(s)</h5>
                                    <h5 v-for="(cpt, cpt_index) in icd.procedures" :key="cpt_index" class="font-weight-regular padding--top body-2 pl-6">{{ cpt.cpt_code }} / {{ cpt.cpt_description }}</h5>
                                </template>
                            </div>
                        </template>
                    </template>
                    
                    <div v-if="selected_medicine.length > 0" class="medicine--table">
                        <h4 class="font-weight-medium body-1 mt-md-4 mt-2 mb-2">Prescribed Medicine</h4>
                        
                        <div class="medicine--header d-flex d-row">
                            <h4>Generic Name</h4>
                            <!-- <h4>Brand</h4> -->
                            <h4>Dosage/Preparation</h4>
                            <h4>Frequency</h4>
                            <h4>Duration</h4>
                            <h4>Total # of Medicine</h4>
                            <h4>Remarks</h4>
                        </div>

                        <div v-for="(med, i) in selected_medicine" :key="i" class="align-start d-flex d-row">
                            <div class="medicine--body">{{ med.generic_name }}</div>
                            <!-- <div class="medicine--body">{{ med.brand_name ? med.brand_name : 'None' }}</div> -->
                            <div class="medicine--body">{{ med.dosage }} / {{ med.preparation }}</div>
                            <div class="medicine--body">{{ med.frequency_of_med }}</div>
                            <div class="medicine--body">{{ med.duration }}</div>
                            <div class="medicine--body">{{ med.total_num_of_med }}</div>
                            <div class="medicine--body">{{ med.notes }}</div>
                        </div>
                    </div>

                    <v-divider class="divider"></v-divider>

                    <h6 class="font-weight-bold body-1 mb-1">Physical Examination</h6>

                    <v-row dense>
                        <v-col class="align-baseline d-flex" cols="12" xs="" sm="" md="5" lg=""> 
                            <label class="font-weight-medium body-2">BP:</label>
                            <span v-if="pex_data.bp_systolic && pex_data.bp_diastolic" class="input--border body-2">{{ pex_data.bp_systolic }}/{{ pex_data.bp_diastolic }}</span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>
                    
                        <v-col class="align-baseline text-no-wrap d-flex" cols="12" xs="" sm="" md="7" lg=""> 
                            <label class="font-weight-medium body-2">BP 2nd Reading:</label>
                            <span v-if="pex_data.bp_2nd_systolic && pex_data.bp_2nd_diastolic" class="input--border body-2">{{ pex_data.bp_2nd_systolic }}/{{ pex_data.bp_2nd_diastolic }}</span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="" sm="" md="4" lg="">
                            <label class="font-weight-medium body-2">HR:</label>
                            <span v-if="pex_data.heart_rate" class="input--border body-2">{{ pex_data.heart_rate }}</span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="" sm="" md="4" lg="">
                            <label class="font-weight-medium body-2">RR:</label>
                            <span v-if="pex_data.respiration_rate" class="input--border body-2">{{ pex_data.respiration_rate }}</span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="6" lg="3">
                            <label class="font-weight-medium body-2">Temp:</label>
                            <span v-if="pex_data.temp" class="input--border body-2">{{ pex_data.temp }}</span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="6" lg="3">
                            <label class="font-weight-medium body-2">O2Sat:</label>
                            <span v-if="pex_data.o2sat" class="input--border body-2">{{ pex_data.o2sat }}</span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="6" lg="3">
                            <label class="font-weight-medium body-2">HT:</label>
                            <span v-if="pex_data.height === 'Decryption Failed'" class="input--border body-2 white--text">.</span>
                            <span v-else-if="pex_data.height" class="input--border body-2">{{ pex_data.height }} <span class="text--secondary">(cm)</span></span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="6" lg="3">
                            <label class="font-weight-medium body-2">WT:</label>
                            <span v-if="pex_data.weight === 'Decryption Failed'" class="input--border body-2 white--text">.</span>
                            <span v-else-if="pex_data.weight" class="input--border body-2">{{ pex_data.weight }} <span class="text--secondary">(kg)</span></span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="6" lg="3">
                            <label class="font-weight-medium body-2">BMI:</label>
                            <span v-if="pex_data.bmi_computation.bmi" class="input--border body-2">{{ pex_data.bmi_computation.bmi }}</span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="6" lg="3">
                            <label class="font-weight-medium body-2">Remarks:</label>
                            <span v-if="pex_data.bmi_computation.remarks === 'Decryption Failed'" class="input--border body-2 white--text">.</span>
                            <span v-else-if="pex_data.bmi_computation.remarks" class="input--border body-2">{{ pex_data.bmi_computation.remarks }}</span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="6" lg="3">
                            <label class="font-weight-medium text-no-wrap body-2">Central Adiposity:</label>
                            <span v-if="pex_data.central_adiposity" class="input--border body-2">{{ pex_data.central_adiposity === '1' ? 'Yes' : 'No' }}</span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="6" lg="3">
                            <label class="font-weight-medium text-no-wrap body-2">Waist Circumference:</label>
                            <span v-if="pex_data.waist_circumference" class="input--border body-2">{{ pex_data.waist_circumference }} <span class="text--secondary">(cm)</span></span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="6" lg="3">
                            <label class="font-weight-medium body-2 text-no-wrap">Left Vision:</label>
                            <span v-if="pex_data.left_vision" class="input--border body-2">{{ pex_data.left_vision }}</span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="6" lg="3">
                            <label class="font-weight-medium body-2 text-no-wrap">Right Vision:</label>
                            <span v-if="pex_data.right_vision" class="input--border body-2">{{ pex_data.right_vision }}</span>
                            <span v-else class="input--border body-2 white--text">.</span>
                        </v-col>
                    </v-row>


                    <v-divider class="divider"></v-divider>
                    
                    <h6 class="font-weight-bold body-1">Referring Doctor Information</h6>

                    <v-row v-if="$store.state.usr_credentials.department === 'Doctor' || $store.state.usr_credentials.department === 'Midwife'" class="input--margin" dense>
                        <v-col class="align-baseline d-flex" cols="12" sm="7" xl="7">
                            <label class="font-weight-medium body-2 pr-2">Name:</label>
                            <v-text-field :value="doctor_data.first_name + (doctor_data.middle_name ? ' ' + doctor_data.middle_name + ' ' : ' ') + doctor_data.last_name" class="d-print-none body-2" hide-details readonly dense></v-text-field>
                            <span class="d-print-block d-none input--border body-2">{{ doctor_data.first_name + (doctor_data.middle_name ? ' ' + doctor_data.middle_name + ' ' : ' ') + doctor_data.last_name }}</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" sm="5" xl="5">
                            <label class="font-weight-medium text-no-wrap body-2 pr-2">Contact Number:</label>
                            <v-text-field v-model="referring_doctor_contact_no" v-on:keypress="numberOnly" @blur="mutationStatus('referral')" class="d-print-none body-2" maxlength="10" onpaste="return false" hide-details dense>
                                <template v-slot:prepend-inner>
                                    <span class="contact-prefix">(+63)</span>
                                </template>
                            </v-text-field>
                            <span class="d-print-block d-none input--border body-2">{{ referring_doctor_contact_no }}</span>
                        </v-col>
                    </v-row>

                    <v-row v-else class="input--margin" dense>
                        <v-col class="align-baseline d-flex" cols="12" sm="7" xl="7">
                            <label class="font-weight-medium body-2">Name:</label>
                            <span class="input--border body-2">N/A</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" sm="5" xl="5">
                            <label class="font-weight-medium text-no-wrap body-2">Contact Number:</label>
                            <span class="input--border body-2">N/A</span>
                        </v-col>
                    </v-row>

                    <v-row class="input--margin" dense>
                        <v-col class="align-baseline d-flex" cols="12" sm="12" xl="12">
                            <label class="font-weight-medium text-no-wrap body-2">Healthcare Facility:</label>
                            <span class="input--border body-2">{{ $store.state.prv_data.provider_name }}</span>
                        </v-col>
                    </v-row>
                </v-form>

                <div class="d-print-block d-none" :style="{'margin-top' : return_slip_margin}"></div>

                <div class="return-slip">
                    <h4 class="font-weight-medium body-2 pt-2 pb-3">Note: Please retain upper half at receiving institution</h4>
                    <h3 class="font-weight-bold body-1 mt-3">Return Slip</h3>

                    <v-row dense>
                        <v-col class="align-baseline d-flex" cols="12" xs="8" sm="8" md="8" lg="8">
                            <label class="font-weight-medium body-2">Name:</label>
                            <span class="input--border body-2">{{ patient_info.mem_first_name + ' ' + (patient_info.mem_middle_name ? patient_info.mem_middle_name : '') + ' ' + patient_info.mem_last_name + ' ' + (patient_info.mem_suffix ? patient_info.mem_suffix : '') }}</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="4" sm="4" md="4" lg="4">
                            <label class="font-weight-medium body-2">Date:</label>
                            <span class="input--border white--text body-2">.</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="8" sm="8" md="8" lg="8">
                            <label class="font-weight-medium body-2 text-no-wrap">Address:</label>
                            <span class="input--border body-2">{{ (patient_info.mem_home_bldgno ? patient_info.mem_home_bldgno + ' ' : '') + (patient_info.mem_home_bgy ? patient_info.mem_home_bgy + ' ' : '') + (patient_info.mem_home_city_municipality ? patient_info.mem_home_city_municipality + ' ' : '') + (patient_info.mem_home_province ? patient_info.mem_home_province + ' ' : '') + (patient_info.mem_home_zip ? patient_info.mem_home_zip + ' ' : '') }}</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="4" sm="4" md="4" lg="4"> 
                            <label class="font-weight-medium body-2">Birthdate:</label>
                            <span class="input--border body-2">{{ formatDate(patient_info.mem_birthdate) }}</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="8" sm="8" md="8" lg="8"> 
                            <label class="font-weight-medium body-2 text-no-wrap">Philhealth Number/Details:</label>
                            <span class="input--border body-2">{{ patient_info.mem_phic_pin ? patient_info.mem_phic_pin : '&nbsp;' }}</span>
                        </v-col>
                    </v-row>

                    <v-divider class="divider"></v-divider>

                    <v-row dense>
                        <v-col cols="6" xs="12" md="6" lg="6">
                            <label class="font-weight-medium d-block body-2">Impression/Diagnosis:</label>
                        </v-col>

                        <v-col cols="6" xs="12" md="6" lg="6">
                            <label class="font-weight-medium d-block body-2">Action Taken:</label>
                        </v-col>
                    </v-row>
                
                    <label class="font-weight-medium d-block body-2 mt-4">Recommendation/Instructions:</label>
                    <label class="font-weight-medium d-block body-2 mt-4">Disposition:</label>
                    <label class="font-weight-medium d-block body-2 mt-4">Received/Managed by: (Signature, Name, Designation)</label>
                </div>

                <div class="d-print-none">
                    <template v-if="$store.state.usr_credentials.department === 'Midwife' && !emr_params.editable"> 
                        <v-row justify="end" dense>
                            <v-col class="text-right" cols="12" lg="4">
                                <v-btn @click="closeDoctorReferral" class="my-2">
                                    CLOSE   
                                    <v-icon size="20" right>mdi-close</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>
                    <template v-else> 
                        <v-row v-if="!emr_params.editable" justify="end" dense>
                            <!-- <v-col class="text-center" cols="12" lg="4">
                                <v-btn v-if="emr_params.editable" :loading="loading_specialization" @click="saveAsPDF" class="white--text ma-2" color="#367c9d">
                                    SAVE AS PDF   
                                    <v-icon size="20" right>mdi-file-pdf-box</v-icon>
                                </v-btn>

                                <v-btn v-if="emr_params.editable" :loading="loading_specialization" @click="printReferralForm" class="white--text ma-2" color="#367c9d">
                                    PRINT   
                                    <v-icon size="20" right>mdi-printer</v-icon>
                                </v-btn>
                            </v-col> -->
                            <v-col class="text-right" cols="12" lg="4">
                                <v-btn @click="closeDoctorReferral" class="my-2">
                                    CLOSE   
                                    <v-icon size="20" right>mdi-close</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <Footer v-else :loading="loading_specialization" @saveAsPDF="saveAsPDF" @print="printReferralForm" @close="closeDoctorReferral" :emr_params="emr_params"/>
                    </template>
                </div>
            </template>
        </v-card>

        <Alert :alert="alert" />
    </div>
</template>

<script>
import Alert from '@/components/Alert.vue'
import jsPDF from 'jspdf'
import { mapState } from 'vuex'
import Header from '@/components/emr/printable-form/Header.vue';
import Footer from '@/components/emr/printable-form/Footer.vue'

export default{
    props: ['date_admitted', 'patient_info', 'emr_params', 'chief_complaint', 'pex_data', 'selected_icd', 'selected_medicine', 'doctor_data', 'referral_empty_fields'],

    components: {
        Alert,
        Header,
        Footer
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
            referral_rules: [v => !!v && !/^ *$/.test(v)],

            return_slip_margin: '0px',
            alert: {}
        }
    },

    created() {
        if (this.$store.state.usr_credentials.department === 'Doctor' || this.$store.state.usr_credentials.department === 'Midwife') {
            this.referral_date = this.date_admitted
            this.getReferralData();
        } else {
            this.referral_date = this.$moment().format('MM-DD-YYYY')
            this.getSpecializationList();
        }
    },

    computed: {
        ...mapState(['usr_credentials'])  
    },

    methods: {
        async getReferralData() {
            let referral_data = sessionStorage.getItem('65sHXXfg23') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('65sHXXfg23'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true
            }
            
            if (referral_data.fresh_load) {
                this.loading_referral_data = true
                let response = await this.$services.getPatientRecordAndTransaction({
                    request_key: 'referral',
                    transaction_number: this.emr_params.transaction_number
                })

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
                    referral_data = response.data

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

                    sessionStorage.setItem('65sHXXfg23', this.$crypto.AES.encrypt(JSON.stringify(referral_data), 'EMX246'))
                    this.loading_referral_data = false
                    this.getSpecializationList();
                } else {
                    this.alert = response.error
                }
            } else {
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

        printReferralForm() {
            if (this.$refs.referral_form.validate()) {
                // 1430px is the height of <v-form> to fill the whole page
                // 1111px is the height of <v-form> to fill the page with return slip

                if (this.$refs.referral_form.$el.clientHeight > 1000) {
                    const difference = Math.abs(1430 - this.$refs.referral_form.$el.clientHeight)
                    this.return_slip_margin = difference + 'px'
                }

                setTimeout(() => {
                    this.windowPrint();
                }, 500)
            } else {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Empty Fields', body: 'Please complete all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }
        },

        saveAsPDF(){
            var doc = new jsPDF('p', 'mm', 'letter');
            const center = doc.internal.pageSize.getWidth() / 2
            
            if (this.$store.state.prv_config.provider_logo) doc.addImage(this.$store.state.prv_config.provider_logo, 'JPEG', 10, 10, 30, 27);
            if(this.$store.state.usr_credentials.lgu_host_code === 'AT') doc.addImage(require('@/assets/card-logo/ANTIPOLO/logo_3.png'), 170, 10, 30, 27)

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text("REPUBLIC OF THE PHILIPPINES", doc.internal.pageSize.getWidth() / 2, 17, null, null, 'center');
            doc.setFont("helvetica","normal")
            doc.text("PROVINCE OF " + this.$store.state.prv_data.province, doc.internal.pageSize.getWidth() / 2, 23, 'center');
            doc.text("MUNICIPALITY OF " + this.$store.state.prv_data.municipality, doc.internal.pageSize.getWidth() / 2, 29, 'center');

            doc.setFont('helvetica', 'bold')
            doc.text(this.$store.state.prv_data.provider_name, center, 35, 'center')

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('REFERRAL FORM', doc.internal.pageSize.getWidth() / 2, 42, 'center');

            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('Name:', 10, 50);
            doc.setFont('helvetica', 'normal');
            doc.text(this.combineString([this.patient_info.mem_first_name, this.patient_info.mem_middle_name, this.patient_info.mem_last_name]), 21, 50);
            doc.line(21, 51, 84, 51)

            doc.setFont('helvetica', 'bold');
            doc.text('Birthdate:', 85, 50);
            doc.setFont('helvetica', 'normal');
            doc.text(this.formatDate([this.patient_info.mem_birthdate]), 101, 50);
            doc.line(101, 51, 123, 51)

            doc.setFont('helvetica', 'bold');
            doc.text('Age:', 124, 50);
            doc.setFont('helvetica', 'normal');
            doc.text(this.getAge(this.patient_info.mem_birthdate), 132, 50);
            doc.line(132, 51, 159, 51)

            doc.setFont('helvetica', 'bold');
            doc.text('Date:', 160 , 50);
            doc.setFont('helvetica', 'normal');
            doc.text(this.referral_date, 169, 50);
            doc.line(169, 51, 205, 51)

            doc.setFont('helvetica', 'bold');
            doc.text('Gender:', 10 , 60);
            doc.setFont('helvetica', 'normal');
            doc.text(this.patient_info.mem_gender, 23, 60);
            doc.line(23, 61, 44, 61)

            doc.setFont('helvetica', 'bold');
            doc.text('Contact Number:', 45 , 60);
            doc.setFont('helvetica', 'normal');
            doc.text(this.patient_info.mem_mobile_number ? this.patient_info.mem_mobile_number : '', 71, 60);
            doc.line(71, 61, 109, 61)

            doc.setFont('helvetica', 'bold');
            doc.text('Address:', 110 , 60);
            doc.setFont('helvetica', 'normal');
            doc.text(this.combineString([this.patient_info.mem_home_bldgno, this.patient_info.mem_home_bgy, this.patient_info.mem_home_city_municipality, this.patient_info.mem_home_province, this.patient_info.mem_home_zip]), 124, 60, {maxWidth:100})
            doc.line(124, 61, 205, 61)

            doc.setFont('helvetica', 'bold');
            doc.text('Philhealth Number/Details:', 10 , 66);
            doc.setFont('helvetica', 'normal');
            doc.text(this.patient_info.mem_phic_pin ? this.patient_info.mem_phic_pin : '', 52, 66, {maxWidth:100}) 
            doc.line(52, 67, 150, 67)

            doc.line(10, 70, 205, 70)
            doc.setFont('helvetica', 'bold');
            doc.text('Referral Code', 10 , 75);
            doc.text(this.referral_code, 55, 75);

            const getHeight = (val) => {
                if (val > 200) {
                    return Math.trunc(val / 200) * 4 
                } else if (val > 90) {
                    return 2
                } else {
                    return 0
                }
            }

            this.referral_doctor_specialization = this.referral_doctor_specialization ? this.referral_doctor_specialization.trim() : '';
            this.referral_doctor_provider_name = this.referral_doctor_provider_name ? this.referral_doctor_provider_name.trim() : '';
            const referral_doctor_specialization = getHeight(this.referral_doctor_specialization.length)
            const referral_doctor_provider_name = getHeight(this.referral_doctor_provider_name.length)

            doc.setFont('helvetica', 'bold');
            doc.text("Doctor's Specilization", 10 , 84);
            doc.setFont('helvetica', 'normal');
            doc.text(this.referral_doctor_specialization ? this.referral_doctor_specialization : '' , 55, 84 - referral_doctor_specialization, {maxWidth: 145});
            doc.line(55, 85 + referral_doctor_specialization, 205, 85 + referral_doctor_specialization)

            doc.setFont('helvetica', 'bold');
            doc.text("Healthcare Facility", 10 , 95);
            doc.setFont('helvetica', 'normal');
            doc.text(this.referral_doctor_provider_name ? this.referral_doctor_provider_name : '', 55, 95 - referral_doctor_provider_name, {maxWidth: 150});
            doc.line(55, 96 + referral_doctor_provider_name, 205, 96 + referral_doctor_provider_name)

            doc.setFont('helvetica', 'bold');
            doc.text("Doctor's Name", 10 , 105);
            doc.setFont('helvetica', 'normal');
            doc.text(this.referral_doctor_first_name ? this.referral_doctor_first_name : '', 55, 105)
            doc.line(55, 106, 102, 106)
            doc.text(this.referral_doctor_middle_name ? this.referral_doctor_middle_name : '', 105, 105)
            doc.line(105, 106, 152, 106)
            doc.text(this.referral_doctor_last_name ? this.referral_doctor_last_name: '', 155, 105)
            doc.line(155, 106, 205, 106)

            doc.setFont('helvetica', 'bold');
            doc.text("Doctor's Contact Number", 10 , 115);
            doc.setFont('helvetica', 'normal');
            doc.text(this.referral_doctor_contact_number ? '(+63) ' + this.referral_doctor_contact_number : '', 55, 115);
            doc.line(55, 116, 205, 116)

            doc.setFont('helvetica', 'bold');
            doc.text('Reasons for Referral', 10 , 125);
            doc.setFont('helvetica', 'normal');
            doc.text(this.reason_for_referral ? this.reason_for_referral : '', 55, 125);
            doc.line(55, 126, 205, 126)
            
            doc.line(10, 132, 205, 132)
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('Medical Information', 10 , 140);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('Chief Complaint', 10 , 150);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(this.chief_complaint ? this.chief_complaint : '', 15 , 157, {maxWidth: 150});

            //PRESCRIBE MEDICINE
            let base_height = 187
            if(this.selected_icd && this.selected_icd.length > 0 && this.selected_icd[0].icd_code !== '' && this.selected_icd[0].icd_description !== ''){
            doc.setFont("helvetica","bold")
            doc.setFontSize(11);
            doc.text('Diagnosis and Procedures', 10, base_height - 20)
                   
            for(let icd_index = 0; icd_index < this.selected_icd.length; icd_index++) {
                doc.setFont("helvetica","bold")
                doc.setFontSize(9);

                if(icd_index === 0){
                    doc.text('Primary Diagnosis', 15, base_height - 12)
                } else if (icd_index === 1){
                    doc.text('Secondary Diagnosis', 15, base_height + 2)
                    base_height = base_height + 14
                } else {
                    doc.text('Other Diagnosis', 15, base_height + 2)
                    base_height = base_height + 14
                }

                doc.setFont("helvetica","normal")
                doc.text(this.combineString([this.selected_icd[icd_index].icd_code, ' / ', this.selected_icd[icd_index].icd_description]) , 15, base_height - 6)
                    if (base_height > 250) {
                        doc.addPage()
                        base_height = 10
                    } else {
                        base_height = base_height + 5
                    }
                
                if(this.selected_icd[icd_index].procedures.length > 0){
                    for(let cpt_index = 0; cpt_index < this.selected_icd[icd_index].procedures.length; cpt_index++) {
                        if(cpt_index === 0){
                            doc.setFont("helvetica","bold")
                            doc.text('Requested Procedure(s)', 20, base_height - 5)
                        }
                        doc.setFont("helvetica","normal")
                        doc.text(this.combineString([this.selected_icd[icd_index].procedures[cpt_index].cpt_code, ' / ', this.selected_icd[icd_index].procedures[cpt_index].cpt_description]) , 20, base_height)
                            if (base_height > 250) {
                                doc.addPage()
                                base_height = 10
                            } else {
                                base_height = base_height + 5
                            }
                        }
                } else {
                    base_height = base_height - 6
                    }
                }
            } else {
              base_height = 163
            }

            if(this.selected_medicine && this.selected_medicine.length > 0) {
                doc.setFontSize(11);
                doc.setFont("helvetica","bold")
                doc.text('Prescribed Medicine', 10, base_height + 3)
                base_height = base_height + 10

                doc.setFontSize(9);
                doc.setFont("helvetica","bold")
                doc.text("Generic Name", 17, base_height);
                doc.text("Brand", 55, base_height, 'center');
                doc.text("Dosage/Preparation", 86, base_height, 'center');
                doc.text("Frequency", 116, base_height,'center');
                doc.text(137, base_height, doc.splitTextToSize("Duration", 25),'center');
                doc.text(164, base_height, doc.splitTextToSize("Total # of Medicine", 30), 'center');
                doc.text("Remarks", 194, base_height,'center'); 

                doc.setFont("helvetica","normal")
                base_height = base_height + 12
                doc.setFontSize(8);
    
                    for (let med_ctr = 0; med_ctr < this.selected_medicine.length; med_ctr++) {
                        let medicine = this.selected_medicine[med_ctr];

                        if (medicine !== null) {
                            let generic_name = doc.splitTextToSize(this.selected_medicine[med_ctr].generic_name, 30)
                        let generic_height = base_height

                            if (generic_name.length > 0) {
                                if (doc.getTextDimensions(generic_name).h <= 2.469444444444444) {
                                    generic_height;
                                } else if (
                                    doc.getTextDimensions(generic_name).h > 2.469444444444444 &&
                                    doc.getTextDimensions(generic_name).h <= 5.309305555555555
                                ) {
                                    generic_height = generic_height - 4;
                                } else {
                                    generic_height = generic_height - 5;
                                }

                                doc.text(26, generic_height, generic_name, 'center');
                            }

                            base_height = base_height - 4;

                            // let brand_name = medicine.brand_name ? medicine.brand_name.trim() : '';
                            // if (brand_name.length > 0) {
                            //     if (brand_name.length > 15) {
                            //         doc.text(brand_name, 58, base_height - 2, { maxWidth: 24, align: 'center' });
                            //     } else if (brand_name.length === 0) {
                            //         doc.text('None', 55, base_height, 'center');
                            //     } else {
                            //         doc.text(brand_name, 92, base_height, 'center');
                            //     }
                            // }

                            let dosage_name = medicine.dosage ? medicine.dosage.trim() : '';
                            let preparation = medicine.dosage ? medicine.dosage.trim() : '';

                            if ((dosage_name + preparation).length > 0) {
                                if ((dosage_name + preparation).length < 20) {
                                    doc.text(dosage_name + '/' + preparation, 86, base_height, 'center');
                                } else {
                                    doc.text(dosage_name + '/' + preparation, 86, base_height - 1, {maxWidth: 38, align: 'center'});
                                }
                            }

                            doc.text(medicine.frequency_of_med ? medicine.frequency_of_med : '', 115, base_height, 'center');
                            doc.text(medicine.duration ? medicine.duration : '', 137, base_height, 'center');
                            doc.text(medicine.total_num_of_med ? '# ' + medicine.total_num_of_med : '', 164, base_height, 'center');

                            let notes = medicine.notes ? doc.splitTextToSize(medicine.notes, 30) : '';
                            let notes_height = base_height + 4;
                            if (notes.length > 0) {
                                if (doc.getTextDimensions(notes).h <= 2.469444444444444) {
                                    notes_height;
                                } else if (
                                    doc.getTextDimensions(notes).h > 2.469444444444444 &&
                                    doc.getTextDimensions(notes).h <= 5.309305555555555
                                ) {
                                    notes_height = notes_height - 3;
                                } else {
                                    notes_height = notes_height - 5;
                                }

                                doc.text(194, notes_height - 1, notes, 'center');
                            }

                            if (base_height > 250) {
                                doc.addPage();
                                base_height = 20;
                            } else {
                                base_height = base_height + 14;
                            }
                        } else {
                            base_height = base_height + 14;
                        }
                    }
                } else{
                    base_height = base_height + 8
                }

            if (base_height > 250) {
                doc.addPage()
                base_height = 10
            } else {
                base_height = base_height - 6
            }

            doc.line(10, base_height, 205, base_height)
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('Physical Examination', 10 , base_height + 7);

            if (base_height > 250) {
                doc.addPage()
                base_height = 10
            } else {
                base_height = base_height + 17
            }

            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('BP:', 10 , base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.pex_data.bp_systolic ? this.pex_data.bp_systolic + '/' + this.pex_data.bp_diastolic : '' , 17, base_height)
            doc.line(17, base_height + 1, 57, base_height + 1)

            doc.setFont('helvetica', 'bold');
            doc.text('BP 2nd Reading:', 57, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.pex_data.bp_2nd_systolic ? this.pex_data.bp_2nd_systolic + '/' + this.pex_data.bp_2nd_diastolic : '', 84, base_height)
            doc.line(84, base_height + 1, 103, base_height + 1)

            doc.setFont('helvetica', 'bold');
            doc.text('HR:', 104 , base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.pex_data.heart_rate ? this.pex_data.heart_rate : '', 111, base_height);
            doc.line(111, base_height + 1, 150, base_height + 1)

            doc.setFont('helvetica', 'bold');
            doc.text('RR:', 151 , base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.pex_data.respiration_rate ? this.pex_data.respiration_rate : '', 158, base_height);
            doc.line(158, base_height + 1, 205, base_height + 1)

            if (base_height > 250) {
                doc.addPage()
                base_height = 10
            } else {
                base_height = base_height + 10
            }

            doc.setFont('helvetica', 'bold');
            doc.text('Temp:', 10, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.pex_data.temp ? this.pex_data.temp : '', 21, base_height);
            doc.line(21, base_height + 1, 57, base_height + 1)

            doc.setFont('helvetica', 'bold');
            doc.text('02Sat:', 57, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.pex_data.o2sat ? this.pex_data.o2sat : '', 68, base_height);
            doc.line(68, base_height + 1, 103, base_height + 1)

            doc.setFont('helvetica', 'bold');
            doc.text('HT:', 104, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.pex_data.height === 'Decryption Failed' ? '' : this.pex_data.height + ' (cm)', 111, base_height);
            doc.line(111, base_height + 1, 150, base_height + 1)

            doc.setFont('helvetica', 'bold');
            doc.text('WT:', 151, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.pex_data.weight === 'Decryption Failed' ? '' : this.pex_data.weight + ' (kg)', 158, base_height);
            doc.line(158, base_height + 1, 205, base_height + 1)

            if (base_height > 250) {
                doc.addPage()
                base_height = 10
            } else {
                base_height = base_height + 10
            }

            doc.setFont('helvetica', 'bold');
            doc.text('BMI:', 10, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(String(this.pex_data.bmi_computation.bmi ? this.pex_data.bmi_computation.bmi : ''), 18.5, base_height);
            doc.line(18.5, base_height + 1, 57, base_height + 1)

            doc.setFont('helvetica', 'bold');
            doc.text('Remarks:', 57, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.pex_data.bmi_computation.remarks  === 'Decryption Failed' ? '' : this.pex_data.bmi_computation.remarks, 73, base_height);
            doc.line(73, base_height + 1, 103, base_height + 1)

            doc.setFont('helvetica', 'bold');
            doc.text('Central Adiposity:', 104, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.pex_data.central_adiposity === '1' ? 'Yes' : 'No' , 133, base_height);
            doc.line(133, base_height + 1, 150, base_height + 1)

            doc.setFont('helvetica', 'bold');
            doc.text('Waist Circumference:', 151, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.pex_data.waist_circumference ? this.pex_data.waist_circumference + ' (cm)': '', 185, base_height);
            doc.line(185, base_height + 1, 205, base_height + 1)

            if (base_height > 250) {
                doc.addPage()
                base_height = 10
            } else {
                base_height = base_height + 10
            }

            doc.setFont('helvetica', 'bold');
            doc.text('Left Vision:', 10, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(String(this.pex_data.left_vision ? this.pex_data.left_vision : ''), 29, base_height);
            doc.line(29, base_height + 1, 57, base_height + 1)

            doc.setFont('helvetica', 'bold');
            doc.text('Right Vision:', 57, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(String(this.pex_data.right_vision ? this.pex_data.right_vision : ''), 78, base_height);
            doc.line(103, base_height + 1, 78, base_height + 1)

            if (base_height > 250) {
                doc.addPage()
                base_height = 10
            } else {
                base_height = base_height + 10
            }
            
            doc.line(10, base_height , 205, base_height)
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('Referring Doctor Information', 10 , base_height + 7);

            base_height = base_height + 17
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('Name:', 10, base_height);
            doc.setFont('helvetica', 'normal');

            try{
                doc.text(this.combineString([this.doctor_data.first_name, this.doctor_data.middle_name, this.doctor_data.last_name]), 21, base_height)
            } catch {
                doc.text('N/A', 21, base_height)
            }
                
            doc.line(21, base_height + 1, 109, base_height + 1)
            doc.setFont('helvetica', 'bold');
            doc.text('Contact Number:', 110, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.referring_doctor_contact_no ? '(+63) ' + this.referring_doctor_contact_no : 'N/A', 137, base_height);
            doc.line(137, base_height + 1, 205, base_height + 1)

            if (base_height > 250) {
                doc.addPage()
                base_height = 10
            } else {
                base_height = base_height + 10
            }

            doc.setFont('helvetica', 'bold');
            doc.text('Healthcare Facility:', 10, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text('EUREKARE MEDICAL CENTER', 41, base_height);
            doc.line(41, base_height + 1, 205, base_height + 1)

            if (base_height > 250) {
                doc.addPage()
                base_height = 10
            } else {
                base_height = base_height + 7
            }

            doc.line(10, base_height, 205, base_height)
            
            if (base_height > 245){
                doc.addPage()
                base_height = 10
            } else {
                base_height = base_height + 5
            }
        
            doc.setFont('helvetica', 'normal');
            doc.text('Note: Please retain upper half at receiving institution', 10, base_height );
            doc.setLineDash([2, 1], 0);
            doc.line(10, base_height + 5, 205, base_height + 5)
            doc.setLineDash();
    
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('Return Slip', 10 , base_height + 13);

            if (base_height > 250) {
                doc.addPage()
                base_height = 10
            } else {
                base_height = base_height + 22
            }

            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('Name:', 10, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.combineString([this.patient_info.mem_first_name, this.patient_info.mem_middle_name, this.patient_info.mem_last_name]), 21, base_height)
            doc.line(21, base_height + 1, 129, base_height + 1)
           
            doc.setFont('helvetica', 'bold');
            doc.text('Date:', 130, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text('', 139, base_height);
            doc.line(139, base_height + 1, 205, base_height + 1)

            base_height = base_height + 10
            doc.setFont('helvetica', 'bold');
            doc.text('Address:', 10, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.combineString([this.patient_info.mem_home_bldgno, this.patient_info.mem_home_bgy, this.patient_info.mem_home_city_municipality, this.patient_info.mem_home_province, this.patient_info.mem_home_zip]), 25, base_height)
            doc.line(25, base_height + 1, 129, base_height + 1)

            doc.setFont('helvetica', 'bold');
            doc.text('Birthdate:', 130, base_height);
            doc.setFont('helvetica', 'normal');
            doc.text(this.formatDate([this.patient_info.mem_birthdate]), 146, base_height)
            doc.line(146, base_height + 1, 205, base_height + 1)

            doc.setFont('helvetica', 'bold');
            doc.text('Philhealth Number/Details:', 10 , base_height + 8);
            doc.setFont('helvetica', 'normal');
            doc.text(this.patient_info.mem_phic_pin ? this.patient_info.mem_phic_pin : '', 52, 66, {maxWidth:100}) 
            doc.line(54, base_height + 8, 150, base_height + 8)
            
            base_height = base_height + 14
            doc.line(10, base_height, 205, base_height)
            doc.setFont('helvetica', 'bold');
          
            base_height = base_height + 8
            doc.text('Impression/Diagnosis:', 10, base_height);
            doc.setFont('helvetica', 'bold');
            doc.text('Action Taken:', 110, base_height);
    
            doc.setFont('helvetica', 'bold');
            doc.text('Recommendation/Instructions:', 10, base_height + 10);
            doc.setFont('helvetica', 'bold');
            doc.text('Disposition:', 10, base_height + 20);

            doc.setFont('helvetica', 'bold');
            doc.text('Received/Managed by: (Signature, Name, Designation):', 10, base_height + 30);
            doc.line(10, base_height + 37, 205, base_height + 37)

            doc.save(this.combineString([this.patient_info.mem_first_name, this.patient_info.mem_middle_name, this.patient_info.mem_last_name]) + ' Referral Form ' + this.dateToday('MM-DD-YYYY') +'.pdf')
        },

        windowPrint() {
            window.scrollTo(0, 0);
            window.print();
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
                sessionStorage.setItem('65sHXXfg23', this.$crypto.AES.encrypt(JSON.stringify(referral_data), 'EMX246'))
            }

            this.$emit('display_doctor_referral')
        },

        numberOnly(event) {
            if ((event.which < 48 || event.which > 57) && event.which !== 45) {
                event.preventDefault();
            }
        }
    }
}
</script>

<style scoped>
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
.padding--top{ padding-top: 5px; }
.input--margin{ margin-top: 10px; }
.input--border{
    border-bottom: 1px solid grey;
    margin: 18px 0 0 8px;
    width: 100%;
}
.contact-prefix{ padding-top: 7px; }
.medicine--table{ overflow-x: auto; }
.medicine--header{
    min-width: 1410px;
    text-align: center;
}
.medicine--header h4{
    font-size: 14px;
    margin: 0 4px;
    width: 205px;
}
.medicine--body{
    font-size: 14px;
    margin: 0 4px;
    padding: 8px 0 4px 0;
    width: 205px;
    text-align: center;
}
.return-slip{
    border-top: 1px solid rgb(218, 218, 218);
    margin-top: 25px;
    opacity: 0.6;
}
.return-slip h4{ border-bottom: 2px dashed black; }

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
    #for-print-relative{ padding: 30px !important; }
    .divider{ margin: 15px 0 11px 0; }
    .padding--top{ padding-top: 2px; }
    .input--margin{ margin-top: 2px; }
    .input--border{ margin: 2px 0 0 8px; }
    .referral-code{ margin-left: 8px; }
    .medicine--table{ overflow-x: hidden; }   
    .medicine--header h4{
        font-size: 12px;
        max-width: 116px;
        min-width: 116px;
    }
    .medicine--body{
        font-size: 12px;
        max-width: 116px;
        min-width: 116px;
        padding: 2px 0;
    }
    .return-slip{
        margin-top: 10px;
        opacity: 1;
    }
}
</style>