import { provider, CHAINID } from '../config';


// 切换网络
export const SwitchNetworkRequest = async (networkId: any, connect: () => any) => {
    // @ts-ignore
    const ethereum = window && (window as any).ethereum;
    if (networkId !== ethereum.chainId) {
        await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: `0x${CHAINID.toString(16)}`,
                    chainName: 'Binance Smart Chain',
                    nativeCurrency: {
                        name: 'BNB',
                        symbol: 'bnb',
                        decimals: 18,
                    },
                    rpcUrls: [provider],
                    // rpcUrls: ['https://bsc-dataseed.binance.org'],
                    blockExplorerUrls: ['https://bscscan.com/'],
                },
            ],
        });
    } else {
        connect();
    }
};


