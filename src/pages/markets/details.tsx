import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { Row, Col, Statistic } from 'antd';
import { useWallet } from 'use-wallet';
import { Token_icon } from '../../constants';
import Subtract from '../../assets/com/subtract.png';
import * as Tools from '../../utils/Tools';
import './details.scss';
import {
    // ContractTotalSupply,
    ContractTotalBorrowsCurrent,
    GetAllMarkets,
} from '../../contract/Dashboard';

const MarketsDetails = () => {
    const { t } = useTranslation();
    const wallet = useWallet();
    const { account, ethereum } = wallet;
    const [allMarketsList, setAllMarketsList] = useState([]); //
    const [getAllMarketsLoading, setGetAllMarketsLoading] = useState(false); //
    const [totalSupplyBalance, setTotalSupplyBalance] = useState(0); //  总借款
    const [totalBorrowBalance, setTotalBorrowBalance] = useState(0); //  总存款
    const [details, setDetails] = useState({});

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
        // 第一次执行
        if (account) getPoolList(ethereum, account, true);
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
        // ContractTotalSupply(ethereum)
        //     .then((res) => {
        //         console.log(res);
        //         setTotalSupplyBalance(Tools.fmtDec(res, 6));
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });

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
        <div className="markets-details">
            <div>
                <div className=""></div>
            </div>
            <div></div>
        </div>
    );
};

export default MarketsDetails;
