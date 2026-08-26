import { base_url, handle_errors, qs, mixin, axios, endpoints_payload, getRequestEndPoints } from '@/utils/index'
let { response_end_points, post_data } = endpoints_payload

export const getPvtFacilityTransaction = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_pvt_facility_transaction.php', qs.stringify({
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

//prv-facility folder
export const trnAddPvtResults = async (payload) => {
    post_data = mixin.methods.wsDataEncryption(JSON.stringify({ ...payload }))
    return await axios.post(base_url.tms + 'resources/controller/trn_add_pvt_results.php', qs.stringify({
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