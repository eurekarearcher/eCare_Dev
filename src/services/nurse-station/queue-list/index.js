import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const getTransactionQueue = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_queue.php', qs.stringify({
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

export const getPostEncoddQueueList = async(payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_post_encoded_queue_list.php', qs.stringify({
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

export const trnAddTransferPatient = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_add_transfer_doctor.php', qs.stringify({
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

export const getTeleConsultPatients = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_teleconsult_patients.php', qs.stringify({
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

export const getTeleConsultPatientTransactions = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_teleconsult_patient_transactions.php', qs.stringify({
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

export const getTeleConsultPatientTransactionRecords = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_teleconsult_patient_transaction_records.php', qs.stringify({
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