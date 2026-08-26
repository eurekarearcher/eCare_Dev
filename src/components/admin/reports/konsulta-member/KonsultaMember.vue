<template>
    <div>
        <h2 class="text-center grey--text text--darken-2 my-4">Yakap Members</h2>
        <v-row justify="space-between" dense>
            <v-col cols="12" sm="6" md="4" lg="3" xl="3">
                <v-text-field v-model="tbl_search" prepend-inner-icon="mdi-magnify" label="Search" maxlength="40" clearable outlined dense></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="5" md="6" lg="7" xl="7" >
                <v-row class="flex-wrap mb-4" dense>
                    <v-col cols="12" sm="4" md="4" lg="3" xl="3">
                        <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" :value="formatDate(start_date)" label="Start Date" hide-details outlined readonly dense></v-text-field>
                            </template>

                            <v-date-picker v-model="start_date" :max="max_start_date && end_date" no-title></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4" md="4" lg="3" xl="3" class="pl-sm-2">
                        <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" :value="formatDate(end_date)" label="End Date" hide-details outlined readonly dense></v-text-field>
                            </template>

                            <v-date-picker v-model="end_date" :max="max_start_date" :min="start_date" :disabled="!start_date" no-title></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4" md="4" lg="6" xl="6" class="pl-2">
                        <div class="d-flex">
                            <v-btn :disabled="loading_data" @click="getKonsultaMembers" class="white--text" color="primary" height="41">
                                <v-icon color="white" left>mdi-update</v-icon>
                                <span>LOAD SELECTED DATES</span>
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-col>

            <v-col class="d-flex justify-end mt-1 mb-2 " cols="12" sm="6" md="3" lg="2" xl="2">
                <label class="mt-2">EXPORT:</label>
                <v-btn @click="exportToExcel" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> Excel</v-btn>
            </v-col>
        </v-row>

        <v-data-table 
            :headers="tbl_headers" 
            :items="tbl_items" 
            :loading="tbl_loading" 
            :footer-props="{ 'items-per-page-options': [5, 10, 15, 50, 100] }" 
            :search="tbl_search" 
            :sort-desc.sync="sort_descending" 
            class="elevation-2 mt-n2" 
            mobile-breakpoint="0"
        >
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.patient_name }}</td>
                    <td>{{ item.phic_pin }}</td>
                    <td>{{ item.age }}</td>
                    <td>{{ item.birthdate }}</td>
                    <td>{{ item.gender }}</td>
                    <td>{{ item.mobile_number }}</td>
                    <td>{{ item.landline_number }}</td>
                    <td>{{ item.phic_assigned_date }}</td>
                    <td>{{ item.phic_assigned_type }}</td>
                    <td>{{ item.ecare_register == "1" ? "Registered in Ecare" : "Not registered in Ecare" }}</td>
                </tr>
            </template>
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
                // { text: 'DATE CREATED', value: 'date_created', width: '200px' },
                { text: 'PATIENT NAME', value: 'patient_name', width: '300px' },
                { text: 'MEMBER PIN', value: 'phic_pin', width: '200px' },
                { text: 'AGE', value: 'age', width: '100px'},
                { text: 'BIRTHDAY', value: 'birthdate', width: '150px', sortable: false },
                { text: 'GENDER', value: 'gender', width: '150px', sortable: false },
                { text: 'MOBILE NUMBER', value: 'mobile_number', width: '150px', sortable: false },
                { text: 'LANDLINE', value: 'landline_number', width: '200px', sortable: false },
                { text: 'ASSIGNED DATE', value: 'phic_assigned_date', width: '200px', sortable: false },
                { text: 'ASSIGNED TYPE', value: 'phic_assigned_type', width: '200px', sortable: false },
                { text: 'REGISTRATION', value: 'ecare_register', width: '200px', sortable: false },
            ],
            tbl_items: [],
            sort_descending: true,
            loading_data: false,
            all_konsulta_members: []
        }
    },

    created() {
        this.getKonsultaMembers()
    },

    methods: {
        // GET KONSULTA MEMBERS
        async getKonsultaMembers() {
            this.loading_data = true;
            this.tbl_loading = true; 
            let response = await this.$services.getKonsultaMembers({
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                start_date: this.start_date,
                end_date: this.end_date,
                member: 1
            })

            if(response.status === 200) {
                if(response.data){
                    let konsulta_members = this.responseDataDecryption(response.data);
                    konsulta_members.sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
                        konsulta_members.forEach((element) => {
                        element.patient_name =  `${element.mem_first_name} ${element.mem_middle_name} ${element.mem_last_name} ${element.mem_suffix || ''}`,
                        element.date_created = this.formatDateAndTime(element.date_created),
                        element.birthdate = this.formatDate(element.birthdate),
                        element.phic_assigned_date = this.formatDate(element.phic_assigned_date),
                        element.phic_assigned_type = element.phic_assigned_type === 'MM' ? 'Member' : 'Dependent'
                        element.age = this.calculateAge(element.birthdate)
                    });

                    this.all_konsulta_members = konsulta_members; 
                    this.tbl_items = konsulta_members
                   
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
            this.getKonsultaMembers()
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
                { ...style, column: 'FIRST NAME', value: value => value.mem_first_name, width: 30 },
                { ...style, column: 'MIDDLE NAME', value: value => value.mem_middle_name, width: 30 },
                { ...style, column: 'LAST NAME', value: value => `${value.mem_last_name} ${value.mem_suffix || ''}`, width: 30 },
                { ...style, width: 50, column: 'MEMBER PIN', value: value => value.phic_pin },
                { ...style, width: 20, column: 'AGE', value: value => String(value.age)},
                { ...style, width: 20, column: 'BIRTHDAY', value: value => value.birthdate },
                { ...style, width: 20, column: 'GENDER', value: value => value.gender },
                { ...style, width: 20, column: 'MOBILE NUMBER', value: value => value.mobile_number },
                { ...style, width: 30, column: 'LANDLINE', value: value => value.landline_number },
                { ...style, width: 30, column: 'ASSIGNED DATE', value: value => value.phic_assigned_date },
                { ...style, width: 30, column: 'ASSIGNED TYPE', value: value => value.phic_assigned_type },
                { ...style, width: 30, column: 'REGISTRATION', value: value => value.ecare_register === "1" ? 'Registered in Ecare' : 'Not registered in Ecare' },
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
                fileName: `${file_name_facility} - Yakap Members - ${date}.xlsx`
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