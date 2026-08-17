<template>
    <v-container class="pa-0">
        <section class="mx-auto">
            <v-card class="py-5 mx-auto" flat>
                <h1 class="font-weight-medium grey--text text--darken-3 mb-4">{{ $route.path === '/admin/unrestrict' ? 'Yakap XML Record Extraction' : 'Yakap Submission' }}</h1>
                <v-form ref="report_data">
                    <v-row class="flex-wrap pt-5" dense no-gutters>
                        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                            <v-row justify="space-between" class="flex-wrap" dense no-gutters>
                                <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="text-center pr-5">
                                    <label>Start Date <span class="red--text"> *</span></label>
                                    <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                        <template v-slot:activator="{ on }">
                                            <v-text-field 
                                                v-on="on"
                                                v-model="start_date" 
                                                v-mask="date_mask"
                                                :rules="empty_validation"
                                                :disabled="disable_date" 
                                                class="body-2" 
                                                placeholder="MM-DD-YYYY"
                                                >
                                            </v-text-field>
                                        </template>
                                        <v-date-picker v-model="start_date_picker" @change="start_date = formatDate(start_date_picker)"  no-title></v-date-picker>
                                    </v-menu>
                                </v-col>

                                <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="text-center pr-5">
                                    <label>End Date <span class="red--text"> *</span></label>
                                        <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                            <template v-slot:activator="{ on }">
                                                <v-text-field 
                                                v-on="on"
                                                v-model="end_date" 
                                                v-mask="date_mask"
                                                :rules="empty_validation"
                                                :disabled="disable_date" 
                                                class="body-2" 
                                                placeholder="MM-DD-YYYY"
                                                >
                                                </v-text-field>
                                            </template>

                                            <v-date-picker v-model="end_date_picker" @change="end_date = formatDate(end_date_picker)" no-title></v-date-picker>
                                        </v-menu>
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="4" xl="4" class="mt-1">
                            <v-layout wrap justify-center>
                                <div class="text-center">
                                    <label>Tranche # <span class="red--text"> *</span></label>
                                    <v-radio-group v-model="tranche_value" :disabled="disable_tranche" :rules="empty_validation" row >
                                        <v-radio label="1st Tranche" value="1"></v-radio>
                                        <v-radio label="2nd Tranche" value="2"></v-radio>
                                    </v-radio-group>
                                </div>
                            </v-layout>
                        </v-col>

                        <v-col cols="12" sm="2" md="2" lg="2" xl="2" align-self="center" class="pl-3">
                            <v-btn @click="searchRecord" :loading="loading_search_btn" color="primary" type="button" block>Search <v-icon right>mdi-magnify</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>

            <v-card-actions class="pa-0">
                <v-row dense no-gutters> 
                    <v-col cols="12" sm="12" md="4" lg="6">
                        <v-text-field v-model="search_record" label="Search Record" :loading="loading_search" class="mr-4" append-icon="mdi-magnify" clearable outlined dense hide-details> </v-text-field>  
                    </v-col>
                    <v-col cols="12" sm="12" md="8" lg="6" class="d-flex justify-end pa-0 mb-1"> 
                        <div class="mb-5">
                            <v-btn v-if="$route.path === '/admin/unrestrict'" @click="openTermsDialog" :disabled="patient_data.length === 0 || selected_patient.length === 0" class="primary mx-1" type="button">Proceed to Submission</v-btn>
                            <v-btn v-else @click="validateRecordPerData" :disabled="disable_validate_btn || patient_data.length === 0 || select_patient.length === 0" :loading="loading_validate_btn" class="primary mx-1" type="button" > {{ ekonsulta_tab === 1 ? 'Validate' : 'Submit'}} Report</v-btn>
                            <!-- <v-btn @click="validateTransaction" :disabled="disable_validate_btn || patient_data.length === 0" :loading="loading_validate_btn" class="primary mx-1" type="button" >Validate Report</v-btn> -->
                            <!-- <v-btn @click="submitTransaction" :disabled="disable_submit_btn" :loading="loading_submit_btn" class="primary mx-1" type="button" >Submit Report</v-btn> -->
                        </div>
                    </v-col>
                </v-row>
            </v-card-actions>
            <div class="d-flex align-center w-100">
                <v-tabs v-if="$route.path === '/admin/ekonsulta-submission'" v-model="ekonsulta_tab">
                    <v-tab>Pending</v-tab>
                    <v-tab>Validation</v-tab>
                    <v-tab>Submission</v-tab>
                </v-tabs>

                <div class="d-flex align-center px-1 ml-auto">
                    <label class="font-weight-normal mx-1 grey--text text--darken-2">EXPORT:</label>
                    <v-btn @click="convertToExcel" :loading="excel_loader" color="success">Excel<v-icon right>mdi-microsoft-excel</v-icon></v-btn>
                </div>
            </div>
           
                <UnrestrictSubmission
                    v-if="$store.state.prv_config.access_ekonsulta_bypass === '1' && $route.path === '/admin/unrestrict'"
                    :patient_data="patient_data"
                    :tranche_value="tranche_value"
                    :search_record="search_record"
                    :loading_search_btn="loading_search_btn"
                    :total_consultation_count="total_consultation_count"
                    :selected_patient.sync="selected_patient"
                    :headers="headers"
                    :sort_by="sort_by"
                    :sort_desc="sort_desc"
                    :items_per_page="items_per_page"
                    :footer_props="footer_props"
                    :show_terms_dialog.sync="show_terms_dialog"
                    :terms_accepted.sync="terms_accepted"
                    :loading_validate_btn="loading_validate_btn"
                    :excel_loader="excel_loader"
                    :submit_report_loader="submit_report_loader"

                    @convertToExcel="convertToExcel"
                    @submitTransaction="submitTransaction"
                    @selectAllItems="selectAllItems"
                    @searchRecord="searchRecord"
                    @downloadXMLbyPass="downloadXMLbyPass"
                /> 
                
                <EkonsultaSubmission 
                    v-else
                    :patient_data="patient_data"
                    :tranche_value="tranche_value"
                    :search_record="search_record"
                    :loading_search_btn="loading_search_btn"
                    :total_consultation_count="total_consultation_count"
                    :selected_patient.sync="selected_patient"
                    :headers="headers"
                    :headers_pending="headers_pending"
                    :sort_by="sort_by"
                    :sort_desc="sort_desc"
                    :items_per_page="items_per_page"
                    :footer_props="footer_props"
                    :loading_validate_btn="loading_validate_btn"
                    :excel_loader="excel_loader"
                    :ekonsulta_tab="ekonsulta_tab"
                    :display_validated.sync="display_validated"
                    :proceed_validate_loader="proceed_validate_loader"
                    :pHciCaseNo="pHciCaseNo"
                    :pHciTransNo="pHciTransNo"
                    :patient_validated_data="patient_validated_data"
                    :transmittal_id="transmittal_id"
                    :submission_loading="submission_loading"
                    :upload_list="upload_list"
                    :upload_delete="upload_delete"
                    :upload_error="upload_error"
                    :upload_success="upload_success"
                    :upload_loading="upload_loading"
                    :submit_report_loader="submit_report_loader"
                    :success_count="success_count"
                    :failed_count="failed_count"

                    @convertToExcel="convertToExcel"
                    @selectAllItems="selectAllItems"
                    @downloadValidationReport="downloadValidationReport"
                    @searchRecord="searchRecord"
                    @validateRecordPerData="validateRecordPerData"
                    @downloadKonsultaReceipt="downloadKonsultaReceipt"
                    @backToHomepage="backToHomepage"
                />

            <!-- <v-overlay v-if="submission_loading" :value="loading_search" z-index="9999"> 
                <v-progress-circular indeterminate size="35"></v-progress-circular>
                <span  class="ml-3 text-h6 font-weight-regular" >Loading... Please Wait...</span>
            </v-overlay>

            <v-overlay v-if="submission_loading" :value="loading_validate_btn" z-index="9999"> 
                <v-progress-circular indeterminate size="35"></v-progress-circular>
                <span  class="ml-3 text-h6 font-weight-regular" >Loading... Please Wait...</span>
            </v-overlay>

            <v-overlay v-if="ekonsulta_download_loader" z-index="9999"> 
                <v-progress-circular indeterminate size="35"></v-progress-circular>
                <span  class="ml-3 text-h6 font-weight-regular" >Downloading... Please Wait...</span>
            </v-overlay> -->

            <v-overlay :value="submission_loading || ekonsulta_download_loader" z-index="9999">
                <v-progress-circular indeterminate size="35" />
                <span class="ml-3 text-h6 font-weight-regular">
                    {{ ekonsulta_download_loader ? 'Downloading... Please Wait...' : 'Loading... Please Wait...'}}
                </span>
            </v-overlay>
            <Alert :alert="alert" />
            <TransactionDialog :alert="alert_data" :submit_report_loader="submit_report_loader"  @downloadKonsultaReceipt="downloadKonsultaReceipt" @backToHomepage="backToHomepage" @submitReport="submitTransaction" @closeReport="searchRecord"/>
            <EkonsultaReceipt ref="receipt" class="offscreen-receipt" :konsulta_submitted_response="konsulta_submitted_response"/>
        
            <v-dialog v-model="submission_failed_err" width="550" persistent>
                <v-card width="550">
                    <v-sheet class="pa-4">
                    <div class="d-flex justify-center align-center my-2 mb-4">
                        <h3 class="font-weight-bold">
                            <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
                            Submission Failed
                        </h3>
                    </div>

                    <div class="d-flex justify-start align-center">
                        <h2 class="body-2 grey--text text--darken-3">
                            To proceed with the submission, please remove the following names:
                            <div class="mt-3">
                                <div v-for="(xml_errors, key) in encrypted_xml_errors" :key="key" class="my-1">
                                   {{ key + 1 }}. {{ xml_errors }}
                                </div>
                            </div>
                           
                            <p class="my-3"> 
                                {{ validation_err_message }}
                            </p>
                        </h2> 
                    </div>

                    <v-card-actions class="d-flex justify-end align-center mt-2">
                        <v-btn @click="submission_failed_err = false, encrypted_xml_errors = []"> Close </v-btn>
                    </v-card-actions>
                    </v-sheet>
                </v-card>
            </v-dialog>
        </section>
    </v-container>
</template>

<script>
import { mask } from "vue-the-mask"
import UnrestrictSubmission from '@/components/admin/ekonsulta/ekonsulta-unrestrict-submission/UnrestrictSubmission'
import EkonsultaSubmission from '@/components/admin/ekonsulta/ekonsulta-unrestrict-submission/EkonsultaSubmission'
import TransactionDialog from '@/components/admin/ekonsulta/TransactionDialog'
import Alert from '@/components/Alert'
import EkonsultaReceipt from '@/components/admin/ekonsulta/EkonsultaReceipt'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import "jspdf-autotable"
import excel_file from 'write-excel-file'

export default {
    directives: { mask },
    components: {
        TransactionDialog, 
        Alert, 
        EkonsultaReceipt,
        UnrestrictSubmission,
        EkonsultaSubmission
    },

    data() {
        return {
            tranche_value: '',
            start_date: '',
            start_date_picker: '',
            end_date: '',
            end_date_picker: '',
            date_mask: '##-##-####',
            
            disable_validate_btn: true,
            loading_validate_btn: false,
            loading_search: false,
            loading_submit_btn: false,
            disable_submit_btn: true,
            disable_tranche: false,
            disable_date: false,
            loading_search_btn: false,

            alert_data: {},
            alert: {},

            // FORM VALIDATION
            empty_validation: [
                v => !!v && !/^ *$/.test(v) || 'Required Field',
            ],

            sort_by: 'pTransDate',
            sort_desc: true,

            patient_data: [],
            selected_patient: [],
            selected: [],
            pHciCaseNo: [],
            pHciTransNo: [],

            upload_loading: false,
            upload_success: false,
            upload_error: false,
            upload_delete: false,
            upload_list: '',

            patient_validated_data: [],

            display_validated: false,
            proceed_validate_loader: false,

            submit_report_loader: false,
            search_record: '',

            success_count: 0,
            failed_count: 0,
            transmittal_id: '',
            ekonsulta_tab: null,
            submission_loading: false,

            items_per_page: 10,

            footer_props: {
                'items-per-page-options': [5, 10, 25,50, 100, 200, { text: 'All', value: -1 }]
            },

            konsulta_submitted_response: null,
            ekonsulta_download_loader:false,
            excel_loader: false,

            show_terms_dialog: false,
            terms_accepted: false,

            submission_failed_err: false,
            encrypted_xml_errors: [],

            validation_err_message: 'Note: These names cannot be submitted because they are already assigned to another facility. Please note that PhilHealth allows members to be transferred to another facility without notifying the currently assigned facility. Additionally, if a patient record is not accepted due to its effectivity year, the submission deadline for records with that effectivity year has already passed.'
        }
    },

    computed: {
        select_patient() {
            return this.selected_patient.map(data => {
                return data.pHciCaseNo
            })
        },

        enc_xml_file_name () {
            return this.tranche_value + this.$store.state.prv_data.ekonsulta_phic_acc_no + "_" + this.$moment().format('YYYYMMDD') + "_" + this.transmittal_id + ".xml"
        },

        dec_xml_file_name () {
            return this.tranche_value + this.$store.state.prv_data.ekonsulta_phic_acc_no + "_" + this.$moment().format('YYYYMMDD') + "_" + this.transmittal_id
        },

        total_consultation_count() {
            return this.patient_data.reduce((total, item) => {
                return total + (Number(item.count) || 0)
            }, 0)
        },

        headers() {
            return [
                { text: 'Name', value: 'pPatientFullname', width: '250px', sortable: false, align: 'center' },
                { text: 'Patient Type', value: 'pPatientType', sortable: false, align: 'center' },
                { text: 'Patient Pin', value: 'pPatientPin', sortable: false, align: 'center' },
                { text: 'Member Pin', value: 'pMemPin', sortable: false, align: 'center' },
                { text: 'Date of Birth', value: 'pPatientDob', width: '120px', sortable: false, align: 'center' },
                { text: 'Gender', value: 'pPatientSex', sortable: false, align: 'center' },
                { text: 'Transaction Creation Date', value: 'date_created', width: '120px', sortable: false, align: 'center' },
                { text: 'Date Admitted', value: 'pTransDate', width: '120px', sortable: false, align: 'center' },
                { text: this.tranche_value === '1' ? 'No. of FPE' : 'No. of Consultations', value: 'count', sortable: false, align: 'center'},
                { text: 'Status', value: 'validation_status', width: '150px', sortable: false, align: 'center' },
                { text: 'Remarks', value: 'pDeficiencyRemarks', width: '150px', sortable: false, align: 'center'}
            ]
        },

        headers_pending() {
            return [
                { text: 'Name', value: 'pPatientFullname', width: '250px', sortable: false, align: 'center' },
                { text: 'Patient Type', value: 'pPatientType', sortable: false, align: 'center' },
                { text: 'Patient Pin', value: 'pPatientPin', sortable: false, align: 'center' },
                { text: 'Member Pin', value: 'pMemPin', sortable: false, align: 'center' },
                { text: 'Date of Birth', value: 'pPatientDob', width: '120px', sortable: false, align: 'center' },
                { text: 'Gender', value: 'pPatientSex', sortable: false, align: 'center' },
                { text: 'Transaction Creation Date', value: 'date_created', width: '120px', sortable: false, align: 'center' },
                { text: 'Date Admitted', value: 'pTransDate', width: '120px', sortable: false, align: 'center' },
                { text: this.tranche_value === '1' ? 'No. of FPE' : 'No. of Consultations', width: '90px', value: 'count', sortable: false, align: 'center'},
                { text: 'Validation Status', value: 'validation_status', sortable: false, align: 'center' },
                { text: 'Remarks', value: 'pDeficiencyRemarks', width: '150px', sortable: false, align: 'center'}
            ]
        }
    },

    watch: {
        ekonsulta_tab(old_val) {
            if (old_val === null || (this.tranche_value=="" && this.start_date=="" && this.end_date=="")) return;
            this.searchRecord();
        }
    },

    methods: {
        selectAllItems(){
            this.items_per_page = -1
            this.selected_patient = this.patient_data
        },

        openTermsDialog() {
            this.show_terms_dialog = true
        },

        //VALIDATE RECORD FORE DATA
        async validateRecordPerData() {
            if (this.selected_patient.length <= 1000) {
                let validation_payload = {
                    request_key: 'db',
                    provider_code: this.$store.state.prv_data.provider_code,
                    phic_token: this.$store.state.prv_data.phic_token,
                    pHciAccreNo: this.$store.state.prv_data.ekonsulta_phic_acc_no,
                    report_tagging: this.tranche_value,
                    report_status: this.ekonsulta_tab === 1 ? 'first_validation' : 'batch_validation', //first_validation WILL VALIDATE PER RECORD | batch_validation MULTIPLE VALIDATION OF RECORD FOR SUBMISSION
                    start_date: this.start_date,
                    end_date: this.end_date
                }

                if(this.ekonsulta_tab === 1) {

                    this.display_validated = true
                    for (const element of this.selected_patient) {
                        try {
                            let response = await this.$services.getEkonsultaValidationReports({
                                ...validation_payload,
                                case_number: [element.pHciCaseNo],
                            })

                        //if (response.status === 200) {
                            response.data = this.responseDataDecryption(response.data)

                            this.patient_validated_data.push({
                                ...element,
                                success_cnt: response.data.success_cnt ? Number(response.data.success_cnt) : 0,
                                failed_cnt: response.data.failed_cnt ? Number(response.data.failed_cnt) : 0,
                                success: response.data.success,
                                no_of_consultation: Number(response.data.success_cnt) + Number(response.data.failed_cnt),
                                error: response.data.encryptedXmlerrors
                                    ? response.data.encryptedXmlerrors
                                    : undefined
                            })

                            this.success_count = this.patient_validated_data.reduce(
                                (sum, count) => sum + Number(count.success_cnt),
                                0
                            )
            
                            this.failed_count = this.patient_validated_data.reduce(
                                (sum, count) => sum + Number(count.failed_cnt),
                                0
                            )
                            
                        } catch(error) {
                            this.patient_validated_data.push({
                                ...element,
                                success_cnt: 0,
                                failed_cnt:  Number(element.count),
                                success: false,
                                no_of_consultation:  Number(element.count),
                                error: ["Unable to validate Yakap report due to PhilHealth server connection failure. Please Revalidate again."]
                            })

                            this.failed_count = this.patient_validated_data.reduce(
                                (sum, count) => sum + Number(count.failed_cnt),
                                0
                            )
                        }
                    }
                } else {
                    // VALIDATE TRANSACTION FOR TRANCHE 1 AND TRANCHE 2

                    this.submission_loading = true
                    this.proceed_validate_loader = true
                    // this.loading_validate_btn = true

                    let success_validate = []

                    this.selected_patient.map(data => {
                        success_validate.push(data.pHciCaseNo)
                    })

                    let response = await this.$services.getEkonsultaValidationReports({
                        ...validation_payload,
                        case_number: success_validate,

                    })

                    if(response.status === 200) {
                        // this.loading_validate_btn = false
                        response.data = this.responseDataDecryption(response.data)
                        this.proceed_validate_loader = false
                        this.submission_loading = false

                        if (response.data === 'No Data') {
                            // this.loading_validate_btn = this.disable_tranche = this.disable_date = false
                            this.submission_loading = this.disable_tranche = this.disable_date = false

                            this.alert = {
                                    display: true,
                                    type: "standard",
                                    width: "350",
                                    icon: "mdi-alert-circle",
                                    color: "yellow darken-1",
                                    title: '',
                                    body: `No more data found for ${this.start_date} / ${this.end_date}`,
                                    btn_pry_txt: "OK",
                                    btn_pry_color: "primary",
                                    btn_pry_otl: false,
                                    btn_pry_act: "closeAlert",
                                }
                            return 
                        }

                        if (response.data.success) {
                            this.encrypted_xml = JSON.stringify(response.data.pReport);
                            this.transmittal_id = response.data.pTransmittalID;
                            this.hci_case_no = JSON.stringify(response.data.pHciCaseNo);

                            // this.loading_validate_btn = false
                            this.disable_validate_btn = true
                            this.disable_submit_btn = false

                            this.alert_data = {
                                display:true, width: 620, 
                                icon: 'mdi-check-circle', 
                                color: 'success', 
                                title: 'Validated Successfully', 
                                sub_title: `${success_validate.length} Record${success_validate.length > 1 ? 's' : ''} successfully validated, You can now submit the report.`,  
                                downloadTextFile: true,                    
                                xmlData: this.encrypted_xml,
                                file_name: this.enc_xml_file_name
                            }

                            return

                        } else {
                            // this.loading_validate_btn = this.disable_tranche = this.disable_date = false
                            this.submission_loading = false
                            this.submission_failed_err = true
                            this.encrypted_xml_errors = response.data.encrypted_xml_errors
                            return
                        }
                    } else {
                        // this.loading_validate_btn = this.disable_tranche = this.disable_date = false
                        this.submission_loading = this.disable_tranche = this.disable_date = false
                        this.submission_loading =  false
                        this.alert = { display:true, type: 'standard', width: 550, icon: 'mdi-alert-circle', color: 'red', title:'PhilHealth server failed', body: 'Unable to validate Yakap report due to PhilHealth server connection failure.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage'}
                    }
                }
            } else {
                this.alert = {
                    display: true,
                    type: "standard",
                    width: "400",
                    icon: "mdi-alert-circle",
                    color: "yellow darken-1",
                    title: 'Validate Report',
                    body: `Maximum of 15 records can validate please try again.`,
                    btn_pry_txt: "OK",
                    btn_pry_color: "primary",
                    btn_pry_otl: false,
                    btn_pry_act: "closeAlert",
                }
            }
        },

        async downloadXMLbyPass() {
            // this.loading_validate_btn = true
            this.submission_loading = true
            let validation_payload = {
                request_key: 'db',
                provider_code: this.$store.state.prv_data.provider_code,
                phic_token: this.$store.state.prv_data.phic_token,
                pHciAccreNo: this.$store.state.prv_data.ekonsulta_phic_acc_no,
                report_tagging: this.tranche_value,
                report_status: 'batch_validation', 
                start_date: this.start_date,
                end_date: this.end_date
            }

            if (this.terms_accepted) {
                let success_validate = []
                this.selected_patient.forEach(data => { success_validate.push(data.pHciCaseNo)})

                let response = await this.$services.getByPassEkonsultaXml({
                    ...validation_payload,
                    case_number: success_validate,
                })

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
                    if (response.data.success) {
                        this.encrypted_xml = JSON.stringify(response.data.pReport)
                        this.transmittal_id = response.data.pTransmittalID
                        this.hci_case_no = JSON.stringify(response.data.pHciCaseNo)
                        this.show_terms_dialog = false
                        this.submission_loading =  false

                        this.alert_data = null

                        this.$nextTick(() => {
                            this.alert_data = {
                                display: true,
                                width: 620,
                                icon: 'mdi-check-circle',
                                color: 'success',
                                title: 'Yakap Record Extraction Complete',
                                sub_title: `${success_validate.length} Records ready`,
                                downloadTextFile: true,
                                xmlData: this.encrypted_xml,
                                file_name: this.enc_xml_file_name,
                                
                                xml_bypass: true,
                                filename: response.data.filename,
                                pf: response.data.pf
                            }
                        })
                    } else {
                        // this.loading_validate_btn = this.disable_tranche = this.disable_date = false
                        this.submission_loading = this.disable_tranche = this.disable_date = false
                        this.submission_loading =  false
                        this.show_terms_dialog = false
                        this.alert_data = {display:true, width: 550, icon: 'mdi-alert-circle', color: 'error', title:'Validation Failed', sub_title: 'Please try again'}
                        return
                    }
                } else {
                    // this.loading_validate_btn = this.disable_tranche = this.disable_date = false
                    this.submission_loading = this.disable_tranche = this.disable_date = false
                    this.submission_loading =  false
                    this.show_terms_dialog = false
                    this.alert = { display:true, type: 'standard', width: 550, icon: 'mdi-alert-circle', color: 'red', title:'PhilHealth server failed', body: 'Unable to validate Yakap report due to PhilHealth server connection failure.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage'}
                }
            }
        },

        // SUBMIT TRANSACTION FOR TRANCHE 1 AND TRANCHE 2
        async submitTransaction() {
            this.submit_report_loader = true

            let trans_data = new FormData();
            trans_data.append("pTransmittalID", this.transmittal_id);
            trans_data.append("pReport", this.encrypted_xml);
            trans_data.append("pReportTagging", this.tranche_value);
            trans_data.append("pHciCaseNo", this.hci_case_no);
            trans_data.append("Prv_Name", this.$store.state.prv_data.provider_name)
            trans_data.append('phic_token', this.$store.state.prv_data.phic_token)
            trans_data.append("provider_code", this.$store.state.prv_data.provider_code)
            trans_data.append("submitted_by", this.$store.state.usr_credentials.user_name);

            // Additional payload for bypass submission
            if (this.$route.path === '/admin/unrestrict') {
                trans_data.append("request_type", "bypass_submission");
            }

            let response = await this.$services.getEkonsultaSubmitReports(trans_data);

            if(response.status === 200) {
                if(response.data.success) {
                    response.data = this.responseDataDecryption(response.data)
                    this.konsulta_submitted_response = response.data
                    this.submit_report_loader = this.disable_tranche = this.disable_date = false
                    this.pTransmittalID = response.data.pTransmittalID
                    this.alert_data = {
                        display:true, 
                        width: 660, 
                        icon: 'mdi-check-circle', 
                        color: 'success', 
                        title:'Ekonsulta Submission', 
                        sub_title: 'Tranche ' + this.tranche_value + ' is submitted successfully to PhilHealth', 
                        sub_title_2: 'Ref No. ' + response.data.uploadXmlResult.transaction_no,
                        downloadKonsultaReceipt : true,
                        emitMethod: 'backToHomepage',
                    }

                    return
                    
                } else {
                    this.submit_report_loader = this.disable_tranche = this.disable_date = false
                    this.alert_data = {display:true, width: 550, icon: 'mdi-alert-circle', color: 'error', title:'Submission Failed', sub_title: 'Please try again'}
                    return
                }
            } else{
            this.alert = {display:true, type: 'standard', width: 550, icon: 'mdi-alert-circle', color: 'red', title:'PhilHealth server failed', body: 'The system cannot submit the Yakap report to PhilHealth at this time.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage'}
            }
        },

        //SEARCH RECORD FOR E-KONSULTA PATIENT
        async searchRecord() {
            if (this.$refs.report_data.validate()) {
                this.loading_search_btn = true
                this.selected_patient = []
                this.alert_data = {}
                this.selected_patient = []
                this.patient_validated_data = []
                this.display_validated = false
                this.patient_data = []
                this.success_count = 0,
                this.failed_count = 0

                if(this.tranche_value === '2' && this.ekonsulta_tab === 1){
                    await this.$services.validatePendingDiagnosticResults({
                        phic_accre_no: this.$store.state.prv_data.ekonsulta_phic_acc_no,
                        report_tagging: '2'
                    })
                }

                let response = await this.$services.getEkonsultaEligibilityList({
                    // request_key: ['pending', 'for_validation', 'for_submission'][this.ekonsulta_tab],
                    // request_key: ['pending', 'for_validation', 'for_submission'][this.ekonsulta_tab],
                    request_key: this.$route.path === '/admin/unrestrict' ? 'ekonsulta_bypass_submission' : ['pending', 'for_validation', 'for_submission'][this.ekonsulta_tab],
                    start_date: this.start_date,
                    end_date: this.end_date,
                    report_tagging: this.tranche_value,
                    phic_acc_no: this.$store.state.prv_data.ekonsulta_phic_acc_no
                })

                if(response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)

                    if(response.data === 'No Data') {
                        this.loading_search_btn = false
                        this.alert = {
                                display: true,
                                type: "standard",
                                width: "350",
                                icon: "mdi-alert-circle",
                                color: "yellow darken-1",
                                title: '',
                                body: `No more data found for ${this.start_date} / ${this.end_date}`,
                                btn_pry_txt: "OK",
                                btn_pry_color: "primary",
                                btn_pry_otl: false,
                                btn_pry_act: "closeAlert",
                            }
                    } else {
                        this.disable_validate_btn = false  
                        this.patient_data = response.data.map(items => {
                            const pPatientFullname = `${items.pPatientFname} ${items.pPatientMname} ${items.pPatientLname} ${items.pPatientExtname || ''}`;
                            items.pPatientType = items.pPatientType === 'MM' ? 'Member' : 'Dependent'
                            return { ...items, pPatientFullname }
                        })
                        this.loading_search_btn = false
                    }
                } else {
                    this.alert = { display:true, type: 'standard', width: 550, icon: 'mdi-alert-circle', color: 'red', title:'PhilHealth server failed', body: 'Unable to search Yakap record due to PhilHealth server connection failure.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage'}
                } 
            }
        },

        backToHomepage() {
            if(this.$route.path === '/admin/unrestrict') {
                this.$router.push('/admin/unrestrict')
                return
            } else {
                this.$router.push('/admin/ekonsulta-submission')
            }
        },

        downloadKonsultaReceipt() { 
            this.ekonsulta_download_loader = true;
            const ref = this.$refs.receipt.$el; 

            this.$nextTick(() => {
                html2canvas(ref, { scale: 2 }).then((canvas) => {
                    const imgData = canvas.toDataURL('image/jpg');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const margin = 12.7;
                    const pageWidth = 210; 
                    const pageHeight = 297; 
                    const imgWidth = pageWidth - margin * 2;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    let heightLeft = imgHeight;
                    let position = margin;

                    pdf.addImage(imgData, 'JPG', margin, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight - margin * 2;

                    while (heightLeft > 0) {
                        position = heightLeft - imgHeight + margin;
                        pdf.addPage();
                        pdf.addImage(imgData, 'JPG', margin, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight - margin * 2;
                    }

                    const file_name_date = this.$moment().format('MM-DD-YYYY');
                    const file_name_facility = this.$store.state.prv_data.provider_name;
                    const filename =  `${file_name_facility} - Yakap Upload Confirmation Receipt - ${file_name_date}.pdf` 
                    
                    pdf.save(filename);
                    this.ekonsulta_download_loader = false;
                });
            });
        },

        async downloadValidationReport() {
            this.ekonsulta_download_loader = true;
            await new Promise(e => setTimeout(e, 10));

            const doc       = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // RIGHT IMAGE
            const imageWidth  = 40;
            const imageHeight = 32;
            const margin      = 7;

            doc.addImage(require('@/assets/eurekare-logo.jpg'),"JPG",
                pageWidth - imageWidth - margin,
                0,imageWidth,imageHeight
            );

            //LEFT TEXT
            doc.setFont('Times', 'bold');
            doc.setFontSize(12);
            doc.text("YAKAP VALIDATION REPORT", 7, 15);
            doc.setFont('Times', 'normal');
            doc.setFontSize(9);
            doc.text(`Date Generated: ${this.dateTimeToday()}`, 7, 20);
            doc.setFontSize(9);
            doc.text(`Total # Success: ${this.success_count}`, 7, 25);
            doc.setFontSize(9);
            doc.text(`Total # Failed: ${this.failed_count}`, 7, 30);

            // LINE AFTER HEADER 
            doc.setLineWidth(0.1);
            doc.line(7, 35, pageWidth-7, 35);

            //TABLE HEADER
            const columns = [ 
                { header: 'No.', dataKey: 'no', width:10 }, 
                { header: 'Name', dataKey: 'pPatientFullname', width:100 }, 
                { header: 'Patient Type', dataKey: 'pPatientType', width:25 }, 
                { header: 'Patient Pin', dataKey: 'pPatientPin', width:50 }, 
                { header: 'Member Pin', dataKey: 'pMemPin', width:50 }, 
                { header: 'Date of Birth', dataKey: 'pPatientDob', width:20 }, 
                { header: 'Sex', dataKey: 'pPatientSex', width: 8 }, 
                { header: 'Transaction Creation Date', dataKey: 'date_created', width:30 },
                { header: 'Date Admitted', dataKey: 'pTransDate', width:20 }, 
                { header: 'Status', dataKey: 'status', width:40 },
                { header: 'Remarks', dataKey: 'pRemarks', width:50 }, 
            ]; 

            //TABLE DATA
            const rows = this.patient_validated_data.map((item, index) => 
                ({ no: index + 1, 
                pPatientFullname: item.pPatientFullname, 
                pPatientType: item.pPatientType, 
                pPatientPin: item.pPatientPin, 
                pMemPin: item.pMemPin, 
                pPatientDob: item.pPatientDob, 
                pPatientSex: item.pPatientSex, 
                date_created: item.date_created, 
                pTransDate: item.pTransDate,
                status:`Scs: ${item.success_cnt}\nFld: ${item.failed_cnt}`,
                pRemarks: item.error || ""
            }));

            doc.autoTable({
                columns,
                body: rows,
                startY: 43,
                theme: "plain",
                tableWidth: pageWidth - 14,
                margin: { left: 7, right: 7 },
                styles: {
                    lineColor: [180, 180, 180],
                    lineWidth: 0.03,
                    fontSize: 6
                },
                headStyles: {
                    fontSize: 7,
                    fontStyle: 'bold',
                    halign: 'center'
                },

                ...(this.failed_count && {
                    columnStyles: {
                        pRemarks: { cellWidth: 40 }
                    }
                })
            });

            const file_name_date = this.$moment().format('MM-DD-YYYY');
            const file_name_facility = this.$store.state.prv_data.provider_name;
            const filename =  `${file_name_facility} - Yakap Validation Report - ${file_name_date}.pdf` 

            doc.save(filename)
            this.ekonsulta_download_loader = false; 
        },

        convertToExcel() {
            if (this.patient_data) {
                this.excel_loader = true;

                const data_style = {
                    align: 'center',
                    alignVertical: 'center',
                    borderColor: '#000000',
                    wrap: true
                }

                const total_fpe = this.patient_data.reduce((sum, item) => {
                    return sum + Number(item.count || 0)
                }, 0)

                const data_with_total = [
                    ...this.patient_data,
                    {
                        total: true,
                        pDeficiencyRemarks: `Total count of FPE: ${total_fpe}`
                    }
                ]

                let schema = [
                    { ...data_style, column: 'First Name', value: value => value.pPatientFname, width: 30 },
                    { ...data_style, column: 'Middle Name', value: value => value.pPatientMname, width: 30 },
                    { ...data_style, column: 'Last Name', value: value => `${value.pPatientLname} ${value.pPatientExtname || ''}`, width: 30 },
                    { ...data_style, column: 'Patient Type', value: value => value.pPatientType, width: 15 },
                    { ...data_style, column: 'Patient Pin', value: value => value.pPatientPin, width: 25 },
                    { ...data_style, column: 'Member Pin', value: value => value.pMemPin, width: 25 },
                    { ...data_style, column: 'Date of Birth', value: value => value.pPatientDob, width: 20 },
                    { ...data_style, column: 'Gender', value: value => value.pPatientSex },
                    { ...data_style, column: 'Transaction Creation Date', value: value => value.date_created, width: 40 },
                    { ...data_style, column: this.tranche_value === '1' ? 'No. of FPE' : 'No. of Consultations', value: value => value.count, width: 20 },
                    { ...data_style, column: 'Validation Status', value: value => value.validation_status, width: 20 },
                    { column: 'Remarks', width: 40, align: 'right', borderColor: '#000000', wrap: true, fontWeight: value => value.total ? 'bold' : 'normal', value: value => value.pDeficiencyRemarks}
                ]

                const file_name_date = this.$moment().format('MM-DD-YYYY');
                const file_name_facility = this.$store.state.prv_data.provider_name;

                excel_file(data_with_total, {
                    schema,
                    headerStyle: {
                        alignVertical: 'center',
                        fontWeight: 'bold',
                        align: 'center',
                        borderColor: '#FFFFFF',
                        backgroundColor: '#1565C0',
                        color: '#FFFFFF',
                        wrap: true
                    },
                    fileName: `${file_name_facility} - ${this.tranche_value} Submission Report - ${file_name_date}.xlsx`
                })

                setTimeout(() => this.excel_loader = false, 1000)
            }
        }
    },
}
</script>

<style scoped>
::v-deep.v-icon.notranslate.mdi.mdi-checkbox-blank-outline.theme--light:first-of-type {
  color:rgb(255, 255, 255) !important;
}
.input-label:hover { 
  cursor: pointer;
  border-bottom: 1px solid #2196f3;
}
.border-bottom {
  border-bottom: 1px solid rgb(228, 228, 228);
}

.validate-items {
  max-height: 340px;
  overflow-y: auto;
}

.offscreen-receipt {
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 210mm; 
  height: auto;
  overflow: hidden;
}
</style>