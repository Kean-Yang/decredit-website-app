import React from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import ConnectWalletTitle from '../../assets/com/connect-wallet-title.png';
import Failed from '../../assets/com/Failed.png';
import './Transaction.scss';
import { blacsBrowser } from '../../config';

interface DataProps {
    visible?: false | true; // 弹窗状态
    hash?: string;
    close: () => any; // 关闭弹窗
}

const TransactionFailed = ({
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
            className="decredit-transaction"
            keyboard
            mask
            maskClosable
            zIndex={999}
        >
            <div className="transaction">
                <div className="wallet-title">
                    <img src={ConnectWalletTitle as any} alt="OpenDefi" />
                </div>
                <div className="content">
                    <div className="content-title">
                        <p>{t('v1_Failed')}</p>
                    </div>
                    <div className="content-content">
                        <img src={Failed as any} alt="OpenDefi" />
                        <p>{t('PaymentFailed')}</p>
                        <span>{t('transactionFailedAagain')}</span>
                    </div>
                    <a
                        href={`${blacsBrowser}${hash}`}
                        className="link-browser"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {blacsBrowser}
                        {hash}
                    </a>
                    <Button type="text" onClick={close} className="back">
                        {t('ok')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default TransactionFailed;
