import React, { useState } from 'react';
import { AppMenuSocial } from '../../Layout/app.menu';
import { Switch } from 'antd';
import { switchLightDark, getLightDark } from '../../utils/localStorage';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
    incrementAction,
    reduceAction,
} from '../../redux/reducers/switchLightDark';

import { switchLanguage, getLang } from '../../i18n/LangUtil';
import './index.scss';

interface DataProps {
    visible?: false | true; // 弹窗状态
    // toggle: () => any; // 取消
}

const MenuConfiguration = ({
    visible = false,
}: // toggle = () => {},
DataProps) => {
    const dispatch = useDispatch();
    const reduxLightDark = useSelector(
        (state: any) => state.lightDarkManag.lightDark,
        shallowEqual
    );

    const [lightDark, setLightDark] = useState(
        reduxLightDark || getLightDark()
    );

    const onChangeSwitchLightDark = (val: string) => {
        if (val) {
            dispatch(reduceAction);
        } else {
            dispatch(incrementAction);
        }
        setLightDark(lightDark === 'light' ? 'dark' : 'light');
        switchLightDark(lightDark === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="menu-configuration-operation">
            <div className="menu-operation">
                <div className="switch-lan">
                    <div className="switch-lan-icon"></div>
                    <span
                        onClick={() => {
                            switchLanguage('en_US');
                        }}
                        className={getLang() === 'en_US' ? 'active' : ''}
                    >
                        EN
                    </span>
                    &#8194;/&#8194;
                    <span
                        onClick={() => {
                            switchLanguage('zh_HK');
                        }}
                        className={getLang() === 'zh_CN' ? 'active' : ''}
                    >
                        CN
                    </span>
                </div>
                <div className="switch-lightDark" key={lightDark}>
                    <div className="switch-lightdark-icon"></div>
                    <Switch
                        defaultChecked={false}
                        size="small"
                        checked={lightDark !== 'light'}
                        onChange={onChangeSwitchLightDark}
                    />
                </div>
                <ul className="socials">
                    {AppMenuSocial &&
                        AppMenuSocial.map((item: any, index: any) => {
                            return (
                                <li key={index}>
                                    <a
                                        target="_blank"
                                        href={item.url || '/'}
                                        rel="noreferrer"
                                    >
                                        <div
                                            className={`social-icon-${index}`}
                                        ></div>
                                    </a>
                                </li>
                            );
                        })}
                </ul>
            </div>
        </div>
    );
};

export default MenuConfiguration;
