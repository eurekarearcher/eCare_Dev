<template>
    <v-dialog v-model="show_dialog" width="1400" persistent>
        <v-card id="for-print-absolute" width="1400"  class="elevation-0">
            <div id="for-print"  class="pa-8">
                <!-- MEDICAL CERTIFICATE FOR PARAÑAQUE -->
                <Header :is_gender_verification="true" />

                 <!-- Date Section -->
                <v-row class="my-4" justify="start" dense>
                    <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4" xl="4">
                        <label class="body-2 font-weight-medium">Date:</label>
                        <span class="body-2 border-bottom text-center font-weight-medium">{{ data.date_admitted }}</span>
                    </v-col>
                </v-row>

                <v-row class="my-10" align="center" justify="end" dense>
                    <v-col cols="12">
                        <h1 class="title text-center body-1">
                            <span class="border-bottom">GENDER VERIFICATION</span>
                        </h1>
                    </v-col>
                </v-row>

                <!-- Greeting Section -->
                <v-row class="my-4" justify="center" dense>
                    <v-col cols="12" class="d-flex align-baseline">
                        <h3 class="text-start">To whom it may concern:</h3>
                    </v-col>
                </v-row>

                <v-row justify="center" dense>
                    <v-col cols="12">
                        <h4 class="font-weight-regular text-start body-1">
                            <v-row align="baseline" justify="start" dense>
                                <v-col cols="12">
                                    &nbsp;&nbsp;This is to certify that Mr/Ms/Mrs.<span class="font-weight-medium border-bottom body-1">{{ data.patient_name }}</span>
                                    ,Age/Sex<span class="font-weight-medium border-bottom body-1">{{ data.patient_age }},{{data.patient_gender}}</span> 
                                    has been seen and examined on <span class="font-weight-medium border-bottom body-1">{{ data.date_admitted }}</span> for gender verification.
                                </v-col>
                            </v-row>
                        </h4>
                    </v-col>
                </v-row>

                <v-row class="my-4" justify="center" dense>
                    <v-col cols="12">
                        <h4 class="font-weight-regular text-start body-1">
                            <v-row align="baseline" justify="start" dense>
                                <v-col cols="12">
                                    <div v-if="print_own">
                                        <pre class="undersign_text body-1"> {{ data.input_exam_field }} </pre>
                                    </div>
                                    <div v-else class="px-1 d-block  undersign_text">
                                    </div>
                                        <v-row align="baseline">
                                            &nbsp;&nbsp;&nbsp;&nbsp;The patient has been found to have ESSENTIALLY NORMAL, PHYSICAL AND ULTRASOUND FINDINGS FIT FOR A&nbsp;&nbsp;
                                            <v-text-field v-model="data.input_exam_field" :readonly="!input_exam" :class="{'readonly': !input_exam}" hide-details dense></v-text-field>
                                            WITH NO SIGNS OF SEX CHANGE NOR SEX TRANSPLANT AS PER REQUIRED IN R.A. 10172.
                                        </v-row>
                                       
                                </v-col>
                            </v-row>
                        </h4>
                    </v-col>
                </v-row>

              
                <!-- Certification Disclaimer -->
                <v-row class="px-12 my-8" dense>
                    <v-col cols="12" class="px-8">
                        <span class="d-flex mt-10">
                            <h4 class="body-1 font-weight-medium">
                                This certification is being issued upon the requesst of the above individual for documentation purposes.
                            </h4>
                        </span>
                    </v-col>
                </v-row>

                <v-row class="mt-16" justify="end" align="end" dense>
                    <v-col cols="3" class="text-center">
                    <span class="font-weight-regular">Respectfully yours,</span> 
                    </v-col>
                </v-row>

               <v-row class="mt-16" justify="center" align="center" dense>
                    <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                        <v-row justify="space-between" align="baseline">
                            <v-col cols="3" sm="3" md="3" lg="3" xl="3">
                                <div>
                                    <v-row align="baseline">
                                        <span class="body-2 font-weight-medium">O.R. No.:</span>
                                        <div v-if="print_own">
                                            <pre class="undersign_text body-1"> {{ data.input_due_field }} </pre>
                                        </div>
                                        <div v-else class="px-1 d-block undersign_text">
                                            <v-text-field v-model="data.input_due_field" :readonly="!input_due" :class="{'readonly': !input_due}" hide-details dense></v-text-field>
                                        </div>
                                    </v-row>
                                </div>
                                <div class="mt-4">
                                    <v-row align="baseline">
                                        <span class="body-2 font-weight-medium">Date Issued:</span>
                                        <div v-if="print_own">
                                            <pre class="body-1 undersign_text"> {{ data.input_diagnose_field }} </pre>
                                        </div>
                                        <div v-else class="px-1 d-block undersign_text">
                                            <v-text-field v-model="data.input_diagnose_field" :readonly="!input_diagnose" :class="{'readonly': !input_diagnose}" hide-details dense></v-text-field>
                                        </div>
                                    </v-row>
                                </div>
                            </v-col>

                            <v-col cols="3" sm="3" md="3" lg="3" xl="3">
                                <div class="text-align-center">
                                    <h4 class="font-weight-medium body-1">{{ this.textCapitalize(data.doctor_name) }}</h4>
                                    <h4 class="font-weight-regular body-2">{{ data.doctor_position }}</h4>
                                    <h4 class="font-weight-regular body-2">License No.: {{ data.doctor_prc_license }}</h4>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>


            </div>

            <Footer @editForms="editForms" @saveAsPDF="saveAsPDF" :is_medical_certificate="true" :input_diagnose="input_diagnose" :input_exam="input_exam" :input_due="input_due" @print="print" @close="close" :emr_params="emr_params"/>
        </v-card>
   </v-dialog>
</template>

<script>
import Header from '@/components/emr/printable-form/Header.vue'
import Footer from '@/components/emr/printable-form/Footer.vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default {
    props: ['jspdf', 'doctor_notes', 'select_management', 'emr_params'],

    components: {
        Header,
        Footer,
    },

    data() {
        return {
            show_dialog: false,
            include_lab_and_prescription: false,
            data: {
                date_admitted: '',
                patient_name: '',
                address: '',
                age: '',
                ek_lgu_id: '',
                impression_diagnosis: [],
                laboratory_request: [],
                selected_medicine: [],
                doctor_name: '',
                doctor_specialization: '',
                doctor_prc_license: '',
                input_undersigned_field: '',
                input_remarks_field: '',
                input_due_field: '',
                input_exam_field: '',
                input_diagnose_field: ''
            },
            input_undersigned: false,
            input_remarks: false,
            input_diagnose: false,
            input_exam: false,
            input_due: false,
            print_own: false,
            medical_certificate_qr_value: '',
            is_gender_verification: false,
        }
    },

    methods: {
        openGenderVerification(data) {
            this.data = data;
            this.show_dialog = true;
        },

        editForms() {
            this.input_diagnose = !this.input_diagnose
            this.input_due = !this.input_due
            this.input_exam = !this.input_exam
        },

        print() {
            window.scrollTo(0, 0);
            window.print();
        },

        close() {
            this.show_dialog = false;
        },

        saveAsPDF() {
            html2canvas(document.getElementById('for-print')).then((canvas) => {
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

                const file_name = `PATIENT ${this.data.patient_name} GENDER VERIFICATION ${this.$moment().format('MM-DD-YYYY hh_mm A')}`;
                doc.save(`${file_name}.pdf`);
            });
        }
    }
}
</script>

<style scoped>
.readonly {
    pointer-events: none;
}

.title {
    font-family: 'Times New Roman', Times, serif !important;
    font-size: 30pt !important;
    font-weight: bold !important;
}
.border-bottom{
    border-bottom: 1px solid grey; 
    margin: 18pt 0 0 8pt; 
    padding: 5pt 0pt 0pt 0pt; 
    width: 100%;
}
@media print {
    body * {
        background: white;
        position: relative;
        width: 100%;
    }

    #for-print-absolute {
        position: absolute !important;
        top: 0;
        left: 0;
    }
}
</style>