<template>
  <div>
    <v-card>
      <v-data-table
      :headers="transaction_list_header" 
      :items="transaction_data.data" 
      :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }"   
      :items-per-page="5" 
      :mobile-breakpoint="0" 
      :loading="tableLoading"
      loading-text="Loading Data... Please Wait..." 
      item-key="transaction_number" 
      class="elevation-1 text-uppercase mx-5 mb-5 mt-10" 
      sort-desc 
      no-results>
        <template v-slot:item="{item}"> 
          <tr> 
            <td>{{ formatDateAndTime(item.date_created) }}</td>
            <td>{{ item.transaction_number  }}</td>
            <td>{{ item.transaction_type}}</td>
            <td class="py-3">
              <v-btn @click="confirmEditTransaction(item)" color="primary">Edit Transaction</v-btn>
            </td>
          </tr> 
        </template>
      </v-data-table>

      <v-card-subtitle class="note-text text-left pl-6">
          <strong>Note:</strong> Note: Transactions can be edited only for migrated records. Only specific fields are editable.
      </v-card-subtitle> 
      
      <v-card-actions class="d-flex flex-wrap">
        <v-flex pl-3 pt-1 lg4 md4 sm6 xs12 mb-3 class="text-center text-sm-left">
          <v-btn @click="otherTransaction">Continue with different transaction</v-btn> 
        </v-flex>
      </v-card-actions>

    </v-card>

    <v-dialog v-if="confirmation_edit_transaction" v-model="confirmation_edit_transaction" width="600" persistent>
      <v-card class="pb-2">
        <v-card-title class="justify-center">
          <v-icon color="primary" size="80">mdi-help-circle</v-icon>
        </v-card-title>
        <h3 class="grey--text text--darken-3 text-center font-weight-medium mb-5">Continue to edit this transaction?</h3>

        <div class="px-12 pb-5">
            <h6 class="body-1 font-weight-regular mb-2">Transaction Date: {{selected_transaction.date_created}}  <span class="font-weight-medium"></span></h6>
            <h6 class="body-1 font-weight-regular mb-2">Transaction Number: {{selected_transaction.transaction_number}}<span class="font-weight-medium"></span></h6>
        </div>

        <v-card-actions class="justify-center mt-5">
          <v-btn @click="cancelEditTransaction(selected_transaction)" class="px-5 mx-2" large>Cancel</v-btn>
          <v-btn @click="proceedEditTransaction(selected_transaction)" class="px-5 mx-2" color="primary" large>Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['member_data','selected_transaction','transaction_data'],
  data() {
    return {
      display_transaction_list: false,
      confirmation_edit_transaction: false,
      tableLoading : false,
      transaction_list_header: [
          { text: 'TRANSACTION DATE', value: 'date_created',width: 200 },
          { text: 'TRANSACTION NUMBER', value: 'transaction_number', width: 250 },
          { text: 'TRANSACTION TYPE', value: 'transaction_type', width: 150 },
          { text: 'Action', value: '', width: 250 }
      ],
    }
  },

  methods: {
    // FOR NOT SELECTING ANY TRANSACTION / CLOSE
    otherTransaction() {
      this.$emit('other-transaction-referral', null)
      sessionStorage.removeItem('S2GSXfkF')
      sessionStorage.removeItem('T3HGYTWW')
    },

    //CONFIRMATION BEFORE PROCEED
    confirmEditTransaction(item) {
      this.confirmation_edit_transaction =  true
      this.$emit('change-selected-transaction', item)
    },

    cancelEditTransaction(item) {
      this.confirmation_edit_transaction =  false
      this.$emit('cancel-selected-transaction', item)
    },

    proceedEditTransaction() {
      this.confirmation_edit_transaction = false
      sessionStorage.setItem('T3HGYTWW', this.$crypto.AES.encrypt(JSON.stringify(this.selected_transaction), 'ghyjTLf'))
      this.$emit('proceed-selection')
    }
  }
}
</script>