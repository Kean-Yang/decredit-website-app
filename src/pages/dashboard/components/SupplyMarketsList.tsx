import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Button, Spin, Statistic } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import SwitchBox from './SwitchBox';
import { Token_icon } from '../../../constants';
import { SymbolConfig } from '../../../config';
import Subtract from '../../../assets/com/subtract.png';
import IsUnlockWallet from '../../../components/UnlockWallet/IsUnlockWallet';
import './Tablist.scss';

interface DataProps {
    supplyBorrowLoading?: boolean;
    supplyBorrowLsit?: any[];
    supplyShow?: any;
    supplyButLoading?: any;
    enterMarkets?: any;
    exitMarket?: any;
    collateralLoading?: any;
    notCollatera: () => any;
    approve?: (item: any) => any;
}

const SupplyMarketsList = ({
    supplyBorrowLoading = false,
    supplyBorrowLsit = [],
    supplyShow = () => {},
    supplyButLoading = null,
    enterMarkets = () => {},
    exitMarket = () => {},
    collateralLoading = null,
    notCollatera = () => {},
    approve = (item: any) => {},
}: DataProps) => {
    const { t } = useTranslation();

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
        <div className="tablist">
            <Row>
                <Col lg={24} md={24} xs={24}>
                    <div className="data-item">
                        <table className="table-list">
                            <thead className="thead">
                                <tr>
                                    <th>
                                        <span>{t('assets')}</span>
                                    </th>
                                    <th>{t('apy')}</th>
                                    <th>{t('supplyBalance')}</th>
                                    <th className="collateral">
                                        {t('collateral')}
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody className="tbody">
                                {supplyBorrowLoading && SymbolConfig.length ? (
                                    <>
                                        {SymbolConfig.map(
                                            (item: any, index: number) => {
                                                return (
                                                    <tr
                                                        className="Skeleton"
                                                        key={index}
                                                    >
                                                        <td colSpan={5}></td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </>
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
                                                        </td>
                                                        <td className="collateral">
                                                            {item.index ===
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
                                        <td colSpan={5} className="no-data">
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
    );
};

export default SupplyMarketsList;
