import { Order } from '@gelatonetwork/limit-orders-lib'
import { List, ListItem } from '@material-ui/core'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { useGelatoLimitOrders } from '../utils/useGelatoLimitOrders'
import tokensList from '../tokensList.json'
import BigNumber from 'bignumber.js'

const useOrders = (): Order[] | null => {
    const gelatoLimitOrders = useGelatoLimitOrders()
    const [orders, setOrders] = useState<Order[] | null>(null)
    const { account } = useWeb3React()

    useEffect(() => {
        const fetchOrders = async () => {
            // TODO: fetch orders from gelato
        }
        fetchOrders()
    }, [account, gelatoLimitOrders, setOrders])

    return orders
}

const tokenLogo = (address: string): string | undefined => {
    return tokensList.tokens.find(
        (t) => t.address.toLowerCase() === address.toLowerCase()
    )?.logoURI
}

const formatAmount = (amount: string) =>
    new BigNumber(amount).div(10 ** 18).toFixed(2)

const formatdate = (dateInSec: string) => {
    const date = new Date(parseInt(dateInSec, 10) * 1000)
    return date.toLocaleString()
}

export default function OrderHistory() {
    const orders = useOrders()
    return (
        <List>
            {orders &&
                orders.map((order) => (
                    <ListItem key={order.id}>
                        <span>
                            <img
                                src={tokenLogo(order.inputToken)}
                                alt=""
                                width={15}
                                height={15}
                            />{' '}
                            {formatAmount(order.inputAmount)}
                            <span> for </span>
                            <img
                                src={tokenLogo(order.outputToken)}
                                alt=""
                                width={15}
                                height={15}
                            />{' '}
                            {formatAmount(order.minReturn)}
                            <span>- {formatdate(order.createdAt)}</span>
                        </span>
                    </ListItem>
                ))}
        </List>
    )
}
