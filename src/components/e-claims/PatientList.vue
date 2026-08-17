<template>
    <div class="px-sm-9 px-4 pb-2 d-print-none">
        <Navbar :navbar="navbar" />
        <v-row v-if="$store.state.usr_credentials" class="mt-7 mb-2" justify="space-between" wrap>
            <h2 v-if="$store.state.prv_config && $store.state.usr_credentials.department !== 'Admission'" class="font-weight-medium align-self-end order-1 order-sm-0">Patient List</h2>
            <h2 v-else class="font-weight-medium align-self-end order-1 order-sm-0">Philhealth Claim List</h2>
            <v-col v-if="$store.state.prv_config && $store.state.usr_credentials.department !== 'Admission'" class="order-0 order-sm-1" cols="12" sm="4" md="3">
                <v-img :src="$store.state.prv_config.provider_logo" class="ml-sm-auto mx-sm-0 mx-auto" max-width="200" width="180" height="60" alt="Provider Logo" contain></v-img>
            </v-col>
        </v-row>
        
        <v-row wrap>
            <v-col cols="12" sm="8" md="9" lg="10" xl="10" class="pr-sm-4">
                <v-text-field v-model="search_tbl" placeholder="Search" outlined rounded dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="text-right">
                <v-btn @click="clearFilter" color="secondary lighten-3"><v-icon left>mdi-refresh</v-icon> CLEAR SEARCHES</v-btn>
            </v-col>
        </v-row>

        <v-row class="mt-4" align="baseline" wrap>
            <v-col cols="12" sm="2" md="1" lg="1" xl="1">FILTER: <span class="pl-4">Date</span></v-col>
            <v-col cols="12" sm="5" md="2" lg="2" xl="2" class="pl-sm-2">
                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-text-field :value="formatDate(start_date)" v-on="on" label="Start Date" outlined readonly dense></v-text-field>
                    </template>
                    <v-date-picker v-model="start_date" :max="date_today && end_date" no-title></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="12" sm="5" md="2" lg="2" xl="2" class="pl-sm-2">
                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-text-field :value="formatDate(end_date)" v-on="on" label="End Date" outlined readonly dense></v-text-field>
                    </template>
                    <v-date-picker v-model="end_date" :max="date_today" :min="start_date" :disabled="!start_date" no-title></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="" sm="" md="2" lg="2" xl="2"></v-col>
            <v-col cols="12" sm="12" md="5" lg="5" xl="5">
                <v-row wrap>
                    <v-col cols="12" sm="4" md="4" lg="4" xl="4" class="pr-sm-2">
                        <v-select v-model="claim_status" :items="claims_status" :disabled="$store.state.usr_credentials.department !== 'Credit and Collection'" label="Claim Status" height="10" outlined dense></v-select>
                    </v-col>
                    <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                        <v-select v-model="patient_type" :items="patients_type" label="Patient Type" height="10" outlined dense></v-select>
                    </v-col>
                    <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                        <v-select v-model="series_no" :items="series_types" label="Series / Claim / Receipt / Transmission" height="10" outlined dense></v-select>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        
        <!-- TABLE FOR ADMISSION -->
        <v-data-table v-if="$store.state.usr_credentials.department === 'Admission'" :headers="pl_headers_admission" :items="filtered_items" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :loading="tbl_loading" :mobile-breakpoint="0" class="elevation-2 mb-5" sort-by="tstamp" sort-desc>
            <template v-slot:item="{ item }">
                <tr :class="{'orange--text text--darken-3' : item.ad_forms_progress_status === 'On Process'}">
                    <td>{{ formatDateAndTime(item.tstamp) }}</td>
                    <td>{{ item.patient_name }}</td>
                    <td>{{ item.phic_tracking_number }}</td>
                    <td>{{ item.transaction_type }}</td>
                    <td>{{ item.phic_member_eligibility_status ? item.phic_member_eligibility_status : 'N/A' }}</td>
                    <td>{{ item.hmo_healthcare_status }}</td>
                    <td>{{ item.ad_forms_progress_status }}</td>
                    <td class="py-1">
                        <v-btn :disabled="item.ad_forms_progress_status !== 'On Process'" @click="confirmSubmitToNurse(item)" class="mr-2" small tile><v-icon class="mr-1" small>mdi-check</v-icon>SUBMIT TO NURSE STATION</v-btn>
                        <v-btn :disabled="item.phic_member_eligibility_status !== 'Eligible'" @click="getPbefData(item)" :loading="pbef_loading_item === item.ek_lgu_id" small tile><v-icon small>mdi-file-document-outline</v-icon>PBEF</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        
        <!-- TABLE FOR NURSE STATION -->
        <v-data-table v-else-if="$store.state.usr_credentials.department === 'Nurse Station'" :headers="pl_headers_nurse" :items="filtered_items" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :loading="tbl_loading" :mobile-breakpoint="0" class="elevation-2 mb-5" sort-by="tstamp" sort-desc>
            <template v-slot:item="{ item }">
                <tr v-if="item.ad_forms_progress_status !== 'On Process'" :class="[(item.nrs_forms_progress_status === 'Pending' ? 'red--text' : ''), (item.nrs_forms_progress_status === 'On Process' ? 'orange--text text--darken-3' : '')]">
                    <td>{{ formatDateAndTime(item.tstamp) }}</td>
                    <td>{{ item.patient_name }}</td>
                    <!-- <td>{{ item.phic_tracking_number }}</td> -->
                    <td>{{ item.transaction_type }}</td>
                    <td>{{ item.phic_member_eligibility_status ? item.phic_member_eligibility_status : 'N/A' }}</td>
                    <!-- <td>{{ item.hmo_healthcare_status }}</td> -->
                    <td> 
                        <v-chip v-for="item,index in item.phic_packages" :key="index" small class="justify-center my-1 mx-1"> {{ item}} </v-chip>
                    </td>
                    <td>{{ item.eclaims_status }}<br>{{ item.doctor_signature == 0 || item.hospital_signature == 0 || item.patient_signature == 0 ? 'Signature Required' : '' }}</td>
                    <td>
                        <div class="py-1">
                            <v-btn @click="eClaimProcessing(item)" class="mr-2" small tile><v-icon small>mdi-format-list-bulleted</v-icon>E-CLAIM</v-btn>
                            <v-btn :disabled="item.phic_member_eligibility_status !== 'Eligible'" @click="getPbefData(item)" :loading="pbef_loading_item === item.ek_lgu_id" small tile><v-icon small>mdi-file-document-outline</v-icon>PBEF</v-btn>
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>
        
        <!-- TABLE FOR CREDIT & COLLECTION -->
        <v-data-table v-else-if="$store.state.usr_credentials.department === 'Credit and Collection'" :headers="pl_headers_credit" :items="filtered_items" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :loading="tbl_loading" :mobile-breakpoint="0" class="elevation-2 mb-5" sort-by="tstamp" sort-desc>
            <!-- <template v-slot:item="{ item }">
                <tr v-if="item.crd_forms_progress_status !== null" :class="[(item.crd_forms_progress_status === 'Pending' ? 'red--text' : ''), (item.crd_forms_progress_status === 'On Process' ? 'orange--text text--darken-3' : '')]">
                    <td>{{ formatDateAndTime(item.tstamp) }}</td>
                    <td>{{ item.patient_name }}</td>
                    <td>{{ item.phic_tracking_number }}</td>
                    <td>{{ item.transaction_type }}</td>
                    <td>{{ item.phic_member_eligibility_status ? item.phic_member_eligibility_status : 'N/A' }}</td>
                    <td>{{ item.hmo_healthcare_status }}</td>
                    <td>{{ item.phic_case_number }}</td>
                    <td>{{ item.crd_forms_progress_status }}<br>{{ item.doctor_signature == 0 || item.hospital_signature == 0 || item.patient_signature == 0 ? 'Signature Required' : '' }}</td>
                    <td>{{ item.crd_claims_status }}</td>
                    <td class="py-1">
                        <v-btn @click="eClaimProcessing(item)" class="mr-2" small tile><v-icon small>mdi-format-list-bulleted</v-icon>E-CLAIM</v-btn>
                        <v-btn :disabled="item.phic_member_eligibility_status !== 'Eligible'" @click="getPbefData(item)" small tile><v-icon small>mdi-file-document-outline</v-icon>PBEF</v-btn>
                    </td>
                </tr>
            </template> -->
            <template v-slot:item="{ item }">
                <tr>
                <!-- <tr v-if="item.crd_forms_progress_status === null" :class="[(item.crd_forms_progress_status === 'Pending' ? 'red--text' : ''), (item.crd_forms_progress_status === 'On Process' ? 'orange--text text--darken-3' : '')]"> -->
                    <td>{{ formatDateAndTime(item.tstamp) }}</td>
                    <td>{{ item.patient_name }}</td>
                    <!-- <td>{{ item.phic_tracking_number }}</td> -->
                    <td>{{ item.transaction_type }}</td>
                    <td>{{ item.phic_member_eligibility_status ? item.phic_member_eligibility_status : 'N/A' }}</td>
                    <!-- <td>{{ item.hmo_healthcare_status }}</td> -->
                    <!-- <td>{{ item.phic_case_number }}</td> -->
                    <td>{{ item.series_lhio }}</td>
                    <td>{{ item.claim_no }}</td>
                    <td>{{ item.receipt_ticket_no }}</td>
                    <td>{{ item.transmission_control_no }} </td>
                    <td> {{  item.crd_claims_status }}</td>
                    <td>{{ item.crd_forms_progress_status }}<br>{{ item.doctor_signature == 0 || item.hospital_signature == 0 || item.patient_signature == 0 ? 'Signature Required' : '' }}</td>
                    <td> 
                        <v-chip v-for="item,index in item.phic_packages" :key="index" small class="justify-center my-1 mx-1"> {{ item}} </v-chip>
                    </td>
                    <td>
                        <div class="py-1 d-flex justify-center align-center"> 
                            <v-btn @click="eClaimProcessing(item)" class="mr-2" small tile><v-icon small>mdi-format-list-bulleted</v-icon>E-CLAIM</v-btn>
                            <v-btn @click="getPbefData(item)" :disabled="item.phic_member_eligibility_status !== 'Eligible'" :loading="pbef_loading_item === item.ek_lgu_id" class="mr-2" small tile><v-icon small>mdi-file-document-outline</v-icon>PBEF</v-btn>
                            <v-btn @click="getTrackStatus(item)" :disabled="!item.receipt_ticket_no" small tile><v-icon small>mdi-file-document-outline</v-icon>Track Status</v-btn>
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>

        <v-dialog v-if="track_status_dialog" v-model="track_status_dialog" width="950" persistent class="d-print-none">
            <v-card class="pa-1">
                <v-card-title class="d-flex justify-center d-print-none"> ECLAIMS TRACK STATUS </v-card-title>
                <div v-if="track_status_loading" class="text-center my-8 mr-1">
                    <v-progress-circular color="primary" size="50" indeterminate></v-progress-circular>
                </div>
                <div v-else>
                    <v-tabs v-model="track_status_type" class="px-3 d-print-none">
                        <v-tab>E-Confirmation</v-tab>
                        <v-tab v-if="voucher_details.voucher_no">Voucher</v-tab>
                    </v-tabs>
                    <div v-if="track_status_type === 0"> 
                        <eConfirmation :track_status_holder="track_status_holder"/>
                        <div class="d-print-none">   
                            <v-sheet v-if="voucher_details.voucher_no" class="pa-4"> 
                                <v-row dense>
                                    <v-col cols="12" sm="12" md="12" lg="12">
                                        <v-row dense> 
                                            <v-col cols="12" sm="6" md="6" lg="64"> 
                                                <h6 class="body-2">Voucher No. </h6>
                                                <v-text-field :value="voucher_details.voucher_no" readonly hide-details dense> </v-text-field>    
                                            </v-col>  
                                            <v-col cols="12" sm="6" md="6" lg="6"> 
                                                <h6 class="body-2">Voucher Date </h6>
                                                <v-text-field :value="voucher_details.voucher_date" readonly hide-details dense> </v-text-field>    
                                            </v-col>  
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <!-- <WithVoucher :voucher_details="voucher_details"/> -->
                                <!-- <v-sheet class="d-flex justify-end mt-3"> 
                                    <v-btn @click="printVoucherDetails" class="white--text d-print-none" color="#367c9d" small>Print Voucher Details<v-icon color="white" right>mdi-printer</v-icon></v-btn>
                                </v-sheet> -->
                            </v-sheet>
                            
                            <v-card-subtitle class="d-flex justify-end mt-1 px-4">
                                <h4 class="body-2"> As of: {{ track_status_holder.STATUS.pAsOf }} - {{ track_status_holder.STATUS.pAsOfTime }} </h4>
                            </v-card-subtitle>
                            <v-row dense class="pa-4">
                                <v-col cols="12" sm="12" md="8" lg="8">
                                    <h6 class="body-2">Claim Date Refile </h6>
                                    <v-text-field :value="track_status_holder.STATUS.CLAIM.pClaimDateRefile" readonly hide-details dense> </v-text-field>    
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4">
                                    <h6 class="body-2">Claim Status </h6>
                                    <v-text-field :value="track_status_holder.STATUS.CLAIM.pStatus" readonly hide-details dense> </v-text-field>    
                                </v-col>
                            </v-row>  
                            <v-card v-if="track_status_holder.STATUS" width="500" class="elevation-0 mx-auto"> 
                                <v-timeline>
                                    <v-timeline-item v-for="(process, key) in track_status_holder.STATUS.CLAIM.TRAIL" :key="key" small>
                                        <v-card class="elevation-2" >
                                            <v-card-title class="body-1">
                                                {{ process.pProcessDate }}
                                            </v-card-title>
                                            <v-card-text>
                                                {{ process.pProcessStage }}
                                            </v-card-text>
                                        </v-card>
                                    </v-timeline-item>
                                </v-timeline>
                            </v-card>
                            <div v-if="this.track_status_holder.eclaims_status === 'RETURN'" class="overflow-hidden px-12">
                                <v-divider class="my-6"></v-divider>

                                <!-- FILE ATTACHMENT FOR ADDITIONAL ATTACHMENTS -->
                                <label>Please ensure the attachment complies with the requirements.:</label>
                                <v-row justify="center" class="mt-4 pb-2" wrap>
                                    <v-col cols="12" sm="12" md="18" lg="8">
                                        <v-select v-model="selected_doc_type" :items="certification_items" item-text="doc_description" label="Document Type" outlined dense return-object> </v-select>
                                        <label for="attached-certification" class="file-attachment">Choose File</label> 
                                        <span class="ml-1" v-if="cert_data.section3.length === 0">No file chosen</span>
                                        <span class="ml-1" v-else>{{ cert_data.section3.length }} files</span>
                                        <input :disabled="new_additional_status === 'Processing' || selected_doc_type.length === 0"  @change="addAttachedAdditional" id="attached-certification" class="mt-4 d-none" type="file" ref="additional" accept=".pdf" multiple><br>
                                        <v-divider class="mt-3"></v-divider>

                                        <div v-for="(attached, i) in cert_data.section3" :key="i" class="text-left">
                                            <h5 class="font-weight-medium grey lighten-3 text-left pl-2 py-1 mt-2">
                                                <v-icon color="success" size="20">mdi-check</v-icon>
                                                {{ attached.file_name }} 
                                                <v-icon v-show="attached.loader === false || attached.loader === undefined" :disabled="new_additional_status === 'Processing'" @click="removeAttachedAdditional(i, 'old')" class="remove-attachment" size="20">mdi-close</v-icon>
                                                <label v-show="attached.loader" class="remove-attachment font-italic">Deleting...</label>
                                            </h5>
                                        </div>

                                        <div v-for="(view, i) in view_attached_additional" :key="'view'+i" class="text-left">
                                            <h5 class="font-weight-medium grey lighten-3 text-left pl-2 py-1 mt-2">
                                                <template v-if="view.file_size > 30">
                                                    <v-tooltip bottom color="red">
                                                        <template #activator="{ on }">
                                                            <v-icon v-on="on" class="pr-1" color="red" size="20">mdi-alert-circle-outline</v-icon>
                                                        </template>
                                                        File size exceeds 30 MB
                                                    </v-tooltip>
                                                </template>
                                                <template v-else>
                                                    <v-progress-circular v-if="new_additional_status === true || new_additional_status === 'Processing'" class="mr-2" color="red" size="13" width="1.4" :indeterminate="new_additional_status === 'Processing'"></v-progress-circular>
                                                    <v-icon v-else color="success" size="20">mdi-check</v-icon>
                                                </template>
                                                {{ view.name }} <span class="text--secondary">- {{ view.file_size }} MB</span>
                                                <v-icon v-show="new_additional_status !== 'Processing'" @click="removeAttachedAdditional(i, 'new')" class="remove-attachment" size="20">mdi-close</v-icon>
                                            </h5>
                                        </div>

                                        <div class="text-center">
                                            <v-btn :disabled="file_size_exceeds" :loading="loading_additional_attachment" @click="postFileOfAdditional" class="mt-4" small tile>UPLOAD FILE</v-btn>
                                            <v-btn v-if="cert_data.section3.length > 0 || view_attached_additional.length > 0" @click="view_file_additional = true" class="mt-4 ml-2" small tile>VIEW FILE</v-btn>
                                            <span class="d-block mt-3">Maximum upload size: 30 MB.</span>
                                        </div>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                    </div>

                    <div  v-if="track_status_type === 1 && voucher_details.voucher_no">
                         <WithVoucher :voucher_details="voucher_details" :track_status_holder="track_status_holder"/>       
                    </div>
                </div>
                <v-card-actions class="d-flex justify-end d-print-none"> 
                    <v-btn @click="track_status_dialog = false, track_status_holder = {}"> Close </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- VIEW FILE DIALOG FOR ADDITIONAL -->
        <v-dialog v-model="view_file_additional" width="1100" persistent>
            <v-card>
                <v-card-title class="light-blue darken-3 white--text py-2 justify-center">
                    <v-spacer></v-spacer>VIEW ATTACHMENT {{ $vuetify.breakpoint.smAndUp ? 'ATTACHMENT' : '' }}<v-spacer></v-spacer>
                    <v-btn @click="view_file_additional = false" dark icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-divider></v-divider>

                <div v-for="(attached, i) in cert_data.section3" :key="i" class="px-4 mt-2">
                    <h4>{{ i+1 }}) {{ attached.name }}</h4>
                    <embed :src="attached.file_path+'#toolbar=0&view=FitH'" width="100%" height="600px" />
                    <v-divider class="mt-4"></v-divider>
                </div>

                <div v-for="(view, i) in view_attached_additional" :key="'view'+i" class="px-4 mt-2">
                    <h4>{{ i+cert_data.section3.length+1 }}) {{ view.name }}</h4>
                    <embed :src="view.file_path+'#toolbar=0&view=FitH'" width="100%" height="600px" />
                    <v-divider class="mt-4"></v-divider>
                </div>

                <v-row justify="center" class="mt-3 pb-3" wrap>
                    <v-btn @click="view_file_additional = false" class="ml-1" color="primary">CLOSE</v-btn>
                </v-row>
            </v-card>
        </v-dialog>

        <!-- LOADER FOR E-CLAIM PROCESSING -->
        <v-overlay v-model="loading_eclaim">
            <v-progress-circular size="64" indeterminate></v-progress-circular>
        </v-overlay>
        
        <Alert :alert="alert" @submitToNurse="submitToNurse" />
    </div>
</template>

<script>
import Navbar from './../Navbar'
import Alert from './../Alert.vue'
import eConfirmation from './eConfirmation.vue'
import WithVoucher from './with-voucher/Main.vue'

export default {
    components: {
        Navbar,
        Alert,
        eConfirmation,
        WithVoucher
    },
    
    data(){
        return{
            cert_data: {
                total_cpt_amount: '',

                section2: {
                    rel_to_patient: '',
                    reason_for_signing_onbehalf: ''
                },
                
                section3: []
            },

            certification_items: [],
            selected_doc_type: [],
            selected_doct_type_holder: [],
            unsaved_attachment: '',

            // ATTACHMENTS
            new_additional_status: true,
            view_attached_additional: [],
            post_attached_additional: [],
            view_file_additional: false,
            loading_additional_attachment: false,
            file_size_exceeds: false,

            // FILTER
            search_tbl: '',
            start_date: null,
            end_date: null,
            series_no: 'ALL',
            patient_type: 'ALL',
            claim_status: 'ALL',
            patients_type: ['ALL', 'OUTPATIENT', 'INPATIENT', 'EMERGENCY'],
            claims_status: ['ALL', 'Pending', 'On Process', 'Submitted to Audit Sector', 'Screening Rejected', 'Submitted to PHIC', 'Returned by PHIC', 'Approved by PHIC'],
            series_types: ['ALL', 'SERIES LHIO', 'CLAIM NUMBER', 'RECEIPT TICKET NUMBER', 'TRANSMISSION CONTROL NUMBER'],

            // TABLE
            tbl_loading: true,
            pl_headers_admission: [
                { text: 'Date', value: 'tstamp', width: '130px' },
                { text: 'Patient Name', value: 'patient_name', width: '200px', sortable: false },
                { text: 'Tracking Number', value: 'phic_tracking_number', width: '130px', sortable: false },
                { text: 'Patient Type', value: 'transaction_type', width: '130px', sortable: false },
                { text: 'PHIC Eligibility Status', value: 'phic_member_eligibility_status', width: '190px', sortable: false },
                { text: 'HMO Eligibility Status', value: 'hmo_healthcare_status', width: '190px', sortable: false },
                { text: 'Form Status', value: 'ad_forms_progress_status', width: '200px', sortable: false },
                { text: 'Actions', value: '', width: '340px', sortable: false }
            ],
            pl_headers_nurse: [
                { text: 'Date', value: 'tstamp', width: '230px' },
                { text: 'Patient Name', value: 'patient_name', width: '200px', sortable: false },
                // { text: 'Tracking Number', value: 'phic_tracking_number', width: '130px', sortable: false },
                { text: 'Patient Type', value: 'transaction_type', width: '130px', sortable: false },
                { text: 'PHIC Eligibility Status', value: 'phic_member_eligibility_status', width: '190px', sortable: false },
                // { text: 'HMO Eligibility Status', value: 'hmo_healthcare_status', width: '190px', sortable: false },
                // { text: 'Form Status', value: 'nrs_forms_progress_status', width: '250px', sortable: false },
                { text: 'E-Claims Package', value: '', width: '210px', sortable: false },
                { text: 'Form Status', value: 'eclaims_status', width: '150px', sortable: false },
                { text: 'Actions', value: '', width: '215px', sortable: false }
            ],
            pl_headers_credit: [
                { text: 'Date', value: 'tstamp', width: '130px' },
                { text: 'Patient Name', value: 'patient_name', width: '200px', sortable: false },
                { text: 'Patient Type', value: 'transaction_type', width: '130px', sortable: false },
                { text: 'PHIC Eligibility Status', value: 'phic_member_eligibility_status', width: '190px', sortable: false },
                { text: 'Series LHIO', value: 'series_lhio', width: '190px', sortable: false },
                { text: 'Claim Number', value: 'claim_no', width: '190px', sortable: false },
                { text: 'Receipt Ticket No.', value: 'receipt_ticket_no', width: '150px', sortable: false },
                { text: 'Transmission Control No.', value: 'transmission_control_no', width: '180px', sortable: false },
                // { text: 'HMO Eligibility Status', value: 'hmo_healthcare_status', width: '190px', sortable: false },
                // { text: 'Case Number', value: 'phic_case_number', width: '130px', sortable: false },
                { text: 'Form Status', value: 'crd_forms_progress_status', width: '210px', sortable: false },
                { text: 'Claim Status', value: 'claims_status', width: '210px', sortable: false },
                { text: 'E-Claims Package', value: '', width: '210px', sortable: false },
                { text: 'Actions', value: '', width: '215px', sortable: false }
            ],
            pl_items: [],

            // OTHERS
            date_today: this.$moment().format('YYYY-MM-DD'),
            loading_eclaim: false,
            navbar: [
                { title: 'Member Eligibility', link: '/eclaims-member-eligibility-checker', icon: 'fas fa-user' },
                { title: "HCP Accreditation", link: "/eclaims-hcp-accreditation", icon: "fas fa-user-doctor" },
                { title: "Search Member PIN", link: "/eclaims-retrieve-pin", icon: "fas fa-id-card" },
                { title: "Search Employer", link: "/eclaims-search-employer", icon: "fas fa-user-friends" },
                { title: "Migrated Records", link: "/eclaims-migrated-records", icon: "fa-file-import" }
            ],
            alert: {},
            track_status_dialog: false,
            track_status_holder: {},
            track_status_loading: false,
            pbef_loading_item: null,

            voucher_details: {},
            track_status_type: 0
        }
    },

    created(){
        this.getPatientList();
        sessionStorage.clear();
        localStorage.removeItem('KFH45P')
        localStorage.removeItem('PRT950')
        localStorage.removeItem('4DVVF6')
        localStorage.removeItem('DSG64O')
        localStorage.removeItem('GPDTT4')
        localStorage.removeItem('O4RRR2')
        localStorage.removeItem('PP534T')
        localStorage.removeItem('ZC593X')
        localStorage.removeItem('PRT35S')
        localStorage.removeItem('D9GG44')
        localStorage.removeItem('FDGHH7')
        localStorage.removeItem('XPOFIF')
        localStorage.removeItem('05XFLD')
        localStorage.removeItem('FGG536')
        localStorage.removeItem('VGR084')

        if(!this.track_status_dialog){
            this.getDocumentType()
        }

    //   if(this.$store.state.usr_credentials.department === 'Admission' && this.$store.state.prv_data.hmo === 1 && this.$store.state.prv_data.lgu === 1){
    //     this.navbar = [
    //         { title: 'Tele Consult Patient List', link: '/teleconsult-queue-list', icon: 'fas fa-clipboard-list'}, 
    //         { title: 'Queue List', link: '/queue-list', icon: 'fas fa-clipboard-list'},
    //         { title: 'Philhealth Claims', link: '/patient-list', icon: 'mdi mdi-folder'},
    //         { title: 'Home', link: '/code-scanning', icon: 'fas fa-home' }
    //     ]
    //   }else{
    //     this.navbar = []
    //   }
    },

    computed: {
        // FILTERING OF TABLE DATA
        filtered_items(){
            return this.pl_items.filter((i) => {

                let searched_data =
                    (i.patient_name?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                    (i.phic_tracking_number?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                    (i.transaction_type?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                    (i.phic_member_eligibility_status?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                    (i.hmo_healthcare_status?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                    (i.series_lhio?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                    (i.claim_no?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                    (i.receipt_ticket_no?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                    (i.transmission_control_no?.toLowerCase().includes(this.search_tbl.toLowerCase()));

                let timestamp = i.tstamp ? i.tstamp.substring(0, 10) : null;

                let search = this.search_tbl ? searched_data : true;

                let date = this.start_date && this.end_date
                    ? timestamp >= this.start_date && timestamp <= this.end_date
                    : true;

                let claim_status = this.claim_status === 'ALL'
                    ? true
                    : i.crd_claims_status === this.claim_status;

                let transaction_type = this.patient_type === 'ALL'
                    ? true
                    : i.transaction_type === this.patient_type;

                // Filter by Series LHIO / Claim Number
                let series_no_type = true;

                if (this.series_no === 'SERIES LHIO') {
                    series_no_type = !!i.series_lhio;
                } else if (this.series_no === 'CLAIM NUMBER') {
                    series_no_type = !!i.claim_no;
                } else if (this.series_no === 'RECEIPT TICKET NUMBER') {
                    series_no_type = !!i.receipt_ticket_no;
                } else if (this.series_no === 'TRANSMISSION CONTROL NUMBER') {
                    series_no_type = !!i.transmission_control_no;
                }

                return (
                    search &&
                    date &&
                    claim_status &&
                    transaction_type &&
                    series_no_type
                );
            });
        }
    },

    watch: {
        // PREVENT NAVIGATE IF THERE IS UNSAVED ATTACHMENT
        view_attached_additional(value){
            let total = 0

            value.forEach(element => {
                total += parseFloat(element.file_size)
            })

            if(total > 30){
                this.file_size_exceeds = true
            }else{
                this.file_size_exceeds = false
            }
            
            if(value.length > 0){
                this.unsaved_attachment = 'unsaved_attachment'
            }else{
                this.unsaved_attachment = ''
            }
        },
    },

    methods: {
        async getDocumentType() {
            let response = await this.$services.getTransactionIpRefData({
                request_key: 'eclaim_document_type',
                category: "additional_attachment"
            })

            if(response.status === 200) {
                this.certification_items = response.data
            } else {
                this.alert = response.error
            }
        },

                // ADD ATTACHED FILE FOR ADDITIONAL
        addAttachedAdditional(){
            this.selected_doct_type_holder = this.selected_doc_type
            this.selected_doc_type = []
            let attached_files = []
            let re_attached_files = []
            this.new_additional_status = true
            let new_file_name = this.selected_doct_type_holder.doc_type+'_'+this.selected_doct_type_holder.group_type

            this.cert_data.section3.forEach(element => {
                attached_files.push(new_file_name+'_'+element.name)
            })

            this.view_attached_additional.forEach(element => {
                attached_files.push(new_file_name+'_'+element.name)
            })

            Object.values(this.$refs.additional.files).forEach(element => {
                if(attached_files.includes(new_file_name+'_'+element.name)){
                    re_attached_files.push('<br>'+new_file_name+'_'+element.name)
                }else{    
                    element.document_id = this.selected_doct_type_holder.document_id
                    element.group_type = this.selected_doct_type_holder.group_type
                    element.doc_type = this.selected_doct_type_holder.doc_type
                    
                    this.post_attached_additional.push(element)
                    this.view_attached_additional.push({
                        name: new_file_name+'_'+element.name,
                        file_size: Number(element.size * 0.00000095367432).toFixed(2),
                        file_path: window.URL.createObjectURL(element)
                    })
                }
            })

            if(re_attached_files.length > 0){
                let title = 'This file already exist and cannot be attached again.<b>' + re_attached_files + ' </b>'
                this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-close-circle', color: 'red', title: title, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }
        },

                // REMOVE ATTACHED FILE FOR ADDITIONAL
        async removeAttachedAdditional(index, status){
            if(status === 'old'){
                this.cert_data.section3[index].loader = true

                let response = await this.$services.trnDelAttachment({
                    provider_code: this.$store.state.prv_data.provider_code,
                    // phic_tracking_number: this.trans_detail.phic_tracking_number,
                    transaction_number: this.track_status_holder.transaction_number,
                    // attachment_category: 'ADDITIONAL ATTACHMENT',
                    file_name: this.cert_data.section3[index].file_name,
                    group_type: this.cert_data.section3[index].group_type
                });

                if (response.status === 200) {
                    if(response.data.success){
                        this.cert_data.section3.splice(index, 1)
                    }else{
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                }   else{
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
            } else{
                this.post_attached_additional.splice(index - this.post_attached_additional.length, 1)
                this.view_attached_additional.splice(index - this.view_attached_additional.length, 1)
            }
            document.getElementById("attached-certification").value = "";
        },

        async postFileOfAdditional(){
            if(this.post_attached_additional.length === 0){
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-close-circle', color: 'red', title: 'No file chosen. Please attach file', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }else{
                this.loading_additional_attachment = true
                this.new_additional_status = 'Processing'
                let formData = new FormData();
                let total_count = this.post_attached_additional.length
                let file_datas = []

                for( var i = 0; i < this.post_attached_additional.length; i++ ){
                    let original_name = this.post_attached_additional[i].name
                    let original_file = this.post_attached_additional[i];

                    // GENERATE NEW NAME (CUSTOMIZE AS NEEDED)
                    let new_name_file = `${this.post_attached_additional[i].doc_type}_${this.post_attached_additional[i].group_type}_${original_name}`;

                    // CREATE A NEW FILE OBJECT NAME
                    let file = new File([original_file], new_name_file, {
                        type: original_file.type,
                        lastModified: original_file.lastModified,
                    });

                    file_datas.push({
                        document_id: this.post_attached_additional[i].document_id,
                        group_type: this.post_attached_additional[i].group_type
                    });
                    
                    formData.append('file'+ i +'', file);
                }

                formData.append('post_data', this.wsDataEncryption(JSON.stringify({
                    request_key: "additional_attachment",
                    transaction_number: this.track_status_holder.transaction_number,
                    created_by: this.$store.state.usr_credentials?.user_name,
                    provider_code: this.$store.state.prv_data.provider_code,
                    file_datas: file_datas,
                    attachment_category: 'ADDITIONAL ATTACHMENT',
                    total_count: total_count,
                    rth: this.track_status_holder.eclaims_status === "RETURN" ? '1' : '0'
                })))

                let response = await this.$services.trnAddEclaimsAttachedFiles({
                        formData
                });

                if (response.status === 200) {
                    if(response.status === 200) {
                        if(response.data.success){         
                            this.responseDataDecryption(response.data.file_path).forEach(element => {
                                let no_of_file = element.file_name.split('_')[0]
                                let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
                                let sum = no_of_file.length + 8 + provider.length + this.track_status_holder.transaction_number.length + 4

                                element.name = element.file_name.substring(sum)
                                element.loader = false
                                element.group_type = this.selected_doct_type_holder.group_type
                                this.cert_data.section3.push(element)
                            })

                            this.new_additional_status = false
                            this.post_attached_additional = []
                            this.view_attached_additional = []
                            this.loading_additional_attachment = false
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    } else {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                }   else{
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
            }
        },

        async getTrackStatus(item) {
            this.track_status_loading = true
            let { receipt_ticket_no } = item

            let response = await this.$services.getEclaimsWebService({
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: "GUCMM",
                data: {
                    receipt_ticket_no: receipt_ticket_no
                }
            })

            if(response.status === 200){
                response.data = this.responseDataDecryption(response.data)

                if(response.data.success){
                    this.track_status_dialog = true
                    this.track_status_holder = response.data
                    this.getClaimsTrailStatus(item)
                } else {
                    this.track_status_holder = {}
                    this.voucher_details = {}

                    this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Something went wrong.', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
            } else {
                this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Something went wrong.', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }

        },

        async getClaimsTrailStatus(item) {
            let response = await this.$services.getClaimsTrailStatus({
                provider_code: this.$store.state.prv_data.provider_code,
                series_lhio: item.series_lhio,
                claim_no: item.claim_no
            })

            if(response.status === 200){
                this.track_status_loading = false
                response.data = this.responseDataDecryption(response.data)

                if(response.data.success){
                    this.track_status_holder =  { 
                        transaction_number: item.transaction_number,
                        eclaims_status: item.eclaims_status,
                        ...this.track_status_holder,
                        ...response.data.CLAIMS[0]
                    }

                    this.cert_data.section3 = response.data.CLAIMS[0].STATUS?.ATTACHMENT

                    if(this.cert_data.section3.length !== 0){
                        this.cert_data.section3.forEach(element => {
                            let no_of_file = element.file_name.split('_')[0]
                            let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
                            let sum = no_of_file.length + 8 + provider.length + this.track_status_holder.transaction_number.length + 4

                            element.name = element.file_name.substring(sum)
                            element.loader = false
                        })
                    }
                    
                    if(response.data.CLAIMS[0].STATUS.CLAIM.voucher_no) {
                        await this.getVoucherDetails(response.data.CLAIMS[0].STATUS.CLAIM.voucher_no)
                    } else{
                        this.voucher_details = {}
                    }
                } else {
                    this.track_status_holder = {}
                    this.voucher_details = {}
                }
            } else {
                this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Something went wrong.', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        },

        //GET VOUCHER DETAILS
        async getVoucherDetails(voucher_no) {
             let response = await this.$services.getEclaimsWebService({
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: "GVDM",
                data: {
                    voucherNo : voucher_no
                }
            })

            if(response.status === 200){
                response.data = this.responseDataDecryption(response.data)

                if(response.data.success){
                    this.voucher_details = response.data
                } else {
                    this.voucher_details = {}
                }
            } else{
                this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Something went wrong.', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        },

        async getPatientList(){
            //GET THE TYPE OF SUBMITTED BY USER TYPE (2-3) CREDIT AND COLLECTION
            let user_submitted_type = this.$store.state.usr_credentials.user_type === '2-3' ? 2 : 0

            let response = await this.$services.getEclaimsEligibleList({
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                submitted: user_submitted_type
            });

            if (response.status === 200){
                if(response.data === 'Data not found. '){
                    this.pl_items = []
                } else{
                    this.pl_items = this.responseDataDecryption(response.data)
                }
                
                this.tbl_loading = false
            } else{
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        },
        
        // GET PBEF DATA
        async getPbefData(item){
            
            let pbef_params = {
                // phic_tracking_number: item.phic_tracking_number,
                // transaction_number: item.transaction_number,
                ek_lgu_id: item.ek_lgu_id,
                // reference_no: item.pbef_reference_no,
                // accre_no: this.$store.state.prv_data.phic_acc_no
                accreno: this.$store.state.prv_data.eclaim_phic_acc_no, 
                referenceno: item.pbef_reference_no, 
            }
            
            sessionStorage.setItem('gdo3sGfd', this.$crypto.AES.encrypt(JSON.stringify(pbef_params), 'ldofdrkd'))
            this.$router.push('/pbef')
        },

        // CONFIRMATION FOR SUBMIT TO NURSE STATION
        confirmSubmitToNurse(item){
            let params_for_nurse = {
                request_key: 'transaction_main',
                created_by: this.$store.state.usr_credentials?.user_name,
                department: this.$store.state.usr_credentials?.department,
                transaction_number: item.transaction_number,
                phic_tracking_number: item.phic_tracking_number,
                hmo_host_code: item.hmo_host_code
            }

            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-help-circle', color: 'primary', title: 'This will be submitted to Nurse Station', body: 'Do you want to continue?', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'submitToNurse', btn_pry_params: params_for_nurse, btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
        },
        
        // SUBMIT TO NURSE STATION
        async submitToNurse(data){
            let response = await this.$services.trnUpdFormStatus({
                ad_forms_progress_status: 'Forwarded to Nurse Station',
                nrs_forms_progress_status: 'Pending',
                ...(data)
            });

            if (response.status === 200){
                if(response.data.success){
                    this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-check-circle', color: 'success', title: 'Forms has been successfully submitted to Nurse Station', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }else{
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
            } else{
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        },

        // E-CLAIM PROCESSING
        async eClaimProcessing(item){
            sessionStorage.clear();

            let is_signed = [parseInt(item.patient_signature), parseInt(item.hospital_signature), parseInt(item.doctor_signature)]
            sessionStorage.setItem('POI43', this.$crypto.AES.encrypt(JSON.stringify(is_signed), 'FpXqep4t'))
       
            // let forms_progress_status = this.$store.state.usr_credentials.department === 'Nurse Station' ? item.nrs_forms_progress_status :  item.crd_forms_progress_status
            let forms_progress_status = ''
            let trans_detail = {
                //editable: forms_progress_status === 'Pending' || forms_progress_status === 'On Process' ? true : false,
                editable: true,
                phic_tracking_number: item.phic_tracking_number,
                transaction_number: item.transaction_number,
                gender: item.gender,
                mem_priority_care: item.mem_priority_care,
                transaction_type: item.transaction_type,
                eligibility_request_id: item.eligibility_request_id,
                phic_member_eligibility_status: item.phic_member_eligibility_status,
                hmo_policy_number: item.hmo_policy_number,
                ek_lgu_id: item.ek_lgu_id,
                hmo_host_code: item.hmo_host_code,
                lgu_host_code: item.lgu_host_code,
                phic_host_code: item.phic_host_code,
                host_claim_type: item.host_claim_type,
                host_doctor: item.host_doctor,
                migrated_to_eclaim_table: item.migrated_to_eclaim_table,
                claim_no: item.claim_no,
                pbef_reference_no: item.pbef_reference_no,
                phic_packages:item.phic_packages,
                ...(this.$store.state.usr_credentials?.department === 'Credit and Collection' ? { crd_claims_status: item.crd_claims_status } : undefined),
                doctor_sign_path: item.doctor_sign_path ? item.doctor_sign_path : '',
                patient_sign_path: item.patient_sign_path ?  item.patient_sign_path : '',
                hci_sign_path: item.hci_sign_path ? item.hci_sign_path : '',
                doctor_signature: item.doctor_signature,
                hospital_signature: item.hospital_signature,
                patient_signature: item.patient_signature,
                eclaims_status: item.eclaims_status,
                eclaim_type: item.eclaim_type,
                receipt_ticket_no: item.receipt_ticket_no
            }
            
            sessionStorage.setItem('QesRTe3j4fs3', this.$crypto.AES.encrypt(JSON.stringify(trans_detail), 'jri6F9dO'))

            if(forms_progress_status === 'Pending'){
                this.loading_eclaim = true

                let response = await this.$services.trnUpdFormStatus({
                        request_key: 'transaction_main',
                        created_by: this.$store.state.usr_credentials?.user_name,
                        department: this.$store.state.usr_credentials?.department,
                        transaction_number: item.transaction_number,
                        phic_tracking_number: item.phic_tracking_number,
                        hmo_host_code: item.hmo_host_code,
                        ...(this.$store.state.usr_credentials?.department === 'Nurse Station' ? { nrs_forms_progress_status: 'On Process' } : { crd_forms_progress_status: 'On Process' })
                    });

                if (response.status === 200){
                    if(response.data.success){
                        this.$router.push('/input-forms/patient-data')
                    }else{
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                } else{
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
                
            }else{
                this.$router.push('/input-forms/patient-data')
            }

            this.$store.commit('set_loading_category', true)
        },
        
        // CLEAR FILTER
        clearFilter(){
            this.search_tbl = ''
            this.start_date = null
            this.end_date = null
            this.patient_type = 'ALL'
            this.claim_status = 'ALL'
        }
    },

    destroyed(){
        clearTimeout(this.get_patient_list_timeout)
        //this.cancel_axios.cancel()
    }
}
</script>

