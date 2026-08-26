import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const getTransactionIpRefData = async (payload) => {
    
    return await axios.post(base_url.cms + 'resources/api/_get_transaction_ip_ref_data.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    })).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getProviderICD = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_provider_icd.php', qs.stringify({
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

export const getProviderCPT = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_provider_cpt.php', qs.stringify({
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

export const getEkonsultaEligibilityChecker = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_ekonsulta_eligibility_checker.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    })).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getDiagnosticExamResultList = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_diagnostic_exam_result_list.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    })).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getDiagnosticExamResults = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_diagnostic_exam_results.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    })).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getTeleConsultDoctorList = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_teleconsult_doctor_list.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    })).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getProviderList = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_provider_list.php', qs.stringify({
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

export const trnAddUserLog = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/set_log.php', qs.stringify({
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