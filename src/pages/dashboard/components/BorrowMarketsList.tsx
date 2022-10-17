import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Button, Statistic } from 'antd';
import { Token_icon } from '../../../constants';
import { SymbolConfig } from '../../../config';
import Subtract from '../../../assets/com/subtract.png';
import './Tablist.scss';

interface DataProps {
    supplyBorrowLoading?: boolean;
    supplyBorrowLsit?: any[];
    borrowShow?: any;
    borrowButLoading?: any;
    approve?: (item: any) => any;
}

const BorrowMarketsList = ({
    supplyBorrowLoading = false,
    supplyBorrowLsit = [],
    borrowShow = () => {},
    borrowButLoading = null,
    approve = (item: any) => {},
}: DataProps) => {
    const { t } = useTranslation();

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
                                    <th>{t('TotalBorrow')}</th>
                                    <th>{t('liquidity')}</th>
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
                                                                    item.borrowEarningsApy ||
                                                                    '--'
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
                                                            {item.totalBorrow ? (
                                                                <Statistic
                                                                    suffix={
                                                                        item.symbol
                                                                    }
                                                                    value={
                                                                        item.totalBorrow ||
                                                                        0
                                                                    }
                                                                />
                                                            ) : (
                                                                '--'
                                                            )}
                                                        </td>
                                                        <td>
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
                                                        </td>

                                                        <td>
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
                                                                {t('Borrow')}
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="no-data">
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

export default BorrowMarketsList;
