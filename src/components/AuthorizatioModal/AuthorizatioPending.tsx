import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import ConnectWalletTitle from '../../assets/com/connect-wallet-title.png';
import './Authorizatio.scss';
import { blacsBrowser } from '../../config';

interface DataProps {
    visible?: false | true; // 弹窗状态
    hash?: string;
    close: () => any; // 关闭弹窗
}

const AuthorizatioPending = ({
    visible = false,
    hash = '',
    close = () => {},
}: DataProps) => {
    const { t } = useTranslation();

    return (
        <Modal
            footer={null}
            title={null}
            visible={visible}
            centered
            closable={false}
            className="decredit-authorizatio"
            keyboard
            mask
            maskClosable
            zIndex={999}
        >
            <div className="authorizatio">
                <div className="wallet-title">
                    <img src={ConnectWalletTitle as any} alt="OpenDefi" />
                </div>
                <div className="content">
                    <div className="content-title">
                        <p>{t('ConfirmAuthorization')}</p>
                    </div>
                    <div className="content-content ">
                        <div className="loading">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span>{t('v1_authorization')}</span>
                    </div>

                    <a
                        href={`${blacsBrowser}${hash}`}
                        className="link-browser pending"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {blacsBrowser}
                        {hash}
                    </a>
                    {/* <Button type="text" onClick={close} className="back">
                        {t('back')}
                    </Button> */}
                </div>
            </div>
        </Modal>
    );
};

export default AuthorizatioPending;
