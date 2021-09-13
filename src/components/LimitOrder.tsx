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

            const paraSwap = new ParaSwap(137)
            const priceRoute = await paraSwap.getRate(
                srcToken,
                destToken,
                new BigNumber(srcAmount).multipliedBy(10 ** 18).toString()
            )

            if ('message' in priceRoute) return
            const marketRate = new BigNumber(priceRoute.destAmount).div(
                priceRoute.srcAmount
            )

            setRate(marketRate.toFixed(5))
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

        console.log('>>>tx', tx)
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
    const marketRate = useMarketRate(srcTokenAddress, destTokenAddress, amount)
    const rate = desiredRate ?? marketRate

    const minReturn = !amount || !rate ? undefined : String(+amount * +rate)

    const onLimitOrder = useOnSubmitOrder(
        srcTokenAddress,
        destTokenAddress,
        amount,
        minReturn
    )

    const { account } = useWeb3React()

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
                disabled={!account}
            >
                Submit sell order
            </Button>
        </Box>
    )
}
