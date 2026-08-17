<template>
    <v-container fluid style="height:100%">
        <Navbar @onQueue="onQueue"/>
        <v-row v-if="page_loader" dense justify="center" align-content="center" style="height:100%">
            <v-progress-circular size="35" color="primary" indeterminate></v-progress-circular>
            <h4 class="loader-title"> Loading Consultation Results Page... Please wait...</h4>
        </v-row>

        <div v-else>
            <!-- ON QUEUE BUTTON -->
            <v-btn @click="onQueue('for-queue')" :loading="btn_queue_load" :class="open_chat_btn ? 'float' : 'fixed'" color="blue" dark class="mt-3"> 
                <v-icon left>mdi-clipboard-list</v-icon>Put on Queue 
            </v-btn>

            <!-- CHAT BUTTON -->
            <div class="fixed" style="top:135px" >
                <v-badge :value="unreaded_msg_count > 0" :content="unreaded_msg_count" color="green pt-2" overlap left>
                    <v-btn v-if="showChat" @click="hideChat" color="blue" class="pr-10" dark>
                    <v-icon  left>mdi-chat</v-icon>Open Chat
                    </v-btn> 
                </v-badge>
            </div>

            <div class="px-md-12">
                <h2 class="page-title py-5 text-center">CONSULTATION RESULTS</h2>
                <v-card flat outlined class="mb-2 px-7 pt-3 pb-6">
                    <v-row dense align="end">
                        <v-col sm="4" cols="12">
                            <v-card-text class="label-style text-uppercase px-0">Member Name</v-card-text>
                            <v-text-field :value="member_data.member.p_name" class="value-style text-uppercase" readonly outlined dense hide-details></v-text-field>
                        </v-col>
                        <v-col sm="4" cols="12">
                            <v-card-text class="label-style text-uppercase px-0">Health Insurance Status</v-card-text>
                            <v-text-field 
                                :value="member_data.member.mem_hmo_status ?  member_data.member.mem_hmo_status : 'INACTIVE'"
                                :class="member_data.member.mem_hmo_status == 'A' || member_data.member.mem_hmo_status == 'ACTIVE' ? 'success darken-1' : 'error darken-1'"
                                class="font-weight-medium value-style text-uppercase" 
                                dark readonly outlined dense hide-details></v-text-field>
                        </v-col>

                        <v-col  sm="4" cols="12">
                            <v-card-text class="label-style text-uppercase px-0">Provider accreditation</v-card-text>
                            <v-text-field v-if="member_data.isAccredited === undefined" value="LOADING PLEASE WAIT.." class="primary font-weight-medium value-style text-uppercase" dark readonly outlined dense hide-details></v-text-field>
                            <v-text-field v-else :value="member_data.isAccredited ? 'COVERED' : 'CALL YOUR HMO PROVIDER'"
                                :class="member_data.isAccredited ? 'success darken-1' : 'error darken-1'"
                                class="font-weight-medium value-style"
                                readonly dark outlined dense hide-details></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense align="end">
                        <v-col sm="4" cols="12">
                            <v-card-text class="label-style text-uppercase px-0">Doctor Name</v-card-text>
                            <v-text-field :value="session_data.doctor_data && session_data.doctor_data.doctor_name ? session_data.doctor_data.doctor_name : 'N/A' " class="value-style text-uppercase" readonly outlined dense hide-details></v-text-field>
                        </v-col>
                        <v-col sm="4" cols="12">
                            <v-card-text class="label-style text-uppercase px-0">Specialization</v-card-text>
                            <v-text-field :value="session_data.doctor_data && session_data.doctor_data.specialization ? session_data.doctor_data.specialization : 'N/A' " class="value-style text-uppercase" readonly outlined dense hide-details></v-text-field>
                        </v-col>
                        <v-col sm="4" cols="12">
                            <v-card-text class="label-style text-uppercase px-0">Doctor accreditation</v-card-text>
                            <v-text-field :value="session_data.doctor_data && session_data.doctor_data.doctor_name ? 'ACCREDITED'  : 'N/A'" class="value-style text-uppercase" readonly outlined dense hide-details></v-text-field>
                        </v-col>
                    </v-row>
                </v-card>

                <!-- DIAGNOSIS & PROCEDURE INFO -->
                <div v-if="icd_cpt_data.length">
                    <h3 class="page-title font-weight-medium pt-5 pb-2 text-center">DIAGNOSIS</h3>
                    <v-card flat outlined class="mb-12 px-7 py-3">
                        <div v-for="(icd_data, icd_index) in icd_cpt_data" :key="icd_index">
                             <v-col cols="12" class="pb-0">
                                <v-card-text v-if="icd_index == 0" class="label-style font-weight-medium px-0 pb-0">PRIMARY DIAGNOSIS</v-card-text>
                                <v-card-text v-else-if="icd_index == 1" class="label-style font-weight-medium px-0 pb-0">SECONDARY DIAGNOSIS</v-card-text>
                                <v-card-text v-else class="label-style font-weight-medium px-0 pb-0">OTHERS DIAGNOSIS</v-card-text>
                            </v-col>

                            <!-- ICD -->
                            <v-col cols="12" align-self="center">
                                <v-text-field
                                    :value="icd_data.icd_description" 
                                    :class="icd_index === 0 && (icd_data.hmo_icd_status === 'COVERED' ||  icd_data.hmo_icd_status === 'APPROVED' )? 'icd_grn_border ': 'icd_red_border'"
                                    class="value-style"
                                    dense readonly outlined hide-details></v-text-field>
                            </v-col>

                             <!-- PROCEDURES -->
                            <div v-if="icd_data.procedure_list.length > 0" dense>
                                <v-card-text class="label-style font-weight-medium px-0 pl-7 pl-md-12 pb-0">PROCEDURES</v-card-text>
                                <v-row v-for="(cpt_data, cpt_index) in icd_data.procedure_list" :key="cpt_index" dense>
                                    <v-col md="9" sm="8" cols="12" class="pl-7 pl-md-12" align-self="center">
                                        <v-text-field :value="cpt_data.cpt_description" dense readonly outlined hide-details></v-text-field>
                                    </v-col>
                                    <v-col md="3" sm="4" cols="12">
                                        <v-row dense>
                                            <v-col cols="12" class="pl-7 pl-sm-1">
                                                <v-card v-if="cpt_data.hmo_cpt_status === 'COVERED' || cpt_data.hmo_cpt_status == 'APPROVED'"  color="success darken-1" > 
                                                    <v-card-text  class="value-style text-center white--text font-weight-bold" >{{cpt_data.hmo_cpt_status}}</v-card-text>
                                                </v-card>
                                                <v-card v-else-if="cpt_data.hmo_cpt_status.includes('COVERED UP TO')" color="yellow darken-3" > 
                                                    <v-card-text  class="value-style text-center white--text font-weight-bold" >{{cpt_data.hmo_cpt_status}}</v-card-text>
                                                </v-card>
                                                <v-card v-else color="error darken-1" > 
                                                    <v-card-text  class="value-style text-center white--text font-weight-bold" >{{cpt_data.hmo_cpt_status}}</v-card-text>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                    </v-card>
                </div>

                <!-- DOCTOR & HMO NOTES INFO -->
                <v-card :class="{'mt-12' : !icd_cpt_data.length}" class="mb-12 px-7 pt-3 pb-6" flat outlined >
                    <div v-if="hmo_icd_status === 'NEEDS APPROVAL' && hmo_cpt_status === 'NEEDS APPROVAL'" class="blinking white"> 
                        <div class="blink "><span class="blink-span">Waiting for Customer Care</span></div>
                    </div>
                
                    <v-col cols="12">
                        <v-card-text class="label-style text-uppercase px-0">Chief Complaint </v-card-text>
                        <v-row dense>
                            <v-col :class="{'col-sm-9' : !icd_cpt_data.length}" cols="12">
                                <v-textarea :value="session_data.chief_complaint" class="value-style" readonly outlined dense hide-details rows="3"></v-textarea>
                            </v-col>
                            <v-col v-if="!icd_cpt_data.length" sm="3" cols="12" align-self="center">
                                <v-card :class="hmo_cpt_status === 'COVERED' || hmo_cpt_status === 'APPROVED' ? 'success darken-1' : 'error darken-1'"> 
                                    <v-card-text  class="value-style text-center white--text font-weight-bold" >{{hmo_cpt_status}}</v-card-text>
                                </v-card>
                            
                            </v-col>
                        </v-row>
                    </v-col>
                
                    <v-col v-if="hmo_cc_notes" cols="12">
                        <v-card-text class="label-style text-uppercase px-0">Healthcare Insurance Company Notes </v-card-text>
                        <v-textarea :value="hmo_cc_notes" class="value-style" readonly outlined dense hide-details rows="3"></v-textarea>
                    </v-col>
                </v-card>

                <!-- SUBMIT / CANCEL -->
                <v-row v-if="approval_button" dense justify="center" class="my-12">
                    <v-btn  @click="resultSubmit('ISSUED')" 
                        :loading="submit_loader || !member_data.config"
                        :disabled="hmo_icd_status === 'NEEDS APPROVAL' || hmo_icd_status === 'DISAPPROVED' || btn_queue_load"
                        :block="$vuetify.breakpoint.name === 'xs'"
                        class="mb-6 mb-sm-0"
                        color="blue white--text" large rounded >PRINT LOA <v-icon right >mdi-printer</v-icon> 
                    </v-btn>
                    <v-btn  
                        v-show="session_data.is_scanned !== '2' " 
                        @click="resultCancel()"         
                        :block="$vuetify.breakpoint.name === 'xs'"
                        :disabled="submit_loader || btn_queue_load"
                        color="secondary" 
                        class="mx-sm-3" large rounded>CANCEL REQUEST OF APPROVAL<v-icon right>mdi-cancel</v-icon> 
                    </v-btn> 
                </v-row>
                <v-row v-else dense justify="center" class="my-12">
                     <v-btn  
                        @click="resultCancel()"     
                        :loading="submit_loader"    
                        :block="$vuetify.breakpoint.name === 'xs'"
                        :disabled="btn_queue_load"
                        color="primary" 
                        class="mx-sm-3" large rounded><v-icon left >mdi-arrow-left</v-icon>BACK TO HOME PAGE 
                    </v-btn> 
                </v-row>
            </div>
        </div>
        <Chat 
            v-if="showChat" 
            :transaction_number = session_data.transaction_number
            :open_chat_btn="open_chat_btn"
            :view_chat="view_chat"
            @hide-chat="hideChat"
            @unread-msg-count="getMsgCount"
        />
        <Alert :alert="alert" @resultSubmit="resultSubmit" @onQueue="onQueue"  ref="alert"/>
    </v-container>
</template>

<script>
import { mapState } from 'vuex'
import Navbar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'
import Chat from '@/components/Chat.vue'
export default {
    name:'ConsultationResult',
    components: {Navbar, Alert, Chat},

    data() {
        return {
            process_type: sessionStorage.getItem("GF45S") ? this.$crypto.AES.decrypt(sessionStorage.getItem("GF45S"),"fgGds32s").toString(this.$crypto.enc.Utf8): null,

            session_data : [],
            icd_cpt_data: [],

            hmo_icd_status:'',
            hmo_cpt_status:'',
            hmo_cc_notes: '',
            hmo_icd_limit_bal: 0,
            max_coverage_balance: 0,
            approval_button: true,
            btn_queue_load:false,
            submit_loader:false,
            is_allow_to_leave:false,


            //CHAT RELATED
            open_chat_btn:true,
            icd_cpt_timeout:'',
            view_chat:false,
            unreaded_msg_count:0,

            // FC RELATED
            trans_fc_timeout:'',

            alert:{},

        }
    },

    mounted() {
        this.getResultsData()
        this.callData()
    },

    computed: {
        ...mapState(["member_data"]),

        page_loader () {
            if (!this.member_data?.member && !this.icd_cpt_data.length > 0) return true
            return false
        },
 
        showChat () {
            return this.hmo_icd_status === 'NEEDS APPROVAL' && this.hmo_cpt_status === 'NEEDS APPROVAL' && (this.member_data.member.mem_hmo_host_code  != 'FC' && this.member_data.member.mem_hmo_host_code  != 'FL')
        }
    },

    watch:{
        hmo_cpt_status(){
            if(this.hmo_cpt_status !== 'NEEDS APPROVAL' && this.hmo_icd_status !== 'NEEDS APPROVAL'){
                clearTimeout(this.icd_cpt_timeout)
                this.view_chat = false
            }
        },
    },

    methods: {
        async callData() {
          if(!this.member_data?.config) await this.dispatchConfig();
        },
        
        async dispatchConfig() {
            let config_params = {}
            if (this.process_type.includes('HMO') || this.session_data.is_scanned === '2'){
                config_params = {post: 'HMO', host_code: this.member_data.member.mem_hmo_host_code}
            } else if (this.process_type === 'LGU' || this.process_type === 'PHIC_LGU') {
                config_params =  {post:'LGU',host_code: this.member_data.member.lgu_host_code}
            } else {
                config_params = {post:'PHIC',host_code: 'PHIC'}
            }
            await this.$store.dispatch("getHostConfig", config_params)
        },
         // FOR GETTING THE DATA NEEDED IN OP RESULTS PAGE
        getResultsData () {
            this.session_data = sessionStorage.getItem('LZ19XD15S0Y1YU') ?  JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LZ19XD15S0Y1YU'),'hEsi2Q2qY9t1').toString(this.$crypto.enc.Utf8)) : []
            this.hmo_icd_status  = this.session_data.hmo_icd_status
            this.hmo_cpt_status   = this.session_data.hmo_cpt_status
            this.hmo_icd_limit_bal = this.session_data.icd_limit_bal
            this.hmo_max_coverage_bal = this.session_data.max_coverage_bal
            this.icd_cpt_data = this.session_data.icd_cpt_data
            this.hmo_cc_notes = this.session_data.icd_cpt_data[0].hmo_cc_notes ? this.session_data.icd_cpt_data.hmo_cc_notes : null 
            if (this.session_data.hmo_cpt_status === 'DISAPPROVED') {
                this.approval_button = false
            } else if (this.session_data.hmo_icd_status === 'NEEDS APPROVAL' && this.session_data.hmo_cpt_status === 'NEEDS APPROVAL') {
                this.view_chat = true
                this.transConsultResult()
            }
        },

        async transConsultResult(){
            let response = await this.$services.getTransactionConsultationResult({
                transaction_number : this.session_data.transaction_number
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                this.icd_cpt_data         = response.data.ICD_CPT_DATA
                this.hmo_icd_status       = response.data.ICD_CPT_DATA[0].hmo_icd_status
                this.hmo_cpt_status       = response.data.ICD_CPT_DATA[0].procedure_list[0].hmo_cpt_status
                this.hmo_cc_notes         = response.data.TRANSACTION.hmo_cc_notes ? response.data.TRANSACTION.hmo_cc_notes : ''
                this.hmo_max_coverage_bal = response.data.TRANSACTION.hmo_max_coverage_bal
                this.hmo_icd_limit_bal    = response.data.ICD_CPT_DATA[0].hmo_icd_limit_bal
                this.icd_cpt_timeout  = setTimeout(() => this.transConsultResult(),3000)
            } else {
                this.alert = response.error
            }
        },

        async onQueue(type) {
            this.btn_queue_load = true;
            const request_data = {
                transaction_number: this.session_data.transaction_number,
                transaction_status: this.session_data.hmo_cpt_status === 'NEEDS APPROVAL' ? 'WAITING FOR APPROVAL' : 'FOR CONCLUSION',
                processing_by: 'clear_data',
                on_queue: this.session_data.is_scanned === '2' ? 0 : undefined
            };

            const response = await (this.session_data.is_scanned === '2' ?
                this.$services.trnUpdateLoaConsultation(request_data) :
                this.$services.trnUpdateConsultation(request_data));

            if (response.status === 200) {
                this.is_allow_to_leave = true;
                if (type === 'for-logout') {
                    this.$refs.alert.logoutUser();
                }
                sessionStorage.clear();
                this.$store.commit('removeMemberData');
                this.$router.replace('/queue-list');
            } else {
                this.alert = response.error;
            }
        },

        async resultSubmit(status) {
            this.submit_loader = status === 'ISSUED';

            let data_params;

            if (this.session_data.is_scanned !== '2') {
                let max_coverage_bal = parseFloat(this.member_data.member.hmo_max_coverage_bal) || 0;
                let hmo_icd_limit_bal = parseFloat(this.hmo_icd_limit_bal) || 0;
                let approval_code = this.member_data.config.prefix_approval_code + "-" + Math.random().toString(25).substring(2, 15).toUpperCase();

                if (status === 'ISSUED') {
                    max_coverage_bal -= parseFloat(this.member_data.member.consul_rate);
                    hmo_icd_limit_bal -= parseFloat(this.member_data.member.consul_rate);
                }

                data_params = {
                    transaction_number: this.session_data.transaction_number,
                    hmo_host_code: this.member_data.member.mem_hmo_host_code,
                    hmo_loa_amount: status === 'ISSUED' ? this.member_data.member.consul_rate : 0,
                    host_claim_type: status === 'ISSUED' ? 'FOR HMO CLAIMS' : 'NOT FOR CLAIMS',
                    hmo_max_coverage_bal: max_coverage_bal,
                    hmo_icd_limit_bal: hmo_icd_limit_bal,
                    approval_code: approval_code,
                    transaction_status: status,
                    icd_code: this.icd_cpt_data[0].icd_code,
                    concluded_by: this.$store.state.usr_credentials.user_name,
                };
            } else {
                data_params = {
                    transaction_number: this.session_data.transaction_number,
                    is_scanned: '1',
                    hmo_host_code: this.member_data.member.mem_hmo_host_code,
                    transaction_status: 'ISSUED',
                    concluded_by: this.$store.state.usr_credentials.user_name,
                };
            }

            const response = await (this.session_data.is_scanned !== '2' ?
                this.$services.trnUpdateLoaConsultation(data_params) :
                this.$services.trnUpdateConsultation(data_params));

            if (response.status === 200) {
                this.is_allow_to_leave = true;

                if (this.session_data.is_scanned === '2') {
                    sessionStorage.setItem('JXILLYS', this.$crypto.AES.encrypt(JSON.stringify({
                        policy_number: this.member_data.member.mem_hmo_policy_number,
                        host_code: this.member_data.member.mem_hmo_host_code,
                        logo: this.member_data.config.host_logo,
                        disclaimer: this.member_data.config.host_disclaimer,
                        transaction_number: this.session_data.transaction_number,
                    }), 'heIu1h1Dn1w'));
                    this.$router.replace('print-eLOA');
                } else {
                    if (status === 'CANCELLED BY PROVIDER') {
                        sessionStorage.clear();
                        return this.$router.replace('/code-scanning');
                    }

                    const session_data = {
                        transaction_number: this.session_data.transaction_number,
                        loa_generation_date: this.session_data.loa_generation_date,
                        loa_expiration_date: this.session_data.loa_expiration_date,
                        doctor_code: this.session_data.doctor_data.doctor_code,
                        doctor_name: this.session_data.doctor_data.doctor_name,
                        specialization: this.session_data.doctor_data.specialization,
                        chief_complaint: this.session_data.chief_complaint,
                        approval_code: data_params.approval_code,
                        hmo_cc_notes: this.hmo_cc_notes,
                        icd_cpt_data: this.icd_cpt_data,
                    };
                    sessionStorage.setItem('JM9SO0Y1YV', this.$crypto.AES.encrypt(JSON.stringify(session_data), 'hEsi2Q2qY9t1'));
                    this.$router.replace('/print-consultation');
                }
            } else {
                this.alert = response.error;
            }
        },

        resultCancel() {
            if (this.hmo_cpt_status === 'DISAPPROVED') {
                this.alert = { 
                    display: true, 
                    type: 'standard', 
                    width: '540', 
                    icon: 'mdi-alert-circle', 
                    color: 'blue darken-1', 
                    title: 'This transaction will be cancelled because the request was disapproved', 
                    body: '', 
                    btn_pry_txt: 'Okay', 
                    btn_pry_color: 'primary', 
                    btn_pry_otl: false, 
                    btn_pry_act: 'loadingBtn',    
                    btn_pry_emt: 'resultSubmit',
                    btn_pry_params: 'CANCELLED BY PROVIDER',
                    btn_sec_txt: 'Cancel', 
                    btn_sec_color: 'secondary', 
                    btn_sec_otl: true, 
                    btn_sec_act: 'closeAlert',
                 
                }
            } else {
                this.alert = { 
                    display: true, 
                    type: 'standard', 
                    width: '540', 
                    icon: 'mdi-help-circle', 
                    color: 'blue darken-1', 
                    title: 'Are you sure you want to Leave?', 
                    body: 'This will cancel the transaction', 
                    btn_pry_txt: 'Leave', 
                    btn_pry_color: 'secondary', 
                    btn_pry_otl: true, 
                    btn_pry_act: 'loadingBtn',    
                    btn_pry_emt: 'resultSubmit',
                    btn_pry_params: 'CANCELLED BY PROVIDER',
                    btn_sec_txt: 'Stay on this page', 
                    btn_sec_color: 'primary', 
                    btn_sec_otl: false, 
                    btn_sec_act: 'closeAlert',
                }
            }
        
        },

        onQueueAlert() {
            this.alert = { 
                display: true, 
                type: 'standard', 
                width: '620', 
                icon: 'mdi-help-circle', 
                color: 'blue darken-1', 
                title: 'Transaction will be put on queue if you leave this page', 
                body: 'Are you sure you want to leave?', 
                btn_pry_txt: 'leave', 
                btn_pry_color: 'secondary', 
                btn_pry_otl: true, 
                btn_pry_act: 'loadingBtn',  
                btn_pry_emt: 'onQueue',
                btn_pry_params: 'for-queue',
                btn_sec_txt: 'Stay on this page', 
                btn_sec_color: 'primary', 
                btn_sec_otl: false, 
                btn_sec_act: 'closeAlert',
            }
        },

        //CHAT RELATED
        hideChat(){
          this.open_chat_btn = !this.open_chat_btn
        },

        getMsgCount(count){
          this.unreaded_msg_count = count
        },
    },
    
    beforeDestroy(){
        clearInterval(this.icd_cpt_timeout)
        sessionStorage.removeItem('LZ19XD15S0Y1YU')
        sessionStorage.removeItem('oIohiK_pvcE')
    },

    beforeRouteLeave(to,from,next){
        if (this.is_allow_to_leave) return next()
        this.onQueueAlert()
        return next(false)
    },
   
}
</script>


<style scoped>

.fixed{
    position:fixed; 
    z-index:5;
    right:0;
}
.float{
    position:absolute;
    right: 0;
}
.label-style {
  font-weight: 500 ;
  padding-top:0.25em;
  padding-bottom:0.25em;
  color:#424242 !important;
  font-size: 11pt;
}
.value-style {
  font-weight: 400;
  font-size: 11pt;
  line-height: 0.8; 
}
.icd_grn_border >>> fieldset {
  border: 2px solid green !important;
}
.icd_red_border >>> fieldset {
  border: 2px solid red !important;
}
@keyframes blink{
    0%{opacity: 0;}
    50%{opacity: .5;}
    100%{opacity: 1;}
}
.blinking{
    bottom:0;
    margin:0 0 100px 0px;
    position:fixed;
    left:0;
    padding:10px !important; 
    border-radius: 4px !important; 
    z-index: 1;
}
.blink-span{
    color: red;
    font-size:24px;
    animation: blink 1s linear infinite;
}

@media screen and (max-width: 1680px){
    .label-style, .value-style{font-size:10.5pt}
}

@media screen and (max-width: 1360px){
    .label-style, .value-style{font-size:10.5pt}
}
</style>