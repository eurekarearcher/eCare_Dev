<template>
  <v-container v-resize="onResize" fluid class="height-100 color-text px-7 px-lg-7">
    <Navbar :navbar="navbar" />
    <div class="d-flex flex-wrap height-80">
      <HeaderPage  title="Data Encoder Dashboard"/>
      
      <v-col cols="12" align-self="center" class="mt-md-7" id="content">
        <v-row dense>
          <v-col cols="12" sm="12" md="12" lg="10" xl="8" offset-lg="1" offset-xl="2"> 
            <v-row class="justify-center"  dense>
              <!-- Admission items -->
              <v-col cols="12" sm="12" md="6" lg="6" xl="6" class="pl-lg-3 pa-3">
                <v-hover v-slot="{ hover }">
                  <v-card @click="preConsultation()" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" outline class="d-flex mt-4 card-container-items" flat color="white">
                    <div class="my-2 ml-5 card-icon">
                      <v-icon :size="icon_size" color="primary" class="px-5">mdi-stethoscope</v-icon>
                    </div>

                    <div class="card-details">
                      <h6 class="title mb-1">CONSULTATION / EMR CONSULTATION</h6>
                      <h6 class="caption text-xl-body-2">POST TRANSACTION DATA ENTRY for Consultation and <br/> EMR Consultation..</h6>
                    </div>
                  </v-card>
                </v-hover>
              </v-col>

              <!-- Registration -->
              <v-col cols="12" sm="12" md="6" lg="6" xl="6" class="pr-lg-3 pa-3" >
                <v-hover v-slot="{ hover }">
                <v-card @click="goToRegistration()" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" outline class="primary d-flex mt-4 card-container-items" flat>
                      <div class="my-2 ml-5 card-icon">
                        <v-icon :size="icon_size" color="white" class="px-5">mdi-account-plus</v-icon>
                      </div>

                      <div class="white--text card-details">
                        <h6 class="title mb-1">New Member Registration</h6>
                        <h6 class="caption text-xl-body-2">Register the patient in {{ capitalizeString($store.state.prv_data.province) }}</h6>
                        <h6 class="white--text caption font-weight-medium text-uppercase mb-0">Proceed to Registration</h6>
                      </div>
                  </v-card>
                </v-hover>
              </v-col>

              <!-- QUEUE LIST -->
              <v-col cols="12" sm="12" md="6" lg="6" xl="6" class="pl-lg-3 my-2 pa-3">
                <v-hover v-slot="{ hover }">
                  <v-card @click="goToQueueList()" :class="hover ? 'hover-class' : ''" height="100%" width="100%" class="d-flex flex-column mt-4 justify-space-between color-text" outline>
                    <v-row justify="center" align="center" class="py-4 px-2 pt-7">
                      <v-icon :size="icon_size" :color="'primary'" class="px-3">mdi-clipboard-list-outline</v-icon>
                    </v-row>
                    <v-row justify="center" class="px-2 pb-12">
                      <h6 class="text-body-1 font-weight-medium">DIAGNOSTIC EXAM POST ENCODING</h6>
                    </v-row>
                  </v-card>
                </v-hover>
              </v-col>

              <!-- EKONSULTA SUBMISSION -->
              <v-col v-if="$store.state.prv_data.phic_acc_no" cols="12" sm="12" md="6" lg="6" xl="6" class="pl-lg-3 my-2 pa-3">
                <v-hover v-slot="{ hover }">
                  <v-card disabled @click="ekonsultaSubmission()" :class="hover ? 'hover-class' : ''" height="100%" width="100%" class="d-flex flex-column mt-4 justify-space-between color-text" outline>
                    <v-row justify="center" align="center" class="py-4 px-2 pt-7">
                      <v-icon :size="icon_size" :color="'primary'" class="px-3">mdi-folder-file</v-icon>
                    </v-row>
                    <v-row justify="center" class="px-2 pb-12">
                      <h6 class="text-body-1 font-weight-medium">EKONSULTA SUBMISSION</h6>
                    </v-row>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-col> 
        </v-row>
      </v-col>
    </div>

    <!-- MEMBER SELECTION -->
    <v-dialog v-if="member_selection_dialog" v-model="member_selection_dialog" width="80%" persistent>
        <v-card justify-center>   
          <v-card-title class="justify-center text-h6 light-blue darken-4 white--text text-center">{{is_qr_scanner ? 'PATIENT CONFIRMATION' : 'PATIENT SELECTION' }}</v-card-title>
          <div class="px-5">
            <v-col cols="12" sm="6" md="4" align-self="center" class="ml-auto py-5">
              <v-text-field v-model="search" placeholder="Search" hide-details outlined dense></v-text-field>
            </v-col>
            <v-data-table
              :headers="process_type === 'LGU' ? member_headers_lgu : member_headers"
              :items="member" 
              :search="search"
              :items-per-page="4"
              :mobile-breakpoint="0"
              :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" 
              :sort-by="process_type === 'LGU' ? 'lgu_member_type' : 'mem_hmo_type'" 
              :loading="member_selection_loader"
              loading-text="Loading Please Wait" 
              class="pb-5"
              sort-desc
            >
              <template v-slot:item="{ item }">
                <template v-if="process_type === 'LGU'">
                    <tr @click="selectedRowLGU(item)" :class="{'blue lighten-4': item.ek_lgu_id === selected_ek_lgu_id}">
                      <td>{{ item.ek_lgu_id }}</td>
                      <td class="text-uppercase">{{(item.mem_first_name +item.mem_last_name).includes(null) ? "N/A": item.mem_first_name+(item.mem_middle_name ? " "+item.mem_middle_name : "") +" "+item.mem_last_name +(item.mem_suffix ? " "+item.mem_suffix : '')}}</td>
                      <td>{{ item.lgu_member_type  ? item.lgu_member_type.charAt(0).toUpperCase() === 'P' ? 'PRINCIPAL' : 'DEPENDENT' : 'N/A' }}</td>
                      <td>
                        <v-img v-if="!item.mem_photo" src="@/assets/no-image.jpg" class="mx-auto my-1" width="70px" contain></v-img>
                        <v-img :src="item.mem_photo.includes('data:image/jpeg;base64,') ? item.mem_photo : item.mem_photo+uniqueUrl" @error="item.mem_photo = require('@/assets/no-image.jpg')" class="mx-auto my-1" width="70px" contain ></v-img>
                      </td>
                    </tr>
                </template>
                <template v-else>
                  <tr @click="selectedRow(item)" 
                    :class="{
                      'blue lighten-4' : item.ek_hmo_id === selected_ek_hmo_id, 
                      'grey--text' : item.mem_hmo_policy_number !== catch_data.policy.toUpperCase() && item.member_name.trim() !== catch_data.name.trim() && catch_data.restriction !== false
                    }">
                    <td>{{ item.mem_hmo_policy_number }} {{catch_data.name}}</td>
                    <td class="text-uppercase">{{(item.mem_first_name +item.mem_last_name).includes(null) ? "N/A": item.mem_first_name+(item.mem_middle_name ? " "+item.mem_middle_name : "") +" "+item.mem_last_name +(item.mem_suffix ? " "+item.mem_suffix : '')}}</td>
                    <td>{{ item.mem_hmo_type }}</td>
                    <td>
                      <v-img v-if="!item.mem_photo" src="@/assets/no-image.jpg" class="mx-auto my-1" width="70px" contain></v-img>
                      <v-img :src="item.mem_photo.includes('data:image/jpeg;base64,') ? item.mem_photo : item.mem_photo+uniqueUrl" @error="item.mem_photo = require('@/assets/no-image.jpg')" class="mx-auto my-1" width="70px" contain ></v-img>
                    </td>
                  </tr>
                </template>
              </template>
            </v-data-table>
          </div>

          <v-divider></v-divider>
          <v-card-actions class="justify-center">
            <v-btn @click="showCancel()" rounded :disabled="mem_btn_loader" class="mx-2" color="secondary" outlined> <v-icon small left>fas fa-times-circle</v-icon> CANCEL</v-btn>
            <v-btn @click="validateSelectedMember()" :loading="mem_btn_loader" class="mx-2" color="light-blue darken-4" dark rounded>CONFIRM<v-icon small right>fas fa-check-circle</v-icon></v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- CONFIRM SELECTION DIALOG -->
    <v-dialog v-if="selection_confirm_disp" v-model="selection_confirm_disp" :max-width="confirm_display_width" persistent>
      <v-card>
        <v-card-title class="justify-center text-h6 light-blue darken-4 white--text text-center">SELECTION CONFIRMATION</v-card-title>
        <v-col cols="12" align="center">
          <h3 class="colorGrey font-weight-bold my-2">{{sel_hmo_name ? sel_hmo_name.toUpperCase() : hmo_host_code == "VC" ? "VALUCARE": "EUREKARE"}}</h3>
          <h4 class="colorGrey font-weight-medium mb-2">Name: <b>{{member_name.toUpperCase()}}</b></h4>
          <h4 class="colorGrey font-weight-medium mb-2">Policy Number: <b> {{ mem_policy_no }}</b></h4>
          <h4 class="colorGrey font-weight-medium mb-2">Birthday: <b> {{ birthdate ? $moment(birthdate).format('MM/DD/YYYY') : 'N/A' }}</b></h4>

            <v-divider class="my-5"></v-divider>
            <h3 class="colorGrey font-weight-bold mt-3 mb-2">PHILHEALTH</h3>
            <h4 class="colorGrey font-weight-medium mb-2">Name: <b>{{member_name.toUpperCase()}}</b></h4>
            <h4 class="colorGrey font-weight-medium mb-2">Birthday: <b>{{birthdate ? $moment(birthdate).format('MM/DD/YYYY') : 'N/A'}}</b></h4>
            <h6 class="mt-5"><i class="caption">Note: <b>Selected patient is listed above. Please make sure that you have chosen the correct member/ patient for this transaction.</b></i></h6>
        </v-col>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn @click="selection_confirm_disp = false" :disabled="confirm_loader" class="btn mr-2" color="secondary" outlined rounded> <v-icon small left>fas fa-times-circle</v-icon> CANCEL </v-btn>
          <v-btn @click="confirmSubmit()" :loading="confirm_loader" class="btn ml-2" color="light-blue darken-4 white--text" rounded> CONFIRM <v-icon small right>fas fa-check-circle</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- LOGIN ADMIN ACCOUNT -->
    <v-dialog v-if="show_login_facility" v-model="show_login_facility" max-width="600" persistent>
      <v-card>
        <v-card-title class="justify-center text-h6 light-blue darken-4 white--text text-center">Login</v-card-title>
        <v-row no-gutters> 
          <v-col cols="12" align="start" class="px-4 py-6">
            <v-text-field v-model="admin_username" label="Username" outlined dense> </v-text-field>
            <v-text-field v-model="admin_password" label="Password" type="password" outlined dense> </v-text-field>
            <span class="text-caption font-italic"> * Before to proceed please ask your admin or MIS to register this terminal for offline transaction</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn @click="adminLogin()" :loading="admin_loader" class="btn" color="light-blue darken-4 white--text" rounded> CONFIRM <v-icon small right>fas fa-check-circle</v-icon>
          </v-btn>

          <v-btn @click="cancelAdminLogin()" :loading="cancel_admin_loader" class="btn" rounded outlined> <v-icon small left>fas fa-close</v-icon> CANCEL 
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--ADD ATC CODE -->
    <v-dialog v-if="add_atc_code" v-model="add_atc_code" max-width="700" persistent>
      <v-card>
        <v-card-title class="justify-center text-h6 light-blue darken-4 white--text text-center">ADD AUTHORIZATION TRANSACTION CODE</v-card-title>
        <v-col cols="12" align="start" class="px-4">
          <v-text-field v-model="atc_code" label="ATC Code" outlined dense :error-messages="atc_code_error"> </v-text-field>
          <v-sheet class="d-flex justify-space-between align-baseline"> 
            <h3 class="text-body-2"> <span class="font-weight-bold"> PHIC PIN:  </span> {{ eligible_data.pPatientPin }} </h3>
            <div>
              <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                  <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" :value="format_date_eff" :error="eff_required_fields" label="Effectivity Date" class="mb-4" readonly hide-details dense style="width: 220px;"> </v-text-field>
                  </template>
                  <v-date-picker v-model="selected_eff_date" :error="eff_required_fields" :max="max_date" no-title></v-date-picker>
              </v-menu>
            </div>
          </v-sheet>
        </v-col>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn @click="confirmSubmit()" :loading="confirm_loader" class="btn mr-2" color="secondary" outlined rounded> <v-icon small left>fas fa-check-circle</v-icon> PROCEED W/O ATC CODE </v-btn>
          <v-btn @click="checkAtcCode()" :loading="atc_confirm_loader" class="btn ml-2" color="light-blue darken-4 white--text" rounded> CONFIRM <v-icon small right>fas fa-check-circle</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- PATIENT MISMATCHED -->
    <v-dialog v-if="patient_mismatch_alert" v-model="patient_mismatch_alert" :max-width="confirm_display_width" persistent>
      <v-card>
        <v-card-title class="justify-center"><v-icon color="yellow dakren-1" :size="$vuetify.breakpoint.name === 'xs' ? 50 : 75">mdi-alert-circle</v-icon></v-card-title>
        <v-card-title class="text-uppercase justify-center caption text-sm-subtitle-1 mb-2 ">Cannot Proceed with the Transction</v-card-title>
        <v-card-subtitle class="text-center caption text-sm-body-2">Data mismatched</v-card-subtitle>
        <h4 class="mb-sm-3   grey--text text--darken-3 text-center caption text-sm-subtitle-1"><b class="grey--text text--darken-4">{{sel_hmo_name}}</b></h4>
        <h4 class="mb-sm-3  font-weight-medium grey--text text--darken-3 text-center caption text-sm-subtitle-1">Name: <b class="grey--text text--darken-4">{{member_name}}</b></h4>
        <h4 class="mb-sm-3  font-weight-medium grey--text text--darken-3 text-center caption text-sm-subtitle-1">Birthday: <b class="grey--text text--darken-4"> {{selected_birthday}}</b></h4>
        
        <div style="padding:0 5em">
          <v-divider class="my-2 my-sm-4 "></v-divider>
        </div>
        <h4 class="mb-sm-3  text-center caption text-sm-subtitle-1"><b>PHILHEALTH</b></h4>
        <h4 class="mb-sm-3  font-weight-medium grey--text text--darken-3 text-center caption text-sm-subtitle-1">Name: <b class="grey--text text--darken-4">{{typein_fullname}}</b></h4>
        <h4 class="mb-sm-4  font-weight-medium grey--text text--darken-3 text-center caption text-sm-subtitle-1">Birthday: <b class="grey--text text--darken-4"> {{typein_birthdate}}</b></h4>
        <br/>
        <h6 class="font-weight-light text-center text-sm-subtitle-2" ><i>Note: <b >Please make sure that your data from Health Insurance Company and Philhealth are the same.</b></i></h6>

        <v-col cols="12" class="d-flex justify-center">
          <v-btn @click="patient_mismatch_alert = false" color="primary" class="py-5 my-5 text-center ">Ok</v-btn>
        </v-col>
      </v-card>      
    </v-dialog>

    <v-dialog v-if="user_verification" v-model="user_verification" max-width="700" persistent>
      <UserVerify @displayMemberData="displayMemberData" @closeVerification="verifyCancel" />
    </v-dialog>

    <v-dialog v-model="consent_dialog"  width="850" persistent>
        <v-card>
            <v-layout wrap class="pa-5 flex-column">
                <h1 class="title text-center mb-5">PATIENT CONSENT</h1>
                <p class="text-body">
                    I hereby confirm that I understand the foregoing and that I am voluntarily giving my consent to the processing of my Personal Data under the terms and conditions provided above. 
                    Furthermore, I understand that: 
                </p>
                <ul>
                    <li>The consent I am giving through this form is in addition to any other consent that I may give/have given regarding the use of my personal data (e.g., in relation to medical treatment or procedure). </li>
                    <li>The consent will remain in full force until I revoke it in writing.</li>
                    <li>I give my consent to use my photo and personal data to produce my membership card</li>
                </ul>

            </v-layout>

            <v-card-actions class="justify-center py-5">
                <v-btn @click="consent_dialog = false" class="pa-5">I Disagree</v-btn>
                <v-btn @click="consent_dialog = false" color="primary" class="py-5 px-6">I Agree</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  
    <v-overlay v-if="overlay_loader" :value="overlay_loader" z-index="9999"> 
      <v-progress-circular indeterminate size="35"></v-progress-circular>
      <span v-if="lgu_overlay" class="ml-3 text-h6 font-weight-regular" >Loading... Please Wait...</span>
      <span v-else class="ml-3 text-body-1 text-sm-h6  font-weight-regular" > Checking PHIC Account...Please Wait</span>
    </v-overlay>
  
    <Alert :alert="alert" @confirmSubmit="confirmSubmit" @confirmButton="confirmAlert" @changeStatus="changeStatus" ref="alert"/>
  </v-container>
</template>

<script>
// import { mask } from "vue-the-mask";
import Navbar from "@/components/Navbar.vue";
import Alert from '@/components/Alert.vue';
import HeaderPage from "@/components/e-benefit/code-scanning/Header.vue";
import UserVerify from "@/components/e-benefit/code-scanning/UserVerification.vue"

const xml = require("xml-js");
export default {
  // directives: { mask },
  name: 'Offline-Transaction',
  components: {
    Navbar,
    Alert,
    HeaderPage,
    UserVerify
  },
  data() {
    return {
      max_date: this.$moment().format('YYYY-MM-DD'),
      // verification_rules: [v => !!v && !/^ *$/.test(v)],
      // form_loading: false,
      // first_name: '',
      // middle_name: '',
      // last_name: '',
      // birthdate_picker: '',
      // birthdate_mask: '##-##-####',
      member_consent: false,
      consent_rules: [v => v],
      consent_dialog: false,

      // PROCESS
      qr_page_process: '',
      process_type:'',
       
      // PROVIDER CONFIG LOGO
      prv_config: localStorage.getItem('dskDo3Y') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('dskDo3Y'),'ldoweSf').toString(this.$crypto.enc.Utf8)) : null, 

      // ADMISSION PROCESS
      admission_items:[
        {
          id:'qrscanner',
          name: 'QR Scanner',
          subtitle: 'Scan QR Code on card to initiate a medical transaction.',
          icon: 'mdi-qrcode-scan',
          btn_name: 'Scan QR Image',
        },
      ],

      // QR/SMS RELATED DATA
      qr_filename: '',
      qr_data: '',
      qr_img:'',
      sms_code: '',
      is_qr_scanner: false,

      // QR SCANNER RELATED
      qrScanner: null,

      //OFFLINE TRANSCTION FOR LOGIN FACILITY
      show_login_facility: false,
      facility_username: '',
      facility_password: '',

      //ATC CODE AND FOR EKONSULTA
      eligible_data: [],
      add_atc_code: false,
      show_alert_ekonsulta: false,
      atc_response: '',
      atc_code: '',
      atc_code_error: '',
      awaiting_atc_code: false,

      // USER RELATED DATA
      mem_policy_no: '',
      hmo_host_code: '',
      lgu_host_code: '',
      ek_lgu_id: '',
      ek_phic_id: '',
      registration_type: '',
      fname: '',
      lname: '',
      mname: '',
      suffix: '',
      birthdate: '',
      member_name:'',

      // DIALOGS
      member_selection_dialog: false,
      selection_confirm_disp: false,
      confirm_loader: false,
      atc_confirm_loader: false,

      // MEMBER SELECTION DIALOG
      member_headers: [
          { text: "MEMBER ID", value: "mem_hmo_policy_number", width:'150px'},
          { text: "NAME", value: "mem_first_name", width: '150px'},
          { text: "MEMBER TYPE", value: "mem_hmo_type", width: '150px'},
          { text: "PHOTO", value: "mem_photo", width: '150px' },
      ],
    
      member_headers_lgu: [
          { text: "MEMBER ID", value: "ek_lgu_id", width:'150px'},
          { text: "NAME", value: "mem_first_name", width: '150px'},
          { text: "MEMBER TYPE", value: "lgu_member_type", width: '150px'},
          { text: "PHOTO", value: "mem_photo", width: '150px' },
      ],
      member: [],
      search:'',
      selected_ek_lgu_id: '',
      selected_ek_hmo_id: '',
      selected_birthday: '',
      mem_btn_loader: false,
      member_selection_loader: false,

      // NAVBAR DATA
      navbar: [],

      // CANCELLATION TOKENS FOR API/CONTROLLER AND TIMEOUT 
      cancelToken: null,
      source: null,
      qr_timeout: '',
      sms_timeout: '',
      qr_reload_timeout:'',

      //FOR RESIZE
      windowSize: {x: 0,y: 0},
      heroes_health_logo:'250',
      confirm_display_width:"60%",
      text_title:'font-size: 1.17em',
      icon_size: '75',

      // OVERLAY
      lgu_overlay: false,
      overlay_loader: false,

      patient_mismatch_alert: false,

      // OTHERS
      loading_qr_scanner: false,
      alert: {},

      user_verification: false,

      admin_username: '',
      admin_password: '',
      admin_loader: false,
      cancel_admin_loader: false,

      selected_eff_date: '',
      eff_required_fields: false,

      ekonsulta_err: false
    }
  },

  created() {
    let now_date = new Date()

    if(!this.$store.state.facility_head.value) {
      this.show_login_facility =  true

    } else {
      if(now_date.getTime() > this.$store.state.facility_head.expiry) {
        localStorage.removeItem('jhuhyW5')
        
      } 
      this. show_login_facility = false
    }

    this.$store.commit('removeMemberData')
    sessionStorage.clear();
  },

  computed:{
    uniqueUrl(){
      return '?'+Math.random().toString(25).substring(3, 20)
    },

    format_date_eff() {
        if(this.selected_eff_date !== '') {
            return this.$moment(this.selected_eff_date).format('MMMM D, YYYY')
        }

        return ''
    }
  },
  
  watch: {
    'alert.display'(value) {
      if (!value && this.awaiting_atc_code) { 
        this.add_atc_code = true;
        this.awaiting_atc_code = false; 
      }
    }
  },

  methods: {
    proceedToEMR() {
      this.$store.commit('set_doctor_for_offline_transaction', this.selected_doctor)
      this.$router.push('/patient-queue-list')
    },

    preConsultation() {
      this.user_verification = true
      //this.openDialog('qrscanner');
    },

    openConsentDialog(){
      this.consent_dialog = true
    },

    verifyCancel(){
      this.user_verification = false
      this.empty_field = false;
    },

    async cancelAdminLogin(){
      this.cancel_admin_loader = true
      await this.$refs.alert.logoutUser()
    },

    async adminLogin() {
      if (this.admin_username || this.admin_password) {
        this.admin_loader = true
        let adm_password = this.$crypto.SHA1(this.admin_password).toString();
        let response = await this.$services.prvValidateAdminAcctReg({
            provider_tin: this.$store.state.prv_data.provider_tin,
            provider_code: this.$store.state.prv_data.provider_code,
            username: this.admin_username,
            password: adm_password
        })

        if (response.status === 200) {
          response.data =  this.responseDataDecryption(response.data)
          if (response.data.account_validate == 0) {
            this.admin_loader = false
             this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'Invalid Username or Password', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          } else {
            this.admin_loader = false
            this.show_login_facility = false
            let login_admin = true
            this.$store.commit('set_admin_login_facility', login_admin)
          }
        } else {
          this.alert = response.error
        }
      } 
      else {
        this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Field is empty/Invalid Value', body: 'Please enter your username and password', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }
    },

    // async validateUser() {
    //   if (this.$refs.form.validate() && this.member_consent) {
    //     this.form_loading = true
    //     let response = await this.$services.wsMemberWeb({
    //         key: 'eurekare_key_web',
    //         data: {
    //             command: 322101001,
    //             data: {
    //                 first_name: this.first_name,
    //                 last_name: this.last_name,
    //                 birthdate: this.$moment(this.birthdate, 'MM-DD-YYYY', true).format('YYYY-MM-DD')
    //             }
    //         }
    //     })

    //     if (response.status === 200) {
    //         response.data = this.responseDataDecryption(response.data)
    //         const { lgu_data } = response.data
    //         if(lgu_data.length !== 0) {
    //           this.displayMemberData(lgu_data.ek_lgu_id)
    //         } else {
    //            this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'blue darken-1', title: 'Member Verification', body: 'This person is not part of eCare System', btn_pry_txt: 'CANCEL', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert'}
    //         }
    //         this.form_loading = false
    //     } else {
    //       this.alert = response.error
    //     }
    //   }
    // },
  
    goToRegistration() {
      this.$router.push({ path: '/registration', params: { name: 'offline' }});
    },

    ekonsultaSubmission() {
      this.$router.push('/ekonsulta-submission');
    },

    goToQueueList(){
      this.$router.push('/offline-queue-list');
    },
  
    // FOR DISPLAYING THE LIST OF MEMBERS
    async displayMemberData(ek_lgu_id) {
      this.member_selection_dialog = true;
      this.member_selection_loader = true
      this.empty_field = true;

      let response = await this.$services.getMemberListQr({
          mem_hmo_policy_numbe: this.mem_policy_no,
          hmo_host_code: this.hmo_host_code,
          ek_lgu_id: ek_lgu_id,
          provider_code: this.$store.state.prv_data.provider_code,
          lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
      })
      
      if (response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          this.member_selection_loader = false
          this.empty_field = false;
          
          this.process_type = 'LGU'

          this.member = response.data.member_data.filter(item => item.ek_lgu_id === ek_lgu_id)
      } else {
        this.member_selection_loader = false
        this.alert = response.error
      }
    },

    // FOR SELECTING DATA IN MEMBER SELECTION DIALOG
    selectedRowLGU(item) {
      this.selected_ek_lgu_id = item.ek_lgu_id
      this.ek_lgu_id = item.ek_lgu_id
      this.lgu_host_code = item.lgu_host_code 
    
      this.fname = item.mem_first_name ? item.mem_first_name : '';
      this.lname = item.mem_last_name ? item.mem_last_name : '';
      this.mname = item.mem_middle_name ? item.mem_middle_name : '';
      this.suffix = item.mem_suffix ? item.mem_suffix : ''
      this.birthdate = item.mem_birthdate ? item.mem_birthdate : null
    },

    selectedRow(item) {
      this.member_name = item.member_name
      this.selected_ek_hmo_id = item.ek_hmo_id;
      this.selected_birthday = item.mem_birthdate
      this.mem_policy_no = item.mem_hmo_policy_number
      this.ek_lgu_id = item.ek_lgu_id ? item.ek_lgu_id : null;
      this.ek_phic_id = item.ek_phic_id ? item.ek_phic_id : null;
      this.lgu_host_code = item.lgu_host_code ? item.lgu_host_code : null;

      if (this.catch_data.restriction === true && this.mem_policy_no !== this.catch_data.policy.toUpperCase() && this.member_name.toUpperCase().trim() !== this.catch_data.name.toUpperCase().trim()) {
        this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'You cannot select this member', body: 'Patient Data mismatched.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        this.member_name = "";
        this.mem_policy_no = "";
      }

      this.fname = item.mem_first_name ? item.mem_first_name : '';
      this.lname = item.mem_last_name ? item.mem_last_name : '';
      this.mname = item.mem_middle_name ? item.mem_middle_name : '';
      this.suffix = item.mem_suffix ? item.mem_suffix : ''
      this.birthdate = item.mem_birthdate ? item.mem_birthdate : null
    },

    //CHECK FOR EKONSULTA ELIGIBILITY
    async checkEkonsultaEligibility() {
      this.mem_btn_loader = true
      let response = await this.$services.getEkonsultaEligibilityChecker({
        pHciAccreNo: this.$store.state.prv_data.ekonsulta_phic_acc_no,
        pPatientFname: this.member[0].mem_first_name,
        pPatientMname: this.member[0].mem_middle_name,
        pPatientLname: this.member[0].mem_last_name,
        pPatientExtname: this.member[0].mem_suffix,
        pPatientDob: this.member[0].mem_birthdate,
        pPhicPin: this.member[0].mem_phic_pin,
        pPatientType: this.member[0].lgu_member_type === 'PRINCIPAL' ? 'MM' : 'DD',
        phic_token : this.$store.state.prv_data.phic_token
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        this.mem_btn_loader = false
        if(response.data.konsulta_eligible){  
          this.eligible_data = response.data
          return true;
         }
        return false;
      } else {

        this.ekonsulta_err = true
        this.eligible_data = { konsulta_eligible: false }
        // this.alert = response.error
      }
    },

    
      
    //CHECK FOR ECLAIMS ELIGIBILITY
    async getEclaimsWebService() {
      this.mem_btn_loader = true
      let response = await this.$services.getEclaimsWebService({
          provider_code: this.$store.state.prv_data.provider_code,
          request_key: "GMPM",
          data: {
              firstname: this.member[0].mem_first_name,
              middlename: this.member[0].mem_middle_name,
              lastname: this.member[0].mem_last_name,
              suffix: this.member[0].mem_suffix ? this.member[0].mem_suffix : "",
              birthdate: this.formatDate(this.member[0].mem_birthdate)
          }
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        this.mem_btn_loader = false
        if(response.data.pin){          
          this.eligible_data = {
            ...this.eligible_data,
            eclaims_eligible: response.data.pin ? true : response.data.success
          }
          return true;
        } 
        return false; 
      } else {
        this.alert = response.error
      }
    },

    //CHECK FOR THE ATC CODE
    async checkAtcCode() {
      if(this.atc_code && this.selected_eff_date){
        this.atc_confirm_loader = true
        let response = await this.$services.getEkonsultaAtcChecker({
            pPatientPin: this.eligible_data.pPatientPin,
            pATC: this.atc_code,
            pEffectivityDate: this.formatDate(this.format_date_eff),
            phic_token: this.$store.state.prv_data.phic_token
        })

        if (response.status === 200) {
            response.data = this.responseDataDecryption(response.data)

            if(response.data.valid){
              this.atc_response = response.data.pATC
              this.overlay_loader = true
              this.lgu_overlay    = true
              this.atc_confirm_loader = false
              this.atc_code_error = ''
              this.eff_required_fields = false
              this.proceedEligibility()
            } else {
              this.atc_code_error = 'This ATC Code is Invalid'
              this.eff_required_fields = false
              this.atc_confirm_loader = false
            }
        } else {
          this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red',  title: 'AUTORIZATION TRANSACTION CODE', body: 'There was a problem in Philhealth web service. Please try again later.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      } else {
        this.atc_code_error = this.atc_code ? "" : 'Required'
        this.eff_required_fields = this.selected_eff_date ? false : true
        this.atc_confirm_loader = false
      }
    },

    // VALIDATES SELECTED DATA WHEN USER CLICKS CONFIRM IN MEMBER SELECTION DIALOG
    async validateSelectedMember() {
      if (this.process_type === 'LGU') {
        if(this.selected_ek_lgu_id) {
          this.mem_btn_loader = true

          let eligible_in_ekonsulta = false;
          let eligible_in_eclaims = false;

          if (this.$store.state.prv_config.ekonsulta_accre) {
            let ekonsulta_response = await this.checkEkonsultaEligibility();
            eligible_in_ekonsulta = ekonsulta_response;
          }
          
          if (this.$store.state.prv_config.eclaims_accre) {
            let eclaims_response = await this.getEclaimsWebService();
            eligible_in_eclaims = eclaims_response;
          }
          
          if (this.$store.state.prv_config.ekonsulta_accre && eligible_in_ekonsulta && eligible_in_eclaims) {
            this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-check-circle', color: 'success', title: 'Eligibility Confirmation', body: 'This member is eligible for both eClaims and Yakap.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
            this.awaiting_atc_code = true
          } 
          else if(this.$store.state.prv_config.eclaims_accre && eligible_in_ekonsulta && eligible_in_eclaims) {
            this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-alert-circle', color: 'success', title: 'eClaims Eligibility', body: 'This member is eligible for both eClaims and Yakap.', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', ekonsulta: true, btn_sec_txt: 'Ok', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'loadingBtn',  btn_sec_emt:'confirmSubmit'}
          }
          else if (eligible_in_ekonsulta) {
            this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-check-circle', color: 'success', title: 'Yakap Eligibility', body: 'This member is eligible for Yakap.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            this.awaiting_atc_code = true
          } 
          else if (eligible_in_eclaims) {
            this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-check-circle', color: 'success', title: 'eClaims Eligibility', body: 'This member is eligible for eClaims', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', ekonsulta: true, btn_sec_txt: 'Ok', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'loadingBtn',  btn_sec_emt:'confirmSubmit'}
          }
          else {
            this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-alert-circle', color: 'primary', title: 'eClaims and Yakap Eligibility', body: 'This member is not eligible for both eClaims and Yakap. You can register the member through the PhilHealth portal.', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', ekonsulta: true, btn_sec_txt: 'Ok', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'loadingBtn',  btn_sec_emt:'confirmSubmit'}
          }

          if(this.ekonsulta_err){
            this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-alert-circle', color: 'primary', title: 'Philhealth Yakap Eligibility', body: 'Connection to the PhilHealth server failed. The system cannot verify member eligibility at this time.', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', ekonsulta: true, btn_sec_txt: 'Ok', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'loadingBtn',  btn_sec_emt:'confirmSubmit'}
          }

        } else {
            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Selection required', body: 'Please select a member', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        }
      } else { //HMO | HMO_PHIC | HMO_PHIC_LGU | HMO_LGU
        if (!this.selected_ek_hmo_id || !this.mem_policy_no) {
            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Selection required', body: 'Please select a member', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        } else {
          if (this.qr_page_process === 'qr_sms' && (this.registration_type === 'HMO_PHIC' || this.registration_type === 'HMO_PHIC_LGU')) {
            if (!this.fname && !this.lname && !this.birthdate) {
                this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Cannot Check Philhealth Eligibility Status', body: 'Member Name is Incomplete', btn_pry_txt: 'cancel', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert',  btn_sec_txt: 'Proceed Eligibility', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'loadingBtn',  btn_sec_emt:'confirmSubmit'}
                return
            }
            this.overlay_loader = true; 
            // this.callPHICApi(this.mem_policy_no,this.qr_first_name,this.qr_middle_name,this.qr_last_name,this.qr_suffix,this.qr_mem_birthdate,"","qr_sms");
        
          } else if (this.qr_page_process === 'qr_sms' && (this.registration_type === 'HMO' || this.registration_type === 'HMO_LGU')) {
              this.mem_btn_loader = true
              this.overlay_loader = true
              this.lgu_overlay    = true
              this.process_type = this.registration_type === 'HMO_LGU' ? 'HMO_LGU' : 'HMO'

              const data = await this.getMemberRequest()
              if(data.has_data === false) {
                this.proceedEligibility()
              } else {
                this.proceedELOA(data.data)
              }
          } else { // TYPE IN 
            if (this.qr_page_process === 'type_in' && this.process_type === 'HMO') {
                this.mem_btn_loader = true
                this.overlay_loader = true
                this.lgu_overlay    = true
                const data = await this.getMemberRequest()
                if(data.has_data === false) {
                  this.proceedEligibility()
                } else {
                  this.proceedELOA(data.data)
                }
            } else {
              if (this.member_name.trim() !== this.typein_fullname && this.selected_birthday !== this.$moment(this.typein_birthdate).format('YYYY-MM-DD'))  return this.patient_mismatch_alert = true
              this.selection_confirm_disp = true
            }
          }
        }
      }
      
    },

    // WHEN USER CLICKS CONFIRM IN SELECTION CONFIRM DIALOG
    async confirmSubmit() {
      this.confirm_loader = true
      this.overlay_loader = true
      this.lgu_overlay    = true
      //this.show_alert_ekonsulta = false
      const data = await this.getMemberRequest()
      if(data.has_data === false) {
        this.proceedEligibility()
      } else {
        this.proceedELOA(data.data)
      }
    },

    // GET THE DATA FROM API FOR VALIDATING IF PROCEED TO ELIGIBILITY OR ELOA
    async getMemberRequest(){
      let response = await this.$services.getMemberRequestType({
          hmo_policy_number :this.mem_policy_no,
          provider_code: this.$store.state.prv_data.provider_code,
          provider_tin: this.$store.state.prv_data.provider_tin,
          hmo_host_code: this.hmo_host_code,
          ek_phic_id: this.ek_phic_id
      })

      if (response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          if (response.data.has_pending_transaction) {
            this.mem_btn_loader = false
            this.overlay_loader = false
            this.lgu_overlay    = false
            this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: "Transaction on going", body: 'This patient has on going transaction and needs to be completed before proceeding to another transaction', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          } else {
            return response.data
          }
      } else {
        this.alert = response.error
      }
    },

    // SUBMITS DATA TO TRN ADD ELIGIBILITY AND REDIRECTS TO ELIGIBILITY PAGE
    async proceedEligibility() {
      let response = await this.$services.trnAddEligibility({
          provider_tin: this.$store.state.prv_data.provider_tin,
          provider_code: this.$store.state.prv_data.provider_code,
          transaction_type: "ELIGIBILITY",
          hmo_healthcare_status: "",
          mem_hmo_policy_number: this.mem_policy_no ? this.mem_policy_no : null,
          hmo_host_code: this.hmo_host_code ? this.hmo_host_code : null,
          ek_phic_id: this.ek_phic_id ? this.ek_phic_id : null,
          ek_lgu_id: this.ek_lgu_id ? this.ek_lgu_id : null,
          lgu_host_code : this.$store.state.usr_credentials.lgu_host_code ? this.$store.state.usr_credentials.lgu_host_code : null,
          created_by: this.$store.state.usr_credentials.user_name,

          ...(this.process_type !== 'HMO' ?  {
              last_name:  this.lname ? this.lname.toUpperCase() : null,
              first_name: this.fname ? this.fname.toUpperCase() : null ,
              middle_name: this.mname ? this.mname.toUpperCase() : null,
              initial: this.suffix ? this.suffix.toUpperCase() : null,
              birthday: '1993-05-05' //this.birthdate,
          } : undefined),

          ...(this.phic_member_eligibility_status === 'Eligible' ? {
              gender: this.mem_gender,
              email_add: this.mem_email,
              phone_no: this.mem_phone_no,
              mobile_no: this.mem_mobile_no,
              mailing_add: this.mailing_address,
              phic_member_type: this.member_type,
              phic_member_status: this.mem_phic_status,
              phic_member_category: this.member_category,
              prn_phic_member_type: this.member_type,
              prn_member_pin: this.mem_phic_pin,
              prn_first_name: this.principal_data.FIRST_NAME._text,
              prn_middle_name: this.principal_data.MIDDLE_NAME._text,
              prn_last_name: this.principal_data.LAST_NAME._text,
              prn_suffix: this.principal_data.SUFFIX._text,
              prn_initial: "",
              prn_birthday: this.principal_data.BIRTHDATE._text,
              prn_gender: this.principal_data.GENDER._text ? this.principal_data.GENDER._text.charAt(0) === "M"? "MALE": "FEMALE" : null,
              prn_zip_code: this.principal_data.ZIP_CODE._text,
              prn_phone_no: this.principal_data.PHONE_NO._text,
              prn_mobile_no: this.principal_data.MOBILE_NO._text,
              prn_email_add: this.principal_data.EMAIL_ADDRESS._text,
              phic_member_eligibility_status: this.phic_member_eligibility_status,
          } : undefined)
      })

      if (response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        if (!response.data.success) {
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          return
        }

        this.dataSession('eligibility',response.data.eligibility_request_id,null)
        this.$store.commit("setMemberAuth", Math.random().toString(25).substring(3, 15) + this.$moment().format("ss"));
        this.$router.push("/eligibility");
      } else {
        this.alert = response.error
      }
    },

    // PROCEEDS TO ELOA PAGE
    proceedELOA(eloa_data) {
      this.dataSession('eloa',null,eloa_data)
      this.$router.push("/eloa-list");
    },

    // SESSIONS THE DATA NEEDED BEFORE REDIRECTING TO A SPECIFIC PAGE
    dataSession(type,request_id,eloa_data) {
      let lgu_data = {}, member_phic_data = {}, trn_add_phic_data = {}, member_name = []

      if (this.process_type.includes('PHIC')) {
        member_name = [ this.fname, this.mname, this.lname, this.suffix, this.birthdate]
        member_phic_data = {
          ek_phic_id: this.ek_phic_id,
          mem_phic_pin: this.mem_phic_pin,
          phic_tracking_num: this.phic_tracking_number,
          mem_phic_mem_type: this.member_type ? this.member_type: "N/A",
          mem_category: this.member_category ? this.member_category: "N/A",
          mem_mailing_address: this.mailing_address ? this.mailing_address : "N/A",
          mem_name: this.phic_member_name ? this.phic_member_name.toUpperCase(): "N/A",
          mem_ph_status:  this.mem_phic_status ? this.mem_phic_status : this.phic_member_eligibility_status,
          principal_data: this.principal_data ? this.principal_data: [],
          ...(this.process_type === 'PHIC' || this.process_type === 'HMO_PHIC' ? {
              mem_gender           : this.mem_gender,
              mem_mobile_number    : this.mem_mobile_number, 
              mem_landline_number  : this.mem_landline_number, 
              mem_email_address    : this.mem_email,
              mem_company_name     : this.mem_company_name, 
          } : undefined) 
        }

        sessionStorage.setItem("JFD43",this.$crypto.AES.encrypt(JSON.stringify(member_name),"lfFo34sf")); // MEMBER_NAME
        sessionStorage.setItem("MPS24",this.$crypto.AES.encrypt(JSON.stringify(member_phic_data),"lfFo34sf"));// MEMBER_PHIC_DATA
        sessionStorage.setItem("ROTSR",this.$crypto.AES.encrypt(this.phic_member_eligibility_status,"lFdt04sg"));// ELIGIBILITY STATUS
      }

      if (this.process_type.includes('LGU')) {
        lgu_data = { ek_lgu_id : this.ek_lgu_id, lgu_host_code : this.lgu_host_code}
        sessionStorage.setItem("LMS35", this.$crypto.AES.encrypt(JSON.stringify(lgu_data), "lfFo34sf")); // MEMBER LGU DATA
        let eligible_data = {}
        
        if (this.eligible_data.konsulta_eligible) {
          eligible_data = {
            atc: this.atc_response ? this.atc_response:'WALKEDIN', 
            ...this.eligible_data
          }
          
        }  
        else if (this.eligible_data.eclaims_eligible) {
          eligible_data = {
              konsulta_eligible: false,
              eclaims_eligible: true
          }
        }
        else {
          eligible_data = {
              konsulta_eligible: false,
              eclaims_eligible: false
          }
        }

        sessionStorage.setItem("YETBS",this.$crypto.AES.encrypt(JSON.stringify(eligible_data),"ygrGk2dX")); // EKONSULTA INFORMATION
      }

      if (this.process_type.includes('HMO')) {
        sessionStorage.setItem("IJ19Y0X15I",this.$crypto.AES.encrypt(this.hmo_host_code,"heIu1h1Dn1w").toString());
        sessionStorage.setItem("IJ9NX250I15", this.$crypto.AES.encrypt(this.mem_policy_no, "heIu1h1Dn1w").toString());
        request_id && type === 'eligibility' ? sessionStorage.setItem("ETR6G",this.$crypto.AES.encrypt(request_id,"lfFo34sf")) : null
      }

      if (type === 'eloa') {
        sessionStorage.setItem("LSD0IDX",this.$crypto.AES.encrypt(JSON.stringify(eloa_data),"heIu1h1Dn1w")); //ELOA DATA
        sessionStorage.setItem("ISDTYXL", this.$crypto.AES.encrypt(JSON.stringify(this.member_name), "heIu1h1Dn1w")); //MEMBER NAME
        if(this.process_type.includes('PHIC')) {
          trn_add_phic_data = {
            ek_phic_id: this.ek_phic_id,
            phic_member_type: this.member_type,
            phic_member_category: this.member_category,
            last_name: this.lname ? this.lname.toUpperCase() : '',
            first_name: this.fname ? this.fname.toUpperCase() : '',
            middle_name: this.mname ? this.mname.toUpperCase() : '',
            initial: this.suffix ? this.suffix : '',
            birthday: this.birthdate ? this.birthdate : '',
            gender: this.mem_gender,
            email_add: this.mem_email,
            phone_no: this.mem_phone_no,
            mobile_no: this.mem_mobile_no,
            mailing_add: this.mailing_address,
            prn_member_pin: this.mem_phic_pin,
            principal_data: this.principal_data,
            prn_phic_member_type: this.member_type,
            phic_member_status: this.mem_phic_status,
            provider_tin: this.$store.state.prv_data.provider_tin,
            phic_tracking_number: this.phic_tracking_number? this.phic_tracking_number: "N/A",
          };
          sessionStorage.setItem("TRP3S",this.$crypto.AES.encrypt(JSON.stringify(trn_add_phic_data),"lfFo34sf"));//TRN_ADD_PHIC_DATA
        }
      }
      sessionStorage.setItem("GF45S", this.$crypto.AES.encrypt(this.process_type,"fgGds32s"))
    },

    // CANCELS THE MEMBER SELECTION DIALOG
    showCancel() {
        
        this.alert = { 
        display: true, 
        type: 'standard', 
        width: '550', 
        icon: 'mdi-help-circle', 
        color: 'blue darken-1', 
        title: 'Are you sure you want to cancel?', 
        body: 'This will reload the page and you will have to make an entry again', 
        btn_pry_txt: 'yes', 
        btn_pry_color: 'primary', 
        btn_pry_otl: false, 
        btn_pry_act: this.process_type.includes('HMO') ? 'loadingBtn' : 'reloadPage',  
        btn_pry_emt: this.process_type.includes('HMO') ? 'cancel' : '',
        btn_sec_txt: 'no', 
        btn_sec_color: 'secondary', 
        btn_sec_otl: true, 
        btn_sec_act: 'closeAlert',
      }
    },

    async cancel() {
      let response = await this.$services.trnDelNameById({
          mem_hmo_policy_number   :   this.mem_policy_no ? this.mem_policy_no : this.policy_typein.trim(),
      })

      if (response.status === 200) {
        this.$router.go()
      } else {
        this.alert = response.error
      }
    },

    async callPHICApi(policy,fname,mname,lname,suffix,bday,fullname,mem_data,type) {
      let response = await this.$services.getMemberEligibilityPhic({
          mem_first_name: fname,
          mem_middle_name: mname,
          mem_last_name: lname,
          mem_suffix_name: suffix,
          mem_birthdate: this.$moment(bday).format('YYYY-MM-DD')
      })

      if (response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        let xml_result = xml.xml2json(response.data, {compact: true,spaces: 4,});
        let result = JSON.parse(xml_result)
        let title = ''
        let subtitle = ''
        let body = 'Do you want to proceed to Eligibility Page?'//+sub_body
        let icon = "fas fa-exclamation-circle"
        let color = "red lighten-1"
        let on_alert = false   
        let proceed_eligibility = false 

        this.overlay_loader = false;
        // GET DATA IF RESULT IS 1
        if(result.RESPONSE._attributes.RESULT === "1") {
          this.phic_host_code       = result.RESPONSE._attributes.HOST_CODE;
          this.phic_member_name     = result.RESPONSE.MEMBER_DATA.FIRST_NAME._text +" " +result.RESPONSE.MEMBER_DATA.LAST_NAME._text +" " +result.RESPONSE.MEMBER_DATA.MIDDLE_NAME._text;
          this.mem_phic_pin         = result.RESPONSE.PATIENT_DATA._attributes.MEMBER_PIN ? result.RESPONSE.PATIENT_DATA._attributes.MEMBER_PIN : null;
          this.ek_phic_id           = result.RESPONSE.PATIENT_DATA._attributes.PATIENT_EK_PHIC_ID ? result.RESPONSE.PATIENT_DATA._attributes.PATIENT_EK_PHIC_ID : null;
          this.mem_gender           = result.RESPONSE.PATIENT_DATA.GENDER._text ?  result.RESPONSE.PATIENT_DATA.GENDER._text.charAt(0) === "M" ? "MALE" : "FEMALE" : 'MALE';
          this.mem_phone_no         = result.RESPONSE.PATIENT_DATA.PHONE_NO._text;
          this.mem_mobile_no        = result.RESPONSE.PATIENT_DATA.MOBILE_NO._text;
          this.mem_email            = result.RESPONSE.PATIENT_DATA.EMAIL_ADDRESS._text;
          this.mem_company_name     = result.RESPONSE.PATIENT_EMPLOYMENT.COMPANY_NAME._text;
          this.mem_phic_status      = result.RESPONSE.PATIENT_DATA._attributes.MEMBER_STATUS;
          this.member_type          = result.RESPONSE.PATIENT_DATA._attributes.MEMBER_TYPE ? result.RESPONSE.PATIENT_DATA._attributes.MEMBER_TYPE.charAt(0) ==="P" ? "PRINCIPAL": "DEPENDENT" : null;
          this.principal_data       = result.RESPONSE.MEMBER_DATA;
          this.member_category      = result.RESPONSE.PATIENT_DATA._attributes.MEMBER_CATEGORY;
          this.mailing_address      = result.RESPONSE.PATIENT_DATA.MAILING_ADDRESS._text;
          this.phic_tracking_number = result.RESPONSE._attributes.PHIC_TRACKING_NUMBER ? result.RESPONSE._attributes.PHIC_TRACKING_NUMBER : 'N/A';
        }

        switch (result.RESPONSE._attributes.RESULT) {
          case "1":
            if (mem_data && type === 'type_in') { // TYPE IN WITH HMO
              this.catch_data.name = fullname ? fullname.toUpperCase() : ''
              this.catch_data.policy = policy;
              this.catch_data.birthdate = bday;
              this.catch_data.restriction = true;

              this.member_selection_dialog = true
              this.overlay_loader = false
              this.typein_loader = false
              this.process_type = 'HMO_PHIC';
            } else if (mem_data && type === 'qr_sms') { // QR/SMS
              this.selection_confirm_disp = true;
              this.process_type = this.registration_type === 'HMO_PHIC_LGU' ? 'HMO_PHIC_LGU' : 'HMO_PHIC';
            } else { // QR/SMS OR TYPEIN WITHOUT MEM_DATA
              on_alert = policy ? true : false 
              proceed_eligibility = true
              title = 'No record found in Health Insurance Company'
              this.process_type =  this.registration_type === 'PHIC_LGU' ? 'PHIC_LGU' : 'PHIC';
            }
            this.phic_member_eligibility_status = "Eligible";
            break;

          case "2":
            on_alert = true
            title ='Patient: <h4 class="font-weight-medium">' +fullname+"</h4>";
            body = "is currently admitted"
            this.typein_loader = false
            break;

          case "3":
            on_alert = true
            if (mem_data) {
              subtitle = '<h5 class="mb-2">This Transaction might be covered by HMO only.</h5>'
              title ='Multiple records found for patient: <h4 class="font-weight-medium">' +fullname+'</h4><h4 class="font-weight-medium">' +bday+'</h4>'+ subtitle;
              this.submit_confirm = true
              this.process_type = this.registration_type === 'HMO_PHIC_LGU'  ? 'HMO_PHIC_LGU' : 'HMO_PHIC';
            } else {
              subtitle =  policy ? '<h5 class="mb-2">on both Health Insurance Company and PhilHealth.</h5>' : ''
              title ='Multiple records found for patient: <h4 class="font-weight-medium">' +fullname+'</h4><h4 class="font-weight-medium">' +bday+'</h4>'+ subtitle;
              this.process_type = this.registration_type === 'PHIC_LGU' ? 'PHIC_LGU' : 'PHIC';
            }
            this.phic_member_eligibility_status = "Multiple Records Found"; 
            break;

          case "4":
            on_alert = true
            icon  = "fas fa-exclamation-circle"
            color = "yellow darken-1"
            title = "Transaction On Going"
            body  = "This patient has on going transaction and needs to be completed before proceeding to another transaction."
            this.typein_loader = false
            break;

          default:
            on_alert = true
            if (mem_data) {
              subtitle = '<h5 class="mb-2">This Transaction might be covered by HMO only.</h5>'
              title ='No record found for patient:<h4 class="font-weight-medium">' +fullname+'</h4><h4 class="font-weight-medium">' +bday+'</h4>'+ subtitle;
              this.submit_confirm = true;
              this.process_type = this.registration_type === 'HMO_PHIC_LGU'  ? 'HMO_PHIC_LGU' : 'HMO_PHIC';
            } else {
              subtitle =  policy ? '<h5 class="mb-2">on both Health Insurance Company and PhilHealth.</h5>' : ''
              title ='No record found for patient: <h4 class="font-weight-medium">' +fullname+'</h4><h4 class="font-weight-medium">' +bday+'</h4>'+ subtitle;
              this.process_type = this.registration_type === 'PHIC_LGU' ? 'PHIC_LGU' : 'PHIC';
            }
            this.phic_member_eligibility_status = "No Record Found"; 
        }

        if(on_alert) {
            this.alert = { 
              display: true, 
              type: 'standard',
              width: '550', 
              icon: icon, 
              color: color, 
              title: title, 
              body: body, 
              btn_pry_color: 'primary',
              btn_pry_otl: false, 
              ...(result.RESPONSE._attributes.RESULT === "2" || result.RESPONSE._attributes.RESULT === "4" ? {
                btn_pry_txt: 'OKSSS',
                btn_pry_act: type === 'qr_sms' ? "reloadPage" : "closeAlert",
              } : {
                btn_pry_txt: 'YES',
                btn_pry_emt: 'confirmAlert',
                btn_pry_act: 'closeAlert',
                btn_sec_txt: 'NO',
                btn_sec_color: 'grey darken-2',
                btn_sec_otl: true,
                btn_sec_emt: 'changeStatus',
                btn_sec_act: 'closeAlert',
              })
            }
        } else {
          if(proceed_eligibility) {
            this.fname = fname
            this.lname = lname
            this.mname = mname
            this.suffix = suffix
            this.birthdate = bday
            this.proceedEligibility() 
          }
        }
      } else {
        this.alert = response.error
      }
    },

    changeStatus() {
      if (this.qr_page_process === 'qr_sms') {
        this.$router.go();
      } else {
        this.submit_confirm = false;
        this.selection_confirmation = false;
        this.loader = false;
      }
    },

    confirmAlert(){
      if (this.submit_confirm) {
        //IF HMO HAS DATA AND PHIC IS NO RECORDS / MULTIPLE
        if (this.qr_page_process === 'qr_sms') {
          this.selection_confirm_disp = true;
        } else {
          this.loader = false;
          this.submit_confirm = false;
          this.member_selection_dialog = true;
        }
      } else {
        this.fname = this.typein_fname
        this.mname = this.typein_mname
        this.lname = this.typein_lname
        this.suffix = this.typein_suffix
        this.birthdate = this.typein_birthdate
        this.proceedEligibility()
      }
    },

    // TIMEOUT REMOVAL / CANCELLATION OF API CALLS
    removeTimeout() {
      if (this.sel_adm_process.id == 'qr') {
        this.qr_img = this.qr_filename = this.qr_data = null
        clearTimeout(this.qr_timeout);
        clearTimeout(this.qr_reload_timeout);
      }

      if (this.sel_adm_process.id == 'sms') {
        this.sms_code = ''
        clearTimeout(this.sms_timeout);
      }
      return this.source.cancel();
    },

    // FOR RESPONSIVENESS OF IMAGE SIZES
    onResize() {
        this.windowSize = { x: window.innerWidth, y: window.innerHeight };
        if (this.windowSize.x > 1904) {
          this.heroes_health_logo = "250"
          this.confirm_display_width = "60%"
          this.text_title = 'font-size: 1.4em'
          this.icon_size = '75'
        } else if (this.windowSize.x > 1264 && this.windowSize.x < 1904) {
          this.heroes_health_logo = "200"
          this.confirm_display_width = "60%"
          this.text_title = 'font-size: 1.12em'
          this.icon_size = '70'
        } else if (this.windowSize.x > 960 && this.windowSize.x < 1264) {
          this.heroes_health_logo = "180"
          this.confirm_display_width = "60%"
          this.text_title = 'font-size: 1em'
          this.icon_size = '66'
        } else if (this.windowSize.x > 600 && this.windowSize.x < 960){
          this.heroes_health_logo = "180"
          this.confirm_display_width = "80%"
          this.text_title = 'font-size: 0.9em'
          this.icon_size = '55'
        } else {
          this.qr_height = '270'
          this.heroes_health_logo = "170"
          this.confirm_display_width = "100%"
          this.text_title = 'font-size: 0.9em'
          this.icon_size = '45'
        }
    },
  }
}
</script>

<style>
.consent_style {
    cursor: pointer;
}

.card-container-items {
  justify-content: center;
  align-items: center;
  display: flex;
}

.height-100 {
  height:100%;
}

.color-text {
  color: #35363a !important;
}
.card-border-inactive-top {
  background: #bedfff !important;
}

.card-border-active {
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%) !important;
}

.card-border-inactive {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
}

.hover-class:hover {
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%) !important;
}

.logo-absolute-left{
  position:absolute;
  left:10px;
  top:10px;
}

#qrcode {
  border: 1px solid lightgrey;
  border-radius: 4px;
}

#admission-item-center{
  align-self: center
  ;
}

.card-icon {
  width:150px;
  height:150px; 
  display:flex; 
  align-items:center; 
  justify-content:center;
}

.card-details {
  flex:1; 
  display:flex; 
  flex-direction:column; 
  justify-content:center;
  padding-right: 10px;
}

@media screen and (max-width: 959px) {
  .v-col.sm-6 {
    margin-bottom: 8px;
  }
}

@media screen and (max-width: 378px) {
  .card-details {
    text-align: center;
    align-items: center;
    padding-right: 5px;
    padding-left: 5px;
  }
}
</style>
