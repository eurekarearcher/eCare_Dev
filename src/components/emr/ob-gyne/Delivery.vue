<template>
    <v-card class="pa-7" outlined>
        <v-form :disabled="!editable_" ref="delivery">
            <v-card class="pa-7 mb-6" outlined>
                <v-row align="baseline" dense>
                    <v-col cols="12" lg="auto">
                        <label class="body-2">Date of Delivery <span class="red--text"> *</span></label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-form :disabled="!editable_">
                            <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" :value="formatDate(obg_data_.date_of_delivery)" :error="empty_.delivery && !obg_data_.date_of_delivery" class="body-2 pr-2" label="Date" prepend-inner-icon="mdi-calendar" hide-details>
                                        <template v-slot:append>
                                            <v-icon v-if="editable_ && obg_data_.date_of_delivery" @click="clearDateOfDelivery">mdi-close</v-icon>
                                        </template>
                                    </v-text-field>
                                </template>

                                <v-date-picker v-model="obg_data_.date_of_delivery" :max="dateToday()" @change="mutationStatus" no-title></v-date-picker>
                            </v-menu>
                        </v-form>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <label class="body-2">Time of Delivery <span class="red--text"> *</span></label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-form :disabled="!editable_">
                            <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" :value="formatted_time" :error="empty_.delivery && !obg_data_.time_of_delivery" class="body-2 pr-2" label="Time" prepend-inner-icon="mdi-calendar" hide-details>
                                    <template v-slot:append>
                                    <v-icon v-if="editable_ && obg_data_.time_of_delivery" @click="clearDateOfDelivery">mdi-close</v-icon>
                                    </template>
                                </v-text-field>
                                </template>

                                <v-time-picker v-model="obg_data_.time_of_delivery" @change="mutationStatus" :landscape="landscape" ampm></v-time-picker>
                            </v-menu>
                        </v-form>
                    </v-col>
                    
                    <v-col cols="12" lg="auto">
                        <label class="body-2">Type of Delivery <span class="red--text"> *</span></label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-select v-model="obg_data_.nsd_cs" :items="type_of_delivery_items" :error="empty_.delivery && !obg_data_.nsd_cs" @change="mutationStatus" class="body-2" hide-details clearable outlined dense></v-select>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <label class="body-2">Place of Delivery <span class="red--text"> *</span></label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-select v-model="obg_data_.place_of_delivery" :items="place_of_delivery_items" :error="empty_.delivery && !obg_data_.place_of_delivery" @change="mutationStatus" class="body-2" hide-details clearable outlined dense></v-select>
                    </v-col>
                </v-row>

                <v-row class="mt-6" align="baseline" dense>
                    <v-col cols="12" lg="auto">
                        <label class="body-2">Attended By <span class="red--text"> *</span></label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-select v-model="obg_data_.attended_by" :items="attended_by_items" :error="empty_.delivery && !obg_data_.attended_by" @change="mutationStatus" class="body-2" hide-details clearable outlined dense></v-select>
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12" lg="auto">
                        <v-radio-group v-model="obg_data_.bo_sex" :error="empty_.delivery && !obg_data_.bo_sex" @change="computeBMI" hide-details row>
                            <label class="body-2 pr-2">Gender <span class="red--text"> *</span></label>
                            <v-radio label="Male" value="MALE"></v-radio>
                            <v-radio label="Female" value="FEMALE"></v-radio>
                            <v-btn v-if="editable_ && obg_data_.bo_sex" @click="obg_data_.bo_sex = '', computeBMI()" x-small>CLEAR</v-btn>
                        </v-radio-group>
                    </v-col>
                </v-row>

                <v-row class="mt-6" align="baseline" dense>
                    <!-- Length -->
                    <v-col cols="12" lg="auto">
                        <label class="body-2">Length <span class="red--text"> *</span></label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-text-field v-model="obg_data_.bo_length" :error="empty_.delivery && !obg_data_.bo_length" @change="computeBMI" class="body-2" hide-details dense>
                            <template v-slot:append>
                                <span class="grey--text text--darken-1 mt-2">CM</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <!-- Weight -->
                    <v-col cols="12" lg="auto">
                        <label class="body-2">Weight <span class="red--text"> *</span></label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-text-field v-model="obg_data_.bo_birth_weight" :error="empty_.delivery && !obg_data_.bo_birth_weight" @change="computeBMI" class="body-2" hide-details dense>
                            <template v-slot:append>
                                <span class="grey--text text--darken-1 mt-2">KG</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <!-- Head Circumference -->
                    <v-col cols="12" lg="auto">
                        <label class="body-2">Head Circumference <span class="red--text"> *</span></label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-text-field v-model="obg_data_.bo_head_circumference" :error="empty_.delivery && !obg_data_.bo_head_circumference" @blur="mutationStatus" class="body-2" hide-details dense>
                            <template v-slot:append>
                                <span class="grey--text text--darken-1 mt-2">CM</span>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>

                <v-row class="text-center mt-8" dense>
                    <v-col cols="12" lg="auto">
                        <label class="d-block body-2">
                            Weight for Age: 
                            <span class="font-weight-medium">{{ obg_data_.weight_for_age ? obg_data_.weight_for_age : '--' }}</span>
                        </label>
                    </v-col>
                    
                    <v-col class="px-6" cols="12" lg="auto">
                        <label class="d-block body-2">
                            Height for Age: 
                            <span class="font-weight-medium">{{ obg_data_.height_for_age ? obg_data_.height_for_age : '--' }}</span>
                        </label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <label class="d-block body-2">
                            Weight for Length: 
                            <span class="font-weight-medium">{{ obg_data_.weight_for_height ? obg_data_.weight_for_height : '--' }}</span>
                        </label>
                    </v-col>
                </v-row>

                <v-row class="mt-6" align="baseline" dense>
                    <v-col cols="12" lg="auto">
                        <label class="body-2">Pregnancy Term <span class="red--text"> *</span></label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-select v-model="obg_data_.pregnancy_term" :items="pregnancy_term_items" :error="empty_.delivery && !obg_data_.pregnancy_term" @change="mutationStatus" class="body-2" hide-details clearable outlined dense></v-select>
                    </v-col>
                </v-row>

                <v-row class="mt-6" align="center" dense>
                    <v-col cols="12" lg="auto">
                        <label class="body-2">Live Birth <span class="red--text"> *</span></label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-radio-group v-model="obg_data_.is_live_birth" :error="empty_.delivery && !obg_data_.is_live_birth" @change="mutationStatus" class="ma-0" hide-details row>
                            <v-radio label="Yes" value="1"></v-radio>
                            <v-radio label="No" value="0"></v-radio>
                            <v-btn v-if="editable_ && obg_data_.is_live_birth" @click="obg_data_.is_live_birth = '', mutationStatus()" class="mr-4" x-small>CLEAR</v-btn>
                        </v-radio-group>
                    </v-col>
                </v-row>

                <v-row class="mt-6" align="center" dense>
                    <v-col cols="12" lg="auto">
                        <label class="body-2">Abortion/Miscarriage <span class="red--text"> *</span></label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-radio-group v-model="obg_data_.is_abortion_or_miscarriage" :error="empty_.delivery && !obg_data_.is_abortion_or_miscarriage" @change="mutationStatus" class="ma-0" hide-details row>
                            <v-radio label="Yes" value="1"></v-radio>
                            <v-radio label="No" value="0"></v-radio>
                            <v-btn v-if="editable_ && obg_data_.is_abortion_or_miscarriage" @click="obg_data_.is_abortion_or_miscarriage = '', mutationStatus()" class="mr-4" x-small>CLEAR</v-btn>
                        </v-radio-group>
                    </v-col>
                </v-row>
            </v-card>
            
            <!-- <h6 class="font-weight-regular blue darken-3 text-center white--text title py-2">Pregnancy History</h6>

            <v-card class="pa-7 mb-6" outlined>
                <v-data-table :headers="tbl_headers" :items="tbl_items" :search="tbl_search" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :items-per-page="5" class="elevation-2" mobile-breakpoint="0"></v-data-table>

                <v-row class="mt-6" align="center" dense>
                    <v-col cols="12" lg="auto">
                        <label class="body-2">History of Ectopic Pregnancy</label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-radio-group v-model="obg_data_.has_history_of_ectopic_pregnancy" @change="mutationStatus" class="ma-0" hide-details row>
                            <v-radio label="Yes" value="1"></v-radio>
                            <v-radio label="No" value="0"></v-radio>
                            <v-btn v-if="editable_ && obg_data_.has_history_of_ectopic_pregnancy" @click="obg_data_.has_history_of_ectopic_pregnancy = null, mutationStatus()" class="mr-4" x-small>CLEAR</v-btn>
                        </v-radio-group>
                    </v-col>
                </v-row>

                <v-row class="mt-6" align="center" dense>
                    <v-col cols="12" lg="auto">
                        <label class="body-2">Previous Complications</label>
                    </v-col>

                    <v-col class="d-flex" cols="12" lg="auto">
                        <v-checkbox v-model="obg_data_.previous_complication" @change="mutationStatus" class="ma-0 mx-4" label="Hemorrhage" value="Hemorrhage" hide-details></v-checkbox>
                        <v-checkbox v-model="obg_data_.previous_complication" @change="mutationStatus" class="ma-0 mx-4" label="HPV" value="HPV" hide-details></v-checkbox>
                        <v-checkbox v-model="obg_data_.previous_complication" @change="mutationStatus" class="ma-0 mx-4" label="Placenta Previa / Abruptio" value="Placenta Previa / Abruptio" hide-details></v-checkbox>
                        <v-checkbox v-model="obg_data_.previous_complication" @change="mutationStatus" class="ma-0 mx-4" label="Sepsis" value="Sepsis" hide-details></v-checkbox>
                        <v-checkbox v-model="obg_data_.previous_complication" @change="mutationStatus" class="ma-0 mx-4" label="Diabetes Mellitus" value="Diabetes Mellitus" hide-details></v-checkbox>
                    </v-col>
                </v-row>

                <label class="font-weight-medium body-1 d-block mt-6 mb-2">New GPTPAL</label>
                <v-row align="baseline" dense>
                    <v-col cols="12" lg="auto">
                        <label class="body-2">Gravidity</label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-text-field v-model="obg_data_.obg_gravidity" @blur="mutationStatus" class="body-2" hide-details dense></v-text-field>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <label class="body-2">Parity</label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-text-field v-model="obg_data_.obg_parity" @blur="mutationStatus" class="body-2" hide-details dense></v-text-field>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <label class="body-2">Term Birth</label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-text-field v-model="obg_data_.obg_term" @blur="mutationStatus" class="body-2" hide-details dense></v-text-field>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <label class="body-2">Premature</label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-text-field v-model="obg_data_.obg_preterm" @blur="mutationStatus" class="body-2" hide-details dense></v-text-field>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <label class="body-2">Abortion</label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-text-field v-model="obg_data_.obg_abortions" @blur="mutationStatus" class="body-2" hide-details dense></v-text-field>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <label class="body-2">Living Children</label>
                    </v-col>

                    <v-col cols="12" lg="auto">
                        <v-text-field v-model="obg_data_.obg_living" @blur="mutationStatus" class="body-2" hide-details dense></v-text-field>
                    </v-col>
                </v-row>
            </v-card> -->
        </v-form>

        <Alert :alert="alert" @clearAllData="clearAllData" />

        <BMICalculationController ref="BMICalculationController" />
    </v-card>
</template>

<script>
import Alert from '@/components/Alert.vue'
import BMICalculationController from '@/controller/BMICalculationController.vue'

export default {
    props: ['editable_', 'obg_data_', 'disable_tab_', 'empty_','from_migration'],

    components: {
        Alert,
        BMICalculationController
    },

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
     
            type_of_delivery_items: ['Normal Spontaneous Delivery', 'Cesarean Section'],
            place_of_delivery_items: ['Public', 'Private', 'Non-Facility Based'],
            attended_by_items: ['Doctor', 'Midwives', 'Nurse', 'Hilot/TBA', 'Others'],
            pregnancy_term_items: ['Full-term', 'Fetal Death', 'Pre-term', 'Others'],
            alert: {},
            landscape: false
        }
    },

    computed: {
        formatted_time() {
            const time = this.obg_data_.time_of_delivery;
            if (!time) return ''; 

            const [hours, minutes] = time.split(':');
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);

            return date.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        },
    },

    methods: {
        clearDateOfDelivery() {
            const length = this.obg_data_.postpartum.filter(element => element.no_of_visit)

            if (this.obg_data_.nsd_cs || 
            this.obg_data_.place_of_delivery ||
            this.obg_data_.time_of_delivery || 
            this.obg_data_.attended_by ||
            this.obg_data_.bo_sex ||
            this.obg_data_.bo_length || 
            this.obg_data_.bo_birth_weight || 
            this.obg_data_.bo_head_circumference || 
            this.obg_data_.pregnancy_term || 
            this.obg_data_.is_live_birth || 
            this.obg_data_.is_abortion_or_miscarriage || 
            length.count > 0) {
                this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'red', title: 'All data under Delivery and Postpartum will be deleted.', body: 'Delivery data is required to be proceed to Postpartum Information.', btn_pry_txt: 'CONTINUE', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'clearAllData', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
            } else {
                this.obg_data_.date_of_delivery = ''
                this.obg_data_.time_of_delivery = ''
            }
        },

        clearAllData() {
            this.$refs.delivery.reset();

            const count = this.obg_data_.postpartum.filter(element => element.no_of_visit)

            if (count.length > 0) {
                this.clearPostpartum();
            }
        },

        clearPostpartum() {
            this.obg_data_.postpartum = []
            this.obg_data_.date_of_delivery = ''
            this.obg_data_.time_of_delivery = ''
            this.obg_data_.postpartum.push(
                {
                    no_of_visit: '',
                    lmp: '',
                    pmp: '',
                    contraceptive: '',
                    method: '',
                    is_unmeet: ''
                },
                {
                    no_of_visit: '',
                    lmp: '',
                    pmp: '',
                    contraceptive: '',
                    method: '',
                    is_unmeet: ''
                }
            )
            
            this.mutationStatus();
        },

        computeBMI() {
            this.obg_data_.weight_for_age = this.$refs.BMICalculationController.getWeightForAge(this.obg_data_.date_of_delivery, this.obg_data_.bo_birth_weight, this.obg_data_.bo_sex);
            this.obg_data_.height_for_age = this.$refs.BMICalculationController.getHeightForAge(this.obg_data_.date_of_delivery, this.obg_data_.bo_length, this.obg_data_.bo_sex);
            this.obg_data_.weight_for_height = this.$refs.BMICalculationController.getWeightForHeight(this.obg_data_.date_of_delivery, this.obg_data_.bo_length, this.obg_data_.bo_birth_weight, this.obg_data_.bo_sex);

            this.mutationStatus();
        },

        mutationStatus() {
            if (this.obg_data_.nsd_cs || 
            this.obg_data_.place_of_delivery || 
            this.obg_data_.time_of_delivery ||
            this.obg_data_.attended_by || 
            this.obg_data_.bo_sex ||
            this.obg_data_.bo_length || 
            this.obg_data_.bo_birth_weight || 
            this.obg_data_.bo_head_circumference || 
            this.obg_data_.pregnancy_term || 
            this.obg_data_.is_live_birth || 
            this.obg_data_.is_abortion_or_miscarriage) {
                this.empty_.delivery = true

                if (this.obg_data_.nsd_cs && 
                this.obg_data_.place_of_delivery && 
                this.obg_data_.time_of_delivery &&
                this.obg_data_.attended_by && 
                this.obg_data_.bo_sex &&
                this.obg_data_.bo_length && 
                this.obg_data_.bo_birth_weight && 
                this.obg_data_.bo_head_circumference && 
                this.obg_data_.pregnancy_term && 
                this.obg_data_.is_live_birth && 
                this.obg_data_.is_abortion_or_miscarriage) {
                    this.disable_tab_.postpartum = false
                    this.empty_.delivery = false
                } else {
                    this.disable_tab_.postpartum = true
                }
            } else {
                this.empty_.delivery = false
            }

            this.$emit('mutationStatus')
        }
    }
}
</script>