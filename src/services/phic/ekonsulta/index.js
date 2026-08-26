import { base_url, handle_errors, qs, mixin, axios, endpoints_payload, getRequestEndPoints, setRequestDataPayload } from '@/utils/index'
let { response_end_points, post_data } = endpoints_payload

export const getEkonsultaValidationReports = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_ekonsulta_validation_reports.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }), { 
    }).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getNonKonsultaMembers = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_non_ekonsulta_mem.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }), { 
    }).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const konsultaValidationReport = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_konsulta_validation_report.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }), { 
    }).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getEkonsultaSubmitReports = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_ekonsulta_submit_reports.php', payload, { 
    }).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getEkonsultaEligibilityList = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_ekonsulta_eligibility_list.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }), { 
    }).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getKonsultaMembers = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_ekonsulta_data.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }), { 
    }).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getEkonsultaFirstPatientEncounter = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_ekonsulta_first_patient_encounter.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }), { 
    }).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getEkonsultaAccreditionCredentials = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_ekonsulta_accredition_credentials.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }), { 
    }).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const trnAddEkonsulta = async (payload) => {
    setRequestDataPayload(payload, 'saveEkonsulta')
    
    post_data = mixin.methods.wsDataEncryption(JSON.stringify({ ...payload }))
    return await axios.post(base_url.tms + 'resources/controller/trn_add_ekonsulta.php', qs.stringify({
        post_data 
    })).then(response => {
        sessionStorage.removeItem('rqnn52ds')
        response_end_points = response
        return response
    }).catch((error) => {
        response_end_points = error
        return {
            error: handle_errors
        }
    }).finally(() => {
        getRequestEndPoints(response_end_points, post_data)
    })
}