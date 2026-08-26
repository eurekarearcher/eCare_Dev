<template>
    <v-card class="pa-7" outlined>
        <h3 class="font-weight-regular blue darken-3 text-center white--text py-2">PREGNANCY HISTORY</h3>

        <v-card class="mt-6" outlined>
            <v-data-table :headers="tbl_headers" :items="tbl_items" :search="tbl_search" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :items-per-page="5" class="elevation-2" mobile-breakpoint="0"></v-data-table>

            <v-row class="mt-6 mx-4" align="center" dense>
                <v-col cols="12" lg="auto">
                    <label class="body-2">History of Ectopic Pregnancy</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-radio-group v-model="obg_data_.has_history_of_ectopic_pregnancy" @change="mutationStatus" class="ma-0" hide-details row>
                        <v-radio label="Yes" value="1"></v-radio>
                        <v-radio label="No" value="0"></v-radio>
                        <v-btn v-if="obg_data_.has_history_of_ectopic_pregnancy" @click="obg_data_.has_history_of_ectopic_pregnancy = null, mutationStatus()" class="mr-4" x-small>CLEAR</v-btn>
                    </v-radio-group>
                </v-col>
            </v-row>

            
            <v-row class="mt-6 mx-4" align="center" dense>
                <v-col cols="12" lg="auto">
                    <label class="body-2">Has experienced Induced Hypertension (Pre-eclampsia)</label>
                </v-col>
                
                <v-col cols="12" lg="auto">
                    <v-radio-group v-model="obg_data_.has_experienced_pre_eclampsia" @change="mutationStatus" class="ma-0" hide-details row>
                        <v-radio label="Yes" value="Y"></v-radio>
                        <v-radio label="No" value="N"></v-radio>
                        <v-btn v-if="obg_data_.has_experienced_pre_eclampsia" @click="obg_data_.has_experienced_pre_eclampsia = null, mutationStatus()" class="mr-4" x-small>CLEAR</v-btn>
                    </v-radio-group>
                </v-col>
            </v-row>

            <v-row class="mt-6 mx-4" align="center" dense>
                <v-col class="d-flex" cols="12" lg="auto">
                    <label class="body-2"> Type of Delivery: </label>
                </v-col>

                <v-col cols="12" align-self="center" lg="auto">
                    <v-select v-model="obg_data_.type_of_delivery" :items="type_of_delivery_items" @change="mutationStatus" class="body-2" hide-details clearable outlined dense></v-select>
                </v-col>
            </v-row>

            <v-row class="mt-6 mx-4" align="center" dense>
                <v-col cols="12" lg="auto">
                    <label class="body-2">Previous Complications</label>
                </v-col>

                <v-col class="d-flex" cols="12" lg="auto">
                    <v-checkbox v-model="obg_data_.previous_complication" @change="mutationStatus" class="ma-0 mx-4" label="Hemorrhage" value="Hemorrhage" hide-details></v-checkbox>
                    <v-checkbox v-model="obg_data_.previous_complication" @change="mutationStatus" class="ma-0 mx-4" label="HPV" value="HPV" hide-details></v-checkbox>
                    <v-checkbox v-model="obg_data_.previous_complication" @change="mutationStatus" class="ma-0 mx-4" label="Placenta Previa / Abruption" value="Placenta Previa / Abruption" hide-details></v-checkbox>
                    <v-checkbox v-model="obg_data_.previous_complication" @change="mutationStatus" class="ma-0 mx-4" label="Sepsis" value="Sepsis" hide-details></v-checkbox>
                    <v-checkbox v-model="obg_data_.previous_complication" @change="mutationStatus" class="ma-0 mx-4" label="Diabetes Mellitus" value="Diabetes Mellitus" hide-details></v-checkbox>
                </v-col>
            </v-row>
            <label class="font-weight-medium body-1 d-block mt-6 mx-4 mb-2">New GPTPAL</label>
            <v-row align="baseline" dense class="mx-4 mb-4">
                <v-col cols="12" lg="auto">
                    <label class="body-2">Gravidity</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-text-field v-model="obg_data_.obg_gravidity" @blur="mutationStatus" @keydown.enter.prevent @keypress="numberOnly" maxlength="2" class="body-2" hide-details dense></v-text-field>
                </v-col>

                <v-col cols="12" lg="auto">
                    <label class="body-2">Parity</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-text-field v-model="obg_data_.obg_parity" @blur="mutationStatus" @keydown.enter.prevent @keypress="numberOnly" maxlength="2" class="body-2" hide-details dense></v-text-field>
                </v-col>

                <v-col cols="12" lg="auto">
                    <label class="body-2">Term Birth</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-text-field v-model="obg_data_.obg_term" @blur="mutationStatus" @keydown.enter.prevent @keypress="numberOnly" maxlength="2" class="body-2" hide-details dense></v-text-field>
                </v-col>

                <v-col cols="12" lg="auto">
                    <label class="body-2">Premature</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-text-field v-model="obg_data_.obg_preterm" @blur="mutationStatus" @keydown.enter.prevent @keypress="numberOnly" maxlength="2" class="body-2" hide-details dense></v-text-field>
                </v-col>

                <v-col cols="12" lg="auto">
                    <label class="body-2">Abortion</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-text-field v-model="obg_data_.obg_abortions" @blur="mutationStatus" @keydown.enter.prevent @keypress="numberOnly" maxlength="2" class="body-2" hide-details dense></v-text-field>
                </v-col>

                <v-col cols="12" lg="auto">
                    <label class="body-2">Living Children</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-text-field v-model="obg_data_.obg_living" @blur="mutationStatus" @keydown.enter.prevent @keypress="numberOnly" maxlength="2" class="body-2" hide-details dense></v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </v-card>
</template>

<script>

export default {
    props: ['obg_data_','from_migration'],

    data() {
        return {
            tbl_search: '',
            tbl_headers: [
                { text: 'Date', value: 'obg_date_created', width: '100px', sortable: false },
                { text: 'Gravidity', value: 'obg_gravidity', width: '100px', sortable: false },
                { text: 'Parity', value: 'obg_parity', width: '100px', sortable: false },
                { text: 'Term Birth', value: 'obg_term', width: '100px', sortable: false },
                { text: 'Premature', value: 'obg_preterm', width: '100px', sortable: false },
                { text: 'Abortion', value: 'obg_abortions', width: '100px', sortable: false },
                { text: 'Living Children', value: 'obg_living', width: '100px', sortable: false }
            ],
            tbl_items: [
                {
                    obg_date_created: this.obg_data_.obg_date_created,
                    obg_gravidity: this.obg_data_.obg_gravidity,
                    obg_parity: this.obg_data_.obg_parity,
                    obg_term: this.obg_data_.obg_term,
                    obg_preterm: this.obg_data_.obg_preterm,
                    obg_abortions: this.obg_data_.obg_abortions,
                    obg_living: this.obg_data_.obg_living
                }
            ],
            type_of_delivery_items: ['Normal Spontaneous Delivery', 'Cesarean Section','Both Normal & Operative','Not Applicable'],
        }
    },
    
    methods: {
        mutationStatus() {
            this.$emit('mutationStatus')
        },

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
        if((event.which < 48 || event.which > 57) && event.which !== 45){
            event.preventDefault();
        }
        },
    }
}
</script>