const initBalance = {
    balance: '0',
    type: 'user',
};

export const userBalanceManag = (state: any = initBalance, action: any) => {
    if (action.type === 'user') {
        return state;
    } else {
        return state;
    }
};

export const mapStateOpenClos = (state: any) => {
    return {
        balance: state.userBalance.balance,
    };
};

// export const mapDispatchOpenClos = (dispatch: any) => ({
//     increment: () => dispatch(inOpne),
//     // decrement: () => dispatch(inclos)
// });
