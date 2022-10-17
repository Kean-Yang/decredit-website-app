import zhCN from 'antd/lib/locale-provider/zh_CN';
import zhHK from 'antd/lib/locale-provider/zh_HK';
import enUS from 'antd/lib/locale-provider/en_US';
import koKR from 'antd/lib/locale-provider/ko_KR';
import viVN from 'antd/lib/locale-provider/vi_VN';

import { getLang } from './LangUtil';

// export const messageList: any = {
//     antd: {
//         'zh-HK': zhHK,
//         'en-US': enUS,
//         'zh-CN': zhCN,
//         'ko-KR': koKR,
//         'vi-VN': viVN,
//     },
// };

export const messageList: any = (lang: string) => {
    switch (lang) {
        case 'zh_HK':
            return zhHK;
        case 'en_US':
            return enUS;
        case 'zh_CN':
            return zhCN;
        case 'ko_KR':
            return koKR;
        case 'vi_VN':
            return viVN;
        default:
            return enUS;
    }
};

export const I18nMessage: any = messageList(getLang());
