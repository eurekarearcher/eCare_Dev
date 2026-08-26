<template>
    <v-dialog v-model="show_dialog" width="1400" persistent>
        <v-card id="for-print-absolute" width="1400"  class="elevation-0">
            <template>
                <div id="for-print-dc" class="pa-10">
                    <v-sheet class="pa-10"> 
                        <Header :disability_certification="true" />
                        <v-row class="mt-4" align="center" justify="end" dense>
                            <v-col sm="12" md="12" lg="12">
                                <h6 class="font-weight-medium text-center text-h5 grey--text text--darken-4">CERTIFICATE OF APPARENT & NON-APPARENT DISABILITY</h6>
                            </v-col>
                        </v-row>

                        <div class="font-weight-medium align-center d-flex body-2 mt-10"> 
                            <p>
                                This is to certify that <span class="border-bottom body-2">{{ data.patient_name }}</span>
                                resident of <span class="border-bottom body-2">{{ data.address }},</span> 
                                had voluntarily submitted herself/himself to this facility/clinic/office which regard to the nature of disability.<br><br>
                                Based on the personal interview and assessment conducted by herein physician, the patient has 
                            </p>
                        </div>

                        <div v-if="print_own">
                            <pre class="body-2 undersign_text"> {{ data.input_undersigned_field }}</pre>
                        </div>   

                        <div v-else class="body-2">
                            <v-text-field v-model="data.input_undersigned_field" :readonly="!input_undersigned" :class="{'readonly': !input_undersigned}" hide-details dense ></v-text-field>
                            <p class="font-weight-medium align-center d-flex body-2 mt-2">that resulted to:</p>
                        </div>    

                        <div class="pl-10 ml-10 ma-0 pa-0 font-weight-medium text-center body-2"> 
                            <v-container fluid>
                                <v-checkbox class="ma-0 pa-0 font-weight-medium text-center" v-for="option in disability_result" :key="option.id" v-model="selected_disability" :label="option.label" :value="option.id" color="black" dense></v-checkbox>
                            </v-container>
                                <!--<p>Selected disability options: {{ selected_disability.join(", ") }}</p>-->
                        </div>

                        <div class="font-weight-medium align-center d-flex body-2 mb-7"> 
                            <span>As classified by the Department of Health Administrative Order No. 2013-005-B.<br><br>
                                This certificate is issued on  <span class="border-bottom body-2">{{ data.date_admitted }}</span> at <b class="border-bottom ">PARAÑAQUE CITY EMPLOYEES CLINIC</b> in compliance with the requirement in the issuance of PWD-IDC for the benefits and privileges of persons with disabilities as mandated by Republic Act No. 9442 and related laws.
                            </span><br>
                        </div>

                        <div class="mt-10 mb-10">
                            <span class="border-bottom mt-10 mb-10">Signed:</span><br>
                        </div>

                        <v-row class="mt-10" justify="start" align="start" dense>
                            <v-col class="text-left" xs="12" sm="12" md="12" lg="12">
                                <span class="font-weight-medium body-1 border-bottom">{{  this.textCapitalize(data.doctor_name) }}</span>
                                <h6 class="font-weight-regular body-2">Name of Physician</h6>
                                <h6 class="font-weight-regular body-2">License Number: {{ data.doctor_prc_license }}</h6>
                                <h6 class="font-weight-regular body-2 font-weight-bold font-italic">CITY EMPLOYEES CLINIC - PARAÑAQUE</h6>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </div>
            </template>
            <Footer @editForms="editForms" :is_medical_certificate="true" :input_undersigned="input_undersigned" :input_remarks="input_remarks" @saveAsPDF="saveAsPDF" @print="print" @close="show_dialog = false" />
        </v-card>
    </v-dialog>
</template>

<script>
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Header from '@/components/emr/printable-form/Header.vue'
import Footer from '@/components/emr/printable-form/Footer.vue'
//import QrcodeVue from 'qrcode.vue';

export default {    
    props: ['jspdf', 'doctor_notes', 'select_management'],

    components: {
        Header,
        Footer,
       // QrcodeVue
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
            },
            disability_result: [
                { id: 1, label: "Cancer (RA11215)" },
                { id: 2, label: "Deaf or Hard Hearing" },
                { id: 3, label: "Intellectual Disability" },
                { id: 4, label: "Learning Disability" },
                { id: 5, label: "Mental Disability" },
                { id: 6, label: "Physical Disability (Orthopedic)" },
                { id: 7, label: "Psychosocial Disability" },
                { id: 8, label: "Rare Disease (RA 10747)" },
                { id: 9, label: "Speech and Language Impairment" },
                { id: 10, label: "Visual Disability" },
            ],

            selected_disability: [],
            input_undersigned: false,
            input_remarks: false,
            print_own: false,

           // medical_certificate_qr_value: '',
        }
    },

    methods: {
        editForms() {
            this.input_undersigned = !this.input_undersigned
            this.input_remarks = !this.input_remarks
        },

        openMedicalCertificate(data) {
            this.data = data;
            
            // Fetch host code and host province from the mixin
            const host_code = this.$store.state.prv_data.municipality; //MUNICIPALITY
            const host_province = this.$store.state.prv_data.province; //PROVINCE
            
            this.medical_certificate_qr_value =`City: ${host_code}\nProvince: ${host_province}\nProvider Name: ${this.$store.state.prv_data.provider_name}\nMember Name: ${this.data.patient_name}\nMember ID: ${this.data.ek_lgu_id}\nCertificate Date Issued: ${this.formatDate(this.data.date_admitted)}`;
            this.show_dialog = true;
        },
        
        print() {
            window.scrollTo(0, 0);
            window.print();
        },

        saveAsPDF() {
            html2canvas(document.getElementById('for-print-dc'), { scale: 2 }).then((canvas) => {
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

                let file_name = `PATIENT ${this.data.patient_name}CERTIFICATE OF APPARENT & NON-APPARENT DISABILITY ${this.$moment().format('MM-DD-YYYY hh_mm A')}`
                doc.save(file_name + '.pdf')
            });
        }
    }
}
</script>

<style scoped>
.border-bottom, .print-border-bottom {
    border-bottom: 1px solid grey;
    margin-top: 13px; 
    padding-top: 2px;
    width: 100%;
}

.from-brgy {
    width: 74px;
}

.impression-diagnosis {
    width: 160px;
}

.medicine-item {
    width: calc(100% / 7);
}

.readonly {
    pointer-events: none;
}

.examined {
    word-spacing: 50px;
    text-align: center;
}

@media print {
    body * {
        background: white;
        position: relative;
        width: 100%;
    }

    ::v-deep .v-dialog {
        box-shadow: none;
    }

    #for-print-absolute{
        left: 0;
        padding-top: 50px;
        position: fixed !important; 
        top: 0;
    }

    .qr-code-med{
        padding-left: 75px;
    }

    .antipolo-med-cert {
        padding: 0px 50px 0px 50px !important;
    }

    .from-brgy {
        width: 165px;
    }

    .impression-diagnosis {
        width: 205px;
    }

    .remove-print-item{
        visibility: hidden;
    }
    
    .print-border-bottom {
        border-bottom: none;
    }
    
    .legal-size .undersign_text {
        margin-top: -1px;
        padding-left: 85px;
    }

    .legal-size .remakrs-field {
        margin-top: 35px;
        padding-left: 85px;
    }

    .legal-size .date-admitted {
        margin-top: 3rem;
        right: 5rem;
    }

    .legal-size .patient-name {
        top: -0.9rem;
        left: 1.5rem;
    }

    .legal-size .patient-age {
        top: -1.2rem;
        left: 3.5rem;
    }
    
    .legal-size .patient-address {
        top: -12px;
        left: 6rem;
    }

    .a4-size .undersign_text {
        margin-top: 0.8rem;
        padding-left: 40px;
    }

    .a4-size .remakrs-field {
        margin-top: 75px;
        padding-left: 40px;
    }

    .a4-size .date-admitted {
        margin-top: 0.5rem;
        right: 3.5rem;
    }

    .a4-size .patient-name {
        left: 0.5rem;
    }

    .a4-size .patient-age {
        left: 5.3rem;
    }
    
    .a4-size .patient-address {
        top: 7px;
        left: 4.6rem;
    }
}

</style>
