<template>
    <v-card id="for-print-absolute" class="elevation-0">
        <div id="for-print"  class="pa-8">
            <!-- MEDICAL CERTIFICATE FOR BATAAN -->
            <template>
                <Header />

                <v-row class="my-2 mt-4 ma-0 pa-0" align="center" justify="end" dense>
                    <v-col cols="12">
                        <h1 class="title text-center body-1 text-h4 font-weight-medium">
                            <span >MEDICAL CERTIFICATE</span>
                        </h1>
                    </v-col>

                    <v-col sm="1" md="1" lg="2"></v-col>

                    <v-col class="text-center" sm="3" md="3" lg="2">
                        <h6 class="border-bottom body-2">{{ data.date_admitted }}</h6>
                        <h6 class="font-weight-medium body-2 mt-1">Date</h6>
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col align-self="center" cols="12">
                        <h4 class="font-weight-regular text-start body-1">
                            <v-row align="center" justify="center" dense>
                                <v-col align-self="center" cols="12" class="body-2">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is to certify that 
                                    <span class="font-weight-medium body-2 border patient">{{ data.patient_name }}</span>, 
                                    from Brgy. 
                                        <span class="font-weight-medium body-2 mt-2 address">{{ data.address }}</span> 
                                        <h6 class="font-weight-medium text-center body-2 mt-1">Address</h6>

                                    <span class="body-2">, consulted the undersigned due to/for </span> 
                                    <span class="font-weight-medium mt-2 body-2 complaint"> {{ data.chief_complaint }} </span>
                                </v-col>
                            </v-row>
                        </h4>
                    </v-col>
                </v-row>
                
                <v-divider class="darken-1 grey mt-7 mb-2"></v-divider>

                <div class="align-baseline d-flex mt-4">
                    <span class="font-weight-medium impression-diagnosis body-2">Impression / Diagnosis</span>

                    <div class="flex-grow-1">
                        <h6 v-if="data.impression_diagnosis.length === 0" class="white--text">.</h6>
                        <h6 v-else v-for="(value, index) in data.impression_diagnosis" :key="index" class="body-2">{{ value.icd_code + '/' + value.icd_description }}</h6>
                        <v-divider class="darken-1 grey"></v-divider>
                    </div>
                </div>

                <div class="body-2 print-request">
                    This has been upon request of
                    <span v-if="print_own" class="line long-line">
                        {{ data.input_undersigned_field }}
                    </span>

                    <span v-else class="line long-line">
                        <v-text-field v-model="data.input_undersigned_field" :class="{'readonly': !input_undersigned}" hide-details dense class="inline-input"></v-text-field>
                    </span>
                    for
                    <span v-if="print_own" class="line full-line">
                        {{ data.input_remarks_field }}
                    </span>

                    <span v-else class="line full-line">
                        <v-text-field v-model="data.input_remarks_field" :class="{'readonly': !input_remarks}" hide-details dense class="inline-input"></v-text-field>
                    </span>
                    purposes.
                </div>
                
                <h6 class="font-weight-medium body-2 text-center mr-16 mt-1">(Not for medico-legal purposes)</h6>

                <h6 class="font-weight-medium body-2 mt-4">Recommendations:</h6>

                <div v-if="select_management.length >= 1" class="font-weight-medium body-2">
                    <h6 class="font-weight-medium body-2 mt-4">Management Type </h6>
                    <div v-for="(management, key) in select_management" :key="key"> 
                        <span class="body-2 pl-4 pb-2"> {{ management.management_description }} </span> 
                    </div>
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
                            <span class="medicine-item">Dosage/<br>Preparation</span>
                            <span class="medicine-item">Frequency <br> (per day)</span>
                            <span class="medicine-item ">Duration # <br> of days</span>
                            <span class="medicine-item">Total # of Medicine</span>
                            <span class="medicine-item">Remarks</span>
                        </div>

                        <div v-for="(value, index) in data.selected_medicine" :key="index" class="font-weight-regular text-center d-flex mt-2">
                            <span class="medicine-item">{{ value.generic_name }}</span>
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
                        <div v-if="!hide_print_own" class="d-print-none">
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

        </div>

        <Footer @editForms="editForms" :is_medical_certificate="true" :input_undersigned="input_undersigned" :input_remarks="input_remarks" @saveAsPDF="handleSavePDF" @print="print" @close="close" :emr_params="emr_params"/>
    </v-card>
</template>

<script>
import Header from '@/components/emr/printable-form/Header.vue'
import Footer from '@/components/emr/printable-form/Footer.vue'

export default {    
    props: ['doctor_notes', 'select_management', 'data', 'emr_params'],

    components: {
        Header,
        Footer,
    },

    data() {
        return {
            show_dialog: false,
            include_lab_and_prescription: false,
            input_undersigned: false,
            input_remarks: false,
            print_own: false,
            hide_print_own: false,
        }
    },

    methods: {
        editForms() {
            sessionStorage.setItem('imcb2hxgx5', this.$crypto.AES.encrypt(JSON.stringify(this.data), 'NSH153'))

            this.input_undersigned = !this.input_undersigned
            this.input_remarks = !this.input_remarks
        },

        print() {
            window.scrollTo(0, 0);
            window.print();
        },

        close() {
            this.$emit('close'); 
            this.input_undersigned = false
            this.input_remarks = false
        },

        handleSavePDF() {
            this.hide_print_own = true
            this.$nextTick(() => {
                this.generatePDF('for-print', `PATIENT ${this.data.patient_name} MED CERT ${this.$moment().format('MM-DD-YYYY hh_mm A')}`)
                this.hide_print_own = false
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
.patient {
    font-size: 11pt !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 440px;    */
    width: 562px;
}
.age{
    font-size: 11pt !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 50px;   */
    width: 50px;
    text-align: center;
}
.address{
    font-size: 11pt !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 625px;   */
    width: 659px;
}
.complaint{
    font-size: 11pt !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 403px;  */
    width: 486px;
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

.print-request {
  line-height: 28px;
}

.line {
  display: inline-block;
  /* border-bottom: 1px solid black; */
  /* vertical-align: bottom; */
  margin: 0 2px;
}

.long-line {
  width: 533px;
}

.full-line {
  width: 550px; 
}

.inline-input {
  width: 100%;
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

    .v-text-field {
        margin: 0 !important;
        padding: 0 !important;
    }

    .patient {
        width: 448px !important;
    }
    .address{
        width: 545px !important;
    }
    .complaint{
        width: 372px !important;
    }
    .long-line {
        width: 435px;
    }
    .full-line {
        width: 612px; 
    }
}

</style>