<template>
  <div> 
    <!-- LOADER -->
    <v-row v-show="loading_category" class="overlay-loader">
      <v-progress-circular color="primary" size="35" indeterminate></v-progress-circular>
      <h4 class="light-blue--text text--darken-4 pl-5">Loading... Please wait...</h4>
    </v-row>
    
    <div v-if="!loading_category">
      <div id="container" class="d-flex d-row justify-md-center py-4">
        <div id="print-pbef">
          <v-card  class="pa-1" width="820" outlined>
            <!-- <embed :src="pbef_data.url" width="100%" height="1142"> -->
            <v-skeleton-loader v-show="pbef_loader" class="mx-auto" max-width="100%" type="image"></v-skeleton-loader>
            <embed v-show="!pbef_loader" :src="pbef_data.url" width="100%" height="1142"/>
            <!-- <v-img id="pbef-header" src="../../assets/pbef-header.png"></v-img> -->
            <!-- <div class="min-width pb-5">
              <v-row class="mt-2" no-gutters>
                  <v-col cols="5">
                      <h3>Date & Time of Generation</h3>
                  </v-col>
                  <v-col cols="1">:</v-col>
                  <v-col cols="6">{{pbef_data.datetime_generation }}</v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="5">
                    <h3>CEWS Tracking Number</h3>
                </v-col>
                <v-col cols="1">:</v-col>
                <v-col cols="6">{{pbef_data.phic_tracking_number}}</v-col>
              </v-row>
              <div class="border my-3"></div>

              <h2 class="header-2">HEALTH CARE INSTITUTION (HCI) INFORMATION</h2>
              <v-row no-gutters>
                <v-col cols="5">
                    <h3>Name of Institution</h3>
                </v-col>
                <v-col cols="1">:</v-col>
                <v-col cols="6">{{pbef_data.hci_info.provider_name }}</v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="5">
                    <h3>Accreditation No.</h3>
                </v-col>
                <v-col cols="1">:
                </v-col>
                <v-col cols="6">{{pbef_data.hci_info.prov_phic_accreditation_number }}</v-col>
              </v-row>
              <div class="border my-3"></div>

              <h2 class="header-2">MEMBER INFORMATION</h2>
              <v-row no-gutters>
                <v-col cols="5">
                    <h3>PhilHealth Identification No.</h3>
                </v-col>
                <v-col cols="1">:
                </v-col>
                <v-col cols="6">{{ pbef_data.member_info.mem_phic_pin }}</v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="5">
                    <h3>Name of Member</h3>
                </v-col>
                <v-col cols="1">:
                </v-col>
                <v-col cols="6">{{ pbef_data.member_info.member_name }}</v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="5">
                    <h3>Sex</h3>
                </v-col>
                <v-col cols="1">:
                </v-col>
                <v-col cols="6">{{ pbef_data.member_info.gender }}</v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="5">
                    <h3>Date of Birth</h3>
                </v-col>
                <v-col cols="1">:
                </v-col>
                <v-col cols="6">{{ pbef_data.member_info.birthday }}</v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="5">
                    <h3>Member Category</h3>
                </v-col>
                <v-col cols="1">:
                </v-col>
                <v-col cols="6">{{ pbef_data.member_info.phic_member_type }}</v-col>
              </v-row>
              <div class="border my-3"></div>

              <h2 class="header-2">PATIENT INFORMATION</h2>
              <v-row no-gutters>
                <v-col cols="5">
                    <h3>Name of Patient</h3>
                </v-col>
                <v-col cols="1">:</v-col>
                <v-col cols="6">{{pbef_data.patient_info.patient_name}}</v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="5">
                    <h3>Date Admitted</h3>
                </v-col>
                <v-col cols="1">:
                </v-col>
                <v-col cols="6">{{pbef_data.patient_info.date_admitted}}</v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="5">
                    <h3>Sex</h3>
                </v-col>
                <v-col cols="1">:
                </v-col>
                <v-col cols="6">{{pbef_data.patient_info.gender}}</v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="5">
                    <h3>Date of Birth</h3>
                </v-col>
                <v-col cols="1">:
                </v-col>
                <v-col cols="6">{{pbef_data.patient_info.birthday}}</v-col>
              </v-row>
              <div class="border my-3"></div>
              
              <h2 class="header-2">ELIGIBILITY INFORMATION</h2>
              <h2 class="header-2 mb-2">ELIGIBILITY TO AVAIL PHILHEALTH BENEFITS? = YES</h2>
              <div class="border mb-1"></div>

              <h4>DOCUMENTS TO BE SUBMITTED TO PHILHEALTH</h4>
              <h4 class="mt-1">Important Reminders:</h4>
              <ol class="mx-1">
                <li>Generation and printing of this form is FREE for all PhilHealth Beneficiaries.</li>
                <li>If the Electronic Claims Submission is not yet implemented, this form shall be submitted along with the required PhilHealth claim forms and is valid only for the confinements/admission stated above.</li>
                <li>This does not included eligibility to the rule of SINGLE PERIOD CONFINEMENT (SPC). It shall be established when the claim is processed by PhilHealth.<br>Non-qualification to the rule of SPC shall result to denial of this claim.</li>
                <li>Corresponds only to the paid claim as of the date and time of generation. PhilHealth Benefit Claims that are in transit or on process are not yet included".</li>
              </ol>
              <div class="border mt-2"></div>
              <br><br>

              <v-row class="min-width text-center" no-gutters>
                <v-col cols="6" class="pr-8">
                    <h4 class="sub-header text-center text-uppercas grey--text text--darken-2 mb-2">SIGNATURE HAS BEEN PROVIDED</h4>
                    <v-img :src="pbef_data.signature" height="50" contain></v-img>
                    <h6 class="sub-header text-center border-bottom mt-2" style="position:relative;z-index:2">{{ pbef_data.patient_info.patient_name }}</h6>
                    <div class="border"></div>
                    <h4>MEMBER/REPRESENTATIVE</h4>
                    <h4>SIGNATURE OVER PRINTED NAME/ THUMBMARK</h4>
                </v-col>
                <v-col cols="6" class="pl-8">
                    <h4 class="sub-header text-center text-uppercas white--text mb-2">SIGNATURE HAS BEEN PROVIDED</h4>
                    <v-img :src="pbef_data.cews_signature ? pbef_data.cews_signature : ''" height="50" contain></v-img>
                    <h6 class="sub-header text-center white-space-normal border-bottom mt-6" style="position:relative;z-index:2">{{ pbef_data.hci_info.cews_name || '' }}</h6>
                    <div class="border"></div>
                    <h4>Module 1 CEWS USER</h4>
                    <h4>SIGNATURE OVER PRINTED NAME/ THUMBMARK</h4>
                </v-col>
              </v-row>
            </div> -->
          </v-card>
        </div>

        <!-- ACTION BUTTONS IF SCREEN IS LARGER THAN 960 -->
        <div class="d-none d-print-none d-md-block text-center">
          <div @click="$router.push('/patient-list')" class="elevation-2 button-style mb-2">
            <v-icon size="30" color="light-grey darken-4">fas fa-folder</v-icon>
            <h6>PATIENT LIST</h6>
          </div>
          <!-- <div @click="print" class="elevation-2 button-style mb-2">
            <v-icon size="30" color="light-grey darken-4">fas fa-print</v-icon>
            <h6>PRINT</h6>
          </div>
          <div @click="savePDF" class="elevation-2 button-style">
            <v-icon size="30" color="light-grey darken-4">fas fa-save</v-icon>
            <h6>SAVE</h6>
          </div> -->
        </div>
      </div>

      <!-- ACTION BUTTONS IF SCREEN IS LESS THAN < 960 -->
      <div class="d-flex d-print-none d-md-none justify-center text-center my-4">
        <div @click="$router.push('/patient-list')" class="elevation-2 px-8 py-5">
          <v-icon size="30" color="light-grey darken-4">fas fa-folder</v-icon>
          <h6>PATIENT LIST</h6>
        </div>
        <div @click="print" class="elevation-2 mx-2 mx-sm-8 px-12 py-5">
          <v-icon size="30" color="light-grey darken-4">fas fa-print</v-icon>
          <h6>PRINT</h6>
        </div>
        <div @click="savePDF" class="elevation-2 px-12 py-5">
          <v-icon size="30" color="light-grey darken-4">fas fa-save</v-icon>
          <h6>SAVE</h6>
        </div>
      </div>
    </div>

    <IdleTimer />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import IdleTimer from './../IdleTimer'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  components: {
    IdleTimer
  },
  
  data(){
    return{
      pbef_params: sessionStorage.getItem('gdo3sGfd') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('gdo3sGfd'), 'ldofdrkd').toString(this.$crypto.enc.Utf8)) : null,
      pbef_loader: false
    }
  },

  created(){
    this.$store.dispatch('getPbefData', {
      // tracking_num_p: this.pbef_params.phic_tracking_number,
      // transaction_num_p: this.pbef_params.transaction_number,
      // ek_lgu_id: this.pbef_params.ek_lgu_id
      data: this.pbef_params
    })
  },

  computed: {
    ...mapState([
      'pbef_data',
      'loading_category'
    ])
  },
  
  methods: {
    // PRINT PBEF
    print(){
      window.scrollTo(0, 0);
      window.print();
    },

    // FOR SAVING AS PDF
    savePDF(){
      html2canvas(document.getElementById('print-pbef')).then(function(canvas) {
          let margin = 12.7; 
          let img_data = canvas.toDataURL('image/png');
          let page_width = 216;
          let page_height = 356;
          let img_width = page_width - 2 * margin; 
          let img_height = canvas.height * img_width / canvas.width; 
          let doc = new jsPDF('p', 'mm', 'legal');
          let height_left = img_height;
          let position = margin; 

          doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
          height_left -= page_height;
          while (height_left > 0) {
              position = height_left - img_height + margin;
              doc.addPage();
              doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
              height_left -= page_height;
          }
          doc.save(`pBef.pdf`);
      });
    }
  }
}
</script>

<style scoped>
.untouchable{
  margin-bottom: 30px;
  overflow-x: auto;
  padding: 0 20px;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.border{
  border: 1px solid black;
}
li{
  font-size: 14px;
  margin: 0px;
  padding-left: 10px;
}
.button-style{
  cursor: pointer;
  padding: 15px;
  width: 110px;
  margin-left: 15px;
}
.theme--light.v-sheet--outlined{
  border: thin solid rgba(0, 0, 0, 0.0);
}
@media print{
  *{
    color-adjust: exact !important;  /*Firefox*/
    -webkit-print-color-adjust: exact !important; /*Chrome, Safari */
  }
  #container{
    position: absolute;
  }
  .elevation-3{
    visibility: hidden;
  }
  #print-pbef{
    visibility: visible;
    margin: -60px 65px 0px;
  } 
  .signature{
    font-size: 14px;
    line-height: 15px;
    margin-top: 60px;
  }
}
</style>