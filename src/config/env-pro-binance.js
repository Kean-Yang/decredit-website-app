// 币安生产环境
export const DEFAULT_CURRENT_PRICE = 10;
export const TIMEOUT = 200000;
// contract
export const CHAINID = 56;
export const blocks = 3; // CDTC 出块时间
export const Native_Token = 'BNB';
export const INIT_SYMBOL = 'CDTC';
export const EXECUTION_TIME = 10000;
export const BSAE_API_URL = 'https://app.decredit.io/';
export const MetaMask_CONF_URL =
    'https://bsc-dataseed.binance.org';

export const blacsBrowser =
    'https://bscscan.com/tx/';

export const blacsBrowserPoll =
    'https://bscscan.com/address/';

export const Multicall_contracts = "0xC50F4c1E81c873B2204D7eFf7069Ffec6Fbe136D"

// contract address

export const DCConfigAddress = '0xfb9f8C31985792b8F64a8e906DB43b208440f329';
export const CreditOracleAddress = '0x651a5dD386A766Bc7BCCd2e14Aedaef550123537'; //// 抵押率合约
export const ChainLinkPriceOracle = '0x87C95A430620c822dFF9f1d3676559Ddd49Da255';
export const CompoundLens = '0xAF69eDe7f9855dc0a2F07935D7B97Aa83E5F0fD4';
export const Maximillion = '0x623D304a81CB23Df02C0f33a0fa46F25259f625c';

export const InterestRateModel = '0x56D577516C4546593D3e8D29D71cBdD73AE77BAE';

export const DCtrollerAddress = '0x3b1dD467c50fF62E1061aD832649d62B9A946209';

export const BNBAddress = '0x5Ac50C5A1612CE7f7B78B0a369c2701e17C9af17'; // DBNB Token address
export const USDTAddress = '0xBF586363eA34AE1A7C4F84BC5542692aE0Fe77dA'; // DUSDT Token address

export const DUSDTAddress = '0x55d398326f99059ff775485246999027b3197955'; // usdt Token address
export const dETHAddress = '0x370B505d4AE4398AdC75a7413Ace6c1B6Dc8c65a'; // DETH Token address
export const ETHAddress = '0x2170ed0880ac9a755fd29b2688956bd959f933f8'; // ETH Token address
export const dBTCBAddress = '0x100D51466D725D2B3320b6076c632e143BCF31C4'; // dBTCB Token address
export const BTCBAddress = '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c'; // BTCB Token address
export const dBUSDAddress = '0x81c2819FB01ffF17e2fF03Aa8a881B859befa682'; // dBUSD Token address
export const BUSDAddress = '0xe9e7cea3dedca5984780bafc599bd69add087d56'; // BUSD Token address


// 质押合约
export const StakingPoolAddress = '0xCcfbe7f7060A5870106500d7Be597268F3b57809';
export const HighYieldPoolAddress = '0x737671B4d5D655e3cdBFaB329dbc61a836fD8D07'; // 质押二池
export const HighYieldPoolAddress2 = '0xcD33755eA7b81C60Dd3d07CFf2C7dB2841a7e98b'; // 质押三池
// 空投合约
export const AirDropPoolAddress = '0x9f80bB747999B2DbEe15bBbB2AFe74c266Ecd142';
export const DTCTAddress = '0x0fAf802036E30B4b58a20C359012821152872397'; // cdtc 地址

// bitart api接口地址 
export const BitMartApi = 'https://api-cloud.bitmart.com'

// pancake获取币种价格
export const uniswapContractAddress = '0xE348704E3b25EF29eAb5807b9C191b57fB4ecfb8'


// 已经支持的币种
export const SymbolListAddress = [USDTAddress, BNBAddress, dETHAddress, dBTCBAddress, dBUSDAddress];
export const SymbolConfig = [
    {
        symbol: 'USDT',
        address: USDTAddress,
        decimals: 18,
    },
    {
        symbol: 'BNB',
        address: BNBAddress,
        decimals: 18,
    },
    {
        symbol: 'ETH',
        address: dETHAddress,
        decimals: 18,
    },
    {
        symbol: 'BTC',
        address: dBTCBAddress,
        decimals: 18,
    },
    {
        symbol: 'BUSD',
        address: dBUSDAddress,
        decimals: 18,
    },
];