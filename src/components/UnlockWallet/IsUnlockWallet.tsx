import React, { useCallback, useState } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useWallet } from 'use-wallet';
import { CHAINID } from '../../config';
import { SwitchNetworkRequest } from '../../utils/wallet';
import ConnectWallet from '../ConnectWallet';

const IsUnlockWallet = (props: any) => {
    const { t } = useTranslation();
    const wallet = useWallet();
    const { status, connect, chainId } = wallet;
    const [visible, setVisible] = useState(false);

    const showConnectWallet = useCallback(() => {
        setVisible(true);
    }, []);
    const hideConnectWallet = useCallback(() => {
        setVisible(false);
    }, []);

    return (
        <>
            {(!(window as any).web3 as any) ? (
                <a
                    href="https://metamask.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        type="primary"
                        className={props.ButClassNmae}
                        block={props.block || false}
                    >
                        {t('v1_Install_MetaMask')}
                    </Button>
                </a>
            ) : !wallet || status !== 'connected' ? (
                <Button
                    block={props.block}
                    className={props.ButClassNmae}
                    onClick={() => {
                        showConnectWallet();
                        // if (chainId !== CHAINID) {
                        //     SwitchNetworkRequest(CHAINID, () => {
                        //         connect('injected');
                        //     });
                        // } else {
                        //     connect('injected');
                        // }
                    }}
                >
                    {t('v1_Connect_Wallet')}
                </Button>
            ) : (
                props.children
            )}

            <ConnectWallet
                visible={visible}
                close={hideConnectWallet}
                connect={() => {
                    if (chainId !== CHAINID) {
                        SwitchNetworkRequest(CHAINID, () => {
                            connect('injected');
                        });
                    } else {
                        connect('injected');
                    }
                }}
            />
        </>
    );
};

export default IsUnlockWallet;
