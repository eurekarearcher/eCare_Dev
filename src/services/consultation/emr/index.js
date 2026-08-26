import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const getCptPackages = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_cpt_packages.php', qs.stringify({
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

export const trnAddUpdateCptPackages = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/trn_add_upd_cpt_packages.php', qs.stringify({
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

export const trnUpdateTranRecordStatus = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_update_tran_record_status.php', qs.stringify({
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

export const trnUpdateOutpatientCpt = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_upd_outpatient_cpt.php', qs.stringify({
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

export const getPatientPrescribedMedicines = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_patient_prescribed_medicines.php', qs.stringify({
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