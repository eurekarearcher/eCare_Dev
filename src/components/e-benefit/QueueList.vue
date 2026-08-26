<template>
  <v-container fluid px-6>
    <Navbar v-if="!['Data Encoder', 'Medical Laboratory Technologists'].includes($store.state.usr_credentials.department)" :navbar="navbar"  :help_menu="help_menu"/>
    <h2 class="font-weight-medium mt-3">
      {{ $store.state.usr_credentials.department === "Data Encoder" ? 'Diagnostic Exam Post Encoding' : $store.state.usr_credentials.department === "Medical Laboratory Technologists" 
        ? 'Diagnostic Exam Encoding' : 'Queue List'
      }}
    </h2>
      
      <v-row wrap justify="space-between" align="center" class="mt-1 mb-5">
        <v-col cols="12" md="9" lg="10">
            <v-text-field v-model="search_tbl" placeholder="Search" class="mb-2" outlined dense rounded hide-details></v-text-field>
        </v-col>

        <v-col cols="12" md="3" lg="2" class="text-right">
            <v-btn @click="resetTable" color="secondary lighten-3">CLEAR SEARCHES<i class="fas fa-redo-alt pl-2 pt-1"></i></v-btn>
        </v-col>
      </v-row>

      <v-row wrap class="mt-4 mb-5" justify="space-between">
        <v-col cols="12" md="5">
          <v-row wrap justify="space-between">
            <v-col cols="12" md="2" align-self="center">FILTER: <span class="pl-4">Date</span></v-col>
            <v-col cols="12" md="5" class="pr-sm-2 mb-3">
                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y >
                    <template v-slot:activator="{ on }">
                        <v-text-field  v-model="start_date_format"  v-on="on" label="Start Date" outlined dense readonly hide-details></v-text-field>
                    </template>
                    <v-date-picker  v-model="start_date"  :max="max_start_date"  no-title></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="12" md="5" class="mb-3">
              <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                  <template v-slot:activator="{ on }">
                      <v-text-field  v-model="end_date_format" v-on="on" label="End Date" outlined dense readonly hide-details></v-text-field>
                  </template>
                  <v-date-picker v-model="end_date" :max="max_start_date" :min="start_date" :disabled="!start_date" no-title></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="5">
            <v-row wrap>
                <v-col cols="12" md="6" class="pr-sm-2 mb-3">
                    <v-select v-model="transaction_status" :items="trans_status" label="Transaction Status" height="10" outlined dense hide-details></v-select>
                </v-col>
                <v-col cols="12" md="6" class="mb-3">
                    <v-select v-model="transaction_type" :items="trans_type" label="Transaction Type" height="10" outlined dense hide-details></v-select>
                </v-col>
            </v-row>
        </v-col>

        <v-col cols="12" md="12">
          <v-row v-if="!['Data Encoder', 'Medical Laboratory Technologists'].includes($store.state.usr_credentials.department)" class="mt-1" justify="space-between" align="center" dense>
            <v-col cols="12" md="6" xs="12">
              <v-switch 
                :disabled="loading_tbl" 
                @change="openTransferToAnotherDoctor" 
                class="mx-1" 
                height="41" 
                color="success" 
                label="Select Patient to Transfer" 
                inset dense hide-details
              ></v-switch>
            </v-col>

            <v-col cols="12" md="6" xs="12" class="d-flex  justify-start justify-md-end">
              <template v-if="transfer_to_another_doctor">
                <v-btn 
                  :disabled="isTransferButtonDisabled" 
                  @click="transferButtonClick" 
                  class="ml-2 mt-4" 
                  color="primary" 
                  height="41"
                >
                  Transfer to Another Doctor
                </v-btn>
              </template>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- TABLE FOR ADMISSION-->
      <v-data-table v-model="selected_transactions"
      :headers="ql_header_list" :items="filtered_items" :loading="loading_tbl" :mobile-breakpoint="0" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }"  class="elevation-2 mb-5" sort-by="date_updated" sort-desc :show-select="transfer_to_another_doctor" item-key="transaction_number">

        <template v-slot:header.data-table-select="{ props, on }">
          <template v-if="transfer_to_another_doctor "> 
            <v-simple-checkbox v-if="props.indeterminate" v-ripple v-bind="props" :value="props.indeterminate" v-on="on" style="color: white !important"></v-simple-checkbox>
            <v-simple-checkbox v-if="!props.indeterminate" v-ripple v-bind="props" v-on="on" color="white"></v-simple-checkbox>
          </template>
        </template>

        <!-- <template v-if="!transfer_to_another_doctor" v-slot:item="{ item }">
          <tr>
            <td>{{ formatDateAndTime(item.date_created) }}</td>
            <td>{{ item.date_updated }}</td>
            <td>{{ [item.mem_last_name,item.mem_first_name].includes(null) ? 'N/A'  : item.mem_first_name+(item.mem_middle_name ? ' '+item.mem_middle_name : '')+' '+item.mem_last_name+(item.mem_suffix ? ' '+item.mem_suffix : '')}}</td>
            <td>{{ item.transaction_number }}</td>
            <td>{{ item.transaction_type === 'PRE CONSULTATION' ? 'CONSULTATION' : item.transaction_type }}</td>
            <td>{{ item.transaction_status}}</td>
            <td>{{ item.doctor }}</td>
            <td><span v-if="item.is_scanned === '2'">Created By Member<br/></span>{{ item.created_by }}</td>
            <td>{{ item.processing_by }}</td>
          </tr>
        </template> -->

        <template v-if="!transfer_to_another_doctor" v-slot:item="{ item }">
          <tr @dblclick="selectRow(item)" :class="{ 'selected-row': item.transaction_number === transaction_number }" style="cursor: pointer;">
            <td>{{ formatDateAndTime(item.date_created) }}</td>
            <td>{{ item.date_updated }}</td>
            <td>{{[item.mem_last_name, item.mem_first_name].includes(null)? 'N/A': item.mem_first_name + (item.mem_middle_name ? ' ' + item.mem_middle_name : '') + ' ' + item.mem_last_name + (item.mem_suffix ? ' ' + item.mem_suffix : '')}}</td>
            <td>{{ item.transaction_number }}</td>
            <td>{{ item.transaction_type === 'PRE CONSULTATION' ? 'CONSULTATION' : item.transaction_type }}</td>
            <td>{{ item.transaction_status }}</td>
            <td>{{ item.doctor }}</td>
            <td><span v-if="item.is_scanned === '2'">Created By Member<br/></span>{{ item.created_by }}</td>
            <td>{{ item.processing_by }}</td>
          </tr>
        </template>
        
      </v-data-table>

      <v-dialog v-model="show_doctor_dialog"  width="800" persistent>
        <v-card>
          <v-card-title>Select a Doctor</v-card-title>
          <v-card-text>
            <v-flex lg12 md12 xs12>
              <v-text-field v-model="tbl_search" placeholder="Search" class="mb-2" outlined dense hide-details></v-text-field>
            </v-flex>
            <v-data-table :headers="tbl_headers" :items="doctor_items" :search="tbl_search" :loading="loading_doctor_tbl" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :items-per-page="10"> 
              <template v-slot:item="{ item }">
                <tr @click="selectDoctor(item)" :class="{ 'selected-row': selected_doctor_id === item.doctor_code }">
                  <td class="d-flex justify-center align-center">
                      <div :class="[item.status === 'IN'? 'status-circle-green':'status-circle-red', 'mr-2']"> </div>
                  </td>
                  <td>{{ item.doctor_name }}</td>
                  <td>{{ item.specialization }}</td>
                  <td>{{ item.doctor_code }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>

          <v-col cols="12" sm="12" md="10" lg="10" xl="12">
            <div class="d-flex justify-center"> 
              <v-btn @click="closeDoctorDialog"  class="mr-2" color="primary" outlined>Cancel</v-btn>
              <v-btn color="primary" :disabled="!selected_doctor" @click="transferPatientToAnotherDoctor()">Submit</v-btn> 
            </div>
          </v-col>
        </v-card>
      </v-dialog>

      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    <Alert :alert="alert" />
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'

export default {
  components:{
    Navbar,
    Alert,
  },
  
  data() {
    return {
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
    

      // TABLE
      loading_tbl: true,
      ql_headers_adjustment: [
        { text: '', value: 'checkbox', sortable: false, width:"50px"  }
      ],
      ql_header_list: [
        { text: 'Date Created', value: 'date_created',width:'200px' },
        { text: 'Date Updated', value: 'date_updated',width:"200px"},
        { text: 'Patient Name', value: 'patient_name', sortable: false ,width:"250px"},
        { text: 'Transaction Number', value: 'transaction_number', sortable: false, width:"150px" },
        { text: 'Transaction Type', value: 'transaction_type', sortable: false,width:"160px"},
        { text: 'Transaction Status', value: 'transaction_status', sortable: false,width:"250px" },
        { text: 'Doctor', value: 'doctor', sortable: true,width:"200px" },
        { text: 'Created By', value: 'created_by', sortable: false,width:"150px" },
        { text: 'Processing By', value: 'processing_by', sortable: false,width:"150px"  },
      ],
      ql_items: [],
      transaction_number: '',
      overlay:false,
      transfer_to_another_doctor: false,
      session_data:{},
    
      // NAVBAR
      navbar: [ 
        { title: 'Telemedicine Assisted Patient List', link: '/teleconsult-queue-list', icon: 'fas fa-clipboard-list'}, 
        { title: 'Queue List', link: '/queue-list', icon: 'fas fa-clipboard-list'},
        // { title: 'Philhealth Claims', link: '/patient-list', icon: 'mdi mdi-folder'},
        { title: 'Home', link: '/code-scanning', icon: 'fas fa-home'} 
      ],
      help_menu: [{ content: 'Patient List'}],

      alert:{},

      cancelToken:null,
      source:null,
      show_doctor_dialog: false,
      //DOCTOR LIST FOR TRANSFERING PATIENTS
      loading_doctor_tbl: true,
      doctor_list: [],
      tbl_search: '',
      tbl_headers: [
        { text: 'Active Status', value: 'status', width: '100px' },
        { text: 'Doctor Name', value: 'doctor_name', width: '250px' },
        { text: 'Specialization', value: 'specialization', width: '100px', sortable: false },
        { text: 'Doctor Code', value: 'doctor_code', width: '100px', sortable: false }
      ],
      tbl_items: [],
      selected_transactions: [], 
      selected_doctor: null,
      selected_doctor_id: null,
      is_data_encoder: '',
      ek_lgu_id: ''
    }
  },

  created() {
    sessionStorage.clear();
    
    if(this.$store.state.usr_credentials.department === 'Data Encoder' || this.$store.state.usr_credentials.department === 'Medical Laboratory Technologists'){
      this.getDataEncoderQueueList()
    } else {
      this.getQueueList()
    }
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

    filtered_items() {
      return this.ql_items.filter((i) => {
        let temp_name = [i.mem_first_name,i.mem_last_name]
        let member_name = temp_name.includes(null) ? 'N/A' : i.mem_first_name + (i.mem_middle_name ? ' '+ i.mem_middle_name : '') +' '+ i.mem_last_name + (i.mem_suffix ? ' '+i.mem_suffix : '')
        let searched_data = (member_name.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || (i.transaction_number.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || (i.created_by.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || ((i.processing_by ? i.processing_by : '').toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1)
        let timestamp = i.date_created.substring(0, 10)
        
        let search = this.search_tbl ? searched_data : true
        let date = this.start_date && this.end_date ? timestamp >= this.start_date && timestamp <= this.end_date : true
        let transaction_type = this.transaction_type === 'ALL' ? true : i.transaction_type === this.transaction_type
        let transaction_status = this.transaction_status === 'ALL' ? true : i.transaction_status === this.transaction_status

        return search && date && transaction_type && transaction_status
      })    
    },
    
    doctor_items () {
      return this.doctor_list.map(list => {
        const doctor_name            = list.doctor_name.replace(/[,.]/g, '')
        const specialization         = list.specialization
        const doctor_code            = list.hmo_doctor_code
        const doctor_tin             = list.doctor_tin_no
        const doctor_phic_account_no = list.doc_phic_acc_no
        const doctor_prc_license     = list.doc_prc_license
        const status                 = list.status
        const autoCompleteText = doctor_name+' / '+specialization +' '+ doctor_tin
        return Object.assign({},{doctor_name,specialization,doctor_code,doctor_tin,autoCompleteText,doctor_prc_license,doctor_phic_account_no,status})
      })
    },

    //ENABLE TRANSFER PATIENT TO ANOTHER DOCTOR BUTTON
    isTransferButtonDisabled() {
      return this.selected_transactions.length === 0;
    }
  },

  methods: {
    // GET QUEUE LIST
    async getQueueList(){
      let response = await this.$services.getTransactionQueue({
        user_type: this.$store.state.usr_credentials.user_type,
        provider_tin: this.$store.state.prv_data.provider_tin,
        provider_code: this.$store.state.prv_data.provider_code
      })

      if (response.status === 200) {
        this.loading_tbl = false
        
        // if (this.$route.name === 'QueueList') {
        //   this.queue_timeout = setTimeout(() => this.getQueueList(), 2000)
        // }

        if(response.data === 'Data not found.'){
          this.ql_items = []
        } else {
          response.data = this.responseDataDecryption(response.data)
          this.ql_items = response.data
  
          return this.ql_items = this.ql_items.map(items => {
            const firstName = items.mem_first_name || '';  
            const middleName = items.mem_middle_name ? ` ${items.mem_middle_name}` : ''; 
            const lastName = items.mem_last_name || ''; 
  
            const patient_name = [firstName, lastName].includes(null)? 'N/A' : `${firstName}${middleName} ${lastName}`.trim();
            const doctor_name = items.doctor
            const transaction_type = items.transaction_type === 'PRE CONSULTATION' ? 'CONSULTATION':'PRE CONSULTATION'
            return {...items, patient_name, doctor_name, transaction_type}
          })
        }
      } else {
        this.alert = response.error
      }
    },

    // GET QUEUE LIST FOR DATA ENCODER
    async getDataEncoderQueueList(){
      let response = await this.$services.getPostEncoddQueueList({
        provider_code: this.$store.state.prv_data.provider_code
      })

      if (response.status === 200) {
        this.loading_tbl = false
        response.data = this.responseDataDecryption(response.data)
        this.ql_items = response.data
      } else {
        this.alert = response.error
      }
    },
    
    //SWITCH SELECT PATIENT TO TRANSFER
    openTransferToAnotherDoctor() {
      this.transfer_to_another_doctor = !this.transfer_to_another_doctor;
      this.search_tbl = ''
      if (this.transfer_to_another_doctor) {
        this.selected_transactions = [];
      }
    },
    
    // OPEN DIALOG AND FETCH DOCTOR LIST TO PREVENT REOPENING DIALOG DUE TO this.list_timeout
    async transferButtonClick() {
      this.show_doctor_dialog = true;
        await this.getDoctorList();
    },

    // FOR DOCTOR DATA 
    async getDoctorList() {
      let response = await this.$services.getTransactionIpRefData({
        request_key    : 'patient_doctor',
        host_doctor    :'LGU',
        provider_code  : this.$store.state.prv_data.provider_code, 
        provider_tin   : this.$store.state.prv_data.provider_tin,
        hmo_host_code  : undefined,
        phic_host_code : undefined,
        lgu_host_code  : this.$store.state.usr_credentials.lgu_host_code || undefined
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        this.loading_doctor_tbl = false
        if(response.data === 'Data not found.') return this.doctor_list = []
        let doctor_masterlist = response.data;

        // GET THE LIST OF PRESELECTED DOCTORS
        let preselected_doctors = this.selected_transactions.map(transaction => transaction.doctor);

        // FILTER OUT PRESELECTED DOCTORS FROM THE DOCTOR LIST
        doctor_masterlist = doctor_masterlist.filter(doctor => !preselected_doctors.includes(doctor.doctor_name));

        this.doctor_list = doctor_masterlist;

        if(this.show_doctor_dialog){
          this.list_timeout = setTimeout(() => this.getDoctorList(), 20000)
        }
      } else {
        this.alert = response.error
      }
    },

    //CHANGING ROW BACKGROUND COLOR IF A DOCTOR IS SELECTED 
    selectDoctor(item) {
      let transaction_numbers = this.selected_transactions.map(transaction => {
        return transaction.transaction_number;
      });
      this.selected_doctor_id = item.doctor_code;
      this.selected_doctor = {
        ...item, 
        transaction_numbers 
      };
    },

    //TRANSFER PATIENT METHOD
    async transferPatientToAnotherDoctor() {
      let transaction_numbers = this.selected_transactions.map(transaction => {
        return transaction.transaction_number;
      });
      let response = await this.$services.trnAddTransferPatient({
          transaction_number: transaction_numbers,  
          doc_code: this.selected_doctor.doctor_code, 
          doc_tin: this.selected_doctor.doctor_tin,  
          doc_phic_acc_no: this.selected_doctor.doctor_phic_account_no,
          doc_prc_license: this.selected_doctor.doctor_prc_license
        })
        response.data = this.responseDataDecryption(response.data)
        if (response.status === 200) {
          if (response.data.success) {
            location.reload();  
          }   
        } else {
          this.alert = response.error;
        }
      },

    closeDoctorDialog(){
      this.show_doctor_dialog = false
      this.selected_doctor = ''
    },
    
    selectRow(item) {
      let is_clicked = false;  
      // Only navigate for 'Data Encoder'
      if (this.$store.state.usr_credentials.department === 'Data Encoder' || this.$store.state.usr_credentials.department === 'Medical Laboratory Technologists') {
        if (is_clicked) return; 
        is_clicked = true;
        const payload = {
          transaction_number : item.transaction_number,
          ek_lgu_id: item.ek_lgu_id,
          ...item
        }
        
        this.$store.dispatch("updateTransactionData", payload)
        this.$router.push('/diagnostic-lab');
      } else {
        // For other departments, execute the original logic
        if (this.transaction_number === item.transaction_number) {
          this.overlay = true;
          
          if (item.transaction_status === 'ON PROCESS') {
            if (item.processing_by === this.$store.state.usr_credentials.user_name) {
              this.getResultsQueue(item);
            } else {
              this.alert = {display: true,type: 'standard',width: '550',icon: 'mdi-alert-circle',color: 'yellow darken-1',title: 'Transaction On Process',body: 'This transaction is currently processed by ' + item.processing_by,btn_pry_txt: 'OK',btn_pry_color: 'primary',btn_pry_otl: false,btn_pry_act: 'closeAlert'};
              this.overlay = false;
            }
          } else {
            if (item.is_scanned === '2') {
              this.$axios.post(this.$tms_url + 'resources/controller/trn_upd_loa_consultation.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                  transaction_number: item.transaction_number,
                  transaction_status: 'ON PROCESS',
                  processing_by: this.$store.state.usr_credentials.user_name,
                }))
              })).then(() => {
                this.getResultsQueue(item);
              });
            } else {
              let url = item.transaction_type === 'OUTPATIENT' ? 'resources/controller/trn_upd_outpatient_icd.php' : 'resources/controller/trn_upd_consultation.php';

              this.$axios.post(this.$tms_url + url, this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                  transaction_number: item.transaction_number,
                  transaction_status: 'ON PROCESS',
                  on_queue: 1,
                  processing_by: this.$store.state.usr_credentials.user_name,
                }))
              })).then(() => {
                this.getResultsQueue(item);
              });
            }
          }
        }
      }
    },

    getResultsQueue(item) {
      this.$axios.post(this.$tms_url+'resources/api/_get_transaction_result_from_queue.php',this.$qs.stringify({
        post_data: this.wsDataEncryption(JSON.stringify({
          transaction_number : item.transaction_number
        }))
      })).then(response => { 
        response.data = this.responseDataDecryption(response.data)
        clearTimeout(this.queue_timeout)
        // this.source.cancel();
        //CHECK IF ALL CPT IS COVERED OR HAS NEEDS APPROVAL
        let cpt_status_validation = []
        let status = []
        let data = {}
        if(item.transaction_type === 'OUTPATIENT'){
          for(let x in response.data.icd_cpt_data){
            status = response.data.icd_cpt_data[x].procedure_list.some(val => parseFloat(val.for_hmo_approval) !== 0)
            cpt_status_validation.push(status)
          }
          cpt_status_validation = cpt_status_validation.includes(true) ? true : false
        }

        if(response.data.icd_cpt_data[0].procedure_list.length !== 0){
          this.session_data.hmo_cpt_status     = response.data.icd_cpt_data[0].procedure_list[0].hmo_cpt_status
        }else{
          this.session_data.hmo_cpt_status     = ''
        }

        this.session_data.is_scanned          = item.is_scanned
        this.session_data.hmo_icd_status      = response.data.icd_cpt_data[0].hmo_icd_status === 'NOT COVERED' && cpt_status_validation  ? 'NEEDS APPROVAL' : 'COVERED'
        this.session_data.trans_status        = cpt_status_validation == true ? 'NEEDS APPROVAL' : 'COVERED' 
        this.session_data.transaction_number  = item.transaction_number
        this.session_data.loa_generated_date  = response.data.transaction_data.loa_generated_date
        this.session_data.loa_expiration_date = response.data.transaction_data.loa_expiration_date
        this.session_data.icd_limit_bal       = response.data.icd_cpt_data[0].hmo_icd_limit_bal 
        this.session_data.max_coverage_limit_balance = response.data.transaction_data.hmo_max_coverage_bal ? response.data.transaction_data.hmo_max_coverage_bal : 0
        this.session_data.icd_cpt_data  = response.data.icd_cpt_data
        this.session_data.doctor_data   = response.data.doctor_data
        this.session_data.doctor_notes  = response.data.doctor_data.doctor_note
        this.session_data.chief_complaint = response.data.transaction_data.chief_complaint

  
        if(item.hmo_policy_number){
          this.session_data.trans_status   = this.session_data.hmo_icd_status == 'NOT COVERED' || cpt_status_validation == true ? 'NEEDS APPROVAL' : 'COVERED' 
          sessionStorage.setItem('GF45S', this.$crypto.AES.encrypt(response.data.transaction_data.process_type, 'fgGds32s')) // typein_method
        } else {
          this.session_data.trans_status   = 'COVERED'
          let member_phic_data = {
              mem_gender           : response.data.transaction_data.gender ? response.data.transaction_data.gender : 'MALE',
              mem_ph_status        : 'N/A',    
              phic_tracking_num    : response.data.transaction_data.phic_tracking_number ? response.data.transaction_data.phic_tracking_number : 'N/A',
              mem_phic_pin         : response.data.transaction_data.mem_phic_pin ? response.data.transaction_data.mem_phic_pin : null,      
              mem_phic_mem_type    : 'N/A',
              mem_name             : 'N/A',
              mem_category         : 'N/A' ,  
              mem_mailing_address  : 'N/A', 
              principal_data       : [],
          }
          let birthdate = response.data.transaction_data.birthday ? this.$moment(response.data.transaction_data.birthday).format('MM/DD/YYYY') : ''
          let member_name = [item.mem_first_name, (item.mem_middle_name ? item.mem_middle_name.split('.').join("") : ''), item.mem_last_name, '' ,birthdate]
          sessionStorage.setItem('MPS24', this.$crypto.AES.encrypt(JSON.stringify(member_phic_data), 'lfFo34sf')) //member_phic_data
          sessionStorage.setItem('JFD43', this.$crypto.AES.encrypt(JSON.stringify(member_name), 'lfFo34sf')) // phic
          sessionStorage.setItem('GF45S', this.$crypto.AES.encrypt(response.data.transaction_data.process_type, 'fgGds32s')) // typein_method
        }

        if(response.data.transaction_data.process_type === 'LGU') {
          data = { ek_lgu_id : item.ek_lgu_id,  lgu_host_code : item.lgu_host_code,}
        } else if (response.data.transaction_data.process_type === 'PHIC' || response.data.transaction_data.process_type === 'PHIC_LGU') {
          data = null //this will only fall to PHIC VALIDATION
        } else {
          data = { host_code: item.hmo_host_code, policy_no: item.hmo_policy_number}
        }

        if(response.data.transaction_data.phic_member_eligibility_status) {
          sessionStorage.setItem('ROTSR', this.$crypto.AES.encrypt(response.data.transaction_data.phic_member_eligibility_status, 'lFdt04sg'))
        }

        if (item.transaction_type === 'OUTPATIENT') {
          this.session_data.process_type = response.data.transaction_data.process_type   
          sessionStorage.setItem('LZ19XD15S0Y1YU',this.$crypto.AES.encrypt(JSON.stringify(this.session_data),'tKyk1d9zXo'))
          this.dispatchEligibility('/outpatient-result', data, response.data.transaction_data.process_type)
          

        } else if (item.transaction_type === 'CONSULTATION') {
          sessionStorage.setItem('LZ19XD15S0Y1YU',this.$crypto.AES.encrypt(JSON.stringify(this.session_data),'hEsi2Q2qY9t1'))
          this.dispatchEligibility('/consultation-result', data, response.data.transaction_data.process_type)

        }
      })
    },

    //FOR CALLING ELIGIBILITY API'S
    async dispatchEligibility(to,payload,process) {
        if (process === 'LGU') {
          await this.$store.dispatch("getLGUMemberData", payload);
        }  

        if (process !== 'LGU') {
          await this.$store.dispatch("getMemberData", payload);
        }
        this.$router.replace(to)
    },
    
    resetTable() {
      this.search_tbl = ''
      this.start_date = null
      this.end_date = null
      this.transaction_type = 'ALL'
      this.transaction_status = 'ALL'
    },
      
  }
}
</script>

<style scoped>
.status-circle-red {
  width: 12px;
  height: 12px;
  background: rgb(162, 162, 162);
  border-radius: 50%;
}
.status-circle-green {
  width: 12px;
  height: 12px;
  background: rgb(2, 182, 101);
  border-radius: 50%;
}
::v-deep.v-icon.notranslate.mdi.mdi-checkbox-blank-outline.theme--light:first-of-type,
::v-deep.v-icon.notranslate.mdi.mdi-minus-box.theme--light:first-of-type {
  color:rgb(255, 255, 255) !important;
}
::v-deep .selected-row {
  background-color: #BBDEFB !important;
  border-color: #BBDEFB !important;
}
</style>