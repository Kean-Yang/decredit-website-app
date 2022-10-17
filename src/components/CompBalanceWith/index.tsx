import React from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { Token_icon } from '../../constants';
import { CloseOutlined } from '@ant-design/icons';
import { INIT_SYMBOL } from '../../config';
import Subtract from '../../assets/com/subtract.png';
import './index.scss';

interface DataProps {
    visible?: false | true; // 弹窗状态
    loading?: false | true; // 按钮状态
    data?: any; // 页面数据
    withdraw: () => any; //
    close: () => any; // 关闭弹窗
}

const CompBalanceWith = ({
    visible = false,
    loading = false,
    data = {},
    withdraw = () => {},
    close = () => {},
}: DataProps) => {
    const { t } = useTranslation();
    const { allocated } = data;

    return (
        <Modal
            footer={null}
            title={null}
            visible={visible}
            centered
            closable={false}
            className="comp-balanceWith-modal"
            keyboard
            mask
            width={430}
            maskClosable
            zIndex={999}
        >
            <div className="comp-balanceWith">
                <div className="comp-BalanceWith-content">
                    <div className="content-header">
                        <p>Decredit Balance</p>
                        <CloseOutlined
                            className="close"
                            twoToneColor="#FFFFFF"
                            onClick={() => {
                                close();
                            }}
                        />
                    </div>
                    <div className="comp-BalanceWith-title">
                        <img
                            src={`${Token_icon}${INIT_SYMBOL}.png`}
                            onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = Subtract;
                            }}
                            alt="OpenDefi"
                        />
                        <p>
                            {allocated || '--'} {INIT_SYMBOL}
                        </p>
                        {/* <span>$0.00</span> */}
                    </div>
                    {/* <div className="content">
                        <ul>
                            <li>
                                <span>{t('WalletBalance')}:</span>
                                <span>
                                    {balance || '--'} {INIT_SYMBOL}
                                </span>
                            </li>
                            <li>
                                <span>{t('Unclaimed Balance')}</span>
                                <span>
                                    {allocated || '--'} {INIT_SYMBOL}
                                </span>
                            </li>
                            <li>
                                <span>{t('Price')}:</span>
                                <span>0</span>
                            </li>
                        </ul>
                    </div> */}
                    <Button
                        type="text"
                        loading={loading}
                        onClick={withdraw}
                        className="back"
                    >
                        {t('Withdraw')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CompBalanceWith;
