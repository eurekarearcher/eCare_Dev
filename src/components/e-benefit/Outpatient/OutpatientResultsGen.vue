<template>
    <div>
        <h2 class="page-title py-5 text-center">OUTPATIENT RESULTS</h2>
        <!-- MEMBER & DOCTOR INFO-->
        <v-card flat outlined class="mb-2 px-7 pt-3 pb-6">
            <v-row dense align="end">
                <v-col :class="process_type !== 'HMO' && process_type.includes('HMO') ? 'col-sm-3' : 'col-sm-4'" cols="12">
                    <v-card-text class="label-style text-uppercase px-0">Member Name</v-card-text>
                    <v-text-field :value="member_data.p_name" class="value-style text-uppercase" readonly outlined dense hide-details></v-text-field>
                </v-col>
                <v-col :class="process_type !== 'HMO' && process_type.includes('HMO') ? 'col-sm-3' : 'col-sm-4'" cols="12">
                    <v-card-text class="label-style text-uppercase px-0">Health Insurance Status</v-card-text>
                    <v-text-field 
                        :value="member_data.mem_hmo_status ?  member_data.mem_hmo_status : 'INACTIVE'"
                        :class="member_data.mem_hmo_status == 'A' || member_data.mem_hmo_status == 'ACTIVE' ? 'success darken-1' : 'error darken-1'"
                        class="font-weight-medium value-style text-uppercase" 
                        dark readonly outlined dense hide-details></v-text-field>
                </v-col>
                <v-col v-if="process_type !== 'HMO'" :class="process_type == 'PHIC' || process_type == 'LGU' || process_type == 'PHIC_LGU' ? 'col-sm-4' : 'col-sm-3'" cols="12">
                    <v-card-text class="label-style text-uppercase px-0">Phic Status</v-card-text>
                    <v-text-field :value="eligibility_status"
                        :class="eligibility_status == 'Eligible' ? 'success darken-1' : 'error darken-1'"
                        class="font-weight-medium value-style text-uppercase"
                        readonly dark outlined dense hide-details></v-text-field>
                </v-col>
                <v-col v-if="process_type.includes('HMO')" :class="process_type !== 'HMO' && process_type.includes('HMO') ? 'col-sm-3' : 'col-sm-4'" cols="12">
                    <v-card-text class="label-style text-uppercase px-0">Provider accreditation</v-card-text>
                    <v-text-field v-if="isAccredited === undefined" value="LOADING PLEASE WAIT.." class="primary font-weight-medium value-style text-uppercase" dark readonly outlined dense hide-details></v-text-field>
                    <v-text-field v-else :value="isAccredited ? 'COVERED' : 'CALL YOUR HMO PROVIDER'"
                        :class="isAccredited ? 'success darken-1' : 'error darken-1'"
                        class="font-weight-medium value-style"
                        readonly dark outlined dense hide-details></v-text-field>
                </v-col>
            </v-row>
            <v-row dense align="end">
                <v-col sm="4" cols="12">
                    <v-card-text class="label-style text-uppercase px-0">Doctor Name</v-card-text>
                    <v-text-field :value="doctor_data && doctor_data.doctor_name ? doctor_data.doctor_name : 'N/A' " class="value-style text-uppercase" readonly outlined dense hide-details></v-text-field>
                </v-col>
                <v-col sm="4" cols="12">
                    <v-card-text class="label-style text-uppercase px-0">Specialization</v-card-text>
                    <v-text-field :value="doctor_data && doctor_data.specialization ? doctor_data.specialization : 'N/A' " class="value-style text-uppercase" readonly outlined dense hide-details></v-text-field>
                </v-col>
                <v-col sm="4" cols="12">
                    <v-card-text class="label-style text-uppercase px-0">Doctor accreditation</v-card-text>
                    <v-text-field :value="doctor_data && doctor_data.doctor_name ? 'ACCREDITED'  : 'N/A'" class="value-style text-uppercase" readonly outlined dense hide-details></v-text-field>
                </v-col>
            </v-row>
        </v-card>

        <!-- DIAGNOSIS & PROCEDURE INFO -->
        <h3 class="page-title font-weight-medium pt-5 pb-2 text-center">DIAGNOSIS</h3>
        <v-card flat outlined class="mb-12 px-7 py-3">
            <div v-for="(icd_data, icd_index) in icd_cpt_data" :key="icd_index">
                <!-- HMO_PHIC / HMO_PHIC_LGU / HMO_LGU -->
                <template v-if="process_type !== 'HMO' && process_type.includes('HMO')">
                    <v-row dense>
                        <v-col lg="8" sm="6" align-self="end">
                            <v-card-text v-if="icd_index == 0" class="label-style font-weight-medium px-0 pb-0">PRIMARY DIAGNOSIS</v-card-text>
                            <v-card-text v-else-if="icd_index == 1" class="label-style font-weight-medium px-0 pb-0">SECONDARY DIAGNOSIS</v-card-text>
                            <v-card-text v-else class="label-style font-weight-medium px-0 pb-0">OTHERS DIAGNOSIS</v-card-text>
                        </v-col>
                        <v-col lg="4" sm="6" class="hidden-xs-only" align-self="end">
                            <v-row v-if="icd_index == 0" dense>
                                <v-col :class="show_remarks ? 'col-sm-5 col-5' : 'col-sm-6'" align-self="end">
                                    <v-card-text class="label-style text-center font-weight-medium px-0 pb-0">PHILHEALTH COVERAGE</v-card-text>
                                </v-col>
                                <v-col :class="show_remarks ? 'col-sm-5 col-5' : 'col-sm-6'" align-self="end">
                                    <v-card-text class="label-style text-center font-weight-medium px-0 pb-0">HMO COVERAGE</v-card-text>
                                </v-col>
                                <v-col v-if="show_remarks" cols="1" align-self="end">
                                    &nbsp;
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <!-- DIAGNOSIS -->
                    <v-row dense>
                        <v-col v-if="icd_index == 0" lg="8" sm="6" cols="12" align-self="center">
                            <v-text-field
                                :value="icd_data.icd_description" 
                                :class="trans_status === 'NEEDS APPROVAL' &&  (icd_data.hmo_icd_status === 'NOT COVERED' ||   icd_data.hmo_icd_status === 'WAITING FOR APPROVAL')? 'icd_red_border ': 'icd_grn_border'"
                                class="value-style"
                                dense readonly outlined hide-details></v-text-field>
                        </v-col>
                        <v-col v-if="icd_index == 0" lg="4" sm="6" cols="12" align-self="center">
                            <v-row dense>
                                <v-col :class="show_remarks ? 'col-sm-5 col-12' : 'col-sm-6 col-12'" align-self="end">
                                    <v-card-text class="label-style font-weight-medium px-0 pb-0 hidden-sm-and-up">PHILHEALTH COVERAGE</v-card-text>
                                    <v-card :class="icd_data.phic_icd_status === 'COVERED' ? 'success darken-1' : 'error darken-1'"> 
                                        <v-card-text  class="value-style text-center white--text font-weight-bold">{{icd_data.phic_icd_status === 'COVERED' ? 'COVERED' : 'NOT APPLICABLE'}}</v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col :class="show_remarks ? 'col-sm-5 col-12' : 'col-sm-6 col-12'" align-self="end">
                                    <v-card-text class="label-style font-weight-medium px-0 pb-0 hidden-sm-and-up">HMO COVERAGE</v-card-text>
                                     <v-card :class="icd_data.hmo_icd_status === 'COVERED' ? 'success darken-1' : 'error darken-1' ">  
                                        <v-card-text v-if="trans_status === 'NEEDS APPROVAL' && (icd_data.hmo_icd_status === 'NOT COVERED' || icd_data.hmo_icd_status === 'WAITING FOR APPROVAL')" class="value-style text-center white--text font-weight-bold">{{icd_data.hmo_icd_status}} </v-card-text>
                                        <v-card-text v-else class="value-style text-center white--text font-weight-bold">{{ icd_data.hmo_icd_status === 'COVERED' ? icd_data.hmo_icd_status : 'NOT APPLICABLE'}}</v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col v-if="show_remarks" sm="1" cols="12" class="pt-0 text-right" align-self="center">
                                    <v-menu v-model="icd_data.icd_remarks_display" :close-on-content-click="false" min-width="500" offset-y left attach>
                                        <template v-slot:activator="{ on }">
                                            <v-badge :value="icd_data.icd_notes_remarks" color="yellow darken-1" icon="mdi-exclamation" overlap>
                                                <v-btn v-on="on" :disabled="!icd_data.icd_notes_remarks" color="primary" small><v-icon small>mdi-message-bulleted</v-icon></v-btn>
                                            </v-badge>
                                        </template>
                                        <v-list class="px-5 py-3 text-left">
                                            Remarks:
                                            <v-textarea v-model="icd_data.icd_notes_remarks" outlined hide-details readonly></v-textarea>
                                            <v-btn @click="icd_data.icd_remarks_display = false" small class="float-right my-2">CLOSE</v-btn>
                                        </v-list>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col v-if="icd_index > 0" cols="12" align-self="center">
                            <v-text-field :value="icd_data.icd_description" :class="show_remarks ? 'pr-lg-2 pr-md-5' :  'pr-0' " class="value-style" dense readonly outlined hide-details>
                                <template v-if="show_remarks" v-slot:append-outer>
                                    <v-menu v-model="icd_data.icd_remarks_display" :close-on-content-click="false" min-width="500" offset-y left attach>
                                        <template v-slot:activator="{ on }">
                                            <v-badge :value="icd_data.icd_notes_remarks" color="yellow darken-1" icon="mdi-exclamation" overlap>
                                                <v-btn v-on="on" :disabled="!icd_data.icd_notes_remarks" color="primary" small><v-icon small>mdi-message-bulleted</v-icon></v-btn>
                                            </v-badge>
                                        </template>
                                        <v-list class="px-5 py-3 text-left">
                                            Remarks:
                                            <v-textarea v-model="icd_data.icd_notes_remarks" outlined hide-details readonly></v-textarea>
                                            <v-btn @click="icd_data.icd_remarks_display = false" small class="float-right my-2">CLOSE</v-btn>
                                        </v-list>
                                    </v-menu>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <!-- PROCEDURE -->
                    <div v-if="icd_data.procedure_list.length > 0" dense>
                        <v-card-text class="label-style font-weight-medium px-0 pl-7 pl-md-12 pb-0">PROCEDURES</v-card-text>
                        <v-row v-for="(cpt_data, cpt_index) in icd_data.procedure_list" :key="cpt_index" dense>
                            <v-col lg="8" sm="6" cols="12" class="pl-7 pl-md-12" align-self="center">
                                <v-text-field :value="cpt_data.cpt_description" dense readonly outlined hide-details></v-text-field>
                            </v-col>
                            <v-col lg="4" sm="6" cols="12">
                                <v-row dense class="pl-7 pl-sm-1">
                                    <v-col :class="show_remarks ? 'col-sm-5' : 'col-sm-6'" cols="12" align-self="center">
                                        <v-card-text class="label-style font-weight-medium px-0 pb-0 hidden-sm-and-up">PHILHEALTH COVERAGE</v-card-text>
                                        <v-card v-if="cpt_data.phic_cpt_status === 'COVERED'" color="success darken-1" > 
                                            <v-card-text  class="value-style text-center white--text font-weight-bold" >{{cpt_data.phic_cpt_status }}</v-card-text>
                                        </v-card>
                                        <v-card v-else-if="cpt_data.phic_cpt_status.includes('COVERED UP TO')" color="yellow darken-3" > 
                                            <v-card-text  class="value-style text-center white--text font-weight-bold" >{{cpt_data.phic_cpt_status }}</v-card-text>
                                        </v-card>
                                        <v-card v-else color="error darken-1" > 
                                            <v-card-text  class="value-style text-center white--text font-weight-bold d-flex justify-space-between align-center">
                                                <span>&nbsp;</span>
                                                NOT APPLICABLE
                                                <v-tooltip  bottom>
                                                    <template v-slot:activator="{ on, attrs }"><v-icon small v-bind="attrs" v-on="on" color="white" right>fas fa-exclamation-circle</v-icon></template>
                                                    <span>This procedure is not covered by PHIC</span>
                                                </v-tooltip>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col :class="show_remarks ? 'col-sm-5' : 'col-sm-6'" cols="12"  align-self="center">
                                        <v-card-text class="label-style font-weight-medium px-0 pb-0 hidden-sm-and-up">HMO COVERAGE</v-card-text> 
                                        <v-card v-if="cpt_data.hmo_cpt_status === 'COVERED' || cpt_data.hmo_cpt_status == 'APPROVED'" color="success darken-1" > 
                                            <v-card-text  class="value-style text-center white--text font-weight-bold" >{{cpt_data.hmo_cpt_status}}</v-card-text>
                                        </v-card>
                                        <v-card v-else-if="cpt_data.hmo_cpt_status.includes('COVERED UP TO')" color="yellow darken-3" > 
                                            <v-card-text  class="value-style text-center white--text font-weight-bold" >{{cpt_data.hmo_cpt_status}}</v-card-text>
                                        </v-card>
                                        <v-card v-else-if="cpt_data.hmo_cpt_status === 'NEEDS APPROVAL' || cpt_data.hmo_cpt_status === 'DISAPPROVED'" color="error darken-1" > 
                                            <v-card-text  class="value-style text-center white--text font-weight-bold" >{{cpt_data.hmo_cpt_status}}</v-card-text>
                                        </v-card>
                                        <v-card v-else color="error darken-1" > 
                                          <v-card-text  class="value-style text-center white--text font-weight-bold d-flex justify-space-between align-center">
                                                <span>&nbsp;</span>
                                                NOT APPLICABLE
                                                <v-tooltip  bottom>
                                                    <template v-slot:activator="{ on, attrs }"><v-icon small v-bind="attrs" v-on="on" color="white" right>fas fa-exclamation-circle</v-icon></template>
                                                    <span>The procedure amount is already covered by PHIC</span>
                                                </v-tooltip>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col v-if="show_remarks" sm="1" cols="12" class="pt-0 text-right" align-self="center">
                                        <v-menu v-model="cpt_data.cpt_remarks_display" :close-on-content-click="false" min-width="500" offset-y left attach>
                                            <template v-slot:activator="{ on }">
                                                <v-badge :value="cpt_data.cpt_notes_remarks" color="yellow darken-1" icon="mdi-exclamation" overlap>
                                                    <v-btn v-on="on" :disabled="!cpt_data.cpt_notes_remarks" color="primary" small><v-icon small>mdi-message-bulleted</v-icon></v-btn>
                                                </v-badge>
                                            </template>
                                            <v-list class="px-5 py-3 text-left">
                                                Remarks:
                                                <v-textarea v-model="cpt_data.cpt_notes_remarks" outlined hide-details readonly></v-textarea>
                                                <v-btn @click="cpt_data.cpt_remarks_display = false" small class="float-right my-2">CLOSE</v-btn>
                                            </v-list>
                                        </v-menu>
                                    </v-col>
                                    
                                </v-row>
                            </v-col>
                        </v-row>
                    </div>
                </template>

                <!-- HMO / PHIC / LGU / PHIC_LGU -->
                <div v-else class="mb-3">   
                    <v-row dense>
                        <v-col md="9" sm="8" cols="12" class="pb-0">
                            <v-card-text v-if="icd_index == 0" class="label-style font-weight-medium px-0 pb-0">PRIMARY DIAGNOSIS</v-card-text>
                            <v-card-text v-else-if="icd_index == 1" class="label-style font-weight-medium px-0 pb-0">SECONDARY DIAGNOSIS</v-card-text>
                            <v-card-text v-else class="label-style font-weight-medium px-0 pb-0">OTHERS DIAGNOSIS</v-card-text>
                        </v-col>
                        <v-col v-if="icd_index == 0" class="hidden-xs-only" md="3" sm="4" cols="12">
                            <v-card-text class="label-style text-center font-weight-medium px-0 pb-0">{{process_type === 'HMO' ?  'HMO COVERAGE' : 'PHIC COVERAGE'}}</v-card-text>
                        </v-col>
                    </v-row>
                    <!-- DIAGNOSIS -->
                    <v-row dense>
                        <!-- PRIMARY ICD -->
                        <v-col v-if="icd_index == 0" md="9" sm="8" cols="12" align-self="center">
                            <v-text-field
                                :value="icd_data.icd_description" 
                                :class="icd_data.hmo_icd_status === 'COVERED' ||  icd_data.hmo_icd_status === 'APPROVED' ||  icd_data.phic_icd_status === 'COVERED'? 'icd_grn_border ': 'icd_red_border'"
                                class="value-style"
                                dense readonly outlined hide-details></v-text-field>
                        </v-col>

                        <v-col v-if="icd_index == 0" md="3" sm="4" cols="12" align-self="center">
                            <v-row dense>
                                <v-col cols="12" class="hidden-sm-and-up " >
                                    <v-card-text class="label-style text-left font-weight-medium pb-0 px-0">{{process_type === 'HMO' ?  'HMO COVERAGE' : 'PHIC COVERAGE'}}</v-card-text>
                                </v-col>

                                <v-col :class="show_remarks ? 'col-sm-10' : 'col-sm-12'"  class="pt-0">
                                    <v-card 
                                        :class="icd_data.hmo_icd_status === 'COVERED' ||  
                                        icd_data.hmo_icd_status === 'APPROVED' ||   
                                        icd_data.phic_icd_status === 'COVERED' ? 'success darken-1' : 'error darken-1'" dark> 
                                    <v-card-text  class="value-style text-center white--text font-weight-bold" >{{icd_data.hmo_icd_status ? icd_data.hmo_icd_status : icd_data.phic_icd_status }}</v-card-text>
                                    </v-card>
                                </v-col>

                                <v-col v-if="show_remarks" cols="1" class="pt-0" align-self="center">
                                    <v-menu v-model="icd_data.icd_remarks_display" :close-on-content-click="false" min-width="500" offset-y left attach>
                                        <template v-slot:activator="{ on }">
                                            <v-badge :value="icd_data.icd_notes_remarks" color="yellow darken-1" icon="mdi-exclamation" overlap>
                                                <v-btn v-on="on" :disabled="!icd_data.icd_notes_remarks" color="primary" small><v-icon small>mdi-message-bulleted</v-icon></v-btn>
                                            </v-badge>
                                        </template>
                                        <v-list class="px-5 py-3 text-left">
                                            Remarks:
                                            <v-textarea v-model="icd_data.icd_notes_remarks" outlined hide-details readonly></v-textarea>
                                            <v-btn @click="icd_data.icd_remarks_display = false" small class="float-right my-2">CLOSE</v-btn>
                                        </v-list>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-col>

                        <!-- SECONDARY / OTHERS -->
                        <v-col v-if="icd_index > 0" cols="12" align-self="center">
                            <v-text-field :value="icd_data.icd_description"  class="value-style " dense readonly outlined hide-details>
                                <template v-slot:append-outer v-if="show_remarks">
                                    <v-menu v-model="icd_data.icd_remarks_display" :close-on-content-click="false" min-width="500" offset-y left attach>
                                        <template v-slot:activator="{ on }">
                                            <v-badge :value="icd_data.icd_notes_remarks" color="yellow darken-1" icon="mdi-exclamation" overlap>
                                                <v-btn v-on="on" :disabled="!icd_data.icd_notes_remarks" color="primary" small><v-icon small>mdi-message-bulleted</v-icon></v-btn>
                                            </v-badge>
                                        </template>
                                        <v-list class="px-5 py-3 text-left">
                                            Remarks:
                                            <v-textarea v-model="icd_data.icd_notes_remarks" outlined hide-details readonly></v-textarea>
                                            <v-btn @click="icd_data.icd_remarks_display = false" small class="float-right my-2">CLOSE</v-btn>
                                        </v-list>
                                    </v-menu>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <!-- PROCEDURES -->
                    <div v-if="icd_data.procedure_list.length > 0" dense>
                        <v-card-text class="label-style font-weight-medium px-0 pl-7 pl-md-12 pb-0">PROCEDURES</v-card-text>
                        <v-row v-for="(cpt_data, cpt_index) in icd_data.procedure_list" :key="cpt_index" dense>
                            <v-col md="9" sm="8" cols="12" class="pl-7 pl-md-12" align-self="center">
                                <v-text-field :value="cpt_data.cpt_description" dense readonly outlined hide-details></v-text-field>
                            </v-col>
                            <v-col md="3" sm="4" cols="12">
                                <v-row dense>
                                    <v-col :class="show_remarks ? 'col-sm-10 col-11' : 'col-sm-12'" class="pl-7 pl-sm-1">
                                        <v-card v-if="cpt_data.hmo_cpt_status === 'COVERED' || cpt_data.hmo_cpt_status == 'APPROVED' || cpt_data.phic_cpt_status == 'COVERED' || cpt_data.phic_cpt_status == 'APPROVED'" color="success darken-1" > 
                                            <v-card-text  class="value-style text-center white--text font-weight-bold" >{{cpt_data.hmo_cpt_status ? cpt_data.hmo_cpt_status : cpt_data.phic_cpt_status }}</v-card-text>
                                        </v-card>
                                        <v-card v-else-if="(cpt_data.hmo_cpt_status || cpt_data.phic_cpt_status).includes('COVERED UP TO')" color="yellow darken-3" > 
                                            <v-card-text  class="value-style text-center white--text font-weight-bold" >{{cpt_data.hmo_cpt_status ? cpt_data.hmo_cpt_status : cpt_data.phic_cpt_status }}</v-card-text>
                                        </v-card>
                                        <v-card v-else color="error darken-1" > 
                                            <v-card-text  class="value-style text-center white--text font-weight-bold" >{{cpt_data.hmo_cpt_status ? cpt_data.hmo_cpt_status : cpt_data.phic_cpt_status }}</v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col v-if="show_remarks" cols="1" class="pt-0" align-self="center">
                                        <v-menu v-model="cpt_data.cpt_remarks_display" :close-on-content-click="false" min-width="500" offset-y left attach>
                                            <template v-slot:activator="{ on }">
                                                <v-badge :value="cpt_data.cpt_notes_remarks" color="yellow darken-1" icon="mdi-exclamation" overlap>
                                                    <v-btn v-on="on" :disabled="!cpt_data.cpt_notes_remarks" color="primary" small><v-icon small>mdi-message-bulleted</v-icon></v-btn>
                                                </v-badge>
                                            </template>
                                            <v-list class="px-5 py-3 text-left">
                                                Remarks:
                                                <v-textarea v-model="cpt_data.cpt_notes_remarks" outlined hide-details readonly></v-textarea>
                                                <v-btn @click="cpt_data.cpt_remarks_display = false" small class="float-right my-2">CLOSE</v-btn>
                                            </v-list>
                                        </v-menu>
                                    </v-col>
                                    
                                </v-row>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </div>
        </v-card>

        <!-- DOCTOR & HMO NOTES INFO -->
        <v-card flat outlined class="mb-12 px-7 pt-3 pb-6">
            <div v-if="claim_type === 'INITIAL'" class="blinking white"> <div class="blink "><span class="blink-span">Waiting for Customer Care</span></div></div>
        
            <v-col cols="12">
                <v-card-text class="label-style text-uppercase px-0">Doctor Notes </v-card-text>
                <v-textarea :value="doctor_notes ? doctor_notes : 'N/A'" class="value-style" readonly outlined dense hide-details rows="3"></v-textarea>
            </v-col>
        
            <v-col v-if="claim_type !== 'INITIAL' && hmo_cc_notes" cols="12">
                <v-card-text class="label-style text-uppercase px-0">Healthcare Insurance Company Notes </v-card-text>
                <v-textarea :value="hmo_cc_notes" class="value-style" readonly outlined dense hide-details rows="3"></v-textarea>
            </v-col>
        </v-card>

        <!-- SUBMIT / CANCEL -->
        <v-row dense justify="center" class="my-12">
            <v-btn  @click="$emit('result-submit','ISSUED')" 
                :loading="confirm_loader || host_config" 
                :disabled="claim_type === 'INITIAL' || claim_type === 'NOT FOR CLAIMS' || btn_queue_load"
                :block="$vuetify.breakpoint.name === 'xs'"
                class="mb-6 mb-sm-0"
                color="blue white--text" large rounded >PRINT LOA <v-icon right >mdi-printer</v-icon> 
            </v-btn>
            <v-btn  
                @click="$emit('result-cancel')"         
                :block="$vuetify.breakpoint.name === 'xs'"
                :disabled="confirm_loader || btn_queue_load"
                color="secondary" 
                class="mx-sm-3" large rounded>CANCEL REQUEST OF APPROVAL<v-icon right>mdi-cancel</v-icon> 
            </v-btn> 
        </v-row>
    </div>
</template>

<script>
export default {
    name: 'OutpatientResultsUI',
    props: [ 
        "member_data", 
        "isAccredited", 
        "process_type", 
        "eligibility_status", 
        "doctor_data", 
        "icd_cpt_data", 
        "claim_type", 
        "trans_status", 
        "doctor_notes",
        "hmo_cc_notes",
        "host_config", 
        "confirm_loader", 
        "btn_queue_load"
    ],

    computed:{
        show_remarks () {
            if (this.claim_type !== 'INITIAL' &&  this.process_type !== 'PHIC' &&  this.process_type !== 'LGU' &&   this.process_type !== 'PHIC_LGU' &&  this.trans_status !== 'COVERED') {
                return true
            } else {
                return false
            }
        },
    }
}
</script>

<style scoped>

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
  line-height: 0.8; 
}
.icd_grn_border >>> fieldset {
  border: 2px solid green !important;
}
.icd_red_border >>> fieldset {
  border: 2px solid red !important;
}
@keyframes blink{
    0%{opacity: 0;}
    50%{opacity: .5;}
    100%{opacity: 1;}
}
.blinking{
    bottom:0;
    margin:0 0 100px 0px;
    position:fixed;
    left:0;
    padding:10px !important; 
    border-radius: 4px !important; 
    z-index: 1;
}
.blink-span{
    color: red;
    font-size:24px;
    animation: blink 1s linear infinite;
}

@media screen and (max-width: 1680px){
    .label-style, .value-style{font-size:10.5pt}
}

@media screen and (max-width: 1360px){
    .label-style, .value-style{font-size:10.5pt}
}
</style>