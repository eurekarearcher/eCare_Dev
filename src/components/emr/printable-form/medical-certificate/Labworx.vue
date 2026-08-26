<template>
    <v-card id="for-print-absolute" class="elevation-0">
        <div id="for-print" class="pa-8 body-font">
            <!-- MEDICAL CERTIFICATE FOR LABWORX -->
            <Header />
            <v-divider class="border-bottom mt-2"></v-divider>

            <!-- Date Section -->
            <v-row class="mt-5" justify="end" dense>
                <v-col class="d-flex align-baseline" cols="12" xs="3" sm="3" md="3" lg="3">
                    <label class="body-2 font-weight-medium mx-2">Date:</label>
                    <span class="body-2 font-weight-medium date_admitted"> {{ data.date_admitted }} </span>
                </v-col>
            </v-row>

            <v-row class="my-2 mt-4 ma-0 pa-0" align="center" justify="end" dense>
                <v-col cols="12">
                    <h1 class="title text-center body-1">
                        <span class="border-bottom">MEDICAL CERTIFICATE</span>
                    </h1>
                </v-col>
            </v-row>

            <!-- Greeting Section -->
            <v-row align="baseline" class="my-2" justify="center" dense>
                <v-col cols="12" class="d-flex align-baseline">
                    <h3 class="text-start body-2 font-weight-medium">To whom it may concern:</h3>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col align-self="center" cols="12">
                    <h4 class="font-weight-regular text-start body-1">
                        <v-row align="baseline" justify="center" dense>
                            <v-col align-self="center" cols="12" class="body-2">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is to certify that 
                                <span class="font-weight-medium body-2 patient">{{ data.patient_name }}</span>, <span class="font-weight-medium body-2 age"> {{ data.patient_age }} </span> years old, 
                                <span class="body-2"> {{ data.patient_gender }} </span>  residing at <span class="font-weight-medium body-2 mt-2 address">{{ data.address }}</span> 
                                <span class="body-2">was seen and examined by the undersigned due to</span> <span class="font-weight-medium mt-2 body-2 complaint"> {{ data.chief_complaint }} </span>
                            </v-col>
                        </v-row>
                    </h4>
                </v-col>
            </v-row>

            <v-row class="my-2" align="baseline" justify="start" dense>
                <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                    <span class="font-weight-medium body-2">Impression/Diagnosis:</span>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="px-12">
                    <h6 v-if="data.impression_diagnosis.length === 0" class="white--text border-bottom">.</h6>
                    <h6 v-else v-for="(value, index) in data.impression_diagnosis" :key="index" class="body-2 border-bottom impression-diagnosis mt-3">{{ value.icd_code + '/' + value.icd_description }}</h6>
                </v-col>
            </v-row>

            <v-row class="my-2" align="baseline" justify="start" dense>
                <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                    <span class="font-weight-medium body-2">Advised/Recommendation:</span>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="px-12">
                    <div v-if="input_remarks">
                        <v-textarea v-model="input_remarks_field" :readonly="!input_remarks" :style="input_remarks" underlined hide-details dense></v-textarea>
                    </div>

                    <div v-else class="d-block">
                        <pre class="recommendation border-bottom mt-3" style="white-space: pre-wrap;">{{ input_remarks_field }}</pre>
                    </div>
                </v-col>
            </v-row>

            <!-- Certification Disclaimer -->
            <v-row align="baseline" dense>
                <v-col cols="12">
                    <span class="d-flex mt-10 body-2 font-weight-normal cert">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This certificate is issued upon the request of the above-named patient for whatever purpose it may serve excluding for medico-legal matters. Thank you!
                    </span>
                </v-col>
            </v-row>

            <v-row class="mt-10" justify="end" align="end" dense>
                <v-col class="text-center" sm="4" md="4" lg="4" offset-sm="12" offset-md="12" offset-lg="12">
                    <h4 class="font-weight-medium border-bottom body-2">{{ this.textCapitalize(data.doctor_name) }}</h4>
                    <h4 class="font-weight-regular body-2" style="font-size: 12px !important;">{{ data.doctor_specialization}}</h4>
                    <h4 class="font-weight-regular body-2 text-no-wrap" style="font-size: 12px !important;">License Number: <span class="border-bottom">{{data.doctor_prc_license }}</span></h4>
                </v-col>
            </v-row>

        </div>

        <Footer :is_medical_certificate="true" :input_remarks="input_remarks" @editForms="editForms" @saveAsPDF="handleSavePDF" @print="print" @close="close" />
    </v-card>
</template>

<script>
import Header from '@/components/emr/printable-form/Header.vue'
import Footer from '@/components/emr/printable-form/Footer.vue' 

export default {
    props: ['data', 'emr_params'],

    components: {
        Header,
        Footer
    },

    data() {
        return {
            input_remarks: false,
            input_remarks_field: '',
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

        handleSavePDF() {
            this.generatePDF('for-print', `PATIENT ${this.data.patient_name} MED CERT ${this.$moment().format('MM-DD-YYYY hh_mm A')}`)
        }
    }
}
</script>

<style scoped>

.body-font {
    font-family: 'Calibri'!important;
}

.readonly {
    pointer-events: none;
}

.date_admitted{
    font-size: 12px !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    width: 300px;
    text-align: center;
}

.patient {
    font-size: 12px !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 440px;    */
    width: 435px;
}
.age{
    font-size: 12px !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 50px;   */
    width: 50px;
    text-align: center;
}
.address{
    font-size: 12px !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 625px;   */
    width: 625px;
}
.complaint{
    font-size: 12px !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 403px;  */
    width: 403px;
}
.impression-diagnosis{
    font-size: 12px !important;
    height: 24px;
}
.recommendation{
    font-size: 11pt !important;
    min-height: 24px;
}
.cert{
    font-size: 11pt !important;
}

.title {
    font-family: 'Calibri'!important;
    font-size: 22pt !important;
    font-weight: bold !important;
}
.border-bottom{
    border-bottom: 1px solid grey; 
    /* margin: 18pt 0 0 8pt;  */
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

    .patient {
        width: 340px !important;
    }
    .age{
        width: 54px !important;
        text-align: center;
    }
    .address{
        width: 537px !important;
    }
    .complaint{
        width: 315px !important;
    }
    .date_admitted{
        width: 550px !important;
    }
}
</style>