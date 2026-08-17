

<template>
  <v-container fluid >
     <Navbar :navbar="navbar" :help_menu="help" />
      <OutpatientGen 
        :previous_cpt_icd="previous_cpt_icd"
        :prv_rate_checker="prv_rate_checker"
        :required_fields="required_fields"
        :selection_data="selection_data"
        :process_type="process_type"
        :doctor_items="doctor_list"
        :member_data="member_data"
        :doctor_data="doctor_data"
        :trans_data="trans_data"
        :icd_loader="icd_loader"
        :cpt_loader="cpt_loader"
        :icd_list="$store.state.icd_list"
        :cpt_list="cpt_list"
        :validate_tran_has_rvs="validate_tran_has_rvs"
        @remove-other-diagnosis="removeOtherDiagnosis"
        @validate-prv-rate="validate_provider_rate"
        @selected-doctor-row="selectedDoctorRow"
        @confirm-outpatient="confirmOutpatient"
        @remove-procedure="removeProcedure"
        @select-row-icd="selectRowICD"
        @select-row-cpt="selectRowCPT"
        @add-diagnosis="addDiagnosis"
        @format-number="formatNumber"
        @on-keyup-text="onKeyupText"
        @prev-transac="prevTransac"
        @cancel-outpatient="cancelOutpatient"
        @get-cpt-filter="getCPTFilter"
        @submit="submit"
      />

      <!-- MODALS -->
      <!-- STARTING DIALOG -->
      <v-dialog v-model="starting_dialog.startDialog" persistent>
        <v-card>
          <v-card-title class="text-caption text-sm-h6 justify-center light-blue darken-4 white--text">PLEASE SELECT YOUR PREVIOUS TRANSACTION</v-card-title>
          <div class="px-3">
            <v-col md="4" sm="6" cols="12" class="ml-auto">
              <v-text-field v-model="starting_dialog.search" label="Search" single-line hide-details outlined dense></v-text-field>
            </v-col>
            <v-data-table :loading="starting_dialog.load" :headers="starting_dialog.prev_table_header" :items="starting_dialog.prev_transaction_list" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }"   :items-per-page="5" :search="starting_dialog.search" :mobile-breakpoint="0" sort-by="date_created" loading-text="Loading Data... Please Wait..." item-key="transaction_number" class="elevation-1 mb-10 text-uppercase " sort-desc no-results>
                <template  v-slot:item="{item}"> 
                    <tr  v-on:click="prevTransac(item)"  :class="{'blue lighten-4': item.transaction_number === trans_data.transaction_number}"> 
                      <td>{{ formatDateAndTime(item.date_created) }}</td>
                      <td>{{ item.doctor_name ? item.doctor_name : 'N/A' }}</td>
                      <td>{{ item.specialization ? item.specialization : 'N/A' }}</td>
                      <td>{{ item.chief_com }}</td>
                      <td>{{ item.icd_code ? item.icd_code : 'N/A'}}</td>
                      <td>{{ item.icd_description  ? item.icd_description : 'N/A'}}</td>
                      <td>{{ item.transaction_type }}</td>
                      <td>
                        <v-btn @click="viewDetails(item)" small elevation="6"><v-icon left small>mdi-file-search-outline</v-icon> view additional details</v-btn>
                      </td>
                    </tr> 
                </template>
            </v-data-table>
          </div>
          
          <v-divider></v-divider>
          <v-card-actions class="d-flex flex-wrap">
              <v-col cols="12" sm="6" md="4" lg="4" xl="4" class="text-center text-sm-left pl-3 pt-1 mb-3">
                <v-btn @click="continueWithOtherDoctor" text ><v-icon left>fas fa-user-md</v-icon>CONTINUE WITH OTHER DOCTOR</v-btn> 
              </v-col>
              
              <v-col cols="12" sm="6" md="4" lg="4" xl="4" class="text-center mb-3">
                 <v-btn @click="cancelOutpatient"  color="secondary" class="mx-2" outlined rounded><v-icon small left>fas fa-times-circle</v-icon>CANCEL</v-btn> 
                <v-btn @click="confirmStartingSelection" color="light-blue darken-4 white--text" class="mx-2" rounded >CONFIRM<v-icon small right>fas fa-check-circle</v-icon></v-btn> 
              </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- ADDITIONAL DETAILS -->
      <v-dialog v-if="view_details_dialog" v-model="view_details_dialog" width="1050px" persistent>
        <v-card>
          <v-card-title class="text-caption text-sm-h6 justify-center light-blue darken-4 white--text">
              <v-spacer></v-spacer>ADDITIONAL DETAILS<v-spacer></v-spacer>
              <v-icon @click="view_details_dialog = false, view_details_data = null" dark>mdi-close</v-icon>
          </v-card-title>
          <div class="d-flex justify-center">
            <span v-if="!view_details_data" class="text-center py-5">Loading... Please Wait</span>
            <span v-else-if="view_details_data === 'Data not found.'" class="text-left py-5">No Records Found.</span>
            <div v-else class="wrap pa-5">
              <span v-if="!view_details_data[0].icd_description" class="py-5">No Records Found.</span>

              <v-col v-else v-for="(data,index) in view_details_data" :key="index" cols="12" class="text-body-2 text-body-sm-1 font-weight-bold">
                <label v-if="index === 0">PRIMARY DIAGNOSIS</label>
                <label v-else-if="index === 1">SECONDARY DIAGNOSIS</label>
                <label v-else>OTHER DIAGNOSIS</label>

                <h3 class="mb-2 text-body-2 text-body-sm-1 font-weight-regular">{{data.icd_description }}</h3>

                <v-col v-for="(cpt_data, cpt_ctr) in data.procedure_list" :key="cpt_ctr" cols="12" class="pl-5 mb-3">
                  <label v-if="cpt_ctr === 0" class="text-body-2 text-body-sm-1 font-weight-bold">PROCEDURE</label>        
                  <h4 class="text-body-2 text-body-sm-1 font-weight-regular">-{{cpt_data.cpt_description}}</h4>     
                </v-col>
              </v-col>
            </div>
          </div>
        </v-card>  
      </v-dialog>

      <!-- CONFIRM SELECTION -->
      <v-dialog v-if="starting_dialog.confirmation_dialog" v-model="starting_dialog.confirmation_dialog" width="1050px" persistent>
        <v-card>
          <v-card-title class="justify-center light-blue darken-4 white--text text-center">OUTPATIENT CONFIRMATION</v-card-title>
          <div class="py-2 px-5">
            <label class="text-body-2 font-weight-medium">CHIEF COMPLAINT</label>
            <v-textarea :value="trans_data.chief_complaint" class="text-body-2 text-xl-body-1" hide-details readonly outlined no-resize dense></v-textarea>
            <v-row class="px-3 my-3">
              <v-col cols="12" sm="6" class="pr-sm-3">
                  <label class="text-body-2 font-weight-medium">DOCTOR</label>
                  <v-text-field :value="doctor_data.doctor_name ? doctor_data.doctor_name : 'N/A'" class="text-body-2 text-xl-body-1" hide-details readonly dense outlined></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="pr-sm-3">
                  <label class="text-body-2 font-weight-medium">SPECIALIZATION</label>
                  <v-text-field :value="doctor_data.specialization ? doctor_data.specialization : 'N/A'" class="text-body-2 text-xl-body-1" hide-details readonly dense outlined></v-text-field>
              </v-col>
            </v-row>
            
            <v-col v-for="(data,index) in selection_data" :key="index" cols="12">
              <label class="text-body-2 font-weight-medium" v-if="index === 0">PRIMARY DIAGNOSIS</label>
              <label class="text-body-2 font-weight-medium" v-else-if="index === 1">SECONDARY DIAGNOSIS</label>
              <label class="text-body-2 font-weight-medium" v-else>OTHER DIAGNOSIS</label>
              <v-text-field :value="data.icd_description" class="mb-2 text-body-2 text-xl-body-1 test:focus" readonly hide-details dense outlined></v-text-field>

              <div v-for="(cpt_amt, cpt_ctr) in data.procedure_list" :key="cpt_ctr" class="wrap pl-sm-5">
                <v-col cols="9" class="mb-3">
                  <label v-if="cpt_ctr === 0" class="text-body-2 font-weight-medium">PROCEDURE</label>             
                  <v-text-field :value="cpt_amt.cpt_description" class="body-2 text-xl-body-1" readonly hide-details dense outlined></v-text-field>
                </v-col>
                <v-col cols="3" class="pl-1 pl-sm-3 mb-3">
                  <label  v-if="cpt_ctr === 0"  class="body-2 font-weight-medium">RATE</label>
                  <v-text-field :value="cpt_amt.cpt_amount" class="text-body-2 text-xl-body-1" readonly hide-details dense outlined></v-text-field>         
                </v-col>
              </div>
            </v-col>

            <label class="text-body-2 font-weight-medium mt-5">DOCTOR NOTES</label>
            <v-textarea :value="trans_data.doctor_notes ? trans_data.doctor_notes : 'N/A' " rows="3"  readonly outlined no-resize dense></v-textarea>
          </div>
          <v-divider></v-divider>
          <v-card-actions class="justify-center">
            <v-btn @click="starting_dialog.confirmation_dialog = false" :disabled="starting_dialog.loading" class="btn mr-2 px-2" color="secondary" outlined rounded ><v-icon small left>fas fa-times-circle</v-icon><span class="pr-2">CANCEL</span></v-btn> 
            <v-btn @click="confirmOutpatient"  :loading="starting_dialog.loading"  color="light-blue darken-4 white--text" class="btn mr-2 px-2"  rounded >CONFIRM <v-icon small right>fas fa-check-circle</v-icon></v-btn> 
          </v-card-actions>
        </v-card>
      </v-dialog>

     <Alert :alert="alert" @redirect="redirect"/>
  </v-container>    
</template>


<script>
import { mapState } from 'vuex'
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'
import OutpatientGen from '@/components/e-benefit/Outpatient/OutpatientGen.vue'

export default {
  components:{ Navbar, Alert, OutpatientGen},
  data(){
    return{
      //SESSION || LOCAL STORAGE
      process_type:sessionStorage.getItem('GF45S') ? this.$crypto.AES.decrypt(sessionStorage.getItem('GF45S'),'fgGds32s').toString(this.$crypto.enc.Utf8) : null,
      member_phic_data: sessionStorage.getItem('MPS24') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('MPS24'),'lfFo34sf').toString(this.$crypto.enc.Utf8)) : null,
      eligibility_status: sessionStorage.getItem('ROTSR') ? this.$crypto.AES.decrypt(sessionStorage.getItem('ROTSR'),'lFdt04sg').toString(this.$crypto.enc.Utf8) : null,
    
      //STARTING DIALOG
      starting_dialog:{
        startDialog: false,
        prev_table_header: [
          { text: 'DATE AND TIME', value: 'date_created', width: 200},
          { text: 'DOCTOR NAME', value: 'doctor_name', width: 150},
          { text: 'DOCTOR SPECIALIZATION', value: 'specialization'},
          { text: 'CHIEF COMPLAINT', value: 'chief_com', },
          { text: 'ICD CODE', value: 'icd_code',},
          { text: 'ICD DESCRIPTION', value: 'icd_description', width:300},
          { text: 'TRANSACTION TYPE', value: 'transaction_type',},
          { text: 'ACTION', value: 'transaction_type',}
        ],
        search:'',
        load:true,
        loading:false,
        prev_transaction_list:[],
        confirmation_dialog:false,
      },

      //TRANSACTION DATA
      trans_data:{
        select_prev_trans: true,
        transaction_number : '',
        transaction_type:'',
        transaction_id: '',
        chief_complaint: '',
        prev_icd_code:'',
        doctor_notes:'',
      },

      doctor_data:{
        doctor_code: '',
        doctor_name: '',
        specialization: '',
        doctor_tin: '',
        doctor_prc_license: '',
        doctor_phic_account_no: '',
        doctor_displayed:'',
        loader:false,
        prev_doc_name:'',
        prev_specialization:'',
        check_doc_from_list:true,
        check_validate_doc:true,
      },

      //GET API DATA
      doctor_list:[],
      diagnosis_list:[],
      procedure_list:[],

      previous_cpt_icd:[],
      
      //ERROR CHECKER
      required_fields:false,

      //STORAGE OF ICD AND CPT DATA
      icd_loader: true,
      cpt_loader: true,

      selected_cpt_filter:[],
      selection_data:[{
        selected_icd:'',
        icd_tag: 'NEW',
        icd_code: '',
        icd_description: '',
        icd_type: 'PRIMARY',
        ini_hmo_icd_status: 'COVERED', //ini_icd_status
        hmo_icd_limit_bal: 0,
        check_sob_status: false,
        procedure_list:[],
        selected_cpt:{},
        selected_cpt_holder:[]
      }],

      covid_diagnosis_list:[],
      date_today: this.$moment().format('YYYY-MM-DD'),
      disease_test_method_list: [],

      total_professional_fees : 0,
      total_health_inst_fees : 0, 
      grand_total : 0,

      //FC ERR
      fc_sob_err_count:0,

     view_details_dialog: false,
     view_details_data: null,
      
      //ALERTS CONTENT
      alert: {},
      
      //NAVBAR CONTENT
      navbar:[{ title: "Home", link: '/code-scanning', icon: 'fas fa-home' }],
      help: [{ content: "Please select your Diagnosis and Procedure by then submit. You can remove it by unchecking the selected items." }],
    }
  },

  mounted() {
    this.getPREVList();
  },

  computed:{
    ...mapState(["member_data"]),

    cpt_list () {
      return this.$store.state.cpt_list.filter(data => {
        return !this.selected_cpt_filter.includes(data.cpt_code_desc)
      })
    },

    prv_rate_checker(){
      let prv_has_rate = []
      for(let x in this.selection_data){
        let status = this.selection_data[x].procedure_list.some((val) => val.chk_cpt_has_prv_rate)
        prv_has_rate.push(status)
      }
      return prv_has_rate.includes(true) ? true : false
    },

    validate_covid_diagnosis () {
      let get_data_covid =[]
      this.selection_data.map(item =>{
        get_data_covid.push(this.covid_diagnosis_list.some(data => data.icd_code === item.icd_code))
      })
      return get_data_covid.some(data => data === true)
    },

    validate_covid_testing () {
      let get_testing_data = []
      this.selection_data.map(item => {
        get_testing_data.push(item.procedure_list.some(data => data.for_covid_testing === true))
      })
      return get_testing_data.some(data => data === true)
    },

    validate_tran_has_rvs () {
      if (this.trans_data.transaction_type === '' || (this.trans_data.transaction_type && !this.doctor_data.prev_doc_name)) {
        return this.selection_data.map(items => items.procedure_list.some(value => value.rvs_category)).includes(true) ? true : false
      } else {
        return false
      }
    },
  },

   watch:{
    doctor_list(){
      if((this.trans_data.transaction_type === 'OUTPATIENT' || this.trans_data.transaction_type === 'CONSULTATION') && this.doctor_data.doctor_name !== '' ){
        this.doctor_data.check_doc_from_list = this.doctor_list.some(item => item.doctor_name === this.doctor_data.prev_doc_name)
        this.doctor_data.check_validate_doc  = this.doctor_data.check_doc_from_list


      }
    }
  },
        
  
  methods:{
    //API DATA FOR AUTOCOMPLETES
    async doctorSearch(){
      let host_doctor 
      if(this.process_type == 'HMO_PHIC' || this.process_type == 'HMO_PHIC_LGU' || this.process_type == "HMO_LGU"){
        host_doctor = 'HMO_PHIC'
      }else if(this.process_type == 'PHIC' || this.process_type == 'PHIC_LGU'){
        host_doctor = 'PHIC'
      }else if(this.process_type == 'LGU'){
        host_doctor = 'LGU'
      }else{
        host_doctor = this.member_data.member.mem_hmo_host_code === 'VC' ? 'HMO_VC' : 'HMO' 
      }
 
      this.doctor_data.loader = true
      let response = await this.$services.getTransactionIpRefData({
        request_key: 'patient_doctor',
        host_doctor:  host_doctor,
        provider_code: this.$store.state.prv_data.provider_code, 
        provider_tin: this.$store.state.prv_data.provider_tin,
        hmo_host_code: host_doctor.includes('HMO') ? this.member_data.member.mem_hmo_host_code : undefined,
        phic_host_code: host_doctor !== 'HMO' ? 'PHIC' : undefined,
        //lgu_host_code: host_doctor === 'LGU' ? this.member_data.member.lgu_host_code : undefined
        lgu_host_code: host_doctor === 'LGU' ? this.$store.state.usr_credentials.lgu_host_code : undefined
      })

      if(response.status === 200) {
        this.doctor_data.loader = false
        if (response.data === 'Data not found.') return this.doctor_list = []
        response.data = this.responseDataDecryption(response.data)
        this.doctor_list = response.data.map(data => {
          return {
            doctor_name            : data.doctor_name.replace(/[,.]/g, ''),
            specialization         : data.specialization,
            doctor_code            : data.hmo_doctor_code,
            doctor_tin             : data.doctor_tin_no,
            doctor_phic_account_no : data.doc_phic_acc_no,
            doctor_prc_license     : data.doc_prc_license,
            autoCompleteText: data.doctor_name + ' / '+ data.specialization + ' ' + data.doctor_tin_no,
          }
        })
      } else {
        this.alert = response.error
      }
    },

    //GET DIAGNOSIS DATA
    async diagnosisSearch(type){
      const diagnosis_data = await this.$store.dispatch('getICDList', {
        request_type: type
      })

      if (type == 'covid') {
        this.procedureSearch('disease_test_method')
        this.covid_diagnosis_list = diagnosis_data 
        return
      }
      
      this.procedureSearch('procedure');
      this.icd_loader = false
    },
    
    //GET PROCEDURE DATA
    async procedureSearch(type){
      let value = ''
      if (type === 'disease_test_method') {
        value = type
      } else {
        value = this.process_type === 'HMO' ? 'hmo' : 'phic_hmo_op'
      }
      
      const procedure_data = await this.$store.dispatch('getCPTList', {
        selection_type: value
      })

      if (type == 'disease_test_method') return this.disease_test_method_list = procedure_data

      this.cpt_loader = false
    },

    //GETTING PREVIOUS LIST ONLOAD OF PAGE
    async getPREVList(){
      this.starting_dialog.startDialog = true
      let response = await this.$services.getTransactionPreviousByType({
        ...(this.process_type  !== 'PHIC' ? {
          hmo_policy_number : this.member_data.member.mem_hmo_policy_number ? this.member_data.member.mem_hmo_policy_number : null,
          provider_code     : this.$store.state.prv_data.provider_code,
          hmo_host_code     : this.member_data.member.mem_hmo_host_code,
        } : undefined),
      
          transaction_type  : "OP",
          provider_tin : this.$store.state.prv_data.provider_tin,
          ek_phic_id   : this.member_data.member.ek_phic_id,

        ...(this.process_type.includes('LGU')  ? {
          ek_lgu_id : this.member_data.member.ek_lgu_id,
          lgu_host_code : this.member_data.member.lgu_host_code,
        } : undefined),

        ...(!this.member_data.member.ek_phic_id ? {
          first_name   :   this.member_data.member.mem_first_name ? this.member_data.member.mem_first_name.toUpperCase() : '',
          middle_name  :   this.member_data.member.mem_middle_name ? this.member_data.member.mem_middle_name.toUpperCase() : '',
          last_name    :   this.member_data.member.mem_last_name ? this.member_data.member.mem_last_name.toUpperCase() : '',
          suffix       :   this.member_data.member.mem_suffix ? this.member_data.member.mem_suffix.toUpperCase() : '',
          birthday     :   this.$moment(this.member_data.member.mem_birthdate).format('YYYY-MM-DD'),
        } : undefined)
      })

      if(response.status === 200) {
        this.starting_dialog.load = false
        if (this.process_type.includes('LGU')) this.diagnosisSearch('covid');
        if (this.$store.state.icd_list.length == 0 && this.$store.state.cpt_list.length  == 0) {
          this.diagnosisSearch('icd');
        } else {
          this.icd_loader = false
          this.cpt_loader = false
        }
        
        if (response.data === 'Data not found.') return this.starting_dialog.prev_transaction_list = [];
        response.data = this.responseDataDecryption(response.data)
        this.starting_dialog.prev_transaction_list = response.data
      } else {
        this.alert = response.error
      }
    },

    //PREVIOUS TRANSACTION
    prevTransac(item){
      this.trans_data.transaction_number       = item.transaction_number
      this.trans_data.transaction_type         = item.transaction_type
      this.trans_data.chief_complaint          = item.chief_com
      this.trans_data.transaction_id           = item.transaction_id
      this.trans_data.prev_icd_code            = item.icd_code
      this.trans_data.doctor_notes             = item.doctor_note

      
      this.doctor_data.doctor_code             = item.doctor_code
      this.doctor_data.doctor_name             = item.doctor_name
      this.doctor_data.prev_doc_name           = item.doctor_name.replace(/[,.]/g, '')
      this.doctor_data.prev_specialization     = item.specialization
      this.doctor_data.specialization          = item.specialization
      this.doctor_data.doctor_tin              = item.doctor_tin
      this.doctor_data.doctor_prc_license      = item.doctor_prc_license
      this.doctor_data.doctor_phic_account_no  = item.doctor_phic_account_no
      this.doctor_data.doctor_displayed        = item.doctor_name.replace(/[,.]/g, '')+ ' / '+item.specialization+' '+item.doctor_tin
    },


    //WHEN USER CLICK CONFIRM IN STARTING DIALOG
    async confirmStartingSelection(){
      if(!this.trans_data.transaction_number){
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Selection required', body: 'Please choose from your previous transaction first', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        return 
      }

      this.starting_dialog.startDialog = false;
      let response = await this.$services.getTransactionIcdCpt({
        transaction_number : this.trans_data.transaction_number
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        this.previous_cpt_icd = response.data
        this.doctorSearch();
      } else {
        this.alert = response.error
      }
    },

    //CONTINUE WITH OTHER DOCTOR
    continueWithOtherDoctor(){
      this.trans_data.select_prev_trans        = false
      this.trans_data.transaction_number       = ''
      this.trans_data.transaction_type         = ''
      this.trans_data.chief_complaint          = ''
      this.trans_data.transaction_id           = ''
      this.trans_data.prev_icd_code            = ''
      this.trans_data.doctor_notes             = ''

      this.doctor_data.doctor_code             = ''
      this.doctor_data.doctor_name             = ''
      this.doctor_data.specialization          = ''
      this.doctor_data.doctor_tin              = ''
      this.doctor_data.doctor_prc_license      = ''
      this.doctor_data.doctor_phic_account_no  = ''
      this.doctor_data.doctor_displayed        = ''
      this.doctor_data.prev_doc_name           = ''
      this.doctor_data.prev_specialization     = ''

      this.starting_dialog.startDialog         = false;
      this.doctorSearch();
    },

    // CANCEL SELECTION IN STARTING MODAL
    cancelOutpatient(){
       this.alert = { 
          display: true, 
          type: 'standard', 
          width: '550', 
          icon: 'mdi-help-circle', 
          color: 'blue darken-1', 
          title: 'Are you sure you want to leave Outpatient page?', 
          body: 'This will bring you back to Eligibility page', 
          btn_pry_txt: 'leave', 
          btn_pry_color: 'secondary', 
          btn_pry_otl: true, 
          btn_pry_act: 'closeAlert',  
          btn_pry_emt: 'redirect',
          btn_pry_params: '/eligibility',
          btn_sec_txt: 'Stay on this page', 
          btn_sec_color: 'primary', 
          btn_sec_otl: false, 
          btn_sec_act: 'closeAlert',
        }
    },


    // MODAL FOR VIEWING ADDITIONAL DETAILS OF SELECTED ROW
    async viewDetails(data) {
      this.view_details_dialog = true
      let response = await this.$services.getTransactionIcdCpt({
        transaction_number : data.transaction_number
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        this.view_details_data = response.data
      } else {
        this.alert = response.error
      }
    },
    
    //SELECT DOCTOR FROM AUTOCOMPLETE
    selectedDoctorRow(item){
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
        this.doctor_data.check_validate_doc      = true
      }
    },


    //SELECT DIAGNOSIS FROM AUTOCOMPLETE
    async selectRowICD(item,counter){

      if(!item ){ // IF USER USE BACKSPACE TO DELETE THE DATA TO PREVENT CONSOLE LOG ERROR
        this.selection_data[counter].icd_code = '' 
        this.selection_data[counter].selected_icd = ''
        this.selection_data[counter].icd_inner_limit = 0
        this.selection_data[counter].icd_description = '' 
        this.selection_data[counter].hmo_icd_limit_bal = 0 
        this.selection_data[counter].check_sob_status = false 
      }else{
        this.selection_data[counter].icd_code = item.icd_code
        this.selection_data[counter].selected_icd = item.icd_code_description
        this.selection_data[counter].icd_description = item.icd_description

        let response = await this.$services.getTransactionSobIcdCaseRates({
          icd_code: item.icd_code,
          hmo_host_code: this.member_data.member.mem_hmo_host_code,
          hmo_policy_number: this.member_data.member.mem_hmo_policy_number,
          transaction_type: 'OP',
        })

        if(response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          this.selection_data[counter].icd_inner_limit = response.data.icd_inner_limit
          this.selection_data[counter].ini_hmo_icd_status = response.data.hmo_icd_status

          // CONVERT HERE FOR THE HMO ICD LIMIT BAL UPDATED 04-15-2021
          if (response.data.hmo_icd_limit_bal === 'F') { 
            this.selection_data[counter].hmo_icd_limit_bal = !response.data.icd_inner_limit ? 0 : parseFloat(response.data.icd_inner_limit)
          } else {
            this.selection_data[counter].hmo_icd_limit_bal = !response.data.hmo_icd_limit_bal ? 0 : parseFloat(response.data.hmo_icd_limit_bal)
          }
        
          // VALIDATES FOR SHOWING IF THE ICD IS NOT COVERED
          if (response.data.hmo_icd_status === 'NOT COVERED' && this.process_type !== 'PHIC' && this.member_data.config.icd_auto_not_covered == 'true') {
            this.selection_data[counter].check_sob_status = true
          } else {
            this.selection_data[counter].check_sob_status = false
          }
        } else {
          this.alert = response.error
        }
      }
    },

    //SELECT PROCEDURES FROM AUTOCOMPLETE
    async selectRowCPT(item,counter){
      let find_covid_testing = false
      this.selection_data[counter].procedure_list.push({
        cpt_code_desc: item.cpt_code_desc,
        cpt_description: item.cpt_description,
        cpt_amt_loader: true,
        cpt_amount: 500,
        for_covid_testing: false,
      })
      this.selection_data[counter].selected_cpt = {}
      this.selection_data[counter].selected_cpt_holder.push(item.cpt_code_desc)

      let response = await this.$services.getTransactionSobCptRvs({
        cpt_code        : item.cpt_code,
        rvs_code        : !item.rvs_code ? null : item.rvs_code,
        rvs_category    : !item.rvs_category ? null : item.rvs_category,
        provider_code   : this.$store.state.prv_data.provider_code,
        plan_code       : this.member_data.member.mem_plan_code ? this.member_data.member.mem_plan_code : null,
        hmo_host_code   : this.member_data.member.mem_hmo_host_code,
        selection_type  : this.process_type === 'HMO' ? 'hmo' : 'phic_hmo_op',
        provider_tin    : this.$store.state.prv_data.provider_tin,

        ...(this.member_data.member.mem_hmo_host_code === 'FC' ? {
          transaction_type : 'OUTPATIENT'
        } : undefined)
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)

        let check_description = response.data.cpt_code+' '+response.data.cpt_description + (response.data.rvs_category ? ' '+response.data.rvs_category : '')
        let index = this.selection_data[counter].procedure_list.findIndex(item => item.cpt_code_desc === check_description)
        find_covid_testing = this.disease_test_method_list.some(test_method => test_method.cpt_description == this.selection_data[counter].procedure_list[index].cpt_description)

        let cpt_data = {
          cpt_tag : 'NEW',
          cpt_code : response.data.cpt_code,
          //cpt_amount : !response.data.cpt_provider_rate.includes('.') ? response.data.cpt_provider_rate + '.00' : response.data.cpt_provider_rate,
          cpt_amount: '12,000.00',
          cpt_description : response.data.cpt_description,
          cpt_provider_rate: response.data.cpt_provider_rate,
          initial_cpt_status: response.data.hmo_cpt_status,  //INITIAL_CPT_STATUS
          hmo_cpt_approved_amount : 0,
          for_hmo_approval : 0,
          cpt_amt_loader: false,
          chk_cpt_has_prv_rate : false,
          cpt_rate: response.data.cpt_rate,
          //cpt_rate: 500,
          cpt_code_desc: item.cpt_code_desc,
          
          for_covid_testing: find_covid_testing,
          ...(response.data.rvs_category ? {
            phic_covered_amount : 0,
            rvs_code : response.data.rvs_code ? response.data.rvs_code : null,
            rvs_description :response.data.rvs_description ? response.data.rvs_description : null,
            phic_laterality_check :null,
            rvs_hci_fee : response.data.rvs_hci_fee ? response.data.rvs_hci_fee : null,
            rvs_professional_fee : response.data.rvs_professional_fee ? response.data.rvs_professional_fee : null,
            rvs_category : response.data.rvs_category ? response.data.rvs_category : null,
            rvs_case_rate : response.data.rvs_rate ? response.data.rvs_rate : null,
            rvs_tag : 'NEW',
            ini_phic_cpt_status: response.data.phic_cpt_status, // NEW
          } : null)
        }

        this.$set(this.selection_data[counter].procedure_list,index,cpt_data)
      } else {
        this.alert = response.error
      }
    },

    //REMOVE PROCEDURES
    removeProcedure(index,counter){
      this.selection_data[index].procedure_list.splice(counter,1)
      this.selection_data[index].selected_cpt_holder.splice(counter,1)
    },

    // REMOVE OTHER DIAGNOSIS
    removeOtherDiagnosis(counter){
      this.selection_data.splice(counter,1)
    },
   
    // ADD DIAGNOSIS
    addDiagnosis(){
      this.selection_data.push({
        selected_icd:'',
        icd_tag: 'NEW',
        icd_code: '',
        icd_description: '',
        icd_type: '' ,
        ini_hmo_icd_status: 'COVERED', //ini_icd_status
        hmo_icd_limit_bal: 0,
        check_sob_status: false,
        procedure_list:[],
        selected_cpt:{},
        selected_cpt_holder: [],
      })
    },
   
   //SUBMIT
    submit() {

      // INITIIALIZATION OF DATA
      let validate_doc_name = (this.validate_tran_has_rvs && !this.doctor_data.doctor_name) ? true : false
      let check_diagnosis = this.selection_data.some(element => !element.selected_icd)
      let validate_cpt_amt = this.selection_data.some(element => element.procedure_list.some(data => !data.cpt_amount || data.cpt_amount === '0' || data.cpt_amount === '0.00'))
      let validate_cpt_restriction = this.selection_data.some(element => element.procedure_list.some(data => data.initial_cpt_status === 'NOT COVERED'))
      let occurances = {}
      this.selection_data.forEach(element => occurances[element.icd_description] = (occurances[element.icd_description] || 0) + 1)
      let is_duplicate_icd = Object.values(occurances).some(item => item  > 1 )
      let get_duplicate_icd = Object.keys(occurances).filter((a) => occurances[a] > 1)

      // TRIM DATA
      this.trans_data.chief_complaint = this.trans_data.chief_complaint.trim()
      this.trans_data.doctor_notes = this.trans_data.doctor_notes ?  this.trans_data.doctor_notes.trim() : ''
      
      if(!this.trans_data.chief_complaint || validate_doc_name || check_diagnosis || this.selection_data[0].procedure_list.length === 0 || validate_cpt_amt) {
          this.required_fields = true
          this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Field is empty/Invalid Value', body: 'Please fill out all required fields.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      
      } else if(this.selection_data[0].check_sob_status) {
          this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'This ICD is not Covered:', body: this.selection_data[0].icd_description, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        
      } else if (this.member_data.config.cpt_auto_not_covered == 'true' &&  validate_cpt_restriction) {          
          this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'WARNING', body: 'You have selected procedure that is not covered', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }

      } else if (is_duplicate_icd){
          let get_icd_lengths = get_duplicate_icd.map(item=> item.length)
          let alert_width = get_icd_lengths.some(item => item > 50) ? '700' : '500'
          const duplicate = "<h6 class='body-2 text-left'>"+get_duplicate_icd.map((item,index) => item = index+1+')  '+item).join('<br/>')+"</h6>";
          this.alert = { display: true, type: 'standard', width: alert_width, icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'You have chosen the same Diagnosis for: <br/>'+duplicate, body: 'Change the diagnosis and try again.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      
      }else {
        this.required_fields = false
        this.starting_dialog.confirmation_dialog = true;
      }
    },
    

    // CONFIRM OUTPATIENT
    async confirmOutpatient(){
      this.starting_dialog.loading = true
      // INITIALIZATION OF VARIABLE
      let principal_data, phic_certification, date_today, expiration_date, hmo_icd_status, trans_status, transaction_status
      let is_com_disease = this.validate_covid_diagnosis ? 1 : 0
      let agent_trans_cc_ref = '0'
      let covid_testing = {}
     
      //REMOVE THE COMMA OF ALL RATES RELATED
      this.selection_data.map(icd_data => {
        icd_data.procedure_list.map(cpt_data => {
          cpt_data.cpt_amount = parseFloat(cpt_data.cpt_amount.toString().replace(/,/g, ''))
          cpt_data.cpt_provider_rate = parseFloat(cpt_data.cpt_provider_rate)
          cpt_data.cpt_rate = parseFloat(cpt_data.cpt_rate)
          if(cpt_data.rvs_code) {
            cpt_data.rvs_professional_fee = parseFloat(cpt_data.rvs_professional_fee.toString().replace(/,/g, ''))
            cpt_data.rvs_case_rate = parseFloat(cpt_data.rvs_case_rate.toString().replace(/,/g, ''))
            cpt_data.rvs_hci_fee = parseFloat(cpt_data.rvs_hci_fee.toString().replace(/,/g, ''))
          }
          return cpt_data
        })
        return icd_data
      })

      // GET MODIFIED SELECTION_ICD DATA
      const data = this.validateDiagnosisProcedure()
      
      if(data.result_page) {
        data.modified_selection_data.forEach(items => {
          items.procedure_list.forEach(item => {
            if (this.eligibility_status === 'Eligible' && item.rvs_category) {
              this.total_professional_fees  = this.total_professional_fees + item.rvs_professional_fee
              this.total_health_inst_fees  = this.total_health_inst_fees + item.rvs_hci_fee
              this.grand_total = this.grand_total + item.rvs_case_rate
            }
          })
        })
        if(this.process_type !== 'HMO'){
          principal_data = {
            first_name           : this.member_data.member.principal_data.length !== 0 ? this.member_data.member.principal_data.FIRST_NAME._text : null,
            middle_name          : this.member_data.member.principal_data.length !== 0 ? this.member_data.member.principal_data.MIDDLE_NAME._text: null,
            last_name            : this.member_data.member.principal_data.length !== 0 ? this.member_data.member.principal_data.LAST_NAME._text: null,
            initial              : '',
            member_pin           : this.member_data.member.mem_phic_pin,
            birthday             : this.member_data.member.principal_data.length !== 0 ? this.member_data.member.principal_data.BIRTHDATE._text: null,
            gender               : this.member_data.member.principal_data.length !== 0 ? this.member_data.member.principal_data.GENDER._text.charAt(0) !== 'M' ? 'MALE' : 'FEMALE': null,
            phone_no             : this.member_data.member.principal_data.length !== 0 ? this.member_data.member.principal_data.PHONE_NO._text: null,
            mobile_no            : this.member_data.member.principal_data.length !== 0 ? this.member_data.member.principal_data.MOBILE_NO._text: null,
            email_add            : this.member_data.member.principal_data.length !== 0 ? this.member_data.member.principal_data.EMAIL_ADDRESS._text: null,
            mailing_add          : '',
            zip_code             : this.member_data.member.principal_data.length !== 0 ? this.member_data.member.principal_data.ZIP_CODE._text: null,
            phic_number          : '',
            quali_posted_contri  : '',
            suffix               : this.member_data.member.principal_data.length !== 0 ? this.member_data.member.principal_data.SUFFIX._text: null,
            phic_member_type     : this.member_data.member.mem_phic_mem_type,
          }
          phic_certification = {
            total_professional_fees : this.total_professional_fees,
            total_health_inst_fees  : this.total_health_inst_fees,
            grand_total             : this.grand_total,
          }
        }
      }

      // VALIDATE COVID TESTING
      if(this.validate_covid_testing) {
        let get_cpt = []
        this.selection_data.map(item =>{
          item.procedure_list.filter(data => data.for_covid_testing ? get_cpt.push(data.cpt_code) : '')
        })
     
        covid_testing = {
          ek_lgu_id            : this.member_data.member.ek_lgu_id,
          ek_phic_id           : this.member_data.member.ek_phic_id ? this.member_data.member.ek_phic_id : null,
          ek_hmo_id            : this.member_data.member.ek_hmo_id,
          phic_pin             : this.member_data.member.mem_phic_pin ? this.member_data.member.mem_phic_pin : null,
          hmo_policy_number    : this.member_data.member.mem_hmo_policy_number ?  this.member_data.member.mem_hmo_policy_number : null,
          provider_tin         : this.$store.state.prv_data.provider_tin,
          provider_code        : this.$store.state.prv_data.provider_code,
          doctor_tin           : this.doctor_data.doctor_tin,
          doctor_code          : this.doctor_data.doctor_code,
          post_doctor_tin      : null,
          post_doctor_code     : null,
          cpt_list             : get_cpt,
          post_result_icd_code : null,
          disease              : 'covid',
          test_result          : null,
        }
      }

      // GET DOCTOR
      const doctor = this.doctor_data.doctor_name ? {
        is_requesting_doctor: this.trans_data.transaction_type === '' || (this.trans_data.transaction_type && !this.doctor_data.prev_doc_name) ? '0' : '1',
        doc_prc_license: this.doctor_data.doctor_prc_license,
        doctor_note: this.trans_data.doctor_notes,
        doc_acc_no: this.doctor_data.doctor_phic_account_no,
        doc_code: this.doctor_data.doctor_code,
        doc_tin: this.doctor_data.doctor_tin,
      } : null

      // GENERATION OF EXPIRY DATE
      date_today = this.$moment().format('Y-M-D')
      expiration_date = this.$moment(date_today).add(this.member_data.config.host_loa_validity,'days') 
      expiration_date = this.$moment(expiration_date,"days").format('Y-M-D') 

      // VALIDATION OF TRANSACTION STATUS / CC REF
      if(this.member_data.member.mem_hmo_host_code !== 'FC') {
        if (data.result_page) {
          transaction_status = 'ON PROCESS'
          if(data.hmo_cpt_has_approval) {
            trans_status       =  'NEEDS APPROVAL'
            agent_trans_cc_ref = '1'
            hmo_icd_status     = this.selection_data[0].hmo_icd_status === 'NOT COVERED' && data.hmo_cpt_has_approval ? 'NEEDS APPROVAL' : 'COVERED'
          } else {
            agent_trans_cc_ref = '0'
            trans_status       = 'COVERED'
            hmo_icd_status     = 'COVERED' 
          }
        } else {
          transaction_status = 'ISSUED'
          agent_trans_cc_ref = '0'
        }
      }

      // VALIDATION FOR PASSING TRANSACTION ID
      if(this.trans_data.transaction_type === 'OUTPATIENT'){
        this.trans_data.transaction_id = this.trans_data.prev_icd_code === this.selection_data[0].icd_code && this.doctor_data.prev_doc_name === this.doctor_data.doctor_name ? this.trans_data.transaction_id : null
      }else if(this.trans_data.transaction_type === 'CONSULTATION'){
        this.trans_data.transaction_id
      }else{
        this.trans_data.transaction_id = null
      }   
      
      let response = await this.$services.trnAddOutpatient({
        mem_hmo_policy_number           :  this.member_data.member.mem_hmo_policy_number ? this.member_data.member.mem_hmo_policy_number : null, 
        mem_hmo_plan_code               :  this.member_data.member.mem_plan_code ? this.member_data.member.mem_plan_code : null ,
        provider_code                   :  this.$store.state.prv_data.provider_code,
        hmo_healthcare_status           :  this.member_data.member.mem_hmo_status,
        provider_tin                    :  this.$store.state.prv_data.provider_tin,
        provider_name                   :  this.$store.state.prv_data.provider_name,
        transaction_type                :  'OUTPATIENT',
        chief_complaint                 :  this.trans_data.chief_complaint,
        T141L                           :  this.$store.state.usr_credentials.user_name,
        approval_code                   :  'N/A',
        transaction_status              :  transaction_status,
        agent_transaction_status_cc_ref :  agent_trans_cc_ref,
        hmo_icd_limit                   :  parseFloat(this.member_data.member.icd_inner_limit),
        hmo_max_coverage                :  parseFloat(this.member_data.member.max_coverage_limit),
        hmo_max_coverage_bal            :  parseFloat(this.member_data.member.hmo_max_coverage_bal),
        hmo_host_code                   :  this.member_data.member.mem_hmo_host_code,
        hmo_loa_amount                  :  0,
        total_cpt_approved_amount       :  0,
        room_type                       :  this.member_data.member.mem_room_plan,
        room_rate                       :  parseFloat(this.member_data.member.mem_room_rate),
        is_service_rendered             :  '0',
        service_feedback                :  'N/A',
        reason_for_not_rendered         :  'N/A',
        loa_generated_date              :  date_today,
        loa_expiration_date             :  expiration_date,
        icd_cpt_data                    :  data.modified_selection_data,
        doctor                          :  doctor,
        ek_phic_id                      :  this.member_data.member.ek_phic_id,
        on_queue                        :  1,
        processing_by                   :  this.$store.state.usr_credentials.user_name,
        process_type                    :  this.process_type,
        transaction_id                  :  this.trans_data.transaction_id,
        ek_lgu_id                       :  this.member_data.member.ek_lgu_id,
        is_com_disease                  :  is_com_disease,
        lgu_host_code                   :  this.$store.state.usr_credentials.lgu_host_code, //this.member_data.member.lgu_host_code,
    
        ...(this.validate_covid_testing ? {
          disease_test                  : covid_testing,
        } : undefined),

        ...(this.process_type !== 'HMO' && data.result_page ? {
        phic_tracking_number            :   this.member_data.member.phic_tracking_num ?  this.member_data.member.phic_tracking_num : null,
        claim_status                    :   '',
        forms_status                    :   '',
        phic_member_category            :   this.member_data.member.mem_category,
        first_name                      :   this.member_data.member.mem_first_name ? this.member_data.member.mem_first_name.toUpperCase() : '',
        middle_name                     :   this.member_data.member.mem_middle_name ? this.member_data.member.mem_middle_name.toUpperCase() : '',
        last_name                       :   this.member_data.member.mem_last_name ? this.member_data.member.mem_last_name.toUpperCase() : '',
        suffix                          :   this.member_data.member.mem_suffix ? this.member_data.member.mem_suffix.toUpperCase() : '',
        birthday                        :   this.member_data.member.mem_birthdate,
        gender                          :   this.member_data.member.mem_gender,
        phone_no                        :   this.member_data.member.mem_mobile_number,
        mobile_no                       :   '',
        email_add                       :   this.member_data.member.mem_email_address,
        mailing_add                     :   this.member_data.member.mem_mailing_address,
        zip_code                        :   '',
        phic_number                     :   '',
        phil_claim_type                 :   '',
        receipt_ticket_number           :   '',
        ad_forms_progress_status        :   '',
        phic_member_status              :   '',
        phic_member_type                :   this.member_data.member.mem_phic_mem_type,
        phic_member_eligibility_status  :   this.process_type === 'LGU' ||  this.process_type === 'HMO_LGU' ? this.member_data.member.eligibility_status : this.eligibility_status,
        
        principal_data                  :   principal_data,
        phic_host_code                  :   'PHIC',
        phic_certification              :   phic_certification,
        } : undefined)
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        if (!response.data.transaction_number) {
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          return
        }
        if (!data.result_page) { 
          this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: 'Transaction has been completed', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'redirect', btn_pry_params: '/code-scanning' }
          return
        }
        const payload = {
          process_type         : this.process_type,
          hmo_icd_status       : hmo_icd_status,
          trans_status         : trans_status,
          trans_number         : response.data.transaction_number,
          generated_date       : response.data.loa_generated_date,
          expiration_date      : response.data.loa_expiration_date,
          icd_cpt_data         : data.modified_selection_data,
          max_coverage_balance : data.max_coverage_limit_balance
        } 
        this.redirectOPResult(payload)
      } else {
        this.alert = response.error
      }
    },

    validateDiagnosisProcedure() {
      let max_coverage_limit_balance = this.member_data.member.mem_hmo_host_code === 'FC' ? parseFloat(this.selection_data[0].max_coverage_balance) : parseFloat(this.member_data.member.hmo_max_coverage_bal)
      let auto_approve_cpt_limit = this.process_type.includes('HMO') ? parseFloat(this.member_data.config.auto_approve_cpt_limit) : 0
      let icd_rate_primary = this.selection_data[0].hmo_icd_limit_bal
      let get_total_cpt_amt = 0
      let hmo_cpt_has_approval = false
      let result_page = this.process_type.includes('LGU') && !this.member_data.member.mem_phic_pin ? false : true
      if (result_page) {
        this.selection_data.forEach((data,index) => {
          // VALIDATE ICD_TYPE FOR SECONDARY AND OTHERS
          if (index === 1) data.icd_type = 'SECONDARY'
          if (index > 1) data.icd_type = 'OTHERS'
          // GET MAX_COVERAGE_BAL
          data.max_coverage_balance = max_coverage_limit_balance
          // VALIDATE PHIC CPT STATUS
    
          data.procedure_list.map(item => {
            if (this.process_type === 'HMO_PHIC' || this.process_type === 'HMO_PHIC_LGU' || this.process_type === 'HMO_LGU') { // hmo, hmo_phic, hmo_phic_lgu, hmo_lgu
              if (item.rvs_category) {
                if (item.cpt_amount <= item.rvs_case_rate) {
                  item.phic_cpt_status = 'COVERED',
                  item.hmo_cpt_status = 'NOT COVERED'
                  item.for_hmo_check = false
                } else {
                  let balance = item.cpt_amount - item.rvs_case_rate
                  item.phic_cpt_status = item.cpt_rate >= balance ? "COVERED" : "COVERED UP TO "+ item.rvs_case_rate.toLocaleString()
                  item.rvs_remaining_bal = item.cpt_rate !== 0 && item.cpt_rate < balance ? item.cpt_rate : balance
                  item.for_hmo_check = true
                }
                item.phic_covered_amount = item.cpt_amount <= item.rvs_case_rate ? item.cpt_amount : item.rvs_case_rate
              } else {
                item.phic_cpt_status = 'NOT COVERED'
                item.for_hmo_check = true
              }
            } else if(this.process_type === 'PHIC' || this.process_type === 'PHIC_LGU' || this.process_type === 'LGU') { // phic, phic_lgu, lgu
              if (item.rvs_category && item.cpt_amount <= item.rvs_case_rate) {
                
                item.phic_cpt_status = 'COVERED'
              } else if (item.rvs_category && item.cpt_amount > item.rvs_case_rate) {
                item.phic_cpt_status = 'COVERED UP TO '+ item.rvs_case_rate.toLocaleString()
              } else {
                item.phic_cpt_status = 'NOT COVERED'
              }
              item.phic_covered_amount = item.cpt_amount <= item.rvs_case_rate ? item.cpt_amount : item.rvs_case_rate
              item.for_hmo_check = false
            } else { //HMO
              item.for_hmo_check = true
            }
            return item
          })
        })
   
        if(this.process_type.includes('HMO')) {
          // GET TOTAL AMOUNT OF PER SELECTED CPT
          this.selection_data.forEach(data => {
          get_total_cpt_amt = get_total_cpt_amt + data.procedure_list.reduce((sum, cpt) => {
              if (cpt.for_hmo_check) {
                if(cpt.rvs_category ) {
                  return sum + cpt.rvs_remaining_bal
                } else if (cpt.cpt_rate > 0 && cpt.cpt_amount >= cpt.cpt_rate) {
                  return sum + cpt.cpt_rate
                } else {
                  return sum + cpt.cpt_amount
                }
              } 
              return sum
            },0)
          })
          
          // VALIDATE FOR HMO CPT STATUS
          this.selection_data.forEach(data => {
            data.procedure_list.map (item => {
              if (item.for_hmo_check) {
                if (this.member_data.member.mem_plan_code) {
                  if(this.selection_data[0].ini_hmo_icd_status === 'COVERED' && get_total_cpt_amt <= icd_rate_primary && get_total_cpt_amt <= max_coverage_limit_balance) {
                    if (item.initial_cpt_status === 'COVERED') {
                      if (item.cpt_rate > 0) {
                        if (item.rvs_remaining_bal && item.rvs_remaining_bal <= icd_rate_primary && item.rvs_remaining_bal < item.cpt_rate) {
                          item.hmo_cpt_status = 'COVERED'
                          item.for_hmo_approval = 0
                          item.hmo_cpt_approved_amount = item.rvs_remaining_bal ? item.rvs_remaining_bal : 0
                        } else if (item.rvs_remaining_bal && item.rvs_remaining_bal >= icd_rate_primary && item.rvs_remaining_bal >= item.cpt_rate) {
                          item.hmo_cpt_status = 'COVERED UP TO '+item.rvs_remaining_bal.toLocaleString()
                          item.for_hmo_approval = 0
                          item.hmo_cpt_approved_amount = item.rvs_remaining_bal ? item.rvs_remaining_bal : 0
                        } else if (!item.rvs_remaining_bal && item.cpt_amount <= item.cpt_rate) {
                          item.hmo_cpt_status = 'COVERED'
                          item.for_hmo_approval = 0
                          item.hmo_cpt_approved_amount = item.cpt_amount
                        } else {
                          item.hmo_cpt_status = 'COVERED UP TO '+item.cpt_rate.toLocaleString()
                          item.for_hmo_approval = 0
                          item.hmo_cpt_approved_amount = item.cpt_rate
                        }
                      } else {
                        if (item.rvs_remaining_bal && item.rvs_remaining_bal <= icd_rate_primary && item.rvs_remaining_bal <= auto_approve_cpt_limit) {
                          item.hmo_cpt_status = 'COVERED'
                          item.for_hmo_approval = 0
                          item.hmo_cpt_approved_amount = item.rvs_remaining_bal ? item.rvs_remaining_bal : 0
      
                        } else if (item.rvs_remaining_bal && item.rvs_remaining_bal >= icd_rate_primary && item.rvs_remaining_bal >= auto_approve_cpt_limit) {
                          item.hmo_cpt_status = 'NEEDS APPROVAL'
                          item.hmo_cpt_approved_amount = 0
                          item.for_hmo_approval = item.rvs_remaining_bal
                          
                        } else if (!item.rvs_remaining_bal && item.cpt_amount <= icd_rate_primary && item.cpt_amount <= auto_approve_cpt_limit) {
                          item.hmo_cpt_status = 'COVERED'
                          item.hmo_cpt_approved_amount = item.cpt_amount
      
                        } else {
  
                          item.hmo_cpt_status = 'NEEDS APPROVAL'
                          item.hmo_cpt_approved_amount = 0
                          item.for_hmo_approval = item.cpt_amount
                        }
                      }
                    } else {
                      item.hmo_cpt_status = 'NEEDS APPROVAL'       
                      item.hmo_cpt_approved_amount = 0
                      item.for_hmo_approval =  item.rvs_category ? item.rvs_remaining_bal : item.cpt_amount
                    }
                    this.selection_data[0].hmo_icd_status = 'COVERED'
                  } else {
                    item.hmo_cpt_status = 'NEEDS APPROVAL'       
                    item.hmo_cpt_approved_amount = 0
                    item.for_hmo_approval = item.rvs_category ? item.rvs_remaining_bal : item.cpt_amount
                    this.selection_data[0].hmo_icd_status = 'NOT COVERED'
                  }
                } else {
  
                  if (item.initial_cpt_status === 'COVERED' && item.rvs_category && item.rvs_remaining_bal <= auto_approve_cpt_limit) {
                    item.hmo_cpt_status = 'COVERED UP TO '+item.rvs_remaining_bal.toLocaleString()
                    item.hmo_cpt_approved_amount = item.rvs_remaining_bal
                    item.for_hmo_approval = 0
    
                  } else if (item.initial_cpt_status === 'COVERED' && item.rvs_category && item.rvs_remaining_bal >= auto_approve_cpt_limit) {
                    item.hmo_cpt_status = 'NEEDS APPROVAL'
                    item.hmo_cpt_approved_amount = 0
                    item.for_hmo_approval = item.rvs_remaining_bal
    
                  } else if (item.initial_cpt_status === 'COVERED' && !item.rvs_category && item.cpt_amount <= auto_approve_cpt_limit) {
                    item.hmo_cpt_status = 'COVERED'
                    item.hmo_cpt_approved_amount = item.cpt_amount
                    item.for_hmo_approval = 0
    
                  } else {
                    item.hmo_cpt_status = 'NEEDS APPROVAL'
                    item.hmo_cpt_approved_amount = 0
                    item.for_hmo_approval = item.cpt_amount
    
                  }
                }
              }
              return item
            })
            return data
          })
  
          // VALIDATE HMO ICD_STATUS IF MEMBER HAS NO PLAN CODE
          if (!this.member_data.member.mem_plan_code) {
            let get_cpt_status = []
            this.selection_data.forEach(data => {
              let get_data = data.procedure_list.every(val => val.hmo_cpt_status === 'NEEDS APPROVAL')
              get_cpt_status.push(get_data)
            })
            this.selection_data[0].hmo_icd_status = get_cpt_status.every(val => val === true) ? 'NOT COVERED'  : 'COVERED'
          }
        }
  
        // VALIDATE SELECTED CPT 
        let check_rvs_exists = [], check_cpt_not_covered = [], has_approval = []
        this.selection_data.forEach(data => {
          // IF HMO CPT HAS FOR APPROVAL
          let check_cpt_has_approval = data.procedure_list.some(val => val.hmo_cpt_status === 'NEEDS APPROVAL')
          has_approval.push(check_cpt_has_approval)
  
          //IF CPT HAS RVS
          let check_phic_cpt = data.procedure_list.some(val => val.rvs_category) 
          check_rvs_exists.push(check_phic_cpt)
  
          // IF HMO CPT STATUS IS ALL NOT COVERED
          let check_hmo_cpt = data.procedure_list.every(val => !val.hmo_cpt_status || val.hmo_cpt_status === 'NOT COVERED') 
          check_cpt_not_covered.push(check_hmo_cpt)
        })
        hmo_cpt_has_approval = has_approval.includes(true) ? true : false
        check_rvs_exists = check_rvs_exists.includes(true) ? true : false
        check_cpt_not_covered = check_cpt_not_covered.every((value) => value === true )

        // check_rvs_exists = true
        // VALIDATE HMO/PHIC ICD STATUS
        this.selection_data.forEach((data, index) => {
          this.selection_data[0].hmo_icd_status = check_cpt_not_covered && this.process_type !== 'PHIC' && this.process_type !== 'LGU' && this.process_type !== 'PHIC_LGU'? 'NOT COVERED' : this.selection_data[0].hmo_icd_status
          if (index <= 1 && this.process_type !== 'HMO') {
            data.phic_icd_status =  check_rvs_exists ? 'COVERED' : 'NOT COVERED'
          } else {
            data.phic_icd_status = null
          }
        })
      }

      // REMOVE PROPERTY THAT IS NOT NEEDED
      const modified_selection_data = this.member_data.member.mem_hmo_host_code !== 'FC' ? this.modifySelectionData() : this.selection_data;
      
      return {modified_selection_data, result_page, hmo_cpt_has_approval, max_coverage_limit_balance}
    },

    redirectOPResult (payload) {
      const session_data = {
        process_type                : payload.process_type,
        trans_status                : payload.trans_status,
        hmo_icd_status              : payload.hmo_icd_status,
        transaction_number          : payload.trans_number,
        loa_generated_date          : payload.generated_date,
        loa_expiration_date         : payload.expiration_date,
        icd_limit_bal               : payload.icd_cpt_data[0].hmo_icd_limit_bal ? payload.icd_cpt_data[0].hmo_icd_limit_bal : 0,
        max_coverage_limit_balance  : payload.icd_cpt_data[0].max_coverage_balance ? payload.icd_cpt_data[0].max_coverage_balance : 0 ,
        icd_cpt_data                : payload.icd_cpt_data,
        doctor_notes                : this.trans_data.doctor_notes,
        doctor_data                 : this.doctor_data,
        chief_complaint             : this.trans_data.chief_complaint,
        is_vaccination              : null,
      }
      sessionStorage.setItem('LZ19XD15S0Y1YU',this.$crypto.AES.encrypt(JSON.stringify(session_data),'tKyk1d9zXo'))
      this.$router.replace('/outpatient-result')
    },

    //CLEAN SELECTION DATA 
    modifySelectionData () {
      let get_selection_data = this.selection_data 
      return get_selection_data.map((icd_item) => {
        delete icd_item.check_sob_status
        delete icd_item.ini_hmo_icd_status
        delete icd_item.selected_cpt
        delete icd_item.selected_icd
        delete icd_item.selected_cpt_holder

        icd_item.procedure_list.forEach(cpt_item => {
          delete cpt_item.chk_cpt_has_prv_rate
          delete cpt_item.cpt_amt_loader
          delete cpt_item.cpt_provider_rate
          delete cpt_item.cpt_rate
          delete cpt_item.for_hmo_check
          delete cpt_item.rvs_remaining_bal
          delete cpt_item.cpt_code_desc
          delete cpt_item.ini_phic_cpt_status
          return cpt_item
        })
        return icd_item
      })

    },

    // PREVENT THE USER FROM TYPING TEXT IN A NUMBER FIELD
    onKeyupText(evt){
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    formatNumber(value,parent_counter,counter_val){
      if(value) {
        let result = parseFloat(value.toString().replace(/,/g, "")).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        this.selection_data[parent_counter].procedure_list.map(() => {
          this.selection_data[parent_counter].procedure_list[counter_val].cpt_amount = !result.includes('.') ? result+'.00' : result
        })
      } else {
         this.selection_data[parent_counter].procedure_list.map(() => {
          this.selection_data[parent_counter].procedure_list[counter_val].cpt_amount = '0.00'
        })
      }
    },

    validate_provider_rate(icd_index,cpt_index){
      let prv_rate = parseFloat(this.selection_data[icd_index].procedure_list[cpt_index].cpt_provider_rate)
      let cpt_amount =  parseFloat(this.selection_data[icd_index].procedure_list[cpt_index].cpt_amount.toString().replace(/,/g, ''))
      this.selection_data[icd_index].procedure_list[cpt_index].chk_cpt_has_prv_rate = prv_rate && (cpt_amount > prv_rate) ? true : false
    },

    getCPTFilter(value) {
      this.selected_cpt_filter = value
    },

    redirect(to){
      if (to === '/code-scanning') sessionStorage.clear()
      this.$router.replace(to)
    },
    
  
  },

  beforeDestroy() {
    sessionStorage.removeItem('gcicaqeifpcv')
  },
}
</script>