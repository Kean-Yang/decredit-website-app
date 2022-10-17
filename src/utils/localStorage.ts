import { buildEnv, CHAINID } from "../config";



// 切换网络
export const switchNetwork = (network: any) => {
    window.localStorage.setItem('network', network || buildEnv);
};

// 获取当前网络
export const getNetwork = () => {
    return window.localStorage.getItem('network') || buildEnv;
};


// 切换网络
export const switchChainId = (chainId: any) => {
    window.localStorage.setItem('chainId', chainId || CHAINID || '');
};

// 获取当前网络
export const getChainId = () => {
    return window.localStorage.getItem('chainId') || '';
};


// 切换黑白夜模式
export const switchLightDark = (version: any) => {
    window.localStorage.setItem('lightdark', version || "light");
};

// 获取黑白夜
export const getLightDark = () => {
    return window.localStorage.getItem('lightdark') || 'light';
};



// 用户余额
export const switchUserBalance = (balance: any) => {
    window.localStorage.setItem('user', balance || 0);
};

// 获取用户余额
export const getUserBalance = () => {
    return window.localStorage.getItem('user') || 0;
};

