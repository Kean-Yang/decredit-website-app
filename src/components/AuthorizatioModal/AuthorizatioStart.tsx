import React from 'react';
import { Modal, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ConnectWalletTitle from '../../assets/com/connect-wallet-title.png';
import './Authorizatio.scss';

interface DataProps {
    visible?: false | true; // 弹窗状态
    butLoading: false | true; // 弹窗状态
    approve: () => any; // 关闭弹窗
    close: () => any; // 关闭弹窗
}

const AuthorizatioStart = ({
    visible = false,
    butLoading = false,
    approve = () => {},
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

                    <CloseOutlined
                        className="close"
                        twoToneColor="#FFFFFF"
                        onClick={close}
                    />
                </div>
                <div className="content">
                    <div className="content-title">
                        <p>{t('ConfirmAuthorization')}</p>
                    </div>
                    <div className="start-approve">
                        {t('AllTokenPermission')}
                    </div>
                    <Button
                        type="text"
                        onClick={approve}
                        loading={butLoading}
                        className="back"
                    >
                        {t('v1_Approve')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AuthorizatioStart;
