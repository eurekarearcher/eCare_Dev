<template>
  <div id="content">
    <Header @loadSelectedDate="getSectionEData" @exportExcel="exportExcel" @filters="setSelectedFilter" />

    <table class="text-center body-2 mt-4" cellspacing="0">
      <tr>
        <td class="font-weight-medium body-1" colspan="25">
          Section E. Infectious Disease Prevention and Control Services
        </td>
      </tr>

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
        <td class="font-weight-bold text-left" colspan="10">
          E1. Filariasis Prevention and Control
        </td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left">
          1. No. of individual examined for lymphatic filariasis
        </td>
        <td>{{ e1_data['e1_1']['Male'] }}</td>
        <td>{{ e1_data['e1_1']['Female'] }}</td>
        <td>{{ e1_data['e1_1']['Total'] }}</td>
        <td>{{ e1_data['e1_1']['Remarks'] }}</td>
        <td class="font-weight-medium text-left" rowspan="2">
          3. No. of lymphatic filariasis cases examined with manifestation of
          either lymphedema, hydrocele elephantiasis
        </td>
        <td rowspan="2">{{ e1_data['e1_3']['Male'] }}</td>
        <td rowspan="2">{{ e1_data['e1_3']['Female'] }}</td>
        <td rowspan="2">{{ e1_data['e1_3']['Total'] }}</td>
        <td rowspan="2">{{ e1_data['e1_3']['Remarks'] }}</td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left">
          2. No. of individual examined found positive for lymphatic filariasis
        </td>
        <td>{{ e1_data['e1_2']['Male'] }}</td>
        <td>{{ e1_data['e1_2']['Female'] }}</td>
        <td>{{ e1_data['e1_2']['Total'] }}</td>
        <td>{{ e1_data['e1_2']['Remarks'] }}</td>
      </tr>

      <tr>
        <td class="font-weight-bold text-left" colspan="10">
          E2. Schistosomiasis Prevention and Control
        </td>
      </tr>

      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td rowspan="5"></td>
        <td class="font-weight-medium text-left">
          6. No. of confirmed chronic cases
        </td>
        <td>{{ e2_data['e2_6']['Male'] }}</td>
        <td>{{ e2_data['e2_6']['Female'] }}</td>
        <td>{{ e2_data['e2_6']['Total'] }}</td>
        <td rowspan="5"></td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left">
          2. No. of suspected cases seen
        </td>
        <td>{{ e2_data['e2_2']['Male'] }}</td>
        <td>{{ e2_data['e2_2']['Female'] }}</td>
        <td>{{ e2_data['e2_2']['Total'] }}</td>
        <td class="font-weight-medium text-left" rowspan="2">
          7. No. of confirmed cases (acute and chronic)
        </td>
        <td rowspan="2">{{ e2_data['e2_7']['Male'] }}</td>
        <td rowspan="2">{{ e2_data['e2_7']['Female'] }}</td>
        <td rowspan="2">{{ e2_data['e2_7']['Total'] }}</td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left">
          3. No. of acute clinically diagnosed cases
        </td>
        <td>{{ e2_data['e2_3']['Male'] }}</td>
        <td>{{ e2_data['e2_3']['Female'] }}</td>
        <td>{{ e2_data['e2_3']['Total'] }}</td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left">
          4. No. of confirmed acute cases
        </td>
        <td>{{ e2_data['e2_4']['Male'] }}</td>
        <td>{{ e2_data['e2_4']['Female'] }}</td>
        <td>{{ e2_data['e2_4']['Total'] }}</td>
        <td class="font-weight-medium text-left">8. No. of cases treated</td>
        <td>{{ e2_data['e2_8']['Male'] }}</td>
        <td>{{ e2_data['e2_8']['Female'] }}</td>
        <td>{{ e2_data['e2_8']['Total'] }}</td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left">
          5. No. of chronic clinically diagnosed cases
        </td>
        <td>{{ e2_data['e2_5']['Male'] }}</td>
        <td>{{ e2_data['e2_5']['Female'] }}</td>
        <td>{{ e2_data['e2_5']['Total'] }}</td>
        <td class="font-weight-medium text-left">
          9. No. of confirmed chronic cases referred to a
        </td>
        <td>{{ e2_data['e2_9']['Male'] }}</td>
        <td>{{ e2_data['e2_9']['Female'] }}</td>
        <td>{{ e2_data['e2_9']['Total'] }}</td>
      </tr>

      <tr>
        <td class="font-weight-bold text-left" colspan="10">
          E3. Soil Transmitted Heiminthiasis Prevention and Control (<i
            >other age groups reflected under Child Care and Maternal Care</i
          >)
        </td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left">
          1. No. of WRA, 20-49 years old, who completed 2 doses of deworming
          tablet
        </td>
        <td>{{ e3_data['e3_1']['Male'] }}</td>
        <td>{{ e3_data['e3_1']['Female'] }}</td>
        <td>{{ e3_data['e3_1']['Total'] }}</td>
        <td></td>
        <td colspan="5"></td>
      </tr>

      <tr>
        <td class="font-weight-bold text-left" colspan="10">
          E4. HIV-AIDS/STI Prevention and Control (<i
            >reflected under Maternal Care</i
          >)
        </td>
      </tr>

      <tr>
        <td class="font-weight-bold text-left" colspan="10">
          E5. Tuberculosis Prevention and Control
        </td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left">
          1. Number of notified TB cases, all forms
        </td>
        <td>{{ e5_data['e5_1']['Male'] }}</td>
        <td>{{ e5_data['e5_1']['Female'] }}</td>
        <td>{{ e5_data['e5_1']['Total'] }}</td>
        <td rowspan="2"></td>
        <td class="font-weight-medium text-left">
          3. Number of TB, all forms that are cured and completely treated
        </td>
        <td>{{ e5_data['e5_3']['Male'] }}</td>
        <td>{{ e5_data['e5_3']['Female'] }}</td>
        <td>{{ e5_data['e5_3']['Total'] }}</td>
        <td rowspan="2"></td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left">
          2. No. of registered bacteriologically confirmed drug resistant TB
          (RR/MDR-TB cases)
        </td>
        <td>{{ e5_data['e5_2']['Male'] }}</td>
        <td>{{ e5_data['e5_2']['Female'] }}</td>
        <td>{{ e5_data['e5_2']['Total'] }}</td>
        <td class="font-weight-medium text-left">
          4. No. of registered bacteriology confirmed drug resistant TB Cases
          (RR/MDR-TB) cured & completed treatment
        </td>
        <td>{{ e5_data['e5_4']['Male'] }}</td>
        <td>{{ e5_data['e5_4']['Female'] }}</td>
        <td>{{ e5_data['e5_4']['Total'] }}</td>
      </tr>

      <tr>
        <td class="font-weight-bold text-left" colspan="10">
          E6. Malaria Prevention and Control
        </td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left">
          1. No. of patients with probable/clinically diagnosed Malaria and
          confirmed cases-Total
        </td>
        <td>{{ e6_data['e6_1']['Male'] }}</td>
        <td>{{ e6_data['e6_1']['Female'] }}</td>
        <td>{{ e6_data['e6_1']['Total'] }}</td>
        <td rowspan="3"></td>
        <td class="font-weight-medium text-left">
          2. No. of lab-confirmed Malaria deaths - Total
        </td>
        <td>{{ e6_data['e6_2']['Male'] }}</td>
        <td>{{ e6_data['e6_2']['Female'] }}</td>
        <td>{{ e6_data['e6_2']['Total'] }}</td>
        <td rowspan="3"></td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left pl-6">
          &#x2022; &lt; 5 y/o - Total
        </td>
        <td>{{ e6_data['e6_1a']['Male'] }}</td>
        <td>{{ e6_data['e6_1a']['Female'] }}</td>
        <td>{{ e6_data['e6_1a']['Total'] }}</td>
        <td class="font-weight-medium text-left pl-6">
          &#x2022; &lt; 5 y/o - Total
        </td>
        <td>{{ e6_data['e6_2a']['Male'] }}</td>
        <td>{{ e6_data['e6_2a']['Female'] }}</td>
        <td>{{ e6_data['e6_2a']['Total'] }}</td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left pl-6">
          &#x2022; &#8805; 5 y/o - Total
        </td>
        <td>{{ e6_data['e6_1b']['Male'] }}</td>
        <td>{{ e6_data['e6_1b']['Female'] }}</td>
        <td>{{ e6_data['e6_1b']['Total'] }}</td>
        <td class="font-weight-medium text-left pl-6">
          &#x2022; &#8805; 5 y/o - Total
        </td>
        <td>{{ e6_data['e6_2b']['Male'] }}</td>
        <td>{{ e6_data['e6_2b']['Female'] }}</td>
        <td>{{ e6_data['e6_2b']['Total'] }}</td>
      </tr>

      <tr>
        <td class="font-weight-bold text-left" colspan="5">
          E7. Leprosy Prevention and Control
        </td>
        <td class="font-weight-bold text-left" colspan="5">
          E8. Rabies Prevention and Control
        </td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left">
          1. No. of Leprosy cases on treatment during reporting period
        </td>
        <td>{{ e7_data['e7_1']['Male'] }}</td>
        <td>{{ e7_data['e7_1']['Female'] }}</td>
        <td>{{ e7_data['e7_1']['Total'] }}</td>
        <td rowspan="2"></td>
        <td class="font-weight-medium text-left">1. No. of animal bites</td>
        <td>{{ e8_data['e8_1']['Male'] }}</td>
        <td>{{ e8_data['e8_1']['Female'] }}</td>
        <td>{{ e8_data['e8_1']['Total'] }}</td>
        <td rowspan="2"></td>
      </tr>

      <tr>
        <td class="font-weight-medium text-left">
          2. No. of newly detected cases during reporting period
        </td>
        <td>{{ e7_data['e7_2']['Male'] }}</td>
        <td>{{ e7_data['e7_2']['Female'] }}</td>
        <td>{{ e7_data['e7_2']['Total'] }}</td>
        <td class="font-weight-medium text-left">
          2. No. of deaths due to Rabies
        </td>
        <td>{{ e8_data['e8_2']['Male'] }}</td>
        <td>{{ e8_data['e8_2']['Female'] }}</td>
        <td>{{ e8_data['e8_2']['Total'] }}</td>
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

          e1_data: {
            'e1_1': {},
            'e1_2': {},
            'e1_3': {}
          },

          e2_data: {
            'e2_2': {},
            'e2_3': {},
            'e2_4': {},
            'e2_5': {},
            'e2_6': {},
            'e2_7': {},
            'e2_8': {},
            'e2_9': {}
          },

          e3_data: {
            'e3_1': {},
          },
          
          e5_data: {
            'e5_1': {},
            'e5_2': {},
            'e5_3': {},
            'e5_4': {}
          },

          e6_data: {
            'e6_1': {},
            'e6_1a': {},
            'e6_1b': {},
            'e6_2': {},
            'e6_2a': {},
            'e6_2b': {},
          },

          e7_data: {
            'e7_1': {},
            'e7_2': {}
          },

          e8_data: {
            'e8_1': {},
            'e8_2': {}
          },

          alert: {}
        }
    },

    methods: {
      async getSectionEData(filter){
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

            let response = await this.$services.getM1M2Report('_get_m1_infectious_disease.php', payload)

            
            if(response.status === 200) {
              response.data = this.responseDataDecryption(response.data)
                const getValue = (section, key) => {
                    if (key in response.data[section]) {
                        const result = response.data[section][key]
                        let male = 0
                        let female = 0

                        result.forEach(element => {
                            if (element.mem_gender === 'M') male = parseInt(element.total)
                            else female = parseInt(element.total)
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

                // E1 Data
                this.e1_data['e1_1'] = getValue('E1', 'e1_1')
                this.e1_data['e1_2'] = getValue('E1', 'e1_2')
                this.e1_data['e1_3'] = getValue('E1', 'e1_3')

                // E2 Data
                this.e2_data['e2_2'] = getValue('E2', 'e2_2')
                this.e2_data['e2_3'] = getValue('E2', 'e2_3')
                this.e2_data['e2_4'] = getValue('E2', 'e2_4')
                this.e2_data['e2_5'] = getValue('E2', 'e2_5')
                this.e2_data['e2_6'] = getValue('E2', 'e2_6')
                this.e2_data['e2_7'] = getValue('E2', 'e2_7')
                this.e2_data['e2_8'] = getValue('E2', 'e2_8')
                this.e2_data['e2_9'] = getValue('E2', 'e2_9')

                // E3 Data
                this.e3_data['e3_1'] = getValue('E3', 'e3_1')

                // E5 Data
                this.e5_data['e5_1'] = getValue('E5', 'e5_1')
                this.e5_data['e5_2'] = getValue('E5', 'e5_2')
                this.e5_data['e5_3'] = getValue('E5', 'e5_3')
                this.e5_data['e5_4'] = getValue('E5', 'e5_4')
             
                // E6 Data
                this.e6_data['e6_1a'] = getValue('E6', 'e6_1_less_than_5')
                this.e6_data['e6_1b'] = getValue('E6', 'e6_1_greater_than_5')
                this.e6_data['e6_1'] = {
                  'Male': this.e6_data['e6_1a']['Male'] + this.e6_data['e6_1b']['Male'],
                  'Female': this.e6_data['e6_1a']['Female'] + this.e6_data['e6_1b']['Female'], 
                  'Total': this.e6_data['e6_1a']['Total'] + this.e6_data['e6_1b']['Total']  
                }
                
                this.e6_data['e6_2a'] = getValue('E6', 'e6_2_less_than_5')
                this.e6_data['e6_2b'] = getValue('E6', 'e6_2_greater_than_5')
                this.e6_data['e6_2'] = {
                  'Male': this.e6_data['e6_2a']['Male'] + this.e6_data['e6_2b']['Male'],
                  'Female': this.e6_data['e6_2a']['Female'] + this.e6_data['e6_2b']['Female'], 
                  'Total': this.e6_data['e6_2a']['Total'] + this.e6_data['e6_2b']['Total']  
                }
                
                // E7 Data
                this.e7_data['e7_1'] = getValue('E7', 'e7_1')
                this.e7_data['e7_2'] = getValue('E7', 'e7_2')

                // E8 Data
                this.e8_data['e8_1'] = getValue('E8', 'e8_1')
                this.e8_data['e8_2'] = getValue('E8', 'e8_2')

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
                    { ...header_style, span: 10, align: 'center', alignVertical: 'center', value: 'Section E. Infectious Disease Prevention and Control Services', backgroundColor: '#ffffff', color: '#000000', height: 50 },
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
                { ...header_style, span: 10, align: 'left', alignVertical: 'center', value: 'E1. Filariasis Prevention and Control', backgroundColor: '#ffffff', color: '#000000', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '1. No. of individual examined for lymphatic filariasis', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e1_data['e1_1']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e1_data['e1_1']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e1_data['e1_1']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, rowSpan: 2, align: 'left', alignVertical: 'center', value: '3. No. of lymphatic filariasis cases examined with manifestation of either lymphedema, hydrocele elephantiasis', height: 30},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.e1_data['e1_3']['Male'], height: 30},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.e1_data['e1_3']['Female'], height: 30},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.e1_data['e1_3']['Total'], height: 30},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '2. No. of individual examined found positive for lymphatic filariasis', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e1_data['e1_2']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e1_data['e1_2']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e1_data['e1_2']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...header_style, span: 10, align: 'left', alignVertical: 'center', value: 'E2. Schistosomiasis Prevention and Control', backgroundColor: '#ffffff', color: '#000000', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '6. No. of confirmed chronic cases', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_6']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_6']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_6']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])
            
            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '2. No. of suspected cases seen', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_2']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_2']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_2']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, rowSpan: 2, align: 'left', alignVertical: 'center', value: '7. No. of confirmed cases (acute and chronic)', height: 30},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.e2_data['e2_7']['Male'], height: 30},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.e2_data['e2_7']['Female'], height: 30},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: this.e2_data['e2_7']['Total'], height: 30},
                { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '3. No. of acute clinically diagnosed cases', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_3']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_3']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_3']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '4. No. of confirmed acute cases', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_4']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_4']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_4']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '8. No. of cases treated', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_8']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_8']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_8']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '5. No. of chronic clinically diagnosed cases', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_5']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_5']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_5']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '9. No. of confirmed chronic cases referred to a', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_9']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_9']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e2_data['e2_9']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...header_style, span: 10, align: 'left', alignVertical: 'center', value: 'E3. Soil Transmitted Heiminthiasis Prevention and Control (other age groups reflected under Child Care and Maternal Care)', backgroundColor: '#ffffff', color: '#000000', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '1. No. of WRA, 20-49 years old, who completed 2 doses of deworming tablet', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e3_data['e3_1']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e3_data['e3_1']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e3_data['e3_1']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...header_style, span: 10, align: 'left', alignVertical: 'center', value: 'E4. HIV-AIDS/STI Prevention and Control (reflected under Maternal Care)', backgroundColor: '#ffffff', color: '#000000', height: 60}
            ])

            result.push([
                { ...header_style, span: 10, align: 'left', alignVertical: 'center', value: 'E5. Tuberculosis Prevention and Control', backgroundColor: '#ffffff', color: '#000000', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '1. Number of notified TB cases, all forms', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e5_data['e5_1']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e5_data['e5_1']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e5_data['e5_1']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '3. Number of TB, all forms that are cured and completely treated', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e5_data['e5_3']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e5_data['e5_3']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e5_data['e5_3']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '2. No. of registered bacteriologically confirmed drug resistant TB (RR/MDR-TB cases)', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e5_data['e5_2']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e5_data['e5_2']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e5_data['e5_2']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '4. No. of registered bacteriology confirmed drug resistant TB Cases (RR/MDR-TB) cured & completed treatment', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e5_data['e5_4']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e5_data['e5_4']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e5_data['e5_4']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...header_style, span: 10, align: 'left', alignVertical: 'center', value: 'E6. Malaria Prevention and Control', backgroundColor: '#ffffff', color: '#000000', height: 60}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '1. No. of patients with probable/clinically diagnosed Malaria and confirmed cases-Total', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_1']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_1']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_1']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '2. No. of lab-confirmed Malaria deaths - Total', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_2']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_2']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_2']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '• < 5 y/o - Total', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_1a']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_1a']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_1a']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '• < 5 y/o - Total', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_2a']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_2a']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_2a']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '• < 5 y/o - Total', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_1b']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_1b']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_1b']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '• < 5 y/o - Total', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_2b']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_2b']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e6_data['e6_2b']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...header_style, span: 5, align: 'left', alignVertical: 'center', value: 'E7. Leprosy Prevention and Control', backgroundColor: '#ffffff', color: '#000000', height: 60},
                { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 60},
                { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 60},
                { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 60},
                { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 60},
                { ...header_style, align: 'center', alignVertical: 'center', value: 'E8. Rabies Prevention and Control', backgroundColor: '#ffffff', color: '#000000', height: 60},
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '1. No. of Leprosy cases on treatment during reporting period', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e7_data['e7_1']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e7_data['e7_1']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e7_data['e7_1']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '1. No. of animal bites', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e8_data['e8_1']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e8_data['e8_1']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e8_data['e8_1']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
            ])

            result.push([
                { ...column_style, align: 'left', alignVertical: 'center', value: '2. No. of newly detected cases during reporting period', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e7_data['e7_2']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e7_data['e7_2']['Female'], height: 30 },
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e7_data['e7_2']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

                { ...column_style, align: 'left', alignVertical: 'center', value: '2. No. of deaths due to Rabies', height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e8_data['e8_2']['Male'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e8_data['e8_2']['Female'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: this.e8_data['e8_2']['Total'], height: 30},
                { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
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
                    fileName: `${file_name_facility} - Section E. Infectious Disease Prevention and Control Services ${report_period} - ${file_name_date}.xlsx`
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