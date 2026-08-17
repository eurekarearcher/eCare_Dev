<template>
    <v-card>
        <Header :diagnostic_exam="diagnostic_exam" :emr_page="emr_page" />
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
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Findings</span>
                        <template v-if="emr_page"> 
                            <v-select v-model="diagnostic_exam.diagnostic.pFindings" :items="findings_list_items[0]" item-text="LibDesc" item-value="LibID" :readonly="emr_page" dense return-object>
                            </v-select>
                        </template>
                        <template v-else> 
                            <v-select v-model="diagnostic_exam.diagnostic.pFinds" :items="findings_list_items[0]" item-text="LibDesc" item-value="LibID" :readonly="emr_page" dense return-object>
                            </v-select>
                        </template>
                    </div>
                    <div class="form-div">
                        <span class="pr-2 body-2 font-weight-medium label-width"> Remarks </span>
                        <v-text-field v-model="diagnostic_exam.diagnostic.pRemarks" hide-details dense :readonly="emr_page"> </v-text-field>
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
    props: ['diagnostic_exam', 'findings_list_items', 'emr_page'],
    components: { Header},
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
