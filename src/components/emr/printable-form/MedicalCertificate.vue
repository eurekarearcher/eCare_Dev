<template>
    <v-dialog v-model="show_dialog" width="1400" persistent>
        <v-card id="for-print-absolute" width="1400"  class="elevation-0">
            <div id="for-print" class="pa-8">
                <!-- MEDICAL CERTIFICATE FOR BATAAN -->
                <template v-if="$store.state.usr_credentials.lgu_host_code === 'BT' || $store.state.usr_credentials.lgu_host_code === 'SJ'">
                    <Header />

                    <v-row class="mt-4" align="center" justify="end" dense>
                        <v-col sm="4" md="4" lg="4">
                            <h6 class="font-weight-medium text-center body-1"> Medical Certificate </h6>
                        </v-col>

                        <v-col sm="1" md="1" lg="2"></v-col>

                        <v-col class="text-center" sm="3" md="3" lg="2">
                            <h6 class="border-bottom body-2">{{ data.date_admitted }}</h6>
                            <h6 class="font-weight-medium body-2 mt-1">Date</h6>
                        </v-col>
                    </v-row>
 
                    <v-row align="baseline" dense>
                        <v-col sm="4" md="2" lg="2">
                            <h6 class="font-weight-medium text-right body-2">This is to certify that</h6>
                        </v-col>

                        <v-col sm="8" md="10" lg="10">
                            <span class="border-bottom body-2 d-block">{{ data.patient_name }}</span>
                        </v-col>                
                    </v-row>

                    <div class="align-end d-flex">
                        <span class="font-weight-medium from-brgy body-2 mb-6">from Brgy.</span>

                        <div class="flex-grow-1">
                            <h6 class="border-bottom body-2">{{ data.address }}</h6>
                            <h6 class="font-weight-medium text-center body-2 mt-1">Address</h6>
                        </div>
                        
                        <span class="font-weight-medium text-no-wrap body-2 mb-6">, Bataan consulted the undersigned due to/for</span>
                    </div>

                    <span class="border-bottom body-2 d-block mt-n1"> {{ data.chief_complaint }}</span>   
                    
                    <v-divider class="darken-1 grey mt-7 mb-2"></v-divider>

                    <div class="align-baseline d-flex mt-4">
                        <span class="font-weight-medium impression-diagnosis body-2">Impression / Diagnosis</span>

                        <div class="flex-grow-1">
                            <h6 v-if="data.impression_diagnosis.length === 0" class="white--text">.</h6>
                            <h6 v-else v-for="(value, index) in data.impression_diagnosis" :key="index" class="body-2">{{ value.icd_code + '/' + value.icd_description }}</h6>
                            <v-divider class="darken-1 grey"></v-divider>
                        </div>
                    </div>

                    <div class="font-weight-medium align-end d-flex body-2 mt-4">
                        This has been upon request of <v-divider class="darken-1 grey mx-2"></v-divider> for
                    </div>

                    <div class="font-weight-medium align-end d-flex body-2 mt-3">
                        <v-divider class="darken-1 grey mr-2"></v-divider> purposes.
                    </div>
                    
                    <h6 class="font-weight-medium body-2 text-center mr-16 mt-1">(Not for medico-legal purposes)</h6>

                    <h6 class="font-weight-medium body-2 mt-4">Recommendations:</h6>

                    <div v-if="select_management" class="font-weight-medium body-2">
                        <h6 class="font-weight-medium body-2 mt-4">Management Type </h6>
                        <span class="body-2 pl-4 pb-2"> {{ select_management }} </span> 
                    </div>
                    <div v-if="doctor_notes" class="font-weight-medium body-2">
                        <h6 class="font-weight-medium body-2 mt-4">{{ $store.state.usr_credentials.department + " Notes: "}} </h6>
                        <span class="body-2 pl-4 pb-2"> {{ doctor_notes }} </span> 
                    </div>

                    <div v-if="include_lab_and_prescription" class="font-weight-medium body-2">
                        <div v-if="data.laboratory_request.length > 0">
                            <span class="d-block mt-2">LABORATORY REQUEST</span>
                            <span v-for="(value, index) in data.laboratory_request" :key="index" class="d-block mt-2 pl-4">{{ value }}</span>
                        </div>

                        <div v-if="data.selected_medicine.length > 0">
                            <div class="text-center d-flex mt-4">
                                <span class="medicine-item">Generic Name</span>
                                <span class="medicine-item">Brand</span>
                                <span class="medicine-item">Dosage/Preparation</span>
                                <span class="medicine-item">Frequency (per day)</span>
                                <span class="medicine-item">Duration # of days</span>
                                <span class="medicine-item">Total # of Medicine</span>
                                <span class="medicine-item">Remarks</span>
                            </div>

                            <div v-for="(value, index) in data.selected_medicine" :key="index" class="font-weight-regular text-center d-flex mt-2">
                                <span class="medicine-item">{{ value.generic_name }}</span>
                                <span class="medicine-item">{{ value.brand_name }}</span>
                                <span class="medicine-item">{{ value.dosage }} / {{ value.preparation }}</span>
                                <span class="medicine-item">{{ value.frequency_of_med }}</span>
                                <span class="medicine-item">{{ value.duration }}</span>
                                <span class="medicine-item"># {{ value.total_num_of_med }}</span>
                                <span class="medicine-item">{{ value.notes }}</span>
                            </div>
                        </div>
                    </div>

                    <v-row v-else class="font-weight-medium body-2" dense>
                        <v-col sm="6" md="6" lg="6">
                            <span class="d-block mt-4">Labs:</span>
                            <span class="d-block mt-4">Meds:</span>
                        </v-col>

                        <v-col sm="6" md="6" lg="6">
                            <span class="d-block mt-4">Rest:</span>
                            <span class="d-block mt-4">Diet:</span>
                        </v-col>
                    </v-row>

                    <v-row class="mt-6" justify="space-between" align="end" dense>
                        <v-col sm="6" md="6" lg="6">
                            <div class="d-print-none">
                                <h6 class="font-weight-medium body-2">PRINT OPTIONS</h6>
                                <v-checkbox v-model="include_lab_and_prescription" class="ma-0" label="INCLUDE LAB REQUEST AND PRESCRIPTION" hide-details></v-checkbox>  
                            </div>
                        </v-col>

                        <v-col class="text-center" sm="3" md="3" lg="3">
                            <h6 class="font-weight-medium body-1">{{ data.doctor_name }}</h6>
                            <h6 class="font-weight-regular body-2">{{ data.doctor_specialization}}</h6>
                            <h6 class="font-weight-regular body-2">Lic. #:{{ data.doctor_prc_license }}</h6>
                            <v-divider class="darken-1 grey mt-1"></v-divider>
                            <h6 class="font-weight-medium body-2 mt-1">Doctor</h6>
                        </v-col>
                    </v-row>
                </template>

                <template v-else>
                    <v-sheet class="antipolo-med-cert" > 
                        <Header />
                        <v-row class="mt-4" align="center" justify="end" dense>
                            <v-col sm="12" md="12" lg="12">
                                <h6 class="font-weight-medium text-center text-h4 grey--text text--darken-4">Medical Certification</h6>
                            </v-col>
                        </v-row>

                        <v-row class="mt-6" align="center" justify="end" dense>
                            <v-col sm="1" md="1" lg="2"></v-col>

                            <v-col class="text-center mt-4" sm="3" md="3" lg="2">
                                <h6 class="border-bottom body-2">{{ data.date_admitted }}</h6>
                                <h6 class="font-weight-medium body-2 mt-1">Date</h6>
                            </v-col>
                        </v-row>

                        <v-row align="baseline" dense class="mt-5">
                            <v-col sm="4" md="2" lg="2">
                                <h6 class="font-weight-medium text-left body-2">To whom it concern,</h6>
                            </v-col>              
                        </v-row>

                        <v-row align="baseline" dense class="antipolo">
                            <v-col sm="4" md="2" lg="2">
                                <h6 class="font-weight-medium text-right  body-2">This is to certify that</h6>
                            </v-col>

                            <v-col sm="8" md="10" lg="10" class="d-flex justify-space-around mt-n2">
                                <span class="border-bottom body-2 d-block mr-2">{{ data.patient_name }}</span>
                                <div class="body-2 d-flex align-baseline text-no-wrap "> <span class="border-bottom body-2" style="width: 150px;"> {{ data.patient_age }} </span> <span class="body-2"> years old </span> </div>
                            </v-col>               
                        </v-row>

                        <div class="font-weight-medium align-end d-flex body-2 text-no-wrap mt-4">
                            and presently residing at <span class="border-bottom body-2 d-block mt-1 ml-2" style="visibility: visible;">{{ data.address }}</span>
                        </div>

                        <div :class="[print_own ? 'remove-print-item' : '', 'font-weight-medium align-end d-flex body-2 mt-5 justify-center text-no-wrap']">
                            <span :class="print_own ? 'remove-print-item examined' : 'examined'"> was thoroughly examined by the undersigned for </span> 
                        </div>
                        
                        <div v-if="print_own" :class="[print_own ? 'undersign_text' : 'mt-5', 'px-1 body-2 d-block  print-border-bottom ']">
                            <pre class="body-2 undersign_text"> {{ data.input_undersigned_field }} </pre>
                        </div>   

                        <div v-else class="px-1 body-2 d-block mt-3">
                            <v-text-field v-model="data.input_undersigned_field" :readonly="!input_undersigned" :class="{'readonly': !input_undersigned}" hide-details dense ></v-text-field>
                        </div>    

                        <div class="font-weight-medium align-end d-flex body-2 mt-7 mb-4">
                            &nbsp;<v-divider class="darken-1 grey mr-2"></v-divider>
                        </div>

                        <div class="font-weight-medium align-end d-flex body-2 mt-7">
                            <h6 class="font-weight-medium body-1 mr-2">Remarks:</h6>
                        </div>

                        <div v-if="input_remarks" class="mt-5">
                            <v-textarea name="input-1-1" v-model="data.input_remarks_field" :readonly="!input_remarks" :style="input_remarks" outlined hide-details dense></v-textarea>
                        </div>

                        <div v-else class="remakrs-field d-block ml-2" style="margin-bottom: 200px;">
                            <pre style="white-space: pre-wrap;">{{ data.input_remarks_field }}</pre>
                        </div>

                        <v-row class="mt-6" justify="space-between" align="end" dense>
                            <v-col sm="6" md="6" lg="6">
                                <h6 class="font-weight-medium body-2">Note: <span class="ml-2"> Not valid for MEDICO LEGAL purposes <br/> <span class="ml-12"> Not valid without official seal</span> </span> </h6>
                            </v-col>

                            <v-col class="text-center" sm="3" md="3" lg="3">
                                <h6 class="font-weight-medium body-1">{{ $store.state.usr_credentials.lgu_host_code === 'BT' || $store.state.usr_credentials.lgu_host_code === 'SJ'? data.doctor_name : data.doctor_name2 + ", MD."}}</h6>
                                <h6 class="font-weight-regular body-2">{{ $store.state.usr_credentials.lgu_host_code === 'BT' || $store.state.usr_credentials.lgu_host_code === 'SJ'? data.doctor_specialization : data.doctor_position}}</h6>
                                <h6 class="font-weight-regular body-2">Lic. #:{{ data.doctor_prc_license }}</h6>
                                <template v-if="$store.state.usr_credentials.lgu_host_code === 'BT' || $store.state.usr_credentials.lgu_host_code === 'SJ'"> 
                                    <v-divider class="darken-1 grey mt-1"></v-divider>
                                    <h6  class="font-weight-medium body-2 mt-1">Doctor</h6>
                                </template>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </template>

                <v-layout wrap class="mt-8 pl-10 ml-10">
                    <!-- Medical Certificate QR Code Section -->
                    <v-sheet id="medical-certificate" class="qr-code-med" style="box-shadow: none; border: none;">
                        <QrcodeVue :value="medical_certificate_qr_value" :size="90" renderAs="svg"/>
                    </v-sheet>
                </v-layout>

            </div>

            <Footer @editForms="editForms" :is_medical_certificate="true" :input_undersigned="input_undersigned" :input_remarks="input_remarks" @saveAsPDF="saveAsPDF" @print="print" @close="show_dialog = false" />
        </v-card>
    </v-dialog>
</template>

<script>
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Header from '@/components/emr/printable-form/Header.vue'
import Footer from '@/components/emr/printable-form/Footer.vue'
import QrcodeVue from 'qrcode.vue';

export default {    
    props: ['jspdf', 'doctor_notes', 'select_management'],

    components: {
        Header,
        Footer,
        QrcodeVue
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
            input_undersigned: false,
            input_remarks: false,
            print_own: false,

            medical_certificate_qr_value: '',
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
            html2canvas(document.getElementById('for-print'), { scale: 2 }).then((canvas) => {
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

                let file_name = `PATIENT ${this.data.patient_name} MED CERT ${this.$moment().format('MM-DD-YYYY hh_mm A')}`
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
        transform: scale(0.9);
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
