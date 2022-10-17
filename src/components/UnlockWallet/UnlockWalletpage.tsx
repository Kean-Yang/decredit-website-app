import React from 'react';
import { useTranslation } from 'react-i18next';
// import { Alert } from 'antd'
import { CHAINID } from '../../config';
import { SwitchNetworkRequest } from '../../utils/wallet';
import { useWallet } from 'use-wallet';
import './UnlockWallet.scss';

const UnlockWalletpage = () => {
    const { t } = useTranslation();
    const wallet = useWallet();
    const { connect } = wallet;
    return (
        <div className="UnlockWalletpage">
            {window && (!(window as any).web3 as any) ? (
                <div className="UnlockWalletpage-content">
                    <a
                        href="https://metamask.io/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('v1_Install_MetaMask')}
                    </a>
                </div>
            ) : window ? (
                <div
                    className="UnlockWalletpage-content"
                    onClick={() => {
                        SwitchNetworkRequest(CHAINID, () => {
                            connect('injected');
                        });
                    }}
                >
                    {t('v1_Unlock_Wallet')}
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default UnlockWalletpage;
