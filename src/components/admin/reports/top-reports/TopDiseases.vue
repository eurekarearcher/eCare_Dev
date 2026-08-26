<template>
    <div>
        <v-layout justify-space-between align-center wrap mb-4>
            <h1 class="font-weight-medium grey--text text--darken-3">Top {{ number_selection === '5'? 'Five':'' || number_selection === '10'? 'Ten':'' || number_selection === '15'? 'Fifteen':'' }} Disease (Number of Cases) </h1>
        </v-layout>
        <v-row dense> 
            <v-col sm="6" md="6" xl="6">
                <div class="d-flex justify-start align-baseline">
                    <h5 class="body-1 font-weight-medium mr-4"> Top Diseases: </h5>
                    <div style="width: 100px;"> 
                        <v-select v-model="select_top_number" :items="['5','10', '15']" hide-details dense></v-select>
                    </div>
                    <h5 class="body-1 font-weight-medium mx-4"> Year: </h5>
                    <div style="width: 100px;"> 
                        <v-select v-model="selected_year" :items="year_items" hide-details dense></v-select>
                    </div>
                    <div class="d-flex">
                        <v-btn  :disabled="loading_data" @click="topDieases" class="white--text ml-4" color="primary" height="41">
                            <v-icon color="white" left>mdi-update</v-icon>
                            <span>LOAD SELECTED TOP DISEASES</span>
                        </v-btn>
                    </div>
                </div>
            </v-col>
            <v-col class="text-right" cols="12" md="6" lg="6">
                <label>EXPORT:</label>
                <v-btn  @click="exportToExcel" :disabled="!has_data" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> Excel</v-btn>
            </v-col>
        </v-row>

        <div v-show="loading_data" class="text-center mt-8" style="border: 1px solid lightgrey">
            <v-progress-linear color="primary" size="30" indeterminate></v-progress-linear>
            <h4 class="text--secondary body-2 my-5">Loading Data... Please wait...</h4>
        </div>

        <!-- GENERATE EXCEL LOADER -->
        <v-dialog v-model="generate_excel_loader" width="500" persistent>
            <v-card class="text-center py-12">
                <v-progress-circular color="primary" width="6" size="80" indeterminate></v-progress-circular>
                <h3 class="light-blue--text text--darken-4 pl-5 mt-5">Generating Excel...</h3>
            </v-card>
        </v-dialog>

        <div v-if="!loading_data" class="mt-8">
            <template v-if="has_data"> 
                <GChart type="ColumnChart" :data="chart_data" :options="options" />
            </template>
            <template v-else> 
                <h4 class="text-center font-italic grey--text pt-4"> No available data</h4>
            </template>
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
            generate_excel_loader: false,
            year_items:  [...Array(5)].map((a, b)=> new Date().getFullYear() - b),
            selected_year: new Date().getFullYear(),
            select_top_number: '10',
            number_selection: '',

            export_to_excel_data: [],
            top_cases_list: [],
            has_data: false,

            options: {
                height: 600,
                legend: { position: "top", maxLines: 3 },
                chartArea: {width: '90%', height: '75%'},
                bar: { groupWidth: "75%" },
                is3D: true,
                isStacked: true,
                colors: ["#4472C4", "#ED7D31", "#A5A5A5", "#FFC000", "#5B9BD5", "#70AD47", "#264478", "#264478", "#4D207E", "#82341C", "#636363", "#997300"]
            },

            chart_data: []
        }
    },

    mounted() {
        this.topDieases()
    },

    methods: {
        async topDieases() {
            this.chart_data = [
                ["Month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            ]

            this.number_selection = this.select_top_number

            this.loading_data = true
            let response = await this.$services.getAnnualDisease({
                key: this.$store.state.usr_credentials.provider_reg_type,
                provider_code: this.$store.state.prv_data.provider_code,
                year: this.selected_year,
                filter: this.select_top_number
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)

                this.loading_data = false

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
                
                let result = [
                   [
                        { ...header_style, value: 'ICD_MAIN_CODE_DESC' },
                        { ...header_style, value: 'JANUARY' },
                        { ...header_style, value: 'FEBRUARY' },
                        { ...header_style, value: 'MARCH' },
                        { ...header_style, value: 'APRIL' },
                        { ...header_style, value: 'MAY' },
                        { ...header_style, value: 'JUNE' },
                        { ...header_style, value: 'JULY' },
                        { ...header_style, value: 'AUGUST' },
                        { ...header_style, value: 'SEPTEMBER' },
                        { ...header_style, value: 'OCTOBER' },
                        { ...header_style, value: 'NOVEMBER' },
                        { ...header_style, value: 'DECEMBER' },
                    ]
                ]

                this.top_cases_list = response.data
 
                if(this.top_cases_list.top_cases.length === 0) {
                    this.has_data = false
                } else {
                    this.has_data = true
                    this.top_cases_list.top_cases.forEach(element => {
                        this.chart_data.push([element.icd_code + " / " + element.description, parseInt(element.January), parseInt(element.February), parseInt(element.March), parseInt(element.April), parseInt(element.May), parseInt(element.June), parseInt(element.July), parseInt(element.August), parseInt(element.September), parseInt(element.October), parseInt(element.November), parseInt(element.December)])
                        result.push([
                                { ...column_style, align: 'left', alignVertical: 'left', value: element.description},
                                { ...column_style, value: element.January !== '0'? element.January : ''},
                                { ...column_style, value: element.February !== '0'? element.February : ''},
                                { ...column_style, value: element.March !== '0'? element.March : ''},
                                { ...column_style, value: element.April !== '0'? element.April : ''},
                                { ...column_style, value: element.May !== '0'? element.May : ''},
                                { ...column_style, value: element.June !== '0'? element.June : ''},
                                { ...column_style, value: element.July !== '0'? element.July : ''},
                                { ...column_style, value: element.August !== '0'? element.August : ''},
                                { ...column_style, value: element.September !== '0'? element.September : ''},
                                { ...column_style, value: element.October !== '0'? element.October : ''},
                                { ...column_style, value: element.November !== '0'? element.November : ''},
                                { ...column_style, value: element.December !== '0'? element.December : ''}
                            ])
                    })
                }

                // //SINGLE ROW FOR GRAND TOTAL
                result.push([
                    { ...column_style, align: 'left', alignVertical: 'left', value: 'GRAND TOTAL' },
                    { ...column_style, value: this.top_cases_list.grand_total.January !== '0'? this.top_cases_list.grand_total.January : '' },
                    { ...column_style, value: this.top_cases_list.grand_total.February !== '0'? this.top_cases_list.grand_total.February : '' },
                    { ...column_style, value: this.top_cases_list.grand_total.March !== '0'? this.top_cases_list.grand_total.March : '' },
                    { ...column_style, value: this.top_cases_list.grand_total.April !== '0'? this.top_cases_list.grand_total.April : '' },
                    { ...column_style, value: this.top_cases_list.grand_total.May !== '0'? this.top_cases_list.grand_total.May : '' },
                    { ...column_style, value: this.top_cases_list.grand_total.June !== '0'? this.top_cases_list.grand_total.June : '' },
                    { ...column_style, value: this.top_cases_list.grand_total.July !== '0'? this.top_cases_list.grand_total.July : '' },
                    { ...column_style, value: this.top_cases_list.grand_total.August !== '0'? this.top_cases_list.grand_total.August : '' },
                    { ...column_style, value: this.top_cases_list.grand_total.September !== '0'? this.top_cases_list.grand_total.September : '' },
                    { ...column_style, value: this.top_cases_list.grand_total.October !== '0'? this.top_cases_list.grand_total.October : '' },
                    { ...column_style, value: this.top_cases_list.grand_total.November !== '0'? this.top_cases_list.grand_total.November : '' },
                    { ...column_style, value: this.top_cases_list.grand_total.December !== '0'? this.top_cases_list.grand_total.December : '' },
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
                        { width: 100 },
                        { width: 15 },
                        { width: 15 },
                        { width: 15 },
                        { width: 15 },
                        { width: 15 },
                        { width: 15 },
                        { width: 15 },
                        { width: 15 },
                        { width: 15 },
                        { width: 15 },
                        { width: 15 },
                        { width: 15 },
                    ],
                    fileName: `${file_name_facility} - Top ${this.select_top_number}  Diseases ${this.selected_year} report - ${file_name_date}.xlsx`
                })
            }, 1000)
        } 
    }
}
</script>