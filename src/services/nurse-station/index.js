import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const getHostConfigByHost = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_host_config_by_host.php', qs.stringify({
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

export const getReferredTransactionBypId = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_referred_transaction_by_pid.php', qs.stringify({
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

export const usrUpdateSettings = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/usr_upd_settings.php', qs.stringify({
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

export const getHelpVideo= async (payload) => {
    return await axios.post(base_url.cms + '/resources/api/_get_demo_video.php', qs.stringify({
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

export const trnAddInpatient = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_add_inpatient.php', qs.stringify({
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

export const getProviderListByType = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_provider_list_by_type.php', qs.stringify({
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