<template>
    <div>
        <v-layout justify-space-between align-center wrap mb-4>
            <h1 class="font-weight-medium grey--text text--darken-3">Prescribed, Dispensed and Costs of Medicines </h1>
        </v-layout>

        <v-row dense class="align-center">
            <v-col cols="3" class="d-flex align-center">
                <span class="mr-2 mt-2">Top Medicine:</span>
                <v-select v-model="selected_top_number" :items="['5', '10', '15']" hide-details dense class="flex-grow-1"></v-select>
            </v-col>

            <v-col cols="2" class="d-flex align-center">
                <span class="mr-2 mt-2">Month:</span>
                <v-select v-model="selected_month" :items="month_item" item-text="text" item-value="value" hide-details dense class="flex-grow-1"></v-select>
            </v-col>

            <v-col cols="2" class="d-flex align-center">
                <span class="mr-2 mt-2">Year:</span>
                <v-select v-model="selected_year" :items="year_items" hide-details dense class="flex-grow-1"></v-select>
            </v-col>

            <v-col cols="3" class="d-flex align-center">
                <v-btn :disabled="loading_data" @click="costsOfMedicine" color="primary" class="white--text" height="41" >
                    <v-icon left>mdi-update</v-icon>
                    LOAD SELECTED DATES
                </v-btn>
            </v-col>

            <v-spacer></v-spacer>

            <v-col cols="2" class="d-flex justify-end align-center">
                <label class="mr-2">EXPORT:</label>
                <v-btn @click="exportToExcel" color="success">
                <v-icon left>mdi-microsoft-excel</v-icon> Excel
                </v-btn>
            </v-col>
        </v-row>
        
        <v-spacer  class="mt-6"></v-spacer>

        <div v-show="loading_data" class="text-center mt-8" style="border: 1px solid lightgrey">
            <v-progress-linear color="primary" size="30" indeterminate></v-progress-linear>
            <h4 class="text--secondary body-2 my-5">Loading Data... Please wait...</h4>
        </div>

        
        <div v-if="!loading_data && chart_data.length > 1">
            <GChart type="ColumnChart" :data="chart_data" :options="options" />
        </div>
        <div v-else-if="!loading_data">
            <p class="text-center text-gray-500">No data available for the selected year or month.</p>
        </div>

        
    </div>
</template>

<script> 
import { GChart } from 'vue-google-charts/legacy'

export default {
    components: {
        GChart
    },

    data() {
        return {
            loading_data: false,
            selected_month: null,
            year_items:  [...Array(5)].map((a, b)=> new Date().getFullYear() - b),
            selected_year: new Date().getFullYear(),
            month_item: [
                { text: 'January', value: 1 },
                { text: 'February', value: 2 },
                { text: 'March', value: 3 },
                { text: 'April', value: 4 },
                { text: 'May', value: 5 },
                { text: 'June', value: 6 },
                { text: 'July', value: 7 },
                { text: 'August', value: 8 },
                { text: 'September', value: 9 },
                { text: 'October', value: 10 },
                { text: 'November', value: 11 },
                { text: 'December', value: 12 },
                { text: 'ALL', value: null }
            ],
            export_to_excel_data: [],
            medicine_report: [],
            month_list:[],
            
            options: {},
            top_medicine: {},
            chart_data : [],
            selected_top_number: '10',
        }
    },

    mounted() {
        this.costsOfMedicine()
    },

    methods: {
        async costsOfMedicine() {
            this.loading_data = true;

            let response = await this.$services.getAnnualMedicine({
                provider_tin: this.$store.state.prv_data.provider_tin,
                provider_code: this.$store.state.prv_data.provider_code,
                key: this.$store.state.usr_credentials.provider_reg_type,
                selected_month : this.selected_month,
                year: this.selected_year,
                selected_top_number: this.selected_top_number
            });

            if (response.status === 200) {
                const response_data = this.responseDataDecryption(response.data);
                this.loading_data = false;
                this.has_data = true;
                this.top_medicine = response_data.top_medicine || {};
                const months = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];

                const months_to_use = (!this.selected_month || this.selected_month === 'ALL') ? months : [this.month_item.find(m => m.value === this.selected_month)?.text];

                let chart_data = [
                    ['Medicine', ...months_to_use.flatMap(month => [
                        `${month} Prescribed`, 
                        `${month} Dispensed`
                    ])]
                ];

                Object.values(this.top_medicine).forEach(med => {
                    chart_data.push([
                        med.generic_name,
                        ...months_to_use.flatMap(month => [
                        parseInt(med[month]?.prescribed || 0),
                        parseInt(med[month]?.dispensed || 0)
                        ])
                    ]);
                });

                this.chart_data = chart_data;
                const medicine_count = this.chart_data.length - 1; 

                this.options = {
                    height: 600,
                    legend: {
                        position: "top",
                        maxLines: 1,
                        textStyle: {
                            fontSize: 12.2,
                            italic: false,
                            color: '#333'
                        }
                    },
                    chartArea: { width: '90%', height: '75%' },
                    bar: {
                        groupWidth: medicine_count <= 4 ? '30%' : '75%'
                    },
                    is3D: true,
                    isStacked: true,
                    hAxis: {
                        title: 'Top Medicine',
                        textStyle: {
                        fontSize: 12,
                        italic: false,
                        color: '#333'
                        },
                        textPosition: 'out'
                    },
                    series: {}
                }

                //FOR EXCEL FORMAT
                let header_style = {
                    align: 'center',
                    alignVertical: 'center',
                    fontWeight: 'bold',
                    borderColor: '#FFFFFF',
                    backgroundColor: '#1565C0',
                    color:'#FFFFFF',
                }
                let column_style = {
                    align: 'right',
                    alignVertical: 'right',
                    borderColor: '#000000',
                    wrap: true
                }

                const first_header_row = [
                    { ...header_style, value: 'GENERIC NAME' },
                    ...months_to_use.flatMap(month => [
                        { ...header_style, span: 3, value: month },
                        { ...header_style, value: '' },
                        { ...header_style, value: '' },
                    ])
                ];

                const second_header_row = [
                    { ...header_style, value: '' },
                    ...months_to_use.flatMap(() => [
                        { ...header_style, value: 'Prescribed' },
                        { ...header_style, value: 'Dispensed' },
                        { ...header_style, value: 'Weighted Average Cost' },
                    ])
                ];

                const result = [first_header_row, second_header_row];
                Object.values(response.data.top_medicine).forEach(med => {
                    result.push([
                        { ...column_style, align: 'left', alignVertical: 'left', value: med.generic_name },
                        ...months_to_use.flatMap(month => [
                            { ...column_style, value: med[month]?.prescribed || '0' },
                            { ...column_style, value: med[month]?.dispensed || '0' },
                            { ...column_style, value: med[month]?.average_cost || '0' }
                        ])
                    ]);
                });

                this.export_to_excel_data = result;
            }else {
                this.alert = response.error;
            }
        },

        // EXPORT TO EXCEL
        exportToExcel() { 
            const file_name_date = this.$moment().format('MM-DD-YYYY');
            const file_name_facility = this.$store.state.prv_data.provider_name;

            setTimeout(() => {
                this.$excel_file(this.export_to_excel_data, {
                    columns: [
                        { width: 70 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                        { width: 15 },
                        { width: 15 },
                        { width: 20 },
                    ],

                    fileName: `${file_name_facility} - Cost of Medicine Top ${this.selected_top_number} ${this.selected_month} ${this.selected_year} - ${file_name_date}.xlsx`
                })
            }, 1000)
        } 
    }
}
</script>