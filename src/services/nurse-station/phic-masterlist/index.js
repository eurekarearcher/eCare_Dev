import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const trnAddDownloadMasterList = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/trn_add_download_masterlist.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    })).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const syncEkonsultaMasterList = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/sync_ekonsulta_master_list.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    })).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}