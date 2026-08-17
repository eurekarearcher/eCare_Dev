import { base_url, handle_errors, qs, mixin, axios } from '@/utils/index'
import { 
    getProviderConfiguration, 
    usrValidateUser, 
    getUserRegisteredUserByProvider, 
    getAuditTrailLogs, 
    usrUpdUserData,  
    usrAddUser,
    getDoctorSpecialization,
    admUpdProviderConfig,
    getAnnualDisease,
    getAnnualCosting,
    getCptTransactionReports,
    getTransactionAllPr,
    getTransactionIcdBmi,
    getM2MorbidityReportsByProvider,
    getMedicineConsumptionReport,
    prvUpdProviderForToken,
    getProviderInfo,
    uploadXmlMigration,
    getAnnualMedicine,
    trnAddProviderDbCredentials,
    getProviderDbCredentials,
    trnAddAppAnnouncement,
    getAppAnnouncement,
    validatePendingDiagnosticResults,
    getSubmittedReports,
    getProviderListByFacility,
    getEligibilityStatus,
    getStatusReport,
    getAccreditationCredentials,
    getM1M2Report,
    getFacilityFilter,
    trnAddFacilityFilter,
    trnUpdFacilityFilter,
    getTransactionReport,
    getTransactionIcdCpt,
    eclaimUploadMigration,
    eclaimsMigrationDownload,
    downloadYakapDisengagementXml,
    getByPassEkonsultaXml,
    encryptedXmlFileDownload
} from './admin/index'
import {
    prvValidateAdminAcctReg,
    prvValidateCoordinates,
    getPrvValidateCoordinatesResult,
    prvUpdProviderInfo,
    prvAddProvider,
    usrUpdateLogTime,
    logOutUser,
    getUserCredential,
} from './auth/index'
import {
    trnUpdateTransactionMedicine,
    getTransactionMedicine,
    getTransactionPrescribedMedicineByPid,
    medUpdateMedicineInfo,
    medUpdateMedicineQuantity,
    trnAddDelIcdCptFavorites,
    medTransferMedicineByFacility,
    getAvailableMedicineByProvider,
    getRecievedUpdateMedicine,
    getMedicineAdjustmentHistory,
    medSaveStockLevel,
    medReplenishment,
    medAddMedicine,
    getMedicineInfo,
    getMedicineForReceiving,
    getMedicineTransferredHistory,
    getMedicineInventoryHistory,
    getMedicineInventoryByProvider,
    trnAdjustMedicineQuantity
} from './pharmacy/index'
import { 
    getTransactionIpRefData,
    getProviderICD,
    getProviderCPT,
    getEkonsultaEligibilityChecker,
    getDiagnosticExamResultList,
    getDiagnosticExamResults,
    getTeleConsultDoctorList,
    getProviderList,
    trnAddUserLog
 } from './global'
 import { 
    getDoctorPatientListByPid,
    getDoctorIssuedTranRecord,
    getDoctorSchedule,
    trnUpdDocSchedule,
    trnUpdAcceptTeleconsult,
    queueListCancellation,
    getPatientRecordAndTransaction,
    getMemberEligibilityLGU,
    getTransactionEmrDoctorDiagnosis,
    getPatientMedicalHistory,
    getEmrChildVaccinationRecord,
    getMemberVaccinationRecord,
    getTransactionPreviousByType,
    getTransactionClinicalAbstract,
    getPhicLibrary,
    getTransactionEmrObGyne,
    getPatientMedicine,
    trnUpdatePatientTranRecord,
    trnUpdatePreConsultation,
    trnAddConsultation,
    getMemberEligibility,
    trnUpdateTransactionReferral,
    getIcdCategoryList,
    trnUpdateLoaConsultation,
    getMemberLoaConsultation
} from './consultation'
import {
    wsMemberWeb,
    getMemberCardKey,
    validationServices,
    trnAddMigration
} from './registration/index'
import {
    trnAddM1EnvironmentalHealth,
    getM1DisplayList,
    trnAddM1ChildCare,
    trnAddM1Mortality,
    trnAddM1Natality,
    getPhicEkassEpressFormData
} from './nurse-station/forms/index'
import {
    getTransactionQueue,
    getPostEncoddQueueList,
    trnAddTransferPatient,
    getTeleConsultPatients,
    getTeleConsultPatientTransactions,
    getTeleConsultPatientTransactionRecords
} from './nurse-station/queue-list/index'
import {
    trnAddDownloadMasterList,
    syncEkonsultaMasterList
} from './nurse-station/phic-masterlist/index'
import {
    trnAddOutpatient,
    trnUpdateOutpatientIcd
} from './nurse-station/outpatient/index'
import {
    trnUpdateComDiseaseTestCase,
    getComDiseaseTestCases,
    trnPushNotificationUser,
    trnPushNotificationEstab
} from './nurse-station/covid/index'
import {
    getHostConfigByHost,
    getReferredTransactionBypId,
    usrUpdateSettings,
    getHelpVideo,
    trnAddInpatient,
    getProviderListByType
} from './nurse-station/index'

import { 
    getEclaims,
    getPhicAuditAttachments,
    trnAddEclaimsAttachedFiles,
    getPhicAuditComments,
    getClaimsTrailStatus,
    getEclaimsEligibleList,
    trnUpdFormStatus,
    getEclaimsWebService,
    generateEclaimsAttachment,
    cloudStorageServiceValidation,
    trnAddEclaims,
    getTransactionIpPtd,
    trnUpdInpatientAas,
    getEclaimDoctorsById,
    trnAddEclaimsSignature,
    trnDelAttachment,
    getEclaimsCaseRateInfo,
    getTransactionSobIcdCaseRates,
    getTransactionSobCptRvs,
    getPDFTemplate,
    getTransactionIpPtdHmo,
    getElaimsPBEF,
    getEclaimsCF2Form,
    getEsoa,
    getEclaimsRawXML,
    encryptedFileDownload,
    getEclaimsMigratedList,
    getEclaimsMigratedRecords
} from './phic/eclaims/index'

import {
    getEkonsultaValidationReports,
    trnAddEkonsulta,
    getNonKonsultaMembers,
    konsultaValidationReport,
    getEkonsultaSubmitReports,
    getEkonsultaEligibilityList,
    getKonsultaMembers,
    getEkonsultaFirstPatientEncounter,
    getEkonsultaAccreditionCredentials
} from './phic/ekonsulta/index'

import {
    trnDelNameById,
    getMemberListQr,
    getEkonsultaAtcChecker,
    getTransactionConsultationResult,
    trnUpdateConsultation,
    getMemberEligibilityPhic,
    getMemberRequestType,
    trnUpdMemberTransactionStatus,
    trnAddEligibility,
    index,
    getMemberQrStatus,
    smsAddWebLog,
    getSmsCheckLogByAccessNo,
    getPatientReferralTransaction,
} from './consultation/admission/index'

import {
    getCptPackages,
    trnAddUpdateCptPackages,
    trnUpdateTranRecordStatus,
    trnUpdateOutpatientCpt,
    getPatientPrescribedMedicines
} from './consultation/emr/index'

import {
    getMemberAccrHospital
} from './member/index'

import {
    getPvtFacilityTransaction,
    trnAddPvtResults
} from './prv-facility/index'

import {
    getMobileAccountInfo,
    mailSender
} from './user/index'
let cancel_token = ''


// const getMemberEligibilityLGU = async (payload) => {
//     cancel_token = axios.CancelToken.source()

//     return await axios.post(base_url.cms + 'resources/api/_get_member_eligibility_lgu.php', qs.stringify({
//         post_data : mixin.methods.wsDataEncryption(JSON.stringify({
//             ...payload
//         }))
//     }), { 
//         cancelToken: cancel_token.token
//     }).then(response => {
//         return response
//     }).catch(() => {
//         return {
//             error: handle_errors
//         }
//     })
// }

const trnAddUnassistedRegMigration = async(payload) => {
    cancel_token = axios.CancelToken.source()

    return await axios.post(base_url.tms + 'resources/controller/trn_add_unassisted_reg_migration.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }), { 
        cancelToken: cancel_token.token
    }).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

const testAPI = async(payload) => {
    cancel_token = axios.CancelToken.source()

    return await axios.post(base_url.cms + 'resources/api/_AUTHENTICATION_TEST_API.php', qs.stringify({
        post_data : mixin.methods.wsDataEncryption(JSON.stringify({
            ...payload
        }))
    }),{
        headers: mixin.methods.getToken()
    }).then(response => {
        return response
    }).catch(() => {
        return {
            error: handle_errors
        }
    })
}

export const services = {
    axios,
    base_url,
    cancel_token,
    testAPI,
    usrUpdateLogTime,
    logOutUser,
    getUserCredential,
    usrValidateUser,
    getUserRegisteredUserByProvider,
    getAuditTrailLogs,
    usrUpdUserData,
    usrAddUser,
    getDoctorSpecialization,
    admUpdProviderConfig,
    getAnnualDisease,
    getAnnualCosting,
    getCptTransactionReports,
    getTransactionAllPr,
    getTransactionIcdBmi,
    getM2MorbidityReportsByProvider,
    getFacilityFilter,
    trnAddFacilityFilter,
    trnUpdFacilityFilter,
    getTransactionReport,
    getM1M2Report,
    getMedicineConsumptionReport,
    getEkonsultaAccreditionCredentials,
    getTransactionIcdCpt,
    prvUpdProviderForToken,
    getProviderInfo,
    uploadXmlMigration,
    getEkonsultaValidationReports,
    getAnnualMedicine,
    getMemberEligibility,
    getMemberAccrHospital,
    trnDelNameById,
    getMemberEligibilityLGU,
    getElaimsPBEF,
    getProviderICD,
    getProviderCPT,
    getProviderConfiguration,
    getHostConfigByHost,
    getPvtFacilityTransaction,
    trnAddPvtResults,
    getDiagnosticExamResults,
    getPhicLibrary,
    prvValidateAdminAcctReg,
    prvValidateCoordinates,
    getPrvValidateCoordinatesResult,
    prvUpdProviderInfo,
    prvAddProvider,
    medUpdateMedicineQuantity,
    medAddMedicine,
    medSaveStockLevel,
    medUpdateMedicineInfo,
    medTransferMedicineByFacility,
    getMemberListQr,
    getMedicineAdjustmentHistory,
    getMedicineForReceiving,
    getRecievedUpdateMedicine,
    getMedicineTransferredHistory,
    getAvailableMedicineByProvider,
    getTransactionIpRefData,
    getMedicineInfo,
    getMedicineInventoryByProvider,
    getEkonsultaSubmitReports,
    getEkonsultaEligibilityList,
    validatePendingDiagnosticResults,
    getSubmittedReports,
    getProviderListByFacility,
    getProviderList,
    trnAddUserLog,
    trnAddDelIcdCptFavorites,
    getDiagnosticExamResultList,
    trnAddEkonsulta,
    getTransactionClinicalAbstract,
    getMemberVaccinationRecord,
    getDoctorPatientListByPid,
    trnUpdateTranRecordStatus,
    getEkonsultaEligibilityChecker,
    getEkonsultaAtcChecker,
    queueListCancellation,
    getPatientRecordAndTransaction,
    getDoctorIssuedTranRecord,
    getPatientMedicalHistory,
    trnUpdatePatientTranRecord,
    getTransactionPreviousByType,
    getTransactionEmrDoctorDiagnosis,
    getPatientMedicine,
    getTeleConsultDoctorList,
    getDoctorSchedule,
    trnUpdAcceptTeleconsult,
    trnUpdDocSchedule,
    getEmrChildVaccinationRecord,
    trnUpdateOutpatientCpt,
    trnUpdatePreConsultation,
    trnUpdateTransactionReferral,
    getIcdCategoryList,
    trnAddConsultation,
    trnAdjustMedicineQuantity,
    getTransactionConsultationResult,
    trnUpdateConsultation,
    trnUpdateLoaConsultation,
    getComDiseaseTestCases,
    trnUpdateComDiseaseTestCase,
    trnPushNotificationUser,
    trnPushNotificationEstab,
    getTransactionPrescribedMedicineByPid,
    getTransactionMedicine,
    trnUpdateTransactionMedicine,
    wsMemberWeb,
    getPatientReferralTransaction,
    getTransactionSobIcdCaseRates,
    getTransactionSobCptRvs,
    trnAddInpatient,
    getM1DisplayList,
    trnAddM1ChildCare,
    trnAddM1EnvironmentalHealth,
    getTransactionEmrObGyne,
    trnAddM1Mortality,
    trnAddM1Natality,
    trnAddOutpatient,
    trnUpdateOutpatientIcd,
    trnAddMigration,
    getTeleConsultPatients,
    getTeleConsultPatientTransactions,
    getTeleConsultPatientTransactionRecords,
    getTransactionQueue,
    getMemberCardKey,
    getProviderListByType,
    getMemberLoaConsultation,
    getMemberEligibilityPhic,
    getMemberRequestType,
    trnUpdMemberTransactionStatus,
    trnAddEligibility,
    syncEkonsultaMasterList,
    trnAddDownloadMasterList,
    index,
    getReferredTransactionBypId,
    getMemberQrStatus,
    smsAddWebLog,
    getSmsCheckLogByAccessNo,
    getPhicEkassEpressFormData,
    getMobileAccountInfo,
    usrUpdateSettings,
    getEkonsultaFirstPatientEncounter,
    mailSender,
    getStatusReport,
    validationServices,
    konsultaValidationReport,
    trnAddEclaims,
    getEclaims,
    getEclaimsCF2Form,
    trnAddTransferPatient,
    getHelpVideo,
    getNonKonsultaMembers,
    trnAddUnassistedRegMigration,
    getEclaimsWebService,
    getCptPackages,
    trnAddUpdateCptPackages,
    getPostEncoddQueueList,
    getEclaimsCaseRateInfo,
    getClaimsTrailStatus,
    medReplenishment,
    getMedicineInventoryHistory,
    getEsoa,
    generateEclaimsAttachment,
    cloudStorageServiceValidation,
    getPDFTemplate,
    getEclaimsEligibleList,
    getPhicAuditComments,
    trnUpdFormStatus,
    getPhicAuditAttachments, 
    trnAddEclaimsAttachedFiles,
    trnDelAttachment, 
    getTransactionIpPtdHmo,
    trnUpdInpatientAas,
    getEclaimDoctorsById,
    trnAddEclaimsSignature,
    getTransactionIpPtd,
    trnAddProviderDbCredentials,
    getProviderDbCredentials,
    trnAddAppAnnouncement,
    getAppAnnouncement,
    getAccreditationCredentials,
    getKonsultaMembers,
    getEligibilityStatus,
    getPatientPrescribedMedicines,
    eclaimUploadMigration,
    eclaimsMigrationDownload,
    downloadYakapDisengagementXml,
    getByPassEkonsultaXml,
    getEclaimsRawXML,
    encryptedFileDownload,
    encryptedXmlFileDownload,
    getEclaimsMigratedList,
    getEclaimsMigratedRecords
}