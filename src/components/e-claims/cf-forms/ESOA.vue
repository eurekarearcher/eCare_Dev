<template>
    <div class="esoa esoa-border">
        <v-row class=" ma-0 pa-0">
            <v-col cols="12" class="text-center  ma-0 pa-0 pt-4"><h3 class="ma-0 pa-0">Statement of Account</h3></v-col>
            <v-col cols="12" xs="6" sm="6" md="6" lg="6" xl="6" class=" ma-0 pa-0">
                <v-img src="@/assets/philhealth.png" class="image_logo" lazy-src="@/assets/philhealth.png"></v-img>
            </v-col>
            <v-col cols="12" xs="6" sm="6" md="6" lg="6" xl="6" class="d-flex justify-end align-center  ma-0 pa-0">
                <label class="mr-2 font-weight-bold text-large ma-0 pa-0" style="white-space: nowrap;">SOA Reference No:</label>
                <v-text-field :value="this.esoa_data2.REFERENCE_NO" readonly dense hide-details style="max-width: 250px;"></v-text-field>
            </v-col>

            <v-col cols="12" class="text-center ma-0 pa-2 pb-2">
                <h4>{{ this.esoa_data.provider }}</h4> 
                <h4>{{ this.esoa_data.address}}</h4>
                <h4>{{ this.esoa_data.prv_tel_no}}</h4>
            </v-col>
        </v-row> 
        <v-row  class="text-medium ma-0 pa-0 pt-4"> 
            <v-col cols="12" xs="8" sm="8" md="8" lg="8" xl="8" class="ma-0 pa-0">
                <label v-if="this.esoa_data.PRINCIPAL_DATA"><b>Print Name:</b> <span class="border-bottom mr-1"> {{ this.esoa_data.PRINCIPAL_DATA.first_name + ' ' + this.esoa_data.PRINCIPAL_DATA.middle_name + ' ' + this.esoa_data.PRINCIPAL_DATA.last_name }} </span></label>
                <label v-if="this.esoa_data.PRINCIPAL_DATA"><b>Age:</b> <span  class="border-bottom"> {{  this.esoa_data.PRINCIPAL_DATA.age }}</span> </label> <br>
                <label v-if="this.esoa_data.PRINCIPAL_DATA"><b>Address:</b> <span class="border-bottom"> {{ this.esoa_data.PRINCIPAL_DATA.mailing_add }} </span></label> <br>
            </v-col>
            <v-col cols="12" xs="4" sm="4" md="4" lg="4" xl="4" class="justify-right text-left ma-0 pa-0">
                <label><b>Date and Time Admitted:</b> <span class="border-bottom"> {{ admitted_date_time }} </span></label> <br>
                <label><b>Date and Time Discharged:</b> <span  class="border-bottom">{{ discharged_date_time }}</span> </label>
            </v-col> 
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" class="ma-0 pa-0 pt-2">
                <div v-if="esoa_data && esoa_data.DISCHARGED_DIAGNOSIS && esoa_data.DISCHARGED_DIAGNOSIS.PRIMARY && esoa_data.DISCHARGED_DIAGNOSIS.PRIMARY.length">
                    <label><b>Final Diagnosis (ICD-10/RVS):</b> 
                        <span class="border-bottom"> 
                            {{ this.esoa_data.DISCHARGED_DIAGNOSIS.PRIMARY[0].icd_code + ' ' + this.esoa_data.DISCHARGED_DIAGNOSIS.PRIMARY[0].icd_description }} 
                        <span v-if="esoa_data.DISCHARGED_DIAGNOSIS.PRIMARY[0].procedure.length">
                            / {{ this.esoa_data.DISCHARGED_DIAGNOSIS.PRIMARY[0].procedure[0].cpt_code + ' ' + this.esoa_data.DISCHARGED_DIAGNOSIS.PRIMARY[0].procedure[0].cpt_description}} 
                        </span>
                    </span>
                    </label>
                </div>

               <div v-if="esoa_data && esoa_data.DISCHARGED_DIAGNOSIS && esoa_data.DISCHARGED_DIAGNOSIS.SECONDARY && esoa_data.DISCHARGED_DIAGNOSIS.SECONDARY.length">
                    <div v-for="(diagnosis, index) in this.esoa_data.DISCHARGED_DIAGNOSIS.SECONDARY" :key="'secondary-' + index" class="d-flex">
                        <label v-if="index === 0" style="white-space: nowrap; font-weight: bold;">
                        Other Diagnosis (ICD-10/RVS):
                        </label>

                        <span v-else style="width: 180px;"></span> 

                        <div>
                            <span class="border-bottom">
                                {{ index + 1 + '. ' + diagnosis.icd_code + ' ' + diagnosis.icd_description }}
                            </span>
                            <span v-for="(procedure, pIndex) in diagnosis.procedure" :key="'proc-s-' + pIndex" class="border-bottom">
                                {{ ' / ' + procedure.cpt_code + ' ' + procedure.cpt_description }}
                            </span>
                        </div>
                    </div>
                </div>

                <div v-if="esoa_data && esoa_data.DISCHARGED_DIAGNOSIS && esoa_data.DISCHARGED_DIAGNOSIS.OTHERS && esoa_data.DISCHARGED_DIAGNOSIS.OTHERS.length && esoa_data.DISCHARGED_DIAGNOSIS.OTHERS[0].procedure.length">
                    <div v-for="(diagnosis, index) in this.esoa_data.DISCHARGED_DIAGNOSIS.OTHERS" :key="'other-' + index" class="d-flex">
                        <span class="span1"></span>
                        <div>
                            <span class="border-bottom">
                                {{ esoa_data.DISCHARGED_DIAGNOSIS.SECONDARY.length + index + 1 + '. ' + diagnosis.icd_code + ' ' + diagnosis.icd_description + ' / ' }}
                            </span>
                            <span v-for="(procedure, pIndex) in diagnosis.procedure" :key="'proc-o-' + pIndex" class="border-bottom">
                                {{ procedure.cpt_code + ' ' + procedure.cpt_description }}
                            </span>
                        </div>
                    </div>
                </div>

            </v-col>
        </v-row>
        
        <v-row class="ma-0 pa-0">
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" class=" ma-0 pa-0">
                <h4  class="text-center ma-0 pa-1 pt-4">Summary of Fees</h4>
                <v-data-table :headers="summary_of_fees_header" :items="summary_of_fees" :loading="summary_of_fees_loading" class="no-header-color custom-table text-left ma-0 pa-0" hide-default-footer>
                    <template v-slot:item.fee_particulars="{ item }">
                        <div class="text-left text-large pl-2">{{ item.fee_particulars }}</div>
                    </template>

                    <template v-slot:item.amount="{ item }">
                        <div class="text-left">{{ formatAmountCurrency(item.amount) }}</div>
                    </template>

                    <template v-slot:item.mandatory_discount="{ item }">
                        <div class="text-left">{{ formatNegativeCurrency(item.mandatory_discount) }}</div>
                    </template>

                    <template v-slot:item.other_sources="{ item }">
                        <div class="text-left">{{ formatNegativeCurrency(item.other_sources) }}</div>
                    </template>

                    <template v-slot:item.balance>
                        <div class="text-left">-</div>
                    </template>

                    <!-- TOTAL ROW -->
                    <template v-slot:body.append>
                        <tr v-if="esoa_data.TOTAL_SUMMARY_OF_FEES && esoa_data"> 
                            <td><strong class="pl-2">Total</strong></td>
                            <td><strong>{{ formatAmountCurrency(esoa_data.TOTAL_SUMMARY_OF_FEES.total_amount) || 0}}</strong></td>
                            <td><strong>{{ formatNegativeCurrency(esoa_data.TOTAL_SUMMARY_OF_FEES.total_mandatory_discount) || 0 }}</strong></td>
                            <td><strong>{{ formatNegativeCurrency(esoa_data.TOTAL_SUMMARY_OF_FEES.total_philhealth) || 0 }}</strong></td>
                            <td><strong>{{ formatNegativeCurrency(esoa_data.TOTAL_SUMMARY_OF_FEES.total_other_sources) || 0 }}</strong></td>
                            <td><strong>{{ formatAmountCurrency(esoa_data.TOTAL_SUMMARY_OF_FEES.total_balance) || 0 }}</strong></td>
                        </tr>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <v-row class="ma-0 pa-0"> 
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" class="ma-0 pa-0">
                <h4 class="ma-0 pa-1 text-center">Professional Fees</h4>
                
                <v-data-table :headers="professional_fees_header" :items="professional_fees" :loading="professional_fee_loading" :items-per-page="-1" class="no-header-color custom-table text-left ma-0 pa-0" hide-default-footer>

                    <template v-slot:item.amount="{ item }">
                        <div class="text-left">{{ formatAmountCurrency(item.amount) }}</div>
                    </template>

                    <template v-slot:item.discount="{ item }">
                        <div class="text-left">{{ formatNegativeCurrency(item.discount) }}</div>
                    </template>

                    <template v-slot:item.philhealth="{ item }">
                        <div class="text-left">{{ formatNegativeCurrency(item.philhealth) }}</div>
                    </template>

                    <template v-slot:item.other_sources="{ item }">
                        <div class="text-left">{{ formatNegativeCurrency(item.other_sources) }}</div>
                    </template>

                    <template v-slot:item.balance="{ item }">
                        <div class="text-left">{{ formatAmountCurrency(item.balance) }}</div>
                    </template>

                    <!-- TOTAL ROW -->
                    <template v-slot:body.append>
                        <tr v-if="esoa_data.PROFESSIONAL_FEES && esoa_data">
                            <td colspan="6"><div class="text-left text-large ma-2"><strong>Total</strong></div></td>
                            <td class="text-left"><strong>{{ formatAmountCurrency(esoa_data.PROFESSIONAL_FEES[0].balance) || 0 }}</strong></td>
                        </tr>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        
        <v-row  class=" ma-0 pa-0">
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" class=" ma-0 pa-0">
                <h4 class="ma-0 pa-1 bottom-sp text-center">Itemized Charges</h4>
                
                <v-data-table :headers="itemized_charges_header" :items="itemized_charges" :loading="itemized_loading" :items-per-page="-1" class="no-header-color custom-table text-left ma-0 pa-0" hide-default-footer>
                    
                    <template v-slot:item.price="{ item }">
                        <div class="text-left">{{ formatAmountCurrency(item.price) }}</div>
                    </template>

                    <template v-slot:item.quantity="{ item }">
                        <div class="text-left">{{ formatQuantity(item.quantity) }}</div>
                    </template>

                    <template v-slot:item.amount="{ item }">
                        <div class="text-left">{{ formatAmountCurrency(item.amount) }}</div>
                    </template>
                    
                    <!-- TOTAL ROW -->
                    <template v-slot:body.append>
                        <tr>
                            <td colspan="5"><div class="text-left text-large ma-2"><strong>Total</strong></div></td>
                            <td><div class="text-left"><strong>{{ total_itemized_amount }}</strong></div></td>
                        </tr>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <v-row  class="wrap ma-0 pa-0 pt-6 pb-10 text-medium">
            <v-col cols="12" xs="5" sm="5" md="5" lg="5" xl="5" class="text-left ma-0 pa-0">
                <label class="font-weight-bold">Prepared by:</label>
                <div class="ma-0 pa-0">
                    <img v-if="trans_detail.hci_sign_path" :src="esoa_data.TRANSACTION.hci_sign_path" alt="Signature" width="100" height="auto" class="ma-0 pa-0"/>
                </div>
                <div class="ma-0 pa-0">
                    <strong>{{ this.$store.state.usr_credentials.user_complete_name }}</strong>
                </div>
                <div class="ma-0 pa-0" style="border-top:1px solid black; width:70%">
                    <label class="ma-0 pa-0 font-weight-bold">Billing Clerk / Accountant</label><br>
                    <label class=" ma-0 pa-0">(Signature over Printed Name)</label>
                </div>
                <label v-if="this.esoa_data && this.esoa_data.SIGNATURE"><b>Date Signed:</b> <span class="border-bottom">{{ this.esoa_data.SIGNATURE.hospital_date_signed }}</span></label><br>
                <label><b>Contact No.:</b> <span class="border-bottom"></span></label>
            </v-col>
            <v-col cols="12" xs="7" sm="7" md="7" lg="7" xl="7" class="text-left  ma-0 pa-0">
                <label class="font-weight-bold">Conforme:</label>
                <div class="ma-0 pa-0">
                    <img v-if="trans_detail.patient_sign_path" :src="esoa_data.TRANSACTION.patient_sign_path" alt="Signature" width="100" height="auto" class="ma-0 pa-0"/>
                </div>
                <div class="ma-0 pa-0" v-if="this.esoa_data.PRINCIPAL_DATA "> 
                    <strong>{{ this.esoa_data.PRINCIPAL_DATA.first_name + ' ' + this.esoa_data.PRINCIPAL_DATA.middle_name + ' ' + this.esoa_data.PRINCIPAL_DATA.last_name  }}</strong>
                </div>
                <div class="ma-0 pa-0" style="border-top:1px solid black; width:100%">
                    <label class="ma-0 pa-0 font-weight-bold">Patient / Representative</label><br>
                    <label class="ma-0 pa-0">(Signature over Printed Name)</label>
                </div>
                <div v-if="this.esoa_data">
                    <label v-if="this.esoa_data.PATIENT_DATA"><b>Relationship of representative to patient:</b> <span class="border-bottom">{{ this.esoa_data.PATIENT_DATA.rel_to_patient }}</span></label><br>
                    <label v-if="this.esoa_data.SIGNATURE"><b>Date Signed:</b> <span class="border-bottom">{{ this.esoa_data.SIGNATURE.patient_date_signed }}</span></label><br>
                    <label v-if="this.esoa_data.PRINCIPAL_DATA"><b>Contact No.:</b> <span class="border-bottom">{{ this.esoa_data.PRINCIPAL_DATA.mobile_no}}</span></label>
                </div> 
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    props:["menu", "esoa_data","esoa_data2", "admitted_datetime", "discharged_datetime"],

    data(){
        return{
            is_printing: false,
            trans_detail: JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('QesRTe3j4fs3'), 'jri6F9dO').toString(this.$crypto.enc.Utf8)),
            summary_of_fees_header: [
                { text: 'Fee Particulars', value: 'fee_particulars', width:'140px', sortable: false, align:'center' },
                { text: 'Amount', value: 'amount', width:'100px', sortable: false, align:'center' },
                { text: 'Mandatory Discount', value: 'mandatory_discount', width:'100px', sortable: false, align:'center' },
                { text: 'Philhealth', value: 'philhealth', width:'100px', sortable: false, align:'center' },
                { text: 'Other Funding Sources', value: 'other_sources', width:'100px', sortable: false, align:'center' },
                { text: 'Balance', value: 'balance', width:'100px', sortable: false, align:'center' }
            ],
           summary_of_fees: [],
            
            total_summary_of_fees_data: [],
            professional_fees_header: [
                { text: 'Physician Accreditation Number', value: 'physician_accre_no', width:'100px', sortable: false, align:'left' },
                { text: 'Physician Name', value: 'physician_name', width:'230px', sortable: false, align:'left' },
                { text: 'Amount', value: 'amount', width:'100px', sortable: false, align:'left' },
                { text: 'Discount', value: 'discount', width:'100px', sortable: false, align:'left' },
                { text: 'Philhealth', value: 'philhealth', width:'100px', sortable: false, align:'left' },
                { text: 'Other Funding Sources', value: 'other_sources', width:'100px', sortable: false, align:'left' },
                { text: 'Balance', value: 'balance', width:'110px', sortable: false, align:'left' },
            ],
           professional_fees: [],
            
            itemized_charges_header: [
                { text: 'Service Date', value: 'service_date', width:'100px', sortable: false, align:'left' },
                { text: 'Item Name', value: 'item_name', width:'260px', sortable: false, align:'left' },
                { text: 'Unit of Measurement', value: 'unit_of_measurement', width:'100px', sortable: false, align:'left' },
                { text: 'Price', value: 'price', width:'100px', sortable: false, align:'left' },
                { text: 'Quantity', value: 'quantity', width:'100px', sortable: false, align:'left' },
                { text: 'Amount', value: 'amount', width:'100px', sortable: false, align:'left' },

            ],
            itemized_charges:[],
            patient_data: [],
            max_date:  this.$moment().format('YYYY-MM-DD'),
            summary_of_fees_loading: false,
            professional_fee_loading: false,
            itemized_loading: false
        }
    },

    computed: {
        admitted_date_time() {
            if (!this.admitted_datetime) return ''
            const [datePart, timePart] = this.admitted_datetime.split('/')
            const [month, day, year] = datePart.split('-')
            const [hour, minute, second] = timePart.split(':')

            const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)

            const formatted_date = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })

            const formatted_time = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })

            return `${formatted_date} / ${formatted_time}`
        },

        discharged_date_time() {
            if (!this.discharged_datetime) return ''
            const [datePart, timePart] = this.discharged_datetime.split('/')
            const [month, day, year] = datePart.split('-')
            const [hour, minute, second] = timePart.split(':')

            const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)

            const formatted_date = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })

            const formatted_time = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })

            return `${formatted_date} / ${formatted_time}`
        },
        total_itemized_amount() {
            const total = this.itemized_charges.reduce((sum, item) => {
                const price = Number(item.price || 0);
                const quantity = Number(item.quantity || 0);
                return sum + (price * quantity);
            }, 0);

            return total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }

    },

    watch: {
        esoa_data: {
            handler(new_value) {
                if (new_value) {
                    this.getBillingData(); 
                }
            }
        }
    },

    created(){
        this.getBillingData();
    },

    methods: {
        formatAmountCurrency(value) {
            const num = Number(value) || 0;

            return num.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }, 

        formatNegativeCurrency(value) {
            const num = Number(value) || 0;
            return `(${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
        }, 

        formatQuantity(value) {
            const num = Number(value) || 0;

            return num.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        },

        getBillingData(){
            this.summary_of_fees_loading = true
            this.professional_fee_loading = true
            this.itemized_loading = true
            
            if(!this.esoa_data){
                let esoa =  localStorage.getItem('so3hPiy') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('so3hPiy'),'kHUBGHi9').toString(this.$crypto.enc.Utf8)) : null
                this.esoa_data = esoa;            
            }
            if (this.esoa_data.SUMMARY_OF_FEES) {
                this.summary_of_fees = this.esoa_data.SUMMARY_OF_FEES.map(item => ({
                    fee_particulars: item.fee_particulars,
                    amount: Number(item.charges_net_of_applicable_vat),
                    mandatory_discount: Number(item.mandatory_discount),
                    mandatory_discount_type: item.mandatory_discount_type || '',
                    philhealth: '-', 
                    other_sources: ['pcso', 'dswd', 'doh_map', 'hmo', 'other_fund_amount'].reduce((sum, key) => sum + (Number(item[key]) || 0), 0),
                    balance: this.esoa_data.TOTAL_SUMMARY_OF_FEES.total_balance,
                }));

                this.summary_of_fees_loading = false;
            }
            // if(this.esoa_data.summary_of_fees){
            //     this.summary_of_fees = [
            //         {
            //             fee_particulars: 'Room and Board',
            //             amount: Number(this.esoa_data.summary_of_fees.RoomAndBoard.charges_net_of_applicable_vat),
            //             mandatory_discount: Number(this.esoa_data.summary_of_fees.RoomAndBoard.senior_citizen_discount) +
            //                                 Number(this.esoa_data.summary_of_fees.RoomAndBoard.pwd_discount),
            //             philhealth: '-',
            //             other_sources:
            //                 Number(this.esoa_data.summary_of_fees.RoomAndBoard.pcso) +
            //                 Number(this.esoa_data.summary_of_fees.RoomAndBoard.dswd) +
            //                 Number(this.esoa_data.summary_of_fees.RoomAndBoard.doh_map) +
            //                 Number(this.esoa_data.summary_of_fees.RoomAndBoard.hmo) +
            //                 Number(this.esoa_data.summary_of_fees.OtherFundSource.RoomAndBoard ? this.esoa_data.summary_of_fees.OtherFundSource.RoomAndBoard.pAmount : 0),
            //             balance: Number(this.esoa_data.summary_of_fees.RoomAndBoard.balance),
            //         },
            //         {
            //             fee_particulars: 'Drugs and Medicine',
            //             amount: Number(this.esoa_data.summary_of_fees.DrugsAndMedicine.charges_net_of_applicable_vat),
            //             mandatory_discount: Number(this.esoa_data.summary_of_fees.DrugsAndMedicine.senior_citizen_discount) +
            //                                 Number(this.esoa_data.summary_of_fees.DrugsAndMedicine.pwd_discount),
            //             philhealth: '-',
            //             other_sources:
            //                 Number(this.esoa_data.summary_of_fees.DrugsAndMedicine.pcso) +
            //                 Number(this.esoa_data.summary_of_fees.DrugsAndMedicine.dswd) +
            //                 Number(this.esoa_data.summary_of_fees.DrugsAndMedicine.doh_map) +
            //                 Number(this.esoa_data.summary_of_fees.DrugsAndMedicine.hmo),
            //             balance: Number(this.esoa_data.summary_of_fees.DrugsAndMedicine.balance),
            //         },
            //         {
            //             fee_particulars: 'Laboratory and Diagnostic',
            //             amount: Number(this.esoa_data.summary_of_fees.LaboratoryAndDiagnostic.charges_net_of_applicable_vat),
            //             mandatory_discount: Number(this.esoa_data.summary_of_fees.LaboratoryAndDiagnostic.senior_citizen_discount) +
            //                                 Number(this.esoa_data.summary_of_fees.LaboratoryAndDiagnostic.pwd_discount),
            //             philhealth: '-',
            //             other_sources:
            //                 Number(this.esoa_data.summary_of_fees.LaboratoryAndDiagnostic.pcso) +
            //                 Number(this.esoa_data.summary_of_fees.LaboratoryAndDiagnostic.dswd) +
            //                 Number(this.esoa_data.summary_of_fees.LaboratoryAndDiagnostic.doh_map) +
            //                 Number(this.esoa_data.summary_of_fees.LaboratoryAndDiagnostic.hmo),
            //             balance: Number(this.esoa_data.summary_of_fees.LaboratoryAndDiagnostic.balance),
            //         },
            //         {
            //             fee_particulars: 'Operating Room',
            //             amount: Number(this.esoa_data.summary_of_fees.OperatingRoomFees.charges_net_of_applicable_vat),
            //             mandatory_discount: Number(this.esoa_data.summary_of_fees.OperatingRoomFees.senior_citizen_discount) +
            //                                 Number(this.esoa_data.summary_of_fees.OperatingRoomFees.pwd_discount),
            //             philhealth: '-',
            //             other_sources:
            //                 Number(this.esoa_data.summary_of_fees.OperatingRoomFees.pcso) +
            //                 Number(this.esoa_data.summary_of_fees.OperatingRoomFees.dswd) +
            //                 Number(this.esoa_data.summary_of_fees.OperatingRoomFees.doh_map) +
            //                 Number(this.esoa_data.summary_of_fees.OperatingRoomFees.hmo),
            //             balance: Number(this.esoa_data.summary_of_fees.OperatingRoomFees.balance),
            //         },
            //         {
            //             fee_particulars: 'Medical Supplies',
            //             amount: Number(this.esoa_data.summary_of_fees.MedicalSupplies.charges_net_of_applicable_vat),
            //             mandatory_discount: Number(this.esoa_data.summary_of_fees.MedicalSupplies.senior_citizen_discount) +
            //                                 Number(this.esoa_data.summary_of_fees.MedicalSupplies.pwd_discount),
            //             philhealth: '-',
            //             other_sources:
            //                 Number(this.esoa_data.summary_of_fees.MedicalSupplies.pcso) +
            //                 Number(this.esoa_data.summary_of_fees.MedicalSupplies.dswd) +
            //                 Number(this.esoa_data.summary_of_fees.MedicalSupplies.doh_map) +
            //                 Number(this.esoa_data.summary_of_fees.MedicalSupplies.hmo),
            //             balance: Number(this.esoa_data.summary_of_fees.MedicalSupplies.balance),
            //         },
            //     ];
                
            //     this.summary_of_fees_loading= false;
            // }
            if (this.esoa_data.PROFESSIONAL_FEES) {
                this.professional_fees = this.esoa_data.PROFESSIONAL_FEES.map(doc => ({
                    physician_accre_no: doc.physician_accre_no || '',
                    physician_name: doc.physician_name || '',
                    amount: Number(doc.amount || 0),
                    discount: Number(doc.mandatory_discount || 0),
                    philhealth: Number(doc.philhealth || 0),
                    other_sources: Number(doc.pcso || 0) + Number(doc.doh_map || 0) + Number(doc.hmo || 0) + Number(doc.dswd || 0),
                    balance: Number(doc.balance || 0),
                }));

                this.professional_fee_loading = false;
            }
            
            // if(this.esoa_data.professional_fee){
            //     this.professional_fees = this.esoa_data.professional_fee.map(doc => ({
            //         physician_accre_no: doc.doctor_accre_no || '',
            //         physician_name: `${doc.doctor_first_name} ${doc.doctor_middle_name} ${doc.doctor_last_name}${doc.doctor_suffix !== 'NA' ? ', ' + doc.doctor_suffix : ''}`.trim(),
            //         amount: Number(doc.charges_net_of_applicable_vat),
            //         discount: Number(doc.senior_citizen_discount) + Number(doc.pwd_discount),
            //         philhealth: Number(doc.prof_total_case_rate_amount),
            //         other_sources: (Number(doc.pcso)) + (Number(doc.doh_map)) + (Number(doc.hmo)) + (Number(doc.dswd)),
            //         balance: Number(doc.prof_balance)
            //     }));
                
            //     this.professional_fee_loading= false;
            // }

            
            // if(this.esoa_data.itemized_billing){
            //     this.itemized_charges = [
            //     ...this.esoa_data.itemized_billing
            //     ].map(item => ({
            //         service_date: item.service_date,
            //         item_name: item.item_name,
            //         unit_of_measurement: item.unit_of_measurement,
            //         price: Number(item.unit_price),
            //         quantity: Number(item.quantity),
            //         amount: Number(item.total_amount)
            //     }));
                
            //     this.itemized_loading = false;
            // }

            if (this.esoa_data2) {
                const diagnoses = [
                    ...(this.esoa_data2.DISCHARGED_DIAGNOSIS.PRIMARY || []),
                    ...(this.esoa_data2.DISCHARGED_DIAGNOSIS.SECONDARY || [])
                ];

                this.itemized_charges = [
                    
                    ...(this.esoa_data2.MEDICAL_SUPPLIES || []).map(item => ({
                        service_date: item.service_date || '',
                        item_name: item.item_desc || '',
                        unit_of_measurement: item.unit_of_measurement || '',
                        price: Number(item.amount || 0), 
                        quantity: Number(item.quantity || 0),
                        amount: Number(item.total || 0),
                    })),
                    ...(this.esoa_data2.MEDICINE || []).map(med => ({
                        service_date: med.service_date || '',
                        item_name: med.generic_name || '',
                        unit_of_measurement: med.unit_type || '',
                        price: Number(med.amount || 0),
                        quantity: Number(med.quantity || 0),
                        amount: Number(med.total || 0),
                    })),
                    ...(diagnoses || []).flatMap(med => (med.procedure || []).map(proc => ({
                            service_date: proc.procedure_date || '',
                            item_name: proc.item_name || proc.cpt_description || '',
                            unit_of_measurement: proc.laterality || '',
                            price: Number(proc.procedure_amount || 0),
                            quantity: 1, 
                            amount: Number(proc.procedure_amount || 0),
                        }))
                    ),
                    ...(this.esoa_data.SUMMARY_OF_FEES).filter(item => item.fee_particulars === 'Room and Board' || item.fee_particulars === 'Operating Room').map(item => ({
                        service_date: this.newFormatDate(this.discharged_date_time) || '',
                        item_name: item.fee_particulars,
                        price: Number(item.charges_net_of_applicable_vat || 0),
                        quantity: 1,
                        amount: Number(item.charges_net_of_applicable_vat || 0),
                    }))
                ];
                this.itemized_loading = false;
            }
        }
    }
}
</script>

<style scoped>
    @media print{
        .text-medium{
            font-size: 11px !important;
        }

        .text-large{
            font-size: 13px !important;
        }
        
        .image_logo{
            width:150px !important;
            height:50px !important;
        }

        .hide-print{
            display: none !important;
        }

        .custom-table >>> .v-data-table-header th{
            padding: 0 !important; 
            font-size: 12px;    
            line-height: .9 !important;  
            margin: 0 !important;   
            height: 30px !important;
        }

        .custom-table, .custom-table >>> td, .custom-table >>> th  {
            border: 1px solid #505050 !important;
            overflow: hidden; 
            border-radius: 0 !important;
        }

        .custom-table >>> .v-input__control {
            min-height: 24px !important;
            padding: 0 !important;
            margin: 0 !important;
            background-color: transparent !important;
            box-shadow: none !important;
        }
        .custom-table >>> input {
            font-size: 12px !important;
            padding: 2px !important;
        }

        .custom-table >>> .v-data-table__wrapper tr, .custom-table >>> .v-data-table__wrapper tr td {
            height: 10px !important;         
            text-align: left !important; 
            padding: 0 !important;
            margin: 0 !important;
            line-height: 0.9 !important;
            vertical-align: middle !important;
        }

        .custom-table >>> v-text-field {
            height: 20px !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        .span1{
            width: 140px !important;
        }
        .esoa{
            font-family:'Times New Roman', Times, serif
        }

    }
    .span1{
        width: 220px;
    }
    .wrap {
        display: flex;
        flex-wrap: wrap !important;
    }
    .text-large{
        font-size: 16px !important;
    }
    .text-medium{
        font-size:16px;
    }
    .text-small{
        font-size:12px;
    }
    .border-bottom{ border-bottom:1px solid black}
    .border-top{border-top:1px solid black}
    .image_logo{
        width:150px;
        height:50px;
    }
    ::v-deep .no-header-color .v-data-table-header {
        background-color: transparent !important;
    }
    .custom-table >>> .v-data-table-header th {
        background-color: transparent !important;
        color: #000 !important;
    }
    .custom-table >>> .v-data-table-header th{
        padding: 0 !important; 
        font-size: 14px;    
        line-height: 1 !important;  
        margin: 0 !important;   
        height: 45px !important;
        border-radius: 0 !important;
    }
    .custom-table, .custom-table >>> td, .custom-table >>> th  {
        border: 1px solid #505050 !important;
        overflow: hidden; 
    }
    .custom-table >>> .v-input__control {
        min-height: 24px !important;
        padding: 0 !important;
        margin: 0 !important;
        background-color: transparent !important;
        box-shadow: none !important;
    }
    .custom-table >>> input {
        font-size: 16px !important;
        padding: 2px !important;
    }
    .custom-table >>> .v-data-table__wrapper tr, .custom-table >>> .v-data-table__wrapper tr td {
        height: 14px !important;         
        text-align: left !important; 
        padding: 5px !important;
        margin: 5px !important;
        line-height: .9 !important;
        font-size: 16px !important;
        vertical-align: middle !important;
    }
    .custom-table >>> v-text-field {
        height: 24px !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    .v-data-table td {
        vertical-align: middle;
    }
    .pdf-mode .text-medium { font-size: 16px !important; }
    .pdf-mode .text-large { font-size: 18px !important; }
    .pdf-mode .image_logo { width: 150px !important; height: 50px !important; }
    .pdf-mode .hide-print { display: none !important; }
    .pdf-mode .custom-table .v-data-table-header th {
        padding: 0 !important; font-size: 14px; line-height: .9 !important; height: 30px !important;
    }
    .pdf-mode .custom-table, 
    .pdf-mode .custom-table td, 
    .pdf-mode .custom-table th  {
        border: 1px solid #505050 !important;
        border-radius: 0 !important;
    }
    .pdf-mode .custom-table .v-input__control {
        min-height: 24px !important; padding: 0 !important; background-color: transparent !important;
    }
    .pdf-mode .custom-table input {
        font-size: 14px !important; padding: 2px !important;
    }
    .pdf-mode .custom-table .v-data-table__wrapper tr td {
        height: 15px !important; padding: 0 !important; line-height: 1 !important; vertical-align: middle !important;
    }
    .pdf-mode .span1 { width: 200px !important; }
    .pdf-mode .bottom-sp { padding-top: 12px !important; }
    .pdf-mode { font-family:'Times New Roman', Times, serif !important ;}
</style>