<template>
    <v-card>
        <Header :diagnostic_exam="diagnostic_exam" :emr_page="emr_page" />
        <v-divider class="d-print-none"> </v-divider>
        <template>
            <v-row class="pa-4">
                <v-col sm="12" md="12" lg="12">
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Referred Lab/Radio Facility </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pReferralFacility" placeholder="If referred to other facility" dense :readonly="emr_page" hide-details> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Lab Date </span>
                        <!-- <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" v-model="diagnostic_exam.diagnostic.pLabDate" placeholder="YYYY-MM-DD" dense :readonly="emr_page" hide-details></v-text-field>
                            </template>
                            <v-date-picker v-model="diagnostic_exam.diagnostic.pLabDate" no-title :readonly="emr_page"></v-date-picker>
                        </v-menu> -->
                        <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" v-model="diagnostic_exam.diagnostic.pLabDate" v-mask="lab_mask" placeholder="MM-DD-YYYY" dense :readonly="emr_page" hide-details></v-text-field>
                            </template>
                            <v-date-picker v-model="lab_picker" @change="diagnostic_exam.diagnostic.pLabDate = formatDate(lab_picker)" no-title :readonly="emr_page"></v-date-picker>
                        </v-menu>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Gravity</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pGravity" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Appearance </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pAppearance" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Color</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pColor" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Glucose </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pGlucose" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Proteins </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pProteins" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Ketones </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pKetones" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Ph </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pPh" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Rb Cells</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pRbCells" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Wb Cells </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pWbCells" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Bacteria </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pBacteria" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Crystals </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pCrystals" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Bladder Cell </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pBladderCell" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Squamous Cell</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pSquamousCell" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Tubular Cell </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pTubularCell" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Broad Casts</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pBroadCasts" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Epithelial Cast</span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pEpithelialCast" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Granular Cast </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pGranularCast" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Hyaline Cast </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pHyalineCast" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Rbc Cast </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pRbcCast" hide-details dense :readonly="emr_page"> </v-text-field>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Waxy Cast </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pWaxyCast" hide-details dense :readonly="emr_page" maxlength="20"> </v-text-field>
                    </div>      
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Wc Cast </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pWcCast" hide-details dense :readonly="emr_page" maxlength="20"> </v-text-field>
                    </div> 
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Albumin </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pAlbumin" hide-details dense :readonly="emr_page" maxlength="20"> </v-text-field>
                    </div> 
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Pus Cells </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pPusCells" hide-details dense :readonly="emr_page" maxlength="20"> </v-text-field>
                    </div> 
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width" > Diagnostic Lab Fee </span>
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
