import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const trnUpdateComDiseaseTestCase = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_upd_com_disease_test_case.php', qs.stringify({
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

export const getComDiseaseTestCases = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_com_disease_test_cases.php', qs.stringify({
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

export const trnPushNotificationUser = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/trn_push_notification_user.php', qs.stringify({
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

export const trnPushNotificationEstab = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/trn_push_notification_estab.php', qs.stringify({
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
