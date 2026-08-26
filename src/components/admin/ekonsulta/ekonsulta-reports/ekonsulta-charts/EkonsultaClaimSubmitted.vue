<template>
    <v-sheet class="my-2">
        <v-card class="pa-4"> 
            <h4 class="text-body-1 font-weight-medium my-4"> YAKAP-CLAIM SUCCESSFUL SUBMITTED </h4>
            <template v-if="has_data"> 
                <Summary :summary_title="summary_title" :summary_data="total_monitoring_data.total_srm_avg" :summary_actual="total_monitoring_data.total_successful" :summary_target="total_monitoring_data.total_srm"/> 
                <v-card-title class="blue darken-3 white--text text-body-2 font-weight-medium justify-center mb-2 mt-6"> SUCCESS RATE MONITORING </v-card-title> 
                <v-data-table :headers="monitoring_headers"  :items="item_monitoring_data" :loading="loading_monitoring_data"> 
                    <template  v-slot:item="{ item }"> 
                        <tr> 
                            <td> {{ getMonthByNumber(item.mnth) }} - {{ item.yr }} </td>
                            <td> {{ item.pending }} </td>
                            <td> {{ item.successful }} </td>
                            <td> {{ item.total }} </td>
                            <td> {{ item.success_rate }} </td>
                        </tr>
                    </template>
                    <template v-slot:body.append>
                        <tr v-if="total_monitoring_data"> 
                            <td> </td>
                            <td> {{ total_monitoring_data.total_pending }} </td>
                            <td> {{ total_monitoring_data.total_successful }} </td>
                            <td> {{ total_monitoring_data.total_srm }} </td>
                            <td> {{ total_monitoring_data.total_srm_avg }} </td>
                        </tr>
                    </template>
                </v-data-table>
            
                <v-card-title class="blue darken-3 white--text text-body-2 font-weight-medium justify-center mb-2 mt-6"> YAKAP-CLAIM SUBMISSIONS  </v-card-title> 
                <v-data-table :headers="claim_headers"  :items="item_claim_data" :loading="loading_claim_data" > 
                    <template  v-slot:item="{ item }"> 
                        <tr> 
                            <td> {{ getMonthByNumber(item.mnth) }} - {{ item.yr }} </td>
                            <td> {{ item.tranche_1 }} </td>
                            <td> {{ item.tranche_2 }} </td>
                        </tr>
                    </template>
                    <template v-slot:body.append>
                        <tr v-if="item_claim_data.length > 0"> 
                            <td> </td>
                            <td> {{ total_claim.total_tranche_1 }} </td>
                            <td> {{ total_claim.total_tranche_2 }} </td>
                        </tr>
                    </template>
                </v-data-table>
            </template>

            <template v-else> 
                <v-row  no-gutters dense> 
                    <v-col cols="12" sm="12" md="12" lg="12" class="d-flex justify-center align-center py-6"> 
                        <h4 class="text-center font-italic body-2"> {{ error_message ? error_message : 'No data to fetch' }}  </h4>
                    </v-col>
                </v-row>
            </template>
        </v-card>
    </v-sheet>
</template>

<script>
import Summary from '@/components/admin/ekonsulta/ekonsulta-reports/ekonsulta-charts/Summary.vue'

export default {
    components: {
        Summary
    },

    data() {
        return {
            options: {
                height: 300,
                legend: { position: "top", maxLines: 3 },
                chartArea: {width: '76%', height: '65%'},
                bar: { groupWidth: "75%" },
                //is3D: true
            },

            loading_monitoring_data: false,
            loading_claim_data: false,

            monitoring_headers:[
                { text: 'Month', value: 'mnth', width:'350px', sortable: false, align:'center'},
                { text: 'Pending', value: 'pending', sortable: false, align:'center'},
                { text: 'Successful', value: 'c', sortable: false, align:'center'},
                { text: 'Total', value: 'total', sortable: false, align:'center'},
                { text: 'Success Rate', value: 'success_rate', width:"120px", sortable: false, align:'center'}
            ],

            claim_headers:[
                { text: 'Month', value: 'mnth', width:'350px', sortable: false, align:'center'},
                { text: 'Enlistment (T1)', value: 'tranche_1', width:'350px', sortable: false, align:'center'},
                { text: 'Consultation (T2)', value: 'tranche_2', width:'350px', sortable: false, align:'center'},
            ],
            
            item_monitoring_data: [],
            item_claim_data: [],
            total_monitoring_data: '',
            total_claim: '',
            has_data: false,
            error_message: '',
            summary_title: 'Submission Success Rate'
        }
    },

    methods: {
        async getEkonsultaReportStatus(key, request_payload) {
            this.loading_monitoring_data = true
            this.loading_claim_data = true

            let response = await  this.$services.getStatusReport({
                request_key: key,
                ...request_payload
            })

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                this.loading_monitoring_data = false
                this.loading_claim_data = false
                this.has_data = true
                if (response.data.success) {
                    this.loading_monitoring_data = false
                    this.loading_claim_data = false
                    this.item_monitoring_data = response.data.success_rate_monitoring.monthly_srm
                    this.total_monitoring_data = {
                        total_pending: response.data.success_rate_monitoring.total_pending,
                        total_srm: response.data.success_rate_monitoring.total_srm,
                        total_srm_avg: response.data.success_rate_monitoring.total_srm_avg,
                        total_successful: response.data.success_rate_monitoring.total_successful
                    }
                    this.item_claim_data = response.data.konsulta_claim_submission.monthly_kcm
                    this.total_claim = {
                        total_tranche_1: response.data.konsulta_claim_submission.total_tranche_1,
                        total_tranche_2: response.data.konsulta_claim_submission.total_tranche_2
                    }
                }
            } else {
                this.has_data = false
                this.loading_monitoring_data = false
                this.loading_claim_data = false
                this.error_message = 'Unable to load data please try again later.'
            }
        }
    }
}
</script>

<style scoped>
.avg-container {
    height: 120px;
    width: 120px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1565c0;
}
.avg-item {
    height: 70%;
    width: 70%;
    border-radius: 50%;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>