<template>
    <v-card class="card-border pa-7 mt-4" outlined>
        <h3 class="mb-5 grey--text text--darken-4">Physical Examination <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Eksaminasyong pangpisikal)</span></h3>
        <v-row class="mt-2 mb-2" dense>
            <v-col class="d-flex" cols="12" sm="6" md="6" lg="6" xl="4">
                <v-text-field :value="bp_systolic" v-on:keypress="$emit('numberOnly', $event)" @blur="$emit('emitData')" @input="$emit('validatePEFields', 'bp_systolic', $event); $emit('update:bp_systolic', $event)" :error="bp_empty_fields && !bp_systolic" :error-messages="pe_validation.bp_systolic.err_msg"  class="body-2" maxlength="3" dense>
                    <template v-slot:prepend>
                        <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">BP:</span>
                            </template>
                            <span class="font-weight-medium">Unang presyon ng dugo</span>
                        </v-tooltip>
                        <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">BP:</span>
                    </template>
                </v-text-field>  

                <v-text-field :value="bp_diastolic" v-on:keypress="$emit('numberOnly', $event)" @blur="$emit('emitData')" @input="$emit('validatePEFields', 'bp_diastolic', $event); $emit('update:bp_diastolic', $event)" :error="bp_empty_fields && !bp_diastolic" :error-messages="pe_validation.bp_diastolic.err_msg" class="body-2 pl-2" maxlength="3"  dense>
                    <template v-slot:prepend>
                        <span class="font-weight-medium grey--text text--darken-4 pt-1">/</span>
                    </template>
                </v-text-field>  
            </v-col>

            <v-col class="d-flex" cols="12" sm="6" md="6" lg="6" xl="4">
                <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                    <template v-slot:activator="{ on }">
                    <span v-on="on" class="font-weight-medium grey--text text--darken-4 text-no-wrap body-2 pt-2 pr-2">BP 2nd Reading:</span>
                    </template>
                    <span class="font-weight-medium">Ikalawang pagbasa ng presyon ng dugo</span>
                </v-tooltip>
       
                <span v-else class="font-weight-medium grey--text text--darken-4 text-no-wrap body-2 pt-2 pr-2">BP 2nd Reading:</span>
 

                <v-text-field :value="bp_2nd_systolic" v-on:keypress="$emit('numberOnly', $event)" @blur="$emit('emitData')" @input="$emit('validatePEFields', 'bp_2nd_systolic', $event); $emit('update:bp_2nd_systolic', $event)"  :error="bp_2nd_empty_fields && !bp_2nd_systolic" :error-messages="pe_validation.bp_2nd_systolic.err_msg" class="body-2" maxlength="3" dense></v-text-field>
                
                <span class="font-weight-medium grey--text text--darken-4 text-no-wrap body-2 pt-2 pl-2 pr-1">/</span>
                <v-text-field :value="bp_2nd_diastolic" v-on:keypress="$emit('numberOnly', $event)" @blur="$emit('emitData')" @input="$emit('validatePEFields', 'bp_2nd_diastolic', $event); $emit('update:bp_2nd_diastolic', $event)"  :error="bp_2nd_empty_fields && !bp_2nd_diastolic" :error-messages="pe_validation.bp_2nd_diastolic.err_msg" class="body-2" maxlength="3" dense></v-text-field>   
            </v-col>

             <v-col cols="12" sm="6" md="6" lg="3" xl="4">
                <v-text-field :value="heart_rate" @blur="$emit('emitData')" @input="$emit('validatePEFields', 'heart_rate', $event); $emit('update:heart_rate', $event)" v-on:keypress="$emit('numberOnly', $event)" :error="hr_rr_temp_empty && !heart_rate" :error-messages="pe_validation.heart_rate.err_msg" maxlength="4" class="body-2" dense>
                    <template v-slot:prepend>
                        <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">HR:</span>
                            </template>
                            <span class="font-weight-medium">Bilis ng tibok ng puso</span>
                        </v-tooltip>
                        <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">HR:</span>
                    </template>
                </v-text-field> 
            </v-col>

            <v-col cols="12" sm="6" md="6" lg="3" xl="4">
                <v-text-field :value="respiration_rate" @blur="$emit('emitData')" @input="$emit('validatePEFields', 'respiration_rate', $event); $emit('update:respiration_rate', $event)" v-on:keypress="$emit('numberOnly', $event)" :error="hr_rr_temp_empty && !respiration_rate" :error-messages="pe_validation.respiration_rate.err_msg" maxlength="4" class="body-2" dense>
                    <template v-slot:prepend>
                        <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">RR:</span>
                            </template>
                            <span class="font-weight-medium">Bilis ng paghinga</span>
                        </v-tooltip>
                        <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">RR:</span>
                    </template>
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6" lg="3" xl="4">
                <v-text-field :value="temp" @blur="$emit('emitData')" @input="$emit('validatePEFields', 'temp', $event); $emit('update:temp', $event)" v-on:keypress="$emit('numberOnly', $event)" :error="hr_rr_temp_empty && !temp" :error-messages="pe_validation.temp.err_msg" maxlength="4" class="body-2" dense>
                    <template v-slot:prepend>
                        <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">Temp:</span>
                            </template>
                            <span class="font-weight-medium">Temperatura</span>
                        </v-tooltip>
                        <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">Temp:</span>
                    </template>
                </v-text-field>
            </v-col> 

            <v-col cols="12" sm="6" md="6" lg="3" xl="4">
                <v-text-field :value="o2sat" @blur="$emit('emitData')" @input="$emit('validatePEFields', 'o2sat', $event); $emit('update:o2sat', $event)" v-on:keypress="$emit('numberOnly', $event)" class="body-2" :error-messages="pe_validation.o2sat.err_msg" maxlength="3" dense>
                    <template v-slot:prepend>
                        <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">O2Sat:</span>
                            </template>
                            <span class="font-weight-medium">Hangin sa dugo</span>
                        </v-tooltip>
                        <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">O2Sat:</span>
                    </template>

                    <template v-slot:append-outer>
                        <span class="grey--text text--darken-1 pt-1">%</span>
                    </template>
                    <span>%</span>
                </v-text-field>
            </v-col>  
        </v-row>

        <v-row class="my-2" dense>
            <v-col cols="12" sm="6" md="6" lg="3">
                <v-text-field :value="height" @input="$emit('validatePEFields', 'height', $event); $emit('update:height', $event)" :error="pex_empty_fields && !height" @keypress="$emit('numberOnlyWithDeci', 'height', $event)" @blur="$emit('computeBMI')" :error-messages="pe_validation.height.err_msg" maxlength="4" class="body-2" onpaste="return false" dense>
                    <template v-slot:prepend>
                        <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">{{ patient_age > 5 ? 'HT' : 'Length' }}:</span>
                            </template>
                            <span class="font-weight-medium">Tangkad</span>
                        </v-tooltip>
                        <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">{{ patient_age > 5 ? 'HT' : 'Length' }}:</span>
                    </template>
                    
                    <template v-slot:label>
                        <span class="body-2">Centimeters</span>
                    </template>

                    <template v-slot:append-outer>
                        <span class="text--darken-1 grey--text pt-1">CM</span>
                    </template>
                </v-text-field>
            </v-col> 

            <v-col cols="12" sm="6" md="6" lg="3">
                <v-text-field :value="weight" @input="$emit('validatePEFields', 'weight', $event); $emit('update:weight', $event)" :error="pex_empty_fields && !weight" @keypress="$emit('numberOnlyWithDeci', 'weight', $event)" @blur="$emit('computeBMI')" :error-messages="pe_validation.weight.err_msg" maxlength="4" class="body-2" onpaste="return false" dense>
                    <template v-slot:prepend>
                        <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">WT:</span>
                            </template>
                            <span class="font-weight-medium">Timbang</span>
                        </v-tooltip>
                        <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">WT:</span>
                    </template>

                    <template v-slot:label>
                        <span class="body-2">Kilograms</span>
                    </template>

                    <template v-slot:append-outer>
                        <span class="text--darken-1 grey--text pt-1">KG</span>
                    </template>
                </v-text-field>
            </v-col>

            <template v-if="patient_age <= 2"> 
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
            </template>

            <template v-else> 
                <v-col cols="12" sm="6" md="6" lg="3">
                    <label class="font-weight-medium body-2">BMI: <span class="font-weight-medium pl-1">{{ bmi_computation.bmi }}</span></label>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3">
                    <label class="font-weight-medium body-2">Remarks: <span class="font-weight-medium pl-1">{{ bmi_computation.remarks }}</span></label>
                </v-col>
            </template>
        </v-row>

        <v-row v-if="patient_age <= 2" class="my-2" dense>
            <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="mt-4">
                <v-text-field :value="head_circle" @input="$emit('validatePEFields', 'head_circle', $event); $emit('update:head_circle', $event)" v-on:keypress="$emit('numberOnly', $event)" :error-messages="pe_validation.head_circle.err_msg" maxlength="4" class="body-2" onpaste="return false" dense>
                    <template v-slot:prepend>
                        <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1 text-no-wrap">Head Circle:</span>
                            </template>
                            <span class="font-weight-medium">Sukat ng ulo</span>
                        </v-tooltip>
                        <span v-else class="font-weight-medium grey--text text--darken-4 pt-1 text-no-wrap">Head Circle:</span>
                    </template>
                    
                    <template v-slot:label>
                        <span class="body-2">Centimeters</span>
                    </template>

                    <template v-slot:append-outer>
                        <span class="text--darken-1 grey--text pt-1">CM</span>
                    </template>
                </v-text-field>
            </v-col>
            
            <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="mt-4">
                <v-text-field :value="skin_for_thickness" @input="$emit('validatePEFields', 'skin_for_thickness', $event); $emit('update:skin_for_thickness', $event)" v-on:keypress="$emit('numberOnly', $event)" :error-messages="pe_validation.skin_for_thickness.err_msg" maxlength="4" class="body-2" onpaste="return false" dense>
                    <template v-slot:prepend>
                        <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1 text-no-wrap">Skin for thickness:</span>
                            </template>
                            <span class="font-weight-medium">Sukat ng kapal ng balat</span>
                        </v-tooltip>
                        <span v-else class="font-weight-medium grey--text text--darken-4 pt-1 text-no-wrap">Skin for thickness:</span>
                    </template>

                    <template v-slot:label>
                        <span class="body-2">Centimeters</span>
                    </template>

                    <template v-slot:append-outer>
                        <span class="text--darken-1 grey--text pt-1">CM</span>
                    </template>
                </v-text-field>
            </v-col> 

            <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="mt-4">
                <v-text-field :value="hip" @input="$emit('validatePEFields', 'hip', $event); $emit('update:hip', $event)" v-on:keypress="$emit('numberOnly', $event)" :error-messages="pe_validation.hip.err_msg" maxlength="4" class="body-2" onpaste="return false" dense>
                    <template v-slot:prepend>
                        <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">Hip:</span>
                            </template>
                            <span class="font-weight-medium">Sukat ng balakang</span>
                        </v-tooltip>
                        <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">Hip:</span>
                    </template>

                    <template v-slot:label>
                        <span class="body-2">Centimeters</span>
                    </template>

                    <template v-slot:append-outer>
                        <span class="text--darken-1 grey--text pt-1">CM</span>
                    </template>
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6" lg="6" xl="4" class="mt-4">
                <v-text-field :value="limbs" @input="$emit('validatePEFields', 'limbs', $event); $emit('update:limbs', $event)" v-on:keypress="$emit('numberOnly', $event)" :error-messages="pe_validation.limbs.err_msg" maxlength="4" class="body-2" onpaste="return false" dense>
                    <template v-slot:prepend>
                        <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1">Limbs:</span>
                            </template>
                            <span class="font-weight-medium">Sukat ng biyas</span>
                        </v-tooltip>
                        <span v-else class="font-weight-medium grey--text text--darken-4 pt-1">Limbs:</span>
                    </template>

                    <template v-slot:label>
                        <span class="body-2">Centimeters</span>
                    </template>

                    <template v-slot:append-outer>
                        <span class="text--darken-1 grey--text pt-1">CM</span>
                    </template>
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="12" lg="6" xl="4" class="mt-4">
                <v-text-field :value="mid_upper_arm_circle" @input="$emit('validatePEFields', 'mid_upper_arm_circle', $event); $emit('update:mid_upper_arm_circle', $event)" v-on:keypress="$emit('numberOnly', $event)" :error-messages="pe_validation.mid_upper_arm_circle.err_msg" maxlength="4" class="body-2" onpaste="return false" dense>
                <template v-slot:prepend>
                    <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                        <template v-slot:activator="{ on }">
                            <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1 text-no-wrap">Mid upper arm circle:</span>
                        </template>
                        <span class="font-weight-medium">Sukat ng Braso</span>
                    </v-tooltip>
                    <span v-else class="font-weight-medium grey--text text--darken-4 pt-1 text-no-wrap">Mid upper arm circle:</span>
                </template>

                <template v-slot:label>
                    <span class="body-2">Centimeters</span>
                </template>

                <template v-slot:append-outer>
                    <span class="text--darken-1 grey--text pt-1">CM</span>
                </template>
                </v-text-field>
            </v-col>
        </v-row>

        <v-row class="my-2" dense>
            <v-col cols="12" sm="6" md="6" lg="3">
                <v-row dense>
                    <v-col sm="6" md="6" lg="6">
                        <v-text-field :value="left_one" @input="$emit('validatePEFields', 'left_one', $event); $emit('update:left_one', $event)" @keypress="$emit('numberOnlyWithDeci', 'left_one', $event)" :error-messages="pe_validation.left_one.err_msg" maxlength="5" class="body-2" dense>
                            <template v-slot:prepend >
                                <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1 text-no-wrap">Left Vision:</span>
                                    </template>
                                    <span class="font-weight-medium">Grado sa kaliwang paningin</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1 text-no-wrap">Left Vision:</span>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col sm="6" md="6" lg="6">
                        <v-text-field :value="left_two" @input="$emit('validatePEFields', 'left_two', $event); $emit('update:left_two', $event)" @keypress="$emit('numberOnlyWithDeci', 'left_two', $event)" maxlength="5" :error-messages="pe_validation.left_two.err_msg" class="body-2" dense>
                            <template v-slot:prepend >
                                <span class="font-weight-medium grey--text text--darken-4 pt-1">/</span>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="12" sm="6" md="6" lg="3">
                <v-row dense>
                    <v-col sm="6" md="6" lg="6">
                        <v-text-field :value="right_one" @input="$emit('validatePEFields', 'right_one', $event); $emit('update:right_one', $event)" @keypress="$emit('numberOnlyWithDeci', 'right_one', $event)" maxlength="5" :error-messages="pe_validation.right_one.err_msg" class="body-2" dense>
                            <template v-slot:prepend>
                                <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 pt-1 text-no-wrap">Right Vision:</span>
                                    </template>
                                    <span class="font-weight-medium">Grado sa kanang paningin</span>
                                </v-tooltip>
                                <span v-else class="font-weight-medium grey--text text--darken-4 pt-1 text-no-wrap">Right Vision:</span>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col sm="6" md="6" lg="6">
                        <v-text-field :value="right_two" @input="$emit('validatePEFields', 'right_two', $event); $emit('update:right_two', $event)" @keypress="$emit('numberOnlyWithDeci', 'right_two', $event)" maxlength="5" :error-messages="pe_validation.right_two.err_msg" class="body-2" dense>
                            <template v-slot:prepend>
                                <span class="font-weight-medium grey--text text--darken-4 pt-1">/</span>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row class="my-2" dense>
            <v-col class="align-baseline d-flex" cols="12" sm="12" md="6" lg="6" xl="6">
                <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="font-weight-medium grey--text text--darken-4 body-2 pr-2">Waist Circumference:</span>
                    </template>
                    <span class="font-weight-medium">Sukat ng baywang</span>
                </v-tooltip>
                <span v-else class="font-weight-medium grey--text text--darken-4 body-2 pr-2">Waist Circumference:</span>

                <v-text-field :value="waist_circumference" @blur="$emit('emitData')" @input="$emit('validatePEFields', 'waist_circumference', $event); $emit('update:waist_circumference', $event)" @keypress="$emit('numberOnlyWithDeci', 'waist_circumference', $event)" maxlength="5" :error-messages="pe_validation.waist_circumference.err_msg" class="body-2" onpaste="return false" dense>
                    <template v-slot:label>
                        <span class="body-2">Centimeters</span>
                    </template>

                    <template v-slot:append-outer>
                        <span class="grey--text text--darken-1 pt-1">CM</span>
                    </template>
                </v-text-field>
            </v-col>

            <v-col class="align-center d-flex" cols="12" sm="12" md="6" lg="6" xl="6">
                 <v-tooltip v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" top>
                    <template v-slot:activator="{ on }">
                        <label v-on="on" class="font-weight-medium body-2 pr-2 grey--text text--darken-4">Central Adiposity:</label>
                    </template>
                    <span class="font-weight-medium">Labis na taba sa gitnang bahagi</span>
                </v-tooltip>
                <label v-else class="font-weight-medium body-2 pr-2 grey--text text--darken-4">Central Adiposity:</label>
                <v-radio-group :value="central_adiposity" @change="$emit('update:central_adiposity', $event)" class="ma-0" hide-details row>
                    <v-radio label="Yes" value="1">Yes</v-radio>
                    <v-radio label="No" value="0">No</v-radio>
                </v-radio-group>

                <v-btn v-if="emr_params.editable && central_adiposity" @click="central_adiposity = '', $emit('emitData')" class="ml-2" x-small>CLEAR</v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
export default {
    props : ['bp_empty_fields', 'bp_2nd_empty_fields', 'pex_empty_fields', 'hr_rr_temp_empty', 'bp_systolic', 'bp_diastolic',
     'bp_2nd_systolic', 'bp_2nd_diastolic', 'heart_rate', 'respiration_rate', 'temp', 'o2sat', 'height', 'weight', 'weight_for_age', 'height_for_age', 'weight_for_height', 'central_adiposity',
     'waist_circumference', 'hip', 'limbs', 'skin_for_thickness', 'mid_upper_arm_circle', 'head_circle', 'left_one', 'left_two', 'left_vision', 'right_one', 'right_two', 'right_vision',
     'pe_validation', 'patient_age', 'bmi_computation', 'emr_params'
    ]
}
</script>