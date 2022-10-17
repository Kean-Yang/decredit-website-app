import React from 'react';
import { Modal, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import ConnectWalletTitle from '../../assets/com/connect-wallet-title.png';
import './CustomModal.scss';

interface DataProps {
    visible?: false | true; // 弹窗状态
    title?: string;
    contentText?: string;
    butLoading?: false | true; // 弹窗状态
    butText?: string;
    butFun?: () => any;
    close: () => any; // 关闭弹窗
}

const CustomModal = ({
    visible = false,
    title = '',
    contentText = '',
    butLoading = false,
    butText = '',
    butFun = () => {},
    close = () => {},
}: DataProps) => {
    return (
        <Modal
            footer={null}
            title={null}
            visible={visible}
            centered
            closable={false}
            className="decredit-customModal"
            keyboard
            mask
            width={430}
            maskClosable
            zIndex={999}
        >
            <div className="customModal">
                <div className="wallet-title">
                    <img src={ConnectWalletTitle as any} alt="OpenDefi" />
                    <CloseOutlined
                        className="close"
                        twoToneColor="#FFFFFF"
                        onClick={close}
                    />
                </div>
                <div className="content">
                    <div className="content-title">
                        <p>{title}</p>
                    </div>
                    <div className="start-approve">{contentText}</div>
                    {butText && (
                        <Button
                            type="text"
                            onClick={butFun}
                            loading={butLoading}
                            className="back"
                        >
                            {butText}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default CustomModal;
