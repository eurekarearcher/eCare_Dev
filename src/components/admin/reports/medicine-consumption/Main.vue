<template>
    <div>
        <v-layout justify-space-between align-center wrap mb-4>
            <h1 class="font-weight-medium grey--text text--darken-3">Medicine Consumption Report</h1>
            
            <v-btn :disabled="tbl_loading" @click="changeReportView" class="white--text align-self-end" color="#367c9d">
                {{ show_main_report ? 'Generate Per Year' : 'View Consumption Reports' }} 
                <v-icon right>mdi-chart-bar</v-icon>
            </v-btn>
        </v-layout>

        <div v-show="show_main_report">
            <v-form ref="med_report_filter">    
            <v-row justify="space-between" dense>
                <v-col cols="12" sm="5" md="6" lg="7" xl="7" >
                    <v-row class="flex-wrap mb-4" dense>
                        <v-col cols="12" sm="4" md="4" lg="3" xl="3">
                            <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" :value="formatDate(start_date)" :rules="empty_validation" label="Start Date" hide-details outlined readonly dense></v-text-field>
                                </template>

                                <v-date-picker v-model="start_date" :max="max_start_date && end_date" no-title></v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="3" xl="3" class="pl-sm-2">
                            <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" :value="formatDate(end_date)" :rules="empty_validation" label="End Date" hide-details outlined readonly dense></v-text-field>
                                </template>

                                <v-date-picker v-model="end_date" :max="max_start_date" :min="start_date" :disabled="!start_date" no-title></v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" lg="6" xl="6" class="pl-4">
                            <div class="d-flex">
                                <v-btn @click="getMedicineComsuptionDateRange()" class="white--text" color="primary" height="41">
                                    <v-icon color="white" left>mdi-update</v-icon>
                                    <span>LOAD SELECTED DATES</span>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            </v-form>
            
            <v-row justify="space-between" align="center" dense>
                <v-col cols="12" md="6" lg="6">
                    <v-text-field v-model="tbl_search" prepend-inner-icon="mdi-magnify" label="Search" maxlength="40" hide-details clearable outlined dense></v-text-field>
                </v-col>

                <v-col class="text-right" cols="12" md="6">
                    <label>EXPORT:</label>
                    <v-btn :disabled="tbl_loading" @click="exportToExcel" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> Excel</v-btn>
                </v-col>
            </v-row>

            <v-data-table :headers="tbl_headers" :items="filtered_tbl_items" :loading="tbl_loading" :search="tbl_search" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-2 mt-4" mobile-breakpoint="0" group-by="transaction_number" >
                <template v-slot:group.header="{ group, headers, toggle, isOpen, items }">
                    <td :colspan="headers.length">
                        <div class="d-flex justify-space-between align-center px-5 py-2" style="background-color: #f5f5f5; border-radius: 6px;">
                        <div class="text-body-2">
                            <strong>Date:</strong> {{ items[0].date }} &nbsp; | &nbsp;
                            <strong>Patient:</strong> {{ items[0].patient_name }} &nbsp; | &nbsp;
                            <strong>Age:</strong> {{ items[0].age }} &nbsp; | &nbsp;
                            <strong>Address:</strong> {{ items[0].address }} &nbsp; | &nbsp;
                            <strong>Diagnosis:</strong> {{ items[0].diagnosis }}
                        </div>
                        <v-btn @click="toggle" small class="ml-4" icon :ref="group">
                            <v-icon>{{ isOpen ? 'mdi-plus' : 'mdi-minus' }}</v-icon>
                            <span class="ml-2">{{ isOpen ? 'Hide' : 'Show' }}</span>
                        </v-btn>
                        </div>
                    </td>
                </template>

                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.medicines }}</td>
                        <td>{{ item.lot_no }}</td>
                        <td>{{ item.total_prescribed_medicine }}</td>
                        <td>{{ item.total_dispensed_medicine }}</td>
                        <td>{{ item.unit_price }}</td>
                        <td>{{ item.total_unit_cost }}</td>
                        <td :style="{'background-color' : item.category === 'Complete' ? '#A5D6A7' : '#EF9A9A'}">{{ item.category }}</td>
                        <td>{{ item.remarks }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>

        <GenerateReportByYear v-show="!show_main_report" :transaction_data="reports_by_year_data" ref="reports_by_year" />
    </div>
</template>

<script>
import GenerateReportByYear from '@/components/admin/reports/medicine-consumption/GenerateReportByYear.vue'

export default {
    components: {
        GenerateReportByYear
    },

    data() {
        return {
            tbl_loading: true,
            tbl_search: '',
            tbl_headers: [
                { text: 'Medicines', value: 'medicines', width: '200px', sortable: false },
                { text: 'Lot Number', value: 'lot_no', width: '100px', sortable: false },
                { text: 'No. of Prescribed Medicine', value: 'total_prescribed_medicine', width: '100px', sortable: false },
                { text: 'No. of Dispensed Medicine', value: 'total_dispensed_medicine', width: '100px', sortable: false },
                { text: 'Unit Price', value: 'unit_price', width: '100px', sortable: false },
                { text: 'Total Unit Price', value: 'total_unit_cost', width: '100px', sortable: false },
                { text: 'Category', value: 'category', width: '100px', sortable: false },
                { text: 'Remarks', value: 'remarks', width: '100px', sortable: false }
            ],
            tbl_items: [],

            show_main_report: true,
            reports_by_year_data: [],

             //FOR THE RANGE FILTERING
            start_date:"",
            end_date: "",
            max_start_date: this.$moment().format('YYYY-MM-DD'),
            filtered_tbl_items: [],
            empty_validation: [ v => !!v && !/^ *$/.test(v) || 'Required Field']
        }
    },

    created() {
        this.getMedicineComsuption();
    },

    methods: {
        async getMedicineComsuption() {
            let response = await this.$services.getMedicineConsumptionReport({
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                
                if (Array.isArray(response.data)) {
                    const arr = []

                    for (let patient_index = 0; patient_index < response.data.length; patient_index++) {
                        const patient_data = response.data[patient_index];

                        for (let medicine_index = 0; medicine_index < patient_data.transaction_medicine.length; medicine_index++) {
                            const medicine_data = patient_data.transaction_medicine[medicine_index];

                            arr.push({
                                index: medicine_index,
                                transaction_number: patient_data.transaction_number,
                                ek_lgu_id: patient_data.ek_lgu_id,
                                date: this.formatDateAndTime(patient_data.date),
                                patient_name: this.combineString([patient_data.first_name, patient_data.middle_name, patient_data.last_name, patient_data.suffix]),
                                age: patient_data.patient_age,
                                address: patient_data.complete_address,
                                diagnosis: this.displayNA(patient_data.icd_desc),
                                medicines: medicine_data.medicine_name ? medicine_data.medicine_name.trim() : '',
                                lot_no: medicine_data.lot_no ? medicine_data.lot_no : '-',
                                total_prescribed_medicine: medicine_data.total_prescribed_medicine,
                                total_dispensed_medicine: medicine_data.total_dispensed_medicine,
                                unit_price: medicine_data.medicine_unit_price ? parseInt(medicine_data.medicine_unit_price).toFixed(2) : '',
                                total_unit_cost: medicine_data.total_unit_cost ? parseInt(medicine_data.total_unit_cost).toFixed(2) : '',
                                category: parseInt(medicine_data.total_dispensed_medicine) < parseInt(medicine_data.total_prescribed_medicine) ? 'Incomplete' : 'Complete',
                                remarks: ''
                            })
                        }
                    }

                    this.reports_by_year_data = response.data
                    this.tbl_items = arr
                }
            
                this.tbl_loading = false
            } else {
                this.alert = response.error
            }
        },

        exportToExcel() {
            const header_style = {
                align: 'center',
                alignVertical: 'center',
                borderColor: '#FFFFFF', 
                fontWeight: 'bold',
                backgroundColor: '#1565C0',
                color:'#FFFFFF'
            }
            
            const header = [
                [
                    { ...header_style, value: 'Date' },
                    { ...header_style, value: 'Patient Name' },
                    { ...header_style, value: 'Age' },
                    { ...header_style, value: 'Address' },
                    { ...header_style, value: 'Diagnosis' },
                    { ...header_style, value: 'Medicines' },
                    { ...header_style, value: 'Lot Number' },
                    { ...header_style, value: 'No. of Prescribed Medicine' },
                    { ...header_style, value: 'No. of Dispensed Medicine' },
                    { ...header_style, value: 'Unit Price' },
                    { ...header_style, value: 'Total Unit Cost' },
                    { ...header_style, value: 'Category' },
                    { ...header_style, value: 'Remarks' }
                ]
            ]

            const data_style = {
                align: 'center',
                alignVertical: 'center',
                borderColor: '#000000',
                type: String,
                wrap: true
            }
            
            const grouped = {};
            this.tbl_items.forEach(item => {
                if (!grouped[item.transaction_number]) grouped[item.transaction_number] = [];
                grouped[item.transaction_number].push(item);
            });

            let data = [];

            for (const transaction in grouped) {
                const groupItems = grouped[transaction];

                data.push([
                    { ...data_style, fontWeight: 'bold', colSpan: 13, value: `Transaction Number: ${transaction}` }
                ]);

                groupItems.forEach((element, index) => {
                    data.push([
                        { ...data_style, value: index === 0 ? element.date : '' },
                        { ...data_style, value: index === 0 ? element.patient_name : '' },
                        { ...data_style, value: index === 0 ? element.age : '' },
                        { ...data_style, value: index === 0 ? element.address : '' },
                        { ...data_style, value: index === 0 ? element.diagnosis : '' },
                        { ...data_style, value: element.medicines },
                        { ...data_style, value: element.lot_no },
                        { ...data_style, value: element.total_prescribed_medicine },
                        { ...data_style, value: element.total_dispensed_medicine },
                        { ...data_style, value: element.unit_price },
                        { ...data_style, value: element.total_unit_cost },
                        { ...data_style, backgroundColor: element.category === 'Complete' ? '#A5D6A7' : '#EF9A9A', value: element.category },
                        { ...data_style, value: element.remarks }
                    ]);
                });
            }

            const rows = [...header, ...data];

            this.$excel_file(rows, {
                columns: Array(13).fill({ width: 30 }),
                fileName: `${this.$store.state.prv_data.provider_name} Medicine Consumption Report ${this.$moment().format('MM-DD-YYYY')}.xlsx`
            });
        },

        changeReportView() {
            if (!this.show_main_report) {
                this.$refs.reports_by_year.clearReports();
            } else {
                this.$refs.reports_by_year.generateReportByYear();
            }
            this.show_main_report = !this.show_main_report
        },

        //DATE RANGE FILTER RESULT
        getMedicineComsuptionDateRange() { 
            if (this.$refs.med_report_filter.validate()) {
                this.filtered_tbl_items = this.tbl_items.filter(item => {
                    const date = new Date(item.date);
                    const parse_date = date.toISOString().split('T')[0]
                    return parse_date >= this.start_date && parse_date <= this.end_date
                })  
            }
        },
    }
}
</script>