<template>
    <v-card class="card-border pa-7 mt-4" outlined>
        <div class="pl-0 pl-sm-4">
            <v-row class="mt-2" align="center" dense>
                <v-col class="font-weight-medium body-2 grey--text text--darken-4" cols="12" sm="3" md="2" lg="2">Past Medical History <br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Nakalipas ng medikal)</span></v-col>

                <v-col cols="12" sm="9" md="10" lg="10">
                    <v-combobox v-model="selected_past_history" :disabled="from_migration" :error="past_medical_history_empty_field && (!selected_past_history || selected_past_history.length === 0)" :items="past_history_items" @change="addPastHistory"  @blur="emitData" class="body-2 pl-2 pl-sm-0" item-text="description" label="Pls. specify if there's any." deletable-chips hide-no-data hide-selected return-object multiple filled chips></v-combobox>
                </v-col>
            </v-row>

            <v-row v-if="!disabled_allergies" class="mt-2" align="baseline" dense>
                <v-col class="font-weight-medium body-2 grey--text text--darken-4" cols="12" sm="3" md="2" lg="2">Allergies <span v-if="!allergies" class="red--text"> *</span><br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Alerhiya)</span></v-col>

                <v-col cols="12" sm="9" md="10" lg="10">
                    <v-text-field v-model="allergies"  @keydown.enter.prevent @blur="emitData" @input="allergies = textCapitalize($event)" :error="allergies_rules && !allergies" :disabled="disabled_allergies || from_migration" class="body-2 pl-2 pl-sm-0" label="Pls. specify any allergies." dense></v-text-field>
                </v-col>
            </v-row>

            <v-row class="mt-3 mt-md-0" align="baseline" dense>
                <v-col class="font-weight-medium body-2 grey--text text--darken-4" cols="12" sm="3" md="2" lg="2">Previous Hospitalization <br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Nakaraang pagpapa-ospital)</span></v-col>

                <v-col cols="12" sm="9" md="10" lg="10" xl="10">
                    <v-row dense>
                        <v-col cols="12" sm="10" md="10" lg="11" xl="11">
                            <v-text-field v-model="previous_hospitalization_input " :disabled="from_migration" @blur="emitData" @input="previous_hospitalization_input  = textCapitalize($event)" class="body-2 pl-2 pl-sm-0" label="Pls. specify the hospital name if there's any," dense></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="1" md="1" lg="1" xl="1" class="px-xl-4 px-lg-3">
                            <v-btn @click="addHospitalizationSurgeries" :disabled="from_migration" color="primary" small ><v-icon>mdi-plus</v-icon>ADD</v-btn>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12">
                    <!-- Hospitalizations Display -->
                    <v-row v-for="(hospital, index) in show_all_hospitalizations ? previous_hospitalization : (previous_hospitalization || []).slice(0, 3)" class="mt-n7" justify="end" align="end" :key="index">
                        <v-col align-self="center" cols="6" sm="4" md="7" lg="7">{{ hospital.hospital }}</v-col>
                        <v-col cols="6" sm="4" md="2" lg="2">
                            <v-menu :close-on-content-click="false" :disabled="!emr_params.editable" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                <template v-slot:activator="{ on }">
                                    <!-- <v-text-field v-on="on" v-model="hospital.date" v-mask="birthdate_mask" @change="emitData" @blur="emitData" class="body-2 pl-2" prepend-icon="mdi-calendar" label="Date" placeholder="MM-DD-YYYY" readonly/> -->
                                    <v-text-field v-on="on" v-model="hospital.date" :disabled="from_migration" v-mask="birthdate_mask" @change="emitData" @blur="emitData" @click:append="previous_hospitalization.splice(index, 1)" class="body-2 pl-2" prepend-icon="mdi-calendar" append-icon="mdi-delete" label="Date" placeholder="MM-DD-YYYY" readonly />
                                </template>

                                <v-date-picker v-model="hospital.date" :min="patient_birthdate" :max="dateToday()" @change="hospital.date = formatDate(hospital.date); emitData()" no-title/>
                            </v-menu>
                        </v-col>

                        <!-- <v-col align-self="center" cols="6" sm="4" md="1" lg="1" xl="1">
                            <v-icon @click="previous_hospitalization.splice(index, 1);">mdi-delete</v-icon>
                        </v-col> -->
                    </v-row>

                    <v-row align="center" justify="center" dense>
                        <v-btn v-if="previous_hospitalization.length > 3" @click="show_all_hospitalizations = !show_all_hospitalizations" text small >{{ show_all_hospitalizations ? 'SEE LESS' : 'SEE MORE' }}</v-btn>
                    </v-row>
                </v-col>
            </v-row>

            <!-- <v-row align="baseline" dense>
                <v-col class="font-weight-medium body-2 grey--text text--darken-4" cols="12" sm="3" md="2" lg="2">Previous Surgeries <br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Nakaraang operasyon)</span></v-col>

                <v-col cols="12" sm="4" md="4" lg="5" xl="6">
                    <v-text-field v-model="previous_surgeries_input " @blur="emitData" @input="previous_surgeries_input  = textCapitalize($event)" class="body-2 pl-2 pl-sm-0" label="Pls. specify if there's any." dense></v-text-field>
                </v-col>

                <v-col cols="12" sm="2" md="2" lg="2">
                    <v-menu :close-on-content-click="false" :disabled="!emr_params.editable" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="previous_surgeries_date" v-mask="birthdate_mask" :clearable="emr_params.editable" @click:clear="previous_surgeries_date = ''" @change="emitData()" @blur="emitData()" class="body-2 pl-2" prepend-icon="mdi-calendar" label="Date" placeholder="MM-DD-YYYY"></v-text-field>
                        </template>
                            <v-date-picker v-model="previous_surgeries_date_picker" :min="patient_birthdate" :max="dateToday()" @change="previous_surgeries_date = formatDate(previous_surgeries_date_picker); emitData()" no-title></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" sm="2" md="2" lg="2">
                    <v-btn @click="addHospitalizationSurgeries" color="primary" small ><v-icon>mdi-plus</v-icon>ADD</v-btn>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12">
                    <v-row v-for="(surgery, index) in show_all_surgeries ? previous_surgeries : (previous_surgeries || []).slice(0, 3)" class="mt-3 mt-md-0" justify="end" align="end" :key="index" dense>
                        <v-col cols="6" sm="5" md="7" lg="7">{{ surgery.surgery }}</v-col>
                        <v-col cols="6" sm="4" md="3" lg="3">{{ surgery.date }}</v-col>
                    </v-row>

                    <v-row align="center" justify="center" dense>
                        <v-btn v-if="previous_surgeries.length > 3" @click="show_all_surgeries = !show_all_surgeries" text small>{{ show_all_surgeries ? 'SEE LESS' : 'SEE MORE' }}</v-btn>
                    </v-row>
                </v-col>
            </v-row> -->

            <v-row align="baseline" dense>
                <v-col class="font-weight-medium body-2 grey--text text--darken-4" cols="12" sm="3" md="2" lg="2">Previous Surgeries <br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Nakaraang operasyon)</span></v-col>

                <v-col cols="12" sm="9" md="10" lg="10" xl="10">
                    <v-row dense>
                        <v-col cols="12" sm="10" md="10" lg="11" xl="11">
                            <v-text-field v-model="previous_surgeries_input " :disabled="from_migration" @blur="emitData" @input="previous_surgeries_input  = textCapitalize($event)" class="body-2 pl-2 pl-sm-0" label="Pls. specify if there's any." dense></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="1" md="1" lg="1" xl="1" class="px-xl-4 px-lg-3">
                            <v-btn @click="addHospitalizationSurgeries" :disabled="from_migration" color="primary" small ><v-icon>mdi-plus</v-icon>ADD</v-btn>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12">
                    <!-- Surgeries Display -->
                    <v-row v-for="(surgery, index) in show_all_surgeries ? previous_surgeries : (previous_surgeries || []).slice(0, 3)" class="mt-n7" justify="end" align="end" :key="index">
                        <v-col align-self="center" cols="6" sm="4" md="7" lg="7">{{ surgery.surgery }}</v-col>
                        <v-col cols="6" sm="4" md="2" lg="2" xl="2">
                            <v-menu :close-on-content-click="false" :disabled="!emr_params.editable" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                <template v-slot:activator="{ on }">
                                    <!-- <v-text-field v-on="on" v-model="surgery.date" v-mask="birthdate_mask" @change="emitData" @blur="emitData" class="body-2 pl-2" prepend-icon="mdi-calendar" label="Date" placeholder="MM-DD-YYYY" readonly/> -->
                                    <v-text-field v-on="on" v-model="surgery.date" :disabled="from_migration" v-mask="birthdate_mask" @change="emitData" @blur="emitData" @click:append="previous_surgeries.splice(index, 1)" class="body-2 pl-2" prepend-icon="mdi-calendar" append-icon="mdi-delete" label="Date" placeholder="MM-DD-YYYY" readonly />
                                </template>

                                <v-date-picker v-model="surgery.date" :min="patient_birthdate" :max="dateToday()" @change="surgery.date = formatDate(surgery.date); emitData()" no-title/>
                            </v-menu>
                        </v-col>

                        <!-- <v-col align-self="center" cols="6" sm="4" md="1" lg="1" xl="1">
                            <v-icon @click="previous_surgeries.splice(index, 1);">mdi-delete</v-icon>
                        </v-col> -->
                    </v-row>

                    <v-row align="center" justify="center" dense>
                        <v-btn v-if="previous_surgeries.length > 3" @click="show_all_surgeries = !show_all_surgeries" text small>{{ show_all_surgeries ? 'SEE LESS' : 'SEE MORE' }}</v-btn>
                    </v-row>
                </v-col>
            </v-row>

            <v-row class="mb-6" align="baseline" dense>
                <v-col class="font-weight-medium body-2 grey--text text--darken-4" cols="12" sm="3" md="2" lg="2">Current Medicine <br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Kasalukuyang medisina)</span></v-col>

                <v-col cols="12" sm="9" md="10" lg="10">
                    <v-autocomplete v-model="selected_medicine_holder" :items="medicine_items" :disabled="from_migration" :loading="loading_medicine" @change="selected_medicine_holder = {}" class="body-2 pl-2 pl-sm-0" item-text="generic_name_text" label="Pls. specify if there's any." return-object hide-no-data hide-selected hide-details>
                        <template v-slot:item="{ item }">
                            <v-layout @click="addCurrentMedicine(item)">
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
                                    <v-col cols="12" sm="12" md="12" lg="12">
                                        <v-divider class="mt-4"></v-divider>
                                    </v-col>
                                </v-row>
                            </v-layout>
                        </template>
                        <template v-slot:selection></template>
                    </v-autocomplete>

                    <div v-if="selected_medicine.length > 0" :class="{'table-overflow-x' : $vuetify.breakpoint.mdAndDown}">
                        <table id="table" class="my-4" cellspacing="0" cellpadding="0">
                             <tr>
                                <th class="font-weight-medium body-2 grey--text text--darken-4">Generic Name</th>
                                <!-- <th class="font-weight-medium body-2 grey--text text--darken-4">Dosage</th>
                                <th class="font-weight-medium body-2 grey--text text--darken-4">Preparation</th>
                                <th class="font-weight-medium body-2 grey--text text--darken-4">Route</th> -->
                                <th class="font-weight-medium body-2 grey--text text--darken-4">Duration <br/> # of days</th>
                                <th class="font-weight-medium body-2 grey--text text--darken-4">Frequency <br/> # of (per day)</th>
                                <th class="font-weight-medium body-2 grey--text text--darken-4">Prescription <br/>  Date</th>
                            </tr>
                            <tr v-for="(med, i) in selected_medicine" :key="i">
                                <td style="width: 25%">
                                    <v-text-field v-model="med.generic_name" :disabled="from_migration" class="body-2" hide-details readonly></v-text-field>
                                </td> 
                                <!-- <td style="width: 15%">
                                    <v-text-field v-model="med.dosage" @input="emitData()" :readonly="$store.state.usr_credentials.department !== 'Doctor' && $store.state.usr_credentials.department !== 'Midwife'" class="body-2" hide-details></v-text-field>
                                </td>
                                <td style="width: 15%">
                                    <v-text-field v-model="med.preparation" @input="emitData()" :readonly="$store.state.usr_credentials.department !== 'Doctor' && $store.state.usr_credentials.department !== 'Midwife'" class="body-2" hide-details></v-text-field>
                                </td>
                                <td style="width: 15%">
                                    <v-text-field  v-model="med.route" @input="emitData()" :readonly="$store.state.usr_credentials.department !== 'Doctor' && $store.state.usr_credentials.department !== 'Midwife'" class="body-2" hide-details></v-text-field>
                                </td> -->
                                <td style="width: 8%">
                                    <v-text-field v-model="med.duration" :disabled="from_migration" @input="emitData()" :readonly="$store.state.usr_credentials.department !== 'Doctor' && $store.state.usr_credentials.department !== 'Midwife'" class="body-2" hide-details></v-text-field>
                                </td>
                                <td style="width: 8%">
                                    <v-text-field v-model="med.frequency_of_med" :disabled="from_migration" @input="emitData()" :readonly="$store.state.usr_credentials.department !== 'Doctor' && $store.state.usr_credentials.department !== 'Midwife'" class="body-2" hide-details></v-text-field>
                                </td>
                                <td style="width: 15%">
                                    <v-text-field :value="formatDate(med.prescribed_date)" @input="emitData()" class="body-2" hide-details :disabled="($store.state.usr_credentials.department !== 'Doctor' && $store.state.usr_credentials.department !== 'Midwife') || (from_migration)">
                                        <template v-if="emr_params.editable" v-slot:append-outer>
                                            <v-icon v-if="med.table_name !== 'emr'" :disabled="loading_medicine || from_migration" @click="removeCurrentMedicine(i)">mdi-delete</v-icon>
                                        </template>
                                    </v-text-field>
                                </td>
                            </tr>
                        </table>
                    </div>
                </v-col>
            </v-row>
            
            <v-row class="body-2" align="baseline" dense>
                <v-col class="font-weight-medium" cols="12" sm="3" md="2" lg="2">Family Medical History <br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Mga sakit na namana <br> sa magulang)</span></v-col>

                <v-col cols="12" sm="9" md="10" lg="10">
                    <v-autocomplete v-model="selected_family_history_holder" :items="family_history_items" :disabled="from_migration" @change="addFamilyHistory" item-text="description" label="Pls. specify if there's any." return-object dense></v-autocomplete>

                    <v-row v-if="selected_family_history.length > 0" class="font-weight-medium body-2 grey--text text--darken-4" dense>
                        <v-col cols="12" sm="6" md="2" lg="2">Disease<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Sakit)</span></v-col>
                        <v-col cols="12" sm="6" md="3" lg="3">Classification<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pag-uuri)</span></v-col>
                    </v-row>

                    <v-row v-for="(value, index) in selected_family_history" :key="index" align="end" dense >
                        <v-col cols="12" sm="6" md="2" lg="2">{{ index + 1 }}. {{ value.description }}</v-col>
                        <v-col cols="12" sm="6" md="auto" lg="auto">
                            <v-radio-group v-model="value.classification" :disabled="from_migration" v-if="value.description !== 'NONE'" @change="emitData" class="ma-0 pa-0" hide-details row>
                                <v-radio label="Paternal" value="Paternal"></v-radio>
                                <v-radio label="Maternal" value="Maternal"></v-radio>
                                <v-radio label="Both" value="Both"></v-radio>
                            </v-radio-group>
                        </v-col>

                        <v-col cols="auto">
                            <v-icon v-if="emr_params.editable" :disabled="from_migration" @click="removeFamilyHistory(index)">mdi-delete</v-icon>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <v-row v-if="!disabled_family_allergies" class="mt-4" align="baseline" dense>
                <v-col class="font-weight-medium body-2 grey--text text--darken-4" cols="12" sm="3" md="2" lg="2">Family Allergies <span v-if="!family_allergies" class="red--text"> *</span><br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Alerhiya)</span></v-col>

                <v-col cols="12" sm="9" md="10" lg="10">
                    <v-text-field v-model="family_allergies" @keydown.enter.prevent @blur="emitData" @input="family_allergies = textCapitalize($event)"  :disabled="disabled_family_allergies || from_migration" :error="family_allergies_rules && !family_allergies" class="body-2 pl-2 pl-sm-0"  label="Pls. specify any allergies." dense></v-text-field>
                </v-col>
            </v-row>
            
            <h6 class="font-weight-medium body-2 grey--text text--darken-4 mt-8">Personal / Social History <span v-if="eligible_data.konsulta_eligible" class="red--text"> *</span> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Personal/Historya ng pakikihalubilo)</span> :</h6>

            <v-row class="pl-4" align="baseline" dense>
                <v-col class="d-flex" cols="12" md="6" lg="3">
                    <v-radio-group v-model="smoker.social_history" :disabled="from_migration" :error="social_history_empty_field && !smoker.social_history" @change="smoker.years_of_smoked = '', validateSocialHistory()" class="ma-0 pa-0" hide-details>
                        <v-radio label="Non-smoker" value="NON-SMOKER"></v-radio>
                    </v-radio-group>

                    <v-btn v-if="emr_params.editable && smoker.social_history" :disabled="from_migration" @click="clearSmoking" class="ml-5" x-small>CLEAR</v-btn>
                </v-col>

                <v-col class="d-flex" cols="12" md="6" lg="3">
                    <v-radio-group v-model="smoker.social_history" :disabled="from_migration" :error="social_history_empty_field && !smoker.social_history" @change="smoker.year_stopped_in_smoking = '', validateSocialHistory()" hide-details>
                        <v-radio label="Smoker" value="SMOKER"></v-radio>
                    </v-radio-group>

                    <v-text-field v-model="smoker.years_of_smoked" :v-on:keypress="numberOnly" :error="social_history_empty_field && !smoker.social_history" :readonly="smoker.social_history === 'NON-SMOKER'" :disabled="smoker.social_history !== 'SMOKER' || from_migration" @blur="validateSocialHistory" class="body-2 mt-5 px-4" label="Pack-years" onpaste="return false" hide-details dense></v-text-field>
                </v-col>

                <v-col class="d-flex" cols="12" md="6" lg="3">
                    <v-radio-group v-model="smoker.social_history" @change="validateSocialHistory()" hide-details>
                        <v-radio label="Vape" value="VAPE"></v-radio>
                    </v-radio-group>

                    <v-select v-model="smoker.vape_type" :items="vape_types" :disabled="smoker.social_history !== 'VAPE' || from_migration" @change="validateSocialHistory()" class="body-2 mt-5 px-4" label="Select Vape Type"  hide-details dense
                    ></v-select>
                </v-col>

                <v-col cols="12"></v-col>

                <v-col class="d-flex" cols="12" md="6" lg="3">
                    <v-radio-group v-model="smoker.year_stopped_in_smoking" :disabled="smoker.social_history !== 'NON-SMOKER' || from_migration" @change="validateSocialHistory()" class="ma-0 pa-0" hide-details>
                        <v-radio label="Stopped < a year" value="STOPPED < A YEAR"></v-radio>
                    </v-radio-group>
                </v-col>

                <v-col class="d-flex" cols="12" md="6" lg="3">
                    <v-radio-group v-model="smoker.year_stopped_in_smoking" :disabled="smoker.social_history !== 'NON-SMOKER' || from_migration" @change="validateSocialHistory()" class="ma-0 pa-0" hide-details>
                        <v-radio label="Stopped > a year" value="STOPPED > A YEAR"></v-radio>
                    </v-radio-group>
                </v-col>

                <v-col cols="12">
                    <v-divider class="my-4"></v-divider>
                </v-col>

                <v-col class="d-flex" cols="12" md="6" lg="3">
                    <v-radio-group v-model="alcoholic.social_history" :disabled="from_migration"  :error="social_history_empty_field && !alcoholic.social_history" @change="alcoholic.alcohol_consumed_in_5_months = '', validateSocialHistory()" class="ma-0 pa-0" hide-details>
                        <v-radio label="Non-Alcohol Drinker" value="NON-ALCOHOLIC"></v-radio>
                    </v-radio-group>

                    <v-btn v-if="emr_params.editable && alcoholic.social_history" :disabled="from_migration" @click="alcoholic.social_history = '', alcoholic.alcohol_consumed_in_5_months = '', alcoholic.number_of_bottles = '', validateSocialHistory()" class="ml-5" x-small>CLEAR</v-btn>
                </v-col>

                <v-col cols="12" md="6" lg="3">
                    <v-radio-group v-model="alcoholic.social_history" :disabled="from_migration" :error="social_history_empty_field && !alcoholic.social_history" @change="alcoholic.number_of_bottles = '',validateSocialHistory()" class="ma-0 pa-0" hide-details>
                        <v-radio label="Alcohol Drinker" value="ALCOHOLIC"></v-radio>
                    </v-radio-group>
                </v-col>

                <v-col cols="12" md="6" lg="3">
                    <v-radio-group v-model="alcoholic.social_history" :disabled="from_migration" :error="social_history_empty_field && !alcoholic.social_history" @change="alcoholic.number_of_bottles = '',validateSocialHistory()" class="ma-0 pa-0" hide-details>
                        <v-radio label="Occasional Alcohol Drinker" value="OCCASIONAL ALCOHOLIC"></v-radio>
                    </v-radio-group>
                </v-col>

                <v-col class="d-flex align-baseline" cols="12" sm="12" md="12" lg="12">
                    <h5  :class="{'text--secondary' : !alcoholic.social_history || alcoholic.social_history === 'NON-ALCOHOLIC'}" class="body-2">Number of bottles:</h5>
                    <v-text-field v-model="alcoholic.number_of_bottles"  v-on:keypress="numberOnly" :error="social_history_empty_field && !alcoholic.social_history" :disabled="!alcoholic.social_history || alcoholic.social_history === 'NON-ALCOHOLIC' || from_migration" @blur="validateSocialHistory" class="body-2 px-2" onpaste="return false" style="max-width: 80px;" hide-details dense></v-text-field>
                </v-col>

                <v-col class="d-flex align-baseline" cols="12" sm="12" md="12" lg="12">
                    <h5 :class="{'text--secondary' : !alcoholic.social_history || alcoholic.social_history === 'NON-ALCOHOLIC'}" class="body-2">How many alcohol consumed on occasions in the past 5 months?</h5>
                    <v-text-field v-model="alcoholic.alcohol_consumed_in_5_months" v-on:keypress="numberOnly" :error="social_history_empty_field && !alcoholic.social_history" :disabled="!alcoholic.social_history || alcoholic.social_history === 'NON-ALCOHOLIC' || from_migration" @blur="validateSocialHistory" class="body-2 px-2" onpaste="return false" style="max-width: 80px;" hide-details dense></v-text-field>
                </v-col>


                <v-col cols="12">
                    <v-divider class="my-4"></v-divider>
                </v-col>

                <v-col class="d-flex" cols="12" md="3">
                    <v-radio-group v-model="illicit_drug_user.social_history" :disabled="from_migration" :error="social_history_empty_field && !illicit_drug_user.social_history" @change="validateSocialHistory" class="ma-0 pa-0" hide-details>
                        <v-radio label="Non-illicit Drug User" value="NON-ILLICIT DRUG USER"></v-radio>
                    </v-radio-group>

                    <v-btn v-if="emr_params.editable && illicit_drug_user.social_history" :disabled="from_migration" @click="illicit_drug_user.social_history = '', validateSocialHistory()" class="ml-5" x-small>CLEAR</v-btn>
                </v-col>

                <v-col cols="12" md="3">
                    <v-radio-group v-model="illicit_drug_user.social_history" :disabled="from_migration"  :error="social_history_empty_field && !illicit_drug_user.social_history" @change="validateSocialHistory" class="ma-0 pa-0" hide-details>
                        <v-radio label="Illicit Drug User" value="ILLICIT DRUG USER"></v-radio>
                    </v-radio-group>
                </v-col>

                <v-col cols="12">
                    <v-divider class="my-4"></v-divider>
                </v-col>

                <v-col class="d-flex" cols="12" md="3">
                    <v-radio-group v-model="sexually_active.social_history" :disabled="from_migration" :error="social_history_empty_field && !sexually_active.social_history" @change="validateSocialHistory" class="ma-0 pa-0" hide-details>
                        <v-radio label="Not Sexually Active" value="NOT SEXUALLY ACTIVE"></v-radio>
                    </v-radio-group>

                    <v-btn v-if="emr_params.editable && sexually_active.social_history" :disabled="from_migration" @click="sexually_active.social_history = '', validateSocialHistory()" class="ml-5" x-small>CLEAR</v-btn>
                </v-col>

                <v-col cols="12" md="3">
                    <v-radio-group v-model="sexually_active.social_history" :disabled="from_migration" :error="social_history_empty_field && !sexually_active.social_history" @change="validateSocialHistory" class="ma-0 pa-0" hide-details>
                        <v-radio label="Sexually Active" value="SEXUALLY ACTIVE"></v-radio>
                    </v-radio-group>
                </v-col>

                <v-col cols="12">
                    <v-divider class="mt-4"></v-divider>
                </v-col>

                <v-col class="d-flex d-row mb-2" cols="12" md="11">
                    <v-checkbox v-model="personal_others.chk" :disabled="from_migration" @change="personal_others.social_history = '', validateSocialHistory()" label="Others:" hide-details></v-checkbox>
                    <v-text-field v-model="personal_others.social_history" :disabled="from_migration" :readonly="!personal_others.chk" @blur="validateSocialHistory" @input="personal_others.social_history = textCapitalize($event)" class="body-2 pl-2" hide-details></v-text-field>
                </v-col>
            </v-row>
        </div>

        <v-dialog v-if="others.dialog" v-model="others.dialog" width="400" persistent>
            <v-card class="pa-5">
                <h6 class="font-weight-regular body-2">Current: {{ others.current }}</h6>
                <v-divider class="my-2"></v-divider>
                <h6 class="font-weight-regular body-2">Others</h6>
                <v-text-field v-model="others.new" :disabled="from_migration" @input="others.new = textCapitalize($event)" placeholder="Enter the other medical history here" hide-details outlined></v-text-field>

                <v-layout justify-end wrap mt-4>
                    <v-btn @click="closeOtherDialog" small>CLOSE</v-btn>
                    <v-btn @click="saveOthers" :disabled="!others.new" class="ml-2" color="primary" small>CONFIRM</v-btn>
                </v-layout>
            </v-card>
        </v-dialog>

        <v-dialog v-if="other_med.dialog" v-model="other_med.dialog" width="400" persistent>
            <v-card class="pa-5">
                <h6 class="font-weight-regular body-2">Others</h6>
                <v-text-field v-model="other_med.generic_name" :disabled="from_migration" placeholder="Enter other medicine here" hide-details outlined></v-text-field>

                <v-layout justify-end wrap mt-4>
                    <v-btn @click="other_med.dialog = false" small>CLOSE</v-btn>
                    <v-btn @click="saveOthersMed" :disabled="!other_med.generic_name" class="ml-2" color="primary" small>CONFIRM</v-btn>
                </v-layout>
            </v-card>
        </v-dialog>

        <Alert :alert="alert" />
    </v-card>
</template>

<script>
import Alert from '@/components/Alert.vue'
import { mask } from "vue-the-mask"
import { mdisease_list } from '@/reference/medical-history-mdisease.json'
export default{
    directives: { mask },
    props: ['emr_params', 'loading_medicine', 'medicine_list','social_history_empty_field', 'patient_birthdate', 'eligible_data', 'past_medical_history_empty_field','from_migration'],

    components: {
        Alert
    },

    data() {
        return {
            mdisease_list,
            selected_past_history: [],
            previous_hospitalization: [],
            previous_hospitalization_input: '',
            previous_hospitalization_date: '',
            previous_hospitalization_date_picker: '',

            previous_surgeries: [],
            previous_surgeries_input: '',
            previous_surgeries_date: '',
            previous_surgeries_date_picker: '',

            show_all_hospitalizations: false,
            show_all_surgeries: false,
            
            birthdate_mask: '##-##-####',
            allergies: '',
            family_allergies: '',
            selected_medicine: [],
            selected_medicine_holder: {},
            selected_family_history: [],
            selected_family_history_holder: {},
            others: {
                dialog: false,
                current: '',
                new: '',
                section: ''
            },
            patient_social_history: [],
            smoker: {
                year_stopped_in_smoking: '',
                years_of_smoked: '',
                social_history: '',
                vape_type: ''
            },
            alcoholic: {
                alcohol_consumed_in_5_months: '',
                social_history: '',
                number_of_bottles: '',
            },
            illicit_drug_user: {
                social_history: ''
            },
            sexually_active: {
                social_history: ''
            },
            personal_others: {
                chk: '',
                social_history: ''
            },

            medical_previous_record: false,
            family_previous_record: false,
            medicine_previous_record: false,
            social_previous_record: false,
            alert: {},

            other_med: {
                dialog: false,
                generic_name: '',
                others_drug_code: ''
            },
            other_item: ['NCD', 'ANTIBIOTIC', 'OTHER'],
            select_other_med: '',
            current_medical_history: sessionStorage.getItem('49GkdoSQN') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('49GkdoSQN'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true
            },

            disabled_allergies: true,
            disabled_family_allergies: true,
            vape_type: '',
            vape_types: [
                'POD VAPES',
                'STARTER KITS',
                'VAPE PENS',
                'MTL VAPE',
                'SUB-OHM VAPE',
                'DISPOSABLE VAPE'
            ]
        }
    },

    mounted() {
        this.getMedicalHistory();
    },

    watch: {
        selected_past_history(value) {
            /*if (value.some(item => item.description === 'Allergy')) {
                this.disabled_allergies = !this.disabled_allergies;
            }*/

            // Check if 'Allergy' is in the selected items
            let has_allergy = value.some(item => item.description === 'ALLERGY');
            
            this.disabled_allergies = !has_allergy;

            if (!has_allergy) {
                this.allergies = '';
            }
        },

        selected_family_history: {
            deep: true,
            handler(value) {
                let has_family_allergy = value.some(item => item.description === 'ALLERGY');
                this.disabled_family_allergies = !has_family_allergy;

                if (!has_family_allergy) {
                    this.family_allergies = '';
                }
            }
        }
    },

    computed: {
        medicine_items(){
            const filter = this.selected_medicine.map(element => element.generic_name_text)
            const result = this.medicine_list.filter(element => !filter.includes(element.generic_name_text))
            return result
        },

        past_history_items() {
            // const filter = this.selected_past_history.map(element => element.description)
            // const result = this.mdisease_list.filter(element => !filter.includes(element.description))
            // return result
            const filter = this.selected_past_history.map(element => element.description)
            let result = this.mdisease_list.filter(element => !filter.includes(element.description))

            if (this.eligible_data.eclaims_eligible) {
                result = result.filter(element => element.description.toUpperCase() !== "NONE")
            }

            return result
        },

        family_history_items() {
            const filter = this.selected_family_history.map(element => element.description)
            const result = this.mdisease_list.filter(element => !filter.includes(element.description))
            return result
        },

        allergies_rules() {
            let has_allergy_in_past_history = this.selected_past_history.some(item => item.description === 'ALLERGY');
            
            //return (has_allergy_in_past_history || has_allergy_in_family_history) ? [(v) => !!v || 'This field is required'] : [];
            return ('return',has_allergy_in_past_history && !this.allergies);
        },

        family_allergies_rules() {
            let has_allergy_in_family_history = this.selected_family_history.some(item => item.description === 'ALLERGY');

            //return (has_allergy_in_past_history || has_allergy_in_family_history) ? [(v) => !!v || 'This field is required'] : [];
            return (has_allergy_in_family_history && !this.family_allergies);
        }
    },

    methods: {
        uppercase() {
            this.code = this.code.toUpperCase();
        },

        addHospitalizationSurgeries() {
            if (!this.previous_hospitalization) this.previous_hospitalization = [];
            if (!this.previous_surgeries) this.previous_surgeries = [];

            if (this.previous_hospitalization_input) {
                this.previous_hospitalization.push({
                    hospital: this.previous_hospitalization_input,
                    date: this.previous_hospitalization_date || 'N/A',
                });
                this.previous_hospitalization_input = '';
                this.previous_hospitalization_date = '';
            }

            if (this.previous_surgeries_input) {
                this.previous_surgeries.push({
                    surgery: this.previous_surgeries_input,
                    date: this.previous_surgeries_date || 'N/A',
                });
                this.previous_surgeries_input = '';
                this.previous_surgeries_date = '';
            }
        },

        async getMedicalHistory() {
            // Restore cached medical history from sessionStorage
            const cache = sessionStorage.getItem('49GkdoSQN')
            if (cache) {
                const med_his_cache = JSON.parse(
                    this.$crypto.AES.decrypt(cache, 'EMX246').toString(this.$crypto.enc.Utf8)
                )

                this.selected_past_history = med_his_cache.past_medical_history || []
                this.previous_hospitalization = med_his_cache.previous_hospitalization || []
                this.previous_hospitalization_date = med_his_cache.previous_hospitalization_date
                this.previous_surgeries = med_his_cache.previous_surgeries || []
                this.previous_surgeries_date = med_his_cache.previous_surgeries_date
                this.allergies = med_his_cache.allergies || ''
                this.family_allergies = med_his_cache.family_allergies || ''

                this.selected_medicine = med_his_cache.current_medicine || []
                this.selected_family_history = med_his_cache.family_medical_history || []
                this.patient_social_history = med_his_cache.patient_social_history || []

                this.medical_previous_record = med_his_cache.medical_prev_record
                this.medicine_previous_record = med_his_cache.medicine_prev_record
                this.family_previous_record = med_his_cache.family_prev_record
                this.social_previous_record = med_his_cache.social_prev_record

                this.current_medical_history.fresh_load = false
                this.smoker = {}
                this.alcoholic = {}
                this.illicit_drug_user = {}
                this.sexually_active = {}
                this.personal_others = { chk: false }

                this.patient_social_history.forEach(element => {
                    if (
                        element.social_history === 'SMOKER' ||
                        element.social_history === 'NON-SMOKER' ||
                        element.social_history === 'VAPE' ||
                        element.social_history === 'STOPPED < A YEAR' ||
                        element.social_history === 'STOPPED > A YEAR'
                    ) {
                        this.smoker.social_history = element.social_history
                        this.smoker.years_of_smoked = element.years_of_smoked
                        this.smoker.year_stopped_in_smoking = element.year_stopped_in_smoking
                        this.smoker.vape_type = element.vape_type

                    } else if (
                        element.social_history === 'ALCOHOLIC' ||
                        element.social_history === 'OCCASIONAL ALCOHOLIC' ||
                        element.social_history === 'NON-ALCOHOLIC'
                    ) {
                        this.alcoholic.social_history = element.social_history
                        this.alcoholic.number_of_bottles = element.number_of_bottles || ''
                        this.alcoholic.alcohol_consumed_in_5_months =
                        element.alcohol_consumed_in_5_months || ''

                    } else if (
                        element.social_history === 'ILLICIT DRUG USER' ||
                        element.social_history === 'NON-ILLICIT DRUG USER'
                    ) {
                        this.illicit_drug_user.social_history = element.social_history

                    } else if (
                        element.social_history === 'SEXUALLY ACTIVE' ||
                        element.social_history === 'NOT SEXUALLY ACTIVE'
                    ) {
                        this.sexually_active.social_history = element.social_history

                    } else {
                        this.personal_others.chk = true
                        this.personal_others.social_history = element.social_history
                        ? element.social_history.slice(9)
                        : ''
                    }
                })


                this.loadingComplete()
                return
            }
            
            if (this.current_medical_history.fresh_load) {
                let response = await this.$services.getPatientMedicalHistory({
                    hmo_policy_number: this.emr_params.hmo_policy_number,
                    hmo_host_code: this.emr_params.hmo_host_code,
                    ek_lgu_id: this.emr_params.ek_lgu_id,
                    lgu_host_code: this.emr_params.lgu_host_code,
                    ek_phic_id: this.emr_params.ek_phic_id,
                    phic_host_code: this.emr_params.phic_host_code,
                    mem_phic_pin: this.emr_params.mem_phic_pin,
                    transaction: this.emr_params.routes !== 'TRANSACTION RECORD' ? 'current' :  'previous',
                    date_discharge: this.emr_params.date_discharged
                })

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
                    if(response.data.length !== 0) {
                        if (response.data.emr_medical_history.length !== 0) {
                            this.selected_past_history = response.data.emr_medical_history.past_medical_history.map(element => {
                                if (element.past_medical_history && element.past_medical_history.startsWith('OTHERS-')) {
                                    element.past_medical_history = 'OTHERS: ' + element.past_medical_history.substring(7);
                                }
                                return {
                                    code: element.mdisease_code,
                                    description: element.past_medical_history
                                };
                            });
                            
                            this.previous_hospitalization = response.data.emr_medical_history.previous_hospitalization.map(hospitalization => ({
                                hospital: hospitalization.hospital,
                                date: this.$moment(hospitalization.date, 'YYYY-MM-DD').isValid() ? this.$moment(hospitalization.date, 'YYYY-MM-DD').format('MM-DD-YYYY'): ''
                            }));

                            this.previous_surgeries = response.data.emr_medical_history.previous_surgeries.map(surgeries => ({
                                surgery: surgeries.surgery,
                                date: this.$moment(surgeries.date, 'YYYY-MM-DD').isValid() ? this.$moment(surgeries.date, 'YYYY-MM-DD').format('MM-DD-YYYY') : ''
                            }));

                            this.allergies = response.data.emr_medical_history.allergies
                            this.family_allergies = response.data.emr_medical_history.family_allergies
                        }
                    
                        this.selected_medicine = response.data.emr_current_medicine.map(element => {
                            return Object.assign(element, { 
                                generic_name_text: element.generic_name + element.brand_name + element.dosage 
                            })
                        })

                        this.selected_family_history = response.data.emr_family_medical_history
                        .filter(element => element.family_past_medical_history || element.family_history_classification)
                        .map(element => {
                            if (element.family_past_medical_history && element.family_past_medical_history.startsWith('OTHERS-')) {
                                element.family_past_medical_history = 'OTHERS: ' + element.family_past_medical_history.substring(7);
                            }
                            return {
                                code: element.mdisease_code,
                                description: element.family_past_medical_history,
                                classification: element.family_history_classification
                            };
                        });

                        this.patient_social_history = response.data.patient_social_history.length === 0 ? [] : response.data.patient_social_history
                        this.patient_social_history.forEach(element => {
                            if (element.social_history === 'SMOKER' || element.social_history === 'NON-SMOKER' || element.social_history === 'VAPE' || element.social_history === 'STOPPED < A YEAR' || element.social_history === 'STOPPED > A YEAR') {
                                this.smoker.social_history = element.social_history
                                this.smoker.years_of_smoked = element.years_of_smoked
                                this.smoker.year_stopped_in_smoking = element.year_stopped_in_smoking
                                this.smoker.vape_type = element.vape_type
                                
                            } else if (element.social_history === 'ALCOHOLIC' || element.social_history === 'OCCASIONAL ALCOHOLIC' || element.social_history === 'NON-ALCOHOLIC') {
                                this.alcoholic.social_history = element.social_history
                                this.alcoholic.number_of_bottles = element.number_of_bottles ? element.number_of_bottles : '';
                                this.alcoholic.alcohol_consumed_in_5_months = element.alcohol_consumed_in_5_months ? element.alcohol_consumed_in_5_months : '';

                            } else if (element.social_history === 'ILLICIT DRUG USER' || element.social_history === 'NON-ILLICIT DRUG USER') {
                                this.illicit_drug_user.social_history = element.social_history
    
                            } else if (element.social_history === 'SEXUALLY ACTIVE' || element.social_history === 'NOT SEXUALLY ACTIVE') {
                                this.sexually_active.social_history = element.social_history
    
                            } else {
                                this.personal_others.chk = true
                                this.personal_others.social_history = element.social_history ? element.social_history.slice(9) : ''
                            }
                        })

                        this.family_previous_record = response.data.emr_family_medical_history.length === 0 ? false : true
                        this.social_previous_record = response.data.patient_social_history.length === 0 ? false : true
                        this.medical_previous_record =  response.data.emr_medical_history.length === 0 ? false : true
                        this.medicine_previous_record = response.data.emr_current_medicine.length === 0 ? false : true
    
                        this.current_medical_history.fresh_load = false
                        this.current_medical_history.past_medical_history = this.selected_past_history
                        this.current_medical_history.previous_hospitalization = this.previous_hospitalization
                        this.current_medical_history.previous_hospitalization_date = this.$moment(this.previous_hospitalization_date, 'MM-DD-YYYY', true).isValid() ? this.$moment(this.previous_hospitalization_date, 'MM-DD-YYYY', true).format('YYYY-MM-DD') : null,
                        this.current_medical_history.previous_surgeries = this.previous_surgeries
                        this.current_medical_history.previous_surgeries_date = this.$moment(this.previous_surgeries_date, 'MM-DD-YYYY', true).isValid() ? this.$moment(this.previous_surgeries_date, 'MM-DD-YYYY', true).format('YYYY-MM-DD') : null,
                        this.current_medical_history.allergies = this.allergies
                        this.current_medical_history.family_allergies = this.family_allergies
                        this.current_medical_history.selected_medicine = this.selected_medicine
                        this.current_medical_history.family_medical_history = this.selected_family_history
                        this.current_medical_history.smoker = this.smoker
                        this.current_medical_history.alcoholic = this.alcoholic
                        this.current_medical_history.illicit_drug_user = this.illicit_drug_user
                        this.current_medical_history.sexually_active = this.sexually_active
                        this.current_medical_history.personal_others = this.personal_others
    
                        this.current_medical_history.family_previous_record = this.family_previous_record
                        this.current_medical_history.social_previous_record = this.social_previous_record
                        this.current_medical_history.medical_previous_record = this.medical_previous_record
                        this.current_medical_history.medicine_previous_record = this.medicine_previous_record
                        this.current_medical_history.patient_social_history = this.patient_social_history


                        sessionStorage.setItem('49GkdoSQN', this.$crypto.AES.encrypt(JSON.stringify(this.current_medical_history), 'EMX246'));
                        this.loadingComplete();
                    }
                } else {
                    this.alert = response.error
                }
            } else {
                this.selected_past_history = this.current_medical_history.past_medical_history
                this.previous_hospitalization = this.current_medical_history.previous_hospitalization
                this.previous_hospitalization_date = this.$moment(this.current_medical_history.previous_hospitalization_date, 'MM-DD-YYYY', true).isValid() ? this.$moment(this.current_medical_history.previous_hospitalization_date, 'MM-DD-YYYY', true).format('YYYY-MM-DD') : null,
                this.previous_surgeries = this.current_medical_history.previous_surgeries
                this.previous_surgeries_date = this.$moment(this.current_medical_history.previous_surgeries_date, 'MM-DD-YYYY', true).isValid() ? this.$moment(this.current_medical_history.previous_surgeries_date, 'MM-DD-YYYY', true).format('YYYY-MM-DD') : null,
                this.allergies = this.current_medical_history.allergies
                this.family_allergies = this.current_medical_history.family_allergies
                this.selected_medicine = this.current_medical_history.selected_medicine
                this.selected_family_history = this.current_medical_history.family_medical_history
                this.smoker = this.current_medical_history.smoker
                this.alcoholic = this.current_medical_history.alcoholic
                this.illicit_drug_user = this.current_medical_history.illicit_drug_user
                this.sexually_active = this.current_medical_history.sexually_active
                this.personal_others = this.current_medical_history.personal_others

                this.family_previous_record = this.current_medical_history.family_previous_record
                this.social_previous_record = this.current_medical_history.social_previous_record
                this.medical_previous_record = this.current_medical_history.medical_previous_record
                this.medicine_previous_record = this.current_medical_history.medicine_previous_record
                this.patient_social_history = this.current_medical_history.patient_social_history
                this.loadingComplete();   
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
                medicine_code : 'OTC-0000',
                preparation: '',
                route: '',
                other_drug_code: ''
            }
            this.other_med.dialog = false
            this.other_med.generic_name = ''
            this.selected_medicine.push(other_medicine)
        },

        loadingComplete() {
            if (this.$route.path.includes('admission')) {
                this.$emit('loadingComplete', '', {
                    past_medical_history: this.selected_past_history,
                    previous_hospitalization: this.previous_hospitalization,
                    previous_hospitalization_date: this.$moment(this.previous_hospitalization_date, 'MM-DD-YYYY', true).isValid() ? this.$moment(this.previous_hospitalization_date, 'MM-DD-YYYY', true).format('YYYY-MM-DD'): null,
                    previous_surgeries: this.previous_surgeries,
                    previous_surgeries_date: this.$moment(this.previous_surgeries_date, 'MM-DD-YYYY', true).isValid() ? this.$moment(this.previous_surgeries_date, 'MM-DD-YYYY', true).format('YYYY-MM-DD'): null,
                    allergies: this.allergies,
                    family_allergies: this.family_allergies,
                    current_medicine: this.selected_medicine,
                    family_medical_history: this.selected_family_history,
                    patient_social_history: this.patient_social_history,
                    medical_prev_record: this.medical_previous_record,
                    medicine_prev_record: this.medicine_previous_record,
                    family_prev_record: this.family_previous_record,
                    social_prev_record: this.social_previous_record
                })
            } else {
                this.$emit('loadingComplete', {
                    past_medical_history: this.selected_past_history,
                    family_medical_history: this.selected_family_history,
                    patient_social_history: this.patient_social_history
                })
            }
        },

        async postData() {
            const past_history = this.selected_past_history.map(element => {
                if (element.description.substring(0, 7) === 'OTHERS:') {
                    element.description = 'OTHERS-' + element.description.substring(8);
                }

                return {
                    mdisease_code: element.code,
                    past_medical_history: element.description
                };
            });
            
            const family_history = this.selected_family_history.map(element => {
                if (element.description.substring(0, 7) === 'OTHERS:') {
                    element.description = 'OTHERS-' + element.description.substring(8);
                }

                return {
                    mdisease_code: element.code,
                    family_past_medical_history: element.description,
                    family_history_classification: element.classification
                };
            });
            
            let response = await this.$services.trnUpdatePatientTranRecord({
                request_key: 'medical_history',
                hmo_policy_number: this.emr_params.hmo_policy_number,
                ek_phic_id: this.emr_params.ek_phic_id,
                ek_lgu_id: this.emr_params.ek_lgu_id,
                ek_hmo_id: this.emr_params.ek_hmo_id,
                phic_host_code: this.emr_params.phic_host_code,
                lgu_host_code: this.emr_params.lgu_host_code,
                mem_phic_pin: this.emr_params.mem_phic_pin,
                
                update_medicine: true,
                current_medicine: this.selected_medicine,
                patient_medical_history: { 
                    allergies: this.allergies,
                    past_medical_history: past_history,
                    previous_hospitalization: this.previous_hospitalization,
                    previous_hospitalization_date: this.previous_hospitalization_date ? this.$moment(this.previous_hospitalization_date, 'MM-DD-YYYY', true).format('YYYY-MM-DD') : null,
                    previous_surgeries: this.previous_surgeries,
                    previous_surgeries_date: this.previous_surgeries_date ? this.$moment(this.previous_surgeries_date, 'MM-DD-YYYY', true).format('YYYY-MM-DD') : null,
                },
                family_past_medical_history: {
                    history: family_history,
                    family_allergies: this.family_allergies
                },
                patient_social_history: this.patient_social_history,
                process_by: this.$store.state.usr_credentials.user_name,
            });

            if (response.status === 200) {
                sessionStorage.removeItem('49GkdoSQN');
                return true;
            } else {
                this.alert = response.alert;
            }
        },

        addCurrentMedicine(data) {
            if(data.otc_medicine_code === 'OTC-0000'){
                this.other_med.dialog = true
            } else {
                let medicine = {
                    brand_name: null,
                    table_name: 'cur',
                    ...data
                }

                this.selected_medicine.push(medicine)
                this.emitData();
            }
        },

        removeCurrentMedicine(index) {
            this.selected_medicine.splice(index, 1)
            this.emitData();
        },

        addPastHistory(data) {
            if (data) {
                const map = data.map(element => element.description);

                if (map.includes('OTHERS')) {
                    this.others.new = '';
                    this.others.current = '';

                    this.selected_past_history.forEach(element => {
                        if (element.description.startsWith('OTHERS:')) {
                            this.others.current = element.description.substring(8);
                        }
                    });

                    this.selected_past_history = this.selected_past_history.filter(element => element.description !== 'NONE');

                    this.others.section = 'selected_past_history';
                    this.others.dialog = true;
                } else {
                    //this.allergies = '';
                    //this.family_allergies = ''

                    // Ensure inputted entries are in the list
                    if (!this.past_history_items.some(element => data.description === element.description)) {
                        this.selected_past_history = this.selected_past_history.filter(element => element.description !== data.description);
                    }
                    
                    this.selected_family_history_holder = '';
                    this.emitData();
                }

                // Ensure 'None' entries are handled correctly
                if (this.selected_past_history.some(item => item.description === 'NONE')) {
                    this.selected_past_history = this.selected_past_history.filter(item => item.description === 'NONE');
                } else {
                    this.selected_past_history = this.selected_past_history.filter(item => item.description !== 'NONE');
                }
            }
        },

        addFamilyHistory(data) {
            if (data.description === 'OTHERS') {
                this.others.new = '';
                this.others.current = '';

                this.selected_family_history.forEach(element => {
                    if (element.description.startsWith('OTHERS:')) {
                        this.others.current = element.description.substring(8);
                    }
                });

                this.others.section = 'selected_family_history';
                this.others.dialog = true;
            } else {
                if (this.selected_family_history_holder.description === 'NONE') {
                    this.selected_family_history = [{
                        code: data.code,
                        description: data.description,
                        classification: ''
                    }];
                } else {
                    this.selected_family_history.push({
                        code: data.code,
                        description: data.description,
                        classification: ''
                    });
                }

                this.emitData();
            }

            // Ensure 'None' entries are handled correctly
            if (this.selected_family_history_holder.description === 'NONE') {
                this.disabled_family_allergies = false;
                this.selected_family_history = this.selected_family_history.filter(item => item.description === 'NONE');
            } else {
                this.selected_family_history = this.selected_family_history.filter(item => item.description !== 'NONE');
            }
        },


        removeFamilyHistory(index) {
            const remove_item = this.selected_family_history[index];

            this.selected_family_history.splice(index, 1);

            if (remove_item.description === 'ALLERGY') {
                this.family_allergies = '';
                this.selected_family_history_holder = '';
            }

            this.emitData();
        },

        saveOthers() {
            if(this.others.section === "selected_past_history") {
                this[this.others.section].push({
                    code: '998',
                    description: 'OTHERS: ' + this.others.new
                })

                this.mdisease_list.push({
                    code: '998',
                    description: 'OTHERS'
                })

                //REMOVED THE OTHERS FROM THE ARRAY WHEN SELECTED OTHERS IN THE MDISEASE_LIST.
                this.selected_past_history.splice(this.selected_past_history.findIndex(e => e.description === "OTHERS"), 1);
            }

            if(this.others.section === "selected_family_history") {
                this.selected_family_history_holder = ''

                this[this.others.section].push({
                    code: '998',
                    description: 'OTHERS: ' + this.others.new
                })
            }
            this.others.dialog = false
            this.emitData();
        },

        closeOtherDialog() {
            this.others.dialog = false

            if(this.others.section === "selected_past_history") {
                this.selected_past_history.splice(this.selected_past_history.findIndex(element => element.description === "OTHERS"), 1);
            }

            if(this.others.section === "selected_family_history") {
                this.selected_family_history_holder = ''
            }
        },
         
        clearSmoking() {
            this.smoker.social_history = '';
            this.smoker.vape_type = '';
            this.smoker.years_of_smoked = '';
            this.smoker.year_stopped_in_smoking = '';
            this.validateSocialHistory();
        },

        validateSocialHistory() {
            const smoker = this.smoker.social_history ? [this.smoker] : []
            const alcoholic = this.alcoholic.social_history ? [this.alcoholic] : []
            const illicit_drug_user = this.illicit_drug_user.social_history ? [this.illicit_drug_user] : []
            const sexually_active = this.sexually_active.social_history ? [this.sexually_active] : []
            const personal_others = this.personal_others.social_history ? [{
                social_history: 'Personal-'+this.personal_others.social_history
            }] : []

            this.patient_social_history = [...smoker, ...alcoholic, ...illicit_drug_user, ...sexually_active, ...personal_others]
            this.emitData();
        },
        
        numberOnly(event) {
            if ((event.which < 48 || event.which > 57) && event.which !== 45) {
                event.preventDefault();
            }
        },

        emitData() {
            this.$nextTick(() => {
                const data = {
                    past_medical_history: this.selected_past_history,
                    previous_hospitalization: this.previous_hospitalization,
                    previous_hospitalization_date: this.previous_hospitalization_date ? this.$moment(this.previous_hospitalization_date, 'MM-DD-YYYY', true).format('YYYY-MM-DD') : null,
                    previous_surgeries: this.previous_surgeries,
                    previous_surgeries_date: this.previous_surgeries_date ? this.$moment(this.previous_surgeries_date, 'MM-DD-YYYY', true).format('YYYY-MM-DD') : null,
                    allergies: this.allergies,
                    family_allergies: this.family_allergies,
                    current_medicine: this.selected_medicine,
                    family_medical_history: this.selected_family_history,
                    patient_social_history: this.patient_social_history,

                    ...(this.$route.path === '/admission/medical-history' ? {
                        medical_prev_record: this.medical_previous_record,
                        medicine_prev_record: this.medicine_previous_record,
                        family_prev_record: this.family_previous_record,
                        social_prev_record: this.social_previous_record,
                    } : undefined)
                }

                this.$emit('mutationStatus', 'med', data)
                this.$emit('allergyStatus', !this.disabled_allergies);
                this.$emit('familyAllergyStatus', !this.disabled_family_allergies);
                const med_his_cache = this.$crypto.AES.encrypt(JSON.stringify(data), 'EMX246').toString()
                sessionStorage.setItem('49GkdoSQN', med_his_cache)
            });
        }
    }
}
</script>

<style scoped>
#table {
    width: 100%;
}

th {
    border: 0;
}

td {
    cursor: default;
    padding: 0 3px;
    border: 0px;
}
</style>