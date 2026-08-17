<template>
    <div class="px-sm-9 pa-4">
        <Navbar :navbar="navbar" />
        
        <label class="font-weight-medium headline d-block mt-8 mb-4">Referred Transaction</label>

        <v-row dense>
            <v-col cols="12" md="10" lg="10">
                <v-text-field v-model="tbl_search" label="Search" prepend-inner-icon="mdi-magnify" hide-details outlined rounded dense></v-text-field>
            </v-col>

            <v-col class="text-right" cols="12" md="2" lg="2">
                <v-btn @click="clearFilter" color="secondary lighten-3">CLEAR SEARCHES <v-icon>mdi-refresh</v-icon></v-btn>
            </v-col>
        </v-row>

        <v-row class="mt-6" align="center" dense>
            <v-col cols="12" md="auto" lg="auto">
                <label>FILTER: <span class="px-3">Date</span></label>
            </v-col>

            <v-col cols="12" md="2" lg="2">
                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" :value="formatDate(start_date)" class="body-2" label="Start Date" hide-details outlined readonly dense></v-text-field>
                    </template>

                    <v-date-picker v-model="start_date" :max="dateToday()" no-title></v-date-picker>
                </v-menu>
            </v-col>

            <v-col cols="12" md="2" lg="2">
                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" :value="formatDate(end_date)" class="body-2" label="End Date" hide-details outlined readonly dense></v-text-field>
                    </template>

                    <v-date-picker v-model="end_date" :max="dateToday()" no-title></v-date-picker>
                </v-menu>
            </v-col>

            <v-spacer></v-spacer>

            <v-col cols="12" md="3" lg="3">
                <v-select v-model="status" :items="status_items" label="Status" hide-details outlined dense></v-select>
            </v-col>
        </v-row>

        <v-data-table :headers="tbl_headers" :items="filtered_tbl_items" :loading="tbl_loading" :search="tbl_search" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :mobile-breakpoint="0" class="elevation-2 mt-6">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.date_of_referral }}</td>
                    <td>{{ item.patient_name }}</td>
                    <td>{{ item.referral_code }}</td>
                    <td>
                        {{ item.referred_to_doctor }}<br>
                        {{ item.referral_doctor_specialization }}
                    </td>
                    <td>{{ item.referral_provider_name }}</td>
                    <td>{{ item.reason_for_referral }}</td>
                    <td>{{ item.status }}</td>
                    <td>{{ item.acknowledged_by_doctor }}</td>
                    <td>{{ item.acknowledged_by_provider_name }}</td>
                </tr>
            </template>
        </v-data-table>

        <Alert :alert="alert" />
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'

export default {
    components: {
        Navbar,
        Alert
    },

    data() {
        return {
            tbl_loading: true,
            tbl_search: '',
            tbl_headers: [
                { text: 'Date of Referral', value: 'date_of_referral', width: '200px' },
                { text: 'Patient Name', value: 'patient_name', width: '200px', sortable: false },
                { text: 'Referral Code', value: 'referral_code', width: '200px', sortable: false },
                { text: 'Referred to Doctor', value: 'referred_to_doctor', width: '180px', sortable: false },
                { text: 'Referral HealthCare Facility', value: 'referral_provider_name', width: '220px', sortable: false },
                { text: 'Reason for Referral', value: 'reason_for_referral', width: '180px', sortable: false },
                { text: 'Status', value: 'status', width: '100px', sortable: false },
                { text: 'Acknowledged by Doctor', value: 'acknowledged_by_doctor', width: '180px', sortable: false },
                { text: 'Acknowledged by HealthCare Facility', value: 'acknowledged_by_provider_name', width: '220px', sortable: false }
            ],
            tbl_items: [],

            start_date: '',
            end_date: '',
            status: 'ALL',
            status_items: ['ALL', 'Pending', 'Acknowledged'],

            navbar: this.$store.state.usr_credentials.department === 'Doctor' || this.$store.state.usr_credentials.department === 'Midwife' ? [
                { title: 'Patient Queue List', link: '/patient-queue-list', icon: 'fas fa-folder' },
                { title: 'Transaction Record List', link: '/patient-transaction-record', icon: 'fas fa-clipboard-list' },
                { title: 'Referred Transaction', link: '/referred-transaction', icon: 'fas fa-clipboard-check' }
            ] : [{ title: 'Home', link: '/code-scanning', icon: 'fas fa-home' }],
            alert: {}
        }
    },

    created() {
        this.getReferralList();
    },

    computed: {
        filtered_tbl_items() {
            return this.tbl_items.filter(e => {
                let search = ''

                if (this.tbl_search) {
                    search = (e.date_of_referral.toLowerCase().indexOf(this.tbl_search.toLowerCase()) > -1) || 
                    (e.patient_name.toLowerCase().indexOf(this.tbl_search.toLowerCase()) > -1) || 
                    (e.referral_code.toLowerCase().indexOf(this.tbl_search.toLowerCase()) > -1) || 
                    (e.referred_to_doctor.toLowerCase().indexOf(this.tbl_search.toLowerCase()) > -1) || 
                    (e.referral_doctor_specialization.toLowerCase().indexOf(this.tbl_search.toLowerCase()) > -1) || 
                    (e.referral_provider_name.toLowerCase().indexOf(this.tbl_search.toLowerCase()) > -1) ||
                    (e.reason_for_referral.toLowerCase().indexOf(this.tbl_search.toLowerCase()) > -1) ||
                    (e.status.toLowerCase().indexOf(this.tbl_search.toLowerCase()) > -1) ||
                    (e.acknowledged_by_doctor.toLowerCase().indexOf(this.tbl_search.toLowerCase()) > -1) ||
                    (e.acknowledged_by_provider_name.toLowerCase().indexOf(this.tbl_search.toLowerCase()) > -1)
                } else {
                    search = true
                }
                
                const convert = (val) => new Date(val.substring(0, 10)).setHours(0, 0, 0, 0)
                const date = this.start_date && this.end_date ? convert(e.date_of_referral) >= convert(this.start_date) && convert(e.date_of_referral) <= convert(this.end_date) : true
                const status = this.status === 'ALL' ? true : e.status === this.status

                return search && date && status
            })
        }
    },

    methods: {
        async getReferralList() {
            let response = await this.$services.getReferredTransactionBypId({
                request_key: this.$store.state.usr_credentials.provider_reg_type === 'BRGY' ? 'brgy' : 'doctor',
                provider_tin: this.$store.state.prv_data.provider_tin,
                provider_code: this.$store.state.prv_data.provider_code,
                ...(this.$store.state.usr_credentials.department === 'Doctor' || this.$store.state.usr_credentials.department === 'Midwife' ? {
                    referring_doctor_tin: this.$store.state.usr_credentials.doctor_tin,
                    referring_doctor_code: this.$store.state.usr_credentials.doctor_code 
                } : undefined)
            })

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)

                if (Array.isArray(response.data)) {
                    this.tbl_items = response.data.map(element => {
                        return {
                            date_of_referral: this.formatDateAndTime(element.date_of_referral),
                            patient_name: this.combineString([element.patient_first_name, element.patient_middle_name, element.patient_last_name, element.patient_suffix]),
                            referral_code: element.referral_code,
                            referred_to_doctor: this.combineString([element.referral_doctor_first_name, element.referral_doctor_middle_name, element.referral_doctor_last_name]),
                            referral_doctor_specialization: element.referral_doctor_specialization ? element.referral_doctor_specialization : '--',
                            referral_provider_name: this.displayNA(element.referral_provider_name),
                            reason_for_referral: this.displayNA(element.reason_for_referral),
                            status: element.status !== '1' ? 'Pending' : 'Acknowledged',
                            acknowledged_by_doctor: element.acknowledged_by_doctor_first_name ? this.combineString([element.acknowledged_by_doctor_first_name, element.acknowledged_by_doctor_middle_name, element.acknowledged_by_doctor_last_name]) : '--',
                            acknowledged_by_provider_name: element.acknowledged_by_provider_name ? element.acknowledged_by_provider_name : '--'
                        }
                    })
                }

                this.tbl_loading = false
            } else {
                this.alert = response.error
            }
        },

        clearFilter() {
            this.tbl_search = ''
            this.start_date = ''
            this.end_date = ''
            this.status = 'ALL'
        }
    }
}
</script>