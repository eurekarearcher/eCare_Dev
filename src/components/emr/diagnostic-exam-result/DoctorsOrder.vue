<template>
    <div> 
        <v-card outlined class="pa-8 d-print-none">
            <v-card-title class="d-flex justify-space-between align-baseline light-blue darken-4 white--text py-2 px-8 d-print-none">
                <v-row>
                    <v-col class="body-2"><span class="font-weight-bold">TRANSACTION NUMBER:</span> {{procedure_items.transaction_number}}</v-col>
                    <v-col class="body-2 d-flex justify-end"><span class="font-weight-bold pr-1">PRESCRIPTION DATE:</span> {{procedure_items.prescription_date}}</v-col>
                </v-row>
            </v-card-title>
            <div class="pa-7">
                <v-row dense class="mb-4"> 
                    <v-col cols="12" sm="4" md="4" lg="4" offset-sm="8" offset-md="8" offset-lg="8">
                        <v-text-field v-model="tbl_search" prepend-inner-icon="mdi-magnify" label="Search" hide-details outlined dense></v-text-field>
                    </v-col>
                </v-row>

                <v-data-table :headers="tbl_headers" :items="procedure_items.procedure" :search="tbl_search" :items-per-page="5" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{item.cpt_code}}</td>
                            <td>{{item.cpt_desc}}</td>
                            <td>
                                <v-select v-model="item.pStatus" @change="procedureStatus(item)" :items="items" :label="item.pStatus" :disabled="item.pStatus === 'Done'">
                                </v-select>
                            </td>
                            <td><v-btn @click="view_cpt_code_form(item, procedure_items.transaction_number, procedure_items.prescription_date)" small elevation="6" :key="item.cpt_code"><v-icon left small>mdi-file-search-outline</v-icon> CPT Details/Procedure list</v-btn></td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
            <v-row justify="center">
                <v-btn @click="closeViewCPT"> {{ edit_cpt_status ? 'SAVE' : 'CLOSE' }}</v-btn>
            </v-row>
        </v-card>
        <DiagnosticForm :procedure_loader.sync="procedure_loader" :patient_info="patient_info" :doctor_info="doctor_info" :is_edit="is_edit" @getDiagnosticExam="getDiagnosticExam" ref="view_cpt_code_form"/>
        <Alert :alert="alert" />
    </div>
</template>

<script>
import Alert from "@/components/Alert"
import DiagnosticForm from '@/components/emr/diagnostic-exam-result/diagnostic-exam-forms/Main'

export default {
    components:{
      Alert,
      DiagnosticForm 
    },

    props: ['procedure_items', 'is_edit', 'cpt', 'patient_info', 'doctor_info'],

    data(){
        return{
            tbl_headers:[
                { text: 'CPT CODE', value: 'cpt_code', sortable: false, width:'200px'},
                { text: 'CPT DESCRIPTION', value: 'LibDesc', sortable: false,  width:'820px'},
                { text: 'STATUS', value: 'pStatus', width: '250px', sortable: false},
                { text: 'ACTION', sortable: false},
            ],

            tbl_search: '',

            emr_page: false,

            diagnostic_exam: {
                transaction_number: '', 
                data: []
            },

            alert: {},

            items: ['Not yet done', 'Deferred', 'Waived'],

            procedure_loader: false,
            edit_cpt_status: false,
            temp_procedure: [],
            
        }
    },

    mounted() {
        if(this.$route.path === '/emr-consultation/diagnostic-exam-result'){
            this.emr_page = true
        } else {
            this.emr_page = false
        }
    },

    methods:{
        procedureStatus(item) {
            this.edit_cpt_status = true;

            this.temp_procedure = this.temp_procedure.filter(proc => proc.cpt_code !== item.cpt_code);

            this.procedure_items.procedure.forEach((data) => {
                if (data.cpt_code === item.cpt_code) {
                    data.diagnostic.cpt_code = item.cpt_code;
                    data.diagnostic.pDiagStatus = item.pStatus;
                    this.temp_procedure.push(data.diagnostic);
                }
            });

            this.getDiagnosticExam();
        },

        closeViewCPT(){
            if(this.is_edit){
                let find_not_yet_done = this.procedure_items.procedure.find(data => data.pStatus === 'Not yet done')
                if(find_not_yet_done) {
                    this.alert = {
                        display: true, 
                        type: 'standard', 
                        width: '450', 
                        icon: 'mdi-alert-circle', 
                        color: 'yellow', 
                        title: 'Diagnostic exam result', 
                        body: 'Please encode all the result before to proceed', 
                        btn_pry_txt: 'OK', 
                        btn_pry_color: 'primary', 
                        btn_pry_otl: false, 
                        btn_pry_act: 'closeAlert' 
                    }
                } else {
                    this.$emit('closeViewCPT')
                }
            } else {
                this.$emit('closeViewCPT')
            }
        },

        async view_cpt_code_form(item, transaction_number, prescription_date) {
            this.procedure_loader = true

            let response = await this.$services.getDiagnosticExamResults({
                transaction_number,
                cpt_code: item.cpt_code
            })

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)

                const diagnostic_result = response.data?.[0] || item.diagnostic

                let diagnostic = {
                    ...item,
                    diagnostic: diagnostic_result
                }

                const status = diagnostic_result?.pStatus || item.pStatus

                if (status === 'Not yet done' || status === 'Deferred') {
                    this.emr_page = true
                    this.$refs.view_cpt_code_form.openDiagnosticExam(item, transaction_number,prescription_date,this.emr_page)
                } else {
                    this.emr_page = false
                    this.$refs.view_cpt_code_form.openDiagnosticExam(diagnostic, transaction_number, prescription_date, this.emr_page)
                }
            } else {
                this.alert = response.error
            }
        },

        getDiagnosticExam(procedure){
            if(procedure){
                this.temp_procedure.push(...procedure)
            }

            const filter_data = this.temp_procedure.filter((value, index, self) =>
                index === self.findIndex((t) => (t.libDesc === value.libDesc && t.cpt_code === value.cpt_code && t.pLabDate === value.pLabDate))
            );
            
            this.diagnostic_exam = { transaction_number: this.procedure_items.transaction_number, data: filter_data }
            this.$emit('getDiagnosticExam', this.diagnostic_exam)
            sessionStorage.setItem('pmsh24Dxs', this.$crypto.AES.encrypt(JSON.stringify(this.diagnostic_exam), 'OIG220'))
        }
    }
  
}
</script>

<style scoped>
::v-deep .v-label.v-label--active.theme--light {
    display: none !important;
}
</style>