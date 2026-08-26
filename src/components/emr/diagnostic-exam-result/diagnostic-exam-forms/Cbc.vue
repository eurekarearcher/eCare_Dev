<template>
    <v-card>
        <Header v-model="conversion_unit" :diagnostic_exam="diagnostic_exam" :emr_page="emr_page" />
        <v-divider class="d-print-none"> </v-divider>
        <template >
            <v-row class="pa-4">
                <v-col sm="12" md="12" lg="12">
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Referred Lab/Radio Facility </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pReferralFacility" placeholder="If referred to other facility" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Lab Date </span>
                        <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" v-model="diagnostic_exam.diagnostic.pLabDate" v-mask="lab_mask" placeholder="MM-DD-YYYY" hide-details dense :readonly="emr_page"></v-text-field>
                            </template>
                            <v-date-picker v-model="lab_picker" @change="diagnostic_exam.diagnostic.pLabDate = formatDate(lab_picker)" no-title :readonly="emr_page"></v-date-picker>
                        </v-menu>
                    </div>
                    <div v-if="conversion_unit === 'CU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Hematocrit (%) </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pHematocrit" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-if="conversion_unit === 'CU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Hemoglobin (g/dL) </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pHemoglobinG" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-else class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Hemoglobin (mmol/L) </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pHemoglobinMmol" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-if="conversion_unit === 'CU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Mhc (pg)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pMhcPg" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-else class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Mhc (fmol)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pMhcFmol" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-if="conversion_unit === 'CU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Mchc (g/dL)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pMchcGhb" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-else class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Mchc (mmol/L)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pMchcMmol" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-if="conversion_unit === 'SIU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Mcv (μm³)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pMcvUm" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-else class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Mcv (fL)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pMcvFl" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-if="conversion_unit === 'CU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> WBC Count (×10³/μL)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pWbc1000" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-else class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> WBC Count (×10⁹/L)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pWbc10" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-if="conversion_unit === 'CU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Myelocyte (%)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pMyelocyte" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-if="conversion_unit === 'CU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Neutrophils (Band) </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pNeutrophilsBnd" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-else class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Neutrophils (Segmented) </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pNeutrophilsSeg" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-if="conversion_unit === 'CU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Lymphocytes (%)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pLymphocytes" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-if="conversion_unit === 'CU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Monocytes (%)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pMonocytes" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-if="conversion_unit === 'CU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Eosinophils (%)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pEosinophils" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div v-if="conversion_unit === 'CU'" class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Basophils (%)</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pBasophils" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> 
                            Platelet <span v-if="conversion_unit === 'CU'" class="body-2">(×10³/μL)</span> <span v-else class="body-2">(×10⁹/L) </span>
                        </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pPlatelet" dense hide-details :readonly="emr_page"> </v-text-field>
                    </div>
                    
                    <div class="d-flex justify-end align-baseline">
                        <p class="pr-2 body-2 font-weight-medium label-width"> Diagnostic Lab Fee </p>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pDiagnosticLabFee" v-on:keypress="$emit('numberOnly', $event)" dense :readonly="emr_page"> </v-text-field>
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
</style>>
