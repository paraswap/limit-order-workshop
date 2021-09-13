import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import { Box } from '@material-ui/core'

const StyledButton = styled(Button)`
    background-color: #f6851a;
    color: #fff;
    &:hover {
        background-color: #e4761b;
    }
`
const Address = styled.div`
    background-color: white;
    color: #f6851a;
    border: 2px solid #f6851a;
    border-radius: 20px;
    padding: 5px 2px;
    font-size: 1.1rem;
    text-align: center;
`

export const injected = new InjectedConnector({ supportedChainIds: [137] })

const formatAddress = (address: string) =>
    address.replace(/(.{9}).{3,}(.{7})/, '$1...$2')

export default function ConnectAccount() {
    const { account, activate } = useWeb3React<Web3Provider>()

    return (
        <Box justifyContent="center" alignItems="center" width={200}>
            {!account ? (
                <StyledButton
                    onClick={() => {
                        // TODO : activate the injected provider
                    }}
                >
                    Connect to MetaMask
                </StyledButton>
            ) : (
                <Address>{formatAddress(account)}</Address>
            )}
        </Box>
    )
}
