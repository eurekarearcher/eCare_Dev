<template>
  <div>
     <v-card class="mx-auto mb-5" width="880" >
          <div class="primary white--text text-center py-4">
            <h4><v-icon size="18" left dark>fas fa-hand-holding-medical</v-icon>Questionaire for member with Diabetes</h4>
          </div>
          <v-form @submit.prevent="proceedNextStep">
            <v-col cols="12" class="px-5 mt-5">
                <h6 class="font-weight-regular body-2">Do you have a history of Diabetes? <em>(optional)</em></h6>
                <v-radio-group
                    v-model="present_of_dm"
                    row
                    >
                    <v-radio
                        label="Yes"
                        value="1"
                        :disabled="get_session.add_member_household"
                    ></v-radio>
                    <v-radio
                        label="No"
                        value="0"
                        :disabled="get_session.add_member_household"
                    ></v-radio>
                </v-radio-group>
            </v-col>

            <v-col cols="12" class="px-5" >
                <h6 class="font-weight-regular body-2">Does your family have illness history of Diabetes? <em>(optional)</em></h6>
                <v-row dense>
                    <v-col cols="6">
                        <v-radio-group
                            v-model="history_of_dm"
                            row
                            >
                            <v-radio
                                label="Yes"
                                value="1"
                                :disabled="get_session.add_member_household"
                            ></v-radio>
                            <v-radio
                                label="No"
                                value="0"
                                :disabled="get_session.add_member_household"
                            ></v-radio>
                        </v-radio-group>
                    </v-col>

                    <v-col cols="6">
                        <v-radio-group
                            v-if="history_of_dm === '1'"
                            v-model="parents"
                            row
                            >
                            <v-radio
                                label="Paternal"
                                value="Paternal"
                            ></v-radio>
                            <v-radio
                                label="Maternal"
                                value="Maternal"
                            ></v-radio>
                        </v-radio-group>
                    </v-col>
                </v-row>
            </v-col>

            <v-card-actions class="justify-end px-5 pt-3 pb-5">
                <v-btn v-if="get_session.add_member_household" type="submit" color="primary" class="px-7 elevation-0" outlined>Skip</v-btn>    
                <v-btn v-else type="submit" class="primary elevation-0 px-5" :loading="loading_btn">Continue</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>

    <Alert :alert="alert"/>
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
            get_session: {},
            present_of_dm: null,
            history_of_dm: null,
            parents: null,
            loading_btn: false,
            alert: {}
        }
    },

    mounted() {
        this.getSessionData();
    },

    methods: {
        getSessionData() {
            this.get_session = sessionStorage.getItem("9xgF732sfgh") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("9xgF732sfgh"), "njGHDdd").toString(this.$crypto.enc.Utf8) ) : {}
        },

        proceedNextStep() {
            this.loading_btn = true
            if(!this.get_session.add_member_household) {
                this.$axios.post(this.$tms_url+'resources/controller/trn_add_consultation_dm.php',this.$qs.stringify({
                    post_data: this.wsDataEncryption(JSON.stringify({
                        hmo_policy_number: null,
                        hmo_host_code: null,
                        ek_phic_id: null,
                        ek_lgu_id: this.get_session.ek_lgu_id,
                        lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                        phic_host_code: this.get_session.mem_phic_pin? "PHIC":null,
                        mem_phic_pin: this.get_session.mem_phic_pin || null,
                        has_diabetes: this.present_of_dm,
                        family_has_diabetes: this.history_of_dm,
                        family_history_classification: this.parents
                    }))
                })).then(response => {
                    this.loading_btn = false
    
                    if(!response.data.success) {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'yellow', title: 'Something went wrong!', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                    
                }).catch(error => {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                })
            } 

            sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(this.get_session), 'njGHDdd'))
            this.$emit('change-step', 4)

        },
    }
}
</script>
