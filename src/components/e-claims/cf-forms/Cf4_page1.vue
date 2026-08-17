<template>
    <div class="cf4_test">
        <v-row justify="space-between" class="pb-2 px-2 mx-1 wrap">
            <v-col cols="2" sm="2" md="2" lg="2" xl="2" align-self="center">
                <v-img src="@/assets/philhealth.png" class="image_logo" lazy-src="@/assets/philhealth.png"></v-img>
            </v-col>

            <v-col cols="2" sm="2" md="2" lg="2" xl="2" class="text-center">
                <h4 class="h4-header font-weight-regular text-center" style="line-height:1;">This may be reproduce and <br/> is NOT FOR SALE</h4>
                <h1 class="h1-header font-weight-bold ">CF-4</h1>
                <h4 class="h4-header mb-0">(Claim Form 4)</h4>
                <h4 class="h4-header font-weight-regular">August 2018</h4>
            </v-col>

            <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="padding-1">
                <v-row wrap justify="end">
                    <label class="h4-header mr-3">Series # &nbsp; </label>
                    <div class="box"></div>
                    <div class="box"></div>
                    <div class="box"></div>
                    <div class="box"></div>
                    <div class="box"></div>
                    <div class="box"></div>
                    <div class="box"></div>
                    <div class="box"></div>
                    <div class="box"></div>
                    <div class="box"></div>
                    <div class="box"></div>
                    <div class="box"></div>
                    <div class="box"></div>
                </v-row>
            </v-col>
        </v-row> 

        <h5 class="h5-header">IMPORTANT REMINDERS: </h5>
        <h5 class="h5-header font-weight-regular" >PLEASE FILL OUT APPROPRIATE FIELDS. WRITE IN CAPITAL LETTERS AND CHECK THE APPROPRIATE BOXES</h5>
        <h5 class="h5-header font-weight-regular" >This form together with other supporting documents should be filed within <b>sixty (60) calendar days </b>from date of discharge</h5>
        <h5 class="h5-header font-weight-regular" >All information, fields and trick boxes required in this form are necessary. <b>Claim forms with incomplete information shall not be processed</b></h5>
        <h5 class="h5-header"><b>FALSE/INCORRECT INFORMATION OR MISREPRESENTATION SHALL BE SUBJECT TO CRIMINAL, CIVIL OR ADMINISTRATIVE LIABILITIES.</b></h5>
    
        <div class="border">
            <h4 class="h4-header text-center bg-grey border-bottom">I. HEALTH CARE INSTITUTION (HCI) INFORMATION </h4>
            <v-row class="px-3 mt-1" wrap>
                <v-col cols="7" class="border-right px-1 pt-1">
                    <h4 class="h4-header">1. Name of HCI</h4>
                    <h5 class="h5-header mt-2 mb-2 mx-2">{{cf4_data_p1.TRANSACTION.provider_name ? cf4_data_p1.TRANSACTION.provider_name : 'N/A'}}</h5>
                </v-col>
                <v-col cols="5" class="px-1 pt-1">
                    <h4 class="h4-header">2. Accreditation Number</h4>
                    <h5 class="h5-header mt-2 mb-2 mx-2">
                    {{cf4_data_p1.TRANSACTION.prov_phic_accreditation_number ? cf4_data_p1.TRANSACTION.prov_phic_accreditation_number : 'N/A'}}
                    </h5>
                </v-col>
                <v-col cols="12" class="border-top px-1 pt-1">
                    <h4 class="h4-header">3. Address</h4>
                    <h5 class="h5-header my-2 mx-2">{{cf4_data_p1.TRANSACTION.provider_address ? cf4_data_p1.TRANSACTION.provider_address : 'N/A'}}</h5>
                </v-col>
                <v-col cols="3" class="border-right border-top border-bottom">
                    <h6 class="small text-center">Bldg No. and Name/Lot/Block</h6>
                </v-col>
                <v-col cols="3" class="border-right border-top border-bottom">
                    <h6 class="small text-center">Street/Subdivision/Village</h6>
                </v-col>
                <v-col cols="3" class="border-right border-top border-bottom">
                    <h6 class="small text-center">Barangay/City/Municipality</h6>
                </v-col>
                <v-col cols="2" class="border-right border-top border-bottom">
                    <h6 class="small text-center">Province</h6>
                </v-col>
                <v-col cols="1" class="border-right border-top border-bottom">
                    <h6 class="small text-center">Zip Code</h6>
                </v-col>
            </v-row>
        
            <h4 class="h4-header text-center bg-grey px-3 mt-3 border-bottom">II. PATIENT’S DATA </h4>
            <v-row class="px-3 mt-1" wrap> <!-- PATIENT DATA -->
                <v-col cols="8" class="border-right" >
                    <v-row wrap style="height:101%">
                        <v-col cols="12" class="px-1 pt-1"> <!--1. NAME OF PATIENT-->
                            <h4 class="h4-header">1. Name of Patient</h4>
                            <h5 class="h5-header mx-2 mb-1">{{cf4_data_p1.PRINCIPAL_DATA.last_name+' '+cf4_data_p1.PRINCIPAL_DATA.first_name+' '+cf4_data_p1.PRINCIPAL_DATA.middle_name}}</h5>
                        </v-col>

                        <v-col cols="4"><h6 class="sub-header font-weight-regular text-center border-top border-right border-bottom">Last Name</h6></v-col>
                        <v-col cols="4"><h6 class="sub-header font-weight-regular text-center border-top border-right border-bottom">First Name</h6></v-col>
                        <v-col cols="4"><h6 class="sub-header font-weight-regular text-center border-top border-bottom">Middle Name</h6></v-col>
                        <v-col cols="12" class="px-1 pt-1"> <!--5.  Chief Complaint-->
                            <h4 class="h4-header">5.  Chief Complaint</h4>
                            <p class="sub-header mx-2 my-2 word-wrap small">{{cf4_data_p1.PATIENT_DATA.chief_complaint ? cf4_data_p1.PATIENT_DATA.chief_complaint : 'N/A'}}</p>
                        </v-col>
                        <v-col cols="12" >
                            <v-row wrap>
                                <!-- <v-col cols="6" class="border-top px-1 pt-1" >
                                    <h4 class="h4-header">6.  Admitting Diagnosis</h4>
                                    <h5 class="sub-header-subtitle mx-2 mt-1 mb-0" >{{cf4_data_p1.ADMISSION_DIAGNOSIS ? cf4_data_p1.ADMISSION_DIAGNOSIS : 'N/A'}}</h5>
                                </v-col> -->
                                <v-col cols="6" class="border-top px-1 pt-1">
                                    <h4 class="h4-header">6. Admitting Diagnosis</h4>
                                    <template v-if="cf4_data_p1 && cf4_data_p1.ADMISSION_DIAGNOSIS && cf4_data_p1.ADMISSION_DIAGNOSIS.length > 0">
                                        <div v-for="(admission, i) in cf4_data_p1.ADMISSION_DIAGNOSIS" :key="i" class="mb-0" style="line-height: 1.05">
                                            <span class="sub-header-subtitle mx-1 my-0 small text-justify">
                                                <b>-</b> 
                                                {{ Array.isArray(admission.icd_description) ? admission.icd_description.join(', ') : admission.icd_description || 'N/A' }}
                                            </span> 
                                        </div>
                                    </template>
                                </v-col>
                                <v-col cols="6" class="border-top border-left word-wrap px-1 pt-1" >
                                    <h4 class="h4-header">7. Discharge Diagnosis</h4>
                                    <template v-if="cf4_data_p1 && cf4_data_p1.DISCHARGED_DIAGNOSIS && cf4_data_p1.DISCHARGED_DIAGNOSIS.PRIMARY && cf4_data_p1.DISCHARGED_DIAGNOSIS.PRIMARY.length > 0">
                                        <div v-for="(discharge,i) in cf4_data_p1.DISCHARGED_DIAGNOSIS.PRIMARY" :key="i" class="mb-0" style="line-height:1.05" >
                                            <span class="sub-header-subtitle mx-1 my-0 small text-justify">
                                                <b>-</b> 
                                                {{ Array.isArray(discharge.icd_description) ? discharge.icd_description.join(', ') : discharge.icd_description || 'N/A' }}
                                            </span> 
                                        </div>
                                    </template>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="4">
                    <v-col cols="12" class="border-bottom px-1 pt-1"> <!-- 2. PIN -->
                        <h4 class="h4-header">2. PIN</h4>
                        <h5 class="h5-header mx-2 my-1">{{cf4_data_p1.PRINCIPAL_DATA.mem_phic_pin ? cf4_data_p1.PRINCIPAL_DATA.mem_phic_pin : 'N/A'}}</h5>
                    </v-col>
                    <v-col cols="12" class="border-bottom px-1 pt-1"> <!--3. Age -->
                        <h4 class="h4-header">3. Age: </h4>
                        <h5 class="h5-header mx-2">{{cf4_data_p1.PRINCIPAL_DATA.age ? cf4_data_p1.PRINCIPAL_DATA.age : 'N/A'}}</h5>
                    </v-col>
                    <v-col cols="12" style="padding-bottom:0.75em"> <!--3. Age -->
                        <v-row class="border-bottom px-1 pt-1" align="baseline" wrap>
                            <h4 class="h4-header mr-12">4. Sex</h4>
                            <input onclick="return false" :checked="cf4_data_p1.PRINCIPAL_DATA.gender ? cf4_data_p1.PRINCIPAL_DATA.gender === 'M' : false" type="checkbox"><label class="sub-header mx-2">Male</label>
                            <input onclick="return false" :checked="cf4_data_p1.PRINCIPAL_DATA.gender ? cf4_data_p1.PRINCIPAL_DATA.gender === 'F' : false" type="checkbox"><label class="sub-header mx-2">Female</label>
                        </v-row>
                    </v-col>
                    <v-col cols="12" class="border-bottom px-1 pt-1"> <!--8. Case Rate A -->
                        <h5 class="h5-header mb-1">8. a. 1st Case Rate Code: <span class="font-weight-regular">{{cf4_data_p1.FIRST_CASE_RATES.first_case_rate_code ? cf4_data_p1.FIRST_CASE_RATES.first_case_rate_code : 'N/A'}}</span></h5>
                    </v-col>
                    <v-col cols="12" class="px-1 pt-1"> <!--8. Case RATE B -->
                        <h5 class="h5-header mb-1">8. b. 2nd Case Rate Code: <span class="font-weight-regular">{{cf4_data_p1.SECOND_CASE_RATES.second_case_rate_code ? cf4_data_p1.SECOND_CASE_RATES.second_case_rate_code : 'N/A'}}</span></h5>
                    </v-col>
                </v-col>

                <v-col cols="12" class="border-top">
                    <v-row class="px-1 py-2" align="center" wrap> <!--4. DATE AND TIME ADMITTED --> 
                        <v-col cols="6"  > <!-- DATE ADMITTED --->
                            <v-row align="baseline" wrap>
                                <h4 class="h4-header mr-2">9. a. Date Admitted</h4>
                                <v-col cols="2">
                                    <v-row wrap>
                                        <v-col cols="6" class="box">{{cf4_data_p1.TRANSACTION.date_admitted ? cf4_data_p1.TRANSACTION.date_admitted.charAt(0) : ''}}</v-col>
                                        <v-col cols="6" class="box">{{cf4_data_p1.TRANSACTION.date_admitted ? cf4_data_p1.TRANSACTION.date_admitted.charAt(1) : ''}}</v-col>
                                        <v-col cols="12" class="small text-center ">Month</v-col>
                                    </v-row>
                                </v-col>
                                <h6 class="sub-header mx-1">-</h6>
                                <v-col cols="2">
                                    <v-row wrap>
                                        <v-col cols="6" class="box">{{cf4_data_p1.TRANSACTION.date_admitted ? cf4_data_p1.TRANSACTION.date_admitted.charAt(3) : ''}}</v-col>
                                        <v-col cols="6" class="box">{{cf4_data_p1.TRANSACTION.date_admitted ? cf4_data_p1.TRANSACTION.date_admitted.charAt(4) : ''}}</v-col>
                                        <v-col cols="12" class="small text-center ">Day</v-col>
                                    </v-row>
                                </v-col>
                                <h6 class="sub-header mx-1">-</h6>
                                <v-col cols="4">
                                    <v-row wrap>
                                        <v-col cols="3" class="box">{{cf4_data_p1.TRANSACTION.date_admitted ? cf4_data_p1.TRANSACTION.date_admitted.charAt(6) : ''}}</v-col>
                                        <v-col cols="3" class="box">{{cf4_data_p1.TRANSACTION.date_admitted ? cf4_data_p1.TRANSACTION.date_admitted.charAt(7) : ''}}</v-col>
                                        <v-col cols="3" class="box">{{cf4_data_p1.TRANSACTION.date_admitted ? cf4_data_p1.TRANSACTION.date_admitted.charAt(8) : ''}}</v-col>
                                        <v-col cols="3" class="box">{{cf4_data_p1.TRANSACTION.date_admitted ? cf4_data_p1.TRANSACTION.date_admitted.charAt(9) : ''}}</v-col>
                                        <v-col cols="12" class="small text-center ">Year</v-col>
                                    </v-row>
                                </v-col>
                            </v-row>   
                        </v-col>
                        <v-col cols="6"> <!-- TIME ADMITTED --->
                            <v-row justify="end" align="baseline" wrap>
                                <h4 class="h4-header mr-2">9. b. Time Admitted</h4>
                                <v-col cols="4">
                                    <v-row wrap>
                                        <v-col cols="6">
                                            <h6 class="box_no_top font-weight-regular" :class="{'white--text' : cf4_data_p1.TRANSACTION.time_admitted.time_am === '00:00'}">{{cf4_data_p1.TRANSACTION.time_admitted.time_am}}</h6>
                                            <h6 class="small font-weight-regular text-center">hh mm</h6>
                                        </v-col>
                                        <v-col cols="6" class="font-data font-weight-bold px-1">Am</v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="4">
                                    <v-row wrap>
                                        <v-col cols="6">
                                            <h6 class="box_no_top font-weight-regular" :class="{'white--text' : cf4_data_p1.TRANSACTION.time_admitted.time_pm === '00:00'}">{{cf4_data_p1.TRANSACTION.time_admitted.time_pm}}</h6>
                                            <h6 class="small font-weight-regular text-center">hh mm</h6>
                                        </v-col>
                                        <v-col cols="6" class="font-data font-weight-bold px-1">PM</v-col>
                                    </v-row>
                                </v-col>
                            </v-row>   
                        </v-col>
                    </v-row>
                </v-col>   
                
                <v-col cols="12" class="border-top">
                    <v-row align="center" class="px-1 py-2" wrap> <!--5. DATE AND TIME DISCHARGE --> 
                        <v-col cols="6"  > <!-- DATE ADMITTED --->
                            <v-row align="baseline" wrap>
                                <h4 class="h4-header mr-1">10. a. Date Discharged</h4>
                                <v-col cols="2" >
                                    <v-row wrap>
                                        <v-col cols="6" class="box">{{cf4_data_p1.PATIENT_DATA.date_discharged ? cf4_data_p1.PATIENT_DATA.date_discharged.charAt(0) : ''}}</v-col>
                                        <v-col cols="6" class="box">{{cf4_data_p1.PATIENT_DATA.date_discharged ? cf4_data_p1.PATIENT_DATA.date_discharged.charAt(1) : ''}}</v-col>
                                        <v-col cols="12" class="small text-center">Month</v-col>
                                    </v-row>
                                </v-col>
                                <h6 class="sub-header">-</h6>
                                <v-col cols="2">
                                    <v-row wrap>
                                        <v-col cols="6" class="box">{{cf4_data_p1.PATIENT_DATA.date_discharged ? cf4_data_p1.PATIENT_DATA.date_discharged.charAt(3) : ''}}</v-col>
                                        <v-col cols="6" class="box">{{cf4_data_p1.PATIENT_DATA.date_discharged ? cf4_data_p1.PATIENT_DATA.date_discharged.charAt(4) : ''}}</v-col>
                                        <v-col cols="12" class="small text-center">Day</v-col>
                                    </v-row>
                                </v-col>
                                <h6 class="sub-header">-</h6>
                                <v-col cols="4">
                                    <v-row wrap>
                                        <v-col xl3 lg3 sm3 xs3 class="box">{{cf4_data_p1.PATIENT_DATA.date_discharged ? cf4_data_p1.PATIENT_DATA.date_discharged.charAt(6) : ''}}</v-col>
                                        <v-col xl3 lg3 sm3 xs3 class="box">{{cf4_data_p1.PATIENT_DATA.date_discharged ? cf4_data_p1.PATIENT_DATA.date_discharged.charAt(7) : ''}}</v-col>
                                        <v-col xl3 lg3 sm3 xs3 class="box">{{cf4_data_p1.PATIENT_DATA.date_discharged ? cf4_data_p1.PATIENT_DATA.date_discharged.charAt(8) : ''}}</v-col>
                                        <v-col xl3 lg3 sm3 xs3 class="box">{{cf4_data_p1.PATIENT_DATA.date_discharged ? cf4_data_p1.PATIENT_DATA.date_discharged.charAt(9) : ''}}</v-col>
                                        <v-col cols="12" class="small text-center">Year</v-col>
                                    </v-row>
                                </v-col>
                            </v-row>   
                        </v-col>
                        <v-col cols="6"> <!-- TIME ADMITTED --->
                            <v-row align="baseline" justify="end" wrap>
                                <h4 class="h4-header mr-2">10. b. Time Discharged</h4>
                                <v-col cols="4">
                                    <v-row wrap>
                                        <v-col cols="6">
                                            <h6 class="box_no_top font-weight-regular" :class="{'white--text' : cf4_data_p1.TRANSACTION.time_discharged.time_am === '00:00'}">{{cf4_data_p1.TRANSACTION.time_discharged.time_am}}</h6>
                                            <h6 class="small font-weight-regular text-center">hh mm</h6>
                                        </v-col>
                                        <v-col cols="6" class="font-data font-weight-bold px-1">Am</v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="4">
                                    <v-row wrap>
                                        <v-col cols="6">
                                            <h6 class="box_no_top font-weight-regular" :class="{'white--text' : cf4_data_p1.TRANSACTION.time_discharged.time_pm === '00:00'}">{{cf4_data_p1.TRANSACTION.time_discharged.time_pm}}</h6>
                                            <h6 class="small font-weight-regular text-center">hh mm</h6>
                                        </v-col>
                                        <v-col cols="6" class="font-data font-weight-bold px-1">PM</v-col>
                                    </v-row>
                                </v-col>
                            </v-row>   
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
    
            <h4 class="h4-header text-center bg-grey border-top border-bottom py-1">III. REASON FOR ADMISSION </h4>
            <v-row class="px-3 mt-1" wrap > <!--REASON FOR ADMISSION--> 
                <v-col cols="12" class="border-bottom height-medium px-1 pt-1" > <!-- 1. History of present Illness-->
                    <h4 class="h4-header">1. History of Present Illness:</h4>
                    <p class="small word-wrap mb-0">{{cf4_data_p1.PATIENT_DATA.illness_hstry ? cf4_data_p1.PATIENT_DATA.illness_hstry : 'N/A'}}</p>
                </v-col>

                <v-col cols="12" class="height-small px-1 pt-1" > <!-- 2.a. Pertinent Past Medical History: -->
                    <h4 class="h4-header">2.a. Pertinent Past Medical History:</h4>
                    <p class="small word-wrap pb-0">{{cf4_data_p1.PATIENT_DATA.prt_past_med_hstry ? cf4_data_p1.PATIENT_DATA.prt_past_med_hstry : 'N/A'}}</p>
                </v-col>

                <v-col cols="12" class="border-bottom px-1 pt-1 pb-3" > <!-- 2.a. Pertinent Past Medical History: -->
                    <h4 class="h4-header mb-1">2.b.  OB/GYN History</h4>
                    <v-row class="px-3 mt-1" align="center" wrap>
                        <h6 class="font-data">G:</h6>
                        <v-col cols="1" class="px-2">
                            <h6 class="sub-header border-bottom font-data">{{cf4_data_p1.OB_GYNE.obg_gravidity ? cf4_data_p1.OB_GYNE.obg_gravidity : 'N/A'}}</h6>
                        </v-col>
                        <h6 class="font-data">P:</h6>
                        <v-col cols="1" class="px-2">
                            <h6 class="sub-header border-bottom font-data">{{cf4_data_p1.OB_GYNE.obg_parity ? cf4_data_p1.OB_GYNE.obg_parity : 'N/A'}}</h6>
                        </v-col>
                        <h6>(</h6>
                        <v-col cols="1" class="px-2">
                            <h6 class="sub-header border-bottom font-data">{{cf4_data_p1.OB_GYNE.obg_term ? cf4_data_p1.OB_GYNE.obg_term : 'N/A'}}</h6>
                        </v-col>
                        <h6>-</h6>
                        <v-col cols="1" class="px-2">
                            <h6 class="sub-header border-bottom font-data">{{cf4_data_p1.OB_GYNE.obg_preterm ? cf4_data_p1.OB_GYNE.obg_preterm : 'N/A'}}</h6>
                        </v-col>
                        <h6>-</h6>
                        <v-col cols="1" class="px-2">
                            <h6 class="sub-header border-bottom font-data">{{cf4_data_p1.OB_GYNE.abortions ? cf4_data_p1.OB_GYNE.abortions : 'N/A'}}</h6>
                        </v-col>
                        <h6>-</h6>
                        <v-col cols="1" class="px-2">
                            <h6 class="sub-header border-bottom font-data">{{cf4_data_p1.OB_GYNE.obg_living ? cf4_data_p1.OB_GYNE.obg_living : 'N/A'}}</h6>
                        </v-col>
                        <h6 class="sub-header mr-2">)</h6>
                        <h6 class="sub-header">LMP:</h6>
                        <v-col cols="1" class="px-2">
                            <h6 class="sub-header border-bottom">{{cf4_data_p1.PATIENT_DATA.lmp ? cf4_data_p1.PATIENT_DATA.lmp : 'N/A'}}</h6>
                        </v-col>

                        <input onclick="return false" type="checkbox"><label class="font-data mx-2">N/A</label>
                    </v-row>
                </v-col>

                <v-col cols="12" class="px-1 pt-1"> <!--3. Pertinent Signs and Symptoms on Admission (tick applicable box/es):-->
                    <h4 class="h4-header mb-3">3. Pertinent Signs and Symptoms on Admission (tick applicable box/es):</h4>
                    <v-row class="px-5 mb-2 mt-1" wrap>
                        <v-col v-for="(pert,i) in cf4_data_p1.SYMPTOMS" :key="i" cols="3">
                            <v-row class="mb-3" wrap>
                                <input v-model="cf4_data_p1.SYMPTOMS" :checked="pert.symptom" onclick="return false" type="checkbox"  >
                                <h5 class="h5-header mx-2">{{pert.symptom === 'Others' ? pert.symptom + ' _________________': pert.symptom}}</h5>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" class="border-bottom border-top px-1 pt-1" > <!-- 4. Referred from another health care institution (HCI):-->
                    <v-row justify="space-between" class="py-5" wrap>
                        <v-col cols="5">
                            <h4 class="h4-header">4. Referred from another health care institution (HCI):</h4>
                        </v-col>
                        <v-col cols="5">
                            <v-row align="start" wrap >
                                <input onclick="return false" :checked="cf4_data_p1.PATIENT_DATA.is_referred ? cf4_data_p1.PATIENT_DATA.is_referred === 'NO' : false" type="checkbox">
                                <h6 class="sub-header ml-1 mr-2">NO</h6>
                                <input onclick="return false" :checked="cf4_data_p1.PATIENT_DATA.is_referred ? cf4_data_p1.PATIENT_DATA.is_referred === 'YES' : false" type="checkbox">
                                <h6 class="sub-header ml-1 mr-2">Yes,</h6>
                                <v-col cols="9">
                                    <v-row class="mb-2" wrap>
                                        <h5 class="sub-header mr-1">Specify reason:</h5>
                                        <h5 class="sub-header border-bottom word-wrap" style="width:60%">{{ cf4_data_p1.PATIENT_DATA.reason_for_referral_admission ? cf4_data_p1.PATIENT_DATA.reason_for_referral_admission : 'N/A' }}</h5>
                                    </v-row>
                                    <v-row wrap>
                                        <h5 class="sub-header mr-1">Name of Originating HCI:</h5>
                                        <h5 class="sub-header border-bottom word-wrap" style="width:50%">{{cf4_data_p1.PATIENT_DATA.originating_provider ? cf4_data_p1.PATIENT_DATA.originating_provider : 'N/A'}}</h5>
                                        
                                    </v-row>
                                </v-col>
                                
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" class="px-1 pt-1"> <!-- 5.  Physical Examination on Admission (Pertinent Findings per System)-->
                    <h4 class="h4-header">5. Physical Examination on Admission (Pertinent Findings per System)</h4>
                    <v-col cols="12" class="pa-2">
                        <v-row class="mb-3" wrap><!-- GENERAL SURVEY --> 
                            <v-col cols="3">
                                <h5 class="h5-header font-weight-regular">General Survey</h5>
                            </v-col>
                            <v-col cols="9">
                                <v-row class="mt-1" align="center" wrap>
                                    <input onclick="return false" :checked="cf4_data_p1.PE_DATA.general_survey ? cf4_data_p1.PE_DATA.general_survey === 'AWAKE AND ALERT' : false" type="checkbox"><h5 class="h5-header ml-1 mr-6">Awake and alert</h5>
                                    <input onclick="return false" :checked="cf4_data_p1.PE_DATA.general_survey ? cf4_data_p1.PE_DATA.general_survey === 'ALTERED SENSORIUM' : false" type="checkbox"><h5 class="h5-header ml-1 mr-5">Altered sensorium:</h5>
                                    <h5 class="h5-header border-bottom white--text mx-2" style="width:30%">N/A</h5>
                                    <div class="sub-header"  style="border:1px solid">
                                        <v-row class="mx-2 mt-1" align="center" dense>
                                            <h5 class="sub-header font-weight-regular">Height</h5>
                                            <v-col cols="4" class="mx-1"><h5 class="sub-header border-bottom">{{cf4_data_p1.PE_DATA.height ? cf4_data_p1.PE_DATA.height : 'N/A'}}(cm)</h5></v-col>
                                        </v-row>
                                        <v-row class="mx-2 mb-1" align="center" dense>
                                            <h5 class="sub-header font-weight-regular">Weight</h5>
                                            <v-col class="mx-1"><h5 class="sub-header border-bottom">{{cf4_data_p1.PE_DATA.weight ? cf4_data_p1.PE_DATA.weight :'N/A'}}(kg)</h5></v-col>
                                        </v-row>
                                    </div>
                                </v-row>
                            </v-col>
                        </v-row>

                        <v-row align="center" class="mb-3" wrap> <!-- VITAL SIGNS--> 
                            <v-col cols="3">
                                <h5 class="h5-header font-weight-regular">Vital Signs: </h5>
                            </v-col>
                            <v-col cols="6">
                                <v-row align="center" wrap>
                                    <h5 class="sub-header">BP</h5>
                                    <v-col cols="2" class="mx-1"><h5 class="sub-header border-bottom">{{cf4_data_p1.PE_DATA.vital_sign_bp ? cf4_data_p1.PE_DATA.vital_sign_bp : 'N/A'}}</h5></v-col>
                                    <h5 class="sub-header">HR</h5>
                                    <v-col  cols="2" class="mx-1"><h5 class="sub-header border-bottom">{{cf4_data_p1.PE_DATA.vital_sign_cr ? cf4_data_p1.PE_DATA.vital_sign_cr :'N/A'}}</h5></v-col>
                                    <h5 class="sub-header">RR</h5>
                                    <v-col  cols="2" class="mx-1"><h5 class="sub-header border-bottom">{{cf4_data_p1.PE_DATA.vital_sign_rr ? cf4_data_p1.PE_DATA.vital_sign_rr : 'N/A'}}</h5></v-col>
                                    <h5 class="sub-header">Temp</h5>
                                    <v-col  cols="2" class="mx-1"><h5 class="sub-header border-bottom">{{cf4_data_p1.PE_DATA.vital_sign_temp ? cf4_data_p1.PE_DATA.vital_sign_temp : 'N/A'}}</h5></v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                        <v-row align="center" class="mb-3" wrap> <!-- HEENT-->
                            <v-col cols="3">
                                <h6 class="sub-header font-weight-regular">HEENT</h6>
                            </v-col>
                            <v-col cols="9">
                                <v-row wrap>
                                    <v-col v-for="(heent,i) in cf4_data_p1.PE_DATA.pe_heent" :key="i" cols="3">
                                        <v-row wrap>
                                            <input v-model="cf4_data_p1.PE_DATA.pe_heent" :checked="!!heent.assessment"  onclick="return false" type="checkbox">
                                            <h6 class="sub-header ml-1 mr-0 mb-2" style="width:80%">{{heent.assessment}}</h6>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row align="center" wrap>
                                    <h6 class="sub-header mr-1">Others:</h6>
                                    <h6 class="sub-header border-bottom white--text" style="width:30%">N/A</h6>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
export default {
  props: ["menu","cf4_data_p1"],
};
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
    border-left:1px solid black;
    border-right:1px solid black;
    border-bottom:1px solid black;
    font-size:10pt;
    text-align: center;
    /* height:18px; */
}
.box_top{
    border-left:1px solid black;
    border-right:1px solid black;
    border-bottom:1px solid black;
    font-size:10pt;
    text-align: center;
  }
.cf4_test {
  padding-top: 3em;
  padding-left: 2.35em !important;
  padding-right: 2.55em !important;
}



.h4-header {
  font-size: 11.5pt;
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
.font-data {
  font-size: 9pt;
}
.image_logo {
  width: 200px;
  height: 70px;
}

.small {
  font-size: 8pt;
}
.sub-header{
  font-size: 8pt;
}

.word-wrap {
  word-wrap: break-word;
}

@media print {
  .cf4_test {
    padding: 0.25em 0 0 !important;
  }
  
  
  .h4-header,
  .font-data {
    font-size: 7pt !important;
  }
  
  .h5-header {
    font-size: 6.5pt;
  }
  .height-small,
  .height-medium{
    height:6vh
  }
  
  .sub-header,
  .box_no_top,
  .small {
    font-size: 6pt;
  }
}
</style>