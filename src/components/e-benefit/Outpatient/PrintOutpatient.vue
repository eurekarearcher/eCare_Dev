<template>
  <v-container fluid>
    <v-row justify-md="center">
    
      <v-col lg="2" md="2" class="hidden-md-and-down d-print-none">
        <div class="d-flex flex-row-reverse">
          <v-btn v-show="utility_data.back_to_qr" @click="dashboard" :loading="utility_data.dashboard_load" ><v-icon color="light-blue darken-3"  left small>fas fa-arrow-left</v-icon>BACK TO QR PAGE</v-btn>
        </div>
      </v-col>

      <v-col lg="7" md="9" sm="12" cols="12"  order="1">
        <PrintOutpatientVC v-if="member_data.member.mem_hmo_host_code === 'VC'" 
          :member_data="member_data"
          :provider_name="$store.state.prv_data.provider_name"
          :session_data="session_data"
          :utility_data="utility_data"
          :diagnosis="diagnosis"
          :procedure="procedure"
          id="P"
      
        />
        <PrintOutpatientGen v-else
          :member_data="member_data"
          :provider_name="$store.state.prv_data.provider_name"
          :session_data="session_data"
          :utility_data="utility_data"
          :eligibility_status="eligibility_status"
          id="P"
        
        />
      </v-col>

       <v-col lg="2" md="2" sm="12" cols="12" class="d-print-none" order="2">
        <!-- ACTION BUTTONS IF SCREEN IS LESS THAN < 1200 -->
        <v-layout wrap >
            <v-col v-show="utility_data.back_to_qr" lg="12"  class="hidden-lg-and-up  text-center text-lg-left">
              <v-btn @click="dashboard" :loading="utility_data.dashboard_load" large class="py-10 white mb-lg-5" >
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
              <v-btn @click="save" :loading="utility_data.save_loader" large class="py-10  white" >
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
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import loaPDF from '@/components/e-benefit/loaPDF.js'
import PrintOutpatientGen from '@/components/e-benefit/Outpatient/PrintOutpatientGen.vue'
import PrintOutpatientVC from '@/components/e-benefit/Outpatient/PrintOutpatientVC.vue'
import IdleTimer from '@/components/IdleTimer.vue'

export default {
  components:{
    PrintOutpatientGen,
    PrintOutpatientVC,
    IdleTimer,
  },
  data() {
    return {
      eligibility_status: sessionStorage.getItem('ROTSR') ? this.$crypto.AES.decrypt(sessionStorage.getItem('ROTSR'),'lFdt04sg').toString(this.$crypto.enc.Utf8) : null,
      procedure:[],
      diagnosis:[],
      alerts:[],
      session_data:[],
      utility_data:{
        validTil: '',
        date: this.$moment().format("MM-DD-YYYY"),
        disclaimer:'',
        show_img:false,
        back_to_qr:false,
        dashboard_load:false,
        logo:'',
        logo_loader:true,
        img_loader:true,
        mem_err_photo:false,
        save_loader:false,
      },  
    }
  },
  created(){
    this.session_data  = sessionStorage.getItem('JM9SO0Y1YV') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('JM9SO0Y1YV'),'tKyk1d9zXo').toString(this.$crypto.enc.Utf8)) : []
  },
  mounted() {
    if(this.member_data.config) this.load_config()
    if(this.member_data.member.mem_hmo_host_code === 'VC'){
      this.splitData();
    }
  },
  computed: {
    ...mapState(["member_data"]),
  },
  methods:{
    load_config(){
      this.utility_data.logo = this.member_data.config.host_logo
      this.utility_data.disclaimer = this.member_data.config.host_disclaimer
      this.utility_data.date = this.$moment(this.session_data.loa_generated_date).format("MM-DD-YYYY")
      this.utility_data.validTil = this.$moment(this.session_data.loa_expiration_date).format("MM-DD-YYYY")
    },
    splitData(){
      this.session_data.icd_cpt_data.map(items => {
        let icd_code = items.icd_code
        let icd_description = items.icd_description
        this.diagnosis.push({icd_code, icd_description})
        
        items.procedure_list.map(cpts => {
          if(parseFloat(cpts.hmo_cpt_approved_amount)){
            this.procedure.push({"cpt_code" : cpts.cpt_code, "cpt_description" : cpts.cpt_description, "cpt_approved_amount" : cpts.hmo_cpt_approved_amount})
          }
        })
      })
    },
    
    print(){
      this.utility_data.back_to_qr = true
      window.scrollTo(0, 0);
      window.print();
    },

     save(){
      this.utility_data.back_to_qr = true
      this.utility_data.save_loader = true
      let bday = this.$moment(this.member_data.member.mem_birthdate).format("MM-DD-YYYY")
      let filename = this.member_data.member.p_name + ' LOA-OUTPATIENT ' + this.dateToday('MM-DD-YYYY') + '.pdf'

      if (this.member_data.member.mem_hmo_host_code === 'VC') {
        loaPDF.vcPDF(this.member_data.member, this.utility_data, this.session_data, this.$store.state.prv_data.provider_name, bday,'OUTPATIENT', filename, this.diagnosis, this.procedure)
      } else {
        loaPDF.generalPDF(this.member_data.member, this.utility_data, this.session_data, this.$store.state.prv_data.provider_name, bday,'OUTPATIENT', filename, this.eligibility_status)
      }
      this.utility_data.save_loader = false

    },


    dashboard(){
      this.$router.replace('/code-scanning')
    },

  
  },
}
</script>

<style scoped>
.untouchable{
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>

