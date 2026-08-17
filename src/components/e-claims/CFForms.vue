<template>
  <v-container id="view-forms" fluid>
    <Navbar :navbar="navbar" id="navbar" />

    <v-row class="sticky" id="menubar" wrap>
      <div class="col-lg-1 col-sm-1 col-1"></div>
      <div v-if="$vuetify.breakpoint.mdAndUp" class="col-lg-10 col-sm-10 pb-0">
        <v-toolbar color="light-blue darken-2" dark>
          <v-btn v-if="trans_detail.phic_member_eligibility_status === 'Eligible'" @click="$route.path !== '/cf-forms/pbef' ? $router.push('/cf-forms/pbef') : $route.path" v-on:click="$vuetify.goTo('#view-forms')" :class="{'active-class' : $route.params.configuration === 'pbef'}" :disabled="save_loader" small text dark>PBEF</v-btn>
          <v-tooltip v-else color="red" bottom>
            <template #activator="{ on }">
              <v-btn v-on="on" class="grey--text text--lighten-1" small text>PBEF</v-btn>
            </template>
            PBEF is currently unavailable. Patient has {{ trans_detail.phic_member_eligibility_status }}
          </v-tooltip>

          <v-btn @click="$route.path !== '/cf-forms/csm' ? $router.push('/cf-forms/csm') : $route.path" v-on:click="$vuetify.goTo('#view-forms')" text dark  :disabled="save_loader" :class="{'active-class' : $route.params.configuration === 'csm'}"  small>CSM  </v-btn>
          <!-- <v-btn @click="$route.path !== '/cf-forms/csf' ? $router.push('/cf-forms/csf') : $route.path" v-on:click="$vuetify.goTo('#view-forms')" text dark  :disabled="save_loader" :class="{'active-class' : $route.params.configuration === 'csf'}"  small>CSF  </v-btn>
          <v-btn @click="$route.path !== '/cf-forms/cf1' ? $router.push('/cf-forms/cf1') : $route.path" v-on:click="$vuetify.goTo('#view-forms')" text dark  :disabled="save_loader" :class="{'active-class' : $route.params.configuration === 'cf1'}"  small>CF1  </v-btn>
          <v-btn @click="$route.path !== '/cf-forms/cf2' ? $router.push('/cf-forms/cf2') : $route.path" v-on:click="$vuetify.goTo('#view-forms')" text dark  :disabled="save_loader" :class="{'active-class' : $route.params.configuration === 'cf2'}"  small>CF2  </v-btn>
          <v-btn @click="$route.path !== '/cf-forms/cf3' ? $router.push('/cf-forms/cf3') : $route.path" v-on:click="$vuetify.goTo('#view-forms')" text dark  :disabled="save_loader" :class="{'active-class' : $route.params.configuration === 'cf3'}"  small >CF3  </v-btn>
          <v-btn @click="$route.path !== '/cf-forms/cf4' ? $router.push('/cf-forms/cf4') : $route.path" v-on:click="$vuetify.goTo('#view-forms')" text dark  :disabled="save_loader" :class="{'active-class' : $route.params.configuration === 'cf4'}"  small>CF4 </v-btn>
          <v-btn @click="$route.path !== '/cf-forms/cf5' ? $router.push('/cf-forms/cf5') : $route.path" v-on:click="$vuetify.goTo('#view-forms')" text dark  :disabled="save_loader" :class="{'active-class' : $route.params.configuration === 'cf5'}"  small>CF5 </v-btn> -->
          <v-btn @click="$route.path !== '/cf-forms/receipt-data' ? $router.push('/cf-forms/receipt-data') : $route.path" v-on:click="$vuetify.goTo('#view-forms')" text dark  :disabled="save_loader" :class="{'active-class' : $route.params.configuration === 'receipt-data'}"  small >RECEIPT DATA</v-btn>
          <v-btn @click="$route.path !== '/cf-forms/esoa' ? $router.push('/cf-forms/esoa') : $route.path" v-on:click="$vuetify.goTo('#view-forms')" text dark  :disabled="save_loader" :class="{'active-class' : $route.params.configuration === 'esoa'}"  small>eSOA </v-btn>
          <v-btn @click="$route.path !== '/cf-forms/xml-viewer' ? $router.push('/cf-forms/xml-viewer') : $route.path" v-on:click="$vuetify.goTo('#view-forms')" text dark  :disabled="save_loader" :class="{'active-class' : $route.params.configuration === 'xml-viewer'}"  small>XML VIEWER </v-btn>
          <v-menu offset-y right z-index="3">
            <template v-slot:activator="{ on }">
              <v-btn small text v-on="on" :disabled="save_loader">CF Forms
                <v-icon small right>fas fa-caret-down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item-group>
                <v-list-item @click="$route.path !== '/cf-forms/csf' ? $router.push('/cf-forms/csf') : $route.path">
                  <v-list-item-title>CSF</v-list-item-title>
                </v-list-item>

                <v-list-item @click="$route.path !== '/cf-forms/cf1' ? $router.push('/cf-forms/cf1') : $route.path">
                  <v-list-item-title>CF1</v-list-item-title>
                </v-list-item>

                <v-list-item @click="$route.path !== '/cf-forms/cf2' ? $router.push('/cf-forms/cf2') : $route.path">
                  <v-list-item-title>CF2</v-list-item-title>
                </v-list-item>

                <v-list-item @click="$route.path !== '/cf-forms/cf3' ? $router.push('/cf-forms/cf3') : $route.path">
                  <v-list-item-title>CF3</v-list-item-title>
                </v-list-item>

                <v-list-item @click="$route.path !== '/cf-forms/cf4' ? $router.push('/cf-forms/cf4') : $route.path">
                  <v-list-item-title>CF4</v-list-item-title>
                </v-list-item>

                <v-list-item @click="$route.path !== '/cf-forms/cf5' ? $router.push('/cf-forms/cf5') : $route.path">
                  <v-list-item-title>CF5</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
          
          <v-menu offset-y right  z-index="3">
            <template v-slot:activator="{ on }">
              <v-btn small text v-on="on" :disabled="save_loader" >Attachments<v-icon small right>fas fa-caret-down</v-icon></v-btn>
            </template>
            <v-list>
              <v-list-item-group>
                <v-list-item :disabled="surgical.length === 0">
                  <v-list-item-title @click="$route.path !== '/cf-forms/attachment?type=Surgical Procedure' ? $router.push('/cf-forms/attachment?type=Surgical Procedure') : $route.path, selected_attachment = 'Surgical Procedure'" >Surgical Procedure</v-list-item-title>
                </v-list-item>
                <v-list-item :disabled="medicine.length === 0">
                  <v-list-item-title @click="$route.path !== '/cf-forms/attachment?type=Drugs and Medicine' ? $router.push('/cf-forms/attachment?type=Drugs and Medicine') : $route.path, selected_attachment = 'Drugs and Medicine'">Drugs and Medicine</v-list-item-title>
                </v-list-item>
                <v-list-item :disabled="pertinent.length === 0">
                  <v-list-item-title @click="$route.path !== '/cf-forms/attachment?type=Pertinent Laboratory' ? $router.push('/cf-forms/attachment?type=Pertinent Laboratory') : $route.path, selected_attachment = 'Pertinent Laboratory'">Pertinent Laboratory</v-list-item-title>
                </v-list-item>
                <v-list-item :disabled="additional.length === 0">
                  <v-list-item-title @click="$route.path !== '/cf-forms/attachment?type=Additional Attachments' ? $router.push('/cf-forms/attachment?type=Additional Attachments') : $route.path, selected_attachment = 'Additional Attachments'">Additional Attachments</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>
          <v-btn :disabled="save_loader" @click="$router.push('/input-forms/patient-data')" small text dark><v-icon small left>mdi-file-document</v-icon>INPUT FORMS</v-btn>
          <v-btn :disabled="data_loader || $route.path === '/cf-forms/attachment' || $route.path === '/cf-forms/pbef'" @click="save" small text dark><v-icon small left>fas fa-file-pdf</v-icon>SAVE</v-btn>
          <v-btn :disabled="data_loader || $route.path === '/cf-forms/attachment' || save_loader || $route.path === '/cf-forms/pbef'" @click="print" small text dark><v-icon small left>fas fa-print</v-icon>PRINT</v-btn>
        </v-toolbar>
      </div>

      <div v-else class="col-lg-10 col-sm-10 col-12 pb-0 px-4 px-sm-3">
        <v-select v-model="selected_forms" :items="form_items" item-text="path" background-color="light-blue darken-2" menu-props="bottom, offsetY" ref="forms" hide-details filled dark>
          <template v-slot:prepend-inner>
            <v-icon size="20">mdi-shape-outline</v-icon>
          </template>
          <template v-slot:selection="{ item }">{{ item.name }}</template>
          <template v-slot:prepend-item>
            <h4 class="font-weight-medium grey--text text--darken-1 pl-2 pt-1">Forms</h4>
          </template>
          <template v-slot:item="{ item }">
            <v-list-item :to="item.path" @click="selected_forms = item.path" v-on:click="$refs.forms.blur">{{ item.name }}</v-list-item>
          </template>
          <template v-slot:append-item>
            <v-divider></v-divider>
            <h4 class="font-weight-medium grey--text text--darken-1 pl-2 pt-1">Action</h4>
            <v-list-item :disabled="save_loader" @click="$router.push('/input-forms/patient-data')">INPUT FORMS</v-list-item>
            <v-list-item :disabled="data_loader || $route.path === '/cf-forms/attachment' || $route.path === '/cf-forms/csf'" @click="save">SAVE AS PDF</v-list-item>
            <v-list-item :disabled="data_loader || $route.path === '/cf-forms/attachment' || save_loader || $route.path === '/cf-forms/csf'" @click="print">PRINT</v-list-item>
          </template>
        </v-select>
      </div>
    </v-row>

    <v-row wrap justify="center" class="px-4 mb-5" id="content"> <!-- HEADERS -->
      <v-col cols="12" sm="10" md="10" lg="10" xl="10" class="elevation-3 frm-overflow" id="content-box">
        <v-row v-if="data_loader === true" wrap align="center" justify="center" class="pa-5">
          <v-progress-circular v-if="data_loader === true && catchError === false"  color="primary" indeterminate ></v-progress-circular>
          <span v-if="data_loader === true && catchError === false" class="subtitle-1 grey--text text--darken-2 mx-3">Loading Forms.... Please Wait</span>
          <span v-else class="subtitle-1 grey--text text--darken-2 mx-3">Failed to load the data. Please refresh your browser</span>
        </v-row>
        <template v-else>
          <PBEF v-if="$route.params.configuration === 'pbef' && eligibility_status == 'Eligible'"  :pbef_data="$store.state.pbef_data" :eligibility_status="eligibility_status"  class="frm-width m-auto untouchable" id="pbef"/>              
          <CSM v-if="$route.params.configuration === 'csm' && eligibility_status == 'Eligible'" class="frm-width m-auto untouchable" id="csm" />
          <CSF v-if="$route.params.configuration === 'csf' && eligibility_status == 'Eligible'" :csf_data_p1="csf_data_p1" :csf_data_p2="csf_data_p2" class="frm-width m-auto untouchable" id="csf" ref="for_csf"/>
          <!-- <Cf1Page1 v-if="$route.params.configuration === 'cf1'" :cf1_data_p1="cf1_data_p1" :cf1_data_p2="cf1_data_p2" class="frm-width  untouchable" id="cf1_page1" /> -->
          <CF1 v-if="$route.params.configuration === 'cf1'" :cf1_data_p1="cf1_data_p1" :cf1_data_p2="cf1_data_p2" class="frm-width  untouchable" id="cf1_page1" ref="for_cf1"/>
          <CF2 v-if="$route.params.configuration === 'cf2'" :cforms_data="cforms_data" :cf2_data_p1="cf2_data_p1" :cf2_data_p2="cf2_data_p2" class="frm-width untouchable" id="cf2_page2" ref="for_cf2"/>
          <CF3 v-if="$route.params.configuration === 'cf3'" :cforms_data="cforms_data" :cf2_data_p1="cf2_data_p1" :cf2_data_p2="cf2_data_p2" class="frm-width untouchable" id="cf3_page1" ref="for_cf3"/>
          <!-- <Cf2Page1 v-if="$route.params.configuration === 'cf2'" :cf2_data_p1="cf2_data_p1" class="frm-width  untouchable" id="cf2_page1"/>
          <Cf2Page2 v-if="$route.params.configuration === 'cf2'" :cf2_data_p2="cf2_data_p2" class="frm-width untouchable" id="cf2_page2"/> -->

          <!-- <Cf3Page1 v-if="$route.params.configuration === 'cf3'" :cf3_data_p1="cf3_data_p1" class="frm-width  untouchable" id="cf3_page1"/>
          <Cf3Page2 v-if="$route.params.configuration === 'cf3'" :cf3_data_p2="cf3_data_p2" :cf3_data_p1="cf3_data_p1"  class="frm-width untouchable" id="cf3_page2"/> -->
          
          <CF4 v-if="$route.params.configuration === 'cf4'" :cforms_data="cforms_data" :cf4_data_p1="cf4_data_p1" class="frm-width  untouchable" id="cf4_page1" ref="for_cf4"/>
          <CF5 v-if="$route.params.configuration === 'cf5'" :cforms_data="cforms_data" :cf5_data_p1="cf5_data_p1" class="frm-width untouchable" id="cf4_page2" ref="for_cf5"/>
          <ReceiptData v-if="$route.params.configuration === 'receipt-data'" class="frm-width untouchable" :receipt_data="receipt_data" id="receipt_data"/> 
          <ESOA v-if="$route.params.configuration === 'esoa'" :esoa_data="esoa_data" :esoa_data2="esoa_data2" :admitted_datetime="admitted_datetime" :discharged_datetime="discharged_datetime" class="frm-width untouchable" id="esoa"/> 
          <XMLViewer v-if="$route.params.configuration === 'xml-viewer'" :view_xml_forms="view_xml_forms" class="frm-width untouchable" id="xml-viewer" />
          <Attachment v-if="$route.params.configuration === 'attachment'" :selected_attachment="selected_attachment" :surgical="surgical" :medicine="medicine" :pertinent="pertinent" :additional="additional" class="frm-width mx-auto" />
        </template>
      </v-col>  
    </v-row>
    <span id="bottom"></span>
  </v-container>
</template>

<script>
import Navbar from './../Navbar.vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import PBEF from './cf-forms/PBEF.vue'
import CSM from './cf-forms/CSM.vue'
import CSF from './cf-forms/CSF.vue'
import CF1 from './cf-forms/CF1.vue'
//import Cf1Page1 from './cf-forms/Cf1_page1.vue'
// import Cf2Page1 from './cf-forms/Cf2_page1.vue'
// import Cf2Page2 from './cf-forms/Cf2_page2.vue'
// import Cf3Page1 from './cf-forms/Cf3_page1.vue'
// import Cf3Page2 from './cf-forms/Cf3_page2.vue'
import CF4 from './cf-forms/CF4.vue'
import CF5 from './cf-forms/CF5.vue'
import ESOA from './cf-forms/ESOA.vue'
import Attachment from './cf-forms/Attachment'
import CF2 from './cf-forms/CF2.vue'
import CF3 from './cf-forms/CF3.vue'
import ReceiptData from './cf-forms/ReceiptData.vue'
import XMLViewer from './cf-forms/XmlViewer.vue'

export default {
  name: "view-forms",
  components: {
    Navbar,
    PBEF,
    CSM,
    CSF,
    CF1,
    CF4,
    CF5,
    //Cf1Page1,
    // Cf2Page1,
    // Cf2Page2,
    // Cf3Page1,
    // Cf3Page2,
    // Cf4Page1,
    // Cf4Page2,
    ESOA,
    Attachment,
    CF2,
    CF3,
    ReceiptData,
    XMLViewer
  },
  data(){
    return{
    trans_detail: JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('QesRTe3j4fs3'), 'jri6F9dO').toString(this.$crypto.enc.Utf8)),
    navbar_float: false,

    // FOR SMALLER SCREEN
    selected_forms: this.$route.path,
    form_items: [
      { name: 'PBEF', path: '/cf-forms/pbef' },
      { name: 'CSM', path: '/cf-forms/csm' },
      { name: 'CSF', path: '/cf-forms/csf' },
      { name: 'CLAIM FORM 1', path: '/cf-forms/cf1' },
      { name: 'CLAIM FORM 2', path: '/cf-forms/cf2' },
      { name: 'CLAIM FORM 3', path: '/cf-forms/cf3' },
      { name: 'CLAIM FORM 4', path: '/cf-forms/cf4' },
      { name: 'CLAIM FORM 5', path: '/cf-forms/cf5' },
      { name: 'eSOA', path: '/cf-forms/esoa' },
      { name: 'XML Viewer', path: '/cf-forms/xml-viewer' }
    ],

    //LOADER
    data_loader: true,
    save_loader: false,

    //SESSION DATA
    form_status:sessionStorage.getItem('form_status'),
    claim_status:sessionStorage.getItem('claim_status'),
    approval:sessionStorage.getItem('approval'),
    
    //FORM DATA
    pbef_err_catch:false,
    cf1_data_p1 : [],
    cf1_data_p2: [],
    cf1_err_catch:false,
    cf2_data_p1 : [],
    cf2_data_p2 : [],
    cf2_err_catch:false,
    cf3_data_p1 : [],
    cf3_data_p2 : [],
    cf3_err_catch:false,
    cf4_data_p1:[],
    cf4_data_p2:[],
    cf4_err_catch:false,
    cf5_data_p1: [],
    cf5_err_catch: false,
    csf_data_p1: [],
    csf_data_p2: [],
    esoa_data:[],
    esoa_data2: [],
    selected_attachment:'',
    total_attachment:[],
    surgical:[],
    medicine:[],
    pertinent:[],
    additional:[],
    view_xml_forms:[],

    cforms_data: [],

    receipt_data:[],

     //CF4 PERTINENT SIGNS AND SYMPTOMS
        pertinent_symptoms:[
            {title:'Altered mental sensorium'},
            {title:'Diarrhea'},
            {title:'Hematemesis'},
            {title:'Palpitations'},
            {title:'Abdominal cramp/pain'},
            {title:'Dizziness'},
            {title:'Hematuria'},
            {title:'Seizures'},
            {title:'Anorexia'},
            {title:'Dysphagia'},
            {title:'Hemoptysis'},
            {title:'Skin rashes'},
            {title:'Bleeding gums'},
            {title:'Dyspnea'},
            {title:'Irritability'},
            {title:'Stool, bloody/black tarry/mucoid'},
            {title:'Body weakness'},
            {title:'Dysuria'},
            {title:'Jaundice'},
            {title:'Sweating'},
            {title:'Blurring of vision'},
            {title:'Epistaxis'},
            {title:'Lower extremity edema'},
            {title:'Urgency'},
            {title:'Chest pain/discomfort'},
            {title:'Fever'},
            {title:'Myalgia'},
            {title:'Vomiting'},
            {title:'Constipation'},
            {title:'Frequency of urination'},
            {title:'Orthopnea'},
            {title:'Weight loss'},
            {title:'Cough'},
            {title:'Headache'},
            {title:'Pain'},
            {title:'Others'},
        ],
        heent:[
            {title:'Essentially normal'},
            {title:'Abnormal pupillary reaction'},
            {title:'Cervical lymphadenopathy'},
            {title:'Dry mucous membrane'},
            {title:'Icteric sclerae'},
            {title:'Pale conjunctivae'},
            {title:'Sunken eyeballs'},
            {title:'Sunken fontanelle'},
        ],
        chest:[
            {title:'Essentially normal'},
            {title:'Asymmetrical chest expansion'},
            {title:'Decreased breath sounds'},
            {title:'Wheezes'},
            {title:'Lump/s over breast(s)'},
            {title:'Rales/crackles/rhonchi'},
            {title:'Intercostal rib/clavicular retraction'},
        ], 
        cvs:[
            {title:'Essentially normal'},
            {title:'Displaced apex beat'},
            {title:'Heaves and/or thrills'},
            {title:'Pericardial bulge'},
            {title:'Irregular rhythm'},
            {title:'Muffled heart sounds'},
            {title:'Murmur'},
        ], 
        abdomen:[
            {title:'Essentially normal'},
            {title:'Abdominal rigidity'},
            {title:'Abdomen tenderness'},
            {title:'Hyperactive bowel sounds'},
            {title:'Palpable mass(es)'},
            {title:'Tympanitic/dull abdomen'},
            {title:'Uterine contraction'},
        ],
        gu_ie:[
            {title:'Essentially normal'},
            {title:'Blood stained in exam finger'},
            {title:'Cervical dilatation'},
            {title:'Presence of abnormal discharge'},
        ],
        skin_extremities:[
            {title:'Essentially normal'},
            {title:'Clubbing'},
            {title:'Cold clammy skin'},
            {title:'Cyanosis/mottled skin'},
            {title:'Edema/swelling'},
            {title:'Decreased mobility'},
            {title:'Pale nailbeds'},
            {title:'Poor skin turgor'},
            {title:'Rashes/petechiae'},
            {title:'Weak pulses'},
        ],
        neuro_exam:[
            {title:'Essentially normal'},
            {title:'Abnormal gait'},
            {title:'Abnormal position sense'},
            {title:'Abnormal/decreased sensation'},
            {title:'Abnormal reflex(es)'},
            {title:'Poor/altered memory'},
            {title:'Poor muscle tone/strength'},
            {title:'Poor coordination'},
        ],

      // NAVBAR
      navbar: [
        { title: 'Patient List', link: '/patient-list', icon: 'fas fa-folder' },
      ],
    
      check_signature:true,
      // pdf_url: require('../../assets/pdf/claim_form/ClaimSignatureForm_2018.pdf'),
    }
  },
  created(){
    this.getPBEFData();
  },

  computed: {
    catchError(){
      if(this.pbef_err_catch === true || this.cf1_err_catch == true || this.cf2_err_catch == true || this.cf3_err_catch == true || this.cf4_err_catch == true){
        return true
      }else{
        return false
      }
    },
    eligibility_status(){
        return this.trans_detail.phic_member_eligibility_status
    } 
  },

  methods:{
    signLoader(value){
      if(value.every(e => e === true)){
        this.check_signature = false  //enabled btn
      }else{
        this.check_signature = true //disabled btn
      }
    },

    // FORMS DATA RELATED
    // async getPBEFData() {
    //   if (this.eligibility_status === 'Eligible') {
    //     const response = await this.$store.dispatch('getPbefData', {
    //       data: {
    //         accreno: this.$store.state.prv_data.phic_acc_no,
    //         referenceno: this.trans_detail.pbef_reference_no
    //       }
    //     });

    //     if (response.url) {
    //       window.open(response.url, '_blank');
    //     } 
    //     this.getCformsData();
    //   } else {
    //     this.getCformsData();
    //   }
    // },
    async getPBEFData(){
      if(this.eligibility_status === 'Eligible'){
        await this.$store.dispatch('getPbefData', {
          // tracking_num_p: this.trans_detail.phic_tracking_number,
          // transaction_num_p: this.trans_detail.transaction_number,
          // ek_lgu_id: this.trans_detail.ek_lgu_id,
          data: {
            // reference_no: this.trans_detail.pbef_reference_no,
            // accre_no: this.$store.state.prv_data.phic_acc_no
            accreno: this.$store.state.prv_data.eclaim_phic_acc_no,
            referenceno: this.trans_detail.pbef_reference_no
          }
        })
        
        this.getCformsData();
      }else{
        this.getCformsData();
      }
    },

    async getCformsData(){
      let response = await this.$services.getEclaims({
        request_key: 'all',
        provider_code: this.$store.state.prv_data.provider_code,
        ek_lgu_id: this.trans_detail.ek_lgu_id,
        transaction_number: this.trans_detail.transaction_number,
        migrated_to_eclaim_table: this.trans_detail.migrated_to_eclaim_table,
        claim_no: this.trans_detail.claim_no
      })

      if(response.status === 200){
        response.data = this.responseDataDecryption(response.data)
        response.data.patient_confinement.PATIENT_DATA.originating_provider_address = this.getAddress( response.data.patient_confinement.PATIENT_DATA.originating_provider_address,'0')
        response.data.patient_confinement.PATIENT_DATA.referral_prov_address = this.getAddress( response.data.patient_confinement.PATIENT_DATA.referral_prov_address,'0')
        
        this.admitted_datetime = response.data.patient_data.TRANSACTION.date_admitted + '/' + response.data.patient_data.TRANSACTION.time_admitted 
        this.discharged_datetime = response.data.patient_data.TRANSACTION.date_discharged + '/' + response.data.patient_data.TRANSACTION.time_discharged 
        //GET TIME FOR TIME ADMITTED, DISCHARGED
        response.data.patient_data.TRANSACTION.time_admitted = this.getTime( response.data.patient_data.TRANSACTION.time_admitted)
        response.data.patient_data.TRANSACTION.time_discharged = this.getTime( response.data.patient_data.TRANSACTION.time_discharged)
        // response.data.maternity.MATERNITY_DATA.time_admitted = this.getTime( response.data.maternity.MATERNITY_DATA.time_admitted)
        // response.data.maternity.MATERNITY_DATA.time_discharged = this.getTime( response.data.maternity.MATERNITY_DATA.time_discharged)
        // response.data.maternity.MATERNITY_DATA.time_of_delivery = this.getTime( response.data.maternity.MATERNITY_DATA.time_of_delivery)

        //COMBINE ARRAY USING SPREAD
        this.csf_data_p1 = {...response.data.patient_data, ...response.data.patient_confinement, ...response.data.hci}
        this.csf_data_p2 = {...response.data.doctor_accreditation, ...response.data.certification , ...response.data.patient_data, ...response.data.accreditation_and_signature}
        this.cf1_data_p1 = {...response.data.patient_data}
        this.cforms_data = { ...response.data }
        this.cf1_data_p2 = {...response.data.accreditation_and_signature, ...response.data.certification}
        this.cf2_data_p1 = {...response.data.patient_data, ...response.data.patient_confinement, ...response.data.hci, ...response.data.maternity}
        this.cf2_data_p2 = {...response.data.doctor_accreditation, ...response.data.certification , ...response.data.patient_data, ...response.data.accreditation_and_signature}
        this.cf3_data_p1 = {...response.data.patient_data, ...response.data.patient_confinement, ...response.data.physical_exam}
        this.cf3_data_p2 = {...response.data.maternity, ...response.data.patient_confinement, ...response.data.doctor_accreditation, ...response.data.certification, ...response.data.accreditation_and_signature}
        this.cf4_data_p1 = {...response.data.patient_data, ...response.data.patient_confinement, ...response.data.physical_exam}
        this.cf4_data_p2 = {...response.data.patient_data, ...response.data.doctor_accreditation,...response.data.accreditation_and_signature}
        this.cf5_data_p1 =  {...response.data.patient_data, ...response.data.doctor_accreditation,...response.data.accreditation_and_signature}
        this.esoa_data = {...response.data.hci,...response.data.patient_data, ...response.data.patient_confinement,...response.data.doctor_accreditation,...response.data.accreditation_and_signature, ...response.data.certification}
        this.esoa_data2 = { ...response.data.course_in_the_ward}
        this.receipt_data = { ...response.data.course_in_the_ward,...response.data.certification }
        this.getAttachments(); 
      } else {
        this.cf1_err_catch = true
        this.cf2_err_catch = true
        this.cf3_err_catch = true
        this.cf4_err_catch = true
        this.alert = response.error
      }
    },

    showCSF(){
      this.$nextTick(() => {
        if (this.$refs.for_csf) {
          this.$refs.for_csf.getPDF()
        }
      })
    },

    async getAttachments(){
      let response = await this.$services.getPhicAuditAttachments({
        transaction_number        :    this.trans_detail.transaction_number,
        phic_tracking_number      :    this.trans_detail.phic_tracking_number,
        provider_code             :    this.$store.state.prv_data.provider_code,
        provider_tin              :    this.$store.state.prv_data.provider_tin      
      });

      if (response.status === 200) {
        if(response.data !== 'Data not found'){
              response.data = this.responseDataDecryption(response.data)
              let trim_surgical_title    = this.attachmentTitle(response.data.surgical_procedure,5)
              let trim_medicine_title    = this.attachmentTitle(response.data.medicine,4)
              let trim_pertinent_title   = this.attachmentTitle(response.data.pertinent_laboratory,5)
              let trim_additional_title  = this.attachmentTitle(response.data.additional_attachment,5)

              for(let x = 0; x<response.data.surgical_procedure.length;x++){
                  this.surgical.push({title:trim_surgical_title[x], src:response.data.surgical_procedure[x]})
              }
              for(let x = 0; x<response.data.medicine.length;x++){
                  this.medicine.push({title:trim_medicine_title[x], src:response.data.medicine[x]})
              }
            
              for(let x = 0; x<response.data.pertinent_laboratory.length;x++){
                  this.pertinent.push({title:trim_pertinent_title[x], src:response.data.pertinent_laboratory[x]})
              }
            
              for(let x = 0; x<response.data.additional_attachment.length;x++){
                  this.additional.push({title:trim_additional_title[x], src:response.data.additional_attachment[x]})
              }
              this.total_attachment =  {...this.surgical, ...this.medicine, ...this.pertinent, ...this.additional}
          }
          
          this.data_loader = false
          this.$nextTick(() => {
            this.showCSF()
            this.getEclaimsRawXML()
          })
      }
      
    },

    // GET ECLAIMS RAW XML
    async getEclaimsRawXML() {
      const xml_types = ['CF4', 'CF5', 'ESA']

      for (const xml_type of xml_types) {

        let response = await this.$services.getEclaimsRawXML({
          transaction_number: this.trans_detail.transaction_number,
          provider_code: this.$store.state.prv_data.provider_code,
          xml_type
        })

        if (response.status === 200 && response.data !== 'Data not found') {

          // Decode Base64
          const xml_content = atob(response.data.file_content)

          this.view_xml_forms.push({
            title: xml_type,
            src: xml_content,
            file_name: response.data.file_name
          })
        }
      }

      this.data_loader = false
    },
   
    //SUBMIT / REJECT RELATED 
  

    
    // PREVIOUS CONTENT/COMMENT
    prev_comment(boolean){
      this.previous_content = boolean
    },
    prevCommentConfinement(boolean, i){
      let bool = [true,true,true,true,true]
      this.previous_content_confinement = bool.map((item,index) => {
        if(i == index)return   boolean
        if(i != index)return   item
      })
    },

    prevCommentPrenatal(boolean, i){
      let bool = [true,true,true,true,true]
      this.previous_content_prenatal = bool.map((item,index) => {
          if(i == index)return   boolean
          if(i != index)return   item
      })
    },

    prevCommentComplaint(boolean, i){
      let bool = [true]
      this.previous_content_complaint = bool.map((item,index) => {
          if(i == index)return   boolean
          if(i != index)return   item
      })
    },

    checkComment(comment, comment_index, type, part){ 
      if(this.approval == '1'){
        //VALIDATION TO CHANGE THE INDEX FOR MULTIPLE DATA
        if(type === 'multiple' && part === 'cf2'){
          comment_index = comment_index + 1
        }else if(type === 'multiple' && part === 'cf3'){
          comment_index = comment_index + 15
        }else if(type === 'multiple' && part === 'cf4'){
            comment_index = comment_index + 24
        }

        //TO REPLACE THE VALUES INSIDE THE COMMENT HOLDER VARIABLE
        this.comment_holder.splice(comment_index , 1 , comment=='' ? null : comment)
        let replicate = JSON.parse(sessionStorage.getItem('replicate'))

        //TO CHECK IF THE VALUES FROM COMMENT HOLDER VARIABLE IS === REPLICATE VARIABLE
        this.check_comment = this.comment_holder.every((element,i) => element === replicate[i])
      }
    },

    changeCheckComments(value){
        this.check_comment = value
    },


    // SAVE, PRINT XML RELATED
    save(){
      window.scrollTo(0, 0)
      
      const file_name_facility = this.$store.state.prv_data.provider_name
      const patient_name = `${this.cforms_data.patient_data.PATIENT_DATA.first_name} ${this.cforms_data.patient_data.PATIENT_DATA.last_name}`

      if(this.$route.params.configuration == 'pbef'){
        this.save_loader = true
        html2canvas(document.getElementById('pbef')).then(function(canvas) {
              let margin = 12.7; 
              let img_data = canvas.toDataURL('image/png');
              let page_width = 216;
              let page_height = 356;
              let img_width = page_width - 2 * margin; 
              let img_height = canvas.height * img_width / canvas.width; 
              let doc = new jsPDF('p', 'mm', 'legal');
              let height_left = img_height;
              let position = margin; 

              doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
              height_left -= page_height;
              while (height_left > 0) {
                  position = height_left - img_height + margin;
                  doc.addPage();
                  doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
                  height_left -= page_height;
              }
              doc.save(`pBef.pdf`);
          });
        setTimeout(() => {this.save_loader = false}, 4000);
      }else if(this.$route.params.configuration == 'csm'){
        this.save_loader = true
        
        html2canvas(document.getElementById('csm')).then(function(canvas) {
              let margin = 12.7; 
              let img_data = canvas.toDataURL('image/png');
              let page_width = 210;
              let page_height = 297;
              let img_width = page_width - 2 * margin; 
              let img_height = canvas.height * img_width / canvas.width; 
              let doc = new jsPDF('p', 'mm', 'a4');
              let height_left = img_height;
              let position = margin; 

              doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
              height_left -= page_height;
              while (height_left > 0) {
                  position = height_left - img_height + margin;
                  doc.addPage();
                  doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
                  height_left -= page_height;
              }
              doc.save(`${patient_name}_${file_name_facility}_CSMSurveyTool.pdf`);
          });
        setTimeout(() => {this.save_loader = false}, 4000);
        
      }else if (this.$route.params.configuration == 'esoa') {
        this.save_loader = true;
        let transaction_number = this.trans_detail.transaction_number
        document.getElementById('esoa').classList.add('pdf-mode');

        this.$nextTick(() => {
          html2canvas(document.getElementById('esoa')).then((canvas) => {
              let margin = 12.7; 
              let img_data = canvas.toDataURL('image/png');
              let page_width = 216;
              let page_height = 356;
              let img_width = page_width - 2 * margin; 
              let img_height = canvas.height * img_width / canvas.width; 
              let doc = new jsPDF('p', 'mm', 'legal');
              let height_left = img_height;
              let position = margin; 

              doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
              height_left -= page_height;
              while (height_left > 0) {
                  position = height_left - img_height + margin;
                  doc.addPage();
                  doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
                  height_left -= page_height;
              }
              doc.save(`${patient_name}_${file_name_facility}_ESOA_${transaction_number}.pdf`);
              
              document.getElementById('esoa').classList.remove('pdf-mode');
              this.save_loader = false;
          });
        });
      }else if(['csf','cf1', 'cf2', 'cf3','cf4','cf5'].includes(this.$route.params.configuration)) {
        const form_ref = 'for_' + this.$route.params.configuration;
        const ref = this.$refs[form_ref];
        
        if (ref && ref.downloadPDF) {
          ref.downloadPDF();
        }
      }else if (this.$route.params.configuration == 'receipt-data') {
        this.save_loader = true

        html2canvas(document.getElementById('receipt_data'), {
          scale: 3
        }).then(function(canvas) {
          let margin = 12.7; 
          let img_data = canvas.toDataURL('image/png');
          let page_width = 210;
          let page_height = 297;
          let img_width = page_width - 2 * margin; 
          let img_height = canvas.height * img_width / canvas.width; 
          let doc = new jsPDF('p', 'mm', 'a4');
          let height_left = img_height;
          let position = margin; 

          doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
          height_left -= page_height;
          while (height_left > 0) {
              position = height_left - img_height + margin;
              doc.addPage();
              doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
              height_left -= page_height;
          }
          doc.save(`${patient_name}_${file_name_facility}_ReceiptData.pdf`);
        });
        setTimeout(() => {this.save_loader = false}, 4000);   
      }
    },

    print() {
      if(['csf','cf1', 'cf2', 'cf3','cf4','cf5','csf'].includes(this.$route.params.configuration)) {
        const form_ref = 'for_' + this.$route.params.configuration;
        const ref = this.$refs[form_ref];
        
        if (ref && ref.printPDF) {
          ref.printPDF();
        }
      } else{
        window.print();
      }
    },

    //MULTIPURPOSE FUNCTIONS RELATED
    // getAddress(address,type,choice,provider,reason_refer){
    //   /*FOR TYPE:
    //       1 = WAS REFERRED AND IN PATIENT DISPOSITION  LETTER F.
    //       2 = ANY EXCEPT FOR FOR 1
    //     FOR PATIENT DISPOSITION ONLY(CHOICE,PROVIDER,REASON_REFER)
    //   */
    //   let provider_name = ''
    //   let building = ''
    //   let city_municipality = ''
    //   let province = ''
    //   let zip_code = ''
    //   let reason   = ''

    //   if(type === '0'){
    //     if(!address){
    //       building ='N/A'
    //       city_municipality ='N/A' 
    //       province ='N/A'
    //       zip_code ='N/A' 
    //     }else{
    //       if(address.includes(',')){
    //         let comma_count = address.match(/,/g).length
    //         if(comma_count === 0){
    //           comma_count = 1
    //         }else{
    //           comma_count = comma_count -1
    //           if(comma_count === 0) comma_count = 1
    //             if(comma_count !== 0) comma_count 
    //           }
    //           let address_index = this.getPosition(address,',',comma_count)
    //           if(address_index < 20){
    //             if(address.includes('.')) address_index = this.getPosition(address,'.',1)
    //           }
    //           building = address.slice(0,address_index)
    //           city_municipality = address.trim(address_index + 1)
    //           province = address.slice(address_index + 14)
    //           zip_code ='N/A'
    //       }else{
    //         building ='N/A'
    //         city_municipality = address
    //         province ='N/A'
    //         zip_code ='N/A'
    //       }
    //     }
    //   }else{
    //     if(choice === 'f'){
    //       provider_name = provider ? provider : 'N/A'
    //       if(address === null || address === undefined || address == ''){
    //         building ='N/A'
    //         city_municipality ='N/A' 
    //         province ='N/A'
    //         zip_code ='N/A'
    //       }else{
    //         if(address.includes(',')){
    //           let comma_count = address.match(/,/g).length
    //           if(comma_count === 0){
    //             comma_count = 1
    //           }else{
    //             comma_count = comma_count -1
    //             if(comma_count === 0) comma_count = 1
    //             if(comma_count !== 0) comma_count 
    //           }
    //           let address_index = this.getPosition(address,',',comma_count)
    //           if(address_index < 20){
    //             if(address.includes('.')) address_index = this.getPosition(address,'.',1)  
    //           }
        
    //           building = address.slice(0,address_index)
    //           city_municipality = address.slice(address_index + 1)
    //           province ='N/A'
    //           zip_code ='N/A'
    //         }else{
    //           building ='N/A'
    //           city_municipality = address
    //           province ='N/A'
    //           zip_code ='N/A'
    //         }
    //       }
    //       reason = reason_refer ? reason_refer : 'N/A'
    //     }
    //   }
    //   return{provider_name,building, city_municipality,province, zip_code, reason}
    // },

    getAddress(address, type, choice, provider, reason_refer) {
      /*FOR TYPE:
          1 = WAS REFERRED AND IN PATIENT DISPOSITION  LETTER F.
          2 = ANY EXCEPT FOR FOR 1
        FOR PATIENT DISPOSITION ONLY(CHOICE, PROVIDER, REASON_REFER)
      */
      let provider_name = '';
      let building = '';
      let city_municipality = '';
      let province = '';
      let zip_code = '';
      let reason = '';

      if (type === '0') {
        if (!address) {
          building = 'N/A';
          city_municipality = 'N/A';
          province = 'N/A';
          zip_code = 'N/A';
        } else {
          let address_by_parts = address.split(',');
          if (address_by_parts.length >= 4) {
            building = address_by_parts.slice(0, -2).join(',').trim(); // Concatenate everything except the last two parts
            city_municipality = address_by_parts[address_by_parts.length - 2].trim();
            province = address_by_parts[address_by_parts.length - 1].trim();
          } else {
            building = address_by_parts[0].trim();
            city_municipality = address_by_parts.length >= 2 ? address_by_parts[1].trim() : 'N/A';
            province = 'N/A';
          }
          zip_code = 'N/A';
        }
      } else {
        if (choice === 'f') {
          provider_name = provider ? provider : 'N/A';
          if (!address) {
            building = 'N/A';
            city_municipality = 'N/A';
            province = 'N/A';
            zip_code = 'N/A';
          } else {
            let address_by_parts = address.split(',');
            if (address_by_parts.length >= 4) {
              building = address_by_parts.slice(0, -2).join(',').trim(); // Concatenate everything except the last two parts
              city_municipality = address_by_parts[address_by_parts.length - 2].trim();
              province = address_by_parts[address_by_parts.length - 1].trim();
            } else {
              building = address_by_parts[0].trim();
              city_municipality = address_by_parts.length >= 2 ? address_by_parts[1].trim() : 'N/A';
              province = 'N/A';
            }
            zip_code = 'N/A';
          }
          reason = reason_refer ? reason_refer : 'N/A';
        }
      }
      return { provider_name, building, city_municipality, province, zip_code, reason };
    },

    getName(first, middle, last, suffix){
      let full_name =  first +' '+ last
      if(full_name.includes(null) || full_name == ' '){
        return  'N/A'
      }else{
        return first+' '+ (middle ? middle : '')+ ' '+ last + ' '+ (suffix ? suffix : '' )
      }
    },

    getPosition(string, subString, index){
      if(string !== undefined || string !== null){
        return string.split(subString, index).join(subString).length;
      }
    },

    getTime(time) {
      if (!time) return { time_am: '00:00', time_pm: '00:00' };

      let converted_time = this.$moment(time, 'HH:mm:ss').format('hh:mm A');

      return converted_time.includes('AM') 
        ? { time_am: converted_time.slice(0, 5), time_pm: '00:00' }
        : { time_am: '00:00', time_pm: converted_time.slice(0, 5) };
    },

    attachmentTitle(array,position){
      return array.map(item => {
          let trim_itm =  this.getPosition(item,'_',position)
          return item.slice(trim_itm+1)
      })
    },

  
  },

};
</script>


<style scoped>
.sticky{
  background:white;
  padding-top: 20px;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 60px;
  z-index: 3;
}


.active-class{
  border-bottom:2px solid white;
  border-radius:0
}

.button-style {
  position: absolute;
  width: 6%;
}
.frm-overflow{overflow-x:scroll}
.frm-width{
  width: 1240px;
}
.m-auto{margin:auto}


#cf1_page1, #cf2_page1, #cf2_page2, #cf3_page1, #cf3_page2, #cf4_page1, #cf4_page2, #esoa , #xml-viewer{
  margin:auto
}

@media print {
  #navbar, #footer, #menubar, #scroll-down, #scroll-up{
    display: none;
    padding:0 !important; 
    margin:0 !important
  }
  
  #content{
    visibility: hidden;
    padding:0 !important; 
    margin:10px !important;
  }
  #pbef, #csm, #csf, #esoa, #xml-viewer, #receipt_data{
    width:100%;
    visibility: visible;
  }

  .col-lg-10,
  .col-sm-10 {
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
  }

  #csf, #cf1_page1, #cf2_page1, #cf2_page2 , #cf5_page1{
    page-break-before: always;
    border:1px solid black;
    visibility:visible;
    width:100%;
  }

  #cf3_page1, #cf3_page2, #cf4_page1, #cf4_page2{
    page-break-before: always;
    visibility:visible;
    width:100%;
  }
 
}
.input-forms{
  cursor: pointer;
  margin-top: 64px;
  padding: 16px;
  position: fixed;
}
.save-button{
  cursor: pointer;
  margin-top: 165px;
  padding: 20px 20px;
  position: fixed;
}
.print-button{
  cursor: pointer;
  margin-top: 265px;
  padding: 20px 37px;
  position: fixed;
}
@page {
  size: legal;
  margin: 5mm -15mm 5mm -15mm; 
}
</style>