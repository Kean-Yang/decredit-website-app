import React from 'react';
import { useTranslation } from 'react-i18next';
import { Statistic } from 'antd';
import { Token_icon } from '../../../../constants';
import Subtract from '../../../../assets/com/subtract.png';
import * as Tools from '../../../../utils/Tools';
import './Tablist.scss';

interface DataProps {
    allMarketsLoading?: boolean;
    allMarketsList?: any;
}

const MarketsMobileList = ({
    allMarketsLoading = false,
    allMarketsList = [],
}: DataProps) => {
    const { t } = useTranslation();

    return (
        <div className="AllMarkets-tablist-mobile">
            {allMarketsLoading ? (
                <tr className="Skeleton">
                    <td colSpan={6}></td>
                </tr>
            ) : allMarketsList && allMarketsList.length ? (
                <>
                    {allMarketsList.map((item: any, index: number) => {
                        return (
                            <div className="data-item" key={index}>
                                <div className="data-item-title">
                                    <img
                                        src={`${Token_icon}${item.symbol}.png`}
                                        onError={(e: any) => {
                                            e.target.onerror = null;
                                            e.target.src = Subtract;
                                        }}
                                        alt="OpenDefi"
                                    />
                                    {item.symbol || '--'}
                                </div>
                                <ul>
                                    <li>
                                        <div>{t('supplyBalance')}</div>
                                        <div>{t('TotalBorrowd')}</div>
                                    </li>
                                    <li>
                                        <p>
                                            <Statistic
                                                prefix={'$'}
                                                value={
                                                    Tools.fmtDec(
                                                        item.totalSupplyUSDTprice,
                                                        12
                                                    ) || '--'
                                                }
                                            />
                                        </p>
                                        <p>
                                            {item.totalBorrowUSDTprice ? (
                                                <Statistic
                                                    prefix={'$'}
                                                    value={Tools.fmtDec(
                                                        item.totalBorrowUSDTprice,
                                                        12
                                                    )}
                                                />
                                            ) : (
                                                '--'
                                            )}
                                        </p>
                                    </li>
                                    <li>
                                        <div> {t('SupplyAPY')}</div>
                                        <div> {t('BorrowAPY')}</div>
                                    </li>
                                    <li>
                                        <p>
                                            {item.supplyApy ? (
                                                <Statistic
                                                    suffix="%"
                                                    value={item.supplyApy}
                                                />
                                            ) : (
                                                '--'
                                            )}
                                        </p>
                                        <p>
                                            {' '}
                                            <Statistic
                                                suffix={'%'}
                                                value={item.borrowApy || '--'}
                                            />
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        );
                    })}
                </>
            ) : (
                <tr>
                    <td colSpan={6} className="no-data">
                        <div>{t('No_Data')}</div>
                    </td>
                </tr>
            )}
        </div>
    );
};

export default MarketsMobileList;
