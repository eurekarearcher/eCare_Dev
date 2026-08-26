<template>
  <v-container class="pa-0">
    <section class="mx-auto">
      <v-card class="py-5 mx-auto" flat>
        <!-- <v-row align="center" justify="end" class="px-4 mb-1">
          <label class="font-weight-normal mx-1 grey--text text--darken-2">EXPORT:</label>
          <v-btn @click="$emit('convertToExcel')" :loading="excel_loader" class="primary" color="success">Excel<v-icon right>mdi-microsoft-excel</v-icon></v-btn> 
        </v-row> -->

        <!-- VALIDATION TABLE -->
        <v-data-table @input="$emit('update:selected_patient', $event)" :value="selected_patient" :headers="headers" :sort-by.sync="sort_by" :sort-desc.sync="sort_desc" :search="search_record" class="mt-4" :items-per-page="items_per_page" :footer-props="footer_props" :items="patient_data" :loading="loading_search_btn" show-select item-key="pHciCaseNo">
          <template v-slot:`header.data-table-select`="{ props, on }">
              <v-simple-checkbox color="white" v-if="props.indeterminate" v-ripple v-bind="props" :value="props.indeterminate" v-on="on"/>
              <v-simple-checkbox v-else @click="$emit('selectAllItems')" color="white" v-ripple v-bind="props" v-on="on"/>
          </template>

          <!-- DATE OF BIRTH -->
          <template v-slot:item.pPatientDob="{ item }">
              <span>{{ formatDate(item.pPatientDob) }}</span>
          </template>

          <!-- TRANSACTION CREATION DATE -->
          <template v-slot:item.date_created="{ item }">
              <span>{{ formatDate(item.date_created) }}</span>
          </template>

          <!-- DATE ADMITTED -->
          <template v-slot:item.pTransDate="{ item }">
              <span>{{ formatDate(item.pTransDate) }}</span>
          </template>

          <template slot="item.validation_status" slot-scope="{ item }">
              <div v-for="(status, i) in item.validation_status" :key="i">
                <v-chip small class="my-1">{{ status }}</v-chip>
              </div>
          </template>

          <template slot="body.append">
              <tr v-if="patient_data.length >= 1">
                <td :colspan="headers.length - 1"></td>
                <td class="text-right pr-6">
                    <div class="text-caption">{{ tranche_value === '1' ? 'Total count of FPE' : 'Total count of Consultations' }}</div>
                    <div class="text-h6 font-weight-medium">{{ total_consultation_count }}</div>
                </td>
              </tr>
          </template>
        </v-data-table>
      </v-card>

      <v-dialog @input="$emit('update:show_terms_dialog', $event)" :value="show_terms_dialog" max-width="800">
        <v-card class="overflow-hidden">
          <v-card-title class="body-1 primary justify-center white--text"><v-icon left medium color="white">mdi-file-document-outline</v-icon>Terms and Conditions</v-card-title>

          <v-card-text class="body-2">
            <div style="max-height:300px;overflow:auto">
              <h3 class="my-4">YAKAP Electronic Validation Bypass Warning</h3>
              <h4 class="my-4">You are about to enable the Unrestricted Submission Feature. By continuing, you acknowledge and accept the following consequences: </h4>
                <ul class="ml-10">
                  <li>Records may be <strong>incomplete, inaccurate, inconsistent, or non-compliant.</strong></li>
                  <li>Claims are at <strong>higher risk of rejection, denial, or delay.</strong> </li>
                  <li>PhilHealth may issue <strong>reduced reimbursements or non-payment.</strong></li>
                  <li>You will bear <strong>full responsibility</strong> for verifying accuracy and compliance of all submissions.</li>
                  <li>The System Provider is <strong>not liable</strong> for any losses, penalties, or compliance issues resulting from bypass use.</li>
                  <li>Standard validation controls are <strong>recommended</strong> to ensure data quality and compliance. </li>
                </ul>
              <br><br><h4 class="my-4">Confirmation Required: </h4>
                <p class="ml-5">“I understand the risks of bypassing standard validations. I accept full responsibility for all submitted records and any resulting claim denials, rejections, or non-payment by PhilHealth.”</p>
            </div>

            <v-checkbox @change="$emit('update:terms_accepted', $event)" :input-value="terms_accepted" label="I agree to the Terms and Conditions"/>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn text @click="$emit('update:show_terms_dialog', false)">Cancel</v-btn>
            <v-btn color="primary" :loading="loading_validate_btn" :disabled="!terms_accepted" @click="$emit('downloadXMLbyPass')">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </section>
  </v-container>
</template>

<script>
export default {
  props: ['patient_data', 'tranche_value', 'search_record', 'loading_search_btn', 'total_consultation_count', 'selected_patient', 'headers', 'sort_by', 
  'sort_desc', 'items_per_page', 'footer_props', 'show_terms_dialog', 'terms_accepted', 'loading_validate_btn', 'excel_loader', 'submit_report_loader'],
}
</script>

<style scoped>
::v-deep.v-icon.notranslate.mdi.mdi-checkbox-blank-outline.theme--light:first-of-type {
  color:rgb(255, 255, 255) !important;
}
.input-label:hover { 
  cursor: pointer;
  border-bottom: 1px solid #2196f3;
}
.border-bottom {
  border-bottom: 1px solid rgb(228, 228, 228);
}

.validate-items {
  max-height: 340px;
  overflow-y: auto;
}

.offscreen-receipt {
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 210mm; 
  height: auto;
  overflow: hidden;
}
</style>