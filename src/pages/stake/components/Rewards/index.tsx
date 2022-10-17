import React from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { Token_icon } from '../../../../constants';
import { INIT_SYMBOL } from '../../../../config';
import Subtract from '../../../../assets/com/subtract.png';
import rewardsIcon from '../../../../assets/rewards-icon.png';
import './index.scss';

interface DataProps {
    visible?: false | true; // 弹窗状态
    earned?: number; // 弹窗状态
    symbol?: string; // 弹窗状态
    close: () => any; // 关闭弹窗
}

const Rewards = ({
    visible = false,
    earned = 0,
    symbol = '',
    close = () => {},
}: DataProps) => {
    const { t } = useTranslation();

    return (
        <Modal
            footer={null}
            title={null}
            visible={visible}
            centered
            closable={false}
            className="rewards-modal"
            keyboard
            mask
            width={430}
            maskClosable
            zIndex={999}
        >
            <div className="rewards">
                <div className="rewards-title">
                    <img
                        src={`${Token_icon}${symbol}.png`}
                        onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = Subtract;
                        }}
                        alt="OpenDefi"
                    />
                </div>
                <div className="rewards-content">
                    <div className="content-title">
                        <p> {t('ConfirmTransaction')}</p>
                    </div>
                    <div className="content">
                        <img src={rewardsIcon as any} alt="OpenDefi" />
                        <p className="desc">{t('ReceivedStake')}</p>
                        <p className="rewards-amount">
                            {t('Rewards_x', { x: earned, x1: INIT_SYMBOL })}
                        </p>
                    </div>
                    <Button type="text" onClick={close} className="back">
                        {t('ok')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default Rewards;
