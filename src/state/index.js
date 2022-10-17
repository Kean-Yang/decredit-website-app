import React from 'react';

const AppContext = React.createContext({
    walletVisible: false,
    toggleWalletVisible: () => { },
    web3Instance: null,
    togglePLR: () => { },
});

export default AppContext;
