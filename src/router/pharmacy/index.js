import { store } from '@/utils/index'

const pharmacy_routes = [
    // PHARMACIST
    {
        path: '/pharmacist/:page',
        name: 'Pharmacist',
        component:  () => import('@/components/pharmacist/Main'),
        beforeEnter: (to, from, next) => {
            if (store.state.prv_data && store.state.usr_credentials?.department === 'Pharmacist') {
                next()
            } else {
                next({name : 'Login'})
            }
        }
    }
]

export default pharmacy_routes