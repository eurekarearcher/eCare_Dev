<template>
    <div id="print-pbef">
      <!-- <embed :src="pbef_data.url" width="100%" height="1142" /> -->
      <v-card flat>
        <!-- <v-card-text >PBEF</v-card-text> -->

        <v-skeleton-loader v-show="pbef_loader" class="mx-auto" max-width="1200px" type="image"></v-skeleton-loader>

        <embed v-show="!pbef_loader" :src="pbef_data.url" width="1200px" height="600px"/>
      </v-card>

      <!-- <v-img id="pbef-header" src="@/assets/pbef-header.png" lazy-src="@/assets/pbef-header.png" min-width="1000px"></v-img>
      <div class="min-width pb-5">
          <v-row class="mt-2" wrap>
              <v-col cols="5">
                  <h3>Date & Time of Generation</h3>
              </v-col>
              <v-col cols="1">:</v-col>
              <v-col cols="6">{{pbef_data.datetime_generation }}</v-col>
          </v-row>

          <v-row wrap>
            <v-col cols="5">
                <h3>CEWS Tracking Number</h3>
            </v-col>
            <v-col cols="1">:</v-col>
            <v-col cols="6">{{pbef_data.phic_tracking_number}}</v-col>
          </v-row>
          <div class="border my-3"></div>

          <h2 class="header-2">HEALTH CARE INSTITUTION (HCI) INFORMATION</h2>
          <v-row wrap>
            <v-col cols="5">
                <h3>Name of Institution</h3>
            </v-col>
            <v-col cols="1">:</v-col>
            <v-col cols="6">{{pbef_data.hci_info.provider_name }}</v-col>
          </v-row>

          <v-row wrap>
            <v-col cols="5">
                <h3>Accreditation No.</h3>
            </v-col>
            <v-col cols="1">:
            </v-col>
            <v-col cols="6">{{pbef_data.hci_info.prov_phic_accreditation_number }}</v-col>
          </v-row>
          <div class="border my-3"></div>

          <h2 class="header-2">MEMBER INFORMATION</h2>
          <v-row wrap>
            <v-col cols="5">
                <h3>PhilHealth Identification No.</h3>
            </v-col>
            <v-col cols="1">:
            </v-col>
            <v-col cols="6">{{ pbef_data.member_info.mem_phic_pin }}</v-col>
          </v-row>

          <v-row wrap>
            <v-col cols="5">
                <h3>Name of Member</h3>
            </v-col>
            <v-col cols="1">:
            </v-col>
            <v-col cols="6">{{ pbef_data.member_info.member_name }}</v-col>
          </v-row>

          <v-row wrap>
            <v-col cols="5">
                <h3>Sex</h3>
            </v-col>
            <v-col cols="1">:
            </v-col>
            <v-col cols="6">{{ pbef_data.member_info.gender }}</v-col>
          </v-row>

          <v-row wrap>
            <v-col cols="5">
                <h3>Date of Birth</h3>
            </v-col>
            <v-col cols="1">:
            </v-col>
            <v-col cols="6">{{ pbef_data.member_info.birthday }}</v-col>
          </v-row>

          <v-row wrap>
            <v-col cols="5">
                <h3>Member Category</h3>
            </v-col>
            <v-col cols="1">:
            </v-col>
            <v-col cols="6">{{ pbef_data.member_info.phic_member_type }}</v-col>
          </v-row>
          <div class="border my-3"></div>

          <h2 class="header-2">PATIENT INFORMATION</h2>
          <v-row wrap>
            <v-col cols="5">
                <h3>Name of Patient</h3>
            </v-col>
            <v-col cols="1">:</v-col>
            <v-col cols="6">{{pbef_data.patient_info.patient_name}}</v-col>
          </v-row>

          <v-row wrap>
            <v-col cols="5">
                <h3>Date Admitted</h3>
            </v-col>
            <v-col cols="1">:
            </v-col>
            <v-col cols="6">{{pbef_data.patient_info.date_admitted}}</v-col>
          </v-row>

          <v-row wrap>
            <v-col cols="5">
                <h3>Sex</h3>
            </v-col>
            <v-col cols="1">:
            </v-col>
            <v-col cols="6">{{pbef_data.patient_info.gender}}</v-col>
          </v-row>

          <v-row wrap>
            <v-col cols="5">
                <h3>Date of Birth</h3>
            </v-col>
            <v-col cols="1">:
            </v-col>
            <v-col cols="6">{{pbef_data.patient_info.birthday}}</v-col>
          </v-row>
          <div class="border my-3"></div>
          
          <h2 class="header-2">ELIGIBILITY INFORMATION</h2>
          <h2 class="header-2 mb-8">ELIGIBILITY TO AVAIL PHILHEALTH BENEFITS? = YES</h2>
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

          <v-row class="min-width text-center" wrap>
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
    </div>
</template>

<script>
export default {
  props: ['pbef_data'],

  data() {
    return {
      pbef_loader: false,
    }
  },
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
.min-width{
  min-width: 1000px;
}
.border{
  border: 1px solid black;
}
li{
  font-size: 14px;
  margin: 0px;
  padding-left: 10px;
}
@media print{
  *{
    color-adjust: exact !important;  /*Firefox*/
    -webkit-print-color-adjust: exact !important; /*Chrome, Safari */
  }
  /* @page { 
    margin: 0; 
  } */
  #pbef-header, .min-width{
    max-width: 795px !important;
    min-width: 0px !important;
  }
  .header-2{
    margin-bottom: 0;
  }
  .print-pbef{
    background-color: white;
    font-size: 14px;
    height: 100%;
    left: 0;
    line-height: 18px;
    padding-top: 20px;
    padding-left: 15px;
    position: fixed;
    top: 0;
  }
}
</style>