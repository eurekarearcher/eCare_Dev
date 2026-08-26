<template>
    <v-card class="pb-6"> 
        <v-card-title class="text-body-1 font-weight-medium"> DAILY ENCOUNTERS </v-card-title>

        <v-row  no-gutters dense>
            <v-col v-if="chart_loader" cols="12" sm="12" md="12" lg="12" class="d-flex justify-center align-center" style="height: 300px;"> 
                    <v-progress-circular :size="50" color="primary" indeterminate> </v-progress-circular>    
            </v-col> 
        </v-row>

        <template v-if="has_data">
            <v-col cols="12" sm="12" md="12" lg="12">
                <h4 class="text-center body-1 font-weight-medium mb-5"> SUMMARY </h4>
                <v-card class="mx-8" outlined> 
                    <v-data-table :headers="headers" :items="summary_table" hide-default-footer> 
                        <template  v-slot:item="{ item }"> 
                            <tr> 
                                <td :class="[item.phic ? 'pl-16' : '', 'd-flex justify-start align-center']"> {{ item.name }} </td>
                                <td> {{ item.total_encounters }} </td>
                                <td> {{ item.daily_avg }} </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
            <v-col v-show="!chart_loader" cols="12" sm="12" md="12" lg="12">
                <LegendsChart /> 
                <GChart type="LineChart" :data="chart_data" :options="options"/>
            </v-col>
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
import LegendsChart from '@/components/admin/ekonsulta/ekonsulta-reports/ekonsulta-charts/LegendsChart';

export default {
    components: {
       GChart,
       LegendsChart
    },

    data() {
        return {
            options: {
                height: 300,
                legend: { position: "none", maxLines: 3 },
                chartArea: {width: '90%', height: '65%'},
                is3D: true,
                colors: ['#1b9e77', '#d95f02', '#7570b3']
                //isStacked: 'relative',
            },

            report_data: [],
            chart_data: [],
            chart_loader: false,
            error_message: '',
            daily_avg_npm: '',
            daily_avg_pm: '',
            daily_avg_ekm: '',
            daily_avg_non_ekm: '',
            has_data: false,

            headers: [
                { text: '', sortable: false },
                { text: 'Number of Encounters', sortable: false },
                { text: 'Average', sortable: false}
            ]
        }
    },

    methods: {
        async getEkonsultaReportStatus(key, request_payload) {
            this.chart_loader = true
            this.has_data = false
            let response = await  this.$services.getStatusReport({
                request_key: key,
                ...request_payload
            })

            if (response.status === 200) {
                if (response.data.success) {
                    response.data = this.responseDataDecryption(response.data)
                    this.has_data = true
                    this.chart_data = []
                    this.report_data = response.data
                    this.chart_loader = false
                    this.chart_data.push(
                        ['DAILY ENCOUNTERS', 'NON PHILHEALTH MEMBER', 'YAKAP MEMBER', 'NON YAKAP MEMBER']
                    )

                    let options_value = {}

                    if(this.report_data.date_range.length <= 1) {
                        options_value = {
                            vAxis: {
                                minValue: 0,
                                ticks: [0]
                            }
                        }
                    } else if(this.report_data.date_range.length >= 1 && this.report_data.date_range.length <= 5) {
                        options_value = {
                            vAxis: {
                                minValue: 0,
                                ticks: [1, 2, 3, 4, 5]
                            }
                        }
                    } else {
                        options_value = {
                            vAxis: {
                                minValue: 1
                            }
                        }
                    }

                    this.options = {
                        ...this.options,
                        ...options_value
                    }

                    this.report_data.date_range.forEach(element => {
                        this.chart_data.push(
                            [element.date, parseInt(element.npm), parseInt(element.ekm), parseInt(element.non_ekm)]
                            //[element.date, parseInt(element.npm), parseInt(element.pm), parseInt(element.ekm), parseInt(element.non_ekm)]
                        )
                    });


                    this.summary_table = [
                        {
                            name: 'NON-PHILHEALTH MEMBERS',
                            total_encounters:  this.report_data.total_npm,
                            daily_avg: this.report_data.daily_avg_npm,
                            phic: false

                        },
                        {
                            name: 'PHILHEALTH MEMBERS',
                            total_encounters: '',
                            daily_avg: '',
                            phic: false
        
                        },
                        {
                            name: 'NON-YAKAP MEMBERS',
                            total_encounters: this.report_data.total_ekm,
                            daily_avg: this.report_data.daily_avg_ekm,
                            phic: true
        
                        },
                        {
                            name: 'YAKAP MEMBERS',
                            total_encounters: this.report_data.total_non_ekm,
                            daily_avg: this.report_data.daily_avg_non_ekm,
                            phic: true
        
                         }
                    ]

                    // this.daily_avg_npm = this.report_data.daily_avg_npm
                    // this.daily_avg_pm = this.report_data.daily_avg_pm
                    // this.daily_avg_ekm = this.report_data.daily_avg_ekm
                    // this.daily_avg_non_ekm = this.report_data.daily_avg_non_ekm
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