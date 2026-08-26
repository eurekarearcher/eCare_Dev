import qs from 'qs';
import mixin from '@/mixin'
import axios from 'axios'
import store from '../store';
import * as CryptoJS from 'crypto-js'

export const endpoints_payload = {
    response_end_points: '',
    post_data: ''
}

export const base_url = {
    tms:process.env.VUE_APP_TMS_URL,
    cms:process.env.VUE_APP_CMS_URL,
    request_token: process.env.VUE_APP_REQUEST_TOKEN,
    env: process.env.VUE_APP_ENV
}

export const handle_errors = { 
    display: true, 
    type: 'standard', 
    width: '450',   
    icon: 'mdi-alert-circle', 
    color: 'red', 
    title: 'Something went wrong', 
    body: 'Please try again', 
    btn_pry_txt: 'OK', 
    btn_pry_color: 'primary', 
    btn_pry_otl: false, 
    btn_pry_act: 'reloadPage' 
}

export const usr_credentials = {
    "password": "",
    "user_name": "",
    "user_code": "",
    "user_type": "",
    "user_roles": [],
    "acess_code": "N/A",
    "department": "",
    "doctor_tin": "",
    "doctor_code": "",
    "provider_reg_type": "",
    "user_complete_name": "",
    "tel_no": null,
    "email": "",
    "lgu_host_code": "",
    "user_settings": {
        "display_filipino_word": false,
        "user_layout": "type_a",
        "display_help": false,
        "save_as_pdf_disabled": false,
        "unit_conversion": "CU"
    }
}

const getRequestEndPoints = async (response_end_points, post_data) => {
    let data = {
        endpoint: response_end_points.config.url,
        body: post_data,
        response_http_code: response_end_points.request.status
    }
    store.dispatch("getUserRequestData", data)
}

const setRequestDataPayload = async (data, name) => {
    let set_request_data_payload = {
        request_payload : data,
        function_name: name
    }

    sessionStorage.setItem('rqnn52ds', CryptoJS.AES.encrypt(JSON.stringify(set_request_data_payload), 'OKM2HN'))

    // sessionStorage.setItem('request_data_payload', JSON.stringify(set_request_data_payload))
}

export { qs, mixin, axios, store, getRequestEndPoints, setRequestDataPayload }
