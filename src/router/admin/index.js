import { store } from '@/utils/index'

const admin_routes = [
    // ADMIN
    {
        path: '/admin/:page',
        name: 'Navbar',
        component:  () => import('@/components/admin/Navbar'), 
        beforeEnter: (to, from, next) =>{
            if(store.state.prv_data && store.state.usr_credentials?.department === 'Admin' || store.state.prv_data && store.state.usr_credentials?.department === 'super-admin'){
                next()
            }else{
                next(false)
            }
        }
    },
    
    {
        path: '/medical-transaction-report',
        name: 'MedicalTransactionReport',
        component: () => import('@/components/admin/reports/medical-transaction/Main'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Credit and Collection' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        }
    }
]

export default admin_routes