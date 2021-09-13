import { useEffect, useState } from 'react'
import { Box, Button, MenuItem, Select, TextField } from '@material-ui/core'
import { ethers } from 'ethers'
import { useGelatoLimitOrders } from '../utils/useGelatoLimitOrders'
import tokensList from '../tokensList.json'
import { ParaSwap } from 'paraswap'
import { BigNumber } from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'

const useTokensList = () => {
    return tokensList.tokens
}

const useMarketRate = (
    srcToken: string,
    destToken: string,
    srcAmount: string | undefined
) => {
    const [rate, setRate] = useState<string | undefined>(undefined)

    useEffect(() => {
        const fetchRate = async () => {
            if (!srcAmount) return
            // TODO: grab rate from Paraswap and compute destAmount / srcAmount rate and set it
        }

        fetchRate()
    }, [srcToken, destToken, srcAmount, setRate])

    return rate
}

const useOnSubmitOrder = (
    srcTokenAddress: string,
    destTokenAddress: string,
    amount: string | undefined,
    minReturn: string | undefined
) => {
    const gelatoLimitOrders = useGelatoLimitOrders()

    return async () => {
        if (!gelatoLimitOrders || !amount || !minReturn) return

        // Amount to sell
        const inputAmount = ethers.utils.parseUnits(amount, '18')

        // Minimum amount of outTOken which the users wants to receive back
        const outputMinReturn = ethers.utils.parseUnits(minReturn, '18')

        if (srcTokenAddress !== '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
            await gelatoLimitOrders.approveTokenAmount(
                destTokenAddress,
                inputAmount
            )

        const tx = await gelatoLimitOrders.submitLimitOrder(
            srcTokenAddress, // Token to sell
            destTokenAddress, // Token to buy
            inputAmount, // amount to sell
            outputMinReturn // minimum amount received
        )

    }
}

function TokenInput({
    amount,
    tokenAddress,
    onTokenChange,
    onAmountChange,
}: {
    amount: string | undefined
    tokenAddress: string
    onTokenChange: (address: string) => void
    onAmountChange?: (amount: string) => void
}) {
    const tokensList = useTokensList()

    return (
        <Box flexDirection="row" margin={'20px 0'}>
            <Select
                value={tokenAddress}
                onChange={(event) =>
                    onTokenChange(event.target.value as string)
                }
            >
                {tokensList.map((token) => (
                    <MenuItem key={token.address} value={token.address}>
                        <img
                            src={token.logoURI}
                            alt={token.name}
                            height={40}
                            width={40}
                        />
                    </MenuItem>
                ))}
            </Select>
            <TextField
                value={amount}
                onChange={
                    onAmountChange &&
                    ((evt) => onAmountChange?.(evt.target.value))
                }
                style={{ width: '84%' }}
                variant="outlined"
            />
        </Box>
    )
}

export default function LimitOrder() {
    const [amount, setAmount] = useState<string>('1')
    const [srcTokenAddress, setSrcTokenAddress] = useState<string>(
        '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    )
    const [destTokenAddress, setDestTokenAddress] = useState<string>(
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
    )
    const [desiredRate, setDesiredRate] = useState<string>()
    const marketRate = undefined // TODO grab market rate from paraSwap
    const rate = desiredRate ?? marketRate

    const minReturn = !amount || !rate ? undefined : String(+amount * +rate)

    const onLimitOrder = undefined // TODO: grab submit callback

    const account = undefined // TODO: get your public address from metamask

    return (
        <Box width={400} justifyContent="center">
            <TokenInput
                amount={amount}
                onAmountChange={setAmount}
                tokenAddress={srcTokenAddress}
                onTokenChange={setSrcTokenAddress}
            />
            <TextField
                type="text"
                value={rate}
                onChange={(evt) => setDesiredRate(evt.target.value)}
                variant="outlined"
                fullWidth
            />
            <TokenInput
                amount={minReturn}
                tokenAddress={destTokenAddress}
                onTokenChange={setDestTokenAddress}
            />
            <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={onLimitOrder}
                disabled={false} // TODO: disable subbmit button if: account not connected, balance is isufficient
            >
                Submit sell order
            </Button>
        </Box>
    )
}
