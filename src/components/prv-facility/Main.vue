<template>
    <v-container fluid class="height-100 color-text px-7 px-lg-7 pt-5">
        <Navbar />

        <div class="d-flex flex-wrap height-80">
            <HeaderPage :title="dashboardTitle" />
            <v-col cols="12" align-self="center" class="mt-md-15" id="content">

                <v-row class="justify-center" dense>
                    <v-col v-for="(item, key) in dashboard_item" :key="key" cols="12" sm="12" md="6" lg="4" xl="4" offset-lg="0" class="pl-lg-3 pa-3" offset-xl="0"> 
                        <v-hover v-slot="{ hover }">
                            <v-card @click="dashboardFunction(item.function_name)" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" outline class="d-flex flex-column justify-space-between mt-4 card-container-items" color="white">
                                <v-row justify="start" class="py-4 px-2" dense>
                                    <v-col cols="12" sm="3" md="4" lg="4" xl="4" class="mt-3 d-flex justify-center align-center">
                                        <v-icon :size="icon_size" color="primary" class="px-5">{{ item.icon }}</v-icon>
                                    </v-col>

                                    <v-col cols="12" sm="9" md="8" lg="8" xl="8" class="mt-3" :class="$vuetify.breakpoint.smAndDown ? 'text-center' : ''">
                                        <h6 class="title pt-3 mt-5">{{ item.title }}</h6>
                                        <h6 class="caption text-xl-body-2 ">{{ item.sub_title}}</h6>
                                        <h6 class="primary--text caption font-weight-medium text-uppercase">{{ item.caption}}</h6>
                                        <h6 class="primary--text">.</h6>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-hover>
                    </v-col>
                    <!-- SCAN QR CODE -->
                    <!-- <v-col cols="12" sm="12" md="6" lg="4" xl="4" offset-lg="0" class="pl-lg-3 pa-3" offset-xl="0">
                        <v-hover v-slot="{ hover }">
                        <v-card @click="openQRScanner()" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" outline class="d-flex flex-column justify-space-between mt-4 card-container-items" flat color="white">
                            <v-row justify="start" class="py-4 px-2" dense>
                            <v-icon :size="icon_size" color="primary" class="px-5">mdi-qrcode-scan</v-icon>

                            <v-col cols="12" sm="8" md="8" lg="7" xl="9" class="mt-3">
                                <h6 class="title pt-3 mt-5">QR Scanner</h6>
                                <h6 class="caption text-xl-body-2 ">Scan QR Code on form to initiate a diagnostic laboratory.</h6>
                                <h6 class="primary--text caption font-weight-medium text-uppercase">SCAN QR IMAGE</h6>
                                <h6 class="primary--text">.</h6>
                            </v-col>
                            </v-row>
                        </v-card>
                        </v-hover>
                    </v-col> -->

                    <!-- FOR PATIENT OUTSIDE ECARE -->
                    <!-- <v-col cols="12" sm="12" md="6" lg="4" xl="4" class="pr-lg-3 pa-3">
                        <v-hover v-slot="{ hover }">
                        <v-card @click="goToPatientList()" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" outline class="d-flex primary flex-column justify-space-between mt-4 card-container-items" flat>
                            <v-row justify="start" class="py-4 px-2" dense>
                                <v-icon :size="icon_size" color="white" class="px-5">mdi-account-plus</v-icon>
                                
                                <v-col cols="12" sm="8" md="8" lg="8" xl="8" class="mt-3">
                                <h6 class="title white--text pt-3 mt-5">New Member Registration</h6>
                                <h6 class="caption text-xl-body-2 white--text">Register the patient and issue 1{{$store.state.usr_credentials.lgu_host_code === 'BT'? 'Bataan' : 'Antipolo'}} Health Card.</h6>
                                <h6 class="white--text caption font-weight-medium text-uppercase">Proceed to Registration</h6>
                                <h6 class="primary--text">.</h6>
                                </v-col>
                            </v-row> 
                        </v-card>
                        </v-hover>
                    </v-col> -->
                </v-row>
            </v-col>
        </div>

        <!-- PROCESS -->
        <v-dialog v-if="sel_adm_process.display" v-model="sel_adm_process.display" width="700" persistent>
            <v-card>
                <v-card-title class="justify-center primary white--text"><v-icon color="white" left>{{sel_adm_process.icon}}</v-icon>{{sel_adm_process.name}}</v-card-title>
                <div class="pa-5">

                    <v-col v-if="sel_adm_process.id == 'qrscanner'" cols="12" class="d-flex justify-center">
                        <div v-if="loading_qr_scanner" class="text-center">
                            <v-progress-circular color="primary" size="100" indeterminate></v-progress-circular>
                            <h4 class="light-blue--text text--darken-4 mt-5">Loading... Please wait...</h4>
                        </div>

                        <video v-show="!loading_qr_scanner" id="previews" width="100%" class="elevation-1"></video>
                    </v-col>
                </div>
                <v-divider></v-divider>
                <v-card-actions class="justify-center py-3">
                    <v-btn :disabled="loading_qr_scanner" @click="closeAdmProcess" rounded color="primary" class="px-5">CLOSE <v-icon right small>mdi-close</v-icon></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

         <!-- MEMBER SELECTION -->
        <v-dialog v-if="member_selection_dialog" v-model="member_selection_dialog" width="80%" persistent>
            <v-card justify-center>   
                <v-card-title class="justify-center text-h6 light-blue darken-4 white--text text-center">PATIENT SELECTION</v-card-title>
                <div class="px-5">
                    <v-row dense>
                        <v-col cols="12" sm="6" md="4" align-self="center" class="ml-auto py-5">
                            <v-text-field v-model="search" placeholder="Search" hide-details outlined dense></v-text-field>
                        </v-col>
                    </v-row>

                    <v-data-table
                        :headers="member_headers"
                        :items="member" 
                        :search="search"
                        :items-per-page="4"
                        :mobile-breakpoint="0"
                        :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" 
                        :loading="member_selection_loader"
                        loading-text="Loading Please Wait" 
                        class="pb-5"
                    >
                        <template v-slot:item="{ item }">
                            <template>
                                <tr @click="selectedRowLGU(item)" :class="{'blue lighten-4': item.ek_lgu_id === selected_ek_lgu_id}">
                                <td>{{ item.ek_lgu_id }}</td>
                                <td class="text-uppercase">{{(item.mem_first_name +item.mem_last_name).includes(null) ? "N/A": item.mem_first_name+(item.mem_middle_name ? " "+item.mem_middle_name : "") +" "+item.mem_last_name +(item.mem_suffix ? " "+item.mem_suffix : '')}}</td>
                                <td>{{ item.lgu_member_type  ? item.lgu_member_type.charAt(0).toUpperCase() === 'P' ? 'PRINCIPAL' : 'DEPENDENT' : 'N/A' }}</td>
                                <td>
                                    <v-img v-if="!item.mem_photo" src="@/assets/no-image.jpg" class="mx-auto my-1" width="70px" contain></v-img>
                                    <v-img :src="item.mem_photo.includes('data:image/jpeg;base64,') ? item.mem_photo : item.mem_photo+uniqueUrl" @error="item.mem_photo = require('@/assets/no-image.jpg')" class="mx-auto my-1" width="70px" contain ></v-img>
                                </td>
                                </tr>
                            </template> 
                        </template>
                    </v-data-table>
                </div>

                <v-divider></v-divider>
                <v-card-actions class="justify-center">
                    <v-btn @click="showCancel()" rounded :disabled="mem_btn_loader" class="mx-2" color="secondary" outlined> <v-icon small left>fas fa-times-circle</v-icon> CANCEL</v-btn>
                    <v-btn @click="validateSelectedMember()" :loading="mem_btn_loader" class="mx-2" color="light-blue darken-4" dark rounded>CONFIRM<v-icon small right>fas fa-check-circle</v-icon></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-overlay v-if="overlay_loader" :value="overlay_loader" z-index="9999"> 
            <v-progress-circular indeterminate size="35"></v-progress-circular>
            <span v-if="lgu_overlay" class="ml-3 text-h6 font-weight-regular" >Loading... Please Wait...</span>
        </v-overlay>

        <Alert :alert="alert" @closeAdmProcess="closeAdmProcess"/>
    </v-container>
</template>

<script> 
import Navbar from "@/components/Navbar";
import QrScanner from 'qr-scanner'; 
import Alert from '@/components/Alert.vue';
import { mapState } from 'vuex';
import HeaderPage from '@/components/e-benefit/code-scanning/Header.vue'
export default {
    props: ['dashboard_item'],
    components: {
        Navbar,
        Alert,
        HeaderPage
    },

    data() {
        return {
            // PROVIDER CONFIG LOGO
            prv_config: localStorage.getItem('dskDo3Y') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('dskDo3Y'),'ldoweSf').toString(this.$crypto.enc.Utf8)) : null, 

            //FOR RESIZE
            windowSize: {x: 0,y: 0},
            heroes_health_logo:'250',
            confirm_display_width:"60%",
            text_title:'font-size: 1.17em',
            icon_size: '75',

            // QR SCANNER RELATED
            qrScanner: null,

            // OTHERS
            loading_qr_scanner: false,
            alert: {},

            sel_adm_process: {
                display: false
            },

            member_selection_loader: false,

            // MEMBER SELECTION DIALOG
            member_headers: [
                { text: "MEMBER ID", value: "mem_hmo_policy_number", width:'150px'},
                { text: "NAME", value: "mem_first_name", width: '150px'},
                { text: "MEMBER TYPE", value: "mem_hmo_type", width: '150px'},
                { text: "PHOTO", value: "mem_photo", width: '150px' },
            ],
            member: [],
            member_selection_dialog: false,

            mem_btn_loader: false,
            search:'',
            selected_ek_lgu_id: '',
            selected_ek_hmo_id: '',

            confirm_loader: false,

            // OVERLAY
            lgu_overlay: false,
            overlay_loader: false,
            transaction_number: ''
        }
    },

    computed:{
        ...mapState(['usr_credentials']),

        uniqueUrl(){
            return '?'+Math.random().toString(25).substring(3, 20)
        },
        dashboardTitle() {
        // Dynamic condition for setting the title
        return this.$store.state.usr_credentials.department === 'PVTPharmacist'
            ? 'Pharmacist Dashboard'
            : 'Diagnostic Laboratory Dashboard';
        }
    },

    methods: {
        dashboardFunction(value) {
            if(value === 'openQRScanner') {
                this.openDialog('qrscanner');
            } else if (value === 'openMedicineInventory') {
                this.openDialog('medicineInventory')
            } else if (value === 'openQueueList'){
                this.openDialog('queueList')
            }
        },

        openDialog(codeType) {
            if (codeType === 'qrscanner') {
                this.sel_adm_process.id = codeType;
                this.sel_adm_process.display = true;
                this.sel_adm_process.name = codeType === 'qrscanner' ? 'Scan QR Image' : '';

                this.sel_adm_process.icon = codeType === 'qrscanner' ? 'mdi-qrcode-scan' : '';
                this.openScanner();
            } else if (codeType === 'medicineInventory') {
                this.openMedicineInventory()
            } else if (codeType === 'queueList'){
                this.openQueueList()
            }
        },

        async openScanner() {
            this.loading_qr_scanner = true

            const has_camera = await QrScanner.hasCamera()
            if (!has_camera) {
                this.sel_adm_process = {display: false}
                this.loading_qr_scanner = false
                return this.alert = { display: true, type: 'standard',  width: '620',  icon: 'mdi-alert-circle',  color: 'blue darken-1',  title: 'The camera is not detected or it may not be supported by the browser.',  btn_pry_txt: 'close', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
            }

            try {
                const video = document.getElementById('previews')
                this.qrScanner = new QrScanner(video, result => this.getScannedContent(result), {
                    highlightScanRegion: true,
                });
                this.qrScanner.start();
                this.loading_qr_scanner = false
            } catch (err) {
                return this.alert = { display: true, type: 'standard',  width: '620',  icon: 'mdi-alert-circle',  color: 'blue darken-1',  title: err,  btn_pry_txt: 'close', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'closeAdmProcess'}
            }
        },

        getScannedContent(content) {
            this.qrScanner.stop();
            const value = this.wsDataDecryption(content.data)
            
            if (value == 'Decryption Failed') {
                this.closeAdmProcess()
                return this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Invalid QR Image', body: 'Please make sure to use the QR image for eCare System', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            } 

            this.loading_qr_scanner = true

            let { ek_lgu_id, transaction_number } = JSON.parse(value)

            if(ek_lgu_id) {
                this.loading_qr_scanner = false
                this.transaction_number = transaction_number
                this.displayMemberData(ek_lgu_id)
            }
        },

        // FOR DISPLAYING THE LIST OF MEMBERS
        async displayMemberData(ek_lgu_id) {
            this.member_selection_dialog = true;
            this.closeAdmProcess()

            let response = await this.$services.getMemberListQr({
                mem_hmo_policy_numbe: '',
                hmo_host_code: '',
                ek_lgu_id: ek_lgu_id,
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                this.member_selection_loader = false
                // this.member = response.data.member_data
                if (ek_lgu_id) {
                    this.member = response.data.member_data.filter(item => item.ek_lgu_id === ek_lgu_id);
                }
            } else {
                this.member_selection_loader = false
                this.alert = response.error
            }
        },

        // FOR SELECTING DATA IN MEMBER SELECTION DIALOG
        selectedRowLGU(item) {
            this.selected_ek_lgu_id = item.ek_lgu_id
            this.ek_lgu_id = item.ek_lgu_id
            this.lgu_host_code = item.lgu_host_code 
            this.fname = item.mem_first_name ? item.mem_first_name : '';
            this.lname = item.mem_last_name ? item.mem_last_name : '';
            this.mname = item.mem_middle_name ? item.mem_middle_name : '';
            this.suffix = item.mem_suffix ? item.mem_suffix : ''
            this.birthdate = item.mem_birthdate ? item.mem_birthdate : null
        },

        // VALIDATES SELECTED DATA WHEN USER CLICKS CONFIRM IN MEMBER SELECTION DIALOG
        async validateSelectedMember() {
            
            if(this.selected_ek_lgu_id) {
                this.mem_btn_loader = true
                this.confirmSubmit()
            } else {
                this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Selection required', body: 'Please select a member', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }
        },

        // WHEN USER CLICKS CONFIRM IN SELECTION CONFIRM DIALOG
        async confirmSubmit() {
            this.confirm_loader = true
            this.overlay_loader = true
            this.lgu_overlay    = true
            
            if(this.selected_ek_lgu_id) {
                this.$store.dispatch('updateTransactionData', {
                    ek_lgu_id: this.selected_ek_lgu_id,
                    transaction_number: this.transaction_number
                });

                this.proceedTo()
            }
        },
      
        proceedTo() {
            if (this.usr_credentials.provider_reg_type.includes('PVT-D') || this.usr_credentials.provider_reg_type.includes('MHO') || this.usr_credentials.provider_reg_type.includes('DH') || this.usr_credentials.provider_reg_type.includes('CHO') || this.usr_credentials.provider_reg_type.includes('RHU')) {
                this.$router.push('/diagnostic-lab')
            }

            if (this.usr_credentials.provider_reg_type.includes('PVT-P')) {
                this.$router.push('/medicine-lab');
            }
        },

        // CANCELS THE MEMBER SELECTION DIALOG
        showCancel() {
            this.alert = { 
                display: true, 
                type: 'standard', 
                width: '550', 
                icon: 'mdi-help-circle', 
                color: 'blue darken-1', 
                title: 'Are you sure you want to cancel?', 
                body: 'This will reload the page and you will have to make an entry again', 
                btn_pry_txt: 'yes', 
                btn_pry_color: 'primary', 
                btn_pry_otl: false, 
                btn_pry_act: 'reloadPage',  
                btn_sec_txt: 'no', 
                btn_sec_color: 'secondary', 
                btn_sec_otl: true, 
                btn_sec_act: 'closeAlert',
            }
        },

        openMedicineInventory() {
            this.$router.push('/pvt-inventory');
        },
        
        openQueueList(){
            this.$router.push('/prv-queue-list')
        },

        closeAdmProcess() {
            if (this.sel_adm_process.id == 'qrscanner') this.closeScanner()
            return this.sel_adm_process = {display: false}
        },

        closeScanner() {
            this.qrScanner.destroy();
            this.qrScanner = null
        },
    }
}
</script>