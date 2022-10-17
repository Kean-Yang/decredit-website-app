import React, { useEffect, useState } from 'react';
import './App.scss';
import { useWallet } from 'use-wallet';
import AppRoute from './Layout/app.route';
import './styles/theme.scss';
import { getLightDark } from './utils/localStorage';
import { CHAINID } from './config';
import { useSelector, shallowEqual } from 'react-redux';
import { SwitchNetworkRequest } from './utils/wallet';
import { ConfigProvider } from 'antd';
import { I18nMessage, messageList } from './i18n/Message';
import { getLang } from './i18n/LangUtil';

// import VConsole from 'vconsole';

// if (
//     process.env.BUILD_ENV !== 'testnet_binance' &&
//     window.location.host === '3.35.21.192'
// ) {
//     console.log('vConsole');
//     var vConsole = new VConsole();
// }
// var vConsole = new VConsole();

// import { switchChainId } from './utils/localStorage';
// import { languageManag, hecochain } from './redux/reducers/switchLanguage';
// import {
//     useDispatch,
//     useSelector,
//     shallowEqual,
//     connect,
//     useStore,
// } from 'react-redux';

const App: any = () => {
    const wallet = useWallet();
    const { account, connect, chainId } = wallet;
    const ethereum = window && (window as any).ethereum;
    const [localeLang, setLocaleLang] = useState(I18nMessage);

    const reduxLightDark = useSelector(
        (state: any) => state.lightDarkManag.lightDark,
        shallowEqual
    );

    const [theme, setTheme] = useState(
        reduxLightDark || getLightDark() || 'light'
    );

    // 语种
    const lang = useSelector(
        (state: any) => state.languageManag.type || getLang(),
        shallowEqual
    );

    useEffect(() => {
        setLocaleLang(messageList(lang));
    }, [lang]);

    useEffect(() => {
        setTheme(reduxLightDark);
    }, [reduxLightDark]);

    useEffect(() => {
        // other code
        window.addEventListener('load', async () => {
            try {
                await ethereum.enable();
            } catch (error) {}
        });
        if (connect && !account) connect('injected');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     // @ts-ignore
    //     ethereum &&
    //         ethereum.on('networkChanged', (networkId: any) => {
    //             /* handle the chainId */
    //             SwitchNetworkRequest(networkId, () => {});
    //             switchChainId(networkId);
    //         });
    // }, [ethereum]);

    useEffect(() => {
        // ethereum && SwitchNetworkRequest(CHAINID, () => {});
        // ethereum &&
        //     ethereum.on('accountsChanged', (accounts: any) => {
        //         connect('injected');
        //     });
        ethereum &&
            ethereum.on('chainChanged', (ChainId: any) => {
                if (chainId !== ChainId)
                    SwitchNetworkRequest(CHAINID, () => {});
                window.location.reload();
            });
    }, [ethereum, chainId, connect, account]);

    return (
        <ConfigProvider locale={localeLang}>
            <div className={`App ${theme}`}>
                <AppRoute />
            </div>
        </ConfigProvider>
    );
};

export default App;
