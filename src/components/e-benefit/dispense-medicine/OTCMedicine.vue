<template>
    <v-dialog v-model="show_otc_medicine" width="1000" persistent>
        <v-card>
            <div class="pa-7">
                <v-row dense class="py-1">
                    <v-col cols="12" md="12" lg="12">
                        <label>Medicine Name: <b>{{ medicine_data.medicine_name }}</b></label>
                    </v-col>
                </v-row>

                <v-row dense class="py-1">
                    <v-col cols="12" md="4" lg="4">
                        <label>Dosage: <b>{{ medicine_data.dosage }}</b></label>
                    </v-col>
                    <v-col cols="12" md="4" lg="4">
                        <label>Route: <b>{{ medicine_data.route }}</b></label>
                    </v-col>
                    <v-col cols="12" md="4" lg="4">
                            <label>Preparation: <b>{{ medicine_data.preparation }}</b></label>
                    </v-col>
                </v-row>

                <v-row dense class="py-1">
                    <v-col cols="12" md="4" lg="4">
                        <label >No. to dispensed: <b>{{ medicine_data.available_to_dispensed }}</b></label>
                    </v-col>
                </v-row>

                <v-row dense class="py-2">
                    <v-col cols="12" md="2" lg="1">
                        <label class="mb-2">Lot Number:</label>
                    </v-col>
                    <v-col cols="12" md="4" lg="3">
                        <v-autocomplete v-model="selected_lot" :items="lot_nos" @change="updateExpirationDate" @input="lot_no = textCapitalize($event)" item-text="lot_no" label="Select Lot No" style="margin-bottom: 0 !important; padding-bottom: 0 !important;"  dense>
                            <template v-slot:append>
                                <v-tooltip bottom v-if="Number(current_quantity) === 0 && selected_lot">
                                <template #activator="{ on }">
                                    <v-icon v-on="on" left color="red darken-1">fas fa-exclamation-circle</v-icon>
                                </template>
                                No stock available for the selected Lot Number.
                                </v-tooltip>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="4" lg="4">
                        <label class="mb-2">Expiration Date: <b>{{ expiration_date }}</b></label>
                    </v-col>
                    <v-col cols="12" md="4" lg="4">
                        <label :class="{ 'red--text': Number(current_quantity) === 0 && selected_lot }">Quantity: <b>{{ current_quantity }}</b></label>
                    </v-col>
                </v-row>

                <v-row dense class="py-1">
                    <v-col cols="12" md="12" lg="12">
                        <label class="mb-2">Medicine to be Dispensed</label>
                        <v-text-field v-model="otc_quantity" v-on:keypress="numberOnly" label="Quantity to be dispensed" onpaste="return false" outlined dense></v-text-field>
                    </v-col>
                </v-row>
            </div>

            <v-divider></v-divider>

            <v-layout justify-center wrap pt-6 pb-5>
                <v-btn @click="doneOTCMedicine" :disabled="!otc_quantity || Number(current_quantity) === 0" class="mx-2" color="primary">DONE</v-btn>
                <v-btn @click="closeOTCMedicine" class="mx-2">CLOSE</v-btn>
            </v-layout>

            <Alert :alert="alert" />
        </v-card>

    </v-dialog>
</template>

<script>
import Alert from '@/components/Alert.vue'

export default {
    components: {
        Alert
    },

    data() {
        return {
            show_otc_medicine: false,
            otc_loading: false,
            otc_items: [],
            otc_medicine: {},
            otc_quantity: '',
            medicine_index: '',
            medicine_data: {},
            available_to_dispensed: '',
            alert: {},
            selected_lot:'',
            expiration_date:'',
            current_quantity: ''
        }
    },

    computed: {
        lot_nos() {
            return this.medicine_data && Array.isArray(this.medicine_data.data) ? this.medicine_data.data.map(item => item.lot_no)  : [];
        }
    },

    methods: {
        // getOTCMedicine(index, item) {
        //     this.available_to_dispensed = item.available_to_dispensed
        //     this.medicine_index = index
        //     this.medicine_data = item
        //     this.show_otc_medicine = true
        // },

        getOTCMedicine(index, item) {
            this.available_to_dispensed = item.available_to_dispensed
            this.medicine_index = index
            this.medicine_data = item

            // RESET STATE
            this.selected_lot = null
            this.expiration_date = ''
            this.current_quantity = ''
            this.otc_quantity = ''

            this.show_otc_medicine = true
        },

        editOTCMedicine(index, item) {
            this.available_to_dispensed = item.available_to_dispensed
            this.otc_medicine = item.otc_medicine
            this.getOTCMedicine(index, item);
        },
    
        doneOTCMedicine() {
            if(this.otc_quantity > this.available_to_dispensed) {
                this.alert = { display: true, type: 'standard', width: 700, icon: 'mdi-alert-circle', color: 'yellow', title: 'You can only dispense medicine up to the prescribed medicine.', body: 'Please try again', btn_pry_txt: 'OK',  btn_pry_color: 'primary',  btn_pry_otl: false,  btn_pry_act: 'closeAlert' }
            } else {
                const status =  this.medicine_data.default_dispensed_medicine_status

                this.$emit('updateMedicine', {
                    index: this.medicine_index,
                    otc_medicine: {
                        dosage: this.medicine_data.dosage,
                        generic_name: this.medicine_data.medicine_name,
                        otc_medicine_code: this.medicine_data.medicine_code,
                        lot_no: this.lot_no,
                    },
                    otc_quantity: status === 'Partially Served' ? parseInt(this.otc_quantity) + parseInt(this.medicine_data.total_dispensed_medicine)
                                : this.otc_medicine === undefined ? parseInt(this.otc_quantity) + parseInt(this.medicine_data.total_dispensed_medicine) : parseInt(this.otc_quantity)
                })
                
                this.medicine_data.available_to_dispensed = status === 'Partially Served' ? parseInt(this.available_to_dispensed) - parseInt(this.otc_quantity)
                                                            : this.otc_medicine === undefined ? parseInt(this.available_to_dispensed) - parseInt(this.otc_quantity) : parseInt(this.available_to_dispensed) 
                this.closeOTCMedicine();
            }
        },

        closeOTCMedicine() {
            this.otc_medicine = ''
            this.otc_quantity = ''
            this.show_otc_medicine = false
        },
        
        numberOnly(event) {
            if ((event.which < 48 || event.which > 57) && event.which !== 45) {
                event.preventDefault();
            }
        },
        
        // updateExpirationDate() {
        //     const selected_item = this.medicine_data.data && Array.isArray(this.medicine_data.data) 
        //         ? this.medicine_data.data.find(item => item.lot_no === this.selected_lot)
        //         : null;

        //     this.expiration_date = selected_item ? selected_item.expiration_date : '';
        //     this.current_quantity = selected_item ? selected_item.current_quantity : '';
        // }

        updateExpirationDate() {
            // reset first
            this.expiration_date = ''
            this.current_quantity = ''

            if (!this.selected_lot) return

            const selected_item = Array.isArray(this.medicine_data?.data)
                ? this.medicine_data.data.find(item => item.lot_no === this.selected_lot)
                : null

            if (selected_item) {
                this.expiration_date = selected_item.expiration_date
                this.current_quantity = selected_item.current_quantity
            }
        }
    }
}
</script>