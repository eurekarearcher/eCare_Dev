<template>
  <div class="d-print-none text-center">
    <v-divider></v-divider>
    
    <div :class="{'d-flex' : $vuetify.breakpoint.smAndUp}" class="py-4 px-6">
      <v-spacer></v-spacer>

      <template  v-if="$store.state.usr_credentials.department === 'Midwife'"> 
        <v-btn class="my-2 justify-end" @click="$emit('close')">
          Close 
          <v-icon size="20" right>mdi-close</v-icon>
        </v-btn> 
      </template>

      <template v-else> 
        <div class="d-flex justify-center">
          <v-btn v-if="!save_as_pdf_disabled" @click="$emit('saveAsPDF')" class="ma-2" :class="{'centered-button': is_medical_certificate && allowed_providers.includes(prv_data.municipality)}" color="#367c9d" dark :disabled="editForms || input_undersigned || input_remarks || is_edit_forms || rx_issued">
            SAVE AS PDF
            <v-icon size="20" right>mdi-file-pdf-box</v-icon>
          </v-btn>

          <v-btn @click="$emit('print')" class="ma-2" :class="{'centered-button': is_medical_certificate && allowed_providers.includes(prv_data.municipality)}"  color="#367c9d" dark :disabled="editForms || input_undersigned || input_remarks || is_edit_forms || rx_issued">
            PRINT
            <v-icon size="20" right>mdi-printer</v-icon>
          </v-btn>
        </div>

        <v-spacer></v-spacer>

        <v-btn v-if="(is_medical_certificate && allowed_municipalities.includes(prv_data.municipality))" @click="$emit('editForms')" class="ma-2 white--text" color="#367c9d" dark>
          {{ input_undersigned || is_edit_forms || input_remarks || input_diagnose || input_due || input_exam ? 'Save Changes' : 'Edit Forms'}}
          <v-icon size="20" right>mdi-pencil</v-icon>
        </v-btn>

        <v-btn class="my-2" @click="$emit('close')">
          {{ input_undersigned ? 'Cancel' : 'Close'}}
          <v-icon size="20" right>mdi-close</v-icon>
        </v-btn>
      </template>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: ['input_undersigned', 'input_remarks', 'input_diagnose' , 'input_due', 'is_medical_certificate', 'purposes', 'diagnosis', 'input_exam', 'is_edit_forms', 'rx_issued'],

  data() {
    return {
      editForms: false,
      allowed_municipalities: [
        'TUBOD',
        'CITY OF ANTIPOLO',
        'ATIMONAN',
        'LUCENA CITY',
        // 'PAGBILAO',
        'PARAÑAQUE CITY',
        'CITY OF SANTA ROSA',
        'DINALUPIHAN',
      ],

      allowed_providers: ['AT','LC','PQ','SR', 'BT']
    };
  },

  computed: {
    ...mapState(['usr_credentials', 'prv_data']),

    save_as_pdf_disabled() {
        return this.$store.state.usr_credentials.user_settings.save_as_pdf_disabled === "1" ? 1 : 0;
    },
  },
  
};
</script>

<style>
.centered-button {
  left: 50% !important;
}
</style>
