// 币安测试环境
export const DEFAULT_CURRENT_PRICE = 7;
export const TIMEOUT = 200000;

// contract
export const CHAINID = 97;

export const Native_Token = 'BNB';
export const INIT_SYMBOL = 'CDTC';
export const blocks = 3;
export const BSAE_API_URL = 'https://test.delayer.io';
export const provider = 'https://data-seed-prebsc-2-s2.binance.org:8545';
export const MetaMask_CONF_URL =
    'https://data-seed-prebsc-2-s2.binance.org:8545';

export const blacsBrowser =
    'https://testnet.bscscan.com/tx/';

export const blacsBrowserPoll =
    'https://testnet.bscscan.com/address/';

export const Multicall_contracts = "0x83ABD561d9bad5c83d1329A08A6B2B13A1Efc506"
// contract address

export const DCConfigAddress = '0x7Fce1F12D9a5b738450b0b54F2c36d83D13164F1';
export const CreditOracleAddress = '0x46F27679e96CABEcb6d20A0332F6Aab19685E733'; //// 抵押率合约
export const ChainLinkPriceOracle = '0x16B182551518b671B293FA25548932230d7D229c';
export const CompoundLens = '0xF0559DD2ae41f5311DeA8b2BA407CF7A1E664D68';
export const Maximillion = '0xd1A0BDc045A6C74203b7F4519731bD20faF85a8a';
export const InterestRateModel = '0x56D577516C4546593D3e8D29D71cBdD73AE77BAE';

export const DCtrollerAddress = '0xaEAaC914DB01d729a890C876E3CB40F488D1057e';
export const BNBAddress = '0x2345C50D25c62514219D39C53234FEe24807a839'; // DBNB Token address
export const USDTAddress = '0x0B6b21393e0666880D59F45c15aa3F9D9605bE11'; // DUSDT Token address

export const ETHAddress = '0xd66c6b4f0be8ce5b39d52e0fd1344c389929b378';// ETH Token address
export const dETHAddress = '0xF0C7cFBdcC2ba663B261f6d613E68d518999B6FC'; // DETH Token address
export const BTCAddress = '0x6ce8da28e2f864420840cf74474eff5fd80e65b8';// BTC Token address
export const dBTCAddress = '0x9DC8B01428a4638EC19A03BEeD5EaB702A03654c'; // DBTC Token address
export const BUSDAddress = '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee';// BUSD Token address
export const dBUSDAddress = '0xd91F6487a4E16f3DA39e72e49B9e951aC0f56Eb7'; // DBUSD Token address

// 质押合约
export const StakingPoolAddress = '0x882358584b7Bbe83521CaFc02D2602AF22565E39';
export const HighYieldPoolAddress = '0x63D193b07B3Eb37a3c433a70a95C489594379c8A'; // 质押二池
export const HighYieldPoolAddress2 = '0xbb4EB2337AA0F8d84CDc259cA71d03803E06316A'; // 质押三池
// 空投合约
export const AirDropPoolAddress = '0xd274F9e2EBa0eEa7f4A58a44E9C89F53b1648516';
export const DTCTAddress = '0x90af3b1633e1db67cb72d8376de90d61747ae1d8';

// bitart api接口地址 
export const BitMartApi = 'https://api-cloud.bitmart.com'

// pancake获取币种价格
export const uniswapContractAddress = '0x78E6B6dF867E2278479497f7cd5b6Eb8c86D88d8'

// 已经支持的币种
export const SymbolListAddress = [USDTAddress, BNBAddress, dETHAddress, dBTCAddress, dBUSDAddress];
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
        address: dBTCAddress,
        decimals: 18,
    },
    {
        symbol: 'BUSD',
        address: dBUSDAddress,
        decimals: 18,
    },
];

