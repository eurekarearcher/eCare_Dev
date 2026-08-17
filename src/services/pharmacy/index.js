import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const getMedicineInventoryByProvider = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_medicine_inventory_by_provider.php', qs.stringify({
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

export const getMedicineInventoryHistory = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_medicine_restock_inventory.php', qs.stringify({
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

export const getMedicineTransferredHistory = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_medicine_transferred_history.php', qs.stringify({
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

export const getMedicineForReceiving = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_medicine_for_receiving.php', qs.stringify({
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

export const getMedicineInfo = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_medicine_info.php', qs.stringify({
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

export const medAddMedicine = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/med_add_medicine.php', qs.stringify({
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

export const medReplenishment = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/med_replenishment.php', qs.stringify({
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

export const medSaveStockLevel = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/med_save_stock_level.php', qs.stringify({
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

export const getMedicineAdjustmentHistory = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_medicine_adjustment_history.php', qs.stringify({
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

export const getRecievedUpdateMedicine = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/med_upd_medicine_receiving.php', qs.stringify({
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

export const getAvailableMedicineByProvider = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_available_medicine_by_provider.php', qs.stringify({
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

export const medTransferMedicineByFacility = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/med_transfer_medicine_by_facility.php', qs.stringify({
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

export const trnAddDelIcdCptFavorites = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_add_del_icd_cpt_favorites.php', qs.stringify({
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

export const medUpdateMedicineQuantity = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/med_upd_medicine_quantity.php', qs.stringify({
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

export const medUpdateMedicineInfo = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/med_update_medicine_info.php', qs.stringify({
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

export const getTransactionPrescribedMedicineByPid = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_prescribed_medicine_by_pid.php', qs.stringify({
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

export const getTransactionMedicine = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_medicine.php', qs.stringify({
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

export const trnUpdateTransactionMedicine = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_update_transaction_medicine.php', qs.stringify({
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

export const trnAdjustMedicineQuantity = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/trn_adjust_medicine_quantity.php', qs.stringify({
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