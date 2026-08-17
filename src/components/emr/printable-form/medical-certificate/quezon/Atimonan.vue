<template>
    <v-card id="for-print-absolute" class="elevation-0">
        <div id="for-print" class="pa-8">
            <!-- MEDICAL CERTIFICATE FOR ATIMONAN -->
            <template>
                <Header :is_medical_certificate="true" />

                <v-row class="my-4" align="center" justify="end" dense>
                    <v-col sm="12" md="12" lg="12" class="mt-4">
                        <h2 class="font-weight-medium text-center"> Medical Certificate </h2>
                    </v-col>
                </v-row>

                <v-row class="my-4" align="center" justify="start" dense>
                    <v-col cols="4" sm="2" md="2" lg="2" xl="2">
                        <h6 class="border-bottom body-2 text-center">{{ data.date_admitted }}</h6>
                    </v-col>
                </v-row>

                <v-row class="my-4" align="baseline" justify="center" dense>
                    <v-col cols="10" sm="10" md="10" lg="10" xl="10">
                        <h6 class="font-weight-medium text-start body-2"> To whom it may concern,  </h6>
                    </v-col>
                </v-row>

                <v-row align="baseline" justify="center" dense>
                    <v-col cols="12">
                        <h6 class="font-weight-medium body-2 text-start">
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; I hereby certify that <span class="font-weight-medium border-bottom body-2">{{ data.patient_name }}</span>,
                            <span class="font-weight-medium border-bottom body-2">{{ data.patient_age }}</span> years old, {{ data.patient_gender }}
                            and a resident of <span class="font-weight-medium border-bottom body-2"> {{ data.address }} </span>&nbsp; &nbsp;
                            <span v-if="select_option === 'examined' || select_option === 'telemedicine'">
                                {{ select_option === 'examined' ? 'was seen and examined' : 'was consulted on telemedicine' }} by the undersigned today.
                            </span>
                        </h6>
                    </v-col>
                </v-row>

                <v-row class="my-4" align="baseline" justify="center" dense>
                    <v-col cols="9" sm="9" md="9" lg="8" xl="8">
                        <span class="font-weight-medium impression-diagnosis body-2">Diagnosis:</span>
                        <h6 v-if="data.impression_diagnosis.length === 0" class="white--text">.</h6>
                        <h6 v-else v-for="(value, index) in data.impression_diagnosis" :key="index" class="ml-2 body-2">{{ value.icd_code + '/' + value.icd_description }}</h6>
                    </v-col>
                </v-row>

                <v-row class="my-4" align="baseline" justify="center" dense>
                    <v-col cols="9" sm="9" md="9" lg="8" xl="8">
                        <div class="d-flex align-center">
                            <span class="font-weight-medium body-2">Remarks:</span>
                        </div>
                    </v-col>
                    <v-col cols="8" sm="9" md="9" lg="8" xl="8">
                        <div v-if="input_remarks">
                            <v-textarea name="input-1-1" v-model="input_remarks_field" :readonly="!input_remarks" :style="input_remarks" outlined hide-details dense></v-textarea>
                        </div>

                        <div v-else class="d-block ml-2">
                            <pre style="white-space: pre-wrap;">{{ input_remarks_field }}</pre>
                        </div>
                    </v-col>
                </v-row>

                <v-row class="my-4" align="baseline" justify="center" dense>
                    <v-col cols="10" sm="10" md="10" lg="10" class="px-12">
                        <div class="d-flex mt-12 font-weight-medium body-2 flex-wrap">
                            Issue upon the request of the interested party this
                            <v-text-field v-model="day" class="ma-1 mt-n1 mb-2 px-2 align-center" :readonly="!input_remarks" :style="input_remarks" type="number" hide-details dense style="width: 45px;"></v-text-field>
                            day of
                            <v-text-field v-model="month" class="ma-1 mt-n1 mb-2 px-2 align-center" :readonly="!input_remarks" :style="input_remarks" dense hide-details style="width: 135px;"></v-text-field>
                            for whatever purpose/s it may serve and not for medico-legal/court use.
                        </div>
                    </v-col>
                </v-row>

                <v-row align="baseline" justify="center" dense>
                    <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pt-10">
                        <div class="font-weight-medium align-start d-flex body-2 flex-wrap">
                            <h6 class="font-weight-medium body-2 text-start">
                                {{ data.doctor_name }} <br>
                                {{ data.doctor_position }} <br>
                                {{ data.doctor_prc_license }}
                            </h6>
                        </div>
                    </v-col>
                </v-row>

                <footer class="footer-container">
                    <v-img src="@/assets/atimonan_footer.png" class="footer-image" contain></v-img>
                </footer>
               
            </template>
        </div>

            <div class="radio-group-container d-flex justify-end align-end mr-5">
                <v-radio-group v-model="select_option" class="d-flex align-end" row>
                <v-radio label="Examined" value="examined"></v-radio>
                <v-radio label="Telemedicine" value="telemedicine"></v-radio>
                </v-radio-group>
            </div>
            <Footer @editForms="editForms" :is_medical_certificate="true" @saveAsPDF="saveAsPDF" :input_remarks="input_remarks" @print="print" @close="close" :emr_params="emr_params"/>
    </v-card>
</template>

<script>
import Header from '@/components/emr/printable-form/Header.vue'
import Footer from '@/components/emr/printable-form/Footer.vue'
import html2canvas from 'html2canvas'
// import jsPDF from 'jspdf'

export default {
    props: ['data', 'emr_params', 'jspdf'],

    components: {
        Header,
        Footer,
    },

    data() {
        return {
            show_dialog: false,
            input_remarks: false,
            print_own: false,
            input_remarks_field: '',
            day: '',
            month: '',
            select_option: 'examined'
        }
    },

    methods: {
        editForms() {
            this.input_remarks = !this.input_remarks
        },

        print() {
            window.scrollTo(0, 0);
            window.print();
        },

        close() {
            this.$emit('close'); 
            this.input_remarks = false
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
.border-bottom {
    border-bottom: 1px solid grey;
    margin-top: 13px; 
    padding-top: 2px;
    width: 100%;
}

.impression-diagnosis {
    width: 160px;
}

.text-no-wrap {
    white-space: nowrap;
}

.footer-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.footer-image {
    max-width: 100%;
    height: auto;
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

    #for-print-absolute {
        left: 0;
        position: absolute !important; 
        top: 0;
    }

    .radio-group-container {
        display: none !important;
    }
}
</style>

