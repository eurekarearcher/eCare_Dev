<template>
    <v-card class="pa-7">
        <v-form :disabled="!editable_">
            <h3 class="font-weight-medium text-center mb-6">Prenatal Information</h3>
            <label class="body-2">Prenatal Visit</label>
        
            <v-row>
                <v-col cols="12" lg="3">
                    <v-checkbox v-model="prenatal_[0].semester" :disabled="!!prenatal_[0].transaction_patient_prenatal_consultation_id" @change="clearData($event, 0)" label="1st Trimester" value="1" hide-details></v-checkbox>
                </v-col>
                
                <v-col cols="12" lg="4">
                    <v-menu :close-on-content-click="false" :disabled="!!prenatal_[0].transaction_patient_prenatal_consultation_id || !prenatal_[0].semester" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" :disabled="!!prenatal_[0].transaction_patient_prenatal_consultation_id || !prenatal_[0].semester" :value="formatDate(prenatal_[0].date_of_consul)" :clearable="editable_" @click:clear="clearData(null, 0)" class="body-2" label="Date" prepend-inner-icon="mdi-calendar" hide-details readonly></v-text-field>
                        </template>

                        <v-date-picker v-model="prenatal_[0].date_of_consul" :max="dateToday()" @change="computeForAOG(0)" no-title></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" lg="4">
                    <label v-if="prenatal_[0].aog_in_weeks" class="font-weight-medium d-block body-2 mt-6">AOG - {{ prenatal_[0].aog_in_weeks }}</label>
                </v-col>
            </v-row>

            <v-row class="mt-2">
                <v-col cols="12" lg="3">
                    <v-checkbox v-model="prenatal_[1].semester" :disabled="!!prenatal_[1].transaction_patient_prenatal_consultation_id" @change="clearData($event, 1)" label="2nd Trimester" value="2" hide-details></v-checkbox>
                </v-col>
                
                <v-col cols="12" lg="4">
                    <v-menu :close-on-content-click="false" :disabled="!!prenatal_[1].transaction_patient_prenatal_consultation_id || !prenatal_[1].semester" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" :disabled="!!prenatal_[1].transaction_patient_prenatal_consultation_id || !prenatal_[1].semester" :value="formatDate(prenatal_[1].date_of_consul)" :clearable="editable_" @click:clear="clearData(null, 1)" class="body-2" label="Date" prepend-inner-icon="mdi-calendar" hide-details readonly></v-text-field>
                        </template>

                        <v-date-picker v-model="prenatal_[1].date_of_consul" :max="dateToday()" @change="computeForAOG(1)" no-title></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" lg="4">
                    <label v-if="prenatal_[1].aog_in_weeks" class="font-weight-medium d-block body-2 mt-6">AOG - {{ prenatal_[1].aog_in_weeks }}</label>
                </v-col>
            </v-row>

            <label class="d-block mt-8 pl-2">3rd Trimester</label>
            
            <v-row>
                <v-col class="pl-12" cols="12" lg="3">
                    <v-checkbox v-model="prenatal_[2].prenatal_consul_no" :disabled="!!prenatal_[2].transaction_patient_prenatal_consultation_id" @change="clearData($event, 2)" label="1st Visit" value="1" hide-details></v-checkbox>
                </v-col>
                
                <v-col cols="12" lg="4">
                    <v-menu :close-on-content-click="false" :disabled="!!prenatal_[2].transaction_patient_prenatal_consultation_id || !prenatal_[2].prenatal_consul_no" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" :disabled="!!prenatal_[2].transaction_patient_prenatal_consultation_id || !prenatal_[2].prenatal_consul_no" :value="formatDate(prenatal_[2].date_of_consul)" :clearable="editable_" @click:clear="clearData(null, 2)" class="body-2" label="Date" prepend-inner-icon="mdi-calendar" hide-details readonly></v-text-field>
                        </template>

                        <v-date-picker v-model="prenatal_[2].date_of_consul" :max="dateToday()" @change="computeForAOG(2)" no-title></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" lg="4">
                    <label v-if="prenatal_[2].aog_in_weeks" class="font-weight-medium d-block body-2 mt-6">AOG - {{ prenatal_[2].aog_in_weeks }}</label>
                </v-col>
            </v-row>

            <v-row class="mt-2">
                <v-col class="pl-12" cols="12" lg="3">
                    <v-checkbox v-model="prenatal_[3].prenatal_consul_no" :disabled="!!prenatal_[3].transaction_patient_prenatal_consultation_id" @change="clearData($event, 3)" label="2nd Visit" value="2" hide-details></v-checkbox>
                </v-col>
                
                <v-col cols="12" lg="4">
                    <v-menu :close-on-content-click="false" :disabled="!!prenatal_[3].transaction_patient_prenatal_consultation_id || !prenatal_[3].prenatal_consul_no" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" :disabled="!!prenatal_[3].transaction_patient_prenatal_consultation_id || !prenatal_[3].prenatal_consul_no" :value="formatDate(prenatal_[3].date_of_consul)" :clearable="editable_" @click:clear="clearData(null, 3)" class="body-2" label="Date" prepend-inner-icon="mdi-calendar" hide-details readonly></v-text-field>
                        </template>

                        <v-date-picker v-model="prenatal_[3].date_of_consul" :max="dateToday()" @change="computeForAOG(3)" no-title></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" lg="4">
                    <label v-if="prenatal_[3].aog_in_weeks" class="font-weight-medium d-block body-2 mt-6">AOG - {{ prenatal_[3].aog_in_weeks }}</label>
                </v-col>
            </v-row>

            <v-row class="mt-5" align="baseline" dense>
                <v-col cols="12" lg="3">
                    <label class="body-2">Estimated Date of Delivery</label>
                </v-col>

                <v-col cols="12" lg="4">
                    <label class="font-weight-medium body-2">{{ edb_ ? $moment(edb_).format('MMMM D, YYYY') : '' }}</label>
                </v-col>
            </v-row>

            <v-row class="mt-5" align="baseline" dense>
                <v-col cols="12" lg="3">
                    <label class="body-2">Age of Gestation</label>
                </v-col>

                <v-col cols="12" lg="4">
                    <label class="font-weight-medium body-2">{{ aog_ }}</label>
                </v-col>
            </v-row>
        </v-form>
    </v-card>
</template>

<script>
export default {
    props: ['editable_', 'prenatal_', 'lmp_', 'edb_', 'aog_','from_migration'],

    methods: {
        computeForAOG(index) {
            //const edd = new Date(this.$moment(this.edb_).format('YYYY-MM-DD'))
            const lmp = new Date(this.$moment(this.lmp_).format('YYYY-MM-DD'))
            const date_of_consul = new Date(this.prenatal_[index].date_of_consul)
            const aog = Math.round((date_of_consul - lmp) / (7 * 24 * 60 * 60 * 1000));
            this.prenatal_[index].aog_in_weeks = `${aog} week(s)`
            this.mutationStatus();
        },

        clearData(event, index) { 
            if (event) {
                if (index <= 1) {
                    this.prenatal_[index].prenatal_consul_no = '1'
                } else {
                    this.prenatal_[index].semester = index === 3 ? index : index + 1
                }
            } else {   
                this.prenatal_[index].semester = ''
                this.prenatal_[index].prenatal_consul_no = ''
                this.prenatal_[index].date_of_consul = ''
                this.prenatal_[index].aog_in_weeks = ''
            }

            this.mutationStatus();
        },
 
        mutationStatus() {
            this.$emit('mutationStatus')
        }
    }
}
</script>