import web3 from 'web3';
// import * as Tools from '../utils/Tools';
import Contract from './Contract';

export async function GetUserBalance(account: any) {
    try {
        // return web3.utils.fromWei(await Contract.eth.getBalance(account));
    } catch (e) {
        console.log(e);
        return 0;
    }
}
