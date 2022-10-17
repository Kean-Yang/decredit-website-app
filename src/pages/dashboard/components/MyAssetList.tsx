import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Button, Spin, Statistic } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import SwitchBox from './SwitchBox';
import { Token_icon } from '../../../constants';
import Subtract from '../../../assets/com/subtract.png';
import IsUnlockWallet from '../../../components/UnlockWallet/IsUnlockWallet';
import MyAssetNodata from '../../../components/Empty/MyAssetNodata';
import * as Tools from '../../../utils/Tools';
import './Tablist.scss';

interface DataProps {
    supplyLoading?: boolean;
    supplyLsit?: any[];
    borrowLoading?: boolean;
    borrowList?: any[];
    withdrawShow: any;
    repayShow: any;
    mySupplyButLoading: any;
    repayButLoading: any;
    enterMarkets?: any;
    exitMarket?: any;
    collateralLoading?: any;
    notCollatera: () => any;
    approve?: (item: any) => any;
    myTotleSupply?: string | number;
    myTotleBorrow?: string | number;
    totleBorrowLimit?: string | number;
}

const MyAssetList = ({
    supplyLoading = true,
    supplyLsit = [],
    borrowLoading = true,
    borrowList = [],
    withdrawShow = () => {},
    repayShow = () => {},
    mySupplyButLoading = null,
    repayButLoading = null,
    enterMarkets = () => {},
    exitMarket = () => {},
    collateralLoading = null,
    notCollatera = () => {},
    approve = (item: any) => {},
    myTotleSupply = 0,
    myTotleBorrow = 0,
    totleBorrowLimit = 0,
}: DataProps) => {
    const { t } = useTranslation();
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        <div className="tablist">
            <Row>
                <Col lg={24} md={24} xs={24}>
                    <div className="data-item">
                        <div className="title">{t('MySupply')}</div>
                        <div className="totle-data">
                            <span>
                                {t('TotalSupply')}: ${myTotleSupply}
                            </span>
                        </div>
                        <table className="table-list">
                            <thead className="thead">
                                <tr>
                                    <th>
                                        <span>{t('assets')}</span>
                                    </th>
                                    <th>{t('apy')}</th>
                                    <th>{t('Balance')}</th>
                                    <th>{t('Value')}</th>
                                    <th>{t('collateral')}</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody className="tbody">
                                {supplyLoading ? (
                                    <tr className="Skeleton">
                                        <td colSpan={6}></td>
                                    </tr>
                                ) : supplyLsit && supplyLsit.length ? (
                                    <>
                                        {supplyLsit.map(
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
                                                            <span>
                                                                {item.symbol ||
                                                                    '--'}
                                                            </span>
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
                                                                <span>
                                                                    {item.supplyApy ||
                                                                        0}
                                                                    %
                                                                </span>{' '}
                                                                +{' '}
                                                                <span>
                                                                    {item.supplydistributionApy ||
                                                                        0}
                                                                    %
                                                                </span>
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <Statistic
                                                                suffix={
                                                                    item.symbol
                                                                }
                                                                value={
                                                                    Tools.fmtDec(
                                                                        item.underlyingBalance,
                                                                        6
                                                                    ) || '--'
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <Statistic
                                                                prefix={'$'}
                                                                value={
                                                                    Tools.fmtDec(
                                                                        item.supplyBalanceUSDTprice,
                                                                        2
                                                                    ) || '--'
                                                                }
                                                            />
                                                        </td>
                                                        <td>
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
                                                        </td>

                                                        <td>
                                                            {item.allowance ||
                                                            item.isNativeToken ? (
                                                                <IsUnlockWallet ButClassNmae="action-buttons">
                                                                    <Button
                                                                        type="primary"
                                                                        className="action-buttons"
                                                                        size="small"
                                                                        loading={
                                                                            item.index ===
                                                                            mySupplyButLoading
                                                                        }
                                                                        onClick={() => {
                                                                            withdrawShow(
                                                                                item
                                                                            );
                                                                        }}
                                                                    >
                                                                        {t(
                                                                            'Withdraw'
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
                                                                        mySupplyButLoading
                                                                    }
                                                                    onClick={() => {
                                                                        approve(
                                                                            item
                                                                        );
                                                                    }}
                                                                >
                                                                    {t(
                                                                        'Withdraw'
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

                <Col lg={24} md={24} xs={24}>
                    <div className="data-item">
                        <div className="title">{t('MyBorrow')}</div>
                        <div className="totle-data">
                            <span>
                                {t('TotalBorrow')}: $
                                {Tools.fmtDec(myTotleBorrow, 2)}
                            </span>
                            <span>
                                {t('TotalBorrowLimit')}: $
                                {Tools.fmtDec(totleBorrowLimit, 2)}
                            </span>
                        </div>
                        <table className="table-list">
                            <thead className="thead">
                                <tr>
                                    <th>
                                        <span>{t('assets')}</span>
                                    </th>
                                    <th>{t('apy')}</th>
                                    <th>{t('Balance')}</th>
                                    <th>{t('Value')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className="tbody">
                                {borrowLoading ? (
                                    <tr className="Skeleton">
                                        <td colSpan={7}></td>
                                    </tr>
                                ) : borrowList && borrowList.length ? (
                                    <>
                                        {borrowList.map(
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
                                                            <span>
                                                                {item.symbol ||
                                                                    '--'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <Statistic
                                                                suffix="%"
                                                                value={
                                                                    Tools.fmtDec(
                                                                        item.borrowEarningsApy,
                                                                        2
                                                                    ) || '--'
                                                                }
                                                            />
                                                            <p>
                                                                <span>
                                                                    {item.borrowApy ||
                                                                        0}
                                                                    %
                                                                </span>{' '}
                                                                -{' '}
                                                                <span>
                                                                    {item.borrowdistributionApy ||
                                                                        0}
                                                                    %
                                                                </span>
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <Statistic
                                                                suffix={
                                                                    item.symbol
                                                                }
                                                                value={
                                                                    item.borrowBalance ||
                                                                    '--'
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <Statistic
                                                                prefix={'$'}
                                                                value={
                                                                    Tools.fmtDec(
                                                                        item.borrowBalanceUSDTprice,
                                                                        2
                                                                    ) || '--'
                                                                }
                                                            />
                                                        </td>

                                                        <td>
                                                            {/* <Button
                                                                    type="primary"
                                                                    className="action-buttons"
                                                                    loading={
                                                                        item.index ===
                                                                        repayButLoading
                                                                    }
                                                                    onClick={() => {
                                                                        repayShow(
                                                                            item
                                                                        );
                                                                    }}
                                                                >
                                                                    {t('Repay')}
                                                                </Button> */}

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
                                                                            repayButLoading
                                                                        }
                                                                        onClick={() => {
                                                                            repayShow(
                                                                                item
                                                                            );
                                                                        }}
                                                                    >
                                                                        {t(
                                                                            'Repay'
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
                                                                        repayButLoading
                                                                    }
                                                                    onClick={() => {
                                                                        approve(
                                                                            item
                                                                        );
                                                                    }}
                                                                >
                                                                    {t('Repay')}
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
                                        <td colSpan={7} className="no-data">
                                            <div>{t('No_Data')}</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>

            {!supplyLsit.length &&
            !borrowList.length &&
            !supplyLoading &&
            !borrowLoading ? (
                <MyAssetNodata />
            ) : (
                <></>
            )}
        </div>
    );
};

export default MyAssetList;
