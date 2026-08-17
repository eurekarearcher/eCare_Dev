<template>
  <div id="content">
    <Header @loadSelectedDate="getSectionFGHIData" @exportExcel="exportExcel" @filters="setSelectedFilter" />
    <table class="text-center body-2 mt-4" cellspacing="0">
      <tr>
        <td class="font-weight-medium body-1" colspan="25">
          Section F. Non-Communicable Disease Prevention and Control Services
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
          <td class="font-weight-medium text-left">
            1. No. of adults risk-assessed using PhilPEN - Total
          </td>
          <td>{{ f_data['f_1']['Male'] }}</td>
          <td>{{ f_data['f_1']['Female'] }}</td>
          <td>{{ f_data['f_1']['Total'] }}</td>
          <td rowspan="4"></td>
          <td class="font-weight-medium text-left">
            5. No. of adult women screened for Cervical Cancer using VIA/Pap Smear
          </td>
          <td>{{ f_data['f_5']['Male'] }}</td>
          <td>{{ f_data['f_5']['Female'] }}</td>
          <td>{{ f_data['f_5']['Total'] }}</td>
          <td rowspan="4"></td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left pl-8">2. Current smokers</td>
          <td>{{ f_data['f_2']['Male'] }} </td>
          <td>{{ f_data['f_2']['Female'] }} </td>
          <td>{{ f_data['f_2']['Total'] }} </td>
          <td class="font-weight-medium text-left" rowspan="3">
            6. No. of adult women fount positive / suspect for Cervical Cancer
            using VIA or Pap Smear
          </td>
          <td rowspan="3">{{ f_data['f_6']['Male'] }} </td>
          <td rowspan="3">{{ f_data['f_6']['Female'] }} </td>
          <td rowspan="3">{{ f_data['f_6']['Total'] }} </td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left pl-8">
            3. Alcohol binge drinkers
          </td>
          <td>{{ f_data['f_3']['Male'] }} </td>
          <td>{{ f_data['f_3']['Female'] }} </td>
          <td>{{ f_data['f_3']['Total'] }} </td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left pl-8">4. Overweight/Obese</td>
          <td>{{ f_data['f_4']['Male'] }} </td>
          <td>{{ f_data['f_4']['Female'] }} </td>
          <td>{{ f_data['f_4']['Total'] }} </td>
        </tr>

        <tr class="white--text darken-3 blue">
          <td style="width: 21%">
            <h6 class="font-weight-medium body-2">Indicators</h6>
            <h6 class="body-2">(Col. 1)</h6>
          </td>
          <td style="width: 4%">
            <h6 class="font-weight-medium body-2">Male</h6>
            <h6 class="body-2">(Col. 2)</h6>
          </td>
          <td style="width: 4%">
            <h6 class="font-weight-medium body-2">Female</h6>
            <h6 class="body-2">(Col. 3)</h6>
          </td>
          <td style="width: 4%">
            <h6 class="font-weight-medium body-2">Total</h6>
            <h6 class="body-2">(Col. 4)</h6>
          </td>
          <td style="width: 11%">
            <h6 class="font-weight-medium body-2">Remarks</h6>
            <h6 class="body-2">(Col. 5)</h6>
          </td>
          <td style="width: 21%">
            <h6 class="font-weight-medium body-2">Indicators</h6>
            <h6 class="body-2">(Col. 1)</h6>
          </td>
          <td style="width: 4%">
            <h6 class="font-weight-medium body-2">Male</h6>
            <h6 class="body-2">(Col. 2)</h6>
          </td>
          <td style="width: 4%">
            <h6 class="font-weight-medium body-2">Female</h6>
            <h6 class="body-2">(Col. 3)</h6>
          </td>
          <td style="width: 4%">
            <h6 class="font-weight-medium body-2">Total</h6>
            <h6 class="body-2">(Col. 4)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Remarks</h6>
            <h6 class="body-2">(Col. 5)</h6>
          </td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left">
            7. No. of adult women screened for breast mass
          </td>
          <td>{{ f_data['f_7']['Male'] }}</td>
          <td>{{ f_data['f_7']['Female'] }}</td>
          <td>{{ f_data['f_7']['Total'] }}</td>
          <td rowspan="2"></td>
          <td class="font-weight-medium text-left">
            11. No. of senior citizens for visual acuity
          </td>
          <td>{{ f_data['f_11']['Male'] }}</td>
          <td>{{ f_data['f_11']['Female'] }}</td>
          <td>{{ f_data['f_11']['Total'] }}</td>
          <td></td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left">
            8. No. of adult women with suspicious for breast mass
          </td>
          <td>{{ f_data['f_8']['Male'] }}</td>
          <td>{{ f_data['f_8']['Female'] }}</td>
          <td>{{ f_data['f_8']['Total'] }}</td>
          <td class="font-weight-medium text-left">
            12. No. of senior citizens diagnosed with eye disease/s
          </td>
          <td>{{ f_data['f_12']['Male'] }}</td>
          <td>{{ f_data['f_12']['Female'] }}</td>
          <td>{{ f_data['f_12']['Total'] }}</td>
          <td></td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left">
            9. No. of newly-identified hypertensive adults
          </td>
          <td>{{ f_data['f_9']['Male'] }}</td>
          <td>{{ f_data['f_9']['Female'] }}</td>
          <td>{{ f_data['f_9']['Total'] }}</td>
          <td></td>
          <td class="font-weight-medium text-left">
            13. No. of senior citizens who received one (1) dose of PPV
          </td>
          <td>{{ f_data['f_13']['Male'] }}</td>
          <td>{{ f_data['f_13']['Female'] }}</td>
          <td>{{ f_data['f_13']['Total'] }}</td>
          <td></td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left">
            10. No. of newly-identified adults with Type 2 DM
          </td>
          <td>{{ f_data['f_10']['Male'] }}</td>
          <td>{{ f_data['f_10']['Female'] }}</td>
          <td>{{ f_data['f_10']['Total'] }}</td>
          <td></td>
          <td class="font-weight-medium text-left">
            14. No. of senior citizens who received one (1) dose of influenza
            vaccine
          </td>
          <td>{{ f_data['f_14']['Male'] }}</td>
          <td>{{ f_data['f_14']['Female'] }}</td>
          <td>{{ f_data['f_14']['Total'] }}</td>
          <td></td>
        </tr>

        <tr>
          <td class="font-weight-medium body-1" colspan="10">
            Section G. Environmental Health and Sanitation Services
          </td>
        </tr>

        <tr class="white--text darken-3 blue">
          <td colspan="3">
            <h6 class="font-weight-medium body-2">Indicators</h6>
            <h6 class="body-2">(Col. 1)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Total</h6>
            <h6 class="body-2">(Col. 2)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Remarks</h6>
            <h6 class="body-2">(Col. 3)</h6>
          </td>
          <td colspan="3">
            <h6 class="font-weight-medium body-2">Indicators</h6>
            <h6 class="body-2">(Col. 1)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Total</h6>
            <h6 class="body-2">(Col. 2)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Remarks</h6>
            <h6 class="body-2">(Col. 3)</h6>
          </td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left" colspan="3">
            1. No. of HHs with access to basic safe water supply - Total
          </td>
          <td> {{ g_data['g_1'] }}</td>
          <td rowspan="4"></td>
          <td class="font-weight-medium text-left" colspan="3">
            2. No. of HHs with basic sanitation facility - Total
          </td>
         <td> {{ g_data['g_2'] }}</td>
          <td rowspan="6"></td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left pl-8" colspan="3">
            a. No. of HHs with Level I
          </td>
          <td> {{ g_data['g1_a'] }}</td>
          <td class="font-weight-medium text-left pl-8" colspan="3">
            a. No. of HH with pour/flush toilet connected to septic tank
          </td>
         <td> {{ g_data['g2_a'] }}</td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left pl-8" colspan="3">
            b. No. of HHs with Level II
          </td>
          <td> {{ g_data['g1_b'] }}</td>
          <td class="font-weight-medium text-left pl-8" rowspan="3" colspan="3">
            b. No. of HHs with pour/flush toilet connected to community
            sewer/sewerage system or any other approved treatment system
          </td>
          <td rowspan="3">{{ g_data['g2_b'] }}</td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left pl-8" colspan="3">
            c. No. of HHs with Level III
          </td>
          <td> {{ g_data['g1_c'] }}</td>
        </tr>

        <tr>
          <td colspan="5" rowspan="3"></td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left pl-8" colspan="3">
            c. No. of HHs with ventilated improved pit latrine (VIP)
          </td>
          <td>{{ g_data['g2_c'] }}</td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left" colspan="3">
            3. No. of industrial establishments issued with sanitary permit
          </td>
          <td>{{ g_data['g_3'] }}</td>
          <td></td>
        </tr>

        <tr>
          <td class="font-weight-medium body-1" colspan="5">
            Section H. Mortality
          </td>
          <td class="font-weight-medium body-1" colspan="5">
            Section I. Natality
          </td>
        </tr>

        <tr class="white--text darken-3 blue">
          <td>
            <h6 class="font-weight-medium body-2">Indicators</h6>
            <h6 class="body-2">(Col. 1)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Male</h6>
            <h6 class="body-2">(Col. 2)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Female</h6>
            <h6 class="body-2">(Col. 3)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Total</h6>
            <h6 class="body-2">(Col. 4)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Remarks</h6>
            <h6 class="body-2">(Col. 5)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Indicators</h6>
            <h6 class="body-2">(Col. 1)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Male</h6>
            <h6 class="body-2">(Col. 2)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Female</h6>
            <h6 class="body-2">(Col. 3)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Total</h6>
            <h6 class="body-2">(Col. 4)</h6>
          </td>
          <td>
            <h6 class="font-weight-medium body-2">Remarks</h6>
            <h6 class="body-2">(Col. 5)</h6>
          </td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left">1. Total Deaths</td>
          <td>{{ h_data['h_1']['Male'] }}</td>
          <td>{{ h_data['h_1']['Female'] }}</td>
          <td>{{ h_data['h_1']['Total'] }}</td>
          <td rowspan="8"></td>
          <td class="font-weight-medium text-left">1. Livebirths</td>
          <td>{{ i_data['i_1']['Male'] }}</td>
          <td>{{ i_data['i_1']['Female'] }}</td>
          <td>{{ i_data['i_1']['Total'] }}</td>
          <td class="font-weight-medium text-left" rowspan="2">
            <span>CBR:</span>
            <br />
            <span>ABR:</span>
          </td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left">2. Maternal Deaths - Total</td>
          <td>{{ h_data['h_2']['Male'] }}</td>
          <td>{{ h_data['h_2']['Female'] }}</td>
          <td>{{ h_data['h_2']['Total'] }}</td>
          <td class="font-weight-medium text-left pl-8">
            a. Livebirths among 10-14 y/o women
          </td>
          <td>{{ i_data['i_a']['Male'] }}</td>
          <td>{{ i_data['i_a']['Female'] }}</td>
          <td>{{ i_data['i_a']['Total'] }}</td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left">
            3. Under-five Deaths - Total
          </td>
          <td>{{ h_data['h_3']['Male'] }}</td>
          <td>{{ h_data['h_3']['Female'] }}</td>
          <td>{{ h_data['h_3']['Total'] }}</td>
          <td class="font-weight-medium text-left pl-8">
            b. Livebirths among 15-19 y/o women
          </td>
          <td>{{ i_data['i_b']['Male'] }}</td>
          <td>{{ i_data['i_b']['Female'] }}</td>
          <td>{{ i_data['i_b']['Total'] }}</td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left">4. Infant Deaths - Total</td>
          <td>{{ h_data['h_4']['Male'] }}</td>
          <td>{{ h_data['h_4']['Female'] }}</td>
          <td>{{ h_data['h_4']['Total'] }}</td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left">5. Neonatal Deaths - Total</td>
          <td>{{ h_data['h_5']['Male'] }}</td>
          <td>{{ h_data['h_5']['Female'] }}</td>
          <td>{{ h_data['h_5']['Total'] }}</td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left">6. Fetal Deaths - Total</td>
          <td>{{ h_data['h_6']['Male'] }}</td>
          <td>{{ h_data['h_6']['Female'] }}</td>
          <td>{{ h_data['h_6']['Total'] }}</td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left">7. Early Neonatal Deaths - Total</td>
          <td>{{ h_data['h_7']['Male'] }}</td>
          <td>{{ h_data['h_7']['Female'] }}</td>
          <td>{{ h_data['h_7']['Total'] }}</td>
        </tr>

        <tr>
          <td class="font-weight-medium text-left">8. Perinatal Death - Total</td>
          <td>{{ h_data['h_8']['Male'] }}</td>
          <td>{{ h_data['h_8']['Female'] }}</td>
          <td>{{ h_data['h_8']['Total'] }}</td>
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
import Header from "@/components/admin/reports/m1/Header";

export default {
  components: {
    Alert,
    Header
  },

  data() {
    return{
      loading_data: false,
      export_to_excel_data: [],
      provider_name: '',
      month: '',
      year: '',

      f_data: {
        'f_1': {},
        'f_2': {},
        'f_3': {},
        'f_4': {},
        'f_5': {},
        'f_6': {},
        'f_7': {},
        'f_8': {},
        'f_9': {},
        'f_10': {},
        'f_11': {},
        'f_12': {},
        'f_13': {},
        'f_14': {}
      },

      h_data: {
        'h_1': {},
        'h_2': {},
        'h_3': {},
        'h_4': {},
        'h_5': {},
        'h_6': {},
        'h_7': {},
        'h_8': {},
      },

      i_data: {
        'i_1': {},
        'i_a': {},
        'i_b': {}
      },

      g_data: {
        'g_1': '',
        'g1_a': '',
        'g1_b': '',
        'g1_c': '',
        'g_2': '',
        'g2_a': '',
        'g2_b': '',
        'g2_c': '',
        'g_3': ''
      },

      alert: {}
    }
  },

  methods: {
    async getSectionFGHIData(filter) {
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

      let response = await this.$services.getM1M2Report('_get_m1_ncd.php', payload)

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
          if(response.data.G.length !== 0) {
            this.g_data.g_1 = response.data.G[0].g_1
            this.g_data.g1_a = response.data.G[0].g1_a
            this.g_data.g1_b = response.data.G[0].g1_b
            this.g_data.g1_c = response.data.G[0].g1_c
            this.g_data.g_2 = response.data.G[0].g_2
            this.g_data.g2_a = response.data.G[0].g2_a
            this.g_data.g2_b = response.data.G[0].g2_b
            this.g_data.g2_c = response.data.G[0].g2_c
            this.g_data.g_3 = response.data.G[0].g_3
          } else {
            this.g_data.g_1 = 0
            this.g_data.g1_a = 0
            this.g_data.g1_b = 0
            this.g_data.g1_c = 0
            this.g_data.g_2 = 0
            this.g_data.g2_a = 0
            this.g_data.g2_b = 0
            this.g_data.g2_c = 0
            this.g_data.g_3 = 0
          }

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

            this.f_data['f_1'] = getValue('F', 'f_1')
            this.f_data['f_2'] = getValue('F', 'f_2')
            this.f_data['f_3'] = getValue('F', 'f_3')
            this.f_data['f_4'] = getValue('F', 'f_4')
            this.f_data['f_5'] = getValue('F', 'f_5')
            this.f_data['f_6'] = getValue('F', 'f_6')
            this.f_data['f_7'] = getValue('F', 'f_7')
            this.f_data['f_8'] = getValue('F', 'f_8')
            this.f_data['f_9'] = getValue('F', 'f_9')
            this.f_data['f_10'] = getValue('F', 'f_10')
            this.f_data['f_11'] = getValue('F', 'f_11')
            this.f_data['f_12'] = getValue('F', 'f_12')
            this.f_data['f_13'] = getValue('F', 'f_13')
            this.f_data['f_14'] = getValue('F', 'f_14')

            this.h_data['h_1'] = getValue('H', 'h_1')
            this.h_data['h_2'] = getValue('H', 'h_2')
            this.h_data['h_3'] = getValue('H', 'h_3')
            this.h_data['h_4'] = getValue('H', 'h_4')
            this.h_data['h_5'] = getValue('H', 'h_5')
            this.h_data['h_6'] = getValue('H', 'h_6')
            this.h_data['h_7'] = getValue('H', 'h_7')
            this.h_data['h_8'] = getValue('H', 'h_8')

            this.i_data['i_a'] = getValue('I', '10-14 y/o')
            this.i_data['i_b'] = getValue('I', '15-19 y/o')
            this.i_data['i_1'] = {
                'Male': this.i_data['i_a']['Male'] + this.i_data['i_b']['Male'],
                'Female': this.i_data['i_a']['Female'] + this.i_data['i_b']['Female'],
                'Total': this.i_data['i_a']['Total'] + this.i_data['i_b']['Total']
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
              { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 50 }
          ]
      ]

      result.push([
          { ...header_style, span: 11, align: 'center', alignVertical: 'center', value: 'Section F. Non-Communicable Disease Prevention and Control Services', backgroundColor: '#ffffff', color: '#000000', height: 60},
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
          { ...column_style, align: 'left', alignVertical: 'center', value: '1. No. of adults risk-assessed using PhilPEN - Total', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_1']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_1']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_1']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

          { ...column_style, align: 'left', alignVertical: 'center', value: '5. No. of adult women screened for Cervical Cancer using VIA/Pap Smear', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_5']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_5']['Female'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_5']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '    2. Current smokers', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_2']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_2']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_2']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

          { ...column_style, rowSpan:3, align: 'left', alignVertical: 'center', value: '6. No. of adult women fount positive / suspect for Cervical Cancer using VIA or Pap Smear', height: 30},
          { ...column_style, rowSpan:3, align: 'center', alignVertical: 'center', value: this.f_data['f_6']['Male'], height: 30},
          { ...column_style, rowSpan:3, align: 'center', alignVertical: 'center', value: this.f_data['f_6']['Female'], height: 30},
          { ...column_style, rowSpan:3, align: 'center', alignVertical: 'center', value: this.f_data['f_6']['Total'], height: 30},
          { ...column_style, rowSpan:3, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '    3. Alcohol binge drinkers', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_3']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_3']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_3']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

          { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '    4. Overweight/Obese', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_4']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_4']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_4']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

          { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
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
          { ...column_style, align: 'left', alignVertical: 'center', value: '7. No. of adult women screened for breast mass', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_7']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_7']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_7']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

          { ...column_style, align: 'left', alignVertical: 'center', value: '11. No. of senior citizens for visual acuityr', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_11']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_11']['Female'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_11']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '8. No. of adult women with suspicious for breast mass', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_8']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_8']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_8']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

          { ...column_style, align: 'left', alignVertical: 'center', value: '12. No. of senior citizens diagnosed with eye disease/s', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_12']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_12']['Female'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_12']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '9. No. of newly-identified hypertensive adults', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_9']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_9']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_9']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

          { ...column_style, align: 'left', alignVertical: 'center', value: '13. No. of senior citizens who received one (1) dose of PPV', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_13']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_13']['Female'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_13']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '10. No. of newly-identified adults with Type 2 DM', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_10']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_10']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_10']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

          { ...column_style, align: 'left', alignVertical: 'center', value: '14. No. of senior citizens who received one (1) dose of influenza vaccine', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_14']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_14']['Female'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.f_data['f_14']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...header_style, span: 11, align: 'center', alignVertical: 'center', value: 'Section G. Environmental Health and Sanitation Services', backgroundColor: '#ffffff', color: '#000000', height: 60},
      ])

      result.push([
          { ...header_style, align: 'center', alignVertical: 'center', value: 'Indicators (Col. 1)', height: 80},
          { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 80, borderColor: '#1565c0'},
          { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 80},
          { ...header_style, align: 'center', alignVertical: 'center', value: 'Total\n(Col. 4)', height: 40},
          { ...header_style, align: 'center', alignVertical: 'center', value: 'Remarks\n(Col. 5)', height: 40},

          { ...header_style, align: 'center', alignVertical: 'center', value: 'Indicators (Col. 1)', height: 40},
          { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 80, borderColor: '#1565c0'},
          { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 80},
          { ...header_style, align: 'center', alignVertical: 'center', value: 'Total\n(Col. 4)', height: 40},
          { ...header_style, align: 'center', alignVertical: 'center', value: 'Remarks\n(Col. 5)', height: 40},
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '1. No. of HHs with access to basic safe water supply - Total', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.g_data['g_1'], height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

          { ...column_style, align: 'left', alignVertical: 'center', value: '2. No. of HHs with basic sanitation facility - Total', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.g_data['g_2'], height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '  a. No. of HHs with Level I', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.g_data['g1_a'], height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

          { ...column_style, align: 'left', alignVertical: 'center', value: '  a. No. of HH with pour/flush toilet connected to septic tank', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.g_data['g2_a'], height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '  b. No. of HHs with Level II', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.g_data['g1_b'], height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

          { ...column_style, align: 'left', alignVertical: 'center', value: '  b. No. of HHs with pour/flush toilet connected to community sewer/sewerage system or any other approved treatment system', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.g_data['g2_b'], height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '  c. No. of HHs with Level III', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.g_data['g1_c'], height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

          { ...column_style, align: 'left', alignVertical: 'center', value: '  c. No. of HHs with ventilated improved pit latrine (VIP)', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.g_data['g2_c'], height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},

          { ...column_style, align: 'left', alignVertical: 'center', value: '3. No. of industrial establishments issued with sanitary permit', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.g_data['g_3'], height: 40},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 40}
      ])

      result.push([

        { ...header_style, span: 5,align: 'center', alignVertical: 'center', value: 'Section H. Mortality', backgroundColor: '#ffffff', color: '#000000', height: 60},
        { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 60},
        { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 60},
        { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 60},
        { ...header_style, align: 'center', alignVertical: 'center', value: '', backgroundColor: '#ffffff', color: '#000000', height: 60},
        { ...header_style, span: 5,align: 'center', alignVertical: 'center', value: 'Section I. Natality', backgroundColor: '#ffffff', color: '#000000', height: 60},
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
          { ...column_style, align: 'left', alignVertical: 'center', value: '1. Total Deaths', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_1']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_1']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_1']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

          { ...column_style, align: 'left', alignVertical: 'center', value: '1. Livebirths', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.i_data['i_1']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.i_data['i_1']['Female'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.i_data['i_1']['Total'], height: 30},
          { ...column_style, rowSpan: 2, align: 'center', alignVertical: 'center', value: 'CBR:\nABR:', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '2. Maternal Deaths - Total', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_2']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_2']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_2']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

          { ...column_style, align: 'left', alignVertical: 'center', value: 'a. Livebirths among 10-14 y/o womens', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.i_data['i_a']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.i_data['i_a']['Female'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.i_data['i_a']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '3. Under-five Deaths - Total', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_3']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_3']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_3']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30},

          { ...column_style, align: 'left', alignVertical: 'center', value: 'a. Livebirths among 15-19 y/o womens', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.i_data['i_b']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.i_data['i_b']['Female'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.i_data['i_b']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '4. Infant Deaths - Total', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_4']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_4']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_4']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '5. Neonatal Deaths - Total', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_5']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_5']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_5']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '6. Fetal Deaths - Total', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_6']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_6']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_6']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '7. Early Neonatal Deaths - Total', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_7']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_7']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_7']['Total'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: '', height: 30}
      ])

      result.push([
          { ...column_style, align: 'left', alignVertical: 'center', value: '8. Perinatal Death - Total', height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_8']['Male'], height: 30},
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_8']['Female'], height: 30 },
          { ...column_style, align: 'center', alignVertical: 'center', value: this.h_data['h_8']['Total'], height: 30},
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
                  { width: 30, colSpan: 8 },
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
              fileName: `${file_name_facility} - Section F, G, H and I ${report_period} - ${file_name_date}.xlsx`
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