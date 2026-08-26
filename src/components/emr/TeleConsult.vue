<template>
    <v-card>
        <v-card-title class="text-caption text-sm-h6 justify-center light-blue darken-4 white--text">LIST OF DOCTOR'S FOR TELEMEDICINE ASSISTED</v-card-title>
        <div class="px-3">
            <v-col md="4" sm="6" cols="12" class="ml-auto">
                <v-text-field v-model="starting_dialog.search" label="Search" single-line hide-details outlined dense></v-text-field>
            </v-col>
            <v-data-table :headers="starting_dialog.prev_table_header" :items="filtered_items" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }"   :items-per-page="5" :search="starting_dialog.search" :mobile-breakpoint="0" sort-by="date_created" loading-text="Loading Data... Please Wait..." item-key="transaction_number" class="elevation-1 mb-10 text-uppercase " sort-desc no-results>
                <template  v-slot:item="{item}"> 
                    <tr  v-on:dblclick="selectDoctor(item)"  :class="{'blue lighten-4': item.doctor_code === ''}"> 
                        <td class="d-flex justify-center align-center">
                            <div :class="[item.status === 'IN'? 'status-circle-green':'status-circle-red', 'mr-2']"> </div>
                        </td>
                        <td>{{ item.doctor_name ? item.doctor_name : 'N/A' }}</td>
                        <td>{{ item.specialization ? item.specialization : 'N/A' }}</td>
                        <td>{{ item.facility }} </td>
                        <td>{{ item.patient_seen }} </td>
                        <td :class="item.patient_queue >=7? 'orange--text':item.patient_queue >= 9? 'red--text':''">{{ item.patient_queue }} </td>
                        <td>{{ item.queue_limit }} </td>
                        <td>
                            <template v-if="item.is_doctor_selected"> 
                                <v-icon size="lg" class="green--text"> mdi-check-circle </v-icon>
                            </template>
                        </td>
                    </tr> 
                </template>
            </v-data-table>
        </div>

        <v-dialog v-model="clinic_hours_diaglog" width="900" persistent>
            <v-card>
                <v-form ref="tele_consult_data"> 
                    <v-card-title class="light-blue darken-4 text-sm-h6 white--text py-2 justify-center">
                        <v-spacer></v-spacer>SET TELEMEDICINE ASSISTED APPOINTMENT<v-spacer></v-spacer>
                        <v-btn @click="clinic_hours_diaglog = false" dark icon>
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-row class="mt-4 mx-6" dense>
                        <v-col cols="8" lg="8" class="d-flex">
                            <h4 class="body-2 font-weight-medium title-color"> DOCTOR: </h4>  <p class="body-2 font-weight-regular mx-2"> {{ starting_dialog.doctor_item.doctor_name }} </p>
                        </v-col>
                        <v-col cols="4" lg="4" class="d-flex">
                            <h4 class="body-2 font-weight-medium title-color"> SPECIALIZATION: </h4> <p class="body-2 font-weight-regular mx-2"> {{ starting_dialog.doctor_item.specialization }} </p>
                        </v-col>
                        <v-col cols="8" lg="8" class="d-flex">
                            <h4 class="body-2 font-weight-medium title-color"> MEDICAL FACILITY: </h4> <p class="body-2 font-weight-regular mx-2"> {{starting_dialog.doctor_item.facility}} </p>
                        </v-col>
                        <v-col cols="4" lg="4" class="d-flex">
                            <h4 class="body-2 font-weight-medium title-color"> ACTIVE STATUS: </h4> 
                            <div :class="[starting_dialog.doctor_item.status === 'IN'? 'status-circle-green':'status-circle-red', 'ml-2 mt-1 mr-2']"> </div>
                        </v-col>
                    </v-row>
                    <v-divider> </v-divider>
                    <v-row class="mt-4 mx-6" dense>
                        <v-col cols="4">
                            <h4 class="body-2 font-weight-medium mb-6"> PATIENT NAME </h4>
                            <h4 class="body-2 font-weight-medium mb-6"> DATE OF BIRTH </h4> 
                            <h4 class="body-2 font-weight-medium mb-8"> PREFERRED CONTACT NUMBER </h4> 
                            <h4 class="body-2 font-weight-medium mb-8"> LANDLINE / MOBILE NUMBER </h4>
                            <h4 class="body-2 font-weight-medium mb-8"> VIBER NUMBER </h4>  
                        </v-col>
                        <v-col cols="8">
                            <h4 class="body-2 font-weight-regular mb-6"> {{member_data.member.mem_middle_name !== null? member_data.member.mem_first_name + ' ' + member_data.member.mem_middle_name + ' ' + member_data.member.mem_last_name : member_data.member.mem_first_name + ' ' + member_data.member.mem_last_name}} </h4>
                            <h4 class="body-2 font-weight-regular mb-6"> {{ member_data.member.mem_birthdate }}</h4> 
                            <v-text-field v-model="member_data.member.mem_mobile_number" @keypress="numberOnly" :rules="empty_validation" maxlength="10" class="body-2 mb-6" hide-details clearable dense> 
                                <h6 slot="prepend-inner" class="body-2 align-baseline title-color" style="margin-top:4px; font-weight:500; font-size:11.5pt">+63</h6>
                            </v-text-field>  
                            <v-text-field v-model="starting_dialog.doctor_item.mobile_number" @keypress="numberOnly" maxlength="11" :rules="empty_validation" class="body-2 mb-6" hide-details clearable dense> 
                            </v-text-field>  
                            <v-text-field v-model="starting_dialog.doctor_item.viber_number" @keypress="numberOnly" maxlength="10" class="body-2 mb-6" hide-details clearable dense> 
                                <h6 slot="prepend-inner" class="body-2 align-baseline title-color" style="margin-top:4px; font-weight:500; font-size:11.5pt">+63</h6>
                            </v-text-field>  
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-card-actions class="d-flex justify-center flex-wrap mt-4"> 
                        <template v-if="starting_dialog.doctor_item.doctor_code === teleconsult_data.doctor_code"> 
                            <v-btn @click="cancleCLinicHours"  color="secondary" class="mx-2" outlined rounded><v-icon small left>fas fa-times-circle</v-icon>CANCEL DOCTOR</v-btn> 
                        </template>         
                        <v-btn @click="confirmStartingSelection" color="light-blue darken-4 white--text" class="mx-2" rounded >CONFIRM<v-icon small right>fas fa-check-circle</v-icon></v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <v-divider></v-divider>
        <v-card-actions > 
            <v-row justify="center" dense>
                <v-col cols="12" sm="4" md="4" lg="4" xl="4" class="text-center mb-3">
                    <v-btn @click="closeTeleConsult"  color="secondary" class="mx-2" outlined rounded><v-icon small left>fas fa-times-circle</v-icon>CLOSE</v-btn> 
                </v-col>
            </v-row>           
        </v-card-actions>

        <Alert :alert="alert" />
    </v-card>
</template>
<script>
import Alert from '@/components/Alert.vue'
import { mapState } from 'vuex'

export default {
    props: ['member_data'],

    components: {
        Alert
    },

    data() {
        return {
            search_tbl: '',

            starting_dialog:{
                startDialog: false,
                prev_table_header: [
                    { text: 'ACTIVE STATUS', value: 'status', sortable: false},
                    { text: 'DOCTOR NAME', value: 'doctor_name', sortable: false, width: 250},
                    { text: 'DOCTOR SPECIALIZATION', value: 'specialization', sortable: false},
                    { text: 'MEDICAL FACILITY', value: 'facility', sortable: false},
                    { text: 'PATIENT SEEN', value: 'patient_seen', sortable: false},
                    { text: 'PATIENT QUEUE', value: 'patient_queue', sortable: false},
                    { text: 'QUEUE LIMIT', value: 'queue_limit', sortable: false},
                    { text: 'SELECTED', value: 'is_doctor_selected', sortable: false}
                ],
                search:'',
                load:true,
                loading:false,
                doctor_list: [],
                doctor_item: {},
                doctor_code: '',
                confirmation_dialog:false,
            },

            // FORM VALIDATION
            empty_validation: [
                v => !!v && !/^ *$/.test(v) || 'Required Field',
            ],

            clinic_hours_diaglog: false,
            loading_tbl: true,
            clinic_header_list:[
                { text: '', value: 'date_created',width:"150px" },
                { text: 'MORNING', value: '', width:"200px"},
                { text: 'PATIENT ON QUEUE', value: '', width: "200px"},
                { text: 'AFTERNOON', value: '', sortable: false, width:"150px" },
                { text: 'PATIENT ON QUEUE', value: '', width: "200px"}
            ],

            cancelToken:null,
            source:null,
            alert: {}
        }
    },

    computed: {
        ...mapState(["teleconsult_data"]),

        filtered_items(){
            return this.starting_dialog.doctor_list.filter((i) => {
                let searched_data = (i.doctor_name.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1)
                let search = this.search_tbl ? searched_data : true
                return search 
            })    
        }
    },

    created() {
        this.CancelToken = this.$axios.CancelToken;
        this.source = this.CancelToken.source();
        this.getTeleConsultDoctor()
    }, 

    methods: {
        //GET THE LIST OF AVAILABLE DOCTOR FOR TELECONSULT
        async getTeleConsultDoctor() {
            this.starting_dialog.load =  true
            
            let response = await this.$services.getTeleConsultDoctorList({
                provider_code: this.$store.state.prv_data.provider_code,
                provider_tin: this.$store.state.prv_data.provider_tin,
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
            })

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                
                if(response.data !== 'no data') {
                    this.starting_dialog.doctor_list = response.data.map(data => {
                        return data = {
                            doctor_code: data.doctor_code,
                            doctor_name: data.doctor_name,
                            doctor_phic_account_no: data.doctor_phic_account_no,
                            doctor_prc_license: data.doctor_prc_license,
                            doctor_tin: data.doctor_tin,
                            facility: data.facility,
                            patient_queue: data.patient_queue,
                            patient_seen: data.patient_seen,
                            schedule: data.schedule,
                            specialization: data.specialization,
                            status: data.status,
                            queue_limit: data.queue_limit,
                            mobile_number: data.doctor_code === this.teleconsult_data.doctor_code ? this.teleconsult_data.mobile_number : '',
                            viber_number: data.doctor_code === this.teleconsult_data.doctor_code ? this.teleconsult_data.viber_number : '',
                            is_doctor_selected: data.doctor_code === this.teleconsult_data.doctor_code ? true : false
                        } 
                    })
                }

                this.list_timeout = setTimeout(() => this.getTeleConsultDoctor(), 10000)
            } else {
                this.alert = response.error
            }
        },

        closeTeleConsult() {
            this.$emit('display_teleconsult_referral')
        },

        //CANCEL CLINIC HOURS / REMOVED THE SELECTED DOCTOR
        cancleCLinicHours() {
            this.clinic_hours_diaglog = false
            this.starting_dialog.doctor_item = {}
            this.starting_dialog.doctor_list.forEach(data => {
                data.is_doctor_selected = false
            })
            
            this.$emit('forTeleConsult', false)
        },

        //CONFIRM THE SELETED FORMS FOR TELECONSULT
        confirmStartingSelection() {
            if (this.$refs.tele_consult_data.validate()) {  
                this.clinic_hours_diaglog = false
                this.$emit('forTeleConsult', true)
                let tele_consult = {
                    patient_name: this.member_data.member.mem_first_name + ' ' + this.member_data.member.mem_middle_name + ' ' + this.member_data.member.mem_last_name,
                    doctor_code: this.starting_dialog.doctor_item.doctor_code,
                    doctor_name: this.starting_dialog.doctor_item.doctor_name,
                    doctor_phic_account_no: this.starting_dialog.doctor_item.doctor_phic_account_no,
                    doctor_prc_license: this.starting_dialog.doctor_item.doctor_prc_license,
                    doctor_tin: this.starting_dialog.doctor_item.doctor_tin,
                    specialization: this.starting_dialog.doctor_item.specialization,
                    status: this.starting_dialog.doctor_item.status,
                    preferred_number: this.member_data.member.mem_mobile_number,
                    is_selected: true,
                    mobile_number: this.starting_dialog.doctor_item.mobile_number,
                    viber_number: this.starting_dialog.doctor_item.viber_number,
                    clinic_schedule: this.clinic_schedule
                }

                this.$emit('getTeleConsultData', tele_consult)
                this.$store.dispatch('getTeleConsultData', tele_consult)

                this.starting_dialog.doctor_list.map(data => {
                    if(data.doctor_tin === this.starting_dialog.doctor_item.doctor_tin) {
                        data.is_doctor_selected = true
                    } else {
                        data.is_doctor_selected =  false
                    }
                })
            }
        },
        
        //SELECT INDIVIDUAL DOCTOR AND OPEN FOR A DIALOG BOX 
        selectDoctor(item){
            if(item.queue_limit === item.patient_queue) {
                this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow', title: 'TELE CONSULT REFERRAL', body: "This doctor has reached the maximum number of queue limit.", btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            } else {
                this.clinic_hours_diaglog = true
                this.starting_dialog.doctor_item = item
            }
        },

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if((event.which < 48 || event.which > 57)){
                event.preventDefault();
            }
        }
    }
}
</script>

<style scoped>
.title-color {
    color: #1565c0ff;
}
.clinic-time:hover{
    background-color: rgb(223, 223, 223);
}
.clinic-tr:hover {
  background: transparent !important;
}
.status-circle-red {
    width: 12px;
    height: 12px;
    background: rgb(162, 162, 162);
    border-radius: 50%;
}
.status-circle-green {
    width: 12px;
    height: 12px;
    background: rgb(2, 182, 101);
    border-radius: 50%;
}
</style>
