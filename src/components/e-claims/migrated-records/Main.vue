<template>
    <div class="px-sm-9 px-4 pb-2 d-print-none">
        <Navbar :navbar="navbar" />
        <v-row class="mt-7 mb-2" justify="space-between" wrap>
            <h2 class="font-weight-medium align-self-end order-1 order-sm-0">Migrated Eclaims Records</h2>
            <v-col class="order-0 order-sm-1" cols="12" sm="4" md="3">
                <v-img :src="$store.state.prv_config.provider_logo" class="ml-sm-auto mx-sm-0 mx-auto" max-width="200" width="180" height="60" alt="Provider Logo" contain></v-img>
            </v-col>
        </v-row>

        <v-row wrap>
            <v-col cols="12" sm="8" md="9" lg="10" xl="10" class="pr-sm-4">
                <v-text-field v-model="search_tbl"  placeholder="Search" outlined rounded dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="text-right">
                <v-btn @click="clearFilter" color="secondary lighten-3"><v-icon left>mdi-refresh</v-icon> CLEAR SEARCHES</v-btn>
            </v-col>
        </v-row>

        <v-row class="mt-4" justify="end" align="center">
            <v-col cols="12" sm="8" md="5" lg="5" xl="5">
                <v-row justify="end">
                    <v-col cols="12" sm="4" md="4" lg="4" xl="4" >
                        <v-select v-model="patient_type" :items="patients_type" label="Patient Type" outlined dense></v-select>
                    </v-col>

                    <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                        <v-select v-model="series_no" :items="series_types" label="Series / Claim / Receipt / Transmission No." outlined dense
                        ></v-select>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        
        <v-data-table :headers="headers" :items="filtered_migrated_records" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :mobile-breakpoint="0" class="elevation-2 mb-5" sort-by="tstamp" sort-desc>
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.patient_full_name }}</td>
                    <td>{{ item.patient_type }}</td>
                    <td>{{ item.claim_no }}</td>
                    <td>{{ item.claim_type }}</td>
                    <td>{{ item.transmission_control_no }}</td>
                    <td>{{ item.receipt_ticket_no }}</td>
                    <td>{{ item.series_lhio }}</td>
                    <td><v-btn @click="eClaimCfForms(item)" class="mr-2" small tile><v-icon small>mdi-format-list-bulleted</v-icon>E-CLAIM</v-btn></td>
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
    
    data(){
        return{
            headers: [
                { text: 'Patient Name', value: 'patient_full_name', width: '300px', sortable: true },
                { text: 'Patient Type', value: 'patient_type', width: '150px', sortable: true },
                { text: 'Claim No.', value: 'claim_no', width: '150px', sortable: true },
                { text: 'Claim Type', value: 'claim_type', width: '150px', sortable: true },
                { text: 'Transmission Control No.', value: 'transmission_control_no', width: '150px', sortable: true },
                { text: 'Receipt Ticket No.', value: 'receipt_ticket_no', width: '150px', sortable: true },
                { text: 'Series Lhio', value: 'series_lhio', width: '150px', sortable: true },
                { text: 'Action', value: '', width: '215px', sortable: false }
            ],
            
            navbar: [
                { title: 'Member Eligibility', link: '/eclaims-member-eligibility-checker', icon: 'fas fa-user' },
                { title: "HCP Accreditation", link: "/eclaims-hcp-accreditation", icon: "fas fa-user-doctor" },
                { title: "Search Member PIN", link: "/eclaims-retrieve-pin", icon: "fas fa-id-card" },
                { title: "Search Employer", link: "/eclaims-search-employer", icon: "fas fa-user-friends" },
                { title: 'Claims Patient List', link: '../eclaims-patient-list', icon: 'fas fa-folder' }
            ],

            patients_type: ['ALL', 'OUTPATIENT', 'INPATIENT', 'EMERGENCY'],
            series_types: ['ALL', 'SERIES LHIO', 'CLAIM NUMBER', 'RECEIPT TICKET NUMBER', 'TRANSMISSION CONTROL NUMBER'],
            
            search_tbl: "",
            series_no: "ALL",
            patient_type: "ALL",

            alert: {},

            migrated_records: []
        }
    },

    created() {
        this.getEclaimsMigratedRecords();
        sessionStorage.removeItem('MftrIDjk')               
    },

    computed: {
        filtered_migrated_records(){
            return this.migrated_records.filter((i) => {
                let searched_data =
                    (
                        (i.patient_full_name?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                        (i.patient_type?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                        (i.claim_no?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                        (i.claim_type?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                        (i.claim_no?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                        (i.transmission_control_no?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                        (i.receipt_ticket_no?.toLowerCase().includes(this.search_tbl.toLowerCase())) ||
                        (i.series_lhio?.toLowerCase().includes(this.search_tbl.toLowerCase()))
                    )

                    let search = this.search_tbl ? searched_data : true;

                    let transaction_type = this.patient_type === 'ALL'
                        ? true
                        : i.patient_type.toUpperCase() === this.patient_type;

                    let series_no_type = true;

                    if (this.series_no === 'SERIES LHIO') {
                        series_no_type = !!i.series_lhio;
                    } else if (this.series_no === 'CLAIM NUMBER') {
                        series_no_type = !!i.claim_no;
                    } else if (this.series_no === 'RECEIPT TICKET NUMBER') {
                        series_no_type = !!i.receipt_ticket_no;
                    } else if (this.series_no === 'TRANSMISSION CONTROL NUMBER') {
                        series_no_type = !!i.transmission_control_no;
                    }
                    
                    return (
                        search &&
                        transaction_type &&
                        series_no_type
                    );
            });
        }
    },

    methods: {
        async getEclaimsMigratedRecords() {
            let response = await this.$services.getEclaimsMigratedList({
                provider_code: this.$store.state.prv_data.provider_code, 
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
            })
            if(response.status === 200) {
                const response_data = this.responseDataDecryption(response.data)
                if(response_data !== "Data not found.") {
                    this.migrated_records = response_data
                }
            } else {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        },

        async eClaimCfForms(val) {
            let response = await this.$services.getEclaimsMigratedRecords({
                claim_no: val.claim_no 
            })
            if(response.status === 200) {
                const response_data = this.responseDataDecryption(response.data)
                sessionStorage.setItem('MftrIDjk', this.$crypto.AES.encrypt(JSON.stringify(response_data), 'msjYdhl'))
                this.$router.push('/eclaims-migrated-cfforms/claim-info')
            } else {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        },

        clearFilter(){
            this.search_tbl = ''
        }
    }
}
</script>

