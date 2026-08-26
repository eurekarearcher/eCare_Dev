<template>
    <v-dialog v-model="show_dialog" width="1400" persistent>
        <div id="for-print-absolute">
            <v-card id="for-print-relative" class="px-8 pt-8" flat >
                <div class="pa-8" id="for-print-treatment"> 
                    <v-sheet  v-if="print_option === 'both' || print_option === 'lab_only'"> 
                        <Header :is_treatment_plan="true"/>

                        <v-row align="center" dense> 
                            <v-col cols="12" xs="12" sm="12" md="12" lg="12">
                                
                                <v-row v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'" class="d-flex justify-end" dense> 
                                    <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                                        <label class="body-2 font-weight-medium">Date:</label>
                                        <span class="body-2 print-pat-info">{{ data.date_admitted }}</span>
                                    </v-col>
                                </v-row>
                                <v-row v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'" dense>
                                    <v-col class="d-flex align-baseline" cols="12" xs="6" sm="6" md="6" lg="6">
                                        <label class="body-2 font-weight-medium">Name:</label>
                                        <span class="body-2 print-pat-info">{{ data.patient_name }}</span>
                                    </v-col>
                                    <v-col class="d-flex align-baseline" cols="12" xs="3" sm="3" md="3" lg="3"> 
                                        <label class="body-2 font-weight-medium">Age:</label>
                                        <span class="body-2 print-pat-info">{{ data.patient_age }}</span>
                                    </v-col>
                                    <v-col class="d-flex align-baseline" cols="12" xs="3" sm="3" md="3" lg="3"> 
                                        <label class="body-2 font-weight-medium">Sex:</label>
                                        <span class="body-2 print-pat-info">{{ data.patient_sex }}</span>
                                    </v-col>
                                </v-row>
                                <v-row v-else class="mt-5" dense>
                                    <v-col class="d-flex align-baseline" cols="12" xs="8" sm="8" md="8" lg="8">
                                        <label class="body-2 font-weight-medium">Name:</label>
                                        <span class="body-2 print-pat-info">{{ data.patient_name }}</span>
                                    </v-col>
                                    <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                                        <label class="body-2 font-weight-medium">Date:</label>
                                        <span class="body-2 print-pat-info">{{ data.date_admitted }}</span>
                                    </v-col>
                                    <v-col class="d-flex align-baseline" cols="12" xs="8" sm="8" md="8" lg="8">
                                        <label class="body-2 font-weight-medium">Address:</label>
                                        <span class="body-2 print-pat-info">{{ data.patient_address }}</span>
                                    </v-col>
                                    <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4"> 
                                        <label class="body-2 font-weight-medium">Age:</label>
                                        <span class="body-2 print-pat-info">{{ data.patient_age }}</span>
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

                            <v-col cols="12" sm="3" lg="3" xl="3" align-self="end" class="text-center">
                                <v-sheet v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'"> 
                                    <h4 class="font-weight-medium">{{ data.doctor_name }}</h4>
                                    <h5 class="font-weight-medium">License No: {{ data.doctor_prc_license }}</h5>
                                    <h5 class="font-weight-medium">{{ data.doctor_position }}</h5>
                                    <h5 class="font-weight-medium">{{ data.doctor_specialization }}</h5>
                                </v-sheet>
                                <v-sheet v-else> 
                                    <h4 class="font-weight-medium">{{ data.doctor_name }}</h4>
                                    <h4 class="font-weight-medium border-bottom">Lic. #: {{ data.doctor_prc_license }}</h4>
                                    <h5 class="font-weight-medium mt-1 mb-5">DOCTOR</h5>
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </v-sheet>

                    <v-divider v-if="print_option === 'both'" class="my-8"> </v-divider>
                
                    <v-sheet v-if="print_option === 'both' || print_option === 'pres_only'" :class="(data.selected_icd[0] && data.selected_icd[0].procedures.length >= 5) || data.selected_medicine.length >= 5 && (this.show_management_doctor_notes || this.follow_up_consultation_date) ? 'pagebreak' : ''"> 
                        <Header :is_treatment_plan="true" />
                        <v-row align="center" dense>
                            <v-col cols="12" xs="12" sm="12" md="12" lg="12">
                                <v-row v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'" class="d-flex justify-end" dense> 
                                    <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                                        <label class="body-2 font-weight-medium">Date:</label>
                                        <span class="body-2 print-pat-info">{{ data.date_admitted }}</span>
                                    </v-col>
                                </v-row>
                                <v-row v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'" dense>
                                    <v-col class="d-flex align-baseline" cols="12" xs="6" sm="6" md="6" lg="6">
                                        <label class="body-2 font-weight-medium">Name:</label>
                                        <span class="body-2 print-pat-info">{{ data.patient_name }}</span>
                                    </v-col>
                                    <v-col class="d-flex align-baseline" cols="12" xs="3" sm="3" md="3" lg="3"> 
                                        <label class="body-2 font-weight-medium">Age:</label>
                                        <span class="body-2 print-pat-info">{{ data.patient_age }}</span>
                                    </v-col>
                                    <v-col class="d-flex align-baseline" cols="12" xs="3" sm="3" md="3" lg="3"> 
                                        <label class="body-2 font-weight-medium">Sex:</label>
                                        <span class="body-2 print-pat-info">{{ data.patient_sex }}</span>
                                    </v-col>
                                </v-row>
                                <v-row v-else class="mt-5" dense>
                                    <v-col class="d-flex align-baseline" cols="12" xs="8" sm="8" md="8" lg="8">
                                        <label class="body-2 font-weight-medium">Name:</label>
                                        <span class="body-2 print-pat-info">{{ data.patient_name }}</span>
                                    </v-col>
                                    <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                                        <label class="body-2 font-weight-medium">Date:</label>
                                        <span class="body-2 print-pat-info">{{ data.date_admitted }}</span>
                                    </v-col>
                                    <v-col class="d-flex align-baseline" cols="12" xs="8" sm="8" md="8" lg="8">
                                        <label class="body-2 font-weight-medium">Address:</label>
                                        <span class="body-2 print-pat-info">{{ data.patient_address }}</span>
                                    </v-col>
                                    <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4"> 
                                        <label class="body-2 font-weight-medium">Age:</label>
                                        <span class="body-2 print-pat-info">{{ data.patient_age }}</span>
                                    </v-col>
                                </v-row>
                                <v-row dense> 
                                    <v-col class="ml-n4" cols="12" xs="12" sm="12" md="12" lg="12">
                                        <h4 class="font-weight-medium pt-6 pb-1"> PRESCRIPTION </h4>
                                        <v-img src="@/assets/rx.png" class="mt-2" width="100%" max-width="60" contain></v-img>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                        <template v-if="show_management_doctor_notes"> 
                            <div v-if="select_management && select_management.management_description" class="font-weight-medium body-2">
                                <h6 class="font-weight-medium body-2 mt-4"> Management Type  </h6>
                                <span class="body-2 pl-4 pb-2"> {{ select_management.management_description }} </span> 
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

                        <div v-if="data.selected_medicine.length > 0 && (print_option === 'both' || print_option === 'pres_only')" class="print-med-tbl-main">
                        
                            <div class="d-flex d-row font-weight-medium text-center">
                                <div class="print-med-tbl-h" style="min-width: 300px;">Generic Name</div>
                                <div class="print-med-tbl-h">Dosage<br>Preparation</div>
                                <div class="print-med-tbl-h">Frequency<br>(per day)</div>
                                <div class="print-med-tbl-h">Duration #<br>of days</div>
                                <div class="print-med-tbl-h">Total # of<br>Medicine</div>
                                <div class="print-med-tbl-h">Remarks</div>
                            </div>

                            <div v-for="(med, i) in data.selected_medicine" :key="i" class="d-flex d-row align-start pt-2 body-1 font-weight-medium">
                                <div class="print-med-tbl-b text-wrap" style="min-width: 300px;">
                                    <span>{{ med.generic_name }}</span>
                                </div>
                                <div class="print-med-tbl-b text-center">
                                    <span>{{ med.dosage }} {{ med.sosage && med.preparation ? '/' : ''}} {{ med.preparation }}</span>
                                </div>
                                <div class="print-med-tbl-b text-center">
                                    <span>{{ med.frequency_of_med }}</span>
                                </div>
                                <div class="print-med-tbl-b text-center">
                                    <span>{{ med.duration }}</span>
                                </div>
                                <div class="print-med-tbl-b text-center">
                                    <span># {{ med.total_num_of_med }}</span>
                                </div>
                                <div class="print-med-tbl-b text-center" >
                                    <span>{{ med.notes }}</span>
                                </div>
                            </div>
                        </div>

                        <v-row :class="[print_option === 'pres_only' ? 'pt-16' : 'pt-6']" class="pt-4" dense>
                            <v-col cols="12" sm="9" md="9" lg="9" xl="9" class="">
                                    <!-- Treatment Plan Certificate QR Code Section -->
                                    <v-sheet id="treatmentplan-certificate" class="qr-code-med" style="box-shadow: none; border: none;">
                                        <QrcodeVue :value="treatmentplan_qr_value" :size="120" level="L" renderAs="svg" />
                                    </v-sheet>
                            </v-col>

                            <v-col cols="12" sm="3" lg="3" xl="3" align-self="end" class="text-center">
                                <v-sheet v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'"> 
                                    <h4 class="font-weight-medium">{{ data.doctor_name }}</h4>
                                    <h5 class="font-weight-medium">License No: {{ data.doctor_prc_license }}</h5>
                                    <h5 class="font-weight-medium">{{ data.doctor_position }}</h5>
                                    <h5 class="font-weight-medium">{{ data.doctor_specialization }}</h5>
                                </v-sheet>
                                <v-sheet v-else> 
                                    <h4 class="font-weight-medium">{{ data.doctor_name }}</h4>
                                    <h4 class="font-weight-medium border-bottom">Lic. #: {{ data.doctor_prc_license }}</h4>
                                    <h5 class="font-weight-medium mt-1 mb-5">DOCTOR</h5>
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </div>

                <div class="pa-8" id="for-print-treatment-tp-par">
                    
                </div>

                <v-row dense no-gutters> 
                    <v-col cols="12" sm="9" lg="9" xl="9" class="mt-4 d-print-none">
                        <h4 class="font-weight-medium">PRINT OPTIONS:</h4>

                        <v-radio-group v-model="print_option" class="ma-0" hide-details row>
                            <v-radio label="LAB REQUEST & PRESCRIPTION" value="both"></v-radio>
                            <v-radio label="LAB REQUEST ONLY" value="lab_only"></v-radio>
                            <v-radio label="PRESCRIPTION ONLY" value="pres_only"></v-radio>
                        </v-radio-group>
                    </v-col>

                    <v-col  cols="12" sm="12" md="12" lg="12" xl="12"> 
                        <v-sheet class="d-print-none">
                            <v-checkbox v-model="show_management_doctor_notes" label="MANAGEMENT & DOCTOR NOTES"> </v-checkbox>
                        </v-sheet>
                    </v-col>
                </v-row>

                <template v-if="$store.state.usr_credentials.department === 'Midwife' && !emr_params.editable "> 
                    <v-btn @click="closeDialog" class="my-2 justify-end">
                        CLOSE   
                        <v-icon size="20" right>mdi-close</v-icon>
                    </v-btn>
                </template>
                <template v-else> 
                    <Footer @saveAsPDF="saveAsPDF" @print="print" @close="closeDialog" :emr_params="emr_params" />
                </template>
            </v-card>
        </div>

    </v-dialog>
</template>

<script>
import html2canvas from 'html2canvas'
import { mapState } from 'vuex'
import jsPDF from 'jspdf'
import Header from '@/components/emr/printable-form/Header.vue';
import Footer from '@/components/emr/printable-form/Footer.vue'
import QrcodeVue from 'qrcode.vue';

export default {
    props: ['patient_info', 'date_admitted', 'doctor_notes', 'select_management', 'follow_up_consultation_date', 'emr_params'],

    components: {
        Header,
        QrcodeVue,
        Footer
    },
    
    data() {
        return {
            show_dialog: false,
            data: {
                patient_name: '',
                date_admitted: '',
                patient_address: '',
                patient_age: '',
                patient_sex:'',
                selected_icd: [],
                selected_medicine: [],
                doctor_name: '',
                doctor_prc_license: '',
                doctor_specialization: '',
                doctor_position:''
            },
            show_management_doctor_notes: false,
            print_option: 'both',
            treatmentplan_qr_value: '',
            is_treatment_plan: ''

        }
    },

    computed: {
        ...mapState(['usr_credentials']),
        
        follow_up_date() {
            return this.$moment(this.follow_up_consultation_date).format("MMMM D, YYYY");
        },

    },

    methods: {
        openDialog(data) {
            this.show_dialog = true;
            this.data = data;
            
            this.treatmentplan_qr_value = this.wsDataEncryption(JSON.stringify({
                transaction_number: this.emr_params?.transaction_number ? this.emr_params.transaction_number : data.transaction_number,
                ek_lgu_id: this.emr_params?.ek_lgu_id ? this.emr_params.ek_lgu_id : data.ek_lgu_id
            }))
            
            this.is_treatment_plan = this.data?.is_treatment_plan
            
            // this.treatmentplan_qr_value = `transaction_number: ${this.emr_params.transaction_number}\nek_lgu_id: ${this.emr_params.ek_lgu_id}\nmem_first_name: ${this.patient_info.mem_first_name}\nmem_middle_name: ${this.patient_info.mem_middle_name || ''}\nmem_last_name: ${this.patient_info.mem_last_name}\nmedicine: ${select_medicine}\ndiagnostic_procedures: ${select_icd}`;
        },

        closeDialog() {
            this.show_dialog = false
        },

        saveAsPDF() {
            html2canvas(document.getElementById('for-print-treatment'), { scale: 2 }).then((canvas) => {
                let margin = 12.7; 
                let img_data = canvas.toDataURL('image/png');
                let page_width = 216;
                let page_height = 356;
                let img_width = page_width - 2 * margin; 
                let img_height = canvas.height * img_width / canvas.width; 
                let doc = new jsPDF('p', 'mm', 'a4');
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

                let {mem_first_name, mem_middle_name, mem_last_name, mem_suffix} = this.patient_info
                let patient_name = `${mem_first_name} ${mem_middle_name || ''} ${mem_last_name} ${mem_suffix || ''}`
                let file_name = `PATIENT ${patient_name} LAB PRESCRIPTION ${this.$moment().format('MM-DD-YYYY hh_mm A')}`
                doc.save(file_name + '.pdf')
            });
        },

        print() {
            window.scrollTo(0, 0);
            window.print();
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
    font-size: 14px;
    width: 250px;
}
.print-med-tbl-b{
    font-size: 14px;
    padding: 2px 0 0 2px;
    width: 100%;
    text-align: center;
}
.print-border-bottom{ background: grey !important; }
@media screen {
    body { font-size: 14pt }
}
@media screen, print {
    body { line-height: 1.2 }
}
@media print{
    body *{
        background: white;
        position: relative;
    }
    #not-for-print{ display: none; }

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

    .print-med-tbl-main{ overflow-x: hidden; }   
    .print-med-tbl-h, .print-med-tbl-b{
        width: 100%;
        padding: 2px 2px 0 0;
    }

    .pagebreak {
         page-break-before: always; 
         margin-top: 5rem;
    }
}
</style>