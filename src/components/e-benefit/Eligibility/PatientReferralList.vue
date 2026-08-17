<template>
  <div>
    <v-card>
      <v-data-table
        :headers="referal_list_header" 
        :items="referral_data.data"
        :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }"   
        :items-per-page="5" 
        :mobile-breakpoint="0" 
        loading-text="Loading Data... Please Wait..." 
        item-key="referral_code" 
        class="elevation-1 text-uppercase mx-5 mb-5 mt-10" 
        sort-desc 
        no-results>
          <template  v-slot:item="{item}"> 
            <tr> 
              <td>{{ formatDateAndTime(item.date_of_referral) }}</td>
              <td>{{ item.referral_code  }}</td>
              <td>{{ item.referring_doctor_provider_name}}</td>
              <td>{{ item.referral_doctor_provider_name}}</td>
              <td>{{ item.doctor_full_name ? item.doctor_full_name : 'N/A' }}</td>
              <td>{{ item.referral_doctor_specialization}}</td>
              <td>{{ item.reason_for_referral}}</td>
              <td class="py-3">
                <v-btn @click="confirmationReferral(item)" color="primary">Proceed With This Transaction</v-btn>
              </td>
          </tr> 
          </template>
      </v-data-table>

      <v-card-actions class="d-flex flex-wrap">
        <v-flex pl-3 pt-1 lg4 md4 sm6 xs12 mb-3 class="text-center text-sm-left">
          <v-btn @click="otherTransaction">Continue with different transaction</v-btn> 
        </v-flex>
      </v-card-actions>
    </v-card>
  
    <v-dialog v-if="confirmation_referral" v-model="confirmation_referral" width="600" persistent>
        <v-card class="pb-2">
            <v-card-title class="justify-center">
              <v-icon color="primary" size="80">mdi-help-circle</v-icon>
            </v-card-title>
            <h3 class="grey--text text--darken-3 text-center font-weight-medium mb-5">Continue with this referred transaction?</h3>

            <div class="px-12 pb-5">
                <h6 class="body-1 font-weight-regular mb-2">Referral Code: <span class="font-weight-medium">{{selected_referral.referral_code}}</span></h6>
                <h6 class="body-1 font-weight-regular mb-2">Date of Referral: <span class="font-weight-medium">{{selected_referral.date_of_referral}}</span></h6>
                <h6 class="body-1 font-weight-regular mb-2">Referral Provider Name: <span class="font-weight-medium">{{selected_referral.referral_doctor_provider_name}}</span></h6>
                <h6 class="body-1 font-weight-regular mb-2">Referral Doctor Name: <span class="font-weight-medium">{{selected_referral.doctor_full_name}}</span></h6>
                <h6 class="body-1 font-weight-regular mb-2">Referral Specialization: <span class="font-weight-medium">{{selected_referral.referral_doctor_specialization}}</span></h6>
                <h6 class="body-1 font-weight-regular mb-0">Reason for Referral: <span class="font-weight-medium"> {{selected_referral.reason_for_referral}} </span></h6>
            </div>

            <v-card-actions class="justify-center mt-5">
              <v-btn @click="cancelSelectedReferral" class="px-5 mx-2" large>Cancel</v-btn>
              <v-btn @click="proceedReferalTransaction" class="px-5 mx-2" color="primary" large>Confirm</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props:['ek_lgu_data', 'selected_referral','referral_data'],

  data() {
    return {
      display_referal: false,
      confirmation_referral: false,
      referal_list_header: [
        { text: 'DATE OF REFERRAL', value: 'date_of_referral',width: 150 },
        { text: 'REFERRAL CODE', value: 'referral_code', width: 180 },
        { text: 'REFERRED FROM', value: 'referring_doctor_provider_name', width: 250 },
        { text: 'REFERRAL PROVIDER NAME', value: 'referral_doctor_provider_name', width: 250 },
        { text: 'REFERRAL DOCTOR', value: 'doctor_full_name', width: 200 },
        { text: 'REFERRAL DOCTOR SPECIALIZATION', value: 'referral_doctor_specialization',  width: 200 },
        { text: 'REASON FOR REFERRAL', value: 'reason_for_referral', width:300 },
        { text: 'Action', value: '', width: 150 }
      ],
    }
  },

  methods: {
    // FOR OPENING THE CONFIRMATION DIALOG
    confirmationReferral(item) {
      this.confirmation_referral = true
      this.$emit('change-selected-referral', item)
    },

    // FOR CLOSING THE CONFIRMATION DIALOG 
    cancelSelectedReferral() {
      this.confirmation_referral = false
      this.$emit('change-selected-referral', null)
    },

    // FOR SETTING UP THE SELECTED REFERRAL TRANSACTION TO SESSION STORAGE. THIS ALSO DISABLES OUTPATIENT BUTTON
    proceedReferalTransaction() {
      this.display_referal =  false
      this.confirmation_referral = false
      sessionStorage.setItem('S2GSXfkF', this.$crypto.AES.encrypt(JSON.stringify(this.selected_referral), 'lfFo34sf'))
      this.$emit('proceed-selection')
    },

    // FOR NOT SELECTING ANY REFERRAL TRANSACTION
    otherTransaction() {
      this.$emit('other-transaction-referral', null)
      sessionStorage.removeItem('S2GSXfkF')
      sessionStorage.removeItem('T3HGYTWW')
    },
  }
}
</script>