import Contract from './Contract';
import { BNBAddress, ChainLinkPriceOracle } from '../config';
// import * as Tools from '../utils/Tools';

const CEtherAddressAbi = require('./abi/CEther.json');
const PriceOracleAbi = require('./abi/PriceOracle.json');

/**
 * 当前价
 * @param
 */
export async function getUnderlyingPrice() {
    try {
        const contract = new Contract.eth.Contract(
            PriceOracleAbi,
            ChainLinkPriceOracle
        );
        const CEtherContract = new Contract.eth.Contract(
            CEtherAddressAbi,
            BNBAddress
        );

        const price = await contract.methods
            .getUnderlyingPrice(CEtherContract)
            .call();

        return price;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

/**
 * 市场列表
 * @param
 */
export async function GetAllMarkets(account: string) {
    try {
        // const contract = new Contract.eth.Contract(
        //     DCtrollerAbi,
        //     DCtrollerAddress
        // );
        // for (var i = 0; i < list.length; i++) {
        //     const listIndex = list[i];
        //     marketsList.push({
        //         index: i,
        //     });
        // }
        // console.log({
        //     marketsList: marketsList,
        // });
        // return marketsList;
    } catch (err) {
        console.log(err);
        return [];
    }
}
