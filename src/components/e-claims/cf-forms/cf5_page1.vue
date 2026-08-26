<template>
    <div class="cf2_test">
        <!-- HEADER -->
        <v-row class="border-bottom pb-1 px-2 mx-1 wrap">
            <v-col cols="2" sm="2" md="2" lg="2" xl="2"  align-self="center">
                <v-img src="@/assets/philhealth.png" class="image_logo"></v-img>
            </v-col>

            <v-col cols="8" sm="8" md="8" lg="8" xl="8" class="text-center roman">
                <h4 class="font-weight-regular h4-header"><i>Republic of the Philippines</i></h4>
                <h3 class="h3-header">PHILIPPINE HEALTH INSURANCE CORPORATION</h3>
                <h4 class="h4-header font-weight-regular mb-0" style="line-height:1">Citystate Centre 709 Shaw Boulevard, Pasig City</h4>
                <h4 class="h4-header font-weight-regular mb-0" style="line-height:1">Call Center (02) 441-7442 * Trunkline (02) 441-7444</h4>
                <h4 class="h4-header font-weight-regular mb-0" style="line-height:1">www.philhealth.gov.ph</h4>
                <h4 class="h4-header font-weight-regular mb-0" style="line-height:1">email:actioncenter@philhealth.gov.ph</h4>
            </v-col>

            <v-col cols="2" sm="2" md="2" lg="2" xl="2"  class="text-center">
                <h4 class="h4-header font-weight-regular">This form may be reproduced<br/>and is NOT FOR SALE</h4>
                <h1 class="h1-header font-weight-bold">CF5</h1>
                <h4 class="sub-header font-weight-regular">Supplementary Form for DRG</h4>
                <h4 class="sub-header font-weight-regular">v0.4 revised February 2024</h4>
            </v-col>

            <!-- Series # -->
            <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="padding-1">
                <v-row justify="end" class="wrap">
                    <label class="h4-header mr-3">Series # &nbsp;</label>
                    <div v-for="i in 14" :key="i" class="box"></div>
                </v-row>

                <v-row align="baseline" justify="end" class="mt-1" no-gutters>
                    <v-col cols="2">
                        <span class="sub-header font-weight-bold">(For PhilHealth use only)</span>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- IMPORTANT REMINDERS -->
        <h4 class="h4-header mt-4 px-1">IMPORTANT REMINDERS:</h4>
        <h5 class="h5-reminder font-weight-regular px-1">
        • If you are utilizing this form, you are a health facility participating in the Shadow Billing of Diagnosis-Related Groups. Please fill up this supplementary form.
        </h5>
        <h5 class="h5-reminder font-weight-regular px-1">
        • The Health Facility filing this claim shall be reimbursed using All Case Rates.
        </h5>
        <h5 class="h5-reminder font-weight-regular px-1">
        • PLEASE WRITE IN CAPITAL LETTERS AND CHECK (✓) THE APPROPRIATE BOXES
        </h5>
        <h5 class="h5-reminder font-weight-regular px-1">
        • This form, together with supporting documents should be filed within thirty (30) calendar days from date of discharge.
        </h5>
        <h5 class="h5-reminder font-weight-regular px-1">
        • All information required in this form are necessary and claim forms with incomplete information shall not be processed.
        </h5>
        <h5 class="h5-reminder px-1 p-b-2">
        • FALSE / INCORRECT INFORMATION OR MISREPRESENTATION SHALL BE SUBJECT TO CRIMINAL, CIVIL OR ADMINISTRATIVE LIABILITIES.
        </h5>

        <!-- PART I - DRG INFORMATION -->
        <h3 class="text-center font-header white--text black padding-y1">PART I - DRG Information</h3>
        <div class="pa-3 ma-3 wrap">
            <v-row dense no-gutters>
                <!-- 1. Primary Diagnosis -->
                <v-col cols="12" sm="4" md="4" lg="4">
                    <h4 class="h4-header">1. Primary Diagnosis (PDx):</h4>
                    <v-row align="baseline" class="ma-1">
                        <v-col cols="3">
                            <div class="box-pdx-sdx">&nbsp;</div>
                            <h4 class="sub-header text-center">PDx</h4>
                        </v-col>
                        <v-col cols="8" align-self="center">
                            <h4 class="sub-header" style="border: 1px dashed #000;">
                                1. Input only 1 valid ICD-10
                                    code. A list of valid ICD-10
                                    codes can be found on
                                    PhilHealth's DRG Manual.<br>
                                2. For dagger-asterisk codes,
                                    please input the DAGGER
                                    code as the Primary
                                    Diagnosis.<br>
                                3. Please make sure to input
                                    the value after the decimal
                                    point of the ICD code, as
                                    applicable.
                            </h4>
                        </v-col>
                    </v-row>
                </v-col>
                <!-- 2. Secondary Diagnosis -->
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                    <h4 class="h4-header">2. Secondary Diagnosis (SDx):</h4>

                    <v-row align="baseline" class="ma-1" no-gutters>
                        <v-col cols="6">
                            <v-row dense>
                                <v-col v-for="n in 12" :key="n" cols="12" sm="2" md="2" lg="2" xl="2">
                                    <div class="box-pdx-sdx">&nbsp;</div>
                                    <h4 class="sub-header text-center">SDx{{ n }}</h4>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="5" sm="5" md="5" lg="5" xl="5" class="mx-3" align-self="center">
                            <h4 class="sub-header" style="border: 1px dashed #000;">
                                1. Input up to 12 valid ICD-10 codes. A list of valid ICD-10
                                codes can be found on PhilHealth's DRG Manual.<br>
                                2. Ensure there are no repeat codes across all secondary
                                diagnoses, and with the primary diagnosis.<br>
                                3. For dagger-asterisk codes, please input the ASTERISK
                                code as a Secondary Diagnosis.<br>
                                4. Please make sure to input the value after the decimal
                                point of the ICD code, as applicable.<br>
                            </h4>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <!-- 3. Applicable Procedures -->
            <v-row class="mt-4">
                <v-col cols="12">
                    <h4 class="h4-header">3. Applicable Procedures:</h4>
                    <v-row class="ma-1">
                        <v-col cols="9">
                            <v-row dense>
                                <v-col v-for="n in 10" :key="'row1-'+n" cols="1" class="text-center">
                                    <div class="box-pdx-sdx mb-1">&nbsp;</div>
                                    <h4 class="sub-header text-center">RVS {{ n }}</h4>

                                    <v-row justify="center" class="mt-1" dense>
                                        <v-col v-for="(label, i) in ['L','R','B']" :key="'r2-s-'+n+'-'+i"  cols="3" sm="3" md="3" lg="3" xl="3">
                                            <input onclick="return false"  type="checkbox"><label  class="mx-2  sub-header text-start" >{{ label }}</label>
                                        </v-col>
                                    </v-row>

                                    <v-row justify="center" align="baseline">
                                        <span>+</span>
                                        <v-col cols="8" sm="8" md="6" lg="6" xl="6">
                                            <v-row>
                                                <div class="box_no_top_pan ml-1">&nbsp;</div>
                                                <div class="box_no_top_pan ml-1">&nbsp;</div>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>

                            <v-row class="mt-4" dense>
                                <v-col v-for="n in 10" :key="'row2-'+n" cols="1" class="text-center">
                                    <div class="box-pdx-sdx mb-1">&nbsp;</div>
                                    <h4 class="sub-header text-center">RVS {{ n + 10 }}</h4>

                                    <v-row justify="center" class="mt-1" dense >
                                        <v-col v-for="(label, i) in ['L','R','B']" :key="'r2-s-'+n+'-'+i"  cols="3" sm="3" md="3" lg="3" xl="3">
                                            <input onclick="return false"  type="checkbox"><label  class="mx-2  sub-header text-start" >{{ label }}</label>
                                        </v-col>
                                    </v-row>

                                    <v-row justify="center" align="baseline">
                                        <span>+</span>
                                        <v-col cols="8" sm="8" md="6" lg="6" xl="6">
                                            <v-row>
                                                <div class="box_no_top_pan ml-1">&nbsp;</div>
                                                <div class="box_no_top_pan ml-1">&nbsp;</div>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>

                        <!-- Right side: Notes -->
                        <v-col cols="3" align-self="center">
                            <h4 class="sub-header" style="border: 1px dashed #000; padding: 6px;">
                            1. Input up to 20 valid RVS codes. A list of valid RVS codes can be found on PhilHealth's DRG Manual, or the PhilHealth's website.<br>
                            2. Make sure to indicate the laterality (left, right, or both), as applicable. If there is no laterality applicable, leave the field blank.<br>
                            3. Extension codes shall be indicated for each procedure, as necessary (after the "+" sign). Please check the DRG Implementation Manual for specific rules on adding extension codes.
                            </h4>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>


            <!-- 4. Newborn Data -->
            <v-row class="mt-4">
                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                    <h4 class="h4-header">4. Newborn Data (if applicable):</h4>
                    <v-row align="center" justify="start" class="ma-1">
                        <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                            <v-row dense>

                            <h4 class="font-data">Admission weight (up to 1 decimal point):</h4>
                                <div class="box_no_top_pan ml-1">&nbsp;</div>
                                <div class="box_no_top_pan ml-1">&nbsp;</div>
                                <span class="mx-1">-</span>
                                <div class="box_no_top_pan ml-1">&nbsp;</div>
                                <span class="h5-reminder mx-1 font-weight-bold">kg</span>
                            </v-row>
                        </v-col>

                        <v-col cols="5" sm="5" md="3" lg="3" xl="3" align-self="center">
                            <div class="pa-2" style="border: 1px dashed #000;">
                            <h4 class="sub-header">
                                1. Fill up this portion only when the claim is for a newborn<br>
                                2. Admission weight less than 0.3kg is considered invalid.<br>
                                3. Provide the admission weight for newborn infant patients
                                aged 0-27 days.
                            </h4>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>

        <h3 class="text-center font-header white--text black padding-y1">PART II - CERTIFICATION OF CONSUMPTION OF BENEFITS AND CONSENT TO ACCESS PATIENT RECORD/S</h3>
        <div class="pa-3 ma-3 wrap">
            <h6 class="h4-reminder mb-2">PATIENT CERTIFICATIONS:</h6>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pa-2">
                <h5 class="h5-reminder small mb-0" style="position:relative;z-index:2 ">
                    <i><b>
                        1. I hereby consent to the submission and examination of the patient's pertinent medical records for the purpose of verifying the veracity of this claim to 
                        effect efficient processing of benefit payment.
                    </b></i>
                </h5>
                <h5 class="h5-reminder small mb-0" style="position:relative;z-index:2 ">
                    <i><b>
                        2. I hereby consent to the submission and examination of the patient's pertinent medical records for the purpose of verifying the veracity of this claim to
                        effect efficient processing of benefit payment.
                    </b></i>
                </h5>
                <h5 class="h5-reminder small mb-0" style="position:relative;z-index:2 ">
                    <i><b>
                        3. I hereby hold PhilHealth or any of its officers, employees, and/or representatives free from any and all legal liabilities relative to the herein-
                        mentioned consent which I have voluntarily and willingly given in connection with this claim before PhilHealth.
                    </b></i>
                </h5>
                <h5 class="h5-reminder small mb-0" style="position:relative;z-index:2 ">
                    <i><b>
                        4. I hereby consent to allowing PhilHealth to store the information provided on this form for research and policy purposes of the Corporation.
                    </b></i>
                </h5>
                <v-row align="center" class="wrap pa-2">
                    <v-col cols="8" sm="8" md="8" lg="8" xl="8">
                        <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="mb-2">
                            <v-row class="wrap">
                                <v-col cols="7" sm="7" md="7" lg="7" xl="7" class="px-2" style="position:relative">
                                    <!-- <h6 class="sub-header text-center text-uppercas grey--text text--darken-2 mt-4">SIGNATURE HAS BEEN PROVIDED</h6> -->
                                    <v-img :src="cf5_data_p1.TRANSACTION.patient_sign_path" height="30" contain></v-img>
                                    <h6 class="sub-header text-center border-bottom mt-2" style="position:relative;z-index:2">{{ textCapitalize(cf5_data_p1.PRINCIPAL_DATA.first_name) + ' ' + (textCapitalize(cf5_data_p1.PRINCIPAL_DATA.middle_name) ? textCapitalize(cf5_data_p1.PRINCIPAL_DATA.middle_name) : '') + ' ' + textCapitalize(cf5_data_p1.PRINCIPAL_DATA.last_name) + ' ' + (textCapitalize(cf5_data_p1.PRINCIPAL_DATA.suffix) ? textCapitalize(cf5_data_p1.PRINCIPAL_DATA.suffix) : '')}}</h6>
                                    <h6 class="sub-header font-weight-regular pa-0 ma-0 text-center" >Signature Over Printed Name of Member/Patient/Authorized Representative</h6>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="mb-2">
                            <v-row class="wrap">
                                <v-col cols="7" sm="7" md="7" lg="7" xl="7" class="px-2" style="position:relative">
                                    <!-- <h6 class="sub-header text-center text-uppercas grey--text text--darken-2 mt-4">SIGNATURE HAS BEEN PROVIDED</h6> -->
                                    <!-- <v-img :src="cf5_data_p1.TRANSACTION.patient_sign_path" height="30" contain></v-img> -->
                                    <h6 class="sub-header text-center border-bottom mt-2" style="position:relative;z-index:2"></h6>
                                    <h6 class="sub-header font-weight-regular pa-0 ma-0 text-center" >Relationship of the representative to the member/patient (if applicable):</h6>
                                </v-col>
                            </v-row>
                        </v-col>

                        
                        <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="mb-2">
                            <v-row align="center" class="wrap">
                                <h6 class="sub-header font-weight-regular mr-2">Relationship of the representative to<br/> the member/patient</h6>
                                <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                    <v-row class="wrap">
                                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                            <v-row class="wrap">
                                                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                                    <v-row align="center">
                                                        <input onclick="return false" :checked="cf5_data_p1.PATIENT_DATA.rel_to_patient === 'Spouse'" type="checkbox" >
                                                        <label  class="mx-2 sub-header" for="vehicle1">Spouse</label><br/>
                                                        <input onclick="return false" :checked="cf5_data_p1.PATIENT_DATA.rel_to_patient === 'Child'" type="checkbox" >
                                                        <label  class="mx-2 sub-header" for="vehicle1">Child</label>
                                                        <input onclick="return false" :checked="cf5_data_p1.PATIENT_DATA.rel_to_patient === 'Parent'" type="checkbox" >
                                                        <label  class="mx-2 sub-header" for="vehicle1">Parent</label>
                                                    </v-row>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                                    <v-row class="wrap">
                                                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                                            <v-row class="wrap">
                                                                <input onclick="return false" :checked="cf5_data_p1.PATIENT_DATA.rel_to_patient === 'Sibling'" type="checkbox" >
                                                                <label  class="mx-2 sub-header" for="vehicle1">Sibling</label>
                                                                <input onclick="return false" :checked="cf5_data_p1.PATIENT_DATA.rel_to_patient !== 'Spouse' && cf5_data_p1.PATIENT_DATA.rel_to_patient !== 'Sibling' && cf5_data_p1.PATIENT_DATA.rel_to_patient !== 'Child' && cf5_data_p1.PATIENT_DATA.rel_to_patient !== 'Parent'  && cf5_data_p1.PATIENT_DATA.rel_to_patient !== null " type="checkbox" ><label  class="mx-2 sub-header" for="vehicle1">Others, Specify</label>
                                                                <h6 :class="{'white--text' :cf5_data_p1.PATIENT_DATA.rel_to_patient === 'Spouse' || cf5_data_p1.PATIENT_DATA.rel_to_patient === 'Sibling' || cf5_data_p1.PATIENT_DATA.rel_to_patient === 'Child' || cf5_data_p1.PATIENT_DATA.rel_to_patient === 'Parent'}" class="sub-header border-bottom" style="width:40%">{{cf5_data_p1.PATIENT_DATA.rel_to_patient ? cf5_data_p1.PATIENT_DATA.rel_to_patient : 'N/A'}}</h6>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                            <v-row align="center" class="wrap">
                                <h6 class="sub-header font-weight-regular mr-2" >Reason for signing on behalf of the <br/> member/patient:</h6>
                                <v-col cols="7" sm="7" md="7" lg="7" xl="7">
                                    <v-row class="wrap">
                                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                            <v-row class="wrap">
                                                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                                    <v-row align="center">
                                                        <input onclick="return false" :checked="cf5_data_p1.PATIENT_DATA.rel_for_signing_on_behalf === 'Incapacitated'"  type="checkbox">
                                                        <label  class="mx-2 sub-header" for="vehicle1">Patient is Incapacitated</label> <br/>
                                                    </v-row>
                                                </v-col>
                                                
                                                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                                    <v-row class="wrap">
                                                        <input onclick="return false" :checked="cf5_data_p1.PATIENT_DATA.rel_for_signing_on_behalf !== 'Incapacitated' && cf5_data_p1.PATIENT_DATA.rel_for_signing_on_behalf !== 'Representative' &&  cf5_data_p1.PATIENT_DATA.rel_for_signing_on_behalf !== 'Patient' &&  cf5_data_p1.PATIENT_DATA.rel_for_signing_on_behalf !== null && cf5_data_p1.PATIENT_DATA.rel_for_signing_on_behalf !== ''" type="checkbox"><label  class="mx-2 sub-header" for="vehicle1">Other Reasons</label>
                                                        <h6 :class="{'white--text' : cf5_data_p1.PATIENT_DATA.rel_for_signing_on_behalf == 'Incapacitated' || cf5_data_p1.PATIENT_DATA.rel_for_signing_on_behalf == 'Representative' || cf5_data_p1.PATIENT_DATA.rel_for_signing_on_behalf == 'Patient'}" class="border-bottom" style="width:40%;word-wrap: break-word" >{{cf5_data_p1.PATIENT_DATA.rel_for_signing_on_behalf ? cf5_data_p1.PATIENT_DATA.rel_for_signing_on_behalf : 'N/A'}}</h6>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-col>  

                    <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                        <v-row class="wrap">
                            <v-col cols="6" sm="6" md="6" lg="6" xl="6" align-self="start">
                                <p class="sub-header mb-4" >If patient/representative is unable to write, put right thumbmark. Patient/ Representative should be assisted by an HCI representative</p>
                            </v-col>
                            <v-col cols="6" sm="6" md="6" lg="6" xl="6" class="px-2">
                                <div style="height:120px;border:1px solid black"></div> 
                                <div class="d-flex justify-center">
                                    <span class="sub-header font-weight-bold">Right Thumb Mark</span>
                                </div>
                            </v-col>
                        </v-row>

                        <div class="row justify-start">
                            <label class="h5-reminder font-weight-bold">Date Signed:</label>
                            <h6 class="border-bottom" style="width:40%;word-wrap: break-word"></h6>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </div>

        <h3 class="text-center font-header white--text black padding-y1">PART III - CERTIFICATION OF CONSUMPTION OF HEALTH FACILITY</h3>

        <div class="pa-3 ma-3 wrap">
            <div class="row justify-center">
                <h5 class="font-data mt-1 mb-0" style="position:relative;z-index:2 ">
                    <i><b>
                        I hereby certify that services rendered were recorded in the patient's chart and health facility records and that the herein information given are true and correct.
                    </b></i>
                </h5>
            </div>

            <div class="row">
                <v-col cols="5">
                    <v-img :src="cf5_data_p1.TRANSACTION.doctor_sign_path" height="30" contain></v-img>
                    <h6 class="sub-header text-center border-bottom mt-2" style="position:relative;z-index:2">{{cf5_data_p1.first_name + ' ' + cf5_data_p1.middle_name + ' ' + cf5_data_p1.last_name}}</h6>
                    <h6 class="sub-header font-weight-regular pa-0 ma-0 text-center" >Signature Over Printed Name of Attending Physician</h6>
                </v-col>
                <v-col cols="3">
                    <h6 class="sub-header text-center border-bottom mt-2" style="position:relative;z-index:2">{{cf5_data_p1.date_signed}}</h6>
                    <h6 class="sub-header font-weight-regular pa-0 ma-0 text-center" >Date Signed</h6>
                </v-col>

                <v-col cols="4">
                    <h6 class="sub-header text-center border-bottom mt-2" style="position:relative;z-index:2"></h6>
                    <h6 class="sub-header font-weight-regular pa-0 ma-0 text-center" >Official Capacity / Designation</h6>
                </v-col>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:["menu", "cf5_data_p1"],
}
</script>

<style scoped>
@media print{
  .cf2_test{
    padding:0.25em 0 0!important
  }
  .h1-header{font-size:16pt;line-height:0.8 !important;}
  .h3-header,.font-header{font-size:10pt !important}
  .h4-header, .font-label, .font-data{font-size:7pt !important}
  .h5-reminder{font-size:7.2pt !important}
  .line-height-sub{line-height: 0.4;}
  .m-b-2, .m-b-3, .m-b-4{margin-bottom:0}
  .p-b-1, .p-b-2, .p-b-3, .p-b-4{padding-bottom:0}

  .sub-header, .box_no_top{font-size:6pt}
  .sub-header-subtitle,.sub-header-diagnosis{font-size:5pt}
  .dis_check_lbl{font-size:4pt}
  .wrap {
    flex-wrap: wrap !important;
  }
}

.wrap {
    display: flex;
    flex-wrap: wrap !important;
}

.border-bottom{ border-bottom:1px solid black}
  .border-top{border-top:1px solid black}
  .box{
     align-items: center;
     border:1px solid black;
     display: flex;
     font-size:8px;
     height:2em;
     justify-content: center;
     text-align:center;
     width:2%;
  }
  .box_no_top_pan{
    border-left:1px solid black;
    border-right:1px solid black;
    border-bottom:1px solid black;
    font-size:10px;
    text-align: center;
    width: 15px;
    height: 15px;
  }
  .box_no_top{
    border-left:1px solid black;
    border-right:1px solid black;
    border-bottom:1px solid black;
    font-size:10px;
    text-align: center;
  }
  .box-pdx-sdx{
    align-items: center;
    border:1px solid black;
    display: flex;
    font-size:8px;
    height:3em;
    justify-content: center;
    text-align:center;
  }
  .small-box {
    border: 1px solid #000;
    height: 20px;
    width: 100%;
  }
  .cf2_test{
    padding-top:3em ;
    padding-left:2.35em !important;
    padding-right:2.55em !important;
  }
 .dis_check_lbl, .font-label{font-size:10pt}
  .font-header{ font-size:13pt}
  .h1-header{ font-size:25pt;line-height:0.8;}
  .h3-header{font-size:14pt}
  .h4-header{font-size:11.5pt}
  .h4-header{font-size:11pt}
  .h5-reminder{font-size:7.3pt}
  .hide-content{display: none}
  .font-data{ font-size:9pt}
  .image_logo{
     width:200px;
     height:70px;
  }
  .line-height-sub{line-height: 0.1;}
  .p-b-1{padding-bottom:0.25em}
  .p-b-2{padding-bottom:0.5em}
  .p-b-3{padding-bottom:0.7em}
  .p-b-4{padding-bottom:1em}
  .m-b-2{margin-bottom:0.5em}
  .m-b-3{margin-bottom:0.75em}
  .m-b-4{margin-bottom:1em}
  .roman{ font-family:'Times New Roman', Times, serif}
  .sub-header,.sub-header-diagnosis{font-size:8px}
  .sub-header-subtitle{font-size:7px}
</style>