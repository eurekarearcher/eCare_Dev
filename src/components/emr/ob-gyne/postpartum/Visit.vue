<template>
    <v-card class="pa-7 mb-6">
        <label class="font-weight-medium body-1">Postpartum Visit</label>

        <v-row class="mb-6" dense>
            <v-col v-for="(value, index) in postpartum_" :key="index" cols="12" md="6" lg="6">
                <v-checkbox v-if="index === 0" v-model="value.no_of_visit" :disabled="!!value.transaction_patient_postpartum_consultation_id" @change="clear1stVisit" label="1st Visit" value="1"></v-checkbox>
                <v-checkbox v-else v-model="value.no_of_visit" :disabled="!!value.transaction_patient_postpartum_consultation_id || !postpartum_[0].no_of_visit" @change="clear2ndVisit" label="2nd Visit" value="2"></v-checkbox>

                <v-form :class="{'grey--text' : !value.no_of_visit}">
                    <v-row align="baseline" dense>
                        <v-col cols="12" lg="auto">
                            <label class="body-2">Date of Visit: </label>
                        </v-col>
                        
                        <v-col cols="12" sm="7" md="7" lg="7" xl="7">
                            <v-menu :close-on-content-click="false" :disabled="!editable_ || !!value.transaction_patient_postpartum_consultation_id || !value.no_of_visit" transition="scale-transition" min-width="auto" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" :value="formatDate(value.date_of_visit)" @click:clear="value.date_of_visit = '', mutationStatus()" :disabled="!editable_ || !!value.transaction_patient_postpartum_consultation_id || !value.no_of_visit" class="body-2" prepend-icon="mdi-calendar" label="Date" hide-details readonly dense></v-text-field>
                                </template>
                                <v-date-picker v-model="value.date_of_visit_picker" :max="dateToday()" @change="value.date_of_visit = formatDate(value.date_of_visit_picker)" no-title></v-date-picker>
                            </v-menu>
                        </v-col>
                        
                        <v-col cols="12" lg="auto">
                            <label class="body-2">Last Menstrual Period</label>
                        </v-col>

                        <v-col cols="12" lg="auto">
                            <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" :value="formatDate(value.lmp)" @click:clear="value.lmp = '', mutationStatus()" :disabled="!editable_ || !!value.transaction_patient_postpartum_consultation_id || !value.no_of_visit" class="body-2" prepend-icon="mdi-calendar" label="Date" hide-details readonly></v-text-field>
                                </template>
                                
                                <v-date-picker v-model="value.lmp" @change="mutationStatus" no-title></v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="12" lg="auto">
                            <label class="body-2">Previous Menstrual Period</label>
                        </v-col>

                        <v-col cols="12" lg="auto">
                            <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" :value="formatDate(value.pmp)" @click:clear="value.pmp = '', mutationStatus()" :disabled="!editable_ || !!value.transaction_patient_postpartum_consultation_id || !value.no_of_visit" class="body-2" prepend-icon="mdi-calendar" label="Date" hide-details readonly></v-text-field>
                                </template>
                                
                                <v-date-picker v-model="value.pmp" @change="mutationStatus" no-title></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>

                    <!-- <v-row class="mt-6" align="baseline" dense>
                        <v-col cols="12" lg="auto">
                            <label class="body-2">Contraceptive</label>
                        </v-col>

                        <v-col cols="12" lg="auto">
                            <v-autocomplete v-model="value.contraceptive" :items="contraceptive_items" @blur="mutationStatus" class="body-2" hide-details clearable outlined dense></v-autocomplete>
                        </v-col>

                        <v-col cols="12" lg="auto">
                            <label class="body-2">Method</label>
                        </v-col>

                        <v-col cols="12" lg="auto">
                            <v-autocomplete v-model="value.method" :items="method_items" :loading="method_loading" @blur="mutationStatus" class="body-2" item-text="method_data" hide-details clearable outlined dense></v-autocomplete>
                        </v-col>
                    </v-row>

                    <v-row class="mt-6" align="center" dense>
                        <v-col cols="12" lg="auto">
                            <label class="body-2">Unmet</label>
                        </v-col>

                        <v-col class="d-flex" cols="12" lg="auto">
                            <v-radio-group v-model="value.is_unmeet" @change="mutationStatus" class="ma-0" hide-details row>
                                <v-radio label="Yes" value="1"></v-radio>
                                <v-radio label="No" value="0"></v-radio>
                                <v-btn v-if="editable_ && value.is_unmeet && !value.transaction_patient_postpartum_consultation_id" @click="value.is_unmeet = '', mutationStatus()" class="mr-4" x-small>CLEAR</v-btn>
                            </v-radio-group>
                        </v-col>
                    </v-row> -->
                </v-form>
            </v-col>
        </v-row>

        <!-- <label class="font-weight-medium body-1">Family Planning</label>

        <v-row dense>
            <v-col v-for="(value, index) in postpartum_" :key="index" cols="12" md="6" lg="6">
                <v-form>
                    <v-row class="mt-6" align="baseline" dense>
                        <v-col cols="12" lg="auto">
                            <label class="body-2">Contraceptive</label>
                        </v-col>

                        <v-col cols="12" lg="auto">
                            <v-autocomplete v-model="value.contraceptive" :items="contraceptive_items" @blur="mutationStatus" class="body-2" hide-details clearable outlined dense></v-autocomplete>
                        </v-col>

                        <v-col cols="12" lg="auto">
                            <label class="body-2">Method</label>
                        </v-col>

                        <v-col cols="12" lg="auto">
                            <v-autocomplete v-model="value.method" :items="method_items" :loading="method_loading" @blur="mutationStatus" class="body-2" item-text="method_data" hide-details clearable outlined dense></v-autocomplete>
                        </v-col>
                    </v-row>

                    <v-row class="mt-6" align="center" dense>
                        <v-col cols="12" lg="auto">
                            <label class="body-2">Unmet</label>
                        </v-col>

                        <v-col class="d-flex" cols="12" lg="auto">
                            <v-radio-group v-model="value.is_unmeet" @change="mutationStatus" class="ma-0" hide-details row>
                                <v-radio label="Yes" value="1"></v-radio>
                                <v-radio label="No" value="0"></v-radio>
                                <v-btn v-if="editable_ && value.is_unmeet && !value.transaction_patient_postpartum_consultation_id" @click="value.is_unmeet = '', mutationStatus()" class="mr-4" x-small>CLEAR</v-btn>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row> -->

    </v-card>
</template>

<script>
import { mask } from "vue-the-mask"

export default {
    directives: { mask },
    props: ['editable_', 'postpartum_','from_migration'],

    data() {
        return {
            contraceptive_items: ['New Accepter', 'Other Accepter', 'Current User', 'Drop out'],
            method_loading: true,
            method_items: [],
            birthdate_mask: '##-##-####',
        }
    },

    created() {
        this.getMethod();

        this.postpartum_.sort((a, b) => a.no_of_visit - b.no_of_visit);
        const length = 2 - this.postpartum_.length
        
        for (let index = 0; index < length; index++) {
            this.postpartum_.push({
                no_of_visit: '',
                lmp: '',
                pmp: '',
                date_of_visit: '',
                // contraceptive: '',
                // method: '',
                // is_unmeet: ''
            })
        }
    },

    methods: {
        async getMethod() {
            let response = await this.$services.getTransactionIpRefData({
                request_key: 'contraceptive_method'
            })

            if (response.status === 200) {
                //response.data = this.responseDataDecryption(response.data)
                this.method_items = response.data
                this.method_loading = false
            } else {
                this.alert = response.error
            }
        },

        clear1stVisit() {
            this.postpartum_[0].lmp = ''
            this.postpartum_[0].pmp = ''
            this.postpartum_[0].date_of_visit = ''
            // this.postpartum_[0].contraceptive = ''
            // this.postpartum_[0].method = ''
            // this.postpartum_[0].is_unmeet = ''
            this.postpartum_[1].no_of_visit = ''
            this.clear2ndVisit();
        },

        clear2ndVisit() {
            this.postpartum_[1].lmp = ''
            this.postpartum_[1].pmp = ''
            this.postpartum_[1].date_of_visit = ''
            // this.postpartum_[1].contraceptive = ''
            // this.postpartum_[1].method = ''
            // this.postpartum_[1].is_unmeet = ''
        },

        mutationStatus() {
            this.$emit('mutationStatus')
        }
    }
}
</script>