import { createStore, combineReducers } from 'redux';
import { lightDarkManag } from './reducers/switchLightDark';
import { openClosManag } from './reducers/swichMenu';
import { userBalanceManag } from './reducers/userbalance';
import { languageManag } from './reducers/switchLanguage';

const rootReducers = combineReducers({
    lightDarkManag,
    openClosManag,
    userBalanceManag,
    languageManag,
});
// 全局就管理一个store
export const store = createStore(rootReducers);
