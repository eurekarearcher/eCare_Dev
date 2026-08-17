import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const getMobileAccountInfo = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_mobile_account_info.php', qs.stringify({
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

export const mailSender = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/mail_sender.php', qs.stringify({
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