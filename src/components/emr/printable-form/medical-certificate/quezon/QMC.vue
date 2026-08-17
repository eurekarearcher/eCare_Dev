<template>
    <v-card id="for-print-absolute" class="elevation-0">
        <div id="for-print" class="pa-8">
            <Header />

            <v-row class="my-4" justify="space-between" dense>
                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                    <div class="font-weight-medium align-start d-flex body-2">
                        MC No. : <v-divider class="darken-1 grey mx-1 mt-5"></v-divider>
                    </div>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                    <v-divider class="darken-1 grey mx-1 mt-5"></v-divider>
                </v-col>
            </v-row>

            <v-row class="my-4" align="center" justify="center" dense>
                <v-col cols="12" sm="12" md="5" lg="11" xl="11">
                    <h1 class="font-weight-large text-center"> Medical Certificate </h1>
                </v-col>

                <v-col cols="12" sm="1" md="1" lg="3"></v-col>
            </v-row>

            <v-row class="my-4" align="baseline" dense>
                <v-col cols="12" sm="12" md="12" lg="12">
                    <h6 class="font-weight-medium text-start body-2"> TO WHOM IT MAY CONCERN </h6>
                </v-col>
            </v-row>

            <v-row align="baseline" justify="center" dense>
                <v-col cols="12">
                    <h6 v-if="select_option === 'operation'" class="font-weight-medium body-2 text-start">
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; This is to certify that <span class="font-weight-medium border-bottom body-2">{{ data.patient_name }}</span>,
                        and a resident of <span class="font-weight-medium border-bottom body-2"> {{ data.address }}</span>&nbsp;
                        , has been examined/treated in this hospital on <span class="font-weight-medium border-bottom body-2">{{ data.date_admitted }}</span> at <span class="font-weight-medium border-bottom body-2">{{ $store.state.prv_data.provider_name }}</span>.
                    </h6>
                    <h6 v-else class="font-weight-medium body-2 text-start">
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; This is to certify that 
                        <span class="font-weight-medium border-bottom body-2">{{ data.patient_name }}</span>, <span class="font-weight-medium border-bottom body-2">{{ data.patient_age }}</span>
                        years old,<span class="font-weight-medium border-bottom body-2">{{ data.patient_gender }}</span>,<span class="font-weight-medium border-bottom body-2">{{ data.patient_civil_status }}</span>
                        and a resident of <span class="font-weight-medium border-bottom body-2"> {{ data.address }}</span>&nbsp;, was seen and treated at the <span class="font-weight-medium border-bottom body-2">{{ $store.state.prv_data.provider_name }}</span> 
                        of this hospital on <span class="font-weight-medium border-bottom body-2">{{ data.date_admitted }}</span> at <span class="font-weight-medium border-bottom body-2">{{ $store.state.prv_data.provider_name }}</span>
                        due to injuries she/he sustained from a <span class="font-weight-medium border-bottom body-2">{{ data.chief_complaint }}</span>
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
                        <span v-if="select_option === 'operation'" class="font-weight-medium body-2">Operation:</span>
                        <span v-else class="font-weight-medium body-2">Duration</span>
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

            <v-row align="baseline" justify="center" dense>
                <v-col cols="12">
                    <h6 v-if="select_option === 'operation'" class="font-weight-medium body-2 text-start">
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
                        This certification is being issued upon request of patient 
                        <span class="font-weight-medium border-bottom body-2">{{ data.patient_name }}</span> for whatever purpose/s he/she may deem proper except for medico-legal purposed.
                    </h6>
                </v-col>
            </v-row>

            <v-row class="mt-10" align="baseline" justify="end" dense>
                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                    <h6 class="border-bottom body-2 text-center">{{ data.doctor_name }}</h6>
                    <h6 class="font-weight-medium text-center body-2 mt-1">ATTENDING PHYSICIAN</h6>
                </v-col>
            </v-row>

            <v-row class="my-4" align="baseline" justify="end" dense>
                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                    <div class="font-weight-medium align-start d-flex body-2 text-no-wrap">
                        <h6 class="font-weight-medium body-2">PRC License No. : </h6>
                        <h6 class="border-bottom body-2 text-center mt-n1">{{ data.doctor_prc_license }}</h6>
                    </div>
                </v-col>
            </v-row>
        </div>

        <div class="radio-group-container d-flex justify-start align-center ml-7">
            <v-radio-group v-model="select_option" row>
                <v-radio label="Operation" value="operation"></v-radio>
                <v-radio label="Duration" value="duration"></v-radio>
            </v-radio-group>
        </div>
        <Footer :jspdf="jspdf" :is_medical_certificate="true" :input_remarks="input_remarks" @editForms="editForms" @saveAsPDF="saveAsPDF" @print="print" @close="close" />
    </v-card>
</template>

<script>
import Header from '@/components/emr/printable-form/Header.vue'
import Footer from '@/components/emr/printable-form/Footer.vue'
import html2canvas from 'html2canvas'
// import jsPDF from 'jspdf'

export default {    
    props: ['doctor_notes', 'select_management', 'data', 'select_medical_certificate', 'jspdf'],

    components: {
        Header,
        Footer,
    },

    data() {
        return {
            show_dialog: false,
            input_undersigned: false,
            input_remarks: false,
            input_remarks_field: '',
            select_option: 'operation'
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
.border-bottom, .print-border-bottom {
    border-bottom: 1px solid grey;
    margin-top: 13px; 
    padding-top: 2px;
    width: 100%;
}

.impression-diagnosis {
    width: 160px;
}

.readonly {
    pointer-events: none;
}

.examined {
    word-spacing: 50px;
    text-align: center;
}

.text-no-wrap {
    white-space: nowrap;
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

    .radio-group-container {
        display: none;
    }

    .impression-diagnosis {
        width: 205px;
    }
    
    .print-border-bottom {
        border-bottom: none;
    }
    
}

</style>
