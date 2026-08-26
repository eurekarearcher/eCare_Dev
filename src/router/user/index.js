const user_routes = [
    {
        path: '/delete-account',
        name: 'UserDeletion',
        component: () => import('@/components/user-deletion/Main'), 
    },

    {
        path: '/account-deleted',
        name: 'SuccessDeletion',
        component: () => import('@/components/user-deletion/SuccessDeletion'), 
    },

    {
        path: '/request-denied',
        name: 'RequestDenied',
        component: () => import('@/components/user-deletion/RequestDenied'), 
    },

    {
        path: '/privacy-policy',
        name: 'PrivacyAndPolicy',
        component: () => import('@/components/PrivacyAndPolicy'), 
    },

    {
        path: '/ecare-app',
        name: 'EcareApp',
        component: () => import('@/components/ecare-app/Main'), 
    }
]

export default user_routes