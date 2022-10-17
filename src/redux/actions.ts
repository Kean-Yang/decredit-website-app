import { SWITCH_NETWORK } from './actionTypes'

export const switchNetwork = (network: any) => ({
    type: SWITCH_NETWORK,
    payload: { network }
})