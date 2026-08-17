<template>
  <v-container fluid px-6>
    <Navbar  :navbar="navbar" />

    <Header
        :header_title="header_title"
        :search_tbl="search_tbl"
        :start_date="start_date"
        :end_date="end_date"
        :key="search_reset_key"
        :loading_tbl="loading_tbl"
        @resetTable="resetTable"
        @updateStartDate="updateStartDate"
        @updateEndDate="updateEndDate"
        @updateSearch="updateSearch"
        @addNatality="addNatality"
        :is_natality="true"
    />

    <!-- TABLE FOR MORTALITY -->
    <v-data-table :headers="headers" :items="filtered_items" :sort-by.sync="sort_by" :sort-desc.sync="sort_desc" :loading="loading_tbl" :mobile-breakpoint="0" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-2 mb-5">
        <template v-slot:item="{ item }">
            <tr>
                <td>{{ item.date_created}}</td>
                <td>{{ item.first_name + " " + item.middle_name + " " + item.last_name}}</td>
                <td>{{ item.weight }}</td>
                <td>{{ item.gender}} </td>
                <td>{{ item.delivery_method}} </td>
                <td>{{ item.attended_by}} </td>
                <td>{{ item.delivery_outcome}} </td>
                <td>{{ item.type_of_facility}} </td>
                <td> {{ item.mother_first_name + " " + item.mother_middle_name + " " + item.mother_last_name }} </td>
                <td>{{ item.home_bldg_no + ' ' + item.home_street + ' ' + item.home_municipality + ' ' + item.home_province + ' ' + item.home_zip_code}}</td>
                <td>{{ item.delivery_bldg_no + ' ' + item.delivery_street + ' ' + item.delivery_municipality + ' ' + item.delivery_province + ' ' + item.delivery_zip_code}}</td>
            </tr>
        </template>
    </v-data-table>

    <v-dialog v-model="show_natality" width="800" persistent> 
        <v-card>
          <v-card-title class="body-1 primary white--text">
                <v-spacer></v-spacer><v-icon color="white" left>mdi-plus</v-icon>ADD NATALITY<v-spacer></v-spacer>
          </v-card-title>

          <v-form ref="validation_form" class="pa-7">
            <v-row dense>
                <v-col cols="12" sm="12" md="12" lg="12"> 
                    <h5 class="font-weight-bold" > Details </h5>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular"> First Name <span class="red--text"> *</span></h5>
                    <v-text-field v-model="first_name" @input="first_name = textCapitalize($event)" :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Middle Name </h5>
                    <v-text-field v-model="middle_name" @input="middle_name = textCapitalize($event)" class="body-2" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Last Name <span class="red--text"> *</span></h5>
                    <v-text-field v-model="last_name" @input="last_name = textCapitalize($event)" :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Suffix Name </h5>
                    <v-select v-model="suffix" :items="['JR', 'SR', 'I', 'II', 'III', 'IV', 'V', 'VI']" dense clearable> </v-select>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Gender <span class="red--text"> *</span></h5>
                    <v-select v-model="gender" :items="['MALE', 'FEMALE']" :rules="empty_validation" class="body-2" dense> </v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Birth Weight (kg) </h5>
                    <v-text-field v-model="weight" @keypress="numberOnlyWithDeci($event, weight)" class="body-2" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Length (cm) </h5>
                    <v-text-field v-model="length" class="body-2" @keypress="numberOnly" maxlength="5" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Head Circumference (cm)</h5>
                    <v-text-field v-model="head_circumference" class="body-2" @keypress="numberOnly" maxlength="5" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Date of Delivery <span class="red--text"> *</span></h5>
                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="date_of_delivery" v-mask="birthdate_mask" placeholder="YYYY-MM-DD" :rules="empty_validation" class="body-2" readonly dense></v-text-field>
                        </template>

                        <v-date-picker v-model="date_of_delivery_picker" :max="max_date" @change="date_of_delivery = newFormatDate(date_of_delivery_picker)" no-title></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="12" md="12" lg="12"> 
                    <h5 class="font-bold" > Method of Delivery <span class="red--text"> *</span></h5>
                    <v-select v-model="method_of_delivery" :items="delivery_method_item" ref="selectedDeliveryMethod" @change="selectDeliveryMethod"  :rules="empty_validation" class="body-2 my-1"  placeholder="Select for method of delivery" hide-no-data hide-details return-object outlined dense></v-select>
                </v-col> 
              
                <v-col cols="12" sm="4" md="4">
                    <h5 class="font-bold">Attended By <span class="red--text"> *</span></h5>
                    <v-select v-model="attended_by" :items="attend_by_item" ref="selectedAttendByMethod"  @change="selectAttendByMethod"  :rules="empty_validation" class="body-2 my-1"  placeholder="Select for attend by" hide-no-data hide-details return-object outlined dense></v-select>
                </v-col>

                <v-col cols="12" sm="4" md="4">
                    <h5 class="font-bold">Delivery Outcome <span class="red--text"> *</span></h5>
                    <v-select v-model="delivery_outcome" :items="delivery_outcome_item" :rules="empty_validation" class="body-2 my-1"  placeholder="Select for delivery outcome" hide-no-data hide-details return-object outlined dense></v-select>
                </v-col>

                <v-col cols="12" sm="4" md="4">
                    <h5 class="font-bold">Type of Facility <span class="red--text"> *</span></h5>
                    <v-select v-model="type_of_facility" :items="facility_item" :rules="empty_validation" class="body-2 my-1"  placeholder="Select for facility" hide-no-data hide-details return-object outlined dense></v-select>
                </v-col>

                <v-col cols="6" sm="6" md="4">
                    <h5 class="font-bold">Live Birth <span class="red--text"> *</span></h5>

                    <v-radio-group v-model="is_live_birth" :rules="empty_validation" row hide-details>
                        <v-radio label="Yes" value="1"></v-radio>
                        <v-radio label="No" value="0"></v-radio>
                    </v-radio-group>
                </v-col>

                <v-col cols="6" sm="6" md="4">
                    <h5 class="font-bold">Abortion/Miscarriage</h5>

                    <v-radio-group v-model="is_abortion_or_miscarriage" row hide-details dense >
                        <v-radio label="Yes" value="1"></v-radio>
                        <v-radio label="No" value="0"></v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="12" md="12" lg="12"> 
                    <h5 class="font-bold"> Place of Delivery </h5>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="6"> 
                    <h5 class="font-weight-regular" > Hospital/Clinic/Institution <span class="red--text"> *</span></h5>
                    <v-text-field v-model="place_of_delivery.hospital" @input="place_of_delivery.hospital = textCapitalize($event)" :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Bldg No. <span class="red--text"> *</span></h5>
                    <v-text-field v-model="place_of_delivery.bldg_no" @input="place_of_delivery.bldg_no = textCapitalize($event)" :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Street <span class="red--text"> *</span></h5>
                    <v-text-field v-model="place_of_delivery.street" @input="place_of_delivery.street = textCapitalize($event)" :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3">
                    <h5 class="font-weight-regular">Region</h5>
                    <v-select  v-model="place_of_delivery.region"  @keydown.enter.prevent  @change="getPlaceProvinceList('from_selection')" :items="place_of_delivery_region_list"  class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3">
                    <h5 class="font-weight-regular">Province</h5>
                    <v-select v-model="place_of_delivery.province" @keydown.enter.prevent @change="getPlaceMunicipalityList(province_array,'from_selection')" :items="place_of_delivery_province_list"  :disabled = "disabled_place_of_delivery_province" class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3">
                    <h5 class="font-weight-regular">Municipality</h5>
                    <v-select v-model="place_of_delivery.municipality" @keydown.enter.prevent @change="getPlaceBarangayList(municipality_array,'from_selection')" :items="place_of_delivery_municipality_list" :disabled = "disabled_place_of_delivery_municipality"  class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3">
                    <h5 class="font-weight-regular">Barangay</h5>
                    <v-select v-model="place_of_delivery.brgy" @keydown.enter.prevent  :items="place_of_delivery_barangay_list" :disabled = "disabled_place_of_delivery_barangay"  class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Zip Code <span class="red--text"> *</span></h5>
                    <v-text-field v-model="place_of_delivery.zip_code" @keypress="numberOnly" :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="12" md="12" lg="12"> 
                    <h5 class="font-weight-bold" > Details of mother </h5>
                </v-col>

                <v-col cols="12" sm="6" md="3" lg="3"> 
                    <h5 class="font-weight-regular"> First Name <span class="red--text"> *</span></h5>
                    <v-text-field v-model="mother.first_name" @input="mother.first_name = textCapitalize($event)" :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="3" lg="3"> 
                    <h5 class="font-weight-regular" > Middle Name </h5>
                    <v-text-field v-model="mother.middle_name" @input="mother.middle_name = textCapitalize($event)" class="body-2" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="3" lg="3"> 
                    <h5 class="font-weight-regular" > Last Name <span class="red--text"> *</span></h5>
                    <v-text-field v-model="mother.last_name" @input="mother.last_name = textCapitalize($event)" :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6" md="3" lg="3"> 
                    <h5 class="font-weight-regular" > Date of birth <span class="red--text"> *</span></h5>
                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="mother.date_of_birth" v-mask="birthdate_mask" placeholder="YYYY-MM-DD" :rules="empty_validation" class="body-2" readonly dense></v-text-field>
                        </template>

                        <v-date-picker v-model="birthdate_picker" :max="max_date" @change="mother.date_of_birth = newFormatDate(birthdate_picker)" no-title></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" sm="6" md="3" lg="3"> 
                    <h5 class="font-weight-regular" > Age at the time of delivery <span class="red--text"> *</span></h5>
                    <v-text-field v-model="age_of_delivery" :value="age_of_delivery = mother.date_of_birth && date_of_delivery ? date_of_delivery.slice(0, 4) - mother.date_of_birth.slice(0, 4) : ''" disabled :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="12" md="12" lg="12"> 
                    <h5 class="font-bold"> Residential Address </h5>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Bldg No. <span class="red--text"> *</span></h5>
                    <v-text-field v-model="residents.bldg_no" @input="residents.bldg_no = textCapitalize($event)" :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Street <span class="red--text"> *</span></h5>
                    <v-text-field v-model="residents.street" @input="residents.street = textCapitalize($event)" :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3">
                    <h5 class="font-weight-regular">Region</h5>
                    <v-select  v-model="residents.region"  @keydown.enter.prevent  @change="getProvinceList('from_selection')" :items="residential_region_list"  class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3">
                    <h5 class="font-weight-regular">Province</h5>
                    <v-select v-model="residents.province" @keydown.enter.prevent @change="getMunicipalityList(province_array,'from_selection')" :items="residential_province_list"  :disabled = "disabled_residential_province" class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3">
                    <h5 class="font-weight-regular">Municipality</h5>
                    <v-select v-model="residents.municipality" @keydown.enter.prevent @change="getBarangayList(municipality_array,'from_selection')" :items="residential_municipality_list" :disabled = "disabled_residential_municipality"  class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="6" sm="6" md="6" lg="3">
                    <h5 class="font-weight-regular">Barangay</h5>
                    <v-select v-model="residents.brgy" @keydown.enter.prevent  :items="residential_barangay_list" :disabled = "disabled_residential_barangay"  class="body-2" dense clearable></v-select>
                </v-col>
                
                <v-col cols="6" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Zip Code <span class="red--text"> *</span></h5>
                    <v-text-field v-model="residents.zip_code" @keypress="numberOnly" :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>
            </v-row>
          </v-form>

            <v-card-actions class="d-flex justify-center">
                <div class="mb-5">
                <v-btn @click="submitNatality" :loading="loading_btn" class="primary mx-2"> SUBMIT </v-btn>
                <v-btn @click="show_natality = false, clearForm()" class="mx-2"> CLOSE </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
    
    <v-dialog v-model="show_delivery_method" width="400" persistent>
        <v-card class="pa-5">
            <h5 class="font-weight-regular body-2">Others</h5>
            <v-text-field v-if="attended_by === 'OTHERS'" v-model="attend_by_others" @input="attend_by_others = textCapitalize($event)" maxlength="20" :placeholder="'Enter other attended by (Max 20 characters)'" hide-details outlined></v-text-field>
            <v-text-field v-else-if="method_of_delivery === 'OTHERS'" v-model="others_delivery_method" @input="others_delivery_method = textCapitalize($event)" :placeholder="'Enter other delivery method'" hide-details outlined></v-text-field>

            <v-layout justify-end wrap mt-4>
                <v-btn @click="show_delivery_method = false" small>CLOSE</v-btn>
                <v-btn @click="saveOtherDeliveryMethod" :disabled="!(attended_by === 'OTHERS' ? attend_by_others : others_delivery_method)" class="ml-2" color="primary" small>CONFIRM</v-btn>
            </v-layout>
        </v-card>
    </v-dialog>

    <Alert :alert="alert" />
  </v-container>
</template>

<script>
import { mask } from "vue-the-mask"
import Alert from '@/components/Alert.vue'
import Navbar from '@/components/Navbar.vue'
import phil_address from '@/reference/philippines-address.json'
import Header from '@/components/emr/header/Header.vue'

export default {
    directives: { mask },

    components: {
        Navbar,
        Alert,
        Header
    },

    data() {
        return {
            header_title:"Natality",
            search_tbl: '',
            search_reset_key: 0,
            start_date: '',
            end_date: '',

            natality_item: [],
            loading_tbl: false,
            loading_btn: false,

            show_natality: false,
            show_delivery_method: false,

            date_of_delivery_picker: '',
            birthdate_mask: '####-##-##',
            birthdate_picker: '',
            max_date: this.$moment().format('YYYY-MM-DD'),

            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            gender: '',
            weight: '',
            length: '',
            head_circumference: '',
            method_of_delivery: '',
            is_abortion_or_miscarriage: '',
            is_live_birth: '',
            attended_by: '',
            delivery_outcome: '',
            type_of_facility: '',
            date_of_delivery: '',
            mother: {
                first_name: '',
                middle_name: '',
                last_name: '',
                date_of_birth: '',
                prenatal_check_up: '',
                age_of_delivery: '',
            },

            residents: {
                bldg_no: '',
                street: '',
                brgy: '',
                municipality: '',
                province: '',
                region: '',
                zip_code: '',
            },
            
            place_of_delivery_region_list: [],
            place_of_delivery_province_list: [],
            place_of_delivery_municipality_list: [],
            place_of_delivery_barangay_list: [],

            residential_region_list: [],
            residential_province_list: [],
            residential_municipality_list: [],
            residential_barangay_list: [],

            province_array: [],
            municipality_array: [],

            place_of_delivery: {
                hospital: '',
                bldg_no: '',
                street: '',
                brgy: '',
                municipality: '',
                province: '',
                zip_code: ''
            },
            
            empty_validation: [
                v => !!v && !/^ *$/.test(v) || 'Required Field',
            ],

            delivery_method_item: ['Normal Spontaneous Delivery', 'Cesarean Section'].map(this.textCapitalize),
            attend_by_item: ['Doctor', 'Nurse', 'Midwives', 'Hilot/TBA', 'Others'].map(this.textCapitalize),
            delivery_outcome_item: ['Full-term', 'Pre-term', 'Fetal Death'].map(this.textCapitalize),
            facility_item: ['Public', 'Private', 'Non-Facility Based'].map(this.textCapitalize),

            headers:[
                { text: 'Date Created', value: 'date_created', width:"230px", sortable: false, align:'center'},
                { text: 'Name', value: 'first_name', width:'350px', sortable: false, align:'center'},
                { text: 'Weight', value: 'weight', width:'120px', sortable: false, align:'center'},
                { text: 'Gender', value: 'gender', width:'120px', sortable: false, align:'center'},
                { text: 'Delivery Method', value: 'delivery_method', width:'230px', sortable: false, align:'center'},
                { text: 'Attended By', value: 'attended_by', width:'120px', sortable: false, align:'center'},
                { text: 'Delivery Outcome', value: 'delivery_outcome', width:'120px', sortable: false, align:'center'},
                { text: 'Type of Facility', value: 'type_of_facility', width:'230px', sortable: false, align:'center'},
                { text: "Mother's name", value: 'mother', width:'350px', sortable: false, align:'center'},
                { text: 'Home Address', value: 'home_address', width:'350px', sortable: false, align:'center'},
                { text: 'Delivery Address', value: 'delivery_address', width:'350px', sortable: false, align:'center'}
            ],

            sort_by: 'date_created',
            sort_desc: true,

            alert: {},
            navbar: [
                { title: "Child Care and Services", link: "/child-care-and-services", icon: "fas fa-folder" },
                { title: "Mortality", link: "/mortality", icon: "fas fa-folder" },
                { title: "Natality", link: "/natality", icon: "fas fa-folder" },
                { title: "EHSS", link: "/ehss", icon: "fas fa-folder" },
                { title: "Home", link: "/code-scanning", icon: "fas fa-home" },
            ],

            others_delivery_method: '',
            attend_by_others: '',

            disabled_residential_province: true,
            disabled_residential_municipality: true,
            disabled_residential_barangay: true,

            disabled_place_of_delivery_province: true,
            disabled_place_of_delivery_municipality: true,
            disabled_place_of_delivery_barangay: true
        }
    },

    mounted() {
        this.getNatality()
        this.getRegionsList()
        this.getPlaceRegionsList()
    },

    computed: {
        // FORMAT THE START DATE
        start_date_format(){
        return this.formatDate(this.start_date)
        },

        // FORMAT THE END DATE
        end_date_format(){
        return this.formatDate(this.end_date)
        },

        filtered_items() {
            return this.natality_item.filter((i) => {
                let temp_name = [i.first_name,i.last_name]
                let member_name = temp_name.includes(null) ? 'N/A' : i.first_name + (i.middle_name ? ' '+ i.middle_name : '') +' '+ i.last_name + (i.suffix ? ' '+i.suffix : '')

                let searched_data = (member_name.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || (i.suffix.toString().toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || ((i.doctor_name ? i.doctor_name: '').toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || ((i.post_doctor_name ? i.post_doctor_name : '').toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || ((i.test_result ? i.test_result : '').toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1)
                let timestamp = i.date_created.substring(0, 10)
                
                let search = this.search_tbl ? searched_data : true
                let date = this.start_date && this.end_date ? timestamp >= this.start_date && timestamp <= this.end_date : true

                return search && date 
            })    
        }
    },

    methods: {
        //SHOW DIALOG BOX FOR INPUT FIELDS IN MORTALITY
        addNatality() {
            this.show_natality = true
        },

        //GET THE DATA OF ALL NATALITY
        getNatality() {
            this.show_natality = false
            this.loading_tbl = true
            
            return this.$services.getM1DisplayList({
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: 'natality',
            })
            .then((response) => {
                 this.loading_tbl = false
                response.data = this.responseDataDecryption(response.data)
                this.natality_item = response.data
            }).catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            });
        },

        async submitNatality() {
            if(this.$refs.validation_form.validate()) {
                this.show_mortality = true
                this.loading_btn = true

                let response = await this.$services.trnAddM1Natality({
                    provider_code: this.$store.state.prv_data.provider_code,
                    first_name: this.first_name,
                    middle_name: this.middle_name,
                    last_name: this.last_name,
                    suffix: this.suffix,
                    gender: this.gender,
                    weight: this.weight,
                    length: this.length,
                    head_circumference: this.head_circumference,
                    delivery_date: this.date_of_delivery,
                    delivery_method: this.$refs.selectedDeliveryMethod.selectedItems[0],
                    delivery_place: this.place_of_delivery.hospital, 
                    delivery_bldg_no: this.place_of_delivery.bldg_no,
                    delivery_street: this.place_of_delivery.street,
                    delivery_brgy: this.place_of_delivery.brgy,
                    delivery_municipality: this.place_of_delivery.municipality,
                    delivery_province: this.place_of_delivery.province, 
                    delivery_zip_code: this.place_of_delivery.zip_code,
                    mother_first_name: this.mother.first_name,
                    mother_middle_name: this.mother.middle_name,
                    mother_last_name: this.mother.last_name,
                    mother_birthdate: this.mother.date_of_birth,
                    mother_age_delivery: this.age_of_delivery,
                    home_bldg_no: this.residents.bldg_no,
                    home_street: this.residents.street,
                    home_brgy: this.residents.brgy,
                    home_municipality: this.residents.municipality,
                    home_province: this.residents.province,
                    home_region: this.residents.region,
                    home_zip_code: this.residents.zip_code,
                    prenatal_check_up: this.mother.prenatal_check_up,
                    attended_by: this.$refs.selectedAttendByMethod.selectedItems[0],
                    delivery_outcome: this.delivery_outcome,
                    type_of_facility: this.type_of_facility,
                    created_by: this.$store.state.usr_credentials.user_name,
                    is_live_birth: this.is_live_birth,
                    is_abortion_or_miscarriage: this.is_abortion_or_miscarriage
                })

                if(response.status === 200) {
                    this.loading_btn = false
                    this.show_natality = true
                    //response.data = this.responseDataDecryption(response.data)
                    
                    if(response.data.success) {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-check-circle', color: 'success', title: 'Natality', body: 'Submitted Successfully', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
                        this.clearForm()
                        this.getNatality()
                    } else {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'yellow', title: 'Natality', body: 'Data already been submitted', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
                    }
                } else {
                    this.alert = response.erorr
                }
            }
        },

        clearForm() {
            this.$refs.validation_form.reset()
        },

        selectDeliveryMethod() {
            if (this.method_of_delivery === 'OTHERS') {
                this.show_delivery_method = true;
                this.attended_by = 'OTHERS';
            }
        },

        selectAttendByMethod() {
            if (this.attended_by === 'OTHERS') {
                this.show_delivery_method = true;
            } else {
                this.attend_by_others = '';
            }
        },

        saveOtherDeliveryMethod() {
            this.show_delivery_method = false
            this.$refs.selectedDeliveryMethod.selectedItems[0] = this.others_delivery_method
            this.$refs.selectedAttendByMethod.selectedItems[0] = this.attend_by_others
        },

        getRegionsList() {
            for (const regions_key in phil_address) {
                this.residential_region_list.push(phil_address[regions_key].region_name);
            }
            // CHANGE NCR POSITION
            this.residential_region_list.unshift(this.residential_region_list.pop());
            },

        getProvinceList(type) {
            if(this.residents.region !== null){
                this.disabled_residential_province = false
            }
            else{
                this.disabled_residential_province = true
                this.disabled_residential_municipality = true
                this.disabled_residential_barangay = true
            }
            this.residential_province_list = [];
            this.province_array = [];

            if (this.residents.province && type === 'from_selection') {
                this.residents.province = this.residents.municipality = this.residents.brgy = this.residents.bldg_no = this.residents.street = this.residents.zip_code = '';
                this.residential_province_list = this.province_array = this.residential_municipality_list = this.municipality_array = this.residential_barangay_list = [];
            }

            for (const regions_key in phil_address) {
                if (phil_address[regions_key].region_name === this.residents.region) {
                    this.residential_province_list = Object.keys(phil_address[regions_key].province_list);
                    this.province_array = phil_address[regions_key].province_list;
                }
            }
        },

        getMunicipalityList(province_array, type) {
            if(this.residents.province !== null){
                this.disabled_residential_municipality = false
            }
            else{
                this.disabled_residential_municipality = true
                this.disabled_residential_barangay = true
            }
            this.residential_municipality_list = [];
            this.municipality_array = [];

            if (this.residents.municipality && type === 'from_selection') {
                this.residents.municipality = this.residents.brgy = this.residents.bldg_no = this.residents.street = this.residents.zip_code = '';
                this.residential_municipality_list = this.municipality_array = this.residential_barangay_list = [];
            }

            const get_municipality = Object.keys(province_array)
                .filter((item) => item === this.residents.province)
                .reduce((obj, key) => province_array[key], {});

            for (const municipal in get_municipality) {
                this.residential_municipality_list = Object.keys(get_municipality[municipal]);
                this.municipality_array = get_municipality[municipal];
            }
        },

        getBarangayList(municipality_array, type) {
            if(this.residents.municipality !== null){
                this.disabled_residential_barangay = false
            }
            else{
                this.disabled_residential_barangay = true
            }
            this.residential_barangay_list = [];

            if (this.residents.brgy && type === 'from_selection') {
                this.residents.brgy = this.residents.bldg_no = this.residents.street = this.residents.zip_code = '';
                this.residential_barangay_list = [];
            }

            const get_barangay = Object.keys(municipality_array)
                .filter((item) => item === this.residents.municipality)
                .reduce((obj, key) => municipality_array[key], {});

            for (const barangay in get_barangay) {
                this.residential_barangay_list = get_barangay[barangay];
            }
        },

        getPlaceRegionsList() {
            for (const regions_key in phil_address) {
                this.place_of_delivery_region_list.push(phil_address[regions_key].region_name);
            }
            // CHANGE NCR POSITION
            this.place_of_delivery_region_list.unshift(this.place_of_delivery_region_list.pop());
            },

        getPlaceProvinceList(type) {
            if(this.place_of_delivery.region !== null){
                this.disabled_place_of_delivery_province = false
            }
            else{
                this.disabled_place_of_delivery_province = true
                this.disabled_place_of_delivery_municipality = true
                this.disabled_place_of_delivery_barangay = true
            }
            this.place_of_delivery_province_list = [];
            this.province_array = [];

            if (this.place_of_delivery.province && type === 'from_selection') {
                this.place_of_delivery.province = this.place_of_delivery.municipality = this.place_of_delivery.brgy = this.place_of_delivery.bldg_no = this.place_of_delivery.street = this.place_of_delivery.zip_code = '';
                this.place_of_delivery_province_list = this.province_array = this.place_of_delivery_municipality_list = this.municipality_array = this.place_of_delivery_barangay_list = [];
            }

            for (const regions_key in phil_address) {
                if (phil_address[regions_key].region_name === this.place_of_delivery.region) {
                    this.place_of_delivery_province_list = Object.keys(phil_address[regions_key].province_list);
                    this.province_array = phil_address[regions_key].province_list;
                }
            }
        },

        getPlaceMunicipalityList(province_array, type) {
            if(this.place_of_delivery.province !== null){
                this.disabled_place_of_delivery_municipality = false
            }
            else{
                this.disabled_place_of_delivery_municipality = true
                this.disabled_place_of_delivery_barangay = true
            }
            this.place_of_delivery_municipality_list = [];
            this.municipality_array = [];

            if (this.place_of_delivery.municipality && type === 'from_selection') {
                this.place_of_delivery.municipality = this.place_of_delivery.brgy = this.place_of_delivery.bldg_no = this.place_of_delivery.street = this.place_of_delivery.zip_code = '';
                this.place_of_delivery_municipality_list = this.municipality_array = this.place_of_delivery_barangay_list = [];
            }

            const get_municipality = Object.keys(province_array)
                .filter((item) => item === this.place_of_delivery.province)
                .reduce((obj, key) => province_array[key], {});

            for (const municipal in get_municipality) {
                this.place_of_delivery_municipality_list = Object.keys(get_municipality[municipal]);
                this.municipality_array = get_municipality[municipal];
            }
        },

        getPlaceBarangayList(municipality_array, type) {
            if(this.place_of_delivery.municipality !== null){
                this.disabled_place_of_delivery_barangay = false
            }
            else{
                this.disabled_place_of_delivery_barangay = true
            }
            this.place_of_delivery_barangay_list = [];

            if (this.place_of_delivery.brgy && type === 'from_selection') {
                this.place_of_delivery.brgy = this.place_of_delivery.bldg_no = this.place_of_delivery.street = this.place_of_delivery.zip_code = '';
                this.place_of_delivery_barangay_list = [];
            }

            const get_barangay = Object.keys(municipality_array)
                .filter((item) => item === this.place_of_delivery.municipality)
                .reduce((obj, key) => municipality_array[key], {});

            for (const barangay in get_barangay) {
                this.place_of_delivery_barangay_list = get_barangay[barangay];
            }
        },
        
        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if((event.which < 48 || event.which > 57)){
                event.preventDefault();
            }
        },

        numberOnlyWithDeci(event, value) {
            if (((event.which != 46 || (event.which == 46 && value == '')) || value.indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        },

        updateSearch(new_search) {
            this.search_tbl = new_search;
        },

        updateStartDate(new_start_date) {
            this.start_date = new_start_date;
        },

        updateEndDate(new_end_date) {
            this.end_date = new_end_date;
        },

        resetTable() {
            this.search_tbl = ''
            this.start_date = null
            this.end_date = null
            this.search_reset_key += 1
        },
    }
}
</script>

<style scoped>
::v-deep input[type="text"]:disabled{
    color: #5E5E5E !important;
    font-weight: 500 !important;
}
</style>