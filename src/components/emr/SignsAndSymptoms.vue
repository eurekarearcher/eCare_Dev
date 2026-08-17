<template>
    <v-row class="body-2" align="baseline" dense>
        <v-col class="pb-1 body-1 mt-4 mb-1 grey--text text--darken-4" cols="12">{{ $route.path === '/emr-consultation/physician-diagnosis-and-treatment-plan' ? '' : '2. ' }}Symptoms <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Senyales at sintomas na nararamdaman)</span></v-col>
        <v-col cols="12" class="pt-0">
            <v-autocomplete v-model="selected_signs_and_symptoms" :items="signs_and_symptoms_items" :disabled="from_migration" :error="required_fields && signs_and_symptoms.data.length == 0" @change="addSASData" item-text="symptom" prepend-inner-icon="mdi-magnify" placeholder="Search for Signs and Symptoms" hide-details outlined return-object dense></v-autocomplete>
            <v-row v-if="signs_and_symptoms.data.length > 0" class="mt-4 pl-4 font-weight-medium body-2" dense>
                <v-col cols="12" sm="6" lg="3" xl="3">Symptom <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Sintomas)</span></v-col>
                <v-col cols="12" sm="6" lg="3" xl="3">Duration<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Tagal)</span></v-col>
            </v-row>
            
            <v-row v-for="(selected, index) in signs_and_symptoms.data" :key="index + 'sas'" class="pl-4 mt-4" align="end" dense>
                <v-col cols="12" sm="6" lg="3" xl="3" class="body-2 grey--text text--darken-4">
                    {{ index + 1 }}. {{ selected.symptom }}
                    {{ selected.symptom === 'PAIN' ? " / " + selected.pain_site : '' }}
                </v-col>
                <template>
                    <v-col cols="auto">
                        <i v-if="selected.symptom === 'NONE'" class="body-2">Not Applicable</i>
                        <v-radio-group v-else v-model="selected.duration" :disabled="from_migration" :error="(required_fields || sas_empty) && !selected.duration" @change="emitData" class="ma-0 pa-0" hide-details row>
                            <v-radio label="2 weeks & up" value="2 weeks & up"></v-radio>
                            <v-radio label="Less than 2 weeks" value="Less than 2 weeks"></v-radio>
                            <div class="d-flex align-center">
                                <v-radio label="Custom" value="Custom"></v-radio>
                                <div class="custom-duration-input">
                                    <v-text-field v-model="selected.custom_duration_input" :disabled="selected.duration !== 'Custom'" :error="(required_fields || sas_empty) && !selected.custom_duration_input" label="Days" maxlength="3" dense hide-details></v-text-field>
                                </div>
                            </div>
                        </v-radio-group>
                    </v-col>
                </template>
                <v-col cols="auto">
                    <v-icon v-if="emr_params.editable" class="remove-icon" :disabled="from_migration"  @click="removeSASData(index)">mdi-delete</v-icon>
                </v-col>
            </v-row>
        </v-col>

        <v-dialog v-model="others.dialog" width="400" persistent>
            <v-card class="pa-5">
                <h6 class="font-weight-regular body-2">Current: {{ others.current }}</h6>
                <v-divider class="my-2"></v-divider>
                <h6 class="font-weight-regular body-2">{{ others.title }}</h6>
                <v-text-field v-model="others.new" @input="others.new = textCapitalize($event)" :placeholder="others.label" hide-details outlined></v-text-field>
                <v-layout justify-end wrap mt-4>
                    <v-btn @click="others.dialog = false" small>CLOSE</v-btn>
                    <v-btn @click="saveSignAndSymptoms('OTHERS')" :disabled="!others.new" class="ml-2" color="primary" small>CONFIRM</v-btn>
                </v-layout>
            </v-card>
        </v-dialog>

        <v-dialog v-model="pain_site.dialog" width="400" persistent>
            <v-card class="pa-5">
                <h6 class="font-weight-regular body-2">Current: {{ pain_site.current }}</h6>
                <v-divider class="my-2"></v-divider>
                <h6 class="font-weight-regular body-2">{{ pain_site.title }}</h6>
                <v-text-field v-model="pain_site.new" @input="pain_site.new = textCapitalize($event)" :placeholder="pain_site.label" hide-details outlined></v-text-field>
                <v-layout justify-end wrap mt-4>
                    <v-btn @click="pain_site.dialog = false" small>CLOSE</v-btn>
                    <v-btn @click="saveSignAndSymptoms('PAIN')" :disabled="!pain_site.new" class="ml-2" color="primary" small>CONFIRM</v-btn>
                </v-layout>
            </v-card>
        </v-dialog>

        <Alert :alert="alert" />

    </v-row>

</template>
<script>
import Alert from "@/components/Alert.vue"
import { signs_and_symptoms_list } from '@/reference/sign-and-symptoms.json'

export default {
    props: ["emr_params", "required_fields", "signs_and_symptoms","from_migration"],

    components: {
      Alert
    },

    data() {
        return {
            signs_and_symptoms_list,

            selected_signs_and_symptoms_filter: [],
            selected_signs_and_symptoms: "",
            custom_duration_input: "",

            others: {
                title: 'OTHERS',
                label: 'Enter the other sign and symptoms here',
                dialog: false,
                current: '',
                new: ''
            },

            pain_site: {
                title: 'PAIN',
                label: 'Enter the pain sign and symptoms here',
                dialog: false,
                current: '',
                new: ''
            },
            
            alert: {},
            translate_language: false,
            sas_empty: false,

            request_data_payload: sessionStorage.getItem('rqnn52ds') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('rqnn52ds'), 'OKM2HN').toString(this.$crypto.enc.Utf8)) : null
        }
    },

    // Return a list of items that are in signs_and_symptoms_list but not in signs_and_symptoms.data
    computed: {
        signs_and_symptoms_items() {
            const filter = this.signs_and_symptoms.data.map(element => element.symptom)
            const result = this.signs_and_symptoms_list.filter(element => !filter.includes(element.symptom))
            return result
        },

    },

    mounted() {
        //CALL THE CONTROLLER AGAIN IF THE REQUEST IF INTERUPTED
        if(this.request_data_payload){
            let function_name = this.request_data_payload.function_name
            
            this[function_name]()
            

            this.disabled_discharged_btn = true
        } else {
            this.disabled_discharged_btn = false
        }
    },

    methods: {
      // Get signs and symptoms
        async getSignsAndSymptoms() {
            if (!this.signs_and_symptoms.fresh_load) {
                let response = await this.$services.getPatientRecordAndTransaction({
                    request_key: "patient_symptoms",
                    transaction_number: this.emr_params.transaction_number
                })

                if (response.status === 200) {
                    this.signs_and_symptoms.data = this.responseDataDecryption(response.data);
                    this.signs_and_symptoms.data.map((data) => {
                        if (data.duration.includes("Custom")) {
                            let duration_split = data.duration.split("-");
                            data.duration = duration_split[0];
                            data.custom_duration_input = duration_split[1].replace("days", "");
                        }
                    });
                    sessionStorage.setItem("l0cx832kd", this.$crypto.AES.encrypt(JSON.stringify(this.signs_and_symptoms), "EMX246"));
                    this.signs_and_symptoms.fresh_load = false;
                    return this.signs_and_symptoms.data;
                } else {
                    this.alert = response.error
                }
            } else {
                return this.signs_and_symptoms.data;
            }
        },


        // UpdateSignsAndSymptopms
        async postData() {
            let payload_data = this.request_data_payload ? this.request_data_payload.request_payload : {
                request_key: "patient_symptoms",
                transaction_number: this.emr_params.transaction_number,
                mem_phic_pin: this.emr_params.mem_phic_pin,
                symptom: this.signs_and_symptoms.data,
                process_by: this.$store.state.usr_credentials.user_name
            }

            this.signs_and_symptoms.data.map(data => {
                if(data.duration.includes('Custom')) {
                    data.duration = data.duration + "-" + data.custom_duration_input + "days"
                    delete data.custom_duration_input
                }
            })

            payload_data = this.request_data_payload ? this.request_data_payload.request_payload : payload_data

            let response = await this.$services.trnUpdatePatientTranRecord(payload_data, 'postData')

            if (response.status === 200) {
                sessionStorage.removeItem("l0cx832kd");
                return true;
            } else {
                this.alert = response.error
            }
        },

        checkIfEmpty() {
            let has_empty = false;

            // Iterate through each selected object in signs_and_symptoms.data
            this.signs_and_symptoms.data.forEach(selected => {
                if (!selected.duration || (selected.duration === 'Custom' && !selected.custom_duration_input)) {
                    has_empty = true;
                    this.sas_empty = true
                }
            });


            return has_empty;
        },

        addSASData(data) {

            // Set the data object to empty strings
            if (data.symptom === "NONE") {
                this.signs_and_symptoms.data = [{
                    duration: "",
                    symptom: "NONE",
                    symptoms_id: ""
                }]

                this.selected_signs_and_symptoms_filter = ["NONE"];
            } else if (data.symptom === 'OTHERS') {
                this.others.dialog = true
            } else if(data.symptom === "PAIN") {
                this.pain_site.dialog = true
            } else {
                this.signs_and_symptoms.data.push({
                    duration: "",
                    symptom: data.symptom,
                    symptoms_id: data.symptoms_id,
                });

                this.selected_signs_and_symptoms_filter.push(data);
                this.filterSignAndSymptoms();
            }
                this.emitData();
            
            this.selected_signs_and_symptoms = {}
        },

        // Remove data for signs and symptoms
        removeSASData(index) {
            this.selected_signs_and_symptoms_filter = this.selected_signs_and_symptoms_filter.filter((item) => item !== this.signs_and_symptoms.data[index].symptom)
            this.signs_and_symptoms.data.splice(index, 1)
            this.emitData();
        },

        //Save Others
        saveSignAndSymptoms(sign_and_symptoms) {
            if(sign_and_symptoms === 'OTHERS'){
                this.signs_and_symptoms.data.push({
                    symptom: this.others.new,
                    symptoms_id: 'X'
                })

                this.others.new = ''
                this.others.dialog = false
            } else {
                this.signs_and_symptoms.data.push({
                    symptom: 'PAIN',
                    pain_site: this.pain_site.new,
                    symptoms_id: '38',
                    duration: ''
                })
                this.pain_site.dialog = false
            }
            
            this.filterSignAndSymptoms()
        },

        filterSignAndSymptoms() {
            this.selected_signs_and_symptoms_filter = this.selected_signs_and_symptoms_filter.filter((item) => item !== "NONE")
            this.signs_and_symptoms.data = this.signs_and_symptoms.data.filter((item) => item.symptom !== "NONE")
        },

        emitData() {
            const data = {
                signs_and_symptoms: this.signs_and_symptoms.data
            }
            
            if(this.$route.path === '/consultation'){
                this.$emit('addSASData', data)
            }

            sessionStorage.setItem('l0cx832kd', this.$crypto.AES.encrypt(JSON.stringify(this.signs_and_symptoms), 'EMX246'))
            this.$emit("mutationStatus", "sas", data)
        }
    }
}
</script>

<style scoped>
::v-deep .box_shadow > .v-input__control > .v-input__slot {
  box-shadow: 0 5px 2px -2px #cbc5c5bd;
 }
 .text-field-radius {
   border-radius:15px !important
 }
.custom-radio-container {
  display: flex;
  align-items: center;
}
.custom-duration-input {
    margin-top: -5%;
  margin-left: 4px; 
  width: 60px;
}
.remove-icon{
    margin-top: -45% !important;
}
</style>