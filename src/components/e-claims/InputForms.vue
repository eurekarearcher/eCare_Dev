<template>
  <div>
    <Navbar :navbar="navbar" />
    <!-- E-CLAIM PROCESSING -->
    <div v-scroll="getHeightOnScroll" v-resize="onScreenResize" class="sticky">
      <template v-if="screen_width > 960">
        <v-sheet :width="screen_width - 210" class="ml-15">
          <h1 class="title text--secondary pt-3 pb-1">E-Claim Processing - {{ trans_detail.transaction_type.charAt(0) + trans_detail.transaction_type.slice(1).toLowerCase() }}</h1>
          <v-card outlined tile>
            <v-tabs background-color="light-blue darken-2" show-arrows hide-slider dark grow>
              <v-tab class="hover-tab" active-class="active-tab" to="/input-forms/patient-data">
                <v-badge v-if="trans_detail.crd_claims_status === 'Screening Rejected' && ptd_comment > 0" :content="ptd_comment" color="red">PATIENT DATA</v-badge>
                <span v-else>PATIENT DATA</span>
              </v-tab>

              <v-tab class="hover-tab" active-class="active-tab" to="/input-forms/patient-confinement">
                <v-badge v-if="trans_detail.crd_claims_status === 'Screening Rejected' && pci_comment > 0" :content="pci_comment" color="red">PATIENT CONFINEMENT</v-badge>
                <span v-else>PATIENT CONFINEMENT</span>
              </v-tab>

              <v-tab class="hover-tab" active-class="active-tab" to="/input-forms/physical-examination">
                <v-badge v-if="trans_detail.crd_claims_status === 'Screening Rejected' && pex_comment > 0" :content="pex_comment" color="red">PHYSICAL EXAMINATION</v-badge>
                <span v-else>PHYSICAL EXAMINATION</span>
              </v-tab>

              <template v-if="(trans_detail.gender !== 'MALE' || trans_detail.gender !== 'M') && trans_detail.phic_packages.includes('MATERNITY')">
                <v-tab class="hover-tab" active-class="active-tab" to="/input-forms/maternity">
                  <v-badge v-if="trans_detail.crd_claims_status === 'Screening Rejected' && mat_comment > 0" :content="mat_comment" color="red">MATERNITY</v-badge>
                  <span v-else>MATERNITY</span>
                </v-tab>
              </template>

              <!-- <v-tab v-if="this.trans_detail.transaction_type === 'INPATIENT'" class="hover-tab" active-class="active-tab" to="/input-forms/course-in-the-ward">
                <v-badge v-if="trans_detail.crd_claims_status === 'Screening Rejected' && ciw_comment > 0" :content="ciw_comment" color="red">COURSE IN THE WARD</v-badge>
                <span v-else>COURSE IN THE WARD</span>
              </v-tab> -->
              
              <v-tab class="hover-tab" active-class="active-tab" to="/input-forms/course-in-the-ward">
                <v-badge v-if="trans_detail.crd_claims_status === 'Screening Rejected' && ciw_comment > 0" :content="ciw_comment" color="red">
                  <span v-if="trans_detail.transaction_type === 'INPATIENT'">COURSE IN THE WARD</span>
                  <span v-else>TREATMENT COURSE (OPD)</span>
                </v-badge>
                <span v-else> 
                  <span v-if="trans_detail.transaction_type === 'INPATIENT'">COURSE IN THE WARD</span>
                  <span v-else>TREATMENT COURSE (OPD)</span>
                </span>
              </v-tab>

              <v-tab class="hover-tab" active-class="active-tab" to="/input-forms/accreditation-and-signature">
                <v-badge v-if="trans_detail.crd_claims_status === 'Screening Rejected' && aas_comment > 0" :content="aas_comment" color="red">ACCREDITATION AND SIGNATURE</v-badge>
                <span v-else>ACCREDITATION AND SIGNATURE</span>
              </v-tab>

              <template v-if="$store.state.usr_credentials.department === 'Credit and Collection'"> 
                <v-tab class="hover-tab" active-class="active-tab" to="/input-forms/certification">
                  <v-badge v-if="trans_detail.crd_claims_status === 'Screening Rejected' && ctf_comment > 0" :content="ctf_comment" color="red">CERTIFICATION</v-badge>
                  <span v-else>CERTIFICATION</span>
                </v-tab>
              </template>
              <!-- <template v-if="$store.state.usr_credentials.department === 'Nurse Station'"> 
                <v-tab class="hover-tab" active-class="active-tab" to="/input-forms/certification">
                  <v-badge v-if="trans_detail.crd_claims_status === 'Screening Rejected' && ctf_comment > 0" :content="ctf_comment" color="red">CERTIFICATION</v-badge>
                  <span v-else>CERTIFICATION</span>
                </v-tab>
              </template> -->
            </v-tabs>
          </v-card>
        </v-sheet>
        
        <div class="btn-group">
          <!-- CF-FORMS BUTTON -->
          <v-tooltip :disabled="!trans_detail.editable" color="error" bottom>
            <template #activator="{ on }">
              <v-sheet v-on="on" v-if="$store.state.usr_credentials.department === 'Credit and Collection'" @click="trans_detail.phic_member_eligibility_status === 'Eligible' ? $router.push('/cf-forms/pbef') : $router.push('/cf-forms/cf2')" class="mb-2 py-6 px-7 btn-hover" elevation="1">
                <v-icon size="30">mdi-file-document</v-icon>
                <h5 class="mt-1 font-weight-medium">CF-Forms</h5>
              </v-sheet>
            </template>
            Kindly save any changes first before generating the CF Form to get the most updated data
          </v-tooltip>

          <!-- <v-tooltip :disabled="!trans_detail.editable" color="error" bottom>
            <template #activator="{ on }">
              <v-sheet v-on="on" v-if="$store.state.usr_credentials.department === 'Nurse Station'" @click="trans_detail.phic_member_eligibility_status === 'Eligible' ? $router.push('/cf-forms/pbef') : $router.push('/cf-forms/cf2')" class="mb-2 py-6 px-7 btn-hover" elevation="1">
                <v-icon size="30">mdi-file-document</v-icon>
                <h5 class="mt-1 font-weight-medium">CF-Forms</h5>
              </v-sheet>
            </template>
            Kindly save any changes first before generating the CF Form to get the most updated data
          </v-tooltip> -->

          <!-- SAVE BUTTON -->
          <v-sheet v-if="trans_detail.editable" :class="change_status === '1' ? 'btn-hover' : 'grey--text'" @click="change_status === '1' ? checkSaveChanges() : ''" class="py-4 px-6" elevation="1">
            <v-icon :class="{'grey--text' : change_status === '0'}" size="30">mdi-content-save</v-icon>
            <h5 class="mt-1 font-weight-medium">SAVE ALL<br/>CHANGES</h5>
          </v-sheet>

          <!-- SUBMIT BUTTON -->
          <!-- <v-sheet v-if="trans_detail.editable && $store.state.usr_credentials.department === 'Nurse Station'" @click="checkSubmitData('submit')" class="py-3 px-6 mt-2 btn-hover" elevation="1">
            <v-icon size="35">mdi-check</v-icon>
            <h5 class="font-weight-medium">
              SUBMIT TO <br>
              <span>{{ $store.state.usr_credentials.department === 'Nurse Station' ? 'CREDIT' : 'AUDIT' }}</span>
            </h5>
          </v-sheet> -->
          <v-sheet v-if="trans_detail.editable && !trans_detail.receipt_ticket_no" @click="checkSubmitData('submit')" class="py-3 px-6 mt-2 btn-hover" elevation="1">
            <v-icon size="35">mdi-check</v-icon>
            <template v-if="$store.state.usr_credentials.department === 'Nurse Station'"> 
              <h5 class="font-weight-medium">
                SUBMIT TO <br>
                <span>CAC</span>
              </h5>
            </template>
            <template v-else> 
              <h5 class="font-weight-medium">
                SUBMIT TO <br>
                <span>PHIC</span>
              </h5>
            </template>
          </v-sheet>
        </div>
      </template>

      <template v-else>
        <h1 class="title white text--secondary pt-3 pb-1">E-Claim Processing - {{ trans_detail.transaction_type.charAt(0) + trans_detail.transaction_type.slice(1).toLowerCase() }}</h1>
        <v-select v-model="selected_category" :items="categories" item-text="path" class="mx-6" background-color="light-blue darken-2" menu-props="bottom, offsetY" ref="category" hide-details filled dark>
          <template v-slot:prepend-inner>
            <v-icon size="20">mdi-shape-outline</v-icon>
          </template>
          <template v-slot:selection="{ item }">{{ item.name }}</template>
          <template v-slot:item="{ item }">
            <v-list-item :to="item.path" @click="selected_category = item.path" v-on:click="$refs.category.blur">{{ item.name }}</v-list-item>
          </template>
          <template v-if="trans_detail.editable" v-slot:prepend-item>
            <h4 class="font-weight-medium grey--text text--darken-1 pl-2 pt-1">Category</h4>
          </template>
          <template v-if="trans_detail.editable" v-slot:append-item>
            <v-divider></v-divider>
            <h4 class="font-weight-medium grey--text text--darken-1 pl-2 pt-1">Action</h4>
            <v-list-item :disabled="change_status === '0'" @click="checkSaveChanges()"> SAVE ALL CHANGES</v-list-item>
            <v-list-item v-if="$store.state.usr_credentials.department === 'Nurse Station'" @click="checkSubmitData('submit')">SUBMIT TO CREDIT</v-list-item>
          </template>
          <template v-else-if="$store.state.usr_credentials.department === 'Credit and Collection'" v-slot:append-item>
            <v-list-item @click="trans_detail.phic_member_eligibility_status === 'Eligible' ? $router.push('/cf-forms/pbef') : $router.push('/cf-forms/cf2')">CF-FORMS</v-list-item>
          </template>
        </v-select>
      </template>
    </div>

    <!-- CATEGORY -->
    <v-card v-show="!loading_category && !loading_comment" :width="screen_width < 960 ? screen_width : screen_width - 210" class="category-group" outlined tile>
      <PatientData 
        v-if="$route.params.category === 'patient-data'" 
        :trans_detail="trans_detail"
        :comment_data="comment_data.ptd"
        @change-status="changeStatus" 
        ref="save_data" 
      />
      <PatientConfinement 
        v-else-if="$route.params.category === 'patient-confinement'" 
        v-model="navigation_checker" 
        :trans_detail="trans_detail" 
        :required="required" 
        :comment_data="comment_data.pci"
        @change-status="changeStatus" 
        ref="save_data" 
      />
      <PhysicalExamination 
        v-else-if="$route.params.category === 'physical-examination'" 
        v-model="navigation_checker"
        :trans_detail="trans_detail"
        :comment_data="comment_data.pex"
        @change-status="changeStatus" 
        ref="save_data" 
      />
      <Maternity 
        v-else-if="$route.params.category === 'maternity'" 
        v-model="navigation_checker" 
        :trans_detail="trans_detail"
        :required="required" 
        :comment_data="comment_data.mat"
        @change-status="changeStatus" 
        ref="save_data" 
      />

      <!-- COMMENT FOR OUTPATIENT  -->
      <!-- UNCOMMENT IF THE PROCESS IS INPATIENT -->
      <CourseInTheWard 
        v-else-if="$route.params.category === 'course-in-the-ward'" 
        v-model="navigation_checker" 
        :trans_detail="trans_detail" 
        :required="required" 
        :comment_data="comment_data.ciw"
        @change-status="changeStatus" 
        ref="save_data" 
      />

      <AccreditationSignature 
        v-else-if="$route.params.category === 'accreditation-and-signature'" 
        v-model="navigation_checker" 
        :trans_detail="trans_detail" 
        :required="required" 
        :comment_data="comment_data.aas"
        @change-status="changeStatus" 
        ref="save_data" 
      />
      <Certification 
        v-else-if="$route.params.category === 'certification'" 
        v-model="navigation_checker"
        :trans_detail="trans_detail"
        :comment_data="comment_data.ctf"
        :required="required"
        @change-status="changeStatus" 
        ref="save_data" 
      />
    </v-card>

    <!-- SCROLL-TO-TOP -->
    <v-slide-y-transition>
     <v-btn v-show="back_to_top" @click="$vuetify.goTo(target, options)" class="scroll-to-top" color="primary" small fab>
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </v-slide-y-transition>

    <!-- LOADER FOR CATEGORY -->
    <v-row v-show="loading_category || loading_comment" class="category-loader" justify-center align-center>
      <v-progress-circular color="primary" size="35" indeterminate></v-progress-circular>
      <h4 class="light-blue--text text--darken-4 pl-5">Loading... Please wait...</h4>
    </v-row>

    <PostTransaction :trans_detail="trans_detail" :for_action="for_action" ref="post_transaction" @submit_success="alert = {}" />
    <Alert :alert="alert" @leavePage="leavePage" @viewCurrentLOA="viewCurrentLOA" @proceedToInpatientResult="proceedToInpatientResult" @discardAttachment="discardAttachment" @continueSaving="continueSaving" @confirmSaveChanges="confirmSaveChanges" @confirmSubmitData="confirmSubmitData" @saveData="saveData" @submitData="submitData" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Navbar from './../Navbar'
import Alert from '../Alert.vue'
import PatientData from './input-forms/PatientData'
import PatientConfinement from './input-forms/PatientConfinement'
import PhysicalExamination from './input-forms/PhysicalExamination'
import Maternity from './input-forms/Maternity'
import CourseInTheWard from './input-forms/CourseInTheWard'
import AccreditationSignature from './input-forms/AccreditationSignature'
import Certification from './input-forms/Certification'
import PostTransaction from './PostTransaction'

export default {
  components: {
    Navbar,
    Alert,
    PatientData,
    PatientConfinement,
    PhysicalExamination,
    Maternity,
    CourseInTheWard,
    AccreditationSignature,
    Certification,
    PostTransaction
  },

  data(){
    return{
      // FOR SMALLER SCREEN
      selected_category: this.$route.path,
      categories: [
        { name: 'PATIENT DATA', path: '/input-forms/patient-data' },
        { name: 'PATIENT CONFINEMENT', path: '/input-forms/patient-confinement' },
        { name: 'PHYSICAL EXAMINATION', path: '/input-forms/physical-examination' },
        { name: 'MATERNITY', path: '/input-forms/maternity' },
        { name: 'COURSE IN THE WARD', path: '/input-forms/course-in-the-ward' },
        { name: 'ACCREDITATION AND SIGNATURE', path: '/input-forms/accreditation-and-signature' },
        { name: 'CERTIFICATION', path: '/input-forms/certification' }
      ],

      // SCROLL BACK TO TOP
      back_to_top: false,
      number: 0,

      // COMMENTS
      loading_comment: false,
      comment_data: {
        ptd: {},
        pci: {},
        pex: {},
        mat: {},
        aas: {},
        ctf: {}
      },
      ptd_comment: 0,
      pci_comment: 0,
      pex_comment: 0,
      mat_comment: 0,
      ciw_comment: 0,
      aas_comment: 0,
      ctf_comment: 0,
    
      // OTHERS
      trans_detail: JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('QesRTe3j4fs3'), 'jri6F9dO').toString(this.$crypto.enc.Utf8)),
      change_status: sessionStorage.getItem('XCF3L') ? this.$crypto.AES.decrypt(sessionStorage.getItem('XCF3L'), 'xcmnXcV4').toString(this.$crypto.enc.Utf8) : '0',
      navigation_checker: '',
      required: false,
      leave_confirm: false,
      leave_path: '',
      for_action: '',
      screen_width: 0,
      navbar: [],
      alert: {},
    }
  },

  created(){
    if(this.trans_detail.crd_claims_status === 'Screening Rejected'){
      this.getCommentData();
      this.loading_comment = true
    }

    if(this.$store.state.usr_credentials.user_type === '2-3'){
      this.navbar =[
        { title: "Retrieve Member PIN", link: "/eclaims-retrieve-pin", icon: "fas fa-id-card" },
        { title: 'Claims Patient List', link: '../eclaims-patient-list', icon: 'fas fa-folder' }
      ]
    } else {
      this.navbar =[
        { title: 'Patient List', link: '../patient-list', icon: 'fas fa-folder' } 
      ]
    }

  },

  computed: {
    ...mapState([
      'loading_category',
      'prevent_navigation'
    ]),

    // BACK TO TOP
    target(){
      const value = this['number']
      if (!isNaN(value)) return Number(value)
      else return value
    },

    // BACK TO TOP
    options(){
      return {
        duration: 700,
        offset: 0,
        easing: 'easeInOutCubic'
      }
    }
  },

  methods: {
    // GET COMMENT DATA
    async getCommentData(){
      let response = await this.$services.getPhicAuditComments({
          phic_tracking_number: this.trans_detail.phic_tracking_number,
          transaction_number: this.trans_detail.transaction_number,
          request_type: 'provider'
      });

      if (response.status === 200){
        let comment = this.responseDataDecryption(response.data)

        this.comment_data = {
          ptd: {
            cf2_part1: comment.cf2_part1,
            cf2_part2_number1: comment.cf2_part2_number1
          },

          pci: {
            cf4_part2_number5: comment.cf4_part2_number5,
            cf2_part2_number9: comment.cf2_part2_number9,
            cf2_part2_number6: comment.cf2_part2_number6,
            cf2_part2_number7: comment.cf2_part2_number7,
            cf2_part2_number3: comment.cf2_part2_number3,
            cf4_part3: comment.cf4_part3,
            cf4_part3_number3: comment.cf4_part3_number3,
            cf2_part2_number2: comment.cf2_part2_number2,
            cf2_part2_number4: comment.cf2_part2_number4,
            cf2_part2_number5: comment.cf2_part2_number5,
            cf2_part2_number8: comment.cf2_part2_number8
          },

          pex: {
            cf4_part3_number5: comment.cf4_part3_number5,
            cf3_part1_number9: comment.cf3_part1_number9
          },

          mat: {
            cf3_part2_number1: comment.cf3_part2_number1,
            cf3_part2_number2: comment.cf3_part2_number2,
            cf3_part2_number3: comment.cf3_part2_number3,
            cf3_part2_number4: comment.cf3_part2_number4,
            cf3_part2_number6: comment.cf3_part2_number6,
            cf3_part2_number7: comment.cf3_part2_number7,
            cf3_part2_delivery_outcome: comment.cf3_part2_delivery_outcome,
            cf3_part2_postpartum_care: comment.cf3_part2_postpartum_care
          },

          ciw: {
            cf4_part4: comment.cf4_part4,
            cf4_part4_1: comment.cf4_part4_1,
            cf4_part5: comment.cf4_part5,
            cf4_part6: comment.cf4_part6
          },

          aas: {
            cf2_part2_number10: comment.cf2_part2_number10
          },

          ctf: {
            cf2_part3_lettera: comment.cf2_part3_lettera,
            cf2_part3_letterb: comment.cf2_part3_letterb,
            cf2_part4: comment.cf2_part4
          }
        }

        // PTD
        comment.cf2_part1 ? this.ptd_comment += 1 : null
        comment.cf2_part2_number1 ? this.ptd_comment += 1 : null

        // PCI
        comment.cf4_part2_number5 ? this.pci_comment += 1 : null
        comment.cf2_part2_number9 ? this.pci_comment += 1 : null
        comment.cf2_part2_number6 ? this.pci_comment += 1 : null
        comment.cf2_part2_number7 ? this.pci_comment += 1 : null
        comment.cf2_part2_number3 ? this.pci_comment += 1 : null
        comment.cf4_part3 ? this.pci_comment += 1 : null
        comment.cf4_part3_number3 ? this.pci_comment += 1 : null
        comment.cf2_part2_number2 ? this.pci_comment += 1 : null
        comment.cf2_part2_number4 ? this.pci_comment += 1 : null
        comment.cf2_part2_number5 ? this.pci_comment += 1 : null
        comment.cf2_part2_number8 ? this.pci_comment += 1 : null
        
        // PEX
        comment.cf4_part3_number5 ? this.pex_comment += 1 : null
        comment.cf3_part1_number9 ? this.pex_comment += 1 : null

        // MAT
        comment.cf3_part2_number1 ? this.mat_comment += 1 : null
        comment.cf3_part2_number2 ? this.mat_comment += 1 : null
        comment.cf3_part2_number3 ? this.mat_comment += 1 : null
        comment.cf3_part2_number4 ? this.mat_comment += 1 : null
        comment.cf3_part2_number6 ? this.mat_comment += 1 : null
        comment.cf3_part2_number7 ? this.mat_comment += 1 : null
        comment.cf3_part2_delivery_outcome ? this.mat_comment += 1 : null
        comment.cf3_part2_postpartum_care ? this.mat_comment += 1 : null

        // CIW
        comment.cf4_part4 ? this.ciw_comment += 1 : null
        comment.cf4_part4_1 ? this.ciw_comment += 1 : null
        comment.cf4_part5 ? this.ciw_comment += 1 : null
        comment.cf4_part6 ? this.ciw_comment += 1 : null
        
        // AAS
        comment.cf2_part2_number10 ? this.aas_comment += 1 : null

        // CERT
        comment.cf2_part3_lettera ? this.ctf_comment += 1 : null
        comment.cf2_part3_letterb ? this.ctf_comment += 1 : null
        comment.cf2_part4 ? this.ctf_comment += 1 : null
        comment.cf3_part2_number19 ? this.ctf_comment += 1 : null

        this.loading_comment = false
      } else{
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      
      }
      
    },

    // CHECK SAVE CHANGES
    checkSaveChanges(){
      if(this.navigation_checker.includes('empty')){
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Fields is Empty', body: 'Please fill out all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        this.required = true
      }else if (this.navigation_checker.includes("invalid_chief_history")) {
        this.alert = { display: true, type: "standard", width: "350", icon: "mdi-alert-circle", color: "red", title: "Invalid Input", body: "Chief Complaint and History of Illness cannot be empty, N/A, NONE, NA, or Not Applicable", btn_pry_txt: "OK", btn_pry_color: "primary", btn_pry_otl: false, btn_pry_act: "closeAlert"};
        this.required = true;
      }else if(this.navigation_checker.includes('unsaved_attachment')){
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Unsaved attachment will be discarded unless you click “Upload File”', body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'continueSaving', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
      }
      // else if(this.navigation_checker.includes('invalid_time')){
      //   this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Invalid Time Format', body: 'To proceed please make sure that it is a 12-hour format', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      // }
      else if(this.navigation_checker.includes('invalid_time_range')){
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Invalid Time', body: 'Time admitted should be earlier than time discharged', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }else if(this.navigation_checker.includes('exceed_total_charges')){
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Invalid Amount', body: 'Total actual charges exceeds the amount of the Procedures', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }else if(this.navigation_checker.includes('within_90_days')){
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'ICD is within 90 Days', body: 'To proceed please make sure that the Primary and Secondary ICD are within 90 days', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }else if(this.validateReceiptDataMedicine().status){
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: this.validateReceiptDataMedicine().title, body: this.validateReceiptDataMedicine().description, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }else{
        let philhealth_certification = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('kgdlDt'), 'vcoF535f').toString(this.$crypto.enc.Utf8))
        let current_icd_cpt = sessionStorage.getItem('LYK56D') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LYK56D'), 'XLgopi4x').toString(this.$crypto.enc.Utf8)) : []

        if(this.$store.state.usr_credentials.department === 'Nurse Station'){
          if(current_icd_cpt.status && this.trans_detail.hmo_host_code === 'FC'){
            if(current_icd_cpt.data.length === 0){
              this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'There is no DIAGNOSOS selected, LOA for this transaction will be void.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'confirmSaveChanges' }
            }else{
              this.alert = { display: true, type: 'standard', width: '700', icon: 'mdi-alert-circle', color: 'warning', title: 'ICD and CPT has been updated, the previous LOA will no longer be valid', body: 'This will redirect you in new LOA request', btn_pry_txt: 'PROCEED TO INPATIENT RESULT', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'proceedToInpatientResult', btn_sec_txt: 'VIEW CURRENT LOA', btn_sec_color: 'primary', btn_sec_otl: true, btn_sec_act: 'closeAlert', btn_sec_emt: 'viewCurrentLOA' }
            }
          }else{
            this.confirmSaveChanges();
          } 
        }else{
          if(philhealth_certification.total_cpt_amount < (parseFloat(philhealth_certification.co_hcf_total_actual_charges) + parseFloat(philhealth_certification.co_pf_total_actual_charges))){
            this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Total amount of Procedures and Total Actual Charges In the Certification is not equal', body: 'Please double-check the amount in the certification category', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          }else{
            if(current_icd_cpt.status && this.trans_detail.hmo_host_code === 'FC'){
              if(current_icd_cpt.data.length === 0){
                this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'There is no DIAGNOSOS selected, LOA for this transaction will be void.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'confirmSaveChanges' }
              }else{
                this.alert = { display: true, type: 'standard', width: '700', icon: 'mdi-alert-circle', color: 'warning', title: 'ICD and CPT has been updated, the previous LOA will no longer be valid', body: 'This will redirect you in new LOA request', btn_pry_txt: 'PROCEED TO INPATIENT RESULT', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'proceedToInpatientResult', btn_sec_txt: 'VIEW CURRENT LOA', btn_sec_color: 'primary', btn_sec_otl: true, btn_sec_act: 'closeAlert', btn_sec_emt: 'viewCurrentLOA' }
              }
            }else{
              this.confirmSaveChanges();
            }
          }
        }
      }
    },

    // CONFIRM SAVE CHANGES
    confirmSaveChanges(){
      this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-help-circle', color: 'primary', title: 'This will save all the changes you made', body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'saveData', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
    },

    // CHECK SUBMIT DATA
    checkSubmitData(){
      let alert_message = {
        title: '',
        body: ''
      }  
      
      let eclaims_require_fields = false

      if(this.$route.params.category === 'patient-confinement') {
        eclaims_require_fields = !this.$refs.save_data.pci_data.section4.is_referred || !this.$refs.save_data.pci_data.section5.status || !this.$refs.save_data.pci_data.section6
      }

      if(this.navigation_checker.includes('empty')){
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Fields is Empty', body: 'Please fill out all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        this.required = true
      }else if (this.navigation_checker.includes("invalid_chief_history")) {
        this.alert = { display: true, type: "standard", width: "350", icon: "mdi-alert-circle", color: "red", title: "Invalid Input", body: "Chief Complaint and History of Illness cannot be empty, N/A, NONE, NA, or Not Applicable", btn_pry_txt: "OK", btn_pry_color: "primary", btn_pry_otl: false, btn_pry_act: "closeAlert"};
        this.required = true;
      }else if(this.navigation_checker.includes('unsaved_attachment')){
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Unsaved attachment will be discarded unless you click “Upload File”', body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'continueSaving', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
      }
      // else if(this.navigation_checker.includes('invalid_time')){
      //   this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Invalid Time Format', body: 'To proceed please make sure that it is a 12-hour format', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      // }
      else if(this.navigation_checker.includes('invalid_time_range')){
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Invalid Time', body: 'Time admitted should be earlier than time discharged', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }else if(this.navigation_checker.includes('exceed_total_charges')){
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Invalid Amount', body: 'Total actual charges exceeds the amount of the Procedures', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }else if(this.navigation_checker.includes('within_90_days')){
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'ICD is within 90 Days', body: 'To proceed please make sure that the Primary and Secondary ICD are within 90 days', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }else if(this.validateReceiptDataMedicine().status){
        this.alert = { display: true, type: "standard", width: "500", icon: "mdi-alert-circle", color: "red", title: this.validateReceiptDataMedicine().title, body: this.validateReceiptDataMedicine().description, btn_pry_txt: "OK", btn_pry_color: "primary", btn_pry_otl: false, btn_pry_act: "closeAlert"};
      }else{
        let current_icd_cpt = sessionStorage.getItem('LYK56D') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LYK56D'), 'XLgopi4x').toString(this.$crypto.enc.Utf8)) : []

        if(this.$store.state.usr_credentials.department === 'Nurse Station' || this.$store.state.usr_credentials.department === 'Credit and Collection'){
          if(current_icd_cpt.status && this.trans_detail.hmo_host_code === 'FC'){
            if(current_icd_cpt.data.length === 0){
              this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'There is no DIAGNOSOS selected, LOA for this transaction will be void.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'confirmSubmitData' }
            }else{
              this.alert = { display: true, type: 'standard', width: '700', icon: 'mdi-alert-circle', color: 'warning', title: 'ICD and CPT has been updated, the previous LOA will no longer be valid', body: 'This will redirect you in new LOA request', btn_pry_txt: 'PROCEED TO INPATIENT RESULT', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'proceedToInpatientResult', btn_sec_txt: 'VIEW CURRENT LOA', btn_sec_color: 'primary', btn_sec_otl: true, btn_sec_act: 'closeAlert', btn_sec_emt: 'viewCurrentLOA' }   
            }
          } else{
            if(this.$route.params.category === 'patient-confinement') {
              if(this.trans_detail.phic_packages.includes('TB DOTS')) {
                this.required = true
                if(eclaims_require_fields || !this.$refs.save_data.pci_data.section11.d || !this.$refs.save_data.pci_data.section11.ntp_card_no) {
                  this.required = true
                  eclaims_require_fields = true
                } 
              }

              if(this.trans_detail.phic_packages.includes('ANIMAL BITES')) {

                if(eclaims_require_fields|| this.$refs.save_data.pci_data.section11.e.day_0_arv || this.$refs.save_data.pci_data.section11.e.day_3_arv || this.$refs.save_data.pci_data.section11.e.day_7_arv || this.$refs.save_data.pci_data.section11.e.day_rig_arv) {
                  this.required = true
                }

                if(eclaims_require_fields || this.$refs.save_data.pci_data.section11.e.day_others_arv) {
                  this.required = true
                  if(this.$refs.save_data.pci_data.section11.e.specify_others_arv === null) {
                    this.required = true
                  }
                } 

                eclaims_require_fields = true
              }

              if(this.trans_detail.phic_packages.includes('MATERNITY')) {
                this.required = true
                this.eclaims_require_fields = true
              }

              if(this.trans_detail.phic_packages.includes('HIV')) {
                this.required = true
                if(eclaims_require_fields || !this.$refs.save_data.pci_data.section11.g) {
                  this.required = true
                  eclaims_require_fields = true
                } 
              }
              alert_message = {
                title: 'Field is Empty',
                body: 'Please fill out all required fields'
              }
            }

            if (this.$route.params.category === 'certification') {
              let find_csf_form = this.$refs.save_data.cert_data.section3.filter(item => item.name.includes('CSF'))

              if(find_csf_form.length === 0){
                this.required = true
                eclaims_require_fields = true
                alert_message = {
                  title: 'Claim Form Signature',
                  body: 'Claim Form Signature is required! Please upload the documents before submitting to philhealth.'
                }
              } else {
                this.required = false
                eclaims_require_fields = false
              }
            }

            if (this.$route.params.category === 'course-in-the-ward') {
              let invalid_meds = this.$refs.save_data.ciw_data.section3.medicine.filter(med => {
                return !med.route || ['n/a', 'none', 'not applicable', 'na'].includes(med.route.trim().toLowerCase())
              })

              if (invalid_meds.length > 0) {
                this.required = true
                eclaims_require_fields = true
                alert_message = {
                  title: 'Field is Empty',
                  body: 'Please fill out all required fields in Course in the Ward before submitting.'
                }
              } else {
                this.required = false
                eclaims_require_fields = false
              }

              const procedures = this.$refs.save_data.ciw_data.section6 || []
              let invalid_procedures = procedures.filter(proc => {
                return !proc.type_of_diagnostic
              })

              if (invalid_procedures.length > 0) {
                this.required = true
                eclaims_require_fields = true
                alert_message = {
                  title: 'Field is Empty',
                  body: 'Please fill out all required fields in Course in the Ward before submitting.'
                }
              } else {
                this.required = false
                eclaims_require_fields = false
              }
            }

            if(this.required){
              this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: alert_message.title, body: alert_message.body, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }

            if(!eclaims_require_fields) {
              this.confirmSubmitData();
            }
          }
        }else{
          let philhealth_certification = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('kgdlDt'), 'vcoF535f').toString(this.$crypto.enc.Utf8))
          let is_signed = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('POI43'), 'FpXqep4t').toString(this.$crypto.enc.Utf8))

          if(philhealth_certification.phic_ben_is_enough){
            if(philhealth_certification.total_cpt_amount < (parseFloat(philhealth_certification.co_hcf_total_actual_charges) + parseFloat(philhealth_certification.co_pf_total_actual_charges))){
              this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Total amount of Procedures and Total Actual Charges In the Certification is not equal', body: 'Please double-check the amount in the certification category', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }else{
              if(is_signed.includes(0) || is_signed.includes('') || is_signed.includes(null)){
                this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'red', title: 'Signature is Empty', body: 'Please sign all the signatures', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
              }else{
                if(this.trans_detail.host_claim_type === 'FOR HMO CLAIMS'){
                  this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'This Transaction is for HMO Claims and cannot be submitted to Audit Sector', body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                }else{
                  if(current_icd_cpt.status && this.trans_detail.hmo_host_code === 'FC'){
                    if(current_icd_cpt.data.length === 0){
                      this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'There is no DIAGNOSOS selected, LOA for this transaction will be void.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'confirmSubmitData' }
                    }else{
                      this.alert = { display: true, type: 'standard', width: '700', icon: 'mdi-alert-circle', color: 'warning', title: 'ICD and CPT has been updated, the previous LOA will no longer be valid', body: 'This will redirect you in new LOA request', btn_pry_txt: 'PROCEED TO INPATIENT RESULT', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'proceedToInpatientResult', btn_sec_txt: 'VIEW CURRENT LOA', btn_sec_color: 'primary', btn_sec_otl: true, btn_sec_act: 'closeAlert', btn_sec_emt: 'viewCurrentLOA' }
                    }
                  }else{
                    this.confirmSubmitData();
                  }
                }
              }
            }
          }else{
            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'Philhealth Certification is Incomplete', body: 'Make sure to fill out all required fields before submitting to Audit Sector', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          }
        }
      }
    },

    // CONFIRM SUBMIT DATA 
    confirmSubmitData(){
      if(this.$store.state.usr_credentials.department === 'Nurse Station' ){
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-help-circle', color: 'primary', title: 'Forms will be submitted to Credit and Collection', body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'submitData', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
      } else if(this.$store.state.usr_credentials.department === 'Credit and Collection') {
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-help-circle', color: 'primary', title: 'Forms will be submitted to PHIC', body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'submitData', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
      } else{
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-help-circle', color: 'primary', title: 'Forms will be submitted to Audit Sector', body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'submitData', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
      }
    },
    
    // DISPLAY SAVE BUTTON IF STATUS = 1
    changeStatus(){
      if(this.trans_detail.editable){
        if(this.change_status === '0'){
          this.change_status = '1'
          sessionStorage.setItem('XCF3L', this.$crypto.AES.encrypt(JSON.stringify(1), 'xcmnXcV4'))
        }
      }
    },

    // DISPLAY BACK-TO-TOP BUTTON
    getHeightOnScroll(){
      var height = document.documentElement.scrollTop;
      // BACK TO TOP
      if(height > 300){
        this.back_to_top = true
      }else{
        this.back_to_top = false
      }
    },

    // ON SCREEN RESIZE
    onScreenResize(){
      this.window_size = { 
        x: window.innerWidth, 
        y: window.innerHeight 
      }

      this.screen_width = this.window_size.x
    },

    // OPEN THE CURRENT LOA IN NEW TAB
    viewCurrentLOA(){
      let ip_params = {
        eligibility_request_id: this.trans_detail.eligibility_request_id,
        phic_tracking_number: this.trans_detail.phic_tracking_number,
        transaction_number: this.trans_detail.transaction_number,
        hmo_host_code: this.trans_detail.hmo_host_code,
        policy_no: this.trans_detail.hmo_policy_number,
        approval_code: '',
        process_type: 'PHIC_LGU',
        from: 'input-forms'
      }

      sessionStorage.setItem('JM9SO0Y1YV', this.$crypto.AES.encrypt(JSON.stringify(ip_params), 'AKyd1f2zXx'))
      sessionStorage.setItem('ROTSR', this.$crypto.AES.encrypt(JSON.stringify(this.trans_detail.phic_member_eligibility_status), 'lFdt04sg'))

      let new_tab = this.$router.resolve({name: 'PrintInpatient'});
      window.open(new_tab.href, '_blank');
    },

    // PROCEED TO INPATIENT RESULT
    proceedToInpatientResult(){
      this.$refs.save_data.saveData();
      this.change_status = '0'
      this.for_action = 'ip_result'
      setTimeout(() => {
        this.$refs.post_transaction.postRelationToMember();
      }, 1000)
    },

    // DISCARD UNSAVED ATTACHMENT
    discardAttachment(){
      this.navigation_checker = this.navigation_checker.filter(item => item !== 'unsaved_attachment')
      this.alert = {}
      this.$router.push(this.leave_path)
    },

    // CONTINUE SAVING EVEN IF THE ATTACHMENT IS UNSAVED
    continueSaving(){
      this.navigation_checker = this.navigation_checker.filter(item => item !== 'unsaved_attachment')
      this.checkSaveChanges();
    },

    // SUBMIT DATA
    submitData(){
      this.$refs.save_data.saveData();
      this.for_action = 'submit'
      setTimeout(() => {
        this.$refs.post_transaction.postSubmitToPHIC('submit_to_credit_and_collection');
      }, 1000)
    },

    // SAVE DATA
    saveData(){
      this.$refs.save_data.saveData();
      this.for_action = 'save'
      setTimeout(() => {
        this.$refs.post_transaction.postSubmitToPHIC('save_changes');
      }, 1000)
    },

    // LEAVE PAGE
    leavePage(){
      this.leave_confirm = true
      this.$router.push(this.leave_path)
    },
    //RECEIPT DATA EMPTY VALIDATION
    validateReceiptDataMedicine() {
      let status      = false
      let title       = ''
      let description = ''

      if(this.$store.state.usr_credentials.department === 'Credit and Collection'){
        if (this.$refs.save_data.receipt_data) {
          let receipt_data_medicine = this.$refs.save_data.receipt_data
          const no_data = Object.values(receipt_data_medicine).some( value => value === null || value === "");
          if (no_data) {
            status = true
            title  = 'Field is empty'
            description = 'Please fill out all required fields in Receipt Data'
          }
        } else{
            status = true
            title = 'Incomplete Review'
            description = 'All tabs must be reviewed before saving. Please visit each tab' 
        }
      }
      
      return { status, title, description }
    }
  },

  beforeRouteUpdate(to, from, next){
    if(to.params.category === 'patient-data' || to.params.category === 'patient-confinement' || to.params.category === 'physical-examination' || (this.trans_detail.gender === 'MALE' || this.trans_detail.gender === 'M' ? false : to.params.category === 'maternity') || to.params.category === 'course-in-the-ward' || to.params.category === 'accreditation-and-signature' || to.params.category === 'certification'){
      if(!this.loading_category && this.prevent_navigation){
        if(this.navigation_checker.includes('empty')){
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Fields is Empty', body: 'Please fill out all required fields', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          this.required = true
          next(false)
        }else if (this.navigation_checker.includes("invalid_chief_history")) {
          this.alert = { display: true, type: "standard", width: "350", icon: "mdi-alert-circle", color: "red", title: "Invalid Input", body: "Chief Complaint and History of Illness cannot be empty, N/A, NONE, NA, or Not Applicable", btn_pry_txt: "OK", btn_pry_color: "primary", btn_pry_otl: false, btn_pry_act: "closeAlert"};
          this.required = true;
        }else if(this.navigation_checker.includes('unsaved_attachment')){
          this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Unsaved attachment will be discarded unless you click “Upload File”', body: 'Are you sure you want to leave this page?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'discardAttachment', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
          this.leave_path = to.path
          next(false)
        }
        // else if(this.navigation_checker.includes('invalid_time')){
        //   this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Invalid Time Format', body: 'To proceed please make sure that it is a 12-hour format', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        //   this.leave_path = to.path
        //   next(false)
        // }
        else if(this.navigation_checker.includes('invalid_time_range')){
          this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Invalid Time', body: 'Time admitted should be earlier than time discharged', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          this.leave_path = to.path
          next(false)
        }else if(this.navigation_checker.includes('exceed_total_charges')){
          this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Invalid Amount', body: 'Total actual charges exceeds the amount of the Procedures', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          this.leave_path = to.path
          next(false)
        }else if(this.navigation_checker.includes('within_90_days')){
          this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'ICD is within 90 Days', body: 'To proceed please make sure that the Primary and Secondary ICD are within 90 days', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          this.leave_path = to.path
          next(false)
        }else if(from.params.category === 'certification' && this.validateReceiptDataMedicine().status){
          this.alert = { display: true, type: "standard", width: "350", icon: "mdi-alert-circle", color: "red", title: this.validateReceiptDataMedicine().title, body: this.validateReceiptDataMedicine().description, btn_pry_txt: "OK", btn_pry_color: "primary", btn_pry_otl: false, btn_pry_act: "closeAlert"};
          this.required = true;
        }else{
          if(this.$store.state.usr_credentials.department === 'Nurse Station'){
            if(to.params.category === 'certification'){
              //next(false)
              next(true)
            }else{
              this.$store.commit('set_loading_category', true)
              next()
            }
          }else{
            this.$store.commit('set_loading_category', true)
            next()
          }
          this.required = false
        }

        this.selected_category = this.$route.path
      }else{
        next(false)
      }
    }else{
      next(false)
    }
  },

  // beforeRouteLeave(to, from, next){
  //   if(sessionStorage.getItem('QesRTe3j4fs3')){
  //     if(this.leave_confirm){
  //       next()
  //     }else{
  //       if(this.change_status === '0'){
  //         next()
  //       }else{
  //         this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-help-circle', color: 'primary', title: 'Data you have entered will not be saved', body: 'Are you sure you want to leave?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'leavePage', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
  //         this.leave_path = to.path
  //       }
  //     }
  //   }else{
  //     next()
  //   }
  // }
}
</script>

<style scoped>
.sticky{
  position: fixed;
  text-align: center;
  width: 100%;
  z-index: 1;
}

/* ACTION BUTTON */
.btn-group{
  position: absolute; 
  right: 10px;
  top: 97px; 
}
.btn-hover:hover{
  cursor: pointer;
  background: #f7f7f7;
}

/* TABS */
.active-tab{
  color: #0277BD !important;
  background: #FAFAFA;
}
.active-tab:hover{
  color: white !important;
  background: #0277BD;
}
.hover-tab:hover{
  background: #0277BD;
}

/* SCROLL TO TOP */
.scroll-to-top{
  bottom: 4px;
  margin-bottom: 80px;
  margin-right: 50px;
  position: fixed;
  right: 0;
}

/* INPUT FORMS */
.category-group{
  padding: 115px 25px 25px;
  margin: 0 0 30px 60px;
}
::v-deep .section-title{
  color: #454545;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.009375em;
  margin-left: -0.009375em;
}
::v-deep .section-label{
  font-size: 0.875em;
  font-weight: 400;
  letter-spacing: 0.0178571429em;
  margin-left: -0.0178571429em;
}
::v-deep .progress-loader{
  height: 100vh;
}
::v-deep .hover{
  cursor: pointer;
}
::v-deep .required{
  color: red;
}
::v-deep .transform-text{
  text-transform: capitalize
}
::v-deep .block-label{
  display: block;
}
::v-deep .opacity{
  opacity: 0.6;
}

/* ATTACHMENT */
::v-deep .file-attachment{
  background: #e3e2dc;
  border: 1px solid grey;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 7px;
}
::v-deep .file-attachment:active{
  background: #dbdad3;
}
::v-deep .remove-attachment{
  cursor: pointer;
  float: right; 
  padding-right: 5px; 
}

/* MEDIA QUERY */
@media only screen and (max-width: 960px) {
  .scroll-to-top{
    bottom: -50px;
    right: -26px;
  }
  .category-group{
    margin: 0 0 30px 0;
  }
}
</style>