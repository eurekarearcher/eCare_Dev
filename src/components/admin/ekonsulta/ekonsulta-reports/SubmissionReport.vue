<template>
  <v-container class="pa-0">
    <section class="mx-auto">
      <v-card class="py-5 mx-auto" flat>
        <!-- <h3 class="text-center font-weight-regular mb-5">Dinalupihan Bataan Rural Health Unit 3 (RHU 3)</h3> -->
        <!-- <h1 class="font-weight-medium grey--text text--darken-3 mb-4">Reports Page</h1> -->
        <v-sheet class="darken-3 blue pa-2 mb-2"> 
          <h6 class="font-weight-bold white--text body-1 pl-1">Submission Report</h6>
        </v-sheet>

        <v-form ref="report_data">
          <v-row class="flex-wrap pt-5" dense>
            <v-col cols="12" sm="6">
              <v-row justify="space-between" class="flex-wrap" dense>
                  <v-col cols="12" sm="6" class="text-center pr-5">
                    <label>Start Date</label>
                    <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                      <template v-slot:activator="{ on }">
                          <v-text-field 
                            v-on="on"
                            v-model="start_date" 
                            v-mask="date_mask"
                            :rules="empty_validation"
                            :disabled="disable_date" 
                            class="body-2" 
                            placeholder="MM-DD-YYYY"
                            >
                          </v-text-field>
                      </template>

                      <v-date-picker v-model="start_date_picker" @change="start_date = formatDate(start_date_picker)"  no-title></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" sm="6" class="text-center pr-5">
                      <label>End Date</label>
                      <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-text-field 
                              v-on="on"
                              v-model="end_date" 
                              v-mask="date_mask"
                              :rules="empty_validation"
                              :disabled="disable_date" 
                              class="body-2" 
                              placeholder="MM-DD-YYYY"
                              >
                            </v-text-field>
                        </template>

                        <v-date-picker v-model="end_date_picker" @change="end_date = formatDate(end_date_picker)" no-title></v-date-picker>
                      </v-menu>
                    </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" sm="4" class="mt-1">
              <v-layout wrap justify-center>
                <div class="text-center">
                  <label>Tranche #</label>
                  <v-radio-group v-model="tranche_value" :disabled="disable_tranche" :rules="empty_validation" row >
                    <v-radio label="1st Tranche" value="1"></v-radio>
                    <v-radio label="2nd Tranche" value="2"></v-radio>
                  </v-radio-group>
                </div>
              </v-layout>
            </v-col>

            <v-col cols="12" sm="2" align-self="center" class="pl-3">
              <v-btn @click="searchRecord" :loading="loading_search_btn" color="primary" type="button" block>Search <v-icon right>mdi-magnify</v-icon></v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-card-actions class="d-flex justify-end pa-0 mb-2">
          <v-row class="flex-wrap pt-3" dense>
            <v-col cols="12" sm="6">
              <v-row align="baseline" dense>
                <v-col cols="12" sm="6" class="text-center pr-5">
                  <v-select
                    v-model="selected_date_filter"
                    :items="date_filter_options"
                    item-text="text"
                    item-value="value"
                    clearable
                    dense
                    label="Filter By: "
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" sm="6" class="text-sm-right">
              <v-btn
                @click="convertToExcel"
                :disabled="patient_data.length === 0"
                :loading="excel_loader"
                color="success"
              >
                Convert to Excel
                <v-icon right>mdi-file-excel</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>

        <v-divider></v-divider>

        <!-- <v-data-table :headers="filtered_headers" :items="patient_data" :loading="loading_search_btn" :items-per-page="20" :sort-by="selected_date_filter || 'date_created'" :sort-desc="true"></v-data-table> -->
        <v-data-table
          :headers="filtered_headers"
          :items="patient_data"
          :loading="loading_search_btn"
          :items-per-page="20"
          :sort-by="selected_date_filter || 'date_created'"
          :sort-desc="true"
        >
          <template v-slot:item.pPatientType="{ item }">
            {{ item.pPatientType === 'MM' ? 'Member' : 'Dependent' }}
          </template>

          <template v-slot:item.pPatientDob="{ item }">
            {{ item.pPatientDob ? $moment(item.pPatientDob).format('MM-DD-YYYY') : '' }}
          </template>

          <template v-slot:item.pEnlistDate="{ item }">
            {{ item.pEnlistDate ? $moment(item.pEnlistDate).format('MM-DD-YYYY') : '' }}
          </template>

          <template v-slot:item.date_created="{ item }">
            {{ item.date_created ? $moment(item.date_created).format('MM-DD-YYYY') : '' }}
          </template>

          <template v-slot:item.pTransDate="{ item }">
            {{ item.pTransDate ? $moment(item.pTransDate).format('MM-DD-YYYY') : '' }}
          </template>

          <template v-slot:item.RefDate="{ item }">
            {{ item.RefDate ? $moment(item.RefDate).format('MM-DD-YYYY') : '' }}
          </template>
        </v-data-table>

      </v-card>
    </section>
  </v-container>
</template>


<script>
import excel_file from 'write-excel-file'
import { mask } from "vue-the-mask"

export default {
  directives: { mask },

  data() {
    return {
      tranche_value: '',
      start_date: '',
      start_date_picker: '',
      end_date: '',
      end_date_picker: '',
      date_mask: '##-##-####',

      date_today: new Date().toISOString().slice(0, 10),
      excel_loader: false,
      
      loading_search_btn: false,
      disable_tranche: false,
      disable_date: false,

      alert_data: {},
      headers:[
        { text: 'Name', value: 'patient_name', width:'350px', sortable: false, align:'center'},
        { text: 'Patient Type', value: 'pPatientType', sortable: false, align:'center'},
        { text: 'Patient Pin', value: 'pPatientPin', sortable: false, align:'center'},
        { text: 'Member Pin', value: 'pMemPin', sortable: false, align:'center'},
        { text: 'Date of Birth', value: 'pPatientDob', width:"120px", sortable: false, align:'center'},
        { text: 'Gender', value: 'pPatientSex', sortable: false, align:'center'},
        { text: 'Enlistment Ref No.', value: 'pHciTransNo', sortable: false, align:'center'},
        { text: 'First Tranche Ref No.', value: 'RefNo', width:"150px", sortable: false, align:'center'},
        { text: 'Enlistment Date', value: 'pEnlistDate', width:"120px", sortable: false, align:'center'},
        { text: 'First Tranche Ref Date', value: 'RefDate', width:"150px", sortable: false, align:'center'},
        { text: 'Date Created', value: 'date_created', width:"120px", sortable: false, align:'center'},
        { text: 'Recorded Date', value: 'pTransDate', width:"120px", sortable: false, align:'center'},
      ],
      patient_data: [],

      // FORM VALIDATION
      empty_validation: [
          v => !!v && !/^ *$/.test(v) || 'Required Field',
      ],

      selected_date_filter: null,

      date_filter_options: [
        { text: 'Date Created', value: 'date_created', width:"120px", sortable: false, align:'center'},
        { text: 'Transaction Date', value: 'pTransDate', width:"150px", sortable: false, align:'center'},
        { text: 'Date Submitted', value: 'RefDate', width:"150px", sortable: false, align:'center'}
      ],
    }
  },

  computed: {
    filtered_headers() {
      if (!this.selected_date_filter) {
        return this.headers
      }

      return this.headers.filter(header => {
        if (!['date_created', 'pTransDate', 'RefDate'].includes(header.value)) {
          return true
        }
        return header.value === this.selected_date_filter
      })
    }
  },

  methods: {
    async searchRecord() {
      if (this.$refs.report_data.validate()) {
        this.loading_search_btn  = true

        let response = await this.$services.getSubmittedReports({
            start_date: this.start_date,
            end_date: this.end_date,
            report_tagging: this.tranche_value,
            phic_acc_no: this.$store.state.prv_data.ekonsulta_phic_acc_no,
            filter_by: this.selected_date_filter
        })

        if (response.status === 200) {
          response.data = this.responseDataDecryption(response.data)

          if(response.data === 'No Data') {
            this.loading_search_btn = false
            this.patient_data = []
            this.alert = {
                      display: true,
                      type: "standard",
                      width: "350",
                      icon: "mdi-alert-circle",
                      color: "yellow darken-1",
                      title: '',
                      body: `No more data found for ${this.start_date} / ${this.end_date}`,
                      btn_pry_txt: "OK",
                      btn_pry_color: "primary",
                      btn_pry_otl: false,
                      btn_pry_act: "closeAlert",
                  }
          } else {
            this.patient_data = response.data
            this.loading_search_btn = false

            if (this.tranche_value === '2') {
              this.headers.find(h => h.value === 'pHciTransNo').text = 'SOAP Ref No'
              this.headers.find(h => h.value === 'pEnlistDate').text = 'SOAP Date'
              this.headers.find(h => h.value === 'RefNo').text = 'Second Tranche Ref No'
              this.headers.find(h => h.value === 'RefDate').text = 'Second Tranche Ref Date'
            } else {
              this.headers.find(h => h.value === 'pHciTransNo').text = 'Enlistment Ref No'
              this.headers.find(h => h.value === 'pEnlistDate').text = 'Enlistment Date'
              this.headers.find(h => h.value === 'RefNo').text = 'First Tranche Ref No'
              this.headers.find(h => h.value === 'RefDate').text = 'First Tranche Ref Date'
            }

            return this.patient_data = response.data.map(items => {
              const patient_name = `${items.pPatientFname} ${items.pPatientMname} ${items.pPatientLname} ${items.pPatientExtname || ''}`;
              return {...items, patient_name}
            })
          }
        } else {
          this.alert = response.error
        }
      }
    },

    convertToExcel() {
      if (this.patient_data) {
      this.excel_loader = true;
       const data_style = {
            align: 'center',
            alignVertical: 'center',
            borderColor: '#000000',
            wrap: true
        }

        let schema = [
            { ...data_style, column: 'First Name', value: value => value.pPatientFname, width: 30 },
            { ...data_style, column: 'Middle Name', value: value => value.pPatientMname, width: 30 },
            { ...data_style, column: 'Last Name', value: value => `${value.pPatientLname} ${value.pPatientExtname || ''}`, width: 30 },
            { ...data_style, column: 'Patient Type', value: value => value.pPatientType === 'MM' ? 'Member' : 'Dependent', width: 15 },
            { ...data_style, column: 'Patient Pin', value: value => value.pPatientPin, width: 25 },
            { ...data_style, column: 'Member Pin', value: value => value.pMemPin, width: 25 },
            { ...data_style, column: 'Date of Birth', value: value => value.pPatientDob, width: 20 },
            { ...data_style, column: 'Gender', value: value => value.pPatientSex },
            { ...data_style, column: this.tranche_value === '1' ? 'Enlistment Ref No.' : 'SOAP Ref No.', value: value => value.pHciTransNo, width: 40 },
            { ...data_style, column: this.tranche_value === '1' ? 'Enlistment Date' : 'SOAP Date', value: value => value.pEnlistDate, width:20 },
            { ...data_style, column: 'Date Created', value: value => value.date_created, width:20 },
            { ...data_style, column: 'Recorded Date', value: value => value.pTransDate, width:20 },
            { ...data_style, column: this.tranche_value === '1' ? 'First Tranche Ref No.' : 'Second Tranche Ref No.'  , value: value => value.RefNo, width:40 },
            { ...data_style, column: this.tranche_value === '1' ? 'First Tranche Ref Date' : 'Second Tranche Ref Date', value: value => value.RefDate, width:20 },
        ]

        const file_name_date = this.$moment().format('MM-DD-YYYY');
        const file_name_facility = this.$store.state.prv_data.provider_name;

        excel_file(this.patient_data, {
            schema,
            headerStyle: {
                alignVertical: 'center',
                fontWeight: 'bold',
                align: 'center',
                borderColor: '#FFFFFF', 
                backgroundColor: '#1565C0',
                color:'#FFFFFF',
                wrap: true

            },
            
            fileName: `${file_name_facility} - ${this.tranche_value} Tranche Report - ${file_name_date}.xlsx`
            
        })

        setTimeout(() => this.excel_loader = false , 1000)
        
      }
    },
    
    backToHomepage() {
      this.$router.push('/')
    }
  }
}
</script>