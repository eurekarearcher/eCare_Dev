<template>
    <div>
        <Navbar v-if="$store.state.usr_credentials.department === 'Credit and Collection'" />
        <div v-show="display_data" :class="{'mx-4 mx-sm-8' : $store.state.usr_credentials.department === 'Credit and Collection'}">
            <h1 :class="{'mt-3' : $store.state.usr_credentials.department === 'Credit and Collection'}" class="font-weight-medium grey--text text--darken-3 mb-3">Healthcare Facility Report Generating Module</h1>
            <v-row class="mb-4" align="center" dense>
                <v-col cols="12" sm="auto" md="auto" xl="auto">
                    <v-avatar class="light-blue darken-2 white--text" size="40">
                        <h2 class="font-weight-medium">1</h2>
                    </v-avatar>
                </v-col>

                <v-col sm="6" md="6" xl="6">
                     <v-row dense>
                        <v-col cols="12" sm="4" md="4" lg="3" xl="3">
                            <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" :value="formatDate(start_date)" label="Start Date" hide-details outlined readonly dense></v-text-field>
                                </template>
                                <v-date-picker v-model="start_date" :max="max_start_date && end_date" no-title></v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="3" xl="3" class="pl-sm-2">
                            <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" :value="formatDate(end_date)" label="End Date" hide-details outlined readonly dense></v-text-field>
                                </template>
                                <v-date-picker v-model="end_date" :max="max_start_date" :min="start_date" :disabled="!start_date" no-title></v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="6" xl="6" class="pl-2">
                            <div class="d-flex">
                                <v-btn :disabled="loading_data" @click="goFilter" class="white--text" color="primary" height="41">
                                    <v-icon color="white" left>mdi-update</v-icon>
                                    <span>LOAD SELECTED DATES</span>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" md="" xl="" class="text-right">
                    <v-btn @click="clearFilter" color="warning" dark><v-icon left>mdi-filter-remove</v-icon> CLEAR ALL FILTER</v-btn>
                </v-col>
            </v-row>

            <v-row align="center" dense>
                <v-col cols="12" sm="auto" md="auto" xl="auto">
                    <v-avatar class="light-blue darken-2 white--text" size="40">
                        <h2 class="font-weight-medium">2</h2>
                    </v-avatar>
                </v-col>

                <v-col cols="12" sm="" md="" xl="">
                    <v-text-field v-model="search" @click:clear="search = ''" maxlength="40" label="General Search" hide-details outlined clearable dense></v-text-field>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col sm="auto" md="auto" xl="auto">
                    <v-avatar class="light-blue darken-2 white--text mt-10" size="40">
                        <h2 class="font-weight-medium">3</h2>
                    </v-avatar>
                </v-col>

                <v-col sm="11" md="11" xl="11">
                    <h3 class="font-weight-regular mt-2">Advance Search:</h3>
                    <v-row dense>
                        <v-col cols="12" sm="auto" md="auto" xl="auto">
                            <v-badge :value="original_custom_filter.length > 0" :content="original_custom_filter.length" color="success" overlap>
                                <v-btn @click="display_custom_filter = true" color="primary" dark><v-icon left>mdi-filter</v-icon> CUSTOM FILTER</v-btn>
                            </v-badge>
                        </v-col>
                        <v-col cols="12" sm="auto" md="auto" xl="auto">
                            <v-btn @click="getSavedFilter(), display_saved_filter = true" color="primary" outlined dark><v-icon left>mdi-checkbox-multiple-outline</v-icon> SELECT FROM SAVED FILTER(S)</v-btn>
                        </v-col>
                    </v-row>

                    <div v-if="original_custom_filter.length > 0" class="mt-3">
                        <h3 class="font-weight-medium">Filtered Data:</h3>
                        <div class="pl-2">
                            <v-chip v-for="(others, index) in original_custom_filter" :key="index" :color="others.color" class="mr-2 mb-2" small dark>{{ others.value }} <v-icon @click="removeCustomFilter(index)" right small>mdi-close-circle</v-icon></v-chip>
                        </div>
                    </div>
                </v-col>
            </v-row>
              
            <v-row align="baseline" dense>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="align-self-end">
                    <h3 class="font-weight-regular pr-2">Total number of patient / person: <span class="font-weight-medium">{{ filtered_transactions.length }}</span></h3>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="text-right">
                    <label>EXPORT:</label>
                    <v-btn :disabled="loading_data" @click="prepareExcel" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> Excel</v-btn>
                </v-col>
            </v-row>

            <!-- TABLE -->
            <v-data-table :headers="tbl_headers" :items="filtered_transactions" :loading="loading_data" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-1 mt-3 mb-5" item-key="tstamp" mobile-breakpoint="0">
                <template v-slot:item="{ item }">
                    <tr :class="{'grey lighten-2' : item.transaction_number === selected_transaction.transaction_number}" @click="getPatientTransaction(item)">
                        <td>{{ item.tstamp }}</td>
                        <td>{{ item.member_name }}</td>
                        <td>{{ item.mem_age }}</td>
                        <td>{{ item.mem_birthdate }}</td>
                        <td>{{ item.mem_gender }}</td>
                        <td>{{ item.mem_phic_pin }}</td>
                        <td>{{ item.mem_mobile_number }}</td>
                        <td>{{ item.mem_email_address }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>

        <!-- DISPLAY PATIENT TRANSACTION LIST -->
        <v-dialog v-model="display_patient_transaction" width="1600" persistent>
            <v-card class="px-7">
                <h1 class="font-weight-medium grey--text text--darken-3 pt-4 pb-2">Name: {{ selected_transaction.member_name }}</h1>
                <v-row class="mb-4" align="center" dense>
                    <v-col cols="12" md="auto" xl="auto">
                        <v-avatar class="light-blue darken-2 white--text" size="40">
                            <h2 class="font-weight-medium">1</h2>
                        </v-avatar>
                    </v-col>

                    <v-col cols="12" md="6" xl="6">
                        <v-row dense>
                            <v-col cols="12" sm="4" md="4" lg="3" xl="3">
                                <v-text-field :value="formatDate(start_date)" label="Start Date" hide-details outlined disabled dense></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="4" md="4" lg="3" xl="3" class="pl-sm-2">
                                <v-text-field :value="formatDate(end_date)" label="End Date" hide-details outlined disabled dense></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="4" md="4" lg="6" xl="6" class="pl-2">
                                <div class="d-flex">
                                    <v-btn class="white--text" color="primary" height="41" disabled>
                                        <v-icon color="white" left>mdi-update</v-icon>
                                        <span>LOAD SELECTED DATES</span>
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" md="" xl="" class="text-right">
                        <v-btn @click="clearFilter" color="warning" dark><v-icon left>mdi-filter-remove</v-icon> CLEAR ALL FILTER</v-btn>
                    </v-col>
                </v-row>

                <v-row align="center" dense>
                    <v-col cols="12" md="auto" xl="auto">
                        <v-avatar class="light-blue darken-2 white--text" size="40">
                            <h2 class="font-weight-medium">2</h2>
                        </v-avatar>
                    </v-col>

                    <v-col cols="12" md="" xl="">
                        <v-text-field v-model="p_search" @click:clear="p_search = ''" maxlength="40" label="General Search" hide-details outlined clearable dense></v-text-field>
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col cols="12" md="auto" xl="auto">
                        <v-avatar class="light-blue darken-2 white--text mt-10" size="40">
                            <h2 class="font-weight-medium">3</h2>
                        </v-avatar>
                    </v-col>

                    <v-col cols="12" md="11" xl="11">
                        <h3 class="font-weight-regular mt-2">Advance Search:</h3>
                        <v-row dense>
                            <v-col cols="12" md="auto" xl="auto">
                                <v-badge :value="p_original_custom_filter.length > 0" :content="p_original_custom_filter.length" color="success" overlap>
                                    <v-btn @click="display_custom_filter = true" color="primary" dark><v-icon left>mdi-filter</v-icon> CUSTOM FILTER</v-btn>
                                </v-badge>
                            </v-col>
                            <v-col cols="12" md="auto" xl="auto">
                                <v-btn @click="getSavedFilter(), display_saved_filter = true" color="primary" outlined dark><v-icon left>mdi-checkbox-multiple-outline</v-icon> SELECT FROM SAVED FILTER(S)</v-btn>
                            </v-col>
                        </v-row>

                        <div v-if="p_original_custom_filter.length > 0" class="mt-3">
                            <h3 class="font-weight-medium">Filtered Data:</h3>
                            <div class="pl-2">
                                <v-chip v-for="(others, index) in p_original_custom_filter" :key="index" :color="others.color" class="mr-2 mb-2" small dark>{{ others.value }} <v-icon @click="removeCustomFilter(index)" right small>mdi-close-circle</v-icon></v-chip>
                            </div>
                        </div>
                    </v-col>
                </v-row>

                <v-row justify="end" class="mt-n3" dense>
                    <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="text-right">
                        <label>EXPORT:</label>
                        <v-btn :disabled="loading_data" @click="prepareExcel" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> Excel</v-btn>
                    </v-col>
                </v-row>

                <v-data-table :headers="tbl_headers_patient" :items="p_filtered_transactions" :loading="loading_data" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :items-per-page="5" class="elevation-1 mt-3 mb-5" item-key="tstamp" mobile-breakpoint="0">
                    <template v-slot:item="{ item }">
                        <tr @dblclick="viewMoreInfo(item.transaction_number, item.doctor_note, item.hmo_cc_notes,item.hmo_approval_code)">
                            <td>{{ item.tstamp }}</td>
                            <td>{{ item.transaction_type }}</td>
                            <td>{{ item.doctor_name }}</td>
                            <td>{{ item.created_by }}</td>
                            <td>{{ item.chief_complaint }}</td>
                            <td>{{ item.transaction_status }}</td>
                            <td>{{ item.bmi_remarks }}</td>
                            <td>{{ item.purpose_of_visit_service_availed }}</td>
                            <td>{{ item.prv_name }}</td>
                        </tr>
                    </template>
                </v-data-table>

                <div class="text-center pb-4">
                    <v-btn @click="closePatientTransaction" large>CLOSE</v-btn>
                </div>
            </v-card>
        </v-dialog>

        <!-- DISPLAY CUSTOM FILTER -->
        <v-dialog v-model="display_custom_filter" width="1050" persistent>
            <v-card class="px-6 py-5">
                <h3 v-if="edit_saved_filter.display"><span class="font-weight-regular">Filter Name:</span> {{ edit_saved_filter.key }}</h3>
                <h3 v-else><v-icon class="mr-1 mt-n1" color="black" size="30">mdi-filter-variant</v-icon> Filter</h3>
                <v-divider class="mt-3"></v-divider>

                <v-row v-if="custom_filter_data.length > 0" class="font-weight-medium text-center body-2 mt-2" dense>
                    <v-col cols="4">FIELD</v-col>
                    <v-col cols="8">VALUE</v-col>
                </v-row>
                
                <v-row v-for="(others, index) in custom_filter_data" :key="index" dense>
                    <v-col cols="4">
                        <v-text-field v-model="others.filter" class="body-2" hide-details readonly outlined dense>
                            <template v-slot:prepend-inner>
                                <v-icon :color="others.color">mdi-checkbox-blank</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="8">
                        <v-combobox v-if="others.filter === 'Healthcare Facility'" v-model="others.value" :items="provider_items" :loading="loading_providers" @focus="current_filter_value = others.value" @blur="others.value = current_filter_value" @click:append-outer="removeCustomFilter(index)" class="body-2" append-outer-icon="mdi-delete" hide-details outlined dense>
                            <template v-slot:item="{ attrs, on, item }">
                                <v-list-item v-bind="attrs" v-on="on" @click="addCustomFilterValue(index, item)">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-combobox>

                        <v-autocomplete v-else-if="others.filter === 'Patient Name'" v-model="others.value" :items="name_items" :ref="'field'+index" @click:append-outer="removeCustomFilter(index)" class="body-2" append-outer-icon="mdi-delete" hide-details outlined dense></v-autocomplete>

                        <v-row v-else-if="others.filter === 'Age'" class="mt-n1" dense>
                            <v-col cols="12" sm="6" lg="4">
                                <v-select v-model="first_age_condition" :items="age_condition_items" class="body-2" item-text="value" item-disabled="disabled" hide-details outlined dense>
                                    <template v-slot:selection="{ item }">
                                        <span class="black--text">{{ item.value }}</span>
                                    </template>
                                </v-select>
                            </v-col>

                            <v-col cols="12" sm="6" lg="">
                                <v-text-field v-model="first_age_value" v-on:keypress="numberOnly" class="body-2" maxlength="3" onpaste="return false" hide-details outlined dense></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" lg="4">
                                <v-select v-model="second_age_condition" :items="age_condition_items" class="body-2" item-text="value" item-disabled="disabled" hide-details outlined dense>
                                    <template v-slot:selection="{ item }">
                                        <span class="black--text">{{ item.value }}</span>
                                    </template>
                                </v-select>
                            </v-col>

                            <v-col cols="10" sm="4" lg="">
                                <v-text-field v-model="second_age_value" v-on:keypress="numberOnly" class="body-2" maxlength="3" onpaste="return false" hide-details outlined dense></v-text-field>
                            </v-col>

                            <v-col align-self="center" cols="2" sm="auto" lg="auto">
                                <v-icon @click="removeCustomFilter(index)">mdi-delete</v-icon>
                            </v-col>
                        </v-row>
     
                        <v-select v-else-if="others.filter === 'Gender'" v-model="others.value" :items="gender_items" @click:append-outer="removeCustomFilter(index)" class="body-2" item-text="value" item-disabled="disabled" append-outer-icon="mdi-delete" hide-details outlined dense>
                            <template v-slot:selection="{ item }">
                                <span class="black--text">{{ item.value }}</span>
                            </template>
                        </v-select>

                        <v-select v-else-if="others.filter === 'Transaction Type'" v-model="others.value" :items="transaction_type_items" @click:append-outer="removeCustomFilter(index)" class="body-2" item-text="value" item-disabled="disabled" append-outer-icon="mdi-delete" hide-details outlined dense>
                            <template v-slot:selection="{ item }">
                                <span class="black--text">{{ item.value }}</span>
                            </template>
                        </v-select>

                        <v-autocomplete v-else-if="others.filter === 'Doctor'" v-model="others.value" :items="doctor_name_items" @click:append-outer="removeCustomFilter(index)" class="body-2" append-outer-icon="mdi-delete" hide-details outlined dense>
                            <template v-slot:prepend-item>
                                <h5 class="font-weight-regular font-italic grey lighten-2 px-4 py-2 mt-n1"><span class="required">*</span> The doctor does not have any transactions if he/she does not exist in the selection.</h5>
                            </template>
                        </v-autocomplete>

                        <v-combobox v-else-if="others.filter === 'Created By'" v-model="others.value" :items="created_by_items" @focus="current_filter_value = others.value" @blur="others.value = current_filter_value" @click:append-outer="removeCustomFilter(index)" class="body-2" append-outer-icon="mdi-delete" hide-details outlined dense>
                            <template v-slot:item="{ attrs, on, item }">
                                <v-list-item v-bind="attrs" v-on="on" @click="addCustomFilterValue(index, item)">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-combobox>

                        <v-combobox v-else-if="others.filter === 'Transaction Status'" v-model="others.value" :items="transaction_status_items" @focus="current_filter_value = others.value" @blur="others.value = current_filter_value" @click:append-outer="removeCustomFilter(index)" class="body-2" append-outer-icon="mdi-delete" hide-details outlined dense>
                            <template v-slot:item="{ attrs, on, item }">
                                <v-list-item v-bind="attrs" v-on="on" @click="addCustomFilterValue(index, item)">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-combobox>

                        <v-combobox v-else-if="others.filter === 'Service Availed'" v-model="others.value" :items="purpose_of_visit_service_availed_items" @focus="current_filter_value = others.value" @blur="others.value = current_filter_value" @click:append-outer="removeCustomFilter(index)" class="body-2" append-outer-icon="mdi-delete" hide-details outlined dense>
                            <template v-slot:item="{ attrs, on, item }">
                                <v-list-item v-bind="attrs" v-on="on" @click="addCustomFilterValue(index, item)">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-combobox>

                        <v-combobox v-else-if="others.filter === 'BMI Remarks'" v-model="others.value" :items="bmi_remarks_items" @focus="current_filter_value = others.value" @blur="others.value = current_filter_value" @click:append-outer="removeCustomFilter(index)" class="body-2" append-outer-icon="mdi-delete" hide-details outlined dense>
                            <template v-slot:item="{ attrs, on, item }">
                                <v-list-item v-bind="attrs" v-on="on" @click="addCustomFilterValue(index, item)">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-combobox>

                        <v-combobox v-else-if="others.filter === 'ICD Description'" v-model="others.value" :items="icd_description_items" :loading="$store.state.loading_icd" @focus="current_filter_value = others.value" @blur="others.value = current_filter_value" @click:append-outer="removeCustomFilter(index)" class="body-2" append-outer-icon="mdi-delete" hide-details outlined dense>
                            <template v-slot:item="{ attrs, on, item }">
                                <v-list-item v-bind="attrs" v-on="on" @click="addCustomFilterValue(index, item)">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-combobox>

                        <v-combobox v-else-if="others.filter === 'CPT Description'" v-model="others.value" :items="cpt_description_items" :loading="$store.state.loading_cpt" @focus="current_filter_value = others.value" @blur="others.value = current_filter_value" @click:append-outer="removeCustomFilter(index)" class="body-2" append-outer-icon="mdi-delete" hide-details outlined dense>
                            <template v-slot:item="{ attrs, on, item }">
                                <v-list-item v-bind="attrs" v-on="on" @click="addCustomFilterValue(index, item)">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-combobox>
                    </v-col>
                </v-row>

                <v-divider v-if="custom_filter_data.length > 0" class="mt-5"></v-divider>
                <v-autocomplete v-model="custom_filter_data_holder" :items="custom_filter_data_items" class="mt-5" item-text="filter" placeholder="Add a Filter" hide-details outlined dense>
                    <template v-slot:item="{ attrs, on, item }">
                        <v-list-item v-bind="attrs" v-on="on" @click="addCustomFilter(item)" class="text-uppercase" wrap>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <v-icon :color="item.color" small>mdi-checkbox-blank</v-icon> - {{ item.filter }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-autocomplete>

                <div v-if="edit_saved_filter.display" class="text-right mt-6">
                    <v-btn @click="closeEditFilter" color="primary" outlined>CANCEL</v-btn>
                    <v-btn @click="confirmSaveEditFilter" class="ml-3" color="primary">SAVE CHANGES</v-btn>
                </div>

                <div v-else class="text-right mt-6">
                    <v-btn @click="validateSaveFilter" color="primary" outlined>SAVE FILTER</v-btn>
                    <v-btn @click="doneFilter" class="ml-3" color="primary">DONE</v-btn>
                </div>
            </v-card>
        </v-dialog>

        <!-- DISPLAY FILTER NAME -->
        <v-dialog v-model="display_filter_name" width="400" persistent>
            <v-card class="pa-5">
                <label class="font-weight-medium">Filter Name</label>
                <v-text-field v-model="filter_name" placeholder="Enter the filter name" hide-details outlined></v-text-field>

                <v-layout justify-end wrap mt-4>
                    <v-btn @click="display_filter_name = false, filter_name = ''" small>CLOSE</v-btn>
                    <v-btn :disabled="!filter_name" :loading="loading_saved_filter" @click="saveCustomFilter" class="ml-2" color="primary" small>CONFIRM</v-btn>
                </v-layout>
            </v-card>
        </v-dialog>

        <!-- DISPLAY SAVED FILTER -->
        <v-dialog v-model="display_saved_filter" width="1100" persistent>
            <v-card class="pa-5">
                <h3><v-icon class="mr-1 mt-n1" color="black" size="30">mdi-filter-variant</v-icon> Saved Filter(s)</h3>
                <v-divider class="mt-3 mb-5"></v-divider>
                
                <v-text-field v-model="saved_filter_search" prepend-inner-icon="mdi-magnify" label="Search by Filter Name" hide-details outlined></v-text-field>
                <v-data-table :headers="saved_filter_headers" :items="saved_filter_items" :search="saved_filter_search" :loading="loading_saved_filter" :items-per-page="5" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-1 mt-3 mb-5" mobile-breakpoint="0">
                    <template v-slot:item="{ item }">
                        <tr :class="{'grey lighten-2' : item.filter_name === selected_saved_filter}">
                            <td @click="item.filter_name === selected_saved_filter ? editSavedFilter(item.filter_name) : selected_saved_filter = item.filter_name">{{ item.filter_name }}</td>
                            <td>
                                <v-btn @click="confirmDeleteSavedFilter(item.filter_name)" color="error" outlined small>DELETE</v-btn>
                                <v-btn @click="editSavedFilter(item.filter_name)" class="mx-3" color="primary" outlined small>EDIT</v-btn>
                                <v-btn @click="useThisFilter(item.filter_name)" color="primary" small>USE THIS FILTER</v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
                <v-divider class="mt-6 mb-5"></v-divider>

                <v-layout justify-center>
                    <v-btn @click="display_saved_filter = false">CLOSE</v-btn>
                </v-layout>
            </v-card>
        </v-dialog>

        <!-- GENERATE EXCEL LOADER -->
        <v-dialog v-model="generate_excel_loader" width="500" persistent>
            <v-card class="text-center py-12">
                <v-progress-circular color="primary" width="6" size="80" indeterminate></v-progress-circular>
                <h3 class="light-blue--text text--darken-4 pl-5 mt-5">Generating Excel...</h3>
            </v-card>
        </v-dialog>

        <!-- CLOSE VIEW MORE INFO -->
        <ViewMoreInfo @closeViewMoreInfo="display_patient_transaction = true" ref="view_more_info"/>

        <Alert :alert="alert" @deleteSavedFilter="deleteSavedFilter" @saveEditFilter="saveEditFilter" />
    </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Alert  from '@/components/Alert'
import ViewMoreInfo from '@/components/admin/reports/medical-transaction/ViewMoreInfo'

export default {
    components:{
        Navbar,
        Alert,
        ViewMoreInfo
    },

    data(){
        return{
            // FILTER
            search: '',
            icd_filter: '',
            previous_start_date: '',
            start_date: this.$moment(this.$moment().subtract(1, 'months')).format('YYYY-MM-DD'),
            end_date: this.$moment().format('YYYY-MM-DD'),
            start_date_filter: this.$moment(this.$moment().subtract(1, 'months')).format('YYYY-MM-DD'),
            end_date_filter: this.$moment().format('YYYY-MM-DD'),
            period_filter: '',
            trans_type_filter: 'ALL',
            purpose_of_visit: 'ALL',
            p_search: '',
            p_icd_filter: '',
            p_bmi_remarks_filter: 'ALL',
            p_previous_start_date: '',
            p_start_date: this.$moment(this.$moment().subtract(1, 'months')).format('YYYY-MM-DD'),
            p_end_date: this.$moment().format('YYYY-MM-DD'),
            p_start_date_filter: this.$moment(this.$moment().subtract(1, 'months')).format('YYYY-MM-DD'),
            p_end_date_filter: this.$moment().format('YYYY-MM-DD'),
            p_period_filter: '',
            p_trans_type_filter: 'ALL',
            p_purpose_of_visit: 'ALL',
            max_start_date: this.$moment().format('YYYY-MM-DD'),

            // TABLE
            all_transactions: [],
            icd_data: [],
            cpt_data: [],
            tbl_headers: [
                { text: 'DATE CREATED', value: 'tstamp', width: '200px' },
                { text: 'PATIENT NAME', value: 'member_name', width: '300px', sortable: false },
                { text: 'AGE', value: 'mem_age', width: '200px', sortable: false },
                { text: 'BIRTHDAY', value: 'mem_birthdate', width: '200px', sortable: false },
                { text: 'GENDER', value: 'mem_gender', width: '200px', sortable: false },
                { text: 'PHIC NUMBER', value: 'mem_phic_pin', width: '200px', sortable: false },
                { text: 'CONTACT NUMBER', value: 'mem_mobile_number', width: '200px', sortable: false },
                { text: 'EMAIL', value: 'mem_email_address', width: '200px', sortable: false }
            ],
            
            // PATIENT TRANSACTION
            display_patient_transaction: false,
            tbl_headers_patient: [
                { text: 'DATE', value: 'tstamp', width: '200px' },
                { text: 'TRANSACTION TYPE', value: 'transaction_type', width: '200px', sortable: false },
                { text: 'DOCTOR', value: 'doctor_name', width: '200px', sortable: false },
                { text: 'CREATED BY', value: 'created_by', width: '200px', sortable: false },
                { text: 'CHIEF COMPLAINT', value: 'chief_complaint', width: '300px', sortable: false },
                { text: 'TRANSACTION STATUS', value: 'transaction_status', width: '200px', sortable: false },
                { text: 'BMI REMARKS', value: 'bmi_remarks', width: '200px', sortable: false },
                { text: 'SERVICE AVAILED', value: 'purpose_of_visit_service_availed', width: '200px', sortable: false },
                { text: 'HEALTHCARE FACILITY', value: 'prv_name', width: '220px', sortable: false },
                // { text: 'ACTION', value: '', width: '400px', sortable: false }
            ],
            p_all_transactions: [],

            // LOADER DISPLAY
            loading_data: true,
            loading_icd_cpt: true,
            loading_providers: true,
            generate_excel_loader: false,

            // CUSTOM FILTER
            display_custom_filter: false,
            custom_filtered_transaction: [],
            original_custom_filter: [],
            temporary_custom_filter: [],
            current_filter_value: '',
            custom_filter_data_holder: {},            
            first_age_condition: '',
            first_age_value: '',
            second_age_condition: '',
            second_age_value: '',
            display_filter_name: false,
            filter_name: '',
            p_current_filter: '',
            p_custom_filtered_transaction: [],
            p_original_custom_filter: [],
            p_temporary_custom_filter: [],
            
            // CUSTOM FILTER LIST & ITEMS
            provider_items: [],
            name_items: [],
            doctor_name_items: [],
            created_by_list: [],
            transaction_status_list: [],
            purpose_of_visit_service_availed_list: [],
            bmi_remarks_list: [],

            // SAVED FILTER
            display_saved_filter: false,
            loading_saved_filter: false,
            current_filter: '',
            selected_saved_filter: '',
            saved_filter_search: '',
            saved_filter_headers: [
                { text: 'FILTER NAME', value: 'filter_name', width: '440px', sortable: false },
                { text: 'ACTION', value: '', width: '200px', sortable: false }
            ],
            saved_filter_items: [],
            saved_filter: [],
            edit_saved_filter: {
                display: false,
                key: '',
                age_condition_1: '',
                age_field_1: '',
                age_condition_2: '',
                age_field_2: ''
            },
   
            // OTHERS
            display_data: true,
            purpose_of_visit_items: ['ALL', 'Dental Care', 'General', 'Prenatal', 'Family Planning', 'Injury', 'Sick Children', 'Firecracker Injury', 'Post-Partum', 'Tuberculosis'],
            export_excel_data: [],
            selected_transaction: {
                transaction_number: '',
                ek_lgu_id: '',
                member_name: '',
                display: false
            },
            alert: {}
        }
    },

    created(){
       this.getAllTransactions();
    },

    computed: {
        filtered_transactions(){
            let transactions = []
            if(this.custom_filtered_transaction === 'No Data'){
                transactions = []
            }else if(this.custom_filtered_transaction.length > 0){
                transactions = this.custom_filtered_transaction
            }else{
                transactions = this.all_transactions
            }

            let filtered = transactions.length === 0 ? [] : transactions.filter((i) => {
                let searched_data =
                (i.tstamp.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
                (i.member_name.toLowerCase().indexOf(this.search.toLowerCase()) > -1) || 
                (i.mem_age.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
                (i.mem_birthdate.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
                (i.mem_gender.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
                (i.mem_phic_pin.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
                (i.mem_mobile_number.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
                (i.mem_email_address.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
                (i.transaction_type.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
                (i.doctor_name.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
                (i.created_by.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
                (i.chief_complaint.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
                (i.transaction_status.toLowerCase().indexOf(this.search.toLowerCase()) > -1) || 
                (i.purpose_of_visit_service_availed.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
                (i.icd_code ? i.icd_code.toLowerCase().indexOf(this.search.toLowerCase()) > -1 : '') ||
                (i.icd_description ? i.icd_description.toLowerCase().indexOf(this.search.toLowerCase()) > -1 : '') ||
                (i.bmi_remarks ? i.bmi_remarks.toLowerCase().indexOf(this.search.toLowerCase()) > -1 : null) || 
                (i.prv_name ? i.prv_name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 : null)

                let date = new Date(i.tstamp.substring(0, 10)).setHours(0, 0, 0, 0);
                let search = this.search ? searched_data : true
                let date_filter = date >= new Date(this.start_date_filter).setHours(0, 0, 0, 0) && date <= new Date(this.end_date_filter).setHours(0, 0, 0, 0)

                return search && date_filter
            })

            if(this.generate_excel_loader){
                return filtered
            }else{
                let grouped = filtered.reduce((previous_value, current_value) => {
                    let index = previous_value.findIndex((entry) => entry.ek_lgu_id === current_value.ek_lgu_id)
                    if(index >= 0){
                        let previous = new Date(previous_value[index].tstamp.substring(0, 10)).setHours(0, 0, 0, 0)
                        let current = new Date(current_value.tstamp.substring(0, 10)).setHours(0, 0, 0, 0)
    
                        if(previous < current){
                            previous_value[index] = current_value
                        }
                    }else{
                        previous_value.push(current_value)
                    }
    
                    return previous_value
                }, [])
                
                return grouped
            }
        },

        p_filtered_transactions(){
            let transactions = []
            if(this.p_custom_filtered_transaction === 'No Data'){
                transactions = []
            }else if(this.p_custom_filtered_transaction.length > 0){
                transactions = this.p_custom_filtered_transaction
            }else{
                transactions = this.p_all_transactions
            }

            let filtered = transactions.filter((i) => {
                let searched_data =
                (i.tstamp.toLowerCase().indexOf(this.p_search.toLowerCase()) > -1) ||
                (i.transaction_type.toLowerCase().indexOf(this.p_search.toLowerCase()) > -1) ||
                (i.doctor_name.toLowerCase().indexOf(this.p_search.toLowerCase()) > -1) ||
                (i.created_by.toLowerCase().indexOf(this.p_search.toLowerCase()) > -1) ||
                (i.chief_complaint.toLowerCase().indexOf(this.p_search.toLowerCase()) > -1) ||
                (i.transaction_status.toLowerCase().indexOf(this.p_search.toLowerCase()) > -1) || 
                (i.bmi_remarks.toLowerCase().indexOf(this.p_search.toLowerCase()) > -1) ||
                (i.purpose_of_visit_service_availed.toLowerCase().indexOf(this.p_search.toLowerCase()) > -1) ||
                (i.prv_name.toLowerCase().indexOf(this.p_search.toLowerCase()) > -1)
                
                let search = this.p_search ? searched_data : true

                return search
            })

            return filtered
        },

        custom_filter_data(){
            if(this.display_patient_transaction){
                if(this.edit_saved_filter.display){
                    return this.p_temporary_custom_filter
                }else{
                    return this.p_original_custom_filter
                }
            }else{
                if(this.edit_saved_filter.display){
                    return this.temporary_custom_filter
                }else{
                    return this.original_custom_filter
                }
            }
        },

        custom_filter_data_items(){
            let items = [
                { filter: 'Healthcare Facility', color: 'red' },
                { filter: 'Patient Name', color: 'light-blue' },
                { filter: 'Age', color: 'indigo' },
                { filter: 'Gender', color: 'blue' },
                { filter: 'Transaction Type', color: 'cyan' },
                { filter: 'Doctor', color: 'teal' },
                { filter: 'Created By', color: 'green' },
                { filter: 'Transaction Status', color: 'lime' },
                { filter: 'Service Availed', color: 'deep-purple' },
                { filter: 'BMI Remarks', color: 'amber' },
                { filter: 'ICD Description', color: 'deep-orange' },
                { filter: 'CPT Description', color: 'blue-grey' }
            ]

            if(this.display_patient_transaction){
                items.splice(1, 3)
            }else{
                let find_age = this.custom_filter_data.some(element => element.filter === 'Age')
                if(find_age) items.splice(2, 1)
    
                let find_gender = this.custom_filter_data.some(element => element.filter === 'Gender' && element.value === 'ALL')
                let gender_length = this.custom_filter_data.filter(element => element.filter === 'Gender')
                if(find_gender || gender_length.length === 2) items.splice(3, 1)
                
                let find_transaction_type = this.custom_filter_data.some(element => element.filter === 'Transaction Type' && element.value === 'ALL')
                let transaction_type_length = this.custom_filter_data.filter(element => element.filter === 'Transaction Type')
                if(find_transaction_type || transaction_type_length.length === 2) items.splice(4, 1)
    
                if(this.created_by_filter.includes('ALL') || this.created_by_filter.length === this.created_by_list.length) items.splice(6, 1)
                if(this.transaction_status_filter.includes('ALL') || this.transaction_status_filter.length === this.transaction_status_list.length) items.splice(7, 1)
                if(this.purpose_of_visit_service_availed_filter.includes('ALL') || this.purpose_of_visit_service_availed_filter.length === this.purpose_of_visit_service_availed_list.length) items.splice(8, 1)
                if(this.bmi_remarks_filter.includes('ALL') || this.bmi_remarks_filter.length === this.bmi_remarks_list.length) items.splice(9, 1)
            }
            
            return items
        },

        age_condition_items(){
            let disable_less = this.first_age_condition === 'less than' || this.second_age_condition === 'less than'
            let disable_greater = this.first_age_condition === 'greater than' || this.second_age_condition === 'greater than'

            let items = [
                { value: 'less than', disabled: disable_less },
                { value: 'greater than', disabled: disable_greater }
            ]
            
            return items
        },

        gender_items(){
            let gender_value = []
            let items = [
                { value: 'ALL', disabled: false },
                { value: 'MALE', disabled: false },
                { value: 'FEMALE', disabled: false }
            ]

            this.custom_filter_data.forEach(element => {
                if(element.filter === 'Gender'){
                    gender_value.push(element.value)
                }
            })

            if(gender_value.includes('MALE')) items[1].disabled = true
            if(gender_value.includes('FEMALE')) items[2].disabled = true
            if(gender_value.includes('MALE') || gender_value.includes('FEMALE') || items.length === 2){
                items.splice(0, 1)
            }
            
            if(gender_value.includes('ALL')){
                items = [{ value: 'ALL', disabled: true }]
            }

            return items
        },

        transaction_type_items(){
            let transaction_type_value = []
            let items = [
                { value: 'ALL', disabled: false },
                { value: 'CONSULTATION', disabled: false },
                { value: 'OUTPATIENT', disabled: false },
                { value: 'INPATIENT', disabled: false }
            ]

            this.custom_filter_data.forEach(element => {
                if(element.filter === 'Transaction Type'){
                    transaction_type_value.push(element.value)
                }
            })

            if(transaction_type_value.includes('CONSULTATION')) items[1].disabled = true
            if(transaction_type_value.includes('OUTPATIENT')) items[2].disabled = true
            if(transaction_type_value.includes('INPATIENT')) items[3].disabled = true
            if(transaction_type_value.includes('CONSULTATION') || transaction_type_value.includes('OUTPATIENT') || transaction_type_value.includes('INPATIENT') || items.length === 3){
                items.splice(0, 1)
            }
            
            if(transaction_type_value.includes('ALL')){
                items = [{ value: 'ALL', disabled: true }]
            }

            return items
        },

        created_by_filter(){
            let created_by_filter = this.custom_filter_data.filter(item => item.filter === 'Created By')
            return created_by_filter.map(element => element.value)
        },

        created_by_items(){
            const created_by = this.created_by_list.filter(item => {
                if(this.created_by_filter.includes('ALL')){
                    return false
                }else{
                    return !this.created_by_filter.includes(item)
                }
            })
            
            let count = 0
            this.custom_filter_data.forEach(element => {
                if(element.filter === 'Created By'){
                    if(element.value){
                        count++
                    }
                }
            })

            if(count === 0) created_by.unshift('ALL')
            return created_by
        },

        transaction_status_filter(){
            let transaction_status_filter = this.custom_filter_data.filter(item => item.filter === 'Transaction Status')
            return transaction_status_filter.map(element => element.value)
        },

        transaction_status_items(){
            const transaction_status = this.transaction_status_list.filter(item => {
                if(this.transaction_status_filter.includes('ALL')){
                    return false
                }else{
                    return !this.transaction_status_filter.includes(item)
                }
            })
            
            let count = 0
            this.custom_filter_data.forEach(element => {
                if(element.filter === 'Transaction Status'){
                    if(element.value){
                        count++
                    }
                }
            })

            if(count === 0) transaction_status.unshift('ALL')
            return transaction_status
        },

        purpose_of_visit_service_availed_filter(){
            let purpose_of_visit_service_availed_filter = this.custom_filter_data.filter(item => item.filter === 'Service Availed')
            return purpose_of_visit_service_availed_filter.map(element => element.value)
        },

        purpose_of_visit_service_availed_items(){
            const purpose_of_visit_service_availed = this.purpose_of_visit_service_availed_list.filter(item => {
                if(this.purpose_of_visit_service_availed_filter.includes('ALL')){
                    return false
                }else{
                    return !this.purpose_of_visit_service_availed_filter.includes(item)
                }
            })
            
            let count = 0
            this.custom_filter_data.forEach(element => {
                if(element.filter === 'Service Availed'){
                    if(element.value){
                        count++
                    }
                }
            })

            if(count === 0) purpose_of_visit_service_availed.unshift('ALL')
            return purpose_of_visit_service_availed
        },

        bmi_remarks_filter(){
            let bmi_remarks_filter = this.custom_filter_data.filter(item => item.filter === 'BMI Remarks')
            return bmi_remarks_filter.map(element => element.value)
        },

        bmi_remarks_items(){
            const bmi_remarks = this.bmi_remarks_list.filter(item => {
                if(this.bmi_remarks_filter.includes('ALL')){
                    return false
                }else{
                    return !this.bmi_remarks_filter.includes(item)
                }
            })
            
            let count = 0
            this.custom_filter_data.forEach(element => {
                if(element.filter === 'BMI Remarks'){
                    if(element.value){
                        count++
                    }
                }
            })

            if(count === 0) bmi_remarks.unshift('ALL')
            return bmi_remarks
        },

        icd_description_filter(){
            let icd_description_filter = this.custom_filter_data.filter(item => item.filter === 'ICD Description')
            return icd_description_filter.map(element => element.value)
        },

        icd_description_items(){
            const icd_map = this.$store.state.icd_list.map(element => element.icd_description)
            const icd_list = icd_map.filter(item => {
                return !this.icd_description_filter.includes(item)
            })

            return icd_list
        },

        cpt_description_filter(){
            let cpt_description_filter = this.custom_filter_data.filter(item => item.filter === 'CPT Description')
            return cpt_description_filter.map(element => element.value)
        },

        cpt_description_items(){
            const cpt_map = this.$store.state.cpt_list.map(element => element.cpt_description)
            const cpt_list = cpt_map.filter(item => {
                return !this.cpt_description_filter.includes(item)
            })

            return cpt_list
        }
    },

    methods: {
        // GET TRANSACTIONS
        async getAllTransactions(){
            let response = await this.$services.getTransactionAllPr({
                start_date: this.start_date,
                end_date: this.end_date,
                provider_code: this.$store.state.prv_data.provider_code,
                provider_tin: this.$store.state.prv_data.provider_tin,
                ...(this.display_patient_transaction ? {ek_lgu_id: this.selected_transaction.ek_lgu_id} : undefined),
                ...(this.$store.state.usr_credentials.provider_reg_type !== 'BRGY' ? {
                    prv_reg_type: this.$store.state.usr_credentials.provider_reg_type,
                    lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
                } : undefined)
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)

                let transaction_list = []

                if(response.data === 'Data not found.'){
                    if(this.display_patient_transaction){
                        this.p_all_transactions = transaction_list
                    }else{
                        this.all_transactions = transaction_list
                    }

                    this.loading_data = false
                }else{
                    transaction_list = response.data.map(item => {
                        let data = {
                            tstamp: this.formatDateAndTime(item.tstamp),
                            member_name: this.displayNA(item.member_name.trim()).toUpperCase(),
                            mem_age: this.getAge(item.mem_birthdate),
                            mem_birthdate: this.displayNA(this.formatDate(item.mem_birthdate)),
                            mem_gender: this.displayNA(this.formatGender(item.mem_gender)),
                            mem_phic_pin: this.displayNA(item.mem_phic_pin),
                            mem_mobile_number: this.displayNA(item.mem_mobile_number),
                            mem_email_address: this.displayNA(item.mem_email_address),
                            transaction_number: item.transaction_number,
                            transaction_type: item.transaction_type === 'PRE CONSULTATION' ? 'CONSULTATION' : item.transaction_type,
                            doctor_name: this.displayNA(item.doctor_name),
                            created_by: item.created_by,
                            chief_complaint: this.displayNA(item.chief_complaint),
                            transaction_status: item.transaction_status,
                            purpose_of_visit_service_availed: this.displayNA(item.purpose_of_visit_service_availed),
                            prv_name: item.provider_name,
                            doctor_note: this.displayNA(item.doctor_note),
                            hmo_cc_notes: this.displayNA(item.hmo_cc_notes),
                            icd_code: '',
                            icd_description: '',
                            bmi_remarks: '',
                            ek_lgu_id: item.ek_lgu_id,
                            hmo_approval_code: this.displayNA(item.hmo_approval_code),
                            cpt_list: []
                        }
                        return data
                    })

                    this.getICDandBMI(transaction_list);
                }
            } else {
                this.alert = response.error
            }
        },

        // GET ICD AND BMI REMARKS
        async getICDandBMI(transaction_list){
            let request_type = this.$store.state.usr_credentials.provider_reg_type === 'PHO' || this.$store.state.usr_credentials.provider_reg_type === 'MHO' || this.$store.state.usr_credentials.provider_reg_type === 'CHO' ? 'HR' : 'PR'
            let response_icd = await this.$services.getTransactionIcdBmi({
                request_type: request_type,
                start_date: this.start_date,
                end_date: this.end_date,
                prv_reg_type: this.$store.state.usr_credentials.provider_reg_type,
                provider_code: this.$store.state.prv_data.provider_code,
                provider_tin: this.$store.state.prv_data.provider_tin,
                ...(this.display_patient_transaction ? {ek_lgu_id: this.selected_transaction.ek_lgu_id} : undefined),
                ...(this.$store.state.usr_credentials.provider_reg_type === 'PHO' || this.$store.state.usr_credentials.provider_reg_type === 'MHO' || this.$store.state.usr_credentials.provider_reg_type === 'CHO' ? {
                    lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,

                } : undefined)               
            })

            if(response_icd.status === 200) {
                response_icd.data = this.responseDataDecryption(response_icd.data)
                let response_cpt = await this.$services.getTransactionIcdBmi({
                    request_type: request_type,
                    request_key: 'get_cpt_list',
                    start_date: this.start_date,
                    end_date: this.end_date,
                    prv_reg_type: this.$store.state.usr_credentials.provider_reg_type,
                    provider_code: this.$store.state.prv_data.provider_code,
                    provider_tin: this.$store.state.prv_data.provider_tin,
                    ...(this.display_patient_transaction ? {ek_lgu_id: this.selected_transaction.ek_lgu_id} : undefined),
                    ...(this.$store.state.usr_credentials.provider_reg_type === 'PHO' || this.$store.state.usr_credentials.provider_reg_type === 'MHO' || this.$store.state.usr_credentials.provider_reg_type === 'CHO' ? {
                        lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                    } : undefined)
                }) 

                if(response_cpt.status === 200) {
                    response_cpt.data = this.responseDataDecryption(response_cpt.data)
                    for (let x = 0; x < transaction_list.length; x++) {
                        transaction_list[x].icd_code = response_icd.data[x] ? response_icd.data[x].icd_code : ''
                        transaction_list[x].icd_description = response_icd.data[x] ? response_icd.data[x].icd_description : ''
                        transaction_list[x].bmi_remarks = response_icd.data[x] ? response_icd.data[x].bmi_remarks : 'No Remarks'
                        transaction_list[x].cpt_list = response_cpt.data[transaction_list[x].transaction_number] || []
                    }
    
                    this.name_items = transaction_list.map(item => item.member_name.trim())
                    this.doctor_name_items = transaction_list.map(item => item.doctor_name)
                    this.created_by_list = [...new Set(transaction_list.map(item => item.created_by))]
                    this.bmi_remarks_list = [...new Set(transaction_list.map(item => item.bmi_remarks))]
                    this.transaction_status_list = [...new Set(transaction_list.map(item => item.transaction_status))]
                    this.purpose_of_visit_service_availed_list = [...new Set(transaction_list.map(item => item.purpose_of_visit_service_availed))]
                    if(this.display_patient_transaction){
                        this.p_all_transactions = transaction_list
                    }else{
                        this.all_transactions = transaction_list
                    }
                    
                    this.loading_data = false
                    this.getProviderListByFacility();
                } else {
                    this.alert = response_cpt.error
                }
            } else {
                this.alert = response_icd.error
            }
        },

        // GET PROVIDER LIST BY FACILITY
        async getProviderListByFacility(){
            let response = await this.$services.getProviderListByFacility({
                key: this.$store.state.usr_credentials.provider_reg_type,
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                ...(this.$store.state.usr_credentials.provider_reg_type === 'PHO' || this.$store.state.usr_credentials.provider_reg_type === 'MHO' || this.$store.state.usr_credentials.provider_reg_type === 'CHO' ? { request_key: 'ALL' } : undefined)
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)

                if (response.data.has_data) {
                    this.provider_items = response.data.provider_list.map(element => element.prv_name)
                    this.provider_items.unshift('ALL')
                }
                
                this.loading_providers = false
                this.getICDList();
            } else {
                this.alert = response.error
            }
        },

        // GET ICD LIST
        async getICDList(){
            await this.$store.dispatch('getICDList', {
                request_key: 'icd'
            })

            this.getCPTList();
        },

        // GET CPT LST
        getCPTList(){
            this.$store.dispatch('getCPTList', {
                selection_type: 'lgu'
            })
        },

        // GET SAVED FILTER
        async getSavedFilter(){
            if(this.saved_filter.length === 0){
                this.loading_saved_filter = true
                let response = await this.$services.getFacilityFilter({
                    provider_code: this.$store.state.prv_data.provider_code,
                    provider_tin: this.$store.state.prv_data.provider_tin
                })

                if(response.status === 200) {
                    if(response.data === 'Data not found.'){
                        this.saved_filter = []
                        this.saved_filter_items = []
                    }else{
                        response.data = this.responseDataDecryption(response.data)
                        let filter_items = []
                        
                        for (const filter in response.data) {
                            response.data[filter].forEach(element => {
                                element.color = this.setFilterColor(element.field)
                            })

                            filter_items.push({
                                filter_name: filter
                            })
                        }

                        this.saved_filter_items = filter_items
                        this.saved_filter = response.data
                    }
    
                    this.loading_saved_filter = false
                } else {
                    this.alert = response.error
                }
            } else {
                this.loading_saved_filter = false
            }
        },

        // CUSTOM FILTER TRANSACTION
        customFilterTransaction(){
            let arr_name = []
            let arr_gender = []
            let arr_transaction_type = []
            let arr_doctor = []
            let arr_created_by = []
            let arr_transaction_status = []
            let arr_service_availed = []
            let arr_bmi_remarks = []
            let arr_prv_name = []
            let arr_icd = []
            let arr_cpt = []

            this.custom_filter_data.forEach(element => {
                if(element.filter === 'Patient Name'){
                    arr_name.push(element.value)
                }else if(element.filter === 'Gender'){
                    arr_gender.push(element.value)
                }else if(element.filter === 'Transaction Type'){
                    arr_transaction_type.push(element.value)
                }else if(element.filter === 'Doctor'){
                    arr_doctor.push(element.value)
                }else if(element.filter === 'Created By'){
                    arr_created_by.push(element.value)
                }else if(element.filter === 'Transaction Status'){
                    arr_transaction_status.push(element.value)
                }else if(element.filter === 'Service Availed'){
                    arr_service_availed.push(element.value)
                }else if(element.filter === 'BMI Remarks'){
                    arr_bmi_remarks.push(element.value)
                }else if(element.filter === 'Healthcare Facility'){
                    arr_prv_name.push(element.value)
                }else if(element.filter === 'ICD Description'){
                    arr_icd.push(element.value)
                }else if(element.filter === 'CPT Description'){
                    arr_cpt.push(element.value)
                }
            })

            const operator = function(first_condition, first_value, second_value, age) {
                if (first_condition) {
                    if (first_condition === 'greater than') {
                        return parseInt(age) > parseInt(first_value) && parseInt(age) < parseInt(second_value)
                    } else {
                        return parseInt(age) < parseInt(first_value) || parseInt(age) > parseInt(second_value)
                    }
                } else {
                    return true
                }
            }

            let transactions = this.display_patient_transaction ? this.p_all_transactions : this.all_transactions
            let filtered = transactions.filter((i) => {
                return operator(this.first_age_condition, this.first_age_value, this.second_age_value, i.mem_age) &&
                (arr_name.length === 0 || arr_name[arr_name.indexOf(i.member_name)] === i.member_name) &&
                (arr_gender.length === 0 || arr_gender.includes('ALL') || arr_gender[arr_gender.indexOf(i.mem_gender)] === i.mem_gender) &&
                (arr_transaction_type.length === 0 || arr_transaction_type.includes('ALL') || arr_transaction_type[arr_transaction_type.indexOf(i.transaction_type)] === i.transaction_type) &&
                (arr_doctor.length === 0 || arr_doctor[arr_doctor.indexOf(i.doctor_name)] === i.doctor_name) &&
                (arr_created_by.length === 0 || arr_created_by.includes('ALL') || arr_created_by[arr_created_by.indexOf(i.created_by)] === i.created_by) &&
                (arr_transaction_status.length === 0 || arr_transaction_status.includes('ALL') || arr_transaction_status[arr_transaction_status.indexOf(i.transaction_status)] === i.transaction_status) &&
                (arr_service_availed.length === 0 || arr_service_availed.includes('ALL') || arr_service_availed[arr_service_availed.indexOf(i.purpose_of_visit_service_availed)] === i.purpose_of_visit_service_availed) &&
                (arr_bmi_remarks.length === 0 || arr_bmi_remarks.includes('ALL') || arr_bmi_remarks[arr_bmi_remarks.indexOf(i.bmi_remarks)] === i.bmi_remarks) &&
                (arr_prv_name.length === 0 || arr_prv_name.includes('ALL') || arr_prv_name[arr_prv_name.indexOf(i.prv_name)] === i.prv_name) &&
                (arr_icd.length === 0 || arr_icd[arr_icd.indexOf(i.icd_description)] === i.icd_description) &&
                (arr_cpt.length === 0 || [...new Set([...arr_cpt, ...i.cpt_list])].length !== arr_cpt.length + i.cpt_list.length)
            })

            if(this.display_patient_transaction){
                this.p_custom_filtered_transaction = filtered.length === 0 ? 'No Data' : filtered 
            }else{
                this.custom_filtered_transaction = filtered.length === 0 ? 'No Data' : filtered 
            }
        },

        // SET FILTER COLOR
        setFilterColor(field){
            let items = [
                { field: 'Healthcare Facility', color: 'red' },
                { field: 'Patient Name', color: 'light-blue' },
                { field: 'Age', color: 'indigo' },
                { field: 'Gender', color: 'blue' },
                { field: 'Transaction Type', color: 'cyan' },
                { field: 'Doctor', color: 'teal' },
                { field: 'Created By', color: 'green' },
                { field: 'Transaction Status', color: 'lime' },
                { field: 'Service Availed', color: 'deep-purple' },
                { field: 'BMI Remarks', color: 'amber' },
                { field: 'ICD Description', color: 'deep-orange' },
                { field: 'CPT Description', color: 'blue-grey' }
            ]

            let filter = items.find(element => element.field === field)
            return filter.color
        },

        // ADD CUSTOM FILTER
        addCustomFilter(filter){
            let data = []
            
            if(this.display_patient_transaction){
                if(this.edit_saved_filter.display){
                    data = this.p_temporary_custom_filter
                }else{
                    data = this.p_original_custom_filter
                }
            }else{
                if(this.edit_saved_filter.display){
                    data = this.temporary_custom_filter
                }else{
                    data = this.original_custom_filter
                }
            }

            data.push({
                color: filter.color,
                filter: filter.filter,
                value: ''
            })
        
            setTimeout(() => {
                this.custom_filter_data_holder = {}
            }, 100)
        },

        // REMOVE CUSTOM FILTER
        removeCustomFilter(index){
            if(this.display_patient_transaction){
                if(this.edit_saved_filter.display){
                    this.p_temporary_custom_filter.splice(index, 1)
                }else{
                    this.p_original_custom_filter.splice(index, 1)
                    this.p_current_filter = ''
                    this.customFilterTransaction();
                }
            }else{
                if(this.edit_saved_filter.display){
                    this.temporary_custom_filter.splice(index, 1)
                }else{
                    if(this.original_custom_filter[index].filter === 'Age'){
                        this.first_age_condition = ''
                        this.first_age_value = ''
                        this.second_age_condition = ''
                        this.second_age_value = ''
                    }
    
                    this.original_custom_filter.splice(index, 1)
                    this.current_filter = ''
                    this.customFilterTransaction();
                }
            }
        },
        
        // ADD CUSTOM FILTER VALUE
        addCustomFilterValue(index, value){
            let data = []

            if(this.display_patient_transaction){
                if(this.edit_saved_filter.display){
                    data = this.p_temporary_custom_filter
                }else{
                    data = this.p_original_custom_filter
                }

                this.p_current_filter = ''
            }else{
                if(this.edit_saved_filter.display){
                    data = this.temporary_custom_filter
                }else{
                    data = this.original_custom_filter
                }

                this.current_filter = ''
            }

            data[index].value = value
            this.current_filter_value = value
        },

        // VALIDATE SAVE FILTER
        validateSaveFilter(){
            if(!this.display_patient_transaction){
                let age_index = this.custom_filter_data.findIndex(element => element.filter === 'Age')
                if(age_index >= 0){
                    let age = 'Age is ' + this.first_age_condition + ' ' + this.first_age_value + ' and ' + this.second_age_condition + ' ' + this.second_age_value
    
                    if(this.first_age_condition && this.first_age_value && this.second_age_condition && this.second_age_value){
                        this.original_custom_filter[age_index].value = age
                    }else{
                        this.original_custom_filter[age_index].value = ''
                        this.first_age_condition = ''
                        this.first_age_value = ''
                        this.second_age_condition = ''
                        this.second_age_value = ''
                    }
                }
    
                this.original_custom_filter = this.custom_filter_data.filter(element => element.value)
            }

            if(this.custom_filter_data.length > 0){
                this.getSavedFilter();
                this.display_filter_name = true
            }else{
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'No filter is selected', body: 'Please select a filter', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }
        },

        // SAVE CUSTOM FILTER
        async saveCustomFilter(){
            let count = 0
            for (const filter in this.saved_filter) {
                if(filter.toLowerCase() === this.filter_name.toLowerCase()){
                    count++
                }
            }

            if(count > 0){
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Filter name is already taken', body: 'Please try another one', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }else{
                let filters = this.custom_filter_data.map(element => {
                    return {
                        field: element.filter,
                        value: element.value
                    }
                })
                let response = await this.$services.trnAddFacilityFilter({
                    provider_code: this.$store.state.prv_data.provider_code,
                    provider_tin: this.$store.state.prv_data.provider_tin,
                    filter_name: this.filter_name,
                    filters: filters,
                    age_condition_1: this.first_age_condition,
                    age_condition_2: this.second_age_condition,
                    age_field_1: this.first_age_value,
                    age_field_2: this.second_age_value
                })

                if(response.status === 200) {
                    if(response.data.success){
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-check-circle', color: 'success', title: 'Update Successful', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                        this.display_filter_name = false
                        this.filter_name = ''
                        this.saved_filter = []
                    } else {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                } else {
                    this.alert = response.error
                }
            }
        },

        // DONE FILTER
        doneFilter(){
            if(this.display_patient_transaction){
                this.p_original_custom_filter = this.custom_filter_data.filter(element => element.value)
            }else{ 
                let age_index = this.custom_filter_data.findIndex(element => element.filter === 'Age')
                if(age_index >= 0){
                    let age = 'Age is ' + this.first_age_condition + ' ' + this.first_age_value + ' and ' + this.second_age_condition + ' ' + this.second_age_value
    
                    if(this.first_age_condition && this.first_age_value && this.second_age_condition && this.second_age_value){
                        this.original_custom_filter[age_index].value = age
                    }else{
                        this.original_custom_filter[age_index].value = ''
                        this.first_age_condition = ''
                        this.first_age_value = ''
                        this.second_age_condition = ''
                        this.second_age_value = ''
                    }
                }
    
                this.original_custom_filter = this.custom_filter_data.filter(element => element.value)
            }

            this.customFilterTransaction();
            this.display_custom_filter = false
        },

        // USE THIS FILTER
        useThisFilter(key){
            if(this.display_patient_transaction){
                this.p_current_filter = ''
                this.p_original_custom_filter = []
                this.saved_filter[key].forEach(element => {
                    this.p_original_custom_filter.push({
                        color: element.color,
                        filter: element.field,
                        value: element.value
                    })
                })
            }else{
                this.current_filter = key
                this.original_custom_filter = []
                this.saved_filter[key].forEach(element => {
                    if(element.field === 'Age'){
                        this.first_age_condition = element.age_condition_1
                        this.first_age_value = element.age_field_1
                        this.second_age_condition = element.age_condition_2
                        this.second_age_value = element.age_field_2
                    }
    
                    this.original_custom_filter.push({
                        color: element.color,
                        filter: element.field,
                        value: element.value
                    })
                })
            }
            
            this.customFilterTransaction();
            this.display_saved_filter = false
        },

        // EDIT SAVED FILTER
        editSavedFilter(key){
            this.saved_filter[key].forEach(element => {
                if(this.display_patient_transaction){
                    this.p_temporary_custom_filter.push({
                        filter: element.field,
                        color: element.color,
                        value: element.value
                    })
                }else{
                    if(element.field === 'Age'){
                        this.first_age_condition = element.age_condition_1
                        this.first_age_value = element.age_field_1
                        this.second_age_condition = element.age_condition_2
                        this.second_age_value = element.age_field_2
                    }
    
                    this.temporary_custom_filter.push({
                        filter: element.field,
                        color: element.color,
                        value: element.value
                    })
                }
            })

            this.edit_saved_filter.key = key
            this.edit_saved_filter.display = true
            this.display_custom_filter = true
        },

        // CONFIRM SAVE EDIT FILTER
        confirmSaveEditFilter(){
            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-help-circle', color: 'primary', title: 'This will save the changes in filter name <br><b>' + this.edit_saved_filter.key + '</b4>', body: 'Do you want to continue?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'saveEditFilter', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
        },

        // SAVE EDIT FILTER
        async saveEditFilter(){
            let filters = this.custom_filter_data.map(element => {
                return {
                    field: element.filter,
                    value: element.value
                }
            })

            let response = await this.$services.trnUpdFacilityFilter({
                request_key: 'update_filter',
                provider_code: this.$store.state.prv_data.provider_code,
                provider_tin: this.$store.state.prv_data.provider_tin,
                filter_name: this.edit_saved_filter.key,
                filters: filters,
                age_condition_1: this.first_age_condition,
                age_condition_2: this.second_age_condition,
                age_field_1: this.first_age_value,
                age_field_2: this.second_age_value
            })

            if(response.status === 200) {
                if(response.data.success){
                    this.saved_filter = []
                    this.getSavedFilter();
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-check-circle', color: 'success', title: 'Update Successful', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                } else {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
            } else {
                this.alert = response.error
            }
        },

        // CONFIRM DELETE SAVED FILTER
        confirmDeleteSavedFilter(key){
            this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'error', title: 'This will delete the filter name <br><b>' + key + '</b>', body: 'Do you want to continue?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_params: key, btn_pry_emt: 'deleteSavedFilter', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
        },

        // DELETE SAVED FILTER
        async deleteSavedFilter(key){
            let response = await this.$services.trnUpdFacilityFilter({
                request_key: 'delete_filter',
                provider_code: this.$store.state.prv_data.provider_code,
                provider_tin: this.$store.state.prv_data.provider_tin,
                filter_name: key,
            })

            if(response.status === 200) {
                if(response.data.success){
                    this.saved_filter = []
                    this.getSavedFilter();
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-check-circle', color: 'success', title: 'Delete Successful', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                } else {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
            } else {
                this.alert = response.error
            }
        },

        // CLOSE EDIT FILTER
        closeEditFilter(){
            this.first_age_condition = ''
            this.first_age_value = ''
            this.second_age_condition = ''
            this.second_age_value = ''
            this.temporary_custom_filter = []
            this.edit_saved_filter.age_condition_1 = ''
            this.edit_saved_filter.age_field_1 = ''
            this.edit_saved_filter.age_condition_2 = ''
            this.edit_saved_filter.age_field_2 = ''
            this.edit_saved_filter.key = ''
            this.edit_saved_filter.display = false
            this.display_custom_filter = false
        },

        // PREPARE EXCEL
        async prepareExcel(){
            this.generate_excel_loader = true
            this.display_data = false
            
            let transaction_data = this.display_patient_transaction ? this.p_filtered_transactions : this.filtered_transactions
            let transaction_list = transaction_data.map(item => item.transaction_number)

            let response = await this.$services.getTransactionReport({
                transaction_list: transaction_list
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                let data = response.data === 'Data not found. ' ? [] : response.data
                let header_style = {
                    align: 'center',
                    alignVertical: 'center',
                    borderColor: '#000000', 
                    fontWeight: 'bold'
                }
                let column_style = {
                    align: 'center',
                    alignVertical: 'center',
                    borderColor: '#000000',
                    type: String,
                    wrap: true
                }
                let result = [
                   [
                        { ...header_style, value: 'DATE CREATED' },
                        { ...header_style, value: 'PATIENT NAME' },
                        { ...header_style, value: 'AGE' },
                        { ...header_style, value: 'BIRTHDATE' },
                        { ...header_style, value: 'GENDER' },
                        { ...header_style, value: 'PHIC NUMBER' },
                        { ...header_style, value: 'CONTACT NUMBER' },
                        { ...header_style, value: 'EMAIL' },
                        { ...header_style, value: 'TRANSACTION NUMBER' },
                        { ...header_style, value: 'TRANSACTION TYPE' },
                        { ...header_style, value: 'DOCTOR' },
                        { ...header_style, value: 'CREATED BY' },
                        { ...header_style, value: 'CHIEF COMPLAINT' },
                        { ...header_style, value: 'TRANSACTION STATUS' },
                        { ...header_style, value: 'BMI REMARKS' },
                        { ...header_style, value: 'SERVICE AVAILED' },
                        { ...header_style, value: 'HEALTHCARE FACILITY' },
                        { ...header_style, value: 'DOCTOR NOTE' },
                        { ...header_style, value: 'HMO NOTE' },
                        { ...header_style, value: 'ICD CODE' },
                        { ...header_style, value: 'ICD DESCRIPTION' },
                        { ...header_style, value: 'CPT CODE' },
                        { ...header_style, value: 'CPT DESCRIPTION' },
                        { ...header_style, value: 'CPT AMOUNT' },
                        { ...header_style, value: 'HMO STATUS' },
                        { ...header_style, value: 'PHIC STATUS' },
                        { ...header_style, value: 'APPROVAL CODE' },
                        { ...header_style, value: 'APPROVER' }
                    ]
                ]

                if(this.display_patient_transaction){
                    if(this.p_current_filter) result.unshift([{ ...header_style, span: 2, value: this.p_current_filter }])
                }else{
                    if(this.current_filter) result.unshift([{ ...header_style, span: 2, value: this.current_filter }])
                }
                
                transaction_data.forEach(patient => {
                    if(data[patient.transaction_number] === undefined){
                        result.push([
                            { ...column_style, value: patient.tstamp },
                            { ...column_style, value: patient.member_name },
                            { ...column_style, value: patient.mem_age },
                            { ...column_style, value: patient.mem_birthdate },
                            { ...column_style, value: patient.mem_gender },
                            { ...column_style, value: patient.mem_phic_pin },
                            { ...column_style, value: patient.mem_mobile_number },
                            { ...column_style, value: patient.mem_email_address },
                            { ...column_style, value: patient.transaction_number },
                            { ...column_style, value: patient.transaction_type },
                            { ...column_style, value: patient.doctor_name },
                            { ...column_style, value: patient.created_by },
                            { ...column_style, value: patient.chief_complaint },
                            { ...column_style, value: patient.transaction_status },
                            { ...column_style, value: patient.bmi_remarks },
                            { ...column_style, value: patient.purpose_of_visit_service_availed },
                            { ...column_style, value: patient.prv_name },
                            { ...column_style, value: patient.doctor_note },
                            { ...column_style, value: patient.hmo_cc_notes },
                            { ...column_style, value: 'N/A' },
                            { ...column_style, value: 'N/A' },
                            { ...column_style, value: 'N/A' },
                            { ...column_style, value: 'N/A' },
                            { ...column_style, value: 'N/A' },
                            { ...column_style, value: 'N/A' },
                            { ...column_style, value: 'N/A' },
                            { ...column_style, value: 'N/A' },
                            { ...column_style, value: 'N/A' }
                        ])
                    }else{
                        data[patient.transaction_number].forEach((icd, icd_index) => {
                            if(icd.procedure_list.length === 0){
                                result.push([
                                    { ...column_style, value: icd_index === 0 ? patient.tstamp : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.member_name : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.mem_age : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.mem_birthdate : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.mem_gender : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.mem_phic_pin : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.mem_mobile_number : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.mem_email_address : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.transaction_number : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.transaction_type : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.doctor_name : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.created_by : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.chief_complaint : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.transaction_status : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.bmi_remarks : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.purpose_of_visit_service_availed : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.prv_name : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.doctor_note : '' },
                                    { ...column_style, value: icd_index === 0 ? patient.hmo_cc_notes : '' },
                                    { ...column_style, value: icd.icd_code },
                                    { ...column_style, value: icd.icd_desc },
                                    { ...column_style, value: 'N/A' },
                                    { ...column_style, value: 'N/A' },
                                    { ...column_style, value: 'N/A' },
                                    { ...column_style, value: 'N/A' },
                                    { ...column_style, value: 'N/A' },
                                    { ...column_style, value: 'N/A' },
                                    { ...column_style, value: 'N/A' }
                                ])
                            }else{
                                icd.procedure_list.forEach((cpt, cpt_index) => {
                                    result.push([
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.tstamp : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.member_name : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.mem_age : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.mem_birthdate : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.mem_gender : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.mem_phic_pin : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.mem_mobile_number : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.mem_email_address : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.transaction_number : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.transaction_type : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.doctor_name : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.created_by : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.chief_complaint : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.transaction_status : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.bmi_remarks : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.purpose_of_visit_service_availed : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.prv_name : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.doctor_note : '' },
                                        { ...column_style, value: icd_index === 0 && cpt_index === 0 ? patient.hmo_cc_notes : '' },
                                        { ...column_style, value: cpt_index === 0 ? icd.icd_code : '' },
                                        { ...column_style, value: cpt_index === 0 ? icd.icd_desc : '' },
                                        { ...column_style, value: cpt.cpt_code? cpt.cpt_code:'' },
                                        { ...column_style, value: cpt.cpt_description? cpt.cpt_description:'' },
                                        { ...column_style, value: cpt.cpt_amount === null? cpt.cpt_amount:'' },
                                        { ...column_style, value: cpt.hmo_cpt_status === null? cpt.hmo_cpt_status:'' },
                                        { ...column_style, value: cpt.phic_cpt_status === null? cpt.phic_cpt_status:''},
                                        { ...column_style, value: patient.hmo_approval_code === null? patient.hmo_approval_code:'' },
                                        { ...column_style, value: cpt.hmo_cc_approver === null? cpt.hmo_cc_approver:''}
                                    ])
                                })
                            }
                        })
                    }
                })

                this.export_excel_data = result
                this.exportToExcel();
            } else {
                this.alert = response.error
            }
        },

        // EXPORT TO EXCEL
        exportToExcel(){
            setTimeout(() => {
                let date = this.$moment().format('MM-DD-YYYY')
                const file_name_facility = this.$store.state.prv_data.provider_name;
                
                this.$excel_file(this.export_excel_data, {
                    columns: [
                        { width: 30 },
                        { width: 30 },
                        { width: 15 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 20 },
                        { width: 25 },
                        { width: 25 },
                        { width: 20 },
                        { width: 20 },
                        { width: 20 },
                        { width: 30 },
                        { width: 25 },
                        { width: 20 },
                        { width: 20 },
                        { width: 30 },
                        { width: 30 },
                        { width: 15 },
                        { width: 30 },
                        { width: 15 },
                        { width: 30 },
                        { width: 15 },
                        { width: 20 },
                        { width: 20 },
                        { width: 20 },
                        { width: 20 }
                    ],
                    fileName: file_name_facility + ' - Healthcare Facility Reports - ' + date + '.xlsx'
                })
                
                this.generate_excel_loader = false
                if(!this.display_patient_transaction) this.display_data = true
            }, 1000)
        },

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if((event.which < 48 || event.which > 57) && event.which !== 45){
                event.preventDefault();
            }
        },

        // GET THE TRANSACTION LIST OF PATIENT
        getPatientTransaction(item){
            if(this.selected_transaction.transaction_number === item.transaction_number){
                if(this.selected_transaction.display){
                    this.selected_transaction.display = false
                }else{
                    this.selected_transaction.ek_lgu_id = item.ek_lgu_id
                    this.selected_transaction.member_name = item.member_name

                    this.p_all_transactions = this.all_transactions.filter((i) => {
                        return this.selected_transaction.member_name === i.member_name
                    })

                    this.display_data = false
                    this.display_patient_transaction = true
                }
            }else{
                this.selected_transaction.transaction_number = item.transaction_number
                this.selected_transaction.display = false
            }  
        },

        // CLOSE PATIENT TRANSACTION
        closePatientTransaction(){
            this.p_current_filter = ''
            this.p_search = ''
            this.p_original_custom_filter = []
            this.p_temporary_custom_filter = []
            this.p_custom_filtered_transaction = []
            this.display_data = true
            this.display_patient_transaction = false
        },

        // GO FILTER
        goFilter(){
            let initial_start = this.$moment(this.$moment().subtract(1, 'months')).format('YYYY-MM-DD')

            if(this.display_patient_transaction){
                if(!(initial_start <= this.p_start_date || (this.p_previous_start_date && this.p_previous_start_date <= this.p_start_date))){
                    this.loading_data = true
                    this.p_all_transactions = []
                    this.p_previous_start_date = this.p_start_date
                    this.getAllTransactions();
                }

                this.p_start_date_filter = this.p_start_date
                this.p_end_date_filter = this.p_end_date
            }else{
                if(!(initial_start <= this.start_date || (this.previous_start_date && this.previous_start_date <= this.start_date))){
                    this.loading_data = true
                    this.all_transactions = []
                    this.previous_start_date = this.start_date
                    this.getAllTransactions();
                }
    
                this.start_date_filter = this.start_date
                this.end_date_filter = this.end_date
            }
        },

        // CLEAR FILTER
        clearFilter(){
            if(this.display_patient_transaction){
                this.p_current_filter = ''
                this.p_search = ''
                this.p_original_custom_filter = []
                this.p_temporary_custom_filter = []
                this.p_custom_filtered_transaction = []
            }else{
                this.start_date = this.$moment(this.$moment().subtract(1, 'months')).format('YYYY-MM-DD')
                this.end_date = this.$moment().format('YYYY-MM-DD')
                this.search = ''
                this.original_custom_filter = []
                this.temporary_custom_filter = []
                this.first_age_condition = ''
                this.first_age_value = ''
                this.second_age_condition = ''
                this.second_age_value = ''
                this.customFilterTransaction();
            }

            this.goFilter();
        },

        viewMoreInfo(transaction_number, doctor_note, hmo_cc_notes, hmo_approval_code) {
            this.display_patient_transaction = false
            this.$refs.view_more_info.openViewMoreInfo(transaction_number, doctor_note, hmo_cc_notes, hmo_approval_code)
        }

    }
}
</script>

<style scoped>
.progress-loader{
    height: 80vh;
}
</style>