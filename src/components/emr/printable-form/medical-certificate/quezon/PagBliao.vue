<template>
    <v-card id="for-print-absolute" class="elevation-0">
        <div id="for-print"  class="pa-8">
            <!-- MEDICAL CERTIFICATE FOR PAGBILAO -->
            <template>
                <Header />

                <v-row class="my-4" align="center" justify="end" dense>
                    <v-col sm="12" md="12" lg="12">
                        <h2 class="font-weight-medium text-center"> OFFICE OF THE MUNICIPAL HEALTH OFFICER </h2>
                    </v-col>
                    <v-col sm="12" md="12" lg="12" class="mt-4">
                        <h2 class="font-weight-medium text-center"> Medical Certificate </h2>
                    </v-col>
                </v-row>

                <v-row class="px-12 my-8" dense>
                    <v-col cols="12" sm="12" md="12" lg="12" class="px-10"> 
                        <div class="text-body-1 mt-8">
                            <div class="d-flex mt-12 text-body-1">
                                <h4 class="text-body-1"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; This is to certify that {{ data.patient_name }}, {{ data.patient_age }} years old, {{ data.patient_gender }}, residing at {{ data.address }}, was seen and examined at our Rural Health Unit.   
                                    <template v-if="is_edit_forms"> 
                                        <v-text-field v-model="diagnosis" class="ma-0" hide-details dense > </v-text-field>   
                                    </template>
                                    <template v-else> 
                                        {{ diagnosis }}
                                    </template>
                                </h4> 
                            </div>
                            
                            <template v-if="doctor_notes"> 
                                <h4 class="text-body-1 mt-6"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; NOTE: <span> {{ doctor_notes }}</span> </h4>
                            </template>

                            <div class="d-flex mt-10"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                                Issued this {{ data.date_admitted }} at Pagbilao, Quezon upon request of the patient for 
                                    <template v-if="is_edit_forms"> 
                                        <v-text-field v-model="purposes" class="ma-0 px-4" hide-details dense style="width: 70px;"> </v-text-field> 
                                    </template>
                                    <template v-else> 
                                        {{ purposes }} 
                                    </template>
                                purposes. 
                            </div>
                        </div>
                    </v-col> 
                </v-row>

                <v-row class="mt-16" justify="space-between" align="end" dense>
                    <v-col class="text-center" sm="3" md="3" lg="3" offset-sm="9" offset-md="9" offset-lg="9">
                        <h6 class="font-weight-medium body-1">{{ data.doctor_name }}</h6>
                        <h6 class="font-weight-regular body-2">{{ data.doctor_specialization}}</h6>
                        <h6 class="font-weight-regular body-2 prc-license">Lic. #:{{ data.doctor_prc_license }}</h6>
                        <h6 class="font-weight-medium body-2 mt-1">Doctor</h6>
                    </v-col>
                </v-row>

                <v-row class="mt-16" justify="space-between" align="end" dense>
                    <v-col class="text-start" sm="12" md="12" lg="12">
                        <h4> (NOT VALID WITHOUT SEAL) </h4>
                    </v-col>
                    <v-col class="text-center" sm="12" md="12" lg="12">
                        <v-card width="540" class="pa-4" outlined>
                            <v-card-title class="text-body-1 text-center justify-center docu"> "DOCUMENTARY STAMP TAX PAID" </v-card-title>
                            <v-sheet class="d-flex justify-space-between mt-4"> 
                                <div class="text-body-2 docu" style="border-top: 1px solid grey;"> 
                                    (GOR SERIAL NUMBER)
                                </div>
                                <v-spacer> </v-spacer>
                                <div class="text-body-2 docu" style="border-top: 1px solid grey;"> 
                                    (DATE OF PAYMENT)
                                </div>
                            </v-sheet>
                            <h4 class="text-center text-body-2"> AMOUNT OF 30PHP </h4>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </div>

        <Footer @editForms="editForms" :is_medical_certificate="true" @saveAsPDF="saveAsPDF" :purposes="purposes" :diagnosis="diagnosis" @print="print" @close="close" :is_edit_forms="is_edit_forms" :emr_params="emr_params"/>
    </v-card>
</template>

<script>
import Header from '@/components/emr/printable-form/Header.vue'
import Footer from '@/components/emr/printable-form/Footer.vue'
import html2canvas from 'html2canvas'
// import jsPDF from 'jspdf'

export default {    
    props: ['jspdf', 'data', 'doctor_notes', 'emr_params'],

    components: {
        Header,
        Footer,
    },

    data() {
        return {
            show_dialog: false,
            is_edit_forms: false,
            print_own: false,
            purposes: '',
            diagnosis: ''
        }
    },

    methods: {
        editForms() {
            this.is_edit_forms = !this.is_edit_forms
        },

        print() {
            window.scrollTo(0, 0);
            window.print();
        },

        close() {
            this.$emit('close'); 
        },

        saveAsPDF() {
            html2canvas(document.getElementById('for-print'), { scale: 2,useCORS: true }).then((canvas) => {
                const doc = new this.jspdf({ orientation: 'portrait', unit: 'mm',format: 'letter' });
                const margin = 0.5;
                const page_width = doc.internal.pageSize.getWidth();
                const page_height = doc.internal.pageSize.getHeight();
                const img_width = page_width - (margin * 2);
                const img_height = (canvas.height * img_width) / canvas.width;
                const img_data = canvas.toDataURL('image/png');

                let heigh_left = img_height;
                let position = margin;

                doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
                heigh_left -= page_height;

                while (heigh_left > 0) {
                position = heigh_left - img_height + margin;
                doc.addPage();
                doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
                heigh_left -= page_height;
                }

                let file_name = `PATIENT ${this.data.patient_name} MED CERT ${this.$moment().format('MM-DD-YYYY hh_mm A')}`;
                doc.save(file_name + '.pdf');
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
.prc-license{
    border-bottom: 1px solid grey;
    display: inline-block;
    width: 190px;
    text-align: center;
}

@media print {
    body * {
        background: white;
        position: relative;
        width: 100%;
        /* color: rgb(0, 61, 91); */
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

    .docu {
        color: #000000;
    }
}
</style>