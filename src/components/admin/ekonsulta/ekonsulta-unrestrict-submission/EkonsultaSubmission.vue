<template>
      <v-container class="pa-0">
        <section class="mx-auto">
          <v-card class="py-5 mx-auto" flat>
            <v-tabs-items :value="ekonsulta_tab">
                <v-tab-item>
                  <!-- FOR PENDING  TABLE -->
                  <v-data-table @input="$emit('update:selected_patient', $event)" :value="selected_patient" :headers="headers_pending" :sort-by.sync="sort_by" :sort-desc.sync="sort_desc" :search="search_record" class="mt-4" :items-per-page="items_per_page" :footer-props="footer_props" :items="patient_data" :loading="loading_search_btn"  item-key="pHciCaseNo">
                    <template  v-slot:item="{ item }"> 
                      <tr> 
                          <td>{{item.pPatientFullname}}</td>
                          <td>{{item.pPatientType}}</td>
                          <td>{{item.pPatientPin}}</td>
                          <td>{{item.pMemPin}}</td>
                          <td>{{formatDate(item.pPatientDob)}}</td>
                          <td>{{item.pPatientSex}}</td>
                          <td>{{formatDate(item.date_created)}}</td>
                          <td>{{formatDate(item.pTransDate)}}</td>
                          <td>{{item.count}}</td>
                          <td>
                            <div v-for="(item, index) in item.validation_status" :key="index">
                              <v-chip small class="my-1">
                                {{ item }}
                              </v-chip>
                            </div>
                          </td>
                          <td>{{item.pDeficiencyRemarks}}</td>
                      </tr>
                    </template>
                    <template v-slot:body.append>
                      <tr v-if="patient_data.length >= 1">
                        <td :colspan="headers_pending.length - 1"></td>
                        <td class="text-right pr-6">
                          <div class="text-caption">{{ tranche_value === '1' ? 'Total count of FPE' : 'Total count of Consultations'}}</div>
                          <div class="text-h6 font-weight-medium">{{ total_consultation_count }}</div>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-tab-item>
                
                <v-tab-item>
                <!-- FOR VALIDATION  TABLE -->
                <v-data-table @input="$emit('update:selected_patient', $event)" :value="selected_patient" :headers="headers" :sort-by.sync="sort_by" :sort-desc.sync="sort_desc" :search="search_record" class="mt-4" :items-per-page="items_per_page" :footer-props="footer_props" :items="patient_data" :loading="loading_search_btn" show-select item-key="pHciCaseNo">
                  <template v-slot:`header.data-table-select`="{ props, on }">
                      <v-simple-checkbox
                        color="white"
                        v-if="props.indeterminate"
                        v-ripple
                        v-bind="props"
                        :value="props.indeterminate"
                        v-on="on"
                      ></v-simple-checkbox>
                      <v-simple-checkbox
                        @click="$emit('selectAllItems')"
                        color="white"
                        v-if="!props.indeterminate"
                        v-ripple
                        v-bind="props"
                        v-on="on"
                      ></v-simple-checkbox>
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
                      <v-chip small class="my-1">
                        {{ status }}
                      </v-chip>
                    </div>
                  </template>
                  <template slot="body.append">
                      <tr v-if="patient_data.length >= 1">
                        <td :colspan="headers.length"></td>
                        <td class="text-right pr-6">
                          <div class="text-caption">{{ tranche_value === '1' ? 'Total count of FPE' : 'Total count of Consultations'}}</div>
                          <div class="text-h6 font-weight-medium">{{ total_consultation_count }}</div>
                        </td>
                      </tr>
                    </template>
                </v-data-table>
              </v-tab-item>
                <v-tab-item>
                  <!-- FOR SUBMISSION  TABLE -->
                  <v-data-table @input="$emit('update:selected_patient', $event)" :value="selected_patient" :headers="headers" :sort-by.sync="sort_by" :sort-desc.sync="sort_desc" :search="search_record" class="mt-4" :items-per-page="items_per_page" :footer-props="footer_props" :items="patient_data" :loading="loading_search_btn" show-select item-key="pHciCaseNo">
                    <template v-slot:`header.data-table-select`="{ props, on }">
                        <v-simple-checkbox
                          color="white"
                          v-if="props.indeterminate"
                          v-ripple
                          v-bind="props"
                          :value="props.indeterminate"
                          v-on="on"
                        ></v-simple-checkbox>
                        <v-simple-checkbox
                          @click="$emit('selectAllItems')"
                          color="white"
                          v-if="!props.indeterminate"
                          v-ripple
                          v-bind="props"
                          v-on="on"
                        ></v-simple-checkbox>
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
                        <v-chip small class="my-1">
                          {{ status }}
                        </v-chip>
                      </div>
                    </template>
                    <template slot="body.append">
                      <tr v-if="patient_data.length >= 1">
                        <td :colspan="headers.length"></td>
                        <td class="text-right pr-6">
                          <div class="text-caption">{{ tranche_value === '1' ? 'Total count of FPE' : 'Total count of Consultations'}}</div>
                          <div class="text-h6 font-weight-medium">{{ total_consultation_count }}</div>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-tab-item>
            </v-tabs-items>
          </v-card>

          <v-dialog @input="$emit('update:display_validated', $event)" :value="display_validated" width="850" persistent>
              <v-card width="850" height="590"> 
                <v-card-title class="d-flex justify-center"> VALIDATE REPORT (T{{ tranche_value }}) </v-card-title>
                <v-card-subtitle class="note-text text-center pt-2">
                  <strong>Note:</strong> Hover over the 
                  <v-icon small  color="error">mdi-close-circle-outline</v-icon> icon to view validation errors, or download the PDF for a detailed validation report.
                </v-card-subtitle>

                <v-divider> </v-divider>

                <div v-if="selected_patient.length !== patient_validated_data.length" class="d-flex justify-center align-center" style="height: 420px;">  
                    <v-progress-circular :size="120" :width="7" indeterminate color="primary">
                      <span class="body-1"> {{ patient_validated_data.length + " / " + selected_patient.length }} </span>
                    </v-progress-circular>
                </div>
                <div v-else> 
                    <v-sheet style="height: 380px;">
                        <div class="validate-items px-12"> 
                          <v-sheet class="d-flex justify-space-between my-4">
                              <h4 class="body-2 font-weight-bold"> NAME</h4>
                              <h4 class="body-2 font-weight-bold"> STATUS </h4>
                          </v-sheet>
                          <div v-for="patient_data in  patient_validated_data" :key="patient_data.pHciCaseNo"> 
                            <v-sheet class="d-flex justify-space-between my-4">
                                <h4 class="body-2"> <span class="body-2"> {{ patient_data.pPatientFullname }} </span> </h4>
                                <template v-if="patient_data.success"> 
                                  <v-icon size="large" color="success" class="pr-4"> mdi-check-circle </v-icon>
                                </template>
                                <template v-else>
                                  <v-tooltip bottom>
                                      <template v-slot:activator="{ on, attrs }">
                                          <v-icon v-bind="attrs" v-on="on" size="large" color="error" class="pr-4"> mdi-close-circle </v-icon>  
                                      </template>
                                      <div v-for="(err, index) in patient_data.error" :key="index">
                                        {{ err }}
                                      </div>
                                  </v-tooltip>
                                </template>
                            </v-sheet>
                            <v-row dense>
                              <v-col cols="4"> <h5 class="success--text body-2 font-weight-medium"> Success: <span> {{ patient_data.success_cnt }}</span> </h5> </v-col>
                              <v-col cols="4"> <h5 class="error--text body-2 font-weight-medium"> Failed: <span>  {{ patient_data.failed_cnt }} </span> </h5>  </v-col>
                              <v-col cols="4"> <h5 class="grey--text text--darken-3 body-2 text-end font-weight-medium"> No. of consultation: <span>  {{patient_data.no_of_consultation }} </span> </h5>  </v-col>
                            </v-row>
                            <v-divider class="mt-2"/>
                          </div> 
                        </div> 
                    </v-sheet>
                    
                    <v-divider class="mb-1"/>

                    <v-row class="d-flex justify-center" align="stretch" no-gutters>
                      <v-col cols="12" sm="7" class="d-flex flex-column">
                        <v-sheet class="d-flex align-center justify-center fill-height">
                          <h5 class="success--text body-2 mx-12 font-weight-medium">
                            Total # of Success: <span>{{ success_count }}</span>
                          </h5>
                          <h5 class="error--text body-2 mx-12 font-weight-medium">
                            Total # of Failed: <span>{{ failed_count }}</span>
                          </h5>
                        </v-sheet>
                      </v-col>
                  
                      <v-col cols="12" sm="5" class="d-flex align-center">
                        <v-btn class="my-2 mr-5" @click="$emit('downloadValidationReport')" :disabled="selected_patient.length !== patient_validated_data.length">
                          <v-icon left>mdi-file-pdf-box</v-icon>
                          Download Validation Report
                        </v-btn>
                      </v-col>
                    </v-row>

                    <v-divider class="mt-1"/>
                </div>

                <div class="d-flex justify-center align-center mt-2">
                  <v-btn @click="$emit('searchRecord')" :disabled="proceed_validate_loader" class="mr-2" text>
                    Close
                  </v-btn>
                  <v-btn v-if="ekonsulta_tab === 2" @click="$emit('validateTransaction')" color="primary"  :loading="proceed_validate_loader" :disabled="success_count < 1">
                    Proceed to submission
                  </v-btn>
                </div>
              </v-card>
          </v-dialog> 
        </section>
      </v-container>
</template>

<script>
export default {
  props: ['patient_data', 'tranche_value', 'search_record', 'loading_search_btn', 'total_consultation_count', 'selected_patient', 'headers', 'sort_by', 
    'sort_desc', 'items_per_page', 'footer_props', 'loading_validate_btn', 'excel_loader', 'submission_loading', 'loading_search'
    ,'disable_validate_btn', 'disable_submit_btn', 'ekonsulta_tab', 'konsulta_submitted_response', 'ekonsulta_download_loader', 'disable_tranche', 'disable_date', 
    'patient_validated_data', 'display_validated', 'proceed_validate_loader', 'success_count', 'failed_count', 'headers_pending', 'loading_submit_btn',
    'alert_data', 'alert', 'transmittal_id', 'upload_list', 'upload_delete', 'upload_error', 'upload_success', 'upload_loading', 'pHciCaseNo', 'pHciTransNo', 'submit_report_loader'],
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