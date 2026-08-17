import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const trnAddOutpatient = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_add_outpatient.php', qs.stringify({
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

export const trnUpdateOutpatientIcd = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_upd_outpatient_icd.php', qs.stringify({
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