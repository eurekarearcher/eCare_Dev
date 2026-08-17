<template>
    <div>
        <v-card class="pb-4 px-4 mt-2" outlined>
            <h2 class="text-center grey--text text--darken-2 py-6">USER REGISTRATION</h2> 
            <v-form class="py-2 text-sm-right" ref="form">
                <template v-if="$store.state.usr_credentials.user_type === '0-0'">     
                    <v-row justify="center" align="baseline" class="wrap">
                        <v-col cols="12" sm="12" md="3" lg="2" xl="2">
                            Provider Type: <span class="required">*</span>
                        </v-col>
                        
                        <v-col cols="12" sm="12" md="8" lg="9" xl="9">
                            <v-select v-model="prv_type" :items="provider_items" item-value="type" item-text="display" @change="clearForm" menu-props="bottom, offsetY" label="Type" outlined dense></v-select>
                        </v-col>
                    </v-row>

                    <!-- ADDITIONAL INFORMATION FOR PROVIDER REGISTRATION -->
                    <v-row justify="start" align="baseline" dense>
                        <v-col cols="12" sm="12" md="3" lg="2" xl="2" >
                            Additional Info: <span class="required">*</span>
                        </v-col>
                        
                        <v-col cols="12" sm="12" md="4" lg="5" xl="5">
                            <v-text-field v-model="prv_name" class="my-2" :rules="name_rules" maxlength="50" label="Provider Name" outlined hide-details dense></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="12" md="4" lg="4" xl="4">
                            <v-text-field v-model="prv_location" class="my-2" :rules="name_rules" maxlength="35" label="Provider Address" outlined hide-details dense></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="12" md="3" lg="2" xl="2">
                        </v-col>

                        <v-col cols="12" sm="12" md="4" lg="5" xl="5">
                            <v-select v-model="prv_municipality" class="my-2" :rules="name_rules" :items="municipality_items" item-text="name" @change="clearForm" menu-props="bottom, offsetY" label="Municipality" outlined hide-details dense return-object></v-select>
                        </v-col>

                        <v-col cols="12" sm="12" md="4" lg="4" xl="4">
                            <v-text-field v-model="prv_region" class="my-2" :rules="name_rules" maxlength="35" label="Province" outlined hide-details dense></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="12" md="3" lg="2" xl="2">
                        </v-col>

                        <v-col cols="12" sm="12" md="3" lg="3" xl="3">
                            <v-text-field v-model="prv_tin_provider" class="my-2" :rules="name_rules" maxlength="35" label="Provider Tin" outlined hide-details dense></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="12" md="3" lg="3" xl="3">
                            <v-text-field v-model="prv_contact_no" class="my-2" :rules="name_rules" maxlength="35" label="Contact No." @keypress="numberOnly" outlined hide-details dense></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="12" md="2" lg="3" xl="3">
                            <v-text-field v-model="prv_zip_code" class="my-2" :rules="name_rules" maxlength="10" label="Zip Code" @keypress="numberOnly" outlined hide-details dense></v-text-field>
                        </v-col>
                    </v-row>
                </template>

                <template v-else>
                    <v-row dense>
                        <v-col class="pr-3 text-start text-md-end mt-4" cols="12" sm="3" md="3" lg="2" xl="2">
                            Department <span class="required">*</span>
                        </v-col>

                        <v-col cols="12" sm="12" md="8" lg="9" xl="9">
                            <v-autocomplete v-model="department" class="my-2" :items="get_departments" item-value="user_type" item-text="display" @change="clearForm" menu-props="bottom, offsetY" label="Department" outlined hide-details multiple return-object dense small-chips deletable-chips></v-autocomplete>
                        </v-col>
                    </v-row>

                    <v-row v-if="get_user_type.includes('6-1')" dense>
                            <v-col class="pr-3 text-start text-md-end mt-4" cols="12" sm="3" md="3" lg="2" xl="2">
                                Specialization <span class="required">*</span>
                            </v-col>

                            <v-col cols="12" sm="12" md="8" lg="9" xl="9">
                                <v-autocomplete v-if="get_user_type.includes('6-1')" v-model="select_specialization" class="my-2" :items="specialization_items" :loading="loading_specialization" prepend-inner-icon="mdi-magnify" :label="'Search for Specialization'" :rules="name_rules" hide-no-data outlined hide-details dense>
                                </v-autocomplete>
                            </v-col>
                    </v-row>

                    <v-row v-if="get_user_type.includes('6-1') || get_user_type.includes('7-1') || get_user_type.includes('2-5')" dense> 
                            <v-col class="pr-3 text-start text-md-end mt-4" cols="12" sm="3" md="3" lg="2" xl="2">
                                Medical Position <span class="required">*</span>
                            </v-col>

                            <v-col cols="12" sm="12" md="8" lg="9" xl="9">
                                <v-text-field v-model="doctor_position" :rules="name_rules" class="my-2" outlined hide-details dense>
                                </v-text-field>
                            </v-col>
                    </v-row>
                </template>
                    
                <v-row justify="start" align="baseline" dense>
                    <v-col cols="12" sm="3" md="3" lg="2" xl="2" class="pr-3 text-start text-md-end">
                        Name: <span class="required">*</span>
                    </v-col>

                    <v-col cols="12" sm="12" md="8" lg="9" xl="9">
                        <v-row align="baseline" dense>
                            <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                                <v-text-field v-model="fname" class="my-2" :rules="name_rules" maxlength="35" label="First name" outlined hide-details dense></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                                <v-text-field v-model="mname" class="my-2" :rules="name_rules" maxlength="35" label="Middle name" outlined hide-details dense></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                                <v-text-field v-model="lname" class="my-2" :rules="name_rules" maxlength="35" label="Last name" outlined hide-details dense></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                                <v-select v-model="suffix" class="my-2" :items="['Jr', 'Sr', 'I', 'II', 'III', 'IV', 'V', 'VI']" outlined clearable hide-details dense> </v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="1" lg="1">
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>

                <template v-if="get_user_type.includes('6-1') || get_user_type.includes('7-1') || get_user_type.includes('2-5')"> 
                    
                    <v-row justify="start" align="baseline" dense>
                        <v-col  class="pr-3 text-start text-md-end" cols="12" sm="3" md="3" lg="2" xl="2">
                            Additional Info <span class="required mr-1">*</span>
                        </v-col>

                        <v-col cols="12" sm="12" md="8" lg="9" xl="9">
                            <v-row dense>
                                <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-on="on" v-model="birth_date" v-mask="birthdate_mask" class="my-2" placeholder="Date of Birth" :rules="name_rules" outlined hide-details dense></v-text-field>
                                        </template>
                                        <v-date-picker v-model="birthdate_picker" :max="max_date" @change="birth_date = newFormatDate(birthdate_picker)" no-title></v-date-picker>
                                    </v-menu>
                                </v-col>

                                <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                    <v-text-field v-model="doctor_tin_no" class="my-2" :rules="name_rules" ref="doc_tin" maxlength="35" label="TIN Number" outlined hide-details dense></v-text-field>
                                </v-col>

                                <!-- <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                    <v-text-field v-model="doctor_code" class="my-2" maxlength="35" label="Code Number" outlined hide-details dense></v-text-field>
                                </v-col> -->

                                <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                    <v-text-field v-model="doc_phic_acc_no" class="my-2" :loading="doc_phic_acc_no_loading"  maxlength="35" label="PHIC Accreditation No." outlined hide-details dense></v-text-field>
                                </v-col>

                                <!--<v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                    <v-text-field v-model="doc_phic_acc_no" class="my-2"   maxlength="35" label="PHIC Accreditation No." outlined hide-details dense></v-text-field>
                                </v-col>-->

                                <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                    <v-text-field v-model="doc_prc_license" class="my-2" :rules="name_rules"  maxlength="35" label="Prc License" outlined hide-details dense></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                    <v-text-field v-model="doc_ptr_no" class="my-2" maxlength="35" label="PTR No" outlined hide-details dense></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                    <v-text-field v-model="doc_s2_no" class="my-2" maxlength="35" label="S2 No" outlined hide-details dense></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                    <v-text-field v-model="contact_no" class="my-2" :rules="name_rules" maxlength="11" label="Contact No." @keypress="numberOnly" outlined hide-details dense></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </template>

                <v-row align="baseline" class="mt-n1" dense>
                    <v-col cols="12" sm="3" md="3" lg="2" xl="2" class="pr-3 text-start text-md-end"> 
                        Email: <span class="required">*</span>
                    </v-col>

                    <v-col cols="12" sm="12" md="8" lg="9" xl="9">
                        <v-text-field v-model="email" class="my-2" :rules="email_rules" maxlength="40" label="Email" outlined hide-details dense></v-text-field>
                    </v-col>
                </v-row>

                <v-row align="baseline" dense>
                    <v-col cols="12" sm="3" md="3" lg="2" xl="2" class="pr-3 text-start text-md-end"> 
                        Username: <span class="required">*</span>
                    </v-col>

                    <v-col cols="12" sm="12" md="8" lg="9" xl="9">
                        <v-text-field v-model="username" class="my-2" :rules="username_rules" maxlength="50" label="Username" outlined dense></v-text-field>
                    </v-col>
                </v-row>

                <template v-if="$store.state.usr_credentials.user_type === '5-1'"> 
                    <v-row justify="center" dense>
                        <v-col cols="12" sm="12" md="12" lg="6" xl="6">
                            <v-row align="baseline" dense>
                                <v-col cols="12" sm="3" md="3" lg="4" xl="4" class="pr-3 text-start text-md-end">
                                    Password: <span class="required">*</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="8" lg="6" xl="6" class="pr-1">
                                    <v-text-field v-model="password" class="my-2" :rules="password_rules" type="password" maxlength="30" label="Password" ref="password" outlined dense></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" lg="6" xl="6">    
                            <v-row align="baseline" dense>
                                <v-col cols="12" sm="3" md="3" lg="4" xl="4" class="pr-3 text-start text-md-end">
                                    Re-Type Password: <span class="required">*</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="8" lg="6" xl="6">   
                                    <v-text-field v-model="retype_password" class="my-2" :rules="retype_rules" type="password" maxlength="30" label="Re-type Password" data-vv-as="password" onpaste="return false" outlined dense></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>  
                </template>
            </v-form>

            <v-divider></v-divider>
            
            <v-row align="baseline" class="mt-4 mb-2 text-right">
                <v-col cols="12" sm="12" md="11" lg="11" xl="11">
                    <v-btn :disabled="btn_loading" @click="clearForm" class="mr-2 grey white--text">Clear</v-btn>
                    <v-btn :loading="btn_loading" :disabled="btn_loading" @click="submitNewUser" class="blue darken-3 white--text">Submit</v-btn>
                </v-col>
            </v-row>
        </v-card>
        <Alert :alert="alert" />
    </div>
</template>

<script>
import { mask } from "vue-the-mask"
import Alert from "@/components/Alert.vue"

export default {
    directives: { mask },

    components: {
        Alert
    },

    data(){
        return{
            process_env: this.$process_env,

            // DOCTOR
            loading_doctor: true,
            loading_specialization: true,
            loading_lgu_facilities: true,
            doc_phic_acc_no_loading: false,
            selected_doctor_holder: {},
            profession_items: [],
            specialization_items: [],
            lgu_facilities: [],
            doctor_tin: '',
        
            profession_verification: {
                dialog: false,
                error_msg: '',
                data: {},
                value: ''
            },

            birthdate_picker: '',
            birthdate_mask: '####-##-##',
            max_date: this.$moment().format('YYYY-MM-DD'),
            birth_date: '',

            select_specialization: {},
            doctor_position: '',

            // FORM
            departments: [
                { department:'Admission', display: 'Frontdesk / Nurse / Admission', user_type: '2-1' },
                { department:'Medical Practitioner', display: 'Medical Practitioner - Nurse', user_type: '2-5' },
                { department:'Nurse Station', display: 'Outpatient / Inpatient - Nurse Station', user_type: '2-2' },
                { department:'Credit and Collection', display: 'Outpatient / Inpatient - Credit and Collection', user_type: '2-3' },
                // { department:'Nurse Station', display: 'Inpatient - Nurse Station', user_type: '2-2' },
                // { department:'Laboratory', display: 'Covid 19 Laboratory', user_type: '4-1' },
                { department:'Admin', display: 'Administrator', user_type: '5-1' },
                { department:'Midwife', display: 'Midwife', user_type: '7-1'},
                { department:'Doctor', display: 'Doctor', user_type: '6-1' },
                { department:'Pharmacist', display: 'Pharmacist', user_type: '8-1'},
                { department:'Data Encoder', display: 'Data Encoder', user_type: '9-1'},
                { department:'Medical Laboratory Technologists', display: 'Medical Laboratory Technologists', user_type: '10-1'},
            ],

            //FOR PRIVATE FACILITY
            pvt_lab_departments: [
                { department:'Admin', display: 'Administrator', user_type: '5-1' },
                { department:'Medical Laboratory Technologists', display: 'Medical Laboratory Technologists', user_type: '10-1'},
            ],

            pvt_ph_departments: [
                { department:'Admin', display: 'Administrator', user_type: '5-1' },
                { department:'PVTPharmacist', display: 'Pharmacy Assistant', user_type: '10-2'}
            ],

            department: '',
            fname: '',
            mname: '',
            lname: '',
            suffix: '',
            email: '',
            username: '',
            password: '',
            retype_password: '',
            btn_loading: false,

            doctor_tin_no: '',
            doc_prc_license: '',
            doctor_code: '',
            doc_phic_acc_no: '',
            doc_ptr_no: '',
            doc_s2_no: '',
            contact_no: '',

            // FORM VALIDATION
            name_rules: [v => !!v && !/^ *$/.test(v)],
            email_rules: [
                v => !!v,
                v => /.+@.+\..+/.test(v) || 'Invalid Email',
                v => !/\s/g.test(v) || 'Spaces are not allowed'
            ],
            username_rules: [
                v => !!v,
                v => !/\s/g.test(v) || 'Spaces are not allowed',
                v => v.length >= 6 || 'Username must be at least 6 characters',
            ],

            password_rules: [
                v => !!v || 'Password is required',
                ...(this.$process_env !== 'DEV' ?  [
                    v => v.length >= 8 || 'Password must be at least 8 characters',
                    v => !/\s/g.test(v) || 'Spaces are not allowed',
                    v => /[A-Z]/.test(v) || 'Must include at least 1 uppercase letter',
                    v => /[a-z]/.test(v) || 'Must include at least 1 lowercase letter',
                    v => /[0-9]/.test(v) || 'Must include at least 1 number',
                    v => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Must include at least 1 special character',
                ] : [])
            ],
            retype_rules: [
                v => !!v,
                v => (v === this.password) || 'Password does not match'
            ],

            alert: {},

            provider_items: [
                'MHO',
                'CHO',
                'RHU 1',
                'RHU 2',
                'RHU 3',
                'RHU 4',
                'RHU 5',
                'BRGY'
            ],

            municipality_items: [
                {
                    name: 'BATAAN',
                    lgu_host_code: 'BT'
                },
                {
                    name: 'ANTIPOLO',
                    lgu_host_code: 'AT'
                }
            ],

            prv_tin_provider:'',
            prv_type:'',
            prv_name:'',
            prv_location:'',
            prv_municipality:'',
            prv_region:'',
            prv_zip_code:'',
            prv_contact_designation:'',
            prv_contact_no: '',

            filter_doctor: false,
            show_doctor_specialization: false,
            is_eclaim_accredited: '',
            doctor_accre_no: '',
            accreditation_start: '',
            accreditation_end: ''
        }
    },

    computed: {
        get_user_type() {
            let user_type = []
            if(this.department) {
                this.department.map(data => {
                    user_type.push(data.user_type)
                })
            }
            return user_type
        },

        get_departments() {
            if(this.$store.state.usr_credentials.provider_reg_type === 'PVT-P') {
                return this.pvt_ph_departments
            }

            if(this.$store.state.usr_credentials.provider_reg_type === 'PVT-D') {
                return this.pvt_lab_departments
            }

            return this.departments
        }
    },

    watch: {
        fname: 'getPHICAccreditationNo',
        mname: 'getPHICAccreditationNo',
        lname: 'getPHICAccreditationNo',
        birth_date: 'getPHICAccreditationNo',
    },

    mounted(){
        // REMOVE THIS IF ECLAIMS MODULE IS AVAILABLE IN PRODUCTION
        if(!this.$eclaims_available) {
            this.departments = this.departments.filter(
                dep => !['2-2', '2-3'].includes(dep.user_type)
            );
        }
    },
    
    methods: {
        //GET DOCTOR SPECIALIZATION
        async getDoctorSpecialization() {
            let response = await this.$services.getDoctorSpecialization()

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                this.loading_specialization = false
                this.specialization_items = response.data.specialization
            } else {
                this.alert = response.error
            }
        },

        //GET DOCTOR PHIC ACCREDITATION NO
        async getPHICAccreditationNo() {
            if (this.fname && this.mname && this.lname && this.birth_date && this.$eclaims_available) {
                
                this.doc_phic_acc_no_loading = true;
                const formatted_birthdate = this.formatDate(this.birth_date);
                let response = await this.$services.getEclaimsWebService({
                    request_key: "GDPM",
                    provider_code: 'EKDF21B239E8232403',
                    data:{
                        firstname: this.fname,
                        middlename: this.mname,
                        lastname: this.lname,
                        suffix: this.suffix, 
                        birthdate: formatted_birthdate
                    }
                })
                
                    response.data = this.responseDataDecryption(response.data)
                if (response.data && response.data.pan) {
                    this.doc_phic_acc_no_loading = false;
                    this.doc_phic_acc_no = response.data.pan;
                    this.getAccreditedDoctor(this.doc_phic_acc_no);
                }
                else{
                    this.doc_phic_acc_no_loading = false;
                    this.doc_phic_acc_no = '';
                }
            }
        },

        
        //GET PHIC ACCREDITED 
        async getAccreditedDoctor(pan) {
            let date_today = this.$moment().format('MM-DD-YYYY');
            let response = await this.$services.getEclaimsWebService({
                request_key: "IDAM",
                provider_code: 'EKDF21B239E8232403',
                data:{
                    accrecode: pan, 
                    admissiondate: date_today,
                    dischargedate: date_today
                }
            })

            response.data = this.responseDataDecryption(response.data)
            if (response.data) {
                this.is_eclaim_accredited = response.data.isaccredited;
                this.doctor_accre_no = response.data.accrecode;
                this.accreditation_start = response.data.accreditationstart;
                this.accreditation_end = response.data.accreditationend;
            }
        },

        // Utility method to format date from YYYY-MM-DD to MM-DD-YYYY for getPHICAccreditationNo only
        formatDate(date) {
            if (date && date.includes('-')) {
                const [year, month, day] = date.split('-');
                return `${month}-${day}-${year}`;
            }
            return ''; 
        },
        
        // CLEAR FORM
        clearForm(){
            if (this.get_user_type.includes('2-5') && (this.get_user_type.includes('6-1') || this.get_user_type.includes('7-1')) ||
                this.get_user_type.includes('6-1') && (this.get_user_type.includes('2-5') || this.get_user_type.includes('7-1')) || 
                this.get_user_type.includes('7-1') && (this.get_user_type.includes('2-5') || this.get_user_type.includes('6-1'))) {
                    
                let new_list_department = this.department.slice(0, this.department.length - 1)

                this.department = new_list_department
                this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Department', body: 'Please select only one department from Medical Practitioner, Doctor or Midwife.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' };
            }

            if(this.get_user_type.includes('6-1')){
                this.getDoctorSpecialization(this.department);
            }

            this.fname = ''
            this.mname = ''
            this.lname = ''
            this.suffix = ''
            this.email = ''
            this.username = ''
            this.password = ''
            this.retype_password = ''
            this.doctor_tin_no = ''
            this.doctor_code = ''
            this.contact_no = ''
            this.birth_date = ''
            this.doc_prc_license = ''
            this.doc_phic_acc_no = ''
            this.doctor_position = '',
            this.doc_ptr_no = '',
            this.doc_s2_no = '',
            this.select_specialization = ''
            this.$refs.form.resetValidation()

        },

        async submitNewUser() {
            if (this.$refs.form.validate()) {
                this.btn_loading = true;

                let random_number = Math.floor(Math.random() * 9999);
                let date_today = this.$moment().format('MMdYYYYkmmss');
                let response = await this.$services.usrAddUser({
                    request_code: 'RGJ6JF4ATK7R',
                    first_name: this.fname.trim(),
                    middle_name: this.mname ? this.mname.trim() : this.mname,
                    last_name: this.lname.trim(),
                    suffix: this.suffix ? this.suffix.trim() : this.suffix,
                    email: this.email,
                    username: this.username,
                    password: this.$crypto.SHA1(this.password).toString(),
                    user_roles: this.department,
                    user_code: random_number + this.$store.state.prv_data.provider_code + date_today,

                    ...(this.get_user_type.includes('6-1')  || this.get_user_type.includes('7-1') || this.get_user_type.includes('2-5') ? {
                        doctor_tin: this.doctor_tin_no ? this.doctor_tin_no : '',
                        doctor_code: this.doctor_code ? this.doctor_code : '',
                        contact_no: this.contact_no ? this.contact_no : '',
                        doc_phic_acc_no: this.doc_phic_acc_no ? this.doc_phic_acc_no : '',
                        doc_prc_license: this.doc_prc_license ? this.doc_prc_license : '',
                        specialization: this.select_specialization ? this.select_specialization : this.get_user_type.includes('2-5') ? 'Medical Practitioner' : 'Midwifery',
                        doctor_position: this.doctor_position ? this.doctor_position : '',
                        doc_ptr_no: this.doc_ptr_no ? this.doc_ptr_no : '',
                        doc_s2_no: this.doc_s2_no ? this.doc_s2_no : '',
                        birth_date: this.birth_date ? this.birth_date : '',
                        is_eclaim_accredited: this.is_eclaim_accredited,
                        doctor_accre_no: this.doctor_accre_no ? this.doctor_accre_no : '',
                        accreditation_start: this.accreditation_start,
                        accreditation_end: this.accreditation_end

                    } : undefined),

                    provider_code: this.$store.state.prv_data.provider_code,
                    provider_tin: this.$store.state.prv_data.provider_tin,
                    provider_reg_type: this.$store.state.usr_credentials.provider_reg_type,
                    lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                    created_by: this.$store.state.usr_credentials.user_name

                })

                if (response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
                    this.btn_loading = false;
                    if (response.data.success) {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-check-circle', color: 'success', title: 'Registration Successful', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                    } else {
                        let messages = response.data.message;

                        if (Array.isArray(messages)) {
                            messages.forEach(error => {
                                const field = this[`${error.key}_no`] !== undefined ? `${error.key}_no` : error.key;
                                if(field == 'account_name') {
                                    this['fname'] = "";
                                    this['mname'] = "";
                                    this['lname'] = "";
                                    this['suffix'] = "";
                                } else {
                                    if (this[field] !== undefined) {
                                        this[field] = "";
                                    }
                                }
                            });
                            messages = messages.map(error => error.name.charAt(0).toUpperCase() + error.name.slice(1)).join(', ');
                        }
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'User Registration', body: messages,  btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' };
                        this.btn_loading = false;
                    }
                    localStorage.removeItem('dskDo3Y');
                } else {
                    this.alert = response.error;
                }
            } 
        },

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if((event.which < 48 || event.which > 57)){
                event.preventDefault();
            }
        }
    }
}
</script>