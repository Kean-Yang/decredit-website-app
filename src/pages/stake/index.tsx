import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Statistic, Row, Col } from 'antd';
import { useHistory } from 'react-router-dom';
import TransactionModal from '../../components/TransactionModal';
import AuthorizatioModal from '../../components/AuthorizatioModal';
import Rewards from './components/Rewards';
import StakeWithdrawPool from './components/StakeWithdrawPool';
import WithdrawPool from './components/WithdrawPool';
import banner from '../../assets/banner.png';
import bannerIcon from '../../assets/stake_banner_icon.png';
import * as Tools from '../../utils/Tools';
import { Token_icon } from '../../constants';
import {
    StakingPoolAddress,
    INIT_SYMBOL,
    DTCTAddress,
    blacsBrowserPoll,
    HighYieldPoolAddress,
    HighYieldPoolAddress2,
} from '../../config';
import Subtract from '../../assets/com/subtract.png';
import './index.scss';
import { useWallet } from 'use-wallet';
import { getSymbolInfo, getSymbolBalanceInfo } from '../../contract/Dashboard';
import {
    ContractStake,
    ContractRequestUnstake,
    contractBalanceOfUnderlying,
    ContractAirDropwithdraw,
    Contractwithdraw,
    IsGetReceiveAirdrop,
    contractTotalBalance,
    getContractApy,
    getUserEarned,
    ContractIsWithdraw,
    ContractApprove,
    IsAllowance,
    contractWithdrawTime,
    ContractWithdrawAmount,
    ContractLockedBalance,
    ContractclaimReward,
    ContractGetPoolData,
} from '../../contract/Stake';
const { Countdown } = Statistic;

const Stake = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const wallet = useWallet();
    const { account, status, ethereum } = wallet;
    const [approveLoading, setApproveLoading] = useState(false); // approve按钮Loading
    const [butLoading, setButLoading] = useState(false); //  stake按钮Loading  Withdraw按钮Loading
    const [withdrawLoading, setWithdrawLoading] = useState(false); //   Withdraw按钮Loading
    const [transactionStatus, setTransactionStatus] = useState(''); // failed:交易失败 pending:交易进行中 succes:交易成功 null取消弹窗
    const [authorizatioStatus, setAuthorizatioStatus] = useState('');
    const [visible, setVisible] = useState(false); // 交易弹窗
    const [isEnable, setIsEnable] = useState(false); // isEnable
    // const [isNotEnable, setIsNotEnable] = useState(false); // isEnable
    // const [isNotWithdraw, setIsNotWithdraw] = useState(false); //
    const [withdrawAmount, setWithdrawAmount] = useState(0); //
    const [rewardsVisible, setRewardsVisible] = useState(false); //
    const [isWithdraw, setIsWithdraw] = useState(false); //
    const [stakeWithdrawPoolType, setStakeWithdrawPoolType] = useState('stake'); //弹窗类型
    const [balanceOfUnderlying, setBalanceOfUnderlying] = useState(0); //可解锁金额;
    const [apy, setApy] = useState(0); //apr;
    const [totalBalance, setTotalBalance] = useState({}); //总质押金额; 1池
    // const [USDTtotalBalance, setUSDTtotalBalance] = useState(0); //本金加奖励;
    const [earned, setEarned] = useState(0); //可领取的空投数;
    const [isReceiveAirdrop, setIsReceiveAirdrop] = useState(false); //是否可以领取空投;
    // const [isHaveAirdrop, setIsHaveAirdrop] = useState(false); //是否已经领取过空投;
    const [balance, setBalance] = useState(0); //用户余额
    const [withdrawTime, setWithdrawTime] = useState(0); //获取可提取 stake 的时间 1 池
    const [hash, setHash] = useState('');
    const [withdrawPoolVisible, setWithdrawPoolVisible] = useState(false);

    const [lockedBalance, setLockedBalance] = useState(0);
    const [claimRewardLoading, setClaimRewardLoading] = useState('');

    // const [stakeBalance, setStakeBalance] = useState(0);
    const [poolData, setPoolData] = useState({}); // 二池数据
    const [poolData2, setPoolData2] = useState({}); // 三池数据
    //

    const [poolType, setPoolType] = useState(0);

    // 二池
    const getPoolData = async (ethereum: any, account: any, type: number) => {
        const date = await ContractGetPoolData(ethereum, account, type);
        setPoolData(date);
    };

    const getPoolData2 = async (ethereum: any, account: any, type: number) => {
        const date2 = await ContractGetPoolData(ethereum, account, type);

        setPoolData2(date2);
    };

    const getAllData = async (ethereum: any, account: any) => {
        const BalanceOf = await contractBalanceOfUnderlying(ethereum, account);
        setBalanceOfUnderlying(
            Tools.fmtDec(Tools.numDivDecimals(BalanceOf, 18), 6) || 0
        );
        const Apr = await getContractApy(ethereum);

        setApy(Tools.fmtDec(Tools.mul(Apr, 100), 2) || 0);

        // 需查询

        // const USDTTotalBalanceNumber =
        //     totalBalanceNumber &&
        //     (await switchUSDTPrice(
        //         Tools.numDivDecimals(totalBalanceNumber, 18),
        //         18,
        //         ''
        //     ));
        setTotalBalance(
            Tools.fmtDec(
                Tools.numDivDecimals(await contractTotalBalance(ethereum), 18),
                6
            )
        );
        setIsEnable(
            Tools.GT(
                await IsAllowance(
                    ethereum,
                    account,
                    DTCTAddress,
                    StakingPoolAddress
                ),
                0
            )
        );

        const SymbolInfo: any = await getSymbolInfo(
            ethereum,
            StakingPoolAddress
        );
        const { decimal } = SymbolInfo;
        const earnedNumber = await getUserEarned(ethereum, account);
        setEarned(Tools.numDivDecimals(earnedNumber || 0, decimal));
        setIsReceiveAirdrop(await IsGetReceiveAirdrop(ethereum, account));
        setBalance(
            Tools.fmtDec(
                await getSymbolBalanceInfo(ethereum, account, DTCTAddress),
                6
            ) || 0
        );

        const withdrawTimes = await contractWithdrawTime(ethereum, account);
        setWithdrawTime(withdrawTimes * 1000);

        const withdrawAmountNumber = await ContractWithdrawAmount(
            ethereum,
            account
        );

        setWithdrawAmount(withdrawAmountNumber || 0);
        const lockedBalanceNumber = await ContractLockedBalance(
            ethereum,
            account
        );

        setLockedBalance(
            Tools.fmtDec(Tools.numDivDecimals(lockedBalanceNumber, 18), 6)
        );

        // 立马可以取，但是三天以后需要重新发起一次取才能到账
        setIsWithdraw(await ContractIsWithdraw(ethereum, account));
    };

    const IsAllowanceFUn = async (account: string) => {
        setIsEnable(
            Tools.GT(
                await IsAllowance(
                    ethereum,
                    account,
                    DTCTAddress,
                    StakingPoolAddress
                ),
                0
            )
        );
    };

    useEffect(() => {
        // other code
        if (account) getAllData(ethereum, account);
        if (account) getPoolData(ethereum, account, 1);
        if (account) getPoolData2(ethereum, account, 2);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethereum, account]);

    useEffect(() => {
        // other code
        let timer: any = undefined;
        if (!account) {
            clearInterval(timer);
            return;
        }
        if (!timer && account) {
            timer = setInterval(() => {
                getAllData(ethereum, account);
                getPoolData(ethereum, account, 1);
                getPoolData2(ethereum, account, 2);
            }, 20 * 2000);
        }
        return () => {
            clearInterval(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethereum, account]);

    const showVisible = useCallback(() => {
        setVisible(true);
    }, []);
    const hideVisible = useCallback(() => {
        setVisible(false);
    }, []);

    const showRewardsVisible = useCallback(() => {
        setRewardsVisible(true);
    }, []);
    const hideRewardsVisible = useCallback(() => {
        setRewardsVisible(false);
    }, []);

    const showWithdrawPoolVisible = useCallback(() => {
        setWithdrawPoolVisible(true);
    }, []);
    const hideWithdrawPoolVisible = useCallback(() => {
        setWithdrawPoolVisible(false);
    }, []);

    const approve = async (type: number) => {
        setApproveLoading(true);
        await ContractApprove(
            ethereum,
            account,
            DTCTAddress,
            type,
            (transactionHash: any) => {
                setHash(transactionHash);
                setAuthorizatioStatus('pending');
            },
            async () => {
                setAuthorizatioStatus('succes');
                type === 0
                    ? IsAllowanceFUn(account)
                    : type === 1
                    ? getPoolData(ethereum, account, 1)
                    : getPoolData(ethereum, account, 2);
                setApproveLoading(false);
            },
            () => {
                setAuthorizatioStatus('failed');
                setApproveLoading(false);
            },
            () => {
                setAuthorizatioStatus('');
                setApproveLoading(false);
            }
        )
            .then((res) => {})
            .catch((err) => {
                setAuthorizatioStatus('');
                setApproveLoading(false);
            });
    };

    // // stake
    const onTransferstake = async (amount: string) => {
        setButLoading(true);
        await ContractStake(
            ethereum,
            account,
            amount,
            poolType,
            (transactionHash: any) => {
                setHash(transactionHash);
                setTransactionStatus('pending');
            },
            () => {
                setTransactionStatus('succes');
                getAllData(ethereum, account);
                poolType === 0
                    ? getAllData(ethereum, account)
                    : poolType === 1
                    ? getPoolData(ethereum, account, 1)
                    : getPoolData2(ethereum, account, 2);

                setButLoading(false);
                hideVisible();
            },
            () => {
                setTransactionStatus('failed');
                setButLoading(false);
                hideVisible();
            },
            () => {
                setTransactionStatus('');
                setButLoading(false);
                hideVisible();
            }
        )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                setTransactionStatus('');
                setButLoading(false);
                hideVisible();
            });
    };

    // // AirDropwithdraw
    const onTransferAirDropwithdraw = async () => {
        setButLoading(true);
        await ContractAirDropwithdraw(
            ethereum,
            account,
            (transactionHash: any) => {
                setHash(transactionHash);
                setTransactionStatus('pending');
            },
            () => {
                setTransactionStatus('succes');
                setButLoading(false);
                hideVisible();
                showRewardsVisible();
            },
            () => {
                setTransactionStatus('failed');
                setButLoading(false);
                hideVisible();
            },
            () => {
                setTransactionStatus('');
                setButLoading(false);
                hideVisible();
            }
        )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                setTransactionStatus('');
                setButLoading(false);
                hideVisible();
            });
    };

    // ContractRequestUnstake
    const onTransferRequestUnstake = async (amount: string, isMax: boolean) => {
        setButLoading(true);
        await ContractRequestUnstake(
            ethereum,
            account,
            amount,
            isMax,
            (transactionHash: any) => {
                setHash(transactionHash);
                setTransactionStatus('pending');
            },
            () => {
                setTransactionStatus('succes');
                getAllData(ethereum, account);
                setButLoading(false);
                hideVisible();
            },
            () => {
                setTransactionStatus('failed');
                setButLoading(false);
                hideVisible();
            },
            () => {
                setTransactionStatus('');
                setButLoading(false);
                hideVisible();
            }
        )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                setTransactionStatus('');
                setButLoading(false);
                hideVisible();
            });
    };

    // // Withdraw
    const onTransferWithdraw = async () => {
        setWithdrawLoading(true);
        await Contractwithdraw(
            ethereum,
            account,
            poolType,
            (transactionHash: any) => {
                setHash(transactionHash);
                setTransactionStatus('pending');
            },
            () => {
                setTransactionStatus('succes');
                poolType === 0
                    ? getAllData(ethereum, account)
                    : poolType === 1
                    ? getPoolData(ethereum, account, 1)
                    : getPoolData2(ethereum, account, 2);
                setWithdrawLoading(false);
                hideVisible();
                hideWithdrawPoolVisible();
            },
            () => {
                setTransactionStatus('failed');
                setWithdrawLoading(false);
                hideVisible();
                hideWithdrawPoolVisible();
            },
            () => {
                setTransactionStatus('');
                setWithdrawLoading(false);
                hideVisible();
                hideWithdrawPoolVisible();
            }
        )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                setTransactionStatus('');
                setWithdrawLoading(false);
                hideVisible();
                hideWithdrawPoolVisible();
            });
    };

    // 3月池领取利息
    const onTransferClaimReward = async (type: number) => {
        setClaimRewardLoading(true);
        await ContractclaimReward(
            ethereum,
            account,
            type,
            (transactionHash: any) => {
                setHash(transactionHash);
                setTransactionStatus('pending');
            },
            () => {
                setTransactionStatus('succes');
                setClaimRewardLoading(false);
                poolType === 0
                    ? getAllData(ethereum, account)
                    : poolType === 1
                    ? getPoolData(ethereum, account, 1)
                    : getPoolData2(ethereum, account, 2);
            },
            () => {
                setTransactionStatus('failed');
                setClaimRewardLoading(false);
            },
            () => {
                setTransactionStatus('');
                setClaimRewardLoading(false);
            }
        )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                setTransactionStatus('');
                setClaimRewardLoading(false);
            });
    };

    return (
        <div className="stake">
            {!wallet ||
                (status !== 'connected' ? (
                    <div className="connect-wallet-banner">
                        <img src={banner as any} alt="OpenDefi" />
                    </div>
                ) : (
                    <div className="bannner">
                        <div className="banner-content">
                            <div className="banner-desc">
                                <h1>{t('Stake')}</h1>
                                <p>{t('StakeTokensRewards')}</p>
                                <p>{t('dayLockupPeriod')}</p>
                                {isReceiveAirdrop && (
                                    <div>
                                        <span>
                                            {t('AirdropRewards')}{' '}
                                            {earned || '--'} {INIT_SYMBOL}
                                        </span>
                                        <Button
                                            type="text"
                                            className="receive-airdrop"
                                            disabled={!isReceiveAirdrop}
                                            onClick={onTransferAirDropwithdraw}
                                        >
                                            {t('ReceiveAirdrop')}
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <img
                                className="banner-icon"
                                src={bannerIcon as any}
                                alt="OpenDefi"
                            />
                        </div>
                    </div>
                ))}
            {!wallet || status !== 'connected' ? (
                <div className="stake-connect-wallet ">
                    <div className="revenue">
                        <p>{t('StakeTokensRewards')}</p>
                        <div className="airdrop">
                            {t('YouAirdropQuota')}
                            <span>
                                <Button
                                    type="text"
                                    className="receive-airdrop"
                                    disabled
                                >
                                    {t('ReceiveAirdrop')}
                                </Button>
                            </span>
                        </div>
                        <Button className="connect-wallet-but" type="text">
                            {t('v1_Connect_Wallet')}
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <Row className="title">
                        <Col xl={8} lg={12} sm={24} xs={24}>
                            <div className="go-ranklist">
                                <div
                                    onClick={() =>
                                        history.push('stake/ranklist')
                                    }
                                >
                                    {t('GoRankList')}
                                </div>
                            </div>

                            <div className="stake-pool">
                                <div className="header">
                                    <div
                                        className={
                                            isEnable
                                                ? 'title'
                                                : 'title-not-isenable title'
                                        }
                                    >
                                        <div>
                                            <img
                                                src={`${Token_icon}.png`}
                                                onError={(e: any) => {
                                                    e.target.onerror = null;
                                                    e.target.src = Subtract;
                                                }}
                                                alt="OpenDefi"
                                            />
                                            <span>{INIT_SYMBOL}</span>
                                        </div>
                                        <p>
                                            {t('StakeEarn', {
                                                x: INIT_SYMBOL,
                                                x1: INIT_SYMBOL,
                                            })}
                                        </p>
                                    </div>
                                    {isEnable && (
                                        <div className="balance">
                                            {t('WalletBalance')}：{balance}{' '}
                                            {INIT_SYMBOL}
                                        </div>
                                    )}
                                </div>
                                <div className="content">
                                    <ul>
                                        <li>
                                            <span>{t('APR')}:</span>
                                            <span>{apy || '0'}%</span>
                                        </li>
                                        <li>
                                            <span>{t('MyBalance')}</span>
                                            <span>
                                                {Tools.fmtDec(
                                                    balanceOfUnderlying,
                                                    6
                                                ) || '--'}{' '}
                                                {INIT_SYMBOL}
                                            </span>
                                        </li>
                                        <li>
                                            <span>{t('UnlockedBalance')}:</span>
                                            <span>
                                                {lockedBalance
                                                    ? lockedBalance
                                                    : '--'}{' '}
                                                {INIT_SYMBOL}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="operation">
                                    {!isEnable ? (
                                        <div className="but-item">
                                            <Button
                                                type="text"
                                                loading={
                                                    approveLoading &&
                                                    poolType === 0
                                                }
                                                className="operation-but-enable"
                                                onClick={() => {
                                                    approve(0);
                                                }}
                                            >
                                                {t('Enable')}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="operation-withdraw">
                                            <div className="but-item">
                                                <Button
                                                    type="text"
                                                    disabled={false}
                                                    className="operation-but-active"
                                                    onClick={() => {
                                                        setPoolType(0);
                                                        setStakeWithdrawPoolType(
                                                            'stake'
                                                        );
                                                        stakeWithdrawPoolType &&
                                                            showVisible();
                                                    }}
                                                >
                                                    {t('Stake')}
                                                </Button>
                                            </div>

                                            <div className="but-item">
                                                <Button
                                                    type="text"
                                                    disabled={Tools.GE(
                                                        0,
                                                        withdrawAmount
                                                    )}
                                                    className={
                                                        Tools.GE(
                                                            0,
                                                            withdrawAmount
                                                        )
                                                            ? 'operation-but-disabled'
                                                            : 'operation-but-active'
                                                    }
                                                    onClick={() => {
                                                        setPoolType(0);
                                                        setStakeWithdrawPoolType(
                                                            'Withdraw'
                                                        );
                                                        stakeWithdrawPoolType &&
                                                            showVisible();
                                                    }}
                                                >
                                                    {t('Unlock')}
                                                </Button>
                                            </div>

                                            <div className="but-item">
                                                <Button
                                                    type="text"
                                                    loading={
                                                        withdrawLoading &&
                                                        poolType === 0
                                                    }
                                                    disabled={!isWithdraw}
                                                    className={
                                                        isWithdraw
                                                            ? 'operation-but-active'
                                                            : 'operation-but-disabled'
                                                    }
                                                    onClick={() => {
                                                        setPoolType(0);
                                                        showWithdrawPoolVisible();
                                                    }}
                                                >
                                                    {t('Withdraw')}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {withdrawTime &&
                                    Tools.GT(
                                        withdrawTime || Date.now(),
                                        Date.now()
                                    ) ? (
                                        <Countdown
                                            className="operation-but-countdown"
                                            format={'DD day HH:mm:ss'}
                                            value={withdrawTime}
                                            onFinish={() => {
                                                getAllData(ethereum, account);
                                            }}
                                        />
                                    ) : (
                                        <div className="operation-countdown-disabled"></div>
                                    )}
                                </div>
                                <div className="total-stake">
                                    <p>
                                        {t('TotalStake', {
                                            x: totalBalance || 0,
                                            x1: INIT_SYMBOL,
                                        })}
                                    </p>

                                    {/* 需查一下cdtc 价格 */}
                                    {/* <p>
                            {t('TotalStakeUSD', {
                                x: USDTtotalBalance || '--',
                            })}
                        </p> */}

                                    <p>
                                        <a
                                            href={`${blacsBrowserPoll}${StakingPoolAddress}`}
                                            className="link-browser pending"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {t('PoolAddress', {
                                                x:
                                                    Tools.substringTx(
                                                        StakingPoolAddress
                                                    ) || '',
                                            })}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col xl={8} lg={12} sm={24} xs={24}>
                            <div className="stake-pool months">
                                <div className="header">
                                    <div
                                        className={
                                            poolData.allowance
                                                ? 'title'
                                                : 'title-not-isenable title'
                                        }
                                    >
                                        <div>
                                            <img
                                                src={`${Token_icon}.png`}
                                                onError={(e: any) => {
                                                    e.target.onerror = null;
                                                    e.target.src = Subtract;
                                                }}
                                                alt="OpenDefi"
                                            />
                                            <span>{INIT_SYMBOL}</span>
                                        </div>
                                        <p> {t('StakeHigherAPR', { x: 3 })}</p>
                                    </div>

                                    {poolData.allowance && (
                                        <div className="balance">
                                            {t('WalletBalance')}：{balance}{' '}
                                            {INIT_SYMBOL}
                                        </div>
                                    )}
                                </div>
                                <div className="content">
                                    <ul>
                                        <li>
                                            <span>{t('APR')}:</span>
                                            <span>{poolData.apy || '0'}%</span>
                                        </li>
                                        <li>
                                            <span>{t('Reward')}</span>
                                            <span>
                                                {Tools.fmtDec(
                                                    poolData.rewardCurrent,
                                                    6
                                                ) || '--'}{' '}
                                                {INIT_SYMBOL}
                                            </span>
                                        </li>
                                        <li>
                                            <span>{t('My Staked')}</span>
                                            <span>
                                                {poolData.userStaked || '--'}{' '}
                                                {INIT_SYMBOL}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="operation">
                                    {!poolData.allowance ? (
                                        <div className="but-item">
                                            <Button
                                                type="text"
                                                loading={
                                                    approveLoading &&
                                                    poolType === 1
                                                }
                                                className="operation-but-enable"
                                                onClick={() => {
                                                    setPoolType(1);
                                                    approve(1);
                                                }}
                                            >
                                                {t('Enable')}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="operation-withdraw">
                                            <div className="but-item">
                                                <Button
                                                    type="text"
                                                    disabled={false}
                                                    className="operation-but-active"
                                                    onClick={() => {
                                                        setPoolType(1);
                                                        setStakeWithdrawPoolType(
                                                            'stake'
                                                        );
                                                        stakeWithdrawPoolType &&
                                                            showVisible();
                                                    }}
                                                >
                                                    {t('Stake')}
                                                </Button>
                                            </div>

                                            <div className="but-item">
                                                <Button
                                                    type="text"
                                                    loading={
                                                        claimRewardLoading &&
                                                        poolType === 1
                                                    }
                                                    disabled={Tools.LE(
                                                        poolData.rewardCurrent ||
                                                            0,
                                                        0
                                                    )}
                                                    className={
                                                        Tools.GE(
                                                            0,
                                                            poolData.rewardCurrent ||
                                                                0
                                                        )
                                                            ? 'operation-but-disabled'
                                                            : 'operation-but-active'
                                                    }
                                                    onClick={() => {
                                                        setPoolType(1);
                                                        onTransferClaimReward(
                                                            1
                                                        );
                                                    }}
                                                >
                                                    {t('Claim')}
                                                </Button>
                                            </div>

                                            <div className="but-item">
                                                <Button
                                                    type="text"
                                                    loading={
                                                        withdrawLoading &&
                                                        poolType === 1
                                                    }
                                                    disabled={
                                                        Tools.GE(
                                                            0,
                                                            poolData.userStaked ||
                                                                0
                                                        ) ||
                                                        Tools.GT(
                                                            poolData.unstakePeriodTime ||
                                                                Date.now(),
                                                            Date.now()
                                                        )
                                                    }
                                                    className={
                                                        Tools.GE(
                                                            0,
                                                            poolData.userStaked ||
                                                                0
                                                        ) ||
                                                        Tools.GT(
                                                            poolData.unstakePeriodTime ||
                                                                Date.now(),
                                                            Date.now()
                                                        )
                                                            ? 'operation-but-disabled'
                                                            : 'operation-but-active'
                                                    }
                                                    onClick={() => {
                                                        setPoolType(1);
                                                        showWithdrawPoolVisible();
                                                    }}
                                                >
                                                    {t('Withdraw')}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {poolData.unstakePeriodTime &&
                                    Tools.GT(
                                        poolData.unstakePeriodTime ||
                                            Date.now(),
                                        Date.now()
                                    ) ? (
                                        <Countdown
                                            className="operation-but-countdown"
                                            format={'DD day HH:mm:ss'}
                                            value={poolData.unstakePeriodTime}
                                            onFinish={() => {
                                                getPoolData(
                                                    ethereum,
                                                    account,
                                                    1
                                                );
                                            }}
                                        />
                                    ) : (
                                        <div className="operation-countdown-disabled"></div>
                                    )}
                                </div>
                                <div className="total-stake">
                                    <p>
                                        {t('TotalStake', {
                                            x: poolData.totalStaked || 0,
                                            x1: INIT_SYMBOL,
                                        })}
                                    </p>

                                    <p>
                                        <a
                                            href={`${blacsBrowserPoll}${HighYieldPoolAddress}`}
                                            className="link-browser pending"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {t('PoolAddress', {
                                                x:
                                                    Tools.substringTx(
                                                        HighYieldPoolAddress
                                                    ) || '',
                                            })}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </Col>

                        <Col xl={8} lg={12} sm={24} xs={24}>
                            <div className="stake-pool months">
                                <div className="header">
                                    <div
                                        className={
                                            poolData2.allowance
                                                ? 'title'
                                                : 'title-not-isenable title'
                                        }
                                    >
                                        <div>
                                            <img
                                                src={`${Token_icon}.png`}
                                                onError={(e: any) => {
                                                    e.target.onerror = null;
                                                    e.target.src = Subtract;
                                                }}
                                                alt="OpenDefi"
                                            />
                                            <span>{INIT_SYMBOL}</span>
                                        </div>
                                        <p> {t('StakeHigherAPR', { x: 6 })}</p>
                                    </div>

                                    {poolData2.allowance && (
                                        <div className="balance">
                                            {t('WalletBalance')}：{balance}{' '}
                                            {INIT_SYMBOL}
                                        </div>
                                    )}
                                </div>
                                <div className="content">
                                    <ul>
                                        <li>
                                            <span>{t('APR')}:</span>
                                            <span>{poolData2.apy || '0'}%</span>
                                        </li>
                                        <li>
                                            <span>{t('Reward')}</span>
                                            <span>
                                                {Tools.fmtDec(
                                                    poolData2.rewardCurrent,
                                                    6
                                                ) || '--'}{' '}
                                                {INIT_SYMBOL}
                                            </span>
                                        </li>
                                        <li>
                                            <span>{t('My Staked')}</span>
                                            <span>
                                                {poolData2.userStaked || '--'}{' '}
                                                {INIT_SYMBOL}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="operation">
                                    {!poolData2.allowance ? (
                                        <div className="but-item">
                                            <Button
                                                type="text"
                                                loading={
                                                    approveLoading &&
                                                    poolType === 2
                                                }
                                                className="operation-but-enable"
                                                onClick={() => {
                                                    setPoolType(2);
                                                    approve(2);
                                                }}
                                            >
                                                {t('Enable')}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="operation-withdraw">
                                            <div className="but-item">
                                                <Button
                                                    type="text"
                                                    disabled={false}
                                                    className="operation-but-active"
                                                    onClick={() => {
                                                        setPoolType(2);
                                                        setStakeWithdrawPoolType(
                                                            'stake'
                                                        );
                                                        stakeWithdrawPoolType &&
                                                            showVisible();
                                                    }}
                                                >
                                                    {t('Stake')}
                                                </Button>
                                            </div>

                                            <div className="but-item">
                                                <Button
                                                    type="text"
                                                    loading={
                                                        claimRewardLoading &&
                                                        poolType === 2
                                                    }
                                                    disabled={Tools.LE(
                                                        poolData2.rewardCurrent ||
                                                            0,
                                                        0
                                                    )}
                                                    className={
                                                        Tools.GE(
                                                            0,
                                                            poolData2.rewardCurrent ||
                                                                0
                                                        )
                                                            ? 'operation-but-disabled'
                                                            : 'operation-but-active'
                                                    }
                                                    onClick={() => {
                                                        setPoolType(2);
                                                        onTransferClaimReward(
                                                            2
                                                        );
                                                    }}
                                                >
                                                    {t('Claim')}
                                                </Button>
                                            </div>

                                            <div className="but-item">
                                                <Button
                                                    type="text"
                                                    loading={
                                                        withdrawLoading &&
                                                        poolType === 1
                                                    }
                                                    disabled={
                                                        Tools.GE(
                                                            0,
                                                            poolData2.userStaked ||
                                                                0
                                                        ) ||
                                                        Tools.GT(
                                                            poolData2.unstakePeriodTime ||
                                                                Date.now(),
                                                            Date.now()
                                                        )
                                                    }
                                                    className={
                                                        Tools.GT(
                                                            poolData2.unstakePeriodTime ||
                                                                Date.now(),
                                                            Date.now()
                                                        ) ||
                                                        Tools.LE(
                                                            poolData2.unstakePeriodTime ||
                                                                0,
                                                            Date.now()
                                                        )
                                                            ? 'operation-but-disabled'
                                                            : 'operation-but-active'
                                                    }
                                                    onClick={() => {
                                                        setPoolType(2);
                                                        showWithdrawPoolVisible();
                                                    }}
                                                >
                                                    {t('Withdraw')}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {poolData2.unstakePeriodTime &&
                                    Tools.GT(
                                        poolData2.unstakePeriodTime ||
                                            Date.now(),
                                        Date.now()
                                    ) ? (
                                        <Countdown
                                            className="operation-but-countdown"
                                            format={'DD day HH:mm:ss'}
                                            value={poolData2.unstakePeriodTime}
                                            onFinish={() => {
                                                getPoolData2(
                                                    ethereum,
                                                    account,
                                                    2
                                                );
                                            }}
                                        />
                                    ) : (
                                        <div className="operation-countdown-disabled"></div>
                                    )}
                                </div>
                                <div className="total-stake">
                                    <p>
                                        {t('TotalStake', {
                                            x: poolData2.totalStaked || 0,
                                            x1: INIT_SYMBOL,
                                        })}
                                    </p>

                                    <p>
                                        <a
                                            href={`${blacsBrowserPoll}${HighYieldPoolAddress2}`}
                                            className="link-browser pending"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {t('PoolAddress', {
                                                x:
                                                    Tools.substringTx(
                                                        HighYieldPoolAddress2
                                                    ) || '',
                                            })}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </>
            )}

            <Rewards
                visible={rewardsVisible}
                earned={earned}
                close={() => {
                    hideRewardsVisible();
                    getAllData(ethereum, account);
                }}
            />

            <WithdrawPool
                visible={withdrawPoolVisible}
                butLoading={withdrawLoading}
                amount={
                    poolType === 0
                        ? lockedBalance
                        : poolType === 1
                        ? poolData.userStaked
                        : poolData2.userStaked
                }
                close={hideWithdrawPoolVisible}
                withdraw={onTransferWithdraw}
            ></WithdrawPool>
            <StakeWithdrawPool
                visible={visible}
                type={stakeWithdrawPoolType}
                data={{
                    balance,
                    symbol: INIT_SYMBOL,
                    balanceOfUnderlying:
                        poolType === 0
                            ? balanceOfUnderlying
                            : poolType === 1
                            ? poolData.myStaked
                            : poolData2.myStaked,
                }}
                close={() => {
                    setButLoading(false);
                    hideVisible();
                }}
                butLoading={butLoading}
                stake={(amount: string) => {
                    onTransferstake(Tools.numDulDecimals(amount, 18));
                }}
                withdraw={(amount: string, isMax: boolean) => {
                    const IsMaxFlag = Tools.GE(
                        amount,
                        Number(balanceOfUnderlying)
                    );
                    console.log(amount);
                    onTransferRequestUnstake(
                        Tools.numDulDecimals(amount, 18),
                        isMax || IsMaxFlag
                    );
                }}
            />
            <TransactionModal hash={hash} state={transactionStatus} />
            <AuthorizatioModal
                hash={hash}
                state={authorizatioStatus}
            ></AuthorizatioModal>
        </div>
    );
};

export default Stake;
