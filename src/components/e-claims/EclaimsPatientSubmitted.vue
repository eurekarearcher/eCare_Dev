<template>
    <div class="px-sm-9 px-4 pb-2">
        <Navbar :navbar="navbar" />
        <v-row class="mt-7 mb-2" justify="space-between" wrap>
            <h2  class="font-weight-medium align-self-end order-1 order-sm-0">Philhealth Claim List</h2>
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
                    <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pr-sm-2">
                        <v-select v-model="claim_status" :items="claims_status" :disabled="$store.state.usr_credentials.department !== 'Credit and Collection'" label="Claim Status" height="10" outlined dense></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                        <v-select v-model="patient_type" :items="patients_type" label="Patient Type" height="10" outlined dense></v-select>
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
                        <v-btn :disabled="item.phic_member_eligibility_status !== 'Eligible'" @click="getPbefData(item)" small tile><v-icon small>mdi-file-document-outline</v-icon>PBEF</v-btn>
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
                    <!-- <td>{{ item.eclaims_status }}<br>{{ item.doctor_signature == 0 || item.hospital_signature == 0 || item.patient_signature == 0 ? 'Signature Required' : '' }}</td> -->
                    <td class="py-1">
                        <div class="d-flex justify-center align-center"> 
                            <v-btn @click="eClaimProcessing(item)" class="mr-2" small tile><v-icon small>mdi-format-list-bulleted</v-icon>E-CLAIM</v-btn>
                            <v-btn :disabled="item.phic_member_eligibility_status !== 'Eligible'" @click="getPbefData(item)" small tile class="mr-2"><v-icon small>mdi-file-document-outline</v-icon>PBEF</v-btn>
                            <v-btn @click="getTrackStatus(item)" small tile><v-icon small>mdi-file-document-outline</v-icon>Track Status</v-btn>
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
                <tr v-if="item.crd_forms_progress_status === null" :class="[(item.crd_forms_progress_status === 'Pending' ? 'red--text' : ''), (item.crd_forms_progress_status === 'On Process' ? 'orange--text text--darken-3' : '')]">
                    <td>{{ formatDateAndTime(item.tstamp) }}</td>
                    <td>{{ item.patient_name }}</td>
                    <td>{{ item.phic_tracking_number }}</td>
                    <td>{{ item.transaction_type }}</td>
                    <td>{{ item.phic_member_eligibility_status ? item.phic_member_eligibility_status : 'N/A' }}</td>
                    <!-- <td>{{ item.hmo_healthcare_status }}</td> -->
                    <td>{{ item.phic_case_number }}</td>
                    <td>{{ item.crd_forms_progress_status }}<br>{{ item.doctor_signature == 0 || item.hospital_signature == 0 || item.patient_signature == 0 ? 'Signature Required' : '' }}</td>
                    <td>TEST</td>
                    <td class="py-1">
                        <v-btn @click="eClaimProcessing(item)" class="mr-2" small tile><v-icon small>mdi-format-list-bulleted</v-icon>E-CLAIM</v-btn>
                        <v-btn :disabled="item.phic_member_eligibility_status !== 'Eligible'" @click="getPbefData(item)" small tile><v-icon small>mdi-file-document-outline</v-icon>PBEF</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>

        <v-dialog v-if="track_status_dialog" v-model="track_status_dialog" width="950" persistent>
            <v-card class="pa-1">

                <v-card-title class="d-flex justify-center"> ECLAIMS TRACK STATUS </v-card-title>
                <v-card-subtitle class="d-flex justify-space-between mt-2">
                    <h4 class="body-2"> Claim Series: {{ track_status_holder.STATUS.CLAIM.pClaimSeriesLhio }} </h4>
                    <h4 class="body-2"> As of {{ track_status_holder.STATUS.pAsOf + '/' + track_status_holder.STATUS.pAsOfTime }} </h4>
                </v-card-subtitle>
                <v-sheet class="pa-4"> 
                    <v-row >
                        <v-col cols="12" sm="12" md="6" lg="6">
                            <v-text-field :value="track_status_holder.STATUS.CLAIM.pPatientFirstName + ' ' + track_status_holder.STATUS.CLAIM.pPatientMiddleName + ' ' + track_status_holder.STATUS.CLAIM.pPatientLastName" label="Member Name" readonly hide-details outlined dense> </v-text-field>    
                        </v-col>
                        <v-col cols="12" sm="12" md="6" lg="6"> 
                            <v-text-field v-model="track_status_holder.STATUS.CLAIM.pPin" label="PHIC Pin" readonly hide-details outlined dense> </v-text-field>
                        </v-col>   
                        <v-col cols="12" sm="12" md="6" lg="6">
                            <v-text-field v-model="track_status_holder.STATUS.CLAIM.pAdmissionDate" label="Admission Date" readonly hide-details outlined dense> </v-text-field>    
                        </v-col>
                        <v-col cols="12" sm="12" md="6" lg="6"> 
                            <v-text-field v-model="track_status_holder.STATUS.CLAIM.pDischargeDate" label="Discharged Date" readonly hide-details outlined dense> </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="6" lg="6">
                            <v-text-field v-model="track_status_holder.STATUS.CLAIM.pClaimDateReceived" label="Claim Date Received" readonly hide-details outlined dense> </v-text-field>    
                        </v-col>
                        <v-col cols="12" sm="12" md="6" lg="6"> 
                            <v-text-field v-model="track_status_holder.STATUS.CLAIM.pClaimDateRefile" label="Claim Date Refile" readonly hide-details outlined dense> </v-text-field>
                        </v-col>
                    </v-row>
                    <v-divider class="my-4"> </v-divider>
                    <v-card width="500" class="elevation-0 mx-auto"> 
                        <v-timeline reverse align-top>
                            <v-timeline-item v-for="(process, key) in track_status_holder.STATUS.CLAIM.TRAIL.PROCESS" :key="key" small :color="process.color">
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
                     <v-divider class="my-4"> </v-divider>

                     <!-- FILE ATTACHMENT FOR ADDITIONAL ATTACHMENTS -->
                    <label>Attach additional documents (SOA , MDR etc.):</label>
                    <v-row justify="center" class="mt-4 pb-2" wrap>
                        <v-col cols="12" sm="6" md="6" lg="8" class="pr-1">
                            <label for="attached-certification" class="primary white--text pa-2 rounded text-body-2 cursor-pointer">Choose File</label> 
                            <span class="ml-1" v-if="cert_data.section3.length === 0">No file chosen</span>
                            <span class="ml-1" v-else>{{ cert_data.section3.length }} files</span>
                            <input :disabled="new_additional_status === 'Processing'" @change="addAttachedAdditional" id="attached-certification" class="mt-4 d-none" type="file" ref="additional" accept=".pdf" multiple><br>
                            <!-- <input @change="addAttachedAdditional" id="attached-certification" class="mt-4 d-none" type="file" ref="additional" accept=".pdf" multiple><br> -->
                            <v-divider class="mt-3"></v-divider>

                            <div v-for="(attached, i) in cert_data.section3" :key="i" class="text-left">
                                <h5 class="font-weight-medium grey lighten-3 text-left pl-2 py-1 mt-2">
                                    <v-icon color="success" size="20">mdi-check</v-icon>
                                    {{ attached.name }} 
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

                             <v-divider> </v-divider>

                            <div class="text-center">
                                <v-btn :disabled="file_size_exceeds" :loading="loading_additional_attachment" @click="postFileOfAdditional" class="mt-4" small tile>UPLOAD FILE</v-btn>

                                <span class="d-block mt-3">Maximum upload size: 30 MB.</span>
                            </div>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" lg="1"></v-col>
                    </v-row>
                </v-sheet>
                <v-card-actions class="d-flex justify-end"> 
                    <v-btn @click="track_status_dialog = false, track_status_holder = {}, cert_data= { section3: [] } "> Close </v-btn>
                </v-card-actions>
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

export default {
    components: {
        Navbar,
        Alert
    },
    
    data(){
        return{
            // FILTER
            search_tbl: '',
            start_date: null,
            end_date: null,
            patient_type: 'ALL',
            claim_status: 'ALL',
            patients_type: ['ALL', 'OUTPATIENT', 'INPATIENT', 'EMERGENCY'],
            claims_status: ['ALL', 'Pending', 'On Process', 'Submitted to Audit Sector', 'Screening Rejected', 'Submitted to PHIC', 'Returned by PHIC', 'Approved by PHIC'],

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
                // { text: 'Form Status', value: 'eclaims_status', width: '150px', sortable: false },
                { text: 'Actions', value: '', width: '215px', sortable: false }
            ],
            pl_headers_credit: [
                { text: 'Date', value: 'tstamp', width: '130px' },
                { text: 'Patient Name', value: 'patient_name', width: '200px', sortable: false },
                { text: 'Tracking Number', value: 'phic_tracking_number', width: '130px', sortable: false },
                { text: 'Patient Type', value: 'transaction_type', width: '130px', sortable: false },
                { text: 'PHIC Eligibility Status', value: 'phic_member_eligibility_status', width: '190px', sortable: false },
                // { text: 'HMO Eligibility Status', value: 'hmo_healthcare_status', width: '190px', sortable: false },
                { text: 'Case Number', value: 'phic_case_number', width: '130px', sortable: false },
                { text: 'Form Status', value: 'crd_forms_progress_status', width: '210px', sortable: false },
                { text: 'Claim Status', value: 'claims_status', width: '210px', sortable: false },
                { text: 'Actions', value: '', width: '215px', sortable: false }
            ],
            pl_items: [],

            // OTHERS
            date_today: this.$moment().format('YYYY-MM-DD'),
            loading_eclaim: false,
            navbar: [],
            alert: {},
            track_status_dialog: false,
            track_status_holder: {},

            // DATA
            cert_data: {
                section3: []
            },

            // ATTACHMENTS
            new_additional_status: true,
            view_attached_additional: [],
            post_attached_additional: [],
            view_file_additional: false,
            loading_additional_attachment: false,
            file_size_exceeds: false,
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

    //   if(this.$store.state.usr_credentials.department === 'Admission' && this.$store.state.prv_data.hmo === 1 && this.$store.state.prv_data.lgu === 1){
    //     this.navbar = [
    //         {title: 'Tele Consult Patient List', link: '/teleconsult-queue-list', icon: 'fas fa-clipboard-list'}, 
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
                let searched_data = (i.patient_name.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || (i.phic_tracking_number.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || (i.transaction_type.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || (i.phic_member_eligibility_status.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || (i.hmo_healthcare_status.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1)
                let timestamp = i.tstamp ? i.tstamp.substring(0, 10) : null;
                
                let search = this.search_tbl ? searched_data : true
                let date = this.start_date && this.end_date ? timestamp >= this.start_date && timestamp <= this.end_date : true
                let claim_status = this.claim_status === 'ALL' ? true : i.crd_claims_status === this.claim_status
                let transaction_type = this.patient_type === 'ALL' ? true : i.transaction_type === this.patient_type

                return search && date && claim_status && transaction_type
            })
        }
    },

    methods: {
        getTrackStatus(item) {
            this.track_status_dialog = true
            this.track_status_holder = item
        },

        postFileOfAdditional(){
            if(this.post_attached_additional.length === 0){
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-close-circle', color: 'red', title: 'No file chosen. Please attach file', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }else{
                this.loading_additional_attachment = true
                this.new_additional_status = 'Processing'

                let formData = new FormData();
                let total_count = this.post_attached_additional.length
                for( var i = 0; i < this.post_attached_additional.length; i++ ){
                    let file = this.post_attached_additional[i];
                    formData.append('file'+ i +'', file);
                }

                formData.append('post_data', this.wsDataEncryption(JSON.stringify({
                    request_key: "additional_attachment",
                    transaction_number: this.track_status_holder.transaction_number,
                    created_by: this.$store.state.usr_credentials.user_name,
                    provider_code: this.$store.state.prv_data.provider_code,
                    attachment_category: 'ADDITIONAL ATTACHMENT',
                    total_count: total_count
                })))

                this.$axios.post(this.$cms_url+'resources/controller/trn_add_eclaims_attached_files.php', 
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )
                .then(response => {
                    if(response.status === 200){
                        if(response.data.success){         
                            this.responseDataDecryption(response.data.file_path).forEach(element => {
                                let no_of_file = element.file_name.split('_')[0]
                                let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
                                let sum = no_of_file.length + 8 + provider.length + this.track_status_holder.transaction_number.length + 4

                                element.name = element.file_name.substring(sum)
                                element.loader = false
        
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
                })
                .catch(error => {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                })
            }
        },

        // ADD ATTACHED FILE FOR ADDITIONAL
        addAttachedAdditional(){
            let attached_files = []
            let re_attached_files = []
            this.new_additional_status = true

            this.cert_data.section3.forEach(element => {
                attached_files.push(element.name)
            })

            this.view_attached_additional.forEach(element => {
                attached_files.push(element.name)
            })

            Object.values(this.$refs.additional.files).forEach(element => {
                if(attached_files.includes(element.name)){
                    re_attached_files.push('<br>'+element.name)
                }else{    
                    this.post_attached_additional.push(element)
                    this.view_attached_additional.push({
                        name: element.name,
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
        removeAttachedAdditional(index){
            this.post_attached_additional.splice(index - this.post_attached_additional.length, 1)
            this.view_attached_additional.splice(index - this.view_attached_additional.length, 1)

            document.getElementById("attached-certification").value = "";
        },

        getPatientList(){
            this.cancel_axios = this.$axios.CancelToken.source()
            this.$axios.post(this.$tms_url+'resources/api/_get_eclaims_eligible_list.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                    provider_code: this.$store.state.prv_data.provider_code,
                    lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                    submitted: 2
                }))
            }), {
                cancelToken: this.cancel_axios.token
            })
            .then(response => {
                if(response.data === 'Data not found. '){
                    this.pl_items = []
                }else{
                    this.pl_items = this.responseDataDecryption(response.data)
                    this.pl_items = this.pl_items.map(data => {
                        return {
                            ...data,
                            "STATUS": {
                                "CLAIM": {
                                "TRAIL": {
                                    "PROCESS": [
                                    {
                                        "pProcessStage": "VALIDATION",
                                        "pProcessDate": "07-25-2012",
                                        "color": "yellow"
                                    },
                                    {
                                        "pProcessStage": "EDITING",
                                        "pProcessDate": "07-25-2012",
                                        "color": "blue"
                                    },
                                    {
                                        "pProcessStage": "DENIED",
                                        "pProcessDate": "07-23-2012",
                                        "color": "red"
                                    },
                                    {
                                        "pProcessStage": "EDITING (RECEIVING)",
                                        "pProcessDate": "07-23-2012",
                                        "color": "blue"
                                    },
                                    {
                                        "pProcessStage": "ENCODING",
                                        "pProcessDate": "07-23-2012",
                                        "color": "orange"
                                    },
                                    {
                                        "pProcessStage": "RECEIVING",
                                        "pProcessDate": "07-23-2012",
                                        "color": "green"
                                    }
                                    ]
                                },
                                "pClaimSeriesLhio": "120723190000119",
                                "pPin": "190892937993",
                                "pPatientLastName": "LASTNAME",
                                "pPatientFirstName": "FIRSTNAME",
                                "pPatientMiddleName": "MIDDLENAME",
                                "pPatientSuffix": "",
                                "pAdmissionDate": "05-02-2012",
                                "pDischargeDate": "05-06-2012",
                                "pClaimDateReceived": "05-15-2012",
                                "pClaimDateRefile": "",
                                "pStatus": "IN PROCESS"
                                },
                                "pAsOf": "07-25-2012",
                                "pAsOfTime": "04:46:23PM"
                            }
                        }
                    })
                }
                
                this.tbl_loading = false
                // this.get_patient_list_timeout = setTimeout(() => {
                //     this.getPatientList();
                // }, 3000)
            })
            .catch(error => {
               this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },
        
        // GET PBEF DATA
        getPbefData(item){
            let pbef_params = {
                phic_tracking_number: item.phic_tracking_number,
                transaction_number: item.transaction_number,
                ek_lgu_id: item.ek_lgu_id
            }
            
            sessionStorage.setItem('gdo3sGfd', this.$crypto.AES.encrypt(JSON.stringify(pbef_params), 'ldofdrkd'))
            this.$router.push('/pbef')
        },

        // CONFIRMATION FOR SUBMIT TO NURSE STATION
        confirmSubmitToNurse(item){
            let params_for_nurse = {
                request_key: 'transaction_main',
                created_by: this.$store.state.usr_credentials.user_name,
                department: this.$store.state.usr_credentials.department,
                transaction_number: item.transaction_number,
                phic_tracking_number: item.phic_tracking_number,
                hmo_host_code: item.hmo_host_code
            }

            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-help-circle', color: 'primary', title: 'This will be submitted to Nurse Station', body: 'Do you want to continue?', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'submitToNurse', btn_pry_params: params_for_nurse, btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
        },
        
        // SUBMIT TO NURSE STATION
        submitToNurse(data){
            this.$axios.post(this.$tms_url+'resources/controller/trn_upd_form_status.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                    ad_forms_progress_status: 'Forwarded to Nurse Station',
                    nrs_forms_progress_status: 'Pending',
                    ...(data)
                }))
            }))
            .then(response => {
                if(response.data.success){
                    this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-check-circle', color: 'success', title: 'Forms has been successfully submitted to Nurse Station', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }else{
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
            })
            .catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },

        // E-CLAIM PROCESSING
        eClaimProcessing(item){
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
                phic_packages:item.phic_packages,
                ...(this.$store.state.usr_credentials.department === 'Credit and Collection' ? { crd_claims_status: item.crd_claims_status } : undefined)
            }
            
            sessionStorage.setItem('QesRTe3j4fs3', this.$crypto.AES.encrypt(JSON.stringify(trans_detail), 'jri6F9dO'))

            if(forms_progress_status === 'Pending'){
                this.loading_eclaim = true
                this.$axios.post(this.$tms_url+'resources/controller/trn_upd_form_status.php', this.$qs.stringify({
                    post_data: this.wsDataEncryption(JSON.stringify({
                        request_key: 'transaction_main',
                        created_by: this.$store.state.usr_credentials.user_name,
                        department: this.$store.state.usr_credentials.department,
                        transaction_number: item.transaction_number,
                        phic_tracking_number: item.phic_tracking_number,
                        hmo_host_code: item.hmo_host_code,
                        ...(this.$store.state.usr_credentials.department === 'Nurse Station' ? { nrs_forms_progress_status: 'On Process' } : { crd_forms_progress_status: 'On Process' })
                    }))
                }))
                .then(response => {
                    if(response.data.success){
                        this.$router.push('/input-forms/patient-data')
                    }else{
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                })
                .catch(error => {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                })
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
        this.cancel_axios.cancel()
    }
}
</script>