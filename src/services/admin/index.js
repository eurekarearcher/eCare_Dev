import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'

export const getProviderConfiguration = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_provider_config.php', qs.stringify({
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

export const getUserRegisteredUserByProvider = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_registered_user_by_provider.php', qs.stringify({
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

export const getDoctorSpecialization = async () => {
    return await axios.post(base_url.cms + 'resources/api/_get_doctor_specialization.php')
    .then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const usrAddUser = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/usr_add_user.php', qs.stringify({
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
 //CURRENTLY NOT TESTED IN UPLOADING PROVIDER LOGO
export const admUpdProviderConfig = async (payload, formData) => {
    if (formData !== undefined) {
        return await axios.post(base_url.cms + 'resources/controller/adm_upd_provider_config.php', formData, {
        }).then(response => {
            return response;
        }).catch(error => {
            return {
                error: error.message 
            };
        });
    } else {
        return await axios.post(base_url.cms + 'resources/controller/adm_upd_provider_config.php', qs.stringify({
            post_data: mixin.methods.wsDataEncryption(JSON.stringify({
                ...payload
            })),
        }), {
        }).then(response => {
            return response;
        }).catch(error => {
            return {
                error: error.message 
            };
        });
    }
};

export const trnAddAppAnnouncement = async (payload) => {
    return await axios.post(base_url.cms + `resources/controller/trn_add_app_announcement.php`, qs.stringify({
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

export const getAppAnnouncement = async (payload) => {
    return await axios.post(base_url.cms + `resources/api/_get_app_announcement.php`, qs.stringify({
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

export const getAnnualDisease = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_annual_disease.php', qs.stringify({
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

export const getCptTransactionReports = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_cpt_transaction_reports.php', qs.stringify({
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

export const getAnnualCosting = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_annual_costing.php', qs.stringify({
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

export const getTransactionAllPr = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_all_pr.php', qs.stringify({
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

export const getTransactionIcdBmi = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_icd_bmi.php', qs.stringify({
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

export const getProviderListByFacility = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_provider_list_by_facility.php', qs.stringify({
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

export const getM2MorbidityReportsByProvider = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_m2_morbidity_reports_by_provider.php', qs.stringify({
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

export const getMedicineConsumptionReport = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_medicine_consumption_report.php', qs.stringify({
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

export const uploadXmlMigration = async (payload) => {
    return await axios.post(base_url.tms + 'resources/controller/upload_xml_migration.php', qs.stringify({
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

export const getProviderInfo = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_provider_info.php', qs.stringify({
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

export const prvUpdProviderForToken = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/prv_upd_provider_for_token.php', qs.stringify({
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

export const validatePendingDiagnosticResults = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/validate_pending_diagnostic_results.php', qs.stringify({
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

export const getSubmittedReports = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_submitted_reports.php', qs.stringify({
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

export const getAnnualMedicine = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_annual_medicine.php', qs.stringify({
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



export const getAuditTrailLogs = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_audit_trail_logs.php', qs.stringify({
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

export const trnAddProviderDbCredentials = async (payload) => {
    return await axios.post(base_url.cms + `resources/controller/trn_add_provider_db_credentials.php`, qs.stringify({
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

export const getProviderDbCredentials = async (payload) => {
    return await axios.post(base_url.cms + `resources/api/_get_provider_db_credentials.php`, qs.stringify({
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

export const usrValidateUser  = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/usr_validate_user.php', qs.stringify({
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

export const usrUpdUserData = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/usr_upd_user_data.php', qs.stringify({
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

export const getEligibilityStatus = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_eligibility_status.php', qs.stringify({
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

export const getStatusReport = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_status_report.php', qs.stringify({
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

export const getAccreditationCredentials = async (payload) => {
    return await axios.post(base_url.cms + `resources/api/_get_accreditation_credentials.php`, qs.stringify({
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

export const getM1M2Report = async (api, payload) => {
    return await axios.post(base_url.tms + 'resources/api/' + api, qs.stringify({
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

export const getFacilityFilter = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_facility_filter.php', qs.stringify({
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

export const trnAddFacilityFilter = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/trn_add_facility_filter.php', qs.stringify({
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

export const trnUpdFacilityFilter = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/trn_upd_facility_filter.php', qs.stringify({
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

export const getTransactionReport = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_report.php', qs.stringify({
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

export const getTransactionIcdCpt = async (payload) => {
    return await axios.post(base_url.tms + 'resources/api/_get_transaction_icd_cpt.php', qs.stringify({
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

export const eclaimUploadMigration = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/eclaim_upload_migration.php', qs.stringify({
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

export const eclaimsMigrationDownload = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/eclaims_migration_download.php ', qs.stringify({
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

export const downloadYakapDisengagementXml = async (payload) => {
    return await axios.post(base_url.cms + 'resources/controller/download_yakap_disengagement_xml.php ', qs.stringify({
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

export const getByPassEkonsultaXml = async (payload) => {
    return await axios.post(base_url.cms + 'resources/api/_get_bypass_ekonsulta_xml.php', qs.stringify({
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

export const encryptedXmlFileDownload = async (payload) => {
    return await axios.get(
        base_url.cms + 'resources/api/file_download.php',
        {
            params: {
                file: payload.file,
                pc: payload.pc,
                pf: payload.pf,
                t: payload.t
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