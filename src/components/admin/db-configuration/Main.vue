<template>
    <v-container class="home fill-height">
    <div class="mx-auto">
      <v-card width="800" class="py-5">
        <h1 class="primary--text font-weight-medium text-center mt-10">DATABASE</h1>
        <h3 class="text-center font-weight-regular mb-5">Configuration</h3>
        <div v-show="loading_data" class="text-center mt-8 mr-1" style="border: 1px solid lightgrey">
            <v-progress-linear color="primary" size="30" indeterminate></v-progress-linear>
            <h4 class="text--secondary body-2 my-5">Loading Data... Please wait...</h4>
        </div>

        <v-form @submit.prevent="addDatabaseCredentials" v-if="!loading_data" class="px-15">
            <div class="mb-1">
                <div class="mb-1">
                    <label>Database Share Code</label>
                        <v-text-field v-model="db_share_code" filled dense>
                            <template v-slot:append>
                                <v-btn icon small @click="copyToClipboard"><v-icon small>mdi-content-copy</v-icon></v-btn>
                            </template>
                        </v-text-field>
                </div>
                <!-- <div class="mb-1">
                    <label>Provider Code</label>
                    <v-text-field 
                    :value="$store.state.prv_data.provider_code"
                    filled dense>
                    </v-text-field>
                </div> -->
                <v-checkbox v-model="check_use_db_share" @change="toggleCheckUseDbShare" label="Check if you will use database share code" dense></v-checkbox>
            </div>
            
            <div class="mb-1">
                <label>Provider Name</label>
                <v-text-field :value="$store.state.prv_data.provider_name" :disabled="check_use_db_share" filled></v-text-field>
            </div>
            <div class="mb-1">
                <label>USERNAME</label>
                <v-text-field v-model="db_username" :disabled="check_use_db_share" filled></v-text-field>
            </div>
            <div class="mb-1">
                <label>PASSWORD</label>
                <v-text-field v-model="db_password" :disabled="check_use_db_share" :rules="empty_validation" type='password' filled></v-text-field>
            </div>
            <div class="mb-1">
                <label>HOST</label>
                <v-text-field v-model="db_host" :disabled="check_use_db_share" :rules="empty_validation" filled></v-text-field>
            </div>
            <div class="mb-1">
                <label>PORT</label>
                <v-text-field v-model="db_port" :disabled="check_use_db_share" filled></v-text-field>
            </div>
            <div class="mb-1">
                <label>DATABASE NAME</label>
                <v-text-field  v-model="db_name" :disabled="check_use_db_share" :rules="empty_validation" filled></v-text-field>
            </div>
            <!-- <div class="mb-1">
                <label>Provider Code</label>
                <v-text-field 
                :value="$store.state.prv_data.provider_code"
                filled>
                </v-text-field>
            </div> -->

            <v-btn class="primary mt-5 mb-15" type="submit" :loading="btn_loader" x-large block>SUBMIT</v-btn>
        </v-form>
      </v-card>
    </div>

    <Alert :alert="alert" @logoutUser="logoutUser" ref="alert_logout"/>
  </v-container>
</template>

<script>
import Alert from '@/components/Alert'

export default {
    components: {
        Alert
    },
    data() {
        return {
            db_username: '',
            db_password: '',
            db_host: '',
            db_port: '',
            db_name: '',
            db_share_code: '',
            check_use_db_share: false,
            loading_data: false,
            btn_loader: false,

            // FORM VALIDATION
            empty_validation: [
                v => !!v && !/^ *$/.test(v) || 'Required Field',
            ],
            alert : {}
        } 
    },

    mounted() {
        this.getProviderCredentials();
    },

    methods: {
        async addDatabaseCredentials() {
            this.btn_loader = true;

            let payload = {};

            // Check if using shared database code
            if (this.check_use_db_share) {
                payload = {
                    request_key: 'code',
                    provider_code: this.$store.state.prv_data.provider_code,
                    db_share_code: this.db_share_code,
                };
            } else {
                payload = {
                    request_key: 'credentials',
                    provider_name: this.$store.state.prv_data.provider_name,
                    provider_code: this.$store.state.prv_data.provider_code,
                    db_username: this.db_username,
                    db_password: this.db_password,
                    db_host: this.db_host,
                    db_port: this.db_port,
                    db_name: this.db_name,
                };
            }

            const response = await this.$services.trnAddProviderDbCredentials(payload);

            if (response.status === 200) {
                if (response.data.success) {
                    let countdown = 3;

                    this.alert = {
                        display: true,
                        type: 'standard',
                        width: '400',
                        icon: 'mdi-check-circle',
                        color: 'green',
                        title: this.check_use_db_share ? 'Database connected using shared code.' : 'Database credentials updated successfully.',
                        body: `
                            <div style="margin-top:10px; text-align:center;">
                                <p>You will be logged out in <strong>${countdown}</strong> seconds...</p>
                            </div>
                        `,
                        btn_pry_txt: 'OK',
                        btn_pry_color: 'primary',
                        btn_pry_otl: false,
                        btn_pry_act: 'logoutUser'
                    };

                    // Start countdown timer 
                    const timer = setInterval(() => {
                        countdown--;
                        this.alert.body = `
                            <div style="margin-top:10px; text-align:center;">
                                <p>You will be logged out in <strong>${countdown}</strong> seconds...</p>
                            </div>
                        `;

                        if (countdown <= 0) {
                            clearInterval(timer);
                            this.$refs.alert_logout.logoutUser();
                        }
                    }, 1000);
                } else {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.data.message, body: 'Please try again.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                }
            } else {
                this.alert = response.error;
            }

            this.btn_loader = false;
        },

        async getProviderCredentials() {
            this.loading_data = true;
            let response = await this.$services.getProviderDbCredentials({
                db_share_code: this.db_share_code,
                provider_code: this.$store.state.prv_data.provider_code
            });

            if (response.status === 200) {
                let data = response.data;

                // Mask each value before showing
                this.db_username = this.maskValue(data.username);
                this.db_password = this.maskValue(data.password, true);
                this.db_host = this.maskValue(data.host);
                this.db_name = this.maskValue(data.db_name);
                this.db_port = this.maskValue(data.port);
                this.db_share_code = this.maskValue(data.db_share_code);
            } else {
                this.alert = response.error
            }

            this.loading_data = false;
        },

        toggleCheckUseDbShare() {
           if(this.check_use_db_share) {
               this.db_share_code = '';
           }
        },
        
        copyToClipboard() {
            navigator.clipboard.writeText(this.db_share_code)
        },

        async logoutUser(){
            this.$emit('logoutUser')
        }
    }
}
</script>