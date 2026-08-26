import { mixin, store } from '@/utils/index'

const auth_routes = [
    //LOGIN ROUTES
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/Login'),
        beforeEnter: (to, from, next) => {
            try{
                if(store.state.usr_credentials.user_name !== "" && store.state.prv_data){
                    next(false)
                    if(store.state.usr_credentials.department === 'Admin' || store.state.usr_credentials.department === 'super-admin'){
                        next('/admin/registered-users')
                    }else if(store.state.usr_credentials.department === 'Nurse Station'){
                        next('/patient-list')
                    }else if(store.state.usr_credentials.department === 'Credit and Collection'){
                        next('/eclaims-patient-list')
                    }else if(store.state.usr_credentials.department === 'Laboratory'){
                        next('/covid-list')
                    }else if(store.state.usr_credentials.department === 'Doctor' || store.state.usr_credentials.department === 'Midwife' || store.state.usr_credentials.department === 'Medical Practitioner'){
                        next('/patient-queue-list')
                    }else if(store.state.usr_credentials.department === 'Pharmacist'){
                        next('/pharmacist/received')
                    }else if(store.state.usr_credentials.department === 'Data Encoder'){
                        next('/offline-transaction')
                    }else if(store.state.usr_credentials.department === 'Medical Laboratory Technologists'){
                        next('/diagnostic-laboratory')
                    }else if(store.state.usr_credentials.department === 'PVTPharmacist'){
                        next('/pvt-pharmacist')
                    }else{
                        if(store.state.prv_data.hmo === 1 || store.state.prv_data.lgu === 1){
                            next('/code-scanning')
                        } else {
                            next('/patient-list')
                        }
                    }
                }else{
                    mixin.methods.webCookies('delete', 'DF342')
                    mixin.methods.webCookies('delete', 'QR5YP')
                    next()
                }
            }catch(e) {
                console.warn(e)
            }
        }
    }
]

export default auth_routes