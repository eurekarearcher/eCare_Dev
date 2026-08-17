<template>
  <v-container fluid> 
    <v-layout v-if="isLoading" align-center justify-center class="progress-load">
      <v-progress-circular color="primary" :size="50" indeterminate></v-progress-circular>
      <h3 class="light-blue--text text--darken-4 pl-5">Loading Print e-LOA Page... Please Wait</h3>
    </v-layout>

    <v-row v-else> 
      <v-col lg="2" md="2" class="hidden-md-and-down d-print-none">
        <div class="d-flex flex-row-reverse">
          <v-btn v-show="back_to_qr" @click="dashboard" id="back-button"><v-icon color="light-blue darken-3"  left small>fas fa-arrow-left</v-icon>BACK TO QR PAGE</v-btn>
        </div>
      </v-col>

      <v-col lg="8" md="10" sm="12" cols="12"  order="1">
        
          <PrintConsultationVC v-if="host_code === 'VC'"
            :member="mem_data"
            :utility_data="utility_data"
            :provider_name="$store.state.prv_data.provider_name"
            :session_data="session_data"
            :bday="bday"
       
          />

         <PrintConsultationGen v-else
          :member="mem_data"
          :utility_data="utility_data"
          :provider_name="$store.state.prv_data.provider_name"
          :session_data="session_data"
          :bday="bday"
          id="loa"
        />
        
      </v-col>

      <v-col lg="2" md="2" sm="12" cols="12" class="d-print-none" order="2">
         <v-layout wrap >
            <v-col v-show="back_to_qr" lg="12"  class="hidden-lg-and-up  text-center text-lg-left">
              <v-btn @click="dashboard" large class="py-10 white mb-lg-5" >
                <v-layout wrap justify-center>
                  <v-flex sm12 xs12> <v-icon size="30" color="light-blue darken-3">fas fa-arrow-left</v-icon></v-flex> 
                  <h6 class="mt-1 body-md-2  font-weight-medium" style="font-size:7pt !important">QR Page</h6>
                </v-layout>
              </v-btn>
            </v-col>
            <v-col lg="12"  class="mr-lg-12 text-center text-lg-left" >
              <v-btn @click="print" large class=" py-10 px-sm-6  white">
                <v-layout wrap justify-center>
                  <v-flex sm12 xs12> <v-icon size="30" color="light-blue darken-3">fas fa-print</v-icon></v-flex> 
                  <h6 class="mt-1 body-md-2 font-weight-medium" style="font-size:7pt !important">Print</h6>
                </v-layout>
              </v-btn>
            </v-col>
            <v-col lg="12"  class="mr-lg-12 text-center text-lg-left">
              <v-btn @click="savePDF" :loading="save_loader" large class="py-10  white" >
                <v-layout wrap justify-center>
                  <v-flex sm12 xs12> <v-icon size="30" color="light-blue darken-3">fas fa-file-pdf</v-icon></v-flex> 
                  <h6 class="mt-1 body-md-2 font-weight-medium" style="font-size:7pt !important">SAVE PDF</h6>
                </v-layout>
              </v-btn>
            </v-col>
        </v-layout>
      </v-col>
    </v-row>
    <IdleTimer />
    <Alert :alert="alert" />
  </v-container>
</template>

<script>
import loaPDF from '@/components/e-benefit/loaPDF.js'
import IdleTimer from '@/components/IdleTimer.vue'
import Alert from '@/components/Alert.vue'
import PrintConsultationGen from '@/components/e-benefit/Consultation/PrintConsultationGen.vue'
import PrintConsultationVC from '@/components/e-benefit/Consultation/PrintConsultationVC.vue'


export default {
  components:{
    PrintConsultationGen,
    PrintConsultationVC,
    IdleTimer,
    Alert,
  },
  created(){
    this.getLOA();
  },

  data(){
    return{
      host_code:'',
      policy_no:'',
      back_to_qr:false,
      save_loader:false,
      mem_data:[],
      isLoading: true,

      alert: {},

      bday:'',
      session_data:[],
      utility_data:{
          validTil: '',
          date: this.$moment().format(),
          disclaimer:'',
          show_img:false,
          days_validity:'',
          back_to_qr:false,
          dashboard_load:false,
          logo:'',
          load_save:false,
          logo_loader:true,
          img_loader:true,
          mem_err_photo:false,
      },
    }
  },



  methods: {
    dashboard(){
      this.$router.replace('/code-scanning')
    },

    // FOR DATE FORMATTING
    async getLOA(){
      let print_data = sessionStorage.getItem('JXILLYS') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('JXILLYS') , 'heIu1h1Dn1w').toString(this.$crypto.enc.Utf8)) : ''
      this.host_code = print_data.host_code
      this.policy_no = print_data.policy_number
      let response = await this.$services.getMemberLoaConsultation({
          provider_code: this.$store.state.prv_data.provider_code,
          mem_hmo_policy_number: this.policy_no, 
          transaction_number: print_data.transaction_number
      })

      if (response.status === 200) {
        if(response.data.mem_hmo_status.toUpperCase() === 'A' || response.data.mem_hmo_status.toUpperCase() === 'ACTIVE'){
          response.data.mem_hmo_status = 'ACTIVE'
        }else if(response.data.mem_hmo_status.toUpperCase() == 'C' || response.data.mem_hmo_status.toUpperCase() == 'CANCELLED' ){
          response.data.mem_hmo_status = 'CANCELLED'
        }else if(response.data.mem_hmo_status.toUpperCase() == 'H' || response.data.mem_hmo_status.toUpperCase() == 'ON HOLD'){
          response.data.mem_hmo_status = 'ON HOLD'
        }else if(response.data.mem_hmo_status.toUpperCase() == 'L' || response.data.mem_hmo_status.toUpperCase() == 'LAPSED'){
          response.data.mem_hmo_status = 'LAPSED'
        }else if(response.data.mem_hmo_status.toUpperCase() == 'E' || response.data.mem_hmo_status.toUpperCase() == 'EXPIRED'){
          response.data.mem_hmo_status = 'EXPIRED'
        }else{
          response.data.mem_hmo_status ='INACTIVE'
        }

        let first_name = response.data.mem_first_name
        let last_name  = response.data.mem_last_name
        let middle_name = response.data.mem_middle_name
        const full_name = first_name+' '+last_name+' '+middle_name
        response.data.mem_hmo_type = response.data.mem_type
        response.data.p_name = full_name.includes(null) || full_name == '  ' ? 'N/A' : full_name

        this.utility_data.validTil =  this.$moment(response.data.loa_expiration_date).format("MM/DD/YYYY")   
        this.utility_data.date   =  this.$moment(response.data.loa_generated_date).format('MM/DD/YYYY')
        this.session_data.icd_cpt_data = response.data.icd_cpt_data
        this.session_data.doctor_code = response.data.doctor_code
        this.session_data.doctor_name = response.data.doctor_name
        this.session_data.chief_complaint = response.data.chief_complaint
        this.session_data.approval_code = response.data.hmo_approval_code
        this.bday = response.data.mem_birthdate

        this.utility_data.logo = print_data.logo
        this.utility_data.disclaimer = print_data.disclaimer
        this.mem_data = response.data
        this.isLoading = false

        await this.$services.trnDelNameById({ mem_hmo_policy_number   :  response.data.mem_hmo_policy_number })
      } else {
        this.alert = response.error
      }
    },
   
    print(){
      this.back_to_qr = true
      window.scrollTo(0, 0);
      window.print();
    },
    // FOR SAVING AS PDF
    savePDF() {
      this.save_loader = true
      this.back_to_qr = true
      if (this.mem_data.hmo_host_code === 'VC') {
        loaPDF.vcPDF(this.mem_data, this.utility_data, this.session_data, this.$store.state.prv_data.provider_name, this.bday,'e-CONSULTATION', 'eloa-consultation.pdf')
      } else {
        loaPDF.generalPDF(this.mem_data, this.utility_data, this.session_data, this.$store.state.prv_data.provider_name, this.bday,'e-CONSULTATION', 'eloa-consultation.pdf')
      }
      this.save_loader = false
    }
      
  }
};
</script>

<style scoped>
.progress-load{
  height:80vh;
}
</style>
