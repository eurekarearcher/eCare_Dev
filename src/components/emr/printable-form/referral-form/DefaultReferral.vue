<template>
    <v-dialog :value="display_doctor_referral" width="1500" persistent>
        <div id="for-print-absolute">
            <v-card  id="for-print-relative" class="elavation-0 px-8 pt-8 pb-3" flat>
                <div v-if="loading_referral_data" class="text-center">
                    <div class="my-16">
                        <v-progress-circular color="primary" size="100" indeterminate></v-progress-circular>
                        <h4 class="light-blue--text text--darken-4 mt-10 pl-5">Loading... Please wait...</h4>
                    </div>
                </div>
                <div v-else id="print-default-referral"> 
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
                                <v-combobox :value="referral_doctor_specialization" @input="$emit('update:referral_doctor_specialization', $event)" :items="specialization_items" :loading="loading_specialization" :rules="emr_params.editable ? referral_rules : []" @change="$emit('mutationStatus','referral')" class="d-print-none body-2" hide-details hide-no-data dense></v-combobox>
                                <span class="d-print-block d-none input--border body-2">{{ referral_doctor_specialization }}</span>
                            </v-col>
                        </v-row>

                        <v-row class="input--margin pr-1" align="baseline" dense>
                            <v-col cols="12" sm="3" md="2" xl="2">
                                <label class="font-weight-medium body-2">Healthcare Facility</label>
                            </v-col>
                            <v-col cols="12" sm="" md="" xl="">
                                <!-- <v-combobox :value="referral_doctor_provider_name" @input="$emit('update:referral_doctor_provider_name', $event)" :items="provider_items" :loading="loading_provider" @change="$emit('selectProvider')" class="d-print-none body-2" item-text="name" hide-details hide-no-data dense></v-combobox> -->
                                <v-combobox :value="referral_doctor_provider_name" @input="$emit('update:referral_doctor_provider_name', $event)" :items="provider_items.map(p => p.name)" :loading="loading_provider" class="d-print-none body-2" hide-details hide-no-data dense></v-combobox>
                                <span class="d-print-block d-none input--border body-2">{{ referral_doctor_provider_name }}<span class="white--text">.</span></span>
                            </v-col>
                        </v-row>

                        <v-row class="input--margin pr-1" align="baseline" dense>
                            <v-col cols="12" sm="3" md="2" xl="2">
                                <label class="font-weight-medium body-2">Doctor's Name</label>
                            </v-col>
                            <v-col cols="12" sm="" md="" xl="">
                                <v-text-field :value="referral_doctor_first_name" @input="$emit('update:referral_doctor_first_name', $event)" @blur="$emit('mutationStatus','referral')" class="d-print-none body-2" label="First" hide-details dense></v-text-field>
                                <span class="d-print-block d-none input--border body-2">{{ referral_doctor_first_name }}<span class="white--text">.</span></span>
                            </v-col>
                            <v-col cols="12" sm="" md="" xl="">
                                <v-text-field :value="referral_doctor_middle_name" @input="$emit('update:referral_doctor_middle_name', $event)" @blur="$emit('mutationStatus','referral')" class="d-print-none body-2" label="Middle" hide-details dense></v-text-field>
                                <span class="d-print-block d-none input--border body-2">{{ referral_doctor_middle_name }}<span class="white--text">.</span></span>
                            </v-col>
                            <v-col cols="12" sm="" md="" xl="">
                                <v-text-field :value="referral_doctor_last_name" @input="$emit('update:referral_doctor_last_name', $event)" @blur="$emit('mutationStatus','referral')" class="d-print-none body-2" label="Last" hide-details dense></v-text-field>
                                <span class="d-print-block d-none input--border body-2">{{ referral_doctor_last_name }}<span class="white--text">.</span></span>
                            </v-col>
                        </v-row>

                        <v-row class="input--margin pr-1" align="baseline" dense>
                            <v-col cols="12" sm="3" md="2" xl="2">
                                <label class="body-2 font-weight-medium">Doctor's Contact Number</label>
                            </v-col>
                            <v-col cols="12" sm="" md="" xl="">
                                <v-text-field :value="referral_doctor_contact_number" v-on:keypress="numberOnly" @input="$emit('update:referral_doctor_contact_number', $event)" @blur="$emit('mutationStatus','referral')" class="d-print-none body-2" maxlength="10" onpaste="return false" hide-details dense>
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
                                <v-text-field :value="reason_for_referral" @input="$emit('update:reason_for_referral', $event)" :rules="emr_params.editable ? referral_rules : []" @blur="$emit('mutationStatus','referral')" class="d-print-none body-2" hide-details dense></v-text-field>
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
                                <span v-if="pex_data.o2sat" class="input--border body-2">{{ pex_data.oxygen_saturation }}</span>
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
                                <span v-if="pex_data.central_adiposity" class="input--border body-2">{{ pex_data.central_adiposity === '1' ? 'YES' : 'NO' }}</span>
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

                        <v-row v-if="$store.state.usr_credentials.department === 'Doctor' || $store.state.usr_credentials.department === 'Midwife' || $store.state.usr_credentials.department === 'Medical Practitioner'" class="input--margin" dense>
                            <v-col class="align-baseline d-flex" cols="12" sm="7" xl="7">
                                <label class="font-weight-medium body-2 pr-2">Name:</label>
                                <v-text-field :value="doctor_data.first_name + (doctor_data.middle_name ? ' ' + doctor_data.middle_name + ' ' : ' ') + doctor_data.last_name" class="d-print-none body-2" hide-details readonly dense></v-text-field>
                                <span class="d-print-block d-none input--border body-2">{{ doctor_data.first_name + (doctor_data.middle_name ? ' ' + doctor_data.middle_name + ' ' : ' ') + doctor_data.last_name }}</span>
                            </v-col>

                            <v-col class="align-baseline d-flex" cols="12" sm="5" xl="5">
                                <label class="font-weight-medium text-no-wrap body-2 pr-2">Contact Number:</label>
                                <v-text-field v-model="ref_contact_number" v-on:keypress="numberOnly" @blur="$emit('mutationStatus','referral')" class="d-print-none body-2" maxlength="10" onpaste="return false" hide-details dense>
                                    <template v-slot:prepend-inner>
                                        <span class="contact-prefix">(+63)</span>
                                    </template>
                                </v-text-field>
                                <span class="d-print-block d-none input--border body-2">{{ ref_contact_number }}</span>
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
                                    <v-btn @click="$emit('closeDoctorReferral')" class="my-2">
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
                                    <v-btn @click="$emit('closeDoctorReferral')" class="my-2">
                                        CLOSE   
                                        <v-icon size="20" right>mdi-close</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <Footer v-else :loading="loading_specialization" @saveAsPDF="saveAsPDF" @print="printReferralForm" @close="$emit('closeDoctorReferral')" :emr_params="emr_params"/>
                        </template>
                    </div>
                </div>
            </v-card>  
        </div>
        <Alert :alert="alert" />
    </v-dialog>
</template>

<script>
import Alert from '@/components/Alert.vue'
import Header from '@/components/emr/printable-form/Header.vue';
import Footer from '@/components/emr/printable-form/Footer.vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {

    props: ['date_admitted', 'patient_info', 'emr_params', 'chief_complaint', 'pex_data', 'selected_icd', 'selected_medicine', 'doctor_data', 
    'referral_empty_fields', 'referral_date', 'loading_provider', 'provider_items', 'loading_specialization','specialization_items', 'loading_referral_data', 
    'referral_code', 'referral_doctor_provider_name', 'referral_doctor_provider_tin', 'referral_doctor_provider_code', 'referral_doctor_tin', 'referral_doctor_code',
    'referral_doctor_first_name', 'referral_doctor_middle_name', 'referral_doctor_last_name', 'referral_doctor_contact_number', 'referral_doctor_specialization', 'reason_for_referral'
    ,'referring_doctor_contact_no', 'return_slip_margin', 'eligible_data', 'display_doctor_referral'],

    components: {
        Alert,
        Header,
        Footer
    },

    data() {
        return{
            alert: {},
            referral_rules: [v => !!v && !/^ *$/.test(v)],
            ref_doc_name: this.referral_doctor_provider_name,
            ref_contact_number: this.referring_doctor_contact_no,

            doc_first_name: this.referral_doctor_first_name,
            doc_middle_name: this.referral_doctor_middle_name,
            doc_last_name: this.referral_doctor_last_name,
            doc_specialization: this.referral_doctor_specialization,
            doc_contact_number: this.referral_doctor_contact_number,
            reason_referral: this.reason_for_referral,
            return_slip: this.return_slip_margin
        }   
    },

    methods: {
        printReferralForm() {
            if (this.$refs.referral_form.validate()) {
                // 1430px is the height of <v-form> to fill the whole page
                // 1111px is the height of <v-form> to fill the page with return slip

                if (this.$refs.referral_form.$el.clientHeight > 1000) {
                    const difference = Math.abs(1430 - this.$refs.referral_form.$el.clientHeight)
                    this.return_slip = difference + 'px'
                }

                setTimeout(() => {
                    this.windowPrint()
                }, 500)
            } else {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Empty Fields', body: 'Please complete all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }
        },

        windowPrint() {
            window.scrollTo(0, 0);
            window.print();
        },

        saveAsPDF() {
            let { mem_first_name, mem_middle_name, mem_last_name } = this.patient_info

            if (this.patient_info) {
                html2canvas(document.getElementById('print-default-referral')).then(function(canvas) {
                    let margin = 12.7; 
                    let img_data = canvas.toDataURL('image/png');
                    let page_width = 216;
                    let page_height = 356;
                    let img_width = page_width - 2 * margin; 
                    let img_height = canvas.height * img_width / canvas.width; 
                    let doc = new jsPDF('p', 'mm', 'legal');
                    let height_left = img_height;
                    let position = margin; 

                    doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
                    height_left -= page_height;
                    while (height_left > 0) {
                        position = height_left - img_height + margin;
                        doc.addPage();
                        doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
                        height_left -= page_height;
                    }
                    doc.save(`${mem_first_name} ${mem_middle_name ? mem_middle_name : ''} ${mem_last_name} Referral Form.pdf`);
                });
            }
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
