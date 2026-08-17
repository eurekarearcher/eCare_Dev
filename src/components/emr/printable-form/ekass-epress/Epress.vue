<template>
    <v-dialog v-model="show_epress" width="816px" persistent>
        <div id="for-print-absolute">
            <v-card id="for-print-relative" class="px-4 pt-4 pb-1" flat>
                <div v-show="loading_data" class="text-center">
                    <div class="my-16">
                        <v-progress-circular color="primary" size="100" indeterminate></v-progress-circular>
                        <h4 class="light-blue--text text--darken-4 mt-10 pl-5">Loading... Please wait...</h4>
                    </div>
                </div>

                <div v-show="!loading_data" id="for-print-epress">
                    <v-row class="mb-2" dense>
                        <v-col sm="12" md="12" lg="12">
                            <div class="border-first-epress">
                                <div class="border-second pa-1">
                                    <v-row dense>
                                        <v-col sm="2" md="2" lg="2">
                                            <v-img src="../../../../assets/PHIC_logo.png" position="left" height="100%" width="200" contain></v-img> 
                                        </v-col>
                                        <v-col sm="10" md="10" lg="10" class="d-flex justify-start align-center">
                                            <span class="ma-0 text-h6 font-weight-bold "> ELECTRONIC PRESCRIPTION SLIP (EPRESS)</span>  
                                        </v-col>
                                        <v-col sm="12" md="12" lg="12" class="ma-0 pt-0">
                                            <span class="ma-0 font-weight-bold text-medium"> To be filled-out by the facility (Pupunan ng Pasilidad) </span>
                                        </v-col>
                                    </v-row>
                                        
                                    <v-simple-table cellspacing="0" class="mt-1">
                                        <tr class="text-small">  
                                            <td class="text-start line-height-2" width="5%"> 
                                                <span class="font-weight-medium text-small"> HCI NAME: </span> <br/>
                                                <span class="font-weight-regular text-small"> {{ this.$store.state.prv_data.provider_name }} </span>
                                            </td>
                                            <td class="text-start line-height-2" width="1%"> 
                                                <span class="font-weight-medium text-small"> Case No.: </span> <br/>
                                                <span class="font-weight-regular text-small"> {{ ekonsulta_data.pHciCaseNo }} </span>
                                            </td>
                                            <td class="text-start line-height-2" width="5%"> 
                                                <span class="font-weight-medium text-small"> HCI Accreditation No.: </span> <br/>
                                                <span class="font-weight-regular text-small"> {{ ekonsulta_data.pHciAccreNo }} </span>
                                            </td>
                                            <td class="text-start line-height-2" width="5%"> 
                                                <span class="font-weight-medium text-small"> Transaction No.: </span> <br/>
                                                <span class="font-weight-regular text-small"> {{ transaction_number }} </span>
                                            </td>
                                        </tr>
                                    </v-simple-table>

                                    <v-simple-table cellspacing="0" style="overflow: hidden !important">
                                        <tr style="white-space: nowrap; word-break: normal; overflow: hidden !important">  
                                            <td class="text-start line-height-2" width="40%"> 
                                                <span class="font-weight-medium text-small"> PIN (PhilHealth Identification Number): </span> <br/>
                                                <span class="font-weight-regular text-small"> {{ ekonsulta_data.pPatientPin || ekonsulta_data.pPatientPin }} </span>
                                            </td>
                                            <td class="text-start line-height-2" width="25%"> 
                                                <span class="font-weight-medium text-small"> Membership Category: </span> <br/>
                                                <span class="font-weight-regular text-small"> {{ this.patient_info.mem_phic_membership_type }} </span>
                                            </td>
                                            <td class="text-start" width="25%" style="white-space: nowrap; word-break: normal; overflow: hidden !important;"> 
                                                <span class="font-weight-medium text-small"> Membership Type: </span> <br/>
                                                <v-row dense class="pb-1">
                                                    <span class="border-b ml-1 text-center d-inline-block text-small" style="width: 20px; text-align: center;"> {{ ekonsulta_data.pPatientType === 'MM'? '&#10004;':''}}   </span>
                                                    <span class="ma-0 ml-2 text-small">Member</span>
                                                    <span class="border-b ml-1 text-center d-inline-block text-small" style="width: 20px; text-align: center;"> {{ ekonsulta_data.pPatientType === 'DD'? '&#10004;':''}}   </span>
                                                    <span class="ma-0 ml-2 text-small">Dependent</span>
                                                </v-row>
                                            </td>
                                        </tr>
                                    </v-simple-table>

                                    <v-simple-table cellspacing="0">
                                        <tr>  
                                            <td class="text-start line-height-2" width="40%"> 
                                                <span class="font-weight-medium text-small"> Patient Name (Pangalan ng Pasyente): </span> <br/>
                                                <span class="font-weight-regular text-small"> {{ ekonsulta_data.pPatientFname + ' ' + ekonsulta_data.pPatientMname  + ' ' + ekonsulta_data.pPatientLname + ' ' + (ekonsulta_data.pPatientExtName || '') }}     </span>
                                            </td>
                                            <td class="text-start line-height-2" width="20%"> 
                                                <span class="font-weight-medium text-small"> Age(Edad): </span> <br/>
                                                <span class="font-weight-regular text-small"> {{ this.getAge(this.patient_info.mem_birthdate) }} </span>
                                            </td>
                                            <td class="text-start line-height-2" width="20%"> 
                                                <span class="font-weight-medium text-small"> Contact No.(Numero ng Telepono): </span> <br/>
                                                <span class="font-weight-regular text-small"> +63 {{ this.patient_info.mem_mobile_number }} </span>
                                            </td>
                                        </tr>
                                    </v-simple-table>
                
                                    <div class="border-second-box d-flex flex-column ">
                                        <div class="pa-1">
                                            <v-row dense>
                                                <v-col sm="12" md="12" lg="12">
                                                    <v-img src="../../../../assets/rx.png" position="left" height="40"  contain></v-img>
                                                </v-col>
                                            </v-row>

                                            <v-simple-table>
                                                <tr v-for="(medicine, key) in prescribe_medicine" :key="key" class="pl-2 py-0 table-body-epress" style="border: transparent !important">
                                                    <td style="border: transparent !important" class="pa-0 text-medium text-left" width="50%">
                                                        {{ medicine.total_num_of_med === "1" ? '1 pc' : medicine.total_num_of_med + ' pcs' }} 
                                                        {{ medicine.generic_name }}
                                                    </td>
                                                    <td style="border: transparent !important" class="pa-0 text-medium  text-left"  width="50%">
                                                        <span v-if="medicine.duration" class="text-medium">
                                                            {{ medicine.frequency_of_med === "1" ? 'Once a day' : medicine.frequency_of_med + 'x a day' }} 
                                                            for {{ medicine.duration }} days
                                                        </span>
                                                        <span v-if="medicine.notes" class="text-medium"> Note: {{ medicine.notes }}</span>
                                                    </td>
                                                </tr>
                                            </v-simple-table>
                                        </div>


                                        <div class="d-flex" style="flex-grow: 1;"></div>

                                        <div class="ma-2">
                                            <v-row dense class="mt-2">
                                                <v-col sm="6" md="6" lg="6" class="justify-start text-start align-self-end">
                                                    <span class="text-small line-height"> Next Dispensing Date:
                                                        ____________________ <br>
                                                        (Petsa ng susunod na bigay ng gamot): 
                                                    </span>  
                                                </v-col>
                                                <v-col sm="6" md="6" lg="6" class="d-flex justify-end align-baseline" style="border:none !important">
                                                    <v-simple-table class="line-height" cellspacing="0" style="border:none !important">
                                                        <tr  class="text-left  text-small" style="border:none !important">
                                                            Physician:
                                                            <span class="border-b text-small" > {{ prescribed_doctor }} </span>
                                                        </tr>
                                                        <tr class="text-left  text-small" style="border:none !important">
                                                            PRC LIC NO:
                                                            <span class="border-b text-small" style="border:none !important"> {{ doc_prc_license }} </span>
                                                        </tr>
                                                        <tr class="text-left  text-small" style="border:none !important">
                                                            PTR NO:
                                                            <span class="border-b  text-small" > {{ doc_ptr_no }} </span>
                                                        </tr>
                                                        <tr class="text-left  text-small" style="border:none !important">
                                                            S2 NO:
                                                            <span class="border-b text-small" > {{ doc_s2_no}} </span>
                                                        </tr>
                                                    </v-simple-table>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </div>

                                    <v-row dense no-gutters class="ma-1">
                                        <span class="ma-0 pa-0 small-note"> Note:<br/></span>
                                        <v-col sm="12" md="12" lg="12">
                                            <div class="ma-0 pa-0" style="border: dashed 2px #9C9C9C; border-style: dashed;"> </div>
                                        </v-col>
                                        <v-col sm="12" md="12" lg="12" class="d-flex justify-start align-center ma-0 pa-0">
                                            <v-col sm="7" md="7" lg="7" class="ma-0 pa-0">
                                                <span class="ma-0 font-weight-bold text-medium"> To be filled out by the patient (Pupunuan ng Pasyente)</span>  
                                            </v-col>
                                        </v-col>
                                        <v-col sm="12" md="12" lg="12" class="d-flex justify-start align-center ma-0 pa-0">
                                            <v-col sm="7" md="7" lg="7" class="ma-0 pa-0">
                                                <span class="ma-0 pa-0 line-height"> Did you received the above-mentioned medicines? <br>(Natanggap mo ba ang mga gamot na nabanggit?) </span>  
                                            </v-col>
                                            <v-col sm="5" md="5" lg="5" class="d-flex justify-start ma-0 pa-0">
                                                <span class="ma-0 pa-0 text-medium"> ____ Yes (Oo) ____ No (Hindi) </span>
                                            </v-col>
                                        </v-col>

                                        <v-col sm="12" md="12" lg="12" class="ma-0 pa-0">
                                            <div class="ma-0 pa-0" style="border: dashed .5px #9C9C9C; border-style: dashed;"> </div>
                                        </v-col>

                                        <v-col sm="12" md="12" lg="12" class="d-flex justify-start align-center ma-0 pa-0">
                                            <v-col sm="7" md="7" lg="7" class="ma-0 pa-0"> 
                                                <span class="ma-0 pa-0 line-height"> Are you satisfied with the medicines you received? <br> 
                                                (Nasiyahan ka ba sa mga gamot na natanggap mo?) </span>  
                                            </v-col>
                                            <v-col sm="5" md="5" lg="5" class="d-flex justify-start ma-0 pa-0">
                                                <v-checkbox disabled dense class="ma-0" style="height: 25px;"></v-checkbox>
                                                <v-img src="../../../../assets/smile-green.png" max-height="30" max-width="30" contain> </v-img>
                                                <v-checkbox disabled dense class="ma-0" style=" height: 25px;"></v-checkbox>
                                                <v-img src="../../../../assets/smile-yellow.png" max-height="30" max-width="30" contain> </v-img>
                                                <v-checkbox disabled dense class="ma-0" style=" height: 25px;"></v-checkbox>
                                                <v-img src="../../../../assets/smile-red.png" max-height="30" max-width="30" contain> </v-img>
                                            </v-col>
                                        </v-col>

                                        <v-col sm="12" md="12" lg="12" class="ma-0 pa-0">
                                            <div class="ma-0 pa-0" style="border: dashed .5px #9C9C9C; border-style: dashed;"> </div>
                                        </v-col>

                                        <v-col sm="12" md="12" lg="12" class="d-flex justify-start align-center ma-0 pa-0">
                                            <v-col sm="7" md="7" lg="7" class="ma-0 pa-0"> 
                                                <span class="ma-0 pt-2-0 line-height "> For your comment, suggestion or complaint: <br>(Para sa iyong komento, mungkahi o reklamo) </span>  
                                            </v-col>
                                        </v-col>

                                        <v-col sm="12" md="12" lg="12" class="pt-2" >
                                            <hr><hr class="mt-3">
                                        </v-col>

                                    <!--
                                    <v-col sm="12" md="12" lg="12" class="d-flex justify-start align-center">
                                        <span class="ma-0 font-weight-medium text-small"> Under the penalty of law, I attest that the information I provided in this slip are true and accurate.</span>  
                                    </v-col>
                                    <v-col sm="12" md="12" lg="12" class="d-flex justify-start align-center">
                                        <span class="ma-0 font-weight-medium text-small"> (Sa ilalim ng batas, pinatutunayan ko na ang impormasyong ibinigay ko ay totoo at tama) </span>  
                                    </v-col>
                                    <v-col sm="5" md="5" lg="5" class="d-flex justify-start align-center">
                                        <v-divider class="darken-1 grey"> </v-divider>  
                                    </v-col>
                                    <v-col sm="2" md="2" lg="2" class="d-flex justify-start align-center">
                                    </v-col>
                                    <v-col sm="4" md="4" lg="4" class="d-flex justify-start align-center">
                                        <span class="ma-0 font-weight-medium text-small"> Next Consultation Date:  </span> 
                                        <v-divider class="darken-1 grey mt-2 ml-1"> </v-divider>  
                                    </v-col>
                                    <v-col sm="1" md="1" lg="1" class="d-flex justify-start align-center">  
                                    </v-col>
                                    
                                    <v-row dense>
                                        <v-col sm="5" md="5" lg="5" class="d-flex justify-start align-center">
                                            <span class="ma-0 font-weight-medium text-small"> Signature over printed name of patient </span>
                                        </v-col>
                                        <v-col sm="2" md="2" lg="2" class="d-flex justify-start align-center">
                                        </v-col>
                                        <v-col sm="4" md="4" lg="4" class="d-flex justify-start align-center">
                                            <span class="ma-0 font-weight-medium text-small"> (Petsa ng susunod na konsultasyon) </span> 
                                        </v-col>
                                        <v-col sm="1" md="1" lg="1" class="d-flex justify-start align-center">  
                                        </v-col>
                                    </v-row>

                                    <v-row dense>
                                        <v-col sm="12" md="12" lg="12" class="d-flex justify-start align-center">
                                            <span class="ma-0 font-weight-medium text-small"> (Lagda sa nakalimbag na pangalan ng pasyente) </span>
                                        </v-col>
                                    </v-row>-->

                                        <v-col sm="6" md="6" lg="6" class="justify-start align-center ma-0 pt-1">
                                            <span class="ma-0 pa-0 small-note line-height-2"> Note: <br>
                                                Accomplished form shall be submitted to Yakap Provider<br>
                                                (Ang kumpletong form ay dapat isumite sa tagapagbigay ng Yakap)
                                            </span>
                                        </v-col>
                                        <v-col sm="6" md="6" lg="6" class="justify-start text-end align-self-end ma-0 pt-5">
                                            <span class="ma-0 pa-0 font-weight-medium text-small text-no-wrap"> PhilHealth Identification Number of Patient:</span>  
                                            <span class="border-b ml-1 pa-0 text-small"> {{ ekonsulta_data.pPatientPin || ekonsulta_data.pPatientPin }} </span>
                                        </v-col>
                                    </v-row>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </div>

                <div class="d-print-none">
                    <v-divider class="my-5"></v-divider>
                    <v-card-actions>
                        <span class="px-7"></span>
                        <v-btn @click="printEkassEpress" class="px-3 ml-auto mr-3 white--text" color="#367c9d">Save as PDF <v-icon color="white" right>mdi-file-pdf-box</v-icon></v-btn>
                        <v-btn @click="print" class="px-3 mr-auto ml-3 white--text" color="#367c9d" >Print <v-icon olor="white" right>mdi-printer</v-icon></v-btn>
                        <v-btn @click="$emit('close_form')" class="px-3" >Close <v-icon right>mdi-close</v-icon></v-btn>
                    </v-card-actions>
                </div>
            </v-card>  
        </div>
    </v-dialog>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
    props: ['selected_icd', 'transaction_number', 'patient_info', 'ekonsulta_data', 'prescribe_medicine', 'prescribed_doctor', 'doc_prc_license', 'doc_ptr_no', 'doc_s2_no', 'loading_data', 'show_epress'],

    data() {
        return{
            show_ekass_epress: false,
            atc_code: '',
        }
    },
    
    methods: {
        print() {
            window.print()
        },

        printEkassEpress() {
            let { mem_first_name, mem_middle_name, mem_last_name, mem_suffix } = this.patient_info;

            if (this.patient_info) {
                html2canvas(document.getElementById('for-print-epress')).then(function(canvas) {
                    let img_data = canvas.toDataURL('image/png');
                    let img_width = 216 - 2 * 12.7; 
                    let page_height = 279.4 - 2 * 12.7;
                    let img_height = canvas.height * img_width / canvas.width;
                    let height_left = img_height;
                    let doc = new jsPDF('p', 'mm','letter');
                    var position = 7;

                    doc.addImage(img_data, 'PNG', 12, 7, img_width, img_height);
                    height_left -= page_height;
                    while (height_left >= 0) {
                        position = height_left - img_height;
                        doc.addPage();
                        doc.addImage(img_data, 'PNG', 12, position, img_width, img_height);
                        height_left -= page_height;
                    }

                    doc.save(`${mem_first_name} ${mem_middle_name} ${mem_last_name} ${mem_suffix} ePress.pdf`);
                });
            }
        }
    }
}
</script>

<style scoped>

@media print{
    body *{
        background: white;
        position: relative;
    }
    #not-for-print{ display: none; }
    #for-print-absolute{
        position: absolute !important; 
        left: 0;
        top: 0;
    }
    #for-print-relative { 
        width: 100%;
    }
    #for-print-epress {
        padding: 0 !important;
        margin: 0 !important;
        width: 99%;
    }
    .print-med-tbl-b {
        width: 100%;
        text-align: center;
        font-size: 12px;
    }
}
.small-note{
    font-size: 12px;
    line-height: 1.5; 
    margin: 0; 
    padding: 0;
    display: block;
}
.line-height{
    font-size: 14px;
    line-height: 1.5; 
    margin: 0; 
    padding: 0;
    display: block;
}
.line-height-2{
    line-height: 1.5; 
}
.text-small{
    font-size: 12px;
}
.text-medium{
    font-size: 14px;
}
.text-large{
    font-size: 16px;
}
.border-second-box{
    border: 1px solid #505050;
    padding: 5px;
}
.border-second{
    border: 1px solid #505050;
}
.table-header-epress th {
    color: black !important; 
    background-color: white !important; 
    font-size: 12px !important;
    padding: 1px !important;
    text-align: left;
    white-space: wrap;
    text-align: left !important;
}
.table-body-epress td{
    line-height: 1;
    padding: 2px !important;
    font-size: 12px !important;
    height:100% !important;
}
.cut-line {
    width: 2px;
    height: 86%; 
    position: absolute;
    left: 50%;
    top: 2.5%;
    transform: translateX(-50%); 
    border-left: 2px dashed #505050; 
}
.print-med-tbl-main { overflow-x: auto; }
.print-med-tbl-main .d-flex {
    width: 100%;
    padding: 0;
    margin: 0; 
}
.print-med-tbl-h {
    width: 250px;
}
.print-med-tbl-b {
    width: 100%;
    text-align: center;
}
.borders{
    border: 1px solid #505050;
}
.border-3 {
    border: 1px solid #505050;
}
.border-first-ekas{
    border: 1px solid #505050;
    padding: 1px;
    margin-right:4px
}
.border-first-epress{
    border: 1px solid #505050;
    padding: 1px;
    margin-left:4px
}
.border-b{
    border-bottom: 1px solid #505050;
}
span{
    font-size: 12px;
}
table, th, tr, td{
    font-size: 12px;
    text-align: center;
    border: 1px solid #9c9c9c;
    margin: 0;
    padding: 0;
}
th, td{
    padding: 2px;
}
tr:hover{
    background: transparent !important;
}
</style>