<template>
    <v-container fluid class="height-100 color-text px-5 px-lg-5" id="not-for-print">
        <div class="px-5 py-5" >
            <v-row class="my-4" justify="space-between" align="center" dense>
                <v-col cols="12" sm="9" md="9" lg="9" dense>
                    <h6 class="font-weight-medium text-h5"><span class="grey--text text--darken-3">Name: {{ patient_name }}</span></h6>
                </v-col>
                
                <v-col cols="12" sm="3" md="3" lg="3" dense>
                    <v-row justify="end" dense>
                        <!-- <v-btn :disabled="disable_print_rx_btn" class="ma-2" color="#367c9d" @click="viewTreatmentPlan" dark> RX ISSUANCE <v-icon size="20" right>mdi-printer</v-icon> </v-btn> -->
                        <v-btn class="ma-2" color="#367c9d" @click="viewTreatmentPlan" dark> RX ISSUANCE <v-icon size="20" right>mdi-printer</v-icon> </v-btn>
                    </v-row>
                </v-col>
            </v-row>
            <v-divider></v-divider>

            <v-row class="my-4" justify="space-between" align="center" dense>
                <v-col cols="12" sm="6" md="6" lg="6">
                    <h6 class="font-weight-medium text-h6">Medicine List</h6>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="5">
                    <v-text-field v-model="tbl_search" placeholder="Search" prepend-inner-icon="mdi-magnify" hide-details outlined dense></v-text-field>
                </v-col>
            </v-row>

            <v-data-table :headers="tbl_headers" :items="tbl_items" :search="tbl_search" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :items-per-page="5" class="elevation-2 mb-5">
                <template v-slot:item="{ index, item }">
                    <tr>
                        <td>{{ item.medicine_name }}</td>
                        <td>{{ item.lot_no ? item.lot_no : '-' }}</td>
                        <td>{{ item.dosage }}</td>
                        <td>{{ item.preparation }}</td>
                        <td>{{ item.route }}</td>
                        <td>{{ item.total_prescribed_medicine }}</td>

                        <td v-if="item.total_dispensed_medicine" class="py-2"> 
                            <v-row v-if="item.status === '0'" wrap>
                                <v-col cols="12">
                                    {{ item.dispensed_medicine_name }} <br/> <b>{{ item.total_dispensed_medicine }} {{ item.total_dispensed_medicine > 1 ? 'pcs.' : 'pc.'}} </b>
                                </v-col>
                            </v-row>

                            <v-row v-else wrap>
                                <span class="mx-auto">{{ item.dispensed_medicine_name }} <br/> <b>{{ item.total_dispensed_medicine }} {{ item.total_dispensed_medicine > 1 ? 'pcs.' : 'pc.'}} </b></span>
                               <v-icon color="success">mdi-check-circle</v-icon>
                            </v-row>
                        </td>
                        <td v-else class="py-2">
                            <v-btn @click="handleSelectMedicine(index, item)" color="primary">SELECT MEDICINE</v-btn>
                        </td>

                        <td>
                            <span :class="statusClass(item.dispensed_medicine_status)">
                                <b>{{ item.dispensed_medicine_status }}</b>
                            </span> 
                            <v-row v-if="(item.total_dispensed_medicine !== null && item.dispensed_medicine_status === 'Not Served' && item.total_dispensed_medicine !== item.total_prescribed_medicine) 
                            || (item.dispensed_medicine_status === 'Pending'  && item.total_dispensed_medicine) || (item.dispensed_medicine_status === 'Partially Served' && item.total_dispensed_medicine)">
                                <v-col cols="12" class="justify-space-around">
                                    <v-icon :disabled="dispense_btn_loader" @click="handleEditMedicine(index, item, edit_med)" color="primary"
                                    :title="item.default_dispensed_medicine_status === 'Partially Served' ? 'Any medicine added here will be included in the total quantity to be dispensed.' : ''">mdi-pencil</v-icon>
                                    
                                    <v-icon :disabled="dispense_btn_loader" @click="removeMedicine(index)" color="error"
                                    :title="item.default_dispensed_medicine_status === 'Partially Served' ? 'The dispensed medicine will be reset to its original quantity.' : ''">mdi-delete</v-icon>
                                </v-col>
                            </v-row> 
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>

        <v-divider></v-divider>

        <v-row justify="center" class="pt-6 pb-5" wrap>
            <v-btn :disabled="!has_selected_medicine && !has_edited_medicine" :loading="dispense_btn_loader" @click="dispenseMedicine" class="mx-2" color="primary">DISPENSE MEDICINE</v-btn>
            <v-btn v-if="this.$store.state.usr_credentials.department !== 'PVTPharmacist'" :disabled="dispense_btn_loader" @click="closeDialog" class="mx-2">CLOSE</v-btn>
        </v-row>

        <TreatmentPlan @mutations="mutations($event)" ref="treatment_plan" :patient_name="patient_name" :tbl_items="tbl_items"/>
        <OTCMedicine @updateMedicine="updateMedicine" ref="otc_medicine" />
        <Alert :alert="alert" @closeViewMedicine="closeViewMedicine" />
    </v-container>
</template>

<script>
import Alert from '@/components/Alert.vue'
import OTCMedicine from '@/components/e-benefit/dispense-medicine/OTCMedicine.vue'
import TreatmentPlan from '@/components/emr/printable-form/treatment-plan/Main.vue'

export default {
    components: {
        Alert,
        TreatmentPlan,
        OTCMedicine
    },

    data() {
        return {
            transaction_number: '',
            patient_name: '',
            patient_address:'',
            patient_age:'',
            doctor_name:'',
            doctor_prc_license:'',
            date_admitted:'',
            tbl_search: '',
            tbl_headers: [
                { text: 'Medicine Name', value: 'medicine_name', width: '250px' },
                { text: 'Lot Number', value: 'lot_no', width: '150px' },
                { text: 'Dosage', value: 'dosage', width: '100px', sortable: false },
                { text: 'Preparation', value: 'preparation', width: '100px', sortable: false },
                { text: 'Route', value: 'route', width: '100px', sortable: false },
                { text: 'Total Prescribed Medicine', value: 'total_prescribed_medicine', width: '100px', sortable: false },
                { text: 'Medicine to be Dispensed | Quantity', value: '', width: '250px', sortable: false },
                { text: 'Status', value: 'dispensed_medicine_status', width: '200px'}
            ],
            tbl_items: [],
            dispense_btn_loader: false,
            alert: {},
            edit_med: true,
            has_selected_medicine: false,
            medicine_removed: false,
            has_edited_medicine: false,
            disable_edit: false
        }
    },

    watch: {
        has_selected_medicine() {},
        medicine_removed() {},
        has_edited_medicine() {},
        tbl_items: {
            handler() {},
            deep: true
        }
    },
 
    methods: {
        openViewMedicine(data) {
            this.patient_name = data.patient_name;
            this.tbl_items = data.medicines.map(data => ({
                ...data,
                dispensed_medicine_status: data.dispensed_medicine_status === 'RX Issued' ? 'Not Served/RX Issued' : data.dispensed_medicine_status,
                default_dispensed_medicine_status: data.dispensed_medicine_status,
                default_total_dispensed_medicine: data.total_dispensed_medicine
            }));
            this.transaction_number = data.transaction_number;
            this.doctor_name = data.doctor_name;
            this.patient_address = data.patient_address;
            this.patient_age = data.patient_age;
            this.date_admitted = data.date_admitted;
            this.doctor_prc_license = data.doctor_prc_license;
        },
        handleSelectMedicine(index, item) {
            this.has_selected_medicine = true;
            this.$refs.otc_medicine.getOTCMedicine(index, item);
        },
        handleEditMedicine(index, item, edit_med){
            this.has_edited_medicine = true;
            this.$refs.otc_medicine.editOTCMedicine(index, item, edit_med)
        },
        /*updateMedicine1(data) {
            if (data.otc_quantity && data.otc_medicine) {
                this.tbl_items[data.index].otc_medicine = data.otc_medicine
                this.tbl_items[data.index].total_dispensed_medicine = data.otc_quantity
            } else {
                this.removeMedicine(data.index)
            }
        },*/

        updateMedicine(data) {
            if (data.otc_quantity && data.otc_medicine) {
                const item = this.tbl_items[data.index];
                item.otc_medicine = data.otc_medicine;
                item.total_dispensed_medicine = data.otc_quantity;
                item.dispensed_medicine_name = data.otc_medicine?.generic_name;
                item.lot_no = data.otc_medicine?.lot_no;

                if (Number(item.total_dispensed_medicine) === Number(item.total_prescribed_medicine) || Number(item.total_dispensed_medicine) !== Number(item.total_prescribed_medicine)) {
                    item.dispensed_medicine_status = "Pending"
                }

            } else {
                this.removeMedicine(data.index);
            }
        },
        
        removeMedicine(index) {
            this.medicine_removed = true;
            this.has_selected_medicine = false;
            this.has_edited_medicine = false;
            this.disable_edit = true;
            delete this.tbl_items[index].otc_medicine;
            this.tbl_items[index].total_dispensed_medicine = '';

            if(this.tbl_items[index].default_dispensed_medicine_status === 'Partially Served') {
                this.tbl_items[index].total_dispensed_medicine  = this.tbl_items[index].default_total_dispensed_medicine;
                this.tbl_items[index].available_to_dispensed = parseInt(this.tbl_items[index].total_prescribed_medicine) - parseInt(this.tbl_items[index].default_total_dispensed_medicine);
            }
        },

        async dispenseMedicine() {
            this.dispense_btn_loader = true
            
            // FILTER DATA
            const medicine_data = this.tbl_items.filter(items => items.otc_medicine && items.total_dispensed_medicine).map(data => {
                return {
                    total_prescribed_medicine: data.total_prescribed_medicine,
                    requested_quantity: data.total_dispensed_medicine,
                    medicine_code: data.otc_medicine.otc_medicine_code,
                    generic_name : data.otc_medicine.generic_name,
                    lot_no: data.lot_no,
                    transaction_patient_medicine_id: data.transaction_patient_medicine_id,
                    dispensing_personnel: this.$store.state.usr_credentials.user_name,
                    reason_for_adjustment: 'DISPENSED'
                }
            })

            // VALIDATE IF THE MEDICINE TO BE DISPENSED IS GREATER THAN THE PRESCRIBE MEDICINE
            if (medicine_data.some(item => Number(item.requested_quantity) > Number(item.total_prescribed_medicine))) {
                this.alert = {display: true, type: 'standard',  width: 700,  icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'You cannot dispense medicine greater than the prescribed medicine',  body: 'Please Try Again.', btn_pry_txt: 'OK',  btn_pry_color: 'primary',  btn_pry_otl: false,  btn_pry_act: 'closeAlert' }
                return  this.dispense_btn_loader = false
            }
            // VALIDATE IF MEDICINE IS: SUFFICIENT, FAILED, SUCCESS
            const return_med_data = await this.adjustMedicineQuantity(medicine_data)
            if (!return_med_data) return this.dispense_btn_loader = false
            
            const provider_reg_type = this.$store.state.usr_credentials.provider_reg_type;

            let response = await this.$services.trnUpdateTransactionMedicine({
                ...(provider_reg_type === 'PVT' && { pvt_provider_code: this.$store.state.prv_data.provider_code }),
                transaction_number: this.transaction_number,
                data: return_med_data,
            })

            if(response.status === 200) {
                // Update the status of each item in tbl_items
                // return_med_data.forEach(item => {
                //     const medicine = this.tbl_items.find(tbl_item => tbl_item.transaction_patient_medicine_id === item.transaction_patient_medicine_id);
                //     if (medicine) {
                //         const total_dispensed = Number(medicine.total_dispensed_medicine);
                //         const total_prescribed = Number(medicine.total_prescribed_medicine);

                //         if (total_dispensed === total_prescribed) {
                //             medicine.dispensed_medicine_status = "Fully Served";
                //         } else if (total_dispensed > 0 && total_dispensed < total_prescribed) {
                //             medicine.dispensed_medicine_status = "Partially Served";
                //         } else {
                //             medicine.dispensed_medicine_status = "Not Served";
                //         }
                //     }
                // });

                const msg_body = "<div class='my-3'><h6 class='body-2 font-weight-medium  mb-3'>"+return_med_data.map((item,index) => index + 1 +') '+item.generic_name + ' - LOT# ' +item.lot_no).join('<br/>')+"</h6></div>"
                return this.alert = {display: true,  type: 'standard',  width: 650, icon: 'mdi-check-circle',  color: 'success',  title: 'Successfully dispensed the following medicine:',  body: msg_body,btn_pry_txt: 'OK',  btn_pry_emt: 'closeViewMedicine', btn_pry_params: return_med_data ,btn_pry_color: 'primary',  btn_pry_otl: false,  btn_pry_act: 'reloadPage' }
            } else {
                this.alert = response.error
            }
        },

        async adjustMedicineQuantity(adjusted_qty) {
            let response = await this.$services.trnAdjustMedicineQuantity({
                provider_code: this.$store.state.prv_data.provider_code,
                data: adjusted_qty,
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                
                // IF ALL OF MEDICINE RETURN STATUS IS SUCCESS (return medicine_data)
                if (Object.entries(response.data).every(items => items[1].status === 'success')) {
                    return adjusted_qty.map(items => {
                        return {
                            otc_medicine_code: items.medicine_code,
                            lot_no: items.lot_no,
                            generic_name: items.generic_name,
                            total_dispensed_medicine: items.requested_quantity,
                            transaction_patient_medicine_id: items.transaction_patient_medicine_id,
                            dispensing_personnel: this.$store.state.usr_credentials.user_name
                        }
                    })
                }

                // IF SOME OF MEDICINE RETURN STATUS IS FAILED
                if (Object.entries(response.data).some(items => items[1].status === 'failed')) {
                    this.alert = { display: true,  type: 'standard',  width: '350',  icon: 'mdi-alert-circle',  color: 'red',  title: 'Network Error',  body: 'Please try again',  btn_pry_txt: 'OK',  btn_pry_color: 'primary',  btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                    return false
                }

                // IF SOME OF MEDICINE RETURN STATUS IS INSUFFICIENT
                let get_medicine_code = [], insufficient_qty = []

                Object.entries(response.data).map(items =>{
                    if (items[1].status === 'insufficient') {
                        get_medicine_code.push(items[0])

                        insufficient_qty.push({medicine_code: items[0],  current_quantity: items[1].current_quantity ? items[1].current_quantity : 0})
                    } 
                })

                adjusted_qty.filter(medicine => get_medicine_code.includes(medicine.medicine_code)).map((item,key) => {
                    insufficient_qty[key].generic_name = item.generic_name
                    return item
                })
 
                const msg_body_insufficient = "<div class='my-3'><h6 class='body-2 font-weight-medium  mb-3'>"+insufficient_qty.map((item,index) => index + 1 +') '+item.generic_name +': (<span class="body-2">Remaining Qty: <b class="ml-auto">'+item.current_quantity+'</b>)</span>').join('<br/>')+"</h6></div>"

                const note = "<div class='mt-3 caption'><i>Note: Quantity may be changed after other users dispensed the same medicine</i></div>"
                
                this.alert = {display: true,  type: 'standard',  width: 650,  icon: 'mdi-alert-circle', color: 'yellow darken-1',  title: 'The following medicine has insufficient quantity: ',  body: `${msg_body_insufficient} ${note}`, btn_pry_txt: 'OK',  btn_pry_color: 'primary',  btn_pry_otl: false,  btn_pry_act: 'closeAlert'}
                return false
            } else {
                this.alert = response.error
            }
        },

        closeViewMedicine(medicine_data) {
            this.dispense_btn_loader = false
         
            const get_trans_id_array = medicine_data.map(item => item.transaction_patient_medicine_id)

            this.tbl_items.filter(item => get_trans_id_array.includes(item.transaction_patient_medicine_id)).map((data, index) => {
                delete data.otc_medicine
                data.status = '1'
                data.total_dispensed_medicine = medicine_data[index].total_dispensed_medicine
                data.dispensed_medicine_name = medicine_data[index].generic_name
                return data
            })
        },

        closeDialog() {
            this.$emit('closeViewMedicine');
            this.has_selected_medicine = false;
            this.has_edited_medicine = false;
            this.medicine_removed = false;
        },

        statusClass(status) {
            if (status === "Not Served" || status === "Not Served/RX Issued") {
                return "red--text";
            } else if (status === "Partially Served/RX Issued" || status === "Partially Served") {
                return "orange--text";
            } else if (status === "Fully Served") {
                return "green--text";
            } else if (status === "Pending") {
                return "yellow--text text--darken-2";
            }
        },

        viewTreatmentPlan() {
            const data = {
                patient_name: this.patient_name,
                selected_medicine: this.tbl_items,
                doctor_name: this.doctor_name,
                transaction_number: this.transaction_number,
                is_treatment_plan: true,
                patient_address : this.patient_address,
                patient_age : this.patient_age,
                date_admitted : this.date_admitted,
                doctor_prc_license : this.doctor_prc_license,
            };
            this.$refs.treatment_plan.openDialog(data);
        },

        //UPDATE THE TABLE (STATUS) OF DISPENSED MEDICINE FOR RX ISSUED ONLY
        mutations(value){
            this.tbl_items = value
        }
    }
}
</script>

<style scoped>
/* .text-success {
    color: green;
    font-weight: bold;
}

.text-warning {
    color: orange;
    font-weight: bold;
}

.text-error {
    color: red;
    font-weight: bold;
} */
 
::v-deep .v-dialog {
    box-shadow: none;
}
@media print {
  ::v-deep #not-for-print {
    display: none !important;
  }
}

</style>