<template>
    <v-card id="for-print-absolute" class="elevation-0">
        <div id="for-print"  class="pa-8">
            <!-- MEDICAL CERTIFICATE FOR PARAÑAQUE -->
            <Header />

            <v-row class="my-4" align="center" justify="end" dense>
                <v-col cols="12">
                    <h1 class="title text-center body-1">
                        <span class="border-bottom">MEDICAL CERTIFICATE</span>
                    </h1>
                </v-col>
            </v-row>

            <!-- Date Section -->
            <v-row class="my-4" justify="end" dense>
                <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                    <label class="body-2 font-weight-medium">Date:</label>
                    <span class="body-2 border-bottom text-center font-weight-medium">{{ data.date_admitted }}</span>
                </v-col>
            </v-row>

            <!-- Greeting Section -->
            <v-row class="my-4" justify="center" dense>
                <v-col cols="12" class="d-flex align-baseline">
                    <h3 class="text-start">To whom it may concern:</h3>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col align-self="center" cols="12">
                    <h4 class="font-weight-regular text-start body-1">
                        <v-row align="baseline" justify="center" dense>
                            <v-col align-self="center" cols="12" class="body-2">
                                This is to certify that Mr/Ms.
                                <span class="font-weight-medium body-2 patient">{{ data.patient_name }}</span>, <span class="font-weight-medium body-2 age"> {{ data.patient_age }} </span> years old, 
                                <span class="body-2">was seen and examined on</span> <span class="font-weight-medium mt-2 body-2 date_admitted"> {{ data.date_admitted }} </span>
                            </v-col>
                        </v-row>
                    </h4>
                    <h4 class="font-weight-regular text-start body-1">
                        <span class="body-2">due to </span>
                        <template v-if="input_due">
                            <v-text-field v-model="data.input_due_field" :class="{'readonly': !input_due}" :readonly="!input_due" class="due-field" hide-details dense></v-text-field>
                        </template>

                        <template v-else>
                            <span class="complaint font-weight-medium">{{ data.input_due_field ? data.input_due_field : '&nbsp;' }}</span>
                        </template>
                    </h4>
                </v-col>
            </v-row>

            <v-row align="baseline" justify="start" dense>
                <v-col align-self="center" cols="12">
                    <h4 class="font-weight-regular text-start body-1">
                        <span class="body-2">and was diagnosed </span>
                        <template v-if="input_diagnose">
                            <v-text-field v-model="data.input_diagnose_field" :class="{'readonly': !input_diagnose}" :readonly="!input_diagnose" class="diagnose-field" hide-details dense></v-text-field>
                        </template>

                        <template v-else>
                            <span class="diagnose font-weight-medium">{{ data.input_diagnose_field ? data.input_diagnose_field : '&nbsp;' }}</span>
                        </template>
                    </h4>
                </v-col>
            </v-row>

            <!-- Certification Disclaimer -->
            <v-row class="my-8" dense>
                <v-col cols="12" class="px-8">
                    <span class="mt-5">
                        <i class="body-1 font-weight-medium">
                            This certification is issued upon the request of the above-named individual for whatever good purpose it may serve except for medico-legal purposes.
                        </i>
                    </span>
                </v-col>
            </v-row>

            <v-row class="mt-16" justify="end" align="end" dense>
                <v-col cols="3" class="text-center">
                   <span class="font-weight-regular">Respectfully yours,</span> 
                </v-col>
            </v-row>

            <v-row class="mt-10" justify="end" align="end" dense>
                <v-col class="text-center" sm="4" md="4" lg="4" offset-sm="12" offset-md="12" offset-lg="12">
                    <h4 class="font-weight-medium body-1">{{ this.textCapitalize(data.doctor_name) }}</h4>
                    <h4 class="font-weight-regular body-2 text-no-wrap" style="font-size: 12px !important;">License Number: <span class="border-bottom">{{data.doctor_prc_license }}</span></h4>
                    <h4 class="font-weight-regular body-2">{{ this.capitalizeString(data.doctor_position)}}</h4>
                    <h4 class="font-weight-regular body-2">{{ data.doctor_specialization}}</h4>
                </v-col>
            </v-row>

        </div>

        <Footer @editForms="editForms" @saveAsPDF="handleSavePDF" :is_medical_certificate="true" :input_diagnose="input_diagnose" :input_due="input_due" @print="print" @close="close" :emr_params="emr_params"/>
    </v-card>
</template>

<script>
import Header from '@/components/emr/printable-form/Header.vue'
import Footer from '@/components/emr/printable-form/Footer.vue'

export default {
    props: ['data', 'doctor_notes', 'emr_params'],

    components: {
        Header,
        Footer,
    },

    data() {
        return {
            input_diagnose: false,
            input_due: false,
            print_own: false,
        }
    },

    methods: {
        editForms() {
            this.input_undersigned = !this.input_undersigned
            this.input_diagnose = !this.input_diagnose,
            this.input_due = !this.input_due
        },

        print() {
            window.scrollTo(0, 0);
            window.print();
        },

        close() {
            this.$emit('close'); 
            this.input_undersigned = false
            this.input_diagnose = false;
            this.input_due = false;
        },

        handleSavePDF() {
            this.generatePDF('for-print', `PATIENT ${this.data.patient_name} MED CERT ${this.$moment().format('MM-DD-YYYY hh_mm A')}`)
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
.date_admitted{
    font-size: 11pt !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    width: 300px;
    text-align: center;
}
.patient {
    font-size: 11pt !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 440px;    */
    width: 435px;
}
.age{
    font-size: 11pt !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 50px;   */
    width: 50px;
    text-align: center;
}
.due-field {
  display: inline-block;
  width: 400px;
}
.complaint {
  display: inline-block;
  width: 400px;
  border-bottom: 1px solid grey;
  font-size: 11pt !important;
}
.diagnose-field {
  display: inline-block;
  width: 400px;
}
.diagnose {
  display: inline-block;
  width: 400px;
  border-bottom: 1px solid grey;
  font-size: 11pt !important;
}
.due-field, .complaint {
  display: inline-block;
  width: 684px;  
}
.diagnose-field, .diagnose {
  display: inline-block;
  width: 600px;  
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

    .patient{
        width: 300px;
    }

    .age{
        width: 50px;
    }

    .date_admitted{
        width: 300px;
    }

    .due-field, .complaint {
        width: 600px;  
    }

    .diagnose-field, .diagnose{
        width: 501px;  
    }
}
</style>