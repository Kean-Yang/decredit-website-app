import { HttpRequestAxios } from '../utils/HttpRequestAxios';

/**
 * 查询抵押率
 * @param address 用户地址
 */
export const ApiCreditOracles = (address: any) => {
    return HttpRequestAxios.get(`/creditOracle/query?address=${address}`).then(
        (res: any) => res.data
    );
};

/**
 * 传⼊分值,修改抵押率
 * @param address 用户地址
 * @param score 用户评分
 */
export const ApiCreditOraclesUpdate = (address: any, score: number) => {
    return HttpRequestAxios.post(`/creditOracle/update`, {
        address: address,
        credit_score: score,
    }).then((res: any) => res.data);
};

/**
 * 查询分数
 * @param address 用户地址
 */
export const ApiGetQueryScore = (address: any) => {
    return HttpRequestAxios.get(
        `/creditOracle/queryScore?address=${address}`
    ).then((res: any) => res.data);
};

/**
 *  用户认证
 * @param params 表单数据
 */
export const ApiCreditOraclesAddInfo = (params: any) => {
    return HttpRequestAxios.post(`/creditOracle/addInfo`, params).then(
        (res: any) => res.data
    );
};

/**
 *  获取质押量排行榜
 * @param
 */
export const ApiGetRankList = () => {
    return HttpRequestAxios.get(`/creditOracle/rankMortgage`).then(
        (res: any) => res.data
    );
};
