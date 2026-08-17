import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router/index'
import * as CryptoJS from 'crypto-js';
import mixin from '@/mixin'
import { services } from '@/services';
import { usr_credentials } from '../utils';

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  state: {
    //PROVIDER DATA
    super_key: null || localStorage.getItem('SADMK') ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('SADMK'), 'sprAdm2h').toString(CryptoJS.enc.Utf8)) : null,
    prv_key: null || localStorage.getItem('JYMHS') ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('JYMHS'), 'mjsu42hv').toString(CryptoJS.enc.Utf8)) : null,

    //PROVIDER DATA
    prv_data: null || localStorage.getItem('TW4LM') ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('TW4LM'), 'mExf9Y1b').toString(CryptoJS.enc.Utf8)) : null,

    //SELECTED DB PROVIDER
    //selected_db_provider: null || localStorage.getItem('PY3HY') ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('PY3HY'), 'yfd5jk').toString(CryptoJS.enc.Utf8)) : null,
    
    //USER CREDENTIALS 
    usr_credentials: null || mixin.methods.webCookies('get','QR5YP') ? JSON.parse(CryptoJS.AES.decrypt(mixin.methods.webCookies('get','QR5YP'), 'Sely14ae2fG').toString(CryptoJS.enc.Utf8)) : usr_credentials ,

    //AUTHENTICATION FOR ELIGIBILITY
    member_auth: sessionStorage.getItem('oIohiK_pvcE') || null,

    //MEMBER DATA
    member_data: sessionStorage.getItem('MD532') ? JSON.parse(CryptoJS.AES.decrypt(sessionStorage.getItem('MD532'), 'lfFo34sf').toString(CryptoJS.enc.Utf8)) : null,

    // E-CLAIMS
    prevent_navigation: true,
    loading_category: true,
    pbef_data: {
      datetime_generation: '',
      hci_info: {},
      member_info: {
        gender: ''
      },
      patient_info: {
        gender: ''
      }
    },
    icd_list: [],
    loading_icd: true,
    cpt_list: [],
    loading_cpt: true,

    // ADMIN
    prv_config: localStorage.getItem('dskDo3Y') ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('dskDo3Y'),'ldoweSf').toString(CryptoJS.enc.Utf8)) : null,
    loading_prv_config: localStorage.getItem('dskDo3Y') ? false : true,

    teleconsult_data: [],

    test_data: mixin.methods.webCookies('get','testers') ? mixin.methods.webCookies('get','testers') : null,

    teleconsult_patient: 0,

    facility_head: localStorage.getItem('jhuhyW5') ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('jhuhyW5'),'KsuunCB').toString(CryptoJS.enc.Utf8)) : { value: false, expiry: 0},
    offline_transaction_doctor: localStorage.getItem('hstf52G') ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('hstf52G'),'knmrrsa').toString(CryptoJS.enc.Utf8)) : [],

    pvt_facility_data: sessionStorage.getItem('cs3gsX') ? JSON.parse(CryptoJS.AES.decrypt(sessionStorage.getItem('cs3gsX'),'yhny22Z').toString(CryptoJS.enc.Utf8)) : null,
    
    endpoints_log: {
      ui_env: '',
      provider_code: '',
      request_body: []
    },
    transaction_flag: 0
  },
  mutations: {
    //SET DATA FOR PRIVATE FACILITY
    set_pvt_facility_data(state, pvt_data) {
      sessionStorage.setItem("cs3gsX",CryptoJS.AES.encrypt(JSON.stringify(pvt_data),"yhny22Z"))
      state.pvt_facility_data = pvt_data
    },

    //SET SELECTED DB PROVIDER
    // setSelectedDbProvider(state,data){
    //   localStorage.setItem("PY3HY",CryptoJS.AES.encrypt(JSON.stringify(data),"yfd5jk"))
    //   state.selected_db_provider = data
    // },

    setProviderData(state,data){
      localStorage.setItem("TW4LM",CryptoJS.AES.encrypt(JSON.stringify(data),"mExf9Y1b"))
      state.prv_data = data
    },

    setUserCredentials(state,credentials){
      mixin.methods.webCookies('set','QR5YP',CryptoJS.AES.encrypt(JSON.stringify(credentials),'Sely14ae2fG'))
      state.usr_credentials = credentials 
      
      if(state.prv_data.provider_tin === '') {
        state.prv_data.provider_tin = ''
      }
    },
    
    // setUserCredentials(state, credentials) {
    //   let usr_credentials = credentials;

    //   usr_credentials.user_settings = {
    //     ...usr_credentials.user_settings,
    //     ...credentials.user_settings, 
    //   };
  
    //   mixin.methods.webCookies('set', 'QR5YP', CryptoJS.AES.encrypt(JSON.stringify(usr_credentials), 'Sely14ae2fG'));
    //   state.usr_credentials = credentials;
  
    //   if (state.prv_data.provider_tin === '') {
    //     state.prv_data.provider_tin = '';
    //   }
    // },
    
    //FOR AUTHENTICATION OF MEMBER
    setMemberAuth(state,status){
      state.member_auth = status
      sessionStorage.setItem('oIohiK_pvcE',status)
    },

    removeMemberData(state) {
      state.member_data = null
    },

    //SET MEMBER DATA TO STATE
    setMemberData(state,member){
      if(state.member_data) {
        state.member_data.member = {...state.member_data.member, ...member}
        sessionStorage.setItem('MD532',CryptoJS.AES.encrypt(JSON.stringify(state.member_data),'lfFo34sf'))
      } else {
        state.member_data = Object.assign({}, {"member":member})
        sessionStorage.setItem('MD532',CryptoJS.AES.encrypt(JSON.stringify(state.member_data),'lfFo34sf'))
      }
    },
  
    //GET STATUS FOR ACCREDITED OR NOT 
    setIsAccredited(state,status){
      if(state.member_data) {
        state.member_data =  {...state.member_data, ...{"isAccredited" : status}}
        sessionStorage.setItem('MD532',CryptoJS.AES.encrypt(JSON.stringify(state.member_data),'lfFo34sf'))
      }
    },

    setConfig(state,config){
      if(state.member_data) {
        state.member_data = {...state.member_data, ...{"config" : config}}
        sessionStorage.setItem('MD532',CryptoJS.AES.encrypt(JSON.stringify(state.member_data),'lfFo34sf'))
      }
    },

    setPageValidate(state,status){
      state.page_validate = status
    },
    

    // ECLAIMS
    set_prevent_navigation(state, prevent_navigation_p){
      state.prevent_navigation = prevent_navigation_p
    },

    set_loading_category(state, loading_category_p){
      state.loading_category = loading_category_p
    },

    set_pbef_data(state, pbef_data_p){
      state.pbef_data = pbef_data_p
    },
  
    set_icd_list(state, icd_list_p){
      state.icd_list.push(...icd_list_p)
    },

    set_loading_icd(state, loading_icd_p){
      state.loading_icd = loading_icd_p
    },

    set_cpt_list(state, cpt_list_p){
      state.cpt_list.push(...cpt_list_p)
    },

    set_loading_cpt(state, loading_cpt_p){
      state.loading_cpt = loading_cpt_p
    },

    // ADMIN
    set_prv_config(state, prv_config_p){
      state.prv_config = prv_config_p
    },
    
    set_loading_prv_config(state, loading_prv_config_p){
      state.loading_prv_config = loading_prv_config_p
    },

    // setTestData(state,data) {
    //   state.test_data = data
    // }

    setProviderCipherKey(state, hci_cipher_key) {
      state.prv_data = {...state.prv_data, cipher_key: hci_cipher_key}
    },

    set_teleconsult_data(state, teleconsult_data) {
      state.teleconsult_data = teleconsult_data
    },

    //SORT THE DATA OF ICD LIST TO FAVORITES 
    set_icd_favorite(state, diagnosis) {
      let items = diagnosis.sort((a, b) => {
        return b.is_favorite - a.is_favorite
      })

      state.icd_list = items
    },

    //SORT THE DATA OF CPT LIST TO FAVORITES 
    set_cpt_favorite(state, diagnosis) {
      let items = diagnosis.sort((a, b) => {
        return b.is_favorite - a.is_favorite
      })

      state.cpt_list = items
    },

    //SORT THE DATA OF ICD LIST TO UNFAVORITES 
    set_icd_unfavorite(state, diagnosis) {
      let items = diagnosis.sort((a, b) => {
        return b.is_favorite - a.is_favorite
      })

      state.icd_list = items
    },

    //SORT THE DATA OF CPT LIST TO UNFAVORITES
    set_cpt_unfavorite(state, diagnosis) {
      let items = diagnosis.sort((a, b) => {
        return b.is_favorite - a.is_favorite
      })
      
      state.cpt_list = items
    },

    set_teleconsult_length(state, patient) {
      state.teleconsult_patient = patient
    },

    set_doctor_for_offline_transaction(state, selected_doctor) {
      state.offline_transaction_doctor = selected_doctor
      localStorage.setItem('hstf52G',CryptoJS.AES.encrypt(JSON.stringify(selected_doctor),'knmrrsa'))  
    },

    set_admin_login_facility(state, payload) {
      const date = new Date()

      const item = {
        value: payload,
        expiry: date.getTime() * 8
      }
      state.facility_head = item
      localStorage.setItem('jhuhyW5',CryptoJS.AES.encrypt(JSON.stringify(item),'KsuunCB')) 
    },

    setPrvKey(state, payload){
      state.prv_key = payload
      localStorage.setItem("JYMHS",CryptoJS.AES.encrypt(JSON.stringify(payload),"mjsu42hv"))
    },

    setSuperKey(state, payload) {
      state.super_key = payload
      localStorage.setItem("SADMK", CryptoJS.AES.encrypt(JSON.stringify(payload),"sprAdm2h"))
    },

    //SET THE PAYLOAD OF REQUEST LOG
    set_user_request_data(state, payload) {
      state.endpoints_log.ui_env = state.usr_credentials.department
      state.endpoints_log.provider_code = state.prv_data.provider_code
      state.endpoints_log.request_body.push(payload)
    },

    //CHECK THE TRANSACTION FLAG IF THE VALUE IS 1 THEN TRIGGER THE CONTROLLER FOR INSERTION
    async set_transaction_flag(state, payload) {
      state.transaction_flag = payload

      if(state.transaction_flag === 1) {
        await services.trnAddUserLog(state.endpoints_log)
        state.transaction_flag = 0
        state.endpoints_log = {
          ui_env: '',
          provider_code: '',
          request_body: []
        }
      }
    }
  },
  actions: {
    //GET THE REQUEST DATA OF USER LOG
    getUserRequestData({ commit }, payload) {
      commit('set_user_request_data', payload)
    },

    getDoctorItems({ commit }, payload) {
      commit('set_doctor_for_offline_transaction', payload)
    },

    //GET THE LENGHT OF TELE CONSULT PATIENT
    getTeleconsultPatient({ commit}, payload) {
      commit('set_teleconsult_length', payload)
    },

    //GET THE FAVORITE DIAGNOSIS/PROCEDURE
    getFavoriteDiagnosis({commit}, payload) {
      if(payload.title === 'icd') {

        this.state.icd_list.map(data => {
          payload.diagnosis.forEach(el => {
            if(data.icd_code === el) {
              data.is_favorite = '1'
            }
          })
        })

        commit('set_icd_favorite', this.state.icd_list)
      }

      if(payload.title === 'cpt') {
        this.state.cpt_list.map(data => {
          payload.diagnosis.forEach(el => {
            if(data.cpt_code === el) {
              data.is_favorite = '1'
            }
          })
        })

        commit('set_cpt_favorite', this.state.cpt_list)
      }
    },

    //GET THE UNFAVORITE DIAGNOSIS/PROCEDURE
    getUnFavoriteDiagnosis({commit}, payload) {
      if(payload.title === 'icd') {
        this.state.icd_list.map(data => {
          payload.diagnosis.forEach(el => {
            if(data.icd_code === el) {
              data.is_favorite = '0'
            }
          })
        })

        commit('set_icd_unfavorite', this.state.icd_list)
      }

      if(payload.title === 'cpt') {
        this.state.cpt_list.map(data => {
          payload.diagnosis.forEach(el => {
            if(data.cpt_code === el) {
              data.is_favorite = '0'
            }
          })
        })

        commit('set_cpt_unfavorite', this.state.cpt_list)
      }
    },

    //GET TELECONSULTA DATA
    getTeleConsultData({commit}, payload) {
      commit('set_teleconsult_data', payload)
    },
   
    //GET MEMBER DATA FROM SERVER
    async getMemberData({commit},payload){
      let process            = sessionStorage.getItem('GF45S') ? CryptoJS.AES.decrypt(sessionStorage.getItem('GF45S'),'fgGds32s').toString(CryptoJS.enc.Utf8) : null
      let mem_full_name      = sessionStorage.getItem('JFD43') ? JSON.parse(CryptoJS.AES.decrypt(sessionStorage.getItem('JFD43'),'lfFo34sf').toString(CryptoJS.enc.Utf8)) : null
      let e_request_id       = sessionStorage.getItem('ETR6G') ? CryptoJS.AES.decrypt(sessionStorage.getItem('ETR6G'),'lfFo34sf').toString(CryptoJS.enc.Utf8) : ''
      let member_phic_data   = sessionStorage.getItem('MPS24') ? JSON.parse(CryptoJS.AES.decrypt(sessionStorage.getItem('MPS24'),'lfFo34sf').toString(CryptoJS.enc.Utf8)) : null
      if(process !== 'PHIC' && process !== 'PHIC_LGU'){ //FOR PHIC AND HMO PROCESS AND HMO PROCESS
        let response = await services.getMemberEligibility({
            mem_hmo_policy_number   : payload.policy_no,
            hmo_host_code           : payload.host_code,
            provider_name           : this.state.prv_data.provider_name,  
            provider_tin            : this.state.prv_data.provider_tin,
            eligibility_request_id  : e_request_id
        })

        if(response.status === 200) {
          response.data = mixin.methods.responseDataDecryption(response.data)
          if(response.data === 'Data not found.'){
            alert('Member Data Not Found.');
            sessionStorage.clear()
            router.replace('/code-scanning')
          }else{
              response.data.p_name = this.combineString([response.data.mem_first_name, response.data.mem_middle_name, response.data.mem_last_name, response.data.mem_suffix]);
              response.data.mem_company_name    = response.data.mem_company_name ? response.data.mem_company_name : 'N/A'
              response.data.mem_email_address   = response.data.mem_email_address ? response.data.mem_email_address : 'N/A'
              response.data.mem_gender          = response.data.mem_gender ? response.data.mem_gender : 'M'
              response.data.mem_age             = response.data.mem_age ? response.data.mem_age : 'N/A'
              response.data.mem_ph_status       = ''
              response.data.mem_lgu_status      = 'N/A'
              response.data.mem_photo           = response.data.mem_photo ? response.data.mem_photo : ''
   
          
            // FOR HEALTHCARE STATUS
            if(response.data.mem_hmo_status){
              if(response.data.mem_hmo_status.toUpperCase() === 'A' || response.data.mem_hmo_status.toUpperCase() === 'ACTIVE'){
                response.data.mem_hmo_status = 'ACTIVE'
              }else if(response.data.mem_hmo_status.toUpperCase() == 'C' || response.data.mem_hmo_status.toUpperCase() == 'CANCELLED'){
                response.data.mem_hmo_status = 'CANCELLED'
              }else if(response.data.mem_hmo_status.toUpperCase() == 'H' || response.data.mem_hmo_status.toUpperCase() == 'ON HOLD'){
                response.data.mem_hmo_status = 'ON HOLD'
              }else if(response.data.mem_hmo_status.toUpperCase() == 'L' || response.data.mem_hmo_status.toUpperCase() == 'LAPSED'){
                response.data.mem_hmo_status = 'LAPSED'
              }else if(response.data.mem_hmo_status.toUpperCase() == 'E' || response.data.mem_hmo_status.toUpperCase() == 'EXPIRED'){
                response.data.mem_hmo_status = 'EXPIRED'
              }else if(response.data.mem_hmo_status.toUpperCase() == 'DELETED'){
                response.data.mem_hmo_status = 'DELETED'
              }else if(response.data.mem_hmo_status.toUpperCase() == 'WITHIN GRACE'){
                response.data.mem_hmo_status = 'WITHIN GRACE'
              }else{
                response.data.mem_hmo_status ='INACTIVE'
              }
            }else{
              response.data.mem_hmo_status ='INACTIVE'
            }
            
            if(response.data.mem_hmo_host_code === 'FC'){
              if(response.data.mem_hmo_type.toUpperCase() === 'I'){
                response.data.mem_hmo_type = 'INDIVIDUAL'
              }else if(response.data.mem_hmo_type.toUpperCase() == 'F'){
                response.data.mem_hmo_type = 'FAMILY'
              }else if(response.data.mem_hmo_type.toUpperCase() == 'E'){
                response.data.mem_hmo_type = 'CORPORATE'
              }else if(response.data.mem_hmo_type.toUpperCase() == 'G'){
                response.data.mem_hmo_type = 'GROUP'
              }else{
                response.data.mem_hmo_type = 'ADMINISTRATIVE SERVICE ONLY'
              }
            }
            
            // FOR BALANCE AND RATE
            response.data.consul_rate            = response.data.consul_rate ? response.data.consul_rate : 0
            response.data.icd_inner_limit        = response.data.icd_inner_limit ? response.data.icd_inner_limit : 0
            response.data.max_coverage_limit     = response.data.max_coverage_limit ? response.data.max_coverage_limit : 0 
            if(!response.data.hmo_max_coverage_bal === true){
              response.data.hmo_max_coverage_bal = 0
            }else if(response.data.hmo_max_coverage_bal === 'N'){
              response.data.hmo_max_coverage_bal = response.data.max_coverage_limit ? response.data.max_coverage_limit : 0
            }else{
              response.data.hmo_max_coverage_bal = response.data.hmo_max_coverage_bal ? response.data.hmo_max_coverage_bal : 0
            }
            
            //OTHER INFO
            response.data.membership_type     = 'N/A'
            response.data.mem_birthdate       = response.data.mem_birthdate ? response.data.mem_birthdate : 'N/A'
            response.data.mem_dental          = response.data.mem_dental ? response.data.mem_dental : 'N/A'
            response.data.mem_hmo_preexist    = response.data.mem_hmo_preexist ? response.data.mem_hmo_preexist : 'N/A'
            response.data.mem_hmo_type        = response.data.mem_hmo_type ? response.data.mem_hmo_type : 'N/A'
            response.data.mem_mobile_number   = response.data.mem_mobile_number ? response.data.mem_mobile_number : 'N/A'
            response.data.mem_landline_number   = response.data.mem_landline_number ? response.data.mem_landline_number : 'N/A'
            response.data.mem_waiver          = response.data.mem_waiver ? response.data.mem_waiver : 'N/A'
            
             // ROOM PLAN AND RATE
            response.data.mem_room_plan      = response.data.mem_room_plan ? response.data.mem_room_plan.toUpperCase() : 'N/A'
            response.data.mem_room_rate      = response.data.mem_room_rate ? response.data.mem_room_rate : 0
            
            // VALIDATE PRIVATE HEALTH CARE INSURANCE
            if(response.data.mem_hmo_host_code === 'VC') {
              response.data.private_hmo = 'VALUCARE'
            } else if(response.data.mem_hmo_host_code === 'FC'){
              response.data.private_hmo = 'FORTUNECARE'
            } else {
              response.data.private_hmo = 'EUREKARE'
            }
            

            response.mem_plan_code = response.mem_plan_code ? response.mem_plan_code : ''

            response.data.mem_hmo_loader = true
            if(process === 'HMO_PHIC_LGU'  || process === 'HMO_LGU') {
              // delete response.data.p_name  
              delete response.data.mem_mobile_number
              delete response.data.mem_landline_number
              delete response.data.mem_company_name    
              delete response.data.mem_email_address   
              delete response.data.mem_gender          
              delete response.data.mem_age            
              delete response.data.mem_ph_status      
              delete response.data.mem_lgu_status      
              delete response.data.mem_photo 
            }

            if(process === 'HMO'){
              response.data.principal_data = [];
            } 

            response.data = {...response.data, ...member_phic_data}
            commit('setMemberData',response.data)
            sessionStorage.removeItem('JFD43') 
            sessionStorage.removeItem('MPS24')
            
            let res = await services.getMemberAccrHospital({
                mem_hmo_policy_number : response.data.mem_hmo_policy_number,
                provider_code: this.state.prv_data.provider_code, 
                provider_tin: this.state.prv_data.provider_tin,
                hmo_host_code: response.data.mem_hmo_host_code,
                eligibility_request_id: e_request_id,
            })

            if(res.status === 200) {
              res.data = mixin.methods.responseDataDecryption(res.data)
              commit('setIsAccredited',res.data.is_accredited)
            } else {
              alert('Something Went Wrong. Please Try Again')
              sessionStorage.clear()
              router.replace('/code-scanning')
            }

            await services.trnDelNameById({ mem_hmo_policy_number:response.data.mem_hmo_policy_number })
          }
        }
      } else {
        let member = {
          p_name               : mem_full_name[0].toUpperCase()+' '+mem_full_name[1].toUpperCase()+' '+mem_full_name[2].toUpperCase(),
          mem_first_name       : mem_full_name[0] ? mem_full_name[0].toUpperCase() : '',
          mem_middle_name      : mem_full_name[1] ? mem_full_name[1].toUpperCase() : '',
          mem_last_name        : mem_full_name[2] ? mem_full_name[2].toUpperCase() : '',
          mem_suffix           : mem_full_name[3] ? mem_full_name[3].toUpperCase() : '',
          mem_birthdate        : mem_full_name[4],
          mem_lgu_status       : 'N/A',
          mem_hmo_status       : null,
          mem_hmo_policy_number: null,
          consul_rate          : 0,
          icd_inner_limit      : 0,
          max_coverage_limit   : 0,
          hmo_max_coverage_bal : 0,
          mem_age              : 'N/A',
          mem_company_name     : 'N/A',
          mem_dental           : 'N/A',
          mem_email_address    : 'N/A',
          mem_gender           : 'MALE',
          mem_hmo_preexist     : 'N/A',
          membership_type      : 'N/A',
          mem_hmo_type         : 'N/A',
          mem_mobile_number    : 'N/A',
          mem_landline_number    : 'N/A',
          mem_waiver           : 'N/A',
          mem_room_plan        : 'N/A',
          mem_room_rate        : 0,
          mem_photo            : '',
          mem_plan_code        : '',
        }
        member = {...member, ...member_phic_data}
        commit('setMemberData',member)
        sessionStorage.removeItem('JFD43') 
        sessionStorage.removeItem('MPS24')

      }
    },

    async trnUpdMemberTransactionStatus({commit}, payload) {
      let response = await services.trnUpdMemberTransactionStatus(payload)

      if (response.status === 200) {
        return response.data.success
      }

      commit('', '')
    },


   async getLGUMemberData({commit, dispatch},payload) {
      let member_phic_data   = sessionStorage.getItem('MPS24') ? JSON.parse(CryptoJS.AES.decrypt(sessionStorage.getItem('MPS24'),'lfFo34sf').toString(CryptoJS.enc.Utf8)) : null
      let process      = sessionStorage.getItem('GF45S') ? CryptoJS.AES.decrypt(sessionStorage.getItem('GF45S'),'fgGds32s').toString(CryptoJS.enc.Utf8) : null
      let phic_eligibility_status = sessionStorage.getItem('ROTSR') ? CryptoJS.AES.decrypt(sessionStorage.getItem('ROTSR'),'lFdt04sg').toString(CryptoJS.enc.Utf8) : null
      let usr_credentials = mixin.methods.webCookies('get','QR5YP') ? JSON.parse(CryptoJS.AES.decrypt(mixin.methods.webCookies('get','QR5YP'), 'Sely14ae2fG').toString(CryptoJS.enc.Utf8)) : null
      
      let response = await services.getMemberEligibilityLGU({
          ek_lgu_id : payload.ek_lgu_id,
          lgu_host_code : payload.lgu_host_code
      })

      if(response.status === 200) {
        response.data = mixin.methods.responseDataDecryption(response.data)
            
        if(response.data.LGU_DATA === 'No Data Found') {
          alert('Member Data Not Found.')
          sessionStorage.clear()
          router.replace('/code-scanning')
        } else {
          let data = response.data.LGU_DATA
          let eligibility_status = ''

          if (data.phic_status === '1') {
            eligibility_status = 'Eligible'
          } else if (data.phic_status === '2') {
            eligibility_status = 'Patient is Currently Admitted'
          } else if (data.phic_status === '3') {
            eligibility_status = 'Multiple Records Found'
          } else if (data.phic_status === '4') {
            eligibility_status = 'Transaction On Going'
          } else {
            eligibility_status = 'No Records Found'
          }
          
          if (process === 'LGU' || process === 'HMO_LGU') {
            if (!phic_eligibility_status) {

              let res_check_transaction = await dispatch('trnUpdMemberTransactionStatus', {
                ek_lgu_id: data.ek_lgu_id,
                process_by: usr_credentials.user_name
              })

              eligibility_status = res_check_transaction ? eligibility_status : 'Transaction On Going'
              sessionStorage.setItem("ROTSR",CryptoJS.AES.encrypt(eligibility_status, "lFdt04sg")); // eligibility_status
            }
          }
          
          data.p_name              = (`${data.mem_first_name} ${data.mem_middle_name || ''} ${data.mem_last_name} ${data.mem_suffix || ''}`).toUpperCase()
          data.mem_gender          = mixin.methods.formatGender(data.mem_gender)
          data.mem_lgu_type        = data.mem_lgu_type ? data.mem_lgu_type.charAt(0) === 'P' ? 'PRINCIPAL' : 'DEPENDENT' : null
          data.mem_lgu_loader      = true
          data.ek_lgu_id           = payload.ek_lgu_id
          data.eligibility_status  = eligibility_status

          if (process !== 'HMO_PHIC_LGU' && process !== 'HMO_LGU') {
            data.mem_hmo_status         = null
            data.mem_hmo_policy_number  = null
            data.consul_rate            = 0
            data.icd_inner_limit        = 0
            data.max_coverage_limit     = 0
            data.hmo_max_coverage_bal   = 0
            data.mem_dental             = 'N/A'
            data.mem_hmo_preexist       = 'N/A'
            data.membership_type        = 'N/A'
            data.mem_hmo_type           = 'N/A'
            data.mem_waiver             = 'N/A'
            data.mem_room_plan          = ''
            data.mem_room_rate          = 0
            data.mem_plan_code          = ''
          }


          if (process === 'LGU' || process === 'HMO_LGU') {
            data.principal_data         = []
          }

          data = {...data, ...member_phic_data}
          commit('setMemberData',data)
          sessionStorage.removeItem('JFD43') 
          sessionStorage.removeItem('MPS24')
        }
      } else {
        alert('Something Went Wrong. Please Try Again')
        sessionStorage.clear()
        router.replace('/code-scanning')
      }
    },
    
    // GET PBEF DATA
    async getPbefData({commit}, {data}){
      commit('set_loading_category', true)
      
      let response = await services.getEclaimsWebService({
          request_key: 'GPPM',
          // phic_tracking_number: tracking_num_p,
          // transaction_number: transaction_num_p,
          // ek_lgu_id: ek_lgu_id,
          // provider_code: this.state.prv_data.provider_code,
          provider_code: this.state.prv_data.provider_code,
          data: data
      })

      if(response.status === 200) {
        response.data = mixin.methods.responseDataDecryption(response.data)
        this.pbef_data = response.data
        
        // this.pbef_data.datetime_generation = this.pbef_data.datetime_generation
        // this.pbef_data.member_info.mem_phic_pin = mixin.methods.displayNA(this.pbef_data.member_info.mem_phic_pin)
        // this.pbef_data.member_info.member_name = this.pbef_data.member_info.first_name ? `${this.pbef_data.member_info.first_name.toUpperCase()} ${this.pbef_data.member_info.middle_name ? this.pbef_data.member_info.middle_name.toUpperCase() : ''} ${this.pbef_data.member_info.last_name.toUpperCase()} ${this.pbef_data.member_info.suffix ? this.pbef_data.member_info.suffix.toUpperCase() : ''}` : 'N/A'
        // this.pbef_data.member_info.gender = mixin.methods.displayNA(mixin.methods.formatGender(this.pbef_data.member_info.gender))
        // this.pbef_data.member_info.birthday = this.pbef_data.member_info.birthday ? mixin.methods.formatDateMonth(this.pbef_data.member_info.birthday) : 'N/A'
        // this.pbef_data.member_info.phic_member_type = mixin.methods.displayNA(this.pbef_data.member_info.phic_member_type)
        
        // this.pbef_data.patient_info.patient_name = this.pbef_data.patient_info.first_name ? `${this.pbef_data.patient_info.first_name.toUpperCase()} ${this.pbef_data.patient_info.middle_name ? this.pbef_data.patient_info.middle_name.toUpperCase() : ''} ${this.pbef_data.patient_info.last_name.toUpperCase()} ${this.pbef_data.patient_info.suffix ? this.pbef_data.patient_info.suffix.toUpperCase() : ''}` : 'N/A'
        // this.pbef_data.patient_info.date_admitted = mixin.methods.formatDateMonth(this.pbef_data.patient_info.date_admitted)
        // this.pbef_data.patient_info.gender = mixin.methods.displayNA(mixin.methods.formatGender(this.pbef_data.patient_info.gender))
        // this.pbef_data.patient_info.birthday = this.pbef_data.patient_info.birthday ? mixin.methods.formatDateMonth(this.pbef_data.patient_info.birthday) : 'N/A'
        // this.pbef_data.signature = this.pbef_data.signature ? this.pbef_data.signature : 'SIGNATURE HAS BEEN PROVIDED'
        
        commit('set_pbef_data', this.pbef_data)
        commit('set_loading_category', false)
        return this.pbef_data
      } else {
        alert('Something went wrong. Please try again.')
        location.reload();
      }
    },

    // GET ICD LIST
    async getICDList({commit}, post_data){
      let response = await services.getProviderICD(post_data) 
      let icd_list = []
      if(response.status === 200) {
        response.data = mixin.methods.responseDataDecryption(response.data)
        if(response.data !== 'Data not found.') {
          icd_list = response.data.map(item => {
            return {
              icd_tag: 'NEW',
              icd_code: item.icd_code,
              icd_description: item.description ? item.description : item.description_medium,
              icd_description_long: item.icd_description_long,
              icd_code_description: item.icd_code+' / '+item.description,
              icd_group_code: item.icd_group_code,
              ph_category: item.ph_category,
              is_favorite: item.is_favorite
            }
          })

          if (post_data?.request_type == 'covid') return icd_list
        } else {
          icd_list = []
        }

        commit('set_icd_list', icd_list)
        commit('set_loading_icd', false)
      } else {
        alert('Something went wrong. Please try again.')
      }
    },

    // GET CPT LIST
    async getCPTList({commit}, post_data){
      let response = await services.getProviderCPT(post_data) 

      if(response.status === 200) {
        response.data = mixin.methods.responseDataDecryption(response.data)
        if (post_data.selection_type == 'disease_test_method') return response.data

        commit('set_cpt_list', response.data)
        commit('set_loading_cpt', false)
      } else {
        alert('Something went wrong. Please try again.')
      }
    },

    // GET PROVIDER CONFIG
    async getProviderConfig({commit}){
      let response = await services.getProviderConfiguration({
          provider_tin: this.state.prv_data.provider_tin,
          provider_code: this.state.prv_data.provider_code        
      })

      if(response.status === 200) {
        response.data = mixin.methods.responseDataDecryption(response.data)
        this.prv_config = response.data
        
        localStorage.setItem('dskDo3Y', CryptoJS.AES.encrypt(JSON.stringify(this.prv_config), 'ldoweSf'))

        commit('set_prv_config', this.prv_config)
        commit('set_loading_prv_config', false)
      } else {
        alert('Something went wrong. Please try again.')
        location.reload();
      }
    },

     async getHostConfig({commit}, payload){
      let response = await services.getHostConfigByHost({
        hmo_host_code:  payload.post === 'HMO' ? payload.host_code : undefined,
        lgu_host_code:  payload.post === 'LGU' ? payload.host_code : undefined,
        phic_host_code: payload.post === 'PHIC' ? payload.host_code : undefined,
        provder_code: this.state.prv_data.provider_code,
        request_type: 'web'
      })

      if(response.status === 200) {
        response.data = mixin.methods.responseDataDecryption(response.data)
        commit('setConfig',response.data)
      } else {
        alert('Something went wrong. Please try again.')
        location.reload();
      }
    },

    updateTransactionData({ commit }, payload) {
      commit('set_pvt_facility_data', payload);
      
    },

    updateUserSettings({ commit, state }, { user_settings }) {
      commit('setUserCredentials', {
        ...state.usr_credentials,
        user_settings: {
          ...user_settings,
        },
      });
    },

    setPrvKey({ commit }, payload){
      commit('setPrvKey', payload)
    },

    setSuperKey({ commit }, payload) {
      commit('setSuperKey', payload)
    }
  }
})

 
