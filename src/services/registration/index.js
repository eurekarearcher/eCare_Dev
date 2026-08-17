import { base_url, handle_errors, qs, mixin, axios, endpoints_payload, getRequestEndPoints } from '@/utils/index'
let { response_end_points, post_data } = endpoints_payload

export const wsMemberWeb = async (payload) => {
    post_data = mixin.methods.wsDataEncryption(JSON.stringify({ ...payload }))
    return await axios.post(base_url.cms + 'resources/web_service/ws_member_web.php', qs.stringify({
        post_data 
    }), { 
    }).then(response => {
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

export const getMemberCardKey = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_member_card_key.php', qs.stringify({
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

export const trnAddM1EnvironmentalHealth = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_add_m1_envr_health.php', qs.stringify({
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

export const validationServices = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_validation_services.php', qs.stringify({
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

export const trnAddMigration = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/trn_add_ekonsulta_migration.php', qs.stringify({
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