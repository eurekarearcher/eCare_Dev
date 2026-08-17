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
        @addChildCare="addChildCare"
        :is_childcare_and_services="true"
    />

    <!-- TABLE FOR MORTALITY -->
    <v-data-table :headers="headers" :items="filtered_items" :sort-by.sync="sort_by" :sort-desc.sync="sort_desc" :loading="loading_tbl" :mobile-breakpoint="0" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-2 mb-5">
        <template v-slot:item="{ item }">
            <tr v-on:click="selectRow(item)"  @click="transaction_number = item.transaction_number" :class="{'grey lighten-2' : item.transaction_number === transaction_number}">
                <td>{{ formatDateAndTime(item.date_created)}}</td>
                <td>{{ item.first_name + " " + (item.middle_name ? item.middle_name : '')  + " " + item.last_name}}</td>
                <td>{{ item.gender}} </td>
                <td>{{ item.birthdate}} </td>
                <td>{{ item.bldg_no + ' ' + item.street + ' ' + item.municipality + ' ' + item.province + ' ' + item.zip_code}}</td>
            </tr>
        </template>
    </v-data-table>

    <v-dialog v-if="show_child_care_forms" v-model="show_child_care_forms"  width="1200" persistent> 
        <v-card>
            <div class="py-4 primary white--text text-center">
                <h4><v-icon size="18" left dark>mdi-human-male-female-child</v-icon>Child Care and Services</h4>
            </div>

            <v-form @submit.prevent="submitForm" ref="child_care_form" class="pa-7">
                <v-row dense>
                    <v-col cols="12" sm="12" md="12" lg="12"> 
                        <h5 class="font-weight-bold" > Details </h5>
                    </v-col>

                    <v-col cols="4" sm="2" md="3" lg="3"> 
                        <h5 class="font-weight-regular"> First Name </h5>
                        <v-text-field v-model="member_data.lgu_data.mem_first_name" @change="mutations" readonly :rules="empty_validation" class="body-2" dense> </v-text-field>
                    </v-col>

                    <v-col cols="4" sm="2" md="3" lg="3"> 
                        <h5 class="font-weight-regular" > Middle Name </h5>
                        <v-text-field v-model="member_data.lgu_data.mem_middle_name" @input="member_data.lgu_data.mem_middle_name = textCapitalize($event)" @change="mutations" class="body-2" dense> </v-text-field>
                    </v-col>

                    <v-col cols="4" sm="2" md="3" lg="3"> 
                        <h5 class="font-weight-regular" > Last Name </h5>
                        <v-text-field v-model="member_data.lgu_data.mem_last_name" @input="member_data.lgu_data.mem_middle_name = textCapitalize($event)" @change="mutations" readonly :rules="empty_validation" class="body-2" dense> </v-text-field>
                    </v-col>

                    <v-col cols="4" sm="2" md="3" lg="3"> 
                        <h5 class="font-weight-regular" > Suffix Name </h5>
                        <v-select v-model="member_data.lgu_data.mem_suffix" @change="mutations" :items="['JR', 'SR', 'I', 'II', 'III', 'IV', 'V', 'VI']" clearable dense> </v-select>
                    </v-col>

                    <v-col cols="4" sm="2" md="3" lg="3"> 
                        <h5 class="font-weight-regular" > Gender </h5>
                        <v-select v-model="member_data.lgu_data.mem_gender" @change="mutations" :items="['MALE', 'FEMALE']" :rules="empty_validation" class="body-2" dense> </v-select>
                    </v-col>

                    <v-col cols="4" sm="2" md="3" lg="3"> 
                        <h5 class="font-weight-regular" > Date of birth </h5>
                        <v-menu :close-on-content-click="false" transition="scale-transition" readonly min-width="auto" offset-y top>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" v-model="member_data.lgu_data.mem_birthdate" v-mask="birthdate_mask" placeholder="YYYY-MM-DD" :rules="empty_validation" readonly dense></v-text-field>
                            </template>

                            <v-date-picker v-model="birthdate_picker" :max="max_date" @change="member_data.lgu_data.mem_birthdate = formatDate(birthdate_picker)" no-title></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col cols="12" sm="12" md="12" lg="12"> 
                        <h6 class="font-weight-medium body-2" >Drugs / Medicine 
                            <v-tooltip bottom color="primary">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="primary" dark v-bind="attrs" v-on="on" class="mb-1">mdi-information-outline</v-icon>
                                </template>

                                <span>For other medicine. Use Drug and Medicines not needed during this particular episode of care.</span>
                            </v-tooltip>
                        </h6>

                        <v-autocomplete v-model="selected_medicine_holder" :items="medicine_items" :rules="[v => this.emptys_validations || 'Required Field']" :loading="loading_medicine" item-text="generic_name_text" class="body-2" prepend-inner-icon="mdi-magnify" placeholder="Search for Generic / Brand Name" return-object hide-no-data hide-selected outlined dense>
                            <template v-slot:item="{ item }">
                                <v-layout @click="addDrugsMedicine(item)">
                                    <v-list-item-avatar v-if="$vuetify.breakpoint.smAndUp" color="indigo" class="font-weight-light white--text">{{ item.otc_medicine_code.replace('OTC-', '') }}</v-list-item-avatar>
                                    <v-row dense wrap pt-3>
                                        <v-col cols="12" sm="12" md="5" lg="7">
                                            <v-row dense wrap>
                                                <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                                    <h6 class="body-2 font-weight-regular">GENERIC NAME:</h6>
                                                </v-col>

                                                <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                                    <h6 class="body-2 font-weight-regular">{{  textCapitalize(item.generic_name) }}</h6>
                                                </v-col>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="12" sm="12" md7 lg5>
                                            <v-row dense wrap>
                                                <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                                    <h6 class="body-2 font-weight-regular">PREPARATION:</h6>
                                                </v-col>

                                                <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                                    <h6 class="body-2 font-weight-regular">{{  textCapitalize(item.preparation) }}</h6>
                                                </v-col>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="12" sm="12" md5 lg7>
                                            <v-row dense wrap>
                                                <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                                    <h6 class="body-2 font-weight-regular">ROUTE:</h6>
                                                </v-col>
                                                <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                                    <h6 class="body-2 font-weight-regular">{{  textCapitalize(item.route) }}</h6>
                                                </v-col>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="12" sm="12" md7 lg5>
                                            <v-row dense wrap>
                                                <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                                    <h6 class="body-2 font-weight-regular">DOSAGE:</h6>
                                                </v-col>
                                                <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                                    <h6 class="body-2 font-weight-regular">{{  textCapitalize(item.dosage) }}</h6>
                                                </v-col>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                                            <v-divider class="mt-4"></v-divider>
                                        </v-col>
                                    </v-row>
                                </v-layout>
                            </template>
                            <template v-slot:selection></template>       
                        </v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" lg="12"> 
                        <div v-if="selected_medicine.length > 0" :class="{'table-overflow-x' : $vuetify.breakpoint.lgAndDown}">
                            <table id="table" class="my-4" cellspacing="0" cellpadding="0">
                                <tr>
                                    <th class="font-weight-medium body-2">Generic Name</th>
                                    <th class="font-weight-medium body-2">Dosage</th>
                                    <th class="font-weight-medium body-2">Preparation</th>
                                    <th class="font-weight-medium body-2">Route</th>
                                </tr>

                                <tr v-for="(med, i) in selected_medicine" :key="i">
                                    <td style="width: 20%">
                                        <v-text-field :value="med.generic_name.trim()" class="body-2 pr-2" hide-details readonly></v-text-field>
                                    </td>

                                    <td style="width: 8%">
                                        <v-text-field v-model="med.dosage" :value="med.dosage" @input="med.dosage = textCapitalize($event)" class="body-2 pr-2" hide-details :readonly="med.medicine_code !== 'OTC-0000'"></v-text-field>
                                    </td>

                                    <td style="width: 8%">
                                        <v-text-field v-model="med.preparation" :value="med.preparation" @input="med.preparation = textCapitalize($event)" class="body-2 pr-2" hide-details :readonly="med.medicine_code !== 'OTC-0000'"></v-text-field>
                                    </td>

                                    <td style="width: 8%">
                                        <v-text-field v-model="med.route" v-on:keypress="numberOnly" class="body-2 pr-2" onpaste="return false" maxlength="5" hide-details>
                                            <template v-slot:append-outer>
                                                <v-icon :disabled="loading_medicine" @click="removeAddedDrugsMedicine(i)">mdi-delete</v-icon>
                                            </template>
                                        </v-text-field>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </v-col>

                    <v-col cols="4" sm="2" md="3" lg="3"> 
                        <h5 class="font-weight-regular" > Date (Day when performed) </h5>
                        <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-on="on" v-model="date_process" v-mask="birthdate_mask" placeholder="YYYY-MM-DD" :rules="empty_validation" readonly dense></v-text-field>
                            </template>

                            <v-date-picker v-model="date_process" :max="max_date"  no-title></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col cols="12" sm="12" md="12" lg="12"> 
                        <h5 class="font-bold"> Address: </h5>
                    </v-col>

                    <v-col cols="2" sm="2" md="2" lg="3">
                        <h5 class="font-weight-regular">Region</h5>
                        <v-select  v-model="region"  @keydown.enter.prevent  @change="getProvinceList('from_selection')" :items="region_list" :rules="empty_validation"  class="body-2" dense clearable></v-select>
                    </v-col>

                    <v-col cols="2" sm="2" md="2" lg="3">
                        <h5 class="font-weight-regular">Province</h5>
                        <v-select v-model="province" @keydown.enter.prevent @change="getMunicipalityList(province_array,'from_selection')" :items="province_list" :rules="empty_validation"  :disabled = "disabled_province" class="body-2" dense clearable></v-select>
                    </v-col>

                    <v-col cols="2" sm="2" md="2" lg="3">
                        <h5 class="font-weight-regular">Municipality</h5>
                        <v-select v-model="municipality" @keydown.enter.prevent @change="getBarangayList(municipality_array,'from_selection')" :items="municipality_list" :rules="empty_validation" :disabled = "disabled_municipality"  class="body-2" dense clearable></v-select>
                    </v-col>

                    <v-col cols="2" sm="2" md="2" lg="3">
                        <h5 class="font-weight-regular">Barangay</h5>
                        <v-select v-model="brgy" @keydown.enter.prevent  :items="barangay_list" :disabled = "disabled_barangay" :rules="empty_validation"  class="body-2" dense clearable></v-select>
                    </v-col>

                    <v-col cols="2" sm="2" md="2" lg="3"> 
                        <h5 class="font-weight-regular" >Bldg No. </h5>
                        <v-text-field v-model="bldg_no" @input="bldg_no = textCapitalize($event)" dense> </v-text-field>
                    </v-col>
                    
                    <v-col cols="2" sm="2" md="2" lg="3"> 
                        <h5 class="font-weight-regular" > Street </h5>
                        <v-text-field v-model="street" @input="street = textCapitalize($event)" dense> </v-text-field>
                    </v-col>

                    <v-col cols="2" sm="2" md="2" lg="3"> 
                        <h5 class="font-weight-regular" > Zip Code</h5>
                        <v-text-field v-model="zip_code" @keypress="numberOnly" :rules="empty_validation" dense> </v-text-field>
                    </v-col>
                </v-row>

                <v-card-actions class="justify-center px-5 pt-8 pb-5">
                    <v-btn type="submit" class="primary elevation-0 px-5" :loading="loading_btn">Submit</v-btn>
                    <v-btn @click="clearForm" class="px-5"> Clear </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-if="show_verify_member" v-model="show_verify_member"  width="700">
        <UserVerification process="ADD HOUSEHOLD" :child_care_services="child_care_services" @proceedToChildCare="proceedToChildCare"/>
    </v-dialog>

    <v-dialog v-if="show_selected_member" v-model="show_selected_member" persistent>
        <v-card class="pa-8">
            <v-data-table :headers="medicine_headers" :items="selected_member_medicine" :sort-by.sync="sort_by" :sort-desc.sync="sort_desc" :mobile-breakpoint="0" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" class="elevation-2"></v-data-table>
            <v-card-actions class="d-flex justify-center mt-4"> 
                <v-btn @click="show_selected_member = false"> Close </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <Alert :alert="alert"/>
  </v-container>
</template>

<script>
import { mask } from "vue-the-mask"
import Alert from '@/components/Alert.vue'
import Navbar from '@/components/Navbar.vue'
import UserVerification from '@/components/e-benefit/web-registration/UserVerification.vue'
import phil_address from '@/reference/philippines-address.json'
import Header from '@/components/emr/header/Header.vue'

export default {
    directives: { mask },

    components: {
        Alert,
        Navbar,
        UserVerification,
        Header
    },

    data() {
        return {
            header_title: "Child Care and Services",
            child_care_services: true,
            search_tbl: '',
            start_date: '',
            end_date: '',
            loading_tbl: false,
            loading_btn: false,
            birthdate_mask: '####-##-##',
            max_date: this.$moment().format('YYYY-MM-DD'),
            birthdate_picker: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            gender: '',
            date_of_birth: '',
            bldg_no: '',
            street: '',
            brgy: '',
            municipality: '',
            province: '',
            region: '',
            zip_code: '',
            date_process: '',
            transaction_number: '',

            alert: {},

            navbar: [
                { title: "Child Care and Services", link: "/child-care-and-services", icon: "fas fa-folder" },
                { title: "Mortality", link: "/mortality", icon: "fas fa-folder" },
                { title: "Natality", link: "/natality", icon: "fas fa-folder" },
                { title: "EHSS", link: "/ehss", icon: "fas fa-folder" },
                { title: "Home", link: "/code-scanning", icon: "fas fa-home" },
            ],

            empty_validation: [
                v => !!v && !/^ *$/.test(v) || 'Required Field',
            ],

            headers:[
                { text: 'Date', value: 'date_created', width:"230px", sortable: false, align:'center'},
                { text: 'Name', value: 'first_name', width:'450px', sortable: false, align:'center'},
                { text: 'Gender', value: 'gender', width:'120px', sortable: false, align:'center'},
                { text: 'Date of Birth', value: 'birthdate', width:'250px', sortable: false, align:'center'},
                { text: 'Home Address', value: 'place_of_death', width:'350px', sortable: false, align:'center'},
            ],

            child_care_items: [],

            medicine_headers:[
                { text: 'Generic Name', value: 'generic_name'},
                { text: 'Dosage', value: 'dosage'},
                { text: 'Preparation', value: 'preparation'},
                { text: 'Route', value: 'route'},
            ],
            selected_member: {},
            selected_member_medicine: [],

            sort_by: 'date_created',
            sort_desc: true,
            show_child_care_forms: false,
            show_verify_member: false,
            show_selected_member: false,

            // MEDICINE
            loading_medicine: true,
            medicine_list: sessionStorage.getItem('kgIGs35') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('kgIGs35'), 'EMX246').toString(this.$crypto.enc.Utf8)) : [],
            selected_medicine: [], 
            selected_medicine_filter: [],
            selected_medicine_holder: {},
            med_empty_fields: false,

            member_data: sessionStorage.getItem("9xgF732sfgh") ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem("9xgF732sfgh"), "njGHDdd").toString(this.$crypto.enc.Utf8) ) : {
                fresh_load: true
            },

            region_list: [],
            province_list: [],
            municipality_list: [],
            barangay_list: [],

            province_array: [],
            municipality_array: [],

            disabled_province: true,
            disabled_municipality: true,
            disabled_barangay: true,
            search_reset_key: 0,
        }
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
            return this.child_care_items.filter((i) => {
                let temp_name = [i.first_name,i.last_name]
                let member_name = temp_name.includes(null) ? 'N/A' : i.first_name + (i.middle_name ? ' '+ i.middle_name : '') +' '+ i.last_name + (i.suffix ? ' '+i.suffix : '')

                let searched_data = (member_name.toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1) || ((i.test_result ? i.test_result : '').toLowerCase().indexOf(this.search_tbl.toLowerCase()) > -1)
                let timestamp = i.date_created.substring(0, 10)
                
                let search = this.search_tbl ? searched_data : true
                let date = this.start_date && this.end_date ? timestamp >= this.start_date && timestamp <= this.end_date : true

                return search && date 
            })    
        },

        // FILTER MEDICINE LIST
        medicine_items(){
            const medicine_list = this.medicine_list.filter(item => {
                return !this.selected_medicine_filter.includes(item.generic_name_text)
            })

            return medicine_list
        },

        emptys_validations: {
           get() {
                return this.selected_medicine_holder && Object.keys(this.selected_medicine_holder).length > 0;
            },
            set(value) {
                this.selected_medicine_holder = value;
            }
        },
    },

    mounted() {
        this.getChildCareServices()
        this.getDrugsMedicine()
        this.getRegionsList()
    },

    methods: {
        mutations() {
            if(!this.member_data.fresh_load) {
                sessionStorage.setItem('9xgF732sfgh', this.$crypto.AES.encrypt(JSON.stringify(this.member_data), 'njGHDdd'))
            } else {
                this.member_data.fresh_load = false
            }
        },

        proceedToChildCare(member_data) {
            this.member_data = member_data
            this.show_verify_member = false
            this.show_child_care_forms = true
        },

        // GET DRUGS MEDICINE LIST
        async getDrugsMedicine() {
            if(this.medicine_list.length === 0){
                let response = await this.$services.getTransactionIpRefData({
                   request_key: 'otc_medicine'
                })

                if(response.status === 200) {
                    this.medicine_list = response.data.map(item => {
                    let medicine = {
                        medicine_no: item.medicine_no,
                        otc_medicine_code: item.otc_medicine_code,
                        brand_name: item.brand_name,
                        dosage: item.dosage,
                        preparation: item.preparation,
                        route: item.route,
                        generic_name: item.generic_name,
                        generic_name_text: item.generic_name + item.brand_name + item.dosage
                    }
                    
                    return medicine
                })
    
                sessionStorage.setItem('kgIGs35', this.$crypto.AES.encrypt(JSON.stringify(this.medicine_list), 'EMX246'))
                this.loading_medicine = false
                } else {
                    this.alert = response.error
                }
            }else{
                this.loading_medicine = false
            }
        },

        // ADD DRUGS MEDICINE
        addDrugsMedicine(data){
            if(data.otc_medicine_code === 'OTC-0000'){
                this.other_med.dialog = true
            } else {
                const capitalizedData = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,typeof value === 'string' ? this.textCapitalize(value) : value
                ])
                );

                let medicine = {
                    brand_name: null,
                    ...capitalizedData
                }
                this.selected_medicine_filter.push(data.generic_name_text)
                this.selected_medicine.push(medicine)
            }
        },

        removeAddedDrugsMedicine(index) {
            this.selected_medicine_filter = this.selected_medicine_filter.filter(item => item !== this.selected_medicine[index].generic_name_text);
            this.selected_medicine.splice(index, 1);
        },

        //GET THE DATA OF ALL CHILD CARE AND SERVICES
        getChildCareServices() {
            this.show_mortality = false
            this.loading_tbl = true
            
            return this.$services.getM1DisplayList({
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: 'vitamin_a_deworming',
            })
            .then((response) => {
                this.loading_tbl = false
                response.data = this.responseDataDecryption(response.data)
                this.child_care_items = response.data
                
            }).catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            });
        },

        //SHOW DIALOG BOX FOR INPUT FIELDS IN MORTALITY
        addChildCare() {
            return this.member_data.lgu_data ? this.show_child_care_forms = true : this.show_verify_member = true
        },

        verifyForm() {
            this.loading_btn = false
        },

        selectRow(item) {
            this.show_selected_member = true
            this.selected_member_medicine = item.medicines
        },

        async submitForm() {
            let { lgu_data } = this.member_data;

            if (this.$refs.child_care_form.validate()) {
                if (!this.emptys_validations || this.selected_medicine.length === 0) {
                    this.$set(this, 'emptys_validations', false);
                    return;
                }
                this.loading_btn = true;

                let response = await this.$services.trnAddM1ChildCare({
                    ek_lgu_id: lgu_data.ek_lgu_id,
                    principal_ek_lgu_id: lgu_data.principal_ek_lgu_id,
                    lgu_host_code: lgu_data.lgu_host_code,
                    provider_code: this.$store.state.prv_data.provider_code,
                    medicines: this.selected_medicine,
                    first_name: lgu_data.mem_first_name || '',
                    middle_name: lgu_data.mem_middle_name || '',
                    last_name: lgu_data.mem_last_name,
                    suffix: lgu_data.suffix,
                    gender: lgu_data.mem_gender,
                    birthdate: lgu_data.date_of_birth,
                    bldg_no: lgu_data.bldg_no ? lgu_data.bldg_no :  this.bldg_no,
                    street: lgu_data.street ? lgu_data.street : this.street,
                    brgy: lgu_data.brgy ? lgu_data.brgy : this.brgy,
                    municipality: lgu_data.municipality ? lgu_data.municipality : this.municipality,
                    province: lgu_data.province ? lgu_data.province : this.province,
                    zip_code: lgu_data.zip_code ? lgu_data.zip_code : this.zip_code,
                    date_process: this.date_process,
                    created_by: this.$store.state.usr_credentials.user_name
                })

                if(response.status === 200) {
                    this.loading_btn = false;
                    if (!response.data.success) {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'yellow', title: 'Something went wrong!', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    } else {
                        this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-check-circle', color: 'success', title: 'Child Care and Services', body: 'Form has been successfully submitted', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                        this.getChildCareServices();
                        sessionStorage.clear("9xgF732sfgh");
                        this.selected_medicine = [];
                        this.$nextTick(() => {
                            this.$refs.child_care_form.reset();
                            this.disabled_province = true;
                            this.disabled_municipality = true;
                            this.disabled_barangay = true;
                            this.show_child_care_forms = false;
                            this.clearForm();
                        });
                    }
                } else {
                    this.alert = response.erorr
                }
            } else {
                this.loading_btn = false;
            }
        },

        getRegionsList() {
            for (const regions_key in phil_address) {
                this.region_list.push(phil_address[regions_key].region_name);
            }
            // CHANGE NCR POSITION
            this.region_list.unshift(this.region_list.pop());
            },

        getProvinceList(type) {
                if(this.region !== null){
                    this.disabled_province = false
                }
                else{
                    this.disabled_province = true
                    this.disabled_municipality = true
                    this.disabled_barangay = true
                }
                this.province_list = [];
                this.province_array = [];

                if (this.province && type === 'from_selection') {
                    this.province = this.municipality = this.brgy = this.bldg_no = this.street = this.zip_code = '';
                    this.province_list = this.province_array = this.municipality_list = this.municipality_array = this.barangay_list = [];
                }

                for (const regions_key in phil_address) {
                if (phil_address[regions_key].region_name === this.region) {
                    this.province_list = Object.keys(phil_address[regions_key].province_list);
                    this.province_array = phil_address[regions_key].province_list;
                }
            }
        },

        getMunicipalityList(province_array, type) {
            if(this.province !== null){
                this.disabled_municipality = false
            }
            else{
                this.disabled_municipality = true
                this.disabled_barangay = true
            }
            this.municipality_list = [];
            this.municipality_array = [];

            if (this.municipality && type === 'from_selection') {
                this.municipality = this.brgy = this.bldg_no = this.street = this.zip_code = '';
                this.municipality_list = this.municipality_array = this.barangay_list = [];
            }

            const get_municipality = Object.keys(province_array)
                .filter((item) => item === this.province)
                .reduce((obj, key) => province_array[key], {});

            for (const municipal in get_municipality) {
                this.municipality_list = Object.keys(get_municipality[municipal]);
                this.municipality_array = get_municipality[municipal];
            }
        },

        getBarangayList(municipality_array, type) {
            if(this.municipality !== null){
                this.disabled_barangay = false
            }
            else{
                this.disabled_barangay = true
            }
            this.barangay_list = [];

            if (this.brgy && type === 'from_selection') {
                this.brgy = this.bldg_no = this.street = this.zip_code = '';
                this.barangay_list = [];
            }

            const get_barangay = Object.keys(municipality_array)
                .filter((item) => item === this.municipality)
                .reduce((obj, key) => municipality_array[key], {});

            for (const barangay in get_barangay) {
                this.barangay_list = get_barangay[barangay];
            }
        },

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if((event.which < 48 || event.which > 57)){
                event.preventDefault();
            }
        },

        clearForm() {
            this.show_child_care_forms = false
            this.member_data = []
            this.selected_medicine = [];
            sessionStorage.clear("9xgF732sfgh")
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
.ehss-input {
    width: 120px;
}
</style>