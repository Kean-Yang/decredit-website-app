import React, { useEffect, useState } from 'react';
import TransactionSucces from './TransactionSucces';
import TransactionFailed from './TransactionFailed';
import TransactionPending from './TransactionPending';

interface DataProps {
    state?: any;
    hash?: string;
}

const Results = ({ state = null, hash = '' }: DataProps) => {
    const [visibleFailed, setVisibleFailed] = useState(false);
    const [visiblePending, setVisiblePending] = useState(false);
    const [visibleSucces, setVisibleSucces] = useState(false);

    useEffect(() => {
        switch (state) {
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
            {state && state === 'failed' ? (
                <TransactionFailed
                    close={() => {
                        setVisibleFailed(false);
                    }}
                    hash={hash}
                    visible={visibleFailed}
                />
            ) : state && state === 'pending' ? (
                <TransactionPending
                    close={() => {
                        setVisiblePending(false);
                    }}
                    hash={hash}
                    visible={visiblePending}
                />
            ) : state && state === 'succes' ? (
                <TransactionSucces
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

export default Results;
