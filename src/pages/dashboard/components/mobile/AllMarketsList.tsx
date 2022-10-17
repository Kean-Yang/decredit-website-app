import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Button, Spin, Statistic } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import SwitchBox from '../SwitchBox';
import { Token_icon } from '../../../../constants';
import Subtract from '../../../../assets/com/subtract.png';
import * as Tools from '../../../../utils/Tools';
import IsUnlockWallet from '../../../../components/UnlockWallet/IsUnlockWallet';
import './Tablist.scss';

interface DataProps {
    supplyLoading?: boolean;
    supplyBorrowLsit?: any[];
    borrowLoading?: boolean;
    borrowButLoading?: boolean;
    supplyButLoading?: boolean;
    borrowShow?: any;
    enterMarkets?: any;
    exitMarket?: any;
    collateralLoading?: any;
    notCollatera: () => any;
    approve?: (item: any) => any;
    tabs?: string | number;
    switchTabs: (index: any) => any;
    supplyShow?: any;
}

const AllMarketsMobileList = ({
    supplyLoading = true,
    supplyBorrowLsit = [],
    borrowLoading = false,
    borrowButLoading = false,
    supplyButLoading = false,
    borrowShow = () => {},
    enterMarkets = () => {},
    exitMarket = () => {},
    collateralLoading = null,
    notCollatera = () => {},
    approve = (item: any) => {},
    tabs = 0,
    switchTabs = () => {},
    supplyShow = () => {},
}: DataProps) => {
    const { t } = useTranslation();
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        <div className="tablist-mobile">
            <div className="tablist-tabs">
                <div
                    className={tabs === 0 ? 'active' : ''}
                    onClick={() => {
                        switchTabs(0);
                    }}
                >
                    {t('supplyMarket')}
                </div>
                <div
                    className={tabs === 1 ? 'active' : ''}
                    onClick={() => {
                        console.log('1');
                        switchTabs(1);
                    }}
                >
                    {t('borrowMarket')}
                </div>
            </div>

            <Row>
                {tabs === 0 ? (
                    <Col lg={24} md={24} xs={24}>
                        <div className="data-item">
                            <table className="table-list">
                                <tbody className="tbody">
                                    {supplyLoading ? (
                                        <tr className="Skeleton">
                                            <td colSpan={6}></td>
                                        </tr>
                                    ) : supplyBorrowLsit &&
                                      supplyBorrowLsit.length ? (
                                        <>
                                            {supplyBorrowLsit.map(
                                                (item: any, index: number) => {
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
                                                                <p>
                                                                    {item.symbol ||
                                                                        '--'}
                                                                </p>

                                                                {index ===
                                                                collateralLoading ? (
                                                                    <Spin
                                                                        indicator={
                                                                            antIcon
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="switch-box"
                                                                        onClick={() => {
                                                                            item.isSavings
                                                                                ? item.redeemAllowed
                                                                                    ? exitMarket(
                                                                                          item
                                                                                      )
                                                                                    : notCollatera()
                                                                                : enterMarkets(
                                                                                      item
                                                                                  );
                                                                        }}
                                                                    >
                                                                        <SwitchBox
                                                                            state={
                                                                                item.isSavings
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                                <p>
                                                                    {t(
                                                                        'collateral'
                                                                    )}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                {item.totalSupply ? (
                                                                    <Statistic
                                                                        suffix={
                                                                            item.symbol
                                                                        }
                                                                        value={
                                                                            item.totalSupply
                                                                        }
                                                                    />
                                                                ) : (
                                                                    '--'
                                                                )}
                                                                <p>
                                                                    {t(
                                                                        'supplyBalance'
                                                                    )}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <Statistic
                                                                    suffix="%"
                                                                    value={
                                                                        item.supplyEarningsApy ||
                                                                        '--'
                                                                    }
                                                                />
                                                                <p>
                                                                    {t('apy')}
                                                                </p>

                                                                {item.allowance ||
                                                                item.isNativeToken ? (
                                                                    <IsUnlockWallet ButClassNmae="action-buttons">
                                                                        <Button
                                                                            type="primary"
                                                                            className={
                                                                                item.mintGuardianPaused
                                                                                    ? 'action-buttons-disabled'
                                                                                    : 'action-buttons'
                                                                            }
                                                                            size="small"
                                                                            disabled={
                                                                                item.mintGuardianPaused
                                                                            }
                                                                            loading={
                                                                                item.index ===
                                                                                supplyButLoading
                                                                            }
                                                                            onClick={() => {
                                                                                supplyShow(
                                                                                    item
                                                                                );
                                                                            }}
                                                                        >
                                                                            {t(
                                                                                'Supply'
                                                                            )}
                                                                        </Button>
                                                                    </IsUnlockWallet>
                                                                ) : (
                                                                    <Button
                                                                        type="primary"
                                                                        className="action-buttons"
                                                                        size="small"
                                                                        loading={
                                                                            item.index ===
                                                                            supplyButLoading
                                                                        }
                                                                        onClick={() => {
                                                                            approve(
                                                                                item
                                                                            );
                                                                        }}
                                                                    >
                                                                        {t(
                                                                            'Supply'
                                                                        )}
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="no-data">
                                                <div>{t('No_Data')}</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                ) : (
                    <Col lg={24} md={24} xs={24}>
                        <div className="data-item">
                            <table className="table-list">
                                <tbody className="tbody">
                                    {borrowLoading ? (
                                        <tr className="Skeleton">
                                            <td colSpan={7}></td>
                                        </tr>
                                    ) : supplyBorrowLsit &&
                                      supplyBorrowLsit.length ? (
                                        <>
                                            {supplyBorrowLsit.map(
                                                (item: any, index: number) => {
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
                                                                <p>
                                                                    {item.symbol ||
                                                                        '--'}
                                                                </p>

                                                                {item.liquidity ? (
                                                                    <Statistic
                                                                        suffix={
                                                                            item.symbol
                                                                        }
                                                                        value={
                                                                            item.liquidity ||
                                                                            0
                                                                        }
                                                                    />
                                                                ) : (
                                                                    '--'
                                                                )}
                                                                <p>
                                                                    {t(
                                                                        'liquidity'
                                                                    )}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <Statistic
                                                                    suffix="%"
                                                                    value={
                                                                        Tools.fmtDec(
                                                                            item.borrowEarningsApy,
                                                                            2
                                                                        ) ||
                                                                        '--'
                                                                    }
                                                                />
                                                                <p>
                                                                    {t('apy')}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                {item.totalBorrow ? (
                                                                    <Statistic
                                                                        suffix={
                                                                            item.symbol
                                                                        }
                                                                        value={
                                                                            item.totalBorrow
                                                                        }
                                                                    />
                                                                ) : (
                                                                    '--'
                                                                )}
                                                                <p>
                                                                    {t(
                                                                        'TotalBorrow'
                                                                    )}
                                                                </p>

                                                                <Button
                                                                    type="primary"
                                                                    className={
                                                                        item.borrowGuardianPaused
                                                                            ? 'action-buttons-disabled'
                                                                            : 'action-buttons'
                                                                    }
                                                                    size="small"
                                                                    disabled={
                                                                        item.borrowGuardianPaused
                                                                    }
                                                                    loading={
                                                                        item.index ===
                                                                        borrowButLoading
                                                                    }
                                                                    onClick={() => {
                                                                        borrowShow(
                                                                            item
                                                                        );
                                                                    }}
                                                                >
                                                                    {t(
                                                                        'Borrow'
                                                                    )}
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="no-data">
                                                <div>{t('No_Data')}</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default AllMarketsMobileList;
