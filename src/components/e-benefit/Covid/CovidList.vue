<template>
  <v-container fluid px-6>
    <Navbar />

    <v-row justify="space-between" class="mt-3" dense>
      <h2 class="font-weight-medium align-self-end order-1 order-sm-0">Covid-19</h2>
      <v-col cols="12" sm="4" md="3" class="order-0 order-sm-1">
        <v-img v-if="prv_config" :src="prv_config.provider_logo" class="ml-sm-auto mx-sm-0 mx-auto" height="60"  width="180" max-width="200" alt="provider logo" contain></v-img>
      </v-col>
    </v-row>

    <v-row justify="space-between" align="center" class="mt-1 mb-5" dense>
      <v-col cols="12" sm="12" md="10">
        <v-text-field v-model="search_tbl" placeholder="Search" class="mb-2" outlined dense rounded hide-details></v-text-field>
      </v-col>

      <v-col cols="12" md="2" class="text-right">
        <v-btn @click="resetTable" color="secondary lighten-3">CLEAR SEARCHES<i class="fas fa-redo-alt pl-2 pt-1"></i></v-btn>
      </v-col>
    </v-row>
   
    <v-col cols="12" md="5" class="my-5">
      <v-row align="center" justify="space-between" dense>
        <v-col cols="12" md="2" align-self="center">
          FILTER: <span class="pl-3">Date</span>
        </v-col>

        <v-col cols="12" sm="6" md="5" class="pr-sm-2 mb-3">
          <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y >
              <template v-slot:activator="{ on }">
                <v-text-field  v-model="start_date_format"  v-on="on" label="Start Date" outlined dense readonly hide-details></v-text-field>
              </template>
              <v-date-picker  v-model="start_date"  :max="max_start_date"  no-title></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" sm="6" md="5" class="mb-3">
          <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
              <template v-slot:activator="{ on }">
                <v-text-field  v-model="end_date_format" v-on="on" label="End Date" outlined dense readonly hide-details></v-text-field>
              </template>
              <v-date-picker v-model="end_date" :min="start_date" :disabled="!start_date" no-title></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-col>

    <!-- TABLE FOR ADMISSION -->
    <v-data-table :headers="cl_header_list" :items="filtered_items" :mobile-breakpoint="0" :loading="loading_tbl" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-2 mb-5" sort-by="date_created" sort-desc>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ formatDateAndTime(item.date_created) }}</td> 
          <td>{{ [item.mem_last_name,item.mem_first_name].includes(null) ? 'N/A' : item.mem_first_name+(item.mem_middle_name ? ' '+item.mem_middle_name : '')+' '+item.mem_last_name+(item.mem_suffix ? ' '+item.mem_suffix : '')}}</td>
          <td>{{ item.mem_age}}</td>
          <td>{{ item.doctor_name ? 'DR. '+item.doctor_name.toUpperCase() : ''}}</td>
          <td>{{ item.post_doctor_name ? 'DR. '+item.post_doctor_name.toUpperCase() : '' }}</td>
          <td>{{ item.prv_name}}</td>
         
          <td  v-if="!item.test_result" class="py-2">

            <v-btn @click="changeTestResult(item,'POSITIVE')" class="my-1 mx-3" small tile dark color="red lighten-1">POSITIVE</v-btn>
            <v-btn @click="changeTestResult(item,'NEGATIVE')" class="my-1 mx-3" small tile dark color="green lighten-1">NEGATIVE</v-btn>
       
          </td>
          <td v-else>{{item.test_result}}</td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="negative_modal" width="1050px" persistent>
      <v-card>
        <v-card-title class="headline justify-center light-blue darken-4 white--text">
          <v-spacer></v-spacer>COVID TEST CASE<v-spacer></v-spacer>
        </v-card-title>
        <v-card-text class="my-4">
          <v-col cols="12" sm="12" md="12" lg="12" xl="12" align-self="center" class="pr-3 mt-10">
              <label for="doctor-name" >INTERPRETED BY DOCTOR</label>
              <!-- <v-card class="selectedDoctor font-weight-medium"  outlined>TEST</v-card> -->
              <v-autocomplete v-model="doctor_data.doctor_displayed" @change="populateData(doctor_data.doctor_displayed)" :items="doctor_items" item-text="autoCompleteText" placeholder="Search Doctor name or Specialization" class="font-weight-medium mt-2" color="grey--text text--darken-3" outlined hide-details append-icon="" hide-no-data hide-selected prepend-inner-icon return-object dense clearable>
                <template v-slot:prepend-inner >
                  <v-icon>mdi-magnify</v-icon>
                  <v-icon size="18" right>fas fa-user-md</v-icon>
                </template>
             
                <template v-slot:selection="{item}">
                  {{item.doctor_name}} / {{item.specialization}}
                </template>

                <template v-slot:item="{ item }">
                  <v-layout wrap>
                    <v-list-item-avatar color="indigo" class="headline font-weight-light white--text">{{ item.doctor_name.charAt(0) }}</v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.doctor_name"></v-list-item-title>
                        <v-list-item-subtitle v-text="item.specialization"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-layout>
                </template>
              </v-autocomplete>
          </v-col>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="justify-center" >
          <v-btn @click="cancelSubmit"  class="btn mr-2 px-2 mt-2 mb-2" color="secondary" rounded outlined><v-icon small left>fas fa-times-circle</v-icon><span class="pr-2">CANCEL</span></v-btn> 
          <v-btn @click="submitResult"  class="btn mr-2 px-2 mt-2 mb-2" color="light-blue darken-4 white--text" rounded  >SUBMIT <v-icon small right>fas fa-check-circle</v-icon></v-btn> 
        </v-card-actions>
      </v-card>
    </v-dialog>
     
    <Alert :alert="alert"  @confirmResultCovid="confirmResultCovid"/>
  </v-container>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Alert from '@/components/Alert.vue'

export default {
  components:{
    Navbar,
    Alert
  },

  data() {
    return {
      prv_config: localStorage.getItem('dskDo3Y') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('dskDo3Y'),'ldoweSf').toString(this.$crypto.enc.Utf8)) : null, 

     // FILTER
      search_tbl: '',
      start_date: null,
      end_date: null,
      transaction_type: 'ALL',
      transaction_status: 'ALL',
      trans_type: [ 'ALL', 'CONSULTATION', 'OUTPATIENT', 'INPATIENT' ],
      trans_status: [ 'ALL', 'ON HOLD', 'WAITING FOR APPROVAL', 'CUSTOMER CARE RESPONDED' ],

      // DATE PICKER
      max_start_date: this.$moment().format('YYYY-MM-D'),

      loading_tbl: true,
      cl_header_list: [
        { text: 'Date Created', value: 'date_created', width:"200px" },
        { text: 'Patient Name', value: 'patient_name',sortable: false ,  width:"250px"},
        { text: 'Age', value: 'age', sortable: false,  width:"50px" },
        { text: 'Requested By', value: 'requested_by', sortable: false,  width:"250px" },
        { text: 'Interpreted By', value: 'interpreted_by', sortable: false ,  width:"250px" },
        { text: 'Health Care Provider', value: 'hospital_name', sortable: false,  width:"250px" },
        { text: 'Test Result', value: 'test_result', sortable: false,  width:"200px" },
      ],
      cl_items: [],

      alert: {},
      date_today: this.$moment().format('YYYY-MM-DD'),
      cancelToken:null,
      source:null,
      covid_timeout:'',

      //DATA
      test_result:'',

      negative_modal: false,

      doctor_list:[],

      submit_data : {},
      doctor_data :{
        doctor_code: '',
        doctor_name: '',
        specialization: '',
        doctor_tin: '',
        doctor_prc_license: '',
        doctor_phic_account_no: '',
        doctor_displayed:'',
      },
    }
  },
  
  created () {
    this.CancelToken = this.$axios.CancelToken;
    this.source = this.CancelToken.source();
    this.getCovidList();
    this.getDoctorList();
  },

  computed: {
   // FORMAT THE START DATE
    start_date_format(){
      return this.formatDate(this.start_date)
    },

    // FORMAT THE END DATE
    end_date_format(){
      return this.formatDate(this.end_date)
    },

    doctor_items () {
      return this.doctor_list.map(list => {
        const doctor_name            = list.doctor_name.replace(/[,.]/g, '')
        const specialization         = list.specialization
        const doctor_code            = list.hmo_doctor_code
        const doctor_tin             = list.doctor_tin_no
        const doctor_phic_account_no = list.doc_phic_acc_no
        const doctor_prc_license     = list.doc_prc_license
        const autoCompleteText = doctor_name+' / '+specialization +' '+ doctor_tin
        return Object.assign({},{doctor_name,specialization,doctor_code,doctor_tin,autoCompleteText,doctor_prc_license,doctor_phic_account_no})
      })
    },

    filtered_items() {
      return this.cl_items.filter((i) => {
        let temp_name = [i.mem_first_name,i.mem_last_name]
        let member_name = temp_name.includes(null) ? 'N/A' : i.mem_first_name + (i.mem_middle_name ? ' '+ i.mem_middle_name : '') +' '+ i.mem_last_name + (i.mem_suffix ? ' '+i.mem_suffix : '')

        let searched_data = (member_name.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || (i.mem_age.toString().toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || ((i.doctor_name ? i.doctor_name: '').toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || ((i.post_doctor_name ? i.post_doctor_name : '').toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || ((i.test_result ? i.test_result : '').toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1)
        let timestamp = i.date_created.substring(0, 10)
        
        let search = this.search_tbl ? searched_data : true
        let date = this.start_date && this.end_date ? timestamp >= this.start_date && timestamp <= this.end_date : true
        // let test_result = this.transaction_type === 'ALL' ? true : i.transaction_type === this.transaction_type
        return search && date 
      })    
    }
  },

  methods:{
    async getCovidList(){
      let response = await this.$services.getComDiseaseTestCases({
        provider_tin: this.$store.state.prv_data.provider_tin,
        provider_code: this.$store.state.prv_data.provider_code,
      })

      if(response.status === 200) {
       this.loading_tbl = false
        if(response.data.has_data){
          response.data = this.responseDataDecryption(response.data)
          this.cl_items = response.data.test_case_list
        }else{
          this.cl_items = []
        }
        this.covid_timeout = setTimeout(() => this.getCovidList(), 3000)
      } else {
        this.alert = response.error
      }
    },

    async getDoctorList(){
      //API DATA FOR AUTOCOMPLETES
      if (this.doctor_items.length > 0) return
      if (this.doc_loader) return
      this.doc_loader = true
      let response = await this.$services.getTransactionIpRefData({
        request_key    : 'patient_doctor',
        host_doctor    :'LGU',
        provider_code  : this.$store.state.prv_data.provider_code, 
        provider_tin   : this.$store.state.prv_data.provider_tin,
        hmo_host_code  : undefined,
        phic_host_code : undefined,
        lgu_host_code  : this.$store.state.usr_credentials.lgu_host_code
      })

      if(response.status === 200) {
        this.doc_loader = false
        response.data = this.responseDataDecryption(response.data)
        if(response.data === 'Data not found.') return this.doctor_list = []
        this.doctor_list = response.data
      } else {
        this.alert = response.error
      }
    },

    populateData(item){
        if(!item){  // IF USER USE BACKSPACE TO DELETE THE DATA
          this.doctor_data.doctor_code             =  ''
          this.doctor_data.doctor_name             =  ''
          this.doctor_data.specialization          =  ''
          this.doctor_data.doctor_tin              =  ''
          this.doctor_data.doctor_prc_license      =  ''
          this.doctor_data.doctor_phic_account_no  =  ''
          this.doctor_data.doctor_displayed        =  ''
        }else{
          this.doctor_data.doctor_code             = item.doctor_code ? item.doctor_code : ''
          this.doctor_data.doctor_name             = item.doctor_name ? item.doctor_name : '' 
          this.doctor_data.specialization          = item.specialization ? item.specialization : '' 
          this.doctor_data.doctor_tin              = item.doctor_tin ? item.doctor_tin : ''
          this.doctor_data.doctor_prc_license      = item.doctor_prc_license ? item.doctor_prc_license : ''
          this.doctor_data.doctor_phic_account_no  = item.doctor_phic_account_no ? item.doctor_phic_account_no : '' 
          this.doctor_data.doctor_displayed        = item.doctor_name+' / '+item.specialization+' '+item.doctor_tin
        }
    },

    submitResult(){
      if(!this.doctor_data.doctor_displayed) {
        this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Field is empty/Invalid Value', body: 'Please fill out all required fields.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        return 
      }
      let patient_name = this.submit_data.mem_first_name + ' ' + (this.submit_data.mem_middle_name ? this.submit_data.mem_middle_name : '') + ', ' + this.submit_data.mem_last_name + ' ' + (this.submit_data.mem_suffix ? this.submit_data.mem_suffix : '')
      let alert_title = '<span class="font-weight-bold body-2" style="font-size:11.5pt">COVID-19 TEST RESULT OF PATIENT</span> <br/> <span class="body-2 font-weight-medium">'+patient_name+'</span><br/><span class="font-weight-bold body-2" style="font-size:11.5pt">IS NEGATIVE AS INTERPRETED BY</span><br/><span class="body-2 font-weight-medium">DR.'+ this.doctor_data.doctor_name+'</span>'
      let alert_body = '<br>please confirm to proceed'
      this.alert = { 
        display: true, 
        type: 'standard', 
        width: '620', 
        icon: 'mdi-alert-circle', 
        color: 'blue darken-1', 
        title: alert_title, 
        body: alert_body, 
        btn_pry_txt: 'Confirm', 
        btn_pry_color: 'primary', 
        btn_pry_otl: false, 
        btn_pry_act: 'loadingBtn',  
        btn_pry_emt: 'confirmResultCovid',
        btn_sec_txt: 'Cancel', 
        btn_sec_color: 'secondary', 
        btn_sec_otl: true, 
        btn_sec_act: 'closeAlert',
      }
    },

    cancelSubmit(){
      this.negative_modal = false
      this.submit_data = {}
      this.doctor_data = {
        doctor_code: '',
        doctor_name: '',
        specialization: '',
        doctor_tin: '',
        doctor_prc_license: '',
        doctor_phic_account_no: '',
        doctor_displayed:'',
      }
    },

    async confirmResultCovid(){
      let response = await this.$services.trnUpdateComDiseaseTestCase({
        com_disease_test_cases_id: this.submit_data.com_disease_test_cases_id,
        transaction_number    : this.submit_data.transaction_number,
        post_doctor_tin       : this.doctor_data.doctor_tin,
        post_doctor_code      : this.doctor_data.doctor_code,
        cpt_code              : this.submit_data.cpt_code,
        disease               : 'covid',
        test_result           : 'NEGATIVE',
      })

      if(response.status === 200) {
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: 'Transaction has been completed', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage'}
      } else {
        this.alert = response.error
      }
    },

    changeTestResult(item,type){
      if (type === 'POSITIVE') {
        sessionStorage.setItem('LSH4GF',this.$crypto.AES.encrypt(JSON.stringify(item),'fsdsaxt'))
        this.$router.push('/covid-test-case')
      } else {
        this.submit_data = item
        this.negative_modal = true
        this.getDoctorList();
      }
    },

    resetTable(){
      this.search_tbl = ''
      this.start_date = null
      this.end_date = null
    },

  },
  
  beforeDestroy() {
    clearTimeout(this.covid_timeout)
    this.source.cancel();
  },
}
</script>


