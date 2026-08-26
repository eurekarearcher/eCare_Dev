<template>
    <div>
        <v-layout v-show="vaccine_loading" class="my-14" justify-center align-center>
            <v-progress-circular color="primary" size="30" indeterminate></v-progress-circular>
            <h5 class="font-weight-medium light-blue--text text--darken-4 body-2 pl-5">Loading Data... Please wait...</h5>
        </v-layout>
        
        <div v-if="!vaccine_loading" class="pl-0 pl-sm-4">
            <v-row dense class="mb-4"> 
                <v-col cols="12" sm="4" md="4" lg="4" offset-sm="8" offset-md="8" offset-lg="8">
                    <v-text-field v-model="tbl_search" prepend-inner-icon="mdi-magnify" label="Search" hide-details outlined dense></v-text-field>
                </v-col>
            </v-row>
            
            <v-data-table :headers="tbl_headers" :items="tbl_items" :search="tbl_search" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :items-per-page="5" class="elevation-1 mb-6" mobile-breakpoint="0">
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.vaccine }}</td>
                        <td>
                            <span v-if="item.vaccine === 'BCG'">Tuberculosis (TB)</span>
                            <span v-else-if="item.vaccine === 'HEPATITIS B'">Hepatitis B</span>
                            <span v-else-if="item.vaccine === 'ORIAL POLIO VACCINE' || item.vaccine === 'INACTIVATED POLIO VACCINE'">Polio</span>
                            <span v-else-if="item.vaccine === 'PNEUMOCOCCAL CONJUGATED VACCINE'">Pulmonia, Meningitis</span>
                            <span v-else-if="item.vaccine === 'MEASLES, MUMPS, RUBELLA'">Measles, Mumps, German Measles</span>
                            <span v-else>N/A</span>
                        </td>
                        <td>{{ item.date_vaccinated === '1900-01-01' ? 'N/A' : formatDate(item.date_vaccinated) }}</td>
                        <td>{{ item.vaccinator === '' ? 'N/A' : item.vaccinator }}</td>
                    </tr>
                </template>
            </v-data-table>
            
            <template v-if="emr_params.editable">
                <v-row class="font-weight-medium text-center body-2 d-none d-sm-flex">
                    <v-col cols="12" sm="4" md="4" lg="4">Vaccine</v-col>
                    <v-col cols="12" sm="4" md="4" lg="4">Date Vaccinated</v-col>
                    <v-col cols="12" sm="4" md="4" lg="4">Vaccinator</v-col>
                </v-row>

                <v-row v-for="(value, index) in vaccination_record" :key="index">
                    <v-col cols="12" sm="4" md="4" lg="4">
                        <v-autocomplete v-model="value.vaccine" :disabled="from_migration" :items="vaccine_items" :error="vac_has_empty && !value.vaccine" @change="checkSelectedValue($event, index, 'Vaccine')"  item-text="vaccine"  label="Vaccine" return-object hide-details></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="4" md="4" lg="4">
                        <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" :value="formatDate(value.date_vaccinated)" :error="vac_has_empty && !value.date_vaccinated && value.vaccine !== 'NONE'" :error-messages="vac_has_empty && !value.date_vaccinated && value.vaccine !== 'NONE' ? ['Date is required'] : []" :disabled="isAddButtonDisabled || from_migration" label="Date"  prepend-inner-icon="mdi-calendar" hide-details></v-text-field>
                            </template>

                            <v-date-picker v-model="value.date_vaccinated"  :error="vac_has_empty && !value.date_vaccinated && value.vaccine !== 'NONE'" :min="patient_birthdate" :max="dateToday()" @change="emitData" no-title></v-date-picker>
                        </v-menu>
                    </v-col>
                    
                    <v-col cols="12" sm="4" md="4" lg="4">
                        <v-text-field v-model="value.vaccinator" :error="vac_has_empty && !value.vaccinator && value.vaccine !== 'NONE'"  @change="checkSelectedValue($event, index, 'Vaccinator')" label="Vaccinator"  :disabled="isAddButtonDisabled || from_migration" hide-details>
                            <template v-slot:append-outer>
                                <v-icon @click="removeVaccineRow(index)" :disabled="from_migration" size="26">mdi-delete</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>
            </template>

            <div class="text-right mr-8 my-5">
                <v-btn v-if="emr_params.editable" @click="addVaccinationRow" :disabled="isAddButtonDisabled || from_migration" color="#367c9d" dark>ADD VACCINATION RECORD <v-icon right>mdi-plus</v-icon></v-btn>
            </div>
        </div>

        <v-dialog v-model="others_field.dialog" width="400" persistent>
            <v-card class="pa-5">
                <label class="font-weight-medium">{{ others_field.type }}</label>
                <v-text-field v-model="others_field.value" :disabled="from_migration" :placeholder="`Enter the ${others_field.type}`" hide-details outlined></v-text-field>

                <v-layout justify-end wrap mt-4>
                    <v-btn @click="insertOtherValue('close')" small>CLOSE</v-btn>
                    <v-btn @click="insertOtherValue('confirm')" :disabled="!others_field.value" class="ml-2" color="primary" small>CONFIRM</v-btn>
                </v-layout>
            </v-card>
        </v-dialog>

        <Alert :alert="alert" />
    </div>
</template>

<script>
import Alert from '@/components/Alert.vue'

export default{
    props: ['emr_params', 'vac_has_empty', 'loading_vaccinator', 'vaccinator_items', 'patient_birthdate', 'patient_age', 'loading_vaccination','from_migration'],

    components: {
        Alert
    },

    data() {
        return {
            tbl_loading: false,
            tbl_search: '',
            tbl_headers: [
                { text: 'VACCINE', value: 'vaccine', width: '350px', sortable: false },
                { text: 'DISEASE TO BE PREVENTED', value: '', width: '400px', sortable: false },
                { text: 'DATE VACCINATED', value: 'date_vaccinated', width: '200px' },
                { text: 'VACCINATOR', value: 'vaccinator', width: '250px', sortable: false }
            ],
            tbl_items: [],

            vaccine_items: [],

            vaccination_record: [
                {
                    imm_code: '',
                    vaccine:'',
                    date_vaccinated:'',
                    vaccinator:''
                }
            ],
            others_field: {
                dialog: false,
                index: '',
                type: '',
                value: ''
            },
            
            has_previous_record: false,
            alert: {},
            vaccine_loading: this.loading_vaccination
        }
    },

    created() {
        this.getVaccinationRecord();
        this.checkIfEmpty();
    },

    computed: {
        isAddButtonDisabled() {
            return this.vaccination_record.some(record => record.vaccine === 'NONE');
        }
    },

    watch: {
        loading_vaccination(value) {
            this.vaccine_loading = value; 
        }
    },
    methods: {
        async getVaccinationRecord() {
            let vaccination_record = sessionStorage.getItem('lsfk4iofd') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('lsfk4iofd'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true
            }

            if (vaccination_record.fresh_load) {
                let response = await this.$services.getEmrChildVaccinationRecord({
                    // ek_id: this.emr_params,
                    ek_lgu_id: this.emr_params.ek_lgu_id,
                    // ek_hmo_id: this.emr_params.ek_hmo_id,
                    // lgu_number: '',
                    // policy_number: this.emr_params.hmo_policy_number,
                    // phic_number: ''
                })

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
                    vaccination_record.fresh_load = false
                    vaccination_record.tbl_items = response.data
                    sessionStorage.setItem('lsfk4iofd', this.$crypto.AES.encrypt(JSON.stringify(vaccination_record), 'EMX246'))

                    // CHECK IF THERE ARE PREVIOUS RECORDS AND IF "NONE" HAS BEEN SELECTED BEFORE
                    //this.has_previous_record = false;
                    this.has_previous_record = vaccination_record.tbl_items.length > 0; 
                    this.none_selected_before = vaccination_record.tbl_items.some(item => item.vaccine === 'NONE');

                    this.tbl_items = response.data;
                    this.tbl_loading = false;  
                    this.vaccine_loading = false;
                } else {
                    this.alert = response.error
                }
            } else {
                //this.has_previous_record = false;
                this.has_previous_record = vaccination_record.tbl_items.length > 0; 
                this.none_selected_before = vaccination_record.tbl_items.some(item => item.vaccine === 'NONE');

                this.tbl_items = vaccination_record.tbl_items;
                this.tbl_loading = false;
                this.vaccine_loading = false;
            }

            this.getVaccineList()
        },

        async getVaccineList(){
            let vaccination_items = sessionStorage.getItem('lsfk4iofds') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('lsfk4iofds'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true
            }

            if (vaccination_items.fresh_load) {
                let response = await this.$services.getTransactionIpRefData({ request_key: 'vaccine' })

                if (response.status === 200) {
                    //response.data = this.responseDataDecryption(response.data)
                    vaccination_items.fresh_load = false
                    vaccination_items.items = response.data

                    // REMOVE "NONE" IF A PREVIOUS RECORD EXISTS OR IF "NONE" HAS ALREADY BEEN SELECTED
                    if (this.none_selected_before || this.has_previous_record) {
                        vaccination_items.items = vaccination_items.items.filter(vaccine => vaccine.vaccine !== 'NONE');
                    }

                    this.vaccine_items = vaccination_items.items;

                    sessionStorage.setItem('lsfk4iofds', this.$crypto.AES.encrypt(JSON.stringify(vaccination_items), 'EMX246'))
                } else {
                    this.alert = response.error
                }
            } else {
                // REMOVE "NONE" IF A PREVIOUS RECORD EXISTS OR IF "NONE" HAS ALREADY BEEN SELECTED
                if (this.none_selected_before || this.has_previous_record) {
                    vaccination_items.items = vaccination_items.items.filter(vaccine => vaccine.vaccine !== 'NONE');
                }
                this.vaccine_items = vaccination_items.items;
            }  
        },

        async postData() {
            if (this.vaccination_record.length === 0) {
                return true
            } else {
                // MERGE PREVIOUS RECORDS FROM TBL_ITEMS WITH THE NEW VACCINATION RECORD
                let merged_vaccination_records = [...this.tbl_items, ...this.vaccination_record];

                let response = await this.$services.trnUpdatePatientTranRecord({
                    request_key: 'child_vaccination_record',
                    hmo_policy_number: this.emr_params.hmo_policy_number,
                    ek_phic_id: this.emr_params.ek_phic_id,
                    ek_lgu_id: this.emr_params.ek_lgu_id,
                    ek_hmo_id: this.emr_params.ek_hmo_id,
                    phic_host_code: this.emr_params.phic_host_code,
                    lgu_host_code: this.emr_params.lgu_host_code,
                    child_vaccination_record: merged_vaccination_records,
                    process_by: this.$store.state.usr_credentials.user_name
                })

                if (response.status === 200) {
                    if (response.data.success) {
                        sessionStorage.removeItem('lsfk4iofd')
                        sessionStorage.removeItem('lsfk4iofds')
                        return {
                            child_vaccination_record: merged_vaccination_records,
                            success: true
                        }
                    } else {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                } else {
                    this.alert = response.error
                }
            }
        },

        addVaccinationRow() {
            this.vaccination_record.push({
                vaccine:'',
                date_vaccinated:'',
                vaccinator:''
            })
        },
        
        removeVaccineRow(index) {
            this.vaccination_record.splice(index, 1)
        },

        checkSelectedValue(data, index, type) {
            if (data === 'Others' || data?.vaccine === 'Others') {
                this.others_field.index = index
                this.others_field.type = type
                this.others_field.dialog = true
            }

            if (type === 'Vaccine') {
                this.vaccination_record[index].imm_code = data?.imm_code
                this.vaccination_record[index].vaccine = data?.vaccine.trim()
            }

            if (type === 'Vaccine' && data?.vaccine === 'NONE') {
                // MARK THAT 'NONE' HAS BEEN SELECTED
                this.none_selected_before = true;
            }

            this.emitData();
        },

        insertOtherValue(status) {
            if (status === 'confirm') {
                if (this.others_field.type === 'Vaccine') {
                    this.vaccine_items.unshift({
                        code: 'oth',
                        vaccine: this.others_field.value
                    })
                    
                    this.vaccination_record[this.others_field.index].vaccine = this.others_field.value
                } else {
                    this.vaccinator_items.unshift({
                        key: '',
                        vaccinator: this.others_field.value
                    })

                    this.vaccination_record[this.others_field.index].vaccinator = this.others_field.value
                }
            } else {
                if (this.others_field.type === 'Vaccine') {
                    this.vaccination_record[this.others_field.index].vaccine = ''
                } else {
                    this.vaccination_record[this.others_field.index].vaccinator = ''
                }
            }

            this.others_field.dialog = false
            this.others_field.value = ''
            this.emitData();
        },

        /*checkIfEmpty() {
            return this.vaccination_record.some(element => !element.vaccine || !element.date_vaccinated || !element.vaccinator)
        },*/

        checkIfEmpty() {
            if (this.patient_age <= 2) {
                return this.vaccination_record.some((entry) => {
                    if (entry.vaccine && entry.vaccine !== 'NONE') {
                        const date_missing = !entry.date_vaccinated;
                        const vaccinator_missing = !entry.vaccinator;
                        return date_missing || vaccinator_missing;
                    }
                    return false;
                });
            }
            return false;
        },

        emitData() {
            this.$emit('mutationStatus', 'vac', this.vaccination_record)
        }
    }
}
</script>