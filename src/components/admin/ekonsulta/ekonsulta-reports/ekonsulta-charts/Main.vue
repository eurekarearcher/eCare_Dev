<template>
    <v-container fluid>
        <v-sheet class="darken-3 blue pa-2 mb-2"> 
            <h6 class="font-weight-bold white--text body-1 pl-1">Yakap Claims Report</h6>
        </v-sheet>
        <v-row dense class="mt-4"> 
            <v-col cols="12" sm="12" md="8" lg="8" xl="8">
                <v-row class="flex-wrap mb-4" dense>
                    <v-col cols="12" sm="4" md="4" lg="3" xl="3">
                        <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" :value="formatDate(start_date)" label="Start Date" hide-details outlined readonly dense></v-text-field>
                            </template>

                            <v-date-picker v-model="start_date" no-title></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4" md="4" lg="3" xl="3" class="pl-sm-2">
                        <v-menu :close-on-content-click="false" transition="scale-transition" offset-y>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" :value="formatDate(end_date)" label="End Date" hide-details outlined readonly dense></v-text-field>
                            </template>

                            <v-date-picker v-model="end_date" :disabled="!start_date" no-title></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4" md="4" lg="6" xl="6" class="pl-2">
                        <div class="d-flex">
                            <v-btn @click="getSelectedDates" :disabled="!start_date || !end_date" class="white--text" color="primary" height="41">
                                <v-icon color="white" left>mdi-update</v-icon>
                                <span>LOAD SELECTED DATES</span>
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <EkonsultaPlatform ref="ekonsulta_platform"/>
        <v-divider class="my-8"> </v-divider>
        <EkonsultaRecorded ref="ekonsulta_record" />
        <v-divider class="my-8"> </v-divider>
        <EkonsultaDailyEncounters ref="ekonsulta_daily_encounters"/>
        <v-divider class="my-8"> </v-divider>
        <EkonsultaClaimSubmitted ref="ekonsulta_claim_submitted"/>
        <v-divider class="my-8"> </v-divider>
        <EkonsultaRegisteredClient ref="ekonsulta_registered_client"/>
    </v-container>
</template>

<script>
import EkonsultaClaimSubmitted from '@/components/admin/ekonsulta/ekonsulta-reports/ekonsulta-charts/EkonsultaClaimSubmitted.vue'
import EkonsultaRecorded from '@/components/admin/ekonsulta/ekonsulta-reports/ekonsulta-charts/EkonsultaRecorded.vue'
import EkonsultaRegisteredClient from '@/components/admin/ekonsulta/ekonsulta-reports/ekonsulta-charts/EkonsultaRegisteredClient.vue'
import EkonsultaPlatform from '@/components/admin/ekonsulta/ekonsulta-reports/ekonsulta-charts/EkonsultaPlatform.vue'
import EkonsultaDailyEncounters from '@/components/admin/ekonsulta/ekonsulta-reports/ekonsulta-charts/EkonsultaDailyEncounters.vue'
import { mask } from "vue-the-mask"

export default {
    directives: { mask },

    components: {
        EkonsultaClaimSubmitted,
        EkonsultaRecorded,
        EkonsultaRegisteredClient,
        EkonsultaPlatform,
        EkonsultaDailyEncounters
    },

    data() {
        return {
            display: 0,
            alert: {},
            report_data: [],

            start_date: '',
            start_date_picker: '',
            end_date: '',
            end_date_picker: '',
            date_mask: '####-##-##',
            max_start_date: this.$moment().format('YYYY-MM-DD'),
            loading_data: false
        }
    },
    
    methods: {
        getSelectedDates() {
            let request_data = {
                provider_code: this.$store.state.prv_data.provider_code,
                PHciAccreNo: this.$store.state.prv_data.ekonsulta_phic_acc_no,
                start_date: this.start_date,
                end_date: this.end_date
            }

            this.$refs.ekonsulta_platform.getEkonsultaReportStatus('PR', request_data)
            this.$refs.ekonsulta_daily_encounters.getEkonsultaReportStatus('DE', request_data)
            this.$refs.ekonsulta_registered_client.getEkonsultaReportStatus('RKC', request_data)
            this.$refs.ekonsulta_claim_submitted.getEkonsultaReportStatus('SRM', request_data)
            this.$refs.ekonsulta_record.getEkonsultaReportStatus('RE', request_data)
            this.$refs.ekonsulta_record.getTotalEntries('TEP', request_data)
        }
    }
}
</script>

<style scoped>
.hover:hover {
    cursor: pointer;
    font-size: 17px !important;
    transition: font-size 0.5s;
}
.opacity {
    opacity: 0.3 !important;
    user-select: none; /* Standard syntax */
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
}
</style>