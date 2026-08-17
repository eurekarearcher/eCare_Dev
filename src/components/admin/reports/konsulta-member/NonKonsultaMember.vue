<template>
    <div>
        <h2 class="text-center grey--text text--darken-2 my-4">Non-Yakap Members</h2>
        
        <v-row dense align="start" class="mt-4">
            <v-col cols="12" lg="7">
                <v-row dense align="center">
                    <v-col cols="12" sm="6" md="3">
                        <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" :value="formatDate(start_date)" label="Start Date" hide-details outlined readonly dense></v-text-field>
                            </template>

                            <v-date-picker v-model="start_date" :max="max_start_date && end_date" no-title></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" :value="formatDate(end_date)" label="End Date" hide-details outlined readonly dense></v-text-field>
                            </template>

                            <v-date-picker v-model="end_date" :max="max_start_date" :min="start_date" :disabled="!start_date" no-title></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="12" md="3">
                        <v-btn :disabled="loading_data" @click="getNonKonsultaMembers" class="white--text" color="primary" height="41">
                            <v-icon color="white" left>mdi-update</v-icon>
                            <span>LOAD SELECTED DATES</span>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="12" lg="5">
                <v-text-field v-model="tbl_search" prepend-inner-icon="mdi-magnify" label="Search" maxlength="40" clearable outlined dense></v-text-field>
            </v-col>
        </v-row>

        <v-divider class="my-4"/>
        
        <v-row class="my-4" justify="end" dense>
            <v-col cols="12" md="8" xl="8" class="d-flex justify-end align-center flex-wrap">
                <div class="d-flex align-center mr-2">
                    <!-- <v-select v-model="non_yakap_member_type" :items="non_yakap_member_options" item-text="label" item-value="value" label="Filter by PHIC PIN" dense hide-details style="max-width: 200px;"/> -->
                    <v-select v-model="non_yakap_member_type" :items="non_yakap_member_options" item-text="label" item-value="value" label="Filter by:" dense hide-details style="max-width: 200px;"/>
                </div>

                <v-divider vertical class="mx-2"></v-divider>

                <div class="d-flex align-center">
                    <label class="mt-2">EXPORT:</label>
                    <v-btn @click="exportToExcel" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> Excel</v-btn>
                </div>
            </v-col>
        </v-row>

        <v-data-table 
            :headers="tbl_headers" 
            :items="filtered_tbl_items" 
            :loading="tbl_loading" 
            :footer-props="{ 'items-per-page-options': [5, 10, 15, 50, 100] }" 
            :search="tbl_search" 
            :sort-desc.sync="sort_descending" 
            class="elevation-2 mt-n2" 
            mobile-breakpoint="0"
        >
        </v-data-table>
    </div>
</template>

<script>
export default {
    data(){
        return{
            start_date: this.$moment(this.$moment().subtract(1, 'months')).format('YYYY-MM-DD'),
            end_date: this.$moment().format('YYYY-MM-DD'),
            max_start_date: this.$moment().format('YYYY-MM-DD'),

            // TABLE
            tbl_loading: true,
            tbl_search: '',
            tbl_headers: [
                { text: 'DATE CREATED', value: 'date_created', width: '200px' },
                { text: 'PATIENT NAME', value: 'patient_name', width: '300px' },
                { text: 'PHIC PIN', value: 'phic_pin', width: '300px' },
                { text: 'AGE', value: 'age', width: '100px'},
                { text: 'BIRTHDAY', value: 'birthdate', width: '150px', sortable: false },
                { text: 'GENDER', value: 'gender', width: '150px', sortable: false },
                { text: 'CONTACT NUMBER', value: 'mobile_number', width: '150px', sortable: false },
                { text: 'EMAIL', value: 'email', width: '200px', sortable: false }
            ],
            tbl_items: [],
            sort_descending: true,
            loading_data: false,
            all_non_konsulta_members: [],

            // non_yakap_member_options: [ 
            //     { label: "With PIN", value: 1 },
            //     { label: "Without PIN", value: 0 }
            // ],
            // non_yakap_member_type: 1
            non_yakap_member_options: [ 
                { label: "With PIN", value: 2 },
                { label: "Without PIN", value: 1 },
                { label: "All", value: 0 }
            ],
            non_yakap_member_type: 0
        }
    },

    created() {
        this.getNonKonsultaMembers()
    },

    computed: {
        // filtered_tbl_items() {
        //     return this.tbl_items.filter(item => {
        //        if(this.non_yakap_member_type === 1) {
        //             return item.phic_pin
        //        } else { 
        //             return !item.phic_pin
        //        } 
        //     })
        // }
        filtered_tbl_items() {
            return this.tbl_items.filter(item => {
               if(this.non_yakap_member_type === 2) {
                    return item.phic_pin
               } else if(this.non_yakap_member_type === 1) {
                    return !item.phic_pin
               } else {
                    return true
               }
            })
        }
    },

    methods: {
        // GET NON KONSULTA MEMBERS
        async getNonKonsultaMembers() {
            
            this.loading_data = true;
            this.tbl_loading = true; 
            let response = await this.$services.getKonsultaMembers({
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                start_date: this.start_date,
                end_date: this.end_date,
                member: 0
            })

            if(response.status === 200) {
                if(response.data){
                    let non_konsulta_members = this.responseDataDecryption(response.data);
                    non_konsulta_members.sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
                    non_konsulta_members.forEach((element) => {
                    element.patient_name =  `${element.mem_first_name} ${element.mem_middle_name} ${element.mem_last_name} ${element.mem_suffix || ''}`,
                    element.date_created = this.formatDateAndTime(element.date_created)
                    element.birthdate = this.formatDate(element.birthdate)
                    element.age = this.calculateAge(element.birthdate)
                    element.phic_assigned_type = element.phic_assigned_type === 'MM' ? 'Member' : 'Dependent'
                    });

                    this.all_non_konsulta_members = non_konsulta_members; 
                    this.tbl_items = non_konsulta_members
                    
                }else{
                    this.tbl_items = []
                }
                this.tbl_loading = false
                this.loading_data = false
            } else {
                this.alert = response.error
            }
        },

        // Button click handler to load selected date range
        loadSelectedDates() {
            this.getNonKonsultaMembers()
        },

        // EXPORT TO EXCEL
        exportToExcel(){
            let date = this.$moment().format('MM-DD-YYYY')
            let style = {
                align: 'center',
                alignVertical: 'center',
                borderColor: '#000000',
                type: String,
                wrap: true
            }
            let schema = [
                { ...style, width: 25, column: 'DATE CREATED', value: value => value.date_created },
                { ...style, column: 'FIRST NAME', value: value => value.mem_first_name, width: 30 },
                { ...style, column: 'MIDDLE NAME', value: value => value.mem_middle_name, width: 30 },
                { ...style, column: 'LAST NAME', value: value => `${value.mem_last_name} ${value.mem_suffix || ''}`, width: 30 },
                { ...style, width: 50, column: 'PHIC PIN', value: value => value.phic_pin },
                { ...style, width: 20, column: 'AGE', value: value => String(value.age) },
                { ...style, width: 20, column: 'BIRTHDAY', value: value => value.birthdate },
                { ...style, width: 20, column: 'GENDER', value: value => value.gender },
                { ...style, width: 20, column: 'CONTACT NUMBER', value: value => value.mobile_number },
                { ...style, width: 30, column: 'EMAIL', value: value => value.email },
            ]
            
            const file_name_facility = this.$store.state.prv_data.provider_name;

            this.$excel_file(this.tbl_items, {
                schema,
                headerStyle: {
                    borderColor: '#FFFFFF', 
                    fontWeight: 'bold',
                    backgroundColor: '#1565C0',
                    color:'#FFFFFF'
                },
                
                fileName: `${file_name_facility} - Non Yakap Members - ${date}.xlsx`
            })
        }
    }
}
</script>

<style scoped>
  .centered-tooltip {
    text-align: center; /* Center-align the tooltip content */
  }
</style>