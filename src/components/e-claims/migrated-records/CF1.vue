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
              CLAIM FORM 1
            </div>
           <div class="text-h7">
              PHILIPPINE HEALTH INSURANCE CORPORATION
            </div>
          </v-col>

          <v-col cols="12" md="3" class="header-claim mt-3">
            <v-text-field :value="claim_info.claim_no" outlined dense readonly label="Claim No."/>
          </v-col>
        </v-row>

        <v-divider class="mt-6"/>

        <v-row wrap class="my-1">
          <v-col cols="12" sm="12" md="12" lg="12">
            <h3 class="section-title">MEMBER INFORMATION
              <span v-show="cf1_data.patient_is === 'M'" class="text-caption font-weight-regular font-italic">
                (Patient is the member)
              </span>
            </h3>
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
              <v-text-field :value="cf1_data.member_first_name" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                First Name
              </h5>
            </v-col>

            <v-col cols="12" sm="6" md="3" lg="3">
              <v-text-field :value="cf1_data.member_middle_name" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Middle Name
              </h5>
            </v-col>

            <v-col cols="12" sm="9" md="3" lg="3">
              <v-text-field :value="cf1_data.member_last_name" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Last Name
              </h5>
            </v-col>

            <v-col cols="12" sm="3" md="1" lg="1">
              <v-text-field :value="cf1_data.member_suffix" class="body-2" hide-details readonly dense/>
              <h5 class="font-weight-light text-center">
                Suffix
              </h5>
            </v-col>
          </v-row>

          <v-row align="center" class="mt-4" dense>
            <v-col cols="12" sm="3" md="2" lg="2">
              <label class="body-2">
                MEMBER PIN
              </label>
            </v-col>
            <v-col cols="12" sm="9" md="3" lg="3">
              <v-text-field :value="cf1_data.member_pin" class="body-2" hide-details readonly dense/>
            </v-col>

            <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right">
              <label class="body-2">
                BIRTH DATE
              </label>
            </v-col>
            <v-col cols="12" sm="4" md="2" lg="2">
              <v-text-field :value="cf1_data.member_birth_date" class="body-2" hide-details readonly dense/>
            </v-col>

            <v-col cols="12" sm="1" md="1" lg="1" class="text-md-right">
              <label class="body-2">
                GENDER
              </label>
           </v-col>
            <v-col cols="12" sm="4" md="2" lg="2">
                <v-text-field :value="cf1_data.member_sex ? (cf1_data.member_sex === 'M' ? 'Male' : 'Female') : ''" class="body-2" hide-details readonly dense />
            </v-col>
          </v-row>

          <v-row align="center" class="mt-4" dense>
            <v-col cols="12" sm="3" md="2" lg="2">
              <label class="body-2">
                MEMBERSHIP TYPE
              </label>
            </v-col>
            <v-col cols="12" sm="9" md="3" lg="3">
              <v-text-field :value="get_membership_type_name" class="body-2" hide-details readonly dense/>
            </v-col>

            <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right">
              <label class="body-2">
                MOBILE NO.
              </label>
            </v-col>
            <v-col cols="12" sm="4" md="2" lg="2">
              <v-text-field :value="cf1_data.mobile_no" class="body-2" hide-details readonly dense/>
            </v-col>

            <v-col cols="12" sm="1" md="1" lg="1" class="text-md-right">
              <label class="body-2">
                PHONE NO.
              </label>
           </v-col>
            <v-col cols="12" sm="4" md="2" lg="2">
                <v-text-field :value="cf1_data.land_line_no" class="body-2" hide-details readonly dense />
            </v-col>
          </v-row>

          <v-row align="center" class="mt-4" dense>
            <v-col cols="12" sm="3" md="2" lg="2">
              <label class="body-2">
                MAILING ADDRESS
              </label>
            </v-col>
            <v-col cols="12" sm="9" md="10" lg="10">
              <v-text-field :value="cf1_data.mailing_address" class="body-2" hide-details readonly dense/>
            </v-col>
          </v-row>

          <v-row align="center" class="mt-4" dense>
            <v-col cols="12" sm="3" md="2" lg="2">
              <label class="body-2">
                EMAIL ADDRESS
              </label>
            </v-col>
            <v-col cols="12" sm="9" md="7" lg="7">
              <v-text-field :value="cf1_data.email_address" class="body-2" hide-details readonly dense/>
            </v-col>

            <v-col cols="12" sm="3"  md="1" lg="1" class="text-md-right">
              <label class="body-2">
                ZIPCODE
              </label>
            </v-col>
            <v-col cols="12" sm="9" md="2" lg="2">
              <v-text-field  :value="cf1_data.zip_code" class="body-2" hide-details readonly dense/>
            </v-col>
          </v-row>

        </div>

        <div v-show="cf1_data.patient_is !== 'M'" >
          <v-divider class="mt-6"/>
          <v-row wrap class="my-1">
            <v-col cols="12" sm="12" md="12" lg="12">
              <h3 class="section-title">PATIENT INFORMATION
                <span class="text-caption font-weight-regular font-italic">
                  (If dependent)
                </span>
              </h3>
            </v-col>
          </v-row>

          <v-divider/>

          <div class="for-print">
            <v-row class="mt-4" dense align="center">
              <v-col cols="12" sm="12" md="2" lg="2" class="text-left">
                <label class="body-2">
                  NAME OF PATIENT
                </label>
              </v-col>
    
              <v-col cols="12" sm="6" md="3" lg="3">
                <v-text-field :value="cf1_data.patient_first_name" class="body-2" hide-details readonly dense/>
                <h5 class="font-weight-light text-center">
                  First Name
                </h5>
              </v-col>

              <v-col cols="12" sm="6" md="3" lg="3">
                <v-text-field :value="cf1_data.patient_middle_name" class="body-2" hide-details readonly dense/>
                <h5 class="font-weight-light text-center">
                  Middle Name
                </h5>
              </v-col>

              <v-col cols="12" sm="9" md="3" lg="3">
                <v-text-field :value="cf1_data.patient_last_name" class="body-2" hide-details readonly dense/>
                <h5 class="font-weight-light text-center">
                  Last Name
                </h5>
              </v-col>

              <v-col cols="12" sm="3" md="1" lg="1">
                <v-text-field class="body-2" hide-details readonly dense/>
                <h5 class="font-weight-light text-center">
                  Suffix
                </h5>
              </v-col>
            </v-row>

            <v-row align="center" class="mt-4" dense>
              <v-col cols="12" sm="3" md="2" lg="2">
                <label class="body-2">
                  PATIENT PIN
                </label>
              </v-col>
              <v-col cols="12" sm="9" md="3" lg="3">
                <v-text-field :value="cf1_data.patient_pin" class="body-2" hide-details readonly dense/>
              </v-col>

              <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right">
                <label class="body-2">
                  DATE OF BIRTH
                </label>
              </v-col>
              <v-col cols="12" sm="4" md="2" lg="2">
                <v-text-field :value="cf1_data.patient_birth_date" class="body-2" hide-details readonly dense/>
              </v-col>

              <v-col cols="12" sm="1" md="1" lg="1" class="text-md-right">
                <label class="body-2">
                  GENDER
                </label>
              </v-col>

              <v-col cols="12" sm="4" md="2" lg="2">
                  <v-text-field :value="cf1_data.patient_sex ? (cf1_data.patient_sex === 'M' ? 'Male' : 'Female') : ''" class="body-2" hide-details readonly dense />
              </v-col>
            </v-row>
          </div>
        </div>

        <v-divider class="mt-6"/>

        <v-row wrap class="my-1">
          <v-col cols="12" sm="12" md="12" lg="12">
            <h3 class="section-title">EMPLOYER INFORMATION </h3>
          </v-col>
        </v-row>

        <v-divider/>

        <div class="for-print">
           <v-row align="center" class="mt-4" dense>
            <v-col cols="12" sm="3" md="2" lg="2">
              <label class="body-2">
                EMPLOYER NAME
              </label>
            </v-col>
            <v-col cols="12" sm="9" md="6" lg="6">
              <v-text-field :value="cf1_data.employer_name" class="body-2" hide-details readonly dense/>
            </v-col>

            <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right">
              <label class="body-2">
                EMPLOYER PIN
              </label>
            </v-col>
            <v-col cols="12" sm="4" md="2" lg="2">
              <v-text-field :value="cf1_data.pen" class="body-2" hide-details readonly dense/>
            </v-col>
          </v-row>
        </div>

        <v-divider class="mt-12"/>
    </div>
</template>

<script>
import { philhealth_indirect_list,philhealth_direct_list } from '@/reference/additional-info-libraries.json'

export default {
  props: ['cf1_data','claim_info'],

  data() {
    return {
      membership_type: [
        ...philhealth_indirect_list,
        ...philhealth_direct_list
      ] 
    }
  },

  computed: {
    get_membership_type_name() {
      const item = this.membership_type.find(
        val => val.category_code === this.cf1_data.membership_type
      )

      return item ? item.category_name : ''
    }
  }
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

  /* FOR EMPLOYER */

  .for-print .col-md-2 {
    flex: 0 0 16.666% !important;
    max-width: 16.666% !important;
  }

  .for-print .col-md-6 {
    flex: 0 0 50% !important;
    max-width: 50% !important;
  }

}
</style>