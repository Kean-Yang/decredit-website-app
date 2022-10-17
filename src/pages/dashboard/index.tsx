import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip, Statistic, Progress } from 'antd';
import { useMedia } from 'react-use';
import SupplyMarketsList from './components/SupplyMarketsList';
import BorrowMarketsList from './components/BorrowMarketsList';
import MyAssetList from './components/MyAssetList';
import IsUnlockWallet from '../../components/UnlockWallet/IsUnlockWallet';
import TransactionModal from '../../components/TransactionModal';
import SupplyBorrowRepayModal from '../../components/SupplyBorrowRepayModal';
import AuthorizatioModal from '../../components/AuthorizatioModal';
import MyAssetConnectWallet from './components/MyAssetConnectWallet';
import CustomModal from '../../components/Modal/CustomModal';
import Collatera from '../../components/Collatera';
import applyAction from '../../assets/apply_icon_action.svg';
import miningIcon from '../../assets/mining.png';
import notice from '../../assets/notice.png';
import bannerIcon from '../../assets/banner_icon.png';
import MyAssetMobileIcon from '../../assets/mobile/MyAsset_mobile.svg';
import AllMarketsMobileIcon from '../../assets/mobile/AllMarkets_icon.svg';
import explain from '../../assets/com/explain.svg';
// import timepiece from '../../assets/timepiece.svg';
import { useHistory } from 'react-router-dom';
import * as Tools from '../../utils/Tools';
import './index.scss';
import { useWallet } from 'use-wallet';
import CompBalanceWith from '../../components/CompBalanceWith';
import AllMarketsMobileList from './components/mobile/AllMarketsList';
import MyAssetMobileList from './components/mobile/MyAssetList';
// import introduction from '../../assets/introduction.png';
// import box from '../../assets/box.png';
// import { ApiGetQueryScore } from '../../services';
import {
    GetAllMarkets,
    ContractApprove,
    ContractMint,
    ContractRedeem,
    ContractBorrow,
    ContractRepayBorrow,
    ContractEnterMarkets,
    ContractExitMarket,
    getCreditCollateralRatio,
} from '../../contract/Dashboard';
import {
    contractBalanceOfUnderlying,
    getCompBalanceWithAccrued,
    ContractClaimComp,
} from '../../contract/Stake';

// import {
//     Decredit_user_manual,
//     Decredit_testnet_giveaway,
// } from '../../constants';

const Dashboard = () => {
    const { t } = useTranslation();
    const below768 = useMedia('(max-width: 768px)');
    const history = useHistory();
    const wallet = useWallet();
    const { account, status, ethereum } = wallet;
    const [borrowBalance, setBorrowBalance] = useState(0); //  总借款
    // const [score, setScore] = useState(0); //  用户分数
    const [totalSupplyBalance, setTotalSupplyBalance] = useState(0); //  总存款
    const [totalBorrowLimitUsed, setTotalBorrowLimitUsed] = useState(0); //
    // const [currentTotleBorrowLimit, setCurrentTotleBorrowLimit] = useState(0); //
    const [totleBorrowBalance, setTotleBorrowBalance] = useState(0); //
    // const [totleBorrowLimit, setTotleBorrowLimit] = useState(0); //
    const [tabs, setTabs] = useState(0); //
    const [mobileTabs, setMobileTabs] = useState(0); //
    const [supplyBorrowLoading, setSupplyBorrowLoading] = useState(false); //  储蓄列表加载
    const [supplyBorrowLsit, setSupplyBorrowLsit] = useState([]); //  储蓄列表
    const [supplyButLoading, setSupplyButLoading] = useState(null); //  储蓄列表
    const [supplyLsit, setSupplyLsit] = useState([]); //  储蓄列表加载
    const [mySupplyButLoading, setMySupplyButLoading] = useState(null); //  储蓄列表
    const [borrowList, setBorrowList] = useState([]); //  储蓄列表加载
    const [borrowButLoading, setBorrowButLoading] = useState(null); //  储蓄列表
    const [repayButLoading, setRepayButLoading] = useState(null); //  储蓄列表
    const [transactionStatus, setTransactionStatus] = useState(null); // failed:交易失败 pending:交易进行中 succes:交易成功 null取消弹窗
    const [hash, setHash] = useState('');
    const [authorizatioStatus, setAuthorizatioStatus] = useState(null); //approve:开始授权 failed:交易失败 pending:交易进行中 succes:交易成功 null取消弹窗
    const [approveItem, steApproveItem] = useState(null);
    const [authorizatiButLoad, setAuthorizatiButLoad] = useState(false);
    const [loading, setLoading] = useState(false); //交易弹窗操作按钮
    const [visible, setVisible] = useState(false); // 交易弹窗
    const [modalType, setModalType] = useState(2);
    const [collateralLoading, setCollateralLoading] = useState(null); //  储蓄列表
    const [collateraVisible, setCollateraVisible] = useState(false); //
    const [notCollateraVisible, setNotCollateraVisible] = useState(false); //
    const [collateraState, setCollateraState] = useState(true); //
    const [collateralData, setCollateralData] = useState({});
    const [collateralButLoading, setCollateralButLoading] = useState(false); //  储蓄列表
    const [totleMaxBorrowBalance, setTotleMaxBorrowBalance] = useState(0); //  总借款额度
    const [maxBorrowBalance, setMaxBorrowBalance] = useState(0); //  最大可借金额
    const [maxWithdrawBalance, setMaxWithdrawBalance] = useState(0); //  最大可赎回金额
    const [collateralRatio, setCollateralRatio] = useState(0);
    const [isStakeUnderlying, setIsStakeUnderlying] = useState(false); //用户是否质押了 cdtc
    const [digVisible, setDigVisible] = useState(false);
    const [digloading, setDigLoading] = useState(false);
    const [balance, setBalance] = useState({});
    const showDig = useCallback(() => {
        setDigVisible(true);
    }, []);
    const hideDig = useCallback(() => {
        setDigVisible(false);
    }, []);

    // useEffect(() => {
    //     if (account)
    //         ApiGetQueryScore('0xcf2E015941120d08A0cCe6B95F8f1BED6EDC60C3')
    //             .then((res) => {
    //                 console.log(res);
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    // }, [account]);

    // 所有用户储蓄列表
    const getPoolList = async (
        ethereum: any,
        account: any,
        firstLoading: boolean
    ) => {
        firstLoading && setSupplyBorrowLoading(true);
        const marketsList: any = await GetAllMarkets(ethereum, account);
        setSupplyBorrowLsit((marketsList && marketsList) || []);

        const mySupplyList = marketsList
            .filter((item: any) => {
                return Tools.GT(item.supplyBalance, 0);
            })
            .map((item: any) => {
                return item;
            });

        setSupplyLsit((mySupplyList && mySupplyList) || []);
        const myBorrowList = marketsList
            .filter((item: any) => {
                return Tools.GT(item.borrowBalanceDecimal, 0);
            })
            .map((item: any) => {
                return item;
            });
        setBorrowList((myBorrowList && myBorrowList) || []);

        const totleSupply = mySupplyList.reduce((sum: any, number: any) => {
            return sum + Number(number.supplyBalanceUSDTprice);
        }, 0);

        setTotalSupplyBalance(Tools.fmtDec(totleSupply, 2) || 0);

        let totleBorrow = myBorrowList.reduce((sum: any, number: any) => {
            return (sum += Number(number.borrowBalanceUSDTprice));
        }, 0);

        setBorrowBalance(totleBorrow || 0);

        let totleMaxBorrowBalanceNumber =
            marketsList &&
            marketsList.reduce((sum: any, number: any) => {
                return sum + Number(number.maxBorrowBalanceUSDTprice);
            }, 0);

        const creditCollateralRatio =
            (await getCreditCollateralRatio(ethereum, account)) || 0;
        setCollateralRatio(creditCollateralRatio || 0);

        const MaxBorrow = creditCollateralRatio
            ? Tools.plus(
                  totleMaxBorrowBalanceNumber,
                  Tools.mul(totleMaxBorrowBalanceNumber, creditCollateralRatio)
              ) || 0
            : totleMaxBorrowBalanceNumber || 0;

        setTotleMaxBorrowBalance(Tools.mul(MaxBorrow, 0.99) || 0);

        const borrowLimitUsed = Tools.fmtDec(
            Tools.mul(
                Tools.GT(totleBorrow, 0) && Tools.GT(MaxBorrow, 0)
                    ? Tools.div(
                          Number(totleBorrow),
                          Number(Tools.mul(MaxBorrow, 0.99))
                      )
                    : 0,
                100
            ),
            6
        );

        setTotalBorrowLimitUsed(
            Tools.GE(borrowLimitUsed || 0, 100) ? 100 : borrowLimitUsed || 0
        );

        // ContractTotalSupply(ethereum)
        //     .then((res) => {
        //         console.log(res);
        //         const blocksPerDay = (60 / blocks) * 60 * 24; //每天释放量
        //         const apy = Tools.GT(Number(res), 0)
        //             ? Tools.sub(
        //                   Math.pow(
        //                       Number(
        //                           Tools.plus(
        //                               1,
        //                               Tools.div(blocksPerDay, Number(res))
        //                           )
        //                       ),
        //                       364
        //                   ),
        //                   1
        //               )
        //             : 0;
        //         console.log('apy', apy);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });

        firstLoading && setSupplyBorrowLoading(false);
    };

    const isStake = async () => {
        const BalanceOf = await contractBalanceOfUnderlying(ethereum, account);
        // console.log(BalanceOf, ';BalanceOfBalanceOf');
        setIsStakeUnderlying(Tools.GT(BalanceOf, 0) || false);
    };

    useEffect(() => {
        // other code
        // 第一次执行
        if (account) getPoolList(ethereum, account, true);
        if (account) isStake();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethereum, account]);

    useEffect(() => {
        // other code
        let timer: any = undefined;
        if (
            !account ||
            visible ||
            collateraVisible ||
            authorizatioStatus !== null ||
            transactionStatus !== null
        ) {
            clearInterval(timer);
            return;
        }
        if (
            !timer &&
            account &&
            !visible &&
            !collateraVisible &&
            authorizatioStatus === null &&
            transactionStatus === null
        ) {
            timer = setInterval(() => {
                getPoolList(ethereum, account, false);
            }, 20 * 1000);
        }
        return () => {
            clearInterval(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        ethereum,
        account,
        visible,
        collateraVisible,
        transactionStatus,
        authorizatioStatus,
    ]);

    const [tabType, setTabType] = useState(1);
    const [itemData, setItemData] = useState({});

    //交易弹窗
    const showVisible = useCallback(() => {
        setVisible(true);
    }, []);
    const hideVisible = useCallback(() => {
        setVisible(false);
    }, []);

    const showNotCollatera = useCallback(() => {
        setNotCollateraVisible(true);
    }, []);
    const hideNotCollatera = useCallback(() => {
        setNotCollateraVisible(false);
    }, []);

    const showCollateraVisible = useCallback((flag: boolean, item: any) => {
        setCollateralButLoading(false);
        setCollateraState(flag);
        setCollateralData(item);
        setCollateralLoading(item.index);
        setCollateraVisible(true);
    }, []);
    const hideCollateraVisible = useCallback(() => {
        setCollateralLoading(null);
        setCollateralButLoading(false);
        setCollateraVisible(false);
    }, []);

    const getMaxWithdrawBalance = async (item: any) => {
        const withdrawList = supplyLsit
            .filter((i: any) => {
                return i.symbol !== item.symbol;
            })
            .map((i: any) => {
                return i;
            });

        let maxWithdraw =
            withdrawList &&
            withdrawList.reduce((sum: any, number: any) => {
                return sum + Number(number.usersSupplyUsdt);
            }, 0);

        const currentmaxWithdraw =
            Tools.GT(maxWithdraw, borrowBalance) || Tools.LE(borrowBalance, 0)
                ? item.underlyingBalance
                : Tools.sub(
                      item.underlyingBalance,
                      Tools.div(
                          Tools.div(
                              Tools.sub(
                                  Tools.div(borrowBalance, 0.85),
                                  maxWithdraw
                              ),
                              item.collateralFactorMantissa
                          ),
                          item.price
                      )
                  );

        // borrowBalance/ v/collateralFactorMantissa

        // const maxWithdrawn = Tools.GT(maxWithdraw, borrowBalance)
        //     ? item.underlyingBalance
        //     : Tools.fmtDec(
        //           Tools.div(
        //               Tools.div(
        //                   Tools.sub(
        //                       totleMaxBorrowBalance,
        //                       Tools.div(borrowBalance, 0.85)
        //                   ),
        //                   item.collateralFactorMantissa
        //               ),
        //               item.price
        //           ),
        //           6
        //       );

        return Tools.GE(currentmaxWithdraw, item.liquidity)
            ? Tools.fmtDec(item.liquidity, 6)
            : Tools.fmtDec(
                  Tools.LE(currentmaxWithdraw, 0) ? 0 : currentmaxWithdraw,
                  6
              );
    };

    const getMaxBorrowBalance = async (item: any) => {
        // 总可借当前币种
        let currentMaxBorrowBalance = Tools.div(
            totleMaxBorrowBalance,
            item.price
        );
        // 已借当前币种
        let currentborrowBalance = Tools.div(borrowBalance, item.price);

        return {
            currentMaxBorrowBalance,
            currentborrowBalance,
            currentTotleBorrowLimit: Tools.GE(
                currentMaxBorrowBalance,
                item.liquidity
            )
                ? item.liquidity
                : currentMaxBorrowBalance,
        };
    };
    const approve = async (item: any) => {
        tabs === 2 || mobileTabs === 1
            ? setMySupplyButLoading(item.index)
            : setSupplyButLoading(item.index);
        setAuthorizatiButLoad(true);
        await ContractApprove(
            ethereum,
            account,
            item.underlyingAddress,
            item.address,
            (transactionHash: any) => {
                setHash(transactionHash);
                setAuthorizatioStatus('pending');
            },
            async () => {
                setAuthorizatioStatus('succes');
                getPoolList(ethereum, account, true);
                tabs === 2 || mobileTabs === 1
                    ? setMySupplyButLoading(null)
                    : setSupplyButLoading(null);
                setAuthorizatiButLoad(false);
            },
            () => {
                setAuthorizatioStatus('failed');
                tabs === 2 || mobileTabs === 1
                    ? setMySupplyButLoading(null)
                    : setSupplyButLoading(null);
                setAuthorizatiButLoad(false);
            },
            () => {
                setAuthorizatioStatus('');
                tabs === 2 || mobileTabs === 1
                    ? setMySupplyButLoading(null)
                    : setSupplyButLoading(null);
                setAuthorizatiButLoad(false);
            }
        )
            .then((res) => {})
            .catch((err) => {
                setAuthorizatioStatus('');
                tabs === 2 || mobileTabs === 1
                    ? setMySupplyButLoading(null)
                    : setSupplyButLoading(null);
                setAuthorizatiButLoad(false);
            });
    };

    const onTransferSupplyshow = async (item: any) => {
        (!below768 && tabs === 2) || mobileTabs === 1
            ? setMySupplyButLoading(item.index)
            : setSupplyButLoading(item.index);

        setItemData(item);
        setModalType(2);
        setTabType(1);

        setMaxWithdrawBalance(await getMaxWithdrawBalance(item));

        await getMaxBorrowBalance(item).then((res) => {
            setMaxBorrowBalance(res.currentMaxBorrowBalance || 0);
            setTotleBorrowBalance(res.currentborrowBalance || 0);
            // setCurrentTotleBorrowLimit(res.currentTotleBorrowLimit || 0);
            showVisible();
        });
    };

    // Supply
    const onTransferSupply = async (amount: string) => {
        setLoading(true);
        await ContractMint(
            ethereum,
            account,
            amount,
            itemData.isNativeToken,
            itemData.address,
            (transactionHash: any) => {
                setHash(transactionHash);
                setTransactionStatus('pending');
            },
            async () => {
                setTransactionStatus('succes');
                getPoolList(ethereum, account, true);
                tabs === 2 || mobileTabs === 1
                    ? setMySupplyButLoading(null)
                    : setSupplyButLoading(null);
                setLoading(false);
                hideVisible();
            },
            () => {
                setTransactionStatus('failed');
                tabs === 2 || mobileTabs === 1
                    ? setMySupplyButLoading(null)
                    : setSupplyButLoading(null);
                setLoading(false);
                hideVisible();
            },
            () => {
                setTransactionStatus('');
                tabs === 2 || mobileTabs === 1
                    ? setMySupplyButLoading(null)
                    : setSupplyButLoading(null);
                setLoading(false);
                hideVisible();
            }
        )
            .then((res) => {})
            .catch((err) => {
                setTransactionStatus('succes');
                tabs === 2 || mobileTabs === 1
                    ? setMySupplyButLoading(null)
                    : setSupplyButLoading(null);
                setLoading(false);
                hideVisible();
            });
    };
    //
    const enterMarkets = async () => {
        setLoading(true);
        setCollateralButLoading(true);
        await ContractEnterMarkets(
            ethereum,
            account,
            collateralData.address,
            (transactionHash: any) => {
                setHash(transactionHash);
                setTransactionStatus('pending');
            },
            () => {
                setTransactionStatus('succes');
                getPoolList(ethereum, account, true);
                setLoading(false);
                setCollateralLoading(null);
                setCollateralButLoading(false);
                hideCollateraVisible();
                hideVisible();
            },
            () => {
                setTransactionStatus('failed');
                setLoading(false);
                setCollateralLoading(null);
                setCollateralButLoading(false);
                hideCollateraVisible();
                hideVisible();
            },
            () => {
                setTransactionStatus('');
                setLoading(false);
                setCollateralLoading(null);
                setCollateralButLoading(false);
                hideCollateraVisible();
                hideVisible();
            }
        )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                setTransactionStatus('');
                setLoading(false);
                setCollateralLoading(null);
                setCollateralButLoading(false);
                hideCollateraVisible();
                hideVisible();
            });
    };

    const exitMarket = async () => {
        setLoading(true);
        setCollateralButLoading(true);
        await ContractExitMarket(
            ethereum,
            account,
            collateralData.address,
            (transactionHash: any) => {
                setHash(transactionHash);
                setTransactionStatus('pending');
            },
            () => {
                setTransactionStatus('succes');
                getPoolList(ethereum, account, true);
                setLoading(false);
                setCollateralLoading(null);
                setCollateralButLoading(false);
                hideCollateraVisible();
                hideVisible();
            },
            () => {
                setTransactionStatus('failed');
                setLoading(false);
                setCollateralLoading(null);
                setCollateralButLoading(false);
                hideCollateraVisible();
                hideVisible();
            },
            () => {
                setTransactionStatus('');
                setLoading(false);
                setCollateralLoading(null);
                setCollateralButLoading(false);
                hideCollateraVisible();
                hideVisible();
            }
        )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                setTransactionStatus('');
                setLoading(false);
                setCollateralLoading(null);
                setCollateralButLoading(false);
                hideCollateraVisible();
                hideVisible();
            });
    };

    const onTransferWithdrawShow = async (item: any) => {
        tabs === 2 || mobileTabs === 1
            ? setMySupplyButLoading(item.index)
            : setSupplyButLoading(item.index);
        setItemData(item);
        setModalType(2);
        setTabType(2);

        setMaxWithdrawBalance(await getMaxWithdrawBalance(item));

        await getMaxBorrowBalance(item).then((res) => {
            setMaxBorrowBalance(res.currentMaxBorrowBalance || 0);
            setTotleBorrowBalance(res.currentborrowBalance || 0);
            // setCurrentTotleBorrowLimit(res.currentTotleBorrowLimit || 0);
            showVisible();
        });
    };

    // // Withdraw
    const onTransferWithdraw = async (amount: string, isMax: boolean) => {
        setLoading(true);
        await ContractRedeem(
            ethereum,
            account,
            amount,
            itemData.isNativeToken,
            isMax,
            itemData.address,
            Tools.GT(borrowBalance, 0),
            (transactionHash: any) => {
                setHash(transactionHash);
                setTransactionStatus('pending');
            },
            () => {
                setTransactionStatus('succes');
                getPoolList(ethereum, account, true);
                setLoading(false);
                tabs === 2 || mobileTabs === 1
                    ? setMySupplyButLoading(null)
                    : setSupplyButLoading(null);
                hideVisible();
            },
            () => {
                setTransactionStatus('failed');
                setLoading(false);
                tabs === 2 || mobileTabs === 1
                    ? setMySupplyButLoading(null)
                    : setSupplyButLoading(null);
                hideVisible();
            },
            () => {
                setTransactionStatus('');
                setLoading(false);
                tabs === 2 || mobileTabs === 1
                    ? setMySupplyButLoading(null)
                    : setSupplyButLoading(null);
                hideVisible();
            }
        )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                setTransactionStatus('');
                setLoading(false);
                tabs === 2 || mobileTabs === 1
                    ? setMySupplyButLoading(null)
                    : setSupplyButLoading(null);
                hideVisible();
            });
    };

    const onTransferBorrowshow = async (item: any) => {
        itemData && modalType && tabType && setBorrowButLoading(item.index);
        setItemData(item);
        setModalType(1);
        setTabType(1);

        await getMaxBorrowBalance(item).then((res) => {
            console.log(res.currentborrowBalance);

            setMaxBorrowBalance(res.currentMaxBorrowBalance || 0);
            setTotleBorrowBalance(res.currentborrowBalance || 0);
            // setCurrentTotleBorrowLimit(res.currentTotleBorrowLimit || 0);
            showVisible();
        });
    };

    // // Borrow
    const onTransferBorrow = async (amount: string) => {
        setLoading(true);
        await ContractBorrow(
            ethereum,
            account,
            amount,
            itemData.isNativeToken,
            itemData.address,
            (transactionHash: any) => {
                setHash(transactionHash);
                setTransactionStatus('pending');
            },
            () => {
                setTransactionStatus('succes');
                setBorrowButLoading(null);
                getPoolList(ethereum, account, true);
                setLoading(false);
                hideVisible();
            },
            () => {
                setTransactionStatus('failed');
                setBorrowButLoading(null);
                setLoading(false);
                hideVisible();
            },
            () => {
                setTransactionStatus('');
                setBorrowButLoading(null);
                setLoading(false);
                hideVisible();
            }
        )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                setTransactionStatus('');
                setBorrowButLoading(null);
                setLoading(false);
                hideVisible();
            });
    };

    const onTransferRepayShow = async (item: any) => {
        itemData && modalType && tabType && setRepayButLoading(item.index);
        setItemData(item);
        setModalType(1);
        setTabType(2);
        await getMaxBorrowBalance(item).then((res) => {
            setMaxBorrowBalance(res.currentMaxBorrowBalance || 0);
            setTotleBorrowBalance(res.currentborrowBalance || 0);
            // setCurrentTotleBorrowLimit(res.currentTotleBorrowLimit || 0);
            showVisible();
        });
    };
    // Repay
    const onTransferRepay = async (
        amount: any,
        isMax: boolean,
        maxborrowAmount: boolean,
        userBalance: any
    ) => {
        setLoading(true);
        await ContractRepayBorrow(
            ethereum,
            account,
            amount,
            maxborrowAmount,
            userBalance,
            isMax,
            itemData.isNativeToken,
            itemData.address,
            (transactionHash: any) => {
                setHash(transactionHash);
                setTransactionStatus('pending');
            },
            () => {
                setTransactionStatus('succes');
                getPoolList(ethereum, account, true);
                setRepayButLoading(null);
                setLoading(false);
                hideVisible();
            },
            () => {
                setTransactionStatus('failed');
                setRepayButLoading(null);
                setLoading(false);
                hideVisible();
            },
            () => {
                setTransactionStatus('');
                setRepayButLoading(null);
                setLoading(false);
                hideVisible();
            }
        )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                setTransactionStatus('');
                setRepayButLoading(null);
                setLoading(false);
                hideVisible();
            });
    };

    const getCompBalance = async (account: any) => {
        const Compbalance = await getCompBalanceWithAccrued(ethereum, account);
        setBalance(Compbalance || {});
    };

    const ContractClaimCompFun = async (account: any) => {
        setDigLoading(true);
        await ContractClaimComp(
            ethereum,
            account,
            (transactionHash: any) => {
                setHash(transactionHash || '');
                setTransactionStatus('pending');
            },
            async () => {
                setDigLoading(false);
                setTransactionStatus('succes');
                hideDig();
                getCompBalance(account);
            },
            () => {
                hideDig();
                setDigLoading(false);
                setTransactionStatus('failed');
            },
            () => {
                hideDig();
                setDigLoading(false);
                setTransactionStatus('');
            }
        )
            .then((res: any) => {})
            .catch((err: any) => {
                setDigLoading(false);
                hideDig();
                setTransactionStatus('');
            });
    };

    useEffect(() => {
        // other code
        if (account) getCompBalance(account);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    const jumpCertification = () => {
        history.push('/certification');
    };

    const switchTabs = (index: number) => {
        // if (supplyBorrowLsit.length)
        setTabs(index);
    };

    return (
        <div className="dashboard">
            <div className="banner">
                <div className="bannner-content">
                    <div className="banner-data">
                        {/* <div className="banner-data-title">
                            {t('TotalMarket')}
                        </div> */}
                        <div className="apy">
                            <div className="balance">
                                <p className="title">{t('Supply_Value')}</p>
                                <p className="data">
                                    ${totalSupplyBalance || 0}
                                </p>
                            </div>

                            <div className="balance">
                                <p className="title">{t('Borrow_Value')}</p>
                                <p className="data">
                                    ${Tools.fmtDec(borrowBalance, 2) || 0}
                                </p>
                            </div>
                        </div>

                        <div className="progress">
                            <span className="borrow-limit-used">
                                {t('BorrowLimitUsed_x', {
                                    x: `${
                                        Tools.fmtDec(totalBorrowLimitUsed, 2) ||
                                        '0'
                                    }%`,
                                })}
                            </span>
                            <Progress
                                strokeColor={'#FFFFFF'}
                                trailColor="rgba(16, 3, 31, 0.05)"
                                percent={totalBorrowLimitUsed || 0}
                                showInfo={false}
                            />

                            <span className="borrow-balance">
                                <Statistic
                                    prefix={'$'}
                                    value={
                                        Tools.fmtDec(
                                            totleMaxBorrowBalance,
                                            2
                                        ) || '--'
                                    }
                                />
                            </span>
                        </div>
                        <div className="credit">
                            {t('personalCreditData')}

                            <IsUnlockWallet ButClassNmae="credit-bun">
                                {isStakeUnderlying ? (
                                    <span
                                        className="credit-bun"
                                        onClick={jumpCertification}
                                    >
                                        {t('Credit')}
                                    </span>
                                ) : (
                                    <Tooltip
                                        placement="left"
                                        title={t('enbaleCreditLoan')}
                                    >
                                        <span className="credit-disabled">
                                            {t('Credit')}
                                        </span>
                                    </Tooltip>
                                )}
                            </IsUnlockWallet>

                            <Tooltip
                                placement="left"
                                title={t('ClickCreditBorrow')}
                            >
                                <img src={explain as any} alt="OpenDefi" />
                            </Tooltip>
                        </div>
                    </div>
                    <img
                        className="banner-icon"
                        src={bannerIcon as any}
                        alt="OpenDefi"
                    />

                    {/* {!below768 ? (
                        <div className="manual-giveaways">
                            <div className="manual">
                                <img src={introduction as any} alt="" />
                                <a
                                    href={Decredit_user_manual as any}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Click to see user manual.</span>
                                </a>
                            </div>
                            <div className="manual">
                                <img src={box as any} alt="" />
                                <a
                                    href={Decredit_testnet_giveaway as any}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>
                                        Giveaways: $3,000USDT for Joining
                                        Testnet.
                                    </span>
                                </a>
                            </div>
                        </div>
                    ) : (
                        ''
                    )} */}

                    {Tools.GT(Number(balance.allocated), 0) && (
                        <div className="notice" onClick={() => showDig()}>
                            <img src={notice as any} alt="" />
                            <span className="amount">{t('earnNotice')}</span>

                            <div className="balance">
                                <img src={miningIcon as any} alt="OpenDefi" />
                                <span>
                                    {Number(balance.allocated).toFixed(4) ||
                                        '0.0000'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {!below768 ? (
                <div className="table">
                    <div className="markets-list">
                        <ul className="markets-list-tabs">
                            <li
                                className={
                                    tabs === 0
                                        ? 'supply-markets-active tabs-active'
                                        : 'supply-markets'
                                }
                            >
                                <img src={applyAction as any} alt="OpenDefi" />
                                <span className={tabs === 0 ? 'active ' : ''}>
                                    {t('supplyMarket')}
                                </span>
                            </li>
                            <li
                                className={
                                    tabs === 1
                                        ? 'borrow-markets-active tabs-active'
                                        : 'borrow-markets'
                                }
                            >
                                <img src={applyAction as any} alt="OpenDefi" />
                                <span className={tabs === 1 ? 'active ' : ''}>
                                    {t('borrowMarket')}
                                </span>
                            </li>
                            <li
                                className={
                                    tabs === 2
                                        ? 'my-asset-active tabs-active'
                                        : 'my-asset'
                                }
                            >
                                <img src={applyAction as any} alt="OpenDefi" />
                                <span className={tabs === 2 ? 'active' : ''}>
                                    {t('MyAsset')}
                                </span>
                            </li>
                        </ul>
                        <ul className="markets-clickable-area">
                            <li
                                onClick={() => {
                                    supplyBorrowLsit && switchTabs(0);
                                }}
                            ></li>
                            <li
                                onClick={() => {
                                    supplyBorrowLsit && switchTabs(1);
                                }}
                            ></li>
                            <li
                                onClick={() => {
                                    borrowList && supplyLsit && switchTabs(2);
                                }}
                            ></li>
                        </ul>
                    </div>

                    <div className="markets-list-table">
                        {tabs === 0 && supplyBorrowLsit ? (
                            <SupplyMarketsList
                                supplyBorrowLsit={supplyBorrowLsit}
                                supplyBorrowLoading={supplyBorrowLoading}
                                supplyButLoading={supplyButLoading}
                                supplyShow={onTransferSupplyshow}
                                enterMarkets={(item: any) => {
                                    showCollateraVisible(true, item);
                                }}
                                exitMarket={(item: any) => {
                                    showCollateraVisible(false, item);
                                }}
                                collateralLoading={collateralLoading}
                                notCollatera={showNotCollatera}
                                approve={(item: any) => {
                                    steApproveItem(item);
                                    setAuthorizatioStatus('approve');
                                }}
                            />
                        ) : tabs === 1 && supplyBorrowLsit ? (
                            <BorrowMarketsList
                                supplyBorrowLsit={supplyBorrowLsit}
                                supplyBorrowLoading={supplyBorrowLoading}
                                borrowButLoading={borrowButLoading}
                                borrowShow={onTransferBorrowshow}
                                approve={(item: any) => {
                                    steApproveItem(item);
                                    setAuthorizatioStatus('approve');
                                }}
                            />
                        ) : tabs === 2 && supplyLsit && borrowList ? (
                            <>
                                {!wallet || status !== 'connected' ? (
                                    <MyAssetConnectWallet />
                                ) : (
                                    <MyAssetList
                                        supplyLoading={supplyBorrowLoading}
                                        supplyLsit={supplyLsit}
                                        myTotleSupply={totalSupplyBalance}
                                        borrowLoading={supplyBorrowLoading}
                                        borrowList={borrowList}
                                        myTotleBorrow={borrowBalance}
                                        totleBorrowLimit={totleMaxBorrowBalance}
                                        withdrawShow={onTransferWithdrawShow}
                                        repayShow={onTransferRepayShow}
                                        mySupplyButLoading={mySupplyButLoading}
                                        repayButLoading={repayButLoading}
                                        enterMarkets={(item: any) => {
                                            showCollateraVisible(true, item);
                                        }}
                                        exitMarket={(item: any) => {
                                            showCollateraVisible(false, item);
                                        }}
                                        collateralLoading={collateralLoading}
                                        notCollatera={showNotCollatera}
                                        approve={(item: any) => {
                                            steApproveItem(item);
                                            setAuthorizatioStatus('approve');
                                        }}
                                    />
                                )}
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            ) : (
                <div className="table">
                    <div className="all-markets-icon">
                        <img src={MyAssetMobileIcon as any} alt="" />
                        <span>{t('AllMarkets')}</span>
                    </div>
                    <div className="all-markets-mobile">
                        <AllMarketsMobileList
                            tabs={tabs}
                            switchTabs={(index: any) => {
                                setTabs(index);
                            }}
                            supplyShow={onTransferSupplyshow}
                            borrowShow={onTransferBorrowshow}
                            borrowButLoading={borrowButLoading}
                            supplyLoading={supplyBorrowLoading}
                            supplyBorrowLsit={supplyBorrowLsit}
                            borrowLoading={supplyBorrowLoading}
                            supplyButLoading={supplyButLoading}
                            enterMarkets={(item: any) => {
                                showCollateraVisible(true, item);
                            }}
                            exitMarket={(item: any) => {
                                showCollateraVisible(false, item);
                            }}
                            collateralLoading={collateralLoading}
                            notCollatera={showNotCollatera}
                            approve={(item: any) => {
                                steApproveItem(item);
                                setAuthorizatioStatus('approve');
                            }}
                        />
                    </div>

                    <div className="all-markets-icon">
                        <img src={AllMarketsMobileIcon as any} alt="" />
                        <span>{t('MyAsset')}</span>
                    </div>
                    <div className="my-asset-mobile">
                        <MyAssetMobileList
                            tabs={mobileTabs}
                            switchTabs={(index: any) => {
                                setMobileTabs(index);
                            }}
                            supplyLoading={supplyBorrowLoading}
                            supplyLsit={supplyLsit}
                            myTotleSupply={totalSupplyBalance}
                            borrowLoading={supplyBorrowLoading}
                            borrowList={borrowList}
                            myTotleBorrow={borrowBalance}
                            totleBorrowLimit={totleMaxBorrowBalance}
                            withdrawShow={onTransferWithdrawShow}
                            repayShow={onTransferRepayShow}
                            mySupplyButLoading={mySupplyButLoading}
                            repayButLoading={repayButLoading}
                            enterMarkets={(item: any) => {
                                showCollateraVisible(true, item);
                            }}
                            exitMarket={(item: any) => {
                                showCollateraVisible(false, item);
                            }}
                            collateralLoading={collateralLoading}
                            notCollatera={showNotCollatera}
                            approve={(item: any) => {
                                steApproveItem(item);
                                setAuthorizatioStatus('approve');
                            }}
                        />
                    </div>
                </div>
            )}
            {visible && (
                <SupplyBorrowRepayModal
                    loading={loading}
                    data={itemData}
                    isStakeUnderlying={isStakeUnderlying}
                    maxWithdraw={maxWithdrawBalance}
                    maxBorrowBalance={maxBorrowBalance}
                    tabType={tabType}
                    visible={visible}
                    collateralRatio={collateralRatio}
                    // currentMaxBorrowBalance={currentTotleBorrowLimit}
                    totleBorrowBalance={totleBorrowBalance}
                    borrowLimitUsed={totalBorrowLimitUsed || 0}
                    closeModal={() => {
                        tabs === 0 && supplyButLoading !== null
                            ? setSupplyButLoading(null)
                            : tabs === 1 && borrowButLoading !== null
                            ? setBorrowButLoading(null)
                            : (tabs === 2 || mobileTabs === 1) &&
                              mySupplyButLoading !== null
                            ? setMySupplyButLoading(null)
                            : setRepayButLoading(null);

                        setLoading(false);
                        hideVisible();
                    }}
                    tabs={tabs}
                    modalType={modalType}
                    onRepay={(
                        amount: string,
                        decimals: string,
                        isMax: boolean
                    ) => {
                        const userborrowBalance = Tools.GE(
                            borrowBalance,
                            itemData.isNativeToken
                                ? itemData.userBalance
                                : itemData.balanceDecimal
                        )
                            ? itemData.isNativeToken
                                ? itemData.userBalance
                                : itemData.balanceDecimal
                            : Tools.plus(
                                  borrowBalance,
                                  Tools.mul(borrowBalance, 0.003)
                              );

                        const maxAmount =
                            Tools.GE(amount, userborrowBalance) || isMax;

                        const userBalance = itemData.isNativeToken
                            ? itemData.userBalanceBNB
                            : itemData.balanceDecimal;

                        const maxborrowAmount = Tools.GE(
                            itemData.borrowBalanceDecimal,
                            userBalance
                        );

                        // Tools.numDulDecimals(
                        //     itemData.balance,
                        //     itemData.decimals
                        // )

                        onTransferRepay(
                            Tools.numDulDecimals(amount, decimals),
                            maxAmount,
                            maxborrowAmount,
                            Tools.GE(itemData.borrowBalanceDecimal, userBalance)
                                ? userBalance
                                : itemData.borrowBalanceDecimal
                        );
                    }}
                    onBorrow={(amount: string, decimals: string) => {
                        onTransferBorrow(
                            Tools.numDulDecimals(amount, decimals)
                        );
                    }}
                    onSupply={(amount: string, decimals: string) => {
                        onTransferSupply(
                            Tools.numDulDecimals(amount, decimals)
                        );
                    }}
                    onWithdraw={(
                        amount: string,
                        decimals: string,
                        isMax: boolean
                    ) => {
                        onTransferWithdraw(
                            Tools.numDulDecimals(amount, decimals),
                            isMax
                        );
                    }}
                />
            )}
            <CompBalanceWith
                visible={digVisible}
                data={balance}
                loading={digloading}
                withdraw={() => {
                    if (account) ContractClaimCompFun(account);
                }}
                close={() => {
                    hideDig();
                }}
            />
            <TransactionModal hash={hash} state={transactionStatus} />
            <AuthorizatioModal
                hash={hash}
                butLoading={authorizatiButLoad}
                approve={() => {
                    approve(approveItem);
                }}
                state={authorizatioStatus}
                close={() => {
                    setAuthorizatioStatus(null);
                }}
            ></AuthorizatioModal>

            <Collatera
                visible={collateraVisible}
                data={collateralData}
                borrowBalance={borrowBalance}
                totleMaxBorrowBalance={totleMaxBorrowBalance}
                totalBorrowLimitUsed={totalBorrowLimitUsed}
                state={collateraState}
                collateralButLoading={collateralButLoading}
                close={hideCollateraVisible}
                enterMarkets={enterMarkets}
                exitMarket={exitMarket}
            />
            <CustomModal
                visible={notCollateraVisible}
                title={t('infoSubmission')}
                contentText={t('DisableCollateralclearing')}
                close={hideNotCollatera}
                butText={t('ok')}
                butFun={hideNotCollatera}
            ></CustomModal>
        </div>
    );
};

export default Dashboard;
