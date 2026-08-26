<template>
    <v-card id="for-print-relative" class="px-2" flat>
        <div class="pa-8" v-if="$route.name === 'EMRConsultationTypeA'">
            <v-sheet v-if="print_option === 'both' || print_option === 'pres_only'" :class="should_page_break ? 'pagebreak' : ''"> 
                <Header :is_treatment_plan="true" />
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

                    </v-col>
                </v-row>
            
                <v-row no-gutters dense>
                    <v-col cols="6">
                        <div v-if="follow_up_consultation_date" class="font-weight-medium body-2">
                            <h6 class="font-weight-medium body-2 mt-3"> 
                                Follow up date:
                                <span class="font-weight-bold blue--text text--darken-4">{{ follow_up_date }}</span>
                            </h6>
                        </div>
                        <div v-if="doctor_notes" class="font-weight-medium body-2">
                            <h6 class="font-weight-medium body-2 mt-2">Doctor Notes:
                            <span class="body-2"> {{ doctor_notes }} </span> </h6>
                        </div>
                    </v-col>
                    <v-col cols="6">
                        <template v-if="show_management_doctor_notes"> 
                            <div v-if="select_management.length >= 1" class="font-weight-medium body-2">
                                <h6 class="font-weight-medium body-2 mt-3 d-flex"> Management Type:   
                                    <div v-for="(management, key) in select_management" :key="key"> 
                                        <span class="body-2 "> &nbsp; {{ management.management_description }} </span> 
                                    </div>
                                </h6>
                            </div>
                        </template>
                    </v-col>
                </v-row>
                <!-- <div>
                    <div v-if="follow_up_consultation_date" class="font-weight-medium body-2">
                        <h6 class="font-weight-medium body-2 mt-3"> 
                            Follow up date:
                            <span class="font-weight-bold blue--text text--darken-4">{{ follow_up_date }}</span>
                        </h6>
                    </div>
                    <div v-if="doctor_notes" class="font-weight-medium body-2">
                        <h6 class="font-weight-medium body-2 mt-2">Doctor Notes:
                        <span class="body-2"> {{ doctor_notes }} </span> </h6>
                    </div>
                </div>

                <template v-if="show_management_doctor_notes"> 
                    <div v-if="select_management.length >= 1" class="font-weight-medium body-2">
                        <h6 class="font-weight-medium body-2 mt-3 d-flex"> Management Type:   
                            <div v-for="(management, key) in select_management" :key="key"> 
                                <span class="body-2 "> &nbsp; {{ management.management_description }} </span> 
                            </div>
                        </h6>
                    </div>
                </template> -->

                <v-row dense> 
                    <v-col class="" cols="12" xs="12" sm="12" md="12" lg="12">
                        <div class="d-flex justify-start align-center">
                            <v-img src="@/assets/rx.png" class="mt-2" width="100%" max-width="40" contain></v-img>
                            <span class="font-weight-medium"> PRESCRIPTION </span>
                        </div>
                    </v-col>
                </v-row>

                <!-- <v-row v-if="selected_medicine.length > 0 && (print_option === 'both' || print_option === 'pres_only')" no-gutters dense>
                    <v-col cols="12">
                        <v-row dense no-gutters class="font-weight-medium my-2">
                            <v-col cols="8">Generic Name | Dosage</v-col>

                            <v-col cols="4">
                                <div class="text-center d-flex justify-center" style="gap: 15px;">
                                    <span>Freq</span>
                                    <span># Days</span>
                                    <span># Meds</span>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" v-for="(med, i) in selected_medicine" :key="i">
                        <v-row dense>
                            <v-col cols="8" align-self="center" class="font-weight-medium">
                                {{ i + 1 }}) {{ med.generic_name }} |
                                {{ med.dosage }}{{ med.dosage && med.preparation ? ' / ' : '' }}{{ med.preparation }}
                            </v-col>

                            <v-col cols="4" align-self="center">
                                <div class="text-center d-flex justify-center" style="gap: 50px;">
                                    <span>{{ med.frequency_of_med }}</span>
                                    <span>{{ med.duration }}</span>
                                    <span>#{{ med.total_num_of_med }}</span>
                                </div>
                            </v-col>
                        </v-row>

                        <v-row no-gutters dense v-if="med.notes">
                            <v-col cols="12"><strong>Remarks:</strong> {{ med.notes }}</v-col>
                        </v-row>
                        <v-divider class="my-1"></v-divider>
                    </v-col>
                </v-row> -->

                <v-row v-if="selected_medicine.length > 0 && (print_option === 'both' || print_option === 'pres_only')" no-gutters dense>
                    <v-col cols="12">
                        <v-row dense no-gutters class="font-weight-medium my-2">
                            <v-col cols="8">Generic Name | Dosage</v-col>

                            <v-col cols="4">
                                <div class="text-center d-flex justify-center" style="gap: 15px;">
                                    <span>Freq</span>
                                    <span># Days</span>
                                    <span># Meds</span>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" v-for="(med, i) in selected_medicine" :key="i">
                        <v-row dense>
                            <v-col cols="8" align-self="center">
                                {{ i + 1 }}) 
                                
                                <span class="font-weight-bold text-decoration-underline">
                                    {{ med.generic_name }}
                                </span> 
                                | {{ med.dosage }}{{ med.dosage && med.preparation ? ' / ' : '' }}{{ med.preparation }}
                            </v-col>

                            <v-col cols="4" align-self="center">
                                <div class="text-center d-flex justify-center" style="gap: 50px;">
                                    <span>{{ med.frequency_of_med }}</span>
                                    <span>{{ med.duration }}</span>
                                    <span>#{{ med.total_num_of_med }}</span>
                                </div>
                            </v-col>
                        </v-row>

                        <v-row no-gutters dense v-if="med.notes">
                            <v-col cols="12" class="pl-6">
                                <strong>Remarks:</strong> {{ med.notes }}
                            </v-col>
                        </v-row>

                        <v-divider class="my-1"></v-divider>
                    </v-col>
                </v-row>

                <v-row :class="[print_option === 'pres_only' ? 'pt-4' : 'pt-6']" class="pt-4" dense>
                    <v-col cols="12" sm="8" md="8" lg="8" xl="8" class="">
                        <v-sheet id="treatmentplan-certificate" class="qr-code-med" style="box-shadow: none; border: none;">
                            <QrcodeVue :value="treatmentplan_qr_value" :size="100" level="L" renderAs="svg" />
                        </v-sheet>
                        <div v-if="print_option !== 'both'" class="font-weight-medium body-2">
                            <h6 class="font-weight-light body-2 mt-2 print-option-font-size "> 
                                {{ print_option === 'pres_only' ? 'PRESCRIPTION ONLY' : print_option === 'lab_only' ? 'LAB REQUEST ONLY' : '' }}
                            </h6>
                        </div>

                    </v-col>

                    <v-col cols="12" sm="3" lg="3" xl="3" align-self="end" class="text-center">
                        <v-sheet v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'"> 
                            <h4 class="font-weight-medium text-no-wrap">{{ data.doctor_name }}</h4>
                            <h5 class="font-weight-medium text-no-wrap">License No: {{ data.doctor_prc_license }}</h5>
                            <h5 class="font-weight-medium">{{ data.doctor_position }}</h5>
                            <h5 class="font-weight-medium">{{ data.doctor_specialization }}</h5>
                        </v-sheet>
                        <v-sheet v-else> 
                            <h4 class="font-weight-medium text-no-wrap">{{ data.doctor_name }}</h4>
                            <h4 class="font-weight-medium text-no-wrap">Lic.#:{{ data.doctor_prc_license }}</h4>
                            <h5 class="font-weight-medium mt-1 mb-5">DOCTOR</h5>
                        </v-sheet>
                    </v-col>
                </v-row>

            </v-sheet>
        </div>

        <div v-else class="pa-8" >  
            <v-sheet> 
                <Header :is_treatment_plan="true" />
                
                <v-row align="center" dense>
                    <v-col cols="12" xs="12" sm="12" md="12" lg="12">
                        <v-row v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'" class="d-flex justify-end" dense> 
                            <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                                <label class="body-2 font-weight-medium">Date:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ this.data.date_admitted }}</span>
                            </v-col>
                        </v-row>
                        <v-row v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'" dense>
                            <v-col class="d-flex align-baseline" cols="12" xs="6" sm="6" md="6" lg="6">
                                <label class="body-2 font-weight-medium">Name:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ this.data.patient_name }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="3" sm="3" md="3" lg="3"> 
                                <label class="body-2 font-weight-medium">Age:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ this.data.patient_age }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="3" sm="3" md="3" lg="3"> 
                                <label class="body-2 font-weight-medium">Sex:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ this.data.patient_sex }}</span>
                            </v-col>
                        </v-row>
                        <v-row v-else class="mt-5" dense> 
                            <v-col class="d-flex align-baseline" cols="12" xs="8" sm="8" md="8" lg="8">
                                <label class="body-2 font-weight-medium">Name:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ this.data.patient_name }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                                <label class="body-2 font-weight-medium">Date:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ this.data.date_admitted }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="8" sm="8" md="8" lg="8">
                                <label class="body-2 font-weight-medium">Address:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ this.data.patient_address }}</span>
                            </v-col>
                            <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4"> 
                                <label class="body-2 font-weight-medium">Age:</label>
                                <span class="body-2 print-pat-info font-weight-medium">{{ this.data.patient_age }}</span>
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

                <v-row v-if="data.selected_medicine.length > 0 && (print_option === 'both' || print_option === 'pres_only')" dense>
                    <v-col cols="12">
                        <v-row align="baseline" class="font-weight-medium" dense>
                            <v-col cols="6" align-self="center">Generic Name | Dosage</v-col>

                            <v-col cols="6" align-self="center">
                                <v-row align="baseline" class="text-center">
                                    <v-col>Freq</v-col>
                                    <v-col># Days</v-col>
                                    <v-col v-if="$route.name !== 'Pharmacist'"># Meds</v-col>
                                    <v-col v-if="$route.name === 'Pharmacist'">Prescribed</v-col>
                                    <v-col v-if="$route.name === 'Pharmacist'">Remaining</v-col>
                                    <v-col v-else>Dispensed</v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" v-for="(med, i) in data.selected_medicine.filter(m => m.dispensed_medicine_status !== 'Fully Served')" :key="i">
                        <v-row align="baseline">
                            <v-col cols="6" align-self="center" class="font-weight-medium">
                                {{ i + 1 }}) 
                                {{ $route.name === 'ConsultationTypeA' ? med.generic_name : med.medicine_name }} |
                                {{ med.dosage }}{{ med.dosage && med.preparation ? ' / ' : '' }}{{ med.preparation }}
                            </v-col>

                            <v-col cols="6" align-self="center">
                                <v-row class="text-center">
                                    <v-col>{{ med.frequency_of_med }}</v-col>
                                    <v-col>{{ med.duration }}</v-col>

                                    <template v-if="$route.name !== 'Pharmacist'">
                                        <v-col># {{ med.total_prescribed_medicine }}</v-col>
                                        <v-col>{{ $route.name === 'ConsultationTypeA' ? med.total_num_of_med : med.total_dispensed_medicine }}</v-col>
                                    </template>

                                    <template v-else>
                                        <v-col>#{{ med.total_prescribed_medicine }}</v-col>
                                        <v-col>#{{ med.available_to_dispensed }}</v-col>
                                    </template>
                                </v-row>
                            </v-col>
                        </v-row>

                        <v-row no-gutters dense v-if="med.notes">
                            <v-col cols="12"><strong>Remarks:</strong> {{ med.notes }}</v-col>
                        </v-row>

                        <v-divider class="my-1"></v-divider>
                    </v-col>
                </v-row>

                <v-row :class="[print_option === 'pres_only' ? 'pt-4' : 'pt-6']" class="pt-4" dense>
                    <v-col cols="12" sm="9" md="9" lg="9" xl="9" class="">
                            <!-- Treatment Plan Certificate QR Code Section 
                            <v-sheet id="treatmentplan-certificate" class="qr-code-med" style="box-shadow: none; border: none;">
                                <QrcodeVue :value="treatmentplan_qr_value" :size="120" level="L" renderAs="svg" />
                            </v-sheet> -->
                    </v-col>

                    <v-col v-if="$route.name !== 'ConsultationTypeA'" cols="12" sm="3" lg="3" xl="3" align-self="end" class="text-center mt-7">
                        <v-sheet v-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'"> 
                            <h4 class="font-weight-medium">{{ this.data.doctor_name }}</h4>
                            <h5 class="font-weight-medium">License No: {{ this.data.doctor_prc_license }}</h5>
                            <h5 class="font-weight-medium">{{ this.data.doctor_position }}</h5>
                            <h5 class="font-weight-medium">{{ this.data.doctor_specialization }}</h5>
                        </v-sheet>
                        <v-sheet v-else> 
                            <h4 class="font-weight-medium">{{ this.data.doctor_name }}</h4>
                            <h4 class="font-weight-medium border-bottom no-wrap">Lic. #: {{ this.data.doctor_prc_license }}</h4>
                            <h5 class="font-weight-medium mt-1 mb-5">DOCTOR</h5>
                        </v-sheet>
                    </v-col>
                </v-row>

                 <v-row v-if="selected_medicine_rx_issued.length !== 0 && !is_saving_pdf" class="mt-6 d-print-none" justify="space-between" align="end" dense>
                    <v-col sm="6" md="6" lg="6">
                        <div class="d-print-none">
                            <h6 class="font-weight-medium body-2">RX ISSUED</h6>
                            <v-checkbox v-model="medicine_rx_issued" @change="updateRxIssuedStatus()" class="ma-0" label="SELECT THIS CHECKBOX TO PRINT THE PRESCRIPTION." hide-details></v-checkbox>  
                        </div>
                    </v-col>
                 </v-row>
            </v-sheet>
        </div>

        <Alert :alert="alert"/>
    </v-card>
</template>

<script>
import Header from '@/components/emr/printable-form/Header.vue';
import QrcodeVue from 'qrcode.vue';
import Alert from '../../../Alert.vue';

export default {
    props: ['tbl_items', 'selected_medicine', 'patient_name', 'data', 'rx_issued', 'is_saving_pdf', 'transaction_number', 'print_option', 'follow_up_consultation_date', 'follow_up_date', 'doctor_notes', 'select_management', 'show_management_doctor_notes'],

    components: {
        Header,
        QrcodeVue,
        Alert
    },
    
    data() {
        return {
            show_dialog: false,
            // show_management_doctor_notes: false,
            // print_option: 'both',
            treatmentplan_qr_value: '',
            is_treatment_plan: '',
            // follow_up_consultation_date:'',

            alert: {},

            selected_medicine_rx_issued: []
        }
    },

    computed: {
        medicine_rx_issued: {
            get(){
                return this.rx_issued
            },
            set(value){
                this.$emit('update:rx_issued', value)
            }
        },

        should_page_break(){
            if (!this.selected_medicine.length) return false

            const procedures =
            this.data?.selected_icd?.[0]?.procedures?.length || 0

            const many_procedures = procedures >= 5
            const many_meds = this.selected_medicine.length >= 5

            const has_notes =
            this.show_management_doctor_notes || this.follow_up_consultation_date

            return (many_procedures || many_meds) && has_notes
        }
    },

    mounted(){
        this.selected_medicine_rx_issued = this.data.selected_medicine.filter(item => item.dispensed_medicine_status === 'Not Served' || item.dispensed_medicine_status === 'Partially Served').map(item => ({
            otc_medicine_code: item.medicine_code,
            generic_name: item.dispensed_medicine_name,
            transaction_patient_medicine_id: item.transaction_patient_medicine_id,
            dispensing_personnel: this.$store.state.usr_credentials.user_name,
            lot_no: item.lot_no,
            total_dispensed_medicine: item.total_dispensed_medicine,
            rx_issued: true
        }))
    },

    methods: {
        //UPDATE THE TABLE (STATUS) OF DISPENSED MEDICINE FOR RX ISSUED ONLY
        async updateRxIssuedStatus(){
            this.data.selected_medicine.forEach(data => {
                if(data.dispensed_medicine_status === 'Not Served'){
                    data.dispensed_medicine_status = "Not Served/RX Issued";
                }

                if(data.dispensed_medicine_status === 'Partially Served'){
                    data.dispensed_medicine_status = "Partially Served/RX Issued";
                }
            })

            let response = await this.$services.trnUpdateTransactionMedicine({
                transaction_number: this.data.transaction_number,
                data: this.selected_medicine_rx_issued
            })

            if(response.status === 200){
                if(response.data.success){
                this.$emit('mutations', this.data.selected_medicine)
                }
            } else {
                this.alert = response.error
            }
        }
    }
}
</script>

<style scoped>
.print-pat-info{
    border-bottom: 1px solid grey;
    margin: 12px 0 0 4px;
    padding: 2px 0 0 0;
    width: 100%;
}

.border-bottom{
    border-bottom: 1px solid grey; 
    margin: 2pt 0 0 8pt; 
    padding: 2pt 0pt 0pt 0pt; 
    width: 100%;
}

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