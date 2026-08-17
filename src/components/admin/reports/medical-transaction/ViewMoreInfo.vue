<template>
  <v-dialog v-model="show_view_more_info" width="1200" persistent>
    <div class="d-print-none">
      <v-card-title class="light-blue darken-4 white--text py-2">
        <v-spacer></v-spacer>More Information<v-spacer></v-spacer>
      </v-card-title>

      <v-card class="pt-4 pb-6 px-6" tile>
        <div v-if="loading_icd_cpt" class="text-center py-10">
          <v-progress-circular color="primary" size="30" indeterminate ></v-progress-circular>
          <h5 class="font-weight-medium light-blue--text text--darken-4 body-2 pl-5 mt-8"> Loading Data... Please wait... </h5>
        </div>

        <template v-else>
          <template v-if="icd_data && icd_data !== 'Data not found.'">
            <div v-for="(icd, icd_index) in icd_data" :key="'icd' + icd_index">
                <div v-if="icd.icd_code && icd.icd_code !== '' && icd.icd_description !== '' && icd.icd_description">
                  <h4 v-if="icd_index === 0" class="font-weight-medium body-2 mt-3"> Primary Diagnosis </h4>
                  <h4 v-else-if="icd_index === 1" class="font-weight-medium body-2 mt-3" > Secondary Diagnosis </h4>
                  <h4 v-else-if="icd_index === 2" class="font-weight-medium body-2 mt-3"> Other Diagnosis </h4>
                  <h4 v-else class="white--text mt-n4">.</h4>
                </div>

                <template v-else>
                    <div>
                      <h4 class="font-weight-medium body-2">Primary Diagnosis</h4>
                      <label class="font-italic body-2">No Available Diagnosis</label>
                    </div>
                </template>

                <v-text-field v-if="icd.icd_code && icd.icd_code !== '' && icd.icd_description !== '' && icd.icd_description" :value="icd.icd_code + ' / ' + icd.icd_description" class="body-2 mb-2" hide-details readonly outlined dense ></v-text-field>
                  <v-row v-for="(cpt, cpt_index) in icd.procedure_list" :key="cpt_index" class="d-flex flex-wrap mt-n1" dense>
                      <v-col cols="12" md="3" sm="3">
                        <h4 v-if="cpt_index === 0" class="font-weight-medium body-2 ml-2 mt-1">Procedure</h4>
                        <v-text-field :value="cpt.cpt_code + ' / ' + cpt.cpt_description" class="body-2 ml-2 mb-2" hide-details readonly outlined dense ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="3">
                        <h4 v-if="cpt_index === 0" class="font-weight-medium body-2 ml-2 mt-1">Amount</h4>
                        <v-text-field :value="cpt.cpt_amount" class="body-2 ml-2 mb-2" hide-details readonly outlined dense ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="3">
                        <h4 v-if="cpt_index === 0" class="font-weight-medium body-2 ml-2 mt-1">HMO Status</h4> 
                        <v-text-field :value="cpt.hmo_cpt_status ? cpt.hmo_cpt_status : 'NOT APPLICABLE'" class="body-2 ml-2 mb-2" hide-details readonly outlined dense ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="3">
                        <h4 v-if="cpt_index === 0" class="font-weight-medium body-2 ml-2 mt-1">PHIC Status</h4>
                        <v-text-field :value="cpt.phic_cpt_status ? cpt.phic_cpt_status : 'NOT APPLICABLE'" class="body-2 ml-2 mb-2" hide-details readonly outlined dense ></v-text-field>
                      </v-col>
                  </v-row>
              </div>
          </template>

          <template v-else>
            <div>
              <h4 class="font-weight-medium body-2 mt-4">Primary Diagnosis</h4>
              <label class="font-italic body-2">No Available Diagnosis</label>
            </div>
          </template>

          <template>
            <h4 class="font-weight-medium body-2 mt-5">Approver</h4>
            <label class="font-italic body-2">{{ icd_data.hmo_cc_approver ? icd_data.hmo_cc_approver : 'N/A'  }}</label>

            <h4 class="font-weight-medium body-2 mt-2">Approval Code</h4>
            <label class="font-italic body-2">{{ hmo_approval_code }}</label>

            <h4 class="font-weight-medium body-2 mt-2">Doctor Note</h4>
            <label class="font-italic body-2">{{ doctor_note }}</label>

            <h4 class="font-weight-medium body-2 mt-2">HMO Note</h4>
            <label class="font-italic body-2">{{ hmo_cc_notes }}</label>

            <div class="my-6">
              <v-btn @click="viewClinicalAbstract(transaction_number_id)" class="mx-1" color="#367c9d" small dark >View Clinical Abstract</v-btn >
            </div>
          </template>

          <ClinicalAbstract @closeClinicalAbstract="display_patient_transaction = true" ref="clinical_abstract" />
        </template>

        <div class="text-center">
          <v-divider class="mb-6"></v-divider>
          <v-btn @click="closeViewMoreInfo">CLOSE</v-btn>
        </div>

      </v-card>
     </div>
    <Alert :alert="alert" />
  </v-dialog>
</template>

<script>
import ClinicalAbstract from "@/components/emr/ClinicalAbstract";
import Alert from "@/components/Alert";

export default {

  components: {
    ClinicalAbstract,
    Alert,
  },

  data() {
    return {
      show_view_more_info: false,
      view_more_info_data: [],
      loading_icd_cpt: true,

      transaction_number_id: "",
      doctor_note: "",
      hmo_cc_notes: "",
      hmo_approval_code: '',
      hmo_cc_approver: "",

      icd_data: [],
      alert: {}
    }
  },

  created() {
    this.getViewMoreInfo()
  },


  methods: {
    openViewMoreInfo(transaction_number, doctor_note, hmo_cc_notes, hmo_approval_code) {
      if ( typeof transaction_number === "object" && transaction_number !== null ) {
        this.loading_icd_cpt = false;
      } else {
        this.loading_icd_cpt = true;
        this.transaction_number_id = transaction_number;
        this.doctor_note = doctor_note;
        this.hmo_cc_notes = hmo_cc_notes;
        this.hmo_approval_code = hmo_approval_code;
        this.getViewMoreInfo(transaction_number);
      }
      this.show_view_more_info = true;
    },

    async getViewMoreInfo() {
      if(this.transaction_number_id){
      this.icd_data = [];
      let response = await this.$services.getTransactionIcdCpt({
          transaction_number: this.transaction_number_id,
      })

      if(response.status === 200) {
          const data = this.responseDataDecryption(response.data);
          this.icd_data.push({
            ...data[0],
            selected_medicine: data[1].selected_medicine || []
          });
          this.loading_icd_cpt = false;
      } else {
        this.alert = response.error
      }
    }},

    //CLINICAL ABSTRACT
    viewClinicalAbstract(transaction_number) {
      this.display_patient_transaction = false;
      this.$refs.clinical_abstract.openClinicalAbstract(transaction_number, this.icd_data);
    },

    //CLOSE FUNCTION EMIT TO MAIN
    closeViewMoreInfo() {
      this.show_view_more_info = false;
      this.$emit("closeViewMoreInfo");
    }
  }
};
</script>
