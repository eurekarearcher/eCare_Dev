import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const usrUpdateLogTime = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/usr_update_log_time.php', qs.stringify({
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

export const logOutUser = async(payload) => {
    return await axios.post(base_url.cms + 'resources/controller/usr_update_log_status.php', qs.stringify({
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

export const getUserCredential = async (username, password) => {
    return await axios.post(base_url.cms + 'resources/api/_get_user_credential.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            username: username,
            password: password,
            request_code: 'RGJ6JF4ATK7R' 
        }))
    })).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const prvValidateAdminAcctReg = async(payload) => {
    return await axios.post(base_url.cms + 'resources/api/prv_validate_admin_acct_reg.php', qs.stringify({
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

export const prvValidateCoordinates = async(payload) => {
    return await axios.post(base_url.cms + 'resources/controller/prv_validate_coordinates.php', qs.stringify({
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

export const prvAddProvider = async(payload) => {
    return await axios.post(base_url.cms + 'resources/controller/prv_add_provider.php', qs.stringify({
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

export const getPrvValidateCoordinatesResult = async(payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_prv_validate_coordinates_result.php', qs.stringify({
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

export const prvUpdProviderInfo = async(payload) => {
    return await axios.post(base_url.cms + 'resources/controller/prv_upd_provider_info.php', qs.stringify({
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