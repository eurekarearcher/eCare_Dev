<template>
    <v-sheet class="my-2">
        <v-card class="pa-4">
            <h4 class="text-body-1 font-weight-medium my-4"> TOTAL NUMBER OF REGISTERED YAKAP CLIENTS YEAR TO DATE </h4>  
            <template v-if="has_data">
                <v-row no-gutters dense class="mb-4"> 
                    <v-col cols="12" sm="12" md="8" lg="8"> 
                        <v-row no-gutters dense> 
                            <v-col cols="12" sm="12" md="3" lg="3"> <h4 class="text-body-2 font-weight-medium my-2"> FACILITY NAME:  </h4> </v-col>
                            <v-col cols="12" sm="12" md="9" lg="9"> <h4 class="text-body-2 font-weight-medium my-2"> {{ prv_name }} </h4> </v-col>
                            <v-col cols="12" sm="12" md="3" lg="3"> <h4 class="text-body-2 font-weight-medium my-2"> ADDRESS:  </h4>  </v-col>
                            <v-col cols="12" sm="12" md="9" lg="9"> <h4 class="text-body-2 font-weight-medium my-2"> {{ facility_address }} </h4> </v-col>
                            <v-col cols="12" sm="12" md="3" lg="3"> <h4 class="text-body-2 font-weight-medium my-2"> ACCREDITATION NUMBER:  </h4>  </v-col>
                            <v-col cols="12" sm="12" md="9" lg="9"> <h4 class="text-body-2 font-weight-medium my-2"> {{ phic_acc_no }} </h4> </v-col>
                            <v-col cols="12" sm="12" md="3" lg="3"> <h4 class="text-body-2 font-weight-medium my-2"> MAXIMUM PATIENT LOAD:  </h4>  </v-col>
                            <v-col cols="12" sm="12" md="9" lg="9"> <h4 class="text-body-2 font-weight-medium my-2"> {{ max_patient_load }} </h4> </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="12" md="4" lg="4">
                        <Summary :summary_title="summary_title" :summary_data="mpp" :summary_actual="rkc_actual" :summary_target="max_patient_load"/> 
                    </v-col>
                </v-row>

                <v-data-table :headers="headers" :items="registred_items" :loading="loading_data">  </v-data-table>
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
            loading_data: false,
            headers:[
                { text: 'AS OF (DATE)', value: 'date', width:'350px', sortable: false, align:'center'},
                { text: 'RUNNING TOTAL', value: 'total_rkc', sortable: false, align:'center'},
                { text: 'AVAILABLE SLOT', value: 'available_slot', sortable: false, align:'center'},
                //{ text: 'CS Platform ', value: 'cs_platform', sortable: false, align:'center'},
            ],
            
            registred_items: [],
            facility_address: '',
            max_patient_load: '',
            prv_name: '',
            phic_acc_no: '',
            mpp: '',
            rkc_actual: '',
            error_message: '',
            has_data: false,
            summary_title: 'MPP Yakap-client Registrations'
        }
    },

    methods: {
        async getEkonsultaReportStatus(key, request_payload) {
            this.loading_data = true
            let response = await  this.$services.getStatusReport({
                request_key: key,
                ...request_payload
            })

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                this.loading_data = false
                this.facility_address = response.data.address
                this.max_patient_load = response.data.max_patient_load
                this.prv_name = response.data.prv_name
                this.phic_acc_no = response.data.PHciAccreNo
                this.has_data = true
                if(response.data.success) {
                    this.registred_items = response.data.reg_kon_clients ? response.data.reg_kon_clients : []
                    this.mpp = response.data.mpp
                    this.rkc_actual = response.data.actual
                }
            } else {
                this.chart_loader = false
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