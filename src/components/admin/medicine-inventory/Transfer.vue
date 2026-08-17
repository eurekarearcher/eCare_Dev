<template>
    <div id="not-for-print">
        <h1 class="d-print-none font-weight-medium grey--text text--darken-3 mb-3">Transferring of Medicine</h1>

        <template v-if="transfer_medicine">
            <v-row dense>
                <v-col cols="12" sm="10" class="d-print-none mt-10 mx-auto" >
                    <v-col cols="12" class="px-1 pt-0"><label>Reference No. <b style="color:#367c9d">{{ generated_reference_number }}</b></label></v-col>

                    <v-form ref="form" class="justify-center">
                        <v-row dense>
                            <v-col cols="6" lg="6" class="px-2 pt-0 align-self-center"><label>Transfer From: <b>{{ $store.state.prv_data.provider_name }}</b></label></v-col>
                            
                            <v-col cols="6" lg="6" class="ml-auto px-2 pt-0 d-flex">
                                <label class="align-self-center pr-3">Transfer To: </label>
                                <v-autocomplete v-model="transfer_to" :items="prv_list" :loading="loading_prv_list" :rules="required"  item-text="prv_name"  placeholder="Select Facility" return-object clearable hide-details dense></v-autocomplete>
                            </v-col>
                        </v-row>
                        
                        <v-row dense>
                            <v-col cols="12" lg="12" class="mt-5 mb-6"> 
                                <v-row v-for="(value, index) in medicine_transfer" :key="index+'a'" class="mb-5" dense>
                                    <v-card class="col-12">
                                        <v-row dense class="py-2">
                                            <v-col align-self="center" cols="12" md="1" lg="1">
                                                <h6 class="text-center blue--text text--darken-1 display-1 px-6" >{{ index + 1 }}</h6>
                                            </v-col>

                                            <v-col cols="12" md="10" lg="10">
                                                <v-row dense>
                                                     <v-col cols="12">
                                                        <label class="body-2 align-self-center pr-1">Generic Name</label>
                                                       
                                                        <v-autocomplete :items="medicine_list"  :loading="loading_medicine_list" @change="populateLotNo($event, index)"  :rules="required" class="body-2 pr-5" item-text="generic_name" item-value="medicine_code" prepend-inner-icon="mdi-magnify" placeholder="Search for Generic Name" return-object hide-details outlined dense clearable></v-autocomplete>
                                                    </v-col>
                                                     <v-col cols="12">
                                                        <label class="body-2 align-self-center pr-1">Lot Number</label>
                                                        
                                                        <v-autocomplete v-model="medicine_transfer[index].lot_no" :items="filteredLotNoList(index)" :loading="loading_lot_no" @change="getMedicineData($event, index)"  :rules="required" :disabled="!value.generic_name" class="body-2 pr-5" item-text="lot_no" item-value="lot_no" prepend-inner-icon="mdi-magnify" placeholder="Search for Lot No" return-object hide-details outlined dense clearable></v-autocomplete>
                                                    </v-col>
                                                    <v-col cols="6"  sm="6" md="4" lg="4">
                                                        <label class="body-2">Available Stocks (pcs): <b>{{value.quantity}}</b></label>
                                                    </v-col>
                                                    
                                                    <v-col cols="6" sm="6" md="4" lg="4">
                                                        <label class="body-2">Unit: <b>{{value.unit ? value.unit : 'N/A'}}</b></label>
                                                    </v-col>

                                                    <v-col cols="6" sm="6" md="4" lg="4">
                                                        <label class="body-2">Unit Cost: <b>{{value.unit_cost}}</b></label>
                                                    </v-col>

                                                    <v-col cols="6" sm="6" md="4" lg="4">
                                                        <label class="body-2">Expiration Date: <b>{{value.expiration_date}}</b></label>
                                                    </v-col>

                                                    <v-col cols="6" sm="6" md="4" lg="4" >
                                                        <label class="body-2">Weighted Avg. Cost: <b>{{value.weighted_avg_cost}}</b></label>
                                                    </v-col>
                                                </v-row>
                                                <v-row  class="pt-2 pb-2">
                                                    <v-col cols="12" sm="6" md="4" lg="4" >
                                                        <v-text-field v-model="value.boxes" label="Number of Boxes Received *" :rules="required_transfer"
                                                        :disabled="!value.generic_name || !value.lot_no" @input="updateInitialQty(value)" @keypress="numberOnlyWithDeci($event, value.boxes)" dense hide-details ></v-text-field>
                                                    </v-col>

                                                    <v-col cols="12" sm="6" md="4" lg="4" >
                                                        <v-text-field v-model="value.pieces_per_boxes" label="Number of Medicine per Box *"  :rules="required_transfer"  :disabled="!value.generic_name || !value.lot_no" @input="updateInitialQty(value)" @keypress="numberOnlyWithDeci($event, value.pieces_per_boxes)" dense hide-details ></v-text-field>
                                                    </v-col>

                                                    <v-col cols="12" sm="6" md="4" lg="4" >
                                                        <v-text-field v-model="value.qty_to_transfer" v-on:keypress="numberOnly" label="Quantity to Transfer (pcs) *" 
                                                        @keypress="numberOnly($event, value.qty_to_transfer)"  :rules="required_transfer" :error="Number(value.qty_to_transfer) > Number(value.quantity)" :disabled="!value.generic_name || !value.lot_no" class="body-2 pr-5 pl-1"  hide-details dense>
                                                            <template v-slot:append> 
                                                                <v-tooltip bottom v-if="Number(value.qty_to_transfer) > Number(value.quantity)">
                                                                    <template #activator="{ on }"> <v-icon  v-on="on" left color="red darken-1">fas fa-exclamation-circle</v-icon></template>
                                                                    Quantity to be transferred is greater than current quantity
                                                                </v-tooltip>
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>

                                                    <v-col cols="12" sm="6" md="4" lg="4">
                                                        <div class="d-flex justify-content-start align-baseline">
                                                            <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                                                                <template v-slot:activator="{ on }">
                                                                    <v-text-field v-on="on" v-model="value.transferred_date" :rules="required_transfer" :disabled="!value.generic_name || !value.lot_no" label="Date Transferred *" dense hide-details readonly ></v-text-field>
                                                                </template>
                                                                <v-date-picker  v-model="value.transferred_date_picker" :disabled="!value.generic_name || !value.lot_no" @change="value.transferred_date = formatDate(value.transferred_date_picker)"></v-date-picker>
                                                            </v-menu>
                                                            <span class="mx-2"> / </span>
                                                            <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                                                                <template v-slot:activator="{ on }">
                                                                    <v-text-field v-on="on" v-bind="on" :value="formatTime(value.transferred_time)" :rules="required_transfer" :disabled="!value.generic_name || !value.lot_no" label="Time Transferred*" dense hide-details readonly ></v-text-field>
                                                                </template>
                                                                <v-time-picker v-model="value.transferred_time" format="ampm"></v-time-picker>
                                                            </v-menu>
                                                        </div>
                                                    </v-col>
                                                </v-row>
                                            </v-col>

                                            <v-col cols="12" md="1" lg="1" align-self="center">
                                                <v-btn v-if="index !== 0" @click="removeMedicineTransfer(index)" icon>
                                                    <v-icon color="" size="45">mdi-minus-box</v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-row>

                                <v-row justify="center" class="flex-wrap my-3" dense>
                                    <v-col cols="12" class="d-flex justify-end">
                                        <v-btn @click="addMedicineTransfer" class="white--text mb-5" color="#367c9d" small><v-icon left>mdi-pill</v-icon> Add Medicine Field</v-btn>
                                    </v-col>

                                    <v-btn @click="cancel"  class="mr-4" color="#367c9d" outlined>CANCEL</v-btn>
                                    <v-btn @click="transferConfirmation" :disabled="isTransferDisabled" class="white--text" color="#367c9d">TRANSFER</v-btn>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-divider class="mb-5"></v-divider>
                    </v-form>
                </v-col>
            </v-row>
        </template>

        <v-row class="d-print-none" dense>
            <v-col cols="12">
                <v-btn :disabled="transfer_medicine || tbl_loading" @click="openTransferMedicine" class="mr-4" color="primary"><v-icon left>mdi-transfer</v-icon> Transfer Medicine</v-btn>
                <v-btn :disabled="transfer_medicine || tbl_loading" @click="display_selection_referrence = true" outlined color="primary"><v-icon left>mdi-printer</v-icon> PRINT DELIVERY RECEIPT</v-btn>
            </v-col>

            <v-col cols="12" class="my-5">
                <v-divider></v-divider>
            </v-col>

            <v-col cols="12" md="6" xl="6">
                <h2 class="d-print-none font-weight-medium grey--text text--darken-3">Transfer History</h2>
            </v-col>

            <v-col class="text-right align-self-end" cols="12" md="6" xl="6">
                <label>EXPORT:</label>
                <v-btn :disabled="tbl_loading" @click="exportToExcel" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> EXCEL</v-btn>
            </v-col>
        </v-row>

        <v-data-table :headers="tbl_headers" :items="tbl_items" :loading="tbl_loading" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :search="tbl_search" class="d-print-none elevation-2 mt-4" mobile-breakpoint="0">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ formatDateAndTime(item.date_transferred) }}</td>
                    <td>{{ item.transferred_to }}</td>
                    <td>{{ item.reference_number }}</td>
                    <td>{{ item.generic_name }}</td>
                    <td>{{ item.unit_type ? item.unit_type : 'N/A' }}</td>
                    <td>{{ item.lot_no }}</td>
                    <td>{{ item.boxes }}</td>
                    <td>{{ item.pieces_per_boxes }}</td>
                    <td>{{ item.transferred_quantity }}</td>
                    <td>{{ item.received_quantity }}</td>
                    <td :class="{'red--text' : item.item_status === 'INCOMPLETE'}" class="text-uppercase">{{ item.item_status }}</td>
                    <td>{{ formatDateAndTime(item.date_received) }}</td>
                    <td>{{ item.received_by }}</td>
                </tr>
            </template>
        </v-data-table>

        <v-dialog v-model="display_selection_referrence" width="600" persistent>
            <v-card v-model="display_selection_referrence"  class="pa-3 d-print-none" elevation="0">
                <v-card-title>Delivery Receipt</v-card-title>
                
                <v-card-subtitle class="pb-1">Choose a receipt to print using reference number.</v-card-subtitle>

                <v-col cols="12" class="px-5">
                    <v-autocomplete v-model="selected_reference" :items="tbl_items" item-text="reference_number" item-value="reference_number" placeholder="Reference Number" hide-details outlined clearable></v-autocomplete>
                </v-col>
                
                <v-card-actions class="mt-1 mb-1 justify-center">
                    <v-btn @click="printDeliveryReceipt" :disabled="!selected_reference" color="primary" class="px-5"><v-icon left>mdi-printer</v-icon> Print Receipt</v-btn>
                    <v-btn @click="display_selection_referrence = false, selected_reference = ''" color="primary" class="px-10" outlined>Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-if="show_confirmation" v-model="show_confirmation" width="1000px" persistent>
            <v-card class="pa-0">
                <v-card-title class="justify-center primary white--text">Transfering of Medicine Confirmation</v-card-title>
                <div class="px-10 py-5">
                    <h4 class="font-weight-regular mb-3">Reference Number:  <b style="color:#367c9d">{{this.generated_reference_number}}</b></h4>
                    <v-layout wrap justify-space-between>
                        <h4 class="font-weight-regular">Transfer From: <span class="font-weight-medium grey--text text--darken-3">{{this.$store.state.prv_data.provider_name}}</span></h4>
                        <h4 class="font-weight-regular">Transfer To:  <span class="font-weight-medium grey--text text--darken-3">{{this.transfer_to.prv_name}}</span></h4>
                    </v-layout>
                        <h3 class="font-weight-medium text-center mt-6 mb-3 grey--text text--darken-3"><v-icon left>mdi-pill</v-icon>List of Medicine</h3>

                        <v-card v-for="(med, index) in medicine_transfer" :key="index" class="mb-2">
                            <div class="px-5 py-3">
                                <h4 class="font-weight-medium">Generic Name: {{med.generic_name}}</h4>
                                <h4 class="font-weight-medium">Lot Number: {{med.lot_no}}</h4>
                                <v-divider class="my-2"></v-divider>
                                <v-row class="flex-wrap" dense>
                                    <v-col cols="12" sm="4" class="body-2">Available Stocks (pcs): <span class="font-weight-medium">{{med.quantity}}</span></v-col>
                                    <v-col cols="12" sm="4" class="body-2">Unit type: <span class="font-weight-medium">{{med.unit === 'BOX' ? med.preparation : med.unit || 'N/A'}}</span></v-col>
                                    <v-col cols="12" sm="4" class="body-2 ">Unit Cost: <span class="font-weight-medium">{{med.unit_cost}}</span></v-col>
                                    <v-col cols="12" sm="4" class="body-2 ">Weighted Avg. Cost: <span class="font-weight-medium">{{med.weighted_avg_cost}}</span></v-col>
                                    <v-col cols="12" sm="4" class="body-2 ">Expiration Date: <span class="font-weight-medium">{{med.expiration_date}}</span></v-col>
                                    <v-col cols="12" sm="4" class="body-2"></v-col>
                                    <v-col cols="12" sm="4" class="body-2">Boxes: <span class="font-weight-medium">{{med.boxes}}</span></v-col>
                                    <v-col cols="12" sm="4" class="body-2">Pieces per Boxes: <span class="font-weight-medium">{{med.pieces_per_boxes}}</span></v-col>
                                    <v-col cols="12" sm="4" class="body-2">Quantity to Transfer (pcs): <span class="font-weight-medium">{{med.qty_to_transfer}}</span></v-col>
                                    <v-col cols="12" class="body-2">Date & Time Transferred: <span class="font-weight-medium">{{med.transferred_date}} / {{formatTime(med.transferred_time)}}</span></v-col>
                                </v-row>
                            </div>
                        </v-card>
                </div>
                <v-divider class="my-3"></v-divider>
                <v-card-actions class="justify-center" px-10>
                    <v-btn @click="show_confirmation = false" :disabled="submit_medicine_loader" class="mb-3 py-5 px-7" color="primary" outlined>Cancel</v-btn>
                    <v-btn @click="save" :loading="submit_medicine_loader" class="mb-3" color="primary pa-5"><v-icon left>mdi-transfer</v-icon>Transfer Medicine</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-row v-if="transaction_for_print.length > 0" id="for-print">
            <v-col cols="12">
                <h2 class="text-center mb-5">DELIVERY RECEIPT</h2>
                <h3 class="font-weight-regular text-left mb-4">Reference Number: <b class="font-weight-medium">{{transaction_for_print[0].reference_number}}</b></h3>
                
                <v-row dense>
                    <v-col cols="7" class="align-end d-flex">
                        <label class="font-weight-medium text-no-wrap body-1 pr-2">From: </label>
                        <span class="input--border">{{ transaction_for_print[0].transferred_from }}</span>
                    </v-col>
                    
                    <v-col cols="5" class="align-end d-flex">
                        <label class="font-weight-medium text-no-wrap body-1 pr-2">Date Transferred: </label>
                        <span class="input--border">{{ $moment(transaction_for_print[0].date_transferred).format('MMMM DD, YYYY')}}</span>
                    </v-col>
                </v-row>

                <v-row class="mt-2" dense>
                    <v-col cols="7" class="align-end d-flex">
                        <label class="font-weight-medium text-no-wrap body-1 pr-2">Received By: </label>
                        <span class="input--border">{{ transaction_for_print[0].received_by ? transaction_for_print[0].received_by : '' }}</span>
                    </v-col>

                    <v-col cols="5" class="align-end d-flex">
                        <label class="font-weight-medium text-no-wrap body-1 pr-2">Date Received: </label>
                        <span class="input--border">{{ transaction_for_print[0].date_received ? $moment(transaction_for_print[0].date_received).format('MMMM DD, YYYY') : '' }}</span>
                    </v-col>
                </v-row>

                <table class="body-2 mt-5" border="collapse" cellspacing="0">
                    <tr>
                        <th style="width: 200px;">Generic Name</th>
                        <th style="width: 200px;">Lot Number</th>
                        <th style="width: 100px;">Boxes</th>
                        <th style="width: 100px;">Pieces per Boxes</th>
                        <th style="width: 200px;">Transfered Quantity (pcs)</th>
                        <th style="width: 100px;">Unit</th>
                        <th style="width: 150px;">Status</th>
                    </tr>

                    <tr v-for="(value, index) in transaction_for_print" :key="index">
                        <td style="width: 200px;">{{ value.generic_name }}</td>
                        <td style="width: 200px;">{{ value.lot_no }}</td>
                        <td style="width: 100px;">{{ value.boxes }}</td>
                        <td style="width: 100px;">{{ value.pieces_per_boxes }}</td>
                        <td style="width: 200px;">{{ value.transferred_quantity }}</td>
                        <td style="width: 100px;">{{ value.unit_type }}</td>
                        <td :class="{'red--text' : value.item_status === 'INCOMPLETE'}" class="text-uppercase" style="width: 150px;">{{ value.item_status }}</td>
                    </tr>
                </table>
            </v-col>
        </v-row>

        <Alert :alert="alert" class="d-print-none" />
    </div>
</template>

<script>
import Alert from "@/components/Alert.vue"

export default {
    components: {Alert},
    data() {
        return {
            // TABLE
            tbl_loading: true,
            tbl_search: '',
            tbl_headers: [
                { text: 'DATE TRANSFERRED', value: 'date', width: '100px', sortable: false },
                //{ text: 'TRANSFERRED FROM', value: 'transferred_from', width: '200px', sortable: false },
                { text: 'TRANSFERRED TO', value: 'transferred_to', width: '200px', sortable: false },
                { text: 'REFERENCE NO.', value: 'reference_no', width: '200px', sortable: false },
                { text: 'GENERIC NAME', value: 'generic_name', width: '200px', sortable: false },
                { text: 'UNIT', value: 'unit', width: '140px', sortable: false },
                { text: 'LOT NUMBER', value: 'lot_no', width: '100px', sortable: false },
                { text: 'BOXES', value: 'boxes', width: '100px', sortable: false },
                { text: 'PIECES PER BOXES', value: 'pieces_per_boxes', width: '100px', sortable: false },
                { text: 'TRANSFERRED QTY. (PCS)', value: 'transferred_qty', width: '100px', sortable: false },
                { text: 'QTY. RECEIVED (PCS)', value: 'received_quantity', width: '100px', sortable: false },
                { text: 'STATUS', value: 'status', width: '100px', sortable: false },
                { text: 'DATE RECEIVED', value: 'date', width: '150px', sortable: false },
                { text: 'RECEIVED BY', value: 'received_by', width: '100px', sortable: false },
            ],
            tbl_items: [],

            transfer_medicine: false,
            generated_reference_number: '',

            loading_prv_list: true,
            prv_list: [],
            transfer_to: '',

            reference_list: [],
            loading_medicine_list: true,
            medicine_list: [],
            selected_medicine: [],

            medicine_transfer: [
                {generic_name: '', medicine_code: '',quantity: undefined, pieces_per_boxes: undefined, boxes: undefined, qty_to_transfer: undefined, unit: '', unit_cost: '', weighted_avg_cost: '', preparation: '', lot_no:'', expiration_date: '', transferred_date:undefined, transferred_time:"", transferred_picker:""}
            ],

            // PRINT:""
            display_selection_referrence: false,
            selected_reference: '',
            transaction_for_print: [],

            // CONFIRMATION DIALOG
            show_confirmation: false,
            submit_medicine_loader: false,


            required: [
                v => (!!v && !/^ *$/.test(v)) || 'This field is required',
            ],

                required_transfer: [
                v => (!!v && !/^ *$/.test(v)) || 'This field is required',
                v => (v && v !== '0') || 'Please select a valid option',
            ],


            alert: {},
            loading_lot_no: false,
            lot_no_list: []
        }
    },

    created() {
        this.getTransferHistory();
    },

    computed: {
        isTransferDisabled() {
            return this.medicine_transfer.some(item => !item.generic_name || !item.lot_no || !item.qty_to_transfer || !item.transferred_date || !item.transferred_time || Number(item.qty_to_transfer) <= 0 ) || !this.transfer_to.prv_name;
        },

        formatted_time(value) {
            if (!value) return ''

            const [hour, minute] = value.split(':')
            let h = parseInt(hour)
            const ampm = h >= 12 ? 'PM' : 'AM'

            h = h % 12 || 12

            return `${h}:${minute} ${ampm}`
        }
    },

    methods: {
        formatTime(val) {
            if (!val) return ""

            const [hour, minute] = val.split(':')
            let h = parseInt(hour)
            const ampm = h >= 12 ? 'PM' : 'AM'

            h = h % 12 || 12

            return `${h}:${minute} ${ampm}`
        },

        async getTransferHistory() {
            let response = await this.$services.getMedicineTransferredHistory({
                provider_code: this.$store.state.prv_data.provider_code
            })

            if(response.status === 200) {
                this.tbl_loading = false
                let response_data = this.responseDataDecryption(response.data)
                if (response_data === 'Data not found.') return

                this.tbl_items = response_data.map(items => {
                    if (items.unit_type === 'BOX') items.unit_type = items.preparation.toUpperCase()
                    return items
                })
            } else {
                this.alert = response.error
            }
        },

        async getProviderListByFacility() {
            let response = await this.$services.getProviderListByFacility({
                key: this.$store.state.usr_credentials.provider_reg_type,
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                request_key: 'ALL'
            });

            if (response.status === 200) {
                let response_data = this.responseDataDecryption(response.data)

                if (response_data.has_data) {
                   this.prv_list = response_data.provider_list
                }
              
                this.loading_prv_list = false;
            } else {
                this.alert = {display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
            }
        },

        async getMedicineList() {
            let response = await this.$services.getAvailableMedicineByProvider({
                 provider_code: this.$store.state.prv_data.provider_code
            });

            if (response.status === 200) {
                this.loading_medicine_list = false
                let response_data = this.responseDataDecryption(response.data)

                if (response_data === 'Data not found.') 
                return

                return this.medicine_list = response_data.map(element => {
                    return {
                        medicine_code: element.medicine_code,
                        generic_name: element.generic_name,
                        unit: element.unit_type,
                        preparation: element.preparation,
                        data: element.data
                    }
                })
            } else {
                this.alert = {display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
            }
        },

        openTransferMedicine() {
            this.getProviderListByFacility();
            this.getMedicineList()
            this.generated_reference_number = `${this.$store.state.usr_credentials.provider_reg_type}-${this.$moment().format('MMYYYYHHmmSS')}${this.generateRandomString(1)}${this.generateRandomString(2)}`
            this.transfer_medicine = true
        },

        updateInitialQty(value) {
            const boxes = parseFloat(value.boxes) || 0;
            const inside = parseFloat(value.pieces_per_boxes) || 0;
            value.qty_to_transfer = boxes * inside;
        },

        filteredLotNoList(index) {
            if (!this.lot_no_list[index]) {
                return []; 
            }

            const selectedLotNumbers = this.medicine_transfer
                .filter((item, i) => i !== index && item.lot_no)
                .map(item => item.lot_no);

            return this.lot_no_list[index].filter(lot => !selectedLotNumbers.includes(lot.lot_no));
        },
        
        populateLotNo(selectedMedicine, index) {
            if (!selectedMedicine) {
                this.$set(this.medicine_transfer, index, {
                    generic_name: '',
                    medicine_code: '',
                    preparation: '',
                    unit: '',
                    pieces_per_boxes: '', 
                    boxes: '',
                    quantity: '',
                    unit_cost: '',
                    weighted_avg_cost: '',
                    lot_no: '',
                    expiration_date: ''
                });
                this.$set(this.lot_no_list, index, []);

                return;
            }

            const found_medicine = this.medicine_list.find(
                (med) => med.medicine_code === selectedMedicine.medicine_code
            );

            if (found_medicine && found_medicine.data) {
                this.medicine_transfer[index] = {
                    generic_name: found_medicine.generic_name,
                    medicine_code: found_medicine.medicine_code,
                    preparation: found_medicine.preparation,
                    unit: found_medicine.unit
                };
                this.lot_no_list.splice(index, 1, found_medicine.data);
            } else {
                this.lot_no_list.splice(index, 1, []);
            }
        },

        getMedicineData(data, index) {
            if (!data) {
                this.$set(this.medicine_transfer, index, {
                    ...this.medicine_transfer[index],
                    pieces_per_boxes: '', 
                    boxes: '',
                    quantity: '',
                    unit_cost: '',
                    weighted_avg_cost: '',
                    lot_no: '',
                    expiration_date: ''
                });
                return;
            }
            this.$set(this.medicine_transfer, index, {
                ...this.medicine_transfer[index], 
                quantity: data.current_quantity,
                unit_cost: data.current_unit_cost,
                weighted_avg_cost: data.current_weighted_avg_cost,
                lot_no: data.lot_no,
                expiration_date: data.expiration_date,
            });
        },

        addMedicineTransfer() {
            this.medicine_transfer.push({
                generic_name: '',
                medicine_code: '',
                quantity: '',
                pieces_per_boxes: '', 
                boxes: '',
                qty_to_transfer: '',
                unit: '',
                unit_cost: '',
                weighted_avg_cost: '',
                preparation: '',
                lot_no:'',
                expiration_date: ''
            })
        },

        removeMedicineTransfer(index) {
            this.medicine_transfer.splice(index, 1)
        },

        printDeliveryReceipt() {
            this.transaction_for_print = this.tbl_items.filter(transaction => transaction.reference_number == this.selected_reference)
            this.display_selection_referrence = false
            this.selected_reference = ''
            setTimeout(() => {
                window.scrollTo(0, 0);
                window.print();
            }, 500)
        },

        transferConfirmation() {
            //const get_medicine_value = this.medicine_transfer.map(item => item.generic_name);
            /* const validate_medicine_duplicate = get_medicine_value.some((item, idx)=> { 
                if (item !== '') {
                    return get_medicine_value.indexOf(item) != idx 
                }
            });*/
            const validate_transfer_qty = this.medicine_transfer.some(item => Number(item.qty_to_transfer) > Number(item.quantity))
            /* validate if medicine  has_duplicate
            if (validate_medicine_duplicate) {
                this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'You have chosen the same medicine', body: 'Change the medicine and try again.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                return
            }*/

            if (this.$refs.form.validate() && !validate_transfer_qty) { 
                this.show_confirmation = true
            }
        },
        exportToExcel() {
            const schema = [
                { column: 'Date Transferred', value: value => value.date_transferred, width: 20 },
                //{ column: 'Transferred From', value: value => value.transferred_from, width: 40 },
                { column: 'Transferred To', value: value => value.transferred_to, width: 40 },
                { column: 'Reference Number', value: value => value.reference_number, width: 30 },
                { column: 'Generic Name', value: value => value.generic_name, width: 50 },
                { column: 'Unit', value: value => value.unit_type, width: 20 },
                { column: 'Lot Number', value: value => value.lot_no, width: 20 },
                { column: 'Boxes', value: value => value.boxes, width: 20 },
                { column: 'Pieces per Boxes', value: value => value.pieces_per_boxes, width: 20 },
                { column: 'Transferred Qty.', value: value => value.transferred_quantity, width: 20 },
                { column: 'Qty. Received', value: value => value.received_quantity, width: 20 },
                { column: 'Status', value: value => value.item_status, width: 20 },
                { column: 'Date Received', value: value => value.date_received, width: 20 },
                { column: 'Received By', value: value => value.received_by, width: 20 },
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
                    color:'#FFFFFF'
                },

                fileName: `${file_name_facility} - Transferred - ${file_name_date}.xlsx`
            })
        },

        async save() {
            this.submit_medicine_loader = true;
            const adjusted_medicine = this.medicine_transfer.map(item => {
                return {
                    medicine_code: item.medicine_code,
                    lot_no: item.lot_no,
                    expiration_date: item.expiration_date,
                    unit_cost: item.unit_cost ? item.unit_cost : 0,
                    transferred_quantity: item.qty_to_transfer,
                    previous_quantity: item.quantity,
                    pieces_per_boxes: item.pieces_per_boxes, 
                    boxes: item.boxes,
                    new_quantity: Number(item.quantity) - Number(item.qty_to_transfer),
                    date_transferred: item.transferred_date + " / " + this.formatTime(item.transferred_time)
                }
            })

            let response = await this.$services.medTransferMedicineByFacility({
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                reference_number: this.generated_reference_number,
                sender: this.$store.state.prv_data.provider_code,
                receiver: this.transfer_to.provider_code,
                operator: this.$store.state.usr_credentials.user_name,
                data: adjusted_medicine
            });

            if (response.status === 200) {
                 if (!response.data.success) {
                    return this.alert =  {display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }

                this.updateTransferHistory(this.medicine_transfer);
                this.cancel();
                return this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: 'Transferred medicine successfully', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
            } else {
                this.alert = response.error;
            }
        },

        updateTransferHistory(transferred_data) {
            const updated_item = transferred_data.map(items => {
                return {
                    reference_number: this.generated_reference_number,
                    generic_name: items.generic_name,
                    lot_no: items.lot_no,
                    expiration_date: items.expiration_date,
                    pieces_per_boxes: items.pieces_per_boxes,
                    boxes: items.boxes,
                    transferred_from: this.$store.state.prv_data.provider_name,
                    transferred_to: this.transfer_to.prv_name,
                    date_transferred: this.$moment().format('MM-DD-YYYY HH:mm:ss'),
                    transferred_quantity: items.qty_to_transfer,
                    date_received: null,
                    received_quantity: null,
                    unit_type: items.unit === 'BOX' ? items.preparation : items.unit,
                    received_by: null,
                    item_status: null,
                }
            })

            return this.tbl_items = [...updated_item, ...this.tbl_items]
        },

        cancel() {
            this.submit_medicine_loader = false
            this.show_confirmation = false
            this.transfer_medicine = false
            this.transfer_to = ''
            this.medicine_transfer = [
                { generic_name: '', medicine_code: '' ,available_qty: '', pieces_per_boxes: '', boxes: '', qty_to_transfer: '', unit: '', unit_cost: '', weighted_avg_cost: '', preparation: '', lot_no: '', expiration_date: ''}
            ]
        },

        generateRandomString(length) {
            let value = "";
            const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
            for (var i = 0; i < length; i++)
                value += charset.charAt(Math.floor(Math.random() * charset.length));
            
            return value;
        },

        numberOnly(event) {
            if ((event.which < 48 || event.which > 57) && event.which !== 45){
                event.preventDefault();
            }
        },
        
        numberOnlyWithDeci(event, value) {
            if (((event.which != 46 || (event.which == 46 && value == '')) || value.indexOf('.') != -1) && (event.which < 48 || event.which > 57)){
                event.preventDefault();
            }
        },

    }
}
</script>

<style scoped>
#for-print {
    visibility: hidden;
}
table {
    width: 100%; 
}
td  { 
    text-align: center; 
}
.input--border {
    border-bottom: 1px solid grey;
    width: 100%;
}
@media print{
    #not-for-print {
        visibility: hidden;
    }

    #for-print {
        visibility: visible;
    }
}
</style>