import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const trnDelNameById = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_del_name_by_pid.php', qs.stringify({
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

export const getMemberListQr = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_member_list_qr.php', qs.stringify({
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

export const getEkonsultaAtcChecker = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_ekonsulta_atc_checker.php', qs.stringify({
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

export const getTransactionConsultationResult = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_consultation_result.php', qs.stringify({
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

export const trnUpdateConsultation = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_upd_consultation.php', qs.stringify({
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

export const getPatientReferralTransaction = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_patient_referral_transaction.php', qs.stringify({
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

export const getMemberEligibilityPhic = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_member_eligibility_phic.php', qs.stringify({
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

export const getMemberRequestType = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_member_request_type.php', qs.stringify({
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

export const trnUpdMemberTransactionStatus = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/trn_upd_member_transaction_status.php', qs.stringify({
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

export const trnAddEligibility = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_add_eligibility.php', qs.stringify({
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

export const index = async (payload) => {
    return await axios.post(base_url.cms + 'resources/qrcode/index.php', qs.stringify({
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

export const getMemberQrStatus = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_member_qr_status.php', qs.stringify({
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

export const smsAddWebLog = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/sms_add_web_log.php', qs.stringify({
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

export const getSmsCheckLogByAccessNo = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_sms_check_log_by_access_no.php', qs.stringify({
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