<template>
    <div>
        <v-layout justify-end wrap my-6>
            <!-- <v-btn @click="cancel" class="mr-4" color="primary" outlined>CANCEL</v-btn> -->
            <v-btn @click="done" color="primary">DONE</v-btn>
        </v-layout>

        <v-card class="pa-6 mb-6" elevation="6">
            <v-row align="baseline" dense>
                <v-col cols="12" md="8" xl="8">
                    <h2 class="font-weight-medium grey--text text--darken-3">History of Adjustment</h2>
                </v-col>
                
                <v-col cols="12" md="4" xl="4">
                    <v-text-field v-model="tbl_search" prepend-inner-icon="mdi-magnify" label="Search" hide-details outlined dense></v-text-field>
                </v-col>

                <v-col class="text-right" cols="12" md="12" lg="12">
                    EXPORT: <v-btn :disabled="tbl_items.length === 0" @click="exportToExcel" color="success"><v-icon left>mdi-microsoft-excel</v-icon> Excel</v-btn>
                </v-col>
            </v-row>

            <v-data-table :headers="tbl_headers" :items="tbl_items" :loading="tbl_loading" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :search="tbl_search" class="elevation-2 mt-4" mobile-breakpoint="0">
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.generic_name }}</td>
                        <td>{{ item.lot_no }}</td>
                        <td>{{ item.reason }}</td>
                        <td>{{ item.previous_quantity }}</td>
                        <td>{{ item.new_quantity }}</td>
                        <td>{{ item.unit_type ? item.unit_type : 'N/A'}}</td>
                        <td>{{ formatDateAndTime(item.date_of_adjustment) }}</td>
                    </tr>
                </template>
            </v-data-table>

            <v-dialog v-model="generate_excel_loader" width="500" persistent>
                <v-card class="text-center py-12">
                    <v-progress-circular color="primary" width="6" size="80" indeterminate></v-progress-circular>
                    <h3 class="light-blue--text text--darken-4 pl-5 mt-5">Generating Excel...</h3>
                </v-card>
            </v-dialog>
            
        </v-card>

        <Alert :alert="alert" />

    </div>
</template>

<script>
import Alert from '@/components/Alert.vue'

export default {
    props:['adjustment_history_item', 'selected_id', 'inventory_list', 'usr_credentials'],
    components : {
        Alert
    },

    data() {
        return {
            // TABLE
            tbl_loading: true,
            tbl_search: '',
            tbl_headers: [
                { text: 'GENERIC NAME', value: 'generic_name', width: '300px', sortable: false },
                { text: 'LOT NO', value: 'lot_no', width: '100px', sortable: false },
                { text: 'REASON', value: 'reason', width: '160px', sortable: false },
                { text: 'PREVIOUS QUANTITY (PCS)', value: 'previous_quantity', width: '160px', sortable: false },
                { text: 'NEW QUANTITY (PCS)', value: 'new_quantity', width: '160px', sortable: false },
                { text: 'UNIT', value: 'unit', width: '160px', sortable: false },
                { text: 'ADJUSTMENT DATE', value: 'adjustment_date', width: '200px', sortable: true }
            ],
            tbl_items: [],

            alert: {},

            generate_excel_loader: false
        }
    },

    created() {
        this.getHistoryOfAdjustment();
    },

    watch: {
        adjustment_history_item() {
            this.tbl_items = [{...this.adjustment_history_item}, ...this.tbl_items]
        },
    },

    methods: {
        async getHistoryOfAdjustment() {
            let response = await this.$services.getMedicineAdjustmentHistory({
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.usr_credentials.lgu_host_code
            }) 

            if (response.status === 200) {
                this.tbl_loading = false
                if (response.data === 'Data not found.') return
                
                response.data = this.responseDataDecryption(response.data)
                this.tbl_items = response.data.map(items => {
                    if (items.unit_type === 'BOX') items.unit_type = items.preparation.toUpperCase()
                    return items
                })
            } else {
                this.alert = response.error
            }
        },

        done() {
            const get_data = this.inventory_list.filter(item => item.new_actual_quantity !== undefined || item.reason_for_adjustment !== undefined)
                .some(data => (data.new_actual_quantity && data.reason_for_adjustment) || 
                            (!data.new_actual_quantity && data.reason_for_adjustment) || 
                            (data.new_actual_quantity  && !data.reason_for_adjustment))
            if (!get_data)  return this.$emit('cancel')

            this.alert = { 
                display: true, 
                type: 'standard', 
                width: '650', 
                icon: 'mdi-alert-circle', 
                color: 'primary', 
                title: 'There are unsaved changes from your adjustments.', 
                body: 'Kindly save the data first before closing the actual adjustment form.', 
                btn_pry_txt: 'Close', 
                btn_pry_color: 'primary', 
                btn_pry_otl: false, 
                btn_pry_act: 'closeAlert',
            }

        },

        cancel() {
            this.$emit('cancel')
        },

        exportToExcel() {
            this.generate_excel_loader = true
            const data_style = {
                align: 'center',
                alignVertical: 'center',
                borderColor: '#000000',
                wrap: true
            }

            let schema = [
                { ...data_style, column: 'GENERIC NAME', value: value => value.generic_name, width: 30,},
                { ...data_style, column: 'LOT NO', value: value => value.lot_no, width: 15},
                { ...data_style, column: 'REASON', value: value => value.reason, width: 30},
                { ...data_style, column: 'PREVIOUS QUANTITY (PCS)', value: value => value.previous_quantity, width: 15},
                { ...data_style, column: 'NEW QUANTITY (PCS)', value: value => value.new_quantity, width: 15},
                { ...data_style, column: 'UNIT', value: value => value.unit_type ? value.unit_type : 'N/A', width: 15},
                { ...data_style, column: 'ADJUSTMENT DATE', value: value => value.date_of_adjustment, width: 30},
            ]

            const file_name_date = this.$moment().format('MM-DD-YYYY');
            const file_name_facility = this.$store.state.prv_data.provider_name;

            this.$excel_file(this.tbl_items, {
                schema,
                headerStyle: {
                    alignVertical: 'center',
                    borderColor: '#FFFFFF', 
                    fontWeight: 'bold',
                    backgroundColor: '#1565C0',
                    color:'#FFFFFF',
                    align: 'center',
                    wrap: true
                },
                fileName: `${file_name_facility} - Medicine History of Adjustment - ${file_name_date}.xlsx`
            })

            setTimeout(() => this.generate_excel_loader = false , 1000)
        }
    }
}
</script>