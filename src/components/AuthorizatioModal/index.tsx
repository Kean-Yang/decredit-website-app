import React, { useEffect, useState } from 'react';
import AuthorizatioStart from './AuthorizatioStart';
import AuthorizatioSucces from './AuthorizatioSucces';
import AuthorizatioFailed from './AuthorizatioFailed';
import AuthorizatioPending from './AuthorizatioPending';

interface DataProps {
    state?: any;
    butLoading?: boolean;
    approve?: any;
    hash?: string;
    close?: any;
}

const AuthorizatioModal = ({
    state = null,
    butLoading = false,
    approve = () => {},
    hash = '',
    close = () => {},
}: DataProps) => {
    const [visibleApprove, setVisibleApprove] = useState(false);
    const [visibleFailed, setVisibleFailed] = useState(false);
    const [visiblePending, setVisiblePending] = useState(false);
    const [visibleSucces, setVisibleSucces] = useState(false);

    useEffect(() => {
        switch (state) {
            case 'approve':
                setVisibleApprove(true);
                break;
            case 'failed':
                setVisiblePending(false);
                setVisibleFailed(true);
                break;
            case 'pending':
                setVisiblePending(true);
                break;
            case 'succes':
                setVisiblePending(false);
                setVisibleSucces(true);
                break;
            default:
                setVisiblePending(false);
        }
    }, [state]);

    return (
        <>
            {state && state === 'approve' ? (
                <AuthorizatioStart
                    butLoading={butLoading}
                    close={() => {
                        close();
                    }}
                    approve={approve}
                    visible={visibleApprove}
                />
            ) : state && state === 'failed' ? (
                <AuthorizatioFailed
                    close={() => {
                        setVisibleFailed(false);
                    }}
                    hash={hash}
                    visible={visibleFailed}
                />
            ) : state && state === 'pending' ? (
                <AuthorizatioPending
                    close={() => {
                        setVisiblePending(false);
                    }}
                    hash={hash}
                    visible={visiblePending}
                />
            ) : state && state === 'succes' ? (
                <AuthorizatioSucces
                    close={() => {
                        setVisibleSucces(false);
                    }}
                    hash={hash}
                    visible={visibleSucces}
                />
            ) : (
                ''
            )}
        </>
    );
};

export default AuthorizatioModal;
