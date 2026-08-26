<template>
    <v-dialog v-model="show_dialog" :width="'219.5mm'" persistent>
        <div id="for-print-absolute">
            <v-card id="for-print-relative" flat>
                <div class="pa-5" id="for-print-treatment">
                    <div v-if="print_option !== 'pres_only' && $route.name === 'EMRConsultationTypeA'">
                        <Laboratory 
                            :data="data" 
                            :patient_name="patient_name" 
                            :follow_up_consultation_date="follow_up_consultation_date" 
                            :follow_up_date="follow_up_date"
                            :show_management_doctor_notes="show_management_doctor_notes" 
                            :treatmentplan_qr_value="treatmentplan_qr_value" 
                            :print_option="print_option"
                            :select_management="select_management" 
                            :doctor_notes="doctor_notes"
                        />
                    </div>

                    <v-divider v-if="print_option === 'both' && $route.name === 'EMRConsultationTypeA'" class="my-1"></v-divider>

                    <div v-if="print_option !== 'lab_only'">
                        <Medicine 
                            :data="data" 
                            :doctor_notes="doctor_notes" 
                            :select_management="select_management" 
                            :show_management_doctor_notes="show_management_doctor_notes" 
                            :follow_up_consultation_date="follow_up_consultation_date" 
                            :follow_up_date="follow_up_date" 
                            :print_option="print_option" 
                            :selected_medicine="selected_medicine" 
                            :rx_issued.sync="rx_issued" 
                            :patient_name="patient_name" 
                            :tbl_items="tbl_items" 
                            @mutations="mutations($event)"  
                        />
                    </div>
                </div>

                <v-row dense no-gutters v-if="$route.name === 'EMRConsultationTypeA'">  
                    <v-col cols="12" sm="9" lg="9" xl="9" class="px-5 mt-4 d-print-none">
                        <h4 class="font-weight-medium">PRINT OPTIONS:</h4>

                        <v-radio-group v-model="print_option" class="ma-0" hide-details row>
                            <v-radio label="LAB REQUEST & PRESCRIPTION" value="both"></v-radio>
                            <v-radio label="LAB REQUEST ONLY" value="lab_only"></v-radio>
                            <v-radio label="PRESCRIPTION ONLY" value="pres_only"></v-radio>
                        </v-radio-group>
                    </v-col>

                    <v-col cols="12">
                        <v-sheet class="d-print-none px-5">
                            <v-checkbox v-model="show_management_doctor_notes" label="MANAGEMENT & DOCTOR NOTES"></v-checkbox>
                        </v-sheet>
                    </v-col>
                </v-row>

                <div id="not-for-print">
                    <template v-if="$store.state.usr_credentials.department === 'Midwife' && !emr_params.editable">
                        <v-btn @click="closeDialog" class="my-2 justify-end">CLOSE<v-icon size="20" right>mdi-close</v-icon></v-btn>
                    </template>
                    <template v-else>
                        <Footer @saveAsPDF="saveAsPDF" @print="print" @close="closeDialog" :emr_params="emr_params" :rx_issued="rx_issued = false"/>
                    </template>
                </div>

            </v-card>
        </div>
    </v-dialog>
</template>

<script>
// import html2canvas from 'html2canvas'
import { mapState } from 'vuex'
// import jsPDF from 'jspdf'
// import Header from '@/components/emr/printable-form/Header.vue';
import Footer from '@/components/emr/printable-form/Footer.vue'
import Medicine from '@/components/emr/printable-form/treatment-plan/RxIssued.vue'
import Laboratory from '@/components/emr/printable-form/treatment-plan/Laboratory.vue'
// import QrcodeVue from 'qrcode.vue';

export default {
    props: ['tbl_items', 'patient_info', 'date_admitted', 'doctor_notes', 'select_management', 'follow_up_consultation_date', 'emr_params'],

    components: {
        // Header,
        // QrcodeVue,
        Footer,
        Medicine,
        Laboratory
    },
    
    data() {
        return {
            show_dialog: false,
            data: {
                patient_name: '',
                date_admitted: '',
                patient_address: '',
                patient_age: '',
                patient_sex:'',
                selected_icd: [],
                selected_medicine: [],
                doctor_name: '',
                doctor_prc_license: '',
                doctor_specialization: '',
                doctor_position:''
            },
            selected_medicine: [],
            patient_name: '',
            show_management_doctor_notes: false,
            show_print_options: true,
            print_option: 'both',
            treatmentplan_qr_value: '',
            is_treatment_plan: '',
            to_print:'',

            rx_issued: false,
            is_saving_pdf: false
        }
    },

    computed: {
        ...mapState(['usr_credentials']),
        
        follow_up_date() {
            return this.$moment(this.follow_up_consultation_date).format("MMMM D, YYYY");
        },
    },

    methods: {
        
        openDialog(data) {
            this.show_dialog = true;
            this.data = data;
            this.treatmentplan_qr_value = this.wsDataEncryption(JSON.stringify({
                transaction_number: this.emr_params?.transaction_number ? this.emr_params.transaction_number : data.transaction_number,
                ek_lgu_id: this.emr_params?.ek_lgu_id ? this.emr_params.ek_lgu_id : data.ek_lgu_id
            }))
            this.patient_name = data.patient_name,
            this.doctor_name = data.doctor_name,
            
            this.selected_medicine = data.selected_medicine,
            this.is_treatment_plan = this.data?.is_treatment_plan
            // this.treatmentplan_qr_value = `transaction_number: ${this.emr_params.transaction_number}\nek_lgu_id: ${this.emr_params.ek_lgu_id}\nmem_first_name: ${this.patient_info.mem_first_name}\nmem_middle_name: ${this.patient_info.mem_middle_name || ''}\nmem_last_name: ${this.patient_info.mem_last_name}\nmedicine: ${select_medicine}\ndiagnostic_procedures: ${select_icd}`;
        },

        closeDialog() {
            this.show_dialog = false
        },

        async saveAsPDF() {
            this.is_saving_pdf = true
            await this.$nextTick()

            let elementId = ''
            let patient_name = ''

            if (this.$route.name === 'EMRConsultationTypeA') {
                elementId = 'for-print-treatment'

                const { mem_first_name, mem_middle_name, mem_last_name, mem_suffix } = this.patient_info

                patient_name = `${mem_first_name} ${mem_middle_name || ''} ${mem_last_name} ${mem_suffix || ''}`

            } else if (this.$route.name === 'ConsultationTypeA') {
                elementId = 'for-print-treatment-precons'
                patient_name = this.patient_name

            } else {
                elementId = 'for-print-treatment-dispensing'
                patient_name = this.patient_name
            }

            const file_name = `PATIENT ${patient_name} LAB PRESCRIPTION ${this.$moment().format('MM-DD-YYYY hh_mm A')}`

            await this.generatePDF(elementId, file_name)

            this.is_saving_pdf = false
        },

        print() {
            window.scrollTo(0, 0);
            this.$nextTick(() => {
                window.print()
            })
        },

        //UPDATE THE TABLE (STATUS) OF DISPENSED MEDICINE FOR RX ISSUED ONLY
        mutations(value){
            this.$emit('mutations', value)
        }
    }
}
</script>

<style scoped>
/* .print-pat-info{
    border-bottom: 1px solid grey; 
    margin: 14px 0 0 4px; 
    padding: 2px 0 0 0; 
    width: 100%;
}
.print-med-tbl-main{ overflow-x: auto; }
.print-med-tbl-main .d-flex{
    width: 100%;
    padding: 0;
    margin: 0; 
}
.print-med-tbl-h{
    font-size: 14px;
    width: 250px;
}
.print-med-tbl-b{
    font-size: 14px;
    padding: 2px 0 0 2px;
    width: 100%;
    text-align: center;
}
.print-border-bottom{ background: grey !important; }
@media screen {
    body { font-size: 14pt }
}
@media screen, print {
    body { line-height: 1.2 }
} */
@media print{
    @page {
        size: Letter;
        margin: 0 !important;
        
    }
    body *{
        background: white;
        position: relative;
        margin-left: -0.3rem !important;
    }
    #not-for-print{ display: none; }

    #for-print-absolute{
        left: 0 !important;
        position: absolute !important; 
        top: 0;
        margin-top: -38px !important;
        transform: scale(0.9);
    }
    ::v-deep .v-dialog {
        box-shadow: none;
    }
    #for-print {
        background-color: red !important;
        width: 100%;
    }
    .print-med-tbl-main{ overflow-x: hidden; }   
    .print-med-tbl-h, .print-med-tbl-b{
        width: 100% 
    }
}

</style>