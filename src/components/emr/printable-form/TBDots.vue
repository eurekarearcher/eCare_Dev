<template>
    <v-dialog v-model="show_dialog" width="1400" persistent>
        <div id="for-print-absolute">
            <v-card id="for-print-relative" class="px-8 pt-8 pb-3" flat>
                <div v-if="tb_dots_loading_data" class="text-center">
                    <div class="my-16">
                        <v-progress-circular color="primary" size="100" indeterminate></v-progress-circular>
                        <h4 class="light-blue--text text--darken-4 mt-10 pl-5">Loading... Please wait...</h4>
                    </div>
                </div>

                <div v-else id="for-print-tbdots"> 
                    <Header />
                    <Header2 :name="data.patient_name" :date="data.date_today" :address="data.address" :age="data.age" />

                    <h6 class="font-weight-medium text-center body-1 mt-8 mb-6">Finding TB Cases Actively Separatingly Treating Effectively</h6>

                    <v-row class="body-2" dense>
                        <v-col cols="12" sm="4" md="4" lg="2">
                            <span class="font-weight-medium">Signs and Symptoms</span>
                        </v-col>

                        <v-col cols="12" sm="8" md="8" lg="10">
                            <span v-for="(value, index) in data.signs_and_symptoms" :key="index+'a'" class="d-block mb-2">{{ value }}</span>
                        </v-col>
                    </v-row>
                    
                    <v-divider class="my-5"></v-divider>

                    <v-row class="body-2" dense>
                        <v-col cols="12" sm="4" md="4" lg="2">
                            <span class="font-weight-medium">Risk Factors</span>
                        </v-col>

                        <v-col cols="12" sm="8" md="8" lg="10">
                            <span v-for="(value, index) in data.risk_factors.filter(item => !item.includes('OTHERS'))" :key="index+'b'" class="d-block mb-2">{{ value }}</span>
                        </v-col>
                    </v-row>

                    <v-row class="body-2" align="center" dense>
                        <v-col cols="12" sm="4" md="4" lg="2">
                            <span class="font-weight-medium">Close contact of a known TB case</span>
                        </v-col>

                        <v-col class="align-center d-flex" cols="12" sm="8" md="8" lg="10">
                            <span class="d-print-inline d-none">{{ data.close_contact_tb }}</span>
                            
                            <v-radio-group v-model="data.close_contact_tb" :disabled="!data.editable" @change="emitData" class="d-print-none" row>
                                <v-row dense>
                                    <v-col cols="12" sm="3" md="auto" lg="auto">
                                        <v-radio label="DSTB" value="DSTB"></v-radio>
                                    </v-col>

                                    <v-col cols="12" sm="3" md="auto" lg="auto">
                                        <v-radio label="DRTB" value="DRTB"></v-radio>
                                    </v-col>

                                    <v-col cols="12" sm="3" md="auto" lg="auto">
                                        <v-radio label="N/A" value="N/A"></v-radio>
                                    </v-col>
                                </v-row>
                            </v-radio-group>
    
                            <v-btn v-if="data.editable && data.close_contact_tb" @click="data.close_contact_tb = '', emitData()" class="d-print-none" x-small>CLEAR</v-btn>
                        </v-col>
                    </v-row>

                    <v-divider class="my-5"></v-divider>

                    <v-row class="body-2" dense>
                        <v-col cols="12" sm="4" md="4" lg="2">
                            <span class="font-weight-medium">Assessment</span>
                        </v-col>

                        <v-col cols="12" sm="8" md="8" lg="10">
                            <span v-for="(value, index) in data.assessment" :key="index+'d'" class="d-block mb-2">{{ value }}</span>
                        </v-col>
                    </v-row>

                    <v-row class="body-2 mt-4" dense>
                        <v-col cols="12" sm="4" md="4" lg="2">
                            <span class="font-weight-medium">Recommended Actions</span>
                        </v-col>

                        <v-col cols="12" sm="8" md="8" lg="10">
                            <span v-for="(value, index) in data.recommended_actions" :key="index+'e'" class="d-block mb-2">{{ value }}</span>
                        </v-col>
                    </v-row>
                </div>
                <Footer @saveAsPDF="saveAsPDF" @print="print" @close="show_dialog = false" :emr_params="emr_params"/>
            </v-card>  
        </div>
    </v-dialog>
</template>

<script>
import Header from '@/components/emr/printable-form/Header.vue'
import Header2 from '@/components/emr/printable-form/Header2.vue'
import Footer from '@/components/emr/printable-form/Footer.vue'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'

export default {
    props: ['jspdf', 'emr_params', 'tb_dots_loading_data'],

    components: {
        Header,
        Header2,
        Footer
    },
    
    data() {
        return {
            show_dialog: false,
            data: {
                editable: false,
                patient_name : '',
                date_today: '',
                address: '',
                age: '',
                signs_and_symptoms: [],
                risk_factors: [],
                close_contact_tb: '',
                assessment: [],
                recommended_actions: []
            }
        }
    },

    methods: {
        openTBDots(data) {
            this.show_dialog = true
            this.data = data
        },
    
        print() {
            window.scrollTo(0, 0);
            window.print();
        },

        saveAsPDF() {
            html2canvas(document.getElementById('for-print-tbdots')).then((canvas) => {
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

                doc.save(`${this.data.patient_name} TBDOTS ${this.data.date_today}.pdf`)
            });
        },

        emitData() {
            this.$emit('mutationStatus', 'close_contact', this.data.close_contact_tb)
        }
    }
}
</script>

<style scoped>
@media print {
    body * {
        background: white;
        position: relative;
        width: 100%;
    }

    ::v-deep .v-dialog {
        box-shadow: none;
    }

    #for-print-tbdots {
        padding: 0 !important;
    }
}
