<template>
    <div>
    <h2 class="page-title py-2 text-center">ELIGIBILITY</h2>
        
        <div v-if="($store.state.usr_credentials.department !== 'Data Encoder' && referral_data.fresh_load === false) || 
        $store.state.usr_credentials.department === 'Data Encoder' && referral_data.fresh_load === false && transaction_data.fresh_load === false ">
            <div v-if="has_referral_transaction" align="right">
                <v-btn :disabled="selected_referral_transaction" @click="$emit('view-referral-transaction-dialog')" class="mb-2 ml-2 white--text" color="#367c9d">
                   {{ $store.state.usr_credentials.department === 'Data Encoder' && migration_enabled ? 'View All Migrated Transactions & Referrals' : 'View All Referrals'}}
                </v-btn>
            </div>
            <div v-else align="right">
                <v-btn disabled class="mb-2 ml-2 white--text" color="#367c9d">
                   {{ $store.state.usr_credentials.department === 'Data Encoder' && migration_enabled ? 'No migrated transactions or referrals found.' : 'No referrals found'}}
                </v-btn>
            </div>
        </div>
        <div v-else align="right">
          <v-col sm="4">
          <h5 class="text-center font-weight-regular">
            {{ $store.state.usr_credentials.department === 'Data Encoder' && migration_enabled ? 'Checking migrated transactions and referrals...' : 'Checking referrals..'}}
          </h5>
          <v-progress-linear style="opacity:0.8" color="light-blue darken-4" height="10" indeterminate rounded></v-progress-linear>
          </v-col>
        </div>

        <v-card outlined class="mb-5 py-5">
            <v-row dense wrap>
               <v-col cols="12" sm="3" md="3" lg="2" xl="2" align-self="center" class="px-2">
                    <v-img v-if="!member_data.mem_photo" src="@/assets/no-image.jpg" width="165" height="205" class="mx-auto" alt="no image" ></v-img>
                    <v-img v-else :src="member_data.mem_photo_upd? member_data.mem_photo_upd : member_data.mem_photo" width="165"  height="205" class="mx-auto elevation-5" alt="patient image" style="border:5px solid white"></v-img>
                    <v-card-text class="label-style pa-0 mt-3 text-center font-weight-bold mb-sm-3">{{member_data.mem_first_name + ' ' + (member_data.mem_middle_name ? member_data.mem_middle_name : '')  + ' ' + member_data.mem_last_name + ' ' + (member_data.mem_suffix ? member_data.mem_suffix : '' )}}</v-card-text>
                    <v-sheet class="d-flex justify-center align-baseline"> 
                        <v-btn @click="goToAdditionalInfoPage" class="white--text" color="#367c9d"> 
                            <v-progress-circular v-if="edit_loader" indeterminate class="mr-1" color="white" size="18" width="2" ></v-progress-circular>
                            <v-icon v-else class="mr-2" small left> mdi mdi-pencil  </v-icon> 
                            Edit Info 
                        </v-btn>
                    </v-sheet>
                    <v-divider class="hidden-md-and-up mb-5 mb-md-0"></v-divider>
               </v-col>

                <v-col cols="12" sm="12" md="9" lg="10" xl="10" class="px-sm-6">
                    <v-row dense wrap>
                        <v-col cols="12" sm="4" md="3" class="mb-3">
                            <v-card-text class="label-style py-0 ">First Name: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_first_name}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" class="mb-3">
                            <v-card-text class="label-style py-0 ">Middle Name: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_middle_name}} </v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" class="mb-3">
                            <v-card-text class="label-style py-0 ">Last Name: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_last_name}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" class="mb-3">
                            <v-card-text class="label-style py-0 ">Suffix: </v-card-text>
                            <v-card-text class="value-style py-0">{{ member_data.mem_suffix }}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" class="mb-3">
                            <v-card-text class="label-style py-0 ">Birthdate: </v-card-text>
                            <v-card-text class="value-style py-0">{{ formatDate(member_data.mem_birthdate) }}</v-card-text>
                        </v-col>
            
                        <v-col cols="12" sm="4" md="3" class="mb-3">
                            <v-card-text class="label-style py-0 ">Age: </v-card-text>
                            <v-card-text class="value-style py-0">{{ageByYearsMonthsDays(member_data.mem_birthdate)}}</v-card-text>
                        </v-col>
                        
                        <v-col cols="12" sm="4" md="3" class="mb-3">
                            <v-card-text class="label-style py-0 ">Gender: </v-card-text>
                            <v-card-text class="value-style py-0">{{formatGender(member_data.mem_gender)}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" class="mb-3">
                            <v-card-text class="label-style py-0 ">Blood Type: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.blood_type ? member_data.blood_type : 'N/A'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" class="mb-0">
                            <v-card-text class="label-style py-0">Ethnic Group: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.ethnic_group ? member_data.ethnic_group : '&nbsp;'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" class="mb-0">
                            <v-card-text class="label-style py-0">Indigenous: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.indigenous === '1' ? 'Yes' : 'No'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="2" class="mb-0">
                            <v-card-text class="label-style py-0 ">Email Address: </v-card-text>
                            <v-card-text class="value-style py-0">{{ member_data.mem_email_address ? member_data.mem_email_address : 'N/A'  }}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="2" class="mb-0">
                            <v-card-text class="label-style py-0 ">Contact Number: </v-card-text>
                            <v-card-text class="value-style py-0">
                                {{ member_data.mem_mobile_number === 'N/A' ? member_data.mem_mobile_number 
                                : member_data.mem_mobile_number === null ? ""
                                : "+63" + member_data.mem_mobile_number 
                                }}
                            </v-card-text>
                         </v-col>

                        <v-col cols="12" sm="4" md="2" class="mb-0">
                            <v-card-text class="label-style py-0 ">Landline Number: </v-card-text>
                            <v-card-text class="value-style py-0">
                                {{ member_data.mem_landline_number === 'N/A' ? member_data.mem_landline_number 
                                   : member_data.mem_landline_number === null ? ""
                                   : "+" + member_data.mem_landline_number 
                                }}
                            </v-card-text>
                        </v-col>
                    </v-row>

                    <v-divider class="my-2 ml-4 mr-8"></v-divider>

                    <v-row dense wrap>
                        <v-col cols="12" sm="4" md="4" class="mb-0">
                            <v-card-text class="label-style py-0">Mother's First Name: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mothers_first_name ? member_data.mothers_first_name : '&nbsp;'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" class="mb-0">
                            <v-card-text class="label-style py-0">Mother's Middle Name: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mothers_middle_name ? member_data.mothers_middle_name : '&nbsp;'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="4" class="mb-0">
                            <v-card-text class="label-style py-0">Mother's Surname: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mothers_surname ? member_data.mothers_surname : '&nbsp;'}}</v-card-text>
                        </v-col>
                    </v-row>

                    <v-divider class="my-2 ml-4 mr-8"></v-divider>

                    <v-row dense wrap>
                        <v-col cols="12" sm="6" md="4" class="mb-0">
                            <v-card-text class="label-style py-0">Educational Attainment: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.educational_attainment ? member_data.educational_attainment : 'N/A' }}</v-card-text>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" class="mb-0">
                            <v-card-text class="label-style py-0">Employment Status: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.employment_status ? member_data.employment_status : 'N/A'}}</v-card-text>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" class="mb-0">
                            <v-card-text class="label-style py-0">Employer Philhealth Number: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_employer_phic_pin ? member_data.mem_employer_phic_pin : 'N/A'}}</v-card-text>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" class="mb-0">
                            <v-card-text class="label-style py-0">Company Name: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_company_name ? member_data.mem_company_name : 'N/A'}}</v-card-text>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" class="mb-0">
                            <v-card-text class="label-style py-0">Employer Address: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_company_address ? member_data.mem_company_address : 'N/A'}}</v-card-text>
                        </v-col>
                    </v-row>

                    <v-divider class="my-2 ml-4 mr-8"></v-divider>

                    <v-row dense wrap my-1>
                        <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="mb-0 mb-sm-3 mb-md-2">
                            <v-card-text class="label-style py-0">Region: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_home_region ? member_data.mem_home_region : 'N/A'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="mb-0 mb-sm-3 mb-md-2">
                            <v-card-text class="label-style py-0">Province: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_home_province ? member_data.mem_home_province : 'N/A'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="mb-0 mb-sm-3 mb-md-2">
                            <v-card-text class="label-style py-0">Municipality: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_home_city_municipality ? member_data.mem_home_city_municipality : 'N/A'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="mb-0 mb-sm-3 mb-md-2">
                            <v-card-text class="label-style py-0">Barangay: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_home_bgy ? member_data.mem_home_bgy : 'N/A'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="mb-0 mb-sm-3  mb-md-2">
                            <v-card-text class="label-style py-0">Subdivision: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_home_subdivision ? member_data.mem_home_subdivision : 'N/A'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="mb-0 mb-sm-3  mb-md-2">
                            <v-card-text class="label-style py-0">Phase: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_home_phase ? member_data.mem_home_phase : 'N/A'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="mb-3">
                            <v-card-text class="label-style py-0">Street: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_home_street ? member_data.mem_home_street : 'N/A'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="mb-3">
                            <v-card-text class="label-style py-0">Blk No. / Lot No.: </v-card-text>
                            <v-card-text v-if="!member_data.mem_home_blk && !member_data.mem_home_lot" class="value-style py-0">N/A</v-card-text>
                            <v-card-text v-else class="value-style py-0">{{member_data.mem_home_blk ? `blk ${member_data.mem_home_blk}` : 'N/A'}} / {{member_data.mem_home_lot ? `lot ${member_data.mem_home_lot}` : 'N/A'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="mb-3">
                            <v-card-text class="label-style py-0">Building Name: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_home_building_name ? member_data.mem_home_building_name : 'N/A'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="mb-3">
                            <v-card-text class="label-style py-0">House No.: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_home_bldgno ? member_data.mem_home_bldgno : 'N/A'}}</v-card-text>
                        </v-col>

                        <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="mb-3">
                            <v-card-text class="label-style py-0">Unit Room / Floor: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_home_unit_room_floor ? member_data.mem_home_unit_room_floor : 'N/A'}}</v-card-text>
                        </v-col>
                        
                        <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="mb-0">
                            <v-card-text class="label-style py-0">Zip: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.mem_home_zip ? member_data.mem_home_zip : 'N/A'}}</v-card-text>
                        </v-col>
                    </v-row>

                    <v-divider class="my-2 ml-4 mr-8"></v-divider>

                    <v-row dense wrap>
                        <v-col cols="12" sm="6" md="12" class="mb-0">
                            <v-card-text class="label-style py-0">Primary Care Provider: </v-card-text>
                            <v-card-text class="value-style py-0">{{member_data.primary_care_prv_name ? `${member_data.primary_care_prv_name} - ${member_data.primary_care_prv_location}` : 'N/A' }}</v-card-text>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card>
        
        <v-row dense>
            <v-col cols="12" class="px-0 mt-5 mb-1">
                <v-tabs v-model="tab" active-class="active-tab" hide-slider outlined>
                    <v-tab v-if="process_type.includes('PHIC')" class="non-active-tab">PHIC</v-tab>
                    <v-tab v-if="process_type.includes('HMO')" class="non-active-tab">HMO</v-tab>
                    <v-tab v-if="process_type.includes('LGU')" class="non-active-tab">LGU</v-tab>
                    <v-tab v-if="process_type.includes('LGU')" class="non-active-tab">PHIC</v-tab>
                    
                    <v-tabs-items v-model="tab">
                        <v-card outlined id="tab-data">
                            <v-tab-item v-if="process_type.includes('PHIC')">
                                <v-row class="py-3" dense wrap>
                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Philhealth Status <br/>
                                        <b class="value-style font-weight-medium" :class="member_data.mem_ph_status == 'ACTIVE' || member_data.mem_ph_status == 'Eligible' ? 'success--text' : 'danger--text'">{{member_data.mem_ph_status}}</b>
                                        </v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">PHIC Tracking Number <br/>
                                        <b class="value-style font-weight-medium" :class="member_data.phic_tracking_num === 'N/A' ? 'error--text' : 'success--text'">{{member_data.phic_tracking_num }}</b>
                                        </v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Name of Institution <br/><b class="value-style font-weight-medium success--text">{{provider_name}}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">HCI Accreditation No. <br/><b class="value-style">N/A</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Name of Member  <br/><b class="value-style">{{ member_data.mem_name}}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Member PHIC Pin <br/><b class="value-style">{{member_data.mem_phic_pin}}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Date of Birth <br/><b class="value-style">{{member_data.mem_birthdate}}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Member Category  <br/><b class="value-style">{{member_data.mem_category}}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">PHIC Membership Type <br/><b class="value-style">{{member_data.mem_phic_mem_type}}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Sex <br/><b class="value-style">{{!member_data.mem_gender || member_data.mem_gender === 'N/A' ? 'N/A' : (member_data.mem_gender.toLowerCase().charAt(0) === 'm' ? 'MALE' : 'FEMALE' )}}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Eligibility to Avail Philhealth Benefits: <br/><b class="value-style">{{member_data.mem_ph_status === 'ACTIVE' ? 'YES' : 'NO'}}</b></v-card-text>
                                    </v-col>
                                </v-row>
                            </v-tab-item>

                            <v-tab-item v-if="process_type.includes('HMO')">
                                <v-row v-if="!member_data.mem_hmo_loader" justify="center" class="py-12" dense wrap>
                                    <v-progress-circular size="25" color="primary" indeterminate class="align-self-center"></v-progress-circular>
                                    <h4 class="loader-title"> Loading Data... Please wait...</h4>
                                </v-row>
                                <v-row v-else class="py-3" dense wrap>
                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style py-1">Health Insurance Status: <br/>
                                        <b class="value-style font-weight-medium" :class="member_data.mem_hmo_status == 'ACTIVE' ? 'success--text' : 'error--text'">{{member_data.mem_hmo_status ? member_data.mem_hmo_status : 'N/A'}}</b>
                                        </v-card-text>
                                    </v-col>
                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Health Insurance Provider Accreditation: <br/>
                                        <b class="value-style font-weight-medium">
                                        <span v-if="isAccredited === undefined" class="primary--text">LOADING PLEASE WAIT...</span>
                                        <span v-if="isAccredited" class="success--text">{{provider_name}}</span>
                                        <span v-if="!isAccredited" class="danger--text">PLEASE CONTACT YOUR HMO</span>
                                        </b></v-card-text>
                                    </v-col>
                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Healthcare Insurance ID: <br/><b class="value-style">{{member_data.mem_hmo_policy_number ? member_data.mem_hmo_policy_number : 'N/A'}}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Private Healthcare Insurance Company: <br/><b class="value-style">{{ member_data.private_hmo}}</b></v-card-text>
                                    </v-col>
                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Membership Type: <br/><b class="value-style">{{ member_data.membership_type}}</b></v-card-text>
                                    </v-col>
                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Member Type: <br/><b class="value-style">{{ member_data.mem_hmo_type }}</b></v-card-text>
                                    </v-col>
                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Pre Existing: <br/><b class="value-style">{{ member_data.mem_hmo_preexist}}</b></v-card-text>
                                    </v-col>
                                    <v-col cols="12" sm="4" md="3" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Room and Board Plan: <br/><b class="value-style">{{ member_data.mem_room_plan}}</b></v-card-text>
                                    </v-col>
                                    <v-col cols="12" sm="6" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Waiver: <br/><b class="value-style">{{member_data.mem_waiver}}</b></v-card-text>
                                    </v-col>
                                    <v-col cols="12" sm="6" align-self="end" class="mb-3">
                                        <v-card-text class="label-style">Dental: <br/><b class="value-style">{{member_data.mem_dental}}</b></v-card-text>
                                    </v-col>
                                </v-row>
                            </v-tab-item>

                            <v-tab-item v-if="process_type.includes('LGU')">
                                <v-row v-if="!member_data.mem_lgu_loader" justify="center" class="py-12" dense wrap>
                                    <v-progress-circular size="25" color="primary" indeterminate class="align-self-center"></v-progress-circular>
                                    <h4 class="loading-text"> Loading Data... Please wait...</h4>
                                </v-row>

                                <v-row v-else class="py-3" dense wrap>
                                    <v-col cols="12" sm="4" md="3" class="mb-3">
                                        <!-- <v-card-text class="label-style">Card Number: <br/><b class="value-style">{{member_data.mem_card_num ? member_data.mem_card_num  : 'N/A' }}</b></v-card-text> -->
                                        <v-card-text class="label-style">Card Number: <br/><b class="value-style">{{ member_data.ek_lgu_id }}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" class="mb-3">
                                        <v-card-text class="label-style">Card Status: <br/>
                                        <!-- <b v-if="member_data.mem_lgu_card_status" class="value-style font-weight-medium" :class="member_data.mem_lgu_card_status == 'ACTIVE' ? 'success--text' : 'error--text'">{{member_data.mem_lgu_card_status}}</b>
                                        <b v-else class="value-style" >N/A</b> -->
                                        <b class="value-style success--text">ACTIVE</b>
                                        </v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" class="mb-3">
                                        <v-card-text class="label-style">Name of LGU: <br/>
                                            <!-- <b class="value-style font-weight-medium" :class="{'success--text' : member_data.mem_lgu_name }">{{member_data.mem_lgu_name ? member_data.mem_lgu_name : 'N/A'}}</b> -->
                                            <b class="value-style font-weight-medium success--text">{{ member_data.mem_home_city_municipality }}, {{ member_data.mem_home_province }}</b>
                                        </v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" class="mb-3">
                                        <v-card-text class="label-style">Member LGU Status: <br/>
                                            <b v-if="member_data.mem_lgu_member_status" class="value-style font-weight-medium" :class="member_data.mem_lgu_member_status ? 'success--text' : 'error--text'">{{member_data.mem_lgu_member_status}}</b>
                                            <b v-else class="value-style">{{'N/A'}}</b>
                                        </v-card-text>
                                    </v-col>
                                    
                                    <v-col cols="12" sm="4" md="3" class="mb-3">
                                        <v-card-text class="label-style">Member LGU Number: <br/><b class="value-style">{{member_data.mem_lgu_member_number ? member_data.mem_lgu_member_number : 'N/A' }}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" class="mb-3">
                                        <v-card-text class="label-style">Member LGU Type: <br/><b class="value-style">{{member_data.mem_lgu_type ? member_data.mem_lgu_type : 'N/A' ? member_data.mem_lgu_type ? member_data.mem_lgu_type : 'N/A' : 'N/A' }}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" class="mb-3">
                                        <v-card-text class="label-style">Member LGU Category: <br/><b class="value-style">{{member_data.mem_lgu_category ? member_data.mem_lgu_category : 'N/A' }}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" class="mb-3">
                                        <v-card-text class="label-style">Account Name: <br/><b class="value-style">{{member_data.mem_account_name ? member_data.mem_account_name : 'N/A' }}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" class="mb-3">
                                        <v-card-text class="label-style">Company: <br/><b class="value-style">{{member_data.mem_company_name ? member_data.mem_company_name : 'N/A' }}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" class="mb-3">
                                        <v-card-text class="label-style">Employment Type: <br/><b class="value-style">{{member_data.mem_employment_type ? member_data.mem_employment_type : 'N/A' }}</b></v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" md="3" class="mb-3">
                                        <v-card-text class="label-style">Dental: <br/><b class="value-style">{{member_data.mem_dental ? member_data.mem_dental : 'N/A' }}</b></v-card-text>
                                    </v-col>
                                </v-row>
                            </v-tab-item>

                            <v-tab-item v-if="process_type === 'LGU'">
                                <v-row v-if="!member_data.mem_lgu_loader" justify="center" class="py-12" dense wrap>
                                    <v-progress-circular size="25" color="primary" indeterminate class="align-self-center"></v-progress-circular>
                                    <h4 class="loading-text"> Loading Data... Please wait...</h4>
                                </v-row>

                                <v-row v-else class="py-3" wrap>
                                    <v-col cols="12" sm="4" align-self="end" class="mb-5">
                                        <v-card-text class="label-style">Yakap Eligible: <br/>
                                        <b class="value-style font-weight-medium" :class="show_ekonsulta_eligible ? 'success--text' : 'error--text'"> {{ show_ekonsulta_eligible? 'Records Found':'No records found' }} </b>
                                        </v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" align-self="end" class="mb-5">
                                        <v-card-text class="label-style">Eclaims Eligible: <br/> 
                                        <b class="value-style font-weight-medium" :class="show_eclaims_eligible ? 'success--text' : 'error--text'"> {{ show_eclaims_eligible ? 'Records Found':'No records found' }} </b>
                                        </v-card-text>
                                    </v-col>

                                    <v-col cols="12" sm="4" align-self="end" class="mb-5"> 
                                        <template v-if="eligible_data.pPatientPin"> 
                                            <v-card-text class="label-style">Patient PHIC Identification Number: <br/><b class="value-style">{{eligible_data.pPatientPin ? eligible_data.pPatientPin : 'N/A' }}</b></v-card-text>
                                        </template>
                                        <template v-else> 
                                            <v-card-text class="label-style">Patient PHIC Identification Number: <br/>
                                                {{ member_data.mem_phic_pin ? member_data.mem_phic_pin:'N/A' }}
                                            </v-card-text>
                                        </template>
                                    </v-col>

                                    <!--<v-col cols="12" sm="4" align-self="end" class="mb-5">
                                        <v-card-text class="label-style">Company: <br/>
                                        <b class="value-style">{{member_data.mem_company_name ? member_data.mem_company_name : 'N/A'}}</b>
                                        </v-card-text>
                                    </v-col>-->

                                    <template v-if="eligible_data.pMemFname"> 
                                        <template>
                                            <v-col cols="12" sm="4" align-self="end" class="mb-5">
                                                <v-card-text class="label-style">Member Name: <br/>
                                                <b  class="value-style"> {{ eligible_data.pMemFname}} &nbsp; {{ eligible_data.pMemMname}} &nbsp; {{ eligible_data.pMemLname}} </b>
                                                </v-card-text>
                                            </v-col>

                                            <v-col cols="12" sm="4" align-self="end" class="mb-5">
                                                <v-card-text class="label-style">Member PHIC Pin: <br/><b class="value-style">{{eligible_data.pMemPin ? eligible_data.pMemPin : 'N/A' }}</b></v-card-text>
                                            </v-col>

                                            <v-col cols="12" sm="4" align-self="end" class="mb-5">
                                                <v-card-text class="label-style">Company: <br/>
                                                <b class="value-style">{{member_data.mem_company_name ? member_data.mem_company_name : 'N/A'}}</b>
                                                </v-card-text>
                                            </v-col>
                                        </template>
                                    </template>
                                    
                                    <v-col cols="12" sm="4" align-self="end">
                                        <v-card-text class="label-style">Philhealth Membership Type: <br/>
                                            <template v-if="eligible_data.konsulta_eligible">
                                                <b  class="value-style">
                                                    {{
                                                        eligible_data.pPatientType === 'DD' ? `${eligible_data.pPatientType} / Dependent` : 
                                                        eligible_data.pPatientType === 'MM' ? `${eligible_data.pPatientType} / Member` : 'N/A'
                                                    }}
                                                </b>
                                            </template>

                                            <template v-if="eligible_data.eclaims_eligible">
                                                <b  class="value-style">
                                                    {{ philhealth_mem_type.tag }}
                                                </b>
                                            </template>

                                            <template v-else>
                                                <b  class="value-style">{{philhealth_mem_type.tag}}</b>
                                            </template>
                                        </v-card-text>
                                    </v-col>

                                    <v-col v-if="philhealth_mem_type.srrv" cols="12" sm="4" align-self="end">
                                        <v-card-text class="label-style">PRA SRRV No.: <br/>
                                            <b  class="value-style">{{philhealth_mem_type.srrv}}</b>
                                        </v-card-text>
                                    </v-col>

                                    <v-col v-if="philhealth_mem_type.accr" cols="12" sm="4" align-self="end">
                                        <v-card-text class="label-style">ACR I-Card No.: <br/>
                                            <b  class="value-style">{{philhealth_mem_type.accr}}</b>
                                        </v-card-text>
                                    </v-col>
                                </v-row>
                            </v-tab-item>
                        </v-card>
                    </v-tabs-items>
                </v-tabs>
            </v-col>

            <v-col cols="12" class="px-0 mb-15 text-right">
                <h6 v-if="selected_referral" class="body-1 font-weight-medium mb-1">You are currently continuing with this referred transaction</h6>
                <h6 v-if="selected_referral" class="body-1 font-weight-regular mb-3">Referral Number: <span class="font-weight-medium primary--text">{{selected_referral.referral_code}}</span></h6>
                <v-btn v-if="selected_referral" @click="$emit('cancel-referral')" small>Cancel</v-btn>
            </v-col>

            <v-col cols="12" class="px-0 mb-15 text-right">
                <h6 v-if="selected_transaction" class="body-1 font-weight-medium mb-1">You are currently continuing to edit this transaction</h6>
                <h6 v-if="selected_transaction" class="body-1 font-weight-regular mb-3">Transaction Number: <span class="font-weight-medium primary--text">{{selected_transaction.transaction_number}}</span></h6>
                <v-btn v-if="selected_transaction" @click="$emit('cancel-transaction')" small>Cancel</v-btn>
            </v-col>
            
        </v-row>
    </div>
</template>

<script>
export default {
    name: 'EligibilityUI',
    props:["member_data","provider_name","isAccredited","process_type","has_referral", "has_transaction","selected_referral","referral_data","transaction_data","selected_transaction","migration_enabled"],
    data() {
        return {
            tab:'',
            eligible_data: sessionStorage.getItem('YETBS') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('YETBS'), 'ygrGk2dX').toString(this.$crypto.enc.Utf8)) : null,

            edit_loader: false
        }
    },

    computed: {
        philhealth_mem_type () {
            const {mem_phic_membership_type_tag,mem_phic_membership_type, mem_phic_membership_self_earning_type, mem_phic_membership_migrant_worker_type, mem_phic_membership_foreign_national_pra_srrv, mem_phic_membership_foreign_national_acr_1} = this.member_data

            if (!mem_phic_membership_type_tag) return {tag: 'N/A', srrv: null, accr: null}

            if (mem_phic_membership_type_tag && mem_phic_membership_type !== 'Foreign National') {
                let type = ''
                if (mem_phic_membership_self_earning_type) type = `(${mem_phic_membership_self_earning_type})`
                if (mem_phic_membership_migrant_worker_type) type = `(${mem_phic_membership_migrant_worker_type})`
                return {tag :`${mem_phic_membership_type_tag}: ${mem_phic_membership_type} ${type}`, srrv: null, accr: null}
            }

            // IF FOREIGN NATIONAL
            return {
                tag: `${mem_phic_membership_type_tag}: ${mem_phic_membership_type}`, 
                srrv: `${mem_phic_membership_foreign_national_pra_srrv || 'N/A'}`,  
                accr: `${mem_phic_membership_foreign_national_acr_1 || 'N/A'}`
            }
        },

        show_ekonsulta_eligible() {
            if(this.eligible_data.konsulta_eligible) {
                return true
            } else {
                return false
            }
        },

        show_eclaims_eligible() {
            if(this.eligible_data.eclaims_eligible) {
                return true
            } else {
                return false
            }
        },

        //REFERRAL & EDIT TRANSACTION
        selected_referral_transaction() {
            return (this.selected_referral || this.selected_transaction) ? true : false
        },

        has_referral_transaction() {
            return (this.transaction_data.has_data || this.referral_data.has_data) ? true : false
        }
    },

    methods: {
        //EDIT INFORMATION IN FRONT DESK
        async goToAdditionalInfoPage() {
            this.edit_loader = true
            let response = await this.$services.wsMemberWeb({
                key: 'eurekare_key_web',
                data: {
                    command: 322101001,
                    data: {
                        first_name: this.member_data.mem_first_name,
                        last_name: this.member_data.mem_last_name,
                        birthdate: this.$moment(this.member_data.mem_birthdate).format('YYYY-MM-DD')
                    }
                }
            })

            if(response.status === 200) {
                this.edit_loader = false
                response.data = this.responseDataDecryption(response.data)

                let data = response.data.lgu_data
                let lgu_member_data = {
                    lgu_data: {
                        ...data, 
                        process: 'EDIT',
                        konsulta_eligible: this.eligible_data.konsulta_eligible,
                        eclaims_eligible: this.eligible_data.eclaims_eligible
                    },

                }
                
                sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(lgu_member_data), 'njGHDdd'))
                this.$router.push('/edit-info')
            } else {
                this.overlay_loader = false;
                this.alert = response.error
            }
        }
            
    }
}
</script>

<style scoped>
::v-deep .v-tabs-bar {
    border-radius: inherit !important;
    height: 30px !important;
}
::v-deep .v-tabs:not(.v-tabs--vertical):not(.v-tabs--right) > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes) .v-slide-group__prev {
    display:none;
    visibility: hidden;
}
.label-style {
  font-weight: 500 ;
  padding-top:0.25em;
  padding-bottom:0.25em;
  color:#424242 !important;
  font-size: 11pt;

}
.value-style {
  font-weight: 400;
  font-size: 11pt;
}
.non-active-tab{
    background-color: #eeeeee !important;
    border-color: #eeeeee !important;
    border-top-left-radius:5px; 
    border-top-right-radius:15px;
    margin-right:0.25em;
}
.active-tab{
    background-color: #1976D2 !important;
    border-color: #1976D2 !important;
    color:white !important;
    border-top-left-radius:5px; 
    border-top-right-radius:100px;
    margin-right:0.25em;
}
@media screen and (max-width: 1680px){
    .label-style{font-size:10pt}
    .value-style{font-size:9pt}
}

@media screen and (max-width: 1360px){
    .label-style{font-size:9.5pt}
    .value-style{font-size:8.5pt}

}
</style>