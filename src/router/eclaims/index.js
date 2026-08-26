import { store } from '@/utils/index'

const eclaims_routes = [
    //ECLAIMS ROUTES
    {
        path: '/patient-list',
        name: 'PatientList',
        component: () => import('@/components/e-claims/PatientList'),
        beforeEnter: (to, from, next) =>{
            if(store.state.prv_data && store.state.usr_credentials?.department !== 'Doctor' && store.state.usr_credentials?.department !== 'Midwife' && store.state.usr_credentials?.department !== 'Laboratory' && store.state.prv_data.phic === 1){
                next()
            }else{
                next(false)
            }
        }
    },

    {
        path: '/pbef',
        name: 'PBEF',
        component: () => import('@/components/e-claims/PBEF'),
        beforeEnter: (to, from, next) =>{
            let pbef_params = sessionStorage.getItem('gdo3sGfd')
    
            if(store.state.prv_data && store.state.usr_credentials && pbef_params){
                next()
            }else{
                next(false)
            }
        }
    },

    {
        path: '/eclaims-patient-list',
        name: 'EclaimsPatientSubmitted',
        component: () => import('@/components/e-claims/PatientList'),
        beforeEnter: (to, from, next) =>{
            if(store.state.prv_data && store.state.usr_credentials?.department !== 'Doctor' && store.state.usr_credentials?.department !== 'Midwife' && store.state.usr_credentials?.department !== 'Laboratory' && store.state.prv_data.phic === 1){
                next()
            }else{
                next(false)
            }
        }
    },
    
    {
        path: '/input-forms/:category',
        name: 'InputForms',
        component: () => import('@/components/e-claims/InputForms'),
        beforeEnter: (to, from, next) =>{
            let trans_detail = sessionStorage.getItem('QesRTe3j4fs3')

            if(store.state.prv_data && store.state.usr_credentials){
                if(trans_detail){
                    next()
                }else{
                    if(store.state.usr_credentials.department === 'Nurse Station' || store.state.usr_credentials.department === 'Credit and Collection'){
                        next('/patient-list')
                    }else{
                        next(false)
                    }
                }
            }else{
                next(false)
            }
        }
    },
    
    {
        path: '/cf-forms/:configuration',
        name: 'CFForms',
        component: () => import('@/components/e-claims/CFForms'),
        beforeEnter: (to, from, next) =>{
            let trans_detail = sessionStorage.getItem('QesRTe3j4fs3')
    
            if(store.state.prv_data && store.state.usr_credentials && trans_detail){
                next()
            }else{
                next(false)
            }
        }
    },

    {
        path: '/eclaims-retrieve-pin',
        name: 'PinRetrieval',
        component: () => import('@/components/e-claims/philhealth-search-verification/PinRetrievalForm'),
        beforeEnter: (to, from, next) =>{
            if(store.state.prv_data && store.state.usr_credentials){
                next()
            }else{
                next(false)
            }
        }
    },

    {
        path: '/eclaims-hcp-accreditation',
        name: 'DoctorPanVerication',
        component: () => import('@/components/e-claims/philhealth-search-verification/DoctorAccreditationForm'),
        beforeEnter: (to, from, next) =>{
            if(store.state.prv_data && store.state.usr_credentials){
                next()
            }else{
                next(false)
            }
        }
    },

    {
        path: '/eclaims-search-employer',
        name: 'PhilHealthSearchEmployer',
        component: () => import('@/components/e-claims/philhealth-search-verification/SearchEmployer'),
        beforeEnter: (to, from, next) =>{
            if(store.state.prv_data && store.state.usr_credentials){
                next()
            }else{
                next(false)
            }
        }
    },

    {
        path: '/eclaims-member-eligibility-checker',
        name: 'PhilHealthMemberEligibilityChecker',
        component: () => import('@/components/e-claims/philhealth-search-verification/MemberEligibilityChecker'),
        beforeEnter: (to, from, next) =>{
            if(store.state.prv_data && store.state.usr_credentials){
                next()
            }else{
                next(false)
            }
        }
    },

    {
        path: '/eclaims-migrated-records',
        name: 'EclaimsMigratedRecords',
        component: () => import('@/components/e-claims/migrated-records/Main'),
        beforeEnter: (to, from, next) =>{
            if(store.state.prv_data && store.state.usr_credentials){
            next()
            }else{
            next(false)
            }
        }
    },

    {
        path: '/eclaims-migrated-cfforms/:configuration',
        name: 'MigratedPatientRecord',
        component: () => import('@/components/e-claims/migrated-records/MigratedCFForms'),
        beforeEnter: (to, from, next) =>{
            let migrated_cf_data = sessionStorage.getItem('MftrIDjk')
            
            if(migrated_cf_data){
                next()
            }else{
                if(store.state.usr_credentials.department === 'Nurse Station' || store.state.usr_credentials.department === 'Credit and Collection'){
                    next('/eclaims-migrated-records')
                }else{
                    next(false)
                }
            }
        }
    }
]

export default eclaims_routes