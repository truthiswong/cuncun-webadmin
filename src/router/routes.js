// import dashboard from './modules/dashboard';
import depositReceipt from './modules/depositReceipt';
import orderCollection from './modules/orderCollection';
import warehouseOrder from './modules/warehouseOrder';
import user from './modules/user';
import dataStatistics from './modules/dataStatistics';
import boxType from './modules/boxType';
import BasicLayout from '@/layouts/basic-layout';

/**
 * 在主框架内显示
 */

const frameIn = [
    {
        path: '/',
        redirect: {
            name: 'depositReceipt'
        },
        component: BasicLayout,
        children: [
            {
                path: 'index',
                name: 'index',
                redirect: {
                    name: 'depositReceipt'
                }
            },
            {
                path: 'log',
                name: 'log',
                meta: {
                    title: '前端日志',
                    auth: true
                },
                component: () => import('@/pages/system/log')
            },
            // 刷新页面 必须保留
            {
                path: 'refresh',
                name: 'refresh',
                hidden: true,
                component: {
                    beforeRouteEnter (to, from, next) {
                        next(instance => instance.$router.replace(from.fullPath));
                    },
                    render: h => h()
                }
            },
            // 页面重定向 必须保留
            {
                path: 'redirect/:route*',
                name: 'redirect',
                hidden: true,
                component: {
                    beforeRouteEnter (to, from, next) {
                        next(instance => instance.$router.replace(JSON.parse(from.params.route)));
                    },
                    render: h => h()
                }
            },
            // {
            //     path: 'inventoryItems',
            //     name: 'inventoryItems',
            //     meta: {
            //         title: '库存物品管理',
            //         auth: true
            //     },
            //     component: () => import('@/pages/inventoryItems')
            // },
            depositReceipt,
            orderCollection,
            warehouseOrder,
            user,
            //存单管理详情页
            {
                path: '/depositReceipt/details',
                name: 'depositReceipt-details',
                meta: {
                    title: '存单详情',
                    closable: true,
                },
                component: () => import('@/pages/depositReceipt/details')
            },
            //取单管理详情页
            {
                path: '/orderCollection/details',
                name: 'orderCollection-details',
                meta: {
                    title: '取单详情',
                    closable: true,
                },
                component: () => import('@/pages/orderCollection/details')
            },
            //取单管理详情页
            {
                path: '/warehouseOrder/details',
                name: 'warehouseOrder-details',
                meta: {
                    title: '仓储订单详情',
                    closable: true,
                },
                component: () => import('@/pages/warehouseOrder/details')
            },
            boxType,
            {
                path: 'classificationOfGoods',
                name: 'classificationOfGoods',
                meta: {
                    title: '物品分类管理',
                    auth: true
                },
                component: () => import('@/pages/classificationOfGoods')
            },
            {
                path: 'setUp',
                name: 'setUp',
                meta: {
                    title: '设置',
                    auth: true
                },
                component: () => import('@/pages/setUp')
            },
        ]
    },
    {
        path: '/inventoryItems',
        name: 'inventoryItems',
        redirect: {
            name: 'inventoryItems-list'
        },
        meta: {
            auth: true
        },
        component: BasicLayout,
        children: [
            {
                path: 'goods',
                name: 'goods',
                meta: {
                    title: '库存物品管理',
                    auth: true
                },
                component: () => import('@/pages/inventoryItems/goods')
            },
            {
                path: 'boxList',
                name: 'boxList',
                meta: {
                    title: '库存箱子管理',
                    auth: true
                },
                component: () => import('@/pages/inventoryItems/boxList')
            }
        ]
    },
    // dashboard,
    dataStatistics,
    // setUp
];

/**
 * 在主框架之外显示
 */

const frameOut = [
    // 登录
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '$t:page.login.title'
        },
        component: () => import('@/pages/account/login')
    },
    // 注册
    {
        path: '/register',
        name: 'register',
        meta: {
            title: '$t:page.register.title'
        },
        component: () => import('@/pages/account/register')
    },
    // 注册结果
    {
        path: '/register/result',
        name: 'register-result',
        meta: {
            auth: true,
            title: '注册结果'
        },
        component: () => import('@/pages/account/register/result')
    }
];

/**
 * 错误页面
 */

const errorPage = [
    {
        path: '/403',
        name: '403',
        meta: {
            title: '403'
        },
        component: () => import('@/pages/system/error/403')
    },
    {
        path: '/500',
        name: '500',
        meta: {
            title: '500'
        },
        component: () => import('@/pages/system/error/500')
    },
    {
        path: '*',
        name: '404',
        meta: {
            title: '404'
        },
        component: () => import('@/pages/system/error/404')
    }
];

// 导出需要显示菜单的
export const frameInRoutes = frameIn;

// 重新组织后导出
export default [
    ...frameIn,
    ...frameOut,
    ...errorPage
];
