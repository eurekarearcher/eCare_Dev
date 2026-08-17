<template>
    <v-card id="for-print-absolute" class="elevation-0">
        <div id="for-print" class="pa-8 bg-image">
            <!-- MEDICAL CERTIFICATE FOR SANTA ROSA -->
            <Header :is_medical_certificate="true"/>

            <v-row justify="center" dense class="mt-9">
                <v-col cols="12">
                    <v-row align="baseline" justify="start" dense>
                            This is to certify that &nbsp;
                        <v-col cols="12" class="font-weight-medium ma-0 pa-0 patient  patient" sm="4" md="4" lg="4">
                            {{ data.patient_name }}
                        </v-col>
                        <v-col cols="12" class="font-weight-medium ma-0 pa-0 age  age" sm="1" md="1" lg="1">
                            {{ data.patient_age }} 
                        </v-col>
                        <v-col cols="12" class="font-weight-medium ma-0 pa-0 gender  gender" sm="2" md="2" lg="2">
                            {{ data.patient_gender }} 
                        </v-col>
                        <v-col cols="12" class="font-weight-medium ma-0 pa-0 civil_status  civil-status" sm="2" md="2" lg="2">
                            {{ data.patient_civil_status }} 
                        </v-col>
                        <v-col class=" ma-0 pa-0" sm="3" md="3" lg="3">
                        </v-col>
                        <v-col class="text-small text-left ma-0 pa-0 pt-2" sm="4" md="4" lg="4">
                            (Name)
                        </v-col>
                        <v-col class="text-small ma-0 pa-0" sm="1" md="1" lg="1">
                            (Age)
                        </v-col>
                        <v-col class="text-small ma-0 pa-0" sm="2" md="2" lg="2">
                            (Gender) 
                        </v-col>
                        <v-col class="text-small ma-0 pa-0" sm="2" md="2" lg="2">
                            (Civil Status)
                        </v-col>      
                    </v-row>
                    <!-- <v-row align="baseline" justify="start" dense>
                        <v-col align-self="center" class="font-weight-medium ma-0 pa-0 border-bottom " cols="12" sm="3" md="3" lg="3">
                            {{ data.patient_occupation ? data.patient_occupation : '&nbsp;' }} 
                        </v-col>
                        <v-col cols="12" sm="9" md="9" lg="9">
                            presently residing at  Brgy. <span class="font-weight-medium ma-0 pa-0 "> {{ data.address }}</span> 
                        </v-col>
                        <v-col class="text-small ma-0 pa-0" sm="12" md="12" lg="12">
                            (Occupation)
                        </v-col>  
                    </v-row> -->
                    <v-row align="baseline" justify="start" dense>
                        <v-col align-self="center" cols="12" sm="3" md="3" lg="3" class="ma-0 pa-0">
                            <div class="font-weight-medium occupation">{{ data.patient_occupation ? data.patient_occupation : '\u00A0' }}</div>
                            <div class="text-small d-flex justify-center">(Occupation)</div>
                        </v-col>
                      <span class="address ml-n2">presently residing at Brgy. <span class="font-weight-medium">{{ data.address }}</span></span>
                    </v-row>

                    <v-row align="baseline" justify="start" dense>
                        <v-col cols="12" sm="12" md="12" lg="12">
                            was/is being treated at <span class="font-weight-medium ma-0 pa-0 "> {{ this.$store.state.prv_data.provider_name }}</span> on <span class="font-weight-medium ma-0 pa-0 "> {{ data.date_admitted }}</span>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <v-row dense class="mt-5">
                <v-col cols="12">
                    <div class="flex-grow-1">
                        <span class="font-weight-bold impression-diagnosis">WORKING/FINAL DIAGNOSIS:</span>
                        <h6 v-if="data.impression_diagnosis.length === 0" class="white--text"></h6>
                        <h6 v-else v-for="(value, index) in data.impression_diagnosis" :key="index" class="text-body-1 ">{{ value.icd_code + '/' + value.icd_description }}</h6>
                        <v-divider class="darken-1 grey"></v-divider>
                    </div>
                </v-col>
                <v-col cols="12" class="mt-3">
                    <span class="font-weight-bold impression-diagnosis">RECOMMENDATION/S:</span>
                </v-col>
                <v-col cols="12" style="border: none !important;">
                        <div v-if="input_remarks" class="mt-1">
                            <v-textarea v-model="data.input_diagnose_field" :readonly="!input_diagnose" :style="input_diagnose" outlined hide-details dense></v-textarea>
                        </div>

                        <div v-else class="remakrs-field d-block">
                            <pre style="white-space: pre-wrap;" class="">{{ data.input_diagnose_field }}</pre>
                        </div>
                </v-col>
            </v-row> 
            <v-spacer></v-spacer>

            <v-row dense class="mt-8">
                <!-- <v-col sm="6" md="6" lg="6" class="pt-2">
                    <span>Barring any complication for the above, may require </span> 
                </v-col>
                <v-col sm="3" md="3" lg="3">
                        <div v-if="input_remarks" class="mt-1">
                            <v-text-field v-model="data.input_remarks_field" :readonly="!input_remarks" :class="{'readonly font-weight-bold ': !input_remarks}" hide-details dense></v-text-field>
                        </div>

                        <div v-else class="d-block" style="border-bottom: 1px solid black;">
                            <pre style="white-space: pre-wrap;" class="font-weight-bold "> {{ data.input_remarks_field }} </pre>
                        </div>
                </v-col>
                <v-col sm="3" md="3" lg="3"  class="pt-2">
                    <span class="pt-2">of medical attendance. </span> 
                </v-col>
                <v-col sm="12" md="12" lg="12">
                    <h4 >NOT TO BE USED FOR MEDICO LEGAL PURPOSES</h4>
                </v-col> -->
                <v-col sm="12" md="12" lg="12" class="pt-2">
                    <span>Barring any complication for the above, may require </span> 
                    <div v-if="input_remarks" class="mt-1">
                        <v-text-field v-model="data.input_remarks_field" :readonly="!input_remarks" :class="{'readonly font-weight-bold ': !input_remarks}" hide-details dense></v-text-field>
                    </div>

                    <div v-else class="complication">
                        <pre style="white-space: pre-wrap;" class="font-weight-bold "> {{ data.input_remarks_field }} </pre>
                    </div>
                    <span class="pt-2">of medical attendance. </span> 
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12">
                    <h4 >NOT TO BE USED FOR MEDICO LEGAL PURPOSES</h4>
                </v-col> 
            </v-row>

            <v-row class="mt-16" dense>
                <v-col class="text-center" sm="6" md="6" lg="6" >
                    <h4 class="font-weight-medium body-1 ">{{ data.doctor_name }}</h4>
                    <h4 class="font-weight-regular body-2  ">{{ data.doctor_position}}</h4>
                    <h4 class="font-weight-regular body-2  ">Lic. No. {{data.doctor_prc_license }}</h4>
                    <h4 class="font-weight-regular body-2  ">{{ this.$store.state.prv_data.provider_name}}</h4>
                </v-col>
            </v-row>

            <v-row class="mt-16" dense>
                <v-col class="text-left line-height" sm="6" md="6" lg="6" >
                    This certification is requested by:
                    <v-col class="text-center line-height  ma-0 pa-0">
                        <h4 class="font-weight-medium body-1 border-bottom  pt-5">{{ this.textCapitalize(data.patient_name) }}</h4>
                    </v-col>
                    <v-col class=" text-center line-height ma-0 pa-1">
                        <span class="text-small">(Printed Name Over Signature)</span>
                    </v-col>
                </v-col>
                <v-col class="text-center px-10" sm="6" md="6" lg="6" >
                    <h6 class="body-2">For verification, visit the intelogram.ph/index.ph#tracking and enter the SERIAL NUMBER.</h6>
                    <h6 class="mt-5 body-2">(Invalid without seal and hologram sticker)</h6>
                </v-col>
            </v-row>

        </div>

        <Footer @editForms="editForms" @saveAsPDF="handleSavePDF" :is_medical_certificate="true" :input_diagnose="input_diagnose" :input_remarks="input_remarks" @print="print" @close="close" :emr_params="emr_params"/>
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
            input_remarks: false,
        }
    },

    methods: {
        editForms() {
            this.input_diagnose = !this.input_diagnose,
            this.input_remarks = !this.input_remarks
        },

        print() {
            window.scrollTo(0, 0);
            window.print();
        },

        close() {
            this.$emit('close'); 
            this.input_diagnose = false;
            this.input_remarks = false;
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
    border: none !important;
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
    /* border-bottom: 1px solid grey; */
    display: inline-block;
    /* min-width: 625px;   */
    width: 500px;
}
.occupation{
    font-size: 11pt !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 625px;   */
    width: 170px;
}
.gender{
    font-size: 11pt !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 50px;   */
    width: 50px;
    text-align: center;
}
.civil_status{
    font-size: 11pt !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 50px;   */
    width: 50px;
    text-align: center;
}
.complaint{
    font-size: 11pt !important;
    border-bottom: 1px solid grey;
    display: inline-block;
    /* min-width: 403px;  */
    width: 486px;
}
.complication{
    font-size: 11pt !important;
    border-bottom: 1px solid black;
    display: inline-block;
    /* min-width: 403px;  */
    width: 367px;
}
.text-small{
    font-size: 12px;
}
.line-height{
    line-height: .8;
}
.title {
    font-size: 30pt !important;
    font-weight: medium !important;
}
.border-bottom{
    border-bottom: 1px solid grey; 
    /* margin: 18pt 0 0 8pt; 
    padding: 5pt 0pt 0pt 0pt;  */
    width: 100%;
}
.bg-image {
  position: relative;
  overflow: hidden;
}
pre {
  font-family: 'Roboto', sans-serif !important;
}
.bg-image::before {
  content: "";
  position: absolute;
  top: 25%;
  left: 15%;
  width: 70%;
  height: 70%;
  background: url("~@/assets/card-logo/sta-rosa/logo2.jpg") center/contain no-repeat;
  opacity: 0.1; 
  z-index: 0;
}

.border-bottom, .print-border-bottom {
    border-bottom: 1px solid grey;
    /* margin-top: 13px;  */
    /* padding-top: 2px; */
    width: 100%;
}

.bg-image > * {
  position: relative;
  z-index: 1; 
}
@media print {
    body * {
        background: transparent;
        position: relative;
        width: 100%;
    }

    #for-print-absolute{
        left: 0;
        position: fixed !important; 
        top: 0;
    }
    .print-border-bottom {
        border-bottom: none;
    }
    .complication{
        width: 280px;
    }
    .address{
        width: 295px;
        white-space: nowrap;
    }   
    .occupation{
        width: 150px;
    }
}
</style>