<template>
  <v-flex elevation-3 pa-3 pa-sm-12 >
    <div  id="content" class="px-sm-5"> 
      <v-layout wrap mt-2 >
            <v-flex sm8 xs8 class="address-header">
              <img v-if="utility_data.logo" :src="utility_data.logo" class="mb-2  logo" id="logo"/>

              <h6>33 Meralco Ave., Brgy. San Antonio, Pasig City</h6>
              <h6>Trunk lines: (02) 7023310 (Medical Services): (02) 702-3388 (Other Departments)</h6>
              <h6>24 Hour Hotlines: 0917-7-WE CARE; (02) 687-3219; 0917-8862892</h6>
              <h6>Fax Nos.: (02) 637-9456 E-mail: wecare@valuecarehealth.com</h6>
              <h6>Medical Fax No.: (02) 637-9453</h6>
            </v-flex>
            <v-flex sm4 xs4 align-self-end class="address-header">
              <h6 class="form-note">This form must be <b>legibly and completely</b> filled out, signed by applicable parties, and returned to ValuCare within 30 days.Use generally accepted abbreviations only. <b>Valid for 7 days only or until membership expiry, whichever comes first.</b></h6>
              <h2 class="text-right">HMO</h2>
            </v-flex>
        </v-layout>
        <h4 class="text-center mb-6 loa-title"><u>CONSULTATION FORM/DOCTORS COPY</u></h4>

         <v-layout wrap justify-space-between  >
            <label class="font-data">Hospital:</label>
            <v-flex xs8 align-self-center ><h5 class="font-data text-center">{{provider_name}}</h5></v-flex>
            <label class="d-flex align-center font-data">Date:</label>
            <v-flex xs2 align-self-center ><h5 class="font-data text-center">{{utility_data.date}}</h5></v-flex>
          </v-layout>

          <v-layout wrap class="height">
            <v-flex xs1 align-self-center><label class="font-data">Name:</label></v-flex>
            <v-flex xs5 align-self-center ><h5 class="font-data text-center">{{member.p_name}}</h5></v-flex>
            <v-flex align-self-center class="text-center"><label class="font-data pr-2">Birthday:</label></v-flex>
            <v-flex xs2  align-self-center ><h5 class="font-data text-center">{{ bday }}</h5></v-flex>
            <v-flex xs1 text-right pr-2 align-self-center><label class="font-data">Gender:</label></v-flex>
            <v-flex xs1 pl-1 align-self-center ><label class="font-data"><u>{{member.mem_gender}}</u></label></v-flex>
          </v-layout>

          <v-layout wrap class="height px-0">
            <v-flex  xs1 align-self-center><label class="font-data">ID NO.:</label></v-flex>
            <v-flex  xs3 align-self-center ><h5 class="text-center font-data">{{member.mem_hmo_policy_number}} </h5></v-flex>
            <v-flex align-self-center class="text-center"><label class="font-data">Company Name:</label></v-flex>
            <v-flex xs3 align-self-center ><h5 class="text-center font-data">{{member.mem_company_name ? member.mem_company_name : 'N/A'}}</h5></v-flex>
            <v-flex align-self-center class="text-center"><label class="font-data">Card Expiry:</label></v-flex>
            <v-flex xl2 lg2  xs1 align-self-center ><h5 class="text-center font-data">{{member.mem_hmo_expiry_date ? member.mem_hmo_expiry_date : 'N/A'}}</h5></v-flex>
          </v-layout>

          <v-layout wrap class="mb-2 mb-sm-4">
              <label class="font-data" >Reason for Consultation</label>
            <v-flex xs12 class="mt-1"><h5 class="font-data">{{session_data.chief_complaint}}</h5></v-flex>
          </v-layout>

          <v-layout wrap  class="mb-7 mb-sm-10">
            <label class="font-data">Test/Treatment/Operation Performed in the clinic:</label>
            <v-flex xs12 style="border-top:1px solid black"></v-flex>
            <label class="font-data">&nbsp;<span class="font-weight-medium font-data">
                {{session_data.icd_cpt_data[0].procedure_list[0].cpt_code}}  {{session_data.icd_cpt_data[0].procedure_list[0].cpt_description}}</span>
            </label>

            <v-flex xs12 mb-2 mb-sm-4 style="border-top:1px solid black"></v-flex>
            <v-flex xs12 mb-1 style="border-top:1px solid black"></v-flex>

            <label class="font-data">Recommended Diagnostics Test(s)/Procedure</label>
            <v-flex xs12 mb-2 mb-sm-5 style="border-top:1px solid black"></v-flex>
            <v-flex xs12 mb-2 mb-sm-5 style="border-top:1px solid black"></v-flex>
            <v-flex xs12  style="border-top:1px solid black"></v-flex>
          </v-layout>

           <v-layout wrap justify-space-around class="mb-2 mb-sm-5">
              <v-flex xl3 lg3 sm4 xs4 text-center>
                <h6 style="border-top:1px solid black" class="font-signature-title font-weight-regular mb-0">VALUCARE PLAN COORDINATOR.</h6>
                <h6 class="font-signature-title">Signature over printed name</h6>
              </v-flex>
              <v-flex xl3 lg4 sm5 xs4 text-center>
                <h6 style="border-top:1px solid black" class="font-signature-title font-weight-regular mb-0">Referred to VALUCARE Specialist-Consultant</h6>
                <h6 class="font-signature-title">Signature over printed name</h6>
              </v-flex>
          </v-layout>

          <h6 class="small-text">Important Reminders: <span class="font-weight-regular">Approval code is no longer needed for sum of procedures P1,000 and Below, but exclusions and limitations will apply</span></h6>
          <h6 class="small-text">Members Statement: <span class="font-weight-regular">I hereby authorize ValuCare and its representative to have access on all my Medical / Hospital records. I promise to pay for medical, surgical, hospital and preofessional services
            expenses not explicitly covered by the provisions of Health Care Service Agreement. I fully understand that in instances wherein these non-coverable charge/s (i.e. excess in
            limits, exclusions, Philhealth etc.) were not settled upon availment/discharge, it will be billed to me as collectible and will be charged administrative fees as applicable.
            I hereby attest that i have fully understood all that is written in this form</span></h6>
          <h6 class="small-text">Provider access: <span class="font-weight-regular">VC ACCREDITED HOSPITAL W/ ACCESS TO ASIAN HOSPITAL</span></h6>
          <h6 class="small-text">Clinic access: <span class="font-weight-regular">EXCEPT FORTMED CLINICS & HEALTHWAY CLINICS</span></h6>
          <h6 class="small-text">Dental access: <span class="font-weight-regular">VC ACCREDITED HOSPITAL W/ ACCESS TO ASIAN HOSPITAL</span></h6>
          <h6 class="small-text">Dentist access: <span class="font-weight-regular">VALUCARE DENTAL PROVIDER</span></h6>
          <h6 class="small-text">Dental Benefit: </h6>
          <h6 class="small-text">Waiver:</h6>

          <v-layout wrap justify-end  align-center>
                      
            <v-flex xl5 lg5 sm5 xs5 text-center>
              <v-layout wrap>
                <v-flex xs3 align-self-center >
                  <h6 class="font-data">Conforme:</h6>
                </v-flex>
                <v-flex xs9>
                  <v-layout wrap>
                    <v-flex xs12> <h6 style="border-bottom:1px solid black" class="font-signature-title">{{member.p_name}}/{{member.mem_mobile_number ? member.mem_mobile_number : 'N/A'}}</h6></v-flex>
                    <v-flex xs12><h6 class="font-signature-title">Signature over printed name / Mobile number</h6></v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
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

.form-note{
  border: 1px solid grey;
  font-weight: 400;
  line-height:12px;
  padding: 4px;
}

h5{
  border-bottom: 1px solid grey;
  font-size:8pt
}

label{font-size: 8pt;}


/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .address-header h6{ font-size:4pt}
  .form-note{line-height:5px}
  .loa-title{font-size:8pt}  
  .font-data{font-size:4.5pt }
  .font-signature-title{font-size:3.5pt}
  .small-text{font-size:3pt}
  .logo {max-width: 120px;}

}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .address-header h6{ font-size:5pt}
  .small-text{font-size:6pt}
  .logo {max-width: 150px;}

}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .address-header h6{ font-size:7pt}
  .logo {max-width: 200px;}

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
  .font-data{font-size:10pt }
  @page{
    margin: 0;
  }

}


</style>