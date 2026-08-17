<template>
  <v-container fluid >
   <v-row justify-md="center">
     <v-col lg="2" md="2" class="hidden-md-and-down d-print-none">
      <div class="d-flex flex-row-reverse">
        <v-btn v-show="utility_data.back_to_qr" @click="dashboard" :loading="utility_data.dashboard_load"  ><v-icon color="light-blue darken-3"  left small>fas fa-arrow-left</v-icon>BACK TO QR PAGE&nbsp;</v-btn>
       </div>
     </v-col>

     <v-col lg="7" md="9" sm="12" cols="12"  order="1">
         <PrintConsultationVC v-if="member_data.member.mem_hmo_host_code === 'VC'"
            :member="member_data.member"
            :utility_data="utility_data"
            :provider_name="$store.state.prv_data.provider_name"
            :session_data="session_data"
            :bday="bday"
       
            />

        <PrintConsultationGen v-else
          :member="member_data.member"
          :utility_data="utility_data"
          :provider_name="$store.state.prv_data.provider_name"
          :session_data="session_data"
          :bday="bday"
          id="loa"
        />
     </v-col>

     <v-col lg="2" md="2" sm="12" cols="12" class="d-print-none" order="2">
        <!-- ACTION BUTTONS IF SCREEN IS LESS THAN < 1200 -->
        <v-layout wrap >
            <v-col v-show="utility_data.back_to_qr" lg="12"  class="hidden-lg-and-up  text-center text-lg-left">
              <v-btn @click="dashboard" :loading="utility_data.dashboard_load"  large class="py-10 white mb-lg-5" >
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
              <v-btn @click="savePDF" :loading="utility_data.load_save" large class="py-10  white" >
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
import PrintConsultationGen from '@/components/e-benefit/Consultation/PrintConsultationGen.vue'
import PrintConsultationVC from '@/components/e-benefit/Consultation/PrintConsultationVC.vue'
import IdleTimer from '@/components/IdleTimer.vue'


export default {
  components: {
    PrintConsultationGen,
    PrintConsultationVC,
    IdleTimer
  },
  data() {
    return {
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

  created() {
    this.session_data = sessionStorage.getItem('JM9SO0Y1YV') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('JM9SO0Y1YV'),'hEsi2Q2qY9t1').toString(this.$crypto.enc.Utf8)) : []
  },

  mounted() {
    this.load_config();
  },

  computed:{
    ...mapState(["member_data"]),
  
    bday(){
      return this.$moment(this.member_data.member.mem_birthdate, 'YYYY-MM-DD').format('MM/DD/YYYY');
    },
  },

  methods:{
    load_config(){
      this.utility_data.logo = this.member_data.config.host_logo
      this.utility_data.disclaimer = this.member_data.config.host_disclaimer
      this.utility_data.date = this.$moment(this.session_data.loa_generated_date).format("MM/DD/YYYY")
      this.utility_data.validTil = this.$moment(this.session_data.loa_expiration_date).format("MM/DD/YYYY")
      this.utility_data.logo_loader = false
    },

    dashboard(){
      this.utility_data.dashboard_load = true
      sessionStorage.clear()
      this.$router.replace('/code-scanning')
    },

    // FOR PRINTING
    print(){
      this.utility_data.back_to_qr = true
      window.scrollTo(0, 0);
      window.print();
    },

    savePDF() {
      this.utility_data.load_save = true
      this.utility_data.back_to_qr = true

      if (this.member_data.member.mem_hmo_host_code === 'VC') {
        loaPDF.vcPDF(this.member_data.member, this.utility_data, this.session_data, this.$store.state.prv_data.provider_name, this.bday,'CONSULTATION', 'loa-consultation.pdf')
      } else {
        loaPDF.generalPDF(this.member_data.member, this.utility_data, this.session_data, this.$store.state.prv_data.provider_name, this.bday,'CONSULTATION', 'loa-consultation.pdf')
      }
     
      this.utility_data.load_save = false
    },
  }

}
</script>


