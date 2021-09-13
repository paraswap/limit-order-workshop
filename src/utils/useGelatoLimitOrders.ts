import { GelatoLimitOrders } from '@gelatonetwork/limit-orders-lib'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'

export function useGelatoLimitOrders() {
    const { account, library } = useWeb3React()
    return useMemo(() => {
        if (!account || !library) return

        return new GelatoLimitOrders(
            137,
            undefined, // TODO: pass signed
            'paraswap'
        )
    }, [account, library])
}
