<template>
    <v-dialog v-model="show_clinical_abstract" width="1200" persistent>
        <div id="for-print-absolute">
            <v-card id="for-print-relative" class="px-8 pt-8 pb-3" flat>
                <div v-if="loading_data" class="text-center">
                    <div class="my-16">
                        <v-progress-circular color="primary" size="100" indeterminate></v-progress-circular>
                        <h4 class="light-blue--text text--darken-4 mt-10 pl-5">Loading... Please wait...</h4>
                    </div>
                </div>

                <div v-else id="for-print"> 
                   <Header />

                    <h6 class="text-center title mt-6 mb-4">Clinical Abstract</h6>         
                    <h6 class="font-weight-medium body-2 mb-4">Referral Number: <span class="font-weight-regular">{{ record.referral_code }}</span></h6>
                    <h6 class="font-weight-medium body-2 mb-4">Referral Agency: <span class="font-weight-regular">{{ record.referring_agency }}</span></h6>
                    <h6 class="font-weight-medium body-2 mb-4">Date / Time Referred: <span class="font-weight-regular">{{ record.date_time_referred }}</span></h6>

                    <h6 class="font-weight-medium body-2">Name: <span class="font-weight-regular">{{ record.patient_name }}</span></h6>
                    <h6 class="font-weight-medium body-2 mt-1">Birthdate: <span class="font-weight-regular">{{ record.birthdate }}</span></h6>
                    <h6 class="font-weight-medium body-2 mt-1" >Age: <span class="font-weight-regular">{{ record.age }}</span></h6>
                    
                    <h6 class="font-weight-medium body-2 mt-1">Sex: <span class="font-weight-regular">{{ record.sex }}</span></h6>
                    <h6 class="font-weight-medium body-2 mt-1">Civil Status: <span class="font-weight-regular">{{ record.civil_status }}</span></h6>
                    <h6 class="font-weight-medium body-2 mt-1">Religion: <span class="font-weight-regular">{{ record.religion }}</span></h6>
                    <h6 class="font-weight-medium body-2 mt-1 mb-4">Address: <span class="font-weight-regular">{{ record.complete_address }}</span></h6>

                    <h6 class="font-weight-medium body-2">Parent / Guardian: <span class="font-weight-regular">{{ }}</span></h6>
                    <h6 class="font-weight-medium body-2 mt-1">PHIC Member: <span class="font-weight-regular">{{ record.phic_member }}</span></h6>
                    <h6 class="font-weight-medium body-2 mt-1">Mode of Transport: <span class="font-weight-regular">{{ }}</span></h6>
                    <h6 class="font-weight-medium body-2 mt-1 mb-4">Referring Doctor: <span class="font-weight-regular">{{ record.referring_doctor }}</span></h6>

                    <h6 class="font-weight-medium body-2 mb-6">Chief Complaint and History: <span class="font-weight-regular">{{ record.chief_complaint }}</span></h6>

                    <h6 class="font-weight-medium text-decoration-underline body-1">Physical Examination</h6>
                    <h6 class="font-weight-medium body-2 mb-4">Blood Pressure: <span class="font-weight-regular">{{ record.blood_pressure }}</span></h6>
                    <h6 class="font-weight-medium body-2 mb-4">Heart Rate: <span class="font-weight-regular">{{ record.heart_rate }}</span></h6>
                    <h6 class="font-weight-medium body-2 mb-4">Respiratory Rate: <span class="font-weight-regular">{{ record.respiration_rate }}</span></h6>
                    <h6 class="font-weight-medium body-2 mb-4">Temperature: <span class="font-weight-regular">{{ record.temp }}</span></h6>
                    <h6 class="font-weight-medium body-2 mb-4">Oxygen Saturation: <span class="font-weight-regular">{{ record.o2sat }}</span></h6>
                    <h6 class="font-weight-medium body-2 mb-4">Weight: <span class="font-weight-regular">{{ record.weight? record.weight + ' kg' : '' }} </span></h6>

                    <h6 class="font-weight-medium body-2 mb-4">
                        <div class="d-flex">
                            <span style="width: auto">Pertinent PE Findings:</span>
                            <div class="pl-2" style="width: 80%">
                                <span v-for="(value, key) in record.pertinent_pe_findings" :key="key" class="font-weight-regular d-block">
                                    <span class="font-weight-regular">{{ textCapitalize(key) }}:</span>
                                    {{ value.filter(item => !item.includes('OTHERS')).join(', ') }}
                                </span>
                            </div>
                        </div>
                    </h6>
                    <h6 class="font-weight-medium body-2 mb-4">Reason for Referral: <span class="font-weight-regular">{{ record.reason_for_referral }}</span></h6>
                    <h6 class="font-weight-medium body-2 mb-4">Admitting Diagnosis: <span class="font-weight-regular">{{ record.admitting_diagnosis }}</span></h6>
                    <h6 class="font-weight-medium body-2 mb-4">History of Current Illness: <span class="font-weight-regular">{{ record.history_current_illness }}</span></h6>
                    <h6 class="font-weight-medium body-2 mb-1">Impression / Diagnosis: <span class="font-weight-regular">{{ record.impression_diagnosis }}</span></h6>
                    <div class="procedure-list font-weight-medium body-2 mb-1" v-if="record && record.procedure_list && record.procedure_list.length >= 1">
                        Procedure/s
                        <div class="procedure-item" v-for="(value, key) in record.procedure_list" :key="key">
                            <span class="font-weight-regular body-2 d-inline-block">
                                {{ value.cpt_code }} / {{ value.cpt_description_long }} <span v-if="value.modifier && value.modifier.mod_description"> {{ ' - ' + value.modifier.mod_description }} </span>
                            </span>
                        </div>
                    </div>

                    <div class="pt-6 print-med-tbl-main  mb-4">
                        <h6 class="font-weight-medium body-2"> Prescribed Medicine </h6>
                        <div class="d-flex d-row font-weight-medium text-center">
                            <div class="print-med-tbl-h">Generic Name</div>
                            <div class="print-med-tbl-h">Dosage<br>Preparation</div>
                            <div class="print-med-tbl-h">Frequency<br>(per day)</div>
                            <div class="print-med-tbl-h">Duration #<br>of days</div>
                            <div class="print-med-tbl-h">Total # of<br>Medicine</div>
                            <div class="print-med-tbl-h">Remarks</div>
                        </div>

                        <div v-for="(med, i) in record.selected_medicine" :key="i" class="d-flex d-row align-start pt-2">
                            <div class="print-med-tbl-b text-wrap">
                                <span>{{ med.generic_name }}</span>
                            </div>
                            <div class="print-med-tbl-b text-center">
                                <span>{{ med.dosage }} {{ med.sosage && med.preparation ? '/' : ''}} {{ med.preparation }}</span>
                            </div>
                            <div class="print-med-tbl-b text-center">
                                <span>{{ med.frequency_of_med }}</span>
                            </div>
                            <div class="print-med-tbl-b text-center">
                                <span>{{ med.duration }}</span>
                            </div>
                            <div class="print-med-tbl-b text-center">
                                <span>{{ med.total_num_of_med }}</span>
                            </div>
                            <div class="print-med-tbl-b text-center" >
                                <span>{{ med.notes }}</span>
                            </div>
                        </div>
                    </div>

                    <h6 class="font-weight-medium body-2 mt-8">Doctor Notes: <span class="font-weight-regular"> {{ record.doctor_notes}} </span></h6>
                </div>
                <Footer v-if="!loading_data" @saveAsPDF="saveAsPDF" @print="print" @close="closeClinicalAbstract" :disabled="loading_data" :emr_params="emr_params"/>
            </v-card>  
        </div>
        <Alert :alert="alert" />
    </v-dialog>
</template>

<script>
import Alert from '../Alert.vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { mapState } from 'vuex'
import Header from '@/components/emr/printable-form/Header.vue';
import Footer from '@/components/emr/printable-form/Footer.vue'

export default {
    props: ['emr_params'],
    
    components: {
        Alert,
        Header,
        Footer
    },

    data() {
        return {
            show_clinical_abstract: false,
            record: {
                referral_code: '',
                referring_agency: '',
                date_time_referred: '',

                patient_name: '',
                birthdate: '',
                age: '',
                sex: '',
                civil_status: '',
                religion: '',
                complete_address: '',

                phic_member: '',
                referring_doctor: '',
                chief_complaint: '',

                blood_pressure: '',
                heart_rate: '',
                respiration_rate: '',
                temp: '',
                weight: '',

                pertinent_pe_findings: '',
                reason_for_referral: '',
                admitting_diagnosis: '',
                history_current_illness: '',
                impression_diagnosis: '',
                procedure_list: '',
                selected_medicine: [],
                doctor_notes: ''
            },
            loading_data: true,
            alert: {},
            clinical_abstract: sessionStorage.getItem('789cvnBPL') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('789cvnBPL'), 'EMX246').toString(this.$crypto.enc.Utf8)) :  {
                fresh_load: true
            }
        }
    },

    computed: {
        ...mapState(['usr_credentials']),
    },
    
    methods: {
        openClinicalAbstract(data, icd_data, emr, pex_data) {
            if (typeof data === 'object' && data !== null) {
                this.loading_data = false
                this.record = data
            } else if(emr === true) {
                this.loading_data = true
                this.getClinicalAbstractforEMR(data, icd_data, pex_data) 
            }
            else{
                this.loading_data = true
                this.getClinicalAbstract(data, icd_data);
            }
            this.show_clinical_abstract = true
        },

        async getClinicalAbstractforEMR(transaction_number, icd_data, pex_data)  {
            if (this.clinical_abstract.fresh_load) {
                let response = await this.$services.getTransactionClinicalAbstract({
                    transaction_number: transaction_number
                }) 

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)

                    const assessment = response.data.assessment
                    let pertinent_pe_findings = {}
                    for (const key in assessment) {
                        if (assessment[key].assessment.length > 0) {
                            pertinent_pe_findings[key[0].toUpperCase() + key.substring(1)] = assessment[key].assessment
                        }
                    }

                    let impression_diagnosis = '';
                    let procedure_list = '';
                    if (icd_data !== 'Data not found.' && icd_data[0] && icd_data[0].icd_code !== null) {
                        impression_diagnosis = icd_data[0].icd_code + (icd_data[0].icd_code ? ' / ' : '') + icd_data[0].icd_description;

                        let temp = icd_data[0].procedure_list ? icd_data[0].procedure_list[0] : null;
                        
                        if (typeof temp === 'string') {
                            procedure_list = icd_data[0].procedure_list.map(element => {
                                let cpt_code = element.slice(0, 5);
                                let cpt_description = element.slice(6, element.length);
                                return {
                                    cpt_code: cpt_code,
                                    cpt_description_long: cpt_description,
                                };
                            });
                        } else {
                            procedure_list = icd_data[0].procedure_list?.map(element => {
                                return {
                                    cpt_code: element.cpt_code,
                                    cpt_description_long: element.cpt_description_long,
                                    modifier: element.modifier
                                };
                            });
                        }
                    }       

                    this.record = {
                        referral_code: response.data.referral_code,
                        referring_agency: response.data.prv_name,
                        date_time_referred: this.formatDateAndTime(response.data.date_time_referred),

                        patient_name: this.combineString([response.data.first_name, response.data.middle_name, response.data.last_name, response.data.suffix]),
                        birthdate: this.formatDate(response.data.birthdate),
                        age: this.getAge(response.data.birthdate),
                        sex: this.formatGender(response.data.sex),
                        civil_status: response.data.civil_status,
                        religion: response.data.religion,
                        complete_address: response.data.complete_address,
                        
                        phic_member: response.data.mem_phic_pin !== 'N/A' ? 'Yes' : 'No',
                        referring_doctor: this.combineString([response.data.referring_doctor_first_name, response.data.referring_doctor_middle_name, response.data.referring_doctor_last_name]),
                        chief_complaint: response.data.chief_complaint,

                        blood_pressure: response.data.blood_pressure,
                        heart_rate: response.data.heart_rate,
                        respiration_rate: response.data.respiration_rate,
                        temp: response.data.temp,
                        o2sat: response.data.oxygen_saturation,
                        weight: response.data.weight,

                        pertinent_pe_findings: pertinent_pe_findings,
                        reason_for_referral: response.data.reason_for_referral ? response.data.reason_for_referral : '',
                        history_current_illness: response.data.current_history_illness, 
                        admitting_diagnosis: response.data.admitting_diagnosis || icd_data.admitting_diagnosis,
                        impression_diagnosis: impression_diagnosis.trim(),
                        procedure_list: procedure_list,
                        selected_medicine: icd_data.length !== 0 ? icd_data[0].selected_medicine : [],
                        doctor_notes: icd_data.length !== 0 ? icd_data[0].doctor_notes : ''
                    }

                    this.record.admitting_diagnosis = icd_data.admitting_diagnosis        
                    this.record.impression_diagnosis = impression_diagnosis;
                    this.record.procedure_list = procedure_list;
                    this.record.selected_medicine = icd_data[0].selected_medicine;
                    this.record.doctor_notes = icd_data[0].doctor_notes;
                    this.loading_data = false
                    this.clinical_abstract.fresh_load = false;
                    // Update record vitals if pex_data has changes
                    if (pex_data && Object.keys(pex_data).length > 0) {
                        this.record = {
                            ...this.record,
                            blood_pressure: pex_data.bp_systolic ? pex_data.bp_systolic + '/' + pex_data.bp_diastolic : this.record.blood_pressure ,
                            heart_rate: pex_data.heart_rate || this.record.heart_rate,
                            respiration_rate: pex_data.respiration_rate || this.record.respiration_rate,
                            temp: pex_data.temp || this.record.temp,
                            o2sat: pex_data.oxygen_saturation || this.record.o2sat,
                            weight: pex_data.weight || this.record.weight,
                        };
                    }
                    sessionStorage.setItem('789cvnBPL', this.$crypto.AES.encrypt(JSON.stringify( this.record), 'EMX246'))
                } 
            }
            else {

                    this.record = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('789cvnBPL'), 'EMX246').toString(this.$crypto.enc.Utf8));
                    let impression_diagnosis = '';
                    let procedure_list = '';
                    if (icd_data !== 'Data not found.' && icd_data[0] && icd_data[0].icd_code !== null) {
                        impression_diagnosis = icd_data[0].icd_code + (icd_data[0].icd_code ? ' / ' : '') + icd_data[0].icd_description;

                        let temp = icd_data[0].procedure_list ? icd_data[0].procedure_list[0] : null;
                        
                        if (typeof temp === 'string') {
                            procedure_list = icd_data[0].procedure_list.map(element => {
                                let cpt_code = element.slice(0, 5);
                                let cpt_description = element.slice(6, element.length);
                                return {
                                    cpt_code: cpt_code,
                                    cpt_description_long: cpt_description,
                                };
                            });
                        } else {
                            procedure_list = icd_data[0].procedure_list?.map(element => {
                                return {
                                    cpt_code: element.cpt_code,
                                    cpt_description_long: element.cpt_description_long,
                                    modifier: element.modifier
                                };
                            });
                        }
                    }       
                this.record.admitting_diagnosis = icd_data.admitting_diagnosis      
                this.record.impression_diagnosis = impression_diagnosis;
                this.record.procedure_list = procedure_list;
                this.record.selected_medicine = icd_data[0].selected_medicine;
                this.record.doctor_notes = icd_data[0].doctor_notes;
                // Update record vitals if pex_data has changes
                if (pex_data && Object.keys(pex_data).length > 0) {
                    this.record = {
                        ...this.record,
                        blood_pressure: pex_data.bp_systolic ? pex_data.bp_systolic + '/' + pex_data.bp_diastolic : this.record.blood_pressure,
                        heart_rate: pex_data.heart_rate || this.record.heart_rate,
                        respiration_rate: pex_data.respiration_rate || this.record.respiration_rate,
                        temp: pex_data.temp || this.record.temp,
                        o2sat: pex_data.oxygen_saturation || this.record.o2sat,
                        weight: pex_data.weight || this.record.weight,
                    };
                }
                this.loading_data = false
            }
        },

        async getClinicalAbstract(transaction_number, icd_data) {
            let response = await this.$services.getTransactionClinicalAbstract({
                transaction_number: transaction_number
            }) 
            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)

                const assessment = response.data.assessment
                let pertinent_pe_findings = {}
                // let heent = []
                // let heent_other = ''
                for (const key in assessment) {
                    if (assessment[key].assessment.length > 0) {
                        pertinent_pe_findings[key[0].toUpperCase() + key.substring(1)] = assessment[key].assessment
                    }
                }

                // if (response.data.heent?.length > 0) {
                //     heent = response.data.heent.map(element => element.heent)
                //     heent_other = response.data.heent[0].others_notes
                // }
                
                // if (heent.length > 0 || heent_other) {
                //     pertinent_pe_findings['Heent'] = [...heent]

                //     if (heent_other) {
                //         pertinent_pe_findings['Heent'].push(`Others: ${heent_other}`)
                //     }
                // }

                let impression_diagnosis = '';
                let procedure_list = '';
                if (icd_data !== 'Data not found.' && icd_data[0] && icd_data[0].icd_code !== null) {
                    impression_diagnosis = icd_data[0].icd_code + (icd_data[0].icd_code ? ' / ' : '') + icd_data[0].icd_description;

                    let temp = icd_data[0].procedure_list ? icd_data[0].procedure_list[0] : null;
                    
                    if (typeof temp === 'string') {
                        procedure_list = icd_data[0].procedure_list.map(element => {
                            let cpt_code = element.slice(0, 5);
                            let cpt_description = element.slice(6, element.length);
                            return {
                                cpt_code: cpt_code,
                                cpt_description_long: cpt_description,
                            };
                        });
                    } else {
                        procedure_list = icd_data[0].procedure_list?.map(element => {
                            return {
                                cpt_code: element.cpt_code,
                                cpt_description_long: element.cpt_description_long,
                                modifier: element.modifier
                            };
                        });
                    }
                }       

                this.record = {
                    referral_code: response.data.referral_code,
                    referring_agency: response.data.prv_name,
                    date_time_referred: this.formatDateAndTime(response.data.date_time_referred),

                    patient_name: this.combineString([response.data.first_name, response.data.middle_name, response.data.last_name, response.data.suffix]),
                    birthdate: this.formatDate(response.data.birthdate),
                    age: this.getAge(response.data.birthdate),
                    sex: this.formatGender(response.data.sex),
                    civil_status: response.data.civil_status,
                    religion: response.data.religion,
                    complete_address: response.data.complete_address,
                    
                    phic_member: response.data.mem_phic_pin !== 'N/A' ? 'Yes' : 'No',
                    referring_doctor: this.combineString([response.data.referring_doctor_first_name, response.data.referring_doctor_middle_name, response.data.referring_doctor_last_name]),
                    chief_complaint: response.data.chief_complaint,

                    blood_pressure: response.data.blood_pressure,
                    heart_rate: response.data.heart_rate,
                    respiration_rate: response.data.respiration_rate,
                    temp: response.data.temp,
                    o2sat: response.data.oxygen_saturation,
                    weight: response.data.weight,

                    pertinent_pe_findings: pertinent_pe_findings,
                    reason_for_referral: response.data.reason_for_referral ? response.data.reason_for_referral : '',
                    history_current_illness: response.data.current_history_illness, 
                    admitting_diagnosis: response.data.admitting_diagnosis || icd_data.admitting_diagnosis,
                    impression_diagnosis: impression_diagnosis.trim(),
                    procedure_list: procedure_list,
                    selected_medicine: icd_data.length !== 0 ? icd_data[0].selected_medicine : [],
                    doctor_notes: icd_data.length !== 0 ? icd_data[0].doctor_notes : ''
                }

                this.loading_data = false
            } else {
                this.alert = response.error
            }
        },

        closeClinicalAbstract() {
            this.show_clinical_abstract = false
            this.$emit('closeClinicalAbstract')
        },

        saveAsPDF() {
            html2canvas(document.getElementById('for-print')).then((canvas) => {
                let margin = 12.7; 
                let img_data = canvas.toDataURL('image/png');
                let page_width = 216;
                let page_height = 356;
                let img_width = page_width - 2 * margin; 
                let img_height = canvas.height * img_width / canvas.width; 
                let doc = new jsPDF('p', 'mm', 'a4');
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

                doc.save(this.record.patient_name + ' Clinical Abstract ' + this.dateToday('MM-DD-YYYY') + '.pdf')
            });
        },

        print() {
            window.scrollTo(0, 0);
            window.print();
        }
    }
}
</script>

<style scoped>

.print-med-tbl-main{ overflow-x: auto; }
.print-med-tbl-main .d-flex{
    width: 100%;
    padding: 0;
    margin: 0; 
}
.print-med-tbl-h{
    font-size: 14px;
    width: 250px;
}
.print-med-tbl-b{
    font-size: 14px;
    padding: 2px 0 0 2px;
    width: 100%;
    text-align: center;
}
.print-border-bottom{ background: grey !important; }

.procedure-list {
    margin-left: 14%;
    width: 80%; 
}

.procedure-list .d-flex {
    white-space: normal; 
}

@media screen {
    body { font-size: 14pt }
}
@media screen, print {
    body { line-height: 1.2 }
}

@media print {
    body * {
        background: white;
        position: relative;
    }

    ::v-deep .v-dialog {
        box-shadow: none;
    }

    #for-print-absolute{
        left: 0;
        position: absolute !important; 
        top: 0;
    }

    .print-med-tbl-main{ overflow-x: hidden; }   
    .print-med-tbl-h, .print-med-tbl-b{
        width: 100%;
        padding: 2px 20px 0 0;
    }

}
</style>