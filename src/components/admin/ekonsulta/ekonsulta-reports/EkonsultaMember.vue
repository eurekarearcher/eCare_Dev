<template>
  <v-container class="pa-0">
    <v-sheet class="darken-3 blue pa-2 mb-2"> 
      <h6 class="font-weight-bold white--text body-1 pl-1">Philhealth First Patient Encounter (FPE) Report</h6>
    </v-sheet>
    
    <v-row dense class="mt-4"> 
        <v-col sm="6" md="6" xl="6">
            <v-row class="flex-wrap" dense>
                <v-col cols="12" sm="4" md="4" lg="3" xl="3">
                    <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" :value="formatDate(start_date)" label="Start Date" hide-details outlined readonly dense></v-text-field>
                        </template>

                        <v-date-picker v-model="start_date" no-title></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="3" xl="3" class="pl-sm-2">
                    <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" :value="formatDate(end_date)" label="End Date" hide-details outlined readonly dense></v-text-field>
                        </template>

                        <v-date-picker v-model="end_date" :disabled="!start_date" no-title></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="6" xl="6" class="pl-2">
                    <div class="d-flex">
                        <v-btn :disabled="loading_data" @click="getSectionAData" class="white--text" color="primary" height="41">
                            <v-icon color="white" left>mdi-update</v-icon>
                            <span>LOAD SELECTED DATES</span>
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-col>
        
        <v-col class="text-right" cols="12" md="6" lg="6">
            <label>EXPORT:</label>
            <v-btn  @click="exportToExcel" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> Excel</v-btn>
        </v-col>
    </v-row>

    <section class="mx-auto">
      <v-card class="py-5 mx-auto" flat>
        <v-data-table :headers="headers" :items="patient_data" :loading="loading_search_btn" :items-per-page="5">
          <template v-slot:body.append>
            <tr v-if="patient_data.length >= 1"> 
              <td colspan="6"> </td>
              <td class="py-6"> 
                <v-text-field :value="total_fpe" label="Total count of FPE" readonly hide-details dense> </v-text-field> 
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </section>

    <!-- GENERATE EXCEL LOADER -->
    <v-dialog v-model="generate_excel_loader" width="500" persistent>
      <v-card class="text-center py-12">
          <v-progress-circular color="primary" width="6" size="80" indeterminate></v-progress-circular>
          <h3 class="light-blue--text text--darken-4 pl-5 mt-5">Generating Excel...</h3>
      </v-card>
    </v-dialog>

    <Alert :alert="alert" />
    
  </v-container>
</template>

<script>
import { mask } from "vue-the-mask"
import Alert from '@/components/Alert'

export default {
  directives: { mask },

  components: {
    Alert
  },

  data() {
    return {
      loading_data: false,
      tranche_value: '',
      start_date: '',
      start_date_picker: '',
      end_date: '',
      end_date_picker: '',
      date_mask: '####-##-##',
      max_start_date: this.$moment().format('YYYY-MM-DD'),

      date_today: new Date().toISOString().slice(0, 10),
      
      loading_search_btn: false,
      disable_tranche: false,
      disable_date: false,

      alert_data: {},
      headers:[
        { text: 'Facility Name', value: 'facility', width:'350px', sortable: false, align:'center'},
        { text: 'Registered Member', value: 'patient',  width:'600px', sortable: false, align:'center'},
        { text: 'Gender', value: 'gender', width:'100px', sortable: false, align:'center'},
        { text: 'Date of Birth', value: 'birthday', width:'150px', sortable: false, align:'center'},
        { text: 'Member Pin', value: 'phic_pin', width:'180px', sortable: false, align:'center'},
        { text: 'Date of Yakap Registration', value: 'enlistment_date', width:'250px', sortable: false, align:'center'},
        { text: 'Date of FPE', value: 'fpe_date', width:'250px', sortable: false, align:'center'},
      ],
      patient_data: [],
      total_member: '',
      total_fpe: '',
      alert: {},

      generate_excel_loader: false,
    }
  },

  methods: {
    async getSectionAData () {
      this.loading_search_btn = true

      let response = await this.$services.getEkonsultaFirstPatientEncounter({
        accre_no: this.$store.state.prv_data.ekonsulta_phic_acc_no,
        facility: this.$store.state.usr_credentials.provider_reg_type,
        start_date: this.start_date,
        end_date: this.end_date
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        this.loading_search_btn = false
        if(response.data.has_data) {
          this.patient_data = response.data.members.map(items => {
            const patient = `${items.mem_first_name} ${items.mem_middle_name} ${items.mem_last_name} ${items.mem_suffix || ''}`;
            return { ...items, patient }
          })
          this.total_member = response.data.ekonsulta_registered
          this.total_fpe = response.data.total_fpe
        }
      } else {
        this.alert = response.error
      }
    },

    exportToExcel() {
      if (this.patient_data) {
        this.generate_excel_loader = true
        const data_style = {
            align: 'center',
            alignVertical: 'center',
            borderColor: '#000000',
            wrap: true
        }

        let schema = [
            { ...data_style, column: 'Facility', value: value => value.facility, width: 60,},
            { ...data_style, column: 'First Name', value: value => value.mem_first_name, width: 30 },
            { ...data_style, column: 'Middle Name', value: value => value.mem_middle_name, width: 30 },
            { ...data_style, column: 'Last Name', value: value => `${value.mem_last_name} ${value.mem_suffix || ''}`, width: 30 },
            { ...data_style, column: 'Gender', value: value => value.gender, width: 25},
            { ...data_style, column: 'Date of Birth', value: value => value.birthday, width: 25},
            { ...data_style, column: 'Member Pin', value: value => value.phic_pin , width: 25},
            { ...data_style, column: 'Date of Yakap Registration', value: value => value.enlistment_date, width: 25},
            { ...data_style, column: 'Date of FPE', value: value => value.fpe_date, width: 25},
        ]

        const file_name_date = this.$moment().format('MM-DD-YYYY');
        const file_name_facility = this.$store.state.prv_data.provider_name;

        this.$excel_file(this.patient_data, {
            schema,
            headerStyle: {
                alignVertical: 'center',
                borderColor: '#FFFFFF', 
                fontWeight: 'bold',
                backgroundColor: '#1565C0',
                color:'#FFFFFF',
                align: 'center',
                wrap: true
            },
            
            fileName: `${file_name_facility} - Philhealth First Patient Encounter FPE Report - ${file_name_date}.xlsx`
        })

        setTimeout(() => this.generate_excel_loader = false , 1000)
      }
    },
    
    backToHomepage() {
      this.$router.push('/')
    }
  }
}
</script>