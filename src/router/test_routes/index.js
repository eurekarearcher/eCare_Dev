const test_routes = [
    {
        path: '/test-component',
        name: 'TestComponent',
        component: () => import('@/views/TestComponent'), 
    },

    {
        path: '/test-data',
        name: 'TestData',
        component: () => import('@/views/TestData') 
    },
]

export default test_routes