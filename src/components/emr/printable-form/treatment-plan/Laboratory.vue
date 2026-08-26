<template>
    <v-card id="for-print-relative" class="px-2" flat >
        <div class="pa-8" v-if="$route.name === 'EMRConsultationTypeA'">
            <v-sheet v-if="print_option === 'both' || print_option === 'lab_only'"> 
                <Header :is_treatment_plan="true"/>

                <v-row align="center" dense> 
                    <v-col cols="12" xs="12" sm="12" md="12" lg="12">
                        
                        <v-row v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'" class="d-flex justify-end" dense> 
                            <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                                <label class="body-2 font-weight-medium">Date:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.date_admitted }}</span>
                            </v-col>
                        </v-row>
                        <v-row v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'" dense>
                            <v-col class="d-flex align-baseline" cols="12" xs="6" sm="6" md="6" lg="6">
                                <label class="body-2 font-weight-medium">Name:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.patient_name }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="3" sm="3" md="3" lg="3"> 
                                <label class="body-2 font-weight-medium">Age:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.patient_age }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="3" sm="3" md="3" lg="3"> 
                                <label class="body-2 font-weight-medium">Sex:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.patient_sex }}</span>
                            </v-col>
                        </v-row>
                        <v-row v-else class="mt-5" dense>
                            <v-col class="d-flex align-baseline" cols="12" xs="8" sm="8" md="8" lg="8">
                                <label class="body-2 font-weight-medium">Name:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.patient_name }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                                <label class="body-2 font-weight-medium">Date:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.date_admitted }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="8" sm="8" md="8" lg="8">
                                <label class="body-2 font-weight-medium">Address:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.patient_address }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4"> 
                                <label class="body-2 font-weight-medium">Age:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.patient_age }}</span>
                            </v-col>
                        </v-row>
                        <v-col v-if="print_option === 'pres_only'" class="ml-n4" cols="12" xs="1" sm="1" md="1" lg="1">
                            <v-img src="@/assets/rx.png" class="mt-9" width="100%" max-width="80" contain></v-img>
                        </v-col>
                    </v-col>
                </v-row>
                
                <template v-if="show_management_doctor_notes"> 
                    <div v-if="select_management.length >= 1" class="font-weight-medium body-2">
                        <h6 class="font-weight-medium body-2 mt-4"> Management Type  </h6>
                        <div v-for="(management, key) in select_management" :key="key"> 
                            <span class="body-2 pl-4 pb-2"> {{ management.management_description }} </span> 
                        </div>
                    </div> 

                    <div v-if="doctor_notes" class="font-weight-medium body-2">
                        <h6 class="font-weight-medium body-2 mt-4">Doctor Notes </h6>
                        <span class="body-2 pl-4 pb-2"> {{ doctor_notes }} </span> 
                    </div>
                </template>
                    
                <div v-if="follow_up_consultation_date" class="font-weight-medium body-2">
                    <h6 class="font-weight-medium body-2 mt-4"> 
                        Follow up date:
                        <span class="font-weight-bold blue--text text--darken-4">{{ follow_up_date }}</span>
                    </h6>
                </div>

                <div v-if="print_option === 'both' || print_option === 'lab_only'">
                    <h4 class="font-weight-medium mt-3 pb-1 lab-info">LABORATORY REQUEST</h4>
                    <div v-for="(icd, icd_index) in data.selected_icd" :key="icd_index">
                        <h5 v-for="(cpt, cpt_index) in icd.procedures" :key="cpt_index" class="font-weight-medium body-2 pl-2 lab-info">
                            <template v-if="cpt.cpt_code >= 70010 || cpt.cpt_code <= 76499 && cpt.cpt_code >= 80047 || cpt.cpt_code <= 89398 && cpt.cpt_code >= 93224 || cpt.cpt_code <= 93278 || cpt.cpt_code === '0178T' && cpt.cpt_code === '0179T' && cpt.cpt_code === '0180T' && cpt.cpt_code === '0206T' && cpt.cpt_code === '3120F' && cpt.cpt_code >= 93880 || cpt.cpt_code <= 93998" > 
                                <template v-if="cpt && cpt.modifier"> 
                                    {{ cpt.cpt_code }} / {{ cpt.cpt_description_long }}
                                    <span v-if="cpt.modifier.mod_description"> {{ " - " + cpt.modifier.mod_description }} </span>
                                </template>
                                <template v-else> 
                                    {{ cpt.cpt_code }} / {{ cpt.cpt_description_long }}
                                </template>
                            </template>
                            <template v-else> 
                                <span> </span>
                            </template>
                        </h5>
                    </div>
                </div>
                
                <v-row :class="[print_option === 'lab_only' ? 'pt-16' : 'pt-6']" dense>
                    <v-col cols="12" sm="8" md="8" lg="8" xl="8" class="">
                        <!-- Treatment Plan Certificate QR Code Section -->
                        <v-sheet id="treatmentplan-certificate" class="qr-code-med" style="box-shadow: none; border: none;">
                            <QrcodeVue :value="treatmentplan_qr_value" :size="100" level="L" renderAs="svg" />
                        </v-sheet>
                        <div v-if="print_option !== 'both'" class="font-weight-medium body-2">
                            <!-- <h6 class="font-weight-medium body-2 mt-4">Print Option</h6> -->
                            <h6 class="font-weight-light body-2 mt-2 print-option-font-size "> 
                                {{ print_option === 'pres_only' ? 'PRESCRIPTION ONLY' : print_option === 'lab_only' ? 'LAB REQUEST ONLY' : '' }}
                            </h6>
                        </div>
                    </v-col>

                    <v-col cols="12" sm="3" lg="3" xl="3" align-self="end" class="text-center">
                        <v-sheet v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'"> 
                            <h4 class="font-weight-medium text-no-wrap">{{ data.doctor_name }}</h4>
                            <h5 class="font-weight-medium text-no-wrap">License No: {{ data.doctor_prc_license }}</h5>
                            <h5 class="font-weight-medium text-no-wrap">{{ data.doctor_position }}</h5>
                            <h5 class="font-weight-medium text-no-wrap">{{ data.doctor_specialization }}</h5>
                        </v-sheet>
                        <v-sheet v-else> 
                            <h4 class="font-weight-medium text-no-wrap">{{ data.doctor_name }}</h4>
                            <h4 class="font-weight-medium text-no-wrap">Lic.#: {{ data.doctor_prc_license }}</h4>
                            <h5 class="font-weight-medium text-no-wrap mt-1 mb-5">DOCTOR</h5>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-sheet>
        </div>

        <div v-else class="pa-8" >  
            <v-sheet> 
                <Header :is_treatment_plan="true"/>

                <v-row align="center" dense> 
                    <v-col cols="12" xs="12" sm="12" md="12" lg="12">
                        
                        <v-row v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'" class="d-flex justify-end" dense> 
                            <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                                <label class="body-2 font-weight-medium">Date:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.date_admitted }}</span>
                            </v-col>
                        </v-row>
                        <v-row v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'" dense>
                            <v-col class="d-flex align-baseline" cols="12" xs="6" sm="6" md="6" lg="6">
                                <label class="body-2 font-weight-medium">Name:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.patient_name }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="3" sm="3" md="3" lg="3"> 
                                <label class="body-2 font-weight-medium">Age:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.patient_age }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="3" sm="3" md="3" lg="3"> 
                                <label class="body-2 font-weight-medium">Sex:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.patient_sex }}</span>
                            </v-col>
                        </v-row>
                        <v-row v-else class="mt-5" dense>
                            <v-col class="d-flex align-baseline" cols="12" xs="8" sm="8" md="8" lg="8">
                                <label class="body-2 font-weight-medium">Name:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.patient_name }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                                <label class="body-2 font-weight-medium">Date:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.date_admitted }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="8" sm="8" md="8" lg="8">
                                <label class="body-2 font-weight-medium">Address:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.patient_address }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4"> 
                                <label class="body-2 font-weight-medium">Age:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ data.patient_age }}</span>
                            </v-col>
                        </v-row>
                        <v-col v-if="print_option === 'pres_only'" class="ml-n4" cols="12" xs="1" sm="1" md="1" lg="1">
                            <v-img src="@/assets/rx.png" class="mt-9" width="100%" max-width="80" contain></v-img>
                        </v-col>
                    </v-col>
                </v-row>
                
                <template v-if="show_management_doctor_notes"> 
                    <div v-if="select_management.length >= 1" class="font-weight-medium body-2">
                        <h6 class="font-weight-medium body-2 mt-4"> Management Type  </h6>
                        <div v-for="(management, key) in select_management" :key="key"> 
                            <span class="body-2 pl-4 pb-2"> {{ management.management_description }} </span> 
                        </div>
                    </div> 

                    <div v-if="doctor_notes" class="font-weight-medium body-2">
                        <h6 class="font-weight-medium body-2 mt-4">Doctor Notes </h6>
                        <span class="body-2 pl-4 pb-2"> {{ doctor_notes }} </span> 
                    </div>
                </template>
                    
                <div v-if="follow_up_consultation_date" class="font-weight-medium body-2">
                    <h6 class="font-weight-medium body-2 mt-4"> 
                        Follow up date:
                        <span class="font-weight-bold blue--text text--darken-4">{{ follow_up_date }}</span>
                    </h6>
                </div>

                <div v-if="print_option === 'both' || print_option === 'lab_only'">
                    <h4 class="font-weight-medium mt-6 pb-1">LABORATORY REQUEST</h4>
                    <div v-for="(icd, icd_index) in data.selected_icd" :key="icd_index">
                        <h5 v-for="(cpt, cpt_index) in icd.procedures" :key="cpt_index" class="font-weight-medium body-1 pl-2 pt-1">
                            <template v-if="cpt.cpt_code >= 70010 || cpt.cpt_code <= 76499 && cpt.cpt_code >= 80047 || cpt.cpt_code <= 89398 && cpt.cpt_code >= 93224 || cpt.cpt_code <= 93278 || cpt.cpt_code === '0178T' && cpt.cpt_code === '0179T' && cpt.cpt_code === '0180T' && cpt.cpt_code === '0206T' && cpt.cpt_code === '3120F' && cpt.cpt_code >= 93880 || cpt.cpt_code <= 93998" > 
                                <template v-if="cpt && cpt.modifier"> 
                                    {{ cpt.cpt_code }} / {{ cpt.cpt_description_long }}
                                    <span v-if="cpt.modifier.mod_description"> {{ " - " + cpt.modifier.mod_description }} </span>
                                </template>
                                <template v-else> 
                                    {{ cpt.cpt_code }} / {{ cpt.cpt_description_long }}
                                </template>
                            </template>
                            <template v-else> 
                                <span> </span>
                            </template>
                        </h5>
                    </div>
                </div>
                
                <v-row :class="[print_option === 'lab_only' ? 'pt-16' : 'pt-6']" dense>
                    <v-col cols="12" sm="9" md="9" lg="9" xl="9" class="">
                        <!-- Treatment Plan Certificate QR Code Section -->
                        <v-sheet id="treatmentplan-certificate" class="qr-code-med" style="box-shadow: none; border: none;">
                            <QrcodeVue :value="treatmentplan_qr_value" :size="120" level="L" renderAs="svg" />
                        </v-sheet>
                    </v-col>

                    <v-col cols="3" sm="3" md="3" lg="3" xl="3" align-self="center" class="text-center">
                        <v-sheet v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'"> 
                            <h4 class="font-weight-medium text-no-wrap">{{ data.doctor_name }}</h4>
                            <h5 class="font-weight-medium text-no-wrap">License No: {{ data.doctor_prc_license }}</h5>
                            <h5 class="font-weight-medium">{{ data.doctor_position }}</h5>
                            <h5 class="font-weight-medium">{{ data.doctor_specialization }}</h5>
                        </v-sheet>
                        <v-sheet v-else> 
                            <h4 class="font-weight-medium text-no-wrap">{{ data.doctor_name }}</h4>
                            <h4 class="font-weight-medium text-no-wrap">Lic. #: {{ data.doctor_prc_license }}</h4>
                            <h5 class="font-weight-medium mt-1 mb-5">DOCTOR</h5>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-sheet>
        </div>
    </v-card>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import Header from '@/components/emr/printable-form/Header.vue';

export default {
    props: ['selected_medicine', 'patient_name', 'data', 'follow_up_consultation_date', 'follow_up_date', 'treatmentplan_qr_value', 'show_management_doctor_notes', 'doctor_notes' , 'select_management', 'print_option'],

    components: {
        Header,
        QrcodeVue,
    },

    data() {
       return {
            show_dialog: false,
            // print_option: 'both',
            is_treatment_plan: '',
            // follow_up_consultation_date:''
       } 
    }
}
</script>

<style scoped>
.print-pat-info{
    border-bottom: 1px solid grey; 
    margin: 14px 0 0 4px; 
    padding: 2px 0 0 0; 
    width: 100%;
}
.print-med-tbl-main{ overflow-x: auto; }
.print-med-tbl-main .d-flex{
    width: 100%;
    padding: 0;
    margin: 0; 
}
.print-med-tbl-h{
    /* font-size: 12px; */
    width: 250px;
}
.print-med-tbl-b{
    /* font-size: 12px; */
    padding: 2px 0 0 2px;
    width: 100%;
    text-align: center;
}
.print-option-font-size {
    font-size: 8pt !important ; 
    font-style: italic ;  
}
.print-border-bottom{ background: grey !important; }
@media screen {
    body { font-size: 13pt }
}
@media screen, print {
    body { line-height: 1.0 }
}
/* @media print{
    body *{
        background: white;
        position: relative;
    }
    #for-print-absolute{
        left: 0;
        position: absolute !important; 
        top: 0;
    }
    ::v-deep .v-dialog {
        box-shadow: none;
    }
    #for-print {
        width: 100%;
        padding: 30px 20px 0px 0px !important;
    } 
    #for-print-treatment {
        width: 100%;
    }
    #for-print-treatment-dispensing {
        width: 100%;
        margin-left: -100px !important;
    }
    .print-med-tbl-main{ overflow-x: hidden; }   
    .print-med-tbl-h, .print-med-tbl-b{
        width: 100%;
        padding: 2px 2px 0 0;
    }
    .pagebreak {
         page-break-before: always; 
         margin-top: 5rem;
    }
    ::v-deep #not-for-print {
        display: none !important;
    }
    ::v-deep .v-dialog {
        box-shadow: none;
    }
    .font-weight-medium{
        font-size: 11pt !important ;
        text-wrap: nowrap;
    }
    .print-option-font-size {
        font-size: 8pt !important ; 
        font-style: italic !important;  
    }
} */

 @media print {

    @page {
        size: auto;
        margin: 8mm;
    }

    html, body {
        background: white;
        margin: 0 !important;
        padding: 0 !important;
    }

    #not-for-print {
        display: none !important;
    }

    .v-row{
        margin-top: 0 !important;
    }

    .pa-8{
        padding: 10px !important;
    }
}
</style>