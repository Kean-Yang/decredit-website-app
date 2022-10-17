/*
 * @Description:
 * @Author:
 * @Date:
 * @LastEditTime:
 * @LastEditors:
 */
import { sendTransaction } from '../contract/EthereumRequest';

// 发送交易
export async function contractTransaction (
    account,
    txs,
    pendding,
    resFun,
    errFun,
    transaction = false,
    cancelFun = () => { }
) {
    const val = txs.value !== '' ? `0x${Number(txs.value).toString(16)}` : "";
    console.log(val, `0x${txs.value.toString(16)}`)
    const txnParams = {
        from: account,
        to: txs.contract || '',
        value: val || '',
        data: txs.calldata || '',
    };
    // console.log(transaction)
    sendTransaction(txnParams, pendding, resFun, errFun, transaction, cancelFun)
        .catch((err) => {
            console.log('发生错误！', err);
            errFun();
            return false;
        });
}

