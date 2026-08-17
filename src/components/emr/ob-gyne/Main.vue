<template>
    <v-card class="card-border pa-7 mt-4" outlined>
        <v-layout v-show="loading_data" class="my-14" justify-center align-center>
            <v-progress-circular color="primary" size="30" indeterminate></v-progress-circular>
            <h5 class="font-weight-medium light-blue--text text--darken-4 body-2 pl-5">Loading Data... Please wait...</h5>
        </v-layout>

        <div v-if="!loading_data" class="pl-sm-4 pl-0">
            <v-row>
                <v-col cols="12" md="auto" lg="auto">
                    <v-radio-group v-model="obg_data.data.menopause" :disabled="obg_data.disable_tab.menstrual_history" @change="changeMenopause" class="ma-0" hide-details row>
                        <label class="font-weight-medium mr-4">Menopause</label>
                        <v-radio label="Yes" value="1"></v-radio>
                        <v-radio label="No" value="0"></v-radio>
                    </v-radio-group>
                </v-col>

                <v-col cols="12" md="auto" lg="auto">
                    <v-radio-group v-model="obg_data.data.ob_gyne" :error-messages="required_ob ? 'OB/GYEN Required' : null " :error="obg_data.data.ob_gyne === '' || obg_data.data.ob_gyne === null ? required_fields : required_ob" :disabled="obg_data.disable_tab.menstrual_history || obg_data.data.menopause !== '0' || disable_ob_gyne" @change="changeOBGyne" class="ma-0" hide-details row>
                        <label class="font-weight-medium mr-4">OB / Gyn <span class="red--text"> *</span></label>
                        <v-radio label="OB" value="OB"></v-radio>
                        <v-radio label="Gyn" value="Gyne"></v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>

            <v-tabs v-model="tab" class="mt-6" active-class="active-tab white--text" hide-slider>
                
                <v-tab class="non-active-tab">Menstrual History</v-tab>
                <v-tab class="non-active-tab">Pregnancy History</v-tab>
                <v-tab :disabled="obg_data.disable_tab.prenatal || obg_data.data.ob_gyne === 'Gyne' || obg_data.data.menopause !== '0'" class="non-active-tab">Prenatal</v-tab>
                <v-tab :disabled="obg_data.disable_tab.delivery || obg_data.data.ob_gyne === 'Gyne' || obg_data.data.menopause !== '0'" class="non-active-tab">Delivery</v-tab>
                <v-tab :disabled="obg_data.disable_tab.postpartum || obg_data.data.ob_gyne === 'Gyne' || obg_data.data.menopause !== '0'" class="non-active-tab">Postpartum</v-tab>
                <!-- <v-tab :disabled="obg_data.data.menopause !== '0' || obg_data.data.ob_gyne === 'Gyne'" class="non-active-tab">Postpartum</v-tab> -->
                <v-tab :disabled="obg_data.disable_tab.prenatal || obg_data.data.menopause !== '0'" class="non-active-tab">Family Planning</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <MenstrualHistory 
                        :editable_="emr_params.editable"
                        :obg_data_="obg_data.data"
                        :disable_tab_="obg_data.disable_tab"
                        :empty_="obg_data.empty"
                        :change_status_="obg_data.change_status"
                        :patient_birthdate="patient_birthdate"
                        :from_migration="from_migration"
                        @mutationStatus="emitData"
                        @refreshScreening="$refs.prenatal.refreshScreening()"
                        ref="menstrual_history"
                    />
                </v-tab-item>

                <v-tab-item>
                    <PregnancyHistory 
                        :obg_data_="obg_data.data"
                        :from_migration="from_migration"
                        @mutationStatus="emitData"
                    />
                </v-tab-item>

                <v-tab-item>
                    <Prenatal 
                        :editable_="emr_params.editable"
                        :obg_data_="obg_data.data"
                        :change_status_="obg_data.change_status"
                        :empty_="obg_data.empty"
                        :from_migration="from_migration"
                        @mutationStatus="emitData"
                        ref="prenatal"
                    />
                </v-tab-item>

                <v-tab-item>
                    <Delivery 
                        :editable_="emr_params.editable"
                        :obg_data_="obg_data.data"
                        :disable_tab_="obg_data.disable_tab"
                        :empty_="obg_data.empty"
                        :from_migration="from_migration"
                        @mutationStatus="emitData"
                        ref="delivery"
                    />
                </v-tab-item>

                <v-tab-item>
                    <Postpartum 
                        :editable_="emr_params.editable"
                        :obg_data_="obg_data.data"
                        :from_migration="from_migration"
                        @mutationStatus="emitData"
                    />
                </v-tab-item>
                <v-tab-item>
                    <FamilyPlanning 
                        :obg_data_="obg_data.data"
                        :from_migration="from_migration"
                        @mutationStatus="emitData"
                    />
                </v-tab-item>

            </v-tabs-items>
        </div>

        <Alert :alert="alert" />
    </v-card>
</template>

<script>
import Alert from '@/components/Alert.vue'
import MenstrualHistory from '@/components/emr/ob-gyne/MenstrualHistory.vue'
import Prenatal from '@/components/emr/ob-gyne/prenatal/Main.vue'
import Delivery from '@/components/emr/ob-gyne/Delivery.vue'
import Postpartum from '@/components/emr/ob-gyne/postpartum/Main.vue'
import PregnancyHistory from '@/components/emr/ob-gyne/PregnancyHistory.vue'
import FamilyPlanning from '@/components/emr/ob-gyne/FamilyPlanning.vue'

export default {
    props: ['emr_params', 'required_fields', 'patient_birthdate','from_migration'],

    components: {
        Alert,
        MenstrualHistory,
        Prenatal,
        Delivery,
        Postpartum,
        PregnancyHistory,
        FamilyPlanning
    },

    data() {
        return {
            // DATA
            obg_data: sessionStorage.getItem('A9FSjfkF') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('A9FSjfkF'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true,
                data: {
                    has_data: false,
                    menopause: '',
                    ob_gyne: '',

                    // Menstrual History
                    m: '',
                    mens_cycle: '',
                    i: '',
                    d: '',
                    a: '',
                    s: '',
                    lmp: '',
                    pmp: '',
                    si: '',
                    mp: '',
                    
                    // Prenatal
                    prenatal: [],
                    screening: [],
                    aog: '',
                    edb: '',

                    // Delivery
                    date_of_delivery: '',
                    time_of_delivery: '',
                    nsd_cs: '',
                    type_of_delivery: '',
                    place_of_delivery: '',
                    attended_by: '',
                    bo_sex: '',
                    bo_length: '',
                    bo_birth_weight: '',
                    bo_head_circumference: '',
                    weight_for_age: '',
                    height_for_age: '',
                    weight_for_height: '',
                    pregnancy_term: '',
                    is_live_birth: '',
                    is_abortion_or_miscarriage: '',
                    has_history_of_ectopic_pregnancy: '',
                    has_experienced_pre_eclampsia: '',
                    previous_complication: [],
                    obg_date_created: '',
                    obg_gravidity: '',
                    obg_parity: '',
                    obg_term: '',
                    obg_preterm: '',
                    obg_abortions: '',
                    obg_living: '',

                    // Postpartum
                    postpartum: [],

                    //Family Planning
                    family_planning: []
                },
                empty: {
                    menstrual_history: false,
                    delivery: false,
                    screening: false
                },
                disable_tab: {
                    menstrual_history: false,
                    prenatal: true,
                    delivery: true,
                    postpartum: true
                },
                change_status: {
                    screening: false
                }
            },
            
            disable_ob_gyne: false,
            loading_data: false,
            tab: 0,
            alert: {},
            required_ob: false
        }
    },

    mounted() {

        this.loading_data = true
        this.getObGyneHistory();

        for (let index = 0; index < 4; index++) {
            this.obg_data.data.prenatal.push({
                semester: '',
                prenatal_consul_no: '',
                date_of_consul: '',
                aog_in_weeks: ''
            })
        }
        
    },
    
    methods: {
       async getObGyneHistory() {
            if (this.obg_data.fresh_load) {
                let response = await this.$services.getTransactionEmrObGyne({
                    transaction_number: this.emr_params.transaction_number,
                    ek_lgu_id: this.emr_params.ek_lgu_id
                })

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
   
                    if ('ob_gyne' in response.data) {
                        let menopause = ''
                        response.data.ob_gyne_status === 'menopause' ? menopause = '1' : menopause = '0' 
                        const ob_gyne = response.data.ob_gyne

                        const interval = ob_gyne.i ? ob_gyne.i.split(" ") : ''
                        const duration = ob_gyne.d ? ob_gyne.d.split(" ") : ''
                        
                        response.data.ob_gyne_status === 'OB' ? ob_gyne.ob_gyne = 'OB' : ''
                        response.data.ob_gyne_status === 'GYNE' ? ob_gyne.ob_gyne = 'GYNE' : ''

                       // if (ob_gyne.lmp) menopause = '0'
                        
                        if (ob_gyne.edb) {
                            // menopause = '0'
                            
                            if (ob_gyne.pregnancy_term) {
                                this.disable_ob_gyne = true
                                ob_gyne.ob_gyne = 'OB'
                                this.obg_data.disable_tab.postpartum = false
                                this.obg_data.disable_tab.prenatal = false
                                this.obg_data.disable_tab.delivery = false
                            } else {
                                this.obg_data.disable_tab.menstrual_history = true
                                this.obg_data.disable_tab.prenatal = false
                                this.obg_data.disable_tab.delivery = false
                            }
                        }

                        let prenatal = []

                        for (let index = 0; index < 4; index++) {
                            prenatal.push({
                                semester: '',
                                prenatal_consul_no: '',
                                date_of_consul: '',
                                aog_in_weeks: ''
                            })
                        }

                        for (let index = 0; index < response.data.prenatal.length; index++) {
                            const element = response.data.prenatal[index]
                            prenatal.push(element)
                        }

                        this.obg_data.fresh_load = false
                        this.obg_data.data = {
                            has_data: true,
                            menopause: menopause,
                            ob_gyne: ob_gyne.ob_gyne,

                            // Menstrual History
                            m: ob_gyne.m,
                            mens_cycle: ob_gyne.mens_cycle,
                            i: interval ? interval[0] : null,
                            d: duration ? duration[0] : null,
                            a: ob_gyne.a,
                            s: ob_gyne.s,
                            lmp: ob_gyne.lmp,
                            pmp: ob_gyne.pmp,
                            si: ob_gyne.si,
                            mp: ob_gyne.mp,

                            // Prenatal
                            prenatal: prenatal.reverse(),
                            screening: response.data.screening,
                            edb: ob_gyne.edb,
                            aog: ob_gyne.aog,

                            // Delivery
                            date_of_delivery: ob_gyne.date_of_delivery,
                            time_of_delivery: ob_gyne.time_of_delivery,
                            nsd_cs: ob_gyne.nsd_cs,
                            type_of_delivery: ob_gyne.type_of_delivery,
                            place_of_delivery: ob_gyne.place_of_delivery,
                            attended_by: ob_gyne.attended_by,
                            bo_sex: ob_gyne.bo_sex,
                            bo_length: ob_gyne.bo_length,
                            bo_birth_weight: ob_gyne.bo_birth_weight,
                            bo_head_circumference: ob_gyne.bo_head_circumference,
                            weight_for_age: ob_gyne.weight_for_age,
                            height_for_age: ob_gyne.height_for_age,
                            weight_for_height: ob_gyne.weight_for_height,
                            pregnancy_term: ob_gyne.pregnancy_term,
                            is_live_birth: ob_gyne.is_live_birth,
                            is_abortion_or_miscarriage: ob_gyne.is_abortion_or_miscarriage,
                            has_history_of_ectopic_pregnancy: ob_gyne.has_history_of_ectopic_pregnancy,
                            has_experienced_pre_eclampsia: ob_gyne.has_experienced_pre_eclampsia,
                            previous_complication: response.data.previous_complication,
                            obg_date_created: ob_gyne.obg_date_created ? this.formatDateAndTime(ob_gyne.obg_date_created) : '--',
                            obg_gravidity: ob_gyne.obg_gravidity ? ob_gyne.obg_gravidity : 0,
                            obg_parity: ob_gyne.obg_parity ? ob_gyne.obg_parity : 0,
                            obg_term: ob_gyne.obg_term ? ob_gyne.obg_term : 0,
                            obg_preterm: ob_gyne.obg_preterm ? ob_gyne.obg_preterm : 0,
                            obg_abortions: ob_gyne.obg_abortions ? ob_gyne.obg_abortions : 0,
                            obg_living: ob_gyne.obg_living ? ob_gyne.obg_living : 0,

                            // Postpartum
                            postpartum: response.data.postpartum,

                            //Family Planning
                            family_planning: response.data.family_planning
                        }
                    }

                    this.loading_data = false
                    sessionStorage.setItem('A9FSjfkF', this.$crypto.AES.encrypt(JSON.stringify(this.obg_data), 'EMX246'))
                } else {
                    this.alert = response.error
                }
            } else {
                this.loading_data = false
            }
        },

        checkIfEmpty() {
            if (this.obg_data.data.menopause === '0' && this.obg_data.data.ob_gyne === 'OB') {
                const screening_date_empty = this.obg_data.data.screening.some(item => 
                    item.selected === 'Yes' && (!item.screening_date || item.screening_date === '')
                );

                if (this.obg_data.empty.menstrual_history || this.obg_data.empty.delivery || screening_date_empty) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (this.obg_data.data.menopause === '1') {
                    return false;
                } else {
                    if (this.obg_data.data.ob_gyne === '' || this.obg_data.data.ob_gyne === null ) {
                        this.required_ob = true;
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },

        async postData() {
            const post = this.obg_data.data
            const prenatal = post.prenatal.filter(element => !element.transaction_patient_prenatal_consultation_id && element.semester && element.date_of_consul)
            const screening = post.screening.filter(element => !element.transaction_patient_prenatal_screening_id).map(element => {
                const result = {
                    prenatal_screening_id: element.prenatal_screening_id,
                    selected: element.selected
                };

                if (element.selected === 'Yes') {
                    result.screening_date = element.screening_date;
                }

                return result;
            })

            const postpartum = post.postpartum.filter(element => !element.transaction_patient_postpartum_consultation_id && element.no_of_visit)

            const family_planning = post.family_planning

            let response = await this.$services.trnUpdatePatientTranRecord({
                request_key: 'ob_gyne_history',
                transaction_number: this.emr_params.transaction_number,
                hmo_policy_number: this.emr_params.hmo_policy_number,
                ek_lgu_id: this.emr_params.ek_lgu_id,
                ek_phic_id: this.emr_params.ek_phic_id,
                ek_hmo_id: this.emr_params.ek_hmo_id,
                lgu_host_code: this.emr_params.lgu_host_code,
                phic_host_code: this.emr_params.phic_host_code,
                hmo_host_code: this.emr_params.hmo_host_code,
                mem_phic_pin: this.emr_params.mem_phic_pin,

                ob_gyne: post.ob_gyne,
                m: post.m,
                mens_cycle: post.mens_cycle,
                i: post.i + (post.i !== null ? ' Days' : post.i),
                d: post.d + (post.d !== null ? ' Days' : post.d),
                a: post.a,
                s: post.s,
                lmp: post.lmp,
                pmp: post.pmp,
                si: post.si,
                mp: post.mp,

                prenatal_consultation: prenatal,
                prenatal_screening: screening,
                aog: post.ob_gyne === 'OB' ? post.aog : null,
                edb: post.ob_gyne === 'OB' ? (post.edb ? this.$moment(post.edb).format('YYYY-MM-DD') : '') : null,

                date_of_delivery: post.date_of_delivery,
                time_of_delivery: post.time_of_delivery,
                nsd_cs: post.nsd_cs,
                type_of_delivery: post.type_of_delivery,
                place_of_delivery: post.place_of_delivery,
                attended_by: post.attended_by,
                bo_sex: post.bo_sex,
                bo_length: post.bo_length,
                bo_birth_weight: post.bo_birth_weight,
                bo_head_circumference: post.bo_head_circumference,
                weight_for_age: post.weight_for_age,
                height_for_age: post.height_for_age,
                weight_for_height: post.weight_for_height,
                pregnancy_term: post.pregnancy_term,
                is_live_birth: post.is_live_birth,
                is_abortion_or_miscarriage: post.is_abortion_or_miscarriage,
                has_history_of_ectopic_pregnancy: post.has_history_of_ectopic_pregnancy,
                has_experienced_pre_eclampsia: post.has_experienced_pre_eclampsia,
                previous_complication: post.previous_complication,
                obg_gravidity: post.obg_gravidity,
                obg_parity: post.obg_parity,
                obg_term: post.obg_term,
                obg_preterm: post.obg_preterm,
                obg_abortions: post.obg_abortions,
                obg_living: post.obg_living,

                postpartum_consultation: postpartum,
                family_planning: family_planning,
                process_by: this.$store.state.usr_credentials.user_name
            })

            if (response.status === 200) {
                if (response.data.success) {
                    sessionStorage.removeItem('A9FSjfkF')
                    return true
                } else {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
            } else {
                this.alert = response.error
            }
        },

        changeMenopause() {
            this.obg_data.data.ob_gyne = ''
            this.changeOBGyne();
        },

        changeOBGyne() {
            if (this.obg_data.data.ob_gyne === 'OB') {
                if (this.obg_data.data.m && this.obg_data.data.i && this.obg_data.data.d && this.obg_data.data.a && this.obg_data.data.s && this.obg_data.data.lmp && this.obg_data.data.pmp) {
                    if (!this.obg_data.data.pregnancy_term) {
                        this.obg_data.disable_tab.prenatal = false
                        this.obg_data.disable_tab.delivery = false
                        this.required_ob = false
                    }
                    
                    this.$refs.menstrual_history.setEDBAndAOG();
                }
            } else {
                this.tab = 0
                this.obg_data.disable_tab.prenatal = true
                this.obg_data.disable_tab.delivery = true
            }

            this.emitData();
        },

        emitData() {
            this.$emit('mutationStatus', 'obg')
        }
    }
}
</script>

<style scoped>
.non-active-tab { 
    background-color: #eeeeee !important;
    border-color: #eeeeee !important;
    margin-right: 0.25em;
}
.active-tab { 
    background-color: #1976D2 !important;
    color: white;
}
.req{
    background-color: red !important;
}
</style>