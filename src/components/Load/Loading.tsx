import React from 'react';
import './loading.scss';

const Loading = () => {
    return (
        <div className="page-loading">
            <div className="spinner">
                <div className="dot1"></div>
                <div className="dot2"></div>
            </div>
        </div>
    );
};

export default Loading;
