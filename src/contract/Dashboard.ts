import Web3 from 'web3';
import { message } from 'antd';
// import Contract from './Contract';
import { MultiCall } from 'eth-multicall';
// import CEtherAddressAbi from './abi/CEther.json';
import BigNumber from 'bignumber.js';
import {
    BNBAddress,
    DCtrollerAddress,
    ChainLinkPriceOracle,
    USDTAddress,
    blocks,
    CreditOracleAddress,
    Maximillion,
    Multicall_contracts,
    uniswapContractAddress,
} from '../config';
import * as Tools from '../utils/Tools';
import { filterSymbolListAddress, filterSymbol } from '../utils/filter';

const CErc20AddressAbi = require('./abi/CErc20.json');
const Erc20AddressAbi = require('./abi/ERC20.json');
const CEtherAddressAbi = require('./abi/CEther.json');
const DCtrollerAbi = require('./abi/Comptroller.json');
const PriceOracleAbi = require('./abi/PriceOracle.json');
const EIP20InterfaceAbi = require('./abi/EIP20Interface.json');
const CreditOracleAbi = require('./abi/CreditOracle.json');
const MaximillionAbi = require('./abi/Maximillion.json');
const uniswapContractABI = require('./abi/uniswapContractABI.json');

const maxApprovalNumber = Web3.utils.toWei(
    '99999999999999999999999999999999',
    'ether'
);

const maxApproval = new BigNumber(2).pow(256).minus(1).toString(10);
/**
 * 当前价
 * @param
 */
export async function getUnderlyingPrice(ethereum: any) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            PriceOracleAbi,
            ChainLinkPriceOracle
        );
        const CEtherContract = new web3connector.eth.Contract(
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
 * 转化率
 * @param
 */
export async function exchangeRateCurrent(ethereum: any) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            CEtherAddressAbi,
            USDTAddress
        );
        const exchangeRateCurrent = await contract.methods
            .exchangeRateCurrent()
            .call();

        console.log(exchangeRateCurrent);

        return Tools.numDivDecimals(exchangeRateCurrent, 18);
    } catch (err) {
        console.log(err);
        return 0;
    }
}

/**
 * 总供应量
 * @param
 */
export async function ContractTotalSupply(ethereum: any) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            CEtherAddressAbi,
            USDTAddress
        );
        const totalSupply = Tools.numDivDecimals(
            await contract.methods.totalSupply().call(),
            18
        );

        const exchangeRateCurrent = await contract.methods
            .exchangeRateCurrent()
            .call();
        const exchangeRate = Tools.numDivDecimals(exchangeRateCurrent, 18);

        // const USDTPrice = Tools.numDivDecimals(await GetUSDTPrice(), 18);

        return await switchUSDTPrice(
            ethereum,
            Number(totalSupply || 1) * Number(exchangeRate || 1),
            18,
            ''
        );
    } catch (err) {
        console.log(err);
        return 0;
    }
}

/**
 * 总借款
 * @param
 */
export async function ContractTotalBorrowsCurrent(ethereum: any) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            CEtherAddressAbi,
            USDTAddress
        );
        const borrows = Tools.numDivDecimals(
            await contract.methods.totalBorrowsCurrent().call(),
            18
        );
        return Tools.fmtDec(
            await switchUSDTPrice(ethereum, Number(borrows), 18, ''),
            6
        );
    } catch (err) {
        console.log(err);
        return 0;
    }
}

/**
 * 借款利率
 * @param
 */
export async function ContractBorrowRatePerBlock(ethereum: any) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            CEtherAddressAbi,
            BNBAddress
        );
        const borrowRate = await contract.methods.borrowRatePerBlock().call();
        return Tools.numDivDecimals(borrowRate, 18);
    } catch (err) {
        console.log(err);
        return 0;
    }
}

/**
 * 授权
 * @param
 */
export async function IsAllowance(
    ethereum: any,
    Account: any,
    underlying: any,
    Address: any
) {
    try {
        const web3connector = new Web3(ethereum);
        const Erc20Contract = new web3connector.eth.Contract(
            Erc20AddressAbi,
            underlying
        );

        console.log(Address,underlying)
        return await Erc20Contract.methods.allowance(Account, Address).call();
    } catch (err) {
        console.log(err);
        return 0;
    }
}

/**
 * 授权
 * @param
 */
export async function ContractApprove(
    ethereum: any,
    Account: any,
    underlying: any,
    Address: any,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        console.log(underlying,Address)
        const web3connector = new Web3(ethereum);
        const Erc20Contract = new web3connector.eth.Contract(
            Erc20AddressAbi,
            underlying
        );
        return await Erc20Contract.methods
            .approve(Address, maxApprovalNumber)
            .send({
                from: Account,
            })
            .on('transactionHash', (transactionHash: any) => {
                penddingCallbackFun(transactionHash);
            })
            .on('receipt', (receipt: any) => {
                successCallbackFun();
            })
            .on('error', (error: any) => {
                switch (error.code) {
                    case 4001:
                        message.error(error.message);
                        cancelFun();
                        break;
                    default:
                        errCallbackFun();
                }
            });
    } catch (err) {
        cancelFun();
        console.log(err);
        return 0;
    }
}

/**
 * 存
 * @param
 */
export async function ContractMint(
    ethereum: any,
    Account: any,
    Amount: string,
    isNativeToken: boolean,
    Address: any,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            isNativeToken ? CEtherAddressAbi : CErc20AddressAbi, // 主链调用CEther.json，erc20调用 CErc20.json
            Address // 币种地址
        );
        return isNativeToken
            ? await contract.methods
                  .mint()
                  .send({
                      from: Account,
                      value: Amount,
                  })
                  .on('transactionHash', (transactionHash: any) => {
                      penddingCallbackFun(transactionHash);
                  })
                  .on('receipt', (receipt: any) => {
                      if (receipt.events.Failure) {
                          errCallbackFun();
                      } else {
                          successCallbackFun();
                      }
                  })
                  .on('error', (error: any) => {
                      switch (error.code) {
                          case 4001:
                              message.error(error.message);
                              cancelFun();
                              break;
                          default:
                              errCallbackFun();
                      }
                  })
            : await contract.methods
                  .mint(Amount)
                  .send({
                      from: Account,
                  })
                  .on('transactionHash', (transactionHash: any) => {
                      penddingCallbackFun(transactionHash);
                  })
                  .on('receipt', (receipt: any) => {
                      if (receipt.events.Failure) {
                          errCallbackFun();
                      } else {
                          successCallbackFun();
                      }
                  })
                  .on('error', (error: any) => {
                      switch (error.code) {
                          case 4001:
                              message.error(error.message);
                              cancelFun();
                              break;
                          default:
                              errCallbackFun();
                      }
                  });
    } catch (err) {
        cancelFun();
        console.log(err);
        return 0;
    }
}

/**
 * Enter Markets 进入市场
 * @param
 */
export async function ContractEnterMarkets(
    ethereum: any,
    Account: any,
    Address: any,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            DCtrollerAbi,
            DCtrollerAddress
        );

        return await contract.methods
            .enterMarkets([Address])
            .send({
                from: Account,
            })
            .on('transactionHash', (transactionHash: any) => {
                penddingCallbackFun(transactionHash);
            })
            .on('receipt', (receipt: any) => {
                if (receipt.events.Failure) {
                    errCallbackFun();
                } else {
                    successCallbackFun();
                }
            })
            .on('error', (error: any) => {
                switch (error.code) {
                    case 4001:
                        message.error(error.message);
                        cancelFun();
                        break;
                    default:
                        errCallbackFun();
                }
            });
    } catch (err) {
        cancelFun();
        console.log(err);
        return 0;
    }
}

/**
 * Exit Market
 * @param
 */
export async function ContractExitMarket(
    ethereum: any,
    Account: any,
    Address: any,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            DCtrollerAbi,
            DCtrollerAddress
        );
        return await contract.methods
            .exitMarket(Address)
            .send({
                from: Account,
            })
            .on('transactionHash', (transactionHash: any) => {
                penddingCallbackFun(transactionHash);
            })
            .on('receipt', (receipt: any) => {
                if (receipt.events.Failure) {
                    errCallbackFun();
                } else {
                    successCallbackFun();
                }
            })
            .on('error', (error: any) => {
                switch (error.code) {
                    case 4001:
                        message.error(error.message);
                        cancelFun();
                        break;
                    default:
                        errCallbackFun();
                }
            });
    } catch (err) {
        console.log(err);
        cancelFun();
        return 0;
    }
}

/**
 * 借
 * @param
 */
export async function ContractBorrow(
    ethereum: any,
    Account: any,
    Amount: string,
    isNativeToken: boolean,
    Address: any,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            isNativeToken ? CEtherAddressAbi : CErc20AddressAbi, // 主链调用CEther.json，erc20调用 CErc20.json
            Address // 币种地址
        );

        return await contract.methods
            .borrow(Amount.toString())
            .send({ from: Account })
            .on('transactionHash', (transactionHash: any) => {
                penddingCallbackFun(transactionHash);
            })
            .on('receipt', (receipt: any) => {
                if (receipt.events.Failure) {
                    errCallbackFun();
                } else {
                    successCallbackFun();
                }
            })
            .on('error', (error: any) => {
                switch (error.code) {
                    case 4001:
                        message.error(error.message);
                        cancelFun();
                        break;
                    default:
                        errCallbackFun();
                }
            });
    } catch (err) {
        cancelFun();
        console.log(err);
        return 0;
    }
}

/**
 * 还贷
 * @param
 */
export async function ContractRepayBorrow(
    ethereum: any,
    Account: any,
    Amount: string,
    maxborrowAmount: boolean,
    userBalance: any,
    isMax: boolean,
    isNativeToken: boolean,
    address: string,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            isNativeToken ? CEtherAddressAbi : CErc20AddressAbi, // 主链调用CEther.json，erc20调用 CErc20.json
            address // 币种地址
        );

        const MaximillionContract = new web3connector.eth.Contract(
            MaximillionAbi,
            Maximillion // 币种地址
        );

        const maxAmount = maxborrowAmount ? userBalance : maxApproval;

        console.log(userBalance, maxAmount, maxborrowAmount);

        return isNativeToken && isMax
            ? await MaximillionContract.methods
                  .repayBehalf(Account)
                  .send({
                      from: Account,
                      value: Tools.plus(Amount, Tools.mul(Amount, 0.003)),
                  })
                  .on('transactionHash', (transactionHash: any) => {
                      penddingCallbackFun(transactionHash);
                  })
                  .on('receipt', (receipt: any) => {
                      if (receipt.events.Failure) {
                          errCallbackFun();
                      } else {
                          successCallbackFun();
                      }
                  })
                  .on('error', (error: any) => {
                      switch (error.code) {
                          case 4001:
                              message.error(error.message);
                              cancelFun();
                              break;
                          default:
                              errCallbackFun();
                      }
                  })
            : isNativeToken && !isMax
            ? await contract.methods
                  .repayBorrow()
                  .send({ from: Account, value: Amount })
                  .on('transactionHash', (transactionHash: any) => {
                      penddingCallbackFun(transactionHash);
                  })
                  .on('receipt', (receipt: any) => {
                      if (receipt.events.Failure) {
                          errCallbackFun();
                      } else {
                          successCallbackFun();
                      }
                  })
                  .on('error', (error: any) => {
                      switch (error.code) {
                          case 4001:
                              message.error(error.message);
                              cancelFun();
                              break;
                          default:
                              errCallbackFun();
                      }
                  })
            : await contract.methods
                  .repayBorrow(!isMax ? Amount : maxAmount)
                  .send({ from: Account })
                  .on('transactionHash', (transactionHash: any) => {
                      penddingCallbackFun(transactionHash);
                  })
                  .on('receipt', (receipt: any) => {
                      if (receipt.events.Failure) {
                          errCallbackFun();
                      } else {
                          successCallbackFun();
                      }
                  })
                  .on('error', (error: any) => {
                      console.log(error);
                      switch (error.code) {
                          case 4001:
                              message.error(error.message);
                              cancelFun();
                              break;
                          default:
                              errCallbackFun();
                      }
                  });
    } catch (err) {
        cancelFun();
        console.log(err);
        return 0;
    }
}

/**
 * 赎回
 * @param
 */
export async function ContractRedeem(
    ethereum: any,
    Account: any,
    Amount: string,
    isNativeToken: boolean,
    isMax: boolean,
    address: string,
    isBorrow: boolean,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            isNativeToken ? CEtherAddressAbi : CErc20AddressAbi, // 主链调用CEther.json，erc20调用 CErc20.json
            address // 币种地址
        );

        const balanceOf = await contract.methods.balanceOf(Account).call();
        console.log(Amount, isMax, balanceOf, isBorrow);

        return isMax && !isBorrow
            ? await contract.methods.redeem(balanceOf).send({ from: Account }).on('transactionHash', (transactionHash: any) => {
                      penddingCallbackFun(transactionHash);
                  })
                  .on('receipt', (receipt: any) => {
                      if (receipt.events.Failure) {
                          errCallbackFun();
                      } else {
                          successCallbackFun();
                      }
                  })
                  .on('error', (error: any) => {
                      switch (error.code) {
                          case 4001:
                              message.error(error.message);
                              cancelFun();
                              break;
                          default:
                              errCallbackFun();
                      }
                  })
            : await contract.methods
                  .redeemUnderlying(Amount)
                  .send({ from: Account })
                  .on('transactionHash', (transactionHash: any) => {
                      penddingCallbackFun(transactionHash);
                  })
                  .on('receipt', (receipt: any) => {
                      if (receipt.events.Failure) {
                          errCallbackFun();
                      } else {
                          successCallbackFun();
                      }
                  })
                  .on('error', (error: any) => {
                      switch (error.code) {
                          case 4001:
                              message.error(error.message);
                              cancelFun();
                              break;
                          default:
                              errCallbackFun();
                      }
                  });
    } catch (err) {
        cancelFun();
        console.log(err);
        return 0;
    }
}

/**
 * 获取cdtc 价格
 * @param
 */
export async function ContractGetCDTCPrice(ethereum: any) {
    try {
        const Contracts = new Web3(ethereum);
        const uniswapContract = new Contracts.eth.Contract(
            uniswapContractABI,
            uniswapContractAddress
        );
        const reserves = await uniswapContract.methods.getReserves().call();
        return Tools.div(reserves.reserve1, reserves.reserve0);
    } catch (err) {
        if (process.env.BUILD_ENV !== 'binance') {
            return false;
        } else {
            console.log(err);
            return 0;
        }
    }
}

/**
 * 借贷列表
 * @param
 */
export async function GetAllMarkets(ethereum: any, account: string) {
    try {
        const Contracts = new Web3(ethereum);

        const contract = new Contracts.eth.Contract(
            DCtrollerAbi,
            DCtrollerAddress
        );
            
        const multicall = new MultiCall(ethereum, Multicall_contracts);

        // EIP20Interface.json;
        // EIP20Interface.sol; balanceOf
        // supplyRatePerBlock 区块利率
        // 获取账户流动性
        const list = filterSymbolListAddress(
            await contract.methods.getAllMarkets().call()
        );
        const AssetsInlist = await contract.methods.getAssetsIn(account).call(); //

        const userBalanceBNB = Web3.utils.fromWei(
            await Contracts.eth.getBalance(account)
        );

        // 用户约价值USDT
        const userBalance = await switchSymbolUSDTPrice(
            ethereum,
            Number(userBalanceBNB),
            'BNB',
            BNBAddress,
            18
        );

        const userBNB = Tools.LE(userBalance, 0.8)
            ? 0
            : Tools.LE(
                  Tools.sub(userBalance, Tools.mul(userBalance, 0.003)),
                  0.8
              )
            ? await switchSymbolUSDTPrice(ethereum, 0.8, 'BNB', BNBAddress, 18)
            : Tools.sub(userBalanceBNB, Tools.mul(userBalanceBNB, 0.003));

        const CDTCPrice = (await ContractGetCDTCPrice(ethereum)) || 0;

        const Pricecontract = new Contracts.eth.Contract(
            PriceOracleAbi,
            ChainLinkPriceOracle
        );

        // BNB -usdt
        const BNBprice = await Pricecontract.methods
            .getUnderlyingPrice(USDTAddress)
            .call();

        const tokens = list.map(async (address: any, index: any) => {
            const markets = await contract.methods.markets(address).call();
            //  PriceOracle.sol getUnderlyingPrice;
            const CEtherContract = new Contracts.eth.Contract(
                CEtherAddressAbi,
                address
            );
            const isNativeToken = await CEtherContract.methods
                .isNativeToken()
                .call();

            const exchangeRateCurrent = await CEtherContract.methods
                .exchangeRateCurrent()
                .call();

            const CErc20AddressContract = new Contracts.eth.Contract(
                CErc20AddressAbi,
                address
            );

            // 1当前币种=?BNB
            const symbolPrice = await Pricecontract.methods
                .getUnderlyingPrice(address)
                .call();

            const price = Tools.div(symbolPrice, BNBprice);

            const underlying = isNativeToken
                ? BNBAddress
                : await CErc20AddressContract.methods.underlying().call();

            const testcontract = new Contracts.eth.Contract(
                EIP20InterfaceAbi,
                underlying
            );

            const redeemAllowed = await contract.methods
                .redeemAllowed(underlying, account, address)
                .call();

            const {
                0: isListed,
                1: collateralFactorMantissa,
                2: isComped,
            }: any = markets;

            const allowance = await IsAllowance(
                ethereum,
                account,
                underlying,
                address
            );
            const ethMantissa = 1e18;
            const blocksPerDay = (60 / blocks) * 60 * 24; //每天释放量
            const daysPerYear = 365;

            // const cToken = new web3.eth.Contract(cEthAbi, cEthAddress);
            const supplyRatePerBlock = await CEtherContract.methods
                .supplyRatePerBlock()
                .call();
            const borrowRatePerBlock = await CEtherContract.methods
                .borrowRatePerBlock()
                .call();
            const supplyApy =
                (Math.pow(
                    (supplyRatePerBlock / ethMantissa) * blocksPerDay + 1,
                    daysPerYear
                ) -
                    1) *
                100;

            const borrowApy =
                (Math.pow(
                    (borrowRatePerBlock / ethMantissa) * blocksPerDay + 1,
                    daysPerYear
                ) -
                    1) *
                100;

            const borrowBalance = await CEtherContract.methods
                .borrowBalanceCurrent(account)
                .call();
            const totalBorrow = await CEtherContract.methods
                .totalBorrowsCurrent()
                .call();
            const totalSupply = await CEtherContract.methods
                .totalSupply()
                .call();

            // 自己存的钱
            const supplyBalance = await CEtherContract.methods
                .balanceOfUnderlying(account)
                .call();

            // const decimal: any = await testcontract.methods.decimals().call();
            // const name = await testcontract.methods.name().call();
            const symbol = filterSymbol(address);
            const SymbolInfo: any = await getSymbolInfo(ethereum, address);
            const { decimal, name } = SymbolInfo;

            const underlyingBalance = Tools.numDivDecimals(
                supplyBalance,
                decimal
            );

            // Distribution apy :（1+每天释放量/存款量）^364  -1

            const isSavings = AssetsInlist.find((value: any) => {
                // @ts-ignore
                return value === address;
            });

            const balanceOf =
                Tools.numDivDecimals(
                    await CEtherContract.methods.balanceOf(account).call(),
                    decimal
                ) || 0;

            const userBalances = await testcontract.methods
                .balanceOf(account)
                .call();

            // 不可以存 不可以借
            // mintGuardianPaused 是否暂停存款
            // borrowGuardianPaused 是否暂停借款
            // multicall

            const mintGuardianPaused = await contract.methods
                .mintGuardianPaused(address)
                .call();
            const borrowGuardianPaused = await contract.methods
                .borrowGuardianPaused(address)
                .call();

            let compSpeeds = await contract.methods.compSpeeds(address).call();

            // const supplydistributionApy = Tools.GT(Number(totalSupply), 0)
            //     ? Tools.sub(
            //           Math.pow(
            //               Number(
            //                   Tools.plus(
            //                       1,
            //                       Tools.div(
            //                           Number(
            //                               Tools.numDivDecimals(compSpeeds, 18)
            //                           ) *
            //                               blocksPerDay *
            //                               Number(CDTCPrice),
            //                           Number(
            //                               await switchSymbolUSDTPrice(
            //                                   ethereum,
            //                                   Number(
            //                                       Tools.mul(
            //                                           Tools.numDivDecimals(
            //                                               exchangeRateCurrent,
            //                                               decimal
            //                                           ),
            //                                           Tools.numDivDecimals(
            //                                               totalSupply,
            //                                               decimal
            //                                           )
            //                                       )
            //                                   ),
            //                                   symbol,
            //                                   address,
            //                                   decimal
            //                               )
            //                           )
            //                       )
            //                   )
            //               ),
            //               364
            //           ),
            //           1
            //       )
            //     : 0;

            const supplydistributionApy = Tools.GT(Number(totalSupply), 0)
                ? Tools.mul(
                      Tools.div(
                          Number(Tools.numDivDecimals(compSpeeds, 18)) *
                              blocksPerDay *
                              Number(CDTCPrice),
                          Number(
                              await switchSymbolUSDTPrice(
                                  ethereum,
                                  Number(
                                      Tools.mul(
                                          Tools.numDivDecimals(
                                              exchangeRateCurrent,
                                              decimal
                                          ),
                                          Tools.numDivDecimals(
                                              totalSupply,
                                              decimal
                                          )
                                      )
                                  ),
                                  symbol,
                                  address,
                                  decimal
                              )
                          )
                      ),
                      365
                  )
                : 0;

            // const borrowdistributionApy = Tools.GT(Number(totalBorrow), 0)
            //     ? Tools.sub(
            //           Math.pow(
            //               Number(
            //                   Tools.plus(
            //                       1,
            //                       Tools.div(
            //                           Number(
            //                               Tools.numDivDecimals(compSpeeds, 18)
            //                           ) *
            //                               blocksPerDay *
            //                               Number(CDTCPrice),
            //                           Number(
            //                               await switchSymbolUSDTPrice(
            //                                   ethereum,
            //                                   Number(
            //                                       Tools.numDivDecimals(
            //                                           totalBorrow,
            //                                           decimal
            //                                       )
            //                                   ),
            //                                   symbol,
            //                                   address,
            //                                   decimal
            //                               )
            //                           )
            //                       )
            //                   )
            //               ),
            //               364
            //           ),
            //           1
            //       )
            //     : 0;

            const borrowdistributionApy = Tools.GT(Number(totalBorrow), 0)
                ? Tools.mul(
                      Tools.div(
                          Number(Tools.numDivDecimals(compSpeeds, 18)) *
                              blocksPerDay *
                              Number(CDTCPrice),
                          Number(
                              await switchSymbolUSDTPrice(
                                  ethereum,
                                  Number(
                                      Tools.numDivDecimals(totalBorrow, decimal)
                                  ),
                                  symbol,
                                  address,
                                  decimal
                              )
                          )
                      ),
                      365
                  )
                : 0;

            return {
                index: index,
                mintGuardianPaused,
                borrowGuardianPaused,
                underlyingAddress: underlying,
                address: address,
                isListed,
                collateralFactorMantissa: Tools.numDivDecimals(
                    collateralFactorMantissa,
                    decimal
                ),
                isComped,
                name,
                symbol,
                decimals: decimal,
                balanceOf: Tools.numDivDecimals(balanceOf, decimal) || 0,
                balance: Tools.numDivDecimals(userBalances, decimal),
                balanceDecimal: userBalances,
                price: price,
                symbolPrice: symbolPrice,
                supplyEarningsApy: Tools.fmtDec(
                    Tools.plus(
                        supplyApy,
                        Tools.mul(supplydistributionApy, 100)
                    ),
                    2
                ),
                borrowEarningsApy: Tools.fmtDec(
                    Tools.sub(borrowApy, Tools.mul(borrowdistributionApy, 100)),
                    2
                ),
                supplyApy: Tools.fmtDec(supplyApy, 2),
                borrowApy: Tools.fmtDec(borrowApy, 2),
                allowance: Tools.GT(
                    Tools.numDivDecimals(allowance, decimal),
                    0
                ),
                liquidity: Tools.fmtDec(
                    Tools.numDivDecimals(
                        await CEtherContract.methods.getCash().call(),
                        decimal
                    ),
                    6
                ),
                borrowBalanceDecimal: borrowBalance,
                borrowBalance: Tools.fmtDec(
                    Tools.numDivDecimals(borrowBalance, decimal),
                    6
                ),
                redeemAllowed:
                    Tools.GT(redeemAllowed, 0) &&
                    Tools.LE(
                        Tools.fmtDec(
                            Tools.numDivDecimals(borrowBalance, decimal),
                            6
                        ),
                        0
                    ),
                totalBorrow: Tools.fmtDec(
                    Tools.numDivDecimals(totalBorrow, decimal),
                    6
                ),
                totalSupplyUSDTpriceAmount: await switchSymbolUSDTPrice(
                    ethereum,
                    Number(Tools.numDivDecimals(totalSupply, decimal)),
                    symbol,
                    address,
                    decimal
                ),
                totalBorrowUSDTprice: await switchSymbolUSDTPrice(
                    ethereum,
                    Number(Tools.numDivDecimals(totalBorrow, decimal)),
                    symbol,
                    address,
                    decimal
                ),
                exchangeRateCurrent,
                totalSupply: Tools.fmtDec(
                    Tools.mul(
                        Tools.numDivDecimals(exchangeRateCurrent, decimal),
                        Tools.fmtDec(
                            Tools.numDivDecimals(totalSupply, decimal),
                            6
                        )
                    ),
                    6
                ),

                // 抵押的金额
                totalSupplyUSDTprice: await switchSymbolUSDTPrice(
                    ethereum,
                    Number(
                        Tools.mul(
                            Tools.numDivDecimals(exchangeRateCurrent, decimal),
                            Tools.numDivDecimals(totalSupply, decimal)
                        )
                    ),
                    symbol,
                    address,
                    decimal
                ),
                supplyBalance: Tools.numDivDecimals(supplyBalance, decimal),
                underlyingBalance: underlyingBalance,

                // withdrawBalanceUSDTprice: await switchSymbolUSDTPrice(
                //     ethereum,
                //     Tools.GT(borrowBalance, 0)
                //         ? Tools.sub(
                //               underlyingBalance,
                //               Tools.div(
                //                   Tools.numDivDecimals(borrowBalance, decimal),
                //                   Tools.numDivDecimals(
                //                       collateralFactorMantissa,
                //                       decimal
                //                   )
                //               )
                //           )
                //         : underlyingBalance,
                //     symbol,
                //     address
                // ),

                usersSupplyUsdt: await switchSymbolUSDTPrice(
                    ethereum,
                    Tools.mul(
                        underlyingBalance,
                        Tools.numDivDecimals(collateralFactorMantissa, decimal)
                    ),
                    symbol,
                    address,
                    decimal
                ),

                supplydistributionApy: Tools.fmtDec(
                    Tools.mul(supplydistributionApy, 100),
                    2
                ),
                borrowdistributionApy: Tools.fmtDec(
                    Tools.mul(borrowdistributionApy, 100),
                    2
                ),
                maxBorrowBalance: isSavings
                    ? Tools.mul(
                          Tools.numDivDecimals(supplyBalance, decimal),
                          Tools.numDivDecimals(
                              collateralFactorMantissa,
                              decimal
                          )
                      )
                    : 0,
                maxBorrowBalanceUSDTprice: isSavings
                    ? await switchSymbolUSDTPrice(
                          ethereum,
                          Tools.mul(
                              Tools.numDivDecimals(supplyBalance, decimal),
                              Tools.numDivDecimals(
                                  collateralFactorMantissa,
                                  decimal
                              )
                          ),
                          symbol,
                          address,
                          decimal
                      )
                    : 0,
                BorrowLimitUsed:
                    totalBorrow !== '0'
                        ? Tools.div(Number(borrowBalance), Number(totalBorrow))
                        : 0,
                totleBorrowLimitUSDTprice: await switchSymbolUSDTPrice(
                    ethereum,
                    Tools.numDivDecimals(
                        Tools.mul(
                            supplyBalance,
                            Tools.numDivDecimals(collateralFactorMantissa, 18)
                        ),
                        decimal
                    ),
                    symbol,
                    address,
                    decimal
                ),

                isSavings: isSavings,
                userBalance: userBNB,
                userBalanceBNB: Tools.numDulDecimals(userBNB, decimal),
                isNativeToken,
                supplyBalanceUSDTprice: await switchSymbolUSDTPrice(
                    ethereum,
                    Tools.numDivDecimals(supplyBalance, decimal),
                    symbol,
                    address,
                    decimal
                ),
                borrowBalanceUSDTprice: await switchSymbolUSDTPrice(
                    ethereum,
                    Tools.numDivDecimals(borrowBalance, decimal),
                    symbol,
                    address,
                    decimal
                ),
            };

            // marketsList.push({
            //     index: index,
            //     mintGuardianPaused,
            //     borrowGuardianPaused,
            //     underlyingAddress: underlying,
            //     address: address,
            //     isListed,
            //     collateralFactorMantissa: Tools.numDivDecimals(
            //         collateralFactorMantissa,
            //         decimal
            //     ),
            //     isComped,
            //     name,
            //     symbol,
            //     decimals: decimal,
            //     balanceOf: Tools.numDivDecimals(balanceOf, decimal) || 0,
            //     balance: balance,
            //     price: Tools.numDivDecimals(price, decimal),
            //     supplyApy: Tools.fmtDec(supplyApy, 6),
            //     // supplyApy: supplyApy,
            //     borrowApy: Tools.fmtDec(borrowApy, 2),
            //     allowance: Tools.GT(
            //         Tools.numDivDecimals(allowance, decimal),
            //         0
            //     ),
            //     // assets: await contract.methods.getAssetsIn(list[i]).call(),
            //     liquidity: Tools.fmtDec(
            //         Tools.numDivDecimals(
            //             await CEtherContract.methods.getCash().call(),
            //             decimal
            //         ),
            //         6
            //     ),
            //     // Borrow Balance 借了多少钱
            //     borrowBalanceDecimal: borrowBalance,
            //     borrowBalance: Tools.fmtDec(
            //         Tools.numDivDecimals(borrowBalance, decimal),
            //         6
            //     ),
            //     redeemAllowed:
            //         Tools.GT(redeemAllowed, 0) &&
            //         Tools.LE(
            //             Tools.fmtDec(
            //                 Tools.numDivDecimals(borrowBalance, decimal),
            //                 6
            //             ),
            //             0
            //         ),
            //     // Total Borrow 所有借款量
            //     totalBorrow: Tools.fmtDec(
            //         Tools.numDivDecimals(totalBorrow, decimal),
            //         6
            //     ),
            //     totalBorrowUSDTprice: await toPrice(
            //         Tools.numDivDecimals(totalBorrow, decimal),
            //         decimal,
            //         symbol
            //     ),
            //     totalSupply: Tools.fmtDec(
            //         Tools.mul(
            //             Tools.numDivDecimals(exchangeRateCurrent, decimal),
            //             Tools.fmtDec(
            //                 Tools.numDivDecimals(totalSupply, decimal),
            //                 6
            //             )
            //         ),
            //         6
            //     ),

            //     totalSupplyUSDTprice: await toPrice(
            //         Tools.mul(
            //             Tools.numDivDecimals(exchangeRateCurrent, decimal),
            //             Tools.numDivDecimals(totalSupply, decimal)
            //         ),
            //         decimal,
            //         symbol
            //     ),
            //     supplyBalance: supplyBalance,
            //     //Underlying Balance  这个池子自己存的钱
            //     underlyingBalance: Tools.numDivDecimals(supplyBalance, decimal),
            //     // 假定的贷款使用率安全值 =  借款金额/((存款金额-x) * 抵押率) = 0.85， （x:最大安全值 ）
            //     // 最大可取金额 = 存款金额 - (借款金额 / 假定的贷款使用率安全值 / 抵押率)

            //     // withdrawBalanceUSDTprice: await switchUSDTPrice(
            //     //     Tools.numDivDecimals(
            //     //         Tools.sub(
            //     //             supplyBalance,

            //     //             Tools.mul(
            //     //                 Tools.div(borrowBalance, 0.85),
            //     //                 collateralFactorMantissa
            //     //             )
            //     //         ),
            //     //         decimal
            //     //     ),
            //     //     decimal,
            //     //     symbol
            //     // ),

            //     withdrawBalanceUSDTprice: Tools.sub(
            //         await toPrice(
            //             Tools.numDivDecimals(supplyBalance, decimal),
            //             decimal,
            //             symbol
            //         ),

            //         await toPrice(
            //             Tools.numDivDecimals(
            //                 Tools.div(
            //                     Tools.div(borrowBalance, 0.85),
            //                     collateralFactorMantissa
            //                 ),
            //                 decimal
            //             ),
            //             decimal,
            //             symbol
            //         )
            //     ),

            //     //
            //     // Underlying Balance * Collateral Factor（collateralFactorMantissa：抵押率）
            //     // 可借金额
            //     maxBorrowBalance: isSavings
            //         ? Tools.numDivDecimals(
            //               Tools.mul(
            //                   supplyBalance,
            //                   Tools.numDivDecimals(
            //                       collateralFactorMantissa,
            //                       decimal
            //                   )
            //               ),
            //               decimal
            //           )
            //         : 0,
            //     maxBorrowBalanceUSDTprice: isSavings
            //         ? Tools.numDivDecimals(
            //               await toPrice(
            //                   Tools.mul(
            //                       supplyBalance,
            //                       Tools.numDivDecimals(
            //                           collateralFactorMantissa,
            //                           decimal
            //                       )
            //                   ),
            //                   decimal,
            //                   symbol
            //               ),
            //               decimal
            //           )
            //         : 0,
            //     BorrowLimitUsed:
            //         totalBorrow !== '0'
            //             ? Tools.div(Number(borrowBalance), Number(totalBorrow))
            //             : 0,
            //     totleBorrowLimitUSDTprice: await toPrice(
            //         Tools.numDivDecimals(
            //             Tools.mul(
            //                 supplyBalance,
            //                 Tools.numDivDecimals(collateralFactorMantissa, 18)
            //             ),
            //             decimal
            //         ),
            //         decimal,
            //         symbol
            //     ),

            //     isSavings: isSavings,
            //     userBalance: await switchUSDTToPrice(
            //         ethereum,
            //         userBNB,
            //         Tools.numDivDecimals(price, decimal)
            //     ),
            //     isNativeToken,
            //     supplyBalanceUSDTprice: await toPrice(
            //         Tools.numDivDecimals(supplyBalance, decimal),
            //         decimal,
            //         symbol
            //     ),
            //     borrowBalanceUSDTprice: await toPrice(
            //         Tools.numDivDecimals(borrowBalance, decimal),
            //         decimal,
            //         symbol
            //     ),
            // });
        });

        return await multicall.all([tokens]).then(() => {
            return Promise.all(tokens).then((res: any) => {
                console.log(res);
                return res;
            });
        });
    } catch (err) {
        console.log(err);
        return [];
    }
}

/**
 * 获取币种钱包余额
 * @param
 */
export async function getSymbolBalanceInfo(
    ethereum: any,
    account: any,
    address: string
) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            EIP20InterfaceAbi,
            address
        );
        const decimal: any = await contract.methods.decimals().call();
        const balance = Tools.numDivDecimals(
            await contract.methods.balanceOf(account).call(),
            decimal
        );

        return balance;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

/**
 * 获取币种信息
 * @param
 */
export async function getSymbolInfo(ethereum: any, address: string) {
    try {
        const web3connector = new Web3(ethereum);
        const testcontract = new web3connector.eth.Contract(
            EIP20InterfaceAbi,
            address
        );

        const decimal: any = await testcontract.methods.decimals().call();
        const name = await testcontract.methods.name().call();
        const symbol = await testcontract.methods.symbol().call();
        // filterSymbol(address);

        return {
            decimal,
            name,
            symbol,
        };
    } catch (err) {
        console.log(err);
        return { decimal: 0, name: 0, symbol: 0 };
    }
}

/**
 * 获取USDT价格
 * @param
 */
export async function GetUSDTPrice(ethereum: any) {
    try {
        const web3connector = new Web3(ethereum);
        const Pricecontract = new web3connector.eth.Contract(
            PriceOracleAbi,
            ChainLinkPriceOracle
        );

        // USDTAddress
        const price = await Pricecontract.methods
            .getUnderlyingPrice(USDTAddress)
            .call();
        //price(u) ==xxBNB
        return price;
    } catch (err) {
        console.log(err);
        return [];
    }
}

/**
 * 不桐币种转·USDT
 * @param
 */
//   decimal: any
export async function switchSymbolUSDTPrice(
    ethereum: any,
    num: String | number,
    symbol: any,
    address: any,
    decimal: any
) {
    try {
        const web3connector = new Web3(ethereum);
        const Pricecontract = new web3connector.eth.Contract(
            PriceOracleAbi,
            ChainLinkPriceOracle
        );
        // 先获取，BNB-USDT 价格
        const price = await Pricecontract.methods
            .getUnderlyingPrice(USDTAddress)
            .call();

        if (symbol === 'USDT' && Tools.LE(num, 0)) {
            return num;
        } else if (symbol === 'BNB') {
            return Tools.mul(
                num,
                Tools.div(1, Tools.numDivDecimals(price, 18))
            );
        } else {
            // 当前币种-BNB 价
            // console.log('先获取，BNB-USDT 价格', price);

            const symbolPrice = await Pricecontract.methods
                .getUnderlyingPrice(address)
                .call();

            return Tools.mul(
                num,
                Tools.div(
                    Tools.numDivDecimals(symbolPrice, 18),
                    Tools.numDivDecimals(price, decimal)
                )
            );
        }
    } catch (err) {
        console.log(err);
        return [];
    }
}

/**
 * 不桐币种转·USDT
 * @param
 */
export async function switchUSDTSymbolPrice(
    ethereum: any,
    num: String | number,
    symbol: any,
    address: any
) {
    try {
        const web3connector = new Web3(ethereum);
        if (symbol === 'USDT' || Tools.LE(num, 0)) {
            return num;
        } else {
            const Pricecontract = new web3connector.eth.Contract(
                PriceOracleAbi,
                ChainLinkPriceOracle
            );
            // 先获取，BNB-USDT 价格
            const price = await Pricecontract.methods
                .getUnderlyingPrice(USDTAddress)
                .call();
            // 当前币种-BNB 价
            const symbolPrice = await Pricecontract.methods
                .getUnderlyingPrice(address)
                .call();

            return Tools.div(num || 1, Tools.div(symbolPrice, price));
        }
    } catch (err) {
        console.log(err);
        return [];
    }
}

/**
 * 根据usdt 的价格转换成美元
 * @param
 */
export async function switchUSDTPrice(
    ethereum: any,
    num: String | number,
    decimal: String | number,
    symbol: any
) {
    try {
        const web3connector = new Web3(ethereum);
        if (symbol === 'USDT' || Tools.LE(num, 0)) {
            return num;
        } else {
            const Pricecontract = new web3connector.eth.Contract(
                PriceOracleAbi,
                ChainLinkPriceOracle
            );

            const price = await Pricecontract.methods
                .getUnderlyingPrice(USDTAddress)
                .call();

            return Tools.mul(
                num || 1,
                Tools.div(1, Tools.numDivDecimals(price, decimal || 18))
            );
        }
    } catch (err) {
        console.log(err);
        return [];
    }
}

/**
 * 根据usdt 转成当前币种价格
 * @param
 */
export async function switchUSDTToPrice(
    ethereum: any,
    num: String | number,
    price: String | number
) {
    try {
        const web3connector = new Web3(ethereum);
        const Pricecontract = new web3connector.eth.Contract(
            PriceOracleAbi,
            ChainLinkPriceOracle
        );
        const usedtPrice = await Pricecontract.methods
            .getUnderlyingPrice(USDTAddress)
            .call();

        console.log(price, usedtPrice, num);

        return Tools.div(
            num,
            Tools.div(price, Tools.numDivDecimals(usedtPrice, 18))
        );
    } catch (err) {
        console.log(err);
        return [];
    }
}

/**
 * 用户信用抵押率
 * @param
 */
export async function getCreditCollateralRatio(ethereum: any, account: string) {
    try {
        const web3connector = new Web3(ethereum);
        const contract = new web3connector.eth.Contract(
            CreditOracleAbi,
            CreditOracleAddress
        );
        const ratio = await contract.methods
            .getCreditCollateralRatio(account)
            .call();
        return Tools.numDivDecimals(ratio, 18);
    } catch (err) {
        console.log(err);
        return 1;
    }
}
