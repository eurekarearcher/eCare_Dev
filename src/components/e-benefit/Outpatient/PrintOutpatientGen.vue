<template>
  <v-flex elevation-3 pa-3 pa-sm-12>
    <div id="content">
      <v-layout>
        <v-img v-if="session_data.process_type.includes('LGU') && utility_data.logo" :src="utility_data.logo" alt="LGU LOGO"  class="lgu_logo" id="lgu_logo" contain></v-img>
        <!-- <v-img v-if="session_data.process_type.includes('HMO') && utility_data.logo" :src="utility_data.logo" alt="HMO LOGO" class="logo" id="hmo_logo" contain></v-img> -->
        <v-img v-if="session_data.process_type !== 'HMO'" src="@/assets/PHIC_logo.png" :class="{'ml-auto':session_data.process_type.includes('LGU') || session_data.process_type === 'HMO_PHIC'}"  class="logo" contain></v-img>
      </v-layout>
     
      <h2 v-if="session_data.process_type !== 'HMO_PHIC' && session_data.process_type !== 'PHIC'" class="text-center mb-2 font-title">LETTER OF GUARANTEE</h2>
      <h2 v-else class="text-center mb-2 font-title">BENEFIT ELIGIBILITY FORM</h2>

     
      <v-layout wrap class="pr-sm-4">
        <v-flex class="font-data" sm10 xs9 mb-3>
            <span><b>Healthcare Facility: </b>{{ provider_name}}</span><br>
            <span><b>Date: </b>{{utility_data.date}}</span><br>
            <span><b>Transaction: </b>OUTPATIENT</span><br>
            <span><b>Valid Until: </b>{{ utility_data.validTil }}</span>
        </v-flex>
        <v-flex sm2 xs3 mb-3>
          <v-img v-if="member_data.member.mem_photo" :src="member_data.member.mem_photo" id="member_image" class="ml-auto mem_image" contain></v-img>
          <v-img v-else src="@/assets/no-image.jpg" class="float-right mem_image"  contain></v-img>
        </v-flex>

        <v-flex class="font-data" sm8 xs7>
          <h3 class="information">PERSONAL INFORMATION</h3>
          <span><b>Membership Type: </b>{{ member_data.member.mem_hmo_type }}</span><br>
          <span><b>Card Number: </b>{{ member_data.member.mem_hmo_policy_number  ? member_data.member.mem_hmo_policy_number : member_data.member.mem_phic_pin  }}</span><br>
          <span><b>Patient Name: </b>{{ member_data.member.p_name.toUpperCase()}}</span><br>
        </v-flex>
        <v-flex class="font-data" sm4 xs5 mt-4>
          <span><b>Gender: </b><span v-if="member_data.member.mem_gender.charAt(0) == 'F'">FEMALE</span><span v-if="member_data.member.mem_gender.charAt(0) == 'M'">MALE</span></span><br>
          <span><b>Member Status: </b> {{ member_data.member.mem_hmo_status ? member_data.member.mem_hmo_status : eligibility_status }}</span><br>
          <span><b>Date of Birth: </b> {{ member_data.member.mem_birthdate ?  $moment(member_data.member.mem_birthdate).format('MM-DD-YYYY') :  member_data.member.mem_birthdate}}</span><br>
        </v-flex>
      </v-layout>

      <v-layout class="pr-sm-4" justify-end mt-2 mt-sm-4>          
        <h3 v-if="session_data.process_type !== 'PHIC' && session_data.process_type !== 'LGU' && session_data.process_type !== 'PHIC_LGU'" class="light-blue--text text--darken-4 text-uppercase font-data " align="right"><span >APPROVAL CODE:</span> {{session_data.approval_code }}</h3>
        <h3 v-else class="light-blue--text text--darken-4 text-uppercase font-data" align="right"><span >TRACKING NUMBER:</span> {{member_data.member.phic_tracking_num ? member_data.member.phic_tracking_num  : 'N/A' }}</h3>
      </v-layout>

      <v-flex xs12 class="pr-sm-4">
        <table class="table" cellspacing="0" id="doctor">
          <tr>
            <th class="header light-blue darken-4 white--text" colspan="3">DOCTORS</th>
          </tr>
          <tr>
            <th>Doctor Code</th>
            <th>Doctor Name</th>
            <th>Accreditation</th>
          </tr>
          <tr>
            <td>{{session_data.doctor_data.doctor_code ? session_data.doctor_data.doctor_code : 'N/A'}}</td>
            <td>{{session_data.doctor_data.doctor_name}}</td>
            <td>Accredited</td>
          </tr>
        </table>

        <table v-for="(icds,i) in session_data.icd_cpt_data" :key="i" class="table" cellspacing="0" :id="'diagnosis_procedure'+i" >
          
          <template v-if="session_data.process_type === 'HMO_PHIC' || session_data.process_type === 'HMO_LGU' || session_data.process_type === 'HMO_PHIC_LGU'">
            <tr>
              <th 
                :colspan="icds.procedure_list.length > 0 && 
                icds.procedure_list.some(item => item.phic_cpt_status !== 'NOT COVERED' || item.hmo_cpt_status !== 'DISAPPROVED') ? 6 : 3"
                class="light-blue darken-4 white--text" >
                <span v-if="i=== 0">PRIMARY DIAGNOSIS</span>
                <span v-else-if="i=== 1">SECONDARY DIAGNOSIS</span>
                <span v-else>OTHER DIAGNOSIS</span>
              </th>
            </tr>
            
            <tr>
              <td :colspan="icds.procedure_list.length > 0 && icds.procedure_list.some(item => item.phic_cpt_status !== 'NOT COVERED' || item.hmo_cpt_status !== 'DISAPPROVED') ? 1 : 1">
                {{icds.icd_code}}
              </td>
              <td :colspan="icds.procedure_list.length > 0 && icds.procedure_list.some(item => item.phic_cpt_status !== 'NOT COVERED' || item.hmo_cpt_status !== 'DISAPPROVED') ? 4 : 1"> 
                {{icds.icd_description}}
              </td>
              <td :colspan="icds.procedure_list.length > 0 && icds.procedure_list.some(item => item.phic_cpt_status !== 'NOT COVERED' || item.hmo_cpt_status !== 'DISAPPROVED') ? 1 : 1">
                COVERED
              </td>
            </tr>

            <tr v-if=" icds.procedure_list.length > 0 && icds.procedure_list.some(item => item.phic_cpt_status !== 'NOT COVERED' || item.hmo_cpt_status !== 'DISAPPROVED')" >
              
              <th colspan="2">PROCEDURES</th>
              <th class="width-sm">PHIC COVERAGE</th>
              <th class="width-xs">AMOUNT</th>
              <th class="width-sm">HMO COVERAGE</th>
              <th class="width-xs">AMOUNT</th>
            </tr>

            <tr v-for="(cpts,x) in icds.procedure_list" :key="x">
  
              <template  v-if=" cpts.hmo_cpt_status !== 'DISAPPROVED' || cpts.phic_cpt_status !== 'NOT COVERED'" >
                <td class="width-sm">{{cpts.cpt_code}}</td>
                <td>{{cpts.cpt_description}}</td>
                <td class="width-sm">
                  <span>{{cpts.phic_cpt_status === 'NOT COVERED' ? 'NOT APPLICABLE' : cpts.phic_cpt_status}}</span>
                </td>
                 <td class="width-xs">
                  <span>{{cpts.rvs_code ? (parseFloat(cpts.cpt_amount) > parseFloat(cpts.rvs_case_rate) ? cpts.rvs_case_rate : cpts.cpt_amount) : '0'}}</span>
                </td>
                <td class="width-sm">
                  <span>{{cpts.hmo_cpt_status === 'NOT COVERED' ? 'NOT APPLICABLE' : cpts.hmo_cpt_status}}</span>
                </td>
                <td class="width-xs">
                  <span>{{cpts.hmo_cpt_approved_amount}}</span>
                </td>
              </template>
            </tr>
          </template>
          
          <template v-else>
            <tr v-if="icds.procedure_list.some(item => item.hmo_cpt_status !== 'NOT COVERED' && item.hmo_cpt_status !== 'DISAPPROVED' && item.phic_cpt_status !== 'NOT COVERED')" >
              <th v-if="i === 0" class="light-blue darken-4 white--text" colspan="4">PRIMARY DIAGNOSIS</th>
              <th v-else-if="i === 1" class="light-blue darken-4 white--text" colspan="4">SECONDARY DIAGNOSIS</th>
              <th v-else class="light-blue darken-4 white--text" colspan="4">OTHER DIAGNOSIS</th>
            </tr>

            <tr v-else > <!-- FOR SAVING PDF CHANGE COLSPAN-->
              <th v-if="i === 0" class="light-blue darken-4 white--text" colspan="3">PRIMARY DIAGNOSIS</th>
              <th v-else-if="i === 1" class="light-blue darken-4 white--text" colspan="3">SECONDARY DIAGNOSIS</th>
              <th v-else class="light-blue darken-4 white--text" colspan="3">OTHER DIAGNOSIS</th>
            </tr>

            <tr >
              <td class="width-sm">{{icds.icd_code}}</td>
              <td>{{icds.icd_description}}</td>
              <td class="width-sm" :colspan="icds.procedure_list.some(item => item.hmo_cpt_status !== 'NOT COVERED' && item.hmo_cpt_status !== 'DISAPPROVED' && item.phic_cpt_status !== 'NOT COVERED') ? 4 : 0">COVERED</td>
            </tr>
              
            <tr v-if="icds.procedure_list.some(item => item.hmo_cpt_status !== 'NOT COVERED' && item.hmo_cpt_status !== 'DISAPPROVED' && item.phic_cpt_status !== 'NOT COVERED')">
              <td colspan="4">PROCEDURES</td>
            </tr>
            <tr v-for="(cpts,x) in icds.procedure_list" :key="x">
              <template v-if="session_data.process_type === 'PHIC' || session_data.process_type === 'LGU'  || session_data.process_type === 'PHIC_LGU'  ">
                <template v-if="cpts.phic_cpt_status !== 'NOT COVERED'">
                  <td class="width-sm">{{cpts.cpt_code}}</td>
                  <td>{{cpts.cpt_description}}</td>
                  <td class="width-sm">
                    {{Number(cpts.phic_cpt_status === 'COVERED' ? cpts.cpt_amount : cpts.rvs_case_rate).toLocaleString("en",{ minimumFractionDigits: 2})}}
                  </td> 
                  <td class="width-sm">{{cpts.phic_cpt_status}}</td>
                </template>
              </template>
              <template v-else>
                <template v-if="parseFloat(cpts.hmo_cpt_approved_amount) !== 0">
                  <td class="width-sm">{{cpts.cpt_code}}</td>
                  <td>{{cpts.cpt_description}}</td>
                  <td class="width-sm">{{Number(cpts.hmo_cpt_approved_amount).toLocaleString("en",{ minimumFractionDigits: 2})}}</td>         
                  <td class="width-sm">{{cpts.hmo_cpt_status}}</td>
                </template>
              </template>
            </tr>
          </template>
        </table>

        <table v-if="session_data.doctor_notes !== ''" class="table" cellspacing="0" id="doctor_notes">
          <tr><th class="light-blue darken-4 white--text" colspan="4">DOCTOR NOTES</th></tr>
          <tr><td colspan="4">{{session_data.doctor_notes}}</td></tr>
        </table>

        <table v-if="!session_data.icd_cpt_data[0].hmo_cc_notes == false" class="table" cellspacing="0" id="cc_notes">
          <tr><th class="light-blue darken-4 white--text" colspan="4">HEALTH CARE INSURANCE NOTES</th></tr>
          <tr><td colspan="4">{{session_data.icd_cpt_data[0].hmo_cc_notes}}</td></tr>
        </table>
      </v-flex>

      <v-flex xs12 xl12 sm12 mt-3>
        <p v-if="utility_data.disclaimer" class="text-justify disclaimer" style="white-space:pre-line">{{utility_data.disclaimer}}</p>
      </v-flex>

      <v-layout class="mt-3 mt-sm-8 justify-space mb-5 pr-sm-4" ma-0 >
        <v-flex xl6 mt-5>
          <b class="signature my-3">CARD MEMBER SIGNATURE</b>     
        </v-flex>
        <v-flex xl6 mt-5 text-right>
          <b class="signature my-3">PROVIDER REPRESENTATIVE SIGNATURE</b>
        </v-flex>
      </v-layout>
    </div>
  </v-flex>
</template>

<script>
export default {
  props:["member_data","provider_name","session_data","utility_data","bday","eligibility_status","resize_data"],
}
</script>

<style scoped>
.table{
  text-align: center;
  width: 100%;
}
td, th{
  border:1px solid grey;
}
th{
  padding: 2px;
  font-size:9pt;
}
td{
  font-size:8pt
}

.signature{
  border-top: 1px solid black;
}

.width-lg{
  line-height: 1;
}
.cont {
  object-fit: contain !important;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  th{font-size:5.5pt}
  td, .signature{font-size:5pt}
  .font-title {font-size:8pt}
  .information{font-size:7.5pt}
  .width-sm{width:15% }
  .mem_image{max-width: 45px;}
  .logo {max-width: 110px;}
  .lgu_logo {max-width: 70px;}

  .font-data, .disclaimer{font-size:6pt}
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .font-title {font-size:10pt}
  .width-xs {width:7%}
  .width-sm {width:10% }
  .width-lg {width:16% } 
  .mem_image {max-width: 70px;}
  .logo {max-width: 120px;}
  .lgu_logo {max-width: 80px;}
  .font-data, .disclaimer, .signature{font-size:8pt}
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .font-title {font-size:12pt}
  .information {font-size:9pt}
  .width-xs {width:5%}
  .width-sm {width:10% }
  .width-lg{width:15% } 
  .mem_image { max-width: 80px }
  .logo {max-width: 140px;}
  .lgu_logo {max-width: 100px;}
  .font-data, .disclaimer, .signature {font-size:10pt}
}

@media print{
  #content{
    visibility: visible;
    margin:5px 40px;
    padding: 0 20px
  }
  .elevation-3{
    margin-top: 0px !important;
    padding: 0 !important;
    visibility: hidden;
  }
  .font-title{
    font-size:16pt
  }
  .font-data{
    font-size:12pt
  }
  td,th{
    font-size:8.5pt
  }
  .width-xs {
    width: 7% !important;
  }
  .width-sm{
    width:11% !important;
  }
  .width-lg {
    width:16%
  }
  .mem_image { max-width: 80px }
  .logo {max-width: 180px}
  .lgu_logo {max-width: 100px;}

  @page{
    margin: 0;
  }
}
</style>
