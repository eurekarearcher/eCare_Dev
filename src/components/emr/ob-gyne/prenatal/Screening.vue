<template>
    <v-card class="pa-7">
        <h3 class="font-weight-medium text-center mb-6">Screening</h3>

        <div v-if="screening_loading" class="text-center">
            <v-progress-circular color="primary" size="40" width="2" indeterminate></v-progress-circular>
            <h6 class="font-weight-medium light-blue--text text--darken-4 body-1 mt-4">Loading Items...</h6>
        </div>

        <v-form v-else v-for="value in screening_items" :key="value.label" :disabled="!editable_ || !!value.transaction_patient_prenatal_screening_id">
            <v-row class="mt-6" justify="space-between" dense>
                <v-col cols="12" md="4" lg="4" xl="5">
                    <label class="body-2">{{ value.prenatal_screening_data }}<span v-if="value.selected === 'Yes'" class="red--text"> *</span></label>
                </v-col>

                <v-col cols="12" md="3" lg="auto" xl="auto">
                    <v-radio-group v-model="value.selected" @change="mutationStatus" class="ma-0" hide-details row>
                        <v-radio label="Yes" value="Yes"></v-radio>
                        <v-radio label="No" value="No"></v-radio>
                    </v-radio-group>
                </v-col>

                <v-col cols="11" md="3" lg="3" xl="3">
                    <v-menu :close-on-content-click="false" :disabled="value.selected !== 'Yes'" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                        <template v-slot:activator="{ on }">
                            <!-- <v-text-field v-on="on" :error-messages="required_ob ? 'OB/GYEN Required' : null " :error="obg_data_.screening.prenatal_screening_id === '' || obg_data_.screening.prenatal_screening_id === null ? required_fields : required_ob" :disabled="value.selected !== 'Yes'" :value="formatDate(value.screening_date)" @click:clear="value.screening_date = '', mutationStatus()" class="body-2" label="Date" prepend-inner-icon="mdi-calendar" hide-details clearable readonly dense></v-text-field> -->
                            <v-text-field v-on="on" :error-messages="prenatal_screening_required ? 'Prenatal Screening Date Required' : ''" :disabled="value.selected !== 'Yes'" :value="formatDate(value.screening_date)" @click:clear="value.screening_date = ''; mutationStatus()" class="body-2" label="Date" prepend-inner-icon="mdi-calendar" hide-details clearable dense></v-text-field>
                        </template>

                        <v-date-picker v-model="value.screening_date" :max="date_today" :min="obg_data_.lmp" @change="mutationStatus" no-title></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="1">
                    <v-btn v-if="editable_ && value.selected && !value.transaction_patient_prenatal_screening_id" @click="value.selected = '', value.screening_date = '', mutationStatus()" class="mr-4" x-small>CLEAR</v-btn>
                </v-col>
            </v-row>
        </v-form>

        <Alert :alert="alert" />
    </v-card>
</template>

<script>
import Alert from '@/components/Alert.vue'

export default {
    props: ['editable_', 'obg_data_'],

    components: {
        Alert
    },

    data() {
        return {
            date_today: this.$moment().format('YYYY-MM-DD'),
            screening_loading: true,
            screening_items: [],
            alert: {}
        }
    },

    created() {
        this.getPrenatalScreening();
    },

    computed: {
        // Check if any required fields in screening are missing
        prenatal_screening_required() {
            return this.screening_items.some(item => {
                return (
                    item.selected === 'Yes' &&
                    (!item.screening_date)
                );
            });
        }
    },

    methods: {
        async getPrenatalScreening() {
            let response = await this.$services.getTransactionIpRefData({
                request_key: 'prenatal_screening'    
            })

            if (response.status === 200) {
                //response.data = this.responseDataDecryption(response.data)
                this.screening_items = response.data
                this.mapScreeningData();
                this.screening_loading = false
            } else {
                this.alert = response.error
            }
        },

        mapScreeningData() {
            const arr = []

            for (let index = 0; index < this.screening_items.length; index++) {
                const items = this.screening_items[index];

                for (let index = 0; index < this.obg_data_.screening.length; index++) {
                    const screening = this.obg_data_.screening[index];

                    if (items.prenatal_screening_id.toString() === screening.prenatal_screening_id.toString()) {
                        items.transaction_patient_prenatal_screening_id = screening.transaction_patient_prenatal_screening_id
                        items.selected = screening.selected
                        items.screening_date = this.formatDate(screening.screening_date)
                    }
                }

                arr.push(items)
            }
            
            this.screening_items = arr
        },

        clearScreeningData() {
            this.screening_items = this.screening_items.map(element => {
                return {
                    prenatal_screening_data: element.prenatal_screening_data,
                    prenatal_screening_id: element.prenatal_screening_id
                }
            })

            this.mapScreeningData();
        },

        mutationStatus() {
            this.obg_data_.screening = this.screening_items.filter(element => element.selected)
            this.$emit('mutationStatus')
        }
    }
}
</script>