import React from 'react';
import { Modal, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ConnectWalletTitle from '../../assets/com/connect-wallet-title.png';
import * as Tools from '../../utils/Tools';
import collateralRight from '../../assets/com/collateral_right.svg';
import './index.scss';

interface DataProps {
    visible?: false | true; // 弹窗状态
    state?: true | false; // 进入退出市场
    borrowBalance?: number | string;
    totleMaxBorrowBalance?: number | string;
    totalBorrowLimitUsed?: number | string;
    collateralButLoading?: boolean;
    enterMarkets?: any;
    exitMarket?: any;
    close: () => any; // 关闭弹窗
    data?: any;
}

const Collatera = ({
    visible = false,
    state = true,
    borrowBalance = 0,
    totleMaxBorrowBalance = 0,
    totalBorrowLimitUsed = 0,
    collateralButLoading = false,
    enterMarkets = () => {},
    exitMarket = () => {},
    close = () => {},
    data = {},
}: DataProps) => {
    const { t } = useTranslation();
    const { symbol, totleBorrowLimitUSDTprice } = data;

    const newBorrowLimit = Tools.plus(
        Number(totleBorrowLimitUSDTprice),
        totleMaxBorrowBalance
    );

    const newBorrowLimitUsed =
        Tools.GT(borrowBalance, 0) &&
        Tools.GT(totleMaxBorrowBalance, 0) &&
        Tools.GT(Number(totleBorrowLimitUSDTprice), 0)
            ? Tools.fmtDec(
                  Tools.mul(Tools.div(borrowBalance, newBorrowLimit), 100),
                  4
              )
            : 0;

    return (
        <Modal
            footer={null}
            title={null}
            visible={visible}
            centered
            closable={false}
            className="decredit-collatera"
            keyboard
            mask
            width={430}
            maskClosable
            zIndex={999}
        >
            <div className="collatera">
                <div className="wallet-title">
                    <img src={ConnectWalletTitle as any} alt="OpenDefi" />

                    <CloseOutlined
                        className="close"
                        twoToneColor="#FFFFFF"
                        onClick={close}
                    />
                </div>
                <div className="collatera-content">
                    <div className="content-title">
                        <p>
                            {state === true
                                ? t('EnableCollateral')
                                : t('DisableCollateral')}{' '}
                        </p>
                    </div>
                    <div className="content-content">
                        {state === true ? (
                            <div className="enter-markets">
                                <p>{t('EachCollateralBorrowing')}</p>
                                <div className="data">
                                    <div className="data-item">
                                        <span>{t('BorrowLimit')}</span>
                                        <div>
                                            $
                                            {Tools.fmtDec(
                                                totleMaxBorrowBalance,
                                                4
                                            ) || 0}
                                        </div>
                                        <img
                                            src={collateralRight as any}
                                            alt="OpenDefi"
                                        />

                                        <div>
                                            $
                                            {Tools.fmtDec(newBorrowLimit, 4) ||
                                                0}
                                        </div>
                                    </div>
                                    <div className="data-item">
                                        <span>{t('BorrowLimitUsed')}</span>
                                        <div>
                                            {totalBorrowLimitUsed
                                                ? `${
                                                      Tools.fmtDec(
                                                          totalBorrowLimitUsed,
                                                          4
                                                      ) || 0
                                                  }%`
                                                : '--'}
                                        </div>
                                        <img
                                            src={collateralRight as any}
                                            alt="OpenDefi"
                                        />

                                        <div>
                                            {Tools.LE(newBorrowLimitUsed, 0)
                                                ? Tools.fmtDec(
                                                      totalBorrowLimitUsed,
                                                      4
                                                  )
                                                : newBorrowLimitUsed || 0}
                                            %
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="exit-market">
                                <p>{t('collateralExceedLimit')}</p>
                                <p>{t('NoteCollateralRepayed')}</p>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={() => {
                            state === true ? enterMarkets() : exitMarket();
                        }}
                        className="back"
                        type="text"
                        loading={collateralButLoading}
                    >
                        {state === true
                            ? t('UseAsCollateral', { x: symbol })
                            : t('ok')}
                    </Button>

                    {/* {state === true ? (
                        <Button
                            onClick={enterMarkets}
                            className="back"
                            type="text"
                            loading={collateralButLoading}
                        >
                            {t('UseAsCollateral', { x: symbol })}
                        </Button>
                    ) : (
                        <Button
                            onClick={exitMarket}
                            className="back"
                            type="text"
                            loading={collateralButLoading}
                        >
                            OK
                        </Button>
                    )} */}
                </div>
            </div>
        </Modal>
    );
};

export default Collatera;
