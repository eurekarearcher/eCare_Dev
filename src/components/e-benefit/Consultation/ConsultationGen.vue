<template>
  <v-row>
    <v-col md="12" sm="12" lg="12" xl="12" cols="12" class="px-6">
      <v-card-text class="pb-1 body-1 mb-1 grey--text text--darken-4" >1. Chief Complaint <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Ano ang iyong ipapakonsulta?)</span> <span class="red--text">*</span><v-icon class="mb-1" small right>fas fa-edit</v-icon></v-card-text>

      <v-textarea v-model="trans_data.chief_complaint"  :error="consultation_data_required" @blur="$emit('getTransdata')" @input="trans_data.chief_complaint = textCapitalize($event)"  placeholder="Enter Chief Complaint Here" class="px-3"  rows="4" no-resize outlined rounded></v-textarea>
        <v-col md="12" sm="12" cols="12" class="px-3" style="margin-top: -2%;">
                <SignsAndSymptoms
                :emr_params="emr_params"
                @addSASData="$emit('getSASData', $event)"
                :required_fields="required_fields"
                :signs_and_symptoms="signs_and_symptoms"
                :from_migration="from_migration"
              />
        </v-col>

      <v-card-text class="pb-1 body-1 mb-1 grey--text text--darken-4" >3. History of current Illness <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Historya ng kasalukuyang karamdaman)</span><span v-if="eligible_data.eclaims_eligible" class="red--text">*</span><v-icon class="mb-1" small right>fas fa-edit</v-icon></v-card-text>
      <v-textarea v-model="trans_data.history_current_illness" :error="consultation_data_required_ill" @blur="$emit('getTransdata')" @input="trans_data.history_current_illness = textCapitalize($event)" placeholder="Enter History of Current Illness here" class="px-3"  rows="4" no-resize outlined rounded></v-textarea>
      <v-card-text class="pb-1 body-1 grey--text text--darken-4">4. Search for Midwife / Doctor / Medical Practitioner<span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Pumili ng manggagamot) </span><span class="red--text"> *</span><v-icon class="mb-1" small right>fas fa-user-md</v-icon></v-card-text>
      <v-autocomplete   
        v-model="doctor_data.displayed_text"
        @change="$emit('get-doctor-data',$event)"
        :loading="doctor_loader" 
        :items="doctor_list" 
        :error="required_fields && (action === 'submit_to_doctor' && !doctor_data.displayed_text) && !for_tele_consult || consultation_data_required_doc"
        class="text-field-radius px-3 mb-6" 
        append-icon=""
        item-text="autoCompleteText" 
        prepend-inner-icon="mdi-magnify"
        placeholder="Search for Midwife / Doctor Name / Nurse or Specialization" 
        hide-selected 
        return-object 
        hide-details 
        clearable 
        outlined 
        dense>
          <!--WHEN USER SELECT A DATA-->
          <template v-slot:selection="{item}">
            <v-icon class="hidden-sm-and-down" small left>fas fa-user-md</v-icon>
            <span class="grey--text text--darken-3 text-subtitle-2 text-md-subtitle-1">{{item.doctor_name}} / {{item.specialization}}</span>
          </template>

          <!--AUTO COMPLETE DISPLAYS-->
          <template v-slot:item="{ item }">
            <v-list-item-avatar color="indigo white--text">{{ item.doctor_name.charAt(0)}}</v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title>{{ item.doctor_name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.specialization }}</v-list-item-subtitle>
            </v-list-item-content> 
          </template>
      </v-autocomplete>

      
    </v-col>

    <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="px-6 " align-self="end">
      <v-card-text class="pb-1 body-1 grey--text text--darken-4" >5. Purpose of visit <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Layunin ng pagbisita)</span><v-icon class="mb-1" small right>fas fa-hand-holding-medical</v-icon></v-card-text>
      <v-autocomplete 
        v-model="trans_data.service_availed" 
        :disabled="from_migration"
        :error="required_fields && !trans_data.service_availed"
        :items="purpose_of_visit_items"
        @blur="$emit('getTransdata')" 
        placeholder="Select an item" 
        class="text-field-radius px-3 pt-1"
        append-icon="" 
        clearable
        outlined
        dense
        multiple
        small-chips
      ></v-autocomplete>
    </v-col>
  </v-row>
</template>

<script>
import SignsAndSymptoms from '@/components/emr/SignsAndSymptoms.vue';

export default {
  props: [ "consultation_data_required_doc", "consultation_data_required_ill", "consultation_data_required", "required_fields", "doctor_loader", "process_type","doctor_data","doctor_list", "member_data", "trans_data", "purpose_of_visit_items", "doctor_items", "action", "signs_and_symptoms", "emr_params", 'for_tele_consult', 'eligible_data' ,'from_migration'],
  emits: [ "get-doctor-data", "get-service-availed", "getSASData"],

  components:{
    SignsAndSymptoms
  },
  
  methods: {
    getRequiredField() {
      this.$emit('getRequiredField', this.required_fields)
    },
  }
};
</script>

<style scoped>
::v-deep .box_shadow > .v-input__control > .v-input__slot {
  box-shadow: 0 5px 2px -2px #cbc5c5bd;
 }
 .text-field-radius {
   border-radius:15px !important
 }
</style>