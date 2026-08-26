<template>
  <v-container fluid px-6>
    <Navbar  :navbar="navbar" />

    <v-row justify="space-between" class="mt-3" dense>
      <h2 class="font-weight-medium mb-5 align-self-end order-1 order-sm-0">TELEMEDICINE ASSISTED CLINIC HOURS</h2>
      <v-col cols="12" sm="4" md="3" class="order-0 order-sm-1 mb-5">
        <v-img  v-if="prv_config" :src="prv_config.provider_logo"  height="60"  class="ml-sm-auto mx-sm-0 mx-auto"  width="180" max-width="200" alt="provider logo" contain></v-img>
      </v-col>
    </v-row>

    <v-layout wrap justify-space-between align-center mt-2 mb-5>    
        <div class="d-flex justify-end align-center">
          <h4 class="body-2 font-weight-medium mt-4 mr-5"> ACCEPT TELEMEDICINE ASSISTED REFERRAL  </h4>
          <template v-if="loading_tbl"> 
            <v-progress-circular color="primary" size="20" width="3" class="mt-4 mr-5" indeterminate > </v-progress-circular>
          </template>
          <template v-else> 
            <span :class="[accept_teleconsult? 'green--text': 'red--text', 'body-1 font-weight-regulart mt-4 mr-5']"> 
            {{ accept_teleconsult? 'YES':'NO'}} 
            </span>
          </template>
          <v-switch v-model="accept_teleconsult" @change="updateAcceptingTeleConsult" inset hide-details dense> </v-switch>
        </div>
        <div class="d-flex"> 
          <div v-if="queue_limit === '0'">
              <v-tooltip top color="#1565C0">
                  <template v-slot:activator="{ on }">
                  <div v-on="on" class="d-inline-block bg-white">
                      <v-btn :disabled="disabled_set_clinic_hours || accept_teleconsult" color="primary" class="mr-4" outlined> SET CLINIC HOURS </v-btn>   
                  </div>
                  </template>
                  <div class="d-flex align-center">
                      <span> You need to set queue limit first.</span>
                  </div>
              </v-tooltip>
          </div>
          <div v-else>
              <v-btn @click="set_clinic_hours = !set_clinic_hours" :disabled="!accept_teleconsult" color="primary" class="mr-4" outlined> SET CLINIC HOURS </v-btn>
          </div>
          <v-btn @click="queue_limit_dialog = true" :disabled="!accept_teleconsult" outlined> SET QUEUE LIMIT </v-btn>
        </div>
    </v-layout>
    <table class="text-center body-2 mt-4" cellspacing="0">
      <tr class="white--text darken-3 blue">
          <td  style="width: 30%; height: 60px;">
              <h6 class="font-weight-medium body-2">DAYS</h6>
          </td>
          <td style="width: 28%; height: 60px;">
              <h6 class="font-weight-medium body-2">MORNING</h6>

          </td>
          <td  style="width: 26%; height: 60px;">
              <h6 class="font-weight-medium body-2">AFTERNOON</h6>
          </td>
          <td :hidden="set_clinic_hours" style="width: 15%; height: 60px;">
              <h6 class="font-weight-medium body-2">SET CLINIC HOURS</h6>
          </td>
      </tr>
      <template v-if="accept_teleconsult">
        <tr v-if="loading_tbl"> 
          <td colspan="4" class="text-no-wrap">
            <v-progress-linear color="primary" size="30" indeterminate></v-progress-linear>
            <div class="d-flex justify-center align-center" style="height: 150px;"> 
              <h4 class="text--secondary body-2 my-5 text-center">Loading Schedule... Please wait...</h4>
            </div> 
          </td>
        </tr>
        <tr v-else v-for="(sched, key) in scheds_item" :key="key"> 
            <td class="text-no-wrap" style="height: 50px;">{{ sched.day  }}</td>
            <td class="text-no-wrap" style="height: 50px;">{{ sched.time[0] === 'No Clinic Hours-'? sched.time[0].replace('-', '') : sched.time[0] }} </td>
            <td class="text-no-wrap" style="height: 50px;">{{ sched.time[1] === 'No Clinic Hours-'? sched.time[1].replace('-', '') : sched.time[1] }} </td>
            <td class="text-no-wrap" :hidden="set_clinic_hours" style="height: 50px;"> <v-icon @click="selectRow(sched)" > mdi mdi-square-edit-outline </v-icon> </td>
        </tr>
      </template>
      <template v-else> 
        <tr> 
            <td colspan="4" class="text--secondary text-no-wrap" style="height: 150px;"> <i class="body-1 text--secondary"> No Schedule Found </i> </td>
        </tr>
      </template>
        <tr class="darken-3 blue"> 
            <td colspan="4" class="text--secondary text-no-wrap" style="height: 50px;"> </td>
        </tr>
    </table>

    <v-dialog v-model="show_schedule" width="900">
      <v-card>
        <v-card-title class="text-subtitle-2 text-sm-h6 justify-center light-blue darken-4 white--text"> SET CLINIC HOURS </v-card-title>
        <v-form @submit.prevent="saveClinicHours" class="pa-2">
          <v-row class="mx-4" dense> 
            <v-col lg="12">
              <div class="d-flex justify-space-between align-baseline"> 
                <h4 class="body-1 font-weight-bold"> Day: {{ this.days_key  }}  </h4> 
              </div>
            </v-col>
          </v-row>
          <v-row class="mx-4 mt-5" dense> 
            <v-col sm="4" md="3" lg="12" align-self="center" class="text-end pr-8"> 
              <h4 class="font-weight-regular"> Set no clinic hours </h4>
            </v-col>
          </v-row>
          <v-row class="ma-4" dense> 
            <v-col sm="12" md="3" lg="3" align-self="center"> 
              <h4 class="font-weight-regular"> Morning </h4> 
            </v-col>
            <v-col sm="6" md="6" lg="6">                        
              <div class="d-flex justify-center align-baseline">
                <v-select v-model="selected_item_morning_time_one" :items="select_schedule.time_morning_items_one" class="mx-2" :disabled="toggle_hours_morning" hide-details outlined dense style="max-width: 190px;">
                </v-select>
                <h4 class="body-2"> - </h4>
                <v-select v-model="selected_item_morning_time_two" :items="select_schedule.time_morning_items_one"  class="mx-2" :disabled="toggle_hours_morning || selected_item_morning_time_one === ''? true : false" hide-details outlined dense style="max-width: 190px;">
                </v-select>
              </div>
            </v-col>
            <v-col sm="6" md="3" lg="3">                        
              <div class="d-flex justify-center align-start">
                <v-switch
                  v-model="toggle_hours_morning"
                  @change="toggleClinicHours('morning')"
                  class="mt-1"
                  inset
                  hide-details
                ></v-switch>
                </div>
            </v-col>
          </v-row>
          <v-row class="ma-4" dense> 
            <v-col sm="12" md="3" lg="3" align-self="center"> 
              <h4 class="font-weight-regular"> Afternoon </h4> 
            </v-col>
            <v-col sm="6" md="6" lg="6">                        
              <div class="d-flex justify-center align-baseline">
                  <v-select v-model="selected_item_afternoon_time_one" :items="select_schedule.time_afternoon_items" class="mx-2" :disabled="toggle_hours_afternoon" hide-details outlined dense style="max-width: 190px;">
                  </v-select>
                  <h4 class="body-2"> - </h4>
                  <v-select v-model="selected_item_afternoon_time_two" :items="select_schedule.time_afternoon_items" class="mx-2" :disabled="toggle_hours_afternoon || selected_item_afternoon_time_one === ''? true : false" hide-details outlined dense style="max-width: 190px;">
                  </v-select>
              </div>
            </v-col>
            <v-col sm="6" md="3" lg="3" class="mb-4">                        
                <div class="d-flex justify-center align-start">
                    <v-switch
                      v-model="toggle_hours_afternoon"
                      @change="toggleClinicHours('afternoon')"
                      class="mt-1"
                      inset
                      hide-details
                    ></v-switch>
                </div>
            </v-col>
          </v-row>
          <v-divider> </v-divider>
          <v-row justify="center" class="mt-4" dense >
            <v-card-actions>
              <v-btn @click="closeClicnicHours"  color="secondary" outlined rounded><v-icon small left>fas fa-times-circle</v-icon>CANCEL</v-btn> 
            </v-card-actions>
            <v-card-actions>
              <v-btn type="submit" color="light-blue darken-4 white--text" :loading="loading_btn" rounded >CONFIRM<v-icon small right>fas fa-check-circle</v-icon></v-btn>
            </v-card-actions>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="queue_limit_dialog" width="400" persistent>
        <v-card class="pa-5">
            <h6 class="font-weight-regular body-2">Current Queue Limit: {{queue_limit}} </h6>
            <v-divider class="my-2"></v-divider>
            <h6 class="font-weight-regular body-2 mb-2">SET QUEUE LIMIT</h6>
            <v-text-field v-model="queue_limit" :items="queue_limit_item" hide-details outlined> </v-text-field>

            <v-layout justify-end wrap mt-4>
                <v-btn @click="queue_limit_dialog = false" small>CLOSE</v-btn>
                <v-btn @click="saveClinicHours('set_queue')"  class="ml-2" color="primary" small>CONFIRM</v-btn>
            </v-layout>
        </v-card>
    </v-dialog>

    <Alert :alert="alert" />
    
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'

export default {
  components:{
    Navbar, 
    Alert,
  },

  data(){
    return{
      prv_config: localStorage.getItem('dskDo3Y') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('dskDo3Y'),'ldoweSf').toString(this.$crypto.enc.Utf8)) : null, 

      loading_tbl: false,
      loading_btn: false,

      clinic_header_list:[
        { text: '', value: 'day',width:"150px" },
        { text: 'MORNING', value: '', width:"250px"},
        { text: 'AFTERNOON', value: '', sortable: false, width:"250px" },
      ],

      queue_limit_dialog: false,
      set_clinic_hours: true,
      disabled_set_clinic_hours: true,

      accept_teleconsult: false,
      queue_limit: '',
      scheds_item:{},

      select_schedule: {
        time_morning_items_one: [
          '08:00 AM',
          '08:30 AM',
          '09:00 AM',
          '09:30 AM',
          '10:00 AM',
          '10:30 AM',
          '11:00 AM',
          '11:30 AM',
          '12:00 PM'
        ],
  
        time_afternoon_items: [
          '12:00 PM',
          '12:30 PM',
          '01:00 PM',
          '01:30 PM',
          '02:00 PM',
          '02:30 PM',
          '03:00 PM',
          '03:30 PM',
          '04:00 PM',
          '04:30 PM',
          '05:00 PM'
        ]
      },

      queue_limit_item: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],

      days_key: '',

      show_schedule: false,
      schedule_item: {},

      alert:{},
      navbar: [
        { title: "TELEMEDICINE ASSISTED CLINIC HOURS", link: "/teleconsult-clinic-hours", icon: "fas fa-clock" },
        { title: "TELEMEDICINE ASSISTED PATIENTS", link: "/teleconsult-patients-list", icon: "fas fa-folder" },
        { title: "Patient Queue List", link: "/patient-queue-list", icon: "fas fa-folder" },
        { title: "Transaction Record List", link: "/patient-transaction-record", icon: "fas fa-clipboard-list" },
        ...(this.$store.state.usr_credentials.provider_reg_type === 'BRGY' ? [{ title: 'Referred Transaction', link: '/referred-transaction', icon: 'fas fa-clipboard-check' }] : [])
      ],

      toggle_hours_morning: false,
      toggle_hours_afternoon: false,

      selected_item_morning_time_one: '',
      selected_item_morning_time_two: '',
      selected_item_afternoon_time_one: '',
      selected_item_afternoon_time_two: ''
    }
  },

  created() {
    sessionStorage.clear();
    this.getDoctorSchedule()
  },

  methods:{
    //GET THE DOCTOR SCHEDULE
    async getDoctorSchedule() {
      this.loading_tbl = true
      
      let response = await this.$services.getDoctorSchedule({
          doctor_tin: this.$store.state.usr_credentials.doctor_tin,
          provider_code: this.$store.state.prv_data.provider_code,
          provider_tin: this.$store.state.prv_data.provider_tin,
          hmo_doctor_code: this.$store.state.usr_credentials.doctor_code,
          lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
      })

      if (response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        this.loading_tbl = false
        if (response.data.accept_teleconsult) {
          this.scheds_item = response.data.schedule.map(data => {
            return {
              day: this.getFilteredDays(data.day),
              time: data.time.split("/")
            }
          })
          
          this.accept_teleconsult = true
          this.queue_limit = response.data.queue_limit.toString()
        } else {
          this.accept_teleconsult = false
        }
      } else {
        this.alert = response.error
      }
    },

    //TOGGLE CLINIC HOURS FOR NEW TIME
    toggleClinicHours(key) {
      if(key === 'morning') {
          if(this.toggle_hours_morning) {
            this.selected_item_morning_time_one = ''
            this.selected_item_morning_time_two = ''
          }
      }

      if(key === 'afternoon') {
          if(this.toggle_hours_afternoon) {
            this.selected_item_afternoon_time_one = ''
            this.selected_item_afternoon_time_two = ''
          }
      }
    },

    //SELECTED ROW OF THE SCHEDULE TABLE
    selectRow(item){
      let morning = item.time[0].split('-')
      let afternoon = item.time[1].split('-')
      this.selected_item_morning_time_one = morning[0] ? morning[0]:''
      this.selected_item_morning_time_two = morning[1] ? morning[1]:''
      this.selected_item_afternoon_time_one = afternoon[0] ? afternoon[0]:''
      this.selected_item_afternoon_time_two = afternoon[1] ? afternoon[1]:''

      if(this.selected_item_morning_time_one === 'No Clinic Hours') {
        this.toggle_hours_morning = true
      } 

      if(this.selected_item_afternoon_time_one === 'No Clinic Hours') {
        this.toggle_hours_afternoon = true
      }

      this.show_schedule = true
      this.days_key = item.day
      this.schedule_item = item.day
    },

    //SAVE CLINIC HOURS OF DOCTORS
    async saveClinicHours(data) {
      this.loading_btn = true
      let morning = this.selected_item_morning_time_one !== '' || this.selected_item_morning_time_two !== ''? this.selected_item_morning_time_one + "-" + this.selected_item_morning_time_two : 'No Clinic Hours'
      let afternoon = this.selected_item_afternoon_time_one !== '' || this.selected_item_afternoon_time_two !== ''? this.selected_item_afternoon_time_one + "-" + this.selected_item_afternoon_time_two : 'No Clinic Hours'

      let response = await this.$services.trnUpdDocSchedule({
          doctor_tin: this.$store.state.usr_credentials.doctor_tin,
          provider_tin: this.$store.state.prv_data.provider_tin,
          provider_code: this.$store.state.prv_data.provider_code,
          doctor_code: this.$store.state.usr_credentials.doctor_code,
          ...(data !== 'set_queue'? {schedule: [{
            day: this.getDays(this.days_key),
            time: morning +  "/" + afternoon
          }]}:undefined),
          lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
          queue_limit: parseInt(this.queue_limit)
      })

      if(response.status === 200) {
        this.loading_btn = false
        if(response.data.success) {
          this.disabled_set_clinic_hours = false
          this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-check-circle', color: 'success', title: 'TELE CONSULT', body: data === 'set_queue'? "Queue limit has been updated":"Clinic hours has been updated", btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        } else {
          this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'error', title: 'TELE CONSULT', body: "Can't update due to unknown error please try again later", btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      } else {
        this.alert = response.error
      }
    },

    async updateAcceptingTeleConsult(){
      let response = await this.$services.trnUpdAcceptTeleconsult({
          doctor_tin: this.$store.state.usr_credentials.doctor_tin,
          hmo_doctor_code: this.$store.state.usr_credentials.doctor_code,
          provider_code: this.$store.state.prv_data.provider_code,
          accept_teleconsult: this.accept_teleconsult ? '1' : '0'
      })

      if (response.status === 200) {
        if(!response.data.success) {
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Accept Tele Consult', body: "There's a problem in webservice Please try again later", btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        } else {
          this.getDoctorSchedule()
        }
      } else {
        this.alert = response.error
      }
    },

    closeClicnicHours() {
      this.show_schedule = false
      this.schedule_item = {}
      this.days_key = ''
      this.toggle_hours_afternoon = false
      this.toggle_hours_morning = false
      this.selected_item_morning_time_one = ''
      this.selected_item_morning_time_two = ''
      this.selected_item_afternoon_time_one = ''
      this.selected_item_afternoon_time_two = ''
    }
  }
}
</script>
<style scoped>
table { width: 100%; }
table, th, td { 
    border-collapse: separate; 
    border: 1px solid #dbdbdb;
}
#content {
    overflow-x: auto; 
    overflow-y: hidden; 
}
#content table { min-width: 1400px; }
.cell-background {
    background: #1565C0;
    color: white
}
</style>