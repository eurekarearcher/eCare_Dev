<template>
   <div>
      <v-layout v-if="loading_data" class="my-14" justify-center align-center>
         <v-progress-circular color="primary" size="30" indeterminate></v-progress-circular>
         <h5 class="body-2 font-weight-medium light-blue--text text--darken-4 pl-5">Loading Data... Please wait...</h5>
      </v-layout>

      <div v-else>
         <v-row dense>
             <v-col v-if="tbl_items_vaccine.length === 0" cols="12" class="mb-10 mt-10">
                <h2 class="font-weight-regular grey--text text-center title"><em>No Vaccination Record</em></h2>
            </v-col>

            <v-col v-else cols="12" class="mb-10">
               <div class="mb-10">
                  <h3 class="font-weight-medium">Vaccination Record</h3>
                  <table class="table mb-5" cellspacing="0">
                     <thead>
                        <tr class="tbl-row">
                           <th class="py-2 body-2">Dose seq.</th>
                           <th class="py-2 body-2">Date</th>
                           <th class="py-2 body-2">Vaccine Manufacturer</th>
                           <th class="py-2 body-2">Batch No.</th>
                           <th class="py-2 body-2">Lot No.</th>
                           <th class="py-2 body-2">Vaccinator</th>
                           <th class="py-2 body-2">Remarks</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="(vaccine,index) in tbl_items_vaccine" :key="index">
                           <td style="width:5%">{{ vaccine.number_of_vaccination === 'N/A' ? vaccine.number_of_vaccination : $moment.localeData().ordinal(vaccine.number_of_vaccination)}}</td>
                           <td>{{vaccine.date_time ? $moment(vaccine.date_time).format('MM-DD-YYYY') : 'N/A'}}</td>
                           <td>{{vaccine.dose_brand}}</td>
                           <td>{{vaccine.batch_no}}</td>
                           <td>{{vaccine.lot_no}}</td>
                           <td>{{vaccine.vaccinator}}</td>
                           <td>{{vaccine.remarks}}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>

               <div v-if="tbl_items_booster.length > 0">
                  <h3 class="font-weight-medium">Booster Record</h3>
                  <table class="table mb-5" cellspacing="0">
                     <thead>
                        <tr class="tbl-row">
                           <th class="py-2 body-2">Dose seq.</th>
                           <th class="py-2 body-2">Date</th>
                           <th class="py-2 body-2">Vaccine Manufacturer</th>
                           <th class="py-2 body-2">Batch No.</th>
                           <th class="py-2 body-2">Lot No.</th>
                           <th class="py-2 body-2">Vaccinator</th>
                           <th class="py-2 body-2">Remarks</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="(booster,index) in tbl_items_booster" :key="index">
                           <td style="width:5%">{{ booster.number_of_vaccination === 'N/A' ? booster.number_of_vaccination : $moment.localeData().ordinal(booster.number_of_vaccination)}}</td>
                           <td>{{booster.date_time ? $moment(booster.date_time).format('MM-DD-YYYY') : 'N/A'}}</td>
                           <td>{{booster.dose_brand}}</td>
                           <td>{{booster.batch_no}}</td>
                           <td>{{booster.lot_no}}</td>
                           <td>{{booster.vaccinator}}</td>
                           <td>{{booster.remarks}}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </v-col>
         </v-row>
           
         <v-form v-if="emr_params.editable">
            <v-row dense>
               <v-col cols="12">
                  <div v-if="vaccination_data.length !== 0" class="mb-15">
                     <h3 class="font-weight-medium">Vaccination Record</h3>
                     <v-row v-for="(vaccine, index) in vaccination_data" :key="index" justify="space-between" dense>
               
                        <v-col cols="12" sm="1" class="align-self-end">
                           <v-text-field :value="$moment.localeData().ordinal(vaccine.number_of_vaccination)" :disabled="from_migration" label="Dose seq" readonly hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="align-self-end">
                           <v-menu :close-on-content-click="false" :disabled="!emr_params.editable" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                              <template v-slot:activator="{ on }">
                                 <v-text-field v-on="on" :value="vaccine.date_time_display" :disabled="from_migration" :error="vaccine.is_error && !vaccine.date_time_display" @change="emitData(index, 'vaccination_data')" plabeholder="MM-DD-YYYY" label="Date" prepend-inner-icon="mdi-calendar" hide-details>
                                    <template v-slot:append>
                                       <v-icon v-if="emr_params.editable && vaccine.date_time_display" @click="clearDate(index, 'vaccination_data')">mdi-close</v-icon>
                                    </template>
                                 </v-text-field>
                              </template>

                              <v-date-picker v-model="vaccine.date_time" :max="dateToday()" :min="index === 1 ? vaccination_data[0].date_time : patient_birthdate" @change="changeDate(index, 'vaccination_data')" no-title></v-date-picker>
                           </v-menu>
                        </v-col>
                        <v-col cols="12" sm="2" class="align-self-end">
                           <v-autocomplete 
                              v-model="vaccine.dose_brand"
                              :disabled="from_migration" 
                              @change="validateVaccineBrand(vaccine, index)"
                              :items="vaccine.number_of_vaccination == '1' ? dose_brand_list : dose_brand_list.filter(item => item != 'JANSSEN COVID-19 VACCINE (JOHNSON & JOHNSON)')"
                              :error="vaccine.is_error && !vaccine.dose_brand"
                              clearable
                              label="Vaccine Manufacturer"
                              hide-details>
                           </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="1" class="align-self-end">
                           <v-text-field 
                              v-model="vaccine.batch_no"
                              :disabled="from_migration" 
                              @change="emitData(index, 'vaccination_data')"
                              label="Batch No" 
                              hide-details>
                           </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1" class="align-self-end">
                           <v-text-field
                              v-model="vaccine.lot_no"
                              :disabled="from_migration" 
                              @change="emitData(index, 'vaccination_data')"
                              label="Lot No" 
                              hide-details>
                           </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" class="align-self-end">
                           <v-text-field
                              v-model="vaccine.remarks"
                              :disabled="from_migration" 
                              @change="emitData(index, 'vaccination_data')"
                              label="Remarks" 
                              hide-details>
                           </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="align-self-end">
                           <v-combobox 
                              v-model="vaccine.vaccinator" 
                              :disabled="from_migration" 
                              @change="checkSelectedField($event, index, 'vaccination_data')"
                              :items="vaccinator_items" 
                              item-text="key" 
                              label="Vaccinator"
                              maxlength="50"
                              hide-details>
                                 <template v-slot:selection="{item}">
                                    {{item.vaccinator ? item.vaccinator: item}}
                                 </template>
                                 <template v-slot:item="{ item }">
                                    <v-list-item-title v-text="item.vaccinator"></v-list-item-title>
                                 </template>
                                 <template v-slot:append-outer>
                                    <v-icon v-if="index == 0" class="px-3"></v-icon>
                                    <v-icon @click="validateVaccineRow(index, 'vaccination_data')" :disabled="from_migration"  v-else size="26">mdi-delete</v-icon>
                                 </template>
                           </v-combobox>
                        </v-col>
                     </v-row>
                  </div>

                  <div v-if="booster_data.length > 0">
                     <h3 class="font-weight-medium">Booster Record</h3>
                     <v-row v-for="(booster, index) in booster_data" :key="index" justify="space-between" dense>
                        <v-col cols="12" sm="1" class="align-self-end">
                           <v-text-field :value="$moment.localeData().ordinal(booster.number_of_vaccination)" :disabled="from_migration" label="Dose seq" readonly hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="align-self-end">
                           <v-menu
                              :close-on-content-click="false"
                              :disabled="!emr_params.editable"
                              offset-y
                              >
                              <template v-slot:activator="{ on }">
                                 <v-text-field
                                    v-model="booster.date_time_display"  
                                    :disabled="from_migration" 
                                    v-on="on"
                                    @change="emitData(index, 'booster_data')"
                                    :error="booster.is_error && !booster.date_time_display"
                                    prepend-inner-icon="mdi-calendar"
                                    placeholder="MM/DD/YYYY"
                                    label="Date" 
                                    hide-details
                                    readonly>
                                       <template v-slot:append> 
                                          <v-icon v-if="emr_params.editable && booster.date_time_display" @click="clearDate(index, 'booster_data')">mdi-close</v-icon>
                                       </template>
                                 </v-text-field>
                              </template>
                              <v-date-picker 
                                    v-model="booster.date_time" 
                                    @change="changeDate(index, 'booster_data')" 
                                    :max="dateToday()" :min="patient_birthdate" 
                                    no-title>
                              </v-date-picker>
                           </v-menu>
                        </v-col>
                        <v-col cols="12" sm="2" class="align-self-end">
                           <v-autocomplete 
                              v-model="booster.dose_brand"
                              :disabled="from_migration" 
                              @change="emitData(index, 'booster_data')"
                              :items="dose_brand_list"
                              :error="booster.is_error && !booster.dose_brand"
                              clearable
                              label="Vaccine Manufacturer"
                              hide-details>
                           </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="1" class="align-self-end">
                           <v-text-field 
                              v-model="booster.batch_no"
                              :disabled="from_migration" 
                              @change="emitData(index, 'booster_data')"
                              label="Batch No" 
                              hide-details>
                           </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1" class="align-self-end">
                           <v-text-field
                              v-model="booster.lot_no"
                              :disabled="from_migration" 
                              @change="emitData(index, 'booster_data')"
                              label="Lot No" 
                              hide-details>
                           </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" class="align-self-end">
                           <v-text-field
                              v-model="booster.remarks"
                              :disabled="from_migration" 
                              @change="emitData(index, 'booster_data')"
                              label="Remarks" 
                              hide-details>
                           </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="align-self-end">
                           <v-combobox 
                              v-model="booster.vaccinator" 
                              :disabled="from_migration" 
                              @change="checkSelectedField($event, index, 'booster_data')"
                              :items="vaccinator_items" 
                              item-text="key" 
                              label="Vaccinator"
                              maxlength="50"
                              hide-details>
                                 <template v-slot:selection="{item}">
                                    {{item.vaccinator ? item.vaccinator: item}}
                                 </template>
                                 <template v-slot:item="{ item }">
                                    <v-list-item-title v-text="item.vaccinator"></v-list-item-title>
                                 </template>
                                 <template v-slot:append-outer>
                                    <v-icon v-if="tbl_items_vaccine.length == 2 && index == 0" class="px-3"></v-icon>
                                    <v-icon @click="validateVaccineRow(index, 'booster_data')"  v-else size="26">mdi-delete</v-icon>
                                 </template>
                           </v-combobox>
                        </v-col>

                     </v-row>
                  </div>
               </v-col>
            </v-row>
            
            <v-layout wrap justify-end mt-6 mb-5>
               <v-btn @click="addRecord('vaccination_data')" :disabled="disabled_btn_vaccine || from_migration" class="mt-5 white--text" color="#367c9d">Add Vaccination Record <v-icon right>mdi-plus</v-icon></v-btn>
               <v-btn @click="addRecord('booster_data')" :disabled="disable_btn_booster || from_migration" class="ml-5 mt-5 white--text" color="#367c9d">Add Booster Record<v-icon right>mdi-plus</v-icon></v-btn>
            </v-layout>
         </v-form>

         <v-dialog v-model="others_field.dialog" width="400" persistent>
            <v-card class="pa-5">
               <label class="font-weight-medium">Vaccinator</label>
               <v-text-field v-model="others_field.vaccinator" :disabled="from_migration" placeholder="Enter the vaccinator name" hide-details outlined></v-text-field>

               <v-layout justify-end wrap mt-4>
                  <v-btn @click="insertOtherField('close', others_field.type)" small>CLOSE</v-btn>
                  <v-btn @click="insertOtherField('confirm', others_field.type)" :disabled="!others_field.vaccinator" class="ml-2" color="primary" small>CONFIRM</v-btn>
               </v-layout>
            </v-card>
         </v-dialog>      

         <Alert :alert="alert" @removeVaccinationRow="removeVaccinationRow"/>
      </div>
   </div>
</template>

<script>
import Alert from '@/components/Alert.vue'

export default {
   props:["emr_params","cov_empty_fields","vaccinator_items", "patient_birthdate","from_migration"],
   components: { Alert },
   data () {
      return {
         tbl_items_vaccine: [],
         tbl_items_booster: [],
         vaccination_data: [
            {
               date_time: '',
               date_time_display:'',
               dose_brand: '',
               batch_no:'',
               lot_no:'',
               vaccinator:'',
               is_error: false,
               is_edited: false,
               number_of_vaccination:  '1',
               vaccination_type: 'REGULAR'
            }
         ],

         booster_data: [],

         others_field: {
            dialog: false,
            index: '',
            vaccinator: '',
            type: '',
         },

         cov_status: true,
         covid_status: true,
         loading_data: false,
         
         dose_brand_list: [
            'BIONTECH, PFIZER',
            'CONVIDECIA (CANSINO BIOLOGICS)',
            'COVAXIN (BHARAT BIOTECH)',
            'EPIVACCORONA (VECTOR INSTITUTE)',
            'JANSSEN COVID-19 VACCINE (JOHNSON & JOHNSON)',
            'MODERNA COVID-19 VACCINE (SPIKE VAX)',
            'NOVAVAX',
            'OTHER TYPE OF VACCINE',
            'OXFORD-ASTRAZENECA COVID-19 VACCINE',
            'PFIZER-BION-TECH COVID-19 VACCINE',
            'SINOPHARM (BBIBP-CORV / WIBP-CORV)',
            'SINOVAC (CORONAVAC)',
            'SPUTNIK LIGHT',
            'SPUTNIK V COVID-19 VACCINE',
         ],

         is_dose_brand_janssen: false,

         alert: {},
      }
   },

   mounted() {
      this.getVaccinationRecord();
   },

   computed: {
      disabled_btn_vaccine() {
         if (this.tbl_items_vaccine.length === 2 || this.vaccination_data.length === 2) { 
            return true
         } else if(this.tbl_items_vaccine.length == 1) {
            return true
         } else if (this.vaccination_data && this.vaccination_data[0].dose_brand === 'JANSSEN COVID-19 VACCINE (JOHNSON & JOHNSON)') {
            return true
         }
         return false
      },

     
      disable_btn_booster() {
         if (this.tbl_items_vaccine.length == 2) {
            return false
         } else if (this.tbl_items_vaccine.length == 1 && this.vaccination_data.every(item => item.dose_brand)){
            return false
         } else if (this.vaccination_data.length == 2 && this.vaccination_data.every(item => item.dose_brand)) {
            return false
         } else if (this.vaccination_data && this.vaccination_data[0].dose_brand === 'JANSSEN COVID-19 VACCINE (JOHNSON & JOHNSON)') {
            return false
         }
         return true
      },
   },

   watch: {
      tbl_items_vaccine () {
         if (this.tbl_items_vaccine.length > 0) {
            if (this.tbl_items_vaccine.length == 2) {
               return this.vaccination_data = []
            } else  {
               if (this.tbl_items_vaccine[0].dose_brand === 'JANSSEN COVID-19 VACCINE (JOHNSON & JOHNSON)') {
                  return this.vaccination_data = []
               } 

               return this.vaccination_data.map(items => {
                  items.number_of_vaccination = this.getNumOfVaccine('vaccination_data')
                  return items
               })
            } 
         }
      },

      tbl_items_booster () {
         if (this.tbl_items_booster.length > 0 || this.tbl_items_vaccine.length === 2 || (this.tbl_items_vaccine.length === 1 && this.tbl_items_vaccine[0].dose_brand === 'JANSSEN COVID-19 VACCINE (JOHNSON & JOHNSON)')) {
            this.booster_data.push({
               date_time: '',
               date_time_display:'',
               dose_brand: '',
               is_error: false,
               is_edited: false,
               number_of_vaccination: this.getNumOfVaccine('booster_data'),
               vaccination_type: 'BOOSTER'
            })
         }
      }
   },

   methods: {
      async getVaccinationRecord() {
         //GET THE COVID VACCINE IN VACCINATION RECORD AND DISPLAY IN COVID VACCINATION RECORD
         let vaccination_items = this.getDataInStorage('lsfk4iofd', 'EMX246');
         
         let covid_vaccines = vaccination_items.tbl_items
            .filter(item => item.vaccine.includes("COVID-19"))
            .map(item => {
               return {
                  com_disease_vaccination_record_id: "N/A",
                  transaction_number: "N/A",
                  disease: "COVID",
                  dose_brand: "",
                  number_of_vaccination: "N/A",
                  date_time: "",
                  vaccine_manufacturer: null,
                  batch_no: "",
                  lot_no: null,
                  vaccinator: null,
                  is_pending: "0",
                  prv_name: this.$store.state.prv_data.provider_name,
                  provider_code: this.$store.state.prv_data.provider_code,
                  provider_tin: null,
                  doctor_tin: null,
                  doctor_code: null,
                  doctor_name: null,
                  specialization: null,
                  vaccination_type: "",
                  remarks: item.vaccine
               };
            });

         let vaccination_display_data = sessionStorage.getItem('GHFXxd9ghcCCy') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('GHFXxd9ghcCCy'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true
         }

         if(vaccination_display_data.fresh_load){
            let response = await this.$services.getMemberVaccinationRecord({ ek_lgu_id: this.emr_params.ek_lgu_id })
            
            if (response.status === 200) {
               response.data = this.responseDataDecryption(response.data)
               if (response.data.has_data) {
                  this.tbl_items_vaccine = response.data.vaccination_record.filter(items => items.vaccination_type === 'REGULAR')
                  this.tbl_items_booster = response.data.vaccination_record.filter(items => items.vaccination_type === 'BOOSTER')

                  vaccination_display_data.fresh_load = false
                  vaccination_display_data.vaccine = [...this.tbl_items_vaccine, ...covid_vaccines]
                  vaccination_display_data.booster = this.tbl_items_booster

                  this.tbl_items_vaccine = vaccination_display_data.vaccine

                } else {
                  vaccination_display_data.vaccine = [...covid_vaccines]
                  vaccination_display_data.fresh_load = false

                  this.tbl_items_vaccine = vaccination_display_data.vaccine
               }
               this.loading_data = false

               sessionStorage.setItem('GHFXxd9ghcCCy', this.$crypto.AES.encrypt(JSON.stringify(vaccination_display_data), 'EMX246'))
            } else {
               this.alert = response.error
            }
         }else{
            this.loading_data = false
            if (vaccination_display_data?.vaccine) this.tbl_items_vaccine = vaccination_display_data?.vaccine
            if (vaccination_display_data?.booster) this.tbl_items_booster = vaccination_display_data?.booster
         }
      },

      changeDate(index,type) {
         this[type][index].date_time_display = this.$moment(this[type][index].date_time).format('MM-DD-YYYY')
         this.emitData(index, type)
      },

      addRecord(type) {
         this[type].push(
           {
               date_time: '',
               date_time_display:'',
               dose_brand: '',
               is_error: false,
               is_edited: false,
               number_of_vaccination: this.getNumOfVaccine(type),
               vaccination_type: type == 'vaccination_data' ? 'REGULAR' : 'BOOSTER'
            }
         )
      },

      getNumOfVaccine(type) {
         if (type === 'vaccination_data') {
            return 2
         } else {
            if (this.tbl_items_booster.length > 0 && this.booster_data.length == 0) {
               return Number((this.tbl_items_booster[this.tbl_items_booster.length - 1].number_of_vaccination)) + 1
            } else {
               if (this.booster_data.length == 0) {
                  return 1
               } else {
                  return Number((this.booster_data[this.booster_data.length -1].number_of_vaccination)) + 1 
               }
            }
         }
      },

      // CHECK SELECTED FIELD
      checkSelectedField(event, index, type){
         if(event){
            if(event === 'Others' || event.vaccinator === 'Others'){
               this.others_field.index = index
               this.others_field.dialog = true
               this.others_field.type = type
               this[type][index].vaccinator = event.vaccinator ? event.vaccinator : event
            }
            this.emitData(index, type);
         }
      },

      // INSERT OTHER FIELDS
      insertOtherField(status,type){
         if(status === 'confirm'){
            this[type][this.others_field.index].vaccinator = this.others_field.vaccinator
         }else{
            this[type][this.others_field.index].vaccinator = ''
               
         }
         this.others_field.dialog = false
         this.others_field.vaccinator = ''
         this.others_field.type = ''
      },
 
      clearDate(index, type) {
         this[type][index].date_time = '',
         this[type][index].date_time_display = ''
         this.emitData(index, type)
      },

      validateVaccineRow(index, type) {
         const data_prameter = {index, type}
         if (type === 'vaccination_data') {
            if (this.booster_data.length > 0 && this.booster_data.some((item) => (item.date_time || item.dose_brand))) {
              return  this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-help-circle', color: 'primary', title: 'All succeeding data will be deleted', body: 'Do you want to continue?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'removeVaccinationRow', btn_pry_params: data_prameter ,btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
            } else {
              return this.removeVaccinationRow(data_prameter)
            }
         }

         if (type === 'booster_data') {
            if (index < this.booster_data.length -1 && this.booster_data.some((item) => (item.date_time || item.dose_brand))) {
               return  this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-help-circle', color: 'primary', title: 'All succeeding data will be deleted', body: 'Do you want to continue?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'removeVaccinationRow', btn_pry_params: data_prameter ,btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
            } else {
               return this.removeVaccinationRow(data_prameter)
            }
         }
      },

      removeVaccinationRow(data) {
         const {index, type} = data

         if (type == 'vaccination_data') {
            this.vaccination_data.splice(index, 1)
            if (this.booster_data.length > 0) this.booster_data = []
   
         } else {
            this.booster_data.splice(index)
         }
         this.emitData()
      },

      validateVaccineBrand(data, index) {
         if(data.number_of_vaccination === '1' && data.dose_brand === 'JANSSEN COVID-19 VACCINE (JOHNSON & JOHNSON)') {
            this.vaccination_data.splice(1)
            this.is_dose_brand_janssen = true
            this.emitData(index, 'vaccination_data')
            return 
         }

         if (this.is_dose_brand_janssen) {
            this.is_dose_brand_janssen = false
            this.booster_data = []
         }

         this.emitData(index, 'vaccination_data')
         return
      },

      emitData(index, type) {
         if (index !== undefined && type) {
            this[type][index].is_edited = true

            this[type].map(item => {
               item.batch_no =  item.batch_no ? item.batch_no.trim() : ''
               item.lot_no = item.lot_no ? item.lot_no.trim() : ''
               item.dose_brand = item.dose_brand ? item.dose_brand.trim() : ''
               
               if (item.vaccinator) {
                  item.vaccinator = typeof item.vaccinator === 'object' ? item.vaccinator.vaccinator.trim() : item.vaccinator.trim()
               } else {
                  item.vaccinator = ''
               }
               
               return item
            })
         }
      
         if(this.cov_empty_fields) {
            const vaccine_has_empty = this.vaccination_data.filter(items => items.is_edited).some(data => !data.date_time_display || !data.dose_brand)
            const booster_has_empty = this.booster_data.filter(items => items.is_edited).some(data => !data.date_time_display || !data.dose_brand )

            if (!vaccine_has_empty && !booster_has_empty) {
                this.$emit('noEmptyFields');
            }
         }
     
         const data = {
            vaccination_data: this.vaccination_data,
            booster_data: this.booster_data,
         }

         this.$emit('mutationStatus', 'cov', data)
      }
   }
}
</script>

<style scoped>
.table{
  text-align: center;
  width: 100%;
  border:1px solid #01579b
}
thead .tbl-row {
   background-color: #01579b !important;
   border-color: #01579b !important;
   color: white !important;
   
   font-size: 0.875rem !important;
   font-weight: 400;
   letter-spacing: 0.0178571429em !important;
   line-height: 1.25rem;
   font-family: "Roboto", sans-serif !important;
}
td{
  border: 1px solid #bdbdbd !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.0178571429em !important;
  line-height: 1.25rem;
  font-family: "Roboto", sans-serif !important;
  padding-top: 20px !important;
  padding-bottom: 20px !important;
  padding-left: 12px !important;
  padding-right: 12px !important;
  width: 10%;
}
</style>