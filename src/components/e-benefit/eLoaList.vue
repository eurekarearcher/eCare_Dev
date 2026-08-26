<template>
  <v-container fluid>
    <Navbar :navbar="navbar"/>
      <v-layout v-if="isLoading" align-center justify-center class="progress-load">
        <v-progress-circular color="primary" :size="50" indeterminate></v-progress-circular>
        <h3 class="light-blue--text text--darken-4 pl-5">Loading Print e-LOA Page... Please Wait</h3>
      </v-layout>

      <template v-else>
        <template v-if="eLOA_list.length !== 0">
          <v-btn @click="callAlert('eligibility')" text><v-icon left small>fas fa-arrow-left</v-icon>Go to Eligibility Page</v-btn>
          <center>
            <v-progress-circular v-if="img_loader === true" color="light-blue darken-4" height="10" class="mt-5" indeterminate rounded></v-progress-circular>
            <v-img  v-else :src="img" max-width="250"></v-img>
          </center>
          <v-layout wrap  justify-center px-5>
            <v-flex xl9 lg9 sm9>
              <h2 class=" my-5 font-weight-regular text-body-2 text-sm-h6 text-center">List of member's eLOA generated using eCare App</h2>           
              <h1 class="font-weight-medium grey--text text--darken-3 text-body-1 text-sm-h6 px-1">{{member_name.includes(null) ? 'N/A' : member_name}}</h1>
              <h3 class="font-weight-regular grey--text text--darken-3 text-body-1 text-sm-h6 px-1" >{{policy_number}}</h3>
              <h3 class="font-weight-regular grey--text text--darken-3 text-body-1 text-sm-h6 mb-4 px-1" >Healthcare Status: 
                <span class="font-weight-medium" 
                  :class="{
                    'green--text text--darken-1' : eLOA_list[0].hmo_healthcare_status == 'ACTIVE',
                    'red--text text--darken-1' : eLOA_list[0].hmo_healthcare_status != 'ACTIVE' }
                ">{{eLOA_list[0].hmo_healthcare_status}}</span>
              </h3>
              <v-card  v-for="(list, i) in eLOA_list" :key="i" :class="{'grey lighten-2' : eLOA_list[0].hmo_healthcare_status != 'ACTIVE'}" class="mb-3 cursor hover pa-1"> 
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-flex  lg10 md9 sm9 xs9>
                      <v-list-item-title class="caption text-sm-h6 font-weight-medium "> DR. {{list.doctor_name}}</v-list-item-title>
                      <v-list-item-subtitle class="mb-1 caption text-sm-subtitle-2">LOA generated date: {{list.loa_generated_date}}</v-list-item-subtitle>
                      <v-list-item-subtitle class="caption text-sm-subtitle-2">LOA expiration date: {{list.loa_expiration_date}}</v-list-item-subtitle>
                    </v-flex>
                    <v-flex lg2 md3 sm3 xs12 class="text-right mt-3">
                      <v-btn block color="blue darken-3 white--text"  @click="details(list)" :disabled="eLOA_list[0].hmo_healthcare_status != 'ACTIVE'">Details</v-btn>
                    </v-flex>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-flex>
          </v-layout>

          <!-- DIALOG/MODAL BOX FOR CONFIRMATION -->
          <v-dialog v-model="dialog" width="1000" persistent>
            <v-card>
              <v-card-title class="headline justify-center light-blue darken-4 white--text ">
                <h6 class="text-h6 text-sm-h6 py-sm-3 justify-center light-blue darken-4 white--text text-center"> eLOA CONFIRMATION</h6>

              </v-card-title>
              <v-card-text class="mt-5">
                <v-layout px-3 row justify-end>
                  
                  <v-btn class="btn mr-2" color="light-blue darken-4 white--text" @click="onQueue" :loading="btn_queue_load">ON QUEUE <v-icon small right>fas  fa-clipboard-list</v-icon></v-btn> <!--@click="confirmOutpatient" :loading="loading" :disabled="loading"-->
                  <v-flex pr-sm-3 lg12 sm12 xs12 mb-2>
                    <h4>Transaction Type</h4>
                    <v-card class="pa-2" outlined>{{ selected_list.transaction_type ? selected_list.transaction_type : 'N/A' }}</v-card>
                  </v-flex>
                  <v-flex pr-sm-3 lg12 sm12 xs12 mb-2>
                    <h4>CHIEF COMPLAINT</h4>
                    <v-textarea id="chief-complaint" v-model="selected_list.chief_complaint" readonly outlined no-resize hide-details></v-textarea>
                  </v-flex>
                  <v-flex pr-sm-3 lg6 sm6 xs12 mb-2>
                    <h4>DOCTOR</h4>
                    <v-card class="pa-2" outlined>{{ selected_list.doctor_name ? selected_list.doctor_name : 'N/A' }}</v-card>
                  </v-flex>
                  <v-flex pl-sm-3 lg6 sm6 xs12>
                    <h4>SPECIALIZATION</h4>
                    <v-card class="pa-2" outlined>{{ selected_list.specialization ? selected_list.specialization : 'N/A'}}</v-card>
                  </v-flex>
                  <v-flex lg12 sm12 xs12 mb-2>
                    <h4>DOCTOR ACCREDITATION</h4>
                    <v-card class="pa-2" outlined>{{ selected_list.phic_acc_no ? selected_list.phic_acc_no : 'N/A'}}</v-card>
                  </v-flex>
                  <v-flex pr-sm-3 lg6 sm6 xs12 mb-2>
                    <h4>DATE GENERATED</h4>
                    <v-card class="pa-2" outlined>{{ selected_list.loa_generated_date ? selected_list.loa_generated_date : 'N/A' }}</v-card>
                  </v-flex>
                  <v-flex pl-sm-3 lg6 sm6 xs12>
                    <h4>EXPIRATION DATE</h4>
                    <v-card class="pa-2" outlined>{{ selected_list.loa_expiration_date ? selected_list.loa_expiration_date : 'N/A'}}</v-card>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="justify-center">
                  <v-btn @click="cancel" class="btn mr-2" color="secondary" outlined rounded><v-icon small left>fas fa-times-circle</v-icon><span class="pr-2">CANCEL</span></v-btn> 
                  <v-btn @click="callAlert('eloa')"  class="btn mr-2" color="light-blue darken-4 white--text" rounded >CONFIRM <v-icon small right>fas fa-check-circle</v-icon></v-btn>
              </v-card-actions>

            </v-card>
          </v-dialog>    
                  
        </template>

        <template v-else>
          <v-layout wrap justify-center align-center style="height:80vh">
            <div class="mb-12">
              <h1 class="text-center display-4 yellow--text text--darken-1 mb-6" ><i class="fas fa-exclamation-circle"></i></h1>
              <h1 class="display-1 font-weight-light">Something went wrong with eLOA Transaction</h1>
            
              <v-flex xl12 lg12 sm12 class="text-center mt-8">
                <v-btn color="blue" depressed @click="proceedType('eligibility')" :loading="btn_loader" small dark>Proceed to Eligibility Page</v-btn>
              </v-flex>
            </div>
          </v-layout>
        </template>
      </template>
    <Alert  :alerts="alerts" @proceedType="proceedType"/>
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'
export default {
  components: {
    Navbar,
    Alert
  },
  data() {
    return {
      // NAVBAR
      navbar:[{title: "Home", link: '/code-scanning', icon: 'fas fa-home'}],

      // ELOA LIST DATA
      eLOA_list:[],
      selected_list:[],
      member_name: '',
      policy_number: '',
      host_code: '',
      img_loader:true,
      img:'',
      disclaimer:'',
      btn_loader:false,
      dialog: false,
      btn_queue_load:false,
      isLoading: true,

      //ALERT
      alerts:{},
    }
  },
  created() {
    this.member_name   = sessionStorage.getItem('ISDTYXL') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('ISDTYXL'),'heIu1h1Dn1w').toString(this.$crypto.enc.Utf8)) : ''
    this.policy_number = sessionStorage.getItem('IJ9NX250I15') ? this.$crypto.AES.decrypt(sessionStorage.getItem('IJ9NX250I15'),'heIu1h1Dn1w').toString(this.$crypto.enc.Utf8) : ''
    this.host_code = sessionStorage.getItem('IJ19Y0X15I') ? this.$crypto.AES.decrypt(sessionStorage.getItem('IJ19Y0X15I'),'heIu1h1Dn1w').toString(this.$crypto.enc.Utf8) : ''      
    this.eloaList();
    this.hostConfig();
  },

  methods: {
    eloaList() {
      let validate_eloa_list = sessionStorage.getItem('LSD0IDX') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LSD0IDX'),'heIu1h1Dn1w').toString(this.$crypto.enc.Utf8)) : []
      if(validate_eloa_list.length !== 0) return this.eLOA_list = validate_eloa_list

    },
    async hostConfig(){
      let response = await this.$services.getHostConfigByHost({
          hmo_host_code: this.host_code
      })

      if (response.status === 200) {
        this.isLoading = false
        this.img_loader = false
        this.img = response.data.host_logo
        this.disclaimer = response.data.host_disclaimer
      } else {
        this.alert = response.error
      }
    },
    details(item){
      this.dialog = true
      this.selected_list = item
    },
    async onQueue(){
      this.btn_queue_load = true
      let response = await this.$services.trnUpdateLoaConsultation({
          transaction_number     : this.selected_list.transaction_number,
          is_scanned             : '2',
          hmo_host_code          : this.host_code
      })

      if (response.status === 200) {
        this.btn_queue_load = false
        sessionStorage.clear()
        this.$router.replace('/queue-list')
      } else {
        this.alert = response.error
      }
    },
    cancel(){
      this.dialog = false
    },

    callAlert(type) {
      let alert_width = type === 'eligibility' ? '600' : '800'
      let alert_title = type === 'eligibility' ? 'This will redirect you to Member\'s Eligibility Page' :'Please note that member\'s eLOA will be used and cannot be undone'
      let alert_body  = type === 'eligibility' ? 'Do you want to proceed?' :'Do you want to proceed with this transaction?'

      this.alert = { 
        display: true, 
        type: 'standard', 
        width: alert_width, 
        icon: 'mdi-help-circle', 
        color: 'blue darken-1', 
        title: alert_title, 
        body: alert_body, 
        btn_pry_txt: 'Proceed', 
        btn_pry_color: 'primary', 
        btn_pry_otl: false, 
        btn_pry_act: 'loadingBtn',  
        btn_pry_emt: 'proceedType',
        btn_pry_params: type,
        btn_sec_txt: 'Cancel', 
        btn_sec_color: 'secondary', 
        btn_sec_otl: true, 
        btn_sec_act: 'closeAlert',
      }
    },

    async proceedType(to) {
      if (to === 'eligibility') {
        this.btn_loader = true
        let inamahanacw_qdgi = Math.random().toString(25).substring(2,15);
        let date_today =  this.$moment().format('YYYY/DD/MM')
        let  process_type = sessionStorage.getItem('GF45S') ? this.$crypto.AES.decrypt(sessionStorage.getItem('GF45S'),'fgGds32s').toString(this.$crypto.enc.Utf8) : null
        let  trn_add_phic_data = sessionStorage.getItem('TRP3S') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('TRP3S'),'lfFo34sf').toString(this.$crypto.enc.Utf8)) : null
        //SEND TO TRANSAC TABLE

        let response = await this.$services.trnAddEligibility({
            mem_hmo_policy_number : this.policy_number,
            provider_code         : this.$store.state.prv_data.provider_code,
            transaction_type      : 'ELIGIBILITY',
            date_availed          : date_today,
            eligibility_code      : inamahanacw_qdgi,
            created_by            : this.$store.state.usr_credentials.user_name,
            hmo_host_code         : this.host_code,
            provider_tin          : this.$store.state.prv_data.provider_tin,
            ...(process_type === 'HMO_PHIC' || process_type === 'HMO_PHIC_LGU' ? {
              hmo_healthcare_status : '',
              ek_phic_id            : trn_add_phic_data.ek_phic_id,
              phic_member_type      : trn_add_phic_data.phic_member_type,
              source_of_transaction : 'eclaims',
              transaction_number    : '',
              transaction_status    : '',
              request_type          : '',
              room_type             : '',
              room_rate             : '',
              claim_status          : '',
              forms_status          : '',
              phic_member_category  : trn_add_phic_data.phic_member_category,
              first_name            : trn_add_phic_data.first_name,
              middle_name           : trn_add_phic_data.middle_name,
              last_name             : trn_add_phic_data.last_name,
              initial               : trn_add_phic_data.initial,
              birthday              : trn_add_phic_data.birthday,
              gender                : trn_add_phic_data.gender,
              phone_no              : trn_add_phic_data.phone_no,
              mobile_no             : trn_add_phic_data.mobile_no,
              email_add             : trn_add_phic_data.email_add,
              mailing_add           : trn_add_phic_data.mailing_add,
              zip_code              : '',
              phic_number           : '',
              phil_claim_type       : '',
              receipt_ticket_number : '',
              ad_forms_progress_status: '',
              phic_member_status    : trn_add_phic_data.phic_member_status,
              suffix                : '',
              phic_member_eligibility_status : 'Eligible',
              prn_phic_member_type  : trn_add_phic_data.prn_phic_member_type,
              prn_member_pin        : trn_add_phic_data.prn_member_pin,
              prn_first_name        : trn_add_phic_data.principal_data ? trn_add_phic_data.principal_data.FIRST_NAME._text : 'N/A',
              prn_middle_name       : trn_add_phic_data.principal_data ? trn_add_phic_data.principal_data.MIDDLE_NAME._text : 'N/A',
              prn_last_name         : trn_add_phic_data.principal_data ? trn_add_phic_data.principal_data.LAST_NAME._text : 'N/A',
              prn_initial           : '',
              prn_birthday          : trn_add_phic_data.principal_data ? trn_add_phic_data.principal_data.BIRTHDATE._text : 'N/A',
              prn_gender            : trn_add_phic_data.principal_data ? trn_add_phic_data.principal_data.GENDER._text : null,
              prn_phone_no          : trn_add_phic_data.principal_data ? trn_add_phic_data.principal_data.PHONE_NO._text : 'N/A',
              prn_mobile_no         : trn_add_phic_data.principal_data ? trn_add_phic_data.principal_data.MOBILE_NO._text : 'N/A',
              prn_email_add         : trn_add_phic_data.principal_data ? trn_add_phic_data.principal_data.EMAIL_ADDRESS._text : 'N/A',
              prn_zip_code          : trn_add_phic_data.principal_data ? trn_add_phic_data.principal_data.ZIP_CODE._text : 'N/A',
              prn_phic_number       : '',
              prn_quali_posted_contri: '',
              prn_suffix            : trn_add_phic_data.principal_data ? trn_add_phic_data.principal_data.SUFFIX._text : 'N/A',
              prn_date_updated      : '',
              phic_tracking_number  : trn_add_phic_data.phic_tracking_number,
            } : undefined)
        })

        if (response.status === 200) {
          if(!response.data.success){
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            return
          }
          response.data = this.responseDataDecryption(response.data)
          if(response.data.request_id)  sessionStorage.setItem('ETR6G', this.$crypto.AES.encrypt(response.data.request_id, 'lfFo34sf')) // REQUEST ID
          
          //GENERATE MEMBER_AUTH
          this.btn_loader = false
          let random_number = Math.random().toString(25).substring(3,15);
          let seconds =  this.$moment().format('ss')
          let generated_number = random_number+seconds
          this.$store.commit("setMemberAuth", generated_number);
          this.$router.replace('/eligibility')
        } else {
          this.alert = response.error
        }
      } else {
        sessionStorage.clear()

        let response = await this.$services.trnUpdateLoaConsultation({
          transaction_number : this.selected_list.transaction_number,
          is_scanned         : '1',
          transaction_status : 'ISSUED',
          hmo_host_code      : this.host_code
        })

        if (response.status === 200) {
          let print_data = {
            policy_number : this.policy_number,
            host_code     : this.host_code,
            logo: this.img,
            disclaimer: this.disclaimer,             
            transaction_number: this.selected_list.transaction_number,
          }
          sessionStorage.setItem('JXILLYS',this.$crypto.AES.encrypt(JSON.stringify(print_data),'heIu1h1Dn1w'))
          this.$router.replace('print-eLOA')
        } else {
          this.alert = response.error
        }
      }
    }
  },

  beforeDestroy(){
    sessionStorage.removeItem('LSD0IDX')
    sessionStorage.removeItem('ISDTYXL')
    sessionStorage.removeItem('TRP3S')
  },
}
</script>

<style scoped>
.cursor{
  cursor: pointer !important ;
}
.hover:hover{
  background:#EEEEEE
}
.progress-load{
  height:80vh;
}
</style>