// import { getChainId } from "../utils/localStorage";
const defaultNetwork = 'binance';
// const getNetwork = () => {
//     switch (getChainId()) {
//         case '1':
//             return 'etherscan';
//         case '128':
//             return 'hecochain';
//         case '97':
//             return 'testnet_binance';
//         case '56':
//             return 'binance';
//         case '256':
//             return 'testnet_hecochain';
//         default:
//             return defaultNetwork;
//     }
// }

// 当前打包环境
const buildEnv = process.env.BUILD_ENV || defaultNetwork;

// 根据打包环境
let envConf = {};
switch (buildEnv) {
    case "etherscan":
        envConf = require('./env-pro-etherscan');
        break;
    case 'hecochain':
        envConf = require('./env-pro-hecochain');
        break;
    case "binance":
        envConf = require('./env-pro-binance');
        break;
    case "testnet_binance":
        envConf = require('./env-test-binance');
        break;
    case "testnet_hecochain":
        envConf = require('./env-test-huobi');
        break;
    default:
        envConf = require('./env-pro-binance');
        break;
}

export { buildEnv }; // 当前网络环境
export const CHAINID = envConf.CHAINID; // 钱包id
export const Native_Token = envConf.Native_Token;
export const INIT_SYMBOL = envConf.INIT_SYMBOL; // 默认UDDT
export const BSAE_API_URL = envConf.BSAE_API_URL; //api 地址
export const provider = envConf.MetaMask_CONF_URL; // MetaMask rpc网络地址

export const blacsBrowser = envConf.blacsBrowser; // 浏览器地址
export const blacsBrowserPoll = envConf.blacsBrowserPoll; // 合约浏览器地址
export const Multicall_contracts = envConf.Multicall_contracts; // Multicall contracts


export const DCConfigAddress = envConf.DCConfigAddress || ""; // 
export const CreditOracleAddress = envConf.CreditOracleAddress || ""; //
export const ChainLinkPriceOracle = envConf.ChainLinkPriceOracle || ""; //
export const CompoundLens = envConf.CompoundLens || ""; //
export const Maximillion = envConf.Maximillion || ""; //
export const InterestRateModel = envConf.InterestRateModel || ""; //

export const BNBAddress = envConf.BNBAddress || ""; //
export const DCtrollerAddress = envConf.DCtrollerAddress || ""; // 

// ERC20 USDT 地址
export const USDTAddress = envConf.USDTAddress || ""; //
// 质押合约地址
export const StakingPoolAddress = envConf.StakingPoolAddress || ""; //
export const HighYieldPoolAddress = envConf.HighYieldPoolAddress || ""; //
export const HighYieldPoolAddress2 = envConf.HighYieldPoolAddress2 || ""; //

// 空投合约地址
export const AirDropPoolAddress = envConf.AirDropPoolAddress || ""; //
// 质押池合约地址
export const stakePollAddress = envConf.stakePollAddress || ""; //

export const SymbolListAddress = envConf.SymbolListAddress || ""; //
export const DTCTAddress = envConf.DTCTAddress || ""; //
export const blocks = envConf.blocks || ""; //
export const SymbolConfig = envConf.SymbolConfig || ""; //

export const BitMartApi = envConf.BitMartApi || ""; //
export const uniswapContractAddress = envConf.uniswapContractAddress || ""; //
