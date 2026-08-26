import { store } from '@/utils/index'

const emr_routes = [
    //EMR CONSULTATION / DOCTOR'S PAGE
    {
        path: '/emr-consultation/:page',
        name: 'EMRConsultationTypeA',
        component: () => import ('@/components/emr/EMRConsultation'),
        beforeEnter: (to, from, next) =>{
        let emr_params = sessionStorage.getItem('PIX235')

        if(store.state.prv_data && store.state.usr_credentials && emr_params){
            next()
        }else{
            if(store.state.prv_data && (store.state.usr_credentials?.department === 'Doctor' || store.state.usr_credentials?.department === 'Midwife')){
                next('/patient-queue-list')
            }else{
                next(false)
            }
        }
        }
    },

    //EMR CONSULTATION / DOCTOR'S PAGE
    {
        path: '/emr-consultation',
        name: 'EMRConsultationTypeB',
        component: () => import ('@/components/emr/EMRConsultation'),
        beforeEnter: (to, from, next) =>{
        let emr_params = sessionStorage.getItem('PIX235')

        if(store.state.prv_data && store.state.usr_credentials && emr_params){
            next()
        }else{
            if(store.state.prv_data && (store.state.usr_credentials?.department === 'Doctor' || store.state.usr_credentials?.department === 'Midwife')){
                next('/patient-queue-list')
            }else{
                next(false)
            }
        }
        }
    },

    {
        path: '/patient-queue-list',
        name: 'PatientQueueList',
        component: () => import ('@/components/emr/DoctorPatientQueueList'),
        beforeEnter: (to, from, next) =>{
            if(store.state.prv_data && (store.state.usr_credentials?.department === 'Doctor' || store.state.usr_credentials?.department === 'Midwife' || store.state.usr_credentials?.department === 'Medical Practitioner')){
                next()
            }else{
                next(false)
            }
        }
    },

    {
        path: '/patient-transaction-record',
        name: 'TransactionRecord',
        component: () => import ('@/components/emr/DoctorTransactionRecord'),
        beforeEnter: (to, from, next) =>{
            if(store.state.prv_data && (store.state.usr_credentials?.department === 'Doctor' || store.state.usr_credentials?.department === 'Midwife' || store.state.usr_credentials?.department === 'Medical Practitioner')){
                next()
            }else{
                next(false)
            }
        }
    },

    //TELECONSULT
    {
        path: '/teleconsult-clinic-hours',
        name: 'TeleconsultClinicHours',
        component: () => import ('@/components/emr/TeleconsultClinicHours'),
        beforeEnter: (to, from, next) => {
            if (store.state.usr_credentials.department === 'Doctor' || store.state.usr_credentials.department === 'Midwife') {
                next()
            } else {
                next(false)
            }
        }
    },

    {
        path: '/teleconsult-patients-list',
        name: 'TeleconsultPatientList',
        component: () => import ('@/components/emr/TeleconsultPatientList'),
        beforeEnter: (to, from, next) => {
            if (store.state.usr_credentials.department === 'Doctor' || store.state.usr_credentials.department === 'Midwife') {
                next()
            } else {
                next(false)
            }
        }
    },
]

export default emr_routes