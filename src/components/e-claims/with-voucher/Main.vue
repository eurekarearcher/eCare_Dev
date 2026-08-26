<template>
    <div class="pa-4" id="for-print">  
        <h2 class="font-weight-medium justify-center text-center">VOUCHER DETAILS</h2>
        <v-sheet> 
            <v-row dense  class="d-flex justify-center mt-10">
                <v-col cols="12" class="d-flex justify-end pb-7">
                    <div class="voucher">
                        <span class="font-weight-bold body-2">Voucher No.</span>
                        <span class="input--border font-weight-bold body-2">
                            {{ voucher_details.voucher_no }}
                        </span>
                    </div>
                </v-col>
                
                <v-col cols="8" class="align-end d-flex">
                    <label class="font-weight-medium text-no-wrap body-2 pr-2"> Patient Name: </label>
                    <span class="input--border body-2">
                        {{ patient_name }}
                    </span>
                </v-col>

                <v-col cols="4" class="align-end d-flex">
                    <label class="font-weight-medium text-no-wrap body-2 pr-6"> Patient PIN: </label>
                    <span class="input--border body-2">
                        {{ voucher_details.claim.pPin }}
                    </span>
                </v-col>

                <v-col cols="8" class="align-end d-flex">
                    <label class="font-weight-medium text-no-wrap body-2 pr-2"> Confinement Period : </label>
                    <span class="input--border body-2">
                        {{ this.$moment(voucher_details.claim.pAdmissionDate).format('MMMM D, YYYY') }} to {{ this.$moment(voucher_details.claim.pDischargeDate).format('MMMM D, YYYY') }}
                    </span>
                </v-col>

                <v-col cols="4" class="align-end d-flex">
                    <label class="font-weight-medium text-no-wrap body-2 pr-2"> Voucher Date.: </label>
                    <span class="input--border body-2">
                        {{ this.$moment(voucher_details.voucher_date).format('MMMM D, YYYY') }}
                    </span>
                </v-col>
                
            </v-row>
        </v-sheet>

        <v-divider class="mt-5"></v-divider>

        <!-- DISPLAY FOR SUMMARY OF CHARGES -->
        <SummaryOfCharges :voucher_details="voucher_details"/>
        <v-divider class="pb-2"></v-divider>

        <v-sheet class="d-flex justify-end mt-3"> 
            <v-btn @click="printVoucherDetails" class="white--text d-print-none" color="#367c9d" small>Print Voucher<v-icon color="white" right>mdi-printer</v-icon></v-btn>
        </v-sheet>
    </div>
</template>

<script>
import SummaryOfCharges from './SummaryOfCharges.vue'
export default {
    components: { 
        SummaryOfCharges 
    },

    props: ['voucher_details','track_status_holder'],

    computed: {
        patient_name() {
            return `${this.track_status_holder.mapping[0].ppatientFirstName} ${this.track_status_holder.mapping[0].ppatientMiddleName} ${this.track_status_holder.mapping[0].ppatientLastName} ${this.track_status_holder.mapping[0].pPatientSuffix || ''}`;
        },

        check_numbers() {
            const result = this.voucher_details.summary.payee.filter(payee => payee.pCheckNo)
                .map(payee => `${payee.pCheckNo}`).join(", ");

            return result
        }
    },

    methods: {
        printVoucherDetails() {
            window.scrollTo(0, 0);
            window.print()
        }
    }
}
</script>

<style scoped>
    .input--border {
        border-bottom: 1px solid grey;
        width: 100%;
    }

    @media print{
        #for-print{
            left: 0;
            position: fixed !important; 
            top: 0;
            height: 100vh;
        }
    }
</style>
