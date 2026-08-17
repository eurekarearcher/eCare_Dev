<template>
    <div>
        <h1 v-if="display === 0" class="font-weight-medium grey--text text--darken-3 mb-3">Yakap Report</h1>
        
        <span v-else class="d-flex mb-2">
            <div @click="display = 0" class="align-center d-flex hover ml-n2">
                <v-icon size="27">mdi-chevron-left</v-icon>
                <span class="font-weight-medium body-1">Back to List</span>
            </div>
        </span>
        
        <v-window v-model="display">
            <v-window-item :value="0">
                <v-card v-if="$store.state.prv_config.access_ekonsulta_reports === '1'" class="mb-6 mx-1">
                    <div @click="display = 3" class="font-weight-medium white--text darken-3 blue body-1 d-flex hover pa-3 px-6">
                        Yakap Claims Report
                        <v-spacer></v-spacer>
                        <v-icon dark>mdi-chevron-right</v-icon>
                    </div>
                </v-card>

                <v-card class="mb-6 mx-1">
                    <div @click="display = 1" class="font-weight-medium white--text darken-3 blue body-1 d-flex hover pa-3 px-6">
                        Philhealth First Patient Encounter (FPE) Report
                        <v-spacer></v-spacer>
                        <v-icon dark>mdi-chevron-right</v-icon>
                    </div>
                </v-card>

                <v-card class="mb-6 mx-1">
                    <div @click="display = 2" class="font-weight-medium white--text darken-3 blue body-1 d-flex hover pa-3 px-6">
                        Submission Report
                        <v-spacer></v-spacer>
                        <v-icon dark>mdi-chevron-right</v-icon>
                    </div>
                </v-card>
            </v-window-item>
            
            <v-window-item :value="1">
                <EkonsultaMember />
            </v-window-item>

            <v-window-item :value="2">
                <SubmissionReport />
            </v-window-item>

            <v-window-item :value="3">
                <EkonsultaCharts />
            </v-window-item>

        </v-window>
    </div>
</template>

<script>
import EkonsultaMember from '@/components/admin/ekonsulta/ekonsulta-reports/EkonsultaMember'
import SubmissionReport from '@/components/admin/ekonsulta/ekonsulta-reports/SubmissionReport'
import EkonsultaCharts from '@/components/admin/ekonsulta/ekonsulta-reports/ekonsulta-charts/Main.vue'

export default {
    components: {
        SubmissionReport,
        EkonsultaMember,
        EkonsultaCharts
    },
    
    data() {
        return {
            display: 0
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