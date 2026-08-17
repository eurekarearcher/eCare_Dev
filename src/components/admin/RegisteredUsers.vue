<template>
    <div>
        <v-overlay v-show="edit_user_loading" absolute>
            <v-progress-circular color="primary" size="80" width="4" indeterminate></v-progress-circular>
        </v-overlay>

        <h2 class="text-center grey--text text--darken-2 my-4">REGISTERED USERS</h2>
        <v-row justify="space-between" dense>
            <v-col class="mt-1 mb-2" cols="12" sm="6" md="6" lg="6">
                <label>EXPORT:</label>
                <v-btn :disabled="tbl_loading" @click="exportToExcel" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> Excel</v-btn>
            </v-col>

            <v-col cols="12" sm="6" md="5" lg="4" xl="3">
                <v-text-field v-model="tbl_search" prepend-inner-icon="mdi-magnify" label="Search" maxlength="40" clearable outlined dense></v-text-field>
            </v-col>
        </v-row>

        <v-data-table :headers="tbl_headers" :items="tbl_items" :loading="tbl_loading" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :search="tbl_search" class="elevation-2 mt-n2" mobile-breakpoint="0">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.first_name }} {{ item.middle_name }} {{ item.last_name }} {{ item.suffix }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.username }}</td>
                    <td>
                        <v-tooltip v-if="item.department_tooltip !== ''" bottom :max-width="220" fixed>
                            <template v-slot:activator="{ on }">
                                <div v-on="on">{{ item.department }}</div>
                            </template>
                            <div class="centered-tooltip">
                                <span>{{ item.department_tooltip }}</span>
                            </div>
                        </v-tooltip>
                        <div v-else>
                            {{ item.department }}
                        </div>
                    </td>
                    <td>{{ item.date_created }}</td>
                    <td>{{ item.status }}</td>
                    <td>
                        <v-btn :disabled="item.status === 'DEACTIVATED'" @click="editUser(item)" class="light-blue darken-4 white--text mr-2 my-1" small>EDIT</v-btn>
                        <v-btn :disabled="item.status === 'DEACTIVATED'" @click="confirmDeactivateUser(item)" class="error white--text my-1" small>DEACTIVATE</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>

        <!-- DIALOG FOR EDIT USER -->
        <v-dialog v-model="edit_user" width="1000" persistent>

            <v-card class="px-12 py-5">
                <h2 class="text-center grey--text text--darken-1 pb-4">EDIT USER</h2> 
                <v-divider></v-divider>
                <v-form :readonly="btn_loading" class="text-sm-right mt-8 pl-1" ref="form">
                    <div v-if="change_password">
                        <v-row align="baseline" dense>
                            <v-col cols="12" sm="3" md="3" lg="2" xl="2">
                                Current Password: <span class="required">*</span>
                            </v-col>

                            <v-col cols="12" sm="9" md="8" lg="10" xl="10" pl-sm-3 pr-sm-2>
                                <v-text-field v-model="current_password" class="my-2" :rules="current_password_rules" type="password" maxlength="30" label="Current Password" validate-on-blur outlined dense></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row align="baseline" dense>
                            <v-col cols="12" sm="3" md="3" lg="2" xl="2">
                                New Password: <span class="required">*</span>
                            </v-col>

                            <v-col cols="12" sm="9" md="8" lg="10" xl="10" pl-sm-3 pr-sm-2>
                                <v-text-field v-model="new_password" class="my-2" :rules="password_rules" type="password" maxlength="30" label="New Password" validate-on-blur outlined dense></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row align="baseline" dense>
                            <v-col cols="12" sm="3" md="3" lg="2" xl="2">
                                Re-type Password: <span class="required">*</span>
                            </v-col>

                            <v-col cols="12" sm="3" md="3" lg="2" xl="2" pl-sm-3 pr-sm-2>
                                <v-text-field v-model="retype_password" class="my-2" :rules="retype_rules" type="password" maxlength="30" label="Re-type Password" onpaste="return false" validate-on-blur outlined dense></v-text-field>
                            </v-col>
                        </v-row>
                    </div> 

                    <div v-else>
                        <v-row justify="start" align="baseline" dense>
                            <v-col cols="12" sm="3" md="3" lg="2" xl="2" class="text-start text-md-end" pr-sm-3>
                                Department: <span class="required">*</span>
                            </v-col>

                            <v-col cols="12" sm="12" md="8" lg="10" xl="10">
                                <v-autocomplete v-model="user_details.department" @change="userRolesChange($event)" class="my-2" :items="get_departments" :rules="name_rules" item-value="user_type" item-text="department" menu-props="bottom, offsetY" label="Department" outlined hide-details multiple chips deletable-chips return-object dense></v-autocomplete>
                            </v-col>
                        </v-row>
                        
                        <v-row v-if="display_specialization" align="baseline" dense>
                            <v-col v-if="specialization_input" cols="12" sm="12" md="3" lg="2" xl="2" class="text-start text-md-end" pr-3>
                                Specialization <span class="required">*</span>
                            </v-col>
                            
                            <v-col v-if="specialization_input" cols="12" sm="12" md="8" lg="10" xl="10">
                                <v-autocomplete v-model="user_details.select_specialization" class="my-2" :items="specialization_items" :loading="loading_specialization" prepend-inner-icon="mdi-magnify" :label="'Search for Specialization'" :rules="name_rules" hide-no-data outlined hide-details dense></v-autocomplete>
                            </v-col>
                        </v-row>

                        <v-row v-if="med_and_additional_input" align="baseline" dense>
                            <v-col cols="12" sm="12" md="3" lg="2" xl="2" class="text-start text-md-end" pr-sm-3>
                                Medical Position <span class="required">*</span>
                            </v-col>

                            <v-col cols="12" sm="12" md="8" lg="10" xl="10">
                                <v-text-field v-model="user_details.doctor_position" class="my-2" outlined hide-details dense></v-text-field>
                            </v-col>
                        </v-row>
                         
                        <template v-if="med_and_additional_input"> 
                            <v-row justify="start" align="baseline" dense>
                                <v-col  class="text-start text-md-end" cols="12" sm="3" md="3" lg="2" xl="2">
                                    Additional Info <span class="required mr-1">*</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="8" lg="10" xl="10">
                                    <v-row dense>
                                        <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                            <v-text-field v-model="user_details.doctor_tin" class="my-2" :rules="name_rules" :disabled="user_details.existing_doctor === '1'" ref="doc_tin" maxlength="35" label="Tin" outlined hide-details dense></v-text-field>
                                        </v-col>

                                        <!-- <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                            <v-text-field v-model="user_details.doctor_code" class="my-2" :rules="phic_rules" maxlength="35" label="Code" outlined hide-details dense></v-text-field>
                                        </v-col> -->

                                        <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                            <v-text-field v-model="user_details.doc_prc_license" class="my-2" :rules="name_rules" :disabled="user_details.existing_doctor === '1'" maxlength="35" label="Prc License" outlined hide-details dense></v-text-field>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                            <v-text-field v-model="user_details.doc_ptr_no" class="my-2" maxlength="35" label="PTR No" outlined hide-details dense></v-text-field>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                            <v-text-field v-model="user_details.doc_s2_no" class="my-2" maxlength="35" label="S2 No" outlined hide-details dense></v-text-field>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                            <v-text-field v-model="user_details.doc_phic_acc_no" class="my-2" :disabled="(user_details.doc_phic_acc_no || '').length > 0" maxlength="35" label="PHIC Accreditation No." outlined hide-details dense></v-text-field>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                            <v-text-field v-model="user_details.contact_no" class="my-2" :rules="name_rules" maxlength="11" label="Contact No." @keypress="numberOnly" outlined hide-details dense></v-text-field>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4" lg="4" xl="4">
                                            <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="user_details.birth_date" v-on="on" v-mask="birthdate_mask" class="my-2" placeholder="Date of Birth" :rules="name_rules" :disabled="user_details.existing_doctor === '1'" readonly outlined hide-details dense></v-text-field>
                                                </template>
                                                <v-date-picker v-model="birthdate_picker" @change="user_details.birth_date = newFormatDate(birthdate_picker)" :max="max_date" no-title></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </template>

                        <v-row justify="start" align="baseline" dense>
                            <v-col cols="12" sm="3" md="3" lg="2" xl="2" class="pr-3 text-start text-md-end">
                                Name: <span class="required">*</span>
                            </v-col>

                            <v-col cols="12" sm="12" md="8" lg="10" xl="10">
                                <v-row dense>
                                    <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                                        <v-text-field v-model="user_details.first_name" class="my-2" :rules="name_rules" :disabled="user_details.existing_doctor === '1'" maxlength="35" label="First name" outlined hide-details dense></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                                        <v-text-field v-model="user_details.middle_name" class="my-2" :rules="name_rules" :disabled="user_details.existing_doctor === '1'" maxlength="35" label="Middle name" outlined hide-details dense></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                                        <v-text-field v-model="user_details.last_name" class="my-2" :rules="name_rules" :disabled="user_details.existing_doctor === '1'" maxlength="35" label="Last name" outlined hide-details dense></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                                        <!-- <v-text-field v-model="user_details.suffix" class="my-2" maxlength="35" label="Suffix" outlined clearable hide-details dense></v-text-field> -->
                                        <v-select v-model="user_details.suffix" class="my-2" :items="['Jr', 'Sr', 'I', 'II', 'III', 'IV', 'V', 'VI']" outlined clearable hide-details dense> </v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                        <v-row align="baseline" dense>
                            <v-col cols="12" sm="3" md="3" lg="2" xl="2" class="pr-3 text-start text-md-end"> 
                                Email: <span class="required">*</span>
                            </v-col>

                            <v-col cols="12" sm="12" md="8" lg="10" xl="10">
                                <v-text-field v-model="user_details.email" class="my-2" :rules="email_rules" :disabled="user_details.existing_doctor === '1'" maxlength="40" label="Email" outlined hide-details dense></v-text-field>
                            </v-col>
                        </v-row>
                    </div>
                </v-form>
                <v-divider class="mb-4 mt-2"></v-divider>
        
                <v-row justify="end" dense>
                    <v-col cols="12" sm="12" md="10" lg="10" xl="12">
                        <div class="d-flex">
                            <v-btn :disabled="btn_loading" @click="change_password =! change_password, $refs.form.resetValidation()" class="primary white--text mr-2 mt-2">{{ change_password ? 'CHANGE USER INFORMATION' : 'CHANGE USER PASSWORD' }}</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn :disabled="btn_loading" @click="cancelBtn" class="grey white--text mr-2 mt-2" outlined>CANCEL</v-btn>
                            <v-btn :loading="btn_loading" @click="change_password ? confirmEditPassword() : confirmEditUser()" class="mt-2" color="green darken-3" dark>SAVE</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
        </v-dialog>

        <Alert :alert="alert" @updateRegistration="updateRegistration" ref="alert" />
    </div>
</template>

<script>
import Alert from "@/components/Alert.vue"
import { mask } from "vue-the-mask"

export default {
    directives: { mask },

    components: {
        Alert
    },

    data(){
        return{
            // TABLE
            tbl_loading: true,
            tbl_search: '',
            tbl_headers: [
                { text: 'NAME', value: 'name', width: '200px', sortable: false },
                { text: 'EMAIL', value: 'email', width: '200px', sortable: false },
                { text: 'USERNAME', value: 'username', width: '200px', sortable: false },
                { text: 'DEPARTMENT', value: 'user_type', width: '200px', sortable: false },
                { text: 'DATE REGISTERED', value: 'date_created', width: '200px', sortable: false },
                { text: 'STATUS', value: 'status', width: '150px', sortable: false },
                { text: 'ACTION', value: '', width: '220px', sortable: false },
            ],
            tbl_items: [],
            
            // EDIT USER
            edit_user_loading: false,
            edit_user: false,
            current_department: '',
            departments: [
                { text: 'Frontdesk / Nurse / Admission', value: 'Admission' },
                // { text: 'Outpatient / Inpatient - Nurse Station', value: 'Nurse Station' },
                // { text: 'Outpatient / Inpatient - Credit and Collection', value: 'Credit and Collection' },
                // { text: 'Covid 19 Laboratory', value: 'Laboratory' },
                { text: 'Pharmacist', value: 'Pharmacist'},
                { text: 'Diagnostic Laboratory', value: 'Diagnostic Laboratory'},
                { text: 'Medical Practitioner - Nurse Station', value: 'Medical Practitioner'},
            ],

            birthdate_mask: '####-##-##',
            max_date: this.$moment().format('YYYY-MM-DD'),
            birthdate_picker: '',
            birth_date: '',
            user_details: {
                doctor_tin: '',
                doctor_code: '',
                doc_prc_license: '',
                doc_phic_acc_no: '',
                doctor_position: '',
                contact_no: '',
                birth_date: '',
                username: '',
                department: '',
                first_name: '',
                middle_name: '',
                last_name: '',
                suffix: '',
                email: '',
                user_type: '',
                existing_doctor: '',
                select_specialization: ''
            },
            user_roles: [
                { department:'Admission', user_type: '2-1' },
                // { department:'Nurse Station', user_type: '2-2' },
                // { department:'Credit and Collection', user_type: '2-3' },
                { department:'Medical Practitioner', user_type: '2-5' },
                { department:'Admin', user_type: '5-1' },
                { department:'Midwife', user_type: '7-1'},
                { department:'Doctor', user_type: '6-1' },
                { department:'Pharmacist', user_type: '8-1'},
                { department:'Data Encoder', user_type: '9-1'},
                { department:'Medical Laboratory Technologists', user_type: '10-1'},
            ],

            //FOR PRIVATE FACILITY
            pvt_lab_departments: [
                { department:'Admin', user_type: '5-1' },
                { department:'Medical Laboratory Technologists', user_type: '10-1'},
            ],

            pvt_ph_departments: [
                { department:'Admin', user_type: '5-1' },
                { department:'Pharmacist',  user_type: '10-2'}
            ],

            temporary_user_roles: [],

            specialization_items: [],
            selected_doctor_holder: {},
            select_specialization: {},
            doctor_position: '',
            profession_items: [],
            loading_specialization: true,

            change_password: false,
            current_password: '',
            hidden_current_password: '',
            new_password: '',
            retype_password: '',
            btn_loading: false,

            // FORM VALIDATION
            name_rules: [v => !!v && !/^ *$/.test(v)],
            email_rules: [
                v => !!v,
                v => /.+@.+\..+/.test(v) || 'Invalid Email',
                v => !/\s/g.test(v) || 'Spaces are not allowed'
            ],
            current_password_rules: [
                v => !!v,
                v => (this.$crypto.SHA1(v).toString() === this.hidden_current_password) || 'Current password is incorrect'
            ],
            password_rules: [
                v => !!v || 'Password is required',
                v => v.length >= 8 || 'Password must be at least 8 characters',
                v => !/\s/g.test(v) || 'Spaces are not allowed',
                v => /[A-Z]/.test(v) || 'Must include at least 1 uppercase letter',
                v => /[a-z]/.test(v) || 'Must include at least 1 lowercase letter',
                v => /[0-9]/.test(v) || 'Must include at least 1 number',
                v => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Must include at least 1 special character',
            ],
            retype_rules: [
                v => !!v,
                v => (v === this.new_password) || 'New password does not match',
            ],
            alert: {}
        }
    },

    created(){
        this.getRegisteredUsers();
        this.getDoctorSpecialization();
    },

    computed: {
        med_and_additional_input() {
            return (this.temporary_user_roles.includes('6-1') || this.temporary_user_roles.includes('7-1') || this.temporary_user_roles.includes('2-5')) &&
                this.user_details.department && this.user_details.department.length > 0;
        },

        display_specialization() {
            return this.user_details.existing_doctor === '1' || (this.temporary_user_roles.includes('6-1') && this.user_details.department && this.user_details.department.length && this.user_details.select_specialization !== 'Midwife');
        },

        specialization_input() {
            return this.temporary_user_roles.includes('6-1');
        },

        get_departments() {
            if(this.$store.state.usr_credentials.provider_reg_type === 'PVT-P') {
                return this.pvt_ph_departments
            }

            if(this.$store.state.usr_credentials.provider_reg_type === 'PVT-D') {
                return this.pvt_lab_departments
            }

            return this.user_roles
        },

        phic_rules(){
            return this.temporary_user_roles.includes('6-1') || this.temporary_user_roles.includes('7-1') ? [v => !!v && !/^ *$/.test(v)] : [];
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

        userRolesChange(event) {
            this.temporary_user_roles = [];

            event.forEach(data => {
                if (!this.temporary_user_roles.includes(data.user_type)) {
                    this.temporary_user_roles.push(data.user_type);
                }
            });

            const is_doctor_selected = this.temporary_user_roles.includes('6-1');
            const is_midwife_selected = this.temporary_user_roles.includes('7-1');
            const is_medical_practitioner = this.temporary_user_roles.includes('2-5');

            if ((is_doctor_selected && (is_midwife_selected || is_medical_practitioner)) ||
                (is_midwife_selected && (is_doctor_selected || is_medical_practitioner)) ||
                (is_medical_practitioner && (is_doctor_selected || is_midwife_selected))) {
                    
                    this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'red', title: 'Department', body: 'Please select only one department from Medical Practitioner, Doctor or Midwife.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' };
                    this.user_details.department.pop();
                    return;
            }

            const selected_department = this.user_details.department.length > 0 ? this.user_details.department[0].department : null;

            if (selected_department === 'Midwife') {
                this.user_details.select_specialization = 'Midwifery';
            } else if (selected_department === 'Medical Practitioner') {
                this.user_details.select_specialization = 'Medical Practitioner';
            } else {
                this.user_details.select_specialization = this.user_details.select_specialization || null;
            }
        },

        cancelBtn() {
            this.$refs.form.reset();
            this.user_details = {
                doctor_tin: '',
                doctor_code: '',
                doc_prc_license: '',
                doc_phic_acc_no: '',
                doctor_position: '',
                contact_no: '',
                birth_date: '',
                username: '',
                department: '',
                first_name: '',
                middle_name: '',
                last_name: '',
                suffix: '',
                email: '',
                user_type: '',
                existing_doctor: '',
                select_specialization: '',
            };
            this.temporary_user_roles = [];
            this.user_details.select_specialization = null;
            this.user_details.doctor_position = null;
            this.edit_user = false;
            this.change_password = false;
        },

        formatDepartmentRoles(roles) {
                const formatted_roles = roles.map(role => {
                    if (role === 'Admission') {
                        return 'Frontdesk / Nurse / Admission';
                    } else if (role === 'Nurse Station') {
                        return 'Inpatient - Nurse Station';
                    } else if (role === 'Credit and Collection') {
                        return 'Inpatient - Credit and Collection';
                    } else if (role === 'Laboratory') {
                        return 'Covid 19 Laboratory';   
                    } else if (role === 'Admin') {
                        return 'Administrator';
                    } else if (role === 'Doctor') {
                        return 'Doctor';
                    } else if (role === 'Pharmacist') {
                        return 'Pharmacist';
                    } else if (role === 'super-admin') {
                        return 'Super Admin';
                    } else if (role === 'Data Encoder') {
                        return 'Data Encoder';
                    } else if (role === 'Medical Laboratory Technologists') {
                        return 'Medical Laboratory Technologists';
                    } else if (role === 'PVTPharmacist') {
                        return 'PVTPharmacist';
                    }else if (role === 'Medical Practitioner') {
                        return 'Medical Practitioner';
                    }else {
                        return 'Midwife';
                    }
                    
                });

            return formatted_roles.join(', ');
        },

        // GET REGISTERED USERS
        async getRegisteredUsers(){
            let response = await this.$services.getUserRegisteredUserByProvider({
                provider_tin: this.$store.state.prv_data.provider_tin,
                provider_code: this.$store.state.prv_data.provider_code
            })

            if(response.status === 200) {
                if(response.data.has_data){
                    this.tbl_items = this.responseDataDecryption(response.data.user_list)
                    this.tbl_items.forEach(element => {
                        element.date_created = this.formatDateAndTime(element.date_created);
                        
                        const users_roles = element.user_roles || [];
                        const formatted_roles = this.formatDepartmentRoles(users_roles.map(role => role.department));
                        const formatted_roles_array = formatted_roles.split(', ');

                        element.department = formatted_roles_array.length > 0 ? formatted_roles_array[0] : '';
                        element.department_tooltip = this.formatTooltip(users_roles.map(role => role.department));
                        element.roles = this.formatDepartmentRoles(users_roles.map(role => role.user_type));
                    });
                }else{
                    this.tbl_items = []
                }

                this.tbl_loading = false
            } else {
                this.alert = response.error
            }
        },

        formatTooltip(departments) {
            if (departments.length > 1) {
                return departments.join(', ');
            } else {
                return '';
            }
        },

        // EDIT USER
        async editUser(item){
            this.user_details = {}
            this.edit_user_loading = true
            let response = await this.$services.usrValidateUser({
                username: item.username,
                request_code: 'RGJ6JF4ATK7R',
                case: 'admin'
            })
            
            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                if(response.data.status === '1' || item.username === this.$store.state.usr_credentials.user_name){
                    this.user_details.doctor_tin = item.doctor_tin
                    this.user_details.doctor_code = item.doctor_code
                    this.user_details.doc_prc_license = item.doc_prc_license
                    this.user_details.doc_phic_acc_no = item.doc_phic_acc_no
                    this.user_details.doc_ptr_no = item.doc_ptr_no
                    this.user_details.doc_s2_no = item.doc_s2_no
                    this.user_details.existing_doctor = item.existing_doctor
                    this.user_details.select_specialization = item.specialization
                    this.user_details.doctor_position = item.doctor_position
                    this.user_details.contact_no = item.contact_no
                    this.user_details.birth_date = item.birth_date
                    this.user_details.username = item.username
                    this.user_details.department = item.user_roles
                    this.user_details.department = item.department
                    this.user_details.first_name = item.first_name
                    this.user_details.middle_name = item.middle_name
                    this.user_details.last_name = item.last_name
                    this.user_details.suffix = item.suffix
                    this.user_details.email = item.email
                    this.user_details.user_type = item.user_roles
                    this.hidden_current_password = item.password
                    this.edit_user = true
                    this.user_details.department = Array.isArray(item.user_roles) ? [...item.user_roles] : [];
                    this.user_details.department.map(data => { this.temporary_user_roles.push(data.user_type)});
                } else {
                    this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'User is currently logged in and might be processing a transaction', body: 'Please coordinate with this user to proceed', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                }
                
                this.edit_user_loading = false

            } else {
                this.alert = response.error
            }
        },

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if((event.which < 48 || event.which > 57)){
                event.preventDefault();
            }
        },

        // CONFIRM EDIT USER
        confirmEditUser(){
            if(this.$refs.form.validate()){
                if(this.user_details.username === this.$store.state.usr_credentials.user_name){
                    this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-help-circle', color: 'primary', title: 'User credentials will be changed and your account will be logged out', body: 'Do you want to continue?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_params: 'edit_user', btn_pry_emt: 'updateRegistration', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
                }else{
                    this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-help-circle', color: 'primary', title: 'User Credentials will be changed', body: 'Do you want to save this changes?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_params: 'edit_user', btn_pry_emt: 'updateRegistration', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
                }
            }       
        },

        // CONFIRM EDIT PASSWORD
        confirmEditPassword(){
            if(this.$refs.form.validate()){
                this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-help-circle', color: 'primary', title: 'Password will be changed', body: 'Do you want to save this changes?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_params: 'edit_password', btn_pry_emt: 'updateRegistration', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
            }
        },

        // CONFIRM DEACTIVATE USER
        confirmDeactivateUser(item){
            this.user_details = item
            this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-help-circle', color: 'primary', title: 'This user will be deactivated and the credentials will no longer be valid', body: 'Do you want to continue?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_params: 'deactivate_user', btn_pry_emt: 'updateRegistration', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
        },

        // UPDATE REGISTRATION DATA
        async updateRegistration(class_name){
            let user_roles = this.user_details.department;

            if (!Array.isArray(user_roles)) {
                user_roles = [];
            }

            this.btn_loading = true
            let response = await this.$services.usrUpdUserData({
                provider_tin: this.$store.state.prv_data.provider_tin,
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                doctor_tin: user_roles.some(role => role.user_type === '6-1' || role.user_type === '7-1' || role.user_type === '2-5') ? this.user_details.doctor_tin : '',
                doctor_code: user_roles.some(role => role.user_type === '6-1' || role.user_type === '7-1' ) ? this.user_details.doctor_code : '',
                doc_prc_license: user_roles.some(role => role.user_type === '6-1' || role.user_type === '7-1' || role.user_type === '2-5') ? this.user_details.doc_prc_license : '',
                doc_phic_acc_no: user_roles.some(role => role.user_type === '6-1' || role.user_type === '7-1') ? this.user_details.doc_phic_acc_no : '',
                doc_s2_no: user_roles.some(role => role.user_type === '6-1' || role.user_type === '7-1' || role.user_type === '2-5') ? this.user_details.doc_s2_no : undefined,
                doc_ptr_no: user_roles.some(role => role.user_type === '6-1' || role.user_type === '7-1' || role.user_type === '2-5') ? this.user_details.doc_ptr_no : undefined,
                specialization: this.user_details.select_specialization ? this.user_details.select_specialization : user_roles.some(role => role.user_type === '2-5') ? 'Medical Practitioner' : user_roles.some(role => role.user_type === '7-1') ? 'Midwife' : '',
                doctor_position: this.user_details.doctor_position,
                existing_doctor: this.user_details.existing_doctor,
                contact_no: this.user_details.contact_no,
                birth_date: this.user_details.birth_date,  
                username: this.user_details.username,
                first_name: this.user_details.first_name ? this.user_details.first_name.trim() : this.user_details.first_name,
                middle_name: this.user_details.middle_name ? this.user_details.middle_name.trim() : this.user_details.middle_name,
                last_name: this.user_details.last_name ? this.user_details.last_name.trim() : this.user_details.last_name,
                email: this.user_details.email,
                suffix: this.user_details.suffix ? this.user_details.suffix.trim() : this.user_details.suffix,
                password: class_name === 'edit_password' ? this.$crypto.SHA1(this.new_password).toString() : undefined,
                status: class_name === 'deactivate_user' ? 'DEACTIVATED' : undefined,
                user_roles: user_roles,
                key: class_name === 'edit_password' ? 'change_pw' : 'change_user_data',
                created_by: this.$store.state.usr_credentials.user_name,
            })

            if(response.status === 200) {
                if(response.data.update === 1){
                    const updated_user = this.tbl_items.find(user => user.username === this.user_details.username);

                    if (updated_user && user_roles.length > 0) {
                        const departments = user_roles.map(role => role.department).join(' , ');
                        updated_user.department = departments;
                    }
                    
                    if(this.user_details.username === this.$store.state.usr_credentials.user_name){
                        this.$refs.alert.logoutUser();
                    }else{
                        localStorage.removeItem('dskDo3Y');
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-check-circle', color: 'success', title: 'Update Successful', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                } else {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
            } else {
                this.alert = response.error
            }
        },

        // EXPORT TO EXCEL
        exportToExcel(){
            let date = this.$moment().format('MM-DD-YYYY')
            let style = {
                align: 'center',
                alignVertical: 'center',
                borderColor: '#000000',
                type: String,
                wrap: true
            }
            let schema = [
                { ...style, width: 30, column: 'NAME', value: value => value.first_name + ' ' + value.middle_name + ' ' + value.last_name},
                { ...style, width: 30, column: 'EMAIL', value: value => value.email },
                { ...style, width: 20, column: 'USERNAME', value: value => value.username },
                { ...style, width: 40, column: 'DEPARTMENT', value: value => value.department + (value.department_tooltip ? ', ' + value.department_tooltip : '') },
                { ...style, width: 25, column: 'DATE REGISTERED', value: value => value.date_created },
                { ...style, width: 20, column: 'STATUS', value: value => value.status }
            ]

            const file_name_facility = this.$store.state.prv_data.provider_name;

            this.$excel_file(this.tbl_items, {
                schema,
                headerStyle: {
                    borderColor: '#FFFFFF', 
                    fontWeight: 'bold',
                    backgroundColor: '#1565C0',
                    color:'#FFFFFF'
                },
                fileName: file_name_facility + ' - Registered User - ' + date + '.xlsx'
            })
        }
    }
}
</script>

<style scoped>
  .centered-tooltip {
    text-align: center; /* Center-align the tooltip content */
  }
</style>