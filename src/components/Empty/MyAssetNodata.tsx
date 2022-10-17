import React from 'react';
import { useTranslation } from 'react-i18next';
import MyAssetNodataIcon from '../../assets/my_asset_nodata.svg';
import './Empty.scss';

const MyAssetNodata = () => {
    const { t } = useTranslation();

    return (
        <div className="my-asset-nodata">
            <img src={MyAssetNodataIcon as any} alt="OpenDefi" />
            <p>{t('borrowedYet')}</p>
        </div>
    );
};

export default MyAssetNodata;
