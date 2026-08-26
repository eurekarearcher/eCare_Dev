<template>
    <v-container fluid class="height-100 color-text px-7 px-lg-7">
        <Navbar :navbar="navbar" :emr_params="emr_params"/>
        
        <DiagnosticExam :emr_params="emr_params" :patient_info="patient_info" :doctor_info="doctor_info" @getDiagnosticExam="getDiagnosticExam" ref="diagnostic"/>

        <div class="d-flex justify-end mt-4 d-print-none">
            <!-- <v-btn @click="submitResult('save_changes')" :disabled="this.diagnostic_exam_result.length === 0" :loading="btn_loading" class="mr-1" color="success"> <v-icon small left> mdi-content-save-check-outline </v-icon> SAVE RESULT </v-btn> -->
            <v-btn @click="submitResult('submit_result')" :disabled="this.diagnostic_exam_result.length === 0" :loading="btn_loading" class="ml-1" color="primary"> <v-icon small left> mdi-file-send-outline </v-icon> SUBMIT RESULT </v-btn>
        </div>
        <Alert :alert="alert"/>
    </v-container>
</template>

<script>
import Alert from '@/components/Alert.vue';
import DiagnosticExam from '@/components/emr/diagnostic-exam-result/Main.vue'
import Navbar from "@/components/Navbar.vue";
import { mapState } from 'vuex'

export default {
    components: {
        Navbar,
        Alert,
        // DiagnosticForm,
        DiagnosticExam
    },

    data() {
        return {
            emr_params: {
                ek_lgu_id: this.$store.state.pvt_facility_data.ek_lgu_id,
                transaction_number: this.$store.state.pvt_facility_data.transaction_number,
            },
            patient_info: {
                mem_age: this.$store.state.pvt_facility_data.mem_age,
                mem_complete_address: this.$store.state.pvt_facility_data.mem_complete_address,
                mem_first_name: this.$store.state.pvt_facility_data.mem_first_name,
                mem_last_name: this.$store.state.pvt_facility_data.mem_last_name,
                mem_middle_name: this.$store.state.pvt_facility_data.mem_middle_name,
                mem_suffix: this.$store.state.pvt_facility_data.mem_suffix,
                date_created: this.$store.state.pvt_facility_data.date_created,
            },
            doctor_info: {
                doctor_name: this.$store.state.pvt_facility_data.doctor,
                doc_tin: this.$store.state.pvt_facility_data.doc_tin
            },
            alert: {},
            navbar: [],
            procedure_loader: false,
            edit_cpt_status: false,
            btn_loading: false,
            diagnostic_exam_result: []
        }
    },

    // mounted() {
    //     this.getDiagnosticExamResultList()
    // },

    created() {
        const role = this.usr_credentials.department 
        if (role === 'Data Encoder') {
            this.navbar = [
                { title: "HOME", link: "/offline-transaction", icon: "mdi-home" },
                { title: "QUEUE LIST", link: "/offline-queue-list", icon: "mdi-clipboard-list-outline" }
            ]
        } else if(role === 'Medical Laboratory Technologists') {
            this.navbar = [
                { title: "HOME", link: "/diagnostic-laboratory", icon: "mdi-home" },
                { title: 'Queue List', link: '/prv-queue-list', icon: 'fas fa-clipboard-list'}
            ]
        } else {
            this.navbar = [
                { title: 'Queue List', link: '/queue-list', icon: 'fas fa-clipboard-list'},
            ]
        }
    },

    computed: {
        ...mapState(['pvt_facility_data', 'usr_credentials'])
    },

    methods: {

        async getDiagnosticExamResultList(){
            this.$refs.diagnostic.getDiagnosticExamResultList()
        },

        getDiagnosticExam (e) {
            e.data.forEach(el => {
                if(el.libDesc === 'ELECTROCARDIOGRAM (ECG)' || el.libDesc === 'FECAL OCCULT BLOOD' || el.libDesc === 'PPD TEST (TUBERCULOSIS)') {
                    el.pFindings = el.pFinds.LibID
                } else if (el.libDesc === 'CHEST X-RAY') {
                    el.pFindings = el.pFinds.LibID
                    el.pObservation = el.pObs.LibID
                } else if (el.libDesc === 'SPUTUM MICROSCOPY') {
                    el.pFindings = el.pFinds.LibID
                    el.pDataCollection = el.pDC.LibID
                } else if (el.libDesc === 'FECALYSIS') {
                    el.pColor = el.pC.LibID
                    el.pConsistency = el.pCy.LibID
                    el.pBlood = el.pB.LibID
                }
            })

            this.diagnostic_exam_result = e 
        },

        async submitResult(value){
            this.btn_loading = true

            let response = await this.$services.trnAddPvtResults({
                ...this.diagnostic_exam_result,
                request_key: value,    
                ek_lgu_id: this.pvt_facility_data.ek_lgu_id,
                updated_by: this.usr_credentials.user_name,
                provider_code: this.$store.state.prv_data.provider_code
            })

            if(response.status === 200) {
                if(response.data.success) {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-check-circle', color: 'success', title: 'Result has been submitted', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                }
                this.$store.commit('set_transaction_flag', 1)
            } else {
                this.$store.commit('set_transaction_flag', 1)
                this.alert = response.error
            }

            this.btn_loading = false
        }
    }
}
</script>