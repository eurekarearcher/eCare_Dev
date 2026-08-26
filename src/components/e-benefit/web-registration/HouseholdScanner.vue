<template>
   <!-- ADMISSION PROCESS -->
   <div>
    <v-dialog v-model="show_scanner" width="800" persistent>
        <v-card>
          <div v-if="mode === 'manual' || $store.state.usr_credentials.user_type === '9-1'" >
            <v-card-title class="justify-center primary white--text"><v-icon color="white" left>mdi-qrcode-scan</v-icon>Principal Verification</v-card-title>
            <div class="px-10 py-5 py-xl-5">
                <v-form :disabled="form_loading" ref="form">
                    <!-- <v-div v-if="process !== 'REGISTRATION' && process !== 'ADD HOUSEHOLD' && process !== 'OFFLINE TRANSACTION'" xs12>
                        <h5 class="font-weight-regular mt-9 my-xl-1">Card Number <span class="red--text">*</span></h5>
                        <v-text-field v-model="ek_lgu_id" 
                            :rules="birthdate ? [] : verification_rules"
                            :disabled="!first_name == false || !middle_name == false || !last_name == false || !suffix == false || !birthdate == false"
                            :error="empty_field && !ek_lgu_id"
                            dense>
                        </v-text-field>
                        <div class="d-flex align-center my-8 my-xl-5">
                            <v-divider></v-divider><h5 class="font-weight-bold grey--text text--darken-3 body-1 text-center mx-2">OR</h5> <v-divider></v-divider>
                        </div>
                    </v-div> -->

                    <h5 :class="['my-xl-1', 'font-weight-regular mt-9 ']">First Name <span class="red--text">*</span></h5>
                    <v-text-field v-model="first_name" @input="first_name = textCapitalize($event)" :rules="verification_rules" :error="empty_field && !first_name" dense></v-text-field>

                    <h5 :class="['my-xl-1', 'font-weight-regular mt-9 ']">Middle Name <i>(optional)</i></h5>
                    <v-text-field v-model="middle_name" @input="middle_name = textCapitalize($event)" dense></v-text-field>

                    <h5 :class="['my-xl-1', 'font-weight-regular mt-9 ']">Last Name <span class="red--text">*</span></h5>
                    <v-text-field v-model="last_name" @input="last_name = textCapitalize($event)" :rules="verification_rules"  :error="empty_field && !last_name" dense></v-text-field>

                    <h5 :class="['my-xl-1', 'font-weight-regular mt-9 ']">Suffix <i>(optional)</i></h5>
                    <v-select v-model="suffix" :items="['JR', 'SR', 'I', 'II', 'III', 'IV', 'V', 'VI']" clearable dense> </v-select>

                    <h5 :class="['my-xl-1', 'font-weight-regular mt-9 ']">Birthdate <span class="red--text">*</span></h5>
                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="birthdate" v-mask="birthdate_mask" :rules="verification_rules" :error="empty_field && !birthdate" placeholder="MM-DD-YYYY" dense></v-text-field>
                        </template>
                        <v-date-picker v-model="birthdate_picker" :max="max_date" @change="birthdate = formatDate(birthdate_picker)" no-title></v-date-picker>
                    </v-menu>
                </v-form>
            </div>
          </div>
          <div v-if="mode === 'scanner' && $store.state.usr_credentials.user_type !== '9-1'"> 
            <v-card-title class="justify-center primary white--text">
              <v-icon color="white" left>mdi-qrcode-scan</v-icon>QR Scanner
            </v-card-title>
            <div class="pa-5">
              <h1 class="text-h6 my-3 text-center grey--text text--darken-3 font-weight-regular">
                Please scan the QR Code of the Principal member.
              </h1>
              <v-col cols="12" class="d-flex justify-center">
                <div v-if="loading_qr_scanner" class="text-center">
                  <v-progress-circular color="primary" size="100" indeterminate></v-progress-circular>
                  <h4 class="light-blue--text text--darken-4 mt-5">Validating data... Please wait...</h4>
                </div>
                <video v-show="!loading_qr_scanner" id="previews" width="100%" class="elevation-3"></video>
              </v-col>
            </div>
          </div>

          <div v-if="$store.state.prv_config.ekonsulta_accre" class="d-flex justify-center">
            <h5 :class="['my-xl-1', 'font-italic grey--text text--darken-2 mb-4']">Important: For Yakap eligible dependents, please use the corresponding principal/member as registered with PhilHealth.</h5>
          </div>

          <v-divider></v-divider>

          <v-card-actions class="py-3 px-8">
            <v-row class="justify-space-between align-center" no-gutters>
              <!-- Toggle Mode Button -->
              <v-col cols="auto">
                <v-btn v-if="$store.state.usr_credentials.user_type !== '9-1'" @click="mode = mode === 'manual' ? 'scanner' : 'manual'" color="green" class="white--text" rounded>
                  {{ mode === 'manual' ? 'QR SCANNER' : 'MANUAL INPUT' }}
                  <v-icon right small>{{ mode === 'manual' ? 'mdi-qrcode-scan' : 'mdi-form-textbox' }}</v-icon>
                </v-btn>
              </v-col>

              <v-col cols="auto">
                <div class="d-flex align-center">
                  <v-btn @click="cancelScanning" :disabled="loading_qr_scanner && $store.state.usr_credentials.user_type !== '9-1'" rounded class="mx-2 px-5">CANCEL<v-icon right small>mdi-close</v-icon></v-btn>
                  <v-btn v-if="mode === 'manual'" @click="validateForm" :loading="verifying_loading" rounded color="primary">VERIFY PRINCIPAL<v-icon right small>mdi-check-circle</v-icon></v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-actions>

        </v-card>
    </v-dialog>
    <Alert :alert="alert" @cancelScanning="cancelScanning" @openScanner="openScanner" @displayNotYetRegistered="displayNotYetRegistered" class="d-print-none"/>
   </div>
</template>

<script>
import { mask } from "vue-the-mask"
import QrScanner from 'qr-scanner'; 
import Alert from '@/components/Alert.vue'

export default {
  directives: { mask },
  components: {
    Alert
  },

  data() {
    return {
      loading_qr_scanner: true,
      show_scanner: true,
      qrScanner: null,
      mode: '',

      alert: {},
      max_date: this.$moment().format('YYYY-MM-DD'),
      verification_rules: [v => !!v && !/^ *$/.test(v)],
      off_principal_ek_lgu_id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      suffix: '',
      birthdate: '',
      birthdate_picker: '',
      birthdate_mask: '##-##-####',
      empty_field: false,
      form_loading: false,
      verifying_loading: false
    }
  },

  mounted() {
    // this.openScanner();
    if (this.$store.state.usr_credentials.user_type === '9-1') {
      this.mode = 'manual';
    } else {
      this.mode = 'scanner'
    }
  },

  watch: {
    mode(value) {
      if (value === 'scanner') {
          this.openScanner();
      } else {
        this.closeScanner();
      }
    }
  },

  methods: {
    async openScanner() {
        const has_camera = await QrScanner.hasCamera()
        if (!has_camera) {
          this.sel_adm_process = {display: false}
          this.loading_qr_scanner = false
          return this.alert = { display: true, type: 'standard',  width: '620',  icon: 'mdi-alert-circle',  color: 'blue darken-1',  title: 'The camera is not detected or it may not be supported by the browser.',  btn_pry_txt: 'close', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
        }

        try {
            const video = document.getElementById('previews')
            this.qrScanner = new QrScanner(video, result => this.getScannedContent(result), {
              highlightScanRegion: true,
            });
            this.qrScanner.start();
            this.loading_qr_scanner = false
        } catch (err) {
          return this.alert = { display: true, type: 'standard',  width: '620',  icon: 'mdi-alert-circle',  color: 'blue darken-1',  title: err,  btn_pry_txt: 'close', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'cancelScanning'}
        }
    },

    // REMOVE SCANNER INSTANCE
    closeScanner() {
      if (this.qrScanner) {
        this.qrScanner.destroy();
        this.qrScanner = null;
      }
    },

    async getScannedContent(results) {
      this.qrScanner.stop();
      const value = this.wsDataDecryption(results.data)
      if (value == 'Decryption Failed') {
        this.closeScanner();
        return this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Invalid QR Image', body: 'Please make sure to use the QR image for eCare System', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' , btn_pry_emt: 'openScanner' }
      } 

      const get_ek_system = value.substring(0,8)
      const split_text = value.split('-')
      const get_ek_lgu_id = `${split_text[0].substring(9)}-${split_text[1]}-${split_text[2]}`
      const get_current_card_key = split_text[3]
      const get_card_type = split_text[4]

      if (get_ek_system === 'EKSYSTEM') { 
          this.loading_qr_scanner = true
          let response = await this.$services.getMemberCardKey({
            ek_lgu_id: get_ek_lgu_id
          })

          if(response.status === 200) {
            response.data = this.responseDataDecryption(response.data)
            this.closeScanner();
            if (response.data.message) {
              return this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'red', title: 'Cannot identify card holder', body: 'The card holder has no record or not yet registered in eCare System', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'openScanner' }
            } 
            if (get_current_card_key === response.data.current_card_key) {
              this.getMemberData(get_ek_lgu_id, get_card_type);
            } else {
              return this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'red', title: 'This card is already Deactivated', body: 'Please use the latest HealthCard', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'openScanner' }
            } 
          } 
      } else {
        this.closeScanner();
        this.alert = {display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle',color: 'red', title: 'The QR Code is not an eCare System Valid QR Code', body: '', btn_pry_txt: 'scan again', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'openScanner' }
      }
    },

    // FOR REDIRECT TO ADMISSION DASHBOARD
    cancelScanning() {
      if (this.qrScanner) this.closeScanner();
      this.$emit('redirect')
    },

    async validateForm() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        this.getMemberData(this.off_principal_ek_lgu_id);
      } else {
        this.empty_field = true;
        this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Field is empty/Invalid Value', body: 'Please fill out all required fields.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }
    },

    async getMemberData(ek_lgu_id, card_type) {
      this.verifying_loading = true;

      let response = await this.$services.wsMemberWeb({
        key: 'eurekare_key_web',
        data: {
          command: 322101004,
          data: {
            ...(ek_lgu_id ? { ek_lgu_id: ek_lgu_id } :
                {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    birthdate: this.$moment(this.birthdate, 'MM-DD-YYYY', true).format('YYYY-MM-DD')
                }
            )
          }
        }
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)

        if (response.data.lgu_data.member_registration_type === 'DEPENDENT') {
          if(this.$store.state.usr_credentials.department === 'Data Encoder') { 
            this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'red', title: 'Principal Verification.', body: 'Please use the Information of the Principal to add a household member.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          } else {
            this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'red', title: 'The owner of this QR code is a Dependent.', body: 'Please use the QR code of the Principal to add a household member.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          }
        } else {
          if (response.data.count === '0') {
            if(this.$store.state.usr_credentials.department === 'Data Encoder') {
              // this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: `Principal Verification`, body: 'Please confirm if the data is correct before proceeding', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_pry_emt: 'openScanner', btn_sec_txt: 'CONFIRM', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'displayNotYetRegistered' }
              this.verifying_loading = false;
              this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: `Principal Verification`, body: 'Please confirm if the data is correct before proceeding', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'CONFIRM', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'displayNotYetRegistered' }
            }else {
              // this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: `Card Number: ${ek_lgu_id}`, body: 'Please confirm if the data is correct before proceeding', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_pry_emt: 'openScanner', btn_sec_txt: 'CONFIRM', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'displayNotYetRegistered' }
              this.verifying_loading = false;
              this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: `Card Number: ${ek_lgu_id}`, body: 'Please confirm if the data is correct before proceeding', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'CONFIRM', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'displayNotYetRegistered' }
            }
          } else {
            const lgu_data = response.data.lgu_data
            const title = `<span class="font-weight-medium text-uppercase">${lgu_data.mem_first_name} ${lgu_data.mem_middle_name || ''} ${lgu_data.mem_last_name} ${lgu_data.mem_suffix_name || ''}</span><span class="d-block mb-2">${this.formatDate(lgu_data.mem_birthdate)}</span>`
            if ((lgu_data.is_card_ready === '1' && lgu_data.is_card_released === '1') || card_type === 'M') {
              const data = {
                step: 1,
                ek_lgu_id: lgu_data.principal_ek_lgu_id,
                primary_data: {
                  fname: lgu_data.mem_first_name,
                  lname: lgu_data.mem_last_name,
                  birthdate: lgu_data.mem_birthdate,
                  phic_pin: lgu_data.mem_phic_pin || '',
                  mobile_number: lgu_data.mem_mobile_number || '',
                  landline_number: lgu_data.mem_landline_number || '',
                  region: lgu_data.mem_home_region,
                  province: lgu_data.mem_home_province ,
                  municipality: lgu_data.mem_home_city_municipality ,
                  barangay: lgu_data.mem_home_bgy,
                  bldg: lgu_data.mem_home_bldgno || '',
                  street: lgu_data.mem_home_street || '',
                  zip: lgu_data.mem_home_zip || '',
                  subdivision: lgu_data.mem_home_subdivision || '',
                  phase: lgu_data.mem_home_phase || '',
                  blk: lgu_data.mem_home_blk || '',
                  lot: lgu_data.mem_home_lot || '',
                  bldg_name: lgu_data.mem_home_building_name || '',
                  unit_floor: lgu_data.mem_home_unit_room_floor || ''
                },
                add_member_household: true
              }
              
              sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(data), 'njGHDdd'))
              this.$emit('setMemberData', data)
              this.$emit('changeStep', 1)
              this.show_scanner = false
  
            } else if (lgu_data.is_card_ready === '0' && lgu_data.is_card_released === '0') {
                if(this.$store.state.usr_credentials.department === 'Data Encoder') {
                                const data = {
                  step: 1,
                  ek_lgu_id: lgu_data.principal_ek_lgu_id,
                  primary_data: {
                    fname: lgu_data.mem_first_name,
                    lname: lgu_data.mem_last_name,
                    birthdate: lgu_data.mem_birthdate,
                    phic_pin: lgu_data.mem_phic_pin || '',
                    mobile_number: lgu_data.mem_mobile_number || '',
                    landline_number: lgu_data.mem_landline_number || '',
                    region: lgu_data.mem_home_region,
                    province: lgu_data.mem_home_province ,
                    municipality: lgu_data.mem_home_city_municipality ,
                    barangay: lgu_data.mem_home_bgy,
                    bldg: lgu_data.mem_home_bldgno || '',
                    street: lgu_data.mem_home_street || '',
                    zip: lgu_data.mem_home_zip || '',
                    subdivision: lgu_data.mem_home_subdivision || '',
                    phase: lgu_data.mem_home_phase || '',
                    blk: lgu_data.mem_home_blk || '',
                    lot: lgu_data.mem_home_lot || '',
                    bldg_name: lgu_data.mem_home_building_name || '',
                    unit_floor: lgu_data.mem_home_unit_room_floor || ''
                  },
                  add_member_household: true
                }
                
                sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(data), 'njGHDdd'))
                this.$emit('setMemberData', data)
                this.$emit('changeStep', 1)
                this.show_scanner = false
              } else {
                this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'primary', title: title, body: 'Incomplete registration or the card was not printed. Please complete registration or print the card first.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'  }
              }
            } else if ((lgu_data.is_card_ready === '1' || lgu_data.is_card_ready === '2') && lgu_data.is_card_released === '0') {
              this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'primary', title: title, body: 'HealthCare Card has not been activated yet. Please proceed on Issuance of Card to activate it.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'  }
            }
          }
        }
      } else {
        this.alert = response.error
      }
    },

    displayNotYetRegistered() {
      // this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'red', title: 'Cannot Identify Card Holder', body: 'The Card Holder has no record or not yet registered in eCARE System', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'openScanner' }
      this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'red', title: 'Cannot Identify Card Holder', body: 'The Card Holder has no record or not yet registered in eCARE System', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
    }
  }
}
</script>