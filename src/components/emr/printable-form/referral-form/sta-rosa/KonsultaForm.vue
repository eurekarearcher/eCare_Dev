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

                    <h3 class="text-center mt-4">REFERRAL FORM</h3>

                    <v-row class="ma-0 pa-0" justify="end" dense>
                        <v-col class="d-flex ma-0 pa-0 align-baseline" cols="12" xs="4" sm="4" md="4" lg="4">
                            <label class="body-2 font-weight-medium">Date:</label>
                            <span class="body-2 border-bottom text-center font-weight-medium">{{ referral_date }}</span>
                        </v-col>
                    </v-row>

                    <v-row class="ma-0 pa-0" dense>
                        <v-col class="align-baseline d-flex ma-0 pa-0" cols="9" xs="9" sm="9" md="9" lg="9">
                            <pre class="font-weight-medium body-2">Name of Patient:</pre>
                            <span class="border-bottom body-2">{{ patient_info.mem_first_name + ' ' + (patient_info.mem_middle_name ? patient_info.mem_middle_name : '') + ' ' + patient_info.mem_last_name + ' ' + (patient_info.mem_suffix ? patient_info.mem_suffix : '') }}</span>
                        </v-col>

                        <v-col class="align-baseline d-flex ma-0 pa-0" cols="12" xs="" sm="" md="" lg=""> 
                            <label class="font-weight-medium body-2">Age:</label>
                            <span class="border-bottom body-2">{{ getAge(patient_info.mem_birthdate) }}</span>
                        </v-col>
                    </v-row>

                    <v-row class="ma-0 pa-0" dense>
                        <v-col class="d-flex ma-0 pa-0 align-baseline" cols="12" xs="7" sm="7" md="7" lg="7">
                            <pre class="body-2 font-weight-medium">Philhealth Number:</pre>
                            <span class="body-2 border-bottom">{{ (patient_info.mem_phic_pin ? patient_info.mem_phic_pin : '&nbsp;') }}</span>
                        </v-col>
                    </v-row>

                    <v-row align="baseline" class="mx-2 mt-1">
                        <v-row align="center" class="mt-1 mb-1">
                            <!-- <v-checkbox v-model="patient_info.mem_phic_pin" :true-value="patient_info.mem_phic_pin ? patient_info.mem_phic_pin : '&nbsp;'" :false-value="null" label="Member" class="mx-2 ma-0 pa-0 body-2"></v-checkbox>
                            <v-checkbox v-model="patient_info.mem_phic_pin" :true-value="null" :false-value="patient_info.mem_phic_pin ? patient_info.mem_phic_pin : '&nbsp;'" label="Dependent" class="mx-2 ma-0 pa-0 body-2"></v-checkbox> -->
                            <input onclick="return false" :checked="eligible_data.pPatientType === 'MM'" type="checkbox">
                            <label class="mx-2 body-2" for="vehicle1">MEMBER</label><br/>
                            <input onclick="return false" :checked="eligible_data.pPatientType === 'DD'" type="checkbox">
                            <label class="mx-2 body-2" for="vehicle1">DEPENDENT</label><br/>
                        </v-row>
                    </v-row>

                    <v-row dense>
                        <v-col class="align-baseline d-flex " cols="12" xs="12" sm="12" md="12" lg="12">
                            <label class="font-weight-medium text-no-wrap body-2">Address:</label>
                            <span class="border-bottom body-2">{{ (patient_info.mem_home_bldgno ? patient_info.mem_home_bldgno + ' ' : '') + (patient_info.mem_home_bgy ? patient_info.mem_home_bgy + ' ' : '') + (patient_info.mem_home_city_municipality ? patient_info.mem_home_city_municipality + ' ' : '') + (patient_info.mem_home_province ? patient_info.mem_home_province + ' ' : '') + (patient_info.mem_home_zip ? patient_info.mem_home_zip + ' ' : '') }}</span>
                        </v-col>
                    </v-row>

                    <v-row class="ma-0 pa-0" dense>
                        <v-col class="align-baseline d-flex ma-0 pa-0" cols="12" xs="12" sm="12" md="12" lg="12">
                            <label class="font-weight-bold text-no-wrap body-2">Referral Facility:</label>
                            <!-- <v-combobox v-model="ref_doc_name" :items="provider_items" :loading="loading_provider" @change="$emit('selectProvider')" class="d-print-none body-2 mx-2" item-text="name" hide-details hide-no-data dense></v-combobox>
                            <span class="d-print-block d-none input--border body-2">{{ ref_doc_name }} <span class="white--text">.</span></span> -->
                            <v-combobox :value="referral_doctor_provider_name" @input="$emit('update:referral_doctor_provider_name', $event)" :items="provider_items.map(p => p.name)" :loading="loading_provider" class="d-print-none border-bottom body-2 mx-2" hide-details hide-no-data dense>{{ referral_doctor_provider_name }}</v-combobox>
                            <span class="d-print-block d-none input--border body-2">{{ referral_doctor_provider_name }}<span class="white--text">.</span></span>
                        </v-col>
                        <v-col class="align-baseline d-flex ma-0 pa-0 my-2" cols="12" xs="12" sm="12" md="12" lg="12">
                            <label class="font-weight-medium text-no-wrap body-2">Address:</label>
                            <v-text-field v-model="address_of_facility" class="mx-2 body-2" hide-details dense></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row class="ma-0 pa-0 page-break" dense>
                        <v-col class="align-baseline d-flex ma-0 pa-0" cols="12">
                            <label class="font-weight-bold text-no-wrap body-2">ASSESSMENT:</label>
                        </v-col>
                    </v-row>

                    <v-row align="baseline" class="ma-0 pa-0 page-break" dense>
                        <v-col class="d-flex ma-0 pa-0 flex-column align-baseline" cols="12">
                            <template v-if="$store.state.usr_credentials.department === 'Doctor' || $store.state.usr_credentials.department === 'Midwife'">
                                <template v-if="selected_icd.length > 0 && selected_icd[0].icd_code">
                                    <div v-for="(icd, icd_index) in selected_icd" :key="icd_index" class="pl-4 ma-0 pa-0">
                                        <!-- <h5 v-if="icd_index === 0" class="font-weight-bold padding--top body-2">Primary Diagnosis</h5>
                                        <h5 v-else-if="icd_index === 1" class="font-weight-bold padding--top body-2 mt-md-4 mt-2">Secondary Diagnosis</h5>
                                        <h5 v-else class="font-weight-bold padding--top body-2 mt-md-4 mt-2">Other Diagnosis</h5> -->
                                        <h5 class="font-weight-regular padding--top body-2">{{ icd.icd_code }} / {{ icd.icd_description }}</h5>

                                        <!-- <template v-if="icd.procedures.length > 0">
                                            <h5 class="font-weight-bold padding--top body-2 pl-6">Requested Procedure(s)</h5>
                                            <h5 v-for="(cpt, cpt_index) in icd.procedures" :key="cpt_index" class="font-weight-regular padding--top body-2 pl-6">{{ cpt.cpt_code }} / {{ cpt.cpt_description }}</h5>
                                        </template> -->
                                    </div>
                                </template>
                            </template>
                        </v-col>

                        <div v-if="selected_medicine.length > 0" class="medicine--table pl-4">
                            <h4 class="font-weight-medium body-2 mt-md-4 mt-2 mb-2">Prescribed Medicine</h4>
                            
                            <div class="medicine--header body-2 d-flex ma-0 pa-0 d-row">
                                <h4>Generic Name</h4>
                                <!-- <h4>Brand</h4> -->
                                <h4>Dosage/Preparation</h4>
                                <h4>Frequency</h4>
                                <h4>Duration</h4>
                                <h4>Total # of Medicine</h4>
                                <h4>Remarks</h4>
                            </div>

                            <div v-for="(med, i) in selected_medicine" :key="i" class="align-start d-flex ma-0 pa-0 d-row">
                                <div class="medicine--body body-2">{{ med.generic_name }}</div>
                                <!-- <div class="medicine--body">{{ med.brand_name ? med.brand_name : 'None' }}</div> -->
                                <div class="medicine--body body-2">{{ med.dosage }} / {{ med.preparation }}</div>
                                <div class="medicine--body body-2">{{ med.frequency_of_med }}</div>
                                <div class="medicine--body body-2">{{ med.duration }}</div>
                                <div class="medicine--body body-2">{{ med.total_num_of_med }}</div>
                                <div class="medicine--body body-2">{{ med.notes }}</div>
                            </div>
                        </div>
                    </v-row>

                    <v-row  dense>
                        <v-col class="align-baseline d-flex ma-0 pa-0" cols="12" xs="12" sm="12" md="12" lg="12">
                            <label class="font-weight-bold text-no-wrap body-2">REFERRED TEST/S:</label>
                        </v-col>
                        <v-col class="align-baseline d-flex ma-0 pa-0" cols="12" xs="12" sm="12" md="12" lg="12">
                            <span class="font-weight-medium text-no-wrap body-2">(under Philhealth Yakap Package ONLY)</span>
                        </v-col>
                    </v-row>

                    <v-row  dense>
                        <v-col v-for="(test, index) in referred_tests" :key="index" cols="12" sm="6" md="4" lg="4" class="d-flex align-center" >
                            <input v-model="selected_package" :label="test.label" :value="test.value" class="mt-0 pt-0 ma-0 pa-0" type="checkbox" hide-details dense>
                            <label class="mx-2 body-2" for="vehicle1">{{ test.label }}</label><br/>
                        </v-col>
                    </v-row>

                   <v-row v-if="emr_params.routes === 'EMRConsultation'" justify="end" dense>
                        <v-col cols="12" sm="4" md="4" lg="4" class="text-center">
                            <div class="body-2">
                                {{ (doctor_data.first_name?doctor_data.first_name:'N/a') + ' ' + (doctor_data.middle_name?doctor_data.middle_name:'N/a') + ' ' + (doctor_data.last_name?doctor_data.last_name:'N/a') }}
                            </div>
                            <div class="body-2">
                                <span class="border-bottom">Lic. No. {{ doctor_data.doc_prc_license || 'N/A' }}</span>
                            </div>
                            <div class="font-weight-bold body-2">Attending Physician</div>
                        </v-col>
                    </v-row>
                    
                    <v-divider class="mt-4"></v-divider>
                    
                    <v-row  dense>
                        <v-col class="d-flex ma-0 pa-0 justify-center text-align-center mt-2" cols="12">
                            <i class="text-no-wrap body-2">To be filled out by SRCH Yakap Personnel:</i>
                        </v-col>
                        <v-col cols="6">
                            <label class="body-2">Received by:</label>
                            <span class="body-2 ml-2">_______________________________</span>
                        </v-col>
                        <v-col cols="6">
                            <label class="body-2">Date and Time Received:</label>
                            <span class="body-2 ml-2">________________________________</span>
                        </v-col>
                    </v-row>
                    
                    <v-row  dense>
                        <v-col class="d-flex ma-0 pa-0 justify-center text-align-center mt-2" cols="12">
                            <i class="text-no-wrap body-2">To be filled out by SRCH Medical Technologist:</i>
                        </v-col>
                    </v-row>

                    <v-row  dense>
                        <v-col cols="12">
                            <label class="body-2">Referred Test/s Performed by:</label>
                            <span class="body-2 ml-2">_________________________________</span>
                        </v-col>
                    </v-row>

                    <v-row  dense>
                        <v-col cols="6">
                            <label class="body-2">Date Performed:</label>
                            <span class="body-2 ml-2">__________________________</span>
                        </v-col>
                    </v-row>
                </div>

                <div class="d-print-none my-2">
                    <v-form :readonly="!emr_params.editable" ref="referral_form">
                        <!-- <v-checkbox :value="reason_for_referral" @blur="$emit('update:reason_for_referral', $event)" :rules="emr_params.editable ? referral_rules : []" label="For Referral"></v-checkbox> -->
                        <v-checkbox :value="referral_status" @change="$emit('update:referral_status', $event)" @blur="$emit('mutationStatus','referral')" :rules="emr_params.editable ? [v => !!v || 'Referral is required'] : []" label="Please check the box if this is a referral transaction." dense hide-details=""></v-checkbox>
                    </v-form>
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
    props: ['date_admitted', 'patient_info', 'emr_params', 'chief_complaint', 'pex_data', 'loading_referral_data', 'selected_icd', 'selected_medicine', 'referral_date', 'loading_provider', 'provider_items', 'referral_doctor_provider_name', 
    'doctor_data', 'eligible_data', 'impression_action_taken', 'display_doctor_referral', 'referral_status'],

    components: {
        Alert,
        Header,
        Footer
    },

    data() {
        return {
            alert: {},
            test: '',
            test2: '',
            ref_doc_name: this.referral_doctor_provider_name,
            selected_package: [],
            referred_tests: [
                { label: "CBC w/ platelet count", value: "cbc" },
                { label: "Lipid Profile", value: "lipid_profile" },
                { label: "FBS", value: "fbs" },
                { label: "OGTT", value: "ogtt" },
                { label: "HbA1c", value: "hba1c" },
                { label: "Creatinine", value: "creatinine" },
                { label: "Chest X-Ray", value: "chest_xray" },
                { label: "Sputum Microscopy", value: "sputum" },
                { label: "ECG w/ cardio reading", value: "ecg" },
                { label: "Urinalysis", value: "urinalysis" },
                { label: "Pap Smear", value: "pap_smear" },
                { label: "Fecalysis", value: "fecalysis" },
                { label: "Fecal Occult Blood Test", value: "fobt" }
            ],
            address_of_facility: '',
            referral_rules: [v => !!v && !/^ *$/.test(v)],
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
#table{ width: 100%; }
th{ border: 0; }
td{
    border: 0px;  
    cursor: default;
    padding: 15px 3px 0;
    text-align: left;  
    vertical-align: bottom !important;
}
.padding--top{ padding-top: 5px; }
.medicine--table{ overflow-x: hidden; }
.medicine--header{
    min-width: 1410px;
    text-align: center;
}
.medicine--header h4{
    margin: 0 4px;
    width: 105px;
}
.medicine--body{
    margin: 0 4px;
    padding: 8px 0 4px 0;
    width: 105px;
    text-align: center;
}
.input--border{
    border-bottom: 1px solid grey;
    margin: 18px 0 0 8px;
    width: 100%;
}
.body-2{
    font-size: 12px !important;
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
    #for-print-relative { 
        width: 100%;

    }
    #for-print {
        padding: 0 !important;
        margin: 0 !important;
    }
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
    .padding--top{ padding-top: 2px; }
    .d-print-none{ display: none !important;}
    .input--border{ margin: 2px 0 0 8px; }
}
</style>