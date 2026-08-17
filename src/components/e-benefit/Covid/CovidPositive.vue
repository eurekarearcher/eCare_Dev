<template>
  <v-container fluid >
  <Navbar :navbar="nav_menu" :help_menu="help" />
  <div class="px-10">
    <h2 class="text-center grey--text text--darken-3 mt-5 mb-3">COVID TEST CASE</h2>
    <v-row justify="center" class="mb-4">
      <v-col cols="11" sm="11" md="11" lg="11" xl="11">
        <v-row justify="center" class="mb-4" dense>
          <v-col cols="12" sm="6" class="px-3">
            <h4 class="text-center grey--text text--darken-3 title">1. DOCTOR <v-icon class="mb-1" color="grey darken-3" small>fas fa-user-md</v-icon></h4>
            <div v-if="!doctor_data.doctor_displayed" class="stripesLoader light-blue darken-4" style="background-position:100%;"></div>
            <v-progress-linear v-else color="light-blue darken-4" height="10" value="100" rounded striped></v-progress-linear>
          </v-col>

          <v-col cols="12" sm="6" class="px-3">
            <h4 class="text-center grey--text text--darken-3 title">2. DIAGNOSTIC <v-icon class="mb-1" color="grey darken-3" small>fas fa-heartbeat</v-icon></h4>
            <div v-if="!selection_data.selected_icd" class="stripesLoader light-blue darken-4" style="background-position:100%;"></div>
            <v-progress-linear v-else color="light-blue darken-4" height="10" value="100" rounded striped></v-progress-linear>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-col cols="12" sm="11" class="mx-auto">
      <v-card class="pt-9">
        <v-col cols="12" sm="12" class="px-5">
          <v-row justify="center" class="mb-10" dense>
            <v-col cols="12" sm="4" align-self="center" class="text-right mb-sm-10">
              <label class="fields pr-2" style="font-weight:medium !important;">PATIENT :</label>
            </v-col>

            <v-col cols="12" sm="8" class="mb-6 mb-sm-10">
              <label style="font-size:12.5pt">{{member_name}}</label>
            </v-col>

            <v-col cols="12" sm="4" align-self="center" class="text-right mb-sm-10">
              <label class="fields  pr-2" for="chief-complaint">REQUESTING PHYSICIAN DOCTOR:</label>
            </v-col>

            <v-col cols="12" sm="8" class="mb-6 mb-sm-10">
              <label v-if="requesting_doc_data.doctor_name && requesting_doc_data.doctor_name">DR. {{requesting_doc_data.doctor_name.toUpperCase()}} / {{requesting_doc_data.specialization.toUpperCase()}}</label>
              <label v-else>N/A</label>
            </v-col>

            <v-col cols="12" sm="4" align-self="center" class="text-right mb-sm-10">
              <label class="fields  font-weight-medium pr-2" for="doctor-name">INTERPRETING DOCTOR:</label>
            </v-col>

            <v-col cols="12" sm="8" class="mb-6 mb-sm-10 pr-md-12">
              <v-autocomplete v-model="doctor_data.doctor_displayed" @change="populateData('DOCTOR', doctor_data.doctor_displayed)" :error="required_fields && !doctor_data.doctor_displayed" :items="doctor_items" class="font-weight-medium" color=" grey--text text--darken-3" placeholder="Search Doctor name or Specialization" item-text="autoCompleteText" append-icon="" hide-selected hide-no-data hide-details return-object clearable outlined dense>
                <template v-slot:prepend-inner >
                  <v-icon>mdi-magnify</v-icon>
                  <v-icon size="18" right>fas fa-user-md</v-icon>
                </template>

                <template v-slot:selection="{item}">
                  {{item.doctor_name}} / {{item.specialization}}
                </template>

                <template v-slot:item="{ item }">
                  <v-layout wrap>
                    <v-list-item-avatar color="indigo" class="headline font-weight-light white--text">{{ item.doctor_name.charAt(0) }}</v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.doctor_name"></v-list-item-title>
                        <v-list-item-subtitle v-text="item.specialization"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-layout>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" sm="4" align-self="center" class="text-right">
              <label class="fields font-weight-medium pr-2" for="doctor-name">COVID DIAGNOSIS:</label>
            </v-col>

            <v-col cols="12" sm="8" class="mb-6 mb-sm-10 pr-md-12">
              <v-autocomplete v-model="selection_data.selected_icd" @change="populateData('DIAGNOSIS', selection_data.selected_icd)" :error="required_fields && !selection_data.selected_icd" :items="diagnosis_items" class="font-weight-medium" color=" grey--text text--darken-3" placeholder="Search CODE OR DESCRIPTION" prepend-inner-icon="mdi-magnify" item-text="autoCompleteText" append-icon="" return-object hide-details clearable outlined dense>
                <template v-slot:item="{ item }">
                  <v-list-item-content >
                    <v-list-item-title v-text="item.icd_code"></v-list-item-title>
                    <v-list-item-subtitle v-text="item.icd_description"></v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>

            <v-row justify="end" dense>
              <v-col cols="12" sm="12" md="3" class="pl-md-12 pr-md-12">
                <v-btn @click="submit" class="btn mt-5" color="white--text light-blue darken-4" block >SUBMIT<v-icon small right>fas fa-paper-plane</v-icon></v-btn>
              </v-col>
            </v-row>
          </v-row>

          <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="mt-5">
            <v-divider ></v-divider>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="py-2 px-5 align-center">
              <v-btn @click="covidPage" small text><v-icon small left>mdi-arrow-left</v-icon>Back to Covid Page</v-btn>
            </v-col>
          </v-col>

        </v-col>
      </v-card>
    </v-col>

    <!-- <v-flex sm11 xs12 class="mx-auto">
      <v-card class="pt-9">
        <v-flex sm12 xs12 px-5>
          <v-layout wrap justify-center mb-10>
             <v-flex sm4 xs12 mb-sm-10 align-self-center class="text-right">
                <label class="fields pr-2" style="font-weight:medium !important;">PATIENT :</label>
              </v-flex>
              <v-flex sm8 xs12 mb-6 mb-sm-10 >
                <label style="font-size:12.5pt">{{member_name}}</label>
              </v-flex>

               <v-flex sm4 xs12 mb-sm-10 align-self-center class="text-right">
                  <label class="fields  pr-2" for="chief-complaint">REQUESTING PHYSICIAN DOCTOR:</label>
                </v-flex>
                <v-flex sm8 xs12 mb-6 mb-sm-10 >
                  <label v-if="requesting_doc_data.doctor_name && requesting_doc_data.doctor_name">DR. {{requesting_doc_data.doctor_name.toUpperCase()}} / {{requesting_doc_data.specialization.toUpperCase()}}</label>
                  <label v-else>N/A</label>
                </v-flex>

               <v-flex sm4 xs12 mb-sm-10 align-self-center class="text-right">
                   <label class="fields  font-weight-medium pr-2" for="doctor-name">INTERPRETING DOCTOR:</label>
                </v-flex>

                <v-flex sm8 xs12 mb-6 mb-sm-10  class="pr-md-12">
                    <v-autocomplete v-model="doctor_data.doctor_displayed" @change="populateData('DOCTOR', doctor_data.doctor_displayed)" :error="required_fields && !doctor_data.doctor_displayed" :items="doctor_items" class="font-weight-medium" color=" grey--text text--darken-3" placeholder="Search Doctor name or Specialization" item-text="autoCompleteText" append-icon="" hide-selected hide-no-data hide-details return-object clearable outlined dense>
                      <template v-slot:prepend-inner >
                        <v-icon>mdi-magnify</v-icon>
                        <v-icon size="18" right>fas fa-user-md</v-icon>
                      </template>

                      <template v-slot:selection="{item}">
                        {{item.doctor_name}} / {{item.specialization}}
                      </template>

                      <template v-slot:item="{ item }">
                        <v-layout wrap>
                          <v-list-item-avatar color="indigo" class="headline font-weight-light white--text">{{ item.doctor_name.charAt(0) }}</v-list-item-avatar>
                          <v-list-item-content>
                              <v-list-item-title v-text="item.doctor_name"></v-list-item-title>
                              <v-list-item-subtitle v-text="item.specialization"></v-list-item-subtitle>
                          </v-list-item-content>
                        </v-layout>
                      </template>
                    </v-autocomplete>
                </v-flex>

                <v-flex sm4 xs12 mb-sm-10 align-self-center class="text-right">
                  <label class="fields font-weight-medium pr-2" for="doctor-name">COVID DIAGNOSIS:</label>
                </v-flex>

                <v-flex sm8 xs12 mb-6 mb-sm-10  class="pr-md-12">
                  <v-autocomplete v-model="selection_data.selected_icd" @change="populateData('DIAGNOSIS', selection_data.selected_icd)" :error="required_fields && !selection_data.selected_icd" :items="diagnosis_items" class="font-weight-medium" color=" grey--text text--darken-3" placeholder="Search CODE OR DESCRIPTION" prepend-inner-icon="mdi-magnify" item-text="autoCompleteText" append-icon="" return-object hide-details clearable outlined dense>
                    <template v-slot:item="{ item }">
                      <v-list-item-content >
                        <v-list-item-title v-text="item.icd_code"></v-list-item-title>
                        <v-list-item-subtitle v-text="item.icd_description"></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-flex>

                <v-layout wrap justify-end >
                  <v-flex md3 sm12 xs12 class="pl-md-12 pr-md-12">
                      <v-btn @click="submit" class="btn mt-5" color="white--text light-blue darken-4" block >SUBMIT<v-icon small right>fas fa-paper-plane</v-icon></v-btn>
                  </v-flex>
                </v-layout>
          </v-layout>
        </v-flex> -->
        <!-- BACK TO ELIGIBILITY -->
        <!-- <v-flex xl12 sm12 mt-5>
          <v-divider ></v-divider>
          <v-flex xl12 sm12 py-2 px-5 class=" align-center">  
            <v-btn @click="covidPage" small text><v-icon small left>mdi-arrow-left</v-icon>Back to Covid Page</v-btn>
          </v-flex>
        </v-flex>
      </v-card>
    </v-flex> -->

    <!-- MODALS -->
    <!-- DIALOG/MODAL BOX FOR CONFIRMATION -->
    <v-dialog v-model="confirmation_dialog" width="1050px" persistent>
      <v-card>
         <h6 class="text-body-2 text-sm-h6 py-3 justify-center light-blue darken-4 white--text text-center">CONFIRMATION</h6>
        <v-card-text class="mt-6">

          <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pr-3 mb-5">
            <label for="doctor-name">REQUESTING DOCTOR</label>
            <v-card class="selectedDoctor font-weight-medium"  outlined>{{requesting_doc_data.doctor_displayed ? requesting_doc_data.doctor_displayed : 'N/A'}}</v-card>
          </v-col>

          <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pr-3 mb-5">
            <label for="doctor-name">INTERPRETING DOCTOR</label>
            <v-card class="selectedDoctor font-weight-medium" outlined>{{doctor_data.doctor_name+' / '+doctor_data.specialization}}</v-card>
          </v-col>

          <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pr-3 mb-5">
            <label for="doctor-name">DIAGNOSIS</label>
            <v-card class="selectedDoctor font-weight-medium" outlined>{{selection_data.icd_code}} - {{selection_data.icd_description}}</v-card>
          </v-col>
          
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn @click="confirmation_dialog = false" :disabled="confirm_loader" class="btn mr-2 px-2" color="secondary" rounded outlined><v-icon small left>fas fa-times-circle</v-icon><span class="pr-2">CANCEL</span></v-btn> 
          <v-btn @click="confirmCovidSubmit" :loading="confirm_loader" class="btn mr-2 px-2" color="light-blue darken-4 white--text" rounded  >CONFIRM <v-icon small right>fas fa-check-circle</v-icon></v-btn> 
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <Alert :alert="alert" @covidPage="covidPage"/>
  
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Alert  from '@/components/Alert.vue'

export default {
  components:{
    Navbar, 
    Alert
  },
  data() {
    return {
      //ALERTS CONTENT
      alert: {},
      //NAVBAR CONTENT
      nav_menu:[{ title: "Home", link: '/covid-list', icon: 'fas fa-home' }],
      help: [{ content: "Please select your Diagnosis and Procedure by then submit. You can remove it by unchecking the selected items." }],
      doc_loader: false,
      doctor_list: [],
      covid_diagnosis_list : [],
      doctor_data :{
        doctor_code: '',
        doctor_name: '',
        specialization: '',
        doctor_tin: '',
        doctor_prc_license: '',
        doctor_phic_account_no: '',
        doctor_displayed:'',
      },

      requesting_doc_data: {
        doctor_code: '',
        doctor_name: '',
        specialization: '',
        doctor_tin: '',
        doctor_displayed: '',
      },

      selection_data:{
        selected_icd:'',
        icd_tag: 'NEW',
        icd_code: '',
        icd_description: '',
        icd_type: 'PRIMARY',
      },
    
      session_data: [],

      // CONFIRM DIALOG
      confirmation_dialog: false,
      confirm_loader:false,
      member_name:'',

      //error
      required_fields:false
    }
  },

  mounted() {
   this.startingProcess();
  },

  computed: {
    doctor_items () {
      return this.doctor_list.map(list => {
        const doctor_name            = list.doctor_name.replace(/[,.]/g, '')
        const specialization         = list.specialization
        const doctor_code            = list.hmo_doctor_code
        const doctor_tin             = list.doctor_tin_no
        const doctor_phic_account_no = list.doc_phic_acc_no
        const doctor_prc_license     = list.doc_prc_license
        const autoCompleteText = doctor_name+' / '+specialization +' '+ doctor_tin
        return Object.assign({},{doctor_name,specialization,doctor_code,doctor_tin,autoCompleteText,doctor_prc_license,doctor_phic_account_no})
      })
    },

    diagnosis_items () {
      return this.covid_diagnosis_list.map(list => {
        const icd_code                   = list.icd_code
        const icd_description      = list.description
        const autoCompleteText           = icd_code+' '+icd_description
        return Object.assign({},{icd_code,icd_description,autoCompleteText})
      })
    },
  },

  methods: {
    startingProcess() {
      this.session_data = sessionStorage.getItem("LSH4GF")? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("LSH4GF"),"fsdsaxt").toString(this.$crypto.enc.Utf8)): []
      this.member_name = this.session_data.mem_first_name +' '+(this.session_data.mem_middle_name ? this.session_data.mem_middle_name : '')+ ' '+ this.session_data.mem_last_name + ' '+ (this.session_data.mem_suffix ? this.session_data.mem_suffix : '')
      this.requesting_doc_data.doctor_code      = this.session_data.doctor_code
      this.requesting_doc_data.doctor_tin       = this.session_data.doctor_tin
      this.requesting_doc_data.doctor_name      = this.session_data.doctor_name ? this.session_data.doctor_name.toUpperCase() : ''
      this.requesting_doc_data.specialization   = this.session_data.specialization ? this.session_data.specialization.toUpperCase() : ''
      this.requesting_doc_data.doctor_displayed = this.session_data.doctor_name ? (this.session_data.doctor_name.toUpperCase() +' / ' + this.session_data.specialization.toUpperCase()) : ''
      this.getDoctorList();
      this.getCovidDiagnosis();
    },

    async getDoctorList(){
      //API DATA FOR AUTOCOMPLETES
      if (this.doctor_items.length > 0) return
      if (this.doc_loader) return
      this.doc_loader = true
      let response = await this.$services.getTransactionIpRefData({
        request_key    : 'patient_doctor',
        host_doctor    :'LGU',
        provider_code  : this.$store.state.prv_data.provider_code, 
        provider_tin   : this.$store.state.prv_data.provider_tin,
        hmo_host_code  : undefined,
        phic_host_code : undefined,
        lgu_host_code  : this.$store.state.usr_credentials.lgu_host_code
      })

      if(response.status === 200) {
        this.doc_loader = false
        if(response.data === 'Data not found.') return this.doctor_list = []
        response.data = this.responseDataDecryption(response.data)
        this.doctor_list = response.data
      } else {
        this.alert = response.error
      }
    },

    async getCovidDiagnosis(){
       //GET DIAGNOSIS DATA
      this.diagnosis_loader = true
      let response = await this.$services.getProviderICD({
        request_type : 'covid'
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        this.covid_diagnosis_list = response.data
        this.diagnosis_loader = false
      } else {
        this.alert = response.error
      }
    },

    populateData(type, item){
      if (type === 'DOCTOR') {
        if(!item){  // IF USER USE BACKSPACE TO DELETE THE DATA
          this.doctor_data.doctor_code             =  ''
          this.doctor_data.doctor_name             =  ''
          this.doctor_data.specialization          =  ''
          this.doctor_data.doctor_tin              =  ''
          this.doctor_data.doctor_prc_license      =  ''
          this.doctor_data.doctor_phic_account_no  =  ''
          this.doctor_data.doctor_displayed        =  ''
        }else{
          this.doctor_data.doctor_code             = item.doctor_code ? item.doctor_code : ''
          this.doctor_data.doctor_name             = item.doctor_name ? item.doctor_name : '' 
          this.doctor_data.specialization          = item.specialization ? item.specialization : '' 
          this.doctor_data.doctor_tin              = item.doctor_tin ? item.doctor_tin : ''
          this.doctor_data.doctor_prc_license      = item.doctor_prc_license ? item.doctor_prc_license : ''
          this.doctor_data.doctor_phic_account_no  = item.doctor_phic_account_no ? item.doctor_phic_account_no : '' 
          this.doctor_data.doctor_displayed        = item.doctor_name+' / '+item.specialization+' '+item.doctor_tin
          this.doctor_data.check_validate_doc      = true
        }
      } else {
        if(!item ){ // IF USER USE BACKSPACE TO DELETE THE DATA TO PREVENT CONSOLE LOG ERROR
          this.selection_data.icd_code = '' 
          this.selection_data.icd_description = '' 
          this.selection_data.selected_icd = ''
        }else{
          this.selection_data.icd_code = item.icd_code
          this.selection_data.icd_description = item.icd_description
        }
      }
    },

    submit(){
      if (!this.doctor_data.doctor_displayed || !this.selection_data.selected_icd) {
        this.required_fields = true
        this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Field is empty/Invalid Value', body: 'Please fill out all required fields.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      } else {
        this.required_fields = false
        this.confirmation_dialog = true
      }
    },

    async confirmCovidSubmit() {
      this.confirm_loader = true;

      let response = await this.$services.trnUpdateComDiseaseTestCase({
        com_disease_test_cases_id: this.session_data.com_disease_test_cases_id,
        transaction_number    : this.session_data.transaction_number,
        post_doctor_tin       : this.doctor_data.doctor_tin,
        post_doctor_code      : this.doctor_data.doctor_code,
        post_result_icd_code  : this.selection_data.icd_code,
        cpt_code              : this.session_data.cpt_code,
        disease               : 'covid',
        test_result           : 'POSITIVE',
        ek_lgu_id             : this.session_data.ek_lgu_id,
        is_com_disease        : 1
      });

      if (response.status === 200) {
        await Promise.all([
            this.$services.trnPushNotificationUser({
                ek_lgu_id: this.session_data.ek_lgu_id
            }),
            this.$services.trnPushNotificationEstab({
                ek_lgu_id: this.session_data.ek_lgu_id
            })
        ]);
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: 'Transaction has been completed', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'covidPage' };
      } else {
          this.alert = response.error;
      }
    },

    covidPage(){
      this.$router.replace('/covid-list')
    }
  },

  beforeDestroy(){
    sessionStorage.removeItem('LSH4GF')
  }
}
</script>

<style scoped>
.selectedDoctor{
  background-color: transparent !important;
  border: 1px solid rgb(180, 180, 180) !important;
  font-weight: 400;
  line-height: 32px;
  margin-bottom: 0.5em;
  min-height: 35px;
  padding-left: 12px;
}
label{
  font-weight: bold;
}
.fields{
  color: #616161 ;
  font-weight: 500 !important;
  display:block;
  text-align:right;
}

@media only screen and (max-width: 1264px){
  .fields{
    display:block;
    text-align:left;
  }
}
</style>