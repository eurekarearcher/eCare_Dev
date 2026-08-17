<template>
    <v-card class="pb-6"> 
        <v-card-title class="tex-body-1 font-weight-medium"> PLATFORM REGISTRATION </v-card-title>
         <v-row no-gutters dense> 
            <v-col v-if="chart_loader" cols="12" sm="12" md="12" lg="12" class="d-flex justify-center align-center" style="height: 300px;"> 
                    <v-progress-circular :size="50" color="primary" indeterminate> </v-progress-circular>    
            </v-col> 
        </v-row>

        <template v-if="chart_data.length > 0"> 
            <v-row v-show="!chart_loader" no-gutters dense> 
                <v-col cols="12" sm="12" md="2" lg="2" class="d-flex justify-center align-center"> 
                    <v-sheet class="text-center">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <div class="total-container" v-bind="attrs" v-on="on">
                                    <h5 class="text-h5 font-weight-medium text-center"> {{ formatNumber(report_data ? report_data.total : '') }} <br />  </h5>
                                </div>
                            </template>
                            <span>Total: {{ report_data ? report_data.total : '' }}</span>
                        </v-tooltip>
                        <h4 class="mt-2 text-body-1 font-weight-medium"> TOTAL </h4>
                    </v-sheet>
                </v-col>
                <v-col cols="12" sm="12" md="10" lg="10"> 
                    <LegendsChart />
                    <GChart type="BarChart" :data="chart_data" :options="options" class="mt-2"/>
                </v-col>
            </v-row>
        </template>

        <template v-else> 
            <v-row v-show="!chart_loader" no-gutters dense> 
                <v-col cols="12" sm="12" md="12" lg="12" class="d-flex justify-center align-center py-6"> 
                    <h4 class="text-center font-italic body-2"> {{ error_message ? error_message : 'No data to fetch' }}  </h4>
                </v-col>
            </v-row>
        </template>
    </v-card>
</template>

<script>
import { GChart } from 'vue-google-charts/legacy';
import LegendsChart from '@/components/admin/ekonsulta/ekonsulta-reports/ekonsulta-charts/LegendsChart.vue';

export default {
    components: {
        GChart,
        LegendsChart
    },

    data() {
        return {
            options: {
                height: 300,
                legend: { position: "none"},
                chartArea: {width: '76%', height: '65%', top: 0},
                bar: { groupWidth: "75%" },
                is3D: true,
                isStacked: true,
                // hAxis: {
                //     minValue: 0,
                //     ticks: [0]
                // }
                colors: ['#1b9e77', '#d95f02', '#7570b3']
            },

            report_data: [],
            chart_data: [],
            chart_loader: false,
            error_message: ''
        }
    },

    methods: {
        async getEkonsultaReportStatus(key, request_payload) {
            this.chart_loader = true
            let response = await this.$services.getStatusReport({
                request_key: key,
                ...request_payload
            })

            if (response.status === 200) {
                if (response.data.success) {
                    response.data = this.responseDataDecryption(response.data)
                    this.chart_data = []
                    this.report_data = response.data

                    //SET AN ARRAY FOR THE VALUE OF THE REPORT
                    let report_data_value = [this.report_data.platform_reg.npm, this.report_data.platform_reg.pm, this.report_data.platform_reg.em]

                    //GET THE HIGHEST VALUE OF THE ARRAY
                    let get_highest_value = Math.max(...report_data_value)

                    //CREAtE AN ARRAY IT DEFENDS ON THE VALUE IN GET_HIGHEST_VALUE
                    let spread_values = Array.from({ length: get_highest_value }, (_, index) => index + 1)

                    this.options = {
                        ...this.options,
                        ...(spread_values.length <= 10 ? {                        
                            hAxis: {
                                minValue: 0,
                                ticks: spread_values.length !== 0 ? spread_values : [0]
                            }
                        } : {                        
                            hAxis: {
                                minValue: 0
                            }
                        })
                    }

                    this.chart_data.push(
                        ['MEMBERS', 'NON-PHILHEALTH MEMBERS', { role: 'annotation' }, { role: 'style' }, { role: 'tooltip' }, 'YAKAP MEMBERS', { role: 'annotation' }, { role: 'style' }, { role: 'tooltip' }, 'NON-YAKAP MEMBERS', { role: 'annotation' }, { role: 'style' }, { role: 'tooltip' }],
                        ['NON-PHILHEALTH MEMBERS', parseInt(this.report_data.platform_reg.npm), this.report_data.platform_reg.npm.toString(), null, 'NON-PHILHEALTH MEMBERS', null, null, '#b87333', '', null, null, '', null], 
                        ['PHILHEALTH MEMBERS', null, null, null, null, parseInt(this.report_data.platform_reg.em), parseInt(this.report_data.platform_reg.em) !== 0 ? `${this.report_data.platform_reg.em}` : '', '', 'YAKAP MEMBERS', parseInt(this.report_data.platform_reg.nkm),  parseInt(this.report_data.platform_reg.nkm) !== 0 ? `${this.report_data.platform_reg.nkm}` : '', '', 'NON-YAKAP MEMBERS'],  
                    )

                    // this.chart_data.push(s
                    //     ['MEMBERS', 'TOTAL', { role: 'annotation' }, 'TOTAL', { role: 'annotation' }, { role: 'style' }],
                    //     ['NON PHILHEALTH MEMBER', parseInt(this.report_data.platform_reg.npm), this.report_data.platform_reg.npm.toString(), null, null, '#b87333'], 
                    //     ['PHILHEALTH MEMBER', parseInt(this.report_data.platform_reg.em), this.report_data.platform_reg.em !== 0 ? `${this.report_data.platform_reg.em}` : '',  parseInt(this.report_data.platform_reg.nkm), this.report_data.platform_reg.nkm !== 0 ? `${this.report_data.platform_reg.nkm}` : '', "#ED7D31"],  
                    //     // ['EKONSULTA MEMBER', this.report_data.platform_reg.em ? parseInt(this.report_data.platform_reg.em) : 0, "#A5A5A5"],
                    //     // ['NON EKONSULTA MEMBER', this.report_data.platform_reg.nkm ? parseInt(this.report_data.platform_reg.nkm) : 0, "#82341C"],
                    // )
                    this.chart_loader = false
                } else {
                    this.chart_loader = true
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
.total-container {
    width: 86px;
    height: 86px;
    background-color: #1565c0;
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>