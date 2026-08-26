<template>
    <v-dialog :value="display_doctor_referral" width="1500" persistent>
        <div id="for-print-absolute">
            <v-card  id="for-print-relative" class="elavation-0 px-8 pt-8 pb-3" flat>
                <div v-if="loading_referral_data" class="text-center">
                    <div class="my-16">
                        <v-progress-circular color="primary" size="100" indeterminate></v-progress-circular>
                        <h4 class="light-blue--text text--darken-4 mt-10 pl-5">Loading... Please wait...</h4>
                    </div>
                </div>
                <div v-else id="print-sta-rosa-referral"> 
                    <Header />
                    <v-divider class="mt-4"></v-divider>

                    <h3 class="text-center mt-4">INTER-HEALTH FACILITY REFERRAL SLIP</h3>

                    <v-row dense>
                        <v-col class="d-flex align-baseline" cols="12" xs="5" sm="5" md="5" lg="5">
                            <label class="body-2 font-weight-regular">Control Number:</label>
                            <v-text-field v-model="control_no" class="mx-2 body-2" hide-details dense></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row align="baseline" dense>
                        <v-col class="d-flex align-baseline" cols="12" xs="8" sm="8" md="8" lg="8">
                            <label class="body-2 font-weight-regular">Referred to:</label>
                            <v-text-field v-model="referred_to" class="mx-2 body-2" hide-details dense></v-text-field>
                        </v-col>

                        <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                            <label class="body-2 font-weight-regular">Date:</label>
                            <span class="body-2 border-bottom text-center font-weight-regular">{{ referral_date }}</span>
                        </v-col> 
                    </v-row>

                    <v-row class="mt-4" align="baseline" dense>
                        <v-col class="align-baseline d-flex" cols="12" xs="12" sm="12" md="12" lg="12">
                            <label class="font-weight-regular text-no-wrap body-2">Health Facility:</label>
                            <!-- <v-combobox v-model="referral_doctor_provider_name" :items="provider_items" :loading="loading_provider" @change="$emit('selectProvider')" class="d-print-none border-bottom body-2 mx-2" item-text="name" hide-details dense>{{ referral_doctor_provider_name }}</v-combobox>
                            <span class="d-print-block d-none input--border body-2">{{ referral_doctor_provider_name }}<span class="white--text">.</span></span> -->
                            <v-combobox :value="referral_doctor_provider_name" @input="$emit('update:referral_doctor_provider_name', $event)" :items="provider_items.map(p => p.name)" :loading="loading_provider" class="d-print-none border-bottom body-2 mx-2" hide-details hide-no-data dense>{{ referral_doctor_provider_name }}</v-combobox>
                            <span class="d-print-block d-none input--border body-2">{{ referral_doctor_provider_name }}<span class="white--text">.</span></span>
                        </v-col>
                    </v-row>

                    <v-row align="baseline" dense>
                        <v-col class="align-baseline d-flex" cols="12" xs="6" sm="6" md="6" lg="6">
                            <pre class="font-weight-regular body-2">Patient Name:</pre>
                            <span class="input--border body-2">{{ patient_info.mem_first_name + ' ' + (patient_info.mem_middle_name ? patient_info.mem_middle_name : '') + ' ' + patient_info.mem_last_name + ' ' + (patient_info.mem_suffix ? patient_info.mem_suffix : '') }}</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="2" sm="2" md="2" lg="2"> 
                            <label class="font-weight-regular body-2">Age:</label>
                            <span class="border-bottom body-2">{{ getAge(patient_info.mem_birthdate) }}</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="3" sm="4" md="4" lg="4"> 
                            <label class="font-weight-regular body-2">Occupation:</label>
                            <span class="border-bottom body-2">{{ patient_info.occupation }}</span>
                        </v-col>
                    </v-row>

                    <v-row align="baseline" dense>
                        <v-col class="align-baseline d-flex" cols="12" xs="6" sm="6" md="6" lg="6">
                            <pre class="font-weight-regular body-2">Address:</pre>
                            <span class="border-bottom body-2">{{ (patient_info.mem_home_bldgno ? patient_info.mem_home_bldgno + ' ' : '') + (patient_info.mem_home_bgy ? patient_info.mem_home_bgy + ' ' : '') + (patient_info.mem_home_city_municipality ? patient_info.mem_home_city_municipality + ' ' : '') + (patient_info.mem_home_province ? patient_info.mem_home_province + ' ' : '') + (patient_info.mem_home_zip ? patient_info.mem_home_zip + ' ' : '') }}</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="2" sm="2" md="2" lg="2"> 
                            <label class="font-weight-regular body-2">Sex:</label>
                            <span class="border-bottom body-2">{{ textCapitalize(patient_info.mem_gender) }}</span>
                        </v-col>

                        <v-col class="align-baseline d-flex" cols="12" xs="4" sm="4" md="4" lg="4"> 
                            <pre class="font-weight-regular body-2">Civil Status:</pre>
                            <span class="border-bottom body-2">{{ patient_info.mem_civil_status }}</span>
                        </v-col>
                    </v-row>

                    <v-row align="baseline" dense>
                        <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                            <pre class="body-2 font-weight-regular">Philhealth No:</pre>
                            <span class="body-2 border-bottom  font-weight-regular">{{ (patient_info.mem_phic_pin ? patient_info.mem_phic_pin : '&nbsp;') }}</span>
                        </v-col>

                        <v-col class="d-flex align-baseline" cols="12" xs="5" sm="5" md="5" lg="5">
                            <label class="body-2 font-weight-regular">Family No:</label>
                            <v-text-field v-model="family_no" class="mx-2 body-2" hide-details dense></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row align="baseline" dense>
                        <v-col class="d-flex align-baseline my-1" cols="12" xs="12" sm="12" md="12" lg="12">
                            <label class="body-2 font-weight-bold">BRIEF CLINICAL HISTORY AND PHYSICAL EXAMINATION(including present and past history):</label>
                        </v-col>
                    </v-row>

                    <v-row align="baseline" dense>
                        <v-col class="d-flex align-baseline" cols="12" xs="7" sm="7" md="7" lg="7">
                            <label class="body-2 font-weight-medium ">Medical History:</label>
                        </v-col>
                    </v-row>

                    <v-row align="baseline" dense>
                        <v-col cols="12" xs="7" sm="7" md="7" lg="7">
                            <div v-if="family_medical_history.length">
                                <span class="ma-0 pa-0 body-2">Family Medical History:</span>
                                <ul class="ma-0 pa-0 body-2 mx-5">
                                    <li v-for="(item, index) in family_medical_history" :key="index">{{ item.description }} ({{ item.classification || 'N/A' }})</li>
                                </ul>
                            </div>

                            <div v-if="past_medical_history.length">
                                <span class="ma-0 pa-0 body-2">Past Medical History:</span>
                                <ul class="ma-0 pa-0 body-2 mx-5">
                                    <li v-for="(item, index) in past_medical_history" :key="index">{{ item.description }}</li>
                                </ul>
                            </div>
                        </v-col>
                    </v-row>

                    <h6 class="font-weight-medium body-2 mb-1 ">Physical Examination:</h6>

                    <div class="my-1 ma-0 pa-0">
                        <v-row align="baseline" dense>
                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3"> 
                                <label class="font-weight-regular body-2">BP:</label>
                                <span v-if="pex_data.bp_systolic && pex_data.bp_diastolic" class="input--border body-2">{{ pex_data.bp_systolic }}/{{ pex_data.bp_diastolic }}</span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>
                        
                            <v-col class="align-baseline text-no-wrap d-flex" cols="12" xs="3" sm="3" md="3" lg="3"> 
                                <label class="font-weight-regular body-2">BP 2nd Reading:</label>
                                <span v-if="pex_data.bp_2nd_systolic && pex_data.bp_2nd_diastolic" class="input--border body-2">{{ pex_data.bp_2nd_systolic }}/{{ pex_data.bp_2nd_diastolic }}</span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>

                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3">
                                <label class="font-weight-regular body-2">HR:</label>
                                <span v-if="pex_data.heart_rate" class="input--border body-2">{{ pex_data.heart_rate }}</span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>

                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3">
                                <label class="font-weight-regular body-2">RR:</label>
                                <span v-if="pex_data.respiration_rate" class="input--border body-2">{{ pex_data.respiration_rate }}</span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>
                        </v-row>

                        <v-row align="baseline" dense>
                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3">
                                <label class="font-weight-regular body-2">Temp:</label>
                                <span v-if="pex_data.temp" class="input--border body-2">{{ pex_data.temp }}</span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>

                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3">
                                <label class="font-weight-regular body-2">O2Sat:</label>
                                <span v-if="pex_data.o2sat" class="input--border body-2">{{ pex_data.o2sat }}</span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>

                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3">
                                <label class="font-weight-regular body-2">HT:</label>
                                <span v-if="pex_data.height === 'Decryption Failed'" class="input--border body-2 white--text">.</span>
                                <span v-else-if="pex_data.height" class="input--border body-2">{{ pex_data.height }} <span class="text--secondary">(cm)</span></span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>

                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3">
                                <label class="font-weight-regular body-2">WT:</label>
                                <span v-if="pex_data.weight === 'Decryption Failed'" class="input--border body-2 white--text">.</span>
                                <span v-else-if="pex_data.weight" class="input--border body-2">{{ pex_data.weight }} <span class="text--secondary">(kg)</span></span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>
                        </v-row>

                        <v-row align="baseline" dense>
                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3">
                                <label class="font-weight-regular body-2">BMI:</label>
                                <span v-if="pex_data.bmi_computation.bmi" class="input--border body-2">{{ pex_data.bmi_computation.bmi }}</span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>

                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3">
                                <label class="font-weight-regular body-2">Remarks:</label>
                                <span v-if="pex_data.bmi_computation.remarks === 'Decryption Failed'" class="input--border body-2 white--text">.</span>
                                <span v-else-if="pex_data.bmi_computation.remarks" class="input--border body-2">{{ pex_data.bmi_computation.remarks }}</span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>

                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3">
                                <label class="font-weight-regular text-no-wrap body-2">Central Adiposity:</label>
                                <span v-if="pex_data.central_adiposity" class="input--border body-2">{{ pex_data.central_adiposity === '1' ? 'YES' : 'NO' }}</span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>

                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3">
                                <label class="font-weight-regular text-no-wrap body-2">Waist Circumference:</label>
                                <span v-if="pex_data.waist_circumference" class="input--border body-2">{{ pex_data.waist_circumference }} <span class="text--secondary">(cm)</span></span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>
                        </v-row>

                        <v-row align="baseline" dense>
                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3">
                                <label class="font-weight-regular body-2 text-no-wrap">Left Vision:</label>
                                <span v-if="pex_data.left_vision" class="input--border body-2">{{ pex_data.left_vision }}</span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>

                            <v-col class="align-baseline d-flex" cols="12" xs="3" sm="3" md="3" lg="3">
                                <label class="font-weight-regular body-2 text-no-wrap">Right Vision:</label>
                                <span v-if="pex_data.right_vision" class="input--border body-2">{{ pex_data.right_vision }}</span>
                                <span v-else class="input--border body-2 white--text">.</span>
                            </v-col>
                        </v-row>
                    </div>
                    
                    <v-row align="baseline" dense>
                        <v-col class="d-flex align-baseline " cols="12" xs="4" sm="4" md="4" lg="4">
                            <label class="body-2 font-weight-bold">WORKING IMPRESSION:</label>
                        </v-col>
                    </v-row>

                    <v-row align="baseline" dense>
                        <v-col class="d-flex flex-column align-baseline" cols="12" xs="12" sm="12" md="12" lg="12">
                            <template v-if="$store.state.usr_credentials.department === 'Doctor' || $store.state.usr_credentials.department === 'Midwife'">
                                <template v-if="selected_icd.length > 0 && selected_icd[0].icd_code">
                                    <div v-for="(icd, icd_index) in selected_icd" :key="icd_index" class="pl-4">
                                        <h5 v-if="icd_index === 0" class="font-weight-bold padding--top body-2">Primary Diagnosis</h5>
                                        <h5 v-else-if="icd_index === 1" class="font-weight-bold padding--top body-2 mt-md-1 mt-2">Secondary Diagnosis</h5>
                                        <h5 v-else class="font-weight-bold padding--top body-2 mt-md-1 mt-2">Other Diagnosis</h5>
                                        <h5 class="font-weight-regular padding--top body-2">{{ icd.icd_code }} / {{ icd.icd_description }}</h5>
                                    </div>
                                </template>
                            </template>
                        </v-col>
                    </v-row>

                    <v-row align="baseline" dense>
                        <v-col class="d-flex align-baseline" cols="12" xs="6" sm="6" md="6" lg="6">
                            <label class="body-2 font-weight-bold">ACTION UNDERTAKEN:</label>
                        </v-col>
                    </v-row>

                    <v-row align="baseline" dense>
                        <v-col class="d-flex flex-column align-baseline" cols="12" xs="6" sm="6" md="6" lg="6">
                                <div v-for="(icd, icd_index) in selected_icd" :key="icd_index">
                                    <template v-if="icd.procedures.length > 0">
                                        <h5 class="font-weight-bold padding--top body-2 pl-4">Procedures</h5>
                                        <h5 v-for="(cpt, cpt_index) in icd.procedures" :key="cpt_index" class="font-weight-regular padding--top body-2 pl-6">{{ cpt.cpt_code }} / {{ cpt.cpt_description }}</h5>
                                    </template>
                                </div>
                        </v-col>
                    </v-row>

                    <v-form :readonly="!emr_params.editable" ref="referral_form">
                        <v-row align="baseline" dense>
                            <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                                <label class="body-2 font-weight-bold">REASON FOR REFERRAL:</label>
                            </v-col>
                        </v-row>
                        
                        <v-row align="baseline" dense>
                            <v-col class="d-flex align-baseline " cols="12" xs="12" sm="12" md="12" lg="12">
                                <v-textarea :value="reason_for_referral" @input="$emit('update:reason_for_referral', $event)" :rules="emr_params.editable ? [v => !!v || 'Referral Reason is required'] : []" @blur="$emit('mutationStatus','referral')" class="mx-4 body-2" flat outlined dense />
                                <!-- <v-textarea name="input-1-1" v-model="reason_referral" auto-grow rows="2"  hide-details flat dense></v-textarea> -->
                                <!-- <v-text-field :value="reason_for_referral" @input="$emit('update:reason_for_referral', $event)" :rules="emr_params.editable ? referral_rules : []" @blur="$emit('mutationStatus','referral')" class="d-print-none body-2" hide-details dense></v-text-field> -->
                                <!-- <span class="d-print-block d-none input--border body-2">{{ reason_for_referral }}<span class="white--text">.</span></span> -->
                            </v-col>
                        </v-row>
                    </v-form>

                    <v-row align="baseline" dense>
                        <v-col cols="12" xs="5" sm="5" md="5" lg="5">
                            <label class="body-2 font-weight-bold">Referred by:</label>
                            <!-- <span class="body-2 border-bottom text-center font-weight-regular">Dr. {{ textCapitalize(doctor_data.first_name ? doctor_data.first_name : '') }} <span> {{ textCapitalize(doctor_data.middle_name ? doctor_data.middle_name : '') }}</span>{{ textCapitalize(doctor_data.last_name ? doctor_data.last_name : '') }}</span> -->
                            <span v-if="emr_params.routes === 'EMRConsultation'" class="body-2 border-bottom text-center font-weight-regular">Dr. {{ textCapitalize(doctor_data.first_name ? doctor_data.first_name : '') + ' ' + textCapitalize(doctor_data.middle_name ? doctor_data.middle_name : '') + ' ' + textCapitalize(doctor_data.last_name ? doctor_data.last_name : '') }}</span>
                            <div class="font-weight-bold body-2 d-flex align-baseline justify-center">Printed Name and Signature</div>
                        </v-col>
                    </v-row>
                </div>

                <div class="d-print-none">
                    <template v-if="$store.state.usr_credentials.department === 'Midwife' && !emr_params.editable"> 
                        <v-row justify="end" dense>
                            <v-col class="text-right" cols="12" lg="4">
                                <v-btn @click="close" class="my-2">
                                    CLOSE   
                                    <v-icon size="20" right>mdi-close</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>
                    <template v-else> 
                        <v-row v-if="!emr_params.editable" justify="end" dense>
                            <v-col class="text-right" cols="12" lg="4">
                                <v-btn @click="close" class="my-2">
                                    CLOSE   
                                    <v-icon size="20" right>mdi-close</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <Footer v-else @saveAsPDF="saveAsPDF" @print="printReferralForm" @close="close" :emr_params="emr_params"/>
                    </template>
                </div>
            </v-card>  
        </div>
        <Alert :alert="alert"/>
    </v-dialog>
</template>

<script>
import Alert from '@/components/Alert.vue'
import Header from '@/components/emr/printable-form/Header.vue';
import Footer from '@/components/emr/printable-form/Footer.vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
    props: ['date_admitted', 'patient_info', 'emr_params', 'chief_complaint', 'pex_data', 'selected_icd', 'selected_medicine', 'doctor_data', 'reason_for_referral', 'referral_empty_fields', 'referral_status',
    'referral_date', 'loading_provider', 'provider_items', 'loading_referral_data', 'referral_doctor_provider_name', 'eligible_data', 'display_doctor_referral' , 'family_medical_history', 'past_medical_history'],

    components: {
        Alert,
        Header,
        Footer
    },

    data() {
        return {
            alert: {},
            ref_doc_name: this.referral_doctor_provider_name,
            referral_rules: [v => !!v && !/^ *$/.test(v)],

            control_no: '',
            referred_to: '',
            family_no: '',
            is_for_referral: false
        }
    },

    methods: {
        printReferralForm() {
            if (this.$refs.referral_form.validate()) {
                // 1430px is the height of <v-form> to fill the whole page
                // 1111px is the height of <v-form> to fill the page with return slip

                if (this.$refs.referral_form.$el.clientHeight > 1000) {
                    const difference = Math.abs(1430 - this.$refs.referral_form.$el.clientHeight)
                    this.return_slip = difference + 'px'
                }

                setTimeout(() => {
                    this.windowPrint()
                }, 500)
            } else {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Empty Fields', body: 'Please complete all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }
        },
        
        windowPrint() {
            // window.scrollTo(0, 0);
            // window.print();
            setTimeout(() => {
                window.scrollTo(0, 0);
                window.print();
            }, 500)
        },

        close() {
            this.$emit('closeDoctorReferral'); 
        },

        saveAsPDF() {
            if(this.$refs.referral_form.validate()){
                let { mem_first_name, mem_middle_name, mem_last_name } = this.patient_info

                if (this.patient_info) {
                    html2canvas(document.getElementById('print-sta-rosa-referral')).then(function(canvas) {
                        let margin = 12.7; 
                        let img_data = canvas.toDataURL('image/png');
                        let page_width = 216;
                        let page_height = 356;
                        let img_width = page_width - 2 * margin; 
                        let img_height = canvas.height * img_width / canvas.width; 
                        let doc = new jsPDF('p', 'mm', 'legal');
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
                        doc.save(`${mem_first_name} ${mem_middle_name ? mem_middle_name : ''} ${mem_last_name} Referral Form.pdf`);
                    });
                }
            }
        }
    }
}
</script>

<style scoped>
.border-bottom{
    border-bottom: 1px solid grey; 
    margin: 2pt 0 0 8pt; 
    padding: 5pt 0pt 0pt 0pt; 
    width: 100%;
}
.input--border{
    border-bottom: 1px solid grey;
    margin: 18px 0 0 8px;
    width: 100%;
}
.body-2{
    font-size: 11px;
}

@media print{
    body *{
        background: white;
        position: relative;
    }
    #not-for-print{ display: none; }
    #for-print-absolute{
        left: 0;
        position: absolute !important; 
        top: 0;
    }
    #for-print-relative{ padding: 30px !important; }
    .divider{ margin: 15px 0 11px 0; }
    .padding--top{ padding-top: 2px; }
    .input--margin{ margin-top: 2px; }
    .input--border{ margin: 2px 0 0 8px; }
    .referral-code{ margin-left: 8px; }
    .medicine--table{ overflow-x: hidden; }   
    .medicine--header h4{
        font-size: 12px;
        max-width: 116px;
        min-width: 116px;
    }
    .medicine--body{
        font-size: 12px;
        max-width: 116px;
        min-width: 116px;
        padding: 2px 0;
    }
    .return-slip{
        margin-top: 10px;
        opacity: 1;
    }
}
</style>