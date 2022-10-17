

export const incrementAction = { type: 'light', lightDark: 'light' };
export const reduceAction = { type: 'dark', lightDark: "dark" };

const initLightDark = {
    lightDark: 'light'
}

export const lightDarkManag = (state: any = initLightDark, action: any) => {
    switch (action.type) {
        case 'light':
            return incrementAction;
        case "dark":
            return reduceAction;
        default:
            return state;
    }
}


export const mapStateToProps = (state: any) => {
    return {
        lightDark: state.lightDarkManag.lightDark
    };
};

export const mapDispatchToProps = (dispatch: any) => ({
    increment: () => dispatch(incrementAction),
    decrement: () => dispatch(reduceAction)
});






