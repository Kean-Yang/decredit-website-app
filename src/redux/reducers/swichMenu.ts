export const inOpne = { type: 'open', openClos: 'open' };
export const inclos = { type: 'clos', openClos: 'clos' };

const initOpenClos = {
    openClos: 'clos',
};

export const openClosManag = (state: any = initOpenClos, action: any) => {
    switch (action.type) {
        case 'open':
            return inOpne;
        case 'dark':
            return inclos;
        default:
            return state;
    }
};

export const mapStateOpenClos = (state: any) => {
    return {
        openClos: state.openClosManag.openClos,
    };
};

// export const mapDispatchOpenClos = (dispatch: any) => ({
//     increment: () => dispatch(inOpne),
//     decrement: () => dispatch(inclos)
// });
