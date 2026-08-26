<template>
    <v-card>
        <Header v-model="conversion_unit" :diagnostic_exam="diagnostic_exam" :emr_page="emr_page" />
        <v-divider class="d-print-none"> </v-divider>
        <template>
            <v-row class="pa-4">
                <v-col sm="12" md="12" lg="12">
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Referred Lab/Radio Facility </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pReferralFacility" placeholder="If referred to other facility" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Lab Date </span>
                        <!-- <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" v-model="diagnostic_exam.diagnostic.pLabDate" placeholder="YYYY-MM-DD" hide-details dense :readonly="emr_page"></v-text-field>
                            </template>
                            <v-date-picker v-model="diagnostic_exam.diagnostic.pLabDate" no-title :readonly="emr_page"></v-date-picker>
                        </v-menu>  -->
                        <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" v-model="diagnostic_exam.diagnostic.pLabDate" v-mask="lab_mask" placeholder="MM-DD-YYYY" hide-details dense :readonly="emr_page"></v-text-field>
                            </template>
                            <v-date-picker v-model="lab_picker" @change="diagnostic_exam.diagnostic.pLabDate = formatDate(lab_picker)" no-title :readonly="emr_page"></v-date-picker>
                        </v-menu>
                    </div>
                    <div v-if="conversion_unit === 'CU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Glucose (mg/Dl)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pGlucoseMg" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-else class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Glucose (mmol/L)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pGlucoseMmol" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>

                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Diagnostic Lab Fee </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pDiagnosticLabFee" v-on:keypress="$emit('numberOnly', $event)" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>       
                </v-col>
            </v-row>
        </template>
    </v-card>
</template>

<script>
import { mask } from "vue-the-mask"
import Header from '@/components/emr/diagnostic-exam-result/Header';

export default {
  directives: { mask },
  props: ['diagnostic_exam', 'emr_page'],
  components: { Header },
  data() {
    return {
      conversion_unit: this.$store.state.usr_credentials.user_settings.unit_conversion || 'CU',
      lab_picker: '',
      lab_mask: '##-##-####',
    }
  }
}
</script>

<style scoped>
.label-width{
    width: 180px;
}
</style>
