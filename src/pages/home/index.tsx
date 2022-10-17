import React, { useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
import { useWallet } from 'use-wallet';
import './index.scss';
import {
    ContractTotalSupply,
    ContractTotalBorrowsCurrent,
    ContractBorrowRatePerBlock,
    GetAllMarkets,
} from '../../contract/Dashboard';

import banner from '../../assets/banner.png';

const Home = () => {
    // const { t } = useTranslation();
    const wallet = useWallet();
    const { account, ethereum } = wallet;

    useEffect(() => {
        // other code
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ContractTotalSupply(ethereum)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        ContractBorrowRatePerBlock(ethereum)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        ContractTotalBorrowsCurrent(ethereum)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        GetAllMarkets(ethereum, account)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [ethereum, account]);

    return (
        <div className="home">
            home
            <div className="banner">
                <img src={banner as any} alt="OpenDefi" />
            </div>
        </div>
    );
};

export default Home;
