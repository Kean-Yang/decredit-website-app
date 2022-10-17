import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMedia } from 'react-use';
import ConnectWalletTitle from '../../assets/com/connect-wallet-title.png';
import route from '../../assets/com/route.png';
import Metamask from '../../assets/com/Metamask.png';
import ConnectWalletFooter from '../../assets/com/connect-wallet-footer.png';
import closeIcon from '../../assets/com/close.png';
import './ConnectWallet.scss';

interface DataProps {
    visible?: false | true; // 弹窗状态
    close: () => any; // 关闭弹窗
    connect: () => any; // 链接钱包
}

const ConnectWallet = ({
    visible = false,
    close = () => {},
    connect = () => {},
}: DataProps) => {
    const { t } = useTranslation();
    const below768 = useMedia('(max-width: 768px)');

    return (
        <Modal
            footer={null}
            title={null}
            visible={visible}
            centered
            closable={false}
            className="connect-wallet-modal"
            keyboard
            mask
            width={!below768 ? 360 : 230}
            maskClosable
            zIndex={999}
        >
            <div className="connect-wallet-content">
                <div className="wallet-title">
                    <img src={ConnectWalletTitle as any} alt="OpenDefi" />
                </div>
                <div className="content">
                    <div className="content-title">
                        <p>{t('v1_Connect_Wallet')}</p>
                        <span>{t('stratUsingDecredit')}</span>
                    </div>
                    <div className="content-content">
                        <ul>
                            <li onClick={connect}>
                                <img src={Metamask as any} alt="OpenDefi" />
                                <span>Metamask</span>
                            </li>
                        </ul>
                    </div>
                    <div className="footer">
                        <img src={ConnectWalletFooter as any} alt="OpenDefi" />
                    </div>
                </div>
                <div className="close">
                    <img className="route" src={route as any} alt="OpenDefi" />
                    <img
                        className="close-but"
                        onClick={close}
                        src={closeIcon as any}
                        alt="OpenDefi"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ConnectWallet;
