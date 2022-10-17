import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { message, Row, Col } from 'antd';
import { useWallet } from 'use-wallet';
import banner from '../../assets/stake/rank-banner.png';
import bannerIcon from '../../assets/stake/rank-list-icon.png';
import RankListFoot from '../../assets/stake/rank-list-foot.png';
import { blacsBrowserPoll } from '../../config';

import RankFirst from '../../assets/stake/rank-first.png';
import RankSecond from '../../assets/stake/rank-second.png';
import RankThird from '../../assets/stake/rank-third.png';
import { exchangeRateCurrent } from '../../contract/Dashboard';
import { ApiGetRankList } from '../../services';
import * as Tools from '../../utils/Tools';
import './ranklist.scss';

const RankList = () => {
    const { t } = useTranslation();
    const wallet = useWallet();
    const { account, ethereum } = wallet;
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);

    const getAllData = async () => {
        const getExchangeRateCurrent = await exchangeRateCurrent(ethereum);

        console.log(getExchangeRateCurrent);

        getExchangeRateCurrent &&
            ApiGetRankList()
                .then((res) => {
                    setLoading(false);
                    if (res.code === 200) {
                        const list = res.data
                            .filter((item: any) => {
                                return item.Method === 'Stake';
                            })
                            .map((item: any) => {
                                return item;
                            });

                        const rankListData = list.sort((a: any, b: any) => {
                            return b.Quantity - a.Quantity;
                        });

                        const rankListData30 = rankListData.slice(0, 30) || [];

                        const rankLiast =
                            rankListData30 &&
                            rankListData30.map((item: any, index: any) => {
                                return {
                                    rannk: index + 1,
                                    substringTxaddress: Tools.substringTx(
                                        item.To
                                    ),
                                    address: item.To,
                                    amount: Tools.fmtDec(
                                        Tools.mul(
                                            item.Quantity,
                                            getExchangeRateCurrent
                                        ),
                                        6
                                    ),
                                    isMe: item.To === account,
                                };
                            });

                        console.log(rankLiast);

                        setList(rankLiast || []);
                    } else {
                        message.error('Network error, please try again');
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    message.error('Network error, please try again');
                    console.log([]);

                    setList([]);
                });

        // Promise.all([getExchangeRateCurrent]).then((res: any) => {
        //     console.log(res);
        // });
    };

    useEffect(() => {
        // other code
        ethereum && getAllData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethereum]);

    return (
        <div className="rank-list">
            <div className="banner">
                <Row className="title">
                    <Col lg={10} md={10} xs={24}>
                        <div className="left">
                            <img
                                className="bannerIcon"
                                src={bannerIcon as any}
                                alt=""
                            />
                            <Link to="/stake">
                                <div className="back">{t('BackStake')}</div>
                            </Link>
                        </div>
                    </Col>
                    <Col lg={14} md={14} xs={24}>
                        <img src={banner as any} alt="" />
                    </Col>
                </Row>
            </div>
            <div className="rank-list-data">
                <h1>{t('RankList')}</h1>
                <Row className="title">
                    <Col lg={8} md={8} xs={6}>
                        {t('Ranking')}
                    </Col>
                    <Col lg={8} md={8} xs={8}>
                        {t('Address')}
                    </Col>
                    <Col lg={8} md={8} xs={10}>
                        {t('Amount')}（CDTC)
                    </Col>
                </Row>
                <div className="list">
                    {loading ? (
                        <Row>
                            <Col lg={24} md={24} xs={24}>
                                <div className="Skeleton"></div>
                            </Col>
                        </Row>
                    ) : list && list.length ? (
                        list.map((item: any, index: number) => {
                            return (
                                <Row className="data" key={index}>
                                    <Col lg={8} md={8} xs={4}>
                                        <a
                                            href={`${blacsBrowserPoll}${item.address}`}
                                            className="link-browser pending"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.rannk === 1 ? (
                                                <img
                                                    src={RankFirst as any}
                                                    alt=""
                                                />
                                            ) : item.rannk === 2 ? (
                                                <img
                                                    src={RankSecond as any}
                                                    alt=""
                                                />
                                            ) : item.rannk === 3 ? (
                                                <img
                                                    src={RankThird as any}
                                                    alt=""
                                                />
                                            ) : (
                                                <p>{item.rannk}</p>
                                            )}
                                        </a>
                                    </Col>
                                    <Col lg={8} md={8} xs={10}>
                                        <a
                                            href={`${blacsBrowserPoll}${item.address}`}
                                            className="link-browser pending"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.substringTxaddress || ''}
                                        </a>
                                    </Col>
                                    <Col lg={8} md={8} xs={10}>
                                        <a
                                            href={`${blacsBrowserPoll}${item.address}`}
                                            className="link-browser pending"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.amount || 0}
                                        </a>
                                    </Col>
                                </Row>
                            );
                        })
                    ) : (
                        <Row>
                            <Col lg={24} md={24} xs={24} className="no-data">
                                <div>{t('No_Data')}</div>
                            </Col>
                        </Row>
                    )}
                </div>
                <img
                    className="rankList-foot-icon"
                    src={RankListFoot as any}
                    alt=""
                />
            </div>
        </div>
    );
};

export default RankList;
