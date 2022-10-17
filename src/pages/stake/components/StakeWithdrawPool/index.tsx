import React, { useState, useEffect } from 'react';
import { Modal, Button, InputNumber, Slider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Token_icon } from '../../../../constants';
import { INIT_SYMBOL } from '../../../../config';
import Subtract from '../../../../assets/com/subtract.png';
import * as Tools from '../../../../utils/Tools';
import './index.scss';

interface DataProps {
    visible?: false | true; // 弹窗状态
    data?: any; //
    type?: string; //
    butLoading?: false | true; // 弹窗状态
    stake: (amount: string) => any; // stake
    withdraw: (amount: string, isMax: boolean) => any; // withdraw
    close: () => any; // 关闭弹窗
}

const StakeWithdrawPool = ({
    visible = false,
    data = {},
    type = 'stake',
    butLoading = false,
    stake = () => {},
    withdraw = () => {},
    close = () => {},
}: DataProps) => {
    const { t } = useTranslation();
    const { symbol, balance, balanceOfUnderlying } = data;
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');
    const [ratio, setRatio] = useState(0);

    const switchAmont = (ratio: number) => {
        setRatio(ratio);
        console.log(
            type === 'stake'
                ? Tools.mul(Tools.div(ratio, 100), balance || 0)
                : Tools.mul(Tools.div(ratio, 100), balanceOfUnderlying || 0)
        );

        if (type === 'stake') {
            console.log(Tools.mul(Tools.div(ratio, 100), balance || 0));
            setStakeAmount(Tools.mul(Tools.div(ratio, 100), balance || 0));
        } else {
            console.log(
                Tools.mul(Tools.div(ratio, 100), balanceOfUnderlying || 0)
            );
            setWithdrawAmount(
                Tools.mul(Tools.div(ratio, 100), balanceOfUnderlying || 0)
            );
        }
    };

    useEffect(() => {
        // other code
        type === 'stake' ? setStakeAmount('') : setWithdrawAmount('');
        setRatio(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, visible]);

    return (
        <Modal
            footer={null}
            title={null}
            visible={visible}
            centered
            closable={false}
            className="stake-pithdraw-pool"
            keyboard
            mask
            width={430}
            maskClosable
            zIndex={999}
        >
            <div className="stake-pithdraw-content">
                <div className="header">
                    <p>
                        {type === 'stake' ? t('StakeToPool') : t('UnlockPool')}
                    </p>
                    <CloseOutlined
                        className="close"
                        twoToneColor="#FFFFFF"
                        onClick={() => {
                            setRatio(0);
                            type === 'stake'
                                ? setStakeAmount('')
                                : setWithdrawAmount('');
                            close();
                        }}
                    />
                </div>
                <div className="content">
                    <div className="title">
                        <div className="stake-pithdraw-amount">
                            <img
                                src={`${Token_icon}${symbol}.png`}
                                onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = Subtract;
                                }}
                                alt="OpenDefi"
                            />
                            <p>{INIT_SYMBOL}</p>
                        </div>
                    </div>

                    {type === 'stake' ? (
                        ''
                    ) : (
                        <p className="desc">{t('WithdrawDaylockup')}</p>
                    )}

                    <div className="amount">
                        {type === 'stake' ? (
                            <InputNumber
                                min={0}
                                placeholder="Please input quantity"
                                value={stakeAmount}
                                max={balance}
                                onChange={(val: any) => {
                                    setRatio(0);
                                    console.log(val);
                                    setStakeAmount(val);
                                }}
                            />
                        ) : (
                            <InputNumber
                                min={0}
                                max={balanceOfUnderlying}
                                placeholder="Please input quantity"
                                value={withdrawAmount}
                                onChange={(val: any) => {
                                    setRatio(0);
                                    setWithdrawAmount(val);
                                }}
                            />
                        )}

                        <p className="wallet-balance-amount">
                            {type === 'stake'
                                ? t('WalletBalance')
                                : t('StakeBalance')}
                            {': '}
                            {type === 'stake'
                                ? balance
                                : balanceOfUnderlying}{' '}
                            {INIT_SYMBOL}
                        </p>

                        <Slider
                            defaultValue={ratio}
                            value={ratio}
                            onChange={switchAmont}
                            tooltipVisible={false}
                            marks={ratio}
                        />
                        <p className="slider-ratio">
                            <span style={{ left: `${ratio}%` }}>
                                {ratio || 0}%
                            </span>
                        </p>
                        <div className="slider-tabs">
                            <ul>
                                <li
                                    className={
                                        ratio === 25 ? 'slider-tabs-active' : ''
                                    }
                                    onClick={() => {
                                        switchAmont(25);
                                    }}
                                >
                                    <span>25%</span>
                                </li>
                                <li
                                    className={
                                        ratio === 50 ? 'slider-tabs-active' : ''
                                    }
                                    onClick={() => {
                                        switchAmont(50);
                                    }}
                                >
                                    <span>50%</span>
                                </li>
                                <li
                                    className={
                                        ratio === 75 ? 'slider-tabs-active' : ''
                                    }
                                    onClick={() => {
                                        switchAmont(75);
                                    }}
                                >
                                    <span>75%</span>
                                </li>
                                <li
                                    className={
                                        ratio === 100
                                            ? 'slider-tabs-active'
                                            : ''
                                    }
                                    onClick={() => {
                                        switchAmont(100);
                                    }}
                                >
                                    <span>100%</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Button
                    type="text"
                    loading={butLoading}
                    onClick={() => {
                        console.log(
                            withdrawAmount,
                            ratio === 100 ? true : false
                        );

                        if (type === 'stake' && stakeAmount) {
                            stake(
                                stakeAmount ||
                                    Tools.mul(
                                        Tools.div(ratio, 100),
                                        balance || 0
                                    )
                            );
                        } else if (type === 'Withdraw' && withdrawAmount) {
                            withdraw(
                                withdrawAmount,
                                ratio === 100 ? true : false
                            );
                        } else {
                            return false;
                        }
                    }}
                    className="back"
                >
                    {type === 'stake' ? t('Stake') : t('Unlock')}
                </Button>
            </div>
        </Modal>
    );
};

export default StakeWithdrawPool;
