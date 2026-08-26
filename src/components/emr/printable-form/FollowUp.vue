<template>
    <v-dialog v-model="show_dialog" width="1400" persistent>
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
                    <h4 class="text-center mt-9">FOLLOW UP FORM</h4>
                    <Header2 :name="data.patient_name" :date="data.date_admitted" :address="data.patient_address" :age="this.getAge([data.patient_mem_birthdate])" />
                    
                    <h6 class="font-weight-medium body-2 mt-6">
                        Follow Up Date:
                        <span class="font-weight-bold blue--text text--darken-4">{{ $moment(data.follow_up_consultation_date).format("MMMM D, YYYY") }}</span>
                    </h6>

                    <v-col v-if="select_management.length >= 1" class="body-2" dense>
                        <v-col cols="12" sm="4" md="4" lg="4">
                            <span class="font-weight-medium body-2 ml-n6">Management Type </span>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" lg="4" class="mt-n2">
                            <div v-for="(management, key) in select_management" :key="key"> 
                                <span class="font-weight-normal"> {{ management.management_description }} </span> 
                            </div>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" lg="4">
                            <span class="font-weight-medium body-2 ml-n6">{{ $store.state.usr_credentials.department + ' Notes' }} </span>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" lg="12" class="mt-n2">
                            <span class="font-weight-normal">{{ doctor_notes }}</span>
                        </v-col>
                    </v-col>
                    
                    <v-col class="body-2" dense>
                        <v-col cols="12" sm="4" md="4" lg="2">
                            <span class="font-weight-medium body-2 ml-n6">Chief Complaint</span>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" lg="2" class="mt-n2">
                            <span class="font-weight-normal">{{ data.chief_complaint}}</span>
                        </v-col>
                    </v-col>

                    <template v-if="data.selected_icd.length > 0 && data.selected_icd[0].icd_code">
                        <h5 class="font-weight-medium mb-1 body-2">ICD and CPT</h5>
                        <div v-for="(icd, icd_index) in data.selected_icd" :key="icd_index">
                        <h5 class="font-weight-regular body-2 pl-6 pt-1"> {{ icd.icd_code }} / {{ icd.icd_description }} </h5>
                            <h5 v-for="(cpt, cpt_index) in icd.procedures" :key="cpt_index" class="font-weight-regular body-2 ml-12 pt-1" >
                                {{ cpt.cpt_code }} / {{ cpt.cpt_description }} {{ cpt.modifier.mod_description ? ' - ' + cpt.modifier.mod_description : '' }}
                            </h5>
                        </div>
                    </template>

                    <div v-if=" data.selected_medicine.length > 0 " >
                        <div class="text-center d-flex mt-4">
                            <span class="medicine-item font-weight-medium body-2">Generic Name</span>
                            <span class="medicine-item font-weight-medium body-2">Dosage/Preparation</span>
                            <span class="medicine-item font-weight-medium body-2">Frequency</span>
                            <span class="medicine-item font-weight-medium body-2">Duration</span>
                            <span class="medicine-item font-weight-medium body-2">Total # of Medicine</span>
                            <span class="medicine-item font-weight-medium body-2">Remarks</span>
                        </div>
                    
                        <div v-for="(value, index) in data.selected_medicine" :key="index" class="font-weight-regular text-center d-flex mt-2">
                            <span class="medicine-item body-2">{{ value.generic_name }}</span>
                            <span class="medicine-item body-2">{{ value.dosage }} / {{ value.preparation }}</span>
                            <span class="medicine-item body-2">{{ value.frequency_of_med }}</span>
                            <span class="medicine-item body-2">{{ value.duration }}</span>
                            <span class="medicine-item body-2"># {{ value.total_num_of_med }}</span>
                            <span class="medicine-item body-2">{{ value.notes }}</span>
                        </div>
                    </div>

                    <v-row dense no-gutters>
                        <v-col cols="12" sm="5" md="3" lg="3" offset-sm="7" offset-md="9" offset-lg="9" class="text-center">
                            <h4 class="font-weight-medium"> {{ $store.state.usr_credentials.lgu_host_code === 'BT'? data.doctor_name : data.doctor_name2 + ", MD." }} </h4>
                            <h6 class="font-weight-regular body-2">{{ $store.state.usr_credentials.lgu_host_code === 'BT'? data.doctor_specialization :  data.doctor_position}}</h6>
                            <h4 class="font-weight-medium"> Lic. #: {{ data.doctor_prc_license }} </h4>
                            <h5 v-if="$store.state.usr_credentials.lgu_host_code === 'BT'" class="font-weight-medium mt-1" style="border-top: 1px solid grey" > DOCTOR </h5>
                        </v-col>
                    </v-row>
                </div>
                <Footer :emr_params="emr_params" @saveAsPDF="saveAsPDF" @print="print" @close="show_dialog = false" />
            </v-card>  
        </div>
  </v-dialog>
</template>

<script>
import Header from '@/components/emr/printable-form/Header.vue'
import Header2 from '@/components/emr/printable-form/Header2.vue'
import Footer from '@/components/emr/printable-form/Footer.vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';

export default {
    props: ['jspdf', 'doctor_notes', 'select_management', 'emr_params', 'loading_data'],

    components: {
        Header,
        Header2,
        Footer,
    },

    data() {
    return {
        show_dialog: false,
        data: {
                patient_name: '',
                date_admitted: '',
                patient_address: '',
                patient_age: '',
                selected_icd: [],
                selected_medicine: [],
                doctor_name: '',
                doctor_prc_license: '',
                follow_up_consultation_date: '',
                chief_complaint: '',
                patient_mem_birthdate: ''
            }
        }
     },

    methods: {

        openFollowUpForm(data) {
            this.data = data
            this.show_dialog = true;
        },

        print() {
            window.scrollTo(0, 0);
            window.print();
        },

        saveAsPDF(){
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

                doc.save(`PATIENT ${this.data.patient_name} FOLLOW UP FORM ${this.formatDate([this.data.date_admitted])}.pdf`) 
            });
        },
         
    }
  
};
</script>

<style scoped>
.medicine-item {
    width: calc(100% / 7);
}

@media print {
    body * {
        background: white;
        position: relative;
    }
    ::v-deep .v-dialog {
        box-shadow: none;
    }
    #for-print {
        padding: 0 !important;
    }
 
}
</style>