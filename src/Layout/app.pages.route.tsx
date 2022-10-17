/**
 * 页面路由
 * @author
 * @create
 */

import { lazy } from 'react';

export interface RouteType {
    pathname: string;
    component: any;
    exact: boolean;
    key?: string;
    title?: string;
    icon?: string;
    children?: RouteType[];
}

export const PagesRouters: RouteType[] = [
    {
        pathname: '/test',
        component: lazy(() => import('../pages/test')),
        exact: true,
        key: 'test',
        title: 'test',
    },
    {
        pathname: '/markets',
        component: lazy(() => import('../pages/markets')),
        exact: true,
        key: 'markets',
        title: 'markets',
    },
    {
        pathname: '/dashboard',
        component: lazy(() => import('../pages/dashboard')),
        exact: true,
        key: 'Dashboard',
        title: 'Dashboard',
    },
    {
        pathname: '/stake',
        component: lazy(() => import('../pages/stake')),
        exact: true,
        key: 'Stake',
        title: 'Stake',
    },
    {
        pathname: '/certification',
        component: lazy(() => import('../pages/certification')),
        exact: true,
        key: 'Certification',
        title: 'Certification',
    },
    {
        pathname: '/stake/ranklist',
        component: lazy(() => import('../pages/stake/ranklist')),
        exact: true,
        key: 'RankList',
        title: 'RankList',
    },
];
