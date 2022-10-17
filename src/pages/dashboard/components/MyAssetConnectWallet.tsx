import React from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import MyAssetConnectWalletIcon from '../../../assets/my_asset_connectwallet.svg';
import IsUnlockWallet from '../../../components/UnlockWallet/IsUnlockWallet';
import './Tablist.scss';

const MyAssetConnectWallet = () => {
    const { t } = useTranslation();

    return (
        <div className="my-asset-connect-wallet">
            <img src={MyAssetConnectWalletIcon as any} alt="OpenDefi" />
            <p>{t('PleaseConnectWallet')}</p>
            <IsUnlockWallet ButClassNmae="connect-wallet-button">
                <Button type="text">{t('v1_Connect_Wallet')}</Button>
            </IsUnlockWallet>
        </div>
    );
};

export default MyAssetConnectWallet;
