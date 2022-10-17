export const zh_HK = { type: 'zh_HK', language: '繁体中文' };
export const en_US = { type: 'en_US', language: 'English' };
export const zh_CN = { type: 'zh_CN', language: '中文' };
export const ko_KR = { type: 'ko_KR', language: '한국어' };
export const vi_VN = { type: 'vi_VN', language: 'Tiếng Việt' };

const initLanguage = {
    language: 'en_US',
};

export const languageManag = (state: any = initLanguage, action: any) => {
    switch (action.type) {
        case 'zh_HK':
            return zh_HK;
        case 'en_US':
            return en_US;
        case 'zh_CN':
            return zh_CN;
        case 'ko_KR':
            return ko_KR;
        case 'vi_VN':
            return vi_VN;
        default:
            return state;
    }
};

export const mapStateToProps = (state: any) => {
    return {
        language: state.languageManag.type,
    };
};

export const mapDispatchToProps = (dispatch: any) => ({
    zh_HK: () => dispatch(zh_HK),
    en_US: () => dispatch(en_US),
    zh_CN: () => dispatch(zh_CN),
    ko_KR: () => dispatch(ko_KR),
    vi_VN: () => dispatch(vi_VN),
});
