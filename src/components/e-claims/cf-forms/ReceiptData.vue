<template>
        <div style="width:100%;" id="for-print"> 
                <v-row class="d-flex justify-center ma-0 pa-0 ">
                    <v-col cols="11" class="text-center">
                        <h2>RECEIPT DATA</h2>
                        <label class="text-subtitle-1 font-weight-regular">
                            Drugs/Medicine and Medical Supplies
                        </label>
                    </v-col>
                </v-row>

                <v-row dense  class="d-flex justify-center mt-10">
                    <v-col cols="7" class="align-end d-flex">
                        <label class="font-weight-medium text-no-wrap body-1 pr-2">Company Name: </label>
                        <span class="input--border">
                           {{receipt_data.RECEIPT_DATA.company_name}}
                        </span>
                    </v-col>
                    <v-col cols="4" class="align-end d-flex">
                        <label class="font-weight-medium text-no-wrap body-1 pr-2">Company TIN: </label>
                        <span class="input--border">
                            {{receipt_data.RECEIPT_DATA.company_tin}}
                        </span>
                    </v-col>
                </v-row>
                
                <v-row dense  class="d-flex justify-center">
                    <v-col cols="7" class="align-end d-flex">
                        <label class="font-weight-medium text-no-wrap body-1 pr-2">Receipt Number: </label>
                        <span class="input--border">
                           {{receipt_data.RECEIPT_DATA.receipt_no}}
                        </span>
                    </v-col>
                    <v-col cols="4" class="align-end d-flex">
                        <label class="font-weight-medium text-no-wrap body-1 pr-2">Receipt Date: </label>
                        <span class="input--border">
                            {{receipt_data.RECEIPT_DATA.receipt_date ? $moment(receipt_data.RECEIPT_DATA.receipt_date).format('MMMM DD, YYYY'):''}}
                        </span>
                    </v-col>
                </v-row>
                
                <v-row class="d-flex justify-center">
                    <v-col cols="11">
                        <v-divider></v-divider>
                    </v-col>
                </v-row>

                <v-row class="d-flex justify-center">
                    <v-col cols="11" class="text-center">
                        <table class="body-2" border="collapse" cellspacing="0">
                            <tr>
                                <th width="61%">Description</th>
                                <th width="7%">Qty</th>
                                <th width="13%">Unit Price</th>
                                <th width="17%">Total Amount</th>
                            </tr>
                            <tr v-for="(item,index) in medicine_supplies" :key="index">
                                <td class="text-left pl-3">{{ 'generic_name' in item ? item.generic_name : item.item_desc }}</td>
                                <td>{{item.quantity}}</td>
                                <td>{{checkFormat(item.amount)}}</td>
                                <td>{{checkFormat(item.total)}}</td>
                            </tr>
                        </table>
                    </v-col>
                </v-row>

                <v-row class="d-flex justify-center">
                    <v-col cols="11" class="text-center">
                        <table class="body-1 mt-3">
                            <tr>
                                <th width="2%"></th>
                                <th width="61%"></th>
                                <th width="7%"></th>
                                <th width="13%"></th>
                                <th width="17%"></th>
                            </tr>
                            <tr>
                                <td colspan="4" class="text-right pr-3 font-weight-medium">SUBTOTAL</td>
                                <td id="subtotal">
                                   {{this.checkFormat(total_amount)}}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" class="text-right pr-3 font-weight-medium">VAT</td>
                                <td id="vat">0</td>
                            </tr>
                            <tr>
                                <td colspan="4" class="text-right pr-3 font-weight-medium">VAT EXEMP SALE</td>
                                <td id="vat">0</td>
                            </tr>
                            <tr>
                                <td colspan="4" class="text-right pr-3 font-weight-bold">GRAND TOTAL</td>
                                <td id="grand-total" class="font-weight-bold">
                                   {{this.checkFormat(total_amount)}}
                                </td>
                            </tr>
                        </table>
                    </v-col>
                </v-row>
        </div>
    
</template>

<script>
export default {
    props:['receipt_data'],
    data() {
        return {
            medicine_supplies: this.receipt_data.MEDICINE.concat(this.receipt_data.MEDICAL_SUPPLIES)
        }
    },
    computed: {
        // COMPUTATION FOR TOTAL AMOUNT
        total_amount(){
            return this.medicine_supplies.reduce(function (sum, item) {
                return sum + parseFloat(item.total)
            }, 0)
        }
    },
    methods: {
        checkFormat(value){
            if(value){
                value = value.toLocaleString()

                if(value.toLocaleString().includes('.')){
                if(value.toLocaleString().includes(',')){
                    return value
                }else{
                    return value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                }else{
                if(value.toLocaleString().includes(',')){
                    return value+'.00'
                }else{
                    return value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'.00'
                }
                }
            }else{
                return '0.00'
            }
        }
    }
}
</script>

<style scoped>
table {
    width: 100%;
}
td,th {
    font-size: 10px;
}
.input--border {
    border-bottom: 1px solid grey;
    width: 100%;
}
#subtotal {
    border-bottom:1px solid #999999;
    background-color:#f9f9f9
}
#vat {
    border-bottom:1px solid #999999;
    background-color:#f9f9f9
}
#vat-exempt {
    border-bottom:1px solid #999999;
    background-color:#f9f9f9
}

#grand-total {
    border-bottom:1px solid #999999;
    background-color:#dddddd;
}

@media print{
    #not-for-print {
      display: none;
      padding:0 !important; 
      margin:0 !important
    }
    #for-print {
      display: block !important;
      width:100%;
      visibility: visible;
    }
}

</style>