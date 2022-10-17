import React from 'react';
import { Modal, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ConnectWalletTitle from '../../../assets/com/connect-wallet-title.png';
import './AuditPending.scss';

interface DataProps {
    visible?: false | true; // 弹窗状态
    back: () => any; // 关闭弹窗
    close: () => any; // 关闭弹窗
}

const AuditPending = ({
    visible = false,
    back = () => {},
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
            className="decredit-auditPending"
            keyboard
            mask
            width={430}
            maskClosable
            zIndex={999}
        >
            <div className="auditPending">
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
                        <p>{t('infoSubmission')}</p>
                    </div>
                    <div className="start-approve">{t('AuditPending')}</div>
                    <Button type="text" onClick={back} className="back">
                        {t('ok')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AuditPending;
