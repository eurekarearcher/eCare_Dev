<template>
    <div>
        <h1 class="font-weight-medium grey--text text--darken-3 mb-3">Medicine Inventory History</h1>
        
        <v-row justify="space-between" dense>
            <v-col cols="12" md="6" l="8" xl="10">
                <v-text-field v-model="tbl_search" prepend-inner-icon="mdi-magnify" label="Search" hide-details outlined dense></v-text-field>
            </v-col>
            
            <v-col class="d-flex justify-end align-center" cols="12" md="6" l="4" xl="2">
                <div class="text-right"> 
                    <label>EXPORT:</label>
                    <v-btn :disabled="tbl_loading" @click="exportToExcel" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> EXCEL</v-btn>
                </div>
            </v-col>
        </v-row>

        <v-data-table :headers="tbl_headers" :items="tbl_items" :loading="tbl_loading" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :search="tbl_search" class="elevation-2 mt-4" mobile-breakpoint="0" >
        </v-data-table>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {

    data() {
        return {
            // TABLE
            tbl_loading: true,
            tbl_search: '',
            tbl_headers: [
                { text: 'DATE', value: 'date', width: '200px', sortable: true },
                { text: 'GENERIC NAME', value: 'generic_name', width: '300px', sortable: true },
                { text: 'DOSAGE', value: 'dosage', width: '100px', sortable: true },
                { text: 'UNIT', value: 'unit_type', width: '100px', sortable: true }, // update this to UNIT TYPE
                //{ text: 'PREPARATION', value: 'preparation', width: '150px', sortable: false },
                { text: 'LOT NUMBER', value: 'lot_no', width: '150px', sortable: true },
                { text: 'EXPIRATION DATE', value: 'expiration_date', width: '150px', sortable: true },
                { text: 'BOXES', value: 'boxes', width: '150px', sortable: true },
                { text: 'PIECES PER BOX', value: 'pieces_per_boxes', width: '150px', sortable: true },
                //{ text: 'UNIT COST', value: 'unit_cost', width: '150px', sortable: false },
               // { text: 'PRICE PER PIECE', value: 'price_per_piece', width: '150px', sortable: false },
                { text: 'TOTAL QUANTITY', value: 'total_quantity', width: '150px', sortable: true },
            ],
            tbl_items: []
        }
    },

    created() {
        this.getMedicineInventoryHistory();
    },
    
    watch: {
        filtered_inventory_list() {}
    
    },
    computed: {
        ...mapState(['usr_credentials']),

        filtered_inventory_list() {
            const result = this.tbl_items.filter(item => {
                let search_filter = 
                (item.date?.toLowerCase().includes(this.tbl_search.toLowerCase())) ||
                (item.generic_name?.toLowerCase().includes(this.tbl_search.toLowerCase())) ||
                (item.lot_no?.toLowerCase().includes(this.tbl_search.toLowerCase())) ||
                (item.expiration_date?.toLowerCase().includes(this.tbl_search.toLowerCase())) ||
                (item.dosage?.toLowerCase().includes(this.tbl_search.toLowerCase())) ||
                (item.expiration_date?.toLowerCase().includes(this.tbl_search.toLowerCase())) ||
                (item.unit_cost?.toLowerCase().includes(this.tbl_search.toLowerCase())) ||
                (String(item.quantity).includes(this.tbl_search.toLowerCase())) ||
                (item.unit?.toLowerCase().includes(this.tbl_search.toLowerCase()));

                let search = this.tbl_search ? search_filter : true;

                return search
            });

            return result;
            }
    },

    methods: {
        async getMedicineInventoryHistory() {
            let response = await this.$services.getMedicineInventoryHistory({
                provider_code: this.$store.state.prv_data.provider_code,
            });

            if (response.status === 200) {
                this.tbl_loading = false
                response.data = this.responseDataDecryption(response.data)
                this.tbl_items = response.data.map(item => ({
                    ...item,
                    date: item.date ? this.formatDateAndTime(item.date) : '-',
                    expiration_date: item.expiration_date ? this.formatDate(item.expiration_date) : '-',
                    dosage: item.dosage ? item.dosage : '-',
                    unit_type: item.unit_type === 'BOX' ? item.preparation : (item.unit_type ? item.unit_type : '-')
                }))
            } else {
                this.alert = response.error
            }
        },

        exportToExcel() {
            const schema = [
                { column: 'Date', value: value => value.date, width: 20 },
                { column: 'Generic Name', value: value => value.generic_name, width: 50 },
                { column: 'Dosage', value: value => value.dosage, width: 15 },
                { column: 'Unit', value: value => value.unit_type, width: 15 },
                { column: 'Lot Number', value: value => value.lot_no, width: 15 },
                { column: 'Expiration Date', value: value => value.expiration_date, width: 15},
                { column: 'Boxes', value: value => value.boxes, width: 10 },
                { column: 'Pieces Per Box', value: value => value.pieces_per_boxes, width: 15 },
                { column: 'Total Quantity', value: value => {
                    const qty = Number(value.total_quantity || 0).toLocaleString();
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

                fileName: `${file_name_facility} - Medicine Inventory History - ${file_name_date}.xlsx`
            })
        },
    }
}
</script>
