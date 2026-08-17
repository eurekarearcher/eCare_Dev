<template>
    <v-container fluid px-12>
        <Navbar :navbar="navbar" />

        <!-- PROGRESS BAR -->
        <h2 class="text-center grey--text text--darken-3 mt-5 mb-3">INPATIENT</h2>

        <v-row justify="center" align="end" class="wrap">
            <v-col cols="12" sm="6" md="4" lg="4" xl="4" class="px-3">
                <h4 class="text-center grey--text text--darken-3 title">1. DOCTOR <v-icon class="mb-1" color="grey darken-3" small>fas fa-user-md</v-icon></h4>
                <div v-if="!selected_doctor" class="stripesLoader light-blue darken-4" style="background-position: 100%;"></div>
                <v-progress-linear v-else color="light-blue darken-4" height="10" value="100" rounded striped></v-progress-linear>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="4" xl="4" class="px-3">
                <h4 class="text-center grey--text text--darken-3 title">2. DIAGNOSIS <v-icon class="mb-1" color="grey darken-3" small>fas fa-heartbeat</v-icon></h4>
                <div v-if="selected_icd.length === 0" class="stripesLoader light-blue darken-4" style="background-position: 100%;"></div>
                <v-progress-linear v-else color="light-blue darken-4" height="10" value="100" rounded striped></v-progress-linear>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="4" xl="4" class="px-3">
                <h4 class="text-center grey--text text--darken-3 title">3. ROOM <v-icon class="mb-1" color="grey darken-3" small>fas fa-bed</v-icon></h4>
                <div v-if="!selected_room.type" class="stripesLoader light-blue darken-4" style="background-position: 100%;"></div>
                <v-progress-linear v-else color="light-blue darken-4" height="10" value="100" rounded striped></v-progress-linear>
            </v-col>
        </v-row>

        <v-row class="wrap sm12 md12 lg12 xl12">
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <v-card class="pt-sm-9">
                    <v-row class="wrap">
                        <!-- SELECTION PROCESS -->
                        <v-col cols="12" class="hidden-sm-and-up">
                            <h3 class="text-center mt-2">Patient Information</h3>
                            <v-img v-if="!member_data.member.mem_photo" src="@/assets/no-image.jpg" max-height="210" contain></v-img>
                            <v-img v-else :src="member_data.member.mem_photo" max-height="210" contain></v-img>
                            <h4 class="text-center mt-2">{{ member_data.member.p_name }}</h4>
                            <h4 v-if="process_type === 'LGU'" class="text-center font-weight-regular mb-3">{{ member_data.member.ek_lgu_id ? member_data.member.ek_lgu_id : 'N/A' }}</h4>
                            <h4 v-else class="text-center font-weight-regular">{{ member_data.member.mem_hmo_policy_number ? member_data.member.mem_hmo_policy_number : 'N/A' }}</h4>
                            <v-divider class="mt-3 mb-6"></v-divider>
                        </v-col>


                        <v-col cols="12" sm="8" md="8" lg="9" xl="9" class="px-5 text-md-right">
                            <!-- PREVIOUS DOCTOR -->
                            <v-row v-if="display_previous_doctor" class="wrap mb-5">
                                <v-col cols="12" sm="12" md="3" lg="3" xl="3" align-self="center">
                                    <label class="grey--text text--darken-1 text-body-2 text-lg-body-1 font-weight-medium pr-2">PREVIOUS DOCTOR:</label>
                                </v-col>

                                <v-col cols="12" sm="12" md="9" lg="9" xl="9">
                                    <h4 class="font-weight-medium text-body-2 text-lg-body-1 grey--text text--darken-3 text-left">DR. {{ previous_trans.data.doctor_name }} / {{ previous_trans.data.specialization }}
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-on="on" v-bind="attrs" class="mb-1" color="red darken-1" size="18">mdi-alert-circle</v-icon>
                                            </template>
                                            <span>This doctor is not {{ process_type === 'HMO'  || process_type === 'HMO_PHIC' ? (member_data.member.mem_hmo_host_code === 'VC' ? 'ValuCare' : 'Eurekare' ) : 'PHIC' }} Accredited</span>
                                        </v-tooltip>
                                    </h4>
                                </v-col>
                            </v-row>

                            <!-- DOCTOR SELECTION -->
                            <v-row class="wrap">
                                <v-col cols="12" sm="12" md="3" lg="3" xl="3" align-self="center">
                                    <label class="grey--text text--darken-1 text-body-2 text-lg-body-1 font-weight-medium pr-2">DOCTOR:</label>
                                </v-col>

                                <v-col cols="12" sm="12" md="9" lg="9" xl="9">
                                    <v-autocomplete v-model="selected_doctor" :items="doctor_list" :loading="loading_doctor" :error="empty_fields && !selected_doctor" class="text-body-2 text-lg-body-1" item-text="doc_autocomplete" placeholder="Search Doctor Name or Specialization" prepend-inner-icon="mdi-magnify" hide-details hide-no-data hide-selected return-object single-line dense outlined clearable>
                                        <template v-slot:item="{ item }">
                                            <v-layout class="text-uppercase" wrap>
                                                <v-list-item-avatar color="indigo" class="headline font-weight-light white--text">{{ item.doctor_name.charAt(0) }}</v-list-item-avatar>
                                                <v-list-item-content>
                                                    <v-list-item-title v-text="item.doctor_name"></v-list-item-title>
                                                    <v-list-item-subtitle v-text="item.specialization"></v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-layout>
                                        </template>
                                        <template v-slot:selection="{ item }">
                                            <span class="grey--text text--darken-2 text-uppercase"><v-icon small left>fas fa-user-md</v-icon> {{ item.doctor_name }} / {{ item.specialization }}</span>
                                        </template>
                                        <template v-slot:append>
                                            <v-icon></v-icon>
                                        </template>
                                    </v-autocomplete>
                                </v-col>
                            </v-row>
                            
                            <!-- PREVIOUS DIAGNOSIS -->
                            <v-row v-if="display_previous_diagnosis" justify="end" class="wrap mt-7">
                                <v-col cols="12" sm="12" md="3" lg="3" xl="3">
                                    <label class="grey--text text--darken-1 text-body-2 text-lg-body-1 font-weight-medium pr-2">PREVIOUS TRANSACTION:</label>
                                </v-col>

                                <v-col v-for="(icd, i) in selected_previous_diagnosis" :key="i" cols="12" sm="12" md="9" lg="9" xl="9" class="text-left pl-1 pb-4">
                                    <h4 class="font-weight-medium grey--text text--darken-3">{{ icd.icd_code }} / {{ icd.description }}</h4>
                                    <h4 v-for="(cpt, x) in icd.cpt_list" :key="x" class="font-weight-medium grey--text text--darken-3 pl-12 py-1">{{ cpt.cpt_code }} / {{ cpt.cpt_description }}</h4>
                                </v-col>
                            </v-row>

                            <!-- DIAGNOSIS SELECTION -->
                            <v-row :class="{'mt-7' : !display_previous_diagnosis}" justify="end" class="wrap">
                                <v-col cols="12" sm="12" md="3" lg="3" xl="3" class="pt-2">
                                    <label class="grey--text text--darken-1 text-body-2 text-lg-body-1 font-weight-medium pr-2">ADMISSION DIAGNOSIS:</label>
                                </v-col>

                                <v-col cols="12" sm="12" md="9" lg="9" xl="9">
                                    <v-text-field v-if="switch_selection" v-model="entered_diagnosis" :error="empty_fields && !entered_diagnosis" class="text-body-2 text-lg-body-1" placeholder="Please input the admission diagnosis of the patient." height="40" hide-details dense outlined></v-text-field>

                                    <template v-else>
                                        <v-form :readonly="remove_diagnosis_loader">
                                            <div v-for="(icd, i) in selected_icd" :key="i">
                                                <v-divider v-if="i >= 1" class="my-5"></v-divider>
                                                <v-combobox v-model="icd.code_and_description" :items="icd_items" :loading="loading_icd" :error="empty_fields && !icd.icd_code" :readonly="icd.icd_loading" @focus="current_icd = icd.code_and_description" @blur="icd.code_and_description = current_icd" item-text="code_and_description" placeholder="Search for ICD Code or Description" prepend-inner-icon="mdi-magnify" hide-no-data hide-details return-object outlined dense>
                                                    <template v-slot:item="{ attrs, on, item }">
                                                        <v-list-item v-bind="attrs" v-on="on" @click="addDiagnosisData(i, item)">
                                                            <v-list-item-content>
                                                                <v-list-item-title>{{ item.description }}</v-list-item-title>
                                                                <v-list-item-subtitle>{{ item.icd_code }}</v-list-item-subtitle>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </template>
                                                    <template v-if="icd.icd_loading || icd.tooltip_text" v-slot:append>
                                                        <v-progress-circular v-if="icd.icd_loading" class="mr-2" color="primary" size="22" width="2" indeterminate></v-progress-circular>
                                                        <v-tooltip v-else-if="icd.tooltip_text" bottom>
                                                            <template v-slot:activator="{ on }">
                                                                <v-icon v-on="on" color="red">mdi-alert-circle</v-icon>
                                                            </template>
                                                            <span>{{ icd.tooltip_text }}</span>
                                                        </v-tooltip>
                                                    </template>
                                                    <template v-slot:append-outer>
                                                        <v-progress-circular v-if="remove_diagnosis_loader" color="primary" size="20" width="2" indeterminate></v-progress-circular>
                                                        <v-icon v-else :disabled="icd.icd_loading || loading_icd" @click="removeDiagnosisData(i)">mdi-delete</v-icon>
                                                    </template>
                                                </v-combobox>

                                                <div v-if="icd.procedure_list.length > 0" class="pl-sm-10">
                                                    <h4 class="body-2 text-left font-weight-medium grey--text text--darken-1 mt-4">PROCEDURES</h4>
                                                    <v-text-field v-for="(cpt, x) in icd.procedure_list" :key="x" :value="cpt.cpt_code+ ' / ' +cpt.cpt_description" class="mb-2" hide-details readonly outlined dense>
                                                        <template v-slot:append-outer>
                                                            <v-icon @click="removeProcedure(i, x)">mdi-delete</v-icon>
                                                        </template>
                                                    </v-text-field>
                                                </div>

                                                <h4 class="body-2 text-left font-weight-medium grey--text text--darken-1 mt-4 pl-sm-10">ADD PROCEDURE</h4>
                                                <v-autocomplete v-model="selected_cpt_holder" :items="cpt_items" :loading="loading_cpt" :disabled="!icd.code_and_description" @change="addProcedure($event, i)" item-text="cpt_code_desc" class="pl-sm-10" prepend-inner-icon="mdi-magnify" placeholder="Search for CPT Code or Description" return-object hide-no-data hide-selected hide-details outlined dense>
                                                    <template v-slot:item="{ item }">
                                                        <v-list-item-content>
                                                            <v-list-item-title>{{ item.cpt_description }}</v-list-item-title>
                                                            <v-list-item-subtitle>{{ item.cpt_code }}</v-list-item-subtitle>
                                                        </v-list-item-content>
                                                    </template>
                                                </v-autocomplete>
                                            </div>
                                        </v-form>
                                    </template>

                                    <div class="text-right">
                                        <v-btn v-if="!switch_selection" :disabled="loading_icd || remove_diagnosis_loader" @click="addDiagnosisField" class="mt-2 mr-2" small><v-icon left>mdi-plus</v-icon> ADD DIAGNOSIS</v-btn>
                                        <v-btn v-if="!display_previous_diagnosis" :disabled="remove_diagnosis_loader" @click="switchSelection" class="mt-2" small>SWITCH TO {{ switch_selection ? 'SELECTION' : 'FREE TEXT' }}</v-btn>
                                    </div>
                                </v-col>
                            </v-row>

                            <!-- ROOM SELECTION -->
                            <v-row class="wrap my-6">
                                <v-col cols="12" sm="12" md="3" lg="3" xl="3" align-self="center">
                                    <label class="grey--text text--darken-1 text-body-2 text-lg-body-1 font-weight-medium pr-2">ROOM:</label>
                                </v-col>

                                <v-col cols="12" sm="12" md="9" lg="9" xl="9">
                                    <v-autocomplete v-model="selected_room.type" :items="room_list" :loading="loading_room" :error="empty_fields && !selected_room.type" item-text="type" height="40" placeholder="Search for Room" prepend-inner-icon="mdi-magnify" hide-details hide-no-data hide-selected dense outlined clearable>
                                        <template v-slot:append>
                                            <v-icon></v-icon>
                                        </template>
                                    </v-autocomplete>
                                </v-col>
                            </v-row>

                            <!-- DOCTORE NOTES -->
                            <v-row v-if="previous_doctor_notes" class="wrap mb-12">
                                <v-col cols="12" sm="12" md="3" lg="3" xl="3" align-self="center">
                                    <label class="grey--text text--darken-1 text-body-2 text-lg-body-1 font-weight-medium pr-2">DOCTOR NOTES:</label>
                                </v-col>

                                <v-col cols="12" sm="12" md="9" lg="9" xl="9">
                                    <v-textarea v-model="previous_doctor_notes" rows="3" hide-details readonly outlined></v-textarea>
                                </v-col>
                            </v-row>
                        </v-col>

                        <!-- MEMBER DETAILS -->
                        <v-col cols="12" sm="4" md="4" lg="3" xl="3">
                            <v-col cols="12" sm="12" md="10" lg="9" xl="9" class="mx-auto">
                                <v-img v-if="!member_data.member.mem_photo" src="@/assets/no-image.jpg" class="hidden-xs-only" contain></v-img>
                                <v-img v-else :src="member_data.member.mem_photo" max-height="210" class="hidden-xs-only" contain></v-img>
                                <h4 class="text-center mt-2 hidden-xs-only">{{ member_data.member.p_name }}</h4>
                                <h4 v-if="process_type === 'LGU'" class="text-center font-weight-regular mb-3 hidden-xs-only">{{ member_data.member.ek_lgu_id ? member_data.member.ek_lgu_id : 'N/A' }}</h4>
                                <h4 v-else class="text-center font-weight-regular mb-3 hidden-xs-only">{{ member_data.member.mem_hmo_policy_number ? member_data.member.mem_hmo_policy_number : 'N/A' }}</h4>
                                <v-btn :disabled="loading_doctor || loading_icd || add_diagnosis_loader || remove_diagnosis_loader" @click="checkEmptyFields" class="btn" color="white--text light-blue darken-4" block>SUBMIT<v-icon small right>fas fa-paper-plane</v-icon></v-btn>
                            </v-col>
                        </v-col>
                    </v-row>

                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn @click="confirmGoBackToEligibility" x-small text><v-icon small left>mdi-arrow-left</v-icon> to Eligibility Page</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- CONFIRM DIALOG -->
        <v-dialog v-model="confirm_dialog" width="1050" persistent>
            <v-card v-if="confirm_dialog">
                <v-card-title class="headline justify-center light-blue darken-4 white--text">INPATIENT CONFIRMATION</v-card-title>
                <v-card class="px-10 py-5 text-uppercase title" outlined>
                    <v-row class="wrap">
                        <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pr-sm-2">
                            <label class="confirm-dialog-label text-body-2 text-lg-body-1">DOCTOR</label>
                            <v-card class="confirm-dialog-field text-body-2 text-lg-body-1" outlined>{{ selected_doctor.doctor_name }}</v-card>
                        </v-col>

                        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                            <label class="confirm-dialog-label text-body-2 text-lg-body-1">SPECIALIZATION</label>
                            <v-card class="confirm-dialog-field text-body-2 text-lg-body-1" outlined>{{ selected_doctor.specialization }}</v-card>
                        </v-col>
                    </v-row>

                    <v-row justify="end" class="wrap mt-2">
                        <v-col cols="12">
                            <label class="confirm-dialog-label text-body-2 text-lg-body-1">ADMISSION DIAGNOSIS</label>
                        </v-col>

                        <v-col cols="12">
                            <div v-for="(icd, i) in selected_icd" :key="i">
                                <v-divider v-if="i >= 1" class="my-5"></v-divider>
                                <v-card class="confirm-dialog-field text-body-2 text-lg-body-1" outlined>{{ icd.icd_code }} / {{ icd.description }}</v-card>
                                <label v-if="icd.procedure_list.length > 0" class="d-block confirm-dialog-label text-body-2 text-lg-body-1 ml-sm-8 mt-1">PROCEDURES</label>
                                <v-card v-for="(cpt, x) in icd.procedure_list" :key="x" class="confirm-dialog-field text-body-2 text-lg-body-1 ml-sm-8" outlined>{{ cpt.cpt_code }} / {{ cpt.cpt_description }}</v-card>
                            </div>
                            <v-card v-if="switch_selection" class="confirm-dialog-field text-body-2 text-lg-body-1" outlined>{{ entered_diagnosis }}</v-card>
                        </v-col>
                    </v-row>

                    <v-row v-if="!!selected_room.type" class="wrap mt-2">
                        <v-col cols="12">
                            <label class="confirm-dialog-label text-body-2 text-lg-body-1">ROOM</label>
                            <v-card class="confirm-dialog-field text-body-2 text-lg-body-1" outlined>{{ selected_room.type }}</v-card>
                        </v-col>
                    </v-row>
                </v-card>

                <v-divider></v-divider>

                <v-card-actions class="justify-center">
                    <v-btn :disabled="confirm_dialog_loader" @click="confirm_dialog = false" outlined rounded><v-icon class="pr-1" size="16">fas fa-times-circle</v-icon>CANCEL</v-btn>
                    <v-btn :loading="confirm_dialog_loader" @click="postInpatient" color="white--text light-blue darken-4" rounded>CONFIRM<v-icon class="pl-1" size="16">fas fa-check-circle</v-icon></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <!-- PREVIOUS TRANSACTION -->
        <v-dialog v-model="previous_trans.dialog" width="1700px" persistent>
            <v-card>
                <h1 class="title light-blue darken-4 white--text text-center py-3">PLEASE SELECT YOUR PREVIOUS TRANSACTION</h1>
                <v-row justify="end" class="mb-2 mt-7">
                    <v-col cols="12" sm="12" md="12" lg="3" xl="3" class="mx-4">
                        <v-text-field v-model="previous_trans.search" prepend-inner-icon="mdi-magnify" label="Search" variant="outlined" density="compact" single-line hide-details></v-text-field>
                    </v-col>
                </v-row>

                <v-row justify="center">
                    <v-col class="px-4">
                        <v-data-table :headers="previous_trans.header" :items="previous_trans.items" :loading="previous_trans.loader" :search="previous_trans.search" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }"  :items-per-page="5" class="elevation-1 mb-10" mobile-breakpoint="0" sort-by="date_created" item-key="transaction_number" loading-text="Loading Data... Please Wait..." no-data-text="You don't have previous consultation" sort-desc no-results>
                            <template v-slot:item="{ item }"> 
                                <tr :class="{'blue lighten-4': item.transaction_number === previous_trans.data.transaction_number}" @click="previous_trans.data = item"> 
                                    <td>{{ formatDateAndTime(item.date_created) }}</td>
                                    <td>{{ item.doctor_name }}</td>
                                    <td>{{ item.specialization }}</td>
                                    <td>{{ item.chief_com }}</td>
                                    <td>{{ item.icd_code ? item.icd_code : 'N/A'}}</td>
                                    <td>{{ item.icd_description ? item.icd_description : 'N/A'}}</td>
                                    <td>{{ item.transaction_type }}</td>
                                </tr> 
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>

                <v-divider></v-divider>
                
                <v-card-actions>
                    <v-row justify="start" class="wrap mt-1">
                        <v-col cols="12" sm="12" md="12" lg="4" xl="4" class="pl-3">
                            <v-btn :disabled="previous_trans.confirm_loader" :block="$vuetify.breakpoint.xs" @click="previous_trans.dialog = false, previous_trans.data = ''" class="mb-4 mb-sm-1" text><v-icon left>fas fa-user-md</v-icon>CONTINUE WITH DIFFERENT <br v-if="$vuetify.breakpoint.xs">DIAGNOSIS/DOCTOR</v-btn> 
                        </v-col>

                        <v-col cols="12" sm="12" md="12" lg="4" xl="4" align-self="start" class="d-flex justify-center">
                            <v-btn :disabled="previous_trans.confirm_loader" @click="confirmGoBackToEligibility" class="mr-2" color="secondary" outlined rounded><v-icon small left>fas fa-times-circle</v-icon>CANCEL</v-btn> 
                            <v-btn :loading="previous_trans.confirm_loader" @click="getPreviousTransactionICD" color="light-blue darken-4 white--text" rounded>CONFIRM<v-icon small right>fas fa-check-circle</v-icon></v-btn> 
                        </v-col>
                    </v-row>

                </v-card-actions>
            </v-card>
        </v-dialog>
    
        <Alert :alert="alert" @goBackToEligibility="goBackToEligibility" @removeAllDiagnosis="removeAllDiagnosis" />
    </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'

export default {
    components:{
        Navbar,
        Alert
    },
    
    data(){
        return{
            // CREDENTIALS
            phic_member_eligibility_status: sessionStorage.getItem('ROTSR') ? this.$crypto.AES.decrypt(sessionStorage.getItem('ROTSR'),'lFdt04sg').toString(this.$crypto.enc.Utf8) : null,
            process_type: sessionStorage.getItem('GF45S') ? this.$crypto.AES.decrypt(sessionStorage.getItem('GF45S') , 'fgGds32s').toString(this.$crypto.enc.Utf8) : null,
            member_data: sessionStorage.getItem('MD532') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('MD532') , 'lfFo34sf').toString(this.$crypto.enc.Utf8)) : null,
            selected_referral: sessionStorage.getItem('S2GSXfkF') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('S2GSXfkF'), 'lfFo34sf').toString(this.$crypto.enc.Utf8)) : null,

            
            // PREVIOUS TRANSACTION
            display_previous_doctor: false,
            previous_doctor_notes: '',
            previous_trans: {
                dialog: false,
                loader: true,
                confirm_loader: false,
                search: '',
                items: [],
                header: [
                    { text: 'DATE AND TIME', value: 'date_created' },
                    { text: 'DOCTOR NAME', value: 'doctor_name', sortable: false },
                    { text: 'DOCTOR SPECIALIZATION', value: 'specialization', sortable: false },
                    { text: 'CHIEF COMPLAINT', value: 'chief_com', sortable: false },
                    { text: 'ICD CODE', value: 'icd_code', sortable: false },
                    { text: 'ICD DESCRIPTION', value: 'icd_description', sortable: false },
                    { text: 'TRANSACTION TYPE', value: 'transaction_type', sortable: false }
                ],

                data: {}
            },
            
            // DOCTOR
            loading_doctor: true,
            doctor_list: [],
            selected_doctor: '',

            // DIAGNOSIS
            loading_icd: true,
            display_previous_diagnosis: false,
            selected_previous_diagnosis: [],
            entered_diagnosis: '',

            // CPT
            rt_pcr_items: [],
            selected_cpt_holder: '',
            loading_cpt: true,
            cpt_items: [],

            icd_list: [],
            selected_icd_filter: [],
            selected_icd: [
                {
                    icd_code: '',
                    description: '',
                    code_and_description: '',
                    procedure_list: []
                }
            ],
            current_icd: '',
            
            // ROOM
            loading_room: false,
            room_list: [
                { type: 'PRIVATE' },
                { type: 'SEMI-PRIVATE' },
                { type: 'WARD' }
            ],
            selected_room: {
                type: ''
            },
            
            // NAVBAR CONTENT
            navbar: [
                { title:'Home', link: '/code-scanning', icon: 'fas fa-home' }
            ],

            // OTHERS
            alert: {},
            empty_fields: false,
            confirm_dialog: false,
            confirm_dialog_loader: false,
            switch_selection: false,
            add_diagnosis_loader: false,
            remove_diagnosis_loader: false
        }
    },

    created(){
        if(this.process_type.includes('LGU')){
            this.previous_trans.dialog = true
            this.getPreviousTransactionList();
        }else{
            this.getDoctorList();
        }
    },

    computed: {
        // FILTER ICD LIST
        icd_items(){
            const icd_list = this.icd_list.filter(item => {
                return !this.selected_icd_filter.includes(item.icd_code)
            })

            return icd_list
        }
    },

    methods: {
        // GET PREVIOUS TRANSACTION LIST
        getPreviousTransactionList(){
            this.$axios.post(this.$tms_url+'resources/api/_get_transaction_previous_by_type.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                    provider_tin: this.$store.state.prv_data.provider_tin,
                    ek_phic_id: this.member_data.member.ek_phic_id ? this.member_data.member.ek_phic_id : null,
                    first_name: this.member_data.member.mem_first_name ? this.member_data.member.mem_first_name : '',
                    middle_name: this.member_data.member.mem_middle_name ? this.member_data.member.mem_middle_name : '',
                    last_name: this.member_data.member.mem_last_name ? this.member_data.member.mem_last_name : '',
                    suffix: this.member_data.member.mem_suffix ? this.member_data.member.mem_suffix : '',
                    birthday: this.$moment(this.member_data.member.mem_birthdate).format('YYYY-MM-DD'),
                    transaction_type: 'IP',
                    ek_lgu_id : this.member_data.member.ek_lgu_id,
    
                    ...(this.process_type.includes('LGU')  ? {
                        ek_lgu_id : this.member_data.member.ek_lgu_id,
                        lgu_host_code : this.member_data.member.lgu_host_code,
                    } : undefined),
    
    
                    ...(this.process_type !== 'PHIC' ? {
                        hmo_policy_number: this.member_data.member.mem_hmo_policy_number ? this.member_data.member.mem_hmo_policy_number : null,
                        provider_code: this.$store.state.prv_data.provider_code,
                        hmo_host_code : this.member_data.member.mem_hmo_host_code
                    } : undefined)
                }))
            }))
            .then(response => {
                if(response.data === 'Data not found.'){
                    this.previous_trans.items = []
                }else{
                    response.data = this.responseDataDecryption(response.data)
                    this.previous_trans.items = response.data
                }

                this.previous_trans.loader = false
                this.getDoctorList();
            })
            .catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },

        // GET PROVIDER DOCTOR LIST
        getDoctorList(){
            let host_doctor = ''

            if(this.process_type === 'HMO_PHIC' || this.process_type == 'HMO_PHIC_LGU' || this.process_type == 'HMO_LGU'){
                host_doctor = 'HMO_PHIC'
            }else if(this.process_type === 'PHIC' || this.process_type == 'PHIC_LGU'){
                host_doctor = 'PHIC'
            }else if(this.process_type === 'LGU'){
                host_doctor = 'LGU'
            }else{
                host_doctor = this.member_data.member.mem_hmo_host_code === 'VC' ? 'HMO_VC' : 'HMO'
            }

            this.$axios.post(this.$cms_url+'resources/api/_get_transaction_ip_ref_data.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                    request_key: 'patient_doctor',
                    host_doctor: host_doctor,
                    provider_code: this.$store.state.prv_data.provider_code,
                    provider_tin: this.$store.state.prv_data.provider_tin,
                    hmo_host_code: host_doctor.includes('HMO') ? this.member_data.member.mem_hmo_host_code : undefined,
                    phic_host_code: host_doctor !== 'HMO' ? 'PHIC' : undefined,
                    lgu_host_code: host_doctor === 'LGU' ? this.member_data.member.lgu_host_code : undefined
                }))
            }))
            .then(response => {
                if (response.data == 'Data not found.') return this.loading_doctor = false
                //response.data = this.responseDataDecryption(response.data)
                this.doctor_list = response.data.map(item => {
                    let doctor = {
                        doc_phic_acc_no: item.doc_phic_acc_no,
                        doc_prc_license: item.doc_prc_license,
                        doc_tin: item.doctor_tin_no,
                        doc_code: item.hmo_doctor_code,
                        doctor_name: item.doctor_name,
                        specialization: item.specialization,
                        doctor_first_name: item.first_name,
                        doctor_middle_name: item.middle_name,
                        doctor_last_name: item.last_name,
                        doc_autocomplete: item.doctor_name + ' ' + item.specialization + ' ' + (item.doctor_tin_no ? item.doctor_tin_no : '') + ' ' + (item.doc_prc_license ? item.doc_prc_license : '')
                    }

                    return doctor
                })

                this.loading_doctor = false
                this.getICDList();
            })
            .catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },

        // GET ICD LIST
        getICDList(){
            this.$axios.post(this.$cms_url+'resources/api/_get_provider_icd.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                    request_type: 'icd'
                }))
            }))
            .then(response => {
                this.icd_list = response.data.map(item => {
                    let icd = {
                        icd_code: item.icd_code,
                        description: item.description_long,
                        code_and_description: item.icd_code+' / '+item.description
                    }
      
                    return icd
                })

                this.loading_icd = false

                if(this.process_type.includes('LGU')){
                    this.getCPTList();
                }
            })
            .catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },

        // GET CPT LIST
        getCPTList(){
            this.$axios.post(this.$cms_url+'resources/api/_get_provider_cpt.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                    selection_type: 'phic_hmo_ip'
                }))
            }))
            .then(response => {
                response.data = this.responseDataDecryption(response.data)
                this.cpt_items = response.data
                this.getRTPCRList();
            })
            .catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },

        // GET RT-PCR LIST
        getRTPCRList(){
            this.$axios.post(this.$cms_url+'resources/api/_get_provider_cpt.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                    selection_type: 'disease_test_method'
                }))
            }))
            .then(response => {
                response.data = this.responseDataDecryption(response.data)
                this.rt_pcr_items = response.data.map(item => {
                    return item.cpt_code
                })

                this.loading_cpt = false
            })
            .catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },
        
        // GET PREVIOUS TRANSACTION ICD
        getPreviousTransactionICD(){
            if(this.previous_trans.data.transaction_number){
                if(this.previous_trans.data.icd_code){
                    this.previous_trans.confirm_loader = true
                    this.$axios.post(this.$tms_url+'resources/api/_get_transaction_icd_cpt.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            transaction_number : this.previous_trans.data.transaction_number
                        }))
                    }))
                    .then(response => {
                        response.data = this.responseDataDecryption(response.data)
                        let doctor = this.doctor_list.some(item => item.doctor_name === this.previous_trans.data.doctor_name)
                        if(doctor){
                            this.selected_doctor = {
                                doc_phic_acc_no: this.previous_trans.data.doctor_phic_account_no,
                                doc_prc_license: this.previous_trans.data.doctor_prc_license,
                                doc_tin: this.previous_trans.data.doctor_tin,
                                doc_code: this.previous_trans.data.doctor_code,
                                doctor_name: this.previous_trans.data.doctor_name,
                                doctor_first_name: this.previous_trans.data.doctor_first_name,
                                doctor_middle_name: this.previous_trans.data.doctor_middle_name,
                                doctor_last_name: this.previous_trans.data.doctor_last_name,
                                specialization: this.previous_trans.data.specialization,
                                doc_autocomplete: this.previous_trans.data.doctor_name + ' ' + this.previous_trans.data.specialization + ' ' + this.previous_trans.data.doctor_tin + ' ' + this.previous_trans.data.doctor_prc_license
                            }
                        }else{
                            this.display_previous_doctor = true
                        }
    
                        response.data.forEach(element => {
                            this.selected_previous_diagnosis.push({
                                icd_tag: 'NEW',
                                icd_code: element.icd_code,
                                description: element.icd_description,
                                hmo_icd_status: element.hmo_icd_status,
                                cpt_list: element.procedure_list
                            })
                        })
                        
                        this.display_previous_diagnosis = true
                        this.selected_room.type = this.previous_trans.data.room_type
                        this.previous_doctor_notes = this.previous_trans.data.doctor_note
                        this.previous_trans.data.primary_icd = response.data[0].icd_code
                        this.previous_trans.dialog = false
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    let doctor = this.doctor_list.some(item => item.doctor_name === this.previous_trans.data.doctor_name)
                    if(doctor){
                        this.selected_doctor = {
                            doc_phic_acc_no: this.previous_trans.data.doctor_phic_account_no,
                            doc_prc_license: this.previous_trans.data.doctor_prc_license,
                            doc_tin: this.previous_trans.data.doctor_tin,
                            doc_code: this.previous_trans.data.doctor_code,
                            doctor_name: this.previous_trans.data.doctor_name,
                            doctor_first_name: this.previous_trans.data.doctor_first_name,
                            doctor_middle_name: this.previous_trans.data.doctor_middle_name,
                            doctor_last_name: this.previous_trans.data.doctor_last_name,
                            specialization: this.previous_trans.data.specialization,
                            doc_autocomplete: this.previous_trans.data.doctor_name + ' ' + this.previous_trans.data.specialization + ' ' + this.previous_trans.data.doctor_tin + ' ' + this.previous_trans.data.doctor_prc_license
                        }
                    }else{
                        this.display_previous_doctor = true
                    }
                    
                    this.selected_room.type = this.previous_trans.data.room_type
                    this.previous_doctor_notes = this.previous_trans.data.doctor_note
                    this.previous_trans.dialog = false
                }
            }else{
                this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow', title: 'Selection Required', body: 'Please choose from your previous transaction first', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }
        },

        // CONFIRM GO BACK TO ELIGIBILITY
        confirmGoBackToEligibility(){
            this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-help-circle', color: 'primary', title: 'Are you sure you want to leave Inpatient Page?', body: 'This will bring you back to eligibility page', btn_pry_txt: 'LEAVE', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_pry_emt: 'goBackToEligibility', btn_sec_txt: 'STAY ON THIS PAGE', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert' }
        },

        // LEAVE INPATIENT
        goBackToEligibility(){
            this.$router.push('/eligibility')
        },

        // SWITCH SELECTION OF DIAGNOSIS
        switchSelection(){
            if(this.selected_icd.length > 0){
                this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'All selected diagnosis will be removed', body: 'Are you sure you want to continue?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'removeAllDiagnosis', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
            }else{
                this.removeAllDiagnosis('switch_selection');
            }
        },

        // REMOVE ALL DIAGNOSIS
        removeAllDiagnosis(){
            this.selected_icd = []
            this.selected_icd_filter = []
            this.entered_diagnosis = ''
            if(this.switch_selection){
                this.selected_icd = [{
                    icd_code: '',
                    description: '',
                    code_and_description: '',
                    procedure_list: []
                }]
                this.switch_selection = false
            }else{
                this.switch_selection = true
            }
        },

        // ADD DIAGNOSIS FIELD
        addDiagnosisField(){
            this.selected_icd.push({
                icd_code: '',
                description: '',
                code_and_description: '',
                icd_loading: false,
                tooltip_text: '',
                procedure_list: []
            })
        },

        // ADD DIAGNOSIS DATA
        addDiagnosisData(index, item){
            this.selected_icd[index].icd_code = item.icd_code
            this.selected_icd[index].description = item.description
            this.selected_icd[index].code_and_description = item.icd_code+' / '+item.description
            this.selected_icd[index].hmo_icd_status = null
            this.selected_icd[index].phic_icd_status = null
            this.selected_icd[index].lgu_icd_status = null
            this.selected_icd[index].tooltip_text = ''
            this.current_icd = item.icd_code+' / '+item.description

            this.selected_icd_filter = []
            this.selected_icd.forEach(element => {
                this.selected_icd_filter.push(element.icd_code)
            })

            if(index < 2){
                this.add_diagnosis_loader = true
                this.selected_icd[index].icd_loading = true
                this.$axios.post(this.$tms_url+'resources/api/_get_transaction_sob_icd_case_rates.php', this.$qs.stringify({
                    post_data: this.wsDataEncryption(JSON.stringify({
                        request_type: 'modify_pci',
                        icd_code: item.icd_code,
                        ek_phic_id: this.member_data.member.ek_phic_id,
                        hmo_host_code: this.member_data.member.mem_hmo_host_code,
                        hmo_policy_number: this.member_data.member.mem_hmo_policy_number,
                        ...(this.member_data.member.ek_phic_id ? undefined : {
                            first_name: this.member_data.member.mem_first_name,
                            middle_name: this.member_data.member.mem_middle_name,
                            last_name: this.member_data.member.mem_last_name,
                            suffix: this.member_data.member.mem_suffix,
                            birthday: this.member_data.member.mem_birthdate
                        })
                    }))
                }))
                .then(response => {
                    response.data = this.responseDataDecryption(response.data)
                    
                    if(this.process_type === 'HMO'){ // HMO ONLY
                        if(response.data.hmo_icd_status !== 'COVERED'){
                            this.selected_icd[index].tooltip_text = 'This ICD is not Covered'
                        }
                    }else{ // WITH PHIC
                         if(response.data.confinement !== 'VALID'){
                            this.selected_icd[index].tooltip_text = 'This ICD is within 90 days'
                        }
                    }

                    this.selected_icd[index].hmo_icd_status = response.data.hmo_icd_status
                    this.selected_icd[index].phic_icd_status = index === 0 ? (response.data.case_rates.first_case_rate_code ? 'COVERED' : 'NOT COVERED') : (response.data.case_rates.second_case_rate_code ? 'COVERED' : 'NOT COVERED')
                    this.selected_icd[index].lgu_icd_status = response.data.lgu_icd_status
                    this.selected_icd[index].icd_loading = false
                    this.add_diagnosis_loader = false
                })
                .catch(error => {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                })
            }
        },

        // REMOVE ADDED DIAGNOSIS DATA
        removeDiagnosisData(index){
            if(index < 2 && this.selected_icd.length > 2){
                this.remove_diagnosis_loader = true

                this.$axios.post(this.$tms_url+'resources/api/_get_transaction_sob_icd_case_rates.php', this.$qs.stringify({
                    post_data: this.wsDataEncryption(JSON.stringify({
                        request_type: 'modify_pci',
                        icd_code: this.selected_icd[(index+1)].icd_code,
                        ek_phic_id: this.member_data.member.ek_phic_id,
                        hmo_host_code: this.member_data.member.mem_hmo_host_code,
                        hmo_policy_number: this.member_data.member.mem_hmo_policy_number,
                        ...(this.member_data.member.ek_phic_id ? undefined : {
                            first_name: this.mem_first_name,
                            middle_name: this.member_data.member.mem_middle_name,
                            last_name: this.member_data.member.mem_last_name,
                            suffix: this.member_data.member.mem_suffix,
                            birthday: this.member_data.member.mem_birthdate
                        })
                    }))
                }))
                .then(response => {
                    response.data = this.responseDataDecryption(response.data)
                    if(this.process_type === 'HMO'){
                        if(response.data.hmo_icd_status === 'COVERED'){
                            for (let i = 0; i < this.selected_icd_filter.length; i++) {
                                if(this.selected_icd_filter[i] === this.selected_icd[index].icd_code){
                                    this.selected_icd_filter.splice(i, 1)
                                }
                            }

                            this.selected_icd.splice(index, 1)
                            this.selected_icd[index].hmo_icd_status = response.data.hmo_icd_status
                            this.selected_icd[index].phic_icd_status = index === 0 ? (response.data.case_rates.first_case_rate_code ? 'COVERED' : 'NOT COVERED') : (response.data.case_rates.second_case_rate_code ? 'COVERED' : 'NOT COVERED')
                            this.selected_icd[index].lgu_icd_status = response.data.lgu_icd_status
                        }else{
                            this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'This ICD is not Covered', body: this.selected_icd[(index+1)].description, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                        }
                    }else{
                        if(response.data.confinement === 'VALID'){
                            for (let i = 0; i < this.selected_icd_filter.length; i++) {
                                if(this.selected_icd_filter[i] === this.selected_icd[index].icd_code){
                                    this.selected_icd_filter.splice(i, 1)
                                }
                            }

                            this.selected_icd.splice(index, 1)
                            this.selected_icd[index].hmo_icd_status = response.data.hmo_icd_status
                            this.selected_icd[index].phic_icd_status = index === 0 ? (response.data.case_rates.first_case_rate_code ? 'COVERED' : 'NOT COVERED') : (response.data.case_rates.second_case_rate_code ? 'COVERED' : 'NOT COVERED')
                            this.selected_icd[index].lgu_icd_status = response.data.lgu_icd_status
                        }else{
                            this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'This ICD is within 90 day', body: this.selected_icd[(index+1)].description, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                        }
                    }

                    this.remove_diagnosis_loader = false
                })
                .catch(error => {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                })
            }else{
                for (let i = 0; i < this.selected_icd_filter.length; i++) {
                    if(this.selected_icd_filter[i] === this.selected_icd[index].icd_code){
                        this.selected_icd_filter.splice(i, 1)
                    }
                }

                this.selected_icd.splice(index, 1)
            }
        },

        // ADD PROCEDURE
        addProcedure(event, index){
            if(event.rvs_code){
                this.$axios.post(this.$tms_url+'resources/api/_get_transaction_sob_cpt_rvs.php', this.$qs.stringify({
                    post_data: this.wsDataEncryption(JSON.stringify({
                        selection_type: 'phic_hmo_ip',
                        provider_code: this.$store.state.prv_data.provider_code,
                        provider_tin: this.$store.state.prv_data.provider_tin,
                        plan_code: this.member_data.member.mem_plan_code,
                        hmo_host_code: this.member_data.member.mem_hmo_host_code,
                        cpt_code: event.cpt_code,
                        rvs_code: event.rvs_code,
                        rvs_category: event.rvs_category
                    }))
                }))
                .then(response => {
                    response.data = this.responseDataDecryption(response.data)
                    this.selected_icd[index].procedure_list.push({
                        phic_cpt_status: response.data.phic_cpt_status,
                        cpt_code: response.data.cpt_code,
                        cpt_description: response.data.cpt_description,
                        rvs_code: response.data.rvs_code,
                        rvs_description: response.data.rvs_description,
                        rvs_case_rate: response.data.rvs_rate,
                        rvs_hci_fee: response.data.rvs_hci_fee,
                        rvs_professional_fee: response.data.rvs_professional_fee,
                        rvs_category: response.data.rvs_category
                    })
            
                    this.selected_cpt_holder = {}
                })
                .catch(error => {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                })
            }else{
                this.selected_icd[index].procedure_list.push(event)
                this.selected_cpt_holder = {}
            }
        },

        // REMOVE PROCEDURE
        removeProcedure(icd_index, cpt_index){
            this.selected_icd[icd_index].procedure_list.splice(cpt_index, 1)
        },

        // CHECK EMPTY FIELDS
        checkEmptyFields(){
            if(this.switch_selection){
                if(this.selected_doctor && this.entered_diagnosis && this.selected_room.type){
                    this.confirm_dialog = true
                }else{
                    this.empty_fields = true
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Field is empty/Invalid Value', body: 'Please fill out all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                }
            }else{
                let no_empty = true
                
                if(this.selected_icd.length === 0){
                    no_empty = false
                    this.addDiagnosisField();
                }else{
                    this.selected_icd.forEach(element => {
                        if(!element.icd_code){
                            no_empty = false
                        }
                    })
                }

                if(this.selected_doctor && no_empty && this.selected_room.type){
                    this.confirm_dialog = true
                }else{
                    this.empty_fields = true
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Field is empty/Invalid Value', body: 'Please fill out all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                }
            }
        },

        // POST TO PATIENT LIST
        postInpatient(){
            this.confirm_dialog_loader = true

            let validate_mem_phic_pin = this.process_type.includes('LGU') && !this.member_data.member.mem_phic_pin ? false : true
            let host_claim_type = ''

            if(this.member_data.member.mem_hmo_host_code && this.phic_member_eligibility_status){
                host_claim_type = 'FOR HMO AND PHIC CLAIMS'
            }else if(!this.member_data.member.mem_hmo_host_code && this.phic_member_eligibility_status){
                host_claim_type = 'FOR PHIC CLAIMS'
            }else{
                host_claim_type = 'FOR HMO CLAIMS'
            }

            this.selected_doctor.is_primary_doctor = 1
            this.selected_doctor.is_signed = 0 
            this.selected_doctor.doc_autocomplete = undefined
        
            let admission_diagnosis = []
            let transaction_id = ''
            let icd_code = admission_diagnosis.length > 0 ? admission_diagnosis[0].icd_code : false

            if(this.previous_trans.data.primary_icd === icd_code && this.previous_trans.data.doctor_tin === this.selected_doctor.doc_tin){
                transaction_id = this.previous_trans.data.transaction_id
            }else{
                transaction_id = undefined
            }

            let phic_discharged_diagnosis = []
            let selected_rt_pcr = []
            this.selected_icd.forEach((icd, icd_index) => {
                admission_diagnosis.push({
                    icd_code: icd.icd_code
                })

                if(icd_index === 0){    
                    icd.icd_type = 'PRIMARY'
                }else if(icd_index === 1){
                    icd.icd_type = 'SECONDARY'
                }else{
                    icd.icd_type = 'OTHERS'
                }
                
                phic_discharged_diagnosis.push({
                    icd_tag: 'NEW',
                    icd_type: icd.icd_type,
                    icd_code: icd.icd_code,
                    hmo_icd_status: icd.hmo_icd_status,
                    phic_icd_status: icd.phic_icd_status,
                    lgu_icd_status: icd.lgu_icd_status,
                    procedure_list: [],
                })

                if(icd.procedure_list.length > 0){
                    icd.procedure_list.forEach(cpt => {
                        phic_discharged_diagnosis[icd_index].procedure_list.push({
                            cpt_tag: 'NEW',
                            cpt_code: cpt.cpt_code,
                            hmo_cpt_status: cpt.hmo_cpt_status ? cpt.hmo_cpt_status : null,
                            phic_cpt_status: cpt.rvs_code ? 'COVERED' : 'NOT COVERED',
                            lgu_cpt_status: cpt.lgu_cpt_status ? cpt.lgu_cpt_status : null,
                            
                            ...(cpt.rvs_code ? {
                                rvs_tag: 'NEW',
                                rvs_code: cpt.rvs_code,
                                rvs_case_rate: cpt.rvs_case_rate.toString().replace(/,/g, ''),
                                rvs_hci_fee: cpt.rvs_hci_fee.toString().replace(/,/g, ''),
                                rvs_professional_fee: cpt.rvs_professional_fee.toString().replace(/,/g, ''),
                                rvs_category: cpt.rvs_category
                            } : undefined)
                        })
                        
                        // FOR LABORATORY
                        if(this.rt_pcr_items.includes(cpt.cpt_code)){
                            selected_rt_pcr.push(cpt.cpt_code)
                        }
                    })
                }
            })

            this.$axios.post(this.$tms_url+'resources/controller/trn_add_inpatient.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                    created_by: this.$store.state.usr_credentials.user_name,
                    transaction_status: 'ISSUED',
                    phic_host_code: this.process_type === 'HMO' || !validate_mem_phic_pin ? undefined : 'PHIC',
                    hmo_host_code: this.member_data.member.mem_hmo_host_code ? this.member_data.member.mem_hmo_host_code : null,
                    lgu_host_code: this.member_data.member.lgu_host_code ? this.member_data.member.lgu_host_code : null,
                    ek_lgu_id: this.member_data.member.ek_lgu_id ? this.member_data.member.ek_lgu_id : null,
                    hmo_policy_number: this.member_data.member.mem_hmo_policy_number,
                    mem_phic_pin: this.member_data.member.mem_phic_pin,
                    host_claim_type: host_claim_type,
                    transaction_type: 'INPATIENT',
                    source_of_transaction: 'eclaims',
    
                    ad_forms_progress_status: host_claim_type === 'FOR HMO CLAIMS' || !validate_mem_phic_pin  ? null : 'On Process',
                    provider_code: this.$store.state.prv_data.provider_code,
                    provider_tin: this.$store.state.prv_data.provider_tin,
    
                    first_name: this.member_data.member.mem_first_name ? this.member_data.member.mem_first_name.toUpperCase() : '',
                    middle_name: this.member_data.member.mem_middle_name ?this.member_data.member.mem_middle_name.toUpperCase() : '',
                    last_name: this.member_data.member.mem_last_name ? this.member_data.member.mem_last_name.toUpperCase() : '',
                    initial: this.member_data.member.mem_suffix ? this.member_data.member.mem_suffix : '',
                    birthday: this.member_data.member.mem_birthdate,
    
                    phic_member_eligibility_status: this.phic_member_eligibility_status,
                    transaction_id: transaction_id,
    
                    phic_doctor: this.selected_doctor,
    
                    ...(this.phic_member_eligibility_status === 'Eligible' ? {
                        phic_tracking_number: this.member_data.member.phic_tracking_num,
                        request_type: '',
                        room_type: this.selected_room.type,
                        room_rate: '',
                        claim_status: '',
                        forms_status: '',
                        phic_accreditation_number: '',
                        phic_member_category: this.member_data.member.mem_category,
                        hospital_Code: '',
                        hospital_transmittal_code: '',
    
                        gender: this.member_data.member.mem_gender,
                        phone_no: this.member_data.member.mem_mobile_number,
                        mobile_no: '',
                        email_add: this.member_data.member.mem_email_address,
                        mailing_add: this.member_data.member.mem_mailing_address,
                        zip_code: '',
                        phic_number: '',
                        phil_claim_type: '',
                        receipt_ticket_number: '',
                        phic_member_status: '',
                        suffix: '',
                        ek_phic_id: this.member_data.member.ek_phic_id,
                        phic_member_type: this.member_data.member.mem_phic_mem_type
                    } : undefined ),
    
                    ...(this.member_data.member.principal_data.length !== 0 ? {
                        prn_phic_member_type: this.member_data.member.mem_phic_mem_type,
                        prn_member_pin: this.member_data.member.mem_phic_pin,
                        prn_first_name: this.member_data.member.principal_data.FIRST_NAME._text,
                        prn_middle_name: this.member_data.member.principal_data.MIDDLE_NAME._text,
                        prn_last_name: this.member_data.member.principal_data.LAST_NAME._text,
                        prn_initial: '',
                        prn_birthday: this.member_data.member.principal_data.BIRTHDATE._text,
                        prn_gender: this.member_data.member.principal_data.GENDER._text.charAt(0) === 'M' ? 'MALE' : 'FEMALE',
                        prn_phone_no: this.member_data.member.principal_data.PHONE_NO._text,
                        prn_mobile_no: this.member_data.member.principal_data.MOBILE_NO._text,
                        prn_email_add: this.member_data.member.principal_data.EMAIL_ADDRESS._text,
                        prn_zip_code: this.member_data.member.principal_data.ZIP_CODE._text,
                        prn_phic_number: '',
                        prn_quali_posted_contri: '',
                        prn_suffix: this.member_data.member.principal_data.SUFFIX._text,
                        prn_date_updated: ''
                    } : undefined),
                    
                    ...(this.switch_selection ? { admission_diag_description: this.entered_diagnosis } : { 
                        admission_diagnosis: admission_diagnosis,
                        phic_discharged_diagnosis: phic_discharged_diagnosis
                    }),
                    
                    ...(selected_rt_pcr.length > 0 ? { 
                        disease_test: {
                            ek_lgu_id: this.member_data.member.ek_lgu_id ? this.member_data.member.ek_lgu_id : null,
                            ek_phic_id: this.member_data.member.ek_phic_id ? this.member_data.member.ek_phic_id : null,
                            ek_hmo_id: this.member_data.member.ek_hmo_id ? this.member_data.member.ek_hmo_id : null,
                            phic_pin: this.member_data.member.mem_phic_pin ? this.member_data.member.mem_phic_pin : null,
                            hmo_policy_number: this.member_data.member.mem_hmo_policy_number ? this.member_data.member.mem_hmo_policy_number : null,
                            provider_tin: this.$store.state.prv_data.provider_tin,
                            provider_code: this.$store.state.prv_data.provider_code,
                            doctor_tin: this.selected_doctor.doc_tin,
                            doctor_code: this.selected_doctor.doc_code,
                            post_doctor_tin: null,
                            post_doctor_code: null,
                            post_result_icd_code: null,
                            disease: 'covid',
                            test_result: null,
                            cpt_list: selected_rt_pcr
                        }
                    } : undefined)
                }))
            })).then(async(response) => {
                if (this.selected_referral) {
                    await this.saveTransactionReferral()
                }
                response.data = this.responseDataDecryption(response.data)
                if(response.data.add_transaction === '1' && response.data.add_doctor === '1' && response.data.add_admission_diagnosis === '1'){
                    sessionStorage.clear()
                    this.alert = { display: true, type: 'standard', width: '420', icon: 'mdi-check-circle', color: 'success', title: 'TRANSACTION HAS BEEN COMPLETED', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }else{
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }  
            })
            .catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },

        saveTransactionReferral() {
            return this.$axios.post(this.$tms_url+'resources/controller/trn_upd_transaction_referral.php', this.$qs.stringify({
                    post_data: this.wsDataEncryption(JSON.stringify({
                        ek_lgu_id: this.member_data.member.ek_lgu_id,
                        referral_code: this.selected_referral.referral_code,
                        status: '1',
                        acknowledged_by_user_code: this.$store.state.usr_credentials.user_code,
                        acknowledged_by_operator_name: this.$store.state.usr_credentials.user_complete_name,
                        acknowledged_by_provider_tin: this.$store.state.prv_data.provider_tin,
                        acknowledged_by_provider_name: this.$store.state.prv_data.provider_name,
                        acknowledged_by_provider_code: this.$store.state.prv_data.provider_code,
                        acknowledged_by_doctor_first_name: this.selected_doctor.doctor_first_name,
                        acknowledged_by_doctor_middle_name: this.selected_doctor.doctor_middle_name,
                        acknowledged_by_doctor_last_name: this.selected_doctor.doctor_last_name,
                        acknowledged_by_doctor_code: this.selected_doctor.doc_code,
                        acknowledged_by_doctor_tin: this.selected_doctor.doc_tin
                    }))
            }))
            .then(response => {
                    if(!response.data.success){
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
            })
            .catch(error => {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },
    },


    // REMOVE SESSION
    beforeDestroy(){
        sessionStorage.removeItem('acpfeivcpgci')
    }
}
</script>

<style scoped>
@media only screen and (min-width: 1920px){
    .container{
        max-width: 1800px;
    }
}
.confirm-dialog-field{
    background-color: transparent !important;
    border: 1px solid rgb(180, 180, 180) !important;
    font-weight: 400;
    line-height: 30px;
    margin-bottom: 0.5em;
    min-height: 35px;
    padding: 6px;
    padding-left: 12px;
}
.confirm-dialog-label{
    font-weight: 500;
    color: #787777;
}

::v-deep .v-dialog {
    overflow-y: hidden;
    overflow-x: hidden;
}
</style>