import React, { useState, useEffect } from 'react';
import './index.scss';
import logo from '../../assets/logo.png';
import security from '../../assets/audit.svg';
import { AppMenuSocial } from '../../Layout/app.menu';
import IsUnlockWallet from '../../components/UnlockWallet/IsUnlockWallet';
import walletIcon from '../../assets/wallet.svg';
import { useWallet } from 'use-wallet';
import { useMedia } from 'react-use';
import * as Tools from '../../utils/Tools';
import Subtract from '../../assets/com/subtract.png';
import { getCompBalanceWithAccrued } from '../../contract/Stake';
import { Decredit_Audit_Report } from '../../constants';

const PageFooter = () => {
    const below768 = useMedia('(max-width: 768px)');
    const wallet = useWallet();
    const { account, ethereum } = wallet;
    const [balance, setBalance] = useState({});

    const getCompBalance = async (account: any) => {
        const Compbalance = await getCompBalanceWithAccrued(ethereum, account);
        setBalance(Compbalance || {});
    };

    useEffect(() => {
        // other code
        if (account) getCompBalance(account);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethereum, account]);

    return (
        <footer className="page-footer">
            <div className="footer-title"></div>

            <div className="footer">
                {!below768 ? (
                    <div className="footer-content">
                        <div className="website">
                            <a
                                href={Decredit_Audit_Report}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={security as any} alt="OpenDefi" />
                            </a>
                            <a
                                href="https://decredit.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={logo as any} alt="OpenDefi" />
                            </a>
                            <a
                                href="https://decredit.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://decredit.io
                            </a>
                        </div>

                        <div className="social">
                            <ul>
                                {AppMenuSocial &&
                                    AppMenuSocial.map(
                                        (item: any, index: number) => {
                                            return (
                                                <li key={index}>
                                                    <a
                                                        href={item.url as any}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            src={
                                                                item.icon as any
                                                            }
                                                            alt="OpenDefi"
                                                        />
                                                    </a>
                                                </li>
                                            );
                                        }
                                    )}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="nav-Wallet-account">
                        <IsUnlockWallet ButClassNmae="account">
                            <span className="account">
                                <img src={walletIcon as any} alt="OpenDefi" />
                                {Tools.substringTx(account || '...') || '...'}
                            </span>
                        </IsUnlockWallet>

                        <span className="balance">
                            <img src={Subtract as any} alt="" />
                            {Number(balance.allocated).toFixed(4) || '0.0000'}
                        </span>
                    </div>
                )}
            </div>
        </footer>
    );
};

export default PageFooter;
