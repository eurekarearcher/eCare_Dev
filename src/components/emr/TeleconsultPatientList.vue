<template>
  <v-container fluid px-6>
    <Navbar  :navbar="navbar" />

    <Header 
      :header_title="header_title"
      :search_tbl="search_tbl"
      :start_date="start_date"
      :end_date="end_date"
      :key="search_reset_key"
      :prv_config="prv_config"
      :provider_logo="prv_config.provider_logo"
      :loading_tbl="loading_tbl"
      :current_selected_queue="current_selected_queue"
      :show_cancel_checkbox="show_cancel_checkbox"
      :transaction_type="transaction_type"
      :trans_type="trans_type"
      :transaction_status="transaction_status"
      :trans_status="trans_status"
      :is_teleconsult_patient_list="true"
      @getSelectQueue="getSelectQueue"
      @cancelQueue="cancelQueue" 
      @resetTable="resetTable"
      @updateStartDate="updateStartDate"
      @updateEndDate="updateEndDate"
      @updateSearch="updateSearch"
      @updateTransactionType="updateTransactionType"
      @updateTransactionStatus="updateTransactionStatus"
    />
    
    <!-- TABLE FOR ADMISSION -->
      <v-data-table v-model="selected_queue" :headers="doctor_header_list" :items="filtered_items" :loading="loading_tbl" :mobile-breakpoint="0" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-2 mb-5" sort-by="transaction_status" :show-select="show_cancel_checkbox" item-key="transaction_number">
        <template v-slot:header.data-table-select="{ props, on }">
          <template v-if="show_cancel_checkbox"> 
              <v-simple-checkbox v-if="props.indeterminate" v-ripple v-bind="props" :value="props.indeterminate" v-on="on" color="white"></v-simple-checkbox>
              <v-simple-checkbox v-if="!props.indeterminate" v-ripple v-bind="props" v-on="on" color="white"></v-simple-checkbox>
          </template>
        </template>

        <template v-if="!show_cancel_checkbox" v-slot:item="{ item }">
            <tr v-on:click="selectRow(item)"  @click="transaction_number = item.transaction_number" :class="{'grey lighten-2' : item.transaction_number === transaction_number}">
                <td>{{ formatDateAndTime(item.date_created)}}</td>
                <td>{{ item.queue_no }}</td>
                <td>{{ [item.last_name,item.first_name].includes(null) ? 'N/A' : item.first_name+(item.middle_name ? ' '+item.middle_name : '')+' '+item.last_name+(item.suffix ? ' '+item.suffix : '')}}</td>
                <td>{{ item.chief_complaint }}</td>
                <td>{{ item.transaction_type === 'PRE CONSULTATION' ? 'CONSULTATION' : item.transaction_type }}</td>
                <td :class="{'red--text' : item.transaction_status === 'TO PROCESS', 'orange--text' : item.transaction_status === 'ON PROCESS DOCTOR' || item.transaction_status === 'ON PROCESS MIDWIFE'}">
                  {{ item.transaction_status === 'TO PROCESS' ? 'ON QUEUE' : 'ON PROCESS' }}
                </td>
                <td>{{ item.processing_by }}</td>
                <td>{{ item.type_of_visit }}</td>
            </tr>
          </template>
      </v-data-table>
      
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Alert :alert="alert" @confirmSubmit="confirmSubmit"/>
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
    Header,
  },

  data(){
    return{
      prv_config: localStorage.getItem('dskDo3Y') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('dskDo3Y'),'ldoweSf').toString(this.$crypto.enc.Utf8)) : null, 
      header_title: "Tele Consult Patient's Queue List",

      // FILTER
      search_tbl: '',
      search_reset_key: 0,
      start_date: null,
      end_date: null,
      transaction_type: 'ALL',
      transaction_status: 'ALL',
      trans_type: [ 
        { data:'ALL', selection:'ALL' },
        { data:'PRE CONSULTATION', selection:'CONSULTATION' }
      ],
      trans_status: [
        { data: 'ALL', selection: 'ALL' },
        { data: 'TO PROCESS', selection: 'ON QUEUE'},
      ],

      type_of_visit: 'ALL',
      type_of_visit_items: ['ALL', 'REFERRED', 'WALK-IN'],

      max_start_date: this.$moment().format('YYYY-MM-DD'),

      loading_tbl: true,
      doctor_header_list:[
        { text: 'Date Admitted', value: 'date_created',width:"200px"},
        { text: 'Queue', value: 'queue_no', sortable: false, width: "120px"},
        { text: 'Patient Name', value: 'patient_name',width:"200px"},
        { text: 'Chief Complaint', value: 'chief_complaint', sortable: false, width:"150px"},
        { text: 'Transaction Type', value: 'transaction_type', sortable: false,width:"160px"},
        { text: 'Transaction Status', value: 'transaction_status', sortable: false,width:"250px"},
        { text: 'Processing By', value: 'processing_by', sortable: false, width:"250px"},
        { text: 'Type of Visit', value: 'type_of_visit', sortable: false, width:"250px"},
      ],
      
      doctor_items:[],
      transaction_number: '',
      overlay:false,

      cancelToken:null,
      source:null,

      alert:{},
      navbar: [
        { title: "TELEMEDICINE ASSISTED CLINIC HOURS", link: "/teleconsult-clinic-hours", icon: "fas fa-clock" },
        { title: "TELEMEDICINE ASSISTED PATIENTS", link: "/teleconsult-patients-list", icon: "fas fa-folder" },
        { title: "Patient Queue List", link: "/patient-queue-list", icon: "fas fa-folder" },
        { title: "Transaction Record List", link: "/patient-transaction-record", icon: "fas fa-clipboard-list" },
        ...(this.$store.state.usr_credentials.provider_reg_type === 'BRGY' ? [{ title: 'Referred Transaction', link: '/referred-transaction', icon: 'fas fa-clipboard-check' }] : [])
      ],

      data_length:0,
      show_cancel_checkbox: false,
      selected_queue: []
    }
  },

  created() {
    sessionStorage.clear();
    this.CancelToken = this.$axios.CancelToken;
    this.source = this.CancelToken.source();
    this.getDoctorList();

    this.trans_status.push({
      data: `ON PROCESS ${this.$store.state.usr_credentials.department.toUpperCase()}`,
      selection: 'ON PROCESS'
    })
  },

  computed:{
    current_selected_queue() {
      return this.selected_queue.map(data => {
        return data.transaction_number
      })
    },

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
       return this.doctor_items.filter((i) => {    
          let temp_name = [i.last_name,i.first_name]
          let member_name = temp_name.includes(null) ? 'N/A' : i.first_name + (i.middle_name ? ' '+ i.middle_name : '') +' '+ i.last_name + (i.suffix ? ' '+i.suffix : '')
          let searched_data = (member_name.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || (i.transaction_number.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || ((i.processing_by ? i.processing_by : '').toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || ((i.type_of_visit ? i.type_of_visit : '').toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1)
          let timestamp = i.date_created.substring(0, 10)
          
          let search = this.search_tbl ? searched_data : true
          let date = this.start_date && this.end_date ? timestamp >= this.start_date && timestamp <= this.end_date : true
          let transaction_type = this.transaction_type === 'ALL' ? true : i.transaction_type === this.transaction_type
          let transaction_status = this.transaction_status === 'ALL' ? true : i.transaction_status === this.transaction_status;
          let type_of_visit = this.type_of_visit === 'ALL' ? true : i.type_of_visit === this.type_of_visit

          return search && date && transaction_type && transaction_status && type_of_visit
      })    
    }
  },

  methods:{
    async getDoctorList() {
      let response = await this.$services.getDoctorPatientListByPid({
          request_key: 'tele_consult',
          doctor_tin: this.$store.state.usr_credentials.doctor_tin,
          doctor_code: this.$store.state.usr_credentials?.doctor_code,
          provider_tin: this.$store.state.prv_data.provider_tin,
          provider_code: this.$store.state.prv_data.provider_code,
      })

      if (response.status === 200) {
        this.loading_tbl = false
        if(response.data === 'no data'){
          this.doctor_items = []
        }else{
          response.data = this.responseDataDecryption(response.data)
          this.doctor_items = response.data 
          
          const has_to_process = this.doctor_items.some(data => data.transaction_status === 'TO PROCESS')
          const has_to_process_count = this.doctor_items.filter(data => data.transaction_status === 'TO PROCESS').length
          
          if(has_to_process && (has_to_process_count != this.data_length)) {
            var audio = new Audio(require('../../assets/new_transaction.mp3'));
            audio.play();
          }
          this.data_length = has_to_process_count
          

          return this.doctor_items = this.doctor_items.map(items => {
            const patient_name = `${items.first_name} ${items.middle_name ? items.middle_name : ''} ${items.last_name}`;
            const transaction_type = items.transaction_type === 'PRE CONSULTATION' ? 'CONSULTATION':'PRE CONSULTATION'
            return {...items, patient_name, transaction_type}
          })
        }
        // this.list_timeout = setTimeout(() => this.getDoctorList(), 10000)
        this.$store.dispatch('getTeleconsultPatient', this.doctor_items.length)
      } else {
        this.alert = response.error
      }
    },

    async selectRow(item){
      if (this.transaction_number == item.transaction_number) {
        let on_process_department = this.$store.state.usr_credentials.department === 'Doctor' ||  this.$store.state.usr_credentials.department === 'Midwife' ? this.$store.state.usr_credentials.department : this.$store.state.offline_transaction_doctor.department

        let session_data = {}
        this.overlay = true
        if (item.transaction_status === 'ON PROCESS DOCTOR' || item.transaction_status === 'ON PROCESS MIDWIFE') {
            session_data = {
              transaction_number: item.transaction_number,
              ek_lgu_id: item.ek_lgu_id,
              lgu_host_code: item.lgu_host_code,
              hmo_policy_number: item.hmo_policy_number,
              hmo_host_code: item.hmo_host_code,
              ek_phic_id: item.ek_phic_id,
              phic_host_code: item.phic_host_code,
              mem_phic_pin: item.mem_phic_pin,
              from_component: 't_queue_list',
              editable: true,
              tele_consult: true,
              viber_no: item.viber_no,
              preffered_contact_no: item.preffered_contact_no,
              landline_mobile_no: item.landline_mobile_no,
              routes: 'TELECONSULT'
            }
            sessionStorage.setItem('PIX235', this.$crypto.AES.encrypt(JSON.stringify(session_data),'EMX246'))
            this.$router.replace('/emr-consultation/patient-information')
        } else {
          let response = await this.$services.trnUpdateTranRecordStatus({
              transaction_number: item.transaction_number,
              transaction_status: `ON PROCESS ${on_process_department.toUpperCase()}`
          })

          if (response.status === 200) {
            session_data = {
              transaction_number: item.transaction_number,
              ek_lgu_id: item.ek_lgu_id,
              lgu_host_code: item.lgu_host_code,
              hmo_policy_number: item.hmo_policy_number,
              hmo_host_code: item.hmo_host_code,
              ek_phic_id: item.ek_phic_id,
              phic_host_code: item.phic_host_code,
              mem_phic_pin: item.mem_phic_pin,
              from_component: 't_queue_list',
              editable: true,
              tele_consult: true,
              viber_no: item.viber_no,
              preffered_contact_no: item.preffered_contact_no,
              landline_mobile_no: item.landline_mobile_no,
              routes: 'TELECONSULT'
            }
     
            sessionStorage.setItem('PIX235', this.$crypto.AES.encrypt(JSON.stringify(session_data),'EMX246'))
            this.$router.replace('/emr-consultation/patient-information')
          } else {
            this.alert = response.error
          }
        }
      }
    },

    getSelectQueue() {
      this.show_cancel_checkbox = !this.show_cancel_checkbox
    },

    cancelQueue() {
      this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow', title: 'Cancel Queue', body: 'Are you sure you want to cancel this queue? ', btn_pry_txt: 'Cancel', btn_pry_otl: true, btn_pry_act:'closeAlert', btn_sec_txt: 'Confirm', btn_sec_color:'primary', btn_sec_otl: false, btn_sec_act: 'loadingBtn', btn_sec_emt:'confirmSubmit'}
    },

    async confirmSubmit() {
      let response = await this.$services.queueListCancellation({ transaction_number: this.current_selected_queue })

      if (response.status === 200) {
        if(response.data.success){
          location.reload()
        }
      } else {
        this.alert = response.error
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

    updateTransactionStatus(new_transaction_status) {
      this.transaction_status = new_transaction_status;
    },

    resetTable() {
      this.search_tbl = ''
      this.start_date = null
      this.end_date = null
      this.transaction_type = 'ALL'
      this.transaction_status =  'ALL'
      this.type_of_visit = 'ALL'
      this.search_reset_key += 1;
    }
  }
}
</script>
<style scoped>
::v-deep.v-icon.notranslate.mdi.mdi-checkbox-blank-outline.theme--light:first-of-type {
  color:rgb(255, 255, 255) !important;
}
</style>