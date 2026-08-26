<template>
  <div class="px-1">
    <v-card class="pb-5" outlined>
      <div class="primary white--text text-center py-4">
          <h4><v-icon size="20" left dark>mdi-card-account-details</v-icon>{{ process === 'EDIT' ? 'Edit Information' : 'Additional Information' }} </h4>
          <h5 class="font-weight-regular">Please fill out all required fields</h5>
      </div>

      <div v-if="member_data.length == 0"></div>
      <v-form v-else @submit.prevent="validateInformation" v-model="form_is_valid" :disabled="process !== 'REGISTRATION' && process !== 'ADD HOUSEHOLD' && process !== 'EDIT' && process !== 'OFFLINE TRANSACTION'" ref="form">
        <v-col cols="12" class="px-5 pt-10">
          <h6 class="body-1 font-weight-medium mb-3">Member Information</h6>
          <v-row align="end">
              <v-col cols="12" sm="3">
                <h6 class="content-item-title">First Name <span class="red--text">*</span></h6>
                <v-text-field 
                  v-model="member_data.mem_first_name" 
                  @keydown.enter.prevent 
                  @input="member_data.mem_first_name = textCapitalize($event)"
                  :class="[process === 'REGISTRATION' || process === 'ADD HOUSEHOLD' || process === 'OFFLINE TRANSACTION' ? 'text-primary' : process === 'EDIT' ? '' : 'text-disabled', 'body-2 pl-sm-0']" 
                  :rules="field_rules" 
                  :disabled="process !== 'EDIT'" maxlength="60">
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Middle Name (optional)</h6>
                <v-text-field 
                  v-model="member_data.mem_middle_name" 
                  @input="member_data.mem_middle_name = textCapitalize($event)"
                  @keypress="textOnly" :disabled="disable_from_masterlist" 
                  :class="[disable_from_masterlist ? 'text-primary' : '', 'body-2 pl-sm-0']" 
                  @keydown.enter.prevent maxlength="60" class="body-2 pl-sm-0">
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Last Name <span class="red--text">*</span></h6>
                <v-text-field 
                  v-model="member_data.mem_last_name"
                  @keydown.enter.prevent
                  @input="member_data.mem_last_name = textCapitalize($event)" 
                  :class="[process === 'REGISTRATION' || process === 'ADD HOUSEHOLD' || process === 'OFFLINE TRANSACTION' ? 'text-primary' : process === 'EDIT' ? '' : 'text-disabled', 'body-2 pl-sm-0']" 
                  :rules="field_rules"  
                  :disabled="process !== 'EDIT'" maxlength="60">
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Suffix </h6>
                <v-select 
                  v-model="member_data.mem_suffix" 
                  :items="['JR', 'SR', 'I', 'II', 'III', 'IV', 'V', 'VI']" 
                  :disabled="disable_from_masterlist" 
                  :class="[disable_from_masterlist ? 'text-primary' : '', 'body-2 pl-sm-0']"
                  clearable> 
                </v-select>
              </v-col>
          </v-row>

          <v-row align="end">
              <v-col cols="12" sm="3" >
                <h6 class="content-item-title">Birthdate  <span class="red--text">*</span></h6>
                <!-- <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                    <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="member_data.mem_birthdate" :error="!member_data.mem_birthdate" 
                          @keydown.enter.prevent 
                          :class="[process === 'REGISTRATION' || process === 'ADD HOUSEHOLD' || process === 'OFFLINE TRANSACTION' ? 'text-primary' : process === 'EDIT' ? '' : 'text-disabled', 'body-2 pl-sm-0']" 
                          :value="formatDate(member_data.mem_birthdate)" 
                          :disabled="process !== 'EDIT'" placeholder="MM-DD-YYYY"></v-text-field>
                    </template>
                    <v-date-picker v-model="member_data.mem_birthdate" no-title></v-date-picker>
                </v-menu> -->

                <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-model="member_data.mem_birthdate"
                      @input="formatBirthdate"
                      @keydown.enter.prevent
                      @keypress="numberOnly"
                      :disabled="process !== 'EDIT' && disable_from_masterlist"
                      :rules="verification_rules_birthdate"
                      :class="[
                        process === 'REGISTRATION' ||
                        process === 'ADD HOUSEHOLD' ||
                        process === 'OFFLINE TRANSACTION'
                          ? 'text-primary'
                          : process === 'EDIT'
                          ? ''
                          : 'text-disabled',
                        'body-2 pl-sm-0'
                      ]"
                      placeholder="MM-DD-YYYY"
                      maxlength="10"
                      dense
                    ></v-text-field>
                  </template>

                  <v-date-picker
                    v-model="birthdate_picker"
                    @change="member_data.mem_birthdate = formatDate(birthdate_picker)"
                    no-title
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="3" >
                <h6 class="content-item-title">Sex at Birth <span v-if="process === 'REGISTRATION' || process === 'ADD HOUSEHOLD' || process === 'OFFLINE TRANSACTION'" class="red--text">*</span></h6>
                <v-autocomplete 
                  v-model="member_data.mem_gender" 
                  :items="['MALE', 'FEMALE']" 
                  :rules="field_rules" 
                  :disabled="disable_from_masterlist" 
                  @keydown.enter.prevent 
                  :class="[disable_from_masterlist ? 'text-primary' : '', 'body-2 pl-sm-0']" 
                  clearable>
                </v-autocomplete>
              </v-col>

              <v-col cols="12" sm="3" > 
                <h6 class="content-item-title">Birthplace <span v-if="usr_credentials.department === 'Admission'" class="red--text">*</span></h6>
                <v-text-field v-model="member_data.mem_birthplace" @input="member_data.mem_birthplace = textCapitalize($event)" :rules="field_rules_admission" maxlength="100" @keydown.enter.prevent  class="body-2 pl-sm-0"></v-text-field>
              </v-col>

              <v-col cols="12" sm="3" >
                <v-row align="center" dense no-gutters>
                  <v-col cols="12" class="d-block"> 
                    <h6 class="content-item-title">E-mail <span v-if="usr_credentials.department === 'Admission'" class="red--text">*</span></h6>
                    <v-checkbox v-model="check_no_email" @change="checkEmail" label="Not Applicable" class="ma-0 pa-0 ml-n1" hide-details dense></v-checkbox>
                  </v-col>
                </v-row>
                
                <v-text-field v-model="member_data.mem_email_address" :rules="email_required" @keydown.enter.prevent :disabled="check_no_email" maxlength="60" class="body-2 pl-sm-0" type="email"  ref="email_field"></v-text-field>
              </v-col>
          </v-row>

          <v-row align="end">
              <v-col cols="12" sm="3" >
                <v-row align="center" dense no-gutters>
                  <v-col cols="12" class="d-block"> 
                    <h6 class="content-item-title" style="width: 100%;">Contact Number <span v-if="usr_credentials.department === 'Admission'" class="red--text">*</span></h6>
                    <v-checkbox v-model="check_no_contact" @change="checkNoContact" label="Not Applicable" class="ma-0 pa-0 ml-n1" hide-details dense></v-checkbox>
                  </v-col>
                </v-row>
                
                <!-- REMOVED REQUIRED CONTACT NUMBER -->
                <v-text-field v-model="member_data.mem_mobile_number" @keypress="numberOnly" @keydown.enter.prevent :disabled="check_no_contact"  :rules="contact_required" validate-on-blur class="body-2 pl-sm-0" maxlength="10" ref="mobile_field">
                    <h6 slot="prepend-inner" class="body-2" style="margin-top: 0.17em">+63</h6>
                </v-text-field>

                <!-- <v-text-field v-model="member_data.mem_mobile_number" @keypress="numberOnly" @keydown.enter.prevent :rules="contact_required" :disabled="check_no_contact"  validate-on-blur class="body-2 pl-sm-0" maxlength="10" ref="mobile_field">
                    <h6 slot="prepend-inner" class="body-2" style="margin-top: 0.17em">+63</h6>
                </v-text-field> -->
              </v-col>

              <v-col cols="12" sm="3" >
                <v-row align="center" dense no-gutters>
                  <v-col cols="12" class="d-block"> 
                    <h6 class="content-item-title" style="width: 100%;">Landline Number 
                    <span v-if="usr_credentials.department === 'Admission'" class="red--text">*</span>
                    <em v-else>(optional)</em>
                    </h6>
                    <v-checkbox v-model="check_no_landline" @change="checkNoLandline" label="Not Applicable" class="ma-0 pa-0 ml-n1" hide-details dense></v-checkbox>
                  </v-col>
                </v-row>

                <v-text-field v-model="member_data.mem_landline_number" @keypress="numberOnly" @keydown.enter.prevent :rules="landline_required" :disabled="check_no_landline" validate-on-blur class="body-2 pl-sm-0" maxlength="11" ref="landline_field">
                    <h6 slot="prepend-inner" class="body-2" style="margin-top: 0.17em">+</h6>
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="3">
                <v-row align="center" dense no-gutters>
                  <v-col cols="12" class="d-block"> 
                    <h6 class="content-item-title">PHIC number
                      <span v-if="(['EDIT', 'REGISTRATION'].includes(process) && (this.member_data.konsulta_eligible || this.member_data.eclaims_eligible)) || (['ADD HOUSEHOLD', 'OFFLINE TRANSACTION'].includes(process))" class="red--text">*</span>
                      <em v-else>(optional)</em>
                    </h6>
                    <v-checkbox v-if="['ADD HOUSEHOLD', 'OFFLINE TRANSACTION'].includes(process)" v-model="check_no_phic_number" @change="checkPhicNumber" :disabled="disable_from_masterlist" label="Not Applicable" class="ma-0 pa-0 ml-n1" hide-details dense></v-checkbox>
                  </v-col>
                </v-row>
                <v-text-field 
                  v-model="member_data.mem_phic_pin" 
                  @change="getMemberEmployer"
                  @keypress="numberOnly" 
                  @keydown.enter.prevent class="body-2 pl-sm-0" 
                  :disabled="check_no_phic_number || disable_from_masterlist" 
                  :rules="field_rules_phic_num"  
                  :class="[disable_from_masterlist ? 'text-primary' : '', 'body-2 pl-sm-0']"
                  validate-on-blur  
                  ref="phicn_number_field"  
                  maxlength="12">
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Blood Type  <em>(optional)</em></h6>
                <v-autocomplete v-model="member_data.blood_type" @keydown.enter.prevent :items="blood_type_list" class="body-2 pl-sm-0" placeholder="Select Blood Type" clearable ></v-autocomplete>
              </v-col>
          </v-row>

          <v-row align="end">
              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Ethnic Group <em>(optional)</em></h6>
                <v-autocomplete v-model="member_data.ethnic_group" @keydown.enter.prevent :items="ethnic_group_list" class="body-2 pl-sm-0" placeholder="Select Ethnic Group" clearable  ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Indigenous<span v-if="usr_credentials.department === 'Admission'" class="red--text">*</span></h6>
                <v-autocomplete v-model="member_data.indigenous" @keydown.enter.prevent :items="indigenous_list" item-text="name" item-value="value" :value="member_data.indigenous = 0" :rules="indigenous_rules_admission" class="body-2 pl-sm-0" placeholder="Select Indigenous" clearable></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Philsys Number <em>(optional)</em></h6>
                <v-text-field v-model="member_data.philsys_number" @keypress="numberOnly" @keydown.enter.prevent class="body-2 pl-sm-0" maxlength="16"></v-text-field>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Religion <em>(optional)</em></h6>
                <v-select v-model="member_data.mem_religion" @keydown.enter.prevent @change="handleReligionChange" :items="religion_items" class="body-2 pl-sm-0" placeholder="Select Religion"></v-select>
              </v-col>
          </v-row>

           <v-row align="end">
              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Philhealth Membership Type <span v-if="philhealth_required" class="red--text">*</span><em v-else>(optional)</em></h6>
                <v-autocomplete v-model="member_data.mem_phic_membership_type_tag" @change="selectPHICMemType" @keydown.enter.prevent :rules="philhealth_rules" :items="['DIRECT', 'INDIRECT']" class="body-2 pl-sm-0" placeholder="Select Membership Type" clearable></v-autocomplete>
              </v-col>

              <v-col v-if="member_data.mem_phic_membership_type_tag" cols="12" sm="3">
                <h6 class="content-item-title">{{member_data.mem_phic_membership_type_tag === 'DIRECT' ? 'DIRECT' : 'INDIRECT'}} <span class="red--text">*</span></h6>
                <v-autocomplete v-if="member_data.mem_phic_membership_type_tag === 'DIRECT'" v-model="member_data.mem_phic_membership_type" :items="philhealth_direct_list" :rules="philhealth_rules" @keydown.enter.prevent @change="selectDirectType" item-text="category_name" class="body-2 pl-sm-0" placeholder="Select Membership Type" clearable></v-autocomplete>
                <v-autocomplete v-else v-model="member_data.mem_phic_membership_type" :items="philhealth_indirect_list" :rules="philhealth_rules" @keydown.enter.prevent item-text="category_name" class="body-2 pl-sm-0" placeholder="Select Membership Type" clearable></v-autocomplete>
              </v-col>

              <v-col v-if="member_data.mem_phic_membership_type_tag === 'DIRECT' && 
                          member_data.mem_phic_membership_type === 'SELF-EARNING INDIVIDUAL' || 
                          member_data.mem_phic_membership_type === 'OFW/MIGRANT WORKER'" 
                cols="12" 
                sm="3">
                  <h6 class="content-item-title">{{member_data.mem_phic_membership_type}} <span class="red--text">*</span></h6>
                  <v-autocomplete v-if="member_data.mem_phic_membership_type === 'SELF-EARNING INDIVIDUAL'" v-model="member_data.mem_phic_membership_self_earning_type" :items="self_earning_individual_list" :rules="philhealth_rules" @keydown.enter.prevent class="body-2 pl-sm-0" placeholder="Select Earning Type" clearable></v-autocomplete>
                  <v-autocomplete v-if="member_data.mem_phic_membership_type === 'OFW/MIGRANT WORKER'" v-model="member_data.mem_phic_membership_migrant_worker_type" :items="migrant_worker_list" :rules="philhealth_rules" @keydown.enter.prevent class="body-2 pl-sm-0" placeholder="Select Migrant Worker" clearable></v-autocomplete>
              </v-col>

              <template v-if="member_data.mem_phic_membership_type_tag === 'DIRECT' && member_data.mem_phic_membership_type === 'FOREIGN NATIONAL'">
                <v-col cols="12" sm="3">
                    <h6 class="content-item-title">PRA SRRV No. <span class="red--text">*</span></h6>
                    <v-text-field v-model="member_data.mem_phic_membership_foreign_national_pra_srrv" @keypress="numberOnly" @keydown.enter.prevent :rules="philhealth_rules" class="body-2 pl-sm-0"  maxlength="25" ></v-text-field>
                </v-col>

                <v-col cols="12" sm="3">
                    <h6 class="content-item-title">ACR I-Card No.<span class="red--text">*</span></h6>
                    <v-text-field v-model="member_data.mem_phic_membership_foreign_national_acr_1" @keypress="numberOnly" @keydown.enter.prevent :rules="philhealth_rules" class="body-2 pl-sm-0" maxlength="25" ></v-text-field>
                </v-col>
              </template>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title"> Priority Care <span class="red--text">*</span></h6>
                <v-select v-model="member_data.mem_priority_care" :items="priority_care_item" :rules="field_rules" class="body-2 pl-sm-0" placeholder="Select Priority Care" @keydown.enter.prevent></v-select>
              </v-col>

              <v-col cols="12" sm="3">
                  <h6 class="content-item-title">Civil Status <span v-if="usr_credentials.department === 'Admission'" class="red--text">*</span></h6>
                  <v-select v-model="member_data.mem_civil_status" @keydown.enter.prevent :items="maritals_status_item" :rules="field_rules_admission" class="body-2 pl-sm-0" placeholder="Select Status"></v-select>
              </v-col>

              <v-col cols="12" sm="3" v-if="add_member_household && member_data.konsulta_eligible">
                <v-row align="center" dense no-gutters>
                  <v-col cols="12" class="d-block"> 
                    <h6 class="content-item-title">Principal PHIC Number 
                      <span class="red--text">*</span>
                    </h6>
                    <v-checkbox  v-model="check_no_principal_phic_number" @change="checkPrincipalPhicNumber"  label="Not Applicable" class="ma-0 pa-0 ml-n1" hide-details dense></v-checkbox>
                  </v-col>
                </v-row>
                <v-text-field v-model="primary_phic_pin" @keypress="numberOnly" @keydown.enter.prevent class="body-2 pl-sm-0" :disabled="check_no_principal_phic_number" :rules="primary_phic_pin_required" validate-on-blur  ref="principal_phicn_number_field"  maxlength="12"></v-text-field>
              </v-col>


              <v-dialog v-model="religion.dialog" width="400" persistent>
                <v-card class="pa-5">
                  <v-divider class="my-2"></v-divider>
                  <h6 class="font-weight-regular body-2">{{ religion.title }}</h6>
                  <v-text-field v-model="religion.new" :placeholder="religion.label" maxlength="60" hide-details outlined></v-text-field>

                  <v-row justify="end" class="mt-4" dense wrap>
                    <v-btn @click="religion.dialog = false" small>CLOSE</v-btn>
                    <v-btn :disabled="!religion.new" @click="saveOtherReligion" class="ml-2" color="primary" small>CONFIRM</v-btn>
                  </v-row>
                </v-card>
              </v-dialog>
          </v-row>
        </v-col>

        <v-col cols="12" class="px-5 pt-3">
          <h6 class="body-1 font-weight-medium mb-3">Address Information</h6>
          <v-row>
              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Region <span class="red--text">*</span></h6>
                <v-autocomplete v-model="member_data.mem_home_region" :items="region_list" item-text="region_name" :rules="field_rules" :loading="loading_region" @keydown.enter.prevent @change="getProvinceList()" class="body-2 pl-sm-0" placeholder="Select Region" return-object clearable></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Province <span class="red--text">*</span></h6>
                <v-autocomplete v-model="member_data.mem_home_province" :items="province_list" :rules="field_rules" :loading="loading_province" item-text="province_name" :disabled = "disabled_province" @keydown.enter.prevent @change="getMunicipalityList()" placeholder="Select Province" class="body-2 pl-sm-0" return-object clearable></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Municipality <span class="red--text">*</span></h6>
                <v-autocomplete v-model="member_data.mem_home_city_municipality" :items="municipality_list" :rules="field_rules" :loading="loading_municipality" item-text="municipality_name" :disabled = "disabled_municipality" @keydown.enter.prevent @change="getBarangayList()" placeholder="Select Municipality" class="body-2 pl-sm-0" return-object clearable></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Barangay <span class="red--text">*</span></h6>
                <v-autocomplete v-model="member_data.mem_home_bgy" @keydown.enter.prevent @change="getZipCode()" :items="barangay_list" :rules="field_rules" :loading="loading_brgy" item-text="barangay_name" :disabled = "disabled_barangay" class="body-2 pl-sm-0" placeholder="Select Barangay" return-object clearable></v-autocomplete>
              </v-col>
          </v-row>

          <v-row>
              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Subdivision</h6>
                <v-text-field v-model="member_data.mem_home_subdivision" @keydown.enter.prevent @input="member_data.mem_home_subdivision = textCapitalize($event)" maxlength="60" class="body-2 pl-2 pl-sm-0"></v-text-field>
              </v-col>

              <v-col cols="12" sm="2">
                <h6 class="content-item-title">Phase</h6>
                <v-text-field v-model="member_data.mem_home_phase" @input="member_data.mem_home_phase = textCapitalize($event)" @keydown.enter.prevent maxlength="60" class="body-2 pl-2 pl-sm-0"></v-text-field>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Street</h6>
                <v-text-field v-model="member_data.mem_home_street" @input="member_data.mem_home_street = textCapitalize($event)" @keydown.enter.prevent maxlength="60" class="body-2 pl-2 pl-sm-0"></v-text-field>
              </v-col>

              <v-col cols="12" sm="2">
                <h6 class="content-item-title">Blk</h6>
                <v-text-field v-model="member_data.mem_home_blk" @keydown.enter.prevent @keypress="numberOnly" maxlength="10" class="body-2 pl-2 pl-sm-0"></v-text-field>
              </v-col>

              <v-col cols="12" sm="2">
                <h6 class="content-item-title">Lot</h6>
                <v-text-field v-model="member_data.mem_home_lot" @keydown.enter.prevent @keypress="numberOnly" maxlength="10" class="body-2 pl-2 pl-sm-0"></v-text-field>
              </v-col>
             
              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Building Name</h6>
                <v-text-field v-model="member_data.mem_home_building_name" @input="member_data.mem_home_building_name = textCapitalize($event)" @keydown.enter.prevent maxlength="60" class="body-2 pl-2 pl-sm-0"></v-text-field>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">House Number </h6>
                <v-text-field v-model="member_data.mem_home_bldgno" @keydown.enter.prevent @keypress="numberOnly" maxlength="10"  class="body-2 pl-2 pl-sm-0"></v-text-field>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Unit Room / Floor</h6>
                <v-text-field v-model="member_data.mem_home_unit_room_floor" @input="member_data.mem_home_unit_room_floor = textCapitalize($event)" @keydown.enter.prevent  maxlength="30" class="body-2 pl-2 pl-sm-0"></v-text-field>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">ZIP <span class="red--text">*</span></h6>
                <v-text-field :value="member_data.mem_home_zip" :rules="field_rules" readonly class="body-2 pl-2 pl-sm-0"></v-text-field>
              </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="px-5 pt-3">
          <h6 class="body-1 font-weight-medium mb-3">Employer Information</h6>
          <v-row>
              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Employment Status <span v-if="usr_credentials.department === 'Admission'" class="red--text">*</span></h6>
                 <v-autocomplete v-model="member_data.employment_status" @keydown.enter.prevent :items="employment_status_list" :rules="field_rules_admission" @change="getMemberEmployer"  class="body-2 pl-sm-0"  placeholder="Select Employment Status" clearable @click:clear="clearEmployerData"></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Employment Type <em>(optional)</em></h6>
                 <v-autocomplete v-model="member_data.mem_employment_type" @keydown.enter.prevent :items="employment_type" :disabled="member_data.employment_status !== 'EMPLOYED'" class="body-2 pl-sm-0" placeholder="Select Employment Type" ref="employment_type" clearable> </v-autocomplete>
              </v-col>

              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Occupation <em>(optional)</em></h6>
                <v-text-field v-model="member_data.mem_occupation" @keydown.enter.prevent @input="member_data.mem_occupation = textCapitalize($event)" :disabled="member_data.employment_status !== 'EMPLOYED' && member_data.employment_status !== 'SELF-EMPLOYED'"  maxlength="60"  class="body-2 pl-sm-0" ref="mem_occupation"></v-text-field>
              </v-col>

              <v-col v-if="!$store.state.prv_config.eclaims_accre" cols="12" sm="3">
                <h6 class="content-item-title">Company Name <em>(optional)</em></h6>
                <v-text-field  v-model="member_data.mem_company_name" @keydown.enter.prevent @input="member_data.mem_company_name = textCapitalize($event)" maxlength="60" :loading="emp_details_loading" :disabled="member_data.employment_status !== 'EMPLOYED' && member_data.employment_status !== 'SELF-EMPLOYED'" class="body-2 pl-sm-0"></v-text-field>
              </v-col>
           
              <v-col cols="12" sm="3">
                <h6 class="content-item-title">Educational Attainment <em>(optional)</em></h6>
                 <v-autocomplete v-model="member_data.educational_attainment" @keydown.enter.prevent :items="educational_attainment_list" class="body-2 pl-sm-0" placeholder="Select Educational Attainment" clearable> </v-autocomplete>
              </v-col>

          </v-row>
          
          <v-row v-if="$store.state.prv_config.eclaims_accre">
              <v-col cols="12" sm="3" class="mb"> 
                <h6 class="content-item-title">Search Employer</h6>
                <v-menu :close-on-click="true" transition="scale-transition" max-height="300" offset-y bottom>
                    <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="search_employer" @input="getEmployerData($event), search_employer = textCapitalize($event)" @click:clear="clearEmployerData" hide-details :loading="employer_loading" :disabled="member_data.employment_status !== 'EMPLOYED'" clearable  class="body-2 pl-sm-0">
                        </v-text-field>
                    </template>
                    <v-list v-if="employer_list && employer_list.length >= 1">
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
            </v-col>

            <v-col cols="12" sm="3">
              <h6 class="content-item-title">Employer Philhealth Number <span v-if="member_data.eclaims_eligible" class="red--text">*</span></h6>
              <v-text-field v-model="member_data.mem_employer_phic_pin" @keydown.enter.prevent @input="member_data.mem_employer_phic_pin = textCapitalize($event)"  :loading="emp_details_loading" :disabled="member_data.employment_status !== 'EMPLOYED'" :rules="field_rules_eclaims" maxlength="20" class="body-2 pl-sm-0" ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="3">
              <h6 class="content-item-title">Employer Name <span v-if="member_data.eclaims_eligible" class="red--text">*</span></h6>
              <v-text-field v-model="member_data.mem_company_name" @keydown.enter.prevent @input="member_data.mem_company_name = textCapitalize($event)" maxlength="60" :loading="emp_details_loading" :disabled="member_data.employment_status !== 'EMPLOYED'" :rules="field_rules_eclaims" class="body-2 pl-sm-0"></v-text-field>
            </v-col>

            <v-col cols="12" sm="3">
              <h6 class="content-item-title">Employer Address <span v-if="member_data.eclaims_eligible" class="red--text">*</span></h6>
              <v-text-field v-model="member_data.mem_company_address" @keydown.enter.prevent @input="member_data.mem_company_address = textCapitalize($event)"  :loading="emp_details_loading" :disabled="member_data.employment_status !== 'EMPLOYED'" :rules="field_rules_eclaims" maxlength="80" class="body-2 pl-sm-0"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="px-5 pt-3">
          <h6 class="body-1 font-weight-medium mb-3">Mother's Maiden Name</h6>
          <v-row>
              <v-col cols="12" sm="4">
                <h6 class="content-item-title">First Name <span v-if="usr_credentials.department === 'Admission'" class="red--text">*</span></h6>
                <v-text-field v-model="member_data.mothers_first_name" @input="member_data.mothers_first_name = textCapitalize($event)" @keydown.enter.prevent @keypress="textOnly" :rules="field_rules_admission" maxlength="40"  class="body-2 pl-sm-0" ></v-text-field>
              </v-col>

              <v-col cols="12" sm="4">
                <h6 class="content-item-title">Middle Name <em>(optional)</em></h6>
                <v-text-field v-model="member_data.mothers_middle_name" @input="member_data.mothers_middle_name = textCapitalize($event)" @keydown.enter.prevent @keypress="textOnly" maxlength="40"  class="body-2 pl-sm-0"  ></v-text-field>
              </v-col>

              <v-col cols="12" sm="4">
                <h6 class="content-item-title">Last Name <span v-if="usr_credentials.department === 'Admission'" class="red--text">*</span></h6>
                <v-text-field v-model="member_data.mothers_surname" @input="member_data.mothers_surname = textCapitalize($event)" @keydown.enter.prevent @keypress="textOnly" :rules="field_rules_admission" maxlength="40"   class="body-2 pl-sm-0"  ></v-text-field>
              </v-col>
          </v-row>
        </v-col>

        <v-col v-if="process !== 'OFFLINE TRANSACTION' && $store.state.usr_credentials.department !== 'Data Encoder'" cols="12" class="px-5 pt-3">
          <v-form :hidden="member_data.hide_photo">
            <h6 class="body-1 font-weight-medium mb-3">
              Add Member/Patient Photo
              <span v-if="calculateAge(member_data.mem_birthdate) > 2" class="red--text">*</span>
              <span v-show="required_photo && !image_holder" class="red--text body-2"> Image required.</span>
            </h6>

            <v-col cols="12" sm="4" class="px-0">
              <label v-if="!image_for_posting" class="grey--text"><em>No Photo Found.</em></label>

              <v-card v-else flat class="card-bg">
                <v-row dense class="pa-3">
                  <v-col cols="4">
                    <v-img :src="image_for_posting.includes('data:image/jpeg;base64,') ? image_for_posting : image_for_posting+uniqueImage"></v-img>
                  </v-col>
                  <v-col cols="8" class="pl-5 d-flex align-center">
                    <h6 class="body-2 font-weight-bold mb-0">User_Photo.jpg</h6>
                  </v-col>
                </v-row>
              </v-card>

              <v-layout xs12 style="display:none">
                <canvas id="photo_for_posting" ref="canvas_for_posting" :width="187" :height="250" class="elevation-1 mx-auto"></canvas>
              </v-layout>
            </v-col>

            <v-row dense class="mt-5">
              <v-col cols="12">
                <v-row dense align="center" justify="start">
                  <v-col cols="auto">
                    <v-btn v-if="image_from_camera && (process === 'REGISTRATION' || process === 'ADD HOUSEHOLD')" :disabled="process !== 'REGISTRATION' && process !== 'ADD HOUSEHOLD'" @click="captureDialog(true)" color="primary" small>
                      <v-icon small left>mdi-camera</v-icon>
                      {{ image_holder ? 'Retake Photo' : 'Take a Photo' }}
                    </v-btn>
                  </v-col>

                  <v-col cols="auto">
                    <v-btn v-if="process === 'EDIT'" @click="updatePhoto" small>Update Photo</v-btn>
                  </v-col>

                  <v-col cols="auto">
                    <v-btn @click="show_photo = true" :disabled="!image_holder" small>
                      <v-icon small left>mdi-image</v-icon>View Photo
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
        

        <v-row justify="space-between" class="mt-15 px-5">
          <v-btn @click="redirect(process === 'EDIT' ? 'edit' : 'userverification')" class="mb-2" type="button" text small><v-icon left small>mdi-chevron-left</v-icon>BACK</v-btn>
          <v-btn v-if="process === 'ISSUE CARD' || process === 'REPORT LOST CARD'" @click="submitInformation" class="primary pl-8 pr-5" small>
              {{process === 'ISSUE CARD' ? 'PROCEED' : 'CONFIRM LOST CARD'}} 
              <v-icon right small>mdi-chevron-right</v-icon>
          </v-btn>

          <div v-else-if="process === 'EDIT'">
            <v-btn @click="saveEdit" type="button" class="primary pl-6 pr-8 mr-5" small> <v-icon left small>mdi-content-save</v-icon>SAVE CHANGES</v-btn>
          </div>
          
          <div v-else>
            <template v-if="process === 'OFFLINE TRANSACTION' || $store.state.usr_credentials.department === 'Data Encoder'">  
              <v-btn @click="saveEdit" type="button" class="primary pl-6 pr-8 mr-5" small> <v-icon left small>mdi-content-save</v-icon>
                REGISTER {{ process === 'ADD HOUSEHOLD' ? 'HOUSEHOLD' : 'MEMBER' }}
              </v-btn>
            </template>

            <template v-else> 
              <v-row>
                <v-col cols="12">
                  <v-row dense align="center" justify="start">
                    <v-col cols="auto">
                      <v-btn @click="saveInformation" type="button" class="primary pl-6 pr-8 mr-5" small> <v-icon left small>mdi-content-save</v-icon>SAVE PROGRESS</v-btn>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn type="submit" class="primary pl-8 pr-5" small> CONTINUE <v-icon right small>mdi-chevron-right</v-icon></v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </template>
          </div>
        </v-row>
        
      </v-form>
    </v-card>

    <v-dialog v-if="show_photo_capture_dialog" v-model="show_photo_capture_dialog" width="1000" persistent>
      <v-card class="overflow-hidden">
        <v-card-title class="body-1 primary white--text">
              <v-spacer></v-spacer><v-icon color="white" left>mdi-camera</v-icon>Add Member/Patient Photo<v-spacer></v-spacer>
              <v-icon @click="captureDialog(false)" dark>mdi-close</v-icon>
        </v-card-title>

        <v-row dense>
            <v-col cols="12" sm="12" class="pa-5">
              <v-row dense wrap>
                <v-col cols="12" sm="12" md="6" class="pa-2 mb-10 mb-md-0">
                    <div align="center">
                      <v-card v-if="!isCameraOpen" :width="450" :height="337.5" class="camera-color d-flex justify-center"> <v-icon large class="camera-icon">mdi-camera</v-icon> </v-card>
                      <video v-else ref="video" :width="450" :height="337.5" autoplay class="elevation-1 "></video>
                    </div>
                    <div class="px-md-12" align="center">
                        <v-btn v-if="!isPhotoCaptured" :loading="photo_capture_loader" @click="capturePhoto" class="primary mt-8" block small><v-icon left small>mdi-camera</v-icon>Take a photo</v-btn>
                        <v-btn v-else @click="startCameraStream" class="primary mt-8" block small><v-icon left small>mdi-camera</v-icon>Retake photo</v-btn>
                    </div>
                </v-col>

                <v-col cols="12" sm="12" md="6" class="pa-2">
                  <div align="center">
                    <canvas  id="photoTaken" ref="canvas" :width="450" :height="337.5" class="elevation-1 mx-auto"></canvas>

                    <div class="px-12 " align="center">
                      <v-btn @click="getPhoto" :disabled="!isPhotoCaptured" class="primary mt-7" block small><v-icon left small>mdi-attachment</v-icon>Attach photo</v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <v-dialog v-if="show_photo" v-model="show_photo" width="500"  persistent>
      <v-card class="pb-5">
        <div class="primary white--text text-center py-4">
          <h4><v-icon color="white" left>mdi-image</v-icon>View Photo</h4>
        </div>

        <v-col cols="12" sm="12" class="pa-5 mt-5"> 
          <v-img :src="image_holder.includes('data:image/jpeg;base64,') ? image_holder : image_holder+uniqueImage" :height="337.5" :contain="!image_from_camera" ></v-img>
        </v-col>

        <v-card-actions class="justify-center">
          <v-btn  @click="show_photo = false" class="px-5"  small>CLOSE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-if="save_alert" v-model="save_alert" :width="alert_content.size" persistent>
      <v-card class="text-center py-5 px-8">
        <v-card-title class="justify-center"><v-icon color="primary" size="80">mdi-alert-circle</v-icon></v-card-title>
        <h3 class="grey--text text--darken-2 font-weight-regular">{{alert_content.title}}</h3>
        <h4 class="grey--text text--darken-2 font-weight-light mb-5">{{alert_content.body}}</h4>

        <v-card-actions class="justify-center mt-5">
            <v-btn @click="save_alert = false" :disabled="submit_loader" color="primary" outlined class="pa-5 ">{{alert_content.left_btn}}</v-btn>
            <v-btn @click="submitInformation(alert_content.type)" :loading="submit_loader" :class="alert_content.type == 'submit' ? 'px-15' : 'px-10'" color="primary" class="pa-5 px-10" >{{alert_content.right_btn}}</v-btn>
        </v-card-actions> 
      </v-card>
    </v-dialog>

    <Alert :alert="alert" @submitInformation="submitInformation" @redirect="redirect"/>
  </div>
</template>

<script>
import { 
    religion_items, 
    blood_type_list, 
    indigenous_list, 
    educational_attainment_list, 
    employment_type, 
    employment_status_list,
    ethnic_group_list,
    maritals_status_item,
    philhealth_indirect_list, 
    philhealth_direct_list, 
    self_earning_individual_list, 
    migrant_worker_list, 
    foreign_national_list,
    priority_care_item
  } from '../../../reference/additional-info-libraries.json'
import Alert from '../../Alert.vue'
import { mapState } from "vuex";
import { mask } from "vue-the-mask"

export default {
  directives: { mask },
  components: {Alert},
  props: ['process'],
  data() {
    return {
      add_member_household: false,
      has_primary_care: false,
      is_registered: '',
      lgu_validate: '',
      primary_usr_mobile_number: '',
      primary_fname: '',
      primary_lname: '',
      primary_birthdate: '',
      primary_mobile_number: '',
      primary_region: '',
      primary_province: '',
      primary_municipality: '',
      primary_barangay: '',
      primary_bldg: '',
      primary_street: '',
      primary_subdivision: '',
      primary_phase:'',
      primary_blk:'',
      primary_lot:'',
      primary_bldg_name:'',
      primary_unit_floor: '',
      primary_zip: '',
      primary_care_data: null,
      issuance_for_mobile: false,
      member_data: {},
      employer_name: '',
      employer_list: [],
      employer_loading: false,
      emp_details_loading: false,
      form_is_valid: false,
      field_rules: [v => !!v && !/^ *$/.test(v) || 'Field is required.'],
      indigenous_rules: [v => (v !== null && v !== undefined && v !== '') || 'This field is required'],
      email_rules: [v => !v || /.+@.+\..+/.test(v) || 'E-mail must be valid'],
      priority_care: [v => !!v && !/^ *$/.test(v) || 'Field is required.'],
      verification_rules_birthdate: [
        v => !!v && !/^ *$/.test(v) || 'Birthdate is required',
        v => !/^\s/.test(v) || 'Birthdate cannot start with a space',
        v => {
          if (!v) return true;
          const result = this.validateBirthDate(v);
          return result.format_result || result.error_msg;
        }
      ],
      birthdate_picker: '',

      save_alert: false,
      submit_loader:false,
      alert_content: {
        size:'',
        title: '',
        body: '',
        type: '',
        left_btn: '',
        right_btn: '',
      },
     
      required_photo: false,
      hidden_canvas_img: '',
      image_holder: '',
      image_for_posting: '',
      has_image_loaded: false,
      image_from_camera: true,
      
      photo_capture_loader: true,
      show_photo_capture_dialog: false,
      show_photo: false,
      isCameraOpen: false,
      isPhotoCaptured: false,
      show_attachment: false,

      region_list: [],
      province_list: [],
      // province_array: [],
      municipality_list: [],
      // municipality_array: [],
      barangay_list: [],
      loading_region: false,
      loading_province: false,
      loading_municipality: false,
      loading_brgy: false,
    
      blood_type_list,
      indigenous_list,
      educational_attainment_list,
      employment_type,
      employment_status_list,
      ethnic_group_list,
      maritals_status_item,
      religion_items,
      priority_care_item,

      religion: {
        dialog: false,
        title: 'Enter Custom Religion',
        label: 'Custom Religion',
        new: '',
      },

      philhealth_direct_list,
      philhealth_indirect_list,
      self_earning_individual_list,
      migrant_worker_list,
      foreign_national_list,

      disabled_province: true,
      disabled_municipality: true,
      disabled_barangay: true,
      member_in_child_care: false,
      alert: {},
      original_phic_pin: '',
      check_no_email: false,
      check_no_contact: false,
      check_no_landline: false,
      check_no_phic_number: false,
      search_employer: '',
      is_focused: false,
      search_emp_time_out: null,

      check_no_principal_phic_number: false,
      primary_phic_pin: '',

      from_masterlist: false
    }
  },

  watch: {
    'member_data.employment_status'(value) {
      if (value != 'EMPLOYED') {
        this.member_data.mem_employer_phic_pin = 'N/A';
        this.member_data.mem_company_name = 'N/A';
        this.member_data.mem_company_address = 'N/A';
      }
    }
  },

  mounted() {
    this.getSessionData(); 
    this.original_phic_pin = this.member_data.mem_phic_pin || null;
    this.filterCategoryStatus()
    this.setPriorityCareDefaultValue()
  },

  computed: {
    ...mapState(["usr_credentials"]),

    validate_mem_gender () {
      if (this.is_registered == '0' && this.lgu_validate == false) return false
      if (!this.data_has_gender) return false
      return true
    },

    uniqueImage(){
      return '?'+Math.random().toString(25).substring(3, 20)
    },

    email_required() {
      if (this.usr_credentials.department === 'Admission') {
        return this.check_no_email ? [] : [...this.email_rules, ...this.field_rules] // for admission
      } else {
        return [...this.email_rules] //for encoder incase with email setup - check if the email format is valid
      }
    },

    contact_required() {
      if (this.usr_credentials.department === 'Admission') {
        return this.check_no_contact ? [] : [...this.field_rules]
      }
      return [];
    },

    landline_required() {
      if (this.usr_credentials.department === 'Admission') {
        return this.check_no_landline ? [] : [...this.field_rules]
      }
      return [];
    },

    indigenous_rules_admission() {
      if (this.usr_credentials.department === 'Admission') {
        return  [...this.indigenous_rules]
      }
      return [];
    },

    field_rules_admission() {
      if (this.usr_credentials.department === 'Admission') {
          return [...this.field_rules]
      }
      return [];
    },

    philhealth_required() {
      return (this.member_data.eclaims_eligible && !this.add_member_household);
    },

    philhealth_rules() {
      return this.philhealth_required ? [...this.field_rules] : [];
    },

    field_rules_phic_num() {
      if ((['EDIT', 'REGISTRATION'].includes(this.process) && (this.member_data.konsulta_eligible || this.member_data.eclaims_eligible)) 
        || (['ADD HOUSEHOLD', 'OFFLINE TRANSACTION'].includes(this.process)))
      {
        return this.check_no_phic_number ? [] : [...this.field_rules]
      }
      return [];
    },

    field_rules_eclaims() {
      if (this.member_data.eclaims_eligible) {
          return [...this.field_rules]
      }
      return [];
    },
    
    primary_phic_pin_required() {
      return this.check_no_principal_phic_number ? [] : [...this.field_rules]
    },

    disable_from_masterlist() {
      if(this.process !== 'EDIT') {
        return this.from_masterlist
      }
      return false
    }
  },

  methods: {
    getSessionData() {
      const get_session = sessionStorage.getItem("9xgF732sfgh") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("9xgF732sfgh"), "njGHDdd").toString(this.$crypto.enc.Utf8) ) : {}
      this.member_in_child_care = get_session.member_in_child_care
      this.is_registered =  get_session.is_registered
      this.lgu_validate =  get_session.lgu_validate
      this.member_data =  get_session.lgu_data
      this.member_data.mem_first_name = this.member_data.mem_first_name.toUpperCase()
      this.member_data.mem_middle_name = this.member_data.mem_middle_name ? this.member_data.mem_middle_name.toUpperCase() : this.member_data.mem_middle_name
      this.member_data.mem_last_name = this.member_data.mem_last_name.toUpperCase()
      this.member_data.mem_suffix = this.member_data.mem_suffix ? this.member_data.mem_suffix.toUpperCase() : this.member_data.mem_suffix
      this.member_data.mem_birthdate = this.member_data.mem_birthdate ? this.formatDate(this.member_data.mem_birthdate) : null
      this.member_data.indigenous = 0 
      this.member_data.employment_status = get_session.lgu_data.employment_status ? get_session.lgu_data.employment_status : 'NOT EMPLOYED'
      this.primary_fname = get_session.primary_data?.fname
      this.primary_lname = get_session.primary_data?.lname
      this.primary_birthdate = get_session.primary_data?.birthdate
      this.primary_phic_pin = get_session.primary_data?.phic_pin
      this.add_member_household = get_session.add_member_household
      this.has_primary_care = get_session.has_primary_care
      this.primary_care_data = get_session.primary_care_data || null
      this.issuance_for_mobile = get_session.issuance_for_mobile || false
      this.data_has_gender = this.member_data.mem_gender ? true : false
      this.member_data.mem_mobile_number =  this.member_data.mem_mobile_number ?  this.member_data.mem_mobile_number || get_session.phic_data.pPatientMobileNo : ''
      this.member_data.mem_landline_number =  this.member_data.mem_landline_number ?  this.member_data.mem_landline_number || get_session.phic_data.pPatientLandlineNo : ''
      this.is_app_ready = this.member_data.is_app_ready ? this.member_data.is_app_ready : '0'
      this.member_data.phic_data = get_session.phic_data
      this.member_data.blood_type = (this.member_data.blood_type !== null || this.member_data.blood_type !== '') ? this.member_data.blood_type : get_session.phic_data.blood_type
      this.member_data.mem_priority_care = this.member_data.mem_priority_care ? this.member_data.mem_priority_care : undefined
      this.member_data.mem_civil_status = this.calculateAge(this.member_data.mem_birthdate) < 18 ? 'CHILD' : this.member_data.mem_civil_status
      this.member_data.konsulta_eligible = get_session.lgu_data.konsulta_eligible
      this.member_data.eclaims_eligible = get_session.lgu_data.eclaims_eligible
      this.member_data.mem_religion = this.member_data.mem_religion ? this.member_data.mem_religion : ''
      this.check_no_email = this.member_data.mem_email_address === 'N/A' ? true : false
      // this.field_rules = this.check_no_email ? '' : []
      this.check_no_contact = this.member_data.mem_mobile_number === 'N/A' ? true : false
      this.check_no_landline = this.member_data.mem_landline_number === 'N/A' ? true : false
      this.member_data.mem_email_address = this.member_data.mem_email_address === 'N/A' ? '' : this.member_data.mem_email_address
      this.member_data.mem_mobile_number = this.member_data.mem_mobile_number === 'N/A' ? '' : this.member_data.mem_mobile_number
      this.member_data.mem_landline_number = this.member_data.mem_landline_number === 'N/A' ? '' : this.member_data.mem_landline_number

      this.member_data.mem_home_region = this.member_data.mem_home_region?.region_id ? this.member_data.mem_home_region : undefined
      this.member_data.mem_home_province = this.member_data.mem_home_province?.province_id ? this.member_data.mem_home_province : undefined
      this.member_data.mem_home_city_municipality = this.member_data.mem_home_city_municipality?.municipality_id ? this.member_data.mem_home_city_municipality : undefined
      this.member_data.mem_home_bgy = this.member_data.mem_home_bgy?.barangay_id ? this.member_data.mem_home_bgy : undefined

      this.from_masterlist = get_session.lgu_data?.from_masterlist || false

      if (this.add_member_household) {
        if (!this.member_data.mem_home_region && !this.member_data.mem_home_province && !this.member_data.mem_home_city_municipality && !this.member_data.mem_home_bgy) {
          this.member_data.mem_home_region = this.primary_region = get_session.primary_data.region
          this.member_data.mem_home_province = this.primary_province = get_session.primary_data.province
          this.member_data.mem_home_city_municipality = this.primary_municipality  = get_session.primary_data.municipality
          this.member_data.mem_home_bgy = this.primary_barangay = get_session.primary_data.barangay
          this.member_data.mem_home_bldgno = this.primary_bldg = get_session.primary_data.bldg
          this.member_data.mem_home_street = this.primary_street = get_session.primary_data.street
          this.member_data.mem_home_zip = this.primary_zip = get_session.primary_data.zip

          this.member_data.mem_home_subdivision =  this.primary_subdivision = get_session.primary_data.subdivision
          this.member_data.mem_home_phase =  this.primary_phase = get_session.primary_data.phase
          this.member_data.mem_home_blk =  this.primary_blk = get_session.primary_data.blk
          this.member_data.mem_home_lot =  this.primary_lot = get_session.primary_data.lot
          this.member_data.mem_home_building_name =  this.primary_bldg_name = get_session.primary_data.bldg_name
          this.member_data.mem_home_unit_room_floor=  this.primary_unit_floor = get_session.primary_data.unit_floor 
        } else {
          this.primary_region = get_session.primary_data.region
          this.primary_province = get_session.primary_data.province
          this.primary_municipality  = get_session.primary_data.municipality
          this.primary_barangay = get_session.primary_data.barangay
          this.primary_bldg = get_session.primary_data.bldg
          this.primary_street = get_session.primary_data.street
          this.primary_zip = get_session.primary_data.zip
          this.primary_mobile_number =  get_session.primary_data.mobile_number
          this.primary_landline_number =  get_session.primary_data.landline_number
          this.primary_subdivision = get_session.primary_data.subdivision
          this.primary_phase = get_session.primary_data.phase
          this.primary_blk = get_session.primary_data.blk
          this.primary_lot = get_session.primary_data.lot
          this.primary_bldg_name = get_session.primary_data.bldg_name
          this.primary_unit_floor = get_session.primary_data.unit_floor 
        }
      }

      if (this.member_data.mem_photo) {
        this.imageHandler(this.member_data.mem_photo)
          .then((response) => {
            if (!response.loaded) return;
            this.image_for_posting = response.src;
            this.image_holder = response.src;
            this.image_from_camera = false;
          })
          .catch((error) => {
            console.warn('Error loading image:', error);
          });
      }
      
      return this.getRegionsList();
    },

    getEmployerData(value) {
      clearTimeout(this.search_emp_time_out)
      if(value){
        this.search_emp_time_out = setTimeout(() => {
          this.getEclaimsWebService()
        }, 800)
      }
    },

    getMemberEmployer() {
      if(this.member_data.employment_status === 'EMPLOYED'){
        this.member_data = {
          ...this.member_data,
          mem_company_name: '', 
          mem_company_address: '', 
          mem_employer_phic_pin: '' 
        }
      }
    },

    selectMemberEmployer(item) {
      this.search_employer = item.name
      this.member_data.mem_company_name = item.name
      this.member_data.mem_company_address = item.address
      this.member_data.mem_employer_phic_pin = item.philhealthno
    },

    clearEmployerData() {
      this.search_employer = ''
      this.member_data.mem_company_name = ''
      this.member_data.mem_company_address = ''
      this.member_data.mem_employer_phic_pin = ''
    },

    filterCategoryStatus() {
        const status_filter = [
            'philhealth_direct_list', 'philhealth_indirect_list'
        ];

        if (this.member_data.eclaims_eligible) {
            status_filter.forEach(key => {
                if (this[key]) {
                    this[key] = this[key].filter(item => item.eclaims_categ === true);
                }
            });
        } 
    },

    async getRegionsList() {
      this.loading_region = true
      let response = await this.$services.getTransactionIpRefData({
        request_key: 'region',
      });

      if (response.status === 200) {
        //response.data = this.responseDataDecryption(response.data)
        this.loading_region = false
        this.region_list = response.data
        if(this.member_data.mem_home_region) {
          this.getProvinceList()
        }
      } else {
        this.alert = response.error;
      }
    },

    async getProvinceList() {
      this.loading_province = true
      if(this.member_data.mem_home_region) {
        this.disabled_province = false
        const response = await this.$services.getTransactionIpRefData({
          request_key: 'province',
          region_id: this.member_data.mem_home_region.region_id
        });

        if(response.status === 200) {
          //response.data = this.responseDataDecryption(response.data)
          this.loading_province = false
          this.province_list = response.data
          if(this.member_data.mem_home_province) {
            this.getMunicipalityList()
          }
        }
      } else {
        this.member_data.mem_home_region = ''
        this.disabled_province = true
      }
    },

    async getMunicipalityList() {
      this.loading_municipality = true
      if(this.member_data.mem_home_province){
        this.disabled_municipality = false
        const response = await this.$services.getTransactionIpRefData({
          request_key: 'municipality',
          province_id: this.member_data.mem_home_province.province_id
        });
  
        if(response.status === 200) {
          //response.data = this.responseDataDecryption(response.data)
          this.loading_municipality = false
          this.municipality_list = response.data
          if(this.member_data.mem_home_city_municipality) {
            this.getBarangayList()
          }
        } else {
          this.municipality_list = []
        }
      } else {
        this.member_data.mem_home_province = ''
        this.disabled_municipality = true
      }
    },

    async getBarangayList() {
      this.loading_brgy = true
      if(this.member_data.mem_home_city_municipality) {
        this.disabled_barangay = false
        const response = await this.$services.getTransactionIpRefData({
          request_key: 'brgy',
          municipality_id: this.member_data.mem_home_city_municipality.municipality_id
        });
  
        if(response.status === 200) {
          //response.data = this.responseDataDecryption(response.data)
          this.loading_brgy = false
          this.barangay_list = response.data
          if(this.member_data.mem_home_bgy) {
            this.getZipCode()
          }
        } else {
          this.barangay_list = []
        }
      } else {
        this.member_data.mem_home_city_municipality = ''
        this.disabled_barangay = true
      }
    },

    async getZipCode() {
      if(this.member_data.mem_home_bgy) {
        const response = await this.$services.getTransactionIpRefData({
          request_key: 'zip_code',
          municipality_id: this.member_data.mem_home_city_municipality.municipality_id,
          barangay_id: this.member_data.mem_home_bgy.barangay_id
        });
  
        if(response.status === 200) {
          //response.data = this.responseDataDecryption(response.data)
          this.$set(this.member_data, 'mem_home_zip', response.data.zip_code)
        } 
      } else {
        this.member_data.mem_home_bgy = ''
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

    selectPHICMemType() {
      this.$set(this.member_data, 'mem_phic_membership_type', null);
      this.$set(this.member_data, 'mem_phic_membership_foreign_national_pra_srrv', null);
      this.$set(this.member_data, 'mem_phic_membership_foreign_national_acr_1', null);
      this.$set(this.member_data, 'mem_phic_membership_self_earning_type', null);
      this.$set(this.member_data, 'mem_phic_membership_migrant_worker_type', null);
    },

    selectDirectType(value) {
      this.$set(this.member_data, 'mem_phic_membership_type', value);

      this.member_data.mem_phic_membership_foreign_national_pra_srrv = null;
      this.member_data.mem_phic_membership_foreign_national_acr_1 = null;
      this.member_data.mem_phic_membership_self_earning_type = null;
      this.member_data.mem_phic_membership_migrant_worker_type = null;

      this.$forceUpdate();
    },

    // selectPHICMemType() {
    //   this.member_data.mem_phic_membership_type = this.member_data.mem_phic_membership_foreign_national_pra_srrv = this.member_data.mem_phic_membership_foreign_national_acr_1 = this.member_data.mem_phic_membership_self_earning_type  = this.member_data.mem_phic_membership_migrant_worker_type  = null
    // },

    // selectDirectType() {
    //   const {mem_phic_membership_type} = this.member_data
    //   if (!mem_phic_membership_type || mem_phic_membership_type !== 'OFW/MIGRANT WORKER' || mem_phic_membership_type !== 'SELF-EARNING INDIVIDUAL' || mem_phic_membership_type !== 'FOREIGN NATIONAL'){
    //     return this.member_data.mem_phic_membership_foreign_national_pra_srrv = this.member_data.mem_phic_membership_foreign_national_acr_1 = this.member_data.mem_phic_membership_self_earning_type  = this.member_data.mem_phic_membership_migrant_worker_type  = null
    //   }

    //   if (mem_phic_membership_type === 'OFW/MIGRANT WORKER') {
    //     this.member_data.mem_phic_membership_foreign_national_pra_srrv = this.member_data.mem_phic_membership_foreign_national_acr_1 = this.member_data.mem_phic_membership_self_earning_type  = null
    //     return 
    //   } else if(mem_phic_membership_type === 'SELF-EARNING INDIVIDUAL') {
    //     this.member_data.mem_phic_membership_foreign_national_pra_srrv = this.member_data.mem_phic_membership_foreign_national_acr_1 = this.member_data.mem_phic_membership_migrant_worker_type  = null
    //     return 
    //   } else if (mem_phic_membership_type === 'FOREIGN NATIONAL') {
    //     this.member_data.mem_phic_membership_self_earning_type = this.member_data.mem_phic_membership_migrant_worker_type  = null
    //   }
    // },
  
    captureDialog(is_open) {
      this.show_photo_capture_dialog = is_open
      if (is_open) return this.startCameraStream()
      if (!is_open && this.isCameraOpen) return this.stopCameraStream()
    },

    startCameraStream() {
      this.isCameraOpen = true;
      this.isPhotoCaptured = false;

      this.scan_type = 'photocapture'
      const constraints = (window.constraints = {audio: false,video: true});

			navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        this.$refs.video.srcObject = stream;
        this.photo_capture_loader = false
      }).catch(() => {
        this.isCameraOpen = false;
        this.show_photo_capture_dialog = false
        this.alert = {
            display: true, 
            type: 'standard',  
            width: '620',  
            icon: 'mdi-alert-circle', 
            color: 'blue darken-1', 
            title: 'The camera is not detected or it may not be supported by the browser.', 
            btn_pry_txt: 'close', 
            btn_pry_color: 'primary',
            btn_pry_otl: false,
            btn_pry_act: 'closeAlert'
          }
      });
    },

    stopCameraStream() {
      this.isCameraOpen = false
      let tracks = this.$refs.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    },

    capturePhoto() {
      this.isPhotoCaptured = true
      
      const context = this.$refs.canvas.getContext('2d');
      context.setTransform(-1,0,0,1,450,0);
      context.drawImage(this.$refs.video, 0, 0, 450,337.5);
      
      this.hidden_canvas_img = this.$refs.canvas
      this.stopCameraStream(); 
    },

    getPhoto() {
      this.show_photo_capture_dialog = false
      const canvas = document.getElementById("photoTaken").toDataURL("image/jpeg")
      this.image_holder = canvas

      // FOR GETTING THE POST IMAGE FOR CANVAS
      const context = this.$refs.canvas_for_posting.getContext('2d');
      var scale = Math.max(this.$refs.canvas_for_posting.width / this.hidden_canvas_img.width, this.$refs.canvas_for_posting.height / this.hidden_canvas_img.height);
      var x = (this.$refs.canvas_for_posting.width / 2) - ( this.hidden_canvas_img.width / 2) * scale;
      var y = (this.$refs.canvas_for_posting.height / 2) - ( this.hidden_canvas_img.height / 2) * scale;
      context.drawImage(this.hidden_canvas_img, x, y, this.hidden_canvas_img.width * scale  ,this.hidden_canvas_img.height * scale);
      
      const get_canvas = document.getElementById("photo_for_posting").toDataURL("image/jpeg")
      this.image_for_posting = get_canvas
      this.image_from_camera = true
    },
    
    updatePhoto() {
      this.show_photo_capture_dialog = true;
      this.startCameraStream();
    },

    imageHandler(url) {
      return new Promise(resolve => {
        const img = new Image()
        img.addEventListener('load', () => resolve({loaded:true, width: img.width, height: img.height, src: url}))
        img.addEventListener('error', () => resolve({loaded: false}))
        img.src = url
      })
    },

    validateInformation() {
      if (this.calculateAge(this.member_data.mem_birthdate) > 2) {
        this.required_photo = this.image_holder ? false : true
      }

      if (this.$refs.form.validate() && !this.required_photo) {
        this.alert_content.size = this.process === 'REPORT LOST CARD' ? '850' : '600'
        this.alert_content.title = this.process === 'REPORT LOST CARD' ? 'Lost card and its QR Code will be deactivated. New QR Code will be generated.' :  'Confirmation'
        this.alert_content.body = this.process === 'REPORT LOST CARD' ? 'Please make sure all data are correct before you proceed.' : 'Please make sure that all the fields are correct before you proceed.'
        this.alert_content.type = 'submit'
        this.alert_content.left_btn = 'Recheck Information'
        this.alert_content.right_btn = 'Proceed'
        this.save_alert = true
      } else {
        this.alert = {
          display: true, 
          type: 'standard', 
          width: '400', 
          icon: 'mdi-alert-circle', 
          color: 'yellow darken-1', 
          title: 'Field is empty/Invalid Value', 
          body: 'Please fill out all required fields.', 
          btn_pry_txt: 'OK', 
          btn_pry_color: 'primary', 
          btn_pry_otl: false, 
          btn_pry_act: 'closeAlert' 
        }
      }
    },

    async validatePhicPin() {
      let response = await this.$services.validationServices({
        request_key: 'ppv',
        mem_phic_pin: this.member_data.mem_phic_pin
      });

      if (response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        if (response.data.success) {
          return true;
        }
      } else {
        this.alert = response.error;
      }
      return false;
    },

    handleReligionChange() {
      if (this.member_data.mem_religion === 'OTHERS') {
        this.religion.dialog = true;
        this.religion.new = '';
      } else {
        this.religion.dialog = false;
      }
    },
    
    saveOtherReligion() {
      this.religion_items.splice(this.religion_items.length - 1, 0, this.religion.new);
      this.member_data.mem_religion = this.religion.new;
      this.religion.dialog = false;
    },
    
    saveInformation() {
      if (this.calculateAge(this.member_data.mem_birthdate) > 2) {
        this.required_photo = this.image_holder ? false : true
      }

      if (this.$refs.form.validate() && !this.required_photo) {
        this.alert_content.size = '650'
        this.alert_content.title = 'Incomplete data for registration.'
        this.alert_content.body = 'Changes will be saved and you can update it by typing the complete name.'
        this.alert_content.type = 'save'
        this.alert_content.left_btn = 'cancel'
        this.alert_content.right_btn = 'save'
        this.save_alert = true
      }  else {
        this.alert = {
          display: true, 
          type: 'standard', 
          width: '400', 
          icon: 'mdi-alert-circle', 
          color: 'yellow darken-1', 
          title: 'Field is empty/Invalid Value', 
          body: 'Please fill out all required fields.', 
          btn_pry_txt: 'OK', 
          btn_pry_color: 'primary', 
          btn_pry_otl: false, 
          btn_pry_act: 'closeAlert' 
        }
      }
    },

    saveEdit() {
      if(this.process === 'OFFLINE TRANSACTION') {
        if(this.$refs.form.validate()) {
          this.alert_content.size = '650'
          this.alert_content.title = 'Incomplete data for registration.'
          this.alert_content.body = 'Changes will be saved without member photo, qr card and you can update it by typing the complete name in user verification.'
          this.alert_content.type = 'save'
          this.alert_content.left_btn = 'cancel'
          this.alert_content.right_btn = 'save'
          this.save_alert = true
        } else {
          this.alert = {
            display: true, 
            type: 'standard', 
            width: '400', 
            icon: 'mdi-alert-circle', 
            color: 'yellow darken-1', 
            title: 'Field is empty/Invalid Value', 
            body: 'Please fill out all required fields.', 
            btn_pry_txt: 'OK', 
            btn_pry_color: 'primary', 
            btn_pry_otl: false, 
            btn_pry_act: 'closeAlert' 
          }
        }
      } else {
        if(this.$refs.form.validate()) {
          this.alert_content.size = '650'
          this.alert_content.title = 'Patient Information'
          this.alert_content.body = 'Changes will be saved and you can update it by clicking the update button.'
          this.alert_content.type = 'save'
          this.alert_content.left_btn = 'cancel'
          this.alert_content.right_btn = 'save'
          this.save_alert = true
        } else {
          this.alert = {
            display: true, 
            type: 'standard', 
            width: '400', 
            icon: 'mdi-alert-circle', 
            color: 'yellow darken-1', 
            title: 'Field is empty/Invalid Value', 
            body: 'Please fill out all required fields.', 
            btn_pry_txt: 'OK', 
            btn_pry_color: 'primary', 
            btn_pry_otl: false, 
            btn_pry_act: 'closeAlert' 
          }
        }
      }
    },

    submitInformation(type) {
      if (this.process === 'REPORT LOST CARD') return this.updateLostCard()
      if (this.process === 'REGISTRATION' || this.process === 'ADD HOUSEHOLD' || this.process === 'EDIT' || this.process === 'OFFLINE TRANSACTION') return this.submitRegistration(type)

      // IF PROCESS IS RELEASE CARD
      this.submit_loader = true
      const mem_photo = this.member_data.mem_photo+this.uniqueImage
      return this.sessionDataRedirect(this.member_data.ek_lgu_id, mem_photo, this.member_data.current_card_key)
    },

    async submitRegistration(type) {
      this.submit_loader = true
      let mem_reg_type = this.member_data.member_registration_type

      if (this.is_registered === '0' && this.lgu_validate === false) mem_reg_type = this.add_member_household ? 'DEPENDENT' : 'PRINCIPAL'

      let member_data = this.member_data.mem_first_name + ' ' + this.member_data.mem_middle_name + ' ' + this.member_data.mem_last_name
      let mothers_data = this.member_data.mothers_first_name + ' ' + (this.member_data.mothers_middle_name ? this.member_data.mothers_middle_name : '') + ' ' + this.member_data.mothers_surname
      if (member_data === mothers_data) {
          this.submit_loader = false;
          this.save_alert = false;
          this.alert_content = {};
          this.showAlertMobile("Mother's first name, middle name and last name should be different from member's.");
          return this.alert = { 
            display: true, 
            type: 'standard', 
            width: '450', 
            icon: 'mdi-alert-circle', 
            color: 'red', 
            title: "Mother's first name, middle name and last name should be different from member's.", 
            body: 'Please try again', 
            btn_pry_txt: 'OK', 
            btn_pry_color: 'primary', 
            btn_pry_otl: false,
            btn_pry_act: 'closeAlert' 
          };
      }

      // PHIC PIN validation
      // if (this.process !== 'EDIT') {
      if (this.member_data.mem_phic_pin !== this.original_phic_pin) {
        let phic_pin_exists = await this.validatePhicPin();
        if (phic_pin_exists) {
          this.submit_loader = false;
          this.save_alert = false;
          this.alert_content = {};
          this.showAlertMobile("PHIC PIN already exists");
          return this.alert = { 
            display: true, 
            type: 'standard', 
            width: '350', 
            icon: 'mdi-alert-circle', 
            color: 'red', 
            title: 'PHIC PIN already exists', 
            body: 'Please try again', 
            btn_pry_txt: 'OK', 
            btn_pry_color: 'primary', 
            btn_pry_otl: false,
            btn_pry_act: 'closeAlert' 
          };
        }
      }
      // }

      let validate_has_data = '0'
      let current_card_key = this.member_data.current_card_key || '1'
      if ((this.is_registered === '0' || this.is_registered === '1') && this.lgu_validate === true ) validate_has_data = '1'
      if ((this.is_registered === '2' || this.is_registered === '1') && this.lgu_validate === false ) validate_has_data = '2'

      // VALIDATE REQUEST_KEY
      let post_request_key = 'SECONDARY'
      if ((this.add_member_household && this.is_registered === '1') || !this.add_member_household) post_request_key = 'PRIMARY'
      
      let response = await this.$services.wsMemberWeb({
        key:"eurekare_key_web",
        data: {
            command: "322101002",
            data: {
              request_key: post_request_key,
              registered_from: this.process === 'EDIT' ? this.member_data.registered_from : 'web',
              is_app_ready: this.is_app_ready,
              mem_policy_no: this.member_data.mem_hmo_policy_number ? this.member_data.mem_hmo_policy_number : '',
              mem_birthdate: this.member_data.mem_birthdate,
              mem_email: !this.check_no_email ? this.member_data.mem_email_address : 'N/A',
              mem_birthplace: this.member_data.mem_birthplace,
              mem_mobile_no: !this.check_no_contact ? this.member_data.mem_mobile_number : 'N/A',
              mem_landline_number: !this.check_no_landline ? this.member_data.mem_landline_number : 'N/A',
              mem_first_name: this.member_data.mem_first_name,
              mem_middle_name: this.member_data.mem_middle_name ? this.member_data.mem_middle_name : '',
              mem_last_name: this.member_data.mem_last_name,
              mem_suffix: this.member_data.mem_suffix ? this.member_data.mem_suffix : '',
              mem_gender: this.member_data.mem_gender ? this.member_data.mem_gender : '',
              house_number: this.member_data.mem_home_bldgno ? this.member_data.mem_home_bldgno : '',
              street: this.member_data.mem_home_street ? this.member_data.mem_home_street : '',
              // barangay: this.member_data.mem_home_bgy.barangay_name,
              // municipality: this.member_data.mem_home_city_municipality.municipality_name,
              // province: this.member_data.mem_home_province.province_name,
              // region: this.member_data.mem_home_region.region_name,
              barangay: this.member_data.mem_home_bgy?.barangay_name || '',
              municipality: this.member_data.mem_home_city_municipality?.municipality_name || '',
              province: this.member_data.mem_home_province?.province_name || '',
              region: this.member_data.mem_home_region?.region_name || '',
              subdivision: this.member_data.mem_home_subdivision ? this.member_data.mem_home_subdivision : '',
              lot: this.member_data.mem_home_lot ? this.member_data.mem_home_lot : '',
              blk: this.member_data.mem_home_blk ? this.member_data.mem_home_blk : '',
              phase: this.member_data.mem_home_phase ? this.member_data.mem_home_phase : '',
              unit_room_floor: this.member_data.mem_home_unit_room_floor ? this.member_data.mem_home_unit_room_floor : '',
              building_name: this.member_data.mem_home_building_name ? this.member_data.mem_home_building_name : '',
              zip_code: this.member_data.mem_home_zip ? this.member_data.mem_home_zip : '',
              educational_attainment: this.member_data.educational_attainment ? this.member_data.educational_attainment : '',
              mem_company_name: this.member_data.mem_company_name ? this.member_data.mem_company_name : '',
              mem_employer_phic_pin: this.member_data.mem_employer_phic_pin ? this.member_data.mem_employer_phic_pin : '',
              mem_company_address: this.member_data.mem_company_address ? this.member_data.mem_company_address : '',
              employment_status: this.member_data.employment_status,
              mem_employment_type: this.member_data.mem_employment_type ? this.member_data.mem_employment_type : '',
              mem_occupation: this.member_data.mem_occupation,
              indigenous: this.member_data.indigenous == '1' ? 1 : 0,
              ethnic_group: this.member_data.ethnic_group ? this.member_data.ethnic_group : '',
              mem_religion: this.member_data.mem_religion,
              mem_civil_status: this.member_data.mem_civil_status,
              mem_priority_care: this.member_data.mem_priority_care,
              blood_type: this.member_data.blood_type ? this.member_data.blood_type : '',
              mothers_first_name: this.member_data.mothers_first_name ? this.member_data.mothers_first_name : '',
              mothers_middle_name: this.member_data.mothers_middle_name ? this.member_data.mothers_middle_name : '',
              mothers_surname: this.member_data.mothers_surname ? this.member_data.mothers_surname : '',
              mem_phic_pin: this.member_data.mem_phic_pin || null,
              mem_ek_phic_id: this.member_data.mem_ek_phic_id  || null,
              phic_host_code: this.member_data.phic_host_code || null,
              ek_lgu_id: this.member_data.ek_lgu_id || null,
              principal_ek_lgu_id: this.member_data?.principal_ek_lgu_id || '',
              lgu_host_code: this.$store.state.usr_credentials.lgu_host_code || null,
              registration_type: 'LGU',
              has_data: this.member_in_child_care ? '0' : validate_has_data,
              mem_registration_type: mem_reg_type,
              frbs_registration_id: '',
              mem_photo: this.image_from_camera ? this.image_for_posting.slice(22) : '',
              hmo_host_code: null,
              mem_password: null,

              primary_first_name: this.add_member_household ? this.primary_fname : this.member_data.mem_first_name,
              primary_last_name: this.add_member_household ? this.primary_lname : this.member_data.mem_last_name,
              primary_birthdate: this.add_member_household ? this.primary_birthdate : this.member_data.mem_birthdate,
              primary_phic_pin: this.add_member_household ? this.primary_phic_pin : this.member_data.mem_phic_pin,

              mem_phic_membership_type: this.member_data.mem_phic_membership_type ? this.member_data.mem_phic_membership_type : null,
              mem_phic_membership_self_earning_type: this.member_data.mem_phic_membership_self_earning_type ? this.member_data.mem_phic_membership_self_earning_type : null,
              mem_phic_membership_migrant_worker_type: this.member_data.mem_phic_membership_migrant_worker_type ? this.member_data.mem_phic_membership_migrant_worker_type : null,
              mem_phic_membership_foreign_national_pra_srrv: this.member_data.mem_phic_membership_foreign_national_pra_srrv ? this.member_data.mem_phic_membership_foreign_national_pra_srrv : null,
              mem_phic_membership_foreign_national_acr_1: this.member_data.mem_phic_membership_foreign_national_acr_1 ? this.member_data.mem_phic_membership_foreign_national_acr_1 : null,
              mem_phic_membership_type_tag: this.member_data.mem_phic_membership_type_tag ? this.member_data.mem_phic_membership_type_tag : null,
              philsys_number: this.member_data.philsys_number ? this.member_data.philsys_number : null,

              current_card_key: current_card_key,
              is_card_ready: this.member_data.is_card_ready ? this.member_data.is_card_ready : '0',
              is_card_released: this.member_data.is_card_released ? this.member_data.is_card_released  : '0',
              is_edit: this.process === 'EDIT' ? true : false,
              created_by: this.$store.state.usr_credentials.user_name,
              provider_code: this.$store.state.prv_data.provider_code
            }
          }
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        const {status, upload_status, reg_status, ek_lgu_id, mem_photo} = response.data
        if(!status && !upload_status && reg_status != '0') {
          this.submit_loader = false
          this.save_alert = false
          this.alert_content = {}
          this.showAlertMobile(reg_status)
          return
        }

        // UPDATE YETBS HERE 
        const eligible_data = sessionStorage.getItem("YETBS");
        if (eligible_data && this.member_data.mem_phic_pin) {
          const data = JSON.parse(this.$crypto.AES.decrypt(eligible_data, "ygrGk2dX").toString(this.$crypto.enc.Utf8));
          data.pMemPin = data.pPatientPin = this.member_data.mem_phic_pin;
          sessionStorage.setItem("YETBS", this.$crypto.AES.encrypt(JSON.stringify(data), "ygrGk2dX").toString());
          // console.log("✅ Updated YETBS after registration:", JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("YETBS"), "ygrGk2dX").toString(this.$crypto.enc.Utf8)));
        }

        // if (type == 'save') return this.submit_loader = this.save_alert = false , this.alert_content = {}, this.saveProgressFinished()
        if (type === 'save') {
          this.submit_loader = false
          this.save_alert = false
          this.alert_content = {}

          this.saveProgressFinished()
          this.dataMigration(ek_lgu_id)
          return
        }
        this.sessionDataRedirect(ek_lgu_id, mem_photo, current_card_key)
        this.dataMigration(ek_lgu_id)
      } else {
        this.$store.commit('set_transaction_flag', 1)
        this.alert = response.error
      }
    },

    async updateLostCard() {
      this.submit_loader = true
      const current_card_key = (parseInt(this.member_data.current_card_key) + 1).toString()
      let response = await this.$services.wsMemberWeb({
        key:"eurekare_key_web",
        data: {
            command: "322101005",
            data: {
              ek_lgu_id: this.member_data.ek_lgu_id,
              current_card_key: current_card_key,
              is_card_ready: this.member_data.is_card_ready ? this.member_data.is_card_ready : '0',
              is_card_released: this.member_data.is_card_released ? this.member_data.is_card_released  : '0',
              updated_by: this.$store.state.usr_credentials.user_name
          }
        }
      })

      if(response.status === 200) {
         if (!response.data.status) {
          return this.alert = {
            display: true, 
            type: 'standard', 
            width: '350', 
            icon: 'mdi-alert-circle', 
            color: 'red',
            title: 'Something Went Wrong',
            body: 'Please try again',
            btn_pry_txt: 'OK',
            btn_pry_color: 'primary',
            btn_pry_otl: false,
            btn_pry_act: 'reloadPage'
          }
        }
        const mem_photo = this.member_data.mem_photo+this.uniqueImage
        this.sessionDataRedirect(this.member_data.ek_lgu_id, mem_photo, current_card_key)
      } else {
        this.alert = response.error
      }
    },

    sessionDataRedirect(ek_lgu_id, mem_photo, current_card_key) {
      const generate_full_name = `${this.member_data.mem_first_name} ${this.member_data.mem_middle_name || ''} ${this.member_data.mem_last_name} ${this.member_data.mem_suffix || ''}`

      const session_data = {
        step: 3,
        ek_lgu_id: ek_lgu_id,
        full_name: generate_full_name,
        mem_first_name: this.member_data.mem_first_name,
        mem_middle_name: this.member_data.mem_middle_name ? this.member_data.mem_middle_name : '',
        mem_last_name: this.member_data.mem_last_name ? this.member_data.mem_last_name : '',
        birthdate: this.$moment(this.member_data.mem_birthdate).format('MM-DD-YYYY'),
        mem_photo: mem_photo,
        current_card_key: current_card_key,
        lgu_host_code: this.$store.state.usr_credentials.lgu_host_code || null,
        mem_phic_pin: this.member_data.mem_phic_pin || null,
        add_member_household: this.add_member_household,
        phic_data: this.member_data.phic_data,
        
        has_alert_clicked: this.process === 'REPORT LOST CARD' ? false : undefined, 
        ...(this.process === 'REGISTRATION' || this.process === 'ADD HOUSEHOLD' ? {
          principal_ek_lgu_id: this.member_data.principal_ek_lgu_id ? this.member_data.principal_ek_lgu_id : ek_lgu_id ,
          has_primary_care: this.has_primary_care,
          primary_care_data: this.primary_care_data || undefined,
          primary_data: {
            fname: this.add_member_household ? this.primary_fname : this.member_data.mem_first_name,
            lname: this.add_member_household ? this.primary_lname : this.member_data.mem_last_name,
            birthdate: this.add_member_household ? this.primary_birthdate : this.member_data.mem_birthdate,
            mobile_number: this.add_member_household ? this.primary_mobile_number : this.member_data.mem_mobile_number,
            landline_number: this.add_member_household ? this.primary_landline_number : this.member_data.mem_landline_number,
            region: this.add_member_household ? this.primary_region   : this.member_data.mem_home_region,
            province: this.add_member_household ? this.primary_province   : this.member_data.mem_home_province,
            municipality: this.add_member_household  ? this.primary_municipality : this.member_data.mem_home_city_municipality,
            barangay: this.add_member_household  ? this.primary_barangay : this.member_data.mem_home_bgy,

            bldg: this.add_member_household ? this.primary_bldg : this.member_data.mem_home_bldgno,
            street: this.add_member_household ? this.primary_street : this.member_data.mem_home_street,
            zip:this.add_member_household ? this.member_data.mem_home_zip : this.member_data.mem_home_zip,

            subdivision: this.add_member_household ? this.primary_subdivision : this.member_data.mem_home_subdivision,
            phase:  this.add_member_household ? this.primary_phase : this.member_data.mem_home_phase ,
            blk:  this.add_member_household ? this.primary_blk : this.member_data.mem_home_blk ,
            lot:  this.add_member_household ? this.primary_lot : this.member_data.mem_home_lot ,
            bldg_name:  this.add_member_household ? this.primary_bldg_name : this.member_data.mem_home_building_name ,
            unit_floor:  this.add_member_household ? this.primary_unit_floor : this.member_data.mem_home_unit_room_floor ,
          },
        } : undefined),
        
        ...(this.process === 'ISSUE CARD' ? {
            issuance_for_mobile: this.issuance_for_mobile ? this.issuance_for_mobile : undefined,
            primary_care_data: this.primary_care_data || undefined,
        } : undefined)
      }
      sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(session_data), 'njGHDdd'))
      this.$emit('change-step', 3)
    },

    //FOR MIGRATION OF DATA 
    dataMigration(ek_lgu_id) {
      this.$services.trnAddMigration({
        phic_status: this.member_data.phic_data.phic_status,
        case_number: this.member_data.phic_data.case_number,
        ek_lgu_id: ek_lgu_id,
        provider_code: this.$store.state.prv_data.provider_code,
        lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
      })
      .then(()=> {
        this.$store.commit('set_transaction_flag', 1)
      })
      .catch( error => {
        this.$store.commit('set_transaction_flag', 1)
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      })
    },

    showAlertMobile(status){
      let alert_title = status == "1" ? 'Existing mobile number.' : 'Web registration is not required.' 
      let alert_body = status == "1" ? 'To continue registration, please use a different mobile number.' : '' 
      let action = status == "2" ? 'redirect' : ''
      let params = status == "2" ? 'homepage' : ''

      return this.alert = {
        display: true, 
        type: 'standard',
        width: '550', 
        icon: 'mdi-alert-circle', 
        color: 'primary', 
        title: alert_title, 
        body: alert_body, 
        btn_pry_txt: 'OK', 
        btn_pry_color: 'primary', 
        btn_pry_otl: false, 
        btn_pry_act: 'closeAlert', 
        btn_pry_emt: action, 
        btn_pry_params: params 
      }
    },

    saveProgressFinished() {
       const mem_full_name = `${this.member_data.mem_first_name} ${this.member_data.mem_middle_name || ''} ${this.member_data.mem_last_name} ${this.member_data.mem_suffix || ''}`
       const alert_body = this.add_member_household ? 'Do you want to register another household member?' : ''
      
       this.alert = { 
        display: true, 
        type: 'standard',
        width: '580', 
        icon: 'mdi-check-circle', 
        color: 'success', 
        title: `Data for <span class="font-weight-medium">${mem_full_name}</span> has been saved.`, 
        body: alert_body, 
        btn_pry_txt: this.add_member_household ? 'No, proceed to homepage.' : 'Ok', 
        btn_pry_color: 'success', 
        btn_pry_otl: this.add_member_household ? true :false,
        btn_pry_act: 'closeAlert', 
        btn_pry_emt: 'redirect',
        btn_pry_class: this.add_member_household ? '':'px-sm-15',
        btn_pry_params: this.process === 'EDIT' ? 'edit' : this.process === 'OFFLINE TRANSACTION' ? 'offline-transaction' :'homepage', 

        ...(this.add_member_household ? {
          btn_sec_txt: 'Yes', 
          btn_sec_color: 'success', 
          btn_sec_otl: false, 
          btn_sec_act: 'closeAlert',
          btn_sec_emt: 'redirect',
          btn_sec_params: 'userverification', 
          btn_sec_class:'px-sm-15',

        } : undefined)
      }

      this.$store.commit('set_transaction_flag', 1)
    },
  
    // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
    numberOnly(event){
      if((event.which < 48 || event.which > 57) && event.which !== 45){
        event.preventDefault();
      }
    },
    
    // TEXT ONLY
    textOnly(event) {
      if ((event.which < 65 || event.which > 90) && (event.which < 97 || event.which > 122) && event.which !== 32 && event.which !== 241 && event.which !== 209 && event.which !== 45) {
        event.preventDefault();
      }
    },

    formatBirthdate(value) {
      let cleaned = value.replace(/\D/g, '')

      cleaned = cleaned.substring(0, 8)

      if (cleaned.length >= 5) {
        cleaned = cleaned.replace(
          /^(\d{2})(\d{2})(\d{0,4}).*/,
          '$1-$2-$3'
        )
      } else if (cleaned.length >= 3) {
        cleaned = cleaned.replace(
          /^(\d{2})(\d{0,2}).*/,
          '$1-$2'
        )
      }

      this.member_data.mem_birthdate = cleaned
    },

    checkEmail() {
      if (this.check_no_email) {
        this.$nextTick(() => {
          this.member_data.mem_email_address = '';
          this.$refs.email_field.reset();
        });
      }
    },

    checkNoContact() {
      if (this.check_no_contact) {
        this.$nextTick(() => {
          this.member_data.mem_mobile_number = '';
          this.$refs.mobile_field.reset();
        });
      }
    },

    checkNoLandline() {
      if (this.check_no_landline) {
        this.$nextTick(() => {
          this.member_data.mem_landline_number = '';
          this.$refs.landline_field.reset();
        });
      }
    },

    checkPhicNumber() {
      if (this.check_no_phic_number) {
          this.$nextTick(() => {
          this.member_data.mem_phic_pin = '';
          this.$refs.phicn_number_field.reset();
        });
      }
    },

    async redirect(to) {
      if(to === 'edit') {
        await this.$store.dispatch("getLGUMemberData", this.member_data);
        this.$router.push('/eligibility')
      } else if(to === 'offline-transaction') {
        sessionStorage.removeItem('9xgF732sfgh')
        this.$router.push('/offline-transaction')
      } else {
        sessionStorage.removeItem('9xgF732sfgh')
        if (to == 'homepage') return this.$emit('redirect')
  
        if (this.add_member_household) {
          const data = { 
            step: 1, 
            ek_lgu_id: this.member_data.principal_ek_lgu_id, 
            add_member_household: this.add_member_household,
            primary_data: {
                fname: this.primary_fname , 
                lname: this.primary_lname, 
                birthdate: this.primary_birthdate, 
                phic_pin: this.primary_phic_pin,
                mobile_number:this.primary_mobile_number,
                landline_number: this.primary_landline_number,
                region: this.primary_region,
                province: this.primary_province,
                municipality: this.primary_municipality,
                barangay: this.primary_barangay,
                bldg: this.primary_bldg,
                street: this.primary_street,
                zip:this.primary_zip,
                subdivision: this.primary_subdivision,
                phase: this.primary_phase,
                blk: this.primary_blk,
                lot: this.primary_lot,
                bldg_name: this.primary_bldg_name,
                unit_floor: this.primary_unit_floor,
            },

          }
        
          sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(data), 'njGHDdd'))
          this.$emit('getHousehold', data)
          return  this.$emit('change-step', 1)
        }
  
        if (this.issuance_for_mobile) this.$emit('issuanceForMobile')
        return this.$emit('change-step', 1)
      }
    },

    setPriorityCareDefaultValue() {
      if (this.calculateAge(this.member_data.mem_birthdate) >= 60) {
        this.member_data.mem_priority_care = 'SENIOR CITIZEN';
      }
    },

    checkPrincipalPhicNumber() {
      if (this.check_no_principal_phic_number) {
        this.$nextTick(() => {
          this.primary_phic_pin = '';
          this.$refs.principal_phicn_number_field.reset();

          this.alert = {
            display: true, 
            type: 'standard', 
            width: '400', 
            icon: 'mdi-alert-circle', 
            color: 'yellow darken-1', 
            title: 'Principal PhilHealth PIN', 
            body: 'The principal PhilHealth PIN for this member is missing. Validation and submission to Yakap cannot proceed without it.<br>Please update the principal PhilHealth PIN in <br> <strong>Edit Member</strong> (Eligibility Page).', 
            btn_pry_txt: 'OK', 
            btn_pry_color: 'primary', 
            btn_pry_otl: false, 
            btn_pry_act: 'closeAlert' 
          }
        });
      }
    },
  }
}
</script>

<style scoped>
::v-deep .text-primary .v-text-field__slot input {
   color: #4784c1 !important;
   font-weight: 500 !important;
   font-size: 11.5pt !important;
}

::v-deep .text-disabled .v-text-field__slot input { 
  color:  #bcbcbc !important;
  font-weight: 500 !important;
  font-size: 11.5pt !important;
}

::v-deep .text-primary .v-select__selection {
  color: #4784c1 !important;
  font-weight: 500;
  font-size: 11.5pt;
}

::v-deep .text-primary .v-select__slot input {
  color: #4784c1 !important;
}

video {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.content-item-title {
  font-size:11pt;
  font-weight: 400;
  color: #666666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.camera-color {
  background-color: #D9D9D9 !important;
  border: 10px solid white
}

.camera-icon {
  font-size:60pt !important
}

.card-bg{
  background: #eeeeee !important;
}

</style>