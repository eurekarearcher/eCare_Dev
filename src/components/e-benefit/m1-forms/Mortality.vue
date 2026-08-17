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
        @addMortality="addMortality"
        :is_mortality="true"
    />

    <!-- TABLE FOR MORTALITY -->
    <v-data-table :headers="headers" :items="filtered_items" :sort-by.sync="sort_by" :sort-desc.sync="sort_desc" :loading="loading_tbl" :mobile-breakpoint="0" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-2 mb-5">
        <template v-slot:item="{ item }">
            <tr>
                <td>{{ item.death_date + " / " + item.death_time}}</td>
                <td>{{ item.first_name + " " + item.middle_name + " " + item.last_name}}</td>
                <td>{{ item.gender}}</td>
                <td>{{ item.home_bldg_no + ' ' + item.home_street + ' ' + item.home_municipality + ' ' + item.home_province + ' ' + item.home_zip_code}}</td>
                <td>{{ item.death_cause + " / " + item.death_description }} </td>
                <td>{{ item.corpse_place + ' ' + item.death_bldg_no + ' ' + item.death_street + ' ' + item.death_municipality + ' ' + item.death_province + ' ' + item.death_zip_code}}</td>
            </tr>
        </template>
    </v-data-table>

    <v-dialog v-model="show_mortality" width="800" persistent> 
        <v-card>
          <v-card-title class="body-1 primary white--text">
                <v-spacer></v-spacer><v-icon color="white" left>mdi-plus</v-icon>ADD MORTALITY<v-spacer></v-spacer>
          </v-card-title>

          <v-form ref="validation_form" class="pa-7">
            <v-row dense>
                <v-col cols="12" sm="12" md="12" lg="12"> 
                    <h5 class="font-weight-bold" > Details </h5>
                </v-col>

                <v-col cols="12" sm="6" md="3" lg="3"> 
                    <h5 class="font-weight-regular"> First Name <span class="red--text"> *</span></h5>
                    <v-text-field v-model="first_name" :rules="empty_validation" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="3" lg="3"> 
                    <h5 class="font-weight-regular" > Middle Name </h5>
                    <v-text-field v-model="middle_name" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="3" lg="3"> 
                    <h5 class="font-weight-regular" > Last Name <span class="red--text"> *</span></h5>
                    <v-text-field v-model="last_name" :rules="empty_validation" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="3" lg="3"> 
                    <h5 class="font-weight-regular" > Suffix Name </h5>
                    <v-select v-model="suffix" :items="['Jr', 'Sr', 'I', 'II', 'III', 'IV', 'V', 'VI']" dense clearable> </v-select>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="12" sm="6" md="3" lg="3"> 
                    <h5 class="font-weight-regular" > Gender <span class="red--text"> *</span></h5>
                    <v-select v-model="gender" :items="['MALE', 'FEMALE']" :rules="empty_validation" dense> </v-select>
                </v-col>

                <v-col cols="12" sm="6" md="3" lg="3"> 
                    <h5 class="font-weight-regular" > Date of birth <span class="red--text"> *</span></h5>
                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="date_of_birth" v-mask="birthdate_mask" placeholder="YYYY-MM-DD" :rules="empty_validation" readonly dense></v-text-field>
                        </template>

                        <v-date-picker v-model="birthdate_picker" :max="max_date" @change="date_of_birth = newFormatDate(birthdate_picker)" no-title></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="12" md="12" lg="12"> 
                    <h5 class="font-bold"> Home Address </h5>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4"> 
                    <h5 class="font-weight-regular" > Bldg No. <span class="red--text"> *</span></h5>
                    <v-text-field v-model="home_address.bldg_no" :rules="empty_validation" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4"> 
                    <h5 class="font-weight-regular" > Street <span class="red--text"> *</span></h5>
                    <v-text-field v-model="home_address.street" :rules="empty_validation" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4">
                    <h5 class="font-weight-regular">Region</h5>
                    <v-select  v-model="home_address.region"  @keydown.enter.prevent  @change="getPlaceProvinceList('from_selection')" :items="home_address_region_list"  class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4">
                    <h5 class="font-weight-regular">Province</h5>
                    <v-select v-model="home_address.province" @keydown.enter.prevent @change="getPlaceMunicipalityList(province_array,'from_selection')" :items="home_address_province_list"  :disabled = "disabled_home_address_province" class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4">
                    <h5 class="font-weight-regular">Municipality</h5>
                    <v-select v-model="home_address.municipality" @keydown.enter.prevent @change="getPlaceBarangayList(municipality_array,'from_selection')" :items="home_address_municipality_list" :disabled = "disabled_home_address_municipality"  class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4">
                    <h5 class="font-weight-regular">Barangay</h5>
                    <v-select v-model="home_address.brgy" @keydown.enter.prevent  :items="home_address_barangay_list" :disabled = "disabled_home_address_barangay"  class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4"> 
                    <h5 class="font-weight-regular" > Zip Code <span class="red--text"> *</span></h5>
                    <v-text-field v-model="home_address.zip_code" @keypress="numberOnly" :rules="empty_validation" class="body-2" dense> </v-text-field>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="12" md="12" lg="12"> 
                    <h5 class="font-bold" > Cause of Death <span class="red--text"> *</span></h5>
                    <v-combobox v-model="cause_of_death" @update:search-input="searchItems($event, 'icd')" :items="$store.state.icd_list"  :loading="$store.state.loading_icd" :rules="empty_validation" class="body-2 my-1" item-text="icd_code_description" item-value="icd_code_description" prepend-inner-icon="mdi-magnify" placeholder="Search for ICD Code or Description" hide-no-data hide-details return-object outlined dense>
                        <template v-slot:item="{ attrs, on, item }">
                            <v-list-item v-bind="attrs" v-on="on">
                                <v-list-item-content>
                                    <v-list-item-title>{{ item.icd_description }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ item.icd_code }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                         <template v-slot:append-item>
                            <v-sheet class="d-flex justify-center my-4">
                                <v-btn @click="loadMore('icd')" :loading="$store.state.loading_icd" small outlined>
                                    Load More
                                </v-btn>
                            </v-sheet>
                        </template>
                    </v-combobox>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Corpse Disposal <span class="red--text"> *</span></h5>
                    <v-select v-model="corpse_disposal" :items="corpse_disposal_item" ref="selectedCorpseDisposal" @change="corpseDisposal" :rules="empty_validation" dense> </v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Mortality Category <span class="red--text"> *</span></h5>
                    <v-select v-model="mortality" :items="mortality_category" ref="selectedMortality" @change="mortalityCategory" item-text="mortality" :rules="empty_validation" dense> </v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Date of Death <span class="red--text"> *</span></h5>
                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="date_of_death" v-mask="birthdate_mask" placeholder="YYYY-MMM-DD" :rules="empty_validation" readonly dense></v-text-field>
                        </template>

                        <v-date-picker v-model="death_picker" :max="max_date" @change="date_of_death = newFormatDate(death_picker)" no-title></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Time of Death <span class="red--text"> *</span></h5>
                    <div class="d-flex justify-start align-baseline">
                        <v-text-field v-model="time_of_death.hours" dense @keypress="numberOnly" maxlength="2" :rules="empty_validation" style="width: 60px;"> </v-text-field>
                        <span class="mx-1">
                            :
                        </span>
                        <v-text-field v-model="time_of_death.minutes" dense @keypress="numberOnly" maxlength="2" :rules="empty_validation" style="width: 60px;"> </v-text-field>
                        &nbsp;
                        <v-select v-model="time_of_death.am_pm" :rules="empty_validation" :items="['AM', 'PM']" class="ml-2" dense> </v-select>
                    </div>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="12" md="12" lg="12"> 
                    <h5 class="font-bold"> Place of Death: </h5>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="6"> 
                    <h5 class="font-weight-regular" > Hospital/Clinic/Institution <span class="red--text"> *</span></h5>
                    <v-text-field v-model="place_of_death.hospital" :rules="empty_validation" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Bldg No. <span class="red--text"> *</span></h5>
                    <v-text-field v-model="place_of_death.bldg_no" :rules="empty_validation" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Street <span class="red--text"> *</span></h5>
                    <v-text-field v-model="place_of_death.street" :rules="empty_validation" dense> </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3">
                    <h5 class="font-weight-regular">Region</h5>
                    <v-select  v-model="place_of_death.region"  @keydown.enter.prevent  @change="getProvinceList('from_selection')" :items="place_of_death_region_list"  class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3">
                    <h5 class="font-weight-regular">Province</h5>
                    <v-select v-model="place_of_death.province" @keydown.enter.prevent @change="getMunicipalityList(province_array,'from_selection')" :items="place_of_death_province_list"  :disabled = "disabled_place_of_death_province" class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3">
                    <h5 class="font-weight-regular">Municipality</h5>
                    <v-select v-model="place_of_death.municipality" @keydown.enter.prevent @change="getBarangayList(municipality_array,'from_selection')" :items="place_of_death_municipality_list" :disabled = "disabled_place_of_death_municipality"  class="body-2" dense clearable></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3">
                    <h5 class="font-weight-regular">Barangay</h5>
                    <v-select v-model="place_of_death.brgy" @keydown.enter.prevent  :items="place_of_death_barangay_list" :disabled = "disabled_place_of_death_barangay"  class="body-2" dense clearable></v-select>
                </v-col>
                
                <v-col cols="12" sm="6" md="6" lg="3"> 
                    <h5 class="font-weight-regular" > Zip Code <span class="red--text"> *</span></h5>
                    <v-text-field v-model="place_of_death.zip_code" @keypress="numberOnly" :rules="empty_validation" dense> </v-text-field>
                </v-col>
            </v-row>
          </v-form>

          <v-card-actions class="d-flex justify-center">
            <div class="mb-5">
              <v-btn @click="submitMortality" :loading="loading_btn" class="primary mx-2"> SUBMIT </v-btn>
              <v-btn @click="show_mortality = false" class="mx-2"> CLOSE </v-btn>
            </div>
          </v-card-actions>
        </v-card>
    </v-dialog>
    
    <v-dialog v-model="show_corpse_disposal" width="400" persistent>
        <v-card class="pa-5">
            <h6 class="font-weight-regular body-2">Others</h6>
            <v-text-field v-model="others_corpse_disposal" placeholder="Enter other corpse disposal here" hide-details outlined></v-text-field>

            <v-layout justify-end wrap mt-4>
                <v-btn @click="show_corpse_disposal = false" small>CLOSE</v-btn>
                <v-btn @click="saveOtherCorpseDisposal" :disabled="!others_corpse_disposal" class="ml-2" color="primary" small>CONFIRM</v-btn>
            </v-layout>
        </v-card>
    </v-dialog>

    <v-dialog v-model="show_mortality_category" width="400" persistent>
        <v-card class="pa-5">
            <h6 class="font-weight-regular body-2">Others</h6>
            <v-text-field v-model="others_mortality_category" placeholder="Enter other mortality category here" hide-details outlined></v-text-field>

            <v-layout justify-end wrap mt-4>
                <v-btn @click="show_mortality_category = false" small>CLOSE</v-btn>
                <v-btn @click="saveOtherMortalityCategory" :disabled="!others_mortality_category" class="ml-2" color="primary" small>CONFIRM</v-btn>
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
            header_title: "Mortality",
            search_tbl: '',
            search_reset_key: 0,
            start_date: '',
            end_date: '',

            mortality_item: [],
            loading_tbl: false,
            loading_btn: false,

            show_mortality: false,
            current_icd: '',
            show_corpse_disposal: false,
            show_mortality_category: false,
            birthdate_picker: '',
            death_picker: '',
            birthdate_mask: '####-##-##',
            max_date: this.$moment().format('YYYY-MM-DD'),
            date_and_time: '',

            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            gender: '',
            date_of_birth: '',
            home_address: {
                bldg_no: '',
                street: '',
                brgy: '',
                municipality: '',
                province: '',
                zip_code: '',
            },
            date_of_death: '',
            time_of_death: {
                hours: '',
                minutes: '',
                am_pm: ''
            },
            cause_of_death: '',
            corpse_disposal_item: ['Burial', 'Cremation', 'Others'],
            corpse_disposal: '',
            mortality: '',
            mortality_category: ['Early Neonatal Death', 'Fetal Death', 'Infant Death', 'Maternal Death',  'Neonatal Death', 'Perinatal Death', 'Under-five Death', 'Others'],
            place_of_death: {
                hospital: '',
                bldg_no: '',
                street: '',
                brgy: '',
                municipality: '',
                province: '',
                zip_code: ''
            },

            home_address_region_list: [],
            home_address_province_list: [],
            home_address_municipality_list: [],
            home_address_barangay_list: [],

            place_of_death_region_list: [],
            place_of_death_province_list: [],
            place_of_death_municipality_list: [],
            place_of_death_barangay_list: [],

            province_array: [],
            municipality_array: [],

            empty_validation: [
                v => !!v && !/^ *$/.test(v) || 'Required Field',
            ],

            headers:[
                { text: 'Date of Death', value: 'death_date', width:"230px", sortable: false, align:'center'},
                { text: 'Name', value: 'first_name', width:'350px', sortable: false, align:'center'},
                { text: 'Gender', value: 'gender', width:'120px', sortable: false, align:'center'},
                { text: 'Home Address', value: 'place_of_death', width:'350px', sortable: false, align:'center'},
                { text: 'Cause of Death', value: 'cause_of_death', sortable: false, align:'center'},
                { text: 'Place of Death', value: 'place_of_death', width:'350px', sortable: false, align:'center'},
            ],

            sort_by: 'death_date',
            sort_desc: true,

            others_corpse_disposal: '',
            others_mortality_category: '',

            alert: {},
            navbar: [
                { title: "Child Care and Services", link: "/child-care-and-services", icon: "fas fa-folder" },
                { title: "Mortality", link: "/mortality", icon: "fas fa-folder"},
                { title: "Natality", link: "/natality", icon: "fas fa-folder" },
                { title: "EHSS", link: "/ehss", icon: "fas fa-folder" },
                { title: "Home", link: "/code-scanning", icon: "fas fa-home" },
            ],

            disabled_place_of_death_province: true,
            disabled_place_of_death_municipality: true,
            disabled_place_of_death_barangay: true,

            disabled_home_address_province: true,
            disabled_home_address_municipality: true,
            disabled_home_address_barangay: true,

            search_icd_items: '',
            icd_current_page: 1,
            icd_next_page: 0,
        }
    },

    mounted() {
        this.getMortality()
        this.getICDList()
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
            return this.mortality_item.filter((i) => {
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
        loadMore(value) {
            if (value === 'icd') {
                this.icd_current_page += 1
                this.icd_next_page = this.icd_current_page
                this.getICDList()
                this.$store.commit('set_loading_icd', true)
            }
        },

                //SEARCH ITEM FOR ICD
        searchItems(value, key) {
            clearTimeout(this.time_out) 
            if(value) {
                if (key === 'icd') {
                    this.search_icd_items = ''
                    this.time_out = setTimeout(() => {
                        this.search_icd_items = value
                        this.icd_current_page = 1
                        this.getICDList()
                        //this.$store.commit('set_loading_icd', true)
                    }, 500)
                } 
            } else {
                if (key === 'icd') { 
                    this.icd_current_page = this.icd_next_page + 1
                    this.search_icd_items = ''
                }
            }
        },

        // GET ICD LIST
        async getICDList(){
            this.icd_loading = true
            await this.$store.dispatch('getICDList', {
                request_key: 'icd',
                page: this.icd_current_page,
                search_str: this.search_icd_items
            })
        },
        
        //SHOW DIALOG BOX FOR INPUT FIELDS IN MORTALITY
        addMortality() {
            this.show_mortality = true
        },

        //GET THE DATA OF ALL MORTALITY
        getMortality() {
            this.show_mortality = false
            this.loading_tbl = true
            
            return this.$services.getM1DisplayList({
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: 'mortality',
            })
            .then((response) => {
                this.loading_tbl = false
                response.data = this.responseDataDecryption(response.data)
                this.mortality_item = response.data
                
                this.mortality_item.map(data => {
                    this.date_and_time = data.death_date + data.death_time
                })
            }).catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            });
        },

        async submitMortality() {
            if(this.$refs.validation_form.validate()) {
                this.show_mortality = true
                this.loading_btn = true

                let response = await this.$services.trnAddM1Mortality({
                    provider_code: this.$store.state.prv_data.provider_code,
                    first_name: this.first_name,
                    middle_name: this.middle_name,
                    last_name: this.last_name,
                    suffix: this.suffix,
                    gender: this.gender,
                    date_of_birth: this.date_of_birth,
                    home_address: {
                        bldg_no: this.home_address.bldg_no,
                        street: this.home_address.street,
                        brgy: this.home_address.brgy,
                        municipality: this.home_address.municipality,
                        province: this.home_address.province,
                        zip_code: this.home_address.zip_code
                    },
                    date_of_death: this.date_of_death,
                    death_time: this.time_of_death.hours + ':' + this.time_of_death.minutes + ' ' + this.time_of_death.am_pm,
                    death_cause: this.cause_of_death.icd_code,
                    death_description: this.cause_of_death.icd_description,
                    corpse_disposal: this.$refs.selectedCorpseDisposal.selectedItems[0],
                    mortality: this.$refs.selectedMortality.selectedItems[0],
                    corpse_place: this.place_of_death.hospital,
                    death_bldg_no: this.place_of_death.bldg_no,
                    death_street: this.place_of_death.street,
                    death_brgy: this.place_of_death.brgy,
                    death_municipality: this.place_of_death.municipality,
                    death_province: this.place_of_death.province,
                    death_zip_code: this.place_of_death.zip_code,
                    created_by: this.$store.state.usr_credentials.user_name
                })

                if(response.status === 200) {
                    this.loading_btn = false
                    this.show_mortality = false
                    response.data = this.responseDataDecryption(response.data)

                    if(response.data.success) {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-check-circle', color: 'success', title: 'Mortality', body: 'Submitted Successfully', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
                        this.clearForm()
                        this.getMortality()
                    } else {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'yellow', title: 'Mortality', body: 'Data already been submitted', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
                    }
                } else {
                    this.alert = response.erorr
                }
            }
        },

        clearForm() {
            this.$refs.validation_form.reset()
        },
        
        corpseDisposal() {
            if(this.corpse_disposal === 'Others') {
                this.show_corpse_disposal = true
            }
        },

        mortalityCategory() {
            if(this.mortality === 'Others') {
                this.show_mortality_category = true
            }
        },

        saveOtherCorpseDisposal() {
            this.show_corpse_disposal = false
            this.$refs.selectedCorpseDisposal.selectedItems[0] = this.others_corpse_disposal
        },

        saveOtherMortalityCategory() {
            this.show_mortality_category = false
            this.$refs.selectedMortality.selectedItems[0] = this.others_mortality_category
        },

        getRegionsList() {
            for (const regions_key in phil_address) {
                this.place_of_death_region_list.push(phil_address[regions_key].region_name);
            }
            // CHANGE NCR POSITION
            this.place_of_death_region_list.unshift(this.place_of_death_region_list.pop());
            },

        getProvinceList(type) {
            if(this.place_of_death.region !== null){
                this.disabled_place_of_death_province = false
            }
            else{
                this.disabled_place_of_death_province = true
                this.disabled_place_of_death_municipality = true
                this.disabled_place_of_death_barangay = true
            }
            this.place_of_death_province_list = [];
            this.province_array = [];

            if (this.place_of_death.province && type === 'from_selection') {
                this.place_of_death.province = this.place_of_death.municipality = this.place_of_death.brgy = this.place_of_death.bldg_no = this.place_of_death.street = this.place_of_death.zip_code = '';
                this.place_of_death_province_list = this.province_array = this.place_of_death_municipality_list = this.municipality_array = this.place_of_death_barangay_list = [];
            }

            for (const regions_key in phil_address) {
                if (phil_address[regions_key].region_name === this.place_of_death.region) {
                    this.place_of_death_province_list = Object.keys(phil_address[regions_key].province_list);
                    this.province_array = phil_address[regions_key].province_list;
                }
            }
        },

        getMunicipalityList(province_array, type) {
            if(this.place_of_death.province !== null){
                this.disabled_place_of_death_municipality = false
            }
            else{
                this.disabled_place_of_death_municipality = true
                this.disabled_place_of_death_barangay = true
            }
            this.place_of_death_municipality_list = [];
            this.municipality_array = [];

            if (this.place_of_death.municipality && type === 'from_selection') {
                this.place_of_death.municipality = this.place_of_death.brgy = this.place_of_death.bldg_no = this.place_of_death.street = this.place_of_death.zip_code = '';
                this.place_of_death_municipality_list = this.municipality_array = this.place_of_death_barangay_list = [];
            }

            const get_municipality = Object.keys(province_array)
                .filter((item) => item === this.place_of_death.province)
                .reduce((obj, key) => province_array[key], {});

            for (const municipal in get_municipality) {
                this.place_of_death_municipality_list = Object.keys(get_municipality[municipal]);
                this.municipality_array = get_municipality[municipal];
            }
        },

        getBarangayList(municipality_array, type) {
            if(this.place_of_death.municipality !== null){
                this.disabled_place_of_death_barangay = false
            }
            else{
                this.disabled_place_of_death_barangay = true
            }
            this.place_of_death_barangay_list = [];

            if (this.place_of_death.brgy && type === 'from_selection') {
                this.place_of_death.brgy = this.place_of_death.bldg_no = this.place_of_death.street = this.place_of_death.zip_code = '';
                this.place_of_death_barangay_list = [];
            }

            const get_barangay = Object.keys(municipality_array)
                .filter((item) => item === this.place_of_death.municipality)
                .reduce((obj, key) => municipality_array[key], {});

            for (const barangay in get_barangay) {
                this.place_of_death_barangay_list = get_barangay[barangay];
            }
        },

        getPlaceRegionsList() {
            for (const regions_key in phil_address) {
                this.home_address_region_list.push(phil_address[regions_key].region_name);
            }
            // CHANGE NCR POSITION
            this.home_address_region_list.unshift(this.home_address_region_list.pop());
            },

        getPlaceProvinceList(type) {
            if(this.home_address.region !== null){
                this.disabled_home_address_province = false
            }
            else{
                this.disabled_home_address_province = true
                this.disabled_home_address_municipality = true
                this.disabled_home_address_barangay = true
            }
            this.home_address_province_list = [];
            this.province_array = [];

            if (this.home_address.province && type === 'from_selection') {
                this.home_address.province = this.home_address.municipality = this.home_address.brgy = this.home_address.bldg_no = this.home_address.street = this.home_address.zip_code = '';
                this.home_address_province_list = this.province_array = this.home_address_municipality_list = this.municipality_array = this.home_address_barangay_list = [];
            }

            for (const regions_key in phil_address) {
                if (phil_address[regions_key].region_name === this.home_address.region) {
                    this.home_address_province_list = Object.keys(phil_address[regions_key].province_list);
                    this.province_array = phil_address[regions_key].province_list;
                }
            }
        },

        getPlaceMunicipalityList(province_array, type) {
            if(this.home_address.province !== null){
                this.disabled_home_address_municipality = false
            }
            else{
                this.disabled_home_address_municipality = true
                this.disabled_home_address_barangay = true
            }
            this.home_address_municipality_list = [];
            this.municipality_array = [];

            if (this.home_address.municipality && type === 'from_selection') {
                this.home_address.municipality = this.home_address.brgy = this.home_address.bldg_no = this.home_address.street = this.home_address.zip_code = '';
                this.home_address_municipality_list = this.municipality_array = this.home_address_barangay_list = [];
            }

            const get_municipality = Object.keys(province_array)
                .filter((item) => item === this.home_address.province)
                .reduce((obj, key) => province_array[key], {});

            for (const municipal in get_municipality) {
                this.home_address_municipality_list = Object.keys(get_municipality[municipal]);
                this.municipality_array = get_municipality[municipal];
            }
        },

        getPlaceBarangayList(municipality_array, type) {
            if(this.home_address.municipality !== null){
                this.disabled_home_address_barangay = false
            }
            else{
                this.disabled_home_address_barangay = true
            }
            this.home_address_barangay_list = [];

            if (this.home_address.brgy && type === 'from_selection') {
                this.home_address.brgy = this.home_address.bldg_no = this.home_address.street = this.home_address.zip_code = '';
                this.home_address_barangay_list = [];
            }

            const get_barangay = Object.keys(municipality_array)
                .filter((item) => item === this.home_address.municipality)
                .reduce((obj, key) => municipality_array[key], {});

            for (const barangay in get_barangay) {
                this.home_address_barangay_list = get_barangay[barangay];
            }
        },

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if((event.which < 48 || event.which > 57)){
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