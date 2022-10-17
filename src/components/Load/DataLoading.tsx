import React from 'react';
import './loading.scss';
import decreditLogoLight from '../../assets/light/Fixed-Swap-Aution-banner.png';
import decreditLogoDark from '../../assets/dark/Fixed-Swap-Aution-banner.png';
import { useSelector, shallowEqual } from 'react-redux';

const DataLoading = () => {
    const reduxLightDark = useSelector(
        (state: any) => state.lightDarkManag.lightDark,
        shallowEqual
    );
    return (
        <div className="get-data-loaing">
            <div className="loading">
                <div className="decredit-logo">
                    {reduxLightDark === 'light' ? (
                        <img src={decreditLogoLight as any} alt="OpenDefi" />
                    ) : (
                        <img src={decreditLogoDark as any} alt="OpenDefi" />
                    )}
                </div>
                <p> Loading...</p>
            </div>
        </div>
    );
};

export default DataLoading;
