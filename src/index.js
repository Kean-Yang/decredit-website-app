import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { UseWalletProvider } from 'use-wallet';
import './i18n/I18n';
import './index.scss';
import './styles/styles.scss';
import { CHAINID } from './config';
import { store } from './redux/store';

ReactDOM.render(
    <Provider store={store}>
        <UseWalletProvider chainId={CHAINID}>
            <App />
        </UseWalletProvider>
    </Provider>,
    document.getElementById('root')
);
reportWebVitals();
