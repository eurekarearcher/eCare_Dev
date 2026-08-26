<template>
    <div id="content">
        <Header @loadSelectedDate="getSectionB2andB3Data" @exportExcel="exportExcel" @filters="setSelectedFilter"/>

        <table class="text-center body-2 mt-4" cellspacing="0">
            <tr class="white--text darken-3 blue">
                <td rowspan="2" style="width: 20%">
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

                <td rowspan="2" style="width: 20%">
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

            <tr class="font-weight-medium white--text darken-3 blue">
                <td class="text-no-wrap">10-14</td>
                <td class="text-no-wrap">15-19</td>
                <td class="text-no-wrap">20-49</td>
                <td class="text-no-wrap">10-14</td>
                <td class="text-no-wrap">15-19</td>
                <td class="text-no-wrap">20-49</td>
            </tr>
            
            <template v-if="!loading_data">
                <tr>
                    <td class="font-weight-bold text-left" colspan="20">B2. Intrapartum Care and Delivery Outcome</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">18. No. of deliveries</td>
                    <td>{{ b2_data['b2_18']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_18']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_18']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_18']['Total'] }}</td>
                    <td class="font-weight-medium" rowspan="6">HOME DELIVERIES ONLY OR IF WITH BIRTHING FACILITY IN THE CATCHMENT AREA</td>
                    <td class="font-weight-medium text-left" rowspan="2">24a. No. of vaginal deliveries</td>
                    <td rowspan="2">{{ b2_data['b2_24a']['10 - 14 years'] }}</td>
                    <td rowspan="2">{{ b2_data['b2_24a']['15 - 19 years'] }}</td>
                    <td rowspan="2">{{ b2_data['b2_24a']['20 - 49 years'] }}</td>
                    <td rowspan="2">{{ b2_data['b2_24a']['Total'] }}</td>
                    <td rowspan="2"></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">20. No. of deliveries attended by skilled health professionals - Total</td>
                    <td>{{ b2_data['b2_20']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_20']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_20']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_20']['Total'] }}</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">a. No. of deliveries attended by a doctor</td>
                    <td>{{ b2_data['b2_20a']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_20a']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_20a']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_20a']['Total'] }}</td>
                    <td class="font-weight-medium text-left">24b. No. of deliveries by cesarean section</td>
                    <td>{{ b2_data['b2_24b']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_24b']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_24b']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_24b']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">b. No. of deliveries attended by a nurse</td>
                    <td>{{ b2_data['b2_20b']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_20b']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_20b']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_20b']['Total'] }}</td>
                    <td class="font-weight-medium text-left">25a. No. of full-term births</td>
                    <td>{{ b2_data['b2_25a']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_25a']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_25a']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_25a']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">c. No. of deliveries attended by a midwives</td>
                    <td>{{ b2_data['b2_20c']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_20c']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_20c']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_20c']['Total'] }}</td>
                    <td class="font-weight-medium text-left">25b. No. of pre-term births</td>
                    <td>{{ b2_data['b2_25b']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_25b']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_25b']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_25b']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">21. No. of deliveries attended by non-skilled health professionals - Total</td>
                    <td>{{ b2_data['b2_21']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_21']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_21']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_21']['Total'] }}</td>
                    <td class="font-weight-medium text-left">25c. No. of fetal deaths</td>
                    <td>{{ b2_data['b2_25c']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_25c']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_25c']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_25c']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">a. No. of deliveries attended by Hilot/TBA</td>
                    <td>{{ b2_data['b2_21a']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_21a']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_21a']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_21a']['Total'] }}</td>
                    <td></td>
                    <td class="font-weight-medium text-left">25d. No. of abortion/miscarriage</td>
                    <td>{{ b2_data['b2_25d']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_25d']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_25d']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_25d']['Total'] }}</td>
                    <td></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">b. No. of deliveries attended by others</td>
                    <td>{{ b2_data['b2_21b']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_21b']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_21b']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_21b']['Total'] }}</td>
                    <td></td>
                    <td class="cell-background">Indicators</td>
                    <td class="cell-background">Male</td>
                    <td class="cell-background">Female</td>
                    <td class="cell-background">TOTAL</td>
                    <td class="cell-background" colspan="2">REMARKS</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">22. No. of health facility-based deliveries - Total</td>
                    <td>{{ b2_data['b2_22']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_22']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_22']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_22']['Total'] }}</td>
                    <td></td>
                    <td class="text-left">19. No. of live births</td>
                    <td>{{ b2_data['b2_19']['Male'] }}</td>
                    <td>{{ b2_data['b2_19']['Female'] }}</td>
                    <td>{{ b2_data['b2_19']['Total'] }}</td>
                    <td colspan="2"></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">a. No. of deliveries in public health facility</td>
                    <td>{{ b2_data['b2_22a']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_22a']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_22a']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_22a']['Total'] }}</td>
                    <td></td>
                    <td class="text-left">a. No. of live births with normal birth weight</td>
                    <td>{{ b2_data['b2_19a']['Male'] }}</td>
                    <td>{{ b2_data['b2_19a']['Female'] }}</td>
                    <td>{{ b2_data['b2_19a']['Total'] }}</td>
                    <td colspan="2"></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">b. No. of deliveries in private health facility</td>
                    <td>{{ b2_data['b2_22b']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_22b']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_22b']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_22b']['Total'] }}</td>
                    <td></td>
                    <td class="text-left">b. No. of live births with low birth weight</td>
                    <td>{{ b2_data['b2_19b']['Male'] }}</td>
                    <td>{{ b2_data['b2_19b']['Female'] }}</td>
                    <td>{{ b2_data['b2_19b']['Total'] }}</td>
                    <td colspan="2"></td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">23. No. of non-facility-based deliveries</td>
                    <td>{{ b2_data['b2_23']['10 - 14 years'] }}</td>
                    <td>{{ b2_data['b2_23']['15 - 19 years'] }}</td>
                    <td>{{ b2_data['b2_23']['20 - 49 years'] }}</td>
                    <td>{{ b2_data['b2_23']['Total'] }}</td>
                    <td></td>
                    <td class="text-left">c. No. of live births with unknown birth weight</td>
                    <td>{{ b2_data['b2_19c']['Male'] }}</td>
                    <td>{{ b2_data['b2_19c']['Female'] }}</td>
                    <td>{{ b2_data['b2_19c']['Total'] }}</td>
                    <td colspan="2"></td>
                </tr>

                <!-- B3. Postpartum and Newborn Care  -->
                <tr>
                    <td class="font-weight-bold text-left" colspan="20">B3. Postpartum and Newborn Care</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">26. No. of postpartum women together with their newborn who completed at least 2 postpartum check-ups</td>
                    <td>{{ b3_data['b3_26']['10 - 14 years'] }}</td>
                    <td>{{ b3_data['b3_26']['15 - 19 years'] }}</td>
                    <td>{{ b3_data['b3_26']['20 - 49 years'] }}</td>
                    <td>{{ b3_data['b3_26']['Total'] }}</td>
                    <td></td>
                    <td class="cell-background">Indicators </td>
                    <td class="cell-background">10-14</td>
                    <td class="cell-background">15-19</td>
                    <td class="cell-background">20-49</td>
                    <td class="cell-background">Total</td>
                    <td class="cell-background">Remarks</td>
                </tr>

                <tr>
                    <td class="font-weight-medium text-left">27. No. of postpartum women who completed iron with folic acid supplementation</td>
                    <td>{{ b3_data['b3_27']['10 - 14 years'] }}</td>
                    <td>{{ b3_data['b3_27']['15 - 19 years'] }}</td>
                    <td>{{ b3_data['b3_27']['20 - 49 years'] }}</td>
                    <td>{{ b3_data['b3_27']['Total'] }}</td>
                    <td></td>
                    <td class="'text-left">28. No. of postpartum women with Vitamin A supplementation</td>
                    <td>{{ b3_data['b3_28']['10 - 14 years'] }}</td>
                    <td>{{ b3_data['b3_28']['15 - 19 years'] }}</td>
                    <td>{{ b3_data['b3_28']['20 - 49 years'] }}</td>
                    <td>{{ b3_data['b3_28']['Total'] }}</td>
                    <td>                
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
            month: '',
            year: '',

            loading_data: false,
            b2_data: {
                'b2_18': {},
                'b2_20': {},
                'b2_20a': {},
                'b2_20b': {},
                'b2_20c': {},
                'b2_21': {},
                'b2_21a': {},
                'b2_21b': {},
                'b2_22': {},
                'b2_22a': {},
                'b2_22b': {},
                'b2_23': {},
                'b2_24a': {},
                'b2_24b': {},
                'b2_25a': {},
                'b2_25b': {},
                'b2_25c': {},
                'b2_25d': {},
                'b2_19': {},
                'b2_19a': {},
                'b2_19b': {},
                'b2_19c': {}
            },
            b3_data: {
                'b3_26': {},
                'b3_27': {},
                'b3_28': {}
            },
            alert: {},
            postpartum_loading: false
        }
    },

    methods: {
        //UNDER MONITORING
        // getM1Postpartum(key, provider_code, filter) {
        //     this.postpartum_loading = true
        //     this.$axios.post(this.$tms_url+'resources/api/_get_m1_postpartum.php', this.$qs.stringify({
        //         post_data: this.wsDataEncryption(JSON.stringify({
        //             key: key,
        //             provider_code: provider_code,
        //             month: filter.month,
        //             year: filter.year
        //         }))
        //     }))
        //     .then(response => {
        //         const getValue = (section, key) => {
        //             if (key in response.data[section]) {
        //                 const result = response.data[section][key][0]

        //                 return {
        //                     '10 - 14 years': parseInt(result['10 - 14 years']),
        //                     '15 - 19 years': parseInt(result['15 - 19 years']),
        //                     '20 - 49 years': parseInt(result['20 - 49 years']),
        //                     'Total': parseInt(result['Total'])
        //                 }
        //             } else {
        //                 return {
        //                     '10 - 14 years': 0,
        //                     '15 - 19 years': 0,
        //                     '20 - 49 years': 0,
        //                     'Total': 0
        //                 }
        //             }
        //         }

        //         this.postpartum_loading = false

        //         this.b3_data['b3_28'] = getValue('B3', 'postpartum_vitamin_a')
        //         this.loading_data = false
        //     })
        //     .catch(error => {
        //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //     })
        // },

        async getSectionB2andB3Data(filter) {
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

            let response = await this.$services.getM1M2Report('_get_m1_delivery.php', payload)

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                const getValue = (section, key) => {
                    if (key in response.data[section]) {
                        const result = response.data[section][key][0]

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

                const getBirthsValue = (key) => {
                    if (key in response.data.B2) {
                        const result = response.data.B2[key]
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

                //this.getM1Postpartum(key, provider_code, filter)

                this.b2_data['b2_18'] = getValue('B2', 'no_of_deliveries')
                this.b2_data['b2_20a'] = getValue('B2', 'doctor')
                this.b2_data['b2_20b'] = getValue('B2', 'nurse')
                this.b2_data['b2_20c'] = getValue('B2', 'midwives')
                this.b2_data['b2_20'] = {
                    '10 - 14 years': this.b2_data['b2_20a']['10 - 14 years'] + this.b2_data['b2_20b']['10 - 14 years'] + this.b2_data['b2_20c']['10 - 14 years'],
                    '15 - 19 years': this.b2_data['b2_20a']['15 - 19 years'] + this.b2_data['b2_20b']['15 - 19 years'] + this.b2_data['b2_20c']['15 - 19 years'],
                    '20 - 49 years': this.b2_data['b2_20a']['20 - 49 years'] + this.b2_data['b2_20b']['20 - 49 years'] + this.b2_data['b2_20c']['20 - 49 years'],
                    'Total': this.b2_data['b2_20a']['Total'] + this.b2_data['b2_20b']['Total'] + this.b2_data['b2_20c']['Total']
                }

                this.b2_data['b2_21a'] = getValue('B2', 'hilot_tba')
                this.b2_data['b2_21b'] = getValue('B2', 'others')
                this.b2_data['b2_21'] = {
                    '10 - 14 years': this.b2_data['b2_21a']['10 - 14 years'] + this.b2_data['b2_21b']['10 - 14 years'],
                    '15 - 19 years': this.b2_data['b2_21a']['15 - 19 years'] + this.b2_data['b2_21b']['15 - 19 years'],
                    '20 - 49 years': this.b2_data['b2_21a']['20 - 49 years'] + this.b2_data['b2_21b']['20 - 49 years'],
                    'Total': this.b2_data['b2_21a']['Total'] + this.b2_data['b2_21b']['Total']
                }

                this.b2_data['b2_22a'] = getValue('B2', 'public')
                this.b2_data['b2_22b'] = getValue('B2', 'private')
                this.b2_data['b2_22'] = {
                    '10 - 14 years': this.b2_data['b2_22a']['10 - 14 years'] + this.b2_data['b2_22b']['10 - 14 years'],
                    '15 - 19 years': this.b2_data['b2_22a']['15 - 19 years'] + this.b2_data['b2_22b']['15 - 19 years'],
                    '20 - 49 years': this.b2_data['b2_22a']['20 - 49 years'] + this.b2_data['b2_22b']['20 - 49 years'],
                    'Total': this.b2_data['b2_22a']['Total'] + this.b2_data['b2_22b']['Total']
                }

                this.b2_data['b2_23'] = getValue('B2', 'non_facility_based')
                this.b2_data['b2_24a'] = getValue('B2', 'normal_spontaneous_delivery')
                this.b2_data['b2_24b'] = getValue('B2', 'cesarean_section')
                this.b2_data['b2_25a'] = getValue('B2', 'full_term')
                this.b2_data['b2_25b'] = getValue('B2', 'pre_term')
                this.b2_data['b2_25c'] = getValue('B2', 'fetal_death')
                this.b2_data['b2_25d'] = getValue('B2', 'abortion_miscarriage')
                
                this.b2_data['b2_19a'] = getBirthsValue('normal_weight')
                this.b2_data['b2_19b'] = getBirthsValue('low_weight')
                this.b2_data['b2_19c'] = getBirthsValue('unknown_weight')
                this.b2_data['b2_19'] = {
                    'Male': this.b2_data['b2_19a']['Male'] + this.b2_data['b2_19b']['Male'] + this.b2_data['b2_19c']['Male'],
                    'Female': this.b2_data['b2_19a']['Female'] + this.b2_data['b2_19b']['Female'] + this.b2_data['b2_19c']['Female'],
                    'Total': this.b2_data['b2_19a']['Total'] + this.b2_data['b2_19b']['Total'] + this.b2_data['b2_19c']['Total']
                }

                this.b3_data['b3_26'] = getValue('B3', 'postpartum_checkup')
                this.b3_data['b3_27'] = getValue('B3', 'postpartum_folic_acid')
                this.b3_data['b3_28'] = getValue('B3', 'postpartum_vitamin_a')
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
                    { ...header_style, span: 12, align: 'center', alignVertical: 'center', value: 'Section B2. Intrapartum Care and Delivery Outcome and Section B3. Postpartum and Newborn Care', backgroundColor: '#ffffff', color: '#000000', height: 50 },
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
                { ...header_style, align: 'center', alignVertical: 'center', value: 'B2. Intrapartum Care and Delivery Outcome', backgroundColor: '#ffffff', color: '#000000', height: 40}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '18. No. of deliveries', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_18']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_18']['15 - 19 years'], height: 40 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_18']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_18']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, align: 'left', alignVertical: 'center', value: '24a. No. of vaginal deliveries', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_24a']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_24a']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_24a']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_24a']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '20. No. of deliveries attended by skilled health professionals - Total', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, rowSpan: 2, align: 'left', alignVertical: 'center', value: '24b. No. of deliveries by cesarean section', height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.b2_data['b2_24b']['10 - 14 years'], height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.b2_data['b2_24b']['15 - 19 years'], height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.b2_data['b2_24b']['20 - 49 years'], height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.b2_data['b2_24b']['Total'], height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: '', height: 40}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: 'a. No. of deliveries attended by a doctor', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20a']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20a']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20a']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20a']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
            ]),

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: 'b. No. of deliveries attended by a nurse', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20b']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20b']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20b']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20b']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, rowSpan: 2, align: 'left', alignVertical: 'center', value: '25a. No. of full-term births', height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25a']['10 - 14 years'], height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25a']['15 - 19 years'], height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25a']['20 - 49 years'], height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25a']['Total'], height: 40},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: '', height: 40}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: 'c. No. of deliveries attended by a midwives', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20c']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20c']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20c']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_20c']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, align: 'left', alignVertical: 'center', value: '25b. No. of pre-term births', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25b']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25b']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25b']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25b']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '21. No. of deliveries attended by non-skilled health professionals - Total', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_21']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_21']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_21']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_21']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, align: 'left', alignVertical: 'center', value: '25c. No. of fetal deaths', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25c']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25c']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25c']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25c']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: 'a. No. of deliveries attended by Hilot/TBA', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_21a']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_21a']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_21a']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_21a']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, align: 'left', alignVertical: 'center', value: '25d. No. of abortion/miscarriage', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25d']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25d']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25d']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_25d']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: 'b. No. of deliveries attended by others', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_21a']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_21a']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_21a']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_21a']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, align: 'center', alignVertical: 'center', value: 'Indicators', backgroundColor: '#1565c0', borderColor: '#000000', color: '#ffffff', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: 'Male', backgroundColor: '#1565c0', borderColor: '#000000', color: '#ffffff', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: 'Female', backgroundColor: '#1565c0', borderColor: '#000000', color: '#ffffff', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: 'Total', backgroundColor: '#1565c0', borderColor: '#000000', color: '#ffffff', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: 'Remarks', backgroundColor: '#1565c0', borderColor: '#000000', color: '#ffffff', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#1565c0', borderColor: '#000000', color: '#ffffff', height: 40}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '22. No. of health facility-based deliveries - Total', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_22']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_22']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_22']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_22']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, align: 'left', alignVertical: 'center', value: '19. No. of live births', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_19']['Male'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_19']['Female'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_19']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: 'a. No. of deliveries in public health facility', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_22a']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_22a']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_22a']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_22a']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, align: 'left', alignVertical: 'center', value: 'a. No. of live births with normal birth weight', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_19a']['Male'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_19a']['Female'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_19a']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: 'b. No. of deliveries in private health facility', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_22b']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_22b']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_22b']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_22b']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, align: 'left', alignVertical: 'center', value: 'b. No. of live births with low birth weight', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_19b']['Male'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_19b']['Female'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_19b']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '23. No. of non-facility-based deliveries', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_23']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_23']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_23']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_23']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, align: 'left', alignVertical: 'center', value: 'c. No. of live births with unknown birth weight', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_19c']['Male'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_19c']['Female'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b2_data['b2_19c']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
            ])

            result.push([
                { ...header_style, align: 'center', alignVertical: 'center', value: 'B3. Postpartum and Newborn Care', backgroundColor: '#ffffff', color: '#000000', height: 40}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '26. No. of postpartum women together with their newborn who completed at least 2 postpartum check-ups', height: 50},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b3_data['b3_26']['10 - 14 years'], height: 50},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b3_data['b3_26']['15 - 19 years'], height: 50},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b3_data['b3_26']['20 - 49 years'], height: 50},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b3_data['b3_26']['Total'], height: 50},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 50},

                { ...column_style, align: 'center', alignVertical: 'center', value: 'Indicators', backgroundColor: '#1565c0', borderColor: '#000000', color: '#ffffff', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '10-14', backgroundColor: '#1565c0', borderColor: '#000000', color: '#ffffff', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '15-19', backgroundColor: '#1565c0', borderColor: '#000000', color: '#ffffff', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '20-49', backgroundColor: '#1565c0', borderColor: '#000000', color: '#ffffff', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: 'Total', backgroundColor: '#1565c0', borderColor: '#000000', color: '#ffffff', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: 'Remarks', backgroundColor: '#1565c0', borderColor: '#000000', color: '#ffffff', height: 40},
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '27. No. of postpartum women who completed iron with folic acid supplementation', height: 50},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b3_data['b3_27']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b3_data['b3_27']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b3_data['b3_27']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b3_data['b3_27']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

                { ...column_style, align: 'left', alignVertical: 'center', value: '28. No. of postpartum women with Vitamin A supplementation', height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b3_data['b3_28']['10 - 14 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b3_data['b3_28']['15 - 19 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b3_data['b3_28']['20 - 49 years'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.b3_data['b3_28']['Total'], height: 40},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
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
                        { width: 40 },
                        { width: 10 },
                        { width: 10 },
                        { width: 10 },
                        { width: 20 },
                        { width: 30 },
                        { width: 40 },
                        { width: 10 },
                        { width: 10 },
                        { width: 10 },
                        { width: 20 },
                        { width: 30 },
                    ],
                    fileName: `${file_name_facility} - B2. Intrapartum Care and Delivery Outcome and B3. Postpartum and Newborn Care ${report_period} - ${file_name_date}.xlsx`
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