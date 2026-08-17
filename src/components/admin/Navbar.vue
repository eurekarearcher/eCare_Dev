<template>
    <div v-resize="onScreenResize">
        <v-layout v-show="$store.state.loading_prv_config" class="progress-loader" align-center justify-center>
            <v-progress-circular color="primary" size="35" indeterminate></v-progress-circular>
            <h4 class="blue--text text--darken-3 pl-5">Loading Data... Please wait...</h4>
        </v-layout>

        <div v-if="!$store.state.loading_prv_config">
            <!-- TOP NAVIGATION BAR -->
            <v-app-bar class="blue darken-3 elevation-0 white--text d-print-none" height="56" app>
                <h2 class="font-weight-regular body-2">{{ $store.state.prv_data.provider_name }}</h2>
                <v-spacer></v-spacer>


                <span v-if="!mobile_screen" class="date-today">{{ date_today }}</span>
                <v-menu v-if="$store.state.usr_credentials && $store.state.usr_credentials.user_roles.length > 1" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" class="white--text" text>Department<v-icon medium>mdi-menu-down</v-icon></v-btn>
                    </template>
                    <v-list v-if="$store.state.usr_credentials">
                        <v-list-item v-for="nav in $store.state.usr_credentials.user_roles" v-show="$store.state.usr_credentials.department !== nav.department"  @click="confirmChangeDepartment(nav.department, nav.department)" :key="nav.user_type">
                            <v-list-item-title><v-icon left small>mdi-folder</v-icon>{{nav.department}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="logoutUser">
                            <v-list-item-title><v-icon left small>mdi-logout</v-icon>Log out</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <div v-else> 
                    <span v-if="!mobile_screen" @click="logoutUser" class="hover">
                        Log out
                    </span>
                </div>
                <v-btn v-if="mobile_screen" @click="open_drawer = !open_drawer" icon dark>
                    <v-icon size="35">mdi-menu</v-icon>
                </v-btn>
            </v-app-bar>

            <!-- LEFT NAVIGATION BAR -->
            <v-navigation-drawer v-model="open_drawer" :temporary="mobile_screen" :permanent="!mobile_screen" :width="mobile_screen ? '100%' : '330'" :app="!mobile_screen" :mini-variant.sync="close_drawer" class="d-print-none elevation-12 mt-14 mt-md-0" mini-variant-width="60" overlay-opacity="0" fixed>
                <v-list height="700">
                    <v-list-item>
                        <v-list-item-content v-if="!close_drawer" class="py-1">
                            <v-img v-if="$store.state.prv_config.provider_logo" :src="$store.state.prv_config.provider_logo" height="40" contain></v-img>
                            <h1 v-else class="grey--text text-center"></h1>
                        </v-list-item-content>
                        <v-btn v-if="!mobile_screen" @click="close_drawer = !close_drawer" class="mb-1" icon>
                            <v-icon size="35">mdi-menu</v-icon>
                        </v-btn>
                    </v-list-item>
                    <v-divider></v-divider>

                    <v-list-item v-if="$store.state.usr_credentials" class="mt-1">
                        <v-icon x-large>mdi-account-circle</v-icon>
                        <v-list-item-content class="ml-4">
                            <v-list-item-title class="font-weight-medium transform-text">{{ $store.state.usr_credentials.user_complete_name }}</v-list-item-title>
                            <v-list-item-subtitle>Admin</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-icon color="orange" size="28">mdi-seal</v-icon>
                    </v-list-item>

                    <v-divider></v-divider>

                    <!--GROUP LIST NAVIGATION -->
                    <v-list-group color="none" no-action v-for="(navigation_list, index) in filtered_nav" :key="index" :value="navigation_list.active" >
                            <template v-slot:prependIcon>
                                <v-icon color="grey darken-1">{{ navigation_list.icon }}</v-icon>
                            </template>
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title class="body-2">
                                        {{ navigation_list.title }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>
                            
                            <v-list-item 
                                    v-for="(routes, index) in navigation_list.routes" 
                                    :key="index"
                                    :to="routes.path"
                                    :disabled="routes.disabled"
                                    >
                                <v-list-item-title :class="routes.ekonsulta_condition ? 'body-2 pl-4 disable-link':'body-2 pl-4'">
                                {{ routes.title }}
                                </v-list-item-title>
                            </v-list-item>
                    </v-list-group>

                    <!-- LOGS -->
                    <v-list-item v-if="($store.state.super_key !== '0' && $store.state.prv_key !== null)" to="/admin/audit-logs">
                        <v-list-item-icon>
                            <v-icon color="grey darken-1">mdi-file-document</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="body-2">Audit Logs</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <!-- PHILHEALTH MIGRATION & SETUP -->
                    <!-- <v-list-item to="/admin/phic-migration-setup">
                        <v-list-item-icon>
                            <v-icon color="grey darken-1">mdi-file-upload</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="body-2">Philhealth Provider Migration & Setup</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                     -->
                    <!-- LOGOUT -->
                    <v-list-item v-if="mobile_screen" @click="logoutUser">
                        <v-list-item-icon>
                            <v-icon size="28">mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title class="body-2">Log Out</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
        
            <div class="pa-2 px-sm-4 px-md-12 mt-5">
                <RegisteredUsers v-if="$route.params.page === 'registered-users'" />
                <UserRegistration v-else-if="$route.params.page === 'user-registration'" />
                <ProviderLogo v-else-if="$route.params.page === 'provider-logo'" />
                <Disclaimer v-else-if="$route.params.page === 'disclaimer'" />
                <DatabaseCredentials v-else-if="$route.params.page === 'db-configuration'" />
                <NewsAnnouncements v-else-if="$route.params.page === 'news-announcements'" />
                <MedicalTransaction v-else-if="$route.params.page === 'medical-transaction-report'" />
                <M1 v-else-if="$route.params.page === 'm1-report'" />
                <M2 v-else-if="$route.params.page === 'm2-report'" />
                <TopCases v-else-if="$route.params.page === 'top-cases'" />
                <CostOfProcedure v-else-if="$route.params.page === 'cost-of-procedure'" />
                <EclaimsProviderAccreditation v-else-if="$route.params.page === 'eclaims-provider-accreditation'"/>
                <EkonsultaMigration v-else-if="$route.params.page === 'ekonsulta-migration'" />
                <EkonsultaSubmission v-else-if="$route.params.page === 'ekonsulta-submission'" />
                <UnrestrictSubmission v-else-if="$route.params.page === 'unrestrict'" />
                <SubmissionReport v-else-if="$route.params.page === 'report-submission'" />
                <MedicineConsumption v-else-if="$route.params.page === 'medicine-consumption-report'" />
                <Inventory v-else-if="$route.params.page === 'inventory'" />
                <MedicineHistory v-else-if="$route.params.page === 'history'" />
                <Transfer v-else-if="$route.params.page === 'transfer'" />
                <Received v-else-if="$route.params.page === 'received'" />
                <CostsOfMedicine v-else-if="$route.params.page === 'costs-of-medicine'" />
                <AuditLogs v-else-if="$route.params.page === 'audit-logs'" />
                <PhilhealthMigrationSetup v-else-if="$route.params.page === 'phic-migration-setup'" />
                <KonsultaMember v-else-if="$route.params.page === 'konsulta-member'" />
                <ProviderAccreditation v-else-if="$route.params.page === 'provider-accreditation'" />
                <EkonsultaEligibilityStatus v-else-if="$route.params.page === 'ekonsulta-eligibility-status'" />
                <XmlDownload v-else-if="$route.params.page === 'xml-downloads'" @downloadOverlayValue="downloadOverlayValue"/>
            </div>
        </div>

        <!-- FOOTER -->
        <v-footer app inset fixed >
            <v-row dense>
            </v-row>    
            <HelpVideoIcon v-if="show_help_icon" />
        </v-footer>

        <v-overlay :value="download_loading" attach :z-index="9999">
            <v-progress-circular indeterminate size="35"></v-progress-circular>
            <span  class="ml-3 text-h6 font-weight-regular" >Downloading... Please Wait...</span>
        </v-overlay>

        <Alert :alert="alert" @changeDepartment="changeDepartment"/>
        <IdleTimer />
            
    </div>
</template>

<script>
import navigation_list from '@/reference/admin-left-navigation.json'
import IdleTimer from '@/components/IdleTimer'
import RegisteredUsers from '@/components/admin/RegisteredUsers'
import UserRegistration from '@/components/admin/UserRegistration'
import ProviderLogo from '@/components/admin/ProviderLogo'
import Disclaimer from '@/components/admin/Disclaimer'
import MedicalTransaction from '@/components/admin/reports/medical-transaction/Main'
import M1 from '@/components/admin/reports/m1/Main'
import M2 from '@/components/admin/reports/M2'
import MedicineConsumption from '@/components/admin/reports/medicine-consumption/Main'
import Inventory from '@/components/admin/medicine-inventory/Inventory'
import Transfer from '@/components/admin/medicine-inventory/Transfer'
import Received from '@/components/admin/medicine-inventory/Received'
import MedicineHistory from '@/components/admin/medicine-inventory/MedicineHistory'
import EclaimsProviderAccreditation from '@/components/admin/eclaims/ProviderAccreditation'
import EkonsultaSubmission from '@/components/admin/ekonsulta/ekonsulta-unrestrict-submission/Main.vue'
import SubmissionReport from '@/components/admin/ekonsulta/ekonsulta-reports/Main'
import EkonsultaMigration from '@/components/admin/ekonsulta/EkonsultaMigration'
import CostOfProcedure from '@/components/admin/reports/cost-of-procedure/Main'
import TopCases from '@/components/admin/reports/top-reports/Main'
import CostsOfMedicine from '@/components/admin/medicine-inventory/CostsOfMedicine'
import AuditLogs from '@/components/admin/logs/Main'
import Alert from "@/components/Alert.vue"
import HelpVideoIcon from '@/components/help-video/Main.vue'
import DatabaseCredentials from '@/components/admin/db-configuration/Main.vue'
import NewsAnnouncements from '@/components/admin/news-announcement/Main.vue'
import PhilhealthMigrationSetup from '@/components/admin/philhealth-migration-setup/migration/Main.vue'
import ProviderAccreditation from '@/components/admin/philhealth-migration-setup/provider-accreditation/Main.vue'
import KonsultaMember from '@/components/admin/reports/konsulta-member/Main.vue'
import EkonsultaEligibilityStatus from '@/components/admin/ekonsulta/EkonsultaEligibilityStatus.vue'
import UnrestrictSubmission from '@/components/admin/ekonsulta/ekonsulta-unrestrict-submission/Main.vue'
import XmlDownload from '@/components/admin/philhealth-migration-setup/xml-download/Main.vue'

export default {
    components: {
        IdleTimer,
        RegisteredUsers,
        UserRegistration,
        ProviderLogo,
        Disclaimer,
        MedicalTransaction,
        M1,
        M2,
        MedicineConsumption,
        Inventory,
        Transfer,
        Received,
        CostsOfMedicine,
        Alert,
        EclaimsProviderAccreditation,
        EkonsultaSubmission,
        SubmissionReport,
        EkonsultaMigration,
        CostOfProcedure,
        TopCases,
        AuditLogs,
        HelpVideoIcon,
        MedicineHistory,
        DatabaseCredentials,
        NewsAnnouncements,
        PhilhealthMigrationSetup,
        ProviderAccreditation,
        KonsultaMember,
        EkonsultaEligibilityStatus,
        UnrestrictSubmission,
        XmlDownload
    },

    data() {
        return {
            open_drawer: false,
            close_drawer: false,
            date_today: this.$moment().format('MMMM D, YYYY'),
            window_size: { x: 0, y: 0 },
            mobile_screen: false,
            alert: {},
            navigation_list: navigation_list,
            download_loading: false
        }
    },

    created() {
        if (!localStorage.getItem('dskDo3Y')) {
            this.$store.dispatch('getProviderConfig')
        }
    },

    mounted() {
        if (this.$store.state.prv_key === null) {
            this.$nextTick(() => {
                if (this.$route.path !== '/admin/db-configuration') {
                    this.$router.push('/admin/db-configuration');
                }
            });
        }
    },

    watch: {
        '$route'(to) {
            if (to.params.page !== 'registered-users' && to.params.page !== 'user-registration' && to.params.page !== 'provider-logo' && to.params.page !== 'disclaimer' && to.params.page !== 'news-announcements'  && to.params.page !== 'db-configuration' && to.params.page !== 'medical-transaction-report' && to.params.page !== 'm1-report' && to.params.page !== 'm2-report' && to.params.page !== 'medicine-consumption-report' && to.params.page !== 'cost-of-procedure' && to.params.page !== 'top-cases' && to.params.page !== 'inventory' && to.params.page !== 'stock-level' && to.params.page !== 'transfer' && to.params.page !== 'received' && to.params.page !== 'costs-of-medicine' && to.params.page !== 'provider-accreditation' && to.params.page !== 'eclaims-provider-accreditation' && to.params.page !== 'ekonsulta-migration' && to.params.page !== 'ekonsulta-submission' && to.params.page !== 'report-submission' && to.params.page !== 'audit-logs' && to.params.page !== 'phic-migration-setup' && to.params.page !== 'konsulta-member' && to.params.page !== 'history'  && to.params.page !== 'ekonsulta-eligibility-status' && to.params.page !== 'unrestrict' && to.params.page !== 'xml-downloads' ) {
                this.$router.push('/*')
            }
        },
    },

    computed: {
        //USED COMPUTED PROPERTY FOR THE NAVIGATION TO AVOID MIXING V-FOR WITH V-IF IN ONE V-LIST-ITEM
        // filtered_nav() {
        //     let user_credentials = { ...this.$store.state.usr_credentials };
        //     this.$store.commit('setUserCredentials', user_credentials);

        //     return this.navigation_list
        //     .filter(navigation_list => 
        //         navigation_list.provider_reg_type.includes(this.$store.state.usr_credentials.provider_reg_type)
        //     )
        //     .map(navigation => {
        //         const filtered_routes = navigation.routes
        //             .filter(route => {
        //                 if (typeof route.condition === 'string') {
        //                     try {
        //                         route.condition = eval(route.condition.replace('$store.state.', 'this.$store.state.'));
        //                     } catch (error) {
        //                         return false;
        //                     }
        //                 }
        //                 return route.condition !== false;
        //             })
        //             .map(route => {
        //                 // EVALUATE ROUTE.DISABLED, ROUTE.EKONSULTA_CONDITION, ROUTE.REPORT_CONDITION AND ROUTE.MED_CONDITION STRING AND CONVERT TO BOOLEAN  
        //                 return {
        //                     ...route,
        //                     disabled: typeof route.disabled === 'string' ? eval(route.disabled.replace('$store.state.', 'this.$store.state.')) : route.disabled,
        //                     ekonsulta_condition: typeof route.ekonsulta_condition === 'string' ? eval(route.ekonsulta_condition.replace('$store.state.', 'this.$store.state.')) : route.ekonsulta_condition,
        //                     report_condition: typeof route.report_condition === 'string' ? eval(route.report_condition.replace('$store.state.', 'this.$store.state.')) : route.report_condition,
        //                     med_condition: typeof route.med_condition === 'string' ? eval(route.med_condition.replace('$store.state.', 'this.$store.state.')) : route.med_condition
        //                 };
        //             })
        //             .filter(route => route.report_condition !== false && route.med_condition !== false);

        //         return { ...navigation, routes: filtered_routes };
        //     });
        // },

        filtered_nav() {
            let user_credentials = { ...this.$store.state.usr_credentials }; 
            this.$store.commit('setUserCredentials', user_credentials); 
            let filtered = this.navigation_list .filter(nav => { 
                if (this.$store.state.prv_key === null) { 
                    return nav.title === "User-Defined Configuration"; } 
                    return nav.provider_reg_type.includes(this.$store.state.usr_credentials.provider_reg_type); })

                .map(nav => { 
                    let filtered_routes = nav.routes .filter(route => { 
                        if (this.$store.state.prv_key === null) { 
                            return route.path === "/admin/db-configuration"; 
                        }
                        // normal condition handling
                        if (typeof route.condition === 'string') { 
                            try { 
                                route.condition = eval( route.condition.replace('$store.state.', 'this.$store.state.') ); 
                            } catch (error) { 
                                return false; 
                            } 
                        } return route.condition !== false; 
                    }) 
                    .map(route => ({ 
                        ...route, 
                        disabled: typeof route.disabled === 'string' ? eval(route.disabled.replace('$store.state.', 'this.$store.state.')) 
                        : route.disabled, ekonsulta_condition: typeof route.ekonsulta_condition === 'string' ? eval(route.ekonsulta_condition.replace('$store.state.', 'this.$store.state.')) 
                        : route.ekonsulta_condition, report_condition: typeof route.report_condition === 'string' ? eval(route.report_condition.replace('$store.state.', 'this.$store.state.'))
                        : route.report_condition, med_condition: typeof route.med_condition === 'string' ? eval(route.med_condition.replace('$store.state.', 'this.$store.state.'))
                        : route.med_condition, db_condition: typeof route.db_condition === 'string' ? eval(route.db_condition.replace('$store.state.', 'this.$store.state.')) 
                        : route.db_condition , bypass_condition: typeof route.bypass_condition === 'string' ? eval(route.bypass_condition.replace('$store.state.', 'this.$store.state.')) 
                        : route.bypass_condition
                    }))
                    .filter(route => 
                        route.report_condition !== false && 
                        route.med_condition !== false && 
                        route.db_condition !== false &&
                        route.bypass_condition !== false
                    );
                    
                    return { ...nav, routes: filtered_routes }; 
                }); 
            return filtered; 
        },

        show_help_icon() { 
            return  this.$route.path === '/admin/user-registration' ||
                    this.$route.path === '/admin/top-cases' ||
                    this.$route.path === '/admin/cost-of-procedure' ||
                    this.$route.path === '/admin/medical-transaction-report' ||
                    this.$route.path === '/admin/m1-report' ||
                    this.$route.path === '/admin/m2-report' ||
                    this.$route.path === '/admin/medicine-consumption-report'
        }
    },     

    methods: {
        // SHOW DIALOG FOR CHANGING USER DEPARTMENT
        confirmChangeDepartment(department,display){
            this.alert = { 
                display: true, 
                type: 'standard', 
                width: '550', 
                icon: 'mdi-help-circle', 
                color: 'blue darken-1', 
                title: 'This will redirect you to <br class="hidden-sm-and-up">'+display, 
                body: 'Do you want to proceed?', 
                btn_pry_txt: 'Okay', 
                btn_pry_color: 'primary', 
                btn_pry_otl: false, 
                btn_pry_act: 'loadingBtn',  
                btn_pry_emt: 'changeDepartment',
                btn_pry_params: department,
                btn_sec_txt: 'Cancel', 
                btn_sec_color: 'secondary', 
                btn_sec_otl: true, 
                btn_sec_act: 'closeAlert',
            }
        },

         // REDIRECTS TO OTHER DEPARTMENT
        changeDepartment(department) {
            let user_credentials = { ...this.$store.state.usr_credentials, department: department, user_type: this.getUserType(department)}
 
            this.$store.commit('setUserCredentials', user_credentials)

            if(department === 'Admission'){
                if (this.$store.state.prv_data.hmo === 1 || this.$store.state.prv_data.lgu === 1) {
                this.$router.push('/code-scanning')
                }
            } else if(department === 'Doctor' || department === 'Midwife') {
                this.$router.push('/patient-queue-list')
            } else if(department === 'Nurse Station' || department === 'Credit and Collection') {
                this.$router.push('/patient-list')
            } else if(department === 'Pharmacist') {
                this.$router.push('/pharmacist/inventory')
            } else if (department === 'Laboratory') {
                this.$router.push('/covid-list')
            } else if(department === 'Data Encoder') {
                this.$router.push('/offline-transaction')
            } else if(department === 'Medical Laboratory Technologists') {
                this.$router.push('/diagnostic-laboratory')
            } else{
                this.$router.push('/patient-list')
            }
        },

        getUserType(data) {
            if(data === 'Admission') {
                return '2-1'
            } else if(data === 'Doctor') {
                return '6-1'
            }  else if(data === 'Midwife') {
                return '7-1'
            } else if(data === 'Pharmacist') {
                return '8-1'
            } else if(data === 'Laboratory') {
                return '4-1'
            } else if(data === 'Nurse Station') {
                return '2-2'
            }  else if(data === 'Credit and Collection') {
                return '2-3'
            } else if(data === 'Admin') {
                return '5-1'
            }  else if(data === 'Data Encoder') {
                return '9-1'
            } else {
                return ''
            }
        },

        // LOGOUT USER
        logoutUser() {
            this.alert = { display: true, type: 'logout', width: '400' }
        },

        // ON SCREEN RESIZE
        onScreenResize() {
            this.window_size = { 
                x: window.innerWidth, 
                y: window.innerHeight 
            }

            if (this.window_size.x < 960) {
                this.mobile_screen = true
                this.close_drawer = false
            } else {
                this.mobile_screen = false
            }
        },

        downloadOverlayValue(val) {
            this.download_loading = val
        }
    }
}
</script>

<style scoped>
.progress-loader { height: 100vh; }
.date-today {
    border-right: 2px solid white;
    margin-right: 15px;
    padding-right: 15px;
}
.hover { cursor: pointer; }
.disable-link {
    color: rgb(156, 156, 156);
}
::v-deep .v-footer{
    background-color: #FFF;
    position: fixed;
}
</style>