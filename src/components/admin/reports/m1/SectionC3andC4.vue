<template>
    <div id="content">
        <Header @loadSelectedDate="getSectionC3andC4Data" @exportExcel="exportExcel" @filters="setSelectedFilter" />
    
    <table class="text-center body-2 mt-4" cellspacing="0">
       <tr class="white--text darken-3 blue">
                <td style="width: 21%">
                    <h6 class="font-weight-medium body-2">Indicators</h6>
                    <h6 class="body-2">(Col. 1)</h6>
                </td>
                <td style="width: 6%">
                    <h6 class="font-weight-medium body-2">Male</h6>
                    <h6 class="body-2">(Col. 2)</h6>
                </td>
                <td style="width: 6%">
                    <h6 class="font-weight-medium body-2">Female</h6>
                    <h6 class="body-2">(Col. 3)</h6>
                </td>
                <td style="width: 6%">
                    <h6 class="font-weight-medium body-2">Total</h6>
                    <h6 class="body-2">(Col. 4)</h6>
                </td>
                <td style="width: 11%">
                    <h6 class="font-weight-medium body-2">Remarks</h6>
                    <h6 class="body-2">(Col. 5)</h6>
                </td>
                <td style="width: 20%">
                    <h6 class="font-weight-medium body-2">Indicators</h6>
                    <h6 class="body-2">(Col. 1)</h6>
                </td>
                <td style="width: 6%">
                    <h6 class="font-weight-medium body-2">Male</h6>
                    <h6 class="body-2">(Col. 2)</h6>
                </td>
                <td style="width: 6%">
                    <h6 class="font-weight-medium body-2">Female</h6>
                    <h6 class="body-2">(Col. 3)</h6>
                </td>
                <td style="width: 6%">
                    <h6 class="font-weight-medium body-2">Total</h6>
                    <h6 class="body-2">(Col. 4)</h6>
                </td>
                <td>
                    <h6 class="font-weight-medium body-2">Remarks</h6>
                    <h6 class="body-2">(Col. 5)</h6>
                </td>
            </tr>

     <template v-if="!loading_data">
            <tr>
                <td class="font-weight-bold text-left" colspan="10">C3. Deworming Services for Infants, Children and Adolescents</td>
            </tr>
           
            <tr>
                <td class="font-weight-medium text-left">31. 1-19 y/o given 2 doses of deworming drug - Total</td>
                <td>{{ c3_data['c3_31']['Male'] }}</td>
                <td>{{ c3_data['c3_31']['Female'] }}</td>
                <td>{{ c3_data['c3_31']['Total'] }}</td>
                <td class="font-weight-medium" rowspan="2">MONTH OF JULY REPORT ONLY</td>
                <td class="font-weight-medium text-left">b. SAC, 5-9 y/o dewormed (2 doses)</td>
                <td>{{ c3_data['c3_31_b']['Male'] }}</td>
                <td>{{ c3_data['c3_31_b']['Female'] }}</td>
                <td>{{ c3_data['c3_31_b']['Total'] }}</td>
                <td class="font-weight-medium" rowspan="2">MONTH OF JULY REPORT ONLY</td>
            </tr>

             <tr>
                <td class="font-weight-medium text-left">a. PSAC, 1-4 y/o dewormed (2 doses)</td>
                <td>{{ c3_data['c3_31_a']['Male'] }}</td>
                <td>{{ c3_data['c3_31_a']['Female'] }}</td>
                <td>{{ c3_data['c3_31_a']['Total'] }}</td>
                <td class="font-weight-medium text-left">c. Adolescents, 10-19 y/o dewormed (2 doses)</td>
                <td>{{ c3_data['c3_31_c']['Male'] }}</td>
                <td>{{ c3_data['c3_31_c']['Female'] }}</td>
                <td>{{ c3_data['c3_31_c']['Total'] }}</td>
            </tr>

            <tr>
                <td class="font-weight-bold text-left" colspan="10">C4. Management of Sick Infants and Children</td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">32. Sick Infants 6-11 mos. old seen</td>
                <td>{{ c4_data['c4_32']['Male'] }}</td>
                <td>{{ c4_data['c4_32']['Female'] }}</td>
                <td>{{ c4_data['c4_32']['Total'] }}</td>
                <td rowspan="2"></td>
                <td class="font-weight-medium text-left">36. Diarrhea cases 0-59 months old seen</td>
                <td>{{ c4_data['c4_36']['Male'] }}</td>
                <td>{{ c4_data['c4_36']['Female'] }}</td>
                <td>{{ c4_data['c4_36']['Total'] }}</td>
                <td class="font-weight-medium" rowspan="3">DIARRHEA CASE SEEN RECEIVED ORS OR RECEIVED ORS WITH ZINC</td>
            </tr>

             <tr>
                <td class="font-weight-medium text-left">33. Sick Infants 6-11 mos. old received Vitamin A</td>
                <td>{{ c4_data['c4_33']['Male'] }}</td>
                <td>{{ c4_data['c4_33']['Female'] }}</td>
                <td>{{ c4_data['c4_33']['Total'] }}</td>
                <td class="font-weight-medium text-left">37. Diarrhea cases 0-59 months old received ORS</td>
                <td>{{ c4_data['c4_37']['Male'] }}</td>
                <td>{{ c4_data['c4_37']['Female'] }}</td>
                <td>{{ c4_data['c4_37']['Total'] }}</td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">34. Sick Children 12-59 mos. old seen</td>
                <td>{{ c4_data['c4_34']['Male'] }}</td>
                <td>{{ c4_data['c4_34']['Female'] }}</td>
                <td>{{ c4_data['c4_34']['Total'] }}</td>
                <td rowspan="3"></td>
                <td class="font-weight-medium text-left">38. Diarrhea cases 0-59 mos. received ORS w/ zinc</td>
                <td>{{ c4_data['c4_38']['Male'] }}</td>
                <td>{{ c4_data['c4_38']['Female'] }}</td>
                <td>{{ c4_data['c4_38']['Total'] }}</td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left" rowspan="2">35. Sick Children 12-59 mos. old received Vitamin A</td>
                <td rowspan="2">{{ c4_data['c4_35']['Male'] }}</td>
                <td rowspan="2">{{ c4_data['c4_35']['Female'] }}</td>
                <td rowspan="2">{{ c4_data['c4_35']['Total'] }}</td>
                <td class="font-weight-medium text-left">39. Pneumonia cases 0-59 mos. old seen</td>
                <td>{{ c4_data['c4_39']['Male'] }}</td>
                <td>{{ c4_data['c4_39']['Female'] }}</td>
                <td>{{ c4_data['c4_39']['Total'] }}</td>
                <td></td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">40. Pneumonia cases 0-59 mos. old completed treatment</td>
                <td>{{ c4_data['c4_40']['Male'] }}</td>
                <td>{{ c4_data['c4_40']['Female'] }}</td>
                <td>{{ c4_data['c4_40']['Total'] }}</td>
                <td></td>
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
    components:{
        Alert,
        Header
    },
    
    data() {
        return {
            loading_data: false,
            export_to_excel_data: [],
            provider_name: '',
            month: '',
            year: '',

            c3_data: {
                'c3_31': {},
                'c3_31_a': {},
                'c3_31_b': {},
                'c3_31_c': {}
            },

            c4_data: {
                'c4_32': {},
                'c4_33': {},
                'c4_34': {},
                'c4_35': {},
                'c4_36': {},
                'c4_37': {},
                'c4_38': {},
                'c4_39': {},
                'c4_40': {}
            },

            alert: {}
        }
    },

    methods: {
        async getSectionC3andC4Data(filter) {
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

            let response = await this.$services.getM1M2Report('_get_m1_deworming_management_infants.php', payload)

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                const getValue = (section, key) => {
                    if (key in response.data[section]) {
                        const result = response.data[section][key]
                        let male = 0
                        let female = 0

                        result.forEach(element => {
                            if (element.mem_gender === 'M') male = parseInt(element.Total)
                            else female = parseInt(element.Total)
                            
                        })

                        return {
                            'Male': male,
                            'Female': female,
                            'Total': male + female
                        }
                    } else {
                        return {
                            'Male': 0,
                            'Female': 0,
                            'Total': 0
                        }
                    }
                }

                this.c3_data['c3_31_a'] = getValue('C3', 'C3_31_a')
                this.c3_data['c3_31_b'] = getValue('C3', 'C3_31_b')
                this.c3_data['c3_31_c'] = getValue('C3', 'C3_31_c')
                this.c3_data['c3_31'] = {
                    'Male': this.c3_data['c3_31_a']['Male'] + this.c3_data['c3_31_b']['Male'] + this.c3_data['c3_31_c']['Male'],
                    'Female': this.c3_data['c3_31_a']['Female'] + this.c3_data['c3_31_b']['Female'] + this.c3_data['c3_31_c']['Female'],
                    'Total': this.c3_data['c3_31_a']['Total'] + this.c3_data['c3_31_b']['Total'] + this.c3_data['c3_31_c']['Total'] 
                }

                this.c4_data['c4_32'] = getValue('C4', 'C4_32')
                this.c4_data['c4_33'] = getValue('C4', 'C4_33')
                this.c4_data['c4_34'] = getValue('C4', 'C4_34')
                this.c4_data['c4_35'] = getValue('C4', 'C4_35')
                this.c4_data['c4_36'] = getValue('C4', 'C4_36')
                this.c4_data['c4_37'] = getValue('C4', 'C4_37')
                this.c4_data['c4_38'] = getValue('C4', 'C4_38')
                this.c4_data['c4_39'] = getValue('C4', 'C4_39')
                this.c4_data['c4_40'] = getValue('C4', 'C4_40')
                
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
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'Section C. Child Care and Services', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 50 },
                ]
            ]

            result.push([
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Indicators\n(Col. 1)', height: 80},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Male\n(Col. 2)', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Female\n(Col. 3)', height: 40 },
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Total\n(Col. 4)', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Remarks\n(Col. 5)', height: 40},

                { ...header_style, align: 'center', alignVertical: 'center', value: 'Indicators\n(Col. 1)', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Male\n(Col. 2)', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Female\n(Col. 3)', height: 40 },
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Total\n(Col. 4)', height: 40},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'Remarks\n(Col. 5)', height: 40},
            ])

            result.push([
                { ...header_style, align: 'center', alignVertical: 'center', value: 'C3. Deworming Services for Infants, Children and Adolescents', backgroundColor: '#ffffff', color: '#000000', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '31. 1-19 y/o given 2 doses of deworming drug - Total', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c3_data['c3_31']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c3_data['c3_31']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c3_data['c3_31']['Total'], height: 30},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: 'MONTH OF JULY REPORT ONLY', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: 'b. SAC, 5-9 y/o dewormed (2 doses)', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c3_data['c3_31_b']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c3_data['c3_31_b']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c3_data['c3_31_b']['Total'], height: 30},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: 'MONTH OF JULY REPORT ONLY', height: 30}
            ])
            
            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: 'a. PSAC, 1-4 y/o dewormed (2 doses)', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c3_data['c3_31_a']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c3_data['c3_31_a']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c3_data['c3_31_a']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: 'c. Adolescents, 10-19 y/o dewormed (2 doses)', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c3_data['c3_31_c']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c3_data['c3_31_c']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c3_data['c3_31_c']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...header_style, align: 'center', alignVertical: 'center', value: 'C4. Management of Sick Infants and Children', backgroundColor: '#ffffff', color: '#000000', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '32. Sick Infants 6-11 mos. old seen', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_32']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_32']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_32']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '36. Diarrhea cases 0-59 months old seen', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_36']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_36']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_36']['Total'], height: 30},
                { ...column_style, rowSpan: 3, align: 'center', alignVertical: 'center', value: 'DIARRHEA CASE SEEN RECEIVED ORS OR RECEIVED ORS WITH ZINC', height: 30}
            ])
            
            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '33. Sick Infants 6-11 mos. old received Vitamin A', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_33']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_33']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_33']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '37. Diarrhea cases 0-59 months old received ORS', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_33']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_33']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_33']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '34. Sick Children 12-59 mos. old seen', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_34']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_34']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_34']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '38. Diarrhea cases 0-59 mos. received ORS w/ zinc', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_38']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_38']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_38']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, rowSpan: 2, align: 'left', alignVertical: 'center', value: '35. Sick Children 12-59 mos. old received Vitamin A', height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.c4_data['c4_35']['Male'], height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.c4_data['c4_35']['Female'], height: 40 },
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.c4_data['c4_35']['Total'], height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '39. Pneumonia cases 0-59 mos. old seen', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_39']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_39']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_39']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '40. Pneumonia cases 0-59 mos. old completed treatment', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_40']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_40']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c4_data['c4_40']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
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
                        { width: 10 },
                        { width: 10 },
                        { width: 10 },
                        { width: 20 }
                    ],
                    fileName: `${file_name_facility} - Section C. Child Care and Services C3 and C4 ${report_period} - ${file_name_date}.xlsx`
                })
            }, 1000)
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