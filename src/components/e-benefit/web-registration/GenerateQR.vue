<template>
  <div v-resize="onResize" id="print">
    <v-layout wrap justify-center>
      <v-row v-if="show_content"> 
        <v-col cols="12" sm="12" md="8" lg="8" offset-md="2" offset-lg="2"> 
            <v-card>
              <v-card-title class="primary white--text justify-center d-print-none">
                  <span v-if="process == 'ISSUE CARD'"><v-icon size="25" left dark>mdi-card-account-details</v-icon>Generated Card</span>
                  <span v-else><v-icon size="25" left dark>mdi-qrcode</v-icon>Generate QR</span>
              </v-card-title>

              <v-layout :class="print_qr ? 'print-layout' : 'pa-5 ui-layout'" wrap justify-center>
                <v-sheet :class="['cr80-card-front relative elevation-3 card-spacing', print_qr ? 'print-card' : 'ui-card']" id="front">
                  <div class="header-container absolute">
                    <div class="d-flex align-start justify-space-between">
                      <h3 class="health-card-title text-center mt-1 ml-n2">{{ getCardTitle($store.state.prv_data.healthcard_id) }}</h3>
                      <div class="d-flex justify-center align-center">
                        <v-img v-if="$store.state.prv_config.card_logo" :src="$store.state.prv_config.card_logo" class="mx-2" height="44" width="44" contain></v-img>
                        <v-img v-if="$store.state.prv_config.provider_logo" :src="$store.state.prv_config.provider_logo" class="mx-2" height="44" width="44" contain></v-img>
                      </div>
                    </div>
                  </div>

                  <div class="body-container absolute full-width">
                    <div class="d-flex justify-space-between align-start px-4">
                      <div class="photo-side">
                        <v-img :src="(!member_data.mem_photo.includes('null') && member_data.mem_photo.length != 0) ? member_data.mem_photo : require('@/assets/no-image.jpg')" width="90" height="105" class="member-photo"></v-img>
                        <div class="mt-1 text-center">
                          <h6 class="font-subtitle-view">PIN: {{ member_data.mem_phic_pin || '' }}</h6>
                        </div>
                      </div>
                      
                      <div class="info-side text-center" :class="validate_member_name">
                        <h6 class="font-title-view patient-name text-uppercase font-weight-bold mb-1">{{ member_data.full_name }}</h6>
                        <h6 class="font-subtitle-view">{{ formatDateMonth(member_data.birthdate) }}</h6>
                        <h6 class="font-subtitle-view">{{ member_data.ek_lgu_id }}</h6>
                        <h6 class="font-subtitle-view">{{ $store.state.prv_data.provider_name }}</h6>
                      </div>
                    </div>
                  </div>

                  <div v-if="$store.state.prv_data.municipality === 'PAGBILAO'" class="footer-logo absolute">
                    <v-img src="@/assets/card-logo/quezon/pagbilao/footer-icon.png" :width="print_qr ? 35 : 55"></v-img>
                  </div>
                </v-sheet>

                <v-sheet :class="['cr80-card-back relative elevation-3 card-spacing', print_qr ? 'print-card' : 'ui-card']" id="back">
                  <div class="back-header absolute">
                    <h3 class="health-card-title">{{ getCardTitle($store.state.prv_data.healthcard_id) }}</h3>
                  </div>

                  <h6 class="date-released font-italic absolute">Released Date: {{ formatDate(date_released) }}</h6>

                  <div class="instructions-container absolute">
                    <div v-for="(text, index) in instructions" :key="index" class="card-back-text d-flex align-start">
                      <span class="pr-1">{{ index + 1 }}.</span>
                      <div v-html="text"></div>
                    </div>
                  </div>

                  <QrcodeVue v-if="qr_value" :value="qr_value" :size="80" class="qr-position absolute" renderAs="svg" id="qrCode"/>

                  <div class="back-logo-footer absolute">
                    <v-img :src="$store.state.prv_config.card_logo || require('@/assets/heroes_health.png')" height="44" width="44" contain></v-img>
                  </div>
                </v-sheet>
              </v-layout>
            </v-card>
            <v-layout wrap class="d-print-none justify-end mt-5 mb-3">
              <v-btn v-if="process === 'REGISTRATION' || process === 'ADD HOUSEHOLD'" @click="validateSaveSelected" color="#367c9d" :loading="save_pdf_loader"  class=" px-5 mr-3" tile dark  small> SAVE CARD  <v-icon small right>mdi-download-circle</v-icon></v-btn>
              <v-btn @click="printQr" color="#367c9d"  class="white--text px-5" :disabled="save_pdf_loader" tile small> PRINT CARD  <v-icon small right>mdi-printer</v-icon></v-btn>
            </v-layout>

            <div :class="[{'fixed' : is_fixed}, 'd-print-none']">
              <v-divider></v-divider>
              <v-layout wrap class="justify-end mt-2 mb-3" >
                <div v-if="process === 'ISSUE CARD'">
                  <v-btn :disabled="loading_release" @click="$router.push('/code-scanning')" class="mr-3" color="primary" outlined tile>CANCEL</v-btn>
                  <v-btn :loading="loading_release" @click="isCardPrintedAlready" color="primary" tile>ISSUE CARD <v-icon right>mdi-arrow-right</v-icon> </v-btn>
                </div>
                <v-btn v-else-if="process === 'REPORT LOST CARD'" @click="confirmationAlert('lost_card')" class="px-6" color="primary">ISSUE NEW CARD<v-icon right>mdi-card-account-details</v-icon> </v-btn>
                <v-btn v-else @click="confirmationAlert('registration')" class="px-6 mr-2" color="primary">PROCEED<v-icon right>mdi-arrow-right</v-icon> </v-btn>
              </v-layout>
            </div>
        </v-col>
      </v-row>
  
      <v-row v-else>
        <v-col cols="12" sm="12" md="8" lg="8" offset-md="2" offset-lg="2"> 
          <v-card  class="my-2 mx-2">
              <v-skeleton-loader   type="card-heading, divider, card-actions"></v-skeleton-loader>
              <v-layout wrap class="py-4">
                <v-row v-for="item in 2" :key="item" id="front" dense no-gutters> 
                  <v-col col="6"  class="pa-4"> 
                    <v-skeleton-loader type="image"></v-skeleton-loader>
                  </v-col>
                </v-row>
              </v-layout>
              <v-skeleton-loader type="actions"></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>

     <!-- CONFIRMATION -->
    <v-dialog v-if="confirmation_alert" v-model="confirmation_alert"  width="450" persistent>
      <v-card class="text-center py-5 px-8">
        <v-form @submit.prevent="validateCardSelection" v-model="form_is_valid" ref="form">
          <v-card-title class="justify-center">
            <v-icon color="primary" size="80">mdi-help-circle</v-icon>
          </v-card-title>
          <h3 class="grey--text text--darken-2 font-weight-regular mb-5">Has the card been Printed / Issued?</h3>

          <v-sheet class="ml-10">
              <v-radio-group v-model="selection_group" :disabled="confirmation_loader" :rules="field_rules">
                <v-radio label="Printed and Issued" value="1"></v-radio>
                <v-radio label="Printed but Not Issued" value="2"></v-radio>
                <v-radio label="Not yet Printed" value="3"></v-radio>
              </v-radio-group>
          </v-sheet>
        
          <v-card-actions class="justify-center mt-5">
              <v-btn @click="confirmation_alert = false, selection_group = ''" type="button" :disabled="confirmation_loader" color="primary" outlined class="pa-5 px-5 mr-5" >Cancel</v-btn>
              <v-btn type="submit" :loading="confirmation_loader" color="primary" class="pa-5 px-7 ml-5">SUBMIT</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
      
    </v-dialog>


    <Alert :alert="alert" @homepage="homepage" @changeSessionData="changeSessionData" @confirmReleaseCard="confirmReleaseCard" @printBeforeReleasing="printBeforeReleasing" @releaseCard="releaseCard" @redirectUser="$emit('redirect')" @lostCardEndProcess="lostCardEndProcess"/>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import QrcodeVue from 'qrcode.vue'
import Alert from '@/components/Alert.vue'


export default {
  components: {Alert, QrcodeVue},
  props: ['process'],
  data() {
    return {
      member_data: sessionStorage.getItem("9xgF732sfgh") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("9xgF732sfgh"), "njGHDdd").toString(this.$crypto.enc.Utf8) ) : {},

      qr_value: '',
      alert:'',
      show_content: false,
      confirmation_alert:false,

      selection_group: '',
      confirmation_loader: false,
      loading_release: false,

      save_pdf_loader: false,

      form_is_valid: false,
      field_rules: [v => !!v && !/^ *$/.test(v) || 'Field is required.'],

      //FOR RESIZE
      windowSize: {x: 0,y: 0},
      is_fixed: true,
      date_released: Date.now(),
      card_ratio: '',
      provider_logo: '',
      print_qr: false
    }
  },
  
  mounted() {
    this.checkProcess()
  },
  
  computed: {
    validate_member_name() {
      if (this.member_data.full_name.length >= 34 ) return 'name_position'
      return ''
    },

    instructions() {
      const title = this.getCardTitle(this.$store.state.prv_data.healthcard_id)
      return [
        `Presenting your ${title} with QR code to be scanned provides consent for authorized government personnel or an accredited healthcard provider to access your personal information and medical records.`,
        `This ${title} with QR Code are non transferable.`,
        `Maintain cleanliness of the card. Do not fold.`,
        `If found, please return to ${this.$store.state.prv_data.provider_name} located at ${this.$store.state.prv_data.provider_address}.`
      ]
    }
    // get_provider_type() {
    //   if(this.$store.state.usr_credentials.lgu_host_code === 'BT') {
    //     return 'Dinalupihan, Bataan'
    //   } else if(this.$store.state.usr_credentials.lgu_host_code === 'AT') {
    //     return 'Antipolo'
    //   } else {
    //     return ''
    //   }
    // }
  },

  methods: {
    checkProcess() {
      if (this.process === 'REPORT LOST CARD') {
        if (this.member_data.has_alert_clicked) return this.encryptUserData(true)
        let alert_title = `<h4 class="font-weight-light body-1">Previous Card Has Been <br/><span class="text-capitalize font-weight-medium text-h6">DEACTIVATED</span></h4>`
        return this.alert = {display: true, type: 'standard', width: '650',icon: 'mdi-alert-circle',color: 'primary',title: alert_title,body: 'A New QR Code has been generated for this member.', btn_pry_txt: 'Proceed in Card Printing',btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert',btn_pry_emt: 'changeSessionData', btn_pry_params: 'for_lost_card',}
      }
      return this.encryptUserData();
    },

    changeSessionData(action) {
      let session_data = {}
      if (action == 'for_lost_card') session_data = {...this.member_data, ...{has_alert_clicked: true}}
      
      this.member_data = session_data
      sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(session_data), 'njGHDdd'))
      this.encryptUserData()
    },
    
    encryptUserData() {
      this.qr_value = this.wsDataEncryption(`EKSYSTEM>${this.member_data.ek_lgu_id}-${this.member_data.current_card_key}-W`)
      this.show_content = true
    },

    confirmationAlert(type) {
      if (type == 'lost_card')return this.alert = {display: true,  type: 'standard', width: '450',  icon: 'mdi-help-circle',  color: 'primary',  title: 'Is the card printed already?',  body: '',  btn_pry_txt: 'No',  btn_pry_color: 'primary',  btn_pry_otl: true, btn_pry_act: 'closeAlert',  btn_sec_txt: 'Yes',  btn_sec_color: 'primary',  btn_sec_otl: false,  btn_sec_act: 'closeAlert', btn_sec_emt:'lostCardEndProcess'}
      this.confirmation_alert = true
    },

    lostCardEndProcess() {
      let alert_title = `<h4 class="font-weight-light body-1">New Card for <br/><span class="text-capitalize font-weight-medium text-h6">${this.member_data.full_name.toLowerCase()} / ${this.member_data.birthdate}</span> <br/>has been issued and activated</h4>`
      return this.alert = {
        display: true,
        type: 'standard',
        width: '600',
        icon: 'mdi-check-circle',
         color: 'success',
         title: alert_title,
         body: '',
         btn_pry_txt: 'Proceed to Homepage',
         btn_pry_color: 'success',
         btn_pry_otl: false,
         btn_pry_act: 'closeAlert',
         btn_pry_emt: 'redirectUser'
        }
    },

    async validateCardSelection() {
      if (!this.form_is_valid)  return this.$refs.form.validate()

      this.confirmation_loader = true
      let card_released = '0', is_card_ready = '2'
      if (this.selection_group == '1') is_card_ready = '1', card_released = '1'
      if (this.selection_group == '2') is_card_ready = '1', card_released = '0'

      // CREATE FUNCTION FOR CALLING A CONTROLLER
      let response = await this.$services.wsMemberWeb({
        key:"eurekare_key_web",
        data: {
            command: "322101005",
            data: {
              ek_lgu_id:this.member_data.ek_lgu_id,
              current_card_key: this.member_data.current_card_key,
              is_card_ready: is_card_ready,
              is_card_released: card_released,
              updated_by: this.$store.state.usr_credentials.user_name
          }
        }
      })

      if(response.status === 200) {
        if (!response.data.status) {
          return this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' } 
        }
        this.member_data.step = this.process === 'REGISTRATION'? 6 : 5
        sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(this.member_data), 'njGHDdd'))
        this.$emit('change-step', this.member_data.step)
      } else {
        this.alert = response.error
      }
    },

    isCardPrintedAlready(){
      this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-help-circle', color: 'primary', title: 'Is the card printed already?', body: '', btn_pry_txt: 'NO', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_pry_emt: 'printBeforeReleasing', btn_sec_txt: 'YES', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'confirmReleaseCard' }
    },

    printBeforeReleasing(){
      this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'Please print the card before releasing', body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
    },

    confirmReleaseCard(){
      this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-help-circle', color: 'primary', title: 'This card will be issued to the member', body: 'Please confirm if you want to proceed', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_sec_txt: 'CONFIRM', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert', btn_sec_emt: 'releaseCard' }
    },

    async releaseCard(){
      this.loading_release = true
      let response = await this.$services.wsMemberWeb({
        key: 'eurekare_key_web',
        data: {
          command: 322101005,
          data: {
            ek_lgu_id: this.member_data.ek_lgu_id,
            current_card_key: this.member_data.current_card_key,
            is_card_ready: '1',
            is_card_released: '1',
            updated_by: this.$store.state.usr_credentials.user_name
          }
        }
      })

      if(response.status === 200) {
        if(response.data.status){
          let title = `Card for <span class="font-weight-medium text-uppercase">${this.member_data.full_name} ${this.formatDate(this.member_data.birthdate)}</span> has been issued and activated</b>`
          this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: title, body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' , btn_pry_emt: 'redirectUser' }
          
        }else{
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' } 
        }
      } else {
        this.alert = response.error
      }
    },
    
    validateSaveSelected() {
      this.save_pdf_loader = true
      this.saveCard();
    },

    //GET THE EXACT HEIGHT AND WIDTH OF THE PROVIDER AND CARD LOGO AND GET ITS RATIO
    loadCardLogoImage() {
      const img = new Image();
      img.src = this.$store.state.prv_config.card_logo;

      img.onload = () => {
        this.card_ratio = img.width / img.height;
      };
    },

    loadProviderLogoImage() {
      const img = new Image();
      img.src = this.$store.state.prv_config.provider_logo;

      img.onload = () => {
        this.provider_ratio = img.width / img.height;
      };
    },

    async getImageSize(imgBase64) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgBase64;

        img.onload = () => {
          const ratio = img.naturalWidth / img.naturalHeight;
          resolve(ratio);
        };

        img.onerror = reject;
      });
    },

    // async saveCard() {
    //   await this.loadCardLogoImage();
    //   await this.loadProviderLogoImage();

    //   html2canvas(document.getElementById('qrCode'), { allowTaint: false, scale: 5 }).then(async canvas => {
    //     let qr_image = canvas.toDataURL()
    //     const doc = new jsPDF('p', 'in', [4, 6.03]); 

    //     // FRONT CARD
    //     doc.addImage(require('@/assets/front-card.png'), "PNG", 0, 0, 4, 3);
    //     doc.setFontSize(10)
    //     doc.setTextColor(1, 1, 101)
    //     doc.setFont('Helvetica', 'bold');
    //     const prv_name_title = this.$store.state.prv_data.healthcard_id.replace(/\s+/g, ' ').trim().toUpperCase()
    //     const prv_words_title = prv_name_title.split(' ')
    //     const prv_half_title = Math.ceil(prv_words_title.length / 2)
    //     const health_card_name = [prv_words_title.slice(0, prv_half_title).join(' '), prv_words_title.slice(prv_half_title).join(' ')]
    //     let card_title = doc.splitTextToSize(this.getCardTitle(health_card_name), 2.2)

    //     doc.text(1.1, 0.45, card_title, 'center')

    //     if (this.$store.state.prv_config.card_logo) {
    //       this.loadCardLogoImage();

    //       const ratio = await this.getImageSize(this.$store.state.prv_config.card_logo);

    //       let card_width = 0.7;
    //       let card_height = card_width / ratio;

    //       if (card_height > 0.7) {
    //         card_height = 0.7;
    //         card_width = card_height * ratio;
    //       }

    //       doc.addImage(this.$store.state.prv_config.card_logo, "PNG", 2.3, 0.25, card_width, card_height);
    //     }

    //     // PROVIDER LOGO
    //     if (this.$store.state.prv_config.provider_logo) {
    //       this.loadProviderLogoImage();

    //       const ratio = await this.getImageSize(this.$store.state.prv_config.provider_logo);

    //       let provider_width = 0.7;
    //       let provider_height = provider_width / ratio;

    //       if (provider_height > 0.7) {
    //         provider_height = 0.7;
    //         provider_width = provider_height * ratio;
    //       }

    //       doc.addImage(this.$store.state.prv_config.provider_logo, "PNG", 3.1, 0.25, provider_width, provider_height);
    //     }

    //     if (this.member_data.mem_photo) {
    //       doc.addImage(this.member_data.mem_photo, "PNG", 0.28, 0.8, 1.5, 1.85);
          
    //       doc.setFontSize(6);
    //       doc.setFont('Helvetica', 'normal');
    //       doc.text(this.member_data.mem_phic_pin ? 'PIN: ' + this.member_data.mem_phic_pin : '', 0.28 + (1.5 / 2), 0.8 + 1.90 + 0.1, { align: 'center' });
    //     } else {
    //       doc.addImage(require('@/assets/no-image.jpg'), "PNG", 0.28, 0.8, 1.5, 1.85);

    //       doc.setFontSize(6);
    //       doc.setFont('Helvetica', 'normal');
    //       doc.text('N/A', 0.28 + (1.5 / 2), 0.8 + 1.90 + 0.1,{ align: 'center' });
    //     }

    //     doc.setTextColor(0, 0, 0)
    //     doc.setLineWidth(0.04)
    //     doc.line(1.80, 0.795, 1.80, 2.65)
    //     doc.line(0.27, 2.65, 1.82, 2.65)

    //     let height = 1.3, id_height = 1.65, location_height = 1.8

    //     const names = this.member_data.full_name.replace(/\s+/g, ' ').trim().toUpperCase()
    //     const words = names.split(' ')
    //     const half = Math.ceil(words.length / 2)

    //     const prv_name = this.$store.state.prv_data.provider_name.replace(/\s+/g, ' ').trim().toUpperCase()
    //     const prv_words = prv_name.split(' ')
    //     const prv_half = Math.ceil(prv_words.length / 2)

    //     const provider_name = [prv_words.slice(0, prv_half).join(' '), prv_words.slice(prv_half).join(' ')]
    //     const member_name = [words.slice(0, half).join(' '), words.slice(half).join(' ')]

    //     doc.setFontSize(9.5)
    //     doc.setFont('Helvetica', 'bold')
    //     doc.text(member_name, 2.93, height, { align: 'center' })

    //     doc.setFontSize(7.5)
    //     doc.setFont('Helvetica', 'normal')
    //     doc.text(this.member_data.ek_lgu_id, 2.93, id_height, { align: 'center' })

    //     doc.setFontSize(6.5)
    //     doc.setFont('Helvetica', 'normal')
    //     doc.text(provider_name, 2.93, location_height, { align: 'center' })


    //     if (this.$store.state.prv_data.municipality === 'PAGBILAO') {
    //       doc.addImage(require('@/assets/card-logo/quezon/pagbilao/footer-icon.png'), "PNG", 3.3, 2.8, 0.6, 0.2);
    //     }

    //     //CUT LINE
    //     doc.setDrawColor(150);
    //     doc.setLineWidth(0.01);
    //     doc.setLineDash([0.1, 0.1], 0);
    //     doc.line(0.2, 3.015, 3.8, 3.015); 
    //     doc.setLineDash([]);

    //     // BACK CARD 
    //     doc.addImage(require('@/assets/back-card.jpg'), "PNG", 4, 0.03, 4, 3, '', '', 180);
    //     doc.addImage(qr_image, "PNG", 3.75, 2.43, 1.35, 1.4, '', '', 180);

    //     const logo = this.$store.state.prv_config.card_logo || require('@/assets/heroes_health.png');
    //     const ratio = await this.getImageSize(logo);

    //     let back_width = 0.5;
    //     let back_height = back_width / ratio;

    //     if (back_height > 0.5) {
    //       back_height = 0.5;
    //       back_width = back_height * ratio;
    //     }

    //     const width_card = 8;
    //     const x = (width_card - back_width) / 2;
    //     const y = 2.6;

    //     doc.addImage(logo, "PNG", x, y, back_width, back_height, '', '', 180);
    //     doc.setFontSize(6);
    //     doc.setTextColor(0, 0, 0)
    //     let text_height = 5.4

    //     let back_card_text_one = doc.splitTextToSize(`Presenting your ${this.getCardTitle(this.$store.state.prv_data.healthcard_id)} with QR Code to be scanned provides consent for authorized government personnel or an accredited healthcard  provider to access your personal information and medical records.`, 2)
    //     doc.text(back_card_text_one, 2.2, text_height, 180, 180)
    //     doc.text('1. ', 2.3, text_height, 180, 180)

    //     if (doc.getTextDimensions(back_card_text_one).h >= 0.4) {
    //       text_height = text_height - 0.60
    //     } else {
    //       text_height = text_height - 0.40
    //     }

    //     let back_card_text_two = doc.splitTextToSize(`This ${this.getCardTitle(this.$store.state.prv_data.healthcard_id)} with QR Code are non transferable. `, 2)
    //     doc.text(back_card_text_two, 2.2, text_height, 180, 180)
    //     doc.text('2. ', 2.3, text_height, 180, 180)
    //     text_height = text_height - 0.23

    //     let back_card_text_three = doc.splitTextToSize('Maintain cleanliness of the card. Do not fold.', 2)
    //     doc.text(back_card_text_three, 2.2, text_height, 180, 180)
    //     doc.text('3. ', 2.3, text_height, 180, 180)
    //     text_height = text_height - 0.15
       
    //     let back_card_text_four = doc.splitTextToSize(`If found, please return to ${this.$store.state.prv_data.provider_name} located at ${this.$store.state.prv_data.provider_address}.`, 2)
    //     doc.text(back_card_text_four, 2.2, text_height, 180, 180)
    //     doc.text('4. ', 2.3, text_height, 180, 180)
        
    //     doc.setFontSize(4.5);
    //     doc.setTextColor(0, 0, 0)
    //     doc.text("Released Date: " + this.formatDate(this.date_released), 1, 5.72, 180, 180)
    //     doc.setFontSize(10);
    //     doc.setTextColor(1, 1, 101)
    //     doc.setFont('Helvetica', 'bold');
    //     doc.text(card_title, 3.8, 5.73, 180, 180);

    //     return doc.save(`${(this.member_data.mem_last_name + ' ' + this.member_data.mem_first_name)}-${this.member_data.birthdate}.pdf`)
    //   }).finally(() => {
    //     this.save_pdf_loader = false
    //   }).catch(error => {
    //     return this.alert = {display: true,type: 'standard',width: '350',icon: 'mdi-alert-circle',color: 'red',title: error,body: 'Please try again',btn_pry_txt: 'OK',btn_pry_color: 'primary',btn_pry_otl: false, btn_pry_act: 'closeAlert'}
    //   })
    // },

    async saveCard() {
      await this.loadCardLogoImage();
      await this.loadProviderLogoImage();

      html2canvas(document.getElementById('qrCode'), {allowTaint: false, scale: 5}).then(async canvas => {
        let qr_image = canvas.toDataURL();
        const OLD_W = 4;
        const OLD_H = 3;
        const NEW_W = 3.375;
        const NEW_H = 2.125;
        const SCALE_X = NEW_W / OLD_W;
        const SCALE_Y = NEW_H / OLD_H;
        const GAP = 0.15;
        const doc = new jsPDF('landscape', 'in', [NEW_H, (NEW_W * 2) + GAP]);

        const sx = (x) => x * SCALE_X;
        const sy = (y) => y * SCALE_Y;

        // FRONT CARD
        doc.addImage(require('@/assets/front-card.png'), "PNG", 0, 0, NEW_W, NEW_H);

        doc.setFontSize(9.5 * SCALE_Y);
        doc.setTextColor(1, 1, 101);
        doc.setFont('Helvetica', 'bold');

        const prv_name_title = this.$store.state.prv_data.healthcard_id.replace(/\s+/g, ' ').trim().toUpperCase();
        const prv_words_title = prv_name_title.split(' ');
        const prv_half_title = Math.ceil(prv_words_title.length / 2);
        const health_card_name = [prv_words_title.slice(0, prv_half_title).join(' '), prv_words_title.slice(prv_half_title).join(' ')];

        // let card_title = doc.splitTextToSize(this.getCardTitle(health_card_name), sx(2.2));
        let card_title = doc.splitTextToSize(this.getCardTitle(health_card_name),sx(1.45));
        doc.text(card_title, sx(1.1), sy(0.35), { align: 'center' });

        // CARD LOGO
        if (this.$store.state.prv_config.card_logo) {
          const ratio = await this.getImageSize(this.$store.state.prv_config.card_logo);
          let card_width = sx(0.7);
          let card_height = card_width / ratio;

          if (card_height > sy(0.7)) {
            card_height = sy(0.7);
            card_width = card_height * ratio;
          }

          doc.addImage(this.$store.state.prv_config.card_logo, "PNG", sx(2.3), sy(0.25), card_width, card_height);
        }

        // PROVIDER LOGO
        if (this.$store.state.prv_config.provider_logo) {
          const ratio = await this.getImageSize(this.$store.state.prv_config.provider_logo);
          let provider_width = sx(0.7);
          let provider_height = provider_width / ratio;

          if (provider_height > sy(0.7)) {
            provider_height = sy(0.7);
            provider_width = provider_height * ratio;
          }

          doc.addImage(this.$store.state.prv_config.provider_logo, "PNG", sx(3.1), sy(0.25), provider_width, provider_height);
        }

        if (this.member_data.mem_photo) {
          doc.addImage(this.member_data.mem_photo, "PNG", sx(0.28), sy(0.8), sx(1.5), sy(1.85));
          doc.setFontSize(9.5 * SCALE_Y);
          doc.setTextColor(0, 0, 0);
          doc.text('PIN: ' + (this.member_data.mem_phic_pin || ''), sx(0.28 + (1.5 / 2)), sy(0.8 + 1.90 + 0.1), { align: 'center' });
        } else {
          doc.addImage(require('@/assets/no-image.jpg'), "PNG", sx(0.28), sy(0.8), sx(1.5), sy(1.85));
        }

        // LINES
        doc.setTextColor(0, 0, 0);
        doc.setLineWidth(0.04 * SCALE_X);
        doc.line(sx(1.80), sy(0.795), sx(1.80), sy(2.65));
        doc.line(sx(0.27), sy(2.65), sx(1.82), sy(2.65));

        // MEMBER DETAILS
        // let height = sy(1.18);
        // let id_height = sy(1.70);
        // let location_height = sy(1.85);
        let name_height = sy(1.18);
        let birthdate_height = sy(1.70);
        let id_height = sy(1.85);
        let provider_height = sy(1.99);

        const member_name = doc.splitTextToSize(this.member_data.full_name.replace(/\s+/g, ' ').trim().toUpperCase(),sx(1.65));
        const provider_name = doc.splitTextToSize(this.$store.state.prv_data.provider_name.replace(/\s+/g, ' ').trim().toUpperCase(),sx(1.7));

        doc.setFontSize(11 * SCALE_Y);
        doc.setFont('Helvetica', 'bold');
        doc.text(member_name, sx(2.93), name_height, { align: 'center' });

        // Birthdate
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5 * SCALE_Y);
        doc.text(this.formatDateMonth(this.member_data.birthdate), sx(2.93), birthdate_height, { align: 'center' });

        // EK LGU ID
        doc.text(this.member_data.ek_lgu_id, sx(2.93), id_height, { align: 'center' });

        // Provider Name
        doc.text(provider_name, sx(2.93), provider_height, { align: 'center' });

        // CUT LINE
        doc.setDrawColor(150);
        doc.setLineWidth(0.01);
        doc.setLineDash([0.1, 0.1], 0);
        doc.line(NEW_W + (GAP / 2), 0, NEW_W + (GAP / 2), NEW_H);
        doc.setLineDash([]);

        // BACK CARD
        const BACK_X = NEW_W + GAP;
        doc.addImage(require('@/assets/back-card.jpg'), "PNG", BACK_X, 0, NEW_W, NEW_H);

        // QR CODE
        doc.addImage(qr_image, "PNG", BACK_X + sx(0.25), sy(0.8), sx(1.2), sy(1.2));

        // BACK LOGO
        const logo = this.$store.state.prv_config.card_logo || require('@/assets/heroes_health.png');
        const ratio = await this.getImageSize(logo);
        let back_width = sx(0.5);
        let back_height = back_width / ratio;

        if (back_height > sy(0.5)) {
          back_height = sy(0.5);
          back_width = back_height * ratio;
        }

        doc.addImage(logo, "PNG", BACK_X + sx(0.125), sy(2.40), back_width, back_height);

        // BACK TEXT
        doc.setFontSize(6.2 * SCALE_Y);
        doc.setTextColor(0, 0, 0);
        doc.setFont('Helvetica', 'normal');

        let text_height = sy(0.68);

        let back_card_text_one = doc.splitTextToSize(`Presenting your ${this.getCardTitle(this.$store.state.prv_data.healthcard_id)} with QR Code to be scanned provides consent for authorized government personnel or an accredited healthcard provider to access your personal information and medical records.`, sx(2));
        doc.text(back_card_text_one, BACK_X + sx(1.8), text_height);
        doc.text('1.', BACK_X + sx(1.7), text_height);
        text_height += (doc.getTextDimensions(back_card_text_one).h + sy(0.10));

        let back_card_text_two = doc.splitTextToSize(`This ${this.getCardTitle(this.$store.state.prv_data.healthcard_id)} with QR Code are non transferable.`, sx(2));
        doc.text(back_card_text_two, BACK_X + sx(1.8), text_height);
        doc.text('2.',BACK_X + sx(1.7), text_height);
        text_height += (doc.getTextDimensions(back_card_text_two).h + sy(0.10));

        let back_card_text_three = doc.splitTextToSize('Maintain cleanliness of the card. Do not fold.', sx(2));
        doc.text(back_card_text_three, BACK_X + sx(1.8), text_height);
        doc.text('3.', BACK_X + sx(1.7), text_height);
        text_height += (doc.getTextDimensions(back_card_text_three).h + sy(0.10));

        let back_card_text_four = doc.splitTextToSize(`If found, please return to ${this.$store.state.prv_data.provider_name} located at ${this.$store.state.prv_data.provider_address}.`, sx(2));
        doc.text(back_card_text_four, BACK_X + sx(1.8), text_height);
        doc.text('4.', BACK_X + sx(1.7), text_height);

        // RELEASE DATE
        doc.setFontSize(6 * SCALE_Y);
        doc.text("Released Date: " + this.formatDate(this.date_released), BACK_X + sx(2.9), sy(0.48));

        doc.setFontSize(9.5 * SCALE_Y);
        doc.setTextColor(1, 1, 101);
        doc.setFont('Helvetica', 'bold');
        doc.text(card_title, BACK_X + sx(0.25), sy(0.35), { align: 'left' });

        return doc.save(`${this.member_data.mem_last_name} ${this.member_data.mem_first_name}-${this.member_data.birthdate}.pdf`);
      }).finally(() => {
        this.save_pdf_loader = false;
      }).catch(error => {
        return this.alert = {display: true,type: 'standard',width: '350',icon: 'mdi-alert-circle',color: 'red',title: error,body: 'Please try again',btn_pry_txt: 'OK',btn_pry_color: 'primary',btn_pry_otl: false, btn_pry_act: 'closeAlert'}
      })
    },
    
    printQr() {
      this.print_qr = true

      this.$nextTick(() => {
        window.print()
        this.print_qr = false
      })
    },

    homepage() {
      sessionStorage.clear();
      this.$router.push('/code-scanning')
    },

    //FILTERING FOR CARD TITLE
    getCardTitle(value) {
      return this.$store.state.usr_credentials.lgu_host_code === 'PHP' ? value + ' ' : value + ' HEALTH CARD'
    },

    // FOR RESPONSIVENESS OF IMAGE SIZES
    onResize() {
        this.windowSize = { x: window.innerWidth, y: window.innerHeight };
        if (this.windowSize.x > 1904) {
          this.is_fixed = true
        } else if (this.windowSize.x > 1480 && this.windowSize.x < 1904) {
          this.is_fixed = true
        } else if (this.windowSize.x > 960 && this.windowSize.x < 1480) {
          this.is_fixed = false
        } 
    },
  }
}
</script>

<style scoped>
/* .relative { position: relative; }
.absolute { position: absolute; }
.full-width { width: 100%; }
.cr80-card-front { background-image: url('~@/assets/front-card.png'); background-size: 100% 100%; }
.cr80-card-back { background-image: url('~@/assets/back-card.jpg'); background-size: 100% 100%; }
.ui-card { width: 384px; height: 280px; }
.ui-layout { gap: 10px; }
.print-card { width: 85.6mm !important; height: 53.98mm !important; border-radius: 0; }
.print-layout { padding: 4em; gap: 0; }

.header-container { top: 10px; left: 22px; width: 85%; }
.body-container { top: 68px; left: 9px; }
.member-photo {border-right: 4px solid #312f2f; border-bottom: 4px solid #312f2f; }
.info-side { width: 55%; margin-top: 20px; }
.footer-logo { bottom: 0; right: 0; padding: 5px; }

.back-header { top: 15px; left: 22px; }
.date-released { top: 25px; right: 16px; font-size: 8px; color: #312f2f; }
.instructions-container { top: 50px; left: 162px; width: 214px; }
.qr-position { top: 75px; left: 25px; }
.back-logo-footer { bottom: 10px; left: 10px; }

.health-card-title { color: #010165; font-size: 11px; font-family: Arial; font-weight: 600; width: 200px; }
.patient-name { font-size: 11.5pt; line-height: 1.1; color: #312f2f; }
.font-subtitle-view { font-size: 8pt; color: #312f2f; }
.card-back-text { font-family: Arial; font-size: 7.8px; line-height: 1.4; color: #1a1a1a; margin-bottom: 2px; } */
.relative { position: relative; }
.absolute { position: absolute; }
.full-width { width: 100%; }
.cr80-card-front { background-image: url('~@/assets/front-card.png'); background-size: 100% 100%;}
.cr80-card-back { background-image: url('~@/assets/back-card.jpg'); background-size: 100% 100%;}
.ui-card, .print-card { width: 85.6mm !important; height: 53.98mm !important; border-radius: 0; }
.ui-layout { gap: 10px; }
.card-spacing { overflow: hidden; }
.header-container { top: 10px; left: 22px; width: 85%;}
.body-container { top: 55px; left: 9px;}
.member-photo { border-right: 4px solid #312f2f; border-bottom: 4px solid #312f2f;}
.info-side { width: 55%; margin-top: 10px;}
.footer-logo { bottom: 0; right: 0; padding: 5px; }
.back-header { top: 15px; left: 22px;}
.date-released { top: 27px; right: 16px; font-size: 8px; color: #312f2f;}
.instructions-container { top: 45px; left: 145px; width: 160px;}
.qr-position { top: 55px; left: 25px;}
.back-logo-footer { bottom: 10px; left: 10px;}
.health-card-title { color: #010165; font-size: 11px; font-family: Arial; font-weight: 600; width: 200px;}
.patient-name { font-size: 10pt !important; line-height: 1.1; color: #312f2f;}
.font-subtitle-view { font-size: 6pt; color: #312f2f; margin-top: -1px;}
.card-back-text { font-family: Arial; font-size: 6.2px !important; line-height: 1.1; color: #1a1a1a; margin-bottom: 2px;}

/* @media print {
  .body-container { top: 55px; }
  .instructions-container { top: 45px; left: 145px; width: 160px; }
  .qr-position { top: 55px; left: 25px; }
  .patient-name { font-size: 10pt !important; }
  .card-back-text { font-size: 6px !important; line-height: 1.1; }
  .date-released{ top: 20px;}
  .font-subtitle-view { font-size: 6pt; color: #312f2f; }
  .print-card { margin: 5px !important;}
} */

@media print {
  .print-card { margin-top: 10px !important; margin-right: 5px !important; margin-left: 5px !important; }
}
</style>

