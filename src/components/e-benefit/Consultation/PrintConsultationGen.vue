<template>
  <v-flex elevation-3 pa-3 pa-sm-12>
    <div id="content">
      <center>
        <img v-if="utility_data.logo" :src="utility_data.logo" class="logo" id="logo"/>
      </center> 

   
      <h2 class="text-center mb-2 font-title"> {{$route.fullPath === '/print-eLOA' ? 'e-CONSULTATION FORM' : 'Letter of Authorization (Consultation)'}}</h2>
      <v-layout wrap class="pr-sm-4">
        <v-flex class="font-data" sm10 xs9 mb-3>
            <span><b>Healthcare Facility: </b>{{ provider_name}}</span><br>
            <span><b>Date: </b>{{utility_data.date}}</span><br>
            <span><b>Transaction: </b>CONSULTATION</span><br>
            <span><b>Valid Until: </b>{{ utility_data.validTil }}</span>
        </v-flex>
        <v-flex sm2 xs3 mb-3>
          <v-img v-if="member.mem_photo" :src="member.mem_photo" id="member_image" class="ml-auto mem_image" contain></v-img>
          <v-img v-else src="@/assets/no-image.jpg" class="float-right mem_image"  contain></v-img>
        </v-flex>

        <v-flex class="font-data" sm8 xs7>
          <h3 class="information ">PERSONAL INFORMATION</h3>
          <span><b>Membership Type: </b>{{ member.mem_hmo_type }}</span><br>
          <span><b>Card Number: </b>{{ member.mem_hmo_policy_number ? member.mem_hmo_policy_number : 'N/A' }}</span><br>
          <span><b>Patient Name: </b>{{ member.p_name }}</span><br>
        </v-flex>
        <v-flex class="font-data" sm4 xs5 mt-4>
          <span><b>Gender: </b><span v-if="member.mem_gender == 'F'">FEMALE</span><span v-if="member.mem_gender == 'M'">MALE</span></span><br>
            <span><b>Member Status: </b> {{ member.mem_hmo_status }}</span><br>
            <span><b>Date of Birth: </b> {{ bday }}</span><br> 
        </v-flex>
      </v-layout>

      <v-layout class="pr-sm-4" justify-end mt-4>               
          <h4 class="light-blue--text text--darken-4 text-uppercase font-data" align="right"><span >APPROVAL CODE:</span> {{session_data.approval_code }}</h4>
      </v-layout>

      <v-flex xs12 class="pr-sm-4">
        <!-- FOR DOCTORS -->
        <table  id="doctor" class="table" cellspacing="0">
          <tr>
            <th  class="header light-blue darken-4 white--text" colspan="3">DOCTORS</th>
          </tr>
          <tr>
            <th>Doctor Code</th>
            <th >Doctor Name</th>
            <th >Accreditation</th>
          </tr>
          <tr>
            <td >{{session_data.doctor_code}}</td>
            <td >{{session_data.doctor_name}}</td>
            <td >Accredited</td>
          </tr>
          <tr><th  class="header light-blue darken-4 white--text" colspan="3">CHIEF COMPLAINT</th></tr>
          <tr><td  colspan="3">{{session_data.chief_complaint}}</td></tr>
        </table>
        <!-- ICD/CPT -->
        <table v-for="(icds,i) in session_data.icd_cpt_data" :key="i" class="table" id="diagnosis_procedure0" cellspacing="0" > 
          <tr >
            <th v-if="i === 0"  class="light-blue darken-4 white--text" colspan="3">PRIMARY DIAGNOSIS</th>
            <th v-else-if="i === 1"  class="light-blue darken-4 white--text" colspan="3">SECONDARY DIAGNOSIS</th>
            <th v-else  class="light-blue darken-4 white--text" colspan="3">OTHERS DIAGNOSIS</th>
          </tr> 
          <tr>
            <td class="width-5">{{icds.icd_code}}</td>
            <td>{{icds.icd_description}}</td>
            <td class="width-5">Covered</td>
          </tr>
          <tr><th  colspan="4">PROCEDURES</th></tr>
          <tr v-for="(cpts,x) in icds.procedure_list" :key="x" >
            <td class="width-5">{{cpts.cpt_code}}</td>
            <td>{{cpts.cpt_description}}</td>      
            <td class="width-5">{{cpts.hmo_cpt_status}}</td>
          </tr>
        </table>   
        <!-- CC NOTES -->
        <table v-if="!session_data.hmo_cc_notes == false" class="table" id="cc_notes" cellspacing="0">
          <tr><th class="light-blue darken-4 white--text" colspan="4">HEALTH CARE INSURANCE NOTES</th></tr>
          <tr><td colspan="4">{{session_data.hmo_cc_notes}}</td></tr>
        </table>
      </v-flex>

      <v-flex class="statement mt-3 pr-sm-4" xl12 >
        <p class="text-justify font-weight-medium disclaimer" style="white-space:pre-line">{{utility_data.disclaimer}}</p>
      </v-flex>

      <v-layout class="mt-3 mt-sm-5 justify-space mb-5 pr-sm-4">
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
  props:["member","provider_name","session_data","utility_data","bday"],
  
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

.font-title{
  font-size:11pt
}

.signature{
  border-top: 1px solid black;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  th{font-size:5.5pt}
  td, .signature{font-size:5pt}
  .font-title {font-size:8pt}
  .information{font-size:7.5pt}
  .width-5{width:15% }
  .mem_image{max-width: 45px;}
  .logo {max-width: 110px;}
  .font-data{font-size:6pt}
  .disclaimer{font-size:4.5pt}
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .font-title {font-size:10pt}
  .width-5 {width:13% }
  .width-10{width:16% } 
  .mem_image {max-width: 70px;}
  .logo {max-width: 150px;}
  .font-data, .disclaimer, .signature{font-size:8pt}

}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .font-title {font-size:12pt}
  .information {font-size:9pt}
  .width-5 {width:10% }
  .width-10{width:15% } 
  .mem_image { max-width: 80px }
  .logo {max-width: 180px;}
  .font-data, .signature {font-size:10pt}
  
}


@media print{
  #content{
    visibility: visible;
    margin:5px 40px;
  }
  .elevation-3{
    margin-top: 0px !important;
    padding: 0 !important;
    visibility: hidden;
  }
  .font-title{
    font-size:11pt
  }
  .font-data , .signature{
    font-size:9pt
  }
  td,th{
    font-size:8.5pt
  }
  .mem_image { max-width: 80px }
  .disclaimer{font-size:8pt}
  .statement{margin-bottom:2em}
  .logo {max-width: 180px}
  @page{
    margin: 0;
  }
}
</style>