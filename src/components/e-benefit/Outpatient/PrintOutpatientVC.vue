<template>
  <v-flex elevation-3 pa-3 pa-sm-12>
    <div id="content">
      <v-layout wrap mt-2 >
        <v-flex sm7 xs7 class="address-header">
          <img v-if="utility_data.logo" :src="utility_data.logo" class="mb-2  logo" id="logo"/>
          <h6>33 Meralco Ave., Brgy. San Antonio, Pasig City</h6>
          <h6>Trunk lines: (02) 7023310 (Medical Services): (02) 702-3388 (Other Departments)</h6>
          <h6>24 Hour Hotlines: 0917-7-WE CARE; (02) 687-3219; 0917-8862892</h6>
          <h6>Fax Nos.: (02) 637-9456 E-mail: wecare@valuecarehealth.com</h6>
          <h6>Medical Fax No.: (02) 637-9453</h6>
        </v-flex>
        <v-flex sm5 xs5 align-self-end class="address-header">
          <h6 class="form-note">This form must be <b>legibly and completely</b> filled out, signed by applicable parties, and returned to ValuCare within 30 days.Use generally accepted abbreviations only. <b>Valid for 7 days only or until membership expiry, whichever comes first.</b></h6>
        </v-flex>
        <v-layout wrap justify-center text-center mt-1>
          <v-flex xs2></v-flex>
          <v-flex xs8 text-center><h3 class="loa-title">LETTER OF AUTHORIZATION<br/>Out Patient - PROCEDURE</h3></v-flex>
      
          <v-flex xs2 class="address-header" align-self-center><h2 class="border" >HMO</h2></v-flex>
        </v-layout>
      </v-layout>
      <v-layout wrap class="height">
        <v-flex xs2  ><label class="font-data">Hospital:</label></v-flex>
        <v-flex xs7  align-self-baseline><h5 class="font-data">{{provider_name}}</h5></v-flex>
        <v-flex xs1  text-right pr-2 align-self-baseline><label class="font-data">Date:</label></v-flex>
        <v-flex xs2  align-self-baseline><h5 class="font-data">{{utility_data.date}}</h5></v-flex>
      </v-layout>

      <v-layout wrap class="height" mt-n2 mt-sm-0>
        <v-flex xs2  ><label class="font-data">Patient Name:</label></v-flex>
        <v-flex xs4  align-self-baseline><h5 class="font-data">{{member_data.member.p_name}}</h5></v-flex>
        <v-flex xs1  text-right pr-1><label class="font-data">Birthday:</label></v-flex>
        <v-flex xs2  align-self-baseline><h5 class="font-data">{{  member_data.member.mem_birthdate ?  $moment(member_data.member.mem_birthdate).format('MM-DD-YYYY') :  member_data.member.mem_birthdate }}</h5></v-flex>
        <v-flex xs1  text-right pr-2 align-self-baseline><label class="font-data">Gender:</label></v-flex>
        <v-flex xs2  pl-1 align-self-end >
          <v-layout wrap>
            <v-layout wrap align-center>
              <input :checked="member_data.member.mem_gender === 'M'" type="radio" disabled placeholder="Male" />
              <label class="radio-label">Male</label>
            </v-layout>
        
            <v-layout wrap  align-center>
              <input :checked="member_data.member.mem_gender === 'F'" type="radio" disabled  placeholder="Female"/> 
              <label class="radio-label">Female</label>
            </v-layout>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout wrap class="height" mt-n2 mt-sm-0>
        <v-flex xs2 align-self-center><label class="font-data">VALUCARD ID NO.:</label></v-flex>
        <v-flex xs2 align-self-center ><h5 class="font-data">{{member_data.member.mem_hmo_policy_number}} </h5></v-flex>
        <v-flex xs2 text-right pr-2><label class="font-data">Company Name:</label></v-flex>
        <v-flex xs3 align-self-center ><h5 class="font-data">{{member_data.member.mem_company_name ? member_data.member.mem_company_name : 'N/A'}}</h5></v-flex>
        <v-flex xs2 text-right pr-2><label class="font-data">Expiry Date:</label></v-flex>
        <v-flex xs1 align-self-center ><h5 class="font-data">{{member_data.member.mem_hmo_expiry_date ? member_data.member.mem_hmo_expiry_date : 'N/A'}}</h5></v-flex>
      </v-layout>

      <v-layout wrap class="height" mt-n2 mt-sm-0 >
        <v-flex xs2><label class="font-data">Approval No.:</label></v-flex>
        <v-flex xs4 align-self-center><h5 class="font-data">{{ session_data.approval_code }}</h5></v-flex>
        <v-flex xs3 text-right pr-2><label class="font-data">Maximum Coverage Benefit:</label></v-flex>
        <v-flex xs3 align-self-center><h5 class="font-data"><br/></h5></v-flex>
      </v-layout>

      <v-layout wrap align-center >
        <v-flex xs2  class="mt-n3 mt-sm-0"><label class="font-data">Diagnosis:</label></v-flex>
        <v-flex xs10 >
          <v-layout wrap v-for="(icds,i) in diagnosis" :key="i" class="mt-n3 mt-sm-0">
            <v-flex xs8 align-self-center><h5 class="small-text">{{icds.icd_description}}</h5></v-flex>
            <v-flex xs2 text-right px-2> <label class="font-data">ICD CODE</label></v-flex>
            <v-flex xs2 align-self-center ><h5 class="small-text">{{icds.icd_code}}</h5></v-flex>
          </v-layout>
        </v-flex>
      </v-layout>


      <v-layout wrap align-center>
        <v-flex xs3 class="line-height mt-n3 mt-sm-0"><label class="small-text">Complete Surgical Procedure to be done as stated in the Operative Record:</label></v-flex>
        <v-flex xs9>
          <v-layout  v-for="(cpts,i) in procedure" :key="i" wrap align-center class="mt-n3 mt-sm-0">
            <template v-if="cpts.hmo_cpt_status !== 'DISAPPROVED'">
                <v-flex class="widthCPT px-2">
                  <h5 class="font-data">{{cpts.cpt_description}}</h5>
                </v-flex>
                <v-flex text-center><label class="font-data">CPT CODE:</label></v-flex>
                <v-flex class="widthCPTCode">
                   <h5 class="font-data">{{cpts.cpt_code}}</h5>
                </v-flex>
                <v-flex text-center><label class="font-data">RUV</label></v-flex>
                <v-flex class="widthCPTCode text-center" >
                  <h5 class="font-data">{{Number(cpts.cpt_approved_amount).toLocaleString()}}</h5>
                </v-flex>

            </template>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout wrap class="height" mt-2>
        <v-flex xs3 class="line-height"><label class="small-text">Specialist's Full Name / Specialization:</label></v-flex>
        <v-flex xs9 align-self-center ><h5 class="font-data">{{session_data.doctor_data.doctor_name}} / {{session_data.doctor_data.specialization}}</h5></v-flex>
      </v-layout>

      <v-layout wrap mt-1 mt-sm-2>
        <v-flex xs2 ><label class="font-data">Anesthesiologist:</label></v-flex>
        <v-flex xs10  align-self-center ><h5><br/></h5></v-flex>
        <label  class="paragraph">Note: Please do not forget to file your PHILHEALTH. Failure to do so will authorize the Hospital and ValuCare to collect equivalent amount of Philhealth</label>
      </v-layout>

      <v-flex xs12 lg12 xl12 mt-1 mt-sm-2>
        <span class="font-weight-bold paragraph mb-0" >Member Statement:</span>
        <p class="paragraph">I hereby authorize ValuCare and its representative to have access on all my Medical / Hospital records. I promise to pay for medical, surgical, hospital and preofessional services
        expenses not explicitly covered by the provisions of Health Care Service Agreement. I fully understand that in instances wherein these non-coverable charge/s (i.e. excess in
        limits, exclusions, Philhealth etc.) were not settled upon availment/discharge, it will be billed to me as collectible and will be charged administrative fees as applicable.
        I hereby attest that i have fully understood all that is written in this LOA.</p>
      </v-flex>

       <v-layout wrap justify-space-around mt-12>
            <v-flex  xs4 text-center>
                <h6 class="font-data" style="border-top:1px solid black">Signature of Member / Relative / Mobile No.</h6>
            </v-flex>
            <v-flex  xs4 text-center>
                <h6 class="font-data" style="border-top:1px solid black">ValuCare Authorized Representative</h6>
            </v-flex>
        </v-layout>
    </div>
  </v-flex>
</template>
<script>
export default {
    props:["member_data","provider_name","session_data","utility_data","bday","diagnosis","procedure"],

}
</script>

<style scoped>
label{font-size: 8pt;}
h5{
  border-bottom: 1px solid grey;
  font-size:8pt
}
.form-note{
  border: 1px solid grey;
  font-weight: 400;
  line-height: 12px;
  padding: 4px;
}
.loa-title {font-family: 'sans' !important;}
.border{border: 1px solid black}
.widthCPTCode{width:6%}
.widthRUV{width:7%}
.widthCPT{width:50% !important}
.paragraph{line-height:1}


/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .address-header h6 {font-size:3pt}
  .address-header h2 {font-size:12pt}
  .form-note{line-height:5px}
  .loa-title{font-size:7pt;}  
  .font-data{font-size:3.5pt }
  .radio-label{font-size:3.5pt; line-height: 1px;}
  .font-signature-title{font-size:3.5pt}
  .small-text{font-size:3pt}
  .logo {max-width: 120px;}
  .line-height {line-height: 1px;}
  .paragraph {font-size:3.5pt}
  input[type=radio] {
      width: 25%;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .address-header h6{ font-size:5pt}
  .small-text{font-size:6pt}
  .logo {max-width: 150px;}
  .font-data{font-size:5pt }
  .loa-title{font-size:12pt}  
  .radio-label{font-size:7pt; line-height: 1px;}
  .paragraph {font-size:6pt}
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .address-header h6{ font-size:7pt}
  .font-data {font-size:7pt}
  .logo {max-width: 200px;}
  .paragraph {font-size:7pt}
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 1200px) {
  .font-data {font-size:8pt}
  .paragraph {font-size:10pt}
  .small-text{font-size:8pt}

}



@media print{
  #content{
    height: 100%;
    visibility:visible;
    padding:0;
    margin:auto
  }
    
  .elevation-3{
    margin-top: 0px !important;
    padding: 0 !important;
    visibility: hidden;
  }
  .logo {max-width: 250px;}
  .address-header h6 {font-size:7pt}
  .loa-title{font-size:16pt;}  
  .address-header h2 {font-size:24pt}
  .font-data{font-size:8pt }
  .paragraph{font-size:7pt}
      
}

</style>