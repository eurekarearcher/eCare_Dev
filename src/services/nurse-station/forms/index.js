import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const trnAddM1EnvironmentalHealth = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_add_m1_envr_health.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }),).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getM1DisplayList = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_m1_display_list.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }),).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const trnAddM1ChildCare = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_add_m1_child_care.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }),).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const trnAddM1Mortality = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_add_m1_mortality.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }),).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const trnAddM1Natality = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_add_m1_natality.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }),).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getPhicEkassEpressFormData = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_phic_ekas_epress_form_data.php', qs.stringify({
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