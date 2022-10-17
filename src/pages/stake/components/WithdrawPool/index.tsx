import React from 'react';
import { Modal, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Token_icon } from '../../../../constants';
import { INIT_SYMBOL } from '../../../../config';
import Subtract from '../../../../assets/com/subtract.png';
import './index.scss';

interface DataProps {
    visible?: false | true; // 弹窗状态
    amount?: any; //
    butLoading?: false | true; // 弹窗状态
    withdraw: (amount: string, isMax: boolean) => any; // withdraw
    close: () => any; // 关闭弹窗
}

const WithdrawPool = ({
    visible = false,
    amount = 0,
    butLoading = false,
    withdraw = () => {},
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
            className="withdraw-pool"
            keyboard
            mask
            width={430}
            maskClosable
            zIndex={999}
        >
            <div className="stake-pithdraw-content">
                <div className="header">
                    <p>{t('WithdrawPool')}</p>
                    <CloseOutlined
                        className="close"
                        twoToneColor="#FFFFFF"
                        onClick={() => {
                            close();
                        }}
                    />
                </div>
                <div className="content">
                    <div className="title">
                        <div className="stake-pithdraw-amount">
                            <img
                                src={`${Token_icon}${INIT_SYMBOL}.png`}
                                onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = Subtract;
                                }}
                                alt="OpenDefi"
                            />
                            <p>{INIT_SYMBOL}</p>
                        </div>
                    </div>

                    <div className="amount">
                        {amount} {INIT_SYMBOL}
                    </div>
                </div>
                <Button
                    type="text"
                    loading={butLoading}
                    onClick={withdraw}
                    className="back"
                >
                    {t('Withdraw')}
                </Button>
            </div>
        </Modal>
    );
};

export default WithdrawPool;
