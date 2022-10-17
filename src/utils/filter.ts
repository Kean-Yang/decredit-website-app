/**
 * 质押
 * @param
 */
import { SymbolListAddress, SymbolConfig } from '../config';

// 过滤币种名称
export const filterSymbol = (address: string) => {
    const activeSymbol = SymbolConfig.find(
        (value: any) => value.address === address
    );
    return activeSymbol && activeSymbol.symbol;
};

// 过滤显示已支持的币种
export const filterSymbolListAddress = (addressList: string) => {
    let list = SymbolListAddress.filter(
        (item: any) => addressList.indexOf(item) > -1
    );
    return list;
};
