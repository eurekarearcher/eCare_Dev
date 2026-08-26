<template>
    <v-card class="card-border pa-7 mt-4" outlined>
        <v-row class="mt-1" align="baseline" dense>
            <!-- <v-col cols="12" sm="2" md="2" lg="2">
                <label class="body-2 font-weight-medium grey--text text--darken-4 grey--text text--darken-4">Patient's Name</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular"> Surname</h5>
                <!-- <v-text-field v-model="patient_info.mem_last_name" class="text-primary body-2 pl-2 pl-sm-0" label="Surname" disabled readonly dense></v-text-field> -->
                <v-text-field v-model="patient_info.mem_last_name" class="text-primary body-2 pl-2 pl-sm-0" disabled readonly dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular"> First Name</h5>
                <!-- <v-text-field v-model="patient_info.mem_first_name" class="text-primary body-2 pl-2 pl-sm-0" label="First Name" disabled readonly dense></v-text-field> -->
                <v-text-field v-model="patient_info.mem_first_name" class="text-primary body-2 pl-2 pl-sm-0" disabled readonly dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular"> Middle Name</h5>
                <!-- <v-text-field v-model="patient_info.mem_middle_name" class="text-primary body-2 pl-2 pl-sm-0" label="Middle Name" disabled  dense></v-text-field> -->
                <v-text-field v-model="patient_info.mem_middle_name" class="text-primary body-2 pl-2 pl-sm-0" disabled  dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="1" md="1" lg="1">
                <h5 class="font-weight-regular"> Suffix</h5>
                <!-- <v-text-field v-model="patient_info.mem_suffix" class="text-primary body-2 pl-2 pl-sm-0" label="Suffix" disabled readonly dense></v-text-field> -->
                <v-text-field v-model="patient_info.mem_suffix" class="text-primary body-2 pl-2 pl-sm-0" disabled readonly dense></v-text-field>
            </v-col>
        </v-row>

        <v-row align="baseline" dense>
            <!-- <v-col cols="12" sm="2" md="2" lg="2">
                <label class="font-weight-regular">Age</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Age</h5>
                <v-text-field :value="textCapitalize(ageByYearsMonthsDays(patient_info.mem_birthdate))" class="text-primary body-2 pl-2 pl-sm-0" @blur="emitData('pti')"  disabled readonly dense></v-text-field>
            </v-col>
            <!-- <v-col class="text-sm-right" cols="12" sm="2" md="1" lg="1">
                <label class="font-weight-regular">Gender</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Gender</h5>
                <v-text-field :value="textCapitalize(patient_info.mem_gender)" class="text-primary body-2 pl-2 pl-sm-0" disabled readonly dense></v-text-field>
            </v-col>
            <!-- <v-col class="text-md-right" cols="12" sm="2" md="1" lg="1">
                <label class="font-weight-regular">Birthday</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Birthday</h5>
                <v-text-field :value="formatDate(patient_info.mem_birthdate)" class="text-primary body-2 pl-2 pl-sm-0" disabled readonly dense></v-text-field>
            </v-col>
            <!-- <v-col class="text-sm-right" cols="12" sm="2" md="1" lg="1">
                <label class="font-weight-regular">Birthplace</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Birthplace</h5>
                <v-text-field v-model="patient_info.mem_birthplace" class="text-primary body-2 pl-2 pl-sm-0" :disabled="!emr_params.editable || patient_info.mem_birthplace_disabled" :readonly="patient_info.mem_birthplace_disabled"  @blur="emitData('pti')" dense></v-text-field>
            </v-col>
        </v-row>

        <v-row align="baseline" dense>
            <!-- <v-col cols="12" sm="2" md="2" lg="2">
                <label class="font-weight-regular">Blood Type</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Blood Type</h5>
                <v-autocomplete v-model="patient_info.blood_type" @keydown.enter.prevent :items="blood_type_list"  class="text-primary body-2 pl-2 pl-sm-0" :disabled="!emr_params.editable || patient_info.mem_blood_type_disabled" @blur="emitData('pti')" dense></v-autocomplete>
            </v-col>
            <!-- <v-col class="text-md-right text-sm-right" cols="12" sm="2" md="1" lg="1">
                <label class="font-weight-regular">Occupation</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Occupation</h5>
                <v-text-field v-model="patient_info.mem_occupation" class="text-primary body-2 pl-2 pl-sm-0" :disabled="!emr_params.editable || patient_info.mem_occupation_disabled" :readonly="patient_info.mem_occupation_disabled" @blur="emitData('pti')" dense></v-text-field>
            </v-col>

            <!-- <v-col class="text-md-right" cols="12" sm="2" md="1" lg="1">
                <label class="font-weight-regular">Contact No.</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Contact No.</h5>
                <v-text-field v-model="patient_info.mem_mobile_number" class="text-primary body-2 pl-2 pl-sm-0" :disabled="!emr_params.editable || patient_info.mem_mobile_number_disabled" :readonly="patient_info.mem_mobile_number_disabled" @blur="emitData('pti')" dense maxlength="10">
                    <h6 slot="prepend-inner" class="body-2 align-baseline" style="color: #5E5E5E; margin-top:5px; font-weight:500; font-size:11.5pt">+63</h6>
                </v-text-field>
            </v-col>

            <!-- <v-col class="d-flex align-center" cols="12" sm="5" md="2" lg="2">
                <template v-if="patient_info.mem_phic_pin">
                    <v-text-field v-model="patient_info.mem_phic_pin" class="text-primary body-2 pl-2 pl-sm-0" @blur="emitData('pti')" label="PHIC Pin" disabled readonly dense></v-text-field>
                </template>
                <template v-else>
                    <h5 class="font-weight-regular pl-2 pr-1">PHIC</h5>
                    <v-radio-group disabled :value="patient_info.mem_phic_pin ? '1' : '0'" class="pa-0 ma-0" hide-details readonly row>
                        <v-radio label="Yes" value="1"></v-radio>
                        <v-radio class="mx-0" label="No" value="0"></v-radio>
                    </v-radio-group>
                </template>
            </v-col> -->

            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Landline No.</h5>
                <v-text-field v-model="patient_info.mem_landline_number" class="text-primary body-2 pl-2 pl-sm-0" :disabled="!emr_params.editable || patient_info.mem_landline_number_disabled" :readonly="patient_info.mem_landline_number_disabled" @blur="emitData('pti')" dense maxlength="10">
                    <h6 slot="prepend-inner" class="body-2 align-baseline" style="color: #5E5E5E; margin-top:5px; font-weight:500; font-size:11.5pt">+</h6>
                </v-text-field>
            </v-col>
        </v-row>

        <v-row align="baseline" dense>
            <!-- <v-col cols="12" sm="2" md="2" lg="2">
                <label class="font-weight-regular">Landline No.</label>
            </v-col> -->

            <!-- <v-col class="text-sm-right text-md-right" cols="12" sm="2" md="1" lg="1">
                <label class="font-weight-regular">Email Address</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Email Address</h5>
                <v-text-field v-model="patient_info.mem_email_address" class="text-primary body-2 pl-2 pl-sm-0"  @blur="emitData('pti')" dense></v-text-field>
            </v-col>

            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Member Registration Type</h5>
                <v-text-field v-model="patient_info.member_registration_type" class="text-primary body-2 pl-2 pl-sm-0" disabled readonly dense></v-text-field>
            </v-col>

            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Philhealth Identification Number</h5>
                <v-text-field v-model="patient_info.mem_phic_pin" class="text-primary body-2 pl-2 pl-sm-0" disabled readonly dense></v-text-field>
            </v-col>
        </v-row>
        
        <v-row align="baseline" justify="end" dense>
            <!-- <v-col cols="12" sm="2" md="2" lg="2">
                <label class="font-weight-regular">Address</label>
            </v-col> -->
            <v-col cols="12" sm="5" md="" lg="">
                <h5 class="font-weight-regular">Building No.</h5>
                <v-text-field v-model="patient_info.mem_home_bldgno" class="text-primary body-2 pl-2 pl-sm-0" :disabled="!emr_params.editable || patient_info.mem_home_bldgno_disabled" :readonly="patient_info.mem_home_bldgno_disabled" @blur="emitData('pti')" dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="5" md="" lg="">
                <h5 class="font-weight-regular">Barangay</h5>
                <v-text-field v-model="patient_info.mem_home_bgy" class="text-primary body-2 pl-2 pl-sm-0" :readonly="patient_info.mem_home_bgy_disabled" :error="pti_empty_fields && !patient_info.mem_home_bgy" @blur="emitData('pti')" disabled dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="5" md="" lg="">
                <h5 class="font-weight-regular">Municipality</h5>
                <v-text-field v-model="patient_info.mem_home_city_municipality" class="text-primary body-2 pl-2 pl-sm-0" :disabled="!emr_params.editable || patient_info.mem_home_city_municipality_disabled" :readonly="patient_info.mem_home_city_municipality_disabled" :error="pti_empty_fields && !patient_info.mem_home_city_municipality" @blur="emitData('pti')" dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="5" md="" lg="">
                <h5 class="font-weight-regular">Province</h5>
                <v-text-field v-model="patient_info.mem_home_province" class="text-primary body-2 pl-2 pl-sm-0" :disabled="!emr_params.editable || patient_info.mem_home_province_disabled" :readonly="patient_info.mem_home_province_disabled" :error="pti_empty_fields && !patient_info.mem_home_province" @blur="emitData('pti')" dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="5" md="" lg="">
                <h5 class="font-weight-regular">Zip Code</h5>
                <v-text-field v-model="patient_info.mem_home_zip" class="text-primary body-2 pl-2 pl-sm-0" :disabled="!emr_params.editable || patient_info.mem_home_zip_disabled" :readonly="patient_info.mem_home_zip_disabled" :error="pti_empty_fields && !patient_info.mem_home_zip" @blur="emitData('pti')" dense></v-text-field>
            </v-col>
        </v-row>

        <v-row  align="baseline" dense>
            <!-- <v-col cols="12" sm="2" md="2" lg="2">
                <label class="font-weight-regular">Ethnic Group</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Ethnic Group</h5>
                <v-text-field v-if="patient_info.ethnic_group_disabled" v-model="patient_info.ethnic_group" class="text-primary body-2 pl-2 pl-sm-0" :disabled="!emr_params.editable || patient_info.ethnic_group_disabled" readonly dense></v-text-field>
                <v-autocomplete v-else v-model="patient_info.ethnic_group" :disabled="!emr_params.editable || patient_info.ethnic_group_disabled" :items="ethnic_items" @blur="emitData('pti')" class="body-2 pl-2 pl-sm-0" dense></v-autocomplete>
            </v-col>
            <!-- <v-col class="text-md-right" cols="12" sm="2" md="2" lg="1">
                <label class="font-weight-regular">Marital Status</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Marital Status</h5>
                <v-text-field v-model="patient_info.mem_civil_status"  class="text-primary body-2 pl-2 pl-sm-0" @blur="emitData('pti')" dense readonly> </v-text-field>
            </v-col>
            <!-- <v-col class="text-md-right" cols="12" sm="2" md="1" lg="1">
                <label class="font-weight-regular">Religion</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Religion</h5>
                <v-text-field v-model="patient_info.mem_religion"  class="text-primary body-2 pl-2 pl-sm-0" ref="selectedReligion" @change="otherReligion" @blur="emitData('pti')" dense readonly> </v-text-field>
            </v-col>
        </v-row>  
        
         <v-row align="baseline" dense>
            <!-- <v-col cols="12" sm="5" md="2" lg="2">
                <label class="font-weight-regular">Employer Philhealth Number:</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Employer Philhealth Number:</h5>
                <v-text-field v-model="patient_info.mem_employer_phic_pin"  class="text-primary body-2 pl-2 pl-sm-0"  dense readonly> </v-text-field>
            </v-col>
            <!-- <v-col class="text-md-right" cols="12" sm="5" md="1" lg="1">
                <label class="font-weight-regular">Employer Name: </label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Employer Name: </h5>
                <v-text-field v-model="patient_info.mem_company_name"  class="text-primary body-2 pl-2 pl-sm-0" dense readonly> </v-text-field>
            </v-col>
            <!-- <v-col class="text-md-right" cols="12" sm="5" md="1" lg="1">
                <label class="font-weight-regular">Employer Address:</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Employer Address:</h5>
                <v-text-field v-model="patient_info.mem_company_address"  class="text-primary body-2 pl-2 pl-sm-0" dense readonly> </v-text-field>
            </v-col>
        </v-row> 
        
        <v-row  align="baseline" dense>
            <!-- <v-col cols="12" sm="5" md="2" lg="2">
                <label class="font-weight-regular">Guardian / Companion</label>
            </v-col> -->
            <v-col cols="12" sm="" md="" lg="">
                <h5 class="font-weight-regular">Guardian / Companion</h5>
                <v-text-field v-model="plan_data.guardian" class="text-primary body-2 pl-2 pl-sm-0" :disabled="!emr_params.editable || patient_info.guardian_disabled" :readonly="patient_info.guardian_disabled" @blur="emitData('pti')"  dense ></v-text-field>
            </v-col>
        </v-row> 

        <v-row v-if="emr_params.tele_consult" align="baseline" class="pb-4" dense>
            <v-col cols="12" sm="12" md="12" lg="12" class="text-center mb-6 mt-2">
                <label class="body-1 font-weight-medium blue--text">CONTACT INFORMATION FOR TELE CONSULT REFERRAL </label>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4" class="d-flex justify-center align-baseline"> 
                <h5 class="body-2 font-weight-medium grey--text text--darken-4 mx-4">Preferred Number</h5>
                <v-text-field v-model="emr_params.preffered_contact_no" class="text-primary body-2 pl-2 pl-sm-0" disabled dense>
                    <h6 slot="prepend-inner" class="body-2 align-baseline" style="color: #5E5E5E; margin-top:5px; font-weight:500; font-size:11.5pt">+63</h6>
                </v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4" class="d-flex justify-center align-baseline"> 
                <h5 class="body-2 font-weight-medium grey--text text--darken-4 mx-4">Landline/Mobile No</h5>
                <v-text-field v-model="emr_params.landline_mobile_no" class="text-primary body-2 pl-2 pl-sm-0" disabled dense>
                </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4" lg="4" class="d-flex justify-center align-baseline"> 
                <h5 class="body-2 font-weight-medium grey--text text--darken-4 mx-4">Viber</h5>
                <v-text-field v-model="emr_params.viber_no" class="text-primary body-2 pl-2 pl-sm-0" disabled dense>
                    <h6 slot="prepend-inner" class="body-2 align-baseline" style="color: #5E5E5E; margin-top:5px; font-weight:500; font-size:11.5pt">+63</h6>
                </v-text-field>
            </v-col>
        </v-row>

        <v-dialog v-model="religion.dialog" width="400" persistent>
            <v-card class="pa-5">
                <h6 class="font-weight-regular body-2">Current: {{ religion.current }}</h6>
                <v-divider class="my-2"></v-divider>
                <h6 class="font-weight-regular body-2">{{ religion.title }}</h6>
                <v-text-field v-model="religion.new" :placeholder="religion.label" hide-details outlined></v-text-field>

                <v-layout justify-end wrap mt-4>
                    <v-btn @click="religion.dialog = false" small>CLOSE</v-btn>
                    <v-btn @click="saveOtherReligion" :disabled="!religion.new" class="ml-2" color="primary" small>CONFIRM</v-btn>
                </v-layout>
            </v-card>
        </v-dialog> 
    </v-card>
</template>

<script>

export default {
    props: ['patient_info','ethnic_items', 'plan_data', 'pti_empty_fields', 'emr_params', 'blood_type_list'],
    
    data() {
        return { 
            religion: {
                title: 'Religion',
                label: 'Enter the religion here',
                dialog: false,
                current: '',
                new: ''
            },
        }
    },

    methods: {
        emitData(pti){
            this.$emit('mutationStatus', pti)
        },

        otherReligion() {
            if(this.patient_info.mem_religion === 'OTHERS') {
                this.religion.dialog = true
            }
        },

        saveOtherReligion() {
            this.religion.dialog = false     
            this.$refs.selectedReligion.selectedItems[0] = this.religion.new
        },
    }
}
</script>

<style scoped>
::v-deep .text-primary .v-text-field__slot input {
    color: #5E5E5E !important;
    font-weight: 500 !important;
    font-size: 11.5pt !important;
}

::v-deep input[type="text"]:disabled {
    color: #5E5E5E !important;
    font-weight: 500 !important;
    font-size: 11.5pt !important;
}
.tabs-border{ border: 1px solid rgb(214 214 214); }
</style>



