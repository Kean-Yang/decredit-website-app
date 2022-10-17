/**
 *
 * @author
 * @create
 */

import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from 'antd';
import { PagesRouters, RouteType } from './app.pages.route';
import PageHeader from '../components/Header';
import PageFooter from '../components/Footer';
import IsUnlockWallet from '../components/UnlockWallet/IsUnlockWallet';
import walletIcon from '../assets/wallet.svg';
import { useMedia } from 'react-use';
import * as Tools from '../utils/Tools';
import { useWallet } from 'use-wallet';
// import SwitchNetwork from "../components/UnlockWallet/network.tsx";
// import Overheated from "../components/Modal/Overheated.tsx";
import './app.layout.scss';
// import { useTranslation } from 'react-i18next';
const { Content } = Layout;

const DdRoute = () => {
    // const { t } = useTranslation();
    const below768 = useMedia('(max-width: 768px)');
    const wallet = useWallet();
    const { account } = wallet;

    return (
        <Layout className="app-layout">
            <PageHeader />
            <Content className="layout-content">
                {PagesRouters.map((route) => (
                    <Route
                        exact={route.exact}
                        path={route.pathname}
                        key={route.pathname}
                        render={(routePorps: RouteType) => (
                            <route.component {...routePorps} />
                        )}
                    />
                ))}
            </Content>

            {!below768 ? (
                <PageFooter />
            ) : (
                <div className="connect-wallet">
                    <IsUnlockWallet ButClassNmae="account">
                        <img src={walletIcon as any} alt="OpenDefi" />
                        {Tools.substringTx(account || '...') || '...'}
                    </IsUnlockWallet>
                </div>
            )}
        </Layout>
    );
};

export default DdRoute;
