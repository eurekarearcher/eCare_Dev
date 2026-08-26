<template>
    <v-card id="for-print-absolute" width="1400" class="elevation-0">
        <div id="for-print" class="pa-8">
            <v-sheet class="antipolo-med-cert"> 
                <Header :class="print_own ? 'remove-print-item' : ''"/>

                <v-row class="my-2 mt-4 ma-0 pa-0" align="center" justify="end" dense>
                    <v-col cols="12">
                        <h1 class="title text-center">
                            MEDICAL CERTIFICATE
                        </h1>
                    </v-col>
                </v-row>

                <v-row class="mt-4" align="center" justify="end" dense>
                    <v-col sm="1" md="1" lg="2"></v-col>

                    <v-col class="text-center mt-4" sm="3" md="3" lg="2">
                        <h6 :class="print_own ? 'remove-print-item' : ''" class="border-bottom body-2"> <span class="display-print-item"> {{ data.date_admitted }} </span></h6>
                        <h6 :class="print_own ? 'remove-print-item' : ''" class="font-weight-medium body-2 mt-1">Date</h6>
                    </v-col>
                </v-row>

                <v-row :class="print_own ? 'remove-print-item' : ''" align="baseline" class="my-2" justify="center" dense>
                    <v-col cols="12" class="d-flex align-baseline">
                        <h3 class="text-start body-2 font-weight-medium">To whom it may concern:</h3>
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col align-self="center" cols="12">
                        <h4 class="font-weight-regular text-start body-1">
                            <v-row align="baseline" justify="center" dense>
                                <v-col align-self="center" cols="12" class="body-2">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :class="print_own ? 'remove-print-item' : ''">This is to certify that </span>
                                    <span class="font-weight-medium body-2 mt-7 patient display-print-item">{{ data.patient_name }}</span>, <span class="font-weight-medium body-2 display-print-item age"> {{ data.patient_age }} </span> years old, 
                                    <span :class="print_own ? 'remove-print-item' : ''">and presently residing at </span><span :class="print_own ? 'remove-print-item' : ''" class="font-weight-medium display-print-item body-2 mt-7 address">{{ data.address }}</span> 
                                    <span :class="print_own ? 'remove-print-item examined' : 'examined'" class="body-2 d-flex justify-center mt-7">was thoroughly examined by the undersigned for</span> 

                                    <div v-if="print_own" :class="[print_own ? 'undersign_text' : 'mt-5', 'px-1 body-2 d-block print-border-bottom']">
                                        <pre class="body-2 undersign_text"> {{ data.input_undersigned_field }} </pre>
                                    </div>   
                        
                                    <div v-else class="px-1 body-2 d-block mt-3">
                                        <v-text-field v-model="data.input_undersigned_field" :readonly="!input_undersigned" :class="{'readonly': !input_undersigned}" hide-details dense ></v-text-field>
                                    </div>    

                                    <div :class="print_own ? 'remove-print-item' : ''" class="font-weight-medium align-end d-flex body-2 mt-7 mb-4">
                                        &nbsp;<v-divider class="darken-1 grey mr-2"></v-divider>
                                    </div>
                                </v-col>
                            </v-row>
                        </h4>
                    </v-col>
                </v-row>

                <div :class="print_own ? 'remove-print-item' : ''" class="font-weight-medium align-end d-flex body-2 mt-4">
                    <h6 class="font-weight-medium body-1 mr-2">Remarks:</h6>
                </div>

                <div v-if="input_remarks" class="mt-7">
                    <v-textarea name="input-1-1" v-model="data.input_remarks_field" :readonly="!input_remarks" :style="input_remarks" outlined hide-details dense></v-textarea>
                </div>

                <div v-else class="remakrs-field d-block ml-2 mb-15">
                    <pre style="white-space: pre-wrap;">{{ data.input_remarks_field }}</pre>
                </div>

                <v-row :class="print_own ? 'remove-print-item' : ''" class="mt-4" justify="space-between" align="end" dense>
                    <v-col align-self="start" cols="12" sm="8" md="8" lg="8">
                        <h6 class="font-weight-medium body-2">Note: <span class="ml-2"> Not valid for MEDICO LEGAL purposes <br/> <span class="ml-12"> Not valid without official seal</span> </span> </h6>
                    </v-col>

                    <v-col align-self="start" class="text-center" cols="12" sm="4" md="4" lg="4" offset-sm="12" offset-md="12" offset-lg="12">
                        <h4 class="font-weight-medium body-2">{{ $store.state.usr_credentials.lgu_host_code === 'BT' || $store.state.usr_credentials.lgu_host_code === 'SJ'? this.textCapitalize(data.doctor_name) : this.textCapitalize(data.doctor_name2 + ", MD.")}}</h4>
                        <h4 class="font-weight-regular body-2" style="font-size: 12pt !important;">{{ $store.state.usr_credentials.lgu_host_code === 'BT' || $store.state.usr_credentials.lgu_host_code === 'SJ'? data.doctor_specialization : data.doctor_position}}</h4>
                        <h4 class="font-weight-regular body-2 text-no-wrap" style="font-size: 12pt !important;">Lic. #:<span>{{ data.doctor_prc_license }}</span></h4>
                        <template v-if="$store.state.usr_credentials.lgu_host_code === 'BT' || $store.state.usr_credentials.lgu_host_code === 'SJ'"> 
                            <v-divider class="darken-1 grey mt-1"></v-divider>
                            <h6  class="font-weight-medium body-2 mt-1">Doctor</h6>
                        </template>
                    </v-col>
                </v-row>
            </v-sheet>

            <v-layout wrap :class="print_own ? 'remove-print-item' : ''" class="mt-2 pl-10 ml-10">
                <!-- Medical Certificate QR Code Section -->
                <v-sheet id="medical-certificate" class="qr-code-med" style="box-shadow: none; border: none;">
                    <QrcodeVue :value="medical_certificate_qr_value" :size="90" renderAs="svg" />
                </v-sheet>
            </v-layout>
            <div v-if="$store.state.usr_credentials.lgu_host_code === 'AT' && !hide_print_own" class="d-print-none mt-4"> 
                <v-checkbox v-model="print_own" label=" Print Own Medical Certificate" hide-details dense> </v-checkbox>
            </div>
        </div>
        <Footer @editForms="editForms" :is_medical_certificate="true" :input_undersigned="input_undersigned" :input_remarks="input_remarks" @saveAsPDF="handleSavePDF" @print="print" @close="close" :emr_params="emr_params"/>
    </v-card>
</template>

<script>
import Header from '@/components/emr/printable-form/Header.vue'
import Footer from '@/components/emr/printable-form/Footer.vue'
import QrcodeVue from 'qrcode.vue';

export default {    
    props: ['doctor_notes', 'select_management', 'data', 'medical_certificate_qr_value', 'emr_params'],

    components: {
        Header,
        Footer,
        QrcodeVue
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
            this.print_own = false
            this.input_undersigned = !this.input_undersigned
            this.input_remarks = !this.input_remarks
        },

        print() {
            // this.print_own = true
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

.title {
    font-size: 22pt !important;
    font-weight: bold !important;
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
    width: 570px;
}
.complaint{
    font-size: 12px !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 403px;  */
    width: 449px;
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
    /* word-spacing: 50px; */
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

    #for-print-absolute {
        position: absolute !important;
        top: 0;
        left: 0;
    }
    .patient {
        width: 225px !important;
    }
    .age{
        width: 50px !important;
        text-align: center;
    }
    .address{
        width: 360px !important;
    }
    .complaint{
        width: 315px !important;
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

    .display-print-item{
        visibility: visible;
    }
    
    .print-border-bottom {
        border-bottom: none;
    }
}

</style>
