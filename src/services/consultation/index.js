import { base_url, handle_errors, qs, mixin, axios, endpoints_payload, getRequestEndPoints, setRequestDataPayload } from '@/utils/index'
let { response_end_points, post_data } = endpoints_payload

export const getDoctorPatientListByPid = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_doctor_patient_list_by_pid.php', qs.stringify({
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

export const getDoctorIssuedTranRecord = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_doctor_issued_tran_record.php', qs.stringify({
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

export const getTeleConsultDoctorList = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_teleconsult_doctor_list.php', qs.stringify({
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

export const getDoctorSchedule = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_doctor_schedule.php', qs.stringify({
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

export const trnUpdDocSchedule = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_upd_doc_schedule.php', qs.stringify({
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

export const trnUpdAcceptTeleconsult = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_upd_accept_teleconsult.php', qs.stringify({
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

export const queueListCancellation = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/queue_list_cancellation.php', qs.stringify({
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

export const getPatientRecordAndTransaction = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_patient_record_and_transaction.php', qs.stringify({
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

export const getMemberEligibilityLGU = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_member_eligibility_lgu.php', qs.stringify({
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

export const getTransactionEmrDoctorDiagnosis = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_emr_doctor_diagnosis.php', qs.stringify({
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

export const getPatientMedicalHistory = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_patient_medical_history.php', qs.stringify({
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

export const getEmrChildVaccinationRecord = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_emr_child_vaccination_record.php', qs.stringify({
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

export const getMemberVaccinationRecord = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_member_vaccination_record.php', qs.stringify({
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

export const getTransactionPreviousByType = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_previous_by_type.php', qs.stringify({
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

export const getTransactionClinicalAbstract = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_clinical_abstract.php', qs.stringify({
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

export const getPhicLibrary = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_phic_library.php', qs.stringify({
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

export const getTransactionEmrObGyne = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_emr_ob_gyne.php', qs.stringify({
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

export const getPatientMedicine = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_patient_medicine.php', qs.stringify({
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

export const trnUpdatePatientTranRecord = async (payload, key) => {
    setRequestDataPayload(payload, key)
    
    post_data = mixin.methods.wsDataEncryption(JSON.stringify({ ...payload }))
    return await axios.post(base_url.tms + 'resources/controller/trn_update_patient_tran_record.php', qs.stringify({
        post_data 
    })).then(response => {
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

export const trnUpdatePreConsultation = async (payload) => {
    setRequestDataPayload(payload, 'updPreConsultation')

    post_data = mixin.methods.wsDataEncryption(JSON.stringify({ ...payload }))
    return await axios.post(base_url.tms + 'resources/controller/trn_upd_pre_consultation.php', qs.stringify({
        post_data 
    })).then(response => {
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

export const trnAddConsultation = async (payload) => {
    setRequestDataPayload(payload, 'confirm')

    post_data = mixin.methods.wsDataEncryption(JSON.stringify({ ...payload }))
    return await axios.post(base_url.tms + 'resources/controller/trn_add_consultation.php', qs.stringify({
        post_data 
    })).then(response => {
        sessionStorage.removeItem('rqnn52ds')
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

export const getMemberEligibility = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_member_eligibility.php', qs.stringify({
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

export const trnUpdateTransactionReferral = async (payload) => {
    setRequestDataPayload(payload, 'saveTransactionReferral')

    post_data = mixin.methods.wsDataEncryption(JSON.stringify({ ...payload }))
    return await axios.post(base_url.tms + 'resources/controller/trn_upd_transaction_referral.php', qs.stringify({
        post_data
    }), { 
    }).then(response => {
        sessionStorage.removeItem('rqnn52ds')
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

export const getIcdCategoryList = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_icd_category_list.php', qs.stringify({
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

export const trnUpdateLoaConsultation = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/trn_upd_loa_consultation.php', qs.stringify({
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

export const getMemberLoaConsultation = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_member_loa_consultation.php', qs.stringify({
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