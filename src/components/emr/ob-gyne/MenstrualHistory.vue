<template>
    <v-card class="pa-7" outlined>
        <v-form :disabled="!editable_ || disable_tab_.menstrual_history">
            <v-row align="baseline" dense>
                <!-- Menarche -->
                <v-col cols="12" lg="auto">
                    <div class="d-flex flex-column">
                        <div class="body-2">
                            <span :class="{'label-opacity': disable_tab_.menstrual_history}">Menarche <span class="red--text"> *</span></span>
                        </div>

                        <div class="d-flex align-center">
                            <v-text-field v-model="obg_data_.m" :error="empty_.menstrual_history && !obg_data_.m" @blur="mutationStatus" @keypress="numberOnly" class="body-2" hide-details dense/>
                            <span :class="{'label-opacity': disable_tab_.menstrual_history}" class="ml-1 body-2 mt-4">years old</span>
                        </div>
                    </div>
                </v-col>

                <!-- <v-col cols="12" lg="auto">
                    <label :class="{'label-opacity' : disable_tab_.menstrual_history}" class="body-2">Menarche</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-text-field v-model="obg_data_.m" :error="empty_.menstrual_history && !obg_data_.m" @blur="mutationStatus" @keypress="numberOnly" class="body-2" hide-details dense></v-text-field>
                </v-col>

                <v-col cols="12" lg="auto">
                    <label :class="{'label-opacity' : disable_tab_.menstrual_history}" class="body-2">years old</label>
                </v-col> -->

                <!--Menstrual Selection--->
                <v-col cols="12" lg="auto">
                    <div class="d-flex flex-column">
                        <div class="body-2">
                            <span :class="{'label-opacity': disable_tab_.menstrual_history}">Menstrual Cycle<span class="red--text"> *</span></span>
                        </div>

                        <div class="d-flex align-center">
                            <v-select v-model="obg_data_.mens_cycle" :items="mens_items" :error="empty_.menstrual_history && !obg_data_.mens_cycle" @change="mutationStatus" class="body-2" hide-details clearable outlined dense></v-select>
                        </div>
                    </div>
                </v-col>

                <!-- <v-col cols="12" lg="auto">
                    <label :class="{'label-opacity' : disable_tab_.menstrual_history}" class="body-2 pl-4">Menstrual Type</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-select v-model="obg_data_.mens_cycle" :items="mens_items" :error="empty_.menstrual_history && !obg_data_.mens_cycle" @change="mutationStatus" class="body-2" hide-details clearable outlined dense></v-select>
                </v-col> -->

                <!-- Interval -->
                <v-col cols="12" lg="auto">
                    <div class="d-flex flex-column">
                        <div class="body-2">
                            <span :class="{'label-opacity': disable_tab_.menstrual_history}">Interval<span class="red--text"> *</span></span>
                        </div>

                        <div class="d-flex align-center">
                            <v-text-field v-model="obg_data_.i" :disabled="obg_data_.mens_cycle !== 'Regular'" :error="empty_.menstrual_history && !obg_data_.i" @keypress="numberOnly" @blur="mutationStatus" class="body-2" onpaste="return false" hide-details dense></v-text-field>
                            <span :class="{'label-opacity': disable_tab_.menstrual_history}" class="ml-1 body-2 mt-4">days</span>
                        </div>
                    </div>
                </v-col>
                <!-- <v-col cols="12" lg="auto">
                    <label :class="{'label-opacity' : disable_tab_.menstrual_history}" class="body-2 pl-4">Interval</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-text-field v-model="obg_data_.i" :error="empty_.menstrual_history && !obg_data_.i" @keypress="numberOnly" @blur="mutationStatus" class="body-2" onpaste="return false" hide-details dense></v-text-field>
                </v-col>

                <v-col cols="12" lg="auto">
                    <label :class="{'label-opacity' : disable_tab_.menstrual_history}" class="body-2">days</label>
                </v-col> -->
                
                <!-- Duration -->
                <v-col cols="12" lg="auto">
                    <div class="d-flex flex-column">
                        <div class="body-2">
                            <span :class="{'label-opacity': disable_tab_.menstrual_history}">Duration<span class="red--text"> *</span></span>
                        </div>

                        <div class="d-flex align-center">
                            <v-text-field v-model="obg_data_.d" :error="empty_.menstrual_history && !obg_data_.d" @keypress="numberOnly" @blur="mutationStatus" class="body-2" onpaste="return false" hide-details dense></v-text-field>
                            <span :class="{'label-opacity': disable_tab_.menstrual_history}" class="ml-1 body-2 mt-4">days</span>
                        </div>
                    </div>
                </v-col>

                <!-- <v-col cols="12" lg="auto">
                    <label :class="{'label-opacity' : disable_tab_.menstrual_history}" class="body-2 pl-4">Duration</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-text-field v-model="obg_data_.d" :error="empty_.menstrual_history && !obg_data_.d" @keypress="numberOnly" @blur="mutationStatus" class="body-2" onpaste="return false" hide-details dense></v-text-field>
                </v-col>

                <v-col cols="12" lg="auto">
                    <label :class="{'label-opacity' : disable_tab_.menstrual_history}" class="body-2">days</label>
                </v-col> -->
                
                <!-- Amount -->
                <v-col cols="12" lg="auto">
                    <div class="d-flex flex-column">
                        <div class="body-2">
                            <span :class="{'label-opacity': disable_tab_.menstrual_history}">Amount<span class="red--text"> *</span></span>
                        </div>

                        <div class="d-flex align-center">
                            <v-select v-model="obg_data_.a" :items="amount_items" :error="empty_.menstrual_history && !obg_data_.a" @change="mutationStatus" class="body-2" hide-details clearable outlined dense></v-select>
                        </div>
                    </div>
                </v-col>
                <!-- <v-col cols="12" lg="auto">
                    <label :class="{'label-opacity' : disable_tab_.menstrual_history}" class="body-2 pl-4">Amount</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-select v-model="obg_data_.a" :items="amount_items" :error="empty_.menstrual_history && !obg_data_.a" @change="mutationStatus" class="body-2" hide-details clearable outlined dense></v-select>
                </v-col> -->
            </v-row>

            <v-row align="baseline" dense>
                <v-col cols="12" lg="auto">
                    <v-radio-group v-model="obg_data_.s" @change="mutationStatus" class="ma-0 mt-4" hide-details row>
                        <label class="body-2 mr-4">Symptoms</label>
                        <v-radio label="Dysmenorrhea" value="Dysmenorrhea"></v-radio>
                        <v-radio label="No Dysmenorrhea" value="No Dysmenorrhea"></v-radio>
                        <v-btn v-if="editable_ && !disable_tab_.menstrual_history && obg_data_.s" @click="obg_data_.s = '', mutationStatus()" x-small>CLEAR</v-btn>
                    </v-radio-group>
                </v-col>
            </v-row>
            
            <v-row align="baseline" dense>
                <!---LAST MENSTRUAL PERIOD---->
                <v-col cols="12" sm="6" md="6" lg="3">
                    <div class="d-flex flex-column">
                        <div class="body-2">
                            <span :class="{'label-opacity': disable_tab_.menstrual_history}">Last Menstrual Period<span class="red--text"> *</span></span>
                        </div>

                        <div class="d-flex align-center">
                            <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" :value="formatDate(obg_data_.lmp)" :error="empty_.menstrual_history && !obg_data_.lmp" @focus="current_lmp = obg_data_.lmp" class="body-2 pr-2" label="Date" prepend-inner-icon="mdi-calendar" hide-details>
                                        <template v-slot:append>
                                            <v-icon v-if="editable_ && !disable_tab_.menstrual_history && obg_data_.lmp" @click="checkScreeningStatus('clear')">mdi-close</v-icon>
                                        </template>
                                    </v-text-field>
                                </template>

                                <v-date-picker v-model="obg_data_.lmp" :min="patient_birthdate" :max="dateToday()" @change="checkScreeningStatus" no-title></v-date-picker>
                            </v-menu>
                        </div>
                    </div>
                </v-col>

                <!-- <v-col cols="12" lg="auto">
                    <label :class="{'label-opacity' : disable_tab_.menstrual_history}" class="body-2">Last Menstrual Period</label>
                </v-col>
                <v-col cols="12" lg="2">
                    <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" :value="formatDate(obg_data_.lmp)" :error="empty_.menstrual_history && !obg_data_.lmp" @focus="current_lmp = obg_data_.lmp" class="body-2 pr-2" label="Date" prepend-inner-icon="mdi-calendar" hide-details>
                                <template v-slot:append>
                                    <v-icon v-if="editable_ && !disable_tab_.menstrual_history && obg_data_.lmp" @click="checkScreeningStatus('clear')">mdi-close</v-icon>
                                </template>
                            </v-text-field>
                        </template>

                        <v-date-picker v-model="obg_data_.lmp" :min="patient_birthdate" :max="dateToday()" @change="checkScreeningStatus" no-title></v-date-picker>
                    </v-menu>
                </v-col> -->

                <!---PREVIOUS MENSTRUAL PERIOD---->
                <v-col cols="12" sm="6" md="6" lg="3">
                    <div class="d-flex flex-column">
                        <div class="body-2">
                            <span :class="{'label-opacity': disable_tab_.menstrual_history}">Previous Menstrual Period<span class="red--text"> *</span></span>
                        </div>

                        <div class="d-flex align-center">
                            <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" :value="formatDate(obg_data_.pmp)" :error="empty_.menstrual_history && !obg_data_.pmp" @click:clear="obg_data_.pmp = '', mutationStatus()" class="body-2" label="Date" prepend-inner-icon="mdi-calendar" hide-details clearable></v-text-field>
                                </template>

                                <v-date-picker v-model="obg_data_.pmp" :min="patient_birthdate" :max="dateToday()" @change="mutationStatus" no-title></v-date-picker>
                            </v-menu>
                        </div>
                    </div>
                </v-col>

                <!-- <v-col cols="12" lg="auto">
                    <label :class="{'label-opacity' : disable_tab_.menstrual_history}" class="body-2">Previous Menstrual Period</label>
                </v-col>

                <v-col cols="12" lg="2">
                    <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" :value="formatDate(obg_data_.pmp)" :error="empty_.menstrual_history && !obg_data_.pmp" @click:clear="obg_data_.pmp = '', mutationStatus()" class="body-2 pr-2" label="Date" prepend-inner-icon="mdi-calendar" hide-details clearable></v-text-field>
                        </template>

                        <v-date-picker v-model="obg_data_.pmp" :min="patient_birthdate" :max="dateToday()" @change="mutationStatus" no-title></v-date-picker>
                    </v-menu>
                </v-col> -->

                <!---AGE OF FIRST SEXUAL INTERCOURSE---->
                <v-col cols="12" sm="6" md="6" lg="3">
                    <div class="d-flex flex-column">
                        <div class="body-2">
                            <span :class="{'label-opacity': disable_tab_.menstrual_history}">Age of First Sexual Intercourse</span>
                        </div>

                        <div class="d-flex align-center">
                            <v-text-field maxlength="2" v-model="obg_data_.si" @blur="mutationStatus" @keypress="numberOnly" class="body-2 si" hide-details dense></v-text-field>
                        </div>
                    </div>
                </v-col>

                <!-- <v-col cols="12" lg="auto">
                    <label :class="{'label-opacity' : disable_tab_.menstrual_history}" class="body-2">Age of First Sexual Intercourse</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-text-field maxlength="2" v-model="obg_data_.si" @blur="mutationStatus" @keypress="numberOnly" class="body-2" hide-details dense></v-text-field>
                </v-col> -->

                <!---AGE OF MENOPAUSE---->
                <v-col cols="12" sm="6" md="6" lg="3">
                    <div class="d-flex flex-column">
                        <div class="body-2">
                            <span :class="{'label-opacity': disable_tab_.menstrual_history}">Age of Menopause</span>
                        </div>

                        <div class="d-flex align-center">
                            <v-text-field maxlength="2" v-model="obg_data_.mp" @blur="mutationStatus" @keypress="numberOnly" class="body-2 mp" hide-details dense></v-text-field>
                        </div>
                    </div>
                </v-col>

                <!-- <v-col cols="12" lg="auto">
                    <label :class="{'label-opacity' : disable_tab_.menstrual_history}" class="body-2">Age of Menopause</label>
                </v-col>

                <v-col cols="12" lg="auto">
                    <v-text-field maxlength="2" v-model="obg_data_.mp" @blur="mutationStatus" @keypress="numberOnly" class="body-2" hide-details dense></v-text-field>
                </v-col> -->
            </v-row>
        </v-form>
        
        <Alert :alert="alert" @clearScreeningData="clearScreeningData" @returnCurrentLMP="returnCurrentLMP" />
    </v-card>
</template>

<script>
import Alert from '@/components/Alert.vue'

export default {
    props: ['editable_', 'obg_data_', 'disable_tab_', 'empty_', 'change_status_', 'patient_birthdate','from_migration'],
    
    components: {
        Alert
    },

    data() {
        return {
            amount_items: ['Heavy (more than 5 pads per day)', 'Moderate (3-5 pads per day)', 'Scanty (1-2 pads per day)'],
            mens_items: ['Regular', 'Irregular'],
            current_lmp: '',
            alert: {}
        }
    },

    methods: {
        setEDBAndAOG() {
            const current_date = new Date()
            const lmp = new Date(this.obg_data_.lmp)
            const aog = Math.round((current_date - lmp) / (7 * 24 * 60 * 60 * 1000));
            this.obg_data_.aog = `${aog} week(s)`
            this.obg_data_.edb = this.$moment(this.obg_data_.lmp).add(7, 'days').subtract(3, 'months').add(1, 'year').format('MMMM D, YYYY')
        },

        checkScreeningStatus(status) {
            if (this.obg_data_.screening.length > 0 && this.change_status_.screening) {
                if (status === 'clear') {
                    this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'red', title: 'All Screening will be cleared.', body: 'Do you want to continue?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'clearScreeningData', btn_pry_params: status, btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
                } else {
                    this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'red', title: 'All Screening dated beyond LMP will be cleared.', body: 'Do you want to continue?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'clearScreeningData', btn_pry_params: status, btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert', btn_sec_emt: 'returnCurrentLMP' }
                }
            } else {
                if (status === 'clear') this.obg_data_.lmp = ''
                this.setEDBAndAOG();
            }

            this.mutationStatus();
        },

        clearScreeningData(status) {
            if (status === 'clear') {
                this.obg_data_.lmp = ''
                this.obg_data_.screening = []
            } else {
                this.obg_data_.screening = this.obg_data_.screening.filter(element => {
                    const screening_date = new Date(element.screening_date)
                    const lmp = new Date(this.obg_data_.lmp)
                    return screening_date >= lmp
                })
                
                this.setEDBAndAOG();
            }

            this.$emit('refreshScreening');
            this.mutationStatus();
        },

        returnCurrentLMP() {
            this.obg_data_.lmp = this.current_lmp
            this.setEDBAndAOG();
        },

        numberOnly(event) {
            if ((event.which < 48 || event.which > 57) && event.which !== 45) {
                event.preventDefault();
            }
        },

        // mutationStatus() {
        //     if (this.obg_data_.m || this.obg_data_.mens_cycle || this.obg_data_.d || this.obg_data_.a  || this.obg_data_.lmp || this.obg_data_.pmp) {
        //         this.empty_.menstrual_history = true
        //         if(this.obg_data_.mens_cycle === 'Irregular' && this.obg_data_.i){
        //             this.empty_.menstrual_history = true
        //         } 

        //         if (this.obg_data_.m && this.obg_data_.mens_cycle && this.obg_data_.i && this.obg_data_.d && this.obg_data_.a  && this.obg_data_.lmp && this.obg_data_.pmp) {
        //             if (!this.obg_data_.pregnancy_term) {
        //                 this.disable_tab_.prenatal = false
        //                 this.disable_tab_.delivery = false
        //             }

        //             this.empty_.menstrual_history = false
        //         } else {
        //             this.disable_tab_.prenatal = true
        //             this.disable_tab_.delivery = true
        //         }
        //     } else {
        //         this.empty_.menstrual_history = false
        //     }

        //     this.$emit('mutationStatus')
        // }

        mutationStatus() {
            if (this.obg_data_.m || this.obg_data_.mens_cycle || this.obg_data_.d || this.obg_data_.a || this.obg_data_.lmp || this.obg_data_.pmp) {
                this.empty_.menstrual_history = true;

                // If Irregular and 'i' is empty, keep it true
                if (this.obg_data_.mens_cycle === 'Regular' && !this.obg_data_.i) {
                    this.empty_.menstrual_history = true;
                }

                if (this.obg_data_.m && this.obg_data_.mens_cycle && this.obg_data_.d && this.obg_data_.a && this.obg_data_.lmp && this.obg_data_.pmp && (this.obg_data_.mens_cycle !== 'Regular' || this.obg_data_.i)) {
                    this.empty_.menstrual_history = false;

                    if (!this.obg_data_.pregnancy_term) {
                        this.disable_tab_.prenatal = false;
                        this.disable_tab_.delivery = false;
                    }
                } else {
                    this.disable_tab_.prenatal = true;
                    this.disable_tab_.delivery = true;
                }
            } else {
                this.empty_.menstrual_history = false;
            }

            this.$emit('mutationStatus');
        }
    }
}
</script>

<style scoped>
.label-opacity {
    opacity: 0.4 !important;
}

.si , .mp{
    margin-top: 1.4rem;
}
</style>