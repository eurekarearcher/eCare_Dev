<template>
    <v-container>
        <div class="pb-2" id="not-for-print">
            <div v-if="$store.state.usr_credentials.user_type === '2-1'">
                <Navbar :navbar="navbar" />
            </div>
            
            <h1 class="font-weight-medium grey--text text--darken-3 mb-3">Dispensing of Medicine</h1>

            <v-row dense align="start" class="my-5">
                <v-col cols="12" lg="7">
                    <v-row dense align="center">
                        <v-col cols="12" sm="6" md="3">
                            <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" :value="formatDate(start_date)" label="Start Date" hide-details outlined readonly dense />
                                </template>

                                <v-date-picker v-model="start_date" :max="end_date" no-title/>
                            </v-menu>
                        </v-col>

                        <v-col cols="12" sm="6" md="3">
                            <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" :value="formatDate(end_date)" label="End Date" hide-details outlined readonly dense/>
                                </template>

                                <v-date-picker v-model="end_date" :min="start_date" :disabled="!start_date" no-title/>
                            </v-menu>
                        </v-col>

                        <v-col cols="12" sm="12" md="4">
                            <v-btn :disabled="!start_date && !end_date" @click="getPrescribedMedicineByPID" class="white--text" color="primary" height="41">
                                <v-icon color="white" left>mdi-update</v-icon>
                                <span>LOAD SELECTED DATES</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" lg="5">
                    <v-text-field v-model="tbl_search" placeholder="Search" prepend-inner-icon="mdi-magnify" hide-details outlined dense/>
                </v-col>
            </v-row>

            <v-data-table :headers="tbl_headers" :items="tbl_items" :loading="tbl_loading" :search="tbl_search" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :mobile-breakpoint="0" @dblclick:row="viewMedicine" class="elevation-2 mb-5" id="not-for-print">
            </v-data-table>

            <v-dialog v-model="dispense_dialog" max-width="1500" persistent>
                <v-card v-if="progress_loading" class="d-flex justify-center align-center">
                    <div class="my-16 text-center">
                        <v-progress-circular color="primary" size="100" indeterminate></v-progress-circular>
                        <h4 class="light-blue--text text--darken-4 mt-10 pl-5">Loading... Please wait...</h4>
                    </div>
                </v-card>
                <v-card v-else>
                    <ViewMedicine @closeViewMedicine="closeViewMedicine" ref="view" />
                </v-card>
            </v-dialog>

            <Alert :alert="alert" />
        </div>
    </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'
import ViewMedicine from '@/components/e-benefit/dispense-medicine/ViewMedicine.vue'

export default {
    components: {
        Navbar,
        Alert,
        ViewMedicine
    },
    
    data() {
        return {
            tbl_loading: true,
            tbl_search: '',
            tbl_headers: [
                { text: 'Date Created', value: 'date_created', width: '150px' },
                { text: 'Transaction Number', value: 'transaction_number', width: '150px', sortable: false },
                { text: 'Patient Name', value: 'patient_name', width: '300px' },
                { text: 'Doctor Name', value: 'doctor_name', width: '300px', sortable: false }
            ],
            tbl_items: [],
        
            navbar: [],
            alert: {},
            dispense_dialog: false,
            data_length: '',
            dispensing_data_length: localStorage.getItem("DLJD92") ? this.$crypto.AES.decrypt(localStorage.getItem("DLJD92"), "jhfg8c7").toString(this.$crypto.enc.Utf8)  : 0,
            progress_loading: false,

            start_date: this.$moment().add(-7, 'days').format('YYYY-MM-DD'),
            end_date: this.$moment().format('YYYY-MM-DD')
        }
    },

    created() {
        this.getPrescribedMedicineByPID();
        
        if(this.$store.state.usr_credentials.user_type !== '2-1') {
            this.navbar.push(
                {title: "Dispensing of Medicine", link: "/pharmacist/dispensing", icon: "mdi-pill-multiple" },
                { title: "Medicine Inventory", link: "/pharmacist/inventory", icon: "mdi-pill-multiple"},
                { title: "Inventory History", link: "/pharmacist/history", icon: "mdi-history"},
                { title: "Transfer Medicine", link: "/pharmacist/transfer", icon: "mdi-transfer"},
                { title: "Received Medicine", link: "/pharmacist/received", icon: "fas fa-folder" }
            )
        }  else {
            this.navbar.push({ title: 'Home', link: '/code-scanning', icon: 'fas fa-home' })
        }
    },

    methods: {
        async getPrescribedMedicineByPID() {
            let response = await this.$services.getTransactionPrescribedMedicineByPid({
                provider_tin: this.$store.state.prv_data.provider_tin,
                provider_code: this.$store.state.prv_data.provider_code,
                start_date: this.start_date,
                end_date: this.end_date
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                const has_data = response.data?.has_data
                if(has_data === false) {
                    this.tbl_items = []
                } else {
                    if (Array.isArray(response.data)) {
                        this.tbl_items = response.data.map(element => {
                            return {
                                date_admitted: this.formatDateAndTime(element.date_admitted),
                                transaction_number: element.transaction_number,
                                patient_name: this.combineString([element.first_name, element.middle_name, element.last_name, element.suffix]),
                                doctor_name: this.combineString([element.doc_first_name, element.doc_middle_name, element.doc_last_name, element.doc_suffix]),
                                patient_address: element.patient_address,
                                patient_age: element.patient_age,
                                date_created: this.formatDateAndTime(element.date_created),
                                doctor_prc_license: element.doctor_prc_license,
                                // medicines: element.transaction_medicine.map(data => {
                                //     return {
                                //         ...data,
                                //         available_to_dispensed: data.total_dispensed_medicine ? data.total_prescribed_medicine - data.total_dispensed_medicine : data.total_prescribed_medicine - 0
                                //     }
                                // })
                            }
                        })
                    }
                }
                this.tbl_loading = false
            } else {
                this.alert = response.error
            }
            const current_length = response.data.length;
            this.data_length  = Number(this.dispensing_data_length);

            if (this.data_length !== current_length) {
                const audio = new Audio(require('../../../assets/new_transaction.mp3'));
                audio.play();
            }

            this.dispensing_data_length = current_length;
            localStorage.setItem('DLJD92', this.$crypto.AES.encrypt(JSON.stringify(this.dispensing_data_length), 'jhfg8c7'));
            
            
            setTimeout(() => {
                this.display_add_new_or_delivery = true
            }, 180000)

        },

        async getTransactionMedicine(item){
            this.dispense_dialog = true;
            this.progress_loading = true
            let response = await this.$services.getTransactionMedicine({
                transaction_number: item.transaction_number,
                provider_code: this.$store.state.prv_data.provider_code
            })

            if(response.status === 200){
                this.progress_loading = false
                response.data = this.responseDataDecryption(response.data)

                let medicines = response.data.transaction_medicine.map(data => {
                    return {
                        ...data,
                        available_to_dispensed: data.total_dispensed_medicine ? data.total_prescribed_medicine - data.total_dispensed_medicine : data.total_prescribed_medicine - 0
                    }
                })

                this.$nextTick(() => {
                    this.$refs.view.openViewMedicine({
                        patient_name: item.patient_name,
                        medicines: medicines,
                        transaction_number: item.transaction_number,
                        dispensed_medicine_status: item.dispensed_medicine_status,
                        doctor_name: item.doctor_name,
                        patient_address: item.patient_address,
                        patient_age: item.patient_age,
                        date_admitted: item.date_admitted,
                        doctor_prc_license: item.doctor_prc_license
                    });
                });
            } else {
                this.alert = response.error
            }
        },

        viewMedicine(event, {item}) {
            this.getTransactionMedicine(item)
        },

        closeViewMedicine() {
            this.dispense_dialog = false
        }
    }
}
</script>


<style scoped>
::v-deep .v-dialog {
    box-shadow: none;
}
@media print {
  ::v-deep #not-for-print {
    display: none !important;
  }
}

</style>