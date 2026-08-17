import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const getEclaims = async (payload) => {
    let con_url = payload.migrated_to_eclaim_table === '1' ? '_get_eclaims_from_eclaim_table.php' : '_get_eclaims_from_ecare.php'
    delete payload.migrated_to_eclaim_table
    // _get_eclaims_from_eclaim_table.php

    return await axios.post(base_url.tms + 'resources/api/' + con_url, qs.stringify({
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

export const getPhicAuditAttachments = async (payload) => {
    return await axios.post(base_url.tms + `resources/api/_get_phic_audit_attachments.php`, qs.stringify({
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

export const trnAddEclaimsAttachedFiles = async (payload) => {
    return await axios.post(base_url.cms + `resources/controller/trn_add_eclaims_attached_files.php`, 
        payload.formData, 
        { 
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        },
    )
    .then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getPhicAuditComments = async (payload) => {
    return await axios.post(base_url.tms + `resources/api/_get_phic_audit_comments.php`, qs.stringify({
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

export const getClaimsTrailStatus = async(payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_eclaims_trail_status.php', qs.stringify({
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

export const getEclaimsEligibleList = async (payload) => {
    return await axios.post(base_url.tms + `resources/api/_get_eclaims_eligible_list.php`, qs.stringify({
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

export const getEclaimsWebService = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_eclaims_webservice.php', qs.stringify({
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

export const trnUpdFormStatus = async (payload) => {
    return await axios.post(base_url.tms + `resources/controller/trn_upd_form_status.php`, qs.stringify({
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

export const generateEclaimsAttachment = async(payload) => {
    return await axios.post(base_url.cms + 'resources/api/_generate_eclaims_attachment.php', qs.stringify({
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

export const cloudStorageServiceValidation = async(payload) => {
    return await axios.post(base_url.tms + 'resources/api/cloud_storage_service_validation.php', qs.stringify({
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


export const trnAddEclaims = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_add_upd_eclaims.php', qs.stringify({
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

export const getTransactionIpPtd = async (payload) => {
    return await axios.post(base_url.tms + `resources/api/_get_transaction_ip_ptd.php`, qs.stringify({
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

export const trnUpdInpatientAas = async (payload) => {
    return await axios.post(base_url.tms + `resources/controller/trn_upd_inpatient_aas.php`, qs.stringify({
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

export const getEclaimDoctorsById = async (payload) => {
    return await axios.post(base_url.tms + `resources/api/_get_eclaim_doctors_by_id.php`, qs.stringify({
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

export const trnAddEclaimsSignature = async (payload) => {
    return await axios.post(base_url.cms + `resources/controller/trn_add_eclaims_signature.php`, 
        payload.formData, 
        { 
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        },
    )
    .then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const trnDelAttachment = async (payload) => {
    return await axios.post(base_url.cms + `resources/controller/trn_del_attachment.php`, qs.stringify({
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

export const getEclaimsCaseRateInfo = async(payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_eclaims_caserate_info.php', qs.stringify({
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

export const getTransactionSobIcdCaseRates = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_icd_case_rates.php', qs.stringify({
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

export const getTransactionSobCptRvs = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_cpt_rvs.php', qs.stringify({
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

export const getPDFTemplate = async(payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_phic_pdf_template.php', qs.stringify({
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

export const getTransactionIpPtdHmo = async (payload) => {
    return await axios.post(base_url.tms + `resources/api/_get_transaction_ip_ptd_hmo.php`, qs.stringify({
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

export const getElaimsPBEF = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_eclaims_pbef.php', qs.stringify({
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

export const getEclaimsCF2Form = async (payload) => {
    return await axios.post(base_url.tms + '/resources/api/_get_eclaims_cf2_form.php', qs.stringify({
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

export const getEsoa = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_esoa_info.php', qs.stringify({
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

export const getEclaimsRawXML = async (payload) => {
    return await axios.post(base_url.cms + `resources/api/_get_eclaims_raw_xml.php`, qs.stringify({
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

export const encryptedFileDownload = async (payload) => {
    return await axios.get(
        base_url.cms + 'resources/api/file_download.php',
        {
            params: {
                file: payload.file,
                pc: payload.pc,
                pf: 'xml',
                t: payload.t || Date.now()
            },
            responseType: 'blob'
        }
    ).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const getEclaimsMigratedList = async (payload) => {
    return await axios.post(base_url.cms + `resources/api/_get_eclaims_migrated_list.php`, qs.stringify({
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

export const getEclaimsMigratedRecords = async (payload) => {
    return await axios.post(base_url.cms + `resources/api/get_eclaims_migrated_records.php`, qs.stringify({
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