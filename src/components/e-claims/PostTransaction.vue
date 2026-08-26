<template>
    <div>
        <v-overlay v-if="track_status_loading" attach="body" class="d-flex align-center justify-center text-center" z-index="9999">
            <v-progress-circular color="primary" size="50" indeterminate />
            <h4 class="white--text text--darken-4 mt-4">Loading... Please wait...</h4>
        </v-overlay>

        <v-dialog v-if="track_status_dialog" v-model="track_status_dialog" width="950" persistent class="d-print-none">
            <v-card class="pa-1">
                <div v-if="track_status_loading" class="text-center my-8 mr-1">
                    <v-progress-circular color="primary" size="50" indeterminate></v-progress-circular>
                </div>
                <div v-else> 
                    <eConfirmation :track_status_holder="track_status_holder"/>
                </div>
                <v-card-actions class="d-flex justify-center d-print-none"> 
                    <v-btn  @click="track_status_dialog = false, track_status_holder = {}, goToPatientList()" :disabled="track_status_loading" class="mb-4" small> Proceed to Eligibility </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <Alert :alert="alert" @goToPatientList="goToPatientList" @submit-phic="postSubmitToPHICWebServices"/>
    </div>
</template>

<script>
// import Alert from './../Alert.vue'
import Alert from '@/components/Alert.vue'
import eConfirmation from './eConfirmation'

export default {
    props: ['trans_detail', 'for_action'],

    components: {
        Alert,
        eConfirmation
    },

    data() {
        return {
            post_details: {
                created_by: this.$store.state.usr_credentials.user_name,
                department: this.$store.state.usr_credentials.department,
                phic_tracking_number: this.trans_detail.phic_tracking_number,
                transaction_number: this.trans_detail.transaction_number
            },
            pci_status: false,
            pci_diagnosis_status: false,
            pci_case_rate_status: false,
            pex_status: false,
            pex_pertinent_lab_status: false,
            mat_status: false,
            ciw_status: false,
            ciw_doctors_order_status: false,
            aas_status: false,
            ctf_status: false,
            ctf_co_hcf_paid_by: false,
            ctf_certification_status: false,
            ctf_co_pf_paid_by: false,
            alert: {},

            track_status_dialog: false,
            track_status_holder: {},
            track_status_loading: false,
            // encrypting_attachment: false
        }
    },

    methods: {
        // getDataInStorage(name, key) {
        //     const data = sessionStorage.getItem(name)

        //     if (data) {
        //         return JSON.parse(this.$crypto.AES.decrypt(data, key).toString(this.$crypto.enc.Utf8))
        //     } else {
        //         return null
        //     }
        // },

        postData(path, parameters) {
            return this.$axios.post(this.$tms_url + 'resources' + path, this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                    ...parameters
                }))
            }))
            .then(response => response.data)
            .catch(error => this.showAlert(error))
        },

        showAlert(title) {
            this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: title, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        },
        
        // POST RELATION TO MEMBER
        postRelationToMember(){
            let ptd = sessionStorage.getItem('ET534D') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('ET534D'), 'fgXSd45d').toString(this.$crypto.enc.Utf8))

            if(ptd === null){
                this.postCaseRate();
            }else{
                if(ptd.status.relation){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_ptd.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            phic_tracking_number: this.trans_detail.phic_tracking_number,
                            transaction_number: this.trans_detail.transaction_number,
                            patient_rel_to_member: ptd.pat_relation
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.postCaseRate();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Patient Data', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '359', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postCaseRate();
                }
            }
        },

        // POST CASE RATE
        postCaseRate(){
            let pci = sessionStorage.getItem('OO5T6X') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('OO5T6X'), 'l4ros53s').toString(this.$crypto.enc.Utf8))
        
            if(pci === null){
                this.postFeesComputation();
            }else{
                if(pci.status.case_rate){
                    let phic_patient_case_rate = [
                        {
                            phic_patient_case_rate_id: pci.section9.phic_patient_case_rate_id ? pci.section9.phic_patient_case_rate_id : undefined,
                            ...(pci.section9.first_case_code ? {
                                first_case_rate_tag: pci.section9.first_case_rate_tag,
                                first_case_hci_fee: pci.section9.first_case_hci_fee,
                                first_case_professional_fee: pci.section9.first_case_pf_fee,
                                first_case_rate_code: pci.section9.first_case_code,
                                first_case_rate_description: pci.section9.first_case_desc,
                                first_case_rate: pci.section9.first_case_rate,
                            } : null),
                        
                            ...(pci.section9.second_case_code ? {
                                second_case_rate_tag: pci.section9.second_case_rate_tag,
                                second_case_hci_fee: pci.section9.second_case_hci_fee,
                                second_case_professional_fee: pci.section9.second_case_pf_fee,
                                second_case_rate_code: pci.section9.second_case_code,
                                second_case_rate_description: pci.section9.second_case_desc,
                                second_case_rate: pci.section9.second_case_rate
                            } : null)
                        }
                    ]

                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pci.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_case_rate',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            phic_patient_case_rate: phic_patient_case_rate
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.pci_status = true
                            this.pci_case_rate_status = true
                            this.postFeesComputation();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Patient Confinement', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postFeesComputation();
                }
            }
        },

        // POST FEES COMPUTATION
        postFeesComputation(){
            let total_fees = sessionStorage.getItem('49SFL4') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('49SFL4'), 'FoelR42s').toString(this.$crypto.enc.Utf8)) 
            
            if(total_fees === null){
                this.postChiefComplaint();
            }else{
                if(total_fees.status){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_ctf.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_certification',
                            ...(this.post_details),

                            total_health_inst_fees: total_fees.hci_fee,
                            total_professional_fees: total_fees.pf_fee,
                            grand_total: total_fees.grand_total,

                            co_hcf_phic_benefit: total_fees.hci_fee,
                            co_pf_phic_benefit: total_fees.pf_fee
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.postChiefComplaint();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Certification', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postChiefComplaint();
                }
            }
        },

        // POST CHIEF COMPLAINT
        postChiefComplaint(){
            let pci = sessionStorage.getItem('OO5T6X') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('OO5T6X'), 'l4ros53s').toString(this.$crypto.enc.Utf8))
            let confinement_date = sessionStorage.getItem('VKI55S') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('VKI55S'), 'flag423D').toString(this.$crypto.enc.Utf8))

            if(pci === null){
                this.getRTPCRList();
            }else{
                let time_admitted = '';
                if(pci.section2.period_admitted === 'PM'){
                    time_admitted = (parseInt(pci.section2.time_admitted.substring(0, 2)) + 12) + pci.section2.time_admitted.substring(2)+':00'

                    if(time_admitted.substring(0, 2) === '24'){
                        time_admitted = '12' + time_admitted.substring(2)
                    }
                }else{
                    time_admitted = pci.section2.time_admitted.substring(0, 2) + pci.section2.time_admitted.substring(2)+':00'

                    if(time_admitted.substring(0, 2) === '12'){
                        time_admitted = '00' + time_admitted.substring(2)
                    }
                }

                let time_discharged = '';
                if(pci.section2.period_discharged === 'PM'){
                    time_discharged = (parseInt(pci.section2.time_discharged.substring(0, 2)) + 12) + pci.section2.time_discharged.substring(2)+':00'

                    if(time_discharged.substring(0, 2) === '24'){
                        time_discharged = '12' + time_discharged.substring(2)
                    }
                }else{
                    time_discharged = pci.section2.time_discharged.substring(0, 2) + pci.section2.time_discharged.substring(2)+':00'

                    if(time_discharged.substring(0, 2) === '12'){
                        time_discharged = '00' + time_discharged.substring(2)
                    }
                }

                if(pci.status.admission || pci.status.others){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pci.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'transaction_main',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            chief_complaint: pci.section1,
                            date_admitted: this.defaultDate(confinement_date.date_admitted),
                            date_discharged: this.defaultDate(confinement_date.date_discharged),
                            time_admitted: time_admitted.substring(0, 8),
                            time_discharged: time_discharged.substring(0, 8)
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.getRTPCRList();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Patient Data', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.getRTPCRList();
                }
            }
        },

        // GET RT-PCR LIST
        getRTPCRList(){
            this.pci = sessionStorage.getItem('LYK56D') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LYK56D'), 'XLgopi4x').toString(this.$crypto.enc.Utf8)) : null

            if(this.pci === null){
                this.postSymptomsData();
            }else{
                if(this.pci.status){
                    this.$axios.post(this.$cms_url+'resources/api/_get_provider_cpt.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            selection_type: 'disease_test_method'
                        }))
                    }))
                    .then(response => {
                        response.data = this.responseDataDecryption(response.data)
                        this.rt_pcr_items = response.data.map(item => {
                            return item.cpt_code
                        })
        
                        this.postDischargedDiagnosis();
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postSymptomsData();
                }
            }
        },

        // POST DISCHARGED DIAGNOSIS
        postDischargedDiagnosis(){
            this.selected_rt_pcr = []
            let transaction_cpt = []
            let diagnosis = []
            
            let discharged_diagnosis = []

            if(this.pci.data.length > 0 && this.pci.old_data.length > 0){
                discharged_diagnosis = [...this.pci.data, ...this.pci.old_data]
            }else if(this.pci.data.length > 0 && this.pci.old_data.length === 0){
                discharged_diagnosis = this.pci.data
            }else{
                discharged_diagnosis = this.pci.old_data
            }
            
            discharged_diagnosis.forEach(icd => {
                if(icd.procedures.length > 0 || icd.old_procedures.length > 0){
                    let procedures = []

                    if(icd.procedures.length > 0 && icd.old_procedures.length > 0){
                        procedures = [...icd.procedures, ...icd.old_procedures]
                    }else if(icd.procedures.length > 0 && icd.old_procedures.length === 0){
                        procedures = icd.procedures
                    }else{
                        procedures = icd.old_procedures
                    }

                    procedures.forEach((cpt, index) => {
                        let current_date_of_proc = cpt.date_date ? this.defaultDate(cpt.date_date) : this.formatDateForDB(cpt.date)
                        let transaction_cpt_no = undefined

                        if(index === 0){
                            if(cpt.transaction_cpt_no){
                                transaction_cpt_no = cpt.transaction_cpt_no
                            }else{
                                if(icd.old_procedures.length > 0){
                                    let count = 0

                                    icd.old_procedures.forEach(cpt => {
                                        if(cpt.transaction_cpt_no === icd.transaction_cpt_no){
                                            count += 1
                                        }
                                    })

                                    if(count === 0){
                                        transaction_cpt_no = icd.transaction_cpt_no ? icd.transaction_cpt_no : undefined
                                    }
                                }else{
                                    transaction_cpt_no = icd.transaction_cpt_no ? icd.transaction_cpt_no : undefined
                                }
                            }
                        }else{
                            transaction_cpt_no = cpt.transaction_cpt_no ? cpt.transaction_cpt_no : undefined
                        }
                        
                        transaction_cpt.push({
                            transaction_cpt_no: transaction_cpt_no,
                            icd_tag: icd.icd_tag,
                            icd_code: icd.icd_code,
                            cpt_tag: cpt.cpt_tag,
                            cpt_code: cpt.cpt_code,
                            cpt_amount: cpt.cpt_amount.toString().replace(/,/g, ''),
                            rvs_category: cpt.category ? cpt.category : (cpt.rvs_category ? cpt.rvs_category : null),
                            original_date_of_proc: cpt.original_date ? this.defaultDate(cpt.original_date) : current_date_of_proc,
                            current_date_of_proc: current_date_of_proc,

                            ...(this.trans_detail.transaction_type === 'INPATIENT' ? {
                                hmo_icd_status: transaction_cpt_no ? icd.hmo_icd_status : 'NEEDS APPROVAL',
                                phic_icd_status: icd.phic_icd_status,
                                lgu_icd_status: null,

                                hmo_cpt_status: cpt.cpt_is_new ? 'NEEDS APPROVAL' : cpt.hmo_cpt_status,
                                phic_cpt_status: cpt.rvs_code ? 'COVERED' : 'NOT COVERED',
                                lgu_cpt_status: null
                            }: {
                                hmo_icd_status: icd.hmo_icd_status,
                                phic_icd_status: icd.phic_icd_status,
                                lgu_icd_status: null,

                                hmo_cpt_status: cpt.hmo_cpt_status,
                                phic_cpt_status: cpt.phic_cpt_status,
                                lgu_cpt_status: null
                            })
                        })

                        if(cpt.rvs_code){
                            diagnosis.push({
                                phic_patient_discharged_diagnosis_id: cpt.phic_patient_discharged_diagnosis_id,
                                icd_tag: icd.icd_tag,
                                icd_code: icd.icd_code,
                                rvs_tag: cpt.cpt_tag,
                                rvs_code: cpt.rvs_code,
                                rvs_case_rate: cpt.rvs_case_rate,
                                rvs_hci_fee: cpt.rvs_hci_fee,
                                rvs_professional_fee: cpt.rvs_professional_fee,
                                category: cpt.category ? cpt.category : cpt.rvs_category,
                                phic_laterality_check: cpt.laterality,
                                original_date_of_proc: cpt.original_date ? this.defaultDate(cpt.original_date) : current_date_of_proc,
                                current_date_of_proc: current_date_of_proc
                            })
                        }

                        // FOR LABORATORY
                        if(this.rt_pcr_items.includes(cpt.cpt_code) && cpt.cpt_is_new){
                            this.selected_rt_pcr.push(cpt.cpt_code)
                        }
                    })
                }else{
                    if(icd.icd_code){
                        transaction_cpt.push({
                            transaction_cpt_no: icd.transaction_cpt_no ? icd.transaction_cpt_no : undefined,
                            icd_tag: icd.icd_tag,
                            icd_code: icd.icd_code,

                            ...(this.trans_detail.transaction_type === 'INPATIENT' ? {
                                hmo_icd_status: icd.transaction_cpt_no ? icd.hmo_icd_status : 'NEEDS APPROVAL',
                                phic_icd_status: icd.phic_icd_status,
                                lgu_icd_status: null,
                            }: {
                                hmo_icd_status: icd.hmo_icd_status,
                                phic_icd_status: icd.phic_icd_status,
                                lgu_icd_status: null
                            })
                        })
                    }
                }

            })

            this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pci.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                    request_key: 'transaction_cpt',
                    ...(this.post_details),
                    hmo_host_code: this.trans_detail.hmo_host_code,
                    transaction_cpt: transaction_cpt
                }))
            }))
            .then(() => {
                this.pci_status = true
                this.pci_diagnosis_status = true

                if(diagnosis.length > 0){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pci.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_discharged_diagnosis',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            phic_discharged_diagnosis: diagnosis
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.postDiseaseTestCase();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Patient Data', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postDiseaseTestCase();
                }
            })
            .catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },

        // POST DISEASE TEST CASE
        postDiseaseTestCase(){
            if(this.selected_rt_pcr.length > 0){
                let patient_data = sessionStorage.getItem('ET534D') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('ET534D'), 'fgXSd45d').toString(this.$crypto.enc.Utf8)) : null
                let aas_data = sessionStorage.getItem('GLORS6') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('GLORS6'), 'dspof43S').toString(this.$crypto.enc.Utf8)) : null

                this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pci.php', this.$qs.stringify({
                    post_data: this.wsDataEncryption(JSON.stringify({
                        request_key: 'com_disease_test_cases',
                        transaction_number: this.trans_detail.transaction_number,
                        disease_test: {
                            ek_lgu_id: this.trans_detail.ek_lgu_id ? this.trans_detail.ek_lgu_id : null,
                            ek_phic_id: patient_data.pat_ek_phic_id ? patient_data.pat_ek_phic_id : null,
                            ek_hmo_id: null,
                            phic_pin: patient_data.pat_pin ? patient_data.pat_pin : null,
                            hmo_policy_number: patient_data.mem_hmo_data.mem_hmo_policy_number ? patient_data.mem_hmo_data.mem_hmo_policy_number : null,
                            provider_tin: this.$store.state.prv_data.provider_tin,
                            provider_code: this.$store.state.prv_data.provider_code,
                            doctor_tin: aas_data ? aas_data.section1[0].doc_tin : null,
                            doctor_code: aas_data ? aas_data.section1[0].doc_code : null,
                            post_doctor_tin: null,
                            post_doctor_code: null,
                            post_result_icd_code: null,
                            disease: 'covid',
                            test_result: null,
                            cpt_list: this.selected_rt_pcr
                        }
                    }))
                }))
                .then(response => {
                    if(response.data.success){
                        this.postSymptomsData();
                    }else{
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Patient Data', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                })
                .catch(error => {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                })
            }else{
                this.postSymptomsData();
            }
        },

        // POST SYMPTOMS
        postSymptomsData(){
            let pci = sessionStorage.getItem('OO5T6X') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('OO5T6X'), 'l4ros53s').toString(this.$crypto.enc.Utf8)) : null

            if(pci === null){
                this.postAnimalBite()
            }else{
                if(pci.status.symptoms){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pci.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_symptoms',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            phic_patient_symptoms: pci.section10
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.pci_status = true
                            this.postAnimalBite();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Patient Data', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postAnimalBite();
                }
            }
        },

        // POST ANIMAL BITE
        postAnimalBite(){
            let pci = sessionStorage.getItem('OO5T6X') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('OO5T6X'), 'l4ros53s').toString(this.$crypto.enc.Utf8)) : null

            if(pci === null){
                this.postEssentialNewbornCare();
            }else{
                if(pci.status.animal){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pci.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_animal_bite',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            day_0_arv_date: pci.section11.e.day_0_arv_date ? this.defaultDate(pci.section11.e.day_0_arv_date) : this.formatDateForDB(pci.section11.e.day_0_arv),
                            day_3_arv_date: pci.section11.e.day_3_arv_date ? this.defaultDate(pci.section11.e.day_3_arv_date) : this.formatDateForDB(pci.section11.e.day_3_arv),
                            day_7_arv_date: pci.section11.e.day_7_arv_date ? this.defaultDate(pci.section11.e.day_7_arv_date) : this.formatDateForDB(pci.section11.e.day_7_arv),
                            day_rig_arv_date: pci.section11.e.day_rig_arv_date ? this.defaultDate(pci.section11.e.day_rig_arv_date) : this.formatDateForDB(pci.section11.e.day_rig_arv),
                            day_others_arv_date: pci.section11.e.day_others_arv_date ? this.defaultDate(pci.section11.e.day_others_arv_date) : this.formatDateForDB(pci.section11.e.day_others_arv),
                            specify_others_arv: pci.section11.e.specify_others_arv ? pci.section11.e.specify_others_arv : ''
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.postEssentialNewbornCare();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Patient Data', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postEssentialNewbornCare();
                }
            }
        },

        // POST ESSENTIAL NEWBORN CARE
        postEssentialNewbornCare(){
            let pci = sessionStorage.getItem('OO5T6X') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('OO5T6X'), 'l4ros53s').toString(this.$crypto.enc.Utf8)) : null

            if(pci === null){
                this.postPastMedicalHistory();
            }else{
                if(pci.status.essential){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pci.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_esntl_new_born_care',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            phic_esntl_new_born_care: pci.section11.f.essential_newborn
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.pci_status = true
                            this.postPastMedicalHistory();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Patient Data', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postPastMedicalHistory();
                }
            }
        },

        // POST PAST MEDICAL HISTORY
        async postPastMedicalHistory(){
            const storage = this.getDataInStorage('OO5T6X', 'l4ros53s');
            const patient_data = this.getDataInStorage('ET534D', 'fgXSd45d');

            if(storage?.status) {
                const path = '/controller/trn_update_patient_tran_record.php'
                const parameters = {
                    request_key: 'medical_history',
                    hmo_policy_number: this.trans_detail.hmo_policy_number,
                    ek_hmo_id: '',
                    ek_phic_id: patient_data.pat_ek_phic_id,
                    ek_lgu_id: this.trans_detail.ek_lgu_id,
                    hmo_host_code: this.trans_detail.hmo_host_code,
                    phic_host_code: this.trans_detail.phic_host_code,
                    lgu_host_code: this.trans_detail.lgu_host_code,
                    mem_phic_pin: patient_data.pat_pin,
                    update_medicine: false,
                    patient_medical_history: {
                        allergies: storage.section3.pertinent.allergies,
                        past_medical_history: storage.section3.pertinent.past_medical_history,
                        previous_hospitalization: storage.section3.pertinent.previous_hospitalization,
                        previous_hospitalization_date: storage.section3.pertinent.previous_hospitalization_date,
                        previous_surgeries: storage.section3.pertinent.previous_surgeries,
                        previous_surgeries_date: storage.section3.pertinent.previous_surgeries_date
                    }
                }

                const response = await this.postData(path, parameters)

                if(response.patient_medical_history){
                    this.pci_status = true
                    this.postPatientObGyne();
                } else {
                    this.showAlert('An error occured in Patient Confinement')
                }
            } else {
                this.postPatientObGyne();
            }
            
        },

        async postPatientObGyne() {
            const storage = this.getDataInStorage('OO5T6X', 'l4ros53s');
            const patient_data = this.getDataInStorage('ET534D', 'fgXSd45d');

            if (storage?.status) {
                const path = '/controller/trn_upd_inpatient_pci.php'
                const parameters = {
                    request_key: 'patient_ob_gyne',
                    phic_tracking_number: this.trans_detail.phic_tracking_number,
                    transaction_number: this.trans_detail.transaction_number,
                    hmo_host_code: this.trans_detail.hmo_host_code,
                    ek_lgu_id: this.trans_detail.ek_lgu_id,
                    phic_number: patient_data.pat_pin,
                    gravidity: storage.section3.gravidity,
                    parity: storage.section3.parity,
                    term: storage.section3.term,
                    preterm: storage.section3.preterm,
                    abortions: storage.section3.abortions,
                    living: storage.section3.living
                }

                const response = await this.postData(path, parameters)
                
                if (response.success) {
                    this.pci_status = true
                    this.postOtherDataPCI();
                } else {
                    this.showAlert('An error occured in Patient Confinement')
                }
            } else {
                this.postOtherDataPCI();
            }
        },

        // POST OTHER DATA OF PCI
        postOtherDataPCI(){
            let pci = sessionStorage.getItem('OO5T6X') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('OO5T6X'), 'l4ros53s').toString(this.$crypto.enc.Utf8)) : null
            
            if(pci === null){
                this.postHeentData();
            }else{
                if(pci.status.others){
                    let time_expired = '';
                    if(pci.section5.status[0] === 'e'){
                        if(pci.section5.expired.period === 'PM'){
                            time_expired = (parseInt(pci.section5.expired.time.substring(0, 2)) + 12) + pci.section5.expired.time.substring(2)+':00'

                            if(time_expired.substring(0, 2) === '24'){
                                time_expired = '12' + time_expired.substring(2)
                            }
                        }else{
                            time_expired = pci.section5.expired.time.substring(0, 2) + pci.section5.expired.time.substring(2)+':00'

                            if(time_expired.substring(0, 2) === '12'){
                                time_expired = '00' + time_expired.substring(2)
                            }
                        }
                    }else{
                        pci.section5.expired.date_date = '';
                        time_expired = '';
                    }
                    
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pci.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_data',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            illness_hstry: pci.section3.illness_history,
                            
                            lmp: pci.section3.lmp_date_date ? this.defaultDate(pci.section3.lmp_date_date) : this.formatDateForDB(pci.section3.lmp_date),
                            patient_disposition: pci.section5.status ? pci.section5.status : '',
                            disposition_expiration_date: pci.section5.expired.date_date ? this.defaultDate(pci.section5.expired.date_date) : this.formatDateForDB(pci.section5.expired.date_date),
                            disposition_expiration_time: time_expired.substring(0, 8),
                            referral_prov: typeof(pci.section5.transfer.hci_name) === 'string' ? pci.section5.transfer.hci_name : pci.section5.transfer.hci_name.name,
                            referral_prov_address: pci.section5.transfer.hci_address,
                            reason_for_referral_discharged: pci.section5.transfer.hci_reason,
                            mcp_package_date1: pci.section11.c.mcp_package_date1_date ? this.defaultDate(pci.section11.c.mcp_package_date1_date) : this.formatDateForDB(pci.section11.c.mcp_package_date1),
                            mcp_package_date2: pci.section11.c.mcp_package_date2_date ? this.defaultDate(pci.section11.c.mcp_package_date2_date) : this.formatDateForDB(pci.section11.c.mcp_package_date2),
                            mcp_package_date3: pci.section11.c.mcp_package_date3_date ? this.defaultDate(pci.section11.c.mcp_package_date3_date) : this.formatDateForDB(pci.section11.c.mcp_package_date3),
                            mcp_package_date4: pci.section11.c.mcp_package_date4_date ? this.defaultDate(pci.section11.c.mcp_package_date4_date) : this.formatDateForDB(pci.section11.c.mcp_package_date4),
                            new_born_care_pkg: pci.section11.f.newborn_care_package,
                            tb_dots: pci.section11.d,
                            type_of_accom: pci.section6,
                            z_benefit: pci.section11.b,
                            hiv_treatment: pci.section11.g,
                            is_referred: pci.section4.is_referred,
                            reason_for_referral_admission: pci.section4.hci_reason,
                            originating_provider: pci.section4.hci_name,
                            originating_provider_address: pci.section4.hci_address
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.postHeentData();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Patient Data', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postHeentData();
                }
            }
        },

        // POST HEENT DATA
        postHeentData(){
            let pex = sessionStorage.getItem('034FFK') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('034FFK'), 'vcf34D3f').toString(this.$crypto.enc.Utf8))
            
            if(pex === null){
                this.postPertinentLaboratory();
            }else{
                if(pex.status.heent){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pex.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_heent',
                            ...(this.post_details),
                            phic_patient_heent: pex.section1.heent
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.pex_status = true
                            this.postPertinentLaboratory();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Physical Examination', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postPertinentLaboratory();
                }
            }
        },

        // POST PERTINENT LABORATORY
        postPertinentLaboratory(){
            let pex = sessionStorage.getItem('PGF04S') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PGF04S'), 'Fo34S40s').toString(this.$crypto.enc.Utf8))

            if(pex === null){
                this.postOtherDataPEX();
            }else{
                if(pex.status){
                    pex.data.forEach(element => {
                        element.date_of_lab = element.date_of_lab_date
                        if(!element.date_of_lab){
                            delete element.phic_patient_pertinent_laboratory_id
                            delete element.description
                            delete element.date_of_lab
                        }
                        delete element.date_of_lab_date
                    })

                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pex.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_pertinent_laboratory',
                            ...(this.post_details),
                            phic_patient_pertinent_laboratory: pex.data
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.pex_pertinent_lab_status = true
                            this.postOtherDataPEX();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Physical Examination', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postOtherDataPEX();
                }
            }
        },

        // POST OTHER DATA OF PEX
        postOtherDataPEX(){
            let pex = sessionStorage.getItem('034FFK') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('034FFK'), 'vcf34D3f').toString(this.$crypto.enc.Utf8))

            if(pex === null){
                this.postMaternityData();
            }else{
                if(pex.status.others){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pex.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_data',
                            ...(this.post_details),
                            general_survey: pex.section1.general_survey,
                            vital_sign_bp: pex.section1.vital_signs_bp,
                            vital_sign_cr: pex.section1.vital_signs_cr,
                            vital_sign_rr: pex.section1.vital_signs_rr,
                            vital_sign_temp: pex.section1.vital_signs_temp,
                            pe_chest_lungs: pex.section1.chest === undefined ? null : pex.section1.chest,
                            pe_cvs: pex.section1.cvs === undefined ? null : pex.section1.cvs,
                            pe_abdomen: pex.section1.abdomen === undefined ? null : pex.section1.abdomen,
                            pe_gu_ie: pex.section1.gu === undefined ? null : pex.section1.gu,
                            pe_skin_extremities: pex.section1.skin === undefined ? null : pex.section1.skin,
                            pe_neuro_exam: pex.section1.neuro === undefined ? null : pex.section1.neuro
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.postMaternityData();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Physical Examination', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postMaternityData();
                }
            }
        },

        // POST MATERNITY DATA
        postMaternityData(){
            let mat = sessionStorage.getItem('Z3GXX4') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('Z3GXX4'), '49oper3S').toString(this.$crypto.enc.Utf8))
            
            if(mat === null){
                this.postMaternitySubData();
            }else{
                let time_delivery = '';
                if(mat.section7.delivery_period === 'PM'){
                    time_delivery = (parseInt(mat.section7.delivery_time.substring(0, 2)) + 12) + mat.section7.delivery_time.substring(2)
                
                    if(time_delivery.substring(0, 2) === '24'){
                        time_delivery = '12' + time_delivery.substring(2)
                    }
                }else if(mat.section7.delivery_period === 'AM'){
                    time_delivery = mat.section7.delivery_time.substring(0, 2) + mat.section7.delivery_time.substring(2)

                    if(time_delivery.substring(0, 2) === '12'){
                        time_delivery = '00' + time_delivery.substring(2)
                    }
                }

                let time_discharged = '';
                if(mat.section7.discharged_period === 'PM'){
                    time_discharged = (parseInt(mat.section7.discharged_time.substring(0, 2)) + 12) + mat.section7.discharged_time.substring(2)

                    if(time_discharged.substring(0, 2) === '24'){
                        time_discharged = '12' + time_discharged.substring(2)
                    }
                }else if(mat.section7.discharged_period === 'AM'){
                    time_discharged = mat.section7.discharged_time.substring(0, 2) + mat.section7.discharged_time.substring(2)

                    if(time_discharged.substring(0, 2) === '12'){
                        time_discharged = '00' + time_discharged.substring(2)
                    }
                }
                
                if(mat.status.others){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_mat.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_maternity',
                            ...(this.post_details),
                            ek_lgu_id: this.trans_detail.ek_lgu_id,
                            ini_prenatal_consul_date: mat.section1.consultation_date_date ? this.defaultDate(mat.section1.consultation_date_date) : this.formatDateForDB(mat.section1.consultation_date),
                            vital_sign_is_normal: mat.section2.vital_sign,
                            prsnt_preg_is_low_risk: mat.section2.present_pregnancy,
                            age_of_menarche: mat.section2.age_of_menarche,
                            orientation_to_mcp: mat.section5.a,
                            expected_delivery_date: mat.section5.b_date ? this.defaultDate(mat.section5.b_date) : this.formatDateForDB(mat.section5.b),
                            date_of_delivery: mat.section7.delivery_date_date ? this.defaultDate(mat.section7.delivery_date_date) : this.formatDateForDB(mat.section7.delivery_date),
                            time_of_delivery: time_delivery.substring(0, 8),
                            mo_obstetric_index: mat.section7.maternal_outcome,
                            pu_aog_by_lmp: mat.section7.aog_by_lmp,
                            pu_manner_of_del: mat.section7.delivery_manner,
                            pu_presentation: mat.section7.presentation,
                            bo_fetal_outcome: mat.section7.fetal_outcome,
                            bo_sex: mat.section7.sex,
                            bo_birth_weight: mat.section7.birth_weight,
                            bo_apgar_score: mat.section7.apgar_score,
                            sched_postpartum_date: mat.section7.schedule_pospartum_date ? this.defaultDate(mat.section7.schedule_pospartum_date) : this.formatDateForDB(mat.section7.schedule_pospartum),
                            date_discharged: mat.section7.discharged_date_date ? this.defaultDate(mat.section7.discharged_date_date) : this.formatDateForDB(mat.section7.discharged_date),
                            time_discharged: time_discharged.substring(0, 8),

                            perinal_wound_care: mat.section8.pc_perinal_wound === false ? null : mat.section8.pc_perinal_wound,
                            perinal_wound_care_remarks: mat.section8.pc_perinal_wound_rem,
                            postpartum_complication: mat.section8.pc_complication === false ? null : mat.section8.pc_complication,
                            postpartum_complication_remarks: mat.section8.pc_complication_rem,
                            ce_bfeed_nutrition: mat.section8.pc_breastfeed === false ? null : mat.section8.pc_breastfeed,
                            ce_bfeed_nutrition_remarks: mat.section8.pc_breastfeed_rem,
                            ce_family_planning: mat.section8.pc_family_plan === false ? null : mat.section8.pc_family_plan,
                            ce_family_planning_remarks: mat.section8.pc_family_plan_rem,
                            provided_fam_planning: mat.section8.pc_provided_plan === false ? null : mat.section8.pc_provided_plan,
                            provided_fam_planning_remarks: mat.section8.pc_provided_plan_rem,
                            reffered_to_part_physician: mat.section8.pc_ref_physician === false ? null : mat.section8.pc_ref_physician,
                            reffered_to_part_physician_remarks: mat.section8.pc_ref_physician_rem,
                            sched_next_postpartum: mat.section8.pc_schedule_next === false ? null : mat.section8.pc_schedule_next,
                            sched_next_postpartum_remarks: mat.section8.pc_schedule_next_rem
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.postMaternitySubData();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Maternity', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postMaternitySubData();
                }
            }
        },

        // POST MATERNITY DATA SUB
        postMaternitySubData(){
            let mat = sessionStorage.getItem('Z3GXX4') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('Z3GXX4'), '49oper3S').toString(this.$crypto.enc.Utf8)) 

            if(mat === null){
                this.postFollowUpConsultation();
            }else{
                if(mat.status.maternity){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_mat.php', this.$qs.stringify({
                            post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_maternity_sub',
                            ...(this.post_details),
                            obstetric_risk_factor: mat.section3,
                            med_surg_risk_factor: mat.section4
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.mat_status = true
                            this.postFollowUpConsultation();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Maternity', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postFollowUpConsultation();
                }
            }
        },

        // POST FOLLOW UP CONSULTATION
        postFollowUpConsultation(){
            let mat = sessionStorage.getItem('Z3GXX4') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('Z3GXX4'), '49oper3S').toString(this.$crypto.enc.Utf8))

            if(mat === null){
                this.postDoctorsOrder();
            }else{
                if(mat.status.follow){
                    mat.section6.forEach(element => {
                        element.date_of_consul = element.date_of_consul_date
                        if(!element.date_of_consul){
                            delete element.date_of_consul
                            delete element.prenatal_consul_no
                            delete element.aog_in_weeks
                            delete element.weight
                            delete element.cardiac_rate
                            delete element.respiratory_rate
                            delete element.temperature
                            delete element.blood_pressure
                        }
                        delete element.date_of_consul_date 
                    })

                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_mat.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_prenatal_consultation',
                            ...(this.post_details),
                            phic_prenatal_consultation: mat.section6
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.mat_status = true
                            this.postDoctorsOrder();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Maternity', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postDoctorsOrder();
                }
            }
        },

        // POST DOCTORS ORDER/ACTION
        postDoctorsOrder(){
            let ciw = sessionStorage.getItem('LG4S04') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LG4S04'), '5s05SLFI').toString(this.$crypto.enc.Utf8))

            if(ciw === null){
                this.postDrugsMedicineData();
            }else{
                if(ciw.status){
                    ciw.data.forEach(element => {
                      element.date = element.date_date
                      if(!element.date){
                        delete element.phic_patient_course_in_the_ward_id
                        delete element.doctors_order
                        delete element.date
                      }
                      delete element.date_date
                    })

                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_ciw.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_course_in_the_ward',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            phic_course_in_the_ward: ciw.data
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.ciw_doctors_order_status = true
                            this.postDrugsMedicineData()
                        }else{
                            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Course in the Ward', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postDrugsMedicineData()
                }
            }
        },

        // POST DRUGS AND MEDICINE DATA
        postDrugsMedicineData(){
            let ciw = sessionStorage.getItem('PORT4D') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PORT4D'), 'X4d3r5fS').toString(this.$crypto.enc.Utf8))

            if(ciw === null){
                this.postOutcomeOfTreament();
            }else{
                if(ciw.status.medicine){
                    ciw.section3.medicine.forEach(element => {
                        element.total_cost_per_medicine = element.total_cost_per_medicine.toString().replace(/,/g, '')
                        delete element.created_by
                        delete element.date_created
                        delete element.medicine_code
                        delete element.medicine_no
                        delete element.manufacturer
                        delete element.drug_code
                        delete element.drug_class_code
                        delete element.drug_class_name
                        delete element.drug_class
                        delete element.retail_percent
                        delete element.withdraw
                        delete element.rowmarker
                        delete element.indication
                        delete element.generic_name_text
                        delete element.disabled
                        delete element.grand_total
                    })

                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_ciw.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_medicine',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            phic_patient_medicine: ciw.section3.medicine
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.ciw_status = true
                            this.postOutcomeOfTreament();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Course in the Ward', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postOutcomeOfTreament();
                }
            }
        },

        // POST OUTCOME OF TREAMENT
        postOutcomeOfTreament(){
            let ciw = sessionStorage.getItem('PORT4D') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PORT4D'), 'X4d3r5fS').toString(this.$crypto.enc.Utf8)) 

            if(ciw === null){
                this.postDoctorsInformationData();
            }else{
                if(ciw.status.outcome){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_ciw.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'transaction_main',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            outcome_of_treatment: ciw.section4.outcome_treatment,
                            outcome_of_treatment_reason: ciw.section4.outcome_treatment_reason
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.postDoctorsInformationData();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Course in the Ward', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postDoctorsInformationData();
                }
            }
        },

        // POST DOCTORS INFORMATION DATA
        postDoctorsInformationData(){
            let aas = sessionStorage.getItem('GLORS6') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('GLORS6'), 'dspof43S').toString(this.$crypto.enc.Utf8))

            if(aas === null){
                this.postPatientRelation();
            }else{
                if(aas.status.doctor){
                    aas.section1.forEach(element => {
                        delete element.doctor_selection
                        delete element.doc_fullname
                        delete element.doctor_name
                        delete element.doc_specialization
                        delete element.doctor_is_signed
                        delete element.doctor_signature
                        delete element.first_name
                        delete element.middle_name
                        delete element.last_name
                        delete element.date_signed
                        delete element.date_signed_date
                        delete element.doc_autocomplete
                    })


                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_aas.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'patient_doctor',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            input_type: 'SELECTION',
                            phic_doctor: aas.section1
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.aas_status = true
                            this.postPatientRelation();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Accreditation and Signature', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postPatientRelation();
                }
            }
        },

         // POST PATIENT RELATION
        postPatientRelation(){
            let relation_reason = sessionStorage.getItem('PDFG5F') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PDFG5F'), 'XCdx3F9D').toString(this.$crypto.enc.Utf8))
            if(relation_reason === null){
                if(this.$store.state.usr_credentials.department === 'Nurse Station'){
                    this.postSubmitToCredit();
                }else{
                    this.postCertificationData();
                }
            }else{
                if(relation_reason.status){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_aas.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_data',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            rel_to_patient: relation_reason.rel_to_patient,
                            rel_for_signing_on_behalf: relation_reason.reason_for_signing_onbehalf
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            if(this.$store.state.usr_credentials.department === 'Nurse Station'){
                                this.postSubmitToCredit();
                            }else{
                                this.postCertificationData();
                            }
                        }else{
                            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Accreditation and Signature', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    if(this.$store.state.usr_credentials.department === 'Nurse Station'){
                        this.postSubmitToCredit();
                    }else{
                        this.postCertificationData();
                    }
                }
            }
        },

        // POST SUBMIT TO CREDIT
        postSubmitToCredit(){
            if(this.for_action === 'submit'){
                this.$axios.post(this.$tms_url+'resources/controller/trn_upd_form_status.php', this.$qs.stringify({
                    post_data: this.wsDataEncryption(JSON.stringify({
                        request_key: 'transaction_main',
                        ...(this.post_details),
                        hmo_host_code: this.trans_detail.hmo_host_code,
                        ad_forms_progress_status: 'Submitted to Credit and Collection',
                        nrs_forms_progress_status: 'Submitted to Credit and Collection',
                        crd_forms_progress_status: 'Pending',
                        crd_claims_status: ''
                    }))
                }))
                .then(response => {
                    if(response.data.success){
                        sessionStorage.clear();
                        this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-check-circle', color: 'success', title: 'Forms has been successfully submitted to Credit and Collection', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }else{
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                })
                .catch(error => {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                })
            }else if(this.for_action === 'ip_result'){
                sessionStorage.clear();
                this.proceedToInpatientResult();
            }else{
                if(this.pex_pertinent_lab_status || this.ciw_doctors_order_status || this.aas_status || this.ctf_certification_status || this.ctf_co_hcf_paid_by || this.ctf_co_pf_paid_by){
                    this.getPatientData();
                }else{
                    this.removeSessionStorage();
                }
            }
        },

        // POST CERTIFICATION DATA
        postCertificationData(){
            let cert = sessionStorage.getItem('rtYIWs4') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('rtYIWs4'), 'pfdFxg44').toString(this.$crypto.enc.Utf8))

            if(cert === null){
                this.postCertificationHealth();
            }else{
                if(cert.status.certification){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_ctf.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'phic_patient_certification',
                            ...(this.post_details),
                            
                            phic_ben_is_enough: cert.phic_ben_is_enough,
                            phic_ben_is_consumed: '',
                            
                            co_hcf_amt_after_dsct: cert.co_hcf_amt_after_dsct.toString().replace(/,/g, ''),
                            co_hcf_amt_after_phic_deduc: cert.co_hcf_amt_after_phic_deduc.toString().replace(/,/g, ''),
                            co_hcf_total_actual_charges: cert.co_hcf_total_actual_charges.toString().replace(/,/g, ''),

                            co_pf_amt_after_dsct: cert.co_pf_amt_after_dsct.toString().replace(/,/g, ''),
                            co_pf_amt_after_phic_deduc: cert.co_pf_amt_after_phic_deduc.toString().replace(/,/g, ''),
                            co_pf_total_actual_charges: cert.co_pf_total_actual_charges.toString().replace(/,/g, ''),

                            nco_total_cost_diagnostic_laboratory: this.checkFormat(cert.nco_total_cost_diagnostic_laboratory),
                            nco_total_cost_med_sup: this.checkFormat(cert.nco_total_cost_med_sup)
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.ctf_certification_status = true
                            this.postCertificationHealth();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Patient Data', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postCertificationHealth();
                }
            }
        },

        // POST CERTIFICATION HEALTH
        postCertificationHealth(){
            let cert = sessionStorage.getItem('rtYIWs4') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('rtYIWs4'), 'pfdFxg44').toString(this.$crypto.enc.Utf8))

            if(cert === null){
                this.postCertificationProfessional();
            }else{
                if(cert.status.co_hcf_paid_by){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_ctf.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'co_hcf_paid_by',
                            ...(this.post_details),
                            co_hcf_paid_by: cert.co_hcf_paid_by
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.ctf_co_hcf_paid_by = true
                            this.postCertificationProfessional();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Patient Data', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postCertificationProfessional();
                }
            }
        },

        // POST CERTIFICATION PROFESSIONAL;
        postCertificationProfessional(){
            let cert = sessionStorage.getItem('rtYIWs4') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('rtYIWs4'), 'pfdFxg44').toString(this.$crypto.enc.Utf8)) 

            if(cert === null){
                this.postToAuditSector();
            }else{
                if(cert.status.co_pf_paid_by){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_ctf.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'co_pf_paid_by',
                            ...(this.post_details),
                            co_pf_paid_by: cert.co_pf_paid_by
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            this.ctf_co_pf_paid_by = true
                            this.postToAuditSector();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured in Patient Data', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.postToAuditSector();
                }
            }
        },

        // SUBMIT TO AUDIT SECTOR
        postToAuditSector(){
            if(this.for_action === 'submit'){
                if(this.trans_detail.crd_claims_status === 'Screening Rejected'){
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_form_status.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'transaction_main',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            ad_forms_progress_status: 'Submitted to Audit Sector',
                            nrs_forms_progress_status: 'Submitted to Audit Sector',
                            crd_forms_progress_status: 'Resubmitted to Audit Sector',
                            crd_claims_status: 'Pending',
                            aud_claim_status: 'Pending - Resubmitted by Provider'
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            sessionStorage.clear();
                            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-check-circle', color: 'success', title: 'Forms has been successfully submitted to Audit Sector', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }else{
                    this.$axios.post(this.$tms_url+'resources/controller/trn_upd_form_status.php', this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            request_key: 'transaction_main',
                            ...(this.post_details),
                            hmo_host_code: this.trans_detail.hmo_host_code,
                            ad_forms_progress_status: 'Submitted to Audit Sector',
                            nrs_forms_progress_status: 'Submitted to Audit Sector',
                            crd_forms_progress_status: 'Submitted to Audit Sector',
                            crd_claims_status: 'Pending',
                            aud_claim_status: 'Pending'
                        }))
                    }))
                    .then(response => {
                        if(response.data.success){
                            sessionStorage.clear();
                            this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-check-circle', color: 'success', title: 'Forms has been successfully submitted to Audit Sector', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'An error occured', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    })
                    .catch(error => {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    })
                }
            }else if(this.for_action === 'ip_result'){
                sessionStorage.clear();
                this.proceedToInpatientResult();
            }else{
                if(this.pex_pertinent_lab_status || this.ciw_doctors_order_status || this.aas_status || this.ctf_certification_status || this.ctf_co_hcf_paid_by || this.ctf_co_pf_paid_by){
                    this.getPatientData();
                }else{
                    this.removeSessionStorage();
                }
            }
        },

        getXMLAutoDownload(enc_xml){
            //GET RANDOM STRING
            let length = 16; 
            let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';

            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            //DOWNLOAD THE RESPONSE IN .XML.ENC
            const xml_string = JSON.stringify(enc_xml, null, 2);
            const xml_blob = new Blob([xml_string], { type: 'text/plain' });
            const xml_link = document.createElement('a');
            xml_link.href = URL.createObjectURL(xml_blob);
            xml_link.download = `${result}.xml.enc`; 
            document.body.appendChild(xml_link);
            document.body.removeChild(xml_link);
            xml_link.click();
        },

        async generateEncryptedFiles(request_key) {
            this.track_status_loading = true;

            let response = await this.$services.generateEclaimsAttachment({
                provider_code: this.$store.state.prv_data.provider_code,
                claim_no: this.trans_detail.claim_no,
            });

            if (response.status === 200) {
                if (response.data.success) {
                    this.track_status_loading = true;

                    if (request_key !== 'save_changes') {
                        // TRIGGER THE CLOUD STORAGE SERVICE VALIDATION IF ECLAIM TYPE IS NEW ELSE POST SUBMIT TO PHIC WEB SERVICES
                        // NEW IS EQUAVALENT TO NEW CLOUD STORAGE SERVICES
                        if(this.trans_detail.eclaim_type === 'NEW'){
                            this.cloudStorageServiceValidation(response.data)
                        } else {
                            this.postSubmitToPHICWebServices();
                        }
                    } else {
                        this.track_status_loading = false;
                        this.removeSessionStorage();
                        // this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-check-circle', color: 'success', title: 'Forms has been successfully save', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }

                } else {
                    this.track_status_loading = false;
                    this.alert = {display: true,type: 'standard',width: '500',icon: 'mdi-alert-circle',color: 'red',title: response.data.message,body: 'Please try again',btn_pry_txt: 'OK',btn_pry_color: 'primary',btn_pry_otl: false,btn_pry_act: 'reloadPage'};
                }
            } else {
                this.track_status_loading = false;
                this.alert = {display: true,type: 'standard',width: '500',icon: 'mdi-alert-circle',color: 'red',title: 'Something went wrong.',body: 'Please try again',btn_pry_txt: 'OK',btn_pry_color: 'primary',btn_pry_otl: false,btn_pry_act: 'reloadPage'};
            }
        },

        //UPLOAD OF ATTACHMENT IN ECLAIMS CLOUD STORAGE
        // async cloudStorageServiceValidation(data) {
        //     let arr_request_id_data = []

        //     //RESTRUCTURE THE PAYLOAD DATA IN CLOUD STORAGE SERVICE VALIDATION
        //     data.uploads.forEach((element) => {
        //         let request_id_data = {
        //             [element.type]: element.request_id
        //         };

        //         arr_request_id_data.push(request_id_data);
        //     });

        //     let response = await this.$services.cloudStorageServiceValidation({
        //         cloud_storage_services: arr_request_id_data,
        //         provider_code: this.$store.state.prv_data.provider_code,
        //     });

        //     if (response.status === 200) {
        //         //CHECK IF ALL THE VALIDATION DATA IS SUCCESSFUL
        //         const all_success_data = response.data.validations.every(item => item.success);

        //         // IF THE ARRAY OF OBJECT IS EMPTY (all_success_data) IT WILL PASS THE VALIDATION AND PROCEED TO POST SUBMIT TO PHIC WEB SERVICES ELSE IF THE ARRAY OF OBJECT HAS A SUCCESS:FALSE IT WILL DISPLAY THE ERROR MESSAGE
        //         if (all_success_data) {
        //             this.postSubmitToPHICWebServices();
        //         } else {
        //             const error_messages = response.data.validations.filter(item => !item.success).map(item => item.message).join('<br>');
        //             this.track_status_loading = false;
        //             this.alert = {display: true,type: 'standard',width: '500',icon: 'mdi-alert-circle',color: 'red',title: 'eClaims cloud storage validation',body: error_messages, btn_pry_txt: 'OK',btn_pry_color: 'primary',btn_pry_otl: false,btn_pry_act: 'reloadPage'};
        //         }
        //     } else {
        //         this.track_status_loading = false;
        //         this.alert = {display: true,type: 'standard',width: '500',icon: 'mdi-alert-circle',color: 'red',title: 'Something went wrong.',body: 'Please try again',btn_pry_txt: 'OK',btn_pry_color: 'primary',btn_pry_otl: false,btn_pry_act: 'reloadPage'};
        //     }
        // },

        async cloudStorageServiceValidation(data) {
            let arr_request_id_data = [];

            // RESTRUCTURE THE PAYLOAD DATA IN CLOUD STORAGE SERVICE VALIDATION
            data.uploads.forEach((element) => {
                let request_id_data = { [element.type]: element.request_id};
                arr_request_id_data.push(request_id_data);
            });

            let response = await this.$services.cloudStorageServiceValidation({
                cloud_storage_services: arr_request_id_data,
                provider_code: this.$store.state.prv_data.provider_code,
            });

            if (response.status === 200) {
                // CHECK IF ALL THE VALIDATION DATA IS SUCCESSFUL
                const all_success_data = response.data.validations.every(item => item.success);

                if (all_success_data) {
                    const uploadMessages = response.data.validations.map(item => item.message).join('<br>');
                    this.track_status_loading = false;
                    this.alert = {
                        display: true,
                        type: 'standard',
                        width: '500',
                        icon: 'mdi-check-circle',
                        color: 'success',
                        title: 'Upload Results',
                        body: uploadMessages,
                        btn_pry_txt: 'OK',
                        btn_pry_color: 'success',
                        btn_pry_otl: false,
                        btn_pry_act: 'closeAlert',
                        btn_pry_emt: 'submit-phic'
                    };
                } else {
                    const error_messages = response.data.validations.filter(item => !item.success).map(item => item.message).join('<br>');
                    this.track_status_loading = false;
                    this.alert = {display: true,type: 'standard',width: '500',icon: 'mdi-alert-circle',color: 'red',title: 'eClaims cloud storage validation',body: error_messages, btn_pry_txt: 'OK',btn_pry_color: 'primary',btn_pry_otl: false,btn_pry_act: 'reloadPage'};
                }
            } else {
                this.track_status_loading = false;
                this.alert = {display: true,type: 'standard',width: '500',icon: 'mdi-alert-circle',color: 'red',title: 'Something went wrong.',body: 'Please try again',btn_pry_txt: 'OK',btn_pry_color: 'primary',btn_pry_otl: false,btn_pry_act: 'reloadPage'};
            }
        },

        async postSubmitToPHICWebServices() {
            this.track_status_loading = true;

            let response = await this.$services.getEclaimsWebService({
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: "UeCM",
                data: {
                    claim_no: this.trans_detail.claim_no
                }
            })

             if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data);
                if (response.data.success) {
                    await this.getReceiptTicketNo(response.data);
                    this.track_status_dialog = true;
                    this.track_status_loading = false;
                } else {
                    // this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'There was a problem submitting your request', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: response.data.message, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    this.track_status_loading = false;
                }
            } else {
                this.track_status_loading = false;
                this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Something went wrong.', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        },

        async getReceiptTicketNo(data) {
            // this.track_status_loading = true
            // this.track_status_dialog = true
            let response = await this.$services.getEclaimsWebService({
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: "GUCMM",
                data: {
                    receipt_ticket_no: data.receipt_ticket_no
                }
            })

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data);
                if (response.data.success) {
                    this.track_status_holder = response.data;
                    this.getXMLAutoDownload(data.enc_xml);
                } else {
                    this.track_status_holder = {};
                }
            } else {
                this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'red', title: 'Something went wrong.', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        },

        // UPDATE/SUBMI FOR PHIC ECLAIMS
        async postSubmitToPHIC(request_key){
            //GET THE DATA FROM THE SESSION STORAGE
            let relation_reason = sessionStorage.getItem('PDFG5F') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PDFG5F'), 'XCdx3F9D').toString(this.$crypto.enc.Utf8))

            let pci_diagnosis =  sessionStorage.getItem('LYK56D') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LYK56D'),'XLgopi4x').toString(this.$crypto.enc.Utf8)) : null
            let patient_data = this.getDataInStorage('ET534D', 'fgXSd45d');
            let pci = this.getDataInStorage('OO5T6X', 'l4ros53s')
            let pex = this.getDataInStorage('034FFK', 'vcf34D3f')
            let pe_findings = this.getDataInStorage('PGF04S', 'Fo34S40s')
            let mat = this.getDataInStorage('Z3GXX4', '49oper3S')
            let ass = this.getDataInStorage('GLORS6', 'dspof43S') 
            // let total_fees = this.getDataInStorage('49SFL4', 'FoelR42s')
            let crt_data = this.getDataInStorage('rtYIWs4', 'pfdFxg44')
            let doctors_order = this.getDataInStorage('LG4S04', '5s05SLFI')
            let ciw_data = this.getDataInStorage('PORT4D', 'X4d3r5fS')
            let obstetric_risk_data = {}
            let surgical_risk_data = {}
            let essential_newborn = {}

            // CONDITION FOR obstetric_risk_factor AND med_surg_risk_factor IF THE MATERNITY IS EXISTING IN SESSIONSTORAGE
            if(mat) {
                // mat.section3.forEach(data => {
                //     obstetric_risk_data[data.key_name] = data.item_value
                // })
    
                // mat.section4.forEach(data => {
                //     surgical_risk_data[data.key_name] = data.item_value
                // })

                if (mat.section3 && typeof mat.section3 === 'object') {
                    Object.values(mat.section3).forEach(data => {
                        obstetric_risk_data[data.key_name] = data.item_value;
                    });
                }

                if (mat.section4 && typeof mat.section4 === 'object') {
                    Object.values(mat.section4).forEach(data => {
                        surgical_risk_data[data.key_name] = data.item_value;
                    });
                }
            }

            if(pci) {
                if (pci.section11?.f?.essential_newborn) {
                    essential_newborn = { ...pci.section11.f.essential_newborn };
                }
            }

            let eclaims_payload = {
                request_key: request_key,
                transaction_number: this.trans_detail.transaction_number,
                phic_packages: this.trans_detail.phic_packages,
                patient_data: {
                    member: {
                        first_name: patient_data.mem_fname,
                        middle_name: patient_data.mem_mname,
                        last_name: patient_data.mem_lname,
                        suffix: patient_data.mem_suffix,
                        mem_phic_pin: patient_data.mem_pin,
                        birthday: patient_data.mem_birthday,
                        gender: patient_data.mem_gender,
                        age: patient_data.mem_age,
                        phone_no: patient_data.mem_phone_no,
                        mobile_no: patient_data.mem_mobile_no,
                        email_add: patient_data.mem_email,
                        zip_code: patient_data.mem_zip_code,
                        mem_company_name: patient_data.mem_company_name,
                        mem_employer_phic_pin: patient_data.mem_employer_phic_pin,
                        mem_company_address: patient_data.mem_company_address,
                        ek_phic_id: null, //NO REFERRENCE
                        initial: null, //NO REFERRENCE
                        mailing_add: patient_data.mem_mailing,
                        patient_rel_to_member: null, //NO REFERRENCE
                        is_patient: 1 //NO REFERRENCE
                    },
                    patient: {
                        first_name: patient_data.pat_fname,
                        middle_name: patient_data.pat_mname,
                        last_name: patient_data.pat_lname,
                        suffix: patient_data.pat_suffix,
                        mem_phic_pin: patient_data.pat_pin,
                        birthday: patient_data.pat_birthday,
                        gender: patient_data.pat_gender,
                        age: patient_data.pat_age,
                        phone_no: patient_data.pat_phone_no,
                        mobile_no: patient_data.pat_mobile_no,
                        email_add: patient_data.pat_email,
                        zip_code: patient_data.pat_zip_code,
                        mem_company_name: patient_data.mem_company_name,
                        mem_employer_phic_pin: patient_data.mem_employer_phic_pin,
                        mem_company_address: patient_data.mem_company_address,
                        ek_phic_id: null, //NO REFERRENCE
                        initial: null, //NO REFERRENCE
                        mailing_add: patient_data.pat_mailing,
                        patient_rel_to_member: patient_data.pat_relation
                    }
                },
                ...(pci ? { 
                    patient_confinement: {
                        chief_complaint: pci.section1,
                        date_admitted: this.formatDate(pci.section2.date_admitted),
                        time_admitted: pci.section2.time_admitted,
                        date_discharged: this.formatDate(pci.section2.date_discharged),
                        time_discharged: pci.section2.time_discharged,
                        // period_admitted: pci.section2.period_admitted,
                        // period_discharged: pci.section2.period_discharged,
                        history_of_illness: pci.section3.illness_history,
                        past_medical_history: pci.section3.pertinent,
                        bg_gravidity: pci.section3.gravidity,
                        obg_parity: pci.section3.parity,
                        obg_term: pci.section3.term,
                        obg_preterm: pci.section3.preterm,
                        obg_abortions: pci.section3.abortions,
                        obg_living: pci.section3.living,
                        lmp: this.formatDate(pci.section3.lmp_date),
                        is_reffered: pci.section4.is_referred,
                        originating_provider: pci.section4.hci_name,
                        originating_provider_address: pci.section4.hci_address,
                        reason_for_referral_admission: pci.section4.hci_reason,
                        referred_hci: {
                            ...pci.section5.transfer
                        },
                        patient_disposition: pci.section5.status,
                        expired: pci.section5.status === 'e' ? pci.section5.expired : undefined,
                        type_of_accommodation: pci.section6,
                        admission_diagnosis: pci.section7,
                        diagnosis: pci_diagnosis,
                        symptoms: pci.section10, //SIGN AND SYMPTOMS SHOULD BE ARRAY
                        z_benefit: pci.section11.b,
                        ...(Object.keys(pci.section11.c).length >= 1 ? {
                            mcp_package: {
                                mcp_package_date1: pci.section11.c.mcp_package_date1 ? this.formatDate(pci.section11.c.mcp_package_date1) : undefined,
                                mcp_package_date2: pci.section11.c.mcp_package_date2 ? this.formatDate(pci.section11.c.mcp_package_date2) : undefined,
                                mcp_package_date2_date: pci.section11.c.mcp_package_date2_date ? this.formatDate(pci.section11.c.mcp_package_date2_date) : undefined,
                                mcp_package_date3: pci.section11.c.mcp_package_date3 ? this.formatDate(pci.section11.c.mcp_package_date3) : undefined,
                                mcp_package_date3_date: pci.section11.c.mcp_package_date3_date ? this.formatDate(pci.section11.c.mcp_package_date3_date) : undefined,
                                mcp_package_date4: pci.section11.c.mcp_package_date4 ? this.formatDate(pci.section11.c.mcp_package_date4) : undefined,
                                mcp_package_date4_date: pci.section11.c.mcp_package_date4_date ? this.formatDate(pci.section11.c.mcp_package_date4_date) : undefined,
                            } 
                        }: undefined),
                        tb_dots: pci.section11.d,
                        ntp_card_no: pci.section11.ntp_card_no,
                        ...(Object.keys(pci.section11.e).length >= 1 ? { 
                            animal_bite: {
                                day_0_arv_date: pci.section11.e.day_0_arv ? this.formatDate(pci.section11.e.day_0_arv) : undefined,
                                day_3_arv_date: pci.section11.e.day_3_arv ? this.formatDate(pci.section11.e.day_3_arv) : undefined,
                                day_7_arv_date: pci.section11.e.day_7_arv ? this.formatDate(pci.section11.e.day_7_arv) : undefined,
                                day_rig_arv_date: pci.section11.e.day_rig_arv ? this.formatDate(pci.section11.e.day_rig_arv) : undefined,
                                day_others_arv_date: pci.section11.e.day_others_arv ? this.formatDate(pci.section11.e.day_others_arv) : undefined,
                                specify_others_arv: pci.section11.e.specify_others_arv ? pci.section11.e.specify_others_arv : undefined
                            },
                        }: undefined),
                        new_born_care_pkg: { 
                            filter_card_no: pci.section11.f.filter_card_no,
                            newborn_care_package: pci.section11.f.newborn_care_package,
                            essential_newborn
                        },
                        hiv_treatment_lab_no: pci.section11.g 
                    }
                } : undefined),
                ...(pex ? { 
                    physical_exam: {
                         //THE VALUE SHOULD BE AN ARRAY OF OBJECT
                        // attachment: pex ? pex.section2.attached_pertinent : [], 
                        pe_data: {
                            pe_heent: pex ? pex.section1.heent : [],
                            pe_chest_lungs: pex ? pex.section1.chest : '',
                            pe_cvs: pex ? pex.section1.cvs : '',
                            pe_abdomen: pex ? pex.section1.abdomen : '',
                            pe_gu_ie: pex ? pex.section1.gu : '',
                            // pe_pelvic: "Essentially normal", //NO REFERRENCE
                            // pe_rectal: "Essentially normal", //NO REFERRENCE
                            // pe_musculoskeletal: "Essentially normal", //NO REFERRENCE
                            pe_skin_extremities: pex ? pex.section1.skin : '',
                            pe_neuro_exam: pex ? pex.section1.neuro : '',
                            general_survey: pex ? pex.section1.general_survey : '',
                            as_remarks: pex ? pex.section1.as_remarks: '',
                            vital_sign_bp: pex ? pex.section1.vital_signs_bp : '',
                            vital_sign_rr: pex ? pex.section1.vital_signs_rr : '',
                            vital_sign_cr: pex ? pex.section1.vital_signs_cr : '',
                            vital_sign_temp: pex ? pex.section1.vital_signs_temp : '',
                            height: pex ? pex.section1.height : '',
                            weight: pex ? pex.section1.weight : '',
                        },
                        pe_findings
                    } 
                } : undefined),
                ...(mat ? { 
                    maternity: {
                        clinical_history: mat.section2,
                        obstetric_risk: obstetric_risk_data,
                        surgical_risk: surgical_risk_data,
                        orientation_to_mcp: mat.section5.a,
                        prenatal_consultation: mat.section6,
                        edb: mat.section5.b,
                        date_of_delivery: mat.section7.delivery_date,
                        time_of_delivery: mat.section7.delivery_time,
                        maternal_outcome: mat.section7.maternal_outcome,
                        pregnancy_uterine: mat.section7.aog_by_lmp,
                        pu_manner_of_del: mat.section7.delivery_manner,
                        presentation: mat.section7.presentation,
                        pregnancy_term: null,
                        bo_sex: mat.section7.sex,
                        bo_birth_weight: mat.section7.birth_weight,
                        post_partum_follow_up: mat.section7.schedule_pospartum,
                        age_of_menarche: mat.section2.age_of_menarche,
                        agpar_score: mat.section7.apgar_score,
                        fetal_outcome: mat.section7.fetal_outcome,
                        perinal_wound: {
                            done: mat.section8.pc_perinal_wound,
                            remarks: mat.section8.pc_perinal_wound_rem
                        },
                        maternal_postpartum_complication: {
                            done: mat.section8.pc_complication,
                            remarks: mat.section8.pc_complication_rem
                        },
                        breastfeeding_counseling: {
                            done: mat.section8.pc_breastfeed,
                            remarks: mat.section8.pc_breastfeed_rem
                        },
                        family_planning_counseling: {
                            done: mat.section8.pc_family_plan,
                            remarks: mat.section8.pc_family_plan_rem
                        },
                        provided_family_planning: {
                            done: mat.section8.pc_provided_plan,
                            remarks: mat.section8.pc_provided_plan_rem
                        },
                        surgical_sterilization: {
                            done: mat.section8.pc_ref_physician,
                            remarks: mat.section8.pc_ref_physician_rem
                        },
                        pospartum_follow_up: {
                            done: mat.section8.pc_schedule_next,
                            remarks: mat.section8.pc_schedule_next_rem
                        }
                    } 
                } : undefined),
                ...(ass ? { 
                    accreditation_and_signature: {
                        patient_doctor: [
                            ...ass.section1,
                        ],
                        signature: {
                            ...ass.section2,
                            rel_to_patient: relation_reason?.rel_to_patient ? relation_reason.rel_to_patient : '',
                            rel_for_signing_on_behalf: relation_reason?.reason_for_signing_onbehalf
                        }
                    }
                } : undefined),
                ...(ciw_data ? { 
                    course_in_the_ward: {
                        doctors_order: doctors_order.data,
                        medicine: ciw_data.section3.medicine,
                        outcome: ciw_data.section4,
                        medical_supplies: ciw_data.section5,
                        procedure: ciw_data.section6 ? ciw_data.section6 : [],
                        summary_of_fees: ciw_data.summary_of_fees,
                        status: ciw_data.status,
                    }
                } : undefined),
                // ...(this.$store.state.usr_credentials.user_type === '2-3' ? { 
                //     certification: {    
                //         ...crt_data,
                //     }
                // } : undefined),
                certification: {    
                    ...crt_data,
                },
                pHciAccreNo: this.$store.state.prv_data.ekonsulta_phic_acc_no,
                pmmc: this.$store.state.prv_data.eclaim_pmmc_no,
                ek_lgu_id: this.trans_detail.ek_lgu_id,
                transaction_type: this.trans_detail.transaction_type,
                created_by: this.$store.state.usr_credentials.user_name,
                provider_code: this.$store.state.prv_data.provider_code
            }

            let response = await this.$services.trnAddEclaims(eclaims_payload)

            if(response.status === 200) {
                if(response.data.success) {
                    this.getEclaimsWebService(patient_data, request_key)
                } else {
                    this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'Credit and Collection', body: 'Unable to submit the claims to Credit and Collection. Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                }
            } else {
                this.alert = response.error
            }
        },

        // TRIGGER FOR UPDATING PBEF
        async getEclaimsWebService(patient_data, request_key) {
            return await this.$services.getEclaimsWebService({
                // provider_code: "EKDF21B239E8232403",
                provider_code: this.$store.state.prv_data.provider_code,
                request_key: "ICEM",
                data: {
                    ek_lgu_id: this.trans_detail.ek_lgu_id,
                    member_pin: patient_data.mem_pin,
                    transaction_number: this.trans_detail.transaction_number
                }
            })
            .then((response) => {
                if(response.status === 200) {
                    if(this.$store.state.usr_credentials.user_type === '2-3' && request_key !== 'save_changes'){
                        this.generateEncryptedFiles(request_key);
                    } else{
                        this.removeSessionStorage();
                    }
                }
            }).catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            });
        },

        // GET PATIENT DATA
        async getPatientData(){
            let response = await this.$services.getTransactionIpPtd({
                phic_tracking_number: this.trans_detail.phic_tracking_number,
                transaction_number: this.trans_detail.transaction_number  
            });

            if (response.status === 200){
                response.data = this.responseDataDecryption(response.data)
                // PEX
                let pertinent_lab = {
                data: response.data.PERTINENT_LABORATORY.length === 0 ? [
                    {
                        date_of_lab: '',
                        description: ''
                    }
                ] : response.data.PERTINENT_LABORATORY,
                status: false
                }
                pertinent_lab.data.forEach(element => {
                    element.date_of_lab_date = element.date_of_lab 
                    element.date_of_lab = this.formatDate(element.date_of_lab)
                })

                // CIW
                let doctors_order = {
                    data: response.data.COURSE_IN_THE_WARD.length === 0 ? [
                    {
                        date: '',
                        doctors_order: ''
                    }
                    ] : response.data.COURSE_IN_THE_WARD,
                    status: false
                }
                doctors_order.data.forEach(element => {
                    element.date_date = element.date 
                    element.date = this.formatDate(element.date)
                })

                // AAS
                let aas_data = {
                    section1: response.data.PHIC_DOCTOR,
                    section2: {
                        patient_birthdate: null,
                        patient_signature: null,
                        hospital_signature: null,
                        doctor_signature: response.data.PHIC_DOCTOR[0].doctor_is_signed == '0' ? null : '2'
                    },
                    status: {
                        doctor: false
                    }
                }
                aas_data.section1.forEach(element => {
                    element.doc_fullname = element.doctor_name,
                    element.date_signed_date = element.date_signed
                    element.date_signed = this.formatDate(element.date_signed_date ? element.date_signed_date.substring(0, 10) : element.date_signed_date)
                })

                // CTF
                let ctf_data = {
                    phic_ben_is_enough: response.data.CERTIFICATION.phic_ben_is_enough,
                    total_health_inst_fees: response.data.CERTIFICATION.total_health_inst_fees,
                    total_professional_fees: response.data.CERTIFICATION.total_professional_fees,
                    grand_total: response.data.CERTIFICATION.grand_total,

                    co_hcf_total_actual_charges: response.data.CERTIFICATION.co_hcf_total_actual_charges,
                    co_hcf_phic_benefit: response.data.CERTIFICATION.co_hcf_phic_benefit,
                    co_hcf_amt_after_dsct: response.data.CERTIFICATION.co_hcf_amt_after_dsct,
                    co_hcf_amt_after_phic_deduc: response.data.CERTIFICATION.co_hcf_amt_after_phic_deduc,
                    co_hcf_paid_by: response.data.CO_HCF_PAID_BY,

                    co_pf_total_actual_charges: response.data.CERTIFICATION.co_pf_total_actual_charges,
                    co_pf_phic_benefit: response.data.CERTIFICATION.co_pf_phic_benefit,
                    co_pf_amt_after_dsct: response.data.CERTIFICATION.co_pf_amt_after_dsct,
                    co_pf_amt_after_phic_deduc: response.data.CERTIFICATION.co_pf_amt_after_phic_deduc,
                    co_pf_paid_by: response.data.CO_PF_PAID_BY,
                    
                    nco_total_cost_med_sup: response.data.CERTIFICATION.nco_total_cost_med_sup,
                    nco_total_cost_diagnostic_laboratory: response.data.CERTIFICATION.nco_total_cost_diagnostic_laboratory,
                    total_cpt_amount: response.data.TOTAL_CPT_AMOUNT,

                    status: {
                        certification: false,
                        co_hcf_paid_by: false,
                        co_pf_paid_by: false
                    }
                }
                
                let philhealth_certification = {
                    co_hcf_total_actual_charges: response.data.CERTIFICATION.co_hcf_total_actual_charges,
                    co_pf_total_actual_charges: response.data.CERTIFICATION.co_pf_total_actual_charges,
                    phic_ben_is_enough: response.data.CERTIFICATION.phic_ben_is_enough
                }

                sessionStorage.setItem('PGF04S', this.$crypto.AES.encrypt(JSON.stringify(pertinent_lab), 'Fo34S40s'))
                sessionStorage.setItem('LG4S04', this.$crypto.AES.encrypt(JSON.stringify(doctors_order), '5s05SLFI'))
                sessionStorage.setItem('GLORS6', this.$crypto.AES.encrypt(JSON.stringify(aas_data), 'dspof43S'))
                sessionStorage.setItem('kgdlDt', this.$crypto.AES.encrypt(JSON.stringify(philhealth_certification), 'vcoF535f'))

                sessionStorage.setItem('rtYIWs4', this.$crypto.AES.encrypt(JSON.stringify(ctf_data), 'pfdFxg44'))
                this.removeSessionStorage();        
            }   else{
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        },

        // REMOVE SESSION STORAGE
        removeSessionStorage(){
            if(this.pci_status){
                sessionStorage.removeItem('OO5T6X')
            }

            if(this.pci_diagnosis_status){
                sessionStorage.removeItem('LYK56D')
                sessionStorage.removeItem('PORT4D')
                sessionStorage.removeItem('OO5T6X')
            }

            if(this.pci_case_rate_status){
                sessionStorage.removeItem('OO5T6X')
                sessionStorage.removeItem('PORT4D')
            }

            if(this.pex_status){
                sessionStorage.removeItem('034FFK')
            }

            if(this.mat_status){
                sessionStorage.removeItem('Z3GXX4')
            }

            if(this.ciw_status){
                sessionStorage.removeItem('PORT4D')
            }

            if(this.ctf_status){
                sessionStorage.removeItem('CLD5Y8')
            }

            sessionStorage.setItem('XCF3L', this.$crypto.AES.encrypt(JSON.stringify(0), 'xcmnXcV4')) // change_status
            
            // this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: 'Forms has been successfully saved', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_act: 'closeAlert', btn_pry_otl: false, btn_pry_emt: 'goToPatientList' }
            this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: 'Forms has been successfully saved', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'goToPatientList' }
       },

        // PROCEED TO INPATIENT RESULT
        proceedToInpatientResult(){
            let ip_params = {
                eligibility_request_id: this.trans_detail.eligibility_request_id,
                phic_tracking_number: this.trans_detail.phic_tracking_number,
                transaction_number: this.trans_detail.transaction_number,
                hmo_host_code: this.trans_detail.hmo_host_code,
                policy_no: this.trans_detail.hmo_policy_number,
                approval_code: '',
                process_type: 'PHIC_LGU',
                from: 'input-forms'
            }

            sessionStorage.setItem('LZ19XD15S0Y1YU', this.$crypto.AES.encrypt(JSON.stringify(ip_params), 'AKyd1f2zXx'))
            sessionStorage.setItem('ROTSR', this.$crypto.AES.encrypt(JSON.stringify(this.trans_detail.phic_member_eligibility_status), 'lFdt04sg'))
            this.$router.push('/inpatient-result')
        },

        // GO TO PATIENT LIST
        goToPatientList(){
            this.$router.push('/patient-list')
        },

        // CHECK NUMBER FORMAT
        checkFormat(value){
            if(!isNaN(value.charAt(0))){
                if(value === null || value === ''){
                    return null
                }else{
                    return value.toString().replace(/,/g, '')
                }
            }else{
                return value
            }
        },

        // DATE DEFAULT NO DASH
        defaultDate(date){
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${year}${month}${day}`
        },

        // FORMAT DATE FOR DB
        formatDateForDB(date){
            if (!date) return null

            const [month, day, year] = date.split('-')
            return `${year}${month}${day}`
        }
    }
}
</script>