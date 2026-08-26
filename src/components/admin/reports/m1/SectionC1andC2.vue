<template>
    <div id="content">
        <Header @loadSelectedDate="getSectionC1andC2Data" @exportExcel="exportExcel" @filters="setSelectedFilter" />

        <table class="text-center body-2 mt-4" cellspacing="0">
            <tr>
                <td class="font-weight-medium body-1" colspan="25">Section C. Child Care and Services</td>
            </tr>

            <tr class="white--text darken-3 blue">
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
                    <td class="font-weight-bold text-left" colspan="10">C1. Immunization Services for Newborns, Infants and School-Aged Children/Adolescents</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left ">1. CPAB</td>
                    <td>{{ c1_data['c1_1']['Male'] }}</td>
                    <td>{{ c1_data['c1_1']['Female'] }}</td>
                    <td>{{ c1_data['c1_1']['Total'] }}</td>
                    <td rowspan="11"></td>
                    <td class="font-weight-medium text-left">11. PCV 1</td>
                    <td>{{ c1_data['c1_11']['Male'] }}</td>
                    <td>{{ c1_data['c1_11']['Female'] }}</td>
                    <td>{{ c1_data['c1_11']['Total'] }}</td>
                    <td class="font-weight-medium text-left body-2" rowspan="2">
                        <span class="font-weight-medium ">MCV-2 13-15 MOS</span>
                        <br>
                        <span class="font-weight-medium">MALE: ___ FEMALE: ___</span>
                    </td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">2. BCG</td>
                    <td>{{ c1_data['c1_2']['Male'] }}</td>
                    <td>{{ c1_data['c1_2']['Female'] }}</td>
                    <td>{{ c1_data['c1_2']['Total'] }}</td>
                    <td class="font-weight-medium text-left">12. PCV 2</td>
                    <td>{{ c1_data['c1_12']['Male'] }}</td>
                    <td>{{ c1_data['c1_12']['Female'] }}</td>
                    <td>{{ c1_data['c1_12']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">3. HepB, within 24 hours</td>
                    <td>{{ c1_data['c1_3a']['Male'] }}</td>
                    <td>{{ c1_data['c1_3a']['Female'] }}</td>
                    <td>{{ c1_data['c1_3a']['Total'] }}</td>
                    <td class="font-weight-medium text-left">13. PCV 3</td>
                    <td>{{ c1_data['c1_13']['Male'] }}</td>
                    <td>{{ c1_data['c1_13']['Female'] }}</td>
                    <td>{{ c1_data['c1_13']['Total'] }}</td>
                    <td class="font-weight-medium text-left body-2" rowspan="4">
                        <span class="font-weight-medium  d-block">MCV-2 16-23 MOS</span>
                        <span class="font-weight-medium d-block mb-2">MALE: ___ FEMALE: ___</span>
                        <span class="font-weight-medium  d-block">MCV-2 24-59 MOS</span>
                        <span class="font-weight-medium d-block">MALE: ___ FEMALE: ___</span>
                    </td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left pl-5">HepB, more than 24 hours</td>
                    <td>{{ c1_data['c1_3b']['Male'] }}</td>
                    <td>{{ c1_data['c1_3b']['Female'] }}</td>
                    <td>{{ c1_data['c1_3b']['Total'] }}</td>
                    <td class="font-weight-medium text-left">14. MCV 1</td>
                    <td>{{ c1_data['c1_14']['Male'] }}</td>
                    <td>{{ c1_data['c1_14']['Female'] }}</td>
                    <td>{{ c1_data['c1_14']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">4. DPT-HiB-HepB 1</td>
                    <td>{{ c1_data['c1_4']['Male'] }}</td>
                    <td>{{ c1_data['c1_4']['Female'] }}</td>
                    <td>{{ c1_data['c1_4']['Total'] }}</td>
                    <td class="font-weight-medium text-left ">15. MCV 2</td>
                    <td>{{ c1_data['c1_15']['Male'] }}</td>
                    <td>{{ c1_data['c1_15']['Female'] }}</td>
                    <td>{{ c1_data['c1_15']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">5. DPT-HiB-HepB 2</td>
                    <td>{{ c1_data['c1_5']['Male'] }}</td>
                    <td>{{ c1_data['c1_5']['Female'] }}</td>
                    <td>{{ c1_data['c1_5']['Total'] }}</td>
                    <td class="font-weight-medium text-left ">16. FIC</td>
                    <td>{{ c1_data['c1_16']['Male'] }}</td>
                    <td>{{ c1_data['c1_16']['Female'] }}</td>
                    <td>{{ c1_data['c1_16']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">6. DPT-HiB-HepB 3</td>
                    <td>{{ c1_data['c1_6']['Male'] }}</td>
                    <td>{{ c1_data['c1_6']['Female'] }}</td>
                    <td>{{ c1_data['c1_6']['Total'] }}</td>
                    <td class="font-weight-medium text-left">17. CIC</td>
                    <td>{{ c1_data['c1_17']['Male'] }}</td>
                    <td>{{ c1_data['c1_17']['Female'] }}</td>
                    <td>{{ c1_data['c1_17']['Total'] }}</td>
                    <td class="font-weight-medium text-left body-2" rowspan="2">
                        <span class="font-weight-medium ">PENTA 13-15 MOS</span>
                        <br>
                        <span class="font-weight-medium">MALE: ___ FEMALE: ___</span>
                    </td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">7. OPV 1</td>
                    <td>{{ c1_data['c1_7']['Male'] }}</td>
                    <td>{{ c1_data['c1_7']['Female'] }}</td>
                    <td>{{ c1_data['c1_7']['Total'] }}</td>
                    <td class="font-weight-medium text-left">18. Td, Grade 1</td>
                    <td>{{ c1_data['c1_18']['Male'] }}</td>
                    <td>{{ c1_data['c1_18']['Female'] }}</td>
                    <td>{{ c1_data['c1_18']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">8. OPV 2</td>
                    <td>{{ c1_data['c1_8']['Male'] }}</td>
                    <td>{{ c1_data['c1_8']['Female'] }}</td>
                    <td>{{ c1_data['c1_8']['Total'] }}</td>
                    <td class="font-weight-medium text-left">19. MR, Grade 1</td>
                    <td>{{ c1_data['c1_19']['Male'] }}</td>
                    <td>{{ c1_data['c1_19']['Female'] }}</td>
                    <td>{{ c1_data['c1_19']['Total'] }}</td>
                    <td class="font-weight-medium text-left body-2" rowspan="2">
                        <span class="font-weight-medium ">PENTA 16-23 MOS</span>
                        <br>
                        <span class="font-weight-medium">MALE: ___ FEMALE: ___</span>
                    </td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">9. OPV 3</td>
                    <td>{{ c1_data['c1_9']['Male'] }}</td>
                    <td>{{ c1_data['c1_9']['Female'] }}</td>
                    <td>{{ c1_data['c1_9']['Total'] }}</td>
                    <td class="font-weight-medium text-left">20. Td, Grade 7</td>
                    <td>{{ c1_data['c1_20']['Male'] }}</td>
                    <td>{{ c1_data['c1_20']['Female'] }}</td>
                    <td>{{ c1_data['c1_20']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">10. IPV</td>
                    <td>{{ c1_data['c1_10']['Male'] }}</td>
                    <td>{{ c1_data['c1_10']['Female'] }}</td>
                    <td>{{ c1_data['c1_10']['Total'] }}</td>
                    <td class="font-weight-medium text-left">21. MR, Grade 7</td>
                    <td>{{ c1_data['c1_21']['Male'] }}</td>
                    <td>{{ c1_data['c1_21']['Female'] }}</td>
                    <td>{{ c1_data['c1_21']['Total'] }}</td>
                    <td class="font-weight-medium text-left ">REMARKS</td>
                </tr>

                <tr class="white--text darken-3 blue">
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

                <tr>
                    <td class="font-weight-bold text-left" colspan="10">C2. Nutrition Services for Infants and Children</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">22. Newborns initiated on breastfeeding immediately after birth lasting to 90 mins</td>
                    <td>{{ c2_data['c2_22']['Male'] }}</td>
                    <td>{{ c2_data['c2_22']['Female'] }}</td>
                    <td>{{ c2_data['c2_22']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">30. Children 12-23 mos. who completed MNP supplementation</td>
                    <td>{{ c2_data['c2_30']['Male'] }}</td>
                    <td>{{ c2_data['c2_30']['Female'] }}</td>
                    <td>{{ c2_data['c2_30']['Total'] }}</td>
                    <td class="font-weight-medium " rowspan="11">MONTH OF MARCH REPORTING</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">23. Preterm/LBW infants given iron supplementation</td>
                    <td>{{ c2_data['c2_23']['Male'] }}</td>
                    <td>{{ c2_data['c2_23']['Female'] }}</td>
                    <td>{{ c2_data['c2_23']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">31. Children 0-59 mos. Seen</td>
                    <td>{{ c2_data['c2_31']['Male'] }}</td>
                    <td>{{ c2_data['c2_31']['Female'] }}</td>
                    <td>{{ c2_data['c2_31']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">24. Infants exclusively breastfed until 6th month</td>
                    <td>{{ c2_data['c2_24']['Male'] }}</td>
                    <td>{{ c2_data['c2_24']['Female'] }}</td>
                    <td>{{ c2_data['c2_24']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">a. Stunted</td>
                    <td>{{ c2_data['c2_31a']['Male'] }}</td>
                    <td>{{ c2_data['c2_31a']['Female'] }}</td>
                    <td>{{ c2_data['c2_31a']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">25. Infants 6 mos. old initiated to complementary feeding with continued breastfeeding</td>
                    <td>{{ c2_data['c2_25']['Male'] }}</td>
                    <td>{{ c2_data['c2_25']['Female'] }}</td>
                    <td>{{ c2_data['c2_25']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">b. Wasted</td>
                    <td>{{ c2_data['c2_31b']['Male'] }}</td>
                    <td>{{ c2_data['c2_31b']['Female'] }}</td>
                    <td>{{ c2_data['c2_31b']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">26. Infants 6 mos. old initiated to complementary feeding but no longer or never been breastfed</td>
                    <td>{{ c2_data['c2_26']['Male'] }}</td>
                    <td>{{ c2_data['c2_26']['Female'] }}</td>
                    <td>{{ c2_data['c2_26']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left pl-4">b.1. Wasted-MAM</td>
                    <td>{{ c2_data['c2_31b1']['Male'] }}</td>
                    <td>{{ c2_data['c2_31b1']['Female'] }}</td>
                    <td>{{ c2_data['c2_31b1']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">27. Infants 6-11 mos. old given 1 dose of Vitamin A 100,000 I.U.</td>
                    <td>{{ c2_data['c2_27']['Male'] }}</td>
                    <td>{{ c2_data['c2_27']['Female'] }}</td>
                    <td>{{ c2_data['c2_27']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left pl-4">b.2. Wasted-SAM</td>
                    <td>{{ c2_data['c2_31b2']['Male'] }}</td>
                    <td>{{ c2_data['c2_31b2']['Female'] }}</td>
                    <td>{{ c2_data['c2_31b2']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">28. Infants 12-59 mos. old given <span class="">2 doses of Vitamin A 200,000 I.U.</span></td>
                    <td>{{ c2_data['c2_28']['Male'] }}</td>
                    <td>{{ c2_data['c2_28']['Female'] }}</td>
                    <td>{{ c2_data['c2_28']['Total'] }}</td>
                    <td class="font-weight-medium ">MONTH OF OCTOBER REPORT ONLY</td>
                    <td class="font-weight-medium text-left">c. Overweight/Obese</td>
                    <td>{{ c2_data['c2_31c']['Male'] }}</td>
                    <td>{{ c2_data['c2_31c']['Female'] }}</td>
                    <td>{{ c2_data['c2_31c']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">29. Infants 6-11 months old who completed MNP supplementation</td>
                    <td>{{ c2_data['c2_29']['Male'] }}</td>
                    <td>{{ c2_data['c2_29']['Female'] }}</td>
                    <td>{{ c2_data['c2_29']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">d. Normal</td>
                    <td>{{ c2_data['c2_31d']['Male'] }}</td>
                    <td>{{ c2_data['c2_31d']['Female'] }}</td>
                    <td>{{ c2_data['c2_31d']['Total'] }}</td>
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
            loading_data: false,
            export_to_excel_data: [],
            provider_name: '',
            month: '',
            year: '',

            c1_data: {
                'c1_1': {},
                'c1_2': {},
                'c1_3a': {},
                'c1_3b': {},
                'c1_4': {},
                'c1_5': {},
                'c1_6': {},
                'c1_7': {},
                'c1_8': {},
                'c1_9': {},
                'c1_10': {},
                'c1_11': {},
                'c1_12': {},
                'c1_13': {},
                'c1_14': {},
                'c1_15': {},
                'c1_16': {},
                'c1_17': {},
                'c1_18': {},
                'c1_19': {},
                'c1_20': {},
                'c1_21': {}
            },
            c2_data: {
                'c2_22': {},
                'c2_23': {},
                'c2_24': {},
                'c2_25': {},
                'c2_26': {},
                'c2_27': {},
                'c2_28': {},
                'c2_29': {},
                'c2_30': {},
                'c2_31': {},
                'c2_31a': {},
                'c2_31b': {},
                'c2_31b1': {},
                'c2_31b2': {},
                'c2_31c': {},
                'c2_31d': {}
            },
            alert: {}
        }
    },

    methods: {
        async getSectionC1andC2Data(filter) {
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

            let response = await this.$services.getM1M2Report('_get_m1_immunization_services.php', payload);

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

                this.c1_data['c1_1'] = getValue('c1', 'c1_1')
                this.c1_data['c1_2'] = getValue('c1', 'c1_2')
                this.c1_data['c1_3a'] = getValue('c1', 'c1_3a')
                this.c1_data['c1_3b'] = getValue('c1', 'c1_3b')
                this.c1_data['c1_4'] = getValue('c1', 'c1_4')
                this.c1_data['c1_5'] = getValue('c1', 'c1_5')
                this.c1_data['c1_6'] = getValue('c1', 'c1_6')
                this.c1_data['c1_7'] = getValue('c1', 'c1_7')
                this.c1_data['c1_8'] = getValue('c1', 'c1_8')
                this.c1_data['c1_9'] = getValue('c1', 'c1_9')
                this.c1_data['c1_10'] = getValue('c1', 'c1_10')
                this.c1_data['c1_11'] = getValue('c1', 'c1_11')
                this.c1_data['c1_12'] = getValue('c1', 'c1_12')
                this.c1_data['c1_13'] = getValue('c1', 'c1_13')
                this.c1_data['c1_14'] = getValue('c1', 'c1_14')
                this.c1_data['c1_15'] = getValue('c1', 'c1_15')
                this.c1_data['c1_16'] = getValue('c1', 'c1_16')
                this.c1_data['c1_17'] = getValue('c1', 'c1_17')
                this.c1_data['c1_18'] = getValue('c1', 'c1_18')
                this.c1_data['c1_19'] = getValue('c1', 'c1_19')
                this.c1_data['c1_20'] = getValue('c1', 'c1_20')
                this.c1_data['c1_21'] = getValue('c1', 'c1_21')

                // this.c2_data['c2_22'] = getValue('c2', '')
                // this.c2_data['c2_23'] = getValue('c2', '')
                // this.c2_data['c2_24'] = getValue('c2', '')
                // this.c2_data['c2_25'] = getValue('c2', '')
                // this.c2_data['c2_26'] = getValue('c2', '')
                this.c2_data['c2_27'] = getValue('c2', 'C2_27')
                this.c2_data['c2_28'] = getValue('c2', 'C2_28')
                this.c2_data['c2_29'] = getValue('c2', 'C2_29')
                this.c2_data['c2_30'] = getValue('c2', 'C2_30')                
                this.c2_data['c2_31a'] = getValue('c2', 'stunted')
                this.c2_data['c2_31b1'] = getValue('c2', 'wasted-mam')
                this.c2_data['c2_31b2'] = getValue('c2', 'wasted-sam')
                this.c2_data['c2_31b'] = {
                    'Male': this.c2_data['c2_31b1']['Male'] + this.c2_data['c2_31b2']['Male'],
                    'Female': this.c2_data['c2_31b1']['Female'] + this.c2_data['c2_31b2']['Female'],
                    'Total': this.c2_data['c2_31b1']['Total'] + this.c2_data['c2_31b2']['Total']
                }
                this.c2_data['c2_31c'] = getValue('c2', 'Overweight/Obese')
                this.c2_data['c2_31d'] = getValue('c2', 'Normal')
                this.c2_data['c2_31'] = {
                    'Male': this.c2_data['c2_31a']['Male'] + this.c2_data['c2_31b']['Male'] + this.c2_data['c2_31c']['Male'] + this.c2_data['c2_31d']['Male'],
                    'Female': this.c2_data['c2_31a']['Female'] + this.c2_data['c2_31b']['Female'] + this.c2_data['c2_31c']['Female'] + this.c2_data['c2_31d']['Female'],
                    'Total': this.c2_data['c2_31a']['Total'] + this.c2_data['c2_31b']['Total'] + this.c2_data['c2_31c']['Total'] + this.c2_data['c2_31d']['Total']
                }

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
                    { ...header_style, span: 10, align: 'center', alignVertical: 'center', value: 'Section C. Child Care and Services ', backgroundColor: '#ffffff', color: '#000000', height: 50 },
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
                { ...header_style, align: 'center', alignVertical: 'center', value: 'C1. Immunization Services for Newborns, Infants and School-Aged Children/Adolescents', backgroundColor: '#ffffff', color: '#000000', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '1. CPAB', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_1']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_1']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_1']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '11. PCV 1', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_11']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_11']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_11']['Total'], height: 30},
                { ...column_style, rowSpan: 2, align: 'left', alignVertical: 'center', value: 'MCV-2 13-15 MOS MALE: ___ FEMALE: ___', height: 30}
            ])
            
            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '2. BCG', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_2']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_2']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_2']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '12. PCV 2', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_12']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_12']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_12']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '3. HepB, within 24 hours', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_3a']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_3a']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_3a']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '13. PCV 3', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_13']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_13']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_13']['Total'], height: 30},
                { ...column_style, rowSpan: 2, align: 'left', alignVertical: 'center', value: 'MCV-2 16-23 MOS MALE: ___ FEMALE: ___', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: ' HepB, more than 24 hours', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_3b']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_3b']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_3b']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '14. MCV 1', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_14']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_14']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_14']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '4. DPT-HiB-HepB 1', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_4']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_4']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_4']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '15. MCV 2', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_15']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_15']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_15']['Total'], height: 30},
                { ...column_style, rowSpan: 2, align: 'left', alignVertical: 'center', value: 'MCV-2 24-59 MOS MALE: ___ FEMALE: ___', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '5. DPT-HiB-HepB 2', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_5']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_5']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_5']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '16. FIC', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_16']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_16']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_16']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '6. DPT-HiB-HepB 3', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_6']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_6']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_6']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '17. CIC', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_17']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_17']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_17']['Total'], height: 30},
                { ...column_style, rowSpan: 2, align: 'left', alignVertical: 'center', value: 'PENTA 13-15 MOS MALE: ___ FEMALE: ___', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '7. OPV 1', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_7']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_7']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_7']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '18. Td, Grade 1', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_18']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_18']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_18']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '8. OPV 2', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_8']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_8']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_8']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '19. MR, Grade 1', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_19']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_19']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_19']['Total'], height: 30},
                { ...column_style, rowSpan: 2, align: 'left', alignVertical: 'center', value: 'PENTA 16-23 MOS MALE: ___ FEMALE: ___', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '9. OPV 3', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_9']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_9']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_9']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '20. Td, Grade 7', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_20']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_20']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_20']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '10. IPV', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_10']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_10']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_10']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '21. MR, Grade 7', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_21']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_21']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c1_data['c1_21']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: 'REMARKS', height: 30}
            ])

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
                { ...header_style, align: 'center', alignVertical: 'center', value: 'C2. Nutrition Services for Infants and Children', backgroundColor: '#ffffff', color: '#000000', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '22. Newborns initiated on breastfeeding immediately after birth lasting to 90 mins', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_22']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_22']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_22']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '30. Children 12-23 mos. who completed MNP supplementation', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_30']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_30']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_30']['Total'], height: 30},
                { ...column_style, rowSpan: 8, align: 'center', alignVertical: 'center', value: 'MONTH OF MARCH REPORTING', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '23. Preterm/LBW infants given iron supplementation', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_23']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_23']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_23']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '31. Children 0-59 mos. Seen', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '24. Infants exclusively breastfed until 6th month', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_24']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_24']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_24']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: 'a. Stunted', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31a']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31a']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31a']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '25. Infants 6 mos. old initiated to complementary feeding with continued breastfeeding', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_25']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_25']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_25']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: 'b. Wasted', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31b']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31b']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31b']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '26. Infants 6 mos. old initiated to complementary feeding but no longer or never been breastfed', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_26']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_26']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_26']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: 'b.1. Wasted-MAM', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31b1']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31b1']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31b1']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '27. Infants 6-11 mos. old given 1 dose of Vitamin A 100,000 I.U.', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_27']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_27']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_27']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: 'b.2. Wasted-SAM', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31b2']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31b2']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31b2']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '28. Infants 12-59 mos. old given 2 doses of Vitamin A 200,000 I.U.', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_28']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_28']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_28']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: 'MONTH OF OCTOBER REPORT ONLY', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: 'c. Overweight/Obese', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31c']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31c']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31c']['Total'], height: 30},
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '29. Infants 6-11 months old who completed MNP supplementation', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_28']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_28']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_28']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: 'd. Normal', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31d']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31d']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.c2_data['c2_31d']['Total'], height: 30},
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
                    fileName: `${file_name_facility} - Section C. Child Care and Services C1 and C2 ${report_period} - ${file_name_date}.xlsx`
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