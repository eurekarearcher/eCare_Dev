<template>
    <div>
        <v-layout justify-space-between align-center wrap mb-4>
            <h1 class="font-weight-medium grey--text text--darken-3">Costs of Therapeutic and Diagnostic Procedures</h1>
        </v-layout>
        
        <v-row dense> 
            <v-col sm="6" md="6" xl="6" class="pl-0">
                <v-row class="flex-wrap" dense>
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
                            <v-btn :disabled="loading_data" @click="getCostsOfProcedures" class="white--text" color="primary" height="41">
                                <v-icon color="white" left>mdi-update</v-icon>
                                <span>LOAD SELECTED DATES</span>
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
            
            <v-col class="text-right" cols="12" md="6" lg="6">
                <label>EXPORT:</label>
                <v-btn  @click="exportToExcel" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> Excel</v-btn>
            </v-col>
        </v-row>

        <!-- GENERATE EXCEL LOADER -->
        <v-dialog v-model="generate_excel_loader" width="500" persistent>
            <v-card class="text-center py-12">
                <v-progress-circular color="primary" width="6" size="80" indeterminate></v-progress-circular>
                <h3 class="light-blue--text text--darken-4 pl-5 mt-5">Generating Excel...</h3>
            </v-card>
        </v-dialog>

        <CostOfProcedure :procedure_list="procedure_list" :loading_data="loading_data"/>
    </div>
</template>
<script> 
import CostOfProcedure from "@/components/admin/reports/cost-of-procedure/CostOfProcedure";

export default {
    components: {
        CostOfProcedure
    },

    data() {
        return {
            loading_data: false,

            start_date: this.$moment(this.$moment().subtract(1, 'months')).format('YYYY-MM-DD'),
            end_date: this.$moment().format('YYYY-MM-DD'),
            max_start_date: this.$moment().format('YYYY-MM-DD'),

            procedure_list: [],
            export_to_excel_data: [],

            all_total_transaction: 0,
            all_total_costs: 0,
            grand_total: '',

            generate_excel_loader: false,
        }
    },

    mounted() {
        this.getCostsOfProcedures()
    },

    methods: {
        async getCostsOfProcedures() {
            this.loading_data = true

            let response = await this.$services.getCptTransactionReports({
                start_date: this.start_date,
                end_date: this.end_date,
                provider_code: this.$store.state.prv_data.provider_code,
                provider_tin: this.$store.state.prv_data.provider_tin
            })

            if (response.status === 200) {
                this.loading_data = false
                response.data = this.responseDataDecryption(response.data)
                this.all_total_transaction = response.data.grand_total.total_transaction //COMPUTE ALL THE TOTAL_TRANSACTION
                this.all_total_costs = response.data.grand_total.total_costs //COMPUTE ALL THE TOTAL_COSTS

                this.procedure_list = response.data.data

                let header_style = {
                    align: 'center',
                    alignVertical: 'center',
                    borderColor: '#FFFFFF', 
                    fontWeight: 'bold',
                    backgroundColor: '#1565C0',
                    color:'#FFFFFF'
                }
                let column_style = {
                    align: 'right',
                    alignVertical: 'right',
                    borderColor: '#000000',
                    type: String,
                    wrap: true
                }
                
                let result = [
                   [
                        { ...header_style, value: 'CPT_CODE' },
                        { ...header_style, value: 'THERAPEUTIC AND DIAGNOSTIC PROCEDURE(CPT DESCRIPTION)' },
                        { ...header_style, value: 'NUMBER OF TRANSACTION' },
                        { ...header_style, value: 'MIN COSTS' },
                        { ...header_style, value: 'MAX COSTS' },
                        { ...header_style, value: 'AVERAGE COSTS' },
                        { ...header_style, value: 'TOTAL COSTS' },
                    ]
                ]

                this.procedure_list.forEach(element => {

                    result.push([
                            { ...column_style, align: 'center', alignVertical: 'center', value: element.cpt_code},
                            { ...column_style, align: 'center', alignVertical: 'center', value: element.cpt_description},
                            { ...column_style, value: element.total_transaction.toString()},
                            { ...column_style, value: element.min_costs.toString() },
                            { ...column_style, value: element.max_costs.toString() },
                            { ...column_style, value: element.average_costs.toString()},
                            { ...column_style, value: element.total_costs.toString() }
                        ])
                })

                this.procedure_list.push({
                    average_costs: 0,
                    cpt_code: 'GRAND TOTAL',
                    total_transaction: this.all_total_transaction,
                    min_costs: '',
                    max_costs: '',
                    total_costs:  this.all_total_costs
                })

                //SINGLE ROW FOR GRAND TOTAL
                result.push([
                    { ...column_style, align: 'center', alignVertical: 'center', value: 'Grand Total' },
                    { ...column_style, value: '' },
                    { ...column_style, value: this.all_total_transaction.toString()},
                    { ...column_style, value: '' },
                    { ...column_style, value: '' },
                    { ...column_style, value: '' },
                    { ...column_style, value: this.all_total_costs.toString()},
                ])

                this.export_to_excel_data = result
            } else {
                this.alert = response.error
            }
        },

        // EXPORT TO EXCEL
        exportToExcel() { 
            this.generate_excel_loader = true
            const file_name_date = this.$moment().format('MM-DD-YYYY');
            const file_name_facility = this.$store.state.prv_data.provider_name;
    
            setTimeout(() => {
                this.generate_excel_loader = false

                this.$excel_file(this.export_to_excel_data, {
                    columns: [
                        { width: 30 },
                        { width: 60 },
                        { width: 30 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 20 },
                    ],

                    fileName: `${file_name_facility} - ${this.start_date} to ${this.end_date} Cost of procedures - ${file_name_date}.xlsx`
                })
            }, 1000)
        } 
    }
}
</script>