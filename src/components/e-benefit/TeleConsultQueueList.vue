<template>
  <v-container  fluid px-6 >
    <div class="d-print-none"> 
        <Navbar :navbar="navbar"  :help_menu="help_menu" />

        <Header 
            :header_title="header_title"
            :search_tbl="search_tbl"
            :start_date="start_date"
            :end_date="end_date"
            :key="search_reset_key"
            :loading_tbl="loading_tbl"
            :trans_status="trans_status"
            :is_teleconsult_que_list="true" 
            @resetTable="resetTable"
            @updateStartDate="updateStartDate"
            @updateEndDate="updateEndDate"
            @updateSearch="updateSearch"
        />
        
        <!-- TABLE FOR ADMISSION -->
        <v-data-table :headers="ql_header_list" :items="filtered_items" :loading="loading_tbl" :mobile-breakpoint="0" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }"  class="elevation-2 mb-5 d-print-none" sort-by="date_updated" sort-desc>
            <template v-slot:item="{ item }">
                <tr v-if="!show_cancelled" @dblclick="selectRow(item, 'view_patient')">
                    <td>{{ item.ek_lgu_id }}</td>
                    <td>{{ [item.last_name,item.first_name].includes(null) ? 'N/A'  : item.first_name+(item.middle_name ? ' '+item.middle_name : '')+' '+item.last_name}}</td>
                    <td>{{ item.mobile_number }} </td>
                    <td>{{ item.mem_address }} </td>
                </tr>
            </template>
        </v-data-table>
            
        <v-dialog v-if="view_patient_records" v-model="view_patient_records" class="d-print-none"> 
            <v-card class="pa-8 d-print-none"> 
                <v-card-title class="light-blue darken-4 white--text py-2">
                    <v-spacer></v-spacer>PATIENT RECORDS<v-spacer></v-spacer>
                    <v-icon @click="view_patient_records = false" dark>mdi-close</v-icon>
                </v-card-title>

                <v-data-table :headers="pql_header_list" :items="patient_records" :loading="loading_tbl" :mobile-breakpoint="0" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }"  class="elevation-2 mb-4 mt-6 d-print-none" sort-by="date_updated" sort-desc>
                    <template v-slot:item="{ item }">
                        <tr @dblclick="selectRow(item, 'view_records')">
                            <td>{{ item.teleconsult_date }} </td>
                            <td>{{ item.transaction_number }} </td>
                            <td>{{ item.doctor }}</td>
                            <td>{{ item.doctor_facility }} </td>
                            <td><span :class="[item.transaction_status === 'CANCELLED BY DOCTOR' ? 'red--text' : 'green--text']"> {{ item.transaction_status === 'ISSUED' ? 'COMPLETED' : 'CANCELLED BY DOCTOR' }} </span> </td>
                        </tr>
                    </template>
                </v-data-table>

                <v-card-actions class="d-flex justify-center">
                    <v-btn @click="view_patient_records = false"> Close </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-if="previous_record_display" v-model="previous_record_display" class="d-print-none" width="900" persistent>
            <v-card class="pt-4 pb-6 px-6 d-print-none" tile>
                <v-card-title class="light-blue darken-4 white--text py-2 d-print-none mb-4">
                    <v-spacer></v-spacer>TELE CONSULT PRESCRIPTION<v-spacer></v-spacer>
                </v-card-title>

                <v-row dense>
                    <v-col cols="12" md="6" lg="6">
                        <label class="font-weight-medium body-2">Date Admitted: <span class="font-weight-regular"> {{ diagnosis_item.date_admitted ? diagnosis_item.date_admitted : '' }} </span></label>
                    </v-col>
                    <v-col class="text-md-right" cols="12" md="6" lg="6">
                        <label class="font-weight-medium body-2">Date Discharged: <span class="font-weight-regular"> {{ diagnosis_item.date_discharged ? diagnosis_item.date_discharged : '' }} </span></label>
                    </v-col>
                </v-row>

                <v-divider></v-divider>

                <h4 class="font-weight-medium body-2 mt-4">Chief Complaint</h4>
                <v-textarea v-model="diagnosis_item.chief_complaint" class="body-2" rows="3" hide-details readonly outlined></v-textarea>

                <h4 class="font-weight-medium body-2 mt-4">Doctor</h4>
                <v-text-field v-if="diagnosis_item.doctor_name" :value="diagnosis_item.doctor_name + ' / ' + diagnosis_item.specialization" class="body-2" prepend-inner-icon="fas fa-user-md" hide-details readonly outlined dense></v-text-field>
                <label v-else class="font-italic body-2">No Available Doctor</label>

                <h4 class="font-weight-medium body-2 mt-4">Admitting Diagnosis</h4>
                <v-textarea v-if="diagnosis_item.admitting_diagnosis" :value="diagnosis_item.admitting_diagnosis" class="body-2" rows="3" hide-details readonly outlined dense></v-textarea>
                <label v-else class="font-italic body-2">No Available Admitting Diagnosis</label>

                <template v-if="diagnosis_item"> 
                    <h4 class="font-weight-medium body-2 mt-4">Primary/Secondary Diagnosis</h4> 

                    <template v-if="diagnosis_item.icd_lists"> 
                        <div v-for="(icd, icd_key) in diagnosis_item.icd_lists" :key="icd_key + 'icd'">
                            <v-text-field :value="icd.icd_code + ' / ' + icd.icd_description" class="body-2 my-2" hide-details readonly outlined dense></v-text-field>
                        </div>
                    </template>

                    <template v-else>
                        <label  class="font-italic body-2">No Available Diagnosis</label>
                    </template>

                    <h4 class="font-weight-medium body-2 mt-4">Procedure</h4>

                    <template v-if="diagnosis_item.procedure_lists"> 
                        <div v-for="(cpt, cpt_key) in diagnosis_item.procedure_lists" :key="cpt_key + 'cpt'"> 
                            <v-row dense> 
                                <v-col cols="9"> 
                                    <v-text-field :value="cpt.cpt_code + ' / ' + cpt.description + (cpt.modifier ? ' - ' + cpt.modifier.mod_description : '' )" class="body-2 my-1" hide-details readonly outlined dense> </v-text-field>
                                </v-col>
                                <v-col cols="3"> 
                                    <v-text-field :value="cpt.status" class="body-2 my-1" hide-details readonly outlined dense></v-text-field>
                                </v-col>
                            </v-row>          
                        </div> 
                    </template>

                    <template v-else>
                        <label  class="font-italic body-2">No Available Procedure</label>
                    </template>

                    <h4 class="font-weight-medium body-2 mt-4">Medicine</h4>

                    <template v-if="diagnosis_item.prescribed_medicine"> 
                        <div :class="{'table-overflow-x' : $vuetify.breakpoint.mdAndDown}">
                            <table class="mt-4 mb-7" cellspacing="0" cellpadding="0">
                                <tr>
                                    <th class="font-weight-medium body-2">Generic Name</th>
                                    <th class="font-weight-medium body-2">Dosage</th>
                                    <th class="font-weight-medium body-2">Preparation</th>
                                    <th class="font-weight-medium body-2">Total # of Medicine</th>
                                    <th class="font-weight-medium body-2">Duration # <br/> of Days</th>
                                    <th class="font-weight-medium body-2">Frequency # <br/> of Days</th>
                                    <th class="font-weight-medium body-2">Remaks</th>
                                </tr>
                                <tr v-for="(med, i) in diagnosis_item.prescribed_medicine" :key="i + 'med'">
                                    <td style="width: 25%">
                                        <v-text-field v-model="med.generic_name" class="body-2 px-1" hide-details readonly></v-text-field>
                                    </td> 
                                    <td style="width: 10%">
                                        <v-text-field v-model="med.dosage" class="body-2 px-1" hide-details readonly></v-text-field>
                                    </td>
                                    <td style="width: 10%">
                                        <v-text-field v-model="med.preparation" class="body-2 px-1" hide-details readonly></v-text-field>
                                    </td>
                                    <td style="width: 10%">
                                        <v-text-field v-model="med.total_num_of_med" class="body-2 px-1" hide-details readonly></v-text-field>
                                    </td>
                                    <td style="width: 10%">
                                        <v-text-field v-model="med.frequency_of_med" class="body-2 px-1" hide-details readonly></v-text-field>
                                    </td>
                                    <td style="width: 10%">
                                        <v-text-field v-model="med.frequency_of_med" class="body-2 px-1" hide-details readonly></v-text-field>
                                    </td>
                                    <td style="width: 15%">
                                        <v-text-field v-model="med.notes" class="body-2 px-1" hide-details readonly></v-text-field>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </template>

                    <template v-else> 
                        <label class="font-italic body-2">No Prescribed Medicine.</label>
                    </template> 
                </template>

                <h4 class="font-weight-medium body-2 mt-4">Doctor Notes</h4>
                <v-textarea v-if="diagnosis_item.doctor_note" v-model="diagnosis_item.doctor_note" class="body-2" rows="4" hide-details readonly outlined></v-textarea>
                <label v-else class="font-italic body-2">No Available Doctor Notes</label>

                <div class="d-flex">
                    <v-btn @click="viewClinicalAbstract" class="d-block mt-4 mb-6 mr-4" color="#367c9d" small dark>View Clinical Abstract</v-btn>
                    <v-btn @click="viewTreatmentPlan" class="d-block mt-4 mb-6 mr-4" color="#367c9d" small dark>View Treatment Plan</v-btn>
                    <v-btn @click="viewMedicalCertificate" class="d-block mt-4 mb-6 mr-4" color="#367c9d" small dark>Medical Certificate</v-btn>
                    <v-btn @click="viewPhilpen" class="d-block mt-4 mb-6 mr-4" color="#367c9d" small dark>Philpen</v-btn>
                </div>
                
                <div class="text-center">
                    <v-divider class="mb-6"></v-divider>
                    <v-btn @click="previous_record_display = false">CLOSE</v-btn>
                </div>
            </v-card>
        </v-dialog>

        <PhilPen 
            ref="philpen"
            :patient_info="diagnosis_item" 
            :patient_name="`${diagnosis_item.mem_first_name} ${diagnosis_item.mem_middle_name || ''} ${diagnosis_item.mem_last_name} ${diagnosis_item.mem_suffix || ''}`"
            :date_today="date_admitted" 
            :dietary_information="dietary_information" 
            :family_medical_history="family_medical_history" 
            :pex_data="pex_data" 
            :patient_social_history="patient_social_history" 
        />
        <ClinicalAbstract ref="clinical_abstract" /> 
        <TreatmentPlan ref="treatment_plan" :patient_info="diagnosis_item" :date_admitted="date_admitted" :doctor_notes="doctor_notes"/>
        <MedicalCertificate ref="medical_certificate" :jspdf="jspdf" /> 
    </div>
    <Alert :alert="alert" />
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar'
import Alert from '@/components/Alert'
import TreatmentPlan from '@/components/emr/printable-form/TreatmentPlan.vue'
import ClinicalAbstract from '@/components/emr/ClinicalAbstract.vue'
import MedicalCertificate from '@/components/emr/printable-form/MedicalCertificate.vue'
import jsPDF from 'jspdf'
import PhilPen from '@/components/emr/PhilPen.vue'
import Header from '@/components/emr/header/Header.vue'

export default {
  components:{
    Navbar,
    Alert,
    TreatmentPlan,
    ClinicalAbstract,
    MedicalCertificate,
    PhilPen,
    Header
  },
  
  data() {
    return {
        // FILTER
        header_title: "Tele Consult Queue List",
        search_tbl: '',
        start_date: null,
        search_reset_key: 0,
        end_date: null,
        transaction_type: 'ALL',
        transaction_status: 'ALL',
        trans_type: [ 'ALL', 'CONSULTATION', 'OUTPATIENT', 'INPATIENT' ],
        trans_status: [ 'ALL', 'ON HOLD', 'WAITING FOR APPROVAL', 'CUSTOMER CARE RESPONDED' ],

        // DATE PICKER
        max_start_date: this.$moment().format('YYYY-MM-D'),
        
        previous_record_display: false,
        previous_record_data: {},

        // TABLE
        loading_tbl: true,
        ql_header_list: [
            { text: 'Card Number', value: 'ek_lgu_id',width:'200px' },
            { text: 'Patient Name', value: 'patient_name', sortable: false ,width:"250px"},
            { text: 'Contact Number', value: 'mobile_number', sortable: false,width:"250px"  },
            { text: 'Address', value: 'mem_address', sortable: false,width:"250px"  },
        ],

        pql_header_list: [
            { text: 'Date', value: 'teleconsult_date',width:'200px' },
            { text: 'Transaction Number', value: 'date_created',width:'200px' },
            { text: 'Doctor Name', value: 'doctor', sortable: false ,width:"250px"},
            { text: 'Doctor Facility', value: 'doctor_facility', sortable: false,width:"250px"  },
            { text: 'Transaction Status', value: 'nurse', sortable: false ,width:"250px"},
        ],

        ql_items: [],
        transaction_number: '',
        ek_lgu_id: '',
        
        overlay:false,

        session_data:{},
        
        // NAVBAR
        navbar: [ 
            {title: 'Telemedicine Assisted Patient List', link: '/teleconsult-queue-list', icon: 'fas fa-clipboard-list'}, 
            { title: 'Queue List', link: '/queue-list', icon: 'fas fa-clipboard-list'},
            { title: 'Home', link: '/code-scanning', icon: 'fas fa-home'} 
        ],
        help_menu: [{ content: 'Patient List'}],

        alert:{},

        cancelToken:null,
        source:null,
        show_cancelled: false,

        patient_records: [],
        view_patient_records: false,

        diagnosis_item: [],

        date_admitted: '',
        doctor_notes: '',

        jspdf: jsPDF,

        phipen_dialog: true,

        family_medical_history: [],
        patient_social_history: [],
        pex_data: {
            bp_systolic: '',
            bp_diastolic: '',
            bp_2nd_systolic: '',
            bp_2nd_diastolic: '',
            waist_circumference: '',
            bmi_computation: {
                bmi: '',
                remarks: ''
            },

        },
        dietary_information: ''
    }
  },

  created() {
    sessionStorage.clear();
    this.getQueueList()
  },

  computed: {
   // FORMAT THE START DATE
    start_date_format(){
        return this.formatDate(this.start_date)
    },

    // FORMAT THE END DATE
    end_date_format(){
        return this.formatDate(this.end_date)
    },

    filtered_items() {
      return this.ql_items.filter((i) => {
          let temp_name = [i.first_name,i.last_name]
          let member_name = temp_name.includes(null) ? 'N/A' : i.first_name + (i.middle_name ? ' '+ i.middle_name : '') +' '+ i.last_name + (i.suffix ? ' '+i.suffix : '')
          let searched_data = (member_name.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || (i.ek_lgu_id.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1)
          let timestamp = i.teleconsult_date
          
          let search = this.search_tbl ? searched_data : true
          let date = this.start_date && this.end_date ? timestamp >= this.start_date && timestamp <= this.end_date : true
          let transaction_type = this.transaction_type === 'ALL' ? true : i.transaction_type === this.transaction_type
          let transaction_status = this.transaction_status === 'ALL' ? true : i.transaction_status === this.transaction_status

          return search && date && transaction_type && transaction_status
      })    
    }
  },

  methods: {
    viewPhilpen() {
        this.$refs.philpen.displayPhilpen(this.phipen_dialog)
        this.date_admitted = this.diagnosis_item.date_admitted
        this.family_medical_history = this.diagnosis_item.emr_family_medical_history.map(data => {
            return {
                classification: data.family_history_classification,
                description: data.family_past_medical_history,
                code: data.mdisease_code
            }
        })

        this.patient_social_history = this.diagnosis_item.patient_social_history

        this.pex_data.waist_circumference = this.diagnosis_item.waist_circumference
        if(this.diagnosis_item.blood_pressure_1st) {
            let bp = this.diagnosis_item.blood_pressure_1st.split('/')
            this.pex_data.bp_systolic = bp[0]
            this.pex_data.bp_diastolic = bp[1]
        }

        if(this.diagnosis_item.blood_pressure_2st) {
            let bp = this.diagnosis_item.blood_pressure_2nd.split('/')
            this.pex_data.bp_2nd_systolic = bp[0]
            this.pex_data.bp_2nd_diastolic = bp[1]
        }

        this.dietary_information = this.diagnosis_item.transaction_dietary_intake[0]
    },

    //VIEW MEDICAL CERTIFICATE
    viewMedicalCertificate() {
        let laboratory_request = []

        if (this.diagnosis_item.icd_lists) {
            this.diagnosis_item.procedure_lists.forEach(cpt => {
                laboratory_request.push(`${cpt.cpt_code} / ${cpt.cpt_description}`)
            })
        }
        
        const data = {
            date_admitted: this.diagnosis_item.date_admitted,
            patient_name: this.combineString([this.diagnosis_item.mem_first_name, this.diagnosis_item.mem_middle_name, this.diagnosis_item.mem_last_name, this.diagnosis_item.mem_suffix]),
            patient_age: this.diagnosis_item.mem_age,
            address: this.combineString([this.diagnosis_item.mem_home_bldgno, this.diagnosis_item.mem_home_bgy, this.diagnosis_item.mem_home_city_municipality, this.diagnosis_item.mem_home_province, this.diagnosis_item.mem_home_zip]),
            impression_diagnosis: this.diagnosis_item.icd_lists ? this.diagnosis_item.icd_lists : [],
            laboratory_request: laboratory_request,
            selected_medicine: this.diagnosis_item.prescribed_medicine ? this.diagnosis_item.prescribed_medicine : [],
            doctor_name: this.diagnosis_item.doctor_name,
            doctor_name2: this.diagnosis_item.doctor_name,
            doctor_specialization: this.diagnosis_item.specialization,
            doctor_position: this.diagnosis_item.doctor_position ? this.diagnosis_item.doctor_position : '',
            doctor_prc_license: this.diagnosis_item.doc_prc_license
        }

        this.$refs.medical_certificate.openMedicalCertificate(data);
    },

    //VIEW CLINICAL ABSCTRACT
    viewClinicalAbstract() {
        let clinical_abstract_item = []

        if(this.diagnosis_item.icd_lists) {
            clinical_abstract_item = [{
                ...this.diagnosis_item.icd_lists[0],
                selected_medicine: this.diagnosis_item.prescribed_medicine,
                procedure_list: this.diagnosis_item.procedure_lists,
                doctor_notes: this.diagnosis_item.doctor_notes 
            }]
        } else {
            clinical_abstract_item = [
                {
                    icd_code : '',
                    icd_description: '',
                    procedure_list: [],
                }
            ]
        }

        this.$refs.clinical_abstract.openClinicalAbstract(this.transaction_number, clinical_abstract_item);
    },

    //VIEW TREATMENT PLAN
    viewTreatmentPlan() {
        let data = {
            transaction_number: this.transaction_number,
            ek_lgu_id: this.diagnosis_item.ek_lgu_id,
            patient_name: this.combineString([this.diagnosis_item.mem_first_name, this.diagnosis_item.mem_middle_name, this.diagnosis_item.mem_last_name, this.diagnosis_item.mem_suffix]),
            date_admitted: this.diagnosis_item.date_admitted,
            patient_address: this.combineString([this.diagnosis_item.mem_home_bldgno, this.diagnosis_item.mem_home_bgy, this.diagnosis_item.mem_home_city_municipality, this.diagnosis_item.mem_home_province, this.diagnosis_item.mem_home_zip]),
            patient_age: this.diagnosis_item.mem_age,
            selected_icd: [{procedures: this.diagnosis_item.procedure_lists ? this.diagnosis_item.procedure_lists : []}],
            selected_medicine: this.diagnosis_item.prescribed_medicine ? this.diagnosis_item.prescribed_medicine : [],
            doctor_name: this.diagnosis_item.doctor_name,
            doctor_prc_license: this.diagnosis_item.doc_prc_license
        }
        
        this.date_admitted = this.diagnosis_item.date_admitted
        this.doctor_notes = this.diagnosis_item.doctor_note
        this.$refs.treatment_plan.openDialog(data);
    },

    // GET TELECONSULT PATIENT LIST
    async getQueueList(){
        this.show_cancelled = false
        this.loading_tbl = true
        let response = await this.$services.getTeleConsultPatients({
            provider_code: this.$store.state.prv_data.provider_code,
        }) 

        if (response.status === 200) {
            response.data = this.responseDataDecryption(response.data)
            this.loading_tbl = false
            //this.queue_timeout = setTimeout(() => this.getQueueList(), 2000)

            if(response.data === 'Data not found'){
                this.ql_items = []
                return
            }

            this.ql_items = response.data
        } else {
            this.alert = response.error
        }
    },

    updateSearch(new_search) {
      this.search_tbl = new_search;
    },

    updateStartDate(new_start_date) {
      this.start_date = new_start_date;
    },

    updateEndDate(new_end_date) {
      this.end_date = new_end_date;
    },

    resetTable() {
        this.search_tbl = ''
        this.start_date = null
        this.end_date = null
        this.transaction_type = 'ALL'
        this.transaction_status = 'ALL'
        this.search_reset_key += 1
    },

    async selectRow(item, key) {
        this.transaction_number = item.transaction_number
        
        if(key === 'view_patient') {
            let response = await this.$services.getTeleConsultPatientTransactions({
                 ek_lgu_id: item.ek_lgu_id,
            })

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)

                this.view_patient_records = true
                response.data.forEach(data => {
                    this.patient_records.push({
                        ...data,
                        ek_lgu_id: item.ek_lgu_id
                    })
                }) 

            } else {
                this.alert = response.error
            }
        }

        if(key === 'view_records') {
            let response = await this.$services.getTeleConsultPatientTransactionRecords({
                transaction_number: item.transaction_number
            })
            
            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                
                this.previous_record_display = true
                this.diagnosis_item = { ...response.data, ek_lgu_id: this.patient_records[0].ek_lgu_id }

            } else {
                this.alert = response.error
            }
        }
    }
  }
}
</script>
<style scoped>
@media print{
    body *{
        background: white;
        display: none;
        position: relative;
    }
    #not-for-print{ display: none; }
    label {
        font-size: 24px;
    }
} 
</style>
