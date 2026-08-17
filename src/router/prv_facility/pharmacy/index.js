import { store } from '@/utils/index'

const prv_facility_pharmacy_routes = [
    {
        path: '/pvt-pharmacist',
        name: 'PVTPharmacist',
        component: () => import('@/components/prv-facility/prv-pharmacist/Main'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'PVTPharmacist' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        } 
    },
    
    {
        path: '/medicine-lab',
        name: 'MedicineLab',
        component: () => import('@/components/prv-facility/prv-pharmacist/MedicineLab'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'PVTPharmacist' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        } 
    },

    {
        path: '/pvt-inventory',
        name: 'PVTMedsInventory',
        component: () => import('@/components/prv-facility/prv-pharmacist/MedsInventory'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'PVTPharmacist' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        } 
    }
]

export default prv_facility_pharmacy_routes