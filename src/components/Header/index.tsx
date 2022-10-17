import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Dropdown, Menu } from 'antd';
import { AppMenuMobile, AppMenuMobileSocial } from '../../Layout/app.menu';
import { useHistory, useLocation } from 'react-router-dom';
import logo from '../../assets/com/logo.png';
import walletIcon from '../../assets/wallet.svg';
import Menuicon from '../../assets/mobile/Menu.svg';
// import miningIcon from '../../assets/mining.png';
import IsUnlockWallet from '../../components/UnlockWallet/IsUnlockWallet';
// import TransactionModal from '../../components/TransactionModal';
// import CompBalanceWith from '../CompBalanceWith';
import { Decredit_Audit_Report } from '../../constants';
import Audit from '../../assets/mobile/Audit.svg';
import './index.scss';
import * as Tools from '../../utils/Tools';
import { useMedia } from 'react-use';
import DesktopMenu from './DesktopMenu';
import { connect } from 'react-redux';
import { useWallet } from 'use-wallet';
import { switchLanguage, getLang } from '../../i18n/LangUtil';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
    en_US,
    zh_HK,
    zh_CN,
    ko_KR,
    vi_VN,
} from '../../redux/reducers/switchLanguage';

const PageHeader = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const wallet = useWallet();
    const { account } = wallet;
    const below768 = useMedia('(max-width: 768px)');
    const [visible, setVisible] = useState(false);
    // const [loading, setLoading] = useState(false);
    // const [digVisible, setDigVisible] = useState(false);
    // const [balance, setBalance] = useState({});
    // const [transactionStatus, setTransactionStatus] = useState(''); // failed:交易失败 pending:交易进行中 succes:交易成功 null取消弹窗
    // const [hash, setHash] = useState('');

    const showDrawer = useCallback(() => {
        setVisible(true);
    }, []);
    const onClose = useCallback(() => {
        setVisible(false);
    }, []);

    const name = AppMenuMobile.filter((item) => {
        return item.url === location.pathname;
    }).map((item) => {
        return item.name;
    });

    const reduxLang = useSelector(
        (state: any) => state.languageManag.type || getLang(),
        shallowEqual
    );

    const onChangeSwitchreduxLang = (lang: any) => {
        switchLanguage(lang);
        switch (lang) {
            case 'zh_HK':
                dispatch(zh_HK);
                return true;
            case 'en_US':
                dispatch(en_US);
                return true;
            case 'zh_CN':
                dispatch(zh_CN);
                return true;
            case 'ko_KR':
                dispatch(ko_KR);
                return true;
            case 'vi_VN':
                dispatch(vi_VN);
                return true;
            default:
                dispatch(en_US);
        }
    };

    // const showDig = useCallback(() => {
    //     setDigVisible(true);
    // }, []);
    // const hideDig = useCallback(() => {
    //     setDigVisible(false);
    // }, []);

    // const getCompBalance = async (account: any) => {
    //     const Compbalance = await getCompBalanceWithAccrued(account);
    //     console.log(
    //         Compbalance,
    //         'CompbalanceCompbalanceCompbalanceCompbalance'
    //     );
    //     setBalance(Compbalance || {});
    // };

    // const ContractClaimCompFun = async (account: any) => {
    //     setLoading(true);
    //     await ContractClaimComp(
    //         account,
    //         (transactionHash: any) => {
    //             console.log(transactionHash);
    //             setHash(transactionHash || '');
    //             setTransactionStatus('pending');
    //         },
    //         async () => {
    //             console.log('succes');
    //             setLoading(false);
    //             setTransactionStatus('succes');
    //             hideDig();
    //             getCompBalance(account);
    //         },
    //         () => {
    //             console.log('failed');
    //             hideDig();
    //             setLoading(false);
    //             setTransactionStatus('failed');
    //         },
    //         () => {
    //             hideDig();
    //             setLoading(false);
    //             setTransactionStatus('');
    //         }
    //     )
    //         .then((res) => {})
    //         .catch((err) => {
    //             setLoading(false);
    //             hideDig();
    //             setTransactionStatus('');
    //         });
    // };

    // useEffect(() => {
    //     if (account) getCompBalance(account);
    //     // ContractClaimCompFun(account);
    // }, [account]);

    const jumpPage = (url: any, target: boolean) => {
        if (url.indexOf('https://') > -1) {
            window.location.href = url;
        } else {
            history.push(url);
            setVisible(false);
        }
    };

    const handleClick = (e: any) => {
        onChangeSwitchreduxLang(e.key);
    };

    // useEffect(() => {
    //     // const userBalance = async () => {
    //     //     const balances = await Polkadot.getUserBalance(account);
    //     //     setBalance(balances);
    //     // };
    //     // if (account) userBalance();
    // }, [account]);

    return (
        <header className="page-header">
            <div className="header">
                <div className="content">
                    {!below768 ? (
                        <div className="nav-logo">
                            <a href="/" rel="noopener noreferrer">
                                <img src={logo as any} alt="OpenDefi" />{' '}
                            </a>
                        </div>
                    ) : (
                        <div className="nav-logo" onClick={() => showDrawer()}>
                            <img src={logo as any} alt="OpenDefi" />{' '}
                        </div>
                    )}

                    {below768 ? (
                        <div className="mobile-page-title">{name}</div>
                    ) : (
                        ''
                    )}

                    {!below768 ? (
                        <div className="nav">
                            <div className="nav-link">
                                <DesktopMenu />
                            </div>
                        </div>
                    ) : (
                        <Modal
                            title={null}
                            placement="top"
                            className="menuMobile"
                            mask={false}
                            closable={true}
                            footer={null}
                            header={null}
                            height="auto"
                            maskClosable={true}
                            onCancel={onClose}
                            visible={visible}
                        >
                            <div className="menuMobile-link">
                                {AppMenuMobile &&
                                    AppMenuMobile.map(
                                        (item: any, index: number) => {
                                            return (
                                                <div
                                                    key={`${item.key} ${index}`}
                                                    className="menu-item"
                                                >
                                                    {item.target ? (
                                                        <a
                                                            href={
                                                                item.url as any
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img
                                                                src={
                                                                    item.icon as any
                                                                }
                                                                alt="OpenDefi"
                                                            />
                                                            {t(
                                                                `${item.name}`
                                                            ) || ''}{' '}
                                                        </a>
                                                    ) : (
                                                        <p
                                                            onClick={() =>
                                                                jumpPage(
                                                                    item.url,
                                                                    item.target
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={
                                                                    item.icon as any
                                                                }
                                                                alt=""
                                                            />{' '}
                                                            {t(
                                                                `${item.name}`
                                                            ) || ''}{' '}
                                                            {item.childrenName ||
                                                                ''}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                            </div>

                            <div className="social">
                                <div className="audit">
                                    <a
                                        href={Decredit_Audit_Report}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={Audit as any}
                                            alt="OpenDefi"
                                        />
                                        {t('Audit')}
                                    </a>
                                </div>
                                <ul>
                                    {AppMenuMobileSocial &&
                                        AppMenuMobileSocial.map(
                                            (item: any, index: number) => {
                                                return (
                                                    <li key={index}>
                                                        <a
                                                            href={
                                                                item.url as any
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={() =>
                                                                setVisible(
                                                                    false
                                                                )
                                                            }
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

                            <Menu
                                className="mobile-language"
                                onClick={handleClick}
                            >
                                <Menu.Item key="en_US">
                                    <div
                                        className={
                                            reduxLang === 'en_US'
                                                ? 'active'
                                                : ''
                                        }
                                        onClick={() => {
                                            onClose();
                                        }}
                                    >
                                        English
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="zh_HK">
                                    <div
                                        className={
                                            reduxLang === 'zh_HK'
                                                ? 'active'
                                                : ''
                                        }
                                        onClick={() => {
                                            onClose();
                                        }}
                                    >
                                        繁体中文
                                    </div>
                                </Menu.Item>
                            </Menu>
                        </Modal>
                    )}

                    {!below768 ? (
                        <div className="nav-Wallet-account">
                            <Dropdown
                                overlay={
                                    <Menu onClick={handleClick}>
                                        <Menu.Item key="en_US">
                                            <div
                                                className={
                                                    reduxLang === 'en_US'
                                                        ? 'active'
                                                        : ''
                                                }
                                            >
                                                English
                                            </div>
                                        </Menu.Item>
                                        <Menu.Item key="zh_HK">
                                            <div
                                                className={
                                                    reduxLang === 'zh_HK'
                                                        ? 'active'
                                                        : ''
                                                }
                                            >
                                                繁体中文
                                            </div>
                                        </Menu.Item>
                                    </Menu>
                                }
                            >
                                <div className="switch-lan">
                                    Language
                                    <div></div>
                                </div>
                            </Dropdown>

                            <IsUnlockWallet ButClassNmae="account">
                                <span className="account">
                                    <img
                                        src={walletIcon as any}
                                        alt="OpenDefi"
                                    />
                                    {Tools.substringTx(account || '...') ||
                                        '...'}
                                </span>

                                {/* <Typography.Paragraph
                                    copyable
                                    icon={null}
                                    text={account}
                                >
                                    <span className="account">
                                        <img
                                            src={walletIcon as any}
                                            alt="OpenDefi"
                                        />
                                        {Tools.substringTx(account || '...') ||
                                            '...'}
                                    </span>
                                </Typography.Paragraph> */}
                            </IsUnlockWallet>
                        </div>
                    ) : (
                        <div
                            className="mobile-menu-icon"
                            onClick={() => showDrawer()}
                        >
                            <img src={Menuicon as any} alt="" />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default connect()(PageHeader);
