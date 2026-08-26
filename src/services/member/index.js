import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const getMemberAccrHospital = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_member_accr_hospital.php', qs.stringify({
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
