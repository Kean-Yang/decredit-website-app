import React from 'react';
import CollateralGuan from '../../../assets/collateral_guan.svg';
import CollateralOpen from '../../../assets/collateral_open.svg';
import './SwitchBox.scss';

interface DataProps {
    state?: boolean;
    // open?: boolean;
    // guan?: boolean;
}

const SwitchBox = ({
    state = false,
}: // open = false,
// guan = false,
DataProps) => {
    return (
        <div className="switch-box">
            {/* <label
                // htmlFor={!state ? 'default' : open ? 'guan' : 'open'}
                id="guan"
                htmlFor="guan"
                className={!state ? 'switch-box-left' : 'switch-box-right'}
            ></label> */}

            {state ? (
                <img src={CollateralOpen as any} alt="OpenDefi" />
            ) : (
                <img src={CollateralGuan as any} alt="OpenDefi" />
            )}
        </div>
    );
};

export default SwitchBox;
