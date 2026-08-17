<template>
    <div>
        <h2 class="text-center grey--text text--darken-2 my-4">Audit Logs</h2>
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
                            <v-btn :disabled="loading_data" @click="getAuditTrailLogs" class="white--text" color="primary" height="41">
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
            :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" 
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
                { text: 'DATETIME', value: 'date_processed', width: '200px'},
                { text: 'PERFORMED BY', value: 'process_by', width: '200px' },
                { text: 'DEVICE USED', value: 'device_used', width: '100px', sortable: false },
                { text: 'ACTIVITY', value: 'action_made', width: '100px', sortable: false },
                { text: 'ACTIVITY DESCRIPTION', value: 'activity_description', width: '400px', sortable: false },
            ],
            tbl_items: [],
            sort_descending: true,
            loading_data: false,
            all_audit_logs: []
        }
    },

    created() {
        this.getAuditTrailLogs(false)
    },

    methods: {
        // GET AUDIT LOGS
        async getAuditTrailLogs(filter = true) {
            this.loading_data = true;
            this.tbl_loading = true; 
            let response = await this.$services.getAuditTrailLogs({
                provider_code: this.$store.state.prv_data.provider_code,
                start_date: this.start_date,
                end_date: this.end_date
            })

            if(response.status === 200) {
                if(response.data){
                    let logs = this.responseDataDecryption(response.data);
                    logs.sort((a, b) => new Date(b.date_processed) - new Date(a.date_processed))
                    logs.forEach((element) => {
                    element.date_processed = this.formatDateAndTime(element.date_processed)
                    if(element.action_made === 'UPDATE'){
                        if(element.system_module === 'Admin' || element.system_module === 'Registration'){
                            element.activity_description = this.combineString([
                               // element.system_module,
                               "Updated",   
                                element.affected_user,
                                element.column_affected.replace(/_/g, ' '),
                                " from",
                                element.old_data,
                                "to",
                                element.new_data])
                        }else if(element.action_made === 'UPDATE' && element.system_module === 'Admin/Pharmacist'){
                            element.activity_description = this.combineString([
                                //element.system_module,
                                element.remarks,
                                element.column_affected.replace(/_/g, ' '),
                                " from",
                                element.old_data,
                                "to",
                                element.new_data])
                        }
                    } else if(element.action_made === 'DEACTIVATE'){
                        element.activity_description = this.combineString([
                            //element.system_module,
                            "Deactivated user",
                            element.affected_user])
                    } else if(element.action_made === 'LOG IN'){
                        element.activity_description = this.combineString([
                            //element.system_module,
                            "Logged in user",
                            element.process_by])
                    } else{
                        element.activity_description = this.combineString([
                            //element.system_module,
                            element.remarks,
                            element.affected_user])
                    }
                });
                    this.all_audit_logs = logs; 
                    // Logs if filtered by date range
                    if (filter) {
                        let filter_start_date = new Date(this.start_date);
                        let filter_end_date = new Date(this.end_date);
                        // Ensure that endDate includes the whole day by setting the time to the end of the day
                        filter_end_date.setHours(23, 59, 59, 999);
    
                        this.tbl_items = logs.filter(item => {
                            let item_date = new Date(item.date_processed);
                            return item_date >= filter_start_date && item_date <= filter_end_date;
                        });
                    } else {
                        //Logs onload
                        this.tbl_items = logs
                    }
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
            this.getAuditTrailLogs(true)
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
                { ...style, width: 25, column: 'DATETIME', value: value => value.date_processed },
                { ...style, width: 30, column: 'PERFORMED BY', value: value => value.process_by },
                { ...style, width: 20, column: 'DEVICE USED', value: value => value.device_used },
                { ...style, width: 20, column: 'ACTIVITY', value: value => value.action_made },
                { ...style, width: 50, column: 'ACTIVITY DESCRIPTION', value: value => value.activity_description },
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

                fileName: `${file_name_facility} - Audit Logs - ${date}.xlsx`
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