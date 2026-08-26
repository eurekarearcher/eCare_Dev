<template>
    <div id="content">
        <Header @loadSelectedDate="getSectionB1Data" @exportExcel="exportExcel" @filters="setSelectedFilter" />

        <table class="text-center body-2 mt-4" cellspacing="0">
            <tr>
                <td class="font-weight-medium body-1" colspan="25">Section B. Maternal Care and Services</td>
            </tr>
            
            <tr class="white--text darken-3 blue">
                <td style="width: 20%">
                    <h6 class="font-weight-medium body-2">Indicators</h6>
                    <h6 class="body-2">(Col. 1)</h6>
                </td>

                <td colspan="3">
                    <h6 class="font-weight-medium body-2">Age</h6>
                    <h6 class="body-2">(Col. 2)</h6>
                </td>

                <td rowspan="2">
                    <h6 class="font-weight-medium body-2">Total</h6>
                    <h6 class="body-2">(Col. 3)</h6>
                </td>

                <td rowspan="2">
                    <h6 class="font-weight-medium body-2">Remarks</h6>
                    <h6 class="body-2">(Col. 4)</h6>
                </td>

                <td rowspan="2" style="width: 15%">
                    <h6 class="font-weight-medium body-2">Indicators</h6>
                    <h6 class="body-2">(Col. 1)</h6>
                </td>

                <td colspan="3">
                    <h6 class="font-weight-medium body-2">Age</h6>
                    <h6 class="body-2">(Col. 2)</h6>
                </td>
                
                <td rowspan="2" style="width: 10%">
                    <h6 class="font-weight-medium body-2">Total</h6>
                    <h6 class="body-2">(Col. 3)</h6>
                </td>

                <td rowspan="2" style="width: 10%">
                    <h6 class="font-weight-medium body-2">Remarks</h6>
                    <h6 class="body-2">(Col. 4)</h6>
                </td>
            </tr>

            <tr class="font-weight-medium text-no-wrap white--text darken-3 blue">
                <td></td>
                <td>10-14</td>
                <td>15-19</td>
                <td>20-49</td>
                <td>10-14</td>
                <td>15-19</td>
                <td>20-49</td>
            </tr>

            <template v-if="!loading_data">
                <tr>
                    <td colspan="25">
                        <h6 class="font-weight-medium text-left body-1 pl-1">B1. Prenatal Care</h6>
                    </td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">1. No. of pregnant women w/ atleast 4 prenatal check-ups</td>
                    <td>{{ b1_data['b1_1']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_1']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_1']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_1']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">8. No. of pregnant women given one dose of deworming tablet</td>
                    <td>{{ b1_data['b1_8']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_8']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_8']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_8']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">2. No. of pregnant women assessed of their nutritional status during the  1st tri.</td>
                    <td>{{ b1_data['b1_2']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_2']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_2']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_2']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">9. No. of pregnant women screened for syphilis</td>
                    <td>{{ b1_data['b1_9']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_9']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_9']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_9']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">a. No. of pregnant women seen in the first trimester who have normal BMI</td>
                    <td>{{ b1_data['b1_2a']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_2a']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_2a']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_2a']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">10. No. of pregnant women tested positive for syphilis</td>
                    <td>{{ b1_data['b1_10']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_10']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_10']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_10']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">b. No. of pregnant women seen in the first trimester who have low BMI</td>
                    <td>{{ b1_data['b1_2b']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_2b']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_2b']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_2b']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">11. No. of pregnant women screened Hepatitis B</td>
                    <td>{{ b1_data['b1_11']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_11']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_11']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_11']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">c. No. of pregnant women seen in the first trimester who have high BMI</td>
                    <td>{{ b1_data['b1_2c']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_2c']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_2c']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_2c']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">12. No. of pregnant women tested positive for Hepatitis B</td>
                    <td>{{ b1_data['b1_12']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_12']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_12']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_12']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">3. No. of pregnant women for the first time give at least 2 doses of Td vaccination</td>
                    <td>{{ b1_data['b1_3']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_3']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_3']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_3']['Total'] }}</td>
                    <td class="font-weight-medium text-left">TD-1 __ TD-2 __</td>
                    <td class="font-weight-medium text-left">13. No. of pregnant women screened for HIV</td>
                    <td>{{ b1_data['b1_13']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_13']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_13']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_13']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">4. No. of pregnant women for the 2nd or more times give at least 3 doses of Td vaccination (Td2 Plus)</td>
                    <td>{{ b1_data['b1_4']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_4']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_4']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_4']['Total'] }}</td>
                    <td class="font-weight-medium text-left">TD-3 __ TD-4 __ TD-5 __ TD-6 __</td>
                    <td class="font-weight-medium text-left">14. No. of pregnant women tested for CBC or Hgb & Hct count</td>
                    <td>{{ b1_data['b1_14']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_14']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_14']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_14']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">5. No. of pregnant women who completed the dose of iron with folic acid supplementation(180TABLETS)</td>
                    <td>{{ b1_data['b1_5']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_5']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_5']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_5']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">15. No. of pregnant women tested for CBC or Hgb & Hct count diagnosed with anemia</td>
                    <td>{{ b1_data['b1_15']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_15']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_15']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_15']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">6. No. of pregnant women who completed doses of calcium carbonate supplementation (420-450TABLETS)</td>
                    <td>{{ b1_data['b1_6']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_6']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_6']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_6']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">16. No. of pregnant women screened for gestational diabetes</td>
                    <td>{{ b1_data['b1_16']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_16']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_16']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_16']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">7. No. of pregnant women given iodine capsules</td>
                    <td>{{ b1_data['b1_7']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_7']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_7']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_7']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">17. No. of pregnant women tested positive for gestational diabetes</td>
                    <td>{{ b1_data['b1_17']['10 - 14 years'] }}</td>
                    <td>{{ b1_data['b1_17']['15 - 19 years'] }}</td>
                    <td>{{ b1_data['b1_17']['20 - 49 years'] }}</td>
                    <td>{{ b1_data['b1_17']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-left">
                        <h6 class="font-weight-medium body-2">AP Registered</h6>
                        <h6 class="font-weight-medium body-2">(PLEASE TIC PER AGE FOR TEEN AGE)</h6>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <v-row dense>
                            <v-col v-for="count in 10" :key="count" class="font-weight-medium" cols="3" lg="3" xl="3">{{ count + 9 }}:__</v-col>
                        </v-row>
                    </td>
                </tr>
            </template>
        </table>

        <div v-show="loading_data" class="text-center" style="border: 1px solid lightgrey">
            <v-progress-linear color="primary" size="30" indeterminate></v-progress-linear>
            <h4 class="text--secondary body-2 my-5">Loading Data... Please wait...</h4>
        </div>

        <br>
        <Alert :alert="alert" />
    </div>
</template>

<script>
import Alert from '@/components/Alert'
import Header from '@/components/admin/reports/m1/Header'

export default {
    components: {
        Alert,
        Header
    },

    data() {
        return {
            export_to_excel_data: [],
            provider_name: '',
            selectedFilterType: null,
            month: null,
            year: null,
            selectedQuarter: null,
            selectedQuarterYear: null,

            loading_data: false,
            b1_data: {
                'b1_1': {},
                'b1_2': {},
                'b1_2a': {},
                'b1_2b': {},
                'b1_2c': {},
                'b1_3': {},
                'b1_4': {},
                'b1_5': {},
                'b1_6': {},
                'b1_7': {},
                'b1_8': {},
                'b1_9': {},
                'b1_10': {},
                'b1_11': {},
                'b1_12': {},
                'b1_13': {},
                'b1_14': {},
                'b1_15': {},
                'b1_16': {},
                'b1_17': {}
            },
            alert: {}
        }
    },

    methods: {
        async getSectionB1Data(filter) {
            this.loading_data = true

            let key = ''
            let provider_code = ''

            if (filter.provider.prv_name === 'ALL') {
                key = this.$store.state.usr_credentials.provider_reg_type
                provider_code = this.$store.state.prv_data.provider_code
            } else {
                key = filter.provider.prv_type,
                provider_code = filter.provider.provider_code
            }

            this.provider_name = filter.provider.prv_name

            let payload = {
                key: key,  
                provider_code: provider_code, 
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
            };

            if (filter.request_key === 'monthly') {
                payload.request_key = filter.request_key
                payload.month = filter.month
                payload.year = filter.year
            } else if (filter.request_key === 'quarterly') {
                payload.request_key = filter.request_key
                payload.quarter = filter.quarter
                payload.year = filter.year
            } else if (filter.request_key === 'annually') {
                payload.request_key = filter.request_key
                payload.year = filter.year
            }

            let response = await this.$services.getM1M2Report('_get_m1_prenatal_care.php', payload)

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                const getValue = (key) => {
                    if (key in response.data.B1) {
                        const result = response.data.B1[key][0]

                        return {
                            '10 - 14 years': parseInt(result['10 - 14 years']),
                            '15 - 19 years': parseInt(result['15 - 19 years']),
                            '20 - 49 years': parseInt(result['20 - 49 years']),
                            'Total': parseInt(result['Total'])
                        }
                    } else {
                        return {
                            '10 - 14 years': 0,
                            '15 - 19 years': 0,
                            '20 - 49 years': 0,
                            'Total': 0
                        }
                    }
                }

                this.b1_data['b1_1'] = getValue('prenatal_consultation')
                this.b1_data['b1_2a'] = getValue('normal_bmi')
                this.b1_data['b1_2b'] = getValue('low_bmi')
                this.b1_data['b1_2c'] = getValue('high_bmi')
                this.b1_data['b1_2'] = {
                    '10 - 14 years': this.b1_data['b1_2a']['10 - 14 years'] + this.b1_data['b1_2b']['10 - 14 years'] + this.b1_data['b1_2c']['10 - 14 years'],
                    '15 - 19 years': this.b1_data['b1_2a']['15 - 19 years'] + this.b1_data['b1_2b']['15 - 19 years'] + this.b1_data['b1_2c']['15 - 19 years'],
                    '20 - 49 years': this.b1_data['b1_2a']['20 - 49 years'] + this.b1_data['b1_2b']['20 - 49 years'] + this.b1_data['b1_2c']['20 - 49 years'],
                    'Total': this.b1_data['b1_2a']['Total'] + this.b1_data['b1_2b']['Total'] + this.b1_data['b1_2c']['Total']
                }
                
                this.b1_data['b1_3'] = getValue('B1_03')
                this.b1_data['b1_4'] = getValue('B1_04')
                this.b1_data['b1_5'] = getValue('prenatal_folic_acid')
                this.b1_data['b1_6'] = getValue('prenatal_carbonate')
                this.b1_data['b1_7'] = getValue('prenatal_iodine')
                this.b1_data['b1_8'] = getValue('given_one_dose_of_deworming_tablet')
                this.b1_data['b1_9'] = getValue('screened_for_syphillis')
                this.b1_data['b1_10'] = getValue('tested_positive_for_syphilis')
                this.b1_data['b1_11'] = getValue('screened_for_hepatitis_b')
                this.b1_data['b1_12'] = getValue('tested_positive_for_hepatitis_b')
                this.b1_data['b1_13'] = getValue('screened_for_hiv')
                this.b1_data['b1_14'] = getValue('tested_for_cbc_or_hgb_&_hct_count')
                this.b1_data['b1_15'] = getValue('tested_for_cbc_or_hgb_&_hct_count_and_diagnosed_with_anemia')
                this.b1_data['b1_16'] = getValue('screened_for_gestational_diabetes')
                this.b1_data['b1_17'] = getValue('tested_positive_for_gestational_diabetes')

                this.loading_data = false
            } else {
                this.alert = response.error
            }
        },

        setSelectedFilter(data) {
            this.selected_filter_type = data.selected_filter_type
            this.month = data.month
            this.year = data.year
            this.selected_annual = data.annual
            this.selected_quarter = data.quarter
            this.selected_quarter_year = data.quarter_year
        },

        exportExcel() {
            let header_style = {
                    align: 'center',
                    alignVertical: 'center',
                    backgroundColor: '#1565c0', 
                    borderColor: '#ffffff',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    wrap: true
            }

            let column_style = {
                align: 'right',
                alignVertical: 'right',
                backgroundColor: '#ffffff', 
                borderColor: '#000000',
                color: '#000000',
                wrap: true
            }

            let result = [
                [
                    { ...header_style, span: 12, align: 'center', alignVertical: 'center', value: 'Section B. Maternal Care and Services', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                ]
            ]

            result.push([
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Indicators\n(Col. 1)', height: 80},
                { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Age\n(Col. 2)', height: 40 },
                { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Total \n (Col. 3)', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Remarks\n(Col. 4)', height: 40},

                { ...header_style, align: 'center', alignVertical: 'center', value: 'Indicators\n(Col. 1)', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Age\n(Col. 2)', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Total\n(Col. 3)', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Remarks\n(Col. 4)', height: 40}
            ])

            result.push([
                { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 25},
                { ...header_style, align: 'center', alignVertical: 'center', value: '10-14', height: 25},
                { ...header_style, align: 'center', alignVertical: 'center', value: '15-19', height: 25},
                { ...header_style, align: 'center', alignVertical: 'center', value: '20-49', height: 25},
                { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 25},
                { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 25},


                { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 25},
                { ...header_style, align: 'center', alignVertical: 'center', value: '10-14', height: 25},
                { ...header_style, align: 'center', alignVertical: 'center', value: '15-19', height: 25},
                { ...header_style, align: 'center', alignVertical: 'center', value: '20-49', height: 25},
                { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 25},
                { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 25},

            ])
            
            result.push([
                { ...header_style, align: 'center', alignVertical: 'center', value: 'B1. Prenatal Care', backgroundColor: '#ffffff', color: '#000000', height: 40}
            ])
            
            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '1. No. of pregnant women w/ atleast 4 prenatal check-ups', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_1']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_1']['15 - 19 years'], height: 60 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_1']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_1']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},

                { ...column_style, align: 'left', alignVertical: 'center', value: '8. No. of pregnant women given one dose of deworming tablet', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_8']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_8']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_8']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_8']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '2. No. of pregnant women assessed of their nutritional status during the 1st tri.', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},

                { ...column_style, align: 'left', alignVertical: 'center', value: '9. No. of pregnant women screened for syphilis', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_9']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_9']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_9']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_9']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: 'a. No. of pregnant women seen in the first trimester who have normal BMI', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2a']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2a']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2a']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2a']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},

                { ...column_style, align: 'left', alignVertical: 'center', value: '10. No. of pregnant women tested positive for syphilis', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_10']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_10']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_10']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_10']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: 'b. No. of pregnant women seen in the first trimester who have low BMI', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2b']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2b']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2b']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2b']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},

                { ...column_style, align: 'left', alignVertical: 'center', value: '11. No. of pregnant women screened Hepatitis B', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_11']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_11']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_11']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_11']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: 'c. No. of pregnant women seen in the first trimester who have high BMI', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2c']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2c']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2c']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_2c']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},

                { ...column_style, align: 'left', alignVertical: 'center', value: '12. No. of pregnant women tested positive for Hepatitis B', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_12']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_12']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_12']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_12']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '3. No. of pregnant women for the first time give at least 2 doses of Td vaccination', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_3']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_3']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_3']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_3']['Total'], height: 60},
                { ...column_style, align: 'left', alignVertical: 'center', value: 'TD-1 __ TD-2 __', height: 60},

                { ...column_style, align: 'left', alignVertical: 'center', value: '13. No. of pregnant women screened for HIV', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_13']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_13']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_13']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_13']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '4. No. of pregnant women for the 2nd or more times give at least 3 doses of Td vaccination (Td2 Plus)', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_4']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_4']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_4']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_4']['Total'], height: 60},
                { ...column_style, align: 'left', alignVertical: 'center', value: 'TD-3 __ TD-4 __ TD-5 __ TD-6 __', height: 60},

                { ...column_style, align: 'left', alignVertical: 'center', value: '14. No. of pregnant women tested for CBC or Hgb & Hct count', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_14']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_14']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_14']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_14']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '5. No. of pregnant women who completed the dose of iron with folic acid supplementation(180TABLETS)', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_5']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_5']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_5']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_5']['Total'], height: 60},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 60},

                { ...column_style, align: 'left', alignVertical: 'center', value: '15. No. of pregnant women tested for CBC or Hgb & Hct count diagnosed with anemia', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_15']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_15']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_15']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_15']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '6. No. of pregnant women who completed doses of calcium carbonate supplementation (420-450TABLETS)', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_6']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_6']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_6']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_6']['Total'], height: 60},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 60},

                { ...column_style, align: 'left', alignVertical: 'center', value: '16. No. of pregnant women screened for gestational diabetes', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_16']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_16']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_16']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_16']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '7. No. of pregnant women given iodine capsules', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_7']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_7']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_7']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_7']['Total'], height: 60},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 60},

                { ...column_style, align: 'left', alignVertical: 'center', value: '17. No. of pregnant women tested positive for gestational diabetes', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_17']['10 - 14 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_17']['15 - 19 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_17']['20 - 49 years'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b1_data['b1_17']['Total'], height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 60},

                { ...column_style, align: 'left', alignVertical: 'center', value: 'AP Registered (PLEASE TIC PER AGE FOR TEEN AGE)', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 60},
                { ...column_style, align: 'left', alignVertical: 'center', value: '10:__11:__12:__13:__14:__15:__16:__17:__18:__19:__', height: 60}
            ])

            this.export_to_excel_data = result

            setTimeout(() => {
                this.generate_excel_loader = false
                let report_period = '';

                switch (this.selected_filter_type) {
                    case 'monthly':
                        report_period = this.getMonthByNumber(this.month) + " - " + this.year; 
                        break;
                    
                    case 'quarterly':
                        report_period = "Quarter " + this.selected_quarter + " - " + this.selected_quarter_year;
                        break;

                    case 'annually':
                        report_period = this.selected_annual;
                        break;

                    default:
                        console.error("Unknown filter type");
                        return;
                }

                const file_name_date = this.$moment().format('MM-DD-YYYY');
                const file_name_facility = this.$store.state.prv_data.provider_name;
                
                this.$excel_file(this.export_to_excel_data, {
                    columns: [
                        { width: 30 },
                        { width: 10 },
                        { width: 10 },
                        { width: 10 },
                        { width: 20 },
                        { width: 30 },
                        { width: 30 },
                        { width: 10 },
                        { width: 10 },
                        { width: 10 },
                        { width: 20 },
                        { width: 30 },
                    ],
                    
                    fileName: `${file_name_facility} - B1. Prenatal Care ${report_period} - ${file_name_date}.xlsx`
                })
            }, 300)
        }
    }
}
</script>

<style scoped>
table { width: 100%; }
table, th, td { 
    border-collapse: separate; 
    border: 1px solid lightgrey; 
}
td { padding: 5px; }
#content {
    overflow-x: auto; 
    overflow-y: hidden; 
}
#content table { min-width: 1400px; }
.cell-background {
    background: #1565C0;
    color: white
}
</style>