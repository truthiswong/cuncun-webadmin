const pre = '/orderCollection/';

export default {
    path: '/orderCollection',
    title: '取单管理',
    header: 'home',
    icon: 'ios-paper',
    children: [
        {
            path: `${pre}list`,
            title: '取单列表'
        }
    ]
}

