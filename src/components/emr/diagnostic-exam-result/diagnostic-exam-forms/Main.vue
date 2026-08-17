<template>
    <v-dialog v-model="procedure_loader" width="800" persistent>
        <v-card class="print-page" id="for-print-absolute">
            <div class="print-section">
                <div v-show="diagnostic_exam.length != 0">
                    <v-row dense no-gutters class="patient-header">
                        <v-col cols="12" sm="12" md="12" lg="12">
                            <Header />    
                        </v-col>
                        <v-col cols="12" sm="12" md="12" lg="12">
                            <div class="mb-4 px-4">
                                <Header2 :name="patient_info.mem_first_name + ' ' +patient_info.mem_middle_name + ' ' +  patient_info.mem_last_name + ' ' + patient_info.mem_suffix" :address="patient_info.mem_complete_address" :age="patient_info.mem_age" :date="prescription_date"/>   
                            </div>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" lg="12">
                            <h1 class="font-weight-medium text-center text-h5 my-3"> Diagnostic Exam Result </h1>   
                        </v-col>
                    </v-row>

                    <v-card-title class="light-blue darken-4 white--text py-2 card-header">
                        <v-row no-gutters dense>
                            <v-col cols="6" class="text-start"> <span class="body-2 font-weight-bold"> TRANSACTION NUMBER: </span> <span class="body-2"> {{ transaction_number }}</span>  </v-col>
                            <v-col cols="6" class="text-end"> <span class="body-2 font-weight-bold"> PRESCRIPTION DATE: </span> <span class="body-2"> {{ prescription_date }}</span></v-col>
                        </v-row>
                    </v-card-title>
                    
                    <v-card-text class="mt-3">
                        <v-form ref="form"> 
                            <component
                                v-if="diagnosticFormComponent"
                                :is="diagnosticFormComponent"
                                :diagnostic_exam="diagnostic_exam"
                                :emr_page="emr_page"
                                :findings_list_items="findings_list_items"
                                :observation_list_items="observation_list_items"
                                :fecalysis_color="fecalysis_color"
                                :fecalysis_blood="fecalysis_blood"
                                :fecalysis_consistency="fecalysis_consistency"
                                @numberOnly="numberOnly"
                            />
                        </v-form>
                        
                        <v-row v-if="doctor_info.doc_tin" dense class="patient-header">
                             <v-col cols="4"  offset="8" class="text-center">
                                <v-sheet> 
                                    <h4 class="font-weight-medium">{{ doctor_info.doctor_name }}</h4>
                                    <h4 class="font-weight-medium border-bottom no-wrap">Lic. #: {{ doctor_info.doc_tin }}</h4>
                                    <h5 class="font-weight-medium mt-1 mb-5">DOCTOR</h5>
                                </v-sheet>
                            </v-col>
                        </v-row>
                       
                    <v-checkbox v-show="diagnostic_exam.length != 0 && diagnostic_exam.pStatus !== 'Done'" v-model="proceed_result" label="Check here to confirm the saving of result" class="d-print-none"></v-checkbox>
                    </v-card-text>
                </div>
            </div>

            <div v-show="diagnostic_exam.length <= 0">
                <v-card-title class="d-flex justify-space-between align-baseline light-blue darken-4 white--text py-2 d-print-none" style="height: 50px;">
                </v-card-title>

                <div class="d-flex justify-center align-center" style="height: 320px;"> 
                    <v-progress-circular :size="50" color="primary" indeterminate> </v-progress-circular>
                </div> 
            </div>
           
            <v-card-actions v-if="!emr_page || (diagnostic_exam.libDesc === 'Chest X-Ray' || diagnostic_exam.libDesc === 'CHEST X-RAY')" class="d-flex justify-space-between align-baseline pa-3 d-print-none">
                <div>
                    <v-btn v-show="diagnostic_exam.length != 0" @click="print" color="#367c9d" dark >PRINT <v-icon size="20" right> mdi-printer</v-icon> </v-btn>
                </div>
                <div class="d-flex">
                    <v-btn @click="cancel_dialog()">Cancel</v-btn>
                    <v-btn v-show="diagnostic_exam.length != 0" @click="saveDiagnosticExam()" :disabled="!proceed_result" class="ml-2" color="primary">Proceed</v-btn>
                </div>
            </v-card-actions>
            <v-card-actions v-else class="d-flex justify-space-between align-baseline pa-3 d-print-none">
                <v-btn v-show="diagnostic_exam.length != 0" @click="print" color="#367c9d" dark >PRINT <v-icon size="20" right> mdi-printer</v-icon> </v-btn>
                <v-btn @click="cancel_dialog()">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import Cbc from './Cbc'
import Urinalysis from './Urinalysis'
import ChestXRay from './ChestXRay'
import Sputum from './Sputum'
import LipidProfile from './LipidProfile'
import Fbs from './Fbs'
import Ecg from './Ecg'
import Rbs from './Rbs'
import Fecalysis from './Fecalysis'
import Papsmear from './Papsmear'
import Ogtt from './Ogtt'
import Fotb from './Fobt'
import Creatinine from './Creatinine'
import PpdTest from './PpdTest'
import Hba1c from './Hba1c'
import OtherDiagExam from './OtherDiagExam'
import Header2 from '../../printable-form/Header2.vue'
import Header from '../../printable-form/Header.vue'

export default {
    props: ['procedure_loader', 'patient_info', 'doctor_info'],

    components: {
        Cbc,
        Urinalysis,
        ChestXRay,
        Sputum,
        LipidProfile,
        Fbs,
        Ecg,
        Rbs,
        Fecalysis,
        Papsmear,
        Ogtt,
        Fotb,
        Creatinine,
        PpdTest,
        Hba1c,
        OtherDiagExam,
        Header2,
        Header
    },

    data() {
        return {
            diagnosis_exam_diaglog: false,
            disabled_btn_diagnostic: true,

            transaction_number: '',
            prescription_date: '',
            diagnostic_exam: [],
            result: [],
            emr_page: false,

            request_lib: {},
            findings_list_items: {},
            observation_list_items: {},
            fecalysis_color: {},
            fecalysis_blood: {},
            fecalysis_consistency: {},

            result_holder: [],

            diagnostic_items: ['COMPLETE BLOOD COUNT', 'URINALYSIS', 'CHEST X-RAY', 'SPUTUM MICROSCOPY', 'LIPID PROFILE', 'ORAL GLUCOSE TOLERANCE TEST', 'FECALYSIS', 'PAPS SMEAR', 'FECAL OCCULT BLOOD', 'FASTING BLOOD SUGAR', 'ELECTROCARDIOGRAM (ECG)', 'RANDOM BLOOD SUGAR', 'CREATININE', 'PPD TEST (TUBERCULOSIS)', 'HBA1C', 'OTHERS'],
            proceed_result: false,

            showPrintImage: false
        }
    },

    computed: {
        validate_diagnostic_exam() {
            let diagnostic = false
            this.result.map(data => {
                if(data.cpt_code === this.diagnostic_exam.cpt_code){
                    diagnostic = true
                } 
            })

            return diagnostic
        },

        diagnosticFormComponent() {
            if (!this.diagnostic_exam?.libDesc) return null

            const diagnostic_map = {
                'COMPLETE BLOOD COUNT': 'Cbc',
                'URINALYSIS': 'Urinalysis',
                'CHEST X-RAY': 'ChestXRay',
                'SPUTUM MICROSCOPY': 'Sputum',
                'LIPID PROFILE': 'LipidProfile',
                'FASTING BLOOD SUGAR': 'Fbs',
                'ELECTROCARDIOGRAM (ECG)': 'Ecg',
                'RANDOM BLOOD SUGAR': 'Rbs',
                'FECALYSIS': 'Fecalysis',
                'PAPS SMEAR': 'Papsmear',
                'ORAL GLUCOSE TOLERANCE TEST': 'Ogtt',
                'FECAL OCCULT BLOOD': 'Fotb',
                'CREATININE': 'Creatinine',
                'PPD TEST (TUBERCULOSIS)': 'PpdTest',
                'HBA1C': 'Hba1c',
                'OTHERS': 'OtherDiagExam'
            }

            return diagnostic_map[this.diagnostic_exam.libDesc.toUpperCase()] || null
        }
    },

    methods: {
        print() {
            window.scrollTo(0, 0);
            setTimeout(() => {
                window.print();
            }, 300);
        },
        
        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if ((event.which < 48 || event.which > 57) && event.which !== 45){
                event.preventDefault();
            }
        },

        openDiagnosticExam(item, transaction_number, prescription_date, emr_page){    
            this.diagnostic_exam = item
            this.diagnosis_exam_diaglog = this.procedure_loader
            this.emr_page = !emr_page
            this.transaction_number = transaction_number
            this.prescription_date = prescription_date

            if (item?.diagnostic?.proceed_result !== undefined) {
                this.proceed_result = item.diagnostic.proceed_result
            } else {
                this.proceed_result = false
            }

            if(this.diagnostic_exam.libDesc === 'Fecalysis' || this.diagnostic_exam.libDesc === 'FECALYSIS') {
                this.request_lib = [{lib: 'LIB_FECALYSIS_Color'}, {lib: 'LIB_FECALYSIS_Consistency'}, {lib: 'LIB_FECALYSIS_Blood'}]
            } else if (this.diagnostic_exam.libDesc === 'CHEST X-RAY' || this.diagnostic_exam.libDesc === 'Chest X-Ray') {
                this.request_lib = [{lib: 'LIB_CHESTXRAY_FINDINGS'}, {lib: 'LIB_CHESTXRAY_OBSERVATION'}]
            } else if (this.diagnostic_exam.libDesc === 'SPUTUM MICROSCOPY' || this.diagnostic_exam.libDesc === 'Sputum Microscopy') {
                this.request_lib = [{lib: 'LIB_SPUTUM_Findings'}, {lib: 'LIB_SPUTUM_DataCollection'}]
            } else if (this.diagnostic_exam.libDesc === 'ELECTROCARDIOGRAM (ECG)' || this.diagnostic_exam.libDesc === 'ECG') {
                this.request_lib = [{lib: 'LIB_ECG_Findings'}]
            } else if (this.diagnostic_exam.libDesc === 'FECAL OCCULT BLOOD' || this.diagnostic_exam.libDesc === 'Fecal Occult Blood') {
                this.request_lib = [{lib: 'Lib_FOBT_Findings'}]
            } else if (this.diagnostic_exam.libDesc === 'PPD TEST (TUBERCULOSIS)' || this.diagnostic_exam.libDesc === 'Ppd Test (tuberculosis)') {
                this.request_lib = [{lib: 'Lib_PPDTest'}]
            } else {
                this.request_lib = [{lib: this.diagnostic_exam.diagnostic.lib_findings || ''}, {lib: this.diagnostic_exam.diagnostic.lib_observation || ''}]
            }

            this.getDiagnosticLibrary()
        },

        async getDiagnosticLibrary() {
            let response = await this.$services.getPhicLibrary({
                request_lib: this.request_lib
            })

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                this.findings_list_items = [response.data.lib_chestxray_findings || response.data.lib_sputum_findings || response.data.lib_ecg_findings || response.data.lib_ppdtest || response.data.lib_fobt_findings]   
                this.observation_list_items = [response.data.lib_chestxray_observation || response.data.lib_sputum_datacollection]
                this.fecalysis_color = [response.data.lib_fecalysis_color]
                this.fecalysis_blood = [response.data.lib_fecalysis_blood]
                this.fecalysis_consistency = [response.data.lib_fecalysis_consistency]
            } else {
                this.alert = response.error
            }
        },

        saveDiagnosticExam(){
            this.$emit('update:procedure_loader', false)

            if(this.diagnostic_items.includes(this.diagnostic_exam.libDesc) || this.diagnostic_items.includes(this.diagnostic_exam.libDesc.toUpperCase())) {
                if(!this.validate_diagnostic_exam) {
                    this.diagnostic_exam.pStatus = 'Done'
                    this.diagnostic_exam.diagnostic.pDiagStatus = 'Done'
                    this.diagnostic_exam.diagnostic.cpt_code = this.diagnostic_exam.cpt_code
                    this.diagnostic_exam.diagnostic.pOtherDiagnosticExam = this.diagnostic_exam.libDesc === 'Others' ? this.diagnostic_exam.cpt_desc : ''
                    this.diagnostic_exam.diagnostic.proceed_result = this.proceed_result

                    if(this.diagnostic_exam.libDesc === 'CHEST X-RAY' || this.diagnostic_exam.libDesc === 'Chest X-Ray'){
                        this.diagnostic_exam.diagnostic.lib_findings = 'LIB_CHESTXRAY_FINDINGS'
                        this.diagnostic_exam.diagnostic.lib_observation = 'LIB_CHESTXRAY_OBSERVATION'
                    }

                    if(this.diagnostic_exam.libDesc === 'FECAL OCCULT BLOOD'){
                        this.diagnostic_exam.diagnostic.lib_findings = 'Lib_FOBT_Findings'
                    }

                    if(this.diagnostic_exam.libDesc === 'FECALYSIS'){
                        this.diagnostic_exam.diagnostic.lib_color = "LIB_FECALYSIS_Color"
                        this.diagnostic_exam.diagnostic.lib_consistency = "LIB_FECALYSIS_Consistency"
                        this.diagnostic_exam.diagnostic.lib_blood = "LIB_FECALYSIS_Blood"
                    }

                    if(this.diagnostic_exam.libDesc === 'PPD TEST (TUBERCULOSIS)'){
                        this.diagnostic_exam.diagnostic.lib_findings = "Lib_PPDTest"
                    }

                    if(this.diagnostic_exam.libDesc === 'SPUTUM MICROSCOPY'){
                        this.diagnostic_exam.diagnostic.lib_findings = 'LIB_SPUTUM_Findings'
                        this.diagnostic_exam.diagnostic.lib_observation = 'LIB_SPUTUM_DataCollection'
                    }

                    if(this.diagnostic_exam.libDesc === 'ELECTROCARDIOGRAM (ECG)'){
                        this.diagnostic_exam.diagnostic.lib_findings = 'LIB_ECG_Findings'
 
                    }

                    this.result_holder.push(this.diagnostic_exam)
                    this.result.push(this.diagnostic_exam.diagnostic) 
                    this.$emit('getDiagnosticExam', this.result)
                    // this.proceed_result = false

                    // //REST THE FIELD OF DIAGNOSTIC EXAM RESULT
                    // this.diagnostic_exam = []
                    sessionStorage.setItem('ioHbn23s', this.$crypto.AES.encrypt(JSON.stringify(this.result_holder), 'EDX242'))
                    //this.$refs.form.reset()
                } 
            }
        },

        cancel_dialog(){
            this.diagnostic_exam = []
            this.$emit('update:procedure_loader', false)
        },

        onAfterPrint() {
          this.showPrintImage = false;
        },
    },

    beforeUnmount() {
        window.removeEventListener('afterprint', this.onAfterPrint);
    },
}
</script>

<style scoped>
.patient-header {
    visibility: hidden;
    height: 0;
    overflow: hidden;
}

.border-bottom{
    border-bottom: 1px solid grey; 
    margin: 2pt 0 0 8pt; 
    padding: 2pt 0pt 0pt 0pt; 
    width: 100%;
}

@media print {
    body * {
        background: white;
        position: relative;
        width: 100%;
    }

    #for-print-absolute {
        position: absolute !important;
        top: 0;
        left: 0;
    }
    
    .patient-header {
        visibility: visible;
        height: auto;
        overflow: visible;
    }

    .print-page {
        padding: 10px 0 0 30px !important;
        page-break-inside: auto;
    }

    .print-section {
        margin-top: 20px !important;
        page-break-inside: avoid;
        page-break-after: always;
    }

    ::v-deep .v-dialog__content, .v-dialog__content--active {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        height: auto !important;
        position: absolute !important;
    }

    ::v-deep .v-dialog {
        margin: 0 !important;      
        box-shadow: none !important; 
        overflow: visible !important;
        position: static !important;
        position: relative !important;
    }

    ::v-deep .v-card {
        box-shadow: none !important;
        border: none !important;
        margin-left: -12px;
    } 

    ::v-deep .light-blue.darken-4 {
        background: white !important;
    }

    ::v-deep .white--text {
        color: black !important;
    }

    ::v-deep .v-input__slot::before {
        display: none;
    }

    ::v-deep .v-text-field__details {
        display: none !important;
    }

    ::v-deep .v-image__image {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    ::v-deep .v-overlay__scrim {
        display: none !important;
    }

    .form-div {
        margin: 0 0 0 0 !important;
    }
}
</style>
