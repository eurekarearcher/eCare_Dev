<template>
  <v-container fluid style="height:100%">
    <Navbar @onQueue="onQueue"/>
    <v-row v-if="page_loader" dense justify="center" align-content="center" style="height:100%">
      <v-progress-circular size="35" color="primary" indeterminate></v-progress-circular>
      <h4 class="loader-title"> Loading Outpatient Results Page... Please wait...</h4>
    </v-row>

    <div v-else>
      <!-- ON QUEUE BUTTON -->
      <v-btn @click="onQueue('for-queue')" :loading="btn_queue_load" :class="open_chat_btn ? 'float' : 'fixed'" color="blue" dark class="mt-3"> 
        <v-icon  left>mdi-clipboard-list</v-icon>Put on Queue 
      </v-btn>

      <!-- CHAT BUTTON -->
      <div class="fixed" style="top:135px" >
        <v-badge :value="unreaded_msg_count > 0" :content="unreaded_msg_count" color="green pt-2" overlap left>
            <v-btn v-if="validate_submit_btn.claim_type == 'INITIAL'"  @click="hideChat" color="blue" class="pr-10" dark>
              <v-icon  left>mdi-chat</v-icon>Open Chat
            </v-btn> 
        </v-badge>
      </div>

      <OutpatientResultsGen
        :member_data  ="member_data.member"
        :isAccredited ="member_data.isAccredited"
        :process_type ="process_type"
        :icd_cpt_data ="icd_cpt_data"
        :eligibility_status ="eligibility_status"
        :doctor_data  ="session_data.doctor_data"
        :claim_type   ="validate_submit_btn.claim_type"
        :trans_status ="session_data.trans_status"
        :doctor_notes ="session_data.doctor_notes"
        :hmo_cc_notes ="hmo_cc_notes"
        :host_config  ="!member_data.config ? true : false"
        :confirm_loader="confirm_loader"
        :btn_queue_load="btn_queue_load"
        @result-submit="resultSubmit"
        @result-cancel="resultCancel"
        class="px-md-12"
      />

      <Chat
        v-if="validate_submit_btn.claim_type === 'INITIAL'"
        :transaction_number="session_data.transaction_number"
        :open_chat_btn="open_chat_btn"
        :view_chat="view_chat"
        @hide-chat="hideChat"
        @unread-msg-count="getMsgCount"
      />
    </div>
    
    <Alert :alert="alert" @backQr="backQr" @resultSubmit="resultSubmit" @onQueue="onQueue" ref="alert"/>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'
import Chat from "@/components/Chat.vue";
import OutpatientResultsGen from '@/components/e-benefit/Outpatient/OutpatientResultsGen.vue'

export default {
  name: 'OPResultPage',
  components:{Navbar, Alert, OutpatientResultsGen, Chat},
  data() {
    return {
      // SESSION, LOCAL, COOKIE DATA
      process_type: sessionStorage.getItem("GF45S") ? this.$crypto.AES.decrypt(sessionStorage.getItem("GF45S"),"fgGds32s").toString(this.$crypto.enc.Utf8): null,
      eligibility_status: sessionStorage.getItem('ROTSR') ? this.$crypto.AES.decrypt(sessionStorage.getItem('ROTSR'),'lFdt04sg').toString(this.$crypto.enc.Utf8) : null,

      // RESULTS DATA
      session_data: [],
      icd_cpt_data: [],
      vaccine_list:[],
      total_cpt_amount: 0,
      hmo_icd_limit_bal: 0,
      max_coverage_balance: 0,
      hmo_cc_notes:'',
      confirm_loader: false,
      // TIMEOUT
      cpt_timeout: "",
      // NAVBAR
      help: [{ content: "Outpatient Results" }],
      // ALERT
      alerts: {},
      alert: {},
      // CHAT
      open_chat_btn: true,
      unreaded_msg_count: 0,
      view_chat: false,
      // ON QUEUE
      btn_queue_load: false,

      //CANCELLATION TOKEN
      cancelToken:null,
      source:null,

      // ROUTER LEAVE
      is_allow_to_leave: false,
    }
  },

  mounted() {
    this.CancelToken = this.$axios.CancelToken;
    this.source = this.CancelToken.source();
    this.callData();
    this.getResultsData();
  },

  computed: {
    // GET MEMBER_DATA FROM VUEX
    ...mapState(["member_data"]),

    // FOR VALIDATING WHETHER TO SHOW PAGE LOADER OR RESULTS PAGE CONTENT
    page_loader () {
      if (!this.member_data?.member && !this.icd_cpt_data.length > 0) return true
      return false
    },

    // VALIDATE IF THE TRANSACTION HAS VACCINE
    validate_selected_vaccine () {
      let push_result = [], all_selected_is_vaccine = false, has_vaccine = false
      this.icd_cpt_data.map(item => {
        item.procedure_list.map(proc => {
          push_result.push(this.vaccine_list.some(data => data.cpt_description === proc.cpt_description))
        })
      })
      all_selected_is_vaccine = push_result.every(data => data === true)
      has_vaccine = push_result.some(data => data === true)
      return {all_selected_is_vaccine, has_vaccine}
    },
  
    // VALIDATE PROCEDURE TO GET CLAIM TYPE AND FORM STATUS
    validate_submit_btn () {
      let claim_type = null , form_status = null, get_cpt_list = []
      // GET ALL PROCEDURES FROM DIFFERENT ICD
      this.icd_cpt_data.forEach(icd_data => icd_data.procedure_list.forEach(cpt_data => get_cpt_list.push(cpt_data)))
      if (get_cpt_list.length > 0) {
        if (get_cpt_list.some(item => item.hmo_cpt_status === 'NEEDS APPROVAL')) {
          claim_type = 'INITIAL'
        } else if (get_cpt_list.some(item => item.rvs_category && item.hmo_cpt_approved_amount > 0)) {
          claim_type = 'FOR HMO AND PHIC CLAIMS', form_status = 'On Process'
        } else if (get_cpt_list.some(item => item.rvs_category && item.hmo_cpt_approved_amount == 0)) {
          claim_type = 'FOR PHIC CLAIMS', form_status = 'On Process'
        } else if (get_cpt_list.every(item => !item.rvs_category) && get_cpt_list.some(item => item.hmo_cpt_approved_amount > 0)) {
          claim_type = 'FOR HMO CLAIMS'
        } else {
          claim_type = 'NOT FOR CLAIMS'
        }
      }
      return {claim_type, form_status}
    },
  },

  watch:{
    validate_submit_btn() {
      if (this.validate_submit_btn.claim_type !== "INITIAL" && this.session_data.trans_status === 'NEEDS APPROVAL') {
        this.session_data.icd_cpt_data  = this.icd_cpt_data;
        this.session_data.icd_limit_bal = this.hmo_icd_limit_bal;
        this.session_data.max_coverage_limit_balance = this.max_coverage_balance;
        sessionStorage.setItem("LZ19XD15S0Y1YU", this.$crypto.AES.encrypt( JSON.stringify(this.session_data), "tKyk1d9zXo"));
        clearTimeout(this.cpt_timeout);
        this.view_chat = false;
      }
    },
    icd_cpt_data() {
      if (this.icd_cpt_data[0].hmo_icd_status === "NOT COVERED" && this.session_data.trans_status === 'NEEDS APPROVAL') {
        if (this.validate_submit_btn.claim_type === "INITIAL") {
          this.icd_cpt_data[0].hmo_icd_status = "WAITING FOR APPROVAL";
        } else if (this.validate_submit_btn.claim_type === "NOT FOR CLAIMS") {
          this.icd_cpt_data[0].hmo_icd_status = "NOT COVERED";
        } else {
          this.icd_cpt_data[0].hmo_icd_status = "COVERED";
        }
      }
    },
  },

  methods: {
    // FOR VALIDATING IF HOST CONFIG HAS DATA 
    async callData() {
      if(!this.member_data?.config) await this.dispatchConfig();
    },
    
    // FOR CALLING HOST CONFIG FROM VUEX
    async dispatchConfig() {
      let config_params = {}
      if (this.process_type.includes('HMO')){
        config_params = {post: 'HMO', host_code: this.member_data.member.mem_hmo_host_code}
      } else if (this.process_type === 'LGU' || this.process_type === 'PHIC_LGU') {
        config_params =  {post:'LGU',host_code: this.member_data.member.lgu_host_code}
      } else {
        config_params = {post:'PHIC',host_code: 'PHIC'}
      }
      await this.$store.dispatch("getHostConfig", config_params)
    },

    // FOR GETTING THE DATA NEEDED IN OP RESULTS PAGE
    getResultsData () {
      this.session_data = sessionStorage.getItem("LZ19XD15S0Y1YU")? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("LZ19XD15S0Y1YU"),"tKyk1d9zXo").toString(this.$crypto.enc.Utf8)): []
      this.icd_cpt_data = this.session_data.icd_cpt_data;
      this.hmo_icd_limit_bal = this.session_data.icd_limit_bal;
      this.max_coverage_balance = this.session_data.max_coverage_limit_balance;
      this.hmo_cc_notes = this.session_data.icd_cpt_data[0].hmo_cc_notes ? this.session_data.icd_cpt_data.hmo_cc_notes : null 
      if (this.validate_submit_btn.claim_type === "INITIAL") {
        this.view_chat = true;
        this.get_cpt()
      }
    },
    
    // FOR CALLING THE TRANSACTION DIAGNOSIS / PROCEDURE DATA
    async get_cpt() {
      let response = await this.$services.getTransactionIcdCpt({
        transaction_number: this.session_data.transaction_number,
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        this.icd_cpt_data = response.data;
        this.max_coverage_balance = response.data[0].hmo_max_coverage_bal;
        this.hmo_icd_limit_bal = response.data[0].hmo_icd_limit_bal;
        this.hmo_cc_notes = response.data[0].hmo_cc_notes ? response.data[0].hmo_cc_notes : null
        this.cpt_timeout = setTimeout(() => this.get_cpt(), 3000)
      } else {
        this.alert = response.error
      }
    },

    async getVaccineList() {
      let response = await this.$services.getProviderCPT({
        selection_type :  'covid_vaccination',
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        this.vaccine_list = response.data === 'Data not found.' ? [] : response.data
      } else {
        this.alert = response.error
      }
    },

    // FOR QUEUING THE TRANSACTION
    async onQueue(type) {
      this.btn_queue_load = true;
      let response = await this.$services.trnUpdateOutpatientIcd({
        transaction_number: this.session_data.transaction_number,
        transaction_status: this.validate_submit_btn.claim_type !== "INITIAL" ? "FOR CONCLUSION": "WAITING FOR APPROVAL",
        on_queue: 0,
        processing_by: "clear_data",
      })

      if(response.status === 200) {
        this.is_allow_to_leave = true
        if (type === 'for-logout') return this.$refs.alert.logoutUser()
        sessionStorage.clear();
        this.$store.commit('removeMemberData')
        return this.$router.replace("/queue-list");
      } else {
        this.alert = response.error
      }
    },

    async resultSubmit(status) {
      this.confirm_loader = status == "ISSUED" ? true : false;

      let approval_code = "N/A";
      if (status == "ISSUED") {
        //GET TOTAL CPT APPROVED AMOUNT
        this.icd_cpt_data.forEach(data => {
          this.total_cpt_amount = this.total_cpt_amount + data.procedure_list.reduce((sum, cpt) => {
            return sum + parseFloat(cpt.hmo_cpt_approved_amount)
          },0)
        })

        //IF OP TRANSACTION IS ALREADY COVERED, SUBTRACT NEW BALANCE  TO PREVIOUS BALANCE
        if (this.session_data.trans_status === "COVERED") {
          if (this.total_cpt_amount !== null && this.validate_selected_vaccine.all_selected_is_vaccine === false) {
            this.hmo_icd_limit_bal = parseFloat(this.hmo_icd_limit_bal).toFixed(2) - parseFloat(this.total_cpt_amount).toFixed(2);
            this.max_coverage_balance = parseFloat(this.max_coverage_balance).toFixed(2) -parseFloat(this.total_cpt_amount).toFixed(2);
          }
        }

        //GENERATE APPROVAL_CODE
        if (this.process_type.includes('HMO')) {
          let random_code = Math.random().toString(25).substring(2, 15);
          approval_code =  this.member_data.config.prefix_approval_code+"-"+random_code.toUpperCase();
        }

      } else {
        let partial_amount = 0;
        let validate_for_approval = [];
        for (let x = 0; x < this.icd_cpt_data.length; x++) {
          this.icd_cpt_data[x].procedure_list.map((value) => {
            partial_amount = partial_amount + parseFloat(value.hmo_cpt_approved_amount);
            validate_for_approval.push(value.for_hmo_approval);
          });
        }
        validate_for_approval = validate_for_approval.some((i) => parseFloat(i) !== 0);
        
        if ( this.validate_submit_btn.claim_type !== "INITIAL" && validate_for_approval) {
          this.session_data.icd_limit_bal = parseFloat(this.session_data.icd_limit_bal) + partial_amount;
          this.session_data.max_coverage_limit_balance = parseFloat(this.session_data.max_coverage_limit_balance) + partial_amount;
        }
      }

      let icd_stat = "", is_approval = false;
      if (this.session_data.hmo_icd_status === "NEEDS APPROVAL") {
        if(this.validate_submit_btn.claim_type === 'INITIAL'){
          icd_stat = 'NEEDS APPROVAL';
        }else if(this.validate_submit_btn.claim_type === 'NOT FOR CLAIMS'){
          icd_stat = 'DISAPPROVED';
          is_approval = true;
        }else{
          icd_stat = 'APPROVED'
          is_approval = true;
        }
      } else {
        icd_stat = "COVERED";
      }

      let response = await this.$services.trnUpdateOutpatientIcd({
        transaction_number  : this.session_data.transaction_number,
        icd_code            : this.icd_cpt_data[0].icd_code,
        transaction_status  : status === "ISSUED" ? "ISSUED" : "CANCELLED BY PROVIDER",
        approval_code       : approval_code, 
        hmo_loa_amount      : status === "ISSUED" ? this.total_cpt_amount : 0,
        hmo_host_code       : this.member_data.member.mem_hmo_host_code ? this.member_data.member.mem_hmo_host_code : null,
        host_claim_type     : status === "ISSUED"? this.validate_submit_btn.claim_type: "NOT FOR CLAIMS",
        concluded_by        : this.$store.state.usr_credentials.user_name,
        phic_icd_status     : this.icd_cpt_data[0].hmo_icd_status,
        lgu_icd_status      : null,

        ...(this.session_data.trans_status === "COVERED" || status === "CANCELLED BY PROVIDER" ? {
          hmo_icd_limit_bal:status === "CANCELLED BY PROVIDER"? parseFloat(this.session_data.icd_limit_bal): parseFloat(this.hmo_icd_limit_bal),
          hmo_max_coverage_bal: status === "CANCELLED BY PROVIDER" ? parseFloat(this.session_data.max_coverage_limit_balance) : parseFloat(this.max_coverage_balance),
        }: undefined),
            
        ...(this.session_data.hmo_icd_status === "NEEDS APPROVAL" && is_approval == true ?{
          hmo_icd_status: icd_stat,
        }: undefined),

        ...(this.validate_submit_btn.form_status !== null && status === "ISSUED"?{
          ad_forms_progress_status: this.validate_submit_btn.form_status,
        }: undefined),
      })

      if(response.status === 200) {
        this.is_allow_to_leave = true
        if (response.data.is_updated === false) {
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          return
        }

        if (status === 'CANCELLED BY PROVIDER' || (this.member_data.member.mem_hmo_host_code === 'VC' && this.validate_submit_btn.claim_type === 'FOR PHIC CLAIMS')) return this.backQr()
        
        if (this.validate_selected_vaccine.all_selected_is_vaccine) {
            this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: 'Transaction has been completed', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'backQr'}
        } else {
          const print_data = {
            icd_cpt_data: this.icd_cpt_data,
            doctor_data: this.session_data.doctor_data,
            chief_complaint: this.session_data.chief_complaint,
            doctor_notes: this.session_data.doctor_notes,
            hmo_notes: "",
            approval_code: approval_code,
            process_type: this.session_data.process_type,
            loa_generated_date: this.session_data.loa_generated_date,
            loa_expiration_date: this.session_data.loa_expiration_date,
          };
          sessionStorage.setItem("JM9SO0Y1YV",this.$crypto.AES.encrypt(JSON.stringify(print_data),"tKyk1d9zXo"));
          this.$router.replace("/print-outpatient");
        }
      } else {
        this.alert = response.error
      }
    },
    
    resultCancel() {
      let alert_title =  this.validate_submit_btn.claim_type === 'NOT FOR CLAIMS'  ?  "This transaction will be cancelled because the request was disapproved" : "This will cancel the approval of this transaction"
      let alert_body = this.validate_submit_btn.claim_type === 'NOT FOR CLAIMS' ? "<b style='font-size:10pt'><i>Note: <span class='font-weight-medium'>Patient can shoulder the transaction fee to proceed with the transaction.</span></i></b>" : "Are you sure you want to leave?"
      this.alert = { 
        display: true, 
        type: 'standard', 
        width:  this.validate_submit_btn.claim_type === 'NOT FOR CLAIMS' ? "820" : "600", 
        icon: this.validate_submit_btn.claim_type === 'NOT FOR CLAIMS' ?  'mdi-alert-circle' : 'mdi-help-circle', 
        color: 'blue darken-1', 
        title: alert_title, 
        body: alert_body, 
        btn_pry_txt: this.validate_submit_btn.claim_type === 'NOT FOR CLAIMS' ? 'Ok' : "Leave", 
        btn_pry_color: this.validate_submit_btn.claim_type === 'NOT FOR CLAIMS' ? "primary" :"secondary", 
        btn_pry_otl: this.validate_submit_btn.claim_type === 'NOT FOR CLAIMS' ? false : true, 
        btn_pry_act: 'loadingBtn',  
        btn_pry_emt: 'resultSubmit',
        btn_pry_params: 'CANCELLED BY PROVIDER',
        btn_sec_txt: this.validate_submit_btn.claim_type === 'NOT FOR CLAIMS' ? 'Back' : "stay on this page", 
        btn_sec_color: this.validate_submit_btn.claim_type === 'NOT FOR CLAIMS' ? "secondary" :"primary", 
        btn_sec_otl: this.validate_submit_btn.claim_type === 'NOT FOR CLAIMS' ? true : false, 
        btn_sec_act: 'closeAlert',
      }
    },

    onQueueAlert() {
      this.alert = { 
        display: true, 
        type: 'standard', 
        width: '620', 
        icon: 'mdi-help-circle', 
        color: 'blue darken-1', 
        title: 'Transaction will be put on queue if you leave this page', 
        body: 'Are you sure you want to leave?', 
        btn_pry_txt: 'leave', 
        btn_pry_color: 'secondary', 
        btn_pry_otl: true, 
        btn_pry_act: 'loadingBtn',  
        btn_pry_emt: 'onQueue',
        btn_pry_params: 'for-queue',
        btn_sec_txt: 'Stay on this page', 
        btn_sec_color: 'primary', 
        btn_sec_otl: false, 
        btn_sec_act: 'closeAlert',
      }
    },

    hideChat() {
      this.open_chat_btn = !this.open_chat_btn;
    },

    getMsgCount(count) {
      this.unreaded_msg_count = count;
    },

    backQr() {
      sessionStorage.clear()
      this.$router.replace('/code-scanning')
    },
  },

  beforeDestroy() {
    clearTimeout(this.cpt_timeout);
    this.source.cancel();
    sessionStorage.removeItem("LZ19XD15S0Y1YU");
    sessionStorage.removeItem("oIohiK_pvcE");
  },

  beforeRouteLeave(to, from, next) {
    if (this.is_allow_to_leave) return next()
    this.onQueueAlert()
    return next(false)
  },
}
</script>

<style scoped>
.fixed{
    position:fixed; 
    z-index:5;
    right:0;
}
.float{
    position:absolute;
    right: 0;
}
</style>