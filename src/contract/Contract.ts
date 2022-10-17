import Web3 from 'web3';
import { provider } from '../config';
const web3: any = window && (window as any).web3;

const Contract =
    typeof web3 !== 'undefined'
        ? new Web3(web3.currentProvider)
        : new Web3(new Web3.providers.HttpProvider(provider));

export default Contract;
