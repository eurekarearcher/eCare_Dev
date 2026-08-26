import { store } from '@/utils/index'

const prv_facility_diagnostic_routes = [
    {
        path: '/diagnostic-laboratory',
        name: 'DiagnosticLaboratory',
        component: () => import('@/components/prv-facility/prv-diagnostic/Main'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Medical Laboratory Technologists' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        } 
    },
  
    {
        path: '/diagnostic-lab',
        name: 'DiagnosticLab',
        component: () => import('@/components/prv-facility/prv-diagnostic/DiagnosticLab'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Medical Laboratory Technologists' || store.state.usr_credentials?.department === 'Data Encoder' || store.state.usr_credentials?.department === 'Admission' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        }
    }
]

export default prv_facility_diagnostic_routes