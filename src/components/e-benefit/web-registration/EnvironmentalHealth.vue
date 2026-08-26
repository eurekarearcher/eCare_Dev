<template>
  <div>
    <v-card class="mx-auto mb-5" width="880" >
        <div class="py-4 primary white--text text-center">
        <h4><v-icon size="18" left dark>fas fa-hand-holding-medical</v-icon>Questionnaire for Environmental Health and Sanitation Services <br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic">(Pampananaliksik para sa serbisyong pangkalusugan ng kapaligiran at sanitasyon)</span></h4>
        </div>
        <v-form @submit.prevent="proceedNextStep" class="pa-7">
            <v-row dense>
                <v-col cols="12" sm="12" md="12" lg="12"> 
                    <div class="d-flex justify-space-between align-baseline">
                        <h5 class="font-weight-medium mr-4"> 1. Does your household have access to basic safe water supply? <br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic">(Mayroon bang access ang iyong tahanan sa pangunahing ligtas <br> na suplay ng tubig?)</span></h5>
                        <v-radio-group v-model="level" class="ml-8"  hide-details row>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-radio value="1" label="Level 1" v-on="on"></v-radio>
                                </template>
                                <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)">Tubig galing balon, ilog at ulan</span>
                                <span v-else>Point Source (well, protected spring and Rainwater collection)</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-radio value="2" label="Level 2" v-on="on"></v-radio>
                                </template>
                                <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)">Isang pang-publikong gripo sa komunidad na para sa 4-6 na bahay o pamilya</span>
                                <span v-else>Communal Faucet System or Standposts (Public Faucet for 4-6 Household)</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-radio value="3" label="Level 3" v-on="on"></v-radio>
                                </template>
                                <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)">Pribadong tubig o pang sariling bahay lamang</span>
                                <span v-else>Waterworks System or individual House Connections</span>
                            </v-tooltip>
                        </v-radio-group>
                    </div>                    
                </v-col>
            </v-row>

            <v-row dense> 
                <v-col cols="12" sm="12" md="12" lg="12"> 
                    <div class="d-flex justify-space-between align-baseline">
                        <h5 class="font-weight-medium mr-4"> 2. Does your household have basic sanitation facility? <br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic">(Mayroon ba kayong pangunahing pasilidad sa sanitasyon ang inyong tahanan?)</span></h5>
                    </div>
                    <div class="pl-4">
                        <div class="d-flex justify-space-between align-baseline">
                            <h5 class="font-weight-medium mr-4"> a. Does your household pour/flush toilet connected to septic tank? <br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic">(Ang inyong tahanan ba ay may inidoro na konektado sa septic tank at nag-aanod?)</span></h5>
                            <v-radio-group v-model="flush_toilet_septic_tank" class="ml-8"  hide-details row>
                                <v-radio value="1" label="Yes"></v-radio>
                                <v-radio value="0" label="No"></v-radio>
                            </v-radio-group>
                        </div>
                        <div class="d-flex justify-space-between align-baseline">
                            <h5 class="font-weight-medium mt-4" style="width: 550px;"> b. Does your household have pour/flush toilet connected to community sewer/sewerage system or any other approved treatment system? 
                                <br> <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic">(Nagmamay-ari ba kayo ng inidoro na may pangbanlaw na konektado sa komunidad na kanal ng basura o sistema ng paglilinis, o anumang iba pang aprubadong sistema ng paglilinis?)</span></h5>
                            <v-radio-group v-model="flush_toilet_sewer" class="ml-8"  hide-details row>
                                <v-radio value="1" label="Yes"></v-radio>
                                <v-radio value="0" label="No"></v-radio>
                            </v-radio-group>
                        </div>
                        <div class="d-flex justify-space-between align-baseline">
                            <h5 class="font-weight-medium mr-4"> c. Does your household have ventilated improved pit latrine <br>
                            <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic">(Mayroon ba kayong sistemang kubeta na may magandang sirkulasyon ng hangin sa inyong tahanan?)</span></h5>
                            <v-radio-group v-model="vip" class="ml-8"  hide-details row>
                                <v-radio value="1" label="Yes"></v-radio>
                                <v-radio value="0" label="No"></v-radio>
                            </v-radio-group>
                        </div>
                    </div>
                </v-col>
            </v-row>

            <v-row dense> 
                <v-col cols="12" sm="12" md="12" lg="12"> 
                    <div class="d-flex justify-space-between align-baseline">
                        <h5 class="font-weight-medium mr-3"> 3. Does your household industrial establishment issued with sanitary permit? <br>
                        <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic">(Nakapaglabas na ba ang inyong sambahayan o industriyang establisyamento ng permiso pang-sanitaryo?)</span></h5>
                        <v-radio-group v-model="issued_sanitary_permit" class="ml-8"  hide-details row>
                            <v-radio value="1" label="Yes"></v-radio>
                            <v-radio value="0" label="No"></v-radio>
                        </v-radio-group>
                    </div>
                </v-col>
            </v-row>

            <v-card-actions class="justify-end px-5 pt-8 pb-5">
                <v-btn type="submit" color="primary" class="px-7 elevation-0" outlined>Skip</v-btn>    
                <v-btn type="submit" class="primary elevation-0 px-5" :loading="loading_btn">Continue</v-btn>
            </v-card-actions>

        </v-form>
    </v-card>

    <Alert :alert="alert" />
  </div>
</template>

<script>
import Alert from '@/components/Alert'

export default {
    components: {
        Alert
    },

    data() {
        return {
            loading_btn: false,

            level: '',
            flush_toilet_septic_tank: '',
            flush_toilet_sewer: '',
            vip: '',
            issued_sanitary_permit: '',

            alert: {},
            get_session: {}
        }
    },

    mounted() {
        this.getSessionData();
    },

    methods: {
        getSessionData() {
            this.get_session = sessionStorage.getItem("9xgF732sfgh") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("9xgF732sfgh"), "njGHDdd").toString(this.$crypto.enc.Utf8) ) : {}
        },
        
        async proceedNextStep() {
            this.loading_btn = true
            if(!this.get_session.add_member_household) {
                let response = await this.$services.trnAddM1EnvironmentalHealth({
                    ek_lgu_id: this.get_session.ek_lgu_id,
                    provider_code: this.$store.state.prv_data.provider_code,
                    level: this.level,
                    flush_toilet_septic_tank: this.flush_toilet_septic_tank,
                    flush_toilet_sewer: this.flush_toilet_sewer,
                    vip: this.vip,
                    issued_sanitary_permit: this.issued_sanitary_permit,
                })

                if(response.status === 200) {
                    this.loading_btn = false
                    if(!response.data.success) {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'yellow', title: 'Something went wrong!', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                } else {
                    this.alert = response.error
                }
            } 

            sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(this.get_session), 'njGHDdd'))
            this.$emit('change-step', 4)

        },

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if((event.which < 48 || event.which > 57)){
                event.preventDefault();
            }
        },

        //SUBMIT ENVIRONMENTAL HEALTH AND SANITATION SERVICES
        // submitEnvironmentalHealth() {
        //     if(this.$refs.validation_form.validate()) {
        //         this.loading_btn = true

        //         return this.$axios.post(this.$tms_url +"resources/controller/trn_add_m1_envr_health.php", this.$qs.stringify({
        //             post_data: this.wsDataEncryption(JSON.stringify({
        //                 provider_code: this.$store.state.prv_data.provider_code,
        //                 safe_water_supply: this.safe_water_supply,
        //                 level: this.level,
        //                 basic_sanitation: this.basic_sanitation,
        //                 flush_toilet_septic_tank: this.flush_toilet_septic_tank,
        //                 flush_toilet_sewer: this.flush_toilet_sewer,
        //                 vip: this.vip,
        //                 issued_sanitary_permit: this.issued_sanitary_permit,
        //             }))
        //         })).then((response) => {
        //             this.loading_btn = false

        //             if(response.data.success) {
        //                 this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-check-circle', color: 'success', title: 'Environmental Health and Sanitation Services', body: 'Submitted Successfully', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
        //             } else {
        //                 this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow', title: 'Environmental Health and Sanitation Services', body: 'Data already been submitted', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
        //             }
        //         }).catch(error => {
        //             this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //         });
        //     }

        // }
    }
}
</script>

<style scoped>
.ehss-input {
    width: 120px;
}
</style>