<template>
    <div class="mt-4 d-print-none">
        <v-card outlined>
            <h3 class="font-weight-regular light-blue darken-4 text-center white--text py-2">DIAGNOSTIC EXAM RESULT <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic">(DIAGNOSTIKONG RESULTA NG PAGSUSURI)</span></h3>
                <div class="pa-7">
                    <v-row dense class="mb-4"> 
                        <v-col cols="6" sm="4" md="4" lg="4" offset-sm="8" offset-md="8" offset-lg="8">
                            <v-text-field v-model="tbl_search" prepend-inner-icon="mdi-magnify" label="Search" hide-details outlined dense></v-text-field>
                        </v-col>
                    </v-row>

                    <v-data-table :sort-by.sync="sort_by" :sort-desc.sync="sort_desc" :headers="tbl_headers" :items="tbl_items" :loading="tbl_loading"  :search="tbl_search" :items-per-page="5" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-1">
                        <template v-slot:item="{ item }">
                        <tr>
                            <td>{{item.transaction_number}}</td>
                            <td>{{item.prescription_date}} </td>
                            <td>
                                <v-btn @click="viewCPT(item)" small elevation="6" class="mx-2"><v-icon left small>mdi-file-search-outline</v-icon> VIEW DETAILS</v-btn>
                            </td>
                        </tr>
                        </template>
                    </v-data-table>
                </div>
        </v-card>
        
        <v-dialog v-model="view_cpt_code">
            <DoctorsOrder :procedure_items="procedure_items" :patient_info="patient_info" :doctor_info="doctor_info" :is_edit="is_edit" @getDiagnosticExam="getDiagnosticExam" @closeViewCPT="closeViewCPT" ref="view_cpt_code"/>
        </v-dialog>
        <Alert :alert="alert" />
    </div>
</template>

<script>
import DoctorsOrder from '@/components/emr/diagnostic-exam-result/DoctorsOrder'
import Alert from "@/components/Alert"

export default {
    components:{
        DoctorsOrder,
        Alert,
    },

    props: ['emr_params', 'selected_icd', 'diabetes_mellitus', 'is_edit', 'patient_info', 'doctor_info'],
    
    created(){
        if(!this.is_edit) {
            this.getDiagnosticExamResultList()
        }
    },

    data() {
        return {
            procedure_items: [],
            view_cpt_code: false,

            display_ekass: false,
            ekass_epress_data: {},

            tbl_headers:[
                { text: 'TRANSACTION NUMBER', value: 'transaction_number', sortable: false},
                { text: 'PRESCRIPTION DATE', value: 'prescription_date', sortable: false},
                { text: 'ACTION', width: '500', sortable: false},
            ],
            sort_by: 'prescription_date',
            sort_desc: true,
            tbl_loading: true,
            tbl_search: '',
            tbl_items: [],
            ekas_result: [],
            ekonsulta_data: sessionStorage.getItem('YETBS') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('YETBS'), 'ygrGk2dX').toString(this.$crypto.enc.Utf8)) : null,

            epress_medicine: {},

            alert: {},

            cbc: {
                libDesc: 'COMPLETE BLOOD COUNT',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date  (YYYY-MM-DD)
                pHematocrit: '',         // Hematocrit 
                pHemoglobinG: '',       // Hemoglobin G 
                pHemoglobinMmol: '',   // Hemoglobin Mmol 
                pMhcPg: '',           // Mhc Pg 
                pMhcFmol: '',          // Mhc Fmol 
                pMchcGhb: '',          // Mchc Ghb 
                pMchcMmol: '',         // Mchc Mmol 
                pMcvUm: '',             // Mcv Um 
                pMcvFl: '',             // Mcv Fl 
                pWbc1000: '',           // Wbc1000
                pWbc10: '',             // Wbc10 
                pMyelocyte: '',          // Myelocyte 
                pNeutrophilsBnd: '',    // Neutrophils Bnd 
                pNeutrophilsSeg: '',    // Neutrophils Seg 
                pLymphocytes: '',        // Lymphocytes 
                pMonocytes: '',          // Monocytes 
                pEosinophils: '',       // Eosinophils 
                pBasophils: '',          // Basophils
                pPlatelet: '',           // Platelet 
                pDiagnosticLabFee: ''  // Diagnostic Lab Fee
            },

            urinalysis: {
                libDesc: 'URINALYSIS',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pGravity: '',            // Gravity 
                pAppearance: '',          // Appearance 
                pColor: '',              // Color 
                pGlucose: '',            // Glucose 
                pProteins: '',           // Proteins 
                pKetones: '',            // Ketones 
                pPh: '',                 // Ph 
                pRbCells: '',           // Rb Cells 
                pWbCells: '',           // Wb Cells 
                pBacteria: '',           // Bacteria 
                pCrystals: '',           // Crystals
                pBladderCell: '',            // Bladder Cell 
                pSquamousCell: '',           // Squamous Cell 
                pTubularCell: '',            // Tubular Cell 
                pBroadCasts: '',        // Broad Casts 
                pEpithelialCast: '',    // Epithelial Cast 
                pGranularCast: '',      // Granular Cast 
                pHyalineCast: '',      // Hyaline Cast 
                pRbcCast: '',           // Rbc Cast 
                pWaxyCast: '',          // Waxy Cast 
                pWcCast: '',            // Wc Cast 
                pAlbumin: '',            // Albumin 
                pPusCells: '',          // Pus Cells 
                pDiagnosticLabFee: '',     // Diagnostic Lab Fee
            },

            chest_x_ray: {
                lib_findings: 'LIB_CHESTXRAY_FINDINGS',
                lib_observation:"LIB_CHESTXRAY_OBSERVATION",
                libDesc: 'CHEST X-RAY',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pFinds: '',
                pFindings: '',           // Findings 
                pRemarksFindings: '',            // Remarks Findings 
                pObs: '',
                pObservation: '',        // Observation 
                pRemarksObservation: '',// Remarks Observation 
                pDiagnosticLabFee: '', // Diagnostic Lab Fee
            },

            sputum: {
                lib_findings: 'LIB_SPUTUM_Findings',
                lib_observation: 'LIB_SPUTUM_DataCollection',
                libDesc:  'SPUTUM MICROSCOPY',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pDC: '',
                pDataCollection: '',    // Data Collection 
                pFinds: '',
                pFindings: '',           // Findings
                pRemarks: '',            // Remarks 
                pNoPlusses: '',         // No Plusses 
                pDiagnosticLabFee: '', // Diagnostic Lab Fee
            },

            lipid_profile: {
                libDesc:  'LIPID PROFILE',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pLdl: '',                // Ldl 
                pHdl: '',                // Hdl 
                pTotal: '',              // Total 
                pCholesterol: '',        // Cholesterol 
                pTriglycerides: '',      // Triglycerides 
                pDiagnosticLabFee: '', // Diagnostic Lab Fee
            },

            fbs: {
                libDesc: 'FASTING BLOOD SUGAR',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pGlucoseMg: '',         // Glucose Mg 
                pGlucoseMmol: '',       // Glucose Mmol
                pDiagnosticLabFee: '', // Diagnostic Lab Fee
            },

            ecg: {
                lib_findings: 'LIB_ECG_Findings',
                libDesc:  'ELECTROCARDIOGRAM (ECG)',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pFinds: '',
                pFindings: '',           // Findings 
                pRemarks: '',            // Remarks 
                pDiagnosticLabFee: '', // Diagnostic Lab Fee 
            },

            rbs: {
                libDesc:  'RANDOM BLOOD SUGAR',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pGlucoseMg: '',         // Glucose Mg 
                pGlucoseMmol: '',       // Glucose Mmol
                pDiagnosticLabFee: '', // Diagnostic Lab Fee
            },

            fecalysis: {
                lib_color: 'LIB_FECALYSIS_Color',
                lib_consistency: 'LIB_FECALYSIS_Consistency',
                lib_blood: 'LIB_FECALYSIS_Blood',
                libDesc:  'FECALYSIS',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date  (YYYY-MM-DD)
                pC: '',
                pColor: '',              // Color
                pCy: '',
                pConsistency: '',        // Consistency
                pRbc: '',                // Rbc 
                pWbc: '',                // Wbc
                pOva: '',                // Ova 
                pParasite: '',           // Parasite
                pB: '',
                pBlood: '',              // Blood 
                pPusCells: '',          // PusCells 
                pDiagnosticLabFee: '', // Diagnostic Lab Fee
            },

            papsmear: {
                libDesc: 'PAPS SMEAR',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pFindings: '',           // Findings 
                pImpression: '',         // Impression 
                pDiagnosticLabFee: '', // Diagnostic Lab Fee 
            },

            ogtt: {
                libDesc: 'ORAL GLUCOSE TOLERANCE TEST',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date  (YYYY-MM-DD)
                pExamFastingMg: '',    // ExamFasting Mg 
                pExamFastingMmol: '',  // ExamFasting Mmol 
                pExamOgttOneHrMg: '',// Exam Ogtt One Hr Mg 
                pExamOgttOneHrMmol: '',// Exam Ogtt One Hr Mmol 
                pExamOgttTwoHrMg: '',// Exam Ogtt Two Hr Mg 
                pExamOgttTwoHrMmol: '',// Exam Ogtt Two Hr Mmol 
                pDiagnosticLabFee: '',  // Diagnostic Lab Fee 
            },

            fotb: {
                lib_findings: 'Lib_FOBT_Findings',
                libDesc: 'FECAL OCCULT BLOOD',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pFinds: '',
                pFindings: '',           // Findings 
                pDiagnosticLabFee: '', // Diagnostic Lab Fee 
            },

            creatinine: {
                libDesc: 'CREATININE',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pFindings: '',           // Findings 
                pDiagnosticLabFee: '', // Diagnostic Lab Fee 
            },

            ppd_test: {
                lib_findings: 'Lib_PPDTest',
                libDesc: 'PPD TEST (TUBERCULOSIS)',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pFinds: '',
                pFindings: '',           // Findings 
                pDiagnosticLabFee: '', // Diagnostic Lab Fee 
            },

            hba1c: {
                libDesc: 'HBA1C',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pFindings: '',           // Findings 
                pDiagnosticLabFee: '', // Diagnostic Lab Fee 
            },

            other_diagnostic_exam: {
                libId: '99',
                libDesc:  'Others',
                cpt_code: '',
                pDiagStatus: '',
                pReferralFacility: '',  // Referral Facility 
                pLabDate: "",           // Lab Date (YYYY-MM-DD)
                pOtherDiagnosticExam: '',   // Other Diagnostic Exam
                pFindings: '',           // Findings 
                pDiagnosticLabFee: '', // Diagnostic Lab Fee 
            }
        }
    },

    methods: {
        async displayProcedure(data){
            let get_diagnostic_encoded = sessionStorage.getItem('pmsh24Dxs') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('pmsh24Dxs'), 'OIG220').toString(this.$crypto.enc.Utf8)) : null
            if(!get_diagnostic_encoded){
                await this.filterProcedure(data.transactions)
                this.viewCPT(data.transactions[0])
            } else {
                this.mergeDiagnosticData(data, get_diagnostic_encoded)
            }
        },

        mergeDiagnosticData(data_procedure, get_diagnostic_data) {
            const diagnosticMap = {};

            // Build a lookup map by cpt_code
            get_diagnostic_data.data.forEach(d => {
                diagnosticMap[d.cpt_code] = d;
            });

            // Update procedures
            data_procedure.transactions.forEach(transaction => {
                if (transaction.transaction_number === get_diagnostic_data.transaction_number) {
                transaction.procedure.forEach(proc => {
                    const diagnostic = diagnosticMap[proc.cpt_code];
                    if (diagnostic) {
                    proc.diagnostic = { ...diagnostic };
                    }
                });
                }
            });

            this.viewCPT(data_procedure.transactions[0])
        },
        
        async getDiagnosticExamResultList(){
            let response = await this.$services.getDiagnosticExamResultList({
                ek_lgu_id: this.emr_params.ek_lgu_id, 
                type: (this.$route.path === '/emr-consultation/diagnostic-exam-result' || this.$route.path === '/emr-consultation/patient-information') ? 'emr' : 'pre-consultation'
            })

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                
                if(response.data.has_data === true){
                    this.tbl_loading = false
                    this.tbl_items = response.data.transactions
                    await this.filterProcedure(this.tbl_items)    
                    // let procedure_mapping = {
                    //     cbc: this.cbc,
                    //     urinalysis: this.urinalysis,
                    //     chest_x_ray: this.chest_x_ray,
                    //     sputum: this.sputum,
                    //     lipid_profile: this.lipid_profile,
                    //     fbs: this.fbs,
                    //     ecg: this.ecg,
                    //     rbs: this.rbs,
                    //     fecalysis: this.fecalysis,
                    //     papsmear: this.papsmear,
                    //     ogtt: this.ogtt,
                    //     fotb: this.fotb,
                    //     creatinine: this.creatinine,
                    //     ppd_test: this.ppd_test,
                    //     hba1c: this.hba1c,
                    //     other_diagnostic_exam: this.other_diagnostic_exam,
                    // };

                    // this.tbl_items.forEach(procedures => {
                    //     procedures.procedure.forEach((element, id) => {
                    //         // FIND MATCHING PROCEDURE
                    //         for (let key in procedure_mapping) {
                    //             if (procedure_mapping[key].libDesc === element.libDesc) {
                    //                 element.key = id;
                    //                 element.diagnostic = { ...procedure_mapping[key] };
                    //                 break; 
                    //             }
                    //         }
                    //     });
                    // });
                } else {
                    this.tbl_loading = false
                    this.tbl_items = []
                }
            } else {
                this.alert = response.error
            }
        },

        async filterProcedure(data){
            let procedure_mapping = {
                cbc: this.cbc,
                urinalysis: this.urinalysis,
                chest_x_ray: this.chest_x_ray,
                sputum: this.sputum,
                lipid_profile: this.lipid_profile,
                fbs: this.fbs,
                ecg: this.ecg,
                rbs: this.rbs,
                fecalysis: this.fecalysis,
                papsmear: this.papsmear,
                ogtt: this.ogtt,
                fotb: this.fotb,
                creatinine: this.creatinine,
                ppd_test: this.ppd_test,
                hba1c: this.hba1c,
                other_diagnostic_exam: this.other_diagnostic_exam,
            };

            data.forEach(procedures => {
                procedures.procedure.forEach((element, id) => {
                    // FIND MATCHING PROCEDURE
                    for (let key in procedure_mapping) {
                        if (procedure_mapping[key].libDesc === element.libDesc) {
                            element.key = id;
                            element.diagnostic = { ...procedure_mapping[key] };
                            break; 
                        }
                    }
                });
            });
        },
        
        viewCPT(item){  
            let get_diagnostic_encoded = sessionStorage.getItem('pmsh24Dxs') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('pmsh24Dxs'), 'OIG220').toString(this.$crypto.enc.Utf8)) : null

            this.view_cpt_code = true
            this.procedure_items = item
            // GET THE ENCODED PROCEDURE IF THE PAGE IS REFRESH
            if(get_diagnostic_encoded){
                if(this.procedure_items.transaction_number === get_diagnostic_encoded.transaction_number){
                    this.procedure_items.procedure.forEach(element => {
                        let procedure_match = get_diagnostic_encoded.data.find(
                            item => item.cpt_code === element.cpt_code
                        )
    
                        if(procedure_match){
                            element.diagnostic = procedure_match
                            element.pStatus = procedure_match.pDiagStatus
                        }
                    })
                }
            }
        },

        closeViewCPT(){
            this.view_cpt_code = false
            this.procedure_items = []
        },

        getDiagnosticExam(e){
            this.$emit('getDiagnosticExam', e)
        },
    }
}
</script>
<style scoped>
@media print{
    body *{
        background: white;
        position: relative;
    }
    #not-for-print { 
        display: none; 
    }

    #for-print-absolute {
        left: 0;
        position: absolute !important; 
        padding: 0px;
        top: 0;
    }
}
</style>