
export const etherscan = { type: '1', chainId: '1', env: 'etherscan' };
export const hecochain = { type: '128', chainId: '128', env: 'hecochain' };
export const binance = { type: '128', chainId: '128', env: 'binance' };
export const testnetBinance = { type: '97', chainId: '97', env: 'testnet_binance' };
export const testnetHecochain = { type: '256', chainId: '256', env: 'testnet_hecochain' };


export const incrementAction = { type: '256', chainId: '256' };
export const reduceAction = { type: '128', chainId: "128" };

const initVersion = {
    chainId: '256'
}

export const networkManag = (state: any = initVersion, action: any) => {
    switch (action.type) {
        case '256':
            return { type: '256', chainId: '256' };
        case "128":
            return { type: '128', chainId: "128" };
        default:
            return state;
    }
}


export const mapStateToProps = (state: any) => {
    return {
        chainId: state.lightDarkManag.chainId
    };
};

export const mapDispatchToProps = (dispatch: any) => ({
    increment: () => dispatch(incrementAction),
    decrement: () => dispatch(reduceAction)
});












