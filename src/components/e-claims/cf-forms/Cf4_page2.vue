<template>
  <div class="cf4_test2" >
      <div class="border pb-1" >
        <h4 class="h4-header mb-1 px-1 pt-1">5. Physical Examination continued (Pertinent Findings per System)</h4>
     
        <v-row class="mb-2 pa-2 mt-1" wrap> <!-- CHEST LUNGS --> 
            <v-col cols="3">
                <h5 class="h5-header font-weight-regular">CHEST/LUNGS:</h5>
            </v-col>
            <v-col cols="9">
                <v-row align="center" class="mb-1" wrap>
                    <v-col v-for="(chest,i) in cf4_data_p1.PE_DATA.pe_chest_lungs" :key="i" cols="3">
                        <v-row wrap>
                            <input v-model="cf4_data_p1.PE_DATA.pe_chest_lungs" :value="chest.assessment" onclick="return false" type="checkbox">
                            <h6 class="sub-header ml-1 mr-0 mb-2" style="width:80%">{{chest.assessment}}</h6>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row align="center" wrap>
                    <h6 class="sub-header mr-1">Others:</h6>
                    <v-col cols="4"><h6 class="sub-header border-bottom white--text">N/A</h6></v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row class="mb-2 pa-2" wrap> <!-- CVS -->
            <v-col cols="3">
                <h5 class="h5-header font-weight-regular">CVS:</h5>
            </v-col>
            <v-col cols="9">
                <v-row align="center" class="mb-1" wrap>
                    <v-col v-for="(cvs,i) in cf4_data_p1.PE_DATA.pe_cvs" :key="i" cols="3">
                        <v-row wrap>
                            <input v-model="cf4_data_p1.PE_DATA.pe_cvs" :value="cvs.assessment" onclick="return false" type="checkbox">
                            <h6 class="sub-header ml-1 mr-0 mb-2" style="width:80%">{{cvs.assessment}}</h6>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row align="center" wrap>
                    <h6 class="sub-header mr-1">Others:</h6>
                    <v-col cols="4"><h6 class="sub-header border-bottom white--text">N/A</h6></v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row class="mb-2 pa-2" wrap> <!-- ABDOMEN -->
            <v-col cols="3">
                <h5 class="h5-header font-weight-regular">ABDOMEN:</h5>
            </v-col>
            <v-col cols="9">
                <v-row align="center" wrap mb-1>
                    <v-col v-for="(abdomen,i) in cf4_data_p1.PE_DATA.pe_abdomen" :key="i" cols="3">
                        <v-row wrap>
                            <input v-model="cf4_data_p1.PE_DATA.pe_abdomen" :value="abdomen.assessment" onclick="return false" type="checkbox">
                            <h6 class="sub-header ml-1 mr-0 mb-2" style="width:80%">{{abdomen.assessment}}</h6>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row align="center" wrap>
                    <h6 class="sub-header mr-1">Others:</h6>
                    <v-col cols="4"><h6 class="sub-header border-bottom white--text">N/A</h6></v-col>
                </v-row>
            </v-col>
        </v-row>
        
        <v-row class="mb-2 pa-2" wrap> <!-- GU (IE) -->
            <v-col cols="3">
                <h5 class="h5-header font-weight-regular">GU (IE):</h5>
            </v-col>
            <v-col cols="9">
                <v-row align="center" wrap mb-1>
                    <v-col v-for="(gu_ie,i) in cf4_data_p1.PE_DATA.pe_gu_ie" :key="i" cols="3">
                        <v-row wrap>
                            <input v-model="cf4_data_p1.PE_DATA.pe_gu_ie" :value="gu_ie.assessment" onclick="return false" type="checkbox">
                            <h6 class="sub-header ml-1 mr-0 mb-2" style="width:80%">{{gu_ie.assessment}}</h6>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row align="center" wrap>
                    <h6 class="sub-header mr-1">Others:</h6>
                    <v-col cols="4"><h6 class="sub-header border-bottom white--text">N/A</h6></v-col>
                </v-row>
            </v-col>
        </v-row>
 
        <v-row class="mb-2 pa-2" wrap> <!-- SKIN/EXTREMITIES: -->
            <v-col cols="3">
                <h5 class="h5-header font-weight-regular">SKIN/EXTREMITIES: </h5>
            </v-col>
            <v-col cols="9">
                <v-row align="center" wrap>
                    <v-col v-for="(skin_extremities,i) in cf4_data_p1.PE_DATA.pe_skin_extremities" :key="i" cols="3">
                        <v-row wrap>
                            <input v-model="cf4_data_p1.PE_DATA.pe_skin_extremities" :value="skin_extremities.assessment" onclick="return false" type="checkbox">
                            <h6 class="sub-header ml-1 mr-0 mb-2" style="width:80%">{{skin_extremities.assessment}}</h6>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row align="center" wrap>
                    <h6 class="sub-header mr-1">Others:</h6>
                    <v-col cols="4"><h6 class="sub-header border-bottom white--text">N/A</h6></v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row class="mb-2 pa-2" wrap> <!-- NEURO-EXAM:-->
            <v-col cols="3">
                <h5 class="h5-header font-weight-regular">NEURO-EXAM:</h5>
            </v-col>
            <v-col cols="9">
                <v-row align="center" wrap mb-1>
                    <v-col v-for="(neuro,i) in cf4_data_p1.PE_DATA.pe_neuro_exam" :key="i" cols="3">
                        <v-row wrap>
                            <input v-model="cf4_data_p1.PE_DATA.pe_neuro_exam" :value="neuro.assessment" onclick="return false" type="checkbox">
                            <h6 class="sub-header ml-1 mr-0 mb-2" style="width:80%">{{neuro.assessment}}</h6>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row align="center" wrap>
                    <h6 class="sub-header mr-1">Others:</h6>
                    <v-col cols="4"><h6 class="sub-header border-bottom white--text">N/A</h6></v-col>
                </v-row>
            </v-col>
        </v-row>

 
        <h4 class="h4-header text-center bg-grey">IV. COURSE IN THE WARD (Attach photocopy of laboratory/imaging results) </h4>
        <table class="h5-header" style="box-sizing:border-box;width:100%;border:1px solid black;border-collapse: collapse;" border>
            <thead>
                <tr class="text-center">
                    <td>Date</td>
                    <td>DOCTOR’S ORDER/ACTION</td>
                </tr>
            </thead>
            <tbody class="text-center">
                <!-- <template v-if="cf4_data_p1.COURSE_IN_THE_WARD.length > 0">
                    <tr v-for="(ward,i) in cf4_data_p1.COURSE_IN_THE_WARD" :key="i">
                        <td style="width:20%">{{ward.date ? ward.date : ''}}</td>
                        <td>{{ward.doctors_order ? ward.doctors_order : ''}}</td>
                    </tr>
                </template> -->

                <template >
                    <tr >
                        <td style="width:20%" class="white--text">N/A</td>
                        <td class="white--text">N/A</td>
                    </tr>
                    
                </template>
                <tr>
                    <td colspan="2" class="text-justify py-1 h5-header">
                        <span>SURGICAL PROCEDURE/RVS CODE (Attach photocopy of OR technique): </span>
                    </td> 
                </tr>
            </tbody>
        </table>

       
        <h4 class="h4-header text-center bg-grey py-1">V. DRUGS/MEDICINES  </h4>
        <table class="h5-header" style="box-sizing:border-box;width:100%;border:1px solid black;border-collapse: collapse" border>
            <thead>
                <tr class="text-center">
                    <td>Generic Name</td>
                    <td>Quantity/Dosage/Route </td>
                    <td>Total Cost</td>
                </tr>
            </thead>
            <tbody>
                <!-- <template v-if="cf4_data_p1.drugs_and_medicines.length > 0">
                    <tr v-for="(drugs,i) in cf4_data_p1.drugs_and_medicines" :key="i" class="text-center">
                        <td>{{drugs.generic_name ? drugs.generic_name : 'N/A'}}</td>
                        <td>{{(drugs.quantity ? drugs.quantity : 'N/A')}}/{{(drugs.dosage ? drugs.dosage : 'N/A')}}/{{(drugs.route ? drugs.route : 'N/A')}}</td>
                        <td>{{drugs.total_cost_per_medicine ? Math.round(parseFloat( drugs.total_cost_per_medicine).toFixed(2)): 'N/A'}}</td>
                    </tr>
                </template> -->

                <template >
                    <tr class="text-center">
                        <td class="white--text">N/A</td>
                        <td class="white--text">N/A</td>
                        <td class="white--text">N/A</td>
                    </tr>
                </template>
            </tbody>
        </table>

  
        <h4 class="h4-header text-center bg-grey border-bottom">VI. OUTCOME OF TREATMENT  </h4>
        <v-row class="pa-5 py-5" justify="space-between" wrap> <!--VI. OUTCOME OF TREATMENT--> 
            <input onclick="return false" :checked="cf4_data_p1.PATIENT_DATA.patient_disposition === 'I'" type="checkbox" name="vehicle1" value="Bike"><h6 class="sub-header ml-1 mr-4">IMPROVED </h6>
            <input onclick="return false" :checked="cf4_data_p1.PATIENT_DATA.patient_disposition === 'H'" type="checkbox" name="vehicle1" value="Bike"><h6 class="sub-header ml-1 mr-4">HAMA </h6>
            <input onclick="return false" :checked="cf4_data_p1.PATIENT_DATA.patient_disposition === 'E'" type="checkbox" name="vehicle1" value="Bike"><h6 class="sub-header ml-1 mr-4">EXPIRED </h6>
            <input onclick="return false" :checked="cf4_data_p1.PATIENT_DATA.patient_disposition === 'A'" type="checkbox" name="vehicle1" value="Bike"><h6 class="sub-header ml-1 mr-4">ABSCONDED </h6>
            <input onclick="return false" :checked="cf4_data_p1.PATIENT_DATA.patient_disposition === 'T'" type="checkbox" name="vehicle1" value="Bike"><h6 class="sub-header ml-1 mr-4">TRANSFERED </h6>
            <h6 class="mr-2">Specify Reason:</h6>                         
            <h6 class="border-bottom word-wrap" style="width:25%">{{cf4_data_p1.PATIENT_DATA.patient_disposition_reason}}</h6>
        </v-row>

        <h4 class="text-center bg-grey border-bottom border-top h4-header">VII. CERTIFICATION OF HEALTH CARE PROFESSIONAL  </h4>
         
        <h5 class="h5-header pa-2 mt-1">Certification of Attending Health Care Professional:</h5>
        <v-col cols="12" class="mt-5">
            <v-row class="mb-8" justify="center" wrap>
                <h5 class="h5-header mx-10" ><i style="position:relative;z-index:2">I certify that the above information given in this form, including all attachments, are true and correct.</i></h5>
            </v-row>
            <v-row justify="space-around" wrap>
                <v-col cols="4" style="position:relative;z-index:1">
                    <!-- <h6 class="sub-header text-center text-uppercas grey--text text--darken-2">SIGNATURE HAS BEEN PROVIDED</h6> -->
                    <v-img :src="cf4_data_p2.TRANSACTION.doctor_sign_path" height="30" contain></v-img>
                    <h5 class="h5-header border-bottom text-center" style="position:relative;z-index:2;width:100%">{{cf4_data_p2.doctor_name}}</h5>
                    <h5 class="small text-center" style="position:relative;z-index:2;width:100%">Signature Over Printed Name of Attending Physician/Midwife</h5>
                </v-col>
                <v-col cols="6"> 
                        <v-row class="mt-5" align="baseline" wrap>
                            <v-col cols="12">
                                <v-row justify="center" wrap>
                                    <v-col cols="2">
                                        <v-row wrap>
                                            <v-col cols="6" class="box">{{cf4_data_p2.date_signed ? cf4_data_p2.date_signed.charAt(5) : ''}}</v-col>
                                            <v-col cols="6" class="box">{{cf4_data_p2.date_signed ? cf4_data_p2.date_signed.charAt(6) : ''}}</v-col>
                                        </v-row>
                                    </v-col>
                                    <h6 class="sub-header mx-1">-</h6>
                                    <v-col cols="2">
                                        <v-row wrap>
                                            <v-col cols="6" class="box">{{cf4_data_p2.date_signed ? cf4_data_p2.date_signed.charAt(8) : ''}}</v-col>
                                            <v-col cols="6" class="box">{{cf4_data_p2.date_signed ? cf4_data_p2.date_signed.charAt(9) : ''}}</v-col>
                                        </v-row>
                                    </v-col>
                                    <h6 class="sub-header mx-1">-</h6>
                                    <v-col cols="4">
                                        <v-row wrap>
                                            <v-col cols="3" class="box">{{cf4_data_p2.date_signed ? cf4_data_p2.date_signed.charAt(0) : ''}}</v-col>
                                            <v-col cols="3" class="box">{{cf4_data_p2.date_signed ? cf4_data_p2.date_signed.charAt(1) : ''}}</v-col>
                                            <v-col cols="3" class="box">{{cf4_data_p2.date_signed ? cf4_data_p2.date_signed.charAt(2) : ''}}</v-col>
                                            <v-col cols="3" class="box">{{cf4_data_p2.date_signed ? cf4_data_p2.date_signed.charAt(3) : ''}}</v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row justify="center" wrap>
                                    <v-col cols="10" class="small text-center">Date Signed (Month / Day / Year)</v-col>
                                </v-row>
                            </v-col>
                        </v-row>   
                </v-col>
            </v-row>
        </v-col>
     
      </div>
  </div>
</template>

<script>
export default {
    props:["menu","cf4_data_p2", "cf4_data_p1"],
    data:() => ({
        drugs_item: 7,
        doctor_img_loader_cf4 : true,
    })
}
</script>

<style scoped>
.bg-grey{
  background-color:#cccccc
}
.border {
  border: 1px solid black;
}
.border-top {
  border-top: 1px solid black;
}
.border-bottom {
  border-bottom: 1px solid black;
}
.border-right{
  border-right: 1px solid black;
}
.border-left{
    border-left:1px solid black
}
.box {
  align-items: center;
  border: 1px solid black;
  display: flex;
  font-size: 8pt;
  height: 2em;
  justify-content: center;
  text-align: center;
  width: 2%;
}

.box_no_top {
  width: 2%;
  height: 18px;
  font-size: 10pt;
  text-align: center;
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
}
.cf4_test2 {
  padding-top: 3em;
  padding-left: 2.35em !important;
  padding-right: 2.55em !important;
  margin-bottom:5em !important;
}



.h4-header {
  font-size: 11pt;
}
.h5-header {
  font-size: 9pt;
}

.height-small{
  height:20vh
}
.height-medium{
  height:25vh
}
.hide-content {
  display: none;
}

.image_logo {
  width: 200px;
  height: 70px;
}


.small {
  font-size: 8pt;
}
.sub-header,
.sub-header-small {
  font-size: 8pt;
}

 .signature{
         position:absolute;
         margin-left: auto;
         margin-right:auto;
         top:-55px;
         left:0;
         right:0;
         z-index: 1

    }
.word-wrap {
  word-wrap: break-word;
}

@media print {
  .cf4_test2 {
    padding: 0.25em 0 0 !important;
    margin-bottom:0 !important;

  }
  .box{
    width:2%;
    height:18px;
    border:1px solid black
  }
  
  .h4-header{
    font-size: 7pt !important;
  }
 
  .h5-header {
    font-size: 6.5pt;
  }
  .height-small,
  .height-medium{
    height:8vh
  }
 
 
  .sub-header,
  .box_no_top,
  .small {
    font-size: 6pt;
  }
  
  .sub-header-small{
    font-size: 5pt;
  }

  .signature{
     margin-left:-30px; 
  }
  
}
</style>

