<template>
  <div>
    <v-form :readonly="!trans_detail.editable">
      <!-- DOCTOR ACCREDITATION NUMBER -->
      <v-row wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">DOCTOR ACCREDITATION</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part2_number10" @click="displayCommentData('doctor')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <div v-for="(add, i) in aas_data.section1" :key="i">
        <h1 class="subtitle-2 grey--text text--darken-3 font-weight-medium mt-2">{{ i === 0 ? 'PRIMARY DOCTOR' : (i === 1 ? 'OTHER DOCTORS' : '') }}</h1>

        <div class="doctor-border">
          <v-row align="baseline" wrap>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
              <v-combobox v-model="add.doc_fullname" :items="doctor_items" :loading="load_doctor" :readonly="trans_detail.transaction_type === 'OUTPATIENT'" @focus="current_selected_doctor = add.doc_fullname" @blur="add.doc_fullname = current_selected_doctor" item-text="doc_autocomplete" label="Doctor Fullname" hide-selected hide-details>
                <template v-slot:item="{ attrs, on, item }">
                  <v-list-item v-bind="attrs" v-on="on" @click="confirmChangeDoctor(i, item)" class="text-uppercase" wrap>
                    <v-list-item-avatar class="headline font-weight-light white--text" color="indigo">{{ item.doctor_name.charAt(0) }}</v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.doctor_name"></v-list-item-title>
                      <v-list-item-subtitle v-text="item.specialization"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-combobox>
            </v-col>
          </v-row>

          <v-row wrap>
            <v-col cols="6" sm="6" md="6" lg="6" class="pr-2">
              <v-text-field v-model="add.doc_specialization" label="Specialization" readonly hide-details></v-text-field>
            </v-col>
            <v-col cols="6" sm="6" md="6" lg="6">
              <v-text-field v-model="add.doc_tin" label="TIN" readonly hide-details></v-text-field>
            </v-col>
          </v-row>

          <v-row wrap>
            <v-col cols="6" sm="6" md="6" lg="6" class="pr-2">
              <v-text-field v-model="add.doc_prc_license" label="PRC License" readonly hide-details></v-text-field>
            </v-col>
            <v-col cols="6" sm="6" md="6" lg="6">
              <v-text-field v-model="add.doc_phic_acc_no" label="PHIC Number" readonly hide-details></v-text-field>
            </v-col>
          </v-row>
          <v-text-field v-if="i === 0" v-model="add.date_signed" label="Date Signed" readonly hide-details></v-text-field>
          <br>
          <div v-if="$store.state.usr_credentials.department === 'Credit and Collection'">
            <label class="body-2">Details:</label>
            <v-btn v-if="trans_detail.editable && !!add.co_pay" @click="add.co_pay = '', checkDataStatus('doctor')" class="ml-2" width="60" height="25" small>Clear</v-btn>
            <v-radio-group v-model="add.co_pay" @change="checkDataStatus('doctor')" class="mt-0 mb-4" hide-details>
              <v-radio value="N" label="No co-pay on top of Philhealth benefit"></v-radio>
              <v-radio value="Y" label="With co-pay on top of Philhealth benefit"></v-radio>
            </v-radio-group>
          </div>
          <v-btn v-if="trans_detail.editable && i !== 0" @click="removeAddedDoctor(i)" class="mb-5" small><v-icon small>mdi-delete</v-icon> DELETE</v-btn>
        </div>
      </div>

      <!-- ADD DOCTORS -->
      <v-row class="mt-2" wrap>
        <v-spacer></v-spacer>
        <v-btn v-if="trans_detail.editable && trans_detail.transaction_type === 'INPATIENT'" @click="addDoctor" tile><v-icon class="pr-1" size="20">mdi-plus</v-icon> ADD DOCTOR</v-btn>
      </v-row>

      <!-- SIGNATURES (PATIENT, HCI, DOCTOR) -->
      <h1 class="section-title mt-5">SIGNATURES (PATIENT, HCI, DOCTOR)</h1>
      <v-divider></v-divider>
      <v-row justify="center" class="text-center mt-5" wrap>
        <v-col cols="5" sm="5" md="5" lg="5">
          <v-btn @click="showSignaturePad('patient')" :color="aas_data.section2.patient_signature ? 'success darken-1' : 'primary'" rounded>PATIENT<v-icon v-show="!!aas_data.section2.patient_signature" size="22" right>mdi-check</v-icon></v-btn>
          <v-btn @click="showSignaturePad('hospital')" class="mx-2" :color="aas_data.section2.hospital_signature ? 'success darken-1' : 'primary'" rounded>HOSPITAL<v-icon v-show="!!aas_data.section2.hospital_signature" size="22" right>mdi-check</v-icon></v-btn>
          <v-btn @click="showSignaturePad('doctor')" :color="aas_data.section2.doctor_signature ? 'success darken-1' : 'primary'" rounded>DOCTOR<v-icon v-show="!!aas_data.section2.doctor_signature" size="22" right>mdi-check</v-icon></v-btn>
        </v-col>
      </v-row>

      <!-- DOCTOR IS NOT ON THE LIST DIALOG -->
      <v-dialog v-model="new_doctor_dialog" width="700" persistent id="signature-div">
        <v-card>
          <h2 class="grey--text text--darken-3 font-weight-medium py-3 text-center">DOCTOR DETAILS</h2>
          <v-divider></v-divider>
          <v-row class="pa-3" wrap>
            <v-col cols="4" sm="4" md="4" lg="4">
              <v-text-field v-model="new_doctor.first_name" label="First Name" hide-details></v-text-field>
            </v-col>
            <v-col cols="4" sm="4" md="4" lg="4" class="px-2">
              <v-text-field v-model="new_doctor.middle_name" label="Middle Name" hide-details></v-text-field>
            </v-col>
            <v-col cols="4" sm="4" md="4" lg="4">
              <v-text-field v-model="new_doctor.last_name" label="Last Name" hide-details></v-text-field>
            </v-col>
          </v-row>

          <v-row class="pa-3" wrap>
            <v-col cols="6" sm="6" md="6" lg="6" class="pr-2">
              <v-text-field v-model="new_doctor.specialization" label="Specialization" hide-details></v-text-field>
            </v-col>
            <v-col cols="6" sm="6" md="6" lg="6">
              <v-text-field v-model="new_doctor.doc_tin" v-on:keypress="numberOnly" label="TIN" hide-details></v-text-field>
            </v-col>
          </v-row>

          <v-row class="pa-3" wrap>
            <v-col cols="6" sm="6" md="6" lg="6" class="pr-2">
              <v-text-field v-model="new_doctor.doc_prc_license" v-on:keypress="numberOnly" label="PRC License" hide-details></v-text-field>
            </v-col>
            <v-col cols="6" sm="6" md="6" lg="6">
              <v-text-field v-model="new_doctor.doc_phic_acc_no" v-on:keypress="numberOnly" label="PHIC Number" hide-details></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="mt-5"></v-divider>
          <v-row justify="center" class="mt-3 pb-3" wrap>
            <v-btn :loading="new_doctor_loader" @click="confirmAddNewDoctor" color="primary">SAVE</v-btn>
            <v-btn :disabled="new_doctor_loader" @click="new_doctor_dialog = false" class="ml-2">CANCEL</v-btn>
          </v-row>
        </v-card>
      </v-dialog>

      <!-- SIGNATURE PAD -->
      <v-dialog v-model="show_signature" width="600" persistent style="overflow-y: hidden !important;">
        <v-card class="pa-3">
          <v-row dense>
            <v-col cols="12">
              <h2 class="grey--text text--darken-3 font-weight-medium pt-2 text-center">{{ signature_of }} SIGNATURE</h2>
            </v-col>
          </v-row>
          
          <v-row dense>
            <v-col cols="12"  class="pl-7 pl-0">
              <div class="signature-style pa-0 ma-0" >
                <div v-if="signature_of === 'PATIENT'">
                  <v-row v-if="!!aas_data.section2.patient_signature" class="signature-pad" justify="center" align="center" wrap>
                    <img :src="trans_detail.patient_sign_path">
                  </v-row>
                  <canvas v-else id="patient-sign" class="signature-pad"></canvas>
                </div>
                <div v-else-if="signature_of === 'HOSPITAL'">
                  <v-row v-if="!!aas_data.section2.hospital_signature" class="signature-pad" justify="center" align="center" wrap>
                    <img :src="trans_detail.hci_sign_path">
                  </v-row>
                  <canvas v-else id="hospital-sign" class="signature-pad"></canvas>
                </div>
                <div v-else>
                  <v-row v-if="!!aas_data.section2.doctor_signature" class="signature-pad" justify="center" align="center" wrap>
                    <img :src="trans_detail.doctor_sign_path">
                  </v-row>
                  <canvas v-else id="doctor-sign" class="signature-pad"></canvas>
                </div>
              </div>
            </v-col>
          </v-row>
          
          <v-row dense>
            <v-col cols="12" class="d-flex justify-end pr-6 pb-2">
              <v-btn @click="confirmSaveSignature" :loading="signature_is_saving" :disabled="disable_apply_btn" class="mr-1" color="primary" small>APPLY</v-btn>
              <v-btn @click="clearSignature()" :disabled="disable_clear_btn || signature_is_saving" small>CLEAR</v-btn>
            </v-col>
          </v-row>
        
          <div v-if="signature_of === 'PATIENT'" class="px-5">
            <label class="text-left body-2">Relationship of the signatory to the member/patient.</label>
            <v-btn v-if="trans_detail.editable && !!relation_reason.rel_to_patient" @click="relation_reason.rel_to_patient = '', relationship = '', checkDataStatus('relation')" class="ml-2" width="60" height="22" small>Clear</v-btn>
            <v-radio-group v-model="relation_reason.rel_to_patient" @change="checkDataStatus('relation'), relationship = ''" class="mt-0 pa-0" hide-details dense row>
              <v-row justify="center" class="px-3 mt-1" wrap>
                <v-col cols="12" sm="3" md="3" lg="3">
                  <v-radio value="Spouse" label="Spouse"></v-radio>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3">
                  <v-radio value="Sibling" label="Sibling"></v-radio>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3">
                  <v-radio value="Child" label="Child"></v-radio>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3">
                  <v-radio value="Parent" label="Parent"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>

            <v-radio-group v-model="relationship" @change="relation_reason.rel_to_patient = ''" class="mt-0 mt-sm-4 pa-0" hide-details dense row>
              <v-row justify="center" align="center" class="px-3" wrap>
                <v-col cols="12" sm="4" md="4" lg="4">
                  <v-radio value="Others" label="Others, Specify"></v-radio>
                </v-col>
                <v-col cols="12" sm="8" md="8" lg="8" :class="{'opacity' : relationship !== 'Others'}">
                  <v-text-field v-if="relationship === 'Others'" v-model="relation_reason.rel_to_patient" @change="checkDataStatus('relation')" class="ma-0 body-2" dense hide-details></v-text-field>
                  <v-text-field v-else readonly class="ma-0 body-2" dense hide-details></v-text-field>
                </v-col>
              </v-row>
            </v-radio-group>
            
            <v-radio-group v-model="relation_reason.reason_for_signing_onbehalf" @change="checkDataStatus('relation'), reason_for_signing = ''" class="mt-6 pa-0" hide-details dense row>
              <label class="text-left body-2">Reason for signing on behalf of the member/patient:</label>
              <v-btn v-if="trans_detail.editable && !!relation_reason.reason_for_signing_onbehalf" @click="relation_reason.reason_for_signing_onbehalf = '', reason_for_signing = '', checkDataStatus('relation')" class="ml-2" width="60" height="22" small>Clear</v-btn>
              <v-row class="px-3 mt-1" wrap>
                <v-col cols="12" sm="5" md="5" lg="5">   
                  <v-radio value="Incapacitated" label="Patient is incapacitated"></v-radio>
                </v-col>
                <v-col cols="12" sm="4" md="4" lg="4">
                  <v-radio value="Representative" label="Representative"></v-radio>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3">
                  <v-radio value="Patient" label="Patient"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
            
            <v-radio-group v-model="reason_for_signing" @change="relation_reason.reason_for_signing_onbehalf = ''" class="mt-0 mt-sm-4 pa-0" row dense hide-details>
              <v-row align="center" class="px-3" wrap>
                <v-col cols="12" sm="4" md="4" lg="4">
                  <v-radio value="Others" label="Other Reason"></v-radio>
                </v-col>
                <v-col :class="{'opacity' : reason_for_signing !== 'Others'}" cols="12" sm="8" md="8" lg="8">
                  <v-text-field v-if="reason_for_signing === 'Others'" v-model="relation_reason.reason_for_signing_onbehalf" @change="checkDataStatus('relation')" class="ma-0 body-2" dense hide-details></v-text-field>
                  <v-text-field v-else readonly class="ma-0 body-2" dense hide-details></v-text-field>
                </v-col>  
              </v-row>
            </v-radio-group>
            <v-divider class="mt-6"></v-divider>
          </div>

          <v-row justify="center" class="mt-5 pb-4" wrap>
            <v-btn @click="confirmCloseSignature" :disabled="signature_is_saving" class="ml-1">CLOSE<v-icon size="19">mdi-close</v-icon></v-btn>
          </v-row>
        </v-card>
      </v-dialog>
    
      <!-- COMMENT DIALOG -->
      <v-dialog v-model="comment_dialog" width="600" persistent>
        <v-card>
          <h3 class="grey--text text--darken-3 font-weight-medium py-1 text-center">{{ comment_title }}</h3>
          <v-divider></v-divider>
          <div class="px-4 mt-2">
            <label class="body-2">Comment:</label>
            <v-textarea v-model="comment_content" rows="4" outlined readonly hide-details></v-textarea>
          </div>
          <v-row justify="center" class="mt-3 pb-3" wrap>
            <v-btn @click="comment_dialog = false" class="ml-1" color="primary" small>CLOSE</v-btn>
          </v-row>
        </v-card>
      </v-dialog>

      <!-- NAVIGATION BUTTON -->
      <v-divider class="my-5"></v-divider>
      <v-row justify="space-between" wrap>
        <v-col cols="5" sm="5" md="5" lg="5">
          <v-btn @click="(trans_detail.gender !== 'MALE' || trans_detail.gender !== 'M') && trans_detail.phic_packages.includes('MATERNITY') ? $router.push('/input-forms/maternity') : $router.push('/input-forms/physical-examination') " color="primary"><i class="fas fa-arrow-left mr-1"></i>PREVIOUS</v-btn> 
        </v-col>
        <v-col cols="5" sm="5" md="5" lg="5" class="text-right">
          <v-btn v-if="$store.state.usr_credentials.department === 'Nurse Station' && !trans_detail.editable" @click="$router.push('/patient-list')" color="primary"><i class="fas fa-home mr-1"></i>BACK TO HOME</v-btn>
          <v-btn v-else-if="$store.state.usr_credentials.department === 'Credit and Collection'" @click="$router.push('/input-forms/certification')" color="primary">NEXT<i class="fas fa-arrow-right ml-1"></i></v-btn>
        </v-col>
      </v-row>

      <Alert :alert="alert" @changeDoctor="changeDoctor" @closeSignature="closeSignature" @saveSignature="saveSignature" />
    </v-form>
  </div>
</template>

<script>
import Alert from '../../Alert.vue'

//TEMPORARY
import mixin from '@/mixin'
let data_query = mixin.methods.getQueryKey()

export default {
  props: ['trans_detail', 'required', 'comment_data'],

  components: {
    Alert
  },
  
  data(){
    return{
      // DATA
      aas_data: {
        section1: [],
        section2: {
          patient_signature: '',
          hospital_signature: '',
          doctor_signature: ''
        },
        status: {
          doctor: false
        }
      },

      relation_reason: {
        rel_to_patient: '',
        reason_for_signing_onbehalf: '',
        status: false
      },

      // POST DETAILS
      post_details: {
        created_by: this.$store.state.usr_credentials.user_name,
        department: this.$store.state.usr_credentials.department,
        phic_tracking_number: this.trans_detail.phic_tracking_number,
        transaction_number: this.trans_detail.transaction_number
      },
 
      // NEW DOCTOR (DOCTORS NOT ON THE LIST)
      current_selected_doctor: '',
      new_doctor_dialog: false,
      new_doctor_loader: false,
      new_doctor: {
        index: '',
        is_primary_doctor: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        specialization: '',
        doc_tin: '',
        doc_prc_license: '',
        doc_phic_acc_no: '',
        doc_code: ''
      },

      // SIGNATURE CANVAS
      show_signature: false,
      signature_of: '',
      signature_is_saved: true,
      disable_apply_btn: true,
      disable_clear_btn: true,
      w: 0,
      h: 0,
      x: 'black',
      y: '5',
      canvas: false,
      ctx: false,
      flag: false,
      prevX: 0,
      currX: 0,
      prevY: 0,
      currY: 0,
      dot_flag: false,

      // OTHERS
      relationship: '',
      reason_for_signing: '',
      alert: {},

      // REFERENCE DATA
      doctor_list: [],
      selected_doctor: [],

      // LOADER
      load_doctor: true,
      signature_is_saving: false,

      // COMMENTS
      comment_dialog: false,
      comment_title: '',
      comment_content: ''
    }
  },

  created(){
    this.getAccreditationSignatureData();

    setTimeout(() => {
      this.is_signed_status = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('POI43'), 'FpXqep4t').toString(this.$crypto.enc.Utf8))
    }, 200)
  },

  computed: {
    // GET DOCTOR ITEMS
    doctor_items(){
      const doctor_list = this.doctor_list.filter(item => {
        let doc_autocomplete = item.doctor_name + ' ' + item.specialization + ' ' + (item.doctor_tin_no ? item.doctor_tin_no : '') + ' ' + (item.doc_prc_license ? item.doc_prc_license : '')
        return !this.selected_doctor.includes(doc_autocomplete)
      })

      return doctor_list
    }
  },

  watch: {
    'aas_data.section1': {
      deep: true,
      handler(value){
        this.selected_doctor = []

        value.forEach(element => {
          let doc_autocomplete = element.doc_fullname + ' ' + element.doc_specialization + ' ' + element.doc_tin + ' ' + element.doc_prc_license
          this.selected_doctor.push(doc_autocomplete)
        })
      }
    }
  },

  methods: {
    // GET ACCREDITATION AND SIGNATURE DATA
    // getAccreditationSignatureData(){
    //   setTimeout(() => {
    //     let aas_data = sessionStorage.getItem('GLORS6') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('GLORS6'), 'dspof43S').toString(this.$crypto.enc.Utf8)) : { section2: { patient_birthdate: null }}
    //     let relation_reason = sessionStorage.getItem('PDFG5F') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PDFG5F'), 'XCdx3F9D').toString(this.$crypto.enc.Utf8)) : null
    //     let date_signed_for_ctf = sessionStorage.getItem('LMNSP2') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LMNSP2'), 'MndeXf9d').toString(this.$crypto.enc.Utf8)) : null

    //     if(aas_data.section2.patient_birthdate === null){
    //       this.$axios.post(this.$tms_url+'resources/api/_get_transaction_ip_aas.php', this.$qs.stringify({
    //         post_data: this.wsDataEncryption(JSON.stringify({
    //           phic_tracking_number: this.trans_detail.phic_tracking_number,
    //           transaction_number: this.trans_detail.transaction_number,
    //           provider_tin: this.$store.state.prv_data.provider_tin,
    //           provider_code: this.$store.state.prv_data.provider_code,
    //           hmo_host_code: this.trans_detail.hmo_host_code
    //         }))
    //       }))
    //       .then(response => {
    //         response.data = this.responseDataDecryption(response.data)
    //         this.aas_data = {
    //           section1: aas_data.section1,
    //           section2: {
    //             patient_birthdate: response.data.TRANSACTION.mem_birthdate,
    //             patient_signature: response.data.PATIENT_DATA.patient_is_signed == '0' ? null : '2',
    //             hospital_signature: response.data.TRANSACTION.hospital_is_signed == '0' ? null : '2',
    //             doctor_signature: aas_data.section2.doctor_signature
    //           },
    //           status: {
    //             doctor: false
    //           }
    //         }

    //         this.old_primary_doctor = {
    //           doc_fullname: this.aas_data.section1[0].doc_fullname,
    //           doc_specialization: this.aas_data.section1[0].doc_specialization,
    //           doc_tin: this.aas_data.section1[0].doc_tin,
    //           doc_prc_license: this.aas_data.section1[0].doc_prc_license,
    //           doc_phic_acc_no: this.aas_data.section1[0].doc_phic_acc_no,
    //           doc_code: this.aas_data.section1[0].doc_code
    //         }

    //         this.relation_reason = {
    //           rel_to_patient: relation_reason ? relation_reason.rel_to_patient : response.data.PATIENT_DATA.rel_to_patient,
    //           reason_for_signing_onbehalf: relation_reason ? relation_reason.reason_for_signing_onbehalf : response.data.PATIENT_DATA.rel_for_signing_on_behalf,
    //           status: relation_reason ? relation_reason.status : false
    //         }
            
    //         if(this.relation_reason.rel_to_patient === 'Spouse' || this.relation_reason.rel_to_patient === 'Sibling' || this.relation_reason.rel_to_patient === 'Child' || this.relation_reason.rel_to_patient === 'Parent' || !this.relation_reason.rel_to_patient){
    //           this.relationship = ''
    //         }else{
    //           this.relationship = 'Others'
    //         }

    //         if(this.relation_reason.reason_for_signing_onbehalf === 'Incapacitated' || this.relation_reason.reason_for_signing_onbehalf === 'Representative' || this.relation_reason.reason_for_signing_onbehalf === 'Patient' || !this.relation_reason.reason_for_signing_onbehalf){
    //           this.reason_for_signing = ''
    //         }else{
    //           this.reason_for_signing = 'Others'
    //         }

    //         if(date_signed_for_ctf){
    //           this.date_signed_for_ctf = date_signed_for_ctf
    //         }else{
    //           this.date_signed_for_ctf = {
    //             patient: response.data.PATIENT_DATA.patient_date_signed ? this.formatDate(response.data.PATIENT_DATA.patient_date_signed.substring(0, 10)) : '',
    //             hospital: response.data.TRANSACTION.hospital_date_signed ? this.formatDate(response.data.TRANSACTION.hospital_date_signed.substring(0, 10)) : '',
    //             doctor: response.data.PHIC_DOCTOR[0].date_signed ? this.formatDate(response.data.PHIC_DOCTOR[0].date_signed.substring(0, 10)) : ''
    //           }
    //         }

    //         this.is_signed_status = [this.aas_data.section2.patient_signature, this.aas_data.section2.hospital_signature, this.aas_data.section2.doctor_signature]
    //         sessionStorage.setItem('POI43', this.$crypto.AES.encrypt(JSON.stringify(this.is_signed_status), 'FpXqep4t'))

    //         this.saveData();
    //         this.getDoctors();
    //       })
    //       .catch(error => {
    //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
    //       })
    //     }else{
    //       this.aas_data = aas_data
    //       this.relation_reason = relation_reason
    //       this.date_signed_for_ctf = date_signed_for_ctf

    //       this.old_primary_doctor = {
    //         doc_fullname: this.aas_data.section1[0].doc_fullname,
    //         doc_specialization: this.aas_data.section1[0].doc_specialization,
    //         doc_tin: this.aas_data.section1[0].doc_tin,
    //         doc_prc_license: this.aas_data.section1[0].doc_prc_license,
    //         doc_phic_acc_no: this.aas_data.section1[0].doc_phic_acc_no,
    //         doc_code: this.aas_data.section1[0].doc_code
    //       }

    //       if(this.relation_reason.rel_to_patient === 'Spouse' || this.relation_reason.rel_to_patient === 'Sibling' || this.relation_reason.rel_to_patient === 'Child' || this.relation_reason.rel_to_patient === 'Parent' || this.relation_reason.rel_to_patient === '' || this.relation_reason.rel_to_patient === null){
    //         this.relationship = ''
    //       }else{
    //         this.relationship = 'Others'
    //       }

    //       if(this.relation_reason.reason_for_signing_onbehalf === 'Incapacitated' || this.relation_reason.reason_for_signing_onbehalf === 'Representative' || this.relation_reason.reason_for_signing_onbehalf === 'Patient' || this.relation_reason.reason_for_signing_onbehalf === '' || this.relation_reason.reason_for_signing_onbehalf === null){
    //         this.reason_for_signing = ''
    //       }else{
    //         this.reason_for_signing = 'Others'
    //       }

    //       this.$store.commit('set_loading_category', false)
    //       this.getDoctors();
    //     }
    //   }, 200)
    // },

    getAccreditationSignatureData(){
      setTimeout(async () => {
        let aas_data = sessionStorage.getItem('GLORS6') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('GLORS6'), 'dspof43S').toString(this.$crypto.enc.Utf8)) : { section2: { patient_birthdate: null }}
        let relation_reason = sessionStorage.getItem('PDFG5F') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PDFG5F'), 'XCdx3F9D').toString(this.$crypto.enc.Utf8)) : null
        let date_signed_for_ctf = sessionStorage.getItem('LMNSP2') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LMNSP2'), 'MndeXf9d').toString(this.$crypto.enc.Utf8)) : null
        
        if(aas_data.section2.patient_birthdate === null){
          let response = await this.$services.getEclaims({
              request_key: 'accreditation_and_signature',
              provider_code: this.$store.state.prv_data.provider_code,
              ek_lgu_id: this.trans_detail.ek_lgu_id,
              transaction_number: this.trans_detail.transaction_number,
              migrated_to_eclaim_table: this.trans_detail.migrated_to_eclaim_table,
              claim_no: this.trans_detail.claim_no
          });

          if (response.status === 200) {
            response.data = this.responseDataDecryption(response.data)

            this.aas_data = {
              section1: aas_data.section1,
              section2: {
                patient_birthdate: response.data.TRANSACTION.mem_birthdate,
                patient_signature: response.data.PATIENT_DATA.patient_is_signed == '0' ? null : '2',
                hospital_signature: response.data.TRANSACTION.hospital_is_signed == '0' ? null : '2',
                doctor_signature: aas_data.section2.doctor_signature
              },
              status: {
                doctor: false
              }
            }

            this.old_primary_doctor = {
              doc_fullname: this.aas_data.section1[0].doc_fullname,
              doc_specialization: this.aas_data.section1[0].doc_specialization,
              doc_tin: this.aas_data.section1[0].doc_tin,
              doc_prc_license: this.aas_data.section1[0].doc_prc_license,
              doc_phic_acc_no: this.aas_data.section1[0].doc_phic_acc_no,
              doc_code: this.aas_data.section1[0].doc_code
            }

            this.relation_reason = {
              rel_to_patient: relation_reason ? relation_reason.rel_to_patient : response.data.PATIENT_DATA.rel_to_patient,
              reason_for_signing_onbehalf: relation_reason ? relation_reason.reason_for_signing_onbehalf : response.data.PATIENT_DATA.rel_for_signing_on_behalf,
              status: relation_reason ? relation_reason.status : false
            }
            
            if(this.relation_reason.rel_to_patient === 'Spouse' || this.relation_reason.rel_to_patient === 'Sibling' || this.relation_reason.rel_to_patient === 'Child' || this.relation_reason.rel_to_patient === 'Parent' || !this.relation_reason.rel_to_patient){
              this.relationship = ''
            }else{
              this.relationship = 'Others'
            }

            if(this.relation_reason.reason_for_signing_onbehalf === 'Incapacitated' || this.relation_reason.reason_for_signing_onbehalf === 'Representative' || this.relation_reason.reason_for_signing_onbehalf === 'Patient' || !this.relation_reason.reason_for_signing_onbehalf){
              this.reason_for_signing = ''
            }else{
              this.reason_for_signing = 'Others'
            }

            if(date_signed_for_ctf){
              this.date_signed_for_ctf = date_signed_for_ctf
            }else{
              this.date_signed_for_ctf = {
                patient: response.data.PATIENT_DATA.patient_date_signed ? this.formatDate(response.data.PATIENT_DATA.patient_date_signed.substring(0, 10)) : '',
                hospital: response.data.TRANSACTION.hospital_date_signed ? this.formatDate(response.data.TRANSACTION.hospital_date_signed.substring(0, 10)) : '',
                doctor: response.data.PHIC_DOCTOR[0].date_signed ? this.formatDate(response.data.PHIC_DOCTOR[0].date_signed.substring(0, 10)) : ''
              }
            }

            this.is_signed_status = [this.aas_data.section2.patient_signature, this.aas_data.section2.hospital_signature, this.aas_data.section2.doctor_signature]
            sessionStorage.setItem('POI43', this.$crypto.AES.encrypt(JSON.stringify(this.is_signed_status), 'FpXqep4t'))

            this.saveData();
            this.getDoctors();
          } else {
              this.alert = response.error;
          }
        }else{
          this.aas_data = aas_data
          this.relation_reason = relation_reason
          this.date_signed_for_ctf = date_signed_for_ctf

          this.old_primary_doctor = {
            doc_fullname: this.aas_data.section1[0].doc_fullname,
            doc_specialization: this.aas_data.section1[0].doc_specialization,
            doc_tin: this.aas_data.section1[0].doc_tin,
            doc_prc_license: this.aas_data.section1[0].doc_prc_license,
            doc_phic_acc_no: this.aas_data.section1[0].doc_phic_acc_no,
            doc_code: this.aas_data.section1[0].doc_code
          }

          if(this.relation_reason.rel_to_patient === 'Spouse' || this.relation_reason.rel_to_patient === 'Sibling' || this.relation_reason.rel_to_patient === 'Child' || this.relation_reason.rel_to_patient === 'Parent' || this.relation_reason.rel_to_patient === '' || this.relation_reason.rel_to_patient === null){
            this.relationship = ''
          }else{
            this.relationship = 'Others'
          }

          if(this.relation_reason.reason_for_signing_onbehalf === 'Incapacitated' || this.relation_reason.reason_for_signing_onbehalf === 'Representative' || this.relation_reason.reason_for_signing_onbehalf === 'Patient' || this.relation_reason.reason_for_signing_onbehalf === '' || this.relation_reason.reason_for_signing_onbehalf === null){
            this.reason_for_signing = ''
          }else{
            this.reason_for_signing = 'Others'
          }

          this.$store.commit('set_loading_category', false)
          this.getDoctors();
        }
      }, 200)
    },

    // GET REFERENCE DOCTOR
    async getDoctors(){
      if(this.trans_detail.editable){
        if(localStorage.getItem('VGR084')){
          this.aas_data = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('GLORS6'), 'dspof43S').toString(this.$crypto.enc.Utf8))
          this.doctor_list = JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('VGR084'), 'pggpjxKK').toString(this.$crypto.enc.Utf8))
          this.$store.commit('set_loading_category', false)
          this.load_doctor = false
        }else{
          let response = await this.$services.getTransactionIpRefData({
                request_key: 'patient_doctor',
                host_doctor: this.trans_detail.host_doctor,
                provider_tin: this.$store.state.prv_data.provider_tin,
                provider_code: this.$store.state.prv_data.provider_code,
                hmo_host_code: this.trans_detail.hmo_host_code ? this.trans_detail.hmo_host_code : undefined,
                phic_host_code: this.trans_detail.phic_host_code ? this.trans_detail.phic_host_code : undefined,
                lgu_host_code: this.trans_detail.lgu_host_code ? this.trans_detail.lgu_host_code : undefined
              });

          if (response.status === 200){
            let doctor_list = this.responseDataDecryption(response.data).map(item => {
              let doctor = {
                first_name: item.first_name,
                middle_name: item.middle_name,
                last_name: item.last_name,
                suffix: item.suffix,
                doc_phic_acc_no: item.doc_phic_acc_no,
                doc_code: item.hmo_doctor_code,
                doc_prc_license: item.doc_prc_license,
                doctor_tin_no: item.doctor_tin_no,
                doctor_name: item.doctor_name,
                specialization: item.specialization,
                doc_autocomplete: item.doctor_name + ' ' + item.specialization + ' ' + (item.doctor_tin_no ? item.doctor_tin_no : '') + ' ' + (item.doc_prc_license ? item.doc_prc_license : '')
              }

              return doctor
            })

            localStorage.setItem('VGR084', this.$crypto.AES.encrypt(JSON.stringify(doctor_list), 'pggpjxKK'))
            this.doctor_list = doctor_list
            this.aas_data = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('GLORS6'), 'dspof43S').toString(this.$crypto.enc.Utf8))
            this.$store.commit('set_loading_category', false)
            this.load_doctor = false
          } else{
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          }
        }
      }else{
        this.aas_data = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('GLORS6'), 'dspof43S').toString(this.$crypto.enc.Utf8))
        this.$store.commit('set_loading_category', false)
        this.load_doctor = false
      }
    },

    // getDoctors(){
    //   if(this.trans_detail.editable){
    //     if(localStorage.getItem('VGR084')){
    //       this.aas_data = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('GLORS6'), 'dspof43S').toString(this.$crypto.enc.Utf8))
    //       this.doctor_list = JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('VGR084'), 'pggpjxKK').toString(this.$crypto.enc.Utf8))
    //       this.$store.commit('set_loading_category', false)
    //       this.load_doctor = false
    //     }else{
    //       this.$axios.post(this.$tms_url+'resources/api/_get_eclaims_from_ecare.php', this.$qs.stringify({
    //         post_data: this.wsDataEncryption(JSON.stringify({
    //           request_key: 'doctor_accreditation',
    //           // provider_code: this.$store.state.prv_data.provider_code,
    //           // ek_lgu_id: this.trans_detail.ek_lgu_id,
    //           // transaction_number: this.trans_detail.transaction_number
    //           provider_code:'EK8BE7221CB09A2221',
    //           ek_lgu_id:'EK-NRF3U1999H518-2635',
    //           transaction_number:'HEY412FD5WKB'
    //         }))
    //       }))
    //       .then(response => {
    //         let doctor_list = this.responseDataDecryption(response.data).map(item => {
    //           let doctor = {
    //             doc_phic_acc_no: item.doc_phic_acc_no,
    //             doc_code: item.hmo_doctor_code,
    //             doc_prc_license: item.doc_prc_license,
    //             doctor_tin_no: item.doctor_tin_no,
    //             doctor_name: item.doctor_name,
    //             specialization: item.specialization,
    //             doc_autocomplete: item.doctor_name + ' ' + item.specialization + ' ' + (item.doctor_tin_no ? item.doctor_tin_no : '') + ' ' + (item.doc_prc_license ? item.doc_prc_license : '')
    //           }

    //           return doctor
    //         })

    //         localStorage.setItem('VGR084', this.$crypto.AES.encrypt(JSON.stringify(doctor_list), 'pggpjxKK'))
    //         this.doctor_list = doctor_list
    //         this.aas_data = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('GLORS6'), 'dspof43S').toString(this.$crypto.enc.Utf8))
    //         this.$store.commit('set_loading_category', false)
    //         this.load_doctor = false
    //       })
    //       .catch(error => {
    //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
    //       })
    //     }
    //   }else{
    //     this.aas_data = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('GLORS6'), 'dspof43S').toString(this.$crypto.enc.Utf8))
    //     this.$store.commit('set_loading_category', false)
    //     this.load_doctor = false
    //   }
    // },

    // ADD DOCTOR
    addDoctor(){
      this.aas_data.section1.push({
        is_primary_doctor: 0,
        doc_fullname: '',
        doc_phic_acc_no: '',
        date_signed: ''
      })

      this.$forceUpdate();
    },

    // REMOVE ADDED DOCTOR
    removeAddedDoctor(index){
      this.aas_data.section1.splice(index, 1)
      this.aas_data.status.doctor = true
      this.$emit('change-status')
    },

    // CONFIRM CHANGE DOCTOR
    confirmChangeDoctor(index, item){
      if(index === 0 && this.aas_data.section2.doctor_signature){
        let title = "All data including signatures of Doctor <br><span class='font-weight-bold'>"+this.old_primary_doctor.doc_fullname+"</span> will be cleared. <br>Doctor's signature will be needed if you select doctor <br><span class='font-weight-bold'>"+this.old_primary_doctor.doc_fullname+"</span> again."
        this.new_primary_doctor = item
        this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'red', title: title, body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'changeDoctor', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert', btn_sec_params: 'canceled' }
      }else{
        this.current_selected_doctor = item.doctor_name
        this.autoFillDoctor(index, item);
      }
    },

    // CHANGE DOCTOR
    async changeDoctor(status){
      if(status === 'canceled'){
        this.aas_data.section1[0].doc_fullname = this.old_primary_doctor.doc_fullname
        this.aas_data.section1[0].doc_specialization = this.old_primary_doctor.doc_specialization
        this.aas_data.section1[0].doc_tin = this.old_primary_doctor.doc_tin
        this.aas_data.section1[0].doc_prc_license = this.old_primary_doctor.doc_prc_license
        this.aas_data.section1[0].doc_phic_acc_no = this.old_primary_doctor.doc_phic_acc_no
        this.aas_data.section1[0].doc_code = this.old_primary_doctor.doc_code
        this.alert = {}
      }else{
        this.current_selected_doctor = this.new_primary_doctor.doctor_name
        this.aas_data.section1[0].doc_fullname = this.new_primary_doctor.doctor_name
        this.aas_data.section1[0].doc_specialization = this.new_primary_doctor.specialization
        this.aas_data.section1[0].doc_tin = this.new_primary_doctor.doctor_tin_no
        this.aas_data.section1[0].doc_prc_license = this.new_primary_doctor.doc_prc_license
        this.aas_data.section1[0].doc_phic_acc_no = this.new_primary_doctor.doc_phic_acc_no
        this.aas_data.section1[0].doc_code = this.new_primary_doctor.doc_code
        this.aas_data.section1[0].date_signed = null
        this.aas_data.section1[0].co_pay = null
        
        let doctors = []
        this.aas_data.section1.forEach(element => {
          doctors.push({
            patient_doctor_id: element.patient_doctor_id,
            is_primary_doctor: element.is_primary_doctor,
            doc_tin: element.doc_tin,
            doc_prc_license: element.doc_prc_license,
            doc_phic_acc_no: element.doc_phic_acc_no,
            doc_code: element.doc_code,
            co_pay: element.co_pay
          })
        })

        let response = await this.$services.trnUpdInpatientAas({
              request_key: 'patient_doctor',
              ...(this.post_details),
              hmo_host_code: this.trans_detail.hmo_host_code,
              input_type: 'SELECTION',
              phic_doctor: doctors
            });

        if (response.status === 200){
          if(response.data.success){
            let formData = new FormData();
            formData.append('post_data', this.wsDataEncryption(JSON.stringify({
              request_key: 'save_signature',
              phic_tracking_number: this.trans_detail.phic_tracking_number,
              transaction_number: this.trans_detail.transaction_number,
              doctor_tin: this.old_primary_doctor.doc_tin,
              status: 'clear'
            })))
            
            this.$axios.post(this.$tms_url+`resources/controller/trn_upd_inpatient_aas.php?${data_query}`, 
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            ).then(response => {
              if(response.data.success){
                this.aas_data.section2.doctor_signature = ''
  
                this.old_primary_doctor = {
                  doc_fullname: this.aas_data.section1[0].doc_fullname,
                  doc_specialization: this.aas_data.section1[0].doc_specialization,
                  doc_tin: this.aas_data.section1[0].doc_tin,
                  doc_prc_license: this.aas_data.section1[0].doc_prc_license,
                  doc_phic_acc_no: this.aas_data.section1[0].doc_phic_acc_no,
                  doc_code: this.aas_data.section1[0].doc_code
                }
                
                this.alert = {}
                this.is_signed_status[2] = 0
                this.date_signed_for_ctf.doctor = ''
  
                sessionStorage.setItem('POI43', this.$crypto.AES.encrypt(JSON.stringify(this.is_signed_status), 'FpXqep4t'))
                this.saveData();
              }else{
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
              }
            })
            .catch(error => {
              this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
          }else{
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          }
        } else{
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      }
    },

    // AUTO-FILL DOCTOR
    autoFillDoctor(index, item){
      setTimeout(() => {                
        this.aas_data.section1[index].first_name = item.first_name,
        this.aas_data.section1[index].middle_name = item.middle_name,
        this.aas_data.section1[index].last_name = item.last_name,
        this.aas_data.section1[index].suffix = item.suffix,
        this.aas_data.section1[index].is_primary_doctor = index === 0 ? 1 : 0
        this.aas_data.section1[index].doc_fullname = item.doctor_name
        this.aas_data.section1[index].doc_specialization = item.specialization
        this.aas_data.section1[index].doc_tin = item.doctor_tin_no
        this.aas_data.section1[index].doc_phic_acc_no = item.doc_phic_acc_no
        this.aas_data.section1[index].doc_code = item.doc_code
        this.aas_data.section1[index].doc_prc_license = item.doc_prc_license
        this.aas_data.section1[index].date_signed = null
        this.aas_data.section1[index].co_pay = null
        this.checkDataStatus('doctor');
      }, 100)
    },
  
    // CONFIRM ADD NEW DOCTOR
    confirmAddNewDoctor(){
      if(this.new_doctor.first_name && this.new_doctor.middle_name && this.new_doctor.last_name && this.new_doctor.specialization && this.new_doctor.doc_tin && this.new_doctor.doc_prc_license && this.new_doctor.doc_phic_acc_no){
        if(this.new_doctor.index === 0){
          if(this.aas_data.section2.doctor_signature){
            let title = 'All data including signatures of Doctor <br><span class="font-weight-bold">'+this.aas_data.section1[0].doc_fullname+'</span> will be cleared.'
            this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'red', title: title, body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'checkIfDoctorExist', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
          }else{
            this.checkIfDoctorExist();
          }
        }else{
          this.checkIfDoctorExist();
        }
      }else{
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Fields is Empty', body: 'Please fill out all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }
    },

    // CHECK IF NEW DOCTOR EXIST
    async checkIfDoctorExist(){

      let response = await this.$services.getEclaimDoctorsById({
        doctor_phic_account_no: this.new_doctor.doc_phic_acc_no,
        tin_no: this.new_doctor.doc_tin,
        prc_no: this.new_doctor.doc_prc_license,
        provider_tin: this.$store.state.prv_data.provider_tin,
        provider_code: this.$store.state.prv_data.provider_code        
      });

      if (response.status === 200){
        if(response.data.result === 0){
          if(this.new_doctor.index === 0){
             let new_doctor = [{
              provider_tin: this.$store.state.prv_data.provider_tin,
              provider_code: this.$store.state.prv_data.provider_code,
              is_primary_doctor: 1,
              first_name: this.new_doctor.first_name,
              middle_name: this.new_doctor.middle_name,
              last_name: this.new_doctor.last_name,
              specialization: this.new_doctor.specialization,
              doc_tin: this.new_doctor.doc_tin,
              doc_prc_license: this.new_doctor.doc_prc_license,
              doc_phic_acc_no: this.new_doctor.doc_phic_acc_no,
              doc_code: this.new_doctor.doc_code
            }]
            
            let response = await this.$services.trnUpdInpatientAas({
              request_key: 'patient_doctor',
              phic_tracking_number: this.trans_detail.phic_tracking_number,
              transaction_number: this.trans_detail.transaction_number,
              hmo_host_code: this.trans_detail.hmo_host_code,
              input_type: 'MANUAL',
              manual_doctor: new_doctor   
            });

            if (response.status === 200){
              if(response.data.success){
                if(this.aas_data.section2.doctor_signature){
                  let formData = new FormData();
                  formData.append('post_data', this.wsDataEncryption(JSON.stringify({
                    request_key: 'save_signature',
                    phic_tracking_number: this.trans_detail.phic_tracking_number,
                    transaction_number: this.trans_detail.transaction_number,
                    doctor_tin: this.old_primary_doctor.doc_tin,
                    status: 'clear'
                  })))

                  this.$axios.post(this.$tms_url+`resources/controller/trn_upd_inpatient_aas.php?${data_query}`, 
                    formData,
                    {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    }
                  ).then(() => {
                    if(response.data.success){
                      this.is_signed_status[2] = 0
                      sessionStorage.setItem('POI43', this.$crypto.AES.encrypt(JSON.stringify(this.is_signed_status), 'FpXqep4t'))
                      this.displayNewDoctor();
                    }else{
                      this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                  })
                  .catch(error => {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                  })
                }else{
                  this.displayNewDoctor();
                }
              }else{
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
              }
            } else{
              this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }


            // this.$axios.post(this.$tms_url+`resources/controller/trn_upd_inpatient_aas.php?${data_query}`, this.$qs.stringify({
            //   post_data: this.wsDataEncryption(JSON.stringify({
            //     request_key: 'patient_doctor',
            //     phic_tracking_number: this.trans_detail.phic_tracking_number,
            //     transaction_number: this.trans_detail.transaction_number,
            //     hmo_host_code: this.trans_detail.hmo_host_code,
            //     input_type: 'MANUAL',
            //     manual_doctor: new_doctor
            //   }))
            // }))
            // .then(response => { 
            //   if(response.data.success){
            //     if(this.aas_data.section2.doctor_signature){
            //       let formData = new FormData();
            //       formData.append('post_data', this.wsDataEncryption(JSON.stringify({
            //         request_key: 'save_signature',
            //         phic_tracking_number: this.trans_detail.phic_tracking_number,
            //         transaction_number: this.trans_detail.transaction_number,
            //         doctor_tin: this.old_primary_doctor.doc_tin,
            //         status: 'clear'
            //       })))
              
            //       this.$axios.post(this.$tms_url+`resources/controller/trn_upd_inpatient_aas.php?${data_query}`, 
            //         formData,
            //         {
            //           headers: {
            //             'Content-Type': 'multipart/form-data'
            //           }
            //         }
            //       ).then(() => {
            //         if(response.data.success){
            //           this.is_signed_status[2] = 0
            //           sessionStorage.setItem('POI43', this.$crypto.AES.encrypt(JSON.stringify(this.is_signed_status), 'FpXqep4t'))
            //           this.displayNewDoctor();
            //         }else{
            //           this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            //         }
            //       })
            //       .catch(error => {
            //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            //       })
            //     }else{
            //       this.displayNewDoctor();
            //     }
            //   }else{
            //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            //   }
            // })
            // .catch(error => {
            //   this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            // })

          }else{
            this.displayNewDoctor();
          }
        }else{
          this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'red', title: 'Doctor already exist', body: 'Please choose from the selection box', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          this.new_doctor.first_name = ''
          this.new_doctor.middle_name = ''
          this.new_doctor.last_name = ''
          this.new_doctor.specialization = ''
          this.new_doctor.doc_tin = ''
          this.new_doctor.doc_prc_license = ''
          this.new_doctor.doc_phic_acc_no = ''
          this.new_doctor.doc_code = ''
          this.new_doctor_loader = false
          this.new_doctor_dialog = false
        }
      } else{
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      }

      // this.$axios.post(this.$tms_url+'resources/api/_get_eclaim_doctors_by_id.php', this.$qs.stringify({
      //   post_data: this.wsDataEncryption(JSON.stringify({
      //     doctor_phic_account_no: this.new_doctor.doc_phic_acc_no,
      //     tin_no: this.new_doctor.doc_tin,
      //     prc_no: this.new_doctor.doc_prc_license,
      //     provider_tin: this.$store.state.prv_data.provider_tin,
      //     provider_code: this.$store.state.prv_data.provider_code
      //   }))
      // }))
      // .then(response => {
      //   if(response.data.result === 0){
      //     if(this.new_doctor.index === 0){
      //        let new_doctor = [{
      //         provider_tin: this.$store.state.prv_data.provider_tin,
      //         provider_code: this.$store.state.prv_data.provider_code,
      //         is_primary_doctor: 1,
      //         first_name: this.new_doctor.first_name,
      //         middle_name: this.new_doctor.middle_name,
      //         last_name: this.new_doctor.last_name,
      //         specialization: this.new_doctor.specialization,
      //         doc_tin: this.new_doctor.doc_tin,
      //         doc_prc_license: this.new_doctor.doc_prc_license,
      //         doc_phic_acc_no: this.new_doctor.doc_phic_acc_no,
      //         doc_code: this.new_doctor.doc_code
      //       }]
            
      //       this.$axios.post(this.$tms_url+`resources/controller/trn_upd_inpatient_aas.php?${data_query}`, this.$qs.stringify({
      //         post_data: this.wsDataEncryption(JSON.stringify({
      //           request_key: 'patient_doctor',
      //           phic_tracking_number: this.trans_detail.phic_tracking_number,
      //           transaction_number: this.trans_detail.transaction_number,
      //           hmo_host_code: this.trans_detail.hmo_host_code,
      //           input_type: 'MANUAL',
      //           manual_doctor: new_doctor
      //         }))
      //       }))
      //       .then(response => { 
      //         if(response.data.success){
      //           if(this.aas_data.section2.doctor_signature){
      //             let formData = new FormData();
      //             formData.append('post_data', this.wsDataEncryption(JSON.stringify({
      //               request_key: 'save_signature',
      //               phic_tracking_number: this.trans_detail.phic_tracking_number,
      //               transaction_number: this.trans_detail.transaction_number,
      //               doctor_tin: this.old_primary_doctor.doc_tin,
      //               status: 'clear'
      //             })))
              
      //             this.$axios.post(this.$tms_url+`resources/controller/trn_upd_inpatient_aas.php?${data_query}`, 
      //               formData,
      //               {
      //                 headers: {
      //                   'Content-Type': 'multipart/form-data'
      //                 }
      //               }
      //             ).then(() => {
      //               if(response.data.success){
      //                 this.is_signed_status[2] = 0
      //                 sessionStorage.setItem('POI43', this.$crypto.AES.encrypt(JSON.stringify(this.is_signed_status), 'FpXqep4t'))
      //                 this.displayNewDoctor();
      //               }else{
      //                 this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      //               }
      //             })
      //             .catch(error => {
      //               this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      //             })
      //           }else{
      //             this.displayNewDoctor();
      //           }
      //         }else{
      //           this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      //         }
      //       })
      //       .catch(error => {
      //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      //       })
      //     }else{
      //       this.displayNewDoctor();
      //     }
      //   }else{
      //     this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'red', title: 'Doctor already exist', body: 'Please choose from the selection box', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      //     this.new_doctor.first_name = ''
      //     this.new_doctor.middle_name = ''
      //     this.new_doctor.last_name = ''
      //     this.new_doctor.specialization = ''
      //     this.new_doctor.doc_tin = ''
      //     this.new_doctor.doc_prc_license = ''
      //     this.new_doctor.doc_phic_acc_no = ''
      //     this.new_doctor.doc_code = ''
      //     this.new_doctor_loader = false
      //     this.new_doctor_dialog = false
      //   }
      // })
      // .catch(error => {
      //   this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      // })   
    },

    // DISPLAY NEW DOCTOR
    displayNewDoctor(){
      if(this.new_doctor.index === 0){
        this.old_primary_doctor = {
          doc_fullname: this.aas_data.section1[0].doc_fullname,
          doc_specialization: this.aas_data.section1[0].doc_specialization,
          doc_tin: this.aas_data.section1[0].doc_tin,
          doc_prc_license: this.aas_data.section1[0].doc_prc_license,
          doc_phic_acc_no: this.aas_data.section1[0].doc_phic_acc_no,
          doc_code: this.aas_data.section1[0].doc_code
        }
      }

      this.aas_data.section1[this.new_doctor.index].doc_fullname = this.new_doctor.first_name+' '+this.new_doctor.middle_name+' '+this.new_doctor.last_name
      this.aas_data.section1[this.new_doctor.index].doc_specialization = this.new_doctor.specialization
      this.aas_data.section1[this.new_doctor.index].doc_tin = this.new_doctor.doc_tin
      this.aas_data.section1[this.new_doctor.index].doc_prc_license = this.new_doctor.doc_prc_license
      this.aas_data.section1[this.new_doctor.index].doc_phic_acc_no = this.new_doctor.doc_phic_acc_no
      this.aas_data.section1[this.new_doctor.index].doc_code = this.new_doctor.doc_code
      this.aas_data.section1[this.new_doctor.index].date_signed = null
      this.aas_data.section1[this.new_doctor.index].co_pay = null

      this.doctor_list.push({
        doctor_name: this.aas_data.section1[this.new_doctor.index].doc_fullname,
        specialization: this.aas_data.section1[this.new_doctor.index].doc_specialization,
        doctor_tin_no: this.aas_data.section1[this.new_doctor.index].doc_tin,
        doc_prc_license: this.aas_data.section1[this.new_doctor.index].doc_prc_license,
        doc_phic_acc_no: this.aas_data.section1[this.new_doctor.index].doc_phic_acc_no,
        doc_code: this.aas_data.section1[this.new_doctor.index].doc_code
      })

      this.new_doctor.first_name = ''
      this.new_doctor.middle_name = ''
      this.new_doctor.last_name = ''
      this.new_doctor.specialization = ''
      this.new_doctor.doc_tin = ''
      this.new_doctor.doc_prc_license = ''
      this.new_doctor.doc_phic_acc_no = ''
      this.new_doctor.doc_code = ''
      this.new_doctor_loader = false
      this.new_doctor_dialog = false
      this.alert = {}

      localStorage.setItem('VGR084', this.$crypto.AES.encrypt(JSON.stringify(this.doctor_list), 'pggpjxKK'))
      this.checkDataStatus('doctor');
      this.saveData();
    },

    // SHOW SIGNATURE PAD
    showSignaturePad(item){
      this.signature_is_saved = true
      this.disable_clear_btn = true
      this.disable_apply_btn = true

      if(item === 'patient'){
        this.signature_of = 'PATIENT'

        if(!this.aas_data.section2.patient_signature && this.trans_detail.editable){
          setTimeout(() => this.initializeCanvas('patient-sign'), 500)
        }
      }else if(item === 'hospital'){
        this.signature_of = 'HOSPITAL'

        if(!this.aas_data.section2.hospital_signature && this.trans_detail.editable){
          setTimeout(() => this.initializeCanvas('hospital-sign'), 500)
        }
      }else{
        this.signature_of = 'DOCTOR'

        if(!this.aas_data.section2.doctor_signature && this.trans_detail.editable){
          setTimeout(() => this.initializeCanvas('doctor-sign'), 500)
        }
      }

      this.show_signature = true
    },

    // CLOSE SIGNATURE
    confirmCloseSignature(){
      if(this.signature_is_saved){
        this.show_signature = false
      }else{
        this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'red', title: 'Unsaved Signature will be discarded if you leave the page', body: 'Are you sure you want to leave this page?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'closeSignature', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
      }
    },

    // CLOSE SIGNATURE
    closeSignature(){
      this.alert = {}
      this.ctx.clearRect(0, 0, this.w, this.h);
      this.canvas.removeEventListener("mousemove", this.mouseMove)
      this.canvas.removeEventListener("mousedown", this.mouseDown)
      this.canvas.removeEventListener("mouseup", this.mouseUp)
      this.canvas.removeEventListener("mouseout", this.mouseOut)
      this.show_signature = false
    },

    // INITIALIZE CANVAS
    initializeCanvas(canvas_id){
      this.canvas = document.getElementById(canvas_id)
      this.canvas.height = this.canvas.clientHeight
      this.canvas.width = this.canvas.clientWidth
      this.ctx = this.canvas.getContext("2d");

      this.w = this.canvas.width;
      this.h = this.canvas.height;

      // CALL EVENT LISTENER 
      this.canvas.addEventListener("mousemove", this.mouseMove)
      this.canvas.addEventListener("mousedown", this.mouseDown)
      this.canvas.addEventListener("mouseup", this.mouseUp)
      this.canvas.addEventListener("mouseout", this.mouseOut)

      this.canvas.addEventListener("touchstart", this.touchStart)
      this.canvas.addEventListener("touchend", this.touchEnd)
      this.canvas.addEventListener("touchmove", this.touchMove)
    },
    
    mouseMove(e){
      this.findxy('move', e)
    },
    mouseDown(e){
      this.findxy('down', e)
    },
    mouseUp(e){
      this.findxy('up', e)
    },
    mouseOut(e){
      this.findxy('out', e)
    },
    touchStart(e){
      this.findxy('touch_start', e)
    },
    touchEnd(e){
      this.findxy('touch_end', e)
    },
    touchMove(e){
      this.findxy('touch_move', e)
    },

    findxy(res, e) {
      // WHEN USER CLICK
      if(res == 'down'){
        this.currX = e.offsetX;
        this.currY = e.offsetY;
        this.prevX = this.currX;
        this.prevY = this.currY;

        this.flag = true;
      }
      // WHEN USER UNCLICK AND OUT OF THE CANVAS
      if (res == 'up' || res == "out") {
        this.flag = false;
      }
      // WHEN USER MOVE THE MOUSE
      if (res == 'move') {
        // WHEN USER MOVE WHILE USER IS CLICKING 
        if(this.flag){
          this.currX = e.offsetX;
          this.currY = e.offsetY;
  
          this.ctx.lineWidth = 4;
          this.ctx.moveTo(this.prevX, this.prevY);
          this.ctx.lineTo(this.currX, this.currY);
          this.ctx.stroke();

          this.prevX = this.currX;
          this.prevY = this.currY;

          this.signature_is_saved = false
          this.disable_apply_btn = false
          this.disable_clear_btn = false
        }
      }

      if(res === 'touch_start'){
        let rect = this.canvas.getBoundingClientRect();
        let touch = e.touches[0]

        this.currX = touch.clientX - rect.left;
        this.currY = touch.clientY - rect.top;
        this.prevX = this.currX;
        this.prevY = this.currY;

        this.flag = true;
      }else if(res === 'touch_move'){
        let rect = this.canvas.getBoundingClientRect();

        let touch = e.touches[0]
        
        // WHEN USER MOVE WHILE USER IS CLICKING 
        if(this.flag){
          this.currX = touch.clientX - rect.left;
          this.currY = touch.clientY - rect.top;
  
          this.ctx.lineWidth = 4;
          this.ctx.moveTo(this.prevX, this.prevY);
          this.ctx.lineTo(this.currX, this.currY);
          this.ctx.stroke();

          this.prevX = this.currX;
          this.prevY = this.currY;

          this.signature_is_saved = false
          this.disable_apply_btn = false
          this.disable_clear_btn = false
        }
      }
    },
    
    // CLEAR SIGNATURE
    clearSignature(){
      this.signature_is_saved = true
      this.disable_apply_btn = true
      this.disable_clear_btn = true
      this.ctx.clearRect(0, 0, this.w, this.h);

      if(this.signature_of === 'PATIENT'){
        this.initializeCanvas('patient-sign');
      }else if(this.signature_of === 'HOSPITAL'){
        this.initializeCanvas('hospital-sign');
      }else{
        this.initializeCanvas('doctor-sign');
      }
    },

    // CONFIRM SAVE SIGNATURE
    confirmSaveSignature(){
      let title = ''
      
      if(this.signature_of === 'PATIENT'){
        let patient_name = sessionStorage.getItem('LTRRTS') ? this.$crypto.AES.decrypt(sessionStorage.getItem('LTRRTS'), 'gGd43fsg').toString(this.$crypto.enc.Utf8) : null
        title = 'Signature for patient: <span class="font-weight-bold">'+patient_name+'</span><br> will be applied and cannot be undone'
      }else if(this.signature_of === 'HOSPITAL'){    
        title = 'Signature will be applied and cannot be undone'
      }else{
        title = 'Signature for doctor: <span class="font-weight-bold">'+this.aas_data.section1[0].doc_fullname+'</span><br> will be applied and cannot be undone'
      }

      this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'red', title: title, body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'saveSignature', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
    },

    // SAVE SIGNATURE
    async saveSignature(){
      this.signature_is_saving = true
      this.file = this.dataURLtoFile(this.canvas.toDataURL(), '.jpg')

      let doctors = []
      this.aas_data.section1.forEach(element => {
        doctors.push({
          patient_doctor_id: element.patient_doctor_id,
          is_primary_doctor: element.is_primary_doctor,
          doc_tin: element.doc_tin,
          doc_prc_license: element.doc_prc_license,
          doc_phic_acc_no: element.doc_phic_acc_no,
          doc_code: element.doc_code,
          co_pay: element.co_pay
        })
      })

      // this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_aas.php', this.$qs.stringify({
      //   post_data: this.wsDataEncryption(JSON.stringify({
      //     request_key: 'patient_doctor',
      //     ...(this.post_details),
      //     hmo_host_code: this.trans_detail.hmo_host_code,
      //     input_type: 'SELECTION',
      //     phic_doctor: doctors
      //   }))
      // }))
      // .then(response => {
      //   if(response.data.success){
          let formData = new FormData();
          formData.append('file', this.file)
          formData.append('post_data', this.wsDataEncryption(JSON.stringify({
            //phic_tracking_number: this.trans_detail.phic_tracking_number,
            signature_from: this.signature_of.toLowerCase(),
            transaction_number: this.trans_detail.transaction_number,
            provider_code: this.$store.state.prv_data.provider_code,
            //provider_tin: this.$store.state.prv_data.provider_tin,
           // mem_birthdate: this.aas_data.section2.patient_birthdate,
            //doctor_tin: this.aas_data.section1[0].doc_tin,
            //hmo_host_code: this.trans_detail.hmo_host_code,
            //is_signed: '2',
            //...this.relation_reason,
            //created_by: this.$store.state.usr_credentials.user_name
          })))

          // this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_aas.php', 
          //   formData,
          //   {
          //     headers: {
          //       'Content-Type': 'multipart/form-data'
          //     }
          //   }
          // ).then(response => {
          //   if(response.data.success){
          //     response.data = this.responseDataDecryption(response.data)
          //     if(this.signature_of === 'PATIENT'){
          //       this.aas_data.section2.patient_signature = this.canvas.toDataURL();
          //       this.patient_signature = true
          //       this.is_signed_status[0] = 2
          //       this.date_signed_for_ctf.patient = response.data.date_signed ? this.formatDate(response.data.date_signed.substring(0, 10)) : ''
          //     }else if(this.signature_of === 'HOSPITAL'){
          //       this.aas_data.section2.hospital_signature = this.canvas.toDataURL();
          //       this.hospital_signature = true
          //       this.is_signed_status[1] = 2
          //       this.date_signed_for_ctf.hospital = response.data.date_signed ? this.formatDate(response.data.date_signed.substring(0, 10)) : ''
          //     }else{
          //       this.aas_data.section2.doctor_signature = this.canvas.toDataURL();
          //       this.aas_data.section1[0].date_signed = response.data.date_signed ? this.formatDate(response.data.date_signed.substring(0, 10)) : null
          //       this.is_signed_status[2] = 2
          //       this.date_signed_for_ctf.doctor = response.data.date_signed ? this.formatDate(response.data.date_signed.substring(0, 10)) : ''
          //     }
    
          //     this.old_primary_doctor = {
          //       doc_fullname: this.aas_data.section1[0].doc_fullname,
          //       doc_specialization: this.aas_data.section1[0].doc_specialization,
          //       doc_tin: this.aas_data.section1[0].doc_tin,
          //       doc_prc_license: this.aas_data.section1[0].doc_prc_license,
          //       doc_phic_acc_no: this.aas_data.section1[0].doc_phic_acc_no,
          //       doc_code: this.aas_data.section1[0].doc_code
          //     }
    
          //     this.ctx.clearRect(0, 0, this.w, this.h);
          //     this.canvas.removeEventListener("mousemove", this.mouseMove)
          //     this.canvas.removeEventListener("mousedown", this.mouseDown)
          //     this.canvas.removeEventListener("mouseup", this.mouseUp)
          //     this.canvas.removeEventListener("mouseout", this.mouseOut)
    
          //     this.show_signature = false
          //     this.signature_is_saving = false
          //     this.alert = {}
    
          //     sessionStorage.setItem('POI43', this.$crypto.AES.encrypt(JSON.stringify(this.is_signed_status), 'FpXqep4t'))
          //     this.saveData();
          //   }else{
          //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          //   }
          // })
          // .catch(error => {
          //   this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          // })

          let response = await this.$services.trnAddEclaimsSignature({
            formData
          });

          if (response.status === 200) {
            if(response.data.success){
              response.data = this.responseDataDecryption(response.data)
              if(this.signature_of === 'PATIENT'){
                this.aas_data.section2.patient_signature = this.canvas.toDataURL();
                this.patient_signature = true
                this.is_signed_status[0] = 2
                this.date_signed_for_ctf.patient = response.data.date_signed ? this.formatDate(response.data.date_signed.substring(0, 10)) : ''
              }else if(this.signature_of === 'HOSPITAL'){
                this.aas_data.section2.hospital_signature = this.canvas.toDataURL();
                this.hospital_signature = true
                this.is_signed_status[1] = 2
                this.date_signed_for_ctf.hospital = response.data.date_signed ? this.formatDate(response.data.date_signed.substring(0, 10)) : ''
              }else{
                this.aas_data.section2.doctor_signature = this.canvas.toDataURL();
                this.aas_data.section1[0].date_signed = response.data.date_signed ? this.formatDate(response.data.date_signed.substring(0, 10)) : null
                this.is_signed_status[2] = 2
                this.date_signed_for_ctf.doctor = response.data.date_signed ? this.formatDate(response.data.date_signed.substring(0, 10)) : ''
              }
    
              this.old_primary_doctor = {
                doc_fullname: this.aas_data.section1[0].doc_fullname,
                doc_specialization: this.aas_data.section1[0].doc_specialization,
                doc_tin: this.aas_data.section1[0].doc_tin,
                doc_prc_license: this.aas_data.section1[0].doc_prc_license,
                doc_phic_acc_no: this.aas_data.section1[0].doc_phic_acc_no,
                doc_code: this.aas_data.section1[0].doc_code
              }
    
              this.ctx.clearRect(0, 0, this.w, this.h);
              this.canvas.removeEventListener("mousemove", this.mouseMove)
              this.canvas.removeEventListener("mousedown", this.mouseDown)
              this.canvas.removeEventListener("mouseup", this.mouseUp)
              this.canvas.removeEventListener("mouseout", this.mouseOut)
    
              this.show_signature = false
              this.signature_is_saving = false
              this.alert = {}
    
              sessionStorage.setItem('POI43', this.$crypto.AES.encrypt(JSON.stringify(this.is_signed_status), 'FpXqep4t'))
              this.saveData();
            }else{
              this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
          } else{
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          }

          // this.$axios.post(this.$cms_url+'resources/controller/trn_add_eclaims_signature.php', 
          //   formData,
          //   {
          //     headers: {
          //       'Content-Type': 'multipart/form-data'
          //     }
          //   }
          // ).then(response => {
          //   if(response.data.success){
          //     response.data = this.responseDataDecryption(response.data)
          //     if(this.signature_of === 'PATIENT'){
          //       this.aas_data.section2.patient_signature = this.canvas.toDataURL();
          //       this.patient_signature = true
          //       this.is_signed_status[0] = 2
          //       this.date_signed_for_ctf.patient = response.data.date_signed ? this.formatDate(response.data.date_signed.substring(0, 10)) : ''
          //     }else if(this.signature_of === 'HOSPITAL'){
          //       this.aas_data.section2.hospital_signature = this.canvas.toDataURL();
          //       this.hospital_signature = true
          //       this.is_signed_status[1] = 2
          //       this.date_signed_for_ctf.hospital = response.data.date_signed ? this.formatDate(response.data.date_signed.substring(0, 10)) : ''
          //     }else{
          //       this.aas_data.section2.doctor_signature = this.canvas.toDataURL();
          //       this.aas_data.section1[0].date_signed = response.data.date_signed ? this.formatDate(response.data.date_signed.substring(0, 10)) : null
          //       this.is_signed_status[2] = 2
          //       this.date_signed_for_ctf.doctor = response.data.date_signed ? this.formatDate(response.data.date_signed.substring(0, 10)) : ''
          //     }
    
          //     this.old_primary_doctor = {
          //       doc_fullname: this.aas_data.section1[0].doc_fullname,
          //       doc_specialization: this.aas_data.section1[0].doc_specialization,
          //       doc_tin: this.aas_data.section1[0].doc_tin,
          //       doc_prc_license: this.aas_data.section1[0].doc_prc_license,
          //       doc_phic_acc_no: this.aas_data.section1[0].doc_phic_acc_no,
          //       doc_code: this.aas_data.section1[0].doc_code
          //     }
    
          //     this.ctx.clearRect(0, 0, this.w, this.h);
          //     this.canvas.removeEventListener("mousemove", this.mouseMove)
          //     this.canvas.removeEventListener("mousedown", this.mouseDown)
          //     this.canvas.removeEventListener("mouseup", this.mouseUp)
          //     this.canvas.removeEventListener("mouseout", this.mouseOut)
    
          //     this.show_signature = false
          //     this.signature_is_saving = false
          //     this.alert = {}
    
          //     sessionStorage.setItem('POI43', this.$crypto.AES.encrypt(JSON.stringify(this.is_signed_status), 'FpXqep4t'))
          //     this.saveData();
          //   }else{
          //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          //   }
          // })
          // .catch(error => {
          //   this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          // })
      //  }
      //   else{
      //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      //   }
      // })
      // .catch(error => {
      //   this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      // })  
    },

    // CONVERT BASE 64 TO FILE
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
        
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      return new File([u8arr], filename, {type:mime});
    },

    // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
    numberOnly(event){
      if ((event.which < 48 || event.which > 57) && event.which !== 45){
        event.preventDefault();
      }
    },

    // DISPLAY COMMENT DATA
    displayCommentData(data){
      if(data === 'doctor'){
        this.comment_title = 'DOCTOR ACCREDITATION'
        this.comment_content = this.comment_data.cf2_part2_number10
      }
      
      this.comment_dialog = true
    },

    // CHECK IF DATA HAS BEEN CHANGED
    checkDataStatus(data){
      this.$emit('change-status')
      
      if(data === 'doctor'){
        this.aas_data.status.doctor = true
      }else{
        this.relation_reason.status = true
      }
    },

    // SAVE DATA TO SESSION STORAGE
    saveData(){
      sessionStorage.setItem('GLORS6', this.$crypto.AES.encrypt(JSON.stringify(this.aas_data), 'dspof43S'))
      sessionStorage.setItem('PDFG5F', this.$crypto.AES.encrypt(JSON.stringify(this.relation_reason), 'XCdx3F9D'))
      sessionStorage.setItem('LMNSP2', this.$crypto.AES.encrypt(JSON.stringify(this.date_signed_for_ctf), 'MndeXf9d'))
    }
  },

  destroyed(){
    this.saveData();
  }
}
</script>

<style scoped>
.doctor-border{
  border: 3px solid lightgrey;
  min-height: 25px;
  padding: 0 6px;
}
.signature-style{
  height: 250px;
  padding: 0 20px;
}
.signature-pad{
  border: 1px solid lightgray;
  border-radius: 4px;
  height: 250px;
  width: 100%;
  position: relative;
  z-index: 999;
}
::v-deep .v-dialog{
  overflow-x: hidden !important
}
</style>