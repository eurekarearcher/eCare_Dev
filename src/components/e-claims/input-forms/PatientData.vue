<template>
  <div>
    <!-- HEALTHCARE INFORMATION -->
    <v-row wrap>
      <v-col cols="12" sm="4" md="4" lg="6">
        <h1 class="section-title">HEALTHCARE INSTITUTION</h1>
      </v-col>
      <v-col cols="12" sm="4" md="4" lg="6" class="text-right">
        <v-btn v-if="trans_detail.crd_claims_status && !!comment_data.cf2_part1" @click="displayComment('hci')" color="primary" tile depressed small>CHECK COMMENTS 
          <v-badge content="!" color="red">
            <v-icon class="pl-1" small>mdi-comment</v-icon>
          </v-badge>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    
    <v-row align="baseline" class="mt-4" wrap >
      <v-col cols="12" sm="7" md="6" lg="4">
        <h6 class="section-label">PHILHEALTH ACCREDITATION INFORMATION HCI</h6>
      </v-col>
      <v-col cols="12" sm="5" md="6" lg="8" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.hci_accreditation" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
    </v-row>

    <v-row align="baseline" class="mt-4" wrap>
      <v-col cols="12" sm="7" md="6" lg="4">
        <h6 class="section-label">NAME OF HEALTHCARE INSTITUTION</h6>
      </v-col>
      <v-col cols="12" sm="5" md="6" lg="8" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.hci_name" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
    </v-row>

    <v-row align="baseline" class="mt-4" wrap>
      <v-col cols="12" sm="4" md="2" lg="2">
        <h6 class="section-label">ADDRESS</h6>
      </v-col>
      <v-col cols="12" sm="8" md="10" lg="10" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.hci_address" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
    </v-row>

    <v-row align="baseline" class="mt-4" wrap>
      <v-col cols="12" sm="4" md="2" lg="2">
        <h6 class="section-label">HOSPITAL CODE</h6>
      </v-col>
      <v-col cols="12" sm="8" md="2" lg="3" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.hci_hosp_code" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" md="4" lg="3" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
        <h6 class="section-label">HOSPITAL TRANSMITAL CODE</h6>
      </v-col>
      <v-col cols="12" sm="8" md="4" lg="4" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.hci_hosp_trans_code" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
    </v-row>

    <!-- MEMBER INFORMATION -->
    <v-row class="mt-5" wrap>
      <v-col cols="12" sm="4" md="4" lg="6">
        <h1 class="section-title">MEMBER</h1>
      </v-col>
      <v-col cols="12" sm="4" md="4" lg="6" class="text-right">
        <v-tabs v-if="trans_detail.host_claim_type !== 'FOR PHIC CLAIMS'" height="30" right hide-slider>
          <v-tab :class="member_tab === 'phic' ? 'active-tab' : 'non-active-tab'" @click="member_tab = 'phic'">PHIC</v-tab>
          <v-tab :class="member_tab === 'hmo' ? 'active-tab' : 'non-active-tab'" @click="member_tab = 'hmo'">HMO</v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <div v-if="member_tab === 'phic'">
      <v-row class="text-center mt-4" dense>
        <v-col class="text-left" cols="12" sm="3" md="2" lg="2">
          <label class="body-2">NAME</label>
        </v-col>
        <v-col class="pl-3 pl-sm-0" cols="6" sm="3" md="3" lg="3">
          <v-text-field v-model="patient_data.mem_fname" class="body-2" hide-details readonly dense></v-text-field>
          <h5 class="font-weight-light">First Name</h5>
        </v-col>
        <v-col class="pl-3 pl-sm-0" cols="6" sm="2" md="3" lg="3">
          <v-text-field v-model="patient_data.mem_mname" class="body-2" hide-details readonly dense></v-text-field>
          <h5 class="font-weight-light">Middle Name</h5>
        </v-col>
        <v-col class="pl-3 pl-sm-0" cols="6" sm="3" md="3" lg="3">
          <v-text-field v-model="patient_data.mem_lname" class="body-2" hide-details readonly dense></v-text-field>
          <h5 class="font-weight-light">Last Name</h5>
        </v-col>
        <v-col class="pl-3 pl-sm-0" cols="6" sm="1" md="1" lg="1">
          <v-text-field v-model="patient_data.mem_suffix" class="body-2" hide-details readonly dense></v-text-field>
          <h5 class="font-weight-light">Suffix</h5>
        </v-col>
      </v-row>

      <v-row align="baseline" wrap mt-4>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">MEMBER PIN</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_pin" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">TRACKING NO.</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="trans_detail.phic_tracking_number" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      <v-row align="baseline" wrap mt-4>
        <v-col xs12 sm3 md2 lg2>
          <label class="body-2">MEMBER CATEGORY</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_category" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">BIRTHDAY</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_birthday" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      <v-row align="baseline" class="mt-4" wrap>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">AGE</label>
        </v-col>
        <v-col cols="12" sm="2" md="1" lg="1" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_age" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>

        <v-col cols="12" sm="2" md="1" lg="1" class="text-sm-right pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">GENDER</label>
        </v-col>
        <v-col cols="12" sm="5" md="2" lg="2" class="pl-2">
          <v-text-field v-model="patient_data.mem_gender" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>

        <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">PHONE NO.</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_phone_no" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      <v-row align="baseline" class="mt-4" wrap>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">MOBILE NO.</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_mobile_no" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">EMAIL ADDRESS</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_email" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      <v-row align="baseline" class="mt-4" wrap>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">MAILING ADDRESS</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_mailing" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">ZIP CODE</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_zip_code" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      <v-row align="center" wrap>
        <v-col cols="12" sm="3" md="2" lg="2" class="pt-5">
          <label class="body-2">PATIENT IS A MEMBER?</label>
        </v-col>
        <v-col cols="12" sm="9" md="8" lg="8">
          <v-radio-group v-model="patient_data.pat_mem_type" hide-details readonly row>
            <v-radio value="1" label="YES"></v-radio>
            <v-radio value="0" label="NO"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    </div>

    <div v-else>
      <v-row class="text-center mt-4" dense>
        <v-col class="text-left" cols="12" sm="3" md="2" lg="2">
          <label class="body-2">NAME</label>
        </v-col>
        <v-col class="pl-3 pl-sm-0" cols="6" sm="3" md="3" lg="3">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_first_name" class="body-2" hide-details readonly dense></v-text-field>
          <h5 class="font-weight-light">First Name</h5>
        </v-col>
        <v-col class="pl-3 pl-sm-0" cols="6" sm="2" md="3" lg="3">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_middle_name" class="body-2" hide-details readonly dense></v-text-field>
          <h5 class="font-weight-light">Middle Name</h5>
        </v-col>
        <v-col class="pl-3 pl-sm-0" cols="6" sm="3" md="3" lg="3">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_last_name" class="body-2" hide-details readonly dense></v-text-field>
          <h5 class="font-weight-light">Last Name</h5>
        </v-col>
        <v-col class="pl-3 pl-sm-0" cols="6" sm="1" md="1" lg="1">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_suffix" class="body-2" hide-details readonly dense></v-text-field>
          <h5 class="font-weight-light">Suffix</h5>
        </v-col>
      </v-row>

      <v-row align="baseline" class="mt-4" wrap>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">COMPANY NAME</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_company_name" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">BIRTHDAY</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_birthdate" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      <v-row align="baseline" class="mt-4" wrap>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">AGE</label>
        </v-col>
        <v-col cols="12" sm="2" md="1" lg="1" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_age" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>

        <v-col cols="12" sm="2" md="1" lg="1" class="text-sm-right pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">GENDER</label>
        </v-col>
        <v-col cols="12" sm="5" md="2" lg="2" class="pl-2">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_gender" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>

        <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">MOBILE NO.</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_mobile_number" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      <v-row align="baseline" class="mt-4" wrap>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">MEMBER TYPE</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_hmo_type" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">EMAIL ADDRESS</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_email_address" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      <v-row align="baseline" class="mt-4" wrap>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">POLICY NUMBER</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_hmo_policy_number" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">EXPIRY DATE</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_hmo_expiry_date" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      <v-row align="baseline" class="mt-4" wrap>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">PRE EXISTING</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_hmo_preexist" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">STATUS</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_hmo_status" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      <v-row align="baseline" wrap mt-4>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">PLAN CODE</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_plan_code" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">ROOM AND BOARD PLANS</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_room_plan" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      
      <v-row align="baseline" class="mt-4" wrap>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">HOST CODE</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_hmo_host_code" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
          <label class="body-2">PHIC STATUS</label>
        </v-col>
        <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_phic_status" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      <v-row align="baseline" class="mt-4" wrap>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">DENTAL</label>
        </v-col>
        <v-col cols="12" sm="5" md="5" lg="10" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_dental" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>

      <v-row align="baseline" wrap mt-4>
        <v-col cols="12" sm="3" md="2" lg="2">
          <label class="body-2">WAIVER</label>
        </v-col>
        <v-col cols="12" sm="5" md="5" lg="10" class="pl-2 pl-sm-0">
          <v-text-field v-model="patient_data.mem_hmo_data.mem_waiver" class="body-2" hide-details readonly dense></v-text-field>
        </v-col>
      </v-row>
    </div>

    <!-- PATIENT INFORMATION -->
    <v-row class="mt-5" wrap>
      <v-col cols="12" sm="2" md="4" lg="6">
        <h1 class="section-title">PATIENT INFORMATION</h1>
      </v-col>
      <v-col cols="12" sm="2" md="4" lg="6" class="text-right">
        <v-btn v-if="trans_detail.crd_claims_status && !!comment_data.cf2_part2_number1" @click="displayComment('pat_info')" color="primary" tile depressed small>CHECK COMMENTS 
          <v-badge content="!" color="red">
            <v-icon class="pl-1" small>mdi-comment</v-icon>
          </v-badge>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-row class="text-center mt-4" dense>
      <v-col class="text-left" cols="12" sm="3" md="2" lg="2">
        <label class="body-2">NAME</label>
      </v-col>
      <v-col class="pl-3 pl-sm-0" cols="6" sm="3" md="3" lg="3">
        <v-text-field v-model="patient_data.pat_fname" class="body-2" hide-details readonly dense></v-text-field>
        <h5 class="font-weight-light">First Name</h5>
      </v-col>
      <v-col class="pl-3 pl-sm-0" cols="6" sm="2" md="3" lg="3">
        <v-text-field v-model="patient_data.pat_mname" class="body-2" hide-details readonly dense></v-text-field>
        <h5 class="font-weight-light">Middle Name</h5>
      </v-col>
      <v-col class="pl-3 pl-sm-0" cols="6" sm="3" md="3" lg="3">
        <v-text-field v-model="patient_data.pat_lname" class="body-2" hide-details readonly dense></v-text-field>
        <h5 class="font-weight-light">Last Name</h5>
      </v-col>
      <v-col class="pl-3 pl-sm-0" cols="6" sm="1" md="1" lg="1">
        <v-text-field v-model="patient_data.pat_suffix" class="body-2" hide-details readonly dense></v-text-field>
        <h5 class="font-weight-light">Suffix</h5>
      </v-col>
    </v-row>

    <v-row align="baseline" class="mt-4" wrap>
      <v-col cols="12" sm="3" md="2" lg="2">
        <label class="body-2">MEMBER PIN</label>
      </v-col>
      <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.pat_pin" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
      <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
        <label class="body-2">TRACKING NO.</label>
      </v-col>
      <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
        <v-text-field v-model="trans_detail.phic_tracking_number" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
    </v-row>

    <v-row align="baseline" class="mt-4" wrap>
      <v-col cols="12" sm="3" md="2" lg="2">
        <label class="body-2">MEMBER CATEGORY</label>
      </v-col>
      <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.pat_category" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
      <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
        <label class="body-2">BIRTHDAY</label>
      </v-col>
      <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.pat_birthday" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
    </v-row>

    <v-row align="baseline" wrap mt-4>
      <v-col cols="12" sm="3" md="2" lg="2">
        <label class="body-2">AGE</label>
      </v-col>
      <v-col cols="12" sm="2" md="1" lg="1" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.pat_age" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>

      <v-col cols="12" sm="2" md="1" lg="1" class="text-sm-right pt-4 pt-sm-6 pt-md-0">
        <label class="body-2">GENDER</label>
      </v-col>
      <v-col cols="12" sm="5" md="2" lg="2" class="pl-2">
        <v-text-field v-model="patient_data.pat_gender" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>

      <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
        <label class="body-2">PHONE NO.</label>
      </v-col>
      <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.pat_phone_no" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
    </v-row>

    <v-row align="baseline" class="mt-4" wrap>
      <v-col cols="12" sm="3" md="2" lg="2">
        <label class="body-2">MOBILE NO.</label>
      </v-col>
      <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.pat_mobile_no" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
      <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
        <label class="body-2">EMAIL ADDRESS</label>
      </v-col>
      <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.pat_email" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
    </v-row>

    <v-row align="baseline" wrap mt-4>
      <v-col cols="12" sm="3" md="2" lg="2">
        <label class="body-2">MAILING ADDRESS</label>
      </v-col>
      <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.pat_mailing" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
      <v-col cols="12" sm="3" md="2" lg="2" class="text-md-right pr-2 pt-4 pt-sm-6 pt-md-0">
        <label class="body-2">ZIP CODE</label>
      </v-col>
      <v-col cols="12" sm="9" md="4" lg="4" class="pl-2 pl-sm-0">
        <v-text-field v-model="patient_data.pat_zip_code" class="body-2" hide-details readonly dense></v-text-field>
      </v-col>
    </v-row>

    <v-row align="center" wrap>
      <v-col cols="12" sm="2" md="2" lg="2" class="pt-5">
        <label class="body-2">RELATIONSHIP TO MEMBER</label>
      </v-col>
      <v-col cols="12" sm="4" md="8" lg="8">
        <v-radio-group v-model="patient_data.pat_relation" :disabled="patient_data.pat_mem_type !== 'DEPENDENT'" :readonly="!trans_detail.editable" @change="patient_data.status.relation = true, $emit('change-status')" hide-details row>
          <v-radio value="CHILD" label="CHILD"></v-radio>
          <v-radio value="PARENT" label="PARENT"></v-radio>
          <v-radio value="SPOUSE" label="SPOUSE"></v-radio>
          <v-btn v-if="trans_detail.editable && !!patient_data.pat_relation" @click="patient_data.pat_relation = '', patient_data.status.relation = true, $emit('change-status')" width="60" height="25" small>Clear</v-btn>
        </v-radio-group>
      </v-col>
    </v-row>

     <!-- EMPLOYER INFORMATION -->
    <v-row class="mt-5" wrap>
      <v-col cols="12" sm="2" md="4" lg="6">
        <h1 class="section-title">EMPLOYER INFORMATION</h1>
      </v-col>
      <v-col cols="12" sm="2" md="4" lg="6" class="text-right">
        <v-btn v-if="trans_detail.crd_claims_status && !!comment_data.cf2_part2_number1" @click="displayComment('pat_info')" color="primary" tile depressed small>CHECK COMMENTS 
          <v-badge content="!" color="red">
            <v-icon class="pl-1" small>mdi-comment</v-icon>
          </v-badge>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-4">
      <!-- <v-col cols="12" sm="3" class="mb"> 
        <h6 class="body-2">Search Employer <em>(optional)</em></h6>
        <v-menu :close-on-click="true" transition="scale-transition" max-height="300" offset-y bottom>
              <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" v-model="search_employer" @input="getEmployerData($event), search_employer = textCapitalize($event)" @click:clear="clearEmployerData" hide-details :loading="employer_loading" clearable  class="body-2 pl-sm-0">
                  </v-text-field>
              </template>
              <v-list v-if="employer_list.length >= 1">
                <v-list-item v-for="(item, key) in employer_list" :key="key" @click="selectMemberEmployer(item)"> 
                  <span class="body-1"> {{ item.name }}</span>
                </v-list-item>
              </v-list>
              <v-list v-else>
                <v-list-item > 
                  <span class="body-1 font-italic"> No records found...</span>
                </v-list-item>
              </v-list>
          </v-menu>
      </v-col> -->

      <v-col cols="12" sm="3">
        <h6 class="body-2">Employer Philhealth Number <em>(optional)</em></h6>
        <v-text-field v-model="patient_data.mem_employer_phic_pin" @keydown.enter.prevent @input="patient_data.mem_employer_phic_pin = textCapitalize($event)"  maxlength="20" class="body-2 pl-sm-0" ></v-text-field>
      </v-col>
      
      <v-col cols="12" sm="3">
        <h6 class="body-2">Employer Name <em>(optional)</em></h6>
        <v-text-field  v-model="patient_data.mem_company_name" @keydown.enter.prevent @input="patient_data.mem_company_name = textCapitalize($event)" maxlength="60" class="body-2 pl-sm-0"></v-text-field>
      </v-col>

      <v-col cols="12" sm="3">
        <h6 class="body-2">Employer Address <em>(optional)</em></h6>
        <v-text-field v-model="patient_data.mem_company_address" @keydown.enter.prevent @input="patient_data.mem_company_address = textCapitalize($event)"  maxlength="80" class="body-2 pl-sm-0"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- COMMENT DIALOG -->
    <v-dialog v-model="comment_dialog" width="500" persistent>
      <v-card>
        <h3 class="grey--text text--darken-3 font-weight-medium py-2 text-center">{{ comment_title }} COMMENT</h3>
        <v-textarea v-model="comment_content" rows="4" class="body-2 px-4" outlined readonly hide-details></v-textarea>
        <v-row justify="center" class="mt-3 pb-3" wrap>
          <v-btn @click="comment_dialog = false" class="ml-1" color="primary" small>CLOSE</v-btn>
        </v-row>
      </v-card>
    </v-dialog>

    <!-- NAVIGATION BUTTON -->
    <v-divider class="my-5"></v-divider>
    <v-row justify="end" wrap>
      <v-col cols="12" sm="2" md="5" lg="5" class="text-right">
        <v-btn @click="$router.push('/input-forms/patient-confinement')" color="primary">NEXT<i class="fas fa-arrow-right ml-1"></i></v-btn>
      </v-col>
    </v-row>

    <Alert :alert="alert" />
  </div>
</template>

<script>
import Alert from '../../Alert.vue'

export default {
  props: ['trans_detail', 'comment_data'],

  components: {
    Alert
  },

  created(){
    this.getPatientData();
  },

  data(){
    return{
      patient_data: {
        hci_accreditation: '',
        hci_name: '',
        hci_address: '',
        hci_hosp_code: '',
        hci_hosp_trans_code: '',
        mem_fname: '',
        mem_mname: '',
        mem_lname: '',
        mem_suffix: '',
        mem_pin: '',
        mem_category: '',
        mem_birthday: '',
        mem_age: '',
        mem_gender: '',
        mem_phone_no: '',
        mem_mobile_no: '',
        mem_email: '',
        mem_mailing: '',
        mem_zip_code: '',
        mem_hmo_data: {
          mem_age: '',
          mem_birthdate: '',
          mem_company_name: '',
          mem_dental: '',
          mem_email_address: '',
          mem_first_name: '',
          mem_gender: '',
          mem_hmo_expiry_date: '',
          mem_hmo_policy_number: '',
          mem_hmo_preexist: '',
          mem_hmo_status: '',
          mem_hmo_type: '',
          mem_hmo_host_code: '',
          mem_last_name: '',
          mem_middle_name: '',
          mem_mobile_number: '',
          mem_phic_status: '',
          mem_plan_code: '',
          mem_room_plan: '',
          mem_room_rate: '',
          mem_suffix: '',
          mem_waiver: ''
        },

        pat_mem_type: '',
        pat_fname: '',
        pat_mname: '',
        pat_lname: '',
        pat_suffix: '',
        pat_pin: '',
        pat_category: '',
        pat_birthday: '',
        pat_age: '',
        pat_gender: '',
        pat_phone_no: '',
        pat_mobile_no: '',
        pat_email: '',
        pat_mailing: '',
        pat_zip_code: '',
        pat_relation: '',
        status: {
          relation: false
        }
      },
      member_tab: 'phic',
      alert: {},

      // COMMENTS
      comment_dialog: false,
      comment_title: '',
      comment_content: '',

      employer_list: [],
      search_employer: '',
      search_emp_time_out: null,
      employer_loading: false
    }
  },

  methods: {
    // GET PATIENT DATA
    // getPatientData(){
    //   let patient_data = sessionStorage.getItem('ET534D') ? this.$crypto.AES.decrypt(sessionStorage.getItem('ET534D'), 'fgXSd45d').toString(this.$crypto.enc.Utf8) : null
    //   if(patient_data === null){
    //     this.$axios.post(this.$tms_url+'resources/api/_get_transaction_ip_ptd.php', this.$qs.stringify({
    //       post_data: this.wsDataEncryption(JSON.stringify({
    //         phic_tracking_number: this.trans_detail.phic_tracking_number,
    //         transaction_number: this.trans_detail.transaction_number
    //       }))
    //     }))
    //     .then(response => {
    //       response.data = this.responseDataDecryption(response.data)
    //       let transaction_data = response.data.TRANSACTION
    //       let patient_data = response.data.PATIENT_DATA
    //       let principal_data = response.data.PRINCIPAL_DATA ? response.data.PRINCIPAL_DATA : ''

    //       this.patient_data = {
    //         hci_accreditation: transaction_data.prov_phic_accreditation_number,
    //         hci_name: transaction_data.provider_name,
    //         hci_address: transaction_data.provider_address,
    //         hci_hosp_code: transaction_data.hospital_code,
    //         hci_hosp_trans_code: transaction_data.hospital_transmittal_code,

    //         mem_fname: principal_data.first_name,
    //         mem_mname: principal_data.middle_name,
    //         mem_lname: principal_data.last_name,
    //         mem_suffix: principal_data.suffix,
    //         mem_pin: principal_data.mem_phic_pin,
    //         mem_category: '',
    //         mem_birthday: this.formatDate(principal_data.birthday),
    //         mem_age: principal_data.age,
    //         mem_gender: principal_data.gender,
    //         mem_phone_no: principal_data.phone_no,
    //         mem_mobile_no: principal_data.mobile_no,
    //         mem_email: principal_data.email_add,
    //         mem_mailing: principal_data.mailing_add,
    //         mem_zip_code: principal_data.zip_code,
    //         mem_hmo_data: {},

    //         pat_mem_type: patient_data.member_type,
    //         pat_fname: patient_data.first_name,
    //         pat_mname: patient_data.middle_name,
    //         pat_lname: patient_data.last_name,
    //         pat_suffix: patient_data.suffix,
    //         pat_pin: patient_data.mem_phic_pin,
    //         pat_ek_phic_id: patient_data.ek_phic_id,
    //         pat_category: '',
    //         pat_birthday: this.formatDate(patient_data.birthday),
    //         pat_age: patient_data.age,
    //         pat_gender: patient_data.gender,
    //         pat_phone_no: patient_data.phone_no,
    //         pat_mobile_no: patient_data.mobile_no,
    //         pat_email: patient_data.email_add,
    //         pat_mailing: patient_data.mailing_add,
    //         pat_zip_code: patient_data.zip_code,
    //         pat_relation: patient_data.patient_rel_to_member,
    //         status: {
    //           relation: false
    //         }
    //       }
          
    //       // PCI
    //       let confinement_period = {
    //         date_admitted: transaction_data.date_admitted,
    //         date_discharged: transaction_data.date_discharged,
    //       }

    //       // PEX
    //       let pertinent_lab = {
    //         data: response.data.PERTINENT_LABORATORY.length === 0 ? [
    //           {
    //             date_of_lab: '',
    //             description: ''
    //           }
    //         ] : response.data.PERTINENT_LABORATORY,
    //         status: false
    //       }
    //       pertinent_lab.data.forEach(element => {
    //         element.date_of_lab_date = element.date_of_lab 
    //         element.date_of_lab = this.formatDate(element.date_of_lab)
    //       })

    //       // CIW
    //       let doctors_order = {
    //         data: response.data.COURSE_IN_THE_WARD.length === 0 ? [
    //           {
    //             date: '',
    //             doctors_order: ''
    //           }
    //         ] : response.data.COURSE_IN_THE_WARD,
    //         status: false
    //       }
    //       doctors_order.data.forEach(element => {
    //         element.date_date = element.date 
    //         element.date = this.formatDate(element.date)
    //       })

    //       // AAS
    //       let aas_data = {
    //         section1: response.data.PHIC_DOCTOR,
    //         section2: {
    //           patient_birthdate: null,
    //           patient_signature: null,
    //           hospital_signature: null,
    //           doctor_signature: response.data.PHIC_DOCTOR[0].doctor_is_signed == '0' ? null : '2'
    //         },
    //         status: {
    //           doctor: false
    //         }
    //       }
    //       aas_data.section1.forEach(element => {
    //         element.doc_fullname = element.doctor_name,
    //         element.date_signed_date = element.date_signed
    //         element.date_signed = this.formatDate(element.date_signed_date ? element.date_signed_date.substring(0, 10) : element.date_signed_date)
    //       })

    //       // CTF
    //       let ctf_data = {
    //         phic_ben_is_enough: response.data.CERTIFICATION.phic_ben_is_enough,
    //         total_health_inst_fees: response.data.CERTIFICATION.total_health_inst_fees,
    //         total_professional_fees: response.data.CERTIFICATION.total_professional_fees,
    //         grand_total: response.data.CERTIFICATION.grand_total,

    //         co_hcf_total_actual_charges: response.data.CERTIFICATION.co_hcf_total_actual_charges,
    //         co_hcf_phic_benefit: response.data.CERTIFICATION.co_hcf_phic_benefit,
    //         co_hcf_amt_after_dsct: response.data.CERTIFICATION.co_hcf_amt_after_dsct,
    //         co_hcf_amt_after_phic_deduc: response.data.CERTIFICATION.co_hcf_amt_after_phic_deduc,
    //         co_hcf_paid_by: response.data.CO_HCF_PAID_BY,

    //         co_pf_total_actual_charges: response.data.CERTIFICATION.co_pf_total_actual_charges,
    //         co_pf_phic_benefit: response.data.CERTIFICATION.co_pf_phic_benefit,
    //         co_pf_amt_after_dsct: response.data.CERTIFICATION.co_pf_amt_after_dsct,
    //         co_pf_amt_after_phic_deduc: response.data.CERTIFICATION.co_pf_amt_after_phic_deduc,
    //         co_pf_paid_by: response.data.CO_PF_PAID_BY,
            
    //         nco_total_cost_med_sup: response.data.CERTIFICATION.nco_total_cost_med_sup,
    //         nco_total_cost_diagnostic_laboratory: response.data.CERTIFICATION.nco_total_cost_diagnostic_laboratory,
    //         total_cpt_amount: response.data.TOTAL_CPT_AMOUNT,

    //         status: {
    //           certification: false,
    //           co_hcf_paid_by: false,
    //           co_pf_paid_by: false
    //         }
    //       }
          
    //       let philhealth_certification = {
    //         co_hcf_total_actual_charges: response.data.CERTIFICATION.co_hcf_total_actual_charges,
    //         co_pf_total_actual_charges: response.data.CERTIFICATION.co_pf_total_actual_charges,
    //         phic_ben_is_enough: response.data.CERTIFICATION.phic_ben_is_enough
    //       }

    //       if(this.trans_detail.host_claim_type === 'FOR PHIC CLAIMS'){
    //         this.saveData();
    //         sessionStorage.setItem('VKI55S', this.$crypto.AES.encrypt(JSON.stringify(confinement_period), 'flag423D'))
    //         sessionStorage.setItem('PGF04S', this.$crypto.AES.encrypt(JSON.stringify(pertinent_lab), 'Fo34S40s'))
    //         sessionStorage.setItem('LG4S04', this.$crypto.AES.encrypt(JSON.stringify(doctors_order), '5s05SLFI'))
    //         sessionStorage.setItem('GLORS6', this.$crypto.AES.encrypt(JSON.stringify(aas_data), 'dspof43S'))
    //         sessionStorage.setItem('kgdlDt', this.$crypto.AES.encrypt(JSON.stringify(philhealth_certification), 'vcoF535f'))

    //         sessionStorage.setItem('rtYIWs4', this.$crypto.AES.encrypt(JSON.stringify(ctf_data), 'pfdFxg44'))
    //         sessionStorage.setItem('LTRRTS', this.$crypto.AES.encrypt(this.patient_data.pat_fname + ' '  + (this.patient_data.pat_mname ? this.patient_data.pat_mname : '') + ' ' + this.patient_data.pat_lname + ' ' + (this.patient_data.pat_suffix ? this.patient_data.pat_suffix : ''), 'gGd43fsg'))
    //         this.$store.commit('set_loading_category', false)
    //       }else{
    //         this.$axios.post(this.$cms_url+'resources/api/_get_transaction_ip_ptd_hmo.php', this.$qs.stringify({
    //           post_data: this.wsDataEncryption(JSON.stringify({
    //             phic_tracking_number: this.trans_detail.phic_tracking_number,
    //             transaction_number: this.trans_detail.transaction_number,
    //             phic_member_eligibility_status: this.trans_detail.phic_member_eligibility_status === 'N/A' ? null : this.trans_detail.phic_member_eligibility_status
    //           }))
    //         }))
    //         .then(response => {
    //           this.patient_data.mem_hmo_data = this.responseDataDecryption(response.data)
    //           this.patient_data.mem_hmo_data.mem_birthdate = this.formatDate(this.patient_data.mem_hmo_data.mem_birthdate)
    //           this.patient_data.mem_hmo_data.mem_hmo_expiry_date = this.formatDate(this.patient_data.mem_hmo_data.mem_hmo_expiry_date)
              
    //           this.saveData();
    //           sessionStorage.setItem('VKI55S', this.$crypto.AES.encrypt(JSON.stringify(confinement_period), 'flag423D'))
    //           sessionStorage.setItem('PGF04S', this.$crypto.AES.encrypt(JSON.stringify(pertinent_lab), 'Fo34S40s'))
    //           sessionStorage.setItem('LG4S04', this.$crypto.AES.encrypt(JSON.stringify(doctors_order), '5s05SLFI'))
    //           sessionStorage.setItem('GLORS6', this.$crypto.AES.encrypt(JSON.stringify(aas_data), 'dspof43S'))
    //           sessionStorage.setItem('kgdlDt', this.$crypto.AES.encrypt(JSON.stringify(philhealth_certification), 'vcoF535f'))
              
    //           sessionStorage.setItem('rtYIWs4', this.$crypto.AES.encrypt(JSON.stringify(ctf_data), 'pfdFxg44'))
    //           sessionStorage.setItem('LTRRTS', this.$crypto.AES.encrypt(this.patient_data.pat_fname + ' '  + (this.patient_data.pat_mname ? this.patient_data.pat_mname : '') + ' ' + this.patient_data.pat_lname + ' ' + (this.patient_data.pat_suffix ? this.patient_data.pat_suffix : ''), 'gGd43fsg'))
    //           this.$store.commit('set_loading_category', false)
    //         })
    //         .catch(error => {
    //           this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
    //         })
    //       }
    //     })
    //     // .catch(error => {
    //     //   this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
    //     // })
    //   }else{
    //     this.patient_data = JSON.parse(patient_data)
    //     this.$store.commit('set_loading_category', false)
    //   }
    // },

    selectMemberEmployer(item) {

      this.search_employer = item.name
      this.patient_data = {
        ...this.patient_data,
        mem_company_name: item.name,
        mem_company_address: item.address,
        mem_employer_phic_pin: item.philhealthno
      }
    },

    clearEmployerData() {
      this.search_employer = ''
      this.patient_data.mem_company_name = ''
      this.patient_data.mem_company_address = ''
      this.patient_data.mem_employer_phic_pin = ''
    },

    getEmployerData(value) {
      clearTimeout(this.search_emp_time_out)
      if(value){
        this.search_emp_time_out = setTimeout(() => {
          this.getEclaimsWebService()
        }, 800)
      }
    },

    //STATIC SEARCH EMPLOYER
    async getEclaimsWebService() {
      this.employer_loading = true
      let response = await this.$services.getEclaimsWebService({
        request_key: "SEM",
        provider_code: 'EKDF21B239E8232403',
        data: {
          //philhealthno: this.search_employer, 
          employername: this.search_employer,
        }
      });

      if (response.status === 200) {
        this.employer_loading = false
        response.data = this.responseDataDecryption(response.data)

        this.employer_list = response.data.employers
      }
    },

    async getPatientData(){

      let patient_data = sessionStorage.getItem('ET534D') ? this.$crypto.AES.decrypt(sessionStorage.getItem('ET534D'), 'fgXSd45d').toString(this.$crypto.enc.Utf8) : null
      if(patient_data === null){
        let response = await this.$services.getEclaims({
              request_key: 'patient_data',
              provider_code: this.$store.state.prv_data.provider_code,
              ek_lgu_id: this.trans_detail.ek_lgu_id,
              transaction_number: this.trans_detail.transaction_number,
              migrated_to_eclaim_table: this.trans_detail.migrated_to_eclaim_table,
              claim_no: this.trans_detail.claim_no,
              ph_category: this.trans_detail.phic_packages
        });

        if (response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          let transaction_data = response.data.TRANSACTION
          let patient_data = response.data.PATIENT_DATA
          let principal_data = response.data.PRINCIPAL_DATA ? response.data.PRINCIPAL_DATA : ''

          this.patient_data = {
            hci_accreditation: transaction_data.prov_phic_accreditation_number,
            hci_name: transaction_data.provider_name,
            hci_address: transaction_data.provider_address,
            hci_hosp_code: transaction_data.hospital_code,
            hci_hosp_trans_code: transaction_data.hospital_transmittal_code,

            mem_fname: principal_data.first_name,
            mem_mname: principal_data.middle_name,
            mem_lname: principal_data.last_name,
            mem_suffix: principal_data.suffix,
            mem_pin: principal_data.mem_phic_pin,
            mem_category: principal_data.mem_phic_membership_type,
            mem_birthday: this.formatDate(principal_data.birthday),
            mem_age: principal_data.age,
            mem_gender: principal_data.gender,
            mem_phone_no: principal_data.phone_no,
            mem_mobile_no: principal_data.mobile_no,
            mem_email: principal_data.email_add,
            mem_mailing: principal_data.mailing_add,
            mem_zip_code: principal_data.zip_code,
            mem_company_name: principal_data.mem_company_name,
            mem_employer_phic_pin: principal_data.mem_employer_phic_pin,
            mem_company_address: principal_data.mem_company_address,
            mem_hmo_data: {},

            pat_mem_type: patient_data.is_patient,
            pat_fname: patient_data.first_name,
            pat_mname: patient_data.middle_name,
            pat_lname: patient_data.last_name,
            pat_suffix: patient_data.suffix,
            pat_pin: patient_data.mem_phic_pin,
            pat_ek_phic_id: patient_data.ek_phic_id,
            pat_category: patient_data.mem_phic_membership_type,
            pat_birthday: this.formatDate(patient_data.birthday),
            pat_age: patient_data.age,
            pat_gender: patient_data.gender,
            pat_phone_no: patient_data.phone_no,
            pat_mobile_no: patient_data.mobile_no,
            pat_email: patient_data.email_add,
            pat_mailing: patient_data.mailing_add,
            pat_zip_code: patient_data.zip_code,
            pat_relation: patient_data.patient_rel_to_member,
            status: {
              relation: false
            }
          }
          
          // PCI
          let confinement_period = {
            date_admitted: transaction_data.date_admitted,
            date_discharged: transaction_data.date_discharged,
          }

          // PEX
          let pertinent_lab = {
            data: response.data.PERTINENT_LABORATORY.length === 0 ? [
              {
                date_of_lab: '',
                description: ''
              }
            ] : response.data.PERTINENT_LABORATORY,
            status: false
          }
          pertinent_lab.data.forEach(element => {
            element.date_of_lab_date = element.date_of_lab 
            element.date_of_lab = this.formatDate(element.date_of_lab)
          })

          // CIW
          let doctors_order = {
            data: response.data.COURSE_IN_THE_WARD.length === 0 ? [
              {
                date: '',
                doctors_order: ''
              }
            ] : response.data.COURSE_IN_THE_WARD,
            status: false
          }
          doctors_order.data.forEach(element => {
            element.date_date = element.date 
            element.date = this.formatDate(element.date)
          })
          // AAS
          let aas_data = {
            section1: response.data.PHIC_DOCTOR,
            section2: {
              patient_birthdate: null,
              patient_signature: this.trans_detail.patient_signature,
              hospital_signature: this.trans_detail.hospital_signature,
              doctor_signature: this.trans_detail.doctor_signature
            },
            status: {
              doctor: false
            }
          }
          aas_data.section1.forEach(element => {
            element.doc_fullname = element.doctor_name,
            element.date_signed_date = element.date_signed
            element.date_signed = this.formatDate(element.date_signed_date ? element.date_signed_date.substring(0, 10) : element.date_signed_date)
          })

          // CTF
          let ctf_data = {
            phic_ben_is_enough: response.data.CERTIFICATION.phic_ben_is_enough,
            total_health_inst_fees: response.data.CERTIFICATION.total_health_inst_fees,
            total_professional_fees: response.data.CERTIFICATION.total_professional_fees,
            grand_total: response.data.CERTIFICATION.grand_total,

            co_hcf_total_actual_charges: response.data.CERTIFICATION.co_hcf_total_actual_charges,
            co_hcf_phic_benefit: response.data.CERTIFICATION.co_hcf_phic_benefit,
            co_hcf_amt_after_dsct: response.data.CERTIFICATION.co_hcf_amt_after_dsct,
            co_hcf_amt_after_phic_deduc: response.data.CERTIFICATION.co_hcf_amt_after_phic_deduc,
            co_hcf_paid_by: response.data.CO_HCF_PAID_BY,

            co_pf_total_actual_charges: response.data.CERTIFICATION.co_pf_total_actual_charges,
            co_pf_phic_benefit: response.data.CERTIFICATION.co_pf_phic_benefit,
            co_pf_amt_after_dsct: response.data.CERTIFICATION.co_pf_amt_after_dsct,
            co_pf_amt_after_phic_deduc: response.data.CERTIFICATION.co_pf_amt_after_phic_deduc,
            co_pf_paid_by: response.data.CO_PF_PAID_BY,
            
            nco_total_cost_med_sup: response.data.CERTIFICATION.nco_total_cost_med_sup,
            nco_total_cost_diagnostic_laboratory: response.data.CERTIFICATION.nco_total_cost_diagnostic_laboratory,
            total_cpt_amount: response.data.TOTAL_CPT_AMOUNT,

            status: {
              certification: false,
              co_hcf_paid_by: false,
              co_pf_paid_by: false
            }
          }
          
          let philhealth_certification = {
            co_hcf_total_actual_charges: response.data.CERTIFICATION.co_hcf_total_actual_charges,
            co_pf_total_actual_charges: response.data.CERTIFICATION.co_pf_total_actual_charges,
            phic_ben_is_enough: response.data.CERTIFICATION.phic_ben_is_enough
          }

          this.trans_detail.host_claim_type = 'FOR PHIC CLAIMS'
          if(this.trans_detail.host_claim_type === 'FOR PHIC CLAIMS'){
            this.saveData();
            sessionStorage.setItem('VKI55S', this.$crypto.AES.encrypt(JSON.stringify(confinement_period), 'flag423D'))
            sessionStorage.setItem('PGF04S', this.$crypto.AES.encrypt(JSON.stringify(pertinent_lab), 'Fo34S40s'))
            sessionStorage.setItem('LG4S04', this.$crypto.AES.encrypt(JSON.stringify(doctors_order), '5s05SLFI'))
            sessionStorage.setItem('GLORS6', this.$crypto.AES.encrypt(JSON.stringify(aas_data), 'dspof43S'))
            sessionStorage.setItem('kgdlDt', this.$crypto.AES.encrypt(JSON.stringify(philhealth_certification), 'vcoF535f'))

            sessionStorage.setItem('rtYIWs4', this.$crypto.AES.encrypt(JSON.stringify(ctf_data), 'pfdFxg44'))
            sessionStorage.setItem('LTRRTS', this.$crypto.AES.encrypt(this.patient_data.pat_fname + ' '  + (this.patient_data.pat_mname ? this.patient_data.pat_mname : '') + ' ' + this.patient_data.pat_lname + ' ' + (this.patient_data.pat_suffix ? this.patient_data.pat_suffix : ''), 'gGd43fsg'))
            this.$store.commit('set_loading_category', false)
          }else{

            let response = await this.$services.getTransactionIpPtdHmo({
              phic_tracking_number: this.trans_detail.phic_tracking_number,
              transaction_number: this.trans_detail.transaction_number,
              phic_member_eligibility_status: this.trans_detail.phic_member_eligibility_status === 'N/A' ? null : this.trans_detail.phic_member_eligibility_status
            });

            if (response.status === 200) {
              this.patient_data.mem_hmo_data = this.responseDataDecryption(response.data)
              this.patient_data.mem_hmo_data.mem_birthdate = this.formatDate(this.patient_data.mem_hmo_data.mem_birthdate)
              this.patient_data.mem_hmo_data.mem_hmo_expiry_date = this.formatDate(this.patient_data.mem_hmo_data.mem_hmo_expiry_date)
              
              this.saveData();
              sessionStorage.setItem('VKI55S', this.$crypto.AES.encrypt(JSON.stringify(confinement_period), 'flag423D'))
              sessionStorage.setItem('PGF04S', this.$crypto.AES.encrypt(JSON.stringify(pertinent_lab), 'Fo34S40s'))
              sessionStorage.setItem('LG4S04', this.$crypto.AES.encrypt(JSON.stringify(doctors_order), '5s05SLFI'))
              sessionStorage.setItem('GLORS6', this.$crypto.AES.encrypt(JSON.stringify(aas_data), 'dspof43S'))
              sessionStorage.setItem('kgdlDt', this.$crypto.AES.encrypt(JSON.stringify(philhealth_certification), 'vcoF535f'))
              
              sessionStorage.setItem('rtYIWs4', this.$crypto.AES.encrypt(JSON.stringify(ctf_data), 'pfdFxg44'))
              sessionStorage.setItem('LTRRTS', this.$crypto.AES.encrypt(this.patient_data.pat_fname + ' '  + (this.patient_data.pat_mname ? this.patient_data.pat_mname : '') + ' ' + this.patient_data.pat_lname + ' ' + (this.patient_data.pat_suffix ? this.patient_data.pat_suffix : ''), 'gGd43fsg'))
              this.$store.commit('set_loading_category', false)
            } else{
              this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error.title, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
          }

        } else {
            this.alert = response.error;
        }
      }else{
        this.patient_data = JSON.parse(patient_data)
        this.$store.commit('set_loading_category', false)
      }
    },

    // DISPLAY COMMENT
    displayComment(data){
      if(data === 'hci'){
        this.comment_title = 'HEALTHCARE INSTITUTION'
        this.comment_content = this.comment_data.cf2_part1
      }else{
        this.comment_title = 'PATIENT INFORMATION'
        this.comment_content = this.comment_data.cf2_part2_number1
      }
      this.comment_dialog = true
    },

    // SAVE DATA TO SESSION STORAGE
    saveData(){
      sessionStorage.setItem('ET534D', this.$crypto.AES.encrypt(JSON.stringify(this.patient_data), 'fgXSd45d'))
    }
  },

  destroyed(){
    this.saveData();
  }
}
</script>

<style scoped>
.active-tab{
  background-color: #1976D2 !important;
  border-color: #1976D2 !important;
  color:white !important;
}
.non-active-tab{
  background-color: #eeeeee !important;
  border-color: #eeeeee !important;
}
</style>