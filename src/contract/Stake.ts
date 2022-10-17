import Web3 from 'web3';
import { message } from 'antd';
// import Contract from './Contract';
// import BigNumber from 'bignumber.js';
import {
    StakingPoolAddress,
    AirDropPoolAddress,
    CompoundLens,
    DCtrollerAddress,
    DTCTAddress,
    SymbolListAddress,
    HighYieldPoolAddress,
    HighYieldPoolAddress2,
    blocks,
} from '../config';
import * as Tools from '../utils/Tools';
// import moment from 'moment';

const Erc20AddressAbi = require('./abi/ERC20.json');
const AirDropPoolAbi = require('./abi/AirDropPool.json');
const DaoImmutableAbi = require('./abi/DaoImmutable.json');
const DCtrollerAbi = require('./abi/Comptroller.json');
const LockPoolABi = require('./abi/LockPool.json');
const StakingPoolAbi = require('./abi/StakingPool.json');
const HighYieldPoolAbi = require('./abi/HighYieldPool.json');

const CompoundLensAbi = require('./abi/CompoundLens.json');

const maxApprovalNumber = Web3.utils.toWei(
    '99999999999999999999999999999999',
    'ether'
);

// const maxApproval = new BigNumber(2).pow(256).minus(1).toString(10);

/**
 * 质押
 * @param
 */
export async function ContractStake(
    ethereum: any,
    Account: any,
    Amount: string,
    poolType: number,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const Contracts = new Web3(ethereum);
        const contract = new Contracts.eth.Contract(
            DaoImmutableAbi,
            StakingPoolAddress
        );

        const address =
            poolType === 1 ? HighYieldPoolAddress : HighYieldPoolAddress2;

        const newContract = new Contracts.eth.Contract(
            HighYieldPoolAbi,
            address
        );

        return poolType === 0
            ? await contract.methods
                  .stake(Amount)
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
                  })
            : await newContract.methods
                  .stake(Amount)
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
 * 申请解锁
 * @param
 */
export async function ContractRequestUnstake(
    ethereum: any,
    Account: any,
    Amount: string,
    isMax: boolean,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const Contract = new Web3(ethereum);
        const contract = new Contract.eth.Contract(
            DaoImmutableAbi,
            StakingPoolAddress
        );

        const DCtrollerContract = new Contract.eth.Contract(
            StakingPoolAbi,
            StakingPoolAddress
        );
        const exchangeRate = await DCtrollerContract.methods
            .exchangeRateCurrent()
            .call();

        const WithdrawAmount = await DCtrollerContract.methods
            .balanceOf(Account)
            .call();

        return await contract.methods
            .requestUnstake(
                isMax
                    ? WithdrawAmount
                    : (
                          Tools.div(
                              Amount,
                              Tools.numDivDecimals(exchangeRate, 18)
                          ) + ''
                      ).split('.')[0]
            )
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
 * 解锁剩余时间
 * @param
 */
export async function contractWithdrawTime(ethereum: any, Account: any) {
    try {
        const Contract = new Web3(ethereum);
        const contract = new Contract.eth.Contract(
            DaoImmutableAbi,
            StakingPoolAddress
        );

        const contractLockPool = new Contract.eth.Contract(
            LockPoolABi,
            await contract.methods.lockPool().call()
        );

        return await contractLockPool.methods.withdrawTime(Account).call();
    } catch (err) {
        console.log(err);
        return 0;
    }
}

/**
 * 本金加奖励
 * @param
 */
export async function contractBalanceOfUnderlying(
    ethereum: any,
    account: string
) {
    try {
        const Contract = new Web3(ethereum);
        const contract = new Contract.eth.Contract(
            DaoImmutableAbi,
            StakingPoolAddress
        );
        return await contract.methods.balanceOfUnderlying(account).call();
    } catch (err) {
        console.log(err);
        return 0;
    }
}

/**
 *  总质押
 * @param
 */
export async function contractTotalBalance(ethereum: any) {
    try {
        const Contracts = new Web3(ethereum);
        const contract = new Contracts.eth.Contract(
            DaoImmutableAbi,
            StakingPoolAddress
        );

        return await contract.methods.totalBalance().call();
    } catch (err) {
        console.log(err);
        return {
            totalBalance: 0,
            totalStaked: 0,
        };
    }
}

/**
 * withdraw
 * @param
 */
export async function Contractwithdraw(
    ethereum: any,
    Account: any,
    poolType: number,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const Contracts = new Web3(ethereum);
        const contract = new Contracts.eth.Contract(
            DaoImmutableAbi,
            StakingPoolAddress
        );

        const address =
            poolType === 1 ? HighYieldPoolAddress : HighYieldPoolAddress2;
        const newContract = new Contracts.eth.Contract(
            HighYieldPoolAbi,
            address
        );

        return poolType === 0
            ? await contract.methods
                  .withdraw()
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
                  })
            : await newContract.methods
                  .unstakeAll()
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
 * 领空投
 * @param
 */
export async function ContractAirDropwithdraw(
    ethereum: any,
    Account: any,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const Contracts = new Web3(ethereum);
        const contract = new Contracts.eth.Contract(
            AirDropPoolAbi,
            AirDropPoolAddress
        );
        return await contract.methods
            .withdraw()
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
 * 判断是否可以领取空投
 * @param
 */
export async function IsGetReceiveAirdrop(ethereum: any, Account: any) {
    try {
        const Contract = new Web3(ethereum);
        const contract = new Contract.eth.Contract(
            DaoImmutableAbi,
            StakingPoolAddress
        );
        const AirDropcontract = new Contract.eth.Contract(
            AirDropPoolAbi,
            AirDropPoolAddress
        );
        let timestamp = new Date().getTime();
        //  释放开启了需要质押才能领取空投
        const isCheckStake = await AirDropcontract.methods.checkStake().call();
        return (
            (isCheckStake
                ? Tools.GT(
                      await contract.methods
                          .balanceOfUnderlying(Account)
                          .call(),
                      0
                  )
                : true) &&
            Tools.GT(await AirDropcontract.methods.earned(Account).call(), 0) &&
            Tools.GT(
                (await AirDropcontract.methods.periodFinish().call()) * 1000,
                timestamp
            )
        );
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * 判断已经领取了空投
 * @param
 */
export async function IsHaveReceiveAirdrop(ethereum: any, Account: any) {
    try {
        const Contract = new Web3(ethereum);
        const contract = new Contract.eth.Contract(
            DaoImmutableAbi,
            StakingPoolAddress
        );
        const airDropContract = new Contract.eth.Contract(
            AirDropPoolAbi,
            AirDropPoolAddress
        );
        return (
            Tools.GT(
                await contract.methods.balanceOfUnderlying(Account).call(),
                await airDropContract.methods.airDropAmount(Account).call()
            ) && (await airDropContract.methods.earned(Account).call()) === 0
        );
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * 可以赎回金额
 * @param
 */
export async function ContractWithdrawAmount(ethereum: any, Account: any) {
    try {
        const Contract = new Web3(ethereum);
        const DCtrollerContract = new Contract.eth.Contract(
            StakingPoolAbi,
            StakingPoolAddress
        );

        const balanceOf = Tools.numDivDecimals(
            await DCtrollerContract.methods.balanceOf(Account).call(),
            18
        );

        const exchangeRate = Tools.numDivDecimals(
            await DCtrollerContract.methods.exchangeRateCurrent().call(),
            18
        );

        return Tools.mul(balanceOf, exchangeRate);
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * 已解锁待领取的量
 * @param
 */
export async function ContractLockedBalance(ethereum: any, Account: any) {
    try {
        const Contract = new Web3(ethereum);
        const contract = new Contract.eth.Contract(
            DaoImmutableAbi,
            StakingPoolAddress
        );

        const contractLockPool = new Contract.eth.Contract(
            LockPoolABi,
            await contract.methods.lockPool().call()
        );
        return await contractLockPool.methods.lockedBalance(Account).call();
    } catch (err) {
        console.log(err);
        return 0;
    }
}

/**
 * 判断可以赎回
 * @param
 */
export async function ContractIsWithdraw(ethereum: any, Account: any) {
    try {
        const Contract = new Web3(ethereum);
        const contract = new Contract.eth.Contract(
            DaoImmutableAbi,
            StakingPoolAddress
        );
        // const airDropContract = new Contract.eth.Contract(
        //     AirDropPoolAbi,
        //     AirDropPoolAddress
        // );
        let timestamp = Date.now();

        const contractLockPool = new Contract.eth.Contract(
            LockPoolABi,
            await contract.methods.lockPool().call()
        );

        // const DCtrollerContract = new Contract.eth.Contract(
        //     StakingPoolAbi,
        //     StakingPoolAddress
        // );

        // const balanceOf = await DCtrollerContract.methods
        //     .balanceOf(Account)
        //     .call();

        // console.log(
        //     Tools.numDivDecimals(balanceOf, 18),
        //     'balanceOfbalanceOfbalanceOfbalanceOfbalanceOfbalanceOf'
        // );

        const withdrawTimes = await contractWithdrawTime(ethereum, Account);
        return (
            Tools.GT(
                await contractLockPool.methods.lockedBalance(Account).call(),
                0
            ) && Tools.LT(withdrawTimes * 1000, timestamp)
        );
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * 可以领取的空投数
 * @param
 */
export async function getUserEarned(ethereum: any, Account: any) {
    try {
        const Contract = new Web3(ethereum);
        const contract = new Contract.eth.Contract(
            AirDropPoolAbi,
            AirDropPoolAddress
        );
        return contract.methods.earned(Account).call();
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * 计算Apy
 * @param
 */
export async function getContractApy(ethereum: any) {
    try {
        const Contract = new Web3(ethereum);
        const contract = new Contract.eth.Contract(
            DaoImmutableAbi,
            StakingPoolAddress
        );

        const DCtrollerContract = new Contract.eth.Contract(
            StakingPoolAbi,
            StakingPoolAddress
        );

        // 每日是释放的量
        const dayaReleaseAmount = await DCtrollerContract.methods
            .rewardRate()
            .call();

        const totalBalance = await contract.methods.totalBalance().call();
        const blocksPerDay = (60 / blocks) * 60 * 24;

        // （1+每天释放量/存款量）^364  -1 都是用的这个公式

        //    return totalBalance === '0'
        //        ? 0
        //        : Tools.sub(
        //              Math.pow(
        //                  Number(
        //                      Tools.plus(
        //                          1,
        //                          Tools.div(
        //                              Tools.mul(dayaReleaseAmount, 28800),
        //                              totalBalance
        //                          )
        //                      )
        //                  ),
        //                  364
        //              ),
        //              1
        //          );

        return totalBalance === '0'
            ? 0
            : Tools.mul(
                  Tools.div(
                      Tools.mul(dayaReleaseAmount, blocksPerDay),
                      totalBalance
                  ),
                  365
              );
    } catch (err) {
        console.log(err);
        return {
            poolApr: 0,
            poolApr1: 0,
        };
    }
}

/**
 * 授权
 * @param
 */
export async function ContractApprove(
    ethereum: any,
    Account: any,
    Address: any,
    poolType: number,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const Contracts = new Web3(ethereum);
        const Erc20Contract = new Contracts.eth.Contract(
            Erc20AddressAbi,
            Address
        );

        const poolContractsAddress =
            poolType === 1 ? HighYieldPoolAddress : HighYieldPoolAddress2;

        console.log(poolContractsAddress, poolType);
        return poolType === 0
            ? await Erc20Contract.methods
                  .approve(StakingPoolAddress, maxApprovalNumber)
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
                  })
            : await Erc20Contract.methods
                  .approve(poolContractsAddress, maxApprovalNumber)
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
 * 授权
 * @param
 */
export async function IsAllowance(
    ethereum: any,
    Account: any,
    Address: any,
    poolAddress: string
) {
    try {
        const Contract = new Web3(ethereum);
        const Erc20Contract = new Contract.eth.Contract(
            Erc20AddressAbi,
            Address
        );
        return await Erc20Contract.methods
            .allowance(Account, poolAddress)
            .call();
    } catch (err) {
        console.log(err);
        return 0;
    }
}

/**
 * 来获取用户未领取的挖矿收益
 * @param
 */
export async function getCompBalanceWithAccrued(ethereum: any, Account: any) {
    try {
        const Contract = new Web3(ethereum);
        const contract = new Contract.eth.Contract(
            CompoundLensAbi,
            CompoundLens
        );
        const Result = await contract.methods
            .getCompBalanceWithAccrued(DTCTAddress, DCtrollerAddress, Account)
            .call();

        return {
            balance:
                Tools.fmtDec(Tools.numDivDecimals(Result.balance, 18), 6) || 0,
            allocated:
                Tools.fmtDec(
                    Tools.numDivDecimals(Result.allocated || 0, 18),
                    6
                ) || 0,
        };
    } catch (err) {
        console.log(err);
        return 0;
    }
}

/**
 * 领取奖励
 * @param
 */
export async function ContractClaimComp(
    ethereum: any,
    Account: any,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const Contracts = new Web3(ethereum);
        const contract = new Contracts.eth.Contract(
            DCtrollerAbi,
            DCtrollerAddress
        );
        return await contract.methods
            .claimComp(Account, SymbolListAddress)
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
 * 领取利息
 * @param
 */
export async function ContractclaimReward(
    ethereum: any,
    Account: any,
    poolType: number,
    penddingCallbackFun: any,
    successCallbackFun: any,
    errCallbackFun: any,
    cancelFun: any
) {
    try {
        const Contracts = new Web3(ethereum);
        const address =
            poolType === 1 ? HighYieldPoolAddress : HighYieldPoolAddress2;

        const contract = new Contracts.eth.Contract(HighYieldPoolAbi, address);
        return await contract.methods
            .claimReward()
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
 * 获取二池数据
 * @param
 */
export async function ContractGetPoolData(
    ethereum: any,
    Account: any,
    poolType: any
) {
    try {
        const Contracts = new Web3(ethereum);

        const address =
            poolType === 1 ? HighYieldPoolAddress : HighYieldPoolAddress2;
        const newContract = new Contracts.eth.Contract(
            HighYieldPoolAbi,
            address
        );

        // 总质押
        const totalStaked = await newContract.methods.totalStaked().call();

        // 每个区块的释放量
        const rewardSpeed = await newContract.methods.rewardSpeed().call();
        //每天释放量
        const blocksPerDay = (60 / blocks) * 60 * 24;
        const apy =
            totalStaked === '0'
                ? 0
                : Tools.mul(
                      Tools.div(
                          Tools.mul(rewardSpeed, blocksPerDay),
                          totalStaked
                      ),
                      365
                  );
        // 用户质押量
        const userStaked = await newContract.methods.userStaked(Account).call();

        // 还有多少区块可领取本金;
        const unstakePeriod = await newContract.methods
            .unstakePeriod(Account)
            .call();

        // 什么时间可领取本金;
        const unstakePeriodTime = Tools.GT(userStaked, 0)
            ? Tools.plus(
                  Date.now(),
                  Tools.mul(Tools.mul(unstakePeriod, blocks), 1000)
              )
            : 0;

        // console.log(
        //     Tools.LT(userStaked, 0) ? 0 : unstakePeriod,
        //     '还有多少区块可领取本金',
        //     poolType,
        //     unstakePeriodTime,
        //     Date.now(),
        //     Tools.LE(unstakePeriodTime || 0, Date.now())
        // );

        // 可领取的奖励金额
        const rewardCurrents = await newContract.methods
            .rewardCurrent(Account)
            .call();

        // console.log(
        //     rewardCurrents,
        //     'rewardCurrents',
        //     Tools.numDivDecimals(rewardCurrents, 18)
        // );

        const Erc20Contract = new Contracts.eth.Contract(
            Erc20AddressAbi,
            DTCTAddress
        );

        const allowance = await Erc20Contract.methods
            .allowance(
                Account,
                poolType === 1 ? HighYieldPoolAddress : HighYieldPoolAddress2
            )
            .call();

        // console.log('授权金额', allowance);
        // console.log(
        //     Tools.GT(
        //         Tools.div(Tools.sub(unstakePeriodTime, Date.now()), 86400000),
        //         0
        //     )
        // );

        return {
            allowance: Tools.GT(allowance, 0),
            totalStaked: Tools.fmtDec(Tools.numDivDecimals(totalStaked, 18), 6),
            apy: Tools.fmtDec(Tools.mul(apy, 100), 2) || 0,
            userStaked: Tools.fmtDec(Tools.numDivDecimals(userStaked, 18), 6),
            unstakePeriodTime: Number(unstakePeriodTime),
            rewardCurrent: Tools.numDivDecimals(rewardCurrents, 18),
        };
    } catch (err) {
        console.log(err);
        return {
            allowance: false,
            totalStaked: 0,
            apy: 0,
            userStaked: 0,
            unstakePeriodTime: 0,
            rewardCurrent: 0,
        };
    }
}
