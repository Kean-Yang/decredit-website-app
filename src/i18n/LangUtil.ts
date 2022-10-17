import i18n from 'i18next';
import moment from 'moment';
// import LanguageDetector from 'i18next-browser-languagedetector'; // 浏览器默认语言

// 国际标准话名称转换
export const langList: any = {
    'zh-HK': { v: 'zh_HK', vb: 'zh_HK', t: '繁体中文' },
    'en-US': { v: 'en_US', vb: 'en', t: 'English' },
    'zh-CN': { v: 'zh_CN', vb: 'zh_CN', t: '中文' },
    'ko-KR': { v: 'ko_KR', vb: 'kr', t: '한국어' },
    'vi-VN': { v: 'vi_VN', vb: 'vi', t: 'Tiếng Việt' },
};

// 获取当前语种，设置默认语言
export const getLang = () => {
    const lang = window.localStorage.getItem('language') || 'en_US';
    return lang;
};

// 切换语言
export const switchLanguage = (lang: any) => {
    moment.locale(lang);
    window.localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
};

// 获取当前本地语言缩写
export const getBackLang = () => {
    const lang = getLang();
    return langList[lang].vb;
};
