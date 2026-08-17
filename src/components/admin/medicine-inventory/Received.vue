<template>
    <div id="content">
        <h1 class="font-weight-medium text--darken-3 grey--text mb-3">Receiving of Medicines</h1>

        <v-row v-if="tbl_loading" justify="center" class="d-flex my-10" dense> 
            <v-col cols="12">
                <v-progress-circular color="primary" size="35" indeterminate></v-progress-circular>
                <h4 class="blue--text text--darken-3 pl-5">Loading Data... Please wait...</h4>
            </v-col>
        </v-row>

        <template v-else>
            <v-row v-if="tbl_items_delivery.length === 0" class="my-10" dense>
                <v-col cols="12">
                    <h2 class="font-weight-regular grey--text text-center title"><em>No Pending Deliveries</em></h2>
                </v-col>
            </v-row>

            <template v-else>
                <h4 class="mb-2">PENDING DELIVERIES:</h4>
                <v-data-table :headers="tbl_headers_delivery" :items="tbl_items_delivery" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :items-per-page="5" class="elevation-2 custom-tbl" mobile-breakpoint="0">
                    <template v-slot:item="{ item, index }">
                        <tr :class="{'selected_row_color' : selected_delivery_number === item.reference_number}" @click="getMedicineInformation(item), selected_delivery_index = index">
                            <td>{{ item.reference_number }}</td>
                            <td>{{ item.date_transferred }}</td>
                            <td>{{ item.transferred_from }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </template>
        </template>

        <template v-if="selected_delivery_number">
            <h4 class="mt-6 mb-2 mt-10">DELIVERY DETAILS ITEMS:</h4>
            <h6 class="font-weight-medium blue--text text--darken-1 body-1 mb-2">REFERENCE NUMBER: {{ selected_delivery_number }}</h6>
            
            <v-data-table :headers="tbl_headers_received" :items="tbl_items_received" :loading="tbl_loading_received" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :items-per-page="5" class="elevation-2 custom-tbl" mobile-breakpoint="0">
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.generic_name }}</td>
                        <td>{{ item.lot_no }}</td>
                        <td>{{ item.expiration_date }}</td>
                        <td>{{ item.pieces_per_boxes }}</td>
                        <td>{{ item.boxes }}</td>
                        <td>{{ item.unit_type ? item.unit_type : 'N/A' }}</td>
                        <td>{{ item.current_unit_cost }}</td>
                        <td>{{ item.current_weighted_avg_cost }}</td>
                        <td class="align-baseline d-flex mt-2">
                            {{ item.transferred_quantity }} /
                            <v-text-field v-model="item.received_quantity" v-on:keypress="numberOnly" :error="empty_fields && !item.received_quantity" :disabled="btn_loading_received" @blur="change_status = true" class="body-2 pl-2" maxlength="6" hide-details outlined dense></v-text-field>
                        </td>
                    </tr>
                </template>
            </v-data-table>

            <v-layout justify-center wrap mt-7>
                <v-btn :disabled="btn_loading_received" @click="confirmCancel" class="mr-2" color="primary" outlined>CANCEL</v-btn>
                <v-btn :loading="btn_loading_received" :disabled="tbl_loading_received" @click="received" class="ml-2" color="primary">TAG AS RECEIVED</v-btn>
            </v-layout>
        </template>

        <v-divider class="mt-8 mb-5"></v-divider>

        <v-row dense>
            <v-col cols="12">
                <h2 class="d-print-none font-weight-medium grey--text text--darken-3">Received History</h2>
            </v-col>
            <v-col cols="12" md="6" xl="6">
                <v-btn @click="print_delivery_receipt = true" color="primary" outlined><v-icon left>mdi-printer</v-icon> PRINT DELIVERY RECEIPT</v-btn>
            </v-col>

            <v-col class="text-right" cols="12" md="6" xl="6">
                <label>EXPORT:</label>
                <v-btn :disabled="tbl_loading" @click="exportToExcel" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> EXCEL</v-btn>
            </v-col>
        </v-row>

        <v-data-table :headers="tbl_headers_history" :items="tbl_items_history" :loading="tbl_loading" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-2 my-4" mobile-breakpoint="0">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.date_received }} </td>
                    <td>{{ item.transferred_from }}</td>
                    <td>{{ item.reference_number }}</td>
                    <td>{{ item.generic_name }}</td>
                    <td>{{ item.unit_type ? item.unit_type : 'N/A' }}</td>
                    <td>{{ item.lot_no }}</td>
                    <td>{{ item.boxes }}</td>
                    <td>{{ item.pieces_per_boxes }}</td>
                    <td>{{ item.received_quantity }}</td>
                    <td :class="{'red--text' : item.item_status === 'INCOMPLETE'}" class="text-uppercase">{{ item.item_status }}</td>
                    <td>{{ item.new_balance }}</td>
                    <td>{{ item.date_transferred }}</td>
                    <td>{{ item.received_by_operator }}</td>
                </tr>
            </template>
        </v-data-table>

        <v-dialog v-model="print_delivery_receipt" width="500" persistent>
            <v-card>
                <div class="pt-4 px-6">
                    <h2 class="font-weight-medium">Delivery Receipt</h2>
                    <h4 class="font-weight-regular body-2 text--secondary mb-2">Choose a receipt to print using reference number</h4>
                    <v-autocomplete v-model="selected_reference_number" :items="tbl_items_history" item-text="reference_number" placeholder="Reference Number" clearable hide-details outlined></v-autocomplete>
                </div>
                
                <v-divider class="my-4"></v-divider>
                
                <v-layout justify-center wrap pb-4>
                    <v-btn :disabled="!selected_reference_number" @click="printDeliveryReceipt" class="mx-2" color="primary"><v-icon left>mdi-printer</v-icon> PRINT RECEIPT</v-btn>
                    <v-btn @click="print_delivery_receipt = false, selected_reference_number = ''" class="mx-2" color="primary" outlined>CANCEL</v-btn>
                </v-layout>
            </v-card>
        </v-dialog>

        <div v-if="delivery_receipt.length > 0" id="for-print">
            <h2 class="text-center mt-6 mb-4">Delivery Receipt</h2>
            <h4 class="font-weight-medium text-left body-1 mb-3">Reference Number: <span class="font-weight-bold red--text">{{ selected_reference_number }}</span></h4>

            <v-row dense>
                <v-col class="align-end d-flex" cols="7">
                    <label class="font-weight-medium text-no-wrap body-1 pr-2">From: </label>
                    <span class="input--border">{{ delivery_receipt[0].transferred_from }}</span>
                </v-col>
                
                <v-col class="align-end d-flex" cols="5">
                    <label class="font-weight-medium text-no-wrap body-1 pr-2">Date Transferred: </label>
                    <span class="input--border">{{ $moment(delivery_receipt[0].date_transferred).format('MMMM DD, YYYY')}}</span>
                </v-col>
            </v-row>

            <v-row class="mt-2" dense>
                <v-col class="align-end d-flex" cols="7">
                    <label class="font-weight-medium text-no-wrap body-1 pr-2">Received By: </label>
                    <span class="input--border">{{ delivery_receipt[0].received_by_operator }}</span>
                </v-col>

                <v-col class="align-end d-flex" cols="5">
                    <label class="font-weight-medium text-no-wrap body-1 pr-2">Date Received: </label>
                    <span class="input--border">{{ $moment(delivery_receipt[0].date_received).format('MMMM DD, YYYY') }}</span>
                </v-col>
            </v-row>

            <table class="body-2 mt-5" border="collapse" cellspacing="0">
                <tr>
                    <th style="width: 200px;">Generic Name</th>
                    <th style="width: 100px;">Lot Number</th>
                    <th style="width: 100px;">Boxes</th>
                    <th style="width: 100px;">Pieces per Boxes</th>
                    <th style="width: 200px;">Quantity Receive (pcs)</th>
                    <th style="width: 100px;">Unit</th>
                    <th style="width: 150px;">New Balance</th>
                    <th style="width: 150px;">Status</th>
                </tr>

                <tr v-for="(value, index) in delivery_receipt" :key="index='a'">
                    <td style="width: 200px;">{{ value.generic_name }}</td>
                    <td style="width: 100px;">{{ value.lot_no }}</td>
                    <td style="width: 100px;">{{ value.boxes }}</td>
                    <td style="width: 100px;">{{ value.pieces_per_boxes }}</td>
                    <td style="width: 200px;">{{ value.received_quantity }}</td>
                    <td style="width: 100px;">{{ value.unit_type }}</td>
                    <td style="width: 150px;">{{ value.new_balance }}</td>
                    <td :class="{'red--text' : value.item_status === 'INCOMPLETE'}" class="text-uppercase" style="width: 150px;">{{ value.item_status }}</td>
                </tr>
            </table>
        </div>

        <Alert :alert="alert" @cancel="cancel" />
    </div>
</template>

<script>
import Alert from "@/components/Alert.vue"

export default {
    components: {
        Alert
    },

    data() {
        return {
            // TABLE FOR DELIVERY
            selected_delivery_number: '',
            selected_delivery_index: '',

            tbl_headers_delivery: [
                { text: 'REFERENCE NUMBER', value: 'reference_number', width: '150px', sortable: false },
                { text: 'TRANSFERRED DATE', value: 'date_transferred', width: '100px', sortable: false },
                { text: 'TRANSFERRED FROM', value: 'transferred_from', width: '100px', sortable: false }
            ],
            tbl_items_delivery: [],

            // TABLE FOR NEW RECEIVED
            tbl_loading_received: false,
            tbl_headers_received: [
                { text: 'GENERIC NAME', value: 'generic_name', width: '250px', sortable: false },
                { text: 'LOT NUMBER', value: 'lot_no', width: '200px', sortable: false },
                { text: 'EXPIRATION DATE', value: 'expiration_date', width: '200px', sortable: false },
                { text: 'BOXES', value: 'boxes', width: '100px', sortable: false },
                { text: 'PIECES PER BOXES', value: 'pieces_per_boxes', width: '100px', sortable: false },
                { text: 'UNIT', value: 'unit_type', width: '100px', sortable: false },
                { text: 'UNIT COST', value: 'current_unit_cost', width: '100px', sortable: false },
                { text: 'WAC', value: 'current_weighted_avg_cost', width: '100px', sortable: false },
                { text: 'QUANTITY / RECEIVED QUANTITY (PCS)', value: 'transferred_quantity', width: '250px', sortable: false }
            ],
            tbl_items_received: [],

            // TABLE FOR RECEIVED HISTORY
           tbl_headers_history: [
                { text: 'DATE RECEIVED', value: 'date_received', width: '150px', sortable: false },
                { text: 'TRANSFERRED FROM', value: 'transferred_from', width: '150px', sortable: false },
                { text: 'REFERENCE NUMBER', value: 'reference_number', width: '200px', sortable: false },
                { text: 'GENERIC NAME', value: 'generic_name', width: '200px', sortable: false },
                { text: 'UNIT', value: 'unit_type', width: '100px', sortable: false },
                { text: 'LOT NUMBER', value: 'lot_no', width: '100px', sortable: false },
                { text: 'BOXES', value: 'boxes', width: '100px', sortable: false },
                { text: 'PIECES PER BOXES', value: 'pieces_per_boxes', width: '100px', sortable: false },
                { text: 'QUANTITY RECEIVED (PCS)', value: 'received_quantity', width: '100px', sortable: false },
                { text: 'STATUS', value: 'item_status', width: '100px', sortable: false },
                { text: 'NEW BALANCE', value: 'new_balance', width: '100px', sortable: false },
                { text: 'DATE TRANSFERRED', value: 'date_transferred', width: '150px', sortable: false },
                { text: 'RECEIVED BY', value: 'received_by_operator', width: '100px', sortable: false }
            ],
            tbl_items_history: [],
            
            // FOR PRINT
            selected_reference_number: '',
            print_delivery_receipt: false,
            delivery_receipt: [],

            grouped_data: [],
            empty_fields: false,
            change_status: false,
            btn_loading_received: false,
            tbl_loading: true,
            alert: {}
        }
    },

    created() {        
        this.getMedicineForReceiving();
    },

    methods: {
        async getMedicineForReceiving() {
            let response = await this.$services.getMedicineForReceiving({
                provider_code: this.$store.state.prv_data.provider_code
            })

            if (response.status === 200) {
                    let response_data = this.responseDataDecryption(response.data);
                    if (response_data !== 'Data not found.') {
                        let collection = {};

                        response_data.forEach(element => {
                            element.date_received = this.formatDateAndTime(element.date_received);
                            element.date_transferred = this.formatDateAndTime(element.date_transferred);

                            if (element.unit_type === 'BOX') element.unit_type = element.preparation;

                            if (element.received_by_operator) {
                                this.tbl_items_history.push(element);
                            } else {
                                if (element.reference_number in collection) {
                                    collection[element.reference_number].push(element);
                                } else {
                                    collection[element.reference_number] = [element];

                                    this.tbl_items_delivery.push({
                                        reference_number: element.reference_number,
                                        date_transferred: element.date_transferred,
                                        transferred_from: element.transferred_from
                                    });
                                }
                            }
                        });
                        this.grouped_data = collection;
                    }
                this.tbl_loading = false;
            } else {
                this.alert = response.error
            }
        },

        async getMedicineInformation(data) {
            if (this.tbl_loading_received || this.btn_loading_received) return;

            this.selected_delivery_number = data.reference_number;
            this.tbl_loading_received = true;
            this.tbl_items_received = [];

            const medicine_code = this.grouped_data[data.reference_number].map(element => element.medicine_code);
            let response = await this.$services.getMedicineInfo({
                provider_code: this.$store.state.prv_data.provider_code,
                medicine_code: medicine_code
            });

            if (response.status === 200) {
                let response_data = this.responseDataDecryption(response.data)
                
                for (let index = 0; index < this.grouped_data[data.reference_number].length; index++) {
                    const element = this.grouped_data[data.reference_number][index];
                    element.previous_quantity = response_data[element.medicine_code] ? response_data[element.medicine_code] : 0
                }
                this.tbl_items_received = this.grouped_data[data.reference_number]
                this.tbl_loading_received = false
            } else {
                this.alert = response.error;
            }
        },

        async received() {
            this.empty_fields = false;
            let count = 0;

            for (let index = 0; index < this.tbl_items_received.length; index++) {
                const element = this.tbl_items_received[index];
                
                if (!element.received_quantity) {
                    count++;
                }
            }

            if (count > 0) {
                this.empty_fields = true;
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Empty Fields', body: 'Please complete all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' };
            } else {
                this.btn_loading_received = true;

                let new_history = [];
                let data = [];

                for (let index = 0; index < this.tbl_items_received.length; index++) {
                    const element = this.tbl_items_received[index];
                    
                    element.received_quantity = parseInt(element.received_quantity);
                    element.transferred_quantity = parseInt(element.transferred_quantity);
                    element.previous_quantity = parseInt(element.previous_quantity);

                    let item_status = '';
                    
                    if (element.received_quantity === element.transferred_quantity) {
                        item_status = 'COMPLETE';
                    } else if (element.received_quantity < element.transferred_quantity) {
                        item_status = 'INCOMPLETE';
                    } else {
                        item_status = 'OVER';
                    }
        
                    let current_quantity = Number(element.current_quantity) + Number(element.received_quantity);

                    data.push({
                        medicine_code: element.medicine_code,
                        lot_no: element.lot_no,
                        expiration_date: element.expiration_date,
                        pieces_per_boxes: element.pieces_per_boxes,
                        boxes: element.boxes,
                        received_quantity: element.received_quantity,
                        item_status: item_status,
                        current_quantity: current_quantity,
                        previous_quantity: element.previous_quantity,
                        current_weighted_avg_cost: element.current_weighted_avg_cost,
                        current_unit_cost: element.current_unit_cost,
                        unit_type: element.unit_type,
                    });

                    new_history.push({
                        reference_number: this.selected_delivery_number,
                        generic_name: element.generic_name,
                        lot_no: element.lot_no,
                        expiration_date: element.expiration_date,
                        pieces_per_boxes: element.pieces_per_boxes,
                        boxes: element.boxes,
                        transferred_from: element.transferred_from,
                        date_transferred: element.date_transferred,
                        date_received: this.$moment().format('MM-DD-YYYY / hh:mm:ss A'),
                        received_quantity: element.received_quantity,
                        unit_type: element.unit_type,
                        new_balance: current_quantity,
                        received_by_operator: this.$store.state.usr_credentials.user_name,
                        item_status: item_status
                    });
                }

                let response = await this.$services.getRecievedUpdateMedicine({
                    lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                    provider_code: this.$store.state.prv_data.provider_code,
                    reference_number: this.selected_delivery_number,
                    received_by_operator: this.$store.state.usr_credentials.user_name,
                    data: data
                });

                if (response.status === 200) {
                    delete this.grouped_data[this.selected_delivery_number]
                    this.tbl_items_delivery.splice(this.selected_delivery_index, 1)
                    this.cancel();
                    this.tbl_items_history.unshift(...new_history)
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-check-circle', color: 'success', title: 'Sucessfully Received', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                    this.btn_loading_received = false
                } else {
                    this.alert = response.error;
                }
            }
        },

        confirmCancel() {
            if (this.tbl_loading_received || !this.change_status) {
                this.cancel();
            } else {
                this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'red', title: 'Changes will be disregarded', body: 'Do you want to disregard the changes?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'cancel', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
            }
        },

        cancel() {
            this.empty_fields = false
            this.change_status = false
            this.selected_delivery_number = ''
            this.tbl_loading_received = false
            this.tbl_items_received = []
        },

        printDeliveryReceipt() {
            this.print_delivery_receipt = false
            this.delivery_receipt = this.tbl_items_history.filter(item => item.reference_number === this.selected_reference_number)
            
            setTimeout(() => {
                this.selected_reference_number = ''
                window.scrollTo(0, 0);
                window.print();
            }, 500)
        },

        exportToExcel() {
            const schema = [
                { column: 'Date Received', value: value => value.date_received, width: 20 },
                { column: 'Transferred From', value: value => value.transferred_from, width: 40 },
                { column: 'Reference Number', value: value => value.reference_number, width: 30 },
                { column: 'Generic Name', value: value => value.generic_name, width: 50 },
                { column: 'Unit', value: value => value.unit_type, width: 20 },
                { column: 'Lot Number', value: value => value.lot_no, width: 40 },
                { column: 'Boxes', value: value => value.boxes, width: 20 },
                { column: 'Pieces per Boxes', value: value => value.pieces_per_boxes, width: 20 },
                { column: 'Quantity Received', value: value => value.received_quantity, width: 20 },
                { column: 'Status', value: value => value.item_status, width: 20 },
                { column: 'New Balance', value: value => value.new_balance, width: 20 },
                { column: 'Date Transferred', value: value => value.date_transferred, width: 20 },
                { column: 'Received By', value: value => value.received_by_operator, width: 20 },
            ]

            const file_name_date = this.$moment().format('MM-DD-YYYY');
            const file_name_facility = this.$store.state.prv_data.provider_name;

            this.$excel_file(this.tbl_items_history, {
                schema,
                headerStyle: {
                    alignVertical: 'center',
                    borderColor: '#FFFFFF', 
                    fontWeight: 'bold',
                    backgroundColor: '#1565C0',
                    color:'#FFFFFF'
                },

                fileName: `${file_name_facility} - Received Medicines - ${file_name_date}.xlsx`
            })
        },

        numberOnly(event) {
            if ((event.which < 48 || event.which > 57) && event.which !== 45) {
                event.preventDefault();
            }
        }
    }
}
</script>

<style scoped>
::v-deep .theme--light.v-data-table.custom-tbl thead tr th {
    background-color:#E1E7EA;
    color: #555 !important;
    justify-content: center !important;
}
::v-deep .theme--light.v-data-table.custom-tbl .v-data-footer {
    background-color:#E1E7EA;
    color: #555 !important;
    justify-content: center !important;
}
.selected_row_color {
    background: #55abd7 !important;
    color: white;
}
#for-print { visibility: hidden; }
table { width: 100%; }
td  { text-align: center; }
.input--border {
    border-bottom: 1px solid grey;
    width: 100%;
}
@media print {
    #content { visibility: hidden; }
    #for-print {
        left: 0;
        padding: 0 20px;
        position: absolute !important; 
        top: 0;
        visibility: visible;
        width: 100%;
    }
}
</style>