import React from 'react';
import { Drawer } from 'antd';
import { AppMenu } from '../../Layout/app.menu';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import MenuConfiguration from '../MenuConfiguration';
import { useMedia } from 'react-use';
import './index.scss';

interface DataProps {
    visible?: false | true; // 弹窗状态
    toggle: (val: any) => any; // 选中
}

const PageMenu = ({ visible = false, toggle = () => {} }: DataProps) => {
    const { t } = useTranslation();
    const location = useLocation();
    const below768 = useMedia('(max-width: 768px)');

    return (
        <div className="page-Menu">
            <Drawer
                title={null}
                placement={below768 ? 'top' : 'left'}
                className="sider-Menu"
                closable={false}
                getContainer={false}
                height="auto"
                width={below768 ? '100%' : '200px'}
                visible={visible}
                mask={below768 ? true : false}
                onClose={() => {
                    if (below768) {
                        toggle(false);
                    } else {
                        return;
                    }
                }}
            >
                <div>
                    {AppMenu &&
                        AppMenu.map((item: any, index: number) => {
                            return (
                                <Link
                                    to={item.url}
                                    key={`${index}${item.key}`}
                                    onClick={() => {
                                        if (below768) {
                                            toggle(!visible);
                                        } else {
                                            return;
                                        }
                                    }}
                                >
                                    <div
                                        className={
                                            [`${item.url}`].includes(
                                                location.pathname
                                            ) ||
                                            [`${item.childrenUrl}`].includes(
                                                location.pathname
                                            )
                                                ? 'active menu-item'
                                                : 'menu-item'
                                        }
                                    >
                                        <img
                                            style={{
                                                width: '16px',
                                                display: 'inline-flex',
                                            }}
                                            src={item.icon}
                                            alt="OpenDefi"
                                        />
                                        <span> {t(`${item.name}`)}</span>
                                    </div>
                                </Link>
                            );
                        })}
                </div>
                {/* <MenuConfiguration
                    visible={visible}
                    toggle={(val: any) => {
                        toggle(val);
                    }}
                /> */}
            </Drawer>
        </div>
    );
};

export default PageMenu;
