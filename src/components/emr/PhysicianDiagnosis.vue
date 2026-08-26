<template>
    <div class="d-print-none"> 
        <v-row class="mt-4" dense> 
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                
                <v-card class="card-border pa-7 d-print-none" height="100%" outlined>
                    <v-row dense>
                        <v-col v-if="$store.state.usr_credentials.department === 'Data Encoder'" cols="12" sm="12" md="12" lg="12" class="d-lg-flex justify-lg-space-between">
                            <div style="width: 200px;"> 
                                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field  v-on="on" :value="format_date_admitted"  @change="mutationStatus('phy', $event, 'date_admitted')" :error="offline_required_fields" label="Date Admitted" class="mb-4" hide-details dense style="width: 220px;"> </v-text-field>
                                    </template>
                                    <v-date-picker v-model="offline_date_admitted" @change="mutationStatus('phy', $event, 'date_admitted')" :error="offline_required_fields" :max="dateToday()" no-title></v-date-picker>
                                </v-menu>
                            </div>
                            <div style="width: 200px;"> 
                                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-on="on"  :value="format_date_discharge"   @change="mutationStatus('phy', $event, 'date_admitted')" :error="offline_required_fields" label="Date Discharged" class="mb-4" hide-details dense style="width: 220px;"> </v-text-field>
                                    </template>
                                    <v-date-picker v-model="offline_date_discharge" @change="mutationStatus('phy', $event, 'date_discharged')" :error="offline_required_fields" :max="dateToday()" no-title></v-date-picker>
                                </v-menu>
                            </div>
                        </v-col>
                        <v-col v-else cols="12" sm="6" md="6" lg="6">
                            <label class="body-2 font-weight-medium">Date Admitted: <span class="font-weight-regular">{{ date_admitted }}</span></label>
                        </v-col>

                        <!-- <v-col class="text-sm-right" cols="12" sm="6" md="6" lg="6">
                            <label class="body-2 font-weight-medium">Date Discharged: <span class="font-weight-regular">{{ date_discharged }}</span></label>
                        </v-col> -->  
                    </v-row>
                    <v-divider class="my-4"></v-divider>

                    <!-- NOT TO DISPLAY IF THE CURRENT USER IS ENCODER  -->
                    <div v-if="$store.state.usr_credentials.user_type !== '9-1'"> 
                        <h4 class="body-2 font-weight-medium">Purpose of Visit<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Layunin ng pagbisita)</span></h4>
                        <v-autocomplete v-model="visit_data.purpose_of_visit" :items="purpose_of_visit_items" :clearable="emr_params.editable" @change="mutationStatus('vis')" :loading="visit_loading_data" hide-details outlined dense multiple small-chips></v-autocomplete>
                            
                        <h4 class="body-2 font-weight-medium mt-4">Chief Complaint <span class="red--text"> *</span><span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Ano ang iyong ipapakonsulta?)</span></h4>
                        <v-textarea v-model="physician_diagnosis.chief_complaint" @change="mutationStatus('phy', $event, 'chief')" @input="physician_diagnosis.chief_complaint = textCapitalize($event)" :error="chief_history_error" class="body-2" rows="3" hide-details outlined></v-textarea>
                        <h4 class="body-2 font-weight-medium mt-4">History of Current Illness<span v-if="eligible_data.eclaims_eligible" class="red--text"> *</span><span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Historya ng kasalukuyang karamdaman)</span></h4>
                        <v-textarea v-model="physician_diagnosis.history_current_illness" @change="mutationStatus('phy', $event, 'ill')" @input="physician_diagnosis.history_current_illness = textCapitalize($event)" :error="chief_history_error" class="body-2" rows="3" hide-details outlined></v-textarea>  
                        <v-row>
                            <v-col>
                                <SignsAndSymptoms 
                                    :emr_params="emr_params"
                                    :signs_and_symptoms="signs_and_symptoms"
                                    @getSignsAndSymptoms="getSignsAndSymptoms"
                                    @mutationStatus="mutationStatus"
                                    ref="signs_and_symptoms"
                                />
                            </v-col>
                        </v-row>
                    </div>
                    
                    <div v-if="($store.state.usr_credentials.lgu_host_code === 'LC' || $store.state.usr_credentials.lgu_host_code === 'BAT') && $store.state.usr_credentials.user_type !== '9-1' && $store.state.usr_credentials.user_settings.user_layout !== 'type_b'"> 
                        <PhysicalExamination 
                            ref="physical_examination"
                            :emr_params="emr_params" 
                            :patient_age="patient_age" 
                            :patient_birthdate="patient_birthdate" 
                            :patient_gender="patient_gender"
                            :eligible_data="eligible_data"
                            :for_saving="for_saving" 
                            class="d-print-none"
                            @mutationStatus="mutationStatus" 
                        />
                    </div>

                    <v-row dense> 
                        <v-col> 
                            <h4 class="body-2 font-weight-medium mt-4">Assessment<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pagtanggap na diagnosis)</span></h4>
                            <v-textarea :value="admitting_diagnosis" :disabled="from_migration"  @input="updateDiagnosis($event)" rows="2" hide-details outlined> </v-textarea>
                        </v-col>
                    </v-row>
                        
                    <div v-if="this.$store.state.usr_credentials.department !== 'Data Encoder'" class="d-flex justify-end"> 
                        <v-switch :value="switch_favorite" @change="$emit('setFavorites', $event)" label="Common Diagnosis/Procedure"  color="success" :disabled="$store.state.loading_icd" inset dense hide-details> </v-switch>
                    </div>

                    <div v-for="(icd, i) in selected_icd" :key="i">
                        <v-divider v-if="i >= 1" class="mt-5"></v-divider>

                        <v-row align="baseline" dense>
                            <v-col cols="12" md="8" lg="8">
                                <h6 v-if="i === 0" class="font-weight-medium body-2 mt-3">{{ switch_favorite ? 'Select Common Diagnosis' : 'Primary Diagnosis'}} <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pangunahing diagnosis)</span></h6>
                                <h6 v-else-if="i === 1" class="font-weight-medium body-2 mt-3">Secondary Diagnosis<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pangalawang diagnosis)</span></h6>
                                <h6 v-else class="font-weight-medium body-2 mt-3">Other Diagnosis<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Ibang diagnosis)</span></h6>
                                <template v-if="switch_favorite"> 
                                    <v-combobox v-model="set_icd_favorites" :items="icd_items" @update:search-input="$emit('searchItems', $event, 'icd')" :loading="$store.state.loading_icd" @change="addFavorites('icd')" class="body-2" item-text="icd_code_description" prepend-inner-icon="mdi-magnify" placeholder="Search for ICD Code or Description" hide-no-data hide-details multiple clearable outlined dense>
                                        <template v-slot:item="{attrs, on, item }">
                                            <v-list-item v-bind="attrs" v-on="on"  class="d-flex justify-space-between">
                                                <v-list-item-icon>
                                                    <v-icon>
                                                    {{ selected_icd_favorites.includes(item) ? 'mdi mdi-checkbox-marked' : 'mdi mdi-checkbox-blank-outline' }}
                                                    </v-icon>
                                                </v-list-item-icon>

                                                <v-list-item-content>
                                                    <v-list-item-title>{{ item.icd_description_long }}</v-list-item-title>
                                                    <v-list-item-subtitle>{{ item.icd_code }}</v-list-item-subtitle>
                                                </v-list-item-content>
                                                <div> 
                                                    <span v-if="item.is_favorite === '1'"> <v-icon color="primary"> mdi mdi-star </v-icon> </span>
                                                </div>
                                            </v-list-item>
                                        </template>
                                        <template v-slot:append-item>
                                            <v-sheet v-if="search_icd_items" class="d-flex justify-center my-4">
                                                <v-btn @click="$emit('loadMore', 'icd')" :loading="$store.state.loading_icd" small outlined>
                                                Load More
                                                </v-btn>
                                            </v-sheet>
                                        </template>
                                    </v-combobox>
                                </template> 
                                <template v-else> 
                                    <v-combobox v-model="icd.icd_code_description" :items="icd_items" @update:search-input="$emit('searchItems', $event, 'icd')"  :loading="$store.state.loading_icd" class="body-2" item-text="icd_code_description" :messages="$store.state.usr_credentials.user_type === '9-1' && !doctor_data.doctor_tin ? ['Please select a doctor to enable these fields.'] : []" :disabled="$store.state.usr_credentials.user_type === '9-1' && !doctor_data.doctor_tin" prepend-inner-icon="mdi-magnify" placeholder="Search for ICD Code or Description" hide-no-data return-object clearable outlined dense>
                                        <template v-slot:item="{attrs, on, item }">
                                            <v-list-item v-bind="attrs" v-on="on" @click="$emit('addDiagnosisData', i, item)" class="d-flex justify-space-between">
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ item.icd_description_long }}</v-list-item-title>
                                                    <v-list-item-subtitle>{{ item.icd_code }}</v-list-item-subtitle>
                                                </v-list-item-content>
                                                <div> 
                                                    <span v-if="item.is_favorite === '1'"> <v-icon color="primary"> mdi mdi-star </v-icon> </span>
                                                </div>
                                            </v-list-item>
                                        </template>
                                        <template v-slot:append-item>
                                            <v-sheet v-if="!search_icd_items"  class="d-flex justify-center my-4">
                                                <v-btn @click="$emit('loadMore', 'icd')" :loading="$store.state.loading_icd" small outlined>
                                                Load More
                                                </v-btn>
                                            </v-sheet>
                                        </template>
                                    </v-combobox>
                                </template>
                            </v-col>

                            <v-col cols="12" md="4" lg="4">
                                <h6 class="font-weight-medium body-2">Condition<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Kondisyon)</span></h6>
                                
                                <v-combobox v-model="icd.icd_category.selected" :items="icd.icd_category.list" :loading="icd.icd_category.loading" :disabled="emr_params.editable && !icd.icd_group_code" item-text="category_description" hide-no-data hide-details return-object outlined dense>
                                    <template v-if="emr_params.editable" v-slot:append-outer>
                                        <v-icon @click="removeDiagnosis(i)">mdi-delete</v-icon>
                                    </template>
                                </v-combobox>
                            </v-col>
                        </v-row>

                        <!--Show Package of Procedure onle once in Primary Diagnosis-->
                        <div v-if="!switch_favorite">
                            <v-col v-if="i === 0"  cols="12" md="12" lg="12" class="mt-4"> 
                                <v-row  align="center" justify="space-between">
                                    <h6 class="pl-4 pt-4 font-weight-medium body-2" v-if="selected_package">Selected Package: {{ selected_package }}</h6>
                                    <h6 class="pl-4 pt-4 font-weight-medium body-2" v-if="package_name">Selected Package: {{ package_name }}</h6>
                                    <div v-else> </div>
                                    <v-btn @click="openPackageDialog(i)" :disabled="!emr_params.editable || !icd.icd_code_description">
                                        <v-icon small left>mdi-folder-multiple</v-icon> Package of Procedure
                                    </v-btn>
                                </v-row>
                            </v-col>
                        </div>

                        <div v-for="(item, key) in favorite_items" :key="key" class="ml-4 my-2"> 
                            <span class="body-2"> {{ item.icd_code_description  }} </span>
                        </div>

                        <div v-if="switch_favorite" class="d-flex justify-end mt-4"> 
                            <v-btn :disabled="selected_icd_favorites.length <= 0" @click="$emit('unFavoritesDiagnosis', 'icd')" class="mr-4"> Remove </v-btn>
                            <v-btn :disabled="selected_icd_favorites.length <= 0" @click="$emit('addToFavorites', 'icd')"> Add </v-btn>
                        </div>

                        <template v-if="switch_favorite"> 
                            <h4 class="body-2 font-weight-medium mt-4 pl-4">Select Common Procedure</h4>

                            <v-combobox v-model="set_cpt_favorites" :items="$store.state.cpt_list" :loading="$store.state.loading_cpt" @update:search-input="$emit('searchItems', $event, 'cpt')" @change="addFavorites('cpt')" class="body-2 pl-4 mb-2" item-text="cpt_code_desc" prepend-inner-icon="mdi-magnify" placeholder="Search for CPT Code or Description" hide-no-data hide-details multiple clearable outlined dense>
                                <template v-slot:item="{attrs, on, item }">
                                    <v-list-item v-bind="attrs" v-on="on" class="d-flex justify-space-between">
                                        <v-list-item-icon>
                                            <v-icon>
                                            {{ selected_cpt_favorites.includes(item) ? 'mdi mdi-checkbox-marked' : 'mdi mdi-checkbox-blank-outline' }}
                                            </v-icon>
                                        </v-list-item-icon>

                                        <v-list-item-content>
                                            <v-list-item-title>{{ item.cpt_description }}</v-list-item-title>
                                            <v-list-item-subtitle>{{ item.cpt_code }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                        <div> 
                                            <span v-if="item.is_favorite === '1'"> <v-icon color="primary"> mdi mdi-star </v-icon> </span>
                                        </div>
                                    </v-list-item>
                                </template>
                                <template v-slot:append-item>
                                    <v-sheet v-if="!search_cpt_items"  class="d-flex justify-center my-4">
                                        <v-btn @click="$emit('loadMore', 'cpt')" :loading="$store.state.loading_cpt" small outlined>
                                        Load More
                                        </v-btn>
                                    </v-sheet>
                                </template>
                            </v-combobox>
                    
                            <div v-if="switch_favorite" class="d-flex justify-end mt-4"> 
                                <v-btn :disabled="selected_cpt_favorites.length <= 0" @click="$emit('unFavoritesDiagnosis', 'cpt')" class="mr-4"> Remove </v-btn>
                                <v-btn :disabled="selected_cpt_favorites.length <= 0" @click="$emit('addToFavorites', 'cpt')"> Add </v-btn>
                            </div>
                        </template>

                        <div v-if="icd.procedures.length > 0 && !switch_favorite" class="pl-4">
                            <v-row no-gutters>
                                <v-col sm="5" md="5" lg="5">
                                    <h4 class="body-2 font-weight-medium mt-4">Procedure</h4>
                                </v-col>
                                <v-col sm="2" md="2" lg="3">
                                    <h4 class="body-2 font-weight-medium mt-4">Modifier</h4>
                                </v-col>
                                <v-col sm="3" md="3" lg="2">
                                    <h4 class="body-2 font-weight-medium mt-4">Physician Recommendation</h4>
                                </v-col>
                                <v-col sm="2" md="2" lg="2">
                                    <h4 class="body-2 font-weight-medium mt-4">Patient Remarks</h4>
                                </v-col>
                            </v-row>

                            <v-row v-for="(cpt, x) in icd.procedures" :key="x" no-gutters>
                                <v-col sm="5" md="5" lg="5">
                                    <v-text-field  @click="$emit('showLongDesc', i, x)" :value="cpt.cpt_code + ' / ' + cpt.cpt_description" :disabled="disable_procedure_fields" class="body-2 mb-2 mr-2 cursor-pointer" :append-icon="cpt.show_long_desc ? 'mdi-menu-up' : 'mdi-menu-down' " hide-details readonly outlined dense>
                                    </v-text-field>
                                </v-col>
                                <v-col sm="2" md="2" lg="3">
                                    <v-select v-model="cpt.modifier" @change="$emit('mutationStatus', 'phy')" :disabled="disable_procedure_fields" :items="select_cpt_modifier" item-text="mod_description" return-object clearable class="body-2 mb-2 mr-2" hide-details outlined dense></v-select>
                                </v-col>
                                <v-col sm="3" md="3" lg="2">
                                    <v-select v-model="cpt.physician_recommendation" @change="$emit('mutationStatus', 'phy')" :disabled="disable_procedure_fields" :placeholder="filter_physician_recommend(cpt.physician_recommendation)" :items="select_physician_recommendation" class="select-place-holder body-2 mr-2" dense hide-details outlined></v-select>
                                </v-col>
                                <v-col sm="2" md="2" lg="2">
                                    <v-select v-model="cpt.patient_remarks" @change="$emit('mutationStatus', 'phy')" :disabled="disable_procedure_fields" :placeholder="filter_patient_remarks(cpt.patient_remarks)" :items="select_patient_remarks" class="select-place-holder body-2" hide-details dense outlined>
                                        <template v-if="emr_params.editable" v-slot:append-outer>
                                            <v-icon v-if="cpt.diag_exam_status === 'N'" class="ml-1" @click="$emit('removeProcedure', i, x, cpt.cpt_code)">mdi-delete</v-icon>
                                        </template>
                                    </v-select>
                                </v-col>
                                <v-col v-if="cpt.show_long_desc" cols="12" sm="12" md="12" lg="12" class="mb-4"> 
                                    <v-text-field :value="cpt.cpt_description_long" class="body-2 mb-2 mr-2" :disabled="disable_procedure_fields" hide-details readonly outlined dense></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row no-gutters> 
                                <v-col> 
                                    <div v-if="from_migration">
                                        <v-checkbox v-model="proceed_result" @change="proceedingResult($event)" :disabled="disable_procedure_fields" label="Please check the box if all procedures have been encoded before proceeding to add the results."> </v-checkbox>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row class="mt-4" justify="end">
                                <v-btn
                                    small
                                    :disabled="!proceed_result"
                                    @click="$emit('viewProcedure', icd.procedures)"
                                >
                                    <v-icon :color="procedure_result_required && !from_migration_procedure_result ? 'red' : undefined" left>
                                        {{ procedure_result_required && !from_migration_procedure_result ? 'mdi-alert-circle' : 'mdi-text-box-outline' }}
                                    </v-icon>
                                    Add Results
                                </v-btn>
                            </v-row>
                        </div>

                        <template v-if="!switch_favorite">
                            <h4 class="body-2 font-weight-medium mt-4 pl-4">Add Procedure<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Magdagdag ng proseso)</span></h4>
                            <v-autocomplete :value="selected_cpt_holder" :disabled="disable_procedure_fields || (proceed_result || !icd.icd_code_description)" :items="cpt_items" :loading="$store.state.loading_cpt" @update:search-input="$emit('searchItems', $event, 'cpt')" @change="$emit('addProcedure', $event, i)" item-text="cpt_code_desc" class="body-2 pl-4" prepend-inner-icon="mdi-magnify" placeholder="Search for CPT Code or Description" return-object hide-no-data hide-selected hide-details clearable outlined dense>
                                <template v-slot:item="{attrs, on, item }">
                                    <v-list-item v-bind="attrs" v-on="on"  class="d-flex"> 
                                        <v-list-item-content>
                                            <v-list-item-title>{{ item.cpt_description_long.slice(0, 210) }}</v-list-item-title>
                                            <v-list-item-subtitle>{{ item.cpt_code }}</v-list-item-subtitle>
                                        </v-list-item-content>

                                        <div> 
                                            <span v-if="item.is_favorite === '1'"> <v-icon color="primary"> mdi mdi-star </v-icon> </span>
                                        </div>
                                    </v-list-item>
                                </template>
                                <template v-slot:append-item>
                                    <v-sheet v-if="!search_cpt_items"  class="d-flex justify-center my-4">
                                        <v-btn @click="$emit('loadMore', 'cpt')" :loading="$store.state.loading_cpt" small outlined>
                                        Load More
                                        </v-btn>
                                    </v-sheet>
                                </template>
                            </v-autocomplete>
                        </template>

                        <v-dialog v-if="package_procedure_dialog" v-model="package_procedure_dialog" width="900" persistent>
                            <v-card class="pa-5 d-print-none">
                                <div class="d-flex justify-space-between align-center">
                                    <h3  v-if="!switch_add_package_procedure" class="font-weight-medium">Package of Procedures</h3>
                                    <h3 v-else class="font-weight-medium">{{ cpt_package.includes(new_package_name) ? 'Update Package of Procedure' : 'Add New Package of Procedure' }}</h3>
                                    <v-switch v-if="$store.state.usr_credentials.user_type !== '9-1'" :value="switch_add_package_procedure"  :disabled="$store.state.loading_icd" @change="$emit('setPackageProcedure', $event)" label="Add or Update Package of Procedure"  color="success" class="mt-n1" inset dense hide-details> {{ switch_add_package_procedure }} </v-switch>
                                </div>

                                <h4 v-if="!switch_add_package_procedure" class="body-2 font-weight-medium mt-4">Select Package</h4>
                                <h4 v-else class="body-2 font-weight-medium mt-4">{{ cpt_package.includes(new_package_name) ? 'Update Package' : 'Add Package' }}</h4>

                                <v-combobox v-if="!switch_add_package_procedure" v-model="set_package_procedure" @input="set_package_procedure = textCapitalize($event)" :items="cpt_package" :loading="loading_cpt" class="body-2" prepend-inner-icon="mdi-magnify" placeholder="Search for Package of Procedure" clearable outlined dense>
                                </v-combobox>

                                <v-row v-if="switch_add_package_procedure">
                                    <v-col cols="12">
                                        <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-bind="attrs" v-on="on" v-model="new_package_name" @click="openMenu" :readonly="is_selected" @click:clear="clearSelection" @input="filterItems"  placeholder="Enter New Package Name or Search Package to Update" hide-details outlined dense clearable prepend-inner-icon="mdi-magnify"
                                                ></v-text-field>
                                            </template>

                                            <v-card v-if="filtered_cpt_package.length">
                                                <v-sheet class="add-update-package overflow-y-auto">
                                                    <v-list>
                                                        <v-list-item  v-for="(item, index) in filtered_cpt_package.filter(i => !['MAGIC 12', 'MAGIC 10', 'MAGIC 8'].includes(i))" :key="index" @click="selectItem(item)" >
                                                            <v-list-item-content>
                                                            <v-list-item-title>{{ item }}</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-sheet>
                                            </v-card>
                                        </v-menu>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-combobox v-model="set_adding_of_new_package_procedure" :items="combobox_items_package"  :loading="$store.state.loading_cpt" @update:search-input="$emit('searchItems', $event, 'cpt')" class="body-2" item-text="cpt_code_desc" prepend-inner-icon="mdi-magnify" placeholder="Search for CPT Code or Description" :menu-props="{ maxWidth: '850px',maxHeight: '300px', offsetY: true }" hide-no-data hide-details clearable return-object deletable-chips multiple chips outlined dense>
                                            <template v-slot:item="{attrs, on, item }" >
                                                <v-list-item v-bind="attrs" v-on="on" class="d-flex justify-space-between">
                                                    <v-list-item-icon>
                                                        <v-icon>
                                                            {{ set_adding_of_new_package_procedure.some(selected => selected.cpt_code === item.cpt_code) ? 'mdi mdi-checkbox-marked' : 'mdi mdi-checkbox-blank-outline' }}
                                                        </v-icon>
                                                    </v-list-item-icon>

                                                    <v-list-item-content>
                                                        <v-list-item-title>{{ item.cpt_description }}</v-list-item-title>
                                                        <v-list-item-subtitle>{{ item.cpt_code }}</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                    <div> 
                                                        <span v-if="item.is_favorite === '1'"> <v-icon color="primary"> mdi mdi-star </v-icon> </span>
                                                    </div>
                                                </v-list-item>
                                            </template>
                                            <template v-slot:append-item>
                                                <v-sheet v-if="!search_cpt_items"  class="d-flex justify-center my-4">
                                                    <v-btn @click="$emit('loadMore', 'cpt')" :loading="$store.state.loading_cpt" small outlined>
                                                    Load More
                                                    </v-btn>
                                                </v-sheet>
                                            </template>
                                        </v-combobox>
                                    </v-col>
                                </v-row>

                        
                                <v-layout justify-end wrap mt-4>
                                    <v-btn @click="$emit('update:reset_switch', false); package_procedure_dialog = false" class="mr-4">CANCEL</v-btn>
                                    <v-btn v-if="!switch_add_package_procedure"  :disabled="!set_package_procedure" @click="addPackageProcedure('cpt', i)"  color="primary"> Add </v-btn>
                                    <v-btn v-else :disabled="set_adding_of_new_package_procedure.length === 0 || !new_package_name" @click="addUpdatePackage('cpt')"  :color="button_color"> {{ button_label }} </v-btn>
                                </v-layout>
                            </v-card>
                        </v-dialog>
                    </div>
                     
                    <div v-if="!switch_favorite" class="text-right mt-3">
                        <v-btn v-if="emr_params.editable" :disabled="$store.state.loading_icd" @click="$emit('addDiagnosisField')"><v-icon left>mdi-plus</v-icon> ADD DIAGNOSIS</v-btn>
                    </div>
                    
                    <template v-if="$store.state.usr_credentials.user_type === '6-1' || $store.state.usr_credentials.user_type === '7-1' || $store.state.usr_credentials.user_type === '9-1' || $store.state.usr_credentials.user_type === '2-5'">
                        <div class="d-flex justify-space-between align-center mt-2"> 
                            <h6 class="font-weight-medium body-2 mt-4">Drugs / Medicine<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pumili ng gamot)</span>
                                <v-tooltip bottom color="primary">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                        color="primary"
                                        dark
                                        v-bind="attrs"
                                        v-on="on"
                                        class="mb-1">
                                        mdi-information-outline
                                        </v-icon>
                                    </template>
                                    <span>For other medicine. Use Drug and Medicines not needed during this particular episode of care.</span>
                                </v-tooltip>
                            </h6>

                            <div class="d-flex justify-start align-center mt-3"> 
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

                        <v-autocomplete :value="selected_medicine_holder" :items="medicine_items" :disabled="from_migration" :loading="loading_medicine" :item-text="(item) => `${item.generic_name_text} (${item.other_med_group})`" @change="$emit('selectedMedicineHolder')" class="body-2" prepend-inner-icon="mdi-magnify" placeholder="Search for Generic / Brand Name" return-object hide-no-data hide-selected hide-details outlined dense>
                            <template v-slot:item="{ item }">
                                <v-layout @click="$emit('addDrugsMedicine', item)">
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
                    </template>

                    <div v-if="emr_params.editable" class="d-flex align-end justify-end my-2">
                        <v-btn small @click="openRxHistory">Rx History</v-btn>
                    </div>

                    <v-dialog v-model="rx_dialog" width="1000" persistent>
                        <v-card class="pa-4">
                            <h3 class="font-weight-regular light-blue darken-4 text-center white--text py-2 mb-2">RX HISTORY</h3>

                            <v-data-table
                                :headers="[
                                    { text: 'Transaction Number', value: 'transaction_number' },
                                    { text: 'Date', value: 'transaction_date' },
                                    { text: 'Medicines', value: 'medicines' }
                                ]"
                                :items="rx_list"
                                :items-per-page="5" 
                                :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" 
                                :mobile-breakpoint="0"
                                item-key="transaction_number"
                                sort-desc
                                no-results
                            >
                                <template v-slot:item="{ item }">
                                    <tr @click="selectRow(item)" @dblclick="applyTransaction(item)" :style="{ cursor: 'pointer', background: selected_rx === item ? '#E3F2FD' : '' }">
                                        <td class="text-center">{{ item.transaction_number }}</td>
                                        <td class="text-center">{{ formatDate(item.transaction_date) }}</td>
                                        <td>
                                            <ul class="ma-0 pl-4 text-left">
                                                <li v-for="(med, i) in item.medicines" :key="i">
                                                    {{ med.generic_name }} ({{ med.dosage }})
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>

                            <v-card-actions class="justify-end">
                                <v-btn @click="useSelected" :disabled="!rx_list.length" color="primary" medium>Use selected Rx</v-btn>
                                <v-btn @click="rx_dialog = false" medium>Close</v-btn>
                            </v-card-actions>

                            <v-overlay :value="rx_loading_data" class="text-center" color="#ffffff" absolute opacity="1">
                                <v-progress-circular color="primary" size="35" indeterminate></v-progress-circular>
                                <h4 class="light-blue--text text--darken-4 pl-5 pt-3">Loading... Please wait...</h4>
                            </v-overlay>
                        </v-card>
                    </v-dialog>     

                    <v-dialog v-if="other_med.dialog" v-model="other_med.dialog" width="400" persistent>
                        <v-card class="pa-5 d-print-none">
                            <h6 class="font-weight-regular body-2">Others</h6>
                            <v-text-field v-model="other_med.generic_name" @input="other_med.generic_name = textCapitalize($event)"  placeholder="Enter other medicine here" hide-details outlined></v-text-field>

                            <v-layout justify-end wrap mt-4>
                                <v-btn @click="other_med.dialog = false" small>CLOSE</v-btn>
                                <v-btn @click="$emit('saveOthersMed')" :disabled="!other_med.generic_name" class="ml-2" color="primary" small>CONFIRM</v-btn>
                            </v-layout>
                        </v-card>
                    </v-dialog>
                    
                    <div v-if="selected_medicine.length > 0" :class="{'table-overflow-x' : $vuetify.breakpoint.lgAndDown}">
                        <table id="table" class="my-4" cellspacing="0" cellpadding="0">
                            <tr>
                                <th class="font-weight-medium body-2">Generic Name</th>
                                <th class="font-weight-medium body-2">Dosage</th>
                                <th class="font-weight-medium body-2">Preparation</th>
                                <th class="font-weight-medium body-2">Duration # of days</th>
                                <th class="font-weight-medium body-2">Frequency<br>(per day)</th>
                                <th class="font-weight-medium body-2">Total # of Medicine <span class="red--text"> * </span></th>
                                <th class="font-weight-medium body-2"> Brand Name </th>
                                <th class="font-weight-medium body-2"> Classification </th>
                                <th class="font-weight-medium body-2">Remarks <span class="white--text">........</span> </th>
                            </tr>
                            <tr v-for="(med, i) in selected_medicine" :key="i">
                                <td style="width: 20%">
                                    <v-text-field :value="med.generic_name.trim()" class="body-2" hide-details readonly></v-text-field>
                                </td>
                                <td style="width: 8%">
                                    <v-text-field v-model="med.dosage" :disabled="from_migration" :value="med.dosage" class="body-2" hide-details :readonly="med.otc_medicine_code !== 'OTC-0000'" @blur="mutationStatus('phy')"></v-text-field>
                                </td>
                                <td style="width: 8%">
                                    <v-text-field v-model="med.preparation" :disabled="from_migration" :value="med.preparation" class="body-2" hide-details :readonly="med.otc_medicine_code !== 'OTC-0000'" @blur="mutationStatus('phy')"></v-text-field>
                                </td>
                                <td style="width: 8%">
                                    <v-text-field v-model="med.duration" :disabled="from_migration" @keypress="numberOnly" @blur="mutationStatus('phy')" class="body-2" onpaste="return false" maxlength="5" hide-details></v-text-field>
                                </td>
                                <td style="width: 8%">
                                    <v-text-field v-model="med.frequency_of_med" :disabled="from_migration" @keypress="numberOnly" @blur="mutationStatus('phy')" class="body-2" :label="med.frequency_of_med? med.frequency_of_med + 'x a day' : ''" onpaste="return false" maxlength="2" hide-details></v-text-field>
                                </td>
                                <td style="width: 8%">
                                    <v-text-field v-model="med.total_num_of_med" :disabled="from_migration" @keypress="numberOnly" :error="med_required_error" :value="med.total_num_of_med" @blur="mutationStatus('phy')" class="body-2" onpaste="return false" maxlength="5" hide-details></v-text-field>
                                </td>
                                <td style="width: 10%">
                                    <v-text-field v-model="med.brand_name" :value="med.brand_name" :disabled="from_migration" class="body-2" hide-details :readonly="med.medicine_code !== 'OTC-0000'" @blur="mutationStatus('phy')"></v-text-field>
                                </td>
                                <td style="width: 10%">
                                    <v-text-field
                                        v-model="med.other_med_group"
                                        :value="med.other_med_group"
                                        readonly
                                        dense
                                        hide-details
                                    ></v-text-field> 
                                </td>
                                <td style="width: 25%">
                                    <v-text-field v-model="med.notes" @blur="mutationStatus('phy')" class="body-2 pa-0" hide-details>
                                        <template v-if="emr_params.editable" v-slot:append-outer>
                                            <v-icon :disabled="loading_medicine || from_migration" @click="$emit('removeAddedDrugsMedicine', i)">mdi-delete</v-icon>
                                        </template>
                                    </v-text-field>
                                </td>
                            </tr>
                        </table>
                    </div>
                     
                    <v-row class="mt-4" no-gutters>
                        <v-col cols="12" sm="12" md="12" lg="12">
                            <h4 class="body-2 font-weight-medium">Management Type<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Uri ng pamamahala ng kondisyon)</span></h4> 
                        </v-col>
                        <v-col cols="12" sm="12" md="12" lg="12" class="mb-4">
                            <v-combobox
                                :value="select_management"
                                :disabled="from_migration" 
                                @change="$emit('selectedManagement', $event, 'mng')"
                                :items="management_items"
                                :item-disabled="is_item_disabled"
                                placeholder="Select for Management"
                                item-text="management_description"
                                item-value="lib_id"
                                return-object
                                multiple
                                small-chips
                                outlined
                                dense
                                hide-details
                            ></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" lg="12">
                            <h4 class="body-2 font-weight-medium"> Doctor Notes<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Mga tala ng manggagamot)</span></h4> 
                        </v-col>
                        <v-col cols="12" sm="12" md="12" lg="12">
                            <v-textarea :value="doctor_notes" @input="updateDoctorNotes($event)" class="body-2" rows="2" :disabled="($store.state.usr_credentials.user_type === '9-1' && !doctor_data.doctor_tin) || from_migration" hide-details outlined></v-textarea>     
                        </v-col>
                    </v-row>
                        
                    <h4 class="body-2 font-weight-medium mt-4">
                        Treatment Recommendation <span class="red--text"> *</span> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Rekomendasyon sa paggamot)</span> 
                        <v-btn v-if="emr_params.editable && treatment_recommendation" @click="$emit('mutationStatus', 'phy', null, 'treatment')" class="ml-2" x-small>CLEAR</v-btn>
                    </h4>
                    
                    <v-radio-group :value="treatment_recommendation" :error="treatment_recommendation_error" @change="mutationStatus('phy', $event, 'treatment')" class="mt-1" hide-details row>
                        <v-radio label="Outpatient" value="OUTPATIENT"></v-radio>
                        <v-radio label="Inpatient" value="INPATIENT"></v-radio>
                    </v-radio-group>

                    <h4 v-if="doctor_data.doctor_name || doctor_data.first_name" class="body-2 font-weight-medium mt-4">{{ $store.state.usr_credentials.department === 'Medical Practitioner' ? 'Doctor' : $store.state.usr_credentials.department }}</h4>
                    <v-text-field v-if="doctor_data.doctor_name || doctor_data.first_name" :value="emr_params.routes === 'Consultation' ? doctor_data.doctor_name + ' / ' + doctor_data.specialization : doctor_data.first_name + (doctor_data.middle_name ? ' ' + doctor_data.middle_name + ' ' : ' ') + doctor_data.last_name + (doctor_data.suffix ? ' ' + doctor_data.suffix : '') + ' / ' + doctor_data.specialization" class="body-2" prepend-inner-icon="fas fa-user-md" hide-details readonly outlined dense></v-text-field>
                    
                    <div v-if="acknowledgement_referral_code" class="lighten-4 grey pa-3 mt-6 mb-1">
                        <h4 class="body-2 font-weight-medium">Acknowledgement Referral Code</h4>
                        <h6 class="font-weight-bold title mt-1" style="color: #367c9d">{{ acknowledgement_referral_code.referral_code }}</h6>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- PLAN -->
        <v-card class="card-border pa-7 mt-5 d-print-none" outlined>
            <h3>Plan<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pagplano)</span></h3>
            <v-row dense>
                <v-col class="d-flex align-baseline" cols="12" sm="12" md="6" lg="6" xl="4">
                    <label class="body-2 font-weight-medium">Diet <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Diyeta)</span></label>
                    <v-text-field v-model="plan_data.diet" :disabled="from_migration" @blur="mutationStatus('plan')" class="body-2 pl-2" hide-details></v-text-field>
                </v-col>
                <v-col class="d-flex align-baseline" cols="12" sm="12" md="6" lg="6" xl="4">
                    <label class="body-2 font-weight-medium">Fluid Intake <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pag-inom)</span></label>
                    <v-text-field v-model="plan_data.fluid_intake" :disabled="from_migration" @blur="mutationStatus('plan')" class="body-2 pl-2" hide-details></v-text-field>
                </v-col>
                <v-col class="align-baseline d-flex" cols="12" sm="12" md="12" lg="6" xl="4">
                    <span class="body-2 font-weight-medium">Follow up Consultation </span>
                    <v-menu :close-on-content-click="false" :disabled="!emr_params.editable" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" :value="formatDate(plan_data.follow_up_consultation_date)" :disabled="from_migration" :clearable="emr_params.editable" @click:clear="plan_data.follow_up_consultation_date = ''" @change="mutationStatus('plan')" class="body-2 pl-2 mb-n1" prepend-icon="mdi-calendar" label="Date" hide-details>
                                <template v-slot:append-outer>
                                    <v-btn :disabled="emr_params.routes === 'EMRConsultation' || emr_params.routes === 'TELECONSULT' ?  !plan_data.follow_up_consultation_date : !plan_data.follow_up_consultation_date || !offline_date_admitted || !doctor_data.doctor_name" @click="$emit('viewFollowUpForm')" class="white--text" color="#367c9d" small>
                                        Print 
                                        <v-icon small right>mdi-printer</v-icon>
                                    </v-btn>
                                </template>
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="plan_data.follow_up_consultation_date" :min="dateToday()" @change="mutationStatus('plan')" no-title></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col v-if="$store.state.usr_credentials.user_type !== '9-1' && $store.state.prv_data.municipality === 'PARAÑAQUE CITY'" class="d-flex align-center pt-5" cols="12" sm="12" md="12" lg="6" xl="6">
                    <label class="body-2 font-weight-medium">Certificate of Apparent & Non-Apparent Disability<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1"><br />(Sertipiko ng Lantad at <br /> Di-Lantad na Kapansanan)</span></label>
                    <v-radio-group v-model="plan_data.disability_certificate" @change="mutationStatus('plan')" class="body-2 pl-2 ma-0" hide-details row>
                        <!--TEMPORARILY REMOVED FOR PARANAQUE DEPLOYMENT
                        <v-radio label="Yes" value="1"></v-radio>
                        <v-radio label="No" value="0"></v-radio>-->
                        <template v-slot:append>
                            <v-btn @click="$emit('viewCertificateOfDisability')" :disabled="plan_data.disability_certificate === '0'" class="white--text" color="#367c9d" small>
                                Print / Save
                                <v-icon small right>mdi-printer</v-icon>
                            </v-btn>
                        </template>
                    </v-radio-group>
                </v-col>
                <v-col v-if="$store.state.usr_credentials.user_type !== '9-1'" class="d-flex align-center pt-5" cols="12" sm="12" md="12" lg="6" xl="6">
                    <label class="body-2 font-weight-medium">Medical Certificate <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Sertipiko ng kalusugan)</span></label>
                    <v-radio-group v-model="plan_data.medical_certificate" @change="mutationStatus('plan')" class="body-2 pl-2 ma-0" hide-details row>
                        <v-radio label="Yes" value="1"></v-radio>
                        <v-radio label="No" value="0"></v-radio>
                        <template v-slot:append>
                            <v-btn @click="$emit('viewMedicalCertificate')" :disabled="plan_data.medical_certificate === '0'" class="white--text" color="#367c9d" small>
                                Print / Save
                                <v-icon small right>mdi-printer</v-icon>
                            </v-btn>
                        </template>
                    </v-radio-group>
                </v-col>
                <v-col v-if="$store.state.usr_credentials.user_type === '7-1' && $store.state.prv_data.municipality === 'PARAÑAQUE CITY'" class="d-flex align-center pt-5" cols="12" sm="12" md="12" lg="6" xl="6">
                    <label class="body-2 font-weight-medium">Gender Verification<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1"><br />(Pagpapatunay ng kasarian)</span></label>
                    <v-radio-group v-model="plan_data.gender_verification" @change="mutationStatus('plan')" class="body-2 pl-2 ma-0" hide-details row>
                        <!--TEMPORARILY REMOVED FOR PARANAQUE DEPLOYMENT
                        <v-radio label="Yes" value="1"></v-radio>
                        <v-radio label="No" value="0"></v-radio>-->
                        <template v-slot:append>
                            <v-btn @click="$emit('viewGenderVerification')" :disabled="plan_data.gender_verification === '0'" class="white--text" color="#367c9d" small>
                                Print / Save
                                <v-icon small right>mdi-printer</v-icon>
                            </v-btn>
                        </template>
                    </v-radio-group>
                </v-col>
                <v-col class="d-flex align-end ml-2" cols="12" sm="12" md="" lg=""></v-col>
            </v-row>
        </v-card> 

        <Alert :alert="alert" @proceedRemove="proceedRemove" @closeProceed="closeProceed" />
    </div>
</template>

<script> 
import SignsAndSymptoms from '@/components/emr/SignsAndSymptoms'
import PhysicalExamination from '@/components/emr/PhysicalExamination.vue'
import Alert from "@/components/Alert.vue";

export default {
    components: {
        SignsAndSymptoms,
        PhysicalExamination,
        Alert
    },

    props: [
        'patient_age', 'patient_birthdate', 'patient_gender', 'eligible_data', 'for_saving',
        'date_admitted', 'plan_data', 'visit_data', 'purpose_of_visit_items', 'emr_params', 'chief_complaint', 'chief_complaint_error',
        'admitting_diagnosis', 'physician_diagnosis', 'switch_favorite', 'selected_icd', 'icd_items', 'favorite_items', 'selected_cpt_holder', 'selected_cpt',
        'select_cpt_modifier', 'filter_physician_recommend', 'select_physician_recommendation', 'filter_patient_remarks', 'select_management', 
        'select_patient_remarks', 'selected_icd_favorites', 'selected_cpt_favorites', 'selected_medicine_holder', 'loading_medicine', 'medicine_items', 
        'other_med', 'selected_medicine', 'management_items', 'doctor_notes', 'treatment_recommendation_error', 'request_data_payload',
        'doctor_data', 'acknowledgement_referral_code', 'treatment_recommendation', 'date_today', 'signs_and_symptoms', 'required_fields', 'offline_required_fields',
        'search_icd_items', 'search_cpt_items','is_item_disabled', 'med_required_error', 'cpt_items', 'switch_add_package_procedure', 'selected_package_procedure', 'selected_cpt_for_new_package','selected_package_procedure_name','disable_package_procedure_btn',
        'package_name', 'visit_loading_data', 'chief_history_error','selected_transaction','from_migration', 'from_migration_procedure_result', 'procedure_result_required'
    ],

    data() {
        return {
            alert: {},
            view_cpt_code: false,
            procedure_items: [],

            patient_age_: this.patient_age,
            patient_birthdate_: this.patient_birthdate,
            patient_gender_: this.patient_gender,
            eligible_data_: this.eligible_data,
            for_saving_: this.for_saving,

            //WITH UPdATES - FOR EDIT TRANSACTION
            offline_date_admitted: this.selected_transaction?.date_admitted  && this.selected_transaction?.date_admitted!='N/A' ? this.selected_transaction.date_admitted : '',
            offline_date_discharge: this.selected_transaction?.date_discharged && this.selected_transaction?.date_discharged!='N/A' ? this.selected_transaction.date_discharged : '',
           
            date_admitted_empty_fields: false,
            date_discharged_empty_fields: false,
            set_icd_favorites: '',
            set_cpt_favorites: '',
            set_package_procedure: '',
            package_procedure_dialog: false,
            cpt_package: [],
            cpt_package_details:[],
            loading_cpt: false,
            selected_diagnosis_index: null,
            selected_index: null,
            selected_package: '', 
            set_adding_of_new_package_procedure: [],
            new_package_name: '',
            selected_package_name: '', 
            menu: false,
            update_set_package_procedure: null,
            filtered_cpt_package: [],
            is_selected: false,

            proceed_result: sessionStorage.getItem("Mihn42d") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("Mihn42d"), "EMS252").toString(this.$crypto.enc.Utf8)) : false,
            rx_dialog: false,
            rx_loading_data: false,
            rx_list: [],
            selected_rx: null
        }
    },
    
    computed: {
        format_date_admitted() {
            if(this.offline_date_admitted !== '') {
                return this.$moment(this.offline_date_admitted).format('MMMM D, YYYY')
            }

            return ''
        },

        format_date_discharge() {
            if(this.offline_date_discharge !== '') {
                return this.$moment(this.offline_date_discharge).format('MMMM D, YYYY')
            }

            return ''
        },
        
        combobox_items_package() {
            // If an existing package is selected, return its details
            if (this.cpt_package[this.new_package_name]) {
                return this.cpt_package_details[this.selected_package_name];
            }else{
                // If it's a new package, return all available CPTs
                return this.$store.state.cpt_list;
            }
        },

        button_label() {
            return this.cpt_package.includes(this.new_package_name) ? 'Update Package' : 'Add New Package';
        },

        button_color() {
            return this.cpt_package.includes(this.new_package_name) ? 'primary' : 'success';
        },

        disable_procedure_fields() {
            return (this.$store.state.usr_credentials.user_type === '9-1' &&!this.doctor_data.doctor_tin)
        }
    },

    watch: {
        //REMOVE THE DIAGNOSIS/PROCEDURE IF THE DOCTOR IS REMOVE IN SELECTION
        'doctor_data.doctor_tin'() {
            if(this.$store.state.usr_credentials.user_type === '9-1'){
                if(!this.doctor_data.doctor_tin){
                    for(let i = 0; i <= this.selected_icd.length; i++){
                        this.removeDiagnosis(this.selected_icd[i])
                    }
                }
            }
        }
    },

    mounted() {
        if(this.$store.state.usr_credentials.user_type !== '9-1') {
            this.getSignsAndSymptoms()
        }
    },

    methods: {
        async openRxHistory() {
            this.rx_list = [] 
            this.rx_dialog = true
            this.rx_loading_data = true 
            await this.loadRxHistory()
        },

        async loadRxHistory() {
            let response = await this.$services.getPatientPrescribedMedicines({
                ek_lgu_id: this.emr_params.ek_lgu_id
            })

            if (response.status !== 200) {
                this.alert = response.error
                return
            }

            const response_data = this.responseDataDecryption(response.data)
            const transactions = []

            Object.keys(response_data).forEach(transaction_number => {

                const meds = response_data[transaction_number] || []
                const list_by_date = {}

                meds.forEach(med => {
                const date = med.prescribe_date

                if (!list_by_date[date]) {
                    list_by_date[date] = {
                    transaction_number,
                    transaction_date: date,
                    medicines: []
                    }
                }

                list_by_date[date].medicines.push(med)
                })

                transactions.push(...Object.values(list_by_date))
            })

            this.rx_list = transactions.sort(
                (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
            )
            this.rx_loading_data = false
        },

        selectRow(transaction_number) {
            this.selected_rx = transaction_number
        },

        useSelected() {
            if (!this.selected_rx){
                this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Please select a transaction.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                return 
            } 
            this.applyTransaction(this.selected_rx)
        },

        applyTransaction(transaction_number) {
            if (!transaction_number?.medicines?.length) return

            let added = false

            transaction_number.medicines.forEach(med => {

                const exists = this.selected_medicine.some(m =>
                    m.medicine_code === (med.medicine_code || 'OTC-0000')
                )

                if (!exists) {
                    added = true
                    this.selected_medicine.push({
                        generic_name: med.generic_name || '',
                        dosage: med.dosage || '',
                        preparation: med.preparation || '',
                        duration: med.duration || '',
                        frequency_of_med: med.frequency_of_med || '',
                        total_num_of_med: med.total_num_of_med || '',
                        brand_name: med.brand_name || '',
                        notes: med.notes || '',
                        medicine_code: med.medicine_code || 'OTC-0000'
                    })
                }

            })

            if (!added) {
                this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: `Medicines from transaction number ${transaction_number.transaction_number} are already added.`, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }

            this.selected_rx = null
            this.rx_dialog = false
        },

        proceedingResult(event){
            if(event === false) {
                this.alert = { 
                    display: true, 
                    type:  'standard', 
                    width: '550', 
                    icon:  'mdi-help-circle', 
                    color: 'yellow darken-1', 
                    title: 'Please note that all the encoded procedure and result will be remove.', 
                    body:  'Do you want to proceed ?', 
                    btn_pry_txt: 'Yes', 
                    btn_pry_color:'primary',
                    btn_pry_otl: false,
                    btn_pry_act: 'loadingBtn',  
                    btn_pry_emt: 'proceedRemove',
                    btn_sec_txt: 'No', 
                    btn_sec_color: 'secondary', 
                    btn_sec_otl: true, 
                    btn_sec_act: 'closeAlert',
                    btn_sec_emt: 'closeProceed',
                }
            }

            sessionStorage.setItem("Mihn42d",this.$crypto.AES.encrypt(JSON.stringify(event),"EMS252")); 
        },

        proceedRemove(){
            this.alert = {}
            this.selected_icd.map(data => {
                data.procedures = []
            })
            this.mutationStatus('phy', '', 'selected_icd_proc');

            sessionStorage.removeItem('pmsh24Dxs')
        },

        closeProceed(){
            this.proceed_result = true
        },

        //OPEN PACKAGE DIALOG - SHOW ONLY ON THE PRIMARY DIAGNOSIS
        openPackageDialog(index) {
            this.selected_index = index;
            this.set_package_procedure = null;
            this.update_set_package_procedure = null;
            this.new_package_name = null;
            this.package_procedure_dialog = true;
            this.getCptPackages();
        },

        //GET DEFAULT AND EXISTING PACKAGE OF PROCEDURES
        async getCptPackages(){
            this.loading_cpt = true
            let response = await this.$services.getCptPackages({
                provider_code : this.$store.state.prv_data.provider_code
            });

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                const array_key = Object.keys(response.data);
                this.cpt_package = array_key;
                this.cpt_package_details = response.data;
                this.loading_cpt = false
            } else {
                this.alert = response.error;
            }
        },

        //TO SHOW LIST OF ITEMS IN MENU
        openMenu() {
            this.$nextTick(() => {
                this.menu = true;
            });
            this.filtered_cpt_package = this.cpt_package; 
        },

        //ALLOW TYPING AGAIN WHEN SELECTED PACKAGE IS CLEARED
        clearSelection() {
            this.new_package_name = '';
            this.is_selected = false; 
            this.filtered_cpt_package = this.cpt_package; 
            this.set_adding_of_new_package_procedure = [];
        },

        //FOR MENU PACKAGE OF PROCEDURE ADD AND UPDATE
        filterItems(value) {
            if (!this.is_selected) { 
                this.new_package_name = value ? value.toUpperCase() : "";
                this.filtered_cpt_package = this.cpt_package
                    .filter(item => typeof item === "string" && item.toLowerCase().includes(value ? value.toLowerCase() : ""));
                this.menu = true;
            }
        },
        
        //SELECTING PACKAGE TO UPDATE
        selectItem(item) {
            this.new_package_name = item; 
            this.menu = false; 
            this.is_selected = true;
            this.set_adding_of_new_package_procedure = [...this.cpt_package_details[item] ];
            this.$nextTick(() => {
                this.set_adding_of_new_package_procedure = [...this.set_adding_of_new_package_procedure];
            });

            this.getCptPackages();
        },

        //ADDING NEW AND UPDATEING PACKAGE OF PROCEDURE
        addUpdatePackage(value) {
            if(value === 'cpt') {
                const new_package_details = this.set_adding_of_new_package_procedure;
                this.$emit('update:selected_cpt_for_new_package', new_package_details, this.new_package_name);
                this.package_procedure_dialog = false;
                this.set_adding_of_new_package_procedure = [];
                this.new_package_name = ''
                this.getCptPackages();
            }
        },

        //ADD PACKAGE PROCEDURE FOR EMR DIAGNOSIS
        addPackageProcedure(value) {
            if (value === 'cpt' && this.set_package_procedure) {
                this.selected_package = this.set_package_procedure; 
                const package_details = this.cpt_package_details[this.selected_package];
                this.$emit('update:selected_package_procedure', package_details, this.selected_index, this.set_package_procedure);
                this.set_package_procedure = null;
            }
            this.package_procedure_dialog = false;
        },
        
        // Reset the selected package
        removeDiagnosis(index) {
            this.$emit('removeDiagnosis', index);
            this.selected_package = ''; 
        },

        addFavorites(value) {
            if(value === 'icd') {
                this.$emit('update:selected_icd_favorites', this.set_icd_favorites)
                this.set_icd_favorites = ''
            }

            if(value === 'cpt') {
                this.$emit('update:selected_cpt_favorites', this.set_cpt_favorites)
                this.set_cpt_favorites = ''
            }
        },

        updateDiagnosis(event) {
            const uppercase = event.toUpperCase();
            this.admitting_diagnosis = uppercase;
            this.mutationStatus('phy', uppercase, 'admitting');
        },

        updateDoctorNotes(event) {
            const capslock = event.toUpperCase();
            this.doctor_notes = capslock;
            this.mutationStatus('phy', capslock, 'dr_notes');
        },

        mutationStatus(item, data, value) {
            this.$emit('mutationStatus', item, data, value)
        },  

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if ((event.which < 48 || event.which > 57) && event.which !== 45){
                event.preventDefault();
            }
        },

        //GET SIGNS AND SYMPTOMS
        async getSignsAndSymptoms() {
            const data = await this.$refs.signs_and_symptoms?.getSignsAndSymptoms();
        
            this.$emit('getSignsAndSymptoms', data)
        },

        //FUNCTION FOR UPDATING SIGN AND SYMPTOMS
        async SaSpostData() {
            const success = await this.$refs.signs_and_symptoms.postData()

            return success
        },

        //FUNCTION FOR CHECKING SIGN AND SYMPTOS IF HAS EMPTY
        async checkFields() {
            const valid = await this.$refs.signs_and_symptoms.checkIfEmpty()

            return valid
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
    .card-border{ box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important; }
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
    .v-text-field input {
        cursor: pointer !important;
    }
    .add-update-package {
        max-height: 300px;
        width: 860px;
    }
    ::v-deep .v-data-table td {
        vertical-align: middle !important;
    }
</style>