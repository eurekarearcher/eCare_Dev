<template>
    <div>
        <h1 class="font-weight-medium grey--text text--darken-3 mb-3">Inventory</h1>
        
        <v-row dense align="start">
            <v-col cols="12" lg="12">
                <!-- <v-row dense align="center">
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
                        <v-btn block height="40" color="primary" class="white--text" @click="getInventoryList">
                            <v-icon left>mdi-update</v-icon>
                            Load Selected Dates
                        </v-btn>
                    </v-col>
                </v-row> -->

                <v-row dense align="center">
                    <v-col cols="12" md="6">
                        <v-text-field v-model="tbl_search" prepend-inner-icon="mdi-magnify" label="Search" hide-details outlined dense clearable/>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-row dense justify="end">
                            <v-col cols="6" md="5">
                                <v-select v-model="quantity_status" :items="['ALL', 'GREEN', 'YELLOW', 'RED']" :disabled="tbl_loading" @change="filterByQuantityStatus" label="Quantity Status" hide-details multiple small-chips outlined dense/>
                            </v-col>

                            <v-col cols="6" md="5" v-if="$store.state.usr_credentials.provider_reg_type !== 'BRGY'">
                                <v-autocomplete v-model="facility_filter" :items="prv_list" :loading="loading_prv_list" :disabled="tbl_loading || inventory_adjustment" @change="filterByFacility" label="Facility" hide-details multiple outlined dense>
                                    <template v-slot:selection="{ item }">
                                        <v-chip small class="my-1">{{ item }}</v-chip>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row dense class="mt-2">
                    <v-col cols="12" sm="6" md="auto">
                        <v-btn block color="primary" :disabled="tbl_loading || inventory_adjustment" @click="display_add_new_or_delivery = true,new_or_delivery = 'delivery'">
                            <v-icon left>mdi-folder-plus</v-icon>REPLENISHMENT OF MEDICINE
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="auto">
                        <v-btn block outlined color="primary" :disabled="tbl_loading || inventory_adjustment" @click="openInventoryAdjustment">
                            <v-icon left>mdi-file-edit</v-icon>Actual Inventory Adjustment
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>

            <!-- <v-col cols="12" lg="5">
                <v-text-field v-model="tbl_search" prepend-inner-icon="mdi-magnify" label="Search" hide-details outlined dense clearable />
            
                <v-row dense class="mt-2">
                    <v-col cols="12" md="6">
                        <v-select v-model="quantity_status" :items="['ALL', 'GREEN', 'YELLOW', 'RED']" :disabled="tbl_loading" @change="filterByQuantityStatus" label="Quantity Status" hide-details multiple small-chips outlined dense/>
                    </v-col>

                    <v-col cols="12" md="6" v-if="$store.state.usr_credentials.provider_reg_type !== 'BRGY'">
                        <v-autocomplete v-model="facility_filter" :items="prv_list" :loading="loading_prv_list"
                            :disabled="tbl_loading || inventory_adjustment" @change="filterByFacility"
                            label="Facility" hide-details multiple outlined dense
                        >
                            <template v-slot:selection="{ item }">
                                <v-chip small class="my-1">
                                    {{ item }}
                                </v-chip>
                            </template>
                        </v-autocomplete>
                    </v-col>
                </v-row>
            </v-col> -->
        </v-row>

        <v-divider class="mt-5"></v-divider>
        
        <v-row class="mt-4" justify="end" dense>
            <v-col cols="12" md="8" xl="8" class="d-flex justify-end align-center flex-wrap">
                <div class="d-flex align-center mr-6">
                    <div class="d-flex align-center mr-4">
                        <div class="box green"></div>
                        <span class="body-2 ml-2">Good</span>
                    </div>
                    <div class="d-flex align-center mr-4">
                        <div class="box yellow"></div>
                        <span class="body-2 ml-2">Fair</span>
                    </div>
                    <div class="d-flex align-center">
                        <div class="box red"></div>
                        <span class="body-2 ml-2">Critical</span>
                    </div>
                </div>
            
                <div class="d-flex align-center">
                    <span class="body-2 mr-2">EXPORT:</span>
                    <v-btn :disabled="tbl_loading" @click="exportToExcel" color="success">
                        <v-icon left>mdi-microsoft-excel</v-icon>EXCEL
                    </v-btn>
                </div>
            </v-col>
        </v-row>

        <v-data-table :headers="tbl_headers" :items="filtered_inventory_list" :loading="tbl_loading" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :search="tbl_search" class="elevation-2 mt-4" mobile-breakpoint="0" group-by="generic_name" >
            <template v-slot:group.header="{ group, headers, toggle, isOpen }">
                <td :colspan="headers.length"  :class="setQuantityColor(getGroupSummary(group).max_stock, getGroupSummary(group).total_quantity)">
                    <div class="d-flex justify-space-between align-center px-5">
                        <span class="font-weight-medium">{{ group }}</span>

                        <div class="d-flex align-center pr-3">
                            <span class="pr-10 text-body-4 font-weight-medium">
                                TOTAL QUANTITY: {{ getGroupSummary(group).total_quantity.toLocaleString() }}
                            </span>
                            <v-btn @click="toggle" small icon :ref="group">
                                <span class="ml-1 mr-1" v-if="isOpen">Hide</span>
                                <span class="ml-1 mr-1" v-else>Show</span>
                                <v-icon v-if="isOpen">mdi-plus</v-icon>
                                <v-icon v-else>mdi-minus</v-icon>
                            </v-btn>
                        </div>
                    </div>
                </td>
            </template>
            
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ formatDate(item.date_created) }}</td>
                    <td>{{ item.lot_no }}</td>
                    <td>{{ item.dosage ? item.dosage : '-' }}</td>
                    <td>{{ item.unit }}</td>
                    <td>{{ formatDate(item.expiration_date) }}</td>
                    <td>{{ Number(item.quantity || 0).toLocaleString() }}{{ item.unit === 'BOTTLE' ? ' bottles' : '' }} </td>
                    
                    <template v-if="inventory_adjustment">
                        <td>
                            <v-text-field v-model="item.new_actual_quantity" :error="required_field_adj && !item.new_actual_quantity && selected_id == item.id" class="body-2" hide-details dense></v-text-field>
                        </td>
                        <td>
                            <v-menu   v-model="item.remarks" :close-on-content-click="false" transition="scale-transition" nudge-width="600" offset-x left>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon @click="selected_id = item.id"><v-icon color="primary" large>mdi-plus-box</v-icon></v-btn>
                                </template>
                                
                                <v-card class="py-5 pr-5 pl-2">
                                    <v-row dense>
                                        <v-col class="text-right" cols="12" md="4" xl="4">
                                            <label class="body-2">Generic Name: </label>
                                        </v-col>

                                        <v-col cols="12" md="8" xl="8">
                                            <label class="font-weight-bold body-2">{{ item.generic_name }}</label>
                                        </v-col>
                                    </v-row>

                                    <v-row class="mt-2" dense>
                                        <v-col class="text-right" cols="12" md="4" xl="4">
                                            <label class="body-2">Current Quantity: </label>
                                        </v-col>

                                        <v-col cols="12" md="8" xl="8">
                                            <v-row dense>
                                                <v-col cols="12" md="3" xl="3">
                                                    <label class="font-weight-bold body-2">{{ item.quantity }}</label>
                                                </v-col>
                                                
                                                <v-col cols="12" md="9" xl="9">
                                                    <label class="body-2">Actual Quantity: <b>{{ item.new_actual_quantity }}</b></label>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>

                                    <v-row class="mt-2" dense>
                                        <v-col class="text-right" cols="12" md="4" xl="4">
                                            <label class="body-2">Reason for Adjustment: </label>
                                        </v-col>

                                        <v-col cols="12" md="8" xl="8">
                                            <v-textarea v-model="item.reason_for_adjustment" :error="required_field_adj && !item.reason_for_adjustment && selected_id == item.id" class="body-2" rows="4" hide-details outlined></v-textarea>
                                        </v-col>
                                    </v-row>

                                    <v-layout justify-end wrap mt-4>
                                        <v-btn @click="item.remarks = false" :disabled="adjustment_loading" class="mr-2" color="primary" outlined>CANCEL</v-btn>
                                        <v-btn @click="saveAdjustment(item)" :loading="adjustment_loading" color="primary">SAVE</v-btn>
                                    </v-layout>
                                </v-card>
                            </v-menu>
                        </td>
                    </template>
                </tr>
            </template>
        </v-data-table>

        <InventoryAdjustment v-if="inventory_adjustment" :adjustment_history_item="adjustment_history_item" :inventory_list="tbl_items" :selected_id="selected_id" :usr_credentials="usr_credentials"  @cancel="closeInventoryAdjustment" />

        <v-dialog v-if="display_add_new_or_delivery" v-model="display_add_new_or_delivery" width="1200" persistent>
            <v-card>
                <AddNewMedicine :prv_list="prv_list" :new_or_delivery="new_or_delivery" @cancel="display_add_new_or_delivery = false, new_or_delivery = ''" @updateMedicineList="updateMedicineList" @changeAddDeliveryMed="changeAddDeliveryMed"/>
            </v-card>
        </v-dialog>

        <Alert :alert="alert" />
    </div>
</template>

<script>
import Alert from "@/components/Alert.vue"
import AddNewMedicine from '@/components/admin/medicine-inventory/AddNewMedicine.vue'
import InventoryAdjustment from '@/components/admin/medicine-inventory/InventoryAdjustment.vue'
import { mapState } from 'vuex'

export default {
    components: {
        AddNewMedicine,
        InventoryAdjustment,
        Alert
    },

    data() {
        return {
            // FILTER
            quantity_status: ['ALL'],

            loading_prv_list: true,
            prv_list: [],
            facility_filter: ['ALL'],
            
            // TABLE
            tbl_loading: true,
            tbl_search: '',
            tbl_headers: [
                //{ text: 'FACILITY', value: 'facility', width: '300px', sortable: false },
                { text: 'DATE CREATED', value: 'date_created', width: '150px', sortable: false },
                { text: 'LOT NO', value: 'lot_no', width: '150px', sortable: false },
                { text: 'GENERIC NAME', value: 'generic_name', width: '300px', sortable: false },
                { text: 'DOSAGE', value: 'dosage', width: '150px', sortable: false },
                { text: 'UNIT', value: 'unit_type', width: '150px', sortable: false },
                { text: 'EXPIRATION DATE', value: 'expiration_date', width: '150px', sortable: false },
                //{ text: 'BOXES', value: 'boxes', width: '150px', sortable: false },
                //{ text: 'PIECES PER BOX', value: 'pieces_per_box', width: '150px', sortable: false },
                //{ text: 'UNIT COST', value: 'unit_cost', width: '150px', sortable: false },
               // { text: 'PRICE PER PIECE', value: 'price_per_piece', width: '150px', sortable: false },
                { text: 'QUANTITY', value: 'quantity', width: '150px', sortable: false },
            ],
            tbl_headers_adjustment: [
                { text: 'NEW ACTUAL QUANTITY', value: 'new_actual_quantity', width: '200px', sortable: false },
                { text: 'REMARKS', value: '', width: '10px', sortable: false }
            ],
            tbl_items: [],
    
            // ADD NEW MEDICINE
            display_add_new_or_delivery: false,
            new_or_delivery: '',

            // INVENTORY ADJUSTMENT
            inventory_adjustment: false,
            required_field_adj: false,
            selected_id: '',
            adjustment_history_item: {},
            adjustment_loading: false,
            alert: {},

            start_date: this.$moment().add(-7, 'days').format('YYYY-MM-DD'),
            end_date: this.$moment().format('YYYY-MM-DD')
        }
    },

    created() {
        // this.getInventoryList();
        
        if (this.usr_credentials.provider_reg_type !== 'BRGY') {
            this.getProviderListByFacility();
        }
    },

    mounted() {
        this.getInventoryList();
    },
    
    watch: {
        filtered_inventory_list() {}
    
    },
    computed: {
        ...mapState(['usr_credentials']),

        filtered_inventory_list() {
        const group_summary_map = {};

        this.tbl_items.forEach(item => {
            const key = item.generic_name;
            if (!group_summary_map[key]) {
                group_summary_map[key] = { total_quantity: 0, max_stock: item.max_stock_quantity };
            }
            group_summary_map[key].total_quantity += Number(item.quantity);
        });

        const result = this.tbl_items.filter(item => {
            const summary = group_summary_map[item.generic_name];
            const group_status = this.setQuantityColor(summary.max_stock, summary.total_quantity).toUpperCase();
            let search_filter = 
            (item.facility?.toLowerCase().includes(this.tbl_search.toLowerCase())) ||
            (item.generic_name?.toLowerCase().includes(this.tbl_search.toLowerCase())) ||
            (item.dosage?.toLowerCase().includes(this.tbl_search.toLowerCase())) ||
            (item.expiration_date?.toLowerCase().includes(this.tbl_search.toLowerCase())) ||
            (item.unit_cost?.toLowerCase().includes(this.tbl_search.toLowerCase())) ||
            (String(item.quantity).includes(this.tbl_search.toLowerCase())) ||
            (item.unit?.toLowerCase().includes(this.tbl_search.toLowerCase()));

            let search = this.tbl_search ? search_filter : true;
            let quantity = this.quantity_status.includes('ALL') ? true : this.quantity_status.includes(group_status);
            let facility = this.facility_filter.includes('ALL') ? true : this.facility_filter.includes(item.facility);

            return search && quantity && facility;
        });

        return result;
        },

        filter_facility() {
            if (this.usr_credentials.provider_reg_type === 'PHO' || this.usr_credentials.provider_reg_type === 'MHO' || this.usr_credentials.provider_reg_type === 'CHO' || (this.usr_credentials.provider_reg_type === 'PVT-P' && this.usr_credentials.department === 'Admin')) {
                return true
            } 

            return false
        }
    },

    methods: {
        async getInventoryList() {
            let response = await this.$services.getMedicineInventoryByProvider({
                key: this.usr_credentials.provider_reg_type,
                host_code: null,
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.usr_credentials.lgu_host_code,
                // start_date: this.start_date,
                // end_date: this.end_date
            });

            if (response.status === 200) {
                this.tbl_loading = false
                if (response.data === 'Data not found.') return 

                response.data = this.responseDataDecryption(response.data)

                let extract_result = [];
                Object.entries(response.data).forEach(([code, items]) => {
                items.forEach(item => {
                    extract_result.push({
                    ...item,
                    date_created: this.formatDate(item.date_created),
                    expiration_date: this.formatDate(item.expiration_date),
                    unit_cost: item.current_unit_cost,
                    quantity: item.current_quantity,
                    unit: item.unit_type === 'BOX' ? item.preparation : (item.unit_type ? item.unit_type : '-'),
                    medicine_code: code
                    });
                });
                });

                this.tbl_items = extract_result;

            } else {
                this.alert = response.error
            }
        },

        async getProviderListByFacility() {
            let response = await this.$services.getProviderListByFacility({
                key: this.usr_credentials.provider_reg_type,
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.usr_credentials.lgu_host_code,
                ...(this.usr_credentials.provider_reg_type === 'PHO' || this.usr_credentials.provider_reg_type === 'MHO' || this.usr_credentials.provider_reg_type === 'CHO' ? { request_key: 'ALL' } : undefined)
            });

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                        
                if (response.data.has_data) {
                    this.prv_list = response.data.provider_list.map(element => element.prv_name)
                }

                this.prv_list.unshift(this.$store.state.prv_data.provider_name)
                this.prv_list.unshift('ALL')
                this.loading_prv_list = false
            } else {
                this.alert = {display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
            }
        },

        async saveAdjustment(data) {
            this.required_field_adj = false;
            
            if (!data.new_actual_quantity || !data.reason_for_adjustment) {
                this.required_field_adj = true;
                return this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Field is empty/Invalid Value', body: 'Please fill out all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' };
            }
            
            this.adjustment_loading = true;
            let response = await this.$services.medUpdateMedicineQuantity({
                provider_code: this.$store.state.prv_data.provider_code,
                medicine_code: data.medicine_code,
                lot_no: data.lot_no,
                new_quantity: data.new_actual_quantity,
                reason_for_adjustment: 'MANUAL:' + data.reason_for_adjustment,
                update_by_operator: this.usr_credentials.user_name
            });

            if (response.status === 200) {
                 if (!response.data.success) {
                    return this.alert =  {display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
                
                this.adjustment_loading = false

                this.adjustment_history_item = {
                    date_of_adjustment: this.$moment().format('YYYY-MM-DD HH:mm:s'),
                    generic_name: data.generic_name,
                    lot_no: data.lot_no,
                    medicine_code: data.medicine_code,
                    new_quantity: data.new_actual_quantity,
                    previous_quantity: data.quantity,
                    reason: data.reason_for_adjustment,
                    unit_type: data.unit == 'BOX' ? data.preparation : data.unit
                }

                data.quantity = data.new_actual_quantity
                delete data.new_actual_quantity
                delete data.reason_for_adjustment
                
                this.updateMedicineList(data, 'adjustment')

                return this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: 'Adjustment Saved Succesfully', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
            } else {
                this.adjustment_loading = false;
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        },

        updateMedicineList(data,type){
            if (type == 'new_or_delivery_med') {
                this.display_add_new_or_delivery = false
                this.new_or_delivery = ''
            } else if (type == 'adjustment') {
                data.remarks = false
            }
            const is_data_available = this.tbl_items.filter(item => item.lot_no.includes(data.lot_no))

            if (is_data_available.length == 0 ) {
                data.id = this.tbl_items.length - 1
                this.tbl_items = [ {...data}, ...this.tbl_items]
            } else {
               is_data_available.map(items => {
                    items.quantity = data.quantity
                    items.unit_cost = data.unit_cost
                    //items.max_stock_quantity = data.max_stock_quantity
                    items.unit = data.unit
                    return items
               })
            }
        },

        filterByQuantityStatus() {
            if (this.quantity_status[this.quantity_status.length - 1] === 'ALL') {
                this.quantity_status = ['ALL']       
            } else {
                const index = this.quantity_status.indexOf('ALL')
                if (index === 0 ) this.quantity_status.splice(index, 1)
            }
        },

        filterByFacility() {
            if (this.facility_filter[this.facility_filter.length - 1] === 'ALL') {
                this.facility_filter = ['ALL']       
            } else {
                const index = this.facility_filter.indexOf('ALL')
                if (index === 0 ) this.facility_filter.splice(index, 1)
            }
        },

        exportToExcel() {
            const schema = [
                { column: 'Facility', value: value => value.facility, width: 40 },
                { column: 'Date Created', value: value => this.formatDate(value.date_created), width: 15},
                { column: 'Generic Name', value: value => value.generic_name, width: 50 },
                { column: 'Dosage', value: value => value.dosage, width: 15 },
                { column: 'Unit', value: value => value.unit, width: 15 },
                { column: 'Lot Number', value: value => value.lot_no, width: 15 },
                { column: 'Expiration Date', value: value => value.expiration_date, width: 15},
                //{ column: 'Boxes', value: value => value.boxes, width: 10 },
                //{ column: 'Pieces Per Box', value: value => value.pieces_per_boxes, width: 10 },
                //{ column: 'Unit Cost', value: value => value.unit_cost, width: 10 },
                { column: 'Total Quantity', value: value => {
                    const qty = Number(value.quantity || 0).toLocaleString();
                    return value.unit === 'BOTTLE' ? `${qty} bottles` : qty;
                }, width: 15 }
            ]

            const file_name_date = this.$moment().format('MM-DD-YYYY');
            const file_name_facility = this.$store.state.prv_data.provider_name;

            this.$excel_file(this.filtered_inventory_list, {
                schema,
                headerStyle: {
                    alignVertical: 'center',
                    borderColor: '#FFFFFF', 
                    fontWeight: 'bold',
                    backgroundColor: '#1565C0',
                    color:'#FFFFFF'
                },
                
                fileName: `${file_name_facility} - Inventory - ${file_name_date}.xlsx`
            })
        },

        openInventoryAdjustment() {
            this.inventory_adjustment = true
            this.tbl_headers.push(...this.tbl_headers_adjustment)
            this.tbl_search = ''
            this.facility_filter = [this.$store.state.prv_data.provider_name]
        },

        closeInventoryAdjustment() {
            this.facility_filter = ['ALL']
            this.inventory_adjustment = false
            this.tbl_headers.splice(6, 2)
        },

        changeAddDeliveryMed(value) {
            this.display_add_new_or_delivery = false
            this.new_or_delivery = value

            setTimeout(() => {
                this.display_add_new_or_delivery = true
            }, 100)
        },

        getGroupSummary(group) {
            const group_items = this.tbl_items.filter(item => item.generic_name === group);
            const total_quantity = group_items.reduce((sum, item) => sum + Number(item.quantity), 0);
            const max_stock = group_items[0]?.max_stock_quantity || 0; 
            return { total_quantity, max_stock };
        },

        setQuantityColor(max_stock_quantity, quantity) {
            let color = ''

            const replenish = 0.5 * max_stock_quantity
            const critical = 0.1 * max_stock_quantity

            if (quantity != null) {
                if (quantity <= critical || quantity === 0) {
                    color = 'red'
                } else if (quantity <= replenish) {
                    color = 'yellow'
                } else {
                    color = 'green'
                }
            }
            return color
        },
    }
}
</script>

<style scoped>
::v-deep .red {
    background: #EF9A9A !important;
    border-color: #EF9A9A !important;
 }
::v-deep .yellow {
    background: #FFF176 !important;
    border-color:#FFF176 !important
 }
::v-deep .green {
    background: #81C784 !important;
    border-color: #81C784 !important
 }
::v-deep .box {
    height: 15px;
    width: 15px;
    border-radius: 2px;
 }
</style>