<template>
  <v-container fluid px-6>
    <Navbar  :navbar="user_navbar" />

    <Header
      :header_title="header_title"
      :search_tbl="search_tbl"
      :start_date="start_date"
      :end_date="end_date"
      :max_start_date="max_start_date"
      :key="search_reset_key"
      :loading_tbl="loading_tbl"
      :transaction_type="transaction_type"
      :trans_type="trans_type"
      :type_of_visit="type_of_visit"
      :type_of_visit_items="type_of_visit_items"
      :is_doctor_transaction_record="true"
      @resetTable="resetTable"
      @updateStartDate="updateStartDate"
      @updateEndDate="updateEndDate"
      @updateSearch="updateSearch"
      @updateTransactionType="updateTransactionType"
      @updateTypeOfVisit="updateTypeOfVisit"
    />

    <!-- TABLE FOR ADMISSION -->
      <v-data-table :headers="doctor_header_list" :items="filtered_items" :loading="loading_tbl" :mobile-breakpoint="0" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-2 mb-5" sort-by="date_created" sort-desc>
        <template v-slot:item="{ item }">
            <tr v-on:click="selectRow(item)"  @click="transaction_number = item.transaction_number" :class="{'grey lighten-2' : item.transaction_number === transaction_number}">
                <td>{{ formatDateAndTime(item.date_created)}}</td>
                <td>{{ [item.last_name,item.first_name].includes(null) ? 'N/A'  : item.first_name+(item.middle_name ? ' '+item.middle_name : '')+' '+item.last_name+(item.suffix ? ' '+item.suffix : '')}}</td>
                <td>{{ item.icd_code ? item.icd_code : 'N/A'}}</td>
                <td>{{ item.icd_description ? item.icd_description : 'N/A'}}</td>
                <td>{{ item.transaction_type }}</td>
                <td>{{ item.provider_name }}</td>
                <td>{{ item.type_of_visit }}</td>
                <td :class="item.transaction_status === 'ISSUED' ? 'success--text' : 'error--text'">{{ item.transaction_status === 'ISSUED' ? 'COMPLETED' : 'CANCELLED' }} </td>
            </tr>
          </template>
      </v-data-table>
    
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Alert :alert="alert" />

  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'
import Header from '@/components/emr/header/Header.vue'

export default {
  components:{
    Navbar, 
    Alert,
    Header
  },

  data(){
    return{
      header_title: "Transaction Record",

      // FILTER
      search_tbl: '',
      search_reset_key: 0,
      start_date: null,
      end_date: null,
      transaction_type: 'ALL',
      transaction_status: 'ALL',
      trans_type: [ 'ALL', 'CONSULTATION', 'OUTPATIENT', 'INPATIENT' ],

      type_of_visit: 'ALL',
      type_of_visit_items: ['ALL', 'REFERRED', 'WALK-IN'],

      max_start_date: this.$moment().format('YYYY-MM-DD'),

      loading_tbl: true,
      doctor_header_list:[
        { text: 'Date Admitted', value: 'date_created',width:"200px" },
        { text: 'Patient Name', value: '',width:"200px"},
        { text: 'ICD Code', value: 'icd_code',width:"100px"},
        { text: 'ICD Description', value: 'icd_description',width:"250px"},
        { text: 'Transaction Type', value: 'transaction_type', sortable: false,width:"250px" },
        { text: 'Healthcare Facility', value: 'provider_name', sortable: false,width:"250px" },
        { text: 'Type of Visit', value: 'type_of_visit', sortable: false,width:"250px" },
        { text: 'Transaction Status', value: 'transaction_status', sortable: false,width:"150px" },
      ],
      
      patient_list_items:[],
      transaction_number: '',
      overlay:false,

      cancelToken:null,
      source:null,

      alert:{},
      navbar: [
        { title: "TELEMEDICINE ASSISTED CLINIC HOURS", link: "/teleconsult-clinic-hours", icon: "fas fa-folder" },
        { title: "TELEMEDICINE ASSISTED PATIENTS", link: "/teleconsult-patients-list", icon: "fas fa-folder" },
        { title: "Patient Queue List", link: "/patient-queue-list", icon: "fas fa-folder" },
        { title: "Transaction Record List", link: "/patient-transaction-record", icon: "fas fa-clipboard-list" },
        ...(this.$store.state.usr_credentials.provider_reg_type === 'BRGY' ? [{ title: 'Referred Transaction', link: '/referred-transaction', icon: 'fas fa-clipboard-check' }] : [])
      ],
    }
  },

  created() {
    sessionStorage.clear();
    this.CancelToken = this.$axios.CancelToken;
    this.source = this.CancelToken.source();
    this.getPatientList();
  },

  computed:{
    start_date_format(){
        if(!this.start_date) return null
        return this.formatDate(this.start_date)
    },

    // FORMAT THE END DATE
    end_date_format(){
        if(!this.end_date) return null
        return this.formatDate(this.end_date)
    },

    filtered_items(){
       return this.patient_list_items.filter((i) => {

          let temp_name = [i.last_name,i.first_name]
          let member_name = temp_name.includes(null) ? 'N/A' : i.first_name + (i.middle_name ? ' '+ i.middle_name : '') +' '+ i.last_name + (i.suffix ? ' '+i.suffix : '')
          let searched_data = (member_name.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1)  || ((i.icd_code ? i.icd_code : 'N/A').toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || ((i.icd_description ? i.icd_description : 'N/A').toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || ((i.provider_name ? i.provider_name : '').toLowerCase().indexOf(this.search_tbl.toLocaleLowerCase()) > -1) || ((i.type_of_visit ? i.type_of_visit : '').toLowerCase().indexOf(this.search_tbl.toLocaleLowerCase()) > -1)
          let timestamp = i.date_created.substring(0, 10)
          
          let search = this.search_tbl ? searched_data : true
          let date = this.start_date && this.end_date ? timestamp >= this.start_date && timestamp <= this.end_date : true
          let transaction_type = this.transaction_type === 'ALL' ? true : i.transaction_type === this.transaction_type
          let type_of_visit = this.type_of_visit === 'ALL' ? true : i.type_of_visit === this.type_of_visit

          return search && date && transaction_type && type_of_visit
      })    
    },

    user_navbar() {
      let nav = []

      if (this.$store.state.usr_credentials.department === 'Medical Practitioner') {
        nav = [
          { title: "Patient Queue List", link: "/patient-queue-list", icon: "fas fa-folder" },
          { title: "Transaction Record List", link: "/patient-transaction-record", icon: "fas fa-clipboard-list" },
          ...(this.$store.state.usr_credentials.provider_reg_type === 'BRGY' ? [{ title: 'Referred Transaction', link: '/referred-transaction', icon: 'fas fa-clipboard-check' }] : [])
        ]       
      } else {
        nav = [
          { title: "TELEMEDICINE ASSISTED CLINIC HOURS", link: "/teleconsult-clinic-hours", icon: "fas fa-clock" },
          { title: "TELEMEDICINE ASSISTED PATIENTS", link: "/teleconsult-patients-list", icon: "fas fa-folder" },
          { title: "Patient Queue List", link: "/patient-queue-list", icon: "fas fa-folder" },
          { title: "Transaction Record List", link: "/patient-transaction-record", icon: "fas fa-clipboard-list" },
          ...(this.$store.state.usr_credentials.provider_reg_type === 'BRGY' ? [{ title: 'Referred Transaction', link: '/referred-transaction', icon: 'fas fa-clipboard-check' }] : [])
        ]
      }
      
      return nav
    }
  },

  methods:{
    async getPatientList() {
      let response = await this.$services.getDoctorIssuedTranRecord({
          doctor_code: this.$store.state.usr_credentials?.doctor_code,
          doctor_tin: this.$store.state.usr_credentials?.doctor_tin,
      })

      if (response.status === 200) {
        this.loading_tbl = false
        if(response.data === 'No Data'){
          this.patient_list_items = []
        }else{
          response.data = this.responseDataDecryption(response.data)
          this.patient_list_items = response.data
        }

        // this.list_timeout = setTimeout(() => this.getPatientList(), 10000)
      } else {
        this.alert = response.error
      }
    },

    selectRow(item) {
      if (this.transaction_number == item.transaction_number) {
        let session_data = {}
        this.overlay = true

        const current_date = this.$moment();
        const discharged_date = this.$moment(item.date_discharged);

        session_data = {
          transaction_number: item.transaction_number,
          ek_lgu_id: item.ek_lgu_id,
          lgu_host_code: item.lgu_host_code,
          hmo_policy_number: item.hmo_policy_number,
          hmo_host_code: item.hmo_host_code,
          ek_phic_id: item.ek_phic_id,
          phic_host_code: item.phic_host_code,
          mem_phic_pin: item.mem_phic_pin,
          from_component: 'p_tran_record',
          editable: discharged_date.isSame(current_date, 'day') || current_date.diff(discharged_date, 'days') < 1,
          date_discharged: item.date_discharged,
          routes: 'TRANSACTION RECORD'
        };

        sessionStorage.setItem('PIX235', this.$crypto.AES.encrypt(JSON.stringify(session_data), 'EMX246'));
        this.$router.push('/emr-consultation/patient-information');
      }
    },

    updateSearch(new_search) {
      this.search_tbl = new_search;
    },

    updateStartDate(new_start_date) {
      this.start_date = new_start_date;
    },

    updateEndDate(new_end_date) {
      this.end_date = new_end_date;
    },

    updateTransactionType(new_transaction_type) {
      this.transaction_type = new_transaction_type;
    },

    updateTypeOfVisit(new_type_of_visit) {
      this.type_of_visit = new_type_of_visit;
    },
    
    resetTable() {
      this.search_tbl = ''
      this.start_date = null
      this.end_date = null
      this.transaction_type = 'ALL'
      this.type_of_visit = 'ALL'
      this.search_reset_key += 1;
    }
  }
}
</script>