import React, { useState, useEffect } from 'react';
import { Modal, InputNumber, Button, Progress, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
// import { useWallet } from 'use-wallet';
import logo from '../../assets/logo.png';
import * as Tools from '../../utils/Tools';
import Subtract from '../../assets/com/subtract.png';
import back from '../../assets/back.svg';
import explain from '../../assets/com/explain_blue.svg';
import { Token_icon } from '../../constants';
import { Native_Token } from '../../config';
import './index.scss';

interface DataProps {
    visible?: false | true; // 弹窗状态
    loading?: false | true; // 弹窗状态
    tabs?: number; // 1:借贷 2:供应撤回
    modalType?: number; // 1:借贷 2:供应撤回
    maxWithdraw?: number | string;
    borrowLimitUsed?: number | string;
    closeModal: () => any; // 关闭弹窗
    onSupply: (amount: string, decimals: any) => any; // Supply、
    onWithdraw: (amount: string, decimals: any, isMax: any) => any;
    onBorrow: (amount: string, decimals: any) => any;
    onRepay: (amount: string, decimals: any, isMax: boolean) => any;
    tabType?: number; // 1:借贷 2:供应撤回
    data: any;
    isStakeUnderlying?: false | true;
    totleBorrowBalance?: number | string;
    maxBorrowBalance?: number | string;
    collateralRatio?: number | string;
}

const SupplyBorrowRepayModal = ({
    visible = false,
    loading = false,
    tabs = 1,
    modalType = 1,
    maxWithdraw = 0,
    borrowLimitUsed = 0,
    closeModal = () => {},
    onSupply = (amount: string, decimals: any) => {},
    onWithdraw = (amount: string, decimals: any, isMax: any) => {},
    onBorrow = (amount: string, decimals: any) => {},
    onRepay = (amount: string, decimals: any, isMax: boolean) => {},
    tabType = 1,
    isStakeUnderlying = false,
    data = {},
    totleBorrowBalance = 1,
    maxBorrowBalance = 0,
    collateralRatio = 0,
}: DataProps) => {
    const { t } = useTranslation();
    const history = useHistory();
    // const wallet = useWallet();
    // const { status, connect } = wallet;
    // （1+每天释放量/存款量）^364  -1

    const {
        supplyApy,
        decimals,
        symbol,
        balance,
        borrowBalance,
        borrowApy,
        supplydistributionApy,
        borrowdistributionApy,
        isNativeToken,
        userBalance,
        mintGuardianPaused,
        borrowGuardianPaused,
        liquidity,
        collateralFactorMantissa,
    } = data;

    // 假定的贷款使用率安全值 =  借款金额/((存款金额-x) * 抵押率) = 0.85， （x:最大安全值 ）
    // 最大可取金额 = 存款金额 - (借款金额 / 假定的贷款使用率安全值 / 抵押率)

    const [inputAmount, setInputAmount] = useState(''); //
    const [isMaxFlag, setIsMaxFlag] = useState(false); //
    const [inputMaxAmount, setInputMaxAmount] = useState(''); //
    const [tabIndex, setTabIndex] = useState(tabType || 1); // tab
    const [borrowLimitUsedN, setBorrowLimitUsedN] = useState(
        Tools.fmtDec(borrowLimitUsed, 2)
    ); // tab
    const [ratio, setRatio] = useState(0);

    const maxborrowAmount = Tools.GT(
        liquidity,
        Tools.sub(maxBorrowBalance, totleBorrowBalance || 0)
    )
        ? Tools.GT(maxBorrowBalance, totleBorrowBalance)
            ? Tools.sub(maxBorrowBalance, totleBorrowBalance || 0)
            : 0
        : liquidity;

    const switchAmont = (ratio: number) => {
        setRatio(ratio);
        let maxAmount = getMaxAmount();
        setIsMaxFlag(ratio === 100);

        const amount = Tools.fmtDec(
            Tools.mul(Tools.div(ratio, 100), maxAmount || 0),
            6
        );

        getAmount(amount);
    };
    //

    const getAmount = async (value: string) => {
        console.log(value);

        setIsMaxFlag(Tools.GE(value, getMaxAmount()));

        setInputAmount(value);
        const MaxBorrow = collateralRatio
            ? Tools.plus(
                  Tools.mul(value, collateralFactorMantissa),
                  Tools.mul(value, collateralRatio)
              ) || 0
            : Tools.mul(value, collateralFactorMantissa) || 0;

        if (tabIndex === 1 && modalType === 2) {
            //   存
            setBorrowLimitUsedN(
                value !== '0' || Tools.GT(totleBorrowBalance, 0)
                    ? Tools.mul(
                          Tools.fmtDec(
                              Tools.div(
                                  totleBorrowBalance,
                                  Tools.plus(
                                      maxBorrowBalance,
                                      Number(MaxBorrow)
                                  )
                              ),
                              4
                          ),
                          100
                      )
                    : Tools.fmtDec(borrowLimitUsed, 2) || 0
            );
        } else if (tabIndex === 2 && modalType === 2) {
            // Withdraw

            // const WithdrawLimitUsed = Tools.mul(
            //     Tools.fmtDec(
            //         Tools.div(
            //             totleBorrowBalance,
            //             Tools.sub(
            //                 maxborrowAmount,
            //                 Tools.mul(value, collateralFactorMantissa)
            //             )
            //         ),
            //         4
            //     ),
            //     100
            // );

            setBorrowLimitUsedN(
                Tools.GT(maxWithdraw, 0)
                    ? Tools.fmtDec(
                          Tools.plus(
                              Tools.mul(
                                  Tools.sub(100, borrowLimitUsed),
                                  Tools.div(value, getMaxAmount())
                              ),
                              borrowLimitUsed
                          ),
                          2
                      )
                    : 100
            );
        } else if (tabIndex === 1 && modalType === 1) {
            // Borrow
            setBorrowLimitUsedN(
                value !== '0'
                    ? Tools.mul(
                          Tools.fmtDec(
                              Tools.div(
                                  Tools.plus(totleBorrowBalance, Number(value)),
                                  Number(maxBorrowBalance)
                              ),
                              4
                          ),
                          100
                      )
                    : Tools.fmtDec(borrowLimitUsed, 2) || 0
            );
        } else {
            //Repay
            setBorrowLimitUsedN(
                value !== '0'
                    ? Tools.mul(
                          Tools.fmtDec(
                              Tools.GT(totleBorrowBalance, 0)
                                  ? Tools.div(
                                        Tools.sub(
                                            totleBorrowBalance,
                                            Number(value)
                                        ),
                                        Number(maxBorrowBalance)
                                    )
                                  : 0,
                              4
                          ),
                          100
                      )
                    : Tools.fmtDec(borrowLimitUsed, 2) || 0
            );
        }
    };
    // 判断是否主链币，是主链币，当前主链币的余额为0 时显示bNB余额
    const isNativeTokenUserBalance = () => {
        return isNativeToken ? userBalance : balance;
    };

    const isNativeTokenUserSymbol = () => {
        return isNativeToken ? Native_Token : symbol;
    };

    const getMaxAmount = () => {
        if (tabIndex === 1 && modalType === 2) {
            return Tools.fmtDec(isNativeTokenUserBalance(), 6);
        } else if (tabIndex === 2 && modalType === 2) {
            // Withdraw
            return maxWithdraw;
        } else if (tabIndex === 1 && modalType === 1) {
            // Borrow
            return Tools.fmtDec(maxborrowAmount, 6);
        } else {
            //Repay
            return Tools.GE(borrowBalance, isNativeTokenUserBalance())
                ? isNativeTokenUserBalance()
                : borrowBalance;
        }
    };

    const onChangeTabIndex = (index: any) => {
        // index === tabIndex?
        setRatio(0);
        if (index === tabIndex) {
            return false;
        } else {
            setBorrowLimitUsedN(Tools.fmtDec(borrowLimitUsed, 2));
            setIsMaxFlag(false);
            setInputMaxAmount(getMaxAmount() || 0);
            setInputAmount('');
            inputMaxAmount && setTabIndex(index);
        }
    };

    useEffect(() => {
        // other code
        setInputMaxAmount(getMaxAmount() || 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const jumpCertification = () => {
        history.push('/certification');
    };

    return (
        <Modal
            footer={null}
            title={null}
            visible={visible}
            centered
            closable={false}
            className="supply-borrow-repay-modal"
            keyboard
            mask
            maskClosable
            zIndex={999}
        >
            <div className="sbr-content">
                <div className="sbr-symbol-icon">
                    <img
                        src={`${Token_icon}${symbol}.png`}
                        onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = Subtract;
                        }}
                        alt="OpenDefi"
                    />
                </div>

                <div className="content">
                    <div className="header">
                        <p>{symbol || '--'}</p>
                        <CloseOutlined
                            className="close"
                            twoToneColor="#FFFFFF"
                            onClick={closeModal}
                        />
                    </div>

                    <div className="amount">
                        <InputNumber
                            autoFocus
                            stringMode
                            precision={6}
                            min={0}
                            max={inputMaxAmount}
                            type="number"
                            placeholder={0}
                            bordered={false}
                            onChange={getAmount}
                            value={inputAmount}
                        />

                        {/* <div className="max" onClick={onMax}>
                            {modalType === 2
                                ? tabIndex === 1
                                    ? t('Max')
                                    : t('SafeMax')
                                : tabIndex === 1
                                ? t('SafeMax')
                                : t('Max')}
                        </div> */}
                    </div>

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
                                    ratio === 100 ? 'slider-tabs-active' : ''
                                }
                                onClick={() => {
                                    switchAmont(100);
                                }}
                            >
                                <span>100%</span>
                            </li>
                        </ul>
                    </div>

                    <div className="wallet-balance">
                        {modalType === 1 && tabIndex === 1 ? (
                            <div className="data-item">
                                <div>{t('AvailableBorrow')}: </div>
                                <span>
                                    {Tools.fmtDec(maxborrowAmount, 6)}
                                    &#8197;
                                    {symbol}
                                </span>
                            </div>
                        ) : (modalType === 1 && tabIndex === 2) ||
                          (modalType === 2 && tabIndex === 1) ? (
                            <div className="data-item">
                                <div>
                                    {t('WalletBalance')}: {''}
                                </div>
                                <span>
                                    {Tools.fmtDec(
                                        isNativeTokenUserBalance(),
                                        6
                                    )}{' '}
                                    &#8197;
                                    {isNativeTokenUserSymbol()}
                                </span>
                            </div>
                        ) : (
                            <div className="data-item">
                                <div>{t('AvailabeBalance')}: </div>
                                <span>
                                    {maxWithdraw}
                                    &#8197;
                                    {symbol}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="tab">
                        <div className="tab-but">
                            {modalType === 1 ? (
                                <>
                                    <Button
                                        className={
                                            tabIndex === 1 ? 'active' : ''
                                        }
                                        type="text"
                                        onClick={() => onChangeTabIndex(1)}
                                    >
                                        {t('Borrow')}
                                    </Button>
                                    <Button
                                        className={
                                            tabIndex === 2 ? 'active' : ''
                                        }
                                        type="text"
                                        onClick={() => onChangeTabIndex(2)}
                                    >
                                        {t('Repay')}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        className={
                                            tabIndex === 1 ? 'active' : ''
                                        }
                                        type="text"
                                        onClick={() => onChangeTabIndex(1)}
                                    >
                                        {t('Supply')}
                                    </Button>
                                    <Button
                                        className={
                                            tabIndex === 2 ? 'active' : ''
                                        }
                                        type="text"
                                        onClick={() => onChangeTabIndex(2)}
                                    >
                                        {t('Withdraw')}
                                    </Button>
                                </>
                            )}
                        </div>
                        <div className="tab-page">
                            {modalType === 1 && tabIndex === 1 ? (
                                <>
                                    {/* Borrow */}
                                    <div className="data-title">
                                        <span>{t('BorrowRates')}</span>
                                        <img src={back as any} alt="OpenDefi" />
                                    </div>
                                    <div className="data-item divider">
                                        <div>
                                            <img
                                                src={`${Token_icon}${symbol}.png`}
                                                onError={(e: any) => {
                                                    e.target.onerror = null;
                                                    e.target.src = Subtract;
                                                }}
                                                alt="OpenDefi"
                                            />
                                            {t('BorrowAPY')}
                                        </div>
                                        <span>
                                            {borrowApy
                                                ? `${
                                                      Tools.fmtDec(
                                                          borrowApy,
                                                          4
                                                      ) || 0
                                                  }%`
                                                : '--'}
                                        </span>
                                    </div>
                                    <div className="data-item">
                                        <div>
                                            <img
                                                src={logo as any}
                                                alt="OpenDefi"
                                            />
                                            {t('DistributionAPY')}
                                        </div>
                                        <span>
                                            {borrowdistributionApy || 0}%
                                        </span>
                                    </div>

                                    <div className="data-title">
                                        <span>{t('BorrowLimit')}</span>
                                        {isStakeUnderlying ? (
                                            <Button
                                                className="credit"
                                                type="text"
                                                onClick={jumpCertification}
                                            >
                                                {t('Credit')}
                                            </Button>
                                        ) : (
                                            <Tooltip
                                                placement="right"
                                                title={t('enbaleCreditLoan')}
                                            >
                                                <span className="credit-disabled">
                                                    {t('Credit')}
                                                </span>
                                            </Tooltip>
                                        )}

                                        <Tooltip
                                            placement="right"
                                            color={
                                                'linear-gradient(338deg, rgba(255, 255, 255, 0.31) 0%, rgba(255, 255, 255, 0.6) 100%) linear-gradient(342deg, #577FE5 0%, #AAC0FA 100%)'
                                            }
                                            title={t('ClickCreditBorrow')}
                                        >
                                            <img
                                                src={explain as any}
                                                alt="OpenDefi"
                                            />
                                        </Tooltip>
                                    </div>

                                    <div className="data-item divider">
                                        <div>{t('EstimatedBorrowLimit')}</div>
                                        <span>
                                            {Tools.fmtDec(
                                                maxBorrowBalance,
                                                6
                                            ) || 0}
                                            &#8197;
                                            {symbol}
                                        </span>
                                    </div>
                                    <div className="data-item">
                                        <div>
                                            {t('EstimatedBorrowLimitUsed')}
                                        </div>
                                        <span>{borrowLimitUsedN || '--'}%</span>
                                    </div>

                                    <Progress
                                        strokeColor={{
                                            '0%': '#AAC0FA',
                                            '100%': '#577FE5',
                                        }}
                                        trailColor="#DBDBDB"
                                        showInfo={false}
                                        percent={borrowLimitUsedN}
                                    />
                                    <Button
                                        className={
                                            borrowGuardianPaused
                                                ? 'but-disabled'
                                                : 'but'
                                        }
                                        type="text"
                                        loading={loading}
                                        disabled={borrowGuardianPaused}
                                        onClick={() => {
                                            if (
                                                Tools.GT(Number(inputAmount), 0)
                                            )
                                                onBorrow(inputAmount, decimals);
                                        }}
                                    >
                                        {t('Borrow')}
                                    </Button>
                                </>
                            ) : modalType === 1 && tabIndex === 2 ? (
                                <>
                                    {/* Repay */}
                                    <div className="data-title">
                                        <span>{t('SupplyRates')}</span>
                                        <img src={back as any} alt="OpenDefi" />
                                    </div>
                                    <div className="data-item divider">
                                        <div>
                                            <img
                                                src={`${Token_icon}${symbol}.png`}
                                                onError={(e: any) => {
                                                    e.target.onerror = null;
                                                    e.target.src = Subtract;
                                                }}
                                                alt="OpenDefi"
                                            />
                                            {t('SupplyAPY')}
                                        </div>
                                        <span>
                                            {supplyApy
                                                ? `${
                                                      Tools.fmtDec(
                                                          supplyApy,
                                                          4
                                                      ) || 0
                                                  }%`
                                                : '--'}
                                        </span>
                                    </div>
                                    <div className="data-item">
                                        <div>
                                            <img
                                                src={logo as any}
                                                alt="OpenDefi"
                                            />
                                            {t('DistributionAPY')}
                                        </div>
                                        <span>
                                            {supplydistributionApy || 0}%
                                        </span>
                                    </div>

                                    <div className="data-item divider">
                                        <div>{t('EstimatedBorrowLimit')}</div>
                                        <span>
                                            {Tools.fmtDec(
                                                maxBorrowBalance,
                                                6
                                            ) || 0}{' '}
                                            {symbol}
                                        </span>
                                    </div>
                                    <div className="data-item">
                                        <div>
                                            {t('EstimatedBorrowLimitUsed')}
                                        </div>
                                        <span>{borrowLimitUsedN || '--'}%</span>
                                    </div>

                                    <Progress
                                        strokeColor={{
                                            '0%': '#AAC0FA',
                                            '100%': '#577FE5',
                                        }}
                                        trailColor="#DBDBDB"
                                        showInfo={false}
                                        percent={borrowLimitUsedN}
                                    />

                                    <Button
                                        className="but"
                                        type="text"
                                        loading={loading}
                                        onClick={() => {
                                            if (
                                                Tools.GT(Number(inputAmount), 0)
                                            )
                                                onRepay(
                                                    inputAmount,
                                                    decimals,
                                                    isMaxFlag
                                                );
                                        }}
                                    >
                                        {t('Repay')}
                                    </Button>
                                </>
                            ) : modalType === 2 && tabIndex === 1 ? (
                                <>
                                    {/* Supply */}
                                    <div className="data-title">
                                        <span>{t('SupplyRates')}</span>
                                        <img src={back as any} alt="OpenDefi" />
                                    </div>
                                    <div className="data-item divider">
                                        <div>
                                            <img
                                                src={`${Token_icon}${symbol}.png`}
                                                onError={(e: any) => {
                                                    e.target.onerror = null;
                                                    e.target.src = Subtract;
                                                }}
                                                alt="OpenDefi"
                                            />
                                            {t('SupplyAPY')}
                                        </div>
                                        <span>
                                            {supplyApy
                                                ? `${
                                                      Tools.fmtDec(
                                                          supplyApy,
                                                          4
                                                      ) || 0
                                                  }%`
                                                : '--'}
                                        </span>
                                    </div>
                                    <div className="data-item">
                                        <div>
                                            <img
                                                src={logo as any}
                                                alt="OpenDefi"
                                            />
                                            {t('DistributionAPY')}
                                        </div>
                                        <span>
                                            {supplydistributionApy || 0}%
                                        </span>
                                    </div>

                                    <div className="data-title">
                                        <span>{t('BorrowLimit')}</span>
                                    </div>

                                    <div className="data-item divider">
                                        <div>{t('EstimatedBorrowLimit')}</div>
                                        <span>
                                            {Tools.fmtDec(
                                                maxBorrowBalance,
                                                6
                                            ) || 0}
                                            &#8197;
                                            {symbol}
                                        </span>
                                    </div>
                                    <div className="data-item">
                                        <div>
                                            {t('EstimatedBorrowLimitUsed')}
                                        </div>
                                        <span>{borrowLimitUsedN || '--'}%</span>
                                    </div>

                                    <Progress
                                        strokeColor={{
                                            '0%': '#AAC0FA',
                                            '100%': '#577FE5',
                                        }}
                                        trailColor="#DBDBDB"
                                        showInfo={false}
                                        percent={borrowLimitUsedN}
                                    />

                                    <Button
                                        className={
                                            mintGuardianPaused
                                                ? 'but-disabled'
                                                : 'but'
                                        }
                                        type="text"
                                        loading={loading}
                                        disabled={mintGuardianPaused}
                                        onClick={() => {
                                            if (
                                                Tools.GT(Number(inputAmount), 0)
                                            )
                                                onSupply(inputAmount, decimals);
                                        }}
                                    >
                                        {t('Supply')}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {/* Withdraw */}
                                    <div className="data-title">
                                        <span>{t('SupplyRates')}</span>
                                        <img src={back as any} alt="OpenDefi" />
                                    </div>
                                    <div className="data-item divider">
                                        <div>
                                            <img
                                                src={`${Token_icon}${symbol}.png`}
                                                onError={(e: any) => {
                                                    e.target.onerror = null;
                                                    e.target.src = Subtract;
                                                }}
                                                alt="OpenDefi"
                                            />
                                            {t('SupplyAPY')}
                                        </div>
                                        <span>
                                            {supplyApy
                                                ? `${
                                                      Tools.fmtDec(
                                                          supplyApy,
                                                          4
                                                      ) || 0
                                                  }%`
                                                : '--'}
                                        </span>
                                    </div>
                                    <div className="data-item">
                                        <div>
                                            <img
                                                src={logo as any}
                                                alt="OpenDefi"
                                            />
                                            {t('DistributionAPY')}
                                        </div>
                                        <span>
                                            {supplydistributionApy || 0}%
                                        </span>
                                    </div>

                                    <div className="data-title">
                                        <span>{t('BorrowLimit')}</span>
                                    </div>

                                    <div className="data-item divider">
                                        <div>{t('BorrowLimit')}</div>
                                        <span>
                                            {Tools.fmtDec(
                                                maxBorrowBalance,
                                                6
                                            ) || 0}{' '}
                                            {symbol}
                                        </span>
                                    </div>
                                    <div className="data-item">
                                        <div>
                                            {t('EstimatedBorrowLimitUsed')}
                                        </div>
                                        <span>
                                            {Tools.GT(maxWithdraw, 0)
                                                ? borrowLimitUsedN
                                                : 100 || '--'}
                                            %
                                        </span>
                                    </div>

                                    <Progress
                                        strokeColor={{
                                            '0%': '#AAC0FA',
                                            '100%': '#577FE5',
                                        }}
                                        trailColor="#DBDBDB"
                                        showInfo={false}
                                        percent={
                                            Tools.GT(maxWithdraw, 0)
                                                ? borrowLimitUsedN
                                                : 100
                                        }
                                    />
                                    <Button
                                        className="but"
                                        type="text"
                                        loading={loading}
                                        onClick={() => {
                                            console.log(inputAmount, isMaxFlag);
                                            if (
                                                Tools.GT(Number(inputAmount), 0)
                                            )
                                                onWithdraw(
                                                    inputAmount,
                                                    decimals,
                                                    isMaxFlag
                                                );
                                        }}
                                    >
                                        {t('Withdraw')}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SupplyBorrowRepayModal;
