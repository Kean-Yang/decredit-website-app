/**
 * 左侧菜单
 * @author
 * @create
 */

import Twiiter from '../assets/socials/twiiter.svg';
// import Discord from '../assets/socials/discord.svg';
import Medium from '../assets/socials/Medium.svg';
import Telegram from '../assets/socials/telegram.svg';
// import RedditPofile from '../assets/socials/Vector.svg';

import TwiiterMobile from '../assets/mobile/Twitter.svg';
// import Discord from '../assets/socials/discord.svg';
import MediumMobile from '../assets/mobile/Medium.svg';
import TelegramMobile from '../assets/mobile/Telegram.svg';
// import RedditPofile from '../assets/socials/Vector.svg';

// import marketsMobile from '../assets/mobile/markets.svg';
import dashboardMobile from '../assets/mobile/dashboard.svg';
import stakeMobile from '../assets/mobile/stake.svg';
// import RedditPofile from '../assets/socials/Vector.svg';

import {
    DD_TWITTER_URL,
    // DD_DISCORD_URL,
    DD_MEDIUM_URL,
    DD_T_ME_URL,
    // REDDIT_POFILE,
} from '../constants';

export interface RouteType {
    name: string;
    url: string;
    icon: any;
    key?: string;
    target?: boolean;
    childPages?: any;
    childrenName?: any;
}

// 导航
const AppMenu: RouteType[] = [
    // {
    //     name: 'Markets',
    //     url: '/markets',
    //     icon: '',
    //     key: 'Markets',
    //     target: false,
    //     childPages: '',
    //     childrenName: '',
    // },
    {
        name: 'Dashboard',
        url: '/dashboard',
        icon: '',
        key: 'dashboard',
        target: false,
        childPages: '',
        childrenName: '',
    },
    {
        name: 'Stake',
        url: '/stake',
        icon: '',
        key: 'Stake',
        target: false,
        childPages: '/stake/ranklist',
        childrenName: 'RankList',
    },
];

const AppMenuMobile: RouteType[] = [
    // {
    //     name: 'Markets',
    //     url: '/markets',
    //     icon: marketsMobile,
    //     key: 'Markets',
    //     target: false,
    //     childPages: '',
    //     childrenName: '',
    // },
    {
        name: 'Dashboard',
        url: '/dashboard',
        icon: dashboardMobile,
        key: 'dashboard',
        target: false,
        childPages: '',
        childrenName: '',
    },
    {
        name: 'Stake',
        url: '/stake',
        icon: stakeMobile,
        key: 'Stake',
        target: false,
        childPages: '',
        childrenName: '',
    },
];

const AppMenuSocial: RouteType[] = [
    {
        name: 'Telegram',
        url: DD_T_ME_URL,
        icon: Telegram,
        key: 'Telegram',
        target: false,
        childrenName: '',
    },
    {
        name: 'Twiiter',
        url: DD_TWITTER_URL,
        icon: Twiiter,
        key: 'Twiiter',
        target: false,
        childrenName: '',
    },
    // {
    //     name: 'Discord',
    //     url: DD_DISCORD_URL,
    //     icon: Discord,
    //     key: 'Discord',
    //     target: false,
    //     childrenName: '',
    // },
    {
        name: 'Medium',
        url: DD_MEDIUM_URL,
        icon: Medium,
        key: 'Medium',
        target: false,
        childrenName: '',
    },
    // {
    //     name: 'Reddit pofile',
    //     url: REDDIT_POFILE,
    //     icon: RedditPofile,
    //     key: 'Reddit pofile',
    //     target: false,
    //     childrenName: '',
    // },
];

const AppMenuMobileSocial: RouteType[] = [
    {
        name: 'Telegram',
        url: DD_T_ME_URL,
        icon: TelegramMobile,
        key: 'Telegram',
        target: false,
        childrenName: '',
    },
    {
        name: 'Twiiter',
        url: DD_TWITTER_URL,
        icon: TwiiterMobile,
        key: 'Twiiter',
        target: false,
        childrenName: '',
    },
    // {
    //     name: 'Discord',
    //     url: DD_DISCORD_URL,
    //     icon: Discord,
    //     key: 'Discord',
    //     target: false,
    //     childrenName: '',
    // },
    {
        name: 'Medium',
        url: DD_MEDIUM_URL,
        icon: MediumMobile,
        key: 'Medium',
        target: false,
        childrenName: '',
    },
    // {
    //     name: 'Reddit pofile',
    //     url: REDDIT_POFILE,
    //     icon: RedditPofile,
    //     key: 'Reddit pofile',
    //     target: false,
    //     childrenName: '',
    // },
];

export { AppMenu, AppMenuMobile, AppMenuSocial, AppMenuMobileSocial };
