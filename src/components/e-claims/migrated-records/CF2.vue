<template>
    <div class="esoa esoa-border">
        <v-row align="center">
          <v-col cols="12" md="2" class="header-logo text-center">
            <v-img src="@/assets/philhealth.png" contain max-width="140" class="mx-auto" />
          </v-col>
          <v-col cols="12" md="7" class="header-title text-center">
            <div class="grey--text">
              Republic of the Philippines
            </div>
            <div class="text-h4 font-weight-bold black--text text--darken-3">
              CLAIM FORM 2
            </div>
           <div class="text-h7">
              PHILIPPINE HEALTH INSURANCE CORPORATION
            </div>
          </v-col>

          <v-col cols="12" md="3" class="header-claim mt-3">
            <v-text-field :value="cf2_data.claim_info.claim_no" outlined dense readonly label="Claim No."/>
          </v-col>
        </v-row>

        <v-divider class="mt-6"/>

        <v-row wrap class="my-1">
          <v-col cols="12" sm="12" md="12" lg="12">
            <h3 class="section-title">PATIENT CONFINEMENT INFORMATION</h3>
          </v-col>
        </v-row>

        <v-divider/>

        <div class="for-print">
          <v-row class="mt-4" dense align="center">
            <v-col cols="12" sm="12" md="2" lg="2" class="text-left">
              <label class="body-2">
                NAME OF MEMBER
              </label>
            </v-col>
  
            <v-col cols="12" sm="6" md="3" lg="3">
              <v-text-field :value="cf2_data.CF1.member_first_name" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                First Name
              </h5>
            </v-col>

            <v-col cols="12" sm="6" md="3" lg="3">
              <v-text-field :value="cf2_data.CF1.member_middle_name" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Middle Name
              </h5>
            </v-col>

            <v-col cols="12" sm="9" md="3" lg="3">
              <v-text-field :value="cf2_data.CF1.member_last_name" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Last Name
              </h5>
            </v-col>

            <v-col cols="12" sm="3" md="1" lg="1">
              <v-text-field :value="cf2_data.CF1.member_suffix" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Suffix
              </h5>
            </v-col>
          </v-row>

          <v-row class="mt-4" dense align="center">
            <v-col cols="12" sm="12" md="2" lg="2" class="text-left">
              <label class="body-2">
                IF REFERRED
              </label>
            </v-col>
  
            <v-col cols="12" sm="6" md="3" lg="3">
              <v-text-field :value="cf2_data.CF2.referred_ihcp_accre_code" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Referred IHCP ACCREDITATION CODE
              </h5>
            </v-col>

            <v-col cols="12" sm="6" md="7" lg="7">
              <v-text-field :value="cf2_data.CF2.referral_reasons" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Referral Reasons
              </h5>
            </v-col>
          </v-row>

          <v-row class="mt-4" dense align="center">
            <v-col cols="12" sm="12" md="2" lg="2" class="text-left">
              <label class="body-2">
                CONFINEMENT
              </label>
            </v-col>
  
            <v-col cols="12" sm="4" md="3" lg="3">
              <v-text-field :value="`${cf2_data.CF2.admission_date} ${cf2_data.CF2.admission_time}`" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Date and Time Admitted
              </h5>
            </v-col>

            <v-col cols="12" sm="4" md="3" lg="3">
              <v-text-field :value="`${cf2_data.CF2.discharge_date} ${cf2_data.CF2.discharge_time}`" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Date and Time Discharge
              </h5>
            </v-col>

            <v-col cols="12" sm="4" md="4" lg="4">
              <v-text-field :value="cf2_data.CF2.accommodation_type ? (cf2_data.CF2.accommodation_type === 'N' ? 'Non-Private' : 'Private') : ''" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Type of Accomodation
              </h5>
            </v-col>

          </v-row>

          <v-row class="mt-4" dense align="center">
            <v-col cols="12" sm="12" md="2" lg="2" class="text-left">
              <label class="body-2">
                ADMISSION DIAGNOSIS
              </label>
            </v-col>

            <v-col cols="12" sm="12" md="10" lg="10">
                <v-text-field :value="cf2_data.CF2.diagnosis.admission_diagnosis" class="body-2 admission-diagnosis" hide-details readonly dense />
            </v-col>
          </v-row>

          <v-row class="mt-4" dense align="center">
            <v-col cols="12" sm="12" md="2" lg="2" class="text-left">
              <label class="body-2">
                DISCHARGED DIAGNOSIS
              </label>
            </v-col>

            <v-col cols="12" sm="12" md="10" lg="10">
              <v-text-field :value="cf2_data.CF2.diagnosis.discharge.discharge_diagnosis" class="body-2 discharged-diagnosis" hide-details readonly dense/>
            </v-col>
          </v-row>

          <v-row class="mt-2">
            <v-col cols="12" md="2" class="text-left">
              <label class="body-2">
                PROCEDURES
              </label>
            </v-col>

            <v-col cols="12" md="10">
              <table class="procedure-table">
                <thead>
                  <tr class="text-center body-2">
                    <th style="width:10%">RVS Code</th>
                    <th style="width:45%">Description</th>
                    <th style="width:15%">Date</th>
                    <th style="width:10%">Laterality</th>
                    <th style="width:10%">Case Rate Amount</th>
                    <th style="width:10%">Case Rate Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr  class="body-2" v-for="(procedure, index) in cf2_data.CF2.diagnosis.discharge.procedure" :key="index">
                    <td class="text-center">{{ procedure.rvs_code }}</td>
                    <td class="text-left" style="white-space: pre-wrap;">
                      {{ procedure.related_procedure }}
                    </td>
                    <td class="text-center">{{ procedure.procedure_date }}</td>
                    <td class="text-center">{{ procedure.laterality }}</td>
                    <td class="text-center">{{ procedure.caserate_amount }}</td>
                    <td class="text-center">{{ procedure.case_rate_code }}</td>
                  </tr>
                  <tr v-if="cf2_data.CF2.diagnosis.discharge.procedure.length === 0">
                    <td colspan="6" class="text-center grey--text">
                      No procedures available.
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-col>
          </v-row>

         <v-row class="mt-4" dense align="center">
          <!-- Label -->
          <v-col cols="12" md="2">
            <label class="body-2">
              SPECIAL CONSIDERATIONS
            </label>
          </v-col>

          <!-- Content -->
          <v-col cols="12" md="10">
            <v-text-field class="body-2 special-considerations" hide-details readonly dense/>
          </v-col>
        </v-row>
        </div>

        <v-divider class="mt-6"/>

        <v-row wrap class="my-1">
          <v-col cols="12" sm="12" md="12" lg="12">
            <h3 class="section-title">HEALTH CARE PROFESSIONAL</h3>
          </v-col>
        </v-row>

        <v-divider/>

        <div class="for-print">
          <v-row class="mt-4" dense align="center">
            <v-col cols="12" sm="12" md="2" lg="2" class="text-left">
              <label class="body-2">
                NAME OF DOCTOR
              </label>
            </v-col>
  
            <v-col cols="12" sm="6" md="3" lg="3">
              <v-text-field :value="cf2_data.CF2.professional.doctor_last_name" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                First Name
              </h5>
            </v-col>

            <v-col cols="12" sm="6" md="3" lg="3">
              <v-text-field :value="cf2_data.CF2.professional.doctor_middle_name" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Middle Name
              </h5>
            </v-col>

            <v-col cols="12" sm="9" md="3" lg="3">
              <v-text-field :value="cf2_data.CF2.professional.doctor_last_name" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Last Name
              </h5>
            </v-col>

            <v-col cols="12" sm="3" md="1" lg="1">
              <v-text-field :value="cf2_data.CF2.professional.doctor_suffix !=='NA' ? cf2_data.CF2.professional.doctor_suffix : ''" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Suffix
              </h5>
            </v-col>
          </v-row>

          <v-row class="mt-4" dense align="center">
            <v-col cols="12" sm="12" md="2" lg="2" class="text-left">
              <label class="body-2">
                ACCREDITATION
              </label>
            </v-col>
  
            <v-col cols="12" sm="6" md="3" lg="3">
              <v-text-field :value="cf2_data.CF2.professional.doctor_accre_no" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Accreditation No.
              </h5>
            </v-col>

            <v-col cols="12" sm="3" md="3" lg="3">
              <v-text-field :value="cf2_data.CF2.professional.date_doctor_signed" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Doctor Date Signed
              </h5>
            </v-col>

            <v-col cols="12" sm="6" md="2" lg="2">
              <v-text-field :value="cf2_data.CF2.professional.with_co_pay ? (cf2_data.CF2.professional.with_co_pay === 'Y' ? 'Yes' : 'No') : '' " class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                With Co-Pay
              </h5>
            </v-col>

            <v-col cols="12" sm="9" md="2" lg="2">
              <v-text-field :value="cf2_data.CF2.professional.doctor_co_pay" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Doctor Co-Pay
              </h5>
            </v-col>
          </v-row>

          <v-row class="mt-4" dense align="center">
            <v-col cols="12" sm="12" md="2" lg="2" class="text-left">
              <label class="body-2">
                CONSUMPTION
              </label>
            </v-col>

            <v-col cols="12" sm="6" md="3" lg="3">
              <v-text-field :value="cf2_data.CF2.professional.consumption.enough_benefits" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Benefit is enough to cover HCI and PF Charges.
              </h5>
            </v-col>

            <v-col cols="12" sm="3" md="3" lg="3">
              <v-text-field :value="cf2_data.CF2.professional.consumption.total_hci_fees" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Health Care Institution Fees
              </h5>
            </v-col>

            <v-col cols="12" sm="6" md="2" lg="2">
              <v-text-field :value="cf2_data.CF2.professional.consumption.total_prof_fees" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Professional Fees
              </h5>
            </v-col>

            <v-col cols="12" sm="9" md="2" lg="2">
              <v-text-field :value="cf2_data.CF2.professional.consumption.grand_total" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Grand Total
              </h5>
            </v-col>

          </v-row>

        </div>

        <v-divider class="mt-12"/>
    </div>
</template>

<script>
export default {
  props: ['cf2_data']
}
</script>

<style scoped>
@media print 
{
  .header-logo {
    flex: 0 0 18% !important;
    max-width: 18% !important;
  }

  .header-title {
    flex: 0 0 55% !important;
    max-width: 55% !important;
    text-align: center;
  }

  .header-claim {
    flex: 0 0 25% !important;
    max-width: 25% !important;
  }

  /* MEMBER */

  .for-print .row {
    display: flex !important;
    flex-wrap: nowrap !important;
    width: 100% !important;
  }
  
  .for-print .col-md-7 {
    flex: 0 0 58.333% !important;
    max-width: 58.333% !important;
  }

  .for-print .col-md-2 {
    flex: 0 0 16.666% !important;
    max-width: 16.666% !important;
  }

  .for-print .col-md-1 {
    flex: 0 0 8.333% !important;
    max-width: 8.333% !important;
  }

  .for-print .col-md-2 {
    flex: 0 0 16.666% !important;
    max-width: 16.666% !important;
  }

  .for-print .col-md-3 {
    flex: 0 0 25% !important;
    max-width: 25% !important;
  }

  .for-print .col-md-1 {
    flex: 0 0 8.333% !important;
    max-width: 8.333% !important;
  }

  .for-print .col-md-10 {
    flex: 0 0 83.333% !important;
    max-width: 83.333% !important;
  }


  .for-print .v-input {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .for-print label {
    white-space: nowrap !important;
    font-size: 12px !important;
  }

  .for-print h5 {
    font-size: 10px !important;
    margin-top: 2px !important;
  }

  .patient-print h5 {
    font-size: 10px !important;
    margin-top: 2px !important;
  }

  .admission-diagnosis, .discharged-diagnosis, .special-considerations {
    padding-left: 50px;
  }
}

.procedure-table td,th {
  border-bottom: 1px solid #000;
  padding:2px;
}
</style>