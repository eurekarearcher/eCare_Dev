<template>
  <v-container fluid class="height-100 color-text px-7 px-lg-7">
    <v-row justify="start" dense>
      <v-col cols="12" sm="12" md="12" lg="12" xl="12">
        <v-img src="@/assets/eurekare-logo.jpg" :max-width="150" alt="lgu logo" contain></v-img>
      </v-col>
    </v-row>
  
    <v-row justify="center" align="center">
      <v-col v-if="Object.keys($route.query).length" cols="9" sm="8" md="7" lg="8" xl="8">
        <div class="d-flex justify-center align-center">
          <v-avatar color="surface-variant" size="100">
            <v-img :src="photo"></v-img>
          </v-avatar>
        </div>
        <h1 class="body-1 font-weight-medium mt-5 text-center">{{ name }}</h1>
      </v-col>

      <v-col v-else cols="9" sm="8" md="7" lg="8" xl="8">
        <h1 class="font-weight-medium text-center">You’re about to delete your eCare Account</h1>
      </v-col>

      <v-col cols="9" sm="8" md="7" lg="8" xl="8">
        <h3 class="body-2 text-center">Are you sure? Your profile and related account information to access your medical <br> information virtually will be deleted from our mobile App.</h3>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="10" sm="8" md="7" lg="5" xl="4">
        <h1 class="body-2 my-2">To continue, first verify that’s you</h1>
        <template v-if="Object.keys($route.query).length">
          <v-text-field v-model="password" :rules="password_rules" label="Password" :type="show_password ? 'text' : 'password'" hide-details outlined></v-text-field>
        </template>
        <template v-else>
          <v-text-field v-model="contact_no" :rules="contact_rules" maxlength="11" label="Contact" outlined></v-text-field>
          <v-text-field v-model="password" :rules="password_rules" label="Password" :type="show_password ? 'text' : 'password'" hide-details outlined></v-text-field>
        </template>
        <v-checkbox v-model="show_password" label="Show Password" style="color: black;" hide-details=""></v-checkbox>
      </v-col>
    </v-row>

    <v-row justify="end" class="my-2">
      <v-col cols="3" sm="3" md="3" lg="3" xl="3">
        <!-- <v-btn class="blue--text mt-3 mb-10 mx-5 my-3">Forgot Password?</v-btn> -->
        <v-btn @click="next" :disabled="!password" :loading="loading" class="white--text mt-3 mb-10" color="light-blue darken-4">Next</v-btn>
      </v-col>
    </v-row>

    <!-- v-dialog for account_info if there's no query of params -->
    <v-dialog v-model="account_info" max-width="900" persistent>
      <v-card>
        <v-container fluid class="height-100 color-text px-7 px-lg-7">
          <v-row justify="center" align="center">
            <v-col cols="9" sm="8" md="7" lg="8" xl="8">
              <div class="d-flex justify-center align-center mt-5">
                <v-avatar color="surface-variant" size="100">
                  <v-img :src="photo"></v-img>
                </v-avatar>
              </div>
              <h1 class="body-1 font-weight-medium mt-5 text-center">{{ name }}</h1>
            </v-col>
          </v-row>

          <v-row justify="center" align="center">
            <v-col cols="10" sm="8" md="7" lg="5" xl="4">
              <h1 class="body-2 my-2">To continue, first verify that’s you</h1>
              <v-text-field v-model="password" :rules="password_rules" label="Password" :type="show_password ? 'text' : 'password'" hide-details outlined></v-text-field>
              <v-checkbox v-model="show_password" label="Show Password" style="color: black;" hide-details=""></v-checkbox>
            </v-col>
          </v-row>

          <v-row justify="end" class="my-2">
            <v-col cols="12" sm="4" md="4" lg="4" xl="4">
              <v-btn @click="account_info = false" class="grey white--text ma-2" outlined>Cancel</v-btn>
              <v-btn @click="confirm" :disabled="!password" :loading="loading" class="white--text" color="light-blue darken-4">Confirm</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- v-dialog for OTP sending -->
    <v-dialog v-model="otp_dialog" max-width="900" persistent>
      <v-card>
        <v-container fluid class="height-100 color-text px-7 px-lg-7">
          <v-row justify="center">
            <v-col cols="12">
              <h1 class="font-weight-medium text-center blue--text">Verification</h1>
            </v-col>

            <v-col cols="12">
              <h1 class="body-2 font-weight-medium text-center">In order to delete your eCare Account, Please enter the verification <br> code that was sent in your email.</h1>
            </v-col>

            <v-col cols="12">
              <h1 class="body-1 font-weight-medium text-center blue--text" >Your Email: {{ email }} </h1>
            </v-col>
          </v-row>

          <v-row justify="center" dense>
            <v-col cols="12" sm="4" md="4" lg="4" xl="4">
              <h1 class="body-2 text-center" >Verification Code </h1>
            </v-col>

            <v-col cols="12" sm="4" md="4" lg="4" xl="4">
              <h1 class="body-2 text-center red--text" v-if="resend_timer > 0">Resend in {{ resend_timer }}s</h1>
              <h1 class="body-2 text-center red--text" v-else-if="resend_timer === 0" @click="resendOTP">Click to resend</h1>
              <h1 class="body-2 text-center red--text" v-else>Resend in 0s</h1>
            </v-col>

            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
              <v-text-field v-model="otp" :rules="otp_rules" name="otp" label="OTP" maxlength="30" dense outlined></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center" dense>
            <v-btn @click="submit" :disabled="!otp" :loading="loading" class="white--text mt-3 mb-10" color="light-blue darken-4" large>Submit</v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <Alert :alert="alert"/>
  </v-container>
</template>

<script>
import Alert from '@/components/Alert.vue'

export default {
  components:{
    Alert
  },

  data() {
    return {
      name: '',
      contact_no: '',
      password: '',
      email: '',
      photo: '',
      
      otp_dialog: false,
      account_info: false,
      // success_deleting: false,
      alert: {},

      otp: '',
      loading: false,
      resend_timer: 0,

      show_password: false,
      password_rules: [
          v => !!v || 'Password is required',
          v => !/\s/g.test(v) || 'Spaces are not allowed'
      ],
      contact_rules: [
        v => !!v || 'Contact is required',
        v => !/\s/g.test(v) || 'Spaces are not allowed'
      ],
      otp_rules: [
        v => !!v || 'Contact is required',
        v => !/\s/g.test(v) || 'Spaces are not allowed'
      ]
    }
  },

  mounted() {
    if (Object.keys(this.$route.query).length) {
      this.getMobileUserInfo();
    } 
  },

  methods: {
    openOTPDialog() {
      this.otp_dialog = true;
      this.startResendTimer();
    },
    
    openAccountInfo(){
      this.account_info = true
      this.getMobileUserInfo()
    },

    openSuccessDeleting() {
      this.$router.push('/account-deleted')
    },

    startResendTimer() {
      this.resend_timer = 120; 
      const timer_interval = setInterval(() => {
        if (this.resend_timer > 0) {
          this.resend_timer--; 
        } else {
          clearInterval(timer_interval); 
        }
      }, 1000); 
    },

    resendOTP() {
      this.startResendTimer()
      this.sendOTPRequest()
    },

    async sendOTPRequest() {
      let prev_tmp_name = sessionStorage.getItem('prev_tmp_name')
      let random_character = Math.random().toString(36).substring(2, 8).toUpperCase()

      let response = await this.$services.mailSender({ 
        // request_key: 'verification_code',
        mail_type: 'delete_account',
        email: sessionStorage.getItem('email'),
        fn:	this.name,
        prev_tmp_name: prev_tmp_name,
        verification_code: random_character
      });

      if(response.status === 200) { 
        if(this.prev_tmp_name !== response.data.tmp_name){
          sessionStorage.removeItem('prev_tmp_name')
          sessionStorage.setItem('prev_tmp_name', response.data.tmp_name) 
        }
        sessionStorage.setItem('tmp_name', response.data.tmp_name)
      } else {
        this.alert = response.error;
      }
    },

    async getMobileUserInfo(){
      if (Object.keys(this.$route.query).length === 0) {
        // No query parameters found, handle contact_no and password input
        let response = await this.$services.getMobileAccountInfo({
          request_key: 'account_info',
          contact_no: this.contact_no,
          pw: this.$crypto.SHA1(this.password).toString()
        });

         if(response.status === 200) { 

          response.data = this.responseDataDecryption(response.data)
          if(response.data.success === false){
            this.$router.push('/account-deleted')
          } else {
            this.name = response.data.mem_first_name + (response.data.mem_middle_name ? ' ' + response.data.mem_middle_name : '') + (response.data.mem_last_name ? ' ' + response.data.mem_last_name : '') + (response.data.mem_suffix ? ' ' + response.data.mem_suffix : '');
            this.email = response.data.mem_email
            this.photo = response.data.mem_photo;
            sessionStorage.setItem('email', response.data.mem_email);
            sessionStorage.setItem('rma_id', response.data.ek_lgu_id);
            this.loading = false 
          }
        } else {
          this.alert = response.error;
        }
      } else {
        let {rma_id,fr_id, rt } = this.$route.query

        let response = await this.$services.getMobileAccountInfo({ 
          request_key: 'account_info',
          rma_id: this.wsDataDecryption(rma_id),
          fr_id: this.wsDataDecryption(fr_id),
          rt: this.wsDataDecryption(rt),
          // rma_id: rma_id,
          // fr_id: fr_id,
          // rt: rt,
        });

        if(response.status === 200) { 
          response.data = this.responseDataDecryption(response.data)
          if(response.data.success === false){
            this.$router.push('/account-deleted')
          } else {
            this.loading = false
            this.name = response.data.mem_first_name + (response.data.mem_middle_name ? ' ' + response.data.mem_middle_name : '') + (response.data.mem_last_name ? ' ' + response.data.mem_last_name : '') + (response.data.mem_suffix ? ' ' + response.data.mem_suffix : '');
            this.email = response.data.mem_email
            this.photo = response.data.mem_photo;
            sessionStorage.setItem('email', response.data.mem_email);
            sessionStorage.setItem('rma_id', response.data.ek_lgu_id);
          }
        } else {
          this.alert = response.error;
        }
      }
    },

    async next() {
      this.loading = true;

      if (Object.keys(this.$route.query).length === 0) {
        // No query parameters found, handle contact_no and password input
        this.openAccountInfo()
      } else {
        // Query parameters found, proceed with API verification
        let { rma_id, rt } = this.$route.query;

        let response = await this.$services.getMobileAccountInfo({ 
          request_key: 'verify_pw',
          rma_id: this.wsDataDecryption(rma_id),
          rt: this.wsDataDecryption(rt),
          pw: this.$crypto.SHA1(this.password).toString()
        });

        if (response.status === 200) { 
          response.data = this.responseDataDecryption(response.data)
          this.loading = false;
          if (response.data.success) {
            this.openOTPDialog();
            this.sendOTPRequest();
          } else {
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'error', title: 'Incorrect Password', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' };
            this.loading = false;
          }
        } else {
          this.alert = response.error;
        }
      }
    },

    async confirm() {
      let response = await this.$services.getMobileAccountInfo({ 
          request_key: 'verify_pw',
          rma_id: sessionStorage.getItem('rma_id'),
          pw: this.$crypto.SHA1(this.password).toString()
        });

        if (response.status === 200) { 
          response.data = this.responseDataDecryption(response.data)
          if (response.data.success) {
            this.openOTPDialog();
            this.sendOTPRequest();
          } else {
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'error', title: 'Incorrect Password', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' };
            this.loading = false;
          }
        } else {
          this.alert = response.error;
        }
    },

    async submit(){
      let response = await this.$services.getMobileAccountInfo({ 
        request_key: 'verify_code',
        tmp_name: sessionStorage.getItem('tmp_name'),
        rma_id: sessionStorage.getItem('rma_id'),
        guess_code: this.otp
      });

      if(response.status === 200) { 
        response.data = this.responseDataDecryption(response.data)
        if(response.data.success === false ){
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'error', title: 'Incorrect OTP', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' };
        } else {
          this.guess_code = this.otp
          this.openSuccessDeleting()
        }
      } else {
        this.alert = response.error
      }
    },
  }
};
</script>
