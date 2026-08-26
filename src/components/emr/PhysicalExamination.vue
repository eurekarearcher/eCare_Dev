<template>
    <v-card class=" elevation-0 mt-4">
        <div v-if="$route.params.page !== 'physician-diagnosis-and-treatment-plan'">
            <h3 class="mb-5 grey--text text--darken-4">Physical Examination 
                <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Eksaminasyong pangpisikal)</span></h3>
            <v-card class="pa-8">
                <v-row class="mt-2 mb-2 my-2" dense>
                    <v-col cols="12" sm="6" md="6" lg="6" xl="4">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top >
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Blood Pressure <span v-if="patient_astk_fields" class="red--text">*</span></span>
                                    </template>
                                    <span class="font-weight-medium">Unang presyon ng dugo</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Blood Pressure <span v-if="patient_astk_fields" class="red--text">*</span> </span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="bp_systolic" v-on:keypress="numberOnly"  :disabled="from_migration" @blur="emitData()" @input="validatePEFields('bp_systolic', $event)" :error="bp_empty_fields && !bp_systolic" :error-messages="pe_validation.bp_systolic.err_msg" class="body-2" maxlength="3" dense style="width: 60px" />
                                <span class="mx-1 font-weight-medium grey--text text--darken-4 pt-1 body-2">/</span>
                                <v-text-field v-model="bp_diastolic" v-on:keypress="numberOnly"  :disabled="from_migration" @blur="emitData()" @input="validatePEFields('bp_diastolic', $event)" :error="bp_empty_fields && !bp_diastolic" :error-messages="pe_validation.bp_diastolic.err_msg" class="body-2" maxlength="3" dense style="width: 60px"/>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6" xl="4">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top >
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Blood Pressure 2nd Reading</span>
                                    </template>
                                    <span class="font-weight-medium">Ikalawang pagbasa ng presyon ng dugo</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Blood Pressure 2nd Reading </span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="bp_2nd_systolic" v-on:keypress="numberOnly"  :disabled="from_migration" @blur="emitData()" @input="validatePEFields('bp_2nd_systolic', $event)"  :error="bp_2nd_empty_fields && !bp_2nd_systolic" :error-messages="pe_validation.bp_2nd_systolic.err_msg" class="body-2" maxlength="3" dense></v-text-field>
                                <span class="mx-1 font-weight-medium grey--text text--darken-4 pt-1 body-2">/</span>
                                <v-text-field v-model="bp_2nd_diastolic" v-on:keypress="numberOnly"  :disabled="from_migration" @blur="emitData()" @input="validatePEFields('bp_2nd_diastolic', $event)"  :error="bp_2nd_empty_fields && !bp_2nd_diastolic" :error-messages="pe_validation.bp_2nd_diastolic.err_msg" class="body-2" maxlength="3" dense></v-text-field>   
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="3" xl="4">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Heart Rate <span v-if="patient_astk_fields" class="red--text">*</span></span>
                                    </template>
                                    <span class="font-weight-medium">Bilis ng tibok ng puso</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Heart Rate <span v-if="patient_astk_fields" class="red--text">*</span></span>
                            </div>
                            <v-text-field v-model="heart_rate" :disabled="from_migration" @blur="emitData()" @input="validatePEFields('heart_rate', $event)" :error="hr_rr_temp_empty && !heart_rate" :error-messages="pe_validation.heart_rate.err_msg" maxlength="4" class="body-2" dense/>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="3" xl="4">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Respiration Rate <span v-if="patient_astk_fields" class="red--text">*</span></span>
                                    </template>
                                    <span class="font-weight-medium">Bilis ng paghinga</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Respiration Rate <span v-if="patient_astk_fields" class="red--text">*</span></span>
                            </div>
                            <v-text-field v-model="respiration_rate" :disabled="from_migration" @blur="emitData()" @input="validatePEFields('respiration_rate', $event)" :error="hr_rr_temp_empty && !respiration_rate" :error-messages="pe_validation.respiration_rate.err_msg" maxlength="5" class="body-2" dense></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="3" xl="4">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Temperature <span v-if="patient_astk_fields" class="red--text">*</span></span>
                                    </template>
                                    <span class="font-weight-medium">Temperatura</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Temperature <span v-if="patient_astk_fields" class="red--text">*</span></span>
                            </div>
                            <v-text-field v-model="temp" @blur="emitData()" :disabled="from_migration" @input="validatePEFields('temp', $event)" :error="hr_rr_temp_empty && !temp" :error-messages="pe_validation.temp.err_msg" maxlength="4" class="body-2" dense></v-text-field>
                        </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="6" lg="3" xl="4">
                        <div class="d-flex flex-column mt-1">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1 body-2">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">Oxygen Saturation</span>
                                    </template>
                                    <span class="font-weight-medium">Hangin sa dugo</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">Oxygen Saturation </span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="o2sat" :disabled="from_migration" @blur="emitData()" @input="validatePEFields('o2sat', $event)" v-on:keypress="numberOnly" :error-messages="pe_validation.o2sat.err_msg" maxlength="3" class="body-2" dense style="width: 100px" />
                                <span class="ml-1 grey--text text--darken-1 body-2">%</span>
                            </div>
                        </div>
                    </v-col>
                </v-row>

                <v-row class="my-2" dense>
                    <v-col cols="12" sm="6" md="6" lg="3" xl="3">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1 body-2">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">{{ patient_age > 5 ? 'Height' : 'Length' }} <span v-if="patient_astk_fields" class="red--text">*</span></span>
                                    </template>
                                    <span class="font-weight-medium">Tangkad</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">{{ patient_age > 5 ? 'Height' : 'Length' }} <span v-if="patient_astk_fields" class="red--text">*</span></span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="height" :disabled="from_migration" @input="validatePEFields('height', $event)" :error="pex_empty_fields && !height" @keypress="numberOnlyWithDeci($event, height)" @blur="computeBMI" :error-messages="pe_validation.height.err_msg" maxlength="4" class="body-2" onpaste="return false" dense />
                                <span class="ml-1 grey--text text--darken-1 body-2">CM</span>
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="6" lg="3" xl="3">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1 body-2">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">Weight <span v-if="patient_astk_fields" class="red--text">*</span></span>
                                    </template>
                                    <span class="font-weight-medium">Timbang</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">Weight <span v-if="patient_astk_fields" class="red--text">*</span></span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="weight" :disabled="from_migration" @input="validatePEFields('weight', $event)" :error="pex_empty_fields && !weight" @keypress="numberOnlyWithDeci($event, weight)" @blur="computeBMI" :error-messages="pe_validation.weight.err_msg" maxlength="4" class="body-2" onpaste="return false" dense/>
                                <span class="ml-1 grey--text text--darken-1 body-2">KG</span>
                            </div>
                        </div>
                    </v-col>

                    <!-- <template v-if="patient_age <= 2"> 
                        <v-col cols="12" sm="4" md="4" lg="2">
                            <label class="font-weight-medium body-2 d-block">Weight for Age</label>
                            <label class="body-2 d-block">{{ weight_for_age }}</label>
                        </v-col>
                        
                        <v-col cols="12" sm="4" md="4" lg="2">
                            <label class="font-weight-medium body-2 d-block">Height for Age</label>
                            <label class="body-2 d-block">{{ height_for_age }}</label>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="2">
                            <label class="font-weight-medium body-2 d-block">Weight for {{ patient_age > 2 ? 'Height' : 'Length' }}</label>
                            <label class="body-2 d-block">{{ weight_for_height }}</label>
                        </v-col>
                    </template> -->

                    <template v-if="patient_age <= 2"> 
                        <v-col cols="12" sm="4" md="4" lg="2">
                            <!-- <label class="font-weight-medium body-2 d-block">Weight for Age</label>
                            <label class="body-2 d-block">{{ weight_for_age }}</label> -->
                            <div class="d-flex flex-column">
                                <span class="font-weight-medium grey--text text--darken-4 mb-1 body-2">Weight for Age</span>
                                <v-text-field :value="weight_for_age" readonly dense class="body-2"/>
                            </div>
                        </v-col>
                        
                        <v-col cols="12" sm="4" md="4" lg="2">
                            <!-- <label class="font-weight-medium body-2 d-block">Height for Age</label>
                            <label class="body-2 d-block">{{ height_for_age }}</label> -->
                            <div class="d-flex flex-column">
                                <span class="font-weight-medium grey--text text--darken-4 mb-1 body-2">Height for Age</span>
                                <v-text-field :value="height_for_age" readonly dense class="body-2"/>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="2">
                            <!-- <label class="font-weight-medium body-2 d-block">Weight for {{ patient_age > 2 ? 'Height' : 'Length' }}</label>
                            <label class="body-2 d-block">{{ weight_for_height }}</label> -->
                            <div class="d-flex flex-column">
                                <span class="font-weight-medium grey--text text--darken-4 mb-1 body-2">Weight for {{ patient_age > 2 ? 'Height' : 'Length' }}</span>
                                <v-text-field :value="weight_for_height" readonly dense class="body-2"/>
                            </div>
                        </v-col>
                    </template>

                    <!-- <template v-else> 
                        <v-col cols="12" sm="6" md="6" lg="3">
                            <label class="font-weight-medium body-2">BMI: <span class="font-weight-medium pl-1">{{ bmi_computation.bmi }}</span></label>
                        </v-col>

                        <v-col cols="12" sm="6" md="6" lg="3">
                            <label class="font-weight-medium body-2">Remarks: <span class="font-weight-medium pl-1">{{ bmi_computation.remarks }}</span></label>
                        </v-col>
                    </template> -->
                    
                    <template v-else> 
                        <v-col cols="12" sm="6" md="6" lg="3">
                            <div class="d-flex flex-column">
                                <span class="font-weight-medium grey--text text--darken-4 mb-1 body-2">BMI</span>
                                <v-text-field :value="bmi_computation.bmi" readonly dense class="body-2"/>
                                <!-- <label class="font-weight-medium body-2">BMI: <span class="font-weight-medium pl-1">{{ bmi_computation.bmi }}</span></label> -->
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6" md="6" lg="3">
                            <div class="d-flex flex-column">
                                <span class="font-weight-medium grey--text text--darken-4 mb-1 body-2">Remarks</span>
                                <v-text-field :value="bmi_computation.remarks" readonly dense class="body-2"/>
                                <!-- <label class="font-weight-medium body-2">Remarks: <span class="font-weight-medium pl-1">{{ bmi_computation.remarks }}</span></label> -->
                            </div>
                        </v-col>
                    </template>
                </v-row>

                <v-row v-if="patient_age <= 2" class="my-2" dense>
                    <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="mt-4">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1 body-2">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">Head Circle <span v-if="patient_astk_fields" class="red--text">*</span></span>
                                    </template>
                                    <span class="font-weight-medium">Sukat ng ulo</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">Head Circle <span v-if="patient_astk_fields" class="red--text">*</span></span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="head_circle" :disabled="from_migration" @input="validatePEFields('head_circle', $event)" @blur="emitData()" :error="pex_empty_fields && !head_circle" :error-messages="pe_validation.head_circle.err_msg" maxlength="4" class="body-2" onpaste="return false" dense/>
                                <span class="ml-1 grey--text text--darken-1 body-2">CM</span>
                            </div>
                        </div>
                    </v-col>
                
                    <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="mt-4">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1 body-2">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">Skin for thickness <span v-if="patient_astk_fields" class="red--text">*</span></span>
                                    </template>
                                    <span class="font-weight-medium">Sukat ng kapal ng balat</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">Skin for thickness <span v-if="patient_astk_fields" class="red--text">*</span></span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="skin_for_thickness" :disabled="from_migration" @input="validatePEFields('skin_for_thickness', $event)" @blur="emitData()" :error="pex_empty_fields && !skin_for_thickness" :error-messages="pe_validation.skin_for_thickness.err_msg" maxlength="4" class="body-2" onpaste="return false" dense/>
                                <span class="ml-1 grey--text text--darken-1 body-2">CM</span>
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="mt-4">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1 body-2">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">Hip <span v-if="patient_astk_fields" class="red--text">*</span></span>
                                    </template>
                                    <span class="font-weight-medium">Sukat ng balakang</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">Hip <span v-if="patient_astk_fields" class="red--text">*</span></span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="hip" :disabled="from_migration" @input="validatePEFields('hip', $event)" @blur="emitData()" :error="pex_empty_fields && !hip" :error-messages="pe_validation.hip.err_msg" maxlength="4" class="body-2" onpaste="return false" dense/>
                                <span class="ml-1 grey--text text--darken-1 body-2">CM</span>
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="mt-4">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1 body-2">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">Limbs <span v-if="patient_astk_fields" class="red--text">*</span></span>
                                    </template>
                                    <span class="font-weight-medium">Sukat ng biyas</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">Limbs <span v-if="patient_astk_fields" class="red--text">*</span></span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="limbs" :disabled="from_migration" @input="validatePEFields('limbs', $event)" @blur="emitData()" :error="pex_empty_fields && !limbs" :error-messages="pe_validation.limbs.err_msg" maxlength="4" class="body-2" onpaste="return false" dense/>
                                <span class="ml-1 grey--text text--darken-1 body-2">CM</span>
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" lg="6" xl="4" class="mt-4">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1 body-2">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">Mid upper arm circle <span v-if="patient_astk_fields" class="red--text">*</span></span>
                                    </template>
                                    <span class="font-weight-medium">Sukat ng Braso</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">Mid upper arm circle <span v-if="patient_astk_fields" class="red--text">*</span></span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="mid_upper_arm_circle" :disabled="from_migration" @input="validatePEFields('mid_upper_arm_circle', $event)" @blur="emitData()" :error="pex_empty_fields && !mid_upper_arm_circle"  :error-messages="pe_validation.mid_upper_arm_circle.err_msg" maxlength="4" class="body-2" onpaste="return false" dense/>
                                <span class="ml-1 grey--text text--darken-1 body-2">CM</span>
                            </div>
                        </div>
                    </v-col>
                </v-row>

                <v-row class="my-2" dense>
                    <v-col cols="12" sm="6" md="6" lg="6" xl="4">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top >
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Left Vision</span>
                                    </template>
                                    <span class="font-weight-medium">Grado sa kaliwang paningin</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Left Vision</span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="left_one" :disabled="from_migration" @input="validatePEFields('left_one', $event)" @keypress="numberOnlyWithDeci($event, left_one)" :error-messages="pe_validation.left_one.err_msg" maxlength="5" class="body-2" dense/>
                                <span class="mx-1 font-weight-medium grey--text text--darken-4 pt-1 body-2">/</span>
                                <v-text-field v-model="left_two" :disabled="from_migration"  @input="validatePEFields('left_two', $event)" @keypress="numberOnlyWithDeci($event, left_two)" maxlength="5" :error-messages="pe_validation.left_two.err_msg" class="body-2" dense/>
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="6" lg="6" xl="4">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top >
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Right Vision</span>
                                    </template>
                                    <span class="font-weight-medium">Grado sa kanang paningin</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1 body-2">Right Vision</span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="right_one" :disabled="from_migration" @input="validatePEFields('right_one', $event)" @keypress="numberOnlyWithDeci($event, right_one)" maxlength="5" :error-messages="pe_validation.right_one.err_msg" class="body-2" dense/>
                                <span class="mx-1 font-weight-medium grey--text text--darken-4 pt-1 body-2">/</span>
                                <v-text-field v-model="right_two" :disabled="from_migration" @input="validatePEFields('right_two', $event)" @keypress="numberOnlyWithDeci($event, right_two)" maxlength="5" :error-messages="pe_validation.right_two.err_msg" class="body-2" dense/>
                            </div>
                        </div>
                    </v-col>
                </v-row>

                <v-row class="my-2" dense>
                    <v-col class="align-baseline" cols="12" sm="12" md="6" lg="6" xl="6">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1 body-2">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">Waist Circumference</span>
                                    </template>
                                    <span class="font-weight-medium">Sukat ng baywang</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">Waist Circumference</span>
                            </div>

                            <div class="d-flex align-center">
                                <v-text-field v-model="waist_circumference" :disabled="from_migration" @blur="emitData()" @input="validatePEFields('waist_circumference', $event)" @keypress="numberOnlyWithDeci($event, waist_circumference)" maxlength="5" :error-messages="pe_validation.waist_circumference.err_msg" class="body-2" onpaste="return false" dense/>
                                <span class="ml-1 grey--text text--darken-1 body-2">CM</span>
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                        <div class="d-flex flex-column">
                            <div class="font-weight-medium grey--text text--darken-4 mb-1 body-2">
                                <v-tooltip v-if="$store.state.usr_credentials.user_settings.display_filipino_word === '1'" top >
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on">Central Adiposity</span>
                                    </template>
                                    <span class="font-weight-medium">Labis na taba sa gitnang bahagi</span>
                                </v-tooltip>
                                <span v-else>Central Adiposity</span>
                            </div>

                            <div class="d-flex align-center">
                                <v-radio-group v-model="central_adiposity" :disabled="from_migration" class="ma-0 pa-0" row>
                                    <v-radio label="Yes" value="1" />
                                    <v-radio label="No" value="0" />
                                </v-radio-group>

                                <v-btn v-if="emr_params.editable && central_adiposity" :disabled="from_migration" @click="central_adiposity = ''; emitData()" class="ml-2" x-small > CLEAR </v-btn>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
        </div>

        <div v-if="$route.params.page === 'physician-diagnosis-and-treatment-plan' || emr_params.routes === 'Consultation' || $store.state.usr_credentials.lgu_host_code !== 'LC' && $store.state.usr_credentials.lgu_host_code !== 'BAT' || $store.state.usr_credentials.user_settings.user_layout === 'type_b'" >
             <v-divider class="mt-6 mb-4"></v-divider>
             <v-card :class="emr_params.routes !== 'Consultation' ? 'elevation-0' : 'elevation-1 pa-8' ">
                <v-tabs v-model="tab"  class="card-border px-1" active-class="active-tab" hide-slider outlined>
                    <v-tab class="non-active-tab">General Survey</v-tab>
                    <!-- <v-tab class="non-active-tab">
                        <span> Heent</span>
                    </v-tab> -->
                </v-tabs>
                
                <v-tabs-items v-model="tab"  class="px-1 mb-7" ref="tabs" touchless>
                    <v-expansion-panels v-model="panel" multiple class="pb-1">
                        <v-expansion-panel class="tabs-border">
                            <v-tab-item >
                                <v-expansion-panel-content class="mt-5">
                                    <v-row class="pl-4" dense>
                                        <v-col v-for="(value, index) in general_survey_items" :key="index" cols="12" sm="6" md="6" lg="6">
                                            <v-checkbox v-model="general_survey" :disabled="from_migration" @blur="emitData()" class="ma-0 checkbox_label" :label="value" :value="value" hide-details></v-checkbox>
                                        </v-col>

                                        <v-col class="align-baseline d-flex" cols="12">
                                            <v-label class="grey--text text--darken-4">Others: </v-label>
                                            <v-text-field v-model="other_general_survey" :disabled="from_migration"  @blur="emitData()"  class="body-2 pl-4" hide-details dense></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-content>
                            </v-tab-item>

                            <!-- <v-tab-item>
                                <v-expansion-panel-content class="mt-5">
                                    <v-row class="pl-4 mb-6" align="baseline" dense>
                                        <v-col v-for="(value, i) in heent_items" :key="i" cols="12" sm="6" md="6" lg="6">
                                            <v-checkbox v-model="heent" @change="emitData" :label="value.heent" :value="value" class="ma-0 checkbox_label" hide-details></v-checkbox>
                                        </v-col>
                                        
                                        <v-col class="align-baseline d-flex" cols="12">
                                            <v-label>Others:</v-label>
                                            <v-text-field v-model="other_heent" class="body-2 pl-4" hide-details dense></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-content>
                            </v-tab-item> -->
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-tabs-items>

                <v-row> 
                    <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pa-1"> 
                        <v-checkbox v-model="assessment_en" :disabled="from_migration" @change="getAssessment" label="All physical evaluations of the patient indicate normal results without any significant findings." hide-details dense> </v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1"> 
                        <v-combobox v-model="assessment.chest.assessment" :items="chest" :disabled="from_migration" @change="validateAssessment($event, 'chest')" class="mt-2" item-text="assessment" onkeydown="return false;" label="CHEST & LUNGS" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                        <v-combobox v-model="assessment.cvs.assessment" :items="cvs" :disabled="from_migration" @change="validateAssessment($event, 'cvs')" class="mt-2" item-text="assessment" onkeydown="return false;" label="CVS" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                        <v-combobox v-model="assessment.abdomen.assessment" :items="abdomen" :disabled="from_migration" @change="validateAssessment($event, 'abdomen')" class="mt-2" item-text="assessment" onkeydown="return false;" label="ABDOMEN" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                        <v-combobox v-model="assessment.gui.assessment" :items="gui" :disabled="from_migration" @change="validateAssessment($event, 'gui')" class="mt-2" item-text="assessment" onkeydown="return false;" label="GENITOURINARY TRACT" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                        <v-combobox v-model="assessment.pelvic.assessment" :items="pelvic" :disabled="from_migration" @change="validateAssessment($event, 'pelvic')" class="mt-2" item-text="assessment" onkeydown="return false;" label="PELVIC EXAMINATION" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                        <v-combobox v-model="assessment.rectal.assessment" :items="rectal" :disabled="from_migration" @change="validateAssessment($event, 'rectal')" class="mt-2" item-text="assessment" onkeydown="return false;" label="DIGITAL RECTAL EXAM" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                        <v-combobox v-model="assessment.musculoskeletal.assessment" :items="musculoskeletal" :disabled="from_migration" @change="validateAssessment($event, 'musculoskeletal')" class="mt-2" item-text="assessment" onkeydown="return false;" label="MUSCULOSKELETAL EXAM" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                        <v-combobox v-model="assessment.skin.assessment" :items="skin" :disabled="from_migration"  @change="validateAssessment($event, 'skin')" class="mt-2" item-text="assessment" onkeydown="return false;" label="SKIN" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                        <v-combobox v-model="assessment.neuro.assessment" :items="neuro" :disabled="from_migration" @change="validateAssessment($event, 'neuro')" class="mt-2" item-text="assessment" onkeydown="return false;" label="NEUROLOGIC EXAMINATION" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                        <v-combobox v-model="assessment.heent.assessment" :items="heent" :disabled="from_migration" @change="validateAssessment($event, 'heent')" class="mt-2" item-text="assessment" onkeydown="return false;" label="HEENT" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
                    </v-col>
                </v-row>
             </v-card>
             <v-divider class="mt-6 mb-4"></v-divider>
        </div>
 
        <!-- DIALOG FOR OTHER ASSESSMENT -->
        <v-dialog v-if="other_assessment.dialog" v-model="other_assessment.dialog" width="400" persistent>
            <v-card class="pa-5">
                <h6 class="font-weight-medium body-2">Current: {{ assessment[other_assessment.category].others_notes ? assessment[other_assessment.category].others_notes.substring(8) : '' }}</h6>
                
                <v-divider class="my-2"></v-divider>

                <h6 class="font-weight-regular body-2">Others</h6>
                <v-text-field v-model="other_assessment.new_val" :disabled="from_migration" @input="other_assessment.new_val = textCapitalize($event)" placeholder="Enter the assessment here" hide-details outlined></v-text-field>

                <v-layout justify-end wrap mt-4>
                    <v-btn @click="insertOtherAssessment('close', other_assessment.category)" small> CLOSE </v-btn>
                    <v-btn @click="insertOtherAssessment('confirm', other_assessment.category)" :disabled="!other_assessment.new_val" class="ml-2" color="primary" small> CONFIRM </v-btn>
                </v-layout>
            </v-card>
        </v-dialog>

        <BMICalculationController ref="BMICalculationController" />
    </v-card>
</template>

<script>
import { heent, chest, cvs, abdomen, gui, pelvic, rectal, musculoskeletal, skin, neuro } from '../../reference/physical-exam-list.json'
import BMICalculationController from '@/controller/BMICalculationController.vue'
import { pe_validation } from '@/reference/physical-exam-validation.json'

export default {
    props: ['emr_params', 'patient_age', 'patient_birthdate', 'patient_gender', 'eligible_data', 'for_saving', 'member_data', 'selected_referral','selected_transaction','from_migration'],

    components: {
        BMICalculationController
    },

    data() {
        return {
            bp_empty_fields: false,
            bp_systolic: '',
            bp_diastolic: '',
            bp_2nd_empty_fields: false,
            bp_2nd_systolic: '',
            bp_2nd_diastolic: '',
            heart_rate: '',
            respiration_rate: '',
            temp: '',
            o2sat: '',
            pex_empty_fields: false,
            hr_rr_temp_empty: false,
            height: '',
            weight: '',
            weight_for_age: '',
            height_for_age: '',
            weight_for_height: '',
            central_adiposity: '',
            waist_circumference: '',
            general_survey: [],
            other_general_survey: '',
            // heent: [],
            hip: '',
            limbs: '',
            skin_for_thickness: '',
            mid_upper_arm_circle: '',
            head_circle: '',
            left_one: '',
            left_two: '',
            left_vision: '',
            right_one: '',
            right_two: '',
            right_vision: '',

            // other_heent: '',
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
            assessment_en: '',
            other_assessment: {
                dialog: false,
                category: '',
                new_val: ''
            },
            assessment_empty_fields: false,
            panel:[0],
            tab:'',
            // REFERENCE DATA
            general_survey_items: [ "AWAKE AND ALERT", "ALTERED SENSORIUM", "CONSCIOUS", "COHERENT", "NOT IN CARDIO RESPIRATORY DISTRESS", "UNCONSCIOUS", "IN CARDIOPULMONARY DISTRESS" ],

            heent,
            chest,
            cvs,
            abdomen,
            gui,
            pelvic,
            rectal,
            musculoskeletal,
            skin,
            neuro,

            pe_validation,

            pe_post_data: {},

            request_data_payload: sessionStorage.getItem('rqnn52ds') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('rqnn52ds'), 'OKM2HN').toString(this.$crypto.enc.Utf8)) : null
        }
    },

    watch: {
        eligible_data: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.filterAssessmentStatus()
                }
            }
        }
    },

    mounted(){
        // this.checkIfEmpty();
        //this.filterAssessmentStatus();

        if(this.emr_params.routes !== 'Consultation'){
            this.getPhysicalExamination()
        }

        //CALL THE CONTROLLER AGAIN IF THE REQUEST IF INTERUPTED
        if(this.request_data_payload){
            let function_name = this.request_data_payload.function_name
            
            this[function_name]()
            

            this.disabled_discharged_btn = true
        } else {
            this.disabled_discharged_btn = false
        }
    },

    computed: {
        patient_astk_fields(){
            return true
        },

        bmi_computation() {
            let height = parseFloat(this.height)
            let weight = parseFloat(this.weight)
            let bmi_result = {
                bmi: '',
                remarks: ''
            }
            
            if (height > 0 && weight > 0) {
                bmi_result.bmi = (weight / (height / 100 * height / 100)).toFixed(2)
                
                if (bmi_result.bmi < 18.5) {
                    bmi_result.remarks = 'UNDERWEIGHT'
                } else if (bmi_result.bmi > 18.5 && bmi_result.bmi < 25) {
                    bmi_result.remarks = 'NORMAL WEIGHT'
                } else if (bmi_result.bmi > 25 && bmi_result.bmi < 30) {
                    bmi_result.remarks = 'OVERWEIGHT'
                } else {
                    bmi_result.remarks = 'OBESITY'
                }

                return bmi_result
            } else {
                return bmi_result
            }
        },
    },

    methods: {
        //GET THE PRREVIOUS RECORD OF THE PATIENT IN PRE CONSULTATION
        async getPatientRT(){
            // Restore cached pex_data from sessionStorage
            const cached_pex_data = sessionStorage.getItem('hjyGCS34x') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('hjyGCS34x'), 'EMX268').toString(this.$crypto.enc.Utf8)) : null

            if (cached_pex_data) {
                this.bp_systolic = cached_pex_data.bp_systolic
                this.bp_diastolic = cached_pex_data.bp_diastolic
                this.bp_2nd_systolic = cached_pex_data.bp_2nd_systolic
                this.bp_2nd_diastolic = cached_pex_data.bp_2nd_diastolic
                this.blood_pressure = cached_pex_data.blood_pressure
                this.blood_pressure_2nd = cached_pex_data.blood_pressure_2nd
                this.heart_rate = cached_pex_data.heart_rate
                this.respiration_rate = cached_pex_data.respiration_rate
                this.temp = cached_pex_data.temp
                this.o2sat = cached_pex_data.oxygen_saturation
                this.height = cached_pex_data.height
                this.weight = cached_pex_data.weight
                this.central_adiposity = cached_pex_data.central_adiposity
                this.waist_circumference = cached_pex_data.waist_circumference
                this.left_one = cached_pex_data.left_one
                this.left_two = cached_pex_data.left_two
                this.right_one = cached_pex_data.right_one
                this.right_two = cached_pex_data.right_two
                this.left_vision = cached_pex_data.left_vision
                this.right_vision = cached_pex_data.right_vision
                this.hip = cached_pex_data.hip
                this.skin_for_thickness = cached_pex_data.skin_for_thickness
                this.limbs = cached_pex_data.limbs
                this.head_circle = cached_pex_data.head_circle
                this.mid_upper_arm_circle = cached_pex_data.mid_upper_arm_circle
                this.assessment = cached_pex_data.assessment,
                this.general_survey = cached_pex_data.general_survey,
                this.general_survey_notes = cached_pex_data.other_general_survey,
                this.emitData()
                return cached_pex_data
            }

            //POPULATE PHYSICAL EXAM FROM REFERRAL DATA
            if (this.selected_referral) {
                if (this.selected_referral.bp1) {
                    const get_index_bp1 = this.selected_referral.bp1.indexOf('/')
                    this.bp_systolic = this.selected_referral.bp1.substring(0, get_index_bp1)
                    this.bp_diastolic = this.selected_referral.bp1.substring(get_index_bp1 + 1)
                }

                if (this.selected_referral.bp2) {
                    const get_index_bp2 = this.selected_referral.bp2.indexOf('/')
                    this.bp_2nd_systolic = this.selected_referral.bp2.substring(0, get_index_bp2)
                    this.bp_2nd_diastolic = this.selected_referral.bp2.substring(get_index_bp2 + 1)
                }
                
                this.height = this.selected_referral.height ? this.selected_referral.height : ''
                this.weight = this.selected_referral.weight ? this.selected_referral.weight : ''
                this.temp = this.selected_referral.temp ? this.selected_referral.temp : ''
                this.heart_rate = this.selected_referral.heart_rate ? this.selected_referral.heart_rate : ''
                this.o2sat = this.selected_referral.oxygen_saturation ? this.selected_referral.oxygen_saturation : ''
                this.respiration_rate = this.selected_referral.respiration_rate ? this.selected_referral.respiration_rate : ''
                this.waist_circumference = this.selected_referral.waist_circumference ? this.selected_referral.waist_circumference : ''
                this.central_adiposity = this.selected_referral.central_adiposity ? this.selected_referral.central_adiposity : ''
                this.hip = this.selected_referral.hip ? this.selected_referral.hip : ''
                this.skin_for_thickness = this.selected_referral.skin_for_thickness ? this.selected_referral.skin_for_thickness : ''
                this.limbs = this.selected_referral.limbs ? this.selected_referral.limbs : ''
                this.head_circle = this.selected_referral.head_circle ? this.selected_referral.head_circle : ''
                this.mid_upper_arm_circle = this.selected_referral.mid_upper_arm_circle ?this.selected_referral.mid_upper_arm_circle : ''

                if(this.selected_referral.left_vision) {
                    let left_vision = this.selected_referral.left_vision.split('/')
                    this.left_one = left_vision[0]
                    this.left_two = left_vision[1]
                }

                if(this.selected_referral.right_vision) {
                    let right_vision = this.selected_referral.right_vision.split('/')
                    this.right_one = right_vision[0]
                    this.right_two = right_vision[1]
                }

                this.selected_referral.general_survey.forEach(el => {
                    this.general_survey.push(el.general_survey)
                })

                for(let i in this.selected_referral.patient_assessment) {
                    if(i in this.selected_referral.patient_assessment) {
                    if(this.selected_referral.patient_assessment[i].other_notes !== '') {
                        this.selected_referral.patient_assessment[i].assessment = this.patient_assessment[i].assessment.push({ assessment_id: null, assessment: 'OTHERS: ' + this.selected_referral.patient_assessment[i].other_notes})
                    } else {
                        this.selected_referral.patient_assessment[i].assessment.forEach(el => {
                        this.assessment[i].assessment.push({ assessment_id: el.assessment_id, assessment: el.assessment })
                        })
                    }
                    }
                }

                this.emitData()
                this.filterAssessmentNormal()
            } else {
                let response = await this.$services.getPatientRecordAndTransaction({
                    request_key : 'patient_record',
                    hmo_policy_number : this.member_data.member.mem_hmo_policy_number,
                    hmo_host_code : this.member_data.member.mem_hmo_host_code,
                    ek_lgu_id : this.member_data.member.ek_lgu_id,
                    lgu_host_code : this.member_data.member.lgu_host_code,
                    ek_phic_id : this.member_data.member.ek_phic_id,
                    phic_host_code :  this.member_data.member.ek_phic_id ? 'PHIC' : null,
                })
    
                if(response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
    
                    if (response.data.has_data) {
                        
                        this.height            = response.data.height
                        this.weight            = response.data.weight
                        this.bmi               = parseFloat(response.data.bmi)
                        this.bmi_remarks       = response.data.bmi_remarks
                        this.height_for_age    = response.data.height_for_age
                        this.weight_for_age    = response.data.weight_for_age
                        this.weight_for_height = response.data.weight_for_height
                        this.hip               = response.data.hip
                        this.skin_for_thickness= response.data.skin_for_thickness
                        this.limbs             = response.data.limbs
                        this.head_circle       = response.data.head_circle
                        this.mid_upper_arm_circle=response.data.mid_upper_arm_circle
                        this.left_vision       = response.data.left_vision
                        this.right_vision      = response.data.right_vision

                        //GET THE OTHER PHYSICAL EXAMINATION FOR EC LGU HOST CODE
                        if(this.$store.state.usr_credentials.lgu_host_code === 'SR') {
                            if (response.data.blood_pressure) {
                                const [systolic, diastolic] = response.data.blood_pressure.split('/')
                                this.bp_systolic = systolic
                                this.bp_diastolic = diastolic
                            }

                            if (response.data.blood_pressure_2nd) {
                                const [systolic_2nd, diastolic_2nd] = response.data.blood_pressure_2nd.split('/')
                                this.bp_2nd_systolic = systolic_2nd
                                this.bp_2nd_diastolic = diastolic_2nd
                            }

                            this.heart_rate        = response.data.heart_rate
                            this.respiration_rate  = response.data.respiration_rate
                            this.temp              = response.data.temp
                            this.o2sat             = response.data.oxygen_saturation,
                            this.waist_circumference = response.data.waist_circumference
                            this.central_adiposity = response.data.central_adiposity
                        }
                    }

                    this.has_previous_record = response.data.has_data === true ? true : false
    
                    if (this.left_vision) {
                        let [left_one, left_two] = this.left_vision.split('/')
                        this.left_one = left_one
                        this.left_two = left_two   
                    }
                    
                    if (this.right_vision) {
                        let [right_one, right_two] = this.right_vision.split('/')
                        this.right_one = right_one
                        this.right_two = right_two
                    }

                    let patient_record = {
                        height: this.height,
                        weight: this.weight,
                        bmi: this.bmi,
                        bmi_remarks: this.bmi_remarks,
                        height_for_age: this.height_for_age,
                        weight_for_age: this.weight_for_age,
                        weight_for_height: this.weight_for_height,
                        has_previous_record: this.has_previous_record,
                        hip: this.hip,
                        skin_for_thickness: this.skin_for_thickness,
                        limbs: this.limbs,
                        head_circle: this.head_circle,
                        mid_upper_arm_circle: this.mid_upper_arm_circle,
                        left_vision: this.left_vision,
                        left_one: this.left_one,
                        left_two: this.left_two,
                        right_vision: this.right_vision,
                        right_one: this.right_one,
                        right_two: this.right_two,
                        
                        heart_rate: this.heart_rate,
                        respiration_rate: this.respiration_rate,
                        temp: this.stemp,
                        o2sat: this.o2sat,
                        bp_systolic: this.bp_systolic,
                        bp_diastolic: this.bp_diastolic,
                        bp_2nd_systolic: this.bp_2nd_systolic,
                        bp_2nd_diastolic: this.bp_2nd_diastolic,
                        waist_circumference: this.waist_circumference,
                        central_adiposity: this.central_adiposity
                    }
                    this.emitData();
                    return patient_record
                } else {
                    this.alert = response.error
                }
            }
        },

        //GET THE LATEST PHYSICAL EXAMINATION IN EMR
        async getPhysicalExamination() {
            let physical_examination = sessionStorage.getItem('mmxcHF4s3') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('mmxcHF4s3'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true,
            }

            if (physical_examination.fresh_load) {
                let response = await this.$services.getPatientRecordAndTransaction({
                    fetch_all_request: true,
                    transaction_number: this.emr_params.transaction_number,
                    hmo_policy_number: this.emr_params.hmo_policy_number,
                    hmo_host_code: this.emr_params.hmo_host_code,
                    ek_lgu_id: this.emr_params.ek_lgu_id,
                    lgu_host_code: this.emr_params.lgu_host_code,
                    ek_phic_id: this.emr_params.ek_phic_id,
                    phic_host_code: this.emr_params.phic_host_code,
                    mem_phic_pin: this.emr_params.mem_phic_pin
                })

                if (response.status === 200) {
                    response.data.physical_exam_data = this.responseDataDecryption(response.data.physical_exam_data)
                    response.data.patient_record = this.responseDataDecryption(response.data.patient_record)
                
                    if (response.data.physical_exam_data.blood_pressure) {
                        const [systolic, diastolic] = response.data.physical_exam_data.blood_pressure.split('/')
                        this.bp_systolic = systolic
                        this.bp_diastolic = diastolic
                    }

                    if (response.data.physical_exam_data.blood_pressure_2nd) {
                        const [systolic_2nd, diastolic_2nd] = response.data.physical_exam_data.blood_pressure_2nd.split('/')
                        this.bp_2nd_systolic = systolic_2nd
                        this.bp_2nd_diastolic = diastolic_2nd
                    }

                    this.heart_rate = response.data.physical_exam_data.heart_rate
                    this.respiration_rate = response.data.physical_exam_data.respiration_rate
                    this.temp = response.data.physical_exam_data.temp
                    this.o2sat = response.data.physical_exam_data.oxygen_saturation

                    this.height = response.data.patient_record.height
                    this.weight = response.data.patient_record.weight

                    this.weight_for_age = response.data.patient_record.weight_for_age
                    this.height_for_age = response.data.patient_record.height_for_age
                    this.weight_for_height = response.data.patient_record.weight_for_height

                    this.central_adiposity = response.data.physical_exam_data.central_adiposity
                    this.waist_circumference = response.data.physical_exam_data.waist_circumference

                    this.hip = response.data.patient_record.hip
                    this.skin_for_thickness = response.data.patient_record.skin_for_thickness
                    this.head_circle = response.data.patient_record.head_circle
                    this.mid_upper_arm_circle = response.data.patient_record.mid_upper_arm_circle
                    this.limbs = response.data.patient_record.limbs
                    this.left_vision = response.data.patient_record.left_vision
                    this.right_vision = response.data.patient_record.right_vision
                    
                    if(response.data.patient_record.left_vision) {
                        const [left_one, left_two] = response.data.patient_record.left_vision.split('/')
                        this.left_one = left_one,
                        this.left_two = left_two
                    }

                    if(response.data.patient_record.right_vision) {
                        const [right_one, right_two] = response.data.patient_record.right_vision.split('/')
                        this.right_one = right_one,
                        this.right_two = right_two
                    }
                    
                    const general_survey = this.responseDataDecryption(response.data.general_survey)
                    // this.general_survey = general_survey.map(item => item.general_survey)
                    this.general_survey = general_survey.general_survey || []
                    this.other_general_survey = general_survey.length > 0 ? general_survey[0].general_survey_notes : ''

                    // const heent = this.responseDataDecryption(response.data.heent)

                    // this.heent = heent.map(item => {
                    //     return {
                    //         heent_id: item.heent_id,
                    //         heent: item.heent
                    //     }
                    // })

                    // this.other_heent = response.data.heent.length > 0 ? response.data.heent[0].other_notes : null

                    this.assessment = {
                        chest: response.data.assessment.chest ? this.responseDataDecryption(response.data.assessment.chest) : { assessment: [], others_notes: '' },
                        cvs: response.data.assessment.cvs ? this.responseDataDecryption(response.data.assessment.cvs) : { assessment: [], others_notes: '' },
                        abdomen: response.data.assessment.abdomen ? this.responseDataDecryption(response.data.assessment.abdomen) : { assessment: [], others_notes: '' },
                        gui: response.data.assessment.gui ? this.responseDataDecryption(response.data.assessment.gui) : { assessment: [], others_notes: '' },
                        pelvic: response.data.assessment.pelvic ? this.responseDataDecryption(response.data.assessment.pelvic) : { assessment: [], others_notes: '' },
                        rectal: response.data.assessment.rectal ? this.responseDataDecryption(response.data.assessment.rectal) : { assessment: [], others_notes: '' },
                        musculoskeletal: response.data.assessment.musculoskeletal ? this.responseDataDecryption(response.data.assessment.musculoskeletal) : { assessment: [], others_notes: '' },
                        skin: response.data.assessment.skin ? this.responseDataDecryption(response.data.assessment.skin) : { assessment: [], others_notes: '' },
                        neuro: response.data.assessment.neuro ? this.responseDataDecryption(response.data.assessment.neuro) : { assessment: [], others_notes: '' },
                        heent: response.data.assessment.heent ? this.responseDataDecryption(response.data.assessment.heent) : { assessment: [], others_notes: '' }
                    };

                    this.filterAssessmentNormal()
                    
                    Object.keys(this.assessment).forEach(element => {
                        if (this.assessment[element].others_notes) {
                            this.assessment[element].assessment.push({
                                assessment_id: '99',
                                assessment: 'OTHERS: ' + this.assessment[element].others_notes
                            });

                            this.assessment[element].others_notes = 'OTHERS: ' + this.assessment[element].others_notes;
                        }
                    });

                    this.plan_data = this.responseDataDecryption(response.data.plan)

                    physical_examination.fresh_load = false
                    physical_examination.bp_systolic = this.bp_systolic
                    physical_examination.bp_diastolic = this.bp_diastolic
                    physical_examination.bp_2nd_systolic = this.bp_2nd_systolic
                    physical_examination.bp_2nd_diastolic = this.bp_2nd_diastolic
                    physical_examination.heart_rate = this.heart_rate
                    physical_examination.respiration_rate = this.respiration_rate
                    physical_examination.temp = this.temp
                    physical_examination.o2sat = this.o2sat
                    physical_examination.height = this.height
                    physical_examination.weight = this.weight
                    physical_examination.weight_for_age = this.weight_for_age
                    physical_examination.height_for_age = this.height_for_age
                    physical_examination.weight_for_height = this.weight_for_height
                    physical_examination.central_adiposity = this.central_adiposity
                    physical_examination.waist_circumference = this.waist_circumference
                    physical_examination.general_survey = this.general_survey
                    physical_examination.other_general_survey = this.other_general_survey
                    // physical_examination.heent = this.heent
                    // physical_examination.other_heent = this.other_heent
                    physical_examination.assessment = this.assessment
                    physical_examination.plan_data = this.plan_data
                    physical_examination.limbs = this.limbs
                    physical_examination.head_circle = this.head_circle
                    physical_examination.mid_upper_arm_circle = this.mid_upper_arm_circle
                    physical_examination.skin_for_thickness = this.skin_for_thickness
                    physical_examination.hip = this.hip
                    physical_examination.left_vision = this.left_vision
                    physical_examination.right_vision = this.right_vision
                    
                    sessionStorage.setItem('mmxcHF4s3', this.$crypto.AES.encrypt(JSON.stringify(physical_examination), 'EMX246'))
                    this.$emit('getPhysicalExamination'); 

                    return {
                        bmi_computation: this.bmi_computation,
                        ...physical_examination,
                    }
                } else {
                    this.alert = response.error
                }
            } else {
                this.bp_systolic = physical_examination.bp_systolic
                this.bp_diastolic = physical_examination.bp_diastolic
                this.bp_2nd_systolic = physical_examination.bp_2nd_systolic
                this.bp_2nd_diastolic = physical_examination.bp_2nd_diastolic
                this.heart_rate = physical_examination.heart_rate
                this.respiration_rate = physical_examination.respiration_rate
                this.temp = physical_examination.temp
                this.o2sat = physical_examination.o2sat
                this.height = physical_examination.height
                this.weight = physical_examination.weight
                this.weight_for_age = physical_examination.weight_for_age
                this.height_for_age = physical_examination.height_for_age
                this.weight_for_height = physical_examination.weight_for_height
                this.central_adiposity = physical_examination.central_adiposity
                this.waist_circumference = physical_examination.waist_circumference
                this.general_survey = physical_examination.general_survey
                this.other_general_survey = physical_examination.other_general_survey
                // this.heent = physical_examination.heent
                // this.other_heent = physical_examination.other_heent
                this.assessment = physical_examination.assessment
                this.plan_data = physical_examination.plan_data
                this.limbs = physical_examination.limbs
                this.mid_upper_arm_circle = physical_examination.mid_upper_arm_circle
                this.skin_for_thickness = physical_examination.skin_for_thickness
                this.hip = physical_examination.hip
                this.head_circle = physical_examination.head_circle

                if(physical_examination.left_vision) {
                    const [left_one, left_two] = physical_examination.left_vision.split('/')
                    this.left_one = left_one,
                    this.left_two = left_two
                }

                if(physical_examination.right_vision) {
                    const [right_one, right_two] =  physical_examination.right_vision.split('/')
                    this.right_one = right_one,
                    this.right_two = right_two
                }

                this.filterAssessmentNormal()

                return {
                    bmi_computation: this.bmi_computation,
                    ...physical_examination,
                }
            }
        },

        filterAssessmentNormal() {
            let count_assesment_normal = []
                
            for(let element in this.assessment) {
                this.assessment[element].assessment.forEach(data => {
                    if(data.assessment === 'Essentially normal' || data.assessment === 'ESSENTIALLY NORMAL') {
                        count_assesment_normal.push(data.assessment)
                    } 
                })
            }
            
            if(count_assesment_normal.length >= 10) {
                this.assessment_en = true
            } else {
                this.assessment_en = false
            }
        },

        filterAssessmentStatus() {
            const status_filter = [
                'heent', 'chest', 'cvs', 'abdomen', 'gui', 
                'pelvic', 'rectal', 'musculoskeletal', 'skin', 'neuro'
            ];

            if (this.eligible_data.konsulta_eligible || this.eligible_data.eclaims_eligible) {
                status_filter.forEach(key => {
                    if (this[key]) {
                        this[key] = this[key].filter(item => item.assessment_status === 'A');
                    }
                });
            } 
        },

        async postData(transaction_number, pex_data_value) {
            let blood_pressure = ''
            if (this.bp_systolic || this.bp_diastolic) {
                blood_pressure = this.bp_systolic + '/' + this.bp_diastolic
            }

            let blood_pressure_2nd = ''
            if (this.bp_2nd_systolic || this.bp_2nd_diastolic) {
                blood_pressure_2nd = this.bp_2nd_systolic + '/' + this.bp_2nd_diastolic
            }

            // REMOVE OTHER ASSESSMENT
            const get_keys = Object.keys(pex_data_value.assessment)
            get_keys.forEach(category => {
                if (pex_data_value.assessment[category].others_notes) {
                    pex_data_value.assessment[category].assessment.forEach((element, index) => {
                        if (element.assessment === pex_data_value.assessment[category].others_notes) {
                            pex_data_value.assessment[category].assessment.splice(index, 1)
                        }
                    })
    
                    // REMOVE THE PREFIX OF OTHERS BEFORE POSTING
                    pex_data_value.assessment[category].others_notes = pex_data_value.assessment[category].others_notes.substring(8)
                } else {
                    pex_data_value.assessment[category].others_notes = null 
                }
            })
            
            //DEFAULT VALUE FOR ASSESSMENT IN EKONSULTA ELIGIBLE
            if ((this.eligible_data.konsulta_eligible || this.eligible_data.eclaims_eligible) && !this.for_saving) {
                for (let key in pex_data_value.assessment) {
                    const assessment_item = pex_data_value.assessment[key];

                    if (assessment_item.assessment && assessment_item.assessment.length > 0) {
                        // Remove "ESSENTIALLY NORMAL" only if there are other assessments present
                        assessment_item.assessment = assessment_item.assessment.filter(
                            item => !(item.assessment === "ESSENTIALLY NORMAL" && assessment_item.assessment.length > 1)
                        );
                    } else {
                        // If no assessments and no `others_notes`, check for default "ESSENTIALLY NORMAL"
                        if ((!assessment_item.assessment || assessment_item.assessment.length === 0) && (!assessment_item.others_notes || assessment_item.others_notes.trim() === "")) {
                            const default_options = this[key];
                            if (Array.isArray(default_options)) {
                                const default_assessment = default_options.find(item => item.assessment === "ESSENTIALLY NORMAL");
                                if (default_assessment) {
                                    assessment_item.assessment = [
                                        {
                                            assessment_id: default_assessment.assessment_id,
                                            assessment: default_assessment.assessment,
                                        },
                                    ];
                                }
                            }
                        }
                    }
                }
            }

            let payload_data = {
                request_key: 'physical_examination',
                transaction_number: this.emr_params.transaction_number || transaction_number,
                phic_tracking_number: '',
                operator_name: this.$store.state.usr_credentials.user_name,
                hmo_policy_number: this.emr_params.hmo_policy_number,
                ek_phic_id: this.emr_params.ek_phic_id,
                ek_lgu_id: this.emr_params.ek_lgu_id,
                ek_hmo_id: this.emr_params.ek_hmo_id,
                phic_host_code: this.emr_params.phic_host_code,
                lgu_host_code: this.emr_params.lgu_host_code,

                bp: blood_pressure,
                blood_pressure_2nd: blood_pressure_2nd,
                heart_rate: this.heart_rate,
                rr: this.respiration_rate,
                temp: this.temp,
                oxygen_saturation: this.o2sat,
                ht: this.height,
                wt: this.weight,
                bmi: this.bmi_computation.bmi,
                remarks: this.bmi_computation.remarks,
                weight_for_age: this.weight_for_age,
                height_for_age: this.height_for_age,
                weight_for_height: this.weight_for_height,
                central_adiposity: this.central_adiposity,
                waist_circumference: this.waist_circumference,
                general_survey: pex_data_value.general_survey,
                general_survey_notes: pex_data_value.other_general_survey,
                hip: this.hip,
                skin_for_thickness: this.skin_for_thickness,
                head_circle: this.head_circle,
                mid_upper_arm_circle: this.mid_upper_arm_circle,
                limbs: this.limbs,
                // heent: this.heent,
                left_vision: this.left_one + "/" + this.left_two,
                right_vision: this.right_one + "/" + this.right_two,
                // heent_others_notes: this.other_heent,
                patient_assessment: pex_data_value.assessment,
                process_by: this.$store.state.usr_credentials.user_name
            }

            let response = await this.$services.trnUpdatePatientTranRecord(payload_data)

            if (response.status === 200) {
                sessionStorage.removeItem('mmxcHF4s3')
                return true
            } else {
                this.$store.commit('set_transaction_flag', 1)
                this.alert = response.error
            }
        },

        computeBMI() {
            if (this.patient_age < 5) {
                this.weight_for_age = this.$refs.BMICalculationController.getWeightForAge(this.patient_birthdate, this.weight, this.patient_gender);
                this.height_for_age = this.$refs.BMICalculationController.getHeightForAge(this.patient_birthdate, this.height, this.patient_gender);
                this.weight_for_height = this.$refs.BMICalculationController.getWeightForHeight(this.patient_birthdate, this.height, this.weight, this.patient_gender);
            }

            this.emitData();
        },

        validateAssessment(data, category) {
            const map = data.filter(element => element && element.assessment).map(element => element.assessment);

            if (map.includes('OTHERS')) {
                this.other_assessment.dialog = true;
                this.other_assessment.category = category;
            }

            const index_normal = data.findIndex(element => element.assessment === 'ESSENTIALLY NORMAL' && element.assessment_id);
            const not_normal = data.findIndex(element => element.assessment !== 'ESSENTIALLY NORMAL' && element.assessment_id);
            
            if (index_normal !== -1 && map.includes('ESSENTIALLY NORMAL') && map.length > 1) {
                data.splice(index_normal, 1);
            }

            if (not_normal !== -1 && map.includes('ESSENTIALLY NORMAL') && map.length > 1) {
                data.splice(not_normal, 10);
            }

            this.filterAssessmentNormal();
            this.emitData();
        },

        getAssessment() {
            for (let element in this.assessment) {
                if(this.assessment_en) {
                    this.assessment[element].assessment = []
                    this.assessment[element].assessment.push(this[element][0])
                    this.emitData()
                } else {
                    this.assessment[element].assessment = []
                }
            }
        },

        insertOtherAssessment(status, category) {
            if (status === 'confirm') {
                // DELETE FIRST OTHERS
                let first_other = null

                this.assessment[category].assessment.forEach((element, index) => {
                    if (element.assessment === 'OTHERS') first_other = index
                })

                this.assessment[category].assessment.splice(first_other, 1)

                // DELETE PREVIOUS OTHERS
                let previous_other = null

                this.assessment[category].assessment.forEach((element, index) => {
                    if (element.assessment.substring(0, 6) === 'OTHERS') previous_other = index
                })

                if (previous_other !== null) this.assessment[category].assessment.splice(previous_other, 1)
                
                // INSERT NEW OTHERS
                this.assessment[category].assessment.push({
                    assessment_id: '99',
                    assessment: 'OTHERS: ' + this.other_assessment.new_val
                })
                
                this.assessment[category].others_notes = 'OTHERS: ' + this.other_assessment.new_val
            } else {
                this.assessment[category]['assessment'].pop()
            }
            
            this.other_assessment.dialog = false
            this.other_assessment.new_val = ''
            this.emitData();
        },

        numberOnly(event) {
            if ((event.which < 48 || event.which > 57) && event.which !== 45) {
                event.preventDefault();
            }
        },

        numberOnlyWithDeci(event, value) {
            if (((event.which != 46 || (event.which == 46 && value == '')) || value.indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        },

        checkIfEmpty() { 
            let has_empty = false

            if (!this.height || !this.weight) {
                has_empty = true
                this.pex_empty_fields = true
            }

            if (this.bp_systolic || this.bp_diastolic) {
                if (!this.bp_systolic || !this.bp_diastolic) {
                    has_empty = true
                    this.bp_empty_fields = true
                }
            }
            
            //VALIDATION FOR VITAL SIGN FOR EKONSULTA AND ECLAIMS 
            //REMOVED THE 3 YRS OLD BELOW IS NOT REQUIRED FOR VITAL SIGN
            if(!this.bp_systolic || !this.bp_diastolic || !this.heart_rate || !this.respiration_rate || !this.temp) {
                has_empty = true
                this.pex_empty_fields = true
                this.bp_empty_fields = true
                this.hr_rr_temp_empty = true
            }
            
            //VALIDATION REQUIRED BELOW 2 YEARS OLD
            if(this.patient_age <= 2) {
                if(!this.skin_for_thickness || !this.head_circle || !this.mid_upper_arm_circle || !this.limbs || !this.hip) {
                    has_empty = true
                    this.pex_empty_fields = true
                }    
            }
            //VALIDATION REQUIRED BELOW 4 YEARS OLD
            // if(this.patient_age < 4) {
            //     if(!this.skin_for_thickness || !this.head_circle || !this.mid_upper_arm_circle || !this.limbs || !this.hip) {
            //         has_empty = true
            //         this.pex_empty_fields = true
            //     }    
            // }
            
            /*if(this.eligible_data.konsulta_eligible && this.emr_params.routes === "EMRConsultation") {
                if(!this.assessment.chest.assessment.length || !this.assessment.cvs.assessment.length || !this.assessment.abdomen.assessment.length || !this.assessment.gui.assessment.length ||
                    !this.assessment.rectal.assessment.length || !this.assessment.skin.assessment.length || !this.assessment.neuro.assessment.length || !this.assessment.heent.assessment.length) {
                    has_empty = true
                this.assessment_empty_fields = true
                }
            }*/

            /*
            if(this.eligible_data.konsulta_eligible && this.emr_params.routes === "EMRConsultation") {
                const assessments = [
                    this.assessment.chest.assessment.length,
                    this.assessment.cvs.assessment.length,
                    this.assessment.abdomen.assessment.length,
                    this.assessment.gui.assessment.length,
                    this.assessment.rectal.length,
                    this.assessment.skin.length,
                    this.assessment.neuro.length,
                    this.assessment.heent.length,
                ];

                const has_any_data = assessments.some((field) => field > 0);
                this.assessment_empty_fields = !has_any_data;
                this.has_empty = true;
                
            }
            */

            Object.keys(this.pe_validation).forEach(data => {
                if(this.pe_validation[data].has_error) {
                    has_empty = true
                }
            });

            return has_empty
        },

        emitData() {
            const data = {
                bp_systolic: this.bp_systolic,
                bp_diastolic: this.bp_diastolic,
                bp_2nd_systolic: this.bp_2nd_systolic,
                bp_2nd_diastolic: this.bp_2nd_diastolic,
                blood_pressure:  this.blood_pressure,
                blood_pressure_2nd: this.blood_pressure_2nd,
                heart_rate: this.heart_rate,
                respiration_rate: this.respiration_rate,
                temp: this.temp,
                oxygen_saturation: this.o2sat,
                height: this.height,
                weight: this.weight,
                central_adiposity: this.central_adiposity,
                waist_circumference: this.waist_circumference,
                bmi_computation: this.bmi_computation,
                general_survey: this.general_survey,
                general_survey_notes: this.other_general_survey,
                // heent: this.heent,
                // other_heent: this.other_heent,
                assessment: this.assessment,
                left_one: this.left_one,
                left_two: this.left_two,
                left_vision: this.left_one + "/" + this.left_two,
                right_one: this.right_one,
                right_two: this.right_two,
                right_vision: this.right_one + "/" + this.right_two,
                weight_for_age: this.weight_for_age,
                height_for_age: this.height_for_age,
                weight_for_height: this.weight_for_height,
                hip: this.hip,
                skin_for_thickness: this.skin_for_thickness,
                head_circle: this.head_circle,
                mid_upper_arm_circle: this.mid_upper_arm_circle,
                limbs: this.limbs,
            }
            
            sessionStorage.setItem('mmxcHF4s3', this.$crypto.AES.encrypt(JSON.stringify(data), 'EMX246'))
            this.$emit('mutationStatus', 'pex', data)
            const phy_exam_cache = this.$crypto.AES.encrypt(JSON.stringify(data), 'EMX268').toString()
            sessionStorage.setItem('hjyGCS34x', phy_exam_cache)
        },

        validatePEFields(key, value) {
            if (value !== '') {
                const single_number = /^\d+(\.\d+)?$/;
                const range_number = /^\d+(\.\d+)?-\d+(\.\d+)?$/;

                const is_eclaims_bp_exception = ['bp_systolic', 'bp_diastolic', 'bp_2nd_systolic', 'bp_2nd_diastolic'].includes(key) && this.eligible_data?.eclaims_eligible;

                let min = this.pe_validation[key].minimum;
                let max = this.pe_validation[key].maximum;

                if (is_eclaims_bp_exception) {
                    min = 1;
                }

                if (key === 'respiration_rate') {

                    if (single_number.test(value)) {
                        const num = Number(value);

                        if (num < min || num > max) {
                            this.pe_validation[key].err_msg =
                                `${this.pe_validation[key].title}: MUST BE BETWEEN ${min}-${max} ${this.pe_validation[key].sub_title}`;
                            this.pe_validation[key].has_error = true;
                        } else {
                            this.pe_validation[key].err_msg = "";
                            this.pe_validation[key].has_error = false;
                        }

                    } else if (range_number.test(value)) {
                        const [start, end] = value.split('-').map(Number);

                        if (start >= end) {
                            this.pe_validation[key].err_msg = "Invalid range (e.g. 10-23)";
                            this.pe_validation[key].has_error = true;
                            return;
                        }

                        if (start < min || end > max) {
                            this.pe_validation[key].err_msg =
                                `${this.pe_validation[key].title}: RANGE MUST BE BETWEEN ${min}-${max} ${this.pe_validation[key].sub_title}`;
                            this.pe_validation[key].has_error = true;
                        } else {
                            this.pe_validation[key].err_msg = "";
                            this.pe_validation[key].has_error = false;
                        }

                    } else {
                        this.pe_validation[key].err_msg = "Invalid format (use 18 or 10-23)";
                        this.pe_validation[key].has_error = true;
                    }

                    return;
                }

                if (single_number.test(value)) {
                    const numeric_value = Number(value);

                    if (numeric_value < min) {
                        this.pe_validation[key].err_msg =
                            `${this.pe_validation[key].title}: MINIMUM OF ${min} ${this.pe_validation[key].sub_title}`;
                        this.pe_validation[key].has_error = true;

                    } else if (numeric_value > max) {
                        this.pe_validation[key].err_msg =
                            `${this.pe_validation[key].title}: MAXIMUM OF ${max} ${this.pe_validation[key].sub_title}`;
                        this.pe_validation[key].has_error = true;

                    } else {
                        this.pe_validation[key].err_msg = "";
                        this.pe_validation[key].has_error = false;
                    }

                } else {
                    this.pe_validation[key].err_msg = "Invalid number format";
                    this.pe_validation[key].has_error = true;
                }

            } else {
                this.pe_validation[key].err_msg = "";
                this.pe_validation[key].has_error = false;
            }
        },

        //FOR EDIT TRANSACTION
        async getPatientST(){
            if(this.selected_transaction) {
                const stpe = this.selected_transaction 
                const stpe_pe = this.selected_transaction.physical_exam_data
                if (this.selected_transaction) {
                    if (stpe_pe.blood_pressure) {
                        const get_index_bp1 = stpe_pe.blood_pressure.indexOf('/')
                        this.bp_systolic = stpe_pe.blood_pressure.substring(0, get_index_bp1)
                        this.bp_diastolic = stpe_pe.blood_pressure.substring(get_index_bp1 + 1)
                    }

                    if (stpe_pe.blood_pressure_2nd) {
                        const get_index_bp2 = stpe_pe.blood_pressure_2nd.indexOf('/')
                        this.bp_2nd_systolic = stpe_pe.blood_pressure_2nd.substring(0, get_index_bp2)
                        this.bp_2nd_diastolic = stpe_pe.blood_pressure_2nd.substring(get_index_bp2 + 1)
                    }
                }
                this.height = stpe_pe.height ? stpe_pe.height : ''
                this.weight = stpe_pe.weight ? stpe_pe.weight : ''
                this.temp = stpe_pe.temp ? stpe_pe.temp : ''
                this.heart_rate = stpe_pe.heart_rate ? stpe_pe.heart_rate : ''
                this.o2sat = stpe_pe.oxygen_saturation ? stpe_pe.oxygen_saturation : ''
                this.respiration_rate = stpe_pe.respiration_rate ? stpe_pe.respiration_rate : ''
                this.waist_circumference = stpe_pe.waist_circumference ? stpe_pe.waist_circumference : ''
                this.central_adiposity = stpe_pe.central_adiposity ? stpe_pe.central_adiposity : ''
                this.hip = stpe_pe.hip ? stpe_pe.hip : ''
                this.skin_for_thickness = stpe_pe.skin_for_thickness ? stpe_pe.skin_for_thickness : ''
                this.limbs = stpe_pe.limbs ? stpe_pe.limbs : ''
                this.head_circle = stpe_pe.head_circle ? stpe_pe.head_circle : ''
                this.mid_upper_arm_circle = stpe_pe.mid_upper_arm_circle ?stpe_pe.mid_upper_arm_circle : ''

                if(stpe_pe.left_vision) {
                    let left_vision = stpe_pe.left_vision.split('/')
                    this.left_one = left_vision[0]
                    this.left_two = left_vision[1]
                }

                if(stpe_pe.right_vision) {
                    let right_vision = stpe_pe.right_vision.split('/')
                    this.right_one = right_vision[0]
                    this.right_two = right_vision[1]
                }
                
                if(stpe.general_survey) {
                    stpe.general_survey.forEach(el => {
                        this.general_survey.push(el.general_survey)
                    })
                }

                if(stpe.patient_assessment) {
                    for(let i in stpe.patient_assessment) {
                        if(i in stpe.patient_assessment) {
                            if(stpe.patient_assessment[i].others_notes !== '' && stpe.patient_assessment[i].others_notes !== null) {
                                this.assessment[i].assessment.push({ assessment_id: null, assessment: 'OTHERS:' + stpe.patient_assessment[i].others_notes })
                            } else {
                                stpe.patient_assessment[i].assessment.forEach(el => {
                                this.assessment[i].assessment.push({ assessment_id: el.assessment_id, assessment: el.assessment })
                                })
                            }
                        }
                    }
                }
                
                this.emitData()
                this.filterAssessmentNormal()
            }
        }
        
    }
}
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
::v-deep.checkbox_label label {
    color: #2c2c2c !important;
}
</style>