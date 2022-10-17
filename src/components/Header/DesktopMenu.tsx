import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { AppMenu } from '../../Layout/app.menu';
import './index.scss';

const DesktopMenu = () => {
    const { t } = useTranslation();
    const location = useLocation();

    return (
        <div>
            {AppMenu.map((item, index) => {
                return (
                    <Link
                        to={item.url}
                        key={`${item.key} ${index}`}
                        className={
                            [`${item.url}`].includes(location.pathname) ||
                            [`${item.childPages}`].includes(location.pathname)
                                ? 'active'
                                : ''
                        }
                    >
                        <p>{t(`${item.name} `) || ''}</p>
                    </Link>
                );
            })}
        </div>
    );
};

export default DesktopMenu;
