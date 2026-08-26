
<template>
  <div>
    <h2 class="text-center grey-font mt-5 mb-3 ">OUTPATIENT</h2>

    <v-flex sm11 xs12 class="mx-auto">
      <!-- PROGRESS BAR -->
      <v-row>
        <v-col sm="4" cols="12" align-self="end">
          <h4 class="text-center grey-font text-subtitle-1 text-lg-h6 font-weight-medium">1. DOCTOR <v-icon class="mb-1 grey-font" small>fas fa-user-md</v-icon></h4>
          <div v-if="!doctor_data.doctor_displayed" class="stripesLoader light-blue darken-4"></div>
          <v-progress-linear v-else color="light-blue darken-4" height="10" value="100" rounded striped></v-progress-linear>
        </v-col>

        <v-col sm="4" cols="12" align-self="end">
          <h4 class="text-center grey-font text-subtitle-1 text-lg-h6 font-weight-medium">2. DIAGNOSTIC <v-icon class="mb-1" color="grey darken-3" small>fas fa-heartbeat</v-icon></h4>
          <div v-if="!selection_data[0].selected_icd" class="stripesLoader light-blue darken-4"></div>
          <v-progress-linear v-else color="light-blue darken-4" height="10" value="100" rounded striped></v-progress-linear>
        </v-col>

        <v-col sm="4" cols="12" align-self="end">
          <h4 class="text-center grey-font text-subtitle-1 text-lg-h6 font-weight-medium">3. PROCEDURE <v-icon class="mb-1" color="grey darken-3" small>fas fa-medkit</v-icon></h4>
          <div v-if="!selection_data[0].procedure_list.length" class="stripesLoader light-blue darken-4"></div>
          <v-progress-linear v-else color="light-blue darken-4" height="10" value="100" rounded striped></v-progress-linear>
        </v-col>
      </v-row>

      <!-- BODY -->
      <v-card elevation="3" class="pa-3">
        <!-- <v-sheet> 
          <v-row class="d-flex justify-space-around px-14" dense> 
            <v-col cols="12" sm="12" md="8" lg="9">
              <v-row dense> 
                <v-col cols="12" sm="12" md="12" lg="12" class="d-flex align-center"> 
                  <h4 class="text-lg-right pr-2 body-2 font-weight-medium label-font"> <label>CHIEF COMPLAINT:</label> </h4>
                  <v-textarea v-model="trans_data.chief_complaint" :error="required_fields && !trans_data.chief_complaint"  rows="3" class="body-2 text-xl-body-1 font-weight-regular" outlined hide-details></v-textarea>
                </v-col>
              </v-row> 
            </v-col>
            <v-col cols="12" sm="12" md="4" lg="3"> 
              <v-sheet>
                <v-sheet class="md10 xs12 pa-sm-5 mx-auto">
                  <v-img v-if="!member_data.member.mem_photo"  src="@/assets/no-image.jpg"  max-height="210"  class="hidden-xs-only" contain></v-img>
                  <v-img v-else :src="member_data.member.mem_photo" max-height="210" class="hidden-xs-only" contain></v-img>
                  <h4 class="text-center mt-2 hidden-xs-only"  >{{member_data.member.p_name}}</h4>
                  <h4 v-if="process_type === 'LGU'" class="text-center font-weight-regular mb-3 hidden-xs-only">{{ member_data.member.ek_lgu_id ? member_data.member.ek_lgu_id : 'N/A' }}</h4>
                  <h4 v-else class="text-center font-weight-regular mb-3 hidden-xs-only">{{ member_data.member.mem_hmo_policy_number ? member_data.member.mem_hmo_policy_number : 'N/A' }}</h4>
                  <v-btn :disabled="prv_rate_checker" block  color="light-blue darken-4 white--text" @click="$emit('submit')">Submit<v-icon class="mb-1" small right>fas fa-paper-plane</v-icon></v-btn>
                </v-sheet>
              </v-sheet>
            </v-col>
          </v-row>
        </v-sheet> -->
        <v-layout wrap>
          <v-flex xs12 class="hidden-sm-and-up mb-3">
              <h3 class="text-center mt-2 text-h6">Patient Information  </h3>
              <v-img v-if="!member_data.member.mem_photo"  src="@/assets/no-image.jpg" max-height="210"  contain></v-img>
              <v-img v-else :src="member_data.member.mem_photo" max-height="210"  contain></v-img>
              <h4 class="text-center mt-2 text-subtitle-1 font-weight-medium">{{member_data.member.p_name}}</h4>
              <h4 v-if="process_type === 'LGU'" class="text-center font-weight-regular mb-3 ">{{ member_data.member.ek_lgu_id ? member_data.member.ek_lgu_id : 'N/A' }}</h4>
              <h4 v-else class="text-center font-weight-regular mb-3 ">{{ member_data.member.mem_hmo_policy_number ? member_data.member.mem_hmo_policy_number : 'N/A' }}</h4>
              <v-divider></v-divider>
          </v-flex>

          <!-- LEFT COLUMN -->
          <v-flex lg9 sm8 xs12 px-lg-3>
            <!-- CHIEF COMPLAINT -->
            <v-layout wrap my-3>
              <v-flex md3 xs12 align-self-center class="text-lg-right pr-2 body-2 font-weight-medium label-font"><label>CHIEF COMPLAINT:</label></v-flex>
              <v-flex md9 xs12>
                <v-textarea v-model="trans_data.chief_complaint" :error="required_fields && !trans_data.chief_complaint"  rows="3" class="body-2 text-xl-body-1 font-weight-regular" outlined hide-details></v-textarea>
              </v-flex>
            </v-layout>

            <!-- DOCTOR -->  
            <v-layout v-if="trans_data.transaction_type" wrap my-4>
                <v-flex md3 xs12 class="text-lg-right pr-2 body-2 font-weight-medium label-font"><label>PREVIOUS DOCTOR:</label></v-flex>
                <v-flex md9 xs12 align-self-center>
                    <v-layout wrap justify-space-between>
                      <h4 class="font-weight-medium body-2 text-xl-body-1 grey--text text--darken-3 text-uppercase" >
                        {{doctor_data.prev_doc_name
                             ? 'DR. '+doctor_data.prev_doc_name+' / '+ doctor_data.prev_specialization
                             : 'N/A'}}
                        <v-tooltip bottom v-if="doctor_data.check_doc_from_list === false">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon  v-on="on" v-bind="attrs" color="red darken-1" size="20">fas fa-exclamation-circle</v-icon>
                          </template>
                          <span>This doctor is not accredited by {{$store.state.prv_data.provider_name}}</span>
                        </v-tooltip>
                      </h4>
                    </v-layout>
                </v-flex>
            </v-layout>

            <v-layout v-if="!trans_data.transaction_type || !doctor_data.prev_doc_name" wrap mb-3 >
              <v-flex md3 xs12 align-self-center class="text-lg-right pr-2 body-2 font-weight-medium label-font"><label>DOCTOR:</label></v-flex>
              <v-flex lg9 md9 xs12>
                <v-autocomplete 
                  v-model="doctor_data.doctor_displayed" 
                  @change="$emit('selected-doctor-row', $event)" 
                  :error="required_fields && (validate_tran_has_rvs && !doctor_data.doctor_name)" 
                  :clearable="!trans_data.transaction_type || !doctor_data.prev_doc_name"
                  :loading="doctor_data.loader" 
                  :items="doctor_items" 
                  class="body-2 text-xl-body-1 grey-font font-weight-regular  text-uppercase" 
                  placeholder="Search Doctor name or Specialization" 
                  item-text="autoCompleteText" 
                  append-icon="" 
                  prepend-inner-icon 
                  hide-selected 
                  return-object 
                  hide-details 
                  hide-no-data 
                  outlined 
                  dense>
                  <template v-slot:prepend-inner >
                    <v-icon>mdi-magnify</v-icon>
                    <v-icon size="18" right>fas fa-user-md</v-icon>
                  </template>

                  <template v-slot:selection="{item}" class="doctor">
                    {{item.doctor_name}} / {{item.specialization}}
                  </template>

                  <template v-slot:item="{ item }">
                    <v-layout wrap>
                      <v-list-item-avatar color="indigo" class="headline font-weight-light white--text">{{ item.doctor_name.charAt(0) }}</v-list-item-avatar>
                      <v-list-item-content>
                          <v-list-item-title v-text="item.doctor_name"></v-list-item-title>
                          <v-list-item-subtitle v-text="item.specialization"></v-list-item-subtitle>
                      </v-list-item-content>
                    </v-layout>
                  </template>
                </v-autocomplete>
              </v-flex>
            </v-layout>

            <!-- DIAGNOSIS AND PROCEDURE -->
            <v-layout v-if="trans_data.transaction_type" wrap mb-3>
              <v-flex md3 xs12 class="text-lg-right pr-2 pr-xl-2 body-2 font-weight-medium label-font" ><label>PREVIOUS DIAGNOSIS AND PROCEDURE:</label></v-flex>
              <v-flex md9 xs12  align-self-center class="grey-font font-weight-medium body-2 text-xl-body-1">
                  <h4 v-if="previous_cpt_icd.length === 0">LOADING DIAGNOSIS.... PLEASE WAIT</h4>
                  
                  <h4 v-else-if="previous_cpt_icd === 'Data not found.'">N/A</h4>

                  <v-layout v-else v-for="(desc,i) in previous_cpt_icd" wrap column :key="i" class="mb-1">
                    <h3 class="grey-font font-weight-medium body-2 text-xl-body-1">{{desc.icd_code ? desc.icd_code_desc: 'N/A'}}</h3>
                    <h4 v-for="(cpts,x) in desc.procedure_list" :key="x" class="grey-font font-weight-regular body-2 text-xl-body-1 pl-8 mb-1">-{{cpts.cpt_code_desc}}</h4>
                  </v-layout>
              </v-flex>
            </v-layout>
            
            <v-layout v-for="(icd,i) in selection_data"  :key="i"  wrap mb-3>
              <!-- DIVIDER -->
              <v-flex v-if="i !== 0" xs12 mt-2 mb-4><v-flex md9 xs12 ml-auto><v-divider ></v-divider></v-flex></v-flex>
              <!-- DIAGNOSIS -->
              <v-flex md3 xs12 align-self-center mb-md-3 class="text-lg-right body-2 font-weight-medium label-font pr-2">
                  <label v-if="i === 0" >PRIMARY DIAGNOSIS:</label>
                  <label v-else-if="i === 1" >SECONDARY DIAGNOSIS:</label>
                  <label v-else >OTHER DIAGNOSIS:</label>
              </v-flex>

              <v-flex md9 xs12 mb-3>
                  <v-autocomplete 
                    v-model="icd.selected_icd" 
                    @change="$emit('select-row-icd',$event,i)" 
                    :error="required_fields && !icd.selected_icd"
                    :loading="icd_loader"
                    :items="icd_list" 
                    class="body-2 text-xl-body-1 grey-font font-weight-regular" 
                    placeholder="Search ICD Code or ICD Description" 
                    item-text="icd_code_description" 
                    prepend-inner-icon="mdi-magnify"
                    append-icon="" 
                    return-object 
                    hide-no-data
                    hide-details 
                    clearable
                    outlined 
                    dense >
                  
                    <template v-slot:append> 
                      <v-tooltip bottom v-if="i === 0 && selection_data[0].check_sob_status == true">
                          <template #activator="{ on }"> <v-icon  v-on="on" left color="red darken-1">fas fa-exclamation-circle</v-icon></template>
                          This selected diagnosis is not covered
                      </v-tooltip>
                    </template>

                    <template v-slot:append-outer v-if="i !== 0">
                      <v-icon size="20" @click="$emit('remove-other-diagnosis',i)"  right class="mr-1">fas fa-trash</v-icon>
                    </template>

                    <template v-slot:item="{ item }">
                      <v-list-item-content >
                          <v-list-item-title v-text="item.icd_code"></v-list-item-title>
                          <v-list-item-subtitle v-text="item.icd_description"></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>

                  </v-autocomplete>
              </v-flex>
              <!-- DISPLAY SELECTED CPT -->
              <v-flex v-for="(cpt,index) in icd.procedure_list" :key="index" class="d-flex" xs12 >
                  <v-flex md9 xs12 mb-1 ml-auto>
                    <v-layout wrap justify-space-between>
                      <v-flex xs8><label v-if="index===0"  :class="{'grey--text text--lighten-1': !icd.selected_icd}" class="body-2 font-weight-medium label-font">PROCEDURE:</label></v-flex>
                      <v-flex xs4 > <label v-if="index===0"  :class="{'grey--text text--lighten-1': !icd.selected_icd}" class="body-2 font-weight-medium label-font">RATE:</label></v-flex>
                      
                      <v-flex md8 sm8 xs8 mb-1 pr-4>
                        <v-text-field  
                          v-model="cpt.cpt_description"   
                          :disabled="i === 0 && icd.check_sob_status" 
                          class="body-2 text-xl-body-1 grey-font" 
                          hide-details 
                          outlined 
                          readonly 
                          dense>
                          <template v-slot:append v-if="i=== 0 && cpt.initial_cpt_status === 'NOT COVERED'">
                            <template v-if="member_data.config.cpt_auto_not_covered === 'true'">
                                <v-tooltip bottom>
                                  <template #activator="{ on }"><v-icon  v-on="on"  color="red darken-1" >fas fa-exclamation-circle</v-icon></template>
                                  This procedure is not covered
                                </v-tooltip>
                            </template>          
                          </template>
                        </v-text-field>
                      </v-flex>

                      <v-flex md4 sm4 xs4 mb-1>
                        <v-text-field  
                          v-model="cpt.cpt_amount" 
                          @keypress="$emit('on-keyup-text',$event)"
                          @blur="$emit('format-number',cpt.cpt_amount,i,index), $emit('validate-prv-rate',i,index)"
                          :disabled="i === 0 ? icd.check_sob_status || cpt.cpt_amt_loader : cpt.cpt_amt_loader" 
                          :error="required_fields && (!cpt.cpt_amount || cpt.cpt_amount === '0' || cpt.cpt_amount === '0.00')" 
                          class="body-2 text-xl-body-1 grey-font " 
                          onpaste="return false" 
                          maxlength="10" 
                          hide-details 
                          append-icon
                          outlined
                          dense>
                          <!-- <template v-slot:prepend-inner v-if="cpt.cpt_amt_loader">
                            <v-progress-circular  width="3" size="25" class="d-flex align-center" indeterminate color="primary"></v-progress-circular>
                          </template> -->

                          <template v-slot:append v-if="cpt.chk_cpt_has_prv_rate">
                            <v-tooltip bottom >
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon  v-on="on" v-bind="attrs"  color="red darken-1" size="20">fas fa-exclamation-circle</v-icon>
                              </template>
                              <span>The amount should not be greater than the contracted rate.<br/>Contracted rate : {{cpt.cpt_provider_rate}}</span>
                            </v-tooltip>
                          </template>

                          <template v-slot:append-outer>
                            <v-icon  @click="$emit('remove-procedure',i,index)"  :disabled="i === 0 ? icd.check_sob_status || cpt.cpt_amt_loader : cpt.cpt_amt_loader "  :key="index"  class="label-font"  size="25"  dense dark  >far fa-minus-square</v-icon>                            
                          </template>
                        </v-text-field>      
                      </v-flex>
                    </v-layout>
                  </v-flex>
              </v-flex>

              <!-- PROCEDURE AUTOCOMPLETE -->
              <v-flex md3 xs12 class="text-lg-right body-2 font-weight-medium label-font pr-2" align-self-center> 
                <label v-if="i === 0" :class="{'grey--text text--lighten-1': selection_data[0].check_sob_status || !selection_data[0].selected_icd}">ADD PROCEDURE:</label>
                <label v-else :class="{'grey--text text--lighten-1': !icd.selected_icd}">ADD PROCEDURE:</label>
              </v-flex>
              <v-flex md9 xs12>
                <v-autocomplete 
                  v-model.lazy="icd.selected_cpt" 
                  @change="$emit('select-row-cpt',$event,i)" 
                  @focus="$emit('get-cpt-filter', icd.selected_cpt_holder) "
                  :error="required_fields && selection_data[0].procedure_list.length === 0 && i === 0" 
                  :disabled="i === 0 ? icd.check_sob_status || !icd.selected_icd : !icd.selected_icd" 
                  :loading="cpt_loader" 
                  :items="cpt_list" 
                  class="body-2 text-xl-body-1 grey-font font-weight-medium" 
                  placeholder="Search CPT Code or CPT Description" 
                  prepend-inner-icon="mdi-magnify" 
                  item-text="cpt_code_desc"   
                  return-object 
                  hide-selected
                  hide-no-data 
                  hide-details 
                  append-icon 
                  outlined 
                  dense>

                  <template v-slot:item="{ item }" > 
                    <v-list-item-content >
                        <v-list-item-title v-text="item.cpt_code"></v-list-item-title>
                        <v-list-item-subtitle v-if="item.cpt_code === '77401'" v-text="item.cpt_description+' '+(item.rvs_category ? '('+item.rvs_category+')' : '')"></v-list-item-subtitle>
                        <v-list-item-subtitle v-else v-text="item.cpt_description"></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-flex>
            </v-layout>
            
            <v-layout wrap justify-end mb-3>
              <v-btn @click="$emit('add-diagnosis')" class="grey-font" elevation="3" small >Add Diagnosis <v-icon right small>fas fa-plus</v-icon></v-btn>
            </v-layout>

            <!-- NOTES -->
            <v-layout v-if="!trans_data.transaction_type || trans_data.doctor_notes || !doctor_data.check_doc_from_list || !doctor_data.prev_doc_name" wrap>
              <v-flex md3 xs12 align-self-center class="text-lg-right pr-2 body-2 font-weight-medium label-font"><label>DOCTOR NOTES:</label></v-flex>
              <v-flex md9 xs12>
                  <v-textarea v-model="trans_data.doctor_notes" :readonly="trans_data.transaction_type !== '' && doctor_data.check_doc_from_list  && doctor_data.prev_doc_name !== ''"  placeholder="Notes" rows="3" no-resize outlined></v-textarea>
              </v-flex>
            </v-layout>
          </v-flex>
      
          <!-- right side -->
          <v-flex lg3 sm4 xs12>
            <v-flex md10 xs12 pa-sm-5 mx-auto>
              <v-img v-if="!member_data.member.mem_photo"  src="@/assets/no-image.jpg"  max-height="210"  class="hidden-xs-only" contain></v-img>
              <v-img v-else :src="member_data.member.mem_photo" max-height="210" class="hidden-xs-only" contain></v-img>
              <h4 class="text-center mt-2 hidden-xs-only"  >{{member_data.member.p_name}}</h4>
              <h4 v-if="process_type === 'LGU'" class="text-center font-weight-regular mb-3 hidden-xs-only">{{ member_data.member.ek_lgu_id ? member_data.member.ek_lgu_id : 'N/A' }}</h4>
              <h4 v-else class="text-center font-weight-regular mb-3 hidden-xs-only">{{ member_data.member.mem_hmo_policy_number ? member_data.member.mem_hmo_policy_number : 'N/A' }}</h4>
              <v-btn :disabled="prv_rate_checker" block  color="light-blue darken-4 white--text" @click="$emit('submit')">Submit<v-icon class="mb-1" small right>fas fa-paper-plane</v-icon></v-btn>
            </v-flex>
          </v-flex>

        </v-layout>

       <v-divider class="mt-4"></v-divider>
        <v-card-actions class="pb-0">
          <v-btn  @click="$emit('cancel-outpatient')" x-small text><v-icon  x-small left>fas fa-arrow-left</v-icon>Back to Eligibility</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    
  </div>
</template>


<script>
export default {
  props:[
    "validate_tran_has_rvs",
    "previous_cpt_icd", 
    "prv_rate_checker",
    "required_fields",
    "selection_data",
    "process_type",
    "doctor_items",
    "member_data",
    "doctor_data",
    "trans_data",
    "icd_loader",
    "cpt_loader",
    "icd_list", 
    "cpt_list",
    ],

}
</script>

<style scoped>
.doctor{
  flex: 1 1 auto;
  line-height: 20px;
  padding: 8px 0 8px;
  max-width: 100%;
  min-width: 0px;
  width: 100%
}
.grey-font{
 color:#424242 !important;
 caret-color: #424242 !important
}
.label-font{
  color: #616161 !important;
  caret-color: #616161 !important
}
</style>