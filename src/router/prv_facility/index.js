import { store } from '@/utils/index'

const prv_facility_routes = [
    {
        path: '/prv-queue-list',
        name: 'PrvQueueList',
        component: () => import('@/components/prv-facility/prv-queue-list/Main'),
        beforeEnter: (to, from, next) => {
            if(store.state.usr_credentials?.department === 'Medical Laboratory Technologists' && store.state.prv_data){
                next()
            }else{
                next({name : 'Login'})
            }
        }
    }
]

export default prv_facility_routes