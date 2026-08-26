import { store } from '@/utils/index'

const pre_consultation_routes = [
    //FRONTDESK PAGE PRE CONSULTATION
    {
        path: '/eligibility',
        name: 'Eligibility',
        component:  () => import('@/components/e-benefit/Eligibility/Main'),
        beforeEnter: (to, from, next) => {
        let auth = sessionStorage.getItem('oIohiK_pvcE')
            if(auth && store.state.usr_credentials?.department === 'Admission' || store.state.usr_credentials?.department === 'Data Encoder' && store.state.prv_data){
                next()
            }else{
                next('/')
            }
        }
    },

    {
        path: '/admission/:page',
        name: 'ConsultationTypeA',
        component: () => import('@/components/e-benefit/Consultation/Consultation'),
        beforeEnter: (to, from, next) => {
            let auth = sessionStorage.getItem('pvceifcaqpcig')
            if(auth && store.state.member_data &&  store.state.usr_credentials?.department === 'Admission' || store.state.usr_credentials?.department === 'Data Encoder' && store.state.prv_data){
                next()
            }else{
                next('/eligibility')
            }
        }
    },

    {
        path: '/referred-transaction',
        name: 'ReferredTransaction',
        component: () => import('@/views/ReferredTransaction'),
        beforeEnter: (to, from, next) => {
            if (store.state.prv_data && store.state.usr_credentials) {
                if (store.state.usr_credentials.department === 'Admission' && store.state.usr_credentials.provider_reg_type === 'BRGY') {
                    next()
                } else if ((store.state.usr_credentials.department === 'Doctor' || store.state.usr_credentials.department === 'Midwife') && store.state.usr_credentials.provider_reg_type !== 'BRGY') {
                    next()
                } else {
                    next(false)
                }
            } else {
                next('/')
            }
        }
    },

    // DISPENSING OF MEDICINE
    {
        path: '/dispense-medicine',
        name: 'DPMMain',
        component: () => import('@/components/e-benefit/dispense-medicine/Main'),
        beforeEnter: (to, from, next) => {
            if (store.state.prv_data && store.state.usr_credentials?.department === 'Admission' || store.state.prv_data && store.state.usr_credentials?.department === 'Data Encoder') {
                next()
            } else {
                next(false)
            }
        }
    },

    // E-BENEFITS
    {
        path: '/provider-registration',
        name: 'ProviderRegistration',
        component: () => import('@/components/e-benefit/ProviderRegistration'),
        beforeEnter: (to, from, next) => {
            let prv_tin_code = localStorage.getItem('PCR245')
            if(prv_tin_code) next()
            if(!prv_tin_code) next({name : 'Login'})
        }
    },

    {
        path: '/code-scanning',
        name: 'CodeScanning',
        component: () => import('@/components/e-benefit/code-scanning/CodeScanning'),
        beforeEnter: (to, from, next) => {
            if((store.state.usr_credentials?.department === 'Admission') && store.state.prv_data  && store.state.prv_config && (store.state.prv_data.hmo === 1 || store.state.prv_data.lgu === 1)){
                next()
            }else{
                next({name : 'Login'})
            }
        }
    },

    {
        path: '/offline-transaction',
        name: 'OfflineTransaction',
        component: () => import('@/components/e-benefit/code-scanning/OfflineTransaction'),
        beforeEnter: (to, from, next) => {
            if((store.state.usr_credentials?.department === 'Data Encoder') && store.state.prv_data  && store.state.prv_config && (store.state.prv_data.hmo === 1 || store.state.prv_data.lgu === 1)){
                next()
            }else{
                next({name : 'Login'})
            }
        }
    },

    {
        path: '/queue-list',
        name: 'QueueList',
        component: () => import('@/components/e-benefit/QueueList'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Admission' && store.state.prv_data && (store.state.prv_data.hmo === 1 || store.state.prv_data.lgu === 1)){
                next()
            }else{
                next('/')
            }
        }
    },

    {
        path: '/teleconsult-queue-list',
        name: 'TeleConsultQueueList',
        component: () => import('@/components/e-benefit/TeleConsultQueueList'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Admission' && store.state.prv_data && (store.state.prv_data.hmo === 1 || store.state.prv_data.lgu === 1)){
                next()
            }else{
                next('/')
            }
        }
    },

    {
        path: '/registration',
        name: 'WebRegistration',
        component: () => import('@/components/e-benefit/web-registration/WebRegistration'),
        beforeEnter: (to, from, next) => {
            if((store.state.usr_credentials?.department === 'Admission' || store.state.usr_credentials?.department === 'Data Encoder') && store.state.prv_data && (store.state.prv_data.hmo === 1 || store.state.prv_data.lgu === 1)){
                next()
            }else{
                next('/')
            }
        }
    },

    {
        path: '/edit-info',
        name: 'EditInformation',
        component: () => import('@/components/e-benefit/Eligibility/EditInfo'),
        beforeEnter: (to, from, next) => {
            if((store.state.usr_credentials?.department === 'Admission' || store.state.usr_credentials?.department === 'Data Encoder')  && store.state.prv_data && (store.state.prv_data.hmo === 1 || store.state.prv_data.lgu === 1)){
                next()
            }else{
                next('/')
            }
        }
    },

    //Admission / CONSULTATION PAGE
    {
        path: '/admission',
        name: 'ConsultationTypeB',
        component: () => import('@/components/e-benefit/Consultation/Consultation'),
        beforeEnter: (to, from, next) => {
            let auth = sessionStorage.getItem('pvceifcaqpcig')
            if(auth && store.state.member_data &&  store.state.usr_credentials?.department === 'Admission' || store.state.usr_credentials?.department === 'Data Encoder' && store.state.prv_data){
                next()
            }else{
                next('/eligibility')
            }
        }
    },

    {
        path: '/consultation-result',
        name: 'ConsultationResult',
        component: () => import('@/components/e-benefit/Consultation/ConsultationResult'),
        beforeEnter: (to, from, next) => {
            let cons_res_auth = sessionStorage.getItem('LZ19XD15S0Y1YU') 
            if(cons_res_auth && store.state.member_data  && store.state.usr_credentials?.department === 'Admission' && store.state.prv_data){
                next()
            }else{
                next('/')
            }
        }
    },

    {
        path: '/print-consultation',
        name: 'PrintConsultation',
        component: () => import('@/components/e-benefit/Consultation/PrintConsultation'),
        beforeEnter: (to, from, next) => {
            let print_consult_auth = sessionStorage.getItem('JM9SO0Y1YV')
            if(print_consult_auth && store.state.member_data &&  store.state.usr_credentials?.department === 'Admission' && store.state.prv_data){
                next()
            }else{
                next('/')
            }
        }
    },

    {
        path: '/outpatient',
        name: 'Outpatient',
        component: () => import('@/components/e-benefit/Outpatient/Outpatient'),
        beforeEnter: (to, from, next) => {
            let auth = sessionStorage.getItem('gcicaqeifpcv')
            if(auth && store.state.member_data &&  store.state.usr_credentials?.department === 'Admission' || store.state.usr_credentials?.department === 'Data Encoder' && store.state.prv_data){
                next()
            }else{
                next('/eligibility')
            }
        }
    },
    
    {
        path: '/outpatient-result',
        name: 'OutpatientResult',
        component: () => import('@/components/e-benefit/Outpatient/OutpatientResults'),
        beforeEnter: (to, from, next) => {
            let op_res_auth = sessionStorage.getItem('LZ19XD15S0Y1YU') 
            if(op_res_auth && store.state.member_data &&  store.state.usr_credentials?.department === 'Admission' && store.state.prv_data){
                next()
            }else{
                next('/')
            }
        }
    },

    {
        path: '/print-outpatient',
        name: 'PrintOutpatient',
        component: () => import('@/components/e-benefit/Outpatient/PrintOutpatient'),
        beforeEnter: (to, from, next) => {
            let print_op_auth = sessionStorage.getItem('JM9SO0Y1YV')
            if(print_op_auth && store.state.member_data &&  store.state.usr_credentials?.department === 'Admission' && store.state.prv_data){
                next()
            }else{
                next('/')
            }
        }
    },

    {
        path: '/inpatient',
        name: 'Inpatient',
        component: () => import('@/components/e-benefit/Inpatient/Inpatient'),
        beforeEnter: (to, from, next) => {
            let auth = sessionStorage.getItem('acpfeivcpgci')
            if(auth && store.state.member_data &&  store.state.usr_credentials?.department === 'Admission' || store.state.usr_credentials?.department === 'Data Encoder' && store.state.prv_data){
                next()
            }else{
                next('/eligibility')
            }
        }
    },

    {
        path: '/covid-list',
        name: 'CovidList',
        component: () => import('@/components/e-benefit/Covid/CovidList'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Laboratory' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        }
    },

    {
        path: '/covid-test-case',
        name: 'CovidTestCase',
        component: () => import('@/components/e-benefit/Covid/CovidPositive'),
        beforeEnter: (to, from, next) => {
            let auth = sessionStorage.getItem('LSH4GF')
            if(auth && store.state.usr_credentials && store.state.prv_data){
                next()
            }else{
                next('/covid-list')        
            }
        }
    },

    {
        path: '/eloa-list',
        name: 'eLoaList',
        component:() => import('@/components/e-benefit/eLoaList'),
        beforeEnter: (to, from, next) => {
            let eloa_list_data = sessionStorage.getItem('LSD0IDX')
            if(eloa_list_data && store.state.usr_credentials?.department === 'Admission' && store.state.prv_data){
                next()
            }else{
                next('/')
            }
        }
    },

    {
        path: '/print-eLOA',
        name: 'PrintELOA',
        component: () => import('@/components/e-benefit/PrintELOA'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Admission' && store.state.prv_data){
                next()
            }else{
                next('/')
            }
        }
    },

    //MORTALITY
    {
        path: '/mortality',
        name: 'Mortality',
        component: () => import('@/components/e-benefit/m1-forms/Mortality'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Admission' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        }
    },

    //NATALITY
    {
        path: '/natality',
        name: 'Natality',
        component: () => import('@/components/e-benefit/m1-forms/Natality'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Admission' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        }
    },

    //ENVIRONMENTAL HEALTH
    {
        path: '/ehss',
        name: 'ENVIRONMENTAL HEALTH',
        component: () => import('@/components/e-benefit/m1-forms/EnvironmentalHealth'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Admission' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        }
    },

    //CHILD CARE AND SERVICES
    {
        path: '/child-care-and-services',
        name: 'CHILD CARE AND SERVICES',
        component: () => import('@/components/e-benefit/m1-forms/ChildCareAndServices'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Admission' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        }
    },

    {
        path: '/ekonsulta-submission',
        name: 'EkonsultaSubmission',
        component: () => import('@/components/e-benefit/ekonsulta-submission/Main'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Data Encoder' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        }
    },

    {
        path: '/offline-queue-list',
        name: 'OfflineQueueList',
        component: () => import('@/components/e-benefit/offline-queue-list/Main'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Data Encoder' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        }
    }
]

export default pre_consultation_routes