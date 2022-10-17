import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Statistic, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useMedia } from 'react-use';
import { useWallet } from 'use-wallet';
import { Token_icon } from '../../constants';
import Subtract from '../../assets/com/subtract.png';
import * as Tools from '../../utils/Tools';
import MarketsMobileList from './components/mobile/MarketsMobileList';
import './index.scss';
import {
    ContractTotalSupply,
    ContractTotalBorrowsCurrent,
    GetAllMarkets,
} from '../../contract/Dashboard';

const Markets = () => {
    const { t } = useTranslation();
    const below768 = useMedia('(max-width: 768px)');
    const wallet = useWallet();
    const { account, ethereum } = wallet;
    const [allMarketsList, setAllMarketsList] = useState([]); //
    const [getAllMarketsLoading, setGetAllMarketsLoading] = useState(false); //
    const [totalSupplyBalance, setTotalSupplyBalance] = useState(0); //  总借款
    const [totalBorrowBalance, setTotalBorrowBalance] = useState(0); //  总存款
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const getPoolList = async (
        ethereum: any,
        account: any,
        firstLoading: boolean
    ) => {
        firstLoading && setGetAllMarketsLoading(true);
        const marketsList: any = await GetAllMarkets(ethereum, account);
        setAllMarketsList(marketsList);
        firstLoading && setGetAllMarketsLoading(false);
    };

    useEffect(() => {
        // other code
        if (account) getPoolList(ethereum, account, true);
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
                getPoolList(ethereum, account, false);
            }, 20 * 1000);
        }
        return () => {
            clearInterval(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethereum, account]);

    useEffect(() => {
        // other code
        setAllMarketsList([]);
        setGetAllMarketsLoading([]);
        // 总存款
        ContractTotalSupply(ethereum)
            .then((res) => {
                console.log(res);
                setTotalSupplyBalance(Tools.fmtDec(res, 6));
            })
            .catch((err) => {
                console.log(err);
            });

        //总借款
        ContractTotalBorrowsCurrent(ethereum)
            .then((res) => {
                console.log(res);
                setTotalBorrowBalance(Tools.fmtDec(res, 6));
            })
            .catch((err) => {
                console.log(err);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethereum, account]);

    return (
        <div className="markets">
            <div className="banner">
                <div className="bannner-content">
                    <ul>
                        <li className="title">
                            <span>{t('supplyBalance')}</span>
                            <span>{t('TotalBorrowd')}</span>
                        </li>
                        <li className="data">
                            <div>${totalSupplyBalance || 0}</div>
                            <div>${totalBorrowBalance || 0}</div>
                        </li>
                        <li className="title">
                            <span> Suppliers</span>
                            <span>Borrowers</span>
                        </li>
                        <li className="data">
                            <div>--</div>
                            <div>--</div>
                        </li>
                    </ul>
                </div>
            </div>

            {!below768 ? (
                <div className="all-markets">
                    <div className="all-markets-title">{t('AllMarkets')}</div>
                    <Row>
                        <Col lg={24} md={24} xs={24}>
                            <div className="data-item">
                                <table className="table-list">
                                    <thead className="thead">
                                        <tr>
                                            <th>
                                                <span>{t('asset')}</span>
                                            </th>
                                            <th>{t('supplyBalance')}</th>
                                            <th>{t('DepositAPY')}</th>
                                            <th>{t('TotalBorrow')}</th>
                                            <th>{t('BorrowAPY')}</th>
                                        </tr>
                                    </thead>

                                    <tbody className="tbody">
                                        {getAllMarketsLoading ? (
                                            <>
                                                <tr className="Skeleton">
                                                    <td colSpan={5}></td>
                                                </tr>
                                                <tr className="Skeleton">
                                                    <td colSpan={5}></td>
                                                </tr>
                                            </>
                                        ) : allMarketsList &&
                                          allMarketsList.length ? (
                                            <>
                                                {allMarketsList.map(
                                                    (
                                                        item: any,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <img
                                                                        src={`${Token_icon}${item.symbol}.png`}
                                                                        onError={(
                                                                            e: any
                                                                        ) => {
                                                                            e.target.onerror =
                                                                                null;
                                                                            e.target.src =
                                                                                Subtract;
                                                                        }}
                                                                        alt="OpenDefi"
                                                                    />
                                                                    <span>
                                                                        {item.symbol ||
                                                                            '--'}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <Statistic
                                                                        prefix={
                                                                            '$'
                                                                        }
                                                                        value={
                                                                            Tools.fmtDec(
                                                                                item.totalSupplyUSDTprice,
                                                                                12
                                                                            ) ||
                                                                            '--'
                                                                        }
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {item.supplyApy ? (
                                                                        <Statistic
                                                                            suffix="%"
                                                                            value={
                                                                                item.supplyApy
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        '--'
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {item.totalBorrowUSDTprice ? (
                                                                        <Statistic
                                                                            prefix={
                                                                                '$'
                                                                            }
                                                                            value={Tools.fmtDec(
                                                                                item.totalBorrowUSDTprice,
                                                                                12
                                                                            )}
                                                                        />
                                                                    ) : (
                                                                        '--'
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <Statistic
                                                                        suffix={
                                                                            '%'
                                                                        }
                                                                        value={
                                                                            item.borrowApy ||
                                                                            '--'
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </>
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="no-data"
                                                >
                                                    <div>{t('No_Data')}</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                </div>
            ) : (
                <>
                    {getAllMarketsLoading ? (
                        <div className="all-mobileMarkets-Spin">
                            <Spin indicator={antIcon} />
                        </div>
                    ) : allMarketsList && allMarketsList.length ? (
                        <>
                            <div className="all-mobileMarkets-title">
                                {t('AllMarkets')}
                            </div>
                            <MarketsMobileList
                                allMarketsLoading={getAllMarketsLoading}
                                allMarketsList={allMarketsList}
                            />
                        </>
                    ) : (
                        <div className="all-mobileMarkets-Spin">
                            <div className="no-Data">{t('No_Data')}</div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Markets;
